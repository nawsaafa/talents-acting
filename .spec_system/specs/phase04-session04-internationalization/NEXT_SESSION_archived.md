# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-25
**Project State**: Phase 04 - Data Migration & Polish
**Completed Sessions**: 24

---

## Recommended Next Session

**Session ID**: `phase04-session04-internationalization`
**Session Name**: Internationalization
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~18

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation (Complete)
- [x] Phase 01: Talent Management (Complete)
- [x] Phase 02: Registration & Payments (Complete)
- [x] Phase 03: Communication & Engagement (Complete)
- [x] Phase 04 Session 01: Schema Enhancement (Complete)
- [x] Phase 04 Session 02: Seed Data Population (Complete)
- [x] Phase 04 Session 03: Legacy Data Migration (Complete)

### Dependencies

- **Builds on**: All existing UI components and pages
- **Enables**: Production launch for Moroccan market (French, Arabic, English)

### Project Progression

With 24 sessions complete and 481 tests passing, the platform is feature-complete. The legacy WordPress data migration infrastructure is ready. This session adds multi-language support essential for the Moroccan market where French is the primary business language, Arabic is local, and English serves international productions. RTL support for Arabic is a key accessibility requirement.

---

## Session Overview

### Objective

Add comprehensive internationalization (i18n) support with French, Arabic, and English translations, including RTL layout support for Arabic.

### Key Deliverables

1. next-intl or similar i18n framework integration
2. French translations (primary market - complete coverage)
3. Arabic translations with RTL support (local market)
4. English translations (international productions)
5. Language switcher component in header
6. Locale-aware date/number formatting
7. Middleware for locale detection and routing

### Scope Summary

- **In Scope (MVP)**: UI text translations, language switcher, RTL CSS, locale routing, date/number formatting
- **Out of Scope**: Database content translation (profiles stay in original language), machine translation, translation management CMS

---

## Technical Considerations

### Technologies/Patterns

- **next-intl**: Modern i18n library for Next.js App Router
- **CSS logical properties**: For RTL support (start/end vs left/right)
- **Middleware**: Locale detection and routing
- **ICU message format**: For pluralization and interpolation

### Potential Challenges

1. **RTL layout**: Arabic requires right-to-left text direction and mirrored layouts
2. **Dynamic content**: User-generated content (profiles) won't be translated
3. **Translation completeness**: Need to ensure all UI strings are extracted
4. **Date/number formatting**: Different locales expect different formats

### Relevant Considerations

- [P00] **Multi-language support**: This was identified in Phase 00 as an architecture concern - now being implemented
- [P04] **Morocco market focus**: French primary, Arabic local, English international

---

## Alternative Sessions

If this session is blocked:

1. **phase04-session05-performance_polish** - Can proceed without i18n if translation resources unavailable
2. **Return to migration testing** - Run actual WordPress data migration with production data

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
