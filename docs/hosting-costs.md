# LightHouse Kids -- Hosting Costs

> Last updated: 2026-03-31

## 1. Overview

LightHouse Kids is a **free platform** for churches and families. The project's cost
philosophy follows three principles:

1. **Minimize hosting costs** -- every dollar saved is a dollar that doesn't need to
   be fundraised.
2. **Self-hostable** -- any church with moderate technical ability should be able to
   run the entire stack on their own hardware or a single VPS.
3. **Scale only when needed** -- start with the cheapest viable setup and grow
   incrementally as usage demands.

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 PWA |
| Backend API | Fastify |
| Database | PostgreSQL |
| Authentication | Keycloak |
| Object Storage | MinIO (S3-compatible) |
| Search | Meilisearch |
| CDN | Cloudflare |

---

## 2. Development Environment

**Cost: $0/month**

All services run locally via Docker Compose. No cloud resources are required.

### Docker Compose Services

| Service | Image | Ports |
|---------|-------|-------|
| Next.js frontend | `node:22-alpine` (dev server) | 3000 |
| Fastify API | `node:22-alpine` (dev server) | 4000 |
| PostgreSQL | `postgres:17` | 5432 |
| Keycloak | `quay.io/keycloak/keycloak:26` | 8080 |
| MinIO | `minio/minio` | 9000, 9001 |
| Meilisearch | `getmeili/meilisearch:v1.12` | 7700 |

### Hardware Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 8 GB | 16 GB |
| CPU | 4 cores | 8 cores |
| Disk | 20 GB free | 50 GB free (SSD) |
| OS | Linux, macOS, or Windows with WSL2 | Linux or macOS |

Docker Desktop (macOS/Windows) or Docker Engine (Linux) must be installed. The full
stack idles at roughly 3-4 GB RAM with all containers running.

---

## 3. Staging Environment

**Target: Internal testing, QA, demo site**
**Cost: $20-40/month**

A single VPS runs the entire stack via Docker Compose, identical to the development
setup but exposed to the internet behind a reverse proxy (Caddy or Traefik).

### Option A: Single VPS (Recommended)

All services on one machine with Docker Compose.

| Service | Provider / Plan | Specs | Monthly Cost |
|---------|----------------|-------|-------------|
| **Compute (VPS)** | Hetzner CX32 | 4 vCPU, 8 GB RAM, 80 GB NVMe | **EUR 7.59 (~$8.30)** |
| | _or_ DigitalOcean Droplet | 4 vCPU, 8 GB RAM, 160 GB SSD | **$48/mo** |
| | _or_ Hetzner CAX21 (ARM) | 4 vCPU, 8 GB RAM, 80 GB NVMe | **EUR 7.49 (~$8.20)** |
| **Database** | PostgreSQL in Docker (on VPS) | Shared VPS resources | $0 (included) |
| **Object Storage** | MinIO in Docker (on VPS) | Shared VPS resources | $0 (included) |
| **CDN** | Cloudflare Free | Unlimited bandwidth, DNS, SSL | **$0** |
| **Domain** | Cloudflare Registrar / Namecheap | .org or .com | **~$12/year ($1/mo)** |
| **SSL** | Cloudflare or Let's Encrypt | Auto-renewed | $0 |
| **Backups** | Hetzner Snapshots | 20% of VPS cost | **~$1.60/mo** |
| **Monitoring** | Uptime Kuma (self-hosted) | On same VPS | $0 |

**Option A Total: ~$11-15/month** (Hetzner) or **~$50/month** (DigitalOcean)

### Option B: VPS + Managed PostgreSQL

For teams that prefer not to manage database backups and replication themselves.

| Service | Provider / Plan | Monthly Cost |
|---------|----------------|-------------|
| Compute (VPS) | Hetzner CX22 (2 vCPU, 4 GB) | **EUR 4.59 (~$5)** |
| Managed PostgreSQL | DigitalOcean Basic 1 vCPU/1 GB | **$15/mo** |
| | _or_ Neon Free Tier | **$0** (0.5 GB storage) |
| | _or_ Supabase Free Tier | **$0** (500 MB storage) |
| CDN | Cloudflare Free | $0 |
| Domain | Cloudflare Registrar | ~$1/mo |

