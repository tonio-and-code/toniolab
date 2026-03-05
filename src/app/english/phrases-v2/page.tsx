'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import VoiceRecorder from '@/components/VoiceRecorder';
import { DAY_PROLOGUES } from '@/data/english/day-prologues';

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

type MasteryLevel = 0 | 1 | 2 | 3;

// ─── V2 Inline Components ─────────────────────────────────

const MasteryDots = ({ level, size = 6, gap = 3, onClick }: { level: MasteryLevel; size?: number; gap?: number; onClick?: () => void }) => {
    const gold = '#D4AF37';
    const emerald = '#10B981';
    const hollow = '#D6D3D1';
    return (
        <span
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap,
                cursor: onClick ? 'pointer' : 'default',
                padding: onClick ? '4px' : 0,
                borderRadius: '6px',
            }}
            title={`Mastery: ${level}/3`}
        >
            {[0, 1, 2].map(i => {
                const filled = i < level;
                const color = level === 3 ? emerald : gold;
                return (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            backgroundColor: filled ? color : 'transparent',
                            border: filled ? `1.5px solid ${color}` : `1.5px solid ${hollow}`,
                            transition: 'all 0.2s ease',
                        }}
                    />
                );
            })}
        </span>
    );
};

const FilterDotGraphic = ({ pattern }: { pattern: [boolean, boolean, boolean] }) => {
    const gold = '#D4AF37';
    const hollow = '#D6D3D1';
    return (
        <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
            {pattern.map((filled, i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-block',
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        backgroundColor: filled ? gold : 'transparent',
                        border: filled ? `1px solid ${gold}` : `1px solid ${hollow}`,
                    }}
                />
            ))}
        </span>
    );
};

// Mini progress bar for scenario pills
const MiniBar = ({ progress, complete }: { progress: number; complete: boolean }) => (
    <div style={{
        width: '100%',
        height: '3px',
        backgroundColor: '#E7E5E4',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '4px'
    }}>
        <div style={{
            height: '100%',
            width: `${progress * 100}%`,
            backgroundColor: complete ? '#10B981' : '#D4AF37',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
        }} />
    </div>
);

interface ScenarioGroup {
    key: string;
    title: string;
    titleJa: string;
    setting: string;
    characters: { name: string; desc: string }[];
    dates: string[];
    phrases: Phrase[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'daily': { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    'business': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'casual': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'idiom': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'slang': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
};

export default function PhrasesV2Page() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [phraseMastery, setPhraseMastery] = useState<Record<string, MasteryLevel>>({});
    const [isMobile, setIsMobile] = useState(false);
    const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voiceRecordings, setVoiceRecordings] = useState<Record<string, VoiceRecording[]>>({});

