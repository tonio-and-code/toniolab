'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';

// ===== Types =====
interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

type CardRank = 'NORMAL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'HOLOGRAPHIC' | 'LEGENDARY';

interface RankConfig {
    rank: CardRank;
    threshold: number;
    borderColor: string;
    label: string;
}

interface CardData {
    phrase: Phrase;
    points: number;
    rankConfig: RankConfig;
    chakra: number;
}

const CHAKRA: { name: string; ja: string; color: string }[] = [
    { name: 'SEED', ja: '種', color: '#B91C1C' },
    { name: 'SPARK', ja: '芽', color: '#C2410C' },
    { name: 'FORGE', ja: '鍛', color: '#A16207' },
    { name: 'OWN', ja: '得', color: '#166534' },
    { name: 'VOICE', ja: '声', color: '#1E40AF' },
    { name: 'VISION', ja: '研', color: '#3730A3' },
    { name: 'CROWN', ja: '極', color: '#6B21A8' },
];

// ===== Constants =====
const CARD_RANKS: RankConfig[] = [
    { rank: 'LEGENDARY', threshold: 250, borderColor: '#D4AF37', label: 'LEGENDARY' },
    { rank: 'HOLOGRAPHIC', threshold: 100, borderColor: '#A855F7', label: 'HOLO' },
    { rank: 'GOLD', threshold: 50, borderColor: '#F6C85F', label: 'GOLD' },
    { rank: 'SILVER', threshold: 20, borderColor: '#94A3B8', label: 'SILVER' },
    { rank: 'BRONZE', threshold: 5, borderColor: '#CD7F32', label: 'BRONZE' },
    { rank: 'NORMAL', threshold: 0, borderColor: '#D6D3D1', label: 'NORMAL' },
];

const RANK_ORDER: CardRank[] = ['LEGENDARY', 'HOLOGRAPHIC', 'GOLD', 'SILVER', 'BRONZE', 'NORMAL'];

const MAX_TILT: Record<CardRank, number> = {
    NORMAL: 8, BRONZE: 10, SILVER: 12, GOLD: 15, HOLOGRAPHIC: 15, LEGENDARY: 18,
};

import { ELEMENT_COLORS, calcBstStats, calcBstTotal, getBstTier, BST_STAT_NAMES, BST_TIERS, type BstTier } from '@/data/english/elements';
import { ElementBadge } from '@/components/english/ElementIcon';
const TYPE_COLORS = ELEMENT_COLORS;

// ===== Card Visual Helpers =====
function getCardRank(points: number): RankConfig {
    for (const r of CARD_RANKS) {
        if (points >= r.threshold) return r;
    }
    return CARD_RANKS[CARD_RANKS.length - 1];
}

function getNextRank(rank: CardRank): RankConfig | null {
    const idx = CARD_RANKS.findIndex(r => r.rank === rank);
    return idx > 0 ? CARD_RANKS[idx - 1] : null;
}

// Double-background trick: inner color fills padding-box, gradient fills border-box.
// This lets borderRadius work (borderImage ignores it).
function getCardFrame(rank: CardRank): { border: string; borderRadius: string; background: string; backgroundColor: string } {
    const br = '8px';
    switch (rank) {
        case 'NORMAL': return { border: '8px solid #E7E5E4', borderRadius: br, background: '', backgroundColor: '#FAFAF9' };
        case 'BRONZE': return {
            border: '8px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(#FFFBF5, #FFFBF5) padding-box, linear-gradient(135deg, #CD7F32 0%, #E8B87A 30%, #CD7F32 60%, #A0622E 100%) border-box',
        };
        case 'SILVER': return {
            border: '8px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(#F8FAFB, #F8FAFB) padding-box, linear-gradient(135deg, #e2e8f0 0%, #ffffff 40%, #cbd5e1 60%, #94a3b8 100%) border-box',
        };
        case 'GOLD': return {
            border: '8px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(180deg, #FFFEF5 0%, #FFFBEB 100%) padding-box, linear-gradient(135deg, #D4AF37 0%, #FFF2A8 25%, #F6C85F 50%, #D4AF37 75%, #B8941E 100%) border-box',
        };
        case 'HOLOGRAPHIC': return {
            border: '8px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E0E7FF 100%) padding-box, linear-gradient(135deg, #E879F9 0%, #A855F7 25%, #6366F1 50%, #3B82F6 75%, #06B6D4 100%) border-box',
        };
        case 'LEGENDARY': return {
            border: '8px solid transparent', borderRadius: br, backgroundColor: 'transparent',
            background: 'linear-gradient(135deg, #1C1917 0%, #2D2438 50%, #1c1813 100%) padding-box, linear-gradient(135deg, #18181B 0%, #A855F7 40%, #D4AF37 60%, #18181B 100%) border-box',
        };
    }
}

