'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    ELEMENT_COLORS, ELEMENT_ADVANTAGE, ELEMENT_LABELS,
    calcBstTotal, getBstTier,
} from '@/data/english/elements';
import { ElementBadge } from '@/components/english/ElementIcon';

// ── Types ──────────────────────────────────────────
interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

type CardRank = 'NORMAL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'HOLOGRAPHIC' | 'LEGENDARY';

interface BattleCard {
    phrase: Phrase;
    sp: number;
    rank: CardRank;
    rankColor: string;
    rankLabel: string;
    bst: number;
    bstTier: string;
    bstColor: string;
    chakra: number; // 0-6
    chakraLabel: string;
    chakraColor: string;
}

type Winner = 'player' | 'cpu' | 'draw';

interface RoundResult {
    round: number;
    playerCard: BattleCard;
    cpuCard: BattleCard;
    elementWin: Winner;
    bstWin: Winner;
    chakraWin: Winner;
    pot: number;
    playerGain: number;
    cpuGain: number;
}

type Phase = 'loading' | 'deck' | 'preview' | 'pick' | 'reveal' | 'result';

// ── Constants ──────────────────────────────────────
const RANKS: { rank: CardRank; min: number; color: string; label: string }[] = [
    { rank: 'LEGENDARY', min: 250, color: '#D4AF37', label: 'LEGENDARY' },
    { rank: 'HOLOGRAPHIC', min: 100, color: '#A855F7', label: 'HOLO' },
    { rank: 'GOLD', min: 50, color: '#F6C85F', label: 'GOLD' },
    { rank: 'SILVER', min: 20, color: '#94A3B8', label: 'SILVER' },
    { rank: 'BRONZE', min: 5, color: '#CD7F32', label: 'BRONZE' },
    { rank: 'NORMAL', min: 0, color: '#D6D3D1', label: 'NORMAL' },
];

const CHAKRA: { name: string; ja: string; color: string }[] = [
    { name: 'SEED', ja: '種', color: '#B91C1C' },
    { name: 'SPARK', ja: '芽', color: '#C2410C' },
    { name: 'FORGE', ja: '鍛', color: '#A16207' },
    { name: 'OWN', ja: '得', color: '#166534' },
    { name: 'VOICE', ja: '声', color: '#1E40AF' },
    { name: 'VISION', ja: '研', color: '#3730A3' },
    { name: 'CROWN', ja: '極', color: '#6B21A8' },
];

// ── Helpers ────────────────────────────────────────
function getRank(sp: number) {
    for (const r of RANKS) if (sp >= r.min) return r;
    return RANKS[RANKS.length - 1];
}

function toBattleCard(phrase: Phrase, sp: number, mastery: number): BattleCard {
    const r = getRank(sp);
    const bst = calcBstTotal(phrase.id);
    const bt = getBstTier(bst);
    const ch = Math.min(mastery, 6);
    const ci = CHAKRA[ch] || CHAKRA[0];
    return {
        phrase, sp, rank: r.rank, rankColor: r.color, rankLabel: r.label,
        bst, bstTier: bt.tier, bstColor: bt.color,
        chakra: ch, chakraLabel: ci.ja, chakraColor: ci.color,
    };
}

function elementWinner(a: string, b: string): Winner {
    if (ELEMENT_ADVANTAGE[a] === b) return 'player';
    if (ELEMENT_ADVANTAGE[b] === a) return 'cpu';
    return 'draw';
}

function resolveRound(round: number, p: BattleCard, c: BattleCard): RoundResult {
    const elW = elementWinner(p.phrase.category, c.phrase.category);
    const bstW: Winner = p.bst > c.bst ? 'player' : c.bst > p.bst ? 'cpu' : 'draw';
    const chW: Winner = p.chakra > c.chakra ? 'player' : c.chakra > p.chakra ? 'cpu' : 'draw';

    // Count wins: element + bst + chakra (3 axes)
    let pW = 0, cW = 0;
    [elW, bstW, chW].forEach(w => { if (w === 'player') pW++; if (w === 'cpu') cW++; });

    const pot = p.sp + c.sp + 1; // +1 so pot is never 0
    let playerPct = 0.5;
    if (pW > cW) playerPct = pW === 3 ? 1.0 : pW === 2 ? 0.75 : 0.6;
    else if (cW > pW) playerPct = cW === 3 ? 0.0 : cW === 2 ? 0.25 : 0.4;

    const playerGain = Math.round(pot * playerPct);
    return { round, playerCard: p, cpuCard: c, elementWin: elW, bstWin: bstW, chakraWin: chW, pot, playerGain, cpuGain: pot - playerGain };
}

