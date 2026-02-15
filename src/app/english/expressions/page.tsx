'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    PARTY_EXPRESSIONS,
    TOTAL_EXPRESSIONS,
    EXPRESSIONS_PER_DAY,
    PARTY_DAY_IDS,
    findExpressionLineIndex,
    PartyExpression,
} from '@/data/english/party-expressions';
import {
    MONSTER_EXPRESSIONS,
    TOTAL_MONSTER_EXPRESSIONS,
    MONSTER_EXPRESSIONS_PER_DAY,
    MONSTER_DAY_IDS,
    findMonsterExpressionLineIndex,
    MonsterExpression,
} from '@/data/english/monster-expressions';
import {
    MARINERS_EXPRESSIONS,
    TOTAL_MARINERS_EXPRESSIONS,
    MARINERS_EXPRESSIONS_PER_DAY,
    MARINERS_DAY_IDS,
    findMarinersExpressionLineIndex,
    MarinersExpression,
} from '@/data/english/mariners-trade-expressions';
import {
    MOVIE_EXPRESSIONS,
    TOTAL_MOVIE_EXPRESSIONS,
    MOVIE_EXPRESSIONS_PER_DAY,
    MOVIE_DAY_IDS,
    findMovieExpressionLineIndex,
    MovieExpression,
} from '@/data/english/movie-expressions';
import { collegePartyRecapEntries } from '@/data/english/college-party-recap';
import { monsterUnderBedEntries } from '@/data/english/monster-under-bed';
import { marinersTradeEntries } from '@/data/english/mariners-trade-talk';
import { movieNightEntries } from '@/data/english/movie-night';

type SeriesKey = 'party' | 'monster' | 'mariners' | 'movie';

type AnyExpression = PartyExpression | MonsterExpression | MarinersExpression | MovieExpression;

const SERIES_CONFIG: Record<SeriesKey, {
    label: string;
    expressions: AnyExpression[];
    total: number;
    perDay: number;
    dayIds: Record<number, string>;
    dayLabels: Record<number, string>;
    speakerColors: Record<string, string>;
    source: string;
    findLineIndex: (expr: string, speaker: string, lines: Array<{ speaker: string; text: string }>) => number;
    getEntries: () => Array<{ id: string; conversation: { english: Array<{ speaker: string; text: string }> } }>;
}> = {
    party: {
        label: 'College Party',
        expressions: PARTY_EXPRESSIONS,
        total: TOTAL_EXPRESSIONS,
        perDay: EXPRESSIONS_PER_DAY,
        dayIds: PARTY_DAY_IDS,
        dayLabels: {
            1: 'The Setup',
            2: "It's Going Down",
            3: 'Peak Hours',
            4: 'After Midnight',
            5: 'The Morning After',
        },
        speakerColors: {
            Tyler: '#6366F1',
            Brandon: '#F59E0B',
            Alyssa: '#EC4899',
            Derek: '#10B981',
            Megan: '#8B5CF6',
            'Professor Hayes': '#78716C',
            Zoe: '#F97316',
            Jake: '#EF4444',
            Kenji: '#06B6D4',
            Rosa: '#14B8A6',
        },
        source: 'College Party Recap',
        findLineIndex: findExpressionLineIndex,
        getEntries: () => collegePartyRecapEntries,
    },
    monster: {
        label: 'Monster Under the Bed',
        expressions: MONSTER_EXPRESSIONS,
        total: TOTAL_MONSTER_EXPRESSIONS,
        perDay: MONSTER_EXPRESSIONS_PER_DAY,
        dayIds: MONSTER_DAY_IDS,
        dayLabels: {
            1: 'The Goodbye',
            2: 'The Noises',
            3: 'Fort Building',
            4: 'The Showdown',
            5: 'Safe and Sound',
        },
        speakerColors: {
            Timmy: '#60A5FA',
            Sarah: '#F472B6',
            Greg: '#6366F1',
            Emma: '#A78BFA',
            'Grandpa Frank': '#D97706',
            Noah: '#34D399',
            Kayla: '#FB923C',
            Danny: '#EF4444',
        },
        source: 'Monster Under the Bed',
        findLineIndex: findMonsterExpressionLineIndex,
        getEntries: () => monsterUnderBedEntries,
    },
    mariners: {
        label: 'Mariners Trade Talk',
        expressions: MARINERS_EXPRESSIONS,
        total: TOTAL_MARINERS_EXPRESSIONS,
        perDay: MARINERS_EXPRESSIONS_PER_DAY,
        dayIds: MARINERS_DAY_IDS,
        dayLabels: {
            1: 'The Deal',
            2: 'The Offseason',
            3: 'The Perfect Fit',
            4: 'The Next Generation',
            5: 'Building the Future',
        },
        speakerColors: {
            Marcus: '#DC2626',
            Kai: '#0284C7',
        },
        source: 'Mariners Trade Talk',
        findLineIndex: findMarinersExpressionLineIndex,
        getEntries: () => marinersTradeEntries,
    },
    movie: {
        label: 'Movie Night',
        expressions: MOVIE_EXPRESSIONS,
        total: TOTAL_MOVIE_EXPRESSIONS,
        perDay: MOVIE_EXPRESSIONS_PER_DAY,
        dayIds: MOVIE_DAY_IDS,
        dayLabels: {
            1: 'The Arrival',
            2: 'The Previews',
            3: 'Peak Movie',
            4: 'The Climax',
            5: 'After Credits',
        },
        speakerColors: {
            Jayden: '#2563EB',
            Maddie: '#EC4899',
            'Tyler C.': '#F59E0B',
            Ava: '#8B5CF6',
            Benji: '#EF4444',
            'Mrs. Chen': '#78716C',
            Marcus: '#14B8A6',
            'Old Man Gus': '#92400E',
        },
        source: 'First Movie Without Parents',
        findLineIndex: findMovieExpressionLineIndex,
        getEntries: () => movieNightEntries,
    },
};

