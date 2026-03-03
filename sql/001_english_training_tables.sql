-- Supabase migration: English Training tables
-- Run in Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. learning_phrases
CREATE TABLE IF NOT EXISTS learning_phrases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  english TEXT NOT NULL,
  japanese TEXT DEFAULT '',
  category TEXT DEFAULT 'daily',
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, english)
);

ALTER TABLE learning_phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own phrases" ON learning_phrases
  FOR ALL USING (auth.uid() = user_id);

-- 2. phrase_mastery
CREATE TABLE IF NOT EXISTS phrase_mastery (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  phrase_id UUID REFERENCES learning_phrases(id) ON DELETE CASCADE NOT NULL,
  mastery_level INT DEFAULT 0,
  card_points INT DEFAULT 0,
  last_leveled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, phrase_id)
);

ALTER TABLE phrase_mastery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own mastery" ON phrase_mastery
  FOR ALL USING (auth.uid() = user_id);

-- 3. voice_recordings
CREATE TABLE IF NOT EXISTS voice_recordings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  phrase_id UUID REFERENCES learning_phrases(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own recordings" ON voice_recordings
  FOR ALL USING (auth.uid() = user_id);

-- 4. phrase_links
CREATE TABLE IF NOT EXISTS phrase_links (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  phrase_id UUID REFERENCES learning_phrases(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE phrase_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own links" ON phrase_links
  FOR ALL USING (auth.uid() = user_id);

-- 5. player_stats
CREATE TABLE IF NOT EXISTS player_stats (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  total_xp INT DEFAULT 0,
  total_sparks INT DEFAULT 0,
  today_sparks INT DEFAULT 0,
  today_date TEXT,
  pity_counter INT DEFAULT 0,
  legendary_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own stats" ON player_stats
  FOR ALL USING (auth.uid() = user_id);

-- 6. review_history
CREATE TABLE IF NOT EXISTS review_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  phrase_id UUID REFERENCES learning_phrases(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  touch_count INT DEFAULT 1,
  UNIQUE(user_id, phrase_id, date)
);

ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own review history" ON review_history
  FOR ALL USING (auth.uid() = user_id);
