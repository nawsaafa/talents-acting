#!/usr/bin/env npx ts-node
/**
 * WordPress to Prisma Migration CLI
 * Main orchestrator for migrating WordPress talent profiles
 *
 * Usage:
 *   npx ts-node scripts/migration/index.ts migrate --export-file data/export.json [options]
 *   npx ts-node scripts/migration/index.ts validate --export-file data/export.json
 *   npx ts-node scripts/migration/index.ts rollback --export-file data/export.json [options]
 */

import { PrismaClient } from '@prisma/client';
import { MigrationOptions, MigrationReport, DEFAULT_MIGRATION_OPTIONS } from './types';
import { parseWordPressExport, parseAllProfiles, getExportStats } from './wordpress-parser';
import { transformAllProfiles, validateTransformedProfile } from './data-transformer';
import { migrateUsers } from './user-migrator';
import { migrateProfiles } from './profile-migrator';
import { migrateAllMedia } from './media-migrator';
import { validateAllProfiles, findDuplicateEmails, generateValidationSummary } from './validator';
import { rollbackMigration, generateRollbackSummary, RollbackOptions } from './rollback';
import logger from '../../lib/logger';

const prisma = new PrismaClient();

/**
 * Parse command line arguments
 */
function parseArgs(): {
  command: 'migrate' | 'validate' | 'rollback' | 'help';
  options: MigrationOptions & { mediaDir?: string };
} {
  const args = process.argv.slice(2);
  const command = (args[0] || 'help') as 'migrate' | 'validate' | 'rollback' | 'help';

  const options: MigrationOptions & { mediaDir?: string } = {
    ...DEFAULT_MIGRATION_OPTIONS,
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--export-file':
      case '-e':
        options.exportFile = nextArg;
        i++;
        break;
      case '--uploads-dir':
      case '-u':
        options.uploadsDir = nextArg;
        i++;
        break;
      case '--media-destination':
      case '-m':
        options.mediaDestination = nextArg;
        i++;
        break;
      case '--media-dir':
        options.mediaDir = nextArg;
        i++;
        break;
      case '--dry-run':
      case '-d':
        options.dryRun = true;
        break;
      case '--no-skip-existing':
        options.skipExisting = false;
        break;
      case '--batch-size':
      case '-b':
        options.batchSize = parseInt(nextArg, 10) || 10;
        i++;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
    }
  }

  return { command, options };
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
WordPress to Prisma Migration CLI

Usage:
  npx ts-node scripts/migration/index.ts <command> [options]

Commands:
  migrate   Run the migration
  validate  Validate export file without migrating
  rollback  Rollback a previous migration
  help      Show this help message

Options:
  --export-file, -e <path>       Path to WordPress JSON export file (required)
  --uploads-dir, -u <path>       Path to WordPress wp-content/uploads directory
  --media-destination, -m <path> Destination for migrated media (default: public/uploads/migrated)
  --media-dir <path>             For rollback: directory containing migrated media
  --dry-run, -d                  Run without making database changes
  --no-skip-existing             Don't skip existing records (default: skip)
  --batch-size, -b <n>           Batch size for database operations (default: 10)
  --verbose, -v                  Enable verbose logging

Examples:
  # Validate export file
  npx ts-node scripts/migration/index.ts validate -e data/wordpress-export.json

  # Dry run migration
  npx ts-node scripts/migration/index.ts migrate -e data/wordpress-export.json --dry-run

  # Full migration with media
  npx ts-node scripts/migration/index.ts migrate -e data/wordpress-export.json -u /path/to/wp-content/uploads

  # Rollback migration
  npx ts-node scripts/migration/index.ts rollback -e data/wordpress-export.json
