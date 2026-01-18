import { Role, SubscriptionStatus } from '@prisma/client';
import { isAdminRole, isSubscriberRole, hasPremiumSubscription } from '@/lib/access/control';
import type { MessagingContext, MessagingAccessResult } from './types';

// Roles that can receive messages (talents)
const MESSAGEABLE_ROLES: Role[] = ['TALENT'];

// Roles that can always send messages (admins)
const ALWAYS_CAN_SEND_ROLES: Role[] = ['ADMIN'];

/**
 * Check if a user can initiate a new conversation with a recipient.
 * Rules:
 * - Admins can always send messages
 * - Professionals/Companies with active subscription can message talents
 * - Talents cannot initiate conversations (they can only reply)
 */
export function canInitiateConversation(
  sender: MessagingContext,
  recipientRole: Role
): MessagingAccessResult {
  // Prevent self-messaging
  // This check happens at a higher level with actual user IDs

  // Admins can always send messages
  if (isAdminRole(sender.role)) {
    return {
      canSend: true,
      reason: 'Admin access',
    };
  }

  // Talents cannot initiate conversations
  if (sender.role === 'TALENT') {
    return {
      canSend: false,
      reason: 'Talents can only reply to existing conversations',
    };
  }

  // Visitors cannot send messages
  if (sender.role === 'VISITOR') {
    return {
      canSend: false,
      reason: 'Please sign in to send messages',
    };
  }

  // Check if recipient is a messageable role (talent)
  if (!MESSAGEABLE_ROLES.includes(recipientRole)) {
    return {
      canSend: false,
      reason: 'You can only message talents',
    };
  }

  // Check if sender is a subscriber role
  if (!isSubscriberRole(sender.role)) {
    return {
      canSend: false,
      reason: 'Your account type cannot send messages',
    };
  }

  // Check subscription status
  if (!hasPremiumSubscription(sender.subscriptionStatus)) {
    return {
      canSend: false,
      reason: getSubscriptionRequiredMessage(sender.subscriptionStatus),
      requiresSubscription: true,
    };
  }

  return {
    canSend: true,
    reason: 'Active subscription',
  };
}

/**
 * Check if a user can reply to an existing conversation.
 * Rules:
 * - Must be a participant in the conversation
 * - Talents can reply to conversations they're part of
 * - Professionals/Companies can reply if they have active subscription
 * - Admins can always reply
 */
export function canReplyToConversation(
  sender: MessagingContext,
  isParticipant: boolean
): MessagingAccessResult {
  // Must be a participant to reply
  if (!isParticipant) {
    return {
      canSend: false,
      reason: 'You are not a participant in this conversation',
    };
  }

  // Admins can always reply
  if (isAdminRole(sender.role)) {
    return {
      canSend: true,
      reason: 'Admin access',
    };
  }

  // Talents can always reply to conversations they're in
  if (sender.role === 'TALENT') {
    return {
      canSend: true,
      reason: 'Replying to conversation',
    };
  }

  // Visitors cannot send messages
  if (sender.role === 'VISITOR') {
    return {
      canSend: false,
      reason: 'Please sign in to send messages',
    };
  }

  // Professionals/Companies need active subscription to reply
  if (isSubscriberRole(sender.role)) {
    if (!hasPremiumSubscription(sender.subscriptionStatus)) {
      return {
        canSend: false,
        reason: getSubscriptionRequiredMessage(sender.subscriptionStatus),
        requiresSubscription: true,
      };
    }
    return {
      canSend: true,
      reason: 'Active subscription',
    };
  }

  return {
    canSend: false,
    reason: 'Your account type cannot send messages',
  };
}

/**
 * Check if a user can view a conversation.
 * Rules:
 * - Must be a participant or an admin
 */
export function canViewConversation(
  userId: string,
  participantUserIds: string[],
  role: Role
): boolean {
  // Admins can view all conversations
  if (isAdminRole(role)) {
    return true;
  }

  // Must be a participant
  return participantUserIds.includes(userId);
}

/**
 * Get user-friendly message for subscription requirement
 */
function getSubscriptionRequiredMessage(status: SubscriptionStatus): string {
  switch (status) {
    case 'NONE':
      return 'A subscription is required to message talents';
    case 'CANCELLED':
      return 'Your subscription has been cancelled. Please resubscribe to message talents';
    case 'EXPIRED':
      return 'Your subscription has expired. Please renew to message talents';
    default:
      return 'A valid subscription is required to message talents';
  }
}

/**
 * Build messaging context from user session data
 */
export function buildMessagingContext(user: {
  id: string;
  role: Role;
  subscriptionStatus?: SubscriptionStatus;
}): MessagingContext {
  return {
    userId: user.id,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus || 'NONE',
  };
}
