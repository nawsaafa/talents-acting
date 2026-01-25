# Session Specification

**Session ID**: `phase03-session05-activity_dashboard`
**Phase**: 03 - Communication & Engagement
**Status**: Not Started
**Created**: 2026-01-24

---

## 1. Session Overview

This session builds unified activity dashboards that consolidate all communication features from Phase 03 into role-specific views. As the final session of Phase 03, it transforms the existing scattered dashboard pages into comprehensive activity hubs that provide users with a central place to view messages, contact requests, collections, and notifications.

The current dashboards (`/dashboard/professional/page.tsx` and `/dashboard/company/page.tsx`) display static account status and subscription information. This session enhances them with live activity data including unread message counts, pending contact requests, collection statistics, and recent activity feeds. For talents, a new activity section will show incoming contact requests and message summaries.

The session also introduces privacy-conscious profile view tracking, allowing talents to see aggregate statistics about their profile visibility without revealing individual viewer information. This establishes the data patterns needed for Phase 04 Analytics & Reporting.

---

## 2. Objectives

1. Create role-specific activity dashboards showing aggregated communication data for talents, professionals, and companies
2. Build a reusable activity feed component that displays recent activity across all communication types
3. Implement profile view tracking with aggregate-only statistics (privacy-conscious design)
4. Provide dashboard summary cards with counts for messages, contact requests, collections, and notifications

---

## 3. Prerequisites

### Required Sessions

- [x] `phase03-session01-messaging_foundation` - Provides message/conversation queries
- [x] `phase03-session02-talent_collections` - Provides collection queries
- [x] `phase03-session03-notification_system` - Provides notification queries
- [x] `phase03-session04-contact_requests` - Provides contact request queries

### Required Tools/Knowledge

- React Server Components for dashboard pages
- Prisma aggregation queries
- Parallel data fetching patterns

### Environment Requirements

- PostgreSQL database with messaging, collections, notifications, and contact_requests tables
- Existing dashboard page structure at `/dashboard/professional` and `/dashboard/company`

---

## 4. Scope

### In Scope (MVP)

- Dashboard summary cards showing counts (messages, requests, collections, notifications)
- Activity feed component with recent items from all communication types
- Profile view tracking model and basic counting (aggregate only)
- Role-specific dashboard enhancements (talent, professional, company)
- Quick action links to relevant features
- Response rate calculation for contact requests

### Out of Scope (Deferred)

- Real-time activity updates (WebSockets) - _Reason: Phase 03 uses polling; real-time deferred_
- Advanced analytics charts/graphs - _Reason: Phase 04 scope_
- Engagement reports and exports - _Reason: Phase 04 scope_
- Comparison metrics (vs. last week/month) - _Reason: Phase 04 scope_
- Individual visitor tracking - _Reason: Privacy concerns; aggregate only_

---

## 5. Technical Approach

### Architecture

The dashboard system follows the existing pattern of Server Components for data fetching with targeted enhancements:

```
lib/activity/
  types.ts          - Dashboard types and interfaces
  queries.ts        - Aggregation queries for dashboard data
  actions.ts        - Server actions (profile view tracking)

components/activity/
  ActivityFeed.tsx          - Unified activity feed component
  DashboardSummaryCard.tsx  - Reusable stat card component
  TalentActivitySection.tsx - Talent-specific activity display
  ProfessionalActivitySection.tsx - Professional activity display
  CompanyActivitySection.tsx - Company activity display
  ActivityFeedItem.tsx      - Individual activity item renderer

app/dashboard/
  professional/page.tsx - Enhanced with activity data
  company/page.tsx      - Enhanced with activity data
  profile/page.tsx      - Talent dashboard with activity (or new section)
```

### Design Patterns

- **Server Components**: Data fetching at the page level with parallel queries
- **Composition**: Reusable summary card and feed item components
- **Aggregation Queries**: Efficient Prisma count and groupBy operations
- **Privacy by Design**: Profile views store only aggregate counts, not visitor IDs

### Technology Stack

- Next.js 15 with React Server Components
- Prisma with PostgreSQL
- Existing UI components (Card, Badge patterns)

---

## 6. Deliverables

### Files to Create

