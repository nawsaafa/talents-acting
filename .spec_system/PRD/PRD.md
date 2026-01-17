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

| Phase | Name                    | Sessions | Status      |
| ----- | ----------------------- | -------- | ----------- |
| 00    | Foundation              | 6        | Complete    |
| 01    | Talent Management       | 5        | Complete    |
| 02    | Registration & Payments | 5        | In Progress |

## Phase 00: Foundation

### Objectives

1. Establish project infrastructure with modern, maintainable tech stack
2. Design comprehensive database schema supporting all user types and talent profiles
3. Implement secure authentication with role-based access control
4. Create responsive UI foundation aligned with reference sites
5. Build talent profile CRUD with public/premium data separation
6. Set up admin dashboard for validation workflows

### Sessions

| Session | Name                       | Est. Tasks |
| ------- | -------------------------- | ---------- |
| 01      | Project Setup & Tech Stack | ~15        |
| 02      | Database Schema Design     | ~18        |
| 03      | Core UI Framework          | ~15        |
| 04      | Authentication System      | ~20        |
| 05      | Talent Profile Foundation  | ~18        |
| 06      | Admin Dashboard Foundation | ~15        |

Run `/nextsession` to begin implementation.

## Technical Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Frontend**: React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials + OAuth providers
- **Payments**: Stripe (subscriptions, one-time payments, customer portal)
- **File Storage**: TBD (Cloudinary, S3, or similar)
- **Email**: React Email templates with Resend/SendGrid
- **Deployment**: Vercel (recommended)

### Legacy System (for reference/migration)

- **Platform**: WordPress + MariaDB
- **Plugins**: Gravity Forms, Ultimate Member, Elementor

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

---

## Legacy Database Migration

### Previous System Overview

| Aspect            | Details                                                   |
| ----------------- | --------------------------------------------------------- |
| **Platform**      | WordPress + MariaDB (Hostinger)                           |
| **URL**           | new.talents.actinginstitute.ma                            |
| **Key Plugins**   | Gravity Forms, Ultimate Member, Elementor, Frontend Admin |
| **Actor Records** | ~35 published actor profiles to migrate                   |
| **Source Files**  | `u910603639_kQhpe.sql`, `information_schema.sql`          |

### Field Mapping: Legacy → Current Schema

#### Personal Information

| Legacy Field      | Legacy Type           | Current Field      | Status                 |
| ----------------- | --------------------- | ------------------ | ---------------------- |
| Name              | text (required)       | firstName/lastName | ✅ Mapped              |
| Email             | email (required)      | contactEmail       | ✅ Mapped              |
| Phone             | phone intl (required) | contactPhone       | ✅ Mapped              |
| Gender            | select (M/F/Other)    | gender enum        | ✅ Mapped              |
| Date of Birth     | date (required)       | dateOfBirth        | ✅ Mapped              |
| Place of Birth    | text (required)       | —                  | ⚠️ **ADD: birthPlace** |
| Playing Age Range | multiselect brackets  | ageRangeMin/Max    | ✅ Mapped (better)     |

#### Location (Moroccan Regions)

Legacy provides 17 predefined Moroccan regions + "Out of Morocco":

```
Grand Casablanca, Rabat-Salé-Zemmour-Zaër, Doukhala-Abda, Tanger-Tétouan,
Marrakech-Tensift-Al Haouz, Agadir-Sous-Massa-Drâa, Oued Ed-Dahab-Lagouira,
Laâyoune-Boujdour-Sakia el Hamra, Guelmim-Es Smara, Fès-Boulemane,
Meknès-Tafilalet, Oujda-L'Oriental, Taza-Al Hoceima-Taounate, Tadla-Azilal,
Gharb-Chrarda-Beni Hssen, Chaouia-Ouardigha, Out of Morocco
```

Current: `location` (free text) — Consider adding region enum for filtering.

#### Physical Attributes

| Legacy Field | Legacy Options                                                      | Current Field   | Status    |
| ------------ | ------------------------------------------------------------------- | --------------- | --------- |
| Height       | 60cm - 2m (increments)                                              | height (cm)     | ✅ Mapped |
| Body Type    | athletic, average, heavyset, slim, skinny                           | physique enum   | ✅ Mapped |
| Eye Color    | Brown, Hazel, Amber, Green, Blue, Gray, Violet, Black               | eyeColor enum   | ✅ Mapped |
| Hair Color   | Bald, Black, Blond(e), Brown, Grey, Red, Salt/Pepper, Silver, White | hairColor enum  | ✅ Mapped |
| Hair Length  | Bald, Buzz Cut, Chin Length, Long, Receding, Short, Shoulder Length | hairLength enum | ✅ Mapped |
| Beard Type   | 10 options (No Beard, Mustache, Light, Full, Goatee, etc.)          | beardType enum  | ✅ Mapped |

#### Skills & Talents (Predefined Options for Seeding)