interface UserPhrase {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
}

export default function ExpressionsPage() {
    const [activeSeries, setActiveSeries] = useState<SeriesKey>('party');
    const [search, setSearch] = useState('');
    const [dayFilter, setDayFilter] = useState<number | null>(null);
    const [speakerFilter, setSpeakerFilter] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<string | null>(null);

    // DB integration state
    const [registeredPhrases, setRegisteredPhrases] = useState<Set<string>>(new Set());
    const [loadingPhrases, setLoadingPhrases] = useState(true);
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [flashId, setFlashId] = useState<string | null>(null);
    const [batchRegistering, setBatchRegistering] = useState(false);
    const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

    const config = SERIES_CONFIG[activeSeries];
    const CURRENT_EXPRESSIONS = config.expressions;
    const CURRENT_TOTAL = config.total;
    const CURRENT_PER_DAY = config.perDay;
    const CURRENT_DAY_IDS = config.dayIds;
    const DAY_LABELS = config.dayLabels;
    const SPEAKER_COLORS = config.speakerColors;
    const ALL_SPEAKERS = Object.keys(SPEAKER_COLORS);

    // Reset filters when switching series
    const switchSeries = (key: SeriesKey) => {
        setActiveSeries(key);
        setDayFilter(null);
        setSpeakerFilter(null);
        setSearch('');
        setExpandedIdx(null);
    };

    // Responsive check
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Fetch registered phrases from DB
    useEffect(() => {
        const fetchPhrases = async () => {
            try {
                const res = await fetch('/api/user-phrases');
                if (res.ok) {
                    const data = await res.json();
                    const phrases: UserPhrase[] = data.phrases || [];
                    setRegisteredPhrases(new Set(phrases.map(p => p.phrase.toLowerCase())));
                }
            } catch {
                // silently fail, show unregistered state
            } finally {
                setLoadingPhrases(false);
            }
        };
        fetchPhrases();
    }, []);

    const isRegistered = useCallback((expression: string) => {
        return registeredPhrases.has(expression.toLowerCase());
    }, [registeredPhrases]);

    const registeredCount = useMemo(() => {
        return CURRENT_EXPRESSIONS.filter(e => isRegistered(e.expression)).length;
    }, [isRegistered, CURRENT_EXPRESSIONS]);

    const registeredPerDay = useMemo(() => {
        const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        CURRENT_EXPRESSIONS.forEach(e => {
            if (isRegistered(e.expression)) counts[e.day]++;
        });
        return counts;
    }, [isRegistered, CURRENT_EXPRESSIONS]);

    // Register a single expression
    const registerExpression = async (expr: AnyExpression) => {
        const key = `${expr.expression}-${expr.day}`;
        if (isRegistered(expr.expression) || registeringId === key) return;
        setRegisteringId(key);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: expr.expression,
                    type: 'expression',
                    meaning: expr.meaning,
                    example: expr.example,
                    source: `${config.source} Day ${expr.day}`,
                }),
            });
            if (res.ok || res.status === 409) {
                setRegisteredPhrases(prev => new Set(prev).add(expr.expression.toLowerCase()));
                setFlashId(key);
                setTimeout(() => setFlashId(null), 2000);
            }
        } finally {
            setRegisteringId(null);
        }
    };

    // Batch register all unregistered expressions
    const batchRegister = async () => {
        const unregistered = CURRENT_EXPRESSIONS.filter(e => !isRegistered(e.expression));
        if (unregistered.length === 0 || batchRegistering) return;
        setBatchRegistering(true);
        setBatchProgress({ current: 0, total: unregistered.length });

        for (let i = 0; i < unregistered.length; i++) {
            const expr = unregistered[i];
            setBatchProgress({ current: i + 1, total: unregistered.length });
            try {
                const res = await fetch('/api/user-phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phrase: expr.expression,
                        type: 'expression',
                        meaning: expr.meaning,
                        example: expr.example,
                        source: `${config.source} Day ${expr.day}`,
                    }),
                });
                if (res.ok || res.status === 409) {
                    setRegisteredPhrases(prev => new Set(prev).add(expr.expression.toLowerCase()));
                }
            } catch {
                // continue on failure
            }
        }
        setBatchRegistering(false);
    };

    // Build deep-link URL for Memoria
    const getMemoriaLink = useCallback((expr: AnyExpression): string => {
        const memoriaId = CURRENT_DAY_IDS[expr.day];
        if (!memoriaId) return `/memoria/${memoriaId}`;

        const entries = config.getEntries();
        const entry = entries.find((e: any) => e.id === memoriaId);
        if (!entry) return `/memoria/${memoriaId}?autoplay=true`;

        const lineIdx = config.findLineIndex(expr.expression, expr.speaker, entry.conversation.english);
        if (lineIdx >= 0) {
            return `/memoria/${memoriaId}?line=${lineIdx}&autoplay=true`;
        }
        return `/memoria/${memoriaId}?autoplay=true`;
    }, [config, CURRENT_DAY_IDS]);

    const filtered = useMemo(() => {
        let list = [...CURRENT_EXPRESSIONS];
        if (dayFilter !== null) {
            list = list.filter(e => e.day === dayFilter);
        }
        if (speakerFilter !== null) {
            list = list.filter(e => e.speaker === speakerFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(e =>
                e.expression.toLowerCase().includes(q) ||
                e.meaning.toLowerCase().includes(q) ||
                e.meaningEn.toLowerCase().includes(q) ||
                e.speaker.toLowerCase().includes(q) ||
                e.example.toLowerCase().includes(q)
            );
        }
        return list;
    }, [search, dayFilter, speakerFilter, CURRENT_EXPRESSIONS]);

    const unregisteredCount = CURRENT_TOTAL - registeredCount;
    const progressPct = (registeredCount / CURRENT_TOTAL) * 100;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FAFAF9',
            padding: isMobile ? '16px' : '32px 40px',
        }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '12px' : '0',
                    marginBottom: '20px',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: isMobile ? '22px' : '28px',
                            fontWeight: '700',
                            color: '#1C1917',
                            margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            Slang & Expressions
                        </h1>
                        <p style={{
                            fontSize: '13px',
                            color: '#78716C',
                            margin: '4px 0 0 0',
                        }}>
                            {config.source} -- vocabulary tracker
                        </p>
                    </div>
                </div>

                {/* Series selector */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                }}>
                    {(Object.keys(SERIES_CONFIG) as SeriesKey[]).map(key => {
                        const isActive = activeSeries === key;
                        return (
                            <button
                                key={key}
                                onClick={() => switchSeries(key)}
                                style={{
                                    padding: '8px 18px',
                                    fontSize: '13px',
                                    fontWeight: isActive ? '700' : '400',
                                    color: isActive ? '#fff' : '#57534E',
                                    backgroundColor: isActive ? '#D4AF37' : '#FFFFFF',
                                    border: '1px solid',
                                    borderColor: isActive ? '#D4AF37' : '#E7E5E4',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    boxShadow: isActive ? '0 2px 6px rgba(212,175,55,0.3)' : 'none',
                                }}
                            >
                                {SERIES_CONFIG[key].label}
                            </button>
                        );
                    })}
                </div>

                {/* Progress Stats */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7E5E4',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '16px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '22px', fontWeight: '700', color: '#10B981' }}>
                                {loadingPhrases ? '--' : registeredCount}
                            </span>
                            <span style={{ fontSize: '13px', color: '#78716C' }}>
                                / {CURRENT_TOTAL} registered
                            </span>
                        </div>
                        {!loadingPhrases && unregisteredCount > 0 && (
                            <button
                                onClick={batchRegister}
                                disabled={batchRegistering}
                                style={{
                                    padding: '6px 14px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: batchRegistering ? '#78716C' : '#fff',
                                    backgroundColor: batchRegistering ? '#F5F5F4' : '#D4AF37',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: batchRegistering ? 'default' : 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {batchRegistering
                                    ? `${batchProgress.current}/${batchProgress.total}...`
                                    : `Register All (${unregisteredCount})`
                                }
                            </button>
                        )}
                        {!loadingPhrases && unregisteredCount === 0 && (
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>
                                ALL REGISTERED
                            </span>
                        )}
                    </div>
                    {/* Progress bar */}
                    <div style={{
                        height: '6px',
                        backgroundColor: '#F5F5F4',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginBottom: '10px',
                    }}>
                        <div style={{
                            height: '100%',
                            width: loadingPhrases ? '0%' : `${progressPct}%`,
                            backgroundColor: '#10B981',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease',
                        }} />
                    </div>
                    {/* Per-day mini indicators */}
                    <div style={{
                        display: 'flex',
                        gap: isMobile ? '6px' : '12px',
                        flexWrap: 'wrap',
                    }}>
                        {[1, 2, 3, 4, 5].map(day => {
                            const regCount = registeredPerDay[day] || 0;
                            const pct = (regCount / CURRENT_PER_DAY) * 100;
                            return (
                                <div key={day} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '11px',
                                    color: '#78716C',
                                }}>
                                    <span style={{ fontWeight: '500' }}>D{day}</span>
                                    <div style={{
                                        width: '40px',
                                        height: '4px',
                                        backgroundColor: '#F5F5F4',
                                        borderRadius: '2px',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${pct}%`,
                                            backgroundColor: pct === 100 ? '#D4AF37' : '#10B981',
                                            borderRadius: '2px',
                                            transition: 'width 0.3s ease',
                                        }} />
                                    </div>
                                    <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: '28px' }}>
                                        {loadingPhrases ? '--' : `${regCount}/${CURRENT_PER_DAY}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Day filter chips */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={() => setDayFilter(null)}
                        style={{
                            padding: '6px 14px',
                            fontSize: '13px',
                            fontWeight: dayFilter === null ? '600' : '400',
                            color: dayFilter === null ? '#fff' : '#57534E',
                            backgroundColor: dayFilter === null ? '#10B981' : '#F5F5F4',
                            border: '1px solid',
                            borderColor: dayFilter === null ? '#10B981' : '#E7E5E4',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        All Days
                    </button>
                    {[1, 2, 3, 4, 5].map(day => (
                        <button
                            key={day}
                            onClick={() => setDayFilter(dayFilter === day ? null : day)}
                            style={{
                                padding: '6px 14px',
                                fontSize: '13px',
                                fontWeight: dayFilter === day ? '600' : '400',
                                color: dayFilter === day ? '#fff' : '#57534E',
                                backgroundColor: dayFilter === day ? '#10B981' : '#F5F5F4',
                                border: '1px solid',
                                borderColor: dayFilter === day ? '#10B981' : '#E7E5E4',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            Day {day}
                        </button>
                    ))}
                </div>

                {/* Speaker filter chips */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={() => setSpeakerFilter(null)}
                        style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: speakerFilter === null ? '600' : '400',
                            color: speakerFilter === null ? '#fff' : '#78716C',
                            backgroundColor: speakerFilter === null ? '#78716C' : 'transparent',
                            border: '1px solid',
                            borderColor: speakerFilter === null ? '#78716C' : '#D6D3D1',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        All Speakers
                    </button>
                    {ALL_SPEAKERS.map(speaker => {
                        const color = SPEAKER_COLORS[speaker];
                        const isActive = speakerFilter === speaker;
                        return (
                            <button
                                key={speaker}
                                onClick={() => setSpeakerFilter(isActive ? null : speaker)}
                                style={{
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    fontWeight: isActive ? '600' : '400',
                                    color: isActive ? '#fff' : color,
                                    backgroundColor: isActive ? color : 'transparent',
                                    border: '1px solid',
                                    borderColor: isActive ? color : '#E7E5E4',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {speaker}
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search expressions, meanings, speakers..."
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '14px',
                            border: '1px solid #D6D3D1',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            color: '#1C1917',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.15s ease',
                        }}
                        onFocus={e => e.target.style.borderColor = '#10B981'}
                        onBlur={e => e.target.style.borderColor = '#D6D3D1'}
                    />
                    {search && (
                        <div style={{
                            fontSize: '12px',
                            color: '#78716C',
                            marginTop: '6px',
                            paddingLeft: '4px',
                        }}>
                            {filtered.length} results found
                        </div>
                    )}
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 16px',
                        color: '#A8A29E',
                        fontSize: '14px',
                    }}>
                        {search || speakerFilter ? 'No expressions match your filters.' : 'No expressions found.'}
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7E5E4',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}>
                        {/* Table Header (desktop) */}
                        {!isMobile && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '36px 1fr 100px 48px 80px',
                                padding: '12px 16px',
                                backgroundColor: '#F5F5F4',
                                borderBottom: '1px solid #E7E5E4',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#78716C',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase' as const,
                            }}>
                                <div></div>
                                <div>Expression</div>
                                <div>Speaker</div>
                                <div style={{ textAlign: 'center' }}>Day</div>
                                <div style={{ textAlign: 'right' }}>Actions</div>
                            </div>
                        )}

                        {/* Rows */}
                        {filtered.map((entry, i) => {
                            const key = `${entry.expression}-${entry.day}`;
                            const isExpanded = expandedIdx === key;
                            const registered = isRegistered(entry.expression);
                            const isRegistering = registeringId === key;
                            const isFlashing = flashId === key;

                            return (
                                <div key={key}>
                                    {/* Main row */}
                                    <div
                                        onClick={() => setExpandedIdx(isExpanded ? null : key)}
                                        style={{
                                            display: isMobile ? 'flex' : 'grid',
                                            gridTemplateColumns: isMobile ? undefined : '36px 1fr 100px 48px 80px',
                                            flexDirection: isMobile ? 'column' : undefined,
                                            padding: isMobile ? '12px 16px' : '10px 16px',
                                            borderBottom: (isExpanded || i < filtered.length - 1) ? '1px solid #F5F5F4' : 'none',
                                            backgroundColor: isFlashing
                                                ? '#ECFDF5'
                                                : isExpanded
                                                    ? '#FAFAF9'
                                                    : i % 2 === 0 ? '#FFFFFF' : '#FAFAF9',
                                            alignItems: isMobile ? 'flex-start' : 'center',
                                            gap: isMobile ? '4px' : '0',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease',
                                        }}
                                    >
                                        {isMobile ? (
                                            <>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {/* Status indicator */}
                                                        <span style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            backgroundColor: registered ? '#10B981' : '#D6D3D1',
                                                            flexShrink: 0,
                                                        }} />
                                                        <span style={{
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            color: '#1C1917',
                                                        }}>
                                                            {entry.expression}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <span style={{
                                                            fontSize: '11px',
                                                            color: SPEAKER_COLORS[entry.speaker] || '#78716C',
                                                            fontWeight: '600',
                                                        }}>
                                                            {entry.speaker}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '11px',
                                                            color: '#10B981',
                                                            fontWeight: '600',
                                                        }}>
                                                            D{entry.day}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#57534E', paddingLeft: '16px' }}>
                                                    {entry.meaning}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Status dot */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: registered ? '#10B981' : '#D6D3D1',
                                                    }} />
                                                </div>

                                                {/* Expression + meaning */}
                                                <div>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: '#1C1917',
                                                        lineHeight: '1.4',
                                                    }}>
                                                        {entry.expression}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#78716C',
                                                        marginTop: '1px',
                                                    }}>
                                                        {entry.meaning}
                                                    </div>
                                                </div>

                                                {/* Speaker */}
                                                <div style={{
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    color: SPEAKER_COLORS[entry.speaker] || '#78716C',
                                                }}>
                                                    {entry.speaker}
                                                </div>

                                                {/* Day */}
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#10B981',
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                }}>
                                                    {entry.day}
                                                </div>

                                                {/* Actions */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    gap: '4px',
                                                }}>
                                                    {/* Play in Memoria */}
                                                    <Link
                                                        href={getMemoriaLink(entry)}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '6px',
                                                            backgroundColor: 'transparent',
                                                            border: '1px solid #E7E5E4',
                                                            color: '#D4AF37',
                                                            textDecoration: 'none',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                        title={`Play in Memoria Day ${entry.day}`}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </Link>

                                                    {/* Register / Registered */}
                                                    {registered ? (
                                                        <span style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '28px',
                                                            height: '28px',
                                                            color: '#10B981',
                                                            fontSize: '14px',
                                                        }} title="Registered">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                            </svg>
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                registerExpression(entry);
                                                            }}
                                                            disabled={isRegistering}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '28px',
                                                                height: '28px',
                                                                borderRadius: '6px',
                                                                backgroundColor: 'transparent',
                                                                border: '1px solid #E7E5E4',
                                                                color: isRegistering ? '#A8A29E' : '#10B981',
                                                                cursor: isRegistering ? 'default' : 'pointer',
                                                                fontSize: '14px',
                                                                transition: 'all 0.15s ease',
                                                                padding: 0,
                                                            }}
                                                            title="+Vocab"
                                                        >
                                                            {isRegistering ? '...' : '+'}
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Expanded detail */}
                                    {isExpanded && (
                                        <div style={{
                                            padding: isMobile ? '12px 16px' : '12px 16px 12px 52px',
                                            backgroundColor: '#FAFAF9',
                                            borderBottom: i < filtered.length - 1 ? '1px solid #F5F5F4' : 'none',
                                        }}>
                                            {/* English meaning */}
                                            <div style={{
                                                fontSize: '13px',
                                                color: '#57534E',
                                                marginBottom: '8px',
                                            }}>
                                                <span style={{ fontWeight: '600', color: '#78716C', fontSize: '11px', letterSpacing: '0.03em' }}>EN: </span>
                                                {entry.meaningEn}
                                            </div>

                                            {/* Example sentence */}
                                            <div style={{
                                                fontSize: '13px',
                                                color: '#1C1917',
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E7E5E4',
                                                borderRadius: '8px',
                                                padding: '10px 14px',
                                                lineHeight: '1.5',
                                                marginBottom: '10px',
                                                borderLeft: `3px solid ${SPEAKER_COLORS[entry.speaker] || '#D6D3D1'}`,
                                            }}>
                                                <span style={{
                                                    fontSize: '11px',
                                                    color: SPEAKER_COLORS[entry.speaker] || '#78716C',
                                                    fontWeight: '600',
                                                    marginRight: '6px',
                                                }}>
                                                    {entry.speaker}:
                                                </span>
                                                &ldquo;{entry.example}&rdquo;
                                            </div>

                                            {/* Action buttons */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                            }}>
                                                <Link
                                                    href={getMemoriaLink(entry)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        color: '#D4AF37',
                                                        backgroundColor: '#FFFBEB',
                                                        border: '1px solid #FDE68A',
                                                        borderRadius: '8px',
                                                        textDecoration: 'none',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                    Play in Memoria
                                                </Link>

                                                {registered ? (
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        color: '#10B981',
                                                        backgroundColor: '#ECFDF5',
                                                        border: '1px solid #10B981',
                                                        borderRadius: '8px',
                                                    }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                        </svg>
                                                        Registered
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            registerExpression(entry);
                                                        }}
                                                        disabled={isRegistering}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '6px 12px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            color: isRegistering ? '#78716C' : '#fff',
                                                            backgroundColor: isRegistering ? '#F5F5F4' : '#10B981',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: isRegistering ? 'default' : 'pointer',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                    >
                                                        {isRegistering ? 'Saving...' : '+Vocab'}
                                                    </button>
                                                )}

                                                <span style={{
                                                    fontSize: '11px',
                                                    color: '#A8A29E',
                                                    marginLeft: '4px',
                                                }}>
                                                    Day {entry.day} -- {DAY_LABELS[entry.day]}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    padding: '20px 0',
                    fontSize: '12px',
                    color: '#A8A29E',
                }}>
                    {filtered.length === CURRENT_TOTAL
                        ? `${CURRENT_TOTAL} expressions total`
                        : `Showing ${filtered.length} of ${CURRENT_TOTAL} expressions`
                    }
                </div>
            </div>
        </div>
    );
}
