'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    playGachaSound, playFeverEntrySound, playFeverExitSound,
    playCardRankSound, playRankUpSound, playFeverChainHit,
    playLevelSound, playSpinTick, playReelStop, playReachAlert, playSpinStart,
} from '@/lib/training-sounds';
import '../training/training-animations.css';

// ── Tier system (mirrors d1.ts + training/page.tsx) ──
type GachaTier = 'MISS' | 'BONUS' | 'GREAT' | 'SUPER' | 'MEGA' | 'LEGENDARY' | 'MYTHIC' | 'SHINY' | 'PHANTOM';

const ALL_TIERS: GachaTier[] = ['PHANTOM', 'SHINY', 'MYTHIC', 'LEGENDARY', 'MEGA', 'SUPER', 'GREAT', 'BONUS', 'MISS'];

const TIER_CONFIG: Record<GachaTier, { color: string; particles: number; duration: number; fontSize: number; sparks: number; odds: string }> = {
    PHANTOM:   { color: '#FFFFFF', particles: 150, duration: 15000, fontSize: 160, sparks: 2000, odds: '1/8192' },
    SHINY:     { color: '#06B6D4', particles: 120, duration: 13000, fontSize: 150, sparks: 500,  odds: '1/4096' },
    MYTHIC:    { color: '#EC4899', particles: 80,  duration: 10000, fontSize: 140, sparks: 100,  odds: '1/400' },
    LEGENDARY: { color: '#D4AF37', particles: 60,  duration: 8500,  fontSize: 130, sparks: 30,   odds: '0.5%' },
    MEGA:      { color: '#8B5CF6', particles: 40,  duration: 6000,  fontSize: 100, sparks: 10,   odds: '2%' },
    SUPER:     { color: '#EF4444', particles: 24,  duration: 4200,  fontSize: 80,  sparks: 5,    odds: '5%' },
    GREAT:     { color: '#F59E0B', particles: 16,  duration: 3200,  fontSize: 64,  sparks: 3,    odds: '10%' },
    BONUS:     { color: '#D4AF37', particles: 8,   duration: 2200,  fontSize: 48,  sparks: 2,    odds: '22%' },
    MISS:      { color: '#78716C', particles: 0,   duration: 1500,  fontSize: 28,  sparks: 0,    odds: '60%' },
};

const TIER_JA: Record<string, string> = {
    PHANTOM: '幻', SHINY: '色違い', MYTHIC: '神話', LEGENDARY: '伝説',
    MEGA: '極', SUPER: '煌', GREAT: '輝', BONUS: '光', MISS: '凡',
};

// ── Chain system ──
type ChainMode = 'normal' | 'kakuhen' | 'gekiatsu' | 'god';

