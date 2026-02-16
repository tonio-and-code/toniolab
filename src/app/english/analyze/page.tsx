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
                    onVideoChange?: (event: { videoId: string; caption: string; start: number }) => void;
                    onCaptionChange?: (event: { caption: string; start: number }) => void;
                };
            }) => {
                fetch: (phrase: string, lang: string) => void;
            };
        };
        onYouglishAPIReady?: () => void;
    }
}

interface CurrentVideo {
    videoId: string;
    caption: string;
    timestamp: number;
}

interface ExtractedPhrase {
    phrase: string;
    type: string;
    meaning: string;
    note?: string;
    videoCount?: number;
}

export default function AnalyzePage() {
    const [inputText, setInputText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [phrases, setPhrases] = useState<ExtractedPhrase[]>([]);
    const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
    const [youglishReady, setYouglishReady] = useState(false);
    const [videoCount, setVideoCount] = useState<number | null>(null);
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
    const [savingPhrase, setSavingPhrase] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [currentVideo, setCurrentVideo] = useState<CurrentVideo | null>(null);
    const widgetContainerRef = useRef<HTMLDivElement>(null);

    // Save phrase to collection
    const savePhrase = async (phrase: ExtractedPhrase) => {
        setSavingPhrase(phrase.phrase);
        setSaveMessage(null);

        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: phrase.phrase,
                    type: phrase.type,
                    meaning: phrase.meaning,
                    note: phrase.note,
                    source: 'text-analyzer',
                    // Include video clip info if available
                    video_id: currentVideo?.videoId,
                    video_timestamp: currentVideo?.timestamp,
                    video_text: currentVideo?.caption,
                }),
            });

            const data = await res.json();

            if (res.status === 409) {
                setSaveMessage('Already saved');
            } else if (data.success) {
                setSavedPhrases(prev => new Set([...prev, phrase.phrase]));
                setSaveMessage('Saved!');
            } else {
                setSaveMessage('Failed');
            }
        } catch {
            setSaveMessage('Error');
        } finally {
            setSavingPhrase(null);
            setTimeout(() => setSaveMessage(null), 2000);
        }
    };

    // Sample text for demo
    const sampleText = `I found this amazing little cafe tucked away in a side street. The coffee there just hits different, you know? It's low-key become my favorite spot. The owner is super chill and always hooks me up with extra pastries. No cap, it's the best kept secret in town.`;

    // Demo phrases for sample text (no API needed)
    const demoPhrases: ExtractedPhrase[] = [
        {
            phrase: 'tucked away',
            type: 'phrasal verb',
            meaning: '人目につかない場所にある、隠れた場所に位置する',
            note: '隠れ家的なカフェやレストランの説明によく使われる',
        },
        {
            phrase: 'hits different',
            type: 'slang',
            meaning: '特別に感じる、いつもと違う良さがある',
            note: 'Gen Z発祥のスラング。「This song hits different at night」のように使う',
        },
        {
            phrase: 'low-key',
            type: 'slang',
            meaning: 'こっそり、控えめに、実は',
            note: '「I low-key love this」＝「実はこれ好き」。反対は high-key',
        },
        {
            phrase: 'hooks me up',
            type: 'phrasal verb',
            meaning: 'おまけしてくれる、便宜を図ってくれる',
            note: '「Can you hook me up?」＝「なんとかしてくれない？」',
        },
        {
            phrase: 'No cap',
            type: 'slang',
            meaning: 'マジで、嘘じゃない',
            note: 'cap = 嘘。「No cap」＝「嘘じゃない」＝「マジで」',
        },
        {
            phrase: 'best kept secret',
            type: 'idiom',
            meaning: '知る人ぞ知る、隠れた名店',
            note: 'まだ広く知られていない良いものを指す定番表現',
        },
    ];

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

    const analyze = async () => {
        if (!inputText.trim()) return;

        setIsAnalyzing(true);
        setPhrases([]);
        setSelectedPhrase(null);

        // Use demo data for sample text
        const isSampleText = inputText.trim() === sampleText.trim();

        if (isSampleText) {
            // Simulate loading
            await new Promise(resolve => setTimeout(resolve, 500));
            setPhrases(demoPhrases);
            setSelectedPhrase(demoPhrases[0].phrase);
            setIsAnalyzing(false);
            return;
        }

        // Real API call for other text
        try {
            const res = await fetch('/api/extract-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });

            const data = await res.json();
            if (data.phrases) {
                setPhrases(data.phrases);
                // Auto-select first phrase
                if (data.phrases.length > 0) {
                    setSelectedPhrase(data.phrases[0].phrase);
                }
            }
        } catch (err) {
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Load YouGlish when phrase is selected
    useEffect(() => {
        if (selectedPhrase && youglishReady && window.YG && widgetContainerRef.current) {
            widgetContainerRef.current.innerHTML = '<div id="yg-widget-analyze"></div>';
            setVideoCount(null);
            setCurrentVideo(null);

            const widget = new window.YG.Widget('yg-widget-analyze', {
                width: 380,
                components: 255,
                events: {
                    onFetchDone: (event) => {
                        setVideoCount(event.totalResult);
                    },
                    onVideoChange: (event) => {
                        setCurrentVideo({
                            videoId: event.videoId,
                            caption: event.caption,
                            timestamp: Math.floor(event.start),
                        });
                    },
                    onCaptionChange: (event) => {
                        setCurrentVideo(prev => prev ? {
                            ...prev,
                            caption: event.caption,
                            timestamp: Math.floor(event.start),
                        } : null);
                    },
                },
            });

            widget.fetch(selectedPhrase, 'english');
        }
    }, [selectedPhrase, youglishReady]);

    // Highlight phrases in text
    const getHighlightedText = () => {
        if (phrases.length === 0) return inputText;

        let result = inputText;
        const sortedPhrases = [...phrases].sort((a, b) => b.phrase.length - a.phrase.length);

        sortedPhrases.forEach((p, index) => {
            const regex = new RegExp(`(${p.phrase})`, 'gi');
            result = result.replace(regex, `<<PHRASE_${index}>>$1<<END_PHRASE>>`);
        });

        return result;
    };

    const renderHighlightedText = () => {
        const text = getHighlightedText();
        const parts: JSX.Element[] = [];
        let currentIndex = 0;
        let key = 0;

        const regex = /<<PHRASE_(\d+)>>(.+?)<<END_PHRASE>>/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Add text before match
            if (match.index > currentIndex) {
                parts.push(
                    <span key={key++}>{text.slice(currentIndex, match.index)}</span>
                );
            }

            const phraseIndex = parseInt(match[1]);
            const phraseText = match[2];
            const phrase = phrases[phraseIndex];

            parts.push(
                <span
                    key={key++}
                    onClick={() => setSelectedPhrase(phrase.phrase)}
                    style={{
                        backgroundColor: selectedPhrase === phrase.phrase ? '#D4AF37' : '#3b3b00',
                        color: selectedPhrase === phrase.phrase ? '#000' : '#D4AF37',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    {phraseText}
                </span>
            );

            currentIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (currentIndex < text.length) {
            parts.push(<span key={key++}>{text.slice(currentIndex)}</span>);
        }

        return parts;
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
                    Text Analyzer
                </span>
                <div style={{ width: '40px' }} />
            </div>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
            }}>
                {/* Input Section */}
                {phrases.length === 0 && (
                    <>
                        <div style={{
                            marginBottom: '12px',
                            fontSize: '13px',
                            color: '#666',
                        }}>
                            Paste any English text. AI will find idioms, phrasal verbs, and slang.
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste English text here..."
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid #333',
                                backgroundColor: '#1a1a1a',
                                color: '#fff',
                                fontSize: '15px',
                                lineHeight: '1.8',
                                resize: 'vertical',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />

                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button
                                onClick={() => setInputText(sampleText)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                    backgroundColor: 'transparent',
                                    color: '#888',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                Load Sample
                            </button>

                            <button
                                onClick={analyze}
                                disabled={isAnalyzing || !inputText.trim()}
                                style={{
                                    flex: 1,
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: inputText.trim() && !isAnalyzing ? '#D4AF37' : '#333',
                                    color: inputText.trim() && !isAnalyzing ? '#000' : '#666',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: inputText.trim() && !isAnalyzing ? 'pointer' : 'default',
                                }}
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
                            </button>
                        </div>
                    </>
                )}

                {/* Results Section */}
                {phrases.length > 0 && (
                    <>
                        {/* Highlighted Text */}
                        <div style={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #333',
                            marginBottom: '20px',
                        }}>
                            <div style={{
                                fontSize: '11px',
                                color: '#666',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '12px',
                            }}>
                                Tap highlighted phrases
                            </div>
                            <div style={{
                                fontSize: '15px',
                                lineHeight: '2',
                                color: '#ccc',
                            }}>
                                {renderHighlightedText()}
                            </div>
                        </div>

                        {/* Selected Phrase Detail */}
                        {selectedPhrase && (() => {
                            const selected = phrases.find(p => p.phrase === selectedPhrase);
                            if (!selected) return null;
                            const isSaved = savedPhrases.has(selected.phrase);
                            const isSaving = savingPhrase === selected.phrase;

                            return (
                                <div style={{
                                    backgroundColor: '#1a1a00',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: '2px solid #D4AF37',
                                    marginBottom: '20px',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                fontSize: '24px',
                                                fontWeight: '700',
                                                color: '#D4AF37',
                                            }}>
                                                {selected.phrase}
                                            </span>
                                            <span style={{
                                                fontSize: '11px',
                                                color: '#D4AF37',
                                                backgroundColor: '#2a2a00',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                textTransform: 'uppercase',
                                            }}>
                                                {selected.type}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => savePhrase(selected)}
                                            disabled={isSaved || isSaving}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: isSaved ? '#10B981' : '#D4AF37',
                                                color: isSaved ? '#fff' : '#000',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: isSaved || isSaving ? 'default' : 'pointer',
                                                opacity: isSaving ? 0.7 : 1,
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {isSaving ? '...' : isSaved ? 'Saved' : saveMessage || (currentVideo ? 'Save + Clip' : 'Save')}
                                        </button>
                                    </div>
                                    <div style={{
                                        fontSize: '16px',
                                        color: '#fff',
                                        marginBottom: selected.note ? '12px' : '0',
                                        lineHeight: '1.6',
                                    }}>
                                        {selected.meaning}
                                    </div>
                                    {selected.note && (
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#aaa',
                                            backgroundColor: '#0a0a0a',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            lineHeight: '1.6',
                                        }}>
                                            {selected.note}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Two Column Layout */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
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
                                    {phrases.length} phrases found
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {phrases.map((p, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedPhrase(p.phrase)}
                                            style={{
                                                backgroundColor: selectedPhrase === p.phrase ? '#2a2a00' : '#1a1a1a',
                                                borderRadius: '10px',
                                                padding: '12px 14px',
                                                border: `1px solid ${selectedPhrase === p.phrase ? '#D4AF37' : '#222'}`,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: selectedPhrase === p.phrase ? '#D4AF37' : '#fff',
                                            }}>
                                                {p.phrase}
                                            </span>
                                            <span style={{
                                                fontSize: '10px',
                                                color: '#666',
                                                backgroundColor: '#222',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                            }}>
                                                {p.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: YouGlish Player */}
                            <div>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#ef4444',
                                        }} />
                                        Real Usage
                                        {videoCount !== null && (
                                            <span style={{ color: '#D4AF37' }}>
                                                {videoCount.toLocaleString()} videos
                                            </span>
                                        )}
                                    </div>
                                    {selectedPhrase && (
                                        <button
                                            onClick={() => setSelectedPhrase(null)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#888',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                padding: '4px 8px',
                                            }}
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>

                                <div
                                    ref={widgetContainerRef}
                                    style={{
                                        backgroundColor: '#111',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        minHeight: '300px',
                                    }}
                                >
                                    <div id="yg-widget-analyze" />
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={() => {
                                setPhrases([]);
                                setSelectedPhrase(null);
                                setInputText('');
                            }}
                            style={{
                                marginTop: '24px',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                backgroundColor: 'transparent',
                                color: '#888',
                                fontSize: '13px',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            Analyze New Text
                        </button>
                    </>
                )}

                {/* Learning Philosophy Section */}
                {phrases.length > 0 && (
                    <div style={{
                        marginTop: '32px',
                        padding: '20px',
                        backgroundColor: '#111',
                        borderRadius: '12px',
                        border: '1px solid #222',
                    }}>
                        <div style={{
                            fontSize: '11px',
                            color: '#D4AF37',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '16px',
                        }}>
                            Why This Works
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: '#888',
                            lineHeight: '2',
                        }}>
                            <p style={{ margin: '0 0 12px 0' }}>
                                <span style={{ color: '#D4AF37' }}>1. Notice</span> —
                                You just found phrases you didn&apos;t know existed.
                                This &quot;noticing&quot; is the first step of acquisition.
                            </p>
                            <p style={{ margin: '0 0 12px 0' }}>
                                <span style={{ color: '#D4AF37' }}>2. Observe</span> —
                                Watch real people use these phrases.
                                Context, tone, and timing become clear.
                            </p>
                            <p style={{ margin: '0 0 12px 0' }}>
                                <span style={{ color: '#D4AF37' }}>3. Borrow</span> —
                                Try using them yourself. They&apos;ll feel awkward at first.
                                That&apos;s normal. They&apos;re still &quot;someone else&apos;s words.&quot;
                            </p>
                            <p style={{ margin: '0' }}>
                                <span style={{ color: '#D4AF37' }}>4. Own</span> —
                                After using them 5-10 times, the awkwardness fades.
                                They become <em>your</em> words. This is language acquisition.
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    color: '#444',
                    fontSize: '11px',
                    lineHeight: '1.8',
                }}>
                    Speaking is borrowing others&apos; words until they become yours.<br />
                    他者の言葉を借りて、自分のものにする。それが言語習得。
                </div>
            </div>
        </div>
    );
}
