# Task Checklist

**Session ID**: `phase04-session03-legacy_data_migration`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-25

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0403]` = Session reference (Phase 04, Session 03)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 3      | 3      | 0         |
| Foundation     | 4      | 4      | 0         |
| Implementation | 8      | 8      | 0         |
| Testing        | 5      | 5      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0403] Verify prerequisites (408 tests passing, ts-node available)
- [x] T002 [S0403] Create migration scripts directory structure (`scripts/migration/`)
- [x] T003 [S0403] Update Prisma schema with legacyId field for migration tracking

---

## Foundation (4 tasks)

Core types, configuration, and base structures.

- [x] T004 [S0403] [P] Create TypeScript interfaces for WordPress data (`scripts/migration/types.ts`)
- [x] T005 [S0403] [P] Create field mapping configuration (`scripts/migration/config.ts`)
- [x] T006 [S0403] [P] Create sample WordPress export for testing (`data/sample-wordpress-export.json`)
- [x] T007 [S0403] Run Prisma generate and verify schema changes

---

## Implementation (8 tasks)

Main migration infrastructure implementation.

- [x] T008 [S0403] Implement WordPress parser for JSON exports (`scripts/migration/wordpress-parser.ts`)
- [x] T009 [S0403] Implement data transformer with field mappings (`scripts/migration/data-transformer.ts`)
- [x] T010 [S0403] Implement user migrator with password reset flow (`scripts/migration/user-migrator.ts`)
- [x] T011 [S0403] Implement profile migrator for TalentProfile data (`scripts/migration/profile-migrator.ts`)
- [x] T012 [S0403] Implement media migrator for photos (`scripts/migration/media-migrator.ts`)
- [x] T013 [S0403] Implement validator for data integrity checks (`scripts/migration/validator.ts`)
- [x] T014 [S0403] Implement rollback script (`scripts/migration/rollback.ts`)
- [x] T015 [S0403] Implement main CLI orchestrator (`scripts/migration/index.ts`)

---

## Testing (5 tasks)

Verification and quality assurance.

- [x] T016 [S0403] [P] Write unit tests for data transformer (`__tests__/migration/transformer.test.ts`)
- [x] T017 [S0403] [P] Write unit tests for validator (`__tests__/migration/validator.test.ts`)
- [x] T018 [S0403] Add migration script commands to package.json
- [x] T019 [S0403] Run full test suite and verify all tests passing
- [x] T020 [S0403] Validate ASCII encoding and lint on all new files

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (481 tests - 408 existing + 73 new migration tests)
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization

Tasks marked `[P]` can be worked on simultaneously:

- T004, T005, T006: Foundation files with no dependencies
- T016, T017: Test files for different modules

### Task Timing

Target ~15-20 minutes per task.

### Dependencies

- T003 must complete before T007 (schema must exist before generate)
- T004, T005 must complete before T008-T014 (types needed for implementation)
- T008-T014 should be done in order (parser -> transformer -> migrators -> validator -> rollback -> CLI)
- T015 depends on all implementation tasks (orchestrates everything)
- T016-T017 can run in parallel once their target modules exist

### Key Technical Notes

1. **Password Security**: User migrator generates random passwords, does NOT migrate hashes
2. **Idempotency**: Use legacyId field to skip already-migrated records
3. **Validation Status**: Migrated profiles start as APPROVED
4. **Dry-Run Mode**: CLI must support `--dry-run` flag

---

## Next Steps

Run `/implement` to begin AI-led implementation.
