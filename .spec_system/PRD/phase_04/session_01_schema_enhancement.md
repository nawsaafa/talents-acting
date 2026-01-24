# Session 01: Schema Enhancement

**Phase**: 04 - Data Migration & Polish
**Session ID**: `phase04-session01-schema_enhancement`
**Estimated Tasks**: ~18
**Estimated Duration**: 2-3 hours

---

## Objective

Enhance the database schema with fields required for full legacy data compatibility, ensuring all WordPress talent profile data can be properly migrated.

---

## Background

The PRD.md Legacy Database Migration section identifies several schema enhancements needed:

**High Priority**:

- `birthPlace` - Place of birth (was required in legacy)

**Medium Priority**:

- `AvailabilityType` enum with 9 options
- `availabilityTypes` multi-select field
- `imdbUrl` for IMDB profile links

**Low Priority (UI/Filtering)**:

- Moroccan region options for location filtering

---

## Key Deliverables

### 1. Schema Updates

- Add `birthPlace` String field to TalentProfile
- Create `AvailabilityType` enum
- Add `availabilityTypes` array field
- Add `imdbUrl` String field

### 2. Migration Script

- Prisma migration for all schema changes
- Backwards compatible (nullable fields)

### 3. Type Updates

- Update TalentProfile types
- Update form schemas (Zod)
- Update API handlers

### 4. UI Integration

- Add birthPlace to profile forms
- Add availabilityTypes multi-select
- Add IMDB URL input with validation

### 5. Filtering Support

- Update filter panel for new fields
- Add availability type filter
- Update Prisma queries

---

## Technical Approach

### Prisma Schema Changes

```prisma
enum AvailabilityType {
  ALWAYS
  SHORT_TERM_1_2_DAYS
  MEDIUM_TERM_1_2_WEEKS
  LONG_TERM_1_4_MONTHS
  WEEKENDS_AND_HOLIDAYS
  HOLIDAYS_ONLY
  WEEKENDS_ONLY
  EVENINGS
  DAYS
}

model TalentProfile {
  // ... existing fields
  birthPlace        String?
  availabilityTypes AvailabilityType[]
  imdbUrl           String?
}
```

### Form Updates

- ProfileWizard Step 1 (Basic): Add birthPlace
- ProfileWizard Step 5 (Professional): Add availabilityTypes, imdbUrl
- InlineEdit support for new fields

### Filter Updates

- Add availability filter to Professional section
- Multi-select for availability types

---

## Success Criteria

### Functional

- [ ] All new fields added to database
- [ ] Migration runs successfully
- [ ] Profile forms include new fields
- [ ] Filters work with new fields
- [ ] Existing data unaffected

### Testing

- [ ] Unit tests for new field validation
- [ ] Integration tests for form submission
- [ ] Filter tests with new fields

### Quality Gates

- [ ] TypeScript compiles without errors
- [ ] All existing tests pass
- [ ] Prisma validates schema

---

## Out of Scope

- Actual data migration (Session 03)
- Seed data population (Session 02)
- Multi-language support (Session 04)
- UI polish (Session 05)

---

## Dependencies

### Requires

- Phase 03 complete (current database state)

### Enables

- Session 02: Seed Data Population
- Session 03: Legacy Data Migration
