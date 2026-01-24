# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-16
**Project State**: Phase 02 - Registration & Payments
**Completed Sessions**: 12

---

## Recommended Next Session

**Session ID**: `phase02-session02-company_registration`
**Session Name**: Company Registration
**Estimated Duration**: 3-4 hours
**Estimated Tasks**: 18-22

---

## Why This Session Next?

### Prerequisites Met

- [x] Phase 00: Foundation complete (database, auth, admin dashboard)
- [x] Phase 01: Talent Management complete (profiles, gallery, search)
- [x] Session 01: Professional Registration complete (email verification, admin queue patterns)

### Dependencies

- **Builds on**: Professional Registration (reuses email, validation, admin queue patterns)
- **Enables**: Payment Integration (Session 03 handles payments for all user types)

### Project Progression

Company Registration logically follows Professional Registration as both are user registration flows. The infrastructure built in Session 01 (email verification, admin validation queue, registration wizard pattern) can be leveraged for Company accounts. Completing both registration types before Payment Integration ensures all user types are ready for subscription processing.

---

## Session Overview

### Objective

Complete registration and onboarding flow for production companies with multi-user support.

### Key Deliverables

1. Company registration form (company name, registration number, contacts)
2. Company profile page with team member management
3. Admin queue for company validation
4. Company dashboard skeleton
5. Multi-user company accounts with invite system

### Scope Summary

- **In Scope (MVP)**: Registration form, email verification, company profile, admin approval, basic team invites
- **Out of Scope**: Advanced team permissions, document verification uploads, company branding customization

---

## Technical Considerations

### Technologies/Patterns

- Reuse RegistrationWizard pattern from Session 01
- React Hook Form + Zod for form validation
- Prisma schema extension for Company and CompanyMember models
- Server Actions for registration and team management
- Resend for invitation emails

### Potential Challenges

- Company-User relationship modeling (many-to-many with roles)
- Team invitation workflow (invite -> accept flow)
- Company vs individual authentication handling

### Relevant Considerations

- **Admin validation workflow**: Extends existing pattern to companies
- **Tiered access control**: Companies get premium access like professionals
- **Payment integration**: Company registration prepares for Session 03 subscription handling

---

## Alternative Sessions

If this session is blocked:

1. **Session 03: Payment Integration** - Could start Stripe setup, but better to complete all user types first
2. **Session 05: Access Control** - Could implement middleware, but needs subscription data from Session 03-04

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
