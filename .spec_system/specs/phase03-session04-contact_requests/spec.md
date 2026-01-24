# Session Specification

**Session ID**: `phase03-session04-contact_requests`
**Phase**: 03 - Communication & Engagement
**Created**: 2026-01-24

---

## Overview

### Objective

Implement a formal contact request workflow that protects talent privacy while enabling professionals and companies to express interest in working with talents. The system requires explicit talent consent before revealing contact information.

### Background

The platform already has:

- Messaging foundation for direct communication
- Talent collections for organizing talents by project
- Notification system for alerts (including CONTACT_REQUEST type already defined)
- Subscription-based access control
- Professional and company profiles with validation status

This session adds a consent-based contact request layer that:

1. Protects talent contact information until they explicitly approve
2. Provides professionals/companies with a formal way to request talent contact info
3. Creates an audit trail for all contact attempts
4. Integrates with the notification system for alerts

### Success Criteria

**Functional Requirements**:

- [ ] Professionals/companies can submit contact requests with purpose description
- [ ] Talents receive notifications for new contact requests
- [ ] Talents can approve or decline requests from their dashboard
- [ ] Contact info (phone, email) revealed only after explicit approval
- [ ] Both parties can view request history with status filtering
- [ ] Rate limiting prevents spam (max 5 pending requests per requester per day)
- [ ] Admin can view and monitor all contact requests

**Testing Requirements**:

- [ ] Unit tests for access control functions (15+ tests)
- [ ] Unit tests for state machine transitions (10+ tests)
- [ ] All existing tests continue to pass (310+)

**Quality Gates**:

- [ ] All files ASCII-encoded with LF line endings
- [ ] Code follows CONVENTIONS.md
- [ ] TypeScript strict mode compliance
- [ ] Build succeeds without errors

---

## Scope

### In Scope

1. **ContactRequest Model**
   - Database schema with status state machine
   - Status enum: PENDING, APPROVED, DECLINED, EXPIRED
   - Purpose/project description field
   - Optional message from requester
   - Timestamps for state transitions

2. **Contact Request Submission**
   - Request form component with purpose, project type, message
   - Integration point on talent profile pages
   - Subscription status check (only active subscribers can request)
   - Rate limiting (max 5 pending requests per day)

3. **Talent Approval Workflow**
   - Pending requests list on talent dashboard
   - Approve/decline actions with confirmation
   - Optional decline reason input
   - Notification triggers for status changes

4. **Contact Info Reveal**
   - Conditional display of contact info after approval
   - Approved requests page showing revealed contacts
   - Contact info includes: email, phone, agent details

5. **Request History**
   - Requester view: sent requests with status filtering
   - Talent view: received requests with status filtering
   - Admin view: all requests with user filtering

6. **Notification Integration**
   - New request notification to talent
   - Approval/decline notification to requester
   - Leverage existing CONTACT_REQUEST notification type

### Out of Scope

- Bulk contact requests (request multiple talents at once)
- Request templates (save and reuse request messages)
- Automated matching suggestions
- Request analytics/insights dashboards
- Direct messaging integration (separate from messaging foundation)
- Request expiry automation (manual status only for MVP)

---

## Technical Approach

### Database Schema

Add to `prisma/schema.prisma`:

```prisma
// Contact request status state machine
enum ContactRequestStatus {
  PENDING   // Awaiting talent response
  APPROVED  // Talent approved, contact info revealed
  DECLINED  // Talent declined
  EXPIRED   // Request expired (future enhancement)
}

// Project type for categorizing requests
enum ProjectType {
  FILM
  TV_SERIES
  COMMERCIAL
  THEATER
  VOICE_OVER
  MODELING
  OTHER
}

// Contact request from professional/company to talent
model ContactRequest {
  id        String               @id @default(uuid())
  status    ContactRequestStatus @default(PENDING)

  // Requester (professional or company user)
  requesterId String

  // Target talent
  talentProfileId String
  talentProfile   TalentProfile @relation(fields: [talentProfileId], references: [id], onDelete: Cascade)

  // Request details
  projectType   ProjectType
  projectName   String?         // Optional project name
  purpose       String          @db.Text  // Why they want to contact
  message       String?         @db.Text  // Optional personal message

  // Response details
  declineReason String?         // Talent's reason if declined

  // Timestamps
  createdAt     DateTime        @default(now())
  respondedAt   DateTime?       // When talent responded
  expiresAt     DateTime?       // Optional expiry date

  // Indexes
  @@index([requesterId])
  @@index([talentProfileId])
  @@index([status])
  @@index([createdAt])
  @@index([requesterId, status])
  @@index([talentProfileId, status])
}
```

