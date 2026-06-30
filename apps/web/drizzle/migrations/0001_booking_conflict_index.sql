-- Conflict-lookup index for the atomic conditional INSERT.
-- Lets the NOT-EXISTS subquery use an index scan instead of full-scanning bookings.
CREATE INDEX `bookings_conflict_lookup_idx`
  ON `bookings` (`venue_id`, `status`, `start_time`, `end_time`, `expires_at`);
