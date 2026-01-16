import { Prisma, ValidationStatus } from '@prisma/client';
import type { TalentFilterInput } from './validation';

/**
 * Build Prisma WHERE clause from filter parameters.
 * Always includes base conditions for approved and public profiles.
 */
export function buildTalentFilterQuery(params: TalentFilterInput): Prisma.TalentProfileWhereInput {
  const where: Prisma.TalentProfileWhereInput = {
    // Base conditions - always show only approved, public profiles
    validationStatus: ValidationStatus.APPROVED,
    isPublic: true,
    user: { isActive: true },
  };

  // Basic filters
  if (params.search) {
    where.firstName = { contains: params.search, mode: 'insensitive' };
  }

  if (params.gender) {
    where.gender = params.gender;
  }

  // Age range filter - matches profiles that can play within the range
  if (params.ageMin !== undefined || params.ageMax !== undefined) {
    if (params.ageMin !== undefined) {
      where.ageRangeMax = { gte: params.ageMin };
    }
    if (params.ageMax !== undefined) {
      where.ageRangeMin = { lte: params.ageMax };
    }
  }

  // Height range filter
  if (params.minHeight !== undefined || params.maxHeight !== undefined) {
    where.height = {};
    if (params.minHeight !== undefined) {
      where.height.gte = params.minHeight;
    }
    if (params.maxHeight !== undefined) {
      where.height.lte = params.maxHeight;
    }
  }

  // Enum multi-select filters (OR within the array)
  if (params.physique && params.physique.length > 0) {
    where.physique = { in: params.physique };
  }

  if (params.hairColor && params.hairColor.length > 0) {
    where.hairColor = { in: params.hairColor };
  }

  if (params.eyeColor && params.eyeColor.length > 0) {
    where.eyeColor = { in: params.eyeColor };
  }

  if (params.hairLength && params.hairLength.length > 0) {
    where.hairLength = { in: params.hairLength };
  }

  // Array field filters - use hasSome for partial matching
  if (params.languages && params.languages.length > 0) {
    where.languages = { hasSome: params.languages };
  }

  if (params.athleticSkills && params.athleticSkills.length > 0) {
    where.athleticSkills = { hasSome: params.athleticSkills };
  }

  if (params.danceStyles && params.danceStyles.length > 0) {
    where.danceStyles = { hasSome: params.danceStyles };
  }

  if (params.performanceSkills && params.performanceSkills.length > 0) {
    where.performanceSkills = { hasSome: params.performanceSkills };
  }

  // Professional filters
  if (params.isAvailable !== undefined) {
    where.isAvailable = params.isAvailable;
  }

  // Daily rate range filter
  if (params.minRate !== undefined || params.maxRate !== undefined) {
    where.dailyRate = {};
    if (params.minRate !== undefined) {
      where.dailyRate.gte = params.minRate;
    }
    if (params.maxRate !== undefined) {
      where.dailyRate.lte = params.maxRate;
    }
  }

  return where;
}

/**
 * Parse URL search params into TalentFilterInput.
 * Handles type conversion and array parsing.
 */
export function parseFilterParams(
  searchParams: Record<string, string | undefined>
): Partial<TalentFilterInput> {
  const params: Partial<TalentFilterInput> = {};

  // Search query (full-text search)
  if (searchParams.q) {
    params.q = searchParams.q;
  }

  // Basic filters (legacy search param)
  if (searchParams.search) {
    params.search = searchParams.search;
  }

  if (searchParams.gender) {
    params.gender = searchParams.gender as TalentFilterInput['gender'];
  }

  if (searchParams.ageMin) {
    const parsed = parseInt(searchParams.ageMin, 10);
    if (!isNaN(parsed)) params.ageMin = parsed;
  }

  if (searchParams.ageMax) {
    const parsed = parseInt(searchParams.ageMax, 10);
    if (!isNaN(parsed)) params.ageMax = parsed;
  }

  // Height range
  if (searchParams.minHeight) {
    const parsed = parseInt(searchParams.minHeight, 10);
    if (!isNaN(parsed)) params.minHeight = parsed;
  }

  if (searchParams.maxHeight) {
    const parsed = parseInt(searchParams.maxHeight, 10);
    if (!isNaN(parsed)) params.maxHeight = parsed;
  }

  // Enum array filters (comma-separated)
  if (searchParams.physique) {
    params.physique = searchParams.physique
      .split(',')
      .filter(Boolean) as TalentFilterInput['physique'];
  }

  if (searchParams.hairColor) {
    params.hairColor = searchParams.hairColor
      .split(',')
      .filter(Boolean) as TalentFilterInput['hairColor'];
  }

  if (searchParams.eyeColor) {
    params.eyeColor = searchParams.eyeColor
      .split(',')
      .filter(Boolean) as TalentFilterInput['eyeColor'];
  }

  if (searchParams.hairLength) {
    params.hairLength = searchParams.hairLength
      .split(',')
      .filter(Boolean) as TalentFilterInput['hairLength'];
  }

  // Skills array filters
  if (searchParams.languages) {
    params.languages = searchParams.languages.split(',').filter(Boolean);
  }

  if (searchParams.athleticSkills) {
    params.athleticSkills = searchParams.athleticSkills.split(',').filter(Boolean);
  }

  if (searchParams.danceStyles) {
    params.danceStyles = searchParams.danceStyles.split(',').filter(Boolean);
  }

  if (searchParams.performanceSkills) {
    params.performanceSkills = searchParams.performanceSkills.split(',').filter(Boolean);
  }

  // Professional filters
  if (searchParams.isAvailable === 'true') {
    params.isAvailable = true;
  }

  if (searchParams.minRate) {
    const parsed = parseFloat(searchParams.minRate);
    if (!isNaN(parsed)) params.minRate = parsed;
  }

  if (searchParams.maxRate) {
    const parsed = parseFloat(searchParams.maxRate);
    if (!isNaN(parsed)) params.maxRate = parsed;
  }

  // Pagination
  if (searchParams.page) {
    const parsed = parseInt(searchParams.page, 10);
    if (!isNaN(parsed) && parsed >= 1) params.page = parsed;
  }

  if (searchParams.limit) {
    const parsed = parseInt(searchParams.limit, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) params.limit = parsed;
  }

  return params;
}
