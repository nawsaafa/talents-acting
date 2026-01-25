# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-24
**Project State**: Phase 04 - Data Migration & Polish
**Completed Sessions**: 22

---

## Recommended Next Session

**Session ID**: `phase04-session02-seed_data_population`
**Session Name**: Seed Data Population
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: ~15

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00-03: All foundation and feature work complete
- [x] Session 01: Schema Enhancement complete (birthPlace, availabilityTypes, imdbUrl fields added)
- [x] Database schema supports all required skill/language/accent fields

### Dependencies

- **Builds on**: Session 01 Schema Enhancement (enum types and field structures ready)
- **Enables**: Session 03 Legacy Data Migration (seed data needed before migrating actor profiles)

### Project Progression

Session 02 is the natural next step because:

1. The schema enhancements from Session 01 provide the structure for storing seed data
2. Seed data must be populated BEFORE legacy data migration to ensure proper foreign key references
3. The ~200+ predefined options (languages, skills, accents, regions) form the foundation for the filter system
4. Admin UI for managing options enables future data maintenance

---

## Session Overview

### Objective

Populate all predefined skill, language, accent, and region options from the legacy WordPress system to enable comprehensive talent filtering and legacy data migration.

### Key Deliverables

1. Seed 8 language options (Moroccan Darija, Arabic, Berber, French, English, Spanish, Italian, Portuguese)
2. Seed 29 athletic skills (martial arts, sports, fitness activities)
3. Seed 28 musical instruments (traditional and modern)
4. Seed 33 dance styles (Moroccan traditional + international)
5. Seed 25 performance skills (stunts, voiceover, hosting, etc.)
6. Seed ~70 accent options (Moroccan, English, French regional accents)
7. Seed 17 Moroccan region options for location filtering
8. Admin UI for viewing and managing seed data options

### Scope Summary

- **In Scope (MVP)**: All predefined options from legacy system, basic admin viewing/management
- **Out of Scope**: Option editing by talents (admin-only), custom option creation by users

---

## Technical Considerations

### Technologies/Patterns

- Prisma seed scripts (`prisma/seed.ts`)
- TypeScript constants for option definitions
- Server actions for admin CRUD operations
- Reusable option management components

### Potential Challenges

- Large number of options (~200+) requires organized seeding approach
- Accent options have regional groupings (Moroccan, English, French)
- Dance styles mix Moroccan traditional with international styles
- Need to maintain consistency with existing enum patterns

### Relevant Considerations

- Schema from Session 01 already supports array fields for multi-select options
- Existing filter system needs to integrate with seeded option tables
- Options should be seeded idempotently (safe to re-run)

---

## Alternative Sessions

If this session is blocked:

1. **Session 04: Internationalization** - Could start if seed data can wait, but migration would be delayed
2. **Session 05: Performance & Polish** - Independent of data, but typically done last

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
