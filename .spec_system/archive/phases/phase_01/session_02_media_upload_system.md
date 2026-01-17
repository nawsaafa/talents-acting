# Session 02: Media Upload System

**Phase**: 01 - Talent Management
**Status**: Not Started
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: ~20

---

## Objective

Enable talents to upload and manage photos and videos for their profiles, creating a rich media gallery that showcases their work and appearance.

---

## Prerequisites

- [x] Phase 00 complete (database, auth, UI primitives)
- [x] Phase 01 Session 01: Advanced Filtering (talent listing infrastructure)
- [ ] Cloud storage decision (Cloudinary, S3, or local)

---

## Key Deliverables

### Photo Management

- Photo upload with drag-and-drop support
- Gallery management (max 10 photos per talent)
- Primary/profile photo selection
- Image reordering via drag-and-drop
- Photo deletion with confirmation
- Upload progress indicators

### Image Processing

- Server-side image optimization
- Automatic resizing (thumbnail, medium, large)
- Format conversion (WebP for modern browsers)
- File size limits and validation
- EXIF data stripping for privacy

### Video/Showreel Support

- Video URL embedding (YouTube, Vimeo)
- URL validation and sanitization
- Video thumbnail extraction
- Showreel vs demo reel categorization
- Embed preview on profile

### Storage & API

- Upload API with chunked uploads for large files
- Cloud storage integration
- CDN delivery for optimized loading
- Image URL generation with transformations
- Deletion and cleanup routines

---

## Technical Approach

### Architecture

```
app/dashboard/profile/media/
    |
    +-- page.tsx (Server Component - gallery view)
    +-- MediaGallery.tsx (Client Component)
    |       |
    |       +-- PhotoUploader.tsx (drag-drop upload)
    |       +-- PhotoGrid.tsx (sortable gallery)
    |       +-- VideoEmbed.tsx (YouTube/Vimeo)
    |
    +-- api/upload/route.ts (upload endpoint)
```

### Technologies

- **Sharp**: Image processing (resize, optimize, format conversion)
- **React Dropzone**: Drag-and-drop file upload
- **Cloudinary or S3**: Cloud storage (decision needed)
- **react-beautiful-dnd**: Sortable photo grid

### Design Patterns

- Optimistic UI updates for upload progress
- Background processing for image optimization
- Signed URLs for secure access
- CDN caching for performance

---

## Scope

### In Scope (MVP)

- Photo upload (JPEG, PNG, WebP)
- Gallery management (reorder, delete, set primary)
- Image optimization and resizing
- YouTube/Vimeo embed support
- Upload progress UI
- Basic validation (size, format, count limits)

### Out of Scope (Deferred)

- Video file upload (use external hosting for now)
- AI-powered image tagging
- Face detection/cropping
- Watermarking
- Bulk upload from external sources

---

## Success Criteria

- [ ] Talents can upload photos via drag-and-drop
- [ ] Photos are optimized and stored in cloud
- [ ] Gallery displays with reordering capability
- [ ] Primary photo appears on talent card
- [ ] Video URLs embed correctly
- [ ] Upload progress shows during upload
- [ ] File validation prevents invalid uploads
- [ ] Images load quickly via CDN

---

## Technical Considerations

### Storage Options

Need to decide between:

1. **Cloudinary**: Built-in transformations, easy setup, per-bandwidth pricing
2. **AWS S3 + CloudFront**: More control, potentially cheaper at scale
3. **Local filesystem**: Development only, not for production

Recommendation: Start with Cloudinary for MVP (easier), migrate to S3 if costs become prohibitive.

### Image Size Variants

Generate these sizes on upload:

- Thumbnail: 150x150 (cropped square)
- Card: 400x600 (portrait crop)
- Full: 1200x1800 (max resolution)

### Security

- Validate file types server-side (not just extension)
- Check file headers (magic bytes)
- Limit upload size (5MB per photo)
- Rate limiting on upload API
- EXIF stripping for privacy

### Relevant Considerations

- [P00] **Video hosting**: Use embed URLs for now, avoid hosting video files directly
- [P00] **Image/video upload security**: Validate on server, strip EXIF, sanitize filenames

---

## Dependencies

### Depends On

- Phase 00: Database, Auth, UI primitives
- Session 01: Talent listing (for displaying photos)

### Enables

- Session 05: Public Talent Gallery (uses media)
- Phase 02+: Rich profile display

---

## Risks

- **Storage costs**: Need to monitor Cloudinary usage
- **Large file uploads**: May timeout on slow connections
- **Image processing**: CPU-intensive, may slow server
- **Browser compatibility**: Drag-and-drop varies across browsers

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
