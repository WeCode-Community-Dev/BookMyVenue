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