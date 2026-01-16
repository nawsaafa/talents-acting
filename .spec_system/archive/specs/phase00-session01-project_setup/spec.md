# Session Specification

**Session ID**: `phase00-session01-project_setup`
**Phase**: 00 - Foundation
**Status**: Not Started
**Created**: 2026-01-14

---

## 1. Session Overview

This session establishes the complete development foundation for the Talents Acting platform. We will initialize a Next.js 14+ application with App Router, configure PostgreSQL database connectivity via Prisma ORM, and set up all essential development tooling including TypeScript, ESLint, and Prettier.

The tech stack choice (Next.js + PostgreSQL + Prisma) provides a modern, type-safe full-stack solution. Next.js API Routes enable us to build both frontend and backend in a single codebase with shared TypeScript types, which is ideal for a talent management platform requiring tight data consistency between UI and API.

This foundational work enables all subsequent sessions. Without a working development environment, database connection, and project structure, no other implementation can proceed. The quality of this setup directly impacts developer experience and code quality throughout the entire project lifecycle.

---

## 2. Objectives

1. Initialize a Next.js 14+ project with App Router and TypeScript
2. Configure PostgreSQL database with Prisma ORM and verify connectivity
3. Set up code quality tooling (ESLint, Prettier) with project conventions
4. Establish project structure following feature-based organization
5. Document setup process for future developers

---

## 3. Prerequisites

### Required Sessions

- [x] None - this is the first session

### Required Tools/Knowledge

- Node.js 18+ installed
- npm/pnpm package manager
- PostgreSQL server (local or cloud - Neon, Supabase, Railway)
- Basic familiarity with React and TypeScript

### Environment Requirements

- macOS/Linux/Windows development machine
- Terminal/shell access
- Code editor (VS Code recommended)
- Git installed

---

## 4. Scope

### In Scope (MVP)

- Next.js 14+ project initialization with App Router
- TypeScript configuration (strict mode)
- Prisma ORM setup with PostgreSQL connection
- ESLint + Prettier configuration
- Project folder structure (feature-based)
- Environment variables setup (.env, .env.example)
- Git repository initialization with .gitignore
- Basic README with setup instructions
- Verify dev server runs successfully
- Verify database connection works

### Out of Scope (Deferred)

- Authentication setup - _Session 04_
- UI components and styling - _Session 03_
- Database schema/models - _Session 02_
- Deployment configuration - _Later phase_
- CI/CD pipelines - _Later phase_
- Docker configuration - _Later phase_

---

## 5. Technical Approach

### Architecture

Full-stack Next.js application using the App Router pattern:

- `/app` - Pages and API routes (App Router)
- `/lib` - Shared utilities, database client, types
- `/components` - Reusable UI components (empty for now)
- Feature-based organization within each directory

### Design Patterns

- **Feature-based structure**: Group by domain (talents, auth, admin) not by type
- **Colocation**: Keep related files together
- **Type-safe database**: Prisma generates TypeScript types from schema

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Next.js 14.x (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Linting**: ESLint 8.x with Next.js config
- **Formatting**: Prettier 3.x
- **Package Manager**: npm (or pnpm)

---

## 6. Deliverables

### Files to Create

| File                      | Purpose                       | Est. Lines |
| ------------------------- | ----------------------------- | ---------- |
| `package.json`            | Dependencies and scripts      | ~40        |
| `tsconfig.json`           | TypeScript configuration      | ~30        |
| `.eslintrc.json`          | ESLint rules                  | ~25        |
| `.prettierrc`             | Prettier formatting rules     | ~10        |
| `.env.example`            | Environment variable template | ~15        |
| `.env.local`              | Local environment variables   | ~15        |
| `.gitignore`              | Git ignore patterns           | ~30        |
| `prisma/schema.prisma`    | Database schema (minimal)     | ~20        |
| `lib/db.ts`               | Prisma client singleton       | ~15        |
| `app/layout.tsx`          | Root layout                   | ~20        |
| `app/page.tsx`            | Home page placeholder         | ~15        |
| `app/api/health/route.ts` | Health check endpoint         | ~15        |
| `README.md`               | Setup documentation           | ~80        |

### Files to Modify

| File | Changes       | Est. Lines |
| ---- | ------------- | ---------- |
| N/A  | Fresh project | -          |

---

## 7. Success Criteria

### Functional Requirements

- [ ] `npm run dev` starts development server without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] `/api/health` returns JSON with database connection status
- [ ] Prisma can connect to PostgreSQL and run migrations
- [ ] `npx prisma studio` opens database browser

### Testing Requirements

- [ ] Health endpoint returns `{ status: "ok", database: "connected" }`
- [ ] ESLint passes with no errors: `npm run lint`
- [ ] TypeScript compiles with no errors: `npm run build`

### Quality Gates

- [ ] All files ASCII-encoded
- [ ] Unix LF line endings
- [ ] Code follows CONVENTIONS.md naming patterns
- [ ] No console errors in browser
- [ ] .env.local is in .gitignore (secrets not committed)

---

## 8. Implementation Notes

### Key Considerations

- Use `@/` path alias for clean imports
- Prisma client must be singleton to prevent connection pool exhaustion in dev
- Environment variables: DATABASE_URL for Prisma connection string
- Next.js 14 App Router uses `app/` directory, not `pages/`

### Potential Challenges

- **Database connection**: May need to configure SSL for cloud PostgreSQL
- **Prisma in Next.js dev**: Hot reload creates multiple Prisma instances without singleton pattern
- **ESLint conflicts**: Prettier and ESLint rules may conflict - use eslint-config-prettier

### Relevant Considerations

- [P00] **Tiered access control**: Project structure should anticipate role-based features (prepare `/lib/auth/` directory)
- [P00] **Multi-language support**: Next.js has built-in i18n - structure supports future internationalization
- [P00] **Video hosting**: Environment variables template includes placeholder for cloud storage (Cloudinary/S3)

### ASCII Reminder

All output files must use ASCII-only characters (0-127).

---

## 9. Testing Strategy

### Unit Tests

- Not applicable for this session (tooling setup)

### Integration Tests

- Health check endpoint verifies database connectivity

### Manual Testing

1. Run `npm run dev` - server starts on port 3000
2. Open http://localhost:3000 - page renders
3. Open http://localhost:3000/api/health - returns JSON
4. Run `npx prisma studio` - database browser opens
5. Run `npm run lint` - no errors
6. Run `npm run build` - builds successfully

### Edge Cases

- Database connection failure should return graceful error in health check
- Missing .env.local should show clear error message

---

## 10. Dependencies

### External Libraries

| Package                | Version | Purpose                   |
| ---------------------- | ------- | ------------------------- |
| next                   | ^14.0.0 | React framework           |
| react                  | ^18.2.0 | UI library                |
| react-dom              | ^18.2.0 | React DOM                 |
| typescript             | ^5.0.0  | Type safety               |
| @prisma/client         | ^5.0.0  | Database client           |
| prisma                 | ^5.0.0  | ORM CLI (dev)             |
| eslint                 | ^8.0.0  | Linting                   |
| eslint-config-next     | ^14.0.0 | Next.js ESLint rules      |
| prettier               | ^3.0.0  | Code formatting           |
| eslint-config-prettier | ^9.0.0  | Disable conflicting rules |

### Other Sessions

- **Depends on**: None
- **Depended by**: Sessions 02, 03, 04, 05, 06 (all subsequent sessions)

---

## Next Steps

Run `/tasks` to generate the implementation task checklist.
