/**
 * User account migrator
 * Handles migration of WordPress users to Prisma User model
 */

import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UserMigrationResult, MigrationOptions } from './types';
import { TransformedProfile } from './data-transformer';
import logger from '../../lib/logger';

const SALT_ROUNDS = 12;

/**
 * Check if a user already exists by email or legacyId
 */
export async function checkUserExists(
  prisma: PrismaClient,
  email: string,
  legacyId: string
): Promise<{ exists: boolean; reason?: 'email' | 'legacyId' }> {
  // Check by legacyId first (indicates already migrated)
  const byLegacyId = await prisma.user.findUnique({
    where: { legacyId },
    select: { id: true },
  });

  if (byLegacyId) {
    return { exists: true, reason: 'legacyId' };
  }

  // Check by email
  const byEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });

  if (byEmail) {
    return { exists: true, reason: 'email' };
  }

  return { exists: false };
}

/**
 * Migrate a single user
 */
export async function migrateUser(
  prisma: PrismaClient,
  transformed: TransformedProfile,
  options: MigrationOptions
): Promise<UserMigrationResult> {
  const { user, legacyId } = transformed;

  try {
    // Check if user already exists
    if (options.skipExisting) {
      const existing = await checkUserExists(prisma, user.email, legacyId);
      if (existing.exists) {
        logger.info(
          { legacyId, email: user.email, reason: existing.reason },
          'User already exists, skipping'
        );
        return {
          success: true,
          legacyId,
          email: user.email,
          skipped: true,
          skipReason: `User already exists by ${existing.reason}`,
        };
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    // Create user data with hashed password
    const userData: Prisma.UserCreateInput = {
      ...user,
      password: hashedPassword,
    };

    // Dry run - don't actually create
    if (options.dryRun) {
      logger.info({ legacyId, email: user.email }, '[DRY RUN] Would create user');
      return {
        success: true,
        legacyId,
        email: user.email,
        newUserId: 'dry-run-id',
      };
    }

    // Create the user
    const createdUser = await prisma.user.create({
      data: userData,
      select: { id: true, email: true },
    });

    logger.info(
      { legacyId, email: user.email, newUserId: createdUser.id },
      'User migrated successfully'
    );

    return {
      success: true,
      legacyId,
      newUserId: createdUser.id,
      email: createdUser.email,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logger.error({ legacyId, email: user.email, error: errorMessage }, 'Failed to migrate user');

    return {
      success: false,
      legacyId,
      email: user.email,
      error: errorMessage,
    };
  }
}

/**
 * Migrate multiple users in batches
 */
export async function migrateUsers(
  prisma: PrismaClient,
  transformedProfiles: TransformedProfile[],
  options: MigrationOptions
): Promise<UserMigrationResult[]> {
  const results: UserMigrationResult[] = [];
  const { batchSize } = options;

  logger.info({ total: transformedProfiles.length, batchSize }, 'Starting user migration');

  // Process in batches
  for (let i = 0; i < transformedProfiles.length; i += batchSize) {
    const batch = transformedProfiles.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(transformedProfiles.length / batchSize);

    logger.info(
      { batch: batchNumber, total: totalBatches, size: batch.length },
      'Processing user batch'
    );

    // Process batch sequentially to avoid race conditions
    for (const transformed of batch) {
      const result = await migrateUser(prisma, transformed, options);
      results.push(result);
    }
  }

  // Log summary
  const succeeded = results.filter((r) => r.success && !r.skipped).length;
  const failed = results.filter((r) => !r.success).length;
  const skipped = results.filter((r) => r.skipped).length;

  logger.info({ total: results.length, succeeded, failed, skipped }, 'User migration complete');

  return results;
}

/**
 * Get user ID by legacy ID (for profile migration)
 */
export async function getUserIdByLegacyId(
  prisma: PrismaClient,
  legacyId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { legacyId },
    select: { id: true },
  });

  return user?.id || null;
}

/**
 * Get user ID by email (fallback for profile migration)
 */
export async function getUserIdByEmail(
  prisma: PrismaClient,
  email: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });

  return user?.id || null;
}
