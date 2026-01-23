# PRD Phase 03: Communication & Engagement

**Status**: In Progress
**Sessions**: 5
**Estimated Duration**: 3-4 days

**Progress**: 2/5 sessions (40%)

---

## Overview

Build communication features that enable professionals and companies to connect with talents. This phase transforms the platform from a passive directory into an active marketplace where casting opportunities can flow from professionals to talents. Focus on enabling initial contact and organizing talent collections for casting projects.

The platform already has:

- Complete user registration for all roles
- Subscription-based access control
- Premium talent data protection
- Admin validation workflows

This phase adds the communication layer that makes the talent database actionable for paying subscribers.

---

## Progress Tracker

| Session | Name                 | Status      | Est. Tasks | Validated  |
| ------- | -------------------- | ----------- | ---------- | ---------- |
| 01      | Messaging Foundation | Complete    | 20         | 2026-01-18 |
| 02      | Talent Collections   | Complete    | 20         | 2026-01-23 |
| 03      | Notification System  | Not Started | 16         | -          |
| 04      | Contact Requests     | Not Started | 18         | -          |
| 05      | Activity Dashboard   | Not Started | 15         | -          |

---

## Objectives

1. Enable professionals/companies to message talents directly
2. Create collections/lists for organizing talents by project
3. Build notification system for messages and platform updates
4. Implement contact request workflow with talent consent
5. Provide activity overview dashboard for all user types

---

## Prerequisites

- Phase 00: Foundation (Complete)
  - Database schema with User, TalentProfile models
  - Authentication with NextAuth
  - Admin dashboard for validation

- Phase 01: Talent Management (Complete)
  - Talent profile CRUD with media uploads
  - Advanced filtering and search
  - Public talent gallery

- Phase 02: Registration & Payments (Complete)
  - Professional/Company registration and validation
  - Stripe subscription management
  - Access control based on subscription status

---

## Session Details

### Session 01: Messaging Foundation

**Objective**: Build secure messaging system between professionals/companies and talents

**Key Deliverables**:

- Message model in database (sender, recipient, content, read status)
- Conversation threading and history
- Real-time or polling-based message updates
- Message inbox UI for all user types
- Compose message from talent profile

**Technical Focus**:

- Prisma schema for messages and conversations
- Server actions for send/receive
- Access control (only subscribed users can message)
- Read/unread status tracking

### Session 02: Talent Collections

**Objective**: Enable professionals/companies to organize talents into project-based collections

**Key Deliverables**:

- Collection model (name, description, owner, talents)
- Create/edit/delete collections
- Add/remove talents from collections
- Share collections (view-only links)
- Export collection as PDF/CSV

**Technical Focus**:

- Many-to-many relationship (collections <-> talents)
- Bulk operations (add multiple talents)
- Share link generation with access control
- PDF generation with talent photos

### Session 03: Notification System

**Objective**: Implement comprehensive notification system for platform events

**Key Deliverables**:

- Notification model (type, content, read status, link)
- In-app notification bell with unread count
- Email notifications for important events
- Notification preferences per user
- Notification history page

**Technical Focus**:

- Notification service abstraction
- Email template system (React Email)
- User preference storage
- Rate limiting for email notifications

### Session 04: Contact Requests

**Objective**: Implement formal contact request workflow with talent consent

**Key Deliverables**:

- Contact request model (requester, talent, purpose, status)
- Request form with purpose/project description
- Talent approval/decline workflow
- Contact info revealed only after approval
- Request history for both parties

**Technical Focus**:

- State machine for request status
- Privacy-focused design (contact hidden until approved)
- Admin oversight capability
- Rate limiting to prevent spam

### Session 05: Activity Dashboard

**Objective**: Provide unified activity view for all user types

**Key Deliverables**:

- Talent dashboard: messages, contact requests, profile views
- Professional dashboard: sent messages, collections, requests
- Company dashboard: team activity, shared collections
- Recent activity feed
- Basic analytics (views, responses)

**Technical Focus**:

- Role-specific dashboard components
- Activity aggregation queries
- View tracking (privacy-conscious)
- Performance optimization for dashboards

---

## Technical Considerations

### Messaging Architecture

**Approach**: Server-side with polling (Phase 03) → WebSockets (future)

- Start with simple polling for real-time feel
- Database-backed message storage
- Consider Pusher/Socket.io for future real-time upgrade

### Privacy & Consent

- Talents control their visibility and contactability
- Contact info only revealed after explicit approval
- Clear opt-out mechanisms
- Audit trail for all contact attempts

### Scalability Considerations

- Message pagination for large conversations
- Collection size limits (prevent abuse)
- Notification batching for frequent events
- Efficient activity feed queries

---

## Success Criteria

Phase complete when:

- [ ] Professionals and companies can message talents
- [ ] Collections can be created and shared
- [ ] Notifications delivered in-app and via email
- [ ] Contact requests respect talent consent
- [ ] Activity dashboards show relevant user data
- [ ] All messaging respects subscription access control

---

## Dependencies

### Depends On

- Phase 00: Foundation (database, auth, admin)
- Phase 01: Talent Management (profiles, gallery)
- Phase 02: Registration & Payments (subscriptions, access control)

### Enables

- Phase 04: Analytics & Reporting (engagement metrics)
- Phase 05: Booking & Scheduling (project management)
