# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-14
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 3

---

## Recommended Next Session

**Session ID**: `phase00-session04-authentication`
**Session Name**: Authentication System
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~20

---

## Why This Session Next?

### Prerequisites Met

- [x] Session 02 completed (user tables exist in database)
- [x] Session 03 completed (form components available - Input, Button, Card, Modal)

### Dependencies

- **Builds on**: Session 02 (Database Schema - User model), Session 03 (UI Framework - form components)
- **Enables**: Session 05 (Talent Profile Foundation - requires auth for RBAC)

### Project Progression

Authentication is the critical path for the application. Without auth:

- Users cannot register or log in
- No role-based access control exists
- Premium content cannot be protected
- Admin features cannot be secured

Session 05 (Talent Profiles) explicitly depends on authentication being complete for the public/premium data separation feature.

---

## Session Overview

### Objective

Implement a secure authentication system supporting all user types (talents, professionals, companies, admin) with role-based access control for public vs premium content.

### Key Deliverables

1. Registration forms for all user types (talent, professional, company)
2. Login page and authentication flow
3. JWT/session middleware for protected routes
4. Role checking utilities/hooks
5. Auth context/state management
6. Password reset flow

### Scope Summary

- **In Scope (MVP)**: User registration, login/logout, password hashing, session management, RBAC, protected routes, pending validation status
- **Out of Scope**: Payment verification, social login (OAuth), two-factor authentication

---

## Technical Considerations

### Technologies/Patterns

- NextAuth.js or custom JWT implementation
- bcrypt for password hashing
- React Context for auth state
- Next.js middleware for route protection
- Prisma for user queries

### Potential Challenges

- Session handling across server and client components (App Router)
- JWT vs session-based auth decision
- Secure cookie handling
- Password reset email integration (may need email service)

### Relevant Considerations

- **[Security]** Secure login system critical for protecting premium talent data
- **[Architecture]** Tiered access control: public vs premium information separation
- **[Architecture]** Admin validation workflow for all user registrations

---

## Alternative Sessions

If this session is blocked:

1. **Session 05 - Talent Profile Foundation** - Could implement public-only features first, but RBAC is a blocker
2. **Session 06 - Admin Dashboard** - Could start admin UI, but requires auth for access control

_Note: Authentication is on the critical path. No alternatives are recommended._

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
