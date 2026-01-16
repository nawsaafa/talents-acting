# Task Checklist

**Session ID**: `phase02-session02-company_registration`
**Total Tasks**: 25
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-16

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0202]` = Session reference (Phase 02, Session 02)
- `TNNN` = Task ID

---

## Progress Summary

| Category            | Total  | Done   | Remaining |
| ------------------- | ------ | ------ | --------- |
| Setup               | 2      | 2      | 0         |
| Foundation          | 4      | 4      | 0         |
| Registration Wizard | 8      | 8      | 0         |
| Team & Invites      | 3      | 3      | 0         |
| Dashboard           | 3      | 3      | 0         |
| Admin               | 2      | 2      | 0         |
| Testing             | 3      | 3      | 0         |
| **Total**           | **25** | **25** | **0**     |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0202] Create directory structure for company components and lib (`components/company/`, `lib/company/`)
- [x] T002 [S0202] Extend Prisma schema with CompanyMember model and emailVerified/verificationToken fields (`prisma/schema.prisma`)

---

## Foundation (4 tasks)

Core structures and base implementations.

- [x] T003 [S0202] Create Zod validation schemas for registration steps and invitation (`lib/company/validation.ts`)
- [x] T004 [S0202] Create database queries for companies, members, and invitations (`lib/company/queries.ts`)
- [x] T005 [S0202] Create server actions for registration, verification, invitation, and profile (`lib/company/actions.ts`)
- [x] T006 [S0202] Create team invitation email template (`lib/email/templates/company-invitation.tsx`)

---

## Registration Wizard (8 tasks)

Multi-step registration form implementation.

- [x] T007 [S0202] [P] Create AccountStep component with email/password fields (`components/company/steps/AccountStep.tsx`)
- [x] T008 [S0202] [P] Create CompanyStep component with company name/industry fields (`components/company/steps/CompanyStep.tsx`)
- [x] T009 [S0202] [P] Create ContactStep component with contact details (`components/company/steps/ContactStep.tsx`)
- [x] T010 [S0202] [P] Create TermsStep component with acceptance checkboxes (`components/company/steps/TermsStep.tsx`)
- [x] T011 [S0202] Create ProgressIndicator component for wizard navigation (`components/company/ProgressIndicator.tsx`)
- [x] T012 [S0202] Create RegistrationWizard container with FormProvider state (`components/company/RegistrationWizard.tsx`)
- [x] T013 [S0202] Update company registration page to use RegistrationWizard (`app/(auth)/register/company/page.tsx`)
- [x] T014 [S0202] Create registration success page (`app/(auth)/register/company/success/page.tsx`)

---

## Team & Invites (3 tasks)

Team member invitation workflow.

- [x] T015 [S0202] Create TeamManagement component with member list and invite trigger (`components/company/TeamManagement.tsx`)
- [x] T016 [S0202] Create InviteMemberForm component for sending invitations (`components/company/InviteMemberForm.tsx`)
- [x] T017 [S0202] Create invitation acceptance page with InviteContent component (`app/invite/page.tsx`, `app/invite/InviteContent.tsx`)

---

## Dashboard (3 tasks)

Company dashboard and profile management.

- [x] T018 [S0202] Create company dashboard with status display and team overview (`app/dashboard/company/page.tsx`)
- [x] T019 [S0202] Create company profile page with ProfileForm component (`app/dashboard/company/profile/page.tsx`, `app/dashboard/company/profile/ProfileForm.tsx`)
- [x] T020 [S0202] Create team management page for full team view (`app/dashboard/company/team/page.tsx`)

---

## Admin (2 tasks)

Admin queue and review functionality.

- [x] T021 [S0202] Create admin company detail/review page (`app/admin/companies/[id]/page.tsx`)
- [x] T022 [S0202] Update admin companies queue with detail links and add getCompanyForReview query (`app/admin/companies/page.tsx`, `lib/admin/queries.ts`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T023 [S0202] Write unit tests for validation schemas (`__tests__/company/validation.test.ts`)
- [x] T024 [S0202] Run full test suite and fix any TypeScript/ESLint issues
- [x] T025 [S0202] Manual testing: registration flow, team invitation, admin approval

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing
- [x] All files ASCII-encoded
- [x] No TypeScript errors (`npm run typecheck`)
- [x] No ESLint warnings (`npm run lint`)
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization Opportunities

- **T007-T010**: All four wizard step components are independent and can be created simultaneously
- This parallelization can save significant time during implementation

### Task Timing

Target ~10-15 minutes per task for simpler components, ~20-25 minutes for complex ones (T005, T012, T018, T021).

### Dependencies

- T002 must complete before T004-T005 (queries/actions need schema)
- T003 must complete before T007-T010 (steps use validation schemas)
- T007-T011 must complete before T012 (wizard needs all steps)
- T005 must complete before T013-T022 (pages use server actions)
- T006 must complete before T015-T017 (invite flow needs email template)

### Pattern Reuse from Session 01

- Copy and adapt ProgressIndicator from `components/professional/`
- Reuse email sending pattern from `lib/email/send.ts`
- Reuse ValidationActions component for admin page
- Follow same wizard state management pattern

### Key Differences from Professional Registration

1. **CompanyMember model**: Many-to-many User-Company relationship
2. **Team invitations**: New invite/accept workflow
3. **Company-specific fields**: industry, contactEmail, etc.

---

## Next Steps

Session implementation complete. Run `/validate` to verify all requirements are met.
