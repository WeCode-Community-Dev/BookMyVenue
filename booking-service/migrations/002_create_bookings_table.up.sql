CREATE TABLE IF NOT EXISTS bookings (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL,
    venue_id   UUID NOT NULL REFERENCES venues(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time   TIMESTAMPTZ NOT NULL,
    status     TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT bookings_end_after_start CHECK (end_time > start_time)
);

CREATE INDEX idx_bookings_user_id  ON bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON bookings(venue_id);
