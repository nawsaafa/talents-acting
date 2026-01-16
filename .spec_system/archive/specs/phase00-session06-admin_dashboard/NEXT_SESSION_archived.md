# Next Session Recommendation

**Generated**: 2026-01-15
**Current Phase**: Phase 00 - Foundation
**Progress**: 5/6 sessions complete (83%)

---

## Recommended Session

### Session 06: Admin Dashboard Foundation

**Session ID**: `phase00-session06-admin_dashboard`
**Estimated Tasks**: ~15
**Estimated Duration**: 2-3 hours

---

## Why This Session

This is the **final session** of Phase 00 (Foundation). Completing it will:

1. **Complete Phase 00**: Enable marking the Foundation phase as complete
2. **Enable Validation Workflow**: Admins will be able to approve/reject talent profiles
3. **Activate Talent Listing**: Approved profiles will appear on the public listing
4. **Unlock Phase 01**: Talent Management features depend on admin validation

---

## Session Scope

### In Scope (MVP)

- Admin dashboard layout (separate from public site)
- Dashboard overview with key metrics:
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

- Bulk operations (mass approve/reject)
- Analytics/reporting dashboard
- Content management
- Payment/subscription management

---

## Prerequisites

All prerequisites met:

- [x] Session 04 completed (admin role authentication)
- [x] Session 05 completed (talent profiles exist)

---

## Dependencies

### Builds On

- Session 04: Authentication with admin role
- Session 05: Talent profiles and validation status

### Enables

- Phase 01: Full talent management
- Phase 02: Professional/company registration fees
- Production deployment readiness

---

## Key Deliverables

1. Admin dashboard layout and navigation
2. Dashboard overview with key metrics
3. Validation queue pages (talents, professionals, companies)
4. Profile review and approval workflow
5. User listing and management pages
6. Admin API endpoints for validation actions

---

## Next Steps

Run `/sessionspec` to generate the detailed specification for this session.
