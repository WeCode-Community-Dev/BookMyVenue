-- Drop tables if they exist to perform a clean setup
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable btree_gist extension for GiST exclusion constraints on scalar types
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'venue_owner', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Venues Table
CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    full_address TEXT NOT NULL,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    square_feet INTEGER NOT NULL CHECK (square_feet > 0),
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
    host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    host_type VARCHAR(100) DEFAULT 'Superhost',
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    is_top_rated BOOLEAN DEFAULT FALSE,
    date_range VARCHAR(100) DEFAULT 'Available',
    parking TEXT,
    catering TEXT,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    rules TEXT[] DEFAULT '{}',
    event_types TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    rejection_reason TEXT,
    booking_type VARCHAR(50) DEFAULT 'days' CHECK (booking_type IN ('days', 'hours')),
    cleaning_gap INTEGER DEFAULT 0 CHECK (cleaning_gap >= 0),
    opening_time VARCHAR(5) DEFAULT '08:00',
    closing_time VARCHAR(5) DEFAULT '22:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on venues.status for faster discovery
CREATE INDEX idx_venues_status ON venues(status);
-- Create index on venues.host_id for host dashboard queries
CREATE INDEX idx_venues_host_id ON venues(host_id);

-- 3. Create Bookings Table
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Null for offline locks
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    blocked_end_date TIMESTAMP NOT NULL, -- end_date + cleaning_gap (or end_date if daily)
    cleaning_gap INTEGER DEFAULT 0 CHECK (cleaning_gap >= 0),
    guests INTEGER DEFAULT 0 CHECK (guests >= 0),
    total_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (total_price >= 0),
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'cancelled', 'offline')),
    payment_status VARCHAR(50) DEFAULT 'paid' CHECK (payment_status IN ('paid', 'refunded', 'offline')),
    booking_date DATE DEFAULT CURRENT_DATE,
    check_in_instructions TEXT,
    renter_name VARCHAR(255),
    renter_phone VARCHAR(50),
    renter_email VARCHAR(255),
    booking_type VARCHAR(50) DEFAULT 'days' CHECK (booking_type IN ('days', 'hours')),
    refund_amount NUMERIC(10, 2) DEFAULT 0.00 CHECK (refund_amount >= 0),
    refund_percentage INTEGER DEFAULT 0 CHECK (refund_percentage >= 0 AND refund_percentage <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_blocked_end CHECK (blocked_end_date >= end_date),
    CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (
        venue_id WITH =,
        tsrange(start_date, blocked_end_date, '[)') WITH &&
    ) WHERE (status != 'cancelled')
);

-- Create indexes on bookings to speed up conflict checking and searches
CREATE INDEX idx_bookings_venue_dates ON bookings(venue_id, start_date, end_date) WHERE status != 'cancelled';
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
