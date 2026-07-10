CREATE TABLE venue_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL,
    image_url TEXT NOT NULL,

    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);