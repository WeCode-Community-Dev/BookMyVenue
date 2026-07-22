# BookMyVenue Database Schema & Design Documentation

This document describes the database design, tables, data types, relationships, and integrity rules for the **BookMyVenue** application. The database is managed via **Prisma ORM** with **PostgreSQL** as the relational database engine.

---

## 1. Database Architecture & Design Strategy

The schema is normalized to **3rd Normal Form (3NF)** to minimize redundancy and prevent data anomalies. Key design decisions include:
- **UUID Primary Keys**: Every primary entity (User, Venue, Booking, Blocked Slot, Payment) uses a globally unique 128-bit UUID string. Profiles use `CUID` for secure public routing.
- **Relational Integrity (Cascading Deletions)**: Standard relations are bound with `onDelete: Cascade` rules. For example, if a `User` is deleted, their associated `Profile`, owned `Venue` records, and guest `Booking` records are automatically removed by the PostgreSQL engine.
- **Unified Enums**: Application state machines (e.g. Booking lifecycle, listing review, payment verification) are defined as database-level PostgreSQL enums to enforce data validity.

---

## 2. Enums (State Machines)

The schema defines several custom enumerations to enforce type constraints:

| Enum Name | Values | Description |
| :--- | :--- | :--- |
| **`Role`** | `USER`, `VENUE_OWNER`, `ADMIN` | Enforces client, host, and administrative access scopes. |
| **`VenueStatus`** | `PENDING_DOCUMENTS`, `PENDING`, `APPROVED`, `REJECTED` | Manages listing lifecycle during onboarding and review. |
| **`BookingStatus`** | `PENDING_OWNER_APPROVAL`, `PENDING_PAYMENT`, `CONFIRMED`, `REJECTED`, `CANCELLED_BY_USER`, `CANCELLED_BY_OWNER`, `PAYMENT_EXPIRED`, `COMPLETED` | Tracks booking transactions from creation to event completion. |
| **`PaymentStatus`** | `PENDING`, `SUCCESS`, `FAILED`, `EXPIRED`, `REFUNDED` | Matches gateway callback signatures and transaction states. |
| **`VenueDocumentType`**| `GOVERNMENT_ID`, `PROPERTY_DOCUMENT` | Legal paper taxonomy for host verification. |
| **`BlockType`** | `FULL_DAY`, `TIME_SLOT` | Indicates if a calendar block covers whole days or specific hours. |
| **`VenueCategory`** | `WEDDING`, `BIRTHDAY`, `CONFERENCE`, `SPORTS`, `PARTY`, `AUDITORIUM`, `RESORT`, `MEETING`, `OTHER` | Classifies space directories. |
| **`VenueAmenity`** | `WIFI`, `PARKING`, `AIR_CONDITIONING`, `CATERING`, `RESTROOM`, `SOUND_SYSTEM`, `PROJECTOR`, `STAGE`, `GENERATOR`, `OTHER` | Standard amenity catalog. |

---

## 3. Data Dictionary (Tables)

### 1. `User` Table
Main identity registry. Handles authentication variables, Google Social OAuth connections, and security OTP codes.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `uuid()` | Unique user identifier. |
| **`email`** | `String` | Unique, Index | - | Login credential email address. |
| **`passwordHash`** | `String` | Nullable | - | Hashed password string (null for OAuth-only users). |
| **`googleId`** | `String` | Unique, Nullable | - | Google account identifier for social logins. |
| **`role`** | `Role (Enum)` | Attribute | `USER` | Active account clearance level. |
| **`isEmailVerified`**| `Boolean` | Attribute | `false` | Email check status. |
| **`emailVerifyOtp`** | `String` | Nullable | - | Active verification OTP code. |
| **`emailVerifyExpiry`**| `DateTime` | Nullable | - | Expiration timestamp of verification code. |
| **`forgotPasswordOtp`**| `String` | Nullable | - | Reset password OTP token. |
| **`forgotPasswordOtpExpiry`**| `DateTime`| Nullable| -| Expiration of reset token. |
| **`createdAt`** | `DateTime` | Attribute | `now()` | Registration timestamp. |
| **`updatedAt`** | `DateTime` | Attribute | `updatedAt` | Automatic update timestamp. |

---

### 2. `Profile` Table
Biographical details associated with individual users.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `cuid()` | Secure identifier. |
| **`userId`** | `String` | FK, Unique, Index| - | Links to `User.id` (1:1 relationship, Cascade Delete). |
| **`name`** | `String` | Attribute | - | Full name or handle of user. |
| **`profilePicture`** | `String` | Nullable | - | Relative path to profile picture. |
| **`phoneNumber`** | `String` | Nullable | - | Mobile contact string. |
| **`dateOfBirth`** | `DateTime` | Nullable | - | User birthday. |
| **`gender`** | `String` | Nullable | - | Gender identity. |
| **`biography`** | `String` | Nullable | - | Short host or client bio description. |
| **`address`** | `String` | Nullable | - | Physical billing/street address. |
| **`city`** | `String` | Nullable | - | Residential city. |
| **`state`** | `String` | Nullable | - | Residential state. |
| **`country`** | `String` | Nullable | - | Residential country. |

