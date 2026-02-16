'use client';

import { useState, useEffect, useMemo } from 'react';

interface UserPhrase {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    mastery_level: number;
    created_at: string;
    review_sentence?: string;
    review_idiom?: string;
    review_idiom_meaning?: string;
}

const WORDS_PER_DAY = 50;
const TOTAL_TARGET = 15000;

export default function IdiomListPage() {
    const [allPhrases, setAllPhrases] = useState<UserPhrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/user-phrases');
                const data = await res.json();
                if (data.success) {
                    setAllPhrases(data.phrases || []);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Sort by created_at then id (same order as word-review), assign index, then filter to idioms
    const idiomEntries = useMemo(() => {
        const sorted = [...allPhrases].sort((a, b) => {
            const dateCompare = (a.created_at || '').localeCompare(b.created_at || '');
            if (dateCompare !== 0) return dateCompare;
            return a.id.localeCompare(b.id);
        });

        const withIndex = sorted.map((phrase, index) => ({
            ...phrase,
            wordIndex: index,
            dayNumber: Math.floor(index / WORDS_PER_DAY) + 1,
        }));

        return withIndex.filter(p => p.review_idiom && p.review_idiom.trim() !== '');
    }, [allPhrases]);

    // Filter by search
    const filteredIdioms = useMemo(() => {
        if (!search.trim()) return idiomEntries;
        const q = search.toLowerCase();
        return idiomEntries.filter(entry =>
            (entry.review_idiom || '').toLowerCase().includes(q) ||
            (entry.review_idiom_meaning || '').toLowerCase().includes(q) ||
            entry.phrase.toLowerCase().includes(q)
        );
    }, [idiomEntries, search]);

    // Sort alphabetically by idiom
    const displayIdioms = useMemo(() => {
        return [...filteredIdioms].sort((a, b) =>
            (a.review_idiom || '').toLowerCase().localeCompare((b.review_idiom || '').toLowerCase())
        );
    }, [filteredIdioms]);

    const idiomCount = idiomEntries.length;

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#FAFAF9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    fontSize: '16px',
                    color: '#78716C',
                    letterSpacing: '0.05em',
                }}>
                    Loading idioms...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FAFAF9',
            padding: isMobile ? '16px' : '32px 40px',
        }}>
            {/* Header */}
            <div style={{
                maxWidth: '960px',
                margin: '0 auto',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '12px' : '0',
                    marginBottom: '24px',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: isMobile ? '22px' : '28px',
                            fontWeight: '700',
                            color: '#1C1917',
                            margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            Idiom Collection
                        </h1>
                        <p style={{
                            fontSize: '13px',
                            color: '#78716C',
                            margin: '4px 0 0 0',
                        }}>
                            Word Review で使用されたイディオム一覧
                        </p>
                    </div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: '4px',
                        padding: '8px 16px',
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #D4AF37',
                        borderRadius: '8px',
                    }}>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#D4AF37',
                        }}>
                            {idiomCount.toLocaleString()}
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: '#92400E',
                        }}>
                            / {TOTAL_TARGET.toLocaleString()} idioms used
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#E7E5E4',
                    borderRadius: '3px',
                    marginBottom: '24px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: `${Math.min((idiomCount / TOTAL_TARGET) * 100, 100)}%`,
                        height: '100%',
                        backgroundColor: '#D4AF37',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                    }} />
                </div>

                {/* Search */}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search idioms, meanings, or words..."
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
                        onFocus={e => e.target.style.borderColor = '#D4AF37'}
                        onBlur={e => e.target.style.borderColor = '#D6D3D1'}
                    />
                    {search && (
                        <div style={{
                            fontSize: '12px',
                            color: '#78716C',
                            marginTop: '6px',
                            paddingLeft: '4px',
                        }}>
                            {filteredIdioms.length} results found
                        </div>
                    )}
                </div>

                {/* Table */}
                {displayIdioms.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 16px',
                        color: '#A8A29E',
                        fontSize: '14px',
                    }}>
                        {search ? 'No idioms match your search.' : 'No idioms found yet.'}
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7E5E4',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}>
                        {/* Table Header */}
                        {!isMobile && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '52px 1fr 1fr 160px 72px',
                                padding: '12px 16px',
                                backgroundColor: '#F5F5F4',
                                borderBottom: '1px solid #E7E5E4',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#78716C',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase' as const,
                            }}>
                                <div>#</div>
                                <div>Idiom</div>
                                <div>Meaning</div>
                                <div>Paired Word</div>
                                <div style={{ textAlign: 'right' }}>Day</div>
                            </div>
                        )}

                        {/* Rows */}
                        {displayIdioms.map((entry, i) => (
                            <div
                                key={entry.id}
                                style={{
                                    display: isMobile ? 'flex' : 'grid',
                                    gridTemplateColumns: isMobile ? undefined : '52px 1fr 1fr 160px 72px',
                                    flexDirection: isMobile ? 'column' : undefined,
                                    padding: isMobile ? '12px 16px' : '10px 16px',
                                    borderBottom: i < displayIdioms.length - 1 ? '1px solid #F5F5F4' : 'none',
                                    backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAF9',
                                    alignItems: isMobile ? 'flex-start' : 'center',
                                    gap: isMobile ? '4px' : '0',
                                    transition: 'background-color 0.1s ease',
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
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1C1917',
                                            }}>
                                                {entry.review_idiom}
                                            </span>
                                            <span style={{
                                                fontSize: '11px',
                                                color: '#D4AF37',
                                                fontWeight: '600',
                                            }}>
                                                Day {entry.dayNumber}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#57534E',
                                        }}>
                                            {entry.review_idiom_meaning || '--'}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#A8A29E',
                                        }}>
                                            {entry.phrase}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#A8A29E',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            {i + 1}
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#1C1917',
                                            lineHeight: '1.4',
                                        }}>
                                            {entry.review_idiom}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#57534E',
                                            lineHeight: '1.4',
                                        }}>
                                            {entry.review_idiom_meaning || '--'}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#78716C',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {entry.phrase}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#D4AF37',
                                            fontWeight: '600',
                                            textAlign: 'right',
                                        }}>
                                            Day {entry.dayNumber}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer count */}
                <div style={{
                    textAlign: 'center',
                    padding: '20px 0',
                    fontSize: '12px',
                    color: '#A8A29E',
                }}>
                    {displayIdioms.length === idiomCount
                        ? `${idiomCount} idioms total`
                        : `Showing ${displayIdioms.length} of ${idiomCount} idioms`
                    }
                </div>
            </div>
        </div>
    );
}
