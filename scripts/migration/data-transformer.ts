/**
 * Data transformer for WordPress to Prisma migration
 * Transforms parsed WordPress profiles to Prisma-compatible format
 */

import { Prisma } from '@prisma/client';
import { ParsedWordPressProfile } from './types';
import {
  GENDER_MAPPING,
  PHYSIQUE_MAPPING,
  HAIR_COLOR_MAPPING,
  EYE_COLOR_MAPPING,
  HAIR_LENGTH_MAPPING,
  BEARD_TYPE_MAPPING,
  AVAILABILITY_TYPE_MAPPING,
  mapEnum,
  parseDate,
  MAX_ARRAY_LENGTHS,
} from './config';
import logger from '../../lib/logger';

/**
 * Result of transforming a profile
 */
export interface TransformedProfile {
  user: Prisma.UserCreateInput;
  profile: Omit<Prisma.TalentProfileCreateInput, 'user'>;
  legacyId: string;
  warnings: string[];
}

/**
 * Truncate an array to maximum length with warning
 */
function truncateArray(arr: string[], fieldName: string, warnings: string[]): string[] {
  const maxLength = MAX_ARRAY_LENGTHS[fieldName];
  if (maxLength && arr.length > maxLength) {
    warnings.push(`${fieldName} truncated from ${arr.length} to ${maxLength} items`);
    return arr.slice(0, maxLength);
  }
  return arr;
}

/**
 * Transliterate non-ASCII characters to ASCII equivalents
 * Used for names and text fields to ensure ASCII-only storage
 */
export function transliterateToAscii(text: string): string {
  if (!text) return text;

  // Common Arabic/French character mappings
  const mappings: Record<string, string> = {
    // French accents
    '\u00e0': 'a',
    '\u00e2': 'a',
    '\u00e4': 'a',
    '\u00e8': 'e',
    '\u00e9': 'e',
    '\u00ea': 'e',
    '\u00eb': 'e',
    '\u00ee': 'i',
    '\u00ef': 'i',
    '\u00f4': 'o',
    '\u00f6': 'o',
    '\u00f9': 'u',
    '\u00fb': 'u',
    '\u00fc': 'u',
    '\u00e7': 'c',
    '\u00c0': 'A',
    '\u00c2': 'A',
    '\u00c4': 'A',
    '\u00c8': 'E',
    '\u00c9': 'E',
    '\u00ca': 'E',
    '\u00cb': 'E',
    '\u00ce': 'I',
    '\u00cf': 'I',
    '\u00d4': 'O',
    '\u00d6': 'O',
    '\u00d9': 'U',
    '\u00db': 'U',
    '\u00dc': 'U',
    '\u00c7': 'C',
  };

  let result = text;
  for (const [char, replacement] of Object.entries(mappings)) {
    result = result.replace(new RegExp(char, 'g'), replacement);
  }

  // Remove any remaining non-ASCII characters
  result = result.replace(/[^\x00-\x7F]/g, '');

  return result;
}

/**
 * Generate a random password for migrated users
 * Users will be required to reset their password on first login
 */
function generateRandomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Transform availability type strings to enum values
 */
function transformAvailabilityTypes(
  types: string[] | undefined,
  warnings: string[]
): Prisma.TalentProfileCreateInput['availabilityTypes'] {
  if (!types || types.length === 0) return [];

  const result: Prisma.TalentProfileCreateInput['availabilityTypes'] = [];

  for (const type of types) {
    const mapped = mapEnum(type, AVAILABILITY_TYPE_MAPPING);
    if (mapped) {
      result.push(mapped);
    } else {
      warnings.push(`Unknown availability type: "${type}"`);
    }
  }

  return result;
}

/**
 * Transform a parsed WordPress profile to Prisma format
 */
