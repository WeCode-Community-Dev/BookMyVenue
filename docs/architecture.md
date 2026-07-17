# Architecture

**Status:** Shipped — verified against code, 2026-07-17

This document is the canonical "why and how" of Venue404's system design. Read it after the root [`README.md`](../README.md). Deep dives on specific subsystems live in their own docs and are linked throughout — this file stays at the system level.

---

## Overview

Venue404 is a venue booking platform with three user roles: **customers** (browse and book), **venue owners** (list and manage venues), and **super admins** (approve venues and audit activity). The system is a **modular monolith**: one FastAPI deployable with 15 internally separated modules, three independent React frontends, and one shared PostgreSQL database (Supabase).

The architecture optimizes for two things:

1. **Shipping speed.** One backend deployable, free/low-tier infrastructure (Render + Vercel + Supabase), no premature distributed-systems complexity.
2. **A clean extraction path.** If a module needs to scale independently (Payment and Search are the likely first candidates), it can be lifted into its own service without rewriting the system — the module boundary already exists in code.

---

## Architectural pattern: modular monolith

The backend is a single FastAPI application organized into self-contained modules under `apps/api/app/modules/`. Each module owns its routes, schemas, models, and business logic. Cross-module communication happens through **service functions**, never through direct model or database access.

```
apps/api/app/
├── core/              ← infrastructure: DB session, JWT verification, config, Redis, Sentry
├── infrastructure/    ← external AI providers: Groq (llm/), Jina AI (embeddings/)
├── shared/             ← reusable utilities (base models, pagination)
├── modules/            ← the 15 business modules (below)
└── jobs/               ← background job runner (APScheduler + the internal job endpoint)
```

### Why modular monolith, not microservices?

For a small-team product at this stage, microservices add operational overhead (multiple deploys, service discovery, distributed tracing, eventual consistency) without proportional benefit. A modular monolith gives the **logical separation** of microservices without the **physical complexity**. Boundaries are enforced by convention and code review, not the network — the cost of crossing them improperly is a review comment, not a production outage.

A module becomes a real extraction candidate when it has dramatically different scaling needs than the rest (Payment spikes during peak booking hours; Search is hit constantly), needs an independent deploy cadence, or needs a different runtime. None of that applies yet.

### Module rules (enforced by code review, not the runtime)

1. **Modules do not import other modules' models or query each other's tables.** If `booking` needs venue data, it calls `venue.service.get_venue_by_id(id)` — it does not `from app.modules.venue.models import Venue`.
2. **Service functions are the only public API of a module.** Models, schemas, and internal helpers are private to the module that owns them.
3. **Shared, non-business utilities go in `shared/`**, not scattered across modules. If two modules need similar logic, one of them should own it and the other should call its service.
4. **Cross-cutting infrastructure goes in `core/`** — DB session, auth verification, config, Redis, Sentry. Imported everywhere; not a "module."
5. **A module that owns no data still gets a `service.py`.** `search` has no models of its own (it queries via `venue.service`), but its own `search/service.py` orchestrates ranking logic, so callers depend on `search`, not on `venue` internals.

---

## Modules

| Module | Responsibility | Deep dive |
|---|---|---|
| `auth` | Verifies Supabase JWTs, exposes `GET /auth/me`, role-check dependencies | [`AUTH_FLOW.md`](./AUTH_FLOW.md) |
| `profile` | `profiles` and `user_roles` — identity data for all three roles | — |
| `venue` | Venue CRUD, photos, amenities, availability windows, blocked dates, pricing rules, cancellation policy, approval state | — |
| `availability` | Slot/calendar queries and validation on top of `venue` + `booking_slots` | — |
| `booking` | The booking state machine — request → accept/instant-pay → confirm → complete | [`booking-lifecycle.md`](./booking-lifecycle.md) |
| `payment` | Stripe payment intents, refunds, ledger, payouts, webhook idempotency | [`payments.md`](./payments.md) |
| `notification` | In-app notifications + transactional email | — |
| `admin` | Venue approval workflow, suspensions, `platform_settings`, append-only audit log, external-lead admin workflow | [`payments.md`](./payments.md), [`deep-research.md`](./deep-research.md) |
| `search` | Hybrid full-text + semantic venue search, indexing jobs | [`search.md`](./search.md) |
| `review` | Venue reviews, one per completed booking, admin moderation | [`reviews.md`](./reviews.md) |
| `chat` | Booking-scoped messaging (REST + WebSocket) | [`chat.md`](./chat.md) |
| `deep_research` | Prompt-driven search + AI-assisted external venue discovery + lead-to-venue onboarding | [`deep-research.md`](./deep-research.md) |
| `contact` | Public "contact us" message → email | — |
| `owner` | Owner dashboard stats, charts, upcoming events | — |
| `internal` | Token-guarded machine-to-machine endpoint (`POST /internal/run-jobs`) that GitHub Actions cron calls to run scheduled jobs | [`DEPLOY.md`](./DEPLOY.md) |

