/**
 * Wizard Step Validation Schemas
 *
 * Provides step-specific Zod schemas for the profile wizard.
 * Each step validates only its own fields.
 */

import { z } from "zod";
import {
  GenderSchema,
  PhysiqueSchema,
  HairColorSchema,
  EyeColorSchema,
  HairLengthSchema,
  BeardTypeSchema,
} from "@/lib/talents/validation";

// Step 1: Basic Info
export const basicInfoSchema = z.object({
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
  location: z.string().max(100).optional().nullable(),
  contactEmail: z.string().email("Invalid email format").optional().nullable().or(z.literal("")),
  contactPhone: z.string().max(20).optional().nullable(),
}).refine(
  (data) => data.ageRangeMin <= data.ageRangeMax,
  {
    message: "Minimum age cannot be greater than maximum age",
    path: ["ageRangeMin"],
  }
);

// Step 2: Physical Attributes
export const physicalAttributesSchema = z.object({
  height: z.number().int().min(50, "Height must be at least 50cm").max(300, "Height must be at most 300cm").optional().nullable(),
  physique: PhysiqueSchema.optional().nullable(),
  ethnicAppearance: z.string().max(100).optional().nullable(),
  hairColor: HairColorSchema.optional().nullable(),
  eyeColor: EyeColorSchema.optional().nullable(),
  hairLength: HairLengthSchema.optional().nullable(),
  beardType: BeardTypeSchema.optional().nullable(),
  hasTattoos: z.boolean().default(false),
  hasScars: z.boolean().default(false),
  tattooDescription: z.string().max(500).optional().nullable(),
  scarDescription: z.string().max(500).optional().nullable(),
});

// Step 3: Skills
export const skillsSchema = z.object({
  languages: z.array(z.string()).default([]),
  accents: z.array(z.string()).default([]),
  athleticSkills: z.array(z.string()).default([]),
  musicalInstruments: z.array(z.string()).default([]),
  performanceSkills: z.array(z.string()).default([]),
  danceStyles: z.array(z.string()).default([]),
});

// Step 4: Media
export const mediaSchema = z.object({
  photo: z.string().url("Invalid photo URL").optional().nullable().or(z.literal("")),
  photos: z.array(z.string().url()).default([]),
  videoUrls: z.array(z.string().url()).default([]),
  presentationVideo: z.string().url("Invalid video URL").optional().nullable().or(z.literal("")),
  showreel: z.string().url("Invalid showreel URL").optional().nullable().or(z.literal("")),
  hasShowreel: z.boolean().default(false),
});

// Step 5: Professional
export const professionalSchema = z.object({
  bio: z.string().max(2000, "Biography is too long (max 2000 characters)").optional().nullable(),
  isAvailable: z.boolean().default(true),
  dailyRate: z.number().positive("Rate must be positive").optional().nullable(),
  rateNegotiable: z.boolean().default(true),
  portfolio: z.array(z.string().url()).default([]),
});

// Combined schema for final submission
export const fullProfileSchema = basicInfoSchema
  .merge(physicalAttributesSchema)
  .merge(skillsSchema)
  .merge(mediaSchema)
  .merge(professionalSchema);

// Step configurations
export const WIZARD_STEPS = [
  {
    id: "basic",
    title: "Basic Info",
    description: "Your name, age range, and contact details",
    schema: basicInfoSchema,
    fields: ["firstName", "lastName", "gender", "ageRangeMin", "ageRangeMax", "location", "contactEmail", "contactPhone"],
  },
  {
    id: "physical",
    title: "Physical Attributes",
    description: "Height, physique, and appearance details",
    schema: physicalAttributesSchema,
    fields: ["height", "physique", "ethnicAppearance", "hairColor", "eyeColor", "hairLength", "beardType", "hasTattoos", "hasScars", "tattooDescription", "scarDescription"],
  },
  {
    id: "skills",
    title: "Skills",
    description: "Languages, performance skills, and talents",
    schema: skillsSchema,
    fields: ["languages", "accents", "athleticSkills", "musicalInstruments", "performanceSkills", "danceStyles"],
  },
  {
    id: "media",
    title: "Media",
    description: "Photos, videos, and showreel",
    schema: mediaSchema,
    fields: ["photo", "photos", "videoUrls", "presentationVideo", "showreel", "hasShowreel"],
  },
  {
    id: "professional",
    title: "Professional",
    description: "Bio, availability, and rates",
    schema: professionalSchema,
    fields: ["bio", "isAvailable", "dailyRate", "rateNegotiable", "portfolio"],
  },
] as const;

export type WizardStepId = typeof WIZARD_STEPS[number]["id"];

// Type exports
export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type PhysicalAttributesInput = z.infer<typeof physicalAttributesSchema>;
export type SkillsInput = z.infer<typeof skillsSchema>;
export type MediaInput = z.infer<typeof mediaSchema>;
export type ProfessionalInput = z.infer<typeof professionalSchema>;
export type FullProfileInput = z.infer<typeof fullProfileSchema>;

/**
 * Validate a specific step's data
 */
export function validateStep(stepId: WizardStepId, data: Record<string, unknown>) {
  const step = WIZARD_STEPS.find((s) => s.id === stepId);
  if (!step) {
    return { success: false, error: { issues: [{ path: [], message: "Invalid step" }] } };
  }

  return step.schema.safeParse(data);
}

/**
 * Get the schema for a specific step
 */
export function getStepSchema(stepId: WizardStepId) {
  const step = WIZARD_STEPS.find((s) => s.id === stepId);
  return step?.schema;
}

/**
 * Extract only the fields relevant to a step
 */
export function extractStepData(
  stepId: WizardStepId,
  data: Record<string, unknown>
): Record<string, unknown> {
  const step = WIZARD_STEPS.find((s) => s.id === stepId);
  if (!step) return {};

  const stepData: Record<string, unknown> = {};
  for (const field of step.fields) {
    if (field in data) {
      stepData[field] = data[field];
    }
  }
  return stepData;
}
