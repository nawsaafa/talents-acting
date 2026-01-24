'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/utils';
import { getUserSubscriptionByRole } from '@/lib/payment/queries';
import { log } from '@/lib/logger';
import {
  findOrCreateConversation,
  createMessage,
  markConversationAsRead,
  isConversationParticipant,
  getUserRole,
} from './queries';
import { canInitiateConversation, canReplyToConversation, buildMessagingContext } from './access';
import type { SendMessageResult, MessagingAccessResult } from './types';
import { sendMessageNotification } from '@/lib/notifications/service';

// Maximum message content length
const MAX_MESSAGE_LENGTH = 5000;

// Minimum message content length
const MIN_MESSAGE_LENGTH = 1;

/**
 * Server action to send a message to a user.
 * Handles both new conversations and replies to existing ones.
 */
export async function sendMessage(
  recipientId: string,
  content: string,
  existingConversationId?: string
): Promise<SendMessageResult> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be signed in to send messages',
      };
    }

    // Validate content
    const trimmedContent = content.trim();
    if (trimmedContent.length < MIN_MESSAGE_LENGTH) {
      return {
        success: false,
        error: 'Message cannot be empty',
      };
    }

    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      return {
        success: false,
        error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
      };
    }

    // Prevent self-messaging
    if (user.id === recipientId) {
      return {
        success: false,
        error: 'You cannot send a message to yourself',
      };
    }

    // Fetch subscription status from database
    const subscription = await getUserSubscriptionByRole(user.id, user.role);

    // Build messaging context
    const senderContext = buildMessagingContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    let conversationId: string;
    let accessResult: MessagingAccessResult;

    if (existingConversationId) {
      // Replying to existing conversation
      const isParticipant = await isConversationParticipant(existingConversationId, user.id);

      accessResult = canReplyToConversation(senderContext, isParticipant);

      if (!accessResult.canSend) {
        return {
          success: false,
          error: accessResult.reason,
        };
      }

      conversationId = existingConversationId;
    } else {
      // Starting new conversation
      const recipientRole = await getUserRole(recipientId);

      if (!recipientRole) {
        return {
          success: false,
          error: 'Recipient not found',
        };
      }

      accessResult = canInitiateConversation(senderContext, recipientRole);

      if (!accessResult.canSend) {
        return {
          success: false,
          error: accessResult.reason,
        };
      }

      // Find or create conversation
      conversationId = await findOrCreateConversation(user.id, recipientId);
    }

    // Create the message
    const message = await createMessage(conversationId, user.id, trimmedContent);

    log.info('Message sent', {
      conversationId,
      senderId: user.id,
      messageId: message.id,
    });

    // Send notification to recipient (non-blocking)
    sendMessageNotification({
      recipientId,
      senderId: user.id,
      senderName: user.email?.split('@')[0] || 'Someone',
      messagePreview: trimmedContent.slice(0, 100) + (trimmedContent.length > 100 ? '...' : ''),
      conversationId,
    }).catch((error) => {
      log.error('Failed to send message notification', error as Error, {
        recipientId,
        senderId: user.id,
      });
    });

    // Revalidate relevant paths
    revalidatePath('/messages');
    revalidatePath(`/messages/${conversationId}`);

    return {
      success: true,
      message,
      conversationId,
    };
  } catch (error) {
    log.error('Failed to send message', error as Error, {
      recipientId,
      existingConversationId,
    });
    return {
      success: false,
      error: 'Failed to send message. Please try again.',
    };
  }
}

/**
 * Server action to mark a conversation as read.
 * Marks all unread messages from other participants as read.
 */
export async function markAsRead(conversationId: string): Promise<{
  success: boolean;
  markedCount?: number;
  error?: string;
}> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be signed in',
      };
    }

    // Verify user is a participant
    const isParticipant = await isConversationParticipant(conversationId, user.id);
    if (!isParticipant) {
      return {
        success: false,
        error: 'You are not a participant in this conversation',
      };
    }

    // Mark messages as read
    const markedCount = await markConversationAsRead(conversationId, user.id);

    // Revalidate paths if any messages were marked
    if (markedCount > 0) {
      revalidatePath('/messages');
      revalidatePath(`/messages/${conversationId}`);
    }

    return {
      success: true,
      markedCount,
    };
  } catch (error) {
    log.error('Failed to mark conversation as read', error as Error, {
      conversationId,
    });
    return {
      success: false,
      error: 'Failed to mark messages as read',
    };
  }
}

/**
 * Server action to check if user can message a specific recipient.
 * Used to show/hide contact button and display appropriate prompts.
 */
export async function checkCanMessage(recipientId: string): Promise<MessagingAccessResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        canSend: false,
        reason: 'Please sign in to send messages',
      };
    }

    // Prevent self-messaging
    if (user.id === recipientId) {
      return {
        canSend: false,
        reason: 'You cannot message yourself',
      };
    }

    // Get recipient role
    const recipientRole = await getUserRole(recipientId);
    if (!recipientRole) {
      return {
        canSend: false,
        reason: 'Recipient not found',
      };
    }

    // Fetch subscription status from database
    const subscription = await getUserSubscriptionByRole(user.id, user.role);

    // Check if user already has a conversation with recipient
    const senderContext = buildMessagingContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    // For talents, check if they can reply (conversation exists)
    // For others, check if they can initiate
    return canInitiateConversation(senderContext, recipientRole);
  } catch (error) {
    log.error('Failed to check messaging access', error as Error, {
      recipientId,
    });
    return {
      canSend: false,
      reason: 'Unable to check messaging access',
    };
  }
}
