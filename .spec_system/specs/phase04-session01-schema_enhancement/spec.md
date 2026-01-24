# Session Specification

**Session ID**: `phase04-session01-schema_enhancement`
**Phase**: 04 - Data Migration & Polish
**Status**: Not Started
**Created**: 2026-01-24

---

## 1. Session Overview

This session enhances the TalentProfile database schema to support full compatibility with the legacy WordPress system, enabling seamless migration of ~35 existing actor profiles. The changes add fields that were required or commonly used in the legacy system but are not yet present in our current schema.

The schema enhancements are foundational for Phase 04's data migration goals. By adding `birthPlace` (a required field in legacy), `availabilityTypes` (capturing detailed availability preferences), and `imdbUrl` (for professional credibility), we ensure no data loss during migration while also improving the platform's capability to capture rich talent information.

These changes maintain backwards compatibility - all new fields are nullable or have sensible defaults, ensuring existing profiles remain unaffected. The session also updates profile forms and filtering to leverage these new fields immediately.

---

## 2. Objectives

1. Add legacy-compatible fields (`birthPlace`, `availabilityTypes`, `imdbUrl`) to TalentProfile schema with successful Prisma migration
2. Create `AvailabilityType` enum with all 9 legacy availability options
3. Update profile forms (ProfileWizard, InlineEdit) to capture new fields
4. Extend FilterPanel to support filtering by availability types

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session02-database_schema` - Base TalentProfile model
- [x] `phase01-session01-advanced_filtering` - FilterPanel infrastructure
- [x] `phase01-session04-profile_enhancement` - ProfileWizard and InlineEdit

### Required Tools/Knowledge

- Prisma schema and migrations
- PostgreSQL array types
- Zod validation schemas
- React Hook Form

### Environment Requirements

- PostgreSQL database running
- Node.js 20+
- Prisma CLI available

---

## 4. Scope

### In Scope (MVP)

- Add `birthPlace` String field to TalentProfile
- Create `AvailabilityType` enum with 9 options
- Add `availabilityTypes` AvailabilityType[] field
- Add `imdbUrl` String field with URL validation
- Prisma migration for schema changes
- Update TypeScript types and Zod schemas
- Add birthPlace to ProfileWizard Step 1 (Basic Info)
- Add availabilityTypes and imdbUrl to ProfileWizard Step 5 (Professional)
- Add InlineEdit support for new fields
- Add availability filter to FilterPanel Professional section
- Unit tests for new field validation
- Update existing talent queries to include new fields

### Out of Scope (Deferred)

- Actual data migration from WordPress - _Reason: Session 03_
- Seed data population for skill options - _Reason: Session 02_
- Multi-language labels for new fields - _Reason: Session 04_
- Moroccan region enum - _Reason: Can use location field for now_

---

## 5. Technical Approach

### Architecture

The schema changes follow the existing TalentProfile pattern - adding optional fields that default to null or empty arrays. This ensures zero impact on existing data while enabling new functionality.

```
TalentProfile (enhanced)
  |-- birthPlace: String?          (new - personal info)
  |-- availabilityTypes: Enum[]    (new - replaces simple isAvailable)
  |-- imdbUrl: String?             (new - professional credibility)
