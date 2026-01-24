'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';
import { checkCanMessage, sendMessage } from '@/lib/messaging/actions';
import type { MessagingAccessResult } from '@/lib/messaging/types';

interface ContactButtonProps {
  talentId: string;
  talentName: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ContactButton({
  talentId,
  talentName,
  className = '',
  variant = 'primary',
  size = 'md',
  showLabel = true,
}: ContactButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [accessResult, setAccessResult] = useState<MessagingAccessResult | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await checkCanMessage(talentId);
      setAccessResult(result);
      setShowModal(true);
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const result = await sendMessage(talentId, message.trim());

      if (result.success && result.conversationId) {
        setShowModal(false);
        setMessage('');
        router.push(`/messages/${result.conversationId}`);
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setMessage('');
    setError(null);
    setAccessResult(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        isLoading={isPending}
        leftIcon={<MessageSquare className="h-4 w-4" />}
        className={className}
      >
        {showLabel && 'Contact'}
      </Button>

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={accessResult?.canSend ? `Message ${talentName}` : 'Cannot Send Message'}
      >
        {accessResult?.requiresSubscription ? (
          <UpgradePrompt
            title="Subscription Required"
            message={accessResult.reason || 'A subscription is required to contact talents.'}
            showFeatures={false}
            variant="card"
          />
        ) : accessResult?.canSend ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-neutral-600)]">
              Send a message to start a conversation with {talentName}.
            </p>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5"
              >
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${talentName}, I'd like to discuss a potential opportunity...`}
                rows={4}
                className={`
                  w-full px-3 py-2
                  border rounded-[var(--radius-md)]
                  text-[var(--color-neutral-900)]
                  placeholder:text-[var(--color-neutral-400)]
                  resize-none
                  transition-colors duration-[var(--transition-fast)]
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${
                    error
                      ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
                      : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary)]'
                  }
                `.trim()}
              />
              {error && <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={handleClose} disabled={isSending}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSendMessage}
                isLoading={isSending}
                disabled={!message.trim()}
              >
                Send Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[var(--color-neutral-400)]" />
            </div>
            <p className="text-[var(--color-neutral-600)]">
              {accessResult?.reason || 'You cannot send messages at this time.'}
            </p>
            <div className="mt-4">
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
