# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-16
**Project State**: Phase 01 - Talent Management
**Completed Sessions**: 8 (6 from Phase 00, 2 from Phase 01)

---

## Recommended Next Session

**Session ID**: `phase01-session03-talent_search_discovery`
**Session Name**: Talent Search & Discovery
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: ~16

---

## Why This Session Next?

### Prerequisites Met
- [x] Phase 00 Foundation complete (database, auth, UI primitives)
- [x] Session 01: Advanced filtering implemented (provides filter context)
- [x] Session 02: Media upload complete (talents have photos to display in results)

### Dependencies
- **Builds on**: Advanced filtering (S01) - search complements filters
- **Enables**: Public gallery (S05) - search is key discovery mechanism

### Project Progression
Search & Discovery is the natural next step after filtering and media. With 40+ filterable fields and photos now available, users need a fast way to find talents by name, skills, or bio text. This session completes the "find talents" experience before moving to profile enhancement.

---

## Session Overview

### Objective
Build powerful search capabilities that allow users to quickly find talents by name, skills, bio, or other text attributes, with autocomplete suggestions and combined search+filter experience.

### Key Deliverables
1. Full-text search across name, bio, skills fields
2. Search suggestions and autocomplete
3. Recent searches history (localStorage)
4. Search results highlighting
5. Combined search + filter experience
6. Search result ranking by relevance

### Scope Summary
- **In Scope (MVP)**: Text search, autocomplete, recent history, highlighting, filter integration
- **Out of Scope**: AI-powered semantic search, saved search alerts, complex relevance tuning

---

## Technical Considerations

### Technologies/Patterns
- PostgreSQL full-text search (tsvector/tsquery)
- Search input with debouncing (300ms)
- Prisma raw queries for FTS
- localStorage for recent searches
- URL params for shareable search links

### Potential Challenges
- PostgreSQL tsvector setup and migration
- Balancing relevance ranking for different field types
- Handling Arabic/French text in search (multi-language)
- Performance with large result sets

### Relevant Considerations
- [P00] **Multi-language support**: Search must handle French, Arabic, and English text
- [P00] **Tiered access**: Search results must respect public vs premium data separation

---

## Alternative Sessions

If this session is blocked:
1. **Session 04: Profile Enhancement** - Can proceed independently if search has technical blockers
2. **Session 05: Public Gallery** - Could be done first but better with search complete

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
