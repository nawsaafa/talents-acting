# Session Specification

**Session ID**: `phase04-session02-seed_data_population`
**Phase**: 04 - Data Migration & Polish
**Status**: Not Started
**Created**: 2026-01-24

---

## 1. Session Overview

This session populates the comprehensive predefined option sets required for talent profiles and filtering, drawing from the legacy WordPress system's extensive skill/language/accent catalogs. The existing system uses String arrays in the TalentProfile model for skills, so this session focuses on expanding the filter-options constants to include all ~200+ legacy options and ensuring the UI components properly display and filter them.

The legacy WordPress system defined specific option sets for languages (8), athletic skills (29), musical instruments (28), dance styles (33), performance skills (25), accents (~70), and Moroccan regions (17). These comprehensive options are essential for accurate legacy data migration (Session 03) and provide users with the full range of choices available in the original system.

This session also adds an admin viewing interface for the option sets, making it easy to verify completeness and maintain consistency. The options are stored as TypeScript constants (matching the existing pattern) rather than database tables, keeping the architecture simple and performant.

---

## 2. Objectives

1. Expand filter-options.ts with all ~200+ legacy option values across 7 categories
2. Create organized option data files with proper groupings (e.g., Moroccan vs international accents)
3. Update ProfileWizard multi-select fields to use the expanded option sets
4. Add admin interface for viewing/verifying all option categories

---

## 3. Prerequisites

### Required Sessions

- [x] `phase04-session01-schema_enhancement` - Added availabilityTypes, birthPlace, imdbUrl fields
- [x] `phase00-session05-talent_profile_foundation` - TalentProfile model with String[] arrays
- [x] `phase01-session01-advanced_filtering` - FilterPanel and filter infrastructure

### Required Tools/Knowledge

- TypeScript constants and type definitions
- React multi-select/checkbox components
- Next.js App Router for admin pages

### Environment Requirements

- Node.js 18+
- Existing filter-options.ts structure

---

## 4. Scope

### In Scope (MVP)

- Complete language options (8 values from legacy)
- Complete athletic skills (29 values from legacy)
- Complete musical instruments (28 values from legacy)
- Complete dance styles (33 values including Moroccan traditional)
- Complete performance skills (25 values from legacy)
- Complete accent options (~70 values with regional groupings)
- Moroccan region options (17 values for location filtering)
- Admin page to view all option categories
- Updated ProfileWizard to use expanded options

### Out of Scope (Deferred)

- Database-stored options with CRUD - _Reason: String arrays are sufficient for current scale_
- User-created custom options - _Reason: Admin-only option management_
- Option localization/translation - _Reason: Session 04 handles i18n_
- Option usage analytics - _Reason: Future enhancement_

---

## 5. Technical Approach

### Architecture

Options are defined as TypeScript constant arrays in `lib/talents/seed-options/` directory, organized by category. Each category file exports:

1. A typed array of option values
2. A labeled options array for UI dropdowns/checkboxes
3. Optional groupings for categorized display (e.g., accents by region)

The existing filter-options.ts imports and re-exports these for backward compatibility.

### Design Patterns

- **Constants Module Pattern**: Centralized option definitions importable throughout the app
- **Grouped Options**: Accents and dance styles organized by regional groupings for better UX
- **Type Safety**: All options typed with `as const` for TypeScript inference

### Technology Stack

- TypeScript 5.x (const assertions, template literal types)
- React components for admin UI
- Existing FilterPanel and ProfileWizard components

---

## 6. Deliverables

### Files to Create

