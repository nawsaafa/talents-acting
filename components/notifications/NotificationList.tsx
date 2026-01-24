'use client';

import { useState, useTransition } from 'react';
import { BellOff, CheckCheck } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Button, Select } from '@/components/ui';
import { markAsRead, markAllAsRead } from '@/lib/notifications/actions';
import type { NotificationInfo } from '@/lib/notifications/types';

interface NotificationListProps {
  notifications: NotificationInfo[];
  total: number;
  hasMore: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'MESSAGE', label: 'Messages' },
  { value: 'COLLECTION_SHARE', label: 'Collections' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'CONTACT_REQUEST', label: 'Contact Requests' },
];

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'unread', label: 'Unread Only' },
  { value: 'read', label: 'Read Only' },
];

export function NotificationList({
  notifications: initialNotifications,
  total,
  hasMore,
  onLoadMore,
  isLoading = false,
}: NotificationListProps) {
  const [isPending, startTransition] = useTransition();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter notifications locally
  const filteredNotifications = notifications.filter((n) => {
    if (typeFilter && n.type !== typeFilter) return false;
    if (statusFilter === 'unread' && n.readAt) return false;
    if (statusFilter === 'read' && !n.readAt) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const handleMarkRead = (id: string) => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date() } : n)));

    startTransition(async () => {
      await markAsRead(id);
    });
  };

  const handleMarkAllRead = () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date() })));

    startTransition(async () => {
      await markAllAsRead();
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-40"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-32"
          />
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="py-12 text-center">
          <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {notifications.length === 0
              ? 'No notifications yet'
              : 'No notifications match your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        Showing {filteredNotifications.length} of {total} notifications
      </div>
    </div>
  );
}
