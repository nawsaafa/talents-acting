# Session Specification

**Session ID**: `phase03-session03-notification_system`
**Phase**: 03 - Communication & Engagement
**Sequence**: 3 of 5 in phase

---

## Overview

### Objective

Implement a comprehensive notification system for platform events, enabling users to stay informed about messages, collections activity, and platform updates through both in-app notifications and email delivery.

### Background

The Talents Acting platform now has messaging (Session 01) and collections (Session 02) features. Users need timely notification of platform activity to engage with these features effectively. Without notifications, users won't know when they receive messages or when important platform events occur.

### Success Criteria

**Functional**:

- [ ] Users receive in-app notifications for messages, collection shares, and system events
- [ ] Notification bell displays accurate unread count
- [ ] Email notifications sent for critical events (new messages, contact requests)
- [ ] Users can configure notification preferences per channel and event type
- [ ] Notification history page with mark-as-read functionality
- [ ] Notifications respect subscription status for premium features

**Testing**:

- [ ] Unit tests for notification service functions
- [ ] Unit tests for access control logic
- [ ] All existing tests continue to pass

**Quality Gates**:

- [ ] All files ASCII-encoded with LF line endings
- [ ] Code follows project CONVENTIONS.md
- [ ] TypeScript strict mode compliance
- [ ] No ESLint errors

---

## Scope

### In Scope (MVP)

1. **Notification Model**
   - Type (enum: MESSAGE, COLLECTION_SHARE, SYSTEM, CONTACT_REQUEST)
   - Title and content fields
   - Read status with timestamp
   - Action link (where clicking notification navigates)
   - Sender reference (optional, for user-generated notifications)
   - Recipient reference

2. **In-App Notification Bell**
   - Header component showing bell icon with unread count badge
   - Dropdown showing recent notifications
   - Click to navigate to notification target
   - Mark as read on click

3. **Email Notifications**
   - React Email templates for notification emails
   - Send via Resend (already configured)
   - New message notification email
   - Collection shared notification email
   - Rate limiting (max 1 email per event type per hour)

4. **User Preferences**
   - Per-channel settings (in-app, email)
   - Per-event-type settings
   - Global notification enable/disable
   - Stored in database

5. **Notification History**
   - Full page listing all notifications
   - Filter by read/unread
   - Filter by notification type
   - Mark individual or all as read
   - Pagination for large lists

### Out of Scope

- Push notifications (mobile, browser)
- SMS notifications
- Real-time WebSocket delivery (use polling)
- Notification batching/digest emails
- Rich notification content (images, buttons)
- Notification sounds

---

## Technical Approach

### Architecture

```
lib/notifications/
  types.ts              # TypeScript interfaces
  access.ts             # Access control for notifications
  queries.ts            # Database read operations
  actions.ts            # Server actions for mutations
  service.ts            # Core notification creation/sending logic

components/notifications/
  NotificationBell.tsx          # Header bell with dropdown
  NotificationDropdown.tsx      # Recent notifications dropdown
  NotificationItem.tsx          # Single notification display
  NotificationList.tsx          # Full notification list
  NotificationPreferences.tsx   # Preferences form
  index.ts                      # Barrel export

app/notifications/
  page.tsx                      # Notification history page
  NotificationsPageClient.tsx   # Client component

app/settings/notifications/
  page.tsx                      # Preferences page
  NotificationSettingsClient.tsx

lib/email/templates/
  new-message.tsx               # New message email template
  collection-shared.tsx         # Collection share email template
```

### Database Schema

