'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import VoiceRecorder from '@/components/VoiceRecorder';

interface VoiceRecording {
    id: number;
    phrase_id: string;
    url: string;
    created_at: string;
}

declare global {
    interface Window {
        YG?: {
            Widget: new (id: string, options: {
                width: number;
                components: number;
                events: {
                    onFetchDone?: (event: { totalResult: number }) => void;
                    onVideoChange?: (event: any) => void;
                    onCaptionChange?: (event: { caption: string }) => void;
                };
            }) => {
                fetch: (phrase: string, lang: string) => void;
            };
        };
    }
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

const getMasteryLabel = (level: MasteryLevel) => {
    switch (level) {
        case 0: return { label: '未', color: '#888', bg: '#f0f0f0', border: '#ddd' };
        case 1: return { label: '(1)', color: '#D97706', bg: '#FEF3C7', border: '#F59E0B' };
        case 2: return { label: '(2)', color: '#2563EB', bg: '#DBEAFE', border: '#3B82F6' };
        case 3: return { label: '済', color: '#059669', bg: '#D1FAE5', border: '#10B981' };
    }
};

const WORDS_PER_DAY = 10;
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

export default function WordReviewPage() {
    const [words, setWords] = useState<UserPhrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [calendarFilter, setCalendarFilter] = useState<0 | 1 | 2 | 3 | 'all'>('all');
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewFilter, setReviewFilter] = useState<0 | 1 | 2 | 'all'>('all');
    const [playingWordId, setPlayingWordId] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Voice recordings state
    const [voiceRecordings, setVoiceRecordings] = useState<Record<string, VoiceRecording[]>>({});

    // YouGlish state
    const [youglishPhrase, setYouglishPhrase] = useState<UserPhrase | null>(null);
    const [youglishQuery, setYouglishQuery] = useState('');
    const [youglishSearched, setYouglishSearched] = useState(false);
    const youglishLoaded = useRef(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widgetRef = useRef<any>(null);
    const currentVideoRef = useRef({ videoId: '', timestamp: 0 });
    const [captionHistory, setCaptionHistory] = useState<{text: string; selected: boolean}[]>([]);
    const [savingPhrase, setSavingPhrase] = useState(false);
    const [youglishSaveDate, setYouglishSaveDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [playerPosition, setPlayerPosition] = useState({ x: 20, y: 20 });
    const [playerSize, setPlayerSize] = useState({ width: 420, height: 500 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [playerMinimized, setPlayerMinimized] = useState(false);
    const [playerFullscreen, setPlayerFullscreen] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

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

    // Mobile check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [phrasesRes, recordingsRes] = await Promise.all([
                    fetch('/api/user-phrases'),
                    fetch('/api/voice-recordings')
                ]);
                const phrasesData = await phrasesRes.json();
                const recordingsData = await recordingsRes.json();
                if (phrasesData.success) setWords(phrasesData.phrases || []);
                if (recordingsData.success) setVoiceRecordings(recordingsData.recordings || {});
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
            setVoices(enVoices);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => window.speechSynthesis.cancel();
    }, []);

    // Load YouGlish script
    useEffect(() => {
        if (youglishLoaded.current) return;
        const script = document.createElement('script');
        script.src = 'https://youglish.com/public/emb/widget.js';
        script.async = true;
        document.body.appendChild(script);
        youglishLoaded.current = true;
    }, []);

    // YouGlish drag handlers
    const handleDragStart = (e: React.MouseEvent) => {
        if (playerFullscreen) return;
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - playerPosition.x,
            y: e.clientY - playerPosition.y
        };
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (playerFullscreen) return;
        setIsResizing(true);
        dragOffset.current = {
            x: e.clientX,
            y: e.clientY
        };
    };

    const toggleFullscreen = () => {
        setPlayerFullscreen(!playerFullscreen);
        setPlayerMinimized(false);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPlayerPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
            if (isResizing) {
                const deltaX = e.clientX - dragOffset.current.x;
                const deltaY = e.clientY - dragOffset.current.y;
                setPlayerSize(prev => ({
                    width: Math.max(300, prev.width + deltaX),
                    height: Math.max(300, prev.height + deltaY)
                }));
                dragOffset.current = { x: e.clientX, y: e.clientY };
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);

    // Sort words by created_at then id, assign dates
    const wordsByDate = useMemo(() => {
        const sorted = [...words].sort((a, b) => {
            const dateCompare = (a.created_at || '').localeCompare(b.created_at || '');
            if (dateCompare !== 0) return dateCompare;
            return a.id.localeCompare(b.id);
        });

        const map: Record<string, UserPhrase[]> = {};
        sorted.forEach((word, index) => {
            const dateKey = getAssignedDate(index);
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(word);
        });
        return map;
    }, [words]);

    // Last date with words (for latest button)
    const lastWordDate = useMemo(() => {
        const dates = Object.keys(wordsByDate).sort();
        if (dates.length === 0) return null;
        return new Date(dates[dates.length - 1] + 'T00:00:00');
    }, [wordsByDate]);

    // This month's words for review
    const thisMonthReviewWords = useMemo(() => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const monthWords: UserPhrase[] = [];
        Object.entries(wordsByDate).forEach(([dateKey, dayWords]) => {
            const d = new Date(dateKey);
            if (d >= monthStart && d <= monthEnd) {
                monthWords.push(...dayWords);
            }
        });

        const seed = currentMonth.getFullYear() * 100 + currentMonth.getMonth();
        const shuffled = [...monthWords].sort((a, b) => {
            const hashA = (a.id.charCodeAt(0) + seed) % 100;
            const hashB = (b.id.charCodeAt(0) + seed) % 100;
            return hashA - hashB;
        });

        return {
            level0: shuffled.filter(w => Number(w.mastery_level || 0) === 0),
            level1: shuffled.filter(w => Number(w.mastery_level || 0) === 1),
            level2: shuffled.filter(w => Number(w.mastery_level || 0) === 2),
            all: shuffled.filter(w => Number(w.mastery_level || 0) < 3),
            total: shuffled,
        };
    }, [wordsByDate, currentMonth, words]);

    const reviewList = useMemo(() => {
        if (reviewFilter === 'all') return thisMonthReviewWords.all;
        return thisMonthReviewWords[`level${reviewFilter}` as keyof typeof thisMonthReviewWords] as UserPhrase[];
    }, [thisMonthReviewWords, reviewFilter]);

    // Calendar
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const rows = Math.ceil(calendarDays.length / 7);

    const prevMonth = () => { setCurrentMonth(new Date(year, month - 1, 1)); setSelectedDate(null); };
    const nextMonth = () => { setCurrentMonth(new Date(year, month + 1, 1)); setSelectedDate(null); };

    const formatDateKey = (day: number) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const today = new Date();
    const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    // Stats
    const clearedCount = words.filter(w => Number(w.mastery_level || 0) >= 3).length;

    // YouGlish functions
    const playYouGlish = (word: UserPhrase) => {
        setYouglishPhrase(word);
        setYouglishQuery('');
        setYouglishSearched(false);
        setCaptionHistory([]);
        currentVideoRef.current = { videoId: '', timestamp: 0 };
        setPlayerPosition({
            x: Math.max(20, window.innerWidth - 460),
            y: Math.max(20, window.innerHeight / 2 - 200)
        });
    };

    const searchYouGlish = () => {
        if (!youglishQuery.trim()) return;
        if (!window.YG) {
            alert('YouGlish is still loading. Please wait a moment and try again.');
            return;
        }

        setYouglishSearched(true);
        setCaptionHistory([]);
        currentVideoRef.current = { videoId: '', timestamp: 0 };

        setTimeout(() => {
            const container = document.getElementById('yg-widget-words');
            if (container) container.innerHTML = '';

            widgetRef.current = new window.YG!.Widget('yg-widget-words', {
                width: 400,
                components: 255,
                events: {
                    onFetchDone: (event: { totalResult: number }) => {
                        console.log('YouGlish fetch done:', event.totalResult);
                    },
                    onVideoChange: (event: any) => {
                        const videoId = event.video || event.videoId || '';
                        const start = event.start || 0;
                        if (videoId) {
                            currentVideoRef.current = { videoId, timestamp: start };
                            setCaptionHistory([]);
                        }
                    },
                    onCaptionChange: (event: { caption: string }) => {
                        let caption = event.caption;
                        try { caption = decodeURIComponent(caption); } catch {}
                        caption = caption.replace(/\[\[\[/g, '').replace(/\]\]\]/g, '');

                        setCaptionHistory(prev => {
                            if (prev.length === 0 || prev[prev.length - 1].text !== caption) {
                                return [...prev, { text: caption, selected: true }];
                            }
                            return prev;
                        });
                    }
                }
            });
            widgetRef.current.fetch(youglishQuery.trim(), 'english');
        }, 50);
    };

    const saveSelectedCaptions = async () => {
        const selectedCaptions = captionHistory.filter(c => c.selected);
        if (selectedCaptions.length === 0) {
            alert('No captions selected');
            return;
        }
        setSavingPhrase(true);
        try {
            const fullText = selectedCaptions.map(c => c.text).join(' ');
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: fullText,
                    japanese: `(${youglishPhrase?.phrase.slice(0, 30) || 'YouGlish'})`,
                    category: 'YouGlish',
                    date: youglishSaveDate
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    alert('Saved!');
                    setCaptionHistory([]);
                }
            } else {
                alert('Failed to save');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving');
        } finally {
            setSavingPhrase(false);
        }
    };

    // Vocabulary modal functions
    const openVocabModal = (word: UserPhrase) => {
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
                    source: 'WordReview',
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

    const openRegisterPopup = (word: UserPhrase, type: 'phrase' | 'idiom') => {
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
                        source: 'WordReview',
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

    const cycleMastery = useCallback(async (wordId: string) => {
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
    }, [words]);

    const playWord = useCallback((word: UserPhrase) => {
        window.speechSynthesis.cancel();
        setPlayingWordId(word.id);

        const utterance = new SpeechSynthesisUtterance(word.phrase);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;

        utterance.onend = () => setPlayingWordId(null);
        utterance.onerror = () => setPlayingWordId(null);

        window.speechSynthesis.speak(utterance);
    }, [voices]);

    const playSentence = useCallback((text: string) => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;

        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;

        window.speechSynthesis.speak(utterance);
    }, [voices]);

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    const selectedWordsAll = selectedDate ? (wordsByDate[selectedDate] || []) : [];
    const selectedWords = (() => {
        if (calendarFilter === 'all') return selectedWordsAll;
        if (calendarFilter === 0) return selectedWordsAll.filter(w => Number(w.mastery_level || 0) === 0);
        if (calendarFilter === 1) return selectedWordsAll.filter(w => Number(w.mastery_level || 0) <= 1);
        if (calendarFilter === 2) return selectedWordsAll.filter(w => Number(w.mastery_level || 0) <= 2);
        return selectedWordsAll.filter(w => Number(w.mastery_level || 0) < 3);
    })();

    if (loading) {
        return (
            <div style={{ height: '100%', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#f5f5f5',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <button
                    onClick={prevMonth}
                    style={{
                        background: 'none',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#666'
                    }}
                >
                    &#8249;
                </button>
                <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
                        {year}{monthNames[month]}
                    </span>
                    <button
                        onClick={() => { setCurrentMonth(lastWordDate || new Date(START_DATE)); setSelectedDate(null); }}
                        style={{
                            background: '#D4AF37',
                            border: 'none',
                            color: '#000',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        最新
                    </button>
                    <span style={{ fontSize: '11px', color: '#888' }}>
                        {words.length} words
                    </span>
                </div>
                <button
                    onClick={nextMonth}
                    style={{
                        background: 'none',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#666'
                    }}
                >
                    &#8250;
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                position: 'relative',
                overflow: isMobile ? 'auto' : 'hidden',
                minHeight: 0,
                display: isMobile ? 'flex' : 'block',
                flexDirection: 'column'
            }}>
                {/* Calendar Section */}
                <div style={{
                    position: isMobile ? 'relative' : 'absolute',
                    top: isMobile ? 'auto' : 0,
                    left: isMobile ? 'auto' : 0,
                    right: isMobile ? 'auto' : '320px',
                    bottom: isMobile ? 'auto' : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    minHeight: isMobile ? '400px' : 'auto'
                }}>
                    {/* Calendar Filter Tabs */}
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        padding: '8px 12px',
                        borderBottom: '1px solid #eee',
                        flexShrink: 0,
                        overflowX: 'auto'
                    }}>
                        {[
                            { key: 'all' as const, label: '全部' },
                            { key: 0 as const, label: '未' },
                            { key: 1 as const, label: '1回' },
                            { key: 2 as const, label: '2回' },
                            { key: 3 as const, label: '済' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setCalendarFilter(tab.key)}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: calendarFilter === tab.key ? '#D4AF37' : '#f5f5f5',
                                    color: calendarFilter === tab.key ? '#fff' : '#666',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Day Headers */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        borderBottom: '1px solid #eee',
                        flexShrink: 0
                    }}>
                        {dayNames.map((day, index) => (
                            <div
                                key={day}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '11px',
                                    color: index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : '#666',
                                    fontWeight: '600',
                                    padding: '8px 0'
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        gap: '3px',
                        padding: '6px',
                        flex: 1,
                        minHeight: 0
                    }}>
                        {calendarDays.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} style={{ backgroundColor: '#fafafa', borderRadius: '6px' }} />;
                            }

                            const dateKey = formatDateKey(day);
                            const allDayWords = wordsByDate[dateKey] || [];
                            const hasAnyWords = allDayWords.length > 0;
                            const isTodayDate = isToday(day);
                            const dayOfWeek = (startDayOfWeek + day - 1) % 7;

                            const countByLevel = {
                                level0: allDayWords.filter(w => Number(w.mastery_level || 0) === 0).length,
                                level1Plus: allDayWords.filter(w => Number(w.mastery_level || 0) >= 1).length,
                                level2Plus: allDayWords.filter(w => Number(w.mastery_level || 0) >= 2).length,
                                level3: allDayWords.filter(w => Number(w.mastery_level || 0) >= 3).length,
                            };

                            const dayWords = calendarFilter === 'all'
                                ? allDayWords
                                : calendarFilter === 0
                                    ? allDayWords.filter(w => Number(w.mastery_level || 0) === 0)
                                    : calendarFilter === 1
                                        ? allDayWords.filter(w => Number(w.mastery_level || 0) >= 1)
                                        : calendarFilter === 2
                                            ? allDayWords.filter(w => Number(w.mastery_level || 0) >= 2)
                                            : allDayWords.filter(w => Number(w.mastery_level || 0) >= 3);

                            let reviewProgress = 0;
                            if (allDayWords.length > 0) {
                                if (calendarFilter === 'all') {
                                    reviewProgress = countByLevel.level3 / allDayWords.length;
                                } else if (calendarFilter === 0) {
                                    reviewProgress = countByLevel.level1Plus / allDayWords.length;
                                } else if (calendarFilter === 1) {
                                    reviewProgress = countByLevel.level2Plus / allDayWords.length;
                                } else if (calendarFilter === 2) {
                                    reviewProgress = countByLevel.level3 / allDayWords.length;
                                } else {
                                    reviewProgress = countByLevel.level3 / allDayWords.length;
                                }
                            }

                            const isMastered = calendarFilter === 'all'
                                ? allDayWords.length > 0 && allDayWords.every(w => Number(w.mastery_level || 0) >= 3)
                                : calendarFilter === 0
                                    ? countByLevel.level0 === 0
                                    : calendarFilter === 1
                                        ? countByLevel.level2Plus === allDayWords.length
                                        : calendarFilter === 2
                                            ? countByLevel.level3 === allDayWords.length
                                            : countByLevel.level3 === allDayWords.length;

                            const clearedInDay = countByLevel.level3;

                            // Preview: first word of the day
                            const previewWord = hasAnyWords ? allDayWords[0] : null;

                            return (
                                <div
                                    key={day}
                                    onClick={() => hasAnyWords && setSelectedDate(dateKey)}
                                    onMouseEnter={(e) => {
                                        if (hasAnyWords) {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    style={{
                                        borderRadius: '4px',
                                        cursor: hasAnyWords ? 'pointer' : 'default',
                                        overflow: 'hidden',
                                        padding: '6px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        backgroundColor: '#fafafa',
                                        border: isTodayDate
                                            ? '2px solid #D4AF37'
                                            : hasAnyWords ? '1px solid #e5e5e5' : '1px solid #f0f0f0',
                                        transition: 'transform 0.15s, box-shadow 0.15s'
                                    }}
                                >
                                    {/* Fill effect */}
                                    {hasAnyWords && calendarFilter !== 'all' && reviewProgress > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: `${reviewProgress * 100}%`,
                                            backgroundColor: calendarFilter === 0 ? 'rgba(156, 163, 175, 0.4)'
                                                : calendarFilter === 1 ? 'rgba(245, 158, 11, 0.4)'
                                                : calendarFilter === 2 ? 'rgba(59, 130, 246, 0.4)'
                                                : 'rgba(16, 185, 129, 0.4)',
                                            transition: 'height 0.3s ease-out',
                                            pointerEvents: 'none',
                                            zIndex: 0
                                        }} />
                                    )}
                                    {hasAnyWords && calendarFilter === 'all' && !isMastered && reviewProgress > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: `${(clearedInDay / allDayWords.length) * 100}%`,
                                            backgroundColor: 'rgba(16, 185, 129, 0.25)',
                                            transition: 'height 0.3s ease-out',
                                            pointerEvents: 'none',
                                            zIndex: 0
                                        }} />
                                    )}

                                    {/* Day number + indicator */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '2px',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#666'
                                        }}>
                                            {day}
                                        </span>
                                        {hasAnyWords && (
                                            <span style={{
                                                fontSize: '10px',
                                                color: calendarFilter === 'all' ? (isMastered ? '#059669' : '#888')
                                                    : calendarFilter === 0 ? (dayWords.length === 0 ? '#059669' : '#666')
                                                    : calendarFilter === 1 ? '#D97706'
                                                    : calendarFilter === 2 ? '#2563EB'
                                                    : calendarFilter === 3 ? '#059669'
                                                    : '#888',
                                                fontWeight: '600'
                                            }}>
                                                {calendarFilter === 'all'
                                                    ? (isMastered ? '済' : `${clearedInDay}/${allDayWords.length}`)
                                                    : calendarFilter === 0
                                                        ? (countByLevel.level0 === 0 ? '済' : `残${countByLevel.level0}`)
                                                        : calendarFilter === 1
                                                            ? (countByLevel.level2Plus === allDayWords.length ? '済' : `${countByLevel.level2Plus}/${allDayWords.length}`)
                                                            : calendarFilter === 2
                                                                ? (countByLevel.level3 === allDayWords.length ? '済' : `${countByLevel.level3}/${allDayWords.length}`)
                                                                : (isMastered ? '済' : `${countByLevel.level3}/${allDayWords.length}`)
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {/* Word preview */}
                                    {hasAnyWords && previewWord && (
                                        <div style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            <div style={{
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                color: '#333',
                                                lineHeight: 1.3,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {previewWord.phrase}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{
                    position: isMobile ? 'relative' : 'absolute',
                    top: isMobile ? 'auto' : 0,
                    right: isMobile ? 'auto' : 0,
                    bottom: isMobile ? 'auto' : 0,
                    width: isMobile ? '100%' : '320px',
                    flexShrink: 0,
                    backgroundColor: '#fafafa',
                    borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
                    borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    overflowY: isMobile ? 'visible' : 'auto'
                }}>
                    {selectedDate && selectedWordsAll.length > 0 ? (
                        <>
                            {/* Selected Date Header */}
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '14px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                                        {calendarFilter !== 'all' && (
                                            <span style={{
                                                marginLeft: '8px',
                                                fontSize: '11px',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: calendarFilter === 0 ? '#f0f0f0'
                                                    : calendarFilter === 1 ? '#FEF3C7'
                                                    : calendarFilter === 2 ? '#DBEAFE'
                                                    : '#D1FAE5',
                                                color: calendarFilter === 0 ? '#666'
                                                    : calendarFilter === 1 ? '#D97706'
                                                    : calendarFilter === 2 ? '#2563EB'
                                                    : '#059669'
                                            }}>
                                                {calendarFilter === 0 ? '未' : calendarFilter === 1 ? '1回' : calendarFilter === 2 ? '2回' : '済'}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>
                                        {selectedWords.length} / {selectedWordsAll.length} words
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    style={{
                                        background: '#f0f0f0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}
                                >
                                    Close
                                </button>
                            </div>

                            {/* Listen Button */}
                            <Link
                                href={`/english/word-review/${selectedDate}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    backgroundColor: '#B8960C',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 6px rgba(184,150,12,0.3)'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Listen
                            </Link>

                            {/* Word List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedWords.length === 0 && calendarFilter !== 'all' && (
                                    <div style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        color: '#888',
                                        fontSize: '13px'
                                    }}>
                                        {calendarFilter === 0 ? '未復習の単語はありません' :
                                         calendarFilter === 1 ? '全て2回以上です' :
                                         calendarFilter === 2 ? '全て済です' :
                                         calendarFilter === 3 ? '全て済です' :
                                         '単語はありません'}
                                    </div>
                                )}
                                {selectedWords.map(word => {
                                    const mastery = (word.mastery_level || 0) as MasteryLevel;
                                    const masteryInfo = getMasteryLabel(mastery);
                                    const isPlaying = playingWordId === word.id;
                                    const typeColor = TYPE_COLORS[word.type] || { bg: '#f0f0f0', text: '#666', border: '#e5e5e5' };
                                    return (
                                        <div
                                            key={word.id}
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                                border: isPlaying ? '2px solid #D4AF37' : '1px solid #e5e5e5'
                                            }}
                                        >
                                            <div style={{ height: '3px', backgroundColor: typeColor.text }} />
                                            <div style={{ padding: '12px' }}>
                                                {/* Header: Play + English + Type */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginBottom: '6px'
                                                }}>
                                                    <button
                                                        onClick={() => playWord(word)}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            backgroundColor: isPlaying ? '#D4AF37' : '#f5f5f5',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill={isPlaying ? '#fff' : '#666'}>
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </button>
                                                    <div style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                                                        {word.phrase}
                                                    </div>
                                                    <span style={{
                                                        fontSize: '9px',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        backgroundColor: typeColor.bg,
                                                        color: typeColor.text,
                                                        flexShrink: 0
                                                    }}>
                                                        {word.type}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', marginLeft: '40px' }}>
                                                    {word.meaning}
                                                </div>

                                                {/* Review sentence with idiom */}
                                                {word.review_sentence && (
                                                    <div style={{
                                                        marginLeft: '40px',
                                                        marginBottom: '10px',
                                                        padding: '8px 10px',
                                                        backgroundColor: '#FFFBEB',
                                                        borderRadius: '8px',
                                                        borderLeft: '3px solid #D4AF37'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '12px',
                                                            color: '#444',
                                                            lineHeight: 1.5,
                                                            marginBottom: word.review_idiom ? '6px' : 0,
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: '6px'
                                                        }}>
                                                            <button
                                                                onClick={() => playSentence(word.review_sentence!)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: '0',
                                                                    flexShrink: 0,
                                                                    marginTop: '1px'
                                                                }}
                                                            >
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </button>
                                                            <span>{word.review_sentence}</span>
                                                        </div>
                                                        {word.review_sentence_ja && (
                                                            <div style={{
                                                                fontSize: '11px',
                                                                color: '#888',
                                                                lineHeight: 1.5,
                                                                marginBottom: '2px',
                                                                paddingLeft: '18px'
                                                            }}>
                                                                {word.review_sentence_ja}
                                                            </div>
                                                        )}
                                                        <div style={{ paddingLeft: '18px', marginBottom: word.review_idiom ? '6px' : 0 }}>
                                                            {registerSuccess === word.id + '-phrase' ? (
                                                                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => openRegisterPopup(word, 'phrase')}
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
                                                        {word.review_idiom && (
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                flexWrap: 'wrap'
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
                                                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#92400E' }}>
                                                                    {word.review_idiom}
                                                                </span>
                                                                {word.review_idiom_meaning && (
                                                                    <span style={{ fontSize: '10px', color: '#888' }}>
                                                                        = {word.review_idiom_meaning}
                                                                    </span>
                                                                )}
                                                                {registerSuccess === word.id + '-idiom' ? (
                                                                    <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => openRegisterPopup(word, 'idiom')}
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
                                                )}

                                                {/* Bottom row: mastery + voice recorder ... YG + Vocab */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '40px' }}>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <button
                                                            onClick={() => cycleMastery(word.id)}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1)';
                                                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                                            }}
                                                            style={{
                                                                padding: '6px 14px',
                                                                borderRadius: '6px',
                                                                border: `2px solid ${masteryInfo.border}`,
                                                                backgroundColor: masteryInfo.bg,
                                                                color: masteryInfo.color,
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                cursor: 'pointer',
                                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                                transition: 'transform 0.15s, box-shadow 0.15s'
                                                            }}
                                                        >
                                                            {masteryInfo.label}
                                                        </button>
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
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                        <button
                                                            onClick={() => playYouGlish(word)}
                                                            style={{
                                                                background: '#f0f0f0',
                                                                border: 'none',
                                                                color: '#666',
                                                                fontSize: '9px',
                                                                cursor: 'pointer',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            YG
                                                        </button>
                                                        <button
                                                            onClick={() => openVocabModal(word)}
                                                            style={{
                                                                background: 'none',
                                                                border: '1px solid #10B981',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                padding: '2px 6px',
                                                                fontSize: '9px',
                                                                color: '#10B981',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            +Vocab
                                                        </button>
                                                        {word.source && (
                                                            <span style={{ fontSize: '9px', color: '#aaa' }}>
                                                                {word.source}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Review Header */}
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '14px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                            }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                                    今月の復習
                                </div>
                                {/* Filter Tabs */}
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {[
                                        { key: 'all' as const, label: '全部', count: thisMonthReviewWords.all.length, color: '#666', bg: '#f0f0f0' },
                                        { key: 0 as const, label: '未', count: thisMonthReviewWords.level0.length, color: '#888', bg: '#f0f0f0' },
                                        { key: 1 as const, label: '1回', count: thisMonthReviewWords.level1.length, color: '#D97706', bg: '#FEF3C7' },
                                        { key: 2 as const, label: '2回', count: thisMonthReviewWords.level2.length, color: '#2563EB', bg: '#DBEAFE' }
                                    ].map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => { setReviewFilter(tab.key); setReviewIndex(0); }}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: reviewFilter === tab.key ? '2px solid #D4AF37' : '1px solid #ddd',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                backgroundColor: reviewFilter === tab.key ? '#FFFBEB' : tab.bg,
                                                color: tab.color
                                            }}
                                        >
                                            {tab.label} {tab.count}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Current Review Card */}
                            {reviewList.length > 0 ? (
                                <>
                                    <div style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                    }}>
                                        {/* Progress */}
                                        <div style={{ fontSize: '10px', color: '#888', marginBottom: '12px', textAlign: 'center' }}>
                                            {reviewIndex + 1} / {reviewList.length}
                                        </div>

                                        {/* English */}
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#1a1a1a',
                                            marginBottom: '10px',
                                            lineHeight: 1.4,
                                            textAlign: 'center'
                                        }}>
                                            {reviewList[reviewIndex]?.phrase}
                                        </div>

                                        {/* Type badge */}
                                        {reviewList[reviewIndex] && (() => {
                                            const tc = TYPE_COLORS[reviewList[reviewIndex].type] || { bg: '#f0f0f0', text: '#666' };
                                            return (
                                                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                                    <span style={{
                                                        fontSize: '9px',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: tc.bg,
                                                        color: tc.text
                                                    }}>
                                                        {reviewList[reviewIndex].type}
                                                    </span>
                                                </div>
                                            );
                                        })()}

                                        {/* Japanese */}
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#666',
                                            marginBottom: '16px',
                                            textAlign: 'center'
                                        }}>
                                            {reviewList[reviewIndex]?.meaning}
                                        </div>

                                        {/* Review sentence with idiom */}
                                        {reviewList[reviewIndex]?.review_sentence && (
                                            <div style={{
                                                marginBottom: '16px',
                                                padding: '10px 12px',
                                                backgroundColor: '#FFFBEB',
                                                borderRadius: '10px',
                                                borderLeft: '3px solid #D4AF37'
                                            }}>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#444',
                                                    lineHeight: 1.6,
                                                    marginBottom: reviewList[reviewIndex]?.review_idiom ? '8px' : 0,
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '6px'
                                                }}>
                                                    <button
                                                        onClick={() => playSentence(reviewList[reviewIndex].review_sentence!)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '0',
                                                            flexShrink: 0,
                                                            marginTop: '1px'
                                                        }}
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </button>
                                                    <span>{reviewList[reviewIndex]?.review_sentence}</span>
                                                </div>
                                                {reviewList[reviewIndex]?.review_sentence_ja && (
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#888',
                                                        lineHeight: 1.5,
                                                        marginBottom: '2px',
                                                        paddingLeft: '18px'
                                                    }}>
                                                        {reviewList[reviewIndex]?.review_sentence_ja}
                                                    </div>
                                                )}
                                                <div style={{ paddingLeft: '18px', marginBottom: reviewList[reviewIndex]?.review_idiom ? '8px' : 0 }}>
                                                    {registerSuccess === reviewList[reviewIndex]?.id + '-phrase' ? (
                                                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => reviewList[reviewIndex] && openRegisterPopup(reviewList[reviewIndex], 'phrase')}
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
                                                {reviewList[reviewIndex]?.review_idiom && (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <span style={{
                                                            fontSize: '10px',
                                                            fontWeight: '700',
                                                            color: '#D4AF37',
                                                            padding: '2px 8px',
                                                            backgroundColor: '#FEF3C7',
                                                            borderRadius: '4px'
                                                        }}>
                                                            IDIOM
                                                        </span>
                                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#92400E' }}>
                                                            {reviewList[reviewIndex]?.review_idiom}
                                                        </span>
                                                        {reviewList[reviewIndex]?.review_idiom_meaning && (
                                                            <div style={{ fontSize: '10px', color: '#888', width: '100%', marginTop: '2px' }}>
                                                                {reviewList[reviewIndex]?.review_idiom_meaning}
                                                            </div>
                                                        )}
                                                        {registerSuccess === reviewList[reviewIndex]?.id + '-idiom' ? (
                                                            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '600' }}>OK</span>
                                                        ) : (
                                                            <button
                                                                onClick={() => reviewList[reviewIndex] && openRegisterPopup(reviewList[reviewIndex], 'idiom')}
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
                                        )}

                                        {/* Play Button + Voice Recorder */}
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <button
                                                onClick={() => reviewList[reviewIndex] && playWord(reviewList[reviewIndex])}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    backgroundColor: playingWordId === reviewList[reviewIndex]?.id ? '#D4AF37' : '#f5f5f5',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill={playingWordId === reviewList[reviewIndex]?.id ? '#fff' : '#666'}>
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>
                                            {reviewList[reviewIndex] && (
                                                <VoiceRecorder
                                                    phraseId={reviewList[reviewIndex].id}
                                                    recordings={voiceRecordings[reviewList[reviewIndex].id] || []}
                                                    onRecordingComplete={(recording) => {
                                                        setVoiceRecordings(prev => ({
                                                            ...prev,
                                                            [reviewList[reviewIndex].id]: [recording, ...(prev[reviewList[reviewIndex].id] || [])]
                                                        }));
                                                    }}
                                                    onRecordingDelete={(id) => {
                                                        setVoiceRecordings(prev => ({
                                                            ...prev,
                                                            [reviewList[reviewIndex].id]: (prev[reviewList[reviewIndex].id] || []).filter(r => r.id !== id)
                                                        }));
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Mastery Button */}
                                        {reviewList[reviewIndex] && (() => {
                                            const mastery = (reviewList[reviewIndex].mastery_level || 0) as MasteryLevel;
                                            const masteryInfo = getMasteryLabel(mastery);
                                            return (
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                                    <button
                                                        onClick={() => cycleMastery(reviewList[reviewIndex].id)}
                                                        style={{
                                                            padding: '8px 20px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            backgroundColor: masteryInfo.bg,
                                                            color: masteryInfo.color,
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {masteryInfo.label}
                                                    </button>
                                                </div>
                                            );
                                        })()}

                                        {/* YG + Vocab buttons in review mode */}
                                        {reviewList[reviewIndex] && (
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                                                <button
                                                    onClick={() => playYouGlish(reviewList[reviewIndex])}
                                                    style={{
                                                        background: '#f0f0f0',
                                                        border: 'none',
                                                        color: '#666',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px'
                                                    }}
                                                >
                                                    YG
                                                </button>
                                                <button
                                                    onClick={() => openVocabModal(reviewList[reviewIndex])}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid #10B981',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        padding: '6px 12px',
                                                        fontSize: '11px',
                                                        color: '#10B981',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    +Vocab
                                                </button>
                                            </div>
                                        )}

                                        {/* Navigation */}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => setReviewIndex(i => (i - 1 + reviewList.length) % reviewList.length)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    backgroundColor: '#fff',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    color: '#666'
                                                }}
                                            >
                                                Prev
                                            </button>
                                            <button
                                                onClick={() => setReviewIndex(i => (i + 1) % reviewList.length)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#D4AF37',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            textAlign: 'center',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                                        }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4AF37' }}>
                                                {thisMonthReviewWords.total.length}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#888' }}>今月</div>
                                        </div>
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            textAlign: 'center',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                                        }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>
                                                {clearedCount}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#888' }}>Clear</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    textAlign: 'center',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#888' }}>
                                        復習する単語がありません
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* YouGlish Floating Player */}
            {youglishPhrase && (
                <div style={{
                    position: 'fixed',
                    left: playerFullscreen ? 0 : playerPosition.x,
                    top: playerFullscreen ? 0 : playerPosition.y,
                    width: playerFullscreen ? '100vw' : playerMinimized ? '200px' : playerSize.width,
                    height: playerFullscreen ? '100vh' : playerMinimized ? 'auto' : playerSize.height,
                    backgroundColor: '#fff',
                    borderRadius: playerFullscreen ? 0 : '12px',
                    boxShadow: playerFullscreen ? 'none' : '0 4px 20px rgba(0,0,0,0.25)',
                    zIndex: 1001,
                    overflow: 'hidden',
                    userSelect: (isDragging || isResizing) ? 'none' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Header */}
                    <div
                        onMouseDown={handleDragStart}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            borderBottom: '1px solid #333',
                            backgroundColor: '#1a1a1a',
                            cursor: playerFullscreen ? 'default' : isDragging ? 'grabbing' : 'grab',
                            flexShrink: 0
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {!playerFullscreen && <span style={{ color: '#666', fontSize: '10px' }}>:::::</span>}
                            <span style={{ fontWeight: '600', fontSize: '12px', color: '#fff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {youglishPhrase.phrase.slice(0, 30)}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {/* Minimize */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setPlayerMinimized(!playerMinimized); setPlayerFullscreen(false); }}
                                style={{
                                    background: '#444',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}
                                title="Minimize"
                            >
                                _
                            </button>
                            {/* Fullscreen */}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                style={{
                                    background: playerFullscreen ? '#10B981' : '#444',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}
                                title={playerFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                                {playerFullscreen ? '[]' : '[ ]'}
                            </button>
                            {/* Close */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setYouglishPhrase(null); setCaptionHistory([]); setPlayerFullscreen(false); }}
                                style={{
                                    background: '#dc2626',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                }}
                                title="Close"
                            >
                                X
                            </button>
                        </div>
                    </div>

                    {!playerMinimized && (
                    <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                        {/* Search Input */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={youglishQuery}
                                onChange={(e) => setYouglishQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchYouGlish()}
                                placeholder="Search word (e.g. believe, amazing)"
                                style={{
                                    flex: 1,
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={searchYouGlish}
                                disabled={!youglishQuery.trim()}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: youglishQuery.trim() ? '#D4AF37' : '#e5e5e5',
                                    color: youglishQuery.trim() ? '#000' : '#999',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: youglishQuery.trim() ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Search
                            </button>
                        </div>

                        {/* Original phrase reference */}
                        <div style={{ fontSize: '11px', color: '#888', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                            <strong>Original:</strong> {youglishPhrase.phrase}
                        </div>

                        {/* YouGlish Widget */}
                        <div id="yg-widget-words" style={{
                            minHeight: '200px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            display: youglishSearched ? 'block' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {!youglishSearched && (
                                <span style={{ color: '#888', fontSize: '13px' }}>Enter a keyword to search</span>
                            )}
                        </div>

                        {/* Caption History */}
                        {captionHistory.length > 0 && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '8px',
                                border: '1px solid #bbf7d0'
                            }}>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#666',
                                    marginBottom: '6px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>Captions ({captionHistory.filter(c => c.selected).length}/{captionHistory.length}):</span>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: true })))} style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '10px', cursor: 'pointer' }}>All</button>
                                        <button onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: false })))} style={{ background: 'none', border: 'none', color: '#999', fontSize: '10px', cursor: 'pointer' }}>None</button>
                                        <button onClick={() => setCaptionHistory([])} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '10px', cursor: 'pointer' }}>Clear</button>
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    maxHeight: '100px',
                                    overflowY: 'auto',
                                    padding: '6px',
                                    backgroundColor: '#fff',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e5e5',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '3px'
                                }}>
                                    {captionHistory.map((caption, idx) => (
                                        <span
                                            key={idx}
                                            onClick={() => setCaptionHistory(prev => prev.map((c, i) => i === idx ? { ...c, selected: !c.selected } : c))}
                                            style={{
                                                padding: '3px 6px',
                                                borderRadius: '3px',
                                                backgroundColor: caption.selected ? '#dcfce7' : '#f5f5f5',
                                                color: caption.selected ? '#166534' : '#999',
                                                cursor: 'pointer',
                                                border: caption.selected ? '1px solid #86efac' : '1px solid #e5e5e5',
                                                textDecoration: caption.selected ? 'none' : 'line-through'
                                            }}
                                        >
                                            {caption.text}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                                    <input
                                        type="date"
                                        value={youglishSaveDate}
                                        onChange={(e) => setYouglishSaveDate(e.target.value)}
                                        style={{
                                            flex: '0 0 auto',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: '1px solid #e5e5e5',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <button
                                        onClick={saveSelectedCaptions}
                                        disabled={savingPhrase || captionHistory.filter(c => c.selected).length === 0}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            backgroundColor: captionHistory.filter(c => c.selected).length === 0 ? '#e5e5e5' : '#D4AF37',
                                            color: captionHistory.filter(c => c.selected).length === 0 ? '#999' : '#000',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            cursor: savingPhrase || captionHistory.filter(c => c.selected).length === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {savingPhrase ? 'Saving...' : 'Add to phrases'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    )}

                    {/* Resize Handle */}
                    {!playerFullscreen && !playerMinimized && (
                        <div
                            onMouseDown={handleResizeStart}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: '20px',
                                height: '20px',
                                cursor: 'se-resize',
                                background: 'linear-gradient(135deg, transparent 50%, #ccc 50%)',
                                borderRadius: '0 0 12px 0',
                            }}
                        />
                    )}
                </div>
            )}

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
                    zIndex: 1002,
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
