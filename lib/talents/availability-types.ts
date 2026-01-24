// Availability type constants and helper functions
// Matches Prisma AvailabilityType enum from legacy WordPress system

import { AvailabilityType } from '@prisma/client';

/**
 * All availability type values as an array
 */
export const AVAILABILITY_TYPES: AvailabilityType[] = [
  'ALWAYS',
  'SHORT_TERM_1_2_DAYS',
  'MEDIUM_TERM_1_2_WEEKS',
  'LONG_TERM_1_4_MONTHS',
  'WEEKENDS_AND_HOLIDAYS',
  'HOLIDAYS_ONLY',
  'WEEKENDS_ONLY',
  'EVENINGS',
  'DAYS',
];

/**
 * Human-readable labels for each availability type
 */
export const AVAILABILITY_TYPE_LABELS: Record<AvailabilityType, string> = {
  ALWAYS: 'Always available',
  SHORT_TERM_1_2_DAYS: '1-2 days',
  MEDIUM_TERM_1_2_WEEKS: '1-2 weeks',
  LONG_TERM_1_4_MONTHS: '1-4 months',
  WEEKENDS_AND_HOLIDAYS: 'Weekends and holidays',
  HOLIDAYS_ONLY: 'Holidays only',
  WEEKENDS_ONLY: 'Weekends only',
  EVENINGS: 'Evenings only',
  DAYS: 'Daytime only',
};

/**
 * Get human-readable label for an availability type
 */
export function getAvailabilityLabel(type: AvailabilityType): string {
  return AVAILABILITY_TYPE_LABELS[type] || type;
}

/**
 * Get labels for multiple availability types
 */
export function getAvailabilityLabels(types: AvailabilityType[]): string[] {
  return types.map(getAvailabilityLabel);
}

/**
 * Check if a string is a valid availability type
 */
export function isValidAvailabilityType(value: string): value is AvailabilityType {
  return AVAILABILITY_TYPES.includes(value as AvailabilityType);
}

/**
 * Parse an array of strings into valid availability types
 * Filters out invalid values
 */
export function parseAvailabilityTypes(values: string[]): AvailabilityType[] {
  return values.filter(isValidAvailabilityType);
}
