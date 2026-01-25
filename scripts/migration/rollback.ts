/**
 * Migration rollback script
 * Removes migrated data by legacyId to undo a migration
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../../lib/logger';

export interface RollbackOptions {
  /** Run without making changes */
  dryRun: boolean;

  /** Path to WordPress export file (to get legacy IDs) */
  exportFile?: string;

  /** Specific legacy IDs to rollback (alternative to exportFile) */
  legacyIds?: string[];

  /** Directory where migrated media was stored */
  mediaDir?: string;

  /** Verbose logging */
  verbose: boolean;
}

export interface RollbackResult {
  profilesDeleted: number;
  usersDeleted: number;
  mediaFilesDeleted: number;
  errors: string[];
}

/**
 * Get all legacy IDs from an export file
 */
function getLegacyIdsFromExport(exportFile: string): string[] {
  try {
    const content = fs.readFileSync(exportFile, 'utf-8');
    const data = JSON.parse(content);

    if (!data.users || !Array.isArray(data.users)) {
      throw new Error('Invalid export file: missing users array');
    }

    return data.users.map((u: { ID: string }) => u.ID);
  } catch (error) {
    throw new Error(
      `Failed to read export file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Delete migrated profiles by legacy IDs
 */
async function deleteProfiles(
  prisma: PrismaClient,
  legacyIds: string[],
  dryRun: boolean
): Promise<{ deleted: number; errors: string[] }> {
  const errors: string[] = [];
  let deleted = 0;

  for (const legacyId of legacyIds) {
    try {
      const profile = await prisma.talentProfile.findUnique({
        where: { legacyId },
        select: { id: true },
      });

      if (!profile) {
        continue; // No profile with this legacyId
      }

      if (dryRun) {
        logger.info({ legacyId }, '[DRY RUN] Would delete profile');
        deleted++;
        continue;
      }

      await prisma.talentProfile.delete({
        where: { legacyId },
      });

      logger.debug({ legacyId }, 'Deleted profile');
      deleted++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Profile ${legacyId}: ${errorMessage}`);
      logger.error({ legacyId, error: errorMessage }, 'Failed to delete profile');
    }
  }

  return { deleted, errors };
}

/**
 * Delete migrated users by legacy IDs
 */
async function deleteUsers(
  prisma: PrismaClient,
  legacyIds: string[],
  dryRun: boolean
): Promise<{ deleted: number; errors: string[] }> {
  const errors: string[] = [];
  let deleted = 0;

  for (const legacyId of legacyIds) {
    try {
      const user = await prisma.user.findUnique({
        where: { legacyId },
        select: { id: true },
      });

      if (!user) {
        continue; // No user with this legacyId
      }

      if (dryRun) {
        logger.info({ legacyId }, '[DRY RUN] Would delete user');
        deleted++;
        continue;
      }

      // User deletion will cascade to profile due to schema relation
      await prisma.user.delete({
        where: { legacyId },
      });

      logger.debug({ legacyId }, 'Deleted user');
      deleted++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`User ${legacyId}: ${errorMessage}`);
      logger.error({ legacyId, error: errorMessage }, 'Failed to delete user');
    }
  }

  return { deleted, errors };
}

/**
 * Delete migrated media files
 */
function deleteMediaFiles(
  legacyIds: string[],
  mediaDir: string,
  dryRun: boolean
): { deleted: number; errors: string[] } {
  const errors: string[] = [];
  let deleted = 0;

  if (!fs.existsSync(mediaDir)) {
    logger.info({ mediaDir }, 'Media directory does not exist, skipping');
    return { deleted: 0, errors: [] };
  }

  // Find files matching pattern profile-{legacyId}-*
  const files = fs.readdirSync(mediaDir);

  for (const legacyId of legacyIds) {
    const pattern = `profile-${legacyId}-`;
    const matchingFiles = files.filter((f) => f.startsWith(pattern));

    for (const file of matchingFiles) {
      const filePath = path.join(mediaDir, file);

      try {
        if (dryRun) {
          logger.info({ file }, '[DRY RUN] Would delete media file');
          deleted++;
          continue;
        }

        fs.unlinkSync(filePath);
        logger.debug({ file }, 'Deleted media file');
        deleted++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Media ${file}: ${errorMessage}`);
        logger.error({ file, error: errorMessage }, 'Failed to delete media file');
      }
    }
  }

  return { deleted, errors };
}

/**
 * Run migration rollback
 */
export async function rollbackMigration(
  prisma: PrismaClient,
  options: RollbackOptions
): Promise<RollbackResult> {
  logger.info({ dryRun: options.dryRun }, 'Starting migration rollback');

  // Get legacy IDs
  let legacyIds: string[];
  if (options.legacyIds && options.legacyIds.length > 0) {
    legacyIds = options.legacyIds;
  } else if (options.exportFile) {
    legacyIds = getLegacyIdsFromExport(options.exportFile);
  } else {
    throw new Error('Either exportFile or legacyIds must be provided');
  }

  logger.info({ count: legacyIds.length }, 'Legacy IDs to rollback');

  const allErrors: string[] = [];

  // Delete profiles first (before users, in case cascade is not set up)
  logger.info('Deleting profiles...');
  const profileResult = await deleteProfiles(prisma, legacyIds, options.dryRun);
  allErrors.push(...profileResult.errors);

  // Delete users
  logger.info('Deleting users...');
  const userResult = await deleteUsers(prisma, legacyIds, options.dryRun);
  allErrors.push(...userResult.errors);

  // Delete media files if directory provided
  let mediaResult = { deleted: 0, errors: [] as string[] };
  if (options.mediaDir) {
    logger.info('Deleting media files...');
    mediaResult = deleteMediaFiles(legacyIds, options.mediaDir, options.dryRun);
    allErrors.push(...mediaResult.errors);
  }

  const result: RollbackResult = {
    profilesDeleted: profileResult.deleted,
    usersDeleted: userResult.deleted,
    mediaFilesDeleted: mediaResult.deleted,
    errors: allErrors,
  };

  logger.info(
    {
      profiles: result.profilesDeleted,
      users: result.usersDeleted,
      media: result.mediaFilesDeleted,
      errors: result.errors.length,
      dryRun: options.dryRun,
    },
    'Rollback complete'
  );

  return result;
}

/**
 * Generate a rollback summary report
 */
export function generateRollbackSummary(result: RollbackResult, dryRun: boolean): string {
  const lines: string[] = [
    '=== Migration Rollback Summary ===',
    dryRun ? '[DRY RUN - No changes made]' : '',
    '',
    `Profiles deleted: ${result.profilesDeleted}`,
    `Users deleted: ${result.usersDeleted}`,
    `Media files deleted: ${result.mediaFilesDeleted}`,
    '',
  ];

  if (result.errors.length > 0) {
    lines.push('--- Errors ---');
    for (const error of result.errors) {
      lines.push(`  - ${error}`);
    }
  } else {
    lines.push('No errors encountered.');
  }

  return lines.filter(Boolean).join('\n');
}
