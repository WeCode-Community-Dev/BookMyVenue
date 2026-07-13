# Book My Venue - Backend API Contract

> This document defines the complete API contract that the Angular frontend expects. All endpoints, request/response formats, headers, and enums are documented here.

---

## Base Configuration

- **Base URL (Dev):** `http://localhost:3000/api`
- **Base URL (Prod):** `https://api.bookmyvenue.com/api`
- **Content-Type:** `application/json`

---

## Authentication

### JWT Token Structure

Tokens must be JWT and include a `role` field in the payload.

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "user | vendor | admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Auth Endpoints (Public - No Token Required)

#### User Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/user/login` | User login |
| POST | `/auth/user/signup` | User registration |

**Login Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Signup Request:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required, 10 digits)",
  "password": "string (required, min 8 chars)"
}
```

#### Vendor Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/vendor/login` | Vendor login |
| POST | `/auth/vendor/signup` | Vendor registration |

**Login Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Signup Request:**
```json
{
  "businessName": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required, 10 digits)",
  "password": "string (required, min 8 chars)"
}
```

#### Admin Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/admin/login` | Admin login (no signup - admins are seeded) |

**Login Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Common Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/logout` | Logout (invalidate token) |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/forgot-password` | Send password reset email |

**Refresh Token Request:**
```json
{
  "refreshToken": "string (required)"
}
```

**Forgot Password Request:**
```json
{
  "email": "string (required)"
}
```

### Auth Response Format (Login & Signup)

```json
{
  "token": "jwt-access-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "user | vendor | admin"
  }
}
```

---

## Headers on Protected Routes

Every authenticated request from the frontend includes:

```
Authorization: Bearer <jwt-token>
```

Additionally, portal-specific headers are sent:

| Portal | Extra Header |
|--------|-------------|
| User | _(none)_ |
| Vendor | `X-Portal: vendor` |
| Admin | `X-Portal: admin` |

**Backend must validate** that the JWT `role` matches the `X-Portal` header (where present) to prevent cross-portal access.

---

## Standard Response Formats

### Success - Single Item

```json
{
  "data": { ... },
  "message": "Success"
}
```

### Success - Paginated List

```json
{
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Error

```json
{
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400
  }
}
```

### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation errors) |
| 401 | Unauthorized (missing/expired token) |
| 403 | Forbidden (wrong role/portal) |
| 404 | Not Found |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

---

## Enums

These values must be used consistently between frontend and backend.

### UserRole

| Value | Description |
|-------|-------------|
| `user` | Regular user |
| `vendor` | Venue vendor |
| `admin` | Platform admin |

### BookingStatus

| Value | Description |
|-------|-------------|
| `pending` | Awaiting vendor approval |
| `confirmed` | Approved by vendor |
| `cancelled` | Cancelled by user |
| `completed` | Event completed |
| `rejected` | Rejected by vendor |

### VenueStatus

| Value | Description |
|-------|-------------|
| `active` | Live and bookable |
| `inactive` | Hidden by vendor |
| `pending` | Awaiting admin approval |
| `rejected` | Rejected by admin |

---

## API Endpoints by Portal

---

### User Portal

> All endpoints require `Authorization: Bearer <token>` with `role: user`

#### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get current user's profile |
| PUT | `/users/profile` | Update profile |

**GET `/users/profile` Response:**
```json
{
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "user",
    "createdAt": "ISO 8601 date string",
    "updatedAt": "ISO 8601 date string"
  }
}
```

**PUT `/users/profile` Request:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "phone": "string (required, 10 digits)"
}
```

#### Venues (Public Browsing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/venues` | List all active venues (paginated, filterable) |
| GET | `/venues/:id` | Get venue details by ID |

**GET `/venues` Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `search` | string | — | Search by name or description |
| `city` | string | — | Filter by city |
| `minPrice` | number | — | Minimum price per hour |
| `maxPrice` | number | — | Maximum price per hour |
| `capacity` | number | — | Minimum guest capacity |

**GET `/venues` Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "capacity": "number",
      "pricePerHour": "number",
      "amenities": ["string"],
      "images": ["string (URL)"],
      "status": "active",
      "vendorId": "string",
      "vendorName": "string",
      "rating": "number (optional)",
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

**GET `/venues/:id` Response:**
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "capacity": "number",
    "pricePerHour": "number",
    "amenities": ["string"],
    "images": ["string (URL)"],
    "status": "active",
    "vendorId": "string",
    "vendorName": "string",
    "rating": "number (optional)",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

#### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings/user` | Get current user's bookings |
| GET | `/bookings/:id` | Get booking details |
| POST | `/bookings` | Create a new booking |
| PUT | `/bookings/:id/cancel` | Cancel a booking |

