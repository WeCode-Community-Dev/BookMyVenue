# Venues CRUD — Project Plan

## Current State

The **backend** (booking-service) already has a **complete CRUD API** for venues:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/venues` | — | List all venues |
| GET | `/venues/:id` | — | Get venue by ID |
| POST | `/venues` | JWT (owner/admin) | Create venue |
| PUT | `/venues/:id` | JWT (owner/admin) | Update venue |
| DELETE | `/venues/:id` | JWT (owner/admin) | Delete venue |
| GET | `/venues/mine` | JWT (owner/admin) | List my venues |

The **frontend** uses **hardcoded mock data** (`src/lib/venues.ts`) — no API calls. There is no UI for creating, editing, or deleting venues.

---

## Phase 1 — Connect Frontend to Real API

### 1.1 Environment variable
Add `NEXT_PUBLIC_BOOKING_URL=http://localhost:8081` to the frontend.

### 1.2 API client (`src/lib/api.ts`)
Create a shared fetch wrapper that:
- Reads `NEXT_PUBLIC_BOOKING_URL`
- Injects `Authorization: Bearer <token>` from localStorage for protected calls
- Handles JSON serialization and error responses uniformly

### 1.3 Real venue API functions (`src/lib/venues.ts`)
Replace mock functions with real HTTP calls:

```ts
fetchVenues(query?)          → GET  /venues?search=&category=&city=
fetchVenueById(id)           → GET  /venues/:id
createVenue(data)            → POST /venues
updateVenue(id, data)        → PUT  /venues/:id
deleteVenue(id)              → DELETE /venues/:id
fetchMyVenues()              → GET  /venues/mine
```

### 1.4 Align `Venue` type
The backend model has: `id`, `owner_id`, `name`, `description`, `location`, `capacity`, `price_per_hour`, `created_at`.

The frontend has extra fields: `city`, `category`, `rating`, `reviewCount`, `amenities`, `images`, `highlights`.

**Option A** (recommended short-term): Add `city`, `category`, `images` as nullable columns to the venues table via a new migration. Store `amenities` / `highlights` as JSONB. The `rating` / `reviewCount` fields belong in a separate reviews system (future) — for now default to `0` / `0` or seed data.

**Option B** (minimal): Keep the frontend type superset and simply don't send extra fields to the API. When reading, merge DB data with defaults. Simpler but leaves a gap.

### 1.5 Update existing pages
- `venues/page.tsx` — replace `getVenues()` with `fetchVenues()`
- `venues/[id]/page.tsx` — replace `getVenueById()` with `fetchVenueById()`
- Keep search + category filter working (can be query params sent to the API)

---

## Phase 2 — Owner Venue Management

### 2.1 My Venues page (`/my-venues`)
- Protected route for `owner` / `admin` roles
- Calls `fetchMyVenues()`
- Lists the user's venues with **Edit** and **Delete** actions
- Shows a **"Add Venue"** CTA when empty

### 2.2 Create Venue page (`/venues/new`)
- Form: name, description, location, capacity, price_per_hour, city, category, images
- Calls `createVenue()` on submit
- Redirects to `/my-venues` or the new venue's detail page on success

### 2.3 Edit Venue page (`/venues/[id]/edit`)
- Pre-populated form from `fetchVenueById()`
- Calls `updateVenue()` on submit
- Only accessible by the venue owner or an admin

### 2.4 Delete Venue
- Confirmation dialog (modal or inline)
- Calls `deleteVenue()` on confirm
- Removes the venue from the list without page reload (optimistic UI)

---

## Phase 3 (Optional) — Polish

### 3.1 Owner badge on venue detail
Show "Edit" / "Delete" buttons on the venue detail page if the logged-in user owns it.

### 3.2 Venue images upload
Add an image upload endpoint to the backend (multipart → S3/local storage) and a file picker in the create/edit forms.

### 3.3 Pagination
Add `offset` / `limit` query params to `GET /venues` and pagination UI on the listing page.

---

## File Changes Summary

| File | Action |
|------|--------|
| `frontend/.env.local` | Add `NEXT_PUBLIC_BOOKING_URL` |
| `frontend/src/lib/api.ts` | **Create** — shared fetch helper |
| `frontend/src/lib/venues.ts` | **Rewrite** — replace mocks with API calls |
| `frontend/src/app/venues/page.tsx` | Update to use `fetchVenues()` |
| `frontend/src/app/venues/[id]/page.tsx` | Update to use `fetchVenueById()`, add owner actions |
| `frontend/src/app/my-venues/page.tsx` | **Create** — owner dashboard |
| `frontend/src/app/venues/new/page.tsx` | **Create** — add venue form |
| `frontend/src/app/venues/[id]/edit/page.tsx` | **Create** — edit venue form |
| `frontend/src/components/DeleteVenueDialog.tsx` | **Create** — delete confirmation |
| `booking-service/migrations/003_add_venue_profile_fields.up.sql` | **Create** — city, category, images, amenities, highlights columns |

---

## Sequence for Delivery

```
Phase 1 ──► Phase 2 ──► Phase 3 (optional)
  1.1          2.1          3.1
  1.2          2.2          3.2
  1.3          2.3          3.3
  1.4          2.4
  1.5
```

Start with Phase 1 to unblock the listing + detail pages, then Phase 2 for the owner management flows.
