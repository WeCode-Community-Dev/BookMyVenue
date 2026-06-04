CREATE TYPE venue_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    category VARCHAR(255) NOT NULL,

    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20),

    capacity INTEGER,

    price_per_hour DECIMAL(10, 2) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,

    status venue_status NOT NULL DEFAULT 'pending',

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);