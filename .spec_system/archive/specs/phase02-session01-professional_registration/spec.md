# Session Specification

**Session ID**: `phase02-session01-professional_registration`
**Phase**: 02 - Registration & Payments
**Status**: Not Started
**Created**: 2026-01-16

---

## 1. Session Overview

This session implements the complete registration and onboarding flow for film professionals who want access to the talent database. Film professionals - including directors, casting directors, producers, and talent agents - represent the primary paying customers of the platform, requiring a robust registration system with admin validation.

The professional registration system builds on the existing authentication infrastructure from Phase 00 and extends it with a multi-step wizard form, email verification, and an admin validation queue. Once registered and validated, professionals can access the full talent database including contact information, videos, and detailed portfolios.

This session establishes the registration pattern that will be reused for company registration in Session 02. It validates the admin workflow before adding payment complexity in Session 03, ensuring a solid foundation for the monetization features to follow.

---

## 2. Objectives

1. Create ProfessionalProfile database model with validation status tracking
2. Implement multi-step registration wizard with form validation
3. Build email verification workflow with token management
4. Add admin validation queue with approve/reject functionality
5. Create professional dashboard and profile management page

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session02-database_schema` - User model and Prisma setup
- [x] `phase00-session04-authentication` - NextAuth with role-based access
- [x] `phase00-session06-admin_dashboard` - Admin layout and navigation

### Required Tools/Knowledge

- Prisma schema migrations
- React Hook Form with Zod validation
- Server Actions for form handling
- Email service (Resend, Nodemailer, or similar)

### Environment Requirements

- PostgreSQL database running
- Email service API key (for verification emails)
- SMTP or API-based email configuration

---

## 4. Scope

### In Scope (MVP)

- ProfessionalProfile Prisma model with all required fields
- 4-step registration wizard (Account, Personal, Professional, Terms)
- Email verification with token generation and validation
- Admin queue page showing pending professionals
- Approve/reject actions with email notifications
- Professional dashboard with status display
- Profile page for viewing/editing own profile
- Resend verification email functionality

### Out of Scope (Deferred)

- Payment processing - _Reason: Session 03 scope_
- Subscription management - _Reason: Session 04 scope_
- Team/company association - _Reason: Session 02 scope_
- Profile photo upload - _Reason: Can use existing media system later_
- Social login (Google, LinkedIn) - _Reason: Future enhancement_

---

## 5. Technical Approach

### Architecture

The registration flow follows a stateful wizard pattern with client-side state management. Each step validates independently before allowing progression. Server actions handle form submission, email sending, and admin actions.

```
[Registration Wizard] -> [Server Action] -> [Database]
                                        -> [Email Service]

[Admin Queue] -> [Server Action] -> [Update Status]
                                -> [Send Notification]
