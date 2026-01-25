# Session Specification

**Session ID**: `phase03-session02-talent_collections`
**Phase**: 03 - Communication & Engagement
**Status**: Not Started
**Created**: 2026-01-18

---

## 1. Session Overview

This session implements talent collections, a core feature that enables professionals and companies to organize talents into project-based lists. Collections transform the talent directory from a passive browsing experience into an active workspace where casting directors can curate shortlists, production companies can build talent pools, and agencies can organize rosters by project or client.

Collections are a primary value proposition for paid subscribers. By enabling users to save, organize, and share talents, we reinforce the subscription value and create a workflow that encourages repeated engagement with the platform. The feature integrates with the existing subscription-based access control system, ensuring only users with active subscriptions can create and manage collections.

This session delivers the complete collection lifecycle: creation, talent management (add/remove), sharing via secure links, and export capabilities (CSV format). PDF export is deferred to keep scope manageable.

---

## 2. Objectives

1. Enable professionals and companies to create, edit, and delete talent collections
2. Allow adding/removing talents to collections with bulk operation support
3. Implement shareable view-only collection links with secure access tokens
4. Provide CSV export functionality for collection data

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session02-database_schema` - Prisma schema and User model
- [x] `phase00-session04-authentication` - NextAuth authentication
- [x] `phase01-session01-advanced_filtering` - Talent filtering/search
- [x] `phase02-session05-access_control` - Subscription-based access control
- [x] `phase03-session01-messaging_foundation` - Messaging patterns and access control

### Required Tools/Knowledge

- Prisma many-to-many relationships
- Next.js Server Actions
- Crypto-random token generation for share links
- CSV generation

### Environment Requirements

- Node.js 18+
- PostgreSQL database
- Active Prisma client

---

## 4. Scope

### In Scope (MVP)

- Collection model with name, description, owner relationship
- CollectionTalent join table for many-to-many relationship
- CollectionShare model for shareable links with tokens
- CRUD operations for collections (create, read, update, delete)
- Add/remove single talent from collection
- Bulk add talents from search results
- Collections list page (`/collections`)
- Collection detail page with talent grid (`/collections/[id]`)
- "Add to Collection" button on talent cards
- Quick-add modal from talent profile page
- Generate shareable view-only links with expiry
- Public share page (`/collections/share/[token]`)
- Export collection as CSV

### Out of Scope (Deferred)

- PDF export with talent photos - _Reason: Complex layout/rendering, separate session_
- Collection templates - _Reason: Enhancement after core feature validated_
- Collection collaboration (multiple editors) - _Reason: Complex permissions, future phase_
- Collection notes/comments per talent - _Reason: Enhancement feature_
- Collection versioning/history - _Reason: Not MVP requirement_
- Collection sorting preferences - _Reason: Enhancement feature_

---

## 5. Technical Approach

### Architecture

```
lib/collections/
  types.ts          - TypeScript interfaces
  access.ts         - Access control for collections
  queries.ts        - Database queries (CRUD, share links)
  actions.ts        - Server actions (create, update, delete, share)
  export.ts         - CSV export functionality

components/collections/
  CollectionList.tsx        - User's collections grid
  CollectionCard.tsx        - Collection preview card
  CollectionDetail.tsx      - Collection with talent grid
  AddToCollectionButton.tsx - Button + modal for adding talents
  AddToCollectionModal.tsx  - Modal with collection selection
  ShareCollectionModal.tsx  - Modal for generating share links
  CollectionTalentCard.tsx  - Talent card within collection (with remove)

app/collections/
  page.tsx                  - Collections list page
  [id]/page.tsx             - Collection detail page
  share/[token]/page.tsx    - Public share view
