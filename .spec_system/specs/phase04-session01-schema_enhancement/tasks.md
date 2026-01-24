# Task Checklist

**Session ID**: `phase04-session01-schema_enhancement`
**Total Tasks**: 18
**Estimated Duration**: 2-3 hours
**Created**: 2026-01-24

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0401]` = Session reference (Phase 04, Session 01)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 2      | 2      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 7      | 7      | 0         |
| Testing        | 4      | 4      | 0         |
| **Total**      | **18** | **18** | **0**     |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0401] Verify prerequisites met - database running, Prisma CLI available, existing tests passing
- [x] T002 [S0401] Review existing schema and form files to understand current patterns

---

## Foundation (5 tasks)

Core schema changes and type definitions.

- [x] T003 [S0401] Add AvailabilityType enum with 9 legacy options (`prisma/schema.prisma`)
- [x] T004 [S0401] Add birthPlace, availabilityTypes, imdbUrl fields to TalentProfile (`prisma/schema.prisma`)
- [x] T005 [S0401] Run Prisma migration and verify schema changes applied
- [x] T006 [S0401] [P] Create availability-types.ts with constants and helper functions (`lib/talents/availability-types.ts`)
- [x] T007 [S0401] [P] Update TalentProfile types and Zod schemas (`lib/talents/types.ts`, `lib/talents/schemas.ts`)

---

## Implementation (7 tasks)

Main feature implementation - forms, filters, and queries.

- [x] T008 [S0401] Update talent queries to include new fields (`lib/talents/queries.ts`)
- [x] T009 [S0401] Add birthPlace input to ProfileWizard Step 1 Basic Info (`components/profile/ProfileWizard.tsx`)
- [x] T010 [S0401] Add availabilityTypes multi-select to ProfileWizard Step 5 Professional (`components/profile/ProfileWizard.tsx`)
- [x] T011 [S0401] Add imdbUrl input with validation to ProfileWizard Step 5 Professional (`components/profile/ProfileWizard.tsx`)
- [x] T012 [S0401] [P] Add InlineEdit support for birthPlace and imdbUrl fields (`components/profile/InlineEdit.tsx`)
- [x] T013 [S0401] Add availability filter section to FilterPanel (`components/talents/FilterPanel.tsx`)
- [x] T014 [S0401] Implement availability filter logic with Prisma hasSome query (`lib/talents/filters.ts`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T015 [S0401] Write unit tests for availability-types helpers (`__tests__/talents/availability-types.test.ts`)
- [x] T016 [S0401] Write unit tests for IMDB URL validation in schemas (`__tests__/talents/schemas.test.ts`)
- [x] T017 [S0401] Run full test suite and verify all tests passing (359+)
- [x] T018 [S0401] Validate ASCII encoding, run linter, and perform manual testing

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] All tests passing (359+ existing + new)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no new warnings
- [ ] All files ASCII-encoded with LF line endings
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Tasks marked `[P]` can be worked on simultaneously:

- T006 and T007 can run in parallel (independent type/helper files)
- T012 can run in parallel with T013/T014 (InlineEdit is independent of FilterPanel)

### Task Timing

Target ~10-15 minutes per task for this session (simpler schema changes).

### Dependencies

1. T003-T005 must complete before T006-T018 (schema must exist first)
2. T006-T007 must complete before T008-T014 (types needed for implementation)
3. T008-T014 must complete before T015-T018 (code needed for testing)

### Key Technical Notes

- Use SCREAMING_SNAKE_CASE for enum values (e.g., `SHORT_TERM_1_2_DAYS`)
- IMDB URL pattern: `https://www.imdb.com/name/nm[digits]/`
- availabilityTypes uses Prisma `hasSome` for filtering
- All new fields are nullable for backwards compatibility

---

## Next Steps

Run `/implement` to begin AI-led implementation.
