# Task Checklist

**Session ID**: `phase02-session01-professional_registration`
**Total Tasks**: 22
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-16

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0201]` = Session reference (Phase 02, Session 01)
- `TNNN` = Task ID

---

## Progress Summary

| Category            | Total  | Done   | Remaining |
| ------------------- | ------ | ------ | --------- |
| Setup               | 2      | 2      | 0         |
| Foundation          | 6      | 6      | 0         |
| Implementation      | 11     | 11     | 0         |
| Admin & Integration | 3      | 3      | 0         |
| Testing             | 3      | 3      | 0         |
| **Total**           | **25** | **25** | **0**     |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0201] Install dependencies: react-hook-form, @hookform/resolvers, resend (`package.json`)
- [x] T002 [S0201] Create directory structure for professional components and lib (`components/professional/`, `lib/professional/`, `lib/email/`)

---

## Foundation (6 tasks)

Core structures and base implementations.

- [x] T003 [S0201] Extend Prisma schema with ProfessionalProfile model and enums (`prisma/schema.prisma`)
- [x] T004 [S0201] Run Prisma migration and generate client (`prisma/migrations/`) [NOTE: Client generated, migration pending DB connection]
- [x] T005 [S0201] Create Zod validation schemas for registration steps (`lib/professional/validation.ts`)
- [x] T006 [S0201] Create database queries for professionals (`lib/professional/queries.ts`)
- [x] T007 [S0201] Create email sending utility with dev fallback (`lib/email/send.ts`)
- [x] T008 [S0201] [P] Create email templates: verification, approved, rejected (`lib/email/templates/*.tsx`)

---

## Implementation (11 tasks)

Main feature implementation.

- [x] T009 [S0201] [P] Create AccountStep component with email/password fields (`components/professional/steps/AccountStep.tsx`)
- [x] T010 [S0201] [P] Create PersonalStep component with name/profession fields (`components/professional/steps/PersonalStep.tsx`)
- [x] T011 [S0201] [P] Create ProfessionalStep component with company/reason fields (`components/professional/steps/ProfessionalStep.tsx`)
- [x] T012 [S0201] [P] Create TermsStep component with acceptance checkbox (`components/professional/steps/TermsStep.tsx`)
- [x] T013 [S0201] Create ProgressIndicator component for wizard (`components/professional/ProgressIndicator.tsx`)
- [x] T014 [S0201] Create RegistrationWizard container with state management (`components/professional/RegistrationWizard.tsx`)
- [x] T015 [S0201] Create server actions for registration, verification, admin (`lib/professional/actions.ts`)
- [x] T016 [S0201] Create professional registration page (`app/(auth)/register/professional/page.tsx`)
- [x] T017 [S0201] Create email verification handler page (`app/verify-email/page.tsx`)
- [x] T018 [S0201] Create professional dashboard with status display (`app/dashboard/professional/page.tsx`)
- [x] T019 [S0201] Create professional profile management page (`app/dashboard/professional/profile/page.tsx`)

---

## Admin & Integration (3 tasks)

Admin queue and system integration.

- [x] T020 [S0201] Create admin professionals queue page (`app/admin/professionals/page.tsx`)
- [x] T021 [S0201] Create admin professional detail/review page (`app/admin/professionals/[id]/page.tsx`)
- [x] T022 [S0201] Update AdminSidebar and auth for professional role (`components/admin/AdminSidebar.tsx`, `lib/auth.ts`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T023 [S0201] Write unit tests for validation schemas and queries (`__tests__/professional/*.test.ts`)
- [x] T024 [S0201] Run full test suite and fix any failures
- [x] T025 [S0201] Manual testing: registration flow, verification, admin approval/rejection

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] All tests passing
- [ ] All files ASCII-encoded
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization Opportunities

- **T008**: All three email templates can be created simultaneously
- **T009-T012**: All four wizard step components are independent
- These 7 tasks can be worked on in parallel, significantly reducing implementation time

### Task Timing

Target ~10-15 minutes per task for simpler components, ~20-25 minutes for complex ones (T014, T015, T020).

### Dependencies

- T003 must complete before T004 (migration depends on schema)
- T004 must complete before T006 (queries need generated client)
- T005 must complete before T009-T012 (steps use validation schemas)
- T008-T012 must complete before T014 (wizard needs steps and templates)
- T015 must complete before T016-T021 (pages use server actions)

### Email Configuration

For development, the email utility will log to console. Set `RESEND_API_KEY` environment variable for production email delivery.

---

## Next Steps

Run `/implement` to begin AI-led implementation.
