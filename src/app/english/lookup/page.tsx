'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

declare global {
    interface Window {
        YG: {
            Widget: new (id: string, options: {
                width: number;
                components: number;
                events: {
                    onFetchDone?: (event: { totalResult: number }) => void;
                    onVideoChange?: (event: { videoId: string }) => void;
                    onCaptionChange?: (event: { caption: string }) => void;
                };
            }) => {
                fetch: (phrase: string, lang: string) => void;
                next: () => void;
                pause: () => void;
            };
        };
        onYouglishAPIReady?: () => void;
    }
}

// Sample blog examples for demo (in production, this would come from an API)
const sampleBlogExamples: Record<string, { source: string; excerpt: string; url: string }[]> = {
    'tucked away': [
        {
            source: 'Milwaukee Record',
            excerpt: 'If you aren\'t looking specifically for Blue Star Cafe, you would never find it. The strip mall the Somali cafe occupies almost begs to be overlooked.',
            url: 'https://milwaukeerecord.com/food-drink/tucked-away-blue-star-cafe/',
        },
        {
            source: 'One Delightful Life',
            excerpt: 'Sometimes, the tastiest cup of coffee is served in a Kansas cafe you must look a bit harder to find.',
            url: 'https://onedelightfullife.com/tucked-away-coffee-shops/',
        },
        {
            source: 'Rome Travel Blog',
            excerpt: 'Alfredo e Ada is tucked away in the Piazza Navona district - a small, family-run trattoria with fantastic lasagna.',
            url: 'https://www.angelahanyak.com/notes-from-here/rome-hidden-gems-restaurants',
        },
    ],
    'hit different': [
        {
            source: 'Urban Dictionary Style',
            excerpt: 'Coffee hits different at sunrise when you\'re watching the city wake up.',
            url: '#',
        },
    ],
};

