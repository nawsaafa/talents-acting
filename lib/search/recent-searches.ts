/**
 * Recent searches management using localStorage
 */

const STORAGE_KEY = 'talents-recent-searches';
const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch {
  query: string;
  timestamp: number;
}

/**
 * Get recent searches from localStorage.
 * Returns empty array if localStorage is unavailable.
 */
export function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Validate and return
    return parsed.filter(
      (item): item is RecentSearch =>
        typeof item === 'object' &&
        typeof item.query === 'string' &&
        typeof item.timestamp === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * Add a search query to recent searches.
 * - Moves existing query to top if already present
 * - Limits to MAX_RECENT_SEARCHES
 */
export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return;
  }

  try {
    const current = getRecentSearches();

    // Remove existing entry if present
    const filtered = current.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());

    // Add new entry at the beginning
    const updated: RecentSearch[] = [{ query: trimmed, timestamp: Date.now() }, ...filtered].slice(
      0,
      MAX_RECENT_SEARCHES
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Remove a specific search from recent searches.
 */
export function removeRecentSearch(query: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getRecentSearches();
    const filtered = current.filter((item) => item.query.toLowerCase() !== query.toLowerCase());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail
  }
}

/**
 * Clear all recent searches.
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Get recent search queries as simple string array.
 */
export function getRecentSearchQueries(): string[] {
  return getRecentSearches().map((item) => item.query);
}
