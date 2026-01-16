# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-14
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 1

---

## Recommended Next Session

**Session ID**: `phase00-session02-database_schema`
**Session Name**: Database Schema Design
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~18

---

## Why This Session Next?

### Prerequisites Met

- [x] Session 01 completed (database connection working)
- [x] ORM chosen (Prisma 5 with PostgreSQL)
- [x] DATABASE_URL configured in .env.local

### Dependencies

- **Builds on**: Session 01 (Project Setup) - Prisma ORM installed and configured
- **Enables**: Session 03 (Core UI), Session 04 (Auth), Session 05 (Talent Profiles)

### Project Progression

Database schema is the foundation for all data-driven features. Without tables for users, talents, and access control, no authentication, profiles, or admin features can be built. This is the natural second step after project setup.

---

## Session Overview

### Objective

Design and implement a comprehensive database schema that supports all talent profile fields, user types, access control, and admin validation workflows.

### Key Deliverables

1. Complete Prisma schema with all models
2. Database migrations executed successfully
3. Seed data for testing (sample talents, users)
4. Model relationships (User -> Talent, User -> Professional, etc.)
5. Database indexes for common queries

### Scope Summary

- **In Scope (MVP)**: Users, Talents, Professionals, Companies, Roles, Validation Status, Access Control
- **Out of Scope**: Payment tables, Messaging, Analytics (deferred to later phases)

---

## Technical Considerations

### Technologies/Patterns

- Prisma 5 ORM with PostgreSQL
- UUID primary keys for security
- Enum types for fixed values (gender, physique, etc.)
- JSON fields for flexible array data (skills, languages)
- Soft delete pattern for user data protection

### Potential Challenges

- **40+ filter fields**: Talent profiles have extensive attributes - need careful schema design
- **Multi-value fields**: Skills, languages, accents stored as arrays or JSON
- **Public vs Premium separation**: Schema must support tiered access control at data level

### Relevant Considerations

- [P00] **Tiered access control**: Must be implemented at data model level with `isPublic` flags
- [P00] **Admin validation workflow**: Every profile needs `validationStatus` tracking
- [P00] **Multi-language**: Consider i18n-friendly field naming

---

## Alternative Sessions

If this session is blocked:

1. **Session 03 (Core UI)** - Can start layout work, but limited without data models
2. **Session 04 (Authentication)** - Requires User model from this session

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
