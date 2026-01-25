# Next Session Recommendation

**Generated**: 2026-01-18
**Current Phase**: 03 - Communication & Engagement
**Phase Progress**: 1/5 sessions complete (20%)

---

## Recommended Session

### `phase03-session02-talent_collections`

**Session Name**: Talent Collections
**Priority**: High (core monetization feature)
**Estimated Tasks**: 18
**Estimated Duration**: 3-4 hours

---

## Rationale

### Why This Session?

1. **Natural Progression**: Follows messaging foundation - professionals who can message talents now need to organize them for projects

2. **High Business Value**: Collections are a primary value proposition for paid subscribers:
   - Casting directors organize audition shortlists
   - Production companies create talent pools by project
   - Agencies build rosters for clients

3. **Subscription Feature**: Exclusively available to paying users, reinforcing subscription value

4. **Foundation for Future Features**:
   - Contact requests will reference collections
   - Activity dashboard will track collection activity
   - Analytics will measure collection engagement

### Dependencies Satisfied

- [x] User authentication and roles (Phase 00)
- [x] Talent profiles with searchable data (Phase 01)
- [x] Subscription-based access control (Phase 02)
- [x] Messaging system for talent communication (Session 01)

---

## Session Scope

### Key Deliverables

1. **Database Schema**
   - Collection model (name, description, owner)
   - CollectionTalent join table (many-to-many)
   - Share links with access tokens

2. **Core Operations**
   - Create/edit/delete collections
   - Add/remove talents from collections
   - Bulk add talents from search results

3. **UI Components**
   - Collections list page
   - Collection detail view with talent grid
   - "Add to Collection" button on talent cards
   - Quick-add modal from talent profile

4. **Sharing & Export**
   - Generate shareable view-only links
   - Export collection as CSV
   - PDF export with talent photos (basic)

### Technical Focus

- Many-to-many relationships in Prisma
- Bulk operations with optimistic UI updates
- Share link generation with expiry
- Server-side PDF generation (jspdf or similar)

---

## Risk Assessment

| Risk                       | Likelihood | Mitigation                             |
| -------------------------- | ---------- | -------------------------------------- |
| PDF generation complexity  | Medium     | Start with CSV, add PDF as enhancement |
| Bulk operation performance | Low        | Use batched database operations        |
| Share link security        | Low        | Use crypto-random tokens with expiry   |

---

## Preparation Checklist

Before starting:

- [ ] Review Phase 03 PRD Session 02 details
- [ ] Check CONSIDERATIONS.md for lessons learned
- [ ] Verify no blocking issues from Session 01
- [ ] Confirm access control patterns from Phase 02

---

## Next Steps

1. Run `/sessionspec` to create detailed specification
2. Run `/tasks` to generate task checklist
3. Run `/implement` to begin implementation

---

## Alternative Sessions

If Session 02 is blocked, consider:

1. **Session 03: Notification System** - Can be built independently
2. **Session 04: Contact Requests** - Requires some collection integration

Recommendation: Proceed with Session 02 as planned.
