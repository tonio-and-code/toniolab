// Cloudflare D1 API helper
// Uses Cloudflare REST API to access D1 database

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7efac1047fba804c1b7ea5a10868dbfc';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATABASE_ID = 'f4801cde-0f1d-4bc9-beec-5d8709813798';

interface D1Result<T> {
    results: T[];
    success: boolean;
    meta?: {
        duration: number;
        changes: number;
        last_row_id: number;
    };
}

interface D1Response<T> {
    result: D1Result<T>[];
    success: boolean;
    errors: { message: string }[];
}

export interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
    created_at?: string;
}

async function executeQuery<T>(sql: string, params: (string | null)[] = []): Promise<D1Result<T>> {
    if (!CLOUDFLARE_API_TOKEN) {
        throw new Error('CLOUDFLARE_API_TOKEN is not set');
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sql,
                params,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`D1 API error: ${error}`);
    }

    const data: D1Response<T> = await response.json();

    if (!data.success) {
        throw new Error(`D1 query failed: ${data.errors.map(e => e.message).join(', ')}`);
    }

    return data.result[0];
}

export async function getAllPhrases(): Promise<Phrase[]> {
    const result = await executeQuery<Phrase>('SELECT * FROM phrases ORDER BY date DESC, id ASC');
    return result.results;
}

export async function getPhrasesByDate(date: string): Promise<Phrase[]> {
    const result = await executeQuery<Phrase>(
        'SELECT * FROM phrases WHERE date = ? ORDER BY id ASC',
        [date]
    );
    return result.results;
}

export async function addPhrase(phrase: Omit<Phrase, 'created_at'>): Promise<Phrase> {
    await executeQuery(
        'INSERT INTO phrases (id, english, japanese, category, date) VALUES (?, ?, ?, ?, ?)',
        [phrase.id, phrase.english, phrase.japanese, phrase.category, phrase.date]
    );
    return phrase as Phrase;
}

