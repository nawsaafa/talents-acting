import { Role, SubscriptionStatus } from '@prisma/client';
import { hasActiveAccess } from '@/lib/payment/subscription';
import {
  AccessLevel,
  AccessCheckResult,
  AccessContext,
  ADMIN_ROLES,
  SUBSCRIBER_ROLES,
  PREMIUM_ACCESS_STATUSES,
} from './types';

/**
 * Check if a user has admin role (bypasses all subscription checks)
 */
export function isAdminRole(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}

/**
 * Check if a role can potentially access premium data (with valid subscription)
 */
export function isSubscriberRole(role: Role): boolean {
  return SUBSCRIBER_ROLES.includes(role);
}

/**
 * Check if a subscription status grants premium access
 */
export function hasPremiumSubscription(status: SubscriptionStatus): boolean {
  return PREMIUM_ACCESS_STATUSES.includes(status);
}

/**
 * Determine the access level for a user based on role and subscription
 *
 * Access levels:
 * - 'public': Basic talent info (name, photo, age range)
 * - 'premium': Full talent profile (includes contact info, bio, etc.)
 * - 'full': Admin access (all data plus admin functions)
 */
export function getAccessLevel(context: AccessContext): AccessLevel {
  const { role, subscriptionStatus } = context;

  // Admins always get full access
  if (isAdminRole(role)) {
    return 'full';
  }

  // Professionals and companies with active subscription get premium access
  if (isSubscriberRole(role) && hasPremiumSubscription(subscriptionStatus)) {
    return 'premium';
  }

  // Everyone else gets public access only
  return 'public';
}

/**
 * Check if user can access premium talent data
 * Returns a result object with granted status and reason
 */
export function checkPremiumAccess(context: AccessContext): AccessCheckResult {
  const { role, subscriptionStatus } = context;

  // Admins always have access
  if (isAdminRole(role)) {
    return {
      granted: true,
      level: 'full',
      reason: 'Admin access',
    };
  }

  // Check if role can potentially access premium data
  if (!isSubscriberRole(role)) {
    return {
      granted: false,
      level: 'public',
      reason: 'Your account type does not have access to premium data',
    };
  }

  // Check subscription status
  if (!hasPremiumSubscription(subscriptionStatus)) {
    return {
      granted: false,
      level: 'public',
      reason: getSubscriptionDenialReason(subscriptionStatus),
    };
  }

  return {
    granted: true,
    level: 'premium',
    reason: 'Active subscription',
  };
}

/**
 * Get a user-friendly reason for subscription-based denial
 */
function getSubscriptionDenialReason(status: SubscriptionStatus): string {
  switch (status) {
    case 'NONE':
      return 'A subscription is required to access premium talent data';
    case 'CANCELLED':
      return 'Your subscription has been cancelled. Please resubscribe to continue accessing premium data';
    case 'EXPIRED':
      return 'Your subscription has expired. Please renew to continue accessing premium data';
    default:
      return 'A valid subscription is required to access premium talent data';
  }
}

/**
 * Check if user can access a specific talent's premium data
 * Includes self-access bypass (talents can always see their own full profile)
 */
export function canAccessTalentPremiumData(
  context: AccessContext,
  talentUserId: string
): AccessCheckResult {
  // Talent viewing their own profile always has full access
  if (context.userId === talentUserId) {
    return {
      granted: true,
      level: 'full',
      reason: 'Viewing own profile',
    };
  }

  // Otherwise use standard premium access check
  return checkPremiumAccess(context);
}

/**
 * Get the subscription status display info for UI
 */
export function getSubscriptionDisplayInfo(status: SubscriptionStatus): {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
  hasAccess: boolean;
} {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Active', color: 'green', hasAccess: true };
    case 'TRIAL':
      return { label: 'Trial', color: 'green', hasAccess: true };
    case 'PAST_DUE':
      return { label: 'Past Due', color: 'yellow', hasAccess: true };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'red', hasAccess: false };
    case 'EXPIRED':
      return { label: 'Expired', color: 'red', hasAccess: false };
    case 'NONE':
    default:
      return { label: 'No Subscription', color: 'gray', hasAccess: false };
  }
}

/**
 * Build access context from user session data
 */
export function buildAccessContext(user: {
  id: string;
  role: Role;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionEndsAt?: Date | null;
}): AccessContext {
  return {
    userId: user.id,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus || 'NONE',
    subscriptionEndsAt: user.subscriptionEndsAt || null,
  };
}

// Re-export hasActiveAccess from subscription module for convenience
export { hasActiveAccess };
