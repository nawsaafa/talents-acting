import { db } from '@/lib/db';
import { NotificationType } from '@prisma/client';
import type {
  NotificationInfo,
  NotificationPaginationOptions,
  NotificationsResult,
  NotificationPreferences,
  ChannelPreferences,
  EventTypePreferences,
  LastEmailSentAt,
  UnreadCountResult,
} from './types';
import { DEFAULT_CHANNEL_PREFERENCES } from './access';

const DEFAULT_NOTIFICATION_LIMIT = 20;

/**
 * Get user's display name based on their role and profile
 */
async function getUserDisplayInfo(userId: string): Promise<{
  name: string;
  photo: string | null;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      talentProfile: { select: { firstName: true, lastName: true, photo: true } },
      professionalProfile: { select: { firstName: true, lastName: true } },
      companyProfile: { select: { companyName: true } },
    },
  });

  if (!user) {
    return { name: 'Unknown User', photo: null };
  }

  let name = 'User';
  let photo: string | null = null;

  if (user.talentProfile) {
    name = `${user.talentProfile.firstName} ${user.talentProfile.lastName}`;
    photo = user.talentProfile.photo;
  } else if (user.professionalProfile) {
    name = `${user.professionalProfile.firstName} ${user.professionalProfile.lastName}`;
  } else if (user.companyProfile) {
    name = user.companyProfile.companyName;
  }

  return { name, photo };
}

/**
 * Get a single notification by ID
 */
export async function getNotificationById(
  notificationId: string
): Promise<NotificationInfo | null> {
  const notification = await db.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    return null;
  }

  // Get sender info if present
  let senderName: string | null = null;
  let senderPhoto: string | null = null;

  if (notification.senderId) {
    const senderInfo = await getUserDisplayInfo(notification.senderId);
    senderName = senderInfo.name;
    senderPhoto = senderInfo.photo;
  }

  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    content: notification.content,
    actionLink: notification.actionLink,
    recipientId: notification.recipientId,
    senderId: notification.senderId,
    senderName,
    senderPhoto,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  };
}

/**
 * Get notifications for a user with pagination and filtering
 */
export async function getNotificationsForUser(
  userId: string,
  options: NotificationPaginationOptions = {}
): Promise<NotificationsResult> {
  const { limit = DEFAULT_NOTIFICATION_LIMIT, offset = 0, unreadOnly = false, type } = options;

  // Build where clause
  const where: {
    recipientId: string;
    readAt?: null;
    type?: NotificationType;
  } = {
    recipientId: userId,
  };

  if (unreadOnly) {
    where.readAt = null;
  }

  if (type) {
    where.type = type;
  }

  // Get total count
  const total = await db.notification.count({ where });

  // Get notifications
  const notifications = await db.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit + 1, // Get one extra to check if there are more
  });

  const hasMore = notifications.length > limit;
  const notificationsToReturn = hasMore ? notifications.slice(0, limit) : notifications;

  // Enrich with sender info
  const enrichedNotifications: NotificationInfo[] = await Promise.all(
    notificationsToReturn.map(async (notification) => {
      let senderName: string | null = null;
      let senderPhoto: string | null = null;

      if (notification.senderId) {
        const senderInfo = await getUserDisplayInfo(notification.senderId);
        senderName = senderInfo.name;
        senderPhoto = senderInfo.photo;
      }

      return {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        actionLink: notification.actionLink,
        recipientId: notification.recipientId,
        senderId: notification.senderId,
        senderName,
        senderPhoto,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
      };
    })
  );

  return {
    notifications: enrichedNotifications,
    total,
    hasMore,
  };
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string): Promise<UnreadCountResult> {
  const count = await db.notification.count({
    where: {
      recipientId: userId,
      readAt: null,
    },
  });

  return { count };
}

/**
 * Get recent unread notifications for a user (for dropdown)
 */
