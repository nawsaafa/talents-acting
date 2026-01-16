# Session Specification

**Session ID**: `phase02-session02-company_registration`
**Phase**: 02 - Registration & Payments
**Status**: Not Started
**Created**: 2026-01-16

---

## 1. Session Overview

This session completes the company registration flow with multi-user support for production companies, talent agencies, and other organizations that need access to the talent database. While a basic company registration form already exists, this session enhances it with email verification, team invitation capabilities, and a company dashboard.

Companies represent a key customer segment for the platform - they often have multiple team members who need access to search and contact talent. The multi-user feature differentiates company accounts from individual professional accounts, allowing one company subscription to serve an entire team (future payment integration will handle this).

This session reuses the patterns established in Session 01 (Professional Registration): the email verification workflow, admin validation queue, and form validation approach. The primary new functionality is the team member invitation system, which allows company admins to invite colleagues to join their company account.

---

## 2. Objectives

1. Enhance company registration with email verification and multi-step wizard
2. Implement team member invitation workflow (invite, accept, manage)
3. Create company dashboard with team management and status display
4. Add company detail page to admin queue for review

---

## 3. Prerequisites

### Required Sessions

- [x] `phase00-session02-database_schema` - CompanyProfile model exists
- [x] `phase00-session04-authentication` - NextAuth with COMPANY role
- [x] `phase00-session06-admin_dashboard` - Admin companies queue exists
- [x] `phase02-session01-professional_registration` - Email verification patterns

### Required Tools/Knowledge

- Prisma schema migrations (for CompanyMember model)
- React Hook Form with Zod validation
- Server Actions for registration and team management
- Email service (Resend) - already configured

### Environment Requirements

- PostgreSQL database running
- RESEND_API_KEY (optional - logs to console in dev)

---

## 4. Scope

### In Scope (MVP)

- Enhanced registration wizard (Account, Company Info, Contact, Terms)
- Email verification for company admin accounts
- CompanyMember model for team relationships
- Team invitation system (send invite, accept invite)
- Company dashboard with status and team list
- Company profile view/edit page
- Admin company detail page for approval review
- Invitation email templates

### Out of Scope (Deferred)

- Team member roles/permissions - _Reason: All team members get same access initially_
- Document upload for verification - _Reason: Business license verification is future enhancement_
- Multiple company accounts per user - _Reason: Simplifies initial implementation_
- Team member removal by admin - _Reason: Company admin manages their own team_
- Invitation expiry - _Reason: Can add in future iteration_

---

## 5. Technical Approach

### Architecture

The company registration follows the same wizard pattern as professional registration. The key difference is the CompanyMember join table that enables many-to-many relationship between Users and Companies, allowing team invitations.

```
[Company Registration] -> [Server Action] -> [Database: User + CompanyProfile]
                                          -> [Email: Verification]

[Team Invitation] -> [Server Action] -> [Database: CompanyMember (PENDING)]
                                     -> [Email: Invitation]

[Accept Invite] -> [Server Action] -> [Database: CompanyMember (ACTIVE)]
                                   -> [Create User if needed]
```

### Design Patterns

- **Wizard Pattern**: Reuse from professional registration
- **Invitation Token**: Secure link for team member onboarding
- **Role-based Access**: Company admin vs team member (future)
- **Server Actions**: All mutations via server actions

### Technology Stack

- Prisma 6.x - Database ORM with new CompanyMember model
- React Hook Form 7.x - Form state management
- Zod 4.x - Schema validation
- Resend - Email delivery (reuse lib/email/send.ts)
- NextAuth 5.x - Session management

---

## 6. Deliverables

### Files to Create