**GET `/bookings/user` Response:**
```json
{
  "data": [
    {
      "id": "string",
      "venueId": "string",
      "venueName": "string",
      "userId": "string",
      "eventDate": "YYYY-MM-DD",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "guestCount": "number",
      "totalAmount": "number",
      "notes": "string (optional)",
      "status": "pending | confirmed | cancelled | completed | rejected",
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**POST `/bookings` Request:**
```json
{
  "venueId": "string (required)",
  "eventDate": "YYYY-MM-DD (required, must be future date)",
  "startTime": "HH:mm (required)",
  "endTime": "HH:mm (required)",
  "guestCount": "number (required, min 1)",
  "notes": "string (optional)"
}
```

**POST `/bookings` Response:**
```json
{
  "data": {
    "id": "string",
    "venueId": "string",
    "venueName": "string",
    "userId": "string",
    "eventDate": "YYYY-MM-DD",
    "startTime": "HH:mm",
    "endTime": "HH:mm",
    "guestCount": "number",
    "totalAmount": "number (calculated: hours x pricePerHour)",
    "notes": "string",
    "status": "pending",
    "createdAt": "ISO 8601"
  },
  "message": "Booking created successfully"
}
```

---

### Vendor Portal

> All endpoints require `Authorization: Bearer <token>` with `role: vendor` and `X-Portal: vendor` header

#### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors/profile` | Get vendor profile |
| PUT | `/vendors/profile` | Update vendor profile |

**GET `/vendors/profile` Response:**
```json
{
  "data": {
    "id": "string",
    "businessName": "string",
    "email": "string",
    "phone": "string",
    "role": "vendor",
    "isVerified": "boolean",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

**PUT `/vendors/profile` Request:**
```json
{
  "businessName": "string (required)",
  "phone": "string (required)"
}
```

#### Venue Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors/venues` | Get vendor's own venues |
| POST | `/vendors/venues` | Create a new venue |
| PUT | `/vendors/venues/:id` | Update a venue |
| DELETE | `/vendors/venues/:id` | Delete a venue |

**POST `/vendors/venues` Request:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "address": "string (required)",
  "city": "string (required)",
  "state": "string (required)",
  "zipCode": "string (required)",
  "capacity": "number (required, min 1)",
  "pricePerHour": "number (required, min 0)",
  "amenities": ["string (optional)"],
  "images": ["string URL (optional)"]
}
```

**PUT `/vendors/venues/:id` Request:**
```json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "capacity": "number",
  "pricePerHour": "number",
  "amenities": ["string"],
  "images": ["string URL"]
}
```

#### Booking Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors/bookings` | Get bookings for vendor's venues |
| PUT | `/vendors/bookings/:id/approve` | Approve a pending booking |
| PUT | `/vendors/bookings/:id/reject` | Reject a pending booking |

**GET `/vendors/bookings` Response:**
```json
{
  "data": [
    {
      "id": "string",
      "venueId": "string",
      "venueName": "string",
      "userId": "string",
      "userName": "string",
      "eventDate": "YYYY-MM-DD",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "guestCount": "number",
      "totalAmount": "number",
      "notes": "string",
      "status": "pending | confirmed | cancelled | completed | rejected",
      "createdAt": "ISO 8601"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

#### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors/analytics` | Get vendor analytics |

**GET `/vendors/analytics` Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | string | `month` | `week`, `month`, or `year` |

**GET `/vendors/analytics` Response:**
```json
{
  "data": {
    "totalVenues": "number",
    "totalBookings": "number",
    "totalRevenue": "number",
    "pendingBookings": "number",
    "revenueOverTime": [
      { "date": "string", "amount": "number" }
    ],
    "bookingTrends": [
      { "date": "string", "count": "number" }
    ],
    "topVenues": [
      { "venueId": "string", "name": "string", "bookings": "number", "revenue": "number" }
    ],
    "occupancyRate": "number (percentage)"
  }
}
```

---

### Admin Portal

> All endpoints require `Authorization: Bearer <token>` with `role: admin` and `X-Portal: admin` header

#### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users (paginated) |
| PUT | `/admin/users/:id/status` | Toggle user active/inactive |

**GET `/admin/users` Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |

**GET `/admin/users` Response:**
```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "role": "user",
      "isActive": "boolean",
      "createdAt": "ISO 8601"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

**PUT `/admin/users/:id/status` Request:**
```json
{
  "isActive": "boolean"
}
```

#### Vendor Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/vendors` | List all vendors (paginated) |
| PUT | `/admin/vendors/:id/status` | Toggle vendor status |

**GET `/admin/vendors` Response:**
```json
{
  "data": [
    {
      "id": "string",
      "businessName": "string",
      "email": "string",
      "phone": "string",
      "isVerified": "boolean",
      "isActive": "boolean",
      "totalVenues": "number",
      "createdAt": "ISO 8601"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

**PUT `/admin/vendors/:id/status` Request:**
```json
{
  "isActive": "boolean",
  "isVerified": "boolean"
}
```

#### Venue Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/venues` | List all venues (paginated) |
| PUT | `/admin/venues/:id/status` | Approve/reject/deactivate venue |