**Option B Total: ~$20-25/month** (with managed PG) or **~$6-10/month** (with free-tier PG)

### Staging Environment Notes

- Automated daily database backups to MinIO or Hetzner Object Storage.
- Staging data should be anonymized copies of production, never real user data.
- Use Cloudflare Access (free for up to 50 users) to restrict staging access.

---

## 4. Production Environment -- Small Scale (MVP)

**Target: 500-5,000 monthly active families (MAF), up to 10K concurrent users**
**Cost: $100-200/month**

### Per-Service Breakdown

| Service | Provider / Plan | Specs | Monthly Cost |
|---------|----------------|-------|-------------|
| **App Servers (x2)** | Hetzner CX32 (x2) | 4 vCPU, 8 GB RAM each | **$16.60** |
| | _or_ DO Droplets (x2) | 4 vCPU, 8 GB RAM each | **$96** |
| **Load Balancer** | Hetzner LB11 | 25 targets, 5 TB bandwidth | **EUR 6.49 (~$7)** |
| | _or_ Cloudflare (DNS-based) | Round-robin via health checks | **$0** |
| **Managed PostgreSQL** | Hetzner Managed DB CPX21 | 3 vCPU, 4 GB RAM, 64 GB | **EUR 16.90 (~$18.50)** |
| | _or_ DO Managed PG | 2 vCPU, 4 GB, HA standby | **$60/mo** |
| **Object Storage** | Hetzner Object Storage | S3-compatible, 1 TB | **EUR 4.59 (~$5)** |
| | _or_ Backblaze B2 | 10 GB free, $6/TB/mo | **$6-12** |
| | _or_ MinIO on dedicated VPS | Hetzner CX22 | **$5** |
| **CDN** | Cloudflare Pro | Advanced caching, WAF, image optimization | **$20** |
| | _or_ Cloudflare Free | Good enough for most cases | **$0** |
| **Auth (Keycloak)** | On app server or CX22 | Dedicated if > 2K concurrent | **$0-5** |
| **Search (Meilisearch)** | Meilisearch Cloud Build | 100K docs, 10K searches/mo | **$0 (free)** |
| | _or_ Self-hosted on CX22 | 2 vCPU, 4 GB | **$5** |
| **Monitoring** | Grafana Cloud Free | 10K metrics, 50 GB logs | **$0** |
| **Email (transactional)** | Resend Free / Mailgun Free | 100/day free | **$0** |
| **Backups** | Automated snapshots + pg_dump | Off-site to object storage | **$3-5** |

### Bandwidth Estimates

Media streaming is the largest variable cost.

| Asset Type | Avg Size | Daily Requests (5K MAF) | Daily Bandwidth | Monthly |
|------------|----------|------------------------|----------------|---------|
| Bible story videos (HLS) | 200 MB | 2,000 streams | 400 GB | ~12 TB |
| Thumbnails / images | 50 KB | 50,000 | 2.5 GB | 75 GB |
| API responses | 5 KB | 200,000 | 1 GB | 30 GB |
| PWA assets (cached) | 2 MB | 1,000 (new installs) | 2 GB | 60 GB |

**Key insight:** Cloudflare caches and serves media at no egress cost on all plans
(including free) when properly configured with cache rules. This dramatically reduces
origin bandwidth.

| Bandwidth Path | Estimated Monthly | Cost |
|---------------|------------------|------|
| Origin -> Cloudflare | 1-2 TB (cache misses) | $0 (Hetzner includes 20 TB) |
| Cloudflare -> Users | 10-15 TB | $0 (Cloudflare unlimited) |
| Object Storage egress | 500 GB-1 TB | $5-10 |

### Production Small Total

