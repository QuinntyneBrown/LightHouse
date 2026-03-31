# LightHouse

LightHouse Kids is a docs-first blueprint for a self-hostable Christian media platform for churches and families. The planned product combines a child-friendly PWA, parent controls, curated media playback, and an admin/content pipeline designed to stay affordable to operate.

At the moment, this repository is primarily architecture, UX, and delivery planning. It does not yet contain the application source code for the frontend, backend, or infrastructure automation described in the design documents.

## Product Goals

- Deliver a safe, ad-free experience for children with age-appropriate content.
- Give parents clear control over profiles, screen time, playback history, and blocked content.
- Support churches and small teams with a stack that is practical to self-host.
- Start simple and low-cost, then scale incrementally as adoption grows.

## Planned Platform

| Layer | Planned Technology |
| --- | --- |
| Frontend | Next.js 15 PWA |
| API | Fastify + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Keycloak |
| Object Storage | MinIO |
| Search | Meilisearch |
| CDN / Edge | Cloudflare |
| Local Dev / Deployment | Docker Compose |

## Current Repository Contents

```text
.
|-- docs/
|   |-- specs/                 # High-level and detailed product requirements
|   |-- detailed-designs/      # Module-level overviews, diagrams, flows, and state models
|   |-- images/                # Generated design/reference images
|   |-- hosting-costs.md       # Environment and cost planning
|   `-- ui-design.pen          # UI design source file
|-- plantuml.jar               # Local PlantUML renderer used for diagram generation
`-- .gitignore
```

## Documentation Map

- [`docs/specs/L1.md`](docs/specs/L1.md): High-level product requirements.
- [`docs/specs/L2.md`](docs/specs/L2.md): Detailed UX and feature requirements.
- [`docs/detailed-designs/app-shell/overview.md`](docs/detailed-designs/app-shell/overview.md): PWA shell, navigation, theming, offline behavior.
- [`docs/detailed-designs/auth/overview.md`](docs/detailed-designs/auth/overview.md): Authentication, OAuth, sessions, COPPA flow.
- [`docs/detailed-designs/profiles/overview.md`](docs/detailed-designs/profiles/overview.md): Parent accounts, child profiles, avatar selection, active profile switching.
- [`docs/detailed-designs/content/overview.md`](docs/detailed-designs/content/overview.md): Content lifecycle, taxonomy, upload and indexing model.
- [`docs/detailed-designs/media/overview.md`](docs/detailed-designs/media/overview.md): MinIO storage, transcoding pipeline, streaming and offline downloads.
- [`docs/detailed-designs/playback/overview.md`](docs/detailed-designs/playback/overview.md): Video/audio playback and playlist progression.
- [`docs/detailed-designs/search/overview.md`](docs/detailed-designs/search/overview.md): Search architecture and Meilisearch sync behavior.
- [`docs/detailed-designs/parental-controls/overview.md`](docs/detailed-designs/parental-controls/overview.md): Screen time, PIN checks, blocking, history.
- [`docs/detailed-designs/engagement/overview.md`](docs/detailed-designs/engagement/overview.md): Badges, progress, streaks, memory verses.
- [`docs/detailed-designs/content-review/overview.md`](docs/detailed-designs/content-review/overview.md): Review workflows and moderation model.
- [`docs/detailed-designs/admin/overview.md`](docs/detailed-designs/admin/overview.md): Platform admin operations and analytics.
- [`docs/hosting-costs.md`](docs/hosting-costs.md): Development, staging, and production hosting strategy.
- [`docs/ui-design.pen`](docs/ui-design.pen): Editable UI design source.

## Key Functional Areas

- Child-facing home, browse, playlists, and playback flows.
- Parent onboarding, PIN protection, and profile management.
- Screen time rules, viewing history, and content blocking.
- Content upload, review, publish, search, and media delivery.
- Offline-friendly PWA behavior for playback and downloads.

## Working With Diagrams

PlantUML source files live under `docs/detailed-designs/**`. Generated PNGs are already committed alongside them.

To regenerate all diagrams on Windows PowerShell:

```powershell
Get-ChildItem .\docs\detailed-designs -Recurse -Filter *.puml |
  ForEach-Object { java -jar .\plantuml.jar $_.FullName }
```

Requirements:

- Java installed and available on `PATH`
- `plantuml.jar` present in the repository root

## Project Status

This repository is currently in planning and design. The implementation work implied by the architecture docs has not been scaffolded yet.

When source code is added, this README should be expanded with:

- local development setup
- Docker Compose commands
- environment variable reference
- test and lint workflows
- deployment instructions

## Notes

- The documentation assumes a mobile-first, child-friendly UX with large touch targets and age-band-aware theming.
- The hosting plan intentionally favors self-hosting and low-cost infrastructure.
- The design artifacts currently represent the best source of truth for scope and intended system boundaries.
