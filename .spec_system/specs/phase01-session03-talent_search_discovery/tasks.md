# Task Checklist

**Session ID**: `phase01-session03-talent_search_discovery`
**Total Tasks**: 18
**Estimated Duration**: 2-3 hours
**Created**: 2026-01-16

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0103]` = Session reference (Phase 01, Session 03)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 3      | 3      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 7      | 7      | 0         |
| Testing        | 3      | 3      | 0         |
| **Total**      | **18** | **18** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0103] Verify prerequisites met (PostgreSQL connection, Prisma client)
- [x] T002 [S0103] Create directory structure for search components and lib (`components/search/`, `lib/search/`)
- [x] T003 [S0103] Create PostgreSQL migration for tsvector search index (`prisma/search-setup.sql`)

---

## Foundation (5 tasks)

Core structures, utilities, and base implementations.

- [x] T004 [S0103] [P] Create search utilities for query sanitization and highlighting (`lib/search/search-utils.ts`)
- [x] T005 [S0103] [P] Create recent searches localStorage helper (`lib/search/recent-searches.ts`)
- [x] T006 [S0103] [P] Update validation schema with `q` search param (`lib/talents/validation.ts`)
- [x] T007 [S0103] Update filter parsing to handle `q` param (`lib/talents/filters.ts`)
- [x] T008 [S0103] Create PostgreSQL FTS search queries with Prisma raw SQL (`lib/search/search-queries.ts`)

---

## Implementation (7 tasks)

Main feature implementation.

- [x] T009 [S0103] [P] Create SearchHighlight component for matching text (`components/search/SearchHighlight.tsx`)
- [x] T010 [S0103] [P] Create RecentSearches component with localStorage integration (`components/search/RecentSearches.tsx`)
- [x] T011 [S0103] Create SearchSuggestions dropdown component (`components/search/SearchSuggestions.tsx`)
- [x] T012 [S0103] Create SearchBar component with debounce and autocomplete (`components/search/SearchBar.tsx`)
- [x] T013 [S0103] Create barrel exports for search components (`components/search/index.ts`)
- [x] T014 [S0103] Integrate search with getPublicTalents query (`lib/talents/queries.ts`)
- [x] T015 [S0103] Add SearchBar to talents page and wire up search state (`app/talents/page.tsx`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T016 [S0103] Update TalentCard to use SearchHighlight for name/bio (`components/talents/TalentCard.tsx`)
- [x] T017 [S0103] Run ESLint and fix any errors (`npm run lint`)
- [x] T018 [S0103] Run build and verify no TypeScript errors (`npm run build`)

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] ESLint passes with 0 errors
- [x] Build succeeds with no TypeScript errors
- [x] All files ASCII-encoded
- [x] implementation-notes.md updated
- [ ] Manual testing completed (search, autocomplete, recent searches)
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Tasks marked `[P]` can be worked on simultaneously:

- T004, T005, T006: Independent utility files
- T009, T010: Independent UI components

### Task Timing

Target ~10-15 minutes per task.

### Dependencies

- T003 (migration) should complete before T008 (search queries)
- T004-T008 (foundation) should complete before T09-T15 (implementation)
- T08 (search queries) required before T14 (query integration)
- T09-T13 (components) required before T15 (page integration)
- T14 (query integration) required before T15 (page integration)

### Manual Testing Checklist

After implementation, verify:

1. Search by first name returns relevant results
2. Search by skill (e.g., "acting") works
3. Multi-word search queries work
4. Autocomplete shows top 5 suggestions
5. Recent searches appear and are clickable
6. Search URL is shareable (copy/paste in new tab)
7. Search + filters work together
8. Clear search maintains active filters
9. Empty state shows for no results
10. Mobile viewport displays correctly

---

## Next Steps

Run `/implement` to begin AI-led implementation.
