import { NotificationType } from '@prisma/client';

// Notification with sender info for display
export interface NotificationInfo {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  actionLink: string | null;
  recipientId: string;
  senderId: string | null;
  senderName: string | null;
  senderPhoto: string | null;
  readAt: Date | null;
  createdAt: Date;
}

// Input for creating a notification
export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  content: string;
  actionLink?: string;
  recipientId: string;
  senderId?: string;
}

// Result of creating a notification
export interface CreateNotificationResult {
  success: boolean;
  notification?: NotificationInfo;
  error?: string;
}

// Result of fetching notifications
export interface NotificationsResult {
  notifications: NotificationInfo[];
  total: number;
  hasMore: boolean;
}

// Pagination options for notifications
export interface NotificationPaginationOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

// Channel preferences structure
export interface ChannelPreferences {
  inApp: boolean;
  email: boolean;
}

// Event type preferences structure
export interface EventTypePreferences {
  MESSAGE?: ChannelPreferences;
  COLLECTION_SHARE?: ChannelPreferences;
  SYSTEM?: ChannelPreferences;
  CONTACT_REQUEST?: ChannelPreferences;
}

// Last email sent timestamps by event type
export interface LastEmailSentAt {
  MESSAGE?: string;
  COLLECTION_SHARE?: string;
  SYSTEM?: string;
  CONTACT_REQUEST?: string;
}

// Full notification preferences
export interface NotificationPreferences {
  id: string;
  userId: string;
  enabled: boolean;
  channels: ChannelPreferences;
  eventTypes: EventTypePreferences;
  lastEmailSentAt: LastEmailSentAt;
  createdAt: Date;
  updatedAt: Date;
}

// Input for updating notification preferences
export interface UpdatePreferencesInput {
  enabled?: boolean;
  channels?: Partial<ChannelPreferences>;
  eventTypes?: Partial<EventTypePreferences>;
}

// Result of updating preferences
export interface UpdatePreferencesResult {
  success: boolean;
  preferences?: NotificationPreferences;
  error?: string;
}

// Context for notification access checks
export interface NotificationContext {
  userId: string;
  notificationId?: string;
}

// Result of checking notification access
export interface NotificationAccessResult {
  canView: boolean;
  canMarkRead: boolean;
  reason?: string;
}

// Email notification options
export interface EmailNotificationOptions {
  recipientEmail: string;
  recipientName: string;
  type: NotificationType;
  title: string;
  content: string;
  actionLink?: string;
  senderName?: string;
}

// Result of sending email notification
export interface SendEmailNotificationResult {
  success: boolean;
  sent: boolean;
  reason?: string;
  messageId?: string;
  error?: string;
}

// Unread count result
export interface UnreadCountResult {
  count: number;
}
