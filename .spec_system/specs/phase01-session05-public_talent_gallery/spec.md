# Session Specification

**Session ID**: `phase01-session05-public_talent_gallery`
**Session Name**: Public Talent Gallery
**Phase**: 01 - Talent Management
**Sequence**: 5 of 5

---

## Overview

### Objective
Create a polished, performant talent showcase for public visitors that combines filtering, search, and visual presentation into a seamless discovery experience. This is the culmination of Phase 01, bringing together all previous session work (filtering, media, search, profiles) into the primary user-facing feature.

### Success Criteria
- [ ] Grid/list view toggle works with smooth transition
- [ ] Infinite scroll loads more talents automatically
- [ ] Talent cards show hover effects and quick actions
- [ ] Quick view modal displays talent preview without navigation
- [ ] Gallery is responsive and mobile-optimized
- [ ] Performance: LCP < 2.5s, no layout shifts
- [ ] Integrates seamlessly with FilterPanel and SearchBar
- [ ] All files ASCII-encoded with LF line endings

### Estimated Duration
2-3 hours

---

## Prerequisites

### Completed Dependencies
- [x] Phase 00: Foundation (database, auth, UI primitives)
- [x] Session 01: Advanced Filtering (FilterPanel, filter components)
- [x] Session 02: Media Upload System (photos, image optimization)
- [x] Session 03: Talent Search & Discovery (SearchBar, full-text search)
- [x] Session 04: Profile Enhancement (ProfilePreview, completeness)

### Required Knowledge
- Intersection Observer API for infinite scroll
- Next.js Image optimization patterns
- CSS Grid and Flexbox for layouts
- React state management for view modes

---

## Technical Specification

### Architecture Overview

```
app/talents/page.tsx (Enhanced)
├── SearchBar (existing)
├── ViewToggle (NEW)
├── FilterPanel (existing)
└── TalentGallery (NEW)
    ├── TalentCardEnhanced (NEW)
    │   └── QuickActions (hover overlay)
    ├── TalentListItem (NEW)
    ├── InfiniteScrollLoader (NEW)
    └── QuickViewModal (NEW)
```

### Key Components

#### 1. ViewToggle Component
**File**: `components/gallery/ViewToggle.tsx`

Toggle between grid and list views with visual indicator.

```typescript
interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}
```

Features:
- Two buttons with Grid2X2 and List icons (lucide-react)
- Active state with primary color background
- Smooth transition between states
- Keyboard accessible
- URL param sync (`?view=grid|list`)

#### 2. TalentCardEnhanced Component
**File**: `components/gallery/TalentCardEnhanced.tsx`

Enhanced version of TalentCard with hover effects and quick actions.

Features:
- Extends existing TalentCard functionality
- Hover overlay with quick actions (appears on hover)
- Quick view button (Eye icon)
- Smooth image zoom on hover (existing scale-105)
- Staggered animation on mount (optional, CSS-only)
- Aspect ratio: 3:4 (portrait-oriented)

```typescript
interface TalentCardEnhancedProps {
  talent: PublicTalentProfile;
  searchQuery?: string;
  onQuickView: (talent: PublicTalentProfile) => void;
  index?: number; // For staggered animation
}
```

#### 3. TalentListItem Component
**File**: `components/gallery/TalentListItem.tsx`

Horizontal list view for talent display.

Features:
- Photo on left (120px width, aspect 3:4)
- Info on right: name, location, skills, attributes
- Availability badge inline
- Quick view button always visible
- Mobile: stacks to single column

```typescript
interface TalentListItemProps {
  talent: PublicTalentProfile;
  searchQuery?: string;
  onQuickView: (talent: PublicTalentProfile) => void;
}
```

#### 4. InfiniteScrollLoader Component
**File**: `components/gallery/InfiniteScrollLoader.tsx`

Intersection Observer-based infinite scroll trigger.

```typescript
interface InfiniteScrollLoaderProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}
```

Features:
- Invisible sentinel element at bottom of list
- Uses IntersectionObserver with rootMargin for preloading
- Loading spinner when fetching
- "No more results" message when exhausted
- Debounced to prevent rapid-fire requests

#### 5. QuickViewModal Component
**File**: `components/gallery/QuickViewModal.tsx`

Modal preview of talent without full page navigation.

```typescript
interface QuickViewModalProps {
  talent: PublicTalentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}
```

Features:
- Uses existing Modal primitive (size: 'lg')
- Photo carousel if multiple photos
- Key info: name, age range, location, physique
- Skills badges (limited to 8, expandable)
- "View Full Profile" link button
- Keyboard: Escape to close, Left/Right for photos
- Mobile: fullscreen modal

#### 6. TalentGallery Container
**File**: `components/gallery/TalentGallery.tsx`

Main gallery component orchestrating view mode and infinite scroll.

```typescript
interface TalentGalleryProps {
  initialTalents: PublicTalentProfile[];
  initialTotal: number;
  searchQuery?: string;
  filters: TalentFilterParams;
}
```

Features:
- Client component ("use client")
- State: talents array, page, hasMore, isLoading, view mode
- Handles infinite scroll data fetching
- Renders grid or list based on view
- Results count display
- Empty state handling

### Server Action for Pagination

**File**: `lib/talents/actions.ts` (add function)

