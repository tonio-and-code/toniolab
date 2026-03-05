'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// --- Types ---

export interface CalendarEntry {
    id: string;
    day_slot: number;
    japanese: string;
    category: string;
}

export interface CategoryColor {
    fg: string;
    bg: string;
}

export interface ReviewCalendarProps {
    title: string;
    subtitle: string;
    accent: string;
    accentBg: string;
    entries: CalendarEntry[];
    categoryColors: Record<string, CategoryColor>;
    selectedDay: number | null;
    onSelectDay: (day: number) => void;
    viewYear: number;
    viewMonth: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onGoToday: () => void;
    storagePrefix: string;
    playedIds: Set<string>;
    masteredIds?: Set<string>;
    isMobile: boolean;
    headerRight?: React.ReactNode;
}

// --- Helpers ---

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

function buildReviewKey(prefix: string, year: number, month: number): string {
    return `${prefix}-reviewed-${year}-${String(month + 1).padStart(2, '0')}`;
}

function loadReviewed(key: string): Set<number> {
    try {
        const saved = localStorage.getItem(key);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
}

function saveReviewed(key: string, days: Set<number>) {
    try { localStorage.setItem(key, JSON.stringify([...days])); } catch { /* ignore */ }
}

// --- Component ---

export default function ReviewCalendar({
    title,
    subtitle,
    accent,
    accentBg,
    entries,
    selectedDay,
    onSelectDay,
    viewYear,
    viewMonth,
    onPrevMonth,
    onNextMonth,
    onGoToday,
    storagePrefix,
    playedIds,
    masteredIds,
    isMobile,
    headerRight,
}: ReviewCalendarProps) {
    const now = new Date();
    const todayDate = now.getDate();
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();
    const isCurrentMonth = viewYear === todayYear && viewMonth === todayMonth;

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

    const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long',
    });

    const reviewKey = buildReviewKey(storagePrefix, viewYear, viewMonth);
    const [reviewedDays, setReviewedDays] = useState<Set<number>>(() => loadReviewed(reviewKey));
    const [prevReviewKey, setPrevReviewKey] = useState(reviewKey);
    const [toastVisible, setToastVisible] = useState(false);

    if (prevReviewKey !== reviewKey) {
        setPrevReviewKey(reviewKey);
        setReviewedDays(loadReviewed(reviewKey));
    }

    // Auto-complete when all entries mastered
    useEffect(() => {
        if (!selectedDay) return;
        const dayEntries = byDay[selectedDay] || [];
        if (dayEntries.length === 0) return;
        const source = masteredIds || playedIds;
        const allDone = dayEntries.every(e => source.has(e.id));
        if (allDone && !reviewedDays.has(selectedDay)) {
            const next = new Set(reviewedDays);
            next.add(selectedDay);
            setReviewedDays(next);
            saveReviewed(reviewKey, next);
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedIds, masteredIds, selectedDay]);

    const toggleReviewed = useCallback((day: number) => {
        setReviewedDays(prev => {
            const next = new Set(prev);
            if (next.has(day)) next.delete(day);
            else next.add(day);
            saveReviewed(reviewKey, next);
            return next;
        });
    }, [reviewKey]);

    const byDay = useMemo(() => {
        const map: Record<number, CalendarEntry[]> = {};
        entries.forEach(e => {
            if (!map[e.day_slot]) map[e.day_slot] = [];
            map[e.day_slot].push(e);
        });
        return map;
    }, [entries]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedDay) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                for (let d = selectedDay - 1; d >= 1; d--) {
                    if (byDay[d]?.length) { onSelectDay(d); return; }
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                for (let d = selectedDay + 1; d <= daysInMonth; d++) {
                    if (byDay[d]?.length) { onSelectDay(d); return; }
                }
            } else if (e.key === ' ') {
                e.preventDefault();
                toggleReviewed(selectedDay);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedDay, byDay, daysInMonth, onSelectDay, toggleReviewed]);

    // Calendar cells
    const calendarCells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
    while (calendarCells.length % 7 !== 0) calendarCells.push(null);

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            minWidth: 0,
            padding: isMobile ? '16px 12px' : '20px 24px',
            position: 'relative',
        }}>
            {/* Toast */}
            {toastVisible && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: accent, color: '#fff',
                    padding: '10px 24px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '700', zIndex: 1000,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    animation: 'toastSlide 0.3s ease-out',
                }}>
                    Complete!
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '16px',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '20px', fontWeight: '900', color: '#1C1917',
                            margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2,
                        }}>
                            {title}
                        </h1>
                        <p style={{
                            fontSize: '11px', color: '#A8A29E', margin: '4px 0 0 0',
                            letterSpacing: '0.3px',
                        }}>
                            {subtitle}
                        </p>
                    </div>
                    {headerRight}
                </div>

                {/* Month navigation */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '16px',
                }}>
                    <button onClick={onPrevMonth} style={{
                        border: 'none', background: 'none', cursor: 'pointer',
                        fontSize: '18px', color: '#A8A29E', padding: '4px 8px', lineHeight: 1,
                    }}>&#8249;</button>
                    <span style={{
                        fontSize: '14px', fontWeight: '700', color: '#44403C',
                        minWidth: '110px', textAlign: 'center',
                    }}>{monthLabel}</span>
                    <button onClick={onNextMonth} style={{
                        border: 'none', background: 'none', cursor: 'pointer',
                        fontSize: '18px', color: '#A8A29E', padding: '4px 8px', lineHeight: 1,
                    }}>&#8250;</button>
                    {!isCurrentMonth && (
                        <button onClick={onGoToday} style={{
                            border: '1px solid #E7E5E4', borderRadius: '6px',
                            background: '#fff', cursor: 'pointer',
                            fontSize: '10px', color: '#78716C', padding: '4px 12px', fontWeight: '600',
                        }}>Today</button>
                    )}
                </div>
            </div>

            {/* Weekday headers */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                marginBottom: '4px',
            }}>
                {WEEKDAYS.map((d, idx) => (
                    <div key={d} style={{
                        textAlign: 'center', fontSize: '10px', fontWeight: '600',
                        color: idx === 0 ? '#EF4444' : idx === 6 ? '#3B82F6' : '#A8A29E',
                        padding: '4px 0',
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '3px',
                flex: 1,
                minHeight: 0,
            }}>
                {calendarCells.map((day, i) => {
                    if (day === null) {
                        return <div key={`empty-${i}`} />;
                    }

                    const dayEntries = byDay[day] || [];
                    const isToday = isCurrentMonth && day === todayDate;
                    const isSelected = day === selectedDay;
                    const count = dayEntries.length;
                    const dayOfWeek = (firstDay + day - 1) % 7;

                    // Mastery progress for this day
                    const source = masteredIds || playedIds;
                    const masteredCount = count > 0
                        ? dayEntries.filter(e => source.has(e.id)).length
                        : 0;
                    const progress = count > 0 ? masteredCount / count : 0;
                    const isComplete = progress === 1 && count > 0;

                    // Background: interpolate from white to warm gold based on progress
                    const bgColor = count === 0
                        ? 'transparent'
                        : isSelected
                            ? accentBg
                            : isComplete
                                ? '#FBF5E4'
                                : progress > 0
                                    ? '#FEFCF6'
                                    : '#fff';

                    return (
                        <div
                            key={day}
                            onClick={() => { if (count > 0) onSelectDay(day); }}
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
                                    ? `2px solid ${accent}`
                                    : isToday
                                        ? `2px solid ${accent}`
                                        : count > 0
                                            ? '1px solid #EEECE7'
                                            : '1px solid transparent',
                                transition: 'all 0.15s',
                                position: 'relative',
                            }}
                        >
                            {/* Day number */}
                            <span style={{
                                fontSize: isMobile ? '12px' : '13px',
                                fontWeight: isToday || isSelected ? '800' : count > 0 ? '600' : '400',
                                color: count === 0
                                    ? '#D6D3D1'
                                    : isSelected
                                        ? accent
                                        : isComplete
                                            ? '#92400E'
                                            : dayOfWeek === 0
                                                ? '#EF4444'
                                                : dayOfWeek === 6
                                                    ? '#3B82F6'
                                                    : '#57534E',
                                lineHeight: 1,
                            }}>
                                {day}
                            </span>

                            {/* Progress bar */}
                            {count > 0 && (
                                <div style={{
                                    width: '80%',
                                    height: '3px',
                                    borderRadius: '2px',
                                    backgroundColor: '#EEECE7',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${progress * 100}%`,
                                        height: '100%',
                                        borderRadius: '2px',
                                        backgroundColor: isComplete ? accent : progress > 0 ? '#D4AF37' : 'transparent',
                                        transition: 'width 0.4s ease',
                                    }} />
                                </div>
                            )}

                            {/* Fraction label */}
                            {count > 0 && (
                                <span style={{
                                    fontSize: isMobile ? '8px' : '9px',
                                    fontWeight: '600',
                                    color: isComplete ? accent : '#A8A29E',
                                    lineHeight: 1,
                                }}>
                                    {isComplete
                                        ? '\u2713'
                                        : `${masteredCount}/${count}`
                                    }
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Keyboard hint */}
            {!isMobile && selectedDay && (
                <div style={{
                    marginTop: '8px', textAlign: 'center',
                    fontSize: '10px', color: '#D6D3D1', letterSpacing: '0.3px', flexShrink: 0,
                }}>
                    &#8592; &#8594; navigate &middot; space = toggle reviewed
                </div>
            )}

            <style>{`
                @keyframes toastSlide {
                    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
        </div>
    );
}

export { buildReviewKey, loadReviewed, saveReviewed };
