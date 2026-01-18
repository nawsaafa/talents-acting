'use client';

import { formatDistanceToNow, format } from 'date-fns';
import type { MessageInfo } from '@/lib/messaging/types';

interface MessageItemProps {
  message: MessageInfo;
  isOwnMessage: boolean;
  senderName?: string;
  showTimestamp?: boolean;
}

export function MessageItem({
  message,
  isOwnMessage,
  senderName,
  showTimestamp = true,
}: MessageItemProps) {
  const { content, createdAt, readAt } = message;

  // Format time - show relative for recent, absolute for older
  const messageDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  const timeDisplay =
    hoursDiff < 24
      ? formatDistanceToNow(messageDate, { addSuffix: true })
      : format(messageDate, 'MMM d, h:mm a');

  return (
    <div
      className={`
        flex flex-col mb-3
        ${isOwnMessage ? 'items-end' : 'items-start'}
      `.trim()}
    >
      {/* Sender name for received messages */}
      {!isOwnMessage && senderName && (
        <span className="text-xs text-[var(--color-neutral-500)] mb-1 ml-1">{senderName}</span>
      )}

      {/* Message bubble */}
      <div
        className={`
          max-w-[75%] px-4 py-2.5 rounded-2xl
          ${
            isOwnMessage
              ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] rounded-bl-sm'
          }
        `.trim()}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
      </div>

      {/* Timestamp and read status */}
      {showTimestamp && (
        <div
          className={`
            flex items-center gap-1.5 mt-1 text-xs text-[var(--color-neutral-500)]
            ${isOwnMessage ? 'mr-1' : 'ml-1'}
          `.trim()}
        >
          <span>{timeDisplay}</span>
          {isOwnMessage && (
            <span className="text-[10px]">
              {readAt ? (
                <span title="Read">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--color-success)]"
                  >
                    <path d="M18 6 7 17l-5-5" />
                    <path d="m22 10-7.5 7.5L13 16" />
                  </svg>
                </span>
              ) : (
                <span title="Sent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
