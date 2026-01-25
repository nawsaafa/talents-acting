/**
 * WordPress export file parser
 * Parses JSON exports from WordPress and extracts user and profile data
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  WordPressExport,
  WordPressUser,
  WordPressUserMeta,
  WordPressAttachment,
  ParsedWordPressProfile,
} from './types';
import { META_KEY_MAPPINGS, parseBoolean, parseInteger, parseArray, parseObject } from './config';
import logger from '../../lib/logger';

/**
 * Parse a WordPress JSON export file
 */
export function parseWordPressExport(filePath: string): WordPressExport {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Export file not found: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');

  try {
    const data = JSON.parse(content) as WordPressExport;
    validateExportStructure(data);
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in export file: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Validate the export file has required structure
 */
function validateExportStructure(data: unknown): asserts data is WordPressExport {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Export file must contain a JSON object');
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.users)) {
    throw new Error('Export file must contain a "users" array');
  }

  if (!Array.isArray(obj.usermeta)) {
    throw new Error('Export file must contain a "usermeta" array');
  }
}

/**
 * Group user meta by user ID for efficient lookup
 */
export function groupMetaByUserId(usermeta: WordPressUserMeta[]): Map<string, Map<string, string>> {
  const grouped = new Map<string, Map<string, string>>();

  for (const meta of usermeta) {
    if (!grouped.has(meta.user_id)) {
      grouped.set(meta.user_id, new Map());
    }
    grouped.get(meta.user_id)!.set(meta.meta_key, meta.meta_value);
  }

  return grouped;
}

/**
 * Group attachments by post author (user ID)
 */
export function groupAttachmentsByUserId(
  attachments: WordPressAttachment[] | undefined
): Map<string, WordPressAttachment[]> {
  const grouped = new Map<string, WordPressAttachment[]>();

  if (!attachments) return grouped;

  for (const attachment of attachments) {
    if (!grouped.has(attachment.post_author)) {
      grouped.set(attachment.post_author, []);
    }
    grouped.get(attachment.post_author)!.push(attachment);
  }

  return grouped;
}

/**
 * Extract a meta value using the mapping configuration
 */
function getMetaValue(metaMap: Map<string, string>, targetField: string): string | undefined {
  // Find the WordPress meta key that maps to this target field
  for (const [metaKey, mappedField] of Object.entries(META_KEY_MAPPINGS)) {
    if (mappedField === targetField && metaMap.has(metaKey)) {
      return metaMap.get(metaKey);
    }
  }
  return undefined;
}

/**
 * Parse a single WordPress user with their meta into a profile
 */
export function parseUserProfile(
  user: WordPressUser,
  metaMap: Map<string, string>
): ParsedWordPressProfile {
  // Split display_name into first and last name if not in meta
  const nameParts = user.display_name.split(' ');
  const defaultFirstName = nameParts[0] || '';
  const defaultLastName = nameParts.slice(1).join(' ') || '';

  const profile: ParsedWordPressProfile = {
    // User info
    userId: user.ID,
    email: user.user_email,
    displayName: user.display_name,
    registeredAt: user.user_registered,

    // Basic info - use meta or fallback to display_name split
    firstName: getMetaValue(metaMap, 'firstName') || defaultFirstName,
    lastName: getMetaValue(metaMap, 'lastName') || defaultLastName,
    gender: getMetaValue(metaMap, 'gender'),
    ageMin: parseInteger(getMetaValue(metaMap, 'ageMin')),
    ageMax: parseInteger(getMetaValue(metaMap, 'ageMax')),
    birthDate: getMetaValue(metaMap, 'birthDate'),
    birthPlace: getMetaValue(metaMap, 'birthPlace'),

    // Physical attributes
    height: parseInteger(getMetaValue(metaMap, 'height')),
    physique: getMetaValue(metaMap, 'physique'),
    ethnicAppearance: getMetaValue(metaMap, 'ethnicAppearance'),
    hairColor: getMetaValue(metaMap, 'hairColor'),
    eyeColor: getMetaValue(metaMap, 'eyeColor'),
    hairLength: getMetaValue(metaMap, 'hairLength'),
    beardType: getMetaValue(metaMap, 'beardType'),
    hasTattoos: parseBoolean(getMetaValue(metaMap, 'hasTattoos')),
    hasScars: parseBoolean(getMetaValue(metaMap, 'hasScars')),
    tattooDescription: getMetaValue(metaMap, 'tattooDescription'),
    scarDescription: getMetaValue(metaMap, 'scarDescription'),

    // Skills (arrays)
    languages: parseArray(getMetaValue(metaMap, 'languages')),
    accents: parseArray(getMetaValue(metaMap, 'accents')),
    athleticSkills: parseArray(getMetaValue(metaMap, 'athleticSkills')),
    musicalInstruments: parseArray(getMetaValue(metaMap, 'musicalInstruments')),
    performanceSkills: parseArray(getMetaValue(metaMap, 'performanceSkills')),
    danceStyles: parseArray(getMetaValue(metaMap, 'danceStyles')),

    // Media
    photos: parseArray(getMetaValue(metaMap, 'photos')),
    videoUrls: parseArray(getMetaValue(metaMap, 'videoUrls')),
    presentationVideo: getMetaValue(metaMap, 'presentationVideo'),
    showreel: getMetaValue(metaMap, 'showreel'),

    // Availability
    isAvailable: parseBoolean(getMetaValue(metaMap, 'isAvailable')) ?? true,
    availabilityTypes: parseArray(getMetaValue(metaMap, 'availabilityTypes')),
    dailyRate: parseInteger(getMetaValue(metaMap, 'dailyRate')),
    rateNegotiable: parseBoolean(getMetaValue(metaMap, 'rateNegotiable')),

    // Contact and bio
    bio: getMetaValue(metaMap, 'bio'),
    location: getMetaValue(metaMap, 'location'),
    contactEmail: getMetaValue(metaMap, 'contactEmail'),
    contactPhone: getMetaValue(metaMap, 'contactPhone'),
    imdbUrl: getMetaValue(metaMap, 'imdbUrl'),
    portfolio: parseArray(getMetaValue(metaMap, 'portfolio')),
    socialMedia: parseObject(getMetaValue(metaMap, 'socialMedia')),
  };

  return profile;
}

/**
 * Parse all profiles from a WordPress export
 */
export function parseAllProfiles(exportData: WordPressExport): ParsedWordPressProfile[] {
  const metaByUser = groupMetaByUserId(exportData.usermeta);
  const profiles: ParsedWordPressProfile[] = [];

  for (const user of exportData.users) {
    const metaMap = metaByUser.get(user.ID) || new Map();
    const profile = parseUserProfile(user, metaMap);
    profiles.push(profile);

    logger.debug({ userId: user.ID, email: user.user_email }, 'Parsed profile');
  }

  logger.info({ count: profiles.length }, 'Parsed all profiles from export');
  return profiles;
}

/**
 * Get statistics about the export file
 */
export function getExportStats(exportData: WordPressExport): {
  userCount: number;
  metaCount: number;
  attachmentCount: number;
  siteUrl?: string;
  exportDate?: string;
} {
  return {
    userCount: exportData.users.length,
    metaCount: exportData.usermeta.length,
    attachmentCount: exportData.attachments?.length || 0,
    siteUrl: exportData.site_url,
    exportDate: exportData.export_date,
  };
}
