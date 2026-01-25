# Session Specification

**Session ID**: `phase04-session05-performance_polish`
**Phase**: 04 - Data Migration & Polish
**Status**: Not Started
**Created**: 2026-01-25

---

## 1. Session Overview

This is the final session of Phase 04 and the entire Talents Acting project. With all core features implemented across 25 sessions - authentication, talent profiles, advanced filtering, media uploads, professional/company registration, payments, messaging, notifications, data migration, and internationalization - this session focuses on transforming the platform from development-complete to production-ready.

The session delivers performance optimization for fast page loads, SEO enhancements for discoverability, accessibility compliance for inclusive access, and production hardening for reliability. The goal is to achieve Lighthouse scores above 90 across all categories while ensuring the platform meets WCAG 2.1 AA standards and follows security best practices.

Upon completion, the platform will be ready for production deployment at actinginstitute.ma/talents, enabling the Acting Institute to showcase their talent database to film professionals worldwide.

---

## 2. Objectives

1. Achieve Lighthouse performance score > 90 with optimized images, lazy loading, and code splitting
2. Implement comprehensive SEO with metadata, Open Graph tags, sitemap, and robots.txt
3. Ensure WCAG 2.1 AA accessibility compliance across all pages and locales (including RTL)
4. Add production-ready error handling with error boundaries and graceful degradation

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-*` - Foundation: auth, database, UI framework, profiles, admin
- [x] `phase01-*` - Talent Management: filtering, media, search, gallery
- [x] `phase02-*` - Registration & Payments: Stripe, subscriptions, access control
- [x] `phase03-*` - Communication: messaging, collections, notifications, contact requests
- [x] `phase04-session01-schema_enhancement` - Legacy-compatible database fields
- [x] `phase04-session02-seed_data_population` - 212 predefined options
- [x] `phase04-session03-legacy_data_migration` - WordPress migration infrastructure
- [x] `phase04-session04-internationalization` - French, English, Arabic with RTL

### Required Tools/Knowledge

- Next.js Image component and Sharp optimization
- Prisma query optimization and database indexing
- next-sitemap for sitemap generation
- WCAG 2.1 accessibility guidelines
- Lighthouse performance metrics

### Environment Requirements

- Node.js 24.x with npm
- PostgreSQL database
- All 532 existing tests passing

---

## 4. Scope

### In Scope (MVP)

- Image optimization with next/image, blur placeholders, and lazy loading
- Database query optimization with strategic indexing
- SEO metadata component with dynamic Open Graph tags
- Sitemap generation with next-sitemap
- robots.txt configuration
- Error boundaries with fallback UI for all page sections
- Loading skeleton components for async content
- Accessibility audit and fixes (focus management, ARIA labels, keyboard navigation)
- RTL accessibility verification for Arabic locale
- Security headers and CSP configuration

### Out of Scope (Deferred)

- Advanced analytics integration - _Reason: Post-launch feature_
- A/B testing infrastructure - _Reason: Requires user base_
- CDN configuration - _Reason: Handled at deployment platform level_
- Service worker / offline support - _Reason: Not critical for MVP_
- Performance monitoring dashboard - _Reason: Use Vercel Analytics post-launch_

---

## 5. Technical Approach

### Architecture

The optimization layer wraps existing components without modifying core functionality. SEO metadata uses Next.js 14+ Metadata API with dynamic generation. Error boundaries provide isolation at page-section level. Loading states use CSS-based skeleton screens for zero JS overhead.

### Design Patterns

- **Metadata API**: Next.js generateMetadata for dynamic SEO
- **Error Boundary**: React error boundaries with fallback components
- **Skeleton Screens**: CSS-only loading states matching content shape
- **Progressive Enhancement**: Core functionality works without JS enhancements
- **Database Indexing**: Compound indexes on frequently filtered columns

### Technology Stack

- Next.js 16.1.1 (Image component, Metadata API)
- Sharp 0.34.5 (image optimization, already installed)
- next-sitemap 4.x (sitemap generation)
- Prisma 5.22.0 (database indexing)
- React 19.2.3 (Error Boundaries)

---

## 6. Deliverables

### Files to Create

| File                                   | Purpose                                | Est. Lines |
| -------------------------------------- | -------------------------------------- | ---------- |
| `lib/seo/metadata.ts`                  | Dynamic metadata generation utilities  | ~80        |
| `lib/seo/structured-data.ts`           | JSON-LD structured data for talents    | ~60        |
| `components/ui/Skeleton.tsx`           | Reusable skeleton loading components   | ~100       |
| `components/ui/ErrorBoundary.tsx`      | Error boundary with fallback UI        | ~80        |
| `components/ui/ErrorFallback.tsx`      | User-friendly error fallback component | ~50        |
| `app/sitemap.ts`                       | Dynamic sitemap generation             | ~60        |
| `app/robots.ts`                        | Robots.txt configuration               | ~25        |
| `prisma/migrations/*/add_indexes.sql`  | Database index migration               | ~50        |
| `__tests__/seo/metadata.test.ts`       | SEO metadata tests                     | ~80        |
| `__tests__/ui/ErrorBoundary.test.ts`   | Error boundary tests                   | ~60        |
| `__tests__/accessibility/a11y.test.ts` | Accessibility tests                    | ~100       |

### Files to Modify

| File                                   | Changes                                     | Est. Lines |
| -------------------------------------- | ------------------------------------------- | ---------- |
| `app/[locale]/layout.tsx`              | Add viewport, theme-color, security headers | ~20        |
| `app/[locale]/page.tsx`                | Add generateMetadata, structured data       | ~30        |
| `app/[locale]/talents/page.tsx`        | Add SEO, skeleton loading, error boundary   | ~40        |
| `app/[locale]/talents/[id]/page.tsx`   | Add dynamic metadata, structured data       | ~50        |
| `components/talents/TalentCard.tsx`    | Optimize images with next/image             | ~30        |
| `components/talents/TalentGallery.tsx` | Add skeleton loading states                 | ~25        |
| `components/layout/Header.tsx`         | Add skip-to-content link, ARIA labels       | ~20        |
| `prisma/schema.prisma`                 | Add database indexes                        | ~30        |
| `next.config.ts`                       | Add security headers, image domains         | ~40        |
| `middleware.ts`                        | Add security headers                        | ~20        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Lighthouse Performance score > 90 on home and gallery pages
- [ ] Lighthouse Accessibility score > 90 on all pages
- [ ] Lighthouse SEO score > 90 on all pages
- [ ] Lighthouse Best Practices score > 90 on all pages
- [ ] Sitemap accessible at /sitemap.xml with all public pages
- [ ] robots.txt accessible at /robots.txt with appropriate rules
- [ ] Error boundaries prevent full-page crashes
- [ ] Loading skeletons appear during data fetching
- [ ] All images use next/image with appropriate sizing
- [ ] Keyboard navigation works on all interactive elements
- [ ] Screen reader announces page content correctly

### Testing Requirements

- [ ] Unit tests for metadata generation
- [ ] Unit tests for error boundaries
- [ ] Accessibility tests with axe-core
- [ ] Manual Lighthouse audits on key pages
- [ ] Manual keyboard navigation testing
- [ ] Manual screen reader testing (VoiceOver/NVDA)

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] All 532+ tests passing
- [ ] No ESLint warnings or errors
- [ ] No TypeScript errors

---

## 8. Implementation Notes

### Key Considerations

- Existing images are stored locally in `public/uploads/` - optimize path handling
- next-intl adds locale prefixes to all routes - sitemap must reflect this
- RTL layout (Arabic) requires accessibility testing in both directions
- Database has ~35 migrated profiles - indexing impact is minimal but sets foundation

### Potential Challenges

- **Image optimization**: Balance quality vs file size for talent photos
- **RTL accessibility**: Ensure focus order makes sense in RTL layout
- **i18n SEO**: Generate hreflang tags for all locale variants
- **Database indexes**: Avoid over-indexing; focus on filter query patterns

### Relevant Considerations

- [P00] **Video hosting**: showreel field stores YouTube URLs - ensure OG video tags work
- [P00] **Secure login system**: Security headers protect premium data endpoints
- [P00] **Multi-language support**: hreflang tags and locale-specific metadata critical

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Metadata generation for different page types
- Structured data JSON-LD output format
- Error boundary error catching and fallback rendering
- Skeleton component rendering

### Integration Tests

- Sitemap includes all public talent profiles
- robots.txt blocks appropriate paths
- Security headers present on responses

### Manual Testing

- Run Lighthouse on: /, /[locale]/talents, /[locale]/talents/[id]
- Keyboard navigate through entire talent gallery
- Test with VoiceOver (macOS) or NVDA (Windows)
- Verify Arabic locale accessibility in RTL mode
- Check Open Graph preview in social media debuggers

### Edge Cases

- Error boundary recovery after component error
- Loading states for slow database queries
- Image fallback when upload is missing
- Metadata for talents with minimal data

---

## 10. Dependencies

### External Libraries

- `next-sitemap`: ^4.2.3 (new - sitemap generation)

### Other Sessions

- **Depends on**: All 25 previous sessions (feature-complete platform)
- **Depended by**: None (final session)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
