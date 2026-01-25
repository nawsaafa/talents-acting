// Central export for all seed option modules
// Re-exports all option constants, types, and utilities

// Languages
export { LANGUAGES, LANGUAGE_OPTIONS, LANGUAGE_COUNT, type Language } from './languages';

// Athletic Skills
export {
  ATHLETIC_SKILLS,
  ATHLETIC_SKILL_OPTIONS,
  ATHLETIC_SKILL_COUNT,
  type AthleticSkill,
} from './athletic-skills';

// Musical Instruments
export {
  MUSICAL_INSTRUMENTS,
  MUSICAL_INSTRUMENT_OPTIONS,
  MUSICAL_INSTRUMENT_GROUPS,
  MUSICAL_INSTRUMENT_COUNT,
  type MusicalInstrument,
} from './musical-instruments';

// Dance Styles
export {
  DANCE_STYLES,
  DANCE_STYLE_OPTIONS,
  DANCE_STYLE_GROUPS,
  GROUPED_DANCE_STYLE_OPTIONS,
  MOROCCAN_DANCE_STYLES,
  INTERNATIONAL_DANCE_STYLES,
  DANCE_STYLE_COUNT,
  type DanceStyle,
} from './dance-styles';

// Performance Skills
export {
  PERFORMANCE_SKILLS,
  PERFORMANCE_SKILL_OPTIONS,
  PERFORMANCE_SKILL_COUNT,
  type PerformanceSkill,
} from './performance-skills';

// Accents
export {
  ACCENTS,
  ACCENT_OPTIONS,
  ACCENT_GROUPS,
  GROUPED_ACCENT_OPTIONS,
  MOROCCAN_ACCENTS,
  ENGLISH_ACCENTS,
  FRENCH_ACCENTS,
  ARABIC_ACCENTS,
  SPANISH_ACCENTS,
  OTHER_ACCENTS,
  ACCENT_COUNT,
  type Accent,
} from './accents';

// Moroccan Regions
export {
  MOROCCAN_REGIONS,
  MOROCCAN_REGION_OPTIONS,
  MOROCCAN_REGION_SHORT_LABELS,
  MOROCCAN_REGION_COUNT,
  type MoroccanRegion,
} from './regions';

// Summary of all option counts for validation
export const SEED_OPTION_COUNTS = {
  languages: 8,
  athleticSkills: 29,
  musicalInstruments: 28,
  danceStyles: 33,
  performanceSkills: 25,
  accents: 72,
  moroccanRegions: 17,
  total: 212,
} as const;
