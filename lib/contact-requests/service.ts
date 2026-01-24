import { log } from '@/lib/logger';
import { sendNotification } from '@/lib/notifications/service';
import { sendEmail } from '@/lib/email/send';
import {
  createContactRequest as createRequest,
  updateContactRequestStatus,
  getContactRequestById,
  getTalentProfileById,
  getUserProfileInfo,
  getPendingRequestCountForRequester,
  hasExistingPendingRequest,
  getUserEmail,
} from './queries';
import {
  canCreateContactRequest,
  canRespondToContactRequest,
  checkRateLimit,
  validateContactRequestInput,
} from './access';
import type {
  CreateContactRequestInput,
  CreateContactRequestResult,
  RespondToContactRequestInput,
  RespondToContactRequestResult,
  ContactRequestInfo,
} from './types';
import {
  getContactRequestNewEmailHtml,
  getContactRequestNewEmailText,
} from '@/lib/email/templates/contact-request-new';
import {
  getContactRequestApprovedEmailHtml,
  getContactRequestApprovedEmailText,
} from '@/lib/email/templates/contact-request-approved';
import {
  getContactRequestDeclinedEmailHtml,
  getContactRequestDeclinedEmailText,
} from '@/lib/email/templates/contact-request-declined';

/**
 * Create a new contact request from a professional/company to a talent
 */
export async function submitContactRequest(
  requesterId: string,
  input: CreateContactRequestInput
): Promise<CreateContactRequestResult> {
  try {
    // Get requester profile info for access control
    const requesterInfo = await getUserProfileInfo(requesterId);
    if (!requesterInfo) {
      return { success: false, error: 'User not found' };
    }

    // Check if user can create contact requests
    const accessResult = canCreateContactRequest({
      role: requesterInfo.role,
      subscriptionStatus: requesterInfo.subscriptionStatus,
      validationStatus: requesterInfo.validationStatus,
    });

    if (!accessResult.canCreate) {
      return { success: false, error: accessResult.reason };
    }

    // Validate input
    const validation = validateContactRequestInput({
      purpose: input.purpose,
      message: input.message,
    });

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check rate limiting
    const { count, oldestDate } = await getPendingRequestCountForRequester(requesterId);
    const rateLimitResult = checkRateLimit(count, oldestDate);

    if (!rateLimitResult.allowed) {
      return { success: false, error: rateLimitResult.reason };
    }

    // Get talent profile
    const talentProfile = await getTalentProfileById(input.talentProfileId);
    if (!talentProfile) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Check if talent profile is public and approved
    if (!talentProfile.isPublic) {
      return { success: false, error: 'This talent profile is not available' };
    }

    if (talentProfile.validationStatus !== 'APPROVED') {
      return { success: false, error: 'This talent profile is not yet approved' };
    }

    // Check for existing pending request
    const hasPending = await hasExistingPendingRequest(requesterId, input.talentProfileId);
    if (hasPending) {
      return { success: false, error: 'You already have a pending request to this talent' };
    }

    // Create the request
    const request = await createRequest({
      requesterId,
      talentProfileId: input.talentProfileId,
      projectType: input.projectType,
      projectName: input.projectName,
      purpose: input.purpose,
      message: input.message,
    });

    log.info('Contact request created', {
      requestId: request.id,
      requesterId,
      talentProfileId: input.talentProfileId,
    });

    // Send notification to talent (non-blocking)
    sendNewRequestNotification(request, talentProfile.userId).catch((error) => {
      log.error('Failed to send new request notification', error as Error, {
        requestId: request.id,
      });
    });

    return { success: true, request };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to create contact request',
      error instanceof Error ? error : new Error(errorMessage),
      {
        requesterId,
        talentProfileId: input.talentProfileId,
      }
    );

    return { success: false, error: errorMessage };
  }
}

/**
 * Respond to a contact request (approve or decline)
 */
export async function respondToContactRequest(
  talentUserId: string,
  input: RespondToContactRequestInput
): Promise<RespondToContactRequestResult> {
  try {
    // Get the request
    const request = await getContactRequestById(input.requestId);
    if (!request) {
      return { success: false, error: 'Contact request not found' };
    }

    // Get talent profile to verify ownership
    const talentProfile = await getTalentProfileById(request.talentProfileId);
    if (!talentProfile || talentProfile.userId !== talentUserId) {
      return { success: false, error: 'You are not authorized to respond to this request' };
    }

    // Check if user can respond
    const accessResult = canRespondToContactRequest(
      talentUserId,
      talentProfile.userId,
      request.status
    );

    if (!accessResult.canRespond) {
      return { success: false, error: accessResult.reason };
    }

    // Update the request status
    const newStatus = input.approve ? 'APPROVED' : 'DECLINED';
    const updatedRequest = await updateContactRequestStatus(
      input.requestId,
      newStatus,
      input.declineReason
    );

    log.info('Contact request responded', {
      requestId: input.requestId,
      status: newStatus,
      talentUserId,
    });

    // Send notification to requester (non-blocking)
    if (input.approve) {
      sendApprovalNotification(updatedRequest).catch((error) => {
        log.error('Failed to send approval notification', error as Error, {
          requestId: input.requestId,
        });
      });
    } else {
      sendDeclineNotification(updatedRequest).catch((error) => {
        log.error('Failed to send decline notification', error as Error, {
          requestId: input.requestId,
        });
      });
    }

    return { success: true, request: updatedRequest };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to respond to contact request',
      error instanceof Error ? error : new Error(errorMessage),
      {
        requestId: input.requestId,
        talentUserId,
      }
    );

    return { success: false, error: errorMessage };
  }
}

