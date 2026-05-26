# 🗄️ Database Design (PostgreSQL)

## Project: BookMyVenue (MVP)


## 1. 🧑 Users Table

Stores all users (normal, owner, admin)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'owner', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. 🏢 Venues Table

Each venue belongs to an owner

```sql
CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price_per_day NUMERIC(10,2) NOT NULL,
    description TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. 🖼️ Venue Images Table

One venue → multiple images

```sql
CREATE TABLE venue_images (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);
```

## 4. 🧾 Bookings Table

Core feature of your app

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    unique_booking UNIQUE (venue_id, booking_date),
    booking_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'booked' 
        CHECK (status IN ('booked', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. 🧩 Amenities Table

List of all possible amenities

```sql
CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
```

## 6. 🔗 Venue Amenities (Many-to-Many)

One venue → many amenities

```sql
CREATE TABLE venue_amenities (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE
);
```

## 7. 🧑‍💼 Owner Profile (Optional but clean)

Separate owner-specific data

```sql
CREATE TABLE owner_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(150),
    phone VARCHAR(20)
);
```


# 🔗 Relationships (Understand This Clearly)

* One **user (owner)** → many venues
* One **venue** → many images
* One **venue** → many bookings
* One **user** → many bookings
* Many-to-many:

  * venues ↔ amenities

