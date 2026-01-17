# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-17
**Project State**: Phase 02 - Registration & Payments
**Completed Sessions**: 14

---

## Recommended Next Session

**Session ID**: `phase02-session04-subscription_management`
**Session Name**: Subscription Management
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 20

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation (database, auth, admin)
- [x] Phase 01: Talent Management (profiles, search, gallery)
- [x] Phase 02 Session 01: Professional Registration
- [x] Phase 02 Session 02: Company Registration
- [x] Phase 02 Session 03: Payment Integration (Stripe checkout, webhooks)

### Dependencies

- **Builds on**: Payment Integration (Session 03) - uses existing Stripe integration
- **Enables**: Access Control Implementation (Session 05) - subscription status drives access

### Project Progression

Payment integration established the foundation for collecting one-time payments. Session 04 extends this to handle ongoing subscriptions: tracking status, managing renewals, handling plan changes, and providing billing history. This is critical before Session 05 can enforce access control based on subscription status.

---

## Session Overview

### Objective

Handle ongoing subscriptions and renewals for all paid user types (Talents, Professionals, Companies)

### Key Deliverables

1. Subscription status tracking and display
2. Renewal reminders and auto-renewal logic
3. Plan upgrades/downgrades with proration
4. Cancellation workflow with grace period
5. Billing history page with invoice links

### Scope Summary

- **In Scope (MVP)**: Status tracking, renewals, cancellation, billing history
- **Out of Scope**: Multiple pricing tiers, family/team plans, refund workflows

---

## Technical Considerations

### Technologies/Patterns

- Stripe Subscriptions API (building on existing Stripe integration)
- Stripe Customer Portal for self-service billing
- Webhook handling for subscription lifecycle events
- Server actions for subscription management
- Database tracking of subscription status and periods

### Potential Challenges

- Proration calculations for mid-cycle changes
- Grace period handling for failed payments
- Webhook event ordering and idempotency
- Timezone handling for renewal dates

### Relevant Considerations

- **External Dependencies**: Payment integration completed in Session 03
- **Security**: Subscription status must be authoritative from Stripe, not just local DB

---

## Alternative Sessions

If this session is blocked:

1. **Session 05: Access Control** - Could implement basic access control without subscription management, but would lack proper renewal/expiration handling
2. **Phase 03 Sessions** - Require Phase 02 completion first

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
