# Session Specification

**Session ID**: `phase02-session03-payment_integration`
**Phase**: 02 - Registration & Payments
**Status**: Not Started
**Created**: 2026-01-17

---

## 1. Session Overview

This session integrates Stripe payment processing into the Talents Acting platform, enabling the collection of membership fees from Talents and access fees from Professionals and Companies. Payment processing is the critical missing piece that transforms the platform from a registration-only system into a revenue-generating business.

The implementation uses Stripe Checkout (hosted) for PCI compliance, ensuring we never handle raw card data. Webhook handling provides real-time payment status updates, while payment records enable billing history and invoice generation. The existing `subscriptionStatus` fields in ProfessionalProfile and CompanyProfile will be updated upon successful payment.

This session focuses on the initial payment flow. Subscription renewals, plan changes, and complex billing scenarios are deferred to Session 04 (Subscription Management).

---

## 2. Objectives

1. Integrate Stripe SDK and configure secure payment processing
2. Implement checkout flows for all paying user types (Talent, Professional, Company)
3. Handle payment webhooks for real-time status updates
4. Store payment records and generate invoice data
5. Send payment confirmation emails upon successful payment

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session04-authentication` - User authentication system
- [x] `phase02-session01-professional_registration` - Professional user type with subscriptionStatus field
- [x] `phase02-session02-company_registration` - Company user type with subscriptionStatus field

### Required Tools/Knowledge

- Stripe account with API keys (test mode)
- Understanding of Stripe Checkout Session API
- Understanding of Stripe Webhooks

### Environment Requirements

- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (client-side)
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `NEXT_PUBLIC_APP_URL` - Base URL for success/cancel redirects

---

## 4. Scope

### In Scope (MVP)

- Stripe SDK installation and configuration
- Stripe Checkout Session creation for one-time payments
- Payment page with pricing display and checkout trigger
- Webhook endpoint for payment events (checkout.session.completed)
- Payment model for storing payment history
- Update subscriptionStatus on successful payment
- Payment confirmation email template
- Basic invoice data storage (amount, date, Stripe invoice ID)
- Success and cancel pages for checkout flow

### Out of Scope (Deferred)

- Subscription renewals and auto-renewal - _Session 04_
- Plan upgrades/downgrades - _Session 04_
- Refund workflow - _Future consideration_
- Multiple pricing tiers - _Future consideration_
- Proration calculations - _Session 04_
- PDF invoice generation - _Future consideration_

---

## 5. Technical Approach

### Architecture

```
User Dashboard
    |
    v
Payment Page (pricing display)
    |
    v
Server Action (createCheckoutSession)
    |
    v
Stripe Checkout (hosted page)
    |
    +---> Success URL ---> Success Page
    |
    +---> Cancel URL ---> Cancel Page

Stripe Webhook
    |
    v
API Route (/api/webhooks/stripe)
    |
    v
Update Database (Payment record + subscriptionStatus)
    |
    v
