'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ELEMENT_COLORS, ELEMENT_LABELS, calcBstTotal, getBstTier } from '@/data/english/elements';
import { ElementBadge } from '@/components/english/ElementIcon';

// ── Types ────────────────────────────────────────
type Suit = 'spade' | 'heart' | 'diamond' | 'club';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface EnglishPhrase { id: string; english: string; japanese: string; element: string; }

type CardRank = 'NORMAL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'HOLOGRAPHIC' | 'LEGENDARY';

interface Card {
    suit: Suit; rank: Rank; faceUp: boolean; phrase: EnglishPhrase | null;
    chakra: number; bstTier: string; bstTotal: number; flexed: number;
    sp: number; cardRank: CardRank;
}

type Phase = 'loading' | 'bet' | 'player' | 'result' | 'joker-pick' | 'run-end';
type Result = 'win' | 'lose' | 'push' | 'blackjack' | 'bust';

interface Joker {
    id: string; name: string; ja: string; desc: string; color: string;
    rarity: 'common' | 'uncommon' | 'rare';
}

interface RunState {
    round: number;
    spEarned: number;
    jokers: Joker[];
    bestRound: number;
}

// ── Constants ────────────────────────────────────
const SUITS: Suit[] = ['spade', 'heart', 'diamond', 'club'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUIT_SYMBOLS: Record<Suit, string> = { spade: '\u2660', heart: '\u2665', diamond: '\u2666', club: '\u2663' };
const SUIT_COLORS: Record<Suit, string> = { spade: '#1C1917', heart: '#DC2626', diamond: '#DC2626', club: '#1C1917' };
const BET_OPTIONS = [10, 25, 50, 100];
const CHAKRA_JA = ['種', '芽', '鍛', '得', '声', '研', '極'];
const CHAKRA_NAMES = ['SEED', 'SPARK', 'FORGE', 'OWN', 'VOICE', 'VISION', 'CROWN'];
const CHAKRA_COLORS = ['#B91C1C', '#C2410C', '#A16207', '#166534', '#1E40AF', '#3730A3', '#6B21A8'];

// ── Card Rank (SP-based) ────────────────────────
interface RankConfig { rank: CardRank; threshold: number; borderColor: string; label: string; }
const CARD_RANKS: RankConfig[] = [
    { rank: 'LEGENDARY', threshold: 250, borderColor: '#D4AF37', label: 'LEGENDARY' },
    { rank: 'HOLOGRAPHIC', threshold: 100, borderColor: '#A855F7', label: 'HOLO' },
    { rank: 'GOLD', threshold: 50, borderColor: '#F6C85F', label: 'GOLD' },
    { rank: 'SILVER', threshold: 20, borderColor: '#94A3B8', label: 'SILVER' },
    { rank: 'BRONZE', threshold: 5, borderColor: '#CD7F32', label: 'BRONZE' },
    { rank: 'NORMAL', threshold: 0, borderColor: '#D6D3D1', label: 'NORMAL' },
];
function getCardRank(points: number): RankConfig {
    for (const r of CARD_RANKS) { if (points >= r.threshold) return r; }
    return CARD_RANKS[CARD_RANKS.length - 1];
}

// ── Card Frame Visuals ──────────────────────────
function getCardFrame(rank: CardRank): { border: string; borderRadius: string; background: string; backgroundColor: string } {
    const br = '6px';
    switch (rank) {
        case 'NORMAL': return { border: '4px solid #E7E5E4', borderRadius: br, background: '', backgroundColor: '#FAFAF9' };
        case 'BRONZE': return { border: '4px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(#FFFBF5, #FFFBF5) padding-box, linear-gradient(135deg, #CD7F32 0%, #E8B87A 30%, #CD7F32 60%, #A0622E 100%) border-box' };
        case 'SILVER': return { border: '4px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(#F8FAFB, #F8FAFB) padding-box, linear-gradient(135deg, #e2e8f0 0%, #ffffff 40%, #cbd5e1 60%, #94a3b8 100%) border-box' };
        case 'GOLD': return { border: '4px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(180deg, #FFFEF5 0%, #FFFBEB 100%) padding-box, linear-gradient(135deg, #D4AF37 0%, #FFF2A8 25%, #F6C85F 50%, #D4AF37 75%, #B8941E 100%) border-box' };
        case 'HOLOGRAPHIC': return { border: '4px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E0E7FF 100%) padding-box, linear-gradient(135deg, #E879F9 0%, #A855F7 25%, #6366F1 50%, #3B82F6 75%, #06B6D4 100%) border-box' };
        case 'LEGENDARY': return { border: '4px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(135deg, #1C1917 0%, #2D2438 50%, #1c1813 100%) padding-box, linear-gradient(135deg, #18181B 0%, #A855F7 40%, #D4AF37 60%, #18181B 100%) border-box' };
    }
}
function getCardShadow(rank: CardRank): string {
    switch (rank) {
        case 'NORMAL': return '0 2px 8px rgba(0,0,0,0.06)';
        case 'BRONZE': return '0 3px 10px rgba(205,127,50,0.15)';
        case 'SILVER': return '0 3px 12px rgba(148,163,184,0.2)';
        case 'GOLD': return '0 4px 16px rgba(212,175,55,0.3)';
        case 'HOLOGRAPHIC': return '0 4px 20px rgba(168,85,247,0.25)';
        case 'LEGENDARY': return '0 6px 24px rgba(0,0,0,0.4), 0 0 12px rgba(212,175,55,0.3)';
    }
}
function getCardWindowBg(rank: CardRank): string {
    switch (rank) {
        case 'NORMAL': return '#F5F5F4';
        case 'BRONZE': return 'linear-gradient(180deg, #FDF8F0, #FAF0E4)';
        case 'SILVER': return 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)';
        case 'GOLD': return 'radial-gradient(ellipse at top, #FFFBEB, #FFF3CC 100%)';
        case 'HOLOGRAPHIC': return 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243,232,255,0.8))';
        case 'LEGENDARY': return 'radial-gradient(circle at center, #2D2438 0%, #181A1B 100%)';
    }
}
function getFrameAccent(rank: CardRank): string {
    switch (rank) {
        case 'NORMAL': return '#E7E5E4'; case 'BRONZE': return '#CD7F32'; case 'SILVER': return '#94A3B8';
        case 'GOLD': return '#D4AF37'; case 'HOLOGRAPHIC': return '#A855F7'; case 'LEGENDARY': return '#D4AF37';
    }
}