```typescript
export async function loadMoreTalents(
  page: number,
  filters: TalentFilterParams,
  searchQuery?: string
): Promise<{ talents: PublicTalentProfile[]; hasMore: boolean }>
```

### Page Updates

**File**: `app/talents/page.tsx` (modify)

Changes:
- Remove existing pagination (Previous/Next buttons)
- Add ViewToggle above grid
- Replace TalentCard grid with TalentGallery
- Pass initial data to TalentGallery
- Preserve Suspense boundaries

### URL Parameters

| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| `view` | `grid`, `list` | `grid` | Gallery view mode |
| `q` | string | - | Search query (existing) |
| `page` | number | 1 | For initial load only |
| All filters | - | - | Existing filter params |

---

## Deliverables

### Files to Create

| File | Purpose | Est. Lines |
|------|---------|------------|
| `components/gallery/ViewToggle.tsx` | View mode toggle | ~60 |
| `components/gallery/TalentCardEnhanced.tsx` | Enhanced card with actions | ~120 |
| `components/gallery/TalentListItem.tsx` | Horizontal list view item | ~100 |
| `components/gallery/InfiniteScrollLoader.tsx` | Infinite scroll trigger | ~80 |
| `components/gallery/QuickViewModal.tsx` | Talent preview modal | ~200 |
| `components/gallery/TalentGallery.tsx` | Main gallery container | ~180 |
| `components/gallery/index.ts` | Barrel exports | ~10 |

### Files to Modify

| File | Changes |
|------|---------|
| `lib/talents/actions.ts` | Add `loadMoreTalents` server action |
| `app/talents/page.tsx` | Replace pagination with TalentGallery |

---

## Implementation Notes

### Performance Considerations

1. **Image Loading**
   - Use Next.js Image with proper `sizes` attribute
   - Lazy load images below the fold (default behavior)
   - Use `priority` for first 6 cards (above fold)
   - WebP format via Sharp (already configured)

2. **Infinite Scroll**
   - Load 12 items per batch (matches current pageSize)
   - Preload when 200px from bottom (rootMargin)
   - Debounce scroll handler (300ms)
   - Cancel in-flight requests on filter/search change

3. **Layout Stability**
   - Fixed aspect ratios (3:4 for cards)
   - Skeleton placeholders match exact dimensions
   - No layout shift on image load (fill + relative parent)

4. **Bundle Size**
   - Keep components small and focused
   - Use lucide-react icons (tree-shakeable)
   - No heavy animation libraries

### Mobile Optimization

1. **Touch Interactions**
   - No hover states on mobile (quick actions always visible)
   - Tap to open quick view
   - Swipe for photo carousel in modal

2. **Layout**
   - Grid: 1 column on mobile, 2 on sm, 3 on xl
   - List: Full width on mobile
   - Quick view modal: fullscreen on mobile

3. **Performance**
   - Reduce image quality on slow connections
   - Smaller batch size on mobile (6 vs 12)

### Accessibility

1. **Keyboard Navigation**
   - Tab through cards
   - Enter to open quick view
   - Escape to close modal
   - Arrow keys in photo carousel

2. **Screen Readers**
   - Proper aria-labels on buttons
   - Live region for "Loading more..."
   - Card role with proper headings

3. **Focus Management**
   - Focus trap in modal
   - Return focus to trigger on close

---

## Testing Requirements

### Manual Testing Checklist

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

### Quality Gates

- [ ] ESLint: 0 errors, 0 warnings in new files
- [ ] TypeScript: No type errors
- [ ] Build: `npm run build` succeeds
- [ ] All files ASCII-encoded
- [ ] All files use LF line endings

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large galleries cause slow scroll | High | Virtualization (future), limit initial load |
| CLS from image loading | Medium | Fixed aspect ratios, skeleton loaders |
| SEO impact from infinite scroll | Medium | Keep initial SSR data, meta tags |
| Mobile performance | Medium | Smaller batches, lazy loading |

---

## Out of Scope

Items explicitly NOT in this session:
- Favorites/bookmarking functionality
- Talent comparison view
- Share functionality (social sharing)
- Print view
- Virtual scrolling (react-window)
- Advanced animations (Framer Motion)

---

## Dependencies

### External Packages
None required - uses existing dependencies:
- `lucide-react` for icons
- `next/image` for optimized images
- `clsx` + `tailwind-merge` for class merging

### Internal Dependencies
- `components/ui/Modal` - for QuickViewModal
- `components/ui/Button` - for actions
- `components/ui/Loading` - for loading states
- `components/talents/TalentCard` - base component reference
- `lib/talents/queries.ts` - data fetching

---

## Session Completion

This session completes Phase 01: Talent Management. Upon validation:
1. All 5 sessions of Phase 01 will be complete
2. The platform will have a fully functional public talent discovery experience
3. Ready to begin Phase 02: Registration & Payments

---

## References

- [NEXT_SESSION.md](../../NEXT_SESSION.md) - Session recommendation
- [PRD Phase 01](../../PRD/phase_01/PRD_phase_01.md) - Phase requirements
- [Session 03 Spec](../phase01-session03-talent_search_discovery/spec.md) - Search integration
- [Session 01 Spec](../phase01-session01-advanced_filtering/spec.md) - Filter integration
