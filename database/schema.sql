-- ============================================================
-- DIGITAL LABOUR CHOWK
-- PostgreSQL Complete Database Schema
-- Version  : 1.0.0
-- Database : PostgreSQL 16+
-- Encoding : UTF-8
-- Timezone : Asia/Kolkata
-- ============================================================
-- Run order:
--   1. schema.sql   ← this file (DDL only)
--   2. seed.sql     ← sample data
--
-- psql usage:
--   psql -U dlc_user -d digital_labour_chowk -f schema.sql
-- ============================================================

-- ============================================================
-- BOOTSTRAP
-- ============================================================

-- Abort on first error so a partial apply is never silent
\set ON_ERROR_STOP on

-- Extensions required
CREATE EXTENSION IF NOT EXISTS "pgcrypto";          -- gen_random_uuid(), crypt()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";           -- trigram indexes for ILIKE
CREATE EXTENSION IF NOT EXISTS "btree_gin";         -- GIN indexes on composite cols
CREATE EXTENSION IF NOT EXISTS "unaccent";          -- accent-insensitive search

-- Session timezone
SET timezone = 'Asia/Kolkata';

-- ============================================================
-- HELPER FUNCTION: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================
-- HELPER FUNCTION: generate cuid-style id
-- Uses gen_random_uuid stripped of hyphens + prefix 'c'
-- ============================================================
CREATE OR REPLACE FUNCTION generate_cuid()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'c' || replace(gen_random_uuid()::text, '-', '');
$$;

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'WORKER',
    'CONTRACTOR',
    'COMPANY_ADMIN',
    'SUPER_ADMIN'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING_VERIFICATION',
    'BANNED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE gender AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER',
    'PREFER_NOT_TO_SAY'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_type AS ENUM (
    'AADHAR',
    'PAN',
    'DRIVING_LICENSE',
    'PASSPORT',
    'VOTER_ID',
    'WORK_PERMIT',
    'SKILL_CERTIFICATE',
    'EDUCATION_CERTIFICATE',
    'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'VERIFIED',
    'REJECTED',
    'EXPIRED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE skill_level AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
    'EXPERT'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE otp_purpose AS ENUM (
    'LOGIN',
    'REGISTER',
    'PASSWORD_RESET',
    'EMAIL_VERIFY',
    'PHONE_VERIFY'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLE: locations
-- (no FK deps — must be created first)
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id          TEXT            NOT NULL DEFAULT generate_cuid(),
  address     TEXT,
  landmark    TEXT,
  area        VARCHAR(120),
  city        VARCHAR(100)    NOT NULL,
  district    VARCHAR(100),
  state       VARCHAR(100)    NOT NULL,
  country     VARCHAR(80)     NOT NULL DEFAULT 'India',
  pincode     VARCHAR(10),
  latitude    NUMERIC(10, 8),
  longitude   NUMERIC(11, 8),
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT locations_pkey           PRIMARY KEY (id),
  CONSTRAINT locations_lat_range      CHECK (latitude  IS NULL OR (latitude  BETWEEN -90  AND  90)),
  CONSTRAINT locations_lon_range      CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
  CONSTRAINT locations_pincode_fmt    CHECK (pincode   IS NULL OR pincode ~ '^\d{6}$')
);

COMMENT ON TABLE  locations            IS 'Geographic locations referenced by workers, contractors and companies';
COMMENT ON COLUMN locations.latitude   IS 'WGS-84 latitude in decimal degrees';
COMMENT ON COLUMN locations.longitude  IS 'WGS-84 longitude in decimal degrees';
COMMENT ON COLUMN locations.pincode    IS 'Indian 6-digit PIN code';

CREATE INDEX IF NOT EXISTS idx_locations_city     ON locations (city);
CREATE INDEX IF NOT EXISTS idx_locations_state    ON locations (state);
CREATE INDEX IF NOT EXISTS idx_locations_pincode  ON locations (pincode);
CREATE INDEX IF NOT EXISTS idx_locations_geo      ON locations (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
-- Trigram index for partial city searches
CREATE INDEX IF NOT EXISTS idx_locations_city_trgm   ON locations USING gin (city gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_locations_state_trgm  ON locations USING gin (state gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id             TEXT        NOT NULL DEFAULT generate_cuid(),
  email          VARCHAR(255),
  phone          VARCHAR(20),
  password_hash  TEXT,
  first_name     VARCHAR(80)  NOT NULL,
  last_name      VARCHAR(80)  NOT NULL,
  role           user_role    NOT NULL,
  status         user_status  NOT NULL DEFAULT 'PENDING_VERIFICATION',
  avatar         TEXT,
  email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
  phone_verified BOOLEAN      NOT NULL DEFAULT FALSE,
  last_login_at  TIMESTAMPTZ,
  login_count    INTEGER      NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ,

  CONSTRAINT users_pkey              PRIMARY KEY (id),
  CONSTRAINT users_email_unique      UNIQUE (email),
  CONSTRAINT users_phone_unique      UNIQUE (phone),
  CONSTRAINT users_email_or_phone    CHECK  (email IS NOT NULL OR phone IS NOT NULL),
  CONSTRAINT users_login_count_nn    CHECK  (login_count >= 0),
  CONSTRAINT users_email_fmt         CHECK  (email IS NULL OR email ~* '^[^@]+@[^@]+\.[^@]+$'),
  CONSTRAINT users_phone_fmt         CHECK  (phone IS NULL OR phone ~ '^\+91[6-9][0-9]{9}$')
);

COMMENT ON TABLE  users               IS 'Core user accounts for all roles';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hash (cost 12). NULL for OTP-only users';
COMMENT ON COLUMN users.role          IS 'WORKER | CONTRACTOR | COMPANY_ADMIN | SUPER_ADMIN';
COMMENT ON COLUMN users.deleted_at    IS 'Soft-delete timestamp. NULL = active record';

CREATE INDEX IF NOT EXISTS idx_users_email      ON users (email)        WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_phone      ON users (phone)        WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_role       ON users (role)         WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_status     ON users (status)       WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users (deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);
-- Full name trigram search
CREATE INDEX IF NOT EXISTS idx_users_fname_trgm ON users USING gin (first_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_lname_trgm ON users USING gin (last_name  gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: companies
-- (FK → locations; no FK to users yet)
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id               TEXT          NOT NULL DEFAULT generate_cuid(),
  name             VARCHAR(200)  NOT NULL,
  slug             VARCHAR(220)  NOT NULL,
  registration_no  VARCHAR(50),
  gst_number       VARCHAR(20),
  pan_number       VARCHAR(12),
  email            VARCHAR(255),
  phone            VARCHAR(20),
  website          TEXT,
  description      TEXT,
  logo_url         TEXT,
  cover_url        TEXT,
  is_verified      BOOLEAN       NOT NULL DEFAULT FALSE,
  verified_at      TIMESTAMPTZ,
  employee_count   INTEGER,
  established_year SMALLINT,
  location_id      TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ,

  CONSTRAINT companies_pkey             PRIMARY KEY (id),
  CONSTRAINT companies_slug_unique      UNIQUE (slug),
  CONSTRAINT companies_reg_no_unique    UNIQUE (registration_no),
  CONSTRAINT companies_gst_unique       UNIQUE (gst_number),
  CONSTRAINT companies_pan_unique       UNIQUE (pan_number),
  CONSTRAINT companies_emp_count_pos    CHECK  (employee_count  IS NULL OR employee_count  > 0),
  CONSTRAINT companies_est_year_range   CHECK  (established_year IS NULL OR established_year BETWEEN 1900 AND EXTRACT(YEAR FROM NOW())::SMALLINT),
  CONSTRAINT companies_gst_fmt          CHECK  (gst_number IS NULL OR gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
  CONSTRAINT companies_pan_fmt          CHECK  (pan_number IS NULL OR pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
  CONSTRAINT companies_loc_fk           FOREIGN KEY (location_id)  REFERENCES locations (id) ON DELETE SET NULL
);

COMMENT ON TABLE  companies              IS 'Registered business entities on the platform';
COMMENT ON COLUMN companies.slug         IS 'URL-safe unique identifier derived from company name';
COMMENT ON COLUMN companies.gst_number   IS 'India GST identification number (15 chars)';

CREATE INDEX IF NOT EXISTS idx_companies_name        ON companies (name)        WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_companies_slug        ON companies (slug);
CREATE INDEX IF NOT EXISTS idx_companies_verified    ON companies (is_verified) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_companies_location    ON companies (location_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_companies_deleted_at  ON companies (deleted_at);
CREATE INDEX IF NOT EXISTS idx_companies_name_trgm   ON companies USING gin (name gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: workers
-- ============================================================
CREATE TABLE IF NOT EXISTS workers (
  id                  TEXT          NOT NULL DEFAULT generate_cuid(),
  user_id             TEXT          NOT NULL,
  bio                 TEXT,
  date_of_birth       DATE,
  gender              gender,
  languages           TEXT[]        NOT NULL DEFAULT '{}',
  available_for_work  BOOLEAN       NOT NULL DEFAULT TRUE,
  hourly_rate         NUMERIC(10,2),
  daily_rate          NUMERIC(10,2),
  weekly_rate         NUMERIC(10,2),
  experience_years    SMALLINT      NOT NULL DEFAULT 0,
  location_id         TEXT,
  rating              NUMERIC(3,2),
  total_ratings       INTEGER       NOT NULL DEFAULT 0,
  total_jobs_done     INTEGER       NOT NULL DEFAULT 0,
  is_profile_complete BOOLEAN       NOT NULL DEFAULT FALSE,
  profile_views       INTEGER       NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ,

  CONSTRAINT workers_pkey              PRIMARY KEY (id),
  CONSTRAINT workers_user_id_unique    UNIQUE (user_id),
  CONSTRAINT workers_user_fk           FOREIGN KEY (user_id)    REFERENCES users     (id) ON DELETE CASCADE,
  CONSTRAINT workers_location_fk       FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL,
  CONSTRAINT workers_rating_range      CHECK (rating            IS NULL OR (rating            BETWEEN 0.00 AND 5.00)),
  CONSTRAINT workers_exp_years_nn      CHECK (experience_years  >= 0),
  CONSTRAINT workers_total_jobs_nn     CHECK (total_jobs_done   >= 0),
  CONSTRAINT workers_total_ratings_nn  CHECK (total_ratings     >= 0),
  CONSTRAINT workers_profile_views_nn  CHECK (profile_views     >= 0),
  CONSTRAINT workers_hourly_rate_pos   CHECK (hourly_rate  IS NULL OR hourly_rate  > 0),
  CONSTRAINT workers_daily_rate_pos    CHECK (daily_rate   IS NULL OR daily_rate   > 0),
  CONSTRAINT workers_weekly_rate_pos   CHECK (weekly_rate  IS NULL OR weekly_rate  > 0),
  CONSTRAINT workers_dob_past          CHECK (date_of_birth IS NULL OR date_of_birth < CURRENT_DATE)
);

COMMENT ON TABLE  workers                    IS 'Extended profile for WORKER role users';
COMMENT ON COLUMN workers.languages          IS 'Array of language codes/names the worker communicates in';
COMMENT ON COLUMN workers.available_for_work IS 'TRUE = actively seeking work right now';
COMMENT ON COLUMN workers.rating             IS 'Weighted average rating 0.00–5.00';

CREATE INDEX IF NOT EXISTS idx_workers_user_id      ON workers (user_id);
CREATE INDEX IF NOT EXISTS idx_workers_location     ON workers (location_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_workers_available    ON workers (available_for_work) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_workers_rating       ON workers (rating DESC NULLS LAST) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_workers_deleted_at   ON workers (deleted_at);
CREATE INDEX IF NOT EXISTS idx_workers_daily_rate   ON workers (daily_rate)  WHERE deleted_at IS NULL AND daily_rate IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_workers_exp_years    ON workers (experience_years DESC) WHERE deleted_at IS NULL;

CREATE OR REPLACE TRIGGER trg_workers_updated_at
  BEFORE UPDATE ON workers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: contractors
-- ============================================================
CREATE TABLE IF NOT EXISTS contractors (
  id                   TEXT          NOT NULL DEFAULT generate_cuid(),
  user_id              TEXT          NOT NULL,
  company_id           TEXT,
  bio                  TEXT,
  specializations      TEXT[]        NOT NULL DEFAULT '{}',
  license_number       VARCHAR(60),
  license_expiry       DATE,
  gstin                VARCHAR(20),
  rating               NUMERIC(3,2),
  total_ratings        INTEGER       NOT NULL DEFAULT 0,
  total_projects_done  INTEGER       NOT NULL DEFAULT 0,
  location_id          TEXT,
  is_verified          BOOLEAN       NOT NULL DEFAULT FALSE,
  verified_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ,

  CONSTRAINT contractors_pkey               PRIMARY KEY (id),
  CONSTRAINT contractors_user_id_unique     UNIQUE (user_id),
  CONSTRAINT contractors_gstin_unique       UNIQUE (gstin),
  CONSTRAINT contractors_user_fk            FOREIGN KEY (user_id)    REFERENCES users     (id) ON DELETE CASCADE,
  CONSTRAINT contractors_company_fk         FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL,
  CONSTRAINT contractors_location_fk        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  CONSTRAINT contractors_rating_range       CHECK (rating              IS NULL OR (rating              BETWEEN 0.00 AND 5.00)),
  CONSTRAINT contractors_total_ratings_nn   CHECK (total_ratings       >= 0),
  CONSTRAINT contractors_total_projects_nn  CHECK (total_projects_done >= 0),
  CONSTRAINT contractors_gstin_fmt          CHECK (gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')
);

COMMENT ON TABLE  contractors                    IS 'Extended profile for CONTRACTOR role users';
COMMENT ON COLUMN contractors.specializations    IS 'Array of work specialization labels';
COMMENT ON COLUMN contractors.gstin              IS 'GSTIN for contractors operating as businesses';

CREATE INDEX IF NOT EXISTS idx_contractors_user_id    ON contractors (user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_company    ON contractors (company_id)   WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contractors_location   ON contractors (location_id)  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contractors_verified   ON contractors (is_verified)  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contractors_rating     ON contractors (rating DESC NULLS LAST) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contractors_deleted_at ON contractors (deleted_at);

CREATE OR REPLACE TRIGGER trg_contractors_updated_at
  BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: company_admins
-- ============================================================
CREATE TABLE IF NOT EXISTS company_admins (
  id          TEXT         NOT NULL DEFAULT generate_cuid(),
  user_id     TEXT         NOT NULL,
  company_id  TEXT         NOT NULL,
  is_primary  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT company_admins_pkey          PRIMARY KEY (id),
  CONSTRAINT company_admins_user_unique   UNIQUE (user_id),
  CONSTRAINT company_admins_user_fk       FOREIGN KEY (user_id)    REFERENCES users     (id) ON DELETE CASCADE,
  CONSTRAINT company_admins_company_fk    FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);

COMMENT ON TABLE company_admins IS 'Maps COMPANY_ADMIN users to their company; one user = one company';

CREATE INDEX IF NOT EXISTS idx_company_admins_company ON company_admins (company_id);

CREATE OR REPLACE TRIGGER trg_company_admins_updated_at
  BEFORE UPDATE ON company_admins
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id            TEXT         NOT NULL DEFAULT generate_cuid(),
  user_id       TEXT         NOT NULL,
  is_super_admin BOOLEAN     NOT NULL DEFAULT FALSE,
  department    VARCHAR(100),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT admins_pkey          PRIMARY KEY (id),
  CONSTRAINT admins_user_unique   UNIQUE (user_id),
  CONSTRAINT admins_user_fk       FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

COMMENT ON TABLE admins IS 'Platform administrator profiles (SUPER_ADMIN role users)';

CREATE OR REPLACE TRIGGER trg_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: roles
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id           TEXT         NOT NULL DEFAULT generate_cuid(),
  name         VARCHAR(80)  NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  description  TEXT,
  is_system    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT roles_pkey         PRIMARY KEY (id),
  CONSTRAINT roles_name_unique  UNIQUE (name)
);

COMMENT ON TABLE  roles           IS 'Named roles used for coarse RBAC';
COMMENT ON COLUMN roles.is_system IS 'System roles cannot be deleted';

CREATE OR REPLACE TRIGGER trg_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: permissions
-- ============================================================
CREATE TABLE IF NOT EXISTS permissions (
  id          TEXT         NOT NULL DEFAULT generate_cuid(),
  name        VARCHAR(100) NOT NULL,
  resource    VARCHAR(80)  NOT NULL,
  action      VARCHAR(40)  NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT permissions_pkey         PRIMARY KEY (id),
  CONSTRAINT permissions_name_unique  UNIQUE (name),
  CONSTRAINT permissions_res_act_uq   UNIQUE (resource, action)
);

COMMENT ON TABLE  permissions          IS 'Granular resource-action permission entries';
COMMENT ON COLUMN permissions.resource IS 'Resource being protected e.g. users, workers, companies';
COMMENT ON COLUMN permissions.action   IS 'Action being performed e.g. read, write, delete, verify';

CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions (resource);

-- ============================================================
-- TABLE: role_permissions
-- ============================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id            TEXT         NOT NULL DEFAULT generate_cuid(),
  role_id       TEXT         NOT NULL,
  permission_id TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT role_permissions_pkey      PRIMARY KEY (id),
  CONSTRAINT role_permissions_unique    UNIQUE (role_id, permission_id),
  CONSTRAINT role_permissions_role_fk   FOREIGN KEY (role_id)       REFERENCES roles       (id) ON DELETE CASCADE,
  CONSTRAINT role_permissions_perm_fk   FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

COMMENT ON TABLE role_permissions IS 'Many-to-many join between roles and permissions';

CREATE INDEX IF NOT EXISTS idx_role_permissions_role       ON role_permissions (role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions (permission_id);

-- ============================================================
-- TABLE: admin_permissions
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_permissions (
  id            TEXT         NOT NULL DEFAULT generate_cuid(),
  admin_id      TEXT         NOT NULL,
  permission_id TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT admin_permissions_pkey     PRIMARY KEY (id),
  CONSTRAINT admin_permissions_unique   UNIQUE (admin_id, permission_id),
  CONSTRAINT admin_permissions_adm_fk   FOREIGN KEY (admin_id)      REFERENCES admins      (id) ON DELETE CASCADE,
  CONSTRAINT admin_permissions_perm_fk  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

COMMENT ON TABLE admin_permissions IS 'Fine-grained per-admin overrides on top of role permissions';

CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin      ON admin_permissions (admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_permission ON admin_permissions (permission_id);

-- ============================================================
-- TABLE: user_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id            TEXT          NOT NULL DEFAULT generate_cuid(),
  user_id       TEXT          NOT NULL,
  refresh_token TEXT          NOT NULL,
  device_info   TEXT,
  device_id     VARCHAR(100),
  ip_address    INET,
  user_agent    TEXT,
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  expires_at    TIMESTAMPTZ   NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT user_sessions_pkey           PRIMARY KEY (id),
  CONSTRAINT user_sessions_token_unique   UNIQUE (refresh_token),
  CONSTRAINT user_sessions_user_fk        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT user_sessions_expires_future CHECK (expires_at > created_at)
);

COMMENT ON TABLE  user_sessions               IS 'Active JWT refresh token sessions';
COMMENT ON COLUMN user_sessions.refresh_token IS 'UUID v4 refresh token stored plain; compare via =';
COMMENT ON COLUMN user_sessions.ip_address    IS 'INET type for IPv4/IPv6 storage and subnet queries';
COMMENT ON COLUMN user_sessions.expires_at    IS 'Hard expiry; soft-delete via is_active=false';

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id      ON user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token        ON user_sessions (refresh_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active       ON user_sessions (is_active, expires_at) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at   ON user_sessions (expires_at);

CREATE OR REPLACE TRIGGER trg_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: documents
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id               TEXT             NOT NULL DEFAULT generate_cuid(),
  user_id          TEXT             NOT NULL,
  type             document_type    NOT NULL,
  document_number  VARCHAR(40),
  file_url         TEXT             NOT NULL,
  thumbnail_url    TEXT,
  status           document_status  NOT NULL DEFAULT 'PENDING',
  verified_at      TIMESTAMPTZ,
  verified_by      TEXT,
  rejection_reason TEXT,
  expiry_date      DATE,
  notes            TEXT,
  created_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ,

  CONSTRAINT documents_pkey               PRIMARY KEY (id),
  CONSTRAINT documents_user_fk            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT documents_file_url_nonempty  CHECK (file_url <> ''),
  CONSTRAINT documents_verified_by_when   CHECK (
    (status = 'VERIFIED' AND verified_at IS NOT NULL AND verified_by IS NOT NULL)
    OR status <> 'VERIFIED'
  ),
  CONSTRAINT documents_rejection_when     CHECK (
    (status = 'REJECTED' AND rejection_reason IS NOT NULL)
    OR status <> 'REJECTED'
  )
);

COMMENT ON TABLE  documents                  IS 'KYC documents uploaded by users for identity verification';
COMMENT ON COLUMN documents.file_url         IS 'Absolute URL (S3 / local storage)';
COMMENT ON COLUMN documents.verified_by      IS 'User ID of admin who verified';
COMMENT ON COLUMN documents.rejection_reason IS 'Required when status = REJECTED';

CREATE INDEX IF NOT EXISTS idx_documents_user_id    ON documents (user_id)   WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_status     ON documents (status)    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_type       ON documents (type)      WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_pending    ON documents (created_at) WHERE status = 'PENDING' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents (deleted_at);

CREATE OR REPLACE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: skills
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id          TEXT         NOT NULL DEFAULT generate_cuid(),
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(130) NOT NULL,
  category    VARCHAR(80)  NOT NULL,
  description TEXT,
  icon        VARCHAR(100),
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT skills_pkey         PRIMARY KEY (id),
  CONSTRAINT skills_name_unique  UNIQUE (name),
  CONSTRAINT skills_slug_unique  UNIQUE (slug)
);

COMMENT ON TABLE  skills           IS 'Master list of labour skills used across the platform';
COMMENT ON COLUMN skills.slug      IS 'URL-safe lowercase identifier e.g. masonry, electrical-work';
COMMENT ON COLUMN skills.category  IS 'High-level category e.g. Construction, Domestic, Transport';
COMMENT ON COLUMN skills.icon      IS 'Emoji or icon identifier shown in UI';

CREATE INDEX IF NOT EXISTS idx_skills_category  ON skills (category) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_skills_active    ON skills (is_active);
CREATE INDEX IF NOT EXISTS idx_skills_name_trgm ON skills USING gin (name gin_trgm_ops);

CREATE OR REPLACE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLE: worker_skills
-- ============================================================
CREATE TABLE IF NOT EXISTS worker_skills (
  id                  TEXT         NOT NULL DEFAULT generate_cuid(),
  worker_id           TEXT         NOT NULL,
  skill_id            TEXT         NOT NULL,
  level               skill_level  NOT NULL DEFAULT 'BEGINNER',
  years_of_experience SMALLINT     NOT NULL DEFAULT 0,
  is_verified         BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT worker_skills_pkey               PRIMARY KEY (id),
  CONSTRAINT worker_skills_worker_skill_uq    UNIQUE (worker_id, skill_id),
  CONSTRAINT worker_skills_worker_fk          FOREIGN KEY (worker_id) REFERENCES workers (id) ON DELETE CASCADE,
  CONSTRAINT worker_skills_skill_fk           FOREIGN KEY (skill_id)  REFERENCES skills  (id) ON DELETE CASCADE,
  CONSTRAINT worker_skills_exp_years_nn       CHECK (years_of_experience >= 0)
);

COMMENT ON TABLE worker_skills IS 'Junction table: worker ↔ skill with proficiency metadata';

CREATE INDEX IF NOT EXISTS idx_worker_skills_worker    ON worker_skills (worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_skills_skill     ON worker_skills (skill_id);
CREATE INDEX IF NOT EXISTS idx_worker_skills_level     ON worker_skills (level);
CREATE INDEX IF NOT EXISTS idx_worker_skills_verified  ON worker_skills (is_verified) WHERE is_verified = TRUE;

-- ============================================================
-- TABLE: otp_codes
-- ============================================================
CREATE TABLE IF NOT EXISTS otp_codes (
  id          TEXT         NOT NULL DEFAULT generate_cuid(),
  user_id     TEXT,
  identifier  VARCHAR(30)  NOT NULL,
  code        VARCHAR(10)  NOT NULL,
  purpose     otp_purpose  NOT NULL,
  is_used     BOOLEAN      NOT NULL DEFAULT FALSE,
  attempts    SMALLINT     NOT NULL DEFAULT 0,
  expires_at  TIMESTAMPTZ  NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT otp_codes_pkey          PRIMARY KEY (id),
  CONSTRAINT otp_codes_user_fk       FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT otp_codes_attempts_nn   CHECK (attempts >= 0 AND attempts <= 10),
  CONSTRAINT otp_codes_expires_fut   CHECK (expires_at > created_at),
  CONSTRAINT otp_codes_code_digits   CHECK (code ~ '^\d{4,8}$')
);

COMMENT ON TABLE  otp_codes             IS 'Time-limited OTP codes for phone/email verification';
COMMENT ON COLUMN otp_codes.identifier  IS 'Phone number or email address the OTP was sent to';
COMMENT ON COLUMN otp_codes.attempts    IS 'Number of failed verify attempts; max 10 before lockout';

CREATE INDEX IF NOT EXISTS idx_otp_codes_identifier  ON otp_codes (identifier);
CREATE INDEX IF NOT EXISTS idx_otp_codes_purpose     ON otp_codes (purpose);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at  ON otp_codes (expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_codes_active      ON otp_codes (identifier, purpose, is_used, expires_at)
  WHERE is_used = FALSE;

-- ============================================================
-- VIEWS
-- ============================================================

-- Active workers with full profile
CREATE OR REPLACE VIEW v_active_workers AS
SELECT
  w.id                  AS worker_id,
  u.id                  AS user_id,
  u.first_name,
  u.last_name,
  u.first_name || ' ' || u.last_name AS full_name,
  u.phone,
  u.avatar,
  u.status              AS user_status,
  w.bio,
  w.gender,
  w.languages,
  w.available_for_work,
  w.hourly_rate,
  w.daily_rate,
  w.weekly_rate,
  w.experience_years,
  w.rating,
  w.total_ratings,
  w.total_jobs_done,
  w.is_profile_complete,
  w.profile_views,
  l.city,
  l.state,
  l.country,
  l.pincode,
  l.latitude,
  l.longitude,
  w.created_at
FROM workers  w
JOIN users    u ON u.id = w.user_id
LEFT JOIN locations l ON l.id = w.location_id
WHERE w.deleted_at IS NULL
  AND u.deleted_at IS NULL
  AND u.status     = 'ACTIVE';

COMMENT ON VIEW v_active_workers IS 'Active non-deleted workers with user and location details';

-- Active contractors
CREATE OR REPLACE VIEW v_active_contractors AS
SELECT
  c.id                   AS contractor_id,
  u.id                   AS user_id,
  u.first_name,
  u.last_name,
  u.first_name || ' ' || u.last_name AS full_name,
  u.email,
  u.phone,
  u.avatar,
  c.bio,
  c.specializations,
  c.license_number,
  c.license_expiry,
  c.gstin,
  c.rating,
  c.total_ratings,
  c.total_projects_done,
  c.is_verified,
  c.verified_at,
  co.id                  AS company_id,
  co.name                AS company_name,
  co.slug                AS company_slug,
  l.city,
  l.state,
  l.pincode,
  c.created_at
FROM contractors c
JOIN users       u  ON u.id  = c.user_id
LEFT JOIN companies   co ON co.id = c.company_id
LEFT JOIN locations   l  ON l.id  = c.location_id
WHERE c.deleted_at IS NULL
  AND u.deleted_at IS NULL
  AND u.status     = 'ACTIVE';

COMMENT ON VIEW v_active_contractors IS 'Active contractors with company and location details';

-- Workers with their skills (denormalized for API responses)
CREATE OR REPLACE VIEW v_worker_skills_summary AS
SELECT
  w.id                                         AS worker_id,
  u.first_name || ' ' || u.last_name           AS full_name,
  l.city,
  l.state,
  w.available_for_work,
  w.daily_rate,
  w.rating,
  w.total_jobs_done,
  json_agg(
    json_build_object(
      'skill_id',            s.id,
      'skill_name',          s.name,
      'skill_slug',          s.slug,
      'skill_category',      s.category,
      'level',               ws.level,
      'years_of_experience', ws.years_of_experience,
      'is_verified',         ws.is_verified
    ) ORDER BY s.category, s.name
  ) FILTER (WHERE s.id IS NOT NULL)             AS skills
FROM workers      w
JOIN users        u  ON u.id  = w.user_id
LEFT JOIN locations    l  ON l.id  = w.location_id
LEFT JOIN worker_skills ws ON ws.worker_id = w.id
LEFT JOIN skills        s  ON s.id  = ws.skill_id AND s.is_active = TRUE
WHERE w.deleted_at IS NULL
  AND u.deleted_at IS NULL
  AND u.status     = 'ACTIVE'
GROUP BY w.id, u.first_name, u.last_name, l.city, l.state,
         w.available_for_work, w.daily_rate, w.rating, w.total_jobs_done;

COMMENT ON VIEW v_worker_skills_summary IS 'Workers with aggregated JSON skills array — used by listing API';

-- Pending document verifications
CREATE OR REPLACE VIEW v_pending_documents AS
SELECT
  d.id             AS document_id,
  d.user_id,
  u.first_name || ' ' || u.last_name AS user_name,
  u.phone,
  u.role           AS user_role,
  d.type,
  d.document_number,
  d.file_url,
  d.expiry_date,
  d.created_at     AS submitted_at
FROM documents d
JOIN users     u ON u.id = d.user_id
WHERE d.status     = 'PENDING'
  AND d.deleted_at IS NULL
  AND u.deleted_at IS NULL
ORDER BY d.created_at ASC;

COMMENT ON VIEW v_pending_documents IS 'Documents awaiting admin review, oldest-first';

-- Platform summary stats (used by admin dashboard)
CREATE OR REPLACE VIEW v_platform_stats AS
SELECT
  (SELECT COUNT(*) FROM users     WHERE role = 'WORKER'     AND deleted_at IS NULL AND status = 'ACTIVE')   AS active_workers,
  (SELECT COUNT(*) FROM users     WHERE role = 'CONTRACTOR' AND deleted_at IS NULL AND status = 'ACTIVE')   AS active_contractors,
  (SELECT COUNT(*) FROM companies WHERE deleted_at IS NULL  AND is_verified = TRUE)                         AS verified_companies,
  (SELECT COUNT(*) FROM users     WHERE deleted_at IS NULL)                                                  AS total_users,
  (SELECT COUNT(*) FROM workers   WHERE available_for_work = TRUE AND deleted_at IS NULL)                   AS workers_available_now,
  (SELECT COUNT(*) FROM documents WHERE status = 'PENDING' AND deleted_at IS NULL)                          AS pending_verifications,
  (SELECT COALESCE(AVG(rating),0) FROM workers WHERE rating IS NOT NULL AND deleted_at IS NULL)             AS avg_worker_rating,
  (SELECT COUNT(*) FROM user_sessions WHERE is_active = TRUE AND expires_at > NOW())                        AS active_sessions;

COMMENT ON VIEW v_platform_stats IS 'Live aggregate stats shown on the admin dashboard';

-- ============================================================
-- ROW-LEVEL SECURITY (RLS) — enable but do NOT force-enable
-- Application connects with a superuser role in dev;
-- Enable per-table RLS in production with restricted roles.
-- ============================================================
-- ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workers        ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contractors    ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents      ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_sessions  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CLEANUP FUNCTION: purge expired OTP codes (run via pg_cron)
-- SELECT cron.schedule('cleanup-otps', '*/15 * * * *', 'SELECT purge_expired_otps()');
-- ============================================================
CREATE OR REPLACE FUNCTION purge_expired_otps()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM otp_codes
  WHERE expires_at < NOW() - INTERVAL '1 hour'
     OR (is_used = TRUE AND created_at < NOW() - INTERVAL '24 hours');
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION purge_expired_otps() IS 'Deletes expired/used OTP codes. Schedule every 15 min via pg_cron.';

-- ============================================================
-- CLEANUP FUNCTION: purge expired sessions
-- ============================================================
CREATE OR REPLACE FUNCTION purge_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE user_sessions
  SET    is_active = FALSE
  WHERE  expires_at < NOW()
    AND  is_active  = TRUE;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION purge_expired_sessions() IS 'Deactivates sessions past their expiry. Schedule hourly.';

-- ============================================================
-- FUNCTION: worker search with full-text + geo + skill filters
-- Usage:
--   SELECT * FROM search_workers('Mumbai', 'masonry', TRUE, 5000, 1, 20);
-- ============================================================
CREATE OR REPLACE FUNCTION search_workers(
  p_city         TEXT    DEFAULT NULL,
  p_skill_slug   TEXT    DEFAULT NULL,
  p_available    BOOLEAN DEFAULT NULL,
  p_max_daily    NUMERIC DEFAULT NULL,
  p_page         INT     DEFAULT 1,
  p_limit        INT     DEFAULT 20
)
RETURNS TABLE (
  worker_id            TEXT,
  full_name            TEXT,
  city                 VARCHAR,
  state                VARCHAR,
  available_for_work   BOOLEAN,
  daily_rate           NUMERIC,
  rating               NUMERIC,
  total_jobs_done      INTEGER,
  matched_skill        TEXT,
  skill_level          skill_level
)
LANGUAGE sql STABLE
AS $$
  SELECT DISTINCT
    w.id,
    u.first_name || ' ' || u.last_name,
    l.city,
    l.state,
    w.available_for_work,
    w.daily_rate,
    w.rating,
    w.total_jobs_done,
    s.name,
    ws.level
  FROM workers       w
  JOIN users         u  ON u.id = w.user_id
  LEFT JOIN locations     l  ON l.id = w.location_id
  LEFT JOIN worker_skills ws ON ws.worker_id = w.id
  LEFT JOIN skills        s  ON s.id = ws.skill_id
  WHERE w.deleted_at IS NULL
    AND u.deleted_at IS NULL
    AND u.status     = 'ACTIVE'
    AND (p_city      IS NULL OR l.city      ILIKE '%' || p_city || '%')
    AND (p_skill_slug IS NULL OR s.slug     = p_skill_slug)
    AND (p_available IS NULL OR w.available_for_work = p_available)
    AND (p_max_daily IS NULL OR w.daily_rate <= p_max_daily)
  ORDER BY w.rating DESC NULLS LAST, w.total_jobs_done DESC
  LIMIT  GREATEST(1, LEAST(p_limit, 100))
  OFFSET GREATEST(0, (p_page - 1) * p_limit);
$$;

COMMENT ON FUNCTION search_workers IS 'Parameterised worker search with city / skill / availability / rate filters';

-- ============================================================
-- SCHEMA VERSION TABLE (used by Prisma / migration tools)
-- ============================================================
CREATE TABLE IF NOT EXISTS _schema_versions (
  id          SERIAL       PRIMARY KEY,
  version     VARCHAR(20)  NOT NULL,
  description TEXT,
  applied_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO _schema_versions (version, description)
VALUES ('1.0.0', 'Initial Digital Labour Chowk schema — 16 tables, 4 views, helper functions')
ON CONFLICT DO NOTHING;

-- ============================================================
-- GRANT minimum privileges to application role
-- Replace 'dlc_app' with your actual application DB user.
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'dlc_app') THEN
    GRANT USAGE  ON SCHEMA public TO dlc_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES    IN SCHEMA public TO dlc_app;
    GRANT USAGE,  SELECT                 ON ALL SEQUENCES IN SCHEMA public TO dlc_app;
    GRANT EXECUTE                        ON ALL FUNCTIONS IN SCHEMA public TO dlc_app;
  END IF;
END $$;

-- ============================================================
-- DONE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Digital Labour Chowk schema applied successfully.';
  RAISE NOTICE 'Tables   : 16 (+ 1 _schema_versions)';
  RAISE NOTICE 'Views    : 5';
  RAISE NOTICE 'Indexes  : 50+';
  RAISE NOTICE 'Triggers : 10 (auto updated_at)';
  RAISE NOTICE 'Functions: 4 (trigger, cuid, purge, search)';
  RAISE NOTICE 'Run seed.sql next to populate sample data.';
  RAISE NOTICE '============================================================';
END $$;
