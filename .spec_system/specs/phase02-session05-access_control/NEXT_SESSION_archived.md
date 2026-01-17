# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-17
**Project State**: Phase 02 - Registration & Payments
**Completed Sessions**: 15

---

## Recommended Next Session

**Session ID**: `phase02-session05-access_control`
**Session Name**: Access Control Implementation
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 18

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation complete (database, auth, admin)
- [x] Phase 01: Talent Management complete (profiles, gallery, filtering)
- [x] Session 01: Professional registration with validation workflow
- [x] Session 02: Company registration with validation workflow
- [x] Session 03: Stripe payment integration with webhooks
- [x] Session 04: Subscription management with billing portal

### Dependencies

- **Builds on**: Subscription management (status tracking, grace periods)
- **Enables**: Phase completion, business launch readiness

### Project Progression

This is the final session of Phase 02, completing the business logic for the platform. All payment and subscription infrastructure is in place. This session enforces the premium data access rules that justify the subscription fees - without it, paying customers gain no exclusive access.

---

## Session Overview

### Objective

Enforce premium data access based on subscription status at both API and UI levels.

### Key Deliverables

1. Middleware for subscription status checking
2. API-level protection for premium talent data (contact info, full profiles)
3. Graceful degradation UI for expired/unpaid subscriptions
4. Access logging for compliance and analytics
5. Trial period support (optional)

### Scope Summary

- **In Scope (MVP)**: Role + subscription access checks, premium data protection, expired subscription handling
- **Out of Scope**: Advanced trial features, proration for tier changes, detailed analytics dashboard

---

## Technical Considerations

### Technologies/Patterns

- Next.js middleware for route protection
- Server-side subscription status checks
- React conditional rendering for premium content
- Database-level access logging

### Potential Challenges

- Performance optimization for frequent access checks (caching strategy)
- Handling edge cases: grace period access, payment retries, expired trials
- Consistent behavior between server and client rendering

### Relevant Considerations

- **Tiered access control**: Public vs premium information separation (from CONSIDERATIONS.md)
- **Secure login system**: Critical for protecting premium talent data
- **Grace period handling**: Already implemented in Session 04 (`PAST_DUE` status grants access)

---

## Alternative Sessions

If this session is blocked:

1. **Schema enhancements from PRD** - Add birthPlace, availabilityTypes, imdbUrl fields
2. **Legacy data migration** - Import ~35 actor profiles from WordPress

---

## Phase Completion

After this session, Phase 02 will be 100% complete. Run `/carryforward` to update CONSIDERATIONS.md before starting Phase 03 (Messaging & Bookings).

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
