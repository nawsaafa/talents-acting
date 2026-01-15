# Session Specification

**Session ID**: `phase01-session02-media_upload_system`
**Phase**: 01 - Talent Management
**Status**: Not Started
**Created**: 2026-01-15

---

## 1. Session Overview

This session implements a complete media upload and management system for talent profiles. Currently, talent cards display placeholder images because there's no way for talents to upload photos. This session transforms the platform from a text database into a visual showcase where talents can present themselves through high-quality photos and video reels.

The core functionality includes a drag-and-drop photo uploader, a sortable gallery where talents can reorder their photos and set a primary headshot, and video URL embedding for YouTube/Vimeo showreels. All uploaded images are optimized server-side using Sharp for consistent sizing and fast loading.

For MVP, we'll use local file storage with the existing `/api/upload` endpoint infrastructure established in Phase 00. The system generates three image variants (thumbnail, card, full) and stores them in the public directory. This approach avoids cloud storage complexity while providing a working solution that can later be migrated to Cloudinary or S3.

---

## 2. Objectives

1. Enable talents to upload and manage photos via a drag-and-drop interface with real-time progress feedback
2. Implement server-side image processing (resize, optimize, format conversion) using Sharp
3. Provide gallery management with photo reordering, primary selection, and deletion
4. Support video URL embedding (YouTube/Vimeo) with validation and preview

---

## 3. Prerequisites

### Required Sessions
- [x] `phase00-session02-database_schema` - TalentProfile model with photo field
- [x] `phase00-session03-core_ui_framework` - UI primitives (Button, Card, Loading)
- [x] `phase00-session04-authentication` - Auth for protected upload routes
- [x] `phase00-session05-talent_profile_foundation` - Profile edit page structure

### Required Tools/Knowledge
- Sharp for Node.js image processing
- React file upload patterns
- Next.js API routes for file handling

### Environment Requirements
- Node.js 20+ (Sharp compatibility)
- Write access to public directory
- Sufficient disk space for image storage

---

## 4. Scope

### In Scope (MVP)
- Photo upload with drag-and-drop (JPEG, PNG, WebP support)
- Upload progress indicator with percentage
- Server-side image processing (Sharp: resize to 3 variants)
- Gallery display with reorder capability
- Primary photo selection for talent card
- Photo deletion with confirmation
- Max 10 photos per talent
- File validation (type, size 5MB limit)
- Video URL embedding (YouTube, Vimeo)
- URL validation and embed preview
- Local file storage in public directory

### Out of Scope (Deferred)
- Cloud storage (Cloudinary, S3) - *Reason: adds complexity, migrate when needed*
- Video file upload - *Reason: use external hosting (YouTube/Vimeo)*
- AI-powered image tagging - *Reason: not essential for MVP*
- Face detection/auto-cropping - *Reason: manual cropping sufficient*
- Watermarking - *Reason: not required by stakeholders*
- Chunked uploads - *Reason: 5MB limit makes this unnecessary*

---

## 5. Technical Approach

### Architecture

```
app/dashboard/profile/
    |
    +-- media/
    |       +-- page.tsx (Server Component - loads profile, renders MediaGallery)
    |
components/media/
    |
    +-- MediaGallery.tsx (Client - main container)
    +-- PhotoUploader.tsx (Client - drag-drop upload zone)
    +-- PhotoGrid.tsx (Client - sortable gallery grid)
    +-- PhotoCard.tsx (Client - individual photo with actions)
    +-- VideoEmbed.tsx (Client - YouTube/Vimeo embed)
    +-- VideoUrlInput.tsx (Client - URL input with validation)

lib/media/
    +-- upload.ts (upload action, image processing)
    +-- validation.ts (file/URL validation schemas)
    +-- video-utils.ts (extract video ID, generate embed URL)

api/upload/
    +-- route.ts (existing, extend for images)
```

### Design Patterns
- **Server Actions**: Use Next.js server actions for upload handling
- **Optimistic UI**: Show upload progress immediately, update on completion
- **Progressive Enhancement**: Basic file input fallback if drag-drop fails
- **Controlled Components**: Photo order managed via state, synced to server

### Technology Stack
- Next.js 16 App Router (Server Actions, API routes)
- React 19 (useTransition for upload state)
- Sharp 0.33+ (image processing)
- Zod (validation schemas)
- Tailwind CSS 4 (styling)
- Lucide React (icons)

---

## 6. Deliverables

