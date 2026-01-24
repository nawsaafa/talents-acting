# Task Checklist

**Session ID**: `phase03-session04-contact_requests`
**Total Tasks**: 20
**Estimated Duration**: 4-5 hours
**Created**: 2026-01-24

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0304]` = Session reference (Phase 03, Session 04)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 3      | 3      | 0         |
| Foundation     | 4      | 4      | 0         |
| Implementation | 9      | 9      | 0         |
| Integration    | 2      | 2      | 0         |
| Testing        | 2      | 2      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0304] Verify prerequisites met - Notification system configured, messaging and collections modules present
- [x] T002 [S0304] Create directory structure for `lib/contact-requests/`, `components/contact-requests/`, `app/contact-requests/`, `app/dashboard/requests/`
- [x] T003 [S0304] Add ContactRequest model, ContactRequestStatus enum, and ProjectType enum to Prisma schema (`prisma/schema.prisma`)

---

## Foundation (4 tasks)

Core structures and base implementations.

- [x] T004 [S0304] Run Prisma migration and generate client (`npx prisma db push && npx prisma generate`)
- [x] T005 [S0304] Create TypeScript interfaces for contact requests (`lib/contact-requests/types.ts`)
- [x] T006 [S0304] Create access control functions with rate limiting logic (`lib/contact-requests/access.ts`)
- [x] T007 [S0304] Create database query functions for contact requests (`lib/contact-requests/queries.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T008 [S0304] Create core contact request service with notification integration (`lib/contact-requests/service.ts`)
- [x] T009 [S0304] Create server actions for contact request CRUD and status transitions (`lib/contact-requests/actions.ts`)
- [x] T010 [S0304] [P] Create new contact request email template (`lib/email/templates/contact-request-new.tsx`)
- [x] T011 [S0304] [P] Create approval and decline email templates (`lib/email/templates/contact-request-approved.tsx`, `lib/email/templates/contact-request-declined.tsx`)
- [x] T012 [S0304] Create ContactRequestForm component with project type, purpose, and message fields (`components/contact-requests/ContactRequestForm.tsx`)
- [x] T013 [S0304] Create ContactRequestCard and ContactRequestActions components (`components/contact-requests/`)
- [x] T014 [S0304] Create ContactInfoReveal, ContactRequestList components with barrel export (`components/contact-requests/`)
- [x] T015 [S0304] Create requester history page with status filtering (`app/contact-requests/page.tsx`)
- [x] T016 [S0304] Create talent pending requests page (`app/dashboard/requests/page.tsx`)

---

## Integration (2 tasks)

Connect contact requests to existing features.

- [x] T017 [S0304] Add "Request Contact" button to talent profile page with eligibility check (`app/talents/[id]/page.tsx`)
- [x] T018 [S0304] Add pending requests section to talent dashboard and admin oversight section (`app/dashboard/page.tsx`, `app/admin/page.tsx`)

---

## Testing (2 tasks)

Verification and quality assurance.

- [x] T019 [S0304] [P] Write unit tests for access control and service functions (`__tests__/contact-requests/`)
- [x] T020 [S0304] Run full test suite, validate ASCII encoding, and perform manual testing

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

- T010 and T011 (email templates) are independent
- T019 test writing can happen alongside late implementation tasks

### Task Timing

Target ~20-25 minutes per task.

### Dependencies

- T004 must complete before T005-T009 (need Prisma client)
- T005-T007 must complete before T008-T009 (need types and queries)
- T008-T009 must complete before T012-T016 (components need service)
- T012-T014 must complete before T015-T016 (pages need components)
- T015-T016 must complete before T017-T018 (integration needs pages)

### Key Implementation Notes

- Follow existing patterns from `lib/notifications/` and `lib/messaging/` modules
- Use React Email templates matching existing `lib/email/templates/` style
- CONTACT_REQUEST notification type already exists in schema - leverage existing notification service
- Rate limiting: max 5 pending requests per requester per 24 hours
- Status transitions are one-way and final (PENDING -> APPROVED or DECLINED)
- Contact info (phone, email) must NEVER be exposed before approval

### Access Control Rules

```
canCreateContactRequest:
  - Authenticated user
  - Role: PROFESSIONAL or COMPANY
  - SubscriptionStatus: ACTIVE
  - ValidationStatus: APPROVED

canViewContactRequest:
  - Requester (own requests)
  - Target talent (requests to them)
  - Admin (all requests)

canRespondToContactRequest:
  - Target talent only
  - Status must be PENDING
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
