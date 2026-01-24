# PRD Phase 04: Data Migration & Polish

**Status**: In Progress
**Sessions**: 5
**Estimated Duration**: 3-4 days

**Progress**: 1/5 sessions (20%)

---

## Overview

Complete the platform by migrating legacy WordPress data, seeding comprehensive skill/talent options, enhancing schema for full legacy compatibility, and adding final polish including internationalization and performance optimization. This phase transforms the platform from development-ready to production-ready.

---

## Progress Tracker

| Session | Name                  | Status   | Est. Tasks | Validated  |
| ------- | --------------------- | -------- | ---------- | ---------- |
| 01      | Schema Enhancement    | Complete | 18         | 2026-01-24 |
| 02      | Seed Data Population  | Pending  | ~15        | -          |
| 03      | Legacy Data Migration | Pending  | ~20        | -          |
| 04      | Internationalization  | Pending  | ~18        | -          |
| 05      | Performance & Polish  | Pending  | ~20        | -          |

---

## Completed Sessions

### Session 01: Schema Enhancement (Completed 2026-01-24)

Added legacy-compatible fields to TalentProfile: birthPlace, availabilityTypes (with 9-option enum), and imdbUrl. Updated ProfileWizard, FilterPanel, and filter logic. All 18 tasks completed, 379 tests passing.

---

## Upcoming Sessions

### Session 01: Schema Enhancement

Add missing fields identified in legacy database mapping.

### Session 02: Seed Data Population

Populate all skill, language, accent, and region options.

### Session 03: Legacy Data Migration

Migrate ~35 actor profiles from WordPress database.

### Session 04: Internationalization

Add multi-language support (French, Arabic, English).

### Session 05: Performance & Polish

Final optimization, SEO, and production hardening.

---

## Objectives

1. Enhance database schema with legacy-compatible fields (birthPlace, availabilityTypes, imdbUrl)
2. Seed comprehensive skill/language/accent options from legacy data
3. Migrate existing ~35 actor profiles from WordPress
4. Implement internationalization for French, Arabic, and English
5. Optimize performance and prepare for production deployment

---

## Prerequisites

- Phase 00: Foundation (Complete)
- Phase 01: Talent Management (Complete)
- Phase 02: Registration & Payments (Complete)
- Phase 03: Communication & Engagement (Complete)

---

## Session Details

### Session 01: Schema Enhancement

**Objective**: Add missing fields to support full legacy data migration

**Key Deliverables**:

- Add `birthPlace` field to TalentProfile
- Create `AvailabilityType` enum with 9 options
- Add `availabilityTypes` multi-select field
- Add `imdbUrl` field for IMDB profiles
- Add `moroccanRegion` enum for location filtering
- Database migration with backwards compatibility

**Technical Focus**:

- Prisma schema updates
- Migration scripts
- Type updates across codebase

### Session 02: Seed Data Population

**Objective**: Populate all predefined options from legacy system

**Key Deliverables**:

- Seed 8 language options
- Seed 29 athletic skills
- Seed 28 musical instruments
- Seed 33 dance styles
- Seed 25 performance skills
- Seed ~70 accent options
- Seed 17 Moroccan region options
- Admin UI for managing seed data

**Technical Focus**:

- Prisma seed scripts
- Option management tables
- Admin CRUD for options

### Session 03: Legacy Data Migration

**Objective**: Migrate WordPress actor profiles to new system

**Key Deliverables**:

- WordPress database export parser
- User account migration script
- TalentProfile data transformer
- Media file migration (photos from WordPress uploads)
- Data validation and integrity checks
- Migration dry-run and rollback capability

**Technical Focus**:

- SQL parsing and transformation
- Bulk data imports
- Media file handling
- Error handling and logging

### Session 04: Internationalization

**Objective**: Add multi-language support for key markets

**Key Deliverables**:

- next-intl or similar i18n setup
- French translations (primary market)
- Arabic translations (local market)
- English translations (international)
- Language switcher component
- RTL support for Arabic
- Locale-aware date/number formatting

**Technical Focus**:

- Next.js internationalization
- Translation file management
- RTL CSS handling
- Middleware for locale detection

### Session 05: Performance & Polish

**Objective**: Production-ready optimization and final polish

**Key Deliverables**:

- Image optimization with next/image
- Database query optimization and indexing
- SEO metadata and Open Graph tags
- Sitemap and robots.txt
- Error boundary improvements
- Loading states and skeleton screens
- Accessibility audit and fixes
- Final security review

**Technical Focus**:

- Lighthouse performance audit
- Core Web Vitals optimization
- SEO best practices
- WCAG compliance

---

## Technical Considerations

### Architecture

- Maintain backwards compatibility during schema changes
- Translation files should be modular and lazy-loaded
- Migration scripts must be idempotent

### Technologies

- Prisma migrations for schema changes
- next-intl for internationalization
- Sharp for image optimization (already integrated)

### Risks

- **Data integrity**: Legacy data may have inconsistencies
- **Migration downtime**: Need careful planning for live migration
- **Translation accuracy**: Professional review needed for Arabic

### Relevant Considerations from Previous Phases

- [P00] **Multi-language support**: Architecture concern - implement in Session 04
- [P00] **Video hosting**: External dependency - document current solution
- [P02] **Tiered access**: Must be maintained during migration

---

## Success Criteria

Phase complete when:

- [ ] All schema enhancements deployed
- [ ] All seed data populated (200+ options)
- [ ] ~35 legacy profiles migrated and validated
- [ ] French, Arabic, English translations complete
- [ ] Lighthouse performance score > 90
- [ ] All accessibility issues resolved
- [ ] Production deployment checklist complete

---

## Dependencies

### Depends On

- Phase 00-03: All foundation and feature work

### Enables

- Production launch
- Marketing and user acquisition
- Future phases (analytics, recommendations)