### Files to Create
| File | Purpose | Est. Lines |
|------|---------|------------|
| `app/dashboard/profile/media/page.tsx` | Media management page | ~50 |
| `components/media/MediaGallery.tsx` | Main container for photos/videos | ~120 |
| `components/media/PhotoUploader.tsx` | Drag-drop upload zone | ~100 |
| `components/media/PhotoGrid.tsx` | Sortable photo grid | ~80 |
| `components/media/PhotoCard.tsx` | Individual photo with actions | ~70 |
| `components/media/VideoEmbed.tsx` | YouTube/Vimeo embed component | ~60 |
| `components/media/VideoUrlInput.tsx` | URL input with validation | ~80 |
| `components/media/index.ts` | Barrel exports | ~10 |
| `lib/media/upload.ts` | Upload server action, Sharp processing | ~150 |
| `lib/media/validation.ts` | File and URL validation schemas | ~50 |
| `lib/media/video-utils.ts` | Video ID extraction, embed URLs | ~60 |

### Files to Modify
| File | Changes | Est. Lines |
|------|---------|------------|
| `prisma/schema.prisma` | Add photos array, videoUrls to TalentProfile | ~10 |
| `app/dashboard/profile/page.tsx` | Add link to media management | ~5 |
| `components/talents/TalentCard.tsx` | Use photo from profile | ~10 |
| `lib/talents/queries.ts` | Include photos in talent queries | ~5 |

---

## 7. Success Criteria

### Functional Requirements
- [ ] Talents can drag-drop photos to upload
- [ ] Upload shows progress percentage
- [ ] Photos are resized to 3 variants (thumbnail, card, full)
- [ ] Gallery displays all photos in grid
- [ ] Photos can be reordered via drag-drop
- [ ] One photo can be set as primary (appears on talent card)
- [ ] Photos can be deleted with confirmation
- [ ] Maximum 10 photos enforced
- [ ] Invalid files rejected with clear error
- [ ] Video URLs from YouTube/Vimeo work
- [ ] Video embeds show preview
- [ ] Primary photo appears on TalentCard

### Testing Requirements
- [ ] Manual testing of upload flow
- [ ] Test file validation (wrong type, too large)
- [ ] Test video URL validation
- [ ] Test on mobile viewport

### Quality Gates
- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] ESLint passes with 0 errors
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Code follows project conventions

---

## 8. Implementation Notes

### Key Considerations
- Use Sharp for server-side processing (lighter than ImageMagick)
- Generate 3 sizes on upload to avoid runtime processing
- Store in `/public/uploads/talents/[userId]/` for direct serving
- EXIF data automatically stripped by Sharp
- File names use UUID to avoid conflicts

### Potential Challenges
- **Browser Drag-Drop API**: Varies across browsers, need fallback
  - *Mitigation*: Include traditional file input as fallback
- **Large File Uploads**: May timeout on slow connections
  - *Mitigation*: 5MB limit, show clear progress
- **Image Processing Time**: Sharp can be slow for large images
  - *Mitigation*: Show processing state after upload completes
- **Concurrent Uploads**: Multiple files at once
  - *Mitigation*: Queue uploads, process one at a time

### Relevant Considerations
- [P00] **Image/video upload security**: Validate file type server-side using magic bytes, not just extension. Strip EXIF. Sanitize filenames.
- [P00] **Video hosting**: Use embed URLs only - avoid hosting video files directly.

### ASCII Reminder
All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests
- Not required for MVP (per project scope)

### Integration Tests
- Not required for MVP (per project scope)

### Manual Testing
1. Upload single photo via drag-drop, verify progress and completion
2. Upload multiple photos, verify queue processing
3. Attempt upload of invalid file type (PDF), verify rejection
4. Attempt upload of oversized file (>5MB), verify rejection
5. Reorder photos via drag-drop, verify order persists
6. Set a photo as primary, verify it appears on talent card
7. Delete a photo, verify removal and confirmation
8. Add YouTube URL, verify embed preview
9. Add Vimeo URL, verify embed preview
10. Add invalid video URL, verify error message
11. Test on mobile viewport (touch interactions)

### Edge Cases
- Upload exactly 10 photos, then try 11th (should reject)
- Delete primary photo (should auto-select next or clear)
- Upload with special characters in filename
- Very long filename handling
- Portrait vs landscape image handling
- Animated GIF handling (should convert to static)

---

## 10. Dependencies

### External Libraries
- `sharp`: ^0.33.0 (image processing)
- `uuid`: ^9.0.0 (filename generation - already installed)
- `zod`: ^4.3.5 (validation - already installed)

### Other Sessions
- **Depends on**: Phase 00 (database, auth, UI), Session 01 (talent listing)
- **Depended by**: Session 05 (Public Talent Gallery)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
