# BookMyVenue — Data Model (ERD)

Single `users` table with a `role` enum (`user` | `owner` | `admin`).

```
users
  id              PK
  email           unique
  name
  password_hash   nullable (null for Google sign-in)
  role            enum(user, owner, admin)
  google_sub      nullable, unique
  created_at
  updated_at

owner_profiles                     1:1 -> users (only for owners)
  id              PK
  user_id         FK -> users.id, unique
  business_name
  contact_phone   nullable
  payout_info     nullable
  created_at
  updated_at

venues
  id              PK
  owner_id        FK -> users.id
  name
  type            enum(birthday_hall, cafe, hotel, resort, auditorium,
                       meetup, mall, other)
  description     nullable
  address
  lat             nullable
  lng             nullable
  price_per_hour
  capacity
  photos          JSON array
  amenities       JSON array
  status          enum(pending, approved, rejected)
  created_at
  updated_at

bookings
  id              PK
  user_id         FK -> users.id
  venue_id        FK -> venues.id
  start_at
  end_at
  status          enum(pending, confirmed, declined, cancelled, completed)
  total_price
  created_at
  updated_at

payments                           1:1 -> bookings
  id              PK
  booking_id      FK -> bookings.id, unique
  amount
  status          enum(mock_success, mock_refunded, failed)
  provider_txn_id string (fake UUID for MVP)
  created_at
  updated_at
```

## Booking state machine

```
            ┌── confirmed ──► completed
pending ────┤
            ├── declined
            └── cancelled (by user)  ->  payment mock_refunded
```

- Payment record is created when a booking moves to `confirmed`.
- On `cancelled`, the linked payment is flipped to `mock_refunded`.