```

### Design Patterns

- **Server Actions**: For all mutating operations (consistent with messaging)
- **Access Control Layer**: Centralized permission checks before operations
- **Secure Share Tokens**: Crypto-random 32-byte tokens for share links
- **Optimistic UI**: Immediate feedback for add/remove operations

### Technology Stack

- Next.js 16 Server Components & Server Actions
- Prisma ORM with PostgreSQL
- React Hook Form for collection forms
- date-fns for date formatting (already installed)
- Node.js crypto for token generation

---

## 6. Deliverables

### Files to Create

| File                                               | Purpose                                  | Est. Lines |
| -------------------------------------------------- | ---------------------------------------- | ---------- |
| `lib/collections/types.ts`                         | TypeScript interfaces for collections    | ~60        |
| `lib/collections/access.ts`                        | Access control for collection operations | ~120       |
| `lib/collections/queries.ts`                       | Database queries for collections         | ~250       |
| `lib/collections/actions.ts`                       | Server actions for collection mutations  | ~300       |
| `lib/collections/export.ts`                        | CSV export functionality                 | ~80        |
| `components/collections/CollectionList.tsx`        | Grid of user's collections               | ~60        |
| `components/collections/CollectionCard.tsx`        | Collection preview card                  | ~80        |
| `components/collections/CollectionDetail.tsx`      | Collection with talent grid              | ~120       |
| `components/collections/AddToCollectionButton.tsx` | Button component                         | ~50        |
| `components/collections/AddToCollectionModal.tsx`  | Modal for collection selection           | ~150       |
| `components/collections/ShareCollectionModal.tsx`  | Modal for share link generation          | ~120       |
| `components/collections/CollectionTalentCard.tsx`  | Talent card with remove action           | ~90        |
| `components/collections/CreateCollectionModal.tsx` | Modal for creating new collection        | ~130       |
| `components/collections/index.ts`                  | Barrel export                            | ~15        |
| `app/collections/page.tsx`                         | Collections list page                    | ~80        |
| `app/collections/[id]/page.tsx`                    | Collection detail page                   | ~120       |
| `app/collections/share/[token]/page.tsx`           | Public share view page                   | ~100       |
| `__tests__/collections/access.test.ts`             | Access control unit tests                | ~200       |
| `__tests__/collections/queries.test.ts`            | Query function unit tests                | ~180       |

### Files to Modify

| File                                | Changes                                                  | Est. Lines |
| ----------------------------------- | -------------------------------------------------------- | ---------- |
| `prisma/schema.prisma`              | Add Collection, CollectionTalent, CollectionShare models | ~50        |
| `app/talents/[id]/page.tsx`         | Add "Add to Collection" button                           | ~15        |
| `components/talents/TalentCard.tsx` | Add "Add to Collection" action                           | ~20        |
| `components/auth/AuthStatus.tsx`    | Add Collections link to navigation                       | ~5         |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Users can create collections with name and optional description
- [ ] Users can rename and delete their own collections
- [ ] Users can add single talents to collections from profile or card
- [ ] Users can add multiple talents in bulk from search results
- [ ] Users can remove talents from collections
- [ ] Users can generate shareable view-only links for collections
- [ ] Share links work for unauthenticated users (view-only)
- [ ] Share links can have optional expiry dates
- [ ] Users can export collections as CSV
- [ ] Only users with active subscriptions can create/manage collections
- [ ] Collection operations respect subscription access control

### Testing Requirements

- [ ] Unit tests for access control functions (coverage > 80%)
- [ ] Unit tests for query functions
- [ ] Manual testing of all collection operations
- [ ] Manual testing of share link flow

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] TypeScript strict mode compliance
- [ ] All tests passing

---

## 8. Implementation Notes

### Key Considerations

- Collections are owned by users, not profiles (allows future flexibility)
- Share tokens must be cryptographically secure (32 bytes hex)
- Expired share links should return appropriate error, not 404
- CSV export should include public talent fields only for share links
- Bulk add should prevent duplicates silently (upsert pattern)

### Potential Challenges

- **Many-to-many with ordering**: May need position field for custom ordering later
- **Large collections**: Implement pagination for collections with 50+ talents
- **Share link enumeration**: Rate limiting not in MVP scope but tokens are secure

### Relevant Considerations

- **[Architecture] Tiered access control**: Collections are subscription-gated; free users cannot create collections
- **[Security] User data protection**: Share links expose limited public talent data only; no contact info

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Access control: `canCreateCollection`, `canEditCollection`, `canDeleteCollection`, `canViewCollection`
- Queries: CRUD operations, share link generation/validation
- Export: CSV generation with correct fields

### Integration Tests

- Collection creation with talent addition
- Share link generation and public access
- Subscription status changes affecting collection access

### Manual Testing

- Create collection, add talents, verify list
- Generate share link, open in incognito, verify view-only
- Export CSV, verify data integrity
- Test as non-subscribed user (should be blocked)

### Edge Cases

- Adding talent already in collection (no-op)
- Deleting collection with talents (cascade)
- Accessing expired share link
- Owner accessing own share link
- Empty collection display
- Collection with maximum talents (100 limit)

---

## 10. Dependencies

### External Libraries

- date-fns: ^4.1.0 (already installed)
- Node.js crypto: built-in

### Other Sessions

- **Depends on**:
  - `phase02-session05-access_control` - Subscription checking
  - `phase01-session01-advanced_filtering` - Talent search for bulk add
- **Depended by**:
  - `phase03-session05-activity_dashboard` - Collection activity metrics

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
