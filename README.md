# LightHouse

![LightHouse Kids](docs/images/readme-hero.png)

LightHouse Kids is a self-hostable children's media platform for churches and families. The product combines a child-friendly PWA, parent-controlled profiles, curated playback, and a content pipeline designed to stay affordable to run.

This repository contains both the design documentation and the active implementation workspace. The codebase is organized as a pnpm + Turborepo monorepo with a Next.js frontend, a Fastify API, shared TypeScript packages, Prisma schema and seed data, and Playwright acceptance tests.

![App Screenshots](docs/images/readme-screenshots.png)

## Stack

| Layer | Technology |
| --- | --- |
| Monorepo | pnpm 9 workspace + Turborepo 2.3 |
| Frontend | Next.js 15 + React 19 + Tailwind CSS 4 |
| API | Fastify 5 + TypeScript + Zod |
| Database | PostgreSQL 16 + Prisma 6 |
| Auth | Keycloak 26 |
| Object Storage | MinIO |
| Search | Meilisearch v1.12 |
| E2E Testing | Playwright |
| Local Infra | Docker Compose |
| Runtime | Node.js 22 |

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
|   |-- specs/              # L1 and L2 requirements
|   |-- detailed-designs/   # 11 domain design documents with PlantUML diagrams
|   |-- images/              # README and generated design assets
|   |-- solution-architecture.md
|   |-- hosting-costs.md
|   `-- ui-design.pen
|-- docker-compose.yml
|-- turbo.json
|-- pnpm-workspace.yaml
|-- package.json
`-- plantuml.jar
```

## App Surface

### Web

**Route groups** under `apps/web/src/app`:

| Group | Routes |
| --- | --- |
| `(auth)` | login, signup, consent |
| `(child)` | home, browse/[category], play/[id], playlists/[id], search |
| `(parent)` | dashboard, profiles (new, [id]/edit), content-blocking, screen-time, history |
| Root | landing page, pin-setup |

**Components** under `apps/web/src/components`:

- `auth/` -- LoginForm, SignupForm, OAuthButtons, PINEntry, PINSetup
- `content/` -- ContentCard, ContentCarousel, ContentGrid, CategoryButton, HeroBanner, PlaylistCard, AgeBadge
- `engagement/` -- BadgeDisplay, MemoryVerse
- `parent/` -- ChildSummaryCard, ContentBlockToggle, PINGate, ScreenTimeSlider, ViewHistoryList
- `playback/` -- AudioPlayer, VideoPlayer, PlaylistQueue
- `profile/` -- AvatarPicker, AgeBandSelector, ProfileCard, ProfileCreation
- `search/` -- SearchInput, SearchResults
- `shell/` -- AppShell, BottomTabBar, ProfileSwitcher, ScreenTimeOverlay, OfflineIndicator
- `ui/` -- Button, Input, Modal, Card, Badge, Toast, Skeleton

**Hooks**: useAuth, useOffline, usePlayer, useProfile, useScreenTime, useSearch

**Lib**: api-client, constants, theme

### API

Fastify modules under `apps/api/src/modules`, each with controller, routes, schema, and service files:

- `auth` -- `profiles` -- `content` -- `content-review` -- `playback`
- `parental-controls` -- `engagement` -- `search` -- `media` -- `admin`

Supporting infrastructure:

- `middleware/` -- authenticate, authorize, screen-time-check, validate-pin
- `plugins/` -- auth, cors, swagger
- `utils/` -- errors, logger, pagination

### Database

`packages/db/prisma/schema.prisma` models accounts, child profiles, content, playlists, review flows, playback, parental controls, engagement, media, admin entities, and analytics.

`packages/db/prisma/seed.ts` seeds default categories, avatar options, sample published content, system playlists, memory verses, badge definitions, and a sample admin account for `admin@lighthouse.kids`.

### Shared

`packages/shared/src` exports:

- **Types**: auth, content, profile, playback, parental, engagement, search, media, admin
- **Constants**: age-bands, categories, roles

### E2E Tests

Playwright specs under `tests/e2e/specs`:

- browsing, home-screen, navigation, onboarding
- parental-controls, playback, profile-management

24 page objects under `tests/e2e/pages` covering the full app surface, plus shared fixtures and test data helpers.

## Local Development

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- pnpm 9
- Docker Desktop or Docker Engine
- Java (optional, for regenerating PlantUML diagrams)

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

There is no committed `.env.example` yet. For local development, use values like these:

```powershell
$env:DATABASE_URL="postgresql://lighthouse:lighthouse_dev@localhost:5432/lighthouse"
$env:PORT="8000"
$env:CORS_ORIGIN="http://localhost:3000"
$env:MINIO_ACCESS_KEY="lighthouse"
$env:MINIO_SECRET_KEY="lighthouse_dev"
$env:MEILISEARCH_API_KEY="lighthouse_dev_key"
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"
```

### 4. Prepare the Database

```powershell
pnpm --filter db generate
pnpm --filter db migrate
pnpm --filter db seed
```

### 5. Run the Apps

```powershell
pnpm --filter api dev
pnpm --filter web dev
```

Expected local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

## Useful Commands

```powershell
pnpm build              # build all packages
pnpm lint               # lint all packages
pnpm test               # run unit tests
pnpm test:e2e           # run Playwright specs headless
pnpm --filter e2e test:ui   # run Playwright specs with UI
pnpm --filter db studio     # open Prisma Studio
```

## Documentation

- [`docs/solution-architecture.md`](docs/solution-architecture.md) -- Monorepo and service-level architecture
- [`docs/hosting-costs.md`](docs/hosting-costs.md) -- Cost and hosting strategy
- [`docs/specs/L1.md`](docs/specs/L1.md) -- High-level requirements
- [`docs/specs/L2.md`](docs/specs/L2.md) -- Detailed feature requirements

Detailed designs under `docs/detailed-designs/`:

| Domain | Path |
| --- | --- |
| Admin | [`admin/overview.md`](docs/detailed-designs/admin/overview.md) |
| App Shell | [`app-shell/overview.md`](docs/detailed-designs/app-shell/overview.md) |
| Auth | [`auth/overview.md`](docs/detailed-designs/auth/overview.md) |
| Content | [`content/overview.md`](docs/detailed-designs/content/overview.md) |
| Content Review | [`content-review/overview.md`](docs/detailed-designs/content-review/overview.md) |
| Engagement | [`engagement/overview.md`](docs/detailed-designs/engagement/overview.md) |
| Media | [`media/overview.md`](docs/detailed-designs/media/overview.md) |
| Parental Controls | [`parental-controls/overview.md`](docs/detailed-designs/parental-controls/overview.md) |
| Playback | [`playback/overview.md`](docs/detailed-designs/playback/overview.md) |
| Profiles | [`profiles/overview.md`](docs/detailed-designs/profiles/overview.md) |
| Search | [`search/overview.md`](docs/detailed-designs/search/overview.md) |

Each detailed design includes C4 diagrams, class diagrams, sequence diagrams, and state diagrams as PlantUML sources with committed PNGs.

## Working With Diagrams

PlantUML source files live under `docs/detailed-designs/**`. Generated PNGs are committed alongside the source files.

To regenerate diagrams on Windows PowerShell:

```powershell
Get-ChildItem .\docs\detailed-designs -Recurse -Filter *.puml |
  ForEach-Object { java -jar .\plantuml.jar $_.FullName }
```
