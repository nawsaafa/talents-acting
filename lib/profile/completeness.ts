/**
 * Profile Completeness Calculation
 *
 * Calculates profile completion percentage and identifies missing fields.
 * Used by ProfileCompleteness component to show progress.
 */

import type { TalentProfile } from "@prisma/client";

// Field weights for completeness calculation
// Higher weight = more important for a complete profile
const FIELD_WEIGHTS: Record<string, number> = {
  // Basic Info (essential) - 25 points
  firstName: 5,
  lastName: 5,
  gender: 3,
  ageRangeMin: 3,
  ageRangeMax: 3,
  photo: 6,

  // Physical Attributes - 15 points
  height: 3,
  physique: 3,
  ethnicAppearance: 2,
  hairColor: 2,
  eyeColor: 2,
  hairLength: 3,

  // Skills - 20 points
  languages: 5,
  accents: 3,
  athleticSkills: 3,
  performanceSkills: 5,
  danceStyles: 2,
  musicalInstruments: 2,

  // Media - 20 points
  photos: 8,
  videoUrls: 5,
  showreel: 4,
  presentationVideo: 3,

  // Professional - 20 points
  bio: 8,
  location: 4,
  dailyRate: 4,
  contactEmail: 4,
};

// Human-readable field labels
const FIELD_LABELS: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  gender: "Gender",
  ageRangeMin: "Minimum Playable Age",
  ageRangeMax: "Maximum Playable Age",
  photo: "Primary Photo",
  height: "Height",
  physique: "Physique",
  ethnicAppearance: "Ethnic Appearance",
  hairColor: "Hair Color",
  eyeColor: "Eye Color",
  hairLength: "Hair Length",
  languages: "Languages",
  accents: "Accents",
  athleticSkills: "Athletic Skills",
  performanceSkills: "Performance Skills",
  danceStyles: "Dance Styles",
  musicalInstruments: "Musical Instruments",
  photos: "Additional Photos",
  videoUrls: "Video Links",
  showreel: "Showreel",
  presentationVideo: "Presentation Video",
  bio: "Biography",
  location: "Location",
  dailyRate: "Daily Rate",
  contactEmail: "Contact Email",
};

// Field categories for grouping
export const FIELD_CATEGORIES = {
  basic: ["firstName", "lastName", "gender", "ageRangeMin", "ageRangeMax", "photo"],
  physical: ["height", "physique", "ethnicAppearance", "hairColor", "eyeColor", "hairLength"],
  skills: ["languages", "accents", "athleticSkills", "performanceSkills", "danceStyles", "musicalInstruments"],
  media: ["photos", "videoUrls", "showreel", "presentationVideo"],
  professional: ["bio", "location", "dailyRate", "contactEmail"],
} as const;

export type FieldCategory = keyof typeof FIELD_CATEGORIES;

export interface CompletenessResult {
  percentage: number;
  totalPoints: number;
  earnedPoints: number;
  missingFields: Array<{
    field: string;
    label: string;
    category: FieldCategory;
    weight: number;
  }>;
  filledFields: string[];
  categoryScores: Record<FieldCategory, { filled: number; total: number; percentage: number }>;
}

/**
 * Check if a field has a valid value
 */
function isFieldFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

/**
 * Get the category for a given field
 */
function getFieldCategory(field: string): FieldCategory | null {
  for (const [category, fields] of Object.entries(FIELD_CATEGORIES)) {
    if ((fields as readonly string[]).includes(field)) {
      return category as FieldCategory;
    }
  }
  return null;
}

/**
 * Calculate profile completeness
 *
 * @param profile - Partial TalentProfile object
 * @returns CompletenessResult with percentage and missing fields
 */
export function calculateCompleteness(
  profile: Partial<TalentProfile> | null | undefined
): CompletenessResult {
  const totalPoints = Object.values(FIELD_WEIGHTS).reduce((sum, w) => sum + w, 0);

  if (!profile) {
    return {
      percentage: 0,
      totalPoints,
      earnedPoints: 0,
      missingFields: Object.entries(FIELD_WEIGHTS).map(([field, weight]) => ({
        field,
        label: FIELD_LABELS[field] || field,
        category: getFieldCategory(field) || "basic",
        weight,
      })),
      filledFields: [],
      categoryScores: {
        basic: { filled: 0, total: 0, percentage: 0 },
        physical: { filled: 0, total: 0, percentage: 0 },
        skills: { filled: 0, total: 0, percentage: 0 },
        media: { filled: 0, total: 0, percentage: 0 },
        professional: { filled: 0, total: 0, percentage: 0 },
      },
    };
  }

  let earnedPoints = 0;
  const missingFields: CompletenessResult["missingFields"] = [];
  const filledFields: string[] = [];

  // Initialize category scores
  const categoryScores: Record<FieldCategory, { filled: number; total: number; percentage: number }> = {
    basic: { filled: 0, total: 0, percentage: 0 },
    physical: { filled: 0, total: 0, percentage: 0 },
    skills: { filled: 0, total: 0, percentage: 0 },
    media: { filled: 0, total: 0, percentage: 0 },
    professional: { filled: 0, total: 0, percentage: 0 },
  };

  // Calculate points for each field
  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    const category = getFieldCategory(field);
    if (category) {
      categoryScores[category].total += weight;
    }

    const value = profile[field as keyof TalentProfile];

    if (isFieldFilled(value)) {
      earnedPoints += weight;
      filledFields.push(field);
      if (category) {
        categoryScores[category].filled += weight;
      }
    } else {
      missingFields.push({
        field,
        label: FIELD_LABELS[field] || field,
        category: category || "basic",
        weight,
      });
    }
  }

  // Calculate percentages
  const percentage = Math.round((earnedPoints / totalPoints) * 100);

  for (const category of Object.keys(categoryScores) as FieldCategory[]) {
    const cat = categoryScores[category];
    cat.percentage = cat.total > 0 ? Math.round((cat.filled / cat.total) * 100) : 0;
  }

  // Sort missing fields by weight (most important first)
  missingFields.sort((a, b) => b.weight - a.weight);

  return {
    percentage,
    totalPoints,
    earnedPoints,
    missingFields,
    filledFields,
    categoryScores,
  };
}

/**
 * Get top N missing fields to prioritize
 */
export function getTopMissingFields(
  result: CompletenessResult,
  limit: number = 5
): CompletenessResult["missingFields"] {
  return result.missingFields.slice(0, limit);
}

/**
 * Get completeness status label
 */
export function getCompletenessStatus(percentage: number): {
  label: string;
  color: "red" | "yellow" | "blue" | "green";
} {
  if (percentage < 25) {
    return { label: "Just Started", color: "red" };
  }
  if (percentage < 50) {
    return { label: "In Progress", color: "yellow" };
  }
  if (percentage < 75) {
    return { label: "Getting There", color: "blue" };
  }
  if (percentage < 100) {
    return { label: "Almost Complete", color: "green" };
  }
  return { label: "Complete", color: "green" };
}
