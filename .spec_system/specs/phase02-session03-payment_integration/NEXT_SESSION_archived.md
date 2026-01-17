# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-17
**Project State**: Phase 02 - Registration & Payments
**Completed Sessions**: 13

---

## Recommended Next Session

**Session ID**: `phase02-session03-payment_integration`
**Session Name**: Payment Integration
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 22

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation complete (database, auth, admin)
- [x] Phase 01: Talent Management complete (profiles, gallery)
- [x] Professional Registration complete (user type with payment needs)
- [x] Company Registration complete (user type with payment needs)

### Dependencies

- **Builds on**: Professional and Company registration flows
- **Enables**: Subscription Management (Session 04), Access Control (Session 05)

### Project Progression

Payment Integration is the natural next step because:

1. Both user types that require payment (Professionals and Companies) are now fully implemented
2. The registration flows are complete but payment collection is not yet functional
3. Session 04 (Subscription Management) depends on having Stripe integration in place
4. Session 05 (Access Control) needs subscription status to enforce premium data access

This session transforms the platform from a registration-only system into a revenue-generating business.

---

## Session Overview

### Objective

Integrate Stripe payment processing for one-time and recurring membership/access fees.

### Key Deliverables

1. Stripe SDK integration and configuration
2. Checkout flow for Professionals and Companies
3. Talent membership fee collection
4. Payment confirmation emails
5. Invoice generation and storage
6. Webhook handling for payment events

### Scope Summary

- **In Scope (MVP)**: Stripe checkout, webhook handling, payment confirmation, invoice records
- **Out of Scope**: Subscription renewals (Session 04), complex pricing tiers, refunds workflow

---

## Technical Considerations

### Technologies/Patterns

- Stripe Checkout (hosted) for PCI compliance
- Stripe Webhooks for payment event handling
- Server Actions for payment initiation
- Database records for payment history

### Potential Challenges

- Webhook signature verification and idempotency
- Handling payment failures gracefully
- Morocco (MAD) currency support verification
- Connecting payments to user subscription status

### Relevant Considerations

- **External Dependencies**: Payment integration is a listed dependency - Stripe recommended
- **Security**: Never store raw card data, use Stripe's hosted checkout
- **Architecture**: Payment status needs to integrate with existing subscription status fields

---

## Alternative Sessions

If this session is blocked (e.g., Stripe account not ready):

1. **phase02-session05-access_control** - Could implement access control with mock subscription status
2. **Phase 03 planning** - Could start planning Messaging & Bookings phase

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