function LookupContent() {
    const searchParams = useSearchParams();
    const [phrase, setPhrase] = useState('');
    const [searchedPhrase, setSearchedPhrase] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [youglishReady, setYouglishReady] = useState(false);
    const [videoCount, setVideoCount] = useState<number | null>(null);
    const [blogExamples, setBlogExamples] = useState<typeof sampleBlogExamples['tucked away']>([]);
    const widgetRef = useRef<ReturnType<typeof window.YG.Widget> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasAutoSearched = useRef(false);

    // Save to vocabulary
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveMeaning, setSaveMeaning] = useState('');
    const [saveType, setSaveType] = useState('phrase');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const saveToVocabulary = async () => {
        if (!searchedPhrase || !saveMeaning.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: searchedPhrase,
                    type: saveType,
                    meaning: saveMeaning,
                    source: 'phrase-lookup',
                }),
            });
            if (res.ok || res.status === 409) {
                setIsSaved(true);
                setShowSaveModal(false);
            }
        } finally {
            setIsSaving(false);
        }
    };

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

    // Auto-search from URL parameter
    useEffect(() => {
        const q = searchParams.get('q');
        if (q && youglishReady && !hasAutoSearched.current) {
            hasAutoSearched.current = true;
            setPhrase(q);
            // Trigger search after state update
            setTimeout(() => {
                performSearch(q);
            }, 100);
        }
    }, [searchParams, youglishReady]);

    const performSearch = (searchPhrase: string) => {
        if (!searchPhrase.trim()) return;

        setIsLoading(true);
        setSearchedPhrase(searchPhrase.trim().toLowerCase());
        setVideoCount(null);
        setIsSaved(false);
        setSaveMeaning('');
        setSaveType('phrase');

        // Get blog examples (demo: use sample data, production: call API)
        const examples = sampleBlogExamples[searchPhrase.trim().toLowerCase()] || [];
        setBlogExamples(examples);

        // Initialize YouGlish widget
        if (youglishReady && window.YG && containerRef.current) {
            // Clear previous widget
            containerRef.current.innerHTML = '<div id="yg-widget"></div>';

            widgetRef.current = new window.YG.Widget('yg-widget', {
                width: 400,
                components: 255, // All components
                events: {
                    onFetchDone: (event: { totalResult: number }) => {
                        setVideoCount(event.totalResult);
                        setIsLoading(false);
                    },
                },
            });

            widgetRef.current.fetch(searchPhrase.trim(), 'english');
        } else {
            setIsLoading(false);
        }
    };

    const search = () => {
        performSearch(phrase);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') search();
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
                <Link href="/english" style={{
                    color: '#888',
                    textDecoration: 'none',
                    fontSize: '14px',
                }}>
                    Back
                </Link>
                <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    Phrase Lookup
                </span>
                <div style={{ width: '40px' }} />
            </div>

            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '20px',
            }}>
                {/* Search Input */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                }}>
                    <input
                        type="text"
                        value={phrase}
                        onChange={(e) => setPhrase(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a phrase (e.g., tucked away)"
                        style={{
                            flex: 1,
                            padding: '14px 16px',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            backgroundColor: '#1a1a1a',
                            color: '#fff',
                            fontSize: '15px',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={search}
                        disabled={isLoading || !phrase.trim()}
                        style={{
                            padding: '14px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#D4AF37',
                            color: '#000',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: phrase.trim() && !isLoading ? 'pointer' : 'default',
                            opacity: phrase.trim() && !isLoading ? 1 : 0.5,
                        }}
                    >
                        {isLoading ? '...' : 'Search'}
                    </button>
                </div>

                {/* Quick Examples */}
                {!searchedPhrase && (
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{
                            fontSize: '12px',
                            color: '#666',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            Try these
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['tucked away', 'hit different', 'low-key', 'vibe', 'no cap'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => {
                                        setPhrase(p);
                                        setTimeout(() => search(), 100);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: '1px solid #333',
                                        backgroundColor: 'transparent',
                                        color: '#888',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results */}
                {searchedPhrase && (
                    <>
                        {/* Section: Video Examples */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ef4444',
                                }} />
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                }}>
                                    Video Examples
                                </span>
                                {videoCount !== null && (
                                    <span style={{
                                        fontSize: '12px',
                                        color: '#666',
                                    }}>
                                        ({videoCount} found)
                                    </span>
                                )}
                            </div>

                            {/* YouGlish Widget Container */}
                            <div
                                ref={containerRef}
                                style={{
                                    backgroundColor: '#111',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    minHeight: '300px',
                                }}
                            >
                                <div id="yg-widget" />
                            </div>

                            <div style={{
                                marginTop: '8px',
                                fontSize: '11px',
                                color: '#666',
                                textAlign: 'center',
                            }}>
                                Powered by YouGlish - Real YouTube examples
                            </div>
                        </div>

                        {/* Section: Blog Examples */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#10b981',
                                }} />
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                }}>
                                    Written Examples
                                </span>
                            </div>

                            {blogExamples.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {blogExamples.map((example, i) => (
                                        <a
                                            key={i}
                                            href={example.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                borderRadius: '12px',
                                                padding: '16px',
                                                border: '1px solid #222',
                                                textDecoration: 'none',
                                                display: 'block',
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#10b981',
                                                marginBottom: '8px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                            }}>
                                                {example.source}
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#ccc',
                                                lineHeight: '1.6',
                                            }}>
                                                "{example.excerpt}"
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    backgroundColor: '#1a1a1a',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: '1px solid #222',
                                    textAlign: 'center',
                                    color: '#666',
                                    fontSize: '13px',
                                }}>
                                    No blog examples in demo data.
                                    <br />
                                    <span style={{ color: '#888' }}>
                                        Production version would search the web.
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Save to Vocabulary */}
                        <div style={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '2px solid #10B981',
                            marginBottom: '20px',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>
                                        {searchedPhrase}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {videoCount !== null ? `${videoCount.toLocaleString()} real examples` : 'Loading...'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => isSaved ? null : setShowSaveModal(true)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: isSaved ? '#10B981' : '#D4AF37',
                                        color: isSaved ? '#fff' : '#000',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: isSaved ? 'default' : 'pointer',
                                    }}
                                >
                                    {isSaved ? 'Saved!' : 'Save to Vocabulary'}
                                </button>
                            </div>
                        </div>

                        {/* How to use this phrase */}
                        <div style={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #D4AF37',
                        }}>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#D4AF37',
                                marginBottom: '12px',
                            }}>
                                Learning Tip
                            </div>
                            <div style={{
                                fontSize: '13px',
                                color: '#999',
                                lineHeight: '1.8',
                            }}>
                                Watch how native speakers use "{searchedPhrase}" in context.
                                <br />
                                Notice the situations, tone, and body language.
                                <br />
                                Then try using it yourself.
                            </div>
                        </div>
                    </>
                )}

                {/* Save Modal */}
                {showSaveModal && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px',
                        }}
                        onClick={() => setShowSaveModal(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: '16px',
                                padding: '24px',
                                width: '100%',
                                maxWidth: '400px',
                                border: '1px solid #333',
                            }}
                        >
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#D4AF37', marginBottom: '20px' }}>
                                {searchedPhrase}
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                                    Type
                                </label>
                                <select
                                    value={saveType}
                                    onChange={(e) => setSaveType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid #333',
                                        backgroundColor: '#0a0a0a',
                                        color: '#fff',
                                        fontSize: '14px',
                                    }}
                                >
                                    <option value="phrase">phrase</option>
                                    <option value="word">word</option>
                                    <option value="phrasal verb">phrasal verb</option>
                                    <option value="idiom">idiom</option>
                                    <option value="slang">slang</option>
                                    <option value="expression">expression</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>
                                    Meaning (Japanese) *
                                </label>
                                <input
                                    type="text"
                                    value={saveMeaning}
                                    onChange={(e) => setSaveMeaning(e.target.value)}
                                    placeholder="意味を入力..."
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #333',
                                        backgroundColor: '#0a0a0a',
                                        color: '#fff',
                                        fontSize: '15px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #333',
                                        backgroundColor: 'transparent',
                                        color: '#888',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveToVocabulary}
                                    disabled={isSaving || !saveMeaning.trim()}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: saveMeaning.trim() ? '#10B981' : '#333',
                                        color: saveMeaning.trim() ? '#fff' : '#666',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: saveMeaning.trim() && !isSaving ? 'pointer' : 'default',
                                    }}
                                >
                                    {isSaving ? '...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: '48px',
                    textAlign: 'center',
                    color: '#444',
                    fontSize: '11px',
                    lineHeight: '1.8',
                }}>
                    See how real people use real phrases.
                    <br />
                    Not textbook examples. Real life.
                </div>
            </div>
        </div>
    );
}

export default function LookupPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
            }}>
                Loading...
            </div>
        }>
            <LookupContent />
        </Suspense>
    );
}
