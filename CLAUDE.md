# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

BookMyVenue is a community-driven venue discovery and booking platform (WeCode open-source project), currently focused on venues across the districts of Kerala, India. It is a pnpm + Turborepo monorepo.

## Commands

Run from the repo root unless noted. Turborepo fans tasks out across workspaces.

```bash
pnpm install              # install all workspace deps
pnpm dev                  # run all apps in dev (turbo run dev)
pnpm build                # build all (runs ^db:generate first)
pnpm check-types          # typecheck all workspaces
```

Per-app (run inside the app dir, or use `pnpm --filter <pkg> <script>`):
- `apps/client` — Next.js, `pnpm dev` on **port 3000**
- `apps/admin` — Next.js, `pnpm dev` on **port 3001**
- `apps/client-api` — Fastify (tsx watch), `pnpm dev` on **port 4000** (`PORT` env overrides)
- Lint a Next app: `pnpm lint` (`next lint .`); typecheck a Next app runs `next typegen && tsc --noEmit`

Database (in `packages/database`, or `pnpm --filter @bookmyvenue/database <script>`):
```bash
pnpm db:generate          # prisma generate (regenerate client after schema edits)
pnpm db:migrate           # prisma migrate dev (create + apply a dev migration)
pnpm db:deploy            # prisma migrate deploy (apply migrations in prod)
```

There is **no test framework** configured yet — do not assume a `test` script exists.

## Architecture

Three apps + shared packages, wired through the pnpm workspace (`apps/*`, `packages/*`).

### Apps
- **`apps/client`** — public marketplace (Next.js 16, App Router, `src/app`). Users browse/book venues; owners manage listings under `/owner`.
- **`apps/admin`** — internal admin dashboard (Next.js 16, App Router, `app/` at root — **no `src/`**). Approves/rejects venues, views analytics.
- **`apps/client-api`** — Fastify backend (ESM, `type: "module"`). The single HTTP API the client talks to.

Note: this repo uses **Next.js 16**, where middleware lives in **`proxy.ts`** (not `middleware.ts`). Both Next apps define route protection there via Clerk's `clerkMiddleware`.

### Shared packages
- **`@bookmyvenue/database`** — Prisma 7 + PostgreSQL. Exports a singleton `prisma` client (`src/client.ts`, uses `@prisma/adapter-pg`). The Prisma client is **generated as `.ts` sources** into `packages/database/generated/prisma` (`moduleFormat = esm`, `importFileExtension = ts`) and consumed directly with no build step. Import models/types from `@bookmyvenue/database`; import enums from `@bookmyvenue/database/enums`.
- **`@bookmyvenue/types`** — shared TypeScript types split by domain (`auth`, `venue`, `booking`, `review`). Request/response contracts for the API and client hooks live here.
- **`@bookmyvenue/typescript-config`**, **`@bookmyvenue/eslint-config`**, **`tailwind-config`** — shared config.

### Backend request flow (`apps/client-api`)
Layered, one set of files per domain (`venue`, `booking`, `review`):

```
index.ts → registers routes under prefixes (/venue, /booking, /review)
routes/*.route.ts → declares endpoints; attaches preHandler (auth) + Fastify JSON `schema` (validation)
controllers/*.controller.ts → request handling, Prisma queries, response shaping
services/*.service.ts → reusable business logic (e.g. review eligibility)
schemas/*.schema.ts → Fastify JSON Schema for body/querystring validation
```

- **Auth** (`middleware/authmiddleware.ts`): `userAuthMiddleware` requires a signed-in Clerk user; `ownerAuthMiddleware` additionally requires `sessionClaims.metadata.role === "OWNER"`. Both attach `request.userId` (augmented onto `FastifyRequest`). Clerk is registered globally via `clerkPlugin`.
- Authorization is also enforced at the data layer — e.g. `editVenue` verifies `venue.ownerId === request.userId`.

### Client data flow (`apps/client`)
- `lib/api/*Api.ts` — plain `fetch` functions hitting `process.env.NEXT_PUBLIC_API_BASE`; authenticated calls pass a Clerk token as `Bearer`.
- `hooks/use*.ts` — TanStack Query wrappers (`useQuery`/mutations) over those API functions; `QueryProvider` wraps the app.
- `stores/*.ts` — Zustand for local UI state (e.g. `bookingStore` holds selected sessions/date before submission).

### Auth & user provisioning (Clerk)
- Auth is handled by **Clerk** across all apps. Sign-up distinguishes USER vs OWNER via `unsafe_metadata.role`.
- On `user.created`, the Clerk webhook (`apps/client/src/app/api/webhooks/clerk/route.ts`, verified with `svix`) creates the `User` row in the DB and, for USERs, promotes the role into Clerk `publicMetadata`. **The DB `User.id` is the Clerk user id** — there is no separate `clerkId` column.
- Role is read from `publicMetadata.role` / `sessionClaims.metadata.role` for routing and gating (`auth-redirect/page.tsx`, `proxy.ts`).

### Data model (`packages/database/prisma/schema.prisma`)
Core entities: `User` (role: ADMIN/OWNER/USER) → owns `Venue`s → each has `VenueSession`s (priced time slots) → `Booking`s contain `BookingSession`s (a session on a specific `eventDate`) → `Review`s.

Key invariants encoded in the schema:
- **Double-booking prevention**: `BookingSession @@unique([sessionId, eventDate])`. On conflict, `createBooking` returns 409 (`P2002`).
- **One review per user per venue**: `Review @@unique([venueId, userId])`. Eligibility (`getVenueReviewStatusService`) requires a past booking and no existing review, returning states like `CAN_REVIEW` / `ALREADY_REVIEWED`.
- Venues require admin approval: public queries filter `isActive: true` AND `verificationStatus: APPROVED`.
- `Venue.id` and `VenueSession.id` are `Int` autoincrement; `User`, `Booking`, `Review` ids are UUID strings.

## Conventions
- **Contribution workflow**: branch from `main` as `feat/`, `fix/`, `docs/`, or `chore/`; open PRs against `main` using `.github/PULL_REQUEST_TEMPLATE.md`. Never commit to `main` directly.
- Env vars are per-app `.env` files (gitignored). Notable: `DATABASE_URL` (global, needed by Prisma), `NEXT_PUBLIC_API_BASE` (client → API), `CLERK_WEBHOOK_SECRET`, Clerk publishable/secret keys, `PORT` (client-api).
- After changing `schema.prisma`, run `db:generate` (and `db:migrate` for schema changes) — the generated client is committed sources, not a build artifact.
- Shared request/response types belong in `@bookmyvenue/types`, not duplicated per app.
