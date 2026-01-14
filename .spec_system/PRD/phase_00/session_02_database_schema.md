# Session 02: Database Schema Design

**Session ID**: `phase00-session02-database_schema`
**Status**: Not Started
**Estimated Tasks**: ~18
**Estimated Duration**: 3-4 hours

---

## Objective

Design and implement a comprehensive database schema that supports all talent profile fields, user types, access control, and admin validation workflows.

---

## Scope

### In Scope (MVP)
- Users table (base for all user types)
- User roles/types (visitor, talent, professional, company, admin)
- Talents profile table with all fields from specs:
  - Basic info (name, gender, age range, photo)
  - Physical attributes (height, physique, ethnic appearance, hair, eyes)
  - Unique traits (beard type, tattoos, scars)
  - Skills (languages, accents, athletic, musical, performance, dance)
  - Availability and rates
- Professionals table
- Companies table
- Validation status tracking
- Access control flags (premium data visibility)
- Database migrations

### Out of Scope
- Payment/subscription tables (Phase 02)
- Messaging/contact history (later phase)
- Analytics/tracking tables (later phase)

---

## Prerequisites

- [ ] Session 01 completed (database connection working)
- [ ] ORM/query builder chosen (Prisma, Sequelize, Eloquent, etc.)

---

## Deliverables

1. Complete ERD (Entity Relationship Diagram)
2. All migration files
3. Seed data for testing (sample talents, users)
4. Model/Entity definitions with relationships
5. Database indexes for common queries

---

## Success Criteria

- [ ] All talent profile fields from specs have corresponding columns
- [ ] User type relationships properly defined
- [ ] Migrations run without errors
- [ ] Seed data creates valid test records
- [ ] Public vs premium fields clearly separated in schema
- [ ] Admin validation status trackable per profile
