'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CATEGORY_META, type GorokuCategory } from '@/data/english/ore-goroku';
import { GOROKU_SEEDS } from '@/data/english/goroku-seed';

// ── Types ──

interface GorokuEntry {
    id: string;
    day_slot: number;
    japanese: string;
    english: string[];
    literal: string | null;
    context: string;
    category: string;
    mastery_level: number;
    slot: string | null;
    slot_hints: string[] | null;
}

// ── 4-Level System ──
// Each level answers a different learning question:
//   0: Core (核)   — What IS the phrase? Minimum deployable unit
//   1: Vibe (空気)  — HOW do you say it? With personality and feeling
//   2: Scene (場面) — WHERE does it go? In a real situation
//   3: Flow (流れ)  — What does native THOUGHT FLOW sound like?

const LEVELS = [
    { key: 'core', label: 'Core', ja: '核', desc: '最短の型', color: '#78716C' },
    { key: 'vibe', label: 'Vibe', ja: '空気', desc: '感情込み', color: '#D4AF37' },
    { key: 'scene', label: 'Scene', ja: '場面', desc: '実際の一言', color: '#10B981' },
    { key: 'flow', label: 'Flow', ja: '流れ', desc: 'ネイティブの脳内', color: '#3B82F6' },
] as const;

// ── Data ──

function buildEntries(): GorokuEntry[] {
    const counters: Record<number, number> = {};
    return GOROKU_SEEDS.map(seed => {
        const idx = counters[seed.daySlot] || 0;
        counters[seed.daySlot] = idx + 1;
        return {
            id: `d${String(seed.daySlot).padStart(2, '0')}_${idx}`,
            day_slot: seed.daySlot,
            japanese: seed.japanese,
            english: seed.english,
            literal: seed.literal || null,
            context: seed.context,
            category: seed.category,
            mastery_level: 0,
            slot: seed.slot || null,
            slot_hints: seed.slotHints || null,
        };
    });
}

const MASTERY_KEY = 'goroku-mastery';

