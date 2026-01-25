# Task Checklist

**Session ID**: `phase04-session04-internationalization`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-25

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0404]` = Session reference (Phase 04, Session 04)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 3      | 3      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 8      | 8      | 0         |
| Testing        | 4      | 4      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0404] Verify prerequisites (481 tests passing, Next.js 16 configured)
- [x] T002 [S0404] Install next-intl and create directory structure (`i18n/`, `messages/`)
- [x] T003 [S0404] Update next.config.ts with next-intl plugin configuration

---

## Foundation (5 tasks)

Core i18n infrastructure and configuration.

- [x] T004 [S0404] Create locale configuration with supported locales and defaults (`i18n/config.ts`)
- [x] T005 [S0404] Create server request configuration for next-intl (`i18n/request.ts`)
- [x] T006 [S0404] Create locale-aware date and number formatting utilities (`lib/format.ts`)
- [x] T007 [S0404] Update middleware with locale detection and routing (`middleware.ts`)
- [x] T008 [S0404] Add RTL variant support to Tailwind configuration (`app/globals.css`)

---

## Implementation (8 tasks)

Translation files, components, and UI integration.

- [x] T009 [S0404] [P] Create English translation file with all namespaces (`messages/en.json`)
- [x] T010 [S0404] [P] Create French translation file - primary market (`messages/fr.json`)
- [x] T011 [S0404] [P] Create Arabic translation file with RTL markers (`messages/ar.json`)
- [x] T012 [S0404] Create localized root layout with IntlProvider (`app/[locale]/layout.tsx`)
- [x] T013 [S0404] Restructure app layout for [locale] segment (`app/layout.tsx`)
- [x] T014 [S0404] Create RTL-specific style overrides for Arabic (`styles/rtl.css`)
- [x] T015 [S0404] Create language switcher dropdown component (`components/layout/LanguageSwitcher.tsx`)
- [x] T016 [S0404] Integrate language switcher into header (`components/layout/Header.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0404] [P] Write unit tests for formatting utilities (`__tests__/i18n/format.test.ts`)
- [x] T018 [S0404] [P] Write translation completeness tests (`__tests__/i18n/translations.test.ts`)
- [x] T019 [S0404] Run full test suite and verify all tests passing
- [x] T020 [S0404] Validate ASCII encoding and lint on all new files

---

## Completion Checklist

Before marking session complete:

- [x] All tasks marked `[x]`
- [x] All tests passing (532 tests - 481 existing + 51 new i18n tests)
- [x] All files ASCII-encoded (except intentional Unicode in ar.json and locale names)
- [x] implementation-notes.md updated
- [x] Ready for `/validate`

---

## Notes

### Parallelization

Tasks marked `[P]` can be worked on simultaneously:

- T009, T010, T011: Translation files are independent
- T017, T018: Test files for different modules

### Task Timing

Target ~15-20 minutes per task.

### Dependencies

- T002 must complete before T003-T008 (directories needed)
- T004, T005 must complete before T007 (config needed for middleware)
- T004-T008 must complete before T009-T016 (foundation before implementation)
- T009-T011 can run in parallel (independent translation files)
- T012 depends on T009-T011 (layout needs translation files)
- T013 depends on T012 (restructure after new layout exists)
- T015 must complete before T016 (component before integration)

### Key Technical Notes

1. **Translation Namespaces**: Use `common`, `auth`, `talents`, `admin`, `errors`
2. **RTL Support**: CSS logical properties (margin-inline-start, etc.)
3. **Locale Priority**: URL path > Cookie > Accept-Language > French default
4. **ICU Format**: Use for pluralization (`{count, plural, ...}`)

### Translation Key Structure

```json
{
  "common": { "buttons": {}, "labels": {}, "navigation": {} },
  "auth": { "login": {}, "register": {}, "errors": {} },
  "talents": { "profile": {}, "search": {}, "filters": {} },
  "admin": { "dashboard": {}, "validation": {} },
  "errors": { "general": {}, "validation": {}, "network": {} }
}
```

---

## Next Steps

Run `/implement` to begin AI-led implementation.