export async function getRecentUnreadNotifications(
  userId: string,
  limit: number = 5
): Promise<NotificationInfo[]> {
  const notifications = await db.notification.findMany({
    where: {
      recipientId: userId,
      readAt: null,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // Enrich with sender info
  return Promise.all(
    notifications.map(async (notification) => {
      let senderName: string | null = null;
      let senderPhoto: string | null = null;

      if (notification.senderId) {
        const senderInfo = await getUserDisplayInfo(notification.senderId);
        senderName = senderInfo.name;
        senderPhoto = senderInfo.photo;
      }

      return {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        actionLink: notification.actionLink,
        recipientId: notification.recipientId,
        senderId: notification.senderId,
        senderName,
        senderPhoto,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
      };
    })
  );
}

/**
 * Create a new notification
 */
export async function createNotification(data: {
  type: NotificationType;
  title: string;
  content: string;
  actionLink?: string;
  recipientId: string;
  senderId?: string;
}): Promise<NotificationInfo> {
  const notification = await db.notification.create({
    data: {
      type: data.type,
      title: data.title,
      content: data.content,
      actionLink: data.actionLink || null,
      recipientId: data.recipientId,
      senderId: data.senderId || null,
    },
  });

  // Get sender info if present
  let senderName: string | null = null;
  let senderPhoto: string | null = null;

  if (notification.senderId) {
    const senderInfo = await getUserDisplayInfo(notification.senderId);
    senderName = senderInfo.name;
    senderPhoto = senderInfo.photo;
  }

  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    content: notification.content,
    actionLink: notification.actionLink,
    recipientId: notification.recipientId,
    senderId: notification.senderId,
    senderName,
    senderPhoto,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  };
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await db.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const result = await db.notification.updateMany({
    where: {
      recipientId: userId,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return result.count;
}

/**
 * Get notification preferences for a user
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences | null> {
  const prefs = await db.notificationPreference.findUnique({
    where: { userId },
  });

  if (!prefs) {
    return null;
  }

  return {
    id: prefs.id,
    userId: prefs.userId,
    enabled: prefs.enabled,
    channels: prefs.channels as unknown as ChannelPreferences,
    eventTypes: prefs.eventTypes as unknown as EventTypePreferences,
    lastEmailSentAt: prefs.lastEmailSentAt as unknown as LastEmailSentAt,
    createdAt: prefs.createdAt,
    updatedAt: prefs.updatedAt,
  };
}

/**
 * Create or update notification preferences for a user
 */
export async function upsertNotificationPreferences(
  userId: string,
  updates: {
    enabled?: boolean;
    channels?: Partial<ChannelPreferences>;
    eventTypes?: Partial<EventTypePreferences>;
    lastEmailSentAt?: Partial<LastEmailSentAt>;
  }
): Promise<NotificationPreferences> {
  const existing = await getNotificationPreferences(userId);

  if (existing) {
    // Update existing preferences
    const updatedChannels = updates.channels
      ? { ...existing.channels, ...updates.channels }
      : existing.channels;
    const updatedEventTypes = updates.eventTypes
      ? { ...existing.eventTypes, ...updates.eventTypes }
      : existing.eventTypes;
    const updatedLastEmailSentAt = updates.lastEmailSentAt
      ? { ...existing.lastEmailSentAt, ...updates.lastEmailSentAt }
      : existing.lastEmailSentAt;

    const prefs = await db.notificationPreference.update({
      where: { userId },
      data: {
        enabled: updates.enabled ?? existing.enabled,
        channels: updatedChannels as unknown as Record<string, boolean>,
        eventTypes: updatedEventTypes as unknown as Record<string, Record<string, boolean>>,
        lastEmailSentAt: updatedLastEmailSentAt as unknown as Record<string, string>,
      },
    });

    return {
      id: prefs.id,
      userId: prefs.userId,
      enabled: prefs.enabled,
      channels: prefs.channels as unknown as ChannelPreferences,
      eventTypes: prefs.eventTypes as unknown as EventTypePreferences,
      lastEmailSentAt: prefs.lastEmailSentAt as unknown as LastEmailSentAt,
      createdAt: prefs.createdAt,
      updatedAt: prefs.updatedAt,
    };
  } else {
    // Create new preferences
    const prefs = await db.notificationPreference.create({
      data: {
        userId,
        enabled: updates.enabled ?? true,
        channels: (updates.channels
          ? { ...DEFAULT_CHANNEL_PREFERENCES, ...updates.channels }
          : DEFAULT_CHANNEL_PREFERENCES) as unknown as Record<string, boolean>,
        eventTypes: (updates.eventTypes || {}) as unknown as Record<
          string,
          Record<string, boolean>
        >,
        lastEmailSentAt: (updates.lastEmailSentAt || {}) as unknown as Record<string, string>,
      },
    });

    return {
      id: prefs.id,
      userId: prefs.userId,
      enabled: prefs.enabled,
      channels: prefs.channels as unknown as ChannelPreferences,
      eventTypes: prefs.eventTypes as unknown as EventTypePreferences,
      lastEmailSentAt: prefs.lastEmailSentAt as unknown as LastEmailSentAt,
      createdAt: prefs.createdAt,
      updatedAt: prefs.updatedAt,
    };
  }
}

/**
 * Update last email sent timestamp for a notification type
 */
export async function updateLastEmailSentAt(userId: string, type: NotificationType): Promise<void> {
  const prefs = await getNotificationPreferences(userId);

  await upsertNotificationPreferences(userId, {
    lastEmailSentAt: {
      ...prefs?.lastEmailSentAt,
      [type]: new Date().toISOString(),
    },
  });
}

/**
 * Get user email by ID (for sending email notifications)
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  return user?.email || null;
}
