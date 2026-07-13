ALTER TABLE booking
    ADD COLUMN guest_count INTEGER NOT NULL DEFAULT 1;

COMMENT ON COLUMN booking.guest_count IS
'Number of guests for the booking. Must not exceed venue capacity.';