Update `TalentProfile` model:

```prisma
model TalentProfile {
  // ... existing fields ...

  // Add contact requests relation
  contactRequests ContactRequest[]
}
```

### File Structure

```
lib/contact-requests/
  types.ts              # TypeScript interfaces
  access.ts             # Access control functions
  queries.ts            # Database query functions
  actions.ts            # Server actions for CRUD
  service.ts            # Business logic and notifications

components/contact-requests/
  ContactRequestForm.tsx        # Request submission form
  ContactRequestCard.tsx        # Single request display
  ContactRequestList.tsx        # List with filtering
  ContactRequestActions.tsx     # Approve/decline buttons
  ContactInfoReveal.tsx         # Revealed contact info display
  index.ts                      # Barrel export

app/contact-requests/
  page.tsx              # Request history page (for requesters)

app/dashboard/requests/
  page.tsx              # Pending requests page (for talents)

lib/email/templates/
  contact-request-new.tsx       # New request email to talent
  contact-request-approved.tsx  # Approval email to requester
  contact-request-declined.tsx  # Decline email to requester
```

### State Machine

```
PENDING -> APPROVED (talent approves)
PENDING -> DECLINED (talent declines)
PENDING -> EXPIRED  (time-based, future enhancement)
```

State transitions are one-way and final for MVP.

### Access Control

```typescript
// Who can create requests
canCreateContactRequest(user): boolean
  - Must be authenticated
  - Must be PROFESSIONAL or COMPANY role
  - Must have ACTIVE subscription status
  - Must be validated (ValidationStatus.APPROVED)

// Who can view a request
canViewContactRequest(user, request): boolean
  - Requester can view their own requests
  - Talent can view requests to them
  - Admin can view all requests

// Who can respond to a request
canRespondToContactRequest(user, request): boolean
  - Only the target talent can respond
  - Only PENDING requests can be responded to

// Rate limiting
canSubmitMoreRequests(user): boolean
  - Check pending request count in last 24 hours
  - Limit: 5 pending requests per day
```

### Integration Points

1. **Talent Profile Page**: Add "Request Contact" button for eligible users
2. **Notification Service**: Use existing sendNotification with CONTACT_REQUEST type
3. **Dashboard**: Add pending requests section for talents
4. **Admin Dashboard**: Add contact requests oversight section

---

## Dependencies

### Prerequisites

- [x] Phase 00-02: Foundation complete
- [x] Session 01: Messaging Foundation
- [x] Session 02: Talent Collections
- [x] Session 03: Notification System (provides CONTACT_REQUEST type)

### Builds On

- Notification service for request alerts
- TalentProfile model for contact info storage
- Subscription status checks for access control
- Email templates for notifications

### Enables

- Session 05: Activity Dashboard (contact request metrics)

---

## Deliverables

### Files to Create

