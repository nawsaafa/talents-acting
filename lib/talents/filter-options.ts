// Filter options for talent filtering UI
// Static arrays matching Prisma enum values and legacy WordPress options

// Re-export skill/language options from seed-options for filter compatibility
export {
  LANGUAGE_OPTIONS,
  LANGUAGES,
  ATHLETIC_SKILL_OPTIONS,
  ATHLETIC_SKILLS,
  DANCE_STYLE_OPTIONS,
  DANCE_STYLES,
  DANCE_STYLE_GROUPS,
  GROUPED_DANCE_STYLE_OPTIONS,
  MOROCCAN_DANCE_STYLES,
  PERFORMANCE_SKILL_OPTIONS,
  PERFORMANCE_SKILLS,
  ACCENT_OPTIONS,
  ACCENTS,
  ACCENT_GROUPS,
  GROUPED_ACCENT_OPTIONS,
  MOROCCAN_ACCENTS,
  MUSICAL_INSTRUMENT_OPTIONS,
  MUSICAL_INSTRUMENTS,
  MUSICAL_INSTRUMENT_GROUPS,
  MOROCCAN_REGION_OPTIONS,
  MOROCCAN_REGIONS,
  MOROCCAN_REGION_SHORT_LABELS,
} from './seed-options';

// Backward compatibility aliases for existing code
export { LANGUAGES as COMMON_LANGUAGES } from './seed-options';

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const PHYSIQUE_OPTIONS = [
  { value: 'SLIM', label: 'Slim' },
  { value: 'AVERAGE', label: 'Average' },
  { value: 'ATHLETIC', label: 'Athletic' },
  { value: 'MUSCULAR', label: 'Muscular' },
  { value: 'CURVY', label: 'Curvy' },
  { value: 'PLUS_SIZE', label: 'Plus Size' },
] as const;

export const HAIR_COLOR_OPTIONS = [
  { value: 'BLACK', label: 'Black' },
  { value: 'BROWN', label: 'Brown' },
  { value: 'BLONDE', label: 'Blonde' },
  { value: 'RED', label: 'Red' },
  { value: 'GRAY', label: 'Gray' },
  { value: 'WHITE', label: 'White' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const EYE_COLOR_OPTIONS = [
  { value: 'BROWN', label: 'Brown' },
  { value: 'BLUE', label: 'Blue' },
  { value: 'GREEN', label: 'Green' },
  { value: 'HAZEL', label: 'Hazel' },
  { value: 'GRAY', label: 'Gray' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const HAIR_LENGTH_OPTIONS = [
  { value: 'BALD', label: 'Bald' },
  { value: 'SHORT', label: 'Short' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LONG', label: 'Long' },
] as const;

// Availability type options matching legacy WordPress system
export const AVAILABILITY_TYPE_OPTIONS = [
  { value: 'ALWAYS', label: 'Always available' },
  { value: 'SHORT_TERM_1_2_DAYS', label: '1-2 days' },
  { value: 'MEDIUM_TERM_1_2_WEEKS', label: '1-2 weeks' },
  { value: 'LONG_TERM_1_4_MONTHS', label: '1-4 months' },
  { value: 'WEEKENDS_AND_HOLIDAYS', label: 'Weekends and holidays' },
  { value: 'HOLIDAYS_ONLY', label: 'Holidays only' },
  { value: 'WEEKENDS_ONLY', label: 'Weekends only' },
  { value: 'EVENINGS', label: 'Evenings only' },
  { value: 'DAYS', label: 'Daytime only' },
] as const;

// Helper type for filter option
export type FilterOption = {
  value: string;
  label: string;
};

// Grouped filter option type for categorized selects
export type GroupedFilterOption = {
  group: string;
  options: FilterOption[];
};
