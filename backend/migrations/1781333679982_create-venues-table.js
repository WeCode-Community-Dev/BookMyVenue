// Remove all the "export const" lines and use this:
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE venues (
        id BIGSERIAL PRIMARY KEY,
        owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        city TEXT NOT NULL,
        address TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        price_per_hour NUMERIC(10,2) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE venues;`);
};
