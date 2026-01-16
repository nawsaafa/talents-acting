# PRD Phase 02: Registration & Payments

**Status**: In Progress
**Sessions**: 5
**Estimated Duration**: 3-4 days

**Progress**: 1/5 sessions (20%)

---

## Overview

Build the complete user registration system for all user types (Talents, Professionals, Companies) with validation workflows, and integrate payment processing for membership fees and database access. This phase transforms the platform from a showcase into a fully operational business.

---

## Progress Tracker

| Session | Name                          | Status      | Est. Tasks | Validated  |
| ------- | ----------------------------- | ----------- | ---------- | ---------- |
| 01      | Professional Registration     | Complete    | 25         | 2026-01-16 |
| 02      | Company Registration          | Not Started | 18         | -          |
| 03      | Payment Integration           | Not Started | 22         | -          |
| 04      | Subscription Management       | Not Started | 20         | -          |
| 05      | Access Control Implementation | Not Started | 18         | -          |

---

## Objectives

1. Implement registration flows for Professionals and Companies
2. Integrate payment processing for membership fees
3. Build subscription management for recurring payments
4. Enforce tiered access control based on subscription status
5. Complete admin validation workflow for all user types

---

## Prerequisites

- Phase 00: Foundation (Complete)
  - Database schema with User, TalentProfile models
  - Authentication with NextAuth
  - Admin dashboard for validation

- Phase 01: Talent Management (Complete)
  - Talent profile CRUD with media uploads
  - Advanced filtering and search
  - Public talent gallery

---

## Session Details

### Session 01: Professional Registration

**Objective**: Complete registration and onboarding flow for film professionals

**Key Deliverables**:

- Professional registration form (name, profession, company, reason for access)
- Email verification workflow
- Profile page for professionals
- Admin queue for professional validation
- Professional dashboard skeleton

**Technical Focus**:

- Form validation with Zod
- Email service integration
- Database schema for ProfessionalProfile

### Session 02: Company Registration

**Objective**: Complete registration flow for production companies

**Key Deliverables**:

- Company registration form (company name, registration, contacts)
- Company profile page with team members
- Admin queue for company validation
- Company dashboard skeleton
- Multi-user company accounts

**Technical Focus**:

- Company-user relationship modeling
- Team invitation system
- Company verification documents

### Session 03: Payment Integration

**Objective**: Integrate payment processing for one-time and recurring payments

**Key Deliverables**:

- Stripe integration (or similar)
- Checkout flow for professionals/companies
- Talent membership fee collection
- Payment confirmation emails
- Invoice generation

**Technical Focus**:

- Stripe API integration
- Webhook handling for payment events
- PCI compliance considerations
- Payment state management

### Session 04: Subscription Management

**Objective**: Handle ongoing subscriptions and renewals

**Key Deliverables**:

- Subscription status tracking
- Renewal reminders and auto-renewal
- Plan upgrades/downgrades
- Cancellation workflow
- Billing history page

**Technical Focus**:

- Stripe Subscriptions API
- Webhook handling for subscription events
- Grace period handling
- Proration calculations

### Session 05: Access Control Implementation

**Objective**: Enforce premium data access based on subscription status

**Key Deliverables**:

- Middleware for subscription checking
- Premium data protection at API level
- Graceful degradation for expired subscriptions
- Trial period support
- Access logging for compliance

**Technical Focus**:

- Role + subscription based access control
- API-level protection (not just UI)
- Performance optimization for access checks

---

## Technical Considerations

### Payment Provider

**Recommended**: Stripe

- Best documentation and developer experience
- Supports Morocco (MAD currency)
- Handles PCI compliance
- Subscription billing built-in

**Alternative**: Paddle (for tax handling)

### Pricing Model (To Be Defined)

| User Type    | Fee Type          | Suggested Range |
| ------------ | ----------------- | --------------- |
| Talent       | Annual Membership | 200-500 MAD     |
| Professional | Annual Access     | 1000-2000 MAD   |
| Company      | Annual Access     | 2000-5000 MAD   |

### Security Considerations

- Never store raw card data
- Use Stripe's hosted checkout or Elements
- Webhook signature verification
- Audit logging for payments

---

## Success Criteria

Phase complete when:

- [ ] Professionals can register and be validated
- [ ] Companies can register and be validated
- [ ] Payment processing works for all user types
- [ ] Subscriptions auto-renew correctly
- [ ] Premium data is protected by subscription status
- [ ] Admin can manage all validation queues
- [ ] Billing history and invoices accessible

---

## Dependencies

### Depends On

- Phase 00: Foundation (database, auth, admin)
- Phase 01: Talent Management (profiles, gallery)

### Enables

- Phase 03: Messaging & Bookings (talent-professional communication)
- Phase 04: Analytics & Reporting (business metrics)