```

### Design Patterns

- **Wizard Pattern**: Multi-step form with progress indicator and back/next navigation
- **Token-based Verification**: Secure, time-limited email verification tokens
- **Server Actions**: Form submissions without API routes
- **Optimistic Updates**: Immediate UI feedback with server confirmation

### Technology Stack

- Prisma 6.x - Database ORM
- React Hook Form 7.x - Form state management
- Zod 3.x - Schema validation
- Resend (or Nodemailer) - Email delivery
- NextAuth 5.x - Session management

---

## 6. Deliverables

### Files to Create

| File                                                 | Purpose                       | Est. Lines |
| ---------------------------------------------------- | ----------------------------- | ---------- |
| `prisma/schema.prisma` (extend)                      | Add ProfessionalProfile model | ~30        |
| `app/(auth)/register/professional/page.tsx`          | Registration page             | ~50        |
| `components/professional/RegistrationWizard.tsx`     | Multi-step form container     | ~150       |
| `components/professional/steps/AccountStep.tsx`      | Email/password step           | ~80        |
| `components/professional/steps/PersonalStep.tsx`     | Name/profession step          | ~80        |
| `components/professional/steps/ProfessionalStep.tsx` | Company/reason step           | ~80        |
| `components/professional/steps/TermsStep.tsx`        | Terms acceptance step         | ~60        |
| `components/professional/ProgressIndicator.tsx`      | Wizard progress UI            | ~40        |
| `app/dashboard/professional/page.tsx`                | Professional dashboard        | ~100       |
| `app/dashboard/professional/profile/page.tsx`        | Profile management            | ~120       |
| `app/admin/professionals/page.tsx`                   | Admin validation queue        | ~150       |
| `app/admin/professionals/[id]/page.tsx`              | Professional detail view      | ~120       |
| `lib/professional/actions.ts`                        | Server actions                | ~200       |
| `lib/professional/queries.ts`                        | Database queries              | ~80        |
| `lib/professional/validation.ts`                     | Zod schemas                   | ~60        |
| `lib/email/send.ts`                                  | Email sending utility         | ~50        |
| `lib/email/templates/verification.tsx`               | Verification email            | ~40        |
| `lib/email/templates/approved.tsx`                   | Approval notification         | ~30        |
| `lib/email/templates/rejected.tsx`                   | Rejection notification        | ~30        |
| `app/verify-email/page.tsx`                          | Email verification handler    | ~60        |

### Files to Modify

| File                                | Changes                          | Est. Lines |
| ----------------------------------- | -------------------------------- | ---------- |
| `components/admin/AdminSidebar.tsx` | Add Professionals link           | ~5         |
| `app/admin/layout.tsx`              | Ensure professionals route works | ~5         |
| `lib/auth.ts`                       | Add professional role handling   | ~20        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Professionals can complete 4-step registration form
- [ ] Email verification link is sent and works
- [ ] Resend verification option available
- [ ] Admins see pending professionals in queue
- [ ] Admins can approve professionals with one click
- [ ] Admins can reject professionals with reason
- [ ] Approved professionals receive email notification
- [ ] Rejected professionals receive email with reason
- [ ] Approved professionals can log in and see dashboard
- [ ] Professionals can view and edit their profile

### Testing Requirements

- [ ] Unit tests for validation schemas
- [ ] Unit tests for server actions (mocked DB)
- [ ] Manual testing of full registration flow
- [ ] Manual testing of admin approval flow
- [ ] Manual testing of email verification

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] No ESLint warnings

---

## 8. Implementation Notes

### Key Considerations

- Email deliverability: Use proper SPF/DKIM if using custom domain
- Token security: Use crypto.randomBytes for verification tokens
- Token expiry: 24-hour expiry for email verification tokens
- Form state: Persist wizard state to handle page refreshes
- Error handling: Clear error messages for duplicate emails, invalid tokens

### Potential Challenges

- **Email configuration**: May need environment-specific setup
  - Mitigation: Start with console.log in dev, add real email later
- **Token race conditions**: User clicking verify link multiple times
  - Mitigation: Make verification idempotent
- **Admin notification overload**: Many pending registrations
  - Mitigation: Batch notifications or admin digest email (future)

### Relevant Considerations

<!-- From CONSIDERATIONS.md -->

- [P00] **Admin validation workflow**: This session implements the core admin validation pattern that will be reused for companies. Ensure the queue UI is flexible for different registration types.
- [P00] **Secure login system**: Professional registration handles sensitive industry contact data. Ensure proper validation and sanitization of all inputs.

### ASCII Reminder

All output files must use ASCII-only characters (0-127). No smart quotes, em-dashes, or special Unicode characters.

---

## 9. Testing Strategy

### Unit Tests

- Zod validation schemas (valid/invalid inputs)
- Server action logic with mocked Prisma
- Token generation and validation
- Email template rendering

### Integration Tests

- Registration form submission flow
- Email verification endpoint
- Admin approve/reject actions

### Manual Testing

- Complete registration as new professional
- Verify email link in browser
- Login after approval
- View and edit profile
- Admin: approve a professional
- Admin: reject a professional with reason

### Edge Cases

- Duplicate email registration attempt
- Expired verification token
- Invalid verification token
- Re-verify already verified email
- Admin action on non-existent professional
- Form submission with validation errors

---

## 10. Dependencies

### External Libraries

- `resend` or `nodemailer`: Email delivery
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Zod resolver for react-hook-form
- `zod`: Schema validation

### Other Sessions

- **Depends on**: phase00-session04-authentication, phase00-session06-admin_dashboard
- **Depended by**: phase02-session02-company_registration, phase02-session03-payment_integration

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
