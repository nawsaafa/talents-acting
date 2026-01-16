# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-14
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 4/6

---

## Recommended Next Session

**Session ID**: `phase00-session05-talent_profile_foundation`
**Session Name**: Talent Profile Foundation
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~18

---

## Why This Session Next?

### Prerequisites Met

- [x] Session 02 completed (talent schema exists - TalentProfile model with 40+ fields)
- [x] Session 03 completed (UI components available - Button, Input, Card, Modal, etc.)
- [x] Session 04 completed (auth and RBAC working - role-based access control)

### Dependencies

- **Builds on**: Session 04 (Authentication) - uses RBAC to control premium data access
- **Enables**: Session 06 (Admin Dashboard) - needs talent profiles to validate

### Project Progression

This is the natural next step because:

1. Authentication is complete, enabling user-specific features
2. Database schema already defines TalentProfile with all required fields
3. UI components are ready for building profile forms
4. Core value proposition is talent visibility - this delivers the first public-facing content

---

## Session Overview

### Objective

Build the talent profile system with CRUD operations, photo upload, and proper separation of public vs premium information display.

### Key Deliverables

1. Talent profile creation/edit form
2. Photo upload component with preview
3. Talent listing page (grid/cards with public info)
4. Talent detail page (public + premium sections)
5. API endpoints for talent CRUD
6. Basic filters (gender, age range, name search)

### Scope Summary

- **In Scope (MVP)**: Profile CRUD, photo upload, listing page, detail page, public/premium data separation, basic filters
- **Out of Scope**: Video upload (showreel), advanced 40+ category filters, search/discovery features

---

## Technical Considerations

### Technologies/Patterns

- Server Actions for form handling (consistent with auth session)
- Next.js Image component for optimized photo display
- File upload with local storage (or Cloudinary if configured)
- Prisma transactions for profile creation
- Server Components for data fetching
- Client Components for interactive forms

### Potential Challenges

- **Photo upload**: Need to handle file validation, storage, and serving
- **Premium data blurring**: Visual treatment for locked content
- **Form complexity**: TalentProfile has 40+ fields, need good UX
- **Filter performance**: Ensure indexes are used for filter queries

### Relevant Considerations

- [P00] **Tiered access control**: Must be implemented at data model level - public vs premium field separation in API responses
- [P00] **Image/video upload security**: Validate file types, sizes, and sanitize uploads
- [P00] **Video hosting**: Out of scope for this session, but architecture should accommodate future addition

---

## Alternative Sessions

If this session is blocked:

1. **Session 06: Admin Dashboard** - Depends on Session 05, not recommended as alternative
2. **Phase 01 sessions** - Phase 00 foundation must complete first

No valid alternatives - Session 05 must be completed to proceed.

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
