'use server';

import { revalidatePath } from 'next/cache';
import { NotificationType } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth/utils';
import { log } from '@/lib/logger';
import {
  getNotificationsForUser,
  getUnreadNotificationCount,
  getRecentUnreadNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationPreferences,
  upsertNotificationPreferences,
} from './queries';
import { canMarkNotificationRead, validatePreferencesInput } from './access';
import type {
  NotificationsResult,
  NotificationPaginationOptions,
  NotificationInfo,
  UnreadCountResult,
  NotificationPreferences,
  UpdatePreferencesResult,
  ChannelPreferences,
  EventTypePreferences,
} from './types';

/**
 * Server action to get notifications for the current user.
 */
export async function getMyNotifications(
  options: NotificationPaginationOptions = {}
): Promise<NotificationsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        notifications: [],
        total: 0,
        hasMore: false,
      };
    }

    return await getNotificationsForUser(user.id, options);
  } catch (error) {
    log.error(
      'Failed to get notifications',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return {
      notifications: [],
      total: 0,
      hasMore: false,
    };
  }
}

/**
 * Server action to get unread notification count for the current user.
 */
export async function getMyUnreadCount(): Promise<UnreadCountResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { count: 0 };
    }

    return await getUnreadNotificationCount(user.id);
  } catch (error) {
    log.error(
      'Failed to get unread count',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { count: 0 };
  }
}

/**
 * Server action to get recent unread notifications for dropdown.
 */
export async function getMyRecentNotifications(limit: number = 5): Promise<NotificationInfo[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    return await getRecentUnreadNotifications(user.id, limit);
  } catch (error) {
    log.error(
      'Failed to get recent notifications',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return [];
  }
}

/**
 * Server action to mark a notification as read.
 */
export async function markAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get the notification
    const notification = await getNotificationById(notificationId);
    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }

    // Check access
    if (!canMarkNotificationRead(user.id, notification.recipientId, user.role)) {
      return { success: false, error: 'You can only mark your own notifications as read' };
    }

    // Mark as read
    await markNotificationAsRead(notificationId);

    // Revalidate cache
    revalidatePath('/notifications');

    return { success: true };
  } catch (error) {
    log.error(
      'Failed to mark notification as read',
      error instanceof Error ? error : new Error('Unknown error'),
      { notificationId }
    );
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

/**
 * Server action to mark all notifications as read for the current user.
 */
export async function markAllAsRead(): Promise<{
  success: boolean;
  count: number;
  error?: string;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, count: 0, error: 'You must be signed in' };
    }

    const count = await markAllNotificationsAsRead(user.id);

    // Revalidate cache
    revalidatePath('/notifications');

    log.info('Marked all notifications as read', { userId: user.id, count });

    return { success: true, count };
  } catch (error) {
    log.error(
      'Failed to mark all notifications as read',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { success: false, count: 0, error: 'Failed to mark notifications as read' };
  }
}

/**
 * Server action to get notification preferences for the current user.
 */
export async function getMyPreferences(): Promise<NotificationPreferences | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    return await getNotificationPreferences(user.id);
  } catch (error) {
    log.error(
      'Failed to get notification preferences',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return null;
  }
}

/**
 * Server action to update notification preferences for the current user.
 */
export async function updateMyPreferences(input: {
  enabled?: boolean;
  channels?: Partial<ChannelPreferences>;
  eventTypes?: Partial<EventTypePreferences>;
}): Promise<UpdatePreferencesResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Validate input
    const validation = validatePreferencesInput(input);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const preferences = await upsertNotificationPreferences(user.id, input);

    // Revalidate cache
    revalidatePath('/settings/notifications');

    log.info('Updated notification preferences', { userId: user.id });

    return { success: true, preferences };
  } catch (error) {
    log.error(
      'Failed to update notification preferences',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { success: false, error: 'Failed to update preferences' };
  }
}

/**
 * Server action to toggle a specific event type notification setting.
 */
export async function toggleEventTypeNotification(
  eventType: NotificationType,
  channel: 'inApp' | 'email',
  enabled: boolean
): Promise<UpdatePreferencesResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get current preferences
    const current = await getNotificationPreferences(user.id);
    const currentEventTypes = current?.eventTypes || {};
    const currentEventTypePrefs = currentEventTypes[eventType] || { inApp: true, email: true };

    // Update the specific channel for this event type
    const updatedEventTypes: Partial<EventTypePreferences> = {
      [eventType]: {
        ...currentEventTypePrefs,
        [channel]: enabled,
      },
    };

    const preferences = await upsertNotificationPreferences(user.id, {
      eventTypes: updatedEventTypes,
    });

    // Revalidate cache
    revalidatePath('/settings/notifications');

    return { success: true, preferences };
  } catch (error) {
    log.error(
      'Failed to toggle event type notification',
      error instanceof Error ? error : new Error('Unknown error'),
      { eventType, channel, enabled }
    );
    return { success: false, error: 'Failed to update preference' };
  }
}

/**
 * Server action to toggle global notification enabled setting.
 */
export async function toggleNotificationsEnabled(
  enabled: boolean
): Promise<UpdatePreferencesResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    const preferences = await upsertNotificationPreferences(user.id, { enabled });

    // Revalidate cache
    revalidatePath('/settings/notifications');

    return { success: true, preferences };
  } catch (error) {
    log.error(
      'Failed to toggle notifications enabled',
      error instanceof Error ? error : new Error('Unknown error'),
      { enabled }
    );
    return { success: false, error: 'Failed to update preference' };
  }
}

/**
 * Server action to toggle a channel preference.
 */
export async function toggleChannelPreference(
  channel: 'inApp' | 'email',
  enabled: boolean
): Promise<UpdatePreferencesResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    const preferences = await upsertNotificationPreferences(user.id, {
      channels: { [channel]: enabled },
    });

    // Revalidate cache
    revalidatePath('/settings/notifications');

    return { success: true, preferences };
  } catch (error) {
    log.error(
      'Failed to toggle channel preference',
      error instanceof Error ? error : new Error('Unknown error'),
      { channel, enabled }
    );
    return { success: false, error: 'Failed to update preference' };
  }
}
