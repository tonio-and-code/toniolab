'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

declare global {
    interface Window {
        YG: {
            Widget: new (id: string, options: {
                width: number;
                components: number;
                events: {
                    onFetchDone?: (event: { totalResult: number }) => void;
                };
            }) => {
                fetch: (phrase: string, lang: string) => void;
            };
        };
        onYouglishAPIReady?: () => void;
    }
}

interface UserPhrase {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    note: string | null;
    example: string | null;
    source: string | null;
    mastery_level: number;
    times_used: number;
    created_at: string;
    last_reviewed_at: string | null;
    video_id: string | null;
    video_timestamp: number | null;
    video_text: string | null;
}

const MASTERY_LABELS = ['New', 'Seen', 'Practiced', 'Comfortable', 'Owned'];
const MASTERY_COLORS = ['#666', '#D4AF37', '#F59E0B', '#10B981', '#10B981'];

export default function MyPhrasesPage() {
    const [phrases, setPhrases] = useState<UserPhrase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPhrase, setSelectedPhrase] = useState<UserPhrase | null>(null);
    const [youglishReady, setYouglishReady] = useState(false);
    const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'owned'>('all');
    const widgetContainerRef = useRef<HTMLDivElement>(null);

    // Load YouGlish script
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.getElementById('youglish-script')) {
            const script = document.createElement('script');
            script.id = 'youglish-script';
            script.src = 'https://youglish.com/public/emb/widget.js';
            script.async = true;
            document.body.appendChild(script);

            window.onYouglishAPIReady = () => {
                setYouglishReady(true);
            };
        } else if (window.YG) {
            setYouglishReady(true);
        }
    }, []);

    // Fetch phrases
    useEffect(() => {
        const fetchPhrases = async () => {
            try {
                const res = await fetch('/api/user-phrases');
                const data = await res.json();
                if (data.success) {
                    setPhrases(data.phrases);
                    if (data.phrases.length > 0) {
                        setSelectedPhrase(data.phrases[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching phrases:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPhrases();
    }, []);

    // Load YouGlish when phrase is selected
    useEffect(() => {
        if (selectedPhrase && youglishReady && window.YG && widgetContainerRef.current) {
            widgetContainerRef.current.innerHTML = '<div id="yg-widget-myphrases"></div>';

            const widget = new window.YG.Widget('yg-widget-myphrases', {
                width: 400,
                components: 255,
                events: {},
            });

            widget.fetch(selectedPhrase.phrase, 'english');
        }
    }, [selectedPhrase, youglishReady]);

    // Update mastery level
    const updateMastery = async (phraseId: string, level: number) => {
        try {
            await fetch(`/api/user-phrases/${phraseId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mastery_level: level }),
            });

            setPhrases(prev => prev.map(p =>
                p.id === phraseId ? { ...p, mastery_level: level, times_used: p.times_used + 1 } : p
            ));

            if (selectedPhrase?.id === phraseId) {
                setSelectedPhrase(prev => prev ? { ...prev, mastery_level: level, times_used: prev.times_used + 1 } : null);
            }
        } catch (error) {
            console.error('Error updating mastery:', error);
        }
    };

    // Delete phrase
    const deletePhrase = async (phraseId: string) => {
        if (!confirm('Delete this phrase from your collection?')) return;

        try {
            await fetch(`/api/user-phrases/${phraseId}`, { method: 'DELETE' });
            setPhrases(prev => prev.filter(p => p.id !== phraseId));
            if (selectedPhrase?.id === phraseId) {
                setSelectedPhrase(phrases.find(p => p.id !== phraseId) || null);
            }
        } catch (error) {
            console.error('Error deleting phrase:', error);
        }
    };

    // Filter phrases
    const filteredPhrases = phrases.filter(p => {
        if (filter === 'all') return true;
        if (filter === 'new') return p.mastery_level === 0;
        if (filter === 'learning') return p.mastery_level >= 1 && p.mastery_level <= 3;
        if (filter === 'owned') return p.mastery_level === 4;
        return true;
    });

    // Stats
    const stats = {
        total: phrases.length,
        new: phrases.filter(p => p.mastery_level === 0).length,
        learning: phrases.filter(p => p.mastery_level >= 1 && p.mastery_level <= 3).length,
        owned: phrases.filter(p => p.mastery_level === 4).length,
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0a',
            color: '#fff',
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #222',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                backgroundColor: '#0a0a0a',
                zIndex: 10,
            }}>
                <Link href="/english" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
                    Back
                </Link>
                <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    My Phrases
                </span>
                <Link href="/english/analyze" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '13px' }}>
                    + Add
                </Link>
            </div>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    Loading...
                </div>
            ) : phrases.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>
                        { }
                    </div>
                    <div style={{ fontSize: '16px', color: '#888', marginBottom: '24px' }}>
                        No phrases saved yet
                    </div>
                    <Link
                        href="/english/analyze"
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#D4AF37',
                            color: '#000',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        Find Phrases to Save
                    </Link>
                </div>
            ) : (
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
                    {/* Stats Bar */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { key: 'all', label: 'All', count: stats.total },
                            { key: 'new', label: 'New', count: stats.new },
                            { key: 'learning', label: 'Learning', count: stats.learning },
                            { key: 'owned', label: 'Owned', count: stats.owned },
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key as typeof filter)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: `1px solid ${filter === key ? '#D4AF37' : '#333'}`,
                                    backgroundColor: filter === key ? '#2a2a00' : 'transparent',
                                    color: filter === key ? '#D4AF37' : '#888',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                {label} ({count})
                            </button>
                        ))}
                    </div>

                    {/* Mastery Progress */}
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                    }}>
                        <div style={{
                            fontSize: '11px',
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px',
                        }}>
                            Mastery Journey
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            <div style={{
                                flex: stats.new || 1,
                                height: '8px',
                                backgroundColor: '#333',
                                borderRadius: '4px 0 0 4px',
                            }} />
                            <div style={{
                                flex: stats.learning || 0,
                                height: '8px',
                                backgroundColor: '#D4AF37',
                            }} />
                            <div style={{
                                flex: stats.owned || 0,
                                height: '8px',
                                backgroundColor: '#10B981',
                                borderRadius: '0 4px 4px 0',
                            }} />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            fontSize: '11px',
                            color: '#666',
                        }}>
                            <span>Stranger → Acquaintance → Friend → Part of You</span>
                            <span>{stats.owned}/{stats.total} owned</span>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                    }}>
                        {/* Left: Phrase List */}
                        <div>
                            <div style={{
                                fontSize: '11px',
                                color: '#666',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '12px',
                            }}>
                                {filteredPhrases.length} phrases
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                maxHeight: '500px',
                                overflowY: 'auto',
                            }}>
                                {filteredPhrases.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPhrase(p)}
                                        style={{
                                            backgroundColor: selectedPhrase?.id === p.id ? '#2a2a00' : '#1a1a1a',
                                            borderRadius: '10px',
                                            padding: '14px',
                                            border: `1px solid ${selectedPhrase?.id === p.id ? '#D4AF37' : '#222'}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '6px',
                                        }}>
                                            <span style={{
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: selectedPhrase?.id === p.id ? '#D4AF37' : '#fff',
                                            }}>
                                                {p.phrase}
                                            </span>
                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                {p.video_id && (
                                                    <span style={{
                                                        fontSize: '8px',
                                                        color: '#10B981',
                                                        backgroundColor: '#0a2a1a',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                    }}>
                                                        CLIP
                                                    </span>
                                                )}
                                                <span style={{
                                                    fontSize: '9px',
                                                    color: MASTERY_COLORS[p.mastery_level],
                                                    backgroundColor: '#222',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                }}>
                                                    {MASTERY_LABELS[p.mastery_level]}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666',
                                        }}>
                                            {p.meaning.length > 40 ? p.meaning.slice(0, 40) + '...' : p.meaning}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Selected Phrase Detail + YouGlish */}
                        <div>
                            {selectedPhrase && (
                                <>
                                    {/* Phrase Detail */}
                                    <div style={{
                                        backgroundColor: '#1a1a00',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: '2px solid #D4AF37',
                                        marginBottom: '16px',
                                        position: 'relative',
                                    }}>
                                        {/* Close Button */}
                                        <button
                                            onClick={() => setSelectedPhrase(null)}
                                            style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#888',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                padding: '4px 8px',
                                            }}
                                        >
                                            x
                                        </button>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '12px',
                                        }}>
                                            <div>
                                                <span style={{
                                                    fontSize: '22px',
                                                    fontWeight: '700',
                                                    color: '#D4AF37',
                                                }}>
                                                    {selectedPhrase.phrase}
                                                </span>
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: '#D4AF37',
                                                    backgroundColor: '#2a2a00',
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    marginLeft: '10px',
                                                    textTransform: 'uppercase',
                                                }}>
                                                    {selectedPhrase.type}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deletePhrase(selectedPhrase.id)}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #333',
                                                    backgroundColor: 'transparent',
                                                    color: '#666',
                                                    fontSize: '11px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div style={{
                                            fontSize: '15px',
                                            color: '#fff',
                                            marginBottom: '16px',
                                            lineHeight: '1.6',
                                        }}>
                                            {selectedPhrase.meaning}
                                        </div>

                                        {selectedPhrase.note && (
                                            <div style={{
                                                fontSize: '13px',
                                                color: '#aaa',
                                                backgroundColor: '#0a0a0a',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                marginBottom: '16px',
                                            }}>
                                                {selectedPhrase.note}
                                            </div>
                                        )}

                                        {/* Mastery Buttons */}
                                        <div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#666',
                                                marginBottom: '8px',
                                            }}>
                                                How well do you know this? (Reviewed {selectedPhrase.times_used}x)
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {MASTERY_LABELS.map((label, level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => updateMastery(selectedPhrase.id, level)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '8px 4px',
                                                            borderRadius: '6px',
                                                            border: `1px solid ${selectedPhrase.mastery_level === level ? MASTERY_COLORS[level] : '#333'}`,
                                                            backgroundColor: selectedPhrase.mastery_level === level ? '#2a2a00' : 'transparent',
                                                            color: selectedPhrase.mastery_level === level ? MASTERY_COLORS[level] : '#666',
                                                            fontSize: '10px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Player - Saved Clip or YouGlish */}
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#666',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: selectedPhrase.video_id ? '#10B981' : '#ef4444',
                                        }} />
                                        {selectedPhrase.video_id ? 'Saved Clip' : 'Find Examples'}
                                    </div>

                                    {/* If saved video clip exists, show YouTube embed */}
                                    {selectedPhrase.video_id ? (
                                        <div>
                                            <div style={{
                                                position: 'relative',
                                                paddingBottom: '56.25%',
                                                backgroundColor: '#111',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                            }}>
                                                <iframe
                                                    key={`${selectedPhrase.video_id}-${selectedPhrase.video_timestamp}`}
                                                    src={`https://www.youtube.com/embed/${selectedPhrase.video_id}?start=${Math.max(0, (selectedPhrase.video_timestamp || 0) - 2)}&autoplay=0`}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        border: 'none',
                                                    }}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                            {selectedPhrase.video_text && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    padding: '12px',
                                                    backgroundColor: '#1a1a1a',
                                                    borderRadius: '8px',
                                                    border: '1px solid #333',
                                                }}>
                                                    <div style={{
                                                        fontSize: '10px',
                                                        color: '#666',
                                                        marginBottom: '6px',
                                                        textTransform: 'uppercase',
                                                    }}>
                                                        Saved Caption
                                                    </div>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        color: '#fff',
                                                        lineHeight: '1.5',
                                                    }}>
                                                        &quot;{selectedPhrase.video_text}&quot;
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Fall back to YouGlish search */
                                        <div
                                            ref={widgetContainerRef}
                                            style={{
                                                backgroundColor: '#111',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                minHeight: '280px',
                                            }}
                                        >
                                            <div id="yg-widget-myphrases" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Philosophy */}
                    <div style={{
                        marginTop: '32px',
                        padding: '16px',
                        backgroundColor: '#111',
                        borderRadius: '12px',
                        border: '1px solid #222',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.8' }}>
                            Words start as strangers. Through repeated use, they become yours.<br />
                            <span style={{ color: '#D4AF37' }}>
                                Keep reviewing. Keep using. Own your vocabulary.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
