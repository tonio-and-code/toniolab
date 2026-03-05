// Chakra Level System + Card Rank constants
// Shared between page and components

export type ChakraLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const CHAKRA_CONFIG: Record<ChakraLevel, {
    name: string; ja: string; label: string; lv: number;
    color: string; bg: string; border: string; gradFrom: string; gradTo: string
}> = {
    0: { name: 'SEED', ja: '種', label: 'Lv.1 種 SEED', lv: 0, color: '#B91C1C', bg: '#FEF2F2', border: '#F87171', gradFrom: '#F87171', gradTo: '#FECACA' },
    1: { name: 'SPARK', ja: '芽', label: 'Lv.2 芽 SPARK', lv: 3, color: '#C2410C', bg: '#FFF7ED', border: '#FB923C', gradFrom: '#FB923C', gradTo: '#FED7AA' },
    2: { name: 'FORGE', ja: '鍛', label: 'Lv.3 鍛 FORGE', lv: 6, color: '#A16207', bg: '#FEFCE8', border: '#FACC15', gradFrom: '#FACC15', gradTo: '#FEF08A' },
    3: { name: 'OWN', ja: '得', label: 'Lv.4 得 OWN', lv: 9, color: '#166534', bg: '#F0FDF4', border: '#4ADE80', gradFrom: '#4ADE80', gradTo: '#BBF7D0' },
    4: { name: 'VOICE', ja: '声', label: 'Lv.5 声 VOICE', lv: 10, color: '#1E40AF', bg: '#EFF6FF', border: '#60A5FA', gradFrom: '#60A5FA', gradTo: '#BFDBFE' },
    5: { name: 'VISION', ja: '研', label: 'Lv.6 研 VISION', lv: 10, color: '#3730A3', bg: '#EEF2FF', border: '#818CF8', gradFrom: '#818CF8', gradTo: '#C7D2FE' },
    6: { name: 'CROWN', ja: '極', label: 'Lv.7 極 CROWN', lv: 15, color: '#6B21A8', bg: '#FAF5FF', border: '#A855F7', gradFrom: '#A855F7', gradTo: '#DDD6FE' },
}

export function getChakraLevel(baseMastery: number, hasRecording: boolean, hasLink: boolean): ChakraLevel {
    if (baseMastery === 6) return 6
    if (baseMastery >= 3 && hasRecording && hasLink) return 5
    if (baseMastery >= 3 && hasRecording) return 4
    return Math.min(baseMastery, 3) as ChakraLevel
}

export function getChakraInfo(baseMastery: number, hasRecording: boolean, hasLink: boolean) {
    const level = getChakraLevel(baseMastery, hasRecording, hasLink)
    return { ...CHAKRA_CONFIG[level], level }
}

// Card Rank system
export type CardRank = 'NORMAL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'HOLOGRAPHIC' | 'LEGENDARY'
export const CARD_RANKS: { rank: CardRank; threshold: number; borderColor: string; glow: string; label: string }[] = [
    { rank: 'LEGENDARY', threshold: 250, borderColor: '#D4AF37', glow: '0 0 30px #D4AF3780', label: 'LEGENDARY' },
    { rank: 'HOLOGRAPHIC', threshold: 100, borderColor: '#A855F7', glow: '0 0 25px #A855F760', label: 'HOLO' },
    { rank: 'GOLD', threshold: 50, borderColor: '#F6C85F', glow: '0 0 16px #F6C85F50', label: 'GOLD' },
    { rank: 'SILVER', threshold: 20, borderColor: '#94A3B8', glow: '0 0 10px #94A3B840', label: 'SILVER' },
    { rank: 'BRONZE', threshold: 5, borderColor: '#CD7F32', glow: '0 0 4px rgba(205,127,50,0.2)', label: 'BRONZE' },
    { rank: 'NORMAL', threshold: 0, borderColor: 'transparent', glow: 'none', label: '' },
]

export function getCardRank(points: number) {
    for (const r of CARD_RANKS) {
        if (points >= r.threshold) return r
    }
    return CARD_RANKS[CARD_RANKS.length - 1]
}

// Player Level System
export function xpForLevel(lv: number): number {
    if (lv <= 1) return 0
    return Math.floor(13 * Math.pow(lv, 2.3))
}

export function levelFromXP(totalXP: number): number {
    let lv = 1
    while (xpForLevel(lv + 1) <= totalXP) lv++
    return Math.min(lv, 100)
}

export function getTitleForLevel(lv: number) {
    if (lv >= 100) return { title: '英語の神', titleEn: 'Godlike', color: '#D4AF37' }
    if (lv >= 81) return { title: '伝説', titleEn: 'Legend', color: '#D4AF37' }
    if (lv >= 61) return { title: '賢者', titleEn: 'Sage', color: '#7C3AED' }
    if (lv >= 41) return { title: '達人', titleEn: 'Master', color: '#DC2626' }
    if (lv >= 31) return { title: '猛者', titleEn: 'Veteran', color: '#EA580C' }
    if (lv >= 21) return { title: '実践者', titleEn: 'Practitioner', color: '#CA8A04' }
    if (lv >= 11) return { title: '修行者', titleEn: 'Grinder', color: '#16A34A' }
    if (lv >= 6) return { title: '学徒', titleEn: 'Student', color: '#2563EB' }
    return { title: '見習い', titleEn: 'Rookie', color: '#78716C' }
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'daily': { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    'business': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'casual': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'idiom': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'slang': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
}

// Fisher-Yates shuffle
export function fisherYates<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}
