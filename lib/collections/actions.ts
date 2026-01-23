'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/utils';
import { getUserSubscriptionByRole } from '@/lib/payment/queries';
import { log } from '@/lib/logger';
import {
  getUserCollections,
  getCollectionById,
  getCollectionWithTalents,
  createCollection as createCollectionQuery,
  updateCollection as updateCollectionQuery,
  deleteCollection as deleteCollectionQuery,
  addTalentToCollection as addTalentQuery,
  addTalentsToCollection as addTalentsQuery,
  removeTalentFromCollection as removeTalentQuery,
  createCollectionShareLink,
  getCollectionShareLinks,
  revokeShareLink as revokeShareLinkQuery,
  getCollectionsContainingTalent,
} from './queries';
import {
  canCreateCollection,
  canEditCollection,
  canDeleteCollection,
  canModifyCollectionTalents,
  canShareCollection,
  buildCollectionContext,
} from './access';
import type {
  CreateCollectionResult,
  UpdateCollectionResult,
  DeleteCollectionResult,
  ModifyTalentsResult,
  GenerateShareLinkResult,
  RevokeShareLinkResult,
  CollectionPreview,
  CollectionWithTalents,
  CollectionShareInfo,
} from './types';

// Validation constants
const MAX_COLLECTION_NAME_LENGTH = 100;
const MIN_COLLECTION_NAME_LENGTH = 1;
const MAX_COLLECTION_DESCRIPTION_LENGTH = 500;

/**
 * Server action to create a new collection
 */
export async function createCollection(
  name: string,
  description?: string
): Promise<CreateCollectionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in to create collections' };
    }

    // Validate name
    const trimmedName = name.trim();
    if (trimmedName.length < MIN_COLLECTION_NAME_LENGTH) {
      return { success: false, error: 'Collection name cannot be empty' };
    }
    if (trimmedName.length > MAX_COLLECTION_NAME_LENGTH) {
      return {
        success: false,
        error: `Collection name cannot exceed ${MAX_COLLECTION_NAME_LENGTH} characters`,
      };
    }

    // Validate description
    const trimmedDescription = description?.trim();
    if (trimmedDescription && trimmedDescription.length > MAX_COLLECTION_DESCRIPTION_LENGTH) {
      return {
        success: false,
        error: `Description cannot exceed ${MAX_COLLECTION_DESCRIPTION_LENGTH} characters`,
      };
    }

    // Check access
    const subscription = await getUserSubscriptionByRole(user.id, user.role);
    const context = buildCollectionContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    const accessResult = canCreateCollection(context);
    if (!accessResult.canAccess) {
      return { success: false, error: accessResult.reason };
    }

    // Create collection
    const collection = await createCollectionQuery(user.id, trimmedName, trimmedDescription);

    log.info('Collection created', {
      collectionId: collection.id,
      userId: user.id,
    });

    revalidatePath('/collections');

    return { success: true, collection };
  } catch (error) {
    log.error('Failed to create collection', error as Error);
    return { success: false, error: 'Failed to create collection. Please try again.' };
  }
}

/**
 * Server action to update a collection's name and description
 */
