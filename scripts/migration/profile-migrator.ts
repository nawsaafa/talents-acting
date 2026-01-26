/**
 * Talent profile migrator
 * Handles migration of WordPress talent profiles to Prisma TalentProfile model
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { ProfileMigrationResult, MigrationOptions } from './types';
import { TransformedProfile } from './data-transformer';
import { getUserIdByLegacyId, getUserIdByEmail } from './user-migrator';
import logger from '../../lib/logger';

/**
 * Check if a profile already exists by legacyId
 */
export async function checkProfileExists(prisma: PrismaClient, legacyId: string): Promise<boolean> {
  const existing = await prisma.talentProfile.findUnique({
    where: { legacyId },
    select: { id: true },
  });

  return !!existing;
}

/**
 * Check if user already has a profile
 */
export async function checkUserHasProfile(prisma: PrismaClient, userId: string): Promise<boolean> {
  const existing = await prisma.talentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  return !!existing;
}

/**
 * Migrate a single talent profile
 */
export async function migrateProfile(
  prisma: PrismaClient,
  transformed: TransformedProfile,
  options: MigrationOptions
): Promise<ProfileMigrationResult> {
  const { profile, user, legacyId } = transformed;

  try {
    // Check if profile already exists by legacyId
    if (options.skipExisting) {
      const exists = await checkProfileExists(prisma, legacyId);
      if (exists) {
        logger.info({ legacyId }, 'Profile already exists, skipping');
        return {
          success: true,
          legacyId,
          userId: '',
          skipped: true,
          skipReason: 'Profile already exists by legacyId',
        };
      }
    }

    // Find the user ID - first by legacyId, then by email
    let userId = await getUserIdByLegacyId(prisma, legacyId);
    if (!userId) {
      userId = await getUserIdByEmail(prisma, user.email);
    }

    if (!userId) {
      return {
        success: false,
        legacyId,
        userId: '',
        error: `User not found for legacyId ${legacyId} or email ${user.email}`,
      };
    }

    // Check if user already has a profile
    const hasProfile = await checkUserHasProfile(prisma, userId);
    if (hasProfile) {
      logger.info({ legacyId, userId }, 'User already has a profile, skipping');
      return {
        success: true,
        legacyId,
        userId,
        skipped: true,
        skipReason: 'User already has a profile',
      };
    }

    // Build profile data
    const profileData: Prisma.TalentProfileCreateInput = {
      ...profile,
      user: {
        connect: { id: userId },
      },
      // Set primary photo from photos array if available
      photo:
        profile.photos && Array.isArray(profile.photos) && profile.photos.length > 0
          ? profile.photos[0]
          : undefined,
    };

    // Dry run - don't actually create
    if (options.dryRun) {
      logger.info({ legacyId, userId }, '[DRY RUN] Would create profile');
      return {
        success: true,
        legacyId,
        newProfileId: 'dry-run-id',
        userId,
      };
    }

    // Create the profile
    const createdProfile = await prisma.talentProfile.create({
      data: profileData,
      select: { id: true, userId: true },
    });

    logger.info(
      { legacyId, userId, profileId: createdProfile.id },
      'Profile migrated successfully'
    );

    return {
      success: true,
      legacyId,
      newProfileId: createdProfile.id,
      userId: createdProfile.userId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Handle unique constraint violations gracefully
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = (error.meta?.target as string[])?.join(', ') || 'unknown';
      logger.warn({ legacyId, target }, 'Profile already exists (unique constraint)');
      return {
        success: true,
        legacyId,
        userId: '',
        skipped: true,
        skipReason: `Unique constraint violation on: ${target}`,
      };
    }

    logger.error({ legacyId, error: errorMessage }, 'Failed to migrate profile');

    return {
      success: false,
      legacyId,
      userId: '',
      error: errorMessage,
    };
  }
}

/**
 * Migrate multiple profiles in batches
 */
export async function migrateProfiles(
  prisma: PrismaClient,
  transformedProfiles: TransformedProfile[],
  options: MigrationOptions
): Promise<ProfileMigrationResult[]> {
  const results: ProfileMigrationResult[] = [];
  const { batchSize } = options;

  logger.info({ total: transformedProfiles.length, batchSize }, 'Starting profile migration');

  // Process in batches
  for (let i = 0; i < transformedProfiles.length; i += batchSize) {
    const batch = transformedProfiles.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(transformedProfiles.length / batchSize);

    logger.info(
      { batch: batchNumber, total: totalBatches, size: batch.length },
      'Processing profile batch'
    );

    // Process batch sequentially
    for (const transformed of batch) {
      const result = await migrateProfile(prisma, transformed, options);
      results.push(result);
    }
  }

  // Log summary
  const succeeded = results.filter((r) => r.success && !r.skipped).length;
  const failed = results.filter((r) => !r.success).length;
  const skipped = results.filter((r) => r.skipped).length;

  logger.info({ total: results.length, succeeded, failed, skipped }, 'Profile migration complete');

  return results;
}

/**
 * Get profile by legacy ID
 */
export async function getProfileByLegacyId(
  prisma: PrismaClient,
  legacyId: string
): Promise<string | null> {
  const profile = await prisma.talentProfile.findUnique({
    where: { legacyId },
    select: { id: true },
  });

  return profile?.id || null;
}
