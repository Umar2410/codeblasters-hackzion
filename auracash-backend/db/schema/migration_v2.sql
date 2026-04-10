-- ================================================================
-- AuraCash Migration v3 — Run this in Supabase SQL Editor
-- ================================================================
-- Step 1: Enable UUID extension (may already be enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- Step 2: Create Tables
-- ================================================================

-- Users profile table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank accounts (one per user — UNIQUE on user_id allows upsert)
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL DEFAULT '',
    account_number TEXT NOT NULL DEFAULT '',
    holder_name TEXT DEFAULT '',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Ensure holder_name exists if table was created by older migration
ALTER TABLE public.bank_accounts ADD COLUMN IF NOT EXISTS holder_name TEXT DEFAULT '';
-- Ensure phone_number exists on users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number TEXT;
-- Remove unique constraint from phone_number to allow testing multiple accounts with same number
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_phone_number_key;

-- Balance snapshots — add a new row here to update user's balance in UI
-- The app always reads the LATEST row (ordered by fetched_at DESC)
CREATE TABLE IF NOT EXISTS public.balance_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    fetched_at TIMESTAMPTZ DEFAULT NOW()   -- <-- BALANCE IS READ FROM HERE
);

-- Index for fast balance lookup
CREATE INDEX IF NOT EXISTS idx_balance_user_time ON public.balance_snapshots(user_id, fetched_at DESC);

-- OTP storage for mobile verification
CREATE TABLE IF NOT EXISTS public.otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT REFERENCES public.users(email) ON DELETE CASCADE,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email)
);

-- Weekly AI insights
CREATE TABLE IF NOT EXISTS public.weekly_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    avg_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    min_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    surplus_estimate NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    surplus_30_percent NUMERIC(15, 2) NOT NULL DEFAULT 0,
    analysis_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- ================================================================
-- Step 3: Auth Trigger — auto-create user profile on signup
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- Step 4: RLS Policies — users can only see their own data
-- ================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_snapshots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "bank_all_own" ON public.bank_accounts;
DROP POLICY IF EXISTS "balance_all_own" ON public.balance_snapshots;

-- Users table policies
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (true); -- trigger needs this
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Bank accounts policies
CREATE POLICY "bank_all_own" ON public.bank_accounts FOR ALL USING (auth.uid() = user_id);

-- Balance snapshots policies
CREATE POLICY "balance_all_own" ON public.balance_snapshots FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- HOW TO CHANGE A USER'S BALANCE:
-- Go to Supabase → Table Editor → balance_snapshots
-- Click "Insert Row" and fill in:
--   user_id: (copy from the users table)
--   balance: 250000   ← whatever amount you want shown
--   fetched_at: leave blank (auto-fills to now)
-- The dashboard reads the MOST RECENT row for each user.
-- ================================================================

-- Explicitly disable RLS for these tables to avoid policy violation errors
ALTER TABLE public.otps DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_insights DISABLE ROW LEVEL SECURITY;
