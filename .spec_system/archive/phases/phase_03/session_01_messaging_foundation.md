# Session 01: Messaging Foundation

**Phase**: 03 - Communication & Engagement
**Session**: 01
**Status**: Not Started
**Estimated Tasks**: 20
**Estimated Duration**: 3-4 hours

---

## Objective

Build a secure messaging system that enables professionals and companies to communicate directly with talents, creating the foundation for talent-professional connections on the platform.

---

## Prerequisites

- [x] Phase 02 complete (subscription-based access control)
- [x] User authentication with role support
- [x] Talent profiles with contact information
- [x] Subscription status tracking

---

## Key Deliverables

1. **Database Schema**
   - Message model with sender, recipient, content, timestamps
   - Conversation model for threading messages
   - Read/unread status tracking

2. **Core Messaging Functions**
   - Send message (with access control)
   - Fetch conversations list
   - Fetch message history for conversation
   - Mark messages as read

3. **UI Components**
   - Message inbox page (`/messages`)
   - Conversation view with message history
   - Compose message form
   - "Contact" button on talent profile pages

4. **Access Control**
   - Only subscribed professionals/companies can initiate messages
   - Talents can always reply
   - Admins can view all conversations for moderation

---

## Technical Approach

### Database Schema

```prisma
model Conversation {
  id           String    @id @default(uuid())
  participants User[]    @relation("ConversationParticipants")
  messages     Message[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([updatedAt])
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  sender         User         @relation("SentMessages", fields: [senderId], references: [id])
  content        String       @db.Text
  readAt         DateTime?
  createdAt      DateTime     @default(now())

  @@index([conversationId])
  @@index([senderId])
  @@index([createdAt])
}
```

### Access Control Rules

| Sender Role  | Recipient Role | Allowed? | Condition                         |
| ------------ | -------------- | -------- | --------------------------------- |
| PROFESSIONAL | TALENT         | Yes      | Active subscription               |
| COMPANY      | TALENT         | Yes      | Active subscription               |
| TALENT       | PROFESSIONAL   | Yes      | Replying to existing conversation |
| TALENT       | COMPANY        | Yes      | Replying to existing conversation |
| ADMIN        | Any            | Yes      | Always                            |
| Any          | ADMIN          | Yes      | Always                            |

### Key Components

- `lib/messaging/queries.ts` - Database queries
- `lib/messaging/actions.ts` - Server actions
- `app/messages/page.tsx` - Inbox
- `app/messages/[conversationId]/page.tsx` - Conversation view
- `components/messaging/` - UI components

---

## Success Criteria

### Functional Requirements

- [ ] Professionals can message talents from profile pages
- [ ] Companies can message talents from profile pages
- [ ] All users see their message inbox
- [ ] Conversations show full message history
- [ ] Messages marked as read when viewed
- [ ] Unpaid users see upgrade prompt instead of message button

### Testing Requirements

- [ ] Unit tests for messaging queries
- [ ] Unit tests for access control logic
- [ ] Manual testing of message flow

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] TypeScript strict mode - no errors
- [ ] All tests passing

---

## Out of Scope (Deferred)

- Real-time updates (WebSockets) - future enhancement
- File/image attachments in messages
- Group conversations
- Message search
- Message templates
- Automated responses

---

## Dependencies

### Builds On

- `lib/access/control.ts` - Access level checking
- `lib/auth/utils.ts` - User authentication
- Talent profile pages

### Enables

- Session 03: Notification System (message notifications)
- Session 04: Contact Requests (extends messaging)
