# Session Specification

**Session ID**: `phase04-session04-internationalization`
**Phase**: 04 - Data Migration & Polish
**Status**: Not Started
**Created**: 2026-01-25

---

## 1. Session Overview

This session implements comprehensive internationalization (i18n) for the Talents Acting platform, adding support for French, Arabic, and English languages. Morocco's market requires French as the primary business language, Arabic for local users, and English for international film productions. The implementation uses next-intl, a modern i18n library designed specifically for Next.js App Router.

A key technical challenge is Arabic's right-to-left (RTL) text direction, which requires layout mirroring and CSS logical properties. The session establishes the i18n infrastructure, creates translation files for all three languages, adds a language switcher component, and implements locale-aware formatting for dates and numbers.

User-generated content (talent profiles, messages) will remain in their original language - this session focuses on UI translations only. The goal is to make the platform fully accessible to the Moroccan market while maintaining English for international users.

---

## 2. Objectives

1. Integrate next-intl library with Next.js App Router for i18n routing and translations
2. Create complete translation files for French (primary), Arabic, and English
3. Implement RTL layout support for Arabic including mirrored UI elements
4. Add language switcher component and locale-aware date/number formatting

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session03-core_ui_framework` - Base UI components to translate
- [x] `phase01-session05-public_talent_gallery` - Public pages needing translation
- [x] `phase02-session01-professional_registration` - Registration forms to translate
- [x] `phase03-session03-notification_system` - Notification text to translate

### Required Tools/Knowledge

- next-intl library (^3.x)
- ICU message format for pluralization
- CSS logical properties for RTL support
- Understanding of Next.js App Router middleware

### Environment Requirements

- Node.js 20+ (already configured)
- Existing Next.js 16 app with App Router
- 481 tests passing before session

---

## 4. Scope

### In Scope (MVP)

- next-intl integration with Next.js App Router
- Translation files for FR, AR, EN (all UI strings)
- Language switcher in header with locale persistence
- RTL CSS support for Arabic layout
- Locale-aware date formatting (date-fns)
- Locale-aware number formatting (Intl.NumberFormat)
- Middleware for locale detection and routing
- Translated navigation, buttons, forms, and error messages

### Out of Scope (Deferred)

- Database content translation - _Reason: User profiles stay in original language_
- Machine translation - _Reason: Human translations needed for quality_
- Translation management CMS - _Reason: Static JSON files sufficient for MVP_
- Dynamic language switching without page reload - _Reason: Complexity vs benefit_

---

## 5. Technical Approach

### Architecture

```
app/
  [locale]/                    # Locale segment in URL
    layout.tsx                 # IntlProvider wrapper
    page.tsx                   # Translated pages
    (auth)/
    (dashboard)/
    talents/
    ...
i18n/
  config.ts                    # Locale configuration
  request.ts                   # Server request config for next-intl
messages/
  en.json                      # English translations
  fr.json                      # French translations (primary)
  ar.json                      # Arabic translations
components/
  language-switcher.tsx        # Language selector dropdown
