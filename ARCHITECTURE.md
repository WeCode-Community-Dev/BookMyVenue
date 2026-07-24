# 🏗️ Architecture

**Venue Booking Platform** — System & Repository Architecture

This document is the map of the codebase: how the frontend, backend, database, and third-party services connect, how the repo is laid out, and the rules that keep modules from becoming tangled as the project grows. For feature-level detail (schemas, endpoints, edge cases), see the per-module LLDs in `/docs/lld`.

---

## 📑 Table of Contents

1. [System Overview](#1-system-overview)
2. [Repository Layout](#2-repository-layout)
3. [Backend Folder Structure](#3-backend-folder-structure)
4. [Frontend Folder Structure](#4-frontend-folder-structure)
5. [Module Boundary Rules](#5-module-boundary-rules)
6. [Environment & Config Strategy](#6-environment--config-strategy)
7. [Naming Conventions](#7-naming-conventions)

---

## 1. System Overview

```
                              ┌──────────────────────────────┐
                              │           BROWSER             │
                              └───────────────┬──────────────┘
                                              │
                                              ▼
                        ┌──────────────────────────────────────┐
                        │            FRONTEND (Next.js)          │
                        │  Redux Toolkit · RTK Query · OpenLayers │
                        │     next-themes · next-intl             │
                        └───────────────────┬──────────────────┘
                                            │  REST  /api/v1/*
                                            ▼
                        ┌──────────────────────────────────────┐
                        │             AUTH LAYER                  │
                        │  Google OAuth · Email OTP · JWT          │
                        └───────────────────┬──────────────────┘
                                            ▼
        ┌─────────────────────────────────────────────────────────────┐
        │                      BACKEND API (NestJS)                     │
        │                                                                 │
        │   ┌────────┐  ┌────────┐  ┌─────────┐  ┌────────┐  ┌────────┐  │
        │   │  Auth  │  │ Venue  │  │ Booking │  │  User  │  │ Admin  │  │
        │   └────────┘  └────────┘  └─────────┘  └────────┘  └────────┘  │
        │                  ┌──────────────┐                              │
        │                  │ Notification │  (standalone, called by all) │
        │                  └──────────────┘                              │
        └───────┬─────────────────────┬─────────────────────┬───────────┘
                │                     │                     │
                ▼                     ▼                     ▼
   ┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
   │   Upstash Redis      │  │   PostgreSQL       │  │  Third-Party Services  │
   │  OTP · Rate Limit ·  │  │  Users · Venues ·   │  │  Razorpay · Cloudinary │
   │  Booking Slot Locks  │  │  Bookings · Wishlist │  │  Nodemailer · OSM     │
   └─────────────────────┘  └──────────────────┘  └──────────────────────┘
```

| Layer | Responsibility |
|---|---|
| **Frontend** | Next.js app — rendering, RTK Query API calls, map UI, theming, i18n |
| **Auth Layer** | Identity verification, JWT issuance — sits in front of all protected routes |
| **Backend API** | NestJS feature modules — each owns its own schema, endpoints, and business logic |
| **Cache / Lock Store** | Upstash Redis — OTP, rate limiting, booking slot locks |
| **Database** | PostgreSQL — single source of truth for all persisted data |
| **Third-Party Services** | Razorpay, Cloudinary, Nodemailer, OpenStreetMap — called directly from the relevant backend module |

> Full request/response contracts, schemas, and sequence flows for each module live in their own LLD documents — this diagram only shows how the *pieces* fit together.

---

## 2. Repository Layout

Single repo, two top-level apps, kept structurally independent so either could be deployed or even extracted on its own later.

```
venue-booking-platform/
├── frontend/              # Next.js application
├── backend/               # NestJS application
├── docs/
│   ├── prd.md
│   ├── architecture.md    # this file
│   └── lld/
│       ├── auth-module-lld.md
│       ├── venue-module-lld.md
│       ├── booking-module-lld.md
│       ├── user-module-lld.md
│       ├── admin-module-lld.md
│       └── notification-module-lld.md
├── .gitignore
└── README.md
```

Frontend and backend each have their own `package.json`, `.env`, and dependency tree — there is no shared `node_modules` or monorepo tooling (Turborepo/Nx) in Phase 1. That's a Phase 2 consideration if the project's contributor base grows enough to need it.

---

## 3. Backend Folder Structure

NestJS, organized as **one feature module per domain area** — mirroring the module split used across the LLDs (Auth, Venue, Booking, User, Admin, Notification).

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── google.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   └── dto/
│   │
│   ├── venue/
│   │   ├── venue.module.ts
│   │   ├── venue.controller.ts
│   │   ├── venue.service.ts
│   │   ├── availability/
│   │   │   ├── availability.controller.ts
│   │   │   └── availability.service.ts
│   │   ├── images/
│   │   │   ├── images.controller.ts
│   │   │   ├── images.service.ts
│   │   │   └── cloudinary.provider.ts
│   │   └── dto/
│   │
│   ├── booking/
│   │   ├── booking.module.ts
│   │   ├── booking.controller.ts
│   │   ├── booking.service.ts
│   │   ├── payment/
│   │   │   ├── razorpay.provider.ts
│   │   │   └── payment.service.ts
│   │   └── dto/
│   │
│   ├── user/
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── dto/
│   │
│   ├── admin/
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   └── dto/
│   │
│   ├── notification/
│   │   ├── notification.module.ts
│   │   ├── notification.controller.ts
│   │   ├── notification.service.ts
│   │   └── dto/
│   │
│   ├── amenity/
│   │   ├── amenity.module.ts
│   │   ├── amenity.controller.ts
│   │   └── amenity.service.ts
│   │
│   ├── common/                      # shared across all modules
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── decorators/
│   │
│   ├── config/
│   │   ├── configuration.ts          # env loading & validation
│   │   └── redis.config.ts
│   │
│   └── prisma/
│       ├── prisma.service.ts
│       └── prisma.module.ts
│
├── prisma/
│   ├── schema.prisma                 # single schema file, all models
│   └── migrations/
│
├── test/
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

**Why one module per domain, not a layered structure (controllers/, services/, models/ at the top level):** keeps everything related to "Venue" in one place — easier for a new open-source contributor to find and reason about, and matches NestJS's own recommended module pattern.

---

## 4. Frontend Folder Structure

Next.js App Router, **feature-based** — matching what's already implemented. Documented here so backend contributors and reviewers understand how it maps to the same domain split used on the backend.

```
frontend/
├── app/                              # Next.js App Router — routes only
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── venues/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── layout.tsx
│   ├── (owner)/
│   │   ├── my-venues/page.tsx
│   │   └── add-venue/page.tsx
│   ├── (admin)/
│   │   └── dashboard/page.tsx
│   └── layout.tsx
│
├── features/                         # feature-based domain modules
│   ├── auth/
│   │   ├── components/
│   │   ├── authApi.ts                 # RTK Query slice
│   │   └── authSlice.ts
│   ├── venue/
│   │   ├── components/
│   │   ├── venueApi.ts
│   │   └── venueSlice.ts
│   ├── booking/
│   │   ├── components/
│   │   ├── bookingApi.ts
│   │   └── bookingSlice.ts
│   ├── wishlist/
│   │   ├── components/
│   │   └── wishlistApi.ts
│   └── notification/
│       ├── components/
│       └── notificationApi.ts
│
├── components/                       # shared/reusable UI, not feature-specific
│   ├── ui/
│   └── layout/
│
├── lib/
│   ├── store.ts                      # Redux store setup
│   └── api-client.ts                 # RTK Query base config
│
├── public/
├── messages/                         # next-intl translations
│   ├── en.json
│   └── hi.json
├── next.config.js
└── tsconfig.json
```

**Mapping to the backend:** each folder under `features/` corresponds to a backend module of the same name (`auth/`, `venue/`, `booking/`) — a contributor working on Booking knows to look in `backend/src/booking/` and `frontend/features/booking/` for the full vertical slice.

---

## 5. Module Boundary Rules

These rules came directly out of the per-module LLD design work and are the most important part of this document — they're what keep the codebase from drifting into tangled cross-imports as more contributors join.

> **Rule 1 — Cross-module communication is a direct service call, not a schema relation.**
> Example: `VenueService` calls `AuthService.upgradeToVenueOwner(userId)` directly. There is no foreign key between `Venue` and `User.role` — the call updates it through code, not through the database.

> **Rule 2 — The only schema relation that crosses module ownership is `Notification.userId → User.id`.**
> Every other cross-module interaction (Booking checking Venue availability, Admin updating Venue status) happens via an exported service method, never by adding a new foreign key into another module's table.

> **Rule 3 — No message queue (RabbitMQ) in Phase 1.**
> This is a single NestJS process. A queue solves problems that arise when services are deployed separately and can't call each other directly — that isn't the case here. Reserved for a future microservices split, if the project ever grows into one.

> **Rule 4 — Notification is a standalone module, owned by no one feature.**
> Auth, Venue, Booking, and Admin all call into it (`NotificationService.create(...)`), but none of them import its internals or duplicate its logic.

> **Rule 5 — Each module owns its own DTOs, guards, and validation.**
> A module never reaches into another module's `dto/` folder or reuses its validation pipes directly — shared validation logic goes in `common/`, not by importing from a sibling feature module.

---

## 6. Environment & Config Strategy

| Variable group | Used by | Example keys |
|---|---|---|
| Database | Prisma / PostgreSQL | `DATABASE_URL` |
| Redis | Upstash | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Auth | Auth module | `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Email | Notification / Auth | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` |
| Payments | Booking module | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| Media | Venue module | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

- `backend/.env.example` and `frontend/.env.example` are committed; actual `.env` files are git-ignored
- Config is loaded and validated once at startup (`config/configuration.ts`), not read directly via `process.env` scattered across modules

---

## 7. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| NestJS files | `kebab-case.type.ts` | `create-venue.dto.ts`, `jwt-auth.guard.ts` |
| Modules/Classes | `PascalCase` | `VenueService`, `CreateVenueDto` |
| API endpoints | `/api/v1/kebab-case` | `/api/v1/venues/:id/blocked-dates` |
| Database tables (Prisma models) | `PascalCase` singular | `Venue`, `VenueSlotTemplate` |
| Frontend feature folders | `kebab-case`, matches backend module name | `features/booking/` ↔ `backend/src/booking/` |
| RTK Query slices | `camelCase` + `Api` suffix | `venueApi.ts`, `bookingApi.ts` |

---



**Venue Booking Platform** · Architecture Reference · v1.0

