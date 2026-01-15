# Task Checklist

**Session ID**: `phase01-session01-advanced_filtering`
**Total Tasks**: 20
**Estimated Duration**: 2-3 hours
**Created**: 2026-01-15

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0101]` = Phase 01, Session 01 reference
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 2 | 2 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0101] Verify prerequisites met (Phase 00 complete, database running, dev server works)
- [x] T002 [S0101] Create directory structure (`components/talents/filters/`, `hooks/`)

---

## Foundation (5 tasks)

Core types, options, and query infrastructure.

- [x] T003 [S0101] [P] Create filter options constants (`lib/talents/filter-options.ts`)
  - Export GENDER_OPTIONS, PHYSIQUE_OPTIONS, HAIR_COLOR_OPTIONS, EYE_COLOR_OPTIONS, HAIR_LENGTH_OPTIONS
  - Export COMMON_LANGUAGES array for language filter
  - Export COMMON_SKILLS arrays for athletic, dance, performance skills

- [x] T004 [S0101] [P] Extend TalentFilterInput schema (`lib/talents/validation.ts`)
  - Add height range (minHeight, maxHeight)
  - Add physique array
  - Add hairColor, eyeColor, hairLength arrays
  - Add languages array
  - Add athleticSkills, danceStyles, performanceSkills arrays
  - Add dailyRate range (minRate, maxRate)

- [x] T005 [S0101] Create useFilters hook (`hooks/useFilters.ts`)
  - Read all filter values from URL searchParams
  - Provide setFilter(key, value) function
  - Provide setFilters(updates) for batch updates
  - Provide clearFilters() function
  - Provide clearSection(keys[]) for section clear
  - Handle array serialization (comma-separated)

- [x] T006 [S0101] Create filter query builder (`lib/talents/filters.ts`)
  - buildTalentFilterQuery(params) returns Prisma WHERE input
  - Handle all filter types: single enum, multi-enum, range, array contains
  - Always include validationStatus: APPROVED, isPublic: true
  - Handle undefined/empty values gracefully

- [x] T007 [S0101] Update getPublicTalents to use filter builder (`lib/talents/queries.ts`)
  - Import and use buildTalentFilterQuery
  - Pass extended filter params through

---

## Implementation (9 tasks)

Filter components and integration.

- [x] T008 [S0101] Create FilterSection component (`components/talents/FilterSection.tsx`)
  - Collapsible section with chevron toggle
  - Title with active filter count badge
  - Clear section button
  - Smooth expand/collapse animation

- [x] T009 [S0101] [P] Create RangeFilter component (`components/talents/filters/RangeFilter.tsx`)
  - Two number inputs (min/max) with labels
  - Optional unit suffix (e.g., "cm" for height)
  - Debounced onChange (300ms)
  - Clear button when values set

- [x] T010 [S0101] [P] Create EnumSelectFilter component (`components/talents/filters/EnumSelectFilter.tsx`)
  - Single or multi-select mode prop
  - Checkbox list for multi-select
  - Radio list for single-select
  - Options from filter-options.ts

- [x] T011 [S0101] [P] Create MultiSelectFilter component (`components/talents/filters/MultiSelectFilter.tsx`)
  - Searchable input for filtering options
  - Checkbox list of matching options
  - Selected items shown as chips
  - Support for custom options (languages, skills)

- [x] T012 [S0101] Create barrel exports for filters (`components/talents/filters/index.ts`)
  - Export RangeFilter, EnumSelectFilter, MultiSelectFilter

- [x] T013 [S0101] Create FilterPanel component (`components/talents/FilterPanel.tsx`)
  - Four sections: Basic, Physical, Skills, Professional
  - Basic: Gender (EnumSelect), Age (Range)
  - Physical: Height (Range), Physique (EnumSelect), HairColor (EnumSelect), EyeColor (EnumSelect), HairLength (EnumSelect)
  - Skills: Languages (MultiSelect), Athletic (MultiSelect), Dance (MultiSelect), Performance (MultiSelect)
  - Professional: Availability (toggle), DailyRate (Range)
  - Clear All Filters button
  - Total active filter count
  - Mobile: drawer/sheet trigger button

- [x] T014 [S0101] Update talents page layout (`app/talents/page.tsx`)
  - Replace TalentFilters with FilterPanel
  - Update searchParams type for all new filter params
  - Pass extended filters to TalentGrid
  - Desktop: sidebar layout (FilterPanel left, grid right)
  - Mobile: FilterPanel as drawer

- [x] T015 [S0101] Update talents barrel exports (`components/talents/index.ts`)
  - Export FilterPanel, FilterSection
  - Export individual filter components

- [x] T016 [S0101] Add mobile filter drawer pattern (`components/talents/FilterPanel.tsx`)
  - Filter button visible on mobile (shows active count)
  - Full-screen drawer/sheet on click
  - Close button and Apply button in drawer
  - Drawer closes on Apply

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0101] Run ESLint and fix any errors (`npm run lint`)
  - Target: 0 errors
  - Warnings acceptable if minor

- [x] T018 [S0101] Run build and verify success (`npm run build`)
  - No TypeScript errors
  - No build failures

- [x] T019 [S0101] Manual testing and verification
  - Test each filter type individually
  - Test filter combinations
  - Verify URL state persistence (copy URL, new tab)
  - Test browser back/forward
  - Test clear section and clear all
  - Test mobile drawer
  - Test empty state (no matches)

- [x] T020 [S0101] Validate file quality
  - All files ASCII-encoded
  - Unix LF line endings
  - No console.log statements left
  - Update implementation-notes.md

---

## Completion Checklist

Before marking session complete:

- [x] All 20 tasks marked `[x]`
- [x] ESLint: 0 errors (2 pre-existing warnings in admin pages)
- [x] Build: successful
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks T003+T004, T009+T010+T011 can be worked on simultaneously.

### Task Timing
Target ~10-15 minutes per task (foundation/implementation), ~5 minutes for setup/testing.

### Dependencies
- T005 depends on T004 (needs schema types)
- T006 depends on T004 (needs schema types)
- T007 depends on T006 (needs query builder)
- T013 depends on T008, T009, T010, T011, T012 (needs all filter components)
- T014 depends on T013 (needs FilterPanel)
- T016 depends on T013 (adds to FilterPanel)

### Key Files
| File | Purpose |
|------|---------|
| `lib/talents/filter-options.ts` | Static filter option constants |
| `lib/talents/filters.ts` | Query builder for Prisma WHERE |
| `hooks/useFilters.ts` | URL state management |
| `components/talents/FilterPanel.tsx` | Main filter UI |
| `app/talents/page.tsx` | Page integration |

---

## Next Steps

Run `/implement` to begin AI-led implementation.
