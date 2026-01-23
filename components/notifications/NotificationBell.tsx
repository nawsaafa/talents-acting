'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { getMyUnreadCount, getMyRecentNotifications } from '@/lib/notifications/actions';
import { cn } from '@/lib/utils';
import type { NotificationInfo } from '@/lib/notifications/types';

// Polling interval for notifications (30 seconds)
const POLL_INTERVAL = 30000;

interface NotificationBellProps {
  initialCount?: number;
}

export function NotificationBell({ initialCount = 0 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await getMyUnreadCount();
      setUnreadCount(result.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Fetch recent notifications for dropdown
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMyRecentNotifications(5);
      setNotifications(result);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll for new notifications
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Refresh count after closing (user may have read some)
    fetchUnreadCount();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={cn(
          'relative p-2 rounded-lg transition-colors',
          isOpen
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs font-medium text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          {isLoading ? (
            <div className="w-80 bg-white rounded-lg shadow-xl border p-8 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ) : (
            <NotificationDropdown notifications={notifications} onClose={handleClose} />
          )}
        </div>
      )}
    </div>
  );
}
