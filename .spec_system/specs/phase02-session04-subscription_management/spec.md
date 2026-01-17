# Session Specification

**Session ID**: `phase02-session04-subscription_management`
**Phase**: 02 - Registration & Payments
**Status**: Not Started
**Created**: 2026-01-17

---

## 1. Session Overview

This session extends the payment integration from Session 03 to handle ongoing subscription lifecycle management. While Session 03 established one-time payment collection via Stripe Checkout, this session implements the full subscription lifecycle: status tracking, renewal handling, Stripe Customer Portal integration, and billing history.

The platform charges annual fees to three user types: Talents (300 MAD), Professionals (1,500 MAD), and Companies (3,500 MAD). Users need visibility into their subscription status, the ability to manage their billing, and clear communication about renewals. This session also prepares the groundwork for Session 05 (Access Control) by ensuring subscription status is reliably tracked and queryable.

Key focus areas include webhook handling for subscription lifecycle events (renewals, failures, cancellations), integration with Stripe Customer Portal for self-service billing management, and a billing history page showing past payments and invoices.

---

## 2. Objectives

1. Implement Stripe recurring subscriptions replacing one-time payments
2. Handle subscription lifecycle events via webhooks (renewal, failure, cancellation)
3. Integrate Stripe Customer Portal for self-service billing management
4. Create billing history page with payment records and invoice links

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session04-authentication` - NextAuth with role-based access
- [x] `phase02-session01-professional_registration` - Professional model with subscription fields
- [x] `phase02-session02-company_registration` - Company model with subscription fields
- [x] `phase02-session03-payment_integration` - Stripe client, webhooks, Payment model

### Required Tools/Knowledge

- Stripe Subscriptions API
- Stripe Customer Portal
- Stripe webhook event types (invoice._, customer.subscription._)

### Environment Requirements

- STRIPE_SECRET_KEY configured
- STRIPE_PUBLISHABLE_KEY configured
- STRIPE_WEBHOOK_SECRET configured

---

## 4. Scope

### In Scope (MVP)

- Convert checkout flow to create Stripe Subscriptions (not one-time payments)
- Create Stripe Products and Prices for each user type
- Webhook handlers for subscription lifecycle events
- Stripe Customer Portal integration for billing self-service
- Billing history page in each dashboard type
- Subscription status display on dashboard
- Email notifications for subscription events (renewal, failed payment)

### Out of Scope (Deferred)

- Multiple pricing tiers per user type - _Reason: Single tier per role is sufficient for MVP_
- Refund workflow - _Reason: Manual refunds via Stripe dashboard acceptable initially_
- Proration for mid-cycle plan changes - _Reason: No plan changes in single-tier model_
- Grace period retry logic - _Reason: Stripe handles automatic retries_
- Trial periods - _Reason: Not in business requirements_

---

## 5. Technical Approach

### Architecture

The implementation transitions from Stripe Checkout Sessions (one-time payments) to Stripe Subscriptions. Each payment creates a Stripe Customer, associates a Price with that customer as a Subscription, and manages the subscription lifecycle through webhooks.

```
User -> Payment Page -> Create Stripe Customer (if new)
                     -> Create Subscription with Price
                     -> Redirect to Stripe Checkout (subscription mode)
                     -> Webhook receives subscription.created
                     -> Webhook receives invoice.paid
                     -> Update user subscription status

Stripe Customer Portal -> User manages billing
                       -> Webhook receives subscription.updated/cancelled
                       -> Update user subscription status
