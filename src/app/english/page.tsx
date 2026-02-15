'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { listeningContents } from '@/data/english-listening';

interface Phrase {
    id: string;
    english: string;
    japanese: string;
    date: string;
}

interface Vocabulary {
    id: string;
    phrase: string;
    created_at: string;
}

interface MasteryData {
    [phraseId: string]: number;
}

interface LearningStats {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    streak: number;
    longestStreak: number;
}

interface LearningTimeRecord {
    date: string;
    minutes: number;
}

interface DailyGoals {
    minutes_goal: number;
    phrases_goal: number;
    vocab_goal: number;
}

export default function EnglishDashboard() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
    const [mastery, setMastery] = useState<MasteryData>({});
    const [learningStats, setLearningStats] = useState<LearningStats>({ today: 0, thisWeek: 0, thisMonth: 0, total: 0, streak: 0, longestStreak: 0 });
    const [learningRecords, setLearningRecords] = useState<LearningTimeRecord[]>([]);
    const [dailyGoals, setDailyGoals] = useState<DailyGoals>({ minutes_goal: 150, phrases_goal: 20, vocab_goal: 15 });
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showTimeInput, setShowTimeInput] = useState(false);
    const [showGoalEdit, setShowGoalEdit] = useState(false);
    const [timeInput, setTimeInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [goalInputs, setGoalInputs] = useState({ minutes: '', phrases: '', vocab: '' });
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setDateInput(todayStr);

        Promise.all([
            fetch('/api/phrases').then(r => r.json()),
            fetch('/api/phrases/mastery').then(r => r.json()),
            fetch('/api/user-phrases').then(r => r.json()),
            fetch('/api/learning-time?stats=true').then(r => r.json()),
            fetch('/api/learning-time').then(r => r.json()),
            fetch('/api/daily-goals').then(r => r.json()),
        ]).then(([phrasesData, masteryData, vocabData, learningData, recordsData, goalsData]) => {
            if (phrasesData.success) setPhrases(phrasesData.phrases || []);
            if (masteryData.success) setMastery(masteryData.mastery || {});
            if (vocabData.success) setVocabulary(vocabData.phrases || []);
            if (learningData.success && learningData.stats) setLearningStats(learningData.stats);
            if (recordsData.success) setLearningRecords(recordsData.records || []);
            if (goalsData.success && goalsData.goals) setDailyGoals(goalsData.goals);
        }).finally(() => setIsLoading(false));
    }, []);

    const handleAddTime = async () => {
        const minutes = parseInt(timeInput);
        if (isNaN(minutes) || minutes <= 0 || !dateInput) return;

        setIsSaving(true);

        try {
            const res = await fetch('/api/learning-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateInput, minutes, mode: 'add' }),
            });
            const data = await res.json();
            if (data.success) {
                if (data.stats) setLearningStats(data.stats);
                // Update records
                const recordsRes = await fetch('/api/learning-time');
                const recordsData = await recordsRes.json();
                if (recordsData.success) setLearningRecords(recordsData.records || []);
            }
            setTimeInput('');
            setShowTimeInput(false);
        } catch (error) {
            console.error('Failed to save learning time:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const formatTime = (minutes: number) => {
        return `${minutes} min`;
    };

    const handleSaveGoals = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/daily-goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    minutes_goal: goalInputs.minutes ? parseInt(goalInputs.minutes) : dailyGoals.minutes_goal,
                    phrases_goal: goalInputs.phrases ? parseInt(goalInputs.phrases) : dailyGoals.phrases_goal,
                    vocab_goal: goalInputs.vocab ? parseInt(goalInputs.vocab) : dailyGoals.vocab_goal,
                }),
            });
            const data = await res.json();
            if (data.success && data.goals) {
                setDailyGoals(data.goals);
            }
            setShowGoalEdit(false);
            setGoalInputs({ minutes: '', phrases: '', vocab: '' });
        } catch (error) {
            console.error('Failed to save goals:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate stats
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Today's progress
    const todayMinutes = learningStats.today;
    const todayPhrasesCount = phrases.filter(p => p.date === todayStr).length;
    const todayVocabCount = vocabulary.filter(v => v.created_at?.startsWith(todayStr)).length;

    // This week's progress (for weekly goals)
    const weekMinutes = learningStats.thisWeek;
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const weekPhrasesCount = phrases.filter(p => weekDates.includes(p.date)).length;
    const weekVocabCount = vocabulary.filter(v => weekDates.some(d => v.created_at?.startsWith(d))).length;

    const totalPhrases = phrases.length;

    // Recent activity
    const recentDates = useMemo(() => {
        return [...new Set(phrases.map(p => p.date))].sort().reverse().slice(0, 7);
    }, [phrases]);

    const recentActivity = useMemo(() => {
        return recentDates.map(date => {
            const datePhrases = phrases.filter(p => p.date === date);
            const mastered = datePhrases.filter(p => (mastery[p.id] || 0) >= 4).length;
            return { date, total: datePhrases.length, mastered, percent: Math.round((mastered / datePhrases.length) * 100) };
        });
    }, [recentDates, phrases, mastery]);

    // Weekly stats - combined phrases + vocabulary
    const weeklyData = useMemo(() => {
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const dayPhrases = phrases.filter(p => p.date === dateStr).length;
            const dayVocab = vocabulary.filter(v => v.created_at?.startsWith(dateStr)).length;
            last7.push({
                day: ['日', '月', '火', '水', '木', '金', '土'][d.getDay()],
                date: `${d.getMonth() + 1}/${d.getDate()}`,
                phrases: dayPhrases,
                vocab: dayVocab,
                total: dayPhrases + dayVocab,
            });
        }
        return last7;
    }, [phrases, vocabulary]);

    const maxWeekly = Math.max(...weeklyData.map(d => d.total), 1);

    // Weekly learning time data
    const weeklyLearningTime = useMemo(() => {
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const record = learningRecords.find(r => r.date === dateStr);
            last7.push({
                day: ['日', '月', '火', '水', '木', '金', '土'][d.getDay()],
                date: `${d.getMonth() + 1}/${d.getDate()}`,
                dateStr,
                minutes: record?.minutes || 0,
            });
        }
        return last7;
    }, [learningRecords]);

    const maxLearningTime = Math.max(...weeklyLearningTime.map(d => d.minutes), 1);

    // Monthly Calendar Data
    const calendarData = useMemo(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days: (null | { day: number; dateStr: string; phrases: number; vocab: number; minutes: number; mastered: number })[] = [];

        // Empty cells for days before the month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Days of the month
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayPhrases = phrases.filter(p => p.date === dateStr);
            const dayVocab = vocabulary.filter(v => v.created_at?.startsWith(dateStr));
            const dayLearning = learningRecords.find(r => r.date === dateStr);
            const dayMastered = dayPhrases.filter(p => (mastery[p.id] || 0) >= 4).length;

            days.push({
                day: d,
                dateStr,
                phrases: dayPhrases.length,
                vocab: dayVocab.length,
                minutes: dayLearning?.minutes || 0,
                mastered: dayMastered,
            });
        }

        return { year, month, days, daysInMonth };
    }, [calendarMonth, phrases, vocabulary, learningRecords, mastery]);

    const monthlyStats = useMemo(() => {
        const validDays = calendarData.days.filter(d => d !== null) as NonNullable<typeof calendarData.days[0]>[];
        return {
            totalPhrases: validDays.reduce((sum, d) => sum + d.phrases, 0),
            totalVocab: validDays.reduce((sum, d) => sum + d.vocab, 0),
            totalMinutes: validDays.reduce((sum, d) => sum + d.minutes, 0),
            activeDays: validDays.filter(d => d.phrases > 0 || d.vocab > 0 || d.minutes > 0).length,
            maxActivity: Math.max(...validDays.map(d => d.phrases + d.vocab), 1),
        };
    }, [calendarData]);

    const selectedDateData = useMemo(() => {
        if (!selectedCalendarDate) return null;
        const dayPhrases = phrases.filter(p => p.date === selectedCalendarDate);
        const dayVocab = vocabulary.filter(v => v.created_at?.startsWith(selectedCalendarDate));
        const dayLearning = learningRecords.find(r => r.date === selectedCalendarDate);
        return {
            phrases: dayPhrases,
            vocab: dayVocab,
            minutes: dayLearning?.minutes || 0,
        };
    }, [selectedCalendarDate, phrases, vocabulary, learningRecords]);

    const calendarMonthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const calendarDayNames = ['日', '月', '火', '水', '木', '金', '土'];

    if (isLoading) {
        return (
            <div style={{ padding: isMobile ? '16px' : '32px 40px', color: '#888' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ padding: isMobile ? '16px' : '32px 40px' }}>
            {/* Header - Compact */}
            <div style={{ marginBottom: isMobile ? '12px' : '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>
                    Dashboard
                </h1>
            </div>

            {/* Stats Cards - Compact Row */}
            <div style={{
                display: 'flex',
                gap: isMobile ? '8px' : '12px',
                marginBottom: isMobile ? '16px' : '20px',
                flexWrap: 'wrap',
            }}>
                {/* Phrases */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    padding: isMobile ? '10px 14px' : '12px 18px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#D4AF37' }}>
                        {totalPhrases}
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>フレーズ</div>
                        <div style={{ fontSize: '10px', color: '#aaa' }}>+{todayPhrasesCount}今日</div>
                    </div>
                </div>

                {/* Vocabulary */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    padding: isMobile ? '10px 14px' : '12px 18px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#3b82f6' }}>
                        {vocabulary.length}
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>単語</div>
                        <div style={{ fontSize: '10px', color: '#aaa' }}>+{todayVocabCount}今日</div>
                    </div>
                </div>

                {/* Learning Time - Interactive */}
                <div
                    onClick={() => !showTimeInput && setShowTimeInput(true)}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        padding: isMobile ? '10px 14px' : '12px 18px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        position: 'relative',
                    }}
                >
                    {showTimeInput ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                            <input
                                type="date"
                                value={dateInput}
                                onChange={e => setDateInput(e.target.value)}
                                style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '11px', width: '110px' }}
                            />
                            <input
                                type="number"
                                value={timeInput}
                                onChange={e => setTimeInput(e.target.value)}
                                placeholder="min"
                                autoFocus
                                style={{ width: '50px', padding: '4px', border: '1px solid #10b981', borderRadius: '4px', fontSize: '12px', textAlign: 'center' }}
                                onKeyDown={e => { if (e.key === 'Enter') handleAddTime(); if (e.key === 'Escape') setShowTimeInput(false); }}
                            />
                            <button onClick={handleAddTime} disabled={isSaving} style={{ padding: '4px 8px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>+</button>
                            <button onClick={() => setShowTimeInput(false)} style={{ padding: '4px 6px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>x</button>
                        </div>
                    ) : (
                        <>
                            <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#10b981' }}>
                                {learningStats.total}
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#666', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    min
                                    {learningStats.streak > 0 && (
                                        <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '1px 5px', borderRadius: '8px', fontSize: '9px' }}>
                                            {learningStats.streak}日
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '10px', color: '#aaa' }}>タップ追加</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Videos */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    padding: isMobile ? '10px 14px' : '12px 18px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#ef4444' }}>
                        {listeningContents.length}
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>動画</div>
                    </div>
                </div>
            </div>

            {/* Main Content - Stack on mobile */}
            <div style={{
                display: isMobile ? 'flex' : 'grid',
                flexDirection: 'column',
                gridTemplateColumns: '2fr 1fr',
                gap: isMobile ? '16px' : '24px'
            }}>
                {/* Daily Habit Goals - Mobile */}
                {isMobile && (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>
                                週の目標
                            </div>
                            <button
                                onClick={() => setShowGoalEdit(!showGoalEdit)}
                                style={{
                                    padding: '4px 10px',
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    color: '#666',
                                    cursor: 'pointer',
                                }}
                            >
                                {showGoalEdit ? 'x' : '設定'}
                            </button>
                        </div>
                        {showGoalEdit ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', color: '#666', width: '60px' }}>学習</span>
                                    <input type="number" value={goalInputs.minutes} onChange={e => setGoalInputs({...goalInputs, minutes: e.target.value})} placeholder={String(dailyGoals.minutes_goal)} style={{ width: '60px', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }} />
                                    <span style={{ fontSize: '12px', color: '#888' }}>min/週</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', color: '#666', width: '60px' }}>フレーズ</span>
                                    <input type="number" value={goalInputs.phrases} onChange={e => setGoalInputs({...goalInputs, phrases: e.target.value})} placeholder={String(dailyGoals.phrases_goal)} style={{ width: '60px', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }} />
                                    <span style={{ fontSize: '12px', color: '#888' }}>件/週</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', color: '#666', width: '60px' }}>単語</span>
                                    <input type="number" value={goalInputs.vocab} onChange={e => setGoalInputs({...goalInputs, vocab: e.target.value})} placeholder={String(dailyGoals.vocab_goal)} style={{ width: '60px', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }} />
                                    <span style={{ fontSize: '12px', color: '#888' }}>件/週</span>
                                </div>
                                <button onClick={handleSaveGoals} disabled={isSaving} style={{ padding: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                                    {isSaving ? '...' : '保存'}
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { label: '学習時間', current: weekMinutes, goal: dailyGoals.minutes_goal, unit: 'min', color: '#10b981' },
                                    { label: 'フレーズ', current: weekPhrasesCount, goal: dailyGoals.phrases_goal, unit: '件', color: '#D4AF37' },
                                    { label: '単語', current: weekVocabCount, goal: dailyGoals.vocab_goal, unit: '件', color: '#3b82f6' },
                                ].map((item, i) => {
                                    const percent = item.goal > 0 ? Math.round((item.current / item.goal) * 100) : 0;
                                    const isComplete = percent >= 100;
                                    return (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '12px', color: '#666' }}>{item.label}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '11px', color: '#999' }}>
                                                        {item.current}/{item.goal}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        color: isComplete ? '#10b981' : item.color,
                                                        minWidth: '38px',
                                                        textAlign: 'right'
                                                    }}>
                                                        {percent}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${Math.min(percent, 100)}%`,
                                                    backgroundColor: isComplete ? '#10b981' : item.color,
                                                    borderRadius: '3px',
                                                    transition: 'width 0.5s ease-out'
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Left Column */}
                <div>
                    {/* Weekly Progress Chart */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: isMobile ? '16px' : '24px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        marginBottom: isMobile ? '16px' : '24px',
                    }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
                            週間進捗
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '8px' : '16px', height: '140px' }}>
                            {weeklyData.map((day, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        height: '100px',
                                        position: 'relative',
                                    }}>
                                        {day.vocab > 0 && (
                                            <div style={{
                                                width: '100%',
                                                height: `${Math.max((day.vocab / maxWeekly) * 100, 20)}%`,
                                                backgroundColor: '#3b82f6',
                                                borderRadius: day.phrases > 0 ? '4px 4px 0 0' : '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '20px',
                                            }}>
                                                <span style={{ fontSize: '10px', fontWeight: '600', color: '#fff' }}>{day.vocab}</span>
                                            </div>
                                        )}
                                        {day.phrases > 0 && (
                                            <div style={{
                                                width: '100%',
                                                height: `${Math.max((day.phrases / maxWeekly) * 100, 20)}%`,
                                                backgroundColor: '#D4AF37',
                                                borderRadius: day.vocab > 0 ? '0 0 4px 4px' : '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '20px',
                                            }}>
                                                <span style={{ fontSize: '10px', fontWeight: '600', color: '#fff' }}>{day.phrases}</span>
                                            </div>
                                        )}
                                        {day.total === 0 && (
                                            <div style={{ width: '100%', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                                        )}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>{day.day}</div>
                                    <div style={{ fontSize: '9px', color: '#aaa' }}>{day.date}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '11px', color: '#666' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#D4AF37' }} />
                                フレーズ
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#3b82f6' }} />
                                ボキャブラリー
                            </span>
                        </div>
                    </div>

                    {/* Weekly Learning Time Chart */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: isMobile ? '16px' : '24px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
                            週間学習時間
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '8px' : '16px', height: '140px' }}>
                            {weeklyLearningTime.map((day, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        height: '100px',
                                    }}>
                                        {day.minutes > 0 ? (
                                            <div style={{
                                                width: '100%',
                                                height: `${Math.max((day.minutes / maxLearningTime) * 100, 15)}%`,
                                                backgroundColor: '#10b981',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '18px',
                                            }}>
                                                <span style={{ fontSize: '9px', fontWeight: '600', color: '#fff' }}>{day.minutes}</span>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                                        )}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>{day.day}</div>
                                    <div style={{ fontSize: '9px', color: '#aaa' }}>{day.date}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '12px', fontSize: '11px', color: '#888', textAlign: 'right' }}>
                            週合計: {formatTime(weeklyLearningTime.reduce((sum, d) => sum + d.minutes, 0))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Desktop only */}
                {!isMobile && (
                    <div>
                        {/* Daily Habit Goals */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            marginBottom: '24px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                                    週の目標
                                </div>
                                <button
                                    onClick={() => setShowGoalEdit(!showGoalEdit)}
                                    style={{
                                        padding: '4px 12px',
                                        backgroundColor: '#f0f0f0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        color: '#666',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showGoalEdit ? 'x' : '設定'}
                                </button>
                            </div>
                            {showGoalEdit ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '13px', color: '#666', width: '70px' }}>学習</span>
                                        <input type="number" value={goalInputs.minutes} onChange={e => setGoalInputs({...goalInputs, minutes: e.target.value})} placeholder={String(dailyGoals.minutes_goal)} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }} />
                                        <span style={{ fontSize: '13px', color: '#888' }}>min/週</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '13px', color: '#666', width: '70px' }}>フレーズ</span>
                                        <input type="number" value={goalInputs.phrases} onChange={e => setGoalInputs({...goalInputs, phrases: e.target.value})} placeholder={String(dailyGoals.phrases_goal)} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }} />
                                        <span style={{ fontSize: '13px', color: '#888' }}>件/週</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '13px', color: '#666', width: '70px' }}>単語</span>
                                        <input type="number" value={goalInputs.vocab} onChange={e => setGoalInputs({...goalInputs, vocab: e.target.value})} placeholder={String(dailyGoals.vocab_goal)} style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }} />
                                        <span style={{ fontSize: '13px', color: '#888' }}>件/週</span>
                                    </div>
                                    <button onClick={handleSaveGoals} disabled={isSaving} style={{ padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}>
                                        {isSaving ? '保存中...' : '保存'}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { label: '学習時間', current: weekMinutes, goal: dailyGoals.minutes_goal, unit: 'min', color: '#10b981' },
                                        { label: 'フレーズ', current: weekPhrasesCount, goal: dailyGoals.phrases_goal, unit: '件', color: '#D4AF37' },
                                        { label: '単語', current: weekVocabCount, goal: dailyGoals.vocab_goal, unit: '件', color: '#3b82f6' },
                                    ].map((item, i) => {
                                        const percent = item.goal > 0 ? Math.round((item.current / item.goal) * 100) : 0;
                                        const isComplete = percent >= 100;
                                        return (
                                            <div key={i}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '13px', color: '#666' }}>{item.label}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '12px', color: '#999' }}>
                                                            {item.current}/{item.goal} {item.unit}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '13px',
                                                            fontWeight: '700',
                                                            color: isComplete ? '#10b981' : item.color,
                                                            minWidth: '45px',
                                                            textAlign: 'right'
                                                        }}>
                                                            {percent}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${Math.min(percent, 100)}%`,
                                                        backgroundColor: isComplete ? '#10b981' : item.color,
                                                        borderRadius: '4px',
                                                        transition: 'width 0.5s ease-out'
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Learning Time Stats */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px', fontWeight: '500' }}>
                                学習時間統計
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#666' }}>今週</span>
                                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>{formatTime(learningStats.thisWeek)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#666' }}>今月</span>
                                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>{formatTime(learningStats.thisMonth)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#666' }}>累計</span>
                                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>{formatTime(learningStats.total)}</span>
                                </div>
                                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>連続記録</span>
                                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981' }}>{learningStats.longestStreak}日</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Monthly Calendar Section */}
            <div style={{
                marginTop: isMobile ? '20px' : '32px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: isMobile ? '16px' : '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
                {/* Calendar Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}>
                    <div>
                        <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#1a1a2e' }}>
                            学習カレンダー
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                            {monthlyStats.activeDays}日間学習 / {monthlyStats.totalPhrases}フレーズ / {monthlyStats.totalVocab}単語 / {monthlyStats.totalMinutes}min
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => setCalendarMonth(new Date(calendarData.year, calendarData.month - 1, 1))}
                            style={{
                                background: 'none',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#666',
                            }}
                        >
                            ←
                        </button>
                        <div style={{
                            fontSize: isMobile ? '14px' : '16px',
                            fontWeight: '600',
                            color: '#1a1a2e',
                            minWidth: '100px',
                            textAlign: 'center',
                        }}>
                            {calendarData.year}年 {calendarMonthNames[calendarData.month]}
                        </div>
                        <button
                            onClick={() => setCalendarMonth(new Date(calendarData.year, calendarData.month + 1, 1))}
                            style={{
                                background: 'none',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#666',
                            }}
                        >
                            →
                        </button>
                        <button
                            onClick={() => setCalendarMonth(new Date())}
                            style={{
                                background: '#D4AF37',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#000',
                            }}
                        >
                            今月
                        </button>
                    </div>
                </div>

                {/* Day Headers */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: '8px',
                }}>
                    {calendarDayNames.map((day, i) => (
                        <div
                            key={day}
                            style={{
                                textAlign: 'center',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#888',
                                padding: '8px 0',
                            }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid - Minimal 3-Column Design */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '3px',
                }}>
                    {calendarData.days.map((dayData, index) => {
                        if (dayData === null) {
                            return <div key={`empty-${index}`} style={{ minHeight: isMobile ? '65px' : '75px', backgroundColor: 'transparent' }} />;
                        }

                        const { day, dateStr, phrases: dayPhrases, vocab: dayVocab, minutes: dayMinutes } = dayData;
                        const hasActivity = dayPhrases > 0 || dayVocab > 0 || dayMinutes > 0;
                        const isToday = dateStr === todayStr;
                        const dayOfWeek = (new Date(dateStr).getDay());

                        return (
                            <div
                                key={dateStr}
                                onClick={() => hasActivity && setSelectedCalendarDate(dateStr)}
                                style={{
                                    minHeight: isMobile ? '65px' : '75px',
                                    backgroundColor: isToday ? '#fffbeb' : '#fafafa',
                                    borderRadius: '6px',
                                    cursor: hasActivity ? 'pointer' : 'default',
                                    border: isToday ? '2px solid #D4AF37' : '1px solid #eee',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (hasActivity) {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Day number */}
                                <div style={{
                                    fontSize: isMobile ? '11px' : '13px',
                                    fontWeight: isToday ? '700' : '500',
                                    color: dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#374151',
                                    padding: '4px 6px 2px',
                                    textAlign: 'center',
                                }}>
                                    {day}
                                </div>

                                {/* 3-Column Stats */}
                                <div style={{
                                    display: 'flex',
                                    flex: 1,
                                    borderTop: hasActivity ? '1px solid #eee' : 'none',
                                }}>
                                    {/* Phrases Column */}
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: dayPhrases > 0 ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                        borderRight: '1px solid #eee',
                                    }}>
                                        {dayPhrases > 0 && (
                                            <span style={{
                                                fontSize: isMobile ? '13px' : '16px',
                                                fontWeight: '700',
                                                color: '#D4AF37',
                                            }}>
                                                {dayPhrases}
                                            </span>
                                        )}
                                    </div>

                                    {/* Vocab Column */}
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: dayVocab > 0 ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        borderRight: '1px solid #eee',
                                    }}>
                                        {dayVocab > 0 && (
                                            <span style={{
                                                fontSize: isMobile ? '13px' : '16px',
                                                fontWeight: '700',
                                                color: '#3b82f6',
                                            }}>
                                                {dayVocab}
                                            </span>
                                        )}
                                    </div>

                                    {/* Time Column */}
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: dayMinutes > 0 ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    }}>
                                        {dayMinutes > 0 && (
                                            <span style={{
                                                fontSize: isMobile ? '11px' : '14px',
                                                fontWeight: '700',
                                                color: '#10b981',
                                            }}>
                                                {dayMinutes}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend - Minimal */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: isMobile ? '16px' : '32px',
                    marginTop: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
                        <span style={{ fontSize: '11px', color: '#D4AF37', fontWeight: '600' }}>フレーズ</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
                        <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600' }}>単語</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(16, 185, 129, 0.3)' }} />
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>分</span>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div style={{
                    marginTop: '24px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e5e7eb',
                }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '12px' }}>
                        最近の学習記録
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {calendarData.days
                            .filter((d): d is NonNullable<typeof d> => d !== null && (d.phrases > 0 || d.vocab > 0 || d.minutes > 0))
                            .sort((a, b) => b.dateStr.localeCompare(a.dateStr))
                            .slice(0, 7)
                            .map((dayData) => {
                                const dateObj = new Date(dayData.dateStr);
                                const isToday = dayData.dateStr === todayStr;
                                return (
                                    <div
                                        key={dayData.dateStr}
                                        onClick={() => setSelectedCalendarDate(dayData.dateStr)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 12px',
                                            backgroundColor: isToday ? '#fffbeb' : '#f9fafb',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: isToday ? '1px solid #D4AF37' : '1px solid transparent',
                                        }}
                                    >
                                        {/* Date */}
                                        <div style={{ minWidth: '60px' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>
                                                {dateObj.getMonth() + 1}/{dateObj.getDate()}
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#888' }}>
                                                {['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()]}曜日
                                            </div>
                                        </div>

                                        {/* Activity badges */}
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                                            {dayData.phrases > 0 && (
                                                <div style={{
                                                    backgroundColor: '#D4AF37',
                                                    borderRadius: '12px',
                                                    padding: '4px 10px',
                                                    fontSize: '11px',
                                                    color: '#fff',
                                                    fontWeight: '600',
                                                }}>
                                                    {dayData.phrases} フレーズ
                                                </div>
                                            )}
                                            {dayData.vocab > 0 && (
                                                <div style={{
                                                    backgroundColor: '#3b82f6',
                                                    borderRadius: '12px',
                                                    padding: '4px 10px',
                                                    fontSize: '11px',
                                                    color: '#fff',
                                                    fontWeight: '600',
                                                }}>
                                                    {dayData.vocab} 単語
                                                </div>
                                            )}
                                            {dayData.minutes > 0 && (
                                                <div style={{
                                                    backgroundColor: '#10b981',
                                                    borderRadius: '12px',
                                                    padding: '4px 10px',
                                                    fontSize: '11px',
                                                    color: '#fff',
                                                    fontWeight: '600',
                                                }}>
                                                    {dayData.minutes} 分
                                                </div>
                                            )}
                                        </div>

                                        {/* Arrow */}
                                        <div style={{ color: '#ccc', fontSize: '14px' }}>→</div>
                                    </div>
                                );
                            })}
                        {calendarData.days.filter((d): d is NonNullable<typeof d> => d !== null && (d.phrases > 0 || d.vocab > 0 || d.minutes > 0)).length === 0 && (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>
                                この月の学習記録はありません
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Learning Materials from Real Content */}
            <div style={{
                marginTop: isMobile ? '20px' : '32px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: isMobile ? '16px' : '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#1a1a2e' }}>
                        Conversation Materials
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        日本語コンテンツを英語で説明する練習
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: '16px',
                }}>
                    {/* Cooking */}
                    <Link
                        href="/cooking"
                        style={{
                            textDecoration: 'none',
                            display: 'block',
                            backgroundColor: '#fefce8',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #fef08a',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <div style={{ fontSize: '11px', color: '#ca8a04', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            COOKING
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                            明日、俺が作る飯
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
                            鶏もも肉の味噌バター焼き、長ねぎの丸焼き、かきたま汁。料理を英語で説明してみよう。
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {['recipe', 'ingredients', 'cooking methods', 'kitchen vocabulary'].map((tag) => (
                                <span key={tag} style={{
                                    backgroundColor: '#fef9c3',
                                    color: '#a16207',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: '500',
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>

                    {/* Coaching */}
                    <Link
                        href="/coaching"
                        style={{
                            textDecoration: 'none',
                            display: 'block',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #bbf7d0',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            COACHING
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                            中隈さんとのコーチング
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
                            認知科学、ビジネス、自己成長。抽象的な概念を英語で表現する練習に最適。
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {['cognitive science', 'business', 'self-improvement', 'abstract concepts'].map((tag) => (
                                <span key={tag} style={{
                                    backgroundColor: '#dcfce7',
                                    color: '#15803d',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: '500',
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                </div>

                {/* Practice Prompts */}
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '12px' }}>
                        Practice Prompts
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { jp: '「重しを乗せて焼く」を英語で説明して', en: 'Explain "cooking with weight on top"' },
                            { jp: '「コンフォートゾーン」の概念を英語で', en: 'Describe the concept of "comfort zone"' },
                            { jp: '今日の献立を英語で紹介して', en: 'Present today\'s menu in English' },
                            { jp: '「認知科学コーチング」とは何か、英語で', en: 'What is "cognitive science coaching"?' },
                        ].map((prompt, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#D4AF37',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    flexShrink: 0,
                                }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', color: '#1a1a2e' }}>{prompt.jp}</div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{prompt.en}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selected Date Popup */}
            {selectedCalendarDate && selectedDateData && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px',
                    }}
                    onClick={() => setSelectedCalendarDate(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '500px',
                            maxHeight: '80vh',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Popup Header */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid #e5e5e5',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#fafafa',
                        }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e' }}>
                                    {new Date(selectedCalendarDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                    {selectedDateData.phrases.length}フレーズ / {selectedDateData.vocab.length}単語 / {selectedDateData.minutes}min
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link
                                    href={`/english/phrases/${selectedCalendarDate}`}
                                    style={{
                                        background: '#D4AF37',
                                        borderRadius: '8px',
                                        padding: '8px 14px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#000',
                                        textDecoration: 'none',
                                    }}
                                >
                                    詳細
                                </Link>
                                <button
                                    onClick={() => setSelectedCalendarDate(null)}
                                    style={{
                                        background: '#e5e5e5',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 14px',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        color: '#666',
                                    }}
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>

                        {/* Popup Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            {/* Learning Time */}
                            {selectedDateData.minutes > 0 && (
                                <div style={{
                                    backgroundColor: '#ecfdf5',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                    }}>
                                        {selectedDateData.minutes}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>学習時間</div>
                                        <div style={{ fontSize: '12px', color: '#10b981' }}>{selectedDateData.minutes}分間学習しました</div>
                                    </div>
                                </div>
                            )}

                            {/* Phrases */}
                            {selectedDateData.phrases.length > 0 && (
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#D4AF37', marginBottom: '8px' }}>
                                        フレーズ ({selectedDateData.phrases.length})
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {selectedDateData.phrases.slice(0, 5).map((phrase, i) => (
                                            <div key={i} style={{
                                                backgroundColor: '#fffbeb',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                borderLeft: '3px solid #D4AF37',
                                            }}>
                                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>{phrase.english}</div>
                                                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{phrase.japanese}</div>
                                            </div>
                                        ))}
                                        {selectedDateData.phrases.length > 5 && (
                                            <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
                                                +{selectedDateData.phrases.length - 5}件
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Vocabulary */}
                            {selectedDateData.vocab.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
                                        単語 ({selectedDateData.vocab.length})
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {selectedDateData.vocab.slice(0, 10).map((vocab, i) => (
                                            <div key={i} style={{
                                                backgroundColor: '#eff6ff',
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                color: '#2563eb',
                                                fontWeight: '500',
                                            }}>
                                                {vocab.phrase}
                                            </div>
                                        ))}
                                        {selectedDateData.vocab.length > 10 && (
                                            <div style={{
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                fontSize: '12px',
                                                color: '#888',
                                            }}>
                                                +{selectedDateData.vocab.length - 10}件
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Empty state */}
                            {selectedDateData.phrases.length === 0 && selectedDateData.vocab.length === 0 && selectedDateData.minutes === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                    この日のデータはありません
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
