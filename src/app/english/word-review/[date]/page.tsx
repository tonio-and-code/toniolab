'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import VoiceRecorder from '@/components/VoiceRecorder';
import { DAY_PROLOGUES } from '@/data/english/day-prologues';

interface VoiceRecording {
    id: number;
    phrase_id: string;
    url: string;
    created_at: string;
}

interface UserPhrase {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    note?: string;
    example?: string;
    source?: string;
    mastery_level: number;
    created_at: string;
    review_sentence?: string;
    review_sentence_ja?: string;
    review_idiom?: string;
    review_idiom_meaning?: string;
}

type MasteryLevel = 0 | 1 | 2 | 3;

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'word': { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    'phrasal verb': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'idiom': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'slang': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'collocation': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
    'expression': { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
};

const WORDS_PER_DAY = 10;
const WORDS_PER_SCENARIO = 50;
const START_DATE = new Date(2026, 0, 1); // 2026-01-01

function getAssignedDate(index: number): string {
    const dayIndex = Math.floor(index / WORDS_PER_DAY);
    const date = new Date(START_DATE);
    date.setDate(date.getDate() + dayIndex);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getScenarioPrologueDate(dateStr: string): string {
    const date = new Date(dateStr);
    const diffTime = date.getTime() - START_DATE.getTime();
    const dayIndex = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const wordStartIndex = dayIndex * WORDS_PER_DAY;
    const scenarioIndex = Math.floor(wordStartIndex / WORDS_PER_SCENARIO);
    const scenarioDayIndex = scenarioIndex * (WORDS_PER_SCENARIO / WORDS_PER_DAY);
    const scenarioDate = new Date(START_DATE);
    scenarioDate.setDate(scenarioDate.getDate() + scenarioDayIndex);
    const y = scenarioDate.getFullYear();
    const m = String(scenarioDate.getMonth() + 1).padStart(2, '0');
    const d = String(scenarioDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const getDayOfWeek = (dateStr: string): string => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[new Date(dateStr).getDay()];
};

const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const getMasteryDisplay = (level: MasteryLevel) => {
    switch (level) {
        case 0: return { label: '未', color: '#888', bg: '#f0f0f0', border: '#ddd' };
        case 1: return { label: '(1)', color: '#D97706', bg: '#FEF3C7', border: '#F59E0B' };
        case 2: return { label: '(2)', color: '#2563EB', bg: '#DBEAFE', border: '#3B82F6' };
        case 3: return { label: '済', color: '#059669', bg: '#D1FAE5', border: '#10B981' };
    }
};

export default function WordReviewDatePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = params?.date as string;

    const [words, setWords] = useState<UserPhrase[]>([]);
    const [allDates, setAllDates] = useState<string[]>([]);
    const [currentDateIndex, setCurrentDateIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Register popup state (for Phrases / Idiom buttons)
    const [registerPopup, setRegisterPopup] = useState<{
        wordId: string;
        type: 'phrase' | 'idiom';
        english: string;
        japanese: string;
        date: string;
    } | null>(null);
    const [registerSaving, setRegisterSaving] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

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
        const savedSpeed = localStorage.getItem('wordreview_speed');
        const savedRepeatMode = localStorage.getItem('wordreview_repeatMode');
        const savedShuffle = localStorage.getItem('wordreview_shuffle');
        const savedPlayMode = localStorage.getItem('wordreview_dayPlayMode');

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

        // Load voice recordings
        fetch('/api/voice-recordings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setVoiceRecordings(data.recordings || {});
                }
            })
            .catch(() => {});

        setSettingsLoaded(true);
    }, []);

    // Save settings
    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('wordreview_speed', speed.toString());
    }, [speed, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('wordreview_repeatMode', repeatMode.toString());
    }, [repeatMode, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('wordreview_shuffle', isShuffle.toString());
    }, [isShuffle, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        const playMode = !autoNextDay ? 'manual' : shuffleDays ? 'shuffle' : 'auto';
        localStorage.setItem('wordreview_dayPlayMode', playMode);
    }, [autoNextDay, shuffleDays, settingsLoaded]);

    // Load words and compute dates
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const res = await fetch('/api/user-phrases');
                const data = await res.json();
                if (data.success) {
                    const allWords: UserPhrase[] = data.phrases || [];
                    // Sort by created_at then id
                    const sorted = [...allWords].sort((a, b) => {
                        const dateCompare = (a.created_at || '').localeCompare(b.created_at || '');
                        if (dateCompare !== 0) return dateCompare;
                        return a.id.localeCompare(b.id);
                    });

                    // Group into date chunks
                    const grouped: Record<string, UserPhrase[]> = {};
                    sorted.forEach((word, index) => {
                        const dateKey = getAssignedDate(index);
                        if (!grouped[dateKey]) grouped[dateKey] = [];
                        grouped[dateKey].push(word);
                    });

                    const dates = Object.keys(grouped).sort();
                    setAllDates(dates);

                    if (dateParam && grouped[dateParam]) {
                        setWords(grouped[dateParam]);
                        setCurrentDateIndex(dates.indexOf(dateParam));
                    } else if (dates.length > 0) {
                        router.replace(`/english/word-review/${dates[dates.length - 1]}`);
                        return;
                    }
                } else {
                    setError('Failed to load words');
                }
            } catch {
                setError('Failed to connect');
            } finally {
                setLoading(false);
            }
        };
        fetchWords();

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
        if (autoplay === 'true' && words.length > 0) {
            const timer = setTimeout(() => playLine(0), 500);
            return () => clearTimeout(timer);
        }
    }, [words, searchParams]);

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

    const getPlayableWords = (): UserPhrase[] => {
        return words.filter(w => (w.mastery_level || 0) < 2);
    };

    const playLine = (index: number) => {
        const playable = getPlayableWords();
        if (playable.length === 0 || index < 0 || index >= playable.length) {
            setIsPlaying(false);
            stopProgress();
            return;
        }

        const word = playable[index];
        const textToSpeak = word.review_sentence || word.phrase;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
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
        const playable = getPlayableWords();
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

        router.push(`/english/word-review/${allDates[nextIdx]}?autoplay=true`);
    };

    const goToPrevDay = () => {
        if (allDates.length === 0) return;

        window.speechSynthesis.cancel();
        stopProgress();
        setIsPlaying(false);

        let prevIdx = currentDateIndex - 1;
        if (prevIdx < 0) prevIdx = allDates.length - 1;

        router.push(`/english/word-review/${allDates[prevIdx]}`);
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
        const playable = getPlayableWords();
        const next = (currentIndex + 1) % playable.length;
        playLine(next);
    };

    const playPrevious = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const playable = getPlayableWords();
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

    const cycleMastery = async (wordId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const word = words.find(w => w.id === wordId);
        if (!word) return;
        const current = Number(word.mastery_level || 0);
        const next = ((current + 1) % 4) as MasteryLevel;

        setWords(prev => prev.map(w => w.id === wordId ? { ...w, mastery_level: next } : w));

        try {
            await fetch(`/api/user-phrases/${wordId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mastery_level: next })
            });
        } catch (err) {
            console.error('Failed to save mastery:', err);
        }
    };

    const openVocabModal = (word: UserPhrase, e: React.MouseEvent) => {
        e.stopPropagation();
        setVocabExample(word.review_sentence || word.phrase);
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
                    source: `WordReview: ${dateParam}`,
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

    const openRegisterPopup = (word: UserPhrase, type: 'phrase' | 'idiom', e: React.MouseEvent) => {
        e.stopPropagation();
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        if (type === 'phrase') {
            setRegisterPopup({
                wordId: word.id,
                type: 'phrase',
                english: word.review_sentence || word.phrase,
                japanese: word.review_sentence_ja || word.meaning,
                date: todayStr,
            });
        } else {
            setRegisterPopup({
                wordId: word.id,
                type: 'idiom',
                english: word.review_idiom || '',
                japanese: word.review_idiom_meaning || '',
                date: todayStr,
            });
        }
    };

    const saveRegister = async () => {
        if (!registerPopup) return;
        setRegisterSaving(true);
        try {
            if (registerPopup.type === 'phrase') {
                const res = await fetch('/api/phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        english: registerPopup.english,
                        japanese: registerPopup.japanese,
                        category: 'daily',
                        date: registerPopup.date,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    setRegisterSuccess(registerPopup.wordId + '-phrase');
                    setRegisterPopup(null);
                    setTimeout(() => setRegisterSuccess(null), 2000);
                } else {
                    alert(data.error || 'Failed to save');
                }
            } else {
                const res = await fetch('/api/user-phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phrase: registerPopup.english,
                        type: 'idiom',
                        meaning: registerPopup.japanese,
                        source: `WordReview: ${dateParam}`,
                        date: registerPopup.date,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    setRegisterSuccess(registerPopup.wordId + '-idiom');
                    setRegisterPopup(null);
                    setTimeout(() => setRegisterSuccess(null), 2000);
                } else if (data.error === 'Phrase already in collection') {
                    setRegisterSuccess(registerPopup.wordId + '-idiom');
                    setRegisterPopup(null);
                    setTimeout(() => setRegisterSuccess(null), 2000);
                } else {
                    alert(data.error || 'Failed to save');
                }
            }
        } catch (err) {
            console.error('Failed to register:', err);
            alert('Error saving');
        } finally {
            setRegisterSaving(false);
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

    const playable = getPlayableWords();
    const currentWord = playable[currentIndex];
    const masteredCount = words.filter(w => (w.mastery_level || 0) >= 2).length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', color: '#1a1a1a' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => {
                        window.speechSynthesis.cancel();
                        stopProgress();
                        router.push('/english/word-review');
                    }}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}
                >
                    ← Back
                </button>
            </div>

            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Date Info */}
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                        {formatDateDisplay(dateParam)} ({getDayOfWeek(dateParam)})
                    </h1>
                    <div style={{ fontSize: '13px', color: '#888' }}>
                        {playable.length} to review / {masteredCount} mastered / {words.length} total
                    </div>
                </div>

                {/* Day Prologue */}
                {DAY_PROLOGUES[getScenarioPrologueDate(dateParam)] && (() => {
                    const p = DAY_PROLOGUES[getScenarioPrologueDate(dateParam)];
                    return (
                        <div style={{
                            marginBottom: '20px',
                            padding: '16px 18px',
                            backgroundColor: '#FFFBEB',
                            borderRadius: '12px',
                            borderLeft: '4px solid #D4AF37'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: '#D4AF37',
                                    padding: '2px 8px',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: '4px',
                                    letterSpacing: '0.5px'
                                }}>
                                    STORY
                                </span>
                                <span style={{ fontSize: '15px', fontWeight: '700', color: '#92400E' }}>
                                    {p.title}
                                </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#78716C', marginBottom: '4px' }}>
                                {p.titleJa}
                            </div>
                            <div style={{ fontSize: '13px', color: '#44403C', lineHeight: '1.6', marginBottom: '10px' }}>
                                {p.setting}
                            </div>
                            <div style={{ fontSize: '11px', color: '#78716C', lineHeight: '1.5', marginBottom: '10px' }}>
                                {p.settingJa}
                            </div>
                            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', fontWeight: '600' }}>
                                CAST
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {p.characters.map((c, i) => (
                                    <span key={i} style={{
                                        fontSize: '10px',
                                        padding: '2px 8px',
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #E7E5E4',
                                        color: '#57534E'
                                    }}>
                                        <strong>{c.name}</strong> - {c.desc}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })()}

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

                {/* Now Playing Display */}
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
                        {/* review_sentence (main text) */}
                        <div style={{ fontSize: '18px', color: '#1a1a1a', lineHeight: '1.6', marginBottom: currentWord?.review_sentence_ja ? '6px' : '12px', fontWeight: '500' }}>
                            {currentWord?.review_sentence || currentWord?.phrase || 'Select a word'}
                        </div>
                        {currentWord?.review_sentence_ja && (
                            <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.5', marginBottom: '4px' }}>
                                {currentWord.review_sentence_ja}
                            </div>
                        )}
                        {currentWord?.review_sentence && (
                            <div style={{ marginBottom: '10px' }}>
                                {registerSuccess === currentWord.id + '-phrase' ? (
                                    <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                ) : (
                                    <button
                                        onClick={(e) => openRegisterPopup(currentWord, 'phrase', e)}
                                        style={{
                                            background: 'none',
                                            border: '1px solid #D4AF37',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            padding: '2px 8px',
                                            fontSize: '10px',
                                            color: '#D4AF37',
                                            fontWeight: '600'
                                        }}
                                    >
                                        +Phrases
                                    </button>
                                )}
                            </div>
                        )}
                        {/* phrase + type badge + meaning */}
                        {currentWord && (
                            <div style={{ marginBottom: currentWord.review_idiom ? '10px' : '0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                        {currentWord.phrase}
                                    </span>
                                    {(() => {
                                        const tc = TYPE_COLORS[currentWord.type] || { bg: '#f0f0f0', text: '#666' };
                                        return (
                                            <span style={{
                                                fontSize: '9px',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: tc.bg,
                                                color: tc.text
                                            }}>
                                                {currentWord.type}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.4' }}>
                                    {currentWord.meaning}
                                </div>
                            </div>
                        )}
                        {/* idiom + idiom_meaning */}
                        {currentWord?.review_idiom && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flexWrap: 'wrap',
                                padding: '8px 10px',
                                backgroundColor: '#FFFBEB',
                                borderRadius: '8px',
                                borderLeft: '3px solid #D4AF37'
                            }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: '#D4AF37',
                                    padding: '1px 6px',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: '4px'
                                }}>
                                    IDIOM
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#92400E' }}>
                                    {currentWord.review_idiom}
                                </span>
                                {currentWord.review_idiom_meaning && (
                                    <span style={{ fontSize: '11px', color: '#888' }}>
                                        = {currentWord.review_idiom_meaning}
                                    </span>
                                )}
                                {registerSuccess === currentWord.id + '-idiom' ? (
                                    <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                ) : (
                                    <button
                                        onClick={(e) => openRegisterPopup(currentWord, 'idiom', e)}
                                        style={{
                                            background: 'none',
                                            border: '1px solid #DB2777',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            padding: '2px 8px',
                                            fontSize: '10px',
                                            color: '#DB2777',
                                            fontWeight: '600'
                                        }}
                                    >
                                        +Idiom
                                    </button>
                                )}
                            </div>
                        )}
                        {/* Now Playing actions: mastery + voice + vocab */}
                        {currentWord && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                                {(() => {
                                    const m = getMasteryDisplay((currentWord.mastery_level || 0) as MasteryLevel);
                                    return (
                                        <button
                                            onClick={(e) => cycleMastery(currentWord.id, e)}
                                            style={{
                                                background: m.bg,
                                                border: `2px solid ${m.border}`,
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                fontSize: '11px',
                                                color: m.color,
                                                cursor: 'pointer',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {m.label}
                                        </button>
                                    );
                                })()}
                                <VoiceRecorder
                                    phraseId={currentWord.id}
                                    recordings={voiceRecordings[currentWord.id] || []}
                                    onRecordingComplete={(recording) => {
                                        setVoiceRecordings(prev => ({
                                            ...prev,
                                            [currentWord.id]: [recording, ...(prev[currentWord.id] || [])]
                                        }));
                                    }}
                                    onRecordingDelete={(id) => {
                                        setVoiceRecordings(prev => ({
                                            ...prev,
                                            [currentWord.id]: (prev[currentWord.id] || []).filter(r => r.id !== id)
                                        }));
                                    }}
                                />
                                <button
                                    onClick={(e) => openVocabModal(currentWord, e)}
                                    style={{
                                        background: 'none',
                                        border: '1px solid #10B981',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        padding: '3px 6px',
                                        fontSize: '10px',
                                        color: '#10B981',
                                        fontWeight: '600'
                                    }}
                                >
                                    +Vocab
                                </button>
                            </div>
                        )}
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

                {/* Words List */}
                <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Words ({words.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {words.map((word, i) => {
                        const playableIndex = playable.findIndex(p => p.id === word.id);
                        const isActive = playableIndex === currentIndex && playableIndex >= 0;
                        const mastery = (word.mastery_level || 0) as MasteryLevel;
                        const masteryDisplay = getMasteryDisplay(mastery);
                        const isMastered = mastery >= 2;
                        const typeColor = TYPE_COLORS[word.type] || { bg: '#f0f0f0', text: '#666', border: '#e5e5e5' };

                        return (
                            <div
                                key={word.id}
                                onClick={() => {
                                    if (!isMastered) {
                                        window.speechSynthesis.cancel();
                                        stopProgress();
                                        const idx = playable.findIndex(p => p.id === word.id);
                                        if (idx >= 0) playLine(idx);
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
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
                                    color: isActive ? '#B8960C' : '#ccc',
                                    paddingTop: '2px'
                                }}>
                                    {isActive && isPlaying ? '~' : i + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* review_sentence (clickable to play) */}
                                    {word.review_sentence && (
                                        <div style={{
                                            fontSize: '14px',
                                            color: isActive ? '#B8960C' : '#1a1a1a',
                                            lineHeight: '1.5',
                                            marginBottom: '6px',
                                            fontWeight: isActive ? '600' : '400'
                                        }}>
                                            {word.review_sentence}
                                        </div>
                                    )}
                                    {word.review_sentence_ja && (
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#999',
                                            lineHeight: '1.4',
                                            marginBottom: '2px'
                                        }}>
                                            {word.review_sentence_ja}
                                        </div>
                                    )}
                                    {word.review_sentence && (
                                        <div style={{ marginBottom: '6px' }}>
                                            {registerSuccess === word.id + '-phrase' ? (
                                                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                            ) : (
                                                <button
                                                    onClick={(e) => openRegisterPopup(word, 'phrase', e)}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid #D4AF37',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        padding: '1px 5px',
                                                        fontSize: '9px',
                                                        color: '#D4AF37',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    +Phrases
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {/* phrase (bold) + type badge + meaning */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            color: isActive ? '#B8960C' : (word.review_sentence ? '#555' : '#1a1a1a')
                                        }}>
                                            {word.phrase}
                                        </span>
                                        <span style={{
                                            fontSize: '9px',
                                            padding: '1px 5px',
                                            borderRadius: '3px',
                                            backgroundColor: typeColor.bg,
                                            color: typeColor.text
                                        }}>
                                            {word.type}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#888' }}>
                                            {word.meaning}
                                        </span>
                                    </div>
                                    {/* idiom + idiom_meaning (smaller, gray) */}
                                    {word.review_idiom && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontSize: '9px',
                                                fontWeight: '700',
                                                color: '#D4AF37',
                                                padding: '1px 4px',
                                                backgroundColor: '#FEF3C7',
                                                borderRadius: '3px'
                                            }}>
                                                IDIOM
                                            </span>
                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#92400E' }}>
                                                {word.review_idiom}
                                            </span>
                                            {word.review_idiom_meaning && (
                                                <span style={{ fontSize: '10px', color: '#999' }}>
                                                    = {word.review_idiom_meaning}
                                                </span>
                                            )}
                                            {registerSuccess === word.id + '-idiom' ? (
                                                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                            ) : (
                                                <button
                                                    onClick={(e) => openRegisterPopup(word, 'idiom', e)}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid #DB2777',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        padding: '1px 5px',
                                                        fontSize: '9px',
                                                        color: '#DB2777',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    +Idiom
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                                    <button
                                        onClick={(e) => cycleMastery(word.id, e)}
                                        style={{
                                            background: masteryDisplay.bg,
                                            border: `2px solid ${masteryDisplay.border}`,
                                            borderRadius: '6px',
                                            padding: '4px 10px',
                                            fontSize: '11px',
                                            color: masteryDisplay.color,
                                            cursor: 'pointer',
                                            fontWeight: '700'
                                        }}
                                    >
                                        {masteryDisplay.label}
                                    </button>
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        <VoiceRecorder
                                            phraseId={word.id}
                                            recordings={voiceRecordings[word.id] || []}
                                            onRecordingComplete={(recording) => {
                                                setVoiceRecordings(prev => ({
                                                    ...prev,
                                                    [word.id]: [recording, ...(prev[word.id] || [])]
                                                }));
                                            }}
                                            onRecordingDelete={(id) => {
                                                setVoiceRecordings(prev => ({
                                                    ...prev,
                                                    [word.id]: (prev[word.id] || []).filter(r => r.id !== id)
                                                }));
                                            }}
                                        />
                                        <button
                                            onClick={(e) => openVocabModal(word, e)}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #10B981',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                padding: '3px 6px',
                                                fontSize: '10px',
                                                color: '#10B981',
                                                fontWeight: '600'
                                            }}
                                        >
                                            +Vocab
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {playable.length === 0 && words.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 24px', backgroundColor: '#d1fae5', borderRadius: '12px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>All Mastered!</div>
                        <p style={{ fontSize: '14px', color: '#059669' }}>Great job! All words for this day are mastered.</p>
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
                                <option value="collocation">Collocation</option>
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

            {/* Register Popup (Phrases / Idiom) */}
            {registerPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}
                    onClick={() => setRegisterPopup(null)}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '14px',
                            padding: '20px',
                            maxWidth: '360px',
                            width: '100%'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px' }}>
                            {registerPopup.type === 'phrase' ? 'Register to Phrases' : 'Register as Idiom'}
                        </div>
                        <div style={{
                            padding: '10px 12px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: '#444',
                            lineHeight: '1.5',
                            marginBottom: '6px'
                        }}>
                            {registerPopup.english}
                        </div>
                        {registerPopup.japanese && (
                            <div style={{
                                padding: '0 12px',
                                fontSize: '12px',
                                color: '#888',
                                marginBottom: '14px'
                            }}>
                                {registerPopup.japanese}
                            </div>
                        )}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Date</label>
                            <input
                                type="date"
                                value={registerPopup.date}
                                onChange={(e) => setRegisterPopup({ ...registerPopup, date: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setRegisterPopup(null)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#f5f5f5',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveRegister}
                                disabled={registerSaving}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: registerPopup.type === 'phrase' ? '#D4AF37' : '#DB2777',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    cursor: registerSaving ? 'not-allowed' : 'pointer',
                                    color: '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                {registerSaving ? 'Saving...' : 'Register'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
