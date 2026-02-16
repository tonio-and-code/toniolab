'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Phrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

// 五芒星: 5 modes
type Mode = 1 | 2 | 3 | 4 | 5;
const MODES: { id: Mode; label: string; instruction: string }[] = [
    { id: 1, label: 'HEAR', instruction: '5回聴く' },
    { id: 2, label: 'SHADOW', instruction: '聴いて真似る' },
    { id: 3, label: 'WRITE', instruction: '書く' },
    { id: 4, label: 'REPEAT', instruction: '暗記して言う' },
    { id: 5, label: 'TRANSLATE', instruction: '日→英' },
];

// Star component for 五芒星
function Star({ filled, size = 20 }: { filled: boolean; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24">
            <polygon
                points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"
                fill={filled ? '#D4AF37' : '#e7e5e4'}
                stroke={filled ? '#B8960C' : '#d6d3d1'}
                strokeWidth="1"
            />
        </svg>
    );
}

export default function MasteryPage() {
    const router = useRouter();
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 五芒星 state: track completed modes per phrase
    const [starProgress, setStarProgress] = useState<Record<string, Mode[]>>({});

    // Review state
    const [reviewIndex, setReviewIndex] = useState(0);
    const [currentMode, setCurrentMode] = useState<Mode>(1);
    const [hearCount, setHearCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        fetch('/api/phrases')
            .then(r => r.json())
            .then(data => {
                if (data.success) setPhrases(data.phrases);
                setIsLoaded(true);
            });
        return () => speechSynthesis.cancel();
    }, []);

    // Group by date
    const phrasesByDate = useMemo(() => {
        const map: Record<string, Phrase[]> = {};
        phrases.forEach(p => {
            const dateKey = p.date.split('T')[0];
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(p);
        });
        return map;
    }, [phrases]);

    // This month's phrases for review (shuffled)
    const reviewList = useMemo(() => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const monthPhrases = phrases.filter(p => {
            const d = new Date(p.date);
            return d >= monthStart && d <= monthEnd;
        });

        // Shuffle
        const seed = currentMonth.getFullYear() * 100 + currentMonth.getMonth();
        return [...monthPhrases].sort((a, b) => {
            const hashA = (a.id.charCodeAt(0) + seed) % 100;
            const hashB = (b.id.charCodeAt(0) + seed) % 100;
            return hashA - hashB;
        });
    }, [phrases, currentMonth]);

    // Calendar helpers
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const startDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const rows = Math.ceil(calendarDays.length / 7);

    const formatDateKey = (day: number) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const today = new Date();
    const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    // Current phrase
    const currentPhrase = reviewList[reviewIndex];
    const currentStars = currentPhrase ? (starProgress[currentPhrase.id] || []) : [];
    const modeInfo = MODES.find(m => m.id === currentMode)!;

    // Play audio
    const playAudio = useCallback((text: string, onEnd?: () => void) => {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        if (onEnd) u.onend = onEnd;
        speechSynthesis.speak(u);
    }, []);

    // HEAR mode: play 5x
    const startHearMode = useCallback(() => {
        if (!currentPhrase || isPlaying) return;
        setIsPlaying(true);

        let count = hearCount;
        const playNext = () => {
            if (count >= 5) {
                setIsPlaying(false);
                return;
            }
            count++;
            setHearCount(count);
            playAudio(currentPhrase.english, () => setTimeout(playNext, 400));
        };
        playNext();
    }, [currentPhrase, isPlaying, hearCount, playAudio]);

    // Complete current mode
    const completeMode = () => {
        if (!currentPhrase) return;

        // Add mode to stars if not already completed
        if (!currentStars.includes(currentMode)) {
            setStarProgress(prev => ({
                ...prev,
                [currentPhrase.id]: [...(prev[currentPhrase.id] || []), currentMode]
            }));
        }

        // Move to next mode or next phrase
        if (currentMode < 5) {
            setCurrentMode((currentMode + 1) as Mode);
            setShowAnswer(false);
            setHearCount(0);
        } else {
            // Completed all 5 modes! Next phrase
            nextPhrase();
        }
    };

    // Next phrase
    const nextPhrase = () => {
        if (reviewIndex < reviewList.length - 1) {
            setReviewIndex(i => i + 1);
        } else {
            // Reshuffle
            setReviewIndex(0);
        }
        setCurrentMode(1);
        setHearCount(0);
        setShowAnswer(false);
    };

    // Shuffle to random phrase
    const shuffle = () => {
        const newIdx = Math.floor(Math.random() * reviewList.length);
        setReviewIndex(newIdx);
        setCurrentMode(1);
        setHearCount(0);
        setShowAnswer(false);
    };

    // Get random phrase for calendar cell
    const getRandomPhrase = useCallback((dateKey: string, dayPhrases: Phrase[]) => {
        if (dayPhrases.length === 0) return null;
        const hash = dateKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return dayPhrases[hash % dayPhrases.length];
    }, []);

    // Check if day is fully mastered (all phrases have 5 stars)
    const isDayMastered = useCallback((dayPhrases: Phrase[]) => {
        if (dayPhrases.length === 0) return false;
        return dayPhrases.every(p => (starProgress[p.id] || []).length >= 5);
    }, [starProgress]);

    // Loading
    if (!isLoaded) {
        return (
            <div style={{ height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '16px', color: '#666' }}
                >
                    &#8249;
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
                        {year}年 {monthNames[month]}
                    </span>
                    <button
                        onClick={() => setCurrentMonth(new Date())}
                        style={{ background: '#D4AF37', border: 'none', color: '#000', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        今日
                    </button>
                </div>
                <button
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '16px', color: '#666' }}
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
                    right: isMobile ? 'auto' : '350px',
                    bottom: isMobile ? 'auto' : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    minHeight: isMobile ? '400px' : 'auto'
                }}>
                    {/* Day Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #eee', flexShrink: 0 }}>
                        {dayNames.map((day, index) => (
                            <div key={day} style={{
                                textAlign: 'center', fontSize: '11px',
                                color: index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : '#666',
                                fontWeight: '600', padding: '8px 0'
                            }}>
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
                            const dayPhrases = phrasesByDate[dateKey] || [];
                            const hasPhrases = dayPhrases.length > 0;
                            const isTodayDate = isToday(day);
                            const dayOfWeek = (startDayOfWeek + day - 1) % 7;
                            const isMastered = isDayMastered(dayPhrases);
                            const randomPhrase = hasPhrases ? getRandomPhrase(dateKey, dayPhrases) : null;
                            const starCount = hasPhrases ? dayPhrases.reduce((sum, p) => sum + (starProgress[p.id] || []).length, 0) : 0;
                            const totalStars = dayPhrases.length * 5;

                            return (
                                <div
                                    key={day}
                                    style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        padding: '6px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: isMastered ? '#D1FAE5' : hasPhrases ? '#FFFBEB' : '#fafafa',
                                        border: isTodayDate ? '2px solid #D4AF37'
                                            : isMastered ? '1px solid #10B981'
                                                : hasPhrases ? '1px solid rgba(212,175,55,0.3)' : '1px solid #f0f0f0'
                                    }}
                                >
                                    {/* Day number */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                        <span style={{
                                            fontSize: '11px', fontWeight: '700',
                                            color: dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#666'
                                        }}>
                                            {day}
                                        </span>
                                        {hasPhrases && (
                                            <span style={{ fontSize: '9px', color: isMastered ? '#10B981' : '#D4AF37', fontWeight: '500' }}>
                                                {starCount}/{totalStars}
                                            </span>
                                        )}
                                    </div>

                                    {/* Phrase preview */}
                                    {hasPhrases && randomPhrase && (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                                            <div style={{
                                                fontSize: '10px', fontWeight: '600', color: '#333', lineHeight: 1.3,
                                                overflow: 'hidden', textOverflow: 'ellipsis',
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                            }}>
                                                {randomPhrase.english}
                                            </div>
                                        </div>
                                    )}

                                    {!hasPhrases && (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => router.push('/english/phrases')}
                                                style={{
                                                    width: '28px', height: '28px', borderRadius: '50%',
                                                    background: 'rgba(212,175,55,0.2)', border: 'none',
                                                    fontSize: '16px', color: '#B8960C', cursor: 'pointer'
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

                {/* Right Panel - 五芒星 Review */}
                <div style={{
                    position: isMobile ? 'relative' : 'absolute',
                    top: isMobile ? 'auto' : 0,
                    right: isMobile ? 'auto' : 0,
                    bottom: isMobile ? 'auto' : 0,
                    width: isMobile ? '100%' : '350px',
                    flexShrink: 0,
                    backgroundColor: '#fafafa',
                    borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    overflowY: 'auto'
                }}>
                    {/* Header */}
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '12px', padding: '14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            今月の復習 ({reviewList.length}フレーズ)
                        </div>
                        {/* 五芒星 Progress */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                            {MODES.map(m => (
                                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                    <Star filled={currentStars.includes(m.id) || currentMode > m.id} size={currentMode === m.id ? 28 : 22} />
                                    <span style={{
                                        fontSize: '8px',
                                        fontWeight: currentMode === m.id ? '700' : '400',
                                        color: currentMode === m.id ? '#D4AF37' : currentStars.includes(m.id) ? '#10b981' : '#a8a29e'
                                    }}>
                                        {m.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Phrase Card */}
                    {currentPhrase ? (
                        <div style={{
                            backgroundColor: '#fff', borderRadius: '16px', padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            {/* Progress */}
                            <div style={{ fontSize: '10px', color: '#888', marginBottom: '8px', textAlign: 'center' }}>
                                {reviewIndex + 1} / {reviewList.length}
                            </div>

                            {/* Current Mode */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '8px 16px', backgroundColor: '#fffbeb', borderRadius: '16px', marginBottom: '16px'
                            }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#92400e' }}>{modeInfo.label}</span>
                                <span style={{ fontSize: '11px', color: '#a8a29e' }}>{modeInfo.instruction}</span>
                            </div>

                            {/* Mode Content */}
                            {currentMode === 1 && (
                                <>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', textAlign: 'center' }}>
                                        {currentPhrase.english}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
                                        {currentPhrase.japanese}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                                        <button
                                            onClick={startHearMode}
                                            disabled={isPlaying || hearCount >= 5}
                                            style={{
                                                width: '60px', height: '60px', borderRadius: '50%',
                                                backgroundColor: hearCount >= 5 ? '#10b981' : '#D4AF37',
                                                border: 'none', cursor: isPlaying || hearCount >= 5 ? 'default' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            {hearCount >= 5 ? (
                                                <span style={{ fontSize: '24px', color: '#fff' }}>✓</span>
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: '700', color: hearCount >= 5 ? '#10b981' : '#D4AF37' }}>
                                        {hearCount}/5
                                    </div>
                                </>
                            )}

                            {currentMode === 2 && (
                                <>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', textAlign: 'center' }}>
                                        {currentPhrase.english}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
                                        {currentPhrase.japanese}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => playAudio(currentPhrase.english)}
                                            style={{
                                                padding: '14px 28px', backgroundColor: '#D4AF37', color: '#fff',
                                                border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                                            }}
                                        >
                                            聴いて真似る
                                        </button>
                                    </div>
                                </>
                            )}

                            {currentMode === 3 && (
                                <>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', textAlign: 'center' }}>
                                        {currentPhrase.english}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
                                        {currentPhrase.japanese}
                                    </div>
                                    <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '12px', textAlign: 'center', fontSize: '14px', color: '#92400e' }}>
                                        紙に書いてください
                                    </div>
                                </>
                            )}

                            {currentMode === 4 && (
                                <>
                                    {!showAnswer ? (
                                        <>
                                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
                                                一度聴いて、暗記して言ってみよう
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => { playAudio(currentPhrase.english); setShowAnswer(true); }}
                                                    style={{
                                                        width: '60px', height: '60px', borderRadius: '50%',
                                                        backgroundColor: '#D4AF37', border: 'none', cursor: 'pointer'
                                                    }}
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: '16px', color: '#D4AF37', fontWeight: '600', textAlign: 'center' }}>
                                            暗記して言えましたか？
                                        </div>
                                    )}
                                </>
                            )}

                            {currentMode === 5 && (
                                <>
                                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#D4AF37', marginBottom: '16px', textAlign: 'center' }}>
                                        {currentPhrase.japanese}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px', textAlign: 'center' }}>
                                        英語で言ってみよう
                                    </div>
                                    {!showAnswer ? (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => setShowAnswer(true)}
                                                style={{
                                                    padding: '12px 24px', backgroundColor: '#fff', color: '#1a1a1a',
                                                    border: '1px solid #e5e5e5', borderRadius: '10px', fontSize: '13px', cursor: 'pointer'
                                                }}
                                            >
                                                答えを見る
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '500', textAlign: 'center' }}>
                                            {currentPhrase.english}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            backgroundColor: '#fff', borderRadius: '12px', padding: '30px',
                            textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{ fontSize: '14px', color: '#888' }}>フレーズがありません</div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {currentPhrase && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={shuffle}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: '1px solid #e5e5e5', backgroundColor: '#fff',
                                    fontSize: '12px', cursor: 'pointer', color: '#666'
                                }}
                            >
                                Shuffle
                            </button>
                            {(currentMode > 1 || hearCount >= 5) && (currentMode === 4 || currentMode === 5 ? showAnswer : true) && (
                                <button
                                    onClick={completeMode}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '8px',
                                        border: 'none', backgroundColor: '#D4AF37', color: '#fff',
                                        fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    {currentMode === 5 ? '完了!' : '次のモード'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
