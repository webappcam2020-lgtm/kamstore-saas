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
    CREATE TYPE payment_provider AS ENUM ('notch_pay', 'campay', 'mtn_momo', 'orange_money', 'card');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE scraping_engine AS ENUM ('scrapy', 'playwright', 'puppeteer', 'async_http');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE scraping_status AS ENUM ('pending', 'running', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Scraping Jobs Table
CREATE TABLE IF NOT EXISTS scraping_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    target_url VARCHAR(1024) NOT NULL,
    keyword VARCHAR(255),
    engine scraping_engine NOT NULL DEFAULT 'async_http',
    proxy_rotation_enabled BOOLEAN DEFAULT TRUE,
    proxy_used VARCHAR(255),
    status scraping_status NOT NULL DEFAULT 'pending',
    leads_extracted INTEGER DEFAULT 0,
    error_message TEXT,
    celery_task_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    job_id UUID REFERENCES scraping_jobs(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    category VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Douala',
    country VARCHAR(100) DEFAULT 'Cameroun',
    source_url VARCHAR(1024),
    confidence_score FLOAT DEFAULT 0.85,
    raw_text TEXT,
    ai_summary TEXT,
    sentiment VARCHAR(50) DEFAULT 'neutral',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company_name);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);

-- Log successful initialization
DO $$ BEGIN
    RAISE NOTICE 'KamStore database initialized successfully with extensions and tables for AI leads and scraping';
END $$;