const CHAIN_MODE_CONFIG: Record<ChainMode, { label: string; labelJa: string; color: string; gradient: string; spMultiplier: string; trigger: string }> = {
    normal:   { label: 'NORMAL',   labelJa: '通常', color: '#78716C', gradient: 'linear-gradient(135deg, #78716C, #A8A29E)', spMultiplier: 'x1',   trigger: '0-2連' },
    kakuhen:  { label: 'KAKUHEN',  labelJa: '確変', color: '#D4AF37', gradient: 'linear-gradient(135deg, #D4AF37, #F59E0B)', spMultiplier: 'x1.5', trigger: '3-4連' },
    gekiatsu: { label: 'GEKIATSU', labelJa: '激熱', color: '#DC2626', gradient: 'linear-gradient(135deg, #DC2626, #F97316)', spMultiplier: 'x2',   trigger: '5-9連' },
    god:      { label: 'GOD MODE', labelJa: '神',   color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED, #EC4899, #D4AF37)', spMultiplier: 'x3', trigger: '10+連' },
};

// ── Chain probability tables (from d1.ts) ──
type GachaEntry = { tier: GachaTier; threshold: number; sparks: number };

const CHAIN_TABLES: Record<ChainMode, GachaEntry[]> = {
    normal: [
        { tier: 'PHANTOM', threshold: 0.00012, sparks: 2000 }, { tier: 'SHINY', threshold: 0.00036, sparks: 500 },
        { tier: 'MYTHIC', threshold: 0.00286, sparks: 100 }, { tier: 'LEGENDARY', threshold: 0.00786, sparks: 30 },
        { tier: 'MEGA', threshold: 0.02786, sparks: 10 }, { tier: 'SUPER', threshold: 0.07786, sparks: 5 },
        { tier: 'GREAT', threshold: 0.17786, sparks: 3 }, { tier: 'BONUS', threshold: 0.39786, sparks: 2 },
        { tier: 'MISS', threshold: 1.0, sparks: 0 },
    ],
    kakuhen: [
        { tier: 'PHANTOM', threshold: 0.00025, sparks: 2000 }, { tier: 'SHINY', threshold: 0.00075, sparks: 500 },
        { tier: 'MYTHIC', threshold: 0.01275, sparks: 100 }, { tier: 'LEGENDARY', threshold: 0.03275, sparks: 30 },
        { tier: 'MEGA', threshold: 0.08275, sparks: 10 }, { tier: 'SUPER', threshold: 0.16275, sparks: 5 },
        { tier: 'GREAT', threshold: 0.31275, sparks: 3 }, { tier: 'BONUS', threshold: 0.60000, sparks: 2 },
        { tier: 'MISS', threshold: 1.0, sparks: 0 },
    ],
    gekiatsu: [
        { tier: 'PHANTOM', threshold: 0.0006, sparks: 2000 }, { tier: 'SHINY', threshold: 0.0018, sparks: 500 },
        { tier: 'MYTHIC', threshold: 0.0143, sparks: 100 }, { tier: 'LEGENDARY', threshold: 0.0393, sparks: 30 },
        { tier: 'MEGA', threshold: 0.1093, sparks: 10 }, { tier: 'SUPER', threshold: 0.2093, sparks: 5 },
        { tier: 'GREAT', threshold: 0.4093, sparks: 3 }, { tier: 'BONUS', threshold: 0.7500, sparks: 2 },
        { tier: 'MISS', threshold: 1.0, sparks: 0 },
    ],
    god: [
        { tier: 'PHANTOM', threshold: 0.0012, sparks: 2000 }, { tier: 'SHINY', threshold: 0.0036, sparks: 500 },
        { tier: 'MYTHIC', threshold: 0.0286, sparks: 100 }, { tier: 'LEGENDARY', threshold: 0.0786, sparks: 30 },
        { tier: 'MEGA', threshold: 0.1786, sparks: 10 }, { tier: 'SUPER', threshold: 0.2786, sparks: 5 },
        { tier: 'GREAT', threshold: 0.4786, sparks: 3 }, { tier: 'BONUS', threshold: 0.8500, sparks: 2 },
        { tier: 'MISS', threshold: 1.0, sparks: 0 },
    ],
};

// ── Card Rank system ──
type CardRank = 'NORMAL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'HOLOGRAPHIC' | 'LEGENDARY';

const CARD_RANKS: { rank: CardRank; threshold: number; borderColor: string; glow: string; label: string; labelJa: string }[] = [
    { rank: 'LEGENDARY',   threshold: 250, borderColor: '#D4AF37', glow: '0 0 30px #D4AF3780', label: 'LEGENDARY',   labelJa: '伝説' },
    { rank: 'HOLOGRAPHIC', threshold: 100, borderColor: '#A855F7', glow: '0 0 25px #A855F760', label: 'HOLOGRAPHIC', labelJa: '虹' },
    { rank: 'GOLD',        threshold: 50,  borderColor: '#F6C85F', glow: '0 0 16px #F6C85F50', label: 'GOLD',        labelJa: '金' },
    { rank: 'SILVER',      threshold: 20,  borderColor: '#94A3B8', glow: '0 0 10px #94A3B840', label: 'SILVER',      labelJa: '銀' },
    { rank: 'BRONZE',      threshold: 5,   borderColor: '#CD7F32', glow: '0 0 4px rgba(205,127,50,0.2)', label: 'BRONZE', labelJa: '銅' },
    { rank: 'NORMAL',      threshold: 0,   borderColor: '#E7E5E4', glow: 'none', label: 'NORMAL', labelJa: '普通' },
];

function getCardFrame(rank: CardRank): { border: string; borderImage?: string; backgroundColor: string; background?: string; textColor: string } {
    switch (rank) {
        case 'NORMAL': return { border: '8px solid #E7E5E4', backgroundColor: '#FAFAF9', textColor: '#44403C' };
        case 'BRONZE': return { border: '8px solid transparent', borderImage: 'linear-gradient(135deg, #CD7F32 0%, #E8B87A 30%, #CD7F32 60%, #A0622E 100%) 1', backgroundColor: '#FFFBF5', textColor: '#92400E' };
        case 'SILVER': return { border: '8px solid transparent', borderImage: 'linear-gradient(135deg, #e2e8f0 0%, #ffffff 40%, #cbd5e1 60%, #94a3b8 100%) 1', backgroundColor: '#F8FAFB', textColor: '#475569' };
        case 'GOLD': return { border: '8px solid transparent', borderImage: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 25%, #F6C85F 50%, #D4AF37 75%, #B8941E 100%) 1', background: 'linear-gradient(180deg, #FFFEF5 0%, #FFFBEB 100%)', backgroundColor: '#FFFEF5', textColor: '#92400E' };
        case 'HOLOGRAPHIC': return { border: '8px solid transparent', borderImage: 'linear-gradient(135deg, #E879F9 0%, #A855F7 25%, #6366F1 50%, #3B82F6 75%, #06B6D4 100%) 1', background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E0E7FF 100%)', backgroundColor: '#FAF5FF', textColor: '#6B21A8' };
        case 'LEGENDARY': return { border: '8px solid transparent', borderImage: 'linear-gradient(135deg, #18181B 0%, #A855F7 40%, #D4AF37 60%, #18181B 100%) 1', background: 'linear-gradient(135deg, #1C1917 0%, #2D2438 50%, #1c1813 100%)', backgroundColor: '#1C1917', textColor: '#D4AF37' };
    }
}

// ── Slot symbols (NEW = pachinko gold frame + kanji) ──
type SlotSymbolId = 'seven-gold' | 'seven-red' | 'bar' | 'bell' | 'grape' | 'cherry' | 'blank' | 'god' | 'rainbow' | 'ghost';

interface SlotSym { id: SlotSymbolId; label: string; color: string; stroke?: string; ultra?: boolean }

const OLD_SLOT_SYMBOLS: SlotSym[] = [
    { id: 'seven-gold', label: '7', color: '#D4AF37' },
    { id: 'seven-red', label: '7', color: '#EF4444' },
    { id: 'bar', label: 'BAR', color: '#F59E0B' },
    { id: 'bell', label: 'BEL', color: '#FBBF24' },
    { id: 'grape', label: 'GRP', color: '#A855F7' },
    { id: 'cherry', label: 'CHR', color: '#F43F5E' },
    { id: 'blank', label: '---', color: '#57534E' },
];

const NEW_SLOT_SYMBOLS: SlotSym[] = [
    { id: 'seven-gold', label: '7', color: '#D4AF37', stroke: '#8B6914' },
    { id: 'seven-red', label: '7', color: '#DC2626', stroke: '#991B1B' },
    { id: 'bar', label: 'BAR', color: '#1C1917', stroke: '#44403C' },
    { id: 'bell', label: '鈴', color: '#D97706', stroke: '#92400E' },
    { id: 'grape', label: '星', color: '#7C3AED', stroke: '#5B21B6' },
    { id: 'cherry', label: '桜', color: '#E11D48', stroke: '#9F1239' },
    { id: 'blank', label: '×', color: '#A8A29E' },
    { id: 'god', label: '神', color: '#EC4899', stroke: '#BE185D', ultra: true },
    { id: 'rainbow', label: '虹', color: '#06B6D4', stroke: '#0E7490', ultra: true },
    { id: 'ghost', label: '幻', color: '#E2E8F0', stroke: '#94A3B8', ultra: true },
];

// For gacha preview (uses old labels for backward compat)
const SLOT_SYMBOLS = OLD_SLOT_SYMBOLS;

const OLD_TIER_TO_COMBO: Record<string, SlotSymbolId[]> = {
    PHANTOM: ['seven-gold', 'seven-gold', 'seven-gold'],
    SHINY: ['seven-gold', 'seven-gold', 'seven-gold'],
    MYTHIC: ['seven-gold', 'seven-gold', 'seven-gold'],
    LEGENDARY: ['seven-gold', 'seven-gold', 'seven-gold'],
    MEGA: ['seven-red', 'seven-red', 'seven-red'],
    SUPER: ['bar', 'bar', 'bar'],
    GREAT: ['bell', 'bell', 'bell'],
    BONUS: ['grape', 'grape', 'grape'],
    MISS: ['cherry', 'bar', 'blank'],
};

const NEW_TIER_TO_COMBO: Record<string, SlotSymbolId[]> = {
    PHANTOM: ['ghost', 'ghost', 'ghost'],
    SHINY: ['rainbow', 'rainbow', 'rainbow'],
    MYTHIC: ['god', 'god', 'god'],
    LEGENDARY: ['seven-gold', 'seven-gold', 'seven-gold'],
    MEGA: ['seven-red', 'seven-red', 'seven-red'],
    SUPER: ['bar', 'bar', 'bar'],
    GREAT: ['bell', 'bell', 'bell'],
    BONUS: ['grape', 'grape', 'grape'],
    MISS: ['cherry', 'bar', 'blank'],
};

const TIER_TO_COMBO = OLD_TIER_TO_COMBO;

// ── Chakra levels ──
const CHAKRA_LEVELS = [
    { level: 0, name: 'SEED', ja: '種', color: '#B91C1C', gradFrom: '#F87171', gradTo: '#FECACA' },
    { level: 1, name: 'SPARK', ja: '芽', color: '#C2410C', gradFrom: '#FB923C', gradTo: '#FED7AA' },
    { level: 2, name: 'FORGE', ja: '鍛', color: '#A16207', gradFrom: '#FACC15', gradTo: '#FEF08A' },
    { level: 3, name: 'OWN', ja: '得', color: '#166534', gradFrom: '#4ADE80', gradTo: '#BBF7D0' },
    { level: 4, name: 'VOICE', ja: '声', color: '#1E40AF', gradFrom: '#60A5FA', gradTo: '#BFDBFE' },
    { level: 5, name: 'VISION', ja: '研', color: '#3730A3', gradFrom: '#818CF8', gradTo: '#C7D2FE' },
    { level: 6, name: 'CROWN', ja: '極', color: '#6B21A8', gradFrom: '#A855F7', gradTo: '#DDD6FE' },
];

// Player Level titles
function getTitleForLevel(lv: number): { title: string; titleEn: string; color: string } {
    if (lv >= 100) return { title: '英語の神', titleEn: 'Godlike', color: '#D4AF37' };
    if (lv >= 81) return { title: '伝説', titleEn: 'Legend', color: '#D4AF37' };
    if (lv >= 61) return { title: '賢者', titleEn: 'Sage', color: '#7C3AED' };
    if (lv >= 41) return { title: '達人', titleEn: 'Master', color: '#DC2626' };
    if (lv >= 31) return { title: '猛者', titleEn: 'Veteran', color: '#EA580C' };
    if (lv >= 21) return { title: '実践者', titleEn: 'Practitioner', color: '#CA8A04' };
    if (lv >= 11) return { title: '修行者', titleEn: 'Grinder', color: '#16A34A' };
    if (lv >= 6) return { title: '学徒', titleEn: 'Student', color: '#2563EB' };
    return { title: '見習い', titleEn: 'Rookie', color: '#78716C' };
}

function xpForLevel(lv: number): number {
    if (lv <= 1) return 0;
    return Math.floor(13 * Math.pow(lv, 2.3));
}

function levelFromXP(totalXP: number): number {
    let lv = 1;
    while (xpForLevel(lv + 1) <= totalXP) lv++;
    return Math.min(lv, 100);
}

// ── SP Milestone thresholds ──
const MILESTONES = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

interface PlayerStats {
    total_xp: number;
    total_touches: number;
    sparks: number;
    pity_counter: number;
    legendary_count: number;
}

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════
export default function DevPage() {
    const [stats, setStats] = useState<PlayerStats | null>(null);
    const [todayXP, setTodayXP] = useState(0);
    const [todayCount, setTodayCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Active preview state
    const [activeGachaTier, setActiveGachaTier] = useState<GachaTier | null>(null);
    const [activeSlotCombo, setActiveSlotCombo] = useState<SlotSymbolId[] | null>(null);
    const [activeChainMode, setActiveChainMode] = useState<ChainMode | null>(null);
    const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Simulator state
    const [simChain, setSimChain] = useState<ChainMode>('normal');
    const [simCount, setSimCount] = useState(100);
    const [simStats, setSimStats] = useState<Record<GachaTier, number> | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const [statsRes, todayRes] = await Promise.all([
                fetch('/api/player-stats'),
                fetch(`/api/review-count?date=${new Date().toISOString().split('T')[0]}`),
            ]);
            if (statsRes.ok) setStats(await statsRes.json());
            if (todayRes.ok) {
                const d = await todayRes.json();
                setTodayXP(d.xp || 0);
                setTodayCount(d.count || 0);
            }
        } catch { /* ignore */ }
        setLoading(false);
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => {
        const timer = setInterval(fetchStats, 5000);
        return () => clearInterval(timer);
    }, [fetchStats]);

    // Preview trigger helpers
    const previewGacha = (tier: GachaTier) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setActiveGachaTier(tier);
        setActiveSlotCombo(TIER_TO_COMBO[tier] || null);
        playGachaSound(tier);
        const dur = TIER_CONFIG[tier].duration;
        timerRef.current = setTimeout(() => {
            setActiveGachaTier(null);
            setActiveSlotCombo(null);
        }, Math.min(dur, 5000));
    };

    const previewChain = (mode: ChainMode) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setActiveChainMode(mode);
        if (mode === 'normal') {
            playFeverExitSound();
        } else {
            playFeverEntrySound();
            playFeverChainHit(mode === 'kakuhen' ? 3 : mode === 'gekiatsu' ? 5 : 10);
        }
        timerRef.current = setTimeout(() => setActiveChainMode(null), 3000);
    };

    const previewMilestone = (sp: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setActiveMilestone(sp);
        playRankUpSound('LEGENDARY');
        timerRef.current = setTimeout(() => setActiveMilestone(null), 3000);
    };

    // Gacha simulator
    const runSimulation = () => {
        const table = CHAIN_TABLES[simChain];
        const counts = Object.fromEntries(ALL_TIERS.map(t => [t, 0])) as Record<GachaTier, number>;
        for (let i = 0; i < simCount; i++) {
            const r = Math.random();
            let tier: GachaTier = 'MISS';
            for (const entry of table) {
                if (r < entry.threshold) { tier = entry.tier; break; }
            }
            counts[tier]++;
        }
        setSimStats(counts);
    };

    const level = stats ? levelFromXP(stats.total_xp) : 1;
    const titleInfo = getTitleForLevel(level);
    const nextLevelXP = xpForLevel(level + 1);
    const currentLevelXP = xpForLevel(level);
    const progress = stats ? ((stats.total_xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

    return (
        <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', backgroundColor: '#F5F5F4', minHeight: '100vh' }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: 0 }}>
                    DEV / Visual Tester
                </h1>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    Gacha tiers, card ranks, chain modes, slot combos, milestones -- press to preview
                </p>
            </div>

            {loading ? (
                <div style={{ color: '#999', fontSize: '14px' }}>Loading...</div>
            ) : (
                <>
                    {/* ── Player Stats ── */}
                    <Section title="Player Stats" subtitle="5s auto-refresh">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                            <StatCard label="Total XP" value={stats?.total_xp?.toLocaleString() || '0'} color="#D4AF37" />
                            <StatCard label="Level" value={`Lv.${level}`} sub={`${titleInfo.title} (${titleInfo.titleEn})`} color={titleInfo.color} />
                            <StatCard label="Sparks (SP)" value={stats?.sparks?.toLocaleString() || '0'} color="#F59E0B" />
                            <StatCard label="Legendary+" value={String(stats?.legendary_count || 0)} color="#D4AF37" />
                            <StatCard label="Pity" value={`${stats?.pity_counter || 0}`} sub="LEGENDARY保証" color="#8B5CF6" />
                            <StatCard label="Today" value={`${todayCount} reviews`} sub={`+${todayXP} XP`} color="#3B82F6" />
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginBottom: '3px' }}>
                                <span>Lv.{level} &rarr; Lv.{level + 1}</span>
                                <span>{stats?.total_xp?.toLocaleString() || 0} / {nextLevelXP.toLocaleString()} ({progress.toFixed(1)}%)</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#E5E5E5', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, backgroundColor: titleInfo.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                            </div>
                        </div>
                    </Section>

                    {/* ── Gacha Tier Preview (THE MAIN THING) ── */}
                    <Section title="Gacha Tier Preview" subtitle="press to see effect + hear sound">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {ALL_TIERS.map(tier => {
                                const cfg = TIER_CONFIG[tier];
                                const isActive = activeGachaTier === tier;
                                return (
                                    <button key={tier} onClick={() => previewGacha(tier)} style={{
                                        padding: '14px 8px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                        backgroundColor: isActive ? cfg.color : `${cfg.color}12`,
                                        color: isActive ? (tier === 'PHANTOM' ? '#000' : '#fff') : cfg.color,
                                        fontWeight: '800', fontSize: '13px', letterSpacing: '1px',
                                        boxShadow: isActive ? `0 0 30px ${cfg.color}60, 0 0 60px ${cfg.color}30` : 'none',
                                        transition: 'all 0.3s ease',
                                        animation: isActive ? 'gacha-reveal 0.6s ease-out' : 'none',
                                        position: 'relative', overflow: 'hidden',
                                    }}>
                                        <div style={{ fontSize: '15px' }}>{tier}</div>
                                        <div style={{ fontSize: '10px', fontWeight: '500', opacity: 0.8, marginTop: '2px' }}>
                                            {TIER_JA[tier]} / {cfg.odds}
                                        </div>
                                        <div style={{ fontSize: '10px', fontWeight: '600', marginTop: '4px' }}>
                                            +{cfg.sparks} SP
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active gacha overlay preview */}
                        {activeGachaTier && (
                            <div style={{
                                marginTop: '16px', padding: '24px', borderRadius: '16px',
                                backgroundColor: activeGachaTier === 'PHANTOM' ? '#0a0a0a' : '#1a1a2e',
                                textAlign: 'center', position: 'relative', overflow: 'hidden',
                                animation: 'gacha-shake 0.5s ease-out',
                            }}>
                                {/* Particles */}
                                {Array.from({ length: Math.min(TIER_CONFIG[activeGachaTier].particles, 30) }).map((_, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        width: '4px', height: '4px', borderRadius: '50%',
                                        backgroundColor: TIER_CONFIG[activeGachaTier!].color,
                                        animation: `gacha-sparkle ${1 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s infinite`,
                                        opacity: 0,
                                    }} />
                                ))}

                                {/* Tier text */}
                                <div style={{
                                    fontSize: `${Math.min(TIER_CONFIG[activeGachaTier].fontSize / 2, 64)}px`,
                                    fontWeight: '900', letterSpacing: '8px',
                                    color: TIER_CONFIG[activeGachaTier].color,
                                    textShadow: `0 0 30px ${TIER_CONFIG[activeGachaTier].color}80, 0 0 60px ${TIER_CONFIG[activeGachaTier].color}40`,
                                    animation: activeGachaTier === 'PHANTOM' ? 'gacha-phantom-pulse 2s ease-in-out infinite' :
                                               activeGachaTier === 'SHINY' ? 'gacha-shiny-prismatic 3s linear infinite' :
                                               'gacha-reveal 0.8s ease-out',
                                }}>
                                    {activeGachaTier}
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', opacity: 0.6, marginTop: '8px' }}>
                                    {TIER_JA[activeGachaTier]} +{TIER_CONFIG[activeGachaTier].sparks} SP
                                </div>

                                {/* Slot combo preview */}
                                {activeSlotCombo && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                                        {activeSlotCombo.map((symId, i) => {
                                            const sym = SLOT_SYMBOLS.find(s => s.id === symId)!;
                                            return (
                                                <div key={i} style={{
                                                    width: '56px', height: '56px', borderRadius: '10px',
                                                    backgroundColor: '#111', border: `2px solid ${sym.color}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: sym.label === '7' ? '28px' : '14px',
                                                    fontWeight: '900', color: sym.color,
                                                    boxShadow: `0 0 12px ${sym.color}50`,
                                                    animation: `reel-symbol-flash 0.4s ease-out ${i * 0.15}s both`,
                                                }}>
                                                    {sym.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </Section>

                    {/* ── Slot Machine Comparison ── */}
                    <SlotComparePreview />

                    {/* ── Card Rank Preview ── */}
                    <Section title="Card Rank Frames" subtitle="actual card frame styles">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {CARD_RANKS.map(r => {
                                const frame = getCardFrame(r.rank);
                                return (
                                    <button key={r.rank} onClick={() => playCardRankSound(r.rank)} style={{
                                        ...frame,
                                        padding: '16px 10px', borderRadius: '0', cursor: 'pointer',
                                        textAlign: 'center', position: 'relative',
                                        boxShadow: r.glow,
                                        animation: r.rank === 'HOLOGRAPHIC' ? 'card-holo-shimmer 3s linear infinite' : 'none',
                                    }}>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: frame.textColor, letterSpacing: '1px' }}>
                                            {r.rank}
                                        </div>
                                        <div style={{ fontSize: '10px', color: frame.textColor, opacity: 0.7, marginTop: '4px' }}>
                                            {r.labelJa} / {r.threshold}pts+
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </Section>

                    {/* ── Chain Mode Preview ── */}
                    <Section title="Chain Modes (連荘)" subtitle="press to hear entry sound">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                            {(['normal', 'kakuhen', 'gekiatsu', 'god'] as ChainMode[]).map(mode => {
                                const cfg = CHAIN_MODE_CONFIG[mode];
                                const isActive = activeChainMode === mode;
                                return (
                                    <button key={mode} onClick={() => previewChain(mode)} style={{
                                        padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                        background: isActive ? cfg.gradient : `${cfg.color}10`,
                                        color: isActive ? '#fff' : cfg.color,
                                        fontWeight: '700', fontSize: '14px',
                                        boxShadow: isActive ? `0 0 20px ${cfg.color}50` : 'none',
                                        transition: 'all 0.3s ease',
                                        animation: isActive && mode !== 'normal' ? 'fever-entry-slam 1.5s ease-out' : 'none',
                                        position: 'relative',
                                    }}>
                                        <div style={{ fontSize: '16px', letterSpacing: '2px' }}>{cfg.label}</div>
                                        <div style={{ fontSize: '11px', fontWeight: '500', marginTop: '4px', opacity: 0.8 }}>
                                            {cfg.labelJa} / {cfg.trigger} / SP {cfg.spMultiplier}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {activeChainMode && activeChainMode !== 'normal' && (
                            <div style={{
                                marginTop: '12px', padding: '20px', borderRadius: '12px',
                                background: CHAIN_MODE_CONFIG[activeChainMode].gradient,
                                textAlign: 'center', color: '#fff',
                                animation: 'fever-entry-shake 0.8s ease-out',
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '6px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                                    {activeChainMode === 'kakuhen' ? '確変突入!' : activeChainMode === 'gekiatsu' ? '激熱突入!' : '神 降 臨 !'}
                                </div>
                                <div style={{ fontSize: '13px', marginTop: '6px', opacity: 0.9 }}>
                                    SP {CHAIN_MODE_CONFIG[activeChainMode].spMultiplier} / MISS率DOWN / 超レア確率UP
                                </div>
                            </div>
                        )}
                    </Section>

                    {/* ── SP Milestones Preview ── */}
                    <Section title="SP Milestones" subtitle="press to see celebration">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {MILESTONES.map(sp => {
                                const isActive = activeMilestone === sp;
                                return (
                                    <button key={sp} onClick={() => previewMilestone(sp)} style={{
                                        padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                        backgroundColor: isActive ? '#D4AF37' : '#FFF8E1',
                                        color: isActive ? '#fff' : '#B8860B',
                                        fontWeight: '800', fontSize: '14px',
                                        boxShadow: isActive ? '0 0 20px #D4AF3760' : 'none',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        {sp.toLocaleString()} SP
                                    </button>
                                );
                            })}
                        </div>
                        {activeMilestone && (
                            <div style={{
                                marginTop: '12px', padding: '24px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1a1a2e, #2D2438)',
                                textAlign: 'center',
                                animation: 'rankup-banner 2s ease-out',
                            }}>
                                <div style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '600', letterSpacing: '4px' }}>SP MILESTONE</div>
                                <div style={{
                                    fontSize: '48px', fontWeight: '900', color: '#D4AF37', marginTop: '8px',
                                    textShadow: '0 0 30px #D4AF3780, 0 0 60px #D4AF3740',
                                }}>
                                    {activeMilestone.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '13px', color: '#A8A29E', marginTop: '8px' }}>SPARKS COLLECTED</div>
                            </div>
                        )}
                    </Section>

                    {/* ── Sound Tester ── */}
                    <Section title="Sound Tester" subtitle="all synthesized sounds">
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Spin Start', fn: () => playSpinStart() },
                                { label: 'Spin Tick', fn: () => playSpinTick() },
                                { label: 'Reel Stop 1', fn: () => playReelStop(0) },
                                { label: 'Reel Stop 2', fn: () => playReelStop(1) },
                                { label: 'Reel Stop 3', fn: () => playReelStop(2) },
                                { label: 'Reach Alert', fn: () => playReachAlert() },
                                { label: 'FEVER Entry', fn: () => playFeverEntrySound() },
                                { label: 'FEVER Exit', fn: () => playFeverExitSound() },
                                { label: 'Chain Hit 3', fn: () => playFeverChainHit(3) },
                                { label: 'Chain Hit 10', fn: () => playFeverChainHit(10) },
                                { label: 'Level 0', fn: () => playLevelSound(0) },
                                { label: 'Level 3', fn: () => playLevelSound(3) },
                                { label: 'Level 6', fn: () => playLevelSound(6) },
                                { label: 'Card BRONZE', fn: () => playCardRankSound('BRONZE') },
                                { label: 'Card GOLD', fn: () => playCardRankSound('GOLD') },
                                { label: 'Card LEGENDARY', fn: () => playCardRankSound('LEGENDARY') },
                                { label: 'Rank Up GOLD', fn: () => playRankUpSound('GOLD') },
                                { label: 'Rank Up LEGENDARY', fn: () => playRankUpSound('LEGENDARY') },
                            ].map((s, i) => (
                                <button key={i} onClick={s.fn} style={{
                                    padding: '7px 12px', borderRadius: '6px', border: '1px solid #ddd',
                                    backgroundColor: '#fff', fontSize: '11px', fontWeight: '600',
                                    cursor: 'pointer', color: '#555',
                                }}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* ── Probability Tables (4 chain modes) ── */}
                    <Section title="Chain Probability Tables" subtitle="from d1.ts backend">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {(['normal', 'kakuhen', 'gekiatsu', 'god'] as ChainMode[]).map(mode => (
                                <div key={mode}>
                                    <h3 style={{
                                        fontSize: '13px', fontWeight: '700', marginBottom: '8px',
                                        color: CHAIN_MODE_CONFIG[mode].color,
                                    }}>
                                        {CHAIN_MODE_CONFIG[mode].label} ({CHAIN_MODE_CONFIG[mode].labelJa})
                                    </h3>
                                    <ChainProbTable table={CHAIN_TABLES[mode]} />
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ── Gacha Simulator ── */}
                    <Section title="Gacha Simulator" subtitle="client-side probability test">
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <select value={simCount} onChange={e => setSimCount(Number(e.target.value))} style={{
                                padding: '7px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px', backgroundColor: '#fff',
                            }}>
                                {[10, 50, 100, 500, 1000, 5000].map(n => (
                                    <option key={n} value={n}>{n.toLocaleString()} rolls</option>
                                ))}
                            </select>
                            <select value={simChain} onChange={e => setSimChain(e.target.value as ChainMode)} style={{
                                padding: '7px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px', backgroundColor: '#fff',
                            }}>
                                {(['normal', 'kakuhen', 'gekiatsu', 'god'] as ChainMode[]).map(m => (
                                    <option key={m} value={m}>{CHAIN_MODE_CONFIG[m].label}</option>
                                ))}
                            </select>
                            <button onClick={runSimulation} style={{
                                padding: '7px 18px', borderRadius: '8px', border: 'none',
                                backgroundColor: '#1a1a2e', color: '#fff', fontSize: '12px',
                                fontWeight: '600', cursor: 'pointer',
                            }}>
                                ROLL
                            </button>
                        </div>
                        {simStats && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {ALL_TIERS.map(tier => {
                                    const cnt = simStats[tier];
                                    if (cnt === 0 && ['PHANTOM', 'SHINY', 'MYTHIC'].includes(tier)) return null;
                                    return (
                                        <div key={tier} style={{
                                            padding: '5px 10px', borderRadius: '6px',
                                            backgroundColor: `${TIER_CONFIG[tier].color}12`,
                                            border: cnt > 0 ? `1px solid ${TIER_CONFIG[tier].color}40` : '1px solid #eee',
                                            fontSize: '11px',
                                        }}>
                                            <span style={{ color: TIER_CONFIG[tier].color, fontWeight: '700' }}>{tier}</span>
                                            <span style={{ color: '#666', marginLeft: '4px' }}>
                                                {cnt} ({((cnt / simCount) * 100).toFixed(2)}%)
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Section>

                    {/* ── Chakra Level-Up Preview ── */}
                    <CelebrationPreview />

                    {/* ── Level Curve ── */}
                    <Section title="Level Curve" subtitle="floor(13 * Lv^2.3)">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '4px', fontSize: '11px' }}>
                            {[1, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map(lv => {
                                const info = getTitleForLevel(lv);
                                const isCurrent = level === lv;
                                return (
                                    <div key={lv} style={{
                                        padding: '5px 7px', borderRadius: '6px',
                                        backgroundColor: isCurrent ? `${info.color}15` : '#fff',
                                        border: isCurrent ? `1px solid ${info.color}40` : '1px solid #eee',
                                    }}>
                                        <span style={{ fontWeight: '700', color: info.color }}>Lv.{lv}</span>
                                        <span style={{ color: '#999', marginLeft: '3px' }}>{xpForLevel(lv).toLocaleString()}</span>
                                        <div style={{ color: '#bbb', fontSize: '9px' }}>{info.title}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>

                    {/* ── Luck System ── */}
                    <Section title="Progressive Luck" subtitle="more SP = better ultra-rare odds">
                        <div style={{ fontSize: '12px', color: '#555', lineHeight: '2' }}>
                            <Row label="Formula" value="luckMultiplier = 1 + min(totalSP / 10000, 1.0)" />
                            <Row label="Range" value="x1.0 (0 SP) ~ x2.0 (10000+ SP)" />
                            <Row label="Applies to" value="MYTHIC, SHINY, PHANTOM only" />
                            <Row label="Effect" value="Ultra-rare thresholds boosted by multiplier" />
                            <Row label="Current SP" value={`${stats?.sparks?.toLocaleString() || '0'} SP`} />
                            <Row label="Current Luck" value={`x${(1 + Math.min((stats?.sparks || 0) / 10000, 1.0)).toFixed(4)}`} />
                        </div>
                    </Section>
                </>
            )}
        </div>
    );
}

// ════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div style={{
            marginBottom: '20px', padding: '18px', borderRadius: '12px',
            backgroundColor: '#fff', border: '1px solid #E5E5E5',
        }}>
            <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>{title}</h2>
                {subtitle && <p style={{ fontSize: '10px', color: '#bbb', margin: '2px 0 0' }}>{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
    return (
        <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: `${color}08`, border: `1px solid ${color}20` }}>
            <div style={{ fontSize: '10px', color: '#999', marginBottom: '3px' }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color }}>{value}</div>
            {sub && <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>{sub}</div>}
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: 'flex', gap: '12px', padding: '3px 0', borderBottom: '1px solid #f5f5f5' }}>
            <span style={{ minWidth: '140px', fontWeight: '600', color: '#333', fontSize: '12px' }}>{label}</span>
            <span style={{ color: '#666', fontSize: '12px', fontFamily: 'monospace' }}>{value}</span>
        </div>
    );
}

function ChainProbTable({ table }: { table: GachaEntry[] }) {
    let prev = 0;
    return (
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: '4px 6px', color: '#999', fontWeight: '600' }}>Tier</th>
                    <th style={{ textAlign: 'right', padding: '4px 6px', color: '#999', fontWeight: '600' }}>%</th>
                    <th style={{ textAlign: 'right', padding: '4px 6px', color: '#999', fontWeight: '600' }}>SP</th>
                </tr>
            </thead>
            <tbody>
                {table.map(row => {
                    const pct = ((row.threshold - prev) * 100);
                    prev = row.threshold;
                    return (
                        <tr key={row.tier} style={{ borderBottom: '1px solid #f5f5f5' }}>
                            <td style={{ padding: '4px 6px', fontWeight: '700', color: TIER_CONFIG[row.tier]?.color || '#999' }}>
                                {row.tier}
                            </td>
                            <td style={{ padding: '4px 6px', textAlign: 'right', color: '#555', fontFamily: 'monospace' }}>
                                {pct < 0.01 ? pct.toFixed(4) : pct < 1 ? pct.toFixed(3) : pct.toFixed(1)}%
                            </td>
                            <td style={{ padding: '4px 6px', textAlign: 'right', color: '#bbb' }}>{row.sparks}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function CelebrationPreview() {
    const [celebrating, setCelebrating] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [animKey, setAnimKey] = useState(0);

    const triggerCelebration = () => {
        setCelebrating(false);
        setTimeout(() => {
            setAnimKey(k => k + 1);
            setCelebrating(true);
            playLevelSound(selectedLevel as 0 | 1 | 2 | 3 | 4 | 5 | 6);
        }, 50);
        setTimeout(() => setCelebrating(false), 2550);
    };

    const chakra = CHAKRA_LEVELS[selectedLevel];

    return (
        <Section title="Chakra Level-Up Preview" subtitle="press to see celebration + hear sound">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                <select value={selectedLevel} onChange={e => setSelectedLevel(Number(e.target.value))} style={{
                    padding: '7px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px', backgroundColor: '#fff',
                }}>
                    {CHAKRA_LEVELS.map(c => (
                        <option key={c.level} value={c.level}>Lv.{c.level + 1} {c.ja} {c.name}</option>
                    ))}
                </select>
                <button onClick={triggerCelebration} style={{
                    padding: '8px 18px', borderRadius: '8px', border: 'none',
                    background: `linear-gradient(135deg, ${chakra.gradFrom}, ${chakra.color})`,
                    color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: `0 4px 16px ${chakra.color}40`,
                }}>
                    LEVEL UP
                </button>
            </div>

            <div key={animKey} style={{
                maxWidth: '320px', borderRadius: '14px', border: '2px solid #e5e5e5',
                backgroundColor: '#fff', padding: '8px', position: 'relative',
                boxShadow: celebrating ? `0 8px 32px rgba(0,0,0,0.1), 0 0 30px ${chakra.gradFrom}60` : '0 4px 16px rgba(0,0,0,0.06)',
                ...(celebrating ? { animation: 'card-levelup-celebrate 2.5s ease-out forwards' } : {}),
            }}>
                {celebrating && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, pointerEvents: 'none', borderRadius: '10px',
                        background: `radial-gradient(circle, ${chakra.gradFrom}20 0%, transparent 70%)`,
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', animation: 'celebrate-badge 2s ease-out forwards' }}>
                            <div style={{
                                fontSize: '16px', fontWeight: '900', letterSpacing: '6px', color: chakra.color,
                                textShadow: `0 0 24px ${chakra.gradFrom}90, 0 0 48px ${chakra.gradFrom}40`,
                            }}>LEVEL UP</div>
                            <div style={{
                                fontSize: '32px', fontWeight: '900', letterSpacing: '3px',
                                background: `linear-gradient(135deg, ${chakra.gradFrom}, ${chakra.gradTo})`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                filter: `drop-shadow(0 0 16px ${chakra.gradFrom}70)`,
                            }}>{chakra.name}</div>
                        </div>
                    </div>
                )}
                <div style={{ backgroundColor: '#FAFAF9', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                        I&apos;m not gonna sugarcoat it.
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                        Sample phrase card
                    </div>
                    <button onClick={triggerCelebration} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '100%', padding: '12px 0', borderRadius: '12px', border: 'none',
                        background: `linear-gradient(135deg, ${chakra.gradFrom}, ${chakra.color})`,
                        color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer',
                        letterSpacing: '2px', boxShadow: `0 4px 16px ${chakra.color}40`,
                    }}>
                        Lv.{chakra.level + 1} {chakra.ja} {chakra.name}
                    </button>
                </div>
            </div>
        </Section>
    );
}

// ════════════════════════════════════════════════
// SLOT MACHINE COMPARISON — OLD vs NEW side by side
// ════════════════════════════════════════════════

function SlotComparePreview() {
    const [selectedTier, setSelectedTier] = useState<GachaTier>('GREAT');
    const [spinning, setSpinning] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    // Reel state for each machine: [reel0, reel1, reel2]
    const [oldReels, setOldReels] = useState<{ syms: string[]; stopped: boolean[]; above: string[]; below: string[] } | null>(null);
    const [newReels, setNewReels] = useState<{ syms: string[]; stopped: boolean[]; above: string[]; below: string[] } | null>(null);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

    const oldSymMap = Object.fromEntries(OLD_SLOT_SYMBOLS.map(s => [s.id, s]));
    const newSymMap = Object.fromEntries(NEW_SLOT_SYMBOLS.map(s => [s.id, s]));
    const oldSpinPool = OLD_SLOT_SYMBOLS.filter(s => s.id !== 'blank').map(s => s.id);
    const newSpinPool = NEW_SLOT_SYMBOLS.filter(s => s.id !== 'blank' && !s.ultra).map(s => s.id);

    const randomFrom = (pool: string[]) => pool[Math.floor(Math.random() * pool.length)];

    const triggerSpin = () => {
        // Clear previous
        timersRef.current.forEach(clearTimeout);
        intervalsRef.current.forEach(clearInterval);
        timersRef.current = [];
        intervalsRef.current = [];

        setSpinning(true);
        setAnimKey(k => k + 1);
        playSpinStart();

        const oldCombo = OLD_TIER_TO_COMBO[selectedTier] || OLD_TIER_TO_COMBO.MISS;
        const newCombo = NEW_TIER_TO_COMBO[selectedTier] || NEW_TIER_TO_COMBO.MISS;
        const isUltra = ['PHANTOM', 'SHINY', 'MYTHIC'].includes(selectedTier);
        const isEpic = ['MEGA', 'LEGENDARY'].includes(selectedTier) || isUltra;
        const isMatch = selectedTier !== 'MISS';

        // Init random
        const initOld = [randomFrom(oldSpinPool), randomFrom(oldSpinPool), randomFrom(oldSpinPool)];
        const initNew = [randomFrom(newSpinPool), randomFrom(newSpinPool), randomFrom(newSpinPool)];
        setOldReels({ syms: initOld, stopped: [false, false, false], above: initOld.map(s => randomFrom(oldSpinPool)), below: initOld.map(s => randomFrom(oldSpinPool)) });
        setNewReels({ syms: initNew, stopped: [false, false, false], above: initNew.map(s => randomFrom(newSpinPool)), below: initNew.map(s => randomFrom(newSpinPool)) });

        // Spin interval
        const spinInt = setInterval(() => {
            setOldReels(prev => {
                if (!prev) return prev;
                const s = [...prev.syms]; const a = [...prev.above]; const b = [...prev.below];
                for (let r = 0; r < 3; r++) if (!prev.stopped[r]) { s[r] = randomFrom(oldSpinPool); a[r] = randomFrom(oldSpinPool); b[r] = randomFrom(oldSpinPool); }
                return { ...prev, syms: s, above: a, below: b };
            });
            setNewReels(prev => {
                if (!prev) return prev;
                const s = [...prev.syms]; const a = [...prev.above]; const b = [...prev.below];
                // Ultra-rare tease
                const teaseTarget = isUltra ? newCombo[2] : null;
                for (let r = 0; r < 3; r++) if (!prev.stopped[r]) {
                    const tease = r === 2 && teaseTarget && prev.stopped[0] && prev.stopped[1] && Math.random() < 0.2;
                    s[r] = tease ? teaseTarget : randomFrom(newSpinPool);
                    a[r] = randomFrom(newSpinPool); b[r] = randomFrom(newSpinPool);
                }
                return { ...prev, syms: s, above: a, below: b };
            });
            playSpinTick();
        }, 70);
        intervalsRef.current.push(spinInt);

        // Stop reel 1
        timersRef.current.push(setTimeout(() => {
            playReelStop(0);
            setOldReels(prev => prev ? { ...prev, syms: [oldCombo[0], prev.syms[1], prev.syms[2]], stopped: [true, false, false], above: [randomFrom(oldSpinPool), prev.above[1], prev.above[2]], below: [randomFrom(oldSpinPool), prev.below[1], prev.below[2]] } : prev);
            setNewReels(prev => prev ? { ...prev, syms: [newCombo[0], prev.syms[1], prev.syms[2]], stopped: [true, false, false], above: [randomFrom(newSpinPool), prev.above[1], prev.above[2]], below: [randomFrom(newSpinPool), prev.below[1], prev.below[2]] } : prev);
        }, 800));

        // Stop reel 2
        timersRef.current.push(setTimeout(() => {
            playReelStop(1);
            if (isMatch) playReachAlert();
            setOldReels(prev => prev ? { ...prev, syms: [prev.syms[0], oldCombo[1], prev.syms[2]], stopped: [true, true, false], above: [prev.above[0], randomFrom(oldSpinPool), prev.above[2]], below: [prev.below[0], randomFrom(oldSpinPool), prev.below[2]] } : prev);
            setNewReels(prev => prev ? { ...prev, syms: [prev.syms[0], newCombo[1], prev.syms[2]], stopped: [true, true, false], above: [prev.above[0], randomFrom(newSpinPool), prev.above[2]], below: [prev.below[0], randomFrom(newSpinPool), prev.below[2]] } : prev);
        }, 1400));

        // Slow reel 3 for reach
        if (isMatch) {
            timersRef.current.push(setTimeout(() => {
                clearInterval(spinInt);
                const slowInt = setInterval(() => {
                    setOldReels(prev => {
                        if (!prev || prev.stopped[2]) return prev;
                        const s = [...prev.syms]; s[2] = randomFrom(oldSpinPool);
                        return { ...prev, syms: s, above: [prev.above[0], prev.above[1], randomFrom(oldSpinPool)], below: [prev.below[0], prev.below[1], randomFrom(oldSpinPool)] };
                    });
                    setNewReels(prev => {
                        if (!prev || prev.stopped[2]) return prev;
                        const s = [...prev.syms];
                        const tease = isUltra && Math.random() < 0.25;
                        s[2] = tease ? newCombo[2] : randomFrom(newSpinPool);
                        return { ...prev, syms: s, above: [prev.above[0], prev.above[1], randomFrom(newSpinPool)], below: [prev.below[0], prev.below[1], randomFrom(newSpinPool)] };
                    });
                    playSpinTick();
                }, isUltra ? 350 : isEpic ? 250 : 160);
                intervalsRef.current.push(slowInt);
            }, 1500));
        }

        // Stop reel 3
        const r3delay = isMatch ? (isUltra ? 4500 : isEpic ? 3000 : 2400) : 2000;
        timersRef.current.push(setTimeout(() => {
            playReelStop(2);
            intervalsRef.current.forEach(clearInterval);
            setOldReels(prev => prev ? { ...prev, syms: [prev.syms[0], prev.syms[1], oldCombo[2]], stopped: [true, true, true], above: [prev.above[0], prev.above[1], randomFrom(oldSpinPool)], below: [prev.below[0], prev.below[1], randomFrom(oldSpinPool)] } : prev);
            setNewReels(prev => prev ? { ...prev, syms: [prev.syms[0], prev.syms[1], newCombo[2]], stopped: [true, true, true], above: [prev.above[0], prev.above[1], randomFrom(newSpinPool)], below: [prev.below[0], prev.below[1], randomFrom(newSpinPool)] } : prev);
        }, r3delay));

        // Done
        timersRef.current.push(setTimeout(() => {
            playGachaSound(selectedTier);
            setSpinning(false);
        }, r3delay + 600));
    };

    useEffect(() => () => {
        timersRef.current.forEach(clearTimeout);
        intervalsRef.current.forEach(clearInterval);
    }, []);

    const isMatch = selectedTier !== 'MISS';
    const tierColor = TIER_CONFIG[selectedTier]?.color || '#999';

    return (
        <Section title="Slot Machine Comparison" subtitle="OLD (dark) vs NEW (pachinko gold) -- select tier and SPIN">
            {/* Tier selector */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {ALL_TIERS.map(t => (
                    <button key={t} onClick={() => !spinning && setSelectedTier(t)} style={{
                        padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: spinning ? 'not-allowed' : 'pointer',
                        backgroundColor: selectedTier === t ? TIER_CONFIG[t].color : `${TIER_CONFIG[t].color}12`,
                        color: selectedTier === t ? (t === 'PHANTOM' ? '#000' : '#fff') : TIER_CONFIG[t].color,
                        fontWeight: '700', fontSize: '11px', letterSpacing: '1px',
                        opacity: spinning ? 0.5 : 1,
                    }}>
                        {t}
                    </button>
                ))}
            </div>

            {/* SPIN button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button onClick={!spinning ? triggerSpin : undefined} style={{
                    padding: '12px 48px', borderRadius: '12px', border: 'none', cursor: spinning ? 'not-allowed' : 'pointer',
                    background: spinning ? '#A8A29E' : `linear-gradient(135deg, ${tierColor}, ${tierColor}CC)`,
                    color: '#fff', fontSize: '16px', fontWeight: '900', letterSpacing: '6px',
                    boxShadow: spinning ? 'none' : `0 4px 20px ${tierColor}50`,
                    transition: 'all 0.3s ease',
                }}>
                    {spinning ? 'SPINNING...' : 'SPIN'}
                </button>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>
                    {selectedTier}: {TIER_JA[selectedTier]} / {TIER_CONFIG[selectedTier].odds} / +{TIER_CONFIG[selectedTier].sparks} SP
                </div>
            </div>

            {/* Side by side machines */}
            <div key={animKey} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* OLD SLOT */}
                <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#999', textAlign: 'center', marginBottom: '8px', letterSpacing: '2px' }}>
                        旧 OLD
                    </div>
                    <OldSlotMachine reels={oldReels} symMap={oldSymMap} isMatch={isMatch} tierColor={tierColor} />
                </div>
                {/* NEW SLOT */}
                <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#D4AF37', textAlign: 'center', marginBottom: '8px', letterSpacing: '2px' }}>
                        新 NEW
                    </div>
                    <NewSlotMachine reels={newReels} symMap={newSymMap} isMatch={isMatch} tierColor={tierColor} tier={selectedTier} />
                </div>
            </div>
        </Section>
    );
}

// OLD slot: dark theme (original design)
function OldSlotMachine({ reels, symMap, isMatch, tierColor }: {
    reels: { syms: string[]; stopped: boolean[]; above: string[]; below: string[] } | null;
    symMap: Record<string, SlotSym>;
    isMatch: boolean;
    tierColor: string;
}) {
    if (!reels) return <div style={{ height: '200px', borderRadius: '16px', backgroundColor: '#0C0A09', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#57534E', fontSize: '13px' }}>Press SPIN</div>;
    const allStopped = reels.stopped.every(Boolean);
    const cellW = 56; const cellH = 50;

    const renderSym = (symId: string, isCenter: boolean, isStopped: boolean) => {
        const sym = symMap[symId];
        if (!sym) return null;
        return (
            <div style={{
                width: cellW, height: cellH,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: `${sym.label === '7' ? cellH * 0.65 : cellH * 0.35}px`,
                fontWeight: sym.label === '7' ? '900' : '800',
                color: isCenter ? sym.color : `${sym.color}50`,
                textShadow: isCenter && isStopped ? `0 0 20px ${sym.color}80, 0 0 40px ${sym.color}60` : 'none',
                fontFamily: sym.label === '7' ? 'Georgia, serif' : 'inherit',
                letterSpacing: sym.label === 'BAR' ? '2px' : '0',
                animation: isCenter && isStopped ? 'reel-symbol-flash 0.2s ease-out' : undefined,
                userSelect: 'none' as const,
            }}>
                {sym.label}
            </div>
        );
    };

    return (
        <div style={{
            backgroundColor: '#0C0A09', borderRadius: '16px',
            border: allStopped && isMatch ? `2px solid ${tierColor}70` : '2px solid #D4AF3730',
            boxShadow: `0 0 40px #D4AF3720, inset 0 0 30px rgba(0,0,0,0.8)`,
            padding: '12px 10px', position: 'relative', overflow: 'hidden',
        }}>
            {/* Scan lines */}
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)', pointerEvents: 'none', borderRadius: 'inherit' }} />
            <div style={{ display: 'flex', gap: '4px', position: 'relative', zIndex: 1 }}>
                {[0, 1, 2].map(r => (
                    <div key={r} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1C1917', borderRadius: '8px', overflow: 'hidden', border: '1px solid #292524', animation: reels.stopped[r] ? 'reel-bounce 0.25s ease-out' : undefined }}>
                        <div style={{ borderBottom: '1px solid #292524', opacity: 0.4 }}>{renderSym(reels.above[r], false, reels.stopped[r])}</div>
                        <div>{renderSym(reels.syms[r], true, reels.stopped[r])}</div>
                        <div style={{ borderTop: '1px solid #292524', opacity: 0.4 }}>{renderSym(reels.below[r], false, reels.stopped[r])}</div>
                    </div>
                ))}
                {/* Payline */}
                <div style={{
                    position: 'absolute', top: `${cellH}px`, left: '-2px', right: '-2px', height: `${cellH + 2}px`,
                    border: allStopped && isMatch ? `2px solid ${tierColor}60` : '1px solid #D4AF3720',
                    borderRadius: '4px', pointerEvents: 'none',
                    animation: allStopped && isMatch ? 'payline-flash 0.8s ease-in-out infinite' : undefined,
                }} />
            </div>
        </div>
    );
}

// NEW slot: pachinko gold frame
function NewSlotMachine({ reels, symMap, isMatch, tierColor, tier }: {
    reels: { syms: string[]; stopped: boolean[]; above: string[]; below: string[] } | null;
    symMap: Record<string, SlotSym>;
    isMatch: boolean;
    tierColor: string;
    tier: GachaTier;
}) {
    if (!reels) return <div style={{ height: '200px', borderRadius: '20px', background: 'linear-gradient(160deg, #F6E27A 0%, #D4AF37 40%, #B8941E 70%, #D4AF37 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B6914', fontSize: '13px', fontWeight: '700' }}>Press SPIN</div>;
    const allStopped = reels.stopped.every(Boolean);
    const isUltra = ['PHANTOM', 'SHINY', 'MYTHIC'].includes(tier);
    const frameGlow = allStopped && isUltra
        ? tier === 'PHANTOM' ? '#E2E8F0' : tier === 'SHINY' ? '#06B6D4' : '#EC4899'
        : tierColor;
    const cellW = 56; const cellH = 50;

    const renderSym = (symId: string, isCenter: boolean, isStopped: boolean) => {
        const sym = symMap[symId];
        if (!sym) return null;
        const is7 = sym.label === '7';
        const isKanji = ['鈴', '星', '桜', '神', '虹', '幻'].includes(sym.label);
        const isUltraSym = !!sym.ultra;
        return (
            <div style={{
                width: cellW, height: cellH,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: `${is7 ? cellH * 0.7 : isKanji ? cellH * 0.5 : cellH * 0.35}px`,
                fontWeight: '900',
                fontStyle: is7 ? 'italic' : 'normal',
                color: isCenter ? sym.color : `${sym.color}40`,
                textShadow: isCenter && isStopped
                    ? isUltraSym
                        ? `0 0 20px ${sym.color}90, 0 0 40px ${sym.color}60, 0 0 60px ${sym.color}40`
                        : is7
                            ? `0 2px 0 ${sym.stroke || sym.color}, 0 0 20px ${sym.color}90, 0 0 40px ${sym.color}60`
                            : `0 1px 0 ${sym.stroke || sym.color}, 0 0 12px ${sym.color}60`
                    : 'none',
                fontFamily: is7 ? 'Georgia, "Times New Roman", serif' : isKanji ? '"Hiragino Kaku Gothic Pro", "Yu Gothic", sans-serif' : '"Arial Black", sans-serif',
                letterSpacing: sym.label === 'BAR' ? '3px' : is7 ? '-2px' : '0',
                animation: isCenter && isStopped
                    ? isUltraSym ? 'reel-symbol-flash 0.2s ease-out, ultra-symbol-pulse 1s ease-in-out infinite 0.2s' : 'reel-symbol-flash 0.2s ease-out'
                    : undefined,
                WebkitTextStroke: isCenter && is7 ? `1px ${sym.stroke || sym.color}` : undefined,
                userSelect: 'none' as const,
            }}>
                {sym.label}
            </div>
        );
    };

    const isReach = allStopped ? false : reels.stopped[0] && reels.stopped[1] && !reels.stopped[2] && isMatch;

    return (
        <div style={{
            background: 'linear-gradient(160deg, #F6E27A 0%, #D4AF37 20%, #B8941E 40%, #D4AF37 60%, #F6E27A 80%, #D4AF37 100%)',
            borderRadius: '20px',
            border: isReach ? '3px solid #EF4444' : '2px solid #8B6914',
            boxShadow: isReach
                ? '0 0 40px #EF444450, inset 0 2px 4px rgba(255,242,168,0.6)'
                : allStopped && isUltra
                    ? `0 8px 32px rgba(0,0,0,0.3), 0 0 50px ${frameGlow}60, 0 0 100px ${frameGlow}30, inset 0 2px 4px rgba(255,242,168,0.6)`
                    : '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,242,168,0.6)',
            padding: '14px 12px', position: 'relative', overflow: 'hidden',
            animation: isReach ? 'reach-border-pulse 0.6s ease-in-out infinite' : undefined,
        }}>
            {/* Metallic sheen */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)', pointerEvents: 'none', borderRadius: 'inherit' }} />
            {/* Reel window */}
            <div style={{
                background: 'linear-gradient(180deg, #8B6914 0%, #A07A1E 2%, #F5EDD6 4%, #FFFEF8 10%, #FFFEF8 90%, #F5EDD6 96%, #A07A1E 98%, #8B6914 100%)',
                borderRadius: '12px', padding: '4px',
                boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.15), inset 0 -2px 6px rgba(0,0,0,0.1)',
                position: 'relative', zIndex: 1,
            }}>
                <div style={{ display: 'flex', gap: '4px', position: 'relative' }}>
                    {[0, 1, 2].map(r => (
                        <div key={r} style={{
                            display: 'flex', flexDirection: 'column',
                            background: 'linear-gradient(180deg, #FFFEF5 0%, #FFFFFF 20%, #FFFFFF 80%, #F5F0E0 100%)',
                            borderRadius: '8px', overflow: 'hidden',
                            border: '1px solid #C9A93E',
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)',
                            animation: reels.stopped[r] ? 'reel-bounce 0.25s ease-out' : undefined,
                        }}>
                            <div style={{ borderBottom: '1px solid #E8DFC0', opacity: 0.5 }}>{renderSym(reels.above[r], false, reels.stopped[r])}</div>
                            <div>{renderSym(reels.syms[r], true, reels.stopped[r])}</div>
                            <div style={{ borderTop: '1px solid #E8DFC0', opacity: 0.5 }}>{renderSym(reels.below[r], false, reels.stopped[r])}</div>
                        </div>
                    ))}
                    {/* Payline */}
                    <div style={{
                        position: 'absolute', top: `${cellH + cellH / 2 - 1}px`, left: '-6px', right: '-6px', height: '3px',
                        background: allStopped && isMatch ? `linear-gradient(90deg, ${tierColor}, ${tierColor}CC, ${tierColor})` : 'linear-gradient(90deg, #D4AF37, #D4AF3750, #D4AF37)',
                        borderRadius: '2px', pointerEvents: 'none',
                        boxShadow: allStopped && isMatch ? `0 0 8px ${tierColor}80` : '0 0 4px #D4AF3740',
                        animation: allStopped && isMatch ? 'payline-flash 0.8s ease-in-out infinite' : undefined,
                    }} />
                    {/* Arrows */}
                    <div style={{ position: 'absolute', top: `${cellH + cellH / 2 - 5}px`, left: '-8px', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${isReach ? '#EF4444' : '#D4AF37'}`, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: `${cellH + cellH / 2 - 5}px`, right: '-8px', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: `7px solid ${isReach ? '#EF4444' : '#D4AF37'}`, pointerEvents: 'none' }} />
                </div>
            </div>
            {/* REACH label */}
            {isReach && (
                <div style={{
                    textAlign: 'center', marginTop: '8px', fontSize: '18px', fontWeight: '900',
                    color: '#FFFFFF', letterSpacing: '8px',
                    textShadow: '0 0 20px #EF4444, 0 0 40px #EF4444, 0 2px 0 #DC2626',
                    animation: 'reach-text-flash 0.5s ease-out forwards',
                    fontFamily: '"Arial Black", sans-serif', position: 'relative', zIndex: 2,
                }}>
                    REACH
                </div>
            )}
        </div>
    );
}
