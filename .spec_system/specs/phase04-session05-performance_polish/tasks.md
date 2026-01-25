# Task Checklist

**Session ID**: `phase04-session05-performance_polish`
**Total Tasks**: 21
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-25

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0405]` = Session reference (Phase 04, Session 05)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 3      | 3      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 9      | 9      | 0         |
| Testing        | 4      | 4      | 0         |
| **Total**      | **21** | **21** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0405] Verify prerequisites (532 tests passing, dependencies installed)
- [x] T002 [S0405] Install next-sitemap package for sitemap generation
- [x] T003 [S0405] Create directory structure (`lib/seo/`, `__tests__/seo/`, `__tests__/accessibility/`)

---

## Foundation (5 tasks)

Core utilities and reusable components.

- [x] T004 [S0405] [P] Create SEO metadata generation utilities (`lib/seo/metadata.ts`)
- [x] T005 [S0405] [P] Create JSON-LD structured data utilities (`lib/seo/structured-data.ts`)
- [x] T006 [S0405] [P] Create reusable Skeleton loading components (`components/ui/Skeleton.tsx`)
- [x] T007 [S0405] Create ErrorBoundary component with error catching (`components/ui/ErrorBoundary.tsx`)
- [x] T008 [S0405] Create ErrorFallback component with recovery UI (`components/ui/ErrorFallback.tsx`)

---

## Implementation (9 tasks)

Main feature implementation and integrations.

- [x] T009 [S0405] Add database indexes to Prisma schema and generate migration (`prisma/schema.prisma`)
- [x] T010 [S0405] Configure security headers and image optimization in Next.js config (`next.config.ts`)
- [x] T011 [S0405] Add security headers to middleware (`middleware.ts`)
- [x] T012 [S0405] [P] Create dynamic sitemap with locale support (`app/sitemap.ts`)
- [x] T013 [S0405] [P] Create robots.txt configuration (`app/robots.ts`)
- [x] T014 [S0405] Update locale layout with viewport, theme-color, and base metadata (`app/[locale]/layout.tsx`)
- [x] T015 [S0405] Optimize TalentCard images with next/image and blur placeholders (`components/talents/TalentCard.tsx`)
- [x] T016 [S0405] Add skeleton loading states to TalentGallery (`components/talents/TalentGallery.tsx`)
- [x] T017 [S0405] Add accessibility features to Header - skip link and ARIA labels (`components/layout/Header.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T018 [S0405] [P] Write unit tests for SEO metadata utilities (`__tests__/seo/metadata.test.ts`)
- [x] T019 [S0405] [P] Write unit tests for ErrorBoundary component (`__tests__/ui/ErrorBoundary.test.ts`)
- [x] T020 [S0405] [P] Write accessibility tests with testing patterns (`__tests__/accessibility/a11y.test.ts`)
- [x] T021 [S0405] Run full test suite, lint, and validate ASCII encoding

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (604 tests)
- [x] All files ASCII-encoded (localized strings excepted)
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization

Tasks marked `[P]` can be worked on simultaneously:

- T004, T005, T006: Independent utility/component files
- T012, T013: Independent SEO files (sitemap, robots)
- T018, T019, T020: Independent test files

### Task Timing

Target ~10-15 minutes per task.

### Dependencies

- T002 must complete before T012 (next-sitemap needed)
- T003 must complete before T004, T005 (directories needed)
- T004, T005 should complete before T014 (metadata utils needed)
- T006 must complete before T016 (Skeleton component needed)
- T007, T008 must complete before T016 (ErrorBoundary needed)
- T015, T016, T017 can run after their dependencies are met

### Key Technical Notes

1. **next/image**: Use `priority` for above-fold images, `loading="lazy"` for others
2. **Metadata API**: Use `generateMetadata` for dynamic pages, static export for others
3. **Sitemap**: Include all locales with proper hreflang alternates
4. **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
5. **Accessibility**: Skip link targets `#main-content`, focus visible states

### File Organization

```
lib/seo/
  metadata.ts       # generateMetadata helpers
  structured-data.ts # JSON-LD generators

components/ui/
  Skeleton.tsx      # Loading skeletons
  ErrorBoundary.tsx # Error catching
  ErrorFallback.tsx # Error UI

__tests__/
  seo/metadata.test.ts
  ui/ErrorBoundary.test.ts
  accessibility/a11y.test.ts
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
