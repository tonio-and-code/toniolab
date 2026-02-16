'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getDailyContent, getAllDates, type DailyContent } from '@/data/daily-english';
import { SavedPhrasesStorage } from '@/lib/saved-phrases';

type ViewMode = 'discussion' | 'expressions';

const theme = {
    bg: '#f5f5f5',
    bgSecondary: '#ffffff',
    bgTertiary: '#fafafa',
    text: '#1a1a1a',
    textSecondary: '#555',
    textMuted: '#666',
    border: '#e5e5e5',
    borderLight: '#d5d5d5',
    accent: '#B8960C',
    success: '#059669',
    cyan: '#0891b2',
    speakerA: '#2563eb',
    speakerB: '#059669',
};

const getDayOfWeek = (dateStr: string): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateStr).getDay()];
};

const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} (${getDayOfWeek(dateStr)})`;
};

export default function NativeDatePage() {
    const params = useParams();
    const router = useRouter();
    const dateParam = params?.date as string;

    const [content, setContent] = useState<DailyContent | null>(null);
    const [allDates, setAllDates] = useState<string[]>([]);
    const [currentDateIndex, setCurrentDateIndex] = useState(-1);
    const [viewMode, setViewMode] = useState<ViewMode>('discussion');

    // Player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speed, setSpeed] = useState(0.9);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Saved phrases state
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());

    // Vocabulary modal state
    const [showVocabModal, setShowVocabModal] = useState(false);
    const [vocabExample, setVocabExample] = useState('');
    const [vocabWord, setVocabWord] = useState('');
    const [vocabMeaning, setVocabMeaning] = useState('');
    const [vocabType, setVocabType] = useState('word');
    const [vocabSaving, setVocabSaving] = useState(false);

    const isPlayingRef = useRef(false);
    const currentIndexRef = useRef(0);

    useEffect(() => {
        const savedSpeed = localStorage.getItem('native_speed');
        if (savedSpeed) setSpeed(parseFloat(savedSpeed));

        // Load saved phrases
        const saved = SavedPhrasesStorage.getAll();
        setSavedPhrases(new Set(saved.map(p => p.english)));

        // Load content
        const dates = getAllDates();
        setAllDates(dates);

        if (dateParam) {
            const dailyContent = getDailyContent(dateParam);
            if (dailyContent) {
                setContent(dailyContent);
                setCurrentDateIndex(dates.indexOf(dateParam));
            } else if (dates.length > 0) {
                router.replace(`/english/native/${dates[0]}`);
            }
        }

        // Load voices
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
            setVoices(enVoices);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [dateParam, router]);

    useEffect(() => {
        localStorage.setItem('native_speed', speed.toString());
    }, [speed]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    const toggleSavePhrase = (english: string, japanese: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (savedPhrases.has(english)) {
            const all = SavedPhrasesStorage.getAll();
            const found = all.find(p => p.english === english);
            if (found) SavedPhrasesStorage.remove(found.id);
            setSavedPhrases(prev => {
                const next = new Set(prev);
                next.delete(english);
                return next;
            });
        } else {
            SavedPhrasesStorage.save({
                english,
                japanese,
                source: `Native: ${content?.discussion.topic || dateParam}`,
            });
            setSavedPhrases(prev => new Set(prev).add(english));
        }
    };

    const openVocabModal = (english: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setVocabExample(english);
        setVocabWord('');
        setVocabMeaning('');
        setVocabType('word');
        setShowVocabModal(true);
    };

    const saveToVocabulary = async () => {
        if (!vocabWord.trim() || !vocabMeaning.trim()) return;
        setVocabSaving(true);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: vocabWord.trim(),
                    type: vocabType,
                    meaning: vocabMeaning.trim(),
                    example: vocabExample,
                    source: `Native: ${content?.discussion.topic || dateParam}`,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowVocabModal(false);
                setVocabWord('');
                setVocabMeaning('');
                setVocabExample('');
            }
        } catch (err) {
            console.error('Failed to save vocabulary:', err);
        } finally {
            setVocabSaving(false);
        }
    };

    const t = theme;

    const getCurrentItems = (): string[] => {
        if (!content) return [];
        if (viewMode === 'discussion') {
            return content.discussion.lines.map(line => line.text);
        } else {
            return content.expressions.map(exp => exp.english);
        }
    };

    const speakText = (text: string, onEnd?: () => void) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = speed;

        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;

        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        utterance.onerror = () => {
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const playFromIndex = (index: number) => {
        const items = getCurrentItems();
        if (index < 0 || index >= items.length) {
            setIsPlaying(false);
            return;
        }

        setCurrentIndex(index);
        setIsPlaying(true);

        speakText(items[index], () => {
            if (isPlayingRef.current) {
                const next = currentIndexRef.current + 1;
                if (next < items.length) {
                    setTimeout(() => playFromIndex(next), 300);
                } else {
                    setIsPlaying(false);
                }
            }
        });
    };

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            playFromIndex(currentIndex);
        }
    };

    const playNext = () => {
        window.speechSynthesis.cancel();
        const items = getCurrentItems();
        const next = (currentIndex + 1) % items.length;
        playFromIndex(next);
    };

    const playPrevious = () => {
        window.speechSynthesis.cancel();
        const items = getCurrentItems();
        const prev = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        playFromIndex(prev);
    };

    const handleLineClick = (index: number) => {
        window.speechSynthesis.cancel();
        setCurrentIndex(index);
        speakText(getCurrentItems()[index]);
    };

    const handleLineDoubleClick = (index: number) => {
        window.speechSynthesis.cancel();
        playFromIndex(index);
    };

    const goToDate = (direction: 'prev' | 'next') => {
        if (allDates.length === 0) return;
        window.speechSynthesis.cancel();
        setIsPlaying(false);

        let newIdx = direction === 'next' ? currentDateIndex + 1 : currentDateIndex - 1;
        if (newIdx >= allDates.length) newIdx = 0;
        if (newIdx < 0) newIdx = allDates.length - 1;

        router.push(`/english/native/${allDates[newIdx]}`);
    };

    if (!content) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: t.textMuted }}>Loading...</div>
            </div>
        );
    }

    const items = getCurrentItems();
    const savedCount = savedPhrases.size;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                backgroundColor: t.bg,
                zIndex: 10
            }}>
                <Link
                    href="/english/native"
                    onClick={() => window.speechSynthesis.cancel()}
                    style={{ color: t.textMuted, textDecoration: 'none', fontSize: '13px' }}
                >
                    &#8249; Native
                </Link>
                {savedCount > 0 && (
                    <Link
                        href="/english/saved"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            backgroundColor: 'transparent',
                            border: `1px solid ${t.accent}`,
                            borderRadius: '6px',
                            color: t.accent,
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>★</span>
                        <span>{savedCount}</span>
                    </Link>
                )}
            </div>

            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Date & Topic */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        fontSize: '12px',
                        color: t.cyan,
                        fontWeight: '600',
                        marginBottom: '8px'
                    }}>
                        {formatDateDisplay(dateParam)}
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>
                        {content.discussion.topic}
                    </h1>
                    <p style={{ fontSize: '14px', color: t.textMuted, margin: 0 }}>
                        {content.discussion.topicJa}
                    </p>
                </div>

                {/* Date Navigation */}
                {allDates.length > 1 && (
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '24px'
                    }}>
                        <button
                            onClick={() => goToDate('prev')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: t.bgSecondary,
                                border: `1px solid ${t.borderLight}`,
                                borderRadius: '10px',
                                color: t.text,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            &#8249; Prev
                        </button>
                        <button
                            onClick={() => goToDate('next')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: t.bgSecondary,
                                border: `1px solid ${t.borderLight}`,
                                borderRadius: '10px',
                                color: t.text,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Next &#8250;
                        </button>
                    </div>
                )}

                {/* View Mode Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                    backgroundColor: t.bgSecondary,
                    padding: '4px',
                    borderRadius: '12px',
                    border: `1px solid ${t.borderLight}`
                }}>
                    <button
                        onClick={() => {
                            window.speechSynthesis.cancel();
                            setIsPlaying(false);
                            setCurrentIndex(0);
                            setViewMode('discussion');
                        }}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            backgroundColor: viewMode === 'discussion' ? t.cyan : 'transparent',
                            color: viewMode === 'discussion' ? '#fff' : t.textMuted,
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Discussion ({content.discussion.lines.length})
                    </button>
                    <button
                        onClick={() => {
                            window.speechSynthesis.cancel();
                            setIsPlaying(false);
                            setCurrentIndex(0);
                            setViewMode('expressions');
                        }}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            backgroundColor: viewMode === 'expressions' ? t.cyan : 'transparent',
                            color: viewMode === 'expressions' ? '#fff' : t.textMuted,
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Expressions ({content.expressions.length})
                    </button>
                </div>

                {/* Playback Controls */}
                <div style={{
                    backgroundColor: t.bgSecondary,
                    borderRadius: '16px',
                    padding: '20px',
                    border: `1px solid ${t.borderLight}`,
                    marginBottom: '24px'
                }}>
                    {/* Current Item Display */}
                    <div style={{
                        minHeight: '60px',
                        marginBottom: '16px',
                        padding: '12px',
                        backgroundColor: t.bgTertiary,
                        borderRadius: '10px'
                    }}>
                        {viewMode === 'discussion' && content.discussion.lines[currentIndex] && (
                            <>
                                <div style={{
                                    fontSize: '11px',
                                    color: content.discussion.lines[currentIndex].speaker === 'A' ? t.speakerA : t.speakerB,
                                    fontWeight: '600',
                                    marginBottom: '4px'
                                }}>
                                    Speaker {content.discussion.lines[currentIndex].speaker}
                                </div>
                                <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                    {content.discussion.lines[currentIndex].text}
                                </div>
                            </>
                        )}
                        {viewMode === 'expressions' && content.expressions[currentIndex] && (
                            <>
                                <div style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '4px' }}>
                                    {content.expressions[currentIndex].english}
                                </div>
                                <div style={{ fontSize: '13px', color: t.textMuted }}>
                                    {content.expressions[currentIndex].japanese}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Progress */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: t.textMuted,
                        marginBottom: '16px'
                    }}>
                        <span>{currentIndex + 1} / {items.length}</span>
                        <span>{speed.toFixed(2)}x</span>
                    </div>

                    {/* Controls */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        marginBottom: '16px'
                    }}>
                        <button
                            onClick={playPrevious}
                            style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                        </button>
                        <button
                            onClick={togglePlay}
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                backgroundColor: t.cyan,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: '2px' }}>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={playNext}
                            style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                        </button>
                    </div>

                    {/* Speed Control */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', color: t.textMuted }}>0.5x</span>
                        <input
                            type="range"
                            min="0.5"
                            max="1.25"
                            step="0.05"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            style={{ width: '120px', accentColor: t.cyan }}
                        />
                        <span style={{ fontSize: '11px', color: t.textMuted }}>1.25x</span>
                    </div>
                </div>

                {/* Content List */}
                {viewMode === 'discussion' && (
                    <>
                        <h3 style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: t.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px'
                        }}>
                            Dialogue
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                            {content.discussion.lines.map((line, i) => {
                                const isSaved = savedPhrases.has(line.text);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleLineClick(i)}
                                        onDoubleClick={() => handleLineDoubleClick(i)}
                                        style={{
                                            backgroundColor: currentIndex === i ? t.bgTertiary : t.bgSecondary,
                                            borderRadius: '12px',
                                            padding: '14px 16px',
                                            border: `1px solid ${currentIndex === i ? t.cyan : t.borderLight}`,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '6px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    backgroundColor: line.speaker === 'A' ? t.speakerA : t.speakerB,
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    {line.speaker}
                                                </span>
                                                <span style={{ fontSize: '11px', color: t.textMuted }}>
                                                    Line {i + 1}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => openVocabModal(line.text, e)}
                                                    style={{
                                                        background: 'none',
                                                        border: `1px solid ${t.success}`,
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        padding: '4px 8px',
                                                        fontSize: '10px',
                                                        color: t.success,
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    +Vocab
                                                </button>
                                                <button
                                                    onClick={(e) => toggleSavePhrase(line.text, '', e)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        fontSize: '18px',
                                                        color: isSaved ? t.accent : '#ddd',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    {isSaved ? '★' : '☆'}
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            color: currentIndex === i ? t.text : t.textSecondary
                                        }}>
                                            {line.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Key Phrases */}
                        {content.discussion.keyPhrases.length > 0 && (
                            <>
                                <h3 style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: t.textMuted,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '12px'
                                }}>
                                    Key Phrases
                                </h3>
                                <div style={{
                                    backgroundColor: t.bgSecondary,
                                    borderRadius: '12px',
                                    border: `1px solid ${t.borderLight}`,
                                    overflow: 'hidden',
                                    marginBottom: '32px'
                                }}>
                                    {content.discussion.keyPhrases.map((phrase, i) => {
                                        const isSaved = savedPhrases.has(phrase.en);
                                        return (
                                            <div
                                                key={i}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderBottom: i < content.discussion.keyPhrases.length - 1 ? `1px solid ${t.borderLight}` : 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '14px', color: t.text, marginBottom: '2px' }}>
                                                        {phrase.en}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: t.textMuted }}>
                                                        {phrase.ja}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <button
                                                        onClick={(e) => openVocabModal(phrase.en, e)}
                                                        style={{
                                                            background: 'none',
                                                            border: `1px solid ${t.success}`,
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            padding: '4px 8px',
                                                            fontSize: '10px',
                                                            color: t.success,
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        +Vocab
                                                    </button>
                                                    <button
                                                        onClick={(e) => toggleSavePhrase(phrase.en, phrase.ja, e)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '4px 8px',
                                                            fontSize: '18px',
                                                            color: isSaved ? t.accent : '#ddd',
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        {isSaved ? '★' : '☆'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}

                {viewMode === 'expressions' && (
                    <>
                        <h3 style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: t.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px'
                        }}>
                            Expressions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                            {content.expressions.map((exp, i) => {
                                const isSaved = savedPhrases.has(exp.english);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleLineClick(i)}
                                        onDoubleClick={() => handleLineDoubleClick(i)}
                                        style={{
                                            backgroundColor: currentIndex === i ? t.bgTertiary : t.bgSecondary,
                                            borderRadius: '12px',
                                            padding: '14px 16px',
                                            border: `1px solid ${currentIndex === i ? t.cyan : t.borderLight}`,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            gap: '12px'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontSize: '15px',
                                                    color: currentIndex === i ? t.text : t.textSecondary,
                                                    marginBottom: '4px'
                                                }}>
                                                    {exp.english}
                                                </div>
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: t.textMuted,
                                                    marginBottom: exp.situation ? '6px' : 0
                                                }}>
                                                    {exp.japanese}
                                                </div>
                                                {exp.situation && (
                                                    <div style={{
                                                        display: 'inline-block',
                                                        padding: '2px 8px',
                                                        backgroundColor: t.cyan + '20',
                                                        borderRadius: '10px',
                                                        fontSize: '10px',
                                                        color: t.cyan,
                                                        fontWeight: '600'
                                                    }}>
                                                        {exp.situation}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                <button
                                                    onClick={(e) => openVocabModal(exp.english, e)}
                                                    style={{
                                                        background: 'none',
                                                        border: `1px solid ${t.success}`,
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        padding: '4px 8px',
                                                        fontSize: '10px',
                                                        color: t.success,
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    +Vocab
                                                </button>
                                                <button
                                                    onClick={(e) => toggleSavePhrase(exp.english, exp.japanese, e)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        fontSize: '18px',
                                                        color: isSaved ? t.accent : '#ddd',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    {isSaved ? '★' : '☆'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <div style={{ height: '80px' }} />

            {/* Vocabulary Save Modal */}
            {showVocabModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: t.bgSecondary,
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        border: `1px solid ${t.borderLight}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: t.text }}>Save to Vocabulary</h3>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: t.textMuted }}
                            >
                                x
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>Example Sentence</label>
                            <div style={{
                                padding: '12px',
                                backgroundColor: t.bgTertiary,
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: t.textSecondary,
                                lineHeight: '1.5'
                            }}>
                                {vocabExample}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>Word / Phrase to Learn *</label>
                            <input
                                type="text"
                                value={vocabWord}
                                onChange={(e) => setVocabWord(e.target.value)}
                                placeholder="e.g., rabbit hole, get the hang of"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: `1px solid ${t.borderLight}`,
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: t.bg,
                                    color: t.text
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>Type</label>
                            <select
                                value={vocabType}
                                onChange={(e) => setVocabType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: `1px solid ${t.borderLight}`,
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: t.bg,
                                    color: t.text
                                }}
                            >
                                <option value="word">Word</option>
                                <option value="idiom">Idiom</option>
                                <option value="phrasal verb">Phrasal Verb</option>
                                <option value="slang">Slang</option>
                                <option value="expression">Expression</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>Meaning (Japanese) *</label>
                            <input
                                type="text"
                                value={vocabMeaning}
                                onChange={(e) => setVocabMeaning(e.target.value)}
                                placeholder="e.g., 深みにはまる、コツをつかむ"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: `1px solid ${t.borderLight}`,
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: t.bg,
                                    color: t.text
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: t.bgTertiary,
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    color: t.textSecondary
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveToVocabulary}
                                disabled={vocabSaving || !vocabWord.trim() || !vocabMeaning.trim()}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: (!vocabWord.trim() || !vocabMeaning.trim()) ? t.textMuted : t.success,
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: (!vocabWord.trim() || !vocabMeaning.trim()) ? 'not-allowed' : 'pointer',
                                    color: '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                {vocabSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
