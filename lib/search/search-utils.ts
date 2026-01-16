/**
 * Search utilities for query sanitization and text highlighting
 */

// Maximum search query length
const MAX_QUERY_LENGTH = 100;

// Characters to escape in PostgreSQL tsquery
const TSQUERY_SPECIAL_CHARS = /[&|!():*<>'"\\]/g;

/**
 * Sanitize and prepare search query for PostgreSQL full-text search.
 * - Trims whitespace
 * - Limits length
 * - Escapes special characters
 * - Converts to tsquery format with prefix matching
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return '';
  }

  // Trim and limit length
  let sanitized = query.trim().slice(0, MAX_QUERY_LENGTH);

  // Remove special tsquery characters
  sanitized = sanitized.replace(TSQUERY_SPECIAL_CHARS, ' ');

  // Collapse multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

/**
 * Convert sanitized query to PostgreSQL tsquery format.
 * Each word gets prefix matching (:*) for partial matching.
 * Multiple words are combined with AND (&).
 */
export function toTsQuery(query: string): string {
  const sanitized = sanitizeSearchQuery(query);

  if (!sanitized) {
    return '';
  }

  // Split into words and create prefix-matching terms
  const words = sanitized.split(' ').filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  // Join with AND operator, each word gets prefix matching
  return words.map((word) => `${word}:*`).join(' & ');
}

/**
 * Extract search terms from query for highlighting.
 * Returns lowercase terms for case-insensitive matching.
 */
export function extractSearchTerms(query: string): string[] {
  const sanitized = sanitizeSearchQuery(query);

  if (!sanitized) {
    return [];
  }

  return sanitized
    .toLowerCase()
    .split(' ')
    .filter((term) => term.length >= 2); // Only terms with 2+ chars
}

/**
 * Find match positions in text for highlighting.
 * Returns array of [start, end] positions.
 */
export function findMatchPositions(text: string, terms: string[]): Array<[number, number]> {
  if (!text || terms.length === 0) {
    return [];
  }

  const positions: Array<[number, number]> = [];
  const lowerText = text.toLowerCase();

  for (const term of terms) {
    let startIndex = 0;
    let index: number;

    while ((index = lowerText.indexOf(term, startIndex)) !== -1) {
      positions.push([index, index + term.length]);
      startIndex = index + 1;
    }
  }

  // Sort by start position and merge overlapping ranges
  positions.sort((a, b) => a[0] - b[0]);

  return mergeOverlappingRanges(positions);
}

/**
 * Merge overlapping position ranges.
 */
function mergeOverlappingRanges(ranges: Array<[number, number]>): Array<[number, number]> {
  if (ranges.length === 0) {
    return [];
  }

  const merged: Array<[number, number]> = [ranges[0]];

  for (let i = 1; i < ranges.length; i++) {
    const current = ranges[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      // Overlapping - extend the range
      last[1] = Math.max(last[1], current[1]);
    } else {
      // Non-overlapping - add new range
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Check if a query is valid for searching.
 * Returns true if query has at least one searchable term.
 */
export function isValidSearchQuery(query: string): boolean {
  const terms = extractSearchTerms(query);
  return terms.length > 0;
}
