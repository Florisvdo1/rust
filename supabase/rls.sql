-- Row Level Security policies for RUST app
-- Idempotent: safe to run multiple times

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Planner items
DROP POLICY IF EXISTS "Users can manage own planner items" ON planner_items;
CREATE POLICY "Users can manage own planner items" ON planner_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notes
DROP POLICY IF EXISTS "Users can manage own notes" ON notes;
CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Places
DROP POLICY IF EXISTS "Users can manage own places" ON places;
CREATE POLICY "Users can manage own places" ON places
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Journal entries
DROP POLICY IF EXISTS "Users can manage own journal entries" ON journal_entries;
CREATE POLICY "Users can manage own journal entries" ON journal_entries
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Health items
DROP POLICY IF EXISTS "Users can manage own health items" ON health_items;
CREATE POLICY "Users can manage own health items" ON health_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Health logs
DROP POLICY IF EXISTS "Users can manage own health logs" ON health_logs;
CREATE POLICY "Users can manage own health logs" ON health_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Daily health
DROP POLICY IF EXISTS "Users can manage own daily health" ON daily_health;
CREATE POLICY "Users can manage own daily health" ON daily_health
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Breathing sessions
DROP POLICY IF EXISTS "Users can manage own breathing sessions" ON breathing_sessions;
CREATE POLICY "Users can manage own breathing sessions" ON breathing_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User settings
DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup — non-blocking (EXCEPTION swallowed so signup never fails)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Extract username from metadata, fall back to email prefix
  v_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );

  -- Ensure username is unique by appending a random suffix if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) LOOP
    v_username := v_username || '_' || floor(random() * 9000 + 1000)::text;
  END LOOP;

  INSERT INTO public.profiles (id, username)
  VALUES (new.id, v_username)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block signup due to profile creation failure
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
