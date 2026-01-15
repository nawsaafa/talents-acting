import { prisma } from "@/lib/prisma";
import { ValidationStatus, Prisma } from "@prisma/client";
import type { TalentFilterInput } from "./validation";
import { buildTalentFilterQuery } from "./filters";

// Public fields visible to all users
const publicSelect = {
  id: true,
  firstName: true,
  photo: true,
  photos: true,
  videoUrls: true,
  gender: true,
  ageRangeMin: true,
  ageRangeMax: true,
  location: true,
  isAvailable: true,
  physique: true,
  height: true,
  hairColor: true,
  eyeColor: true,
  hairLength: true,
  ethnicAppearance: true,
  languages: true,
  performanceSkills: true,
  createdAt: true,
} as const;

// Premium fields only visible to authorized users
const premiumSelect = {
  ...publicSelect,
  lastName: true,
  dateOfBirth: true,
  contactEmail: true,
  contactPhone: true,
  bio: true,
  dailyRate: true,
  rateNegotiable: true,
  beardType: true,
  hasTattoos: true,
  hasScars: true,
  tattooDescription: true,
  scarDescription: true,
  accents: true,
  athleticSkills: true,
  musicalInstruments: true,
  danceStyles: true,
  portfolio: true,
  socialMedia: true,
  userId: true,
} as const;

// Full profile for editing (includes all fields)
const fullSelect = {
  ...premiumSelect,
  photos: true,
  videoUrls: true,
  validationStatus: true,
  validatedAt: true,
  rejectionReason: true,
  isPublic: true,
  presentationVideo: true,
  showreel: true,
  hasShowreel: true,
  updatedAt: true,
} as const;

export type PublicTalentProfile = Prisma.TalentProfileGetPayload<{
  select: typeof publicSelect;
}>;

export type PremiumTalentProfile = Prisma.TalentProfileGetPayload<{
  select: typeof premiumSelect;
}>;

export type FullTalentProfile = Prisma.TalentProfileGetPayload<{
  select: typeof fullSelect;
}>;

// Get talents for public listing (approved and public only)
export async function getPublicTalents(filters: TalentFilterInput) {
  const { page = 1, limit = 12 } = filters;

  // Use the filter query builder for all filtering logic
  const where = buildTalentFilterQuery(filters);

  const [talents, total] = await Promise.all([
    prisma.talentProfile.findMany({
      where,
      select: publicSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.talentProfile.count({ where }),
  ]);

  return {
    talents,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get single talent with public fields only
export async function getPublicTalentById(id: string) {
  return prisma.talentProfile.findFirst({
    where: {
      id,
      validationStatus: ValidationStatus.APPROVED,
      isPublic: true,
    },
    select: publicSelect,
  });
}

// Get single talent with premium fields (for authorized users)
export async function getPremiumTalentById(id: string) {
  return prisma.talentProfile.findFirst({
    where: {
      id,
      validationStatus: ValidationStatus.APPROVED,
      isPublic: true,
    },
    select: premiumSelect,
  });
}

// Get talent profile by user ID (for profile owner)
export async function getTalentProfileByUserId(userId: string) {
  return prisma.talentProfile.findUnique({
    where: { userId },
    select: fullSelect,
  });
}

// Check if user has a talent profile
export async function userHasTalentProfile(userId: string) {
  const profile = await prisma.talentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  return !!profile;
}

// Get talent count for stats
export async function getApprovedTalentCount() {
  return prisma.talentProfile.count({
    where: {
      validationStatus: ValidationStatus.APPROVED,
      isPublic: true,
    },
  });
}
