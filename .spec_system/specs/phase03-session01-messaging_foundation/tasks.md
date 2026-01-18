# Task Checklist

**Session ID**: `phase03-session01-messaging_foundation`
**Total Tasks**: 20
**Estimated Duration**: 6-8 hours
**Created**: 2026-01-18

---

## Legend

- `[x]` = Completed
- `[ ]` = Pending
- `[P]` = Parallelizable (can run with other [P] tasks)
- `[S0301]` = Session reference (Phase 03, Session 01)
- `TNNN` = Task ID

---

## Progress Summary

| Category       | Total  | Done   | Remaining |
| -------------- | ------ | ------ | --------- |
| Setup          | 2      | 2      | 0         |
| Foundation     | 5      | 5      | 0         |
| Implementation | 9      | 9      | 0         |
| Integration    | 2      | 2      | 0         |
| Testing        | 2      | 2      | 0         |
| **Total**      | **20** | **20** | **0**     |

---

## Setup (2 tasks)

Initial configuration and environment preparation.

- [x] T001 [S0301] Verify prerequisites met - database, auth, access control utilities exist
- [x] T002 [S0301] Create directory structure for messaging (`lib/messaging/`, `components/messaging/`, `__tests__/messaging/`)

---

## Foundation (5 tasks)

Core structures and base implementations.

- [x] T003 [S0301] Add Conversation and Message models to Prisma schema (`prisma/schema.prisma`)
- [x] T004 [S0301] Run Prisma migration and generate client
- [x] T005 [S0301] [P] Create messaging types and interfaces (`lib/messaging/types.ts`)
- [x] T006 [S0301] [P] Implement messaging access control logic (`lib/messaging/access.ts`)
- [x] T007 [S0301] Implement database queries for conversations and messages (`lib/messaging/queries.ts`)

---

## Implementation (9 tasks)

Main feature implementation.

- [x] T008 [S0301] Implement server actions for sending messages and marking read (`lib/messaging/actions.ts`)
- [x] T009 [S0301] [P] Create ConversationItem component (`components/messaging/ConversationItem.tsx`)
- [x] T010 [S0301] [P] Create MessageItem component (`components/messaging/MessageItem.tsx`)
- [x] T011 [S0301] Create ConversationList component (`components/messaging/ConversationList.tsx`)
- [x] T012 [S0301] Create MessageList component (`components/messaging/MessageList.tsx`)
- [x] T013 [S0301] Create ComposeMessage component (`components/messaging/ComposeMessage.tsx`)
- [x] T014 [S0301] Create ContactButton component with subscription gating (`components/messaging/ContactButton.tsx`)
- [x] T015 [S0301] Build message inbox page (`app/messages/page.tsx`)
- [x] T016 [S0301] Build conversation detail page (`app/messages/[conversationId]/page.tsx`)

---

## Integration (2 tasks)

Connecting components to existing features.

- [x] T017 [S0301] Add ContactButton to talent profile page (`app/talents/[id]/page.tsx`)
- [x] T018 [S0301] Add messages link to dashboard navigation (`app/(dashboard)/layout.tsx`)

---

## Testing (2 tasks)

Verification and quality assurance.

- [x] T019 [S0301] [P] Write unit tests for messaging access control (`__tests__/messaging/access.test.ts`)
- [x] T020 [S0301] [P] Write unit tests for messaging queries (`__tests__/messaging/queries.test.ts`)

---

## Completion Checklist

Before marking session complete:

- [ ] All tasks marked `[x]`
- [ ] All tests passing
- [ ] All files ASCII-encoded
- [ ] TypeScript strict mode - no errors
- [ ] implementation-notes.md updated
- [ ] Ready for `/validate`

---

## Notes

### Parallelization

Tasks marked `[P]` can be worked on simultaneously:

- T005 & T006: Types and access control are independent
- T009 & T010: Item components are independent
- T019 & T020: Test files are independent

### Task Timing

Target ~20-25 minutes per task.

### Dependencies

- T003 must complete before T004 (schema before migration)
- T004 must complete before T007 (migration before queries)
- T007 must complete before T008 (queries before actions)
- T008 must complete before T015/T016 (actions before pages)
- T009-T014 must complete before T015/T016 (components before pages)
- T017/T018 depend on T014 (ContactButton must exist)

### Key Implementation Notes

- Conversation uniqueness enforced at query level (one conversation per user pair)
- Use existing `checkPremiumAccess()` from `lib/access/control.ts`
- Unread count = messages where sender != current user AND readAt is null
- Order by createdAt DESC for inbox, ASC for conversation view

---

## Next Steps

Run `/implement` to begin AI-led implementation.