middleware.ts                  # Locale detection and routing
```

### Design Patterns

- **Provider Pattern**: IntlProvider wraps app for translation context
- **Server Components**: Use getTranslations for server-side translations
- **Client Components**: Use useTranslations hook for client translations
- **Namespace Pattern**: Organize translations by feature (common, auth, talents, etc.)

### Technology Stack

- next-intl: ^3.22 - i18n for Next.js App Router
- date-fns: ^4.1.0 (existing) - Date formatting with locales
- Intl.NumberFormat: Native browser API for number formatting

---

## 6. Deliverables

### Files to Create

| File                                  | Purpose                                       | Est. Lines |
| ------------------------------------- | --------------------------------------------- | ---------- |
| `i18n/config.ts`                      | Locale configuration and utilities            | ~40        |
| `i18n/request.ts`                     | Server request configuration for next-intl    | ~25        |
| `messages/en.json`                    | English translation strings                   | ~300       |
| `messages/fr.json`                    | French translation strings (primary)          | ~300       |
| `messages/ar.json`                    | Arabic translation strings                    | ~300       |
| `components/language-switcher.tsx`    | Language selector dropdown                    | ~80        |
| `lib/format.ts`                       | Locale-aware date/number formatting utilities | ~60        |
| `app/[locale]/layout.tsx`             | Localized root layout with IntlProvider       | ~50        |
| `styles/rtl.css`                      | RTL-specific style overrides                  | ~80        |
| `__tests__/i18n/translations.test.ts` | Translation completeness tests                | ~100       |
| `__tests__/i18n/format.test.ts`       | Formatting utility tests                      | ~80        |

### Files to Modify

| File                    | Changes                          | Est. Lines |
| ----------------------- | -------------------------------- | ---------- |
| `middleware.ts`         | Add locale detection and routing | ~40        |
| `app/layout.tsx`        | Restructure for [locale] segment | ~30        |
| `components/header.tsx` | Add language switcher            | ~15        |
| `tailwind.config.ts`    | Add RTL variant support          | ~10        |
| `package.json`          | Add next-intl dependency         | ~2         |
| `next.config.ts`        | Add i18n and next-intl plugin    | ~15        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] App routes include locale prefix (/en, /fr, /ar)
- [ ] All UI text displays in selected language
- [ ] Language switcher persists selection across sessions
- [ ] Arabic pages render in RTL direction
- [ ] Dates format according to locale (DD/MM/YYYY for FR, etc.)
- [ ] Numbers format according to locale (1,234.56 vs 1 234,56)
- [ ] Missing translations fall back to English gracefully

### Testing Requirements

- [ ] Unit tests for formatting utilities
- [ ] Translation completeness tests (all keys exist in all locales)
- [ ] RTL layout visual verification
- [ ] Language switcher functionality test

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] All tests passing (481 existing + new i18n tests)

---

## 8. Implementation Notes

### Key Considerations

1. **Translation Key Organization**: Use nested namespaces by feature:
   - `common.*` - Shared UI elements (buttons, labels)
   - `auth.*` - Login, register, password reset
   - `talents.*` - Talent profiles, search, filters
   - `admin.*` - Admin dashboard, validation
   - `errors.*` - Error messages

2. **RTL Implementation**: Use CSS logical properties:
   - `margin-inline-start` instead of `margin-left`
   - `padding-inline-end` instead of `padding-right`
   - `text-align: start` instead of `text-align: left`

3. **Locale Detection Priority**:
   1. URL path (/fr/talents)
   2. Cookie (NEXT_LOCALE)
   3. Accept-Language header
   4. Default to French (primary market)

4. **ICU Message Format**: Use for pluralization and interpolation:
   ```
   "results": "{count, plural, =0 {No results} =1 {1 result} other {# results}}"
   ```

### Potential Challenges

- **Existing components**: Need to wrap all text in translation functions
- **Form validation messages**: Zod schemas need translated error messages
- **Dynamic content**: Ensure translated UI doesn't break with untranslated profile content

### Relevant Considerations

- [P00] **Multi-language support**: Originally identified as architecture concern - now implementing with proper foundation
- [P04] **Morocco market focus**: French as primary language ensures best experience for main audience

### ASCII Reminder

All output files must use ASCII-only characters (0-127). Arabic translation values can contain Unicode, but file structure and keys must be ASCII.

---

## 9. Testing Strategy

### Unit Tests

- Format utility functions (dates, numbers)
- Locale detection logic
- Translation key completeness validation

### Integration Tests

- Middleware routing for different locales
- IntlProvider context propagation
- Language switcher state persistence

### Manual Testing

- Navigate through app in each language
- Verify Arabic RTL layout renders correctly
- Check date/number formatting in forms
- Test language persistence across page refreshes

### Edge Cases

- Missing translation key (should fallback to English)
- Invalid locale in URL (should redirect to default)
- Mixed LTR/RTL content (English names in Arabic UI)
- Long translated text that may break layouts

---

## 10. Dependencies

### External Libraries

- next-intl: ^3.22 (new dependency)
- date-fns: ^4.1.0 (existing, add locale imports)

### Other Sessions

- **Depends on**: All previous sessions (translating existing UI)
- **Depended by**: phase04-session05-performance_polish (SEO metadata)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
