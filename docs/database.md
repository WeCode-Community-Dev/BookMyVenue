# Database Schema

## Overview

The database is designed for the **BookMyVenue** platform, which supports three types of users:

* **User** – Browse and book venues.
* **Venue Owner** – Create and manage venues.
* **Admin** – Review and approve venue listings.

---

## Extensions

### `uuid-ossp`

The `uuid-ossp` extension is used to automatically generate UUIDs for primary keys.

---

## Enums

### `venue_status`

Represents the approval status of a venue.

| Value      | Description                   |
| ---------- | ----------------------------- |
| `pending`  | Waiting for admin approval    |
| `approved` | Approved and visible to users |
| `rejected` | Rejected by an administrator  |

---

# Tables

## users

Stores all registered users.

| Column     | Type      | Constraints                                | Description            |
| ---------- | --------- | ------------------------------------------ | ---------------------- |
| id         | UUID      | Primary Key, Default `uuid_generate_v4()`  | Unique user identifier |
| name       | TEXT      | NOT NULL                                   | User's full name       |
| email      | TEXT      | UNIQUE, NOT NULL                           | User email address     |
| password   | TEXT      | NOT NULL                                   | Hashed password        |
| role       | TEXT      | NOT NULL, CHECK (`user`, `owner`, `admin`) | User role              |
| created_at | TIMESTAMP | DEFAULT `NOW()`                            | Account creation time  |
| updated_at | TIMESTAMP | DEFAULT `NOW()`                            | Last update time       |

### Relationships

* One user can own multiple venues.
* One user can create multiple bookings.

---

## venues

Stores venue information created by venue owners.

| Column         | Type             | Constraints                               | Description             |
| -------------- | ---------------- | ----------------------------------------- | ----------------------- |
| id             | UUID             | Primary Key, Default `uuid_generate_v4()` | Unique venue identifier |
| owner_id       | UUID             | Foreign Key → `users(id)`                 | Venue owner             |
| name           | VARCHAR(255)     | NOT NULL                                  | Venue name              |
| description    | TEXT             |                                           | Venue description       |
| category       | VARCHAR(255)     | NOT NULL                                  | Venue category          |
| address        | TEXT             | NOT NULL                                  | Venue address           |
| city           | VARCHAR(100)     | NOT NULL                                  | Venue city              |
| state          | VARCHAR(100)     | NOT NULL                                  | Venue state             |
| pincode        | VARCHAR(20)      |                                           | Postal code             |
| location       | TEXT             | NOT NULL                                  | Searchable location     |
| capacity       | INTEGER          |                                           | Maximum guest capacity  |
| price_per_hour | DOUBLE PRECISION | NOT NULL                                  | Hourly booking price    |
| price_per_day  | DOUBLE PRECISION | NOT NULL                                  | Daily booking price     |
| status         | `venue_status`   | DEFAULT `pending`                         | Venue approval status   |
| created_at     | TIMESTAMP        | DEFAULT `NOW()`                           | Creation time           |
| updated_at     | TIMESTAMP        | DEFAULT `NOW()`                           | Last update time        |

### Relationships

* One user can own many venues.
* One venue can have multiple images.
* One venue can have multiple amenities.
* One venue can have multiple availability slots.
* One venue can have multiple bookings.

---

## venue_images

Stores images uploaded for a venue.

| Column    | Type | Constraints                               | Description             |
| --------- | ---- | ----------------------------------------- | ----------------------- |
| id        | UUID | Primary Key, Default `uuid_generate_v4()` | Unique image identifier |
| venue_id  | UUID | Foreign Key → `venues(id)`                | Associated venue        |
| image_url | TEXT | NOT NULL                                  | Image URL or file path  |

### Relationships

* One venue can have multiple images.

### Cascade Behavior

Deleting a venue automatically removes all associated images.

---

## amenities

Stores the master list of amenities.

Examples:

* Wi-Fi
* Parking
* Air Conditioning
* Projector

