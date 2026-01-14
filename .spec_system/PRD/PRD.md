# Talents Acting - Product Requirements Document

## Overview

A talent management platform for actors, comedians, and performers - showcasing profiles, connecting with film professionals, and managing talent databases for the Acting Institute (actinginstitute.ma).

Morocco is a popular destination for international productions, and this platform will present a diverse selection of internal and external actors. Through collaborations with film professionals, the platform facilitates the rapid integration of talents into productions.

## Goals

1. Create a searchable talent database with photos, names, gender, and age ranges
2. Enable film professionals and companies to access detailed talent profiles after registration
3. Provide a comprehensive talent registration system with validation workflow
4. Implement tiered access control (public vs premium information)
5. Support advanced filtering across physical attributes, skills, languages, and availability

## User Types

### Visitors (Public)
- Can view basic talent info: photo, first name, gender, age-playing range
- Cannot access contact info, videos, or detailed profiles

### Talents (Actors/Performers)
- Can register and create detailed profiles
- Can upload photos, videos, showreels
- Non-students pay membership fee for profile posting
- Can modify their own profiles

### Professionals (Film Industry)
- Pay for access to the database
- Can view complete talent profiles including contact info
- Require admin validation after registration

### Companies
- Similar to professionals but for production companies
- Pay for access to the database
- Require admin validation after registration

### Administrator
- Validates talent profiles before posting
- Validates professional/company registrations
- Can modify any profile

## Phases

| Phase | Name | Sessions | Status |
|-------|------|----------|--------|
| 00 | Foundation | 6 | Not Started |

## Phase 00: Foundation

### Objectives

1. Establish project infrastructure with modern, maintainable tech stack
2. Design comprehensive database schema supporting all user types and talent profiles
3. Implement secure authentication with role-based access control
4. Create responsive UI foundation aligned with reference sites
5. Build talent profile CRUD with public/premium data separation
6. Set up admin dashboard for validation workflows

### Sessions

| Session | Name | Est. Tasks |
|---------|------|------------|
| 01 | Project Setup & Tech Stack | ~15 |
| 02 | Database Schema Design | ~18 |
| 03 | Core UI Framework | ~15 |
| 04 | Authentication System | ~20 |
| 05 | Talent Profile Foundation | ~18 |
| 06 | Admin Dashboard Foundation | ~15 |

Run `/nextsession` to begin implementation.

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript (responsive and interactive)
- **Backend**: PHP or appropriate backend language
- **Database**: To be determined (integration with Google Sheets mentioned as option)
- **Security**: Secure login system, data protection

## Core Features

### Talent Profiles

**Public Information:**
- Photo (front page)
- First Name (front page)
- Gender (front page)
- Age-playing range (0-100)

**Premium Information (Requires Registration):**
- Presentation video
- Showreel
- Last Name
- Email
- Phone number
- Birthday, Birthplace, Location
- Physical attributes (height, physique, ethnic appearance, eye/hair color, hair length)
- Unique traits (beard type, tattoos, scars)
- Voice type
- Work history
- Languages spoken (Moroccan Darija, Arabic, Berber, French, English, Spanish, Portuguese, etc.)
- Accents (extensive list for Moroccan, English, French accents)
- Athletic skills (martial arts, sports, etc.)
- Musical instruments
- Performance skills (stunts, singing, combat, etc.)
- Dance styles
- Nationalities and ethnicities
- Disabilities (cognitive, hearing, mobility, vision)
- Acting training and experience
- Prices and nominations
- Book and Showreel availability
- Level/Rating
- Availability and rates

### Registration Forms

**Talents:**
- Comprehensive profile form
- Non-students notified of membership fee
- Profile posted after validation and payment

**Professionals:**
- Name, First Name, Profession
- Email, Phone Number
- Reason for access
- Fee-based access with post-payment information

**Companies:**
- Similar to professional form
- Company details
- Fee-based access

### Filtering System

Extensive filters including:
- Gender, Age Range, Name
- Physical attributes
- Skills and languages
- Availability and rates
- Experience level

## Success Criteria

- [ ] Responsive web page accessible at actinginstitute.ma/talents
- [ ] Talent profiles display correctly with public/premium separation
- [ ] Registration forms work for all user types
- [ ] Admin validation workflow functional
- [ ] Advanced filtering works across all criteria
- [ ] Secure login system protects premium data
- [ ] Payment integration for membership fees

## Reference Sites

- http://agence-singuliere.com/project-type/talents/
- https://agencem.com/actors/
- https://agencejohnson.com/nos-artistes/
