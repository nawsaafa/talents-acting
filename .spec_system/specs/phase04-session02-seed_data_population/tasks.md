# Task Checklist

**Session ID**: `phase04-session02-seed_data_population`
**Total Tasks**: 17
**Estimated Duration**: 2-3 hours
**Created**: 2026-01-24

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0402]` = Session reference (Phase 04, Session 02)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 2      | 2      | 0         |
| Foundation     | 8      | 8      | 0         |
| Implementation | 4      | 4      | 0         |
| Testing        | 3      | 3      | 0         |
| **Total**      | **17** | **17** | **0**     |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0402] Verify prerequisites met - existing tests passing, filter-options.ts exists
- [x] T002 [S0402] Create seed-options directory structure (`lib/talents/seed-options/`)

---

## Foundation (8 tasks)

Option data files with complete legacy values.

- [x] T003 [S0402] [P] Create languages options with 8 values (`lib/talents/seed-options/languages.ts`)
- [x] T004 [S0402] [P] Create athletic skills options with 29 values (`lib/talents/seed-options/athletic-skills.ts`)
- [x] T005 [S0402] [P] Create musical instruments options with 28 values (`lib/talents/seed-options/musical-instruments.ts`)
- [x] T006 [S0402] [P] Create dance styles options with 33 values and Moroccan groupings (`lib/talents/seed-options/dance-styles.ts`)
- [x] T007 [S0402] [P] Create performance skills options with 25 values (`lib/talents/seed-options/performance-skills.ts`)
- [x] T008 [S0402] [P] Create accent options with ~70 values and regional groupings (`lib/talents/seed-options/accents.ts`)
- [x] T009 [S0402] [P] Create Moroccan region options with 17 values (`lib/talents/seed-options/regions.ts`)
- [x] T010 [S0402] Create central index exporting all option modules (`lib/talents/seed-options/index.ts`)

---

## Implementation (4 tasks)

Integration with existing components.

- [x] T011 [S0402] Update filter-options.ts to import from seed-options and add region options (`lib/talents/filter-options.ts`)
- [x] T012 [S0402] [P] Update SkillsStep to use expanded option arrays (`components/profile/steps/SkillsStep.tsx`)
- [x] T013 [S0402] [P] Add region filter section to FilterPanel (`components/talents/FilterPanel.tsx`)
- [x] T014 [S0402] Create admin options viewer page with OptionCategoryCard component (`app/admin/options/page.tsx`, `components/admin/OptionCategoryCard.tsx`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T015 [S0402] Write unit tests for option completeness and no duplicates (`__tests__/talents/seed-options.test.ts`)
- [x] T016 [S0402] Run full test suite and verify all tests passing
- [x] T017 [S0402] Validate ASCII encoding, lint, and manual testing of ProfileWizard and FilterPanel

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] All tests passing (379+ existing + new)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no new warnings
- [ ] All files ASCII-encoded with LF line endings
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Tasks T003-T009 (option data files) can all be worked on simultaneously as they create independent files. Tasks T012-T013 can also run in parallel.

### Task Timing

Target ~10-15 minutes per task for this session (option data is straightforward).

### Dependencies

1. T001-T002 must complete before T003-T010 (directory must exist first)
2. T003-T010 must complete before T011 (options must exist to import)
3. T011 must complete before T012-T014 (filter-options must be updated first)
4. T003-T014 must complete before T015-T017 (code needed for testing)

### Key Technical Notes

- All option values use Title Case for display labels
- Accents grouped by region: Moroccan (6), English (8), French (7), Arabic (10), Spanish (5), Other (~30)
- Moroccan dance styles: Ahidous, Ahwach, Chaabi, Gnawa, Guedra, Reggada
- Traditional instruments: Oud, Bendir, Guembri, Qraqeb
- Use ASCII-only characters (transliterate Arabic/French names)

### Legacy Option Counts

| Category            | Count    |
| ------------------- | -------- |
| Languages           | 8        |
| Athletic Skills     | 29       |
| Musical Instruments | 28       |
| Dance Styles        | 33       |
| Performance Skills  | 25       |
| Accents             | ~70      |
| Moroccan Regions    | 17       |
| **Total**           | **~210** |

---

## Next Steps

Run `/implement` to begin AI-led implementation.
