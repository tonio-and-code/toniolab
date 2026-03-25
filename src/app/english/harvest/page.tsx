'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PPButton, PPPopup, usePPWordPicker } from '@/components/english/PPWordPicker';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HarvestExpression {
    id: string;
    expression: string;
    context: string | null;
    note: string | null;
    source_type: 'youtube' | 'reddit' | 'movie_script';
    source_title: string | null;
    source_url: string | null;
    score: number;
    harvest_date: string | null;
    status: string;
    created_at: string;
}

type ViewMode = 'calendar' | 'list';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SOURCE_META: Record<string, { label: string; color: string; bg: string }> = {
    youtube: { label: 'YouTube', color: '#DC2626', bg: '#FEE2E2' },
    reddit: { label: 'Reddit', color: '#2563EB', bg: '#DBEAFE' },
    movie_script: { label: 'Movie', color: '#7C3AED', bg: '#EDE9FE' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function speakText(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
}

function jstToday(): string {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().slice(0, 10);
}

function buildCalendarGrid(year: number, month: number): (number | null)[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
}

function rankLabel(score: number): { text: string; color: string; bg: string } {
    if (score >= 15) return { text: 'S', color: '#92400E', bg: '#FEF3C7' };
    if (score >= 10) return { text: 'A', color: '#065F46', bg: '#D1FAE5' };
    if (score >= 6) return { text: 'B', color: '#1E40AF', bg: '#DBEAFE' };
    return { text: 'C', color: '#78716C', bg: '#F5F5F4' };
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function HarvestPage() {
    const today = jstToday();
    const todayParts = today.split('-').map(Number);
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [viewYear, setViewYear] = useState(todayParts[0]);
    const [viewMonth, setViewMonth] = useState(todayParts[1] - 1);
    const [selectedDay, setSelectedDay] = useState<number | null>(todayParts[2]);
    const [expressions, setExpressions] = useState<HarvestExpression[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [harvesting, setHarvesting] = useState(false);
    const [harvestResult, setHarvestResult] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [registered, setRegistered] = useState<Set<string>>(() => {
        try {
            const s = localStorage.getItem('harvest-registered');
            return s ? new Set<string>(JSON.parse(s)) : new Set<string>();
        } catch { return new Set<string>(); }
    });
    const [registeringId, setRegisteringId] = useState<string | null>(null);

    useEffect(() => {
        try { localStorage.setItem('harvest-registered', JSON.stringify([...registered])); } catch {}
    }, [registered]);

    const { ppWordPicker, openPP, toggleWord, closePP, search } = usePPWordPicker();

    // Fetch all
    const fetchExpressions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/harvest?limit=500');
            if (!res.ok) throw new Error(`Failed (${res.status})`);
            const data = await res.json();
            setExpressions(Array.isArray(data) ? data : (data.expressions || []));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchExpressions(); }, [fetchExpressions]);

    // Group by harvest_date
    const byDate = useMemo(() => {
        const map = new Map<string, HarvestExpression[]>();
        for (const e of expressions) {
            const dk = e.harvest_date || e.created_at?.slice(0, 10) || '';
            if (!dk) continue;
            if (!map.has(dk)) map.set(dk, []);
            map.get(dk)!.push(e);
        }
        return map;
    }, [expressions]);

    const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

    const selectedDateKey = selectedDay
        ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        : null;
    const selectedExprs = selectedDateKey ? (byDate.get(selectedDateKey) || []) : [];

    // Stats
    const totalCount = expressions.length;
    const todayCount = byDate.get(today)?.length || 0;
    const sourcesUsed = new Set(expressions.map(e => e.source_title).filter(Boolean));

    // Month nav
    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
        setSelectedDay(null);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
        setSelectedDay(null);
    };

    // Harvest
    const handleHarvest = useCallback(async () => {
        setHarvesting(true);
        setHarvestResult(null);
        try {
            const res = await fetch('/api/harvest', { method: 'POST' });
            if (!res.ok) throw new Error('Harvest failed');
            const data = await res.json();
            const src = data.source ? ` from "${data.source}"` : '';
            setHarvestResult(`${data.harvested || 0} expressions${src}`);
            await fetchExpressions();
        } catch {
            setHarvestResult('Harvest failed');
        } finally {
            setHarvesting(false);
        }
    }, [fetchExpressions]);

    // Register to training
    const handleRegister = useCallback(async (expr: HarvestExpression) => {
        setRegisteringId(expr.id);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: expr.expression,
                    type: 'expression',
                    meaning: expr.note || expr.context || expr.expression,
                }),
            });
            if (!res.ok) throw new Error('fail');
            setRegistered(prev => new Set(prev).add(expr.id));
        } catch {} finally {
            setRegisteringId(null);
        }
    }, []);

    // List view sorted
    const listItems = useMemo(() => {
        const items = [...expressions];
        items.sort((a, b) => b.score - a.score);
        return items;
    }, [expressions]);

    // -----------------------------------------------------------------------
    // Expression Card
    // -----------------------------------------------------------------------
    function ExprCard({ expr }: { expr: HarvestExpression }) {
        const rank = rankLabel(expr.score);
        const src = SOURCE_META[expr.source_type] || SOURCE_META.movie_script;
        const isExpanded = expandedId === expr.id;
        const isReg = registered.has(expr.id);
        const isReging = registeringId === expr.id;

        return (
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '14px',
                border: '1px solid #e7e5e4',
                padding: '16px 18px',
            }}>
                {/* Header: rank + expression + source */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                        backgroundColor: rank.bg, color: rank.color,
                        fontSize: '12px', fontWeight: '800',
                    }}>
                        {rank.text}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '17px', fontWeight: '700', color: '#1C1917', lineHeight: 1.4 }}>
                            {expr.expression}
                        </div>
                        {/* Source line */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span style={{
                                fontSize: '11px', fontWeight: '600', color: src.color,
                                padding: '1px 6px', borderRadius: '4px', backgroundColor: src.bg,
                            }}>
                                {expr.source_title || src.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Context */}
                {expr.context && expr.context !== expr.expression && (
                    <p style={{
                        fontSize: '13px', color: '#57534E', fontStyle: 'italic',
                        margin: '8px 0', padding: '8px 12px',
                        backgroundColor: '#FAFAF9', borderRadius: '8px',
                        borderLeft: `3px solid ${src.color}`, lineHeight: 1.5,
                    }}>
                        {expr.context}
                    </p>
                )}

                {/* Note */}
                {expr.note && (
                    <div style={{
                        fontSize: '13px', color: '#44403C',
                        margin: '8px 0', padding: '10px 12px',
                        backgroundColor: '#FFFBEB', borderRadius: '8px',
                        borderLeft: '3px solid #D4AF37', lineHeight: 1.6,
                    }}>
                        {expr.note}
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => speakText(expr.expression)}
                        style={{
                            width: '34px', height: '34px', borderRadius: '8px',
                            border: '1px solid #e7e5e4', backgroundColor: '#fff',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                    </button>

                    <PPButton onClick={() => openPP(expr.id, expr.expression)} />

                    <button
                        onClick={() => !isReg && !isReging && handleRegister(expr)}
                        disabled={isReg || isReging}
                        style={{
                            padding: '7px 14px', borderRadius: '8px', border: 'none',
                            backgroundColor: isReg ? '#D1FAE5' : '#D4AF37',
                            color: isReg ? '#065F46' : '#fff',
                            fontSize: '12px', fontWeight: '600',
                            cursor: isReg ? 'default' : 'pointer',
                            opacity: isReging ? 0.6 : 1,
                        }}
                    >
                        {isReging ? '...' : isReg ? 'Added' : '+ Training'}
                    </button>

                    <button
                        onClick={() => setExpandedId(isExpanded ? null : expr.id)}
                        style={{
                            padding: '7px 12px', borderRadius: '8px',
                            border: '1px solid #e7e5e4',
                            backgroundColor: isExpanded ? '#F5F5F4' : '#fff',
                            color: '#78716C', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                        }}
                    >
                        {isExpanded ? 'Close' : 'Details'}
                    </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                    <div style={{
                        marginTop: '12px', paddingTop: '12px',
                        borderTop: '1px solid #f5f5f4',
                        fontSize: '12px', color: '#78716C', lineHeight: 1.7,
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
                            <span style={{ fontWeight: '600', color: '#57534E' }}>Source</span>
                            <span>{src.label} -- {expr.source_title || 'Unknown'}</span>
                            {expr.source_url && (
                                <>
                                    <span style={{ fontWeight: '600', color: '#57534E' }}>URL</span>
                                    <a href={expr.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                                        {expr.source_url.replace(/^https?:\/\//, '').slice(0, 50)}
                                    </a>
                                </>
                            )}
                            <span style={{ fontWeight: '600', color: '#57534E' }}>Score</span>
                            <span>{expr.score} ({rank.text})</span>
                            <span style={{ fontWeight: '600', color: '#57534E' }}>Date</span>
                            <span>{expr.harvest_date || expr.created_at?.slice(0, 10)}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9', padding: '32px 24px 80px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1C1917', letterSpacing: '0.02em', margin: '0 0 4px' }}>
                            Expression Harvest
                        </h1>
                        <p style={{ fontSize: '13px', color: '#A8A29E', margin: 0 }}>
                            {totalCount} expressions from {sourcesUsed.size} sources / {todayCount} today
                        </p>
                    </div>
                    <button
                        onClick={handleHarvest}
                        disabled={harvesting}
                        style={{
                            padding: '10px 20px', borderRadius: '10px',
                            border: 'none', backgroundColor: '#D4AF37',
                            color: '#fff', fontSize: '14px', fontWeight: '600',
                            cursor: harvesting ? 'wait' : 'pointer',
                            opacity: harvesting ? 0.7 : 1,
                        }}
                    >
                        {harvesting ? 'Harvesting...' : 'Harvest Now'}
                    </button>
                </div>

                {/* Harvest result */}
                {harvestResult && (
                    <div style={{
                        padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                        backgroundColor: harvestResult.includes('failed') ? '#FEF2F2' : '#F0FDF4',
                        color: harvestResult.includes('failed') ? '#991B1B' : '#166534',
                        fontSize: '13px', fontWeight: '500',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span>{harvestResult}</span>
                        <button onClick={() => setHarvestResult(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'inherit' }}>x</button>
                    </div>
                )}

                {/* View tabs */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                    {(['calendar', 'list'] as ViewMode[]).map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)} style={{
                            padding: '8px 20px', borderRadius: '10px',
                            border: viewMode === mode ? '2px solid #D4AF37' : '1px solid #e7e5e4',
                            backgroundColor: viewMode === mode ? '#FFFBEB' : '#fff',
                            color: viewMode === mode ? '#B45309' : '#57534E',
                            fontSize: '13px', fontWeight: viewMode === mode ? '600' : '500', cursor: 'pointer',
                        }}>
                            {mode === 'calendar' ? 'Calendar' : 'All'}
                        </button>
                    ))}
                </div>

                {loading && <div style={{ textAlign: 'center', padding: '60px 0', color: '#A8A29E', fontSize: '14px' }}>Loading...</div>}
                {error && !loading && (
                    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e7e5e4' }}>
                        <p style={{ color: '#991B1B', marginBottom: '12px' }}>{error}</p>
                        <button onClick={fetchExpressions} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#D4AF37', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Retry</button>
                    </div>
                )}

                {/* ============================================================= */}
                {/* CALENDAR VIEW */}
                {/* ============================================================= */}
                {!loading && !error && viewMode === 'calendar' && (
                    <div>
                        {/* Month nav */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <button onClick={prevMonth} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e7e5e4', backgroundColor: '#fff', cursor: 'pointer', fontSize: '16px', color: '#57534E' }}>&larr;</button>
                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#1C1917' }}>{monthLabel}</span>
                            <button onClick={nextMonth} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e7e5e4', backgroundColor: '#fff', cursor: 'pointer', fontSize: '16px', color: '#57534E' }}>&rarr;</button>
                        </div>

                        {/* Weekday headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
                            {WEEKDAYS.map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#A8A29E', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                            {grid.map((day, i) => {
                                if (day === null) return <div key={`e${i}`} style={{ aspectRatio: '1' }} />;

                                const dk = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayExprs = byDate.get(dk) || [];
                                const count = dayExprs.length;
                                const isSelected = selectedDay === day;
                                const isToday = dk === today;
                                const daySources = new Set(dayExprs.map(e => e.source_type));

                                return (
                                    <button
                                        key={`d${day}`}
                                        onClick={() => setSelectedDay(day)}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '10px',
                                            border: isSelected ? '2px solid #D4AF37' : isToday ? '2px solid #10B981' : '1px solid #e7e5e4',
                                            backgroundColor: isSelected ? '#FFFBEB' : count > 0 ? '#fff' : '#FAFAF9',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '3px',
                                            padding: '4px',
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: isSelected || isToday ? '700' : '500',
                                            color: isSelected ? '#B45309' : isToday ? '#059669' : count > 0 ? '#1C1917' : '#D6D3D1',
                                        }}>
                                            {day}
                                        </span>

                                        {count > 0 && (
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...daySources].map(type => {
                                                    const meta = SOURCE_META[type];
                                                    if (!meta) return null;
                                                    return <div key={type} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: meta.color }} />;
                                                })}
                                            </div>
                                        )}

                                        {count > 0 && (
                                            <span style={{ fontSize: '9px', fontWeight: '700', color: '#A8A29E' }}>{count}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
                            {Object.entries(SOURCE_META).map(([key, meta]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: meta.color }} />
                                    <span style={{ fontSize: '11px', color: '#78716C' }}>{meta.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Detail panel */}
                        {selectedDay && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917', margin: 0 }}>
                                        {viewYear}/{viewMonth + 1}/{selectedDay}
                                    </h2>
                                    <span style={{ fontSize: '13px', color: '#A8A29E' }}>
                                        {selectedExprs.length} expression{selectedExprs.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                {selectedExprs.length === 0 ? (
                                    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e7e5e4' }}>
                                        <p style={{ color: '#A8A29E', fontSize: '14px', margin: '0 0 12px' }}>No expressions</p>
                                        <button
                                            onClick={handleHarvest}
                                            disabled={harvesting}
                                            style={{
                                                padding: '8px 20px', borderRadius: '10px',
                                                border: 'none', backgroundColor: '#D4AF37', color: '#fff',
                                                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                            }}
                                        >
                                            Harvest Now
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {selectedExprs.sort((a, b) => b.score - a.score).map(expr => (
                                            <ExprCard key={expr.id} expr={expr} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================================= */}
                {/* LIST VIEW */}
                {/* ============================================================= */}
                {!loading && !error && viewMode === 'list' && (
                    <div>
                        {listItems.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e7e5e4', color: '#A8A29E' }}>
                                No expressions yet
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {listItems.slice(0, 100).map(expr => (
                                    <ExprCard key={expr.id} expr={expr} />
                                ))}
                                {listItems.length > 100 && (
                                    <div style={{ textAlign: 'center', padding: '16px', color: '#A8A29E', fontSize: '13px' }}>
                                        Showing 100 of {listItems.length}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && expressions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e7e5e4', marginTop: '20px' }}>
                        <p style={{ fontSize: '16px', color: '#57534E', fontWeight: '600', marginBottom: '8px' }}>
                            No expressions harvested yet
                        </p>
                        <p style={{ fontSize: '14px', color: '#A8A29E', marginBottom: '20px' }}>
                            Click Harvest Now to collect from movie scripts
                        </p>
                    </div>
                )}
            </div>

            {/* PP Popup */}
            {ppWordPicker && (
                <PPPopup state={ppWordPicker} onToggle={toggleWord} onClose={closePP} onSearch={search} />
            )}
        </div>
    );
}
