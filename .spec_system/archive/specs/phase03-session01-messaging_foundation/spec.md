# Session Specification

**Session ID**: `phase03-session01-messaging_foundation`
**Phase**: 03 - Communication & Engagement
**Status**: Not Started
**Created**: 2026-01-18

---

## 1. Session Overview

This session implements the core messaging infrastructure that enables professionals and companies to communicate directly with talents. Messaging is the primary use case for paying subscribers - the reason they pay for access to the talent database is to reach out and make casting inquiries.

The platform already has subscription-based access control from Phase 02, ensuring only paying users can access premium talent data. This session extends that model to messaging: only users with active subscriptions can initiate conversations with talents, while talents can reply to any conversation they're part of.

The messaging system follows a conversation-based model where each conversation has exactly two participants. Messages are threaded within conversations, with read/unread tracking to help users manage their inbox. The implementation uses server-side polling for simplicity and reliability, with real-time upgrades deferred to future phases.

---

## 2. Objectives

1. Implement Prisma schema for conversations and messages with proper indexing
2. Build server actions for sending messages, fetching conversations, and marking messages as read
3. Create message inbox UI with conversation list and unread indicators
4. Add "Contact Talent" button to profile pages that respects subscription access control

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session04-authentication` - User authentication with role support
- [x] `phase01-session05-public_talent_gallery` - Talent profile pages
- [x] `phase02-session03-payment_integration` - Stripe subscription tracking
- [x] `phase02-session05-access_control` - Subscription-based access control

### Required Tools/Knowledge

- Prisma many-to-many relationships
- Next.js Server Actions
- React Server Components for data fetching
- Existing access control utilities (`lib/access/control.ts`)

### Environment Requirements

- Database with User model configured
- NextAuth session with user role and subscription status
- Existing UI component library (Button, Card, etc.)

---

## 4. Scope

### In Scope (MVP)

- Conversation model with two participants
- Message model with content, sender, timestamps, read status
- Send message server action with access control
- Fetch user's conversations with last message preview
- Fetch messages for a specific conversation
- Mark messages as read when conversation is viewed
- Message inbox page (`/messages`)
- Conversation detail page (`/messages/[conversationId]`)
- "Contact" button on talent profile pages
- Upgrade prompt for non-subscribers attempting to message
- Basic conversation threading (find existing or create new)

### Out of Scope (Deferred)

- Real-time updates via WebSockets - _Reason: Polling sufficient for MVP, adds complexity_
- File/image attachments - _Reason: Requires media storage infrastructure_
- Group conversations - _Reason: Two-party conversations cover main use case_
- Message search - _Reason: Can be added later without schema changes_
- Message templates/quick replies - _Reason: UX enhancement, not core functionality_
- Typing indicators - _Reason: Requires real-time infrastructure_
- Message deletion/editing - _Reason: Simplifies data model for MVP_

---

## 5. Technical Approach

### Architecture

```
                        +-------------------+
                        |   Talent Profile  |
                        |   [Contact Button]|
                        +--------+----------+
                                 |
                                 v
+------------------+    +------------------+    +------------------+
|  Access Control  |--->|  Messaging       |--->|    Database      |
|  (subscription)  |    |  Server Actions  |    |  (Conversations/ |
+------------------+    +------------------+    |   Messages)      |
                                 |              +------------------+
                                 v
                        +------------------+
                        |   Message Inbox  |
                        |   /messages      |
                        +------------------+
