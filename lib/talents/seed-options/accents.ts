// Accent options from legacy WordPress system
// ~70 accents organized by regional groupings

// Moroccan regional accents (6)
export const MOROCCAN_ACCENTS = [
  'Casaoui',
  'Chamali',
  'Marrakchi',
  'Oujdi',
  'Rbati',
  'Sahraoui',
  'Soussi',
] as const;

// English accents (8)
export const ENGLISH_ACCENTS = [
  'American',
  'Australian',
  'British',
  'Canadian',
  'Irish',
  'New Zealand',
  'Scottish',
  'South African',
] as const;

// French accents (7)
export const FRENCH_ACCENTS = [
  'Belgian French',
  'Canadian French',
  'Maghreb French',
  'Parisian',
  'Quebecois',
  'Southern French',
  'Swiss French',
] as const;

// Arabic accents (10)
export const ARABIC_ACCENTS = [
  'Egyptian',
  'Gulf Arabic',
  'Iraqi',
  'Jordanian',
  'Lebanese',
  'Palestinian',
  'Saudi',
  'Standard Arabic',
  'Syrian',
  'Tunisian',
] as const;

// Spanish accents (5)
export const SPANISH_ACCENTS = [
  'Argentinian',
  'Castilian',
  'Latin American',
  'Mexican',
  'Puerto Rican',
] as const;

// Other world accents (~35)
export const OTHER_ACCENTS = [
  'Brazilian Portuguese',
  'Chinese Mandarin',
  'Czech',
  'Danish',
  'Dutch',
  'Finnish',
  'German',
  'Greek',
  'Hindi',
  'Hungarian',
  'Italian',
  'Japanese',
  'Korean',
  'Nigerian',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Romanian',
  'Russian',
  'Scandinavian',
  'Serbian',
  'Slovak',
  'South Asian',
  'Swedish',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Vietnamese',
  'West African',
  'Other African',
  'Other Asian',
  'Other European',
  'Other Middle Eastern',
  'Other',
] as const;

// Combined list for selection
export const ACCENTS = [
  ...MOROCCAN_ACCENTS,
  ...ENGLISH_ACCENTS,
  ...FRENCH_ACCENTS,
  ...ARABIC_ACCENTS,
  ...SPANISH_ACCENTS,
  ...OTHER_ACCENTS,
] as const;

export type Accent = (typeof ACCENTS)[number];

export const ACCENT_OPTIONS = ACCENTS.map((accent) => ({
  value: accent,
  label: accent,
}));

// Grouped options for categorized display in UI
export const ACCENT_GROUPS = {
  moroccan: [...MOROCCAN_ACCENTS],
  english: [...ENGLISH_ACCENTS],
  french: [...FRENCH_ACCENTS],
  arabic: [...ARABIC_ACCENTS],
  spanish: [...SPANISH_ACCENTS],
  other: [...OTHER_ACCENTS],
} as const;

export const GROUPED_ACCENT_OPTIONS = [
  {
    group: 'Moroccan',
    options: MOROCCAN_ACCENTS.map((accent) => ({ value: accent, label: accent })),
  },
  {
    group: 'English',
    options: ENGLISH_ACCENTS.map((accent) => ({ value: accent, label: accent })),
  },
  {
    group: 'French',
    options: FRENCH_ACCENTS.map((accent) => ({ value: accent, label: accent })),
  },
  {
    group: 'Arabic',
    options: ARABIC_ACCENTS.map((accent) => ({ value: accent, label: accent })),
  },
  {
    group: 'Spanish',
    options: SPANISH_ACCENTS.map((accent) => ({ value: accent, label: accent })),
  },
  {
    group: 'Other',
    options: OTHER_ACCENTS.map((accent) => ({ value: accent, label: accent })),
  },
];

// Count for validation
export const ACCENT_COUNT = 72;
