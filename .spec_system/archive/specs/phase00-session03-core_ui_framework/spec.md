# Session Specification

**Session ID**: `phase00-session03-core_ui_framework`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2026-01-14

---

## 1. Session Overview

This session establishes the visual and interactive foundation for the Talents Acting platform. We build the core UI framework that all subsequent features will use - layout structure, navigation, reusable components, and a consistent design system based on Tailwind CSS 4.

The UI framework is critical infrastructure. Every page in the application - talent listings, profile details, registration forms, admin dashboards - will use these base components. Investing in well-designed, accessible components now prevents inconsistency and reduces development time for future sessions. We prioritize mobile-first responsive design to ensure the platform works seamlessly across devices.

We use Tailwind CSS 4 (already installed) with CSS custom properties for design tokens. Components follow a composable pattern - small, focused pieces that combine to create complex UIs. All interactive components (buttons, inputs, modals) will be Client Components while layout and structural elements can be Server Components for better performance.

---

## 2. Objectives

1. Create responsive layout structure (header, main content, footer) that adapts to all screen sizes
2. Build accessible navigation with mobile hamburger menu and keyboard support
3. Develop reusable UI component library (Button, Input, Select, Card, Modal, Loading)
4. Establish design token system for consistent colors, typography, and spacing

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session01-project_setup` - Next.js 16 framework, Tailwind CSS 4

### Required Tools/Knowledge

- Tailwind CSS 4 syntax and configuration
- React Server Components vs Client Components
- Accessible component patterns (ARIA, keyboard navigation)

### Environment Requirements

- Next.js dev server running (`npm run dev`)
- Tailwind CSS processing working

---

## 4. Scope

### In Scope (MVP)

- Base layout component (Header, Main, Footer)
- Navigation component with responsive hamburger menu
- Button component (primary, secondary, outline variants)
- Input component (text, email, password, textarea)
- Select component (dropdown)
- Card component (for displaying content blocks)
- Modal/Dialog component (for overlays)
- Loading spinner component
- Design tokens (colors, typography, spacing, breakpoints)
- Home page template demonstrating layout
- Mobile-first responsive breakpoints (375px, 768px, 1024px, 1440px)

### Out of Scope (Deferred)

- Talent-specific components (profile cards, filter panels) - _Session 05_
- Admin-specific layouts (sidebar, data tables) - _Session 06_
- Authentication forms - _Session 04_
- Advanced animations/transitions - _Later phase_
- Dark mode - _Later phase_

---

## 5. Technical Approach

### Architecture

Component-based architecture with clear separation:

- `components/layout/` - Layout components (Header, Footer, Container)
- `components/ui/` - Reusable UI primitives (Button, Input, Card, Modal)
- `app/globals.css` - Design tokens as CSS custom properties

```
components/
  layout/
    Header.tsx
    Footer.tsx
    Container.tsx
    Navigation.tsx
  ui/
    Button.tsx
    Input.tsx
    Select.tsx
    Card.tsx
    Modal.tsx
    Loading.tsx
```

### Design Patterns

- **Compound Components**: Modal with Modal.Header, Modal.Body, Modal.Footer
- **Variant Props**: Button with variant="primary|secondary|outline"
- **Forwarded Refs**: All form inputs forward refs for form libraries
- **CSS Custom Properties**: Design tokens as --color-primary, --font-size-lg, etc.

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React (lightweight icon library)
- **Components**: Custom (no UI library dependency)

---

## 6. Deliverables

### Files to Create

| File                               | Purpose                              | Est. Lines |
| ---------------------------------- | ------------------------------------ | ---------- |
| `components/layout/Header.tsx`     | Site header with logo and navigation | ~60        |
| `components/layout/Footer.tsx`     | Site footer with links               | ~40        |
| `components/layout/Container.tsx`  | Max-width content wrapper            | ~20        |
| `components/layout/Navigation.tsx` | Responsive nav with mobile menu      | ~80        |
| `components/ui/Button.tsx`         | Button with variants                 | ~50        |
| `components/ui/Input.tsx`          | Text input with label and error      | ~60        |
| `components/ui/Select.tsx`         | Dropdown select                      | ~50        |
| `components/ui/Card.tsx`           | Content card container               | ~30        |
| `components/ui/Modal.tsx`          | Dialog/modal overlay                 | ~80        |
| `components/ui/Loading.tsx`        | Loading spinner                      | ~25        |
| `components/ui/index.ts`           | Component exports                    | ~15        |
| `components/layout/index.ts`       | Layout exports                       | ~10        |

### Files to Modify

| File              | Changes                              | Est. Lines |
| ----------------- | ------------------------------------ | ---------- |
| `app/globals.css` | Add design tokens and base styles    | ~100       |
| `app/layout.tsx`  | Add Header and Footer to root layout | ~20        |
| `app/page.tsx`    | Demo home page with components       | ~50        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Layout renders correctly on mobile (375px) and desktop (1440px)
- [ ] Navigation hamburger menu opens/closes on mobile
- [ ] Navigation is keyboard-navigable (Tab, Enter, Escape)
- [ ] Button variants display correctly (primary, secondary, outline)
- [ ] Input shows label, placeholder, and error state
- [ ] Select dropdown opens and allows selection
- [ ] Card displays content with consistent styling
- [ ] Modal opens, closes, and traps focus
- [ ] Loading spinner animates smoothly
- [ ] No horizontal scroll on any viewport size

### Testing Requirements

- [ ] Visual testing at 375px, 768px, 1024px, 1440px widths
- [ ] Keyboard navigation testing for interactive elements
- [ ] All components render without console errors

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes with no errors
- [ ] Build completes successfully

---

## 8. Implementation Notes

### Key Considerations

- Use `'use client'` directive only where needed (interactive components)
- Keep Server Components for layout structure
- Design tokens should use CSS custom properties for easy theming later
- All interactive elements need focus-visible styles for accessibility

### Potential Challenges

- **Branding alignment**: Use neutral, professional color palette inspired by talent agency sites
- **Modal focus trap**: Requires careful implementation for accessibility
- **Mobile menu**: Animation and touch interactions need testing

### Color Palette (Proposed)

Based on professional talent agency aesthetics:

- Primary: Deep blue (#1a365d) - trust, professionalism
- Secondary: Gold/amber (#d69e2e) - talent, spotlight
- Neutral: Slate grays for text and backgrounds
- Success/Error: Standard green/red for feedback

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Not required for this session (UI components, visual testing more appropriate)

### Integration Tests

- Components render in layout without errors
- Navigation state changes correctly

### Manual Testing

1. Resize browser from 375px to 1440px - verify responsive behavior
2. Tab through navigation - verify focus order
3. Open modal - verify focus trap and Escape key closes
4. Test all button variants - verify visual styles
5. Test input with error state - verify error message displays
6. Test on mobile device or emulator

### Edge Cases

- Very long navigation labels
- Modal with long content (scrolling)
- Input with very long error message
- Card with minimal vs maximum content

---

## 10. Dependencies

### External Libraries

| Package      | Version | Purpose      |
| ------------ | ------- | ------------ |
| lucide-react | ^0.400+ | Icon library |

### Other Sessions

- **Depends on**: Session 01 (Project Setup), Session 02 (Database Schema - for type references)
- **Depended by**: Session 04 (Auth UI), Session 05 (Talent Profiles), Session 06 (Admin Dashboard)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
