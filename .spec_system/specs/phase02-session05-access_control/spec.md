# Session Specification

**Session ID**: `phase02-session05-access_control`
**Phase**: 02 - Registration & Payments
**Status**: Not Started
**Created**: 2026-01-17

---

## 1. Session Overview

This session implements subscription-based access control to enforce premium data protection at both API and UI levels. The platform already has public/premium data separation defined in talent queries (`publicSelect` vs `premiumSelect`), role-based access checks in `lib/auth/utils.ts`, and subscription status tracking via Stripe webhooks. This session connects these systems to actually enforce access restrictions.

Currently, professionals and companies can register and subscribe, but there's no enforcement preventing unpaid users from accessing premium talent data (contact info, full profiles). This session adds the missing access layer that justifies subscription fees.

The implementation must balance security (blocking unauthorized access) with user experience (graceful degradation for expired subscriptions, clear upgrade prompts). Performance is critical since access checks happen on every data request.

---

## 2. Objectives

1. Implement subscription-aware access control utilities that combine role + subscription status
2. Protect premium talent data at the API/query level (not just UI hiding)
3. Create graceful degradation UX for expired/unpaid subscriptions
4. Add access logging for compliance and analytics

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session04-authentication` - Role-based auth system with `requireAuth`, `requireRole`
- [x] `phase02-session03-payment_integration` - Stripe integration with subscription tracking
- [x] `phase02-session04-subscription_management` - `hasActiveAccess()`, `SubscriptionStatus` enum

### Required Tools/Knowledge

- NextAuth.js session management
- Prisma query patterns
- React Server Components data fetching

### Environment Requirements

- Database with subscription status fields populated
- Optional: Stripe configured for full testing (graceful fallback if not)

---

## 4. Scope

### In Scope (MVP)

- Access control utilities combining role + subscription status
- Protected talent query functions (premium data only for valid subscribers)
- Upgrade prompt components for expired/unpaid users
- Access logging table and basic logging
- Unit tests for access control logic

### Out of Scope (Deferred)

- Advanced trial period features - _Reason: Basic subscription covers MVP_
- Detailed analytics dashboard - _Reason: Phase 04 scope_
- IP-based rate limiting - _Reason: Infrastructure concern, not access control_
- Per-talent access restrictions - _Reason: All talents visible to all subscribers_

---

## 5. Technical Approach

### Architecture

```
                                   +------------------+
                                   |  lib/access/     |
                                   |  - control.ts    | <- Central access logic
                                   |  - logging.ts    |
                                   +--------+---------+
                                            |
              +-----------------------------+-----------------------------+
              |                             |                             |
    +---------v---------+         +---------v---------+         +---------v---------+
    | lib/auth/utils.ts |         | lib/payment/      |         | lib/talents/      |
    | requireAuth()     |         | subscription.ts   |         | queries.ts        |
    | hasRole()         |         | hasActiveAccess() |         | getPremiumTalent()|
    +-------------------+         +-------------------+         +-------------------+
```

### Design Patterns

- **Guard Functions**: `requirePremiumAccess()` throws if not authorized
- **Selective Projection**: Return public vs premium fields based on access level
- **Audit Trail**: Log access attempts for compliance

### Technology Stack

- Next.js 16 Server Actions and API routes
- Prisma for access logging
- TypeScript with strict mode

---

## 6. Deliverables

### Files to Create

| File                                        | Purpose                          | Est. Lines |
| ------------------------------------------- | -------------------------------- | ---------- |
| `lib/access/control.ts`                     | Central access control utilities | ~120       |
| `lib/access/logging.ts`                     | Access logging functions         | ~80        |
| `lib/access/types.ts`                       | Access control types             | ~40        |
| `components/subscription/UpgradePrompt.tsx` | Upgrade prompt component         | ~80        |
| `components/subscription/AccessGate.tsx`    | Access gate wrapper component    | ~60        |
| `__tests__/access/control.test.ts`          | Unit tests for access control    | ~200       |

### Files to Modify

| File                                  | Changes                        | Est. Lines |
| ------------------------------------- | ------------------------------ | ---------- |
| `prisma/schema.prisma`                | Add AccessLog model            | ~20        |
| `lib/talents/queries.ts`              | Add subscription-aware queries | ~60        |
| `lib/auth/utils.ts`                   | Add `requirePremiumAccess()`   | ~30        |
| `app/talents/[id]/page.tsx`           | Use access-gated data fetching | ~20        |
| `app/dashboard/professional/page.tsx` | Add subscription status check  | ~15        |
| `app/dashboard/company/page.tsx`      | Add subscription status check  | ~15        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Unpaid professionals/companies cannot access premium talent data (contact info, full profiles)
- [ ] Users with ACTIVE, TRIAL, or PAST_DUE subscriptions can access premium data
- [ ] Expired/cancelled subscriptions see upgrade prompt instead of premium data
- [ ] Access attempts are logged with user, resource, and outcome
- [ ] Admins bypass subscription checks (full access)

### Testing Requirements

- [ ] Unit tests for `requirePremiumAccess()` covering all subscription states
- [ ] Unit tests for access logging
- [ ] Manual testing of upgrade prompt display

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows CONVENTIONS.md (descriptive names, one concept per file)
- [ ] TypeScript strict mode - no errors

---

## 8. Implementation Notes

### Key Considerations

- **Performance**: Access checks happen frequently; avoid N+1 queries by fetching subscription status with user session
- **Caching**: Consider caching subscription status in session to reduce DB hits
- **Graceful Fallback**: If Stripe is not configured, use database subscription status only

### Potential Challenges

- **Session Hydration**: Ensure subscription status is available in NextAuth session
- **Race Conditions**: Handle webhook delays where payment succeeded but DB not updated
- **Client/Server Consistency**: Use server components for data fetching to enforce access

### Relevant Considerations

- **Tiered access control**: Public vs premium separation already defined in `publicSelect`/`premiumSelect` - this session enforces it
- **User data protection compliance**: Access logging supports audit requirements
- **Grace period handling**: Already implemented - `PAST_DUE` status grants access via `hasActiveAccess()`

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- `requirePremiumAccess()` with each SubscriptionStatus (ACTIVE, TRIAL, PAST_DUE, CANCELLED, EXPIRED, NONE)
- `canAccessPremiumData()` combining role + subscription
- Access logging creates correct records
- Query functions return appropriate field sets

### Integration Tests

- End-to-end test: Professional with expired subscription sees upgrade prompt
- End-to-end test: Professional with active subscription sees premium data

### Manual Testing

- Create professional account, attempt to view talent contact info without payment
- Complete payment, verify premium data now accessible
- Expire subscription in test mode, verify graceful degradation

### Edge Cases

- Admin users bypass subscription checks
- Talent users viewing their own profile (always have full access to own data)
- Concurrent requests during subscription status change

---

## 10. Dependencies

### External Libraries

- `@prisma/client`: ^5.22.0 (existing)
- `next-auth`: ^5.0.0-beta.30 (existing)
- No new dependencies required

### Other Sessions

- **Depends on**: phase02-session04-subscription_management (subscription status tracking)
- **Depended by**: None (final session of phase)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
