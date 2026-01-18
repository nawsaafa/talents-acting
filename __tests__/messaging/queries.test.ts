import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';
import {
  findConversationBetweenUsers,
  createConversation,
  findOrCreateConversation,
  isConversationParticipant,
  getConversationParticipantIds,
  createMessage,
  markConversationAsRead,
  getUserRole,
} from '@/lib/messaging/queries';

// Mock the database module
vi.mock('@/lib/db', () => ({
  db: {
    conversation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    conversationParticipant: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    message: {
      create: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe('Messaging Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('findConversationBetweenUsers', () => {
    it('should return conversation id when conversation exists', async () => {
      const now = new Date();
      const mockConversation = {
        id: 'conv-123',
        createdAt: now,
        updatedAt: now,
        participants: [{ userId: 'user-1' }, { userId: 'user-2' }],
      };

      vi.mocked(db.conversation.findMany).mockResolvedValue([mockConversation] as never);

      const result = await findConversationBetweenUsers('user-1', 'user-2');

      expect(result).toBe('conv-123');
      expect(db.conversation.findMany).toHaveBeenCalledWith({
        where: {
          participants: {
            every: {
              userId: { in: ['user-1', 'user-2'] },
            },
          },
        },
        include: {
          participants: { select: { userId: true } },
        },
      });
    });

    it('should return null when no conversation exists', async () => {
      vi.mocked(db.conversation.findMany).mockResolvedValue([]);

      const result = await findConversationBetweenUsers('user-1', 'user-3');

      expect(result).toBeNull();
    });

    it('should return null when conversation has different participants', async () => {
      const now = new Date();
      const mockConversation = {
        id: 'conv-456',
        createdAt: now,
        updatedAt: now,
        participants: [{ userId: 'user-1' }, { userId: 'user-2' }, { userId: 'user-3' }],
      };

      vi.mocked(db.conversation.findMany).mockResolvedValue([mockConversation] as never);

      const result = await findConversationBetweenUsers('user-1', 'user-2');

      // Should not match because there are 3 participants
      expect(result).toBeNull();
    });
  });

  describe('createConversation', () => {
    it('should create a new conversation with two participants', async () => {
      const mockConversation = { id: 'new-conv-123' };

      vi.mocked(db.conversation.create).mockResolvedValue({
        id: 'new-conv-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await createConversation('user-1', 'user-2');

      expect(result).toBe('new-conv-123');
      expect(db.conversation.create).toHaveBeenCalledWith({
        data: {
          participants: {
            create: [{ userId: 'user-1' }, { userId: 'user-2' }],
          },
        },
      });
    });
  });

  describe('findOrCreateConversation', () => {
    it('should return existing conversation id when found', async () => {
      const now = new Date();
      const mockConversation = {
        id: 'existing-conv',
        createdAt: now,
        updatedAt: now,
        participants: [{ userId: 'user-1' }, { userId: 'user-2' }],
      };

      vi.mocked(db.conversation.findMany).mockResolvedValue([mockConversation] as never);

      const result = await findOrCreateConversation('user-1', 'user-2');

      expect(result).toBe('existing-conv');
      expect(db.conversation.create).not.toHaveBeenCalled();
    });

    it('should create new conversation when none exists', async () => {
      vi.mocked(db.conversation.findMany).mockResolvedValue([]);
      vi.mocked(db.conversation.create).mockResolvedValue({
        id: 'new-conv-789',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await findOrCreateConversation('user-1', 'user-3');

      expect(result).toBe('new-conv-789');
      expect(db.conversation.create).toHaveBeenCalled();
    });
  });

  describe('isConversationParticipant', () => {
    it('should return true when user is a participant', async () => {
      vi.mocked(db.conversationParticipant.findUnique).mockResolvedValue({
        id: 'part-123',
        conversationId: 'conv-1',
        userId: 'user-1',
        joinedAt: new Date(),
      });

      const result = await isConversationParticipant('conv-1', 'user-1');

      expect(result).toBe(true);
      expect(db.conversationParticipant.findUnique).toHaveBeenCalledWith({
        where: {
          conversationId_userId: {
            conversationId: 'conv-1',
            userId: 'user-1',
          },
        },
      });
    });

    it('should return false when user is not a participant', async () => {
      vi.mocked(db.conversationParticipant.findUnique).mockResolvedValue(null);

      const result = await isConversationParticipant('conv-1', 'user-999');

      expect(result).toBe(false);
    });
  });

  describe('getConversationParticipantIds', () => {
    it('should return array of participant user ids', async () => {
      const now = new Date();
      vi.mocked(db.conversationParticipant.findMany).mockResolvedValue([
        { id: 'part-1', userId: 'user-1', conversationId: 'conv-123', joinedAt: now },
        { id: 'part-2', userId: 'user-2', conversationId: 'conv-123', joinedAt: now },
      ]);

      const result = await getConversationParticipantIds('conv-123');

      expect(result).toEqual(['user-1', 'user-2']);
      expect(db.conversationParticipant.findMany).toHaveBeenCalledWith({
        where: { conversationId: 'conv-123' },
        select: { userId: true },
      });
    });

    it('should return empty array when conversation has no participants', async () => {
      vi.mocked(db.conversationParticipant.findMany).mockResolvedValue([]);

      const result = await getConversationParticipantIds('empty-conv');

      expect(result).toEqual([]);
    });
  });

  describe('createMessage', () => {
    it('should create a message and update conversation timestamp', async () => {
      const now = new Date();
      const mockMessage = {
        id: 'msg-123',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Hello, world!',
        readAt: null,
        createdAt: now,
      };

      vi.mocked(db.$transaction).mockResolvedValue([mockMessage, {}]);

      const result = await createMessage('conv-1', 'user-1', 'Hello, world!');

      expect(result.id).toBe('msg-123');
      expect(result.content).toBe('Hello, world!');
      expect(result.senderId).toBe('user-1');
      expect(db.$transaction).toHaveBeenCalled();
    });
  });

  describe('markConversationAsRead', () => {
    it('should mark unread messages as read', async () => {
      vi.mocked(db.message.updateMany).mockResolvedValue({ count: 5 });

      const result = await markConversationAsRead('conv-1', 'user-1');

      expect(result).toBe(5);
      expect(db.message.updateMany).toHaveBeenCalledWith({
        where: {
          conversationId: 'conv-1',
          senderId: { not: 'user-1' },
          readAt: null,
        },
        data: {
          readAt: expect.any(Date),
        },
      });
    });

    it('should return 0 when no messages to mark as read', async () => {
      vi.mocked(db.message.updateMany).mockResolvedValue({ count: 0 });

      const result = await markConversationAsRead('conv-1', 'user-1');

      expect(result).toBe(0);
    });
  });

  describe('getUserRole', () => {
    it('should return user role when user exists', async () => {
      const now = new Date();
      vi.mocked(db.user.findUnique).mockResolvedValue({
        id: 'user-1',
        role: 'PROFESSIONAL',
        email: 'test@example.com',
        password: 'hashed',
        isActive: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        stripeCustomerId: null,
      });

      const result = await getUserRole('user-1');

      expect(result).toBe('PROFESSIONAL');
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { role: true },
      });
    });

    it('should return null when user does not exist', async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      const result = await getUserRole('nonexistent-user');

      expect(result).toBeNull();
    });

    it('should handle different roles correctly', async () => {
      const now = new Date();
      vi.mocked(db.user.findUnique).mockResolvedValue({
        id: 'talent-1',
        role: 'TALENT',
        email: 'talent@example.com',
        password: 'hashed',
        isActive: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        stripeCustomerId: null,
      });

      const result = await getUserRole('talent-1');

      expect(result).toBe('TALENT');
    });
  });
});
