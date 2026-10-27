DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'registrations'
  ) THEN
    CREATE TABLE registrations (
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
      referral_code VARCHAR(20) UNIQUE,
      referred_by VARCHAR(20),
      referral_count INTEGER NOT NULL DEFAULT 0,
      agreed_to_terms BOOLEAN NOT NULL DEFAULT TRUE,
      willing_to_be_poc BOOLEAN NOT NULL DEFAULT FALSE,
      status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  END IF;
END $$;

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS referred_by VARCHAR(20),
  ADD COLUMN IF NOT EXISTS referral_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS willing_to_be_poc BOOLEAN NOT NULL DEFAULT FALSE;

-- Index on lowercase email to enforce single registration per person
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_lower ON registrations (LOWER(email));

-- Index on referral_code for shareable referral lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_referral_code ON registrations (referral_code);

-- Index on ticket_id for fast pass lookup
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations (ticket_id);

-- Index on created_at for chronological ordering
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations (created_at DESC);

-- ---------------------------------------------------------------------------
-- Hackathon teams.
--
-- A team is a group of 1-4 people who already hold a fest registration, so
-- there is no separate teams table: each member's row carries the team code
-- and whether they lead it. NULL team_id means "not in the hackathon".
-- ---------------------------------------------------------------------------
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS team_id VARCHAR(20),
  ADD COLUMN IF NOT EXISTS is_team_leader BOOLEAN NOT NULL DEFAULT FALSE;

-- Lists a team's members.
CREATE INDEX IF NOT EXISTS idx_registrations_team_id ON registrations (team_id);

-- Exactly one leader per team: the database refuses a second one.
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_team_leader
  ON registrations (team_id) WHERE is_team_leader;

-- The team itself: one row per team code, holding what belongs to the team as
-- a whole rather than to any one member. A team enters one or more tracks and
-- keeps the same code for all of them; tracks can be added later, never
-- silently dropped. The allowed values match `hackathon.tracks` in
-- src/data/event.ts.
CREATE TABLE IF NOT EXISTS hackathon_teams (
  team_id    VARCHAR(20) PRIMARY KEY,
  tracks     TEXT[] NOT NULL
             CHECK (cardinality(tracks) >= 1
                    AND tracks <@ ARRAY['beginner', 'advanced']::TEXT[]),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Existing databases: merge Rookie and Novice into Beginner without losing
-- teams or their Advanced entry. Keep the constraint change and data update
-- atomic; the block is also safe to run again via npm run db:init.
DO $$
BEGIN
  ALTER TABLE hackathon_teams
    DROP CONSTRAINT IF EXISTS hackathon_teams_tracks_check;

  UPDATE hackathon_teams
  SET tracks = ARRAY(
        SELECT DISTINCT CASE
          WHEN track IN ('rookie', 'novice') THEN 'beginner'
          ELSE track
        END
        FROM unnest(tracks) AS track
      ),
      updated_at = NOW()
  WHERE tracks && ARRAY['rookie', 'novice']::TEXT[];

  ALTER TABLE hackathon_teams
    ADD CONSTRAINT hackathon_teams_tracks_check
    CHECK (cardinality(tracks) >= 1
           AND tracks <@ ARRAY['beginner', 'advanced']::TEXT[]);
END $$;

-- "Which teams entered Advanced?" — answers from the index, not a scan.
CREATE INDEX IF NOT EXISTS idx_hackathon_teams_tracks ON hackathon_teams USING GIN (tracks);

-- ---------------------------------------------------------------------------
-- Rate limiting counters.
--
-- One row per (bucket, window). Kept in Postgres rather than in process memory
-- because serverless instances do not share memory, so an in-memory counter
-- would reset on every cold start and never actually limit anything.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rate_limit_hits (
  bucket       TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  hits         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);

-- Supports the periodic sweep of expired windows.
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_hits (window_start);
