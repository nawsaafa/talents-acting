import { z } from 'zod';

// Enum schemas matching Prisma enums
export const GenderSchema = z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER']);
export const PhysiqueSchema = z.enum([
  'SLIM',
  'AVERAGE',
  'ATHLETIC',
  'MUSCULAR',
  'CURVY',
  'PLUS_SIZE',
]);
export const HairColorSchema = z.enum([
  'BLACK',
  'BROWN',
  'BLONDE',
  'RED',
  'GRAY',
  'WHITE',
  'OTHER',
]);
export const EyeColorSchema = z.enum(['BROWN', 'BLUE', 'GREEN', 'HAZEL', 'GRAY', 'OTHER']);
export const HairLengthSchema = z.enum(['BALD', 'SHORT', 'MEDIUM', 'LONG']);
export const BeardTypeSchema = z.enum(['NONE', 'STUBBLE', 'SHORT', 'MEDIUM', 'LONG', 'FULL']);
export const AvailabilityTypeSchema = z.enum([
  'ALWAYS',
  'SHORT_TERM_1_2_DAYS',
  'MEDIUM_TERM_1_2_WEEKS',
  'LONG_TERM_1_4_MONTHS',
  'WEEKENDS_AND_HOLIDAYS',
  'HOLIDAYS_ONLY',
  'WEEKENDS_ONLY',
  'EVENINGS',
  'DAYS',
]);

// IMDB URL validation pattern
export const imdbUrlSchema = z
  .string()
  .regex(
    /^https?:\/\/(www\.)?imdb\.com\/name\/nm\d+\/?$/,
    'Invalid IMDB URL. Expected format: https://www.imdb.com/name/nm[digits]/'
  )
  .optional()
  .nullable();

// Profile creation schema - required fields for initial creation
export const createProfileSchema = z.object({
  // Basic Info (required)
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  gender: GenderSchema,
  ageRangeMin: z
    .number()
    .int()
    .min(1, 'Minimum age must be at least 1')
    .max(100, 'Minimum age must be at most 100'),
  ageRangeMax: z
    .number()
    .int()
    .min(1, 'Maximum age must be at least 1')
    .max(100, 'Maximum age must be at most 100'),

  // Optional fields for creation
  photo: z.string().url().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  birthPlace: z.string().max(100).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),

  // Physical attributes (optional)
  height: z.number().int().min(50).max(300).optional().nullable(),
  physique: PhysiqueSchema.optional().nullable(),
  ethnicAppearance: z.string().max(100).optional().nullable(),
  hairColor: HairColorSchema.optional().nullable(),
  eyeColor: EyeColorSchema.optional().nullable(),
  hairLength: HairLengthSchema.optional().nullable(),

  // Unique traits (optional)
  beardType: BeardTypeSchema.optional().nullable(),
  hasTattoos: z.boolean().default(false),
  hasScars: z.boolean().default(false),
  tattooDescription: z.string().max(500).optional().nullable(),
  scarDescription: z.string().max(500).optional().nullable(),

  // Skills (optional arrays)
  languages: z.array(z.string()).default([]),
  accents: z.array(z.string()).default([]),
  athleticSkills: z.array(z.string()).default([]),
  musicalInstruments: z.array(z.string()).default([]),
  performanceSkills: z.array(z.string()).default([]),
  danceStyles: z.array(z.string()).default([]),

  // Media and availability (optional)
  isAvailable: z.boolean().default(true),
  availabilityTypes: z.array(AvailabilityTypeSchema).default([]),
  dailyRate: z.number().positive().optional().nullable(),
  rateNegotiable: z.boolean().default(true),
  imdbUrl: imdbUrlSchema,

  // Contact info (premium fields)
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(20).optional().nullable(),
});

// Profile update schema - all fields optional
export const updateProfileSchema = createProfileSchema.partial();

// Filter schema for talent listing - extended for advanced filtering
export const talentFilterSchema = z.object({
  // Search query (full-text search)
  q: z.string().max(100).optional(),

  // Basic filters
  search: z.string().optional(), // Legacy - use q instead
  gender: GenderSchema.optional(),
  ageMin: z.number().int().min(1).max(100).optional(),
  ageMax: z.number().int().min(1).max(100).optional(),

  // Physical attribute filters
  minHeight: z.number().int().min(50).max(300).optional(),
  maxHeight: z.number().int().min(50).max(300).optional(),
  physique: z.array(PhysiqueSchema).optional(),
  hairColor: z.array(HairColorSchema).optional(),
  eyeColor: z.array(EyeColorSchema).optional(),
  hairLength: z.array(HairLengthSchema).optional(),

  // Skills filters (arrays of strings for flexible matching)
  languages: z.array(z.string()).optional(),
  athleticSkills: z.array(z.string()).optional(),
  danceStyles: z.array(z.string()).optional(),
  performanceSkills: z.array(z.string()).optional(),

  // Professional filters
  isAvailable: z.boolean().optional(),
  availabilityTypes: z.array(AvailabilityTypeSchema).optional(),
  minRate: z.number().positive().optional(),
  maxRate: z.number().positive().optional(),

  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

// Photo upload validation
export const photoUploadSchema = z.object({
  filename: z.string().min(1),
  size: z.number().max(5 * 1024 * 1024, 'File size must be under 5MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'Only JPEG, PNG, and WebP images are allowed',
  }),
});

// Type exports
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type TalentFilterInput = z.infer<typeof talentFilterSchema>;
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;
