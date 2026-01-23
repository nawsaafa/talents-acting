import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import type {
  CollectionPreview,
  CollectionWithTalents,
  CollectionTalentInfo,
  CollectionShareInfo,
} from './types';

const MAX_COLLECTION_TALENTS = 100;
const SHARE_TOKEN_BYTES = 32;

/**
 * Get all collections for a user with talent counts
 */
export async function getUserCollections(userId: string): Promise<CollectionPreview[]> {
  const collections = await db.collection.findMany({
    where: { ownerId: userId },
    include: {
      _count: {
        select: { talents: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    talentCount: c._count.talents,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
}

/**
 * Get a collection by ID with owner info
 */
export async function getCollectionById(collectionId: string): Promise<{
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
} | null> {
  return db.collection.findUnique({
    where: { id: collectionId },
  });
}

/**
 * Get a collection with all talents
 */
export async function getCollectionWithTalents(
  collectionId: string
): Promise<CollectionWithTalents | null> {
  const collection = await db.collection.findUnique({
    where: { id: collectionId },
    include: {
      talents: {
        include: {
          talentProfile: {
            select: {
              id: true,
              firstName: true,
              photo: true,
              gender: true,
              ageRangeMin: true,
              ageRangeMax: true,
              location: true,
              physique: true,
            },
          },
        },
        orderBy: { addedAt: 'desc' },
      },
    },
  });

  if (!collection) return null;

  const talents: CollectionTalentInfo[] = collection.talents.map((ct) => ({
    id: ct.id,
    talentProfileId: ct.talentProfile.id,
    firstName: ct.talentProfile.firstName,
    photo: ct.talentProfile.photo,
    gender: ct.talentProfile.gender,
    ageRangeMin: ct.talentProfile.ageRangeMin,
    ageRangeMax: ct.talentProfile.ageRangeMax,
    location: ct.talentProfile.location,
    physique: ct.talentProfile.physique,
    addedAt: ct.addedAt,
  }));

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    ownerId: collection.ownerId,
    talents,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}

/**
 * Create a new collection
 */
export async function createCollection(
  ownerId: string,
  name: string,
  description?: string
): Promise<CollectionPreview> {
  const collection = await db.collection.create({
    data: {
      ownerId,
      name,
      description: description || null,
    },
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    talentCount: 0,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}

/**
 * Update a collection's name and description
 */
export async function updateCollection(
  collectionId: string,
  data: { name?: string; description?: string }
): Promise<CollectionPreview> {
  const collection = await db.collection.update({
    where: { id: collectionId },
    data: {
      name: data.name,
      description: data.description,
    },
    include: {
      _count: {
        select: { talents: true },
      },
    },
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    talentCount: collection._count.talents,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}

/**
 * Delete a collection and all its relationships
 */
export async function deleteCollection(collectionId: string): Promise<void> {
  await db.collection.delete({
    where: { id: collectionId },
  });
}

/**
 * Check if a user is the owner of a collection
 */
export async function isCollectionOwner(collectionId: string, userId: string): Promise<boolean> {
  const collection = await db.collection.findUnique({
    where: { id: collectionId },
    select: { ownerId: true },
  });

  return collection?.ownerId === userId;
}

/**
 * Get the number of talents in a collection
 */
export async function getCollectionTalentCount(collectionId: string): Promise<number> {
  const count = await db.collectionTalent.count({
    where: { collectionId },
  });

  return count;
}

/**
 * Add a single talent to a collection
 * Returns true if added, false if already exists
 */
export async function addTalentToCollection(
  collectionId: string,
  talentProfileId: string
): Promise<boolean> {
  // Check current count
  const currentCount = await getCollectionTalentCount(collectionId);
  if (currentCount >= MAX_COLLECTION_TALENTS) {
    throw new Error(`Collection cannot exceed ${MAX_COLLECTION_TALENTS} talents`);
  }

  // Use upsert to handle duplicates silently
  const result = await db.collectionTalent.upsert({
    where: {
      collectionId_talentProfileId: {
        collectionId,
        talentProfileId,
      },
    },
    update: {}, // No update needed if exists
    create: {
      collectionId,
      talentProfileId,
    },
  });

  // Update collection's updatedAt timestamp
  await db.collection.update({
    where: { id: collectionId },
    data: { updatedAt: new Date() },
  });

  return !!result;
}

/**
 * Add multiple talents to a collection (bulk operation)
 * Returns count of newly added talents
 */
export async function addTalentsToCollection(
  collectionId: string,
  talentProfileIds: string[]
): Promise<number> {
  // Check current count
  const currentCount = await getCollectionTalentCount(collectionId);
  const availableSlots = MAX_COLLECTION_TALENTS - currentCount;

  if (availableSlots <= 0) {
    throw new Error(`Collection is at maximum capacity (${MAX_COLLECTION_TALENTS} talents)`);
  }

  // Limit to available slots
  const idsToAdd = talentProfileIds.slice(0, availableSlots);

  // Get existing talents to avoid duplicates
  const existing = await db.collectionTalent.findMany({
    where: {
      collectionId,
      talentProfileId: { in: idsToAdd },
    },
    select: { talentProfileId: true },
  });

  const existingIds = new Set(existing.map((e) => e.talentProfileId));
  const newIds = idsToAdd.filter((id) => !existingIds.has(id));

  if (newIds.length === 0) {
    return 0;
  }

  // Create new entries
  await db.collectionTalent.createMany({
    data: newIds.map((talentProfileId) => ({
      collectionId,
      talentProfileId,
    })),
  });

  // Update collection's updatedAt timestamp
  await db.collection.update({
    where: { id: collectionId },
    data: { updatedAt: new Date() },
  });

  return newIds.length;
}

/**
 * Remove a talent from a collection
 */
export async function removeTalentFromCollection(
  collectionId: string,
  talentProfileId: string
): Promise<boolean> {
  try {
    await db.collectionTalent.delete({
      where: {
        collectionId_talentProfileId: {
          collectionId,
          talentProfileId,
        },
      },
    });

    // Update collection's updatedAt timestamp
    await db.collection.update({
      where: { id: collectionId },
      data: { updatedAt: new Date() },
    });

    return true;
  } catch {
    // Record not found
    return false;
  }
}

/**
 * Generate a secure random token for share links
 */
export function generateShareToken(): string {
  return randomBytes(SHARE_TOKEN_BYTES).toString('hex');
}

/**
 * Create a share link for a collection
 */
export async function createCollectionShareLink(
  collectionId: string,
  expiresAt?: Date
): Promise<CollectionShareInfo> {
  const token = generateShareToken();

  const share = await db.collectionShare.create({
    data: {
      collectionId,
      token,
      expiresAt: expiresAt || null,
    },
  });

  return {
    id: share.id,
    token: share.token,
    expiresAt: share.expiresAt,
    createdAt: share.createdAt,
    collectionId: share.collectionId,
  };
}

/**
 * Get a share link by token
 */
export async function getShareLinkByToken(token: string): Promise<{
  share: CollectionShareInfo;
  collection: CollectionWithTalents;
} | null> {
  const share = await db.collectionShare.findUnique({
    where: { token },
    include: {
      collection: {
        include: {
          talents: {
            include: {
              talentProfile: {
                select: {
                  id: true,
                  firstName: true,
                  photo: true,
                  gender: true,
                  ageRangeMin: true,
                  ageRangeMax: true,
                  location: true,
                  physique: true,
                },
              },
            },
            orderBy: { addedAt: 'desc' },
          },
        },
      },
    },
  });

  if (!share) return null;

  // Check if expired
  if (share.expiresAt && share.expiresAt < new Date()) {
    return null;
  }

  const talents: CollectionTalentInfo[] = share.collection.talents.map((ct) => ({
    id: ct.id,
    talentProfileId: ct.talentProfile.id,
    firstName: ct.talentProfile.firstName,
    photo: ct.talentProfile.photo,
    gender: ct.talentProfile.gender,
    ageRangeMin: ct.talentProfile.ageRangeMin,
    ageRangeMax: ct.talentProfile.ageRangeMax,
    location: ct.talentProfile.location,
    physique: ct.talentProfile.physique,
    addedAt: ct.addedAt,
  }));

  return {
    share: {
      id: share.id,
      token: share.token,
      expiresAt: share.expiresAt,
      createdAt: share.createdAt,
      collectionId: share.collectionId,
    },
    collection: {
      id: share.collection.id,
      name: share.collection.name,
      description: share.collection.description,
      ownerId: share.collection.ownerId,
      talents,
      createdAt: share.collection.createdAt,
      updatedAt: share.collection.updatedAt,
    },
  };
}

/**
 * Get all share links for a collection
 */
export async function getCollectionShareLinks(
  collectionId: string
): Promise<CollectionShareInfo[]> {
  const shares = await db.collectionShare.findMany({
    where: { collectionId },
    orderBy: { createdAt: 'desc' },
  });

  return shares.map((s) => ({
    id: s.id,
    token: s.token,
    expiresAt: s.expiresAt,
    createdAt: s.createdAt,
    collectionId: s.collectionId,
  }));
}

/**
 * Revoke (delete) a share link
 */
export async function revokeShareLink(shareId: string): Promise<boolean> {
  try {
    await db.collectionShare.delete({
      where: { id: shareId },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a talent is in a collection
 */
export async function isTalentInCollection(
  collectionId: string,
  talentProfileId: string
): Promise<boolean> {
  const entry = await db.collectionTalent.findUnique({
    where: {
      collectionId_talentProfileId: {
        collectionId,
        talentProfileId,
      },
    },
  });

  return !!entry;
}

/**
 * Get collection IDs that contain a specific talent
 */
export async function getCollectionsContainingTalent(
  ownerId: string,
  talentProfileId: string
): Promise<string[]> {
  const entries = await db.collectionTalent.findMany({
    where: {
      talentProfileId,
      collection: {
        ownerId,
      },
    },
    select: { collectionId: true },
  });

  return entries.map((e) => e.collectionId);
}
