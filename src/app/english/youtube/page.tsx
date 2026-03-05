"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Loader2, X, Trash2 } from "lucide-react";
import { listeningContents, ExpressionPick, ListeningContent } from "@/data/english-listening";

const DYNAMIC_STORAGE_KEY = 'yt-dynamic-contents';

function loadDynamicContents(): ListeningContent[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(DYNAMIC_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveDynamicContents(contents: ListeningContent[]) {
    localStorage.setItem(DYNAMIC_STORAGE_KEY, JSON.stringify(contents));
}

export default function ListeningPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [registeredPhrases, setRegisteredPhrases] = useState<Set<string>>(new Set());
    const [registeringKey, setRegisteringKey] = useState<string | null>(null);

    // YouTube URL input state
    const [ytUrl, setYtUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processError, setProcessError] = useState<string | null>(null);
    const [processSuccess, setProcessSuccess] = useState<string | null>(null);
    const [dynamicContents, setDynamicContents] = useState<ListeningContent[]>([]);

    // Load dynamic contents from localStorage
    useEffect(() => {
        setDynamicContents(loadDynamicContents());
    }, []);

    // Merge static + dynamic contents
    const allContents = useMemo(() => {
        return [...listeningContents, ...dynamicContents];
    }, [dynamicContents]);

    // Create a map of date -> contents for calendar view
    const contentsByDate = useMemo(() => {
        const map = new Map<string, ListeningContent[]>();
        allContents.forEach(content => {
            const existing = map.get(content.date) || [];
            map.set(content.date, [...existing, content]);
        });
        return map;
    }, [allContents]);

    // Process YouTube URL
    const processYouTubeUrl = useCallback(async () => {
        if (!ytUrl.trim() || isProcessing) return;
        setIsProcessing(true);
        setProcessError(null);
        setProcessSuccess(null);

        try {
            const res = await fetch('/api/youtube-process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: ytUrl.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setProcessError(data.error || 'Processing failed');
                return;
            }

            const newContent = data.content as ListeningContent;

            // Check if already exists
            setDynamicContents(prev => {
                const filtered = prev.filter(c => c.id !== newContent.id);
                const updated = [...filtered, newContent];
                saveDynamicContents(updated);
                return updated;
            });

            setProcessSuccess(`"${newContent.title}" -- ${newContent.segments.length} segments, ${newContent.expressions?.length || 0} expressions`);
            setYtUrl('');
        } catch (err) {
            setProcessError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setIsProcessing(false);
        }
    }, [ytUrl, isProcessing]);

    // Delete dynamic content
    const deleteDynamicContent = useCallback((id: string) => {
        setDynamicContents(prev => {
            const updated = prev.filter(c => c.id !== id);
            saveDynamicContents(updated);
            return updated;
        });
    }, []);

    // Fetch registered phrases from DB (same pattern as expressions page)
    useEffect(() => {
        const fetchPhrases = async () => {
            try {
                const res = await fetch('/api/user-phrases');
                if (res.ok) {
                    const data = await res.json();
                    const phrases: { phrase: string }[] = data.phrases || [];
                    setRegisteredPhrases(new Set(phrases.map(p => p.phrase.toLowerCase())));
                }
            } catch { /* ignore */ }
        };
        fetchPhrases();
    }, []);

    const isExprRegistered = (english: string) => registeredPhrases.has(english.toLowerCase());

    const registerExpression = async (expr: ExpressionPick, contentTitle: string, contentDate: string) => {
        const key = expr.english;
        if (isExprRegistered(key) || registeringKey === key) return;
        setRegisteringKey(key);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: expr.english,
                    type: 'expression',
                    meaning: expr.japanese,
                    example: expr.context || '',
                    source: `Listening: ${contentTitle}`,
                    date: contentDate,
                }),
            });
            if (res.ok || res.status === 409) {
                setRegisteredPhrases(prev => new Set([...prev, key.toLowerCase()]));
            }
        } catch { /* ignore */ }
        setRegisteringKey(null);
    };

    const registerAllExpressions = async (expressions: ExpressionPick[], contentTitle: string, contentDate: string) => {
        const unregistered = expressions.filter(e => !isExprRegistered(e.english));
        if (unregistered.length === 0) return;
        setRegisteringKey('batch');
        for (const expr of unregistered) {
            try {
                const res = await fetch('/api/user-phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phrase: expr.english,
                        type: 'expression',
                        meaning: expr.japanese,
                        example: expr.context || '',
                        source: `Listening: ${contentTitle}`,
                        date: contentDate,
                    }),
                });
                if (res.ok || res.status === 409) {
                    setRegisteredPhrases(prev => new Set([...prev, expr.english.toLowerCase()]));
                }
            } catch { /* ignore */ }
        }
        setRegisteringKey(null);
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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
        return [...allContents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allContents]);

    return (
        <div style={{
            backgroundColor: '#f5f5f5',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* YouTube URL Input */}
            <div style={{
                padding: '10px 16px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #f0f0f0',
                flexShrink: 0
            }}>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        flex: 1,
                        position: 'relative',
                    }}>
                        <input
                            type="text"
                            value={ytUrl}
                            onChange={(e) => { setYtUrl(e.target.value); setProcessError(null); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') processYouTubeUrl(); }}
                            placeholder="YouTube URL を貼り付け"
                            disabled={isProcessing}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                paddingRight: ytUrl ? '36px' : '14px',
                                border: processError ? '1.5px solid #ef4444' : '1.5px solid #e0e0e0',
                                borderRadius: '10px',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: isProcessing ? '#fafafa' : '#fff',
                                color: '#1a1a1a',
                                transition: 'border-color 0.15s ease',
                            }}
                            onFocus={(e) => { if (!processError) e.target.style.borderColor = '#D4AF37'; }}
                            onBlur={(e) => { if (!processError) e.target.style.borderColor = '#e0e0e0'; }}
                        />
                        {ytUrl && !isProcessing && (
                            <button
                                onClick={() => { setYtUrl(''); setProcessError(null); }}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#aaa',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={processYouTubeUrl}
                        disabled={isProcessing || !ytUrl.trim()}
                        style={{
                            padding: '10px 20px',
                            background: isProcessing ? '#e5e5e5' : (!ytUrl.trim() ? '#e5e5e5' : 'linear-gradient(135deg, #D4AF37, #B8941F)'),
                            color: isProcessing || !ytUrl.trim() ? '#999' : '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: isProcessing || !ytUrl.trim() ? 'default' : 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease',
                            minWidth: '90px',
                            justifyContent: 'center',
                        }}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                処理中...
                            </>
                        ) : '生成'}
                    </button>
                </div>
                {processError && (
                    <div style={{
                        maxWidth: '800px',
                        margin: '6px auto 0',
                        fontSize: '12px',
                        color: '#ef4444',
                        paddingLeft: '2px',
                    }}>
                        {processError}
                    </div>
                )}
                {processSuccess && (
                    <div style={{
                        maxWidth: '800px',
                        margin: '6px auto 0',
                        fontSize: '12px',
                        color: '#16a34a',
                        paddingLeft: '2px',
                    }}>
                        {processSuccess}
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

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
                        {allContents.length} videos
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
                            {sortedContents.map((content) => {
                                const isDynamic = content.id.startsWith('yt-');
                                return (
                                <div key={content.id} style={{ position: 'relative' }}>
                                    <Link href={`/english/youtube/${content.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            transition: 'all 0.15s ease',
                                            border: isDynamic ? '2px solid #D4AF37' : 'none',
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
                                                {isDynamic && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        left: '8px',
                                                        backgroundColor: '#D4AF37',
                                                        color: '#fff',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '10px',
                                                        fontWeight: '700',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        AUTO
                                                    </div>
                                                )}
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
                                    {isDynamic && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteDynamicContent(content.id); }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                right: '12px',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#ccc',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                transition: 'color 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; }}
                                            title="削除"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                );
                            })}
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
                                        <div key={content.id}>
                                        <Link
                                            href={`/english/youtube/${content.id}`}
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
                                                        {content.segments.length > 0 ? `${content.segments.length} segments` : `${(content.expressions || []).length} expressions`}
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

                                        {/* Expression Cards */}
                                        {content.expressions && content.expressions.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                marginTop: '8px',
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '0 2px',
                                                }}>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        color: '#ef4444',
                                                        letterSpacing: '0.5px',
                                                    }}>
                                                        EXPRESSIONS ({content.expressions.length})
                                                    </div>
                                                    {(() => {
                                                        const unregCount = content.expressions!.filter(e => !isExprRegistered(e.english)).length;
                                                        return unregCount > 0 ? (
                                                            <button
                                                                onClick={() => registerAllExpressions(content.expressions!, content.title, content.date)}
                                                                disabled={registeringKey === 'batch'}
                                                                style={{
                                                                    fontSize: '10px',
                                                                    fontWeight: '700',
                                                                    color: '#fff',
                                                                    backgroundColor: registeringKey === 'batch' ? '#ccc' : '#ef4444',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    padding: '4px 10px',
                                                                    cursor: registeringKey === 'batch' ? 'default' : 'pointer',
                                                                    transition: 'all 0.15s',
                                                                }}
                                                            >
                                                                {registeringKey === 'batch' ? '...' : `${unregCount}個まとめて登録`}
                                                            </button>
                                                        ) : (
                                                            <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}>
                                                                ALL REGISTERED
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                {content.expressions.map((expr: ExpressionPick, idx: number) => {
                                                    const registered = isExprRegistered(expr.english);
                                                    return (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            backgroundColor: registered ? '#f0fdf4' : '#fff',
                                                            borderRadius: '10px',
                                                            border: `1px solid ${registered ? '#bbf7d0' : '#f0f0f0'}`,
                                                            padding: '10px 12px',
                                                            transition: 'all 0.15s',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!registered) e.currentTarget.style.borderColor = '#ef4444';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.borderColor = registered ? '#bbf7d0' : '#f0f0f0';
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{
                                                                    fontSize: '16px',
                                                                    fontWeight: '800',
                                                                    color: '#1a1a1a',
                                                                    lineHeight: 1.3,
                                                                    marginBottom: '3px',
                                                                }}>
                                                                    {expr.japanese}
                                                                </div>
                                                                <div style={{
                                                                    fontSize: '13px',
                                                                    fontWeight: '600',
                                                                    color: '#ef4444',
                                                                    lineHeight: 1.4,
                                                                }}>
                                                                    {expr.english}
                                                                </div>
                                                            </div>
                                                            {registered ? (
                                                                <div style={{
                                                                    fontSize: '10px',
                                                                    fontWeight: '700',
                                                                    color: '#10b981',
                                                                    whiteSpace: 'nowrap',
                                                                    padding: '3px 8px',
                                                                    backgroundColor: '#dcfce7',
                                                                    borderRadius: '6px',
                                                                }}>
                                                                    DONE
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => registerExpression(expr, content.title, content.date)}
                                                                    disabled={registeringKey === expr.english}
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        fontWeight: '700',
                                                                        color: '#ef4444',
                                                                        backgroundColor: '#fff',
                                                                        border: '1px solid #ef4444',
                                                                        borderRadius: '6px',
                                                                        padding: '3px 8px',
                                                                        cursor: 'pointer',
                                                                        whiteSpace: 'nowrap',
                                                                        transition: 'all 0.15s',
                                                                    }}
                                                                >
                                                                    {registeringKey === expr.english ? '...' : '+ Phrases'}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {expr.context && (
                                                            <div style={{
                                                                fontSize: '11px',
                                                                color: '#aaa',
                                                                fontStyle: 'italic',
                                                                marginTop: '4px',
                                                                lineHeight: 1.4,
                                                            }}>
                                                                {expr.context}
                                                            </div>
                                                        )}
                                                        {expr.why && (
                                                            <div style={{
                                                                fontSize: '11px',
                                                                color: '#666',
                                                                marginTop: '6px',
                                                                lineHeight: 1.5,
                                                                padding: '6px 8px',
                                                                backgroundColor: registered ? '#f0fdf4' : '#fafafa',
                                                                borderRadius: '6px',
                                                                borderLeft: '2px solid #ef4444',
                                                            }}>
                                                                {expr.why}
                                                            </div>
                                                        )}
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        </div>
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
                                    {allContents.length} videos available
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
