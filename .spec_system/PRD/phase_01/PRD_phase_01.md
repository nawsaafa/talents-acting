# PRD Phase 01: Talent Management

**Status**: In Progress
**Sessions**: 5
**Estimated Duration**: 3-4 days

**Progress**: 2/5 sessions (40%)

---

## Overview

Build upon Phase 00's foundation to deliver a complete talent management system with advanced filtering, search functionality, media uploads, and enhanced profile editing. This phase transforms the basic talent profiles into a fully-featured, searchable talent database.

---

## Progress Tracker

| Session | Name | Status | Est. Tasks | Validated |
|---------|------|--------|------------|-----------|
| 01 | Advanced Talent Filtering | Complete | 20 | 2026-01-15 |
| 02 | Media Upload System | Complete | 20 | 2026-01-15 |
| 03 | Talent Search & Discovery | Not Started | ~16 | - |
| 04 | Profile Enhancement | Not Started | ~18 | - |
| 05 | Public Talent Gallery | Not Started | ~15 | - |

---

## Completed Sessions

- **Session 01: Advanced Talent Filtering** (2026-01-15)
  - Comprehensive FilterPanel with 4 sections (Basic, Physical, Skills, Professional)
  - 14+ filter types (range, enum, multi-select)
  - URL-based state for shareable filter links
  - Server-side Prisma filtering with dynamic WHERE clauses
  - Mobile drawer pattern for responsive design

- **Session 02: Media Upload System** (2026-01-15)
  - Drag-and-drop photo upload with progress indicators
  - Sharp image processing (3 variants: thumbnail, card, full)
  - WebP conversion for optimization
  - Photo gallery with reordering and primary selection
  - YouTube/Vimeo video URL embedding
  - 10 photo limit with 5MB max file size

---

## Upcoming Sessions

- Session 03: Talent Search & Discovery
- Session 04: Profile Enhancement
- Session 05: Public Talent Gallery

---

## Objectives

1. Implement comprehensive filtering across all talent attributes (40+ fields)
2. Build media upload system for photos, videos, and showreels
3. Create powerful search functionality with text and attribute-based queries
4. Enhance profile editing with better UX and validation
5. Build a polished public talent gallery for visitors

---

## Prerequisites

- Phase 00: Foundation (Complete)
  - Database schema with TalentProfile model
  - Authentication with role-based access
  - Basic talent CRUD operations
  - Admin dashboard for validation
  - UI primitives and design system

---

## Session Details

### Session 01: Advanced Talent Filtering

**Objective**: Implement multi-criteria filtering for the talent database

**Key Deliverables**:
- Filter component with collapsible sections
- Filters for: gender, age range, physical attributes, skills, languages
- URL-based filter state for shareable links
- Filter count badges and active filter indicators
- Clear all / individual filter reset

**Technical Focus**:
- Server-side filtering with Prisma
- URL search params for filter state
- Optimized queries with proper indexes

### Session 02: Media Upload System

**Objective**: Enable talents to upload and manage photos and videos

**Key Deliverables**:
- Photo upload with gallery management (max 10 photos)
- Primary photo selection
- Video/showreel URL embedding (YouTube, Vimeo)
- Image optimization and resizing
- Upload progress indicators

**Technical Focus**:
- File upload API with validation
- Image processing (resize, optimize)
- Cloud storage integration
- Video embed sanitization

### Session 03: Talent Search & Discovery

**Objective**: Build powerful search capabilities for finding talents

**Key Deliverables**:
- Full-text search across name, bio, skills
- Search suggestions and autocomplete
- Recent searches history
- Search results highlighting
- Combined search + filter experience

**Technical Focus**:
- PostgreSQL full-text search
- Search debouncing and optimization
- Result ranking and relevance

### Session 04: Profile Enhancement

**Objective**: Improve the talent profile editing experience

**Key Deliverables**:
- Multi-step profile wizard
- Draft/published profile states
- Profile completeness indicator
- Inline editing for quick updates
- Profile preview before publishing

**Technical Focus**:
- Form state management
- Auto-save functionality
- Validation feedback

### Session 05: Public Talent Gallery

**Objective**: Create a polished, performant talent showcase for public visitors

**Key Deliverables**:
- Grid/list view toggle
- Infinite scroll or pagination
- Talent card hover effects
- Quick view modal
- Mobile-optimized gallery

**Technical Focus**:
- Image lazy loading
- Performance optimization
- Responsive grid layouts

---

## Technical Considerations

### Architecture
- Maintain public/premium data separation established in Phase 00
- Reuse existing UI primitives and design tokens
- Server Components for data fetching, Client Components for interactivity

### Technologies
- Prisma for complex filtering queries
- PostgreSQL full-text search (tsvector)
- Sharp or similar for image processing
- Cloudinary/S3 for media storage (decision needed)

### Risks
- **Query performance**: 40+ filter fields may cause slow queries
- **Media storage costs**: Video hosting can be expensive
- **Search complexity**: Full-text search setup with PostgreSQL

### Relevant Considerations from Phase 00
- [P00] **Video hosting**: Need to decide between Cloudinary, Vimeo API, or dedicated CDN
- [P00] **Tiered access**: Must maintain at query level, not just UI

---

## Success Criteria

Phase complete when:
- [ ] All 5 sessions completed and validated
- [ ] Talents can be filtered by all major attribute categories
- [ ] Photo upload and gallery management works
- [ ] Video embeds display correctly
- [ ] Search returns relevant results quickly
- [ ] Profile editing is intuitive with good feedback
- [ ] Public gallery is performant on mobile

---

## Dependencies

### Depends On
- Phase 00: Foundation (database, auth, UI primitives)

### Enables
- Phase 02: Registration & Payments
- Phase 03: Advanced Features (advanced search, recommendations)
