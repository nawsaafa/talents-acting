/**
 * Field mapping configuration for WordPress to Prisma migration
 * Maps WordPress meta keys to TalentProfile fields with transformation rules
 */

import {
  Gender,
  Physique,
  HairColor,
  EyeColor,
  HairLength,
  BeardType,
  AvailabilityType,
} from '@prisma/client';

// =============================================================================
// WordPress Meta Key Mappings
// =============================================================================

/**
 * Maps WordPress usermeta keys to parsed profile fields
 */
export const META_KEY_MAPPINGS: Record<string, string> = {
  // Basic info
  first_name: 'firstName',
  last_name: 'lastName',
  gender: 'gender',
  age_min: 'ageMin',
  age_max: 'ageMax',
  birth_date: 'birthDate',
  birth_place: 'birthPlace',

  // Physical attributes
  height: 'height',
  physique: 'physique',
  ethnic_appearance: 'ethnicAppearance',
  hair_color: 'hairColor',
  eye_color: 'eyeColor',
  hair_length: 'hairLength',
  beard_type: 'beardType',
  has_tattoos: 'hasTattoos',
  has_scars: 'hasScars',
  tattoo_description: 'tattooDescription',
  scar_description: 'scarDescription',

  // Skills
  languages: 'languages',
  accents: 'accents',
  athletic_skills: 'athleticSkills',
  skills: 'athleticSkills', // Alternative key
  musical_instruments: 'musicalInstruments',
  instruments: 'musicalInstruments', // Alternative key
  performance_skills: 'performanceSkills',
  dance_styles: 'danceStyles',

  // Media
  photos: 'photos',
  profile_photos: 'photos', // Alternative key
  video_urls: 'videoUrls',
  videos: 'videoUrls', // Alternative key
  presentation_video: 'presentationVideo',
  showreel: 'showreel',
  demo_reel: 'showreel', // Alternative key

  // Availability
  is_available: 'isAvailable',
  availability: 'isAvailable', // Alternative key
  availability_types: 'availabilityTypes',
  daily_rate: 'dailyRate',
  rate: 'dailyRate', // Alternative key
  rate_negotiable: 'rateNegotiable',

  // Contact and bio
  bio: 'bio',
  biography: 'bio', // Alternative key
  description: 'bio', // Alternative key
  location: 'location',
  city: 'location', // Alternative key
  contact_email: 'contactEmail',
  contact_phone: 'contactPhone',
  phone: 'contactPhone', // Alternative key
  imdb_url: 'imdbUrl',
  imdb: 'imdbUrl', // Alternative key
  portfolio: 'portfolio',
  social_media: 'socialMedia',
};

// =============================================================================
// Enum Mappings
// =============================================================================

/**
 * Maps WordPress gender values to Prisma Gender enum
 */
export const GENDER_MAPPING: Record<string, Gender> = {
  male: Gender.MALE,
  m: Gender.MALE,
  homme: Gender.MALE,
  female: Gender.FEMALE,
  f: Gender.FEMALE,
  femme: Gender.FEMALE,
  non_binary: Gender.NON_BINARY,
  nonbinary: Gender.NON_BINARY,
  'non-binary': Gender.NON_BINARY,
  other: Gender.OTHER,
  autre: Gender.OTHER,
};

/**
 * Maps WordPress physique values to Prisma Physique enum
 */
export const PHYSIQUE_MAPPING: Record<string, Physique> = {
  slim: Physique.SLIM,
  mince: Physique.SLIM,
  thin: Physique.SLIM,
  average: Physique.AVERAGE,
  normal: Physique.AVERAGE,
  moyen: Physique.AVERAGE,
  athletic: Physique.ATHLETIC,
  athletique: Physique.ATHLETIC,
  fit: Physique.ATHLETIC,
  muscular: Physique.MUSCULAR,
  muscle: Physique.MUSCULAR,
  curvy: Physique.CURVY,
  plus_size: Physique.PLUS_SIZE,
  'plus-size': Physique.PLUS_SIZE,
  large: Physique.PLUS_SIZE,
};

/**
 * Maps WordPress hair color values to Prisma HairColor enum
 */
export const HAIR_COLOR_MAPPING: Record<string, HairColor> = {
  black: HairColor.BLACK,
  noir: HairColor.BLACK,
  brown: HairColor.BROWN,
  brun: HairColor.BROWN,
  marron: HairColor.BROWN,
  blonde: HairColor.BLONDE,
  blond: HairColor.BLONDE,
  red: HairColor.RED,
  roux: HairColor.RED,
  ginger: HairColor.RED,
  gray: HairColor.GRAY,
  grey: HairColor.GRAY,
  gris: HairColor.GRAY,
  white: HairColor.WHITE,
  blanc: HairColor.WHITE,
  other: HairColor.OTHER,
  autre: HairColor.OTHER,
};

/**
 * Maps WordPress eye color values to Prisma EyeColor enum
 */
export const EYE_COLOR_MAPPING: Record<string, EyeColor> = {
  brown: EyeColor.BROWN,
  brun: EyeColor.BROWN,
  marron: EyeColor.BROWN,
  blue: EyeColor.BLUE,
  bleu: EyeColor.BLUE,
  green: EyeColor.GREEN,
  vert: EyeColor.GREEN,
  hazel: EyeColor.HAZEL,
  noisette: EyeColor.HAZEL,
  gray: EyeColor.GRAY,
  grey: EyeColor.GRAY,
  gris: EyeColor.GRAY,
  other: EyeColor.OTHER,
  autre: EyeColor.OTHER,
};

/**
 * Maps WordPress hair length values to Prisma HairLength enum
 */
