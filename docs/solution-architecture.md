# LightHouse Kids -- Solution Architecture

> **Version:** 1.0  
> **Last Updated:** 2026-03-31  
> **Status:** Living document

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Monorepo Folder Hierarchy](#3-monorepo-folder-hierarchy)
4. [Service Dependencies](#4-service-dependencies)
5. [Data Flow](#5-data-flow)
6. [Development Setup](#6-development-setup)
7. [Build & Deploy Pipeline](#7-build--deploy-pipeline)
8. [Key Design Decisions](#8-key-design-decisions)

---

## 1. Overview

### Platform Description

LightHouse Kids is a faith-based children's media platform that provides curated, age-appropriate video and audio content for kids. The platform offers parent-controlled profiles with screen-time limits, content filtering, engagement tracking (badges, memory verses), and church/organization management. It is delivered as a Progressive Web App (PWA) for cross-platform reach on phones, tablets, and desktops.

### Architecture Principles

| Principle | Description |
|---|---|
| **Offline-first PWA** | Service worker caching ensures children can access downloaded content without a network connection. |
| **Safety by default** | Every child-facing feature is filtered by age band; parent controls are PIN-gated. |
| **Monorepo cohesion** | A single pnpm + Turborepo workspace keeps frontend, backend, shared types, and database schema in lockstep. |
| **Pluggable infrastructure** | S3-compatible storage (MinIO in dev, any S3 provider in prod), Keycloak for auth, and Meilisearch for search are all replaceable without application code changes. |
| **Type safety end-to-end** | Shared TypeScript types flow from Prisma schema to API request/response schemas to frontend hooks. |
| **Progressive enhancement** | Core playback works on low-end devices; richer UI features (animations, analytics charts) load lazily. |

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                            │
│                                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│   │   Mobile      │   │   Tablet     │   │   Desktop    │   │   Admin      │   │
│   │   (PWA)       │   │   (PWA)      │   │   (PWA)      │   │   (PWA)      │   │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   │
│          └──────────────────┼──────────────────┼──────────────────┘             │
│                             │ HTTPS            │                                │
└─────────────────────────────┼──────────────────┼────────────────────────────────┘
                              │                  │
                    ┌─────────▼──────────────────▼─────────┐
                    │        REVERSE PROXY / CDN            │
                    │    (Nginx / Cloudflare / Vercel)      │
                    └────────┬──────────────────┬───────────┘
                             │                  │
              ┌──────────────▼──────┐   ┌──────▼───────────────────┐
              │   NEXT.JS 15 (SSR)  │   │   FASTIFY API SERVER     │
              │   apps/web          │   │   apps/api               │
              │                     │   │                          │
              │  - App Router       │   │  - REST endpoints        │
              │  - Server Components│   │  - Auth middleware        │
              │  - Service Worker   │   │  - Rate limiting         │
              │  - Tailwind CSS     │   │  - Swagger docs          │
              └─────────┬───────────┘   └──┬────┬────┬────┬───────┘
                        │                  │    │    │    │
                        │   ┌──────────────┘    │    │    └──────────────┐
                        │   │         ┌─────────┘    └───────┐          │
                        │   │         │                      │          │
                 ┌──────▼───▼──┐  ┌───▼──────────┐  ┌───────▼───┐  ┌──▼──────────┐
                 │  KEYCLOAK    │  │ POSTGRESQL   │  │  MinIO     │  │ MEILISEARCH │
                 │              │  │              │  │ (S3)       │  │             │
                 │  - OIDC/OAuth│  │  - Users     │  │            │  │  - Content  │
                 │  - Social    │  │  - Profiles  │  │  - Videos  │  │    index    │
                 │    login     │  │  - Content   │  │  - Audio   │  │  - Search   │
                 │  - Realms    │  │  - Playback  │  │  - Images  │  │    ranking  │
                 │  - Sessions  │  │  - Analytics │  │  - Thumbs  │  │             │
                 └──────────────┘  └──────────────┘  └───────────┘  └─────────────┘
                        │                 │
                        │          ┌──────▼──────┐
                        │          │   PRISMA    │
                        │          │   ORM       │
                        │          │ (packages/  │
                        │          │  db)        │
                        │          └─────────────┘
                        │
              ┌─────────▼───────────┐
              │   KEYCLOAK REALM    │
              │   EXPORT / CONFIG   │
              │  (infra/docker/     │
              │   keycloak/)        │
              └─────────────────────┘
```

---

## 3. Monorepo Folder Hierarchy

```
C:\projects\LightHouse/
│
├── apps/
│   ├── web/                                    # Next.js 15 PWA -- child, parent, and admin frontend
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   │   ├── icon-192x192.png            # PWA icon 192px (home screen)
│   │   │   │   └── icon-512x512.png            # PWA icon 512px (splash screen)
│   │   │   ├── manifest.json                   # Web App Manifest (name, theme, icons, start_url)
│   │   │   └── sw.js                           # Service worker for offline caching & push notifications
│   │   │
│   │   ├── src/
│   │   │   ├── app/                            # Next.js App Router (file-based routing)
│   │   │   │   │
│   │   │   │   ├── (auth)/                     # Route group: authentication pages (no layout nesting)
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── page.tsx            # Email/password + OAuth sign-in page
│   │   │   │   │   ├── signup/
│   │   │   │   │   │   └── page.tsx            # Registration page with parental consent gate
│   │   │   │   │   └── consent/
│   │   │   │   │       └── page.tsx            # COPPA / parental consent verification flow
│   │   │   │   │
│   │   │   │   ├── (child)/                    # Route group: child-facing content experience
│   │   │   │   │   ├── home/
│   │   │   │   │   │   └── page.tsx            # Personalized home feed (hero banner, carousels by category)
│   │   │   │   │   ├── browse/
│   │   │   │   │   │   ├── page.tsx            # Top-level category grid
│   │   │   │   │   │   └── [category]/
│   │   │   │   │   │       └── page.tsx        # Content list filtered by category slug
│   │   │   │   │   ├── playlists/
│   │   │   │   │   │   ├── page.tsx            # All playlists for the active child profile
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx        # Single playlist detail with ordered content list
│   │   │   │   │   ├── play/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx        # Full-screen playback page (video or audio)
│   │   │   │   │   └── search/
│   │   │   │   │       └── page.tsx            # Search interface powered by Meilisearch
│   │   │   │   │
│   │   │   │   ├── (parent)/                   # Route group: PIN-gated parental control pages
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── page.tsx            # Overview of all child profiles and activity summaries
│   │   │   │   │   ├── screen-time/
│   │   │   │   │   │   └── page.tsx            # Set daily/weekly screen-time limits per profile
│   │   │   │   │   ├── history/
│   │   │   │   │   │   └── page.tsx            # Full watch/listen history for selected child
│   │   │   │   │   ├── content-blocking/
│   │   │   │   │   │   └── page.tsx            # Block/allow specific content items or categories
│   │   │   │   │   └── profiles/
│   │   │   │   │       ├── page.tsx            # List all child profiles
│   │   │   │   │       ├── new/
│   │   │   │   │       │   └── page.tsx        # Create a new child profile (name, avatar, age band)
│   │   │   │   │       └── [id]/
│   │   │   │   │           └── edit/
│   │   │   │   │               └── page.tsx    # Edit existing child profile
│   │   │   │   │
│   │   │   │   ├── (admin)/                    # Route group: admin dashboard (role-gated)
│   │   │   │   │   └── admin/
│   │   │   │   │       ├── page.tsx            # Admin home -- key metrics and quick actions
│   │   │   │   │       ├── content/
│   │   │   │   │       │   └── page.tsx        # Content library table with filters and bulk actions
│   │   │   │   │       ├── upload/
│   │   │   │   │       │   └── page.tsx        # Multi-file upload wizard (video, audio, thumbnails)
│   │   │   │   │       ├── reviews/
│   │   │   │   │       │   └── page.tsx        # Content review queue (approve / reject / flag)
│   │   │   │   │       ├── analytics/
│   │   │   │   │       │   └── page.tsx        # Platform analytics (plays, DAU, retention charts)
│   │   │   │   │       └── churches/
│   │   │   │   │           └── page.tsx        # Church/organization management CRUD
│   │   │   │   │
│   │   │   │   ├── layout.tsx                  # Root layout (HTML shell, providers, global fonts)
│   │   │   │   ├── not-found.tsx               # Custom 404 page
│   │   │   │   └── error.tsx                   # Global error boundary
│   │   │   │
│   │   │   ├── components/                     # React components organized by domain
│   │   │   │   │
│   │   │   │   ├── shell/                      # Application shell and navigation
│   │   │   │   │   ├── AppShell.tsx            # Top-level wrapper (header + main + bottom tabs)
│   │   │   │   │   ├── BottomTabBar.tsx        # Mobile bottom navigation (Home, Browse, Playlists, Profile)
│   │   │   │   │   ├── ProfileSwitcher.tsx     # Dropdown/modal to switch between child profiles
│   │   │   │   │   ├── ScreenTimeOverlay.tsx   # Full-screen overlay when screen-time limit is reached
│   │   │   │   │   └── OfflineIndicator.tsx    # Banner shown when the device is offline
│   │   │   │   │
│   │   │   │   ├── content/                    # Content display components
│   │   │   │   │   ├── ContentCard.tsx         # Thumbnail card with title, duration, age badge
│   │   │   │   │   ├── ContentCarousel.tsx     # Horizontal scrollable row of ContentCards
│   │   │   │   │   ├── CategoryButton.tsx      # Tappable category pill/button
│   │   │   │   │   ├── PlaylistCard.tsx        # Playlist cover card with item count
│   │   │   │   │   ├── AgeBadge.tsx            # Colored badge showing age band (e.g. 3-5)
│   │   │   │   │   ├── ContentGrid.tsx         # Responsive grid layout for content cards
│   │   │   │   │   └── HeroBanner.tsx          # Featured content banner at top of home page
│   │   │   │   │
│   │   │   │   ├── playback/                   # Media playback components
│   │   │   │   │   ├── VideoPlayer.tsx         # HLS/DASH video player wrapper
│   │   │   │   │   ├── AudioPlayer.tsx         # Audio player with artwork display
│   │   │   │   │   ├── PlaybackControls.tsx    # Play/pause, skip, volume, fullscreen buttons
│   │   │   │   │   ├── ProgressBar.tsx         # Seek bar with buffered/played indicators
│   │   │   │   │   └── PlaylistQueue.tsx       # Up-next queue sidebar/drawer
│   │   │   │   │
│   │   │   │   ├── auth/                       # Authentication components
│   │   │   │   │   ├── LoginForm.tsx           # Email + password form
│   │   │   │   │   ├── SignupForm.tsx          # Registration form with validation
│   │   │   │   │   ├── OAuthButtons.tsx        # Google / Apple sign-in buttons
│   │   │   │   │   ├── PINEntry.tsx            # 4-digit PIN input for parent gate
│   │   │   │   │   └── PINSetup.tsx            # Initial PIN creation + confirmation
│   │   │   │   │
│   │   │   │   ├── profile/                    # Child profile components
│   │   │   │   │   ├── ProfileCreation.tsx     # Multi-step profile creation wizard
│   │   │   │   │   ├── AvatarPicker.tsx        # Avatar selection grid
│   │   │   │   │   ├── AgeBandSelector.tsx     # Age band radio group (0-2, 3-5, 6-8, 9-12)
│   │   │   │   │   └── ProfileCard.tsx         # Profile summary card (avatar, name, age)
│   │   │   │   │
│   │   │   │   ├── parent/                     # Parental control components
│   │   │   │   │   ├── ChildSummaryCard.tsx    # Per-child activity summary (time watched, last active)
│   │   │   │   │   ├── ScreenTimeSlider.tsx    # Slider to set daily screen-time limit in minutes
│   │   │   │   │   ├── ContentBlockToggle.tsx  # Toggle to block/unblock a content item
│   │   │   │   │   ├── ViewHistoryList.tsx     # Paginated watch/listen history list
│   │   │   │   │   └── PINGate.tsx             # Wrapper that requires PIN before rendering children
│   │   │   │   │
│   │   │   │   ├── search/                     # Search components
│   │   │   │   │   ├── SearchInput.tsx         # Debounced search input with clear button
│   │   │   │   │   └── SearchResults.tsx       # Search result list with highlight matches
│   │   │   │   │
│   │   │   │   ├── engagement/                 # Gamification and engagement components
│   │   │   │   │   ├── BadgeDisplay.tsx        # Badge gallery (earned + locked badges)
│   │   │   │   │   ├── ProgressIndicator.tsx   # Circular/linear progress toward next badge
│   │   │   │   │   └── MemoryVerse.tsx         # Daily memory verse card with share action
│   │   │   │   │
│   │   │   │   ├── admin/                      # Admin-specific components
│   │   │   │   │   ├── ContentTable.tsx        # Sortable, filterable data table for content items
│   │   │   │   │   ├── UploadForm.tsx          # Drag-and-drop multi-file upload with progress
│   │   │   │   │   ├── ReviewQueue.tsx         # Card-based review queue with approve/reject actions
│   │   │   │   │   ├── AnalyticsCharts.tsx     # Chart.js / Recharts analytics visualizations
│   │   │   │   │   └── ChurchList.tsx          # Church/organization CRUD list
│   │   │   │   │
│   │   │   │   └── ui/                         # Shared design-system primitives
│   │   │   │       ├── Button.tsx              # Button with variants (primary, secondary, ghost, danger)
│   │   │   │       ├── Input.tsx               # Text input with label, error state, icon slots
│   │   │   │       ├── Slider.tsx              # Range slider component
│   │   │   │       ├── Modal.tsx               # Accessible modal dialog (focus trap, Escape to close)
│   │   │   │       ├── Card.tsx                # Generic card container with optional header/footer
│   │   │   │       ├── Tabs.tsx                # Tab group with accessible keyboard navigation
│   │   │   │       ├── Skeleton.tsx            # Skeleton loading placeholder shapes
│   │   │   │       └── Toast.tsx               # Toast notification system (success, error, info)
│   │   │   │
│   │   │   ├── hooks/                          # Custom React hooks
│   │   │   │   ├── useAuth.ts                  # Keycloak session: login, logout, token refresh
│   │   │   │   ├── useProfile.ts               # Active child profile state and switching
│   │   │   │   ├── useScreenTime.ts            # Remaining screen-time tracking with countdown
│   │   │   │   ├── usePlayer.ts                # Playback state machine (play, pause, seek, ended)
│   │   │   │   ├── useSearch.ts                # Meilisearch query hook with debounce
│   │   │   │   └── useOffline.ts               # Online/offline detection + cached data fallback
│   │   │   │
│   │   │   ├── lib/                            # Utility modules
│   │   │   │   ├── api-client.ts               # Typed fetch wrapper for Fastify API (base URL, auth headers)
│   │   │   │   ├── keycloak.ts                 # Keycloak JS adapter initialization and helpers
│   │   │   │   ├── theme.ts                    # Tailwind theme tokens (colors, radii, shadows)
│   │   │   │   └── constants.ts                # App-wide constants (age bands, routes, feature flags)
│   │   │   │
│   │   │   └── styles/
│   │   │       └── globals.css                 # Tailwind directives (@tailwind base/components/utilities)
│   │   │
│   │   ├── next.config.ts                      # Next.js config (PWA headers, image domains, redirects)
│   │   ├── tailwind.config.ts                  # Tailwind config (custom theme, plugins, content paths)
│   │   ├── tsconfig.json                       # TypeScript config extending root
│   │   └── package.json                        # Web app dependencies (next, react, tailwindcss, etc.)
│   │
│   └── api/                                    # Fastify backend API server
│       ├── src/
│       │   ├── server.ts                       # Fastify instance creation, plugin registration, listen()
│       │   ├── config.ts                       # Environment variable loading and validation (envSchema)
│       │   │
│       │   ├── plugins/                        # Fastify plugins (registered at startup)
│       │   │   ├── auth.ts                     # Keycloak JWT verification plugin (fastify-jwt / jwks)
│       │   │   ├── cors.ts                     # CORS configuration (allowed origins, methods, headers)
│       │   │   ├── swagger.ts                  # @fastify/swagger + swagger-ui auto-generated API docs
│       │   │   └── rate-limit.ts               # @fastify/rate-limit configuration per route group
│       │   │
│       │   ├── modules/                        # Feature modules (vertical slices)
│       │   │   │
│       │   │   ├── auth/                       # Authentication and session management
│       │   │   │   ├── auth.controller.ts      # Route handlers: login callback, token exchange, logout
│       │   │   │   ├── auth.service.ts         # Keycloak admin client calls, user creation
│       │   │   │   ├── auth.schema.ts          # Zod / JSON Schema for request/response validation
│       │   │   │   └── auth.routes.ts          # POST /auth/login, POST /auth/logout, POST /auth/refresh
│       │   │   │
│       │   │   ├── profiles/                   # Child profile CRUD
│       │   │   │   ├── profiles.controller.ts  # Route handlers: create, read, update, delete, switch
│       │   │   │   ├── profiles.service.ts     # Profile business logic, age-band validation
│       │   │   │   ├── profiles.schema.ts      # Profile DTOs and validation schemas
│       │   │   │   └── profiles.routes.ts      # /profiles, /profiles/:id
│       │   │   │
│       │   │   ├── content/                    # Content catalog (videos, audio, series)
│       │   │   │   ├── content.controller.ts   # Route handlers: list, get, filter by category/age
│       │   │   │   ├── content.service.ts      # Content queries, age-band filtering, presigned URLs
│       │   │   │   ├── content.schema.ts       # Content DTOs, query params, pagination
│       │   │   │   └── content.routes.ts       # /content, /content/:id, /content/categories
│       │   │   │
│       │   │   ├── content-review/             # Content moderation and review workflow
│       │   │   │   ├── content-review.controller.ts
│       │   │   │   ├── content-review.service.ts   # Review state machine (pending -> approved/rejected)
│       │   │   │   ├── content-review.schema.ts
│       │   │   │   └── content-review.routes.ts    # /reviews, /reviews/:id/approve, /reviews/:id/reject
│       │   │   │
│       │   │   ├── playback/                   # Playback tracking and progress
│       │   │   │   ├── playback.controller.ts  # Route handlers: start session, heartbeat, complete
│       │   │   │   ├── playback.service.ts     # Session tracking, resume position, screen-time deduction
│       │   │   │   ├── playback.schema.ts
│       │   │   │   └── playback.routes.ts      # /playback/start, /playback/heartbeat, /playback/complete
│       │   │   │
│       │   │   ├── parental-controls/          # Screen time, content blocking, history
│       │   │   │   ├── parental-controls.controller.ts
│       │   │   │   ├── parental-controls.service.ts  # Screen-time budget calc, block list management
│       │   │   │   ├── parental-controls.schema.ts
│       │   │   │   └── parental-controls.routes.ts   # /parental/screen-time, /parental/blocks, /parental/history
│       │   │   │
│       │   │   ├── engagement/                 # Badges, progress, memory verses
│       │   │   │   ├── engagement.controller.ts
│       │   │   │   ├── engagement.service.ts   # Badge awarding logic, streak calculation
│       │   │   │   ├── engagement.schema.ts
│       │   │   │   └── engagement.routes.ts    # /engagement/badges, /engagement/progress, /engagement/verse
│       │   │   │
│       │   │   ├── search/                     # Search proxy to Meilisearch
│       │   │   │   ├── search.controller.ts
│       │   │   │   ├── search.service.ts       # Meilisearch client, index sync, age-band scoping
│       │   │   │   ├── search.schema.ts
│       │   │   │   └── search.routes.ts        # GET /search?q=...&ageBand=...
│       │   │   │
│       │   │   ├── media/                      # File upload and media management
│       │   │   │   ├── media.controller.ts
│       │   │   │   ├── media.service.ts        # MinIO presigned upload/download URLs, transcoding triggers
│       │   │   │   ├── media.schema.ts
│       │   │   │   └── media.routes.ts         # POST /media/upload-url, GET /media/:id/stream
│       │   │   │
│       │   │   └── admin/                      # Admin-only operations
│       │   │       ├── admin.controller.ts
│       │   │       ├── admin.service.ts        # Analytics aggregation, church CRUD, user management
│       │   │       ├── admin.schema.ts
│       │   │       └── admin.routes.ts         # /admin/analytics, /admin/churches, /admin/users
│       │   │
│       │   ├── middleware/                     # Route-level middleware (preHandler hooks)
│       │   │   ├── authenticate.ts             # Verify JWT from Keycloak, attach user to request
│       │   │   ├── authorize.ts                # Role-based access control (parent, admin, church_admin)
│       │   │   ├── validate-pin.ts             # Verify parent PIN before allowing parental routes
│       │   │   └── screen-time-check.ts        # Reject playback requests when screen-time is exhausted
│       │   │
│       │   └── utils/                          # Shared backend utilities
│       │       ├── errors.ts                   # Custom error classes (NotFound, Forbidden, Conflict, etc.)
│       │       ├── logger.ts                   # Pino logger configuration (structured JSON logs)
│       │       └── pagination.ts               # Cursor-based and offset pagination helpers
│       │
│       ├── tsconfig.json                       # TypeScript config for API
│       └── package.json                        # API dependencies (fastify, @prisma/client, meilisearch, etc.)
│
├── packages/
│   ├── shared/                                 # Shared code consumed by both apps/web and apps/api
│   │   ├── src/
│   │   │   ├── types/                          # TypeScript type definitions by domain
│   │   │   │   ├── auth.ts                     # User, Session, TokenPayload
│   │   │   │   ├── profile.ts                  # ChildProfile, AgeBand, Avatar
│   │   │   │   ├── content.ts                  # ContentItem, Category, ContentType, Series
│   │   │   │   ├── playback.ts                 # PlaybackSession, PlaybackEvent, ResumePosition
│   │   │   │   ├── parental.ts                 # ScreenTimeRule, BlockRule, ViewHistoryEntry
│   │   │   │   ├── engagement.ts               # Badge, BadgeProgress, MemoryVerse
│   │   │   │   ├── search.ts                   # SearchQuery, SearchResult, SearchFilters
│   │   │   │   ├── media.ts                    # MediaUpload, PresignedUrl, TranscodeStatus
│   │   │   │   └── admin.ts                    # AnalyticsSummary, Church, AdminUser
│   │   │   ├── constants/                      # Shared constants
│   │   │   │   ├── age-bands.ts                # AGE_BANDS array with min/max/label
│   │   │   │   ├── content-types.ts            # VIDEO, AUDIO, SERIES enum values
│   │   │   │   ├── roles.ts                    # PARENT, CHILD, ADMIN, CHURCH_ADMIN
│   │   │   │   └── limits.ts                   # MAX_PROFILES, MAX_SCREEN_TIME, MAX_UPLOAD_SIZE
│   │   │   └── validators/                     # Zod schemas reusable on both client and server
│   │   │       ├── profile.validator.ts        # Profile creation/update validation
│   │   │       ├── content.validator.ts        # Content metadata validation
│   │   │       └── parental.validator.ts       # Screen-time and blocking rule validation
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── db/                                     # Database package (Prisma)
│       ├── prisma/
│       │   ├── schema.prisma                   # Prisma schema (all models, relations, enums)
│       │   ├── migrations/                     # Auto-generated SQL migration files
│       │   │   └── 20260101000000_init/
│       │   │       └── migration.sql
│       │   └── seed.ts                         # Database seeder (demo content, test users, categories)
│       ├── tsconfig.json
│       └── package.json                        # Exports @prisma/client, prisma CLI scripts
│
├── infra/
│   └── docker/                                 # Docker configuration for infrastructure services
│       ├── keycloak/
│       │   └── realm-export.json               # Pre-configured Keycloak realm (clients, roles, scopes)
│       ├── minio/
│       │   └── init-buckets.sh                 # Shell script to create default buckets on first run
│       └── meilisearch/
│           └── config.yml                      # Meilisearch index settings (searchable attrs, ranking)
│
├── tests/
│   └── e2e/                                    # End-to-end tests (Playwright)
│       ├── fixtures/                           # Test fixtures and global setup/teardown
│       │   ├── auth.fixture.ts                 # Authenticated browser context fixture
│       │   └── seed.fixture.ts                 # Database seed fixture for test isolation
│       ├── pages/                              # Page Object Models (POM)
│       │   ├── login.page.ts
│       │   ├── home.page.ts
│       │   ├── browse.page.ts
│       │   ├── player.page.ts
│       │   ├── parent-dashboard.page.ts
│       │   └── admin.page.ts
│       └── specs/                              # Test specifications
│           ├── auth.spec.ts                    # Login, signup, logout, consent flows
│           ├── browse.spec.ts                  # Category browsing and content discovery
│           ├── playback.spec.ts                # Video/audio playback, resume, screen-time enforcement
│           ├── parental.spec.ts                # PIN gate, screen-time settings, content blocking
│           └── admin.spec.ts                   # Content upload, review queue, analytics
│
├── docs/                                       # Project documentation
│   ├── specs/                                  # Feature specifications and requirements
│   ├── detailed-designs/                       # Technical design documents per feature
│   ├── images/                                 # Diagrams and screenshots
│   └── solution-architecture.md                # This document
│
├── .github/
│   └── workflows/                              # GitHub Actions CI/CD pipelines
│       ├── ci.yml                              # Lint, type-check, unit tests, build on every PR
│       ├── deploy-staging.yml                  # Deploy to staging on merge to develop branch
│       └── deploy-prod.yml                     # Deploy to production on merge to main branch
│
├── pnpm-workspace.yaml                         # pnpm workspace definition (apps/*, packages/*)
├── package.json                                # Root package.json (scripts: dev, build, lint, test)
├── turbo.json                                  # Turborepo pipeline config (build, lint, test tasks)
├── docker-compose.yml                          # Local dev: PostgreSQL, Keycloak, MinIO, Meilisearch
├── .env.example                                # Template for all required environment variables
├── .gitignore                                  # Git ignore rules (node_modules, .env, dist, .next)
├── .nvmrc                                      # Pinned Node.js version (e.g. 20.x LTS)
├── .prettierrc                                 # Prettier config (semi, singleQuote, trailingComma)
└── eslint.config.js                            # Flat ESLint config (typescript-eslint, import order)
```

---

## 4. Service Dependencies

| Service | Depends On | Purpose of Dependency |
|---|---|---|
| **Next.js (web)** | Fastify API | All data fetching (content, profiles, playback, parental controls) |
| **Next.js (web)** | Keycloak | OIDC login/logout redirects, token acquisition |
| **Next.js (web)** | MinIO | Direct image/thumbnail loading via presigned URLs |
| **Fastify (api)** | PostgreSQL | Primary data store for all domain entities |
| **Fastify (api)** | Keycloak | JWT token verification, user creation via admin API |
| **Fastify (api)** | MinIO | Generate presigned upload/download URLs for media files |
| **Fastify (api)** | Meilisearch | Index content on create/update; proxy search queries |
| **Fastify (api)** | Prisma (packages/db) | Database access via generated client |
| **Keycloak** | PostgreSQL | Stores realm configuration, users, sessions |
| **Meilisearch** | -- | Standalone; data pushed from Fastify API |
| **MinIO** | -- | Standalone; buckets initialized via init script |
| **PostgreSQL** | -- | Standalone; migrations applied via Prisma |

### Dependency Graph (simplified)

```
                    ┌──────────┐
                    │ Next.js  │
                    └────┬─────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
       ┌─────────┐ ┌─────────┐ ┌─────────┐
       │Keycloak │ │ Fastify │ │  MinIO  │
       └────┬────┘ └──┬──┬──┘ └─────────┘
            │         │  │
            ▼         │  ├────────────────┐
       ┌─────────┐    │  │                │
       │ Postgres │◄───┘  ▼                ▼
       └─────────┘   ┌─────────┐    ┌───────────┐
                     │  MinIO  │    │Meilisearch│
                     └─────────┘    └───────────┘
```

---

## 5. Data Flow

### 5.1 Content Playback (Child watches a video)

```
Child taps "Play"
       │
       ▼
┌─────────────────────┐
│  usePlayer hook      │  1. Check screen-time remaining (local state + API)
│  (Next.js client)    │  2. If budget > 0, call POST /playback/start
└──────────┬──────────┘
           │ HTTPS
           ▼
┌─────────────────────┐
│  screen-time-check   │  3. Middleware verifies screen-time budget in DB
│  middleware (Fastify) │     If exhausted → 403 { reason: "screen_time_exceeded" }
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  playback.service    │  4. Create PlaybackSession row in PostgreSQL
│                      │  5. Generate presigned stream URL from MinIO
│                      │  6. Return { sessionId, streamUrl, resumePosition }
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  VideoPlayer.tsx     │  7. Load HLS stream from MinIO presigned URL
│  (client)            │  8. Every 30s → POST /playback/heartbeat { sessionId, position }
│                      │  9. On video end → POST /playback/complete { sessionId }
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  playback.service    │  10. Update PlaybackSession (duration, completed)
│  engagement.service  │  11. Check badge criteria → award badge if earned
│                      │  12. Deduct watched minutes from screen-time budget
└─────────────────────┘
```

### 5.2 Content Upload (Admin uploads a video)

```
Admin drags file into UploadForm
       │
       ▼
┌─────────────────────┐
│  UploadForm.tsx      │  1. POST /media/upload-url { filename, contentType, size }
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  media.service       │  2. Generate MinIO presigned PUT URL
│  (Fastify)           │  3. Create ContentItem row (status: DRAFT) in PostgreSQL
│                      │  4. Return { uploadUrl, contentId }
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  UploadForm.tsx      │  5. PUT file directly to MinIO via presigned URL
│  (client)            │  6. On complete → POST /content/:id/finalize { metadata }
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  content.service     │  7. Update ContentItem metadata (title, category, age bands)
│                      │  8. Set status to PENDING_REVIEW
│  search.service      │  9. Index content in Meilisearch (searchable after approval)
└─────────────────────┘
```

### 5.3 Search (Child searches for content)

```
Child types "David and Goliath"
       │
       ▼
┌─────────────────────┐
│  useSearch hook      │  1. Debounce 300ms
│  (Next.js client)    │  2. GET /search?q=david+goliath&ageBand=3-5
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  search.service      │  3. Query Meilisearch with age-band filter
│  (Fastify)           │  4. Meilisearch returns ranked results
│                      │  5. Enrich with PostgreSQL data (thumbnails, durations)
│                      │  6. Filter out content blocked by parent
│                      │  7. Return SearchResult[]
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  SearchResults.tsx   │  8. Render result cards with highlighted matches
└─────────────────────┘
```

---

## 6. Development Setup

### 6.1 Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20.x LTS | Runtime (pinned in `.nvmrc`) |
| pnpm | 9.x | Package manager |
| Docker + Docker Compose | Latest | Infrastructure services |
| Git | Latest | Version control |

### 6.2 Docker Compose Services

The `docker-compose.yml` at the project root starts all infrastructure services:

| Service | Image | Port | Purpose |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | `5432` | Primary database |
| `keycloak` | `quay.io/keycloak/keycloak:25` | `8080` | Identity provider (dev mode) |
| `minio` | `minio/minio:latest` | `9000` / `9001` | S3-compatible object storage (API / Console) |
| `meilisearch` | `getmeili/meilisearch:v1.10` | `7700` | Full-text search engine |

### 6.3 Getting Started

```bash
# 1. Clone and install
git clone <repo-url> LightHouse
cd LightHouse
pnpm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your local values (defaults work for Docker services)

# 3. Start infrastructure
docker compose up -d

# 4. Initialize database
pnpm --filter @lighthouse/db prisma migrate dev
pnpm --filter @lighthouse/db prisma db seed

# 5. Import Keycloak realm (first run only)
# Keycloak auto-imports from infra/docker/keycloak/realm-export.json via volume mount

# 6. Initialize MinIO buckets (first run only)
docker exec lighthouse-minio sh /init-buckets.sh

# 7. Start all apps in dev mode
pnpm dev
# → Next.js:  http://localhost:3000
# → Fastify:  http://localhost:3001
# → Swagger:  http://localhost:3001/docs
```

### 6.4 Useful Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in watch mode (via Turborepo) |
| `pnpm build` | Production build of all apps and packages |
| `pnpm lint` | ESLint across the entire monorepo |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run Playwright end-to-end tests |
| `pnpm db:studio` | Open Prisma Studio (visual database browser) |
| `pnpm db:migrate` | Run pending Prisma migrations |
| `pnpm db:seed` | Seed database with demo data |

---

## 7. Build & Deploy Pipeline

### 7.1 CI Pipeline (`ci.yml`) -- runs on every PR

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Checkout    │────▶│  pnpm install│────▶│  Turbo Build  │────▶│  Turbo Lint   │
│  + Cache     │     │  (frozen)    │     │  (all apps)   │     │  (all apps)   │
└─────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                      │
                    ┌──────────────┐     ┌──────────────┐            │
                    │  Playwright  │◄────│  Unit Tests  │◄───────────┘
                    │  E2E Tests   │     │  (Vitest)    │
                    └──────────────┘     └──────────────┘
```

**Steps:**
1. Checkout code with pnpm cache restoration
2. `pnpm install --frozen-lockfile`
3. `pnpm turbo run build` -- builds all packages and apps
4. `pnpm turbo run lint` -- ESLint + TypeScript type-checking
5. `pnpm turbo run test` -- Vitest unit tests across all packages
6. Playwright E2E tests against Docker Compose services (spun up in CI)

### 7.2 Staging Deploy (`deploy-staging.yml`) -- on merge to `develop`

1. Run full CI pipeline
2. Build Docker images for `web` and `api`
3. Push images to container registry
4. Run Prisma migrations against staging database
5. Deploy via Docker Compose / Kubernetes to staging environment
6. Run smoke tests against staging URL

### 7.3 Production Deploy (`deploy-prod.yml`) -- on merge to `main`

1. Run full CI pipeline
2. Build production-optimized Docker images
3. Push tagged images to container registry
4. Run Prisma migrations against production database (with backup first)
5. Rolling deployment to production (zero-downtime)
6. Post-deploy health checks and smoke tests
7. Notify team via Slack/webhook

---

## 8. Key Design Decisions

### Why Fastify over Express?

| Factor | Fastify | Express |
|---|---|---|
| **Performance** | Built on top of `find-my-way` router; consistently 2-3x faster in benchmarks | Middleware chain adds overhead |
| **Schema validation** | First-class JSON Schema support with automatic serialization and validation | Requires manual middleware (express-validator, Joi) |
| **TypeScript** | Excellent TS support with typed plugins, decorators, and request/reply generics | Type definitions are community-maintained and often incomplete |
| **Plugin system** | Encapsulated plugin system with dependency injection and boot ordering | Flat middleware stack, no built-in encapsulation |
| **Logging** | Built-in Pino logger (structured JSON) | No built-in logger |

Fastify's schema-first approach aligns with our goal of end-to-end type safety. JSON Schema validation at the route level catches malformed requests before they reach business logic, and the same schemas power Swagger documentation.

### Why Prisma over raw SQL or other ORMs?

- **Type-safe queries**: Generated TypeScript client provides autocomplete and compile-time checking for all queries, eliminating a class of runtime errors.
- **Declarative schema**: `schema.prisma` serves as the single source of truth for the database structure, readable by both developers and non-developers.
- **Migration system**: `prisma migrate` produces versioned, reviewable SQL migrations from schema changes.
- **Ecosystem**: Prisma Studio provides a visual database browser for debugging; the seed system (`prisma db seed`) enables reproducible test data.

### Why Keycloak over Auth0 / Clerk / custom auth?

- **Self-hosted**: Full control over user data, critical for COPPA compliance when handling children's accounts. No per-user pricing.
- **Standards-based**: Full OIDC and OAuth 2.0 implementation with social identity providers (Google, Apple) out of the box.
- **Realm configuration as code**: The realm export JSON can be version-controlled, enabling reproducible auth configuration across environments.
- **Role-based access**: Built-in realm and client roles map directly to our parent/admin/church_admin authorization model.
- **Parental consent flow**: Custom authentication flows can enforce parental consent steps during signup.

### Why pnpm monorepo with Turborepo?

- **Single repository**: Frontend, backend, shared types, and database schema live together, ensuring they stay in sync. A type change in `packages/shared` is immediately visible in both `apps/web` and `apps/api`.
- **pnpm**: Strict dependency resolution prevents phantom dependencies. Content-addressable storage on disk reduces `node_modules` size by 50-70% compared to npm.
- **Turborepo**: Intelligent task orchestration with dependency-aware caching. Running `turbo run build` only rebuilds packages that have changed since the last run, dramatically reducing CI times.
- **Shared packages**: `packages/shared` (types, validators, constants) and `packages/db` (Prisma) are consumed by both apps, eliminating duplication and ensuring consistency.

### Why MinIO (S3-compatible) over direct filesystem or cloud-only?

- **Local development parity**: MinIO provides an identical S3 API locally, so presigned URL logic works the same in dev and prod.
- **Cloud portability**: Switching to AWS S3, Google Cloud Storage, or any S3-compatible provider requires only an endpoint/credentials change.
- **Presigned URLs**: Direct client-to-storage uploads and streaming avoid routing large media files through the API server, reducing latency and server load.

### Why Meilisearch over Elasticsearch or Algolia?

- **Simplicity**: Single binary, minimal configuration, instant indexing. No JVM or cluster management overhead.
- **Typo tolerance**: Built-in typo tolerance is ideal for children who may misspell search terms.
- **Speed**: Sub-50ms search responses for the expected content catalog size (thousands, not millions of items).
- **Self-hosted**: No per-search pricing; aligns with the self-hosted infrastructure approach.

### Why PWA over native mobile apps?

- **Single codebase**: One Next.js application serves all platforms (phones, tablets, desktops) without maintaining separate iOS and Android codebases.
- **Instant updates**: No app store review process; deploy and all users get the latest version immediately.
- **Offline support**: Service worker caching enables offline content browsing and playback of previously downloaded media.
- **Installable**: PWA manifest enables "Add to Home Screen" with full-screen app experience, splash screen, and app icon.
- **Lower barrier**: No app store account required for distribution; accessible via URL.

---

*This document is maintained alongside the codebase. Update it when architecture decisions change.*
