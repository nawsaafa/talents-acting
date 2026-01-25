# Session Specification

**Session ID**: `phase04-session03-legacy_data_migration`
**Phase**: 04 - Data Migration & Polish
**Status**: Not Started
**Created**: 2026-01-25

---

## 1. Session Overview

This session migrates approximately 35 actor profiles from the legacy WordPress database to the new Next.js/Prisma-based talent management platform. The migration preserves all profile data, user accounts, and media files while transforming the data to match the new schema structure introduced in Session 01 (Schema Enhancement).

The migration infrastructure must be idempotent, allowing safe re-runs during testing and providing rollback capability. This is a critical session as it provides the real production data needed for internationalization testing (Session 04) and performance optimization (Session 05).

Key challenges include mapping WordPress custom fields to the new Prisma schema, handling password migration (WordPress uses different hashing), and migrating media files from WordPress uploads to the new storage location.

---

## 2. Objectives

1. Build a WordPress export parser that extracts user and profile data from WordPress database exports
2. Create a data transformer that maps WordPress fields to the new TalentProfile schema
3. Implement user account migration with password reset flow for security
4. Migrate media files (photos) from WordPress uploads to the new storage system
5. Provide validation, dry-run mode, and rollback capabilities

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session02-database_schema` - Prisma schema foundation
- [x] `phase04-session01-schema_enhancement` - Legacy-compatible fields (birthPlace, availabilityTypes, imdbUrl)
- [x] `phase04-session02-seed_data_population` - 212 seed options for skills/accents/regions

### Required Tools/Knowledge

- Node.js with ts-node for running migration scripts
- Access to WordPress database export (SQL or JSON format)
- Access to WordPress wp-content/uploads directory

### Environment Requirements

- PostgreSQL database with Prisma schema applied
- Storage directory for migrated media files
- Environment variables for database connection

---

## 4. Scope

### In Scope (MVP)

- WordPress data parser for user and profile tables
- Field mapping configuration for WordPress -> Prisma transformation
- User migration with forced password reset (no password hash migration)
- TalentProfile data transformation and import
- Photo migration from WordPress uploads
- Validation reports showing migration status
- Dry-run mode for testing without database changes
- Rollback script to undo migration

### Out of Scope (Deferred)

- Password hash migration - _Reason: Security concern, WordPress uses different hashing; force reset is safer_
- Video file migration - _Reason: Videos are external URLs (YouTube/Vimeo), already handled_
- Professional/Company profile migration - _Reason: Legacy system only has talent profiles_
- Real-time sync - _Reason: One-time migration, not ongoing sync_

---

## 5. Technical Approach

### Architecture

```
scripts/migration/
  ├── types.ts              # TypeScript types for WordPress data
  ├── config.ts             # Field mappings and configuration
  ├── wordpress-parser.ts   # Parse WordPress export files
  ├── data-transformer.ts   # Transform WordPress -> Prisma format
  ├── user-migrator.ts      # Migrate user accounts
  ├── profile-migrator.ts   # Migrate talent profiles
  ├── media-migrator.ts     # Migrate photos
  ├── validator.ts          # Validation and reporting
  ├── rollback.ts           # Rollback migration
  └── index.ts              # Main migration orchestrator
