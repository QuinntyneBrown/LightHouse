# LightHouse

LightHouse Kids is a self-hostable children's media platform for churches and families. The product combines a child-friendly PWA, parent-controlled profiles, curated playback, and a content pipeline designed to stay affordable to run.

This repository is no longer docs-only. It now contains an early pnpm + Turborepo workspace with frontend, backend, shared types, database schema, Playwright acceptance tests, and the original product and architecture documentation.

## Status

The codebase is in early implementation.

- `apps/web` contains a real Next.js 15 app scaffold, shared UI components, hooks, and theme primitives.
- `apps/api` contains Fastify module structure, schemas, controllers, and config, but runtime bootstrapping is still incomplete.
- `packages/db` contains the Prisma schema for the core domain model.
- `packages/shared` contains shared TypeScript types and constants.
- `tests/e2e` contains Playwright page objects and feature-level specs that act as executable acceptance criteria.

If you are looking for a finished local setup, treat this repository as an active scaffold rather than a fully wired application.

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

## Workspace Layout

```text
.
|-- apps/
|   |-- web/                # Next.js PWA scaffold
|   `-- api/                # Fastify API modules and middleware
|-- packages/
|   |-- db/                 # Prisma schema and generated client package
|   `-- shared/             # Shared types and constants
|-- tests/
|   `-- e2e/                # Playwright specs and page objects
|-- docs/
|   |-- specs/              # Product requirements
|   |-- detailed-designs/   # Feature-level architecture and flows
|   |-- solution-architecture.md
|   `-- ui-design.pen
|-- docker-compose.yml      # Postgres, Keycloak, MinIO, Meilisearch
|-- turbo.json              # Task orchestration
|-- pnpm-workspace.yaml
|-- package.json
`-- plantuml.jar
```

## Getting Started

### Prerequisites

- Node.js 22
- pnpm 9
- Docker Desktop or Docker Engine
- Java, if you want to regenerate PlantUML diagrams

### Install Dependencies

```powershell
pnpm install
```

### Start Infrastructure

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

### Run What Exists Today

Frontend scaffold:

```powershell
pnpm --filter web dev
```

Workspace commands:

```powershell
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

Database package commands:

```powershell
pnpm --filter db generate
pnpm --filter db migrate
pnpm --filter db studio
```

## Important Notes

- The root workspace is still under construction. Some package scripts describe the intended final workflow, but not every runtime path is fully wired yet.
- The API package currently has module structure and configuration, but it does not yet have a complete server bootstrap entrypoint.
- There is no committed `.env.example` yet, so environment setup is still implicit in the current source files and Docker defaults.
- Playwright coverage is ahead of implementation in several areas. Treat the tests as target behavior as much as current verification.

## What Is In The Repo Today

- Next.js app shell metadata, global styling, components, hooks, and content/playback/profile UI scaffolding.
- Fastify controllers, routes, schemas, middleware, plugin stubs, and utility helpers for core modules such as auth, content, profiles, and content review.
- A large Prisma schema covering accounts, child profiles, content, playlists, review flows, playback, parental controls, engagement, media, church/admin entities, and analytics.
- Shared domain types and constants for auth, content, media, search, playback, parental controls, and admin flows.
- End-to-end specs for onboarding, navigation, home screen, browsing, playback, parental controls, and profile management.

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

## Direction

The repository is moving from architecture-first planning into implementation. The current source tree should be read as a scaffold aligned to the design docs, with some packages already concrete and others still being wired into a runnable system.
