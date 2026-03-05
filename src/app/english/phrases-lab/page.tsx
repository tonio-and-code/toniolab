'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
    source_id?: string;
}

type MasteryLevel = 0 | 1 | 2 | 3;

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'daily': { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    'business': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'casual': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'idiom': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'slang': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
    'ore-log': { bg: '#FFFBEB', text: '#D4AF37', border: '#F6C85F' },
};

const getMasteryLabel = (level: MasteryLevel) => {
    switch (level) {
        case 0: return { label: 'NEW', color: '#888', bg: '#f0f0f0' };
        case 1: return { label: 'x1', color: '#D97706', bg: '#FEF3C7' };
        case 2: return { label: 'x2', color: '#2563EB', bg: '#DBEAFE' };
        case 3: return { label: 'CLEAR', color: '#059669', bg: '#D1FAE5' };
    }
};

export default function PhrasesLabPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [mastery, setMastery] = useState<Record<string, MasteryLevel>>({});
    const [loading, setLoading] = useState(true);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewFilter, setReviewFilter] = useState<'all' | 'shuffle'>('shuffle');

    // Quick-add form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [addEnglish, setAddEnglish] = useState('');
    const [addJapanese, setAddJapanese] = useState('');
    const [addCategory, setAddCategory] = useState('daily');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addedPhrases, setAddedPhrases] = useState<Phrase[]>([]);

    // Fetch phrases
    useEffect(() => {
        async function load() {
            try {
                const [phrasesRes, masteryRes] = await Promise.all([
                    fetch('/api/phrases'),
                    fetch('/api/phrases/mastery'),
                ]);
                const phrasesData = await phrasesRes.json();
                const masteryData = await masteryRes.json();
                if (phrasesData.success) setPhrases(phrasesData.phrases);
                if (masteryData.success) setMastery(masteryData.mastery || {});
            } catch (e) {
                console.error('Failed to load:', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Current month's phrases
    const thisMonthPhrases = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        return phrases.filter(p => {
            const d = new Date(p.date);
            return d.getFullYear() === y && d.getMonth() === m;
        });
    }, [phrases]);

    // Shuffled review list
    const reviewList = useMemo(() => {
        const list = [...thisMonthPhrases];
        if (reviewFilter === 'shuffle') {
            for (let i = list.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [list[i], list[j]] = [list[j], list[i]];
            }
        }
        return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thisMonthPhrases, reviewFilter]);

    const currentPhrase = reviewList[reviewIndex];

    // Children (phrases spawned from the current phrase)
    const childPhrases = useMemo(() => {
        if (!currentPhrase) return [];
        return phrases.filter(p => p.source_id === currentPhrase.id);
    }, [currentPhrase, phrases]);

    // Mastery cycle
    const cycleMastery = useCallback(async (id: string) => {
        const current = mastery[id] || 0;
        const next = ((current + 1) % 4) as MasteryLevel;
        setMastery(prev => ({ ...prev, [id]: next }));
        try {
            await fetch('/api/phrases/mastery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phraseId: id, level: next }),
            });
        } catch { /* silent */ }
    }, [mastery]);

    // Play TTS
    const playPhrase = useCallback((phrase: Phrase) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(phrase.english);
        u.lang = 'en-US';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }, []);

    // Quick add phrase linked to current source
    const handleAddPhrase = async () => {
        if (!addEnglish.trim() || !currentPhrase) return;
        setIsSubmitting(true);
        try {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: addEnglish.trim(),
                    japanese: addJapanese.trim(),
                    category: addCategory,
                    date: dateStr,
                    source_id: currentPhrase.id,
                }),
            });
            const data = await res.json();
            if (data.success && data.phrase) {
                setPhrases(prev => [data.phrase, ...prev]);
                setAddedPhrases(prev => [data.phrase, ...prev]);
                setAddEnglish('');
                setAddJapanese('');
                setShowAddForm(false);
            }
        } catch (e) {
            console.error('Failed to add phrase:', e);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Navigation
    const goNext = () => setReviewIndex(i => (i + 1) % reviewList.length);
    const goPrev = () => setReviewIndex(i => (i - 1 + reviewList.length) % reviewList.length);

    // Keyboard nav
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
            if (e.key === 'p') currentPhrase && playPhrase(currentPhrase);
            if (e.key === 'a') setShowAddForm(v => !v);
            if (e.key === 'm') currentPhrase && cycleMastery(currentPhrase.id);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#888' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
                        Phrases Lab
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                        Review + Quick Add (experimental)
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        {thisMonthPhrases.length} phrases this month
                    </span>
                    <a
                        href="/english/phrases"
                        style={{
                            fontSize: '12px',
                            color: '#3B82F6',
                            textDecoration: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #BFDBFE',
                            backgroundColor: '#EFF6FF',
                        }}
                    >
                        Main Page
                    </a>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                padding: '16px 24px',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
            }}>
                {[
                    { key: 'shuffle' as const, label: 'SHUFFLE', color: '#D4AF37', bg: '#FFFBEB' },
                    { key: 'all' as const, label: 'ALL', color: '#666', bg: '#f0f0f0' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setReviewFilter(tab.key); setReviewIndex(0); }}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: reviewFilter === tab.key ? '2px solid #D4AF37' : '1px solid #ddd',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            backgroundColor: reviewFilter === tab.key ? '#FFFBEB' : tab.bg,
                            color: tab.color,
                        }}
                    >
                        {tab.label} ({tab.key === 'all' ? thisMonthPhrases.length : reviewList.length})
                    </button>
                ))}
            </div>

            {/* Main Review Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                padding: '24px',
            }}>
                {reviewList.length === 0 ? (
                    <div style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginTop: '60px' }}>
                        No phrases this month yet.
                    </div>
                ) : (
                    <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Review Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '20px',
                            padding: '48px 40px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}>
                            {/* Progress */}
                            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px', textAlign: 'center' }}>
                                {reviewIndex + 1} / {reviewList.length}
                            </div>

                            {/* English */}
                            <div style={{
                                fontSize: '28px',
                                fontWeight: '600',
                                color: '#1a1a1a',
                                marginBottom: '12px',
                                lineHeight: 1.5,
                                textAlign: 'center',
                            }}>
                                {currentPhrase?.english}
                            </div>

                            {/* Japanese */}
                            <div style={{
                                fontSize: '18px',
                                color: '#666',
                                marginBottom: '32px',
                                textAlign: 'center',
                            }}>
                                {currentPhrase?.japanese}
                            </div>

                            {/* Category + Date */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                                {currentPhrase && (() => {
                                    const cat = CATEGORY_COLORS[currentPhrase.category] || CATEGORY_COLORS['daily'];
                                    return (
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            backgroundColor: cat.bg,
                                            color: cat.text,
                                        }}>
                                            {currentPhrase.category}
                                        </span>
                                    );
                                })()}
                                <span style={{ fontSize: '11px', color: '#aaa', padding: '4px 0' }}>
                                    {currentPhrase?.date?.split('T')[0]}
                                </span>
                            </div>

                            {/* Play + Mastery */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
                                <button
                                    onClick={() => currentPhrase && playPhrase(currentPhrase)}
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f5f5f5',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#666">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                                {currentPhrase && (() => {
                                    const m = mastery[currentPhrase.id] || 0;
                                    const info = getMasteryLabel(m as MasteryLevel);
                                    return (
                                        <button
                                            onClick={() => cycleMastery(currentPhrase.id)}
                                            style={{
                                                padding: '12px 28px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                backgroundColor: info.bg,
                                                color: info.color,
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {info.label}
                                        </button>
                                    );
                                })()}
                            </div>

                            {/* Quick Add Toggle */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: showAddForm ? '16px' : '24px' }}>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '8px',
                                        border: showAddForm ? '2px solid #D4AF37' : '1px solid #ddd',
                                        backgroundColor: showAddForm ? '#FFFBEB' : '#fff',
                                        color: showAddForm ? '#D4AF37' : '#888',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showAddForm ? 'Close' : '+ Add New Phrase'}
                                </button>
                            </div>

                            {/* Quick Add Form */}
                            {showAddForm && (
                                <div style={{
                                    padding: '20px',
                                    backgroundColor: '#FAFAF5',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E5D5',
                                    marginBottom: '24px',
                                }}>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '12px' }}>
                                        Linked to: {currentPhrase?.english}
                                    </div>

                                    <input
                                        type="text"
                                        value={addEnglish}
                                        onChange={e => setAddEnglish(e.target.value)}
                                        placeholder="English phrase"
                                        autoFocus
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleAddPhrase(); }}
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px',
                                            marginBottom: '8px',
                                            boxSizing: 'border-box',
                                            outline: 'none',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={addJapanese}
                                        onChange={e => setAddJapanese(e.target.value)}
                                        placeholder="Japanese meaning (optional)"
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleAddPhrase(); }}
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px',
                                            marginBottom: '8px',
                                            boxSizing: 'border-box',
                                            outline: 'none',
                                        }}
                                    />

                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <select
                                            value={addCategory}
                                            onChange={e => setAddCategory(e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #ddd',
                                                fontSize: '13px',
                                                outline: 'none',
                                                backgroundColor: '#fff',
                                            }}
                                        >
                                            <option value="daily">daily</option>
                                            <option value="casual">casual</option>
                                            <option value="business">business</option>
                                            <option value="idiom">idiom</option>
                                            <option value="slang">slang</option>
                                            <option value="ore-log">ore-log</option>
                                        </select>
                                        <button
                                            onClick={handleAddPhrase}
                                            disabled={isSubmitting || !addEnglish.trim()}
                                            style={{
                                                padding: '8px 20px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: isSubmitting || !addEnglish.trim() ? '#ddd' : '#D4AF37',
                                                color: isSubmitting || !addEnglish.trim() ? '#999' : '#000',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: isSubmitting || !addEnglish.trim() ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Children (spawned phrases) */}
                            {childPhrases.length > 0 && (
                                <div style={{
                                    padding: '16px',
                                    backgroundColor: '#F8FAFC',
                                    borderRadius: '10px',
                                    border: '1px solid #E2E8F0',
                                    marginBottom: '24px',
                                }}>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                        SPAWNED FROM THIS ({childPhrases.length})
                                    </div>
                                    {childPhrases.map(child => (
                                        <div key={child.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #F1F5F9',
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>
                                                    {child.english}
                                                </div>
                                                {child.japanese && (
                                                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                                        {child.japanese}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => playPhrase(child)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#94A3B8">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Recently added in this session */}
                            {addedPhrases.length > 0 && (
                                <div style={{
                                    padding: '16px',
                                    backgroundColor: '#FFFBEB',
                                    borderRadius: '10px',
                                    border: '1px solid #FDE68A',
                                    marginBottom: '24px',
                                }}>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#D4AF37', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                        ADDED THIS SESSION ({addedPhrases.length})
                                    </div>
                                    {addedPhrases.map(p => (
                                        <div key={p.id} style={{
                                            padding: '6px 0',
                                            borderBottom: '1px solid #FEF3C7',
                                            fontSize: '13px',
                                            color: '#92400E',
                                        }}>
                                            {p.english} {p.japanese && <span style={{ color: '#B45309' }}>- {p.japanese}</span>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Navigation */}
                            <div style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                                <button
                                    onClick={goPrev}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        borderRadius: '10px',
                                        border: '1px solid #e5e5e5',
                                        backgroundColor: '#fff',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        color: '#666',
                                    }}
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={goNext}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        backgroundColor: '#D4AF37',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        {/* Keyboard shortcuts hint */}
                        <div style={{
                            textAlign: 'center',
                            fontSize: '11px',
                            color: '#bbb',
                            padding: '8px',
                        }}>
                            Keys: Arrow/Space = nav, P = play, A = add form, M = mastery
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
