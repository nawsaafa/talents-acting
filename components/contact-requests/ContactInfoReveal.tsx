'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getRequestContactInfo } from '@/lib/contact-requests/actions';
import type { RevealedContactInfo } from '@/lib/contact-requests/types';

interface ContactInfoRevealProps {
  requestId: string;
  talentName: string;
  isApproved: boolean;
}

export function ContactInfoReveal({ requestId, talentName, isApproved }: ContactInfoRevealProps) {
  const [contactInfo, setContactInfo] = useState<RevealedContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const loadContactInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const info = await getRequestContactInfo(requestId);
      if (info) {
        setContactInfo(info);
      } else {
        setError('Unable to load contact information');
      }
    } catch {
      setError('Failed to load contact information');
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (isApproved) {
      loadContactInfo();
    }
  }, [isApproved, loadContactInfo]);

  const copyToClipboard = async (value: string, field: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  if (!isApproved) {
    return (
      <div className="p-4 bg-[var(--color-neutral-50)] rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)]">
        <p className="text-sm text-[var(--color-neutral-600)]">
          Contact information will be available once your request is approved.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)]">
        <div className="flex items-center justify-center gap-2 text-[var(--color-neutral-600)]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading contact information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[var(--color-error-light)] rounded-[var(--radius-lg)] border border-[var(--color-error)]">
        <p className="text-sm text-[var(--color-error)]">{error}</p>
        <Button variant="outline" size="sm" onClick={loadContactInfo} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  if (!contactInfo || (!contactInfo.email && !contactInfo.phone)) {
    return (
      <div className="p-4 bg-[var(--color-warning-light)] rounded-[var(--radius-lg)] border border-[var(--color-warning)]">
        <p className="text-sm text-[var(--color-warning)]">
          No contact information available for this talent.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[var(--color-success-light)] border-b border-[var(--color-success)]">
        <h3 className="font-semibold text-[var(--color-success)]">
          Contact Information for {talentName}
        </h3>
        <p className="text-sm text-[var(--color-neutral-600)] mt-1">
          Your request was approved. You can now reach out directly.
        </p>
      </div>

      {/* Contact Details */}
      <div className="p-4 space-y-4">
        {/* Email */}
        {contactInfo.email && (
          <div className="flex items-center justify-between p-3 bg-[var(--color-neutral-50)] rounded-[var(--radius-md)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-neutral-500)] uppercase tracking-wide">
                  Email
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-[var(--color-primary)] hover:underline font-medium"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(contactInfo.email!, 'email')}
                className="h-8 w-8 p-0"
                title="Copy email"
              >
                {copiedField === 'email' ? (
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center justify-center h-8 w-8 rounded-[var(--radius-md)] hover:bg-[var(--color-neutral-200)] transition-colors"
                title="Open email client"
              >
                <ExternalLink className="w-4 h-4 text-[var(--color-neutral-600)]" />
              </a>
            </div>
          </div>
        )}

        {/* Phone */}
        {contactInfo.phone && (
          <div className="flex items-center justify-between p-3 bg-[var(--color-neutral-50)] rounded-[var(--radius-md)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                <Phone className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-neutral-500)] uppercase tracking-wide">
                  Phone
                </p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-[var(--color-primary)] hover:underline font-medium"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(contactInfo.phone!, 'phone')}
                className="h-8 w-8 p-0"
                title="Copy phone number"
              >
                {copiedField === 'phone' ? (
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center justify-center h-8 w-8 rounded-[var(--radius-md)] hover:bg-[var(--color-neutral-200)] transition-colors"
                title="Call"
              >
                <ExternalLink className="w-4 h-4 text-[var(--color-neutral-600)]" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-[var(--color-neutral-50)] border-t border-[var(--color-neutral-200)]">
        <p className="text-xs text-[var(--color-neutral-500)]">
          Please be professional and respectful when contacting the talent.
        </p>
      </div>
    </div>
  );
}