```prisma
// Notification types
enum NotificationType {
  MESSAGE
  COLLECTION_SHARE
  SYSTEM
  CONTACT_REQUEST
}

// User notifications
model Notification {
  id          String           @id @default(uuid())
  type        NotificationType
  title       String
  content     String           @db.Text
  actionLink  String?          // URL to navigate on click

  // Recipient
  recipientId String

  // Optional sender (for user-triggered notifications)
  senderId    String?

  // Status
  readAt      DateTime?

  // Timestamps
  createdAt   DateTime         @default(now())

  @@index([recipientId])
  @@index([recipientId, readAt])
  @@index([type])
  @@index([createdAt])
}

// User notification preferences
model NotificationPreference {
  id        String  @id @default(uuid())
  userId    String  @unique

  // Global settings
  enabled   Boolean @default(true)

  // Channel preferences (JSON)
  // { inApp: true, email: true }
  channels  Json    @default("{\"inApp\": true, \"email\": true}")

  // Event type preferences (JSON)
  // { MESSAGE: { inApp: true, email: true }, ... }
  eventTypes Json   @default("{}")

  // Email rate limiting
  lastEmailSentAt Json @default("{}")  // { eventType: timestamp }

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

### Access Control

Following the messaging module pattern:

1. All authenticated users can view their own notifications
2. Only the notification recipient can mark as read
3. Email notifications respect user preferences
4. Subscription-gated features only notify eligible users

### Integration Points

1. **Messaging (existing)**
   - Trigger MESSAGE notification when new message received
   - Include sender name and message preview in notification

2. **Collections (existing)**
   - Trigger COLLECTION_SHARE notification when share link accessed
   - Include collection name and sharer info

3. **Future: Contact Requests (Session 04)**
   - CONTACT_REQUEST type ready for next session

### Email Rate Limiting

To prevent notification fatigue:

- Track last email sent per event type in preferences
- Enforce minimum 1 hour between emails of same type
- In-app notifications always sent (no rate limit)

---

## Deliverables

### Files to Create

| File                                                        | Purpose                                 |
| ----------------------------------------------------------- | --------------------------------------- |
| `lib/notifications/types.ts`                                | TypeScript interfaces for notifications |
| `lib/notifications/access.ts`                               | Access control functions                |
| `lib/notifications/queries.ts`                              | Database read operations                |
| `lib/notifications/actions.ts`                              | Server actions for CRUD                 |
| `lib/notifications/service.ts`                              | Core notification logic                 |
| `components/notifications/NotificationBell.tsx`             | Bell icon with badge                    |
| `components/notifications/NotificationDropdown.tsx`         | Recent notifications popup              |
| `components/notifications/NotificationItem.tsx`             | Single notification card                |
| `components/notifications/NotificationList.tsx`             | Full notification list                  |
| `components/notifications/NotificationPreferences.tsx`      | Preferences form                        |
| `components/notifications/index.ts`                         | Barrel exports                          |
| `app/notifications/page.tsx`                                | History page                            |
| `app/notifications/NotificationsPageClient.tsx`             | History client component                |
| `app/settings/notifications/page.tsx`                       | Preferences page                        |
| `app/settings/notifications/NotificationSettingsClient.tsx` | Preferences client                      |
| `lib/email/templates/new-message.tsx`                       | New message email                       |
| `lib/email/templates/collection-shared.tsx`                 | Collection share email                  |
| `__tests__/notifications/access.test.ts`                    | Access control tests                    |
| `__tests__/notifications/service.test.ts`                   | Service function tests                  |

### Files to Modify

| File                             | Changes                                            |
| -------------------------------- | -------------------------------------------------- |
| `prisma/schema.prisma`           | Add Notification and NotificationPreference models |
| `components/auth/AuthStatus.tsx` | Add NotificationBell to header                     |
| `lib/messaging/actions.ts`       | Trigger notification on new message                |
| `lib/collections/actions.ts`     | Trigger notification on share link access          |

---

## Dependencies

### Prerequisites

- Phase 03 Session 01: Messaging Foundation (complete)
- Phase 03 Session 02: Talent Collections (complete)
- Resend configured for email delivery

### External Dependencies

None new - uses existing Resend integration

### Blockers

None identified

---

## Testing Strategy

### Unit Tests

1. **Access Control Tests** (`__tests__/notifications/access.test.ts`)
   - User can only view own notifications
   - User can only mark own notifications as read
   - Preferences correctly gate email sending

2. **Service Tests** (`__tests__/notifications/service.test.ts`)
   - Notification creation with all fields
   - Email rate limiting enforcement
   - Preference-based channel filtering

### Manual Testing Checklist

- [ ] Send message, verify recipient gets notification
- [ ] Share collection, access share link, verify notification
- [ ] Click notification bell, see dropdown
- [ ] Click notification, navigate to target
- [ ] Mark notification as read
- [ ] View notification history page
- [ ] Filter by type and read status
- [ ] Update notification preferences
- [ ] Verify email received for new message
- [ ] Verify rate limiting prevents duplicate emails

---

## Notes

### Considerations

- **Privacy**: Email notifications must not expose full message content
- **Performance**: Use indexed queries for unread count
- **UX**: Notification bell should poll for updates (every 30s)

### Future Enhancements

- Real-time WebSocket notifications
- Notification batching/digest emails
- Rich notifications with images
- Browser push notifications

---

## References

- [NEXT_SESSION.md](./NEXT_SESSION_archived.md) - Session recommendation
- [Phase 03 PRD](../../PRD/phase_03/PRD_phase_03.md) - Phase objectives
- [Messaging types](../../../lib/messaging/types.ts) - Pattern reference
- [Email templates](../../../lib/email/templates/) - Existing email templates
