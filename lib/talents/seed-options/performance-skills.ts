// Performance skills options from legacy WordPress system
// 25 skills for acting, stunts, and entertainment

export const PERFORMANCE_SKILLS = [
  'Acrobatics',
  'Comedian',
  'Commercial Acting',
  'Contortionist',
  'Dancing',
  'Dialect Coaching',
  'DJ',
  'Diving',
  'Firearms Handling',
  'Host',
  'Improvisation',
  'Juggling',
  'Magic',
  'Mime',
  'Mo-Cap',
  'Pilot',
  'Puppetry',
  'Singing',
  'Stage Combat',
  'Stand-up Comedy',
  'Stunts',
  'Theater',
  'Voice Acting',
  'Voiceover',
  'Wrestling',
] as const;

export type PerformanceSkill = (typeof PERFORMANCE_SKILLS)[number];

export const PERFORMANCE_SKILL_OPTIONS = PERFORMANCE_SKILLS.map((skill) => ({
  value: skill,
  label: skill,
}));

// Count for validation
export const PERFORMANCE_SKILL_COUNT = 25;
