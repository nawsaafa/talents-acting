# PRD Phase 00: Foundation

**Status**: In Progress
**Sessions**: 6
**Estimated Duration**: 3-5 days

**Progress**: 2/6 sessions (33%)

---

## Overview

Establish the core infrastructure, database design, authentication system, and basic UI framework for the Talents Acting platform. This phase creates the foundation upon which all talent profiles, user management, and access control features will be built.

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Project Setup & Tech Stack | Complete | 20 | 2026-01-14 |
| 02 | Database Schema Design | Complete | 20 | 2026-01-14 |
| 03 | Core UI Framework | Not Started | ~15 | - |
| 04 | Authentication System | Not Started | ~20 | - |
| 05 | Talent Profile Foundation | Not Started | ~18 | - |
| 06 | Admin Dashboard Foundation | Not Started | ~15 | - |

---

## Completed Sessions

- **Session 01**: Project Setup & Tech Stack (2026-01-14)
  - Next.js 16 with TypeScript and App Router
  - Prisma 5 ORM with PostgreSQL
  - ESLint + Prettier code quality tooling
  - Health check API endpoint

- **Session 02**: Database Schema Design (2026-01-14)
  - Complete Prisma schema with 4 models, 8 enums
  - TalentProfile with 40+ fields for all talent attributes
  - ProfessionalProfile and CompanyProfile models
  - 15 database indexes for filter queries
  - Seed data with 7 users across all roles

---

## Upcoming Sessions

- Session 03: Core UI Framework

---

## Objectives

1. Establish project infrastructure with modern, maintainable tech stack
2. Design comprehensive database schema supporting all user types and talent profiles
3. Implement secure authentication with role-based access control
4. Create responsive UI foundation aligned with reference sites
5. Build talent profile CRUD with public/premium data separation
6. Set up admin dashboard for validation workflows

---

## Prerequisites

- None (initial phase)
- Access to actinginstitute.ma hosting environment (for deployment planning)

---

## Technical Considerations

### Architecture
- Tiered access control from day one (public vs premium separation)
- Admin validation workflow baked into data models
- Multi-language support structure (French primary, Arabic, English)

### Technologies
- Frontend: React/Next.js or Vue.js (responsive, component-based)
- Backend: Node.js/Express or PHP Laravel
- Database: PostgreSQL or MySQL
- File Storage: Cloud storage for images/videos (Cloudinary, S3, or similar)

### Risks
- **Video hosting complexity**: Showreels and presentation videos need reliable hosting - consider Cloudinary, Vimeo API, or dedicated video CDN
- **Extensive filter fields**: 40+ filter categories require careful schema design to maintain query performance
- **Payment integration**: Deferred to later phase, but schema should accommodate subscription/payment status

### Relevant Considerations
- [P00] **Tiered access control**: Must be implemented at data model level, not just UI
- [P00] **Video hosting**: Decision needed early - affects storage architecture
- [P00] **Multi-language**: Structure for i18n should be established in foundation

---

## Success Criteria

Phase complete when:
- [ ] All 6 sessions completed and validated
- [x] Development environment fully functional
- [x] Database schema supports all talent profile fields from specs
- [ ] Authentication works for all user types
- [ ] Basic talent profiles can be created and viewed
- [ ] Admin can access dashboard and see pending validations
- [ ] Responsive layout works on mobile and desktop

---

## Dependencies

### Depends On
- None (initial phase)

### Enables
- Phase 01: Talent Management (full CRUD, filtering, search)
- Phase 02: Registration & Payments (professional/company signup, fees)
- Phase 03: Advanced Features (video integration, advanced search)
