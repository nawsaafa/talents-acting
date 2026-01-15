# Session 05: Talent Profile Foundation

**Session ID**: `phase00-session05-talent_profile_foundation`
**Status**: Not Started
**Estimated Tasks**: ~18
**Estimated Duration**: 3-4 hours

---

## Objective

Build the talent profile system with CRUD operations, photo upload, and proper separation of public vs premium information display.

---

## Scope

### In Scope (MVP)
- Talent profile creation form (multi-step or single page)
- Photo upload and storage
- Profile data validation
- Public talent listing page:
  - Grid/card display of talents
  - Shows: photo, first name, gender, age-playing range
  - Basic filters (gender, age range, name search)
- Talent detail page:
  - Public section (visible to all)
  - Premium section (blurred/locked for non-authorized users)
- Talent profile edit (own profile only)
- Data separation:
  - Public fields exposed to API without auth
  - Premium fields require authorized role

### Out of Scope
- Video upload (showreel, presentation) - later phase
- Advanced filtering (40+ categories) - Phase 01
- Talent search/discovery features - Phase 01

---

## Prerequisites

- [ ] Session 02 completed (talent schema exists)
- [ ] Session 03 completed (UI components available)
- [ ] Session 04 completed (auth and RBAC working)

---

## Deliverables

1. Talent registration/profile creation form
2. Photo upload component with preview
3. Talent listing page with basic grid
4. Talent detail page with public/premium sections
5. Profile edit functionality
6. API endpoints for talent CRUD

---

## Success Criteria

- [ ] Talents can create profiles with all required fields
- [ ] Photos upload successfully and display correctly
- [ ] Listing page shows talent cards with public info only
- [ ] Detail page shows premium data only to authorized users
- [ ] Unauthorized users see "Register to view" messaging
- [ ] Talents can edit their own profiles
- [ ] Basic filters (gender, age, name) work on listing page
