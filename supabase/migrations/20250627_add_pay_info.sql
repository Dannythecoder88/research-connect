-- Migration: Add pay information to research listings
-- Created: 2025-06-27

-- Create pay type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pay_type') THEN
    CREATE TYPE pay_type AS ENUM ('unpaid', 'hourly');
  END IF;
END
$$;

-- Add pay columns to research_listings
ALTER TABLE public.research_listings
  ADD COLUMN IF NOT EXISTS pay_type pay_type NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS hourly_pay NUMERIC(10, 2);
