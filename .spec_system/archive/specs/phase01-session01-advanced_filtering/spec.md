# Session Specification

**Session ID**: `phase01-session01-advanced_filtering`
**Phase**: 01 - Talent Management
**Status**: Not Started
**Created**: 2026-01-15

---

## 1. Session Overview

This session implements comprehensive multi-criteria filtering for the talent database, transforming the basic filter bar from Phase 00 into a full-featured filter panel with support for all talent attributes. Users will be able to filter talents by physical characteristics (height, physique, hair/eye color), skills (languages, accents, dance, athletic abilities), and professional criteria (availability, rates).

The existing TalentFilters component handles only basic filters (name, gender, age). This session expands filtering to cover all 40+ profile fields while maintaining URL-based state for shareable links. The filter panel will be collapsible with sections for each category, designed for both desktop sidebar and mobile drawer patterns.

This is the first session of Phase 01 and directly builds on the talent listing infrastructure from Phase 00 Session 05. Advanced filtering is the core discovery mechanism users need to find talents matching specific casting requirements.

---

## 2. Objectives

1. Replace the basic filter bar with a comprehensive FilterPanel supporting all talent attribute categories
2. Implement server-side filter query builder with dynamic Prisma WHERE clauses
3. Maintain URL-based filter state for shareable, bookmarkable filter combinations
4. Provide clear filter UX with active counts, section toggles, and clear functionality

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session02-database_schema` - TalentProfile model with all fields
- [x] `phase00-session03-core_ui_framework` - UI primitives (Input, Select, Button)
- [x] `phase00-session05-talent_profile_foundation` - Basic talent listing and queries

### Required Tools/Knowledge

- Prisma dynamic query building
- Next.js App Router searchParams
- React client components with hooks

### Environment Requirements

- PostgreSQL database with talent data
- Node.js 20+
- All Phase 00 dependencies installed

---

## 4. Scope

### In Scope (MVP)

- FilterPanel component with collapsible sections
- Gender filter (single select from enum)
- Age range filter (min/max number inputs)
- Height range filter (min/max in cm)
- Physique filter (multi-select from enum)
- Hair color filter (multi-select from enum)
- Eye color filter (multi-select from enum)
- Hair length filter (multi-select from enum)
- Languages filter (searchable multi-select from array)
- Skills filter (athletic, dance, performance - searchable multi-select)
- Availability toggle (boolean)
- Daily rate range filter (min/max)
- URL state synchronization for all filters
- Active filter badges and clear buttons
- Mobile-responsive drawer/panel pattern
- Server-side query builder for all filters

### Out of Scope (Deferred)

- Saved filter presets - _Reason: requires user preferences storage_
- Filter analytics/tracking - _Reason: requires analytics infrastructure_
- Accents filter - _Reason: complex nested data, defer to Phase 01 Session 03_
- Musical instruments filter - _Reason: lower priority, defer_
- Boolean filters (hasTattoos, hasScars, hasShowreel) - _Reason: lower priority_

---

## 5. Technical Approach

### Architecture

```
app/talents/page.tsx (Server Component)
    |
    +-- FilterPanel.tsx (Client Component)
    |       |
    |       +-- FilterSection.tsx (collapsible wrapper)
    |       |       |
    |       |       +-- Individual filter components
    |       |
    |       +-- useFilters.ts (URL state hook)
    |
    +-- TalentGrid (Server Component)
            |
            +-- lib/talents/filters.ts (query builder)
                    |
                    +-- lib/talents/queries.ts (Prisma calls)
