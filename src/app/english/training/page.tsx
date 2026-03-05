'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import VoiceRecorder from '@/components/VoiceRecorder';
import { getSettings } from '@/lib/settings';
import {
    getAudioCtx, playLevelSound, playSpinTick, playReelStop, playReachAlert,
    playSpinStart, playGachaSound, playFeverEntrySound, playFeverExitSound,
    startFeverBGM, stopFeverBGM, playCardRankSound, playRankUpSound, playFeverChainHit,
} from '@/lib/training-sounds';
import './training-animations.css';

interface VoiceRecording {
    id: number;
    phrase_id: string;
    url: string;
    created_at: string;
}

declare global {
    interface Window {
        YG?: {
            Widget: new (id: string, options: {
                width: number;
                components: number;
                events: {
                    onFetchDone?: (event: { totalResult: number }) => void;
                    onVideoChange?: (event: any) => void;
                    onCaptionChange?: (event: { caption: string }) => void;
                };
            }) => {
                fetch: (phrase: string, lang: string) => void;
            };
        };
    }
}

interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

interface PhraseLink {
    phrase_id: string;
    text: string;
    created_at: string;
}

type BaseMastery = 0 | 1 | 2 | 3 | 6;
type ChakraLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// 7 Chakra Levels — mid-tone gradients, display Lv.1-7
// SEED(0) = untouched, no XP. 4 reviews to reach OWN.
const CHAKRA_CONFIG: Record<ChakraLevel, { name: string; ja: string; label: string; lv: number; color: string; bg: string; border: string; gradFrom: string; gradTo: string }> = {
    0: { name: 'SEED', ja: '種', label: 'Lv.1 種', lv: 0, color: '#B91C1C', bg: '#FEF2F2', border: '#F87171', gradFrom: '#F87171', gradTo: '#FECACA' },
    1: { name: 'SPARK', ja: '芽', label: 'Lv.2 芽', lv: 3, color: '#C2410C', bg: '#FFF7ED', border: '#FB923C', gradFrom: '#FB923C', gradTo: '#FED7AA' },
    2: { name: 'FORGE', ja: '鍛', label: 'Lv.3 鍛', lv: 6, color: '#A16207', bg: '#FEFCE8', border: '#FACC15', gradFrom: '#FACC15', gradTo: '#FEF08A' },
    3: { name: 'OWN', ja: '得', label: 'Lv.4 得', lv: 9, color: '#166534', bg: '#F0FDF4', border: '#4ADE80', gradFrom: '#4ADE80', gradTo: '#BBF7D0' },
    4: { name: 'VOICE', ja: '声', label: 'Lv.5 声', lv: 10, color: '#1E40AF', bg: '#EFF6FF', border: '#60A5FA', gradFrom: '#60A5FA', gradTo: '#BFDBFE' },
    5: { name: 'VISION', ja: '研', label: 'Lv.6 研', lv: 10, color: '#3730A3', bg: '#EEF2FF', border: '#818CF8', gradFrom: '#818CF8', gradTo: '#C7D2FE' },
    6: { name: 'CROWN', ja: '極', label: 'Lv.7 極', lv: 15, color: '#6B21A8', bg: '#FAF5FF', border: '#A855F7', gradFrom: '#A855F7', gradTo: '#DDD6FE' },
};

function getChakraLevel(baseMastery: number, hasRecording: boolean, hasLink: boolean): ChakraLevel {
    if (baseMastery === 6) return 6;  // CROWN (DB stored)
    if (baseMastery >= 3 && hasRecording && hasLink) return 5;  // VISION
    if (baseMastery >= 3 && hasRecording) return 4;  // VOICE
    return Math.min(baseMastery, 3) as ChakraLevel;
}

function getChakraInfo(baseMastery: number, hasRecording: boolean, hasLink: boolean) {
    const level = getChakraLevel(baseMastery, hasRecording, hasLink);
    return { ...CHAKRA_CONFIG[level], level };
}

// Card Rank system — gacha sparks accumulate per phrase, visual rank upgrades
type CardRank = 'NORMAL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'HOLOGRAPHIC' | 'LEGENDARY';
const CARD_RANKS: { rank: CardRank; threshold: number; borderColor: string; glow: string; label: string }[] = [
    { rank: 'LEGENDARY', threshold: 250, borderColor: '#D4AF37', glow: '0 0 30px #D4AF3780, 0 0 60px #D4AF3740', label: '伝説' },
    { rank: 'HOLOGRAPHIC', threshold: 100, borderColor: '#A855F7', glow: '0 0 25px #A855F760, 0 0 45px #A855F730', label: '虹' },
    { rank: 'GOLD', threshold: 50, borderColor: '#F6C85F', glow: '0 0 16px #F6C85F50', label: '金' },
    { rank: 'SILVER', threshold: 20, borderColor: '#94A3B8', glow: '0 0 10px #94A3B840', label: '銀' },
    { rank: 'BRONZE', threshold: 5, borderColor: '#CD7F32', glow: '0 0 4px rgba(205,127,50,0.2)', label: '銅' },
    { rank: 'NORMAL', threshold: 0, borderColor: 'transparent', glow: 'none', label: '' },
];

function getCardRank(points: number): typeof CARD_RANKS[0] {
    for (const r of CARD_RANKS) {
        if (points >= r.threshold) return r;
    }
    return CARD_RANKS[CARD_RANKS.length - 1];
}

// Pokemon TCG-style card frame system — shared by review cards, calendar cards, card-preview
function getCardFrame(rank: CardRank): { border: string; borderImage?: string; backgroundColor: string; background?: string } {
    switch (rank) {
        case 'NORMAL': return {
            border: '8px solid #E7E5E4',
            backgroundColor: '#FAFAF9',
        };
        case 'BRONZE': return {
            border: '8px solid transparent',
            borderImage: 'linear-gradient(135deg, #CD7F32 0%, #E8B87A 30%, #CD7F32 60%, #A0622E 100%) 1',
            backgroundColor: '#FFFBF5',
        };
        case 'SILVER': return {
            border: '8px solid transparent',
            borderImage: 'linear-gradient(135deg, #e2e8f0 0%, #ffffff 40%, #cbd5e1 60%, #94a3b8 100%) 1',
            backgroundColor: '#F8FAFB',
        };
        case 'GOLD': return {
            border: '8px solid transparent',
            borderImage: 'linear-gradient(135deg, #D4AF37 0%, #FFF2A8 25%, #F6C85F 50%, #D4AF37 75%, #B8941E 100%) 1',
            background: 'linear-gradient(180deg, #FFFEF5 0%, #FFFBEB 100%)',
            backgroundColor: '#FFFEF5',
        };
        case 'HOLOGRAPHIC': return {
            border: '8px solid transparent',
            borderImage: 'linear-gradient(135deg, #E879F9 0%, #A855F7 25%, #6366F1 50%, #3B82F6 75%, #06B6D4 100%) 1',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E0E7FF 100%)',
            backgroundColor: '#FAF5FF',
        };
        case 'LEGENDARY': return {
            border: '8px solid transparent',
            borderImage: 'linear-gradient(135deg, #18181B 0%, #A855F7 40%, #D4AF37 60%, #18181B 100%) 1',
            background: 'linear-gradient(135deg, #1C1917 0%, #2D2438 50%, #1c1813 100%)',
            backgroundColor: '#1C1917',
        };
    }
}

function getCardShadow(rank: CardRank): string {
    switch (rank) {
        case 'NORMAL': return '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)';
        case 'BRONZE': return '0 6px 16px rgba(205,127,50,0.15), 0 2px 6px rgba(205,127,50,0.1)';
        case 'SILVER': return '0 6px 20px rgba(148,163,184,0.25), 0 2px 8px rgba(148,163,184,0.15), inset 0 0 10px rgba(255,255,255,0.8)';
        case 'GOLD': return '0 8px 24px rgba(212,175,55,0.35), 0 4px 12px rgba(246,200,95,0.25), inset 0 0 15px rgba(255,242,168,0.5)';
        case 'HOLOGRAPHIC': return '0 8px 30px rgba(168,85,247,0.3), 0 4px 16px rgba(99,102,241,0.25), inset 0 0 20px rgba(232,121,249,0.3)';
        case 'LEGENDARY': return '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.4), 0 0 30px rgba(168,85,247,0.3), inset 0 0 30px rgba(0,0,0,0.6)';
    }
}

function getCardWindowBg(rank: CardRank): string {
    switch (rank) {
        case 'NORMAL': return '#F5F5F4';
        case 'BRONZE': return 'linear-gradient(180deg, #FDF8F0, #FAF0E4)';
        case 'SILVER': return 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)';
        case 'GOLD': return 'radial-gradient(ellipse at top, #FFFBEB, #FFF3CC 100%)';
        case 'HOLOGRAPHIC': return 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243,232,255,0.8)), repeating-linear-gradient(45deg, rgba(232,121,249,0.05) 0px, rgba(168,85,247,0.05) 10px, transparent 10px, transparent 20px)';
        case 'LEGENDARY': return 'radial-gradient(circle at center, #2D2438 0%, #181A1B 100%)';
    }
}

// Frame accent color for separators, name bar bg, etc.
function getFrameAccent(rank: CardRank): string {
    switch (rank) {
        case 'NORMAL': return '#E7E5E4';
        case 'BRONZE': return '#CD7F32';
        case 'SILVER': return '#94A3B8';
        case 'GOLD': return '#D4AF37';
        case 'HOLOGRAPHIC': return '#A855F7';
        case 'LEGENDARY': return '#D4AF37';
    }
}

// Sound functions extracted to @/lib/training-sounds
// Gacha tier config
const GACHA_TIER_CONFIG: Record<string, {
    color: string; particles: number; duration: number;
    fontSize: number; mobileFontSize: number;
}> = {
    MISS: { color: '#78716C', particles: 0, duration: 1500, fontSize: 28, mobileFontSize: 22 },
    BONUS: { color: '#D4AF37', particles: 8, duration: 2200, fontSize: 48, mobileFontSize: 36 },
    GREAT: { color: '#F59E0B', particles: 16, duration: 3200, fontSize: 64, mobileFontSize: 48 },
    SUPER: { color: '#EF4444', particles: 24, duration: 4200, fontSize: 80, mobileFontSize: 56 },
    MEGA: { color: '#8B5CF6', particles: 40, duration: 6000, fontSize: 100, mobileFontSize: 68 },
    LEGENDARY: { color: '#D4AF37', particles: 60, duration: 8500, fontSize: 130, mobileFontSize: 84 },
    MYTHIC: { color: '#EC4899', particles: 80, duration: 10000, fontSize: 140, mobileFontSize: 90 },
    SHINY: { color: '#06B6D4', particles: 120, duration: 13000, fontSize: 150, mobileFontSize: 96 },
    PHANTOM: { color: '#FFFFFF', particles: 150, duration: 15000, fontSize: 160, mobileFontSize: 100 },
};

// 3-Reel Slot Machine symbols
type SlotSymbolId = 'seven-gold' | 'seven-red' | 'bar' | 'bell' | 'grape' | 'cherry' | 'blank' | 'god' | 'rainbow' | 'ghost';
const SLOT_SYMBOLS: { id: SlotSymbolId; label: string; color: string; glow: string; scale: number; stroke?: string; ultra?: boolean }[] = [
    { id: 'seven-gold', label: '7', color: '#D4AF37', glow: '#D4AF3790', scale: 1.3, stroke: '#8B6914' },
    { id: 'seven-red', label: '7', color: '#DC2626', glow: '#DC262690', scale: 1.3, stroke: '#991B1B' },
    { id: 'bar', label: 'BAR', color: '#1C1917', glow: '#78716C60', scale: 0.55, stroke: '#44403C' },
    { id: 'bell', label: '鈴', color: '#D97706', glow: '#D9770660', scale: 0.75, stroke: '#92400E' },
    { id: 'grape', label: '星', color: '#7C3AED', glow: '#7C3AED60', scale: 0.75, stroke: '#5B21B6' },
    { id: 'cherry', label: '桜', color: '#E11D48', glow: '#E11D4860', scale: 0.75, stroke: '#9F1239' },
    { id: 'blank', label: '×', color: '#A8A29E', glow: 'transparent', scale: 0.8 },
    // Ultra-rare only — never in normal spin pool
    { id: 'god', label: '神', color: '#EC4899', glow: '#EC489990', scale: 0.85, stroke: '#BE185D', ultra: true },
    { id: 'rainbow', label: '虹', color: '#06B6D4', glow: '#06B6D490', scale: 0.85, stroke: '#0E7490', ultra: true },
    { id: 'ghost', label: '幻', color: '#E2E8F0', glow: '#FFFFFF90', scale: 0.85, stroke: '#94A3B8', ultra: true },
];
const SLOT_SYMBOL_MAP = Object.fromEntries(SLOT_SYMBOLS.map(s => [s.id, s])) as Record<SlotSymbolId, typeof SLOT_SYMBOLS[0]>;

// Spinnable pool (no blanks or ultra-rares during spin)
const SPIN_POOL: SlotSymbolId[] = SLOT_SYMBOLS.filter(s => s.id !== 'blank' && !s.ultra).map(s => s.id);

// Map backend tier -> which 3 symbols to show on the payline
const TIER_TO_COMBO: Record<string, SlotSymbolId[]> = {
    PHANTOM:   ['ghost', 'ghost', 'ghost'],       // 幻幻幻 — white flickering
    SHINY:     ['rainbow', 'rainbow', 'rainbow'],  // 虹虹虹 — prismatic
    MYTHIC:    ['god', 'god', 'god'],              // 神神神 — pink flash
    LEGENDARY: ['seven-gold', 'seven-gold', 'seven-gold'],
    MEGA:      ['seven-red', 'seven-red', 'seven-red'],
    SUPER:     ['bar', 'bar', 'bar'],
    GREAT:     ['bell', 'bell', 'bell'],
    BONUS:     ['grape', 'grape', 'grape'],
    MISS:      ['cherry', 'bar', 'blank'],
};

// Generate a random non-matching combo for MISS (no ultra-rares)
function generateMissCombo(): [SlotSymbolId, SlotSymbolId, SlotSymbolId] {
    const pool: SlotSymbolId[] = ['seven-red', 'bar', 'bell', 'grape', 'cherry', 'blank'];
    let a: SlotSymbolId, b: SlotSymbolId, c: SlotSymbolId;
    do {
        a = pool[Math.floor(Math.random() * pool.length)];
        b = pool[Math.floor(Math.random() * pool.length)];
        c = pool[Math.floor(Math.random() * pool.length)];
    } while (a === b && b === c);
    return [a, b, c];
}

// Pick a random symbol different from the given one (for above/below filler)
function randomOtherSymbol(exclude: SlotSymbolId): SlotSymbolId {
    const candidates = SLOT_SYMBOLS.filter(s => s.id !== exclude && s.id !== 'blank' && !s.ultra);
    return candidates[Math.floor(Math.random() * candidates.length)].id;
}

// Tier name mapping: internal English key → display Japanese
const TIER_JA: Record<string, string> = {
    BONUS: '光', GREAT: '輝', SUPER: '煌', MEGA: '極', LEGENDARY: '伝説',
    MYTHIC: '神話', SHINY: '色違い', PHANTOM: '幻', MISS: '凡',
};

// 連荘 Chain system types and config (outside component to avoid bundler issues)
type ChainMode = 'normal' | 'kakuhen' | 'gekiatsu' | 'god';

function getChainMode(count: number): ChainMode {
    if (count >= 10) return 'god';
    if (count >= 5) return 'gekiatsu';
    if (count >= 3) return 'kakuhen';
    return 'normal';
}

function getChainTier(count: number): 0 | 1 | 2 | 3 {
    if (count >= 10) return 3;
    if (count >= 5) return 2;
    if (count >= 3) return 1;
    return 0;
}