```

### Design Patterns

- **Pipeline Pattern**: Sequential processing (parse -> transform -> validate -> import)
- **Strategy Pattern**: Different parsers for SQL vs JSON exports
- **Repository Pattern**: Separate data access from transformation logic

### Technology Stack

- TypeScript for type-safe migration scripts
- Prisma Client for database operations
- Sharp for image processing during migration
- pino for migration logging

---

## 6. Deliverables

### Files to Create

| File                                      | Purpose                                                | Est. Lines |
| ----------------------------------------- | ------------------------------------------------------ | ---------- |
| `scripts/migration/types.ts`              | TypeScript interfaces for WordPress and migration data | ~80        |
| `scripts/migration/config.ts`             | Field mapping configuration                            | ~120       |
| `scripts/migration/wordpress-parser.ts`   | Parse WordPress SQL/JSON exports                       | ~150       |
| `scripts/migration/data-transformer.ts`   | Transform data to Prisma format                        | ~200       |
| `scripts/migration/user-migrator.ts`      | Migrate user accounts                                  | ~100       |
| `scripts/migration/profile-migrator.ts`   | Migrate talent profiles                                | ~180       |
| `scripts/migration/media-migrator.ts`     | Copy and process media files                           | ~120       |
| `scripts/migration/validator.ts`          | Validate data integrity                                | ~100       |
| `scripts/migration/rollback.ts`           | Rollback migration                                     | ~80        |
| `scripts/migration/index.ts`              | Main orchestrator with CLI                             | ~150       |
| `__tests__/migration/transformer.test.ts` | Unit tests for data transformation                     | ~200       |
| `__tests__/migration/validator.test.ts`   | Unit tests for validation                              | ~100       |
| `data/sample-wordpress-export.json`       | Sample export for testing                              | ~200       |

### Files to Modify

| File                   | Changes                                  | Est. Lines |
| ---------------------- | ---------------------------------------- | ---------- |
| `package.json`         | Add migration script commands            | ~5         |
| `prisma/schema.prisma` | Add optional legacyId field for tracking | ~10        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Parse WordPress export files (SQL or JSON format)
- [ ] Transform all 40+ TalentProfile fields correctly
- [ ] Migrate users with email uniqueness handling
- [ ] Copy and validate media files
- [ ] Generate migration report with success/failure counts
- [ ] Dry-run mode works without database changes
- [ ] Rollback removes all migrated data

### Testing Requirements

- [ ] Unit tests for data transformation logic
- [ ] Unit tests for validation functions
- [ ] Integration test with sample data
- [ ] Manual testing with real WordPress export

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] All tests passing (current 408 + new)

---

## 8. Implementation Notes

### Key Considerations

1. **Password Security**: Do NOT migrate password hashes. Instead, generate random passwords and set users to require password reset on first login.

2. **Email Uniqueness**: Handle duplicate emails gracefully. Log conflicts and skip duplicates.

3. **Media Path Mapping**: WordPress stores paths relative to wp-content/uploads. Map to new public/uploads structure.

4. **Idempotency**: Use legacyId field to track migrated records. Skip already-migrated records on re-run.

5. **Batch Processing**: Process records in batches to avoid memory issues with large datasets.

### Potential Challenges

- **Data inconsistencies**: WordPress custom fields may have inconsistent formats. Use defensive parsing with fallbacks.
- **Missing media files**: Some profile photos may be missing. Log warnings and continue.
- **Encoding issues**: Ensure proper UTF-8 to ASCII transliteration for special characters.

### Relevant Considerations

- [Architecture] **Admin validation workflow**: Migrated profiles should start as APPROVED since they were already validated in the legacy system
- [Security] **User data protection**: Handle contact info (email, phone) according to tiered access rules

### ASCII Reminder

All output files must use ASCII-only characters (0-127). Transliterate Arabic names and special characters.

---

## 9. Testing Strategy

### Unit Tests

- Data transformer: Test each field mapping function
- Validator: Test uniqueness checks, required field validation
- Parser: Test with malformed input handling

### Integration Tests

- Full pipeline with sample WordPress export
- Verify Prisma records created correctly

### Manual Testing

- Run dry-run mode with real WordPress export
- Verify migrated profiles appear correctly in UI
- Test rollback removes all data

### Edge Cases

- Empty/null fields in WordPress data
- Duplicate email addresses
- Missing photo files
- Invalid date formats
- Non-ASCII characters in names

---

## 10. Dependencies

### External Libraries

- `prisma`: ^5.22.0 (existing)
- `sharp`: ^0.34.5 (existing, for image processing)
- `pino`: ^10.2.0 (existing, for logging)

### Other Sessions

- **Depends on**: phase04-session01-schema_enhancement, phase04-session02-seed_data_population
- **Depended by**: phase04-session04-internationalization (needs real data for testing)

---

## WordPress Field Mapping Reference

| WordPress Field          | TalentProfile Field  | Transform Notes       |
| ------------------------ | -------------------- | --------------------- |
| user_email               | user.email           | Direct copy           |
| display_name             | firstName + lastName | Split on space        |
| user_registered          | createdAt            | Date parse            |
| meta: gender             | gender               | Map to Gender enum    |
| meta: age_min            | ageRangeMin          | Parse int             |
| meta: age_max            | ageRangeMax          | Parse int             |
| meta: birth_date         | dateOfBirth          | Date parse            |
| meta: birth_place        | birthPlace           | Direct copy           |
| meta: height             | height               | Parse int (cm)        |
| meta: physique           | physique             | Map to Physique enum  |
| meta: hair_color         | hairColor            | Map to HairColor enum |
| meta: eye_color          | eyeColor             | Map to EyeColor enum  |
| meta: languages          | languages            | JSON parse to array   |
| meta: accents            | accents              | JSON parse to array   |
| meta: skills             | athleticSkills       | JSON parse to array   |
| meta: instruments        | musicalInstruments   | JSON parse to array   |
| meta: dance_styles       | danceStyles          | JSON parse to array   |
| meta: performance_skills | performanceSkills    | JSON parse to array   |
| meta: availability       | availabilityTypes    | Map to enum array     |
| meta: imdb_url           | imdbUrl              | Direct copy           |
| meta: bio                | bio                  | Direct copy           |
| meta: location           | location             | Direct copy           |
| attachment_url           | photos               | Array of URLs         |

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
