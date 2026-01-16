# Session 06: Admin Dashboard Foundation

**Session ID**: `phase00-session06-admin_dashboard`
**Status**: Not Started
**Estimated Tasks**: ~15
**Estimated Duration**: 2-3 hours

---

## Objective

Create the admin dashboard foundation with user management, profile validation workflow, and the ability to review and approve/reject pending registrations.

---

## Scope

### In Scope (MVP)

- Admin dashboard layout (separate from public site)
- Dashboard overview:
  - Pending talent validations count
  - Pending professional/company registrations count
  - Total active talents count
- Validation queue:
  - List of pending talent profiles
  - List of pending professional registrations
  - List of pending company registrations
- Profile review:
  - View full talent profile details
  - Approve/reject with reason
- User management basics:
  - List all users by type
  - View user details
  - Change user status (active/inactive)
- Admin-only route protection

### Out of Scope

- Bulk operations (mass approve/reject) - future
- Analytics/reporting dashboard - future
- Content management (site text) - future
- Payment/subscription management - Phase 02

---

## Prerequisites

- [ ] Session 04 completed (admin role authentication)
- [ ] Session 05 completed (talent profiles exist)

---

## Deliverables

1. Admin dashboard layout and navigation
2. Dashboard overview with key metrics
3. Validation queue pages (talents, professionals, companies)
4. Profile review and approval workflow
5. User listing and management pages
6. Admin API endpoints for validation actions

---

## Success Criteria

- [ ] Only admin users can access dashboard
- [ ] Pending validations display correctly
- [ ] Admin can approve a talent profile (status changes to active)
- [ ] Admin can reject with reason (talent notified)
- [ ] User list shows all registered users by type
- [ ] Admin can deactivate a user account
- [ ] Approved profiles appear on public talent listing