function getCardShadow(rank: CardRank): string {
    switch (rank) {
        case 'NORMAL': return '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)';
        case 'BRONZE': return '0 6px 16px rgba(205,127,50,0.15), 0 2px 6px rgba(205,127,50,0.1)';
        case 'SILVER': return '0 6px 20px rgba(148,163,184,0.25), 0 2px 8px rgba(148,163,184,0.15)';
        case 'GOLD': return '0 8px 24px rgba(212,175,55,0.35), 0 4px 12px rgba(246,200,95,0.25)';
        case 'HOLOGRAPHIC': return '0 8px 30px rgba(168,85,247,0.3), 0 4px 16px rgba(99,102,241,0.25)';
        case 'LEGENDARY': return '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.4), 0 0 30px rgba(168,85,247,0.3)';
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
        case 'NORMAL': return '#E7E5E4';
        case 'BRONZE': return '#CD7F32';
        case 'SILVER': return '#94A3B8';
        case 'GOLD': return '#D4AF37';
        case 'HOLOGRAPHIC': return '#A855F7';
        case 'LEGENDARY': return '#D4AF37';
    }
}

// ===== 3D Tilt Hook =====
function useCardTilt(rank: CardRank, enabled: boolean) {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({
        transform: 'rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.6s ease-out',
    });
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [isHovering, setIsHovering] = useState(false);

    const maxTilt = MAX_TILT[rank];

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!enabled || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (x - 0.5) * 2 * maxTilt;
        const tiltY = (y - 0.5) * -2 * maxTilt;
        setStyle({ transform: `rotateX(${tiltY}deg) rotateY(${tiltX}deg)`, transition: 'none' });
        setMousePos({ x, y });
        setIsHovering(true);
    }, [enabled, maxTilt]);

    const onMouseLeave = useCallback(() => {
        setStyle({ transform: 'rotateX(0deg) rotateY(0deg)', transition: 'transform 0.6s ease-out' });
        setMousePos({ x: 0.5, y: 0.5 });
        setIsHovering(false);
    }, []);

    return { ref, style, mousePos, isHovering, onMouseMove, onMouseLeave };
}

// ===== Card Nicknames (DB via API) =====
async function saveNicknameAPI(phraseId: string, name: string) {
    await fetch('/api/phrases/mastery/card-name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phraseId, name }),
    }).catch(() => {});
}

