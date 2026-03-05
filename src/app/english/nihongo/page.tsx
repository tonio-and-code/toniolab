'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NIHONGO_SEEDS, CATEGORY_META } from '@/data/english/nihongo-seed';
import ReviewCalendar, { loadReviewed, saveReviewed } from '@/components/english/ReviewCalendar';

interface NihongoItem {
    id: string;
    day_slot: number;
    japanese: string;
    english: string;
    literal: string | null;
    context: string | null;
    category: string;
}

function buildMonthKey(year: number, month: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function buildEntries(year: number, month: number): NihongoItem[] {
    const monthKey = buildMonthKey(year, month);
    const counters: Record<number, number> = {};
    return NIHONGO_SEEDS
        .filter(seed => (seed.month || '2026-02') === monthKey)
        .map(seed => {
            const idx = counters[seed.daySlot] || 0;
            counters[seed.daySlot] = idx + 1;
            return {
                id: `n${String(seed.daySlot).padStart(2, '0')}_${idx}`,
                day_slot: seed.daySlot,
                japanese: seed.japanese,
                english: seed.english,
                literal: seed.literal || null,
                context: seed.context || null,
                category: seed.category,
            };
        });
}

const CATEGORY_COLORS: Record<string, { fg: string; bg: string }> = {
    body: { fg: '#DC2626', bg: '#FEF2F2' },
    nature: { fg: '#059669', bg: '#ECFDF5' },
    food: { fg: '#D97706', bg: '#FFFBEB' },
    emotion: { fg: '#7C3AED', bg: '#F5F3FF' },
    action: { fg: '#2563EB', bg: '#EFF6FF' },
    life: { fg: '#64748B', bg: '#F8FAFC' },
};

export default function NihongoPage() {
    const [entries, setEntries] = useState<NihongoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [playedIds, setPlayedIds] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem('nihongo-played');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });
    const [isMobile, setIsMobile] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const detailRef = useRef<HTMLDivElement>(null);

    // Registration state
    const [registeredPhrases, setRegisteredPhrases] = useState<Set<string>>(new Set());
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [batchRegistering, setBatchRegistering] = useState(false);
    const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
    const [flashId, setFlashId] = useState<string | null>(null);

    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const todayDate = now.getDate();
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();
    const isCurrentMonth = viewYear === todayYear && viewMonth === todayMonth;

    // Reviewed days for detail panel button
    const reviewKey = `nihongo-reviewed-${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    const [reviewedDays, setReviewedDays] = useState<Set<number>>(new Set());

    useEffect(() => {
        setReviewedDays(loadReviewed(reviewKey));
    }, [reviewKey]);

    const totalEntries = entries.length;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setEntries(buildEntries(viewYear, viewMonth));
        setSelectedDay(null);
        setCategoryFilter(null);
        // playedIds persisted -- don't reset
    }, [viewYear, viewMonth]);

    // Fetch existing daily phrases to check registration status
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/phrases');
                if (res.ok) {
                    const data = await res.json();
                    const set = new Set<string>();
                    (data.phrases || []).forEach((p: { english: string }) => {
                        set.add(p.english.toLowerCase());
                    });
                    setRegisteredPhrases(set);
                }
            } catch { /* ignore */ }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!loading && entries.length > 0 && selectedDay === null) {
            setSelectedDay(todayDate);
        }
    }, [loading, entries.length, selectedDay, todayDate]);

    useEffect(() => {
        if (detailRef.current) {
            detailRef.current.scrollTop = 0;
        }
    }, [selectedDay]);

    // Sync reviewed state from calendar component
    useEffect(() => {
        const handleStorage = () => {
            setReviewedDays(loadReviewed(reviewKey));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [reviewKey]);

    // Auto-complete check
    useEffect(() => {
        if (!selectedDay) return;
        const dayEntries = byDay[selectedDay] || [];
        if (dayEntries.length === 0) return;
        const allPlayed = dayEntries.every(e => playedIds.has(e.id));
        if (allPlayed && !reviewedDays.has(selectedDay)) {
            const next = new Set(reviewedDays);
            next.add(selectedDay);
            setReviewedDays(next);
            saveReviewed(reviewKey, next);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedIds, selectedDay]);

    const isRegistered = useCallback((english: string) => {
        return registeredPhrases.has(english.toLowerCase());
    }, [registeredPhrases]);

    const byDay = useMemo(() => {
        const map: Record<number, NihongoItem[]> = {};
        entries.forEach(e => {
            if (!map[e.day_slot]) map[e.day_slot] = [];
            map[e.day_slot].push(e);
        });
        return map;
    }, [entries]);

    const selectedEntries = useMemo(() => {
        if (!selectedDay) return [];
        const dayEntries = byDay[selectedDay] || [];
        if (!categoryFilter) return dayEntries;
        return dayEntries.filter(e => e.category === categoryFilter);
    }, [selectedDay, byDay, categoryFilter]);

    const selectedDayCategoryCounts = useMemo(() => {
        if (!selectedDay) return {};
        const dayEntries = byDay[selectedDay] || [];
        const counts: Record<string, number> = {};
        dayEntries.forEach(e => {
            counts[e.category] = (counts[e.category] || 0) + 1;
        });
        return counts;
    }, [selectedDay, byDay]);

    // Unregistered in current detail view
    const unregisteredInView = useMemo(() =>
        selectedEntries.filter(e => !isRegistered(e.english)),
    [selectedEntries, isRegistered]);

    const registerEntry = async (entry: NihongoItem) => {
        if (isRegistered(entry.english) || registeringId === entry.id) return;
        setRegisteringId(entry.id);
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        try {
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: entry.english,
                    japanese: entry.japanese + (entry.literal ? ` (${entry.literal})` : ''),
                    category: entry.category,
                    date: dateStr,
                }),
            });
            if (res.ok || res.status === 409) {
                setRegisteredPhrases(prev => new Set(prev).add(entry.english.toLowerCase()));
                setFlashId(entry.id);
                setTimeout(() => setFlashId(null), 1500);
            }
        } finally {
            setRegisteringId(null);
        }
    };

    const batchRegisterDay = async () => {
        if (unregisteredInView.length === 0 || batchRegistering) return;
        setBatchRegistering(true);
        setBatchProgress({ current: 0, total: unregisteredInView.length });
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        for (let i = 0; i < unregisteredInView.length; i++) {
            const entry = unregisteredInView[i];
            setBatchProgress({ current: i + 1, total: unregisteredInView.length });
            try {
                const res = await fetch('/api/phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        english: entry.english,
                        japanese: entry.japanese + (entry.literal ? ` (${entry.literal})` : ''),
                        category: entry.category,
                        date: dateStr,
                    }),
                });
                if (res.ok || res.status === 409) {
                    setRegisteredPhrases(prev => new Set(prev).add(entry.english.toLowerCase()));
                }
            } catch { /* continue */ }
        }
        setBatchRegistering(false);
        setBatchProgress(null);
    };

    const speak = useCallback((japaneseText: string, englishText: string, id: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        setPlayingId(id);

        const jaUtterance = new SpeechSynthesisUtterance(japaneseText);
        jaUtterance.lang = 'ja-JP';
        jaUtterance.rate = 0.9;

        const enUtterance = new SpeechSynthesisUtterance(englishText);
        enUtterance.lang = 'en-US';
        enUtterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes('Samantha'))
            || voices.find(v => v.lang === 'en-US' && v.localService);
        if (preferred) enUtterance.voice = preferred;

        enUtterance.onend = () => {
            setPlayingId(null);
            setPlayedIds(prev => {
                const next = new Set(prev).add(id);
                try { localStorage.setItem('nihongo-played', JSON.stringify([...next])); } catch { /* */ }
                return next;
            });
        };
        enUtterance.onerror = () => setPlayingId(null);

        jaUtterance.onend = () => {
            window.speechSynthesis.speak(enUtterance);
        };
        jaUtterance.onerror = () => setPlayingId(null);

        window.speechSynthesis.speak(jaUtterance);
    }, []);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const goToday = () => {
        setViewYear(todayYear);
        setViewMonth(todayMonth);
        setSelectedDay(todayDate);
    };

    const toggleDayReviewed = useCallback(() => {
        if (!selectedDay) return;
        setReviewedDays(prev => {
            const next = new Set(prev);
            if (next.has(selectedDay)) next.delete(selectedDay);
            else next.add(selectedDay);
            saveReviewed(reviewKey, next);
            return next;
        });
    }, [selectedDay, reviewKey]);

    // Calendar entries for ReviewCalendar
    const calendarEntries = useMemo(() =>
        entries.map(e => ({
            id: e.id,
            day_slot: e.day_slot,
            japanese: e.japanese,
            category: e.category,
        })),
    [entries]);

    // Count played entries for selected day
    const selectedDayPlayedCount = useMemo(() => {
        if (!selectedDay) return 0;
        const dayEntries = byDay[selectedDay] || [];
        return dayEntries.filter(e => playedIds.has(e.id)).length;
    }, [selectedDay, byDay, playedIds]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF9' }}>
                <span style={{ color: '#A8A29E', fontSize: '13px', letterSpacing: '0.5px' }}>Loading...</span>
            </div>
        );
    }

    const dayIsReviewed = selectedDay ? reviewedDays.has(selectedDay) : false;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9' }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: isMobile ? 'auto' : '100vh',
            }}>
                {/* Left: Calendar */}
                <ReviewCalendar
                    title={'\u65E5\u672C\u8A9E\u304B\u3089\u5B66\u3076'}
                    subtitle={`${totalEntries} Japanese Idioms`}
                    accent="#D97706"
                    accentBg="#FFFBEB"
                    entries={calendarEntries}
                    categoryColors={CATEGORY_COLORS}
                    selectedDay={selectedDay}
                    onSelectDay={(day) => { setSelectedDay(day); setCategoryFilter(null); }}
                    viewYear={viewYear}
                    viewMonth={viewMonth}
                    onPrevMonth={prevMonth}
                    onNextMonth={nextMonth}
                    onGoToday={goToday}
                    storagePrefix="nihongo"
                    playedIds={playedIds}
                    isMobile={isMobile}
                />

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
                        minHeight: isMobile ? '400px' : 'auto',
                    }}
                >
                    {selectedDay && (byDay[selectedDay] || []).length > 0 ? (
                        <div style={{ padding: '20px' }}>
                            {/* Day header */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'baseline', gap: '8px',
                                    marginBottom: '10px',
                                }}>
                                    <span style={{
                                        fontSize: '32px', fontWeight: '900', color: '#D97706',
                                        lineHeight: 1, letterSpacing: '-1px',
                                    }}>
                                        {selectedDay}
                                    </span>
                                    <span style={{
                                        fontSize: '12px', color: '#A8A29E', fontWeight: '600',
                                    }}>
                                        {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('ja-JP', { weekday: 'short' })}
                                    </span>
                                    {selectedDayPlayedCount > 0 && (
                                        <span style={{
                                            fontSize: '10px', color: '#D6D3D1', fontWeight: '500',
                                        }}>
                                            {selectedDayPlayedCount}/{(byDay[selectedDay] || []).length} played
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
                                        border: '2px solid #D97706',
                                        backgroundColor: dayIsReviewed ? '#D97706' : '#fff',
                                        color: dayIsReviewed ? '#fff' : '#D97706',
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

                                {/* Category filter pills + batch register */}
                                <div style={{
                                    display: 'flex', gap: '4px', flexWrap: 'wrap',
                                    alignItems: 'center',
                                }}>
                                    <button
                                        onClick={() => setCategoryFilter(null)}
                                        style={{
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            border: categoryFilter === null ? '1px solid #44403C' : '1px solid #E7E5E4',
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            backgroundColor: categoryFilter === null ? '#44403C' : '#fff',
                                            color: categoryFilter === null ? '#fff' : '#A8A29E',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        All {(byDay[selectedDay] || []).length}
                                    </button>
                                    {Object.entries(selectedDayCategoryCounts).map(([cat, count]) => {
                                        const colors = CATEGORY_COLORS[cat] || { fg: '#999', bg: '#f5f5f5' };
                                        const isActive = categoryFilter === cat;
                                        const meta = CATEGORY_META[cat];
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => setCategoryFilter(isActive ? null : cat)}
                                                style={{
                                                    padding: '3px 10px',
                                                    borderRadius: '12px',
                                                    border: isActive ? `1px solid ${colors.fg}` : '1px solid #E7E5E4',
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    backgroundColor: isActive ? colors.bg : '#fff',
                                                    color: isActive ? colors.fg : '#A8A29E',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                {meta?.label || cat} {count}
                                            </button>
                                        );
                                    })}
                                    {unregisteredInView.length > 0 && (
                                        <button
                                            onClick={batchRegisterDay}
                                            disabled={batchRegistering}
                                            style={{
                                                marginLeft: 'auto',
                                                padding: '3px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid #D97706',
                                                backgroundColor: batchRegistering ? '#FEF3C7' : '#D97706',
                                                color: batchRegistering ? '#92400E' : '#fff',
                                                fontSize: '10px',
                                                fontWeight: '700',
                                                cursor: batchRegistering ? 'default' : 'pointer',
                                                transition: 'all 0.15s',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {batchRegistering && batchProgress
                                                ? `${batchProgress.current}/${batchProgress.total}`
                                                : `All (${unregisteredInView.length})`
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Entry list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {selectedEntries.map((entry) => {
                                    const isPlaying = playingId === entry.id;
                                    const hasBeenPlayed = playedIds.has(entry.id);
                                    const registered = isRegistered(entry.english);
                                    const catColor = CATEGORY_COLORS[entry.category] || { fg: '#999', bg: '#f5f5f5' };
                                    const isFlashing = flashId === entry.id;
                                    const isThisRegistering = registeringId === entry.id;

                                    return (
                                        <div
                                            key={entry.id}
                                            style={{
                                                backgroundColor: isFlashing ? '#FEF3C7' : '#fff',
                                                borderRadius: '10px',
                                                border: isPlaying
                                                    ? `2px solid ${catColor.fg}`
                                                    : '1px solid #F5F5F4',
                                                padding: '10px 12px',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '10px',
                                            }}>
                                                {/* Play button */}
                                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                                    <button
                                                        onClick={() => speak(entry.japanese, entry.english, entry.id)}
                                                        style={{
                                                            width: '36px', height: '36px',
                                                            borderRadius: '50%',
                                                            border: 'none', cursor: 'pointer',
                                                            backgroundColor: isPlaying ? catColor.fg : '#F5F5F4',
                                                            color: isPlaying ? '#fff' : '#78716C',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '14px',
                                                            transition: 'all 0.15s',
                                                            marginTop: '2px',
                                                        }}
                                                    >
                                                        {isPlaying ? '\u25A0' : '\u25B6'}
                                                    </button>
                                                    {/* Played indicator dot */}
                                                    {hasBeenPlayed && !isPlaying && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '0', right: '0',
                                                            width: '8px', height: '8px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#10B981',
                                                            border: '2px solid #fff',
                                                        }} />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: '17px', fontWeight: '800', color: '#1C1917',
                                                        lineHeight: 1.4, marginBottom: '4px',
                                                    }}>
                                                        {entry.japanese}
                                                    </div>

                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: catColor.fg,
                                                        lineHeight: 1.5,
                                                        marginBottom: entry.literal ? '2px' : '0',
                                                    }}>
                                                        {entry.english}
                                                    </div>

                                                    {entry.literal && (
                                                        <div style={{
                                                            fontSize: '11px',
                                                            fontStyle: 'italic',
                                                            color: '#A8A29E',
                                                            lineHeight: 1.4,
                                                        }}>
                                                            lit. {entry.literal}
                                                        </div>
                                                    )}

                                                    {entry.context && (
                                                        <div style={{
                                                            fontSize: '12px',
                                                            color: '#78716C',
                                                            lineHeight: 1.6,
                                                            marginTop: '6px',
                                                            padding: '8px 10px',
                                                            backgroundColor: '#FAFAF9',
                                                            borderRadius: '8px',
                                                            borderLeft: '3px solid #E7E5E4',
                                                        }}>
                                                            {entry.context}
                                                        </div>
                                                    )}

                                                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '1px 8px',
                                                            borderRadius: '8px',
                                                            fontSize: '9px',
                                                            fontWeight: '600',
                                                            backgroundColor: catColor.bg,
                                                            color: catColor.fg,
                                                            letterSpacing: '0.3px',
                                                        }}>
                                                            {CATEGORY_META[entry.category]?.label || entry.category}
                                                        </span>
                                                        <button
                                                            onClick={() => !registered && registerEntry(entry)}
                                                            disabled={registered || isThisRegistering}
                                                            style={{
                                                                padding: '2px 10px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                cursor: registered ? 'default' : 'pointer',
                                                                backgroundColor: registered ? '#ECFDF5' : '#FEF3C7',
                                                                color: registered ? '#059669' : '#92400E',
                                                                fontSize: '10px',
                                                                fontWeight: '700',
                                                                transition: 'all 0.15s',
                                                                opacity: isThisRegistering ? 0.5 : 1,
                                                                letterSpacing: '0.3px',
                                                            }}
                                                        >
                                                            {isThisRegistering ? '...' : registered ? '\u767B\u9332\u6E08' : '+ \u767B\u9332'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '40px 20px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            height: '100%', color: '#D6D3D1',
                        }}>
                            <div style={{
                                fontSize: '56px', fontWeight: '900',
                                color: 'rgba(217,119,6,0.08)',
                                marginBottom: '12px', lineHeight: 1,
                            }}>
                                {isCurrentMonth ? todayDate : ''}
                            </div>
                            <div style={{
                                fontSize: '13px', textAlign: 'center',
                                lineHeight: 1.6, color: '#A8A29E',
                            }}>
                                {entries.length === 0
                                    ? 'No idioms loaded.'
                                    : isCurrentMonth
                                        ? `Day ${todayDate} -- tap a date to start`
                                        : 'Select a day to review'
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