| Column | Type         | Constraints                               | Description               |
| ------ | ------------ | ----------------------------------------- | ------------------------- |
| id     | UUID         | Primary Key, Default `uuid_generate_v4()` | Unique amenity identifier |
| name   | VARCHAR(100) | UNIQUE, NOT NULL                          | Amenity name              |

### Relationships

* One amenity can belong to multiple venues.

---

## venue_amenities

Junction table representing the many-to-many relationship between venues and amenities.

| Column     | Type | Constraints                                | Description        |
| ---------- | ---- | ------------------------------------------ | ------------------ |
| venue_id   | UUID | Primary Key, Foreign Key → `venues(id)`    | Associated venue   |
| amenity_id | UUID | Primary Key, Foreign Key → `amenities(id)` | Associated amenity |

### Primary Key

Composite Primary Key:

```text
(venue_id, amenity_id)
```

This prevents assigning the same amenity to the same venue more than once.

### Relationships

* One venue can have many amenities.
* One amenity can belong to many venues.

### Cascade Behavior

Deleting either a venue or an amenity automatically removes the corresponding records.

---

## availability

Stores available booking slots for venues.

| Column     | Type      | Constraints                               | Description                |
| ---------- | --------- | ----------------------------------------- | -------------------------- |
| id         | UUID      | Primary Key, Default `uuid_generate_v4()` | Unique slot identifier     |
| venue_id   | UUID      | Foreign Key → `venues(id)`                | Associated venue           |
| start_time | TIMESTAMP | NOT NULL                                  | Slot start time            |
| end_time   | TIMESTAMP | NOT NULL                                  | Slot end time              |
| is_booked  | BOOLEAN   | DEFAULT `FALSE`                           | Booking status of the slot |

### Relationships

* One venue can have multiple availability slots.
* One availability slot can be linked to one booking.

### Cascade Behavior

Deleting a venue automatically removes all associated availability slots.

---

## bookings

Stores booking information.

| Column       | Type          | Constraints                                                    | Description               |
| ------------ | ------------- | -------------------------------------------------------------- | ------------------------- |
| id           | UUID          | Primary Key, Default `uuid_generate_v4()`                      | Unique booking identifier |
| user_id      | UUID          | Foreign Key → `users(id)`                                      | User who booked the venue |
| venue_id     | UUID          | Foreign Key → `venues(id)`                                     | Booked venue              |
| slot_id      | UUID          | Foreign Key → `availability(id)`                               | Reserved slot             |
| status       | TEXT          | DEFAULT `pending`, CHECK (`pending`, `confirmed`, `cancelled`) | Booking status            |
| total_amount | NUMERIC(10,2) | NOT NULL                                                       | Total booking amount      |
| created_at   | TIMESTAMP     | DEFAULT `NOW()`                                                | Booking creation time     |
| updated_at   | TIMESTAMP     | DEFAULT `NOW()`                                                | Last update time          |

### Relationships

* One user can create many bookings.
* One venue can have many bookings.
* Each booking references one availability slot.

### Cascade Behavior

Deleting the associated user, venue, or availability slot automatically removes the booking.

---

# Entity Relationships

```text
users
 ├── owns ───────────────► venues
 │                           ├── venue_images
 │                           ├── availability
 │                           ├── bookings
 │                           └── venue_amenities ◄──── amenities
 │
 └── creates ────────────► bookings
                                 │
                                 ▼
                           availability
```

---

# Cascade Delete Summary

| Parent Table | Child Table     | Action  |
| ------------ | --------------- | ------- |
| users        | venues          | CASCADE |
| users        | bookings        | CASCADE |
| venues       | venue_images    | CASCADE |
| venues       | availability    | CASCADE |
| venues       | venue_amenities | CASCADE |
| venues       | bookings        | CASCADE |
| amenities    | venue_amenities | CASCADE |
| availability | bookings        | CASCADE |
