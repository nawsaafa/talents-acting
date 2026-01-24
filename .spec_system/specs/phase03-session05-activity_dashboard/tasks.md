# Task Checklist

**Session ID**: `phase03-session05-activity_dashboard`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-24

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0305]` = Session reference (Phase 03, Session 05)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 2      | 2      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 10     | 10     | 0         |
| Testing        | 3      | 3      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0305] Verify prerequisites met - confirm messaging, collections, notifications, contact-requests modules exist
- [x] T002 [S0305] Create directory structure for activity module (`lib/activity/`, `components/activity/`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T003 [S0305] Add ProfileView model to Prisma schema (`prisma/schema.prisma`)
- [x] T004 [S0305] Run Prisma migration for ProfileView table (`prisma/migrations/`)
- [x] T005 [S0305] Define activity types and interfaces (`lib/activity/types.ts`)
- [x] T006 [S0305] [P] Create component barrel export file (`components/activity/index.ts`)
- [x] T007 [S0305] [P] Create DashboardSummaryCard reusable component (`components/activity/DashboardSummaryCard.tsx`)

---

## Implementation (10 tasks)

Main feature implementation.

- [x] T008 [S0305] Implement activity aggregation queries (`lib/activity/queries.ts`)
- [x] T009 [S0305] Implement profile view tracking server actions (`lib/activity/actions.ts`)
- [x] T010 [S0305] Create ActivityFeedItem component for rendering activity items (`components/activity/ActivityFeedItem.tsx`)
- [x] T011 [S0305] Create ActivityFeed component with unified activity display (`components/activity/ActivityFeed.tsx`)
- [x] T012 [S0305] [P] Create TalentActivitySection component (`components/activity/TalentActivitySection.tsx`)
- [x] T013 [S0305] [P] Create ProfessionalActivitySection component (`components/activity/ProfessionalActivitySection.tsx`)
- [x] T014 [S0305] [P] Create CompanyActivitySection component (`components/activity/CompanyActivitySection.tsx`)
- [x] T015 [S0305] Integrate ProfessionalActivitySection into professional dashboard (`app/dashboard/professional/page.tsx`)
- [x] T016 [S0305] Integrate CompanyActivitySection into company dashboard (`app/dashboard/company/page.tsx`)
- [x] T017 [S0305] Integrate TalentActivitySection into talent profile dashboard (`app/dashboard/profile/page.tsx`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T018 [S0305] Write unit tests for activity queries and profile view tracking (`__tests__/activity/queries.test.ts`)
- [x] T019 [S0305] Run full test suite and verify all tests passing
- [x] T020 [S0305] Manual testing of all dashboard types and ASCII/lint validation

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

Tasks marked `[P]` can be worked on simultaneously:

- T006 + T007: Barrel file and summary card are independent
- T012 + T013 + T014: Role-specific activity sections are independent

### Task Timing

Target ~15-20 minutes per task.

### Dependencies

- T003 must complete before T004 (schema before migration)
- T005 must complete before T008-T009 (types before queries/actions)
- T008-T009 must complete before T010-T014 (queries before components)
- T010-T011 must complete before T012-T14 (base components before sections)
- T012-T14 must complete before T15-T17 (sections before integration)

### Key Technical Notes

- Profile view tracking stores aggregate counts only (privacy-conscious)
- Use `Promise.all` for parallel data fetching in dashboard pages
- Activity feed limited to 10 most recent items for performance
- All dashboard content must respect subscription status

---

## Next Steps

Run `/implement` to begin AI-led implementation.
