-- ============================================================
-- Full Migration SQL for Supabase SQL Editor
-- Generated from all Laravel migration files (final consolidated state)
-- Paste this entire script into: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Laravel migrations tracking table
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

-- Users (consolidated from all user migrations)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NULL,
    middle_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'alumni' CHECK (role IN ('alumni', 'admin')),
    is_active SMALLINT NOT NULL DEFAULT 1,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'disapproved')),
    current_address TEXT NULL,
    phone_number VARCHAR(20) NULL,
    telephone_number VARCHAR(20) NULL,
    country VARCHAR(255) NULL,
    geocode VARCHAR(255) NULL,
    sex VARCHAR(30) NULL CHECK (sex IN ('male', 'female', 'prefer_not_to_say')),
    religion VARCHAR(50) NULL CHECK (religion IN ('roman_catholic', 'protestant', 'iglesia_ni_cristo', 'islam', 'born_again_christian', 'buddhist', 'other', 'prefer_not_to_say')),
    religion_other VARCHAR(255) NULL,
    marital_status VARCHAR(30) NULL CHECK (marital_status IN ('single', 'married', 'living_in', 'separated', 'annulled', 'divorced', 'widowed')),
    marriage_date VARCHAR(255) NULL,
    intend_to_marry VARCHAR(5) NULL CHECK (intend_to_marry IN ('yes', 'no')),
    intended_marriage_age VARCHAR(255) NULL,
    no_marriage_reason TEXT NULL,
    birth_date DATE NULL,
    region VARCHAR(255) NULL,
    province VARCHAR(255) NULL,
    city VARCHAR(255) NULL,
    course VARCHAR(255) NULL,
    batch_year VARCHAR(4) NULL,
    has_diploma VARCHAR(5) NOT NULL DEFAULT 'no' CHECK (has_diploma IN ('yes', 'no')),
    diploma_file_path VARCHAR(255) NULL,
    id_type VARCHAR(255) NULL,
    valid_id_file_path VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user_id_index ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_last_activity_index ON sessions (last_activity);

-- Cache
CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS jobs_queue_index ON jobs (queue);

CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT NULL,
    cancelled_at INTEGER NULL,
    created_at INTEGER NOT NULL,
    finished_at INTEGER NULL
);

CREATE TABLE IF NOT EXISTS failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Personal access tokens (Laravel Sanctum)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
CREATE INDEX IF NOT EXISTS personal_access_tokens_tokenable_index ON personal_access_tokens (tokenable_type, tokenable_id);
CREATE INDEX IF NOT EXISTS personal_access_tokens_expires_at_index ON personal_access_tokens (expires_at);

-- Donation campaigns
CREATE TABLE IF NOT EXISTS donation_campaigns (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NULL,
    category VARCHAR(255) NULL,
    goal_amount DECIMAL(10,2) NOT NULL,
    raised_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NULL REFERENCES donation_campaigns (id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(255) NOT NULL DEFAULT 'card',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Tell Laravel all migrations have been run (so artisan migrate won't re-run them)
INSERT INTO migrations (migration, batch) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2026_01_30_153929_add_role_to_users_table', 1),
('2026_01_30_160526_add_registration_fields_to_users_table', 1),
('2026_01_31_002614_create_personal_access_tokens_table', 1),
('2026_01_31_150023_add_is_active_to_users_table', 1),
('2026_02_15_000001_create_donation_campaigns_table', 1),
('2026_02_15_000002_create_donations_table', 1),
('2026_02_15_000003_add_image_to_donation_campaigns_table', 1),
('2026_02_15_000004_add_category_to_donation_campaigns_table', 1),
('2026_02_23_000001_add_country_and_update_location_fields_in_users_table', 1),
('2026_03_04_000001_add_approval_status_to_users_table', 1),
('2026_03_04_000002_make_optional_user_fields_nullable', 1)
ON CONFLICT DO NOTHING;
