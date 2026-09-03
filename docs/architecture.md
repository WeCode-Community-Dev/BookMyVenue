# BookMyVenue Architecture

## Overview
BookMyVenue is an open-source venue booking platform built as a pnpm monorepo with three workspaces: `server` (Node.js/Express API), `client` (user-facing React app), and `admin` (owner/admin dashboard).

## Tech Stack
| Component | Technology |
|---|---|
| Backend | Node.js, Express 5, TypeScript ~5.9 |
| Database | MongoDB via Mongoose 9 |
| Frontend (Client) | React 19, Vite 8, TailwindCSS 4, TypeScript ~6.0 |
| Frontend (Admin) | React 19, Vite 8, Zustand 5, TanStack React Table, Recharts |
| Package Manager | pnpm 10.16.1 (workspaces) |
| API Docs | Swagger/OpenAPI via swagger-jsdoc |
| Payment | Razorpay |
| Email | Resend |
| Media | Cloudinary |

## Monorepo Structure
```
BookMyVenue/
├── server/                  # Express API backend
│   └── src/
│       ├── modules/         # Feature modules (auth, venue, booking, etc.)
│       ├── middlewares/     # Express middlewares
│       ├── models/          # Shared Mongoose models
│       ├── services/        # Shared business logic
│       ├── workers/         # Background job processors
│       ├── configs/         # Configuration files
│       ├── constants/       # App constants (permissions, etc.)
│       ├── utils/           # Utilities (logger, response, errors)
│       └── types/           # TypeScript declarations
├── client/                  # User-facing React app
│   └── src/
│       ├── pages/           # Page components
│       ├── components/      # Reusable UI components
│       ├── hooks/           # Custom React hooks
│       ├── services/        # API service layer (Axios)
│       ├── context/         # React Context state
│       ├── utils/           # Utilities
│       └── constants/       # App constants
└── admin/                   # Admin dashboard React app
    └── src/
        ├── pages/
        ├── components/
        ├── hooks/
        ├── services/
        ├── store/           # Zustand stores
        ├── utils/
        └── constants/
```

## Module Architecture (Server)
Each feature module follows a consistent pattern:

```
modules/<name>/
├── controller.ts    → Express route handlers (reads req.validated)
├── service.ts       → Business logic layer
├── repository.ts    → Database queries (Mongoose)
├── router.ts        → Route definitions with middleware
├── validator.ts     → Zod schemas for request validation
├── types.ts         → Module-specific TypeScript types
└── models/          → Mongoose schemas (optional, some in root models/)
```

Data flows: **Router → Middleware (auth, validation, RBAC, pagination) → Controller → Service → Repository → MongoDB**

Controllers always access validated data via `req.validated` (not raw `req.body`), populated by the validation middleware.

## Server Modules (14 total)
| Module | Description | Files |
|---|---|---|
| `auth` | Login, register, JWT tokens, password reset, session management | 5 |
| `venue` | CRUD, draft management, venue submission workflow | 10 |
| `booking` | Booking CRUD, Razorpay payment integration, booking workflow | 8 |
| `availability` | Venue availability schedules | 5 |
| `user` | User profile management, admin user management | 8 |
| `owner` | Owner-specific operations: analytics, block dates, offline bookings, reviews, settings, venue management | 6 |
| `rbac` | Role-based access control | 3 |
| `role` | Role/permission management | 5 |
| `review` | Venue reviews, ratings, moderation | 7 |
| `moderation` | Content moderation: banned users, activity logs, summary dashboard | 13 (2 sub-routers) |
| `geo` | Geocoding/search via OpenStreetMap Nominatim | 3 |
| `wishlist` | User wishlists, toggle, sync, status | 7 |
| `webhook` | Razorpay webhook handling (HMAC verification) | 3 |
| `swagger` | OpenAPI/Swagger documentation UI | 2 |

## Middleware Stack
Order in `server/src/app.ts`:
1. `helmet()` — Security headers
2. Rate limiter — 100 requests/15 min (global)
3. Webhook router (`/api/v1/webhook`) — Mounted BEFORE body parsing (raw body needed for HMAC)
4. `express.json()`, `express.urlencoded()` — Body parsing (10kb limit)
5. CORS, cookie-parser, compression — Cross-origin, cookies, gzip/brotli
6. Cache-control headers — `no-store` on all API responses
7. Request logger — Winston HTTP logging
8. Main router (`/api/v1`) — All module routes
9. 404 handler — Route/method not found
10. Global error handler — Unhandled exceptions

## Available Middlewares
- **authMiddleware** (`auth.middleware.ts`) — Validates JWT, populates `req.user`
- **validationMiddleware** (`validation.middleware.ts`) — Validates body/params/query against Zod schemas, stores in `req.validated`
- **rbacMiddleware** (`rbac.middleware.ts`) — Checks user permissions/roles, supports `requirePermission()` and `requireRole()`
- **paginationMiddleware** (`pagination.middleware.ts`) — Parses `page`, `limit`, `sort`, `skip` query params
- **ownerTenantMiddleware** (`ownerTenant.middleware.ts`) — Validates owner access to venue-scoped resources
- **idempotencyMiddleware** (`idempotency.middleware.ts`) — Ensures idempotent payment/booking operations via `Idempotency-Key` header

## RBAC System
Roles are stored in MongoDB with a hierarchy:
```
superAdmin (rank 1) → admin (rank 2) → owner (rank 3) → user (rank 4)
```
- Permissions follow `action:entity` pattern (e.g., `create:venues`, `read:bookings`)
- Role hierarchy is resolved via `$graphLookup` at runtime
- RBAC data must be seeded after fresh DB: `pnpm script seed:rbac`
- Server verifies seed at startup via `verifyRbacSeed()` and exits if missing

## API Response Format
All responses use `ResponseUtil`:
- **Success**: `{ success: true, message: "...", data?: {...} }`
- **Error**: `{ success: false, message: "...", error?: "..." }`
- **Paginated**: `{ success: true, message: "...", data: { items: [...], pagination: { total, page, limit, skip, totalPages, hasNext, hasPrev } } }`

`ResponseUtil` methods: `success`, `paginated`, `error`, `created`, `notFound`, `badRequest`, `unauthorized`, `forbidden`, `conflict`, `rateLimitExceeded`, `validationError`, `internalServerError`, `serverUnavailable`

## Background Workers
3 workers start automatically with the server in `server.ts`:
1. **Email Worker** (`workers/email.worker.ts`) — Processes queued emails from `email-task` MongoDB collection
2. **Ban Expiry Worker** (`workers/banExpiry.worker.ts`) — Automatically lifts expired bans
3. **Venue Edit Deadline Worker** (`workers/venueEditDeadline.worker.ts`) — Manages venue edit deadlines

## State Management
- **Server**: Stateless (JWT-based auth), MongoDB as single source of truth
- **Client**: React Context + TanStack React Query for server state
- **Admin**: Zustand stores for local state + TanStack React Query for server state

## Key Design Patterns
- **Draft/Submit workflow**: Venue creation uses a two-phase flow (incremental draft → full submission)
- **Validation**: Zod schemas validated by middleware; controllers never access raw `req.body`
- **Pagination**: Standardized via `paginationMiddleware` with configurable defaults per route
- **Idempotency**: Key-based idempotency for payment/booking endpoints stored in MongoDB
- **Error handling**: Controllers wrap service calls in try/catch with `handleError()` utility; global handler catches unhandled errors
- **Webhook handling**: Raw body preserved via early route mounting for Razorpay HMAC verification