| File                                              | Purpose                                       | Est. Lines |
| ------------------------------------------------- | --------------------------------------------- | ---------- |
| `lib/talents/seed-options/index.ts`               | Central export for all option modules         | ~30        |
| `lib/talents/seed-options/languages.ts`           | 8 language options                            | ~40        |
| `lib/talents/seed-options/athletic-skills.ts`     | 29 athletic skill options                     | ~80        |
| `lib/talents/seed-options/musical-instruments.ts` | 28 musical instrument options                 | ~80        |
| `lib/talents/seed-options/dance-styles.ts`        | 33 dance style options with groupings         | ~100       |
| `lib/talents/seed-options/performance-skills.ts`  | 25 performance skill options                  | ~70        |
| `lib/talents/seed-options/accents.ts`             | ~70 accent options with regional groupings    | ~200       |
| `lib/talents/seed-options/regions.ts`             | 17 Moroccan region options                    | ~50        |
| `app/(dashboard)/admin/options/page.tsx`          | Admin options viewer page                     | ~150       |
| `components/admin/OptionCategoryCard.tsx`         | Card component for displaying option category | ~60        |
| `__tests__/talents/seed-options.test.ts`          | Tests for option completeness                 | ~100       |

### Files to Modify

| File                                      | Changes                                      | Est. Lines |
| ----------------------------------------- | -------------------------------------------- | ---------- |
| `lib/talents/filter-options.ts`           | Import from seed-options, add region options | ~30        |
| `components/profile/steps/SkillsStep.tsx` | Use expanded option arrays                   | ~20        |
| `components/talents/FilterPanel.tsx`      | Add region filter section                    | ~30        |
| `app/(dashboard)/admin/page.tsx`          | Add link to options viewer                   | ~5         |

---

## 7. Success Criteria

### Functional Requirements

- [ ] All 8 language options available in ProfileWizard
- [ ] All 29 athletic skills available in ProfileWizard
- [ ] All 28 musical instruments available in ProfileWizard
- [ ] All 33 dance styles available (including 6 Moroccan traditional)
- [ ] All 25 performance skills available in ProfileWizard
- [ ] All ~70 accent options available with regional groupings
- [ ] All 17 Moroccan regions available for location filtering
- [ ] Admin can view all option categories and counts
- [ ] FilterPanel shows region filter for Moroccan locations

### Testing Requirements

- [ ] Unit tests verify option count per category
- [ ] Unit tests verify no duplicate options within categories
- [ ] Manual testing of ProfileWizard skill selection
- [ ] Manual testing of FilterPanel with new filters

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no new warnings
- [ ] All existing tests continue to pass

---

## 8. Implementation Notes

### Key Considerations

- Legacy accents are organized into groups: Moroccan (6), English (8), French (7), Arabic (10), Spanish (5), and Other (~30)
- Moroccan dance styles include: Ahidous, Ahwach, Chaabi, Gnawa, Guedra, Reggada
- Musical instruments include traditional Moroccan: Oud, Bendir, Guembri, Qraqeb
- Option values should use consistent casing (Title Case for display)

### Potential Challenges

- **Large option lists in UI**: Mitigate with grouped display and search/filter
- **Consistency with legacy**: Verify exact spelling matches for migration compatibility
- **Type safety**: Ensure option values match existing profile data

### ASCII Reminder

All output files must use ASCII-only characters (0-127). Use transliterations for Arabic/French accent names (e.g., "Casaoui" not Casawi with diacritics).

---

## 9. Testing Strategy

### Unit Tests

- Verify each category has expected count of options
- Verify no duplicate values within categories
- Verify all options have both value and label properties
- Verify grouped options sum to total count

### Integration Tests

- ProfileWizard loads and displays all options
- FilterPanel shows region filter

### Manual Testing

- Create/edit profile with skills from each category
- Verify FilterPanel filters by new region options
- Verify admin options page shows all categories

### Edge Cases

- Empty arrays (should display "None selected")
- Maximum selections (test with all options selected)
- Search filtering within large option lists

---

## 10. Dependencies

### External Libraries

- None new (uses existing React, TypeScript)

### Other Sessions

- **Depends on**: Session 01 Schema Enhancement (completed)
- **Depended by**: Session 03 Legacy Data Migration (needs option values for import mapping)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
