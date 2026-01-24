import { Role, SubscriptionStatus, ValidationStatus, ContactRequestStatus } from '@prisma/client';
import { isAdminRole, hasPremiumSubscription, isSubscriberRole } from '@/lib/access/control';
import type { ContactRequestAccessResult, RateLimitCheckResult } from './types';

// Rate limit: maximum pending requests per requester per 24 hours
export const MAX_PENDING_REQUESTS_PER_DAY = 5;

// Rate limit window in milliseconds (24 hours)
export const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Check if a user can create contact requests.
 * Rules:
 * - Must be authenticated
 * - Must be PROFESSIONAL or COMPANY role
 * - Must have ACTIVE, TRIAL, or PAST_DUE subscription status
 * - Must be validated (ValidationStatus.APPROVED)
 */
export function canCreateContactRequest(user: {
  role: Role;
  subscriptionStatus: SubscriptionStatus;
  validationStatus: ValidationStatus;
}): ContactRequestAccessResult {
  // Check role first - must be PROFESSIONAL or COMPANY
  if (!isSubscriberRole(user.role)) {
    return {
      canCreate: false,
      canView: false,
      canRespond: false,
      reason: 'Only professionals and companies can request talent contact information',
    };
  }

  // Check subscription status
  if (!hasPremiumSubscription(user.subscriptionStatus)) {
    return {
      canCreate: false,
      canView: true,
      canRespond: false,
      reason: 'An active subscription is required to request talent contact information',
    };
  }

  // Check validation status
  if (user.validationStatus !== 'APPROVED') {
    return {
      canCreate: false,
      canView: true,
      canRespond: false,
      reason: 'Your account must be approved before you can request talent contact information',
    };
  }

  return {
    canCreate: true,
    canView: true,
    canRespond: false,
    reason: 'Approved and subscribed',
  };
}

/**
 * Check if a user can view a contact request.
 * Rules:
 * - Admins can view all requests
 * - Requester can view their own sent requests
 * - Target talent can view requests sent to them
 */
export function canViewContactRequest(
  userId: string,
  userRole: Role,
  requesterId: string,
  talentUserId: string
): ContactRequestAccessResult {
  // Admins can view all requests
  if (isAdminRole(userRole)) {
    return {
      canCreate: false,
      canView: true,
      canRespond: false,
      reason: 'Admin access',
    };
  }

  // Requester can view their own requests
  if (userId === requesterId) {
    return {
      canCreate: false,
      canView: true,
      canRespond: false,
      reason: 'Viewing own request',
    };
  }

  // Target talent can view requests to them
  if (userId === talentUserId) {
    return {
      canCreate: false,
      canView: true,
      canRespond: true,
      reason: 'Request recipient',
    };
  }

  return {
    canCreate: false,
    canView: false,
    canRespond: false,
    reason: 'You do not have permission to view this contact request',
  };
}

/**
 * Check if a user can respond to a contact request.
 * Rules:
 * - Only the target talent can respond
 * - Only PENDING requests can be responded to
 */
export function canRespondToContactRequest(
  userId: string,
  talentUserId: string,
  requestStatus: ContactRequestStatus
): ContactRequestAccessResult {
  // Only target talent can respond
  if (userId !== talentUserId) {
    return {
      canCreate: false,
      canView: false,
      canRespond: false,
      reason: 'Only the talent can respond to contact requests',
    };
  }

  // Only PENDING requests can be responded to
  if (requestStatus !== 'PENDING') {
    return {
      canCreate: false,
      canView: true,
      canRespond: false,
      reason: 'This request has already been responded to',
    };
  }

  return {
    canCreate: false,
    canView: true,
    canRespond: true,
    reason: 'Can respond to request',
  };
}

/**
 * Check rate limiting for contact request submissions.
 * Rules:
 * - Maximum 5 pending requests per requester per 24 hours
 */
export function checkRateLimit(
  pendingRequestCount: number,
  oldestPendingRequestDate?: Date
): RateLimitCheckResult {
  const remaining = MAX_PENDING_REQUESTS_PER_DAY - pendingRequestCount;

  if (pendingRequestCount >= MAX_PENDING_REQUESTS_PER_DAY) {
    // Calculate when the oldest request will be outside the window
    let resetAt: Date | undefined;
    if (oldestPendingRequestDate) {
      resetAt = new Date(oldestPendingRequestDate.getTime() + RATE_LIMIT_WINDOW_MS);
    }

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      reason: `Rate limit reached. You can have a maximum of ${MAX_PENDING_REQUESTS_PER_DAY} pending contact requests at a time.`,
    };
  }

  return {
    allowed: true,
    remaining,
  };
}

/**
 * Check if a user can view the revealed contact info.
 * Rules:
 * - Only the requester can view revealed contact info
 * - Only for APPROVED requests
 */
export function canViewRevealedContactInfo(
  userId: string,
  requesterId: string,
  requestStatus: ContactRequestStatus
): boolean {
  // Only requester can view revealed info
  if (userId !== requesterId) {
    return false;
  }

  // Only APPROVED requests reveal contact info
  return requestStatus === 'APPROVED';
}

/**
 * Check if a talent can be contacted (has contact info set up).
 */
export function talentCanBeContacted(talent: {
  contactEmail: string | null;
  contactPhone: string | null;
}): boolean {
  // Talent must have at least email or phone set up
  return !!(talent.contactEmail || talent.contactPhone);
}

/**
 * Check if a user has already sent a pending request to a talent.
 * Used to prevent duplicate requests.
 */
export function hasPendingRequestToTalent(
  existingRequests: { status: ContactRequestStatus }[]
): boolean {
  return existingRequests.some((request) => request.status === 'PENDING');
}

/**
 * Validate contact request input.
 */
export function validateContactRequestInput(input: { purpose: string; message?: string }): {
  valid: boolean;
  error?: string;
} {
  // Purpose is required and must be at least 50 characters
  if (!input.purpose || input.purpose.trim().length < 50) {
    return {
      valid: false,
      error: 'Purpose must be at least 50 characters long',
    };
  }

  // Purpose should not exceed 2000 characters
  if (input.purpose.length > 2000) {
    return {
      valid: false,
      error: 'Purpose cannot exceed 2000 characters',
    };
  }

  // Message is optional but if provided, should not exceed 1000 characters
  if (input.message && input.message.length > 1000) {
    return {
      valid: false,
      error: 'Personal message cannot exceed 1000 characters',
    };
  }

  return { valid: true };
}

/**
 * Get subscription status denial reason for contact requests.
 */
export function getSubscriptionDenialReason(status: SubscriptionStatus): string {
  switch (status) {
    case 'NONE':
      return 'A subscription is required to request talent contact information';
    case 'CANCELLED':
      return 'Your subscription has been cancelled. Please resubscribe to request talent contact information';
    case 'EXPIRED':
      return 'Your subscription has expired. Please renew to request talent contact information';
    default:
      return 'A valid subscription is required to request talent contact information';
  }
}

/**
 * Check if user is admin (convenience function).
 */
export function isAdmin(role: Role): boolean {
  return isAdminRole(role);
}
