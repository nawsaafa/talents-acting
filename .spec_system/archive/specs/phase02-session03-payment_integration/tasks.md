# Task Checklist

**Session ID**: `phase02-session03-payment_integration`
**Total Tasks**: 22
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-17

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0203]` = Session reference (Phase 02, Session 03)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 3      | 3      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 10     | 10     | 0         |
| Testing        | 4      | 4      | 0         |
| **Total**      | **22** | **22** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0203] Install Stripe SDK and verify installation (`package.json`)
- [x] T002 [S0203] Add Stripe environment variables to .env.example (`.env.example`)
- [x] T003 [S0203] Create lib/payment directory structure (`lib/payment/`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T004 [S0203] Add Payment model to Prisma schema with indexes (`prisma/schema.prisma`)
- [x] T005 [S0203] Create Stripe client initialization with error handling (`lib/payment/stripe.ts`)
- [x] T006 [S0203] Create pricing configuration with user type constants (`lib/payment/config.ts`)
- [x] T007 [S0203] [P] Add updateSubscriptionStatus helper to professional queries (`lib/professional/queries.ts`)
- [x] T008 [S0203] [P] Add updateSubscriptionStatus helper to company queries (`lib/company/queries.ts`)

---

## Implementation (10 tasks)

Main feature implementation.

- [x] T009 [S0203] Create server actions for checkout session creation (`lib/payment/actions.ts`)
- [x] T010 [S0203] Create payment history and lookup queries (`lib/payment/queries.ts`)
- [x] T011 [S0203] Create webhook event handlers with idempotency checks (`lib/payment/webhooks.ts`)
- [x] T012 [S0203] Create Stripe webhook API route with signature verification (`app/api/webhooks/stripe/route.ts`)
- [x] T013 [S0203] Create payment confirmation email template (`lib/email/templates/payment-confirmation.tsx`)
- [x] T014 [S0203] [P] Create Professional payment page with pricing display (`app/dashboard/professional/payment/page.tsx`)
- [x] T015 [S0203] [P] Create Company payment page with pricing display (`app/dashboard/company/payment/page.tsx`)
- [x] T016 [S0203] [P] Create Talent payment page with membership pricing (`app/dashboard/talent/payment/page.tsx`)
- [x] T017 [S0203] [P] Create payment success page with confirmation message (`app/payment/success/page.tsx`)
- [x] T018 [S0203] [P] Create payment cancel page with retry option (`app/payment/cancel/page.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T019 [S0203] Write unit tests for pricing configuration (`__tests__/payment/config.test.ts`)
- [x] T020 [S0203] Run full test suite and fix any TypeScript/ESLint issues
- [x] T021 [S0203] Manual testing: complete checkout flow for all user types (Stripe test mode)
- [x] T022 [S0203] Verify webhook handling: payment records created, subscription status updated

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

- **T007-T008**: Subscription update helpers are independent
- **T014-T018**: All payment/success/cancel pages can be created simultaneously

### Task Timing

Target ~10-15 minutes per task for simpler ones, ~20-25 minutes for complex ones (T009, T011, T012).

### Dependencies

- T004 must complete before T009-T012 (schema needed for queries/actions)
- T005-T006 must complete before T009 (Stripe client and config needed)
- T009-T012 must complete before T014-T018 (pages use actions)
- T013 must complete before T012 (email sent from webhook handler)

### Stripe Test Mode

All development and testing uses Stripe test mode:

- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

### Environment Variables Required

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Next Steps

Run `/validate` to verify session completion.