export async function updateCollection(
  collectionId: string,
  data: { name?: string; description?: string }
): Promise<UpdateCollectionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get collection to check ownership
    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }

    // Validate name if provided
    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (trimmedName.length < MIN_COLLECTION_NAME_LENGTH) {
        return { success: false, error: 'Collection name cannot be empty' };
      }
      if (trimmedName.length > MAX_COLLECTION_NAME_LENGTH) {
        return {
          success: false,
          error: `Collection name cannot exceed ${MAX_COLLECTION_NAME_LENGTH} characters`,
        };
      }
      data.name = trimmedName;
    }

    // Validate description if provided
    if (data.description !== undefined) {
      const trimmedDescription = data.description.trim();
      if (trimmedDescription.length > MAX_COLLECTION_DESCRIPTION_LENGTH) {
        return {
          success: false,
          error: `Description cannot exceed ${MAX_COLLECTION_DESCRIPTION_LENGTH} characters`,
        };
      }
      data.description = trimmedDescription;
    }

    // Check access
    const subscription = await getUserSubscriptionByRole(user.id, user.role);
    const context = buildCollectionContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    const accessResult = canEditCollection(context, collection.ownerId);
    if (!accessResult.canAccess) {
      return { success: false, error: accessResult.reason };
    }

    // Update collection
    const updated = await updateCollectionQuery(collectionId, data);

    log.info('Collection updated', {
      collectionId,
      userId: user.id,
    });

    revalidatePath('/collections');
    revalidatePath(`/collections/${collectionId}`);

    return { success: true, collection: updated };
  } catch (error) {
    log.error('Failed to update collection', error as Error, { collectionId });
    return { success: false, error: 'Failed to update collection. Please try again.' };
  }
}

/**
 * Server action to delete a collection
 */
export async function deleteCollection(collectionId: string): Promise<DeleteCollectionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get collection to check ownership
    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }

    // Check access
    const subscription = await getUserSubscriptionByRole(user.id, user.role);
    const context = buildCollectionContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    const accessResult = canDeleteCollection(context, collection.ownerId);
    if (!accessResult.canAccess) {
      return { success: false, error: accessResult.reason };
    }

    // Delete collection
    await deleteCollectionQuery(collectionId);

    log.info('Collection deleted', {
      collectionId,
      userId: user.id,
    });

    revalidatePath('/collections');

    return { success: true };
  } catch (error) {
    log.error('Failed to delete collection', error as Error, { collectionId });
    return { success: false, error: 'Failed to delete collection. Please try again.' };
  }
}

/**
 * Server action to add a talent to a collection
 */
export async function addTalentToCollection(
  collectionId: string,
  talentProfileId: string
): Promise<ModifyTalentsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get collection to check ownership
    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }

    // Check access
    const subscription = await getUserSubscriptionByRole(user.id, user.role);
    const context = buildCollectionContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    const accessResult = canModifyCollectionTalents(context, collection.ownerId);
    if (!accessResult.canAccess) {
      return { success: false, error: accessResult.reason };
    }

    // Add talent
    await addTalentQuery(collectionId, talentProfileId);

    log.info('Talent added to collection', {
      collectionId,
      talentProfileId,
      userId: user.id,
    });

    revalidatePath(`/collections/${collectionId}`);

    return { success: true, addedCount: 1 };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add talent';
    log.error('Failed to add talent to collection', error as Error, {
      collectionId,
      talentProfileId,
    });
    return { success: false, error: message };
  }
}

/**
 * Server action to add multiple talents to a collection (bulk)
 */
export async function addTalentsToCollection(
  collectionId: string,
  talentProfileIds: string[]
): Promise<ModifyTalentsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    if (talentProfileIds.length === 0) {
      return { success: false, error: 'No talents provided' };
    }

    // Get collection to check ownership
    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }

    // Check access
    const subscription = await getUserSubscriptionByRole(user.id, user.role);
    const context = buildCollectionContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    const accessResult = canModifyCollectionTalents(context, collection.ownerId);
    if (!accessResult.canAccess) {
      return { success: false, error: accessResult.reason };
    }

    // Add talents
    const addedCount = await addTalentsQuery(collectionId, talentProfileIds);

    log.info('Talents added to collection', {
      collectionId,
      addedCount,
      requestedCount: talentProfileIds.length,
      userId: user.id,
    });

    revalidatePath(`/collections/${collectionId}`);

    return { success: true, addedCount };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add talents';
    log.error('Failed to add talents to collection', error as Error, {
      collectionId,
      talentCount: talentProfileIds.length,
    });
    return { success: false, error: message };
  }
}

/**
 * Server action to remove a talent from a collection
 */
