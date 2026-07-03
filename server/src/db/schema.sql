CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,

  role VARCHAR(20) NOT NULL CHECK (
    role IN ('customer', 'owner', 'root_admin')
  ),

  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'pending', 'rejected', 'blocked')
  ),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venues (
  id SERIAL PRIMARY KEY,

  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (
    category IN (
      'auditorium',
      'open_space',
      'cafe_space',
      'banquet_hall',
      'meeting_hall',
      'conference_hall',
      'rooftop',
      'studio',
      'outdoor_event_space'
    )
  ),

  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    approval_status IN ('pending', 'approved', 'rejected')
  ),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venue_documents (
  id SERIAL PRIMARY KEY,

  venue_id INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  document_type VARCHAR(50) NOT NULL CHECK (
    document_type IN (
      'owner_id_proof',
      'ownership_proof',
      'business_registration'
    )
  ),

  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,

  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE venues
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE venues
ADD COLUMN IF NOT EXISTS reviewed_by INTEGER REFERENCES users(id);

ALTER TABLE venues
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

