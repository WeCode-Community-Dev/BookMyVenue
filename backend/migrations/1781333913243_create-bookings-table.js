// Remove all the "export const" lines and use this:
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE bookings (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
        start_datetime TIMESTAMPTZ NOT NULL,
        end_datetime TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total_price NUMERIC(10,2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (end_datetime > start_datetime)
        );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE bookings;`);
};