| Scenario | Monthly Cost |
|----------|-------------|
| Budget (Hetzner + Cloudflare Free + self-managed) | **$55-80** |
| Moderate (Hetzner + Cloudflare Pro + managed DB) | **$100-140** |
| Premium (DigitalOcean + managed everything) | **$180-220** |

**Recommended starting point: $100-150/month**

---

## 5. Production Environment -- Scaled (Year 1+)

**Target: 5,000-50,000 monthly active families, up to 100K concurrent users**
**Cost: $300-800/month**

### Architecture

Move from Docker Compose to a Kubernetes cluster (k3s or managed k8s) for
auto-scaling, rolling deployments, and high availability.

### Per-Service Breakdown

| Service | Provider / Plan | Specs | Monthly Cost |
|---------|----------------|-------|-------------|
| **K8s Cluster (3 nodes)** | Hetzner CX42 (x3) | 8 vCPU, 16 GB RAM each | **$55** |
| | _or_ Hetzner CAX31 ARM (x3) | 8 vCPU, 16 GB each | **$42** |
| | _or_ DO Managed K8s (3 nodes) | 4 vCPU, 8 GB each | **$144 + $12 control plane** |
| **HA PostgreSQL** | Hetzner Managed DB CPX31 Primary + Replica | 4 vCPU, 8 GB, 128 GB | **EUR 32.90 (~$36)** |
| | _or_ DO Managed PG HA | 4 vCPU, 8 GB, standby | **$125** |
| | _or_ CrunchyData on K8s | Self-managed operator | **$0 (uses cluster resources)** |
| **Object Storage** | Hetzner Object Storage 5 TB | S3-compatible | **EUR 17.85 (~$19.50)** |
| | _or_ AWS S3 | 5 TB, infrequent access | **$65** |
| | _or_ Backblaze B2 5 TB | | **$30** |
| **CDN** | Cloudflare Pro | WAF, image optimization, caching | **$20** |
| | _or_ AWS CloudFront | 10 TB egress | **$850** (avoid) |
| **Auth (Keycloak)** | 2 replicas on K8s | Shared cluster resources | **$0** |
| **Search (Meilisearch)** | Meilisearch Cloud Growth | 1M docs, 100K searches/mo | **$30** |
| | _or_ Self-hosted on K8s | Shared cluster resources | **$0** |
| **Redis (caching/sessions)** | On K8s or Managed | | **$0-15** |
| **Monitoring** | Grafana Cloud Free + self-hosted Prometheus | | **$0** |
| **Log aggregation** | Loki on K8s or Grafana Cloud | | **$0-30** |
| **CI/CD** | GitHub Actions (free for OSS) | | **$0** |
| **Backups** | Automated to Hetzner Object Storage | | **$5-10** |

### Bandwidth at Scale

| Metric | Value |
|--------|-------|
| Monthly video streams | 100K-500K |
| Video egress (origin) | 5-20 TB |
| Cloudflare-served egress | 50-200 TB |
| Cloudflare cost for egress | $0 |
| Origin bandwidth (Hetzner 20 TB included) | $0 |
| Object storage egress | $10-50 |

### Per-TB Bandwidth Pricing Reference

| Provider | Egress per TB |
|----------|-------------|
| AWS CloudFront | $85 (first 10 TB) |
| AWS S3 direct | $90 |
| Cloudflare | $0 (all plans) |
| Hetzner | $0 (first 20 TB), EUR 1.19/TB after |
| DigitalOcean Spaces | $0 (first 1 TB), $10/TB after |
| Backblaze B2 | $0 (with Cloudflare partnership) |

### Scaled Production Total

| Scenario | Monthly Cost |
|----------|-------------|
| Budget (Hetzner k3s + Cloudflare Free + self-managed PG) | **$120-200** |
| Moderate (Hetzner + Cloudflare Pro + managed DB) | **$200-350** |
| Growth (Hetzner managed K8s + HA PG + Meilisearch Cloud) | **$350-550** |
| Premium (DO managed everything) | **$500-800** |

**Recommended: $300-500/month** covers 50K MAF comfortably.

---

## 6. Cost Optimization Strategies

