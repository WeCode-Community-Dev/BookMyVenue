CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS venues (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id      UUID NOT NULL,
    name          TEXT NOT NULL,
    description   TEXT,
    location      TEXT NOT NULL,
    capacity      INT  NOT NULL CHECK (capacity > 0),
    price_per_hour NUMERIC(10, 2) NOT NULL CHECK (price_per_hour >= 0),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_venues_owner_id ON venues(owner_id);
