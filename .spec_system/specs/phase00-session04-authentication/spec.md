# Session Specification

**Session ID**: `phase00-session04-authentication`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2026-01-14

---

## 1. Session Overview

This session implements the authentication system for the Talents Acting platform. Authentication is the critical path for the entire application - without it, users cannot register, log in, or access role-appropriate content. The platform supports four distinct user types (talent, professional, company, admin), each with specific registration requirements and access permissions.

The authentication system enables the tiered access control model that separates public talent information (visible to all) from premium data (contact details, detailed attributes) accessible only to validated professionals and companies. This separation is fundamental to the platform's business model where film professionals pay for access to the full talent database.

We use NextAuth.js v5 (Auth.js) for authentication, which provides a robust framework for credential-based login, session management, and middleware protection. Combined with bcrypt for password hashing and Prisma for database operations, this creates a secure, maintainable authentication layer. Registration flows will use the UI components built in Session 03, and user data persists to the schema defined in Session 02.

---

## 2. Objectives

1. Implement secure user registration for all user types (talent, professional, company) with appropriate validation
2. Build login/logout authentication flow with session management
3. Create middleware and utilities for route protection and role-based access control
4. Establish auth state management accessible throughout the application

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session02-database_schema` - User model, Role enum, ValidationStatus enum
- [x] `phase00-session03-core_ui_framework` - Form components (Input, Select, Button, Card, Modal)

### Required Tools/Knowledge
- NextAuth.js v5 (Auth.js) configuration and usage
- bcrypt password hashing
- Next.js middleware for route protection
- React Context/Server Components auth patterns

### Environment Requirements
- PostgreSQL database running (Supabase)
- Environment variables configured (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)

---

## 4. Scope

### In Scope (MVP)
- User registration forms for talent, professional, and company roles
- Login page with email/password authentication
- Logout functionality
- Password hashing with bcrypt
- Session-based authentication (NextAuth.js)
- Role-based access control (RBAC) utilities
- Protected route middleware
- Auth context for client components
- "Pending validation" status display for professionals/companies
- Basic form validation

### Out of Scope (Deferred)
- Password reset flow (email) - *Requires email service setup, defer to later session*
- Social login (OAuth) - *Future enhancement*
- Two-factor authentication - *Future enhancement*
- Email verification - *Requires email service*
- Payment verification for access - *Phase 02*
- Talent profile creation during registration - *Session 05*

---

## 5. Technical Approach

### Architecture
```
lib/
  auth/
    auth.ts          # NextAuth.js configuration
    auth.config.ts   # Auth options (providers, callbacks)
    actions.ts       # Server actions for auth operations
app/
  api/
    auth/
      [...nextauth]/
        route.ts     # NextAuth.js route handler
  (auth)/
    login/
      page.tsx       # Login page
    register/
      page.tsx       # Registration type selection
      talent/
        page.tsx     # Talent registration form
      professional/
        page.tsx     # Professional registration form
      company/
        page.tsx     # Company registration form
middleware.ts        # Route protection middleware
```

### Design Patterns
- **Server Actions**: Form submissions via server actions for security
- **Auth.js Callbacks**: Custom session/JWT callbacks for role injection
- **Protected Routes**: Middleware-based route protection with role checking
- **Composition**: Reuse UI components from Session 03

### Technology Stack
- **Auth Framework**: NextAuth.js v5 (Auth.js)
- **Password Hashing**: bcrypt
- **Database**: Prisma with PostgreSQL
- **Forms**: Server actions with form validation
- **UI**: Components from Session 03 (Input, Button, Card)

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `lib/auth/auth.ts` | NextAuth.js initialization and export | ~30 |
| `lib/auth/auth.config.ts` | Auth providers and callbacks | ~80 |
| `lib/auth/actions.ts` | Server actions for register/login | ~120 |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth.js API route | ~10 |
| `app/(auth)/login/page.tsx` | Login page | ~80 |
| `app/(auth)/register/page.tsx` | Registration type selection | ~60 |
| `app/(auth)/register/talent/page.tsx` | Talent registration form | ~150 |
| `app/(auth)/register/professional/page.tsx` | Professional registration form | ~100 |
| `app/(auth)/register/company/page.tsx` | Company registration form | ~100 |
| `app/(auth)/layout.tsx` | Auth pages layout (centered) | ~25 |
| `middleware.ts` | Route protection middleware | ~40 |
| `lib/auth/utils.ts` | RBAC utilities and helpers | ~50 |
| `components/auth/AuthStatus.tsx` | User status display component | ~40 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `components/layout/Header.tsx` | Add auth status / login button | ~20 |
| `package.json` | Add next-auth, bcrypt dependencies | ~5 |
| `.env.local` | Add NEXTAUTH_SECRET, NEXTAUTH_URL | ~3 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Users can register as talent with basic info (email, password, name)
- [ ] Users can register as professional with reason for access
- [ ] Users can register as company with company details
- [ ] Login works with email/password and creates valid session
- [ ] Logout clears session and redirects to home
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Role-based routes restrict access (e.g., admin-only routes)
- [ ] Passwords are securely hashed with bcrypt
- [ ] Professional/company registration shows "pending validation" status
- [ ] Header displays auth status (logged in user or login button)

### Testing Requirements
- [ ] Manual testing of all registration flows
- [ ] Manual testing of login/logout
- [ ] Manual testing of protected route redirects
- [ ] Verify password hashing in database

### Quality Gates
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes
- [ ] Build completes successfully
- [ ] No sensitive data in client-side code

---

## 8. Implementation Notes

### Key Considerations
- Use `'use client'` only for interactive form components
- Keep password hashing server-side only (never expose in client)
- Session data should include user role for RBAC checks
- Registration creates User + appropriate profile (based on role)
- Professionals/companies start with PENDING validation status

### Potential Challenges
- **App Router + Auth.js**: Ensure proper setup for Next.js 14+ with auth
- **Session Access**: Server components need different auth access pattern than client
- **Form Validation**: Implement comprehensive validation before database writes
- **Profile Creation**: Transaction needed to create User + Profile atomically

### Relevant Considerations
- **[Security]** Secure login system critical for protecting premium talent data - use bcrypt with appropriate cost factor, secure session cookies
- **[Architecture]** Tiered access control: public vs premium separation - Role enum defines access levels, middleware enforces
- **[Architecture]** Admin validation workflow for all user registrations - ValidationStatus.PENDING is default for professionals/companies

### ASCII Reminder
All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests
- Not required for this session (auth flows better tested via integration)

### Integration Tests
- Registration creates user with correct role
- Login returns valid session
- Protected routes redirect correctly

### Manual Testing
1. Register as talent - verify user created with TALENT role
2. Register as professional - verify PENDING status shown
3. Register as company - verify company profile created
4. Login with valid credentials - verify session created
5. Login with invalid credentials - verify error message
6. Access protected route while logged out - verify redirect to login
7. Access protected route while logged in - verify access granted
8. Logout - verify session cleared, redirect to home

### Edge Cases
- Duplicate email registration (should fail with error)
- Empty form submission (validation should catch)
- Very long inputs (should be truncated or rejected)
- SQL injection attempts (Prisma prevents, but validate)

---

## 10. Dependencies

### External Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| next-auth | ^5.0.0 | Authentication framework |
| bcrypt | ^5.1.1 | Password hashing |
| @types/bcrypt | ^5.0.2 | TypeScript types for bcrypt |

### Other Sessions
- **Depends on**: Session 02 (User model, enums), Session 03 (UI components)
- **Depended by**: Session 05 (Talent Profiles - requires auth), Session 06 (Admin Dashboard - requires admin role)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