```

### Design Patterns

- **URL State**: All filter state in searchParams for shareability and SSR
- **Server-Side Filtering**: Prisma queries built from URL params, not client-side
- **Compound Components**: FilterPanel > FilterSection > specific filter controls
- **Controlled Components**: Filter inputs controlled by URL state via hooks

### Technology Stack

- Next.js 16 App Router (searchParams, server components)
- React 19 (useSearchParams, useRouter)
- Prisma 5 (dynamic WHERE clause building)
- Tailwind CSS 4 (responsive design, transitions)
- Lucide React (icons)

---

## 6. Deliverables

### Files to Create

| File                                               | Purpose                            | Est. Lines |
| -------------------------------------------------- | ---------------------------------- | ---------- |
| `lib/talents/filters.ts`                           | Query builder for all filter types | ~200       |
| `lib/talents/filter-options.ts`                    | Static options for enum filters    | ~100       |
| `hooks/useFilters.ts`                              | URL state management hook          | ~80        |
| `components/talents/FilterPanel.tsx`               | Main filter container              | ~150       |
| `components/talents/FilterSection.tsx`             | Collapsible section wrapper        | ~60        |
| `components/talents/filters/RangeFilter.tsx`       | Min/max range inputs               | ~70        |
| `components/talents/filters/MultiSelectFilter.tsx` | Checkbox list with search          | ~120       |
| `components/talents/filters/EnumSelectFilter.tsx`  | Single/multi enum select           | ~80        |
| `components/talents/filters/index.ts`              | Barrel exports                     | ~10        |

### Files to Modify

| File                          | Changes                                               | Est. Lines |
| ----------------------------- | ----------------------------------------------------- | ---------- |
| `app/talents/page.tsx`        | Replace TalentFilters with FilterPanel, update layout | ~40        |
| `lib/talents/queries.ts`      | Update getPublicTalents to use filter builder         | ~30        |
| `lib/talents/validation.ts`   | Extend TalentFilterInput schema                       | ~50        |
| `components/talents/index.ts` | Export new filter components                          | ~5         |

---

## 7. Success Criteria

### Functional Requirements

- [ ] FilterPanel displays with all sections (Basic, Physical, Skills, Professional)
- [ ] Each filter section is collapsible
- [ ] Gender filter works with single selection
- [ ] Age range filter accepts min/max values
- [ ] Height range filter accepts min/max in cm
- [ ] Physique filter supports multiple selections
- [ ] Hair/eye color filters support multiple selections
- [ ] Languages filter has search and multi-select
- [ ] Skills filters (athletic, dance, performance) have search and multi-select
- [ ] Availability toggle filters to available talents only
- [ ] Rate range filter accepts min/max values
- [ ] All filters reflect in URL params
- [ ] Sharing a URL preserves filter state
- [ ] Browser back/forward maintains filter state
- [ ] Clear all button resets all filters
- [ ] Individual section clear buttons work
- [ ] Filter count badges show active filter count per section

### Testing Requirements

- [ ] Manual testing of all filter combinations
- [ ] Verify URL state persistence
- [ ] Test on mobile viewport (drawer pattern)

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes with 0 errors
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Code follows project conventions

---

## 8. Implementation Notes

### Key Considerations

- Maintain existing pagination when filters change (reset to page 1)
- Use debouncing for text inputs (search, range inputs)
- Pre-populate filter options from database where applicable (languages, skills)
- Handle empty arrays vs undefined for multi-select filters

### Potential Challenges

- **Query Performance**: Many filter combinations may create slow queries
  - _Mitigation_: Use existing indexes, limit complex OR conditions
- **URL Length**: Too many filters may exceed URL limits
  - _Mitigation_: Use short param names, comma-separated values for arrays
- **Mobile UX**: Full filter panel won't fit on mobile
  - _Mitigation_: Use drawer/sheet pattern with filter button trigger

### Relevant Considerations

- [P00] **Tiered access control**: Filters only show approved, public talents
- [P00] **Performance**: Use existing database indexes (gender, ageRange, physique, location, isAvailable)

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Not required for MVP (per project scope)

### Integration Tests

- Not required for MVP (per project scope)

### Manual Testing

1. Apply each filter type individually, verify results update
2. Combine multiple filters, verify AND logic works
3. Copy URL with filters, open in new tab, verify state preserved
4. Use browser back/forward, verify filter state correct
5. Clear individual sections, verify only that section resets
6. Clear all filters, verify full reset
7. Test on mobile viewport, verify drawer opens/closes
8. Test with no matching results, verify empty state

### Edge Cases

- No talents match filter criteria (empty state)
- All talents match (no filtering)
- Range filters with only min or only max
- Multi-select with search that matches nothing
- Very long filter combinations

---

## 10. Dependencies

### External Libraries

- `@prisma/client`: ^5.22.0 (existing)
- `lucide-react`: ^0.562.0 (existing)
- `zod`: ^4.3.5 (existing)

### Other Sessions

- **Depends on**: Phase 00 Sessions 02, 03, 05
- **Depended by**: Phase 01 Session 03 (Search combines with filters)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
