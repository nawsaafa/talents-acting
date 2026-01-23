'use client';

import { useState, useTransition } from 'react';
import { Bell, Mail, MessageSquare, FolderOpen, UserPlus } from 'lucide-react';
import { NotificationType } from '@prisma/client';
import { Card, Button } from '@/components/ui';
import {
  toggleNotificationsEnabled,
  toggleChannelPreference,
  toggleEventTypeNotification,
} from '@/lib/notifications/actions';
import type { NotificationPreferences as PreferencesType } from '@/lib/notifications/types';
import { cn } from '@/lib/utils';

interface NotificationPreferencesProps {
  preferences: PreferencesType | null;
}

const eventTypes: {
  type: NotificationType;
  label: string;
  description: string;
  icon: typeof MessageSquare;
}[] = [
  {
    type: 'MESSAGE',
    label: 'Messages',
    description: 'New messages from other users',
    icon: MessageSquare,
  },
  {
    type: 'COLLECTION_SHARE',
    label: 'Collection Shares',
    description: 'When someone shares a collection with you',
    icon: FolderOpen,
  },
  {
    type: 'CONTACT_REQUEST',
    label: 'Contact Requests',
    description: 'New contact requests from professionals',
    icon: UserPlus,
  },
  {
    type: 'SYSTEM',
    label: 'System Notifications',
    description: 'Important platform updates and announcements',
    icon: Bell,
  },
];

export function NotificationPreferences({
  preferences: initialPreferences,
}: NotificationPreferencesProps) {
  const [isPending, startTransition] = useTransition();
  const [preferences, setPreferences] = useState<PreferencesType | null>(initialPreferences);

  // Get effective preferences (defaults if null)
  const enabled = preferences?.enabled ?? true;
  const inAppEnabled = preferences?.channels?.inApp ?? true;
  const emailEnabled = preferences?.channels?.email ?? true;

  const getEventTypePrefs = (type: NotificationType) => {
    const typePrefs = preferences?.eventTypes?.[type];
    return {
      inApp: typePrefs?.inApp ?? true,
      email: typePrefs?.email ?? true,
    };
  };

  const handleToggleEnabled = (newEnabled: boolean) => {
    setPreferences((prev) => (prev ? { ...prev, enabled: newEnabled } : prev));
    startTransition(async () => {
      const result = await toggleNotificationsEnabled(newEnabled);
      if (result.preferences) {
        setPreferences(result.preferences);
      }
    });
  };

  const handleToggleChannel = (channel: 'inApp' | 'email', enabled: boolean) => {
    setPreferences((prev) =>
      prev
        ? {
            ...prev,
            channels: { ...prev.channels, [channel]: enabled },
          }
        : prev
    );
    startTransition(async () => {
      const result = await toggleChannelPreference(channel, enabled);
      if (result.preferences) {
        setPreferences(result.preferences);
      }
    });
  };

  const handleToggleEventType = (
    type: NotificationType,
    channel: 'inApp' | 'email',
    enabled: boolean
  ) => {
    setPreferences((prev) => {
      if (!prev) return prev;
      const currentTypePrefs = prev.eventTypes[type] || { inApp: true, email: true };
      return {
        ...prev,
        eventTypes: {
          ...prev.eventTypes,
          [type]: { ...currentTypePrefs, [channel]: enabled },
        },
      };
    });
    startTransition(async () => {
      const result = await toggleEventTypeNotification(type, channel, enabled);
      if (result.preferences) {
        setPreferences(result.preferences);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Global Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">Enable or disable all notifications</p>
          </div>
          <ToggleSwitch checked={enabled} onChange={handleToggleEnabled} disabled={isPending} />
        </div>
      </Card>

      {/* Channel Preferences */}
      <Card className={cn('p-6', !enabled && 'opacity-50 pointer-events-none')}>
        <h3 className="font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">In-App Notifications</p>
                <p className="text-sm text-gray-500">Show notifications in the app</p>
              </div>
            </div>
            <ToggleSwitch
              checked={inAppEnabled}
              onChange={(checked) => handleToggleChannel('inApp', checked)}
              disabled={isPending || !enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive notifications via email (max 1 per hour per type)
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={emailEnabled}
              onChange={(checked) => handleToggleChannel('email', checked)}
              disabled={isPending || !enabled}
            />
          </div>
        </div>
      </Card>

      {/* Event Type Preferences */}
      <Card className={cn('p-6', !enabled && 'opacity-50 pointer-events-none')}>
        <h3 className="font-semibold text-gray-900 mb-4">Notification Types</h3>
        <p className="text-sm text-gray-500 mb-6">
          Choose which types of notifications you want to receive
        </p>

        <div className="space-y-6">
          {eventTypes.map(({ type, label, description, icon: Icon }) => {
            const prefs = getEventTypePrefs(type);
            return (
              <div key={type} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </div>

                <div className="ml-13 grid grid-cols-2 gap-4 ml-[52px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.inApp && inAppEnabled}
                      onChange={(e) => handleToggleEventType(type, 'inApp', e.target.checked)}
                      disabled={isPending || !enabled || !inAppEnabled}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">In-app</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.email && emailEnabled}
                      onChange={(e) => handleToggleEventType(type, 'email', e.target.checked)}
                      disabled={isPending || !enabled || !emailEnabled}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Email</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// Simple toggle switch component
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-blue-600' : 'bg-gray-200',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}
