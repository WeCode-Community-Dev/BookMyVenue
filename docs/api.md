# API Documentation

## Base URL

```
/api/v1
```

---

# Authentication

Authentication is performed using a JWT access token.

Protected endpoints require an HTTP-only cookie containing the access token:

```http
Cookie: access_token=<access_token>
```

---

# Roles

| Role    | Description                       |
| ------- | --------------------------------- |
| `user`  | Browse venues and make bookings   |
| `owner` | Manage venues and availability    |
| `admin` | Review and approve venue listings |

---

# Authentication APIs

## Register

**POST** `/auth/register`

Registers a new user.

### Authentication

None

---

## Login

**POST** `/auth/login`

Authenticates a user and returns an access token.

### Authentication

None

---

## Logout

**POST** `/auth/logout`

Logs out the current user.

### Authentication

None

---

# Venue Owner APIs

Requires **Owner** role.

---

## Add Venue

**POST** `/owner/addVenue`

Creates a new venue.

**Authentication**

* JWT Required
* Role: `owner`

---

## Upload Venue Images

**POST** `/owner/:id/images`

Uploads one or more images for a venue.

**Authentication**

* JWT Required
* Role: `owner`

---

## View Pending Venues

**GET** `/owner/viewPendingVenues`

Returns all pending venues owned by the authenticated owner.

**Authentication**

* JWT Required
* Role: `owner`

---

## View Approved Venues

**GET** `/owner/viewApprovedVenues`

Returns all approved venues owned by the authenticated owner.

**Authentication**

* JWT Required
* Role: `owner`

---

## View Rejected Venues

**GET** `/owner/viewRejectedVenues`

Returns all rejected venues owned by the authenticated owner.

**Authentication**

* JWT Required
* Role: `owner`

---

# Admin APIs

Requires **Admin** role.

---

## View Pending Venues

**GET** `/admin/viewPendingVenues`

Returns all venues awaiting approval.

**Authentication**

* JWT Required
* Role: `admin`

---

## Approve Venue

**PUT** `/admin/approveVenue/:id`

Approves a pending venue.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Venue ID    |

**Authentication**

* JWT Required
* Role: `admin`

---

## Reject Venue

**PUT** `/admin/rejectVenue/:id`

Rejects a venue.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Venue ID    |

**Authentication**

* JWT Required
* Role: `admin`

---

## View Approved Venues

**GET** `/admin/viewApprovedVenues`

Returns all approved venues.

**Authentication**

* JWT Required
* Role: `admin`

---

## View Rejected Venues

**GET** `/admin/viewRejectedVenues`

Returns all rejected venues.

**Authentication**

* JWT Required
* Role: `admin`

---

# User APIs

Requires **User** role.

---

## View Venues

**GET** `/user/venues`

Returns all approved venues available for booking.

**Authentication**

* JWT Required
* Role: `user`

---

## View Venue Details

**GET** `/user/venue/:venue_id`

Returns detailed information about a specific venue.

### Path Parameters

| Parameter  | Description |
| ---------- | ----------- |
| `venue_id` | Venue ID    |

**Authentication**

* JWT Required
* Role: `user`

---

## View Booked Venues

**GET** `/user/viewBookedVenues`

Returns all bookings made by the authenticated user.

**Authentication**

* JWT Required
* Role: `user`

---

# Availability APIs

---

## View Available Slots

**GET** `/venues/:id/availability`

Returns all availability slots for a venue.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Venue ID    |

**Authentication**

* JWT Required
* Roles: `owner`, `user`

---

## Create Availability Slot

**POST** `/venues/:id/availability`

Creates a new availability slot for a venue.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Venue ID    |

**Authentication**

* JWT Required
* Role: `owner`

---

## Delete Availability Slot

**DELETE** `/venues/:venue_id/availability/:slot_id`

Deletes an availability slot.

### Path Parameters

| Parameter  | Description          |
| ---------- | -------------------- |
| `venue_id` | Venue ID             |
| `slot_id`  | Availability Slot ID |

**Authentication**

* JWT Required
* Role: `owner`

---

## Get Slot Details

**GET** `/slot/:slot_id`

Returns information for a single availability slot.

### Path Parameters

| Parameter | Description          |
| --------- | -------------------- |
| `slot_id` | Availability Slot ID |

**Authentication**

* JWT Required
* Role: `user`

---

# Booking APIs

---

## Book Slot

**GET** `/slot/:slot_id/book`

Creates a pending booking for a slot.

### Path Parameters

| Parameter | Description          |
| --------- | -------------------- |
| `slot_id` | Availability Slot ID |

**Authentication**

* JWT Required
* Role: `user`

---

## Confirm Booking

**POST** `/slot/:slot_id/bookings/:booking_id/confirm`

Confirms a booking after successful payment.

### Path Parameters

| Parameter    | Description          |
| ------------ | -------------------- |
| `slot_id`    | Availability Slot ID |
| `booking_id` | Booking ID           |

**Authentication**

* JWT Required
* Role: `user`

---

## Cancel Booking

**PUT** `/booking/:booking_id`

Cancels an existing booking.

### Path Parameters

| Parameter    | Description |
| ------------ | ----------- |
| `booking_id` | Booking ID  |

**Authentication**

* JWT Required
* Role: `user`

---

# API Summary

| Method | Endpoint                                      | Role        |
| ------ | --------------------------------------------- | ----------- |
| POST   | `/auth/register`                              | Public      |
| POST   | `/auth/login`                                 | Public      |
| POST   | `/auth/logout`                                | Public      |
| POST   | `/owner/addVenue`                             | Owner       |
| POST   | `/owner/:id/images`                           | Owner       |
| GET    | `/owner/viewPendingVenues`                    | Owner       |
| GET    | `/owner/viewApprovedVenues`                   | Owner       |
| GET    | `/owner/viewRejectedVenues`                   | Owner       |
| GET    | `/admin/viewPendingVenues`                    | Admin       |
| PUT    | `/admin/approveVenue/:id`                     | Admin       |
| PUT    | `/admin/rejectVenue/:id`                      | Admin       |
| GET    | `/admin/viewApprovedVenues`                   | Admin       |
| GET    | `/admin/viewRejectedVenues`                   | Admin       |
| GET    | `/user/venues`                                | User        |
| GET    | `/user/venue/:venue_id`                       | User        |
| GET    | `/user/viewBookedVenues`                      | User        |
| GET    | `/venues/:id/availability`                    | Owner, User |
| POST   | `/venues/:id/availability`                    | Owner       |
| DELETE | `/venues/:venue_id/availability/:slot_id`     | Owner       |
| GET    | `/slot/:slot_id`                              | User        |
| GET    | `/slot/:slot_id/book`                         | User        |
| POST   | `/slot/:slot_id/bookings/:booking_id/confirm` | User        |
| PUT    | `/booking/:booking_id`                        | User        |

---

# Standard Response Format

Successful responses follow the general structure:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Error responses follow the general structure:

```json
{
  "success": false,
  "message": "Request failed.",
  "error": "Detailed error message"
}
```
