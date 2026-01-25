# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-25
**Project State**: Phase 04 - Data Migration & Polish
**Completed Sessions**: 25

---

## Recommended Next Session

**Session ID**: `phase04-session05-performance_polish`
**Session Name**: Performance & Polish
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~20

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00-03: All foundation and feature work complete
- [x] Schema Enhancement (Session 01): Database fields optimized
- [x] Seed Data Population (Session 02): 212 predefined options available
- [x] Legacy Data Migration (Session 03): Migration infrastructure ready
- [x] Internationalization (Session 04): Multi-language support with 3 locales

### Dependencies

- **Builds on**: All 25 previous sessions - this is the final polish layer
- **Enables**: Production launch, marketing, user acquisition

### Project Progression

This is the **final session** of Phase 04 and the entire project. All features are implemented:

- Authentication and role-based access control
- Talent profiles with comprehensive filtering
- Professional and company registration with payments
- Messaging, notifications, and contact requests
- Data migration from legacy WordPress system
- Internationalization (French, English, Arabic)

Session 05 focuses on production readiness: performance optimization, SEO, accessibility, and final security hardening. This transforms the platform from development-complete to production-ready.

---

## Session Overview

### Objective

Optimize performance, enhance SEO, ensure accessibility compliance, and prepare the platform for production deployment.

### Key Deliverables

1. Image optimization with next/image and sharp integration
2. Database query optimization with strategic indexing
3. SEO metadata, Open Graph tags, sitemap, and robots.txt
4. Error boundary improvements and loading states
5. Accessibility audit and WCAG compliance fixes
6. Final security review and production hardening

### Scope Summary

- **In Scope (MVP)**: Lighthouse score > 90, Core Web Vitals optimization, basic SEO, accessibility fixes, error handling improvements
- **Out of Scope**: Advanced analytics, A/B testing, CDN configuration (handled at deployment)

---

## Technical Considerations

### Technologies/Patterns

- Next.js Image component with blur placeholders
- Prisma query optimization and indexing
- next-sitemap for sitemap generation
- React Error Boundaries with fallback UI
- CSS skeleton screens for loading states
- ARIA attributes for accessibility

### Potential Challenges

- Identifying slow database queries across 532 tests
- Balancing image quality vs. file size
- RTL accessibility testing for Arabic locale
- Maintaining performance with i18n overhead

### Relevant Considerations

- [P00] **Video hosting**: Document current showreel URL approach for SEO
- [P00] **Secure login system**: Final security review for premium data protection
- [P00] **Multi-language support**: Ensure i18n doesn't impact Core Web Vitals

---

## Alternative Sessions

No alternatives - this is the final session of Phase 04.

If blocked, consider:

1. **Partial implementation** - Focus on SEO and accessibility first
2. **Deploy without polish** - Launch MVP, iterate on performance post-launch

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
