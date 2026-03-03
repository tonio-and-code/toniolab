// Client-side gacha system
// Probability tables + pity counter + fever bonus

import {
    updatePlayerXP,
    addSparks,
    addCardPoints,
    getPityCounter,
    updatePityCounter,
    updateLegendaryCount,
} from '@/lib/supabase-phrases'

export type GachaTier = 'MISS' | 'BONUS' | 'GREAT' | 'SUPER' | 'MEGA' | 'LEGENDARY'

const GACHA_TABLE: { tier: GachaTier; threshold: number; sparks: number }[] = [
    { tier: 'LEGENDARY', threshold: 0.005, sparks: 30 },
    { tier: 'MEGA', threshold: 0.020, sparks: 10 },
    { tier: 'SUPER', threshold: 0.050, sparks: 5 },
    { tier: 'GREAT', threshold: 0.100, sparks: 3 },
    { tier: 'BONUS', threshold: 0.220, sparks: 2 },
    { tier: 'MISS', threshold: 1.000, sparks: 0 },
]

const GACHA_TABLE_FEVER: { tier: GachaTier; threshold: number; sparks: number }[] = [
    { tier: 'LEGENDARY', threshold: 0.02, sparks: 30 },
    { tier: 'MEGA', threshold: 0.08, sparks: 10 },
    { tier: 'SUPER', threshold: 0.20, sparks: 5 },
    { tier: 'GREAT', threshold: 0.40, sparks: 3 },
    { tier: 'BONUS', threshold: 0.70, sparks: 2 },
    { tier: 'MISS', threshold: 1.000, sparks: 0 },
]

export interface GachaResult {
    tier: GachaTier
    sparks_won: number
    total_sparks: number
    pity_counter: number
    legendary_count: number
    total_xp: number
    card_points_earned: number
    card_total_points: number
}

export async function rollGachaAndUpdate(
    xp: number,
    phraseId?: string,
    fever?: boolean
): Promise<GachaResult> {
    // 1. Add XP
    const statsAfterXP = await updatePlayerXP(xp)

    // 2. Get pity counter
    const pity = await getPityCounter()

    // 3. Roll gacha
    const table = fever ? GACHA_TABLE_FEVER : GACHA_TABLE
    let roll = Math.random()
    if (pity >= 200) {
        roll = Math.random() * 0.020 // Guaranteed MEGA or better
    }

    let tier: GachaTier = 'MISS'
    let sparksWon = 1
    for (const entry of table) {
        if (roll < entry.threshold) {
            tier = entry.tier
            sparksWon = entry.sparks
            break
        }
    }

    // FEVER 1.5x bonus
    if (fever && tier !== 'MISS') {
        sparksWon = Math.round(sparksWon * 1.5)
    }

    const isMiss = tier === 'MISS'

    // 4. Update pity counter
    await updatePityCounter(isMiss ? pity + 1 : 0)

    // 5. Add sparks
    const statsAfterSparks = await addSparks(sparksWon)

    // 6. Update legendary count if needed
    if (tier === 'LEGENDARY') {
        await updateLegendaryCount()
    }

    // 7. Card points
    let cardPointsEarned = sparksWon
    let cardTotalPoints = 0
    if (phraseId) {
        cardTotalPoints = await addCardPoints(phraseId, sparksWon)
    }

    return {
        tier,
        sparks_won: sparksWon,
        total_sparks: statsAfterSparks.total_sparks,
        pity_counter: isMiss ? pity + 1 : 0,
        legendary_count: statsAfterSparks.legendary_count || 0,
        total_xp: statsAfterXP.total_xp,
        card_points_earned: cardPointsEarned,
        card_total_points: cardTotalPoints,
    }
}
