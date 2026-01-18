'use client';

import { useState, useRef, useTransition, FormEvent, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { sendMessage } from '@/lib/messaging/actions';

interface ComposeMessageProps {
  recipientId: string;
  conversationId?: string;
  placeholder?: string;
  onMessageSent?: (conversationId: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

const MAX_MESSAGE_LENGTH = 5000;

export function ComposeMessage({
  recipientId,
  conversationId,
  placeholder = 'Type your message...',
  onMessageSent,
  disabled = false,
  disabledReason,
}: ComposeMessageProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = content.trim().length > 0 && !disabled && !isPending;

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!canSend) return;

    setError(null);

    startTransition(async () => {
      const result = await sendMessage(recipientId, content.trim(), conversationId);

      if (result.success) {
        setContent('');
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        if (onMessageSent && result.conversationId) {
          onMessageSent(result.conversationId);
        }
      } else {
        setError(result.error || 'Failed to send message');
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - content.length;
  const showCharCount = content.length > MAX_MESSAGE_LENGTH * 0.8;

  return (
    <div className="border-t border-[var(--color-neutral-200)] bg-white p-4">
      {disabled && disabledReason && (
        <div className="mb-3 px-3 py-2 text-sm text-[var(--color-neutral-600)] bg-[var(--color-neutral-100)] rounded-[var(--radius-md)]">
          {disabledReason}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={disabled ? disabledReason || placeholder : placeholder}
            disabled={disabled || isPending}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            className={`
              w-full px-4 py-3 pr-12
              border rounded-[var(--radius-lg)]
              text-[var(--color-neutral-900)]
              placeholder:text-[var(--color-neutral-400)]
              resize-none
              transition-colors duration-[var(--transition-fast)]
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
              ${
                error
                  ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
                  : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary)]'
              }
            `.trim()}
            aria-label="Message"
          />

          {/* Character count */}
          {showCharCount && (
            <span
              className={`
                absolute right-3 bottom-3 text-xs
                ${remainingChars < 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-neutral-400)]'}
              `.trim()}
            >
              {remainingChars}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="h-[46px] w-[46px] p-0 flex-shrink-0"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </form>

      {error && <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>}

      <p className="mt-2 text-xs text-[var(--color-neutral-400)]">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
