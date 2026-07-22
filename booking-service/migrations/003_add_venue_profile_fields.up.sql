ALTER TABLE venues
  ADD COLUMN city          TEXT,
  ADD COLUMN category      TEXT,
  ADD COLUMN images        JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN amenities     JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN highlights    JSONB DEFAULT '[]'::jsonb;
