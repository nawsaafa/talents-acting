'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { FilterSection } from './FilterSection';
import { RangeFilter, EnumSelectFilter, MultiSelectFilter } from './filters';
import { useFilters } from '@/hooks/useFilters';
import {
  GENDER_OPTIONS,
  PHYSIQUE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EYE_COLOR_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  AVAILABILITY_TYPE_OPTIONS,
  COMMON_LANGUAGES,
  ATHLETIC_SKILLS,
  DANCE_STYLES,
  PERFORMANCE_SKILLS,
} from '@/lib/talents/filter-options';
import { Button } from '@/components/ui';

export function FilterPanel() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { filters, activeFilterCount, setFilter, setFilters, clearFilters, clearSection } =
    useFilters();

  // Count active filters per section
  const basicCount =
    (filters.gender ? 1 : 0) +
    (filters.ageMin !== undefined || filters.ageMax !== undefined ? 1 : 0);

  const physicalCount =
    (filters.minHeight !== undefined || filters.maxHeight !== undefined ? 1 : 0) +
    (filters.physique?.length ? 1 : 0) +
    (filters.hairColor?.length ? 1 : 0) +
    (filters.eyeColor?.length ? 1 : 0) +
    (filters.hairLength?.length ? 1 : 0);

  const skillsCount =
    (filters.languages?.length ? 1 : 0) +
    (filters.athleticSkills?.length ? 1 : 0) +
    (filters.danceStyles?.length ? 1 : 0) +
    (filters.performanceSkills?.length ? 1 : 0);

  const professionalCount =
    (filters.isAvailable !== undefined ? 1 : 0) +
    (filters.availabilityTypes?.length ? 1 : 0) +
    (filters.minRate !== undefined || filters.maxRate !== undefined ? 1 : 0);

  const filterContent = (
    <div className="space-y-0">
      {/* Header with clear all */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Basic Filters */}
      <FilterSection
        title="Basic"
        activeCount={basicCount}
        onClear={() => clearSection(['gender', 'ageMin', 'ageMax'])}
      >
        <div className="space-y-4">
          <EnumSelectFilter
            label="Gender"
            options={GENDER_OPTIONS}
            value={filters.gender}
            onChange={(value) => setFilter('gender', value as string)}
          />
          <RangeFilter
            label="Age Range"
            minValue={filters.ageMin}
            maxValue={filters.ageMax}
            minPlaceholder="Min"
            maxPlaceholder="Max"
            min={1}
            max={100}
            onChange={(min, max) => setFilters({ ageMin: min ?? null, ageMax: max ?? null })}
          />
        </div>
      </FilterSection>

      {/* Physical Attributes */}
      <FilterSection
        title="Physical"
        activeCount={physicalCount}
        onClear={() =>
          clearSection([
            'minHeight',
            'maxHeight',
            'physique',
            'hairColor',
            'eyeColor',
            'hairLength',
          ])
        }
      >
        <div className="space-y-4">
          <RangeFilter
            label="Height"
            minValue={filters.minHeight}
            maxValue={filters.maxHeight}
            minPlaceholder="Min"
            maxPlaceholder="Max"
            unit="cm"
            min={50}
            max={300}
            onChange={(min, max) => setFilters({ minHeight: min ?? null, maxHeight: max ?? null })}
          />
          <EnumSelectFilter
            label="Physique"
            options={PHYSIQUE_OPTIONS}
            value={filters.physique}
            multi
            onChange={(value) => setFilter('physique', value as string[])}
          />
          <EnumSelectFilter
            label="Hair Color"
            options={HAIR_COLOR_OPTIONS}
            value={filters.hairColor}
            multi
            onChange={(value) => setFilter('hairColor', value as string[])}
          />
          <EnumSelectFilter
            label="Eye Color"
            options={EYE_COLOR_OPTIONS}
            value={filters.eyeColor}
            multi
            onChange={(value) => setFilter('eyeColor', value as string[])}
          />
          <EnumSelectFilter
            label="Hair Length"
            options={HAIR_LENGTH_OPTIONS}
            value={filters.hairLength}
            multi
            onChange={(value) => setFilter('hairLength', value as string[])}
          />
        </div>
      </FilterSection>

      {/* Skills */}
      <FilterSection
        title="Skills"
        activeCount={skillsCount}
        onClear={() =>
          clearSection(['languages', 'athleticSkills', 'danceStyles', 'performanceSkills'])
        }
        defaultOpen={false}
      >
        <div className="space-y-4">
          <MultiSelectFilter
            label="Languages"
            options={COMMON_LANGUAGES}
            value={filters.languages}
            onChange={(value) => setFilter('languages', value ?? null)}
            placeholder="Search languages..."
          />
          <MultiSelectFilter
            label="Athletic Skills"
            options={ATHLETIC_SKILLS}
            value={filters.athleticSkills}
            onChange={(value) => setFilter('athleticSkills', value ?? null)}
            placeholder="Search skills..."
          />
          <MultiSelectFilter
            label="Dance Styles"
            options={DANCE_STYLES}
            value={filters.danceStyles}
            onChange={(value) => setFilter('danceStyles', value ?? null)}
            placeholder="Search dance styles..."
          />
          <MultiSelectFilter
            label="Performance Skills"
            options={PERFORMANCE_SKILLS}
            value={filters.performanceSkills}
            onChange={(value) => setFilter('performanceSkills', value ?? null)}
            placeholder="Search skills..."
          />
        </div>
      </FilterSection>

      {/* Professional */}
      <FilterSection
        title="Professional"
        activeCount={professionalCount}
        onClear={() => clearSection(['isAvailable', 'availabilityTypes', 'minRate', 'maxRate'])}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isAvailable === true}
              onChange={(e) => setFilter('isAvailable', e.target.checked ? true : null)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Available only</span>
          </label>
          <EnumSelectFilter
            label="Availability Schedule"
            options={[...AVAILABILITY_TYPE_OPTIONS]}
            value={filters.availabilityTypes}
            multi
            onChange={(value) => setFilter('availabilityTypes', value as string[])}
          />
          <RangeFilter
            label="Daily Rate"
            minValue={filters.minRate}
            maxValue={filters.maxRate}
            minPlaceholder="Min"
            maxPlaceholder="Max"
            min={0}
            step={100}
            onChange={(min, max) => setFilters({ minRate: min ?? null, maxRate: max ?? null })}
          />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setMobileOpen(true)}
          className="w-full justify-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-4 bg-white border border-gray-200 rounded-lg p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {filterContent}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto p-4">{filterContent}</div>

              {/* Drawer footer */}
              <div className="p-4 border-t border-gray-200">
                <Button onClick={() => setMobileOpen(false)} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