---

### 3. `Venue` Table
Details of listed spaces registered by Hosts.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `uuid()` | Unique venue identifier. |
| **`name`** | `String` | Attribute | - | Venue title (e.g. Rose Banquet). |
| **`description`** | `String` | Nullable | - | Rich text description of space. |
| **`city`** | `String` | Index | - | Destination city. |
| **`address`** | `String` | Attribute | - | Full location coordinates address. |
| **`latitude`** | `Float` | Nullable | - | Latitude float for map positioning. |
| **`longitude`** | `Float` | Nullable | - | Longitude float for map positioning. |
| **`capacity`** | `Int` | Nullable | - | Max attendee capability. |
| **`price`** | `Float` | Nullable | - | Hourly/Daily starting price in INR. |
| **`bookingApprovalRequired`** | `Boolean` | Attribute | `false` | Toggles whether host approval is needed before payments. |
| **`categories`** | `VenueCategory[]`| Array | - | Space category tags (Wedding, Resort etc.). |
| **`amenities`** | `VenueAmenity[]` | Array | - | Amenities provided (WiFi, Parking etc.). |
| **`status`** | `VenueStatus`| Attribute | `PENDING_DOCUMENTS` | Approvals directory index state. |
| **`rejectionReason`**| `String` | Nullable | - | Admin rejection rationale notes. |
| **`ownerId`** | `String` | FK, Index | - | Links to `User.id` (Many:1 relationship, Cascade Delete). |

---

### 4. `VenueImage` Table
Supports a gallery of high-resolution preview photos for individual venue spaces.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `uuid()` | Image registry ID. |
| **`imageUrl`** | `String` | Attribute | - | Path string to target stored asset. |
| **`venueId`** | `String` | FK, Index | - | Links to `Venue.id` (Many:1 relationship, Cascade Delete). |

---

### 5. `VenueDocument` Table
Deeds and ID credentials uploaded by owners during host onboarding verification.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `uuid()` | Document tracker ID. |
| **`type`** | `VenueDocumentType`| Attribute | - | Taxonomy (e.g. GOVERNMENT_ID). |
| **`documentUrl`** | `String` | Attribute | - | Path string to target uploaded file. |
| **`venueId`** | `String` | FK, Index | - | Links to `Venue.id` (Many:1 relationship, Cascade Delete). |

---

### 6. `VenueBlockedSlot` Table
Custom exceptions created by owners to prevent public booking allocations.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `uuid()` | Unique slot exception ID. |
| **`venueId`** | `String` | FK, Index | - | Links to `Venue.id` (Many:1 relationship, Cascade Delete). |
| **`blockType`** | `BlockType` | Attribute | - | Day or custom hour range block. |
| **`startDate`** | `DateTime` | Attribute | - | Excluded calendar start boundary. |
| **`endDate`** | `DateTime` | Attribute | - | Excluded calendar end boundary. |
| **`reason`** | `String` | Nullable | - | Owner notes (e.g. Maintenance). |

---

### 7. `Booking` Table
Tracks user event bookings and reservations.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `uuid()` | Transaction identifier. |
| **`venueId`** | `String` | FK, Index | - | Links to `Venue.id` (Many:1, Cascade Delete). |
| **`userId`** | `String` | FK, Index | - | Links to `User.id` (Guest guest, Cascade Delete). |
| **`eventStart`** | `DateTime` | Attribute | - | Event setup start date/time. |
| **`eventEnd`** | `DateTime` | Attribute | - | Event tear-down end date/time. |
| **`eventName`** | `String` | Attribute | - | Brief title of reservation. |
| **`guestCount`** | `Int` | Attribute | - | Expected attendees size. |
| **`specialRequests`**| `String` | Nullable | - | Attendee custom requirements. |
| **`totalAmount`** | `Float` | Attribute | - | Computed base billing total. |
| **`status`** | `BookingStatus` | Attribute | `PENDING_OWNER_APPROVAL`| Transaction lifecycle progress. |
| **`paymentStatus`** | `PaymentStatus` | Attribute | `PENDING` | Billing ledger review index. |
| **`paymentExpiresAt`**| `DateTime` | Nullable | - | Payment window timeout boundary. |
| **`cancellationReason`**| `String`| Nullable | - | Cancellation reasoning. |

---

### 8. `Payment` Table
Razorpay Sim ledger transactions linked to confirmed event bookings.

| Column Name | Data Type | Key / Attribute | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | PK | `uuid()` | Ledger transaction ID. |
| **`bookingId`** | `String` | FK, Unique, Index| - | Links to `Booking.id` (1:1, Cascade Delete). |
| **`razorpayOrderId`**| `String` | Unique, Nullable| - | Order ID from payment gateway. |
| **`razorpayPaymentId`**| `String`| Unique, Nullable| - | Transaction ID from gateway. |
| **`razorpaySignature`**| `String`| Nullable | - | Verification callback signature. |
| **`amount`** | `Float` | Attribute | - | Verified transaction total. |
| **`status`** | `PaymentStatus` | Attribute | `PENDING` | Status ledger state. |
