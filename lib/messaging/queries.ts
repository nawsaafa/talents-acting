import { db } from '@/lib/db';
import { Role } from '@prisma/client';
import type {
  ConversationPreview,
  ConversationWithMessages,
  MessageInfo,
  ConversationParticipantInfo,
  MessagePaginationOptions,
} from './types';

const DEFAULT_MESSAGE_LIMIT = 50;
const DEFAULT_CONVERSATION_LIMIT = 20;

/**
 * Get user's display name based on their role and profile
 */
async function getUserDisplayInfo(userId: string): Promise<{
  name: string;
  photo: string | null;
  role: Role;
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
    return { name: 'Unknown User', photo: null, role: 'VISITOR' };
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

  return { name, photo, role: user.role };
}

/**
 * Find existing conversation between two users
 */
export async function findConversationBetweenUsers(
  userId1: string,
  userId2: string
): Promise<string | null> {
  // Find conversations where both users are participants
  const conversations = await db.conversation.findMany({
    where: {
      participants: {
        every: {
          userId: { in: [userId1, userId2] },
        },
      },
    },
    include: {
      participants: { select: { userId: true } },
    },
  });

  // Filter to find exact match (only these two participants)
  const exactMatch = conversations.find(
    (conv) =>
      conv.participants.length === 2 &&
      conv.participants.some((p) => p.userId === userId1) &&
      conv.participants.some((p) => p.userId === userId2)
  );

  return exactMatch?.id || null;
}

/**
 * Create a new conversation between two users
 */
export async function createConversation(userId1: string, userId2: string): Promise<string> {
  const conversation = await db.conversation.create({
    data: {
      participants: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
  });

  return conversation.id;
}

/**
 * Find or create a conversation between two users
 */
export async function findOrCreateConversation(userId1: string, userId2: string): Promise<string> {
  const existingId = await findConversationBetweenUsers(userId1, userId2);
  if (existingId) {
    return existingId;
  }
  return createConversation(userId1, userId2);
}

/**
 * Check if a user is a participant in a conversation
 */
export async function isConversationParticipant(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const participant = await db.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  });
  return participant !== null;
}

/**
 * Get participant user IDs for a conversation
 */
export async function getConversationParticipantIds(conversationId: string): Promise<string[]> {
  const participants = await db.conversationParticipant.findMany({
    where: { conversationId },
    select: { userId: true },
  });
  return participants.map((p) => p.userId);
}

/**
 * Get all conversations for a user with preview info
 */
export async function getConversationsForUser(
  userId: string,
  limit: number = DEFAULT_CONVERSATION_LIMIT,
  offset: number = 0
): Promise<ConversationPreview[]> {
  // Get conversations where user is a participant
  const participantRecords = await db.conversationParticipant.findMany({
    where: { userId },
    select: { conversationId: true },
  });

  const conversationIds = participantRecords.map((p) => p.conversationId);

  if (conversationIds.length === 0) {
    return [];
  }

  // Get conversations with participants and last message
  const conversations = await db.conversation.findMany({
    where: { id: { in: conversationIds } },
    include: {
      participants: { select: { userId: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          content: true,
          senderId: true,
          createdAt: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    skip: offset,
    take: limit,
  });

  // Build preview objects with other participant info and unread count
  const previews: ConversationPreview[] = await Promise.all(
    conversations.map(async (conv) => {
      // Find the other participant
      const otherParticipantId = conv.participants.find((p) => p.userId !== userId)?.userId;

      const otherParticipant = otherParticipantId
        ? await getUserDisplayInfo(otherParticipantId)
        : { name: 'Unknown', photo: null, role: 'VISITOR' as Role };

      // Count unread messages (messages not from current user with no readAt)
      const unreadCount = await db.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          readAt: null,
        },
      });

      return {
        id: conv.id,
        updatedAt: conv.updatedAt,
        otherParticipant: {
          id: otherParticipantId || '',
          ...otherParticipant,
        },
        lastMessage: conv.messages[0] || null,
        unreadCount,
      };
    })
  );

  return previews;
}

/**
 * Get total unread message count for a user across all conversations
 */
export async function getTotalUnreadCount(userId: string): Promise<number> {
  // Get all conversation IDs user is part of
  const participantRecords = await db.conversationParticipant.findMany({
    where: { userId },
    select: { conversationId: true },
  });

  const conversationIds = participantRecords.map((p) => p.conversationId);

  if (conversationIds.length === 0) {
    return 0;
  }

  // Count unread messages in those conversations (not sent by current user)
  return db.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: userId },
      readAt: null,
    },
  });
}

/**
 * Get messages for a conversation with pagination
 */
export async function getMessagesForConversation(
  conversationId: string,
  options: MessagePaginationOptions = {}
): Promise<MessageInfo[]> {
  const { limit = DEFAULT_MESSAGE_LIMIT, before, after } = options;

  const whereClause: {
    conversationId: string;
    createdAt?: { lt?: Date; gt?: Date };
  } = {
    conversationId,
  };

  if (before || after) {
    whereClause.createdAt = {};
    if (before) whereClause.createdAt.lt = before;
    if (after) whereClause.createdAt.gt = after;
  }

  const messages = await db.message.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
    take: limit,
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      content: true,
      readAt: true,
      createdAt: true,
    },
  });

  return messages;
}

/**
 * Get a single conversation with all details
 */
export async function getConversationWithMessages(
  conversationId: string,
  messageLimit: number = DEFAULT_MESSAGE_LIMIT
): Promise<ConversationWithMessages | null> {
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: { select: { userId: true, joinedAt: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: messageLimit,
        select: {
          id: true,
          conversationId: true,
          senderId: true,
          content: true,
          readAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conversation) {
    return null;
  }

  // Get display info for all participants
  const participantInfo: ConversationParticipantInfo[] = await Promise.all(
    conversation.participants.map(async (p) => {
      const displayInfo = await getUserDisplayInfo(p.userId);
      return {
        userId: p.userId,
        name: displayInfo.name,
        photo: displayInfo.photo,
        role: displayInfo.role,
        joinedAt: p.joinedAt,
      };
    })
  );

  return {
    id: conversation.id,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    participants: participantInfo,
    messages: conversation.messages,
  };
}

/**
 * Create a new message in a conversation
 */
export async function createMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<MessageInfo> {
  // Create message and update conversation timestamp
  const [message] = await db.$transaction([
    db.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        content: true,
        readAt: true,
        createdAt: true,
      },
    }),
    db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  return message;
}

/**
 * Mark all messages in a conversation as read for a user
 * Only marks messages not sent by the user
 */
export async function markConversationAsRead(
  conversationId: string,
  userId: string
): Promise<number> {
  const result = await db.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return result.count;
}

/**
 * Get recipient's role for access control checks
 */
export async function getUserRole(userId: string): Promise<Role | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role || null;
}
