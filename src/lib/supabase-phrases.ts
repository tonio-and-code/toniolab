// Supabase CRUD helper for phrase learning system
// All queries are scoped to the authenticated user via RLS

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// ============================================
// Types
// ============================================

export interface LearningPhrase {
    id: string
    user_id: string
    english: string
    japanese: string
    category: string
    date: string
    created_at: string
}

export interface PhraseMasteryRecord {
    id: number
    user_id: string
    phrase_id: string
    mastery_level: number
    card_points: number
    last_leveled_at: string | null
    updated_at: string
}

export interface VoiceRecording {
    id: number
    user_id: string
    phrase_id: string
    url: string
    created_at: string
}

export interface PhraseLink {
    id: number
    user_id: string
    phrase_id: string
    text: string
    created_at: string
}

export interface PlayerStats {
    user_id: string
    total_xp: number
    total_sparks: number
    today_sparks: number
    today_date: string | null
    pity_counter: number
    legendary_count: number
    created_at: string
    updated_at: string
}

// ============================================
// Auth Helper
// ============================================

async function getUserId(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) throw new Error('Not authenticated')
    return user.id
}

// ============================================
// Phrases CRUD
// ============================================

export async function getAllPhrases(): Promise<LearningPhrase[]> {
    const { data, error } = await supabase
        .from('learning_phrases')
        .select('*')
        .order('date', { ascending: false })

    if (error) throw error
    return data || []
}

export async function addPhrase(phrase: {
    english: string
    japanese?: string
    category?: string
    date: string
}): Promise<LearningPhrase> {
    const userId = await getUserId()
    const { data, error } = await supabase
        .from('learning_phrases')
        .insert({
            user_id: userId,
            english: phrase.english,
            japanese: phrase.japanese || '',
            category: phrase.category || 'daily',
            date: phrase.date,
        })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            // Duplicate — return existing
            const { data: existing } = await supabase
                .from('learning_phrases')
                .select('*')
                .eq('user_id', userId)
                .eq('english', phrase.english)
                .single()
            if (existing) return existing
        }
        throw error
    }
    return data
}

export async function updatePhrase(id: string, updates: {
    english?: string
    japanese?: string
    category?: string
}): Promise<void> {
    const { error } = await supabase
        .from('learning_phrases')
        .update(updates)
        .eq('id', id)

    if (error) throw error
}