Send Confirmation Email
```

### Design Patterns

- **Server Actions**: Payment initiation via Next.js server actions
- **Webhook Handler**: API route for Stripe webhook events
- **Feature-based organization**: `lib/payment/` for all payment logic
- **Email templates**: Consistent with existing Resend/React Email pattern

### Technology Stack

- Stripe SDK (`stripe` package)
- Next.js API Routes (webhook handler)
- Server Actions (checkout session creation)
- Prisma (Payment model)
- Resend + React Email (confirmation emails)

---

## 6. Deliverables

### Files to Create

| File                                           | Purpose                         | Est. Lines |
| ---------------------------------------------- | ------------------------------- | ---------- |
| `lib/payment/stripe.ts`                        | Stripe client initialization    | ~30        |
| `lib/payment/config.ts`                        | Pricing configuration constants | ~50        |
| `lib/payment/actions.ts`                       | Server actions for checkout     | ~200       |
| `lib/payment/queries.ts`                       | Payment history queries         | ~100       |
| `lib/payment/webhooks.ts`                      | Webhook event handlers          | ~150       |
| `app/api/webhooks/stripe/route.ts`             | Webhook API endpoint            | ~80        |
| `app/dashboard/professional/payment/page.tsx`  | Professional payment page       | ~150       |
| `app/dashboard/company/payment/page.tsx`       | Company payment page            | ~150       |
| `app/dashboard/talent/payment/page.tsx`        | Talent payment page             | ~150       |
| `app/payment/success/page.tsx`                 | Payment success page            | ~80        |
| `app/payment/cancel/page.tsx`                  | Payment cancelled page          | ~60        |
| `lib/email/templates/payment-confirmation.tsx` | Payment confirmation email      | ~120       |
| `__tests__/payment/config.test.ts`             | Unit tests for pricing config   | ~80        |

### Files to Modify

| File                          | Changes                          | Est. Lines |
| ----------------------------- | -------------------------------- | ---------- |
| `prisma/schema.prisma`        | Add Payment model                | ~30        |
| `lib/professional/queries.ts` | Add subscription update helper   | ~20        |
| `lib/company/queries.ts`      | Add subscription update helper   | ~20        |
| `.env.example`                | Add Stripe environment variables | ~5         |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Stripe SDK configured and initialized correctly
- [ ] Professional users can initiate payment from dashboard
- [ ] Company users can initiate payment from dashboard
- [ ] Talent users can initiate membership payment from dashboard
- [ ] Checkout redirects to Stripe hosted page
- [ ] Successful payment redirects to success page
- [ ] Cancelled payment redirects to cancel page
- [ ] Webhook updates user subscription status to ACTIVE
- [ ] Webhook creates Payment record in database
- [ ] Payment confirmation email sent after successful payment
- [ ] Payment history visible in database

### Testing Requirements

- [ ] Unit tests for pricing configuration
- [ ] Manual testing of complete checkout flow (test mode)
- [ ] Manual testing of webhook handling
- [ ] Manual testing of email delivery

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Stripe webhook signature verified

---

## 8. Implementation Notes

### Key Considerations

- Use Stripe Checkout (hosted) to avoid PCI compliance burden
- Always verify webhook signatures before processing
- Handle webhook idempotency (same event may be sent multiple times)
- Use Stripe test mode for development
- Store Stripe customer ID for future subscription management

### Potential Challenges

- **Webhook reliability**: Implement idempotency checks using Stripe event ID
- **Currency support**: Verify MAD (Moroccan Dirham) is supported, fall back to USD if needed
- **Session expiration**: Handle expired checkout sessions gracefully
- **Error handling**: Provide clear error messages for payment failures

### Relevant Considerations

- **External Dependencies**: This addresses the listed "Payment integration required" concern
- **Security**: Never store card data, rely on Stripe's hosted checkout
- **Architecture**: Integrate with existing subscriptionStatus fields (NONE, ACTIVE, EXPIRED, CANCELLED)

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Pricing configuration validation
- Price calculation functions
- Stripe client initialization (mocked)

### Integration Tests

- Webhook signature verification (manual with Stripe CLI)
- Database updates after webhook (manual)

### Manual Testing

1. Initiate checkout as Professional user
2. Complete payment with Stripe test card
3. Verify redirect to success page
4. Verify webhook received and processed
5. Verify subscriptionStatus updated to ACTIVE
6. Verify Payment record created
7. Verify confirmation email received
8. Test cancelled payment flow
9. Repeat for Company and Talent users

### Edge Cases

- Webhook received before redirect completes
- Same webhook event received multiple times
- Expired checkout session
- Invalid webhook signature
- User already has active subscription

---

## 10. Dependencies

### External Libraries

- `stripe`: ^14.x (Stripe Node.js SDK)

### Other Sessions

- **Depends on**: phase02-session01 (Professional), phase02-session02 (Company)
- **Depended by**: phase02-session04 (Subscription Management), phase02-session05 (Access Control)

---

## Pricing Configuration (Reference)

Based on PRD Phase 02:

| User Type    | Fee Type          | Amount (MAD) |
| ------------ | ----------------- | ------------ |
| Talent       | Annual Membership | 300          |
| Professional | Annual Access     | 1500         |
| Company      | Annual Access     | 3500         |

_Note: Final pricing to be confirmed. These are suggested values._

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