Each module folder generally looks like:

```
modules/booking/
├── routes.py        FastAPI router
├── schemas.py       Pydantic request/response models
├── models.py        SQLAlchemy ORM models
├── service.py       Business logic
└── dependencies.py  FastAPI dependencies (e.g. require_owner)
```

---

## Data model

~30 tables. Grouped by domain — full column-level detail lives in each module's `models.py` or its linked doc above.

```
profiles ──< bookings >── venues ──< venue_photos
   │             │            │  ├── venue_pricing_rules
   │             │            │  ├── venue_cancellation_policies
   │             │            │  └── venue_availability / venue_blocked_dates
   │             ├── booking_slots (GIST exclusion constraint — see below)
   │             ├── booking_status_history (append-only)
   │             ├── payments / refunds / ledger_entries
   │             ├── chat_messages
   │             └── venue_reviews
   └── user_roles
```

- **Identity & access:** `profiles`, `user_roles`
- **Admin & platform:** `admin_actions` (append-only), `platform_settings` (Redis-cached, DB-backed, hot-reloadable)
- **Venue:** `venues`, `venue_categories`, `venue_photos`, `amenities`, `venue_amenities`, `venue_availability`, `venue_blocked_dates`, `venue_pricing_rules`, `venue_cancellation_policies`, `venue_likes`
- **Booking:** `bookings`, `booking_slots`, `booking_status_history`, `booking_invoices`
- **Payments:** `payments`, `refunds`, `ledger_entries` (append-only source of truth for money), `payout_requests`, `stripe_events` (webhook idempotency)
- **Engagement:** `chat_messages`, `venue_reviews`, `notifications`
- **Search:** `search_index_jobs`
- **Deep Research:** `deep_research_queries`, `external_discovery_requests`, `external_venue_leads`, `lead_reservations`

### Critical DB-level constraint

Slot overlap is prevented by a **Postgres GIST exclusion constraint**, not application logic:

```sql
ALTER TABLE booking_slots
ADD CONSTRAINT booking_slots_no_overlap
EXCLUDE USING gist (
    venue_id WITH =,
    tstzrange(effective_starts_at, effective_ends_at) WITH &&
) WHERE (is_blocking = true AND deleted_at IS NULL);
```