// ── Joker Pool ───────────────────────────────────
const ALL_JOKERS: Joker[] = [
    { id: 'hot-hand', name: 'HOT HAND', ja: '灼熱の手', desc: 'All card values +1', color: '#EF4444', rarity: 'common' },
    { id: 'rubber', name: 'RUBBER', ja: 'ゴムの壁', desc: 'Bust threshold 22 (not 21)', color: '#F97316', rarity: 'common' },
    { id: 'eagle-eye', name: 'EAGLE EYE', ja: '鷹の目', desc: 'Always see dealer hole card', color: '#3B82F6', rarity: 'uncommon' },
    { id: 'phoenix', name: 'PHOENIX', ja: '不死鳥', desc: 'Extra revive each hand', color: '#DC2626', rarity: 'uncommon' },
    { id: 'gold-rush', name: 'GOLD RUSH', ja: 'ゴールドラッシュ', desc: 'SP payout x1.5', color: '#D4AF37', rarity: 'uncommon' },
    { id: 'thick-skin', name: 'THICK SKIN', ja: '鉄壁', desc: 'Dealer needs +2 to beat you', color: '#78716C', rarity: 'common' },
    { id: 'lucky-7', name: 'LUCKY 7', ja: 'ラッキーセブン', desc: 'All 7s become wild (value 1-11)', color: '#8B5CF6', rarity: 'rare' },
    { id: 'element-master', name: 'ELEMENT MASTER', ja: '属性マスター', desc: 'All cards count as same element', color: '#10B981', rarity: 'uncommon' },
    { id: 'card-counter', name: 'CARD COUNTER', ja: 'カウンター', desc: 'See next card in deck', color: '#06B6D4', rarity: 'rare' },
    { id: 'double-or-nothing', name: 'DOUBLE', ja: '倍賭け', desc: 'All wins pay x2', color: '#A855F7', rarity: 'rare' },
    { id: 'cushion', name: 'CUSHION', ja: 'クッション', desc: 'Push counts as a win', color: '#14B8A6', rarity: 'common' },
    { id: 'intimidate', name: 'INTIMIDATE', ja: '威圧', desc: 'Dealer stands 1 lower', color: '#1C1917', rarity: 'uncommon' },
];

function getRandomJokers(owned: string[], count: number): Joker[] {
    const available = ALL_JOKERS.filter(j => !owned.includes(j.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ── Difficulty ───────────────────────────────────
function getDealerBuff(round: number, jokers: Joker[]): { standOn: number; bonus: number } {
    let standOn = 17;
    let bonus = 0;
    if (round >= 4) standOn = 18;
    if (round >= 10) standOn = 19;
    if (round >= 7) bonus = 1;
    if (round >= 13) bonus = 2;
    // Intimidate joker: dealer stands 1 lower
    if (jokers.some(j => j.id === 'intimidate')) standOn = Math.max(15, standOn - 1);
    return { standOn, bonus };
}

// ── Helpers ──────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function createDeck(phrases: EnglishPhrase[], mst: Record<string, number>, pts: Record<string, number>): Card[] {
    const deck: Card[] = [];
    const sh = shuffle(phrases);
    let pi = 0;
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            const p = sh[pi] || null;
            const ch = p ? Math.min(mst[p.id] || 0, 6) : 0;
            const bst = p ? calcBstTotal(p.id) : 0;
            const bt = p ? getBstTier(bst) : getBstTier(0);
            const cardSp = p ? (pts[p.id] || 0) : 0;
            const cr = getCardRank(cardSp);
            deck.push({ suit, rank, faceUp: true, phrase: p, chakra: ch, bstTier: bt.tier, bstTotal: bst, flexed: 0, sp: cardSp, cardRank: cr.rank });
            pi++;
        }
    }
    return shuffle(deck);
}

function baseCardValue(rank: Rank): number {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
}

function cardValue(card: Card, jokers: Joker[]): number {
    // Lucky 7: wild card
    if (card.rank === '7' && jokers.some(j => j.id === 'lucky-7')) {
        // For display, show base + flex, but actual value is flexible
        // We'll handle this in hand calculation
    }
    let base = baseCardValue(card.rank);
    // Hot hand: +1
    if (jokers.some(j => j.id === 'hot-hand')) base += 1;
    return Math.max(1, Math.min(11, base + card.flexed));
}

function handTotal(cards: Card[], countHidden: boolean, jokers: Joker[], dealerBonus = 0): number {
    let total = 0, aces = 0;
    for (const c of cards) {
        if (!c.faceUp && !countHidden) continue;
        const v = cardValue(c, jokers);
        total += v;
        if (c.rank === 'A' && c.flexed === 0) aces++;
    }
    total += dealerBonus;
    const bustLimit = jokers.some(j => j.id === 'rubber') ? 22 : 21;
    while (total > bustLimit && aces > 0) { total -= 10; aces--; }
    return total;
}

function isBust(total: number, jokers: Joker[]): boolean {
    return total > (jokers.some(j => j.id === 'rubber') ? 22 : 21);
}

function isBlackjack(cards: Card[], jokers: Joker[]): boolean {
    return cards.length === 2 && handTotal(cards, true, jokers) === 21;
}

// ── Active Cheats ────────────────────────────────
function detectCheats(hand: Card[], jokers: Joker[]) {
    const hasPeek = hand.some(c => c.faceUp && c.chakra >= 3) || jokers.some(j => j.id === 'eagle-eye');
    const flexCards = hand.filter(c => c.faceUp && (c.bstTier === 'S' || c.bstTier === 'A'));
    const elements = hand.filter(c => c.faceUp && c.phrase).map(c => c.phrase!.element);
    const elCounts: Record<string, number> = {};
    elements.forEach(e => { elCounts[e] = (elCounts[e] || 0) + 1; });
    const hasCombo = Object.values(elCounts).some(v => v >= 2) || jokers.some(j => j.id === 'element-master');
    const hasRevive = hand.some(c => c.faceUp && c.chakra >= 5) || jokers.some(j => j.id === 'phoenix');
    const hasBjBoost = hand.some(c => c.faceUp && c.bstTier === 'S');
    const hasCardCounter = jokers.some(j => j.id === 'card-counter');
    return { peek: hasPeek, flexCards, combo: hasCombo, revive: hasRevive, bjBoost: hasBjBoost, cardCounter: hasCardCounter, reviveUsed: false };
}

