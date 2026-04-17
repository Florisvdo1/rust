-- RUST App — Supabase Schema
-- Run this in the Supabase SQL Editor
-- Idempotent: safe to run multiple times

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planner items
CREATE TABLE IF NOT EXISTS planner_items (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  hour INTEGER NOT NULL,
  quarter INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  activity_id TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT,
  icon_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes (Onthouden)
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'Algemeen',
  pinned BOOLEAN DEFAULT FALSE,
  urgent BOOLEAN DEFAULT FALSE,
  done BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Places (Plaatsen)
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room TEXT NOT NULL,
  object_label TEXT NOT NULL,
  where_precisely TEXT,
  subzone TEXT,
  container TEXT,
  position TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  mood INTEGER DEFAULT 3,
  energy INTEGER DEFAULT 3,
  stress INTEGER DEFAULT 2,
  went_well TEXT DEFAULT '',
  was_difficult TEXT DEFAULT '',
  remember_tomorrow TEXT DEFAULT '',
  freewriting TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health items (supplements/medication)
CREATE TABLE IF NOT EXISTS health_items (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('supplement', 'medication')),
  dosage TEXT DEFAULT '',
  schedule TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health logs
CREATE TABLE IF NOT EXISTS health_logs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  date TEXT NOT NULL,
  taken BOOLEAN DEFAULT FALSE,
  time TIMESTAMPTZ
);

-- Daily health (hydration, sleep)
CREATE TABLE IF NOT EXISTS daily_health (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  hydration INTEGER DEFAULT 0,
  sleep_hours NUMERIC(4,1) DEFAULT 0,
  sleep_quality INTEGER DEFAULT 3,
  notes TEXT DEFAULT '',
  UNIQUE(user_id, date)
);

-- Breathing sessions
CREATE TABLE IF NOT EXISTS breathing_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  haptics BOOLEAN DEFAULT TRUE,
  sounds BOOLEAN DEFAULT FALSE,
  breathing_vibration BOOLEAN DEFAULT TRUE,
  planner_drag_haptics BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  breathing_chime BOOLEAN DEFAULT FALSE,
  start_tone BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_planner_items_user_date ON planner_items(user_id, date);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_places_user_id ON places(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_health_logs_user_date ON health_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_health_user_date ON daily_health(user_id, date);

-- Idempotent column additions (run if schema was created without these)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS where_precisely TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS subzone TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS container TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS breathing_chime BOOLEAN DEFAULT FALSE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS start_tone BOOLEAN DEFAULT FALSE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS larger_text BOOLEAN DEFAULT FALSE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS reduce_motion BOOLEAN DEFAULT FALSE;

-- Health planner scheduling fields (v1.2.0)
ALTER TABLE planner_items ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE planner_items ADD COLUMN IF NOT EXISTS health_type TEXT;
ALTER TABLE planner_items ADD COLUMN IF NOT EXISTS health_dosage TEXT;
ALTER TABLE planner_items ADD COLUMN IF NOT EXISTS health_quantity INTEGER;
ALTER TABLE planner_items ADD COLUMN IF NOT EXISTS health_note TEXT;

-- Row Level Security (v1.3.0)
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (idempotent)
DROP POLICY IF EXISTS "own_profile" ON profiles;
DROP POLICY IF EXISTS "own_notes" ON notes;
DROP POLICY IF EXISTS "own_places" ON places;
DROP POLICY IF EXISTS "own_planner_items" ON planner_items;
DROP POLICY IF EXISTS "own_journal_entries" ON journal_entries;
DROP POLICY IF EXISTS "own_health_items" ON health_items;
DROP POLICY IF EXISTS "own_health_logs" ON health_logs;
DROP POLICY IF EXISTS "own_daily_health" ON daily_health;
DROP POLICY IF EXISTS "own_breathing_sessions" ON breathing_sessions;
DROP POLICY IF EXISTS "own_user_settings" ON user_settings;

-- Users can only read and write their own records
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_notes" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_places" ON places FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_planner_items" ON planner_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_journal_entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_health_items" ON health_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_health_logs" ON health_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_daily_health" ON daily_health FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_breathing_sessions" ON breathing_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_user_settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