export const HAIR_LENGTH_MAPPING: Record<string, HairLength> = {
  bald: HairLength.BALD,
  chauve: HairLength.BALD,
  none: HairLength.BALD,
  short: HairLength.SHORT,
  court: HairLength.SHORT,
  medium: HairLength.MEDIUM,
  moyen: HairLength.MEDIUM,
  long: HairLength.LONG,
  longs: HairLength.LONG,
};

/**
 * Maps WordPress beard type values to Prisma BeardType enum
 */
export const BEARD_TYPE_MAPPING: Record<string, BeardType> = {
  none: BeardType.NONE,
  aucune: BeardType.NONE,
  clean: BeardType.NONE,
  stubble: BeardType.STUBBLE,
  barbe_3_jours: BeardType.STUBBLE,
  short: BeardType.SHORT,
  courte: BeardType.SHORT,
  medium: BeardType.MEDIUM,
  moyenne: BeardType.MEDIUM,
  long: BeardType.LONG,
  longue: BeardType.LONG,
  full: BeardType.FULL,
  complete: BeardType.FULL,
};

/**
 * Maps WordPress availability values to Prisma AvailabilityType enum
 */
export const AVAILABILITY_TYPE_MAPPING: Record<string, AvailabilityType> = {
  always: AvailabilityType.ALWAYS,
  toujours: AvailabilityType.ALWAYS,
  short_term: AvailabilityType.SHORT_TERM_1_2_DAYS,
  'short-term': AvailabilityType.SHORT_TERM_1_2_DAYS,
  '1-2_days': AvailabilityType.SHORT_TERM_1_2_DAYS,
  medium_term: AvailabilityType.MEDIUM_TERM_1_2_WEEKS,
  'medium-term': AvailabilityType.MEDIUM_TERM_1_2_WEEKS,
  '1-2_weeks': AvailabilityType.MEDIUM_TERM_1_2_WEEKS,
  long_term: AvailabilityType.LONG_TERM_1_4_MONTHS,
  'long-term': AvailabilityType.LONG_TERM_1_4_MONTHS,
  '1-4_months': AvailabilityType.LONG_TERM_1_4_MONTHS,
  weekends_and_holidays: AvailabilityType.WEEKENDS_AND_HOLIDAYS,
  'weekends-holidays': AvailabilityType.WEEKENDS_AND_HOLIDAYS,
  holidays_only: AvailabilityType.HOLIDAYS_ONLY,
  'holidays-only': AvailabilityType.HOLIDAYS_ONLY,
  weekends_only: AvailabilityType.WEEKENDS_ONLY,
  'weekends-only': AvailabilityType.WEEKENDS_ONLY,
  weekends: AvailabilityType.WEEKENDS_ONLY,
  evenings: AvailabilityType.EVENINGS,
  soirs: AvailabilityType.EVENINGS,
  days: AvailabilityType.DAYS,
  jours: AvailabilityType.DAYS,
  daytime: AvailabilityType.DAYS,
};

// =============================================================================
// Value Parsers
// =============================================================================

/**
 * Parse a boolean value from WordPress meta
 */
export function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined || value === '') return undefined;
  const normalized = value.toLowerCase().trim();
  if (['true', '1', 'yes', 'oui'].includes(normalized)) return true;
  if (['false', '0', 'no', 'non'].includes(normalized)) return false;
  return undefined;
}

/**
 * Parse an integer value from WordPress meta
 */
export function parseInteger(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Parse a decimal value from WordPress meta
 */
export function parseDecimal(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Parse a date string from WordPress format
 */
export function parseDate(value: string | undefined): Date | undefined {
  if (value === undefined || value === '') return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Parse a JSON array from WordPress meta (may be serialized PHP or JSON)
 */
export function parseArray(value: string | undefined): string[] {
  if (value === undefined || value === '') return [];

  // Try JSON parse first
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
    return [];
  } catch {
    // Try comma-separated
    if (value.includes(',')) {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    // Single value
    return [value.trim()].filter(Boolean);
  }
}

/**
 * Parse a JSON object from WordPress meta
 */
export function parseObject(value: string | undefined): Record<string, string> | undefined {
  if (value === undefined || value === '') return undefined;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Map an enum value using a mapping table
 */
export function mapEnum<T>(value: string | undefined, mapping: Record<string, T>): T | undefined {
  if (value === undefined || value === '') return undefined;
  const normalized = value.toLowerCase().trim().replace(/\s+/g, '_');
  return mapping[normalized];
}

// =============================================================================
// Validation Rules
// =============================================================================

/**
 * Required fields for a valid profile
 * Note: These match ParsedWordPressProfile field names
 */
export const REQUIRED_PROFILE_FIELDS = [
  'firstName',
  'lastName',
  'gender',
  'ageMin',
  'ageMax',
] as const;

/**
 * Minimum values for numeric fields
 * Note: These match ParsedWordPressProfile field names
 */
export const MIN_VALUES: Record<string, number> = {
  ageMin: 1,
  ageMax: 1,
  height: 50, // 50cm minimum
  dailyRate: 0,
};

/**
 * Maximum values for numeric fields
 * Note: These match ParsedWordPressProfile field names
 */
export const MAX_VALUES: Record<string, number> = {
  ageMin: 120,
  ageMax: 120,
  height: 300, // 300cm maximum
  dailyRate: 100000,
};

/**
 * Maximum array lengths
 */
export const MAX_ARRAY_LENGTHS: Record<string, number> = {
  languages: 20,
  accents: 30,
  athleticSkills: 30,
  musicalInstruments: 30,
  performanceSkills: 30,
  danceStyles: 30,
  photos: 10,
  videoUrls: 10,
  portfolio: 10,
};