// ── PlayingCard (Collection Card Style) ─────────
function PlayingCard({ card, delay = 0, peekMode = false, onFlex, jokers = [] }: {
    card: Card; delay?: number; peekMode?: boolean;
    onFlex?: (d: number) => void; jokers?: Joker[];
}) {
    const showFace = card.faceUp || peekMode;
    const isPeek = !card.faceUp && peekMode;

    if (!showFace) {
        return (
            <div style={{
                width: '120px', height: '180px', borderRadius: '8px',
                border: '4px solid #334155',
                background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 8px), linear-gradient(135deg, #1E3A5F, #1E40AF 50%, #1E3A5F)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                animation: `cd 0.3s ease-out ${delay}s both`,
                flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
                <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.15)', fontWeight: '900' }}>?</span>
            </div>
        );
    }

    const rank = card.cardRank;
    const isLegendary = rank === 'LEGENDARY';
    const isHolo = rank === 'HOLOGRAPHIC' || isLegendary;
    const isTextLight = isLegendary;
    const frame = getCardFrame(rank);
    const shadow = getCardShadow(rank);
    const accent = getFrameAccent(rank);
    const rankCfg = getCardRank(card.sp);

    const suitColor = SUIT_COLORS[card.suit];
    const sym = SUIT_SYMBOLS[card.suit];
    const val = cardValue(card, jokers);
    const canFlex = onFlex && (card.bstTier === 'S' || card.bstTier === 'A');
    const chakraColor = CHAKRA_COLORS[card.chakra] || CHAKRA_COLORS[0];

    return (
        <div style={{
            width: '120px', height: '180px', position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            ...frame,
            boxShadow: isPeek ? `0 0 12px rgba(59,130,246,0.3), ${shadow}` : shadow,
            padding: '3px',
            animation: `cd 0.3s ease-out ${delay}s both`, flexShrink: 0,
            ...(canFlex ? { outline: '2px solid #A855F730' } : {}),
            ...(isLegendary ? { animation: `cd 0.3s ease-out ${delay}s both, card-legendary-aura 4s ease-in-out infinite` } : {}),
            ...(rank === 'GOLD' ? { animation: `cd 0.3s ease-out ${delay}s both, card-gold-pulse 5s ease-in-out infinite` } : {}),
        }}>
            {/* Holo shimmer overlay */}
            {isHolo && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: isLegendary
                        ? 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(168,85,247,0.15) 50%, rgba(212,175,55,0.12) 100%)'
                        : 'linear-gradient(135deg, rgba(232,121,249,0.1) 0%, rgba(99,102,241,0.1) 33%, rgba(59,130,246,0.1) 66%, rgba(16,185,129,0.1) 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'card-holo-shimmer 3s linear infinite',
                    borderRadius: '3px', pointerEvents: 'none', zIndex: 4,
                    mixBlendMode: 'overlay',
                }} />
            )}

            {/* Legendary particles */}
            {isLegendary && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', width: `${2 + (i % 2)}px`, height: `${2 + (i % 2)}px`,
                    borderRadius: '50%', background: i % 2 === 0 ? '#D4AF37' : '#A855F7',
                    left: `${10 + (i * 15) % 80}%`, top: `${10 + (i * 17) % 75}%`,
                    animation: `card-particle-float ${2 + (i % 2)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`, opacity: 0.6, zIndex: 6, pointerEvents: 'none',
                }} />
            ))}

            {isPeek && <div style={{ position: 'absolute', top: 2, right: 2, zIndex: 10, padding: '1px 4px', borderRadius: '3px', backgroundColor: '#3B82F6', color: '#fff', fontSize: '6px', fontWeight: '800' }}>PEEK</div>}

            {/* Trump badge (top-left corner) */}
            <div style={{
                position: 'absolute', top: 2, left: 2, zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                backgroundColor: isTextLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)',
                borderRadius: '4px', padding: '2px 4px', lineHeight: 1,
                backdropFilter: 'blur(4px)',
                border: `1px solid ${isTextLight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
            }}>
                <span style={{ fontSize: '13px', fontWeight: '900', color: suitColor, lineHeight: 1 }}>{card.rank}</span>
                <span style={{ fontSize: '8px', color: suitColor, lineHeight: 1 }}>{sym}</span>
            </div>

            {/* Value badge (top-right) */}
            <div style={{
                position: 'absolute', top: 2, right: isPeek ? 28 : 2, zIndex: 10,
                display: 'flex', alignItems: 'center', gap: '1px',
            }}>
                {canFlex ? (
                    <>
                        <button onClick={e => { e.stopPropagation(); onFlex(-1); }} style={{
                            width: '12px', height: '12px', borderRadius: '3px', border: '1px solid #A855F7',
                            backgroundColor: '#FAF5FF', color: '#A855F7', fontSize: '8px', fontWeight: '900',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                        }}>-</button>
                        <span style={{
                            fontSize: '11px', fontWeight: '900', minWidth: '14px', textAlign: 'center',
                            color: card.flexed !== 0 ? '#A855F7' : (isTextLight ? '#FAFAF9' : '#1C1917'),
                            backgroundColor: isTextLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)',
                            borderRadius: '3px', padding: '1px 3px',
                        }}>{val}</span>
                        <button onClick={e => { e.stopPropagation(); onFlex(1); }} style={{
                            width: '12px', height: '12px', borderRadius: '3px', border: '1px solid #A855F7',
                            backgroundColor: '#FAF5FF', color: '#A855F7', fontSize: '8px', fontWeight: '900',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                        }}>+</button>
                    </>
                ) : (
                    <span style={{
                        fontSize: '9px', fontWeight: '700', padding: '2px 4px', borderRadius: '3px',
                        backgroundColor: isTextLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)',
                        color: isTextLight ? '#FAFAF9' : '#78716C',
                        border: `1px solid ${isTextLight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
                    }}>
                        {card.rank === 'A' && card.flexed === 0 ? '1/11' : val}
                    </span>
                )}
            </div>

            {/* Top bar: element + SP */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '2px 4px', paddingLeft: '28px',
                backgroundColor: isTextLight ? 'rgba(255,255,255,0.06)' : `${accent}12`,
                borderRadius: '4px 4px 0 0',
                borderBottom: `1px solid ${isTextLight ? 'rgba(255,255,255,0.1)' : accent + '30'}`,
                position: 'relative', zIndex: 7, minHeight: '18px',
            }}>
                {card.phrase && <ElementBadge element={card.phrase.element} size={8} />}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '900', color: rank !== 'NORMAL' ? rankCfg.borderColor : '#A8A29E', fontVariantNumeric: 'tabular-nums' }}>{card.sp}</span>
                    <span style={{ fontSize: '6px', fontWeight: '700', color: isTextLight ? 'rgba(255,255,255,0.4)' : '#A8A29E' }}>SP</span>
                </div>
            </div>

            {/* Center: phrase */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                background: getCardWindowBg(rank), borderRadius: '4px',
                border: `1px solid ${isTextLight ? 'rgba(255,255,255,0.08)' : accent + '25'}`,
                margin: '2px 0', padding: '6px 4px', textAlign: 'center',
                position: 'relative', zIndex: 7, overflow: 'hidden',
            }}>
                {/* Texture per rank */}
                {rank === 'BRONZE' && <div style={{ position: 'absolute', inset: 0, opacity: 0.04, background: 'repeating-linear-gradient(45deg, #CD7F32, #CD7F32 1px, transparent 1px, transparent 10px)', pointerEvents: 'none' }} />}
                {rank === 'SILVER' && <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'repeating-linear-gradient(-45deg, #94A3B8, #94A3B8 1px, transparent 1px, transparent 12px)', pointerEvents: 'none' }} />}
                {rank === 'GOLD' && <div style={{ position: 'absolute', inset: 0, opacity: 0.03, background: 'radial-gradient(circle at 30% 40%, #D4AF37 0.5px, transparent 0.5px)', backgroundSize: '14px 14px', pointerEvents: 'none' }} />}

                {card.phrase ? (
                    <>
                        <div style={{
                            fontSize: '10px', fontWeight: '800', lineHeight: 1.3, marginBottom: '2px', wordBreak: 'break-word',
                            color: isTextLight ? '#FAFAF9' : '#1C1917',
                            textShadow: isTextLight ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
                            position: 'relative',
                        }}>
                            {card.phrase.english}
                        </div>
                        <div style={{
                            fontSize: '8px', lineHeight: 1.3, position: 'relative',
                            color: isTextLight ? 'rgba(255,255,255,0.5)' : '#78716C',
                        }}>
                            {card.phrase.japanese}
                        </div>
                    </>
                ) : (
                    <span style={{ fontSize: '24px', color: suitColor, opacity: 0.1 }}>{sym}</span>
                )}
            </div>

            {/* Bottom bar: rank label + chakra + BST */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '2px 4px',
                backgroundColor: isTextLight ? 'rgba(255,255,255,0.04)' : `${accent}08`,
                borderRadius: '0 0 4px 4px',
                borderTop: `1px solid ${isTextLight ? 'rgba(255,255,255,0.08)' : accent + '20'}`,
                position: 'relative', zIndex: 7,
            }}>
                <span style={{ fontSize: '6px', fontWeight: '700', color: isTextLight ? 'rgba(255,255,255,0.35)' : '#A8A29E', letterSpacing: '0.5px' }}>
                    {rankCfg.label}
                </span>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '1px',
                    padding: '0px 3px', borderRadius: '3px',
                    backgroundColor: chakraColor + (isTextLight ? '30' : '12'),
                    border: `1px solid ${chakraColor}${isTextLight ? '50' : '25'}`,
                }}>
                    <span style={{ fontSize: '7px', fontWeight: '900', color: chakraColor, lineHeight: 1 }}>{CHAKRA_JA[card.chakra]}</span>
                    <span style={{ fontSize: '5px', fontWeight: '700', color: chakraColor, opacity: 0.7 }}>{CHAKRA_NAMES[card.chakra]}</span>
                </span>
                <span style={{ fontSize: '6px', fontWeight: '800', color: card.bstTier === 'S' ? '#D4AF37' : card.bstTier === 'A' ? '#A855F7' : (isTextLight ? 'rgba(255,255,255,0.35)' : '#A8A29E') }}>
                    {card.bstTier}
                </span>
            </div>
        </div>
    );
}