export async function deletePhrase(id: string): Promise<void> {
    const { error } = await supabase
        .from('learning_phrases')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// ============================================
// Mastery CRUD
// ============================================

export async function getAllMastery(): Promise<{
    mastery: Record<string, number>
    lastLeveled: Record<string, string>
    cardPoints: Record<string, number>
}> {
    const { data, error } = await supabase
        .from('phrase_mastery')
        .select('*')

    if (error) throw error

    const mastery: Record<string, number> = {}
    const lastLeveled: Record<string, string> = {}
    const cardPoints: Record<string, number> = {}

    for (const row of (data || [])) {
        mastery[row.phrase_id] = row.mastery_level
        if (row.last_leveled_at) lastLeveled[row.phrase_id] = row.last_leveled_at
        cardPoints[row.phrase_id] = row.card_points || 0
    }

    return { mastery, lastLeveled, cardPoints }
}

export async function setMastery(
    phraseId: string,
    level: number,
    lastLeveledAt?: string
): Promise<void> {
    const userId = await getUserId()
    const { error } = await supabase
        .from('phrase_mastery')
        .upsert({
            user_id: userId,
            phrase_id: phraseId,
            mastery_level: level,
            last_leveled_at: lastLeveledAt || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,phrase_id' })

    if (error) throw error
}

export async function addCardPoints(
    phraseId: string,
    points: number
): Promise<number> {
    const userId = await getUserId()

    // First try to get existing
    const { data: existing } = await supabase
        .from('phrase_mastery')
        .select('card_points')
        .eq('user_id', userId)
        .eq('phrase_id', phraseId)
        .single()

    const newTotal = (existing?.card_points || 0) + points

    const { error } = await supabase
        .from('phrase_mastery')
        .upsert({
            user_id: userId,
            phrase_id: phraseId,
            card_points: newTotal,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,phrase_id' })

    if (error) throw error
    return newTotal
}

// ============================================
// Voice Recordings
// ============================================

export async function getVoiceRecordings(): Promise<Record<string, VoiceRecording[]>> {
    const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error

    const map: Record<string, VoiceRecording[]> = {}
    for (const rec of (data || [])) {
        if (!map[rec.phrase_id]) map[rec.phrase_id] = []
        map[rec.phrase_id].push(rec)
    }
    return map
}

export async function addVoiceRecording(
    phraseId: string,
    url: string
): Promise<VoiceRecording> {
    const userId = await getUserId()
    const { data, error } = await supabase
        .from('voice_recordings')
        .insert({ user_id: userId, phrase_id: phraseId, url })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteVoiceRecording(id: number): Promise<void> {
    const { error } = await supabase
        .from('voice_recordings')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// ============================================
// Phrase Links
// ============================================

export async function getPhraseLinks(): Promise<Record<string, PhraseLink[]>> {
    const { data, error } = await supabase
        .from('phrase_links')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error

    const map: Record<string, PhraseLink[]> = {}
    for (const link of (data || [])) {
        if (!map[link.phrase_id]) map[link.phrase_id] = []
        map[link.phrase_id].push(link)
    }
    return map
}

export async function addPhraseLink(
    phraseId: string,
    text: string
): Promise<PhraseLink> {
    const userId = await getUserId()
    const { data, error } = await supabase
        .from('phrase_links')
        .insert({ user_id: userId, phrase_id: phraseId, text })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deletePhraseLink(id: number): Promise<void> {
    const { error } = await supabase
        .from('phrase_links')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// ============================================
// Player Stats
// ============================================

export async function getPlayerStats(): Promise<PlayerStats | null> {
    const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .single()

    if (error) {
        if (error.code === 'PGRST116') return null // No row
        throw error
    }
    return data
}

export async function updatePlayerXP(xpToAdd: number): Promise<PlayerStats> {
    const userId = await getUserId()
    const today = new Date().toISOString().slice(0, 10)
    const existing = await getPlayerStats()

    if (existing) {
        const resetDaily = existing.today_date !== today
        const { data, error } = await supabase
            .from('player_stats')
            .update({
                total_xp: existing.total_xp + xpToAdd,
                today_sparks: resetDaily ? 0 : existing.today_sparks,
                today_date: today,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        const { data, error } = await supabase
            .from('player_stats')
            .insert({
                user_id: userId,
                total_xp: xpToAdd,
                today_date: today,
            })
            .select()
            .single()

        if (error) throw error
        return data
    }
}

export async function addSparks(sparksToAdd: number): Promise<PlayerStats> {
    const userId = await getUserId()
    const today = new Date().toISOString().slice(0, 10)
    const existing = await getPlayerStats()

    if (existing) {
        const resetDaily = existing.today_date !== today
        const { data, error } = await supabase
            .from('player_stats')
            .update({
                total_sparks: existing.total_sparks + sparksToAdd,
                today_sparks: (resetDaily ? 0 : existing.today_sparks) + sparksToAdd,
                today_date: today,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        const { data, error } = await supabase
            .from('player_stats')
            .insert({
                user_id: userId,
                total_sparks: sparksToAdd,
                today_sparks: sparksToAdd,
                today_date: today,
            })
            .select()
            .single()

        if (error) throw error
        return data
    }
}

// ============================================
// Review History
// ============================================

export async function recordReviewTouch(
    phraseId: string,
    date: string
): Promise<void> {
    const userId = await getUserId()

    // Try to increment existing
    const { data: existing } = await supabase
        .from('review_history')
        .select('id, touch_count')
        .eq('user_id', userId)
        .eq('phrase_id', phraseId)
        .eq('date', date)
        .single()

    if (existing) {
        await supabase
            .from('review_history')
            .update({ touch_count: existing.touch_count + 1 })
            .eq('id', existing.id)
    } else {
        await supabase
            .from('review_history')
            .insert({ user_id: userId, phrase_id: phraseId, date })
    }
}

export async function getDateTouchMap(): Promise<Record<string, number>> {
    const { data, error } = await supabase
        .from('review_history')
        .select('date, touch_count')

    if (error) throw error

    const map: Record<string, number> = {}
    for (const row of (data || [])) {
        map[row.date] = (map[row.date] || 0) + row.touch_count
    }
    return map
}

// ============================================
// Pity Counter (Gacha)
// ============================================

export async function getPityCounter(): Promise<number> {
    const stats = await getPlayerStats()
    return stats?.pity_counter || 0
}

export async function updatePityCounter(newCount: number): Promise<void> {
    const userId = await getUserId()
    const { error } = await supabase
        .from('player_stats')
        .upsert({
            user_id: userId,
            pity_counter: newCount,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

    if (error) throw error
}

export async function updateLegendaryCount(): Promise<void> {
    const userId = await getUserId()
    const existing = await getPlayerStats()
    const current = existing?.legendary_count || 0

    const { error } = await supabase
        .from('player_stats')
        .upsert({
            user_id: userId,
            legendary_count: current + 1,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

    if (error) throw error
}

// ============================================
// Monthly Review Counts
// ============================================

export async function getMonthlyReviewCounts(
    yearMonth: string
): Promise<Record<string, { count: number; xp: number }>> {
    const { data, error } = await supabase
        .from('review_history')
        .select('date, touch_count')
        .like('date', `${yearMonth}%`)

    if (error) throw error

    const map: Record<string, { count: number; xp: number }> = {}
    for (const row of (data || [])) {
        if (!map[row.date]) {
            map[row.date] = { count: 0, xp: 0 }
        }
        map[row.date].count += row.touch_count
    }
    return map
}

// ============================================
// Phrase Delete
// ============================================

export async function deleteLearningPhrase(id: string): Promise<void> {
    const { error } = await supabase
        .from('learning_phrases')
        .delete()
        .eq('id', id)

    if (error) throw error
}
