'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Filter keys that accept array values (comma-separated in URL)
const ARRAY_FILTER_KEYS = [
  'physique',
  'hairColor',
  'eyeColor',
  'hairLength',
  'languages',
  'athleticSkills',
  'danceStyles',
  'performanceSkills',
  'availabilityTypes',
] as const;

type ArrayFilterKey = (typeof ARRAY_FILTER_KEYS)[number];

export type FilterValue = string | string[] | number | boolean | null;

export interface FilterState {
  // Basic filters
  search?: string;
  gender?: string;
  ageMin?: number;
  ageMax?: number;

  // Physical attribute filters
  minHeight?: number;
  maxHeight?: number;
  physique?: string[];
  hairColor?: string[];
  eyeColor?: string[];
  hairLength?: string[];

  // Skills filters
  languages?: string[];
  athleticSkills?: string[];
  danceStyles?: string[];
  performanceSkills?: string[];

  // Professional filters
  isAvailable?: boolean;
  availabilityTypes?: string[];
  minRate?: number;
  maxRate?: number;
}

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current filters from URL
  const filters = useMemo<FilterState>(() => {
    const state: FilterState = {};

    // Basic filters
    const search = searchParams.get('search');
    if (search) state.search = search;

    const gender = searchParams.get('gender');
    if (gender) state.gender = gender;

    const ageMin = searchParams.get('ageMin');
    if (ageMin) state.ageMin = parseInt(ageMin, 10);

    const ageMax = searchParams.get('ageMax');
    if (ageMax) state.ageMax = parseInt(ageMax, 10);

    // Physical attribute filters
    const minHeight = searchParams.get('minHeight');
    if (minHeight) state.minHeight = parseInt(minHeight, 10);

    const maxHeight = searchParams.get('maxHeight');
    if (maxHeight) state.maxHeight = parseInt(maxHeight, 10);

    // Array filters (comma-separated)
    for (const key of ARRAY_FILTER_KEYS) {
      const value = searchParams.get(key);
      if (value) {
        state[key] = value.split(',').filter(Boolean);
      }
    }

    // Professional filters
    const isAvailable = searchParams.get('isAvailable');
    if (isAvailable === 'true') state.isAvailable = true;

    const minRate = searchParams.get('minRate');
    if (minRate) state.minRate = parseFloat(minRate);

    const maxRate = searchParams.get('maxRate');
    if (maxRate) state.maxRate = parseFloat(maxRate);

    return state;
  }, [searchParams]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.search) count++;
    if (filters.gender) count++;
    if (filters.ageMin !== undefined || filters.ageMax !== undefined) count++;
    if (filters.minHeight !== undefined || filters.maxHeight !== undefined) count++;
    if (filters.physique?.length) count++;
    if (filters.hairColor?.length) count++;
    if (filters.eyeColor?.length) count++;
    if (filters.hairLength?.length) count++;
    if (filters.languages?.length) count++;
    if (filters.athleticSkills?.length) count++;
    if (filters.danceStyles?.length) count++;
    if (filters.performanceSkills?.length) count++;
    if (filters.isAvailable !== undefined) count++;
    if (filters.availabilityTypes?.length) count++;
    if (filters.minRate !== undefined || filters.maxRate !== undefined) count++;

    return count;
  }, [filters]);

  // Update URL with new filters
  const updateUrl = useCallback(
    (newParams: URLSearchParams) => {
      // Reset to page 1 when filters change
      newParams.delete('page');
      const queryString = newParams.toString();
      router.push(queryString ? `/talents?${queryString}` : '/talents');
    },
    [router]
  );

  // Set a single filter value
  const setFilter = useCallback(
    (key: string, value: FilterValue) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          params.delete(key);
        } else {
          params.set(key, value.join(','));
        }
      } else if (typeof value === 'boolean') {
        if (value) {
          params.set(key, 'true');
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, String(value));
      }

      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  // Set multiple filters at once
  const setFilters = useCallback(
    (updates: Record<string, FilterValue>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            params.delete(key);
          } else {
            params.set(key, value.join(','));
          }
        } else if (typeof value === 'boolean') {
          if (value) {
            params.set(key, 'true');
          } else {
            params.delete(key);
          }
        } else {
          params.set(key, String(value));
        }
      }

      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push('/talents');
  }, [router]);

  // Clear specific filter keys (for section clear)
  const clearSection = useCallback(
    (keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const key of keys) {
        params.delete(key);
      }

      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  // Toggle a value in an array filter
  const toggleArrayValue = useCallback(
    (key: ArrayFilterKey, value: string) => {
      const currentValues = filters[key] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      setFilter(key, newValues);
    },
    [filters, setFilter]
  );

  return {
    filters,
    activeFilterCount,
    setFilter,
    setFilters,
    clearFilters,
    clearSection,
    toggleArrayValue,
  };
}
