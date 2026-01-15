# Task Checklist

**Session ID**: `phase01-session02-media_upload_system`
**Total Tasks**: 20
**Estimated Duration**: 3-4 hours
**Created**: 2026-01-15

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0102]` = Session reference (Phase 01, Session 02)
- `TNNN` = Task ID

---

## Progress Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| Foundation | 5 | 5 | 0 |
| Implementation | 9 | 9 | 0 |
| Testing | 3 | 3 | 0 |
| **Total** | **20** | **20** | **0** |

---

## Setup (3 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0102] Install Sharp dependency for image processing (`package.json`)
- [x] T002 [S0102] Create directory structure for media components and lib (`components/media/`, `lib/media/`)
- [x] T003 [S0102] Create public uploads directory structure (`public/uploads/talents/`)

---

## Foundation (5 tasks)

Core structures, schemas, and utilities.

- [x] T004 [S0102] Update Prisma schema with photos array and videoUrls fields (`prisma/schema.prisma`)
- [x] T005 [S0102] [P] Create file and URL validation schemas with Zod (`lib/media/validation.ts`)
- [x] T006 [S0102] [P] Create video URL utilities for YouTube/Vimeo extraction (`lib/media/video-utils.ts`)
- [x] T007 [S0102] Implement upload server action with Sharp image processing (`lib/media/upload.ts`)
- [x] T008 [S0102] Create barrel exports for media components (`components/media/index.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T009 [S0102] [P] Create PhotoCard component with actions (delete, set primary) (`components/media/PhotoCard.tsx`)
- [x] T010 [S0102] [P] Create VideoEmbed component for YouTube/Vimeo (`components/media/VideoEmbed.tsx`)
- [x] T011 [S0102] [P] Create VideoUrlInput component with validation (`components/media/VideoUrlInput.tsx`)
- [x] T012 [S0102] Create PhotoUploader component with drag-drop support (`components/media/PhotoUploader.tsx`)
- [x] T013 [S0102] Create PhotoGrid component with reorder capability (`components/media/PhotoGrid.tsx`)
- [x] T014 [S0102] Create MediaGallery container component (`components/media/MediaGallery.tsx`)
- [x] T015 [S0102] Create media management page (`app/dashboard/profile/media/page.tsx`)
- [x] T016 [S0102] Update profile page with link to media management (`app/dashboard/profile/page.tsx`)
- [x] T017 [S0102] Update TalentCard to display primary photo from profile (`components/talents/TalentCard.tsx`)

---

## Testing (3 tasks)

Verification and quality assurance.

- [x] T018 [S0102] Update talent queries to include photos in responses (`lib/talents/queries.ts`)
- [x] T019 [S0102] Run ESLint and fix any errors (`npm run lint`)
- [x] T020 [S0102] Run build and verify no TypeScript errors (`npm run build`)

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] ESLint passes with 0 errors
- [ ] Build succeeds with no TypeScript errors
- [ ] All files ASCII-encoded
- [ ] implementation-notes.md updated
- [ ] Manual testing completed (upload, reorder, delete, video embed)
- [ ] Ready for `/validate`

---

## Notes

### Parallelization
Tasks marked `[P]` can be worked on simultaneously:
- T005, T006: Validation and video utilities are independent
- T009, T010, T011: Individual UI components with no dependencies

### Task Timing
Target ~10-15 minutes per task.

### Dependencies
- T004 (schema) must complete before T007 (upload action)
- T005-T008 (foundation) must complete before T09-T17 (implementation)
- T12 depends on T05 (validation schemas)
- T13 depends on T09 (PhotoCard)
- T14 depends on T09-T13 (all sub-components)
- T15 depends on T14 (MediaGallery)

### Manual Testing Checklist
After implementation, verify:
1. Upload single photo via drag-drop
2. Upload multiple photos, verify queue processing
3. Reject invalid file type (PDF)
4. Reject oversized file (>5MB)
5. Reorder photos via drag-drop
6. Set photo as primary
7. Delete photo with confirmation
8. Add YouTube URL, verify embed
9. Add Vimeo URL, verify embed
10. Reject invalid video URL

---

## Next Steps

Run `/implement` to begin AI-led implementation.