```

### Design Patterns

- **Nullable Migration**: All new fields are nullable for backwards compatibility
- **Enum Arrays**: PostgreSQL native array for multi-select availability
- **Progressive Enhancement**: Existing profiles work unchanged, new data captured on edit

### Technology Stack

- Prisma 5.x with PostgreSQL
- TypeScript 5.x with strict mode
- Zod 3.x for runtime validation
- React Hook Form 7.x for form management

---

## 6. Deliverables

### Files to Create

| File                                                            | Purpose                                 | Est. Lines |
| --------------------------------------------------------------- | --------------------------------------- | ---------- |
| `prisma/migrations/[timestamp]_add_legacy_fields/migration.sql` | Database migration                      | ~20        |
| `lib/talents/availability-types.ts`                             | Availability type constants and helpers | ~50        |
| `__tests__/talents/availability-types.test.ts`                  | Unit tests for availability helpers     | ~80        |

### Files to Modify

| File                                   | Changes                                    | Est. Lines Changed |
| -------------------------------------- | ------------------------------------------ | ------------------ |
| `prisma/schema.prisma`                 | Add AvailabilityType enum and new fields   | ~25                |
| `lib/talents/types.ts`                 | Update TalentProfile types                 | ~15                |
| `lib/talents/schemas.ts`               | Add Zod schemas for new fields             | ~30                |
| `lib/talents/queries.ts`               | Include new fields in queries              | ~10                |
| `components/profile/ProfileWizard.tsx` | Add birthPlace, availabilityTypes, imdbUrl | ~60                |
| `components/profile/InlineEdit.tsx`    | Support new field types                    | ~40                |
| `components/talents/FilterPanel.tsx`   | Add availability filter section            | ~50                |
| `lib/talents/filters.ts`               | Add availability filter logic              | ~25                |

---

## 7. Success Criteria

### Functional Requirements

- [ ] `birthPlace` field accepts and stores place of birth strings
- [ ] `AvailabilityType` enum has all 9 legacy options
- [ ] `availabilityTypes` stores multiple selected availability options
- [ ] `imdbUrl` validates IMDB URL format (imdb.com/name/...)
- [ ] ProfileWizard displays and saves all new fields
- [ ] InlineEdit works for birthPlace and imdbUrl
- [ ] FilterPanel filters by availability types
- [ ] Existing profiles load without errors

### Testing Requirements

- [ ] Unit tests for availability type helpers
- [ ] Unit tests for IMDB URL validation
- [ ] Integration tests for form submission with new fields
- [ ] Filter tests with availability criteria

### Quality Gates

- [ ] TypeScript compiles without errors
- [ ] All existing tests pass (359+)
- [ ] Prisma validates schema
- [ ] ESLint passes with no new warnings
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings

---

## 8. Implementation Notes

### Key Considerations

1. **Enum Naming**: Use SCREAMING_SNAKE_CASE for Prisma enum values to match existing enums (e.g., `SHORT_TERM_1_2_DAYS`)

2. **Array Default**: PostgreSQL arrays default to empty `{}` not null - Prisma handles this automatically

3. **URL Validation**: IMDB URLs follow pattern `https://www.imdb.com/name/nm[digits]/` - use regex validation

4. **Filter UX**: Availability filter should be multi-select checkboxes, matching existing filter patterns

### Potential Challenges

- **Enum Array Queries**: Prisma `hasSome`/`hasEvery` for array filtering - test query performance
- **Form State**: Multi-select availability requires careful React Hook Form integration
- **Migration Safety**: Test migration on copy of production data before deploying

### Relevant Considerations

- [P00] **Tiered access control**: New fields (birthPlace) are premium info - maintain access control
- [PRD] **Legacy compatibility**: All 9 availability types from WordPress must be supported

### ASCII Reminder

All output files must use ASCII-only characters (0-127). No special characters in enum values or field names.

---

## 9. Testing Strategy

### Unit Tests

- Availability type constants match enum values
- `getAvailabilityLabel()` returns correct human-readable labels
- IMDB URL validation accepts valid URLs, rejects invalid
- Zod schemas validate new fields correctly

### Integration Tests

- ProfileWizard saves birthPlace, availabilityTypes, imdbUrl to database
- FilterPanel availability filter returns correct results
- InlineEdit updates work for new fields

### Manual Testing

- Create new profile with all new fields populated
- Edit existing profile, add new field values
- Filter talents by availability type
- Verify existing profiles still display correctly

### Edge Cases

- Empty availabilityTypes array (no selection)
- IMDB URL without trailing slash
- Very long birthPlace strings (consider max length)
- Profile with only some new fields populated

---

## 10. Dependencies

### External Libraries

- `prisma`: 5.x (existing)
- `zod`: 3.x (existing)
- No new dependencies required

### Other Sessions

- **Depends on**: phase00-session02, phase01-session01, phase01-session04
- **Depended by**: phase04-session02 (Seed Data), phase04-session03 (Migration)

---

## Appendix: AvailabilityType Enum Values

From legacy WordPress system:

```
ALWAYS                    - Always available
SHORT_TERM_1_2_DAYS       - 1-2 days availability
MEDIUM_TERM_1_2_WEEKS     - 1-2 weeks availability
LONG_TERM_1_4_MONTHS      - 1-4 months availability
WEEKENDS_AND_HOLIDAYS     - Weekends and holidays only
HOLIDAYS_ONLY             - Holidays only
WEEKENDS_ONLY             - Weekends only
EVENINGS                  - Evenings only
DAYS                      - Daytime only
```

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
