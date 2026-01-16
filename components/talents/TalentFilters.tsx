'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Select, Button } from '@/components/ui';
import { Search, X } from 'lucide-react';

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'OTHER', label: 'Other' },
];

export function TalentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentAgeMin = searchParams.get('ageMin') || '';
  const currentAgeMax = searchParams.get('ageMax') || '';
  const currentAvailable = searchParams.get('available') || '';

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change
      params.delete('page');

      router.push(`/talents?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push('/talents');
  };

  const hasActiveFilters =
    currentSearch || currentGender || currentAgeMin || currentAgeMax || currentAvailable;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name..."
              defaultValue={currentSearch}
              onChange={(e) => {
                // Debounce search input
                const value = e.target.value;
                const timeout = setTimeout(() => {
                  updateFilters({ search: value });
                }, 300);
                return () => clearTimeout(timeout);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Gender Filter */}
        <Select
          value={currentGender}
          onChange={(e) => updateFilters({ gender: e.target.value })}
          options={GENDER_OPTIONS}
        />

        {/* Age Range */}
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min Age"
            value={currentAgeMin}
            onChange={(e) => updateFilters({ ageMin: e.target.value })}
            min={1}
            max={100}
            className="w-full"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max Age"
            value={currentAgeMax}
            onChange={(e) => updateFilters({ ageMax: e.target.value })}
            min={1}
            max={100}
            className="w-full"
          />
        </div>

        {/* Availability Filter */}
        <Select
          value={currentAvailable}
          onChange={(e) => updateFilters({ available: e.target.value })}
          options={[
            { value: '', label: 'Any Availability' },
            { value: 'true', label: 'Available Only' },
          ]}
        />
      </div>

      {/* Active Filters / Clear */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {currentSearch && (
            <FilterTag
              label={`Search: ${currentSearch}`}
              onRemove={() => updateFilters({ search: '' })}
            />
          )}
          {currentGender && (
            <FilterTag
              label={`Gender: ${currentGender}`}
              onRemove={() => updateFilters({ gender: '' })}
            />
          )}
          {(currentAgeMin || currentAgeMax) && (
            <FilterTag
              label={`Age: ${currentAgeMin || 'any'}-${currentAgeMax || 'any'}`}
              onRemove={() => updateFilters({ ageMin: '', ageMax: '' })}
            />
          )}
          {currentAvailable && (
            <FilterTag label="Available Only" onRemove={() => updateFilters({ available: '' })} />
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
      {label}
      <button onClick={onRemove} className="hover:bg-blue-200 rounded-full p-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
