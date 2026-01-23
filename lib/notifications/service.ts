import { NotificationType } from '@prisma/client';
import { log } from '@/lib/logger';
import { sendEmail } from '@/lib/email/send';
import {
  createNotification,
  getNotificationPreferences,
  updateLastEmailSentAt,
  getUserEmail,
} from './queries';
import { shouldSendInAppNotification, shouldSendEmailNotification } from './access';
import { getNewMessageEmailHtml, getNewMessageEmailText } from '@/lib/email/templates/new-message';
import {
  getCollectionSharedEmailHtml,
  getCollectionSharedEmailText,
} from '@/lib/email/templates/collection-shared';
import type {
  CreateNotificationInput,
  CreateNotificationResult,
  NotificationInfo,
  SendEmailNotificationResult,
  EmailNotificationOptions,
} from './types';

/**
 * Send a notification to a user (both in-app and email if configured)
 */
export async function sendNotification(
  input: CreateNotificationInput
): Promise<CreateNotificationResult> {
  try {
    // Get user preferences
    const preferences = await getNotificationPreferences(input.recipientId);

    // Check if in-app notification should be sent
    const shouldSendInApp = shouldSendInAppNotification(preferences, input.type);

    let notification: NotificationInfo | undefined;

    if (shouldSendInApp) {
      // Create in-app notification
      notification = await createNotification({
        type: input.type,
        title: input.title,
        content: input.content,
        actionLink: input.actionLink,
        recipientId: input.recipientId,
        senderId: input.senderId,
      });

      log.info('In-app notification created', {
        notificationId: notification.id,
        type: input.type,
        recipientId: input.recipientId,
      });
    }

    // Check if email notification should be sent
    const emailCheck = shouldSendEmailNotification(preferences, input.type);

    if (emailCheck.shouldSend) {
      // Get recipient email
      const recipientEmail = await getUserEmail(input.recipientId);

      if (recipientEmail) {
        // Send email notification
        const emailResult = await sendEmailNotification({
          recipientEmail,
          recipientName: '', // Will be fetched by email template if needed
          type: input.type,
          title: input.title,
          content: input.content,
          actionLink: input.actionLink,
          senderName: notification?.senderName || undefined,
        });

        if (emailResult.sent) {
          // Update last email sent timestamp
          await updateLastEmailSentAt(input.recipientId, input.type);

          log.info('Email notification sent', {
            type: input.type,
            recipientId: input.recipientId,
            messageId: emailResult.messageId,
          });
        }
      }
    } else {
      log.debug('Email notification skipped', {
        type: input.type,
        recipientId: input.recipientId,
        reason: emailCheck.reason,
      });
    }

    return {
      success: true,
      notification,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to send notification',
      error instanceof Error ? error : new Error(errorMessage),
      {
        type: input.type,
        recipientId: input.recipientId,
      }
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send email notification based on notification type
 */
async function sendEmailNotification(
  options: EmailNotificationOptions
): Promise<SendEmailNotificationResult> {
  try {
    let html: string;
    let text: string;
    let subject: string;

    switch (options.type) {
      case 'MESSAGE':
        subject = 'New Message on Talents Acting';
        html = getNewMessageEmailHtml({
          senderName: options.senderName || 'Someone',
          messagePreview: truncateContent(options.content, 100),
          actionLink: options.actionLink || '',
        });
        text = getNewMessageEmailText({
          senderName: options.senderName || 'Someone',
          messagePreview: truncateContent(options.content, 100),
          actionLink: options.actionLink || '',
        });
        break;

      case 'COLLECTION_SHARE':
        subject = 'Collection Shared on Talents Acting';
        html = getCollectionSharedEmailHtml({
          sharerName: options.senderName || 'Someone',
          collectionName: options.title,
          actionLink: options.actionLink || '',
        });
        text = getCollectionSharedEmailText({
          sharerName: options.senderName || 'Someone',
          collectionName: options.title,
          actionLink: options.actionLink || '',
        });
        break;

      case 'SYSTEM':
        subject = options.title;
        html = getGenericEmailHtml({
          title: options.title,
          content: options.content,
          actionLink: options.actionLink,
        });
        text = getGenericEmailText({
          title: options.title,
          content: options.content,
          actionLink: options.actionLink,
        });
        break;

      case 'CONTACT_REQUEST':
        subject = 'New Contact Request on Talents Acting';
        html = getGenericEmailHtml({
          title: options.title,
          content: options.content,
          actionLink: options.actionLink,
        });
        text = getGenericEmailText({
          title: options.title,
          content: options.content,
          actionLink: options.actionLink,
        });
        break;

      default:
        return {
          success: false,
          sent: false,
          reason: `Unknown notification type: ${options.type}`,
        };
    }

    const result = await sendEmail({
      to: options.recipientEmail,
      subject,
      html,
      text,
    });

    return {
      success: result.success,
      sent: result.success,
      messageId: result.messageId,
      error: result.error,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      sent: false,
      error: errorMessage,
    };
  }
}

/**
 * Truncate content for email preview
 */
function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength - 3) + '...';
}

/**
 * Generate generic email HTML for system and contact request notifications
 */
function getGenericEmailHtml(options: {
  title: string;
  content: string;
  actionLink?: string;
}): string {
  const ctaButton = options.actionLink
    ? `
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center">
            <a href="${options.actionLink}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              View Details
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title} - Talents Acting</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e4e4e7;">
              <h1 style="margin: 0; color: #18181b; font-size: 24px; font-weight: 600;">Talents Acting</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600;">${options.title}</h2>

              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6;">
                ${options.content}
              </p>

              ${ctaButton}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f4f4f5; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} Talents Acting by Acting Institute Morocco.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate generic email text for system and contact request notifications
 */
function getGenericEmailText(options: {
  title: string;
  content: string;
  actionLink?: string;
}): string {
  const actionLine = options.actionLink ? `\n\nView details: ${options.actionLink}` : '';

  return `
${options.title}

${options.content}${actionLine}

---
Talents Acting by Acting Institute Morocco
  `.trim();
}

/**
 * Send a new message notification
 */
export async function sendMessageNotification(options: {
  recipientId: string;
  senderId: string;
  senderName: string;
  messagePreview: string;
  conversationId: string;
}): Promise<CreateNotificationResult> {
  return sendNotification({
    type: 'MESSAGE',
    title: `New message from ${options.senderName}`,
    content: options.messagePreview,
    actionLink: `/messages/${options.conversationId}`,
    recipientId: options.recipientId,
    senderId: options.senderId,
  });
}

/**
 * Send a collection shared notification
 */
export async function sendCollectionSharedNotification(options: {
  recipientId: string;
  sharerId?: string;
  sharerName: string;
  collectionName: string;
  collectionId: string;
}): Promise<CreateNotificationResult> {
  return sendNotification({
    type: 'COLLECTION_SHARE',
    title: `${options.sharerName} viewed your shared collection`,
    content: `Your collection "${options.collectionName}" was accessed`,
    actionLink: `/collections/${options.collectionId}`,
    recipientId: options.recipientId,
    senderId: options.sharerId,
  });
}

/**
 * Send a system notification
 */
export async function sendSystemNotification(
  recipientId: string,
  title: string,
  content: string,
  actionLink?: string
): Promise<CreateNotificationResult> {
  return sendNotification({
    type: 'SYSTEM',
    title,
    content,
    actionLink,
    recipientId,
  });
}
