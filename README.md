# Talents Acting

Talent management platform for actors, comedians, and performers. Showcasing profiles, connecting with film professionals, and managing talent databases.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Prisma ORM
- **Styling**: Tailwind CSS
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL database (local, Supabase, Neon, or Railway)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Acting-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your PostgreSQL connection string.

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run database migrations (when schema is defined):

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command                | Description               |
| ---------------------- | ------------------------- |
| `npm run dev`          | Start development server  |
| `npm run build`        | Build for production      |
| `npm run start`        | Start production server   |
| `npm run lint`         | Run ESLint                |
| `npm run lint:fix`     | Fix ESLint issues         |
| `npm run format`       | Format code with Prettier |
| `npm run format:check` | Check code formatting     |

## Project Structure

```
Acting-app/
+-- app/                    # Next.js App Router pages and API routes
|   +-- api/               # API endpoints
|   |   +-- health/        # Health check endpoint
|   +-- layout.tsx         # Root layout
|   +-- page.tsx           # Home page
+-- components/            # Reusable UI components
+-- lib/                   # Shared utilities
|   +-- auth/             # Authentication utilities (future)
|   +-- db.ts             # Prisma client singleton
|   +-- generated/        # Prisma generated client
+-- prisma/               # Prisma schema and migrations
|   +-- schema.prisma     # Database schema
+-- public/               # Static assets
+-- .spec_system/         # Project specifications
```

## API Endpoints

### Health Check

- **GET** `/api/health`
- Returns application and database health status

## Environment Variables

| Variable              | Description                          | Required |
| --------------------- | ------------------------------------ | -------- |
| `DATABASE_URL`        | PostgreSQL connection string         | Yes      |
| `NODE_ENV`            | Environment (development/production) | No       |
| `NEXT_PUBLIC_APP_URL` | Application URL                      | No       |

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes following the project conventions
3. Run lint and format: `npm run lint && npm run format`
4. Commit with a descriptive message
5. Open a pull request

## License

Private - All rights reserved.
