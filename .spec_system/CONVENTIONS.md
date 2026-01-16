# CONVENTIONS.md

## Guiding Principles

- Optimize for readability over cleverness
- Code is written once, read many times
- Consistency beats personal preference
- If it can be automated, automate it
- When writing code: Make NO assumptions. Do not be lazy. Pattern match precisely. Do not skim when you need detailed info from documents. Validate systematically.

## Naming

- Be descriptive over concise: `getUserById` > `getUser` > `fetch`
- Booleans read as questions: `isActive`, `hasPermission`, `shouldRetry`
- Functions describe actions: `calculateTotal`, `validateInput`, `sendNotification`
- Avoid abbreviations unless universally understood (`id`, `url`, `config` are fine)
- Match domain language--use the same terms as product/design/stakeholders

## Files & Structure

- One concept per file where practical
- File names reflect their primary export or purpose
- Group by feature/domain, not by type (prefer `/talents/api.ts` over `/api/talents.ts`)
- Keep nesting shallow--if you're 4+ levels deep, reconsider

## Functions & Modules

- Functions do one thing
- If a function needs a comment explaining what it does, consider renaming it
- Keep functions short enough to read without scrolling
- Avoid side effects where possible; be explicit when they exist

## Comments

- Explain _why_, not _what_
- Delete commented-out code--that's what git is for
- TODOs include context: `// TODO(name): reason, ticket if applicable`
- Update or remove comments when code changes

## Error Handling

- Fail fast and loud in development
- Fail gracefully in production
- Errors should be actionable--include context for debugging
- Don't swallow errors silently

## Testing

- Test behavior, not implementation
- A test's name should describe the scenario and expectation
- If it's hard to test, the design might need rethinking
- Flaky tests get fixed or deleted--never ignored

## Git & Version Control

- Commit messages: imperative mood, concise (`Add user validation` not `Added some validation stuff`)
- One logical change per commit
- Branch names: `type/short-description` (e.g., `feat/user-auth`, `fix/cart-total`)
- Keep commits atomic enough to revert safely

## Pull Requests

- Small PRs get better reviews
- Description explains the _what_ and _why_--reviewers can see the _how_
- Link relevant tickets/context
- Review your own PR before requesting others

## Code Review

- Critique code, not people
- Ask questions rather than make demands
- Approve when it's good enough, not perfect
- Nitpicks are labeled as such

## Dependencies

- Fewer dependencies = less risk
- Justify additions; prefer well-maintained, focused libraries
- Pin versions; update intentionally

## Local Dev Tools

| Category      | Tool                             | Config            |
| ------------- | -------------------------------- | ----------------- |
| Formatter     | Prettier 3.7.4                   | .prettierrc       |
| Linter        | ESLint 9 + next/ts               | eslint.config.mjs |
| Type Safety   | TypeScript 5 (strict)            | tsconfig.json     |
| Testing       | Vitest 4 + React Testing Library | vitest.config.ts  |
| Observability | pino + pino-pretty               | lib/logger.ts     |
| Git Hooks     | husky + lint-staged              | .husky/pre-commit |

## CI/CD Workflows

| Bundle       | Status     | Workflow                                       |
| ------------ | ---------- | ---------------------------------------------- |
| Code Quality | configured | .github/workflows/quality.yml                  |
| Build & Test | configured | .github/workflows/test.yml                     |
| Security     | configured | .github/workflows/security.yml                 |
| Integration  | configured | .github/workflows/integration.yml              |
| Operations   | configured | .github/workflows/release.yml + dependabot.yml |

## Infrastructure

| Bundle   | Status         | Details                         |
| -------- | -------------- | ------------------------------- |
| Health   | configured     | /api/health (DB check included) |
| Security | not configured | -                               |
| Backup   | not configured | -                               |
| Deploy   | not configured | -                               |

**Stack** (to be configured on deployment):

- Platform: TBD (Vercel, Coolify, or similar)
- Database: PostgreSQL (via Prisma)
- Cache: TBD

## When In Doubt

- Ask
- Leave it better than you found it
- Ship, learn, iterate
