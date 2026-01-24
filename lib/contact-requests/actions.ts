'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/utils';
import { log } from '@/lib/logger';
import { submitContactRequest, respondToContactRequest } from './service';
import {
  getRequesterContactRequests,
  getTalentContactRequests,
  getAllContactRequests,
  getContactRequestById,
  getContactRequestWithRevealedInfo,
  getContactRequestCounts,
  getRevealedContactInfo,
  getUserProfileInfo,
} from './queries';
import { canViewContactRequest, isAdmin } from './access';
import type {
  CreateContactRequestInput,
  CreateContactRequestResult,
  RespondToContactRequestInput,
  RespondToContactRequestResult,
  ContactRequestsResult,
  ContactRequestPaginationOptions,
  ContactRequestInfo,
  ContactRequestCounts,
  RevealedContactInfo,
} from './types';

/**
 * Server action to create a new contact request.
 */
export async function createContactRequest(
  input: CreateContactRequestInput
): Promise<CreateContactRequestResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const result = await submitContactRequest(user.id, input);

    if (result.success) {
      revalidatePath('/contact-requests');
      revalidatePath('/dashboard/requests');
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Server action: createContactRequest failed',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Server action to respond to a contact request (approve or decline).
 */
export async function respondToRequest(
  input: RespondToContactRequestInput
): Promise<RespondToContactRequestResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const result = await respondToContactRequest(user.id, input);

    if (result.success) {
      revalidatePath('/contact-requests');
      revalidatePath('/dashboard/requests');
      revalidatePath('/dashboard');
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Server action: respondToRequest failed',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Server action to get sent contact requests (for professionals/companies).
 */
export async function getMySentRequests(
  options: ContactRequestPaginationOptions = {}
): Promise<ContactRequestsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { requests: [], total: 0, hasMore: false };
    }

    return await getRequesterContactRequests({
      requesterId: user.id,
      ...options,
    });
  } catch (error) {
    log.error(
      'Server action: getMySentRequests failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { requests: [], total: 0, hasMore: false };
  }
}

/**
 * Server action to get received contact requests (for talents).
 */
export async function getMyReceivedRequests(
  options: ContactRequestPaginationOptions = {}
): Promise<ContactRequestsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { requests: [], total: 0, hasMore: false };
    }

    // Get user profile to find talent profile ID
    const profileInfo = await getUserProfileInfo(user.id);
    if (!profileInfo?.talentProfileId) {
      return { requests: [], total: 0, hasMore: false };
    }

    return await getTalentContactRequests({
      talentProfileId: profileInfo.talentProfileId,
      ...options,
    });
  } catch (error) {
    log.error(
      'Server action: getMyReceivedRequests failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { requests: [], total: 0, hasMore: false };
  }
}

/**
 * Server action to get all contact requests (admin only).
 */
export async function getAllRequests(
  options: ContactRequestPaginationOptions = {}
): Promise<ContactRequestsResult> {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user.role)) {
      return { requests: [], total: 0, hasMore: false };
    }

    return await getAllContactRequests(options);
  } catch (error) {
    log.error(
      'Server action: getAllRequests failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { requests: [], total: 0, hasMore: false };
  }
}

/**
 * Server action to get a single contact request by ID.
 */
export async function getRequest(requestId: string): Promise<ContactRequestInfo | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    const request = await getContactRequestById(requestId);
    if (!request) {
      return null;
    }

    // Get talent profile to check ownership
    const profileInfo = await getUserProfileInfo(user.id);
    const talentUserId = profileInfo?.talentProfileId
      ? (await getUserProfileInfo(request.talentProfileId))?.id || ''
      : '';

    // Check access
    const accessResult = canViewContactRequest(
      user.id,
      user.role,
      request.requesterId,
      talentUserId
    );

    if (!accessResult.canView) {
      return null;
    }

    // If user is the requester and request is approved, include revealed contact info
    if (user.id === request.requesterId && request.status === 'APPROVED') {
      return await getContactRequestWithRevealedInfo(requestId, user.id);
    }

    return request;
  } catch (error) {
    log.error(
      'Server action: getRequest failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return null;
  }
}

/**
 * Server action to get revealed contact info for an approved request.
 */
export async function getRequestContactInfo(
  requestId: string
): Promise<RevealedContactInfo | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    return await getRevealedContactInfo(requestId, user.id);
  } catch (error) {
    log.error(
      'Server action: getRequestContactInfo failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return null;
  }
}

/**
 * Server action to get contact request counts for dashboard.
 */
export async function getMyRequestCounts(): Promise<{
  sent: ContactRequestCounts | null;
  received: ContactRequestCounts | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { sent: null, received: null };
    }

    const profileInfo = await getUserProfileInfo(user.id);

    // Get sent counts for professionals/companies
    let sent: ContactRequestCounts | null = null;
    if (user.role === 'PROFESSIONAL' || user.role === 'COMPANY') {
      sent = await getContactRequestCounts(user.id, 'requester');
    }

    // Get received counts for talents
    let received: ContactRequestCounts | null = null;
    if (profileInfo?.talentProfileId) {
      received = await getContactRequestCounts(user.id, 'talent', profileInfo.talentProfileId);
    }

    return { sent, received };
  } catch (error) {
    log.error(
      'Server action: getMyRequestCounts failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { sent: null, received: null };
  }
}

/**
 * Server action to check if user can create contact requests.
 */
export async function canCreateRequest(): Promise<{
  canCreate: boolean;
  reason?: string;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { canCreate: false, reason: 'Authentication required' };
    }

    const profileInfo = await getUserProfileInfo(user.id);
    if (!profileInfo) {
      return { canCreate: false, reason: 'User profile not found' };
    }

    // Import and use canCreateContactRequest from access
    const { canCreateContactRequest } = await import('./access');
    const result = canCreateContactRequest({
      role: profileInfo.role,
      subscriptionStatus: profileInfo.subscriptionStatus,
      validationStatus: profileInfo.validationStatus,
    });

    return {
      canCreate: result.canCreate,
      reason: result.reason,
    };
  } catch (error) {
    log.error(
      'Server action: canCreateRequest failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return { canCreate: false, reason: 'An error occurred' };
  }
}

/**
 * Server action to check if user has pending request to a specific talent.
 */
export async function hasPendingRequestTo(talentProfileId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    const { hasExistingPendingRequest } = await import('./queries');
    return await hasExistingPendingRequest(user.id, talentProfileId);
  } catch (error) {
    log.error(
      'Server action: hasPendingRequestTo failed',
      error instanceof Error ? error : new Error('Unknown error')
    );
    return false;
  }
}