// ── Joker Card ───────────────────────────────────
function JokerCard({ joker, onClick, small = false }: { joker: Joker; onClick?: () => void; small?: boolean }) {
    const rarityBorder = joker.rarity === 'rare' ? '#D4AF37' : joker.rarity === 'uncommon' ? '#A855F7' : '#78716C';
    return (
        <div onClick={onClick} style={{
            width: small ? '80px' : '160px', padding: small ? '8px' : '16px',
            borderRadius: small ? '8px' : '12px',
            border: `2px solid ${rarityBorder}`,
            backgroundColor: joker.color + '08',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'all 0.2s',
            textAlign: 'center',
            ...(onClick ? { boxShadow: `0 4px 16px ${joker.color}20` } : {}),
        }}>
            <div style={{ fontSize: small ? '8px' : '10px', fontWeight: '800', color: rarityBorder, letterSpacing: '0.5px', marginBottom: small ? '2px' : '4px' }}>
                {joker.rarity.toUpperCase()}
            </div>
            <div style={{ fontSize: small ? '10px' : '14px', fontWeight: '900', color: joker.color, marginBottom: small ? '2px' : '6px' }}>
                {joker.name}
            </div>
            {!small && <div style={{ fontSize: '12px', color: '#57534E', marginBottom: '4px' }}>{joker.ja}</div>}
            <div style={{ fontSize: small ? '7px' : '11px', color: '#78716C', lineHeight: 1.4 }}>{joker.desc}</div>
        </div>
    );
}

// ── BJ Effect ────────────────────────────────────
function BJEffect() {
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, animation: 'bjf 1.5s ease-out forwards' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent 70%)', animation: 'bjp 0.8s ease-out' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '120px', fontWeight: '900', color: '#D4AF37', textShadow: '0 4px 20px rgba(212,175,55,0.5)', animation: 'bjn 1.5s ease-out forwards', lineHeight: 1 }}>21</div>
            {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', top: '50%', left: '50%', width: '5px', height: '5px', borderRadius: '50%',
                    backgroundColor: i % 2 === 0 ? '#D4AF37' : '#FDE68A',
                    animation: `bjr 0.8s ease-out ${i * 0.04}s forwards`,
                    '--a': `${(i / 16) * 360}deg`, '--d': `${80 + Math.random() * 100}px`,
                } as React.CSSProperties} />
            ))}
        </div>
    );
}

