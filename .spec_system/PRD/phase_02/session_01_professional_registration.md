# Session 01: Professional Registration

**Phase**: 02 - Registration & Payments
**Status**: Not Started
**Estimated Tasks**: 18
**Estimated Duration**: 2-3 hours

---

## Objective

Implement complete registration and onboarding flow for film professionals who want access to the talent database.

---

## Context

Film professionals (directors, casting directors, producers, agents) need to register and pay for access to view complete talent profiles including contact information, videos, and detailed portfolios. Their registrations require admin validation to ensure legitimacy.

---

## Key Deliverables

### 1. Database Schema Extension

- ProfessionalProfile model with all required fields
- Relationship to User model
- Validation status tracking

### 2. Registration Form

- Multi-step registration wizard
- Fields: name, profession, company, email, phone, reason for access
- Terms and conditions acceptance
- Form validation with Zod

### 3. Email Verification

- Verification email on registration
- Verification token management
- Resend verification option

### 4. Professional Profile Page

- View own profile
- Edit profile information
- Subscription status display

### 5. Admin Validation Queue

- Professional queue in admin dashboard
- Review professional details
- Approve/reject with reason
- Email notification on decision

### 6. Professional Dashboard

- Landing page after login
- Subscription status
- Quick access to talent search
- Account settings link

---

## Technical Approach

### Database

```prisma
model ProfessionalProfile {
  id               String   @id @default(cuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id])
  firstName        String
  lastName         String
  profession       String   // e.g., "Casting Director", "Producer"
  company          String?
  phone            String?
  reasonForAccess  String   @db.Text
  validationStatus ValidationStatus @default(PENDING)
  validatedAt      DateTime?
  validatedBy      String?
  rejectionReason  String?
  subscriptionStatus SubscriptionStatus @default(NONE)
  subscriptionEndsAt DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

enum SubscriptionStatus {
  NONE
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
}
```

### Form Steps

1. **Account**: Email, password, confirm password
2. **Personal**: First name, last name, profession
3. **Professional**: Company (optional), phone, reason for access
4. **Terms**: Accept terms, privacy policy

### Email Templates

- Verification email with token link
- Registration confirmation
- Validation approved
- Validation rejected

---

## Scope

### In Scope (MVP)

- Professional registration form
- Email verification
- Admin validation queue
- Basic profile page
- Validation email notifications

### Out of Scope

- Payment processing (Session 03)
- Subscription management (Session 04)
- Team/company association
- Profile photo upload
- Social login

---

## Files to Create/Modify

### New Files

- `prisma/schema.prisma` - Add ProfessionalProfile
- `app/(auth)/register/professional/page.tsx` - Registration page
- `components/professional/RegistrationWizard.tsx` - Multi-step form
- `components/professional/steps/*.tsx` - Individual form steps
- `app/dashboard/professional/page.tsx` - Professional dashboard
- `app/dashboard/professional/profile/page.tsx` - Profile page
- `app/admin/professionals/page.tsx` - Admin queue
- `app/admin/professionals/[id]/page.tsx` - Professional detail view
- `lib/professional/actions.ts` - Server actions
- `lib/professional/queries.ts` - Database queries
- `lib/professional/validation.ts` - Zod schemas
- `lib/email/templates/verification.ts` - Email template
- `lib/email/templates/validation.ts` - Email templates

### Modified Files

- `app/admin/layout.tsx` - Add professionals link
- `components/admin/AdminSidebar.tsx` - Add menu item

---

## Success Criteria

- [ ] Professionals can complete registration form
- [ ] Email verification works end-to-end
- [ ] Admins see pending professionals in queue
- [ ] Admins can approve/reject with notifications
- [ ] Approved professionals can log in
- [ ] Professional dashboard shows correct status
- [ ] All forms validate correctly

---

## Testing Checklist

- [ ] Registration form validation
- [ ] Email verification flow
- [ ] Admin approval flow
- [ ] Admin rejection flow
- [ ] Duplicate email handling
- [ ] Session management after registration
- [ ] Responsive design on mobile
