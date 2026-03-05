'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BACKLOG, CATEGORY_LABELS } from '@/data/english/dashboard-backlog';
import type { BacklogItem } from '@/data/english/dashboard-backlog';

interface FeatureRow {
    key: string;
    label: string;
    touched: number;
    total: number | null; // null = cumulative only (no denominator)
    href: string;
    color: string;
}

function BacklogSection() {
    const doneItems = BACKLOG.filter(b => b.done);
    const pendingItems = BACKLOG.filter(b => !b.done);
    const [showDone, setShowDone] = useState(false);

    const categories = useMemo(() => {
        const cats: Record<string, BacklogItem[]> = {};
        pendingItems.forEach(item => {
            if (!cats[item.category]) cats[item.category] = [];
            cats[item.category].push(item);
        });
        return cats;
    }, [pendingItems]);

    return (
        <div style={{ marginTop: '32px' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '12px',
                padding: '0 4px',
            }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#A8A29E',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}>
                        IMPROVEMENT BACKLOG
                    </span>
                    <span style={{
                        fontSize: '11px',
                        color: '#D4AF37',
                        fontWeight: '700',
                    }}>
                        {doneItems.length} done
                    </span>
                    <span style={{
                        fontSize: '11px',
                        color: '#A8A29E',
                    }}>
                        / {BACKLOG.length} total
                    </span>
                </div>
                <div style={{
                    fontSize: '10px',
                    color: '#A8A29E',
                    fontVariantNumeric: 'tabular-nums',
                }}>
                    #{BACKLOG[BACKLOG.length - 1]?.id || 0}
                </div>
            </div>

            {/* Progress bar for backlog itself */}
            <div style={{
                height: '4px',
                backgroundColor: '#E7E5E4',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '16px',
            }}>
                <div style={{
                    height: '100%',
                    width: `${(doneItems.length / BACKLOG.length) * 100}%`,
                    background: 'linear-gradient(90deg, #D4AF37, #B8961F)',
                    borderRadius: '2px',
                    transition: 'width 0.6s ease',
                }} />
            </div>

            {/* Done items (collapsible) */}
            {doneItems.length > 0 && (
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #E7E5E4',
                    marginBottom: '12px',
                    overflow: 'hidden',
                }}>
                    <button
                        onClick={() => setShowDone(!showDone)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: '#FAFAF9',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#78716C',
                        }}
                    >
                        <span>DONE ({doneItems.length})</span>
                        <span style={{
                            transition: 'transform 0.2s',
                            transform: showDone ? 'rotate(180deg)' : 'rotate(0)',
                            fontSize: '10px',
                        }}>
                            v
                        </span>
                    </button>
                    {showDone && doneItems.map(item => (
                        <BacklogRow key={item.id} item={item} />
                    ))}
                </div>
            )}

            {/* Pending items by category */}
            {Object.entries(categories).map(([cat, items]) => {
                const catMeta = CATEGORY_LABELS[cat as BacklogItem['category']];
                return (
                    <div key={cat} style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #E7E5E4',
                        marginBottom: '12px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '10px 16px',
                            background: '#FAFAF9',
                            borderBottom: '1px solid #F5F5F4',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <span style={{
                                fontSize: '9px',
                                fontWeight: '700',
                                color: catMeta.color,
                                backgroundColor: catMeta.color + '15',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                letterSpacing: '0.05em',
                            }}>
                                {catMeta.label}
                            </span>
                            <span style={{ fontSize: '11px', color: '#A8A29E' }}>
                                {items.length}
                            </span>
                        </div>
                        {items.map(item => (
                            <BacklogRow key={item.id} item={item} />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

function BacklogRow({ item }: { item: BacklogItem }) {
    const catMeta = CATEGORY_LABELS[item.category];
    return (
        <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid #F5F5F4',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            opacity: item.done ? 0.6 : 1,
        }}>
            {/* Checkbox */}
            <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: item.done ? 'none' : '2px solid #D6D3D1',
                backgroundColor: item.done ? '#D4AF37' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
            }}>
                {item.done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '12px',
                    color: item.done ? '#A8A29E' : '#44403C',
                    textDecoration: item.done ? 'line-through' : 'none',
                    lineHeight: '1.5',
                }}>
                    <span style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        color: catMeta.color,
                        marginRight: '6px',
                        opacity: item.done ? 0.5 : 0.8,
                    }}>
                        #{item.id}
                    </span>
                    {item.description}
                </div>
                {item.note && (
                    <div style={{
                        fontSize: '10px',
                        color: '#A8A29E',
                        marginTop: '2px',
                        lineHeight: '1.4',
                    }}>
                        {item.note}
                    </div>
                )}
            </div>

            {/* Date */}
            <div style={{
                fontSize: '10px',
                color: '#D6D3D1',
                flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
                textAlign: 'right',
            }}>
                {item.done && item.doneDate ? (
                    <span style={{ color: '#D4AF37' }}>{item.doneDate.slice(5)}</span>
                ) : (
                    <span>{item.addedDate.slice(5)}</span>
                )}
            </div>
        </div>
    );
}

