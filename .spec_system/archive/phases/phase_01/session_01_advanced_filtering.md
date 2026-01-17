# Session 01: Advanced Talent Filtering

**Phase**: 01 - Talent Management
**Session**: 01
**Status**: Not Started
**Estimated Tasks**: ~18

---

## Objective

Implement comprehensive multi-criteria filtering for the talent database, enabling users to find talents by physical attributes, skills, languages, availability, and more.

---

## Prerequisites

- [x] Phase 00 complete
- [x] TalentProfile model with all filterable fields
- [x] Basic talent listing page exists
- [x] Database indexes on filter fields

---

## Deliverables

### 1. Filter Component Architecture

Create a reusable, collapsible filter panel:

- `FilterPanel` - Main container with collapsible sections
- `FilterSection` - Individual category (Gender, Age, Skills, etc.)
- `FilterCheckbox` - Multi-select filter option
- `FilterRange` - Range slider for age, height, rates
- `FilterSearch` - Searchable dropdown for large lists

### 2. Filter Categories

Implement filters for all major attribute groups:

**Basic Filters**:

- Gender (single select)
- Age range (dual slider: 0-100)
- Name search (text input)

**Physical Attributes**:

- Height range (cm)
- Physique (slim, average, athletic, etc.)
- Ethnic appearance
- Eye color
- Hair color
- Hair length

**Skills & Languages**:

- Languages spoken (multi-select with search)
- Accents (multi-select)
- Dance styles (multi-select)
- Athletic skills (multi-select)
- Musical instruments (multi-select)
- Performance skills (multi-select)

**Professional**:

- Validation status (for admins only)
- Has showreel (boolean)
- Has book (boolean)
- Availability
- Daily rate range

### 3. URL-Based Filter State

- All active filters reflected in URL query params
- Shareable filter URLs
- Browser back/forward navigation works
- Filters persist on page refresh

### 4. Filter UX

- Active filter count badges per section
- "Clear all filters" button
- Individual filter reset per section
- Filter results count
- Loading states during filter changes

---

## Technical Approach

### Server-Side Filtering

Build dynamic Prisma queries based on filter params:

```typescript
// lib/talents/filters.ts
export function buildTalentFilterQuery(params: TalentFilterParams) {
  const where: Prisma.TalentProfileWhereInput = {
    validationStatus: 'APPROVED',
    user: { isActive: true },
  };

  if (params.gender) where.gender = params.gender;
  if (params.minAge || params.maxAge) {
    where.ageRangeMin = { gte: params.minAge };
    where.ageRangeMax = { lte: params.maxAge };
  }
  // ... more filters

  return where;
}
```

### URL State Management

Use Next.js searchParams with custom hooks:

```typescript
// hooks/useFilters.ts
export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  };

  return { filters: Object.fromEntries(searchParams), setFilter };
}
```

### Query Optimization

- Use existing database indexes
- Limit results with pagination
- Consider query caching for common filter combinations

---

## Scope

### In Scope (MVP)

- All basic and physical attribute filters
- Skills and languages filters
- URL-based filter state
- Filter count and clear functionality
- Mobile-responsive filter panel

### Out of Scope (Future)

- Saved filter presets
- Filter analytics/tracking
- AI-powered filter suggestions
- Complex boolean filter logic (AND/OR)

---

## Validation Criteria

- [ ] All filter categories implemented and functional
- [ ] Filters update results correctly
- [ ] URL reflects active filters
- [ ] Shareable URLs work correctly
- [ ] Filter panel is responsive on mobile
- [ ] Performance acceptable (<500ms filter response)
- [ ] ESLint passes with 0 errors
- [ ] Build succeeds

---

## Files to Create/Modify

### New Files

- `components/talents/FilterPanel.tsx`
- `components/talents/FilterSection.tsx`
- `components/talents/filters/GenderFilter.tsx`
- `components/talents/filters/AgeRangeFilter.tsx`
- `components/talents/filters/PhysicalFilters.tsx`
- `components/talents/filters/SkillsFilter.tsx`
- `components/talents/filters/LanguagesFilter.tsx`
- `lib/talents/filters.ts` - Filter query builder
- `hooks/useFilters.ts` - URL state hook

### Modify

- `app/talents/page.tsx` - Integrate filter panel
- `lib/talents/queries.ts` - Add filter support to queries

---

## Dependencies

- Phase 00 Session 02 (Database Schema)
- Phase 00 Session 05 (Talent Profile Foundation)
