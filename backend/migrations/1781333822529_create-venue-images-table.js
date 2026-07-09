// Remove all the "export const" lines and use this:
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE venue_images (
        id BIGSERIAL PRIMARY KEY,
        venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        is_cover BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE venue_images;`);
};
