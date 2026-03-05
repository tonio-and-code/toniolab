'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DAY_PROLOGUES } from '@/data/english/day-prologues';

interface UserPhrase {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    mastery_level: number;
    created_at: string;
}

const WORDS_PER_DAY = 10;
const WORDS_PER_SCENARIO = 50;
const START_DATE = new Date(2026, 0, 1); // 2026-01-01
const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const VIEW_MODE_KEY = 'wordreview-hub-view';

interface ScenarioConfig {
    key: string;
    scenarioNum: string;
    prologueDate: string;
    memoriaId: string;
    dayLabels: string[];
    speakerColors: Record<string, string>;
}

const SCENARIOS: ScenarioConfig[] = [
    {
        key: 'gamenight',
        scenarioNum: '5',
        prologueDate: '2026-02-25',
        memoriaId: 'gamenight-day1',
        dayLabels: ['The Setup', 'The Game Begins', 'The Unraveling', 'The Fight & Fix', 'Morning After'],
        speakerColors: {
            Marcus: '#DC2626', Jess: '#EC4899', Trent: '#F59E0B',
            Nina: '#6366F1', Devon: '#10B981', Priya: '#F97316',
        },
    },
    {
        key: 'movie',
        scenarioNum: '4',
        prologueDate: '2026-02-20',
        memoriaId: 'movie-day1',
        dayLabels: ['The Arrival', 'The Previews', 'Peak Movie', 'The Climax', 'After Credits'],
        speakerColors: {
            Jayden: '#2563EB', Maddie: '#EC4899', 'Tyler C.': '#F59E0B',
            Ava: '#8B5CF6', Benji: '#EF4444', 'Mrs. Chen': '#78716C',
            Marcus: '#14B8A6', 'Old Man Gus': '#92400E',
        },
    },
    {
        key: 'mariners',
        scenarioNum: '3',
        prologueDate: '2026-02-15',
        memoriaId: 'mariners-day1',
        dayLabels: ['The Deal', 'The Offseason', 'The Perfect Fit', 'The Next Generation', 'Building the Future'],
        speakerColors: { Marcus: '#DC2626', Kai: '#0284C7' },
    },
    {
        key: 'monster',
        scenarioNum: '2',
        prologueDate: '2026-02-10',
        memoriaId: 'monster-day1',
        dayLabels: ['The Goodbye', 'The Noises', 'Fort Building', 'The Showdown', 'Safe and Sound'],
        speakerColors: {
            Timmy: '#60A5FA', Sarah: '#F472B6', Greg: '#6366F1',
            Emma: '#A78BFA', 'Grandpa Frank': '#D97706', Noah: '#34D399',
            Kayla: '#FB923C', Danny: '#EF4444',
        },
    },
    {
        key: 'party',
        scenarioNum: '1',
        prologueDate: '2026-02-05',
        memoriaId: 'party-day1',
        dayLabels: ['The Setup', "It's Going Down", 'Peak Hours', 'After Midnight', 'The Morning After'],
        speakerColors: {
            Tyler: '#6366F1', Brandon: '#F59E0B', Alyssa: '#EC4899',
            Derek: '#10B981', Megan: '#8B5CF6', 'Professor Hayes': '#78716C',
            Zoe: '#F97316', Jake: '#EF4444', Kenji: '#06B6D4', Rosa: '#14B8A6',
        },
    },
];

