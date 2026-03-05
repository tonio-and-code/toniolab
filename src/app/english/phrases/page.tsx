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

interface PhraseLink {
    phrase_id: string;
    text: string;
    created_at: string;
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
    'ore-log': { bg: '#FFFBEB', text: '#D4AF37', border: '#F6C85F' },
};

// Mastery level display: 0=未, 1=①, 2=②, 3=済
const getMasteryLabel = (level: MasteryLevel) => {
    switch (level) {
        case 0: return { label: 'NEW', color: '#888', bg: '#f0f0f0', border: '#ddd' };
        case 1: return { label: '①', color: '#D97706', bg: '#FEF3C7', border: '#F59E0B' };
        case 2: return { label: '②', color: '#2563EB', bg: '#DBEAFE', border: '#3B82F6' };
        case 3: return { label: 'CLEAR', color: '#059669', bg: '#D1FAE5', border: '#10B981' };
    }
};

export default function PhrasesPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [phraseMastery, setPhraseMastery] = useState<Record<string, MasteryLevel>>({});
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'review'>('calendar');
    const [searchQuery, setSearchQuery] = useState('');
    const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [reviewFilter, setReviewFilter] = useState<0 | 1 | 2 | 3 | 'all' | 'random' | 'recorded' | 'linked'>('random');
    const [reviewIndex, setReviewIndex] = useState(0);
    const [shuffleKey, setShuffleKey] = useState(0);
    const [voiceRecordings, setVoiceRecordings] = useState<Record<string, VoiceRecording[]>>({});
    const [phraseLinks, setPhraseLinks] = useState<Record<string, PhraseLink[]>>({});

    // Add phrase form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPhrase, setNewPhrase] = useState({ english: '', japanese: '', category: 'daily' });
    const [formDate, setFormDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Quick-add in review mode
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddEnglish, setQuickAddEnglish] = useState('');
    const [quickAddSubmitting, setQuickAddSubmitting] = useState(false);
    const [quickAddedCount, setQuickAddedCount] = useState(0);

    // Daily review counts per month (date -> { count, xp })
    const [monthlyReviewCounts, setMonthlyReviewCounts] = useState<Record<string, { count: number; xp: number }>>({});

    // YouGlish state
    const [youglishPhrase, setYouglishPhrase] = useState<Phrase | null>(null);
    const [youglishQuery, setYouglishQuery] = useState('');
    const [youglishSearched, setYouglishSearched] = useState(false);
    const youglishLoaded = useRef(false);
    const widgetRef = useRef<ReturnType<typeof window.YG.Widget> | null>(null);
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

    // Fetch monthly review counts when month changes
    useEffect(() => {
        const ym = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
        fetch(`/api/review-count?month=${ym}`)
            .then(r => r.json())
            .then(d => { if (d.success) setMonthlyReviewCounts(d.counts || {}); })
            .catch(() => {});
    }, [currentMonth]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [phrasesRes, masteryRes, recordingsRes, linksRes] = await Promise.all([
                    fetch('/api/phrases'),
                    fetch('/api/phrases/mastery'),
                    fetch('/api/voice-recordings'),
                    fetch('/api/phrases/links'),
                ]);
                const phrasesData = await phrasesRes.json();
                const masteryData = await masteryRes.json();
                const recordingsData = await recordingsRes.json();
                const linksData = await linksRes.json();
                if (phrasesData.success) setPhrases(phrasesData.phrases);
                if (masteryData.success) setPhraseMastery(masteryData.mastery || {});
                if (recordingsData.success) setVoiceRecordings(recordingsData.recordings || {});
                if (linksData.success) {
                    const map: Record<string, PhraseLink[]> = {};
                    for (const l of (linksData.links || [])) {
                        if (!map[l.phrase_id]) map[l.phrase_id] = [];
                        map[l.phrase_id].push(l);
                    }
                    setPhraseLinks(map);
                }
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

            widgetRef.current = new window.YG.Widget('yg-widget-phrases', {
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
    // shuffleKey forces re-shuffle on tab switch / mastery change
    const thisMonthReviewPhrases = useMemo(() => {
        void shuffleKey; // dependency trigger
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const monthPhrases = phrases.filter(p => {
            const d = new Date(p.date);
            return d >= monthStart && d <= monthEnd;
        });

        // True random Fisher-Yates shuffle (re-shuffles on every trigger)
        const shuffled = [...monthPhrases];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return {
            level0: shuffled.filter(p => Number(phraseMastery[p.id] || 0) === 0),
            level1: shuffled.filter(p => Number(phraseMastery[p.id] || 0) === 1),
            level2: shuffled.filter(p => Number(phraseMastery[p.id] || 0) === 2),
            level3: shuffled.filter(p => Number(phraseMastery[p.id] || 0) >= 3),
            all: shuffled.filter(p => Number(phraseMastery[p.id] || 0) < 3),
            total: shuffled
        };
    }, [phrases, currentMonth, phraseMastery, shuffleKey]);

    // Separate memo for recorded filter — voiceRecordings changes must NOT reshuffle the list
    const recordedReviewPhrases = useMemo(() => {
        return thisMonthReviewPhrases.total.filter(p => (voiceRecordings[p.id] || []).length > 0);
    }, [thisMonthReviewPhrases.total, voiceRecordings]);

    // Phrases that have linked notes
    const linkedReviewPhrases = useMemo(() => {
        return thisMonthReviewPhrases.total.filter(p => (phraseLinks[p.id] || []).length > 0);
    }, [thisMonthReviewPhrases.total, phraseLinks]);

    // Get current review list based on filter
    const reviewList = useMemo(() => {
        if (reviewFilter === 'all') return thisMonthReviewPhrases.total;
        if (reviewFilter === 'random') return thisMonthReviewPhrases.all;
        if (reviewFilter === 'recorded') return recordedReviewPhrases;
        if (reviewFilter === 'linked') return linkedReviewPhrases;
        return thisMonthReviewPhrases[`level${reviewFilter}` as keyof typeof thisMonthReviewPhrases] as Phrase[];
    }, [thisMonthReviewPhrases, reviewFilter, recordedReviewPhrases, linkedReviewPhrases]);

    // Clamp reviewIndex when reviewList shrinks (e.g. after deletion)
    useEffect(() => {
        if (reviewList.length > 0 && reviewIndex >= reviewList.length) {
            setReviewIndex(reviewList.length - 1);
        }
    }, [reviewList.length, reviewIndex]);

    // Exit review mode on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && viewMode === 'review') setViewMode('calendar');
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [viewMode]);

    // Review content: large version for PC fullscreen, compact for mobile inline
    const isFullReview = viewMode === 'review' && !isMobile;

    const renderReviewContent = () => (
        <>
            {/* Filter Tabs */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: isFullReview ? '20px' : '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: isFullReview ? '15px' : '12px', fontWeight: '600', color: '#333' }}>
                        今月の復習
                    </div>
                    {(() => {
                        const todayKey = new Date().toISOString().split('T')[0];
                        const todayCount = monthlyReviewCounts[todayKey]?.count || 0;
                        return todayCount > 0 ? (
                            <div style={{
                                fontSize: isFullReview ? '13px' : '11px',
                                fontWeight: '600',
                                color: '#D4AF37',
                                backgroundColor: '#FFFBEB',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                border: '1px solid #F6C85F',
                            }}>
                                Today +{todayCount}
                            </div>
                        ) : null;
                    })()}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                        { key: 'all' as const, label: 'ALL', count: thisMonthReviewPhrases.total.length, color: '#666', bg: '#f0f0f0' },
                        { key: 'random' as const, label: 'SHUFFLE', count: thisMonthReviewPhrases.all.length, color: '#D4AF37', bg: '#FFFBEB' },
                        { key: 'recorded' as const, label: 'REC', count: recordedReviewPhrases.length, color: '#DC2626', bg: '#FEF2F2' },
                        { key: 0 as const, label: 'NEW', count: thisMonthReviewPhrases.level0.length, color: '#888', bg: '#f0f0f0' },
                        { key: 1 as const, label: 'x1', count: thisMonthReviewPhrases.level1.length, color: '#D97706', bg: '#FEF3C7' },
                        { key: 2 as const, label: 'x2', count: thisMonthReviewPhrases.level2.length, color: '#2563EB', bg: '#DBEAFE' },
                        { key: 3 as const, label: 'CLEAR', count: thisMonthReviewPhrases.level3.length, color: '#059669', bg: '#D1FAE5' },
                        { key: 'linked' as const, label: 'ADD', count: linkedReviewPhrases.length, color: '#8B5CF6', bg: '#F5F3FF' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setReviewFilter(tab.key); setReviewIndex(0); setShuffleKey(k => k + 1); }}
                            style={{
                                padding: isFullReview ? '8px 16px' : '6px 12px',
                                borderRadius: '6px',
                                border: reviewFilter === tab.key ? '2px solid #D4AF37' : '1px solid #ddd',
                                fontSize: isFullReview ? '14px' : '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backgroundColor: reviewFilter === tab.key ? '#FFFBEB' : tab.bg,
                                color: tab.color,
                            }}
                        >
                            {tab.label} {tab.count}
                        </button>
                    ))}
                </div>
            </div>

            {/* Review Card */}
            {reviewList.length > 0 ? (
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    padding: isFullReview ? '48px 40px' : '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                    {/* Progress */}
                    <div style={{ fontSize: isFullReview ? '14px' : '10px', color: '#888', marginBottom: isFullReview ? '28px' : '12px', textAlign: 'center' }}>
                        {reviewIndex + 1} / {reviewList.length}
                    </div>

                    {/* English */}
                    <div style={{
                        fontSize: isFullReview ? '32px' : '16px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        marginBottom: isFullReview ? '16px' : '10px',
                        lineHeight: 1.5,
                        textAlign: 'center',
                    }}>
                        {reviewList[reviewIndex]?.english}
                    </div>

                    {/* Japanese */}
                    <div style={{
                        fontSize: isFullReview ? '20px' : '13px',
                        color: '#666',
                        marginBottom: reviewList[reviewIndex]?.source_id ? (isFullReview ? '16px' : '8px') : (isFullReview ? '40px' : '16px'),
                        textAlign: 'center',
                    }}>
                        {reviewList[reviewIndex]?.japanese}
                    </div>

                    {/* Linked notes on this card */}
                    {reviewList[reviewIndex] && (phraseLinks[reviewList[reviewIndex].id] || []).length > 0 && (
                        <div style={{
                            padding: isFullReview ? '16px' : '10px',
                            backgroundColor: '#F5F3FF',
                            borderRadius: '10px',
                            border: '1px solid #E9E5FF',
                            marginBottom: isFullReview ? '24px' : '12px',
                        }}>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: '#8B5CF6', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                ADD ({phraseLinks[reviewList[reviewIndex].id].length})
                            </div>
                            {phraseLinks[reviewList[reviewIndex].id].map((link, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '6px 0',
                                    borderBottom: '1px solid #EDE9FE',
                                    fontSize: isFullReview ? '14px' : '12px',
                                    color: '#5B21B6',
                                }}>
                                    <span>{link.text}</span>
                                    <button
                                        onClick={() => {
                                            window.speechSynthesis.cancel();
                                            const u = new SpeechSynthesisUtterance(link.text);
                                            u.lang = 'en-US';
                                            u.rate = 0.9;
                                            const v = voices.find(v => v.name.includes('Google US English')) || voices[0];
                                            if (v) u.voice = v;
                                            window.speechSynthesis.speak(u);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Play + Voice Recorder */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isFullReview ? '20px' : '12px', marginBottom: isFullReview ? '32px' : '16px' }}>
                        <button
                            onClick={() => reviewList[reviewIndex] && playPhrase(reviewList[reviewIndex])}
                            style={{
                                width: isFullReview ? '72px' : '50px',
                                height: isFullReview ? '72px' : '50px',
                                borderRadius: '50%',
                                backgroundColor: playingPhraseId === reviewList[reviewIndex]?.id ? '#D4AF37' : '#f5f5f5',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg width={isFullReview ? '28' : '20'} height={isFullReview ? '28' : '20'} viewBox="0 0 24 24" fill={playingPhraseId === reviewList[reviewIndex]?.id ? '#fff' : '#666'}>
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
                                        [reviewList[reviewIndex].id]: [recording, ...(prev[reviewList[reviewIndex].id] || [])],
                                    }));
                                }}
                                onRecordingDelete={(id) => {
                                    setVoiceRecordings(prev => ({
                                        ...prev,
                                        [reviewList[reviewIndex].id]: (prev[reviewList[reviewIndex].id] || []).filter(r => r.id !== id),
                                    }));
                                }}
                            />
                        )}
                    </div>

                    {/* Mastery */}
                    {reviewList[reviewIndex] && (() => {
                        const mastery = phraseMastery[reviewList[reviewIndex].id] || 0;
                        const masteryInfo = getMasteryLabel(mastery);
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isFullReview ? '28px' : '16px' }}>
                                <button
                                    onClick={() => cycleMastery(reviewList[reviewIndex].id)}
                                    style={{
                                        padding: isFullReview ? '12px 32px' : '8px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: masteryInfo.bg,
                                        color: masteryInfo.color,
                                        fontSize: isFullReview ? '16px' : '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {masteryInfo.label}
                                </button>
                            </div>
                        );
                    })()}

                    {/* Delete */}
                    {reviewList[reviewIndex] && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isFullReview ? '24px' : '12px' }}>
                            <button
                                onClick={() => handleDeletePhrase(reviewList[reviewIndex].id)}
                                style={{
                                    background: '#FEF2F2',
                                    border: '1px solid #FECACA',
                                    color: '#EF4444',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                            >
                                Del
                            </button>
                        </div>
                    )}

                    {/* Quick Add */}
                    {reviewList[reviewIndex] && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isFullReview ? '16px' : '8px' }}>
                            <button
                                onClick={() => setShowQuickAdd(!showQuickAdd)}
                                style={{
                                    padding: isFullReview ? '8px 20px' : '6px 14px',
                                    borderRadius: '8px',
                                    border: showQuickAdd ? '2px solid #D4AF37' : '1px solid #ddd',
                                    backgroundColor: showQuickAdd ? '#FFFBEB' : '#fff',
                                    color: showQuickAdd ? '#D4AF37' : '#888',
                                    fontSize: isFullReview ? '13px' : '11px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                {showQuickAdd ? 'Close' : '+ Add'}
                                {quickAddedCount > 0 && !showQuickAdd && (
                                    <span style={{ marginLeft: '6px', color: '#D4AF37' }}>({quickAddedCount})</span>
                                )}
                            </button>
                        </div>
                    )}
                    {showQuickAdd && reviewList[reviewIndex] && (
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            maxWidth: isFullReview ? '400px' : 'none',
                            margin: '0 auto',
                            width: '100%',
                            marginBottom: isFullReview ? '24px' : '12px',
                        }}>
                            <input
                                type="text"
                                value={quickAddEnglish}
                                onChange={e => setQuickAddEnglish(e.target.value)}
                                placeholder="new phrase..."
                                autoFocus
                                onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(); }}
                                style={{
                                    flex: 1,
                                    padding: isFullReview ? '10px 14px' : '8px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: isFullReview ? '14px' : '13px',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleQuickAdd}
                                disabled={quickAddSubmitting || !quickAddEnglish.trim()}
                                style={{
                                    padding: isFullReview ? '10px 20px' : '8px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: quickAddSubmitting || !quickAddEnglish.trim() ? '#ddd' : '#D4AF37',
                                    color: quickAddSubmitting || !quickAddEnglish.trim() ? '#999' : '#000',
                                    fontSize: isFullReview ? '13px' : '12px',
                                    fontWeight: '600',
                                    cursor: quickAddSubmitting || !quickAddEnglish.trim() ? 'not-allowed' : 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {quickAddSubmitting ? '...' : 'Save'}
                            </button>
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: 'flex', gap: '10px', maxWidth: isFullReview ? '400px' : 'none', margin: '0 auto', width: '100%' }}>
                        <button
                            onClick={() => setReviewIndex(i => (i - 1 + reviewList.length) % reviewList.length)}
                            style={{
                                flex: 1,
                                padding: isFullReview ? '16px' : '10px',
                                borderRadius: '10px',
                                border: '1px solid #e5e5e5',
                                backgroundColor: '#fff',
                                fontSize: isFullReview ? '15px' : '12px',
                                cursor: 'pointer',
                                color: '#666',
                            }}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setReviewIndex(i => (i + 1) % reviewList.length)}
                            style={{
                                flex: 1,
                                padding: isFullReview ? '16px' : '10px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: '#D4AF37',
                                color: '#fff',
                                fontSize: isFullReview ? '15px' : '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '30px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}>
                    <div style={{ fontSize: '14px', color: '#888' }}>
                        復習するフレーズがありません
                    </div>
                </div>
            )}
        </>
    );

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
        setShuffleKey(k => k + 1);

        // Count level-ups (0->1, 1->2, 2->3) but not resets (3->0)
        if (next > 0) {
            const todayKey = new Date().toISOString().split('T')[0];
            fetch('/api/review-count', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: todayKey, xp: 0 })
            })
                .then(r => r.json())
                .then(d => {
                    if (d.success) {
                        setMonthlyReviewCounts(prev => ({ ...prev, [todayKey]: { count: d.count, xp: d.xp } }));
                    }
                })
                .catch(() => {});
        }

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
    const selectedPhrases = selectedPhrasesAll;




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

    const handleQuickAdd = async () => {
        const phraseId = reviewList[reviewIndex]?.id;
        if (!quickAddEnglish.trim() || !phraseId) return;
        setQuickAddSubmitting(true);
        try {
            const res = await fetch('/api/phrases/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phrase_id: phraseId, text: quickAddEnglish.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setPhraseLinks(prev => ({
                    ...prev,
                    [phraseId]: [...(prev[phraseId] || []), data.link],
                }));
                setQuickAddEnglish('');
                setQuickAddedCount(c => c + 1);
            }
        } finally {
            setQuickAddSubmitting(false);
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
                        <>
                            {!isMobile && (
                                <button
                                    onClick={() => { setViewMode('review'); setShuffleKey(k => k + 1); }}
                                    style={{
                                        background: '#FFFBEB',
                                        border: '2px solid #D4AF37',
                                        borderRadius: '8px',
                                        padding: '7px 14px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#92400E',
                                    }}
                                >
                                    復習
                                </button>
                            )}
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
                        </>
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
            {viewMode === 'review' ? (
                /* Full-screen Review View */
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: isMobile ? '16px' : '48px 24px',
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '780px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}>
                        {renderReviewContent()}
                    </div>
                </div>
            ) : viewMode === 'list' ? (
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
                        {/* View Toggle + Filter Tabs */}
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
                            gap: '0px',
                            padding: '0px',
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
                                        recorded: allDayPhrases.filter(p => (voiceRecordings[p.id] || []).length > 0).length,
                                    };

                                    const total = allDayPhrases.length;
                                    const barNew = total > 0 ? countByLevel.level1Plus / total : 0;
                                    const barX1 = total > 0 ? countByLevel.level2Plus / total : 0;
                                    const barX2 = total > 0 ? countByLevel.level3 / total : 0;
                                    const barRec = total > 0 ? countByLevel.recorded / total : 0;
                                    const allCleared = total > 0 && countByLevel.level3 === total;

                                    // Color system: "learning temperature" metaphor
                                    // met(blue/cold) → rep(amber/warming) → own(green/go!) + rec(red/REC light)
                                    // Normal: soft pastel  →  Complete: medium-saturated (not harsh)
                                    const barData = [
                                        { fill: barNew, label: 'met', color: barNew >= 1 ? '#B8D8F0' : '#E8F0F8' },
                                        { fill: barX1, label: 'rep', color: barX1 >= 1 ? '#F0DEB8' : '#F8F0E0' },
                                        { fill: barX2, label: 'own', color: barX2 >= 1 ? '#B0E0C4' : '#E0F4E8' },
                                        { fill: barRec, label: 'rec', color: barRec >= 1 ? '#F0BABA' : '#F8E4E4' },
                                    ];

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => hasAnyPhrases && setSelectedDate(dateKey)}
                                            onMouseEnter={(e) => {
                                                if (hasAnyPhrases) {
                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
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
                                                padding: '4px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                backgroundColor: '#fafafa',
                                                border: isTodayDate
                                                    ? '2px solid #D4AF37'
                                                    : hasAnyPhrases ? '1px solid #e5e5e5' : '1px solid #f0f0f0',
                                                transition: 'transform 0.15s, box-shadow 0.15s'
                                            }}
                                        >
                                                {/* Day number */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: '600',
                                                        color: dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#aaa',
                                                        lineHeight: 1
                                                    }}>
                                                        {day}
                                                    </span>
                                                </div>

                                                {/* Bars + background number */}
                                                {hasAnyPhrases && (
                                                    <div style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        gap: '0px',
                                                        marginTop: '3px',
                                                        minHeight: '28px',
                                                        position: 'relative'
                                                    }}>
                                                        {/* Background: phrase count + review count */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            pointerEvents: 'none',
                                                            gap: '0px',
                                                        }}>
                                                            <span style={{
                                                                fontSize: '28px',
                                                                fontWeight: '900',
                                                                color: 'rgba(0,0,0,0.07)',
                                                                lineHeight: 1,
                                                            }}>
                                                                {total}
                                                            </span>
                                                            {(monthlyReviewCounts[dateKey]?.count || 0) > 0 && (
                                                                <span style={{
                                                                    fontSize: '14px',
                                                                    fontWeight: '800',
                                                                    color: '#D4AF37',
                                                                    lineHeight: 1,
                                                                    marginTop: '2px',
                                                                    opacity: 0.85,
                                                                }}>
                                                                    +{monthlyReviewCounts[dateKey]?.count}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {barData.map((bar, i) => (
                                                            <div key={i} style={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '1px'
                                                            }}>
                                                                <div style={{
                                                                    flex: 1,
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'flex-end',
                                                                    borderRadius: '2px',
                                                                    backgroundColor: '#F0EFEC',
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    <div style={{
                                                                        height: `${bar.fill * 100}%`,
                                                                        backgroundColor: bar.color,
                                                                        borderRadius: '2px',
                                                                        transition: 'height 0.3s ease-out',
                                                                        minHeight: bar.fill > 0 ? '2px' : '0px'
                                                                    }} />
                                                                </div>
                                                                <span style={{
                                                                    fontSize: '7px',
                                                                    fontWeight: '700',
                                                                    color: bar.color,
                                                                    textAlign: 'center',
                                                                    lineHeight: 1,
                                                                    textTransform: 'uppercase'
                                                                }}>
                                                                    {bar.label}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Empty cell: Just + button */}
                                                {!hasAnyPhrases && (
                                                    <div style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
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
                                                                width: '22px',
                                                                height: '22px',
                                                                borderRadius: '50%',
                                                                background: 'rgba(212,175,55,0.2)',
                                                                border: 'none',
                                                                fontSize: '14px',
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
                            /* No date selected: summary + review */
                            isMobile ? (
                                <>{renderReviewContent()}</>
                            ) : (
                                <>
                                    {/* Monthly Summary */}
                                    <div style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                    }}>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>
                                            {year}年{monthNames[month]} サマリー
                                        </div>
                                        {/* Total + today */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                                                    {thisMonthReviewPhrases.total.length}
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#888' }}>Total</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
                                                    {thisMonthReviewPhrases.level3.length}
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#888' }}>CLEAR</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#3B82F6' }}>
                                                    {(() => {
                                                        const todayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                                        return (phrasesByDate[todayKey] || []).length;
                                                    })()}
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#888' }}>Today</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#D97706' }}>
                                                    {recordedReviewPhrases.length}
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#888' }}>REC</div>
                                            </div>
                                        </div>
                                        {/* Mastery progress bar */}
                                        {thisMonthReviewPhrases.total.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                height: '8px',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                backgroundColor: '#f0f0f0',
                                            }}>
                                                {thisMonthReviewPhrases.level3.length > 0 && (
                                                    <div style={{
                                                        width: `${(thisMonthReviewPhrases.level3.length / thisMonthReviewPhrases.total.length) * 100}%`,
                                                        backgroundColor: '#10B981',
                                                    }} />
                                                )}
                                                {thisMonthReviewPhrases.level2.length > 0 && (
                                                    <div style={{
                                                        width: `${(thisMonthReviewPhrases.level2.length / thisMonthReviewPhrases.total.length) * 100}%`,
                                                        backgroundColor: '#3B82F6',
                                                    }} />
                                                )}
                                                {thisMonthReviewPhrases.level1.length > 0 && (
                                                    <div style={{
                                                        width: `${(thisMonthReviewPhrases.level1.length / thisMonthReviewPhrases.total.length) * 100}%`,
                                                        backgroundColor: '#F59E0B',
                                                    }} />
                                                )}
                                            </div>
                                        )}
                                        {/* Legend */}
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                                            {[
                                                { label: 'NEW', count: thisMonthReviewPhrases.level0.length, color: '#888' },
                                                { label: 'x1', count: thisMonthReviewPhrases.level1.length, color: '#D97706' },
                                                { label: 'x2', count: thisMonthReviewPhrases.level2.length, color: '#2563EB' },
                                                { label: 'CLEAR', count: thisMonthReviewPhrases.level3.length, color: '#059669' },
                                            ].map(item => (
                                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                                                    <span style={{ color: '#666' }}>{item.label}</span>
                                                    <span style={{ fontWeight: '600', color: item.color }}>{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Review Cards */}
                                    {renderReviewContent()}
                                </>
                            )
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
