/**
 * Media file migrator
 * Handles migration of photos from WordPress uploads to new storage
 */

import * as fs from 'fs';
import * as path from 'path';
import { MediaMigrationResult, MigrationOptions, ParsedWordPressProfile } from './types';
import logger from '../../lib/logger';

/**
 * Extract the relative path from a WordPress media URL or path
 * WordPress stores paths like "wp-content/uploads/2023/06/photo.jpg"
 */
export function extractRelativePath(urlOrPath: string): string {
  // Handle full URLs
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    try {
      const url = new URL(urlOrPath);
      return url.pathname.replace(/^\//, '');
    } catch {
      // Not a valid URL, treat as path
    }
  }

  // Remove leading slash if present
  return urlOrPath.replace(/^\//, '');
}

/**
 * Get the file extension from a path
 */
function getExtension(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return ext || '.jpg'; // Default to jpg if no extension
}

/**
 * Generate new filename for migrated media
 */
function generateNewFilename(legacyId: string, index: number, originalPath: string): string {
  const ext = getExtension(originalPath);
  return `profile-${legacyId}-${index}${ext}`;
}

/**
 * Copy a single media file
 */
export async function copyMediaFile(
  uploadsDir: string,
  destinationDir: string,
  relativePath: string,
  newFilename: string,
  dryRun: boolean
): Promise<MediaMigrationResult> {
  const sourcePath = path.join(uploadsDir, relativePath);
  const destinationPath = path.join(destinationDir, newFilename);

  try {
    // Check source exists
    if (!fs.existsSync(sourcePath)) {
      return {
        success: false,
        sourcePath: relativePath,
        error: 'Source file not found',
      };
    }

    // Dry run - just report what would happen
    if (dryRun) {
      logger.info({ source: relativePath, destination: newFilename }, '[DRY RUN] Would copy file');
      return {
        success: true,
        sourcePath: relativePath,
        destinationPath: newFilename,
      };
    }

    // Ensure destination directory exists
    const destDir = path.dirname(destinationPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Check if destination already exists
    if (fs.existsSync(destinationPath)) {
      logger.info({ destination: newFilename }, 'Destination file already exists, skipping');
      return {
        success: true,
        sourcePath: relativePath,
        destinationPath: newFilename,
        skipped: true,
      };
    }

    // Copy the file
    fs.copyFileSync(sourcePath, destinationPath);

    logger.debug({ source: relativePath, destination: newFilename }, 'Copied media file');

    return {
      success: true,
      sourcePath: relativePath,
      destinationPath: newFilename,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logger.error({ source: relativePath, error: errorMessage }, 'Failed to copy media file');

    return {
      success: false,
      sourcePath: relativePath,
      error: errorMessage,
    };
  }
}

/**
 * Migrate all media files for a single profile
 */
export async function migrateProfileMedia(
  profile: ParsedWordPressProfile,
  options: MigrationOptions
): Promise<MediaMigrationResult[]> {
  const results: MediaMigrationResult[] = [];

  if (!options.uploadsDir) {
    logger.info('No uploads directory specified, skipping media migration');
    return results;
  }

  const destinationDir = options.mediaDestination || 'public/uploads/migrated';
  const photos = profile.photos || [];

  for (let i = 0; i < photos.length; i++) {
    const photoPath = photos[i];
    const relativePath = extractRelativePath(photoPath);
    const newFilename = generateNewFilename(profile.userId, i, photoPath);

    const result = await copyMediaFile(
      options.uploadsDir,
      destinationDir,
      relativePath,
      newFilename,
      options.dryRun
    );

    results.push(result);
  }

  return results;
}

/**
 * Migrate media for all profiles
 */
export async function migrateAllMedia(
  profiles: ParsedWordPressProfile[],
  options: MigrationOptions
): Promise<MediaMigrationResult[]> {
  const results: MediaMigrationResult[] = [];

  if (!options.uploadsDir) {
    logger.info('No uploads directory specified, skipping media migration');
    return results;
  }

  logger.info(
    { uploadsDir: options.uploadsDir, profiles: profiles.length },
    'Starting media migration'
  );

  for (const profile of profiles) {
    const profileResults = await migrateProfileMedia(profile, options);
    results.push(...profileResults);
  }

  // Log summary
  const succeeded = results.filter((r) => r.success && !r.skipped).length;
  const failed = results.filter((r) => !r.success).length;
  const skipped = results.filter((r) => r.skipped).length;

  logger.info({ total: results.length, succeeded, failed, skipped }, 'Media migration complete');

  return results;
}

/**
 * Get updated photo paths for a profile after migration
 */
export function getUpdatedPhotoPaths(
  profile: ParsedWordPressProfile,
  mediaResults: MediaMigrationResult[],
  baseUrl: string = '/uploads/migrated'
): string[] {
  const photos = profile.photos || [];
  const updatedPaths: string[] = [];

  for (let i = 0; i < photos.length; i++) {
    const photoPath = photos[i];
    const relativePath = extractRelativePath(photoPath);

    // Find the migration result for this photo
    const result = mediaResults.find((r) => r.sourcePath === relativePath);

    if (result?.success && result.destinationPath) {
      // Use new path
      updatedPaths.push(`${baseUrl}/${result.destinationPath}`);
    } else {
      // Keep original path (may be external URL)
      updatedPaths.push(photoPath);
    }
  }

  return updatedPaths;
}

/**
 * Check if WordPress uploads directory is accessible
 */
export function validateUploadsDirectory(uploadsDir: string): {
  valid: boolean;
  error?: string;
  fileCount?: number;
} {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return {
        valid: false,
        error: `Directory does not exist: ${uploadsDir}`,
      };
    }

    const stat = fs.statSync(uploadsDir);
    if (!stat.isDirectory()) {
      return {
        valid: false,
        error: `Path is not a directory: ${uploadsDir}`,
      };
    }

    // Count files recursively (just for info)
    let fileCount = 0;
    const countFiles = (dir: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const itemStat = fs.statSync(fullPath);
        if (itemStat.isDirectory()) {
          countFiles(fullPath);
        } else {
          fileCount++;
        }
      }
    };

    try {
      countFiles(uploadsDir);
    } catch {
      // Ignore count errors, just proceed
    }

    return {
      valid: true,
      fileCount,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