// ===== Card Component =====
function CollectionCard({
    card, size = 'compact', enableTilt = true, onClick, nickname,
}: {
    card: CardData;
    size?: 'compact' | 'full';
    enableTilt?: boolean;
    onClick?: () => void;
    nickname?: string;
}) {
    const { phrase, points, rankConfig } = card;
    const rank = rankConfig.rank;
    const isHolo = rank === 'HOLOGRAPHIC' || rank === 'LEGENDARY';
    const isLegendary = rank === 'LEGENDARY';
    const isTextLight = rank === 'LEGENDARY';
    const w = size === 'full' ? 300 : 240;
    const h = size === 'full' ? 420 : 340;
    const frame = getCardFrame(rank);
    const shadow = getCardShadow(rank);
    const accent = getFrameAccent(rank);
    const tilt = useCardTilt(rank, enableTilt);

    const holoAngle = useMemo(() => {
        const dx = tilt.mousePos.x - 0.5;
        const dy = tilt.mousePos.y - 0.5;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }, [tilt.mousePos]);

    const holoGradient = isLegendary
        ? `linear-gradient(${holoAngle}deg, rgba(212,175,55,0.15) 0%, rgba(168,85,247,0.2) 25%, rgba(212,175,55,0.15) 50%, rgba(168,85,247,0.2) 75%, rgba(212,175,55,0.15) 100%)`
        : `linear-gradient(${holoAngle}deg, rgba(232,121,249,0.15) 0%, rgba(99,102,241,0.15) 20%, rgba(59,130,246,0.15) 40%, rgba(16,185,129,0.15) 60%, rgba(245,158,11,0.15) 80%, rgba(232,121,249,0.15) 100%)`;

    const specularBg = `radial-gradient(circle at ${tilt.mousePos.x * 100}% ${tilt.mousePos.y * 100}%, rgba(255,255,255,0.5) 0%, transparent 60%)`;

    const typeColor = TYPE_COLORS[phrase.category] || '#78716C';

    return (
        <div style={{ perspective: '800px', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
            <div
                ref={tilt.ref}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    ...frame,
                    boxShadow: shadow,
                    padding: size === 'full' ? '8px' : '6px',
                    ...tilt.style,
                    willChange: 'transform',
                    ...(isLegendary ? { animation: 'card-legendary-aura 4s ease-in-out infinite' } : {}),
                    ...(rank === 'GOLD' ? { animation: 'card-gold-pulse 5s ease-in-out infinite' } : {}),
                }}
            >
                {/* Holographic overlay - HOLO + LEGENDARY */}
                {isHolo && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: holoGradient,
                        backgroundSize: '200% 200%',
                        animation: 'card-holo-shimmer 3s linear infinite',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                        zIndex: 4,
                        opacity: tilt.isHovering ? 0.25 : 0.08,
                        transition: 'opacity 0.3s ease',
                        mixBlendMode: 'overlay',
                    }} />
                )}

                {/* Specular highlight - SILVER+ on hover */}
                {rank !== 'NORMAL' && rank !== 'BRONZE' && tilt.isHovering && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: specularBg,
                        borderRadius: '4px',
                        pointerEvents: 'none',
                        zIndex: 5,
                        opacity: 0.6,
                        mixBlendMode: 'overlay',
                    }} />
                )}

                {/* Legendary particles */}
                {isLegendary && Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: `${3 + (i % 3)}px`,
                        height: `${3 + (i % 3)}px`,
                        borderRadius: '50%',
                        background: i % 2 === 0 ? '#D4AF37' : '#A855F7',
                        left: `${10 + (i * 7) % 80}%`,
                        top: `${5 + (i * 13) % 85}%`,
                        animation: `card-particle-float ${2 + (i % 3)}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                        opacity: 0.7,
                        zIndex: 6,
                        pointerEvents: 'none',
                        filter: 'blur(0.5px)',
                    }} />
                ))}

                {/* Top Name Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: size === 'full' ? '6px 10px' : '4px 8px',
                    backgroundColor: isTextLight ? 'rgba(255,255,255,0.06)' : `${accent}12`,
                    borderRadius: '8px 8px 0 0',
                    borderBottom: `1px solid ${isTextLight ? 'rgba(255,255,255,0.1)' : accent + '30'}`,
                    position: 'relative',
                    zIndex: 7,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ElementBadge element={phrase.category} size={size === 'full' ? 12 : 10} />
                        <span style={{
                            fontSize: size === 'full' ? '9px' : '8px',
                            fontWeight: '800',
                            color: nickname ? (isTextLight ? '#FAFAF9' : '#57534E') : rankConfig.borderColor,
                            letterSpacing: nickname ? '0.5px' : '1.5px',
                            textShadow: isHolo && !nickname ? `0 0 8px ${rankConfig.borderColor}60` : 'none',
                            maxWidth: size === 'full' ? '120px' : '80px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {nickname || (rank !== 'NORMAL' ? rankConfig.label : '')}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                        <span style={{
                            fontSize: size === 'full' ? '14px' : '11px',
                            fontWeight: '900',
                            color: rank !== 'NORMAL' ? rankConfig.borderColor : '#A8A29E',
                            fontVariantNumeric: 'tabular-nums',
                        }}>
                            {points}
                        </span>
                        <span style={{
                            fontSize: size === 'full' ? '8px' : '7px',
                            fontWeight: '700',
                            color: isTextLight ? 'rgba(255,255,255,0.4)' : '#A8A29E',
                        }}>
                            SP
                        </span>
                    </div>
                </div>

                {/* Illustration Window */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: getCardWindowBg(rank),
                    borderRadius: '8px',
                    border: `1px solid ${isTextLight ? 'rgba(255,255,255,0.08)' : accent + '25'}`,
                    margin: size === 'full' ? '6px 0' : '4px 0',
                    padding: size === 'full' ? '20px 16px' : '12px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 7,
                    overflow: 'hidden',
                }}>
                    {/* Background texture pattern per rank */}
                    {rank === 'BRONZE' && (
                        <div style={{
                            position: 'absolute', inset: 0, opacity: 0.04,
                            background: 'repeating-linear-gradient(45deg, #CD7F32, #CD7F32 1px, transparent 1px, transparent 12px)',
                            pointerEvents: 'none',
                        }} />
                    )}
                    {rank === 'SILVER' && (
                        <div style={{
                            position: 'absolute', inset: 0, opacity: 0.05,
                            background: 'repeating-linear-gradient(-45deg, #94A3B8, #94A3B8 1px, transparent 1px, transparent 14px)',
                            pointerEvents: 'none',
                        }} />
                    )}
                    {rank === 'GOLD' && (
                        <div style={{
                            position: 'absolute', inset: 0, opacity: 0.03,
                            background: 'radial-gradient(circle at 30% 40%, #D4AF37 0.5px, transparent 0.5px)',
                            backgroundSize: '16px 16px',
                            pointerEvents: 'none',
                        }} />
                    )}
                    {isHolo && (
                        <div style={{
                            position: 'absolute', inset: 0, opacity: 0.06,
                            background: `repeating-conic-gradient(from ${holoAngle}deg, rgba(168,85,247,0.1) 0deg, rgba(59,130,246,0.1) 60deg, rgba(232,121,249,0.1) 120deg, rgba(16,185,129,0.1) 180deg, rgba(245,158,11,0.1) 240deg, rgba(168,85,247,0.1) 360deg)`,
                            pointerEvents: 'none',
                        }} />
                    )}

                    <div style={{
                        fontSize: size === 'full' ? '22px' : '16px',
                        fontWeight: '800',
                        color: isTextLight ? '#FAFAF9' : '#1C1917',
                        lineHeight: 1.3,
                        marginBottom: '8px',
                        letterSpacing: '-0.3px',
                        position: 'relative',
                        textShadow: isTextLight ? '0 1px 4px rgba(0,0,0,0.5)' : 'none',
                    }}>
                        {phrase.english}
                    </div>
                    <div style={{
                        fontSize: size === 'full' ? '13px' : '11px',
                        color: isTextLight ? 'rgba(255,255,255,0.5)' : '#78716C',
                        lineHeight: 1.4,
                        position: 'relative',
                    }}>
                        {phrase.japanese}
                    </div>
                </div>

                {/* Bottom Bar */}
                {(() => {
                    const bstTotal = calcBstTotal(phrase.id);
                    const bstTier = getBstTier(bstTotal);
                    const ci = CHAKRA[card.chakra] || CHAKRA[0];
                    return (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: size === 'full' ? '5px 10px' : '4px 8px',
                            backgroundColor: isTextLight ? 'rgba(255,255,255,0.04)' : `${accent}08`,
                            borderRadius: '0 0 8px 8px',
                            borderTop: `1px solid ${isTextLight ? 'rgba(255,255,255,0.08)' : accent + '20'}`,
                            position: 'relative',
                            zIndex: 7,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                    fontSize: '8px',
                                    fontWeight: '700',
                                    color: isTextLight ? 'rgba(255,255,255,0.35)' : '#A8A29E',
                                    letterSpacing: '1px',
                                }}>
                                    {rankConfig.label || 'NORMAL'}
                                </span>
                                {/* Chakra badge */}
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    backgroundColor: ci.color + (isTextLight ? '30' : '12'),
                                    border: `1px solid ${ci.color}${isTextLight ? '50' : '25'}`,
                                }}>
                                    <span style={{
                                        fontSize: size === 'full' ? '10px' : '8px',
                                        fontWeight: '900',
                                        color: ci.color,
                                        lineHeight: 1,
                                    }}>
                                        {ci.ja}
                                    </span>
                                    <span style={{
                                        fontSize: '6px',
                                        fontWeight: '700',
                                        color: ci.color,
                                        opacity: 0.7,
                                        letterSpacing: '0.3px',
                                    }}>
                                        {ci.name}
                                    </span>
                                </span>
                            </div>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                <span style={{
                                    fontSize: '7px',
                                    fontWeight: '800',
                                    color: bstTier.color,
                                    letterSpacing: '0.5px',
                                }}>
                                    {bstTier.tier} {bstTotal}
                                </span>
                                <span style={{
                                    fontSize: '7px',
                                    fontWeight: '600',
                                    color: isTextLight ? 'rgba(255,255,255,0.3)' : '#A8A29E',
                                    fontFamily: 'monospace',
                                }}>
                                    {phrase.id.slice(0, 6)}
                                </span>
                            </span>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

// ===== Dashboard Component =====
function CollectionDashboard({ cards }: { cards: CardData[] }) {
    const total = cards.length;
    const distribution = useMemo(() => {
        const dist: Record<CardRank, number> = {
            LEGENDARY: 0, HOLOGRAPHIC: 0, GOLD: 0, SILVER: 0, BRONZE: 0, NORMAL: 0,
        };
        cards.forEach(c => { dist[c.rankConfig.rank]++; });
        return dist;
    }, [cards]);

    const rarestCard = useMemo(() => {
        if (cards.length === 0) return null;
        return cards.reduce((best, c) => c.points > best.points ? c : best, cards[0]);
    }, [cards]);

    const barTotal = total || 1;

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            marginBottom: '32px',
        }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Total count */}
                <div style={{ minWidth: '120px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1px', marginBottom: '4px' }}>
                        COLLECTION
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: '900', color: '#1C1917', lineHeight: 1, letterSpacing: '-2px' }}>
                        {total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>cards total</div>
                </div>

                {/* Distribution */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1px', marginBottom: '8px' }}>
                        RANK DISTRIBUTION
                    </div>
                    {/* Stacked bar */}
                    <div style={{
                        display: 'flex',
                        height: '24px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: '#F5F5F4',
                        marginBottom: '12px',
                    }}>
                        {RANK_ORDER.map(rank => {
                            const count = distribution[rank];
                            if (count === 0) return null;
                            const cfg = CARD_RANKS.find(r => r.rank === rank)!;
                            return (
                                <div
                                    key={rank}
                                    style={{
                                        width: `${(count / barTotal) * 100}%`,
                                        backgroundColor: cfg.borderColor,
                                        opacity: rank === 'NORMAL' ? 0.3 : 0.85,
                                        minWidth: count > 0 ? '4px' : '0',
                                        transition: 'width 0.5s ease',
                                    }}
                                    title={`${cfg.label || 'NORMAL'}: ${count}`}
                                />
                            );
                        })}
                    </div>
                    {/* Chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {RANK_ORDER.map(rank => {
                            const count = distribution[rank];
                            const cfg = CARD_RANKS.find(r => r.rank === rank)!;
                            return (
                                <span key={rank} style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: cfg.borderColor,
                                    opacity: count > 0 ? 1 : 0.35,
                                }}>
                                    {cfg.label || 'NORMAL'} x{count}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Rarest card highlight */}
                {rarestCard && rarestCard.points > 0 && (
                    <div style={{ minWidth: '140px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1px', marginBottom: '8px' }}>
                            RAREST CARD
                        </div>
                        <div style={{
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: rarestCard.rankConfig.borderColor + '10',
                            border: `1px solid ${rarestCard.rankConfig.borderColor}30`,
                        }}>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: '800',
                                color: '#1C1917',
                                marginBottom: '4px',
                                lineHeight: 1.3,
                            }}>
                                {rarestCard.phrase.english}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: '800',
                                color: rarestCard.rankConfig.borderColor,
                            }}>
                                {rarestCard.rankConfig.label || 'NORMAL'} / {rarestCard.points} SP
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ===== Expanded Card Modal =====
function CardModal({ card, onClose, isMobile, nickname, onNicknameChange }: {
    card: CardData; onClose: () => void; isMobile: boolean;
    nickname: string; onNicknameChange: (name: string) => void;
}) {
    const nextRank = getNextRank(card.rankConfig.rank);
    const progressPct = nextRank
        ? Math.min(100, ((card.points - card.rankConfig.threshold) / (nextRank.threshold - card.rankConfig.threshold)) * 100)
        : 100;
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(nickname);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing && inputRef.current) inputRef.current.focus();
    }, [editing]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { if (editing) setEditing(false); else onClose(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, editing]);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px',
            }}
        >
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <CollectionCard
                    card={card}
                    size="full"
                    enableTilt={!isMobile}
                    nickname={nickname}
                />

                {/* Nickname editor */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    minHeight: '32px',
                }}>
                    {editing ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            onNicknameChange(draft);
                            setEditing(false);
                        }} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                                ref={inputRef}
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                maxLength={16}
                                placeholder={card.rankConfig.label}
                                style={{
                                    fontSize: '13px', fontWeight: '700',
                                    padding: '4px 10px', borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    color: '#fff', outline: 'none',
                                    width: '140px', textAlign: 'center',
                                }}
                            />
                            <button type="submit" style={{
                                fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                                borderRadius: '6px', border: 'none', cursor: 'pointer',
                                backgroundColor: '#D4AF37', color: '#fff',
                            }}>OK</button>
                            {nickname && (
                                <button type="button" onClick={() => { onNicknameChange(''); setDraft(''); setEditing(false); }} style={{
                                    fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                                    borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)',
                                }}>RESET</button>
                            )}
                        </form>
                    ) : (
                        <button onClick={() => { setDraft(nickname); setEditing(true); }} style={{
                            fontSize: '11px', fontWeight: '700', padding: '4px 12px',
                            borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer', backgroundColor: 'transparent',
                            color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px',
                        }}>
                            {nickname || 'NAME THIS CARD'}
                        </button>
                    )}
                </div>

                {/* SP progress bar */}
                <div style={{
                    width: isMobile ? '260px' : '300px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(4px)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                            {card.points} SP
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>
                            {nextRank ? `${nextRank.threshold} SP → ${nextRank.label}` : 'MAX RANK'}
                        </span>
                    </div>
                    <div style={{
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progressPct}%`,
                            borderRadius: '4px',
                            background: nextRank
                                ? `linear-gradient(90deg, ${card.rankConfig.borderColor}, ${nextRank.borderColor})`
                                : `linear-gradient(90deg, #D4AF37, #A855F7)`,
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                    {nextRank && (
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', textAlign: 'right' }}>
                            {nextRank.threshold - card.points} SP to go
                        </div>
                    )}
                </div>

                {/* BST Stats */}
                {(() => {
                    const stats = calcBstStats(card.phrase.id);
                    const total = stats.reduce((a, b) => a + b, 0);
                    const tier = getBstTier(total);
                    return (
                        <div style={{
                            width: '100%',
                            maxWidth: '280px',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>BASE STATS</span>
                                <span style={{ fontSize: '13px', fontWeight: '900', color: tier.color }}>
                                    {tier.tier} {total}
                                </span>
                            </div>
                            {BST_STAT_NAMES.map((name, i) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', width: '24px', textAlign: 'right' }}>{name}</span>
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', width: '22px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{stats[i]}</span>
                                    <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${((stats[i] - 30) / 85) * 100}%`,
                                            borderRadius: '2px',
                                            backgroundColor: stats[i] >= 100 ? '#D4AF37' : stats[i] >= 80 ? '#3B82F6' : 'rgba(255,255,255,0.3)',
                                        }} />
                                    </div>
                                </div>
                            ))}
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '4px' }}>
                                {tier.ja}
                            </div>
                        </div>
                    );
                })()}

                {/* Chakra Level */}
                {(() => {
                    const ci = CHAKRA[card.chakra] || CHAKRA[0];
                    return (
                        <div style={{
                            width: '100%',
                            maxWidth: '280px',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '10px',
                            padding: '10px 16px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>CHAKRA</span>
                                <span style={{ fontSize: '13px', fontWeight: '900', color: ci.color }}>
                                    Lv.{card.chakra}
                                </span>
                            </div>
                            {/* Chakra progression */}
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {CHAKRA.map((c, i) => (
                                    <div key={c.name} style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '3px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: '4px',
                                            borderRadius: '2px',
                                            backgroundColor: i <= card.chakra ? c.color : 'rgba(255,255,255,0.08)',
                                            transition: 'background-color 0.3s',
                                        }} />
                                        <span style={{
                                            fontSize: '9px',
                                            fontWeight: i === card.chakra ? '900' : '600',
                                            color: i === card.chakra ? c.color : i < card.chakra ? c.color + '80' : 'rgba(255,255,255,0.2)',
                                        }}>
                                            {c.ja}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <ElementBadge element={card.phrase.category} size={14} />
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                        {card.phrase.id}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== Skeleton Card =====
function SkeletonCard({ isMobile }: { isMobile: boolean }) {
    return (
        <div style={{
            width: '240px',
            height: '340px',
            borderRadius: '16px',
            backgroundColor: '#F5F5F4',
            animation: 'card-skeleton-pulse 1.5s ease-in-out infinite',
            transform: isMobile ? 'scale(0.75)' : 'none',
            transformOrigin: 'top center',
        }} />
    );
}

// ===== Main Page =====
export default function CardCollectionPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [cardPoints, setCardPoints] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeFilter, setActiveFilter] = useState<CardRank | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'sp' | 'bst'>('sp');
    const [bstFilter, setBstFilter] = useState<BstTier | 'ALL'>('ALL');
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
    const [nicknames, setNicknames] = useState<Record<string, string>>({});
    const [mastery, setMastery] = useState<Record<string, number>>({});

    // Fetch real data
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        Promise.all([
            fetch('/api/phrases').then(r => r.json()),
            fetch('/api/phrases/mastery').then(r => r.json()),
        ]).then(([phrasesRes, masteryRes]) => {
            if (phrasesRes.success) setPhrases(phrasesRes.phrases || []);
            if (masteryRes.success) {
                setCardPoints(masteryRes.cardPoints || {});
                setNicknames(masteryRes.cardNames || {});
                setMastery(masteryRes.mastery || {});
            }
            setLoading(false);
        }).catch(() => setLoading(false));

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Build card data
    const cards: CardData[] = useMemo(() => {
        return phrases.map(p => {
            const pts = cardPoints[p.id] || 0;
            const ch = Math.min(mastery[p.id] || 0, 6);
            return { phrase: p, points: pts, rankConfig: getCardRank(pts), chakra: ch };
        });
    }, [phrases, cardPoints, mastery]);

    // Filtered + sorted cards
    const filteredCards = useMemo(() => {
        let result = cards;
        if (activeFilter !== 'ALL') result = result.filter(c => c.rankConfig.rank === activeFilter);
        if (bstFilter !== 'ALL') result = result.filter(c => getBstTier(calcBstTotal(c.phrase.id)).tier === bstFilter);
        if (sortBy === 'bst') {
            result = [...result].sort((a, b) => calcBstTotal(b.phrase.id) - calcBstTotal(a.phrase.id));
        } else {
            result = [...result].sort((a, b) => b.points - a.points);
        }
        return result;
    }, [cards, activeFilter, bstFilter, sortBy]);

    // Rank counts for filter badges
    const rankCounts = useMemo(() => {
        const counts: Record<CardRank | 'ALL', number> = {
            ALL: cards.length, LEGENDARY: 0, HOLOGRAPHIC: 0, GOLD: 0, SILVER: 0, BRONZE: 0, NORMAL: 0,
        };
        cards.forEach(c => { counts[c.rankConfig.rank]++; });
        return counts;
    }, [cards]);

    // BST tier counts
    const bstCounts = useMemo(() => {
        const counts: Record<BstTier | 'ALL', number> = { ALL: cards.length, S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
        cards.forEach(c => { counts[getBstTier(calcBstTotal(c.phrase.id)).tier]++; });
        return counts;
    }, [cards]);

    const filterOptions: { key: CardRank | 'ALL'; label: string; color: string }[] = [
        { key: 'ALL', label: 'ALL', color: '#78716C' },
        { key: 'LEGENDARY', label: 'LEGENDARY', color: '#D4AF37' },
        { key: 'HOLOGRAPHIC', label: 'HOLO', color: '#A855F7' },
        { key: 'GOLD', label: 'GOLD', color: '#F6C85F' },
        { key: 'SILVER', label: 'SILVER', color: '#94A3B8' },
        { key: 'BRONZE', label: 'BRONZE', color: '#CD7F32' },
        { key: 'NORMAL', label: 'NORMAL', color: '#D6D3D1' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#fafafa',
            padding: isMobile ? '16px' : '24px',
        }}>
            <style>{`
                @keyframes card-holo-shimmer {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                @keyframes card-particle-float {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
                    50% { transform: translateY(-10px) scale(1.4); opacity: 1; }
                }
                @keyframes card-legendary-aura {
                    0%, 100% { box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.4), 0 0 30px rgba(168,85,247,0.3); }
                    50% { box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 35px rgba(212,175,55,0.6), 0 0 50px rgba(168,85,247,0.4); }
                }
                @keyframes card-gold-pulse {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.04); }
                }
                @keyframes card-skeleton-pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                }
                @keyframes card-enter {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Header */}
            <div style={{ maxWidth: '960px', margin: '0 auto 24px' }}>
                <Link
                    href="/english/training"
                    style={{ fontSize: '12px', color: '#A8A29E', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}
                >
                    training
                </Link>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                    Card Collection
                </h1>
                <p style={{ fontSize: '13px', color: '#78716C', lineHeight: 1.6 }}>
                    レビューで貯めたSPに応じてカードのランクが決まる。集めたカードを眺めよう。
                </p>
            </div>

            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* Dashboard */}
                {!loading && <CollectionDashboard cards={cards} />}

                {/* Rank Filter */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {filterOptions.map(opt => {
                        const count = rankCounts[opt.key];
                        const isActive = activeFilter === opt.key;
                        return (
                            <button
                                key={opt.key}
                                onClick={() => setActiveFilter(opt.key)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    border: `1.5px solid ${isActive ? opt.color : '#E7E5E4'}`,
                                    backgroundColor: isActive ? opt.color + '15' : '#fff',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: isActive ? opt.color : '#A8A29E',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0,
                                }}
                            >
                                {opt.label}
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    color: isActive ? opt.color : '#D6D3D1',
                                    backgroundColor: isActive ? opt.color + '15' : '#F5F5F4',
                                    padding: '1px 6px',
                                    borderRadius: '8px',
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Sort toggle + BST filter */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F5F5F4', borderRadius: '8px', padding: '2px' }}>
                        {([['sp', 'SP'], ['bst', 'BST']] as const).map(([key, label]) => (
                            <button key={key} onClick={() => setSortBy(key)}
                                style={{
                                    padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                    fontSize: '11px', fontWeight: '700',
                                    backgroundColor: sortBy === key ? '#fff' : 'transparent',
                                    color: sortBy === key ? '#1C1917' : '#A8A29E',
                                    boxShadow: sortBy === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                }}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#E7E5E4' }} />
                    {BST_TIERS.map(t => {
                        const count = bstCounts[t.tier];
                        const isActive = bstFilter === t.tier;
                        return (
                            <button key={t.tier}
                                onClick={() => setBstFilter(bstFilter === t.tier ? 'ALL' : t.tier)}
                                style={{
                                    padding: '3px 10px', borderRadius: '12px', border: `1.5px solid ${isActive ? t.color : '#E7E5E4'}`,
                                    backgroundColor: isActive ? t.bg : '#fff', fontSize: '10px', fontWeight: '700',
                                    color: isActive ? t.color : '#A8A29E', cursor: 'pointer', whiteSpace: 'nowrap',
                                    display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
                                }}>
                                {t.tier} {t.label}
                                <span style={{
                                    fontSize: '9px', fontWeight: '800',
                                    color: isActive ? t.color : '#D6D3D1',
                                    backgroundColor: isActive ? t.color + '15' : '#F5F5F4',
                                    padding: '0 5px', borderRadius: '6px',
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Card Grid */}
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: isMobile ? '8px' : '24px',
                        justifyItems: 'center',
                    }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} isMobile={isMobile} />
                        ))}
                    </div>
                ) : filteredCards.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#A8A29E',
                        fontSize: '14px',
                    }}>
                        {activeFilter === 'ALL'
                            ? 'No cards yet. Start reviewing phrases to earn SP.'
                            : `No ${activeFilter} cards yet.`
                        }
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: isMobile ? '8px' : '24px',
                        justifyItems: 'center',
                    }}>
                        {filteredCards.map((card, i) => (
                            <div
                                key={card.phrase.id}
                                style={{
                                    animation: `card-enter 0.4s ease-out both`,
                                    animationDelay: `${Math.min(i * 0.05, 0.5)}s`,
                                    ...(isMobile ? { transform: 'scale(0.75)', transformOrigin: 'top center' } : {}),
                                }}
                            >
                                <CollectionCard
                                    card={card}
                                    enableTilt={!isMobile}
                                    onClick={() => setSelectedCard(card)}
                                    nickname={nicknames[card.phrase.id]}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedCard && (
                <CardModal
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                    isMobile={isMobile}
                    nickname={nicknames[selectedCard.phrase.id] || ''}
                    onNicknameChange={(name) => {
                        saveNicknameAPI(selectedCard.phrase.id, name);
                        setNicknames(prev => {
                            const next = { ...prev };
                            if (name.trim()) next[selectedCard.phrase.id] = name.trim();
                            else delete next[selectedCard.phrase.id];
                            return next;
                        });
                    }}
                />
            )}
        </div>
    );
}