**GET `/admin/venues` Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "vendorName": "string",
      "city": "string",
      "capacity": "number",
      "pricePerHour": "number",
      "status": "active | inactive | pending | rejected",
      "createdAt": "ISO 8601"
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

**PUT `/admin/venues/:id/status` Request:**
```json
{
  "status": "active | inactive | pending | rejected"
}
```

#### Booking Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/bookings` | List all bookings (paginated) |

**GET `/admin/bookings` Response:**
```json
{
  "data": [
    {
      "id": "string",
      "venueName": "string",
      "userName": "string",
      "vendorName": "string",
      "eventDate": "YYYY-MM-DD",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "guestCount": "number",
      "totalAmount": "number",
      "status": "pending | confirmed | cancelled | completed | rejected",
      "createdAt": "ISO 8601"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

#### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/analytics` | Platform-wide analytics |

**GET `/admin/analytics` Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | string | `month` | `week`, `month`, or `year` |

**GET `/admin/analytics` Response:**
```json
{
  "data": {
    "totalUsers": "number",
    "totalVendors": "number",
    "totalVenues": "number",
    "totalBookings": "number",
    "totalRevenue": "number",
    "revenueOverTime": [
      { "date": "string", "amount": "number" }
    ],
    "userGrowth": [
      { "date": "string", "count": "number" }
    ],
    "bookingTrends": [
      { "date": "string", "count": "number" }
    ],
    "topVenues": [
      { "venueId": "string", "name": "string", "bookings": "number", "revenue": "number" }
    ]
  }
}
```

#### Platform Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/settings` | Get platform settings |
| PUT | `/admin/settings` | Update platform settings |

**GET `/admin/settings` Response:**
```json
{
  "data": {
    "siteName": "string",
    "supportEmail": "string",
    "commissionRate": "number (percentage, e.g. 10 for 10%)"
  }
}
```

**PUT `/admin/settings` Request:**
```json
{
  "siteName": "string (required)",
  "supportEmail": "string (required, valid email)",
  "commissionRate": "number (required, 0-100)"
}
```

---

## CORS Configuration

The backend must allow the following origins:

- **Dev:** `http://localhost:4200` (Angular dev server)
- **Prod:** Your production frontend domain

Required CORS headers:
```
Access-Control-Allow-Origin: <frontend-origin>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Portal
Access-Control-Allow-Credentials: true
```

---

## Database Schema Suggestions

### Users Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID / String | Primary key |
| firstName | String | Required |
| lastName | String | Required |
| email | String | Unique, required |
| phone | String | Required |
| password | String | Hashed, required |
| role | Enum | `user`, `vendor`, `admin` |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Vendors Table (extends or separate from Users)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID / String | Primary key |
| businessName | String | Required |
| email | String | Unique, required |
| phone | String | Required |
| password | String | Hashed, required |
| isVerified | Boolean | Default: false |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Venues Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID / String | Primary key |
| vendorId | UUID / String | Foreign key to Vendors |
| name | String | Required |
| description | Text | Required |
| address | String | Required |
| city | String | Required |
| state | String | Required |
| zipCode | String | Required |
| capacity | Integer | Required, min 1 |
| pricePerHour | Decimal | Required, min 0 |
| amenities | JSON / Array | Optional |
| images | JSON / Array | URLs |
| status | Enum | `active`, `inactive`, `pending`, `rejected` |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Bookings Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID / String | Primary key |
| venueId | UUID / String | Foreign key to Venues |
| userId | UUID / String | Foreign key to Users |
| eventDate | Date | Required, future date |
| startTime | String | HH:mm format |
| endTime | String | HH:mm format |
| guestCount | Integer | Required, min 1 |
| totalAmount | Decimal | Calculated: hours x pricePerHour |
| notes | Text | Optional |
| status | Enum | `pending`, `confirmed`, `cancelled`, `completed`, `rejected` |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Settings Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID / String | Primary key |
| siteName | String | Default: "Book My Venue" |
| supportEmail | String | Default: "support@bookmyvenue.com" |
| commissionRate | Decimal | Default: 10 (percentage) |

---

## Seed Data

Create at least one admin user on first run:

```json
{
  "email": "admin@bookmyvenue.com",
  "password": "Admin@123",
  "role": "admin",
  "firstName": "Super",
  "lastName": "Admin"
}
```

---

## Notes

- All dates should be in ISO 8601 format (`2025-01-15T10:30:00.000Z`)
- Event dates are `YYYY-MM-DD` format
- Times are `HH:mm` 24-hour format
- Passwords must be hashed (bcrypt recommended)
- Token expiry: access token ~15 min, refresh token ~7 days
- Pagination defaults: `page=1`, `limit=10`
- The frontend handles all validation on its end, but the backend should also validate
- Image handling: the frontend sends image URLs — implement file upload separately and return URLs
