'use client';

import { useState, useTransition, FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { createContactRequest } from '@/lib/contact-requests/actions';
import type { ProjectType } from '@prisma/client';

interface ContactRequestFormProps {
  talentProfileId: string;
  talentName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PROJECT_TYPE_OPTIONS = [
  { value: 'FILM', label: 'Film' },
  { value: 'TV_SERIES', label: 'TV Series' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'THEATER', label: 'Theater' },
  { value: 'VOICE_OVER', label: 'Voice Over' },
  { value: 'MODELING', label: 'Modeling' },
  { value: 'OTHER', label: 'Other' },
];

const MIN_PURPOSE_LENGTH = 50;
const MAX_PURPOSE_LENGTH = 2000;
const MAX_MESSAGE_LENGTH = 1000;

export function ContactRequestForm({
  talentProfileId,
  talentName,
  onSuccess,
  onCancel,
}: ContactRequestFormProps) {
  const [projectType, setProjectType] = useState<ProjectType | ''>('');
  const [projectName, setProjectName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const purposeLength = purpose.length;
  const isValidPurpose = purposeLength >= MIN_PURPOSE_LENGTH && purposeLength <= MAX_PURPOSE_LENGTH;
  const canSubmit = projectType && isValidPurpose && !isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);

    startTransition(async () => {
      const result = await createContactRequest({
        talentProfileId,
        projectType: projectType as ProjectType,
        projectName: projectName.trim() || undefined,
        purpose: purpose.trim(),
        message: message.trim() || undefined,
      });

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to submit contact request');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center pb-4 border-b border-[var(--color-neutral-200)]">
        <h2 className="text-xl font-semibold text-[var(--color-neutral-900)]">
          Request Contact Information
        </h2>
        <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
          Request to connect with <span className="font-medium">{talentName}</span>
        </p>
      </div>

      {/* Project Type */}
      <Select
        label="Project Type"
        options={PROJECT_TYPE_OPTIONS}
        value={projectType}
        onChange={(e) => setProjectType(e.target.value as ProjectType)}
        placeholder="Select project type"
        required
        disabled={isPending}
      />

      {/* Project Name */}
      <Input
        label="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="e.g., 'The Last Summer' (optional)"
        disabled={isPending}
        helperText="The name of your project, if applicable"
      />

      {/* Purpose */}
      <div>
        <Textarea
          label="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Describe why you'd like to connect with this talent and what the opportunity involves..."
          required
          disabled={isPending}
          rows={5}
          maxLength={MAX_PURPOSE_LENGTH}
          error={
            purposeLength > 0 && purposeLength < MIN_PURPOSE_LENGTH
              ? `Please provide at least ${MIN_PURPOSE_LENGTH} characters (${purposeLength}/${MIN_PURPOSE_LENGTH})`
              : undefined
          }
        />
        <div className="mt-1 flex justify-between text-xs text-[var(--color-neutral-500)]">
          <span>
            {purposeLength < MIN_PURPOSE_LENGTH
              ? `Minimum ${MIN_PURPOSE_LENGTH} characters required`
              : 'Good length'}
          </span>
          <span
            className={
              purposeLength > MAX_PURPOSE_LENGTH * 0.9 ? 'text-[var(--color-warning)]' : ''
            }
          >
            {purposeLength}/{MAX_PURPOSE_LENGTH}
          </span>
        </div>
      </div>

      {/* Personal Message */}
      <Textarea
        label="Personal Message (Optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a personal note to make your request stand out..."
        disabled={isPending}
        rows={3}
        maxLength={MAX_MESSAGE_LENGTH}
        helperText="A brief personal message to the talent"
      />
      {message.length > 0 && (
        <div className="text-right text-xs text-[var(--color-neutral-500)]">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 bg-[var(--color-neutral-50)] rounded-[var(--radius-md)] border border-[var(--color-neutral-200)]">
        <p className="text-sm text-[var(--color-neutral-600)]">
          <span className="font-medium text-[var(--color-neutral-700)]">Privacy Notice:</span> Your
          contact information will be shared with the talent only if they approve your request. The
          talent&apos;s contact information will be revealed to you only upon approval.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-[var(--color-error-light)] border border-[var(--color-error)] rounded-[var(--radius-md)]">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[var(--color-neutral-200)]">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