### CDN Caching (Biggest Impact)

- **Aggressive cache headers** for all static media: set `Cache-Control: public, max-age=31536000, immutable` on images, thumbnails, fonts, and JS/CSS bundles.
- **HLS segment caching**: Cache `.m3u8` playlists for 60s, `.ts` segments for 1 year (content-addressed filenames). This alone can reduce origin video traffic by 95%+.
- **Cloudflare Cache Rules**: Create rules to cache `/media/*`, `/thumbnails/*`, and `/api/public/*` responses at the edge.
- **Cloudflare Polish**: Enable on Pro plan to auto-optimize images (WebP/AVIF conversion).

### Image and Thumbnail Optimization

- Generate thumbnails at upload time in 3 sizes (150px, 400px, 800px).
- Serve WebP/AVIF with `<picture>` fallbacks.
- Use `srcset` and `sizes` to avoid over-fetching on mobile.
- Lazy-load all below-the-fold images.
- Expected savings: 60-80% reduction in image bandwidth vs unoptimized PNGs.

### Database Connection Pooling

- Use PgBouncer in transaction mode in front of PostgreSQL.
- Allows 200+ app connections to map to 20-30 database connections.
- Reduces memory usage on managed PostgreSQL, allowing a smaller (cheaper) instance.
- Built into Supabase and Neon; must be self-deployed with Hetzner/DO managed PG.

### Cloudflare Free Tier Maximization

The Cloudflare free tier is remarkably generous:

- Unlimited bandwidth / CDN egress
- DNS hosting
- SSL/TLS (full strict mode)
- DDoS protection
- 5 Page Rules
- Basic WAF rules
- Web Analytics
- Cloudflare Access (up to 50 users -- useful for staging)

Most small-to-medium deployments will never need to upgrade past the free tier.

### Self-Hosting vs Managed Services

| Service | Self-Hosted Cost | Managed Cost | Recommendation |
|---------|-----------------|-------------|----------------|
| PostgreSQL | $0 (on VPS) | $15-125/mo | Self-host until > 5K MAF |
| Meilisearch | $0 (on VPS) | $0-30/mo | Self-host; low maintenance |
| Keycloak | $0 (on VPS) | N/A | Always self-host |
| Redis | $0 (on VPS) | $10-30/mo | Self-host |
| Monitoring | $0 (Prometheus + Grafana) | $0-50/mo | Grafana Cloud free tier |

**Rule of thumb:** Self-host everything on Hetzner until the operational burden
outweighs the cost savings. The crossover point is usually around 10K MAF or when
the team lacks a dedicated ops person.

### Church-Sponsored Hosting Model

For organizations deploying their own instance:

- A single Hetzner CX22 ($5/mo) can serve a church of up to 500 families.
- Provide a one-click deploy script (Docker Compose + Caddy) with auto-SSL.
- Churches pay only their VPS cost; the LightHouse project provides the software free.
- Larger churches or denominations can pool resources on a shared cluster.

---

## 7. Free Tier Opportunities

### Cloud Provider Programs

| Program | Benefit | Eligibility |
|---------|---------|------------|
| **AWS Activate for Nonprofits** | $1,000-$10,000 AWS credits | 501(c)(3) or equivalent |
| **Google for Nonprofits** | $10,000/year Google Cloud credits | 501(c)(3) or equivalent |
| **Microsoft for Nonprofits** | $3,500/year Azure credits | 501(c)(3) or equivalent |
| **Hetzner** | No formal program, but affordable baseline | Everyone |
| **DigitalOcean Hatch** | $10,000 infrastructure credits (12 months) | Startups < 12 months old |
| **Cloudflare Project Galileo** | Free Business/Enterprise plan | At-risk public interest sites |

### Always-Free Services