export async function removeTalentFromCollection(
  collectionId: string,
  talentProfileId: string
): Promise<ModifyTalentsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get collection to check ownership
    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }

    // Check access
    const subscription = await getUserSubscriptionByRole(user.id, user.role);
    const context = buildCollectionContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    const accessResult = canModifyCollectionTalents(context, collection.ownerId);
    if (!accessResult.canAccess) {
      return { success: false, error: accessResult.reason };
    }

    // Remove talent
    const removed = await removeTalentQuery(collectionId, talentProfileId);

    if (removed) {
      log.info('Talent removed from collection', {
        collectionId,
        talentProfileId,
        userId: user.id,
      });
    }

    revalidatePath(`/collections/${collectionId}`);

    return { success: true, removedCount: removed ? 1 : 0 };
  } catch (error) {
    log.error('Failed to remove talent from collection', error as Error, {
      collectionId,
      talentProfileId,
    });
    return { success: false, error: 'Failed to remove talent. Please try again.' };
  }
}

/**
 * Server action to generate a share link for a collection
 */
export async function generateShareLink(
  collectionId: string,
  expiresInDays?: number
): Promise<GenerateShareLinkResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get collection to check ownership
    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }

    // Check access
    const subscription = await getUserSubscriptionByRole(user.id, user.role);
    const context = buildCollectionContext({
      id: user.id,
      role: user.role,
      subscriptionStatus: subscription?.status,
    });

    const accessResult = canShareCollection(context, collection.ownerId);
    if (!accessResult.canAccess) {
      return { success: false, error: accessResult.reason };
    }

    // Calculate expiry date if provided
    let expiresAt: Date | undefined;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create share link
    const shareLink = await createCollectionShareLink(collectionId, expiresAt);

    log.info('Share link created', {
      collectionId,
      shareId: shareLink.id,
      expiresAt: shareLink.expiresAt,
      userId: user.id,
    });

    return { success: true, shareLink };
  } catch (error) {
    log.error('Failed to generate share link', error as Error, { collectionId });
    return { success: false, error: 'Failed to generate share link. Please try again.' };
  }
}

/**
 * Server action to revoke a share link
 */
export async function revokeShareLink(shareId: string): Promise<RevokeShareLinkResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Revoke the share link
    const revoked = await revokeShareLinkQuery(shareId);

    if (revoked) {
      log.info('Share link revoked', {
        shareId,
        userId: user.id,
      });
    }

    return { success: true };
  } catch (error) {
    log.error('Failed to revoke share link', error as Error, { shareId });
    return { success: false, error: 'Failed to revoke share link. Please try again.' };
  }
}

/**
 * Server action to get user's collections
 */
export async function getMyCollections(): Promise<CollectionPreview[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  return getUserCollections(user.id);
}

/**
 * Server action to get a collection with talents
 */
export async function getCollection(collectionId: string): Promise<CollectionWithTalents | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const collection = await getCollectionWithTalents(collectionId);
  if (!collection) {
    return null;
  }

  // Check access
  const subscription = await getUserSubscriptionByRole(user.id, user.role);
  const context = buildCollectionContext({
    id: user.id,
    role: user.role,
    subscriptionStatus: subscription?.status,
  });

  // Owner and admins always have access
  if (context.userId === collection.ownerId || context.role === 'ADMIN') {
    return collection;
  }

  // Others need subscription
  const accessResult = canCreateCollection(context);
  if (!accessResult.canAccess) {
    return null;
  }

  return collection;
}

/**
 * Server action to get share links for a collection
 */
export async function getShareLinks(collectionId: string): Promise<CollectionShareInfo[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  // Get collection to check ownership
  const collection = await getCollectionById(collectionId);
  if (!collection || collection.ownerId !== user.id) {
    return [];
  }

  return getCollectionShareLinks(collectionId);
}

/**
 * Server action to get collection IDs containing a talent
 */
export async function getMyCollectionsWithTalent(talentProfileId: string): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  return getCollectionsContainingTalent(user.id, talentProfileId);
}