function getDateForIndex(index: number): string {
    const dayIndex = Math.floor(index / WORDS_PER_DAY);
    const date = new Date(START_DATE);
    date.setDate(date.getDate() + dayIndex);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getDatesForScenario(prologueDate: string): string[] {
    const start = new Date(prologueDate);
    const dates: string[] = [];
    for (let i = 0; i < 5; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dates.push(`${y}-${m}-${dd}`);
    }
    return dates;
}

function formatDateRange(prologueDate: string): string {
    const start = new Date(prologueDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    const sameMonth = start.getMonth() === end.getMonth();
    const startStr = `${start.toLocaleString('en-US', { month: 'short' })} ${start.getDate()}`;
    const endStr = sameMonth
        ? `${end.getDate()}`
        : `${end.toLocaleString('en-US', { month: 'short' })} ${end.getDate()}`;
    return `${startStr} - ${endStr}, ${start.getFullYear()}`;
}

interface DayStats {
    date: string;
    total: number;
    mastered: number;
    inProgress: number;
}

interface ScenarioStats {
    totalWords: number;
    mastered: number;
    inProgress: number;
    days: DayStats[];
}

export default function ScenarioHubPage() {
    const router = useRouter();
    const [words, setWords] = useState<UserPhrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'hub' | 'calendar'>('hub');
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const [clientToday, setClientToday] = useState<string>('');
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Hydration-safe today + localStorage viewMode
    useEffect(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        setClientToday(`${y}-${m}-${d}`);
        setCurrentMonth(now);
        try {
            const saved = localStorage.getItem(VIEW_MODE_KEY);
            if (saved === 'hub' || saved === 'calendar') setViewMode(saved);
        } catch { /* ignore */ }
    }, []);

    const handleViewMode = useCallback((mode: 'hub' | 'calendar') => {
        setViewMode(mode);
        try { localStorage.setItem(VIEW_MODE_KEY, mode); } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        fetch('/api/user-phrases')
            .then(res => res.json())
            .then((data: { phrases?: UserPhrase[]; success?: boolean }) => {
                const list = data.phrases || [];
                const sorted = [...list].sort((a, b) => {
                    const ca = a.created_at.localeCompare(b.created_at);
                    if (ca !== 0) return ca;
                    return a.id.localeCompare(b.id);
                });
                setWords(sorted);
            })
            .catch(() => setWords([]))
            .finally(() => setLoading(false));
    }, []);

    const wordsByDate = useMemo(() => {
        const map: Record<string, UserPhrase[]> = {};
        words.forEach((w, i) => {
            const date = getDateForIndex(i);
            if (!map[date]) map[date] = [];
            map[date].push(w);
        });
        return map;
    }, [words]);

    const scenarioStats = useMemo(() => {
        const stats: Record<string, ScenarioStats> = {};
        for (const sc of SCENARIOS) {
            const dates = getDatesForScenario(sc.prologueDate);
            let totalWords = 0;
            let mastered = 0;
            let inProgress = 0;
            const days: DayStats[] = [];

            for (const date of dates) {
                const dayWords = wordsByDate[date] || [];
                const dayMastered = dayWords.filter(w => w.mastery_level >= 3).length;
                const dayInProgress = dayWords.filter(w => w.mastery_level >= 1 && w.mastery_level < 3).length;
                totalWords += dayWords.length;
                mastered += dayMastered;
                inProgress += dayInProgress;
                days.push({ date, total: dayWords.length, mastered: dayMastered, inProgress: dayInProgress });
            }

            stats[sc.key] = { totalWords, mastered, inProgress, days };
        }
        return stats;
    }, [wordsByDate]);

    const totalStats = useMemo(() => {
        let total = 0, mastered = 0;
        for (const sc of SCENARIOS) {
            const s = scenarioStats[sc.key];
            if (s) { total += s.totalWords; mastered += s.mastered; }
        }
        return { total, mastered };
    }, [scenarioStats]);

    // Map date string -> scenario number for calendar cells
    const scenarioForDate = useMemo(() => {
        const map: Record<string, string> = {};
        for (const sc of SCENARIOS) {
            const dates = getDatesForScenario(sc.prologueDate);
            for (const d of dates) map[d] = sc.scenarioNum;
        }
        return map;
    }, []);

    // 1-click day completion toggle
    const [togglingDay, setTogglingDay] = useState<string | null>(null);
    const toggleDayComplete = useCallback(async (date: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const dayWords = wordsByDate[date];
        if (!dayWords || dayWords.length === 0) return;

        const allMastered = dayWords.every(w => w.mastery_level >= 3);
        const newLevel = allMastered ? 0 : 3;

        // Optimistic update
        setWords(prev => prev.map(w =>
            dayWords.some(dw => dw.id === w.id)
                ? { ...w, mastery_level: newLevel }
                : w
        ));
        setTogglingDay(date);

        // Fire parallel PATCH requests
        try {
            await Promise.all(
                dayWords.map(w =>
                    fetch(`/api/user-phrases/${w.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mastery_level: newLevel }),
                    })
                )
            );
        } catch (err) {
            console.error('Failed to batch update mastery:', err);
        }
        setTogglingDay(null);
    }, [wordsByDate]);

    // Calendar month helpers
    const calYear = currentMonth.getFullYear();
    const calMonth = currentMonth.getMonth();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const prevMonth = useCallback(() => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const nextMonth = useCallback(() => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    const goToday = useCallback(() => {
        setCurrentMonth(new Date());
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', color: '#999', fontSize: '14px',
            }}>
                Loading...
            </div>
        );
    }

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

    return (
        <div style={{
            backgroundColor: '#f5f5f5',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* Control Bar */}
            <div style={{
                padding: '12px 16px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
            }}>
                {/* Left: View Toggle (iOS segmented control) */}
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    padding: '3px',
                }}>
                    {(['hub', 'calendar'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => handleViewMode(mode)}
                            style={{
                                background: viewMode === mode ? '#fff' : 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: viewMode === mode ? '#1a1a1a' : '#888',
                                boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {mode === 'hub' ? 'Hub' : 'カレンダー'}
                        </button>
                    ))}
                </div>

                {/* Center: Month Nav (calendar) or Stats (hub) */}
                {viewMode === 'calendar' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={prevMonth}
                            style={{
                                background: 'none',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#666',
                            }}
                        >
                            &#8249;
                        </button>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            minWidth: '100px',
                            textAlign: 'center',
                        }}>
                            {calYear}年 {MONTH_NAMES[calMonth]}
                        </span>
                        <button
                            onClick={nextMonth}
                            style={{
                                background: 'none',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#666',
                            }}
                        >
                            &#8250;
                        </button>
                    </div>
                ) : (
                    <div style={{ fontSize: '13px', color: '#888' }}>
                        {totalStats.total} words / {totalStats.mastered} mastered
                    </div>
                )}

                {/* Right: Today button */}
                <button
                    onClick={goToday}
                    style={{
                        background: '#D4AF37',
                        border: 'none',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        opacity: viewMode === 'calendar' ? 1 : 0.5,
                    }}
                    disabled={viewMode === 'hub'}
                >
                    今日
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                ...(viewMode === 'hub' ? { padding: isMobile ? '20px 16px' : '40px 24px' } : {}),
            }}>

            {viewMode === 'hub' ? (
            /* Hub: Title + Scenario Cards */
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: isMobile ? '22px' : '28px',
                        fontWeight: '800',
                        color: '#1c1917',
                        margin: 0,
                        letterSpacing: '-0.5px',
                    }}>
                        Requiem
                    </h1>
                    <p style={{
                        fontSize: '13px',
                        color: '#a8a29e',
                        margin: '8px 0 0',
                        letterSpacing: '0.3px',
                    }}>
                        5-day story scenarios -- words, conversations, expressions
                    </p>
                </div>

            {/* Scenario Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {SCENARIOS.map(sc => {
                    const prologue = DAY_PROLOGUES[sc.prologueDate];
                    const stats = scenarioStats[sc.key];
                    if (!prologue || !stats) return null;

                    const pct = stats.totalWords > 0
                        ? Math.round((stats.mastered / stats.totalWords) * 100)
                        : 0;
                    const characters = prologue.characters.map(c => c.name.split(' (')[0].split('/').pop()?.trim() || c.name);

                    return (
                        <div key={sc.key} style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e7e5e4',
                            borderRadius: '12px',
                            padding: isMobile ? '20px 16px' : '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            {/* Top row: scenario num + date range */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '12px',
                            }}>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: '#D4AF37',
                                    letterSpacing: '0.5px',
                                }}>
                                    #{sc.scenarioNum}
                                </span>
                                <span style={{
                                    fontSize: '11px',
                                    color: '#a8a29e',
                                    letterSpacing: '0.3px',
                                }}>
                                    {formatDateRange(sc.prologueDate)}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 style={{
                                fontSize: isMobile ? '18px' : '20px',
                                fontWeight: '700',
                                color: '#1c1917',
                                margin: '0 0 4px',
                            }}>
                                {prologue.title}
                            </h2>
                            <p style={{
                                fontSize: '13px',
                                color: '#78716c',
                                margin: '0 0 12px',
                            }}>
                                {prologue.titleJa}
                            </p>

                            {/* Setting excerpt */}
                            <p style={{
                                fontSize: '12px',
                                color: '#a8a29e',
                                margin: '0 0 20px',
                                lineHeight: '1.5',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}>
                                {prologue.setting}
                            </p>

                            {/* 5-Day Progress Strip */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: isMobile ? '6px' : '8px',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: isMobile ? '4px' : '6px',
                                    flex: 1,
                                }}>
                                    {stats.days.map((day, di) => {
                                        const isComplete = day.total > 0 && day.mastered === day.total;
                                        const isToggling = togglingDay === day.date;

                                        return (
                                            <div
                                                key={day.date}
                                                onClick={(e) => toggleDayComplete(day.date, e)}
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    textAlign: 'center',
                                                    cursor: day.total > 0 ? 'pointer' : 'default',
                                                    opacity: isToggling ? 0.5 : 1,
                                                    transition: 'opacity 0.15s ease',
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: '10px',
                                                    color: isComplete ? '#D4AF37' : '#a8a29e',
                                                    marginBottom: '4px',
                                                    fontWeight: isComplete ? '700' : '500',
                                                }}>
                                                    D{di + 1}
                                                </div>
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    margin: '0 auto',
                                                    borderRadius: '50%',
                                                    border: isComplete ? '2px solid #D4AF37' : '2px solid #d6d3d1',
                                                    backgroundColor: isComplete ? '#D4AF37' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s ease',
                                                }}>
                                                    {isComplete && (
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Overall scenario progress */}
                                {(() => {
                                    const daysCleared = stats.days.filter(d => d.total > 0 && d.mastered === d.total).length;
                                    const totalDays = stats.days.filter(d => d.total > 0).length;
                                    const allClear = totalDays > 0 && daysCleared === totalDays;
                                    return (
                                        <div style={{
                                            textAlign: 'center',
                                            minWidth: isMobile ? '60px' : '70px',
                                            paddingLeft: '12px',
                                            borderLeft: '1px solid #f5f5f4',
                                        }}>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '800',
                                                color: allClear ? '#D4AF37' : '#44403c',
                                                lineHeight: 1,
                                            }}>
                                                {daysCleared}/{totalDays}
                                            </div>
                                            <div style={{
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                color: allClear ? '#D4AF37' : '#78716c',
                                                marginTop: '4px',
                                            }}>
                                                {allClear ? 'CLEAR' : 'days'}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Characters */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                marginBottom: '16px',
                            }}>
                                {characters.slice(0, isMobile ? 4 : 5).map(name => (
                                    <span key={name} style={{
                                        fontSize: '11px',
                                        color: sc.speakerColors[name] || '#78716c',
                                        backgroundColor: `${sc.speakerColors[name] || '#78716c'}12`,
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontWeight: '500',
                                    }}>
                                        {name}
                                    </span>
                                ))}
                                {characters.length > (isMobile ? 4 : 5) && (
                                    <span style={{
                                        fontSize: '11px',
                                        color: '#a8a29e',
                                        padding: '2px 6px',
                                    }}>
                                        +{characters.length - (isMobile ? 4 : 5)}
                                    </span>
                                )}
                            </div>

                            {/* Action links */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                            }}>
                                <Link
                                    href={`/english/requiem/${sc.prologueDate}`}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#44403c',
                                        backgroundColor: '#f5f5f4',
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        transition: 'background-color 0.15s ease',
                                    }}
                                >
                                    Words
                                </Link>
                                <Link
                                    href={`/english/memoria/${sc.memoriaId}`}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#44403c',
                                        backgroundColor: '#f5f5f4',
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        transition: 'background-color 0.15s ease',
                                    }}
                                >
                                    Memoria
                                </Link>
                                <Link
                                    href="/english/expressions"
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#44403c',
                                        backgroundColor: '#f5f5f4',
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        transition: 'background-color 0.15s ease',
                                    }}
                                >
                                    Expressions
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>
            ) : (
            /* Calendar View (Memoria-style) */
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: '100%',
            }}>
                {/* Calendar Grid Section */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    borderRight: isMobile ? 'none' : '1px solid #e5e5e5',
                    overflowY: 'auto',
                }}>
                    {/* Day Headers */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        borderBottom: '1px solid #eee',
                        flexShrink: 0,
                    }}>
                        {DAY_NAMES.map((day, index) => (
                            <div key={day} style={{
                                textAlign: 'center',
                                fontSize: '11px',
                                color: index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : '#666',
                                fontWeight: '600',
                                padding: '8px 0',
                            }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '2px',
                        padding: '4px',
                        backgroundColor: '#f0f0f0',
                    }}>
                        {calendarDays.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} style={{
                                    backgroundColor: '#fafafa',
                                    borderRadius: '4px',
                                    minHeight: isMobile ? '48px' : undefined,
                                    aspectRatio: isMobile ? undefined : '1',
                                }} />;
                            }

                            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayWords = wordsByDate[dateStr] || [];
                            const hasWords = dayWords.length > 0;
                            const masteredCount = hasWords ? dayWords.filter(w => w.mastery_level >= 3).length : 0;
                            const allMastered = hasWords && masteredCount === dayWords.length;
                            const isToday = dateStr === clientToday;
                            const isSelected = dateStr === selectedDay;
                            const scenarioNum = scenarioForDate[dateStr];
                            const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
                            const cellBg = allMastered ? '#FFFBEB' : '#fff';
                            const pct = hasWords ? Math.round((masteredCount / dayWords.length) * 100) : 0;

                            const handleCellClick = () => {
                                if (!hasWords) return;
                                if (isMobile) {
                                    router.push(`/english/requiem/${dateStr}`);
                                } else {
                                    setSelectedDay(isSelected ? null : dateStr);
                                }
                            };

                            return (
                                <div
                                    key={day}
                                    onClick={handleCellClick}
                                    style={{
                                        position: 'relative',
                                        minHeight: isMobile ? '48px' : undefined,
                                        aspectRatio: isMobile ? undefined : '1',
                                        backgroundColor: cellBg,
                                        borderRadius: '4px',
                                        cursor: hasWords ? 'pointer' : 'default',
                                        boxShadow: isSelected
                                            ? '0 0 0 2px #D4AF37'
                                            : isToday
                                            ? '0 0 0 2px #10b981'
                                            : 'none',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: isMobile ? '4px 5px' : '4px',
                                    }}
                                >
                                    {/* Day number + scenario tag */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}>
                                        <span style={{
                                            fontSize: isMobile ? '13px' : '12px',
                                            fontWeight: '700',
                                            color: !hasWords ? '#ccc'
                                                : dayOfWeek === 0 ? '#ef4444'
                                                : dayOfWeek === 6 ? '#3b82f6'
                                                : '#888',
                                        }}>
                                            {day}
                                        </span>
                                        {scenarioNum && (
                                            <span style={{
                                                fontSize: isMobile ? '9px' : '8px',
                                                fontWeight: '700',
                                                color: '#D4AF37',
                                                lineHeight: 1,
                                            }}>
                                                #{scenarioNum}
                                            </span>
                                        )}
                                    </div>

                                    {/* PC: Word list in cell */}
                                    {hasWords && !isMobile && (
                                        <div style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            overflow: 'hidden',
                                        }}>
                                            {dayWords.map((w, wi) => {
                                                const mColor =
                                                    w.mastery_level >= 3 ? '#D4AF37'
                                                    : w.mastery_level >= 2 ? '#2563EB'
                                                    : w.mastery_level >= 1 ? '#D97706'
                                                    : '#bbb';
                                                return (
                                                    <div key={wi} style={{
                                                        fontSize: '9px',
                                                        lineHeight: '11px',
                                                        color: mColor,
                                                        fontWeight: w.mastery_level >= 3 ? 700 : 400,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {w.phrase}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Mobile: Compact progress */}
                                    {hasWords && isMobile && (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '3px' }}>
                                            {/* Progress bar */}
                                            <div style={{
                                                height: '4px',
                                                backgroundColor: '#e5e5e5',
                                                borderRadius: '2px',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${Math.max(pct, hasWords ? 5 : 0)}%`,
                                                    backgroundColor: allMastered ? '#D4AF37' : '#10B981',
                                                    borderRadius: '2px',
                                                }} />
                                            </div>
                                            <div style={{
                                                fontSize: '10px',
                                                fontWeight: allMastered ? 700 : 500,
                                                color: allMastered ? '#D4AF37' : '#999',
                                                textAlign: 'center',
                                            }}>
                                                {masteredCount}/{dayWords.length}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Sidebar (PC only) */}
                {!isMobile && (
                <div style={{
                    flex: '0 0 320px',
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor: '#fafafa',
                }}>
                    {selectedDay && wordsByDate[selectedDay] ? (() => {
                        const dayWords = wordsByDate[selectedDay];
                        const scenarioNum = scenarioForDate[selectedDay];
                        const masteredCount = dayWords.filter(w => w.mastery_level >= 3).length;
                        const dateObj = new Date(selectedDay);
                        const dateLabel = dateObj.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });

                        return (
                            <div style={{ padding: '20px 16px' }}>
                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '16px',
                                }}>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>
                                            {dateLabel}
                                        </div>
                                        {scenarioNum && (
                                            <div style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '600', marginTop: '2px' }}>
                                                #{scenarioNum}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#888' }}>
                                        {masteredCount}/{dayWords.length} mastered
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div style={{
                                    height: '6px',
                                    backgroundColor: '#e5e5e5',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    marginBottom: '20px',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${dayWords.length > 0 ? (masteredCount / dayWords.length) * 100 : 0}%`,
                                        backgroundColor: masteredCount === dayWords.length ? '#D4AF37' : '#10B981',
                                        borderRadius: '3px',
                                        transition: 'width 0.3s ease',
                                    }} />
                                </div>

                                {/* Word list */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {dayWords.map((w, wi) => {
                                        const mColor =
                                            w.mastery_level >= 3 ? '#D4AF37'
                                            : w.mastery_level >= 2 ? '#2563EB'
                                            : w.mastery_level >= 1 ? '#D97706'
                                            : '#999';
                                        const mLabel =
                                            w.mastery_level >= 3 ? '済'
                                            : w.mastery_level >= 1 ? `(${w.mastery_level})`
                                            : '未';
                                        return (
                                            <div key={wi} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 10px',
                                                backgroundColor: '#fff',
                                                borderRadius: '8px',
                                                borderLeft: `3px solid ${mColor}`,
                                            }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        fontWeight: w.mastery_level >= 3 ? 700 : 500,
                                                        color: '#1a1a1a',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {w.phrase}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        color: '#999',
                                                        marginTop: '1px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {w.meaning}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    color: mColor,
                                                    flexShrink: 0,
                                                }}>
                                                    {mLabel}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Link to full day page */}
                                <Link
                                    href={`/english/requiem/${selectedDay}`}
                                    style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        marginTop: '16px',
                                        padding: '10px',
                                        backgroundColor: '#D4AF37',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                    }}
                                >
                                    この日の復習を開く
                                </Link>
                            </div>
                        );
                    })() : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#bbb',
                            fontSize: '13px',
                        }}>
                            日付をクリックして表示
                        </div>
                    )}
                </div>
                )}
            </div>
            )}

            </div>
        </div>
    );
}
