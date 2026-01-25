// Language options from legacy WordPress system
// 8 primary languages for Morocco and international productions

export const LANGUAGES = [
  'Moroccan Darija',
  'Arabic',
  'Berber',
  'French',
  'English',
  'Spanish',
  'Italian',
  'Portuguese',
] as const;

export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_OPTIONS = LANGUAGES.map((lang) => ({
  value: lang,
  label: lang,
}));

// Count for validation
export const LANGUAGE_COUNT = 8;
