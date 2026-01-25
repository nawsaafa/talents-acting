# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-18
**Project State**: Phase 03 - Communication & Engagement
**Completed Sessions**: 16 (Phases 00-02 complete)

---

## Recommended Next Session

**Session ID**: `phase03-session01-messaging_foundation`
**Session Name**: Messaging Foundation
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 20

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation complete (database, auth, admin)
- [x] Phase 01: Talent Management complete (profiles, gallery)
- [x] Phase 02: Registration & Payments complete (subscriptions, access control)

### Dependencies

- **Builds on**: Access control system from Phase 02 Session 05
- **Enables**: Notification system, contact requests, activity dashboard

### Project Progression

With Phases 00-02 complete, the platform has:

- Full talent directory with search and filtering
- User registration for all roles (talents, professionals, companies)
- Subscription-based access control protecting premium data

The next logical step is enabling communication between professionals/companies and talents. This transforms the platform from a passive directory into an active marketplace where casting opportunities can flow to talents.

Messaging is foundational because:

1. It's the primary use case for paying subscribers (contacting talents)
2. Other Phase 03 features (notifications, contact requests) build on it
3. It immediately adds value for paying subscribers

---

## Session Overview

### Objective

Build a secure messaging system that enables professionals and companies to communicate directly with talents.

### Key Deliverables

1. Database schema for messages and conversations
2. Core messaging functions (send, receive, mark read)
3. Message inbox UI and conversation views
4. "Contact" button on talent profiles (subscription-gated)

### Scope Summary

- **In Scope (MVP)**: Basic messaging, conversations, read status, access control
- **Out of Scope**: Real-time updates, attachments, group chats, search, templates

---

## Technical Considerations

### Technologies/Patterns

- Prisma for Message/Conversation models
- Server Actions for send/receive operations
- Polling-based updates (simple, reliable)
- Access control integration with existing subscription system

### Potential Challenges

- Conversation threading (finding or creating conversations)
- Access control edge cases (who can initiate vs reply)
- UI/UX for inbox with potentially many conversations

### Relevant Considerations

- **[Architecture] Tiered access control**: Messaging must respect subscription status - only paying users can initiate contact
- **[Security] User data protection**: Messages contain sensitive communication - proper authorization required

---

## Alternative Sessions

If this session is blocked:

1. **Session 02: Talent Collections** - Could be done first if messaging is too complex, but less impactful
2. **Session 03: Notification System** - Foundation for notifications without messaging (limited utility)

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
