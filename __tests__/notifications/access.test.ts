import { describe, it, expect } from 'vitest';
import { NotificationType, Role } from '@prisma/client';
import {
  canViewNotification,
  canMarkNotificationRead,
  shouldSendInAppNotification,
  shouldSendEmailNotification,
  EMAIL_RATE_LIMIT_MS,
} from '@/lib/notifications/access';
import type { NotificationPreferences } from '@/lib/notifications/types';

describe('canViewNotification', () => {
  it('should allow recipient to view their notification', () => {
    const result = canViewNotification('user-123', 'user-123', 'TALENT');
    expect(result.canView).toBe(true);
    expect(result.reason).toBe('Own notification');
  });

  it('should not allow other users to view notification', () => {
    const result = canViewNotification('other-user', 'user-123', 'TALENT');
    expect(result.canView).toBe(false);
    expect(result.reason).toContain('only view your own');
  });

  it('should allow admin to view any notification', () => {
    const result = canViewNotification('admin-user', 'user-123', 'ADMIN');
    expect(result.canView).toBe(true);
    expect(result.reason).toBe('Admin access');
  });
});

describe('canMarkNotificationRead', () => {
  it('should allow recipient to mark their notification as read', () => {
    const result = canMarkNotificationRead('user-123', 'user-123', 'TALENT');
    expect(result).toBe(true);
  });

  it('should not allow other users to mark notification as read', () => {
    const result = canMarkNotificationRead('other-user', 'user-123', 'PROFESSIONAL');
    expect(result).toBe(false);
  });

  it('should allow admin to mark any notification as read', () => {
    const result = canMarkNotificationRead('admin-user', 'user-123', 'ADMIN');
    expect(result).toBe(true);
  });
});

describe('shouldSendInAppNotification', () => {
  const defaultPreferences: NotificationPreferences = {
    enabled: true,
    channels: { inApp: true, email: true },
    eventTypes: {},
    lastEmailSentAt: {},
  };

  it('should send when preferences are null (default behavior)', () => {
    const result = shouldSendInAppNotification(null, 'MESSAGE');
    expect(result).toBe(true);
  });

  it('should send when all notifications are enabled', () => {
    const result = shouldSendInAppNotification(defaultPreferences, 'MESSAGE');
    expect(result).toBe(true);
  });

  it('should not send when notifications are globally disabled', () => {
    const prefs: NotificationPreferences = {
      ...defaultPreferences,
      enabled: false,
    };
    const result = shouldSendInAppNotification(prefs, 'MESSAGE');
    expect(result).toBe(false);
  });

  it('should not send when in-app channel is disabled', () => {
    const prefs: NotificationPreferences = {
      ...defaultPreferences,
      channels: { inApp: false, email: true },
    };
    const result = shouldSendInAppNotification(prefs, 'MESSAGE');
    expect(result).toBe(false);
  });

  it('should not send when event type in-app is disabled', () => {
    const prefs: NotificationPreferences = {
      ...defaultPreferences,
      eventTypes: {
        MESSAGE: { inApp: false, email: true },
      },
    };
    const result = shouldSendInAppNotification(prefs, 'MESSAGE');
    expect(result).toBe(false);
  });

  it('should send for SYSTEM type when not specifically disabled', () => {
    const result = shouldSendInAppNotification(defaultPreferences, 'SYSTEM');
    expect(result).toBe(true);
  });

  it('should respect per-type settings over global channel settings', () => {
    const prefs: NotificationPreferences = {
      enabled: true,
      channels: { inApp: true, email: true },
      eventTypes: {
        MESSAGE: { inApp: false, email: true },
        COLLECTION_SHARE: { inApp: true, email: false },
      },
      lastEmailSentAt: {},
    };

    expect(shouldSendInAppNotification(prefs, 'MESSAGE')).toBe(false);
    expect(shouldSendInAppNotification(prefs, 'COLLECTION_SHARE')).toBe(true);
  });
});

