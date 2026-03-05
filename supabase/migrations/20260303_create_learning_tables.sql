-- ============================================
-- フレーズ学習アプリ — Supabase マイグレーション
-- toniolab.com 用（マルチユーザー対応）
-- ============================================

-- 1. ユーザーフレーズ（学習コンテンツ）
CREATE TABLE IF NOT EXISTS learning_phrases (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  english     TEXT NOT NULL,
  japanese    TEXT DEFAULT '',
  category    TEXT DEFAULT 'daily',
  date        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, english)
);

-- 2. フレーズ習熟度（チャクラシステム: 0=SEED〜6=CROWN）
CREATE TABLE IF NOT EXISTS phrase_mastery (
  id              SERIAL PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase_id       TEXT NOT NULL REFERENCES learning_phrases(id) ON DELETE CASCADE,
  mastery_level   INT DEFAULT 0,
  card_points     INT DEFAULT 0,
  last_leveled_at TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, phrase_id)
);

-- 3. 音声録音
CREATE TABLE IF NOT EXISTS voice_recordings (
  id          SERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase_id   TEXT NOT NULL REFERENCES learning_phrases(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. フレーズリンク（メモ・例文）
CREATE TABLE IF NOT EXISTS phrase_links (
  id          SERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase_id   TEXT NOT NULL REFERENCES learning_phrases(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 5. プレイヤーステータス
CREATE TABLE IF NOT EXISTS player_stats (
  user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp        INT DEFAULT 0,
  total_sparks    INT DEFAULT 0,
  today_sparks    INT DEFAULT 0,
  today_date      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 6. レビュー履歴
CREATE TABLE IF NOT EXISTS review_history (
  id          SERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase_id   TEXT NOT NULL,
  date        TEXT NOT NULL,
  touch_count INT DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, phrase_id, date)
);

-- ============================================
-- RLS（行レベルセキュリティ）
-- ============================================

ALTER TABLE learning_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrase_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrase_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;

-- 各テーブル: 認証ユーザーは自分のデータのみ CRUD 可能
CREATE POLICY "Users manage own phrases" ON learning_phrases
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own mastery" ON phrase_mastery
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own recordings" ON voice_recordings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own links" ON phrase_links
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own stats" ON player_stats
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own review history" ON review_history
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- インデックス（パフォーマンス用）
-- ============================================

CREATE INDEX IF NOT EXISTS idx_learning_phrases_user ON learning_phrases(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_phrases_date ON learning_phrases(user_id, date);
CREATE INDEX IF NOT EXISTS idx_phrase_mastery_user ON phrase_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_recordings_phrase ON voice_recordings(user_id, phrase_id);
CREATE INDEX IF NOT EXISTS idx_phrase_links_phrase ON phrase_links(user_id, phrase_id);
CREATE INDEX IF NOT EXISTS idx_review_history_user_date ON review_history(user_id, date);