export function transformProfile(parsed: ParsedWordPressProfile): TransformedProfile {
  const warnings: string[] = [];

  // Transform gender
  const gender = mapEnum(parsed.gender, GENDER_MAPPING);
  if (!gender && parsed.gender) {
    warnings.push(`Unknown gender value: "${parsed.gender}", defaulting to OTHER`);
  }

  // Transform physical attributes
  const physique = mapEnum(parsed.physique, PHYSIQUE_MAPPING);
  if (!physique && parsed.physique) {
    warnings.push(`Unknown physique value: "${parsed.physique}"`);
  }

  const hairColor = mapEnum(parsed.hairColor, HAIR_COLOR_MAPPING);
  if (!hairColor && parsed.hairColor) {
    warnings.push(`Unknown hair color value: "${parsed.hairColor}"`);
  }

  const eyeColor = mapEnum(parsed.eyeColor, EYE_COLOR_MAPPING);
  if (!eyeColor && parsed.eyeColor) {
    warnings.push(`Unknown eye color value: "${parsed.eyeColor}"`);
  }

  const hairLength = mapEnum(parsed.hairLength, HAIR_LENGTH_MAPPING);
  if (!hairLength && parsed.hairLength) {
    warnings.push(`Unknown hair length value: "${parsed.hairLength}"`);
  }

  const beardType = mapEnum(parsed.beardType, BEARD_TYPE_MAPPING);
  if (!beardType && parsed.beardType) {
    warnings.push(`Unknown beard type value: "${parsed.beardType}"`);
  }

  // Transform dates
  const dateOfBirth = parseDate(parsed.birthDate);
  const createdAt = parseDate(parsed.registeredAt) || new Date();

  // Generate random password (user will need to reset)
  const randomPassword = generateRandomPassword();

  // Build user create input
  const user: Prisma.UserCreateInput = {
    email: parsed.email.toLowerCase().trim(),
    password: randomPassword, // Will be hashed by bcrypt in migrator
    role: 'TALENT',
    isActive: true,
    legacyId: parsed.userId,
    createdAt,
  };

  // Build profile create input
  const profile: Omit<Prisma.TalentProfileCreateInput, 'user'> = {
    legacyId: parsed.userId,

    // Basic info
    firstName: transliterateToAscii(parsed.firstName || ''),
    lastName: transliterateToAscii(parsed.lastName || ''),
    gender: gender || 'OTHER',
    ageRangeMin: parsed.ageMin || 18,
    ageRangeMax: parsed.ageMax || parsed.ageMin || 25,
    dateOfBirth,
    birthPlace: parsed.birthPlace ? transliterateToAscii(parsed.birthPlace) : undefined,

    // Physical attributes
    height: parsed.height,
    physique,
    ethnicAppearance: parsed.ethnicAppearance
      ? transliterateToAscii(parsed.ethnicAppearance)
      : undefined,
    hairColor,
    eyeColor,
    hairLength,
    beardType,
    hasTattoos: parsed.hasTattoos || false,
    hasScars: parsed.hasScars || false,
    tattooDescription: parsed.tattooDescription
      ? transliterateToAscii(parsed.tattooDescription)
      : undefined,
    scarDescription: parsed.scarDescription
      ? transliterateToAscii(parsed.scarDescription)
      : undefined,

    // Skills arrays (truncated to max lengths)
    languages: truncateArray(parsed.languages || [], 'languages', warnings),
    accents: truncateArray(parsed.accents || [], 'accents', warnings),
    athleticSkills: truncateArray(parsed.athleticSkills || [], 'athleticSkills', warnings),
    musicalInstruments: truncateArray(
      parsed.musicalInstruments || [],
      'musicalInstruments',
      warnings
    ),
    performanceSkills: truncateArray(parsed.performanceSkills || [], 'performanceSkills', warnings),
    danceStyles: truncateArray(parsed.danceStyles || [], 'danceStyles', warnings),

    // Media
    photos: truncateArray(parsed.photos || [], 'photos', warnings),
    videoUrls: truncateArray(parsed.videoUrls || [], 'videoUrls', warnings),
    presentationVideo: parsed.presentationVideo,
    showreel: parsed.showreel,
    hasShowreel: !!parsed.showreel,

    // Availability
    isAvailable: parsed.isAvailable ?? true,
    availabilityTypes: transformAvailabilityTypes(parsed.availabilityTypes, warnings),
    dailyRate: parsed.dailyRate ? new Prisma.Decimal(parsed.dailyRate) : undefined,
    rateNegotiable: parsed.rateNegotiable ?? true,
    imdbUrl: parsed.imdbUrl,

    // Contact and bio
    bio: parsed.bio ? transliterateToAscii(parsed.bio) : undefined,
    location: parsed.location ? transliterateToAscii(parsed.location) : undefined,
    contactEmail: parsed.contactEmail?.toLowerCase().trim(),
    contactPhone: parsed.contactPhone,
    portfolio: truncateArray(parsed.portfolio || [], 'portfolio', warnings),
    socialMedia: parsed.socialMedia,

    // Validation status - migrated profiles are pre-approved
    validationStatus: 'APPROVED',
    validatedAt: new Date(),
    isPublic: true,

    // Subscription - start with NONE, can be upgraded
    subscriptionStatus: 'NONE',

    // Timestamps
    createdAt,
  };

  // Log warnings
  if (warnings.length > 0) {
    logger.warn({ legacyId: parsed.userId, warnings }, 'Transform warnings for profile');
  }

  return {
    user,
    profile,
    legacyId: parsed.userId,
    warnings,
  };
}

/**
 * Transform multiple profiles
 */
export function transformAllProfiles(profiles: ParsedWordPressProfile[]): TransformedProfile[] {
  const results: TransformedProfile[] = [];

  for (const profile of profiles) {
    try {
      const transformed = transformProfile(profile);
      results.push(transformed);
    } catch (error) {
      logger.error({ legacyId: profile.userId, error }, 'Failed to transform profile');
      // Continue with other profiles
    }
  }

  logger.info({ total: profiles.length, transformed: results.length }, 'Transformed profiles');

  return results;
}

/**
 * Validate that a transformed profile has required fields
 */
export function validateTransformedProfile(transformed: TransformedProfile): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check user fields
  if (!transformed.user.email) {
    errors.push('Missing email');
  }

  // Check profile fields
  if (!transformed.profile.firstName) {
    errors.push('Missing firstName');
  }
  if (!transformed.profile.lastName) {
    errors.push('Missing lastName');
  }
  if (!transformed.profile.gender) {
    errors.push('Missing gender');
  }
  if (transformed.profile.ageRangeMin === undefined || transformed.profile.ageRangeMin < 1) {
    errors.push('Invalid ageRangeMin');
  }
  if (transformed.profile.ageRangeMax === undefined || transformed.profile.ageRangeMax < 1) {
    errors.push('Invalid ageRangeMax');
  }
  if (
    transformed.profile.ageRangeMin !== undefined &&
    transformed.profile.ageRangeMax !== undefined &&
    transformed.profile.ageRangeMin > transformed.profile.ageRangeMax
  ) {
    errors.push('ageRangeMin greater than ageRangeMax');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
