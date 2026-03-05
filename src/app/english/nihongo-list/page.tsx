'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { NIHONGO_SEEDS, CATEGORY_META } from '@/data/english/nihongo-seed';

interface NihongoItem {
    id: string;
    day_slot: number;
    japanese: string;
    english: string;
    literal: string | null;
    category: string;
}

const CATEGORY_COLORS: Record<string, { fg: string; bg: string }> = {
    body: { fg: '#DC2626', bg: '#FEF2F2' },
    nature: { fg: '#059669', bg: '#ECFDF5' },
    food: { fg: '#D97706', bg: '#FFFBEB' },
    emotion: { fg: '#7C3AED', bg: '#F5F3FF' },
    action: { fg: '#2563EB', bg: '#EFF6FF' },
    life: { fg: '#64748B', bg: '#F8FAFC' },
};

function buildEntries(): NihongoItem[] {
    const counters: Record<number, number> = {};
    return NIHONGO_SEEDS.map(seed => {
        const idx = counters[seed.daySlot] || 0;
        counters[seed.daySlot] = idx + 1;
        return {
            id: `n${String(seed.daySlot).padStart(2, '0')}_${idx}`,
            day_slot: seed.daySlot,
            japanese: seed.japanese,
            english: seed.english,
            literal: seed.literal || null,
            category: seed.category,
        };
    });
}

type SortMode = 'day' | 'alphabetical';

