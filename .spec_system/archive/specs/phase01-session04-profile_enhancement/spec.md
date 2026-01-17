# Session Specification

**Session ID**: `phase01-session04-profile_enhancement`
**Phase**: 01 - Talent Management
**Status**: Not Started
**Created**: 2026-01-16

---

## 1. Session Overview

This session enhances the talent profile editing experience with a guided wizard flow, progress tracking, and streamlined editing capabilities. The current ProfileForm component is a single long form with collapsible sections - functional but not optimized for the talent onboarding experience.

The enhancement transforms profile creation into a multi-step wizard that guides talents through logical groupings of fields (basic info, physical attributes, skills, media, professional details). A profile completeness indicator motivates talents to fill in more fields, while inline editing allows quick updates without navigating away from the profile view.

This session is critical before Session 05 (Public Gallery) because polished, complete profiles make for a better showcase. By improving how talents create and maintain their profiles, we improve the quality of data in the database.

---

## 2. Objectives

1. Transform the existing single-form profile editing into a multi-step wizard with clear progress indication
2. Implement a profile completeness indicator that calculates and displays completion percentage
3. Add inline editing capability for quick field updates directly from the profile view page
4. Create a profile preview mode showing how the profile appears to visitors and professionals

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session05-talent_profile_foundation` - ProfileForm, profile CRUD
- [x] `phase01-session02-media_upload_system` - PhotoUpload component, image handling

### Required Tools/Knowledge

- React state management for multi-step forms
- Zod validation with partial schemas
- Server actions for optimistic updates

### Environment Requirements

- PostgreSQL database with TalentProfile model
- Next.js 16+ with App Router
- Node.js 18+

---

## 4. Scope

### In Scope (MVP)

- Multi-step wizard with 5 steps (Basic, Physical, Skills, Media, Professional)
- Step navigation with validation per step
- Profile completeness calculation and display (percentage + missing fields)
- Inline editing for text fields on profile view page
- Profile preview showing public vs premium views
- Progress persistence (can leave and return to wizard)

### Out of Scope (Deferred)

- AI-assisted profile writing - _Reason: Requires AI integration, complexity_
- Auto-save with debounce - _Reason: Start with explicit save, add later_
- Bulk profile operations - _Reason: Admin feature, not talent-facing_
- Profile templates - _Reason: Complexity, unclear value_
- Draft/published states - _Reason: Validation workflow already handles this_

---

## 5. Technical Approach

### Architecture

```
ProfileWizard (Client Component)
    |
    +-- WizardNav (step indicators)
    |
    +-- WizardStep (renders current step form)
    |       |
    |       +-- BasicInfoStep
    |       +-- PhysicalAttributesStep
    |       +-- SkillsStep
    |       +-- MediaStep
    |       +-- ProfessionalStep
    |
    +-- WizardActions (prev/next/save buttons)

ProfileCompleteness (utility)
    |
    +-- calculateCompleteness(profile) -> { percentage, missingFields }

InlineEdit (Client Component)
    +-- Renders field value, click to edit
    +-- Uses optimistic update pattern