| Category            | Count | Sample Options                                                                                                                                                                              |
| ------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Languages           | 8     | Moroccan Darija, Arabic, Berber, French, English, Spanish, Italian, Portuguese                                                                                                              |
| Athletic Skills     | 29    | Aerobics, Martial arts, Basketball, Boxing, Cycling, Horse riding, Fencing, Football, Golf, Gymnastics, Swimming, Tennis, Yoga...                                                           |
| Musical Instruments | 28    | Accordion, Banjo, Bass, Clarinet, Drums, Flute, Guitar, Harmonica, Harp, Piano, Saxophone, Violin, Cello...                                                                                 |
| Dance Styles        | 33    | **Moroccan:** Ahidous, Ahwach, Chaâbi, Gnawa, Guedra, Reggada; **International:** Ballet, Hip-hop, Salsa, Tango, Flamenco, Contemporary...                                                  |
| Performance Skills  | 25    | Comedian, Contortionist, Dancing, DJ, Diving, Firearms, Host, Improvisation, Juggling, Magic, Mime, Pilot, Singing, Stage Combat, Stunts, Voiceover...                                      |
| Accents             | ~70   | **Moroccan:** Chamali, Soussi, Marrakchi, Casaoui/Rbati, Oujdi, Sahraoui; **English:** British, American, Australian, Scottish, Irish; **French:** Parisian, Belgian, Maghreb, Quebecois... |

#### Ethnicity/Appearance

Legacy options: All, Asian, Black/African American, Hispanic/Latino/Latina/Latine, Indigenous, Middle Eastern/North African, Native American/Alaska Native, Native Hawaiian/Pacific Islander, White

Current: `ethnicAppearance` (free text) — Consider structured enum for filtering.

#### Professional Information

| Legacy Field  | Legacy Options                                                    | Current Field | Status                                    |
| ------------- | ----------------------------------------------------------------- | ------------- | ----------------------------------------- |
| Rates Per Day | 200-10000+ MAD brackets                                           | dailyRate     | ✅ Mapped (Decimal)                       |
| Availability  | Always, 1-2 days, 1-2 weeks, 1-4 months, Weekends, Evenings, Days | isAvailable   | ⚠️ **ENHANCE: Add AvailabilityType enum** |
| Showreel      | YouTube URL                                                       | showreel      | ✅ Mapped                                 |
| IMDB Link     | URL                                                               | —             | ⚠️ **ADD: imdbUrl or extend socialMedia** |

### Schema Enhancements Required

#### High Priority

```prisma
// Add to TalentProfile model
birthPlace String? // Place of birth (legacy required field)
```

#### Medium Priority

```prisma
// New enum for rich availability options
enum AvailabilityType {
  ALWAYS
  SHORT_TERM_1_2_DAYS
  MEDIUM_TERM_1_2_WEEKS
  LONG_TERM_1_4_MONTHS
  WEEKENDS_AND_HOLIDAYS
  HOLIDAYS_ONLY
  WEEKENDS_ONLY
  EVENINGS
  DAYS
}

// Add to TalentProfile
availabilityTypes AvailabilityType[] // Multi-select availability
imdbUrl           String?            // IMDB profile link
```

#### Low Priority (UI/Seed Data)

- Add predefined region options for Moroccan locations
- Add ethnicity enum for structured filtering
- Seed database with legacy skill/language/accent options

### Data Migration Plan

#### Phase 1: Schema Updates

- [ ] Add `birthPlace` field to TalentProfile
- [ ] Add `availabilityTypes` enum and field
- [ ] Add `imdbUrl` field

#### Phase 2: Seed Data

- [ ] Populate language options (8 values)
- [ ] Populate athletic skills (29 values)
- [ ] Populate musical instruments (28 values)
- [ ] Populate dance styles (33 values)
- [ ] Populate performance skills (25 values)
- [ ] Populate accent options (~70 values)
- [ ] Populate Moroccan region options (17 values)

#### Phase 3: Data Migration

- [ ] Export ~35 actor profiles from WordPress
- [ ] Transform WordPress user accounts → Auth system
- [ ] Transform Gravity Forms entries → TalentProfile records
- [ ] Migrate media files from WordPress uploads
- [ ] Validate migrated data integrity

### User Role Mapping

| Legacy Role | Description   | Current Equivalent |
| ----------- | ------------- | ------------------ |
| `actors`    | Talent users  | `TALENT` ✅        |
| `visitors`  | Free viewers  | Public access ✅   |
| (implicit)  | Professionals | `PROFESSIONAL` ✅  |
| (implicit)  | Companies     | `COMPANY` ✅       |
| (implicit)  | Admin         | `ADMIN` ✅         |

### Legacy Form Workflow Reference

1. Form submission via Gravity Forms
2. Admin notification email (to ubmalik123@gmail.com)
3. User confirmation email
4. Account activation email with password setup link
5. Admin validates profile
6. Profile published

This workflow is already implemented in our current system via the registration and admin validation features.
