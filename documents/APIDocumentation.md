# BookMyVenue — API Documentation

**Project:** BookMyVenue  
**Version:** v1  
**Base URL:** `http://localhost:5000/api/v1`  
**Format:** JSON  
**Authentication:** JWT Bearer Token

---

## Table of Contents

1. [Overview](#1-overview)
2. [Conventions](#2-conventions)
3. [Authentication APIs](#3-authentication-apis)
4. [User Profile APIs](#4-user-profile-apis)
5. [Venue APIs](#5-venue-apis)
6. [Amenity APIs](#6-amenity-apis)
7. [Booking APIs](#7-booking-apis)
8. [Owner APIs](#8-owner-apis)
9. [Feedback & Rating APIs](#9-feedback--rating-apis)
10. [Issue APIs](#10-issue-apis)
11. [Admin APIs](#11-admin-apis)
12. [Payment APIs](#12-payment-apis)
13. [Error Reference](#13-error-reference)
14. [Role & Access Matrix](#14-role--access-matrix)

---

## 1. Overview

BookMyVenue is a venue discovery and booking platform with three roles:

| Role   | Description                                      |
|--------|--------------------------------------------------|
| `user` | Browse venues, create bookings, pay, rate venues |
| `owner`| Manage venues and view bookings for their spaces |
| `admin`| Approve venues, manage users, oversee platform   |

All protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 2. Conventions

### 2.1 Request headers

| Header          | Required | Description                          |
|-----------------|----------|--------------------------------------|
| `Content-Type`  | Yes*     | `application/json` for JSON bodies   |
| `Authorization` | Conditional | `Bearer <token>` for protected routes |

\* Not required for `GET` requests without a body.

### 2.2 Date & time formats

| Field          | Format       | Example        |
|----------------|--------------|----------------|
| Date           | `YYYY-MM-DD` | `2026-06-20`   |
| Time           | `HH:MM`      | `18:00`        |
| DateTime (ISO) | ISO 8601     | `2026-06-20T18:00:00Z` |

### 2.3 Standard success response wrapper

Most endpoints return data directly or use a simple message object:

```json
{
  "message": "Operation completed successfully",
  "data": {}
}
```

### 2.4 Standard error response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 2.5 Pagination (list endpoints)

Query parameters:

| Param   | Type    | Default | Description        |
|---------|---------|---------|--------------------|
| `page`  | integer | `1`     | Page number        |
| `limit` | integer | `20`    | Items per page (max 100) |

Paginated response:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 150,
    "total_pages": 8
  }
}
```

### 2.6 Roles

Valid role values: `user`, `owner`, `admin`

During registration, only `user` or `owner` can be self-selected. `admin` accounts are created internally.

### 2.7 API ↔ Database field mapping

JSON request/response fields use the **same names** as database columns unless noted as derived below.

| API field | DB table.column | Notes |
|-----------|-----------------|-------|
| `name`, `email`, `mobile`, `role`, `is_active` | `users.*` | `password` in requests → `users.password_hash` (hashed) |
| `business_name`, `phone` | `owner_profiles.*` | Owner profile endpoints only |
| `price_per_day` | `venues.price_per_day` | Venue price (INR per day) |
| `approval_status` | `venues.approval_status` | `pending`, `approved`, `rejected` |
| `rejection_reason` | `venues.rejection_reason` | Set on admin reject |
| `average_rating`, `total_reviews` | `venues.*` | Denormalized from `venue_ratings` |
| `is_active` | `venues.is_active` | `false` when admin blocks venue |
| `image_url` | `venue_images.image_url` | |
| `display_order` | `venue_images.display_order` | |
| `amenity_ids` | `venue_amenities.amenity_id` | Array in request; rows in join table |
| `booking_date`, `time_slot`, `notes`, `amount`, `status` | `bookings.*` | |
| `cancellation_reason` | `bookings.cancellation_reason` | Cancel booking request body |
| `cancelled_at` | `bookings.cancelled_at` | Set when status → `cancelled` |
| `payment_id` | `payments.payment_id` | External payment ID string |
| `currency`, `gateway`, `gateway_*` | `payments.*` | |
| `payment_status` | `payments.status` | **Derived** — latest payment for booking (not on `bookings`) |
| `refund_id`, `refund` status fields | `refunds.*` | `refund_status` in cancel response = `refunds.status` |
| `rating`, `comment` | `venue_ratings.*` | |
| `message` | `venue_feedback.message` | Feedback endpoint only |
| `subject`, `description`, `admin_note` | `issues.*` | Issue `status`: `open`, `in_progress`, `resolved`, `closed` |
| `thumbnail_url` | — | **Derived** — first `venue_images.image_url` by `display_order` |

### 2.8 Shared enum values

Must match [DBDesign.md](./DBDesign.md) constraints exactly.

| Field | Allowed values |
|-------|----------------|
| `users.role` | `user`, `owner`, `admin` |
| `venues.approval_status` | `pending`, `approved`, `rejected` |
| `bookings.status` | `pending_payment`, `booked`, `cancelled` |
| `payments.status` | `created`, `paid`, `failed`, `refunded`, `refund_pending` |
| `refunds.status` | `refund_pending`, `refunded`, `failed` |
| `issues.status` | `open`, `in_progress`, `resolved`, `closed` |
| `payments.gateway` | `razorpay`, `stripe` |

---

## 3. Authentication APIs

### 3.1 Register

Create a new account.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/auth/register` |
| **Auth** | None |

**Request body**

```json
{
  "name": "Alan",
  "email": "alan@gmail.com",
  "password": "123456",
  "mobile": "9090900000",
  "role": "user"
}
```

| Field      | Type   | Required | Rules                              |
|------------|--------|----------|------------------------------------|
| `name`     | string | Yes      | 2–100 characters                   |
| `email`    | string | Yes      | Valid email, unique                |
| `password` | string | Yes      | Min 6 characters                   |
| `mobile`   | string | No       | 10-digit phone number              |
| `role`     | string | Yes      | `user` or `owner`                  |

**Success response — `201 Created`**

```json
{
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Alan",
    "email": "alan@gmail.com",
    "mobile": "9090900000",
    "role": "user",
    "is_active": true,
    "created_at": "2026-06-01T10:00:00Z"
  }
}
```

**Error responses**

| Status | Code              | When                        |
|--------|-------------------|-----------------------------|
| `400`  | `VALIDATION_ERROR`| Invalid input               |
| `409`  | `EMAIL_EXISTS`    | Email already registered    |

---

### 3.2 Login

Authenticate and receive tokens.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/auth/login` |
| **Auth** | None |

**Request body**

```json
{
  "email": "alan@gmail.com",
  "password": "123456"
}
```

**Success response — `200 OK`**

```json
{
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

| Field           | Description                          |
|-----------------|--------------------------------------|
| `access_token`  | JWT used for API requests (30 min)   |
| `refresh_token` | Used to obtain a new access token    |
| `expires_in`    | Access token lifetime in seconds     |

**Error responses**

| Status | Code            | When              |
|--------|-----------------|-------------------|
| `401`  | `INVALID_CREDENTIALS` | Wrong email/password |
| `403`  | `ACCOUNT_DISABLED`    | User is inactive     |

---

### 3.3 Refresh Token

Obtain a new access token without re-login.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/auth/refresh` |
| **Auth** | None |

**Request body**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success response — `200 OK`**

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

---

### 3.4 Logout

Invalidate the current refresh token.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/auth/logout` |
| **Auth** | Bearer token |

**Request body**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success response — `200 OK`**

```json
{
  "message": "Logged out successfully"
}
```

---

### 3.5 Forgot Password

Request a password reset link.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/auth/forgot-password` |
| **Auth** | None |

**Request body**

```json
{
  "email": "alan@gmail.com"
}
```

**Success response — `200 OK`**

```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

---

### 3.6 Reset Password

Set a new password using a reset token.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/auth/reset-password` |
| **Auth** | None |

**Request body**

```json
{
  "token": "reset_token_from_email",
  "new_password": "newSecurePassword123"
}
```

**Success response — `200 OK`**

```json
{
  "message": "Password reset successfully"
}
```

---

## 4. User Profile APIs

### 4.1 Get Current User

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/users/me` |
| **Auth** | Bearer token |

**Success response — `200 OK`**

```json
{
  "data": {
    "id": 1,
    "name": "Alan",
    "email": "alan@gmail.com",
    "mobile": "9090900000",
    "role": "user",
    "is_active": true,
    "created_at": "2026-06-01T10:00:00Z",
    "updated_at": "2026-06-01T10:00:00Z"
  }
}
```

---

### 4.2 Update Profile

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/users/me` |
| **Auth** | Bearer token |

**Request body**

```json
{
  "name": "Alan Updated",
  "mobile": "9090900001"
}
```

**Success response — `200 OK`**

```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "Alan Updated",
    "email": "alan@gmail.com",
    "mobile": "9090900001",
    "role": "user",
    "is_active": true,
    "updated_at": "2026-06-10T12:00:00Z"
  }
}
```

---

### 4.3 Change Password

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/users/me/password` |
| **Auth** | Bearer token |

**Request body**

```json
{
  "current_password": "123456",
  "new_password": "newSecurePassword123"
}
```

**Success response — `200 OK`**

```json
{
  "message": "Password changed successfully"
}
```

---

## 5. Venue APIs

### 5.1 Get All Venues (Public)

Browse approved venues. Supports search and filters.

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/venues` |
| **Auth** | None |

**Query parameters**

| Param        | Type    | Description                          |
|--------------|---------|--------------------------------------|
| `location`   | string  | Filter by city/area (partial match)  |
| `min_price`  | number  | Minimum `price_per_day`              |
| `max_price`  | number  | Maximum `price_per_day`              |
| `amenity`    | string  | Filter by amenity name               |
| `search`     | string  | Search name or description           |
| `sort`       | string  | `price_asc`, `price_desc`, `rating`  |
| `page`       | integer | Page number                          |
| `limit`      | integer | Items per page                       |

**Example**

```http
GET /venues?location=Kochi&min_price=5000&max_price=20000&page=1&limit=10
```

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Grand Hall",
      "location": "Kochi",
      "price_per_day": 10000,
      "approval_status": "approved",
      "average_rating": 4.5,
      "thumbnail_url": "https://cdn.example.com/venues/1/img1.jpg",
      "amenities": ["Wi-Fi", "Parking", "AC"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 45,
    "total_pages": 5
  }
}
```

---

### 5.2 Get Venue Details (Public)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/venues/:id` |
| **Auth** | None |

**Example**

```http
GET /venues/1
```

**Success response — `200 OK`**

```json
{
  "data": {
    "id": 1,
    "owner_id": 5,
    "name": "Grand Hall",
    "location": "Kochi, Kerala",
    "price_per_day": 10000,
    "description": "Large event venue with stage and seating for 500",
    "approval_status": "approved",
    "is_active": true,
    "average_rating": 4.5,
    "total_reviews": 28,
    "amenities": [
      { "id": 1, "name": "Wi-Fi" },
      { "id": 2, "name": "Parking" },
      { "id": 3, "name": "AC" }
    ],
    "images": [
      { "id": 1, "image_url": "https://cdn.example.com/venues/1/img1.jpg", "display_order": 0 },
      { "id": 2, "image_url": "https://cdn.example.com/venues/1/img2.jpg", "display_order": 1 }
    ],
    "created_at": "2026-05-15T08:00:00Z",
    "updated_at": "2026-05-15T08:00:00Z"
  }
}
```

**Error responses**

| Status | Code           | When              |
|--------|----------------|-------------------|
| `404`  | `VENUE_NOT_FOUND`| Venue does not exist |

---

### 5.3 Create Venue

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/venues` |
| **Auth** | Bearer token — **Owner only** |

**Request body**

```json
{
  "name": "Grand Hall",
  "location": "Kochi",
  "price_per_day": 10000,
  "description": "Large event venue",
  "amenity_ids": [1, 2, 3]
}
```

| Field           | Type     | Required | DB column              |
|-----------------|----------|----------|------------------------|
| `name`          | string   | Yes      | `venues.name`          |
| `location`      | string   | Yes      | `venues.location`      |
| `price_per_day` | number   | Yes      | `venues.price_per_day` |
| `description`   | string   | No       | `venues.description`   |
| `amenity_ids`   | integer[]| No       | `venue_amenities`      |

**Success response — `201 Created`**

```json
{
  "message": "Venue added successfully. Pending admin approval.",
  "data": {
    "id": 12,
    "name": "Grand Hall",
    "location": "Kochi",
    "price_per_day": 10000,
    "approval_status": "pending",
    "is_active": true,
    "created_at": "2026-06-09T16:00:00Z"
  }
}
```

---

### 5.4 Update Venue

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/venues/:id` |
| **Auth** | Bearer token — **Owner (own venue) or Admin** |

**Example**

```http
PUT /venues/12
```

**Request body**

```json
{
  "name": "Grand Hall Premium",
  "location": "Kochi, Edapally",
  "price_per_day": 12000,
  "description": "Renovated large event venue",
  "amenity_ids": [1, 2, 3, 4]
}
```

**Success response — `200 OK`**

```json
{
  "message": "Venue updated successfully",
  "data": {
    "id": 12,
    "name": "Grand Hall Premium",
    "location": "Kochi, Edapally",
    "price_per_day": 12000,
    "approval_status": "pending",
    "updated_at": "2026-06-10T10:00:00Z"
  }
}
```

> **Note:** Major updates may reset `approval_status` to `pending`.

---

### 5.5 Delete Venue

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/venues/:id` |
| **Auth** | Bearer token — **Owner (own venue) or Admin** |

**Example**

```http
DELETE /venues/12
```

**Success response — `200 OK`**

```json
{
  "message": "Venue deleted successfully"
}
```

**Error responses**

| Status | Code                  | When                              |
|--------|-----------------------|-----------------------------------|
| `403`  | `FORBIDDEN`           | Not the venue owner               |
| `409`  | `ACTIVE_BOOKINGS_EXIST`| Venue has upcoming bookings      |

---

### 5.6 Get My Venues (Owner)

List venues owned by the authenticated user.

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/venues/my-venues` |
| **Auth** | Bearer token — **Owner only** |

**Query parameters:** `page`, `limit`, `approval_status` (`approved`, `pending`, `rejected`)

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": 12,
      "name": "Grand Hall",
      "location": "Kochi",
      "price_per_day": 10000,
      "approval_status": "pending",
      "is_active": true,
      "total_bookings": 5,
      "created_at": "2026-06-09T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 3,
    "total_pages": 1
  }
}
```

---

### 5.7 Upload Venue Images

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/venues/:id/images` |
| **Auth** | Bearer token — **Owner (own venue)** |
| **Content-Type** | `multipart/form-data` |

**Form fields**

| Field   | Type | Required | Description        |
|---------|------|----------|--------------------|
| `images`| file | Yes      | One or more images (max 5 MB each, JPG/PNG/WebP) |

**Success response — `201 Created`**

```json
{
  "message": "Images uploaded successfully",
  "data": {
    "images": [
      { "id": 10, "image_url": "https://cdn.example.com/venues/12/img10.jpg", "display_order": 0 },
      { "id": 11, "image_url": "https://cdn.example.com/venues/12/img11.jpg", "display_order": 1 }
    ]
  }
}
```

---

### 5.8 Delete Venue Image

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/venues/:id/images/:image_id` |
| **Auth** | Bearer token — **Owner (own venue)** |

**Success response — `200 OK`**

```json
{
  "message": "Image deleted successfully"
}
```

---

### 5.9 Check Venue Availability

Check if a venue is available on a given date and time slot.

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/venues/:id/availability` |
| **Auth** | None |

**Query parameters**

| Param          | Type   | Required | Description     |
|----------------|--------|----------|-----------------|
| `booking_date` | string | Yes      | `YYYY-MM-DD`    |
| `time_slot`    | string | No       | `HH:MM`         |

**Example**

```http
GET /venues/1/availability?booking_date=2026-06-20&time_slot=18:00
```

**Success response — `200 OK`**

```json
{
  "data": {
    "venue_id": 1,
    "booking_date": "2026-06-20",
    "time_slot": "18:00",
    "is_available": true
  }
}
```

---

## 6. Amenity APIs

### 6.1 Get All Amenities

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/amenities` |
| **Auth** | None |

**Success response — `200 OK`**

```json
{
  "data": [
    { "id": 1, "name": "Wi-Fi" },
    { "id": 2, "name": "Parking" },
    { "id": 3, "name": "AC" },
    { "id": 4, "name": "Projector" }
  ]
}
```

---

## 7. Booking APIs

### 7.1 Create Booking

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/bookings` |
| **Auth** | Bearer token — **User only** |

**Request body**

```json
{
  "venue_id": 1,
  "booking_date": "2026-06-20",
  "time_slot": "18:00",
  "notes": "Birthday party setup needed"
}
```

| Field          | Type   | Required | DB column                |
|----------------|--------|----------|--------------------------|
| `venue_id`     | integer| Yes      | `bookings.venue_id`      |
| `booking_date` | string | Yes      | `bookings.booking_date`  |
| `time_slot`    | string | Yes      | `bookings.time_slot`     |
| `notes`        | string | No       | `bookings.notes`         |

**Success response — `201 Created`**

```json
{
  "message": "Booking created",
  "data": {
    "id": 101,
    "venue_id": 1,
    "venue_name": "Grand Hall",
    "booking_date": "2026-06-20",
    "time_slot": "18:00",
    "status": "pending_payment",
    "amount": 10000,
    "created_at": "2026-06-10T14:30:00Z"
  }
}
```

> After creating a booking, proceed to [Payment APIs](#12-payment-apis) to complete payment. Booking status becomes `booked` only after successful payment.

---

### 7.2 Get My Bookings

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/bookings/my-bookings` |
| **Auth** | Bearer token — **User only** |

**Query parameters:** `status` (`booked`, `cancelled`, `pending_payment`), `page`, `limit`

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": 101,
      "venue_id": 1,
      "venue_name": "Grand Hall",
      "venue_location": "Kochi",
      "booking_date": "2026-06-20",
      "time_slot": "18:00",
      "status": "booked",
      "amount": 10000,
      "payment_status": "paid",
      "created_at": "2026-06-10T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 5,
    "total_pages": 1
  }
}
```

---

### 7.3 Get Booking Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/bookings/:id` |
| **Auth** | Bearer token — **User (own booking), Owner (their venue), or Admin** |

**Success response — `200 OK`**

```json
{
  "data": {
    "id": 101,
    "user_id": 1,
    "user_name": "Alan",
    "venue_id": 1,
    "venue_name": "Grand Hall",
    "booking_date": "2026-06-20",
    "time_slot": "18:00",
    "status": "booked",
    "amount": 10000,
    "notes": "Birthday party setup needed",
    "cancellation_reason": null,
    "cancelled_at": null,
    "payment_status": "paid",
    "payment": {
      "payment_id": "pay_abc123",
      "status": "paid",
      "paid_at": "2026-06-10T14:35:00Z"
    },
    "created_at": "2026-06-10T14:30:00Z"
  }
}
```

---

### 7.4 Cancel Booking

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/bookings/:id/cancel` |
| **Auth** | Bearer token — **User (own booking)** |

**Request body (optional)**

```json
{
  "cancellation_reason": "Schedule conflict"
}
```

| Field                 | Type   | Required | DB column                      |
|-----------------------|--------|----------|--------------------------------|
| `cancellation_reason` | string | No       | `bookings.cancellation_reason` |

**Success response — `200 OK`**

```json
{
  "message": "Booking cancelled successfully",
  "data": {
    "id": 101,
    "status": "cancelled",
    "cancellation_reason": "Schedule conflict",
    "cancelled_at": "2026-06-11T09:00:00Z",
    "refund_status": "refund_pending"
  }
}
```

> `refund_status` maps to `refunds.status` when a refund row is created for the paid booking.

> If payment was completed, a refund is initiated automatically. See [Refund Payment](#124-refund-payment).

**Error responses**

| Status | Code                    | When                        |
|--------|-------------------------|-----------------------------|
| `400`  | `CANCELLATION_NOT_ALLOWED`| Booking date has passed   |
| `404`  | `BOOKING_NOT_FOUND`     | Invalid booking ID          |

---

## 8. Owner APIs

### 8.1 Get Bookings for My Venues

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/owner/bookings` |
| **Auth** | Bearer token — **Owner only** |

**Query parameters:** `venue_id`, `status`, `booking_date`, `page`, `limit`

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": 101,
      "venue_id": 12,
      "venue_name": "Grand Hall",
      "user_name": "Alan",
      "user_email": "alan@gmail.com",
      "booking_date": "2026-06-20",
      "time_slot": "18:00",
      "status": "booked",
      "amount": 10000,
      "payment_status": "paid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 8,
    "total_pages": 1
  }
}
```

---

### 8.2 Get Owner Dashboard Stats

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/owner/dashboard` |
| **Auth** | Bearer token — **Owner only** |

**Success response — `200 OK`**

```json
{
  "data": {
    "total_venues": 3,
    "approved_venues": 2,
    "pending_venues": 1,
    "total_bookings": 25,
    "upcoming_bookings": 8,
    "total_revenue": 250000,
    "average_rating": 4.3
  }
}
```

---

### 8.3 Update Owner Profile

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/owner/profile` |
| **Auth** | Bearer token — **Owner only** |

**Request body**

```json
{
  "business_name": "Alan Events Pvt Ltd",
  "phone": "9090900000"
}
```

**Success response — `200 OK`**

```json
{
  "message": "Owner profile updated successfully",
  "data": {
    "business_name": "Alan Events Pvt Ltd",
    "phone": "9090900000"
  }
}
```

---

## 9. Feedback & Rating APIs

### 9.1 Submit Venue Rating

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/venues/:id/ratings` |
| **Auth** | Bearer token — **User only** |

**Request body**

```json
{
  "rating": 5,
  "comment": "Excellent venue, great staff!"
}
```

| Field     | Type    | Required | DB column              |
|-----------|---------|----------|------------------------|
| `rating`  | integer | Yes      | `venue_ratings.rating` (1–5) |
| `comment` | string  | No       | `venue_ratings.comment` (max 500) |

**Success response — `201 Created`**

```json
{
  "message": "Rating submitted successfully",
  "data": {
    "id": 50,
    "venue_id": 1,
    "rating": 5,
    "comment": "Excellent venue, great staff!",
    "created_at": "2026-06-21T10:00:00Z"
  }
}
```

---

### 9.2 Get Venue Ratings

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/venues/:id/ratings` |
| **Auth** | None |

**Query parameters:** `page`, `limit`

**Success response — `200 OK`**

```json
{
  "data": {
    "average_rating": 4.5,
    "total_reviews": 28,
    "reviews": [
      {
        "id": 50,
        "user_name": "Alan",
        "rating": 5,
        "comment": "Excellent venue, great staff!",
        "created_at": "2026-06-21T10:00:00Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 28,
    "total_pages": 2
  }
}
```

---

### 9.3 Submit Venue Feedback

General feedback (not a star rating).

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/venues/:id/feedback` |
| **Auth** | Bearer token — **User only** |

**Request body**

```json
{
  "message": "Would be great to have more parking space."
}
```

**Success response — `201 Created`**

```json
{
  "message": "Feedback submitted successfully"
}
```

---

## 10. Issue APIs

### 10.1 Raise an Issue

Report a problem with a venue or booking.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/issues` |
| **Auth** | Bearer token — **User only** |

**Request body**

```json
{
  "venue_id": 1,
  "booking_id": 101,
  "subject": "Venue not as described",
  "description": "The venue did not have the promised AV equipment."
}
```

| Field         | Type    | Required | DB column           |
|---------------|---------|----------|---------------------|
| `venue_id`    | integer | Yes      | `issues.venue_id`   |
| `booking_id`  | integer | No       | `issues.booking_id` |
| `subject`     | string  | Yes      | `issues.subject`    |
| `description` | string  | Yes      | `issues.description`|

**Success response — `201 Created`**

```json
{
  "message": "Issue raised successfully",
  "data": {
    "id": 7,
    "status": "open",
    "created_at": "2026-06-21T12:00:00Z"
  }
}
```

---

### 10.2 Get My Issues

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/issues/my-issues` |
| **Auth** | Bearer token — **User only** |

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": 7,
      "venue_id": 1,
      "venue_name": "Grand Hall",
      "subject": "Venue not as described",
      "status": "open",
      "created_at": "2026-06-21T12:00:00Z"
    }
  ]
}
```

---

### 10.3 Get All Issues (Admin)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/admin/issues` |
| **Auth** | Bearer token — **Admin only** |

**Query parameters:** `status` (`open`, `in_progress`, `resolved`, `closed`), `page`, `limit`

---

### 10.4 Update Issue Status (Admin)

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/admin/issues/:id` |
| **Auth** | Bearer token — **Admin only** |

**Request body**

```json
{
  "status": "resolved",
  "admin_note": "Contacted owner, issue addressed."
}
```

| Field        | Type   | Required | DB column              |
|--------------|--------|----------|------------------------|
| `status`     | string | Yes      | `issues.status`        |
| `admin_note` | string | No       | `issues.admin_note`    |

When `status` is `resolved`, the API sets `issues.resolved_at` to the current timestamp.

---

## 11. Admin APIs

All admin endpoints require `Authorization: Bearer <JWT_TOKEN>` with role `admin`.

---

### 11.1 Get Pending Venues

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/admin/pending-venues` |
| **Auth** | Admin |

**Query parameters:** `page`, `limit`

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": 12,
      "owner_id": 5,
      "owner_name": "Venue Owner",
      "name": "Grand Hall",
      "location": "Kochi",
      "price_per_day": 10000,
      "approval_status": "pending",
      "created_at": "2026-06-09T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 4,
    "total_pages": 1
  }
}
```

---

### 11.2 Approve Venue

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/admin/venues/:id/approve` |
| **Auth** | Admin |

**Example**

```http
PATCH /admin/venues/12/approve
```

**Success response — `200 OK`**

```json
{
  "message": "Venue approved",
  "data": {
    "id": 12,
    "approval_status": "approved",
    "updated_at": "2026-06-10T11:00:00Z"
  }
}
```

Sets `venues.approval_status = 'approved'`.

---

### 11.3 Reject Venue

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/admin/venues/:id/reject` |
| **Auth** | Admin |

**Request body (optional)**

```json
{
  "rejection_reason": "Incomplete venue information or misleading photos"
}
```

| Field              | Type   | Required | DB column                 |
|--------------------|--------|----------|---------------------------|
| `rejection_reason` | string | No       | `venues.rejection_reason` |

**Success response — `200 OK`**

```json
{
  "message": "Venue rejected",
  "data": {
    "id": 12,
    "approval_status": "rejected",
    "rejection_reason": "Incomplete venue information or misleading photos",
    "updated_at": "2026-06-10T11:00:00Z"
  }
}
```

---

### 11.4 Get All Users

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/admin/users` |
| **Auth** | Admin |

**Query parameters:** `role`, `is_active`, `search`, `page`, `limit`

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Alan",
      "email": "alan@gmail.com",
      "role": "user",
      "is_active": true,
      "created_at": "2026-06-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 120,
    "total_pages": 6
  }
}
```

---

### 11.5 Get User by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/admin/users/:id` |
| **Auth** | Admin |

---

### 11.6 Deactivate User

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/admin/users/:id/deactivate` |
| **Auth** | Admin |

**Success response — `200 OK`**

```json
{
  "message": "User deactivated successfully"
}
```

---

### 11.7 Activate User

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/admin/users/:id/activate` |
| **Auth** | Admin |

---

### 11.8 Get All Venues (Admin)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/admin/venues` |
| **Auth** | Admin |

**Query parameters:** `approval_status`, `owner_id`, `page`, `limit`

---

### 11.9 Remove / Block Venue

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/admin/venues/:id` |
| **Auth** | Admin |

Sets `venues.is_active = false` (soft block). Venue row is retained for audit.

**Success response — `200 OK`**

```json
{
  "message": "Venue removed from platform",
  "data": {
    "id": 12,
    "is_active": false,
    "updated_at": "2026-06-10T12:00:00Z"
  }
}
```

---

### 11.10 Admin Dashboard Stats

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/admin/dashboard` |
| **Auth** | Admin |

**Success response — `200 OK`**

```json
{
  "data": {
    "total_users": 120,
    "total_owners": 35,
    "total_venues": 80,
    "pending_venues": 4,
    "total_bookings": 450,
    "total_revenue": 4500000,
    "open_issues": 3
  }
}
```

---

## 12. Payment APIs

Payment integration supports online booking checkout. Bookings start as `pending_payment` and move to `booked` after successful payment.

**Supported gateways (planned):** Razorpay / Stripe

---

### 12.1 Create Payment Order

Initiate payment for a booking.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/payments/create-order` |
| **Auth** | Bearer token — **User only** |

**Request body**

```json
{
  "booking_id": 101,
  "currency": "INR"
}
```

| Field        | Type    | Required | Description              |
|--------------|---------|----------|--------------------------|
| `booking_id` | integer | Yes      | Booking to pay for       |
| `currency`   | string  | No       | Default: `INR`           |

**Success response — `201 Created`**

```json
{
  "message": "Payment order created",
  "data": {
    "payment_id": "pay_abc123",
    "booking_id": 101,
    "amount": 10000,
    "currency": "INR",
    "gateway": "razorpay",
    "gateway_order_id": "order_Mxyz123",
    "status": "created",
    "expires_at": "2026-06-10T15:00:00Z"
  }
}
```

Use `gateway_order_id` on the frontend to open the payment gateway checkout.

---

### 12.2 Verify Payment

Confirm payment after the user completes checkout on the gateway.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/payments/verify` |
| **Auth** | Bearer token — **User only** |

**Request body (Razorpay example)**

```json
{
  "payment_id": "pay_abc123",
  "gateway_order_id": "order_Mxyz123",
  "gateway_payment_id": "pay_Rxyz456",
  "gateway_signature": "signature_from_gateway"
}
```

**Success response — `200 OK`**

```json
{
  "message": "Payment verified successfully",
  "data": {
    "payment_id": "pay_abc123",
    "booking_id": 101,
    "status": "paid",
    "amount": 10000,
    "paid_at": "2026-06-10T14:35:00Z",
    "booking_status": "booked"
  }
}
```

**Error responses**

| Status | Code              | When                          |
|--------|-------------------|-------------------------------|
| `400`  | `PAYMENT_FAILED`  | Gateway reported failure      |
| `400`  | `INVALID_SIGNATURE`| Signature verification failed|
| `409`  | `ALREADY_PAID`    | Booking already paid          |

---

### 12.3 Get Payment Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/payments/:payment_id` |
| **Auth** | Bearer token — **User (own payment), Owner, or Admin** |

**Success response — `200 OK`**

```json
{
  "data": {
    "payment_id": "pay_abc123",
    "booking_id": 101,
    "user_id": 1,
    "venue_name": "Grand Hall",
    "amount": 10000,
    "currency": "INR",
    "status": "paid",
    "gateway": "razorpay",
    "gateway_payment_id": "pay_Rxyz456",
    "paid_at": "2026-06-10T14:35:00Z",
    "created_at": "2026-06-10T14:30:00Z"
  }
}
```

Payment status values: `created`, `paid`, `failed`, `refunded`, `refund_pending`

---

### 12.4 Get My Payments

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/payments/my-payments` |
| **Auth** | Bearer token — **User only** |

**Query parameters:** `status`, `page`, `limit`

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "payment_id": "pay_abc123",
      "booking_id": 101,
      "venue_name": "Grand Hall",
      "amount": 10000,
      "status": "paid",
      "paid_at": "2026-06-10T14:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 3,
    "total_pages": 1
  }
}
```

---

### 12.5 Refund Payment

Triggered automatically on booking cancellation, or manually by admin.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/payments/:payment_id/refund` |
| **Auth** | Bearer token — **Admin**, or **User** (own payment via cancelled booking) |

**Request body**

```json
{
  "reason": "Booking cancelled by user",
  "amount": 10000
}
```

| Field    | Type   | Required | DB column        |
|----------|--------|----------|------------------|
| `reason` | string | Yes      | `refunds.reason` |
| `amount` | number | No       | `refunds.amount` (full payment amount if omitted) |

**Success response — `200 OK`**

```json
{
  "message": "Refund initiated successfully",
  "data": {
    "payment_id": "pay_abc123",
    "refund_id": "rfnd_xyz789",
    "amount": 10000,
    "status": "refund_pending",
    "created_at": "2026-06-11T09:05:00Z"
  }
}
```

> On refund initiation, `payments.status` is updated to `refund_pending`. When complete, `refunds.status` → `refunded` and `payments.status` → `refunded`.

---

### 12.6 Payment Webhook (Gateway → Server)

Called by the payment gateway — not by the frontend.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/payments/webhook` |
| **Auth** | Gateway signature verification |

**Headers**

```http
X-Razorpay-Signature: <signature>
```

**Request body**

Gateway-specific payload (e.g. `payment.captured`, `payment.failed`, `refund.processed`).

**Success response — `200 OK`**

```json
{
  "message": "Webhook processed"
}
```

---

### 12.7 Payment Flow (End-to-End)

```text
1. User creates booking          → POST /bookings          (status: pending_payment)
2. User initiates payment        → POST /payments/create-order
3. Frontend opens gateway checkout using gateway_order_id
4. User pays on gateway
5. Frontend verifies payment     → POST /payments/verify
6. Booking confirmed             → status: booked
7. (Optional) Gateway webhook    → POST /payments/webhook  (server-side confirmation)
```

---

## 13. Error Reference

| HTTP Status | Error Code              | Description                        |
|-------------|-------------------------|------------------------------------|
| `400`       | `VALIDATION_ERROR`      | Invalid request body or params     |
| `401`       | `UNAUTHORIZED`          | Missing or invalid token           |
| `401`       | `INVALID_CREDENTIALS`   | Wrong email or password            |
| `403`       | `FORBIDDEN`             | Insufficient role/permission       |
| `403`       | `ACCOUNT_DISABLED`      | User account is inactive           |
| `404`       | `NOT_FOUND`             | Resource does not exist            |
| `404`       | `VENUE_NOT_FOUND`       | Venue does not exist               |
| `404`       | `BOOKING_NOT_FOUND`     | Booking does not exist             |
| `409`       | `EMAIL_EXISTS`          | Email already registered           |
| `409`       | `ALREADY_BOOKED`        | Venue/date slot already taken      |
| `409`       | `ALREADY_PAID`          | Payment already completed          |
| `409`       | `ACTIVE_BOOKINGS_EXIST` | Cannot delete venue with bookings  |
| `422`       | `UNPROCESSABLE`         | Business rule violation            |
| `500`       | `INTERNAL_ERROR`        | Unexpected server error            |

---

## 14. Role & Access Matrix

| Endpoint                              | Public | User | Owner | Admin |
|---------------------------------------|:------:|:----:|:-----:|:-----:|
| `POST /auth/register`                 | ✅     | —    | —     | —     |
| `POST /auth/login`                    | ✅     | —    | —     | —     |
| `GET /venues`                         | ✅     | ✅   | ✅    | ✅    |
| `GET /venues/:id`                     | ✅     | ✅   | ✅    | ✅    |
| `POST /venues`                        | —      | —    | ✅    | ✅    |
| `PUT /venues/:id`                     | —      | —    | ✅*   | ✅    |
| `DELETE /venues/:id`                  | —      | —    | ✅*   | ✅    |
| `GET /venues/my-venues`               | —      | —    | ✅    | —     |
| `POST /bookings`                      | —      | ✅   | —     | —     |
| `GET /bookings/my-bookings`           | —      | ✅   | —     | —     |
| `PATCH /bookings/:id/cancel`          | —      | ✅*  | —     | —     |
| `GET /owner/bookings`                 | —      | —    | ✅    | —     |
| `POST /venues/:id/ratings`            | —      | ✅   | —     | —     |
| `POST /issues`                        | —      | ✅   | —     | —     |
| `POST /payments/create-order`         | —      | ✅   | —     | —     |
| `POST /payments/verify`               | —      | ✅   | —     | —     |
| `GET /payments/my-payments`           | —      | ✅   | —     | —     |
| `GET /admin/pending-venues`           | —      | —    | —     | ✅    |
| `PATCH /admin/venues/:id/approve`     | —      | —    | —     | ✅    |
| `PATCH /admin/venues/:id/reject`      | —      | —    | —     | ✅    |
| `GET /admin/users`                    | —      | —    | —     | ✅    |
| `DELETE /admin/venues/:id`            | —      | —    | —     | ✅    |

\* Own resource only

---

## Related Documents

- [Product Requirements (PRD)](./PRD.md)
- [Database Design](./DBDesign.md)
- [System Design](./SystemDesign.md)
- [Folder Architecture](./FolderArchitecture.md)
- [Backend Setup](../backend/README.md)

---

**Last updated:** June 2026
