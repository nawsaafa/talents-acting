# Next Session Recommendation

**Generated**: 2026-01-25
**Current Phase**: 04 (Data Migration & Polish)
**Phase Progress**: 2/5 sessions (40%)

---

## Recommended Session

### `phase04-session03-legacy_data_migration`

**Name**: Legacy Data Migration
**Priority**: High
**Estimated Tasks**: ~20

---

## Rationale

### Why This Session?

1. **Sequential Dependency**: Sessions 01 (Schema Enhancement) and 02 (Seed Data Population) are complete, providing the foundation for data migration
2. **Data Ready**: All 212 seed options are populated, and schema has legacy-compatible fields (birthPlace, availabilityTypes, imdbUrl)
3. **Critical Path**: Legacy data migration is essential before internationalization (Session 04) can be properly tested with real content

### What It Delivers

- WordPress database export parser
- User account migration script
- TalentProfile data transformer
- Media file migration (photos from WordPress uploads)
- Data validation and integrity checks
- Migration dry-run and rollback capability

---

## Session Overview

### Objectives

Migrate ~35 actor profiles from the legacy WordPress database to the new Next.js/Prisma system while maintaining data integrity and preserving all profile information.

### Technical Focus

- SQL parsing and transformation
- Bulk data imports
- Media file handling
- Error handling and logging
- Idempotent migration scripts

### Key Deliverables

| Deliverable         | Description                                    |
| ------------------- | ---------------------------------------------- |
| WordPress Parser    | Parse and extract data from WordPress export   |
| User Migration      | Migrate user accounts with hashed passwords    |
| Profile Transformer | Transform WordPress profile data to new schema |
| Media Migration     | Move profile photos from WordPress uploads     |
| Validation Suite    | Verify data integrity post-migration           |
| Rollback Script     | Ability to undo migration if needed            |

---

## Prerequisites

### Completed Dependencies

- [x] Phase 00-03: All foundation work complete
- [x] Session 01: Schema enhanced with legacy fields
- [x] Session 02: Seed data populated (212 options)

### Required for This Session

- [ ] WordPress database export file (SQL or JSON)
- [ ] Access to WordPress media uploads directory
- [ ] Mapping document for WordPress → new schema fields

---

## Risk Assessment

| Risk                 | Likelihood | Impact | Mitigation                            |
| -------------------- | ---------- | ------ | ------------------------------------- |
| Data inconsistencies | Medium     | High   | Validation checks, dry-run mode       |
| Missing media files  | Low        | Medium | Graceful handling, placeholder images |
| Password migration   | Low        | High   | Force password reset option           |
| Duplicate detection  | Medium     | Medium | Unique constraint handling            |

---

## Alternatives Considered

### Skip to Session 04 (Internationalization)

- **Rejected**: i18n is better tested with real migrated content
- Migration provides test data for translation verification

### Skip to Session 05 (Performance & Polish)

- **Rejected**: Depends on having real data to optimize
- Performance tuning needs representative dataset

---

## Next Steps

1. Run `/sessionspec` to create detailed specification
2. User provides WordPress export data
3. Run `/tasks` to generate task checklist
4. Run `/implement` to begin migration work

---

## Commands

```bash
# Create specification for this session
/sessionspec

# After spec is created, generate tasks
/tasks

# Begin implementation
/implement
```
