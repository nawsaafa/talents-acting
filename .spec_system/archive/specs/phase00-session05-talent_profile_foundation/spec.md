# Session Specification

**Session ID**: `phase00-session05-talent_profile_foundation`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2026-01-14

---

## 1. Session Overview

This session builds the talent profile system - the core value proposition of the Talents Acting platform. Users registered as talents will be able to create and manage their profiles, while visitors and professionals can browse a public talent listing to discover performers.

The session implements CRUD operations for talent profiles, photo upload functionality, and the critical separation between public and premium information. Public visitors see basic information (photo, name, gender, age range), while authorized users (approved professionals/companies) can access premium details (contact info, full bio, date of birth).

This session delivers the first public-facing content and enables Session 06 (Admin Dashboard) which needs talent profiles to validate in its workflow.

---

## 2. Objectives

1. Enable talents to create and edit comprehensive profiles with all required fields
2. Implement photo upload with validation, storage, and optimized display
3. Build public talent listing page with card grid and basic filters
4. Create talent detail page with public/premium data separation
5. Ensure only authorized users can view premium profile information

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session02-database_schema` - TalentProfile model with 40+ fields, indexes
- [x] `phase00-session03-core_ui_framework` - UI components (Button, Input, Card, Modal)
- [x] `phase00-session04-authentication` - Auth, RBAC, role-based access control

### Required Tools/Knowledge
- Prisma ORM for database operations
- Next.js Server Actions for form handling
- File upload handling in Next.js

### Environment Requirements
- PostgreSQL database with schema migrated
- Node.js environment with dependencies installed
- Local file storage directory (public/uploads)

---

## 4. Scope

### In Scope (MVP)
- Talent profile creation form (grouped by category)
- Photo upload with preview, validation (type, size)
- Profile edit functionality (own profile only)
- Talent listing page with card grid
- Basic filters: gender, age range, name search
- Talent detail page with public section
- Premium section with blur/lock for unauthorized users
- Server actions for profile CRUD
- API data separation (public vs premium fields)

### Out of Scope (Deferred)
- Video upload (showreel, presentation) - *Reason: Requires video hosting solution*
- Advanced 40+ category filters - *Reason: Phase 01 feature*
- Search/discovery features - *Reason: Phase 01 feature*
- Profile image cropping/editing - *Reason: Polish, not MVP*
- Multiple photos/gallery - *Reason: MVP uses single headshot*

---

## 5. Technical Approach

### Architecture
```
app/
  talents/
    page.tsx              # Public listing (Server Component)
    [id]/
      page.tsx            # Detail page (Server Component)
  dashboard/
    profile/
      page.tsx            # Talent profile edit (auth required)
      create/
        page.tsx          # Profile creation (talent role only)
lib/
  talents/
    actions.ts            # Server actions (create, update, delete)
    queries.ts            # Data fetching (public vs premium)
    validation.ts         # Zod schemas for form validation
components/
  talents/
    TalentCard.tsx        # Card for listing grid
    TalentFilters.tsx     # Filter controls
    ProfileForm.tsx       # Profile creation/edit form
    PhotoUpload.tsx       # Photo upload component
    PremiumSection.tsx    # Locked content display
