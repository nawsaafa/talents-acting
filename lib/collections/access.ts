import { Role, SubscriptionStatus } from '@prisma/client';
import { isAdminRole, isSubscriberRole, hasPremiumSubscription } from '@/lib/access/control';
import type { CollectionContext, CollectionAccessResult } from './types';

/**
 * Check if a user can create a new collection.
 * Rules:
 * - Admins can always create collections
 * - Professionals/Companies with active subscription can create collections
 * - Talents and visitors cannot create collections
 */
export function canCreateCollection(context: CollectionContext): CollectionAccessResult {
  // Admins can always create collections
  if (isAdminRole(context.role)) {
    return {
      canAccess: true,
      reason: 'Admin access',
    };
  }

  // Visitors cannot create collections
  if (context.role === 'VISITOR') {
    return {
      canAccess: false,
      reason: 'Please sign in to create collections',
    };
  }

  // Talents cannot create collections
  if (context.role === 'TALENT') {
    return {
      canAccess: false,
      reason: 'Talent accounts cannot create collections',
    };
  }

  // Check if user is a subscriber role
  if (!isSubscriberRole(context.role)) {
    return {
      canAccess: false,
      reason: 'Your account type cannot create collections',
    };
  }

  // Check subscription status
  if (!hasPremiumSubscription(context.subscriptionStatus)) {
    return {
      canAccess: false,
      reason: getSubscriptionRequiredMessage(context.subscriptionStatus),
      requiresSubscription: true,
    };
  }

  return {
    canAccess: true,
    reason: 'Active subscription',
  };
}

/**
 * Check if a user can view a collection.
 * Rules:
 * - Owner can always view their collection
 * - Admins can view all collections
 * - Others need active subscription
 */
export function canViewCollection(
  context: CollectionContext,
  collectionOwnerId: string
): CollectionAccessResult {
  // Owner can always view their own collection
  if (context.userId === collectionOwnerId) {
    return {
      canAccess: true,
      reason: 'Collection owner',
    };
  }

  // Admins can view all collections
  if (isAdminRole(context.role)) {
    return {
      canAccess: true,
      reason: 'Admin access',
    };
  }

  // Non-owners need active subscription to view
  if (!isSubscriberRole(context.role)) {
    return {
      canAccess: false,
      reason: 'Your account type cannot view collections',
    };
  }

  if (!hasPremiumSubscription(context.subscriptionStatus)) {
    return {
      canAccess: false,
      reason: getSubscriptionRequiredMessage(context.subscriptionStatus),
      requiresSubscription: true,
    };
  }

  return {
    canAccess: true,
    reason: 'Active subscription',
  };
}

/**
 * Check if a user can edit a collection (rename, update description).
 * Rules:
 * - Only the owner can edit their collection
 * - Admins can edit any collection
 * - Owner must have active subscription
 */
export function canEditCollection(
  context: CollectionContext,
  collectionOwnerId: string
): CollectionAccessResult {
  // Admins can edit any collection
  if (isAdminRole(context.role)) {
    return {
      canAccess: true,
      reason: 'Admin access',
    };
  }

  // Must be the owner
  if (context.userId !== collectionOwnerId) {
    return {
      canAccess: false,
      reason: 'You can only edit your own collections',
    };
  }

  // Owner must have active subscription
  if (!hasPremiumSubscription(context.subscriptionStatus)) {
    return {
      canAccess: false,
      reason: getSubscriptionRequiredMessage(context.subscriptionStatus),
      requiresSubscription: true,
    };
  }

  return {
    canAccess: true,
    reason: 'Collection owner',
  };
}

/**
 * Check if a user can delete a collection.
 * Rules:
 * - Only the owner can delete their collection
 * - Admins can delete any collection
 * - Owner must have active subscription
 */
export function canDeleteCollection(
  context: CollectionContext,
  collectionOwnerId: string
): CollectionAccessResult {
  // Same rules as edit
  return canEditCollection(context, collectionOwnerId);
}

/**
 * Check if a user can add/remove talents from a collection.
 * Rules:
 * - Only the owner can modify talents in their collection
 * - Admins can modify any collection
 * - Owner must have active subscription
 */
export function canModifyCollectionTalents(
  context: CollectionContext,
  collectionOwnerId: string
): CollectionAccessResult {
  // Same rules as edit
  return canEditCollection(context, collectionOwnerId);
}

/**
 * Check if a user can generate share links for a collection.
 * Rules:
 * - Only the owner can create share links
 * - Admins can create share links for any collection
 * - Owner must have active subscription
 */
export function canShareCollection(
  context: CollectionContext,
  collectionOwnerId: string
): CollectionAccessResult {
  // Same rules as edit
  return canEditCollection(context, collectionOwnerId);
}

/**
 * Check if a user can export a collection.
 * Rules:
 * - Only the owner can export their collection
 * - Admins can export any collection
 * - Owner must have active subscription
 */
export function canExportCollection(
  context: CollectionContext,
  collectionOwnerId: string
): CollectionAccessResult {
  // Same rules as edit
  return canEditCollection(context, collectionOwnerId);
}

/**
 * Get user-friendly message for subscription requirement
 */
function getSubscriptionRequiredMessage(status: SubscriptionStatus): string {
  switch (status) {
    case 'NONE':
      return 'A subscription is required to manage collections';
    case 'CANCELLED':
      return 'Your subscription has been cancelled. Please resubscribe to manage collections';
    case 'EXPIRED':
      return 'Your subscription has expired. Please renew to manage collections';
    default:
      return 'A valid subscription is required to manage collections';
  }
}

/**
 * Build collection context from user session data
 */
export function buildCollectionContext(user: {
  id: string;
  role: Role;
  subscriptionStatus?: SubscriptionStatus;
}): CollectionContext {
  return {
    userId: user.id,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus || 'NONE',
  };
}
