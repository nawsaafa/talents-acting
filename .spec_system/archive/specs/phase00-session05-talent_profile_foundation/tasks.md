# Task Checklist

**Session ID**: `phase00-session05-talent_profile_foundation`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-14

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0005]` = Session reference (Phase 00, Session 05)
- `TNNN` = Task ID

---

## Progress Summary

| Category   | Total  | Done   | Remaining |
| ---------- | ------ | ------ | --------- |
| Setup      | 3      | 3      | 0         |
| Foundation | 4      | 4      | 0         |
| Components | 5      | 5      | 0         |
| Pages      | 5      | 5      | 0         |
| Testing    | 3      | 3      | 0         |
| **Total**  | **20** | **20** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0005] Verify prerequisites met (auth working, UI components available, schema migrated)
- [x] T002 [S0005] Install zod dependency (`npm install zod`)
- [x] T003 [S0005] Create directory structure (`lib/talents/`, `components/talents/`, `app/talents/`, `app/dashboard/profile/`, `public/uploads/talents/`)

---

## Foundation (4 tasks)

Core validation, queries, and server actions.

- [x] T004 [S0005] Create Zod validation schemas for profile forms (`lib/talents/validation.ts`)
- [x] T005 [S0005] Create data fetching queries with public/premium field separation (`lib/talents/queries.ts`)
- [x] T006 [S0005] Create server actions for profile CRUD (`lib/talents/actions.ts`)
- [x] T007 [S0005] Create photo upload API endpoint (`app/api/upload/route.ts`)

---

## Components (5 tasks)

Reusable UI components for talent profiles.

- [x] T008 [S0005] Create PhotoUpload component with preview and validation (`components/talents/PhotoUpload.tsx`)
- [x] T009 [S0005] Create ProfileForm component with grouped field sections (`components/talents/ProfileForm.tsx`)
- [x] T010 [S0005] [P] Create TalentCard component for listing grid (`components/talents/TalentCard.tsx`)
- [x] T011 [S0005] [P] Create TalentFilters component with gender, age, name filters (`components/talents/TalentFilters.tsx`)
- [x] T012 [S0005] [P] Create PremiumSection component with blur/lock for unauthorized users (`components/talents/PremiumSection.tsx`)

---

## Pages (5 tasks)

Application pages and integration.

- [x] T013 [S0005] Create talent listing page with grid and filters (`app/talents/page.tsx`)
- [x] T014 [S0005] Create talent detail page with public/premium sections (`app/talents/[id]/page.tsx`)
- [x] T015 [S0005] Create profile dashboard hub page (`app/dashboard/profile/page.tsx`)
- [x] T016 [S0005] Create profile edit page (`app/dashboard/profile/edit/page.tsx`)
- [x] T017 [S0005] Update Header with link to talents page and update home page with CTA (`components/layout/Header.tsx`, `app/page.tsx`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T018 [S0005] Run ESLint and fix any errors (`npm run lint`)
- [x] T019 [S0005] Verify build passes (`npm run build`)
- [x] T020 [S0005] Manual testing of all flows (create profile, upload photo, listing filters, premium visibility)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] Profile creation flow works end-to-end
- [x] Photo upload validates and stores correctly
- [x] Listing page shows public info only to visitors
- [x] Premium data visible to approved professionals only
- [x] Filters work (gender, age range, name)
- [x] ESLint passes
- [x] Build succeeds
- [x] All files ASCII-encoded
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Tasks T010-T012 (TalentCard, TalentFilters, PremiumSection) can be done simultaneously as they are independent components.

### Task Timing

Target ~15-20 minutes per task. ProfileForm (T009) may take longer due to 40+ fields.

### Dependencies

- T004-T007 must be done in order (validation -> queries -> actions -> upload API)
- T008-T009 depend on T004 (validation) and T007 (upload API)
- T010-T012 are independent components
- T013-T016 depend on T004-T012 (all foundation and components)
- T017 can be done after T013 (listing page exists)

### Key Implementation Notes

- Use `'use client'` only for form components (ProfileForm, PhotoUpload, TalentFilters)
- Pages (listing, detail) should be Server Components
- Photo storage: `public/uploads/talents/[userId]/` with UUID filenames
- Premium fields: `dateOfBirth`, `contactEmail`, `contactPhone`, `bio`, `dailyRate`
- Public fields: `firstName`, `photo`, `gender`, `ageRangeMin`, `ageRangeMax`, `location`, `isAvailable`
- Use `canAccessPremium()` from auth utils for role checks

### File Organization

Create barrel export in `components/talents/index.ts` after all components are built.

---

## Implementation Complete

All 20 tasks have been completed successfully.
