# Session Specification

**Session ID**: `phase00-session02-database_schema`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2026-01-14

---

## 1. Session Overview

This session designs and implements the comprehensive database schema for the Talents Acting platform. The schema must support all talent profile fields from the PRD (40+ attributes), multiple user types (visitor, talent, professional, company, admin), tiered access control (public vs premium data), and admin validation workflows.

The database design is critical infrastructure. Every subsequent feature - authentication, profile management, search/filtering, admin dashboard - depends on well-designed data models. Poor schema design here would create technical debt that compounds throughout development.

We use Prisma 5 ORM with PostgreSQL (Supabase). The schema will leverage PostgreSQL features like enums for fixed values, arrays for multi-select fields (skills, languages), and proper indexing for the extensive filter system. All models follow the project's naming conventions: descriptive names, boolean fields as questions (`isPublic`, `hasShowreel`).

---

## 2. Objectives

1. Design complete Prisma schema with all models for users, talents, professionals, and companies
2. Implement tiered access control at the data model level (public vs premium fields)
3. Create admin validation workflow tracking for all profile types
4. Execute migrations successfully and verify with seed data

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session01-project_setup` - Prisma ORM installed, DATABASE_URL configured

### Required Tools/Knowledge

- Prisma 5 CLI and schema syntax
- PostgreSQL data types (UUID, enums, arrays, JSON)
- Entity-relationship modeling

### Environment Requirements

- PostgreSQL database accessible (Supabase configured)
- `npx prisma` commands working

---

## 4. Scope

### In Scope (MVP)

- User model (base for all user types with role enum)
- TalentProfile model with all 40+ fields from PRD:
  - Basic info (firstName, lastName, gender, ageRangeMin/Max, photo)
  - Physical attributes (height, physique, ethnicAppearance, hairColor, eyeColor, hairLength)
  - Unique traits (beardType, hasTattoos, hasScars)
  - Skills arrays (languages, accents, athleticSkills, musicalInstruments, performanceSkills, danceStyles)
  - Media (presentationVideo, showreel)
  - Availability and rates
- ProfessionalProfile model (name, profession, company, reason for access)
- CompanyProfile model (company details, contact info)
- ValidationStatus enum and tracking on all profiles
- Public/premium field separation (isPublic flags or separate models)
- Database indexes for common filter queries
- Seed data for testing

### Out of Scope (Deferred)

- Payment/subscription tables - _Phase 02_
- Messaging/contact history - _Later phase_
- Analytics/tracking tables - _Later phase_
- Audit logs - _Later phase_

---

## 5. Technical Approach

### Architecture

Single PostgreSQL database with related tables. User is the central entity; profiles are one-to-one relationships based on user role. Premium data access controlled by user role, not separate tables.

```
User (base) -----> TalentProfile (one-to-one, if role=TALENT)
     |
     +-----------> ProfessionalProfile (one-to-one, if role=PROFESSIONAL)
     |
     +-----------> CompanyProfile (one-to-one, if role=COMPANY)
```

### Design Patterns

- **Single Table Inheritance**: User model with role enum, separate profile tables
- **Soft Delete**: `deletedAt` timestamp for data protection
- **Audit Fields**: `createdAt`, `updatedAt` on all models
- **UUID Primary Keys**: Security through obscurity for IDs

### Technology Stack

- **ORM**: Prisma 5.22.0
- **Database**: PostgreSQL 15+ (Supabase)
- **ID Strategy**: UUID with `@default(uuid())`
- **Enums**: Prisma native enums for fixed values

---

## 6. Deliverables

### Files to Create

| File                   | Purpose                  | Est. Lines |
| ---------------------- | ------------------------ | ---------- |
| `prisma/schema.prisma` | Complete database schema | ~300       |
| `prisma/seed.ts`       | Seed data script         | ~150       |

### Files to Modify

| File            | Changes                 | Est. Lines |
| --------------- | ----------------------- | ---------- |
| `package.json`  | Add seed script         | ~5         |
| `tsconfig.json` | Enable ts-node for seed | ~5         |

---

## 7. Success Criteria

### Functional Requirements

- [ ] All talent profile fields from PRD have corresponding columns
- [ ] User roles properly defined (VISITOR, TALENT, PROFESSIONAL, COMPANY, ADMIN)
- [ ] Profile relationships correctly established (User -> Profile)
- [ ] ValidationStatus enum tracks profile approval state
- [ ] Public vs premium data separation clear in schema

### Testing Requirements

- [ ] `npx prisma migrate dev` runs without errors
- [ ] `npx prisma db seed` creates valid test data
- [ ] `npx prisma studio` shows all tables and relationships
- [ ] Can query talents with filters via Prisma client

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Schema follows CONVENTIONS.md naming patterns
- [ ] No circular dependencies in schema

---

## 8. Implementation Notes

### Key Considerations

- Use PostgreSQL arrays for multi-select fields (languages, skills)
- Keep enums for fixed categorical values (gender, physique, role)
- Index fields used in filters (gender, ageRange, languages)
- Boolean naming: `isStudent`, `hasShowreel`, `isValidated`

### Potential Challenges

- **40+ fields**: TalentProfile is large - organize logically in schema
- **Array queries**: PostgreSQL array contains queries need specific syntax
- **Migration conflicts**: Supabase may have existing tables - handle gracefully

### Relevant Considerations

- [P00] **Tiered access control**: Implemented via User.role checks, not separate tables
- [P00] **Admin validation workflow**: Every profile has `validationStatus` field
- [P00] **Multi-language**: Field names in English, content can be any language

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Not applicable (schema definition, not logic)

### Integration Tests

- Prisma migrate creates all tables
- Seed data inserts without constraint violations
- Basic CRUD operations work via Prisma client

### Manual Testing

1. Run `npx prisma migrate dev --name init`
2. Run `npx prisma db seed`
3. Open `npx prisma studio` and verify data
4. Query talents with filters in studio

### Edge Cases

- User without profile (VISITOR role)
- Talent with minimal fields (only required)
- Talent with all fields populated
- Invalid enum values rejected

---

## 10. Dependencies

### External Libraries

| Package        | Version | Purpose         |
| -------------- | ------- | --------------- |
| prisma         | ^5.22.0 | ORM CLI         |
| @prisma/client | ^5.22.0 | Database client |
| ts-node        | ^10.9.0 | Run seed script |

### Other Sessions

- **Depends on**: Session 01 (Project Setup)
- **Depended by**: Session 03 (Core UI), Session 04 (Auth), Session 05 (Profiles), Session 06 (Admin)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
