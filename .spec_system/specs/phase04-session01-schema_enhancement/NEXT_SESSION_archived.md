# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-24
**Project State**: Phase 04 - Data Migration & Polish (NEW)
**Completed Sessions**: 21

---

## Recommended Next Session

**Session ID**: `phase04-session01-schema_enhancement`
**Session Name**: Schema Enhancement
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: ~18

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation complete
- [x] Phase 01: Talent Management complete
- [x] Phase 02: Registration & Payments complete
- [x] Phase 03: Communication & Engagement complete
- [x] Database schema with TalentProfile model
- [x] Profile forms and filtering system

### Dependencies

- **Builds on**: Existing TalentProfile schema from Phase 00
- **Enables**: Session 02 (Seed Data) and Session 03 (Data Migration)

### Project Progression

This is the first session of Phase 04, the final phase before production launch. Schema enhancement must come first because:

1. **Foundation for migration**: New fields (birthPlace, availabilityTypes, imdbUrl) are required to store legacy data
2. **No data dependency**: Can be implemented without waiting for seed data or migration
3. **Unblocks downstream sessions**: Sessions 02 and 03 depend on these schema changes

The PRD explicitly identifies these schema enhancements as "High Priority" and "Medium Priority" requirements for legacy compatibility.

---

## Session Overview

### Objective

Enhance the database schema with fields required for full legacy WordPress data compatibility.

### Key Deliverables

1. Add `birthPlace` field to TalentProfile (legacy required field)
2. Create `AvailabilityType` enum with 9 availability options
3. Add `availabilityTypes` multi-select field
4. Add `imdbUrl` field for IMDB profile links
5. Update profile forms with new fields
6. Extend filtering system to support new fields

### Scope Summary

- **In Scope (MVP)**: Schema changes, migrations, form updates, basic filtering
- **Out of Scope**: Actual data migration, seed data, i18n, performance optimization

---

## Technical Considerations

### Technologies/Patterns

- Prisma schema and migrations
- Zod validation schemas
- React Hook Form integration
- Existing FilterPanel patterns

### Potential Challenges

- Ensuring backwards compatibility with existing profiles
- Multi-select enum arrays in Prisma
- IMDB URL validation pattern

### Relevant Considerations

- [PRD] **Legacy Database Migration**: Schema must support all legacy WordPress fields
- [PRD] **Availability types**: 9 predefined options from legacy system

---

## Alternative Sessions

If this session is blocked:

1. **Session 02: Seed Data Population** - Could be done in parallel if schema changes are minimal
2. **Session 04: Internationalization** - Independent of schema changes, could start early

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
