"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { listeningContents } from "@/data/english-listening";

export default function ListeningPage() {
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

    // Create a map of date -> contents for calendar view
    const contentsByDate = useMemo(() => {
        const map = new Map<string, typeof listeningContents>();
        listeningContents.forEach(content => {
            const existing = map.get(content.date) || [];
            map.set(content.date, [...existing, content]);
        });
        return map;
    }, []);

    // Calendar helper functions
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

    const getContentsForDay = (day: number) => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return contentsByDate.get(dateKey) || [];
    };

    const selectedDayContents = selectedDay ? contentsByDate.get(selectedDay) || [] : [];

    // List view items sorted by date (newest first)
    const sortedContents = useMemo(() => {
        return [...listeningContents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, []);

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

                {/* Center: Month Navigation or Count */}
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
                        {listeningContents.length} videos
                    </div>
                )}

                {/* Right: Today button */}
                <button
                    onClick={() => { setCurrentDate(new Date()); setSelectedDay(null); }}
                    style={{
                        background: '#ef4444',
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
                {/* List View */}
                {viewMode === 'list' && (
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        backgroundColor: '#f5f5f5',
                        padding: '16px'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '16px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {sortedContents.map((content) => (
                                <Link key={content.id} href={`/english/listening/${content.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        transition: 'all 0.15s ease',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        {/* Thumbnail */}
                                        <div style={{
                                            position: 'relative',
                                            aspectRatio: '16/9',
                                            backgroundImage: `url(https://img.youtube.com/vi/${content.youtubeId}/mqdefault.jpg)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
                                            }} />
                                            <div style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                backgroundColor: 'rgba(0,0,0,0.7)',
                                                color: '#fff',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px'
                                            }}>
                                                {content.segments.length} segments
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '8px',
                                                left: '8px',
                                                color: 'rgba(255,255,255,0.8)',
                                                fontSize: '11px'
                                            }}>
                                                {content.date}
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div style={{ padding: '12px' }}>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1a1a1a',
                                                lineHeight: '1.4',
                                                marginBottom: '4px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {content.title}
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#888',
                                                lineHeight: '1.4',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {content.description}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Explanation at bottom of list view */}
                        <div style={{
                            maxWidth: '800px',
                            margin: '32px auto 16px',
                            padding: '16px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #e5e5e5'
                        }}>
                            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', marginBottom: '8px' }}>
                                You can't escape from English.
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
                                日本語YouTubeを「英語版」で見る。Comprehensible Input仮説に基づく学習法。
                                好きなコンテンツで学ぶから、記憶に残りやすい。
                            </div>
                        </div>
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

                                const dayContents = getContentsForDay(day);
                                const hasContent = dayContents.length > 0;
                                const thumbnail = hasContent ? `https://img.youtube.com/vi/${dayContents[0].youtubeId}/mqdefault.jpg` : null;
                                const isTodayDate = isToday(day);
                                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = selectedDay === dateKey;
                                const dayOfWeek = (firstDayOfMonth + day - 1) % 7;

                                return (
                                    <div
                                        key={day}
                                        onClick={() => hasContent && setSelectedDay(isSelected ? null : dateKey)}
                                        style={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: '4px',
                                            cursor: hasContent ? 'pointer' : 'default',
                                            backgroundColor: '#fff',
                                            boxShadow: isSelected ? '0 0 0 2px #ef4444' : isTodayDate ? '0 0 0 2px #10b981' : 'none',
                                            aspectRatio: '1'
                                        }}
                                    >
                                        {/* Background Image */}
                                        {hasContent && thumbnail && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundImage: `url(${thumbnail})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }} />
                                        )}

                                        {/* Gradient Overlay */}
                                        {hasContent && (
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
                                                color: hasContent
                                                    ? '#fff'
                                                    : dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#888',
                                                textShadow: hasContent ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                                            }}>
                                                {day}
                                            </div>

                                            {/* Video Title */}
                                            {hasContent && (
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
                                                        {dayContents[0].title}
                                                    </div>
                                                    {dayContents.length > 1 && (
                                                        <div style={{
                                                            fontSize: '9px',
                                                            color: '#ef4444',
                                                            fontWeight: '700',
                                                            marginTop: '2px',
                                                            textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                                                        }}>
                                                            +{dayContents.length - 1}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation at bottom of calendar */}
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#fafafa',
                            borderTop: '1px solid #eee',
                            marginTop: 'auto'
                        }}>
                            <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '600', marginBottom: '4px' }}>
                                You can't escape from English.
                            </div>
                            <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.5' }}>
                                日本語で一度見たYouTubeを英語版で再視聴。Comprehensible Input仮説に基づき、
                                理解可能なインプットで効率的に学習。好きなコンテンツだから記憶に残る。
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Panel: Selected Day Videos (only in calendar mode) */}
                {viewMode === 'calendar' && (
                    <div style={{
                        flex: isMobile ? 'none' : '0 0 360px',
                        height: isMobile ? '50%' : '100%',
                        overflowY: 'auto',
                        backgroundColor: '#fafafa',
                        borderTop: isMobile ? '1px solid #e5e5e5' : 'none'
                    }}>
                        {selectedDay && selectedDayContents.length > 0 ? (
                            /* Selected Day Videos */
                            <div style={{ padding: '16px' }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#888',
                                    marginBottom: '12px',
                                    fontWeight: '500'
                                }}>
                                    {new Date(selectedDay).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} - {selectedDayContents.length} video{selectedDayContents.length > 1 ? 's' : ''}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {selectedDayContents.map(content => (
                                        <Link
                                            key={content.id}
                                            href={`/english/listening/${content.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                transition: 'all 0.15s ease'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                                }}
                                            >
                                                {/* Thumbnail */}
                                                <div style={{
                                                    position: 'relative',
                                                    aspectRatio: '16/9',
                                                    backgroundImage: `url(https://img.youtube.com/vi/${content.youtubeId}/mqdefault.jpg)`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <div style={{
                                                            width: '48px',
                                                            height: '48px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            opacity: 0.9
                                                        }}>
                                                            <Play size={20} fill="#ef4444" color="#ef4444" style={{ marginLeft: '2px' }} />
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        right: '8px',
                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                        color: '#fff',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px'
                                                    }}>
                                                        {content.segments.length} segments
                                                    </div>
                                                </div>
                                                {/* Content */}
                                                <div style={{ padding: '12px' }}>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: '#1a1a1a',
                                                        lineHeight: '1.4',
                                                        marginBottom: '6px'
                                                    }}>
                                                        {content.title}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#888',
                                                        lineHeight: '1.4',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {content.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Empty state / Instructions */
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                padding: '32px',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: '#fee2e2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <Play size={28} color="#ef4444" />
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                    YouTube English
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>
                                    カレンダーから日付を選択して
                                    <br />
                                    動画を視聴
                                </div>
                                <div style={{
                                    marginTop: '24px',
                                    padding: '12px 16px',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '11px',
                                    color: '#666'
                                }}>
                                    {listeningContents.length} videos available
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