function cpuPick(hand: BattleCard[], playerHand: BattleCard[]): number {
    // Simple: try to counter player's highest SP card's element
    const pBest = playerHand.reduce((b, c, i) => c.sp > (playerHand[b]?.sp ?? -1) ? i : b, 0);
    const target = playerHand[pBest]?.phrase.category;
    const counter = hand.findIndex(c => ELEMENT_ADVANTAGE[c.phrase.category] === target);
    if (counter >= 0) return counter;
    return hand.reduce((b, c, i) => c.bst > (hand[b]?.bst ?? -1) ? i : b, 0);
}

// ── Battle Card UI ─────────────────────────────────
function BattleCardUI({ card, selected, onClick, small }: {
    card: BattleCard; selected?: boolean; onClick?: () => void; small?: boolean;
}) {
    const w = small ? 120 : 160;
    const h = small ? 168 : 224;
    const elColor = ELEMENT_COLORS[card.phrase.category] || '#78716C';
    const isGood = card.rank === 'GOLD' || card.rank === 'HOLOGRAPHIC' || card.rank === 'LEGENDARY';

    return (
        <div onClick={onClick} style={{
            width: `${w}px`, height: `${h}px`,
            borderRadius: '14px',
            border: `${isGood ? 3 : 2}px solid ${selected ? '#D4AF37' : card.rankColor}`,
            background: card.rank === 'LEGENDARY'
                ? 'linear-gradient(135deg, #1C1917, #292524)'
                : `linear-gradient(135deg, #fff, ${elColor}08)`,
            boxShadow: selected
                ? `0 0 16px ${card.rankColor}50`
                : isGood ? `0 4px 12px ${card.rankColor}25` : '0 2px 6px rgba(0,0,0,0.06)',
            cursor: onClick ? 'pointer' : 'default',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            transform: selected ? 'translateY(-6px) scale(1.02)' : 'none',
            flexShrink: 0,
        }}>
            {/* Top: element + chakra + rank */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: small ? '3px 5px' : '4px 8px',
                backgroundColor: card.rank === 'LEGENDARY' ? 'rgba(212,175,55,0.12)' : `${elColor}10`,
                borderBottom: `1px solid ${card.rank === 'LEGENDARY' ? '#D4AF3730' : elColor + '20'}`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ElementBadge element={card.phrase.category} size={small ? 8 : 10} />
                    <span style={{
                        fontSize: small ? '7px' : '8px', fontWeight: '800',
                        color: card.chakraColor,
                        backgroundColor: card.chakraColor + '15',
                        padding: '0 3px', borderRadius: '3px',
                    }}>
                        {card.chakraLabel}
                    </span>
                </div>
                {card.rank !== 'NORMAL' && (
                    <span style={{
                        fontSize: small ? '6px' : '7px', fontWeight: '800',
                        color: card.rank === 'LEGENDARY' ? '#D4AF37' : card.rankColor,
                        letterSpacing: '0.5px',
                    }}>
                        {card.rankLabel}
                    </span>
                )}
            </div>

            {/* Content */}
            <div style={{
                flex: 1, padding: small ? '4px 5px' : '6px 8px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
                <div style={{
                    fontSize: small ? '8px' : '10px', fontWeight: '600',
                    color: card.rank === 'LEGENDARY' ? '#E7E5E4' : '#1C1917',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: small ? 3 : 4, WebkitBoxOrient: 'vertical' as const,
                }}>
                    {card.phrase.english}
                </div>
            </div>

            {/* Bottom: BST + SP */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: small ? '3px 5px' : '4px 8px',
                backgroundColor: card.rank === 'LEGENDARY' ? 'rgba(255,255,255,0.04)' : '#FAFAF9',
                borderTop: `1px solid ${card.rank === 'LEGENDARY' ? '#ffffff10' : '#F5F5F4'}`,
            }}>
                <span style={{ fontSize: small ? '7px' : '8px', fontWeight: '800', color: card.bstColor }}>
                    {card.bstTier}{card.bst}
                </span>
                <span style={{
                    fontSize: small ? '8px' : '9px', fontWeight: '800',
                    color: card.sp > 0 ? card.rankColor : '#D6D3D1',
                    fontVariantNumeric: 'tabular-nums',
                }}>
                    {card.sp}SP
                </span>
            </div>
        </div>
    );
}

// ── Judgment Badge ─────────────────────────────────
function JudgeBadge({ label, winner, pVal, cVal }: {
    label: string; winner: Winner; pVal: string; cVal: string;
}) {
    const color = winner === 'player' ? '#16A34A' : winner === 'cpu' ? '#EF4444' : '#78716C';
    const bg = winner === 'player' ? '#F0FDF4' : winner === 'cpu' ? '#FEF2F2' : '#F5F5F4';
    const text = winner === 'player' ? 'WIN' : winner === 'cpu' ? 'LOSE' : 'DRAW';

    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 16px', borderRadius: '10px',
            backgroundColor: bg, border: `1px solid ${color}25`,
            animation: 'slide-in 0.3s ease-out',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#78716C', width: '50px' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#44403C' }}>{pVal}</span>
                <span style={{ fontSize: '10px', color: '#A8A29E' }}>vs</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#44403C' }}>{cVal}</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color, padding: '2px 8px', borderRadius: '4px', backgroundColor: color + '12' }}>
                {text}
            </span>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────
export default function BattlePage() {
    const [allCards, setAllCards] = useState<BattleCard[]>([]);
    const [phase, setPhase] = useState<Phase>('loading');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [playerDeck, setPlayerDeck] = useState<BattleCard[]>([]);
    const [cpuDeck, setCpuDeck] = useState<BattleCard[]>([]);
    const [playerHand, setPlayerHand] = useState<BattleCard[]>([]);
    const [cpuHand, setCpuHand] = useState<BattleCard[]>([]);
    const [pickedIdx, setPickedIdx] = useState<number | null>(null);
    const [results, setResults] = useState<RoundResult[]>([]);
    const [reveal, setReveal] = useState<RoundResult | null>(null);
    const [step, setStep] = useState(0); // 0=cards, 1=element, 2=bst, 3=chakra, 4=pot

    const round = results.length + 1;
    const pTotal = results.reduce((s, r) => s + r.playerGain, 0);
    const cTotal = results.reduce((s, r) => s + r.cpuGain, 0);

    // Load
    useEffect(() => {
        Promise.all([
            fetch('/api/phrases').then(r => r.json()),
            fetch('/api/phrases/mastery').then(r => r.json()),
        ]).then(([pRes, mRes]) => {
            const phrases: Phrase[] = pRes.phrases || [];
            const pts: Record<string, number> = mRes.cardPoints || {};
            const mas: Record<string, number> = mRes.mastery || {};
            setAllCards(phrases.map(p => toBattleCard(p, pts[p.id] || 0, Number(mas[p.id] || 0))));
            setPhase('deck');
        }).catch(() => setPhase('deck'));
    }, []);

    const toggle = useCallback((id: string) => {
        setSelectedIds(prev => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id); else if (n.size < 5) n.add(id);
            return n;
        });
    }, []);

    const autoSelect = useCallback(() => {
        const s = [...allCards].sort(() => Math.random() - 0.5);
        setSelectedIds(new Set(s.slice(0, 5).map(c => c.phrase.id)));
    }, [allCards]);

    const startBattle = useCallback(() => {
        const deck = allCards.filter(c => selectedIds.has(c.phrase.id));
        if (deck.length !== 5) return;
        setPlayerDeck(deck); setPlayerHand([...deck]);
        const avail = allCards.filter(c => !selectedIds.has(c.phrase.id));
        const cpu = [...avail].sort(() => Math.random() - 0.5).slice(0, 5);
        setCpuDeck(cpu); setCpuHand([...cpu]);
        setResults([]); setPhase('preview');
    }, [allCards, selectedIds]);

    const confirmPick = useCallback(() => {
        if (pickedIdx === null) return;
        const pCard = playerHand[pickedIdx];
        const cIdx = cpuPick(cpuHand, playerHand);
        const cCard = cpuHand[cIdx];
        setReveal(resolveRound(round, pCard, cCard));
        setStep(0); setPhase('reveal');
        setPlayerHand(h => h.filter((_, i) => i !== pickedIdx));
        setCpuHand(h => h.filter((_, i) => i !== cIdx));
        setPickedIdx(null);
    }, [pickedIdx, playerHand, cpuHand, round]);

    const advanceReveal = useCallback(() => {
        if (step < 4) { setStep(s => s + 1); return; }
        if (reveal) setResults(prev => [...prev, reveal]);
        setReveal(null); setStep(0);
        setPhase(round >= 5 ? 'result' : 'pick');
    }, [step, reveal, round]);

    const sorted = useMemo(() => [...allCards].sort((a, b) => b.sp - a.sp).slice(0, 100), [allCards]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9', padding: '20px' }}>
            <style>{`
                @keyframes slide-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 8px rgba(212,175,55,0.2); } 50% { box-shadow: 0 0 20px rgba(212,175,55,0.5); } }
                @keyframes blink { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
            `}</style>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/english/training" style={{ fontSize: '11px', color: '#A8A29E', textDecoration: 'none' }}>training</Link>
                    <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#1C1917', letterSpacing: '2px', marginTop: '6px' }}>CARD BATTLE</h1>
                    {phase !== 'loading' && phase !== 'deck' && (
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginTop: '6px', fontSize: '13px', color: '#57534E' }}>
                            <span>YOU <strong style={{ color: '#16A34A', fontSize: '20px' }}>{pTotal}</strong></span>
                            <span>:</span>
                            <span>CPU <strong style={{ color: '#EF4444', fontSize: '20px' }}>{cTotal}</strong></span>
                            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#A8A29E' }}>Round {Math.min(round, 5)}/5</span>
                        </div>
                    )}
                </div>

                {/* ━━━ LOADING ━━━ */}
                {phase === 'loading' && (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#A8A29E' }}>Loading...</div>
                )}

                {/* ━━━ DECK SELECT ━━━ */}
                {phase === 'deck' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1C1917' }}>デッキを選べ ({selectedIds.size}/5)</div>
                                <div style={{ fontSize: '11px', color: '#78716C', marginTop: '2px' }}>4つの指標: 属性 / 種族値 / SP / チャクラ</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={autoSelect} style={{
                                    padding: '6px 14px', borderRadius: '8px', border: '1px solid #E7E5E4',
                                    backgroundColor: '#fff', color: '#78716C', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                                }}>AUTO</button>
                                <button onClick={startBattle} disabled={selectedIds.size !== 5} style={{
                                    padding: '6px 18px', borderRadius: '8px', border: 'none',
                                    backgroundColor: selectedIds.size === 5 ? '#D4AF37' : '#E7E5E4',
                                    color: selectedIds.size === 5 ? '#1C1917' : '#A8A29E',
                                    fontSize: '12px', fontWeight: '800', cursor: selectedIds.size === 5 ? 'pointer' : 'default',
                                }}>BATTLE</button>
                            </div>
                        </div>

                        {/* Selected preview */}
                        {selectedIds.size > 0 && (
                            <div style={{
                                display: 'flex', gap: '8px', marginBottom: '12px', padding: '10px',
                                backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #D4AF3730',
                                overflowX: 'auto',
                            }}>
                                {allCards.filter(c => selectedIds.has(c.phrase.id)).map(c => (
                                    <BattleCardUI key={c.phrase.id} card={c} selected onClick={() => toggle(c.phrase.id)} small />
                                ))}
                            </div>
                        )}

                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '8px', maxHeight: '55vh', overflowY: 'auto', padding: '4px',
                        }}>
                            {sorted.map(c => (
                                <BattleCardUI key={c.phrase.id} card={c}
                                    selected={selectedIds.has(c.phrase.id)}
                                    onClick={() => toggle(c.phrase.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ━━━ PREVIEW ━━━ */}
                {phase === 'preview' && (
                    <div style={{ animation: 'slide-in 0.4s ease-out' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1C1917' }}>MATCH START</div>
                            <div style={{ fontSize: '11px', color: '#78716C', marginTop: '4px' }}>相手のデッキが公開された。読め。</div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', marginBottom: '6px', letterSpacing: '1px' }}>CPU</div>
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {cpuDeck.map(c => <BattleCardUI key={c.phrase.id} card={c} small />)}
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '900', color: '#D6D3D1', margin: '8px 0' }}>VS</div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#16A34A', marginBottom: '6px', letterSpacing: '1px' }}>YOU</div>
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {playerDeck.map(c => <BattleCardUI key={c.phrase.id} card={c} small />)}
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button onClick={() => { setPickedIdx(null); setPhase('pick'); }} style={{
                                padding: '10px 32px', borderRadius: '10px', border: 'none',
                                backgroundColor: '#D4AF37', color: '#1C1917',
                                fontSize: '14px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px',
                            }}>FIGHT</button>
                        </div>
                    </div>
                )}

                {/* ━━━ PICK ━━━ */}
                {phase === 'pick' && (
                    <div style={{ animation: 'slide-in 0.3s ease-out' }}>
                        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#D4AF37', letterSpacing: '2px' }}>ROUND {round}</span>
                        </div>

                        {/* CPU hand */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', marginBottom: '4px' }}>CPU ({cpuHand.length})</div>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                {cpuHand.map(c => <BattleCardUI key={c.phrase.id} card={c} small />)}
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: '900', color: '#D6D3D1', margin: '6px 0' }}>VS</div>

                        {/* Player hand */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#16A34A', marginBottom: '4px' }}>YOU ({playerHand.length})</div>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                {playerHand.map((c, i) => (
                                    <BattleCardUI key={c.phrase.id} card={c} small
                                        selected={pickedIdx === i} onClick={() => setPickedIdx(i)}
                                    />
                                ))}
                            </div>
                        </div>

                        {pickedIdx !== null && (
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={confirmPick} style={{
                                    padding: '8px 28px', borderRadius: '8px', border: 'none',
                                    backgroundColor: '#D4AF37', color: '#1C1917',
                                    fontSize: '13px', fontWeight: '800', cursor: 'pointer',
                                }}>GO</button>
                            </div>
                        )}

                        {/* History */}
                        {results.length > 0 && (
                            <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #E7E5E4' }}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#A8A29E', marginBottom: '6px', letterSpacing: '1px' }}>HISTORY</div>
                                {results.map((r, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '4px 0', borderBottom: i < results.length - 1 ? '1px solid #F5F5F4' : 'none',
                                        fontSize: '11px',
                                    }}>
                                        <span style={{ fontWeight: '700', color: '#A8A29E', width: '30px' }}>R{r.round}</span>
                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <ElementBadge element={r.playerCard.phrase.category} size={8} />
                                            <span style={{ color: '#A8A29E', fontSize: '9px' }}>vs</span>
                                            <ElementBadge element={r.cpuCard.phrase.category} size={8} />
                                        </div>
                                        <span style={{ fontWeight: '800', color: '#16A34A' }}>+{r.playerGain}</span>
                                        <span style={{ fontWeight: '800', color: '#EF4444' }}>+{r.cpuGain}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ━━━ REVEAL ━━━ */}
                {phase === 'reveal' && reveal && (
                    <div onClick={advanceReveal} style={{ cursor: 'pointer', animation: 'slide-in 0.3s ease-out' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#D4AF37', letterSpacing: '2px' }}>ROUND {reveal.round}</span>
                        </div>

                        {/* Cards face off */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#16A34A', marginBottom: '4px' }}>YOU</div>
                                <BattleCardUI card={reveal.playerCard} />
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: '900', color: '#D6D3D1' }}>VS</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', marginBottom: '4px' }}>CPU</div>
                                <BattleCardUI card={reveal.cpuCard} />
                            </div>
                        </div>

                        {/* Progressive judgments */}
                        <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {step >= 1 && (
                                <JudgeBadge label="属性"
                                    winner={reveal.elementWin}
                                    pVal={ELEMENT_LABELS[reveal.playerCard.phrase.category]}
                                    cVal={ELEMENT_LABELS[reveal.cpuCard.phrase.category]}
                                />
                            )}
                            {step >= 2 && (
                                <JudgeBadge label="種族値"
                                    winner={reveal.bstWin}
                                    pVal={`${reveal.playerCard.bstTier}${reveal.playerCard.bst}`}
                                    cVal={`${reveal.cpuCard.bstTier}${reveal.cpuCard.bst}`}
                                />
                            )}
                            {step >= 3 && (
                                <JudgeBadge label="チャクラ"
                                    winner={reveal.chakraWin}
                                    pVal={`${reveal.playerCard.chakraLabel}`}
                                    cVal={`${reveal.cpuCard.chakraLabel}`}
                                />
                            )}
                            {step >= 4 && (
                                <div style={{
                                    padding: '14px 16px', borderRadius: '12px',
                                    backgroundColor: '#fff', border: '1px solid #D4AF3730',
                                    animation: 'slide-in 0.3s ease-out, pulse-glow 2s ease-in-out infinite',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#D4AF37', letterSpacing: '2px', marginBottom: '6px' }}>
                                        POT {reveal.pot} SP
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                                        <div>
                                            <div style={{ fontSize: '9px', color: '#A8A29E' }}>YOU</div>
                                            <div style={{ fontSize: '22px', fontWeight: '900', color: '#16A34A' }}>+{reveal.playerGain}</div>
                                        </div>
                                        <div style={{ width: '1px', backgroundColor: '#E7E5E4' }} />
                                        <div>
                                            <div style={{ fontSize: '9px', color: '#A8A29E' }}>CPU</div>
                                            <div style={{ fontSize: '22px', fontWeight: '900', color: '#EF4444' }}>+{reveal.cpuGain}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#A8A29E', animation: 'blink 1.5s ease-in-out infinite' }}>
                            TAP TO CONTINUE
                        </div>
                    </div>
                )}

                {/* ━━━ RESULT ━━━ */}
                {phase === 'result' && (
                    <div style={{ animation: 'slide-in 0.5s ease-out' }}>
                        <div style={{
                            textAlign: 'center', padding: '28px', marginBottom: '20px', borderRadius: '16px',
                            backgroundColor: pTotal > cTotal ? '#F0FDF4' : cTotal > pTotal ? '#FEF2F2' : '#FFFBEB',
                            border: `2px solid ${pTotal > cTotal ? '#16A34A' : cTotal > pTotal ? '#EF4444' : '#D4AF37'}30`,
                        }}>
                            <div style={{
                                fontSize: '28px', fontWeight: '900', letterSpacing: '4px',
                                color: pTotal > cTotal ? '#16A34A' : cTotal > pTotal ? '#EF4444' : '#D4AF37',
                                marginBottom: '6px',
                            }}>
                                {pTotal > cTotal ? 'YOU WIN' : cTotal > pTotal ? 'YOU LOSE' : 'DRAW'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px', color: '#57534E' }}>
                                <span>YOU <strong style={{ color: '#16A34A', fontSize: '22px' }}>{pTotal}</strong></span>
                                <span>CPU <strong style={{ color: '#EF4444', fontSize: '22px' }}>{cTotal}</strong></span>
                            </div>
                        </div>

                        {/* Round summary */}
                        <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #E7E5E4', marginBottom: '20px' }}>
                            {results.map((r, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '6px 0', borderBottom: i < results.length - 1 ? '1px solid #F5F5F4' : 'none',
                                }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#A8A29E', width: '30px' }}>R{r.round}</span>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1 }}>
                                        {[
                                            { w: r.elementWin, label: '属' },
                                            { w: r.bstWin, label: '種' },
                                            { w: r.chakraWin, label: '修' },
                                        ].map((j, ji) => (
                                            <span key={ji} style={{
                                                fontSize: '9px', fontWeight: '700', padding: '1px 5px', borderRadius: '3px',
                                                color: j.w === 'player' ? '#16A34A' : j.w === 'cpu' ? '#EF4444' : '#A8A29E',
                                                backgroundColor: j.w === 'player' ? '#F0FDF4' : j.w === 'cpu' ? '#FEF2F2' : '#F5F5F4',
                                            }}>
                                                {j.label}{j.w === 'player' ? 'W' : j.w === 'cpu' ? 'L' : 'D'}
                                            </span>
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#16A34A', width: '40px', textAlign: 'right' }}>+{r.playerGain}</span>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444', width: '40px', textAlign: 'right' }}>+{r.cpuGain}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => { setPhase('deck'); setSelectedIds(new Set()); setResults([]); }} style={{
                                padding: '10px 24px', borderRadius: '10px', border: '1px solid #E7E5E4',
                                backgroundColor: '#fff', color: '#57534E', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                            }}>DECK SELECT</button>
                            <button onClick={() => { setResults([]); setPlayerHand([...playerDeck]); setCpuHand([...cpuDeck]); setPhase('preview'); }} style={{
                                padding: '10px 24px', borderRadius: '10px', border: 'none',
                                backgroundColor: '#D4AF37', color: '#1C1917', fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                            }}>REMATCH</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
