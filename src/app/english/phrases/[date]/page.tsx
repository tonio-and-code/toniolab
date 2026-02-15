'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { SavedPhrasesStorage } from '@/lib/saved-phrases';
import VoiceRecorder from '@/components/VoiceRecorder';

interface VoiceRecording {
    id: number;
    phrase_id: string;
    url: string;
    created_at: string;
}

interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

type MasteryLevel = 0 | 1 | 2 | 3;

const getDayOfWeek = (dateStr: string): string => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[new Date(dateStr).getDay()];
};

const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export default function PhraseDatePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = params?.date as string;

    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [allDates, setAllDates] = useState<string[]>([]);
    const [currentDateIndex, setCurrentDateIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [phraseMastery, setPhraseMastery] = useState<Record<string, MasteryLevel>>({});
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voiceRecordings, setVoiceRecordings] = useState<Record<string, VoiceRecording[]>>({});

    // Vocabulary modal state
    const [showVocabModal, setShowVocabModal] = useState(false);
    const [vocabExample, setVocabExample] = useState('');
    const [vocabWord, setVocabWord] = useState('');
    const [vocabMeaning, setVocabMeaning] = useState('');
    const [vocabType, setVocabType] = useState('word');
    const [vocabSaving, setVocabSaving] = useState(false);
    const [vocabDate, setVocabDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });

    // Player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(0.9);
    const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
    const [isShuffle, setIsShuffle] = useState(false);
    const [autoNextDay, setAutoNextDay] = useState(false);
    const [shuffleDays, setShuffleDays] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const repeatModeRef = useRef(0);
    const isShuffleRef = useRef(false);
    const autoNextDayRef = useRef(false);
    const shuffleDaysRef = useRef(false);

    useEffect(() => {
        autoNextDayRef.current = autoNextDay;
        shuffleDaysRef.current = shuffleDays;
    }, [autoNextDay, shuffleDays]);

    // Load settings
    useEffect(() => {
        const savedSpeed = localStorage.getItem('phrases_speed');
        const savedRepeatMode = localStorage.getItem('phrases_repeatMode');
        const savedShuffle = localStorage.getItem('phrases_shuffle');
        const savedPlayMode = localStorage.getItem('phrases_dayPlayMode');

        if (savedSpeed) setSpeed(parseFloat(savedSpeed));
        if (savedRepeatMode) {
            const mode = parseInt(savedRepeatMode);
            setRepeatMode(mode);
            repeatModeRef.current = mode;
        }
        if (savedShuffle === 'true') {
            setIsShuffle(true);
            isShuffleRef.current = true;
        }
        if (savedPlayMode === 'auto') {
            setAutoNextDay(true);
            setShuffleDays(false);
        } else if (savedPlayMode === 'shuffle') {
            setAutoNextDay(true);
            setShuffleDays(true);
        }

        // Load mastery from API
        fetch('/api/phrases/mastery')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPhraseMastery(data.mastery || {});
                }
            })
            .catch(() => {});

        // Load voice recordings
        fetch('/api/voice-recordings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setVoiceRecordings(data.recordings || {});
                }
            })
            .catch(() => {});

        const saved = SavedPhrasesStorage.getAll();
        setSavedPhrases(new Set(saved.map(p => p.english)));
        setSettingsLoaded(true);
    }, []);

    // Save settings
    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('phrases_speed', speed.toString());
    }, [speed, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('phrases_repeatMode', repeatMode.toString());
    }, [repeatMode, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('phrases_shuffle', isShuffle.toString());
    }, [isShuffle, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        const playMode = !autoNextDay ? 'manual' : shuffleDays ? 'shuffle' : 'auto';
        localStorage.setItem('phrases_dayPlayMode', playMode);
    }, [autoNextDay, shuffleDays, settingsLoaded]);

    // Load phrases and dates
    useEffect(() => {
        const fetchPhrases = async () => {
            try {
                const res = await fetch('/api/phrases');
                const data = await res.json();
                if (data.success) {
                    // Group by date
                    const grouped: { [date: string]: Phrase[] } = {};
                    data.phrases.forEach((p: Phrase) => {
                        if (!grouped[p.date]) grouped[p.date] = [];
                        grouped[p.date].push(p);
                    });

                    const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
                    setAllDates(dates);

                    // Find current date's phrases
                    if (dateParam && grouped[dateParam]) {
                        setPhrases(grouped[dateParam]);
                        setCurrentDateIndex(dates.indexOf(dateParam));
                    } else if (dates.length > 0) {
                        // Redirect to first date if invalid
                        router.replace(`/english/phrases/${dates[0]}`);
                        return;
                    }
                } else {
                    setError('Failed to load phrases');
                }
            } catch {
                setError('Failed to connect');
            } finally {
                setLoading(false);
            }
        };
        fetchPhrases();

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
            stopProgress();
        };
    }, [dateParam, router]);

    // Auto-play when navigating
    useEffect(() => {
        const autoplay = searchParams?.get('autoplay');
        if (autoplay === 'true' && phrases.length > 0) {
            const timer = setTimeout(() => playLine(0), 500);
            return () => clearTimeout(timer);
        }
    }, [phrases, searchParams]);

    const startProgress = () => {
        setProgress(0);
        let elapsed = 0;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => {
            elapsed += 50;
            setProgress(Math.min((elapsed / 3000) * 100, 100));
        }, 50);
    };

    const stopProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const getPlayablePhrases = (): Phrase[] => {
        return phrases.filter(p => (phraseMastery[p.id] || 0) < 2);
    };

    const playLine = (index: number) => {
        const playable = getPlayablePhrases();
        if (playable.length === 0 || index < 0 || index >= playable.length) {
            setIsPlaying(false);
            stopProgress();
            return;
        }

        const phrase = playable[index];
        const utterance = new SpeechSynthesisUtterance(phrase.english);
        utterance.lang = 'en-US';
        utterance.rate = speed;

        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;

        setCurrentIndex(index);
        setIsPlaying(true);
        startProgress();

        utterance.onend = () => {
            stopProgress();
            setProgress(100);

            setTimeout(() => {
                const nextIndex = getNextIndex(index);
                if (nextIndex >= 0) {
                    playLine(nextIndex);
                } else {
                    setIsPlaying(false);
                    setProgress(0);
                }
            }, 500);
        };

        utterance.onerror = () => {
            setIsPlaying(false);
            stopProgress();
        };

        window.speechSynthesis.speak(utterance);
    };

    const getNextIndex = (current: number): number => {
        const playable = getPlayablePhrases();
        if (playable.length === 0) return -1;

        if (repeatModeRef.current === 2) return current; // repeat one

        if (isShuffleRef.current) {
            return Math.floor(Math.random() * playable.length);
        }

        const next = current + 1;
        if (next >= playable.length) {
            if (repeatModeRef.current === 1) return 0; // repeat all

            // Day finished - check if auto-next
            if (autoNextDayRef.current && allDates.length > 1) {
                setTimeout(() => goToNextDay(), 1000);
            }
            return -1;
        }
        return next;
    };

    const goToNextDay = () => {
        if (allDates.length === 0) return;

        window.speechSynthesis.cancel();
        stopProgress();
        setIsPlaying(false);

        let nextIdx: number;
        if (shuffleDaysRef.current) {
            nextIdx = Math.floor(Math.random() * allDates.length);
        } else {
            nextIdx = currentDateIndex + 1;
            if (nextIdx >= allDates.length) nextIdx = 0;
        }

        router.push(`/english/phrases/${allDates[nextIdx]}?autoplay=true`);
    };

    const goToPrevDay = () => {
        if (allDates.length === 0) return;

        window.speechSynthesis.cancel();
        stopProgress();
        setIsPlaying(false);

        let prevIdx = currentDateIndex - 1;
        if (prevIdx < 0) prevIdx = allDates.length - 1;

        router.push(`/english/phrases/${allDates[prevIdx]}`);
    };

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            stopProgress();
        } else {
            playLine(currentIndex);
        }
    };

    const playNext = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const playable = getPlayablePhrases();
        const next = (currentIndex + 1) % playable.length;
        playLine(next);
    };

    const playPrevious = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const playable = getPlayablePhrases();
        const prev = currentIndex <= 0 ? playable.length - 1 : currentIndex - 1;
        playLine(prev);
    };

    const toggleRepeat = () => {
        const next = (repeatMode + 1) % 3;
        repeatModeRef.current = next;
        setRepeatMode(next);
    };

    const toggleShuffle = () => {
        isShuffleRef.current = !isShuffle;
        setIsShuffle(!isShuffle);
    };

    const cycleMastery = async (phraseId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const current = phraseMastery[phraseId] || 0;
        const next = ((current + 1) % 4) as MasteryLevel;

        // Update local state immediately for responsiveness
        setPhraseMastery(prev => ({ ...prev, [phraseId]: next }));

        // Save to API
        try {
            await fetch('/api/phrases/mastery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phraseId, level: next })
            });
        } catch (err) {
            console.error('Failed to save mastery:', err);
        }
    };

    const toggleSavePhrase = (text: string, japanese: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (savedPhrases.has(text)) {
            const all = SavedPhrasesStorage.getAll();
            const found = all.find(p => p.english === text);
            if (found) SavedPhrasesStorage.remove(found.id);
            setSavedPhrases(prev => {
                const next = new Set(prev);
                next.delete(text);
                return next;
            });
        } else {
            SavedPhrasesStorage.save({
                english: text,
                japanese: japanese,
                source: `Phrases: ${dateParam}`,
            });
            setSavedPhrases(prev => new Set(prev).add(text));
        }
    };

    const getMasteryDisplay = (level: MasteryLevel) => {
        switch (level) {
            case 0: return { label: '未', color: '#888', bg: '#f0f0f0' };
            case 1: return { label: '①', color: '#f59e0b', bg: '#fef3c7' };
            case 2: return { label: '②', color: '#3b82f6', bg: '#dbeafe' };
            case 3: return { label: '済', color: '#10b981', bg: '#d1fae5' };
            default: return { label: '未', color: '#888', bg: '#f0f0f0' };
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
                    source: `Phrases: ${dateParam}`,
                    date: vocabDate,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowVocabModal(false);
                setVocabWord('');
                setVocabMeaning('');
                setVocabExample('');
                alert('Saved!');
            } else {
                alert(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Failed to save vocabulary:', err);
            alert('Error saving vocabulary');
        } finally {
            setVocabSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#888' }}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#dc2626' }}>{error}</div>
            </div>
        );
    }

    const playable = getPlayablePhrases();
    const currentPhrase = playable[currentIndex];
    const masteredCount = phrases.filter(p => (phraseMastery[p.id] || 0) >= 2).length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', color: '#1a1a1a' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => {
                        window.speechSynthesis.cancel();
                        stopProgress();
                        router.push('/english/phrases');
                    }}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}
                >
                    ← Back
                </button>
                {savedPhrases.size > 0 && (
                    <button
                        onClick={() => router.push('/english/saved')}
                        style={{
                            background: 'none',
                            border: '1px solid #B8960C',
                            color: '#B8960C',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <span>★</span>
                        <span>{savedPhrases.size}</span>
                    </button>
                )}
            </div>

            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Date Info */}
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                        {formatDateDisplay(dateParam)} ({getDayOfWeek(dateParam)})
                    </h1>
                    <div style={{ fontSize: '13px', color: '#888' }}>
                        {playable.length} to review / {masteredCount} mastered / {phrases.length} total
                    </div>
                </div>

                {/* Day Navigation */}
                {allDates.length > 1 && (
                    <div style={{
                        marginBottom: '24px',
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e5e5e5'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Day {currentDateIndex + 1} / {allDates.length}
                            </span>
                            <select
                                value={autoNextDay ? (shuffleDays ? 'shuffle' : 'auto') : 'off'}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAutoNextDay(val !== 'off');
                                    setShuffleDays(val === 'shuffle');
                                }}
                                style={{
                                    background: autoNextDay ? '#B8960C' : '#fff',
                                    border: autoNextDay ? 'none' : '1px solid #e5e5e5',
                                    color: autoNextDay ? '#fff' : '#888',
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }}
                            >
                                <option value="off">MANUAL</option>
                                <option value="auto">AUTO</option>
                                <option value="shuffle">SHUFFLE</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={goToPrevDay}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: '1px solid #e5e5e5',
                                    color: '#1a1a1a',
                                    cursor: 'pointer',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                                Prev
                            </button>
                            <button
                                onClick={goToNextDay}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: '1px solid #e5e5e5',
                                    color: '#1a1a1a',
                                    cursor: 'pointer',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                Next
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Current Phrase Display */}
                {playable.length > 0 && (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '24px',
                        border: '1px solid #e5e5e5'
                    }}>
                        <div style={{ fontSize: '11px', color: '#B8960C', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                            Now Playing
                        </div>
                        <div style={{ fontSize: '18px', color: '#1a1a1a', lineHeight: '1.6', marginBottom: '8px', fontWeight: '500' }}>
                            {currentPhrase?.english || 'Select a phrase'}
                        </div>
                        <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.5' }}>
                            {currentPhrase?.japanese || ''}
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {playable.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ height: '4px', backgroundColor: '#e5e5e5', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#B8960C', transition: 'width 0.05s linear' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#888' }}>
                            <span>{currentIndex + 1} / {playable.length}</span>
                            <span>{speed.toFixed(2)}x</span>
                        </div>
                    </div>
                )}

                {/* Playback Controls */}
                {playable.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                        <button onClick={toggleShuffle} style={{ background: 'none', border: 'none', color: isShuffle ? '#B8960C' : '#ccc', cursor: 'pointer', padding: '8px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                            </svg>
                        </button>
                        <button onClick={playPrevious} style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', padding: '8px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                        </button>
                        <button
                            onClick={togglePlay}
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#B8960C',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isPlaying ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: '3px' }}>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                        <button onClick={playNext} style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', padding: '8px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                        </button>
                        <button onClick={toggleRepeat} style={{ background: 'none', border: 'none', color: repeatMode > 0 ? '#B8960C' : '#ccc', cursor: 'pointer', padding: '8px', position: 'relative' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                            </svg>
                            {repeatMode === 2 && (
                                <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#B8960C' }}>1</span>
                            )}
                        </button>
                    </div>
                )}

                {/* Speed Control */}
                {playable.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>0.5x</span>
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.05"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            style={{ width: '150px', accentColor: '#B8960C' }}
                        />
                        <span style={{ fontSize: '12px', color: '#888' }}>1.5x</span>
                        <span style={{ fontSize: '14px', color: '#B8960C', fontWeight: '600', minWidth: '45px' }}>{speed.toFixed(2)}x</span>
                    </div>
                )}

                {/* Phrases List */}
                <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Phrases ({phrases.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {phrases.map((phrase, i) => {
                        const playableIndex = playable.findIndex(p => p.id === phrase.id);
                        const isActive = playableIndex === currentIndex && playableIndex >= 0;
                        const mastery = (phraseMastery[phrase.id] || 0) as MasteryLevel;
                        const masteryDisplay = getMasteryDisplay(mastery);
                        const isMastered = mastery >= 2;
                        const isSaved = savedPhrases.has(phrase.english);

                        return (
                            <div
                                key={phrase.id}
                                onClick={() => {
                                    if (!isMastered) {
                                        window.speechSynthesis.cancel();
                                        stopProgress();
                                        const idx = playable.findIndex(p => p.id === phrase.id);
                                        if (idx >= 0) playLine(idx);
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '14px 16px',
                                    backgroundColor: isActive ? '#fafafa' : '#fff',
                                    borderRadius: '10px',
                                    cursor: isMastered ? 'default' : 'pointer',
                                    opacity: isMastered ? 0.5 : 1,
                                    marginBottom: '4px'
                                }}
                            >
                                <div style={{
                                    width: '28px',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    color: isActive ? '#B8960C' : '#ccc'
                                }}>
                                    {isActive && isPlaying ? '♫' : i + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '15px',
                                        color: isActive ? '#B8960C' : isMastered ? '#10b981' : '#1a1a1a',
                                        lineHeight: '1.5',
                                        marginBottom: '4px',
                                        fontWeight: isActive ? '600' : '400'
                                    }}>
                                        {phrase.english}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.4' }}>
                                        {phrase.japanese}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => cycleMastery(phrase.id, e)}
                                    style={{
                                        background: masteryDisplay.bg,
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '6px 10px',
                                        fontSize: '10px',
                                        color: masteryDisplay.color,
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    {masteryDisplay.label}
                                </button>
                                <VoiceRecorder
                                    phraseId={phrase.id}
                                    recordings={voiceRecordings[phrase.id] || []}
                                    onRecordingComplete={(recording) => {
                                        setVoiceRecordings(prev => ({
                                            ...prev,
                                            [phrase.id]: [recording, ...(prev[phrase.id] || [])]
                                        }));
                                    }}
                                    onRecordingDelete={(id) => {
                                        setVoiceRecordings(prev => ({
                                            ...prev,
                                            [phrase.id]: (prev[phrase.id] || []).filter(r => r.id !== id)
                                        }));
                                    }}
                                />
                                <button
                                    onClick={(e) => openVocabModal(phrase.english, e)}
                                    style={{
                                        background: 'none',
                                        border: '1px solid #10B981',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        fontSize: '11px',
                                        color: '#10B981',
                                        fontWeight: '600'
                                    }}
                                >
                                    +Vocab
                                </button>
                                <button
                                    onClick={(e) => toggleSavePhrase(phrase.english, phrase.japanese, e)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        fontSize: '18px',
                                        color: isSaved ? '#B8960C' : '#ddd'
                                    }}
                                >
                                    {isSaved ? '★' : '☆'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {playable.length === 0 && phrases.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 24px', backgroundColor: '#d1fae5', borderRadius: '12px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>All Mastered!</div>
                        <p style={{ fontSize: '14px', color: '#059669' }}>Great job! All phrases for this day are mastered.</p>
                    </div>
                )}
            </div>

            <div style={{ height: '100px' }} />

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
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Save to Vocabulary</h3>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
                            >
                                x
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Example Sentence</label>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.5'
                            }}>
                                {vocabExample}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Date</label>
                            <input
                                type="date"
                                value={vocabDate}
                                onChange={(e) => setVocabDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Word / Phrase to Learn *</label>
                            <input
                                type="text"
                                value={vocabWord}
                                onChange={(e) => setVocabWord(e.target.value)}
                                placeholder="e.g., rabbit hole, get the hang of"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Type</label>
                            <select
                                value={vocabType}
                                onChange={(e) => setVocabType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#fff'
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
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Meaning (Japanese) *</label>
                            <input
                                type="text"
                                value={vocabMeaning}
                                onChange={(e) => setVocabMeaning(e.target.value)}
                                placeholder="e.g., 深みにはまる、コツをつかむ"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: '#f5f5f5',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    color: '#666'
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
                                    backgroundColor: (!vocabWord.trim() || !vocabMeaning.trim()) ? '#ccc' : '#10B981',
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