```

### Design Patterns
- **Server Components**: Data fetching for listing and detail pages
- **Server Actions**: Form handling for profile CRUD
- **Zod Validation**: Type-safe form validation
- **Feature-based structure**: Files grouped by `/talents/` domain

### Technology Stack
- Next.js 16 App Router (Server Components, Server Actions)
- Prisma 5 ORM for database queries
- Zod for validation schemas
- Next.js Image for optimized photo display
- Local file storage (public/uploads/talents/)

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `lib/talents/actions.ts` | Server actions for CRUD | ~150 |
| `lib/talents/queries.ts` | Data fetching with field separation | ~100 |
| `lib/talents/validation.ts` | Zod schemas for forms | ~80 |
| `app/talents/page.tsx` | Public talent listing | ~120 |
| `app/talents/[id]/page.tsx` | Talent detail page | ~150 |
| `app/dashboard/profile/page.tsx` | Profile management hub | ~80 |
| `app/dashboard/profile/edit/page.tsx` | Profile edit page | ~100 |
| `components/talents/TalentCard.tsx` | Listing card component | ~60 |
| `components/talents/TalentFilters.tsx` | Filter controls | ~100 |
| `components/talents/ProfileForm.tsx` | Profile form component | ~250 |
| `components/talents/PhotoUpload.tsx` | Photo upload with preview | ~120 |
| `components/talents/PremiumSection.tsx` | Locked content display | ~50 |
| `components/talents/index.ts` | Barrel exports | ~10 |
| `app/api/upload/route.ts` | Photo upload API endpoint | ~60 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `components/layout/Header.tsx` | Add link to /talents | ~5 |
| `app/page.tsx` | Add featured talents or CTA | ~20 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Talents can create profiles with basic info (name, gender, age range)
- [ ] Talents can upload a profile photo (jpg, png, max 5MB)
- [ ] Photo displays correctly with Next.js Image optimization
- [ ] Talents can edit their own profiles
- [ ] Talent listing shows card grid with public info only
- [ ] Filters work: gender, age range, name search
- [ ] Detail page shows full public section for all users
- [ ] Premium section (contact, DOB) blurred for unauthorized users
- [ ] Premium section visible to approved professionals/companies
- [ ] Unauthorized users see "Register to access" CTA

### Testing Requirements
- [ ] Manual testing of profile creation flow
- [ ] Manual testing of photo upload (success and error cases)
- [ ] Manual testing of listing filters
- [ ] Manual testing of premium data visibility per role

### Quality Gates
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes
- [ ] Build completes successfully
- [ ] No sensitive data exposed in public API responses

---

## 8. Implementation Notes

### Key Considerations
- **Field Organization**: Group profile form by category (Basic Info, Physical, Skills, Media) for better UX
- **Photo Storage**: Store in `public/uploads/talents/[userId]/` with unique filenames
- **Premium Fields**: `dateOfBirth`, `contactEmail`, `contactPhone`, `bio` (full), `dailyRate`
- **Public Fields**: `firstName`, `photo`, `gender`, `ageRangeMin`, `ageRangeMax`, `location`, `isAvailable`

### Potential Challenges
- **Photo Upload**: Handle file validation, storage, and serve via Next.js - use API route
- **Form Complexity**: 40+ fields need good UX - use collapsible sections or tabs
- **Filter Performance**: Ensure Prisma queries use existing indexes
- **Role Check**: Use `canAccessPremium()` utility from auth session

### Relevant Considerations
- [P00] **Tiered access control**: Implement at query level - `getPublicTalent()` vs `getFullTalent()`
- [P00] **Image upload security**: Validate MIME type, file extension, and size server-side
- [P00] **Video hosting**: Architecture should allow adding `showreel` and `presentationVideo` fields later

### ASCII Reminder
All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests
- Zod validation schemas (valid and invalid inputs)
- Field separation logic (public vs premium)

### Integration Tests
- Profile creation with photo upload
- Filter queries return correct results

### Manual Testing
- Create profile as talent user
- Upload photo and verify display
- View listing as visitor (no premium data)
- View listing as approved professional (premium data visible)
- Test all filter combinations
- Edit profile and verify changes persist

### Edge Cases
- Photo upload with invalid file type (should reject)
- Photo upload exceeding size limit (should reject)
- Profile without photo (should display placeholder)
- Empty search results (should show friendly message)
- Unapproved talent profile (should not appear in listing)

---

## 10. Dependencies

### External Libraries
- `zod`: ^3.x (validation schemas)
- `@prisma/client`: ^5.22 (database)
- `next`: 16.1.1 (framework)

### Other Sessions
- **Depends on**: Session 02 (schema), Session 03 (UI), Session 04 (auth)
- **Depended by**: Session 06 (Admin Dashboard needs profiles to validate)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
