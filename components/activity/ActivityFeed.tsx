'use client';

import { useState, useTransition } from 'react';
import { ActivityFeedItem } from './ActivityFeedItem';
import type { ActivityItem, ActivityType } from '@/lib/activity/types';

interface ActivityFeedProps {
  items: ActivityItem[];
  emptyMessage?: string;
  showFilters?: boolean;
  showLoadMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onMarkAsRead?: (id: string) => void;
}

const filterOptions: { value: ActivityType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Activity' },
  { value: 'MESSAGE', label: 'Messages' },
  { value: 'CONTACT_REQUEST', label: 'Requests' },
  { value: 'COLLECTION', label: 'Collections' },
  { value: 'NOTIFICATION', label: 'Notifications' },
];

export function ActivityFeed({
  items,
  emptyMessage = 'No recent activity',
  showFilters = false,
  showLoadMore = false,
  hasMore = false,
  onLoadMore,
  onMarkAsRead,
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<ActivityType | 'ALL'>('ALL');
  const [isPending, startTransition] = useTransition();

  // Filter items based on selected type
  const filteredItems = filter === 'ALL' ? items : items.filter((item) => item.type === filter);

  const handleLoadMore = () => {
    if (onLoadMore) {
      startTransition(() => {
        onLoadMore();
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Activity list */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <ActivityFeedItem key={item.id} item={item} onMarkAsRead={onMarkAsRead} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-500">{emptyMessage}</p>
        </div>
      )}

      {/* Load more button */}
      {showLoadMore && hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              'Load more'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
