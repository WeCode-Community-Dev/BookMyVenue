# Venue404 docs

**Status:** Shipped — verified against code, 2026-07-17

A venue booking platform. Owners list venues, customers browse and book, admins approve. Read this after the root [`README.md`](../README.md) — this folder is the deeper "why and how."

Built as a modular monolith with a focus on shipping fast on low-tier infrastructure (Render + Vercel + Supabase).

## Stack

- **Frontend:** React 18 + Vite + TypeScript (3 SPAs: user-web, owner-portal, admin-panel)
- **Backend:** FastAPI (modular monolith, 15 modules) + SQLAlchemy + Alembic
- **Database:** PostgreSQL (local via Docker; Supabase + pgvector in production)
- **Auth:** Supabase Auth — JWT, session refresh; backend never stores passwords
- **Images:** Cloudinary
- **Payments:** Stripe
- **Email:** Resend / SMTP
- **Maps:** OpenStreetMap + Leaflet.js
- **LLM / Embeddings:** Groq (Deep Research query understanding) · Jina AI (search embeddings)
- **Cache / queue (optional, fail-open):** Upstash Redis — search-index queue, rate limiting, Deep Research query cache
- **Monitoring:** Sentry
- **Hosting:** Render (API) + Vercel (3 SPAs)
- **Monorepo:** pnpm workspaces

## Project structure

```
venue404/
├── apps/
│   ├── user-web/         React SPA — browse & book venues
│   ├── owner-portal/     React SPA — manage venues & bookings
│   ├── admin-panel/      React SPA — approve venues, audit, Deep Research leads
│   └── api/              FastAPI modular monolith
│       └── app/modules/  → auth, profile, venue, search, booking, availability,
│                           payment, notification, admin, review, chat,
│                           deep_research, contact, owner, internal
├── packages/
│   ├── ui/               Shared React component library
│   └── api-client/       Typed FastAPI client (auto-generated from OpenAPI)
├── docs/                 Architecture, subsystem docs, deployment
├── docker-compose.yml    Local Postgres + API
└── pnpm-workspace.yaml
```
 
Each app/package has its own `package.json`. One `pnpm-lock.yaml` at the root locks versions across the whole repo.
 
## Prerequisites
 
- **Node.js 20+** (use [nvm](https://github.com/nvm-sh/nvm) to manage versions)
- **Docker Desktop** running
- **pnpm** (enable via `corepack enable` — comes with Node)
No host Python needed — the API runs entirely inside Docker.
 
## Quick start
 
```bash
# 1. Clone and enter the repo
git clone <repo-url> venue404
cd venue404
 
# 2. Install all JS/TS dependencies (one command, all workspaces)
pnpm install
 
# 3. Set up env files
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env and fill in any test keys (Stripe, Resend, Cloudinary)
 
# 4. Start the full stack
pnpm dev:all
```
 
That's it. After `pnpm dev:all` runs you should have:
 
| Service       | URL                          |
|---------------|------------------------------|
| User app      | http://localhost:5397        |
| Owner portal  | http://localhost:5398        |
| Admin panel   | http://localhost:5399        |
| FastAPI       | http://localhost:8000        |
| FastAPI docs  | http://localhost:8000/docs   |
 
Apply initial database migrations (first time only):
 
```bash
pnpm api:migrate
```
 
## Common commands
 
```bash
# Run everything (Postgres + API + 3 React apps)
pnpm dev:all
 
# Run only the 3 React apps (backend already running)
pnpm dev
 
# Run a single app
pnpm dev:user
pnpm dev:owner
pnpm dev:admin
 
# Database migrations
pnpm api:migrate                            # apply pending migrations
pnpm api:migrate:new "describe change"      # create a new migration
pnpm api:migrate:down                       # roll back the last migration
 
# Quality checks
pnpm typecheck                              # TypeScript across all apps
pnpm lint                                   # ESLint
pnpm format                                 # Prettier
pnpm build                                  # production build (rarely needed in dev)
```
 
For ad-hoc Docker access:
 
```bash
docker compose exec api bash                          # shell into API container
docker compose exec db psql -U postgres -d venue404   # psql into Postgres
docker compose logs -f api                            # tail API logs
```
 
## Workflow basics
 
**After `git pull`:**
 
```bash
pnpm api:migrate   # if teammate added migrations
pnpm dev:all       # start working
```
 
**After changing a SQLAlchemy model:**
 
```bash
pnpm api:migrate:new "add payment_method to bookings"
# review the generated file in apps/api/alembic/versions/
pnpm api:migrate
git add . && git commit
```
 
**Before committing** (ideally automated via pre-commit hooks):
 
```bash
pnpm typecheck
pnpm lint
```
 
## Documentation

| Doc | Covers |
|---|---|
| [`architecture.md`](./architecture.md) | System architecture, modular monolith rules, module table, data model |
| [`AUTH_FLOW.md`](./AUTH_FLOW.md) | Supabase-backed auth: signup, login, session, logout |
| [`booking-lifecycle.md`](./booking-lifecycle.md) | The booking state machine — single source of truth |
| [`payments.md`](./payments.md) | Stripe payments, refunds, ledger, notifications, background jobs |
| [`search.md`](./search.md) | Hybrid full-text + semantic venue search |
| [`deep-research.md`](./deep-research.md) | Prompt search + external venue discovery + lead onboarding |
| [`dynamic-pricing.md`](./dynamic-pricing.md) | Rule-based owner pricing |
| [`instant-booking.md`](./instant-booking.md) | Pay-and-confirm booking mode |
| [`chat.md`](./chat.md) | Booking-scoped messaging |
| [`reviews.md`](./reviews.md) | Venue review system |
| [`DEPLOY.md`](./DEPLOY.md) | Deployment runbook — Render, Vercel, CI gate, background jobs |

## Environment

| Environment | Database | Hosting |
|---|---|---|
| Local | Docker Postgres | Your machine |
| Production | Supabase Postgres | Render (API) + Vercel (3 SPAs) |

Same migration files apply across environments — only `DATABASE_URL` changes. Migrations are applied manually (`alembic upgrade head`), never automated in CI or deploy.
