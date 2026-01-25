// Athletic skills options from legacy WordPress system
// 29 skills including sports, martial arts, and fitness activities

export const ATHLETIC_SKILLS = [
  'Aerobics',
  'Archery',
  'Basketball',
  'Boxing',
  'Climbing',
  'Cycling',
  'Diving',
  'Fencing',
  'Football',
  'Golf',
  'Gymnastics',
  'Hockey',
  'Horse Riding',
  'Ice Skating',
  'Jogging',
  'Karate',
  'Kickboxing',
  'Martial Arts',
  'Parkour',
  'Roller Skating',
  'Rugby',
  'Skateboarding',
  'Skiing',
  'Snowboarding',
  'Surfing',
  'Swimming',
  'Tennis',
  'Volleyball',
  'Yoga',
] as const;

export type AthleticSkill = (typeof ATHLETIC_SKILLS)[number];

export const ATHLETIC_SKILL_OPTIONS = ATHLETIC_SKILLS.map((skill) => ({
  value: skill,
  label: skill,
}));

// Count for validation
export const ATHLETIC_SKILL_COUNT = 29;
