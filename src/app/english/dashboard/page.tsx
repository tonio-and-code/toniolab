'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { listeningContents } from '@/data/english-listening';

interface DailyPhrase {
    id: string;
    english: string;
    japanese: string;
    category: string;
    date: string;
}

interface MasteryData {
    [phraseId: string]: number;
}

const handwrittenNotes = [
    { date: '2026-01-12', pages: 3 }
];

export default function DashboardPage() {
    const [phrases, setPhrases] = useState<DailyPhrase[]>([]);
    const [mastery, setMastery] = useState<MasteryData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    useEffect(() => {
        Promise.all([
            fetch('/api/phrases').then(r => r.json()),
            fetch('/api/phrases/mastery').then(r => r.json()),
        ]).then(([phrasesData, masteryData]) => {
            if (phrasesData.success) setPhrases(phrasesData.phrases || []);
            if (masteryData.success) setMastery(masteryData.mastery || {});
        }).finally(() => setIsLoading(false));
    }, []);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const phrasesByDate = useMemo(() => {
        return phrases.reduce((acc, p) => {
            if (!acc[p.date]) acc[p.date] = [];
            acc[p.date].push(p);
            return acc;
        }, {} as Record<string, DailyPhrase[]>);
    }, [phrases]);

    const listeningByDate = useMemo(() => {
        const map = new Map<string, typeof listeningContents>();
        listeningContents.forEach(content => {
            const existing = map.get(content.date) || [];
            map.set(content.date, [...existing, content]);
        });
        return map;
    }, []);

    const handwrittenByDate = useMemo(() => {
        const map = new Map<string, number>();
        handwrittenNotes.forEach(note => {
            map.set(note.date, note.pages);
        });
        return map;
    }, []);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    const formatDateKey = (day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const isToday = (day: number) => {
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const getActivitiesForDay = (day: number) => {
        const dateKey = formatDateKey(day);
        const dayPhrases = phrasesByDate[dateKey] || [];
        const dayListening = listeningByDate.get(dateKey) || [];
        const dayHandwritten = handwrittenByDate.get(dateKey) || 0;

        return {
            phrases: dayPhrases,
            phraseMastered: dayPhrases.filter(p => (mastery[p.id] || 0) >= 4).length,
            listening: dayListening,
            handwritten: dayHandwritten,
            hasAny: dayPhrases.length > 0 || dayListening.length > 0 || dayHandwritten > 0
        };
    };

    const totalPhrases = phrases.length;
    const masteredPhrases = phrases.filter(p => (mastery[p.id] || 0) >= 4).length;
    const totalListening = listeningContents.length;
    const totalHandwritten = handwrittenNotes.reduce((sum, n) => sum + n.pages, 0);

    const todayActivities = getActivitiesForDay(today.getDate());
    const todayNeedsReview = todayActivities.phrases.length - todayActivities.phraseMastered;

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
        setSelectedDay(null);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDay(null);
    };

    const selectedActivities = selectedDay ? getActivitiesForDay(selectedDay) : null;

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', color: '#1a1a1a' }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
                <Link href="/english" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>
                    Back
                </Link>
                <span style={{ fontWeight: '600', fontSize: '16px' }}>Dashboard</span>
                <div style={{ width: '30px' }}></div>
            </div>

            <div style={{ padding: '0 24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Stats Section */}
                <div style={{
                    marginTop: '24px',
                    marginBottom: '24px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    padding: '20px',
                }}>
                    <div style={{ fontSize: '11px', color: '#D4AF37', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.5px' }}>
                        OVERVIEW
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: '#D4AF37' }}>{totalPhrases}</div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Phrases</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{masteredPhrases}</div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Mastered</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>{totalListening}</div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Videos</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f97316' }}>{totalHandwritten}</div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Pages</div>
                        </div>
                    </div>
                </div>

                {/* Today's Review */}
                {todayNeedsReview > 0 && (
                    <Link href={`/english/phrases/${todayStr}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                            marginBottom: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '2px solid #D4AF37',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#D4AF37', fontWeight: '600', marginBottom: '4px' }}>TODAY</div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                                    {todayNeedsReview} phrases to review
                                </div>
                            </div>
                            <span style={{ color: '#888' }}>→</span>
                        </div>
                    </Link>
                )}

                {/* Calendar */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    padding: '20px',
                    marginBottom: '24px',
                }}>
                    {/* Month Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <button
                            onClick={() => navigateMonth('prev')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666', padding: '4px 8px' }}
                        >
                            ‹
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                {monthNames[month]} {year}
                            </div>
                            <button
                                onClick={goToToday}
                                style={{ background: 'none', border: 'none', fontSize: '12px', color: '#D4AF37', cursor: 'pointer', marginTop: '4px' }}
                            >
                                Today
                            </button>
                        </div>
                        <button
                            onClick={() => navigateMonth('next')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666', padding: '4px 8px' }}
                        >
                            ›
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                        {dayNames.map((d, i) => (
                            <div key={i} style={{
                                textAlign: 'center',
                                fontSize: '11px',
                                color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#888',
                                padding: '6px 4px',
                                fontWeight: '500',
                            }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {calendarDays.map((day, i) => {
                            if (day === null) {
                                return <div key={i} style={{ aspectRatio: '1' }} />;
                            }

                            const activities = getActivitiesForDay(day);
                            const isTodayDate = isToday(day);
                            const isSelected = selectedDay === day;
                            const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
                            const isSunday = dayOfWeek === 0;
                            const isSaturday = dayOfWeek === 6;

                            return (
                                <div
                                    key={i}
                                    onClick={() => activities.hasAny && setSelectedDay(isSelected ? null : day)}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        backgroundColor: isSelected ? '#D4AF37' : isTodayDate ? '#fffbeb' : 'transparent',
                                        border: isTodayDate && !isSelected ? '2px solid #D4AF37' : 'none',
                                        cursor: activities.hasAny ? 'pointer' : 'default',
                                    }}
                                >
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: isTodayDate || activities.hasAny ? '600' : '400',
                                        color: isSelected ? '#fff' : isSunday ? '#ef4444' : isSaturday ? '#3b82f6' : activities.hasAny ? '#1a1a1a' : '#ccc',
                                    }}>
                                        {day}
                                    </span>
                                    {activities.hasAny && (
                                        <div style={{ display: 'flex', gap: '2px', marginTop: '3px' }}>
                                            {activities.phrases.length > 0 && (
                                                <div style={{
                                                    width: '5px',
                                                    height: '5px',
                                                    borderRadius: '50%',
                                                    backgroundColor: isSelected ? '#fff' :
                                                        activities.phraseMastered === activities.phrases.length ? '#10b981' : '#D4AF37',
                                                }} />
                                            )}
                                            {activities.listening.length > 0 && (
                                                <div style={{
                                                    width: '5px',
                                                    height: '5px',
                                                    borderRadius: '50%',
                                                    backgroundColor: isSelected ? '#fff' : '#ef4444',
                                                }} />
                                            )}
                                            {activities.handwritten > 0 && (
                                                <div style={{
                                                    width: '5px',
                                                    height: '5px',
                                                    borderRadius: '50%',
                                                    backgroundColor: isSelected ? '#fff' : '#f97316',
                                                }} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px',
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e5e5',
                        fontSize: '10px',
                        color: '#888',
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
                            Phrases
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                            Listening
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }} />
                            Writing
                        </span>
                    </div>
                </div>

                {/* Selected Day Details */}
                {selectedDay && selectedActivities && selectedActivities.hasAny && (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e5e5e5',
                        padding: '20px',
                        marginBottom: '24px',
                    }}>
                        <div style={{
                            fontSize: '11px',
                            color: '#D4AF37',
                            fontWeight: '600',
                            marginBottom: '16px',
                        }}>
                            {month + 1}/{selectedDay}
                        </div>

                        {/* Phrases */}
                        {selectedActivities.phrases.length > 0 && (
                            <Link href={`/english/phrases/${formatDateKey(selectedDay)}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '14px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                }}>
                                    <div>
                                        <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>
                                            {selectedActivities.phrases.length} Phrases
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                                            {selectedActivities.phraseMastered}/{selectedActivities.phrases.length} mastered
                                        </div>
                                    </div>
                                    <span style={{ color: '#888' }}>→</span>
                                </div>
                            </Link>
                        )}

                        {/* Listening */}
                        {selectedActivities.listening.map(video => (
                            <Link key={video.id} href={`/english/listening/${video.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '14px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#1a1a1a',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {video.title}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                                            {video.segments.length} segments
                                        </div>
                                    </div>
                                    <span style={{ color: '#888', marginLeft: '12px' }}>→</span>
                                </div>
                            </Link>
                        ))}

                        {/* Handwritten */}
                        {selectedActivities.handwritten > 0 && (
                            <Link href="/english/handwritten" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '14px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px',
                                }}>
                                    <div>
                                        <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>
                                            Handwritten Notes
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                                            {selectedActivities.handwritten} pages
                                        </div>
                                    </div>
                                    <span style={{ color: '#888' }}>→</span>
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                {/* Quick Links */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '40px',
                }}>
                    <Link href="/english/listening" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #e5e5e5',
                            padding: '16px',
                        }}>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>Listening</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{totalListening} videos</div>
                        </div>
                    </Link>
                    <Link href="/english/handwritten" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #e5e5e5',
                            padding: '16px',
                        }}>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>Handwritten</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{totalHandwritten} pages</div>
                        </div>
                    </Link>
                    <Link href="/memoria" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #e5e5e5',
                            padding: '16px',
                        }}>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>Memoria</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Journal entries</div>
                        </div>
                    </Link>
                    <Link href="/english/vocabulary" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #e5e5e5',
                            padding: '16px',
                        }}>
                            <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>Vocabulary</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Saved words</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
