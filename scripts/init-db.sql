-- ============================================
-- KamStore SaaS - Database Initialization
-- ============================================
-- This script runs automatically when the PostgreSQL
-- container is first created.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'host');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_category AS ENUM ('hotel', 'restaurant', 'activity', 'housing');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM ('tourism', 'housing');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_provider AS ENUM ('mtn_momo', 'orange_money', 'card');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Log successful initialization
DO $$ BEGIN
    RAISE NOTICE 'KamStore database initialized successfully with extensions: uuid-ossp, vector, pg_trgm';
END $$;