export default function DashboardV3Page() {
    const router = useRouter();
    const [rows, setRows] = useState<FeatureRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // 1. Goroku: localStorage
            let gorokuTouched = 0;
            const gorokuTotal = 310;
            try {
                const mastery = JSON.parse(localStorage.getItem('goroku-mastery') || '{}');
                gorokuTouched = Object.values(mastery).filter((v: unknown) => (v as number) > 0).length;
            } catch { /* empty */ }

            // 2. Memoria: localStorage scan
            let memoriaCompleted = 0;
            let memoriaTotal = 0;
            try {
                memoriaTotal = parseInt(localStorage.getItem('memoria_total') || '0', 10);
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('memoria_') && key.endsWith('_completed') && localStorage.getItem(key) === 'true') {
                        memoriaCompleted++;
                    }
                }
                // Fallback: if memoria_total not set, use 20 (4 series x 5 episodes)
                if (memoriaTotal === 0) memoriaTotal = 20;
            } catch { /* empty */ }

            // 3. Pro: localStorage scan
            let proCompleted = 0;
            let proTotal = 0;
            try {
                proTotal = parseInt(localStorage.getItem('pro_total') || '0', 10);
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('pro_') && key.endsWith('_completed') && localStorage.getItem(key) === 'true') {
                        proCompleted++;
                    }
                }
            } catch { /* empty */ }

            // 4. Word Review: localStorage scan
            let wordReviewVisited = 0;
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('wordreview-visited-')) {
                        wordReviewVisited++;
                    }
                }
            } catch { /* empty */ }

            // 5. US States: localStorage
            let statesVisited = 0;
            const statesTotal = 50;
            try {
                const conquest = JSON.parse(localStorage.getItem('us-map-conquest') || '{}');
                statesVisited = Object.entries(conquest)
                    .filter(([, bools]) => (bools as boolean[]).some(Boolean))
                    .length;
            } catch { /* empty */ }

            // 6. Phrases: API (cumulative, no total)
            let phrasesCount = 0;
            try {
                const res = await fetch('/api/phrases');
                const data = await res.json();
                if (data.success) phrasesCount = (data.phrases || []).length;
            } catch { /* empty */ }

            // 7. Expressions + Word Review total: API
            let expressionsRegistered = 0;
            const expressionsTotal = 300; // 4 series x 75
            let wordReviewTotal = 0;
            try {
                const res = await fetch('/api/user-phrases');
                const data = await res.json();
                if (data.success) {
                    const allPhrases: { type?: string }[] = data.phrases || [];
                    // Word review total = total phrases / 10
                    wordReviewTotal = Math.ceil(allPhrases.length / 10);
                    // Expressions: count phrases registered with type 'expression'
                    expressionsRegistered = allPhrases.filter(p => p.type === 'expression').length;
                }
            } catch { /* empty */ }

            setRows([
                { key: 'goroku', label: '俺語録', touched: gorokuTouched, total: gorokuTotal, href: '/english/goroku', color: '#D4AF37' },
                { key: 'memoria', label: 'メモリア', touched: memoriaCompleted, total: memoriaTotal, href: '/memoria', color: '#10B981' },
                { key: 'pro', label: 'Pro', touched: proCompleted, total: proTotal, href: '/english/pro', color: '#7C3AED' },
                { key: 'wordreview', label: 'Word Review', touched: wordReviewVisited, total: wordReviewTotal, href: '/english/requiem', color: '#2563EB' },
                { key: 'phrases', label: 'フレーズ', touched: phrasesCount, total: null, href: '/english/phrases', color: '#EA580C' },
                { key: 'expressions', label: '表現集', touched: expressionsRegistered, total: expressionsTotal, href: '/english/expressions', color: '#DB2777' },
                { key: 'states', label: 'US States', touched: statesVisited, total: statesTotal, href: '/english/us-map', color: '#059669' },
            ]);

            setIsLoading(false);
        };

        loadData();
    }, []);

    const grandTotal = rows.reduce((sum, r) => sum + r.touched, 0);

    const fmtDate = () => {
        const d = new Date();
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#FAFAF9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A8A29E',
                fontSize: '13px',
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9' }}>
            {/* Header */}
            <header style={{
                height: '48px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #E7E5E4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                position: 'sticky',
                top: 0,
                zIndex: 30,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => router.push('/english')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#78716C',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                            padding: 0,
                        }}
                    >
                        Back
                    </button>
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#E7E5E4' }} />
                    <span style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#1C1917',
                        letterSpacing: '0.05em',
                    }}>
                        積み上げ
                    </span>
                </div>
                <span style={{
                    fontSize: '11px',
                    color: '#A8A29E',
                    backgroundColor: '#F5F5F4',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontWeight: '500',
                }}>
                    {fmtDate()}
                </span>
            </header>

            <main style={{
                padding: '24px 16px',
                maxWidth: '640px',
                margin: '0 auto',
            }}>
                {/* Hero: Grand Total */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #E7E5E4',
                    padding: '32px 24px',
                    marginBottom: '16px',
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#A8A29E',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                    }}>
                        TOTAL TOUCHED
                    </div>
                    <div style={{
                        fontSize: '56px',
                        fontWeight: '800',
                        color: '#1C1917',
                        lineHeight: 1,
                        marginBottom: '8px',
                    }}>
                        {grandTotal}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: '#78716C',
                        marginBottom: '20px',
                    }}>
                        これだけの英語に触れてきた
                    </div>

                    {/* Overall progress bar */}
                    {(() => {
                        const totalPossible = rows
                            .filter(r => r.total !== null)
                            .reduce((sum, r) => sum + (r.total || 0), 0);
                        const totalTouched = rows
                            .filter(r => r.total !== null)
                            .reduce((sum, r) => sum + r.touched, 0);
                        const pct = totalPossible > 0 ? Math.min((totalTouched / totalPossible) * 100, 100) : 0;
                        return (
                            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                <div style={{
                                    height: '8px',
                                    backgroundColor: '#E7E5E4',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${pct}%`,
                                        background: 'linear-gradient(90deg, #D4AF37, #B8961F)',
                                        borderRadius: '4px',
                                        transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    color: '#A8A29E',
                                    marginTop: '6px',
                                }}>
                                    {totalTouched} / {totalPossible}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Feature Bars */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #E7E5E4',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}>
                    {rows.map((row, i) => {
                        const pct = row.total !== null && row.total > 0
                            ? Math.min((row.touched / row.total) * 100, 100)
                            : 0;
                        const isLast = i === rows.length - 1;

                        return (
                            <div
                                key={row.key}
                                onClick={() => router.push(row.href)}
                                style={{
                                    padding: '16px 20px',
                                    borderBottom: isLast ? 'none' : '1px solid #F5F5F4',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#FAFAF9';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                                }}
                            >
                                {/* Label + Count */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                }}>
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#44403C',
                                    }}>
                                        {row.label}
                                    </span>
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: '#1C1917',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>
                                        {row.touched}
                                        {row.total !== null && (
                                            <span style={{ color: '#A8A29E', fontWeight: '400' }}>
                                                {' '}/ {row.total}
                                            </span>
                                        )}
                                        {row.total === null && (
                                            <span style={{ color: '#A8A29E', fontWeight: '400', fontSize: '10px', marginLeft: '4px' }}>
                                                累計
                                            </span>
                                        )}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div style={{
                                    height: '6px',
                                    backgroundColor: '#E7E5E4',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                }}>
                                    {row.total !== null ? (
                                        <div style={{
                                            height: '100%',
                                            width: `${pct}%`,
                                            background: `linear-gradient(90deg, ${row.color}, ${row.color}dd)`,
                                            borderRadius: '3px',
                                            transition: 'width 0.6s ease',
                                        }} />
                                    ) : (
                                        // Cumulative: full bar with subtle pattern
                                        <div style={{
                                            height: '100%',
                                            width: '100%',
                                            background: `repeating-linear-gradient(90deg, ${row.color} 0px, ${row.color} 4px, ${row.color}88 4px, ${row.color}88 8px)`,
                                            borderRadius: '3px',
                                        }} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Improvement Backlog */}
                <BacklogSection />
            </main>
        </div>
    );
}
