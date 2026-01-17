# Session Specification

**Session ID**: `phase01-session03-talent_search_discovery`
**Phase**: 01 - Talent Management
**Status**: Not Started
**Created**: 2026-01-16

---

## 1. Session Overview

This session implements powerful search capabilities for the talent discovery experience. With 40+ filterable fields already available from Session 01 and photos from Session 02, users now need a fast way to find talents by name, skills, bio, or other text attributes.

The search functionality will use PostgreSQL full-text search with tsvector/tsquery for relevance-based ranking. The implementation includes an autocomplete search bar with debouncing, recent searches stored in localStorage, and seamless integration with the existing filter system via URL parameters.

This completes the "find talents" experience and enables the Public Talent Gallery (Session 05) to offer a comprehensive discovery mechanism for visitors.

---

## 2. Objectives

1. Implement full-text search across talent name, bio, and skills fields using PostgreSQL tsvector
2. Create a responsive search bar component with autocomplete suggestions and debouncing
3. Store and display recent searches in localStorage for quick re-access
4. Integrate search with existing URL-based filter state for shareable search links

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session02-database_schema` - TalentProfile model with searchable fields
- [x] `phase00-session03-core_ui_framework` - UI primitives and design tokens
- [x] `phase01-session01-advanced_filtering` - URL-based filter state and FilterPanel

### Required Tools/Knowledge

- PostgreSQL full-text search concepts (tsvector, tsquery, ts_rank)
- Prisma raw queries ($queryRaw)
- React hooks for debouncing

### Environment Requirements

- PostgreSQL database with write access for migrations
- Node.js 18+ with Next.js 16

---

## 4. Scope

### In Scope (MVP)

- Full-text search across firstName, lastName, bio, skills, languages
- Search bar with autocomplete dropdown showing matching talents
- 300ms debounce on search input
- Recent searches stored in localStorage (max 10)
- Search results highlighting in talent cards
- URL param `q` for search query (shareable links)
- Combined search + filter experience
- Empty state for no results

### Out of Scope (Deferred)

- AI/semantic search - _Reason: Complexity, requires vector database_
- Saved search alerts - _Reason: Requires notification system_
- Complex relevance tuning - _Reason: Start simple, iterate based on usage_
- Fuzzy/typo-tolerant search - _Reason: PostgreSQL FTS handles stemming, defer fuzzy_

---

## 5. Technical Approach

### Architecture

```
User types in SearchBar
    |
    v (300ms debounce)
Client sends search query via URL param
    |
    v
Server parses `q` param, builds tsquery
    |
    v
Prisma $queryRaw executes FTS with ts_rank
    |
    v
Results returned with relevance scores
    |
    v
UI highlights matching terms in results
```

### Design Patterns

- **Debounce Pattern**: Prevent excessive API calls during typing
- **URL State**: Search query in URL for shareability (same as filters)
- **Optimistic UI**: Show recent searches immediately while fetching

### Technology Stack

- PostgreSQL 15+ full-text search (tsvector, tsquery, ts_rank)
- Prisma 5.x with $queryRaw for FTS queries
- React 19 with useTransition for search state
- localStorage for recent searches persistence

---

## 6. Deliverables

### Files to Create

| File                                          | Purpose                             | Est. Lines |
| --------------------------------------------- | ----------------------------------- | ---------- |
| `components/search/SearchBar.tsx`             | Main search input with autocomplete | ~150       |
| `components/search/SearchSuggestions.tsx`     | Dropdown with suggestions           | ~80        |
| `components/search/RecentSearches.tsx`        | Recent searches list                | ~60        |
| `components/search/SearchHighlight.tsx`       | Highlight matching text             | ~40        |
| `components/search/index.ts`                  | Barrel exports                      | ~5         |
| `lib/search/search-queries.ts`                | PostgreSQL FTS queries              | ~120       |
| `lib/search/search-utils.ts`                  | Highlight and parse utilities       | ~60        |
| `lib/search/recent-searches.ts`               | localStorage management             | ~50        |
| `prisma/migrations/xxx_add_search_vector.sql` | Manual migration for tsvector       | ~30        |

### Files to Modify

| File                                | Changes                                | Est. Lines |
| ----------------------------------- | -------------------------------------- | ---------- |
| `app/talents/page.tsx`              | Add SearchBar, pass query to grid      | ~30        |
| `lib/talents/queries.ts`            | Integrate search with getPublicTalents | ~40        |
| `lib/talents/validation.ts`         | Add `q` param to filter schema         | ~10        |
| `lib/talents/filters.ts`            | Parse `q` param                        | ~10        |
| `components/talents/TalentCard.tsx` | Use SearchHighlight for name/bio       | ~20        |
| `prisma/schema.prisma`              | Document search vector approach        | ~5         |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Users can search by typing in the search bar
- [ ] Search returns relevant talents matching name, bio, or skills
- [ ] Autocomplete shows top 5 matching talents while typing
- [ ] Recent searches persist across page reloads
- [ ] Search query appears in URL (shareable)
- [ ] Search works combined with filters
- [ ] Empty state shown when no results match
- [ ] Search terms highlighted in results

### Testing Requirements

- [ ] Manual testing of search with various queries
- [ ] Test multi-word search queries
- [ ] Test search + filter combination
- [ ] Test recent searches persistence
- [ ] Test on mobile viewport

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes with 0 errors
- [ ] Build succeeds with no TypeScript errors
- [ ] Code follows project conventions

---

## 8. Implementation Notes

### Key Considerations

- Use `simple` dictionary for PostgreSQL FTS (language-agnostic for French/Arabic/English)
- Index the tsvector column for performance
- Limit autocomplete to 5 results for UX
- Clear search maintains current filters

### Potential Challenges

- **Challenge**: PostgreSQL tsvector setup in Prisma
  - **Mitigation**: Use raw SQL migration, document approach
- **Challenge**: Multi-language text handling
  - **Mitigation**: Use `simple` dictionary which doesn't apply language-specific stemming
- **Challenge**: Search + filter URL params interaction
  - **Mitigation**: Follow same pattern as existing filters (additive)

### Relevant Considerations

- [P00] **Multi-language support**: Using PostgreSQL `simple` dictionary handles French, Arabic, English without language-specific configuration
- [P00] **Tiered access**: Search queries only include public fields (name, public bio), premium data excluded from search

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Search query sanitization
- Highlight text utility
- Recent searches localStorage functions

### Integration Tests

- Not required for MVP (manual testing)

### Manual Testing

1. Search by first name only
2. Search by last name only
3. Search by full name
4. Search by skill (e.g., "acting", "comedy")
5. Search by bio keyword
6. Multi-word search query
7. Search with active filters
8. Clear search, verify filters remain
9. Recent searches display and click
10. Share search URL in new tab

### Edge Cases

- Empty search query (show all)
- Very long search query (truncate)
- Special characters in search (escape)
- No matching results (empty state)
- Rapid typing (debounce works)

---

## 10. Dependencies

### External Libraries

- None new (uses existing Prisma, React)

### Other Sessions

- **Depends on**: phase01-session01-advanced_filtering (URL state pattern)
- **Depended by**: phase01-session05-public_talent_gallery (search is key discovery)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
