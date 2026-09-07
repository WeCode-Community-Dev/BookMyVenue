# BookMyVenue Integration Help Guide (Backend API Requirements)

This document provides schema specifications and API endpoint contracts required to wire the dynamic **Owner Portal Venue Management Module** to a production backend service.

---

## 1. Database Schemas

### A. AvailabilityRule Schema
Defines the default recurring slot during which a venue can accept reservations.
> [!IMPORTANT]
> To preserve schedule consistency, the backend must ensure that **only one AvailabilityRule is marked `isActive: true` per venue at any time**. Activating a new rule should automatically deactivate the others.

```typescript
interface AvailabilityRule {
  id: string;        // Unique identifier (UUID or similar)
  venueId: string;   // Associated venue reference
  name: string;      // Human-readable title (e.g., "Standard Hours")
  isActive: boolean; // Active flag status
  daysOfWeek: number[]; // Array of weekdays (0 = Sunday, 1 = Monday ... 6 = Saturday)
  startTime: string; // Time format HH:MM (24-hour style, e.g. "08:00")
  endTime: string;   // Time format HH:MM (24-hour style, e.g. "18:00")
}
```

### B. ExceptionRule Schema
Defines temporary date blocks that override availability (e.g. holiday shutdowns, planned maintenance, private events).

```typescript
interface ExceptionRule {
  id: string;          // Unique identifier
  venueId: string;     // Associated venue reference
  name: string;        // Description of closure (e.g., "Christmas Closure")
  type: "holiday" | "maintenance" | "private_event" | "restriction";
  startDate: string;   // Date format YYYY-MM-DD (e.g., "2026-12-24")
  endDate: string;     // Date format YYYY-MM-DD (e.g., "2026-12-26")
  startTime?: string;  // Optional specific start HH:MM
  endTime?: string;    // Optional specific end HH:MM
}
```

---

## 2. API Endpoints Required

### A. Venue Management

#### 1. List Owner Venues
* **Endpoint**: `GET /api/venues/owner`
* **Query Parameters**:
  * `ownerId` (string, required) - Current logged-in user email/id
  * `search` (string, optional) - Query keyword
  * `status` (string, optional) - Filter by `approved` | `pending` | `rejected` | `all`
  * `page` (number, default: 1)
  * `limit` (number, default: 6)
* **Response** (200 OK):
  ```json
  {
    "data": [
      {
        "id": "v-123",
        "name": "Summit Boardroom",
        "description": "Exquisite meeting space...",
        "capacity": 20,
        "location": "San Francisco",
        "address": "500 Howard St",
        "pricePerHour": 75,
        "pricePerDay": 550,
        "rating": 4.9,
        "reviewsCount": 12,
        "type": "conference",
        "images": ["https://images.unsplash.com/..."],
        "amenities": ["Wi-Fi", "AC"],
        "ownerId": "owner@bookmyvenue.com",
        "status": "approved"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 6
  }
  ```

#### 2. Create Venue
* **Endpoint**: `POST /api/venues`
* **Request Payload**:
  ```json
  {
    "name": "Summit Boardroom",
    "description": "Exquisite meeting space...",
    "capacity": 20,
    "location": "San Francisco",
    "address": "500 Howard St",
    "pricePerHour": 75,
    "pricePerDay": 550,
    "images": ["https://images.unsplash.com/..."],
    "amenities": ["Wi-Fi", "AC"],
    "type": "conference"
  }
  ```
* **Response** (201 Created): Returns the created `Venue` object with generated `id` and initial status set to `pending`.

#### 3. Update Venue Specs
* **Endpoint**: `PUT /api/venues/:id`
* **Request Payload**: Full or partial `Venue` object.
* **Response** (200 OK): Returns the fully updated `Venue` object.

#### 4. Delete Venue
* **Endpoint**: `DELETE /api/venues/:id`
* **Response** (200 OK): `{ "success": true }` (Ensure associated bookings, rules, and exception dependencies are cascadingly deleted or archived).

---

### B. Availability Rules Configuration

#### 1. Retrieve Availability Rules
* **Endpoint**: `GET /api/venues/:venueId/availability-rules`
* **Response** (200 OK): `AvailabilityRule[]`

#### 2. Create Availability Rule
* **Endpoint**: `POST /api/venues/:venueId/availability-rules`
* **Request Payload**:
  ```json
  {
    "name": "Weekend Hours",
    "daysOfWeek": [0, 6],
    "startTime": "10:00",
    "endTime": "16:00",
    "isActive": true
  }
  ```
* **Response** (201 Created): Returns the created `AvailabilityRule` object. If `isActive` was `true`, other rules must be marked inactive by the backend.

#### 3. Activate Specific Rule
* **Endpoint**: `PUT /api/venues/:venueId/availability-rules/:ruleId/activate`
* **Response** (200 OK): Returns the updated list of `AvailabilityRule[]` for the venue where only the selected rule has `isActive: true`.

#### 4. Delete Availability Rule
* **Endpoint**: `DELETE /api/venues/:venueId/availability-rules/:ruleId`
* **Response** (200 OK): `{ "success": true }`

---

### C. Exception Rules & Calendar Closures

#### 1. Retrieve Exception Blocks
* **Endpoint**: `GET /api/venues/:venueId/exception-rules`
* **Response** (200 OK): `ExceptionRule[]`

#### 2. Create Exception Block
* **Endpoint**: `POST /api/venues/:venueId/exception-rules`
* **Request Payload**:
  ```json
  {
    "name": "AC Maintenance Block",
    "type": "maintenance",
    "startDate": "2026-07-10",
    "endDate": "2026-07-10",
    "startTime": "09:00",
    "endTime": "13:00"
  }
  ```
* **Response** (201 Created): Returns the registered `ExceptionRule`.

#### 3. Delete Exception Block
* **Endpoint**: `DELETE /api/venues/:venueId/exception-rules/:exceptionId`
* **Response** (200 OK): `{ "success": true }`
