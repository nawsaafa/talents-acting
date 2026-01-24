# Task Checklist

**Session ID**: `phase02-session05-access_control`
**Total Tasks**: 18
**Estimated Duration**: 2-3 hours
**Created**: 2026-01-17

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0205]` = Session reference (Phase 02, Session 05)
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

- [x] T001 [S0205] Create lib/access directory structure (`lib/access/`)
- [x] T002 [S0205] Add AccessLog model to Prisma schema and generate client (`prisma/schema.prisma`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T003 [S0205] Define access control types and interfaces (`lib/access/types.ts`)
- [x] T004 [S0205] Implement core access control utilities (`lib/access/control.ts`)
- [x] T005 [S0205] Implement access logging functions (`lib/access/logging.ts`)
- [x] T006 [S0205] Add requirePremiumAccess to auth utilities (`lib/auth/utils.ts`)
- [x] T007 [S0205] Add subscription-aware talent query functions (`lib/talents/queries.ts`)

---

## Implementation (7 tasks)

Main feature implementation.

- [x] T008 [S0205] [P] Create UpgradePrompt component (`components/subscription/UpgradePrompt.tsx`)
- [x] T009 [S0205] [P] Create AccessGate wrapper component (`components/subscription/AccessGate.tsx`)
- [x] T010 [S0205] Update talent detail page with access control (`app/talents/[id]/page.tsx`)
- [x] T011 [S0205] [P] Add subscription status to professional dashboard (`app/dashboard/professional/page.tsx`)
- [x] T012 [S0205] [P] Add subscription status to company dashboard (`app/dashboard/company/page.tsx`)
- [x] T013 [S0205] Implement admin bypass for subscription checks (`lib/access/control.ts`)
- [x] T014 [S0205] Implement talent self-access bypass (own profile) (`lib/access/control.ts`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T015 [S0205] Write unit tests for access control functions (`__tests__/access/control.test.ts`)
- [x] T016 [S0205] Run full test suite and verify all tests passing
- [x] T017 [S0205] Run TypeScript check and fix any errors
- [x] T018 [S0205] Manual testing of upgrade prompts and access gates

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] All tests passing
- [ ] All files ASCII-encoded
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Tasks T008-T009 (components) can be worked on simultaneously.
Tasks T011-T012 (dashboard updates) can be worked on simultaneously.

### Task Timing

Target ~10-15 minutes per task (session is focused and builds on existing infrastructure).

### Dependencies

- T002 must complete before T005 (AccessLog model needed for logging)
- T003 must complete before T004-T007 (types needed first)
- T004-T007 must complete before T008-T014 (core utilities needed for UI)
- T015 should be written after T004-T006 (test what's implemented)

### Key Implementation Details

**Access Control Logic (T004)**:

```typescript
// Combines role + subscription status
canAccessPremiumData(role, subscriptionStatus) -> boolean
requirePremiumAccess() -> throws if unauthorized
```

**Admin/Self Bypass (T013-T014)**:

- Admins always have full access
- Talents viewing own profile have full access

---

## Next Steps

Run `/implement` to begin AI-led implementation.
