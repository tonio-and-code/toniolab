'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { V4_SEEDS, type V4Entry } from '@/data/english/goroku-v4-seed';

interface V4DisplayEntry extends V4Entry {
    id: string;
}

const REVIEWED_KEY = 'self-master-reviewed';
const REGISTERED_KEY = 'goroku-v4-registered';

const CATEGORY_COLORS: Record<string, { fg: string; bg: string; label: string }> = {
    reaction: { fg: '#D4AF37', bg: '#FEF9E7', label: 'Reaction' },
    shutdown: { fg: '#EF4444', bg: '#FEF2F2', label: 'Shutdown' },
    filler:   { fg: '#F59E0B', bg: '#FFFBEB', label: 'Filler' },
    opinion:  { fg: '#3B82F6', bg: '#EFF6FF', label: 'Opinion' },
    request:  { fg: '#10B981', bg: '#ECFDF5', label: 'Request' },
    meta:     { fg: '#8B5CF6', bg: '#F5F3FF', label: 'Meta' },
};

function loadReviewed(): Set<number> {
    try {
        const saved = localStorage.getItem(REVIEWED_KEY);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
}

function saveReviewed(days: Set<number>) {
    try { localStorage.setItem(REVIEWED_KEY, JSON.stringify([...days])); } catch { /* ignore */ }
}

function buildAllEntries(): V4DisplayEntry[] {
    const counters: Record<number, number> = {};
    return V4_SEEDS.map(seed => {
        const idx = counters[seed.daySlot] || 0;
        counters[seed.daySlot] = idx + 1;
        return {
            ...seed,
            id: `v4_d${seed.daySlot}_${idx}`,
        };
    });
}

export default function SelfMasterPage() {
    const now = new Date();
    const todayDate = now.getDate();

    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [entries, setEntries] = useState<V4DisplayEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [playedIds, setPlayedIds] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem('selfmaster-played');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [registeredPhrases, setRegisteredPhrases] = useState<Set<string>>(new Set());
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [reviewedDays, setReviewedDays] = useState<Set<number>>(new Set());
    const detailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        setEntries(buildAllEntries());
        setReviewedDays(loadReviewed());
        try {
            const saved = localStorage.getItem(REGISTERED_KEY);
            if (saved) setRegisteredPhrases(new Set(JSON.parse(saved)));
        } catch { /* ignore */ }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading && selectedDay === null) {
            setSelectedDay(todayDate <= 31 ? todayDate : 1);
        }
    }, [loading, selectedDay, todayDate]);

    useEffect(() => {
        if (detailRef.current) detailRef.current.scrollTop = 0;
        setExpandedId(null);
    }, [selectedDay]);

    // Auto-complete: all entries played for selected day
    useEffect(() => {
        if (!selectedDay) return;
        const dayEntries = byDay[selectedDay] || [];
        if (dayEntries.length === 0) return;
        if (dayEntries.every(e => playedIds.has(e.id)) && !reviewedDays.has(selectedDay)) {
            const next = new Set(reviewedDays);
            next.add(selectedDay);
            setReviewedDays(next);
            saveReviewed(next);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedIds, selectedDay]);

    const byDay = useMemo(() => {
        const map: Record<number, V4DisplayEntry[]> = {};
        entries.forEach(e => {
            if (!map[e.daySlot]) map[e.daySlot] = [];
            map[e.daySlot].push(e);
        });
        return map;
    }, [entries]);

    const selectedEntries = useMemo(() => {
        if (!selectedDay) return [];
        return byDay[selectedDay] || [];
    }, [selectedDay, byDay]);

    const daysWithData = useMemo(() => Object.keys(byDay).map(Number).sort((a, b) => a - b), [byDay]);
    const totalEntries = entries.length;

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!selectedDay) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const idx = daysWithData.indexOf(selectedDay);
                if (idx > 0) setSelectedDay(daysWithData[idx - 1]);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const idx = daysWithData.indexOf(selectedDay);
                if (idx < daysWithData.length - 1) setSelectedDay(daysWithData[idx + 1]);
            } else if (e.key === ' ') {
                e.preventDefault();
                toggleDayReviewed();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDay, daysWithData]);

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
        utterance.onend = () => {
            setPlayingId(null);
            setPlayedIds(prev => {
                const next = new Set(prev).add(id);
                try { localStorage.setItem('selfmaster-played', JSON.stringify([...next])); } catch { /* */ }
                return next;
            });
        };
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
    }, []);

    const registerToDb = async (entry: V4DisplayEntry) => {
        if (registeredPhrases.has(entry.english.toLowerCase())) return;
        setRegisteringId(entry.id);
        try {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: entry.english,
                    japanese: entry.japanese,
                    category: 'ore-log',
                    date: dateStr,
                }),
            });
            const data = await res.json();
            if (data.success || res.status === 409) {
                const key = entry.english.toLowerCase();
                setRegisteredPhrases(prev => {
                    const next = new Set(prev).add(key);
                    try { localStorage.setItem(REGISTERED_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
                    return next;
                });
            }
        } catch (err) {
            console.error('Failed to register phrase:', err);
        } finally {
            setRegisteringId(null);
        }
    };

    const toggleDayReviewed = useCallback(() => {
        if (!selectedDay) return;
        setReviewedDays(prev => {
            const next = new Set(prev);
            if (next.has(selectedDay)) next.delete(selectedDay);
            else next.add(selectedDay);
            saveReviewed(next);
            return next;
        });
    }, [selectedDay]);

    // Fixed 31-day grid (no month dependency)
    const gridCells: number[] = [];
    for (let d = 1; d <= 31; d++) gridCells.push(d);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', backgroundColor: '#FAFAF9',
            }}>
                <span style={{ color: '#A8A29E', fontSize: '13px', letterSpacing: '0.5px' }}>
                    Loading...
                </span>
            </div>
        );
    }

    const dayIsReviewed = selectedDay ? reviewedDays.has(selectedDay) : false;
    const selectedDayPlayedCount = selectedDay
        ? (byDay[selectedDay] || []).filter(e => playedIds.has(e.id)).length
        : 0;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9', maxWidth: '100vw', overflowX: 'hidden' }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: isMobile ? 'auto' : '100vh',
            }}>
                {/* Left: Fixed 31-day grid */}
                <div style={{
                    flex: isMobile ? 'none' : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: isMobile ? 'hidden' : 'auto',
                    minWidth: 0,
                    padding: isMobile ? '16px 12px' : '20px 24px',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'flex-start', marginBottom: '12px',
                        }}>
                            <div>
                                <h1 style={{
                                    fontSize: '22px', fontWeight: '900', color: '#1C1917',
                                    margin: 0, letterSpacing: '-0.5px', lineHeight: 1,
                                }}>
                                    {'\u30BB\u30EB\u30D5\u30DE\u30B9\u30BF\u30FC'}
                                </h1>
                                <p style={{
                                    fontSize: '11px', color: '#A8A29E', margin: '6px 0 0 0',
                                    letterSpacing: '0.5px',
                                }}>
                                    {totalEntries} expressions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fixed 31-day grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '3px',
                        flex: isMobile ? 'none' : 1,
                        minHeight: 0,
                    }}>
                        {gridCells.map(day => {
                            const dayEntries = byDay[day] || [];
                            const count = dayEntries.length;
                            const isToday = day === todayDate;
                            const isSelected = day === selectedDay;

                            const masteredCount = count > 0
                                ? dayEntries.filter(e => playedIds.has(e.id)).length
                                : 0;
                            const progress = count > 0 ? masteredCount / count : 0;
                            const isComplete = progress === 1 && count > 0;

                            const bgColor = count === 0
                                ? 'transparent'
                                : isSelected
                                    ? '#FEF9E7'
                                    : isComplete
                                        ? '#FBF5E4'
                                        : progress > 0
                                            ? '#FEFCF6'
                                            : '#fff';

                            return (
                                <div
                                    key={day}
                                    onClick={() => { if (count > 0) setSelectedDay(day); }}
                                    style={{
                                        borderRadius: '8px',
                                        cursor: count > 0 ? 'pointer' : 'default',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '2px',
                                        padding: isMobile ? '5px 2px' : '8px 4px',
                                        backgroundColor: bgColor,
                                        border: isSelected
                                            ? '2px solid #D4AF37'
                                            : isToday
                                                ? '2px solid #D4AF37'
                                                : count > 0
                                                    ? '1px solid #EEECE7'
                                                    : '1px solid transparent',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <span style={{
                                        fontSize: isMobile ? '12px' : '13px',
                                        fontWeight: isToday || isSelected ? '800' : count > 0 ? '600' : '400',
                                        color: count === 0
                                            ? '#D6D3D1'
                                            : isSelected
                                                ? '#D4AF37'
                                                : isComplete
                                                    ? '#92400E'
                                                    : '#57534E',
                                        lineHeight: 1,
                                    }}>
                                        {day}
                                    </span>

                                    {count > 0 && (
                                        <div style={{
                                            width: '80%', height: '3px',
                                            borderRadius: '2px',
                                            backgroundColor: '#EEECE7',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                width: `${progress * 100}%`,
                                                height: '100%', borderRadius: '2px',
                                                backgroundColor: isComplete ? '#D4AF37' : progress > 0 ? '#D4AF37' : 'transparent',
                                                transition: 'width 0.4s ease',
                                            }} />
                                        </div>
                                    )}

                                    {count > 0 && (
                                        <span style={{
                                            fontSize: isMobile ? '8px' : '9px',
                                            fontWeight: '600',
                                            color: isComplete ? '#D4AF37' : '#A8A29E',
                                            lineHeight: 1,
                                        }}>
                                            {isComplete ? '\u2713' : `${masteredCount}/${count}`}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Keyboard hint */}
                    {!isMobile && selectedDay && (
                        <div style={{
                            marginTop: '12px', textAlign: 'center',
                            fontSize: '10px', color: '#D6D3D1', letterSpacing: '0.3px',
                        }}>
                            &#8592; &#8594; navigate &middot; space = toggle reviewed
                        </div>
                    )}

                    <style>{`
                        @keyframes todayPulse {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.2); }
                            50% { box-shadow: 0 0 0 4px rgba(212,175,55,0.13); }
                        }
                    `}</style>
                </div>

                {/* Right: Detail Panel */}
                <div
                    ref={detailRef}
                    style={{
                        width: isMobile ? '100%' : '420px',
                        borderLeft: isMobile ? 'none' : '1px solid #F5F5F4',
                        borderTop: isMobile ? '1px solid #F5F5F4' : 'none',
                        backgroundColor: '#fff',
                        overflow: 'auto',
                        flexShrink: 0,
                        minHeight: isMobile ? '300px' : 'auto',
                    }}
                >
                    {selectedDay && selectedEntries.length > 0 ? (
                        <div style={{ padding: '20px' }}>
                            {/* Day header */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'baseline', gap: '8px',
                                    marginBottom: '10px',
                                }}>
                                    <span style={{
                                        fontSize: '32px', fontWeight: '900', color: '#D4AF37',
                                        lineHeight: 1, letterSpacing: '-1px',
                                    }}>
                                        Day {selectedDay}
                                    </span>
                                    {selectedDayPlayedCount > 0 && (
                                        <span style={{
                                            fontSize: '10px', color: '#D6D3D1', fontWeight: '500',
                                        }}>
                                            {selectedDayPlayedCount}/{selectedEntries.length} played
                                        </span>
                                    )}
                                </div>

                                {/* Review complete button */}
                                <button
                                    onClick={toggleDayReviewed}
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        borderRadius: '10px',
                                        border: '2px solid #D4AF37',
                                        backgroundColor: dayIsReviewed ? '#D4AF37' : '#fff',
                                        color: dayIsReviewed ? '#fff' : '#D4AF37',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        marginBottom: '12px',
                                    }}
                                >
                                    {dayIsReviewed ? '\u2713 \u5B8C\u4E86' : '\u5FA9\u7FD2\u5B8C\u4E86\u306B\u3059\u308B'}
                                </button>

                                {/* Category badges */}
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {Array.from(new Set(selectedEntries.map(e => e.category))).map(cat => {
                                        const c = CATEGORY_COLORS[cat];
                                        if (!c) return null;
                                        return (
                                            <span key={cat} style={{
                                                fontSize: '9px', fontWeight: '700',
                                                padding: '2px 8px', borderRadius: '10px',
                                                backgroundColor: c.bg, color: c.fg,
                                                letterSpacing: '0.3px',
                                            }}>
                                                {c.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Entry cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedEntries.map(entry => {
                                    const isPlaying = playingId === entry.id;
                                    const hasBeenPlayed = playedIds.has(entry.id);
                                    const isExpanded = expandedId === entry.id;
                                    const catColor = CATEGORY_COLORS[entry.category];
                                    const isRegistered = registeredPhrases.has(entry.english.toLowerCase());
                                    const isRegistering = registeringId === entry.id;

                                    return (
                                        <div
                                            key={entry.id}
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '12px',
                                                border: isPlaying
                                                    ? '2px solid #D4AF37'
                                                    : '1px solid #F5F5F4',
                                                padding: '12px 14px',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            {/* Top row: category badge + action buttons */}
                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between',
                                                alignItems: 'center', marginBottom: '8px',
                                            }}>
                                                {catColor && (
                                                    <span style={{
                                                        fontSize: '9px', fontWeight: '700',
                                                        padding: '2px 8px', borderRadius: '10px',
                                                        backgroundColor: catColor.bg,
                                                        color: catColor.fg,
                                                        letterSpacing: '0.3px',
                                                    }}>
                                                        {catColor.label}
                                                    </span>
                                                )}
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                    {/* Play button */}
                                                    <div style={{ position: 'relative' }}>
                                                        <button
                                                            onClick={() => speak(entry.english, entry.id)}
                                                            style={{
                                                                border: 'none',
                                                                background: isPlaying ? '#FEF9E7' : 'none',
                                                                cursor: 'pointer',
                                                                padding: '4px 8px',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                color: isPlaying ? '#D4AF37' : '#A8A29E',
                                                                fontWeight: '600',
                                                                transition: 'all 0.15s',
                                                            }}
                                                        >
                                                            {isPlaying ? 'Playing...' : 'Play'}
                                                        </button>
                                                        {hasBeenPlayed && !isPlaying && (
                                                            <div style={{
                                                                position: 'absolute', top: '0', right: '0',
                                                                width: '6px', height: '6px', borderRadius: '50%',
                                                                backgroundColor: '#10B981',
                                                            }} />
                                                        )}
                                                    </div>

                                                    {/* DB register button */}
                                                    <button
                                                        onClick={() => registerToDb(entry)}
                                                        disabled={isRegistered || isRegistering}
                                                        style={{
                                                            border: isRegistered
                                                                ? '1px solid #10B981'
                                                                : '1px solid #E7E5E4',
                                                            background: isRegistered ? '#ECFDF5' : '#fff',
                                                            cursor: isRegistered ? 'default' : 'pointer',
                                                            padding: '3px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '11px',
                                                            fontWeight: '700',
                                                            color: isRegistered ? '#10B981' : '#78716C',
                                                            opacity: isRegistering ? 0.5 : 1,
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        {isRegistering ? '...' : isRegistered ? '\u767B\u9332\u6E08' : '\u767B\u9332'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Japanese */}
                                            <div style={{
                                                fontSize: '16px', fontWeight: '700',
                                                color: '#1C1917', lineHeight: 1.5,
                                                marginBottom: '4px',
                                            }}>
                                                {entry.japanese}
                                            </div>

                                            {/* English */}
                                            <div style={{
                                                fontSize: '14px', color: '#D4AF37',
                                                lineHeight: 1.5, fontWeight: '500',
                                                marginBottom: '6px',
                                            }}>
                                                {entry.english}
                                            </div>

                                            {/* Context (expandable) */}
                                            <div
                                                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {isExpanded ? (
                                                    <div style={{
                                                        fontSize: '12px', color: '#78716C',
                                                        lineHeight: 1.7, padding: '6px 0',
                                                    }}>
                                                        {entry.context}
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        fontSize: '11px', color: '#A8A29E',
                                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {entry.context.slice(0, 50)}...
                                                    </div>
                                                )}
                                            </div>

                                            {/* Source label */}
                                            <div style={{
                                                fontSize: '9px', color: '#D6D3D1',
                                                marginTop: '6px', letterSpacing: '0.3px',
                                            }}>
                                                {entry.source}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            height: '100%', minHeight: '300px',
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '36px', color: '#E7E5E4', fontWeight: '900',
                                    marginBottom: '8px',
                                }}>
                                    {selectedDay ? `Day ${selectedDay}` : '--'}
                                </div>
                                <p style={{
                                    fontSize: '12px', color: '#D6D3D1', margin: 0,
                                }}>
                                    {selectedDay ? 'No entries for this day' : 'Select a day'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
