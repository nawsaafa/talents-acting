# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-14
**Project State**: Phase 00 - Foundation
**Completed Sessions**: 2/6

---

## Recommended Next Session

**Session ID**: `phase00-session03-core_ui_framework`
**Session Name**: Core UI Framework
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: ~15

---

## Why This Session Next?

### Prerequisites Met
- [x] Session 01 completed (Next.js 16 frontend framework running)
- [x] Session 02 completed (Database schema available for type references)

### Dependencies
- **Builds on**: Session 01 (Project Setup) - uses Next.js App Router
- **Enables**: Session 04 (Authentication UI), Session 05 (Talent Profiles), Session 06 (Admin Dashboard)

### Project Progression
Core UI Framework is the natural next step after database schema. With the data layer complete, we now need the presentation layer foundation. All subsequent sessions (auth forms, talent cards, admin tables) will use these base components. Building UI components before feature-specific work prevents code duplication and ensures visual consistency.

---

## Session Overview

### Objective
Create the responsive UI foundation including layout components, navigation, styling system, and reusable components that will be used throughout the application.

### Key Deliverables
1. Base layout component (header, main, footer)
2. Navigation with responsive menu
3. UI component library (Button, Input, Card, Modal)
4. Tailwind design tokens (colors, spacing, typography)
5. Responsive page templates

### Scope Summary
- **In Scope (MVP)**: Layout, navigation, buttons, inputs, cards, modals, loading states, responsive breakpoints
- **Out of Scope**: Talent-specific components (Session 05), Admin layouts (Session 06), animations

---

## Technical Considerations

### Technologies/Patterns
- Tailwind CSS 4 (already installed in Session 01)
- React Server Components for layout
- Client Components for interactive elements
- CSS custom properties for design tokens
- Mobile-first responsive design

### Potential Challenges
- **Branding alignment**: Need to match actinginstitute.ma aesthetic without full design specs
- **Component API design**: Balance flexibility with simplicity for reusable components
- **Accessibility**: Ensure keyboard navigation and screen reader support

---

## Alternative Sessions

If this session is blocked:
1. **Session 04 (Authentication)** - Could proceed with basic UI, but would lack consistent styling
2. **Session 05 (Talent Profile)** - Requires UI components for profile cards and forms

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