| Service | Provider | Free Tier Limits |
|---------|----------|-----------------|
| CDN + DNS + SSL | Cloudflare | Unlimited |
| CI/CD | GitHub Actions | 2,000 min/month (public repos) |
| Container Registry | GitHub Packages | 500 MB (free), unlimited (public) |
| Monitoring | Grafana Cloud | 10K metrics, 50 GB logs, 50 GB traces |
| Error Tracking | Sentry | 5K events/month |
| Search | Meilisearch Cloud (Build) | 100K documents |
| Email (transactional) | Resend | 100 emails/day |
| Uptime Monitoring | Uptime Kuma (self-hosted) | Unlimited |
| Analytics | Plausible CE (self-hosted) | Unlimited |
| Database (dev/staging) | Neon | 0.5 GB storage, 1 compute |
| Database (dev/staging) | Supabase | 500 MB storage, 2 projects |

### Open Source CI/CD

GitHub Actions is free for public repositories with generous limits:

- 2,000 minutes/month of Linux runner time
- Unlimited workflows and jobs
- Supports Docker builds, testing, and deployment
- Can deploy directly to VPS via SSH or to container registries

---

## 8. Cost Comparison Table

### Monthly Cost by Environment

| Service | Development | Staging | Prod Small (MVP) | Prod Scaled (Year 1+) |
|---------|------------|---------|------------------|----------------------|
| **Compute** | $0 (local) | $8-10 (1x VPS) | $17-96 (2x VPS) | $42-156 (3+ nodes / K8s) |
| **Load Balancer** | N/A | N/A | $0-7 | $0-12 |
| **PostgreSQL** | $0 (Docker) | $0-15 | $18-60 | $36-125 |
| **Object Storage** | $0 (Docker MinIO) | $0 (on VPS) | $5-12 | $19-65 |
| **CDN** | N/A | $0 (Cloudflare Free) | $0-20 | $0-20 |
| **Auth (Keycloak)** | $0 (Docker) | $0 (on VPS) | $0-5 | $0 (on K8s) |
| **Search (Meilisearch)** | $0 (Docker) | $0 (on VPS) | $0-5 | $0-30 |
| **Monitoring** | N/A | $0 (Uptime Kuma) | $0 (Grafana Free) | $0-30 |
| **Email** | $0 (Mailpit) | $0 (Resend Free) | $0 (Resend Free) | $0-20 |
| **Domain + SSL** | N/A | ~$1 | ~$1 | ~$1 |
| **Backups** | N/A | ~$2 | $3-5 | $5-10 |
| **CI/CD** | $0 (local) | $0 (GitHub Actions) | $0 (GitHub Actions) | $0 (GitHub Actions) |
| | | | | |
| **TOTAL** | **$0** | **$11-30** | **$55-220** | **$120-800** |
| **Recommended** | **$0** | **~$15** | **~$120** | **~$400** |

### Annual Cost Summary

| Environment | Low Estimate | Recommended | High Estimate |
|------------|-------------|-------------|--------------|
| Development | $0 | $0 | $0 |
| Staging | $132/year | $180/year | $360/year |
| Prod Small (MVP) | $660/year | $1,440/year | $2,640/year |
| Prod Scaled | $1,440/year | $4,800/year | $9,600/year |

### Cost Per Family (at recommended spend)

| Environment | MAF | Monthly Cost | Cost per Family |
|------------|-----|-------------|----------------|
| Prod Small | 500 | $120 | $0.24/family |
| Prod Small | 5,000 | $120 | $0.024/family |
| Prod Scaled | 10,000 | $400 | $0.04/family |
| Prod Scaled | 50,000 | $400 | $0.008/family |

---

## Notes

- All prices are as of early 2026 and may change. Hetzner and Cloudflare have been
  the most price-stable providers historically.
- EUR amounts converted at approximately 1 EUR = 1.09 USD.
- Bandwidth estimates assume moderate video streaming usage. A platform focused
  primarily on text content would cost significantly less.
- The **Hetzner + Cloudflare** combination is the recommended baseline for all
  non-development environments due to the best price-to-performance ratio and
  Cloudflare's unlimited free egress.
- All costs assume the project qualifies for and uses open-source / free-tier
  CI/CD through GitHub Actions on a public repository.
