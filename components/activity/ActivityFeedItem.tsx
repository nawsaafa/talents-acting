import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityItem } from '@/lib/activity/types';

interface ActivityFeedItemProps {
  item: ActivityItem;
  onMarkAsRead?: (id: string) => void;
}

// Activity type icon SVGs
const activityIcons: Record<string, React.ReactNode> = {
  MESSAGE: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  CONTACT_REQUEST: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  ),
  COLLECTION: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
  NOTIFICATION: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
};

// Activity type colors
const activityColors: Record<string, { bg: string; icon: string }> = {
  MESSAGE: { bg: 'bg-blue-100', icon: 'text-blue-600' },
  CONTACT_REQUEST: { bg: 'bg-purple-100', icon: 'text-purple-600' },
  COLLECTION: { bg: 'bg-amber-100', icon: 'text-amber-600' },
  NOTIFICATION: { bg: 'bg-green-100', icon: 'text-green-600' },
};

// Contact request status badges
const requestStatusBadges: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
  DECLINED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
  CANCELLED: { bg: 'bg-zinc-100', text: 'text-zinc-800', label: 'Cancelled' },
};

export function ActivityFeedItem({ item, onMarkAsRead }: ActivityFeedItemProps) {
  const colors = activityColors[item.type] || activityColors.NOTIFICATION;
  const icon = activityIcons[item.type] || activityIcons.NOTIFICATION;

  const handleClick = () => {
    if (!item.isRead && onMarkAsRead) {
      onMarkAsRead(item.id);
    }
  };

  const content = (
    <div
      className={`flex gap-4 rounded-lg border p-4 transition-colors ${
        item.isRead ? 'border-zinc-200 bg-white' : 'border-blue-200 bg-blue-50/50'
      } hover:border-zinc-300 hover:shadow-sm`}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.icon}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium ${item.isRead ? 'text-zinc-900' : 'text-zinc-900'}`}>
              {item.title}
            </p>
            <p className="mt-0.5 text-sm text-zinc-600 line-clamp-2">{item.description}</p>
          </div>

          {/* Unread indicator */}
          {!item.isRead && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
        </div>

        {/* Metadata row */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          {/* Actor info */}
          {item.actorName && (
            <span className="flex items-center gap-1">
              {item.actorPhoto ? (
                <img
                  src={item.actorPhoto}
                  alt={item.actorName}
                  className="h-4 w-4 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-medium text-zinc-600">
                  {item.actorName.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{item.actorName}</span>
            </span>
          )}

          {/* Contact request status badge */}
          {item.metadata?.requestStatus && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                requestStatusBadges[item.metadata.requestStatus]?.bg || 'bg-zinc-100'
              } ${requestStatusBadges[item.metadata.requestStatus]?.text || 'text-zinc-800'}`}
            >
              {requestStatusBadges[item.metadata.requestStatus]?.label ||
                item.metadata.requestStatus}
            </span>
          )}

          {/* Project type badge */}
          {item.metadata?.projectType && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
              {formatProjectType(item.metadata.projectType)}
            </span>
          )}

          {/* Collection talent count */}
          {item.metadata?.talentCount !== undefined && (
            <span className="text-zinc-500">
              {item.metadata.talentCount} talent{item.metadata.talentCount !== 1 ? 's' : ''}
            </span>
          )}

          {/* Timestamp */}
          <span className="ml-auto">
            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );

  // Wrap with link if actionLink provided
  if (item.actionLink) {
    return (
      <Link href={item.actionLink} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

// Format project type for display
function formatProjectType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
