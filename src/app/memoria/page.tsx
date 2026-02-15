'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MemoriaStorage } from '@/lib/memoria-storage';
import { MemoriaEntry } from '@/types/memoria';
import { journalEntries } from '@/data/journal';
import { labEntries } from '@/data/lab';
import { collegePartyRecapEntries } from '@/data/english/college-party-recap';
import { monsterUnderBedEntries } from '@/data/english/monster-under-bed';
import { marinersTradeEntries } from '@/data/english/mariners-trade-talk';
import { skeletonTalkEntries } from '@/data/english/skeleton-talk';
import { movieNightEntries } from '@/data/english/movie-night';

export default function MemoriaPage() {
    const [entries, setEntries] = useState<MemoriaEntry[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const loadEntries = async () => {
            const userEntries = await MemoriaStorage.getAll();

            const journalMemoriaEntries: MemoriaEntry[] = journalEntries
                .filter(entry => entry.conversationData)
                .map(entry => ({
                    id: `journal-${entry.id}`,
                    date: entry.date,
                    title: entry.title,
                    content: entry.summary,
                    conversation: entry.conversationData,
                    tone: entry.conversationData?.tone,
                    createdAt: entry.conversationData?.generatedAt ?? new Date(entry.date),
                    updatedAt: entry.conversationData?.generatedAt ?? new Date(entry.date),
                    tags: [...entry.businessTags, ...entry.techTags],
                    heroImage: entry.heroImage,
                }));

            const labMemoriaEntries: MemoriaEntry[] = labEntries
                .filter(entry => entry.conversationData)
                .map(entry => ({
                    id: `lab-${entry.id}`,
                    date: entry.date,
                    title: entry.title,
                    content: entry.summary,
                    conversation: entry.conversationData,
                    tone: entry.conversationData?.tone,
                    createdAt: entry.conversationData?.generatedAt ?? new Date(entry.date),
                    updatedAt: entry.conversationData?.generatedAt ?? new Date(entry.date),
                    tags: [...entry.businessTags, ...entry.techTags],
                    heroImage: entry.heroImage,
                }));

            const partyMemoriaEntries: MemoriaEntry[] = collegePartyRecapEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const monsterMemoriaEntries: MemoriaEntry[] = monsterUnderBedEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const marinersMemoriaEntries: MemoriaEntry[] = marinersTradeEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const skeletonMemoriaEntries: MemoriaEntry[] = skeletonTalkEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const movieMemoriaEntries: MemoriaEntry[] = movieNightEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const allEntries = [...userEntries, ...journalMemoriaEntries, ...labMemoriaEntries, ...partyMemoriaEntries, ...monsterMemoriaEntries, ...marinersMemoriaEntries, ...skeletonMemoriaEntries, ...movieMemoriaEntries];
            setEntries(allEntries);
        };
        loadEntries();
    }, []);

    // Group entries by date
    const entriesByDate = useMemo(() => {
        const map = new Map<string, MemoriaEntry[]>();
        entries.forEach(entry => {
            const dateKey = entry.date.split('T')[0];
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(entry);
        });
        return map;
    }, [entries]);

    // Group entries by series
    const seriesGroups = useMemo(() => {
        const groups = new Map<string, { title: string; entries: MemoriaEntry[] }>();
        entries.forEach(entry => {
            if (entry.series) {
                if (!groups.has(entry.series)) {
                    groups.set(entry.series, {
                        title: entry.seriesTitle || entry.series,
                        entries: []
                    });
                }
                groups.get(entry.series)!.entries.push(entry);
            }
        });
        // Sort entries in each series by date
        groups.forEach(group => {
            group.entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });
        return groups;
    }, [entries]);

    // Grouped items for list view (series grouped, singles separate)
    const listItems = useMemo(() => {
        const items: Array<{ type: 'single'; entry: MemoriaEntry } | { type: 'series'; seriesId: string; title: string; entries: MemoriaEntry[]; latestDate: string }> = [];
        const processedSeries = new Set<string>();

        // Sort all entries by date (newest first)
        const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        sorted.forEach(entry => {
            if (entry.series) {
                // If we haven't processed this series yet
                if (!processedSeries.has(entry.series)) {
                    processedSeries.add(entry.series);
                    const seriesEntries = entries
                        .filter(e => e.series === entry.series)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    items.push({
                        type: 'series',
                        seriesId: entry.series,
                        title: entry.seriesTitle || entry.series,
                        entries: seriesEntries,
                        latestDate: seriesEntries[0].date
                    });
                }
            } else {
                items.push({ type: 'single', entry });
            }
        });

        // Sort by latest date
        return items.sort((a, b) => {
            const dateA = a.type === 'single' ? a.entry.date : a.latestDate;
            const dateB = b.type === 'single' ? b.entry.date : b.latestDate;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
    }, [entries]);

    // Calendar helpers
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
            return newDate;
        });
        setSelectedDay(null);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

    const today = new Date();
    const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const getEntriesForDay = (day: number) => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return entriesByDate.get(dateKey) || [];
    };

    const selectedDayEntries = selectedDay ? entriesByDate.get(selectedDay) || [] : [];
    const rows = Math.ceil(calendarDays.length / 7);

    // Default hero image for entries without one
    const defaultHeroImage = 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/54572915-e49e-4721-d1fb-478bd17df600/public';

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
                {/* Left: View Toggle */}
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f0f0f0', borderRadius: '8px', padding: '3px' }}>
                    <button
                        onClick={() => setViewMode('calendar')}
                        style={{
                            background: viewMode === 'calendar' ? '#fff' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: viewMode === 'calendar' ? '#1a1a1a' : '#888',
                            boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        カレンダー
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            background: viewMode === 'list' ? '#fff' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: viewMode === 'list' ? '#1a1a1a' : '#888',
                            boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        リスト
                    </button>
                </div>

                {/* Center: Month Navigation (only in calendar mode) */}
                {viewMode === 'calendar' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => navigateMonth('prev')}
                            style={{
                                background: 'none',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#666'
                            }}
                        >
                            &#8249;
                        </button>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', minWidth: '100px', textAlign: 'center' }}>
                            {year}年 {monthNames[month]}
                        </span>
                        <button
                            onClick={() => navigateMonth('next')}
                            style={{
                                background: 'none',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#666'
                            }}
                        >
                            &#8250;
                        </button>
                    </div>
                ) : (
                    <div style={{ fontSize: '14px', color: '#888' }}>
                        {entries.length} 件の記事
                    </div>
                )}

                {/* Right: Today button */}
                <button
                    onClick={() => { setCurrentDate(new Date()); setSelectedDay(null); }}
                    style={{
                        background: '#D4AF37',
                        border: 'none',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        opacity: viewMode === 'calendar' ? 1 : 0.5
                    }}
                    disabled={viewMode === 'list'}
                >
                    今日
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                overflow: 'hidden',
                minHeight: 0
            }}>
                {/* List View - Grouped by Series */}
                {viewMode === 'list' && (
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        backgroundColor: '#f5f5f5',
                        padding: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            maxWidth: '900px',
                            margin: '0 auto'
                        }}>
                            {listItems.map((item, idx) => {
                                if (item.type === 'single') {
                                    // Single entry card
                                    const entry = item.entry;
                                    const dateObj = new Date(entry.date);
                                    return (
                                        <Link
                                            key={entry.id}
                                            href={`/memoria/${entry.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                display: 'flex',
                                                flexDirection: isMobile ? 'column' : 'row',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                            }}
                                            >
                                                {/* Thumbnail */}
                                                <div style={{
                                                    width: isMobile ? '100%' : '180px',
                                                    height: isMobile ? '120px' : '100px',
                                                    backgroundImage: `url(${entry.heroImage || defaultHeroImage})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    flexShrink: 0
                                                }} />
                                                {/* Content */}
                                                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                                                        {dateObj.getFullYear()}/{dateObj.getMonth() + 1}/{dateObj.getDate()}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '15px',
                                                        fontWeight: '600',
                                                        color: '#1a1a1a',
                                                        lineHeight: '1.4'
                                                    }}>
                                                        {entry.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                } else {
                                    // Series card
                                    const firstEntry = item.entries[0];
                                    return (
                                        <div key={item.seriesId} style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                        }}>
                                            {/* Series Header */}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)',
                                                padding: '16px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '2px' }}>
                                                        SERIES
                                                    </div>
                                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                                        {item.title}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    borderRadius: '20px',
                                                    padding: '4px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    color: '#fff'
                                                }}>
                                                    {item.entries.length} episodes
                                                </div>
                                            </div>
                                            {/* Episode List */}
                                            <div>
                                                {item.entries.map((entry, epIdx) => {
                                                    const dateObj = new Date(entry.date);
                                                    return (
                                                        <Link
                                                            key={entry.id}
                                                            href={`/memoria/${entry.id}`}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            <div style={{
                                                                padding: '12px 20px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '14px',
                                                                borderBottom: epIdx < item.entries.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                                transition: 'background 0.15s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#fafafa';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }}
                                                            >
                                                                {/* Episode Number */}
                                                                <div style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#f5f5f5',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '12px',
                                                                    fontWeight: '700',
                                                                    color: '#D4AF37',
                                                                    flexShrink: 0
                                                                }}>
                                                                    {epIdx + 1}
                                                                </div>
                                                                {/* Title & Date */}
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{
                                                                        fontSize: '14px',
                                                                        fontWeight: '500',
                                                                        color: '#333',
                                                                        marginBottom: '2px'
                                                                    }}>
                                                                        {entry.title}
                                                                    </div>
                                                                    <div style={{ fontSize: '11px', color: '#999' }}>
                                                                        {dateObj.getMonth() + 1}/{dateObj.getDate()}
                                                                    </div>
                                                                </div>
                                                                {/* Arrow */}
                                                                <div style={{ color: '#ccc', fontSize: '16px' }}>→</div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                        {listItems.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                                記事がありません
                            </div>
                        )}
                    </div>
                )}

                {/* Calendar Section */}
                {viewMode === 'calendar' && (
                <div style={{
                    flex: isMobile ? 'none' : '1',
                    height: isMobile ? '50%' : '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    borderRight: isMobile ? 'none' : '1px solid #e5e5e5'
                }}>
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
                        gap: '2px',
                        padding: '4px',
                        backgroundColor: '#f0f0f0',
                    }}>
                        {calendarDays.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} style={{ backgroundColor: '#fafafa', aspectRatio: '1', borderRadius: '4px' }} />;
                            }

                            const dayEntries = getEntriesForDay(day);
                            const hasEntries = dayEntries.length > 0;
                            const entryWithImage = dayEntries.find(e => e.heroImage);
                            const heroImage = entryWithImage?.heroImage || (hasEntries ? defaultHeroImage : null);
                            const isTodayDate = isToday(day);
                            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = selectedDay === dateKey;
                            const dayOfWeek = (firstDayOfMonth + day - 1) % 7;

                            return (
                                <div
                                    key={day}
                                    onClick={() => hasEntries && setSelectedDay(isSelected ? null : dateKey)}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        cursor: hasEntries ? 'pointer' : 'default',
                                        backgroundColor: '#fff',
                                        boxShadow: isSelected ? '0 0 0 2px #D4AF37' : isTodayDate ? '0 0 0 2px #10b981' : 'none',
                                        aspectRatio: '1'
                                    }}
                                >
                                    {/* Background Image */}
                                    {hasEntries && heroImage && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundImage: `url(${heroImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }} />
                                    )}

                                    {/* Gradient Overlay for text readability */}
                                    {hasEntries && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)'
                                        }} />
                                    )}

                                    {/* Content */}
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        padding: '4px'
                                    }}>
                                        {/* Day Number */}
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: hasEntries
                                                ? '#fff'
                                                : dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#888',
                                            textShadow: hasEntries ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                                        }}>
                                            {day}
                                        </div>

                                        {/* Entry Title */}
                                        {hasEntries && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '4px',
                                                left: '4px',
                                                right: '4px'
                                            }}>
                                                <div style={{
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    color: '#fff',
                                                    lineHeight: '1.3',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                                                }}>
                                                    {dayEntries[0].title}
                                                </div>
                                                {dayEntries.length > 1 && (
                                                    <div style={{
                                                        fontSize: '9px',
                                                        color: '#D4AF37',
                                                        fontWeight: '700',
                                                        marginTop: '2px',
                                                        textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                                                    }}>
                                                        +{dayEntries.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}

                {/* Right Panel: Selected Day or Series (only in calendar mode) */}
                {viewMode === 'calendar' && (
                <div style={{
                    flex: isMobile ? 'none' : '0 0 320px',
                    height: isMobile ? '50%' : '100%',
                    overflowY: 'auto',
                    backgroundColor: '#fafafa',
                    borderTop: isMobile ? '1px solid #e5e5e5' : 'none'
                }}>
                    {selectedDay && selectedDayEntries.length > 0 ? (
                        /* Selected Day Entries */
                        <div style={{ padding: '16px' }}>
                            <div style={{
                                fontSize: '12px',
                                color: '#888',
                                marginBottom: '12px',
                                fontWeight: '500'
                            }}>
                                {new Date(selectedDay).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} - {selectedDayEntries.length}件
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedDayEntries.map(entry => (
                                    <Link
                                        key={entry.id}
                                        href={`/memoria/${entry.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                        }}>
                                            {entry.heroImage && (
                                                <div style={{
                                                    height: '120px',
                                                    backgroundImage: `url(${entry.heroImage})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }} />
                                            )}
                                            <div style={{ padding: '12px' }}>
                                                {entry.series && (
                                                    <div style={{
                                                        fontSize: '10px',
                                                        color: '#D4AF37',
                                                        fontWeight: '600',
                                                        marginBottom: '4px'
                                                    }}>
                                                        {entry.seriesTitle}
                                                    </div>
                                                )}
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#1a1a1a',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {entry.title}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Series List */
                        <div style={{ padding: '16px' }}>
                            <div style={{
                                fontSize: '12px',
                                color: '#888',
                                marginBottom: '16px',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Series
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {Array.from(seriesGroups.entries()).map(([seriesId, group]) => (
                                    <div key={seriesId} style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #f0f0f0',
                                            backgroundColor: '#D4AF37'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                color: '#fff'
                                            }}>
                                                {group.title}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: 'rgba(255,255,255,0.8)',
                                                marginTop: '2px'
                                            }}>
                                                {group.entries.length} episodes
                                            </div>
                                        </div>
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {group.entries.map((entry, idx) => (
                                                <Link
                                                    key={entry.id}
                                                    href={`/memoria/${entry.id}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div style={{
                                                        padding: '10px 16px',
                                                        borderBottom: idx < group.entries.length - 1 ? '1px solid #f5f5f5' : 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}>
                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#f5f5f5',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            color: '#888',
                                                            flexShrink: 0
                                                        }}>
                                                            {idx + 1}
                                                        </div>
                                                        <div style={{
                                                            flex: 1,
                                                            fontSize: '13px',
                                                            color: '#333',
                                                            lineHeight: '1.3'
                                                        }}>
                                                            {entry.title}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {seriesGroups.size === 0 && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px 20px',
                                        color: '#888',
                                        fontSize: '13px'
                                    }}>
                                        日付をタップして記事を表示
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    );
}