    // Navigation state
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null); // null = "All" mode
    const [masteryFilter, setMasteryFilter] = useState<0 | 1 | 2 | 'all'>('all');
    const [reviewIndex, setReviewIndex] = useState(0);
    const [showPhraseList, setShowPhraseList] = useState(false);
    const [showScenarioInfo, setShowScenarioInfo] = useState(false);

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

    const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

    // ─── Effects ───────────────────────────────────────────

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

        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
            setVoices(enVoices);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => window.speechSynthesis.cancel();
    }, []);

    useEffect(() => {
        if (youglishLoaded.current) return;
        const script = document.createElement('script');
        script.src = 'https://youglish.com/public/emb/widget.js';
        script.async = true;
        document.body.appendChild(script);
        youglishLoaded.current = true;
    }, []);

    // ─── Scenario grouping ────────────────────────────────

    const scenarioGroups = useMemo((): ScenarioGroup[] => {
        const prologueDates = Object.keys(DAY_PROLOGUES).sort();
        const groups: ScenarioGroup[] = [];

        for (const startDate of prologueDates) {
            const prologue = DAY_PROLOGUES[startDate];
            const start = new Date(startDate);
            const dates: string[] = [];
            for (let i = 0; i < 5; i++) {
                const d = new Date(start);
                d.setDate(d.getDate() + i);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                dates.push(`${yyyy}-${mm}-${dd}`);
            }

            const scenarioPhrases = phrases.filter(p => dates.includes(p.date.split('T')[0]));
            if (scenarioPhrases.length > 0) {
                groups.push({
                    key: startDate,
                    title: prologue.title,
                    titleJa: prologue.titleJa,
                    setting: prologue.settingJa,
                    characters: prologue.characters,
                    dates,
                    phrases: scenarioPhrases,
                });
            }
        }
        return groups;
    }, [phrases]);

    // Current review list based on scenario + mastery filter
    const reviewList = useMemo(() => {
        let pool: Phrase[];
        if (selectedScenario === null) {
            // "All" mode: all unmastered phrases, shuffled
            pool = phrases.filter(p => Number(phraseMastery[p.id] || 0) < 3);
            // Seeded shuffle
            const seed = 2026 * 100 + new Date().getMonth();
            const mulberry32 = (s: number) => () => {
                s |= 0; s = s + 0x6D2B79F5 | 0;
                let t = Math.imul(s ^ s >>> 15, 1 | s);
                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                return ((t ^ t >>> 14) >>> 0) / 4294967296;
            };
            const hashId = (id: string) => {
                let h = 0;
                for (let i = 0; i < id.length; i++) h = Math.imul(31, h) + id.charCodeAt(i) | 0;
                return h;
            };
            const rng = mulberry32(seed + hashId(pool.map(p => p.id).join('')));
            const shuffled = [...pool];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(rng() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            pool = shuffled;
        } else {
            const group = scenarioGroups.find(g => g.key === selectedScenario);
            pool = group ? group.phrases : [];
        }

        // Apply mastery filter
        if (masteryFilter === 'all') {
            return pool.filter(p => Number(phraseMastery[p.id] || 0) < 3);
        }
        return pool.filter(p => Number(phraseMastery[p.id] || 0) === masteryFilter);
    }, [phrases, phraseMastery, selectedScenario, scenarioGroups, masteryFilter]);

    // Clamp reviewIndex
    useEffect(() => {
        if (reviewList.length > 0 && reviewIndex >= reviewList.length) {
            setReviewIndex(reviewList.length - 1);
        }
    }, [reviewList.length, reviewIndex]);

    // Reset index when switching scenario or filter
    useEffect(() => {
        setReviewIndex(0);
    }, [selectedScenario, masteryFilter]);

    // ─── Keyboard shortcuts ───────────────────────────────

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (reviewList.length === 0) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setReviewIndex(i => (i - 1 + reviewList.length) % reviewList.length);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setReviewIndex(i => (i + 1) % reviewList.length);
            } else if (e.key === ' ') {
                e.preventDefault();
                if (reviewList[reviewIndex]) {
                    handleMark(reviewList[reviewIndex].id);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [reviewList, reviewIndex]);

    // ─── Handlers ─────────────────────────────────────────

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

    const handleMark = useCallback((phraseId: string) => {
        cycleMastery(phraseId);
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = setTimeout(() => {
            setReviewIndex(i => (i + 1) % Math.max(1, reviewList.length));
        }, 400);
    }, [cycleMastery, reviewList.length]);

    const getMarkLabel = (level: MasteryLevel) => {
        switch (level) {
            case 0: return '1回目';
            case 1: return '2回目';
            case 2: return '完了';
            case 3: return '1回目';
        }
    };

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
        if (!window.YG) { alert('YouGlish is still loading.'); return; }
        setYouglishSearched(true);
        setCaptionHistory([]);
        currentVideoRef.current = { videoId: '', timestamp: 0 };
        setTimeout(() => {
            const container = document.getElementById('yg-widget-phrases-v2');
            if (container) container.innerHTML = '';
            widgetRef.current = new window.YG.Widget('yg-widget-phrases-v2', {
                width: 400, components: 255,
                events: {
                    onFetchDone: () => {},
                    onVideoChange: (event: any) => {
                        const videoId = event.video || event.videoId || '';
                        const start = event.start || 0;
                        if (videoId) { currentVideoRef.current = { videoId, timestamp: start }; setCaptionHistory([]); }
                    },
                    onCaptionChange: (event: { caption: string }) => {
                        let caption = event.caption;
                        try { caption = decodeURIComponent(caption); } catch {}
                        caption = caption.replace(/\[\[\[/g, '').replace(/\]\]\]/g, '');
                        setCaptionHistory(prev => {
                            if (prev.length === 0 || prev[prev.length - 1].text !== caption) return [...prev, { text: caption, selected: true }];
                            return prev;
                        });
                    }
                }
            });
            widgetRef.current.fetch(youglishQuery.trim(), 'english');
        }, 50);
    };

    const saveSelectedCaptions = async () => {
        const sel = captionHistory.filter(c => c.selected);
        if (sel.length === 0) return;
        setSavingPhrase(true);
        try {
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ english: sel.map(c => c.text).join(' '), japanese: `(${youglishPhrase?.english.slice(0, 30) || 'YouGlish'})`, category: 'YouGlish', date: youglishSaveDate })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.phrase) setPhrases(prev => [...prev, data.phrase]);
                alert('Saved!');
                setCaptionHistory([]);
            }
        } catch (err) { console.error(err); }
        finally { setSavingPhrase(false); }
    };

    const handleEditPhrase = async () => {
        if (!editingPhrase || !editingPhrase.english.trim()) return;
        setEditSaving(true);
        try {
            const res = await fetch(`/api/phrases/${editingPhrase.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ english: editingPhrase.english.trim(), japanese: editingPhrase.japanese.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setPhrases(prev => prev.map(p => p.id === editingPhrase.id ? { ...p, english: editingPhrase.english.trim(), japanese: editingPhrase.japanese.trim() } : p));
                setEditingPhrase(null);
            } else { alert(data.error || 'Failed to update'); }
        } catch { alert('Error updating phrase'); }
        finally { setEditSaving(false); }
    };

    const handleDeletePhrase = async (id: string) => {
        if (!confirm('Delete this phrase?')) return;
        try {
            const res = await fetch(`/api/phrases/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) setPhrases(prev => prev.filter(p => p.id !== id));
        } catch (error) { console.error('Error deleting phrase:', error); }
    };

    const handleAddPhrase = async () => {
        if (!newPhrase.english.trim() || !newPhrase.japanese.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ english: newPhrase.english.trim(), japanese: newPhrase.japanese.trim(), category: newPhrase.category, date: formDate }),
            });
            const data = await res.json();
            if (data.success) { setPhrases(prev => [...prev, data.phrase]); setNewPhrase({ english: '', japanese: '', category: 'daily' }); setShowAddForm(false); }
        } finally { setIsSubmitting(false); }
    };

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
                body: JSON.stringify({ phrase: vocabWord.trim(), type: vocabType, meaning: vocabMeaning.trim(), example: vocabExample, source: 'Phrases', date: vocabDate }),
            });
            const data = await res.json();
            if (data.success) { setShowVocabModal(false); setVocabWord(''); setVocabMeaning(''); setVocabExample(''); alert('Saved!'); }
            else { alert(data.error || 'Failed to save'); }
        } catch { alert('Error saving vocabulary'); }
        finally { setVocabSaving(false); }
    };

    // YouGlish drag
    const handleDragStart = (e: React.MouseEvent) => {
        if (playerFullscreen) return;
        setIsDragging(true);
        dragOffset.current = { x: e.clientX - playerPosition.x, y: e.clientY - playerPosition.y };
    };
    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (playerFullscreen) return;
        setIsResizing(true);
        dragOffset.current = { x: e.clientX, y: e.clientY };
    };
    const toggleFullscreen = () => { setPlayerFullscreen(!playerFullscreen); setPlayerMinimized(false); };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) setPlayerPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
            if (isResizing) {
                const deltaX = e.clientX - dragOffset.current.x;
                const deltaY = e.clientY - dragOffset.current.y;
                setPlayerSize(prev => ({ width: Math.max(300, prev.width + deltaX), height: Math.max(300, prev.height + deltaY) }));
                dragOffset.current = { x: e.clientX, y: e.clientY };
            }
        };
        const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    }, [isDragging, isResizing]);

    // ─── Computed ─────────────────────────────────────────

    const currentScenario = selectedScenario ? scenarioGroups.find(g => g.key === selectedScenario) : null;

    const totalRemaining = phrases.filter(p => Number(phraseMastery[p.id] || 0) < 3).length;
    const totalCleared = phrases.filter(p => Number(phraseMastery[p.id] || 0) >= 3).length;

    const getScenarioProgress = (group: ScenarioGroup) => {
        const cleared = group.phrases.filter(p => Number(phraseMastery[p.id] || 0) >= 3).length;
        return { cleared, total: group.phrases.length, progress: group.phrases.length > 0 ? cleared / group.phrases.length : 0 };
    };

    const currentPhrase = reviewList[reviewIndex] || null;

    // ─── Render ───────────────────────────────────────────

    if (loading) {
        return (
            <div style={{ height: '100%', backgroundColor: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8A29E' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#FAFAF9',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* ─── Header ─── */}
            <div style={{
                padding: '10px 16px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E7E5E4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917' }}>Phrases</span>
                    <span style={{ fontSize: '12px', color: '#A8A29E' }}>
                        {totalRemaining} remaining / {totalCleared} clear
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        onClick={() => setShowPhraseList(!showPhraseList)}
                        style={{
                            background: showPhraseList ? '#D4AF37' : '#F5F5F4',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: showPhraseList ? '#fff' : '#57534E'
                        }}
                    >
                        List
                    </button>
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
                            color: '#fff'
                        }}
                    >
                        + Add
                    </button>
                </div>
            </div>

            {/* ─── Scenario Pills ─── */}
            <div style={{
                display: 'flex',
                gap: '6px',
                padding: '10px 16px',
                borderBottom: '1px solid #F5F5F4',
                backgroundColor: '#FFFFFF',
                overflowX: 'auto',
                flexShrink: 0
            }}>
                {/* "All" pill */}
                <button
                    onClick={() => setSelectedScenario(null)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: selectedScenario === null ? '700' : '500',
                        cursor: 'pointer',
                        backgroundColor: selectedScenario === null ? '#1C1917' : '#F5F5F4',
                        color: selectedScenario === null ? '#FFFFFF' : '#57534E',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        transition: 'all 0.15s'
                    }}
                >
                    All ({totalRemaining})
                </button>

                {scenarioGroups.map(group => {
                    const stats = getScenarioProgress(group);
                    const active = selectedScenario === group.key;
                    const remaining = stats.total - stats.cleared;
                    return (
                        <button
                            key={group.key}
                            onClick={() => setSelectedScenario(group.key)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '20px',
                                border: active ? '2px solid #D4AF37' : '1px solid #E7E5E4',
                                fontSize: '11px',
                                fontWeight: active ? '600' : '400',
                                cursor: 'pointer',
                                backgroundColor: active ? '#FFFDF5' : '#FFFFFF',
                                color: active ? '#1C1917' : '#57534E',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                minWidth: '80px',
                                transition: 'all 0.15s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '2px'
                            }}
                        >
                            <span>{group.title.length > 18 ? group.title.slice(0, 18) + '...' : group.title}</span>
                            <span style={{ fontSize: '9px', color: stats.progress === 1 ? '#10B981' : '#A8A29E' }}>
                                {remaining === 0 ? 'clear' : `${remaining} left`}
                            </span>
                            <MiniBar progress={stats.progress} complete={stats.progress === 1} />
                        </button>
                    );
                })}
            </div>

            {/* ─── Mastery Filter ─── */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '8px 12px',
                borderBottom: '1px solid #F5F5F4',
                backgroundColor: '#FFFFFF',
                flexShrink: 0
            }}>
                <div style={{
                    display: 'inline-flex',
                    backgroundColor: '#F5F5F4',
                    borderRadius: '10px',
                    padding: '3px',
                    gap: '2px'
                }}>
                    {[
                        { key: 'all' as const, label: `All ${reviewList.length}`, dot: null },
                        { key: 0 as const, label: null, dot: [false, false, false] as [boolean, boolean, boolean] },
                        { key: 1 as const, label: null, dot: [true, false, false] as [boolean, boolean, boolean] },
                        { key: 2 as const, label: null, dot: [true, true, false] as [boolean, boolean, boolean] },
                    ].map(seg => {
                        const active = masteryFilter === seg.key;
                        return (
                            <button
                                key={String(seg.key)}
                                onClick={() => setMasteryFilter(seg.key)}
                                style={{
                                    padding: '5px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '11px',
                                    fontWeight: active ? '600' : '400',
                                    cursor: 'pointer',
                                    backgroundColor: active ? '#FFFFFF' : 'transparent',
                                    color: active ? '#1C1917' : '#A8A29E',
                                    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                {seg.label}
                                {seg.dot && <FilterDotGraphic pattern={seg.dot} />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── Main Area ─── */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: showPhraseList ? 'flex-start' : 'center',
                padding: '20px 16px',
                gap: '16px'
            }}>
                {/* Scenario info (collapsible) */}
                {currentScenario && (
                    <div style={{
                        width: '100%',
                        maxWidth: '520px',
                    }}>
                        <button
                            onClick={() => setShowScenarioInfo(!showScenarioInfo)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 0',
                                width: '100%'
                            }}
                        >
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1C1917' }}>
                                {currentScenario.title}
                            </span>
                            <span style={{ fontSize: '11px', color: '#A8A29E' }}>
                                {currentScenario.titleJa}
                            </span>
                            <span style={{ fontSize: '10px', color: '#D6D3D1', marginLeft: 'auto' }}>
                                {showScenarioInfo ? '▲' : '▼'}
                            </span>
                        </button>
                        {showScenarioInfo && (
                            <div style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '10px',
                                padding: '14px',
                                marginTop: '6px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                fontSize: '12px',
                                color: '#57534E',
                                lineHeight: 1.6
                            }}>
                                <div style={{ marginBottom: '10px' }}>{currentScenario.setting}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {currentScenario.characters.map((c, i) => (
                                        <span key={i} style={{
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            backgroundColor: '#F5F5F4',
                                            color: '#57534E'
                                        }}>
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Flashcard or Phrase List ─── */}
                {showPhraseList ? (
                    /* Phrase List Mode */
                    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {reviewList.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#A8A29E', padding: '40px', fontSize: '14px' }}>
                                No phrases to review
                            </div>
                        ) : reviewList.map((phrase, idx) => {
                            const mastery = (phraseMastery[phrase.id] || 0) as MasteryLevel;
                            const isActive = idx === reviewIndex;
                            return (
                                <div
                                    key={phrase.id}
                                    onClick={() => { setReviewIndex(idx); setShowPhraseList(false); }}
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '10px',
                                        padding: '12px 14px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                        border: isActive ? '1.5px solid #D4AF37' : '1px solid #F5F5F4',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'border-color 0.15s'
                                    }}
                                >
                                    <MasteryDots level={mastery} onClick={(e) => { (e as any)?.stopPropagation?.(); cycleMastery(phrase.id); }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1C1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {phrase.english}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#57534E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {phrase.japanese}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '9px', color: '#6B7280' }}>{phrase.category}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Flashcard Mode */
                    reviewList.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            color: '#A8A29E',
                            padding: '40px',
                        }}>
                            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                                {selectedScenario ? 'This scenario is clear' : 'No phrases to review'}
                            </div>
                            <div style={{ fontSize: '12px' }}>
                                {selectedScenario ? 'All phrases mastered' : 'Add some phrases to get started'}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            maxWidth: '480px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: isMobile ? '24px 20px' : '32px 28px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            {/* Mastery dots */}
                            {currentPhrase && (
                                <div style={{ marginBottom: '20px' }}>
                                    <MasteryDots
                                        level={(phraseMastery[currentPhrase.id] || 0) as MasteryLevel}
                                        size={10}
                                        gap={5}
                                    />
                                </div>
                            )}

                            {/* English */}
                            <div style={{
                                fontSize: isMobile ? '18px' : '22px',
                                fontWeight: '600',
                                color: '#1C1917',
                                marginBottom: '10px',
                                lineHeight: 1.4,
                                textAlign: 'center',
                                width: '100%'
                            }}>
                                {currentPhrase?.english}
                            </div>

                            {/* Japanese */}
                            <div style={{
                                fontSize: '13px',
                                color: '#57534E',
                                marginBottom: '24px',
                                textAlign: 'center'
                            }}>
                                {currentPhrase?.japanese}
                            </div>

                            {/* Play + Voice */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <button
                                    onClick={() => currentPhrase && playPhrase(currentPhrase)}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: playingPhraseId === currentPhrase?.id ? '#D4AF37' : '#F5F5F4',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.15s'
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill={playingPhraseId === currentPhrase?.id ? '#fff' : '#57534E'}>
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                                {currentPhrase && (
                                    <VoiceRecorder
                                        phraseId={currentPhrase.id}
                                        recordings={voiceRecordings[currentPhrase.id] || []}
                                        onRecordingComplete={(recording) => {
                                            setVoiceRecordings(prev => ({
                                                ...prev,
                                                [currentPhrase.id]: [recording, ...(prev[currentPhrase.id] || [])]
                                            }));
                                        }}
                                        onRecordingDelete={(id) => {
                                            setVoiceRecordings(prev => ({
                                                ...prev,
                                                [currentPhrase.id]: (prev[currentPhrase.id] || []).filter(r => r.id !== id)
                                            }));
                                        }}
                                    />
                                )}
                            </div>

                            {/* Mark Button */}
                            {currentPhrase && (
                                <button
                                    onClick={() => handleMark(currentPhrase.id)}
                                    style={{
                                        padding: '12px 36px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        backgroundColor: '#D4AF37',
                                        color: '#fff',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginBottom: '8px',
                                        transition: 'transform 0.1s',
                                    }}
                                    onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                                    onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    {getMarkLabel((phraseMastery[currentPhrase.id] || 0) as MasteryLevel)}
                                </button>
                            )}

                            {/* Tools row */}
                            {currentPhrase && (
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', marginTop: '4px' }}>
                                    <button
                                        onClick={() => playYouGlish(currentPhrase)}
                                        style={{ background: '#F5F5F4', border: 'none', color: '#57534E', fontSize: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                    >
                                        YG
                                    </button>
                                    <button
                                        onClick={() => openVocabModal(currentPhrase.english)}
                                        style={{ background: 'none', border: '1px solid #10B981', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '10px', color: '#10B981', fontWeight: '600' }}
                                    >
                                        +Vocab
                                    </button>
                                    <button
                                        onClick={() => setEditingPhrase({ id: currentPhrase.id, english: currentPhrase.english, japanese: currentPhrase.japanese })}
                                        style={{ background: 'none', border: 'none', color: '#A8A29E', fontSize: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePhrase(currentPhrase.id)}
                                        style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                    >
                                        Del
                                    </button>
                                </div>
                            )}

                            {/* Nav buttons */}
                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                <button
                                    onClick={() => setReviewIndex(i => (i - 1 + reviewList.length) % reviewList.length)}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: '8px',
                                        border: '1px solid #E7E5E4', backgroundColor: '#FFFFFF',
                                        fontSize: '12px', cursor: 'pointer', color: '#57534E'
                                    }}
                                >
                                    ← Prev
                                </button>
                                <button
                                    onClick={() => setReviewIndex(i => (i + 1) % reviewList.length)}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: '8px',
                                        border: 'none', backgroundColor: '#D4AF37',
                                        color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    Next →
                                </button>
                            </div>

                            {/* Progress */}
                            <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '12px' }}>
                                {reviewIndex + 1} / {reviewList.length}
                            </div>

                            {/* Keyboard hint */}
                            <div style={{ fontSize: '10px', color: '#D6D3D1', marginTop: '8px' }}>
                                ← → navigate / space = mark
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* ─── Modals ─── */}

            {/* Add Phrase Modal */}
            {showAddForm && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowAddForm(false)}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1C1917' }}>Add New Phrase</h2>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#A8A29E', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Date</label>
                            <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E7E5E4', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#A8A29E', fontWeight: '500', display: 'block', marginBottom: '6px' }}>English</label>
                            <input type="text" value={newPhrase.english} onChange={(e) => setNewPhrase(prev => ({ ...prev, english: e.target.value }))} placeholder="Enter English phrase" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E7E5E4', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#A8A29E', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Japanese</label>
                            <input type="text" value={newPhrase.japanese} onChange={(e) => setNewPhrase(prev => ({ ...prev, japanese: e.target.value }))} placeholder="日本語訳を入力" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E7E5E4', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', color: '#A8A29E', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Category</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {Object.keys(CATEGORY_COLORS).map(cat => (
                                    <button key={cat} type="button" onClick={() => setNewPhrase(prev => ({ ...prev, category: cat }))} style={{ padding: '8px 14px', borderRadius: '8px', border: newPhrase.category === cat ? `2px solid ${CATEGORY_COLORS[cat].text}` : `1px solid ${CATEGORY_COLORS[cat].border}`, backgroundColor: CATEGORY_COLORS[cat].bg, color: CATEGORY_COLORS[cat].text, fontSize: '13px', fontWeight: newPhrase.category === cat ? '600' : '400', cursor: 'pointer' }}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E7E5E4', backgroundColor: '#FFFFFF', fontSize: '14px', cursor: 'pointer', color: '#57534E' }}>Cancel</button>
                            <button onClick={handleAddPhrase} disabled={isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim()} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? '#E7E5E4' : '#D4AF37', fontSize: '14px', fontWeight: '600', color: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? '#A8A29E' : '#fff', cursor: isSubmitting || !newPhrase.english.trim() || !newPhrase.japanese.trim() ? 'not-allowed' : 'pointer' }}>
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Phrase Modal */}
            {editingPhrase && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setEditingPhrase(null)}>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '20px', maxWidth: '420px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1C1917' }}>Edit Phrase</div>
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#A8A29E', marginBottom: '4px' }}>English</label>
                            <textarea value={editingPhrase.english} onChange={(e) => setEditingPhrase({ ...editingPhrase, english: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#A8A29E', marginBottom: '4px' }}>Japanese</label>
                            <textarea value={editingPhrase.japanese} onChange={(e) => setEditingPhrase({ ...editingPhrase, japanese: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setEditingPhrase(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#FAFAF9', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: '#57534E' }}>Cancel</button>
                            <button onClick={handleEditPhrase} disabled={editSaving || !editingPhrase.english.trim()} style={{ flex: 1, padding: '12px', backgroundColor: !editingPhrase.english.trim() ? '#D6D3D1' : '#3B82F6', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: !editingPhrase.english.trim() ? 'not-allowed' : 'pointer', color: '#fff', fontWeight: '600' }}>
                                {editSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vocabulary Save Modal */}
            {showVocabModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002, padding: '20px' }}>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1C1917' }}>Save to Vocabulary</h3>
                            <button onClick={() => setShowVocabModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#A8A29E' }}>x</button>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#A8A29E', marginBottom: '6px' }}>Example</label>
                            <div style={{ padding: '12px', backgroundColor: '#FAFAF9', borderRadius: '8px', fontSize: '14px', color: '#57534E' }}>{vocabExample}</div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#A8A29E', marginBottom: '6px' }}>Date</label>
                            <input type="date" value={vocabDate} onChange={(e) => setVocabDate(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#A8A29E', marginBottom: '6px' }}>Word / Phrase *</label>
                            <input type="text" value={vocabWord} onChange={(e) => setVocabWord(e.target.value)} placeholder="e.g., rabbit hole" style={{ width: '100%', padding: '12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#A8A29E', marginBottom: '6px' }}>Type</label>
                            <select value={vocabType} onChange={(e) => setVocabType(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }}>
                                <option value="word">Word</option>
                                <option value="idiom">Idiom</option>
                                <option value="phrasal verb">Phrasal Verb</option>
                                <option value="slang">Slang</option>
                                <option value="expression">Expression</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#A8A29E', marginBottom: '6px' }}>Meaning (JP) *</label>
                            <input type="text" value={vocabMeaning} onChange={(e) => setVocabMeaning(e.target.value)} placeholder="e.g., 深みにはまる" style={{ width: '100%', padding: '12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowVocabModal(false)} style={{ flex: 1, padding: '14px', backgroundColor: '#FAFAF9', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', color: '#57534E' }}>Cancel</button>
                            <button onClick={saveToVocabulary} disabled={vocabSaving || !vocabWord.trim() || !vocabMeaning.trim()} style={{ flex: 1, padding: '14px', backgroundColor: (!vocabWord.trim() || !vocabMeaning.trim()) ? '#D6D3D1' : '#10B981', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: (!vocabWord.trim() || !vocabMeaning.trim()) ? 'not-allowed' : 'pointer', color: '#fff', fontWeight: '600' }}>
                                {vocabSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* YouGlish Player */}
            {youglishPhrase && (
                <div style={{ position: 'fixed', left: playerFullscreen ? 0 : playerPosition.x, top: playerFullscreen ? 0 : playerPosition.y, width: playerFullscreen ? '100vw' : playerMinimized ? '200px' : playerSize.width, height: playerFullscreen ? '100vh' : playerMinimized ? 'auto' : playerSize.height, backgroundColor: '#FFFFFF', borderRadius: playerFullscreen ? 0 : '12px', boxShadow: playerFullscreen ? 'none' : '0 4px 20px rgba(0,0,0,0.2)', zIndex: 1001, overflow: 'hidden', userSelect: (isDragging || isResizing) ? 'none' : 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div onMouseDown={handleDragStart} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #E7E5E4', backgroundColor: '#1C1917', cursor: playerFullscreen ? 'default' : isDragging ? 'grabbing' : 'grab', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {!playerFullscreen && <span style={{ color: '#57534E', fontSize: '10px' }}>:::::</span>}
                            <span style={{ fontWeight: '600', fontSize: '12px', color: '#fff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{youglishPhrase.english.slice(0, 30)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={(e) => { e.stopPropagation(); setPlayerMinimized(!playerMinimized); setPlayerFullscreen(false); }} style={{ background: '#444', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>_</button>
                            <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} style={{ background: playerFullscreen ? '#10B981' : '#444', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>{playerFullscreen ? '[]' : '[ ]'}</button>
                            <button onClick={(e) => { e.stopPropagation(); setYouglishPhrase(null); setCaptionHistory([]); setPlayerFullscreen(false); }} style={{ background: '#dc2626', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>X</button>
                        </div>
                    </div>
                    {!playerMinimized && (
                        <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" value={youglishQuery} onChange={(e) => setYouglishQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchYouGlish()} placeholder="Search word" style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #E7E5E4', fontSize: '14px', outline: 'none' }} />
                                <button onClick={searchYouGlish} disabled={!youglishQuery.trim()} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: youglishQuery.trim() ? '#D4AF37' : '#E7E5E4', color: youglishQuery.trim() ? '#fff' : '#A8A29E', fontSize: '13px', fontWeight: '600', cursor: youglishQuery.trim() ? 'pointer' : 'not-allowed' }}>Search</button>
                            </div>
                            <div style={{ fontSize: '11px', color: '#A8A29E', padding: '8px', backgroundColor: '#FAFAF9', borderRadius: '6px' }}><strong>Original:</strong> {youglishPhrase.english}</div>
                            <div id="yg-widget-phrases-v2" style={{ minHeight: '200px', backgroundColor: '#FAFAF9', borderRadius: '8px', display: youglishSearched ? 'block' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {!youglishSearched && <span style={{ color: '#A8A29E', fontSize: '13px' }}>Enter a keyword to search</span>}
                            </div>
                            {captionHistory.length > 0 && (
                                <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                    <div style={{ fontSize: '11px', color: '#57534E', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Captions ({captionHistory.filter(c => c.selected).length}/{captionHistory.length}):</span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: true })))} style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '10px', cursor: 'pointer' }}>All</button>
                                            <button onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: false })))} style={{ background: 'none', border: 'none', color: '#A8A29E', fontSize: '10px', cursor: 'pointer' }}>None</button>
                                            <button onClick={() => setCaptionHistory([])} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '10px', cursor: 'pointer' }}>Clear</button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '11px', maxHeight: '100px', overflowY: 'auto', padding: '6px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #E7E5E4', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                                        {captionHistory.map((c, idx) => (
                                            <span key={idx} onClick={() => setCaptionHistory(prev => prev.map((x, i) => i === idx ? { ...x, selected: !x.selected } : x))} style={{ padding: '3px 6px', borderRadius: '3px', backgroundColor: c.selected ? '#dcfce7' : '#F5F5F4', color: c.selected ? '#166534' : '#A8A29E', cursor: 'pointer', border: c.selected ? '1px solid #86efac' : '1px solid #E7E5E4', textDecoration: c.selected ? 'none' : 'line-through' }}>{c.text}</span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                                        <input type="date" value={youglishSaveDate} onChange={(e) => setYouglishSaveDate(e.target.value)} style={{ flex: '0 0 auto', padding: '8px', borderRadius: '6px', border: '1px solid #E7E5E4', fontSize: '12px' }} />
                                        <button onClick={saveSelectedCaptions} disabled={savingPhrase || captionHistory.filter(c => c.selected).length === 0} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: captionHistory.filter(c => c.selected).length === 0 ? '#E7E5E4' : '#D4AF37', color: captionHistory.filter(c => c.selected).length === 0 ? '#A8A29E' : '#fff', fontSize: '12px', fontWeight: '600', cursor: savingPhrase || captionHistory.filter(c => c.selected).length === 0 ? 'not-allowed' : 'pointer' }}>
                                            {savingPhrase ? 'Saving...' : 'Add to phrases'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {!playerFullscreen && !playerMinimized && (
                        <div onMouseDown={handleResizeStart} style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', cursor: 'se-resize', background: 'linear-gradient(135deg, transparent 50%, #D6D3D1 50%)', borderRadius: '0 0 12px 0' }} />
                    )}
                </div>
            )}
        </div>
    );
}
