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

interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

type MasteryLevel = 0 | 1 | 2 | 3; // 0: new, 1: 1回復習, 2: 2回復習, 3: クリア

// Puzzle background image (beautiful landscape for motivation)
const PUZZLE_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'daily': { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    'business': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'casual': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'idiom': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'slang': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
};

// Mastery level display: 0=未, 1=①, 2=②, 3=済
const getMasteryLabel = (level: MasteryLevel) => {
    switch (level) {
        case 0: return { label: '未', color: '#888', bg: '#f0f0f0', border: '#ddd' };
        case 1: return { label: '①', color: '#D97706', bg: '#FEF3C7', border: '#F59E0B' };
        case 2: return { label: '②', color: '#2563EB', bg: '#DBEAFE', border: '#3B82F6' };
        case 3: return { label: '済', color: '#059669', bg: '#D1FAE5', border: '#10B981' };
    }
};

export default function PhrasesPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [phraseMastery, setPhraseMastery] = useState<Record<string, MasteryLevel>>({});
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    const [randomPhraseIndex, setRandomPhraseIndex] = useState<Record<string, number>>({});
    const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [reviewFilter, setReviewFilter] = useState<0 | 1 | 2 | 'all'>('all');
    const [reviewIndex, setReviewIndex] = useState(0);
    const [calendarFilter, setCalendarFilter] = useState<0 | 1 | 2 | 3 | 'all'>('all');
    const [voiceRecordings, setVoiceRecordings] = useState<Record<string, VoiceRecording[]>>({});

    // Add phrase form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPhrase, setNewPhrase] = useState({ english: '', japanese: '', category: 'daily' });
    const [formDate, setFormDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // YouGlish state
    const [youglishPhrase, setYouglishPhrase] = useState<Phrase | null>(null);
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

    // Edit phrase state
    const [editingPhrase, setEditingPhrase] = useState<{ id: string; english: string; japanese: string } | null>(null);
    const [editSaving, setEditSaving] = useState(false);

    // Right sidebar expanded state
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

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

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [phrasesRes, masteryRes, recordingsRes] = await Promise.all([
                    fetch('/api/phrases'),
                    fetch('/api/phrases/mastery'),
                    fetch('/api/voice-recordings')
                ]);
                const phrasesData = await phrasesRes.json();
                const masteryData = await masteryRes.json();
                const recordingsData = await recordingsRes.json();
                if (phrasesData.success) setPhrases(phrasesData.phrases);
                if (masteryData.success) setPhraseMastery(masteryData.mastery || {});
                if (recordingsData.success) setVoiceRecordings(recordingsData.recordings || {});
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Load voices for speech synthesis
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

    const playYouGlish = (phrase: Phrase) => {
        setYouglishPhrase(phrase);
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

        // Wait for React to render the empty container
        setTimeout(() => {
            const container = document.getElementById('yg-widget-phrases');
            if (container) container.innerHTML = '';

            widgetRef.current = new window.YG!.Widget('yg-widget-phrases', {
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
                    japanese: `(${youglishPhrase?.english.slice(0, 30) || 'YouGlish'})`,
                    category: 'YouGlish',
                    date: youglishSaveDate
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.phrase) {
                    setPhrases(prev => [...prev, data.phrase]);
                }
                alert('Saved!');
                setCaptionHistory([]);
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

    // Group by date
    const phrasesByDate = useMemo(() => {
        const map: Record<string, Phrase[]> = {};
        phrases.forEach(phrase => {
            const dateKey = phrase.date.split('T')[0];
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(phrase);
        });
        return map;
    }, [phrases]);

    // Filtered items for search
    const filteredPhrases = useMemo(() => {
        if (!searchQuery.trim()) return phrases;
        const q = searchQuery.toLowerCase();
        return phrases.filter(p =>
            p.english.toLowerCase().includes(q) ||
            p.japanese.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
    }, [phrases, searchQuery]);

    // This month's phrases for review, grouped by mastery level
    const thisMonthReviewPhrases = useMemo(() => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const monthPhrases = phrases.filter(p => {
            const d = new Date(p.date);
            return d >= monthStart && d <= monthEnd;
        });

        // Shuffle using date-based seed for stability
        const seed = currentMonth.getFullYear() * 100 + currentMonth.getMonth();
        const shuffled = [...monthPhrases].sort((a, b) => {
            const hashA = (a.id.charCodeAt(0) + seed) % 100;
            const hashB = (b.id.charCodeAt(0) + seed) % 100;
            return hashA - hashB;
        });

        return {
            level0: shuffled.filter(p => Number(phraseMastery[p.id] || 0) === 0),  // 未：ちょうど0回
            level1: shuffled.filter(p => Number(phraseMastery[p.id] || 0) === 1),  // 1回：ちょうど1回
            level2: shuffled.filter(p => Number(phraseMastery[p.id] || 0) === 2),  // 2回：ちょうど2回
            all: shuffled.filter(p => Number(phraseMastery[p.id] || 0) < 3),  // 全部（未完了）
            total: shuffled  // 済も含む全部
        };
    }, [phrases, currentMonth, phraseMastery]);

    // Get current review list based on filter
    const reviewList = useMemo(() => {
        if (reviewFilter === 'all') return thisMonthReviewPhrases.all;
        return thisMonthReviewPhrases[`level${reviewFilter}` as keyof typeof thisMonthReviewPhrases] as Phrase[];
    }, [thisMonthReviewPhrases, reviewFilter]);

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
    const reviewingCount = phrases.filter(p => {
        const level = Number(phraseMastery[p.id] || 0);
        return level >= 1 && level < 3;
    }).length;
    const clearedCount = phrases.filter(p => Number(phraseMastery[p.id] || 0) >= 3).length;
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekPhrases = phrases.filter(p => {
        const d = new Date(p.date);
        return d >= weekAgo && d <= today;
    });

    // Cycle mastery level: 0 -> 1 -> 2 -> 3 -> 0
    const cycleMastery = useCallback(async (phraseId: string) => {
        const current = Number(phraseMastery[phraseId] || 0);
        const next = ((current + 1) % 4) as MasteryLevel;

        setPhraseMastery(prev => ({ ...prev, [phraseId]: next }));

        try {
            await fetch('/api/phrases/mastery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phraseId, level: next })
            });
        } catch (err) {
            console.error('Failed to save mastery:', err);
        }
    }, [phraseMastery]);

    // Play phrase audio
    const playPhrase = useCallback((phrase: Phrase) => {
        window.speechSynthesis.cancel();
        setPlayingPhraseId(phrase.id);

        const utterance = new SpeechSynthesisUtterance(phrase.english);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;

        utterance.onend = () => setPlayingPhraseId(null);
        utterance.onerror = () => setPlayingPhraseId(null);

        window.speechSynthesis.speak(utterance);
    }, [voices]);

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    const selectedPhrasesAll = selectedDate ? (phrasesByDate[selectedDate] || []) : [];
    // フィルターに応じて右バーに表示するフレーズを絞る
    // 右バーには「まだその回数に達していないフレーズ」を表示（やるべきフレーズ）
    const selectedPhrases = (() => {
        if (calendarFilter === 'all') return selectedPhrasesAll;
        // 未フィルター: レベル0のフレーズ（まだ始めてない）
        if (calendarFilter === 0) {
            return selectedPhrasesAll.filter(p => Number(phraseMastery[p.id] || 0) === 0);
        }
        // 1回フィルター: レベル0と1（まだ2回に達してない）
        if (calendarFilter === 1) {
            return selectedPhrasesAll.filter(p => Number(phraseMastery[p.id] || 0) <= 1);
        }
        // 2回フィルター: レベル0,1,2（まだ済に達してない）
        if (calendarFilter === 2) {
            return selectedPhrasesAll.filter(p => Number(phraseMastery[p.id] || 0) <= 2);
        }
        // 済フィルター: レベル0,1,2（まだ済に達してない）
        return selectedPhrasesAll.filter(p => Number(phraseMastery[p.id] || 0) < 3);
    })();

    // Get random phrase for a date (uses date hash for stable "random" selection)
    const getRandomPhrase = useCallback((dateKey: string, dayPhrases: Phrase[]) => {
        if (dayPhrases.length === 0) return null;
        // Use stored index if cycled, otherwise use date-based hash for stable selection
        if (randomPhraseIndex[dateKey] !== undefined) {
            return dayPhrases[randomPhraseIndex[dateKey] % dayPhrases.length];
        }
        // Date-based hash for stable "random" selection
        const hash = dateKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return dayPhrases[hash % dayPhrases.length];
    }, [randomPhraseIndex]);

    // Cycle to next phrase on hover
    const cyclePhrase = useCallback((dateKey: string, dayPhrases: Phrase[]) => {
        if (dayPhrases.length <= 1) return;
        setRandomPhraseIndex(prev => ({
            ...prev,
            [dateKey]: ((prev[dateKey] ?? 0) + 1) % dayPhrases.length
        }));
    }, []);

    // Check if all phrases for a day are cleared (puzzle piece complete)
    const isDayMastered = useCallback((dayPhrases: Phrase[]) => {
        if (dayPhrases.length === 0) return false;
        return dayPhrases.every(p => Number(phraseMastery[p.id] || 0) >= 3);
    }, [phraseMastery]);

    // Calculate puzzle stats (all phrases cleared = puzzle piece complete)
    const puzzleStats = useMemo(() => {
        const daysWithPhrases = Object.keys(phrasesByDate).length;
        const masteredDays = Object.entries(phrasesByDate).filter(([_, phrases]) =>
            phrases.every(p => Number(phraseMastery[p.id] || 0) >= 3)
        ).length;
        return { total: daysWithPhrases, mastered: masteredDays };
    }, [phrasesByDate, phraseMastery]);

    const openVocabModal = (english: string) => {
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
                    source: 'Phrases',
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

    const handleEditPhrase = async () => {
        if (!editingPhrase || !editingPhrase.english.trim()) return;
        setEditSaving(true);
        try {
            const res = await fetch(`/api/phrases/${editingPhrase.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: editingPhrase.english.trim(),
                    japanese: editingPhrase.japanese.trim(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPhrases(prev => prev.map(p =>
                    p.id === editingPhrase.id
                        ? { ...p, english: editingPhrase.english.trim(), japanese: editingPhrase.japanese.trim() }
                        : p
                ));
                setEditingPhrase(null);
            } else {
                alert(data.error || 'Failed to update');
            }
        } catch (error) {
            console.error('Error updating phrase:', error);
            alert('Error updating phrase');
        } finally {
            setEditSaving(false);
        }
    };

    const handleDeletePhrase = async (id: string) => {
        if (!confirm('Delete this phrase?')) return;
        try {
            const res = await fetch(`/api/phrases/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setPhrases(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting phrase:', error);
        }
    };

    const handleAddPhrase = async () => {
        if (!newPhrase.english.trim() || !newPhrase.japanese.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: newPhrase.english.trim(),
                    japanese: newPhrase.japanese.trim(),
                    category: newPhrase.category,
                    date: formDate,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPhrases(prev => [...prev, data.phrase]);
                setNewPhrase({ english: '', japanese: '', category: 'daily' });
                setShowAddForm(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                {viewMode === 'calendar' ? (
                    <>
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
                                {year}年 {monthNames[month]}
                            </span>
                            <button
                                onClick={() => { setCurrentMonth(new Date()); setSelectedDate(null); }}
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
                                今日
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={() => setViewMode('calendar')}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#666',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        ← Calendar
                    </button>
                )}

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {viewMode === 'calendar' && (
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                background: '#f0f0f0',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: '#666'
                            }}
                        >
                            List
                        </button>
                    )}
                    <button
                        onClick={() => setShowAddForm(true)}
                        style={{
                            background: '#D4AF37',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#000'
                        }}
                    >
                        + Add
                    </button>
                    {viewMode === 'calendar' && (
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
                    )}
                </div>
            </div>

            {/* Main Content */}
            {viewMode === 'list' ? (
                /* List View */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Search */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #e5e5e5',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                            All Phrases ({filteredPhrases.length})
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            復習中: {reviewingCount} | Clear: {clearedCount}
                        </div>
                    </div>

                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 80px 2fr 80px 60px 30px 32px 40px',
                        padding: '10px 16px',
                        borderBottom: '1px solid #e5e5e5',
                        backgroundColor: '#fafafa',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#888'
                    }}>
                        <div>English</div>
                        <div>Category</div>
                        <div>Japanese</div>
                        <div>Status</div>
                        <div style={{ textAlign: 'right' }}>Date</div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    {/* List */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredPhrases.map(phrase => {
                            const mastery = phraseMastery[phrase.id] || 0;
                            const masteryInfo = getMasteryLabel(mastery);
                            return (
                                <div
                                    key={phrase.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 80px 2fr 80px 60px 30px 32px 40px',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f0f0f0',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div
                                        onClick={() => setSelectedDate(phrase.date.split('T')[0])}
                                        style={{ fontSize: '14px', fontWeight: '500', color: CATEGORY_COLORS[phrase.category]?.text || '#333', cursor: 'pointer' }}
                                    >
                                        {phrase.english}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>
                                        {phrase.category}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {phrase.japanese}
                                    </div>
                                    <button
                                        onClick={() => cycleMastery(phrase.id)}
                                        style={{
                                            fontSize: '10px',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            backgroundColor: masteryInfo.bg,
                                            color: masteryInfo.color,
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {masteryInfo.label}
                                    </button>
                                    <div style={{ fontSize: '11px', color: '#888', textAlign: 'right' }}>
                                        {phrase.date.split('T')[0].slice(5)}
                                    </div>
                                    <button
                                        onClick={() => playYouGlish(phrase)}
                                        style={{
                                            background: '#f0f0f0',
                                            border: 'none',
                                            color: '#666',
                                            fontSize: '9px',
                                            cursor: 'pointer',
                                            padding: '4px 6px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        YG
                                    </button>
                                    <button
                                        onClick={() => setEditingPhrase({ id: phrase.id, english: phrase.english, japanese: phrase.japanese })}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ccc',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#3B82F6'; e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePhrase(phrase.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ccc',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        Del
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Calendar View */
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
                        right: isMobile ? 'auto' : (sidebarExpanded ? '540px' : '320px'),
                        bottom: isMobile ? 'auto' : 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                        minHeight: isMobile ? '400px' : 'auto',
                        transition: 'right 0.25s ease'
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
                                    const allDayPhrases = phrasesByDate[dateKey] || [];
                                    const hasAnyPhrases = allDayPhrases.length > 0;
                                    const isTodayDate = isToday(day);
                                    const dayOfWeek = (startDayOfWeek + day - 1) % 7;

                                    // Count phrases at each mastery level for this day
                                    const countByLevel = {
                                        level0: allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) === 0).length,
                                        level1Plus: allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) >= 1).length,
                                        level2Plus: allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) >= 2).length,
                                        level3: allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) >= 3).length,
                                    };

                                    // Filter by mastery level - cumulative for calendar fill (N回以上)
                                    const dayPhrases = calendarFilter === 'all'
                                        ? allDayPhrases
                                        : calendarFilter === 0
                                            ? allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) === 0)
                                            : calendarFilter === 1
                                                ? allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) >= 1)
                                                : calendarFilter === 2
                                                    ? allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) >= 2)
                                                    : allDayPhrases.filter(p => Number(phraseMastery[p.id] || 0) >= 3);
                                    const hasPhrases = dayPhrases.length > 0;

                                    // Progress calculation - 「その回数を終えた」割合で埋める
                                    // 未: 1回以上に進んだ割合（未を終えた）
                                    // 1回: 2回以上に進んだ割合（1回を終えた）
                                    // 2回: 済に進んだ割合（2回を終えた）
                                    // 済: 済の割合
                                    let reviewProgress = 0;
                                    if (allDayPhrases.length > 0) {
                                        if (calendarFilter === 'all') {
                                            reviewProgress = countByLevel.level3 / allDayPhrases.length;
                                        } else if (calendarFilter === 0) {
                                            // 未フィルター: 1回以上に進んだ割合
                                            reviewProgress = countByLevel.level1Plus / allDayPhrases.length;
                                        } else if (calendarFilter === 1) {
                                            // 1回フィルター: 2回以上に進んだ割合（1回を終えた）
                                            reviewProgress = countByLevel.level2Plus / allDayPhrases.length;
                                        } else if (calendarFilter === 2) {
                                            // 2回フィルター: 済に進んだ割合（2回を終えた）
                                            reviewProgress = countByLevel.level3 / allDayPhrases.length;
                                        } else {
                                            // 済フィルター: 済の割合
                                            reviewProgress = countByLevel.level3 / allDayPhrases.length;
                                        }
                                    }

                                    const isMastered = calendarFilter === 'all'
                                        ? isDayMastered(allDayPhrases)
                                        : calendarFilter === 0
                                            ? countByLevel.level0 === 0
                                            : calendarFilter === 1
                                                ? countByLevel.level2Plus === allDayPhrases.length
                                                : calendarFilter === 2
                                                    ? countByLevel.level3 === allDayPhrases.length
                                                    : countByLevel.level3 === allDayPhrases.length;
                                    const clearedInDay = countByLevel.level3;

                                    // Get random phrase to display (always from all phrases for the day)
                                    const randomPhrase = hasAnyPhrases ? getRandomPhrase(dateKey, allDayPhrases) : null;

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => hasAnyPhrases && setSelectedDate(dateKey)}
                                            onMouseEnter={(e) => {
                                                if (hasAnyPhrases) {
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
                                                cursor: hasAnyPhrases ? 'pointer' : 'default',
                                                overflow: 'hidden',
                                                padding: '6px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                backgroundColor: '#fafafa',
                                                border: isTodayDate
                                                    ? '2px solid #D4AF37'
                                                    : hasAnyPhrases ? '1px solid #e5e5e5' : '1px solid #f0f0f0',
                                                transition: 'transform 0.15s, box-shadow 0.15s'
                                            }}
                                        >
                                                {/* Fill effect - rises from bottom as progress increases */}
                                                {hasAnyPhrases && calendarFilter !== 'all' && reviewProgress > 0 && (
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
                                                {/* Fill effect for 'all' view */}
                                                {hasAnyPhrases && calendarFilter === 'all' && !isMastered && reviewProgress > 0 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: `${(clearedInDay / allDayPhrases.length) * 100}%`,
                                                        backgroundColor: 'rgba(16, 185, 129, 0.25)',
                                                        transition: 'height 0.3s ease-out',
                                                        pointerEvents: 'none',
                                                        zIndex: 0
                                                    }} />
                                                )}

                                                {/* Day number + mastery indicator */}
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
                                                    {hasAnyPhrases && (
                                                        <span style={{
                                                            fontSize: '10px',
                                                            color: calendarFilter === 'all' ? (isMastered ? '#059669' : '#888')
                                                                : calendarFilter === 0 ? (dayPhrases.length === 0 ? '#059669' : '#666')
                                                                : calendarFilter === 1 ? '#D97706'
                                                                : calendarFilter === 2 ? '#2563EB'
                                                                : calendarFilter === 3 ? '#059669'
                                                                : '#888',
                                                            fontWeight: '600'
                                                        }}>
                                                            {calendarFilter === 'all'
                                                                ? (isMastered ? '済' : `${clearedInDay}/${allDayPhrases.length}`)
                                                                : calendarFilter === 0
                                                                    ? (countByLevel.level0 === 0 ? '済' : `残${countByLevel.level0}`)
                                                                    : calendarFilter === 1
                                                                        ? (countByLevel.level2Plus === allDayPhrases.length ? '済' : `${countByLevel.level2Plus}/${allDayPhrases.length}`)
                                                                        : calendarFilter === 2
                                                                            ? (countByLevel.level3 === allDayPhrases.length ? '済' : `${countByLevel.level3}/${allDayPhrases.length}`)
                                                                            : (isMastered ? '済' : `${countByLevel.level3}/${allDayPhrases.length}`)
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Random phrase preview */}
                                                {hasAnyPhrases && randomPhrase && (
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
                                                            {randomPhrase.english}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Empty cell: Just + button */}
                                                {!hasAnyPhrases && (
                                                    <div style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative',
                                                        zIndex: 1
                                                    }}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormDate(dateKey);
                                                                setShowAddForm(true);
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#D4AF37';
                                                                e.currentTarget.style.color = '#fff';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = 'rgba(212,175,55,0.2)';
                                                                e.currentTarget.style.color = '#B8960C';
                                                            }}
                                                            style={{
                                                                width: '28px',
                                                                height: '28px',
                                                                borderRadius: '50%',
                                                                background: 'rgba(212,175,55,0.2)',
                                                                border: 'none',
                                                                fontSize: '16px',
                                                                fontWeight: '400',
                                                                color: '#B8960C',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}

                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Right Panel - Stats OR Selected Date Phrases */}
                    <div style={{
                        position: isMobile ? 'relative' : 'absolute',
                        top: isMobile ? 'auto' : 0,
                        right: isMobile ? 'auto' : 0,
                        bottom: isMobile ? 'auto' : 0,
                        width: isMobile ? '100%' : (sidebarExpanded ? '540px' : '320px'),
                        flexShrink: 0,
                        backgroundColor: '#fafafa',
                        borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
                        borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        overflowY: isMobile ? 'visible' : 'auto',
                        transition: 'width 0.25s ease'
                    }}>
                        {/* Show phrases when date is selected, otherwise show stats */}
                        {selectedDate && selectedPhrasesAll.length > 0 ? (
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
                                            {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
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
                                            {selectedPhrases.length} / {selectedPhrasesAll.length} phrases
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        {!isMobile && (
                                            <button
                                                onClick={() => setSidebarExpanded(prev => !prev)}
                                                title={sidebarExpanded ? 'Collapse' : 'Expand'}
                                                style={{
                                                    background: sidebarExpanded ? '#D4AF37' : '#f0f0f0',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '6px 10px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    color: sidebarExpanded ? '#fff' : '#666',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sidebarExpanded ? '#fff' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.25s', transform: sidebarExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                    <polyline points="15 18 9 12 15 6" />
                                                </svg>
                                                {sidebarExpanded ? 'Narrow' : 'Wide'}
                                            </button>
                                        )}
                                        <Link
                                            href={`/english/phrases/${selectedDate}`}
                                            style={{
                                                background: '#D4AF37',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                color: '#000',
                                                textDecoration: 'none',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Listen
                                        </Link>
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
                                </div>

                                {/* Phrase List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedPhrases.length === 0 && calendarFilter !== 'all' && (
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            textAlign: 'center',
                                            color: '#888',
                                            fontSize: '13px'
                                        }}>
                                            {calendarFilter === 0 ? '未復習のフレーズはありません' :
                                             calendarFilter === 1 ? '全て2回以上です' :
                                             calendarFilter === 2 ? '全て済です' :
                                             calendarFilter === 3 ? '全て済です' :
                                             'フレーズはありません'}
                                        </div>
                                    )}
                                    {selectedPhrases.map(phrase => {
                                        const mastery = phraseMastery[phrase.id] || 0;
                                        const masteryInfo = getMasteryLabel(mastery);
                                        const isPlaying = playingPhraseId === phrase.id;
                                        const catColor = CATEGORY_COLORS[phrase.category] || { bg: '#f0f0f0', text: '#666', border: '#e5e5e5' };
                                        return (
                                            <div
                                                key={phrase.id}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                                    border: isPlaying ? '2px solid #D4AF37' : '1px solid #e5e5e5'
                                                }}
                                            >
                                                <div style={{ height: '3px', backgroundColor: catColor.text }} />
                                                <div style={{ padding: '12px' }}>
                                                    {/* Header: Play + English */}
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        marginBottom: '6px'
                                                    }}>
                                                        <button
                                                            onClick={() => playPhrase(phrase)}
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
                                                            {phrase.english}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', marginLeft: '40px' }}>
                                                        {phrase.japanese}
                                                    </div>

                                                    {/* Actions Row 1: Mastery + Voice */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '40px', marginBottom: '8px' }}>
                                                        <button
                                                            onClick={() => cycleMastery(phrase.id)}
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
                                                        {phrase.category !== 'Bookmarked' && (
                                                            <span style={{
                                                                fontSize: '9px',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                backgroundColor: catColor.bg,
                                                                color: catColor.text,
                                                                marginLeft: 'auto'
                                                            }}>
                                                                {phrase.category}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Actions Row 2: Tools + Edit/Del */}
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginLeft: '40px',
                                                        paddingTop: '8px',
                                                        borderTop: '1px solid #f0f0f0'
                                                    }}>
                                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                            <button
                                                                onClick={() => playYouGlish(phrase)}
                                                                style={{
                                                                    background: '#f0f0f0',
                                                                    border: 'none',
                                                                    color: '#666',
                                                                    fontSize: '10px',
                                                                    cursor: 'pointer',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '4px',
                                                                    transition: 'background 0.15s'
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e5e5'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
                                                            >
                                                                YG
                                                            </button>
                                                            <button
                                                                onClick={() => openVocabModal(phrase.english)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: '1px solid #10B981',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    padding: '4px 8px',
                                                                    fontSize: '10px',
                                                                    color: '#10B981',
                                                                    fontWeight: '600',
                                                                    transition: 'all 0.15s'
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#ECFDF5'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                                                            >
                                                                +Vocab
                                                            </button>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                            <button
                                                                onClick={() => setEditingPhrase({ id: phrase.id, english: phrase.english, japanese: phrase.japanese })}
                                                                style={{
                                                                    background: '#EFF6FF',
                                                                    border: '1px solid #BFDBFE',
                                                                    color: '#3B82F6',
                                                                    fontSize: '10px',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '4px',
                                                                    transition: 'all 0.15s'
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePhrase(phrase.id)}
                                                                style={{
                                                                    background: '#FEF2F2',
                                                                    border: '1px solid #FECACA',
                                                                    color: '#EF4444',
                                                                    fontSize: '10px',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '4px',
                                                                    transition: 'all 0.15s'
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                                                            >
                                                                Del
                                                            </button>
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
                                            { key: 'all' as const, label: '全部', count: thisMonthReviewPhrases.all.length, color: '#666', bg: '#f0f0f0' },
                                            { key: 0 as const, label: '未', count: thisMonthReviewPhrases.level0.length, color: '#888', bg: '#f0f0f0' },
                                            { key: 1 as const, label: '1回', count: thisMonthReviewPhrases.level1.length, color: '#D97706', bg: '#FEF3C7' },
                                            { key: 2 as const, label: '2回', count: thisMonthReviewPhrases.level2.length, color: '#2563EB', bg: '#DBEAFE' }
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
                                                {reviewList[reviewIndex]?.english}
                                            </div>

                                            {/* Japanese */}
                                            <div style={{
                                                fontSize: '13px',
                                                color: '#666',
                                                marginBottom: '16px',
                                                textAlign: 'center'
                                            }}>
                                                {reviewList[reviewIndex]?.japanese}
                                            </div>

                                            {/* Play Button + Voice Recorder */}
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                <button
                                                    onClick={() => reviewList[reviewIndex] && playPhrase(reviewList[reviewIndex])}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '50%',
                                                        backgroundColor: playingPhraseId === reviewList[reviewIndex]?.id ? '#D4AF37' : '#f5f5f5',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill={playingPhraseId === reviewList[reviewIndex]?.id ? '#fff' : '#666'}>
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
                                                const mastery = phraseMastery[reviewList[reviewIndex].id] || 0;
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
                                                    {thisMonthReviewPhrases.all.length}
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
                                            復習するフレーズがありません
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Add Phrase Modal */}
            {showAddForm && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowAddForm(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            width: '100%',
                            maxWidth: '400px'
                        }}
                    >
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
                            Add New Phrase
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                Date
                            </label>
                            <input
                                type="date"
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                English
                            </label>
                            <input
                                type="text"
                                value={newPhrase.english}
                                onChange={(e) => setNewPhrase(prev => ({ ...prev, english: e.target.value }))}
                                placeholder="Enter English phrase"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                Japanese
                            </label>
                            <input
                                type="text"
                                value={newPhrase.japanese}
                                onChange={(e) => setNewPhrase(prev => ({ ...prev, japanese: e.target.value }))}
                                placeholder="日本語訳を入力"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                                Category
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {Object.keys(CATEGORY_COLORS).map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setNewPhrase(prev => ({ ...prev, category: cat }))}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            border: newPhrase.category === cat ? `2px solid ${CATEGORY_COLORS[cat].text}` : `1px solid ${CATEGORY_COLORS[cat].border}`,
                                            backgroundColor: CATEGORY_COLORS[cat].bg,
                                            color: CATEGORY_COLORS[cat].text,
                                            fontSize: '13px',
                                            fontWeight: newPhrase.category === cat ? '600' : '400',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowAddForm(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    backgroundColor: '#fff',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPhrase}
                                disabled={isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim()}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? '#e5e5e5' : '#D4AF37',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? '#888' : '#000',
                                    cursor: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* YouGlish Player */}
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
                                {youglishPhrase.english.slice(0, 30)}
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
                            <strong>Original:</strong> {youglishPhrase.english}
                        </div>

                        {/* YouGlish Widget */}
                        <div id="yg-widget-phrases" style={{
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

            {/* Edit Phrase Modal */}
            {editingPhrase && (
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
                    onClick={() => setEditingPhrase(null)}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '14px',
                            padding: '20px',
                            maxWidth: '420px',
                            width: '100%'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                            Edit Phrase
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>English</label>
                            <textarea
                                value={editingPhrase.english}
                                onChange={(e) => setEditingPhrase({ ...editingPhrase, english: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Japanese</label>
                            <textarea
                                value={editingPhrase.japanese}
                                onChange={(e) => setEditingPhrase({ ...editingPhrase, japanese: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setEditingPhrase(null)}
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
                                onClick={handleEditPhrase}
                                disabled={editSaving || !editingPhrase.english.trim()}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: !editingPhrase.english.trim() ? '#ccc' : '#3B82F6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    cursor: !editingPhrase.english.trim() ? 'not-allowed' : 'pointer',
                                    color: '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                {editSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
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