describe('shouldSendEmailNotification', () => {
  const defaultPreferences: NotificationPreferences = {
    enabled: true,
    channels: { inApp: true, email: true },
    eventTypes: {},
    lastEmailSentAt: {},
  };

  describe('basic preference checks', () => {
    it('should send when preferences are null (default behavior)', () => {
      const result = shouldSendEmailNotification(null, 'MESSAGE');
      expect(result.shouldSend).toBe(true);
    });

    it('should send when all notifications are enabled', () => {
      const result = shouldSendEmailNotification(defaultPreferences, 'MESSAGE');
      expect(result.shouldSend).toBe(true);
    });

    it('should not send when notifications are globally disabled', () => {
      const prefs: NotificationPreferences = {
        ...defaultPreferences,
        enabled: false,
      };
      const result = shouldSendEmailNotification(prefs, 'MESSAGE');
      expect(result.shouldSend).toBe(false);
      expect(result.reason).toContain('disabled');
    });

    it('should not send when email channel is disabled', () => {
      const prefs: NotificationPreferences = {
        ...defaultPreferences,
        channels: { inApp: true, email: false },
      };
      const result = shouldSendEmailNotification(prefs, 'MESSAGE');
      expect(result.shouldSend).toBe(false);
      expect(result.reason).toContain('Email');
    });

    it('should not send when event type email is disabled', () => {
      const prefs: NotificationPreferences = {
        ...defaultPreferences,
        eventTypes: {
          MESSAGE: { inApp: true, email: false },
        },
      };
      const result = shouldSendEmailNotification(prefs, 'MESSAGE');
      expect(result.shouldSend).toBe(false);
      expect(result.reason).toContain('MESSAGE');
    });
  });

  describe('rate limiting', () => {
    it('should send when no previous email was sent', () => {
      const result = shouldSendEmailNotification(defaultPreferences, 'MESSAGE');
      expect(result.shouldSend).toBe(true);
    });

    it('should not send when rate limited', () => {
      const prefs: NotificationPreferences = {
        ...defaultPreferences,
        lastEmailSentAt: {
          MESSAGE: new Date(Date.now() - 1000).toISOString(), // 1 second ago
        },
      };
      const result = shouldSendEmailNotification(prefs, 'MESSAGE');
      expect(result.shouldSend).toBe(false);
      expect(result.reason).toContain('Rate limited');
    });

    it('should send when rate limit has expired', () => {
      const prefs: NotificationPreferences = {
        ...defaultPreferences,
        lastEmailSentAt: {
          MESSAGE: new Date(Date.now() - EMAIL_RATE_LIMIT_MS - 1000).toISOString(), // More than 1 hour ago
        },
      };
      const result = shouldSendEmailNotification(prefs, 'MESSAGE');
      expect(result.shouldSend).toBe(true);
    });

    it('should rate limit per event type independently', () => {
      const prefs: NotificationPreferences = {
        ...defaultPreferences,
        lastEmailSentAt: {
          MESSAGE: new Date(Date.now() - 1000).toISOString(), // Rate limited
        },
      };

      const messageResult = shouldSendEmailNotification(prefs, 'MESSAGE');
      expect(messageResult.shouldSend).toBe(false);

      const shareResult = shouldSendEmailNotification(prefs, 'COLLECTION_SHARE');
      expect(shareResult.shouldSend).toBe(true);
    });
  });

  describe('combined conditions', () => {
    it('should check all conditions in order', () => {
      // Disabled globally
      const globalDisabled: NotificationPreferences = {
        enabled: false,
        channels: { inApp: true, email: false },
        eventTypes: { MESSAGE: { inApp: false, email: false } },
        lastEmailSentAt: { MESSAGE: new Date().toISOString() },
      };

      const result = shouldSendEmailNotification(globalDisabled, 'MESSAGE');
      expect(result.shouldSend).toBe(false);
      expect(result.reason).toContain('disabled');
    });
  });
});

describe('EMAIL_RATE_LIMIT_MS', () => {
  it('should be 1 hour in milliseconds', () => {
    expect(EMAIL_RATE_LIMIT_MS).toBe(60 * 60 * 1000);
  });
});
