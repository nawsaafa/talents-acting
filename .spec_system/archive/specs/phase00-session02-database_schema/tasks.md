# Task Checklist

**Session ID**: `phase00-session02-database_schema`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-14

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0002]` = Session reference (Phase 00, Session 02)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 2 | 2 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 4 | 4 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0002] Verify prerequisites met (Prisma installed, DATABASE_URL configured)
- [x] T002 [S0002] Install ts-node for seed script execution (`package.json`)

---

## Foundation (5 tasks)

Core enums and base model structure.

- [x] T003 [S0002] [P] Define Role enum (VISITOR, TALENT, PROFESSIONAL, COMPANY, ADMIN) (`prisma/schema.prisma`)
- [x] T004 [S0002] [P] Define ValidationStatus enum (PENDING, APPROVED, REJECTED, SUSPENDED) (`prisma/schema.prisma`)
- [x] T005 [S0002] [P] Define Gender enum (MALE, FEMALE, NON_BINARY, OTHER) (`prisma/schema.prisma`)
- [x] T006 [S0002] [P] Define Physique enum (SLIM, AVERAGE, ATHLETIC, MUSCULAR, CURVY, PLUS_SIZE) (`prisma/schema.prisma`)
- [x] T007 [S0002] Create User base model with auth fields and role (`prisma/schema.prisma`)

---

## Implementation (9 tasks)

Main schema implementation with all models and fields.

- [x] T008 [S0002] Create TalentProfile model - basic info fields (firstName, lastName, gender, ageRange, photo) (`prisma/schema.prisma`)
- [x] T009 [S0002] Add TalentProfile physical attributes (height, physique, ethnicAppearance, hairColor, eyeColor, hairLength) (`prisma/schema.prisma`)
- [x] T010 [S0002] Add TalentProfile unique traits (beardType, hasTattoos, hasScars, tattooDescription, scarDescription) (`prisma/schema.prisma`)
- [x] T011 [S0002] Add TalentProfile skills arrays (languages, accents, athleticSkills, musicalInstruments, performanceSkills, danceStyles) (`prisma/schema.prisma`)
- [x] T012 [S0002] Add TalentProfile media and availability fields (presentationVideo, showreel, isAvailable, dailyRate) (`prisma/schema.prisma`)
- [x] T013 [S0002] Add TalentProfile validation and visibility fields (validationStatus, isPublic, bio, location) (`prisma/schema.prisma`)
- [x] T014 [S0002] [P] Create ProfessionalProfile model (name, profession, company, accessReason) (`prisma/schema.prisma`)
- [x] T015 [S0002] [P] Create CompanyProfile model (companyName, industry, contactEmail, contactPhone) (`prisma/schema.prisma`)
- [x] T016 [S0002] Add database indexes for common filter queries (gender, ageRange, languages, validationStatus) (`prisma/schema.prisma`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0002] Configure seed script in package.json and tsconfig.json (`package.json`, `tsconfig.json`)
- [x] T018 [S0002] Create seed.ts with sample users and talent profiles (`prisma/seed.ts`)
- [x] T019 [S0002] Run migrations and verify database tables (`npx prisma migrate dev`)
- [x] T020 [S0002] Run seed and validate with Prisma Studio (`npx prisma db seed`, `npx prisma studio`)

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] All migrations successful
- [ ] Seed data loads without errors
- [ ] Prisma Studio shows all tables and relationships
- [ ] All files ASCII-encoded
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization
Tasks T003-T006 (enums) can be done together.
Tasks T014-T015 (Professional/Company profiles) can be done together.

### Task Timing
Target ~20-25 minutes per task. Schema tasks may be faster; testing tasks may take longer.

### Dependencies
- T007 (User model) depends on T003 (Role enum)
- T008-T016 depend on T007 (User model must exist first)
- T017-T020 depend on complete schema

### TalentProfile Field Organization
The 40+ fields are split across tasks T008-T013:
- T008: Basic info (5 fields)
- T009: Physical attributes (6 fields)
- T010: Unique traits (5 fields)
- T011: Skills arrays (6 fields)
- T012: Media/availability (4 fields)
- T013: Validation/visibility (4+ fields)

---

## Next Steps

Run `/implement` to begin AI-led implementation.
