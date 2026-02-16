'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
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

interface ReviewStats {
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    todayReviewed: number;
    lastReviewDate: string;
}

const STORAGE_KEY = 'phrases_review_stats_v2';

const loadStats = (): ReviewStats => {
    if (typeof window === 'undefined') return { totalXP: 0, currentStreak: 0, longestStreak: 0, todayReviewed: 0, lastReviewDate: '' };
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return { totalXP: 0, currentStreak: 0, longestStreak: 0, todayReviewed: 0, lastReviewDate: '' };
};

const saveStats = (stats: ReviewStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// XP rewards
const XP_REWARDS = {
    review: 10,      // Base XP for reviewing
    levelUp: 25,     // Bonus for leveling up a phrase
    complete: 50,    // Bonus for completing a phrase (level 3)
    dailyGoal: 100,  // Bonus for completing daily goal
    streak: 20,      // Bonus per streak day
};

export default function PhrasesPageV2() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [phraseMastery, setPhraseMastery] = useState<Record<string, MasteryLevel>>({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReviewStats>(loadStats);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voiceRecordings, setVoiceRecordings] = useState<Record<string, VoiceRecording[]>>({});

    // Session state
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionQueue, setSessionQueue] = useState<Phrase[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [sessionXP, setSessionXP] = useState(0);
    const [sessionReviewed, setSessionReviewed] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationMessage, setCelebrationMessage] = useState('');
    const [xpPopup, setXpPopup] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false });

    // Daily goal
    const DAILY_GOAL = 10;

    // Check and update streak
    useEffect(() => {
        const today = getTodayStr();
        const yesterday = getYesterdayStr();

        if (stats.lastReviewDate !== today) {
            // New day - check if streak continues
            if (stats.lastReviewDate === yesterday) {
                // Continue streak
                setStats(prev => ({ ...prev, todayReviewed: 0 }));
            } else if (stats.lastReviewDate && stats.lastReviewDate !== today) {
                // Streak broken
                setStats(prev => ({ ...prev, currentStreak: 0, todayReviewed: 0 }));
            }
        }
    }, [stats.lastReviewDate]);

    useEffect(() => {
        saveStats(stats);
    }, [stats]);

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
            setVoices(allVoices.filter(v => v.lang.startsWith('en')));
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => window.speechSynthesis.cancel();
    }, []);

    // Calculate phrases due for review (spaced repetition logic)
    const dueForReview = useMemo(() => {
        const now = new Date();
        return phrases.filter(p => {
            const level = phraseMastery[p.id] || 0;
            if (level >= 3) return false; // Already mastered

            // Simple spaced repetition: review based on level
            // Level 0: Always due
            // Level 1: Due after 1 day
            // Level 2: Due after 3 days
            const addedDate = new Date(p.date);
            const daysSinceAdded = Math.floor((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24));

            if (level === 0) return true;
            if (level === 1) return daysSinceAdded >= 1;
            if (level === 2) return daysSinceAdded >= 3;
            return false;
        });
    }, [phrases, phraseMastery]);

    // Stats calculations
    const totalPhrases = phrases.length;
    const masteredPhrases = phrases.filter(p => (phraseMastery[p.id] || 0) >= 3).length;
    const masteryPercent = totalPhrases > 0 ? Math.round((masteredPhrases / totalPhrases) * 100) : 0;
    const dailyProgress = Math.min(100, (stats.todayReviewed / DAILY_GOAL) * 100);

    // Start review session
    const startSession = (mode: 'due' | 'all' | 'new') => {
        let queue: Phrase[] = [];

        if (mode === 'due') {
            queue = [...dueForReview];
        } else if (mode === 'new') {
            queue = phrases.filter(p => (phraseMastery[p.id] || 0) === 0);
        } else {
            queue = phrases.filter(p => (phraseMastery[p.id] || 0) < 3);
        }

        // Shuffle
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }

        // Limit to reasonable session size
        queue = queue.slice(0, 20);

        setSessionQueue(queue);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSessionXP(0);
        setSessionReviewed(0);
        setSessionActive(true);
    };

    const playPhrase = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;
        window.speechSynthesis.speak(utterance);
    };

    const showXPPopup = (amount: number) => {
        setXpPopup({ amount, visible: true });
        setTimeout(() => setXpPopup({ amount: 0, visible: false }), 1000);
    };

    const triggerCelebration = (message: string) => {
        setCelebrationMessage(message);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2500);
    };

    const handleRating = async (rating: 'again' | 'good' | 'easy') => {
        if (!sessionQueue[currentCardIndex]) return;

        const phrase = sessionQueue[currentCardIndex];
        const currentLevel = phraseMastery[phrase.id] || 0;
        let newLevel: MasteryLevel;
        let xpEarned = XP_REWARDS.review;

        if (rating === 'again') {
            newLevel = Math.max(0, currentLevel - 1) as MasteryLevel;
        } else if (rating === 'good') {
            newLevel = Math.min(3, currentLevel + 1) as MasteryLevel;
            xpEarned += XP_REWARDS.levelUp;
        } else { // easy
            newLevel = Math.min(3, currentLevel + 2) as MasteryLevel;
            xpEarned += XP_REWARDS.levelUp * 2;
        }

        // Bonus for completing
        if (newLevel === 3 && currentLevel < 3) {
            xpEarned += XP_REWARDS.complete;
            triggerCelebration('Mastered!');
        }

        // Update mastery
        setPhraseMastery(prev => ({ ...prev, [phrase.id]: newLevel }));

        // Save to API
        try {
            await fetch('/api/phrases/mastery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phraseId: phrase.id, level: newLevel })
            });
        } catch (err) {
            console.error('Failed to save mastery:', err);
        }

        // Update session stats
        setSessionXP(prev => prev + xpEarned);
        setSessionReviewed(prev => prev + 1);
        showXPPopup(xpEarned);

        // Update global stats
        const today = getTodayStr();
        setStats(prev => {
            const newTodayReviewed = prev.lastReviewDate === today ? prev.todayReviewed + 1 : 1;
            const newStreak = prev.lastReviewDate === today ? prev.currentStreak :
                             (prev.lastReviewDate === getYesterdayStr() ? prev.currentStreak + 1 : 1);

            // Check for daily goal completion
            if (newTodayReviewed === DAILY_GOAL && prev.todayReviewed < DAILY_GOAL) {
                triggerCelebration(`Daily Goal Complete! +${XP_REWARDS.dailyGoal} XP`);
                return {
                    ...prev,
                    totalXP: prev.totalXP + xpEarned + XP_REWARDS.dailyGoal,
                    currentStreak: newStreak,
                    longestStreak: Math.max(prev.longestStreak, newStreak),
                    todayReviewed: newTodayReviewed,
                    lastReviewDate: today
                };
            }

            return {
                ...prev,
                totalXP: prev.totalXP + xpEarned,
                currentStreak: newStreak,
                longestStreak: Math.max(prev.longestStreak, newStreak),
                todayReviewed: newTodayReviewed,
                lastReviewDate: today
            };
        });

        // Move to next card
        if (currentCardIndex < sessionQueue.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setShowAnswer(false);
        } else {
            // Session complete
            triggerCelebration(`Session Complete! +${sessionXP + xpEarned} XP`);
            setTimeout(() => setSessionActive(false), 2000);
        }
    };

    // Calculate level from XP
    const getLevel = (xp: number) => {
        const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
        for (let i = levels.length - 1; i >= 0; i--) {
            if (xp >= levels[i]) return { level: i + 1, current: xp - levels[i], next: (levels[i + 1] || levels[i] + 1000) - levels[i] };
        }
        return { level: 1, current: xp, next: 100 };
    };

    const levelInfo = getLevel(stats.totalXP);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#888' }}>Loading...</div>
            </div>
        );
    }

    // Session view
    if (sessionActive && sessionQueue.length > 0) {
        const currentPhrase = sessionQueue[currentCardIndex];
        const currentLevel = phraseMastery[currentPhrase.id] || 0;
        const progress = ((currentCardIndex + 1) / sessionQueue.length) * 100;

        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0f0f0f',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* XP Popup */}
                {xpPopup.visible && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#FFD700',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                        animation: 'fadeUp 1s ease-out',
                        pointerEvents: 'none',
                        zIndex: 100
                    }}>
                        +{xpPopup.amount} XP
                    </div>
                )}

                {/* Celebration */}
                {showCelebration && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 200
                    }}>
                        <div style={{
                            textAlign: 'center',
                            animation: 'pulse 0.5s ease-in-out'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                                {celebrationMessage.includes('Mastered') ? '***' : '***'}
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700' }}>
                                {celebrationMessage}
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #222',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={() => setSessionActive(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Exit Session
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>+{sessionXP} XP</span>
                        <span style={{ color: '#888' }}>{currentCardIndex + 1} / {sessionQueue.length}</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '4px', backgroundColor: '#222' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: '#10B981',
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                {/* Card area */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}>
                    {/* Card */}
                    <div
                        onClick={() => {
                            if (!showAnswer) {
                                setShowAnswer(true);
                                playPhrase(currentPhrase.english);
                            }
                        }}
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            minHeight: '280px',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '20px',
                            padding: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: !showAnswer ? 'pointer' : 'default',
                            border: '1px solid #333',
                            transition: 'transform 0.2s ease',
                            position: 'relative'
                        }}
                    >
                        {/* Level indicator */}
                        <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: currentLevel === 0 ? '#333' : currentLevel === 1 ? '#854d0e' : currentLevel === 2 ? '#1e40af' : '#166534',
                            color: '#fff'
                        }}>
                            {currentLevel === 0 ? 'NEW' : currentLevel === 1 ? 'LV.1' : currentLevel === 2 ? 'LV.2' : 'MASTERED'}
                        </div>

                        {!showAnswer ? (
                            <>
                                <div style={{
                                    fontSize: '16px',
                                    color: '#666',
                                    marginBottom: '24px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px'
                                }}>
                                    Tap to reveal
                                </div>
                                <div style={{
                                    fontSize: '20px',
                                    color: '#fff',
                                    textAlign: 'center',
                                    lineHeight: '1.6'
                                }}>
                                    {currentPhrase.japanese}
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#888',
                                    marginBottom: '16px'
                                }}>
                                    {currentPhrase.japanese}
                                </div>
                                <div style={{
                                    fontSize: '24px',
                                    color: '#fff',
                                    textAlign: 'center',
                                    lineHeight: '1.6',
                                    fontWeight: '500'
                                }}>
                                    {currentPhrase.english}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playPhrase(currentPhrase.english);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: '1px solid #444',
                                            borderRadius: '50%',
                                            width: '48px',
                                            height: '48px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: '#B8960C'
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                    <VoiceRecorder
                                        phraseId={currentPhrase.id}
                                        recordings={voiceRecordings[currentPhrase.id] || []}
                                        onRecordingComplete={(recording) => {
                                            setVoiceRecordings(prev => ({
                                                ...prev,
                                                [currentPhrase.id]: [recording]
                                            }));
                                        }}
                                        onRecordingDelete={() => {
                                            setVoiceRecordings(prev => ({
                                                ...prev,
                                                [currentPhrase.id]: []
                                            }));
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Rating buttons */}
                    {showAnswer && (
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            marginTop: '32px',
                            width: '100%',
                            maxWidth: '500px'
                        }}>
                            <button
                                onClick={() => handleRating('again')}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    backgroundColor: '#dc2626',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Again
                                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>+{XP_REWARDS.review} XP</div>
                            </button>
                            <button
                                onClick={() => handleRating('good')}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    backgroundColor: '#16a34a',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Good
                                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>+{XP_REWARDS.review + XP_REWARDS.levelUp} XP</div>
                            </button>
                            <button
                                onClick={() => handleRating('easy')}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    backgroundColor: '#2563eb',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Easy
                                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>+{XP_REWARDS.review + XP_REWARDS.levelUp * 2} XP</div>
                            </button>
                        </div>
                    )}
                </div>

                <style jsx global>{`
                    @keyframes fadeUp {
                        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        to { opacity: 0; transform: translate(-50%, -100%) scale(1.2); }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `}</style>
            </div>
        );
    }

    // Main dashboard view
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff' }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #222',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link href="/english" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
                    ← Back
                </Link>
                <Link href="/english/phrases" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>
                    Classic View
                </Link>
            </div>

            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Level & XP Bar */}
                <div style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    border: '1px solid #222'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                            <span style={{
                                backgroundColor: '#B8960C',
                                color: '#000',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}>
                                Level {levelInfo.level}
                            </span>
                        </div>
                        <div style={{ color: '#FFD700', fontWeight: 'bold' }}>
                            {stats.totalXP.toLocaleString()} XP
                        </div>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${(levelInfo.current / levelInfo.next) * 100}%`,
                            backgroundColor: '#B8960C',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '8px',
                        textAlign: 'right'
                    }}>
                        {levelInfo.current} / {levelInfo.next} to Level {levelInfo.level + 1}
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    {/* Streak */}
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid #222'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: stats.currentStreak > 0 ? '#f97316' : '#444' }}>
                            {stats.currentStreak}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Day Streak
                        </div>
                    </div>

                    {/* Today */}
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid #222'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: stats.todayReviewed >= DAILY_GOAL ? '#10B981' : '#fff' }}>
                            {stats.todayReviewed}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Today
                        </div>
                    </div>

                    {/* Mastered */}
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid #222'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>
                            {masteredPhrases}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Mastered
                        </div>
                    </div>
                </div>

                {/* Daily Goal Progress */}
                <div style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px',
                    border: '1px solid #222'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Daily Goal</span>
                        <span style={{ fontSize: '14px', color: '#888' }}>
                            {stats.todayReviewed} / {DAILY_GOAL}
                        </span>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#333', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${dailyProgress}%`,
                            backgroundColor: dailyProgress >= 100 ? '#10B981' : '#3B82F6',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    {dailyProgress >= 100 && (
                        <div style={{
                            fontSize: '12px',
                            color: '#10B981',
                            marginTop: '8px',
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            Goal Complete! Keep going!
                        </div>
                    )}
                </div>

                {/* Review Actions */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{
                        fontSize: '13px',
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '12px'
                    }}>
                        Start Review
                    </h2>

                    {/* Due for review - primary action */}
                    <button
                        onClick={() => startSession('due')}
                        disabled={dueForReview.length === 0}
                        style={{
                            width: '100%',
                            padding: '20px',
                            backgroundColor: dueForReview.length > 0 ? '#B8960C' : '#333',
                            border: 'none',
                            borderRadius: '16px',
                            color: dueForReview.length > 0 ? '#000' : '#666',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: dueForReview.length > 0 ? 'pointer' : 'not-allowed',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>&#9658;</span>
                        <span>
                            {dueForReview.length > 0
                                ? `Review Now (${dueForReview.length} due)`
                                : 'No phrases due'
                            }
                        </span>
                    </button>

                    {/* Secondary options */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button
                            onClick={() => startSession('new')}
                            disabled={phrases.filter(p => (phraseMastery[p.id] || 0) === 0).length === 0}
                            style={{
                                padding: '16px',
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #333',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            New Only
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {phrases.filter(p => (phraseMastery[p.id] || 0) === 0).length} phrases
                            </div>
                        </button>
                        <button
                            onClick={() => startSession('all')}
                            disabled={phrases.filter(p => (phraseMastery[p.id] || 0) < 3).length === 0}
                            style={{
                                padding: '16px',
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #333',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            All Cards
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {phrases.filter(p => (phraseMastery[p.id] || 0) < 3).length} phrases
                            </div>
                        </button>
                    </div>
                </div>

                {/* Progress Overview */}
                <div style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #222'
                }}>
                    <h2 style={{
                        fontSize: '13px',
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '16px'
                    }}>
                        Progress Overview
                    </h2>

                    {/* Progress ring */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#333"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 42 * masteryPercent / 100} ${2 * Math.PI * 42}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{masteryPercent}%</div>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                                    <span style={{ color: '#888' }}>Mastered</span>
                                    <span>{masteredPhrases}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                                    <span style={{ color: '#888' }}>Learning</span>
                                    <span>{phrases.filter(p => { const l = phraseMastery[p.id] || 0; return l > 0 && l < 3; }).length}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#888' }}>New</span>
                                    <span>{phrases.filter(p => (phraseMastery[p.id] || 0) === 0).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Best streak */}
                {stats.longestStreak > 0 && (
                    <div style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        border: '1px solid #222',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '13px', color: '#888' }}>Best Streak</span>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f97316' }}>
                            {stats.longestStreak} days
                        </span>
                    </div>
                )}
            </div>

            <div style={{ height: '100px' }} />
        </div>
    );
}
