import { Role, NotificationType } from '@prisma/client';
import { isAdminRole } from '@/lib/access/control';
import type {
  NotificationContext,
  NotificationAccessResult,
  NotificationPreferences,
  ChannelPreferences,
  LastEmailSentAt,
} from './types';

// Default channel preferences for new users
export const DEFAULT_CHANNEL_PREFERENCES: ChannelPreferences = {
  inApp: true,
  email: true,
};

// Rate limit: minimum time between emails of same type (1 hour in ms)
export const EMAIL_RATE_LIMIT_MS = 60 * 60 * 1000;

/**
 * Check if a user can view a notification.
 * Rules:
 * - Admins can view all notifications
 * - Users can only view their own notifications
 */
export function canViewNotification(
  userId: string,
  recipientId: string,
  role: Role
): NotificationAccessResult {
  // Admins can view all notifications
  if (isAdminRole(role)) {
    return {
      canView: true,
      canMarkRead: true,
      reason: 'Admin access',
    };
  }

  // Users can only view their own notifications
  if (userId === recipientId) {
    return {
      canView: true,
      canMarkRead: true,
      reason: 'Own notification',
    };
  }

  return {
    canView: false,
    canMarkRead: false,
    reason: 'You can only view your own notifications',
  };
}

/**
 * Check if a user can mark a notification as read.
 * Rules:
 * - Admins can mark any notification as read
 * - Users can only mark their own notifications as read
 */
export function canMarkNotificationRead(userId: string, recipientId: string, role: Role): boolean {
  // Admins can mark any notification
  if (isAdminRole(role)) {
    return true;
  }

  // Users can only mark their own notifications
  return userId === recipientId;
}

/**
 * Check if in-app notification should be sent based on preferences.
 * Rules:
 * - Check global enabled flag
 * - Check channel preference for inApp
 * - Check event type specific preference if set
 */
export function shouldSendInAppNotification(
  preferences: NotificationPreferences | null,
  type: NotificationType
): boolean {
  // If no preferences exist, use defaults (enabled)
  if (!preferences) {
    return true;
  }

  // Check global enabled flag
  if (!preferences.enabled) {
    return false;
  }

  // Check channel preference
  if (!preferences.channels.inApp) {
    return false;
  }

  // Check event type specific preference if set
  const eventTypePrefs = preferences.eventTypes[type];
  if (eventTypePrefs && eventTypePrefs.inApp === false) {
    return false;
  }

  return true;
}

/**
 * Check if email notification should be sent based on preferences and rate limiting.
 * Rules:
 * - Check global enabled flag
 * - Check channel preference for email
 * - Check event type specific preference if set
 * - Check rate limiting (max 1 email per type per hour)
 */
export function shouldSendEmailNotification(
  preferences: NotificationPreferences | null,
  type: NotificationType
): { shouldSend: boolean; reason?: string } {
  // If no preferences exist, use defaults (enabled)
  if (!preferences) {
    return { shouldSend: true };
  }

  // Check global enabled flag
  if (!preferences.enabled) {
    return { shouldSend: false, reason: 'Notifications disabled' };
  }

  // Check channel preference
  if (!preferences.channels.email) {
    return { shouldSend: false, reason: 'Email notifications disabled' };
  }

  // Check event type specific preference if set
  const eventTypePrefs = preferences.eventTypes[type];
  if (eventTypePrefs && eventTypePrefs.email === false) {
    return { shouldSend: false, reason: `Email disabled for ${type} notifications` };
  }

  // Check rate limiting
  const lastSentStr = preferences.lastEmailSentAt[type];
  if (lastSentStr) {
    const lastSent = new Date(lastSentStr).getTime();
    const now = Date.now();
    if (now - lastSent < EMAIL_RATE_LIMIT_MS) {
      const remainingMs = EMAIL_RATE_LIMIT_MS - (now - lastSent);
      const remainingMin = Math.ceil(remainingMs / 60000);
      return {
        shouldSend: false,
        reason: `Rate limited - next email in ${remainingMin} minutes`,
      };
    }
  }

  return { shouldSend: true };
}

/**
 * Get updated lastEmailSentAt after sending an email.
 */
export function updateLastEmailSent(
  current: LastEmailSentAt,
  type: NotificationType
): LastEmailSentAt {
  return {
    ...current,
    [type]: new Date().toISOString(),
  };
}

/**
 * Build notification context from user session data.
 */
export function buildNotificationContext(user: {
  id: string;
  notificationId?: string;
}): NotificationContext {
  return {
    userId: user.id,
    notificationId: user.notificationId,
  };
}

/**
 * Check if a notification type requires subscription.
 * Some notification types are only relevant for subscribed users.
 */
export function requiresSubscription(type: NotificationType): boolean {
  // MESSAGE and COLLECTION_SHARE are features requiring subscription
  // SYSTEM and CONTACT_REQUEST can be sent to anyone
  switch (type) {
    case 'MESSAGE':
    case 'COLLECTION_SHARE':
      return true;
    case 'SYSTEM':
    case 'CONTACT_REQUEST':
      return false;
    default:
      return false;
  }
}

/**
 * Validate notification preferences input.
 */
export function validatePreferencesInput(input: {
  enabled?: boolean;
  channels?: Partial<ChannelPreferences>;
  eventTypes?: Record<string, Partial<ChannelPreferences>>;
}): { valid: boolean; error?: string } {
  // Validate channels if provided
  if (input.channels) {
    if (typeof input.channels.inApp !== 'undefined' && typeof input.channels.inApp !== 'boolean') {
      return { valid: false, error: 'channels.inApp must be a boolean' };
    }
    if (typeof input.channels.email !== 'undefined' && typeof input.channels.email !== 'boolean') {
      return { valid: false, error: 'channels.email must be a boolean' };
    }
  }

  // Validate eventTypes if provided
  if (input.eventTypes) {
    const validTypes: NotificationType[] = [
      'MESSAGE',
      'COLLECTION_SHARE',
      'SYSTEM',
      'CONTACT_REQUEST',
    ];
    for (const [type, prefs] of Object.entries(input.eventTypes)) {
      if (!validTypes.includes(type as NotificationType)) {
        return { valid: false, error: `Invalid notification type: ${type}` };
      }
      if (prefs) {
        if (typeof prefs.inApp !== 'undefined' && typeof prefs.inApp !== 'boolean') {
          return { valid: false, error: `eventTypes.${type}.inApp must be a boolean` };
        }
        if (typeof prefs.email !== 'undefined' && typeof prefs.email !== 'boolean') {
          return { valid: false, error: `eventTypes.${type}.email must be a boolean` };
        }
      }
    }
  }

  return { valid: true };
}
