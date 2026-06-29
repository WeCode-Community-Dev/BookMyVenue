-- ============================================================
-- BookMyVenue — Facilities Seed
-- ============================================================
-- Run ONCE after database creation:
--   psql -d bookmyvenue -f src/db/seeds/facilities.sql
--
-- Safe to re-run — ON CONFLICT DO NOTHING prevents duplicates.
-- ============================================================

INSERT INTO facilities (id, name, icon, created_at) VALUES
  (gen_random_uuid(), 'AC',                'snowflake',     NOW()),
  (gen_random_uuid(), 'WiFi',              'wifi',          NOW()),
  (gen_random_uuid(), 'Generator Backup',  'zap',           NOW()),
  (gen_random_uuid(), 'Stage',             'theater',       NOW()),
  (gen_random_uuid(), 'Projector',         'monitor',       NOW()),
  (gen_random_uuid(), 'Catering',          'utensils',      NOW()),
  (gen_random_uuid(), 'Sound System',      'speaker',       NOW()),
  (gen_random_uuid(), 'Bridal Room',       'heart',         NOW()),
  (gen_random_uuid(), 'Accommodation',     'bed',           NOW()),
  (gen_random_uuid(), 'Wheelchair Access', 'accessibility', NOW())
ON CONFLICT (name) DO NOTHING;
