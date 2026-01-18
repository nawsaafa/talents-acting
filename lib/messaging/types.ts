import { Role, SubscriptionStatus } from '@prisma/client';

// Conversation with participant info and last message preview
export interface ConversationPreview {
  id: string;
  updatedAt: Date;
  // The other participant (not the current user)
  otherParticipant: {
    id: string;
    name: string;
    photo: string | null;
    role: Role;
  };
  // Last message in conversation
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: Date;
  } | null;
  // Unread count for current user
  unreadCount: number;
}

// Full conversation with all messages
export interface ConversationWithMessages {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participants: ConversationParticipantInfo[];
  messages: MessageInfo[];
}

// Participant info for conversation display
export interface ConversationParticipantInfo {
  userId: string;
  name: string;
  photo: string | null;
  role: Role;
  joinedAt: Date;
}

// Message info for display
export interface MessageInfo {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: Date | null;
  createdAt: Date;
}

// Input for sending a message
export interface SendMessageInput {
  recipientId: string;
  content: string;
}

// Result of sending a message
export interface SendMessageResult {
  success: boolean;
  message?: MessageInfo;
  conversationId?: string;
  error?: string;
}

// Result of checking messaging access
export interface MessagingAccessResult {
  canSend: boolean;
  reason?: string;
  requiresSubscription?: boolean;
}

// User context for messaging access checks
export interface MessagingContext {
  userId: string;
  role: Role;
  subscriptionStatus: SubscriptionStatus;
}

// Pagination options for messages
export interface MessagePaginationOptions {
  limit?: number;
  before?: Date;
  after?: Date;
}

// Result of fetching conversations
export interface ConversationsResult {
  conversations: ConversationPreview[];
  total: number;
  hasMore: boolean;
}

// Result of fetching messages
export interface MessagesResult {
  messages: MessageInfo[];
  hasMore: boolean;
}
