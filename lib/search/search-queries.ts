"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, ValidationStatus } from "@prisma/client";
import { sanitizeSearchQuery, toTsQuery } from "./search-utils";

// Result type for search suggestions
export interface SearchSuggestion {
  id: string;
  firstName: string;
  lastName: string | null;
  photo: string | null;
  location: string | null;
}

/**
 * Search talents using PostgreSQL full-text search.
 * Returns talent IDs ordered by relevance for use with Prisma queries.
 *
 * Note: Requires search-setup.sql to be run on the database first.
 * If search_vector column doesn't exist, falls back to ILIKE search.
 */
export async function searchTalentIds(
  query: string,
  limit: number = 50
): Promise<string[]> {
  const sanitized = sanitizeSearchQuery(query);

  if (!sanitized) {
    return [];
  }

  try {
    // Try full-text search first
    const tsquery = toTsQuery(sanitized);

    const results = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "TalentProfile"
      WHERE
        "validationStatus" = ${ValidationStatus.APPROVED}::"ValidationStatus"
        AND "isPublic" = true
        AND search_vector @@ to_tsquery('simple', ${tsquery})
      ORDER BY ts_rank(search_vector, to_tsquery('simple', ${tsquery})) DESC
      LIMIT ${limit}
    `;

    return results.map((r) => r.id);
  } catch (error) {
    // Fallback to ILIKE if search_vector doesn't exist
    console.warn("FTS search failed, falling back to ILIKE:", error);
    return searchTalentIdsFallback(sanitized, limit);
  }
}

/**
 * Fallback search using ILIKE for when FTS isn't set up.
 */
async function searchTalentIdsFallback(
  query: string,
  limit: number
): Promise<string[]> {
  const pattern = `%${query}%`;

  const results = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM "TalentProfile"
    WHERE
      "validationStatus" = ${ValidationStatus.APPROVED}::"ValidationStatus"
      AND "isPublic" = true
      AND (
        "firstName" ILIKE ${pattern}
        OR "lastName" ILIKE ${pattern}
        OR bio ILIKE ${pattern}
        OR location ILIKE ${pattern}
        OR EXISTS (
          SELECT 1 FROM unnest(languages) AS lang
          WHERE lang ILIKE ${pattern}
        )
        OR EXISTS (
          SELECT 1 FROM unnest("performanceSkills") AS skill
          WHERE skill ILIKE ${pattern}
        )
      )
    LIMIT ${limit}
  `;

  return results.map((r) => r.id);
}

/**
 * Get search suggestions for autocomplete.
 * Returns top 5 matching talents with minimal data.
 */
export async function getSearchSuggestions(
  query: string
): Promise<SearchSuggestion[]> {
  const sanitized = sanitizeSearchQuery(query);

  if (!sanitized || sanitized.length < 2) {
    return [];
  }

  try {
    // Try full-text search first
    const tsquery = toTsQuery(sanitized);

    const results = await prisma.$queryRaw<SearchSuggestion[]>`
      SELECT id, "firstName", "lastName", photo, location
      FROM "TalentProfile"
      WHERE
        "validationStatus" = ${ValidationStatus.APPROVED}::"ValidationStatus"
        AND "isPublic" = true
        AND search_vector @@ to_tsquery('simple', ${tsquery})
      ORDER BY ts_rank(search_vector, to_tsquery('simple', ${tsquery})) DESC
      LIMIT 5
    `;

    return results;
  } catch {
    // Fallback to ILIKE
    return getSearchSuggestionsFallback(sanitized);
  }
}

/**
 * Fallback suggestions using ILIKE.
 */
async function getSearchSuggestionsFallback(
  query: string
): Promise<SearchSuggestion[]> {
  const pattern = `%${query}%`;

  return prisma.$queryRaw<SearchSuggestion[]>`
    SELECT id, "firstName", "lastName", photo, location
    FROM "TalentProfile"
    WHERE
      "validationStatus" = ${ValidationStatus.APPROVED}::"ValidationStatus"
      AND "isPublic" = true
      AND (
        "firstName" ILIKE ${pattern}
        OR "lastName" ILIKE ${pattern}
        OR location ILIKE ${pattern}
      )
    LIMIT 5
  `;
}

/**
 * Build Prisma WHERE clause that includes search results.
 * Combines FTS results with standard filters.
 */
export async function buildSearchWhere(
  query: string | undefined,
  baseWhere: Prisma.TalentProfileWhereInput
): Promise<Prisma.TalentProfileWhereInput> {
  if (!query) {
    return baseWhere;
  }

  const ids = await searchTalentIds(query);

  if (ids.length === 0) {
    // No search results - return impossible condition
    return { ...baseWhere, id: { in: [] } };
  }

  return {
    ...baseWhere,
    id: { in: ids },
  };
}
