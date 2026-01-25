// Dance styles options from legacy WordPress system
// 33 styles including 6 Moroccan traditional + 27 international

// Moroccan traditional dance styles
export const MOROCCAN_DANCE_STYLES = [
  'Ahidous',
  'Ahwach',
  'Chaabi',
  'Gnawa',
  'Guedra',
  'Reggada',
] as const;

// International dance styles
export const INTERNATIONAL_DANCE_STYLES = [
  'African',
  'Ballet',
  'Ballroom',
  'Belly Dance',
  'Bolero',
  'Breakdance',
  'Capoeira',
  'Cha-Cha',
  'Contemporary',
  'Flamenco',
  'Folk',
  'Hip Hop',
  'Irish Step',
  'Jazz',
  'Latin',
  'Line Dancing',
  'Modern',
  'Pole Dancing',
  'Salsa',
  'Samba',
  'Street Dance',
  'Swing',
  'Tango',
  'Tap',
  'Waltz',
  'Zumba',
  'Other',
] as const;

// Combined list for selection
export const DANCE_STYLES = [...MOROCCAN_DANCE_STYLES, ...INTERNATIONAL_DANCE_STYLES] as const;

export type DanceStyle = (typeof DANCE_STYLES)[number];

export const DANCE_STYLE_OPTIONS = DANCE_STYLES.map((style) => ({
  value: style,
  label: style,
}));

// Grouped options for categorized display
export const DANCE_STYLE_GROUPS = {
  moroccan: [...MOROCCAN_DANCE_STYLES],
  international: [...INTERNATIONAL_DANCE_STYLES],
} as const;

export const GROUPED_DANCE_STYLE_OPTIONS = [
  {
    group: 'Moroccan Traditional',
    options: MOROCCAN_DANCE_STYLES.map((style) => ({ value: style, label: style })),
  },
  {
    group: 'International',
    options: INTERNATIONAL_DANCE_STYLES.map((style) => ({ value: style, label: style })),
  },
];

// Count for validation
export const DANCE_STYLE_COUNT = 33;