// ── Main ─────────────────────────────────────────
export default function BlackjackPage() {
    const [phrases, setPhrases] = useState<EnglishPhrase[]>([]);
    const [mst, setMst] = useState<Record<string, number>>({});
    const [cardPts, setCardPts] = useState<Record<string, number>>({});
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [phase, setPhase] = useState<Phase>('loading');
    const [result, setResult] = useState<Result | null>(null);
    const [sp, setSp] = useState(0);
    const [initialSp, setInitialSp] = useState(0);
    const [bet, setBet] = useState(0);
    const [msg, setMsg] = useState('');
    const [run, setRun] = useState<RunState>({ round: 0, spEarned: 0, jokers: [], bestRound: 0 });
    const [showBj, setShowBj] = useState(false);
    const [cheats, setCheats] = useState({ peek: false, flexCards: [] as Card[], combo: false, revive: false, bjBoost: false, cardCounter: false, reviveUsed: false });
    const [jokerChoices, setJokerChoices] = useState<Joker[]>([]);
    const [nextCard, setNextCard] = useState<Card | null>(null);
    const [historicalBest, setHistoricalBest] = useState(0);
    const [seenPhrases, setSeenPhrases] = useState<EnglishPhrase[]>([]);

    // Load
    useEffect(() => {
        const saved = localStorage.getItem('bj-best-round');
        if (saved) setHistoricalBest(parseInt(saved));
        Promise.all([
            fetch('/api/phrases').then(r => r.json()),
            fetch('/api/phrases/mastery').then(r => r.json()),
        ]).then(([pRes, mRes]) => {
            if (pRes.success && pRes.phrases) {
                setPhrases(pRes.phrases.map((p: { id: string; english: string; japanese: string; category: string }) => ({
                    id: p.id, english: p.english, japanese: p.japanese, element: p.category || 'flame',
                })));
            }
            if (mRes.success) {
                const pts = mRes.cardPoints as Record<string, number> || {};
                const t = Object.values(pts).reduce((s: number, v: number) => s + v, 0);
                setSp(t); setInitialSp(t);
                setMst(mRes.mastery || {});
                setCardPts(pts);
            }
            setPhase('bet');
        }).catch(() => setPhase('bet'));
    }, []);

    const trackSeen = useCallback((cards: Card[]) => {
        const ns = cards.filter(c => c.faceUp && c.phrase).map(c => c.phrase!);
        setSeenPhrases(prev => { const ids = new Set(prev.map(p => p.id)); return [...prev, ...ns.filter(p => !ids.has(p.id))]; });
    }, []);

    // ── Start round (within run) ─────────────────
    const startRound = useCallback((betAmount: number) => {
        if (betAmount > sp) return;
        const newRound = run.round + 1;
        const newDeck = createDeck(phrases, mst, cardPts);
        const p1 = newDeck.pop()!; const d1 = { ...newDeck.pop()!, faceUp: true };
        const p2 = newDeck.pop()!; const d2 = { ...newDeck.pop()!, faceUp: false };
        const pH = [p1, p2]; const dH = [d1, d2];

        setBet(betAmount);
        setSp(prev => prev - betAmount);
        setDeck(newDeck);
        setPlayerHand(pH); setDealerHand(dH);
        setResult(null); setMsg(''); setSeenPhrases([]);
        setRun(r => ({ ...r, round: newRound }));
        trackSeen([p1, p2, d1]);

        // Next card preview
        if (run.jokers.some(j => j.id === 'card-counter') && newDeck.length > 0) {
            setNextCard(newDeck[newDeck.length - 1]);
        } else {
            setNextCard(null);
        }

        const ch = detectCheats(pH, run.jokers);
        setCheats(ch);

        if (isBlackjack(pH, run.jokers)) {
            d2.faceUp = true; setDealerHand([d1, d2]); trackSeen([d2]);
            if (isBlackjack([d1, d2], run.jokers)) {
                // Push on double BJ - cushion joker check
                if (run.jokers.some(j => j.id === 'cushion')) {
                    setResult('win'); setMsg('Both BJ but CUSHION saves!');
                    const payout = betAmount * 2;
                    setSp(prev => prev + payout);
                    setRun(r => ({ ...r, spEarned: r.spEarned + betAmount }));
                } else {
                    setResult('push'); setMsg('Both Blackjack -- Push');
                    setSp(prev => prev + betAmount);
                }
            } else {
                const mult = ch.bjBoost ? 3 : 1.5;
                const goldRush = run.jokers.some(j => j.id === 'gold-rush') ? 1.5 : 1;
                const dbl = run.jokers.some(j => j.id === 'double-or-nothing') ? 2 : 1;
                const payout = Math.floor(betAmount * (1 + mult) * goldRush * dbl);
                setResult('blackjack');
                setMsg(ch.bjBoost ? 'BLACKJACK! S-BOOST!' : 'BLACKJACK!');
                setSp(prev => prev + payout);
                setRun(r => ({ ...r, spEarned: r.spEarned + payout - betAmount }));
                setShowBj(true); setTimeout(() => setShowBj(false), 1500);
            }
            setPhase('result');
            return;
        }
        setPhase('player');
    }, [sp, phrases, mst, cardPts, trackSeen, run]);

    // ── Start a new run ──────────────────────────
    const startNewRun = useCallback((betAmount: number) => {
        setRun({ round: 0, spEarned: 0, jokers: [], bestRound: historicalBest });
        startRound(betAmount);
    }, [historicalBest, startRound]);

    // ── Flex ─────────────────────────────────────
    const flexCard = useCallback((idx: number, delta: number) => {
        if (phase !== 'player') return;
        setPlayerHand(prev => {
            const next = [...prev]; const c = { ...next[idx] };
            c.flexed = Math.max(-2, Math.min(2, c.flexed + delta));
            next[idx] = c; return next;
        });
    }, [phase]);

    // ── Hit ──────────────────────────────────────
    const hit = useCallback(() => {
        if (phase !== 'player' || deck.length === 0) return;
        const nd = [...deck]; const c = nd.pop()!;
        const nh = [...playerHand, c];
        setDeck(nd); setPlayerHand(nh); trackSeen([c]);

        // Update next card preview
        if (run.jokers.some(j => j.id === 'card-counter') && nd.length > 0) {
            setNextCard(nd[nd.length - 1]);
        } else { setNextCard(null); }

        const ch = detectCheats(nh, run.jokers);
        ch.reviveUsed = cheats.reviveUsed;
        setCheats(ch);

        const t = handTotal(nh, false, run.jokers);
        if (isBust(t, run.jokers)) {
            if (ch.revive && !ch.reviveUsed) {
                setPlayerHand(nh.slice(0, -1));
                ch.reviveUsed = true; setCheats({ ...ch });
                setMsg('REVIVE!');
                return;
            }
            const rv = dealerHand.map(c => ({ ...c, faceUp: true }));
            setDealerHand(rv); trackSeen(rv);
            setResult('bust'); setMsg('BUST...'); setPhase('result');
        }
    }, [phase, deck, playerHand, dealerHand, trackSeen, cheats, run.jokers]);

    // ── Stay ─────────────────────────────────────
    const stay = useCallback(() => {
        if (phase !== 'player') return;
        const { standOn, bonus } = getDealerBuff(run.round, run.jokers);
        const rv = dealerHand.map(c => ({ ...c, faceUp: true }));
        let cd = [...deck];
        while (handTotal(rv, true, run.jokers, bonus) < standOn && cd.length > 0) {
            rv.push(cd.pop()!);
        }
        setDeck(cd); setDealerHand(rv); trackSeen(rv);

        let pT = handTotal(playerHand, false, run.jokers);
        if (cheats.combo && !isBust(pT + 1, run.jokers)) pT += 1;
        const dT = handTotal(rv, true, run.jokers, bonus);

        const thickSkin = run.jokers.some(j => j.id === 'thick-skin');
        const goldRush = run.jokers.some(j => j.id === 'gold-rush') ? 1.5 : 1;
        const dbl = run.jokers.some(j => j.id === 'double-or-nothing') ? 2 : 1;
        const cushion = run.jokers.some(j => j.id === 'cushion');

        if (isBust(dT, run.jokers)) {
            const payout = Math.floor(bet * 2 * goldRush * dbl);
            setResult('win'); setMsg('Dealer bust!');
            setSp(prev => prev + payout);
            setRun(r => ({ ...r, spEarned: r.spEarned + payout - bet }));
        } else if (pT > dT) {
            const payout = Math.floor(bet * 2 * goldRush * dbl);
            setResult('win'); setMsg(cheats.combo ? `Win! (${pT} with +1)` : 'You win!');
            setSp(prev => prev + payout);
            setRun(r => ({ ...r, spEarned: r.spEarned + payout - bet }));
        } else if (pT < dT && thickSkin && dT - pT < 2) {
            // Thick skin: dealer needs +2 margin
            if (cushion) {
                const payout = Math.floor(bet * 2 * goldRush * dbl);
                setResult('win'); setMsg('THICK SKIN + CUSHION!');
                setSp(prev => prev + payout);
                setRun(r => ({ ...r, spEarned: r.spEarned + payout - bet }));
            } else {
                setResult('push'); setMsg('THICK SKIN! Push');
                setSp(prev => prev + bet);
            }
        } else if (pT === dT) {
            if (cushion) {
                const payout = Math.floor(bet * 2 * goldRush * dbl);
                setResult('win'); setMsg('CUSHION! Push -> Win');
                setSp(prev => prev + payout);
                setRun(r => ({ ...r, spEarned: r.spEarned + payout - bet }));
            } else {
                setResult('push'); setMsg('Push');
                setSp(prev => prev + bet);
            }
        } else {
            setResult('lose'); setMsg('Dealer wins...');
        }
        setPhase('result');
    }, [phase, dealerHand, deck, playerHand, bet, trackSeen, cheats, run]);

    // ── After result ─────────────────────────────
    const afterResult = useCallback(() => {
        if (result === 'win' || result === 'blackjack') {
            // Offer jokers
            const owned = run.jokers.map(j => j.id);
            const choices = getRandomJokers(owned, 3);
            if (choices.length > 0) {
                setJokerChoices(choices);
                setPhase('joker-pick');
            } else {
                // All jokers owned, continue
                startRound(bet);
            }
        } else if (result === 'push') {
            // Push: continue without joker
            startRound(bet);
        } else {
            // Lose: end run
            const best = Math.max(run.round, historicalBest);
            setHistoricalBest(best);
            localStorage.setItem('bj-best-round', String(best));
            setRun(r => ({ ...r, bestRound: best }));
            setPhase('run-end');
        }
    }, [result, run, bet, historicalBest, startRound]);

    const pickJoker = useCallback((joker: Joker) => {
        setRun(r => ({ ...r, jokers: [...r.jokers, joker] }));
        setJokerChoices([]);
        // Start next round with same bet
        setTimeout(() => startRound(bet), 300);
    }, [bet, startRound]);

    const skipJoker = useCallback(() => {
        setJokerChoices([]);
        setTimeout(() => startRound(bet), 300);
    }, [bet, startRound]);

    // ── Derived ──────────────────────────────────
    const pTotal = useMemo(() => {
        let t = handTotal(playerHand, false, run.jokers);
        if (cheats.combo && !isBust(t + 1, run.jokers)) t += 1;
        return t;
    }, [playerHand, run.jokers, cheats]);

    const dTotal = useMemo(() => {
        if (phase === 'result' || phase === 'run-end') {
            const { bonus } = getDealerBuff(run.round, run.jokers);
            return handTotal(dealerHand, true, run.jokers, bonus);
        }
        return handTotal(dealerHand, false, run.jokers);
    }, [dealerHand, phase, run]);

    const spDiff = sp - initialSp;
    const rColor = result === 'win' || result === 'blackjack' ? '#16A34A' : result === 'lose' || result === 'bust' ? '#DC2626' : '#A8A29E';
    const { standOn, bonus } = getDealerBuff(run.round, run.jokers);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9', padding: '20px' }}>
            <style>{`
                @keyframes cd { from { opacity:0; transform:translateY(-20px) scale(0.9); } to { opacity:1; transform:translateY(0) scale(1); } }
                @keyframes rp { 0% { transform:scale(0.8); opacity:0; } 60% { transform:scale(1.05); } 100% { transform:scale(1); opacity:1; } }
                @keyframes bjf { 0%{opacity:1} 100%{opacity:0} }
                @keyframes bjp { 0%{transform:scale(0.5);opacity:0} 50%{opacity:1} 100%{transform:scale(2);opacity:0} }
                @keyframes bjn { 0%{transform:translate(-50%,-50%) scale(0.3);opacity:0} 30%{transform:translate(-50%,-50%) scale(1.1);opacity:1} 100%{transform:translate(-50%,-50%) scale(1.3);opacity:0} }
                @keyframes bjr { 0%{transform:translate(-50%,-50%) rotate(var(--a)) translateX(0) scale(1);opacity:1} 100%{transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--d)) scale(0);opacity:0} }
                @keyframes sg { 0%,100%{text-shadow:0 0 8px rgba(212,175,55,0.4)} 50%{text-shadow:0 0 20px rgba(212,175,55,0.7)} }
                @keyframes jp { 0%{transform:scale(0.9);opacity:0} 100%{transform:scale(1);opacity:1} }
                @keyframes card-holo-shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 200%} }
                @keyframes card-legendary-aura { 0%,100%{box-shadow:0 6px 24px rgba(0,0,0,0.4),0 0 12px rgba(212,175,55,0.3)} 50%{box-shadow:0 6px 32px rgba(0,0,0,0.5),0 0 20px rgba(168,85,247,0.4)} }
                @keyframes card-gold-pulse { 0%,100%{box-shadow:0 4px 16px rgba(212,175,55,0.3)} 50%{box-shadow:0 4px 24px rgba(212,175,55,0.45)} }
                @keyframes card-particle-float { 0%,100%{transform:translateY(0) scale(1);opacity:0.6} 50%{transform:translateY(-6px) scale(1.3);opacity:0.9} }
            `}</style>

            {showBj && <BJEffect />}

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Header */}
                <Link href="/english/arena" style={{ fontSize: '12px', color: '#A8A29E', textDecoration: 'none', display: 'inline-block', marginBottom: '12px' }}>arena</Link>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1C1917', marginBottom: '2px' }}>Ikasama Blackjack</h1>
                <p style={{ fontSize: '12px', color: '#78716C', marginBottom: '16px' }}>Roguelike run. Collect jokers. How far can you go?</p>

                {/* SP + Round */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #F6C85F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', color: '#fff' }}>SP</div>
                        <div>
                            <div style={{ fontSize: '20px', fontWeight: '900', color: '#1C1917', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{sp.toLocaleString()}</div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: spDiff > 0 ? '#16A34A' : spDiff < 0 ? '#DC2626' : '#A8A29E' }}>{spDiff > 0 ? `+${spDiff}` : spDiff < 0 ? `${spDiff}` : 'even'}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '14px' }}>
                        {run.round > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: run.round >= 10 ? '#D4AF37' : '#1C1917', ...(run.round >= 10 ? { animation: 'sg 1.5s ease-in-out infinite' } : {}) }}>{run.round}</div>
                                <div style={{ fontSize: '8px', color: '#A8A29E', fontWeight: '600' }}>ROUND</div>
                            </div>
                        )}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#D4AF37' }}>{historicalBest}</div>
                            <div style={{ fontSize: '8px', color: '#A8A29E', fontWeight: '600' }}>BEST</div>
                        </div>
                    </div>
                </div>

                {/* Joker bar */}
                {run.jokers.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', overflowX: 'auto', padding: '4px 0' }}>
                        {run.jokers.map(j => <JokerCard key={j.id} joker={j} small />)}
                    </div>
                )}

                {/* Dealer buff indicator */}
                {run.round > 0 && (standOn > 17 || bonus > 0) && phase !== 'bet' && phase !== 'run-end' && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        {standOn > 17 && <span style={{ fontSize: '10px', fontWeight: '700', color: '#DC2626', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>Dealer: {standOn}+ stay</span>}
                        {bonus > 0 && <span style={{ fontSize: '10px', fontWeight: '700', color: '#DC2626', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>Dealer: +{bonus}</span>}
                    </div>
                )}

                {/* Cheat badges */}
                {(phase === 'player' || phase === 'result') && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        {[
                            { l: 'PEEK', a: cheats.peek, c: '#3B82F6' },
                            { l: 'FLEX', a: cheats.flexCards.length > 0, c: '#A855F7' },
                            { l: 'COMBO +1', a: cheats.combo, c: '#10B981' },
                            { l: 'REVIVE', a: cheats.revive && !cheats.reviveUsed, c: '#EF4444' },
                            { l: 'BJ x3', a: cheats.bjBoost, c: '#D4AF37' },
                            { l: 'NEXT', a: cheats.cardCounter, c: '#06B6D4' },
                        ].map(b => (
                            <span key={b.l} style={{
                                fontSize: '9px', fontWeight: '800', color: b.a ? b.c : '#D6D3D1',
                                padding: '3px 7px', borderRadius: '4px',
                                backgroundColor: b.a ? b.c + '12' : '#F5F5F4',
                                border: `1px solid ${b.a ? b.c + '40' : '#E7E5E4'}`,
                            }}>{b.l}</span>
                        ))}
                    </div>
                )}

                {/* Game Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E7E5E4', padding: '20px', minHeight: '460px', display: 'flex', flexDirection: 'column' }}>

                    {phase === 'loading' && <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#A8A29E', fontSize: '13px' }}>Loading...</div>}

                    {/* BET */}
                    {phase === 'bet' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1.5px', marginBottom: '6px' }}>START A RUN</div>
                                <div style={{ fontSize: '13px', color: '#78716C' }}>Bet SP. Win to advance. Collect jokers. Lose = run over.</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {BET_OPTIONS.map(a => {
                                    const ok = a <= sp;
                                    return (
                                        <button key={a} onClick={() => ok && startNewRun(a)} disabled={!ok}
                                            style={{ width: '72px', height: '72px', borderRadius: '50%', border: `3px solid ${ok ? '#D4AF37' : '#E7E5E4'}`, backgroundColor: ok ? '#FFFBEB' : '#F5F5F4', cursor: ok ? 'pointer' : 'not-allowed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', opacity: ok ? 1 : 0.35 }}>
                                            <span style={{ fontSize: '18px', fontWeight: '900', color: ok ? '#D4AF37' : '#A8A29E' }}>{a}</span>
                                            <span style={{ fontSize: '7px', fontWeight: '700', color: '#A8A29E' }}>SP/round</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {sp <= 0 && <div style={{ fontSize: '13px', color: '#DC2626' }}>SP = 0. Review cards to earn more.</div>}
                        </div>
                    )}

                    {/* PLAYING */}
                    {(phase === 'player' || phase === 'result') && (
                        <>
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1px' }}>DEALER</span>
                                    <span style={{ fontSize: '16px', fontWeight: '900', color: phase === 'result' && isBust(dTotal, run.jokers) ? '#DC2626' : '#1C1917', fontVariantNumeric: 'tabular-nums' }}>
                                        {dTotal > 0 ? dTotal : ''}{phase === 'player' && !cheats.peek && dealerHand.some(c => !c.faceUp) ? '+?' : ''}
                                        {phase === 'result' && bonus > 0 ? ` (+${bonus})` : ''}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {dealerHand.map((c, i) => <PlayingCard key={`d${i}`} card={c} delay={i * 0.1} peekMode={cheats.peek && phase === 'player'} jokers={run.jokers} />)}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0 10px' }}>
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#E7E5E4' }} />
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#D4AF37', padding: '3px 12px', borderRadius: '16px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>R{run.round} / BET {bet}</span>
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#E7E5E4' }} />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1px' }}>YOU</span>
                                    <span style={{ fontSize: '16px', fontWeight: '900', color: isBust(pTotal, run.jokers) ? '#DC2626' : pTotal === 21 ? '#16A34A' : '#1C1917', fontVariantNumeric: 'tabular-nums' }}>
                                        {handTotal(playerHand, false, run.jokers)}
                                        {cheats.combo && !isBust(handTotal(playerHand, false, run.jokers) + 1, run.jokers) ? <span style={{ fontSize: '11px', color: '#10B981' }}> +1</span> : null}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {playerHand.map((c, i) => <PlayingCard key={`p${i}`} card={c} delay={i * 0.1} jokers={run.jokers}
                                        onFlex={phase === 'player' && (c.bstTier === 'S' || c.bstTier === 'A') ? d => flexCard(i, d) : undefined} />)}
                                </div>
                            </div>

                            {/* Next card preview */}
                            {nextCard && phase === 'player' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', padding: '4px 8px', borderRadius: '6px', backgroundColor: '#06B6D408', border: '1px solid #06B6D420' }}>
                                    <span style={{ fontSize: '9px', fontWeight: '700', color: '#06B6D4' }}>NEXT:</span>
                                    <span style={{ fontSize: '12px', fontWeight: '900', color: SUIT_COLORS[nextCard.suit] }}>{nextCard.rank}{SUIT_SYMBOLS[nextCard.suit]}</span>
                                    {nextCard.phrase && <span style={{ fontSize: '9px', color: '#78716C' }}>{nextCard.phrase.english.slice(0, 30)}</span>}
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                                {phase === 'player' && (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={hit} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#1C1917', color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer', letterSpacing: '2px' }}>HIT</button>
                                        <button onClick={stay} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '2px solid #D6D3D1', backgroundColor: '#fff', color: '#1C1917', fontSize: '14px', fontWeight: '800', cursor: 'pointer', letterSpacing: '2px' }}>STAY</button>
                                    </div>
                                )}
                                {phase === 'result' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', animation: 'rp 0.4s ease-out' }}>
                                        <div style={{ fontSize: '20px', fontWeight: '900', color: rColor }}>{msg}</div>
                                        {(result === 'win' || result === 'blackjack') && <div style={{ fontSize: '14px', fontWeight: '800', color: '#D4AF37' }}>Round {run.round} clear!</div>}
                                        {(result === 'lose' || result === 'bust') && <div style={{ fontSize: '14px', fontWeight: '800', color: '#DC2626' }}>-{bet} SP</div>}
                                        <button onClick={afterResult} style={{ padding: '12px 32px', borderRadius: '10px', border: 'none', backgroundColor: '#1C1917', color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px' }}>
                                            {result === 'win' || result === 'blackjack' || result === 'push' ? 'CONTINUE' : 'END RUN'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* JOKER PICK */}
                    {phase === 'joker-pick' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', animation: 'jp 0.4s ease-out' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#D4AF37', letterSpacing: '1.5px', marginBottom: '4px' }}>ROUND {run.round} CLEAR</div>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#1C1917' }}>Pick a Joker</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {jokerChoices.map(j => <JokerCard key={j.id} joker={j} onClick={() => pickJoker(j)} />)}
                            </div>
                            <button onClick={skipJoker} style={{ fontSize: '11px', color: '#A8A29E', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Skip</button>
                        </div>
                    )}

                    {/* RUN END */}
                    {phase === 'run-end' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', animation: 'rp 0.5s ease-out' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#DC2626', letterSpacing: '1.5px' }}>RUN OVER</div>
                            <div style={{ fontSize: '48px', fontWeight: '900', color: '#1C1917', lineHeight: 1 }}>Round {run.round}</div>
                            {run.round >= historicalBest && run.round > 0 && <div style={{ fontSize: '14px', fontWeight: '800', color: '#D4AF37' }}>NEW BEST!</div>}
                            <div style={{ display: 'flex', gap: '20px', margin: '8px 0' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '900', color: run.spEarned >= 0 ? '#16A34A' : '#DC2626' }}>{run.spEarned >= 0 ? '+' : ''}{run.spEarned}</div>
                                    <div style={{ fontSize: '9px', color: '#A8A29E' }}>SP EARNED</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#A855F7' }}>{run.jokers.length}</div>
                                    <div style={{ fontSize: '9px', color: '#A8A29E' }}>JOKERS</div>
                                </div>
                            </div>
                            {run.jokers.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {run.jokers.map(j => <JokerCard key={j.id} joker={j} small />)}
                                </div>
                            )}
                            <button onClick={() => setPhase('bet')} style={{ padding: '14px 36px', borderRadius: '10px', border: 'none', backgroundColor: '#1C1917', color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', marginTop: '8px' }}>NEW RUN</button>
                        </div>
                    )}
                </div>

                {/* Seen phrases */}
                {seenPhrases.length > 0 && phase !== 'joker-pick' && phase !== 'run-end' && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1px', marginBottom: '8px' }}>THIS HAND -- {seenPhrases.length} phrases</div>
                        {seenPhrases.map(p => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid #F5F5F4' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1C1917' }}>{p.english}</span>
                                <span style={{ fontSize: '10px', color: '#A8A29E', marginLeft: '12px', flexShrink: 0 }}>{p.japanese}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
