# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-24
**Project State**: Phase 03 - Communication & Engagement
**Completed Sessions**: 19

---

## Recommended Next Session

**Session ID**: `phase03-session04-contact_requests`
**Session Name**: Contact Requests
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 18

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00-02: Foundation, Talent Management, Registration & Payments (complete)
- [x] Session 01: Messaging Foundation (complete) - communication infrastructure
- [x] Session 02: Talent Collections (complete) - talent organization
- [x] Session 03: Notification System (complete) - notification delivery for request alerts

### Dependencies

- **Builds on**: Notification system (Session 03) for request alerts via in-app and email
- **Enables**: Activity Dashboard (Session 05) to show contact request metrics

### Project Progression

Contact Requests is the natural next step because:

1. **Privacy-First Communication**: Complements messaging by adding a formal consent layer
2. **Talent Protection**: Critical for protecting talent contact information until they approve
3. **Professional Workflow**: Enables proper casting industry workflow with project descriptions
4. **Notification Integration**: Leverages the just-completed notification system for request alerts

---

## Session Overview

### Objective

Implement a formal contact request workflow that protects talent privacy while enabling professionals and companies to express interest in working with talents.

### Key Deliverables

1. ContactRequest model with status state machine (PENDING, APPROVED, DECLINED, EXPIRED)
2. Request form with purpose/project description and optional message
3. Talent approval/decline workflow with notification triggers
4. Contact info reveal only after approval (phone, email, agent details)
5. Request history pages for both requesters and talents
6. Admin oversight capability for monitoring requests

### Scope Summary

- **In Scope (MVP)**:
  - Contact request creation by professionals/companies
  - Status transitions (pending -> approved/declined)
  - Notification triggers for new requests and status changes
  - Contact info reveal after approval
  - Request history with filtering
  - Rate limiting to prevent spam

- **Out of Scope**:
  - Bulk contact requests
  - Request templates
  - Automated matching suggestions
  - Request analytics/insights

---

## Technical Considerations

### Technologies/Patterns

- Prisma schema for ContactRequest model with status enum
- Server actions for request CRUD and status transitions
- State machine pattern for request status management
- Notification integration using existing service
- Access control based on subscription status

### Potential Challenges

1. **State Management**: Ensuring clean state transitions and preventing invalid status changes
2. **Privacy Enforcement**: Guaranteeing contact info only revealed after explicit approval
3. **Rate Limiting**: Preventing spam while allowing legitimate bulk outreach
4. **UX Flow**: Making the request/approval flow intuitive for both parties

### Relevant Considerations

- **Privacy/Security**: Contact info only revealed after explicit approval - this is the core purpose
- **Admin Oversight**: Need visibility into request patterns for abuse prevention
- **Tiered Access**: Only subscribed professionals/companies can make requests

---

## Alternative Sessions

If this session is blocked:

1. **Session 05: Activity Dashboard** - Can be started in parallel if contact requests are delayed, but metrics will be incomplete
2. **Phase 04 planning** - Can begin planning future phase while waiting

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
