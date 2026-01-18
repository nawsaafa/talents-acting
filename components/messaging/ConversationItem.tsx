'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { ConversationPreview } from '@/lib/messaging/types';

interface ConversationItemProps {
  conversation: ConversationPreview;
  isActive?: boolean;
}

export function ConversationItem({ conversation, isActive = false }: ConversationItemProps) {
  const { id, otherParticipant, lastMessage, unreadCount, updatedAt } = conversation;

  // Truncate message preview
  const messagePreview = lastMessage
    ? lastMessage.content.length > 50
      ? `${lastMessage.content.substring(0, 50)}...`
      : lastMessage.content
    : 'No messages yet';

  // Format time
  const timeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });

  // Avatar initials fallback
  const initials = otherParticipant.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/messages/${id}`}
      className={`
        block p-4 border-b border-[var(--color-neutral-200)]
        transition-colors duration-[var(--transition-fast)]
        hover:bg-[var(--color-neutral-50)]
        ${isActive ? 'bg-[var(--color-primary-light)] bg-opacity-10' : ''}
        ${unreadCount > 0 ? 'bg-[var(--color-neutral-50)]' : ''}
      `.trim()}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {otherParticipant.photo ? (
            <img
              src={otherParticipant.photo}
              alt={otherParticipant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
              {initials}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`
                truncate text-base
                ${unreadCount > 0 ? 'font-semibold text-[var(--color-neutral-900)]' : 'font-medium text-[var(--color-neutral-700)]'}
              `.trim()}
            >
              {otherParticipant.name}
            </h3>
            <span className="flex-shrink-0 text-xs text-[var(--color-neutral-500)]">{timeAgo}</span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <p
              className={`
                truncate text-sm
                ${unreadCount > 0 ? 'text-[var(--color-neutral-800)]' : 'text-[var(--color-neutral-500)]'}
              `.trim()}
            >
              {messagePreview}
            </p>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="flex-shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-medium">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          {/* Role badge */}
          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]">
            {otherParticipant.role.toLowerCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}
