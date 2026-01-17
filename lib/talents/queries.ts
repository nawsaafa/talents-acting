import { prisma } from '@/lib/prisma';
import { ValidationStatus, Prisma } from '@prisma/client';
import type { TalentFilterInput } from './validation';
import { buildTalentFilterQuery } from './filters';
import { buildSearchWhere } from '@/lib/search/search-queries';
import type { AccessContext, AccessLevel } from '@/lib/access/types';
import { getAccessLevel, canAccessTalentPremiumData } from '@/lib/access/control';
import { logAccessGranted, logAccessDenied } from '@/lib/access/logging';

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
  const baseWhere = buildTalentFilterQuery(filters);

  // Apply search query if present (q param for FTS)
  const where = await buildSearchWhere(filters.q, baseWhere);

  const [talents, total] = await Promise.all([
    prisma.talentProfile.findMany({
      where,
      select: publicSelect,
      orderBy: { createdAt: 'desc' },
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
    searchQuery: filters.q || null,
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

// Export select objects for use in other modules
export { publicSelect, premiumSelect, fullSelect };

/**
 * Get talent by ID with access control
 * Returns public or premium data based on user's subscription status
 */
export async function getTalentWithAccessControl(
  talentId: string,
  context: AccessContext
): Promise<{
  data: PublicTalentProfile | PremiumTalentProfile | null;
  accessLevel: AccessLevel;
  hasFullAccess: boolean;
}> {
  // First get the talent to check if viewing own profile
  const talent = await prisma.talentProfile.findFirst({
    where: {
      id: talentId,
      validationStatus: ValidationStatus.APPROVED,
      isPublic: true,
    },
    select: { userId: true },
  });

  if (!talent) {
    return { data: null, accessLevel: 'public', hasFullAccess: false };
  }

  // Check access with self-access bypass
  const accessResult = canAccessTalentPremiumData(context, talent.userId);

  if (accessResult.granted) {
    // Log successful access
    await logAccessGranted(context.userId, 'talent_profile', talentId, 'view');

    // Fetch with premium or full select based on access level
    const data = await prisma.talentProfile.findFirst({
      where: { id: talentId },
      select: accessResult.level === 'full' ? fullSelect : premiumSelect,
    });

    return {
      data,
      accessLevel: accessResult.level,
      hasFullAccess: accessResult.level === 'full',
    };
  } else {
    // Log denied access
    await logAccessDenied(
      context.userId,
      'talent_profile',
      talentId,
      accessResult.reason || 'Subscription required'
    );

    // Return public data only
    const data = await prisma.talentProfile.findFirst({
      where: { id: talentId },
      select: publicSelect,
    });

    return {
      data,
      accessLevel: 'public',
      hasFullAccess: false,
    };
  }
}

/**
 * Get talents list with appropriate data based on access level
 */
export async function getTalentsWithAccessControl(
  filters: TalentFilterInput,
  context: AccessContext
): Promise<{
  talents: PublicTalentProfile[] | PremiumTalentProfile[];
  total: number;
  page: number;
  totalPages: number;
  searchQuery: string | null;
  accessLevel: AccessLevel;
}> {
  const { page = 1, limit = 12 } = filters;
  const accessLevel = getAccessLevel(context);

  // Use the filter query builder for all filtering logic
  const baseWhere = buildTalentFilterQuery(filters);

  // Apply search query if present
  const where = await buildSearchWhere(filters.q, baseWhere);

  // Select based on access level
  const select = accessLevel === 'public' ? publicSelect : premiumSelect;

  const [talents, total] = await Promise.all([
    prisma.talentProfile.findMany({
      where,
      select,
      orderBy: { createdAt: 'desc' },
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
    searchQuery: filters.q || null,
    accessLevel,
  };
}
