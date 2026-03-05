'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import EnglishSidebar from '@/components/EnglishSidebar';
import { noteArticles, type NoteArticle } from '@/data/english/note-articles';

function markdownToNoteHtml(text: string): string {
    const lines = text.split('\n');
    const htmlParts: string[] = [];
    let inBlockquote = false;
    let blockquoteLines: string[] = [];
    let inList = false;
    let listItems: string[] = [];
    let listType: 'ul' | 'ol' = 'ul';

    const inlineBold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    const flushBlockquote = () => {
        if (blockquoteLines.length > 0) {
            htmlParts.push(`<blockquote>${blockquoteLines.map(l => inlineBold(l)).join('<br>')}</blockquote>`);
            blockquoteLines = [];
        }
        inBlockquote = false;
    };

    const flushList = () => {
        if (listItems.length > 0) {
            const tag = listType;
            htmlParts.push(`<${tag}>${listItems.map(l => `<li>${inlineBold(l)}</li>`).join('')}</${tag}>`);
            listItems = [];
        }
        inList = false;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (trimmed === '---') { flushBlockquote(); flushList(); htmlParts.push('<hr>'); continue; }
        if (trimmed.startsWith('> ')) { flushList(); inBlockquote = true; blockquoteLines.push(trimmed.slice(2)); continue; } else if (inBlockquote) { flushBlockquote(); }
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) { flushBlockquote(); if (!inList || listType !== 'ol') { flushList(); listType = 'ol'; } inList = true; listItems.push(numberedMatch[2]); continue; }
        if (trimmed.startsWith('- ')) { flushBlockquote(); if (!inList || listType !== 'ul') { flushList(); listType = 'ul'; } inList = true; listItems.push(trimmed.slice(2)); continue; } else if (inList) { flushList(); }
        if (trimmed.startsWith('## ')) { flushBlockquote(); flushList(); htmlParts.push(`<h2>${trimmed.slice(3)}</h2>`); continue; }
        if (trimmed === '') continue;
        htmlParts.push(`<p>${inlineBold(trimmed)}</p>`);
    }
    flushBlockquote(); flushList();
    return htmlParts.join('\n');
}