| File                                                  | Purpose                                 | Est. Lines |
| ----------------------------------------------------- | --------------------------------------- | ---------- |
| `lib/activity/types.ts`                               | Dashboard data types and interfaces     | ~80        |
| `lib/activity/queries.ts`                             | Aggregation queries for dashboard stats | ~200       |
| `lib/activity/actions.ts`                             | Server actions for view tracking        | ~60        |
| `components/activity/ActivityFeed.tsx`                | Unified activity feed component         | ~120       |
| `components/activity/ActivityFeedItem.tsx`            | Individual activity item renderer       | ~100       |
| `components/activity/DashboardSummaryCard.tsx`        | Reusable stat card component            | ~60        |
| `components/activity/TalentActivitySection.tsx`       | Talent dashboard activity               | ~100       |
| `components/activity/ProfessionalActivitySection.tsx` | Professional dashboard activity         | ~100       |
| `components/activity/CompanyActivitySection.tsx`      | Company dashboard activity              | ~120       |
| `prisma/migrations/[timestamp]_add_profile_views.sql` | Profile view tracking schema            | ~20        |
| `__tests__/activity/queries.test.ts`                  | Unit tests for activity queries         | ~200       |

### Files to Modify

| File                                  | Changes                          | Est. Lines |
| ------------------------------------- | -------------------------------- | ---------- |
| `prisma/schema.prisma`                | Add ProfileView model            | ~15        |
| `app/dashboard/professional/page.tsx` | Add activity section integration | ~30        |
| `app/dashboard/company/page.tsx`      | Add activity section integration | ~30        |
| `app/dashboard/profile/page.tsx`      | Add talent activity section      | ~30        |
| `components/activity/index.ts`        | Export barrel file               | ~10        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Professional dashboard shows message count, sent contact requests, collection count
- [ ] Company dashboard shows team message activity, shared collections, aggregate requests
- [ ] Talent dashboard (profile page) shows received contact requests, messages, profile views
- [ ] Activity feed displays recent items from messages, contact requests, collections, notifications
- [ ] Profile view tracking increments on talent profile views (aggregate only)
- [ ] Response rate calculated from contact request approve/decline data

### Testing Requirements

- [ ] Unit tests for activity aggregation queries
- [ ] Unit tests for profile view tracking logic
- [ ] Manual testing of all three dashboard types
- [ ] Verify no N+1 queries in dashboard data fetching

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions (CONVENTIONS.md)
- [ ] TypeScript strict mode compliance
- [ ] No ESLint warnings

---

## 8. Implementation Notes

### Key Considerations

- Use `Promise.all` for parallel data fetching to minimize dashboard load time
- Profile views should NOT store individual viewer IDs - privacy first
- Activity feed should be limited (e.g., 10 most recent items) for performance
- Reuse existing query patterns from messaging/collections/notifications modules

### Potential Challenges

- **Dashboard Performance**: Aggregating from multiple tables can be slow
  - _Mitigation_: Use Prisma `count` and `groupBy`, avoid N+1 queries
- **Unified Activity Feed**: Different activity types have different shapes
  - _Mitigation_: Normalize to common `ActivityItem` interface
- **Profile View Privacy**: Users may expect to see who viewed their profile
  - _Mitigation_: Clear UI messaging that only aggregate counts are shown

### Relevant Considerations

From CONSIDERATIONS.md:

- **Tiered access control**: Dashboard content must respect subscription status - professionals/companies see different data than unsubscribed users
- **User data protection**: Profile view tracking must be privacy-conscious - no individual visitor data stored

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- `getActivityDashboardStats()` returns correct counts for each user type
- `getRecentActivity()` returns properly sorted, limited results
- `trackProfileView()` increments aggregate count correctly
- `getResponseRate()` calculates correct percentage from request data

### Integration Tests

- Dashboard pages load without errors for each role
- Activity feed renders items from all activity types
- Profile view tracking works end-to-end

### Manual Testing

- Professional user sees their sent messages count, collections, requests
- Company user sees team activity aggregates
- Talent user sees received requests, messages, profile views
- Activity feed shows recent items with correct formatting
- Navigation from activity items works correctly

### Edge Cases

- User with no activity (empty dashboard state)
- User with very high counts (number formatting)
- New user with no profile view history
- User with only one type of activity (partial data)

---

## 10. Dependencies

### External Libraries

- None new (uses existing Prisma, Next.js)

### Other Sessions

- **Depends on**: phase03-session01 (messaging), phase03-session02 (collections), phase03-session03 (notifications), phase03-session04 (contact requests)
- **Depended by**: Phase 04 sessions (Analytics & Reporting)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
