-- Registrations table for BITS Qiskit Fall Fest 2026
CREATE TABLE IF NOT EXISTS registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticket_id VARCHAR(32) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  study_level VARCHAR(100),
  graduation_year VARCHAR(20),
  attendance_mode VARCHAR(20) NOT NULL,
  quantum_experience VARCHAR(50) NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  linkedin_url TEXT,
  tshirt_size VARCHAR(50) NOT NULL,
  agreed_to_terms BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on lowercase email to enforce single registration per person
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_lower ON registrations (LOWER(email));

-- Index on ticket_id for fast pass lookup
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations (ticket_id);

-- Index on created_at for chronological ordering
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations (created_at DESC);
