# LightHouse

LightHouse Kids is a self-hostable children's media platform for churches and families. The product combines a child-friendly PWA, parent-controlled profiles, curated playback, and a content pipeline designed to stay affordable to run.

This repository contains both the design documentation and the active implementation workspace. The codebase is organized as a pnpm + Turborepo monorepo with a Next.js frontend, a Fastify API, shared TypeScript packages, Prisma schema and seed data, and Playwright acceptance tests.

## Current State

The project is in active implementation, not just planning.

- `apps/web` contains a real Next.js 15 app scaffold with auth, child, and parent route groups.
- `apps/api` now has a bootstrapped Fastify server and module routes for the major product domains.
- `packages/db` contains the Prisma schema and a seed script with sample content and reference data.
- `packages/shared` contains shared domain types and constants.
- `tests/e2e` contains Playwright page objects and specs that double as acceptance criteria.

The repo is still early enough that some defaults are not fully harmonized yet, especially around local environment variables and cross-package startup.

## Stack

| Layer | Technology |
| --- | --- |
| Monorepo | pnpm workspace + Turborepo |
| Frontend | Next.js 15 + React 19 + Tailwind CSS 4 |
| API | Fastify + TypeScript |
| Database | PostgreSQL + Prisma |
| Auth | Keycloak |
| Object Storage | MinIO |
| Search | Meilisearch |
| E2E Testing | Playwright |
| Local Infra | Docker Compose |

## Repository Layout

```text
.
|-- apps/
|   |-- web/                # Next.js PWA
|   `-- api/                # Fastify API
|-- packages/
|   |-- db/                 # Prisma schema and seed data
|   `-- shared/             # Shared types and constants
|-- tests/
|   `-- e2e/                # Playwright specs and page objects
|-- docs/
|   |-- specs/
|   |-- detailed-designs/
|   |-- solution-architecture.md
|   `-- ui-design.pen
|-- docker-compose.yml
|-- turbo.json
|-- pnpm-workspace.yaml
|-- package.json
`-- plantuml.jar
```

## Current App Surface

### Web

- Auth routes under `apps/web/src/app/(auth)`
- Child-facing routes under `apps/web/src/app/(child)`
- Parent-facing routes under `apps/web/src/app/(parent)`
- Shared UI, playback, profile, content, search, and parental-control components under `apps/web/src/components`

### API

Current Fastify modules under `apps/api/src/modules`:

- `auth`
- `profiles`
- `content`
- `content-review`
- `playback`
- `parental-controls`
- `engagement`
- `search`
- `media`
- `admin`

### Data and Shared Packages

- `packages/db/prisma/schema.prisma` models accounts, child profiles, content, playlists, review flows, playback, parental controls, engagement, media, admin entities, and analytics.
- `packages/db/prisma/seed.ts` seeds categories, avatars, sample content, playlists, memory verses, badges, and a sample admin/account record.
- `packages/shared/src` exports shared domain types and constants used across the workspace.

## Local Development

### Prerequisites

- Node.js 22
- pnpm 9
- Docker Desktop or Docker Engine
- Java, if you want to regenerate PlantUML diagrams

### 1. Install Dependencies

```powershell
pnpm install
```

### 2. Start Infrastructure

```powershell
docker compose up -d
```

This starts:

| Service | URL / Port |
| --- | --- |
| PostgreSQL | `localhost:5432` |
| Keycloak | `http://localhost:8080` |
| MinIO API | `http://localhost:9000` |
| MinIO Console | `http://localhost:9001` |
| Meilisearch | `http://localhost:7700` |

### 3. Set Local Environment Variables

There is no committed `.env.example` yet, and the current package defaults do not all line up with `docker-compose.yml`. For local development today, use values like these:

```powershell
$env:DATABASE_URL="postgresql://lighthouse:lighthouse_dev@localhost:5432/lighthouse"
$env:PORT="8000"
$env:CORS_ORIGIN="http://localhost:3000"
$env:MINIO_ACCESS_KEY="lighthouse"
$env:MINIO_SECRET_KEY="lighthouse_dev"
$env:MEILISEARCH_API_KEY="lighthouse_dev_key"
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"
```

These align the API and web app with the current Docker services and avoid the default port conflict between the API and Next.js.

### 4. Prepare the Database

```powershell
pnpm --filter db generate
pnpm --filter db migrate
pnpm --filter db seed
```

### 5. Run the Apps

API:

```powershell
pnpm --filter api dev
```

Web:

```powershell
pnpm --filter web dev
```

Expected local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

## Useful Commands

```powershell
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
pnpm --filter e2e test:ui
pnpm --filter db studio
```

`pnpm dev` exists at the workspace root, but until env handling is unified it is safer to run the API and web packages explicitly.

## Seed Data

The Prisma seed script currently creates:

- default content categories
- avatar options
- sample published content
- system playlists
- memory verses
- badge definitions
- a sample admin user record and matching account record for `admin@lighthouse.kids`

The seed data is useful for UI and API development, but it is not a full authentication bootstrap by itself.

## Key Documentation

- [`docs/solution-architecture.md`](docs/solution-architecture.md): Monorepo and service-level architecture.
- [`docs/specs/L1.md`](docs/specs/L1.md): High-level requirements.
- [`docs/specs/L2.md`](docs/specs/L2.md): Detailed feature requirements.
- [`docs/detailed-designs/app-shell/overview.md`](docs/detailed-designs/app-shell/overview.md): Shell, navigation, theming, and offline behavior.
- [`docs/detailed-designs/auth/overview.md`](docs/detailed-designs/auth/overview.md): Authentication and parental consent.
- [`docs/detailed-designs/content/overview.md`](docs/detailed-designs/content/overview.md): Content lifecycle and taxonomy.
- [`docs/detailed-designs/media/overview.md`](docs/detailed-designs/media/overview.md): Media storage, transcoding, and delivery.
- [`docs/detailed-designs/search/overview.md`](docs/detailed-designs/search/overview.md): Search architecture and indexing.
- [`docs/hosting-costs.md`](docs/hosting-costs.md): Cost and hosting strategy.

## Working With Diagrams

PlantUML source files live under `docs/detailed-designs/**`. Generated PNGs are committed alongside the source files.

To regenerate diagrams on Windows PowerShell:

```powershell
Get-ChildItem .\docs\detailed-designs -Recurse -Filter *.puml |
  ForEach-Object { java -jar .\plantuml.jar $_.FullName }
```

## Notes

- The design documents are still the best source of truth for intended scope and architecture.
- The implementation now covers more of the planned surface area, but some modules are still scaffold-first rather than fully integrated.
- A committed environment template would be a useful next cleanup step once the local configuration settles.
