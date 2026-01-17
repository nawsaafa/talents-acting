# Task Checklist

**Session ID**: `phase01-session05-public_talent_gallery`
**Total Tasks**: 20
**Estimated Duration**: 2-3 hours
**Created**: 2026-01-16

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0105]` = Session reference (Phase 01, Session 05)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 2      | 2      | 0         |
| Foundation     | 4      | 4      | 0         |
| Implementation | 8      | 8      | 0         |
| Integration    | 2      | 2      | 0         |
| Testing        | 4      | 4      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (2 tasks)

Initial configuration and directory preparation.

- [x] T001 [S0105] Create gallery components directory (`components/gallery/`)
- [x] T002 [S0105] Add `loadMoreTalents` server action signature (`lib/talents/actions.ts`)

---

## Foundation (4 tasks)

Core components that other components depend on.

- [x] T003 [S0105] [P] Create ViewToggle component with grid/list icons (`components/gallery/ViewToggle.tsx`)
- [x] T004 [S0105] [P] Create InfiniteScrollLoader with Intersection Observer (`components/gallery/InfiniteScrollLoader.tsx`)
- [x] T005 [S0105] Implement `loadMoreTalents` server action logic (`lib/talents/actions.ts`)
- [x] T006 [S0105] Create barrel exports file (`components/gallery/index.ts`)

---

## Implementation (8 tasks)

Main feature implementation.

- [x] T007 [S0105] Create TalentCardEnhanced with hover overlay (`components/gallery/TalentCardEnhanced.tsx`)
- [x] T008 [S0105] Add quick view button and action handler to TalentCardEnhanced (`components/gallery/TalentCardEnhanced.tsx`)
- [x] T009 [S0105] Create TalentListItem horizontal layout (`components/gallery/TalentListItem.tsx`)
- [x] T010 [S0105] Add mobile-responsive stacking to TalentListItem (`components/gallery/TalentListItem.tsx`)
- [x] T011 [S0105] Create QuickViewModal with photo display (`components/gallery/QuickViewModal.tsx`)
- [x] T012 [S0105] Add photo carousel navigation to QuickViewModal (`components/gallery/QuickViewModal.tsx`)
- [x] T013 [S0105] Create TalentGallery container with state management (`components/gallery/TalentGallery.tsx`)
- [x] T014 [S0105] Integrate infinite scroll and view toggle in TalentGallery (`components/gallery/TalentGallery.tsx`)

---

## Integration (2 tasks)

Connecting gallery to the main page.

- [x] T015 [S0105] Update talents page to use TalentGallery (`app/talents/page.tsx`)
- [x] T016 [S0105] Remove old pagination and add ViewToggle to page header (`app/talents/page.tsx`)

---

## Testing (4 tasks)

Verification and quality assurance.

- [x] T017 [S0105] Run ESLint and fix any errors (`npm run lint`)
- [x] T018 [S0105] Run build and verify no TypeScript errors (`npm run build`)
- [x] T019 [S0105] Validate ASCII encoding on all new files
- [x] T020 [S0105] Manual testing per spec checklist

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] All tests passing
- [ ] All files ASCII-encoded
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Tasks T003 and T004 can be worked on simultaneously as they have no dependencies.

### Task Timing

Target ~10-15 minutes per task.

### Dependencies

- T005 depends on T002 (signature first, then logic)
- T007-T012 depend on T003-T006 (foundation components)
- T013-T014 depend on T007-T012 (need all components)
- T015-T016 depend on T013-T014 (need TalentGallery)

### Key Patterns to Follow

- Use existing TalentCard as reference for styling
- Match Modal primitive usage from other components
- Follow SearchBar pattern for URL param sync
- Use Loading component for loading states

---

## Manual Testing Checklist

From spec.md - verify during T020:

- [ ] Grid view displays talents in responsive grid
- [ ] List view displays talents in horizontal rows
- [ ] View toggle switches between modes
- [ ] View preference persists in URL
- [ ] Infinite scroll loads more talents
- [ ] Loading indicator shows during fetch
- [ ] "No more results" shows when exhausted
- [ ] Quick view opens on button click
- [ ] Quick view shows talent details
- [ ] Photo carousel works with multiple photos
- [ ] "View Full Profile" navigates correctly
- [ ] Escape closes quick view modal
- [ ] Filter changes reset the gallery
- [ ] Search changes reset the gallery
- [ ] Mobile: single column grid
- [ ] Mobile: quick view fullscreen
- [ ] Keyboard navigation works
- [ ] No layout shift on load

---

## Next Steps

Run `/implement` to begin AI-led implementation.
