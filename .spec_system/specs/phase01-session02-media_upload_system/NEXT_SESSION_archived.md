# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-15
**Project State**: Phase 01 - Talent Management
**Completed Sessions**: 7 (6 from Phase 00, 1 from Phase 01)

---

## Recommended Next Session

**Session ID**: `phase01-session02-media_upload_system`
**Session Name**: Media Upload System
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~20

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00 complete (database, auth, UI primitives)
- [x] Phase 01 Session 01: Advanced Filtering (talent listing infrastructure)

### Dependencies

- **Builds on**: Session 01's talent profile display (cards show photos)
- **Enables**: Session 05 Public Talent Gallery (needs media to showcase)

### Project Progression

Media upload is the natural next step after filtering. With filtering complete, users can find talents - now they need rich media content to evaluate them. Photos and videos are core to a talent platform; without them, talent cards show placeholder images. This session transforms the platform from a text database to a visual showcase.

---

## Session Overview

### Objective

Enable talents to upload and manage photos and videos for their profiles, creating a rich media gallery that showcases their work and appearance.

### Key Deliverables

1. Photo upload with drag-and-drop support
2. Gallery management (reorder, delete, set primary photo)
3. Image optimization and cloud storage
4. YouTube/Vimeo video embedding
5. Upload progress indicators

### Scope Summary

- **In Scope (MVP)**: Photo upload (JPEG, PNG, WebP), gallery management, image optimization, video URL embedding, progress UI
- **Out of Scope**: Video file upload (use external hosting), AI tagging, face detection, watermarking

---

## Technical Considerations

### Technologies/Patterns

- Sharp for server-side image processing
- React Dropzone for drag-and-drop uploads
- Cloudinary or S3 for cloud storage
- react-beautiful-dnd for sortable photo grid
- Optimistic UI updates for upload feedback

### Potential Challenges

- **Storage costs**: Need to choose cost-effective provider
- **Large file uploads**: May timeout on slow connections
- **Image processing**: CPU-intensive on server
- **Browser compatibility**: Drag-and-drop varies

### Relevant Considerations

- [P00] **Video hosting**: Use embed URLs for now, avoid hosting video files directly
- [P00] **Image/video upload security**: Validate on server, strip EXIF, sanitize filenames

---

## Alternative Sessions

If this session is blocked (e.g., cloud storage decision pending):

1. **Session 03: Talent Search & Discovery** - Can implement search without media
2. **Session 04: Profile Enhancement** - Form improvements don't depend on media

However, Session 02 is strongly recommended as it's foundational for the visual showcase.

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