```

### Design Patterns

- **Wizard Pattern**: Multi-step form with validation gates between steps
- **Optimistic UI**: Inline edits show immediately, revert on error
- **Compound Components**: Wizard composed of step components sharing context
- **Progressive Enhancement**: Works without JS for initial render

### Technology Stack

- React 19 with Server Components and Client Components
- Zod for step-level validation schemas
- Server Actions for form submission
- localStorage for wizard progress persistence

---

## 6. Deliverables

### Files to Create

| File                                                  | Purpose                        | Est. Lines |
| ----------------------------------------------------- | ------------------------------ | ---------- |
| `components/profile/ProfileWizard.tsx`                | Multi-step wizard container    | ~150       |
| `components/profile/WizardNav.tsx`                    | Step indicator navigation      | ~80        |
| `components/profile/WizardStep.tsx`                   | Step wrapper with context      | ~60        |
| `components/profile/steps/BasicInfoStep.tsx`          | Name, contact, location        | ~100       |
| `components/profile/steps/PhysicalAttributesStep.tsx` | Height, physique, coloring     | ~120       |
| `components/profile/steps/SkillsStep.tsx`             | Languages, skills, accents     | ~130       |
| `components/profile/steps/MediaStep.tsx`              | Photos, videos integration     | ~80        |
| `components/profile/steps/ProfessionalStep.tsx`       | Rates, availability, bio       | ~100       |
| `components/profile/InlineEdit.tsx`                   | Click-to-edit field component  | ~90        |
| `components/profile/ProfileCompleteness.tsx`          | Completeness indicator UI      | ~70        |
| `components/profile/ProfilePreview.tsx`               | Preview public/premium views   | ~100       |
| `components/profile/index.ts`                         | Barrel exports                 | ~10        |
| `lib/profile/completeness.ts`                         | Completeness calculation logic | ~80        |
| `lib/profile/wizard-validation.ts`                    | Step-specific Zod schemas      | ~100       |

### Files to Modify

| File                                  | Changes                                  | Est. Lines |
| ------------------------------------- | ---------------------------------------- | ---------- |
| `app/dashboard/profile/edit/page.tsx` | Use ProfileWizard instead of ProfileForm | ~20        |
| `app/dashboard/profile/page.tsx`      | Add InlineEdit, ProfileCompleteness      | ~40        |
| `lib/talents/actions.ts`              | Add inline update action                 | ~30        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Wizard displays 5 steps with clear progress indication
- [ ] Users can navigate between steps with prev/next buttons
- [ ] Validation runs on step transition, blocks if errors
- [ ] Completeness percentage updates as fields are filled
- [ ] Missing fields list shows what's needed for 100%
- [ ] Inline editing works for text fields (click, edit, save)
- [ ] Preview shows how profile looks to public vs premium users
- [ ] Wizard progress persists if user navigates away

### Testing Requirements

- [ ] Manual testing of all wizard steps
- [ ] Test validation on each step transition
- [ ] Test inline edit save and error handling
- [ ] Test preview toggle (public/premium views)
- [ ] Test on mobile viewport

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes with 0 errors
- [ ] Build succeeds with no TypeScript errors
- [ ] Code follows project conventions

---

## 8. Implementation Notes

### Key Considerations

- Reuse existing ProfileForm field components where possible
- Wizard state stored in React state, persisted to localStorage
- Inline edit uses optimistic updates with server action
- Completeness calculation runs client-side for instant feedback

### Potential Challenges

- **Challenge**: Multi-step validation with Zod
  - **Mitigation**: Create separate schemas per step, compose for final submission
- **Challenge**: Wizard state persistence
  - **Mitigation**: Use localStorage with JSON serialization, clear on successful save
- **Challenge**: Inline edit UX
  - **Mitigation**: Clear visual affordance (hover state), Escape to cancel

### Relevant Considerations

- [P00] **Tiered access**: Preview mode must accurately show public vs premium field visibility
- [P00] **Admin validation**: Saved changes still require admin approval before going public

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Completeness calculation with various profile states
- Step validation schema edge cases

### Integration Tests

- Not required for MVP (manual testing)

### Manual Testing

1. Complete wizard flow from empty profile
2. Edit existing profile through wizard
3. Navigate away and return (progress persisted)
4. Inline edit a field successfully
5. Inline edit with validation error
6. Preview profile in public mode
7. Preview profile in premium mode
8. Test wizard on mobile viewport
9. Test with partially complete profile

### Edge Cases

- Empty profile (new talent)
- Profile with validation errors from previous schema
- Very long bio text in inline edit
- Rapid step navigation
- Network error during save

---

## 10. Dependencies

### External Libraries

- None new (uses existing Zod, React)

### Other Sessions

- **Depends on**: phase01-session02-media_upload_system (PhotoUpload component)
- **Depended by**: phase01-session05-public_talent_gallery (profiles should be polished)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
