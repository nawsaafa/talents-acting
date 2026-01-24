// Filter options for talent filtering UI
// Static arrays matching Prisma enum values

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

// Common languages for Morocco and international productions
export const COMMON_LANGUAGES = [
  'Arabic',
  'Moroccan Darija',
  'French',
  'English',
  'Spanish',
  'Berber',
  'German',
  'Italian',
  'Portuguese',
  'Dutch',
  'Russian',
  'Chinese',
  'Japanese',
  'Korean',
  'Hindi',
  'Turkish',
] as const;

// Athletic skills commonly needed in film/TV
export const ATHLETIC_SKILLS = [
  'Swimming',
  'Horse Riding',
  'Martial Arts',
  'Boxing',
  'Fencing',
  'Gymnastics',
  'Parkour',
  'Rock Climbing',
  'Skateboarding',
  'Surfing',
  'Skiing',
  'Snowboarding',
  'Soccer',
  'Basketball',
  'Tennis',
  'Golf',
  'Cycling',
  'Running',
  'Yoga',
  'Pilates',
] as const;

// Dance styles for performance
export const DANCE_STYLES = [
  'Contemporary',
  'Ballet',
  'Hip Hop',
  'Jazz',
  'Ballroom',
  'Salsa',
  'Tango',
  'Belly Dance',
  'Traditional Moroccan',
  'Folk',
  'Breakdance',
  'Tap',
  'Modern',
  'Street Dance',
  'Flamenco',
] as const;

// Performance skills for acting
export const PERFORMANCE_SKILLS = [
  'Stand-up Comedy',
  'Improvisation',
  'Voice Acting',
  'Singing',
  'Stage Combat',
  'Stunt Work',
  'Mime',
  'Puppetry',
  'Magic',
  'Clowning',
  'Dialect Coaching',
  'Mo-Cap',
  'Voiceover',
  'Commercial Acting',
  'Theater',
] as const;

// Helper type for filter option
export type FilterOption = {
  value: string;
  label: string;
};
