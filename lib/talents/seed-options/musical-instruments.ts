// Musical instruments options from legacy WordPress system
// 28 instruments including traditional Moroccan and international

export const MUSICAL_INSTRUMENTS = [
  // Traditional Moroccan
  'Bendir',
  'Guembri',
  'Oud',
  'Qraqeb',
  // International - Strings
  'Banjo',
  'Bass Guitar',
  'Cello',
  'Double Bass',
  'Guitar',
  'Harp',
  'Mandolin',
  'Ukulele',
  'Violin',
  'Viola',
  // International - Wind
  'Clarinet',
  'Flute',
  'Harmonica',
  'Oboe',
  'Recorder',
  'Saxophone',
  'Trombone',
  'Trumpet',
  'Tuba',
  // International - Keyboard & Percussion
  'Accordion',
  'Drums',
  'Keyboard',
  'Piano',
  'Xylophone',
] as const;

export type MusicalInstrument = (typeof MUSICAL_INSTRUMENTS)[number];

export const MUSICAL_INSTRUMENT_OPTIONS = MUSICAL_INSTRUMENTS.map((instrument) => ({
  value: instrument,
  label: instrument,
}));

// Grouped by category for UI display
export const MUSICAL_INSTRUMENT_GROUPS = {
  moroccan: ['Bendir', 'Guembri', 'Oud', 'Qraqeb'],
  strings: [
    'Banjo',
    'Bass Guitar',
    'Cello',
    'Double Bass',
    'Guitar',
    'Harp',
    'Mandolin',
    'Ukulele',
    'Violin',
    'Viola',
  ],
  wind: [
    'Clarinet',
    'Flute',
    'Harmonica',
    'Oboe',
    'Recorder',
    'Saxophone',
    'Trombone',
    'Trumpet',
    'Tuba',
  ],
  keyboardAndPercussion: ['Accordion', 'Drums', 'Keyboard', 'Piano', 'Xylophone'],
} as const;

// Count for validation
export const MUSICAL_INSTRUMENT_COUNT = 28;
