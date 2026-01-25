/**
 * Migration data validator
 * Validates parsed profiles and generates validation reports
 */

import {
  ParsedWordPressProfile,
  ValidationIssue,
  ValidationResult,
  ValidationReport,
} from './types';
import {
  REQUIRED_PROFILE_FIELDS,
  MIN_VALUES,
  MAX_VALUES,
  MAX_ARRAY_LENGTHS,
  GENDER_MAPPING,
} from './config';
import logger from '../../lib/logger';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string contains only ASCII characters
 */
export function isAsciiOnly(text: string): boolean {
  return /^[\x00-\x7F]*$/.test(text);
}

/**
 * Validate a single parsed profile
 */
export function validateProfile(profile: ParsedWordPressProfile): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Check required fields
  for (const field of REQUIRED_PROFILE_FIELDS) {
    const value = profile[field as keyof ParsedWordPressProfile];
    if (value === undefined || value === null || value === '') {
      // Special handling for gender - check if it can be mapped
      if (field === 'gender' && profile.gender) {
        const normalized = profile.gender.toLowerCase().trim();
        if (!GENDER_MAPPING[normalized]) {
          issues.push({
            type: 'error',
            field,
            message: `Unknown gender value: "${profile.gender}"`,
            legacyId: profile.userId,
            value: profile.gender,
          });
        }
      } else {
        issues.push({
          type: 'error',
          field,
          message: `Required field is missing`,
          legacyId: profile.userId,
        });
      }
    }
  }

  // Validate email
  if (profile.email && !isValidEmail(profile.email)) {
    issues.push({
      type: 'error',
      field: 'email',
      message: 'Invalid email format',
      legacyId: profile.userId,
      value: profile.email,
    });
  }

  // Validate numeric ranges
  if (profile.ageMin !== undefined) {
    if (profile.ageMin < MIN_VALUES.ageMin) {
      issues.push({
        type: 'warning',
        field: 'ageMin',
        message: `Age below minimum (${MIN_VALUES.ageMin})`,
        legacyId: profile.userId,
        value: profile.ageMin,
      });
    }
    if (profile.ageMin > MAX_VALUES.ageMin) {
      issues.push({
        type: 'warning',
        field: 'ageMin',
        message: `Age above maximum (${MAX_VALUES.ageMin})`,
        legacyId: profile.userId,
        value: profile.ageMax,
      });
    }
  }

  if (profile.ageMax !== undefined) {
    if (profile.ageMax < MIN_VALUES.ageMax) {
      issues.push({
        type: 'warning',
        field: 'ageMax',
        message: `Age below minimum (${MIN_VALUES.ageMax})`,
        legacyId: profile.userId,
        value: profile.ageMax,
      });
    }
    if (profile.ageMax > MAX_VALUES.ageMax) {
      issues.push({
        type: 'warning',
        field: 'ageMax',
        message: `Age above maximum (${MAX_VALUES.ageMax})`,
        legacyId: profile.userId,
        value: profile.ageMax,
      });
    }
  }

  // Validate age range consistency
  if (
    profile.ageMin !== undefined &&
    profile.ageMax !== undefined &&
    profile.ageMin > profile.ageMax
  ) {
    issues.push({
      type: 'warning',
      field: 'ageRange',
      message: 'ageMin is greater than ageMax',
      legacyId: profile.userId,
      value: { min: profile.ageMin, max: profile.ageMax },
    });
  }

  // Validate height
  if (profile.height !== undefined) {
    if (profile.height < MIN_VALUES.height) {
      issues.push({
        type: 'warning',
        field: 'height',
        message: `Height below minimum (${MIN_VALUES.height}cm)`,
        legacyId: profile.userId,
        value: profile.height,
      });
    }
    if (profile.height > MAX_VALUES.height) {
      issues.push({
        type: 'warning',
        field: 'height',
        message: `Height above maximum (${MAX_VALUES.height}cm)`,
        legacyId: profile.userId,
        value: profile.height,
      });
    }
  }

  // Validate array lengths
  const arrayFields = [
    'languages',
    'accents',
    'athleticSkills',
    'musicalInstruments',
    'performanceSkills',
    'danceStyles',
    'photos',
    'videoUrls',
    'portfolio',
  ] as const;

  for (const field of arrayFields) {
    const arr = profile[field];
    if (arr && Array.isArray(arr)) {
      const maxLength = MAX_ARRAY_LENGTHS[field];
      if (maxLength && arr.length > maxLength) {
        issues.push({
          type: 'warning',
          field,
          message: `Array exceeds maximum length (${arr.length} > ${maxLength})`,
          legacyId: profile.userId,
          value: arr.length,
        });
      }
    }
  }

  // Validate URLs
  if (profile.imdbUrl && !isValidUrl(profile.imdbUrl)) {
    issues.push({
      type: 'warning',
      field: 'imdbUrl',
      message: 'Invalid IMDB URL format',
      legacyId: profile.userId,
      value: profile.imdbUrl,
    });
  }

  if (profile.showreel && !isValidUrl(profile.showreel)) {
    issues.push({
      type: 'warning',
      field: 'showreel',
      message: 'Invalid showreel URL format',
      legacyId: profile.userId,
      value: profile.showreel,
    });
  }

  if (profile.presentationVideo && !isValidUrl(profile.presentationVideo)) {
    issues.push({
      type: 'warning',
      field: 'presentationVideo',
      message: 'Invalid presentation video URL format',
      legacyId: profile.userId,
      value: profile.presentationVideo,
    });
  }

  // Check for non-ASCII characters in text fields
  const textFields = ['firstName', 'lastName', 'birthPlace', 'bio', 'location'] as const;
  for (const field of textFields) {
    const value = profile[field];
    if (value && !isAsciiOnly(value)) {
      issues.push({
        type: 'warning',
        field,
        message: 'Contains non-ASCII characters (will be transliterated)',
        legacyId: profile.userId,
      });
    }
  }

  // Determine if profile is valid (no errors, warnings are OK)
  const hasErrors = issues.some((i) => i.type === 'error');

  return {
    isValid: !hasErrors,
    legacyId: profile.userId,
    issues,
  };
}

