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

async function executeQuery<T>(sql: string, params: (string | number | null)[] = []): Promise<D1Result<T>> {
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

export async function addPhrase(phrase: Omit<Phrase, 'created_at'>): Promise<Phrase & { duplicate?: boolean }> {
    // Check for existing phrase with same english text on same date
    const existing = await executeQuery(
        'SELECT id, english, japanese, category, date FROM phrases WHERE LOWER(english) = LOWER(?) AND date = ?',
        [phrase.english, phrase.date]
    );
    if (existing.results && existing.results.length > 0) {
        return { ...(existing.results[0] as Phrase), duplicate: true };
    }
    await executeQuery(
        'INSERT INTO phrases (id, english, japanese, category, date) VALUES (?, ?, ?, ?, ?)',
        [phrase.id, phrase.english, phrase.japanese, phrase.category, phrase.date]
    );
    return phrase as Phrase;
}

export async function updatePhrase(id: string, updates: Partial<Omit<Phrase, 'id' | 'created_at'>>): Promise<void> {
    const fields: string[] = [];
    const values: string[] = [];

    if (updates.english !== undefined) {
        fields.push('english = ?');
        values.push(updates.english);
    }
    if (updates.japanese !== undefined) {
        fields.push('japanese = ?');
        values.push(updates.japanese);
    }
    if (updates.category !== undefined) {
        fields.push('category = ?');
        values.push(updates.category);
    }
    if (updates.date !== undefined) {
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

// Mastery tracking (0-3 base + 6=CROWN for chakra system)
export interface PhraseMastery {
    phrase_id: string;
    mastery_level: number; // 0-3, 6
    updated_at: string;
    last_leveled_at: string | null;
    card_points: number;
    card_name: string | null;
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

export async function getAllMasteryWithDates(): Promise<{ mastery: Record<string, number>; lastLeveled: Record<string, string>; cardPoints: Record<string, number>; cardNames: Record<string, string> }> {
    try {
        const result = await executeQuery<PhraseMastery>('SELECT * FROM phrase_mastery');
        const mastery: Record<string, number> = {};
        const lastLeveled: Record<string, string> = {};
        const cardPoints: Record<string, number> = {};
        const cardNames: Record<string, string> = {};
        result.results.forEach(m => {
            mastery[m.phrase_id] = m.mastery_level;
            if (m.last_leveled_at) lastLeveled[m.phrase_id] = m.last_leveled_at;
            cardPoints[m.phrase_id] = m.card_points || 0;
            if (m.card_name) cardNames[m.phrase_id] = m.card_name;
        });
        return { mastery, lastLeveled, cardPoints, cardNames };
    } catch {
        return { mastery: {}, lastLeveled: {}, cardPoints: {}, cardNames: {} };
    }
}

export async function setMastery(phraseId: string, level: number, lastLeveledAt?: string): Promise<void> {
    const now = new Date().toISOString();
    if (lastLeveledAt) {
        await executeQuery(
            `INSERT INTO phrase_mastery (phrase_id, mastery_level, updated_at, last_leveled_at)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(phrase_id) DO UPDATE SET
             mastery_level = ?,
             updated_at = ?,
             last_leveled_at = ?`,
            [phraseId, level.toString(), now, lastLeveledAt, level.toString(), now, lastLeveledAt]
        );
    } else {
        await executeQuery(
            `INSERT INTO phrase_mastery (phrase_id, mastery_level, updated_at)
             VALUES (?, ?, ?)
             ON CONFLICT(phrase_id) DO UPDATE SET
             mastery_level = ?,
             updated_at = ?`,
            [phraseId, level.toString(), now, level.toString(), now]
        );
    }
}

export async function resetMastery(): Promise<void> {
    await executeQuery('DELETE FROM phrase_mastery');
}

// Card points: accumulate gacha sparks per phrase for collectible card ranks
export async function addCardPoints(phraseId: string, points: number): Promise<number> {
    const now = new Date().toISOString();
    await executeQuery(
        `INSERT INTO phrase_mastery (phrase_id, mastery_level, updated_at, card_points)
         VALUES (?, 0, ?, ?)
         ON CONFLICT(phrase_id) DO UPDATE SET
         card_points = COALESCE(card_points, 0) + ?,
         updated_at = ?`,
        [phraseId, now, points.toString(), points.toString(), now]
    );
    const result = await executeQuery<{ card_points: number }>(
        'SELECT COALESCE(card_points, 0) as card_points FROM phrase_mastery WHERE phrase_id = ?',
        [phraseId]
    );
    return result.results[0]?.card_points || 0;
}

export async function setCardName(phraseId: string, name: string | null): Promise<void> {
    const now = new Date().toISOString();
    await executeQuery(
        `INSERT INTO phrase_mastery (phrase_id, mastery_level, updated_at, card_name)
         VALUES (?, 0, ?, ?)
         ON CONFLICT(phrase_id) DO UPDATE SET
         card_name = ?,
         updated_at = ?`,
        [phraseId, now, name, name, now]
    );
}

export async function getCardPoints(phraseId: string): Promise<number> {
    try {
        const result = await executeQuery<{ card_points: number }>(
            'SELECT COALESCE(card_points, 0) as card_points FROM phrase_mastery WHERE phrase_id = ?',
            [phraseId]
        );
        return result.results[0]?.card_points || 0;
    } catch {
        return 0;
    }
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

// ============================================================
// Goroku (俺語録) - 31-Day Review System (300 expressions)
// ============================================================

export interface GorokuEntry {
    id: string;
    day_slot: number;       // 1-31 (day of month for review)
    japanese: string;
    english: string[];      // 4 levels: [0]=NEW, [1]=(1), [2]=(2), [3]=OK/REQUIEM
    literal: string | null;
    context: string;
    category: string;
    mastery_level: number;  // 0=NEW, 1=(1), 2=(2), 3=OK
    slot: string | null;        // swappable word in english[1] for pattern practice
    slot_hints: string[] | null; // example replacement words
    created_at: string;
}

// DB stores english and slot_hints as JSON text, parse on read
function parseGorokuRow(row: Record<string, unknown>): GorokuEntry {
    const r = row as unknown as GorokuEntry & { english: unknown; slot_hints: unknown };
    let english: string[];
    if (typeof r.english === 'string') {
        try {
            const parsed = JSON.parse(r.english);
            english = Array.isArray(parsed) ? parsed : [r.english, r.english, r.english, r.english];
        } catch {
            english = [r.english, r.english, r.english, r.english];
        }
    } else {
        english = r.english as string[];
    }
    let slot_hints: string[] | null = null;
    if (typeof r.slot_hints === 'string' && r.slot_hints) {
        try { slot_hints = JSON.parse(r.slot_hints); } catch { /* ignore */ }
    } else if (Array.isArray(r.slot_hints)) {
        slot_hints = r.slot_hints;
    }
    return { ...r, english, slot_hints } as GorokuEntry;
}

export async function initGorokuTable(): Promise<void> {
    await executeQuery('DROP TABLE IF EXISTS goroku');
    await executeQuery(`
        CREATE TABLE goroku (
            id TEXT PRIMARY KEY,
            day_slot INTEGER NOT NULL CHECK(day_slot >= 1 AND day_slot <= 31),
            japanese TEXT NOT NULL,
            english TEXT NOT NULL,
            literal TEXT,
            context TEXT NOT NULL,
            category TEXT NOT NULL,
            mastery_level INTEGER DEFAULT 0,
            slot TEXT,
            slot_hints TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
    await executeQuery('CREATE INDEX idx_goroku_day_slot ON goroku(day_slot)');
    await executeQuery('CREATE INDEX idx_goroku_category ON goroku(category)');
}

export async function getAllGoroku(): Promise<GorokuEntry[]> {
    const result = await executeQuery<Record<string, unknown>>('SELECT * FROM goroku ORDER BY day_slot ASC, id ASC');
    return result.results.map(parseGorokuRow);
}

export async function getGorokuByDaySlot(daySlot: number): Promise<GorokuEntry[]> {
    const result = await executeQuery<Record<string, unknown>>(
        'SELECT * FROM goroku WHERE day_slot = ? ORDER BY id ASC',
        [daySlot.toString()]
    );
    return result.results.map(parseGorokuRow);
}

export async function addGoroku(data: {
    id: string;
    day_slot: number;
    japanese: string;
    english: string[] | string;
    literal?: string;
    context: string;
    category: string;
    slot?: string;
    slotHints?: string[];
}): Promise<GorokuEntry> {
    const now = new Date().toISOString();
    const englishArr = Array.isArray(data.english) ? data.english : [data.english, data.english, data.english, data.english];
    const englishJson = JSON.stringify(englishArr);
    const slotHintsJson = data.slotHints ? JSON.stringify(data.slotHints) : null;
    await executeQuery(
        `INSERT INTO goroku (id, day_slot, japanese, english, literal, context, category, mastery_level, slot, slot_hints, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
        [data.id, data.day_slot.toString(), data.japanese, englishJson, data.literal || '', data.context, data.category, data.slot || '', slotHintsJson || '', now]
    );
    return {
        id: data.id,
        day_slot: data.day_slot,
        japanese: data.japanese,
        english: englishArr,
        literal: data.literal || null,
        context: data.context,
        category: data.category,
        mastery_level: 0,
        slot: data.slot || null,
        slot_hints: data.slotHints || null,
        created_at: now,
    };
}

export async function updateGoroku(id: string, data: Partial<{
    japanese: string;
    english: string[] | string;
    literal: string;
    context: string;
    category: string;
    mastery_level: number;
}>): Promise<void> {
    const updates: string[] = [];
    const values: string[] = [];
    if (data.japanese !== undefined) { updates.push('japanese = ?'); values.push(data.japanese); }
    if (data.english !== undefined) {
        const englishJson = Array.isArray(data.english) ? JSON.stringify(data.english) : data.english;
        updates.push('english = ?'); values.push(englishJson);
    }
    if (data.literal !== undefined) { updates.push('literal = ?'); values.push(data.literal); }
    if (data.context !== undefined) { updates.push('context = ?'); values.push(data.context); }
    if (data.category !== undefined) { updates.push('category = ?'); values.push(data.category); }
    if (data.mastery_level !== undefined) { updates.push('mastery_level = ?'); values.push(data.mastery_level.toString()); }
    if (updates.length === 0) return;
    values.push(id);
    await executeQuery(`UPDATE goroku SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteGoroku(id: string): Promise<void> {
    await executeQuery('DELETE FROM goroku WHERE id = ?', [id]);
}

// Review counts: daily mastery level-up taps + XP
export async function initReviewCountsTable(): Promise<void> {
    await executeQuery(
        `CREATE TABLE IF NOT EXISTS review_counts (
            date TEXT PRIMARY KEY,
            count INTEGER DEFAULT 0,
            xp INTEGER DEFAULT 0
        )`
    );
    // Add xp column if missing (migration for existing tables)
    try {
        await executeQuery(`ALTER TABLE review_counts ADD COLUMN xp INTEGER DEFAULT 0`);
    } catch {
        // column already exists
    }
    try {
        await executeQuery(`ALTER TABLE review_counts ADD COLUMN sparks INTEGER DEFAULT 0`);
    } catch {
        // column already exists
    }
}

export async function getReviewCount(date: string): Promise<{ count: number; xp: number; sparks: number }> {
    const result = await executeQuery<{ count: number; xp: number; sparks: number }>(
        `SELECT count, COALESCE(xp, 0) as xp, COALESCE(sparks, 0) as sparks FROM review_counts WHERE date = ?`,
        [date]
    );
    return result.results[0] || { count: 0, xp: 0, sparks: 0 };
}

export async function incrementReviewCount(date: string, xpGained: number = 0, sparksGained: number = 0): Promise<{ count: number; xp: number; sparks: number }> {
    await executeQuery(
        `INSERT INTO review_counts (date, count, xp, sparks) VALUES (?, 1, ?, ?)
         ON CONFLICT(date) DO UPDATE SET count = count + 1, xp = xp + ?, sparks = sparks + ?`,
        [date, xpGained, sparksGained, xpGained, sparksGained]
    );
    const result = await executeQuery<{ count: number; xp: number; sparks: number }>(
        `SELECT count, COALESCE(xp, 0) as xp, COALESCE(sparks, 0) as sparks FROM review_counts WHERE date = ?`,
        [date]
    );
    return result.results[0] || { count: 0, xp: 0, sparks: 0 };
}

export async function getMonthlyReviewCounts(yearMonth: string): Promise<Record<string, { count: number; xp: number; sparks: number }>> {
    const result = await executeQuery<{ date: string; count: number; xp: number; sparks: number }>(
        `SELECT date, count, COALESCE(xp, 0) as xp, COALESCE(sparks, 0) as sparks FROM review_counts WHERE date LIKE ?`,
        [`${yearMonth}%`]
    );
    const map: Record<string, { count: number; xp: number; sparks: number }> = {};
    for (const row of result.results) {
        map[row.date] = { count: row.count, xp: row.xp, sparks: row.sparks };
    }
    return map;
}

// Player stats: cumulative XP + level tracking + bonus system
export async function initPlayerStatsTable(): Promise<void> {
    await executeQuery(
        `CREATE TABLE IF NOT EXISTS player_stats (
            id TEXT PRIMARY KEY DEFAULT 'default',
            total_xp INTEGER DEFAULT 0,
            total_touches INTEGER DEFAULT 0,
            updated_at TEXT DEFAULT (datetime('now'))
        )`
    );
    // Ensure row exists
    await executeQuery(
        `INSERT OR IGNORE INTO player_stats (id, total_xp, total_touches) VALUES ('default', 0, 0)`
    );
    // Phase 4 migration: bonus system columns
    try { await executeQuery(`ALTER TABLE player_stats ADD COLUMN sparks INTEGER DEFAULT 0`); } catch { /* exists */ }
    try { await executeQuery(`ALTER TABLE player_stats ADD COLUMN pity_counter INTEGER DEFAULT 0`); } catch { /* exists */ }
    try { await executeQuery(`ALTER TABLE player_stats ADD COLUMN legendary_count INTEGER DEFAULT 0`); } catch { /* exists */ }
}

export async function getPlayerStats(): Promise<{
    total_xp: number; total_touches: number;
    sparks: number; pity_counter: number; legendary_count: number;
}> {
    const result = await executeQuery<{
        total_xp: number; total_touches: number;
        sparks: number; pity_counter: number; legendary_count: number;
    }>(
        `SELECT total_xp, total_touches,
                COALESCE(sparks, 0) as sparks,
                COALESCE(pity_counter, 0) as pity_counter,
                COALESCE(legendary_count, 0) as legendary_count
         FROM player_stats WHERE id = 'default'`
    );
    return result.results[0] || { total_xp: 0, total_touches: 0, sparks: 0, pity_counter: 0, legendary_count: 0 };
}

export async function addPlayerXP(xp: number): Promise<{ total_xp: number; total_touches: number; sparks: number; pity_counter: number; legendary_count: number }> {
    await executeQuery(
        `INSERT INTO player_stats (id, total_xp, total_touches) VALUES ('default', ?, 1)
         ON CONFLICT(id) DO UPDATE SET total_xp = total_xp + ?, total_touches = total_touches + 1, updated_at = datetime('now')`,
        [xp.toString(), xp.toString()]
    );
    return getPlayerStats();
}

// Gacha probability table (cumulative thresholds)
type GachaTier = 'MISS' | 'BONUS' | 'GREAT' | 'SUPER' | 'MEGA' | 'LEGENDARY' | 'MYTHIC' | 'SHINY' | 'PHANTOM';

// Chain tier for 連荘 system: 0=normal, 1=kakuhen(確変), 2=gekiatsu(激熱), 3=god(神)
type ChainTier = 0 | 1 | 2 | 3;

type GachaEntry = { tier: GachaTier; threshold: number; sparks: number };

// Normal mode (chain 0-2)
const GACHA_TABLE: GachaEntry[] = [
    { tier: 'PHANTOM',   threshold: 0.00012, sparks: 2000 },
    { tier: 'SHINY',     threshold: 0.00036, sparks: 500 },
    { tier: 'MYTHIC',    threshold: 0.00286, sparks: 100 },
    { tier: 'LEGENDARY', threshold: 0.00786, sparks: 30 },
    { tier: 'MEGA',      threshold: 0.02786, sparks: 10 },
    { tier: 'SUPER',     threshold: 0.07786, sparks: 5 },
    { tier: 'GREAT',     threshold: 0.17786, sparks: 3 },
    { tier: 'BONUS',     threshold: 0.39786, sparks: 2 },
    { tier: 'MISS',      threshold: 1.000,   sparks: 0 },
];

// 確変 mode (chain 3-4): MISS drops to 40%, ultra-rares x2
const GACHA_TABLE_KAKUHEN: GachaEntry[] = [
    { tier: 'PHANTOM',   threshold: 0.00025, sparks: 2000 },
    { tier: 'SHINY',     threshold: 0.00075, sparks: 500 },
    { tier: 'MYTHIC',    threshold: 0.01275, sparks: 100 },
    { tier: 'LEGENDARY', threshold: 0.03275, sparks: 30 },
    { tier: 'MEGA',      threshold: 0.08275, sparks: 10 },
    { tier: 'SUPER',     threshold: 0.16275, sparks: 5 },
    { tier: 'GREAT',     threshold: 0.31275, sparks: 3 },
    { tier: 'BONUS',     threshold: 0.60000, sparks: 2 },
    { tier: 'MISS',      threshold: 1.000,   sparks: 0 },
];

// 激熱 mode (chain 5-9): MISS drops to 25%, ultra-rares x5
const GACHA_TABLE_GEKIATSU: GachaEntry[] = [
    { tier: 'PHANTOM',   threshold: 0.0006,  sparks: 2000 },
    { tier: 'SHINY',     threshold: 0.0018,  sparks: 500 },
    { tier: 'MYTHIC',    threshold: 0.0143,  sparks: 100 },
    { tier: 'LEGENDARY', threshold: 0.0393,  sparks: 30 },
    { tier: 'MEGA',      threshold: 0.1093,  sparks: 10 },
    { tier: 'SUPER',     threshold: 0.2093,  sparks: 5 },
    { tier: 'GREAT',     threshold: 0.4093,  sparks: 3 },
    { tier: 'BONUS',     threshold: 0.7500,  sparks: 2 },
    { tier: 'MISS',      threshold: 1.000,   sparks: 0 },
];

// 神 mode (chain 10+): MISS drops to 15%, ultra-rares x10
const GACHA_TABLE_GOD: GachaEntry[] = [
    { tier: 'PHANTOM',   threshold: 0.0012,  sparks: 2000 },
    { tier: 'SHINY',     threshold: 0.0036,  sparks: 500 },
    { tier: 'MYTHIC',    threshold: 0.0286,  sparks: 100 },
    { tier: 'LEGENDARY', threshold: 0.0786,  sparks: 30 },
    { tier: 'MEGA',      threshold: 0.1786,  sparks: 10 },
    { tier: 'SUPER',     threshold: 0.2786,  sparks: 5 },
    { tier: 'GREAT',     threshold: 0.4786,  sparks: 3 },
    { tier: 'BONUS',     threshold: 0.8500,  sparks: 2 },
    { tier: 'MISS',      threshold: 1.000,   sparks: 0 },
];

const CHAIN_TABLES: Record<ChainTier, GachaEntry[]> = {
    0: GACHA_TABLE,
    1: GACHA_TABLE_KAKUHEN,
    2: GACHA_TABLE_GEKIATSU,
    3: GACHA_TABLE_GOD,
};

export interface GachaResult {
    tier: GachaTier;
    sparks_won: number;
    total_sparks: number;
    pity_counter: number;
    legendary_count: number;
    total_xp: number;
    total_touches: number;
    card_points_earned: number;
    card_total_points: number;
    luck_multiplier: number;
}

export async function rollGachaAndUpdate(xp: number, phraseId?: string, fever?: boolean, chainTier?: ChainTier): Promise<GachaResult> {
    // 1. Add XP + increment touches
    await executeQuery(
        `INSERT INTO player_stats (id, total_xp, total_touches) VALUES ('default', ?, 1)
         ON CONFLICT(id) DO UPDATE SET total_xp = total_xp + ?, total_touches = total_touches + 1, updated_at = datetime('now')`,
        [xp.toString(), xp.toString()]
    );

    // 2. Read current pity_counter + sparks (for luck modifier)
    let stats;
    try {
        stats = await getPlayerStats();
    } catch {
        await initPlayerStatsTable();
        stats = await getPlayerStats();
    }
    const pity = stats.pity_counter;

    // 3. Select probability table based on chain tier
    // Backward compat: if fever=true but no chainTier, map to kakuhen (chain tier 1)
    const ct: ChainTier = chainTier !== undefined ? chainTier : (fever ? 1 : 0);
    const table = CHAIN_TABLES[ct] || GACHA_TABLE;

    // 4. Progressive luck: more SP = better ultra-rare odds (MYTHIC/SHINY/PHANTOM only)
    // luckMultiplier: 1.0 at 0 SP → 2.0 at 10000+ SP
    const luckMultiplier = 1 + Math.min(stats.sparks / 10000, 1.0);

    // Apply luck boost to ultra-rare tiers (first 3 entries)
    const boostedTable: GachaEntry[] = table.map((entry, i) => {
        if (i < 3 && luckMultiplier > 1) {
            // Boost PHANTOM/SHINY/MYTHIC thresholds
            const prevThreshold = i === 0 ? 0 : table[i - 1].threshold;
            const sliceWidth = entry.threshold - prevThreshold;
            const boostedWidth = sliceWidth * luckMultiplier;
            return { ...entry, threshold: prevThreshold + boostedWidth };
        }
        return entry;
    });
    // Recalculate cumulative thresholds after boosting ultra-rares
    // The boost expands ultra-rare slices, pushing everything else up proportionally
    // Normalize so MISS still fills to 1.0
    const finalTable: GachaEntry[] = [];
    let cumulative = 0;
    for (let i = 0; i < boostedTable.length; i++) {
        const prevCum = i === 0 ? 0 : table[i - 1].threshold;
        const origWidth = table[i].threshold - prevCum;
        const entry = boostedTable[i];
        const boostedPrev = i === 0 ? 0 : finalTable[i - 1].threshold;
        if (i < 3) {
            // Ultra-rare: use boosted width
            cumulative = boostedPrev + (entry.threshold - (i === 0 ? 0 : boostedTable[i - 1].threshold));
        } else if (i === boostedTable.length - 1) {
            cumulative = 1.0; // MISS always fills to 1.0
        } else {
            // Scale remaining tiers to fit
            const ultraRareTotal = finalTable.length >= 3 ? finalTable[2].threshold : 0;
            const origUltraTotal = table[2].threshold;
            const remainingSpace = 1.0 - ultraRareTotal;
            const origRemaining = 1.0 - origUltraTotal;
            const scale = origRemaining > 0 ? remainingSpace / origRemaining : 1;
            cumulative = ultraRareTotal + (table[i].threshold - origUltraTotal) * scale;
        }
        finalTable.push({ ...table[i], threshold: cumulative, sparks: table[i].sparks });
        if (i < 3) finalTable[i].threshold = cumulative;
    }

    let roll = Math.random();
    // Pity ceiling: 200 consecutive misses -> guaranteed MEGA+
    if (pity >= 200) {
        roll = Math.random() * (finalTable.find(e => e.tier === 'MEGA')?.threshold || 0.03);
    }

    let tier: GachaTier = 'MISS';
    let sparksWon = 1;
    for (const entry of finalTable) {
        if (roll < entry.threshold) {
            tier = entry.tier;
            sparksWon = entry.sparks;
            break;
        }
    }

    // Chain mode SP multiplier: kakuhen x1.5, gekiatsu x2, god x3
    const chainMultipliers: Record<ChainTier, number> = { 0: 1, 1: 1.5, 2: 2, 3: 3 };
    if (ct > 0 && tier !== 'MISS') {
        sparksWon = Math.round(sparksWon * chainMultipliers[ct]);
    }

    // 5. Update sparks, pity_counter, legendary_count
    const isMiss = tier === 'MISS';
    const legendaryInc = (tier === 'LEGENDARY' || tier === 'MYTHIC' || tier === 'SHINY' || tier === 'PHANTOM') ? 1 : 0;

    try {
        await executeQuery(
            `UPDATE player_stats SET
                sparks = COALESCE(sparks, 0) + ?,
                pity_counter = ${isMiss ? 'COALESCE(pity_counter, 0) + 1' : '0'},
                legendary_count = COALESCE(legendary_count, 0) + ?,
                updated_at = datetime('now')
             WHERE id = 'default'`,
            [sparksWon.toString(), legendaryInc.toString()]
        );
    } catch {
        await initPlayerStatsTable();
        await executeQuery(
            `UPDATE player_stats SET
                sparks = COALESCE(sparks, 0) + ?,
                pity_counter = ${isMiss ? 'COALESCE(pity_counter, 0) + 1' : '0'},
                legendary_count = COALESCE(legendary_count, 0) + ?,
                updated_at = datetime('now')
             WHERE id = 'default'`,
            [sparksWon.toString(), legendaryInc.toString()]
        );
    }

    // 5. Add card points to phrase if phraseId provided
    let cardPointsEarned = sparksWon;
    let cardTotalPoints = 0;
    if (phraseId) {
        cardTotalPoints = await addCardPoints(phraseId, sparksWon);
    }

    // 7. Return full state
    const updated = await getPlayerStats();
    return {
        tier,
        sparks_won: sparksWon,
        total_sparks: updated.sparks,
        pity_counter: updated.pity_counter,
        legendary_count: updated.legendary_count,
        total_xp: updated.total_xp,
        total_touches: updated.total_touches,
        card_points_earned: cardPointsEarned,
        card_total_points: cardTotalPoints,
        luck_multiplier: Math.round(luckMultiplier * 100) / 100,
    };
}

// ============================================
// Date Touches (Calendar touch persistence)
// ============================================

export async function initDateTouchesTable(): Promise<void> {
    await executeQuery(`
        CREATE TABLE IF NOT EXISTS date_touches (
            phrase_date TEXT PRIMARY KEY,
            count INTEGER DEFAULT 0
        )
    `);
}

export async function incrementDateTouch(phraseDate: string): Promise<number> {
    await executeQuery(
        `INSERT INTO date_touches (phrase_date, count) VALUES (?, 1)
         ON CONFLICT(phrase_date) DO UPDATE SET count = count + 1`,
        [phraseDate]
    );
    const result = await executeQuery<{ count: number }>(
        `SELECT count FROM date_touches WHERE phrase_date = ?`,
        [phraseDate]
    );
    return result.results[0]?.count || 1;
}

export async function getMonthlyDateTouches(yearMonth: string): Promise<Record<string, number>> {
    const result = await executeQuery<{ phrase_date: string; count: number }>(
        `SELECT phrase_date, count FROM date_touches WHERE phrase_date LIKE ?`,
        [`${yearMonth}%`]
    );
    const map: Record<string, number> = {};
    for (const row of result.results) {
        map[row.phrase_date] = row.count;
    }
    return map;
}

export async function getGorokuDaySlotCounts(): Promise<Record<number, { total: number; mastered: number }>> {
    const result = await executeQuery<{ day_slot: number; total: number; mastered: number }>(
        `SELECT day_slot, COUNT(*) as total, SUM(CASE WHEN mastery_level >= 3 THEN 1 ELSE 0 END) as mastered
         FROM goroku GROUP BY day_slot ORDER BY day_slot`
    );
    const map: Record<number, { total: number; mastered: number }> = {};
    result.results.forEach(r => { map[r.day_slot] = { total: r.total, mastered: r.mastered }; });
    return map;
}