```

### Design Patterns

- **Server Actions**: For subscription operations (consistent with Session 03)
- **Webhook Handler Pattern**: Idempotent event processing with status checks
- **Customer Portal**: Offload billing UI complexity to Stripe

### Technology Stack

- Stripe SDK v20.2.0 (existing)
- Stripe Subscriptions API
- Stripe Customer Portal
- Stripe Billing Portal API

---

## 6. Deliverables

### Files to Create

| File                                           | Purpose                            | Est. Lines |
| ---------------------------------------------- | ---------------------------------- | ---------- |
| `lib/payment/subscription.ts`                  | Subscription management functions  | ~150       |
| `lib/payment/products.ts`                      | Stripe Product/Price configuration | ~80        |
| `lib/payment/portal.ts`                        | Customer Portal session creation   | ~40        |
| `app/dashboard/talent/billing/page.tsx`        | Talent billing history page        | ~150       |
| `app/dashboard/professional/billing/page.tsx`  | Professional billing history page  | ~150       |
| `app/dashboard/company/billing/page.tsx`       | Company billing history page       | ~150       |
| `lib/email/templates/subscription-renewed.tsx` | Renewal email template             | ~100       |
| `lib/email/templates/payment-failed.tsx`       | Failed payment email template      | ~100       |
| `__tests__/payment/subscription.test.ts`       | Subscription logic tests           | ~100       |

### Files to Modify

| File                                  | Changes                                    | Est. Lines |
| ------------------------------------- | ------------------------------------------ | ---------- |
| `lib/payment/actions.ts`              | Convert to subscription mode checkout      | ~60        |
| `lib/payment/webhooks.ts`             | Add subscription lifecycle handlers        | ~100       |
| `app/api/webhooks/stripe/route.ts`    | Handle new event types                     | ~30        |
| `lib/payment/queries.ts`              | Add subscription queries                   | ~50        |
| `app/dashboard/talent/page.tsx`       | Add subscription status card               | ~30        |
| `app/dashboard/professional/page.tsx` | Add subscription status card               | ~30        |
| `app/dashboard/company/page.tsx`      | Add subscription status card               | ~30        |
| `prisma/schema.prisma`                | Add stripeCustomerId, stripeSubscriptionId | ~15        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] New users can subscribe via Stripe Checkout in subscription mode
- [ ] Existing subscribers can access Customer Portal to manage billing
- [ ] Subscription status updates correctly on renewal webhooks
- [ ] Subscription status updates to PAST_DUE on failed payment webhooks
- [ ] Subscription status updates to CANCELLED on cancellation webhooks
- [ ] Billing history page displays all user payments with dates and amounts
- [ ] Invoice links work and open Stripe-hosted invoice pages

### Testing Requirements

- [ ] Unit tests for subscription helper functions
- [ ] Webhook handler tests with mock Stripe events
- [ ] Manual testing with Stripe test mode subscriptions

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] No ESLint warnings

---

## 8. Implementation Notes

### Key Considerations

- Stripe Customers must be created before subscriptions
- Store stripeCustomerId on User/Professional/Company for reuse
- Store stripeSubscriptionId for portal and status lookups
- Webhook events may arrive out of order - use status checks for idempotency
- Customer Portal requires billing_portal configuration in Stripe Dashboard

### Potential Challenges

- **Webhook ordering**: Events like `customer.subscription.created` and `invoice.paid` may arrive in any order. Handle by checking current state before updating.
- **Customer reuse**: If a user re-subscribes, reuse existing Stripe Customer ID.
- **Product/Price creation**: Prices must exist in Stripe before checkout. Either create programmatically or use Dashboard-created Price IDs.

### Relevant Considerations

- **Security**: Subscription status authoritative from Stripe - always sync from webhooks, don't rely solely on local state.
- **External Dependencies**: Payment integration (Session 03) provides the foundation we build on.

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- `createSubscription` function with valid/invalid inputs
- `getSubscriptionStatus` returning correct status enum
- Price lookup for each payment type
- Customer Portal session creation

### Integration Tests

- Webhook handler with mock `invoice.paid` event
- Webhook handler with mock `customer.subscription.deleted` event
- Webhook handler with mock `invoice.payment_failed` event

### Manual Testing

- Complete subscription flow in Stripe test mode
- Access Customer Portal and verify links work
- Trigger renewal via Stripe test clock
- View billing history after payment

### Edge Cases

- User with cancelled subscription re-subscribing
- Webhook retry for already-processed event
- User accessing billing page with no payments
- Stripe Customer Portal for user with expired subscription

---

## 10. Dependencies

### External Libraries

- stripe: ^20.2.0 (existing)

### Other Sessions

- **Depends on**: `phase02-session03-payment_integration`
- **Depended by**: `phase02-session05-access_control_implementation`

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