function loadMastery(): Record<string, number> {
    try {
        const saved = localStorage.getItem(MASTERY_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
}

function saveMastery(mastery: Record<string, number>) {
    try { localStorage.setItem(MASTERY_KEY, JSON.stringify(mastery)); } catch { /* ignore */ }
}

const CATEGORY_COLORS: Record<string, { fg: string; bg: string }> = {
    reaction: { fg: '#D4AF37', bg: '#FEF9E7' },
    request: { fg: '#10B981', bg: '#ECFDF5' },
    opinion: { fg: '#3B82F6', bg: '#EFF6FF' },
    suggestion: { fg: '#8B5CF6', bg: '#F5F3FF' },
    filler: { fg: '#F59E0B', bg: '#FFFBEB' },
    shutdown: { fg: '#EF4444', bg: '#FEF2F2' },
};

// ── Component ──

export default function GorokuV2Page() {
    const [entries, setEntries] = useState<GorokuEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [levelMap, setLevelMap] = useState<Record<string, number>>({});
    const [globalLevel, setGlobalLevel] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [registeredPhrases, setRegisteredPhrases] = useState<Set<string>>(new Set());
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const dayStripRef = useRef<HTMLDivElement>(null);

    const today = new Date().getDate();

    useEffect(() => {
        const allEntries = buildEntries();
        const mastery = loadMastery();
        setEntries(allEntries.map(e => ({ ...e, mastery_level: mastery[e.id] || 0 })));
        fetch('/api/phrases').then(r => r.json()).then(data => {
            if (data.success && data.phrases) {
                setRegisteredPhrases(new Set(
                    data.phrases.map((p: { english: string }) => p.english.toLowerCase())
                ));
            }
        }).catch(() => {});
        setLoading(false);
    }, []);

    // Scroll day strip to selected day on mount
    useEffect(() => {
        if (dayStripRef.current) {
            const btn = dayStripRef.current.querySelector(`[data-day="${selectedDay}"]`) as HTMLElement;
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [selectedDay]);

    const byDay = useMemo(() => {
        const map: Record<number, GorokuEntry[]> = {};
        entries.forEach(e => {
            if (!map[e.day_slot]) map[e.day_slot] = [];
            map[e.day_slot].push(e);
        });
        return map;
    }, [entries]);

    const selectedEntries = useMemo(() => {
        const dayEntries = byDay[selectedDay] || [];
        if (!categoryFilter) return dayEntries;
        return dayEntries.filter(e => e.category === categoryFilter);
    }, [selectedDay, byDay, categoryFilter]);

    const totalMastered = entries.filter(e => e.mastery_level >= 3).length;

    // Category counts for selected day
    const dayCategoryCounts = useMemo(() => {
        const dayEntries = byDay[selectedDay] || [];
        const counts: Record<string, number> = {};
        dayEntries.forEach(e => { counts[e.category] = (counts[e.category] || 0) + 1; });
        return counts;
    }, [selectedDay, byDay]);

    const speak = useCallback((text: string, id: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes('Samantha'))
            || voices.find(v => v.lang === 'en-US' && v.localService);
        if (preferred) utterance.voice = preferred;
        setPlayingId(id);
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
    }, []);

    const toggleLearned = useCallback((entry: GorokuEntry) => {
        const next = entry.mastery_level >= 3 ? 0 : 3;
        setEntries(prev => prev.map(e =>
            e.id === entry.id ? { ...e, mastery_level: next } : e
        ));
        const mastery = loadMastery();
        mastery[entry.id] = next;
        saveMastery(mastery);
    }, []);

    const cycleLevel = useCallback((entryId: string, maxLevel: number) => {
        setLevelMap(prev => ({
            ...prev,
            [entryId]: ((prev[entryId] ?? 1) + 1) % (maxLevel + 1),
        }));
    }, []);

    const getDisplayText = useCallback((entry: GorokuEntry): string => {
        const arr = Array.isArray(entry.english) ? entry.english : [entry.english];
        const lvl = globalLevel ?? levelMap[entry.id] ?? 1;
        return arr[lvl] || arr[1] || arr[0];
    }, [levelMap, globalLevel]);

    const registerToPhrase = async (entry: GorokuEntry) => {
        const phrase = getDisplayText(entry);
        if (registeredPhrases.has(phrase.toLowerCase())) return;
        setRegisteringId(entry.id);
        try {
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: phrase,
                    japanese: entry.japanese,
                    category: 'expression',
                    date: dateStr,
                }),
            });
            const data = await res.json();
            if (data.success || res.status === 409) {
                setRegisteredPhrases(prev => new Set(prev).add(phrase.toLowerCase()));
            }
        } catch (err) {
            console.error('Failed to register phrase:', err);
        } finally {
            setRegisteringId(null);
        }
    };

    // Keyboard nav
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); setSelectedDay(d => Math.max(1, d - 1)); setCategoryFilter(null); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setSelectedDay(d => Math.min(31, d + 1)); setCategoryFilter(null); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF9' }}>
                <span style={{ color: '#A8A29E', fontSize: '13px' }}>Loading...</span>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FAFAF9',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}>
            {/* ── Header ── */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: 'rgba(250,250,249,0.92)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #F5F5F4',
            }}>
                <div style={{
                    maxWidth: '640px', margin: '0 auto',
                    padding: '16px 20px 0',
                }}>
                    {/* Title row */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                        marginBottom: '12px',
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '20px', fontWeight: '800', color: '#1C1917',
                                letterSpacing: '-0.5px', margin: 0,
                            }}>
                                俺語録
                            </h1>
                            <p style={{
                                fontSize: '11px', color: '#A8A29E', margin: '2px 0 0',
                                letterSpacing: '0.5px',
                            }}>
                                310 expressions / 31 days / 4 levels
                            </p>
                        </div>
                        <div style={{
                            fontSize: '13px', fontWeight: '700', color: '#D4AF37',
                        }}>
                            {totalMastered}<span style={{ color: '#D6D3D1', fontWeight: '400' }}>/310</span>
                        </div>
                    </div>

                    {/* Level toggle */}
                    <div style={{
                        display: 'flex', gap: '2px', marginBottom: '12px',
                        backgroundColor: '#F5F5F4', borderRadius: '8px', padding: '3px',
                    }}>
                        {LEVELS.map((lv, i) => {
                            const isActive = globalLevel === i;
                            return (
                                <button
                                    key={lv.key}
                                    onClick={() => setGlobalLevel(isActive ? null : i)}
                                    style={{
                                        flex: 1, textAlign: 'center',
                                        padding: '4px 0',
                                        borderRadius: '6px',
                                        border: 'none', cursor: 'pointer',
                                        backgroundColor: isActive ? '#fff' : 'transparent',
                                        boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <div style={{
                                        fontSize: '10px', fontWeight: '700',
                                        color: isActive ? lv.color : '#A8A29E',
                                        letterSpacing: '0.5px',
                                    }}>
                                        {lv.label}
                                    </div>
                                    <div style={{
                                        fontSize: '9px',
                                        color: isActive ? '#78716C' : '#D6D3D1',
                                    }}>
                                        {lv.desc}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Day strip */}
                    <div
                        ref={dayStripRef}
                        style={{
                            display: 'flex', gap: '4px', overflowX: 'auto',
                            paddingBottom: '12px',
                            scrollbarWidth: 'none',
                        }}
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                            const isSelected = d === selectedDay;
                            const isToday = d === today;
                            const dayEntries = byDay[d] || [];
                            const masteredCount = dayEntries.filter(e => e.mastery_level >= 3).length;
                            const hasEntries = dayEntries.length > 0;
                            const allMastered = hasEntries && masteredCount === dayEntries.length;

                            return (
                                <button
                                    key={d}
                                    data-day={d}
                                    onClick={() => { setSelectedDay(d); setCategoryFilter(null); }}
                                    style={{
                                        minWidth: '36px', height: '44px',
                                        borderRadius: '10px', border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: '2px',
                                        backgroundColor: isSelected ? '#1C1917' : 'transparent',
                                        transition: 'all 0.15s',
                                        flexShrink: 0,
                                    }}
                                >
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: isSelected || isToday ? '700' : '500',
                                        color: isSelected ? '#fff' : isToday ? '#D4AF37' : hasEntries ? '#57534E' : '#D6D3D1',
                                    }}>
                                        {d}
                                    </span>
                                    {hasEntries && (
                                        <div style={{
                                            width: '4px', height: '4px', borderRadius: '50%',
                                            backgroundColor: isSelected
                                                ? (allMastered ? '#D4AF37' : '#fff')
                                                : (allMastered ? '#D4AF37' : '#D6D3D1'),
                                        }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{
                maxWidth: '640px', margin: '0 auto',
                padding: '12px 20px 80px',
            }}>
                {/* Category filter */}
                {Object.keys(dayCategoryCounts).length > 1 && (
                    <div style={{
                        display: 'flex', gap: '6px', flexWrap: 'wrap',
                        marginBottom: '12px',
                    }}>
                        {Object.entries(dayCategoryCounts).map(([cat, count]) => {
                            const colors = CATEGORY_COLORS[cat] || { fg: '#78716C', bg: '#F5F5F4' };
                            const isActive = categoryFilter === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(isActive ? null : cat)}
                                    style={{
                                        padding: '4px 10px', borderRadius: '12px',
                                        border: 'none', cursor: 'pointer',
                                        fontSize: '11px', fontWeight: '600',
                                        backgroundColor: isActive ? colors.fg : colors.bg,
                                        color: isActive ? '#fff' : colors.fg,
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {CATEGORY_META[cat as GorokuCategory]?.en || cat} {count}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Entry cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedEntries.length === 0 && (
                        <div style={{
                            textAlign: 'center', padding: '40px 0',
                            color: '#D6D3D1', fontSize: '13px',
                        }}>
                            No expressions for Day {selectedDay}
                        </div>
                    )}
                    {selectedEntries.map((entry) => {
                        const isPlaying = playingId === entry.id;
                        const learned = entry.mastery_level >= 3;
                        const currentLevel = globalLevel ?? levelMap[entry.id] ?? 1;
                        const englishArr = Array.isArray(entry.english) ? entry.english : [entry.english];
                        const maxLevel = englishArr.length - 1;
                        const displayText = getDisplayText(entry);
                        const levelInfo = LEVELS[currentLevel] || LEVELS[1];
                        const isFlow = currentLevel === 3;
                        const isExpanded = expandedId === entry.id;
                        const catColors = CATEGORY_COLORS[entry.category] || { fg: '#78716C', bg: '#F5F5F4' };

                        return (
                            <div
                                key={entry.id}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '14px',
                                    border: isPlaying ? '1.5px solid #D4AF37' : '1px solid #F5F5F4',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s',
                                    opacity: learned ? 0.55 : 1,
                                }}
                            >
                                {/* Main card content */}
                                <div style={{ padding: '14px 16px 10px' }}>
                                    {/* Top row: category tag + learned */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', marginBottom: '8px',
                                    }}>
                                        <span style={{
                                            fontSize: '9px', fontWeight: '700',
                                            color: catColors.fg,
                                            backgroundColor: catColors.bg,
                                            padding: '2px 8px', borderRadius: '6px',
                                            letterSpacing: '0.5px', textTransform: 'uppercase',
                                        }}>
                                            {CATEGORY_META[entry.category as GorokuCategory]?.en || entry.category}
                                        </span>
                                        <button
                                            onClick={() => toggleLearned(entry)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '16px', padding: '0 2px',
                                                color: learned ? '#D4AF37' : '#E7E5E4',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            {learned ? '\u2713' : '\u25CB'}
                                        </button>
                                    </div>

                                    {/* Japanese */}
                                    <div style={{
                                        fontSize: '16px', fontWeight: '800', color: '#1C1917',
                                        lineHeight: 1.4, marginBottom: '6px',
                                    }}>
                                        {entry.japanese}
                                    </div>

                                    {/* English (tap to cycle) */}
                                    <div
                                        onClick={() => cycleLevel(entry.id, maxLevel)}
                                        style={{ cursor: 'pointer', marginBottom: '6px' }}
                                    >
                                        <div style={{
                                            fontSize: isFlow ? '12px' : '14px',
                                            fontWeight: '600',
                                            color: levelInfo.color,
                                            lineHeight: isFlow ? 1.8 : 1.5,
                                            transition: 'all 0.2s',
                                        }}>
                                            {displayText}
                                        </div>
                                    </div>

                                    {/* Level indicator: dots + label */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        marginBottom: '4px',
                                    }}>
                                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                            {englishArr.map((_, i) => (
                                                <div
                                                    key={i}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLevelMap(prev => ({ ...prev, [entry.id]: i }));
                                                    }}
                                                    style={{
                                                        width: i === currentLevel ? '16px' : '6px',
                                                        height: '6px',
                                                        borderRadius: '3px',
                                                        backgroundColor: i === currentLevel
                                                            ? (LEVELS[i]?.color || '#D4AF37')
                                                            : '#E7E5E4',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span style={{
                                            fontSize: '9px', fontWeight: '600',
                                            color: levelInfo.color,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                        }}>
                                            {levelInfo.label}
                                        </span>
                                        {/* Phrases + Play */}
                                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            {(() => {
                                                const phraseText = displayText.toLowerCase();
                                                const alreadyRegistered = registeredPhrases.has(phraseText);
                                                const isRegistering = registeringId === entry.id;
                                                return (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); !alreadyRegistered && !isRegistering && registerToPhrase(entry); }}
                                                        disabled={alreadyRegistered || isRegistering}
                                                        style={{
                                                            padding: '3px 8px',
                                                            borderRadius: '8px',
                                                            border: alreadyRegistered ? '1px solid #E7E5E4' : '1px solid #D4AF37',
                                                            backgroundColor: alreadyRegistered ? '#FAFAF9' : '#fff',
                                                            color: alreadyRegistered ? '#D6D3D1' : '#D4AF37',
                                                            fontSize: '9px',
                                                            fontWeight: '600',
                                                            cursor: alreadyRegistered ? 'default' : 'pointer',
                                                            transition: 'all 0.15s',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {alreadyRegistered ? 'Done' : isRegistering ? '...' : '+Phrases'}
                                                    </button>
                                                );
                                            })()}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); speak(displayText, entry.id); }}
                                                style={{
                                                    width: '28px', height: '28px',
                                                    borderRadius: '50%', border: 'none',
                                                    cursor: 'pointer',
                                                    backgroundColor: isPlaying ? '#1C1917' : '#F5F5F4',
                                                    color: isPlaying ? '#fff' : '#78716C',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '11px',
                                                    transition: 'all 0.15s',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {isPlaying ? '\u25A0' : '\u25B6'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Context (tap to expand/collapse) */}
                                <div
                                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                    style={{
                                        borderTop: '1px solid #F5F5F4',
                                        padding: isExpanded ? '10px 16px 14px' : '8px 16px',
                                        cursor: 'pointer',
                                        backgroundColor: isExpanded ? '#FAFAF9' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {isExpanded ? (
                                        <div style={{
                                            fontSize: '12px', color: '#57534E',
                                            lineHeight: 1.8,
                                        }}>
                                            {entry.context}
                                        </div>
                                    ) : (
                                        <div style={{
                                            fontSize: '11px', color: '#A8A29E',
                                            whiteSpace: 'nowrap', overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {entry.context}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
