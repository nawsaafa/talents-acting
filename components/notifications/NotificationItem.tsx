'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, FolderOpen, Bell, UserPlus, Check } from 'lucide-react';
import { NotificationType } from '@prisma/client';
import { cn } from '@/lib/utils';
import type { NotificationInfo } from '@/lib/notifications/types';

interface NotificationItemProps {
  notification: NotificationInfo;
  onMarkRead?: (id: string) => void;
  compact?: boolean;
}

const typeIcons: Record<NotificationType, typeof MessageSquare> = {
  MESSAGE: MessageSquare,
  COLLECTION_SHARE: FolderOpen,
  SYSTEM: Bell,
  CONTACT_REQUEST: UserPlus,
};

const typeColors: Record<NotificationType, string> = {
  MESSAGE: 'bg-blue-100 text-blue-600',
  COLLECTION_SHARE: 'bg-purple-100 text-purple-600',
  SYSTEM: 'bg-gray-100 text-gray-600',
  CONTACT_REQUEST: 'bg-green-100 text-green-600',
};

export function NotificationItem({
  notification,
  onMarkRead,
  compact = false,
}: NotificationItemProps) {
  const Icon = typeIcons[notification.type];
  const colorClasses = typeColors[notification.type];
  const isUnread = !notification.readAt;

  const handleClick = () => {
    if (isUnread && onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  const content = (
    <div
      className={cn(
        'group flex gap-3 p-3 rounded-lg transition-colors cursor-pointer',
        isUnread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50',
        compact && 'p-2'
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 rounded-full flex items-center justify-center',
          colorClasses,
          compact ? 'w-8 h-8' : 'w-10 h-10'
        )}
      >
        <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'text-gray-900 line-clamp-1',
                compact ? 'text-sm' : 'text-base font-medium',
                isUnread && 'font-semibold'
              )}
            >
              {notification.title}
            </p>
            {notification.senderName && (
              <p className="text-xs text-gray-500 mt-0.5">From {notification.senderName}</p>
            )}
          </div>
          {isUnread && <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />}
        </div>
        <p className={cn('text-gray-600 line-clamp-2 mt-1', compact ? 'text-xs' : 'text-sm')}>
          {notification.content}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Mark read button */}
      {isUnread && onMarkRead && !compact && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMarkRead(notification.id);
          }}
          className="flex-shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity"
          title="Mark as read"
        >
          <Check className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );

  if (notification.actionLink) {
    return (
      <Link href={notification.actionLink} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
