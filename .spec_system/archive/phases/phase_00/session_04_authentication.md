# Session 04: Authentication System

**Session ID**: `phase00-session04-authentication`
**Status**: Not Started
**Estimated Tasks**: ~20
**Estimated Duration**: 3-4 hours

---

## Objective

Implement a secure authentication system supporting all user types (talents, professionals, companies, admin) with role-based access control for public vs premium content.

---

## Scope

### In Scope (MVP)
- User registration flows:
  - Talent registration (detailed form)
  - Professional registration (name, profession, email, phone, reason)
  - Company registration (similar to professional)
- Login/logout functionality
- Password hashing and security
- Session management (JWT or session-based)
- Role-based access control (RBAC):
  - Visitor: public data only
  - Talent: own profile management
  - Professional/Company: premium data access (after validation)
  - Admin: full access
- Protected routes/middleware
- "Pending validation" status handling
- Basic password reset flow

### Out of Scope
- Payment verification (Phase 02)
- Social login (OAuth) - future enhancement
- Two-factor authentication - future enhancement

---

## Prerequisites

- [ ] Session 02 completed (user tables exist)
- [ ] Session 03 completed (form components available)

---

## Deliverables

1. Registration forms for all user types
2. Login page and authentication flow
3. JWT/session middleware for protected routes
4. Role checking utilities/hooks
5. Auth context/state management
6. Password reset flow (email link)

---

## Success Criteria

- [ ] Users can register as talent, professional, or company
- [ ] Login works and creates valid session/token
- [ ] Protected routes redirect unauthenticated users
- [ ] Premium data endpoints return 403 for unauthorized users
- [ ] Admin can access admin-only routes
- [ ] Passwords are securely hashed (bcrypt or argon2)
- [ ] Registration shows "pending validation" message for professionals/companies