export async function updatePhrase(id: string, updates: Partial<Omit<Phrase, 'id' | 'created_at'>>): Promise<void> {
    const fields: string[] = [];
    const values: string[] = [];

    if (updates.english) {
        fields.push('english = ?');
        values.push(updates.english);
    }
    if (updates.japanese) {
        fields.push('japanese = ?');
        values.push(updates.japanese);
    }
    if (updates.category) {
        fields.push('category = ?');
        values.push(updates.category);
    }
    if (updates.date) {
        fields.push('date = ?');
        values.push(updates.date);
    }

    if (fields.length === 0) return;

    values.push(id);
    await executeQuery(
        `UPDATE phrases SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
}

export async function deletePhrase(id: string): Promise<void> {
    await executeQuery('DELETE FROM phrases WHERE id = ?', [id]);
}

export async function getUniqueDates(): Promise<string[]> {
    const result = await executeQuery<{ date: string }>(
        'SELECT DISTINCT date FROM phrases ORDER BY date DESC'
    );
    return result.results.map(r => r.date);
}

// Progress tracking (legacy - kept for compatibility)
export interface Progress {
    phrase_id: string;
    play_count: number;
    last_played_at: string | null;
    mastered: boolean;
}

export async function getAllProgress(): Promise<{ [key: string]: Progress }> {
    const result = await executeQuery<Progress>('SELECT * FROM progress');
    const progressMap: { [key: string]: Progress } = {};
    result.results.forEach(p => {
        progressMap[p.phrase_id] = p;
    });
    return progressMap;
}

export async function updateProgress(phraseId: string): Promise<Progress> {
    const now = new Date().toISOString();

    // Upsert: Insert or update
    await executeQuery(
        `INSERT INTO progress (phrase_id, play_count, last_played_at, mastered)
         VALUES (?, 1, ?, FALSE)
         ON CONFLICT(phrase_id) DO UPDATE SET
         play_count = play_count + 1,
         last_played_at = ?,
         mastered = CASE WHEN play_count + 1 >= 3 THEN TRUE ELSE FALSE END`,
        [phraseId, now, now]
    );

    // Return updated progress
    const result = await executeQuery<Progress>(
        'SELECT * FROM progress WHERE phrase_id = ?',
        [phraseId]
    );
    return result.results[0];
}

export async function resetProgress(): Promise<void> {
    await executeQuery('DELETE FROM progress');
}

// Mastery tracking (3-level: 0=New, 1=Learning, 2=Mastered)
export interface PhraseMastery {
    phrase_id: string;
    mastery_level: number; // 0, 1, 2
    updated_at: string;
}

export async function getAllMastery(): Promise<Record<string, number>> {
    try {
        const result = await executeQuery<PhraseMastery>('SELECT * FROM phrase_mastery');
        const masteryMap: Record<string, number> = {};
        result.results.forEach(m => {
            masteryMap[m.phrase_id] = m.mastery_level;
        });
        return masteryMap;
    } catch {
        // Table might not exist yet
        return {};
    }
}

export async function setMastery(phraseId: string, level: number): Promise<void> {
    const now = new Date().toISOString();
    await executeQuery(
        `INSERT INTO phrase_mastery (phrase_id, mastery_level, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(phrase_id) DO UPDATE SET
         mastery_level = ?,
         updated_at = ?`,
        [phraseId, level.toString(), now, level.toString(), now]
    );
}

export async function resetMastery(): Promise<void> {
    await executeQuery('DELETE FROM phrase_mastery');
}

// ============================================
// User Phrases (Personal Collection)
// ============================================

export interface UserPhrase {
    id: string;
    phrase: string;
    type: string;              // idiom, phrasal verb, slang, etc.
    meaning: string;           // Japanese meaning
    note: string | null;       // Personal note or usage tip
    example: string | null;    // Example sentence
    source: string | null;     // Where they found it (url, text, etc.)
    mastery_level: number;     // 0=New, 1=Seen, 2=Practiced, 3=Comfortable, 4=Owned
    times_used: number;        // How many times they've reviewed/used it
    created_at: string;
    last_reviewed_at: string | null;
    // Video clip reference (from YouGlish)
    video_id: string | null;       // YouTube video ID
    video_timestamp: number | null; // Start time in seconds
    video_text: string | null;      // Subtitle text at that moment
}

export async function getAllUserPhrases(): Promise<UserPhrase[]> {
    try {
        const result = await executeQuery<UserPhrase>(
            'SELECT * FROM user_phrases ORDER BY created_at DESC'
        );
        return result.results;
    } catch (error) {
        console.error('Error getting user phrases:', error);
        return [];
    }
}

export async function getUserPhraseByPhrase(phrase: string): Promise<UserPhrase | null> {
    try {
        const result = await executeQuery<UserPhrase>(
            'SELECT * FROM user_phrases WHERE LOWER(phrase) = LOWER(?)',
            [phrase]
        );
        return result.results[0] || null;
    } catch {
        return null;
    }
}

export async function addUserPhrase(data: {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    note?: string;
    example?: string;
    source?: string;
    video_id?: string;
    video_timestamp?: number;
    video_text?: string;
    date?: string;
}): Promise<UserPhrase> {
    // Use T12:00:00Z (noon UTC) to avoid timezone date shift issues
    const now = data.date ? `${data.date}T12:00:00.000Z` : new Date().toISOString();

    await executeQuery(
        `INSERT INTO user_phrases (id, phrase, type, meaning, note, example, source, mastery_level, times_used, created_at, last_reviewed_at, video_id, video_timestamp, video_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, NULL, ?, ?, ?)
         ON CONFLICT(phrase) DO UPDATE SET
         type = ?,
         meaning = ?,
         note = COALESCE(?, note),
         example = COALESCE(?, example),
         source = COALESCE(?, source),
         video_id = COALESCE(?, video_id),
         video_timestamp = COALESCE(?, video_timestamp),
         video_text = COALESCE(?, video_text)`,
        [
            data.id, data.phrase, data.type, data.meaning,
            data.note || null, data.example || null, data.source || null, now,
            data.video_id || null, data.video_timestamp?.toString() || null, data.video_text || null,
            data.type, data.meaning, data.note || null, data.example || null, data.source || null,
            data.video_id || null, data.video_timestamp?.toString() || null, data.video_text || null
        ]
    );

    return {
        id: data.id,
        phrase: data.phrase,
        type: data.type,
        meaning: data.meaning,
        note: data.note || null,
        example: data.example || null,
        source: data.source || null,
        mastery_level: 0,
        times_used: 0,
        created_at: now,
        last_reviewed_at: null,
        video_id: data.video_id || null,
        video_timestamp: data.video_timestamp || null,
        video_text: data.video_text || null,
    };
}

export async function updateUserPhraseMastery(phraseId: string, level: number): Promise<void> {
    const now = new Date().toISOString();
    await executeQuery(
        `UPDATE user_phrases SET mastery_level = ?, times_used = times_used + 1, last_reviewed_at = ? WHERE id = ?`,
        [level.toString(), now, phraseId]
    );
}

export async function incrementPhraseUsage(phraseId: string): Promise<void> {
    const now = new Date().toISOString();
    await executeQuery(
        `UPDATE user_phrases SET times_used = times_used + 1, last_reviewed_at = ? WHERE id = ?`,
        [now, phraseId]
    );
}

export async function deleteUserPhrase(id: string): Promise<void> {
    await executeQuery('DELETE FROM user_phrases WHERE id = ?', [id]);
}

export async function updateUserPhrase(id: string, data: {
    phrase?: string;
    type?: string;
    meaning?: string;
    note?: string;
    example?: string;
}): Promise<void> {
    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (data.phrase !== undefined) { updates.push('phrase = ?'); values.push(data.phrase); }
    if (data.type !== undefined) { updates.push('type = ?'); values.push(data.type); }
    if (data.meaning !== undefined) { updates.push('meaning = ?'); values.push(data.meaning); }
    if (data.note !== undefined) { updates.push('note = ?'); values.push(data.note || null); }
    if (data.example !== undefined) { updates.push('example = ?'); values.push(data.example || null); }

    if (updates.length > 0) {
        values.push(id);
        await executeQuery(`UPDATE user_phrases SET ${updates.join(', ')} WHERE id = ?`, values);
    }
}

export async function searchUserPhrases(query: string): Promise<UserPhrase[]> {
    try {
        const result = await executeQuery<UserPhrase>(
            `SELECT * FROM user_phrases WHERE phrase LIKE ? OR meaning LIKE ? ORDER BY times_used DESC`,
            [`%${query}%`, `%${query}%`]
        );
        return result.results;
    } catch {
        return [];
    }
}

export async function updateUserPhraseVideo(
    id: string,
    videoId: string | null,
    videoTimestamp: number | null,
    videoText: string | null
): Promise<void> {
    await executeQuery(
        `UPDATE user_phrases SET video_id = ?, video_timestamp = ?, video_text = ? WHERE id = ?`,
        [videoId || null, videoTimestamp?.toString() || null, videoText || null, id]
    );
}

export async function updateUserPhraseReview(
    id: string,
    reviewSentence: string,
    reviewIdiom: string | null,
    reviewIdiomMeaning: string | null,
    reviewSentenceJa: string | null = null
): Promise<void> {
    await executeQuery(
        `UPDATE user_phrases SET review_sentence = ?, review_idiom = ?, review_idiom_meaning = ?, review_sentence_ja = ? WHERE id = ?`,
        [reviewSentence, reviewIdiom || null, reviewIdiomMeaning || null, reviewSentenceJa || null, id]
    );
}

export async function getUserPhraseStats(): Promise<{
    total: number;
    byMastery: Record<number, number>;
    byType: Record<string, number>;
}> {
    try {
        const all = await getAllUserPhrases();
        const byMastery: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
        const byType: Record<string, number> = {};

        all.forEach(p => {
            byMastery[p.mastery_level] = (byMastery[p.mastery_level] || 0) + 1;
            byType[p.type] = (byType[p.type] || 0) + 1;
        });

        return { total: all.length, byMastery, byType };
    } catch {
        return { total: 0, byMastery: {}, byType: {} };
    }
}

// ============================================
// Learning Time Tracking (Daily Study Log)
// ============================================

export interface LearningTime {
    id: number;
    date: string;        // YYYY-MM-DD
    minutes: number;     // Total minutes studied that day
    created_at: string;
    updated_at: string;
}

export async function initLearningTimeTable(): Promise<void> {
    await executeQuery(`
        CREATE TABLE IF NOT EXISTS learning_time (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT UNIQUE NOT NULL,
            minutes INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);
}

export async function getLearningTimeByDate(date: string): Promise<LearningTime | null> {
    try {
        const result = await executeQuery<LearningTime>(
            'SELECT * FROM learning_time WHERE date = ?',
            [date]
        );
        return result.results[0] || null;
    } catch {
        return null;
    }
}

export async function getAllLearningTime(): Promise<LearningTime[]> {
    try {
        const result = await executeQuery<LearningTime>(
            'SELECT * FROM learning_time ORDER BY date DESC'
        );
        return result.results;
    } catch {
        return [];
    }
}

export async function addLearningTime(date: string, minutes: number): Promise<LearningTime> {
    const now = new Date().toISOString();

    await executeQuery(
        `INSERT INTO learning_time (date, minutes, created_at, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(date) DO UPDATE SET
         minutes = minutes + ?,
         updated_at = ?`,
        [date, minutes.toString(), now, now, minutes.toString(), now]
    );

    const result = await executeQuery<LearningTime>(
        'SELECT * FROM learning_time WHERE date = ?',
        [date]
    );
    return result.results[0];
}

export async function setLearningTime(date: string, minutes: number): Promise<LearningTime> {
    const now = new Date().toISOString();

    await executeQuery(
        `INSERT INTO learning_time (date, minutes, created_at, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(date) DO UPDATE SET
         minutes = ?,
         updated_at = ?`,
        [date, minutes.toString(), now, now, minutes.toString(), now]
    );

    const result = await executeQuery<LearningTime>(
        'SELECT * FROM learning_time WHERE date = ?',
        [date]
    );
    return result.results[0];
}

// ============================================
// Daily Goals (Habit Tracking)
// ============================================

export interface DailyGoals {
    id: number;
    minutes_goal: number;
    phrases_goal: number;
    vocab_goal: number;
    updated_at: string;
}

export async function initDailyGoalsTable(): Promise<void> {
    await executeQuery(`
        CREATE TABLE IF NOT EXISTS daily_goals (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            minutes_goal INTEGER NOT NULL DEFAULT 30,
            phrases_goal INTEGER NOT NULL DEFAULT 5,
            vocab_goal INTEGER NOT NULL DEFAULT 3,
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);
    // Insert default row if not exists
    await executeQuery(`
        INSERT OR IGNORE INTO daily_goals (id, minutes_goal, phrases_goal, vocab_goal, updated_at)
        VALUES (1, 30, 5, 3, datetime('now'))
    `);
}

export async function getDailyGoals(): Promise<DailyGoals> {
    try {
        const result = await executeQuery<DailyGoals>('SELECT * FROM daily_goals WHERE id = 1');
        if (result.results[0]) {
            return result.results[0];
        }
        return { id: 1, minutes_goal: 30, phrases_goal: 5, vocab_goal: 3, updated_at: new Date().toISOString() };
    } catch {
        return { id: 1, minutes_goal: 30, phrases_goal: 5, vocab_goal: 3, updated_at: new Date().toISOString() };
    }
}

export async function setDailyGoals(goals: { minutes_goal?: number; phrases_goal?: number; vocab_goal?: number }): Promise<DailyGoals> {
    const now = new Date().toISOString();
    const current = await getDailyGoals();

    const newMinutes = goals.minutes_goal ?? current.minutes_goal;
    const newPhrases = goals.phrases_goal ?? current.phrases_goal;
    const newVocab = goals.vocab_goal ?? current.vocab_goal;

    await executeQuery(
        `INSERT INTO daily_goals (id, minutes_goal, phrases_goal, vocab_goal, updated_at)
         VALUES (1, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
         minutes_goal = ?,
         phrases_goal = ?,
         vocab_goal = ?,
         updated_at = ?`,
        [newMinutes.toString(), newPhrases.toString(), newVocab.toString(), now,
         newMinutes.toString(), newPhrases.toString(), newVocab.toString(), now]
    );

    return { id: 1, minutes_goal: newMinutes, phrases_goal: newPhrases, vocab_goal: newVocab, updated_at: now };
}

export async function getLearningTimeStats(): Promise<{
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    streak: number;
    longestStreak: number;
}> {
    try {
        const all = await getAllLearningTime();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Calculate streak (consecutive days with at least 1 minute)
        let streak = 0;
        let longestStreak = 0;
        let currentStreak = 0;

        // Sort by date descending
        const sorted = [...all].sort((a, b) => b.date.localeCompare(a.date));

        // Check if today or yesterday has learning time to start counting streak
        const checkDate = new Date(today);

        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const record = sorted.find(r => r.date === dateStr);

            if (record && record.minutes > 0) {
                currentStreak++;
                if (i === 0 || streak > 0) {
                    streak = currentStreak;
                }
            } else if (i > 0) {
                // If not the first day (today) and no record, streak breaks
                if (currentStreak > longestStreak) {
                    longestStreak = currentStreak;
                }
                if (streak === 0 && currentStreak > 0) {
                    streak = currentStreak;
                }
                currentStreak = 0;
                if (streak > 0) break; // Stop once we've found the current streak
            }

            checkDate.setDate(checkDate.getDate() - 1);
        }

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }

        // Calculate totals
        const todayRecord = all.find(r => r.date === todayStr);
        const todayMinutes = todayRecord?.minutes || 0;

        // This week (Monday to Sunday)
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const mondayStr = monday.toISOString().split('T')[0];

        const thisWeek = all
            .filter(r => r.date >= mondayStr && r.date <= todayStr)
            .reduce((sum, r) => sum + r.minutes, 0);

        // This month
        const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const thisMonth = all
            .filter(r => r.date >= monthStart && r.date <= todayStr)
            .reduce((sum, r) => sum + r.minutes, 0);

        // Total all time
        const total = all.reduce((sum, r) => sum + r.minutes, 0);

        return {
            today: todayMinutes,
            thisWeek,
            thisMonth,
            total,
            streak,
            longestStreak,
        };
    } catch {
        return { today: 0, thisWeek: 0, thisMonth: 0, total: 0, streak: 0, longestStreak: 0 };
    }
}

// ============================================
// Voice Recordings (User's voice practice)
// ============================================

export interface VoiceRecording {
    id: number;
    phrase_id: string;
    url: string;
    created_at: string;
}

export async function getVoiceRecordings(phraseId: string): Promise<VoiceRecording[]> {
    try {
        const result = await executeQuery<VoiceRecording>(
            'SELECT * FROM voice_recordings WHERE phrase_id = ? ORDER BY created_at DESC',
            [phraseId]
        );
        return result.results;
    } catch {
        return [];
    }
}

export async function getAllVoiceRecordings(): Promise<Record<string, VoiceRecording[]>> {
    try {
        const result = await executeQuery<VoiceRecording>(
            'SELECT * FROM voice_recordings ORDER BY created_at DESC'
        );
        const recordingsMap: Record<string, VoiceRecording[]> = {};
        result.results.forEach(r => {
            if (!recordingsMap[r.phrase_id]) {
                recordingsMap[r.phrase_id] = [];
            }
            recordingsMap[r.phrase_id].push(r);
        });
        return recordingsMap;
    } catch {
        return {};
    }
}

export async function addVoiceRecording(phraseId: string, url: string): Promise<VoiceRecording> {
    const now = new Date().toISOString();
    await executeQuery(
        'INSERT INTO voice_recordings (phrase_id, url, created_at) VALUES (?, ?, ?)',
        [phraseId, url, now]
    );
    const result = await executeQuery<VoiceRecording>(
        'SELECT * FROM voice_recordings WHERE phrase_id = ? ORDER BY created_at DESC LIMIT 1',
        [phraseId]
    );
    return result.results[0];
}

export async function deleteVoiceRecording(id: number): Promise<void> {
    await executeQuery('DELETE FROM voice_recordings WHERE id = ?', [id.toString()]);
}
