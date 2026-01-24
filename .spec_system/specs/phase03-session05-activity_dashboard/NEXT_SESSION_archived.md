# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-24
**Project State**: Phase 03 - Communication & Engagement
**Completed Sessions**: 20

---

## Recommended Next Session

**Session ID**: `phase03-session05-activity_dashboard`
**Session Name**: Activity Dashboard
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 15-18

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation (database, auth, admin) - Complete
- [x] Phase 01: Talent Management (profiles, gallery) - Complete
- [x] Phase 02: Registration & Payments (subscriptions, access control) - Complete
- [x] Session 01: Messaging Foundation - Complete
- [x] Session 02: Talent Collections - Complete
- [x] Session 03: Notification System - Complete
- [x] Session 04: Contact Requests - Complete

### Dependencies

- **Builds on**: All Phase 03 sessions (messaging, collections, notifications, contact requests)
- **Enables**: Phase 04 Analytics & Reporting (engagement metrics)

### Project Progression

This is the **final session of Phase 03** - Communication & Engagement. It consolidates all communication features built in sessions 01-04 into unified, role-specific dashboards. This session:

1. **Completes the communication layer** by providing users with a central place to view all their activity
2. **Bridges to Phase 04** by establishing the data patterns needed for analytics
3. **Enhances user experience** with unified activity views for talents, professionals, and companies

---

## Session Overview

### Objective

Provide unified activity dashboards for all user types, aggregating messages, contact requests, collections, and notifications into role-specific views with basic analytics.

### Key Deliverables

1. **Talent Dashboard**: Messages, contact requests, profile views, recent activity feed
2. **Professional Dashboard**: Sent messages, collections, contact requests, activity summary
3. **Company Dashboard**: Team activity, shared collections, aggregate metrics
4. **Activity Feed Component**: Reusable component for recent activity across all types
5. **Basic Analytics**: Profile views counter, response rates, engagement metrics

### Scope Summary

- **In Scope (MVP)**: Role-specific dashboards, activity aggregation, profile view tracking, basic stats
- **Out of Scope**: Advanced analytics, engagement reports, real-time activity updates, comparison metrics

---

## Technical Considerations

### Technologies/Patterns

- React Server Components for dashboard pages
- Parallel data fetching for performance
- Reusable dashboard card components
- Privacy-conscious view tracking (aggregate only, no individual visitor data)

### Potential Challenges

- Efficient aggregation queries across multiple tables (messages, collections, requests, notifications)
- Dashboard performance with many data sources
- View tracking without impacting page load times
- Consistent data presentation across different user roles

### Relevant Considerations

- **Tiered access control**: Dashboard content must respect subscription status
- **User data protection**: View tracking must be privacy-conscious

---

## Alternative Sessions

If this session is blocked:

1. **Phase 04: Analytics Setup** - If dashboard scope needs to expand into formal analytics
2. **Performance Optimization** - If existing features need optimization before adding dashboards

---

## Phase Completion

Completing this session will:

- Mark Phase 03 (Communication & Engagement) as **complete**
- Enable transition to Phase 04 (Analytics & Reporting)
- Require running `/carryforward` to update CONSIDERATIONS.md

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
