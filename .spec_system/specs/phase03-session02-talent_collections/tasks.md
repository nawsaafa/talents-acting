# Task Checklist

**Session ID**: `phase03-session02-talent_collections`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-18

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0302]` = Session reference (Phase 03, Session 02)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 2      | 2      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 11     | 11     | 0         |
| Testing        | 2      | 2      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0302] Verify prerequisites met (Prisma client, auth, access control modules)
- [x] T002 [S0302] Create directory structure (`lib/collections/`, `components/collections/`, `__tests__/collections/`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T003 [S0302] Add Collection, CollectionTalent, CollectionShare models to Prisma schema (`prisma/schema.prisma`)
- [x] T004 [S0302] Create TypeScript interfaces for collections (`lib/collections/types.ts`)
- [x] T005 [S0302] Implement access control functions for collections (`lib/collections/access.ts`)
- [x] T006 [S0302] Implement database queries for collections CRUD and share links (`lib/collections/queries.ts`)
- [x] T007 [S0302] Implement server actions for collection mutations (`lib/collections/actions.ts`)

---

## Implementation (11 tasks)

Main feature implementation.

- [x] T008 [S0302] Implement CSV export functionality (`lib/collections/export.ts`)
- [x] T009 [S0302] [P] Create CollectionCard component for collection preview (`components/collections/CollectionCard.tsx`)
- [x] T010 [S0302] [P] Create CollectionTalentCard component with remove action (`components/collections/CollectionTalentCard.tsx`)
- [x] T011 [S0302] Create CollectionList component for user's collections grid (`components/collections/CollectionList.tsx`)
- [x] T012 [S0302] Create CollectionDetail component with talent grid (`components/collections/CollectionDetail.tsx`)
- [x] T013 [S0302] [P] Create CreateCollectionModal for new collection form (`components/collections/CreateCollectionModal.tsx`)
- [x] T014 [S0302] Create AddToCollectionButton and AddToCollectionModal components (`components/collections/AddToCollectionButton.tsx`, `AddToCollectionModal.tsx`)
- [x] T015 [S0302] Create ShareCollectionModal for generating share links (`components/collections/ShareCollectionModal.tsx`)
- [x] T016 [S0302] Create barrel export for components (`components/collections/index.ts`)
- [x] T017 [S0302] Create collection pages: list, detail, and public share (`app/collections/page.tsx`, `[id]/page.tsx`, `share/[token]/page.tsx`)
- [x] T018 [S0302] Integrate AddToCollectionButton into talent profile and card, add nav link (`app/talents/[id]/page.tsx`, `components/talents/TalentCard.tsx`, `components/auth/AuthStatus.tsx`)

---

## Testing (2 tasks)

Verification and quality assurance.

- [x] T019 [S0302] [P] Write unit tests for access control and queries (`__tests__/collections/access.test.ts`, `__tests__/collections/export.test.ts`)
- [x] T020 [S0302] Run test suite, validate ASCII encoding, and perform manual testing

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (275/275)
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization

Tasks marked `[P]` can be worked on simultaneously:

- T009, T010, T013: Independent UI components
- T019: Tests can be written in parallel with other test file

### Task Timing

Target ~15-20 minutes per task.

### Dependencies

- T003 must complete before T004-T007 (Prisma types needed)
- T004-T007 must complete before T008-T018 (lib functions needed)
- T011-T012 depend on T009-T010 (use card components)
- T017 depends on T011-T015 (pages use components)
- T018 depends on T014 (integration uses AddToCollectionButton)

### Key Implementation Notes

- Share tokens: Use `crypto.randomBytes(32).toString('hex')`
- Bulk add: Use upsert pattern to prevent duplicates
- CSV export: Include only public talent fields
- Access control: Reuse patterns from `lib/messaging/access.ts`

---

## Next Steps

Run `/implement` to begin AI-led implementation.
