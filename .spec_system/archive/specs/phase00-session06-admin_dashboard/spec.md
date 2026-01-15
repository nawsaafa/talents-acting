# Session Specification

**Session ID**: `phase00-session06-admin_dashboard`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2026-01-15

---

## 1. Session Overview

This session implements the Admin Dashboard Foundation, the final piece of Phase 00. The admin dashboard provides platform administrators with the tools to manage the validation workflow for all user registrations (talents, professionals, companies) and basic user management capabilities.

The admin dashboard is critical for platform operations as no talent profile, professional, or company can become publicly visible without admin approval. This validation workflow ensures quality control and prevents spam or inappropriate content from appearing on the platform.

Upon completion, admins will have a dedicated dashboard with an overview of pending validations, queue management for each user type, and the ability to approve or reject registrations with reasons. This completes the Foundation phase and enables the platform to move into full talent management in Phase 01.

---

## 2. Objectives

1. Create a dedicated admin dashboard layout separate from the public site
2. Implement dashboard overview with key metrics (pending counts, totals)
3. Build validation queues for talents, professionals, and companies
4. Enable approve/reject workflow with reason tracking
5. Provide basic user listing and status management

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session04-authentication` - Admin role authentication and `requireAdmin()` utility
- [x] `phase00-session05-talent_profile_foundation` - Talent profiles with `ValidationStatus` field

### Required Tools/Knowledge
- Next.js App Router (Server Components, Server Actions)
- Prisma ORM queries with filtering
- Role-based access control patterns

### Environment Requirements
- PostgreSQL database with seed data (includes admin user)
- Admin user credentials: `admin@talentsacting.com` / `AdminPass123!`

---

## 4. Scope

### In Scope (MVP)
- Admin layout with sidebar navigation
- Dashboard overview page with:
  - Pending talent validations count
  - Pending professional registrations count
  - Pending company registrations count
  - Total active talents count
- Validation queues:
  - Talents queue with profile preview
  - Professionals queue with details
  - Companies queue with details
- Validation actions:
  - Approve profile (sets status to APPROVED)
  - Reject profile with reason (sets status to REJECTED)
- User management:
  - List all users by type/role
  - View user details
  - Toggle user active status

### Out of Scope (Deferred)
- Bulk operations (mass approve/reject) - *Reason: Complexity, rare use case*
- Analytics/reporting dashboard - *Reason: Phase 01 feature*
- Content management - *Reason: Not in current requirements*
- Email notifications on approval/rejection - *Reason: Phase 01 feature*
- Audit logging - *Reason: Phase 01 feature*

---

## 5. Technical Approach

### Architecture
The admin dashboard uses a dedicated route group `/app/admin/` with its own layout. Server Components fetch data directly, while Server Actions handle mutations (approve, reject, toggle status). The layout includes a sidebar for navigation between dashboard sections.

All admin routes are protected using the existing `requireAdmin()` utility at the page/action level. The middleware already handles role-based redirects.

### Design Patterns
- **Feature-based organization**: `/lib/admin/` for queries and actions
- **Server Components**: All pages are Server Components for direct data access
- **Server Actions**: Mutations use `"use server"` actions with proper validation
- **Shared layouts**: Admin layout wraps all admin pages

### Technology Stack
- Next.js 16 App Router
- Prisma 5 for database queries
- Zod for action input validation
- Existing UI primitives (Button, Card, Input, etc.)

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `lib/admin/queries.ts` | Admin data fetching (counts, lists) | ~150 |
| `lib/admin/actions.ts` | Server actions for validation/user management | ~180 |
| `lib/admin/validation.ts` | Zod schemas for admin actions | ~40 |
| `app/admin/layout.tsx` | Admin layout with sidebar | ~100 |
| `app/admin/page.tsx` | Dashboard overview with metrics | ~120 |
| `app/admin/talents/page.tsx` | Talent validation queue | ~150 |
| `app/admin/talents/[id]/page.tsx` | Talent review detail page | ~200 |
| `app/admin/professionals/page.tsx` | Professional validation queue | ~120 |
| `app/admin/companies/page.tsx` | Company validation queue | ~120 |
| `app/admin/users/page.tsx` | User listing and management | ~150 |
| `components/admin/AdminSidebar.tsx` | Sidebar navigation component | ~80 |
| `components/admin/StatCard.tsx` | Dashboard stat display card | ~40 |
| `components/admin/ValidationActions.tsx` | Approve/reject button group | ~80 |
| `components/admin/UserStatusToggle.tsx` | Active/inactive toggle | ~50 |
| `components/admin/index.ts` | Barrel exports | ~5 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `middleware.ts` | Add `/admin` to protected routes (if not already) | ~5 |
| `components/layout/Navigation.tsx` | Add admin dashboard link for admin users | ~10 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Only admin users can access `/admin/*` routes
- [ ] Non-admins redirected to home or login
- [ ] Dashboard shows accurate pending counts for all types
- [ ] Dashboard shows total active talents count
- [ ] Talent queue displays all pending talent profiles
- [ ] Professional queue displays all pending professional registrations
- [ ] Company queue displays all pending company registrations
- [ ] Admin can view full talent profile details from queue
- [ ] Admin can approve a profile (status changes to APPROVED, validatedAt/validatedBy set)
- [ ] Admin can reject with reason (status changes to REJECTED, rejectionReason set)
- [ ] Approved talent profiles appear on public `/talents` listing
- [ ] User list shows all registered users grouped by role
- [ ] Admin can toggle user active/inactive status
- [ ] Deactivated users cannot log in

### Testing Requirements
- [ ] Manual testing of admin access control
- [ ] Manual testing of validation workflow (approve flow)
- [ ] Manual testing of validation workflow (reject flow)
- [ ] Manual testing of user status toggle
- [ ] Verify approved profiles appear in public listing

### Quality Gates
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes with no errors
- [ ] Build completes successfully
- [ ] Code follows project conventions

---

## 8. Implementation Notes

### Key Considerations
- Use existing UI primitives (Button, Card, Input) for consistency
- Reuse `canAccessPremium` pattern for permission display
- Admin sidebar should highlight current section
- Validation actions should show loading states
- Rejection requires a reason (mandatory field)

### Potential Challenges
- **Optimistic updates**: Server actions may need revalidatePath for immediate UI updates
- **Large user lists**: Consider pagination for user management (defer to Phase 01 if complex)
- **Session refresh**: Deactivating a user should invalidate their session (note: may require Phase 01)

### Relevant Considerations
- [P00] **Admin validation workflow**: This session implements the core validation workflow mentioned in CONSIDERATIONS.md
- [P00] **Tiered access control**: Admin dashboard is the highest tier, protected by role check

### ASCII Reminder
All output files must use ASCII-only characters (0-127). No special characters, curly quotes, or non-ASCII symbols.

---

## 9. Testing Strategy

### Unit Tests
- None planned (manual testing for MVP)

### Integration Tests
- None planned (manual testing for MVP)

### Manual Testing
1. Login as admin (`admin@talentsacting.com` / `AdminPass123!`)
2. Verify redirect to admin dashboard or access via navigation
3. Check dashboard shows correct pending counts
4. Navigate to talent queue, verify pending talents displayed
5. Click talent to view details
6. Approve talent, verify status change and public visibility
7. Reject another talent with reason, verify status and reason saved
8. Navigate to user list, verify all users shown
9. Toggle user status, verify login behavior changes
10. Logout and login as non-admin, verify `/admin` access denied

### Edge Cases
- No pending validations (show empty state)
- Very long rejection reasons (truncate in display, full in detail)
- Admin trying to deactivate themselves (prevent or warn)

---

## 10. Dependencies

### External Libraries
- None new (uses existing stack)

### Other Sessions
- **Depends on**:
  - Session 04 (authentication with admin role)
  - Session 05 (talent profiles with validation status)
- **Depended by**:
  - Phase 01 sessions (full talent management)
  - Phase 02 sessions (professional/company fees)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
