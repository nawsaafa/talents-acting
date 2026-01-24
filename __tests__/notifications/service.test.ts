import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/lib/logger', () => ({
  log: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/email/send', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'test-message-id' }),
}));

vi.mock('@/lib/notifications/queries', () => ({
  createNotification: vi.fn().mockResolvedValue({
    id: 'test-notification-id',
    type: 'MESSAGE',
    title: 'Test Title',
    content: 'Test Content',
    actionLink: '/test',
    recipientId: 'recipient-123',
    senderId: 'sender-456',
    senderName: 'Test Sender',
    senderPhoto: null,
    readAt: null,
    createdAt: new Date(),
  }),
  getNotificationPreferences: vi.fn().mockResolvedValue(null),
  updateLastEmailSentAt: vi.fn().mockResolvedValue(undefined),
  getUserEmail: vi.fn().mockResolvedValue('test@example.com'),
}));

vi.mock('@/lib/notifications/access', () => ({
  shouldSendInAppNotification: vi.fn().mockReturnValue(true),
  shouldSendEmailNotification: vi.fn().mockReturnValue({ shouldSend: true }),
}));

vi.mock('@/lib/email/templates/new-message', () => ({
  getNewMessageEmailHtml: vi.fn().mockReturnValue('<html>Message Email</html>'),
  getNewMessageEmailText: vi.fn().mockReturnValue('Message Email Text'),
}));

vi.mock('@/lib/email/templates/collection-shared', () => ({
  getCollectionSharedEmailHtml: vi.fn().mockReturnValue('<html>Share Email</html>'),
  getCollectionSharedEmailText: vi.fn().mockReturnValue('Share Email Text'),
}));

// Import after mocks
import {
  sendNotification,
  sendMessageNotification,
  sendCollectionSharedNotification,
  sendSystemNotification,
} from '@/lib/notifications/service';
import {
  createNotification,
  updateLastEmailSentAt,
  getUserEmail,
} from '@/lib/notifications/queries';
import {
  shouldSendInAppNotification,
  shouldSendEmailNotification,
} from '@/lib/notifications/access';
import { sendEmail } from '@/lib/email/send';
import { log } from '@/lib/logger';

describe('sendNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create in-app notification when enabled', async () => {
    const result = await sendNotification({
      type: 'MESSAGE',
      title: 'Test Title',
      content: 'Test Content',
      recipientId: 'recipient-123',
      senderId: 'sender-456',
    });

    expect(result.success).toBe(true);
    expect(result.notification).toBeDefined();
    expect(createNotification).toHaveBeenCalledWith({
      type: 'MESSAGE',
      title: 'Test Title',
      content: 'Test Content',
      actionLink: undefined,
      recipientId: 'recipient-123',
      senderId: 'sender-456',
    });
  });

  it('should skip in-app notification when disabled', async () => {
    vi.mocked(shouldSendInAppNotification).mockReturnValueOnce(false);

    const result = await sendNotification({
      type: 'MESSAGE',
      title: 'Test Title',
      content: 'Test Content',
      recipientId: 'recipient-123',
    });

    expect(result.success).toBe(true);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it('should send email notification when enabled', async () => {
    const result = await sendNotification({
      type: 'MESSAGE',
      title: 'Test Title',
      content: 'Test Content',
      recipientId: 'recipient-123',
    });

    expect(result.success).toBe(true);
    expect(sendEmail).toHaveBeenCalled();
    expect(updateLastEmailSentAt).toHaveBeenCalledWith('recipient-123', 'MESSAGE');
  });

  it('should skip email notification when disabled', async () => {
    vi.mocked(shouldSendEmailNotification).mockReturnValueOnce({
      shouldSend: false,
      reason: 'notifications_disabled',
    });

    const result = await sendNotification({
      type: 'MESSAGE',
      title: 'Test Title',
      content: 'Test Content',
      recipientId: 'recipient-123',
    });

    expect(result.success).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(log.debug).toHaveBeenCalled();
  });

  it('should skip email when recipient has no email', async () => {
    vi.mocked(getUserEmail).mockResolvedValueOnce(null);

    const result = await sendNotification({
      type: 'MESSAGE',
      title: 'Test Title',
      content: 'Test Content',
      recipientId: 'recipient-123',
    });

    expect(result.success).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(createNotification).mockRejectedValueOnce(new Error('Database error'));

    const result = await sendNotification({
      type: 'MESSAGE',
      title: 'Test Title',
      content: 'Test Content',
      recipientId: 'recipient-123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Database error');
    expect(log.error).toHaveBeenCalled();
  });
});

describe('sendMessageNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send message notification with correct parameters', async () => {
    const result = await sendMessageNotification({
      recipientId: 'recipient-123',
      senderId: 'sender-456',
      senderName: 'John Doe',
      messagePreview: 'Hello, this is a test message...',
      conversationId: 'conv-789',
    });

    expect(result.success).toBe(true);
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'MESSAGE',
        title: 'New message from John Doe',
        content: 'Hello, this is a test message...',
        actionLink: '/messages/conv-789',
        recipientId: 'recipient-123',
        senderId: 'sender-456',
      })
    );
  });
});

describe('sendCollectionSharedNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send collection shared notification with correct parameters', async () => {
    const result = await sendCollectionSharedNotification({
      recipientId: 'owner-123',
      sharerId: 'viewer-456',
      sharerName: 'Jane Smith',
      collectionName: 'Top Actors',
      collectionId: 'coll-789',
    });

    expect(result.success).toBe(true);
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'COLLECTION_SHARE',
        title: 'Jane Smith viewed your shared collection',
        content: 'Your collection "Top Actors" was accessed',
        actionLink: '/collections/coll-789',
        recipientId: 'owner-123',
        senderId: 'viewer-456',
      })
    );
  });

  it('should handle anonymous viewer', async () => {
    const result = await sendCollectionSharedNotification({
      recipientId: 'owner-123',
      sharerName: 'Someone',
      collectionName: 'My Collection',
      collectionId: 'coll-789',
    });

    expect(result.success).toBe(true);
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Someone viewed your shared collection',
        senderId: undefined,
      })
    );
  });
});

describe('sendSystemNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send system notification', async () => {
    const result = await sendSystemNotification(
      'user-123',
      'Platform Update',
      'New features are now available!',
      '/updates'
    );

    expect(result.success).toBe(true);
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SYSTEM',
        title: 'Platform Update',
        content: 'New features are now available!',
        actionLink: '/updates',
        recipientId: 'user-123',
      })
    );
  });

  it('should send system notification without action link', async () => {
    const result = await sendSystemNotification(
      'user-123',
      'Maintenance Notice',
      'System maintenance scheduled for tonight.'
    );

    expect(result.success).toBe(true);
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SYSTEM',
        actionLink: undefined,
      })
    );
  });
});
