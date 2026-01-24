# Task Checklist

**Session ID**: `phase02-session04-subscription_management`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-17

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0204]` = Session reference (Phase 02, Session 04)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 3      | 3      | 0         |
| Foundation     | 4      | 4      | 0         |
| Implementation | 9      | 9      | 0         |
| Testing        | 4      | 4      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0204] Verify prerequisites met (Stripe keys, dependencies)
- [x] T002 [S0204] Update Prisma schema with stripeCustomerId, stripeSubscriptionId fields (`prisma/schema.prisma`)
- [x] T003 [S0204] Run Prisma migration and generate client

---

## Foundation (4 tasks)

Core structures and base implementations.

- [x] T004 [S0204] Create Stripe Product/Price configuration (`lib/payment/products.ts`)
- [x] T005 [S0204] Create subscription management functions (`lib/payment/subscription.ts`)
- [x] T006 [S0204] Create Customer Portal session helper (`lib/payment/portal.ts`)
- [x] T007 [S0204] Add subscription queries to payment queries (`lib/payment/queries.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T008 [S0204] Convert checkout actions to subscription mode (`lib/payment/actions.ts`)
- [x] T009 [S0204] Add subscription lifecycle webhook handlers (`lib/payment/webhooks.ts`)
- [x] T010 [S0204] Update webhook route for new event types (`app/api/webhooks/stripe/route.ts`)
- [x] T011 [S0204] [P] Create subscription renewed email template (`lib/email/templates/subscription-renewed.tsx`)
- [x] T012 [S0204] [P] Create payment failed email template (`lib/email/templates/payment-failed.tsx`)
- [x] T013 [S0204] [P] Create talent billing history page (`app/dashboard/talent/billing/page.tsx`)
- [x] T014 [S0204] [P] Create professional billing history page (`app/dashboard/professional/billing/page.tsx`)
- [x] T015 [S0204] [P] Create company billing history page (`app/dashboard/company/billing/page.tsx`)
- [x] T016 [S0204] Add subscription status cards to dashboard pages (`app/dashboard/*/page.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0204] Write unit tests for subscription functions (`__tests__/payment/subscription.test.ts`)
- [x] T018 [S0204] Run full test suite and fix any errors
- [x] T019 [S0204] Validate TypeScript and ESLint - zero errors/warnings
- [x] T020 [S0204] Manual testing with Stripe test mode

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (123/123)
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization

Tasks T011-T015 are marked `[P]` and can be worked on simultaneously:

- Email templates (T011, T012)
- Billing pages (T013, T014, T015)

### Task Timing

Target ~15-20 minutes per task.

### Dependencies

- T003 (migration) must complete before T004-T007
- T004-T007 (foundation) must complete before T008-T010 (implementation)
- T008-T010 must complete before T016 (dashboard status cards)
- All implementation tasks must complete before T017-T020 (testing)

### Key Technical Notes

- Stripe Customers created on first checkout, reused for re-subscriptions
- Webhook handlers must be idempotent (check status before updating)
- Customer Portal requires billing_portal config in Stripe Dashboard
- Use Stripe test mode with card 4242 4242 4242 4242

---

## Next Steps

Run `/implement` to begin AI-led implementation.
