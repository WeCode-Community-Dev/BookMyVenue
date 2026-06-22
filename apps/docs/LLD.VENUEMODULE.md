# Venue Module — Low Level Design

**Project:** Venue Booking Platform
**Module:** 2 of 7 — Venue
**Status:** ✅ Approved for Phase 1
**Version:** 2.1
**Last Updated:** 2026-06-20

---

## Page Tree

- [1. Scope](#1-scope)
- [2. Roles Covered](#2-roles-covered)
- [3. Database Schema](#3-database-schema-prisma)
- [4. API Endpoints](#4-api-endpoints)
- [5. Request / Response Contracts](#5-request--response-contracts)
- [6. Search & Filter Logic](#6-search--filter-logic)
- [7. Availability & Slot Logic](#7-availability--slot-logic)
- [7a. Manual Date Blocking & Owner Contact Fallback](#7a-manual-date-blocking--owner-contact-fallback)
- [8. Image Upload Flow (Cloudinary)](#8-image-upload-flow-cloudinary)
- [9. Location Pinning (OpenLayers)](#9-location-pinning-openlayers)
- [10. NestJS Module Structure](#10-nestjs-module-structure)
- [11. Cross-Module Calls](#11-cross-module-calls)
- [12. Validation Rules (DTOs)](#12-validation-rules-dtos)
- [13. Sequence Flows](#13-sequence-flows)
- [14. Edge Cases Handled](#14-edge-cases-handled)
- [15. Third-Party Integration Summary](#15-third-party-integration-summary)
- [16. Out of Scope (Phase 1)](#16-explicitly-out-of-scope-phase-1)
- [17. Decision Log](#17-decision-log)
- [18. Open Questions](#18-open-questions)

---

## 1. Scope

This module covers venue creation and management by Venue Owners, public search/filter/discovery for Users, venue detail retrieval, image handling via Cloudinary, location pinning via OpenLayers + OpenStreetMap, owner-defined slot templates with per-slot tiered pricing, and manual date blocking for offline/multi-day bookings. It also owns the approval `status` field that the Admin module reads and updates.

> 🔗 **Cross-module dependency:** Creating a venue calls `AuthService.upgradeToVenueOwner(userId)` (owned by the Authentication module). Once Admin approves/rejects a venue, the Admin module calls `NotificationService.create(...)` — a direct in-process service call to the standalone Notification module, not a schema relation on `Venue`. The Booking module reads `VenueSlotTemplate` and `VenuePricingTier` data and writes computed `occupiedFrom`/`occupiedTo` ranges back via `Booking`, which this module's availability queries must also check against.

> 📦 **Module boundary note:** Reviews & Ratings are **not** part of this module in Phase 1. No `Review` model exists. Venue cards and detail pages show no star rating — this was a deliberate decision to stay consistent with Reviews being deferred to Phase 2, even though early UI mockups showed ratings.

> 🔁 **Design evolution note:** This module's availability design went through three iterations during scoping — plain date-based, then fixed Morning/Evening slots with separate kitchen-overlap tracking, before arriving at the final model below: fully owner-defined slot **templates** with datetime offsets (allowing cross-day spans like "previous evening to event-day afternoon" to cover caterer/kitchen prep), unified under one overlap check. This single mechanism replaced what would otherwise have been two separate systems (slot conflict + kitchen conflict). See Decision Log for the full reasoning trail.

---

## 2. Roles Covered

| Role | Venue Module Behaviour |
|---|---|
| **User** | Searches, filters, views venue details and map. Read-only access to this module. |
| **Venue Owner** | Creates venues, uploads images, pins location, sets availability, edits/deletes own venues, views own venues' booking status. |
| **Admin** | Views pending venues, approves/rejects. Approval logic lives here; the decision-making UI lives in the Admin module. |

---

## 3. Database Schema (Prisma)

```prisma
model Venue {
  id            String          @id @default(uuid())
  ownerId       String
  owner         User            @relation(fields: [ownerId], references: [id])

  name          String
  description   String
  venueType     VenueType
  capacityMin   Int
  capacityMax   Int

  addressLine   String
  city          String
  state         String          @default("Kerala")
  latitude      Float
  longitude     Float

  status        VenueStatus     @default(PENDING)
  rejectionNote String?         // populated only if status = REJECTED (Phase 2 detail; field reserved now)

  isActive      Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  categories    VenueCategory[]
  amenities     VenueAmenity[]
  images        VenueImage[]
  slotTemplates VenueSlotTemplate[]
  blockedDates  VenueBlockedDate[]
  bookings      Booking[]
  wishlistedBy  Wishlist[]

  @@index([city])
  @@index([status])
  @@index([venueType])
}

enum VenueType {
  RESORT
  BANQUET_HALL
  AUDITORIUM
  CAFE_RESTAURANT
  OPEN_LAWN
}

enum VenueStatus {
  PENDING
  APPROVED
  REJECTED
}

enum EventCategory {
  BIRTHDAY
  WEDDING
  CORPORATE
  MEETUP
  CELEBRATION
  OTHER
}

// Join table — many-to-many between Venue and EventCategory enum values
model VenueCategory {
  id       String         @id @default(uuid())
  venueId  String
  venue    Venue          @relation(fields: [venueId], references: [id], onDelete: Cascade)
  category EventCategory

  @@unique([venueId, category])
  @@index([category])
}

model Amenity {
  id     String         @id @default(uuid())
  name   String         @unique   // e.g. "Parking", "AC", "Catering", "DJ Allowed"
  venues VenueAmenity[]
}

model VenueAmenity {
  id        String   @id @default(uuid())
  venueId   String
  venue     Venue    @relation(fields: [venueId], references: [id], onDelete: Cascade)
  amenityId String
  amenity   Amenity  @relation(fields: [amenityId], references: [id])

  @@unique([venueId, amenityId])
}

model VenueImage {
  id        String   @id @default(uuid())
  venueId   String
  venue     Venue    @relation(fields: [venueId], references: [id], onDelete: Cascade)
  url       String   // Cloudinary URL
  isPrimary Boolean  @default(false)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  @@index([venueId])
}

// Owner-defined, reusable slot definition. Offsets are relative so the same
// template can be applied to any future event date.
model VenueSlotTemplate {
  id            String   @id @default(uuid())
  venueId       String
  venue         Venue    @relation(fields: [venueId], references: [id], onDelete: Cascade)

  label         String   // owner-defined, e.g. "Full Wedding Slot (incl. kitchen prep)", "Evening Birthday"
  startDayOffset Int     // 0 = event day, -1 = previous day, etc.
  startTime     String   // "19:00"
  endDayOffset  Int      // 0 = event day, +1 = next day, etc.
  endTime       String   // "15:00"

  isCustom      Boolean  @default(false)  // true = priced per guest per hour instead of fixed tiers
  customRatePerGuestPerHour Decimal? @db.Decimal(10, 2)

  isActive      Boolean  @default(true)

  pricingTiers  VenueSlotPricing[]
  bookings      Booking[]

  @@index([venueId])
}

model VenueSlotPricing {
  id              String             @id @default(uuid())
  slotTemplateId  String
  slotTemplate    VenueSlotTemplate  @relation(fields: [slotTemplateId], references: [id], onDelete: Cascade)

  minGuests       Int
  maxGuests       Int
  price           Decimal            @db.Decimal(10, 2)

  @@index([slotTemplateId])
}

// Manual owner-side blocking — for offline bookings, multi-day events,
// maintenance, or anything not going through the in-app slot booking flow.
model VenueBlockedDate {
  id        String   @id @default(uuid())
  venueId   String
  venue     Venue    @relation(fields: [venueId], references: [id], onDelete: Cascade)
  fromDate  DateTime @db.Date
  toDate    DateTime @db.Date
  note      String?  // owner's private note, e.g. "offline wedding booking — 4 days"

  @@index([venueId, fromDate, toDate])
}
```

> **Note on `Amenity`:** Although venue type and event category are fixed enums per your decision, `Amenity` is kept as its own table rather than an enum — amenities are a checklist-style multi-select that's likely to need additions (e.g. "Pet Friendly", "Wheelchair Access") without a schema migration. This is a narrower, lower-risk exception to the "fixed enum" decision.

> **Note on pricing:** `Venue.pricePerDay` was removed. Pricing now lives per slot template via `VenueSlotPricing` (guest-count tiers) or `customRatePerGuestPerHour` for custom slots — since price genuinely depends on which slot is booked, not a single venue-wide number.

> **Note on `Booking.occupiedFrom`/`occupiedTo`:** These fields live in the Booking module's schema, not here, but this module's availability checks (Section 7) read from `Booking` directly. A booking's actual occupied window is computed at booking time from the chosen `VenueSlotTemplate`'s offsets applied to the user's selected event date.

---

## 4. API Endpoints

All endpoints versioned under `/api/v1/`.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/v1/venues` | Search/filter/list approved venues | No |
| GET | `/api/v1/venues/:id` | Get single venue detail (incl. slot templates) | No |
| POST | `/api/v1/venues` | Create new venue (triggers role upgrade) | Yes (User/Venue Owner) |
| PATCH | `/api/v1/venues/:id` | Edit own venue | Yes (Owner only) |
| DELETE | `/api/v1/venues/:id` | Soft-delete own venue (`isActive = false`) | Yes (Owner only) |
| GET | `/api/v1/venues/my-venues` | List venues owned by current user | Yes (Venue Owner) |
| POST | `/api/v1/venues/:id/images` | Upload venue image(s) | Yes (Owner only) |
| DELETE | `/api/v1/venues/:id/images/:imageId` | Remove a venue image | Yes (Owner only) |
| POST | `/api/v1/venues/:id/slots` | Create a slot template (with pricing tiers) | Yes (Owner only) |
| PATCH | `/api/v1/venues/:id/slots/:slotId` | Edit a slot template | Yes (Owner only) |
| DELETE | `/api/v1/venues/:id/slots/:slotId` | Deactivate a slot template | Yes (Owner only) |
| GET | `/api/v1/venues/:id/availability` | Get available/booked dates per slot template | No |
| POST | `/api/v1/venues/:id/blocked-dates` | Manually block a date range (offline booking) | Yes (Owner only) |
| DELETE | `/api/v1/venues/:id/blocked-dates/:blockId` | Remove a manual block | Yes (Owner only) |
| GET | `/api/v1/amenities` | List all amenities (for filter UI / add-venue form) | No |

---

## 5. Request / Response Contracts

### GET `/api/v1/venues`

```jsonc
// Query params
?city=Kochi&venueType=BANQUET_HALL&category=WEDDING&minCapacity=50&maxPrice=25000&date=2026-07-15&lat=9.93&lng=76.26&radiusKm=10&page=1&limit=12

// Response 200
{
  "total": 42,
  "page": 1,
  "limit": 12,
  "items": [
    {
      "id": "uuid",
      "name": "Lagoona Beach Resort",
      "venueType": "RESORT",
      "city": "Kochi",
      "pricePerDay": 18000,
      "primaryImage": "https://res.cloudinary.com/.../main.jpg",
      "distanceKm": 12.0,
      "isAvailableOnRequestedDate": true,
      "latitude": 9.965,
      "longitude": 76.244
    }
  ]
}
```

### GET `/api/v1/venues/:id`

```jsonc
{
  "id": "uuid",
  "name": "Lagoona Beach Resort",
  "description": "Beachfront resort ideal for weddings and large gatherings...",
  "venueType": "RESORT",
  "categories": ["WEDDING", "CELEBRATION"],
  "capacityMin": 50,
  "capacityMax": 500,
  "addressLine": "Cherai Beach Road",
  "city": "Kochi",
  "state": "Kerala",
  "latitude": 9.965,
  "longitude": 76.244,
  "amenities": ["Parking", "AC", "Catering"],
  "images": [
    { "id": "uuid", "url": "https://res.cloudinary.com/.../1.jpg", "isPrimary": true },
    { "id": "uuid", "url": "https://res.cloudinary.com/.../2.jpg", "isPrimary": false }
  ],
  "slotTemplates": [
    {
      "id": "uuid",
      "label": "Full Wedding Slot (incl. kitchen prep)",
      "startDayOffset": -1,
      "startTime": "19:00",
      "endDayOffset": 0,
      "endTime": "15:00",
      "isCustom": false,
      "pricingTiers": [
        { "minGuests": 0, "maxGuests": 150, "price": 25000 },
        { "minGuests": 151, "maxGuests": 400, "price": 45000 }
      ]
    },
    {
      "id": "uuid",
      "label": "Evening Birthday Slot",
      "startDayOffset": 0,
      "startTime": "18:00",
      "endDayOffset": 0,
      "endTime": "23:00",
      "isCustom": false,
      "pricingTiers": [
        { "minGuests": 0, "maxGuests": 100, "price": 12000 }
      ]
    }
  ],
  "owner": { "id": "uuid", "name": "Anjali Menon", "phone": "+91...", "email": "owner@example.com" },
  "status": "APPROVED"
}
```

### POST `/api/v1/venues`

```jsonc
// Request
{
  "name": "Lagoona Beach Resort",
  "description": "Beachfront resort ideal for weddings...",
  "venueType": "RESORT",
  "categories": ["WEDDING", "CELEBRATION"],
  "capacityMin": 50,
  "capacityMax": 500,
  "addressLine": "Cherai Beach Road",
  "city": "Kochi",
  "latitude": 9.965,
  "longitude": 76.244,
  "amenityIds": ["uuid1", "uuid2"]
}

// Response 201
{
  "id": "uuid",
  "status": "PENDING",
  "message": "Venue submitted for approval. Add slot templates next to make it bookable."
}
```

### POST `/api/v1/venues/:id/slots`

```jsonc
// Request
{
  "label": "Full Wedding Slot (incl. kitchen prep)",
  "startDayOffset": -1,
  "startTime": "19:00",
  "endDayOffset": 0,
  "endTime": "15:00",
  "isCustom": false,
  "pricingTiers": [
    { "minGuests": 0, "maxGuests": 150, "price": 25000 },
    { "minGuests": 151, "maxGuests": 400, "price": 45000 }
  ]
}

// Response 201
{ "id": "uuid", "message": "Slot template created" }
```

### POST `/api/v1/venues/:id/blocked-dates`

```jsonc
// Request
{ "fromDate": "2026-08-01", "toDate": "2026-08-05", "note": "Offline wedding booking — 4 days" }

// Response 201
{ "id": "uuid", "message": "Dates blocked" }
```

### POST `/api/v1/venues/:id/images`

```jsonc
// Request — multipart/form-data, field name "images" (max 10 files)

// Response 200
{
  "uploaded": [
    { "id": "uuid", "url": "https://res.cloudinary.com/.../3.jpg", "isPrimary": false }
  ]
}
```

### PATCH `/api/v1/venues/:id/availability`

```jsonc
// Request
{
  "dates": ["2026-07-15", "2026-07-16"],
  "isBooked": true
}

// Response 200
{ "updated": 2 }
```

---

## 6. Search & Filter Logic

| Filter | Implementation |
|---|---|
| City / location text | `WHERE city ILIKE` (PostgreSQL case-insensitive match) |
| Venue type | `WHERE venueType = ?` (enum exact match) |
| Event category | `JOIN VenueCategory WHERE category = ?` |
| Capacity | `WHERE capacityMin <= ? AND capacityMax >= ?` |
| Price range | Checked against `VenueSlotPricing` — "show venues with at least one slot tier under ₹X" |
| Amenities | `JOIN VenueAmenity` filtered by selected `amenityId`s |
| Availability on a date | For each candidate venue, compute whether **any** active `VenueSlotTemplate`, applied to the requested date, would produce an `occupiedFrom`/`occupiedTo` that does *not* overlap an existing `Booking` or `VenueBlockedDate` |
| Distance / map radius | Haversine formula computed in the query (`lat`/`lng` vs venue's `latitude`/`longitude`), or PostGIS `ST_DWithin` if PostGIS extension is enabled |
| Rating | **Not implemented** — no `Review` model exists in Phase 1 |

> Only venues with `status = APPROVED` and `isActive = true` are ever returned from the public search endpoint, regardless of filters applied.

---

## 7. Availability & Slot Logic

- **Slots are owner-defined templates**, not fixed system-wide types. Each `VenueSlotTemplate` stores relative offsets (`startDayOffset`/`startTime`, `endDayOffset`/`endTime`) rather than absolute dates — this lets one template be reused against any future event date, and lets a template span across midnight (e.g. `startDayOffset: -1` = previous evening, to cover caterer/kitchen prep time, through to `endDayOffset: 0` = event-day afternoon).
- **One unified overlap check replaces what would otherwise be separate slot-conflict and kitchen-conflict systems.** When a user requests a slot template for a given event date, the backend computes the concrete `occupiedFrom`/`occupiedTo` for that booking, then checks it against:
  1. Existing `CONFIRMED` `Booking` rows for the same venue (their own computed `occupiedFrom`/`occupiedTo`)
  2. Existing `VenueBlockedDate` ranges for the same venue
  - If either overlaps, the slot is unavailable for that date and the user is shown alternative dates.
- **Custom slots** (`isCustom = true`) skip `VenueSlotPricing` tiers entirely and price as `guestCount × customRatePerGuestPerHour × duration`.
- This availability/overlap computation is shared logic — exposed by this module as `VenueAvailabilityService.checkSlotAvailability(venueId, slotTemplateId, eventDate)` — and called by the Booking module before confirming any booking.

---

## 7a. Manual Date Blocking & Owner Contact Fallback

For scenarios outside the standard slot-booking flow — multi-day events, exhibitions, or any offline arrangement the owner has made directly with a customer — Phase 1 deliberately does **not** attempt to model these as bookings:

- The owner manually creates a `VenueBlockedDate` range (e.g. `2026-08-01` to `2026-08-05`) directly from their dashboard. No slot, no price, no guest count — just an occupied flag.
- These blocked ranges participate in the same overlap check described above, so the venue correctly shows as unavailable to all users for those dates.
- Every venue detail page displays the owner's contact details (`owner.phone`, `owner.email`) so a user with a non-standard request (multi-day, custom negotiation) can reach out directly. No in-app messaging exists in Phase 1 — this is explicitly deferred to Phase 2.

---

## 8. Image Upload Flow (Cloudinary)

```
Frontend → Backend: POST /api/v1/venues/:id/images (multipart, max 10 files, max 5MB each)
Backend → Backend: validate file count, size, mime type (jpg/png/webp only)
Backend → Cloudinary: upload each file via Cloudinary SDK
Cloudinary → Backend: returns secure_url for each
Backend → PostgreSQL: insert VenueImage row(s) with returned URLs
Backend → Frontend: return uploaded image objects
```

- First image uploaded for a venue is automatically marked `isPrimary = true` if no primary exists yet.
- Max 10 images per venue, max 5MB per file — enforced server-side, not just in the frontend.

---

## 9. Location Pinning (OpenLayers)

- Frontend renders an OpenLayers map (OpenStreetMap tile layer) on the "Add Venue" form.
- Venue Owner drags a marker or searches an address; frontend resolves this to `latitude`/`longitude` using an OSM-based geocoding service (e.g. Nominatim).
- These coordinates are submitted as plain `latitude`/`longitude` floats in the `POST /venues` body — the backend has no OpenLayers-specific logic; it just stores and later returns coordinates for the frontend to re-render.

---

## 10. NestJS Module Structure

```
venue/
├── venue.module.ts
├── venue.controller.ts
├── venue.service.ts
├── availability/
│   ├── availability.controller.ts
│   └── availability.service.ts
├── images/
│   ├── images.controller.ts
│   ├── images.service.ts
│   └── cloudinary.provider.ts
├── dto/
│   ├── create-venue.dto.ts
│   ├── update-venue.dto.ts
│   ├── search-venue.dto.ts
│   └── update-availability.dto.ts
└── interfaces/
    └── venue-search-result.interface.ts

amenity/
├── amenity.module.ts
├── amenity.controller.ts
└── amenity.service.ts
```

> Amenity kept as its own small module since it's a shared reference list, not exclusively a Venue concern — Booking or Admin filters may query it independently later.

---

## 11. Cross-Module Calls

| Direction | Call | Purpose |
|---|---|---|
| Venue → Auth | `AuthService.upgradeToVenueOwner(userId)` | Called on first successful `POST /venues` by a `USER` role |
| Booking → Venue | `VenueAvailabilityService.checkSlotAvailability(venueId, slotTemplateId, eventDate)` | Called before confirming any booking, to check overlap against existing `Booking` and `VenueBlockedDate` rows |
| Booking → Venue | `VenueAvailabilityService.computeOccupiedWindow(slotTemplateId, eventDate)` | Resolves a slot template's relative offsets into concrete `occupiedFrom`/`occupiedTo` datetimes for a specific booking |
| Admin → Venue | `VenueService.updateStatus(venueId, status, rejectionNote?)` | Called when Admin approves/rejects a pending venue |
| Venue → Notification | `NotificationService.create({ userId, type: 'VENUE_APPROVAL', title, message })` | Called by the Admin module (not this one) after it calls `VenueService.updateStatus()` — a direct in-process service call, not a schema relation or message queue. Notification's only schema relation is `Notification.userId → User.id`; it has no foreign key to `Venue` |

---

## 12. Validation Rules (DTOs)

| Field | Rule |
|---|---|
| `name` | Required, 3–100 characters |
| `description` | Required, 20–2000 characters |
| `venueType` | Required, must be a valid `VenueType` enum value |
| `categories` | Required, at least 1, each must be a valid `EventCategory` enum value |
| `capacityMin` / `capacityMax` | Required, positive integers, `capacityMax >= capacityMin` |
| `latitude` / `longitude` | Required, valid coordinate ranges |
| `amenityIds` | Optional array of valid existing `Amenity` UUIDs |
| Image files | Max 10 per request, max 5MB each, mime type jpg/png/webp only |
| `slotTemplate.label` | Required, 3–100 characters |
| `slotTemplate.startTime` / `endTime` | Required, valid `HH:mm` format |
| `slotTemplate.startDayOffset` / `endDayOffset` | Required, integers (negative allowed for prior-day starts) |
| `slotTemplate.pricingTiers` | Required if `isCustom = false`, at least 1 tier, no overlapping guest ranges within the same template |
| `slotTemplate.customRatePerGuestPerHour` | Required if `isCustom = true`, positive decimal |
| `blockedDate.fromDate` / `toDate` | Required, valid dates, `toDate >= fromDate` |

---

## 13. Sequence Flows

### Add Venue + Slot Templates (Owner)

```
Owner → Frontend: Fill venue form, pin location on OpenLayers map
Frontend → Backend: POST /api/v1/venues
Backend → Backend: validate DTO
Backend → PostgreSQL: insert Venue (status: PENDING), VenueCategory rows, VenueAmenity rows
Backend → AuthService: upgradeToVenueOwner(userId) [if role was USER]
Backend → Frontend: 201 { id, status: PENDING }
Frontend → Owner: redirect to "Upload Images" step

Owner → Frontend: Upload images
Frontend → Backend: POST /api/v1/venues/:id/images
Backend → Cloudinary: upload files
Backend → PostgreSQL: insert VenueImage rows
Backend → Frontend: 200 { uploaded: [...] }

Owner → Frontend: Define slot templates (e.g. "Full Wedding Slot", offsets, pricing tiers)
Frontend → Backend: POST /api/v1/venues/:id/slots (repeated per slot)
Backend → PostgreSQL: insert VenueSlotTemplate + VenueSlotPricing rows
Backend → Frontend: 201 { id }
```

### Search Venues (User)

```
User → Frontend: Enter filters (location, category, capacity, date)
Frontend → Backend: GET /api/v1/venues?city=...&category=...&date=...
Backend → PostgreSQL: query Venue JOIN VenueCategory, VenueAmenity
Backend → Backend: for each candidate venue + each active VenueSlotTemplate,
                    compute occupiedFrom/occupiedTo for the requested date,
                    check overlap against Booking + VenueBlockedDate
Backend → Backend: compute distanceKm if lat/lng provided
Backend → Frontend: 200 { items: [...], total }
Frontend → User: render list + map pins (OpenLayers)
```

### Owner Blocks Dates for an Offline Booking

```
Owner → Frontend: "Block Dates" action on venue dashboard
Frontend → Backend: POST /api/v1/venues/:id/blocked-dates { fromDate, toDate, note }
Backend → PostgreSQL: insert VenueBlockedDate
Backend → Frontend: 201 { id }
// These dates now show as unavailable in all future search/availability queries
```

---

## 14. Edge Cases Handled

| Case | Behaviour |
|---|---|
| Owner tries to edit a venue they don't own | 403 Forbidden |
| Owner edits an `APPROVED` venue's core details | Status resets to `PENDING` — re-approval required (prevents bait-and-switch listings) |
| Search with no matching venues | 200 with empty `items: []`, not an error |
| Requested slot's computed window overlaps an existing `Booking` or `VenueBlockedDate` | Slot shown as unavailable for that date; user prompted to pick another date |
| Owner uploads an 11th image | 400, "Maximum 10 images per venue" |
| Owner deletes the primary image | Next image in `sortOrder` automatically promoted to `isPrimary` |
| Venue soft-deleted (`isActive = false`) | Excluded from search and detail endpoints, but historical bookings referencing it remain intact |
| Owner creates a slot template with no pricing tiers and `isCustom = false` | 400, "At least one pricing tier required for non-custom slots" |
| Owner's pricing tiers have gaps or overlaps in guest ranges | 400, validated at creation — tiers must be contiguous and non-overlapping |
| Venue has zero active slot templates | Venue appears in search but detail page shows "Contact owner to arrange booking" instead of a bookable slot list |

---

## 15. Third-Party Integration Summary

| Service | Role in This Module |
|---|---|
| Cloudinary | Storing and serving venue images |
| OpenStreetMap + OpenLayers | Map rendering and location pin selection (frontend); backend only stores resulting lat/lng |
| Nominatim (OSM geocoding) | Converting address search input into coordinates during venue creation |

---

## 16. Explicitly Out of Scope (Phase 1)

- **Reviews & Ratings** — no `Review` model; ratings removed from UI entirely for Phase 1, per decision log
- **Multi-day bookings as a system feature** — not modelled as `Booking` rows at all. Owners block these dates manually via `VenueBlockedDate`; the actual arrangement happens off-platform between owner and customer
- **In-app messaging** — owner contact details (phone/email) are shown directly on the venue page instead; Phase 2 will add proper in-app messaging
- Admin-editable `VenueType` / `EventCategory` lists — both are fixed enums per current decision; converting to DB-backed tables is a Phase 2 option if new types are needed often
- Detailed rejection reason shown to owner — `rejectionNote` field exists in schema but is not yet surfaced in any UI flow (Phase 2, per earlier discussion)
- Venue analytics (views, click-through) — Phase 2

---

## 17. Decision Log

| Date | Decision | Reasoning |
|---|---|---|
| 2026-06-20 | No Review/Rating model in Phase 1 | Keeps Venue module consistent with Reviews being deferred to Phase 2, even though early UI mockups showed star ratings |
| 2026-06-20 | `VenueType` and `EventCategory` are fixed enums | Simpler schema, no admin UI needed to manage them; acceptable since the list of venue types/event categories is not expected to change frequently |
| 2026-06-20 | Event categories are many-to-many via `VenueCategory` join table | One venue can serve multiple event types (e.g. a hall usable for both weddings and corporate events) |
| 2026-06-20 | `Amenity` kept as its own DB table, not an enum | Unlike venue type/category, amenities are a longer, more variable checklist likely to need additions without a schema migration |
| 2026-06-20 | Editing an approved venue resets status to PENDING | Prevents owners from approval-then-swap abuse (get approved, then change to something that wouldn't have passed review) |
| 2026-06-20 | Rejected: flat `pricePerDay` field | Real Kerala venue pricing varies by guest count (e.g. ₹25k for 150 guests vs ₹80k for 1000) — a single price doesn't capture this |
| 2026-06-20 | Rejected: fixed Morning/Evening slot enum + separate kitchen-overlap table | Real owner workflows don't fit two hardcoded slots — some venues need cross-day kitchen prep windows, short 1-2hr slots, or many custom slot variations per venue |
| 2026-06-20 | **Adopted: owner-defined `VenueSlotTemplate` with relative day/time offsets** | Lets one owner-created template (e.g. "previous evening to event-day afternoon") cover real scenarios like overnight catering prep, without needing a separate kitchen-specific system. Templates are reusable across any future event date since offsets are relative, not absolute |
| 2026-06-20 | **Adopted: pricing moved to `VenueSlotPricing`, scoped per slot template** | Price genuinely depends on which slot is booked and how many guests attend — not a single venue-wide number |
| 2026-06-20 | **Adopted: single unified overlap check** (`Booking` + `VenueBlockedDate` vs. computed `occupiedFrom`/`occupiedTo`) | Replaces what would otherwise be two separate systems (slot conflict + kitchen conflict) with one mechanism reused everywhere |
| 2026-06-20 | **Rejected (for Phase 1): automated multi-day booking as its own `Booking` type** | Given the open-source MVP timeline, multi-day/exhibition-style bookings are handled by the owner manually blocking dates (`VenueBlockedDate`) rather than building dedicated pricing/booking logic for an infrequent case |
| 2026-06-20 | **Adopted: owner contact details shown on venue page as the fallback for non-standard requests** | Simple, zero-schema-cost way to support multi-day/custom negotiation without building in-app messaging in Phase 1 |

---

## 18. Open Questions

- [ ] Should Haversine distance calculation happen in the database query (raw SQL) or in application code after fetching candidate rows? Affects performance once venue count grows.
- [ ] Confirm whether PostGIS extension will actually be enabled on the PostgreSQL instance, or whether Haversine-in-query is sufficient for Phase 1 scale.
- [ ] Decide max venues per owner, if any cap is wanted for Phase 1 (currently unlimited).
- [ ] Confirm whether `rejectionNote` should be surfaced to the owner now (low effort) or genuinely held for Phase 2 as previously agreed.
- [ ] Confirm max number of slot templates per venue, if any cap is wanted (currently unlimited).
- [ ] Decide whether overlap-checking for search results (computing occupancy for every active slot template across all candidate venues) needs caching/optimization once venue count grows, or if Phase 1 traffic is low enough to compute on every request.