const CHAIN_MODE_CONFIG: Record<ChainMode, { label: string; labelJa: string; color: string; gradient: string; spMultiplier: string }> = {
    normal: { label: 'NORMAL', labelJa: '通常', color: '#78716C', gradient: 'linear-gradient(135deg, #78716C, #A8A29E)', spMultiplier: 'x1' },
    kakuhen: { label: 'KAKUHEN', labelJa: '確変', color: '#D4AF37', gradient: 'linear-gradient(135deg, #D4AF37, #F59E0B)', spMultiplier: 'x1.5' },
    gekiatsu: { label: 'GEKIATSU', labelJa: '激熱', color: '#DC2626', gradient: 'linear-gradient(135deg, #DC2626, #F97316)', spMultiplier: 'x2' },
    god: { label: 'GOD MODE', labelJa: '神', color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED, #EC4899, #D4AF37)', spMultiplier: 'x3' },
};

// Puzzle background image (beautiful landscape for motivation)
const PUZZLE_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';

// Fisher-Yates shuffle — pure, returns new array
function fisherYates<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Player Level System — floor(13 * Lv^2.3)
function xpForLevel(lv: number): number {
    if (lv <= 1) return 0;
    return Math.floor(13 * Math.pow(lv, 2.3));
}

function levelFromXP(totalXP: number): number {
    let lv = 1;
    while (xpForLevel(lv + 1) <= totalXP) lv++;
    return Math.min(lv, 100);
}

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

// Daily Level System — fast leveling that resets each day
function dailyXpForLevel(lv: number): number {
    if (lv <= 1) return 0;
    return Math.floor(4 * Math.pow(lv - 1, 1.8));
}

function dailyLevelFromXP(dayXP: number): number {
    let lv = 1;
    while (dailyXpForLevel(lv + 1) <= dayXP) lv++;
    return Math.min(lv, 99);
}

function getDailyTitleForLevel(lv: number): { title: string; color: string } {
    if (lv >= 26) return { title: '本日の神', color: '#D4AF37' };
    if (lv >= 21) return { title: '鬼神', color: '#7C3AED' };
    if (lv >= 17) return { title: '覚醒', color: '#DC2626' };
    if (lv >= 13) return { title: '無双', color: '#EA580C' };
    if (lv >= 9) return { title: 'ゾーン', color: '#CA8A04' };
    if (lv >= 6) return { title: 'エンジン全開', color: '#16A34A' };
    if (lv >= 4) return { title: '準備OK', color: '#2563EB' };
    if (lv >= 2) return { title: '起動', color: '#78716C' };
    return { title: '寝起き', color: '#78716C' };
}

// Element colors imported from shared constants
import { ELEMENT_CATEGORY_COLORS, randomElement, calcBstTotal, getBstTier } from '@/data/english/elements';
import { ElementBadge } from '@/components/english/ElementIcon';
const CATEGORY_COLORS = ELEMENT_CATEGORY_COLORS;

export default function PhrasesPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [phraseMastery, setPhraseMastery] = useState<Record<string, number>>({});
    const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [clientToday, setClientToday] = useState('');
    useEffect(() => {
        const now = new Date();
        setClientToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
        setCurrentMonth(now);
    }, []);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'review'>('calendar');
    const [searchQuery, setSearchQuery] = useState('');
    const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [reviewFilter, setReviewFilter] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 'all' | 'random' | 'recorded' | 'linked'>('random');
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewHistory, setReviewHistory] = useState<Phrase[]>([]);
    const [historyOffset, setHistoryOffset] = useState(0);
    const [shuffleKey, setShuffleKey] = useState(0);
    const [pointEffect, setPointEffect] = useState<{
        points: number; color: string; gradFrom: string; gradTo: string;
        levelName: string; key: number;
    } | null>(null);
    const [calendarPulse, setCalendarPulse] = useState<{
        dateKey: string; points: number; gradFrom: string; color: string; level: ChakraLevel; key: number;
    } | null>(null);
    const [voiceRecordings, setVoiceRecordings] = useState<Record<string, VoiceRecording[]>>({});
    const [phraseLinks, setPhraseLinks] = useState<Record<string, PhraseLink[]>>({});
    const [phraseLastLeveled, setPhraseLastLeveled] = useState<Record<string, string>>({});
    const [cardPoints, setCardPoints] = useState<Record<string, number>>({});
    // Cumulative review touches per phrase-date (dateKey → total count from D1)
    const [dateTouchMap, setDateTouchMap] = useState<Record<string, number>>({});

    // Player level state
    const [playerTotalXP, setPlayerTotalXP] = useState(0);
    const [playerLevel, setPlayerLevel] = useState(1);
    const [levelUpEffect, setLevelUpEffect] = useState<{ level: number; title: string; color: string; key: number } | null>(null);

    // Daily level-up effect
    const [dailyLevelUpEffect, setDailyLevelUpEffect] = useState<{ level: number; title: string; color: string; key: number } | null>(null);
    const prevDailyLevelRef = useRef(0);

    // Gacha bonus system state
    const [playerSparks, setPlayerSparks] = useState(0);
    const [gachaEffect, setGachaEffect] = useState<{
        phase: 'reel' | 'reveal';
        tier: string;
        sparksWon: number;
        phraseId: string | null;
        cardPointsEarned: number;
        cardTotalPoints: number;
        key: number;
    } | null>(null);
    // 3-reel slot machine state
    const [slotReels, setSlotReels] = useState<{
        // Current center symbol for each reel (what's displayed)
        symbols: [SlotSymbolId, SlotSymbolId, SlotSymbolId];
        // Which reels have stopped
        stopped: [boolean, boolean, boolean];
        // Target combo (what the reels should land on)
        target: [SlotSymbolId, SlotSymbolId, SlotSymbolId];
        // Reach mode (2 matching reels)
        reach: boolean;
        // Symbols above/below center for each reel
        above: [SlotSymbolId, SlotSymbolId, SlotSymbolId];
        below: [SlotSymbolId, SlotSymbolId, SlotSymbolId];
    } | null>(null);
    const slotSpinTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const pendingGachaRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Quiet points toast (shown when slot animation is OFF)
    const [quietToast, setQuietToast] = useState<{ sparks: number; cardPts: number; tier: string; key: number } | null>(null);
    useEffect(() => {
        if (!quietToast) return;
        const timer = setTimeout(() => setQuietToast(null), 2000);
        return () => clearTimeout(timer);
    }, [quietToast]);

    // 連荘 Chain system state
    const [chainState, setChainState] = useState<{ count: number; mode: ChainMode; key: number }>({ count: 0, mode: 'normal', key: 0 });
    const [chainTransition, setChainTransition] = useState<{ from: ChainMode; to: ChainMode; key: number } | null>(null);
    // Keep backward-compat aliases for FEVER visuals
    const feverMode = { active: chainState.mode !== 'normal', streak: chainState.count, key: chainState.key };
    const [feverFlash, setFeverFlash] = useState<'enter' | 'exit' | null>(null);
    const [feverEntryEffect, setFeverEntryEffect] = useState(false);
    const [feverExitEffect, setFeverExitEffect] = useState<{ streak: number } | null>(null);
    const feverDroneRef = useRef<HTMLAudioElement | null>(null);
    const feverRef = useRef({ active: false, streak: 0 });
    // SP milestone celebration
    const [milestoneEffect, setMilestoneEffect] = useState<{ amount: number; key: number } | null>(null);
    // Luck multiplier display
    const [luckMultiplier, setLuckMultiplier] = useState(1.0);
    const [cardRankUpEffect, setCardRankUpEffect] = useState<{ oldRank: string; newRank: string; newRankColor: string; key: number } | null>(null);

    // Card level-up celebration: hold the card on screen before advancing
    const [cardCelebration, setCardCelebration] = useState<{
        phrase: Phrase;
        key: number;
    } | null>(null);

    // Auto-clear fever flash
    useEffect(() => {
        if (!feverFlash) return;
        const timer = setTimeout(() => setFeverFlash(null), feverFlash === 'enter' ? 800 : 1200);
        return () => clearTimeout(timer);
    }, [feverFlash]);

    // Auto-clear fever entry slam
    useEffect(() => {
        if (!feverEntryEffect) return;
        const timer = setTimeout(() => setFeverEntryEffect(false), 1000);
        return () => clearTimeout(timer);
    }, [feverEntryEffect]);

    // Auto-clear fever exit text
    useEffect(() => {
        if (!feverExitEffect) return;
        const timer = setTimeout(() => setFeverExitEffect(null), 1500);
        return () => clearTimeout(timer);
    }, [feverExitEffect]);

    // Auto-clear rank-up banner
    useEffect(() => {
        if (!cardRankUpEffect) return;
        const timer = setTimeout(() => setCardRankUpEffect(null), 3000);
        return () => clearTimeout(timer);
    }, [cardRankUpEffect]);

    // Card celebration: hold the leveled card, then advance
    // When a card rank-up is detected mid-celebration, restart timer with longer hold
    useEffect(() => {
        if (!cardCelebration) return;
        const holdTime = cardRankUpEffect ? 4500 : 2500;
        const timer = setTimeout(() => {
            setReviewHistory(prev => [...prev, cardCelebration.phrase]);
            setHistoryOffset(0);
            setCardCelebration(null);
        }, holdTime);
        return () => clearTimeout(timer);
    }, [cardCelebration, cardRankUpEffect]);

    // Auto-play TTS ref (effect placed after displayedCard is defined)
    const prevAutoPlayIdRef = useRef<string | null>(null);

    // Keep feverRef in sync (for race-condition-safe callbacks)
    useEffect(() => {
        feverRef.current = { active: chainState.mode !== 'normal', streak: chainState.count };
    }, [chainState.mode, chainState.count]);

    // Stop FEVER BGM when chain ends + duck/restore main BGM
    useEffect(() => {
        if (chainState.mode !== 'normal') {
            // Mute main BGM during chain mode
            if (mainBgmRef.current) mainBgmRef.current.volume = 0;
        } else {
            // Restore main BGM volume
            if (mainBgmRef.current) {
                const st = getSettings();
                mainBgmRef.current.volume = (st.bgmVolume / 100) * (st.volume / 100);
            }
            if (feverDroneRef.current) {
                stopFeverBGM(feverDroneRef.current);
                feverDroneRef.current = null;
            }
        }
    }, [chainState.mode]);

    // Auto-clear chain transition effect
    useEffect(() => {
        if (!chainTransition) return;
        const timer = setTimeout(() => setChainTransition(null), 1500);
        return () => clearTimeout(timer);
    }, [chainTransition]);

    // Auto-clear milestone effect
    useEffect(() => {
        if (!milestoneEffect) return;
        const dur = milestoneEffect.amount >= 5000 ? 8000 : milestoneEffect.amount >= 1000 ? 5000 : milestoneEffect.amount >= 500 ? 3000 : milestoneEffect.amount >= 100 ? 2000 : 1500;
        const timer = setTimeout(() => setMilestoneEffect(null), dur);
        return () => clearTimeout(timer);
    }, [milestoneEffect]);

    // ── Main BGM (always-on loop, independent of FEVER) ──
    const mainBgmRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        const st = getSettings();
        if (!st.bgmEnabled || !st.soundEnabled) {
            // stop if playing
            if (mainBgmRef.current) {
                mainBgmRef.current.pause();
                mainBgmRef.current = null;
            }
            return;
        }
        // already playing
        if (mainBgmRef.current) {
            mainBgmRef.current.volume = (st.bgmVolume / 100) * (st.volume / 100);
            return;
        }
        const audio = new Audio('/audio/bgm-main.mp3');
        audio.loop = true;
        audio.volume = (st.bgmVolume / 100) * (st.volume / 100);
        audio.play().catch(() => { /* autoplay blocked — will start on first user interaction */ });
        mainBgmRef.current = audio;
        return () => {
            audio.pause();
            mainBgmRef.current = null;
        };
    }, []);

    // Listen for settings changes to update main BGM volume / toggle
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== 'eigodamashii-settings') return;
            const st = getSettings();
            if (!st.bgmEnabled || !st.soundEnabled) {
                if (mainBgmRef.current) { mainBgmRef.current.pause(); mainBgmRef.current = null; }
            } else if (!mainBgmRef.current) {
                const audio = new Audio('/audio/bgm-main.mp3');
                audio.loop = true;
                audio.volume = (st.bgmVolume / 100) * (st.volume / 100);
                audio.play().catch(() => {});
                mainBgmRef.current = audio;
            } else {
                mainBgmRef.current.volume = (st.bgmVolume / 100) * (st.volume / 100);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Auto-clear level-up effect
    useEffect(() => {
        if (!levelUpEffect) return;
        const timer = setTimeout(() => setLevelUpEffect(null), 3000);
        return () => clearTimeout(timer);
    }, [levelUpEffect]);

    // Auto-clear daily level-up effect
    useEffect(() => {
        if (!dailyLevelUpEffect) return;
        const timer = setTimeout(() => setDailyLevelUpEffect(null), 2000);
        return () => clearTimeout(timer);
    }, [dailyLevelUpEffect]);

    // 3-Reel Slot Machine — spin all 3, stop sequentially
    useEffect(() => {
        if (!gachaEffect || gachaEffect.phase !== 'reel') return;

        const tier = gachaEffect.tier;
        const combo = tier === 'MISS' ? generateMissCombo() : (TIER_TO_COMBO[tier] || TIER_TO_COMBO.MISS) as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
        const isReach = tier !== 'MISS' && combo[0] === combo[1]; // 2 matching = reach
        const isUltraRare = tier === 'MYTHIC' || tier === 'SHINY' || tier === 'PHANTOM';
        const isEpicTier = tier === 'MEGA' || tier === 'LEGENDARY' || isUltraRare;

        // Initialize slot state
        const initSym: [SlotSymbolId, SlotSymbolId, SlotSymbolId] = [
            SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)],
            SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)],
            SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)],
        ];
        setSlotReels({
            symbols: initSym,
            stopped: [false, false, false],
            target: combo,
            reach: false,
            above: [randomOtherSymbol(initSym[0]), randomOtherSymbol(initSym[1]), randomOtherSymbol(initSym[2])],
            below: [randomOtherSymbol(initSym[0]), randomOtherSymbol(initSym[1]), randomOtherSymbol(initSym[2])],
        });

        playSpinStart();

        const timers: ReturnType<typeof setTimeout>[] = [];
        const intervals: ReturnType<typeof setInterval>[] = [];

        // Spin all 3 reels — rapid symbol cycling
        const spinInterval = 60; // ms between symbol changes
        const spinTimer = setInterval(() => {
            setSlotReels(prev => {
                if (!prev) return prev;
                const newSyms = [...prev.symbols] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const newAbove = [...prev.above] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const newBelow = [...prev.below] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                for (let r = 0; r < 3; r++) {
                    if (!prev.stopped[r]) {
                        const sym = SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)];
                        newSyms[r] = sym;
                        newAbove[r] = randomOtherSymbol(sym);
                        newBelow[r] = randomOtherSymbol(sym);
                        playSpinTick();
                    }
                }
                return { ...prev, symbols: newSyms, above: newAbove, below: newBelow };
            });
        }, spinInterval);
        intervals.push(spinTimer);

        // Stop reel 1 at 800ms
        timers.push(setTimeout(() => {
            playReelStop(0);
            setSlotReels(prev => {
                if (!prev) return prev;
                const syms = [...prev.symbols] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const ab = [...prev.above] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const bl = [...prev.below] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                syms[0] = combo[0];
                ab[0] = randomOtherSymbol(combo[0]);
                bl[0] = randomOtherSymbol(combo[0]);
                return { ...prev, symbols: syms, above: ab, below: bl, stopped: [true, false, false] };
            });
        }, 800));

        // Stop reel 2 at 1400ms
        timers.push(setTimeout(() => {
            playReelStop(1);
            setSlotReels(prev => {
                if (!prev) return prev;
                const syms = [...prev.symbols] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const ab = [...prev.above] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const bl = [...prev.below] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                syms[1] = combo[1];
                ab[1] = randomOtherSymbol(combo[1]);
                bl[1] = randomOtherSymbol(combo[1]);
                const nowReach = isReach;
                if (nowReach) playReachAlert();
                return { ...prev, symbols: syms, above: ab, below: bl, stopped: [true, true, false], reach: nowReach };
            });
        }, 1400));

        // Slow down reel 3 for reach / epic tiers
        const reel3Delay = isReach ? (isUltraRare ? 5000 : isEpicTier ? 3200 : 2600) : 2000;

        // If reach, slow the spin interval for reel 3
        if (isReach) {
            timers.push(setTimeout(() => {
                // Replace fast spin with slow crawl for reel 3 only
                clearInterval(spinTimer);
                // For ultra-rare, tease the target symbol in the crawl
                const ultraTarget = combo[2];
                let crawlCount = 0;
                const slowInterval = setInterval(() => {
                    crawlCount++;
                    setSlotReels(prev => {
                        if (!prev || prev.stopped[2]) return prev;
                        const newSyms = [...prev.symbols] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                        const newAbove = [...prev.above] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                        const newBelow = [...prev.below] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                        // Ultra-rare: flash the target symbol briefly ~20% of the time for teasing
                        const teaseUltra = isUltraRare && Math.random() < 0.2;
                        const sym = teaseUltra ? ultraTarget : SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)];
                        newSyms[2] = sym;
                        newAbove[2] = randomOtherSymbol(SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)]);
                        newBelow[2] = randomOtherSymbol(SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)]);
                        playSpinTick();
                        return { ...prev, symbols: newSyms, above: newAbove, below: newBelow };
                    });
                }, isUltraRare ? 400 : isEpicTier ? 280 : 180);
                intervals.push(slowInterval);
            }, 1500));
        }

        // Stop reel 3
        timers.push(setTimeout(() => {
            playReelStop(2);
            setSlotReels(prev => {
                if (!prev) return prev;
                const syms = [...prev.symbols] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const ab = [...prev.above] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                const bl = [...prev.below] as [SlotSymbolId, SlotSymbolId, SlotSymbolId];
                syms[2] = combo[2];
                ab[2] = randomOtherSymbol(combo[2]);
                bl[2] = randomOtherSymbol(combo[2]);
                return { ...prev, symbols: syms, above: ab, below: bl, stopped: [true, true, true] };
            });
            // Clear all spin intervals
            intervals.forEach(clearInterval);
        }, reel3Delay));

        // Transition to reveal after all reels stopped + brief pause
        timers.push(setTimeout(() => {
            playGachaSound(gachaEffect.tier);
            setSlotReels(null);
            setGachaEffect(prev => prev ? { ...prev, phase: 'reveal' } : null);
            if (gachaEffect.phraseId && gachaEffect.cardTotalPoints > 0) {
                setTimeout(() => {
                    const rank = getCardRank(gachaEffect.cardTotalPoints);
                    playCardRankSound(rank.rank);
                }, 200);
            }
        }, reel3Delay + 800));

        slotSpinTimers.current = timers;

        return () => {
            timers.forEach(clearTimeout);
            intervals.forEach(clearInterval);
        };
    }, [gachaEffect?.phase, gachaEffect?.key]);

    // Gacha reveal phase: auto-clear after tier-specific duration (+2s if rank-up)
    useEffect(() => {
        if (!gachaEffect || gachaEffect.phase !== 'reveal') return;
        const cfg = GACHA_TIER_CONFIG[gachaEffect.tier];
        const extraTime = cardRankUpEffect ? 2000 : 0;
        const timer = setTimeout(() => {
            setGachaEffect(null);
        }, (cfg?.duration || 2000) + extraTime);
        return () => clearTimeout(timer);
    }, [gachaEffect?.phase, gachaEffect?.key, cardRankUpEffect]);

    // Add phrase form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPhrase, setNewPhrase] = useState(() => ({ english: '', japanese: '', category: randomElement() }));
    const [formDate, setFormDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Quick-add in review mode
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddEnglish, setQuickAddEnglish] = useState('');
    const [quickAddSubmitting, setQuickAddSubmitting] = useState(false);
    const [quickAddedCount, setQuickAddedCount] = useState(0);

    // Daily review counts per month (date -> { count, xp })
    const [monthlyReviewCounts, setMonthlyReviewCounts] = useState<Record<string, { count: number; xp: number; sparks?: number }>>({});

    // YouGlish state
    const [youglishPhrase, setYouglishPhrase] = useState<Phrase | null>(null);
    const [youglishQuery, setYouglishQuery] = useState('');
    const [youglishSearched, setYouglishSearched] = useState(false);
    const youglishLoaded = useRef(false);
    const widgetRef = useRef<ReturnType<typeof window.YG.Widget> | null>(null);
    const currentVideoRef = useRef({ videoId: '', timestamp: 0 });
    const [captionHistory, setCaptionHistory] = useState<{ text: string; selected: boolean }[]>([]);
    const [savingPhrase, setSavingPhrase] = useState(false);
    const [youglishSaveDate, setYouglishSaveDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [playerPosition, setPlayerPosition] = useState({ x: 20, y: 20 });
    const [playerSize, setPlayerSize] = useState({ width: 420, height: 500 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [playerMinimized, setPlayerMinimized] = useState(false);
    const [playerFullscreen, setPlayerFullscreen] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    // Edit phrase state
    const [editingPhrase, setEditingPhrase] = useState<{ id: string; english: string; japanese: string } | null>(null);
    const [editSaving, setEditSaving] = useState(false);

    // Right sidebar expanded state
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    // Chakra filter for calendar day sidebar (null = show all)
    const [selectedChakraFilter, setSelectedChakraFilter] = useState<ChakraLevel | null>(null);

    // Vocabulary modal state
    const [showVocabModal, setShowVocabModal] = useState(false);
    const [vocabExample, setVocabExample] = useState('');
    const [vocabWord, setVocabWord] = useState('');
    const [vocabMeaning, setVocabMeaning] = useState('');
    const [vocabType, setVocabType] = useState('word');
    const [vocabSaving, setVocabSaving] = useState(false);
    const [vocabDate, setVocabDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch player stats on mount
    useEffect(() => {
        fetch('/api/player-stats')
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setPlayerTotalXP(d.total_xp || 0);
                    setPlayerLevel(levelFromXP(d.total_xp || 0));
                    setPlayerSparks(d.sparks || 0);
                }
            })
            .catch(() => { });
    }, []);

    // Fetch monthly review counts + date touches when month changes
    useEffect(() => {
        if (!currentMonth) return;
        const ym = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
        fetch(`/api/review-count?month=${ym}`)
            .then(r => r.json())
            .then(d => { if (d.success) setMonthlyReviewCounts(prev => ({ ...prev, ...(d.counts || {}) })); })
            .catch(() => { });
        fetch(`/api/date-touches?month=${ym}`)
            .then(r => r.json())
            .then(d => { if (d.success) setDateTouchMap(prev => ({ ...prev, ...(d.touches || {}) })); })
            .catch(() => { });
    }, [currentMonth]);

    // Helper: post XP to review-count + update player level + chain transitions
    const postXP = useCallback((todayKey: string, xpGained: number, slamActive = false, phraseId?: string) => {
        const currentChain = feverRef.current;
        const chainTierNum = currentChain.active ? getChainTier(currentChain.streak) : 0;
        fetch('/api/review-count', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: todayKey, xp: xpGained, phrase_id: phraseId, fever: currentChain.active, chain_tier: chainTierNum })
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setMonthlyReviewCounts(prev => ({ ...prev, [todayKey]: { count: d.count, xp: d.xp, sparks: d.sparks || prev[todayKey]?.sparks || 0 } }));
                    if (d.total_xp !== undefined) {
                        const oldLevel = playerLevel;
                        const newTotalXP = d.total_xp;
                        const newLevel = levelFromXP(newTotalXP);
                        setPlayerTotalXP(newTotalXP);
                        if (newLevel > oldLevel) {
                            setPlayerLevel(newLevel);
                            const info = getTitleForLevel(newLevel);
                            setLevelUpEffect({ level: newLevel, title: info.title, color: info.color, key: Date.now() });
                        } else {
                            setPlayerLevel(newLevel);
                        }
                    }
                    // Gacha result + card points + FEVER logic
                    if (d.gacha) {
                        const tier = d.gacha.tier as string;
                        setPlayerSparks(d.gacha.total_sparks);
                        if (phraseId && d.gacha.card_total_points !== undefined) {
                            setCardPoints(prev => ({ ...prev, [phraseId]: d.gacha.card_total_points }));
                        }

                        // 連荘 Chain state transitions — graduated escalation
                        if (getSettings().feverEnabled) {
                        const currentFever = feverRef.current;
                        const isWin = tier !== 'MISS';
                        const isMiss = tier === 'MISS';
                        if (isMiss) {
                            // Chain breaks — reset to 0
                            if (currentFever.active) {
                                const exitStreak = currentFever.streak;
                                stopFeverBGM(feverDroneRef.current);
                                feverDroneRef.current = null;
                                setChainState({ count: 0, mode: 'normal', key: Date.now() });
                                feverRef.current = { active: false, streak: 0 };
                                setFeverFlash('exit');
                                setFeverExitEffect({ streak: exitStreak });
                                playFeverExitSound();
                            }
                        } else if (isWin) {
                            const newCount = currentFever.streak + 1;
                            const oldMode = getChainMode(currentFever.streak);
                            const newMode = getChainMode(newCount);
                            const wasActive = currentFever.active;

                            setChainState({ count: newCount, mode: newMode, key: Date.now() });
                            feverRef.current = { active: newMode !== 'normal', streak: newCount };

                            // Mode escalation effects
                            if (newMode !== oldMode && newMode !== 'normal') {
                                setChainTransition({ from: oldMode, to: newMode, key: Date.now() });
                                if (!wasActive) {
                                    // First entry into chain mode (normal → kakuhen at 3)
                                    setFeverFlash('enter');
                                    setFeverEntryEffect(true);
                                    playFeverEntrySound();
                                    feverDroneRef.current = startFeverBGM();
                                } else {
                                    // Escalation (kakuhen → gekiatsu, gekiatsu → god)
                                    playFeverEntrySound();
                                }
                            } else if (wasActive) {
                                playFeverChainHit(newCount);
                            }
                        }
                        }

                        // SP milestone detection
                        if (d.gacha.total_sparks !== undefined) {
                            const prevSparks = playerSparks;
                            const newSparks = d.gacha.total_sparks;
                            const milestones = [5000, 1000, 500, 100, 50];
                            for (const m of milestones) {
                                if (Math.floor(prevSparks / m) < Math.floor(newSparks / m)) {
                                    setMilestoneEffect({ amount: m, key: Date.now() });
                                    break;
                                }
                            }
                        }

                        // Update luck multiplier
                        if (d.gacha.luck_multiplier !== undefined) {
                            setLuckMultiplier(d.gacha.luck_multiplier);
                        }

                        // Card rank-up detection
                        if (phraseId && d.gacha.card_total_points !== undefined) {
                            const prevPoints = cardPoints[phraseId] || 0;
                            const prevRank = getCardRank(prevPoints);
                            const newRank = getCardRank(d.gacha.card_total_points);
                            if (prevRank.rank !== newRank.rank && newRank.rank !== 'NORMAL') {
                                setTimeout(() => {
                                    playRankUpSound(newRank.rank);
                                    setCardRankUpEffect({
                                        oldRank: prevRank.label || 'NORMAL',
                                        newRank: newRank.label,
                                        newRankColor: newRank.borderColor,
                                        key: Date.now(),
                                    });
                                }, 500);
                            }
                        }

                        if (getSettings().slotEnabled) {
                        if (pendingGachaRef.current) clearTimeout(pendingGachaRef.current);
                        const delay = slamActive ? 1200 : 0;
                        pendingGachaRef.current = setTimeout(() => {
                            setGachaEffect({
                                phase: 'reel',
                                tier,
                                sparksWon: d.gacha.sparks_won,
                                phraseId: phraseId || null,
                                cardPointsEarned: d.gacha.card_points_earned || 0,
                                cardTotalPoints: d.gacha.card_total_points || 0,
                                key: Date.now(),
                            });
                            pendingGachaRef.current = null;
                        }, delay);
                        } else {
                            // Slot OFF — show quiet toast with points (no sound)
                            setQuietToast({
                                sparks: d.gacha.sparks_won,
                                cardPts: d.gacha.card_points_earned || 0,
                                tier,
                                key: Date.now(),
                            });
                        }
                    }
                }
            })
            .catch(() => { });
    }, [playerLevel, cardPoints, playerSparks]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [phrasesRes, masteryRes, recordingsRes, linksRes] = await Promise.all([
                    fetch('/api/phrases'),
                    fetch('/api/phrases/mastery'),
                    fetch('/api/voice-recordings'),
                    fetch('/api/phrases/links'),
                ]);
                const phrasesData = await phrasesRes.json();
                const masteryData = await masteryRes.json();
                const recordingsData = await recordingsRes.json();
                const linksData = await linksRes.json();
                if (phrasesData.success) setPhrases(phrasesData.phrases);
                if (masteryData.success) {
                    setPhraseMastery(masteryData.mastery || {});
                    if (masteryData.lastLeveled) setPhraseLastLeveled(masteryData.lastLeveled);
                    if (masteryData.cardPoints) setCardPoints(masteryData.cardPoints);
                }
                if (recordingsData.success) setVoiceRecordings(recordingsData.recordings || {});
                if (linksData.success) {
                    const map: Record<string, PhraseLink[]> = {};
                    for (const l of (linksData.links || [])) {
                        if (!map[l.phrase_id]) map[l.phrase_id] = [];
                        map[l.phrase_id].push(l);
                    }
                    setPhraseLinks(map);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Load voices for speech synthesis
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
            setVoices(enVoices);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => window.speechSynthesis.cancel();
    }, []);

    // Load YouGlish script
    useEffect(() => {
        if (youglishLoaded.current) return;
        const script = document.createElement('script');
        script.src = 'https://youglish.com/public/emb/widget.js';
        script.async = true;
        document.body.appendChild(script);
        youglishLoaded.current = true;
    }, []);

    // YouGlish drag handlers
    const handleDragStart = (e: React.MouseEvent) => {
        if (playerFullscreen) return;
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - playerPosition.x,
            y: e.clientY - playerPosition.y
        };
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (playerFullscreen) return;
        setIsResizing(true);
        dragOffset.current = {
            x: e.clientX,
            y: e.clientY
        };
    };

    const toggleFullscreen = () => {
        setPlayerFullscreen(!playerFullscreen);
        setPlayerMinimized(false);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPlayerPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
            if (isResizing) {
                const deltaX = e.clientX - dragOffset.current.x;
                const deltaY = e.clientY - dragOffset.current.y;
                setPlayerSize(prev => ({
                    width: Math.max(300, prev.width + deltaX),
                    height: Math.max(300, prev.height + deltaY)
                }));
                dragOffset.current = { x: e.clientX, y: e.clientY };
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);

    const playYouGlish = (phrase: Phrase) => {
        setYouglishPhrase(phrase);
        setYouglishQuery('');
        setYouglishSearched(false);
        setCaptionHistory([]);
        currentVideoRef.current = { videoId: '', timestamp: 0 };
        setPlayerPosition({
            x: Math.max(20, window.innerWidth - 460),
            y: Math.max(20, window.innerHeight / 2 - 200)
        });
    };

    const searchYouGlish = () => {
        if (!youglishQuery.trim()) return;
        if (!window.YG) {
            alert('YouGlish is still loading. Please wait a moment and try again.');
            return;
        }

        setYouglishSearched(true);
        setCaptionHistory([]);
        currentVideoRef.current = { videoId: '', timestamp: 0 };

        // Wait for React to render the empty container
        setTimeout(() => {
            const container = document.getElementById('yg-widget-phrases');
            if (container) container.innerHTML = '';

            widgetRef.current = new window.YG.Widget('yg-widget-phrases', {
                width: 400,
                components: 255,
                events: {
                    onFetchDone: (event: { totalResult: number }) => {
                        console.log('YouGlish fetch done:', event.totalResult);
                    },
                    onVideoChange: (event: any) => {
                        const videoId = event.video || event.videoId || '';
                        const start = event.start || 0;
                        if (videoId) {
                            currentVideoRef.current = { videoId, timestamp: start };
                            setCaptionHistory([]);
                        }
                    },
                    onCaptionChange: (event: { caption: string }) => {
                        let caption = event.caption;
                        try { caption = decodeURIComponent(caption); } catch { }
                        caption = caption.replace(/\[\[\[/g, '').replace(/\]\]\]/g, '');

                        setCaptionHistory(prev => {
                            if (prev.length === 0 || prev[prev.length - 1].text !== caption) {
                                return [...prev, { text: caption, selected: true }];
                            }
                            return prev;
                        });
                    }
                }
            });
            widgetRef.current.fetch(youglishQuery.trim(), 'english');
        }, 50);
    };

    const saveSelectedCaptions = async () => {
        if (savingPhrase) return;
        const selectedCaptions = captionHistory.filter(c => c.selected);
        if (selectedCaptions.length === 0) {
            alert('No captions selected');
            return;
        }
        setSavingPhrase(true);
        try {
            const fullText = selectedCaptions.map(c => c.text).join(' ');
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: fullText,
                    japanese: `(${youglishPhrase?.english.slice(0, 30) || 'YouGlish'})`,
                    category: 'YouGlish',
                    date: youglishSaveDate
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.phrase && !data.duplicate) {
                    setPhrases(prev => [...prev, data.phrase]);
                }
                alert('Saved!');
                setCaptionHistory([]);
            } else {
                alert('Failed to save');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving');
        } finally {
            setSavingPhrase(false);
        }
    };

    // Group by date
    const phrasesByDate = useMemo(() => {
        const map: Record<string, Phrase[]> = {};
        phrases.forEach(phrase => {
            const dateKey = phrase.date.split('T')[0];
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(phrase);
        });
        return map;
    }, [phrases]);

    // Phrase ID → YYYY-MM-DD date lookup
    const phraseDateMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const p of phrases) map[p.id] = p.date.split('T')[0];
        return map;
    }, [phrases]);

    // Filtered items for search
    const filteredPhrases = useMemo(() => {
        if (!searchQuery.trim()) return phrases;
        const q = searchQuery.toLowerCase();
        return phrases.filter(p =>
            p.english.toLowerCase().includes(q) ||
            p.japanese.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
    }, [phrases, searchQuery]);

    // This month's phrases for review, grouped by mastery level
    // Each level is independently shuffled on every reload / tab switch / shuffleKey change
    const thisMonthReviewPhrases = useMemo(() => {
        void shuffleKey; // dependency trigger — forces full re-shuffle
        if (!currentMonth) return { level0: [], level1: [], level2: [], level3: [], level4: [], level5: [], level6: [], all: [], total: [] };
        // Use string comparison to avoid UTC vs local timezone mismatch
        const y = currentMonth.getFullYear();
        const m = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const monthPrefix = `${y}-${m}`;

        const monthPhrases = phrases.filter(p => {
            const dateStr = p.date.split('T')[0];
            return dateStr.startsWith(monthPrefix);
        });

        const withChakra = monthPhrases.map(p => {
            const m = Number(phraseMastery[p.id] || 0);
            const hasRec = (voiceRecordings[p.id] || []).length > 0;
            const hasLink = (phraseLinks[p.id] || []).length > 0;
            return { phrase: p, chakra: getChakraLevel(m, hasRec, hasLink) };
        });

        return {
            level0: fisherYates(withChakra.filter(x => x.chakra === 0).map(x => x.phrase)),
            level1: fisherYates(withChakra.filter(x => x.chakra === 1).map(x => x.phrase)),
            level2: fisherYates(withChakra.filter(x => x.chakra === 2).map(x => x.phrase)),
            level3: fisherYates(withChakra.filter(x => x.chakra === 3).map(x => x.phrase)),
            level4: fisherYates(withChakra.filter(x => x.chakra === 4).map(x => x.phrase)),
            level5: fisherYates(withChakra.filter(x => x.chakra === 5).map(x => x.phrase)),
            level6: fisherYates(withChakra.filter(x => x.chakra === 6).map(x => x.phrase)),
            all: fisherYates(withChakra.filter(x => x.chakra < 3).map(x => x.phrase)),
            total: fisherYates(monthPhrases),
        };
    }, [phrases, currentMonth, shuffleKey, phraseMastery, voiceRecordings, phraseLinks]);

    // Analytics computation for dashboard
    const chakraAnalytics = useMemo(() => {
        const allPhrases = phrases;
        const monthPhrases = thisMonthReviewPhrases.total;

        // Points: each phrase contributes (chakraLevel + 1) points
        let totalPoints = 0;
        let monthPoints = 0;
        const levelCounts = [0, 0, 0, 0, 0, 0, 0];

        allPhrases.forEach(p => {
            const m = Number(phraseMastery[p.id] || 0);
            const hasRec = (voiceRecordings[p.id] || []).length > 0;
            const hasLink = (phraseLinks[p.id] || []).length > 0;
            const lv = getChakraLevel(m, hasRec, hasLink);
            totalPoints += (lv + 1);
            levelCounts[lv]++;
        });

        monthPhrases.forEach(p => {
            const m = Number(phraseMastery[p.id] || 0);
            const hasRec = (voiceRecordings[p.id] || []).length > 0;
            const hasLink = (phraseLinks[p.id] || []).length > 0;
            const lv = getChakraLevel(m, hasRec, hasLink);
            monthPoints += (lv + 1);
        });

        // Today's review count (touches)
        const todayTouches = clientToday ? (monthlyReviewCounts[clientToday]?.count || 0) : 0;

        // Average chakra level
        const avgLevel = allPhrases.length > 0
            ? allPhrases.reduce((sum, p) => {
                const m = Number(phraseMastery[p.id] || 0);
                const hasRec = (voiceRecordings[p.id] || []).length > 0;
                const hasLink = (phraseLinks[p.id] || []).length > 0;
                return sum + getChakraLevel(m, hasRec, hasLink);
            }, 0) / allPhrases.length
            : 0;

        // Daily activity data (bar chart for current month)
        const dailyData: { day: number; touches: number }[] = [];
        let daysInMonth = 30;
        if (currentMonth) {
            daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const dk = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                dailyData.push({ day: d, touches: monthlyReviewCounts[dk]?.count || 0 });
            }
        }

        // Active days this month
        const activeDays = dailyData.filter(d => d.touches > 0).length;

        // Streak (consecutive days from today backwards)
        let streak = 0;
        if (clientToday) {
            const [y, m2, d2] = clientToday.split('-').map(Number);
            const startDate = new Date(y, m2 - 1, d2);
            for (let i = 0; i < 365; i++) {
                const d = new Date(startDate);
                d.setDate(d.getDate() - i);
                const dk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if ((monthlyReviewCounts[dk]?.count || 0) > 0) streak++;
                else break;
            }
        }

        return { totalPoints, monthPoints, todayTouches, avgLevel, levelCounts, dailyData, activeDays, streak, daysInMonth };
    }, [phrases, thisMonthReviewPhrases, phraseMastery, voiceRecordings, phraseLinks, monthlyReviewCounts, currentMonth, clientToday]);

    // Separate memo for recorded filter — voiceRecordings changes must NOT reshuffle the list
    const recordedReviewPhrases = useMemo(() => {
        return thisMonthReviewPhrases.total.filter(p => (voiceRecordings[p.id] || []).length > 0);
    }, [thisMonthReviewPhrases.total, voiceRecordings]);

    // Phrases that have linked notes
    const linkedReviewPhrases = useMemo(() => {
        return thisMonthReviewPhrases.total.filter(p => (phraseLinks[p.id] || []).length > 0);
    }, [thisMonthReviewPhrases.total, phraseLinks]);

    // Live computed list (recomputes on every recording/mastery change — used for tab counts)
    const computedReviewList = useMemo(() => {
        if (reviewFilter === 'all') return thisMonthReviewPhrases.total;
        if (reviewFilter === 'random') return thisMonthReviewPhrases.all;
        if (reviewFilter === 'recorded') return recordedReviewPhrases;
        if (reviewFilter === 'linked') return linkedReviewPhrases;
        return thisMonthReviewPhrases[`level${reviewFilter}` as keyof typeof thisMonthReviewPhrases] as Phrase[];
    }, [thisMonthReviewPhrases, reviewFilter, recordedReviewPhrases, linkedReviewPhrases]);

    // Stable review list — only updates on filter/shuffle/phrase changes, NOT on recording/mastery
    // This prevents "jump to next" when recording promotes a phrase to a higher chakra level
    const reviewListCacheRef = useRef<{ filter: string; shuffleKey: number; phrasesLen: number; list: Phrase[] }>(
        { filter: '', shuffleKey: -1, phrasesLen: 0, list: [] }
    );
    const cacheKey = reviewListCacheRef.current;
    if (cacheKey.filter !== String(reviewFilter) || cacheKey.shuffleKey !== shuffleKey || cacheKey.phrasesLen !== phrases.length) {
        reviewListCacheRef.current = { filter: String(reviewFilter), shuffleKey, phrasesLen: phrases.length, list: computedReviewList };
    }
    // Hide phrases touched today — once you press mastery, it won't reappear until tomorrow
    const reviewListRaw = reviewListCacheRef.current.list;
    const reviewList = clientToday
        ? reviewListRaw.filter(p => phraseLastLeveled[p.id] !== clientToday)
        : reviewListRaw;

    // History-aware displayed card: celebration > history > queue
    const displayedCard = cardCelebration
        ? cardCelebration.phrase
        : historyOffset > 0 && reviewHistory.length >= historyOffset
            ? reviewHistory[reviewHistory.length - historyOffset]
            : (reviewList[reviewIndex] || null);

    // Clamp reviewIndex when list shrinks (e.g. after deletion)
    useEffect(() => {
        if (reviewList.length > 0 && reviewIndex >= reviewList.length) {
            setReviewIndex(reviewList.length - 1);
        }
    }, [reviewList.length, reviewIndex]);

    // Exit review mode on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && viewMode === 'review') setViewMode('calendar');
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [viewMode]);

    // Today's XP + sparks — from DB via monthlyReviewCounts
    const todayKey = clientToday || new Date().toISOString().split('T')[0];
    const todayXP = monthlyReviewCounts[todayKey]?.xp || 0;
    const todaySparks = monthlyReviewCounts[todayKey]?.sparks || 0;

    // Daily level — derived from today's XP, resets each day
    const dailyLevel = dailyLevelFromXP(todayXP);
    const dailyTitle = getDailyTitleForLevel(dailyLevel);

    // Detect daily level-up
    useEffect(() => {
        if (dailyLevel > prevDailyLevelRef.current && prevDailyLevelRef.current > 0) {
            const info = getDailyTitleForLevel(dailyLevel);
            setDailyLevelUpEffect({ level: dailyLevel, title: info.title, color: info.color, key: Date.now() });
        }
        prevDailyLevelRef.current = dailyLevel;
    }, [dailyLevel]);

    // Floating "+N XP" popups (RPG-style)
    const [xpFloats, setXpFloats] = useState<Array<{ id: number; value: number; color: string }>>([]);
    // Touch float
    const [touchFloats, setTouchFloats] = useState<Array<{ id: number }>>([]);

    // Spawn XP float when pointEffect fires
    useEffect(() => {
        if (!pointEffect) return;
        const fid = Date.now();
        setXpFloats(prev => [...prev, { id: fid, value: pointEffect.points, color: pointEffect.color }]);
        setTimeout(() => setXpFloats(prev => prev.filter(f => f.id !== fid)), 1200);
    }, [pointEffect]);

    // Spawn touch float when monthlyReviewCounts for today changes
    const prevTouchRef = useRef(0);
    useEffect(() => {
        const current = monthlyReviewCounts[todayKey]?.count || 0;
        if (current > prevTouchRef.current && prevTouchRef.current > 0) {
            const fid = Date.now();
            setTouchFloats(prev => [...prev, { id: fid }]);
            setTimeout(() => setTouchFloats(prev => prev.filter(f => f.id !== fid)), 1200);
        }
        prevTouchRef.current = current;
    }, [monthlyReviewCounts, todayKey]);

    // Auto-clear point effect
    useEffect(() => {
        if (!pointEffect) return;
        const timer = setTimeout(() => setPointEffect(null), 2000);
        return () => clearTimeout(timer);
    }, [pointEffect]);

    // Auto-clear calendar pulse (particle burst + floating number)
    useEffect(() => {
        if (!calendarPulse) return;
        const timer = setTimeout(() => setCalendarPulse(null), 4500);
        return () => clearTimeout(timer);
    }, [calendarPulse]);

    // Review content: large version for PC fullscreen, compact for mobile inline
    const isFullReview = viewMode === 'review' && !isMobile;

    const renderReviewContent = () => {
        const currentPhrase = displayedCard;
        const currentCardPts = currentPhrase ? (cardPoints[currentPhrase.id] || 0) : 0;
        const currentCardRank = getCardRank(currentCardPts);
        const isHolo = currentCardRank.rank === 'HOLOGRAPHIC' || currentCardRank.rank === 'LEGENDARY';

        return (
            <>
                {/* Review Card */}
                {(reviewList.length > 0 || historyOffset > 0 || cardCelebration) ? (
                    <div style={{
                        borderRadius: '16px',
                        ...getCardFrame(currentCardRank.rank),
                        boxShadow: cardCelebration
                            ? `${getCardShadow(currentCardRank.rank)}, 0 0 30px ${CHAKRA_CONFIG[getChakraLevel(Number(phraseMastery[displayedCard?.id || ''] || 0), (voiceRecordings[displayedCard?.id || ''] || []).length > 0, (phraseLinks[displayedCard?.id || ''] || []).length > 0)].gradFrom}60`
                            : getCardShadow(currentCardRank.rank),
                        padding: '8px',
                        position: 'relative',
                        transition: cardCelebration ? 'none' : 'transform 0.3s ease',
                        ...(cardCelebration ? {
                            animation: 'card-levelup-celebrate 2.5s ease-out forwards',
                        } : isHolo ? {
                            animation: 'card-holo-shimmer 3s ease-in-out infinite',
                        } : {}),
                    }}>
                        {/* Holographic overlay for HOLO+ cards */}
                        {isHolo && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: currentCardRank.rank === 'LEGENDARY'
                                    ? 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(168,85,247,0.06) 25%, rgba(59,130,246,0.06) 50%, rgba(212,175,55,0.08) 75%, rgba(168,85,247,0.06) 100%)'
                                    : 'linear-gradient(135deg, rgba(168,85,247,0.05) 0%, rgba(59,130,246,0.04) 50%, rgba(168,85,247,0.05) 100%)',
                                backgroundSize: '200% 200%',
                                animation: 'card-holo-shimmer 3s ease-in-out infinite',
                                borderRadius: '10px',
                                pointerEvents: 'none',
                                zIndex: 0,
                            }} />
                        )}
                        {/* Legendary particle aura */}
                        {currentCardRank.rank === 'LEGENDARY' && (
                            <>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        width: '3px', height: '3px',
                                        borderRadius: '50%',
                                        background: i % 2 === 0 ? '#D4AF37' : '#A855F7',
                                        left: `${10 + (i * 11) % 80}%`,
                                        top: `${5 + (i * 13) % 85}%`,
                                        animation: `card-particle-float ${2 + (i % 3)}s ease-in-out infinite`,
                                        animationDelay: `${i * 0.3}s`,
                                        opacity: 0.5,
                                        zIndex: 2,
                                        pointerEvents: 'none',
                                    }} />
                                ))}
                            </>
                        )}

                        {/* Level-up celebration overlay */}
                        {cardCelebration && displayedCard && (() => {
                            const cbm = Number(phraseMastery[displayedCard.id] || 0);
                            const chr = (voiceRecordings[displayedCard.id] || []).length > 0;
                            const chl = (phraseLinks[displayedCard.id] || []).length > 0;
                            const celebChakra = getChakraInfo(cbm, chr, chl);
                            return (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 10, pointerEvents: 'none',
                                    borderRadius: '12px',
                                    background: `radial-gradient(circle, ${celebChakra.gradFrom}20 0%, transparent 70%)`,
                                }}>
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                        animation: 'celebrate-badge 2s ease-out forwards',
                                    }}>
                                        <div style={{
                                            fontSize: isFullReview ? '18px' : '14px',
                                            fontWeight: '900',
                                            letterSpacing: '6px',
                                            color: celebChakra.color,
                                            textShadow: `0 0 24px ${celebChakra.gradFrom}90, 0 0 48px ${celebChakra.gradFrom}40, 0 2px 8px rgba(0,0,0,0.2)`,
                                        }}>
                                            レベルアップ
                                        </div>
                                        <div style={{
                                            fontSize: isFullReview ? '36px' : '26px',
                                            fontWeight: '900',
                                            letterSpacing: '3px',
                                            background: `linear-gradient(135deg, ${celebChakra.gradFrom}, ${celebChakra.gradTo})`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            filter: `drop-shadow(0 0 16px ${celebChakra.gradFrom}70)`,
                                        }}>
                                            {celebChakra.ja}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Top Name Bar — Pokemon style [Category] [Rank] ... [SP pts] */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: isFullReview ? '8px 12px' : '6px 8px',
                            backgroundColor: `${getFrameAccent(currentCardRank.rank)}12`,
                            borderRadius: '8px 8px 0 0',
                            borderBottom: `1px solid ${getFrameAccent(currentCardRank.rank)}30`,
                            position: 'relative',
                            zIndex: 3,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {/* Element icon */}
                                {currentPhrase && (
                                    <ElementBadge element={currentPhrase.category} size={12} />
                                )}
                                {/* Rank label */}
                                {currentCardRank.rank !== 'NORMAL' && (
                                    <span style={{
                                        fontSize: isFullReview ? '10px' : '8px',
                                        fontWeight: '800',
                                        color: currentCardRank.borderColor,
                                        letterSpacing: '1.5px',
                                    }}>
                                        {currentCardRank.label}
                                    </span>
                                )}
                            </div>
                            {/* SP points — like HP in Pokemon */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                                <span style={{
                                    fontSize: isFullReview ? '16px' : '12px',
                                    fontWeight: '900',
                                    color: currentCardRank.rank !== 'NORMAL' ? currentCardRank.borderColor : '#A8A29E',
                                    fontVariantNumeric: 'tabular-nums',
                                }}>
                                    {currentCardPts}
                                </span>
                                <span style={{
                                    fontSize: isFullReview ? '9px' : '7px',
                                    fontWeight: '700',
                                    color: '#A8A29E',
                                    letterSpacing: '0.5px',
                                }}>
                                    SP
                                </span>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                fontSize: isFullReview ? '10px' : '8px',
                                fontWeight: '600',
                                color: '#A8A29E',
                                marginTop: '2px',
                                width: '100%',
                            }}>
                                {currentPhrase?.date.split('T')[0]}
                            </div>
                        </div>
                        {/* Illustration Window — the "artwork" area */}
                        <div style={{
                            background: getCardWindowBg(currentCardRank.rank),
                            borderRadius: '12px',
                            border: `1px solid ${getFrameAccent(currentCardRank.rank)}30`,
                            margin: '0',
                            padding: isFullReview ? '16px' : '10px',
                            position: 'relative',
                            zIndex: 3,
                        }}>
                            {/* Stats Bar: XP + Progress + Touches */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: isFullReview ? '32px' : '20px',
                                marginBottom: isFullReview ? '20px' : '10px',
                                padding: isFullReview ? '10px 0' : '6px 0',
                                borderBottom: `1px solid ${getFrameAccent(currentCardRank.rank)}20`,
                            }}>
                                {/* XP */}
                                <div style={{ position: 'relative', textAlign: 'center', minWidth: isFullReview ? '80px' : '50px' }}>
                                    <div style={{
                                        fontSize: isFullReview ? '36px' : '22px',
                                        fontWeight: '900',
                                        color: '#D4AF37',
                                        fontVariantNumeric: 'tabular-nums',
                                        letterSpacing: '-1px',
                                        lineHeight: 1,
                                    }}>
                                        {todayXP}
                                    </div>
                                    <div style={{
                                        fontSize: isFullReview ? '10px' : '8px',
                                        fontWeight: '700',
                                        color: '#B8860B',
                                        letterSpacing: '2px',
                                        marginTop: '4px',
                                    }}>
                                        経験値
                                    </div>
                                    {/* Floating +N XP */}
                                    {xpFloats.map(f => (
                                        <div key={f.id} style={{
                                            position: 'absolute',
                                            left: '50%',
                                            top: isFullReview ? '-8px' : '-4px',
                                            transform: 'translateX(-50%)',
                                            fontSize: isFullReview ? '18px' : '14px',
                                            fontWeight: '900',
                                            color: f.color,
                                            pointerEvents: 'none',
                                            animation: 'xp-float 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                            textShadow: `0 0 12px ${f.color}60`,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            +{f.value}
                                        </div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div style={{ width: '1px', height: isFullReview ? '36px' : '24px', backgroundColor: '#e5e5e5' }} />

                                {/* Progress */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: isFullReview ? '20px' : '14px',
                                        fontWeight: '700',
                                        color: '#333',
                                        fontVariantNumeric: 'tabular-nums',
                                        lineHeight: 1,
                                    }}>
                                        {reviewIndex + 1}<span style={{ color: '#ccc', fontWeight: '400' }}>/{reviewList.length}</span>
                                    </div>
                                    <div style={{
                                        fontSize: isFullReview ? '10px' : '8px',
                                        fontWeight: '600',
                                        color: '#aaa',
                                        letterSpacing: '1px',
                                        marginTop: '4px',
                                    }}>
                                        カード
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{ width: '1px', height: isFullReview ? '36px' : '24px', backgroundColor: '#e5e5e5' }} />

                                {/* Touches */}
                                <div style={{ position: 'relative', textAlign: 'center', minWidth: isFullReview ? '80px' : '50px' }}>
                                    <div style={{
                                        fontSize: isFullReview ? '36px' : '22px',
                                        fontWeight: '900',
                                        color: '#10B981',
                                        fontVariantNumeric: 'tabular-nums',
                                        letterSpacing: '-1px',
                                        lineHeight: 1,
                                    }}>
                                        {monthlyReviewCounts[todayKey]?.count || 0}
                                    </div>
                                    <div style={{
                                        fontSize: isFullReview ? '10px' : '8px',
                                        fontWeight: '700',
                                        color: '#047857',
                                        letterSpacing: '2px',
                                        marginTop: '4px',
                                    }}>
                                        回数
                                    </div>
                                    {/* Floating +1 */}
                                    {touchFloats.map(f => (
                                        <div key={f.id} style={{
                                            position: 'absolute',
                                            left: '50%',
                                            top: isFullReview ? '-8px' : '-4px',
                                            transform: 'translateX(-50%)',
                                            fontSize: isFullReview ? '16px' : '12px',
                                            fontWeight: '800',
                                            color: '#10B981',
                                            pointerEvents: 'none',
                                            animation: 'xp-float 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                            textShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            +1
                                        </div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div style={{ width: '1px', height: isFullReview ? '36px' : '24px', backgroundColor: '#e5e5e5' }} />

                                {/* SP — big, flashy */}
                                <div style={{
                                    textAlign: 'center',
                                    minWidth: isFullReview ? '90px' : '54px',
                                    position: 'relative',
                                }}>
                                    <div style={{
                                        fontSize: isFullReview ? '40px' : '24px',
                                        fontWeight: '900',
                                        fontVariantNumeric: 'tabular-nums',
                                        letterSpacing: '-2px',
                                        lineHeight: 1,
                                        background: 'linear-gradient(180deg, #F6C85F 0%, #D4AF37 50%, #B8860B 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: 'drop-shadow(0 1px 3px rgba(212,175,55,0.3))',
                                    }}>
                                        {todaySparks.toLocaleString()}
                                    </div>
                                    <div style={{
                                        fontSize: isFullReview ? '9px' : '7px',
                                        fontWeight: '800',
                                        color: '#D4AF37',
                                        letterSpacing: '3px',
                                        marginTop: '3px',
                                    }}>
                                        スロット
                                    </div>
                                </div>
                            </div>

                            {/* English */}
                            <div style={{
                                fontSize: isFullReview ? '32px' : '16px',
                                fontWeight: '600',
                                color: '#1a1a1a',
                                marginBottom: isFullReview ? '16px' : '10px',
                                lineHeight: 1.5,
                                textAlign: 'center',
                            }}>
                                {displayedCard?.english}
                            </div>

                            {/* Japanese */}
                            <div style={{
                                fontSize: isFullReview ? '20px' : '13px',
                                color: '#666',
                                marginBottom: displayedCard?.source_id ? (isFullReview ? '16px' : '8px') : (isFullReview ? '40px' : '16px'),
                                textAlign: 'center',
                            }}>
                                {displayedCard?.japanese}
                            </div>

                            {/* Linked notes on this card */}
                            {displayedCard && (phraseLinks[displayedCard.id] || []).length > 0 && (
                                <div style={{
                                    padding: isFullReview ? '16px' : '10px',
                                    backgroundColor: '#F5F3FF',
                                    borderRadius: '10px',
                                    border: '1px solid #E9E5FF',
                                    marginBottom: isFullReview ? '24px' : '12px',
                                }}>
                                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#8B5CF6', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                        ADD ({phraseLinks[displayedCard.id].length})
                                    </div>
                                    {phraseLinks[displayedCard.id].map((link, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '6px 0',
                                            borderBottom: '1px solid #EDE9FE',
                                            fontSize: isFullReview ? '14px' : '12px',
                                            color: '#5B21B6',
                                        }}>
                                            <span>{link.text}</span>
                                            <button
                                                onClick={() => {
                                                    window.speechSynthesis.cancel();
                                                    const u = new SpeechSynthesisUtterance(link.text);
                                                    u.lang = 'en-US';
                                                    u.rate = 0.9;
                                                    const v = voices.find(v => v.name.includes('Google US English')) || voices[0];
                                                    if (v) u.voice = v;
                                                    window.speechSynthesis.speak(u);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Level Up button — full width, prominent */}
                            {displayedCard && (() => {
                                const baseMastery = Number(phraseMastery[displayedCard.id] || 0);
                                const hasRec = (voiceRecordings[displayedCard.id] || []).length > 0;
                                const hasLink = (phraseLinks[displayedCard.id] || []).length > 0;
                                const chakra = getChakraInfo(baseMastery, hasRec, hasLink);
                                const isLockedToday = baseMastery === 3 || (baseMastery !== 6 && baseMastery < 3 && phraseLastLeveled[displayedCard.id] === clientToday);
                                const isCrownReady = chakra.level === 5;
                                const isMaxed = baseMastery === 3 || baseMastery === 6;
                                return (
                                    <div style={{ marginTop: isFullReview ? '8px' : '4px' }}>
                                        {isCrownReady ? (
                                            <button
                                                onClick={() => {
                                                    if (cardCelebration) return;
                                                    if (displayedCard) {
                                                        setCardCelebration({ phrase: displayedCard, key: Date.now() });
                                                    }
                                                    declareCrown(displayedCard.id);
                                                }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                    width: '100%',
                                                    padding: isFullReview ? '18px 0' : '14px 0',
                                                    borderRadius: '14px',
                                                    border: 'none',
                                                    background: 'linear-gradient(135deg, #7E22CE, #A855F7)',
                                                    color: '#fff',
                                                    fontSize: isFullReview ? '17px' : '15px',
                                                    fontWeight: '800',
                                                    cursor: 'pointer',
                                                    letterSpacing: '2px',
                                                    boxShadow: '0 4px 16px #A855F740',
                                                    transition: 'transform 0.12s, box-shadow 0.12s',
                                                }}
                                                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                                                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                                CROWN
                                            </button>
                                        ) : isMaxed ? (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                width: '100%',
                                                padding: isFullReview ? '12px 0' : '10px 0',
                                                borderRadius: '14px',
                                                backgroundColor: '#F5F5F4',
                                                color: '#A8A29E',
                                                fontSize: isFullReview ? '13px' : '11px',
                                                fontWeight: '700',
                                                letterSpacing: '2px',
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8A29E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                COMPLETE
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'stretch' }}>
                                                <button
                                                    onClick={() => {
                                                        if (isLockedToday || cardCelebration) return;
                                                        const currentPhrase = displayedCard;
                                                        if (!currentPhrase) return;
                                                        const current = Number(phraseMastery[currentPhrase.id] || 0);
                                                        if (current === 3) return;
                                                        const next = current === 6 ? 0 : (current + 1);
                                                        const isLevelUp = next > 0 && next > current;

                                                        if (isLevelUp) {
                                                            const nl = getChakraLevel(next, hasRec, hasLink);
                                                            const nc = CHAKRA_CONFIG[nl];
                                                            const k = Date.now();
                                                            playLevelSound(nl);
                                                            setPointEffect({
                                                                points: nc.lv,
                                                                color: nc.color,
                                                                gradFrom: nc.gradFrom,
                                                                gradTo: nc.gradTo,
                                                                levelName: nc.name,
                                                                key: k,
                                                            });
                                                            setCalendarPulse({
                                                                dateKey: currentPhrase.date.split('T')[0],
                                                                points: nc.lv,
                                                                gradFrom: nc.gradFrom,
                                                                color: nc.color,
                                                                level: nl,
                                                                key: k,
                                                            });
                                                        }

                                                        if (isLevelUp) {
                                                            setCardCelebration({ phrase: currentPhrase, key: Date.now() });
                                                        }
                                                        cycleMastery(currentPhrase.id, isLevelUp);
                                                    }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                        flex: 1,
                                                        padding: isFullReview ? '14px 0' : '11px 0',
                                                        borderRadius: '14px',
                                                        border: 'none',
                                                        background: isLockedToday
                                                            ? '#E7E5E4'
                                                            : `linear-gradient(135deg, ${chakra.gradFrom}, ${chakra.color})`,
                                                        color: isLockedToday ? '#A8A29E' : '#fff',
                                                        fontSize: isFullReview ? '17px' : '15px',
                                                        fontWeight: '800',
                                                        cursor: isLockedToday ? 'not-allowed' : 'pointer',
                                                        letterSpacing: '2px',
                                                        boxShadow: isLockedToday ? 'none' : `0 4px 16px ${chakra.color}40`,
                                                        transition: 'transform 0.12s, box-shadow 0.12s',
                                                    }}
                                                    onMouseDown={e => { if (!isLockedToday) e.currentTarget.style.transform = 'scale(0.97)'; }}
                                                    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="18 15 12 9 6 15" />
                                                    </svg>
                                                    Lv.{chakra.level + 1} {chakra.ja} {chakra.name}
                                                </button>
                                                {(() => {
                                                    const isPlaying = playingPhraseId === displayedCard.id;
                                                    return (
                                                        <button
                                                            onClick={() => {
                                                                if (isPlaying) {
                                                                    window.speechSynthesis.cancel();
                                                                    setPlayingPhraseId(null);
                                                                } else {
                                                                    playPhrase(displayedCard);
                                                                }
                                                            }}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                width: isFullReview ? '44px' : '38px',
                                                                height: isFullReview ? '44px' : '38px',
                                                                borderRadius: '50%',
                                                                border: isPlaying ? '2px solid #D4AF37' : '1px solid #E7E5E4',
                                                                background: isPlaying ? '#FFFBEB' : '#FAFAF9',
                                                                color: isPlaying ? '#B8941E' : '#A8A29E',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                                flexShrink: 0,
                                                                padding: 0,
                                                            }}
                                                            onMouseEnter={e => {
                                                                if (!isPlaying) {
                                                                    e.currentTarget.style.borderColor = '#D4AF37';
                                                                    e.currentTarget.style.background = '#FFFBEB';
                                                                    e.currentTarget.style.color = '#92400E';
                                                                }
                                                            }}
                                                            onMouseLeave={e => {
                                                                if (!isPlaying) {
                                                                    e.currentTarget.style.borderColor = '#E7E5E4';
                                                                    e.currentTarget.style.background = '#FAFAF9';
                                                                    e.currentTarget.style.color = '#A8A29E';
                                                                }
                                                            }}
                                                        >
                                                            {isPlaying ? (
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                                                </svg>
                                                            ) : (
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>{/* End Illustration Window */}

                        {/* XP Bars Section — between window and attacks */}
                        <div style={{
                            padding: isFullReview ? '12px 8px 8px' : '8px 4px 4px',
                            position: 'relative',
                            zIndex: 3,
                        }}>
                            {/* Daily Level XP Bar */}
                            {(() => {
                                const dCurrentXP = dailyXpForLevel(dailyLevel);
                                const dNextXP = dailyXpForLevel(dailyLevel + 1);
                                const dXpInto = todayXP - dCurrentXP;
                                const dXpNeeded = dNextXP - dCurrentXP;
                                const dProgress = dXpNeeded > 0 ? Math.min(dXpInto / dXpNeeded, 1) : 1;
                                const dAlmost = dProgress >= 0.9 && dProgress < 1;
                                return (
                                    <div style={{
                                        marginBottom: isFullReview ? '8px' : '4px',
                                        position: 'relative',
                                    }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'baseline', gap: '6px',
                                            marginBottom: isFullReview ? '6px' : '3px',
                                        }}>
                                            <span style={{
                                                fontSize: isFullReview ? '9px' : '7px',
                                                fontWeight: '700',
                                                color: '#bbb',
                                                letterSpacing: '1.5px',
                                            }}>本日</span>
                                            <span style={{
                                                fontSize: isFullReview ? '16px' : '12px',
                                                fontWeight: '900',
                                                color: dailyTitle.color,
                                                letterSpacing: '-0.5px',
                                            }}>
                                                Lv.{dailyLevel}
                                            </span>
                                            <span style={{
                                                fontSize: isFullReview ? '12px' : '9px',
                                                fontWeight: '700',
                                                color: dailyTitle.color,
                                            }}>
                                                {dailyTitle.title}
                                            </span>
                                            <span style={{
                                                fontSize: isFullReview ? '10px' : '7px',
                                                fontWeight: '600',
                                                color: '#ccc',
                                                fontVariantNumeric: 'tabular-nums',
                                                marginLeft: 'auto',
                                            }}>
                                                {todayXP.toLocaleString()}<span style={{ color: '#e5e5e5' }}>/{dNextXP.toLocaleString()}</span>
                                            </span>
                                        </div>
                                        <div style={{
                                            height: isFullReview ? '10px' : '6px',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '999px',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.max(dProgress * 100, 2)}%`,
                                                background: `linear-gradient(90deg, ${dailyTitle.color}55, ${dailyTitle.color})`,
                                                borderRadius: '999px',
                                                transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                                                ...(dAlmost ? { animation: 'xp-bar-pulse 1.5s ease-in-out infinite' } : {}),
                                            }} />
                                        </div>
                                        {dailyLevelUpEffect && (
                                            <div style={{
                                                position: 'absolute',
                                                right: isFullReview ? '16px' : '10px',
                                                top: '0',
                                                fontSize: isFullReview ? '14px' : '10px',
                                                fontWeight: '900',
                                                color: dailyLevelUpEffect.color,
                                                textShadow: `0 0 20px ${dailyLevelUpEffect.color}80`,
                                                animation: 'xp-float 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                                pointerEvents: 'none',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                レベルアップ!
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Overall Level */}
                            {(() => {
                                const titleInfo = getTitleForLevel(playerLevel);
                                const currentLevelXP = xpForLevel(playerLevel);
                                const nextLevelXP = xpForLevel(playerLevel + 1);
                                const xpIntoLevel = playerTotalXP - currentLevelXP;
                                const xpNeeded = nextLevelXP - currentLevelXP;
                                const progress = xpNeeded > 0 ? Math.min(xpIntoLevel / xpNeeded, 1) : 1;
                                return (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: isFullReview ? '8px' : '6px',
                                        opacity: 0.5,
                                    }}>
                                        <div style={{
                                            flexShrink: 0,
                                            fontSize: isFullReview ? '9px' : '7px',
                                            fontWeight: '700',
                                            color: titleInfo.color,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            Lv.{playerLevel} {titleInfo.title}
                                        </div>
                                        <div style={{
                                            flex: 1, height: isFullReview ? '3px' : '2px',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '999px',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.max(progress * 100, 2)}%`,
                                                background: titleInfo.color,
                                                borderRadius: '999px',
                                                transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                                            }} />
                                        </div>
                                        <div style={{
                                            flexShrink: 0,
                                            fontSize: isFullReview ? '8px' : '6px',
                                            fontWeight: '600',
                                            color: '#bbb',
                                            fontVariantNumeric: 'tabular-nums',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {playerTotalXP.toLocaleString()}/{nextLevelXP.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Luck + SP indicator */}
                            {luckMultiplier > 1 && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    marginTop: '2px', opacity: 0.4,
                                }}>
                                    <span style={{
                                        fontSize: isFullReview ? '8px' : '6px',
                                        fontWeight: '700',
                                        color: '#D4AF37',
                                        letterSpacing: '0.5px',
                                    }}>
                                        LUCK x{luckMultiplier.toFixed(2)}
                                    </span>
                                    <span style={{
                                        fontSize: isFullReview ? '8px' : '6px',
                                        fontWeight: '600',
                                        color: '#A8A29E',
                                    }}>
                                        {playerSparks.toLocaleString()} SP
                                    </span>
                                </div>
                            )}

                            {/* Separator */}
                            <div style={{
                                height: '1px',
                                backgroundColor: `${getFrameAccent(currentCardRank.rank)}25`,
                                margin: isFullReview ? '10px 0' : '6px 0',
                            }} />
                        </div>{/* End XP Bars Section */}

                        {/* Actions row: 削除 / 編集 / 研究 / 録音 */}
                        {displayedCard && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: isFullReview ? '6px' : '4px',
                                padding: isFullReview ? '2px 12px 10px' : '2px 8px 6px',
                                position: 'relative',
                                zIndex: 3,
                            }}>
                                <button
                                    onClick={() => handleDeletePhrase(displayedCard.id)}
                                    style={{
                                        background: '#FEF2F2',
                                        border: '1px solid #FECACA',
                                        color: '#EF4444',
                                        fontSize: isFullReview ? '11px' : '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        padding: isFullReview ? '6px 14px' : '5px 10px',
                                        borderRadius: '5px',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                                >
                                    削除
                                </button>
                                <button
                                    onClick={() => {
                                        const p = displayedCard;
                                        setEditingPhrase({ id: p.id, english: p.english, japanese: p.japanese });
                                    }}
                                    style={{
                                        background: '#EFF6FF',
                                        border: '1px solid #BFDBFE',
                                        color: '#3B82F6',
                                        fontSize: isFullReview ? '11px' : '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        padding: isFullReview ? '6px 14px' : '5px 10px',
                                        borderRadius: '5px',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                                >
                                    編集
                                </button>
                                <button
                                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                                    style={{
                                        padding: isFullReview ? '6px 14px' : '5px 10px',
                                        borderRadius: '5px',
                                        border: showQuickAdd ? '2px solid #D4AF37' : '1px solid #ddd',
                                        backgroundColor: showQuickAdd ? '#FFFBEB' : 'transparent',
                                        color: showQuickAdd ? '#D4AF37' : '#888',
                                        fontSize: isFullReview ? '11px' : '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showQuickAdd ? 'Close' : '研究'}
                                </button>
                                {displayedCard && (
                                    <VoiceRecorder
                                        phraseId={displayedCard.id}
                                        recordings={voiceRecordings[displayedCard.id] || []}
                                        onRecordingComplete={(recording) => {
                                            const pid = displayedCard.id;
                                            const prevRecs = voiceRecordings[pid] || [];
                                            const wasFirst = prevRecs.length === 0;
                                            setVoiceRecordings(prev => ({
                                                ...prev,
                                                [pid]: [recording, ...(prev[pid] || [])],
                                            }));
                                            const baseMastery = Number(phraseMastery[pid] || 0);
                                            const hasLink = (phraseLinks[pid] || []).length > 0;
                                            const levelBefore = getChakraLevel(baseMastery, !wasFirst, hasLink);
                                            const levelAfter = getChakraLevel(baseMastery, true, hasLink);
                                            const xpGained = levelAfter > levelBefore ? CHAKRA_CONFIG[levelAfter].lv : 0;
                                            const todayKey = new Date().toISOString().split('T')[0];
                                            if (xpGained > 0) postXP(todayKey, xpGained, false, pid);
                                        }}
                                        onRecordingDelete={(id) => {
                                            setVoiceRecordings(prev => ({
                                                ...prev,
                                                [displayedCard.id]: (prev[displayedCard.id] || []).filter(r => r.id !== id),
                                            }));
                                        }}
                                    />
                                )}
                            </div>
                        )}
                        {showQuickAdd && displayedCard && (
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                maxWidth: isFullReview ? '400px' : 'none',
                                margin: '0 auto',
                                width: '100%',
                                marginBottom: isFullReview ? '24px' : '12px',
                            }}>
                                <input
                                    type="text"
                                    value={quickAddEnglish}
                                    onChange={e => setQuickAddEnglish(e.target.value)}
                                    placeholder="new phrase..."
                                    autoFocus
                                    onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(); }}
                                    style={{
                                        flex: 1,
                                        padding: isFullReview ? '10px 14px' : '8px 10px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: isFullReview ? '14px' : '13px',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleQuickAdd}
                                    disabled={quickAddSubmitting || !quickAddEnglish.trim()}
                                    style={{
                                        padding: isFullReview ? '10px 20px' : '8px 14px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: quickAddSubmitting || !quickAddEnglish.trim() ? '#ddd' : '#D4AF37',
                                        color: quickAddSubmitting || !quickAddEnglish.trim() ? '#999' : '#000',
                                        fontSize: isFullReview ? '13px' : '12px',
                                        fontWeight: '600',
                                        cursor: quickAddSubmitting || !quickAddEnglish.trim() ? 'not-allowed' : 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {quickAddSubmitting ? '...' : 'Save'}
                                </button>
                            </div>
                        )}

                        {/* Bottom Bar — Pokemon weakness/resistance style */}
                        {(() => {
                            const titleInfo = getTitleForLevel(playerLevel);
                            const _bm = displayedCard ? Number(phraseMastery[displayedCard.id] || 0) : 0;
                            const _hr = displayedCard ? (voiceRecordings[displayedCard.id] || []).length > 0 : false;
                            const _hl = displayedCard ? (phraseLinks[displayedCard.id] || []).length > 0 : false;
                            const _chakra = getChakraInfo(_bm, _hr, _hl);
                            return (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: isFullReview ? '8px 12px' : '6px 8px',
                                    backgroundColor: `${getFrameAccent(currentCardRank.rank)}08`,
                                    borderRadius: '0 0 8px 8px',
                                    borderTop: `1px solid ${getFrameAccent(currentCardRank.rank)}20`,
                                    position: 'relative',
                                    zIndex: 3,
                                }}>
                                    {/* Left: Chakra level badge + dots */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        minWidth: isFullReview ? '70px' : '50px',
                                    }}>
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                                <div key={i} style={{
                                                    width: isFullReview ? '5px' : '4px',
                                                    height: isFullReview ? '5px' : '4px',
                                                    borderRadius: '50%',
                                                    backgroundColor: i <= _chakra.level ? _chakra.color : '#D6D3D1',
                                                    transition: 'background-color 0.3s',
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{
                                            fontSize: isFullReview ? '9px' : '7px',
                                            fontWeight: '700',
                                            color: _chakra.color,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {_chakra.ja}
                                        </span>
                                    </div>
                                    {/* Center: CARD counter + BST */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        <span style={{
                                            fontSize: isFullReview ? '11px' : '9px',
                                            fontWeight: '600',
                                            color: historyOffset > 0 ? '#D4AF37' : '#A8A29E',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            {historyOffset > 0 ? `戻り ${historyOffset}` : `カード ${reviewIndex + 1}/${reviewList.length}`}
                                        </span>
                                        {currentPhrase && (() => {
                                            const bst = calcBstTotal(currentPhrase.id);
                                            const bt = getBstTier(bst);
                                            return (
                                                <span style={{
                                                    fontSize: isFullReview ? '10px' : '8px',
                                                    fontWeight: '800',
                                                    color: bt.color,
                                                    padding: '1px 5px',
                                                    borderRadius: '4px',
                                                    backgroundColor: bt.color + '15',
                                                }}>
                                                    {bt.tier}{bst}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    {/* Right: Prev / Next */}
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={() => {
                                                if (cardCelebration) {
                                                    // Skip celebration: advance immediately
                                                    setReviewHistory(prev => [...prev, cardCelebration.phrase]);
                                                    setHistoryOffset(0);
                                                    setCardCelebration(null);
                                                    return;
                                                }
                                                if (historyOffset < reviewHistory.length) {
                                                    setHistoryOffset(h => h + 1);
                                                } else if (reviewList.length > 0) {
                                                    setReviewIndex(i => (i - 1 + reviewList.length) % reviewList.length);
                                                }
                                            }}
                                            style={{
                                                padding: isFullReview ? '6px 14px' : '4px 10px',
                                                borderRadius: '5px',
                                                border: `1px solid ${historyOffset < reviewHistory.length ? '#D4AF37' : getFrameAccent(currentCardRank.rank)}30`,
                                                backgroundColor: historyOffset < reviewHistory.length ? '#FFFBEB' : 'transparent',
                                                fontSize: isFullReview ? '11px' : '9px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                color: historyOffset < reviewHistory.length ? '#D4AF37' : '#78716C',
                                            }}
                                        >
                                            前{reviewHistory.length > 0 ? ` (${reviewHistory.length})` : ''}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (cardCelebration) {
                                                    // Skip celebration: advance immediately
                                                    setReviewHistory(prev => [...prev, cardCelebration.phrase]);
                                                    setHistoryOffset(0);
                                                    setCardCelebration(null);
                                                    return;
                                                }
                                                if (historyOffset > 0) {
                                                    setHistoryOffset(h => h - 1);
                                                } else if (reviewList.length > 0) {
                                                    setReviewIndex(i => (i + 1) % reviewList.length);
                                                }
                                            }}
                                            style={{
                                                padding: isFullReview ? '6px 14px' : '4px 10px',
                                                borderRadius: '5px',
                                                border: 'none',
                                                backgroundColor: getFrameAccent(currentCardRank.rank),
                                                color: '#fff',
                                                fontSize: isFullReview ? '11px' : '9px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            次
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{ fontSize: '14px', color: '#888' }}>
                            復習するフレーズがありません
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                }}>
                    {[
                        { key: 'all' as const, label: 'ALL', count: thisMonthReviewPhrases.total.length, color: '#78716C', accent: '#78716C' },
                        { key: 'random' as const, label: 'SHUFFLE', count: thisMonthReviewPhrases.all.length, color: '#D4AF37', accent: '#D4AF37' },
                        ...([0, 1, 2, 3, 4, 5, 6] as const).map(k => ({
                            key: k,
                            label: `${CHAKRA_CONFIG[k].ja} ${CHAKRA_CONFIG[k].name}`,
                            count: thisMonthReviewPhrases[`level${k}` as keyof typeof thisMonthReviewPhrases].length,
                            color: CHAKRA_CONFIG[k].color,
                            accent: CHAKRA_CONFIG[k].color,
                        })),
                    ].map(tab => {
                        const isActive = reviewFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => { setReviewFilter(tab.key); setReviewIndex(0); setShuffleKey(k => k + 1); setReviewHistory([]); setHistoryOffset(0); }}
                                style={{
                                    padding: isFullReview ? '10px 8px' : '8px 6px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: isActive ? '#1C1917' : '#F5F5F4',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '2px',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{
                                    fontSize: isFullReview ? '18px' : '15px',
                                    fontWeight: '800',
                                    color: isActive ? '#fff' : tab.color,
                                    lineHeight: 1,
                                    fontVariantNumeric: 'tabular-nums',
                                }}>
                                    {tab.count}
                                </span>
                                <span style={{
                                    fontSize: '9px',
                                    fontWeight: '600',
                                    color: isActive ? '#A8A29E' : '#A8A29E',
                                    letterSpacing: '0.5px',
                                    lineHeight: 1,
                                }}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    // Cycle mastery level: 0 -> 1 -> 2 -> 3 (OWN stops), CROWN(6) -> 0 with confirm
    // Date gate: each level-up requires a different calendar day
    const cycleMastery = useCallback(async (phraseId: string, slamActive = false): Promise<boolean> => {
        const current = Number(phraseMastery[phraseId] || 0);
        if (current === 3) return false;  // OWN = terminal, no cycle back
        const next = current === 6 ? 0 : (current + 1);

        // Same-day gate: block level-ups (not resets) if already leveled today
        if (next > 0 && phraseLastLeveled[phraseId] === clientToday) return false;

        // CROWN reset requires confirmation
        if (current === 6) {
            if (!confirm('CROWN をリセットしますか?')) return false;
        }

        setPhraseMastery(prev => ({ ...prev, [phraseId]: next }));
        // Optimistic update of last-leveled date + date touch map
        if (next > 0) {
            setPhraseLastLeveled(prev => ({ ...prev, [phraseId]: clientToday }));
            const pDate = phraseDateMap[phraseId];
            if (pDate) {
                setDateTouchMap(prev => ({ ...prev, [pDate]: (prev[pDate] || 0) + 1 }));
                fetch('/api/date-touches', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phrase_date: pDate })
                }).catch(() => { });
            }
        }

        // Count level-ups (0->1, 1->2, 2->3) but not resets (3->0, 6->0)
        if (next > 0) {
            const todayKey = clientToday;
            const hasRec = (voiceRecordings[phraseId] || []).length > 0;
            const hasLink = (phraseLinks[phraseId] || []).length > 0;
            const nextLevel = getChakraLevel(next, hasRec, hasLink);
            const xpGained = CHAKRA_CONFIG[nextLevel].lv;
            postXP(todayKey, xpGained, slamActive, phraseId);
        }

        try {
            const res = await fetch('/api/phrases/mastery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phraseId, level: next, today: clientToday })
            });
            // Rollback on 409 (server rejected same-day level-up)
            if (res.status === 409) {
                setPhraseMastery(prev => ({ ...prev, [phraseId]: current }));
                return false;
            }
        } catch (err) {
            console.error('Failed to save mastery:', err);
        }

        return true;
    }, [phraseMastery, voiceRecordings, phraseLinks, phraseLastLeveled, clientToday, phraseDateMap]);

    // Declare CROWN: VISION(5) -> CROWN(6) in DB
    const declareCrown = useCallback(async (phraseId: string) => {
        // Same-day gate
        if (phraseLastLeveled[phraseId] === clientToday) return;

        if (!confirm('CROWN を宣言しますか? この言葉はもう自分の一部です。')) return;

        setPhraseMastery(prev => ({ ...prev, [phraseId]: 6 }));
        setPhraseLastLeveled(prev => ({ ...prev, [phraseId]: clientToday }));
        const pDate = phraseDateMap[phraseId];
        if (pDate) {
            setDateTouchMap(prev => ({ ...prev, [pDate]: (prev[pDate] || 0) + 1 }));
            fetch('/api/date-touches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phrase_date: pDate })
            }).catch(() => { });
        }
        playLevelSound(6);

        try {
            const res = await fetch('/api/phrases/mastery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phraseId, level: 6, today: clientToday })
            });
            if (res.status === 409) {
                setPhraseMastery(prev => ({ ...prev, [phraseId]: 5 }));
                return;
            }
            // CROWN = lv 7 XP
            postXP(clientToday, CHAKRA_CONFIG[6].lv, false, phraseId);
        } catch (err) {
            console.error('Failed to declare CROWN:', err);
        }
    }, [phraseLastLeveled, clientToday, phraseDateMap]);

    // Play phrase audio (must be synchronous to preserve user gesture for Chrome)
    const playPhrase = useCallback((phrase: Phrase) => {
        window.speechSynthesis.cancel();
        setPlayingPhraseId(phrase.id);

        const utterance = new SpeechSynthesisUtterance(phrase.english);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;

        utterance.onend = () => setPlayingPhraseId(null);
        utterance.onerror = () => setPlayingPhraseId(null);

        window.speechSynthesis.speak(utterance);
    }, [voices]);

    // Auto-play TTS when displayed card changes
    useEffect(() => {
        if (!displayedCard || cardCelebration) return;
        if (displayedCard.id === prevAutoPlayIdRef.current) return;
        prevAutoPlayIdRef.current = displayedCard.id;
        playPhrase(displayedCard);
    }, [displayedCard, cardCelebration, playPhrase]);

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    const selectedPhrasesAll = selectedDate ? (phrasesByDate[selectedDate] || []) : [];
    const selectedPhrases = selectedChakraFilter !== null
        ? selectedPhrasesAll.filter(p => {
            const m = Number(phraseMastery[p.id] || 0);
            const hasRec = (voiceRecordings[p.id] || []).length > 0;
            const hasLink = (phraseLinks[p.id] || []).length > 0;
            return getChakraLevel(m, hasRec, hasLink) === selectedChakraFilter;
        })
        : selectedPhrasesAll;




    // Calculate puzzle stats (all phrases cleared = puzzle piece complete)
    const puzzleStats = useMemo(() => {
        const daysWithPhrases = Object.keys(phrasesByDate).length;
        const masteredDays = Object.entries(phrasesByDate).filter(([_, phrases]) =>
            phrases.every(p => Number(phraseMastery[p.id] || 0) >= 3)
        ).length;
        return { total: daysWithPhrases, mastered: masteredDays };
    }, [phrasesByDate, phraseMastery]);

    // Active review card's date key + chakra level for calendar highlight
    const activeReviewDateKey = displayedCard
        ? displayedCard.date.split('T')[0]
        : null;
    const activeReviewLevel: ChakraLevel | null = displayedCard
        ? getChakraLevel(
            Number(phraseMastery[displayedCard.id] || 0),
            (voiceRecordings[displayedCard.id] || []).length > 0,
            (phraseLinks[displayedCard.id] || []).length > 0
        )
        : null;

    // --- All hooks declared above this line ---
    // Early return for SSR safety (currentMonth is null until client useEffect)
    if (!currentMonth) return null;

    // Calendar
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const rows = Math.ceil(calendarDays.length / 7);

    const prevMonth = () => { setCurrentMonth(new Date(year, month - 1, 1)); setSelectedDate(null); };
    const nextMonth = () => { setCurrentMonth(new Date(year, month + 1, 1)); setSelectedDate(null); };

    const formatDateKey = (day: number) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const today = new Date();
    const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    // Stats
    const activeCount = phrases.filter(p => {
        const level = Number(phraseMastery[p.id] || 0);
        return level >= 1 && level < 3;
    }).length;
    const ownPlusCount = phrases.filter(p => Number(phraseMastery[p.id] || 0) >= 3).length;

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`;
    const thisWeekPhrases = phrases.filter(p => {
        const dateStr = p.date.split('T')[0];
        return dateStr >= weekAgoStr && dateStr <= todayStr;
    });

    const openVocabModal = (english: string) => {
        setVocabExample(english);
        setVocabWord('');
        setVocabMeaning('');
        setVocabType('word');
        setShowVocabModal(true);
    };

    const saveToVocabulary = async () => {
        if (!vocabWord.trim() || !vocabMeaning.trim()) return;
        setVocabSaving(true);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: vocabWord.trim(),
                    type: vocabType,
                    meaning: vocabMeaning.trim(),
                    example: vocabExample,
                    source: 'Phrases',
                    date: vocabDate,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowVocabModal(false);
                setVocabWord('');
                setVocabMeaning('');
                setVocabExample('');
                alert('Saved!');
            } else {
                alert(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Failed to save vocabulary:', err);
            alert('Error saving vocabulary');
        } finally {
            setVocabSaving(false);
        }
    };

    const handleEditPhrase = async () => {
        if (!editingPhrase || !editingPhrase.english.trim()) return;
        setEditSaving(true);
        try {
            const res = await fetch(`/api/phrases/${editingPhrase.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: editingPhrase.english.trim(),
                    japanese: editingPhrase.japanese.trim(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                const updatedEnglish = editingPhrase.english.trim();
                const updatedJapanese = editingPhrase.japanese.trim();
                setPhrases(prev => prev.map(p =>
                    p.id === editingPhrase.id
                        ? { ...p, english: updatedEnglish, japanese: updatedJapanese }
                        : p
                ));
                // Also update cached review list so review card reflects the edit
                if (reviewListCacheRef.current.list) {
                    reviewListCacheRef.current.list = reviewListCacheRef.current.list.map(p =>
                        p.id === editingPhrase.id
                            ? { ...p, english: updatedEnglish, japanese: updatedJapanese }
                            : p
                    );
                }
                setEditingPhrase(null);
            } else {
                alert(data.error || 'Failed to update');
            }
        } catch (error) {
            console.error('Error updating phrase:', error);
            alert('Error updating phrase');
        } finally {
            setEditSaving(false);
        }
    };

    const handleDeletePhrase = async (id: string) => {
        if (!confirm('Delete this phrase?')) return;
        try {
            const res = await fetch(`/api/phrases/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setPhrases(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting phrase:', error);
        }
    };

    const handleAddPhrase = async () => {
        if (isSubmitting) return;
        if (!newPhrase.english.trim() || !newPhrase.japanese.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: newPhrase.english.trim(),
                    japanese: newPhrase.japanese.trim(),
                    category: newPhrase.category,
                    date: formDate,
                }),
            });
            const data = await res.json();
            if (data.success) {
                if (!data.duplicate) {
                    setPhrases(prev => [...prev, data.phrase]);
                }
                setNewPhrase({ english: '', japanese: '', category: randomElement() });
                setShowAddForm(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickAdd = async () => {
        const phraseId = displayedCard?.id;
        if (!quickAddEnglish.trim() || !phraseId) return;
        setQuickAddSubmitting(true);
        try {
            const prevLinks = phraseLinks[phraseId] || [];
            const wasFirst = prevLinks.length === 0;
            const res = await fetch('/api/phrases/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phrase_id: phraseId, text: quickAddEnglish.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setPhraseLinks(prev => ({
                    ...prev,
                    [phraseId]: [...(prev[phraseId] || []), data.link],
                }));
                setQuickAddEnglish('');
                setQuickAddedCount(c => c + 1);
                // XP: first link = VISION level-up
                if (wasFirst) {
                    const baseMastery = Number(phraseMastery[phraseId] || 0);
                    const hasRec = (voiceRecordings[phraseId] || []).length > 0;
                    const levelBefore = getChakraLevel(baseMastery, hasRec, false);
                    const levelAfter = getChakraLevel(baseMastery, hasRec, true);
                    if (levelAfter > levelBefore) {
                        postXP(new Date().toISOString().split('T')[0], CHAKRA_CONFIG[levelAfter].lv, false, phraseId);
                    }
                }
            }
        } finally {
            setQuickAddSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100%', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#f5f5f5',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Keyframes loaded from training-animations.css */}


            {/* Chain mode pulsing background overlay */}
            {feverMode.active && viewMode === 'review' && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: chainState.mode === 'god'
                        ? 'linear-gradient(135deg, #7C3AED 0%, #EC4899 33%, #D4AF37 66%, #7C3AED 100%)'
                        : chainState.mode === 'gekiatsu'
                        ? 'linear-gradient(135deg, #DC2626 0%, #F97316 50%, #DC2626 100%)'
                        : 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 50%, #D4AF37 100%)',
                    backgroundSize: '200% 200%',
                    animation: `fever-pulse ${chainState.mode === 'god' ? '0.8' : chainState.mode === 'gekiatsu' ? '1.2' : '1.5'}s ease-in-out infinite, card-holo-shimmer 3s ease-in-out infinite`,
                    pointerEvents: 'none', zIndex: 50,
                }} />
            )}

            {/* FEVER edge glow — pulsing inset shadow on all four edges */}
            {feverMode.active && viewMode === 'review' && (
                <div style={{
                    position: 'fixed', inset: 0,
                    animation: 'fever-border-glow 1.5s ease-in-out infinite',
                    pointerEvents: 'none', zIndex: 51,
                    borderRadius: 0,
                }} />
            )}

            {/* Chain mode floating particles */}
            {feverMode.active && viewMode === 'review' && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 52, overflow: 'hidden' }}>
                    {Array.from({ length: chainState.mode === 'god' ? 30 : chainState.mode === 'gekiatsu' ? 24 : 18 }).map((_, i) => {
                        const colors = chainState.mode === 'god'
                            ? ['#7C3AED', '#EC4899', '#D4AF37', '#06B6D4', '#A855F7']
                            : chainState.mode === 'gekiatsu'
                            ? ['#DC2626', '#F97316', '#FBBF24', '#EF4444', '#F59E0B']
                            : ['#D4AF37', '#F59E0B', '#FBBF24', '#EAB308', '#D4AF37'];
                        const size = 3 + (i % 4) * 2;
                        const left = 5 + (i * 5.3) % 90;
                        const dur = 3 + (i % 5) * 0.5;
                        const delay = (i * 0.4) % 3;
                        const drift = (i % 2 === 0 ? 1 : -1) * (10 + (i % 6) * 5);
                        return (
                            <div key={i} style={{
                                position: 'absolute',
                                bottom: '-10px',
                                left: `${left}%`,
                                width: `${size}px`,
                                height: `${size}px`,
                                borderRadius: '50%',
                                backgroundColor: colors[i % colors.length],
                                boxShadow: `0 0 ${size * 2}px ${colors[i % colors.length]}80`,
                                // @ts-ignore
                                '--px-drift': `${drift}px`,
                                animation: `fever-particle-rise ${dur}s ease-out infinite`,
                                animationDelay: `${delay}s`,
                                willChange: 'transform',
                            } as React.CSSProperties} />
                        );
                    })}
                </div>
            )}

            {/* Chain mode badge + counter (fixed top-center) */}
            {feverMode.active && viewMode === 'review' && (
                <div style={{
                    position: 'fixed',
                    top: isMobile ? '8px' : '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 9998,
                    pointerEvents: 'none',
                    animation: chainState.mode === 'god' ? 'fever-badge-pulse 0.8s ease-in-out infinite' : 'fever-badge-pulse 1.5s ease-in-out infinite',
                }}>
                    <div style={{
                        background: CHAIN_MODE_CONFIG[chainState.mode].gradient,
                        color: '#fff',
                        padding: isMobile ? '8px 20px' : '10px 32px',
                        borderRadius: '24px',
                        fontWeight: '900',
                        fontSize: isMobile ? '18px' : '24px',
                        letterSpacing: '4px',
                        boxShadow: chainState.mode === 'god'
                            ? '0 0 30px rgba(124,58,237,0.6), 0 0 60px rgba(236,72,153,0.3), 0 0 90px rgba(212,175,55,0.2)'
                            : `0 0 30px ${CHAIN_MODE_CONFIG[chainState.mode].color}99, 0 0 60px ${CHAIN_MODE_CONFIG[chainState.mode].color}44`,
                        textShadow: '0 0 10px rgba(255,255,255,0.6)',
                    }}>
                        {CHAIN_MODE_CONFIG[chainState.mode].labelJa}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {chainState.count > 0 && (
                            <div key={chainState.key} style={{
                                background: 'rgba(0,0,0,0.8)',
                                color: chainState.mode === 'god' ? '#C084FC' : chainState.mode === 'gekiatsu' ? '#FCD34D' : '#F97316',
                                padding: isMobile ? '5px 12px' : '7px 16px',
                                borderRadius: '14px',
                                fontWeight: '900',
                                fontSize: isMobile ? '15px' : '20px',
                                letterSpacing: '1px',
                                animation: `fever-chain-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)${chainState.count >= 8 ? ', chain-counter-shake 0.3s ease-in-out infinite' : ''}`,
                                textShadow: chainState.mode === 'god' ? '0 0 8px #C084FC80' : chainState.count >= 5 ? '0 0 8px #FCD34D80' : 'none',
                            }}>
                                x{chainState.count} CHAIN
                            </div>
                        )}
                        <div style={{
                            background: 'rgba(0,0,0,0.6)',
                            color: '#FCD34D',
                            padding: isMobile ? '4px 8px' : '5px 10px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: isMobile ? '10px' : '12px',
                            letterSpacing: '0.5px',
                        }}>
                            SP {CHAIN_MODE_CONFIG[chainState.mode].spMultiplier}
                        </div>
                    </div>
                </div>
            )}

            {/* Chain mode transition banner (確変突入! 激熱突入! 神降臨!) */}
            {chainTransition && (
                <div key={chainTransition.key} style={{
                    position: 'fixed', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10001, pointerEvents: 'none',
                }}>
                    <div style={{
                        background: CHAIN_MODE_CONFIG[chainTransition.to].gradient,
                        color: '#fff',
                        padding: isMobile ? '16px 40px' : '24px 64px',
                        borderRadius: '16px',
                        fontWeight: '900',
                        fontSize: isMobile ? '32px' : '48px',
                        letterSpacing: '8px',
                        textShadow: '0 0 20px rgba(255,255,255,0.8)',
                        boxShadow: `0 0 60px ${CHAIN_MODE_CONFIG[chainTransition.to].color}AA`,
                        animation: 'fever-entry-slam 1s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        {chainTransition.to === 'kakuhen' ? '確変突入!' : chainTransition.to === 'gekiatsu' ? '激熱突入!' : '神 降 臨 !'}
                    </div>
                </div>
            )}

            {/* SP Milestone celebration */}
            {milestoneEffect && (
                <div key={milestoneEffect.key} style={{
                    position: 'fixed', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                    zIndex: 10002, pointerEvents: 'none',
                    animation: milestoneEffect.amount >= 500 ? 'gacha-legendary-flash 0.5s ease-out' : undefined,
                }}>
                    <div style={{
                        color: '#D4AF37',
                        fontWeight: '900',
                        fontSize: milestoneEffect.amount >= 1000 ? (isMobile ? '48px' : '72px') : milestoneEffect.amount >= 100 ? (isMobile ? '36px' : '56px') : (isMobile ? '28px' : '40px'),
                        textShadow: '0 0 30px #D4AF3780, 0 0 60px #D4AF3740',
                        animation: 'gacha-reveal 1s cubic-bezier(0.34,1.56,0.64,1)',
                        letterSpacing: '4px',
                    }}>
                        {milestoneEffect.amount >= 1000 ? `${milestoneEffect.amount} SP` : `+${milestoneEffect.amount} SP`}
                    </div>
                    {milestoneEffect.amount >= 500 && (
                        <div style={{
                            color: '#F59E0B',
                            fontWeight: '700',
                            fontSize: isMobile ? '16px' : '22px',
                            marginTop: '12px',
                            letterSpacing: '2px',
                            animation: 'gacha-reveal 1.2s cubic-bezier(0.34,1.56,0.64,1)',
                        }}>
                            MILESTONE REACHED
                        </div>
                    )}
                </div>
            )}

            {/* FEVER flash (enter = red, exit = blue) */}
            {feverFlash && (
                <div key={feverFlash} style={{
                    position: 'fixed', inset: 0,
                    background: feverFlash === 'enter'
                        ? 'radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(220,38,38,0.4) 50%, transparent 100%)'
                        : 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(30,58,138,0.3) 50%, transparent 100%)',
                    pointerEvents: 'none', zIndex: 10000,
                    animation: feverFlash === 'enter'
                        ? 'fever-flash-enter 0.8s ease-out forwards'
                        : 'fever-flash-exit 1.2s ease-out forwards',
                }} />
            )}

            {/* FEVER entry slam — "FEVER" text slams in + shockwave + screen shake */}
            {feverEntryEffect && (
                <div style={{
                    position: 'fixed', inset: 0,
                    pointerEvents: 'none', zIndex: 10001,
                    animation: 'fever-entry-shake 0.5s ease-out',
                }}>
                    {/* Shockwave ring */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: isMobile ? '80px' : '120px',
                        height: isMobile ? '80px' : '120px',
                        borderRadius: '50%',
                        border: '3px solid rgba(249,115,22,0.6)',
                        background: 'radial-gradient(circle, rgba(220,38,38,0.15), transparent 70%)',
                        animation: 'fever-shockwave 0.8s ease-out forwards',
                    }} />
                    {/* FEVER slam text */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        fontSize: isMobile ? '48px' : '72px',
                        fontWeight: '900',
                        letterSpacing: '8px',
                        background: 'linear-gradient(180deg, #FF4444 0%, #FF8800 50%, #FF4444 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 30px rgba(255,68,68,0.6), 0 0 60px rgba(255,136,0,0.3), 0 4px 12px rgba(0,0,0,0.5)',
                        animation: 'fever-entry-slam 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        whiteSpace: 'nowrap',
                    }}>
                        確変
                    </div>
                </div>
            )}

            {/* FEVER exit — "確変終了" + chain count */}
            {feverExitEffect && (
                <div style={{
                    position: 'fixed', inset: 0,
                    pointerEvents: 'none', zIndex: 10001,
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        animation: 'fever-exit-text 1.5s ease-out forwards',
                    }}>
                        <div style={{
                            fontSize: isMobile ? '36px' : '54px',
                            fontWeight: '900',
                            letterSpacing: '6px',
                            background: 'linear-gradient(180deg, #DC2626 0%, #3B82F6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 20px rgba(59,130,246,0.4), 0 4px 12px rgba(0,0,0,0.4)',
                            whiteSpace: 'nowrap',
                        }}>
                            確変終了
                        </div>
                        {feverExitEffect.streak > 0 && (
                            <div style={{
                                fontSize: isMobile ? '18px' : '24px',
                                fontWeight: '800',
                                color: '#94A3B8',
                                letterSpacing: '2px',
                                textShadow: '0 0 10px rgba(148,163,184,0.3)',
                            }}>
                                x{feverExitEffect.streak} 連鎖
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Card Rank-Up Banner */}
            {cardRankUpEffect && (
                <div key={cardRankUpEffect.key} style={{
                    position: 'fixed', inset: 0,
                    pointerEvents: 'none', zIndex: 10002,
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                        animation: 'rankup-banner 3s ease-out forwards',
                    }}>
                        <div style={{
                            fontSize: isMobile ? '32px' : '48px',
                            fontWeight: '900',
                            letterSpacing: '4px',
                            color: cardRankUpEffect.newRankColor,
                            textShadow: `0 0 30px ${cardRankUpEffect.newRankColor}80, 0 0 60px ${cardRankUpEffect.newRankColor}40, 0 4px 12px rgba(0,0,0,0.4)`,
                            whiteSpace: 'nowrap',
                        }}>
                            ランクアップ!
                        </div>
                        <div style={{
                            fontSize: isMobile ? '16px' : '22px',
                            fontWeight: '800',
                            letterSpacing: '3px',
                            color: '#E7E5E4',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        }}>
                            <span style={{ opacity: 0.6 }}>{cardRankUpEffect.oldRank}</span>
                            <span style={{ color: '#F97316', fontSize: isMobile ? '20px' : '28px' }}>→</span>
                            <span style={{ color: cardRankUpEffect.newRankColor, textShadow: `0 0 15px ${cardRankUpEffect.newRankColor}60` }}>
                                {cardRankUpEffect.newRank}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Point Effect Overlay */}
            {pointEffect && (
                <div key={pointEffect.key} style={{
                    position: 'fixed', inset: 0,
                    pointerEvents: 'none', zIndex: 9999,
                    animation: 'pe-shake 0.8s ease-out forwards',
                }}>
                    {/* Impact ring */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: isMobile ? '160px' : '240px', height: isMobile ? '160px' : '240px',
                        marginLeft: isMobile ? '-80px' : '-120px', marginTop: isMobile ? '-80px' : '-120px',
                        borderRadius: '50%',
                        border: `2px solid ${pointEffect.gradFrom}`,
                        animation: 'pe-impact 1s ease-out forwards',
                    }} />

                    {/* Crack lines */}
                    {[
                        { x: '50%', right: false, rotate: -12, w: isMobile ? '38vw' : '22vw', delay: 0 },
                        { x: '50%', right: false, rotate: 20, w: isMobile ? '30vw' : '18vw', delay: 30 },
                        { x: '50%', right: true, rotate: 8, w: isMobile ? '32vw' : '20vw', delay: 50 },
                    ].map((c, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: '50%',
                            ...(c.right ? { right: c.x } : { left: c.x }),
                            width: c.w, height: '1px',
                            background: `linear-gradient(${c.right ? 270 : 90}deg, ${i === 1 ? pointEffect.gradTo : pointEffect.gradFrom}80, transparent)`,
                            transformOrigin: c.right ? '100% 50%' : '0 50%',
                            transform: `rotate(${c.rotate}deg) scaleX(0)`,
                            animation: `pe-crack 1.3s ease-out ${c.delay}ms forwards`,
                        }} />
                    ))}

                    {/* Number + label */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column',
                    }}>
                        <div style={{
                            fontSize: isMobile ? '80px' : '110px',
                            fontWeight: '900',
                            lineHeight: 1,
                            letterSpacing: '-5px',
                            color: pointEffect.color,
                            textShadow: `0 2px 24px ${pointEffect.gradFrom}50, 0 0 60px ${pointEffect.gradFrom}20`,
                            animation: 'pe-slam 1.6s cubic-bezier(0.22, 0.8, 0.36, 1) forwards',
                        }}>
                            +{pointEffect.points}
                        </div>
                        <div style={{
                            fontSize: isMobile ? '10px' : '13px',
                            fontWeight: '700',
                            color: pointEffect.color,
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            marginTop: '6px',
                            animation: 'pe-name 1.6s ease-out 0.25s both',
                        }}>
                            {pointEffect.levelName}
                        </div>
                    </div>
                </div>
            )}

            {/* Level-Up Overlay */}
            {levelUpEffect && (
                <div key={levelUpEffect.key} style={{
                    position: 'fixed', inset: 0,
                    pointerEvents: 'none', zIndex: 10000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {/* Background flash */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `radial-gradient(circle, ${levelUpEffect.color}18, transparent 70%)`,
                        animation: 'lvup-shine 3s ease-out forwards',
                    }} />
                    {/* Expanding ring */}
                    <div style={{
                        position: 'absolute',
                        width: isMobile ? '120px' : '180px',
                        height: isMobile ? '120px' : '180px',
                        borderRadius: '50%',
                        border: `2px solid ${levelUpEffect.color}60`,
                        animation: 'lvup-ring 1.5s ease-out forwards',
                    }} />
                    {/* Level text */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        animation: 'lvup-burst 2.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                    }}>
                        <div style={{
                            fontSize: isMobile ? '12px' : '15px',
                            fontWeight: '700',
                            color: levelUpEffect.color,
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            marginBottom: '4px',
                        }}>
                            レベルアップ
                        </div>
                        <div style={{
                            fontSize: isMobile ? '56px' : '80px',
                            fontWeight: '900',
                            lineHeight: 1,
                            letterSpacing: '-3px',
                            color: levelUpEffect.color,
                            textShadow: `0 2px 30px ${levelUpEffect.color}40`,
                        }}>
                            {levelUpEffect.level}
                        </div>
                        <div style={{
                            fontSize: isMobile ? '16px' : '20px',
                            fontWeight: '700',
                            color: levelUpEffect.color,
                            marginTop: '8px',
                            letterSpacing: '2px',
                        }}>
                            {levelUpEffect.title}
                        </div>
                    </div>
                </div>
            )}

            {/* Gacha Overlay — Nintendo-level */}
            {gachaEffect && (() => {
                const cfg = GACHA_TIER_CONFIG[gachaEffect.tier] || GACHA_TIER_CONFIG.MISS;
                const isReveal = gachaEffect.phase === 'reveal';
                const tier = gachaEffect.tier;
                const particleCount = isMobile ? Math.ceil(cfg.particles * 0.6) : cfg.particles;
                const fs = isMobile ? cfg.mobileFontSize : cfg.fontSize;
                const isUltraRare = tier === 'MYTHIC' || tier === 'SHINY' || tier === 'PHANTOM';
                const isBig = tier === 'SUPER' || tier === 'MEGA' || tier === 'LEGENDARY' || isUltraRare;
                const isEpic = tier === 'MEGA' || tier === 'LEGENDARY' || isUltraRare;

                return (
                    <div key={gachaEffect.key} style={{
                        position: 'fixed', inset: 0,
                        pointerEvents: 'none', zIndex: 9998,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ...(isReveal && (tier === 'GREAT' || tier === 'SUPER')
                            ? { animation: 'gacha-shake 0.6s ease-out' } : {}),
                        ...(isReveal && isEpic
                            ? { animation: 'gacha-shake 0.8s ease-out' } : {}),
                    }}>
                        {/* Screen darken for BONUS+ */}
                        {isReveal && tier !== 'MISS' && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundColor: tier === 'PHANTOM' ? '#fff' : '#000',
                                opacity: tier === 'PHANTOM' ? 0.8 : isUltraRare ? 0.7 : tier === 'LEGENDARY' ? 0.6 : tier === 'MEGA' ? 0.5 : tier === 'SUPER' ? 0.35 : 0.2,
                                transition: 'opacity 0.3s',
                            }} />
                        )}

                        {/* LEGENDARY+: white flash x2 */}
                        {isReveal && (tier === 'LEGENDARY' || tier === 'MYTHIC') && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundColor: tier === 'MYTHIC' ? '#EC489940' : '#fffbe6',
                                animation: 'gacha-legendary-flash 2s ease-out forwards',
                            }} />
                        )}

                        {/* MYTHIC: pink hearts rain */}
                        {isReveal && tier === 'MYTHIC' && (
                            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        left: `${5 + (i * 4.7) % 90}%`,
                                        bottom: '-20px',
                                        fontSize: `${14 + (i % 5) * 4}px`,
                                        color: ['#EC4899', '#F472B6', '#FB7185', '#FDA4AF'][i % 4],
                                        animation: `gacha-mythic-hearts ${2 + (i % 3) * 0.5}s ease-out infinite`,
                                        animationDelay: `${(i * 0.3) % 2}s`,
                                        textShadow: '0 0 8px #EC489960',
                                    }}>*</div>
                                ))}
                            </div>
                        )}

                        {/* SHINY: prismatic color-shifting screen */}
                        {isReveal && tier === 'SHINY' && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(135deg, #ff000020, #ff880020, #ffff0020, #00ff0020, #0088ff20, #8800ff20, #ff00ff20)',
                                animation: 'gacha-shiny-prismatic 2s linear infinite',
                            }} />
                        )}

                        {/* PHANTOM: whiteout + reverse colors effect */}
                        {isReveal && tier === 'PHANTOM' && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundColor: '#fff',
                                animation: 'gacha-phantom-whiteout 3s ease-out forwards',
                            }} />
                        )}

                        {/* EPIC: radial light rays */}
                        {isReveal && isEpic && (
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                width: isMobile ? '300px' : '500px',
                                height: isMobile ? '300px' : '500px',
                                background: `conic-gradient(from 0deg, ${cfg.color}00, ${cfg.color}30, ${cfg.color}00, ${cfg.color}30, ${cfg.color}00, ${cfg.color}30, ${cfg.color}00, ${cfg.color}30, ${cfg.color}00, ${cfg.color}30, ${cfg.color}00, ${cfg.color}30, ${cfg.color}00)`,
                                borderRadius: '50%',
                                animation: `gacha-rays ${tier === 'LEGENDARY' ? '4' : '6'}s linear infinite`,
                            }} />
                        )}

                        {/* MEGA/LEGENDARY: color wash background */}
                        {isReveal && isEpic && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: tier === 'LEGENDARY'
                                    ? 'radial-gradient(ellipse at center, #D4AF3730 0%, #B8860B15 40%, transparent 70%)'
                                    : 'radial-gradient(ellipse at center, #8B5CF630 0%, #6D28D915 40%, transparent 70%)',
                                animation: 'gacha-rainbow 3s linear infinite',
                            }} />
                        )}

                        {/* Explosion rings — multiple, staggered */}
                        {isReveal && isBig && (
                            <>
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    width: isMobile ? '80px' : '120px',
                                    height: isMobile ? '80px' : '120px',
                                    marginLeft: isMobile ? '-40px' : '-60px',
                                    marginTop: isMobile ? '-40px' : '-60px',
                                    borderRadius: '50%',
                                    border: `3px solid ${cfg.color}80`,
                                    animation: 'gacha-explosion 1.2s ease-out forwards',
                                }} />
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    width: isMobile ? '80px' : '120px',
                                    height: isMobile ? '80px' : '120px',
                                    marginLeft: isMobile ? '-40px' : '-60px',
                                    marginTop: isMobile ? '-40px' : '-60px',
                                    borderRadius: '50%',
                                    border: `2px solid ${cfg.color}50`,
                                    animation: 'gacha-explosion-2 1.8s 0.15s ease-out forwards',
                                }} />
                                {isEpic && (
                                    <div style={{
                                        position: 'absolute', top: '50%', left: '50%',
                                        width: isMobile ? '60px' : '90px',
                                        height: isMobile ? '60px' : '90px',
                                        marginLeft: isMobile ? '-30px' : '-45px',
                                        marginTop: isMobile ? '-30px' : '-45px',
                                        borderRadius: '50%',
                                        border: `4px solid ${cfg.color}90`,
                                        animation: 'gacha-explosion 2s 0.3s ease-out forwards',
                                    }} />
                                )}
                            </>
                        )}

                        {/* BONUS+: pulse ring behind text */}
                        {isReveal && tier !== 'MISS' && (
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%,-50%)',
                                width: isMobile ? '120px' : '180px',
                                height: isMobile ? '120px' : '180px',
                                borderRadius: '50%',
                                border: `2px solid ${cfg.color}40`,
                                animation: 'gacha-pulse-ring 1.5s ease-in-out infinite',
                            }} />
                        )}

                        {/* Reel phase: 3-reel slot machine */}
                        {!isReveal && slotReels && (() => {
                            const cellW = isMobile ? 68 : 96;
                            const cellH = isMobile ? 60 : 82;
                            const reelGap = isMobile ? 4 : 6;
                            const allStopped = slotReels.stopped[0] && slotReels.stopped[1] && slotReels.stopped[2];
                            const matchColor = allStopped && tier !== 'MISS' ? cfg.color : '#D4AF37';
                            const isUltraTier = tier === 'MYTHIC' || tier === 'SHINY' || tier === 'PHANTOM';
                            // Ultra-rare frame color override when stopped
                            const frameGlow = allStopped && isUltraTier
                                ? tier === 'PHANTOM' ? '#E2E8F0' : tier === 'SHINY' ? '#06B6D4' : '#EC4899'
                                : matchColor;

                            const renderSymbol = (symId: SlotSymbolId, row: 'above' | 'center' | 'below', reelIdx: number) => {
                                const sym = SLOT_SYMBOL_MAP[symId];
                                if (!sym) return null;
                                const isCenter = row === 'center';
                                const isStopped = slotReels.stopped[reelIdx];
                                const is7 = sym.label === '7';
                                const isKanji = ['鈴', '星', '桜', '神', '虹', '幻'].includes(sym.label);
                                const isUltraSym = !!sym.ultra;
                                return (
                                    <div style={{
                                        width: cellW,
                                        height: cellH,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: `${cellH * sym.scale * (isCenter ? 0.7 : 0.48)}px`,
                                        fontWeight: '900',
                                        fontStyle: is7 ? 'italic' : 'normal',
                                        color: !isCenter ? `${sym.color}40` : sym.color,
                                        textShadow: isCenter && isStopped
                                            ? isUltraSym
                                                ? `0 0 20px ${sym.glow}, 0 0 40px ${sym.glow}, 0 0 60px ${sym.glow}, 0 2px 0 ${sym.stroke || sym.color}`
                                                : is7
                                                    ? `0 2px 0 ${sym.stroke || sym.color}, 0 0 20px ${sym.glow}, 0 0 40px ${sym.glow}`
                                                    : `0 1px 0 ${sym.stroke || sym.color}, 0 0 12px ${sym.glow}`
                                            : !isCenter ? 'none' : `0 1px 0 ${(sym.stroke || sym.color)}40`,
                                        letterSpacing: sym.label === 'BAR' ? '3px' : is7 ? '-2px' : '0',
                                        transition: isStopped ? 'all 0.15s ease-out' : 'none',
                                        animation: isCenter && isStopped
                                            ? isUltraSym
                                                ? 'reel-symbol-flash 0.2s ease-out, ultra-symbol-pulse 1s ease-in-out infinite 0.2s'
                                                : 'reel-symbol-flash 0.2s ease-out'
                                            : undefined,
                                        fontFamily: is7 ? 'Georgia, "Times New Roman", serif'
                                            : isKanji ? '"Hiragino Kaku Gothic Pro", "Yu Gothic", "Meiryo", sans-serif'
                                            : '"Arial Black", "Helvetica Neue", sans-serif',
                                        userSelect: 'none' as const,
                                        WebkitTextStroke: isCenter && is7 ? `1px ${sym.stroke || sym.color}` : undefined,
                                    }}>
                                        {sym.label}
                                    </div>
                                );
                            };

                            return (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: '10px',
                                    animation: 'slot-machine-enter 0.3s ease-out forwards',
                                }}>
                                    {/* Light vignette — no dark overlay */}
                                    <div style={{
                                        position: 'fixed', inset: 0,
                                        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)',
                                        pointerEvents: 'none',
                                    }} />

                                    {/* SLOT label */}
                                    <div style={{
                                        position: 'relative', zIndex: 2,
                                        fontSize: isMobile ? '12px' : '14px',
                                        fontWeight: '900',
                                        background: 'linear-gradient(180deg, #FFF2A8 0%, #D4AF37 50%, #B8941E 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '8px',
                                        marginBottom: '-2px',
                                        textShadow: 'none',
                                        filter: 'drop-shadow(0 1px 2px rgba(184,148,30,0.5))',
                                    }}>
                                        SLOT
                                    </div>

                                    {/* Slot machine body — pachinko gold frame */}
                                    <div style={{
                                        position: 'relative',
                                        background: 'linear-gradient(160deg, #F6E27A 0%, #D4AF37 20%, #B8941E 40%, #D4AF37 60%, #F6E27A 80%, #D4AF37 100%)',
                                        borderRadius: isMobile ? '18px' : '24px',
                                        border: slotReels.reach
                                            ? '3px solid #EF4444'
                                            : '2px solid #8B6914',
                                        boxShadow: slotReels.reach
                                            ? '0 0 40px #EF444450, 0 0 80px #EF444425, inset 0 2px 4px rgba(255,255,255,0.4)'
                                            : allStopped && isUltraTier
                                                ? `0 8px 32px rgba(0,0,0,0.3), 0 0 50px ${frameGlow}60, 0 0 100px ${frameGlow}30, inset 0 2px 4px rgba(255,242,168,0.6)`
                                                : `0 8px 32px rgba(0,0,0,0.3), 0 0 40px ${matchColor}30, inset 0 2px 4px rgba(255,242,168,0.6)`,
                                        padding: isMobile ? '14px 12px' : '18px 16px',
                                        animation: slotReels.reach ? 'reach-border-pulse 0.6s ease-in-out infinite' : undefined,
                                        overflow: 'hidden',
                                    }}>
                                        {/* Metallic sheen overlay */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
                                            pointerEvents: 'none',
                                            borderRadius: 'inherit',
                                        }} />

                                        {/* Reel window — inner recessed panel */}
                                        <div style={{
                                            background: 'linear-gradient(180deg, #8B6914 0%, #A07A1E 2%, #F5EDD6 4%, #FFFEF8 10%, #FFFEF8 90%, #F5EDD6 96%, #A07A1E 98%, #8B6914 100%)',
                                            borderRadius: isMobile ? '10px' : '14px',
                                            padding: isMobile ? '4px' : '6px',
                                            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.15), inset 0 -2px 6px rgba(0,0,0,0.1)',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}>
                                        {/* 3 reels side by side */}
                                        <div style={{
                                            display: 'flex',
                                            gap: `${reelGap}px`,
                                            position: 'relative',
                                        }}>
                                            {[0, 1, 2].map(reelIdx => {
                                                const isStopped = slotReels.stopped[reelIdx];
                                                return (
                                                    <div key={reelIdx} style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: 'linear-gradient(180deg, #FFFEF5 0%, #FFFFFF 20%, #FFFFFF 80%, #F5F0E0 100%)',
                                                        borderRadius: isMobile ? '8px' : '10px',
                                                        overflow: 'hidden',
                                                        border: '1px solid #C9A93E',
                                                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08), inset 0 -2px 8px rgba(0,0,0,0.05)',
                                                        animation: isStopped ? 'reel-bounce 0.25s ease-out' : undefined,
                                                    }}>
                                                        {/* Above row */}
                                                        <div style={{ borderBottom: '1px solid #E8DFC0', opacity: 0.5 }}>
                                                            {renderSymbol(slotReels.above[reelIdx], 'above', reelIdx)}
                                                        </div>
                                                        {/* Center row (payline) */}
                                                        <div style={{
                                                            background: isStopped
                                                                ? 'linear-gradient(180deg, transparent, #FFF8E108, transparent)'
                                                                : 'transparent',
                                                        }}>
                                                            {renderSymbol(slotReels.symbols[reelIdx], 'center', reelIdx)}
                                                        </div>
                                                        {/* Below row */}
                                                        <div style={{ borderTop: '1px solid #E8DFC0', opacity: 0.5 }}>
                                                            {renderSymbol(slotReels.below[reelIdx], 'below', reelIdx)}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Payline indicator — left/right arrows + horizontal line */}
                                            <div style={{
                                                position: 'absolute',
                                                top: `${cellH + cellH / 2 - 1}px`,
                                                left: '-6px',
                                                right: '-6px',
                                                height: '3px',
                                                background: allStopped && tier !== 'MISS'
                                                    ? `linear-gradient(90deg, ${matchColor}, ${matchColor}CC, ${matchColor})`
                                                    : slotReels.reach
                                                        ? 'linear-gradient(90deg, #EF4444, #EF444480, #EF4444)'
                                                        : 'linear-gradient(90deg, #D4AF37, #D4AF3750, #D4AF37)',
                                                borderRadius: '2px',
                                                pointerEvents: 'none',
                                                boxShadow: allStopped && tier !== 'MISS'
                                                    ? `0 0 8px ${matchColor}80`
                                                    : slotReels.reach ? '0 0 8px #EF444460' : '0 0 4px #D4AF3740',
                                                animation: allStopped && tier !== 'MISS' ? 'payline-flash 0.8s ease-in-out infinite' : undefined,
                                            }} />
                                            {/* Left payline arrow */}
                                            <div style={{
                                                position: 'absolute',
                                                top: `${cellH + cellH / 2 - 6}px`,
                                                left: '-10px',
                                                width: 0, height: 0,
                                                borderTop: '6px solid transparent',
                                                borderBottom: '6px solid transparent',
                                                borderLeft: `8px solid ${slotReels.reach ? '#EF4444' : '#D4AF37'}`,
                                                pointerEvents: 'none',
                                            }} />
                                            {/* Right payline arrow */}
                                            <div style={{
                                                position: 'absolute',
                                                top: `${cellH + cellH / 2 - 6}px`,
                                                right: '-10px',
                                                width: 0, height: 0,
                                                borderTop: '6px solid transparent',
                                                borderBottom: '6px solid transparent',
                                                borderRight: `8px solid ${slotReels.reach ? '#EF4444' : '#D4AF37'}`,
                                                pointerEvents: 'none',
                                            }} />
                                        </div>
                                        </div>{/* close reel window */}
                                    </div>

                                    {/* REACH label */}
                                    {slotReels.reach && !allStopped && (
                                        <div style={{
                                            position: 'relative', zIndex: 2,
                                            fontSize: isMobile ? '22px' : '30px',
                                            fontWeight: '900',
                                            color: '#FFFFFF',
                                            letterSpacing: '10px',
                                            textShadow: '0 0 20px #EF4444, 0 0 40px #EF4444, 0 0 80px #EF444480, 0 2px 0 #DC2626',
                                            animation: 'reach-text-flash 0.5s ease-out forwards',
                                            fontFamily: '"Arial Black", sans-serif',
                                        }}>
                                            REACH
                                        </div>
                                    )}

                                    {/* Bottom glow bar */}
                                    <div style={{
                                        position: 'relative', zIndex: 2,
                                        width: isMobile ? '140px' : '200px',
                                        height: '4px',
                                        borderRadius: '999px',
                                        background: slotReels.reach
                                            ? 'linear-gradient(90deg, transparent, #EF4444, #FF6B6B, #EF4444, transparent)'
                                            : `linear-gradient(90deg, transparent, #F6E27A, ${matchColor}, #F6E27A, transparent)`,
                                        boxShadow: slotReels.reach
                                            ? '0 0 12px #EF444460'
                                            : `0 0 12px ${matchColor}40`,
                                        animation: 'xp-bar-pulse 0.5s ease-in-out infinite',
                                    }} />
                                </div>
                            );
                        })()}

                        {/* Reveal phase: tier result */}
                        {isReveal && (
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                animation: `gacha-reveal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, gacha-fade-out ${cfg.duration / 1000}s ease-out forwards`,
                            }}>
                                {/* SP number */}
                                <div style={{
                                    fontSize: `${fs * (tier === 'LEGENDARY' ? 1.4 : tier === 'MEGA' ? 1.2 : 1)}px`,
                                    fontWeight: '900',
                                    lineHeight: 1,
                                    letterSpacing: tier === 'LEGENDARY' ? '-6px' : '-3px',
                                    ...(isEpic ? {
                                        background: tier === 'LEGENDARY'
                                            ? 'linear-gradient(180deg, #FFFDE0 0%, #F6C85F 25%, #D4AF37 55%, #B8860B 85%, #8B6914 100%)'
                                            : 'linear-gradient(180deg, #E0D4FF 0%, #A78BFA 25%, #8B5CF6 55%, #6D28D9 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: `drop-shadow(0 0 50px ${cfg.color}) drop-shadow(0 4px 20px ${cfg.color}80)`,
                                    } : {
                                        color: cfg.color,
                                        textShadow: `0 0 40px ${cfg.color}80, 0 4px 20px ${cfg.color}40`,
                                    }),
                                }}>
                                    +{gachaEffect.sparksWon}
                                    <span style={{
                                        fontSize: `${Math.max(fs * 0.28, 12)}px`,
                                        fontWeight: '800',
                                        marginLeft: '6px',
                                        letterSpacing: '3px',
                                    }}>pt</span>
                                </div>
                                {/* Tier name */}
                                {tier !== 'MISS' && (
                                    <div style={{
                                        fontSize: isUltraRare ? (isMobile ? '36px' : '52px') : tier === 'LEGENDARY' ? (isMobile ? '28px' : '42px') : tier === 'MEGA' ? (isMobile ? '20px' : '30px') : (isMobile ? '14px' : '18px'),
                                        fontWeight: '900',
                                        letterSpacing: isUltraRare ? '20px' : tier === 'LEGENDARY' ? '16px' : tier === 'MEGA' ? '10px' : '4px',
                                        color: tier === 'PHANTOM' ? '#fff' : cfg.color,
                                        marginTop: isUltraRare ? '20px' : tier === 'LEGENDARY' ? '16px' : '10px',
                                        textShadow: tier === 'PHANTOM'
                                            ? '0 0 40px #ffffffCC, 0 0 80px #ffffff80, 0 0 120px #ffffff40'
                                            : tier === 'SHINY'
                                            ? `0 0 40px #06B6D4CC, 0 0 80px #EC4899CC, 0 0 120px #D4AF37CC`
                                            : isEpic ? `0 0 40px ${cfg.color}90, 0 0 80px ${cfg.color}40` : `0 0 20px ${cfg.color}60`,
                                        ...(tier === 'SHINY' ? { animation: 'gacha-shiny-prismatic 2s linear infinite' } : {}),
                                        ...(tier === 'PHANTOM' ? { animation: 'gacha-phantom-pulse 1.5s ease-in-out infinite' } : {}),
                                    }}>
                                        {TIER_JA[tier] || tier}
                                        <span style={{
                                            display: 'block',
                                            fontSize: isUltraRare ? (isMobile ? '11px' : '14px') : tier === 'LEGENDARY' ? (isMobile ? '10px' : '13px') : tier === 'MEGA' ? (isMobile ? '9px' : '11px') : (isMobile ? '8px' : '10px'),
                                            fontWeight: '600',
                                            letterSpacing: isUltraRare ? '6px' : '3px',
                                            opacity: 0.7,
                                            marginTop: '4px',
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                        }}>
                                            {tier}
                                        </span>
                                    </div>
                                )}
                                {tier === 'MISS' && (
                                    <div style={{
                                        fontSize: isMobile ? '16px' : '20px',
                                        fontWeight: '800',
                                        color: '#A8A29E',
                                        marginTop: '6px',
                                        letterSpacing: '6px',
                                    }}>
                                        凡
                                        <span style={{
                                            display: 'block',
                                            fontSize: isMobile ? '8px' : '9px',
                                            fontWeight: '600',
                                            letterSpacing: '3px',
                                            opacity: 0.6,
                                            marginTop: '2px',
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                        }}>
                                            MISS
                                        </span>
                                    </div>
                                )}
                                {/* Card points earned + rank badge */}
                                {gachaEffect.phraseId && gachaEffect.cardPointsEarned > 0 && (() => {
                                    const currentRank = getCardRank(gachaEffect.cardTotalPoints);
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                                            <div style={{
                                                fontSize: isMobile ? '11px' : '13px',
                                                fontWeight: '700',
                                                color: '#D4AF37',
                                                letterSpacing: '1px',
                                                opacity: 0.9,
                                                animation: 'xp-float 2s ease-out forwards',
                                            }}>
                                                +{gachaEffect.cardPointsEarned} pts
                                            </div>
                                            {currentRank.rank !== 'NORMAL' && (
                                                <div style={{
                                                    fontSize: isMobile ? '10px' : '12px',
                                                    fontWeight: '800',
                                                    letterSpacing: '2px',
                                                    color: currentRank.borderColor,
                                                    padding: '2px 10px',
                                                    borderRadius: '8px',
                                                    border: `1px solid ${currentRank.borderColor}40`,
                                                    backgroundColor: `${currentRank.borderColor}15`,
                                                    boxShadow: `0 0 8px ${currentRank.borderColor}30`,
                                                }}>
                                                    {currentRank.label}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Particles — varied sizes, staggered bursts */}
                        {isReveal && particleCount > 0 && Array.from({ length: particleCount }).map((_, i) => {
                            const size = 2 + (i % 4) * 3 + (isEpic ? 2 : 0);
                            const angle = (i / particleCount) * 360;
                            const dist = 20 + ((i * 31) % 35);
                            const x = 50 + Math.cos(angle * Math.PI / 180) * dist;
                            const y = 50 + Math.sin(angle * Math.PI / 180) * dist;
                            return (
                                <div key={i} style={{
                                    position: 'absolute',
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    borderRadius: i % 3 === 0 ? '2px' : '50%',
                                    backgroundColor: i % 5 === 0 ? '#fff' : cfg.color,
                                    top: `${y}%`,
                                    left: `${x}%`,
                                    animation: `gacha-sparkle ${0.8 + (i % 6) * 0.25}s ease-out forwards`,
                                    animationDelay: `${(i % 8) * 0.08}s`,
                                    boxShadow: isEpic ? `0 0 ${size * 2}px ${cfg.color}80` : 'none',
                                }} />
                            );
                        })}
                    </div>
                );
            })()}

            {/* Quiet points toast (slot OFF) */}
            {quietToast && (
                <div key={quietToast.key} style={{
                    position: 'fixed',
                    top: '72px',
                    right: '16px',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(28,25,23,0.88)',
                    backdropFilter: 'blur(8px)',
                    animation: 'quiet-toast 2s ease-out forwards',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        color: quietToast.tier === 'MISS' ? '#A8A29E' : '#F6C85F',
                        letterSpacing: '-0.5px',
                    }}>
                        +{quietToast.sparks} pt
                    </span>
                    {quietToast.cardPts > 0 && (
                        <span style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#D4AF37',
                            opacity: 0.8,
                        }}>
                            +{quietToast.cardPts} pts
                        </span>
                    )}
                    {quietToast.tier !== 'MISS' && quietToast.tier !== 'BONUS' && (
                        <span style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            color: quietToast.tier === 'LEGENDARY' ? '#D4AF37'
                                : quietToast.tier === 'MEGA' ? '#8B5CF6'
                                : quietToast.tier === 'SUPER' ? '#EF4444'
                                : '#F59E0B',
                            letterSpacing: '1px',
                        }}>
                            {TIER_JA[quietToast.tier] || quietToast.tier}
                            <span style={{ opacity: 0.6, marginLeft: '4px', fontSize: '9px' }}>{quietToast.tier}</span>
                        </span>
                    )}
                </div>
            )}

            {/* Header */}
            <div style={{
                padding: '8px 12px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
            }}>
                {viewMode === 'calendar' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                            onClick={prevMonth}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '14px', color: '#A8A29E', padding: '4px',
                            }}
                        >
                            &#8249;
                        </button>
                        <span
                            onClick={() => { setCurrentMonth(new Date()); setSelectedDate(null); }}
                            style={{
                                fontSize: '14px', fontWeight: '700', color: '#1C1917',
                                cursor: 'pointer', letterSpacing: '-0.3px',
                            }}
                        >
                            {year}.{String(month + 1).padStart(2, '0')}
                        </span>
                        <button
                            onClick={nextMonth}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '14px', color: '#A8A29E', padding: '4px',
                            }}
                        >
                            &#8250;
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setViewMode('calendar')}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '12px', color: '#78716C',
                            display: 'flex', alignItems: 'center', gap: '2px',
                        }}
                    >
                        ← Calendar
                    </button>
                )}

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {viewMode === 'calendar' && (
                        <>
                            {!isMobile && (
                                <button
                                    onClick={() => { setViewMode('review'); setShuffleKey(k => k + 1); }}
                                    style={{
                                        background: 'none', border: '1.5px solid #D4AF37',
                                        borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                                        fontSize: '11px', fontWeight: '600', color: '#D4AF37',
                                    }}
                                >
                                    復習
                                </button>
                            )}
                            <button
                                onClick={() => setViewMode('list')}
                                style={{
                                    background: 'none', border: '1px solid #E7E5E4',
                                    borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                                    fontSize: '11px', fontWeight: '500', color: '#78716C',
                                }}
                            >
                                List
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setShowAddForm(true)}
                        style={{
                            background: '#1C1917', border: 'none',
                            borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                            fontSize: '11px', fontWeight: '600', color: '#fff',
                        }}
                    >
                        +
                    </button>
                    <Link
                        href="/english/training/guide"
                        style={{
                            background: 'none', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '11px', color: '#A8A29E',
                            textDecoration: 'none', padding: '4px',
                        }}
                    >
                        ?
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            {viewMode === 'review' ? (
                /* Full-screen Review View */
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: isMobile ? '16px' : '48px 24px',
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '780px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}>
                        {renderReviewContent()}
                    </div>
                </div>
            ) : viewMode === 'list' ? (
                /* List View */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Search */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #e5e5e5',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                            All Phrases ({filteredPhrases.length})
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            Active: {activeCount} | OWN+: {ownPlusCount}
                        </div>
                    </div>

                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 80px 2fr 80px 60px 30px 32px 40px',
                        padding: '10px 16px',
                        borderBottom: '1px solid #e5e5e5',
                        backgroundColor: '#fafafa',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#888'
                    }}>
                        <div>English</div>
                        <div>Category</div>
                        <div>Japanese</div>
                        <div>Status</div>
                        <div style={{ textAlign: 'right' }}>Date</div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    {/* List */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredPhrases.map(phrase => {
                            const baseMastery = Number(phraseMastery[phrase.id] || 0);
                            const hasRec = (voiceRecordings[phrase.id] || []).length > 0;
                            const hasLink = (phraseLinks[phrase.id] || []).length > 0;
                            const masteryInfo = getChakraInfo(baseMastery, hasRec, hasLink);
                            const isLockedToday = baseMastery === 3 || (baseMastery !== 6 && baseMastery < 3 && phraseLastLeveled[phrase.id] === clientToday);
                            return (
                                <div
                                    key={phrase.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 80px 2fr 80px 60px 30px 32px 40px',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f0f0f0',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div
                                        onClick={() => setSelectedDate(phrase.date.split('T')[0])}
                                        style={{ fontSize: '14px', fontWeight: '500', color: CATEGORY_COLORS[phrase.category]?.text || '#333', cursor: 'pointer' }}
                                    >
                                        {phrase.english}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>
                                        {phrase.category}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {phrase.japanese}
                                    </div>
                                    <button
                                        onClick={() => { if (!isLockedToday) cycleMastery(phrase.id); }}
                                        style={{
                                            fontSize: '10px',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            backgroundColor: masteryInfo.bg,
                                            color: masteryInfo.color,
                                            fontWeight: '600',
                                            cursor: isLockedToday ? 'not-allowed' : 'pointer',
                                            opacity: isLockedToday ? 0.5 : 1,
                                        }}
                                    >
                                        {masteryInfo.label}
                                    </button>
                                    <div style={{ fontSize: '11px', color: '#888', textAlign: 'right' }}>
                                        {phrase.date.split('T')[0].slice(5)}
                                    </div>
                                    <button
                                        onClick={() => playYouGlish(phrase)}
                                        style={{
                                            background: '#f0f0f0',
                                            border: 'none',
                                            color: '#666',
                                            fontSize: '9px',
                                            cursor: 'pointer',
                                            padding: '4px 6px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        YG
                                    </button>
                                    <button
                                        onClick={() => setEditingPhrase({ id: phrase.id, english: phrase.english, japanese: phrase.japanese })}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ccc',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#3B82F6'; e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePhrase(phrase.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ccc',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        削除
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Calendar View */
                <div style={{
                    flex: 1,
                    position: 'relative',
                    overflow: isMobile ? 'auto' : 'hidden',
                    minHeight: 0,
                    display: isMobile ? 'flex' : 'block',
                    flexDirection: 'column'
                }}>
                    {/* Calendar Section */}
                    <div style={{
                        position: isMobile ? 'sticky' : 'absolute',
                        top: 0,
                        left: isMobile ? 'auto' : 0,
                        right: isMobile ? 'auto' : (sidebarExpanded ? '540px' : '320px'),
                        bottom: isMobile ? 'auto' : 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: isMobile ? 'visible' : 'hidden',
                        backgroundColor: '#fff',
                        zIndex: isMobile ? 10 : 'auto',
                        transition: 'right 0.25s ease'
                    }}>
                        {/* Mobile: Today's Activity Calendar (31-day grid showing today's review touches) */}
                        {isMobile && (
                            <>
                                {/* Mobile Day Headers */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    borderBottom: '1px solid #eee',
                                    flexShrink: 0,
                                }}>
                                    {dayNames.map((dn, idx) => (
                                        <div key={dn} style={{
                                            textAlign: 'center',
                                            fontSize: '10px',
                                            color: idx === 0 ? '#ef4444' : idx === 6 ? '#3b82f6' : '#666',
                                            fontWeight: '600',
                                            padding: '6px 0',
                                        }}>
                                            {dn}
                                        </div>
                                    ))}
                                </div>
                                {/* Mobile Activity Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gap: '2px',
                                    padding: '4px',
                                }}>
                                    {calendarDays.map((day, index) => {
                                        if (day === null) return <div key={`empty-${index}`} style={{ backgroundColor: '#fafafa', borderRadius: '4px', minHeight: '52px' }} />;

                                        const dateKey = formatDateKey(day);
                                        const allDayPhrases = phrasesByDate[dateKey] || [];
                                        const hasPhrases = allDayPhrases.length > 0;
                                        const isTodayDate = isToday(day);
                                        const isPulsing = calendarPulse?.dateKey === dateKey;
                                        const isActiveReview = activeReviewDateKey === dateKey;

                                        // Chakra computation (same as PC)
                                        const total = allDayPhrases.length;
                                        const mChakraCounts: Record<ChakraLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
                                        for (const p of allDayPhrases) {
                                            const m = Number(phraseMastery[p.id] || 0);
                                            const hasRec = (voiceRecordings[p.id] || []).length > 0;
                                            const hasLink = (phraseLinks[p.id] || []).length > 0;
                                            mChakraCounts[getChakraLevel(m, hasRec, hasLink)]++;
                                        }
                                        const dailyPts = Object.entries(mChakraCounts).reduce((s, [lv, cnt]) => s + (Number(lv) > 0 ? CHAKRA_CONFIG[Number(lv) as ChakraLevel].lv * cnt : 0), 0);
                                        const mCum: Record<ChakraLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
                                        let mSum = 0;
                                        for (let lv = 6; lv >= 1; lv--) { mSum += mChakraCounts[lv as ChakraLevel]; mCum[lv as ChakraLevel] = mSum; }

                                        return (
                                            <div
                                                key={day}
                                                onClick={() => { if (hasPhrases) { setSelectedDate(dateKey); setSelectedChakraFilter(null); } }}
                                                style={{
                                                    borderRadius: '4px',
                                                    padding: '3px',
                                                    minHeight: '52px',
                                                    cursor: hasPhrases ? 'pointer' : 'default',
                                                    backgroundColor: !hasPhrases ? '#fafafa'
                                                        : dailyPts === 0 ? '#fafafa'
                                                            : dailyPts < total * 2 ? '#FFFDF5'
                                                                : dailyPts < total * 3 ? '#FFF9E6'
                                                                    : dailyPts < total * 5 ? '#FFF3CC'
                                                                        : '#FFECAD',
                                                    border: isActiveReview
                                                        ? '3px solid #D4AF37'
                                                        : isTodayDate
                                                            ? '2px solid #D4AF37'
                                                            : hasPhrases ? '1px solid #e5e5e5' : '1px solid #f0f0f0',
                                                    position: 'relative',
                                                    overflow: 'visible',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    transition: isPulsing ? 'none' : 'background-color 0.4s, border 0.3s',
                                                    zIndex: isPulsing ? 30 : isActiveReview ? 10 : 'auto',
                                                    ...(isActiveReview && !isPulsing ? {
                                                        animation: 'review-active-cell 1.5s ease-in-out infinite',
                                                        transform: 'scale(1.08)',
                                                        backgroundColor: '#FFF8E1',
                                                    } : {}),
                                                    ...(isPulsing ? {
                                                        animation: `cell-boom 2s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                                                        '--boom-color': calendarPulse.gradFrom,
                                                    } as React.CSSProperties : {}),
                                                }}
                                            >
                                                {/* White flash overlay */}
                                                {isPulsing && (
                                                    <div key={`mob-wflash-${calendarPulse!.key}`} style={{
                                                        position: 'absolute', inset: 0, borderRadius: '4px',
                                                        backgroundColor: calendarPulse!.gradFrom,
                                                        pointerEvents: 'none', zIndex: 5,
                                                        animation: 'cell-white-flash 1.5s ease-out forwards',
                                                    }} />
                                                )}
                                                {/* Expanding ring */}
                                                {isPulsing && (
                                                    <div key={`mob-ring-${calendarPulse!.key}`} style={{
                                                        position: 'absolute', top: '50%', left: '50%',
                                                        width: '100%', height: '100%',
                                                        marginLeft: '-50%', marginTop: '-50%',
                                                        borderRadius: '8px',
                                                        border: `3px solid ${calendarPulse!.gradFrom}`,
                                                        pointerEvents: 'none', zIndex: 25,
                                                        animation: 'cell-ring 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                                    }} />
                                                )}
                                                {/* Particle burst (delayed to Phase 2) */}
                                                {isPulsing && (() => {
                                                    const particles = Array.from({ length: 12 }, (_, i) => {
                                                        const angle = (i / 12) * 360 + (Math.random() - 0.5) * 30;
                                                        const dist = 20 + Math.random() * 25;
                                                        const rad = angle * Math.PI / 180;
                                                        return { tx: Math.cos(rad) * dist, ty: Math.sin(rad) * dist, size: 3 + Math.random() * 3, delay: Math.random() * 0.1, dur: 0.5 + Math.random() * 0.4, i };
                                                    });
                                                    return (
                                                        <div key={`mob-${calendarPulse!.key}`} style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 20 }}>
                                                            {particles.map(p => (
                                                                <div key={p.i} style={{
                                                                    position: 'absolute', width: `${p.size}px`, height: `${p.size}px`,
                                                                    borderRadius: p.i % 3 === 0 ? '0' : '50%',
                                                                    backgroundColor: calendarPulse!.gradFrom,
                                                                    boxShadow: `0 0 4px ${calendarPulse!.gradFrom}`,
                                                                    animation: `cal-burst ${p.dur}s ${p.delay + 0.8}s cubic-bezier(0.25,1,0.5,1) forwards`,
                                                                    '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
                                                                } as React.CSSProperties} />
                                                            ))}
                                                        </div>
                                                    );
                                                })()}
                                                {/* Floating +N (delayed to Phase 2) */}
                                                {isPulsing && (
                                                    <div key={calendarPulse!.key} style={{
                                                        position: 'absolute', top: '-6px', left: 0, right: 0,
                                                        display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 10,
                                                    }}>
                                                        <span style={{
                                                            fontSize: '13px', fontWeight: '900',
                                                            color: calendarPulse!.gradFrom,
                                                            textShadow: `0 1px 2px ${calendarPulse!.color}80`,
                                                            animation: 'cal-pop 1s 0.1s cubic-bezier(0.22,1,0.36,1) both',
                                                        }}>
                                                            +{calendarPulse!.points}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Day number + daily points (same as PC) */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: isTodayDate ? '800' : '600',
                                                        color: isTodayDate ? '#D4AF37' : !hasPhrases ? '#ccc' : '#78716C',
                                                        lineHeight: 1,
                                                    }}>
                                                        {day}
                                                    </span>
                                                    {dailyPts > 0 && (
                                                        <span style={{
                                                            fontSize: '9px',
                                                            fontWeight: '900',
                                                            color: dailyPts >= total * 5 ? '#B8860B' : '#D4AF37',
                                                            lineHeight: 1,
                                                        }}>
                                                            {dailyPts}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Chakra bars (same structure as PC) */}
                                                {hasPhrases && (
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px', position: 'relative' }}>
                                                        {/* Total count + review count overlay */}
                                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
                                                            <span style={{ fontSize: '16px', fontWeight: '900', color: 'rgba(0,0,0,0.07)', lineHeight: 1 }}>{total}</span>
                                                            {(monthlyReviewCounts[dateKey]?.count || 0) > 0 && (
                                                                <span style={{ fontSize: '8px', fontWeight: '800', color: '#D4AF37', lineHeight: 1, marginTop: '1px', opacity: 0.85 }}>
                                                                    +{monthlyReviewCounts[dateKey]?.count}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {([6, 5, 4, 3, 2, 1] as ChakraLevel[]).map(lv => {
                                                            const pct = total > 0 ? (mCum[lv] / total) * 100 : 0;
                                                            const isFlashLv = isPulsing && calendarPulse!.level === lv;
                                                            const isActiveBar = isActiveReview && activeReviewLevel === lv && !isPulsing;
                                                            return (
                                                                <div key={lv} style={{
                                                                    flex: isActiveBar ? 2.5 : 1,
                                                                    borderRadius: '1px',
                                                                    backgroundColor: isActiveBar ? `${CHAKRA_CONFIG[lv].gradFrom}25` : '#F0EFEC',
                                                                    overflow: 'hidden',
                                                                    position: 'relative',
                                                                    zIndex: isActiveBar ? 3 : 1,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    transition: 'flex 0.3s ease, background-color 0.3s ease',
                                                                    ...(isActiveBar ? {
                                                                        animation: 'review-active-bar 1.5s ease-in-out infinite',
                                                                        '--bar-glow-color': `${CHAKRA_CONFIG[lv].gradFrom}90`,
                                                                    } as React.CSSProperties : {}),
                                                                }}>
                                                                    <div
                                                                        key={isFlashLv ? `mf-${calendarPulse!.key}` : `mb-${lv}`}
                                                                        style={{
                                                                            width: `${pct}%`,
                                                                            height: '100%',
                                                                            background: `linear-gradient(90deg, ${CHAKRA_CONFIG[lv].gradFrom}, ${CHAKRA_CONFIG[lv].gradTo})`,
                                                                            transition: isFlashLv ? 'none' : 'width 0.6s ease',
                                                                            minWidth: mCum[lv] > 0 ? '2px' : '0px',
                                                                            ...(isFlashLv ? {
                                                                                animation: `bar-flash 1.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both, bar-glow 2s 0.1s ease-out both`,
                                                                                '--bar-target': `${pct}%`,
                                                                                '--bar-before': `${Math.max(0, pct - (100 / total))}%`,
                                                                                '--glow-color': `${CHAKRA_CONFIG[lv].gradFrom}80`,
                                                                            } as React.CSSProperties : {}),
                                                                        }}
                                                                    />
                                                                    {/* Count label (right) */}
                                                                    <span style={{
                                                                        position: 'absolute',
                                                                        right: '1px',
                                                                        fontSize: '6px',
                                                                        fontWeight: '800',
                                                                        color: mCum[lv] > 0 ? CHAKRA_CONFIG[lv].color : '#ccc',
                                                                        lineHeight: 1,
                                                                    }}>
                                                                        {mCum[lv] > 0 ? mCum[lv] : ''}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Today summary line */}
                            </>
                        )}

                        {/* PC: Day Headers */}
                        {!isMobile && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                borderBottom: '1px solid #eee',
                                flexShrink: 0
                            }}>
                                {dayNames.map((day, index) => (
                                    <div
                                        key={day}
                                        style={{
                                            textAlign: 'center',
                                            fontSize: '11px',
                                            color: index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : '#666',
                                            fontWeight: '600',
                                            padding: '8px 0'
                                        }}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Calendar Grid (PC only) */}
                        {!isMobile && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gridTemplateRows: `repeat(${rows}, 1fr)`,
                                gap: '0px',
                                padding: '0px',
                                flex: 1,
                                minHeight: 0
                            }}>
                                {calendarDays.map((day, index) => {
                                    if (day === null) {
                                        return <div key={`empty-${index}`} style={{ backgroundColor: '#fafafa', borderRadius: '6px' }} />;
                                    }

                                    const dateKey = formatDateKey(day);
                                    const allDayPhrases = phrasesByDate[dateKey] || [];
                                    const hasAnyPhrases = allDayPhrases.length > 0;
                                    const isTodayDate = isToday(day);
                                    const dayOfWeek = (startDayOfWeek + day - 1) % 7;

                                    // Count phrases at each chakra level for this day
                                    const total = allDayPhrases.length;
                                    const chakraCounts: Record<ChakraLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
                                    for (const p of allDayPhrases) {
                                        const m = Number(phraseMastery[p.id] || 0);
                                        const hasRec = (voiceRecordings[p.id] || []).length > 0;
                                        const hasLink = (phraseLinks[p.id] || []).length > 0;
                                        chakraCounts[getChakraLevel(m, hasRec, hasLink)]++;
                                    }
                                    const allCleared = total > 0 && chakraCounts[0] === 0;
                                    const dailyPts = Object.entries(chakraCounts).reduce((s, [lv, cnt]) => s + (Number(lv) > 0 ? CHAKRA_CONFIG[Number(lv) as ChakraLevel].lv * cnt : 0), 0);
                                    const isPulsing = calendarPulse?.dateKey === dateKey;
                                    const isActiveReview = activeReviewDateKey === dateKey;

                                    // Cumulative: each level = "phrases that reached at least this level"
                                    // SEED(0) = untouched, always 0%. Bars start from SPARK(1).
                                    const cumulative: Record<ChakraLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
                                    let runningSum = 0;
                                    for (let lv = 6; lv >= 1; lv--) {
                                        runningSum += chakraCounts[lv as ChakraLevel];
                                        cumulative[lv as ChakraLevel] = runningSum;
                                    }
                                    // SEED stays 0 — never fills the bar
                                    const barSegments = ([0, 1, 2, 3, 4, 5, 6] as ChakraLevel[]).map(lv => ({
                                        reached: cumulative[lv],
                                        pct: total > 0 ? (cumulative[lv] / total) * 100 : 0,
                                        exactCount: chakraCounts[lv],
                                        color: CHAKRA_CONFIG[lv].border,
                                        label: CHAKRA_CONFIG[lv].label,
                                    }));

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => { if (hasAnyPhrases) { setSelectedDate(dateKey); setSelectedChakraFilter(null); } }}
                                            onMouseEnter={(e) => {
                                                if (hasAnyPhrases) {
                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                            style={{
                                                borderRadius: '4px',
                                                cursor: hasAnyPhrases ? 'pointer' : 'default',
                                                overflow: 'visible',
                                                padding: '4px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                backgroundColor: !hasAnyPhrases ? '#fafafa'
                                                    : dailyPts === 0 ? '#fafafa'
                                                        : dailyPts < total * 2 ? '#FFFDF5'
                                                            : dailyPts < total * 3 ? '#FFF9E6'
                                                                : dailyPts < total * 5 ? '#FFF3CC'
                                                                    : '#FFECAD',
                                                border: isActiveReview
                                                    ? '3px solid #D4AF37'
                                                    : isTodayDate
                                                        ? '2px solid #D4AF37'
                                                        : hasAnyPhrases ? '1px solid #e5e5e5' : '1px solid #f0f0f0',
                                                transition: isPulsing ? 'none' : 'transform 0.15s, box-shadow 0.15s, background-color 0.4s, border 0.3s',
                                                position: 'relative',
                                                overflow: 'visible',
                                                zIndex: isPulsing ? 30 : isActiveReview ? 10 : 'auto',
                                                ...(isActiveReview && !isPulsing ? {
                                                    animation: 'review-active-cell 1.5s ease-in-out infinite',
                                                    transform: 'scale(1.06)',
                                                    backgroundColor: '#FFF8E1',
                                                } : {}),
                                                ...(isPulsing ? {
                                                    animation: `cell-boom 2s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                                                    '--boom-color': calendarPulse.gradFrom,
                                                } as React.CSSProperties : {}),
                                            }}
                                        >
                                            {/* White flash overlay on level-up */}
                                            {isPulsing && (
                                                <div key={`wflash-${calendarPulse.key}`} style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    borderRadius: '4px',
                                                    backgroundColor: calendarPulse.gradFrom,
                                                    pointerEvents: 'none',
                                                    zIndex: 5,
                                                    animation: 'cell-white-flash 1.5s ease-out forwards',
                                                }} />
                                            )}
                                            {/* Expanding ring on level-up */}
                                            {isPulsing && (
                                                <div key={`ring-${calendarPulse.key}`} style={{
                                                    position: 'absolute',
                                                    top: '50%', left: '50%',
                                                    width: '100%', height: '100%',
                                                    marginLeft: '-50%', marginTop: '-50%',
                                                    borderRadius: '8px',
                                                    border: `4px solid ${calendarPulse.gradFrom}`,
                                                    pointerEvents: 'none',
                                                    zIndex: 25,
                                                    animation: 'cell-ring 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                                                }} />
                                            )}
                                            {/* Floating +N on level-up */}
                                            {isPulsing && (
                                                <div key={calendarPulse.key} style={{
                                                    position: 'absolute',
                                                    top: '-6px', left: 0, right: 0,
                                                    display: 'flex', justifyContent: 'center',
                                                    pointerEvents: 'none', zIndex: 10,
                                                }}>
                                                    <span style={{
                                                        fontSize: isMobile ? '13px' : '16px',
                                                        fontWeight: '900',
                                                        color: calendarPulse.gradFrom,
                                                        textShadow: `0 1px 2px ${calendarPulse.color}80, 0 0 8px ${calendarPulse.gradFrom}40`,
                                                        animation: 'cal-pop 1s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both',
                                                    }}>
                                                        +{calendarPulse.points}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Particle burst on level-up */}
                                            {isPulsing && (() => {
                                                const particles = Array.from({ length: 12 }, (_, i) => {
                                                    const angle = (i / 12) * 360 + (Math.random() - 0.5) * 30;
                                                    const dist = 20 + Math.random() * 25;
                                                    const rad = angle * Math.PI / 180;
                                                    const tx = Math.cos(rad) * dist;
                                                    const ty = Math.sin(rad) * dist;
                                                    const size = 3 + Math.random() * 3;
                                                    const delay = Math.random() * 0.1;
                                                    const dur = 0.5 + Math.random() * 0.4;
                                                    return { tx, ty, size, delay, dur, i };
                                                });
                                                return (
                                                    <div key={`burst-${calendarPulse.key}`} style={{
                                                        position: 'absolute',
                                                        top: '50%', left: '50%',
                                                        width: 0, height: 0,
                                                        pointerEvents: 'none', zIndex: 20,
                                                    }}>
                                                        {particles.map(p => (
                                                            <div key={p.i} style={{
                                                                position: 'absolute',
                                                                width: `${p.size}px`,
                                                                height: `${p.size}px`,
                                                                borderRadius: p.i % 3 === 0 ? '0' : '50%',
                                                                backgroundColor: calendarPulse.gradFrom,
                                                                boxShadow: `0 0 4px ${calendarPulse.gradFrom}`,
                                                                animation: `cal-burst ${p.dur}s ${p.delay + 0.8}s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                                                                transform: 'translate(0,0) scale(1)',
                                                                '--tx': `${p.tx}px`,
                                                                '--ty': `${p.ty}px`,
                                                            } as React.CSSProperties} />
                                                        ))}
                                                    </div>
                                                );
                                            })()}

                                            {/* Day number + daily points */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    color: dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#aaa',
                                                    lineHeight: 1
                                                }}>
                                                    {day}
                                                </span>
                                                {dailyPts > 0 && (
                                                    <span style={{
                                                        fontSize: isMobile ? '9px' : '12px',
                                                        fontWeight: '900',
                                                        color: dailyPts >= total * 5 ? '#B8860B' : '#D4AF37',
                                                        lineHeight: 1,
                                                    }}>
                                                        {dailyPts}
                                                    </span>
                                                )}
                                            </div>

                                            {/* 7-row chakra bars (CROWN top → SEED bottom) - cumulative */}
                                            {hasAnyPhrases && (
                                                <div style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    marginTop: '2px',
                                                    gap: '1px',
                                                    position: 'relative',
                                                }}>
                                                    {/* Background: total count + review count */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        pointerEvents: 'none',
                                                        zIndex: 2,
                                                    }}>
                                                        <span style={{
                                                            fontSize: isMobile ? '24px' : '50px',
                                                            fontWeight: '900',
                                                            color: 'rgba(0,0,0,0.08)',
                                                            lineHeight: 1,
                                                        }}>
                                                            {total}
                                                        </span>
                                                        {(monthlyReviewCounts[dateKey]?.count || 0) > 0 && (
                                                            <span style={{
                                                                fontSize: isMobile ? '11px' : '15px',
                                                                fontWeight: '800',
                                                                color: '#D4AF37',
                                                                lineHeight: 1,
                                                                marginTop: isMobile ? '1px' : '3px',
                                                                opacity: 0.85,
                                                            }}>
                                                                +{monthlyReviewCounts[dateKey]?.count}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {([6, 5, 4, 3, 2, 1] as ChakraLevel[]).map(lv => {
                                                        const seg = barSegments[lv];
                                                        const isFlashingLevel = isPulsing && calendarPulse.level === lv;
                                                        const isActiveBar = isActiveReview && activeReviewLevel === lv && !isPulsing;
                                                        return (
                                                            <div
                                                                key={lv}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (seg.exactCount > 0) {
                                                                        setSelectedDate(dateKey);
                                                                        setSelectedChakraFilter(prev => prev === lv ? null : lv);
                                                                    }
                                                                }}
                                                                style={{
                                                                    flex: isActiveBar ? 2.5 : 1,
                                                                    borderRadius: '1px',
                                                                    backgroundColor: isActiveBar ? `${CHAKRA_CONFIG[lv].gradFrom}25` : '#F0EFEC',
                                                                    overflow: 'hidden',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    cursor: seg.exactCount > 0 ? 'pointer' : 'default',
                                                                    position: 'relative',
                                                                    zIndex: isActiveBar ? 3 : 1,
                                                                    transition: 'flex 0.3s ease, background-color 0.3s ease',
                                                                    ...(isActiveBar ? {
                                                                        animation: 'review-active-bar 1.5s ease-in-out infinite',
                                                                        '--bar-glow-color': `${CHAKRA_CONFIG[lv].gradFrom}90`,
                                                                    } as React.CSSProperties : {}),
                                                                }}
                                                            >
                                                                <div
                                                                    key={isFlashingLevel ? `flash-${calendarPulse.key}` : `bar-${lv}`}
                                                                    style={{
                                                                        width: `${seg.pct}%`,
                                                                        height: '100%',
                                                                        background: `linear-gradient(90deg, ${CHAKRA_CONFIG[lv].gradFrom}, ${CHAKRA_CONFIG[lv].gradTo})`,
                                                                        transition: isFlashingLevel ? 'none' : 'width 0.6s cubic-bezier(0.33, 0, 0.2, 1)',
                                                                        minWidth: seg.reached > 0 ? '2px' : '0px',
                                                                        opacity: selectedDate === dateKey && selectedChakraFilter !== null && selectedChakraFilter !== lv ? 0.25 : 1,
                                                                        ...(isFlashingLevel ? {
                                                                            animation: `bar-flash 1.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both, bar-glow 2s 0.1s ease-out both`,
                                                                            '--bar-target': `${seg.pct}%`,
                                                                            '--bar-before': `${Math.max(0, seg.pct - (100 / total))}%`,
                                                                            '--glow-color': `${CHAKRA_CONFIG[lv].gradFrom}80`,
                                                                        } as React.CSSProperties : {}),
                                                                    }}>
                                                                </div>
                                                                {/* Percentage (left) */}
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    left: '2px',
                                                                    fontSize: '7px',
                                                                    fontWeight: '600',
                                                                    color: seg.reached > 0 ? CHAKRA_CONFIG[lv].color : '#ccc',
                                                                    lineHeight: 1,
                                                                    opacity: 0.7,
                                                                }}>
                                                                    {Math.round(seg.pct)}%
                                                                </span>
                                                                {/* Count (right) */}
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    right: '2px',
                                                                    fontSize: '9px',
                                                                    fontWeight: '800',
                                                                    color: seg.reached > 0 ? CHAKRA_CONFIG[lv].color : '#ccc',
                                                                    lineHeight: 1,
                                                                }}>
                                                                    {seg.reached}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Empty cell: Just + button */}
                                            {!hasAnyPhrases && (
                                                <div style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFormDate(dateKey);
                                                            setShowAddForm(true);
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = '#D4AF37';
                                                            e.currentTarget.style.color = '#fff';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'rgba(212,175,55,0.2)';
                                                            e.currentTarget.style.color = '#B8960C';
                                                        }}
                                                        style={{
                                                            width: '22px',
                                                            height: '22px',
                                                            borderRadius: '50%',
                                                            background: 'rgba(212,175,55,0.2)',
                                                            border: 'none',
                                                            fontSize: '14px',
                                                            fontWeight: '400',
                                                            color: '#B8960C',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Stats OR Selected Date Phrases */}
                    <div style={{
                        position: isMobile ? 'relative' : 'absolute',
                        top: isMobile ? 'auto' : 0,
                        right: isMobile ? 'auto' : 0,
                        bottom: isMobile ? 'auto' : 0,
                        width: isMobile ? '100%' : (sidebarExpanded ? '540px' : '320px'),
                        flexShrink: 0,
                        backgroundColor: '#fafafa',
                        borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
                        borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        overflowY: isMobile ? 'visible' : 'auto',
                        transition: 'width 0.25s ease'
                    }}>
                        {/* Show phrases when date is selected, otherwise show stats */}
                        {selectedDate && selectedPhrasesAll.length > 0 ? (
                            <>
                                {/* Selected Date Header */}
                                <div style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '14px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                                {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                                            </span>
                                            {(() => {
                                                const dayPhrases = phrasesByDate[selectedDate] || [];
                                                const pts = dayPhrases.reduce((sum, p) => {
                                                    const m = Number(phraseMastery[p.id] || 0);
                                                    const hasRec = (voiceRecordings[p.id] || []).length > 0;
                                                    const hasLink = (phraseLinks[p.id] || []).length > 0;
                                                    const lv = getChakraLevel(m, hasRec, hasLink);
                                                    return sum + (lv > 0 ? CHAKRA_CONFIG[lv].lv : 0);
                                                }, 0);
                                                const maxPts = dayPhrases.length * 7;
                                                return pts > 0 ? (
                                                    <span style={{
                                                        fontSize: '18px',
                                                        fontWeight: '900',
                                                        color: '#D4AF37',
                                                        letterSpacing: '-0.5px',
                                                    }}>
                                                        {pts}<span style={{ fontSize: '10px', fontWeight: '700', color: '#B8860B' }}>/{maxPts}</span>
                                                    </span>
                                                ) : null;
                                            })()}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888' }}>
                                            {selectedPhrases.length} / {selectedPhrasesAll.length} phrases
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        {!isMobile && (
                                            <button
                                                onClick={() => setSidebarExpanded(prev => !prev)}
                                                title={sidebarExpanded ? 'Collapse' : 'Expand'}
                                                style={{
                                                    background: sidebarExpanded ? '#D4AF37' : '#f0f0f0',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '6px 10px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    color: sidebarExpanded ? '#fff' : '#666',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sidebarExpanded ? '#fff' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.25s', transform: sidebarExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                    <polyline points="15 18 9 12 15 6" />
                                                </svg>
                                                {sidebarExpanded ? 'Narrow' : 'Wide'}
                                            </button>
                                        )}
                                        <Link
                                            href={`/english/phrases/${selectedDate}`}
                                            style={{
                                                background: '#D4AF37',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                color: '#000',
                                                textDecoration: 'none',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Listen
                                        </Link>
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            style={{
                                                background: '#f0f0f0',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>

                                {/* Chakra filter pills */}
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => setSelectedChakraFilter(null)}
                                        style={{
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            border: selectedChakraFilter === null ? '2px solid #D4AF37' : '1px solid #ddd',
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            backgroundColor: selectedChakraFilter === null ? '#FFFBEB' : '#fff',
                                            color: '#666',
                                        }}
                                    >
                                        ALL {selectedPhrasesAll.length}
                                    </button>
                                    {([0, 1, 2, 3, 4, 5, 6] as ChakraLevel[]).map(lv => {
                                        const cfg = CHAKRA_CONFIG[lv];
                                        const count = selectedPhrasesAll.filter(p => {
                                            const m = Number(phraseMastery[p.id] || 0);
                                            const hasRec = (voiceRecordings[p.id] || []).length > 0;
                                            const hasLink = (phraseLinks[p.id] || []).length > 0;
                                            return getChakraLevel(m, hasRec, hasLink) === lv;
                                        }).length;
                                        return (
                                            <button
                                                key={lv}
                                                onClick={() => setSelectedChakraFilter(prev => prev === lv ? null : lv)}
                                                style={{
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    border: selectedChakraFilter === lv ? `2px solid ${cfg.border}` : '1px solid #ddd',
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    cursor: count > 0 ? 'pointer' : 'default',
                                                    backgroundColor: selectedChakraFilter === lv ? cfg.bg : '#fff',
                                                    color: count > 0 ? cfg.color : '#ccc',
                                                    opacity: count > 0 ? 1 : 0.5,
                                                }}
                                            >
                                                {cfg.ja} {cfg.name} {count}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Phrase List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedPhrases.map(phrase => {
                                        const baseMastery = Number(phraseMastery[phrase.id] || 0);
                                        const hasRec = (voiceRecordings[phrase.id] || []).length > 0;
                                        const hasLink = (phraseLinks[phrase.id] || []).length > 0;
                                        const masteryInfo = getChakraInfo(baseMastery, hasRec, hasLink);
                                        const isPlaying = playingPhraseId === phrase.id;
                                        const isLockedToday = baseMastery === 3 || (baseMastery !== 6 && baseMastery < 3 && phraseLastLeveled[phrase.id] === clientToday);
                                        const cPts = cardPoints[phrase.id] || 0;
                                        const cRank = getCardRank(cPts);
                                        const cFrame = getCardFrame(cRank.rank);
                                        const cAccent = getFrameAccent(cRank.rank);
                                        return (
                                            <div
                                                key={phrase.id}
                                                style={{
                                                    borderRadius: '12px',
                                                    ...cFrame,
                                                    border: cFrame.border.replace('6px', '4px'),
                                                    boxShadow: getCardShadow(cRank.rank),
                                                    padding: '4px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {/* Mini Name Bar */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '4px 8px',
                                                    backgroundColor: `${cAccent}10`,
                                                    borderRadius: '8px 8px 0 0',
                                                    borderBottom: `1px solid ${cAccent}20`,
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <button
                                                            onClick={() => playPhrase(phrase)}
                                                            style={{
                                                                width: '24px', height: '24px',
                                                                borderRadius: '50%',
                                                                backgroundColor: isPlaying ? '#D4AF37' : '#fff',
                                                                border: `1px solid ${cAccent}30`,
                                                                cursor: 'pointer',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                flexShrink: 0, padding: 0,
                                                            }}
                                                        >
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill={isPlaying ? '#fff' : '#666'}>
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </button>
                                                        <ElementBadge element={phrase.category} size={10} />
                                                        {(() => {
                                                            const bst = calcBstTotal(phrase.id);
                                                            const bt = getBstTier(bst);
                                                            return (
                                                                <span style={{
                                                                    fontSize: '8px', fontWeight: '800',
                                                                    color: bt.color, letterSpacing: '0.5px',
                                                                }}>
                                                                    {bt.tier}{bst}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                                                        <span style={{
                                                            fontSize: '11px', fontWeight: '800',
                                                            color: cRank.rank !== 'NORMAL' ? cRank.borderColor : '#A8A29E',
                                                            fontVariantNumeric: 'tabular-nums',
                                                        }}>
                                                            {cPts}
                                                        </span>
                                                        <span style={{ fontSize: '7px', fontWeight: '700', color: '#A8A29E' }}>pt</span>
                                                        {cRank.rank !== 'NORMAL' && (
                                                            <span style={{
                                                                fontSize: '7px', fontWeight: '800',
                                                                color: cRank.borderColor,
                                                                letterSpacing: '0.5px', marginLeft: '2px',
                                                            }}>
                                                                {cRank.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '9px', fontWeight: '600', color: '#A8A29E', marginLeft: '6px' }}>
                                                        {phrase.date.split('T')[0]}
                                                    </div>
                                                </div>

                                                {/* Content Window */}
                                                <div style={{
                                                    background: getCardWindowBg(cRank.rank),
                                                    borderRadius: '8px',
                                                    border: `1px solid ${cAccent}20`,
                                                    margin: '4px',
                                                    padding: '10px 12px',
                                                }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                                                        {phrase.english}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {phrase.japanese}
                                                    </div>
                                                </div>

                                                {/* Bottom: Mastery + CROWN + Voice + Tools */}
                                                <div style={{ padding: '4px 8px 6px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                                        <button
                                                            onClick={() => {
                                                                if (isLockedToday) return;
                                                                const cur = baseMastery;
                                                                if (cur === 3) return;
                                                                const nxt = cur === 6 ? 0 : (cur + 1);
                                                                if (nxt > 0 && nxt > cur) {
                                                                    const nl = getChakraLevel(nxt, hasRec, hasLink);
                                                                    const nc = CHAKRA_CONFIG[nl];
                                                                    playLevelSound(nl);
                                                                    setCalendarPulse({
                                                                        dateKey: phrase.date.split('T')[0],
                                                                        points: nc.lv,
                                                                        gradFrom: nc.gradFrom,
                                                                        color: nc.color,
                                                                        level: nl,
                                                                        key: Date.now(),
                                                                    });
                                                                }
                                                                cycleMastery(phrase.id);
                                                            }}
                                                            style={{
                                                                padding: '4px 10px',
                                                                borderRadius: '4px',
                                                                border: `1px solid ${masteryInfo.border}`,
                                                                backgroundColor: masteryInfo.bg,
                                                                color: masteryInfo.color,
                                                                fontSize: '10px',
                                                                fontWeight: '700',
                                                                cursor: isLockedToday ? 'not-allowed' : 'pointer',
                                                                opacity: isLockedToday ? 0.5 : 1,
                                                                transition: 'transform 0.15s',
                                                            }}
                                                        >
                                                            {masteryInfo.label}
                                                        </button>
                                                        {masteryInfo.level === 5 && (
                                                            <button
                                                                onClick={() => declareCrown(phrase.id)}
                                                                style={{
                                                                    padding: '3px 8px', borderRadius: '4px',
                                                                    border: '1px solid #A855F7',
                                                                    backgroundColor: '#FAF5FF', color: '#7E22CE',
                                                                    fontSize: '9px', fontWeight: '700',
                                                                    cursor: isLockedToday ? 'not-allowed' : 'pointer',
                                                                    opacity: isLockedToday ? 0.5 : 1,
                                                                }}
                                                            >
                                                                CROWN
                                                            </button>
                                                        )}
                                                        <VoiceRecorder
                                                            phraseId={phrase.id}
                                                            recordings={voiceRecordings[phrase.id] || []}
                                                            onRecordingComplete={(recording) => {
                                                                const pid = phrase.id;
                                                                const prevRecs = voiceRecordings[pid] || [];
                                                                const wasFirst = prevRecs.length === 0;
                                                                setVoiceRecordings(prev => ({
                                                                    ...prev,
                                                                    [pid]: [recording, ...(prev[pid] || [])]
                                                                }));
                                                                const bm = Number(phraseMastery[pid] || 0);
                                                                const hl = (phraseLinks[pid] || []).length > 0;
                                                                const levelBefore = getChakraLevel(bm, !wasFirst, hl);
                                                                const levelAfter = getChakraLevel(bm, true, hl);
                                                                const xpGained = levelAfter > levelBefore ? CHAKRA_CONFIG[levelAfter].lv : 0;
                                                                if (xpGained > 0) postXP(new Date().toISOString().split('T')[0], xpGained, false, pid);
                                                            }}
                                                            onRecordingDelete={(id) => {
                                                                setVoiceRecordings(prev => ({
                                                                    ...prev,
                                                                    [phrase.id]: (prev[phrase.id] || []).filter(r => r.id !== id)
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                    {/* Tools row */}
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        paddingTop: '4px',
                                                        borderTop: `1px solid ${cAccent}15`,
                                                    }}>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <button
                                                                onClick={() => playYouGlish(phrase)}
                                                                style={{
                                                                    background: '#f0f0f0', border: 'none',
                                                                    color: '#666', fontSize: '9px',
                                                                    cursor: 'pointer', padding: '3px 6px',
                                                                    borderRadius: '3px',
                                                                }}
                                                            >
                                                                YG
                                                            </button>
                                                            <button
                                                                onClick={() => openVocabModal(phrase.english)}
                                                                style={{
                                                                    background: 'none', border: '1px solid #10B981',
                                                                    borderRadius: '3px', cursor: 'pointer',
                                                                    padding: '3px 6px', fontSize: '9px',
                                                                    color: '#10B981', fontWeight: '600',
                                                                }}
                                                            >
                                                                +Vocab
                                                            </button>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '3px' }}>
                                                            <button
                                                                onClick={() => setEditingPhrase({ id: phrase.id, english: phrase.english, japanese: phrase.japanese })}
                                                                style={{
                                                                    background: '#EFF6FF', border: '1px solid #BFDBFE',
                                                                    color: '#3B82F6', fontSize: '9px', fontWeight: '600',
                                                                    cursor: 'pointer', padding: '3px 8px', borderRadius: '3px',
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePhrase(phrase.id)}
                                                                style={{
                                                                    background: '#FEF2F2', border: '1px solid #FECACA',
                                                                    color: '#EF4444', fontSize: '9px', fontWeight: '600',
                                                                    cursor: 'pointer', padding: '3px 8px', borderRadius: '3px',
                                                                }}
                                                            >
                                                                削除
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* No date selected: summary + review */
                            isMobile ? (
                                <>{renderReviewContent()}</>
                            ) : (
                                <>
                                    {/* Analytics Dashboard */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                                        {/* KPI Hero Cards */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                            {/* Total Points */}
                                            <div style={{
                                                borderRadius: '12px',
                                                padding: '12px 10px',
                                                background: 'linear-gradient(135deg, #FEF9E7 0%, #FFF8E1 100%)',
                                                border: '1px solid #F0E68C',
                                                position: 'relative',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#D4AF37' }} />
                                                <div style={{ fontSize: '9px', fontWeight: '600', color: '#B8860B', letterSpacing: '0.5px', marginBottom: '4px' }}>POINTS</div>
                                                <div style={{ fontSize: '26px', fontWeight: '800', color: '#D4AF37', lineHeight: 1 }}>{chakraAnalytics.totalPoints}</div>
                                                <div style={{ fontSize: '9px', color: '#B8860B', marginTop: '2px' }}>pts</div>
                                            </div>
                                            {/* Today Touches */}
                                            <div style={{
                                                borderRadius: '12px',
                                                padding: '12px 10px',
                                                background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
                                                border: '1px solid #BBF7D0',
                                                position: 'relative',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#10B981' }} />
                                                <div style={{ fontSize: '9px', fontWeight: '600', color: '#047857', letterSpacing: '0.5px', marginBottom: '4px' }}>本日</div>
                                                <div style={{ fontSize: '26px', fontWeight: '800', color: '#10B981', lineHeight: 1 }}>{chakraAnalytics.todayTouches}</div>
                                                <div style={{ fontSize: '9px', color: '#047857', marginTop: '2px' }}>タッチ</div>
                                            </div>
                                            {/* Streak */}
                                            <div style={{
                                                borderRadius: '12px',
                                                padding: '12px 10px',
                                                background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                                                border: '1px solid #DDD6FE',
                                                position: 'relative',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#8B5CF6' }} />
                                                <div style={{ fontSize: '9px', fontWeight: '600', color: '#6D28D9', letterSpacing: '0.5px', marginBottom: '4px' }}>STREAK</div>
                                                <div style={{ fontSize: '26px', fontWeight: '800', color: '#8B5CF6', lineHeight: 1 }}>{chakraAnalytics.streak}</div>
                                                <div style={{ fontSize: '9px', color: '#6D28D9', marginTop: '2px' }}>days</div>
                                            </div>
                                        </div>

                                        {/* Daily Activity Sparkline */}
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                        }}>
                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                                {year}年{monthNames[month]} ACTIVITY
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: '40px' }}>
                                                {chakraAnalytics.dailyData.map((d) => {
                                                    const maxTouches = Math.max(...chakraAnalytics.dailyData.map(x => x.touches), 1);
                                                    const h = d.touches > 0 ? Math.max((d.touches / maxTouches) * 36, 3) : 2;
                                                    return (
                                                        <div
                                                            key={d.day}
                                                            title={`${d.day}日: ${d.touches} touches`}
                                                            style={{
                                                                flex: 1,
                                                                height: `${h}px`,
                                                                borderRadius: '2px',
                                                                backgroundColor: d.touches > 0 ? '#D4AF37' : '#EBEBEB',
                                                                transition: 'height 0.3s ease-out',
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Month Stats Row */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            padding: '10px 8px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#D4AF37' }}>{chakraAnalytics.monthPoints}</div>
                                                <div style={{ fontSize: '8px', color: '#999', fontWeight: '600' }}>MONTH PTS</div>
                                            </div>
                                            <div style={{ width: '1px', backgroundColor: '#eee' }} />
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>{chakraAnalytics.activeDays}<span style={{ fontSize: '10px', color: '#999' }}>/{chakraAnalytics.daysInMonth}</span></div>
                                                <div style={{ fontSize: '8px', color: '#999', fontWeight: '600' }}>ACTIVE DAYS</div>
                                            </div>
                                            <div style={{ width: '1px', backgroundColor: '#eee' }} />
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>Lv.{(chakraAnalytics.avgLevel + 1).toFixed(1)}</div>
                                                <div style={{ fontSize: '8px', color: '#999', fontWeight: '600' }}>AVG LEVEL</div>
                                            </div>
                                        </div>

                                        {/* Level Distribution (existing cumulative bars) */}
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                        }}>
                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.5px', marginBottom: '8px' }}>LEVEL DISTRIBUTION</div>
                                            {thisMonthReviewPhrases.total.length > 0 && (() => {
                                                const t = thisMonthReviewPhrases.total.length;
                                                const exactCounts = [0, 1, 2, 3, 4, 5, 6].map(lv =>
                                                    (thisMonthReviewPhrases[`level${lv}` as keyof typeof thisMonthReviewPhrases] as Phrase[]).length
                                                );
                                                const monthCumulative: number[] = [0, 0, 0, 0, 0, 0, 0];
                                                let sum = 0;
                                                for (let lv = 6; lv >= 0; lv--) {
                                                    sum += exactCounts[lv];
                                                    monthCumulative[lv] = sum;
                                                }
                                                return (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        {([6, 5, 4, 3, 2, 1] as ChakraLevel[]).map(lv => {
                                                            const cfg = CHAKRA_CONFIG[lv];
                                                            const reached = monthCumulative[lv];
                                                            const pct = (reached / t) * 100;
                                                            return (
                                                                <div key={lv} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ fontSize: '9px', fontWeight: '700', color: cfg.color, width: '42px', textAlign: 'right' }}>
                                                                        {cfg.ja} {cfg.name}
                                                                    </span>
                                                                    <div style={{
                                                                        flex: 1,
                                                                        height: '8px',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: '#f0f0f0',
                                                                        overflow: 'hidden',
                                                                    }}>
                                                                        <div style={{
                                                                            width: `${pct}%`,
                                                                            height: '100%',
                                                                            background: `linear-gradient(90deg, ${cfg.gradFrom}, ${cfg.gradTo})`,
                                                                            borderRadius: '4px',
                                                                            transition: 'width 0.3s ease-out',
                                                                        }} />
                                                                    </div>
                                                                    <span style={{ fontSize: '9px', fontWeight: '600', color: cfg.color, width: '28px' }}>
                                                                        {reached}/{t}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                    </div>
                                    {/* Review Cards */}
                                    {renderReviewContent()}
                                </>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Add Phrase Modal */}
            {showAddForm && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowAddForm(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            width: '100%',
                            maxWidth: '400px'
                        }}
                    >
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
                            Add New Phrase
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                Date
                            </label>
                            <input
                                type="date"
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                English
                            </label>
                            <input
                                type="text"
                                value={newPhrase.english}
                                onChange={(e) => setNewPhrase(prev => ({ ...prev, english: e.target.value }))}
                                placeholder="Enter English phrase"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                Japanese
                            </label>
                            <input
                                type="text"
                                value={newPhrase.japanese}
                                onChange={(e) => setNewPhrase(prev => ({ ...prev, japanese: e.target.value }))}
                                placeholder="日本語訳を入力"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                Element
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {Object.keys(CATEGORY_COLORS).map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setNewPhrase(prev => ({ ...prev, category: cat }))}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            border: newPhrase.category === cat ? `2px solid ${CATEGORY_COLORS[cat].text}` : `1px solid ${CATEGORY_COLORS[cat].border}`,
                                            backgroundColor: CATEGORY_COLORS[cat].bg,
                                            cursor: 'pointer',
                                            opacity: newPhrase.category === cat ? 1 : 0.6,
                                            transition: 'opacity 0.15s',
                                        }}
                                    >
                                        <ElementBadge element={cat} size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowAddForm(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    backgroundColor: '#fff',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPhrase}
                                disabled={isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim()}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? '#e5e5e5' : '#D4AF37',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? '#888' : '#000',
                                    cursor: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* YouGlish Player */}
            {youglishPhrase && (
                <div style={{
                    position: 'fixed',
                    left: playerFullscreen ? 0 : playerPosition.x,
                    top: playerFullscreen ? 0 : playerPosition.y,
                    width: playerFullscreen ? '100vw' : playerMinimized ? '200px' : playerSize.width,
                    height: playerFullscreen ? '100vh' : playerMinimized ? 'auto' : playerSize.height,
                    backgroundColor: '#fff',
                    borderRadius: playerFullscreen ? 0 : '12px',
                    boxShadow: playerFullscreen ? 'none' : '0 4px 20px rgba(0,0,0,0.25)',
                    zIndex: 1001,
                    overflow: 'hidden',
                    userSelect: (isDragging || isResizing) ? 'none' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Header */}
                    <div
                        onMouseDown={handleDragStart}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            borderBottom: '1px solid #333',
                            backgroundColor: '#1a1a1a',
                            cursor: playerFullscreen ? 'default' : isDragging ? 'grabbing' : 'grab',
                            flexShrink: 0
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {!playerFullscreen && <span style={{ color: '#666', fontSize: '10px' }}>:::::</span>}
                            <span style={{ fontWeight: '600', fontSize: '12px', color: '#fff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {youglishPhrase.english.slice(0, 30)}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {/* Minimize */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setPlayerMinimized(!playerMinimized); setPlayerFullscreen(false); }}
                                style={{
                                    background: '#444',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}
                                title="Minimize"
                            >
                                _
                            </button>
                            {/* Fullscreen */}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                style={{
                                    background: playerFullscreen ? '#10B981' : '#444',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}
                                title={playerFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                                {playerFullscreen ? '[]' : '[ ]'}
                            </button>
                            {/* Close */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setYouglishPhrase(null); setCaptionHistory([]); setPlayerFullscreen(false); }}
                                style={{
                                    background: '#dc2626',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                }}
                                title="Close"
                            >
                                X
                            </button>
                        </div>
                    </div>

                    {!playerMinimized && (
                        <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                            {/* Search Input */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={youglishQuery}
                                    onChange={(e) => setYouglishQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && searchYouGlish()}
                                    placeholder="Search word (e.g. believe, amazing)"
                                    style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e5e5',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={searchYouGlish}
                                    disabled={!youglishQuery.trim()}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: youglishQuery.trim() ? '#D4AF37' : '#e5e5e5',
                                        color: youglishQuery.trim() ? '#000' : '#999',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: youglishQuery.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Search
                                </button>
                            </div>

                            {/* Original phrase reference */}
                            <div style={{ fontSize: '11px', color: '#888', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                                <strong>Original:</strong> {youglishPhrase.english}
                            </div>

                            {/* YouGlish Widget */}
                            <div id="yg-widget-phrases" style={{
                                minHeight: '200px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                display: youglishSearched ? 'block' : 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {!youglishSearched && (
                                    <span style={{ color: '#888', fontSize: '13px' }}>Enter a keyword to search</span>
                                )}
                            </div>

                            {/* Caption History */}
                            {captionHistory.length > 0 && (
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: '#f0fdf4',
                                    borderRadius: '8px',
                                    border: '1px solid #bbf7d0'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#666',
                                        marginBottom: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>Captions ({captionHistory.filter(c => c.selected).length}/{captionHistory.length}):</span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: true })))} style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '10px', cursor: 'pointer' }}>All</button>
                                            <button onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: false })))} style={{ background: 'none', border: 'none', color: '#999', fontSize: '10px', cursor: 'pointer' }}>None</button>
                                            <button onClick={() => setCaptionHistory([])} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '10px', cursor: 'pointer' }}>Clear</button>
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        maxHeight: '100px',
                                        overflowY: 'auto',
                                        padding: '6px',
                                        backgroundColor: '#fff',
                                        borderRadius: '6px',
                                        border: '1px solid #e5e5e5',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '3px'
                                    }}>
                                        {captionHistory.map((caption, idx) => (
                                            <span
                                                key={idx}
                                                onClick={() => setCaptionHistory(prev => prev.map((c, i) => i === idx ? { ...c, selected: !c.selected } : c))}
                                                style={{
                                                    padding: '3px 6px',
                                                    borderRadius: '3px',
                                                    backgroundColor: caption.selected ? '#dcfce7' : '#f5f5f5',
                                                    color: caption.selected ? '#166534' : '#999',
                                                    cursor: 'pointer',
                                                    border: caption.selected ? '1px solid #86efac' : '1px solid #e5e5e5',
                                                    textDecoration: caption.selected ? 'none' : 'line-through'
                                                }}
                                            >
                                                {caption.text}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                                        <input
                                            type="date"
                                            value={youglishSaveDate}
                                            onChange={(e) => setYouglishSaveDate(e.target.value)}
                                            style={{
                                                flex: '0 0 auto',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                border: '1px solid #e5e5e5',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <button
                                            onClick={saveSelectedCaptions}
                                            disabled={savingPhrase || captionHistory.filter(c => c.selected).length === 0}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: captionHistory.filter(c => c.selected).length === 0 ? '#e5e5e5' : '#D4AF37',
                                                color: captionHistory.filter(c => c.selected).length === 0 ? '#999' : '#000',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: savingPhrase || captionHistory.filter(c => c.selected).length === 0 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {savingPhrase ? 'Saving...' : 'Add to phrases'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Resize Handle */}
                    {!playerFullscreen && !playerMinimized && (
                        <div
                            onMouseDown={handleResizeStart}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: '20px',
                                height: '20px',
                                cursor: 'se-resize',
                                background: 'linear-gradient(135deg, transparent 50%, #ccc 50%)',
                                borderRadius: '0 0 12px 0',
                            }}
                        />
                    )}
                </div>
            )}

            {/* Edit Phrase Modal */}
            {editingPhrase && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}
                    onClick={() => setEditingPhrase(null)}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '20px',
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px', color: '#1a1a1a' }}>
                            Edit Phrase
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>English</label>
                            <textarea
                                value={editingPhrase.english}
                                onChange={(e) => setEditingPhrase({ ...editingPhrase, english: e.target.value })}
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #e5e5e5',
                                    borderRadius: '12px',
                                    fontSize: '17px',
                                    lineHeight: '1.6',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.2s',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                            />
                        </div>
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>Japanese</label>
                            <textarea
                                value={editingPhrase.japanese}
                                onChange={(e) => setEditingPhrase({ ...editingPhrase, japanese: e.target.value })}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #e5e5e5',
                                    borderRadius: '12px',
                                    fontSize: '17px',
                                    lineHeight: '1.6',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.2s',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setEditingPhrase(null)}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    backgroundColor: '#f5f5f5',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    color: '#666',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditPhrase}
                                disabled={editSaving || !editingPhrase.english.trim()}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    backgroundColor: !editingPhrase.english.trim() ? '#ccc' : '#3B82F6',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    cursor: !editingPhrase.english.trim() ? 'not-allowed' : 'pointer',
                                    color: '#fff',
                                    fontWeight: '700',
                                    boxShadow: !editingPhrase.english.trim() ? 'none' : '0 4px 16px rgba(59,130,246,0.3)',
                                }}
                            >
                                {editSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vocabulary Save Modal */}
            {showVocabModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1002,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Save to Vocabulary</h3>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
                            >
                                x
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Example Sentence</label>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.5'
                            }}>
                                {vocabExample}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Date</label>
                            <input
                                type="date"
                                value={vocabDate}
                                onChange={(e) => setVocabDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Word / Phrase to Learn *</label>
                            <input
                                type="text"
                                value={vocabWord}
                                onChange={(e) => setVocabWord(e.target.value)}
                                placeholder="e.g., rabbit hole, get the hang of"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Type</label>
                            <select
                                value={vocabType}
                                onChange={(e) => setVocabType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="word">Word</option>
                                <option value="idiom">Idiom</option>
                                <option value="phrasal verb">Phrasal Verb</option>
                                <option value="slang">Slang</option>
                                <option value="expression">Expression</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Meaning (Japanese) *</label>
                            <input
                                type="text"
                                value={vocabMeaning}
                                onChange={(e) => setVocabMeaning(e.target.value)}
                                placeholder="e.g., 深みにはまる、コツをつかむ"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: '#f5f5f5',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveToVocabulary}
                                disabled={vocabSaving || !vocabWord.trim() || !vocabMeaning.trim()}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: (!vocabWord.trim() || !vocabMeaning.trim()) ? '#ccc' : '#10B981',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: (!vocabWord.trim() || !vocabMeaning.trim()) ? 'not-allowed' : 'pointer',
                                    color: '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                {vocabSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
