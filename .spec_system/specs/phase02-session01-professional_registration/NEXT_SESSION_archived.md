# NEXT_SESSION.md

## Session Recommendation

**Generated**: 2026-01-16
**Project State**: Phase 02 - Registration & Payments
**Completed Sessions**: 11 (Phase 00: 6, Phase 01: 5)

---

## Recommended Next Session

**Session ID**: `phase02-session01-professional_registration`
**Session Name**: Professional Registration
**Estimated Duration**: 2-3 hours
**Estimated Tasks**: 18

---

## Why This Session Next?

### Prerequisites Met

- [x] Database schema with User model (Phase 00)
- [x] Authentication with NextAuth (Phase 00)
- [x] Admin dashboard foundation (Phase 00)
- [x] Talent profiles and gallery (Phase 01)

### Dependencies

- **Builds on**: Phase 00 authentication and Phase 01 talent management
- **Enables**: Payment integration (Session 03), access control (Session 05)

### Project Progression

With Phase 01 complete, the platform has a fully functional talent showcase with search, filtering, and media. The next logical step is enabling the paying customers - film professionals - to register and access the full talent database.

Professional registration is the first step because:

1. Professionals are the primary paying users
2. Their registration pattern will be reused for companies
3. It validates the admin workflow before adding payment complexity

---

## Session Overview

### Objective

Implement complete registration and onboarding flow for film professionals who want access to the talent database.

### Key Deliverables

1. ProfessionalProfile database model
2. Multi-step registration wizard form
3. Email verification workflow
4. Admin validation queue for professionals
5. Professional dashboard with profile page
6. Validation email notifications

### Scope Summary

- **In Scope (MVP)**: Registration form, email verification, admin queue, basic profile
- **Out of Scope**: Payment processing, subscription management, team accounts

---

## Technical Considerations

### Technologies/Patterns

- Prisma schema extension for ProfessionalProfile
- Multi-step form wizard (similar to ProfileWizard from Phase 01)
- Email service integration (Resend, Nodemailer, or similar)
- Server actions for form handling

### Potential Challenges

- Email deliverability configuration
- Token-based verification flow
- Extending admin dashboard without breaking existing layouts

### Relevant Considerations

- [P00] **Tiered access control**: Must maintain at query level, not just UI
- [P00] **Admin validation workflow**: For all user registrations

---

## Alternative Sessions

If this session is blocked:

1. **Session 02: Company Registration** - Similar flow, could be done first
2. **Phase 01 polish** - Additional enhancements to existing features

---

## Next Steps

Run `/sessionspec` to generate the formal specification.
