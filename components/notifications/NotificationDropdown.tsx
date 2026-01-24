'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { BellOff, ChevronRight } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { markAsRead } from '@/lib/notifications/actions';
import type { NotificationInfo } from '@/lib/notifications/types';

interface NotificationDropdownProps {
  notifications: NotificationInfo[];
  onClose?: () => void;
}

export function NotificationDropdown({ notifications, onClose }: NotificationDropdownProps) {
  const [, startTransition] = useTransition();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const handleMarkRead = (id: string) => {
    // Optimistic update
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date() } : n))
    );

    startTransition(async () => {
      await markAsRead(id);
    });
  };

  return (
    <div className="w-80 max-h-96 overflow-hidden flex flex-col bg-white rounded-lg shadow-xl border">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No new notifications</p>
          </div>
        ) : (
          <div className="py-2 px-2 space-y-1">
            {localNotifications.map((notification) => (
              <div key={notification.id} onClick={onClose}>
                <NotificationItem notification={notification} onMarkRead={handleMarkRead} compact />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t">
        <Link
          href="/notifications"
          onClick={onClose}
          className="flex items-center justify-center gap-1 px-4 py-3 text-sm text-blue-600 hover:bg-gray-50 transition-colors"
        >
          View all notifications
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