/**
 * Validate all profiles and generate a report
 */
export function validateAllProfiles(profiles: ParsedWordPressProfile[]): ValidationReport {
  const results: ValidationResult[] = [];
  let errorCount = 0;
  let warningCount = 0;

  for (const profile of profiles) {
    const result = validateProfile(profile);
    results.push(result);

    for (const issue of result.issues) {
      if (issue.type === 'error') {
        errorCount++;
      } else {
        warningCount++;
      }
    }
  }

  const validProfiles = results.filter((r) => r.isValid).length;
  const invalidProfiles = results.filter((r) => !r.isValid).length;

  logger.info(
    {
      total: profiles.length,
      valid: validProfiles,
      invalid: invalidProfiles,
      errors: errorCount,
      warnings: warningCount,
    },
    'Validation complete'
  );

  return {
    totalProfiles: profiles.length,
    validProfiles,
    invalidProfiles,
    results,
    errorCount,
    warningCount,
  };
}

/**
 * Check for duplicate emails in the parsed profiles
 */
export function findDuplicateEmails(profiles: ParsedWordPressProfile[]): Map<string, string[]> {
  const emailToIds = new Map<string, string[]>();

  for (const profile of profiles) {
    const email = profile.email.toLowerCase();
    if (!emailToIds.has(email)) {
      emailToIds.set(email, []);
    }
    emailToIds.get(email)!.push(profile.userId);
  }

  // Filter to only duplicates
  const duplicates = new Map<string, string[]>();
  for (const [email, ids] of emailToIds) {
    if (ids.length > 1) {
      duplicates.set(email, ids);
    }
  }

  if (duplicates.size > 0) {
    logger.warn({ count: duplicates.size }, 'Found duplicate emails in export');
  }

  return duplicates;
}

/**
 * Generate a human-readable validation summary
 */
export function generateValidationSummary(report: ValidationReport): string {
  const lines: string[] = [
    '=== Validation Summary ===',
    '',
    `Total profiles: ${report.totalProfiles}`,
    `Valid: ${report.validProfiles}`,
    `Invalid: ${report.invalidProfiles}`,
    `Errors: ${report.errorCount}`,
    `Warnings: ${report.warningCount}`,
    '',
  ];

  // List invalid profiles
  const invalid = report.results.filter((r) => !r.isValid);
  if (invalid.length > 0) {
    lines.push('--- Invalid Profiles ---');
    for (const result of invalid) {
      lines.push(`\nLegacy ID: ${result.legacyId}`);
      for (const issue of result.issues) {
        const prefix = issue.type === 'error' ? '[ERROR]' : '[WARN]';
        lines.push(`  ${prefix} ${issue.field}: ${issue.message}`);
      }
    }
  }

  // List profiles with warnings only
  const withWarnings = report.results.filter((r) => r.isValid && r.issues.length > 0);
  if (withWarnings.length > 0) {
    lines.push('\n--- Profiles with Warnings ---');
    for (const result of withWarnings) {
      lines.push(`\nLegacy ID: ${result.legacyId}`);
      for (const issue of result.issues) {
        lines.push(`  [WARN] ${issue.field}: ${issue.message}`);
      }
    }
  }

  return lines.join('\n');
}