/**
 * Send notification to talent when a new contact request is received
 */
async function sendNewRequestNotification(
  request: ContactRequestInfo,
  talentUserId: string
): Promise<void> {
  // Send in-app notification
  await sendNotification({
    type: 'CONTACT_REQUEST',
    title: 'New Contact Request',
    content: `${request.requesterName} wants to connect with you for a ${formatProjectType(request.projectType)} project.`,
    actionLink: '/dashboard/requests',
    recipientId: talentUserId,
    senderId: request.requesterId,
  });

  // Send email notification
  const talentEmail = await getUserEmail(talentUserId);
  if (talentEmail) {
    await sendEmail({
      to: talentEmail,
      subject: 'New Contact Request - Talents Acting',
      html: getContactRequestNewEmailHtml({
        requesterName: request.requesterName,
        requesterCompany: request.requesterCompany,
        projectType: formatProjectType(request.projectType),
        projectName: request.projectName,
        purposePreview: truncateText(request.purpose, 150),
        actionLink: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/requests`,
      }),
      text: getContactRequestNewEmailText({
        requesterName: request.requesterName,
        requesterCompany: request.requesterCompany,
        projectType: formatProjectType(request.projectType),
        projectName: request.projectName,
        purposePreview: truncateText(request.purpose, 150),
        actionLink: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/requests`,
      }),
    });
  }
}

/**
 * Send notification to requester when their request is approved
 */
async function sendApprovalNotification(request: ContactRequestInfo): Promise<void> {
  // Send in-app notification
  await sendNotification({
    type: 'CONTACT_REQUEST',
    title: 'Contact Request Approved',
    content: `${request.talentName} has approved your contact request. You can now view their contact information.`,
    actionLink: `/contact-requests?id=${request.id}`,
    recipientId: request.requesterId,
  });

  // Send email notification
  const requesterEmail = await getUserEmail(request.requesterId);
  if (requesterEmail) {
    await sendEmail({
      to: requesterEmail,
      subject: 'Contact Request Approved - Talents Acting',
      html: getContactRequestApprovedEmailHtml({
        talentName: request.talentName,
        projectType: formatProjectType(request.projectType),
        projectName: request.projectName,
        actionLink: `${process.env.NEXT_PUBLIC_APP_URL || ''}/contact-requests`,
      }),
      text: getContactRequestApprovedEmailText({
        talentName: request.talentName,
        projectType: formatProjectType(request.projectType),
        projectName: request.projectName,
        actionLink: `${process.env.NEXT_PUBLIC_APP_URL || ''}/contact-requests`,
      }),
    });
  }
}

/**
 * Send notification to requester when their request is declined
 */
async function sendDeclineNotification(request: ContactRequestInfo): Promise<void> {
  // Send in-app notification
  await sendNotification({
    type: 'CONTACT_REQUEST',
    title: 'Contact Request Declined',
    content: `${request.talentName} has declined your contact request.`,
    actionLink: `/contact-requests?id=${request.id}`,
    recipientId: request.requesterId,
  });

  // Send email notification
  const requesterEmail = await getUserEmail(request.requesterId);
  if (requesterEmail) {
    await sendEmail({
      to: requesterEmail,
      subject: 'Contact Request Update - Talents Acting',
      html: getContactRequestDeclinedEmailHtml({
        talentName: request.talentName,
        projectType: formatProjectType(request.projectType),
        projectName: request.projectName,
        declineReason: request.declineReason,
      }),
      text: getContactRequestDeclinedEmailText({
        talentName: request.talentName,
        projectType: formatProjectType(request.projectType),
        projectName: request.projectName,
        declineReason: request.declineReason,
      }),
    });
  }
}

/**
 * Format project type for display
 */
function formatProjectType(projectType: string): string {
  const formatMap: Record<string, string> = {
    FILM: 'Film',
    TV_SERIES: 'TV Series',
    COMMERCIAL: 'Commercial',
    THEATER: 'Theater',
    VOICE_OVER: 'Voice Over',
    MODELING: 'Modeling',
    OTHER: 'Other',
  };

  return formatMap[projectType] || projectType;
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}