| File                                            | Purpose                                           | Est. Lines |
| ----------------------------------------------- | ------------------------------------------------- | ---------- |
| `lib/company/validation.ts`                     | Zod schemas for registration and invitation       | ~100       |
| `lib/company/queries.ts`                        | Database queries for companies and members        | ~150       |
| `lib/company/actions.ts`                        | Server actions for registration, invites, profile | ~300       |
| `components/company/RegistrationWizard.tsx`     | Multi-step form container                         | ~160       |
| `components/company/ProgressIndicator.tsx`      | Wizard progress UI                                | ~80        |
| `components/company/steps/AccountStep.tsx`      | Email/password step                               | ~100       |
| `components/company/steps/CompanyStep.tsx`      | Company info step                                 | ~120       |
| `components/company/steps/ContactStep.tsx`      | Contact details step                              | ~100       |
| `components/company/steps/TermsStep.tsx`        | Terms acceptance step                             | ~100       |
| `components/company/TeamManagement.tsx`         | Team member list and invite form                  | ~180       |
| `components/company/InviteMemberForm.tsx`       | Invite team member form                           | ~100       |
| `app/(auth)/register/company/success/page.tsx`  | Registration success page                         | ~50        |
| `app/invite/page.tsx`                           | Accept invitation handler                         | ~80        |
| `app/invite/InviteContent.tsx`                  | Invitation acceptance UI                          | ~150       |
| `app/dashboard/company/page.tsx`                | Company dashboard                                 | ~250       |
| `app/dashboard/company/profile/page.tsx`        | Company profile management                        | ~60        |
| `app/dashboard/company/profile/ProfileForm.tsx` | Editable profile form                             | ~180       |
| `app/dashboard/company/team/page.tsx`           | Team management page                              | ~150       |
| `app/admin/companies/[id]/page.tsx`             | Admin company review page                         | ~280       |
| `lib/email/templates/company-invitation.tsx`    | Team invitation email                             | ~100       |
| `__tests__/company/validation.test.ts`          | Unit tests for validation schemas                 | ~200       |

### Files to Modify

| File                                   | Changes                                                  | Est. Lines |
| -------------------------------------- | -------------------------------------------------------- | ---------- |
| `prisma/schema.prisma`                 | Add CompanyMember model, emailVerified to CompanyProfile | ~40        |
| `app/(auth)/register/company/page.tsx` | Replace with RegistrationWizard                          | ~30        |
| `app/admin/companies/page.tsx`         | Add links to detail pages                                | ~10        |
| `lib/admin/queries.ts`                 | Add getCompanyForReview function                         | ~30        |

---

## 7. Success Criteria

### Functional Requirements

- [ ] Companies can complete 4-step registration wizard
- [ ] Email verification link is sent and works
- [ ] Resend verification option available
- [ ] Company admin can invite team members by email
- [ ] Invited users receive invitation email with link
- [ ] Invited users can accept and create account (or link existing)
- [ ] Company dashboard shows company status and team list
- [ ] Company admin can edit company profile
- [ ] Admins see companies in queue with detail view
- [ ] Admins can approve/reject companies with reason

### Testing Requirements

- [ ] Unit tests for validation schemas
- [ ] Unit tests for server actions (mocked DB)
- [ ] Manual testing of full registration flow
- [ ] Manual testing of team invitation flow
- [ ] Manual testing of admin approval flow

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] No ESLint warnings

---

## 8. Implementation Notes

### Key Considerations

- Reuse email utility from lib/email/send.ts
- Reuse admin ValidationActions component
- Company admin is the user who registered the company
- Team members can be invited before or after company approval
- Team members inherit company's validation status for access

### Potential Challenges

- **Existing user invitation**: User with existing account gets invite
  - Mitigation: Check if email exists, link to company if so
- **Multiple invitations**: Same email invited twice
  - Mitigation: Check for existing pending invitation
- **Invitation before approval**: Team members invited to unapproved company
  - Mitigation: Allow invite, but access gated by company status

### Relevant Considerations

<!-- From CONSIDERATIONS.md -->

- [P00] **Admin validation workflow**: Extends to companies with same approve/reject pattern
- [P00] **Tiered access control**: Companies get premium access like professionals
- [P02] **Payment integration**: Company subscription will cover all team members

### ASCII Reminder

All output files must use ASCII-only characters (0-127). No smart quotes, em-dashes, or special Unicode characters.

---

## 9. Testing Strategy

### Unit Tests

- Zod validation schemas (registration, invitation)
- Server action logic with mocked Prisma
- Invitation token generation
- Email template rendering

### Integration Tests

- Registration form submission flow
- Email verification endpoint
- Invitation acceptance flow
- Admin approve/reject actions

### Manual Testing

- Complete registration as new company
- Verify email link in browser
- Invite a team member
- Accept invitation as new user
- Accept invitation as existing user
- View and edit company profile
- Admin: approve a company
- Admin: reject a company with reason

### Edge Cases

- Duplicate company email registration
- Expired verification token
- Invalid invitation token
- Invite already-registered user
- Re-invite pending invitation
- Accept expired invitation (if expiry added later)
- Company approval after team members invited

---

## 10. Dependencies

### External Libraries

No new dependencies - reuses existing:

- `resend`: Email delivery
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Zod resolver
- `zod`: Schema validation

### Other Sessions

- **Depends on**: phase02-session01-professional_registration (email patterns)
- **Depended by**: phase02-session03-payment_integration (company subscriptions)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