`);
}

/**
 * Run validation only
 */
async function runValidation(options: MigrationOptions): Promise<void> {
  if (!options.exportFile) {
    console.error('Error: --export-file is required');
    process.exit(1);
  }

  console.log('\n=== WordPress Export Validation ===\n');

  // Parse export
  console.log(`Reading export file: ${options.exportFile}`);
  const exportData = parseWordPressExport(options.exportFile);
  const stats = getExportStats(exportData);
  console.log(`  Users: ${stats.userCount}`);
  console.log(`  Meta entries: ${stats.metaCount}`);
  console.log(`  Attachments: ${stats.attachmentCount}`);
  if (stats.siteUrl) console.log(`  Site URL: ${stats.siteUrl}`);

  // Parse profiles
  console.log('\nParsing profiles...');
  const profiles = parseAllProfiles(exportData);
  console.log(`  Parsed ${profiles.length} profiles`);

  // Check for duplicate emails
  console.log('\nChecking for duplicate emails...');
  const duplicates = findDuplicateEmails(profiles);
  if (duplicates.size > 0) {
    console.log(`  Found ${duplicates.size} duplicate emails:`);
    for (const [email, ids] of duplicates) {
      console.log(`    ${email}: IDs ${ids.join(', ')}`);
    }
  } else {
    console.log('  No duplicate emails found');
  }

  // Validate profiles
  console.log('\nValidating profiles...');
  const validationReport = validateAllProfiles(profiles);
  console.log(generateValidationSummary(validationReport));

  // Transform and validate
  console.log('\nTransforming profiles...');
  const transformed = transformAllProfiles(profiles);
  let transformValid = 0;
  let transformInvalid = 0;
  for (const t of transformed) {
    const result = validateTransformedProfile(t);
    if (result.isValid) {
      transformValid++;
    } else {
      transformInvalid++;
      if (options.verbose) {
        console.log(`  Invalid: ${t.legacyId} - ${result.errors.join(', ')}`);
      }
    }
  }
  console.log(`  Transform valid: ${transformValid}`);
  console.log(`  Transform invalid: ${transformInvalid}`);

  console.log('\n=== Validation Complete ===\n');
}

/**
 * Run the full migration
 */
async function runMigration(options: MigrationOptions): Promise<MigrationReport> {
  if (!options.exportFile) {
    console.error('Error: --export-file is required');
    process.exit(1);
  }

  const report: MigrationReport = {
    startedAt: new Date(),
    dryRun: options.dryRun,
    usersTotal: 0,
    usersSucceeded: 0,
    usersFailed: 0,
    usersSkipped: 0,
    profilesTotal: 0,
    profilesSucceeded: 0,
    profilesFailed: 0,
    profilesSkipped: 0,
    mediaTotal: 0,
    mediaSucceeded: 0,
    mediaFailed: 0,
    mediaSkipped: 0,
    userResults: [],
    profileResults: [],
    mediaResults: [],
    errors: [],
    warnings: [],
  };

  console.log('\n=== WordPress to Prisma Migration ===\n');
  if (options.dryRun) {
    console.log('[DRY RUN MODE - No changes will be made]\n');
  }

  try {
    // Parse export
    console.log(`1. Reading export file: ${options.exportFile}`);
    const exportData = parseWordPressExport(options.exportFile);
    const stats = getExportStats(exportData);
    console.log(`   Users: ${stats.userCount}, Attachments: ${stats.attachmentCount}`);

    // Parse profiles
    console.log('\n2. Parsing profiles...');
    const profiles = parseAllProfiles(exportData);
    console.log(`   Parsed ${profiles.length} profiles`);

    // Validate
    console.log('\n3. Validating profiles...');
    const validationReport = validateAllProfiles(profiles);
    console.log(
      `   Valid: ${validationReport.validProfiles}, Invalid: ${validationReport.invalidProfiles}`
    );

    if (validationReport.invalidProfiles > 0) {
      console.log('\n   Warning: Some profiles have validation errors.');
      console.log('   Invalid profiles will be skipped.');
    }

    // Transform
    console.log('\n4. Transforming profiles...');
    const transformed = transformAllProfiles(profiles);
    console.log(`   Transformed ${transformed.length} profiles`);

    // Migrate users
    console.log('\n5. Migrating users...');
    report.usersTotal = transformed.length;
    const userResults = await migrateUsers(prisma, transformed, options);
    report.userResults = userResults;
    report.usersSucceeded = userResults.filter((r) => r.success && !r.skipped).length;
    report.usersFailed = userResults.filter((r) => !r.success).length;
    report.usersSkipped = userResults.filter((r) => r.skipped).length;
    console.log(
      `   Succeeded: ${report.usersSucceeded}, Failed: ${report.usersFailed}, Skipped: ${report.usersSkipped}`
    );

    // Migrate profiles
    console.log('\n6. Migrating profiles...');
    report.profilesTotal = transformed.length;
    const profileResults = await migrateProfiles(prisma, transformed, options);
    report.profileResults = profileResults;
    report.profilesSucceeded = profileResults.filter((r) => r.success && !r.skipped).length;
    report.profilesFailed = profileResults.filter((r) => !r.success).length;
    report.profilesSkipped = profileResults.filter((r) => r.skipped).length;
    console.log(
      `   Succeeded: ${report.profilesSucceeded}, Failed: ${report.profilesFailed}, Skipped: ${report.profilesSkipped}`
    );

    // Migrate media
    if (options.uploadsDir) {
      console.log('\n7. Migrating media...');
      const mediaResults = await migrateAllMedia(profiles, options);
      report.mediaResults = mediaResults;
      report.mediaTotal = mediaResults.length;
      report.mediaSucceeded = mediaResults.filter((r) => r.success && !r.skipped).length;
      report.mediaFailed = mediaResults.filter((r) => !r.success).length;
      report.mediaSkipped = mediaResults.filter((r) => r.skipped).length;
      console.log(
        `   Succeeded: ${report.mediaSucceeded}, Failed: ${report.mediaFailed}, Skipped: ${report.mediaSkipped}`
      );
    } else {
      console.log('\n7. Skipping media migration (no --uploads-dir specified)');
    }

    report.completedAt = new Date();

    // Print summary
    console.log('\n=== Migration Summary ===\n');
    console.log(
      `Duration: ${Math.round((report.completedAt.getTime() - report.startedAt.getTime()) / 1000)}s`
    );
    console.log(
      `Users: ${report.usersSucceeded} migrated, ${report.usersSkipped} skipped, ${report.usersFailed} failed`
    );
    console.log(
      `Profiles: ${report.profilesSucceeded} migrated, ${report.profilesSkipped} skipped, ${report.profilesFailed} failed`
    );
    console.log(
      `Media: ${report.mediaSucceeded} migrated, ${report.mediaSkipped} skipped, ${report.mediaFailed} failed`
    );

    if (options.dryRun) {
      console.log('\n[DRY RUN - No changes were made]');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    report.errors.push(errorMessage);
    logger.error({ error: errorMessage }, 'Migration failed');
    console.error(`\nMigration failed: ${errorMessage}`);
  }

  return report;
}

/**
 * Run rollback
 */
async function runRollback(options: MigrationOptions & { mediaDir?: string }): Promise<void> {
  if (!options.exportFile) {
    console.error('Error: --export-file is required');
    process.exit(1);
  }

  console.log('\n=== Migration Rollback ===\n');
  if (options.dryRun) {
    console.log('[DRY RUN MODE - No changes will be made]\n');
  }

  const rollbackOptions: RollbackOptions = {
    dryRun: options.dryRun,
    exportFile: options.exportFile,
    mediaDir: options.mediaDir || options.mediaDestination,
    verbose: options.verbose,
  };

  const result = await rollbackMigration(prisma, rollbackOptions);
  console.log(generateRollbackSummary(result, options.dryRun));
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const { command, options } = parseArgs();

  try {
    switch (command) {
      case 'migrate':
        await runMigration(options);
        break;
      case 'validate':
        await runValidation(options);
        break;
      case 'rollback':
        await runRollback(options);
        break;
      case 'help':
      default:
        printHelp();
        break;
    }
  } catch (error) {
    logger.error({ error }, 'Command failed');
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