| File                                                    | Purpose                       | Est. Lines |
| ------------------------------------------------------- | ----------------------------- | ---------- |
| `lib/contact-requests/types.ts`                         | TypeScript interfaces         | ~80        |
| `lib/contact-requests/access.ts`                        | Access control functions      | ~120       |
| `lib/contact-requests/queries.ts`                       | Database queries              | ~150       |
| `lib/contact-requests/actions.ts`                       | Server actions                | ~180       |
| `lib/contact-requests/service.ts`                       | Business logic, notifications | ~150       |
| `components/contact-requests/ContactRequestForm.tsx`    | Submission form               | ~200       |
| `components/contact-requests/ContactRequestCard.tsx`    | Request display card          | ~120       |
| `components/contact-requests/ContactRequestList.tsx`    | Filterable list               | ~150       |
| `components/contact-requests/ContactRequestActions.tsx` | Approve/decline UI            | ~100       |
| `components/contact-requests/ContactInfoReveal.tsx`     | Contact info display          | ~80        |
| `components/contact-requests/index.ts`                  | Barrel export                 | ~10        |
| `app/contact-requests/page.tsx`                         | Requester history page        | ~100       |
| `app/dashboard/requests/page.tsx`                       | Talent requests page          | ~120       |
| `lib/email/templates/contact-request-new.tsx`           | New request email             | ~80        |
| `lib/email/templates/contact-request-approved.tsx`      | Approval email                | ~80        |
| `lib/email/templates/contact-request-declined.tsx`      | Decline email                 | ~80        |
| `__tests__/contact-requests/access.test.ts`             | Access control tests          | ~200       |
| `__tests__/contact-requests/service.test.ts`            | Service function tests        | ~150       |

### Files to Modify

| File                        | Changes                                   |
| --------------------------- | ----------------------------------------- |
| `prisma/schema.prisma`      | Add ContactRequest model, enums, relation |
| `app/talents/[id]/page.tsx` | Add contact request button                |
| `app/dashboard/page.tsx`    | Add pending requests section              |
| `app/admin/page.tsx`        | Add contact requests oversight            |

---

## Testing Strategy

### Unit Tests

**Access Control Tests** (`__tests__/contact-requests/access.test.ts`):

- `canCreateContactRequest`: role checks, subscription checks, validation checks
- `canViewContactRequest`: ownership checks, admin access
- `canRespondToContactRequest`: talent ownership, status checks
- `canSubmitMoreRequests`: rate limiting logic

**Service Tests** (`__tests__/contact-requests/service.test.ts`):

- Request creation with validation
- Status transition logic (approve, decline)
- Notification triggers
- Contact info reveal logic

### Manual Testing

1. Create request as professional with active subscription
2. Verify talent receives notification
3. Approve request as talent
4. Verify requester sees contact info
5. Decline request and verify email sent
6. Test rate limiting (6th request should fail)
7. Test as unapproved professional (should be blocked)

---

## UI/UX Considerations

### Request Form

- Project type dropdown (Film, TV Series, Commercial, etc.)
- Optional project name field
- Required purpose textarea (min 50 characters)
- Optional personal message
- Clear indication that talent must approve before contact info is shared

### Request Cards

- Show project type, purpose preview, status badge
- Timestamp and time elapsed
- Action buttons contextual to user role and status

### Contact Info Reveal

- Display only after approval
- Show email, phone, and any agent details
- Clear visual indication this is private information
- Option to copy to clipboard

---

## Security Considerations

### Privacy Protection

- Contact info (phone, email) NEVER exposed before approval
- All contact attempts logged for audit
- Talents can report suspicious requests (future enhancement)

### Rate Limiting

- 5 pending requests per requester per day
- Prevents spam and protects talents from harassment

### Access Control

- Server-side validation for all operations
- Subscription status verified on each request
- Admin oversight capability for abuse prevention

---

## Estimated Effort

| Category       | Tasks  | Est. Hours |
| -------------- | ------ | ---------- |
| Setup          | 3      | 0.5        |
| Foundation     | 4      | 1.0        |
| Implementation | 9      | 2.0        |
| Integration    | 2      | 0.5        |
| Testing        | 2      | 0.5        |
| **Total**      | **20** | **4.5**    |

---

## Notes

### Design Decisions

1. **No bulk requests**: Keeps the system simple and prevents mass outreach abuse
2. **Status finality**: Approved/declined states are final to prevent gaming
3. **Rate limiting**: 5/day is generous for legitimate use but prevents spam
4. **CONTACT_REQUEST type**: Already exists in NotificationType enum, ready to use

### Future Enhancements

- Request expiry automation (auto-expire after 30 days)
- Bulk request capability for verified companies
- Request templates for common project types
- Integration with messaging for follow-up conversations

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