Even if two race-condition requests get past application-level checks, the database itself rejects the second insert. **Do not rely solely on application code to prevent double-booking** — the exclusion constraint is the source of truth. Added by hand-edited migration `914d6f7a8b9c_add_booking_constraints_and_indices.py` (Alembic's autogenerate does not detect exclusion constraints).

Full state machine, transition table, and cancellation/refund rules: [`booking-lifecycle.md`](./booking-lifecycle.md).

---

## Authentication & authorization

- **Supabase Auth is the source of truth** for credentials, sessions, and JWT issuance. The FastAPI backend never stores passwords or sessions — it only verifies the Supabase JWT on each request (RS256 via JWKS, or HS256 via shared secret) and maps the user to `profiles` + `user_roles`.
- Business code depends on an internal `AuthContext`/`AuthUser`, never a raw Supabase user object outside the auth provider layer — this keeps business modules provider-agnostic (a future swap to Clerk/Auth0 wouldn't touch them).
- Shared route dependencies — `require_auth`, `require_role`, `require_any_role`, `require_owner`, `require_admin` — are the only way routes enforce authorization; it is never duplicated inline in a handler.
- Role checks alone are never sufficient — ownership is always validated too (`booking.user_id == current_user.id`, `venue.owner_id == current_user.id`).
- `SUPABASE_SERVICE_ROLE_KEY` never reaches the browser; frontends hold only the anon key. Frontend authorization is UX only — backend authorization is authoritative.

Full flow with sequence diagrams: [`AUTH_FLOW.md`](./AUTH_FLOW.md).

---

## Background jobs & queues

Two independent mechanisms — don't conflate them:

1. **Scheduled business jobs** (hold expiry, payment reminders, request expiry, overdue flagging, completion) run via **GitHub Actions cron** hitting the token-guarded `POST /internal/run-jobs` endpoint on the live API — not an in-process scheduler in production. `ENABLE_JOBS=false` in `render.yaml` keeps the in-process APScheduler off; it exists for local dev only. See [`DEPLOY.md`](./DEPLOY.md) for the exact cadence.
2. **Upstash Redis** (optional, fail-open — every caller checks `is_configured()` first) is used narrowly for: the search-indexing job queue, rate limiting, and Deep Research's query cache. It is **not** a general task queue — if Redis is unreachable, the search indexer falls back to polling `search_index_jobs` directly in the DB, and rate limiting/caching degrade gracefully rather than failing requests. See [`search.md`](./search.md).

---

## External services

| Service | Purpose | Accessed from |
|---|---|---|
| **Stripe** | Payments — checkout, refunds, webhooks | `payment` module only |
| **Cloudinary** | Venue photos + image CDN | `venue` module (also Deep Research's photo caching) |
| **Resend / SMTP** | Transactional email | `notification` module |
| **OpenStreetMap + Leaflet** | Venue map previews | frontend only, no backend calls |
| **Google Places API** | External venue discovery | `deep_research` module only |
| **Groq** | LLM query understanding | `deep_research` module (`app/infrastructure/llm/`) |
| **Jina AI** | Search embeddings | `search` module (`app/infrastructure/embeddings/`) |
| **Sentry** | Error + performance monitoring | wired in `app/core/sentry.py`, applies to all modules |
| **Upstash Redis** | Search queue, rate limiting, query cache (fail-open) | `core/redis.py`, called from `search` and `deep_research` |

A module should only call the external service that's "theirs" — Stripe from `payment`, Cloudinary from `venue`, Resend from `notification`.

---

## Frontend architecture

Three independent React + Vite + TypeScript SPAs in `apps/`:

- **user-web** — public-facing, browse and book venues
- **owner-portal** — venue management, accept/reject requests, dashboard
- **admin-panel** — venue approval, user suspension, audit log, Deep Research lead management

They share code through two workspace packages:

- **`@venue404/ui`** — design system (buttons, inputs, cards, modals, date pickers). React is a `peerDependency` to avoid multiple React instances.
- **`@venue404/api-client`** — typed FastAPI client, generated from `/openapi.json` — backend contract changes surface as compile-time errors in every frontend.

Three apps over one role-routed app: smaller bundles (no user downloads admin code), independent deploys (a bug in the admin panel can't block a user-facing fix), clearer ownership. The tradeoff — some shared-infra duplication (auth context, layout shells) — is mitigated by `@venue404/ui`.

---

## Hosting & environments

| Environment | Database | Backend | Frontends |
|---|---|---|---|
| Local | Postgres (Docker) | FastAPI (Docker) | Vite dev server |
| Production | Supabase Postgres | **Render** (Docker web service, `render.yaml`) | **Vercel** (one project per app) |

- API and all three frontends auto-deploy on push to `main`, gated by CI (`frontend`: lint advisory + build blocking; `api`: pytest blocking).
- Migrations are applied manually (`alembic upgrade head`) against production — never automated in CI or deploy.
- Render's free tier spins the API down after ~15 min idle; a keepalive GitHub Actions workflow pings `/health` every 13 minutes.

Full runbook: [`DEPLOY.md`](./DEPLOY.md).

---

## Things deliberately not built yet

- **A general async job queue.** Scheduled jobs run via cron hitting an HTTP endpoint, not a worker pool — sufficient at current volume; revisit if job latency or Render cold-starts become a problem.
- **Multi-region deploy.** Single Render region is enough for the current user base.
- **Native mobile apps.** Web-only; the three SPAs would need a rewrite or wrapper if mobile becomes a priority.
- **ML/demand-based pricing.** Dynamic pricing is currently rule-based (owner-defined percentage rules); the schema's `source` column already supports a future `system`-generated rule type without a migration. See [`dynamic-pricing.md`](./dynamic-pricing.md).
- **Multi-tenant venue chains.** One venue per owner record is the current assumption.

---

## Future scaling path (rough order of likelihood)

1. Vertical-scale the Render instance.
2. Read replicas on Supabase for search/listing read paths.
3. Move scheduled jobs from cron-triggered HTTP to a dedicated worker with a real queue (the Upstash Redis groundwork already exists for `search`).
4. Extract `search` into its own service if ranking/indexing load grows independently of the rest of the platform.
5. Extract `payment` for compliance isolation and independent deploy cadence.

Each step is a real engineering investment — don't pre-build ahead of the metric that justifies it.

---

## Decision log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05 | Modular monolith over microservices | Small-team product, optimize for shipping speed |
| 2026-05 | Three React SPAs over one role-routed app | Bundle size, deploy independence, clearer ownership |
| 2026-05 | Supabase Auth over self-issued JWT | Offload credential storage, session refresh, and JWKS rotation to a managed provider |
| 2026-06 | Render + Vercel over Fly.io | Simpler Docker-native deploy story for the target scale; superseded an earlier Fly.io Mumbai plan |
| — | DB exclusion constraint as source of truth for slot overlaps | Prevents race conditions even if application code has bugs |
| 2026-07 | Rule-based (not ML) dynamic pricing for Phase 1 | Deterministic, explainable pricing owners can reason about; schema left forward-compatible for system-generated rules |
| 2026-07 | Deep Research's `lead_reservations` doubles as the external-reservation-to-onboarded-venue workflow | One pipeline, not two competing ones, for converting off-platform demand into supply |

When making a new significant decision (new external service, new module, new pattern), add a row here so future contributors understand *why* the system looks the way it does.