function getCharCount(content: string): number {
    return content.replace(/\s/g, '').replace(/[#\-*>`]/g, '').length;
}

function getReadTime(content: string): number {
    return Math.max(1, Math.ceil(getCharCount(content) / 500));
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function parseDate(dateStr: string): { year: number; month: number; day: number } {
    const [y, m, d] = dateStr.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
}

export default function NotePage() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const detailRef = useRef<HTMLDivElement>(null);

    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();
    const isCurrentMonth = viewYear === todayYear && viewMonth === todayMonth;

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();

    const monthLabel = `${viewYear}年 ${viewMonth + 1}月`;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const publishedArticles = useMemo(() => noteArticles.filter(a => a.published), []);
    const draftArticles = useMemo(() => noteArticles.filter(a => !a.published), []);

    const articlesByDate = useMemo(() => {
        const map: Record<string, NoteArticle[]> = {};
        publishedArticles.forEach(a => {
            if (!map[a.date]) map[a.date] = [];
            map[a.date].push(a);
        });
        return map;
    }, [publishedArticles]);

    const stats = useMemo(() => {
        const total = noteArticles.length;
        const published = noteArticles.filter(a => a.published).length;
        return { total, published, drafts: total - published };
    }, []);

    // Auto-select today or most recent published article
    useEffect(() => {
        if (selectedDate !== null || selectedArticleId !== null) return;
        const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;
        if (articlesByDate[todayStr]) {
            setSelectedDate(todayStr);
            setSelectedArticleId(articlesByDate[todayStr][0].id);
        } else if (publishedArticles.length > 0) {
            const sorted = [...publishedArticles].sort((a, b) => b.date.localeCompare(a.date));
            const latest = sorted[0];
            setSelectedDate(latest.date);
            setSelectedArticleId(latest.id);
            const parsed = parseDate(latest.date);
            setViewYear(parsed.year);
            setViewMonth(parsed.month);
        }
    }, []);

    useEffect(() => {
        if (detailRef.current) detailRef.current.scrollTop = 0;
    }, [selectedDate, selectedArticleId]);

    const selectedArticle = selectedArticleId
        ? noteArticles.find(a => a.id === selectedArticleId) || null
        : null;
    const selectedArticles = selectedDate ? (articlesByDate[selectedDate] || []) : [];

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };
    const goToday = () => {
        setViewYear(todayYear);
        setViewMonth(todayMonth);
        const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;
        if (articlesByDate[todayStr]) {
            setSelectedDate(todayStr);
            setSelectedArticleId(articlesByDate[todayStr][0].id);
        }
    };

    const handleCopyForNote = async () => {
        if (!selectedArticle) return;
        const html = markdownToNoteHtml(selectedArticle.content);
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([html], { type: 'text/html' }),
                    'text/plain': new Blob([selectedArticle.content], { type: 'text/plain' }),
                }),
            ]);
            setCopyFeedback('Copied');
            setTimeout(() => setCopyFeedback(null), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = selectedArticle.content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopyFeedback('Copied (text)');
            setTimeout(() => setCopyFeedback(null), 2000);
        }
    };

    const renderMarkdown = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let inBlockquote = false;
        let blockquoteLines: string[] = [];

        const flushBlockquote = () => {
            if (blockquoteLines.length > 0) {
                elements.push(
                    <blockquote key={`bq-${elements.length}`} style={{
                        borderLeft: '3px solid #D4AF37', paddingLeft: '16px',
                        margin: '20px 0', color: '#57534e', fontStyle: 'italic', lineHeight: '1.8',
                    }}>
                        {blockquoteLines.map((line, i) => <span key={i}>{line}<br /></span>)}
                    </blockquote>
                );
                blockquoteLines = [];
            }
            inBlockquote = false;
        };

        const renderInline = (text: string): React.ReactNode[] => {
            const parts: React.ReactNode[] = [];
            const regex = /\*\*(.+?)\*\*/g;
            let lastIndex = 0;
            let match;
            let key = 0;
            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
                parts.push(<strong key={key++} style={{ color: '#292524', fontWeight: '700' }}>{match[1]}</strong>);
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < text.length) parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
            return parts;
        };

        for (let i = 0; i < lines.length; i++) {
            const trimmed = lines[i].trim();
            if (trimmed === '---') { flushBlockquote(); elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid #e7e5e4', margin: '28px 0' }} />); continue; }
            if (trimmed.startsWith('> ')) { inBlockquote = true; blockquoteLines.push(trimmed.slice(2)); continue; } else if (inBlockquote) { flushBlockquote(); }
            if (trimmed.startsWith('## ')) { elements.push(<h2 key={`h2-${i}`} style={{ fontSize: '18px', fontWeight: '700', color: '#1c1917', marginTop: '32px', marginBottom: '12px' }}>{trimmed.slice(3)}</h2>); continue; }
            const nm = trimmed.match(/^(\d+)\.\s+(.+)/);
            if (nm) { elements.push(<div key={`ol-${i}`} style={{ paddingLeft: '20px', position: 'relative', margin: '6px 0', lineHeight: '1.8', color: '#44403c' }}><span style={{ position: 'absolute', left: '0', color: '#D4AF37', fontWeight: '600' }}>{nm[1]}.</span>{renderInline(nm[2])}</div>); continue; }
            if (trimmed.startsWith('- ')) { elements.push(<div key={`li-${i}`} style={{ paddingLeft: '20px', position: 'relative', margin: '6px 0', lineHeight: '1.8', color: '#44403c' }}><span style={{ position: 'absolute', left: '4px', color: '#D4AF37' }}>-</span>{renderInline(trimmed.slice(2))}</div>); continue; }
            if (trimmed === '') continue;
            elements.push(<p key={`p-${i}`} style={{ margin: '10px 0', lineHeight: '1.9', color: '#44403c', fontSize: '15px' }}>{renderInline(trimmed)}</p>);
        }
        flushBlockquote();
        return elements;
    };

    // Build calendar grid
    const calendarCells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
    while (calendarCells.length % 7 !== 0) calendarCells.push(null);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <EnglishSidebar />
            <div style={{
                marginLeft: isMobile ? 0 : '240px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    padding: '12px 20px',
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0,
                }}>
                    {/* Left: Stats */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: '#1c1917', letterSpacing: '-0.3px' }}>
                            note.com Articles
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#166534' }}>
                            {stats.published} published
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#92400e' }}>
                            {stats.drafts} drafts
                        </span>
                    </div>

                    {/* Center: Month nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={prevMonth} style={{
                            background: 'none', border: '1px solid #ddd', borderRadius: '6px',
                            padding: '4px 10px', cursor: 'pointer', fontSize: '14px', color: '#666',
                        }}>&#8249;</button>
                        <span style={{
                            fontSize: '15px', fontWeight: '700', color: '#1a1a1a',
                            minWidth: '110px', textAlign: 'center',
                        }}>{monthLabel}</span>
                        <button onClick={nextMonth} style={{
                            background: 'none', border: '1px solid #ddd', borderRadius: '6px',
                            padding: '4px 10px', cursor: 'pointer', fontSize: '14px', color: '#666',
                        }}>&#8250;</button>
                    </div>

                    {/* Right: Today + Thumb */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {!isCurrentMonth && (
                            <button onClick={goToday} style={{
                                background: '#D4AF37', border: 'none', color: '#fff',
                                padding: '6px 14px', borderRadius: '8px', fontSize: '12px',
                                fontWeight: '600', cursor: 'pointer',
                            }}>今日</button>
                        )}
                        <a href="/thumb-generator.html" target="_blank" rel="noopener noreferrer" style={{
                            padding: '6px 12px', backgroundColor: '#1c1917', color: '#D4AF37',
                            border: 'none', borderRadius: '8px', fontSize: '10px', fontWeight: '700',
                            textDecoration: 'none', letterSpacing: '0.5px',
                        }}>Thumb</a>
                    </div>
                </div>

                {/* Main content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    overflow: 'hidden',
                    minHeight: 0,
                }}>
                    {/* Left: Calendar */}
                    <div style={{
                        flex: isMobile ? 'none' : '1',
                        height: isMobile ? '50%' : '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        borderRight: isMobile ? 'none' : '1px solid #e5e5e5',
                    }}>
                        {/* Day headers */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                            borderBottom: '1px solid #eee', flexShrink: 0,
                        }}>
                            {WEEKDAYS.map((d, i) => (
                                <div key={d} style={{
                                    textAlign: 'center', fontSize: '11px', fontWeight: '600',
                                    color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#666',
                                    padding: '8px 0',
                                }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: '2px', padding: '4px', backgroundColor: '#f0f0f0',
                            flex: 1,
                        }}>
                            {calendarCells.map((day, i) => {
                                if (day === null) {
                                    return <div key={`empty-${i}`} style={{ backgroundColor: '#fafafa', borderRadius: '4px' }} />;
                                }

                                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayArticles = articlesByDate[dateStr] || [];
                                const count = dayArticles.length;
                                const isToday = isCurrentMonth && day === todayDate;
                                const isSelected = selectedDate === dateStr;
                                const dayOfWeek = (firstDay + day - 1) % 7;
                                // All calendar articles are published (drafts shown separately)
                                const accentColor = count > 0 ? '#22c55e' : 'transparent';

                                return (
                                    <div
                                        key={day}
                                        onClick={() => {
                                            if (count > 0) {
                                                setSelectedDate(dateStr);
                                                setSelectedArticleId(dayArticles[0].id);
                                            }
                                        }}
                                        style={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: '4px',
                                            cursor: count > 0 ? 'pointer' : 'default',
                                            backgroundColor: isSelected ? '#FFFBEB' : '#fff',
                                            boxShadow: isSelected
                                                ? '0 0 0 2px #D4AF37'
                                                : isToday
                                                    ? '0 0 0 2px #10b981'
                                                    : 'none',
                                            transition: 'box-shadow 0.15s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minHeight: 0,
                                        }}
                                    >
                                        {/* Color bar at top for articles */}
                                        {count > 0 && (
                                            <div style={{
                                                height: '3px',
                                                backgroundColor: accentColor,
                                                flexShrink: 0,
                                            }} />
                                        )}

                                        {/* Day number */}
                                        <div style={{
                                            padding: '3px 6px 0',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: isToday
                                                ? '#D4AF37'
                                                : count > 0
                                                    ? dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#1a1a1a'
                                                    : dayOfWeek === 0 ? 'rgba(239,68,68,0.3)' : dayOfWeek === 6 ? 'rgba(59,130,246,0.3)' : '#ccc',
                                            flexShrink: 0,
                                        }}>
                                            {day}
                                        </div>

                                        {/* Article titles inside cell */}
                                        {count > 0 && (
                                            <div style={{
                                                flex: 1,
                                                padding: '2px 6px 4px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                            }}>
                                                {dayArticles.slice(0, 3).map((a, idx) => (
                                                    <div key={a.id} style={{
                                                        fontSize: '10px',
                                                        fontWeight: '600',
                                                        color: '#166534',
                                                        lineHeight: '1.3',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: idx === 0 ? 2 : 1,
                                                        WebkitBoxOrient: 'vertical' as const,
                                                    }}>
                                                        {a.title}
                                                    </div>
                                                ))}
                                                {count > 3 && (
                                                    <div style={{
                                                        fontSize: '9px', fontWeight: '700',
                                                        color: '#D4AF37', marginTop: '1px',
                                                    }}>
                                                        +{count - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Drafts section */}
                        {draftArticles.length > 0 && (
                            <div style={{
                                borderTop: '1px solid #e5e5e5',
                                flexShrink: 0,
                            }}>
                                <div style={{
                                    padding: '10px 14px 6px',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <span style={{
                                        fontSize: '11px', fontWeight: '700', color: '#92400e',
                                        letterSpacing: '0.5px',
                                    }}>DRAFTS</span>
                                    <span style={{
                                        fontSize: '10px', fontWeight: '600', color: '#a8a29e',
                                    }}>{draftArticles.length}</span>
                                </div>
                                <div style={{ padding: '0 8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    {draftArticles.map(a => {
                                        const isActive = selectedArticleId === a.id;
                                        return (
                                            <div
                                                key={a.id}
                                                onClick={() => {
                                                    setSelectedDate(null);
                                                    setSelectedArticleId(a.id);
                                                }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '8px 10px', borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    backgroundColor: isActive ? '#FFFBEB' : 'transparent',
                                                    boxShadow: isActive ? '0 0 0 1px #D4AF37' : 'none',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <span style={{
                                                    fontSize: '10px', fontWeight: '700', color: '#f59e0b',
                                                    backgroundColor: '#fef3c7', padding: '2px 6px',
                                                    borderRadius: '3px', flexShrink: 0,
                                                }}>#{a.id}</span>
                                                <span style={{
                                                    fontSize: '12px', fontWeight: '600',
                                                    color: isActive ? '#1c1917' : '#57534e',
                                                    overflow: 'hidden', whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis', flex: 1,
                                                }}>{a.title}</span>
                                                <span style={{
                                                    fontSize: '10px', color: '#a8a29e', flexShrink: 0,
                                                }}>{getCharCount(a.content).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Article detail panel */}
                    <div
                        ref={detailRef}
                        style={{
                            flex: isMobile ? 'none' : '0 0 520px',
                            height: isMobile ? '50%' : '100%',
                            overflowY: 'auto',
                            backgroundColor: '#fafafa',
                            borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                        }}
                    >
                        {selectedArticle ? (
                            <div style={{ padding: '20px 24px' }}>
                                {/* Top: date + actions */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: '12px',
                                }}>
                                    <div style={{
                                        fontSize: '12px', color: '#888', fontWeight: '500',
                                    }}>
                                        {selectedDate && (() => {
                                            const p = parseDate(selectedDate);
                                            return `${p.month + 1}月${p.day}日`;
                                        })()}
                                        {selectedArticles.length > 1 && (
                                            <span> - {selectedArticles.length} articles</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {selectedArticle.noteUrl && (
                                            <a href={selectedArticle.noteUrl} target="_blank" rel="noopener noreferrer" style={{
                                                padding: '5px 12px', backgroundColor: '#fff', color: '#44403c',
                                                border: '1px solid #e7e5e4', borderRadius: '6px', fontSize: '11px',
                                                fontWeight: '600', textDecoration: 'none',
                                            }}>note.com</a>
                                        )}
                                        <button onClick={handleCopyForNote} style={{
                                            padding: '5px 12px',
                                            backgroundColor: copyFeedback ? '#166534' : '#D4AF37',
                                            color: '#fff', border: 'none', borderRadius: '6px',
                                            fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                                            transition: 'all 0.15s',
                                        }}>
                                            {copyFeedback || 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                {/* Article tabs if multiple on same day */}
                                {selectedArticles.length > 1 && (
                                    <div style={{
                                        display: 'flex', gap: '4px', marginBottom: '16px',
                                        flexWrap: 'wrap',
                                    }}>
                                        {selectedArticles.map(a => {
                                            const isActive = a.id === selectedArticle.id;
                                            return (
                                                <button key={a.id} onClick={() => setSelectedArticleId(a.id)} style={{
                                                    padding: '5px 12px', borderRadius: '6px',
                                                    border: isActive ? '1px solid #D4AF37' : '1px solid #e5e5e5',
                                                    backgroundColor: isActive ? '#FFFBEB' : '#fff',
                                                    color: isActive ? '#D4AF37' : '#888',
                                                    fontSize: '11px', fontWeight: '600',
                                                    cursor: 'pointer', transition: 'all 0.15s',
                                                    maxWidth: '200px', overflow: 'hidden',
                                                    whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                                }}>
                                                    #{a.id} {a.title.slice(0, 24)}{a.title.length > 24 ? '...' : ''}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Status + tags */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    marginBottom: '12px', flexWrap: 'wrap',
                                }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        padding: '3px 10px', borderRadius: '4px',
                                        fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px',
                                        backgroundColor: selectedArticle.published ? '#dcfce7' : '#fef3c7',
                                        color: selectedArticle.published ? '#166534' : '#92400e',
                                    }}>
                                        <span style={{
                                            width: 5, height: 5, borderRadius: '50%',
                                            backgroundColor: selectedArticle.published ? '#22c55e' : '#f59e0b',
                                        }} />
                                        {selectedArticle.published ? 'PUBLISHED' : 'DRAFT'}
                                    </span>
                                    {selectedArticle.tags.map(tag => (
                                        <span key={tag} style={{
                                            padding: '3px 10px', borderRadius: '4px',
                                            fontSize: '10px', fontWeight: '500',
                                            backgroundColor: '#fff', color: '#78716c',
                                            border: '1px solid #e5e5e5',
                                        }}>{tag}</span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h1 style={{
                                    fontSize: '22px', fontWeight: '800', color: '#1c1917',
                                    lineHeight: '1.45', letterSpacing: '-0.5px', margin: '0 0 8px 0',
                                }}>
                                    {selectedArticle.title}
                                </h1>
                                {selectedArticle.subtitle && (
                                    <p style={{
                                        fontSize: '13px', color: '#78716c', lineHeight: '1.6',
                                        borderLeft: '2px solid #e7e5e4', paddingLeft: '10px',
                                        margin: '0 0 12px 0',
                                    }}>{selectedArticle.subtitle}</p>
                                )}

                                {/* Meta */}
                                {selectedArticle.content && (
                                    <div style={{
                                        display: 'flex', gap: '12px', alignItems: 'center',
                                        marginBottom: '16px',
                                    }}>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#A8A29E' }}>
                                            {getCharCount(selectedArticle.content).toLocaleString()} chars
                                        </span>
                                        <span style={{ width: '1px', height: '10px', backgroundColor: '#e7e5e4' }} />
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#A8A29E' }}>
                                            {getReadTime(selectedArticle.content)} min read
                                        </span>
                                    </div>
                                )}

                                {/* Article body */}
                                <div style={{
                                    borderTop: '1px solid #e7e5e4', paddingTop: '20px',
                                    backgroundColor: '#fff', borderRadius: '12px',
                                    padding: '24px', marginTop: '4px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                }}>
                                    {selectedArticle.content ? renderMarkdown(selectedArticle.content) : (
                                        <div style={{
                                            padding: '40px 0', textAlign: 'center',
                                            color: '#a8a29e', fontSize: '14px',
                                        }}>下書き準備中</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                height: '100%', padding: '32px', textAlign: 'center',
                            }}>
                                <div style={{
                                    fontSize: '14px', fontWeight: '600', color: '#333',
                                    marginBottom: '8px',
                                }}>note.com Articles</div>
                                <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>
                                    カレンダーから日付を選択
                                </div>
                                <div style={{
                                    marginTop: '16px', padding: '8px 16px',
                                    backgroundColor: '#fff', borderRadius: '8px',
                                    border: '1px solid #e5e5e5', fontSize: '11px', color: '#666',
                                }}>{stats.total} articles</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