```

### Design Patterns

- **Guard Functions**: `canSendMessage()` checks access before allowing send
- **Optimistic Updates**: UI shows sent message immediately, server confirms
- **Conversation Threading**: Find-or-create pattern for initiating conversations
- **Pagination**: Messages loaded in batches for long conversations

### Technology Stack

- Next.js 16 App Router with Server Actions
- Prisma 5.x for database models
- TypeScript with strict mode
- Existing UI components (Button, Card, Input)
- pino for logging message events

---

## 6. Deliverables

### Files to Create

| File                                        | Purpose                         | Est. Lines |
| ------------------------------------------- | ------------------------------- | ---------- |
| `lib/messaging/types.ts`                    | Message and conversation types  | ~50        |
| `lib/messaging/queries.ts`                  | Database queries for messages   | ~150       |
| `lib/messaging/actions.ts`                  | Server actions (send, markRead) | ~120       |
| `lib/messaging/access.ts`                   | Messaging access control logic  | ~80        |
| `app/messages/page.tsx`                     | Message inbox page              | ~100       |
| `app/messages/[conversationId]/page.tsx`    | Conversation view               | ~120       |
| `components/messaging/ConversationList.tsx` | List of conversations           | ~80        |
| `components/messaging/ConversationItem.tsx` | Single conversation preview     | ~60        |
| `components/messaging/MessageList.tsx`      | Message history display         | ~80        |
| `components/messaging/MessageItem.tsx`      | Single message bubble           | ~50        |
| `components/messaging/ComposeMessage.tsx`   | Message input form              | ~70        |
| `components/messaging/ContactButton.tsx`    | Contact talent button           | ~60        |
| `__tests__/messaging/access.test.ts`        | Access control tests            | ~150       |
| `__tests__/messaging/queries.test.ts`       | Query function tests            | ~100       |

### Files to Modify

| File                         | Changes                             | Est. Lines |
| ---------------------------- | ----------------------------------- | ---------- |
| `prisma/schema.prisma`       | Add Conversation and Message models | ~40        |
| `app/talents/[id]/page.tsx`  | Add ContactButton component         | ~15        |
| `app/(dashboard)/layout.tsx` | Add messages link to navigation     | ~5         |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Professionals with active subscription can send messages to talents
- [ ] Companies with active subscription can send messages to talents
- [ ] Talents can reply to conversations they're part of
- [ ] Admins can send messages to any user
- [ ] Non-subscribers see upgrade prompt instead of send button
- [ ] Users see list of their conversations with unread count
- [ ] Users can view full message history in a conversation
- [ ] Messages are marked as read when conversation is viewed
- [ ] New conversations created when messaging a talent for first time
- [ ] Existing conversation used when messaging previously-contacted talent

### Testing Requirements

- [ ] Unit tests for messaging access control logic
- [ ] Unit tests for message query functions
- [ ] Manual testing of full message flow (send, receive, read)

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows CONVENTIONS.md (descriptive names, feature-grouped files)
- [ ] TypeScript strict mode - no errors
- [ ] All tests passing

---

## 8. Implementation Notes

### Key Considerations

- **Conversation uniqueness**: Each pair of users has exactly one conversation (enforce at query level)
- **Access control integration**: Reuse `checkPremiumAccess()` from `lib/access/control.ts`
- **Unread counting**: Count messages where sender != current user AND readAt is null
- **Message ordering**: Always order by createdAt DESC for inbox, ASC for conversation view
- **Performance**: Index conversations by participant and updatedAt for fast inbox queries

### Potential Challenges

- **Finding existing conversations**: Need efficient query to find conversation between two users
- **Many-to-many with Prisma**: Conversation-User relation requires explicit relation table
- **Read status tracking**: Must handle edge case where user opens conversation before messages load

### Relevant Considerations

- **[Architecture] Tiered access control**: Messaging extends the existing access model - only paid subscribers can initiate contact, protecting talents from spam
- **[Security] User data protection**: Messages are private communications - strict authorization required on all endpoints

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- `canInitiateConversation()` with all role/subscription combinations
- `canReplyToConversation()` for existing conversation participants
- `getConversationsForUser()` returns correct conversations with previews
- `getMessagesForConversation()` respects participant access
- `sendMessage()` enforces access control
- `markConversationAsRead()` updates correct messages

### Integration Tests

- Full message flow: Professional sends message to talent
- Conversation reuse: Second message to same talent uses existing conversation
- Access denial: Non-subscriber cannot send message

### Manual Testing

- Login as professional with subscription, message a talent
- Login as talent, see message in inbox, reply
- Login as professional without subscription, see upgrade prompt
- Verify unread count updates correctly
- Test conversation list ordering (most recent first)

### Edge Cases

- User sends message to themselves (should be prevented)
- Conversation between same users created twice (prevent duplicates)
- Very long message content (database Text field handles)
- User is participant of conversation but account is later deleted

---

## 10. Dependencies

### External Libraries

- `@prisma/client`: ^5.22.0 (existing)
- `next-auth`: ^5.0.0-beta.30 (existing)
- No new dependencies required

### Other Sessions

- **Depends on**:
  - `phase02-session05-access_control` (access control utilities)
  - `phase00-session04-authentication` (user session)
- **Depended by**:
  - `phase03-session03-notification_system` (message notifications)
  - `phase03-session04-contact_requests` (extends messaging)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
