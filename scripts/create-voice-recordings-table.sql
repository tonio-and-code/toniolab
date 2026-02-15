CREATE TABLE IF NOT EXISTS voice_recordings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phrase_id TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_voice_recordings_phrase_id ON voice_recordings(phrase_id);
