import { z } from "zod";

// Enum schemas matching Prisma enums
export const GenderSchema = z.enum(["MALE", "FEMALE", "NON_BINARY", "OTHER"]);
export const PhysiqueSchema = z.enum([
  "SLIM",
  "AVERAGE",
  "ATHLETIC",
  "MUSCULAR",
  "CURVY",
  "PLUS_SIZE",
]);
export const HairColorSchema = z.enum([
  "BLACK",
  "BROWN",
  "BLONDE",
  "RED",
  "GRAY",
  "WHITE",
  "OTHER",
]);
export const EyeColorSchema = z.enum([
  "BROWN",
  "BLUE",
  "GREEN",
  "HAZEL",
  "GRAY",
  "OTHER",
]);
export const HairLengthSchema = z.enum(["BALD", "SHORT", "MEDIUM", "LONG"]);
export const BeardTypeSchema = z.enum([
  "NONE",
  "STUBBLE",
  "SHORT",
  "MEDIUM",
  "LONG",
  "FULL",
]);

// Profile creation schema - required fields for initial creation
export const createProfileSchema = z.object({
  // Basic Info (required)
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  gender: GenderSchema,
  ageRangeMin: z
    .number()
    .int()
    .min(1, "Minimum age must be at least 1")
    .max(100, "Minimum age must be at most 100"),
  ageRangeMax: z
    .number()
    .int()
    .min(1, "Maximum age must be at least 1")
    .max(100, "Maximum age must be at most 100"),

  // Optional fields for creation
  photo: z.string().url().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
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
  dailyRate: z.number().positive().optional().nullable(),
  rateNegotiable: z.boolean().default(true),

  // Contact info (premium fields)
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(20).optional().nullable(),
});

// Profile update schema - all fields optional
export const updateProfileSchema = createProfileSchema.partial();

// Filter schema for talent listing
export const talentFilterSchema = z.object({
  search: z.string().optional(),
  gender: GenderSchema.optional(),
  ageMin: z.number().int().min(1).max(100).optional(),
  ageMax: z.number().int().min(1).max(100).optional(),
  isAvailable: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

// Photo upload validation
export const photoUploadSchema = z.object({
  filename: z.string().min(1),
  size: z.number().max(5 * 1024 * 1024, "File size must be under 5MB"),
  type: z.enum(["image/jpeg", "image/png", "image/webp"], {
    message: "Only JPEG, PNG, and WebP images are allowed",
  }),
});

// Type exports
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type TalentFilterInput = z.infer<typeof talentFilterSchema>;
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;
