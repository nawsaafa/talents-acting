# Task Checklist

**Session ID**: `phase00-session04-authentication`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-14

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0004]` = Session reference (Phase 00, Session 04)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Registration | 5 | 5 | 0 |
| Integration | 4 | 4 | 0 |
| Testing | 3 | 3 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial configuration and dependencies.

- [x] T001 [S0004] Install auth dependencies (`npm install next-auth@beta bcrypt @types/bcrypt`)
- [x] T002 [S0004] Add environment variables to `.env.local` (NEXTAUTH_SECRET, NEXTAUTH_URL)
- [x] T003 [S0004] Create directory structure (`lib/auth/`, `app/(auth)/`, `components/auth/`)

---

## Foundation (5 tasks)

Core auth configuration and utilities.

- [x] T004 [S0004] Create NextAuth.js configuration (`lib/auth/auth.config.ts`)
- [x] T005 [S0004] Create NextAuth.js initialization and exports (`lib/auth/auth.ts`)
- [x] T006 [S0004] Create NextAuth.js API route handler (`app/api/auth/[...nextauth]/route.ts`)
- [x] T007 [S0004] Create RBAC utilities and helpers (`lib/auth/utils.ts`)
- [x] T008 [S0004] Create auth server actions (`lib/auth/actions.ts`)

---

## Registration (5 tasks)

Registration pages and forms.

- [x] T009 [S0004] Create auth pages layout (`app/(auth)/layout.tsx`)
- [x] T010 [S0004] Create registration type selection page (`app/(auth)/register/page.tsx`)
- [x] T011 [S0004] [P] Create talent registration form (`app/(auth)/register/talent/page.tsx`)
- [x] T012 [S0004] [P] Create professional registration form (`app/(auth)/register/professional/page.tsx`)
- [x] T013 [S0004] [P] Create company registration form (`app/(auth)/register/company/page.tsx`)

---

## Integration (4 tasks)

Login, middleware, and header integration.

- [x] T014 [S0004] Create login page (`app/(auth)/login/page.tsx`)
- [x] T015 [S0004] Create route protection middleware (`middleware.ts`)
- [x] T016 [S0004] Create AuthStatus component (`components/auth/AuthStatus.tsx`)
- [x] T017 [S0004] Update Header with auth status (`components/layout/Header.tsx`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T018 [S0004] Run ESLint and fix any errors (`npm run lint`)
- [x] T019 [S0004] Verify build passes (`npm run build`)
- [x] T020 [S0004] Manual testing of all auth flows (register, login, logout, protected routes)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All registration flows working (talent, professional, company)
- [x] Login/logout functioning correctly
- [x] Protected routes redirect unauthenticated users
- [x] Header displays auth status
- [x] Passwords hashed in database
- [x] ESLint passes
- [x] Build succeeds
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization
Tasks T011-T013 (registration forms) can be done together as they are independent pages using the same patterns.

### Task Timing
Target ~15-20 minutes per task. Foundation tasks (T004-T008) are more complex and may take longer.

### Dependencies
- T004-T006 must be done in order (config -> init -> route)
- T008 (actions) depends on T004-T005 (auth config)
- T009 must be done before T010-T014 (layout before pages)
- T014-T015 (login, middleware) depend on T004-T008 (auth foundation)
- T016-T017 (AuthStatus, Header) depend on T005 (auth exports)

### Key Implementation Notes
- Use `'use client'` only for form components
- Password hashing happens in server actions only
- Session includes user role for RBAC
- Registration creates User + Profile in transaction
- Professionals/companies get ValidationStatus.PENDING
- Auth config split: edge-compatible `auth.config.ts` (no bcrypt/prisma) and full `auth.ts` (with providers)

### NextAuth.js v5 Notes
- Use `auth()` for server components
- Use `useSession()` for client components
- Callbacks: `jwt` and `session` for role injection
- Credentials provider for email/password login
- Middleware uses edge-compatible config only

---

## Next Steps

Run `/validate` to verify session completion.
