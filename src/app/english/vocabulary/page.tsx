'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

declare global {
    interface Window {
        YG?: {
            Widget: new (id: string, options: {
                width: number;
                components: number;
                events: {
                    onFetchDone?: (event: { totalResult: number }) => void;
                    onVideoChange?: (event: { videoId: string; start: number }) => void;
                    onCaptionChange?: (event: { caption: string }) => void;
                };
            }) => {
                fetch: (phrase: string, lang: string) => void;
            };
        };
    }
}

interface Vocabulary {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    note: string | null;
    example: string | null;
    mastery_level: number;
    times_used: number;
    created_at: string;
    video_id: string | null;
    video_timestamp: number | null;
    video_text: string | null;
}

const TYPES = ['word', 'phrasal verb', 'idiom', 'slang', 'collocation', 'expression'];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'word': { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' },
    'phrasal verb': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'idiom': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'slang': { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' },
    'collocation': { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
    'expression': { bg: '#ECFEFF', text: '#0891B2', border: '#A5F3FC' },
};

const MASTERY_COLORS = ['#E5E5E5', '#FEE2E2', '#FEF3C7', '#D1FAE5', '#10B981'];

export default function VocabularyPage() {
    const [items, setItems] = useState<Vocabulary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [searchQuery, setSearchQuery] = useState('');

    // Add/Edit form
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        phrase: '',
        type: 'word',
        meaning: '',
        note: '',
        example: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    // YouGlish
    const [selectedItem, setSelectedItem] = useState<Vocabulary | null>(null);
    const youglishLoaded = useRef(false);
    const widgetRef = useRef<ReturnType<typeof window.YG.Widget> | null>(null);
    const [currentClip, setCurrentClip] = useState<{
        videoId: string;
        timestamp: number;
        caption: string;
    } | null>(null);
    const [captionHistory, setCaptionHistory] = useState<{text: string; selected: boolean}[]>([]);
    const [savingClip, setSavingClip] = useState(false);
    const [savingPhrase, setSavingPhrase] = useState(false);
    const [youglishSaveDate, setYouglishSaveDate] = useState(new Date().toISOString().split('T')[0]);
    const [playerPosition, setPlayerPosition] = useState({ x: 20, y: 20 });
    const [playerSize, setPlayerSize] = useState({ width: 420, height: 400 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const [playerMinimized, setPlayerMinimized] = useState(false);
    const [playerFullscreen, setPlayerFullscreen] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (youglishLoaded.current) return;
        const script = document.createElement('script');
        script.src = 'https://youglish.com/public/emb/widget.js';
        script.async = true;
        document.body.appendChild(script);
        youglishLoaded.current = true;
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/user-phrases');
            const data = await res.json();
            if (data.success) setItems(data.phrases || []);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.phrase.trim() || !formData.meaning.trim()) return;

        setIsSaving(true);
        try {
            if (editingId) {
                await fetch(`/api/user-phrases/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/user-phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }
            await fetchItems();
            resetForm();
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (item: Vocabulary) => {
        setEditingId(item.id);
        setFormData({
            phrase: item.phrase,
            type: item.type,
            meaning: item.meaning,
            note: item.note || '',
            example: item.example || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this vocabulary?')) return;
        await fetch(`/api/user-phrases/${id}`, { method: 'DELETE' });
        await fetchItems();
        if (selectedItem?.id === id) setSelectedItem(null);
    };

    const handleMastery = async (id: string, level: number) => {
        await fetch(`/api/user-phrases/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mastery_level: level }),
        });
        setItems(prev => prev.map(p => p.id === id ? { ...p, mastery_level: level } : p));
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ phrase: '', type: 'word', meaning: '', note: '', example: '' });
    };

    // Refs to store current video info (persists across renders)
    const currentVideoRef = useRef({ videoId: '', timestamp: 0 });

    const playYouGlish = (item: Vocabulary) => {
        setSelectedItem(item);
        setCurrentClip(null);
        setCaptionHistory([]);
        setPlayerMinimized(false);
        currentVideoRef.current = { videoId: '', timestamp: 0 };

        // Position player at center-right of viewport
        setPlayerPosition({
            x: Math.max(20, window.innerWidth - 460),
            y: Math.max(20, window.innerHeight / 2 - 200)
        });
        setTimeout(() => {
            if (!window.YG) return;
            const container = document.getElementById('yg-widget-vocab');
            if (container) container.innerHTML = '';

            widgetRef.current = new window.YG.Widget('yg-widget-vocab', {
                width: 400,
                components: 255,
                events: {
                    onFetchDone: (event: { totalResult: number }) => {
                        console.log('YouGlish onFetchDone:', event);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onVideoChange: (event: any) => {
                        console.log('YouGlish onVideoChange - ALL PROPS:', JSON.stringify(event, null, 2));
                        // Try different possible property names - event.video is the actual property from YouGlish
                        const videoId = event.video || event.videoId || event.video_id || event.id || event.trackId || '';
                        const start = event.start || event.current_time || event.time || 0;
                        console.log('Extracted from onVideoChange:', { videoId, start });
                        if (videoId) {
                            currentVideoRef.current = { videoId, timestamp: start };
                            setCurrentClip({ videoId, timestamp: start, caption: '' });
                            setCaptionHistory([]); // Reset caption history on video change
                        }
                    },
                    onCaptionChange: (event: { caption: string; id?: string; current_time?: number; trackId?: string }) => {
                        console.log('YouGlish onCaptionChange:', event);
                        // Decode URL-encoded caption and clean up markers
                        let decodedCaption = event.caption;
                        try {
                            decodedCaption = decodeURIComponent(event.caption);
                        } catch {
                            // If decode fails, use original
                        }
                        // Remove YouGlish markers like [[[word]]]
                        decodedCaption = decodedCaption.replace(/\[\[\[/g, '').replace(/\]\]\]/g, '');

                        // Try to extract video ID from iframe if not captured yet
                        let videoId = currentVideoRef.current.videoId;
                        if (!videoId) {
                            // Try to get from YouTube iframe
                            const iframe = document.querySelector('#yg-widget-vocab iframe') as HTMLIFrameElement;
                            if (iframe?.src) {
                                const match = iframe.src.match(/youtube\.com\/embed\/([^?]+)/);
                                if (match) {
                                    videoId = match[1];
                                    console.log('Extracted videoId from iframe:', videoId);
                                }
                            }
                        }

                        const timestamp = event.current_time || currentVideoRef.current.timestamp || 0;

                        currentVideoRef.current = {
                            videoId: videoId,
                            timestamp: timestamp
                        };

                        setCurrentClip({
                            videoId: videoId,
                            timestamp: timestamp,
                            caption: decodedCaption
                        });
                        // Add to caption history if not duplicate
                        setCaptionHistory(prev => {
                            if (prev.length === 0 || prev[prev.length - 1].text !== decodedCaption) {
                                return [...prev, { text: decodedCaption, selected: true }];
                            }
                            return prev;
                        });
                    }
                },
            });
            widgetRef.current.fetch(item.phrase, 'english');
        }, 100);
    };

    // Drag handlers for YouGlish player
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

    const toggleFullscreen = () => {
        setPlayerFullscreen(!playerFullscreen);
        setPlayerMinimized(false);
    };

    const saveClipToVocabulary = async () => {
        if (!selectedItem || !currentClip) {
            alert('No clip to save. Please wait for the video to load.');
            return;
        }
        if (!currentClip.videoId) {
            alert('Video ID not captured yet. Please wait for the video to play.');
            return;
        }
        const selectedCaptions = captionHistory.filter(c => c.selected);
        if (selectedCaptions.length === 0) {
            alert('No captions selected. Please select at least one caption.');
            return;
        }

        const fullText = selectedCaptions.map(c => c.text).join(' ');
        console.log('Saving clip:', currentClip, 'Full text:', fullText);
        setSavingClip(true);
        try {
            const res = await fetch(`/api/user-phrases/${selectedItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    video_id: currentClip.videoId,
                    video_timestamp: currentClip.timestamp,
                    video_text: fullText
                }),
            });
            const data = await res.json();
            if (data.success) {
                setItems(prev => prev.map(p => p.id === selectedItem.id ? {
                    ...p,
                    video_id: currentClip.videoId,
                    video_timestamp: currentClip.timestamp,
                    video_text: fullText
                } : p));
                // Update selectedItem too
                setSelectedItem(prev => prev ? {
                    ...prev,
                    video_id: currentClip.videoId,
                    video_timestamp: currentClip.timestamp,
                    video_text: fullText
                } : null);
                alert('Saved!');
            } else {
                alert('Failed to save: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save clip');
        } finally {
            setSavingClip(false);
        }
    };

    // Group by date
    const itemsByDate = useMemo(() => {
        const map: Record<string, Vocabulary[]> = {};
        items.forEach(item => {
            const dateKey = item.created_at.split('T')[0];
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(item);
        });
        return map;
    }, [items]);

    // Group by type
    const itemsByType = useMemo(() => {
        const map: Record<string, Vocabulary[]> = {};
        items.forEach(item => {
            if (!map[item.type]) map[item.type] = [];
            map[item.type].push(item);
        });
        return map;
    }, [items]);

    // Items needing review (mastery < 4)
    const needsReview = useMemo(() => {
        return items.filter(i => i.mastery_level < 4).sort((a, b) => a.mastery_level - b.mastery_level);
    }, [items]);

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

    const prevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
        setSelectedDate(null);
    };
    const nextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
        setSelectedDate(null);
    };

    const formatDateKey = (day: number) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const today = new Date();
    const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    // Stats
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekItems = items.filter(item => {
        const d = new Date(item.created_at);
        return d >= weekAgo && d <= today;
    });
    const masteredCount = items.filter(i => i.mastery_level >= 4).length;

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    const selectedItems = selectedDate ? (itemsByDate[selectedDate] || []) : [];

    // Filtered items for search
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(item =>
            item.phrase.toLowerCase().includes(q) ||
            item.meaning.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q)
        );
    }, [items, searchQuery]);

    if (isLoading) {
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
                            onClick={() => prevMonth()}
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
                                    background: '#10B981',
                                    border: 'none',
                                    color: '#fff',
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
                        onClick={() => setShowForm(true)}
                        style={{
                            background: '#10B981',
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
                    {viewMode === 'calendar' && (
                        <button
                            onClick={() => nextMonth()}
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
                            All Vocabulary ({filteredItems.length})
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            Mastered: {masteredCount}
                        </div>
                    </div>

                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 100px 3fr 80px 70px',
                        padding: '10px 16px',
                        borderBottom: '1px solid #e5e5e5',
                        backgroundColor: '#fafafa',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#888'
                    }}>
                        <div>Phrase</div>
                        <div>Type</div>
                        <div>Meaning</div>
                        <div>Lv</div>
                        <div style={{ textAlign: 'right' }}>Date</div>
                    </div>

                    {/* List */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedDate(item.created_at.split('T')[0])}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 100px 3fr 80px 70px',
                                    padding: '12px 16px',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ fontSize: '14px', fontWeight: '500', color: TYPE_COLORS[item.type]?.text || '#333' }}>
                                    {item.phrase}
                                </div>
                                <div style={{ fontSize: '11px', color: '#888' }}>
                                    {item.type}
                                </div>
                                <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.meaning}
                                </div>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {[0, 1, 2, 3, 4].map(level => (
                                        <div
                                            key={level}
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '2px',
                                                backgroundColor: item.mastery_level >= level ? MASTERY_COLORS[level] : '#e5e5e5'
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ fontSize: '11px', color: '#888', textAlign: 'right' }}>
                                    {item.created_at.split('T')[0].slice(5)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Calendar View */
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    overflow: 'hidden',
                    minHeight: 0
                }}>
                    {/* Calendar Section */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
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
                            const dayItems = itemsByDate[dateKey] || [];
                            const hasItems = dayItems.length > 0;
                            const isTodayDate = isToday(day);
                            const isSelected = selectedDate === dateKey;
                            const dayOfWeek = (startDayOfWeek + day - 1) % 7;

                            // Get dominant type for color
                            const typeDistribution = dayItems.reduce((acc, item) => {
                                acc[item.type] = (acc[item.type] || 0) + 1;
                                return acc;
                            }, {} as Record<string, number>);
                            const dominantType = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1])[0]?.[0];
                            const typeColor = dominantType ? TYPE_COLORS[dominantType] : null;

                            return (
                                <div
                                    key={day}
                                    onClick={() => hasItems && setSelectedDate(dateKey)}
                                    style={{
                                        position: 'relative',
                                        borderRadius: '6px',
                                        cursor: hasItems ? 'pointer' : 'default',
                                        background: hasItems
                                            ? `linear-gradient(135deg, ${typeColor?.bg || '#f0f0f0'} 0%, ${typeColor?.border || '#e0e0e0'} 100%)`
                                            : '#f8f8f8',
                                        border: isTodayDate
                                            ? '2px solid #D4AF37'
                                            : '1px solid #e5e5e5',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '4px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Day number */}
                                    <div style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: hasItems
                                            ? typeColor?.text || '#333'
                                            : dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#999',
                                        marginBottom: '2px'
                                    }}>
                                        {day}
                                    </div>

                                    {/* Word list in cell */}
                                    {hasItems && (
                                        <div style={{
                                            flex: 1,
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1px'
                                        }}>
                                            {dayItems.slice(0, 5).map(item => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        fontSize: '9px',
                                                        color: TYPE_COLORS[item.type]?.text || '#555',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        lineHeight: 1.2
                                                    }}
                                                >
                                                    {item.phrase}
                                                </div>
                                            ))}
                                            {dayItems.length > 5 && (
                                                <div style={{ fontSize: '8px', color: '#888' }}>
                                                    +{dayItems.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Panel - Stats only (fixed) */}
                <div style={{
                    width: isMobile ? '100%' : '200px',
                    flexShrink: 0,
                    height: isMobile ? 'auto' : '100%',
                    backgroundColor: '#fafafa',
                    borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {/* Total */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981' }}>
                            {items.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Total Words</div>
                    </div>

                    {/* This Week */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: '#D4AF37' }}>
                            {thisWeekItems.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>This Week</div>
                    </div>

                    {/* Mastered */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6' }}>
                            {masteredCount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Mastered</div>
                    </div>

                    {/* Progress */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Mastery Progress</div>
                        <div style={{
                            height: '8px',
                            backgroundColor: '#e5e5e5',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${items.length > 0 ? Math.round((masteredCount / items.length) * 100) : 0}%`,
                                backgroundColor: '#10B981',
                                borderRadius: '4px'
                            }} />
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '6px', textAlign: 'center' }}>
                            {items.length > 0 ? Math.round((masteredCount / items.length) * 100) : 0}%
                        </div>
                    </div>
                </div>
                </div>
            )}

            {/* Popup Modal for Selected Date */}
            {selectedDate && selectedItems.length > 0 && (
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
                    onClick={() => setSelectedDate(null)}
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
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid #e5e5e5',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#fafafa'
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                                {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} - {selectedItems.length}語
                            </div>
                            <button
                                onClick={() => setSelectedDate(null)}
                                style={{
                                    background: '#e5e5e5',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '6px 14px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    color: '#666',
                                    fontWeight: '500'
                                }}
                            >
                                Close
                            </button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedItems.map(item => (
                                    <VocabularyCard
                                        key={item.id}
                                        item={item}
                                        isSelected={selectedItem?.id === item.id}
                                        onMastery={handleMastery}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onYouGlish={playYouGlish}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* YouGlish Player - Draggable & Resizable */}
            {selectedItem && (
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
                    {/* Drag Handle Header */}
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
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {!playerFullscreen && <span style={{ color: '#666', fontSize: '10px' }}>:::::</span>}
                            <span style={{ fontWeight: '600', fontSize: '13px', color: '#fff' }}>{selectedItem.phrase}</span>
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
                                {playerFullscreen ? '⊡' : '⛶'}
                            </button>
                            {/* Close */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedItem(null); setCurrentClip(null); setPlayerFullscreen(false); }}
                                style={{
                                    background: '#dc2626',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}
                                title="Close"
                            >
                                X
                            </button>
                        </div>
                    </div>

                    {!playerMinimized && (
                        <div style={{
                            padding: '12px',
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div
                                id="yg-widget-vocab"
                                style={{
                                    flex: playerFullscreen ? 1 : 'none',
                                    minHeight: playerFullscreen ? '60vh' : '200px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px'
                                }}
                            />

                            {/* Caption History & Save */}
                            {captionHistory.length > 0 && (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f0fdf4',
                                    borderRadius: '8px',
                                    border: '1px solid #bbf7d0',
                                    flexShrink: 0,
                                    maxHeight: '250px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        marginBottom: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>Captions ({captionHistory.filter(c => c.selected).length}/{captionHistory.length} selected):</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: true })))}
                                                style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '11px', cursor: 'pointer' }}
                                            >
                                                All
                                            </button>
                                            <button
                                                onClick={() => setCaptionHistory(prev => prev.map(c => ({ ...c, selected: false })))}
                                                style={{ background: 'none', border: 'none', color: '#999', fontSize: '11px', cursor: 'pointer' }}
                                            >
                                                None
                                            </button>
                                            <button
                                                onClick={() => setCaptionHistory([])}
                                                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '11px', cursor: 'pointer' }}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        marginBottom: '10px',
                                        overflowY: 'auto',
                                        flex: 1,
                                        padding: '6px',
                                        backgroundColor: '#fff',
                                        borderRadius: '6px',
                                        border: '1px solid #e5e5e5',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '4px',
                                        alignContent: 'flex-start'
                                    }}>
                                        {captionHistory.map((caption, idx) => (
                                            <span
                                                key={idx}
                                                onClick={() => setCaptionHistory(prev =>
                                                    prev.map((c, i) => i === idx ? { ...c, selected: !c.selected } : c)
                                                )}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: caption.selected ? '#dcfce7' : '#f5f5f5',
                                                    color: caption.selected ? '#166534' : '#999',
                                                    cursor: 'pointer',
                                                    border: caption.selected ? '1px solid #86efac' : '1px solid #e5e5e5',
                                                    lineHeight: '1.3',
                                                    textDecoration: caption.selected ? 'none' : 'line-through'
                                                }}
                                            >
                                                {caption.text}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={saveClipToVocabulary}
                                                disabled={savingClip}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#10B981',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: savingClip ? 'wait' : 'pointer'
                                                }}
                                            >
                                                {savingClip ? 'Saving...' : 'Save clip'}
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                type="date"
                                                value={youglishSaveDate}
                                                onChange={(e) => setYouglishSaveDate(e.target.value)}
                                                style={{
                                                    padding: '8px 10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #bfdbfe',
                                                    fontSize: '12px',
                                                    backgroundColor: '#fff',
                                                    color: '#333'
                                                }}
                                            />
                                            <button
                                                onClick={async () => {
                                                    // Save selected captions to phrases table
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
                                                                japanese: `(${selectedItem?.phrase || 'YouGlish'})`,
                                                                category: 'YouGlish',
                                                                date: youglishSaveDate
                                                            })
                                                        });
                                                        if (res.ok) {
                                                            alert('Saved to phrases!');
                                                            setCaptionHistory([]);
                                                        } else {
                                                            alert('Failed to save');
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Error saving phrase');
                                                    } finally {
                                                        setSavingPhrase(false);
                                                    }
                                                }}
                                                disabled={savingPhrase}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#3B82F6',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: savingPhrase ? 'wait' : 'pointer'
                                                }}
                                            >
                                                {savingPhrase ? 'Saving...' : 'Add to phrases'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Show saved clip if exists */}
                            {selectedItem.video_id && (
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '8px',
                                    border: '1px solid #bfdbfe',
                                    fontSize: '12px',
                                    flexShrink: 0,
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '6px'
                                    }}>
                                        <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                                            Saved clip:
                                        </span>
                                        <a
                                            href={`https://www.youtube.com/watch?v=${selectedItem.video_id}&t=${Math.floor(selectedItem.video_timestamp || 0)}s`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: '11px',
                                                color: '#fff',
                                                textDecoration: 'none',
                                                padding: '4px 10px',
                                                backgroundColor: '#dc2626',
                                                borderRadius: '4px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Play on YouTube
                                        </a>
                                    </div>
                                    <div style={{ color: '#333', fontStyle: 'italic' }}>
                                        "{selectedItem.video_text}"
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Resize Handle (bottom-right corner) */}
                    {!playerFullscreen && !playerMinimized && (
                        <div
                            onMouseDown={handleResizeStart}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: '20px',
                                height: '20px',
                                cursor: 'nwse-resize',
                                background: 'linear-gradient(135deg, transparent 50%, #ccc 50%)',
                                borderRadius: '0 0 12px 0',
                            }}
                        />
                    )}
                </div>
            )}

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1100,
                        padding: '20px',
                    }}
                    onClick={() => resetForm()}
                >
                    <form
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            width: '100%',
                            maxWidth: '500px',
                        }}
                    >
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                            {editingId ? 'Edit Vocabulary' : 'Add Vocabulary'}
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                Word / Phrase *
                            </label>
                            <input
                                type="text"
                                value={formData.phrase}
                                onChange={(e) => setFormData({ ...formData, phrase: e.target.value })}
                                required
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                Type
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {TYPES.map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: t })}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            border: formData.type === t ? `2px solid ${TYPE_COLORS[t]?.text}` : `1px solid ${TYPE_COLORS[t]?.border || '#e5e5e5'}`,
                                            backgroundColor: TYPE_COLORS[t]?.bg || '#f5f5f5',
                                            color: TYPE_COLORS[t]?.text || '#333',
                                            fontSize: '13px',
                                            fontWeight: formData.type === t ? '600' : '400',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                Meaning (Japanese) *
                            </label>
                            <input
                                type="text"
                                value={formData.meaning}
                                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                Note (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="Usage hints, nuance, etc."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                Example sentence (optional)
                            </label>
                            <textarea
                                value={formData.example}
                                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                                rows={2}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    fontSize: '15px',
                                    resize: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e5e5',
                                    backgroundColor: '#fff',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: '#10B981',
                                    color: '#fff',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    cursor: isSaving ? 'wait' : 'pointer',
                                }}
                            >
                                {isSaving ? 'Saving...' : (editingId ? 'Update' : 'Add')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

// Vocabulary Card Component
function VocabularyCard({
    item,
    isSelected,
    onMastery,
    onEdit,
    onDelete,
    onYouGlish
}: {
    item: Vocabulary;
    isSelected: boolean;
    onMastery: (id: string, level: number) => void;
    onEdit: (item: Vocabulary) => void;
    onDelete: (id: string) => void;
    onYouGlish: (item: Vocabulary) => void;
}) {
    const typeColor = TYPE_COLORS[item.type] || { bg: '#f0f0f0', text: '#666', border: '#e5e5e5' };

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: isSelected ? '0 0 0 2px #D4AF37' : '0 1px 3px rgba(0,0,0,0.06)'
        }}>
            {/* Type indicator bar */}
            <div style={{
                height: '4px',
                backgroundColor: typeColor.text
            }} />

            <div style={{ padding: '14px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '8px'
                }}>
                    <div>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                            {item.phrase}
                        </span>
                        <span style={{
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: typeColor.bg,
                            color: typeColor.text,
                            marginLeft: '8px',
                            fontWeight: '500'
                        }}>
                            {item.type}
                        </span>
                    </div>
                </div>

                {/* Meaning */}
                <div style={{ fontSize: '14px', color: '#333', marginBottom: '8px' }}>
                    {item.meaning}
                </div>

                {/* Note & Example */}
                {item.note && (
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                        {item.note}
                    </div>
                )}
                {item.example && (
                    <div style={{
                        fontSize: '12px',
                        color: '#888',
                        fontStyle: 'italic',
                        marginBottom: '10px',
                        padding: '8px 10px',
                        backgroundColor: '#f8f8f8',
                        borderRadius: '6px'
                    }}>
                        {item.example}
                    </div>
                )}

                {/* Saved YouGlish clip */}
                {item.video_text && (
                    <div style={{
                        fontSize: '12px',
                        marginBottom: '10px',
                        padding: '8px 10px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '6px',
                        border: '1px solid #bfdbfe'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px'
                        }}>
                            <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '600' }}>
                                Saved clip:
                            </span>
                            {item.video_id && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${item.video_id}&t=${Math.floor(item.video_timestamp || 0)}s`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        fontSize: '10px',
                                        color: '#dc2626',
                                        textDecoration: 'none',
                                        padding: '2px 6px',
                                        backgroundColor: '#fee2e2',
                                        borderRadius: '4px',
                                        fontWeight: '600'
                                    }}
                                >
                                    YouTube
                                </a>
                            )}
                        </div>
                        <div style={{ color: '#333', fontStyle: 'italic' }}>
                            "{item.video_text}"
                        </div>
                    </div>
                )}

                {/* Mastery & Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    {/* Mastery Level */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 1, 2, 3, 4].map(level => (
                            <button
                                key={level}
                                onClick={() => onMastery(item.id, level)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: item.mastery_level >= level ? MASTERY_COLORS[level] : '#f0f0f0',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: item.mastery_level >= level ? (level >= 3 ? '#fff' : '#666') : '#ccc',
                                }}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            onClick={() => onYouGlish(item)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #e5e5e5',
                                backgroundColor: '#fff',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            YouGlish
                        </button>
                        <button
                            onClick={() => onEdit(item)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #e5e5e5',
                                backgroundColor: '#fff',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                backgroundColor: '#fff',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: '#dc2626',
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
