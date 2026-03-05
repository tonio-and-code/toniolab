// ── Elemental Attribute System (属性バトル) ──────────────
// 5-element cycle: FLAME > WIND > EARTH > THUNDER > AQUA > FLAME

export const ELEMENTS = ['flame', 'aqua', 'wind', 'earth', 'thunder'] as const;
export type Element = typeof ELEMENTS[number];

export const ELEMENT_COLORS: Record<string, string> = {
    flame: '#EF4444', aqua: '#3B82F6', wind: '#10B981',
    earth: '#A16207', thunder: '#EAB308',
};

export const ELEMENT_CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    flame:   { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' },
    aqua:    { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    wind:    { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0' },
    earth:   { bg: '#FFFBEB', text: '#A16207', border: '#FDE68A' },
    thunder: { bg: '#FEFCE8', text: '#EAB308', border: '#FEF08A' },
};

export const ELEMENT_ADVANTAGE: Record<string, string> = {
    flame: 'wind', wind: 'earth', earth: 'thunder',
    thunder: 'aqua', aqua: 'flame',
};

export const ELEMENT_LABELS: Record<string, string> = {
    flame: 'FLM', aqua: 'AQA', wind: 'WND', earth: 'ERT', thunder: 'THD',
};

export function randomElement(): Element {
    return ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
}

// ── Base Stat Total (種族値) System ──────────────
// Derived from nanoid card ID — each character = one stat
// Like Pokemon IVs: determined at birth, never changes

export const BST_STAT_NAMES = ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'] as const;

export type BstTier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export const BST_TIERS: { tier: BstTier; min: number; label: string; ja: string; color: string; bg: string }[] = [
    { tier: 'S', min: 600, label: '600族', ja: '伝説', color: '#D4AF37', bg: '#FFFDE0' },
    { tier: 'A', min: 530, label: 'エース', ja: 'エース', color: '#A855F7', bg: '#FAF5FF' },
    { tier: 'B', min: 470, label: '主力', ja: '主力', color: '#3B82F6', bg: '#EFF6FF' },
    { tier: 'C', min: 400, label: '標準', ja: '標準', color: '#10B981', bg: '#ECFDF5' },
    { tier: 'D', min: 330, label: 'ルーキー', ja: 'ルーキー', color: '#78716C', bg: '#F5F5F4' },
    { tier: 'F', min: 0, label: 'コイキング', ja: 'コイキング', color: '#EF4444', bg: '#FEF2F2' },
];

function charToStat(ch: string): number {
    const code = ch.charCodeAt(0); // nanoid range: 45(-) to 122(z)
    return Math.round(30 + ((code - 45) / (122 - 45)) * 85);
}

export function calcBstStats(id: string): number[] {
    const chars = id.slice(0, 6);
    return Array.from(chars).map(charToStat);
}

export function calcBstTotal(id: string): number {
    return calcBstStats(id).reduce((a, b) => a + b, 0);
}

export function getBstTier(total: number): typeof BST_TIERS[number] {
    for (const t of BST_TIERS) {
        if (total >= t.min) return t;
    }
    return BST_TIERS[BST_TIERS.length - 1];
}
