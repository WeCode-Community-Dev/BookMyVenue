# Authentication Module — Low Level Design

**Project:** Venue Booking Platform
**Module:** 1 of 6 — Authentication
**Status:** ✅ Approved for Phase 1
**Version:** 1.1
**Last Updated:** 2026-06-19

---

## Page Tree

- [1. Scope](#1-scope)
- [2. Roles Covered](#2-roles-covered)
- [3. Database Schema](#3-database-schema-prisma)
- [4. Redis Keys (Upstash)](#4-redis-keys-upstash)
- [5. API Endpoints](#5-api-endpoints)
- [6. Request / Response Contracts](#6-request--response-contracts)
- [7. JWT Payload & Session Strategy](#7-jwt-payload--session-strategy)
- [8. NestJS Module Structure](#8-nestjs-module-structure)
- [9. Guard & Decorator Usage](#9-guard--decorator-usage)
- [10. Role Auto-Upgrade Logic](#10-role-auto-upgrade-logic)
- [11. profileIssues Computation](#11-profileissues-computation)
- [12. Validation Rules (DTOs)](#12-validation-rules-dtos)
- [13. Sequence Flows](#13-sequence-flows)
- [14. Edge Cases Handled](#14-edge-cases-handled)
- [15. Third-Party Integration Summary](#15-third-party-integration-summary)
- [16. Out of Scope (Phase 1)](#16-explicitly-out-of-scope-phase-1)
- [17. Decision Log](#17-decision-log)
- [18. Open Questions](#18-open-questions)

---

## 1. Scope

This module covers user authentication via **Email OTP** and **Google OAuth**, JWT issuance/validation, and the role model (`User` / `Venue Owner` / `Admin`) including its auto-upgrade logic. It also owns core profile fields (`name`, `avatarUrl`, `phone`) and a computed profile-completeness indicator (`profileIssues`).

> 🔗 **Cross-module dependency:** Role auto-upgrade (`User → Venue Owner`) is owned by this module but **triggered externally** by the Venue module when a user adds their first listing.

> 📦 **Module boundary note:** In-app notifications (the bell-icon feed seen in the UI) are deliberately **excluded** from this module. Notification storage/delivery is event-driven from Venue, Booking, and Admin modules — it does not belong to Authentication and is documented separately as its own module (`notification-module-lld.md`).

---

## 2. Roles Covered

| Role | Auth Behaviour |
|---|---|
| **User** | Default role on signup via OTP or Google. Full access to booking-side features. |
| **Venue Owner** | Same account/login as User. Role field auto-upgrades on first venue creation — no separate signup path. |
| **Admin** | Seeded manually in the database. Not self-registerable through any public endpoint. |

---

## 3. Database Schema (Prisma)

> OTPs are **not** modelled in PostgreSQL — they live entirely in Upstash Redis with TTL-based expiry, so there's nothing to clean up.

```prisma
model User {
  id            String        @id @default(uuid())
  name          String?
  email         String        @unique
  phone         String?       @unique
  password      String?       // null if Google OAuth only
  authProvider  AuthProvider  @default(EMAIL)
  googleId      String?       @unique
  avatarUrl     String?       // Cloudinary URL
  role          Role          @default(USER)
  isVerified    Boolean       @default(false)
  isActive      Boolean       @default(true)
  profileIssues Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  venues        Venue[]
  bookings      Booking[]
  wishlist      Wishlist[]

  @@index([email])
  @@index([role])
}

enum AuthProvider {
  EMAIL
  GOOGLE
}

enum Role {
  USER
  VENUE_OWNER
  ADMIN
}
```

> Note: `venues`, `bookings`, and `wishlist` relations are declared here because they live on `User`, but their models (`Venue`, `Booking`, `Wishlist`) are defined and owned by their respective modules' LLDs.

---

## 4. Redis Keys (Upstash)

| Key Pattern | Value | TTL | Purpose |
|---|---|---|---|
| `otp:{email}` | 6-digit code | 300s | Active OTP awaiting verification |
| `otp-rate:{email}` | request count | 600s | Max 3 OTP requests / 10 min per email |
| `verify-rate:{email}` | attempt count | 600s | Max 5 verify attempts / 10 min per email |

---

## 5. API Endpoints

All endpoints are versioned under `/api/v1/` using NestJS URI versioning, set globally so individual controllers don't hardcode the prefix.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/otp/request` | Send OTP to email | No |
| POST | `/api/v1/auth/otp/verify` | Verify OTP → issue JWT | No |
| POST | `/api/v1/auth/google` | Google OAuth login → issue JWT | No |
| GET | `/api/v1/auth/me` | Get current user + profileIssues | Yes |
| PATCH | `/api/v1/auth/me` | Update name / avatar | Yes |
| POST | `/api/v1/auth/refresh` | Refresh JWT before expiry | Yes |
| POST | `/api/v1/auth/logout` | Clear auth cookie | Yes |

---

## 6. Request / Response Contracts

### POST `/api/v1/auth/otp/request`

```jsonc
// Request
{ "email": "user@example.com" }

// Response 200
{ "message": "OTP sent successfully", "expiresIn": 300 }

// Response 429 (rate limited)
{ "statusCode": 429, "message": "Too many OTP requests. Try again later." }
```

### POST `/api/v1/auth/otp/verify`

```jsonc
// Request
{ "email": "user@example.com", "otp": "123456" }

// Response 200
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": null,
    "avatarUrl": null,
    "role": "USER",
    "profileIssues": 1
  },
  "isNewUser": true
}
// JWT set as httpOnly cookie, NOT included in response body

// Response 401
{ "statusCode": 401, "message": "Invalid or expired OTP" }
```

### POST `/api/v1/auth/google`

```jsonc
// Request
{ "idToken": "google-id-token-string" }

// Response 200 — same shape as otp/verify
```

### GET `/api/v1/auth/me`

```jsonc
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Anjali Menon",
  "avatarUrl": "https://res.cloudinary.com/.../avatar.jpg",
  "phone": null,
  "role": "VENUE_OWNER",
  "profileIssues": 1
}
```

### PATCH `/api/v1/auth/me`

```jsonc
// Request
{ "name": "Anjali Menon", "avatarUrl": "https://res.cloudinary.com/.../avatar.jpg" }

// Response 200 — updated user object, same shape as GET /auth/me
```

---

## 7. JWT Payload & Session Strategy

```jsonc
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1235172690
}
```

- Expiry: 7 days, refreshed via `/auth/refresh` while the user remains active
- Stored as **httpOnly, secure, sameSite=lax** cookie — never localStorage (XSS protection)
- Signed with `JWT_SECRET` from environment configuration
- Role is embedded in the token; re-issued immediately on role auto-upgrade so guards see the new role without requiring re-login

---

## 8. NestJS Module Structure

```
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── google.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── decorators/
│   ├── roles.decorator.ts
│   └── current-user.decorator.ts
├── dto/
│   ├── request-otp.dto.ts
│   ├── verify-otp.dto.ts
│   ├── google-login.dto.ts
│   └── update-profile.dto.ts
└── interfaces/
    └── jwt-payload.interface.ts
```

> 📌 **Design decision:** This module exposes a single public method, `upgradeToVenueOwner(userId)`, that other modules (Venue) call directly. It does **not** import or depend on the Notification module — if Auth needs to trigger a notification in future, it will do so through an event emitter, not a direct import, to keep module boundaries clean.

---

## 9. Guard & Decorator Usage

```typescript
@Controller({ path: 'venues', version: '1' })
export class VenueController {

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('pending')
  getPendingVenues() { ... }

  @UseGuards(JwtAuthGuard)
  @Post()
  addVenue(@CurrentUser() user: User, @Body() dto: CreateVenueDto) { ... }
}
```

---

## 10. Role Auto-Upgrade Logic

```
Venue Module: POST /api/v1/venues
  → AuthService.upgradeToVenueOwner(userId)
      → if user.role === USER:
          UPDATE user SET role = 'VENUE_OWNER'
      → re-issue JWT cookie with new role claim
```

> Note: The "You're now a Venue Owner" notification message is dispatched by the Venue module via the Notification module directly — Authentication only updates the role and re-issues the token.

---

## 11. profileIssues Computation

Recalculated on `GET /auth/me` and after any profile update. Kept as a simple computed integer for Phase 1 — no separate issues table.

| Condition | Adds to `profileIssues` |
|---|---|
| `phone` is null | +1 |
| `name` is null | +1 |
| `avatarUrl` is null | +1 |
| Role is `VENUE_OWNER` and has a venue with status `REJECTED` and unaddressed | +1 |

---

## 12. Validation Rules (DTOs)

| Field | Rule |
|---|---|
| `email` | Required, valid email format |
| `otp` | Required, exactly 6 digits |
| `idToken` | Required, non-empty string |
| `name` (update) | Optional, max 100 characters |
| `avatarUrl` (update) | Optional, valid URL |

Enforced via `class-validator` decorators on DTOs, combined with a global `ValidationPipe` registered in `main.ts`.

---

## 13. Sequence Flows

### Email OTP Login

```
User → Frontend: Enter email
Frontend → Backend: POST /api/v1/auth/otp/request
Backend → Redis: check otp-rate:{email}
Backend → Redis: SET otp:{email} EX 300
Backend → Nodemailer: send OTP email
Backend → Frontend: 200 OK

User → Frontend: Enter OTP
Frontend → Backend: POST /api/v1/auth/otp/verify
Backend → Redis: check verify-rate:{email}
Backend → Redis: GET otp:{email} → compare → DEL on success
Backend → PostgreSQL: findOrCreate User (authProvider: EMAIL)
Backend → Frontend: Set httpOnly JWT cookie + user object
Frontend → Browser: redirect to dashboard
```

### Google OAuth Login

```
User → Frontend: Click "Sign in with Google"
Frontend → Google: OAuth consent → returns idToken
Frontend → Backend: POST /api/v1/auth/google { idToken }
Backend → Google: verify idToken signature & audience
Backend → PostgreSQL: findOrCreate User (authProvider: GOOGLE, googleId, avatarUrl)
Backend → Frontend: Set httpOnly JWT cookie + user object
Frontend → Browser: redirect to dashboard
```

> 📊 **TODO:** Replace text flows above with proper sequence diagrams (draw.io / Lucidchart / Excalidraw) and embed as images once finalized. Text version kept here for fast editing during active design.

---

## 14. Edge Cases Handled

| Case | Behaviour |
|---|---|
| OTP expired | 401, prompt to request new OTP |
| OTP requested too often | 429, rate-limit message |
| Email registered via Google, tries OTP login | Allowed — same email links to same User row |
| Google email already registered via OTP | Allowed — googleId linked to existing User row by matching email |
| JWT expired mid-session | 401 → frontend silently calls `/auth/refresh`, else redirect to login |
| Google profile has no avatar | `avatarUrl` stays null, contributes to `profileIssues` |

---

## 15. Third-Party Integration Summary

| Service | Role in This Module |
|---|---|
| Google OAuth 2.0 | Identity verification for social login (idToken verification) |
| Upstash Redis | OTP storage with auto-expiry, rate limiting on OTP/verify requests |
| Nodemailer (SMTP) | Delivering OTP codes via email |
| Cloudinary | Storing the user's `avatarUrl` (upload handled client-side or via signed upload, URL stored here) |

---

## 16. Explicitly Out of Scope (Phase 1)

- Phone OTP login — deferred to Phase 2 (MSG91 / Fast2SMS)
- JWT / session blacklist for forced logout — no flow requires this in Phase 1
- Detailed per-issue messaging for `profileIssues` — Phase 2 enhancement
- Password reset flow — not applicable; Email OTP doubles as the only password-less recovery path
- **In-app notifications** — moved out entirely; see `notification-module-lld.md`

---

## 17. Decision Log

| Date | Decision | Reasoning |
|---|---|---|
| 2026-06-19 | Use Upstash Redis instead of self-hosted Redis | Serverless, pay-per-request, zero infra/maintenance overhead — removes the usual objection to adding Redis at MVP stage |
| 2026-06-19 | Use Upstash for OTP storage, rate limiting, and booking slot locks only | Justified, low-risk use cases. General caching and session blacklist remain deferred to Phase 2 |
| 2026-06-19 | No dedicated OTP table in PostgreSQL | Redis TTL handles expiry natively; avoids manual cleanup jobs |
| 2026-06-19 | Notification model & endpoints removed from this module | Notifications are event-driven from Venue/Booking/Admin modules, not an Authentication concern — moved to its own LLD to keep module boundaries clean |

---

## 18. Open Questions

- [ ] Confirm Privacy Policy + Terms page is added to the **pre-launch checklist** before Razorpay/Google OAuth go live (not required for Phase 1 demo/test mode)
- [ ] Confirm whether Admin accounts need their own login flow distinct from OTP/Google, or reuse the same flow with role pre-seeded
- [ ] Decide how Auth module will signal events (e.g. role upgraded) to the Notification module — direct call vs. event emitter — once Notification LLD is written