export default function NihongoListPage() {
    const [entries] = useState<NihongoItem[]>(() => buildEntries());
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>('day');
    const [playingId, setPlayingId] = useState<string | null>(null);

    // Daily phrases registration state
    const [registeredPhrases, setRegisteredPhrases] = useState<Set<string>>(new Set());
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [batchRegistering, setBatchRegistering] = useState(false);
    const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
    const [flashId, setFlashId] = useState<string | null>(null);

    const totalEntries = entries.length;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch existing phrases to check registration status
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/user-phrases');
                if (res.ok) {
                    const data = await res.json();
                    const set = new Set<string>();
                    (data.phrases || []).forEach((p: { phrase: string }) => {
                        set.add(p.phrase.toLowerCase());
                    });
                    setRegisteredPhrases(set);
                }
            } catch { /* ignore */ }
            setLoading(false);
        })();
    }, []);

    const isRegistered = useCallback((english: string) => {
        return registeredPhrases.has(english.toLowerCase());
    }, [registeredPhrases]);

    const registeredCount = useMemo(() =>
        entries.filter(e => isRegistered(e.english)).length,
    [entries, isRegistered]);

    // Category counts (unfiltered)
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        entries.forEach(e => {
            counts[e.category] = (counts[e.category] || 0) + 1;
        });
        return counts;
    }, [entries]);

    // Filter by category
    const categoryFiltered = useMemo(() => {
        if (!categoryFilter) return entries;
        return entries.filter(e => e.category === categoryFilter);
    }, [entries, categoryFilter]);

    // Filter by search
    const searchFiltered = useMemo(() => {
        if (!search.trim()) return categoryFiltered;
        const q = search.toLowerCase();
        return categoryFiltered.filter(entry =>
            entry.japanese.toLowerCase().includes(q) ||
            entry.english.toLowerCase().includes(q) ||
            (entry.literal || '').toLowerCase().includes(q)
        );
    }, [categoryFiltered, search]);

    // Sort
    const displayEntries = useMemo(() => {
        const sorted = [...searchFiltered];
        switch (sortMode) {
            case 'alphabetical':
                sorted.sort((a, b) => a.japanese.localeCompare(b.japanese, 'ja'));
                break;
            case 'day':
            default:
                sorted.sort((a, b) => {
                    if (a.day_slot !== b.day_slot) return a.day_slot - b.day_slot;
                    return a.id.localeCompare(b.id);
                });
                break;
        }
        return sorted;
    }, [searchFiltered, sortMode]);

    // Unregistered entries in current view
    const unregisteredInView = useMemo(() =>
        displayEntries.filter(e => !isRegistered(e.english)),
    [displayEntries, isRegistered]);

    // Register a single entry
    const registerEntry = async (entry: NihongoItem) => {
        if (isRegistered(entry.english) || registeringId === entry.id) return;
        setRegisteringId(entry.id);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: entry.english,
                    type: 'idiom',
                    meaning: entry.japanese + (entry.literal ? ` (lit. ${entry.literal})` : ''),
                    source: `nihongo-list Day ${entry.day_slot}`,
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

    // Batch register all unregistered in current view
    const batchRegister = async () => {
        if (unregisteredInView.length === 0 || batchRegistering) return;
        setBatchRegistering(true);
        setBatchProgress({ current: 0, total: unregisteredInView.length });
        for (let i = 0; i < unregisteredInView.length; i++) {
            const entry = unregisteredInView[i];
            setBatchProgress({ current: i + 1, total: unregisteredInView.length });
            try {
                const res = await fetch('/api/user-phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phrase: entry.english,
                        type: 'idiom',
                        meaning: entry.japanese + (entry.literal ? ` (lit. ${entry.literal})` : ''),
                        source: `nihongo-list Day ${entry.day_slot}`,
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

        enUtterance.onend = () => setPlayingId(null);
        enUtterance.onerror = () => setPlayingId(null);

        jaUtterance.onend = () => {
            window.speechSynthesis.speak(enUtterance);
        };
        jaUtterance.onerror = () => setPlayingId(null);

        window.speechSynthesis.speak(jaUtterance);
    }, []);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#FAFAF9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <span style={{ color: '#A8A29E', fontSize: '13px', letterSpacing: '0.5px' }}>
                    Loading...
                </span>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FAFAF9',
            padding: isMobile ? '16px' : '32px 40px',
        }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>

                {/* -- Header -- */}
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
                            fontWeight: '900',
                            color: '#1C1917',
                            margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            {'\u65E5\u672C\u8A9E\u5B9A\u578B\u53E5'}
                        </h1>
                        <p style={{
                            fontSize: '13px',
                            color: '#A8A29E',
                            margin: '4px 0 0 0',
                            letterSpacing: '0.3px',
                        }}>
                            Japanese Idiom Dictionary
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'baseline',
                            gap: '4px',
                            padding: '8px 16px',
                            backgroundColor: registeredCount === totalEntries ? '#ECFDF5' : '#FEF3C7',
                            border: `1px solid ${registeredCount === totalEntries ? '#059669' : '#D97706'}`,
                            borderRadius: '8px',
                        }}>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: '800',
                                color: registeredCount === totalEntries ? '#059669' : '#D97706',
                            }}>
                                {registeredCount}
                            </span>
                            <span style={{
                                fontSize: '13px',
                                color: registeredCount === totalEntries ? '#065F46' : '#92400E',
                            }}>
                                / {totalEntries} registered
                            </span>
                        </div>
                        {unregisteredInView.length > 0 && (
                            <button
                                onClick={batchRegister}
                                disabled={batchRegistering}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #D97706',
                                    backgroundColor: batchRegistering ? '#FEF3C7' : '#D97706',
                                    color: batchRegistering ? '#92400E' : '#fff',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    cursor: batchRegistering ? 'default' : 'pointer',
                                    transition: 'all 0.15s',
                                    letterSpacing: '0.3px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {batchRegistering && batchProgress
                                    ? `${batchProgress.current}/${batchProgress.total}`
                                    : `Register All (${unregisteredInView.length})`
                                }
                            </button>
                        )}
                    </div>
                </div>

                {/* -- Progress bar -- */}
                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#E7E5E4',
                    borderRadius: '3px',
                    marginBottom: '24px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: totalEntries > 0 ? `${(registeredCount / totalEntries) * 100}%` : '0%',
                        height: '100%',
                        backgroundColor: registeredCount === totalEntries ? '#059669' : '#D97706',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                    }} />
                </div>

                {/* -- Search -- */}
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search japanese, english, or literal..."
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
                        onFocus={e => e.target.style.borderColor = '#D97706'}
                        onBlur={e => e.target.style.borderColor = '#D6D3D1'}
                    />
                    {search && (
                        <div style={{
                            fontSize: '12px',
                            color: '#78716C',
                            marginTop: '6px',
                            paddingLeft: '4px',
                        }}>
                            {searchFiltered.length} results found
                        </div>
                    )}
                </div>

                {/* -- Category Filter Pills -- */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                }}>
                    <button
                        onClick={() => setCategoryFilter(null)}
                        style={{
                            padding: '5px 14px',
                            borderRadius: '16px',
                            border: categoryFilter === null ? '1px solid #44403C' : '1px solid #E7E5E4',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            backgroundColor: categoryFilter === null ? '#44403C' : '#fff',
                            color: categoryFilter === null ? '#fff' : '#A8A29E',
                            transition: 'all 0.15s',
                        }}
                    >
                        All {totalEntries}
                    </button>
                    {Object.keys(CATEGORY_META).map(cat => {
                        const meta = CATEGORY_META[cat];
                        const colors = CATEGORY_COLORS[cat] || { fg: '#999', bg: '#f5f5f5' };
                        const isActive = categoryFilter === cat;
                        const count = categoryCounts[cat] || 0;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(isActive ? null : cat)}
                                style={{
                                    padding: '5px 14px',
                                    borderRadius: '16px',
                                    border: isActive ? `1px solid ${colors.fg}` : '1px solid #E7E5E4',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: isActive ? colors.bg : '#fff',
                                    color: isActive ? colors.fg : '#A8A29E',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {meta.en} {count}
                            </button>
                        );
                    })}
                </div>

                {/* -- Sort Options -- */}
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '20px',
                }}>
                    {([
                        { key: 'day' as SortMode, label: 'By Day' },
                        { key: 'alphabetical' as SortMode, label: '\u3042\u3044\u3046\u3048\u304A' },
                    ]).map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setSortMode(opt.key)}
                            style={{
                                padding: '4px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backgroundColor: sortMode === opt.key ? '#D97706' : '#F5F5F4',
                                color: sortMode === opt.key ? '#fff' : '#78716C',
                                transition: 'all 0.15s',
                                letterSpacing: '0.3px',
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* -- Table / List -- */}
                {displayEntries.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 16px',
                        color: '#A8A29E',
                        fontSize: '14px',
                    }}>
                        {search ? 'No idioms match your search.' : 'No idioms found.'}
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7E5E4',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}>
                        {/* Desktop Table Header */}
                        {!isMobile && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '44px 2fr 2fr 1.5fr 80px 56px 52px',
                                padding: '10px 16px',
                                backgroundColor: '#F5F5F4',
                                borderBottom: '1px solid #E7E5E4',
                                fontSize: '10px',
                                fontWeight: '700',
                                color: '#78716C',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase' as const,
                            }}>
                                <div>#</div>
                                <div>Japanese</div>
                                <div>English</div>
                                <div>Literal</div>
                                <div>Category</div>
                                <div style={{ textAlign: 'center' }}>Day</div>
                                <div style={{ textAlign: 'center' }}></div>
                            </div>
                        )}

                        {/* Rows */}
                        {displayEntries.map((entry, i) => {
                            const catColor = CATEGORY_COLORS[entry.category] || { fg: '#999', bg: '#f5f5f5' };
                            const meta = CATEGORY_META[entry.category];
                            const registered = isRegistered(entry.english);
                            const isPlaying = playingId === entry.id;
                            const isFlashing = flashId === entry.id;
                            const isThisRegistering = registeringId === entry.id;

                            if (isMobile) {
                                return (
                                    <div
                                        key={entry.id}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: i < displayEntries.length - 1 ? '1px solid #F5F5F4' : 'none',
                                            backgroundColor: isFlashing ? '#FEF3C7' : (i % 2 === 0 ? '#FFFFFF' : '#FAFAF9'),
                                            transition: 'background-color 0.3s',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '4px',
                                        }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginBottom: '2px',
                                                }}>
                                                    <button
                                                        onClick={() => speak(entry.japanese, entry.english, entry.id)}
                                                        style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '50%',
                                                            flexShrink: 0,
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            backgroundColor: isPlaying ? catColor.fg : '#F5F5F4',
                                                            color: isPlaying ? '#fff' : '#78716C',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '11px',
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        {isPlaying ? '\u25A0' : '\u25B6'}
                                                    </button>
                                                    <span style={{
                                                        fontSize: '16px',
                                                        fontWeight: '800',
                                                        color: '#1C1917',
                                                    }}>
                                                        {entry.japanese}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: '#57534E',
                                                    marginLeft: '36px',
                                                }}>
                                                    {entry.english}
                                                </div>
                                                {entry.literal && (
                                                    <div style={{
                                                        fontSize: '11px',
                                                        fontStyle: 'italic',
                                                        color: '#A8A29E',
                                                        marginLeft: '36px',
                                                        marginTop: '1px',
                                                    }}>
                                                        lit. {entry.literal}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Register button */}
                                            <button
                                                onClick={() => !registered && registerEntry(entry)}
                                                disabled={registered || isThisRegistering}
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    flexShrink: 0,
                                                    border: registered ? '2px solid #059669' : '2px solid #E7E5E4',
                                                    cursor: registered ? 'default' : 'pointer',
                                                    backgroundColor: registered ? '#059669' : 'transparent',
                                                    color: registered ? '#fff' : '#A8A29E',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: isThisRegistering ? '10px' : '14px',
                                                    fontWeight: '700',
                                                    transition: 'all 0.15s',
                                                    marginTop: '2px',
                                                    opacity: isThisRegistering ? 0.5 : 1,
                                                }}
                                            >
                                                {isThisRegistering ? '...' : registered ? '\u2713' : '+'}
                                            </button>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginLeft: '36px',
                                            marginTop: '6px',
                                        }}>
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
                                                {meta?.en || entry.category}
                                            </span>
                                            <span style={{
                                                fontSize: '10px',
                                                color: '#D6D3D1',
                                                fontWeight: '600',
                                            }}>
                                                Day {entry.day_slot}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            // Desktop: grid row
                            return (
                                <div
                                    key={entry.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '44px 2fr 2fr 1.5fr 80px 56px 52px',
                                        padding: '10px 16px',
                                        borderBottom: i < displayEntries.length - 1 ? '1px solid #F5F5F4' : 'none',
                                        backgroundColor: isFlashing ? '#FEF3C7' : (i % 2 === 0 ? '#FFFFFF' : '#FAFAF9'),
                                        alignItems: 'center',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    {/* # */}
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#D6D3D1',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>
                                        {i + 1}
                                    </div>

                                    {/* Japanese + TTS */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <button
                                            onClick={() => speak(entry.japanese, entry.english, entry.id)}
                                            style={{
                                                width: '26px',
                                                height: '26px',
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                border: 'none',
                                                cursor: 'pointer',
                                                backgroundColor: isPlaying ? catColor.fg : '#F5F5F4',
                                                color: isPlaying ? '#fff' : '#78716C',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            {isPlaying ? '\u25A0' : '\u25B6'}
                                        </button>
                                        <span style={{
                                            fontSize: '15px',
                                            fontWeight: '800',
                                            color: '#1C1917',
                                            lineHeight: 1.3,
                                        }}>
                                            {entry.japanese}
                                        </span>
                                    </div>

                                    {/* English */}
                                    <div style={{
                                        fontSize: '13px',
                                        color: '#57534E',
                                        lineHeight: 1.4,
                                    }}>
                                        {entry.english}
                                    </div>

                                    {/* Literal */}
                                    <div style={{
                                        fontSize: '12px',
                                        fontStyle: 'italic',
                                        color: '#A8A29E',
                                        lineHeight: 1.4,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {entry.literal ? `lit. ${entry.literal}` : '--'}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '2px 8px',
                                            borderRadius: '8px',
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            backgroundColor: catColor.bg,
                                            color: catColor.fg,
                                            letterSpacing: '0.3px',
                                        }}>
                                            {meta?.en || entry.category}
                                        </span>
                                    </div>

                                    {/* Day */}
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#D97706',
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }}>
                                        {entry.day_slot}
                                    </div>

                                    {/* Register button */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => !registered && registerEntry(entry)}
                                            disabled={registered || isThisRegistering}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: registered ? '2px solid #059669' : '2px solid #E7E5E4',
                                                cursor: registered ? 'default' : 'pointer',
                                                backgroundColor: registered ? '#059669' : 'transparent',
                                                color: registered ? '#fff' : '#A8A29E',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: isThisRegistering ? '9px' : '12px',
                                                fontWeight: '700',
                                                transition: 'all 0.15s',
                                                opacity: isThisRegistering ? 0.5 : 1,
                                            }}
                                            title={registered ? 'Registered' : 'Register to Daily Phrases'}
                                        >
                                            {isThisRegistering ? '...' : registered ? '\u2713' : '+'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* -- Footer -- */}
                <div style={{
                    textAlign: 'center',
                    padding: '20px 0',
                    fontSize: '12px',
                    color: '#A8A29E',
                }}>
                    {displayEntries.length === totalEntries
                        ? `Showing ${totalEntries} idioms`
                        : `Showing ${displayEntries.length} of ${totalEntries} idioms`
                    }
                </div>
            </div>
        </div>
    );
}
