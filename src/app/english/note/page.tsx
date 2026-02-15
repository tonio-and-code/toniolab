'use client';

import { useState, useMemo } from 'react';
import EnglishSidebar from '@/components/EnglishSidebar';
import { noteArticles } from '@/data/english/note-articles';

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

        if (trimmed === '---') {
            flushBlockquote();
            flushList();
            htmlParts.push('<hr>');
            continue;
        }

        if (trimmed.startsWith('> ')) {
            flushList();
            inBlockquote = true;
            blockquoteLines.push(trimmed.slice(2));
            continue;
        } else if (inBlockquote) {
            flushBlockquote();
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) {
            flushBlockquote();
            if (!inList || listType !== 'ol') {
                flushList();
                listType = 'ol';
            }
            inList = true;
            listItems.push(numberedMatch[2]);
            continue;
        }

        if (trimmed.startsWith('- ')) {
            flushBlockquote();
            if (!inList || listType !== 'ul') {
                flushList();
                listType = 'ul';
            }
            inList = true;
            listItems.push(trimmed.slice(2));
            continue;
        } else if (inList) {
            flushList();
        }

        if (trimmed.startsWith('## ')) {
            flushBlockquote();
            flushList();
            htmlParts.push(`<h2>${trimmed.slice(3)}</h2>`);
            continue;
        }

        if (trimmed === '') {
            continue;
        }

        htmlParts.push(`<p>${inlineBold(trimmed)}</p>`);
    }

    flushBlockquote();
    flushList();
    return htmlParts.join('\n');
}

function getCharCount(content: string): number {
    return content.replace(/\s/g, '').replace(/[#\-*>`]/g, '').length;
}

function getReadTime(content: string): number {
    const chars = getCharCount(content);
    return Math.max(1, Math.ceil(chars / 500));
}

function getPreviewText(content: string): string {
    const lines = content.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '' || trimmed === '---' || trimmed.startsWith('#') || trimmed.startsWith('>')) continue;
        const clean = trimmed.replace(/\*\*/g, '');
        if (clean.length > 60) return clean.slice(0, 57) + '...';
        return clean;
    }
    return '';
}

export default function NotePage() {
    const [selectedId, setSelectedId] = useState<string | null>(noteArticles[0]?.id || null);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const selected = noteArticles.find(a => a.id === selectedId);

    const stats = useMemo(() => {
        const total = noteArticles.length;
        const published = noteArticles.filter(a => a.published).length;
        const drafts = total - published;
        const totalChars = noteArticles.reduce((sum, a) => sum + getCharCount(a.content), 0);
        return { total, published, drafts, totalChars };
    }, []);

    const handleCopyForNote = async () => {
        if (!selected) return;
        const html = markdownToNoteHtml(selected.content);
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([html], { type: 'text/html' }),
                    'text/plain': new Blob([selected.content], { type: 'text/plain' }),
                }),
            ]);
            setCopyFeedback('Copied');
            setTimeout(() => setCopyFeedback(null), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = selected.content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopyFeedback('Copied (plain text)');
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
                        borderLeft: '3px solid #D4AF37',
                        paddingLeft: '16px',
                        margin: '20px 0',
                        color: '#57534e',
                        fontStyle: 'italic',
                        lineHeight: '1.8',
                    }}>
                        {blockquoteLines.map((line, i) => (
                            <span key={i}>{line}<br /></span>
                        ))}
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
                if (match.index > lastIndex) {
                    parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
                }
                parts.push(<strong key={key++} style={{ color: '#292524', fontWeight: '700' }}>{match[1]}</strong>);
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < text.length) {
                parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
            }
            return parts;
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (trimmed === '---') {
                flushBlockquote();
                elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid #e7e5e4', margin: '32px 0' }} />);
                continue;
            }

            if (trimmed.startsWith('> ')) {
                inBlockquote = true;
                blockquoteLines.push(trimmed.slice(2));
                continue;
            } else if (inBlockquote) {
                flushBlockquote();
            }

            if (trimmed.startsWith('## ')) {
                elements.push(
                    <h2 key={`h2-${i}`} style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1c1917',
                        marginTop: '40px',
                        marginBottom: '16px',
                        letterSpacing: '-0.3px',
                    }}>
                        {trimmed.slice(3)}
                    </h2>
                );
                continue;
            }

            const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
            if (numberedMatch) {
                elements.push(
                    <div key={`ol-${i}`} style={{
                        paddingLeft: '20px',
                        position: 'relative',
                        margin: '6px 0',
                        lineHeight: '1.8',
                        color: '#44403c',
                    }}>
                        <span style={{ position: 'absolute', left: '0', color: '#D4AF37', fontWeight: '600' }}>{numberedMatch[1]}.</span>
                        {renderInline(numberedMatch[2])}
                    </div>
                );
                continue;
            }

            if (trimmed.startsWith('- ')) {
                const content = trimmed.slice(2);
                elements.push(
                    <div key={`li-${i}`} style={{
                        paddingLeft: '20px',
                        position: 'relative',
                        margin: '6px 0',
                        lineHeight: '1.8',
                        color: '#44403c',
                    }}>
                        <span style={{ position: 'absolute', left: '4px', color: '#D4AF37' }}>-</span>
                        {renderInline(content)}
                    </div>
                );
                continue;
            }

            if (trimmed === '') {
                continue;
            }

            elements.push(
                <p key={`p-${i}`} style={{
                    margin: '12px 0',
                    lineHeight: '1.9',
                    color: '#44403c',
                    fontSize: '15.5px',
                }}>
                    {renderInline(trimmed)}
                </p>
            );
        }

        flushBlockquote();
        return elements;
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafaf9' }}>
            <EnglishSidebar />
            <div style={{ marginLeft: '240px', flex: 1, width: '100%' }}>
                {/* Header */}
                <div style={{
                    borderBottom: '1px solid #e7e5e4',
                    padding: '24px 40px 20px',
                    backgroundColor: '#fff',
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #D4AF37 0%, #D4AF37 20%, transparent 100%)',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', letterSpacing: '-0.5px' }}>
                                note.com Articles
                            </h1>
                            <p style={{ fontSize: '13px', color: '#78716c', marginTop: '4px' }}>
                                記事の管理とプレビュー
                            </p>
                        </div>
                    </div>
                    {/* Stats bar */}
                    <div style={{
                        display: 'flex',
                        gap: '24px',
                        marginTop: '16px',
                        alignItems: 'center',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#1c1917', letterSpacing: '1px' }}>
                            {stats.total} ARTICLES
                        </span>
                        <span style={{ width: '1px', height: '12px', backgroundColor: '#e7e5e4' }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#166534', letterSpacing: '1px' }}>
                            {stats.published} PUBLISHED
                        </span>
                        <span style={{ width: '1px', height: '12px', backgroundColor: '#e7e5e4' }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#92400e', letterSpacing: '1px' }}>
                            {stats.drafts} DRAFTS
                        </span>
                        <span style={{ width: '1px', height: '12px', backgroundColor: '#e7e5e4' }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#a8a29e', letterSpacing: '1px' }}>
                            {stats.totalChars.toLocaleString()} CHARS
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', maxWidth: '1200px' }}>
                    {/* Article List */}
                    <div style={{
                        width: '320px',
                        borderRight: '1px solid #e7e5e4',
                        backgroundColor: '#fff',
                        minHeight: 'calc(100vh - 120px)',
                        flexShrink: 0,
                        overflowY: 'auto',
                    }}>
                        {noteArticles.map(article => {
                            const isSelected = selectedId === article.id;
                            const isHovered = hoveredId === article.id;
                            const readTime = getReadTime(article.content);
                            const preview = getPreviewText(article.content);
                            return (
                                <div
                                    key={article.id}
                                    onClick={() => setSelectedId(article.id)}
                                    onMouseEnter={() => setHoveredId(article.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                        padding: '16px 20px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f5f5f4',
                                        backgroundColor: isSelected ? '#fefce8' : isHovered ? '#fafaf9' : 'transparent',
                                        borderLeft: isSelected ? '3px solid #D4AF37' : '3px solid transparent',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1c1917', lineHeight: '1.5' }}>
                                        {article.title}
                                    </div>
                                    {preview && (
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#a8a29e',
                                            marginTop: '4px',
                                            lineHeight: '1.5',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {preview}
                                        </div>
                                    )}
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#a8a29e',
                                        marginTop: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        <span>{article.date}</span>
                                        <span style={{ color: '#d6d3d1' }}>|</span>
                                        <span>{readTime} min</span>
                                        <span style={{ color: '#d6d3d1' }}>|</span>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}>
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: article.published ? '#22c55e' : '#f59e0b',
                                                display: 'inline-block',
                                            }} />
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                color: article.published ? '#166534' : '#92400e',
                                                textTransform: 'uppercase' as const,
                                                letterSpacing: '0.5px',
                                            }}>
                                                {article.published ? 'published' : 'draft'}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Article Preview */}
                    <div style={{ flex: 1, padding: '40px', maxWidth: '720px' }}>
                        {selected ? (
                            <>
                                {/* Preview header */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '16px',
                                    }}>
                                        <div style={{ fontSize: '12px', color: '#a8a29e' }}>
                                            {selected.date}
                                            {selected.published && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    backgroundColor: '#dcfce7',
                                                    color: '#166534',
                                                    letterSpacing: '0.5px',
                                                }}>
                                                    PUBLISHED
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {selected.noteUrl && (
                                                <a
                                                    href={selected.noteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        padding: '6px 14px',
                                                        backgroundColor: '#fff',
                                                        color: '#44403c',
                                                        border: '1px solid #e7e5e4',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        textDecoration: 'none',
                                                        transition: 'all 0.15s ease',
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    note.com
                                                </a>
                                            )}
                                            <button
                                                onClick={handleCopyForNote}
                                                style={{
                                                    padding: '6px 14px',
                                                    backgroundColor: copyFeedback ? '#166534' : '#D4AF37',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                }}
                                            >
                                                {copyFeedback || 'note.com用にコピー'}
                                            </button>
                                        </div>
                                    </div>
                                    <h1 style={{
                                        fontSize: '28px',
                                        fontWeight: '800',
                                        color: '#1c1917',
                                        lineHeight: '1.45',
                                        letterSpacing: '-0.5px',
                                    }}>
                                        {selected.title}
                                    </h1>
                                    {selected.subtitle && (
                                        <p style={{
                                            fontSize: '15px',
                                            color: '#78716c',
                                            marginTop: '10px',
                                            lineHeight: '1.6',
                                            borderLeft: '2px solid #e7e5e4',
                                            paddingLeft: '12px',
                                        }}>
                                            {selected.subtitle}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
                                        {selected.tags.map(tag => (
                                            <span key={tag} style={{
                                                padding: '3px 10px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: '500',
                                                backgroundColor: '#fafaf9',
                                                color: '#78716c',
                                                border: '1px solid #f5f5f4',
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Article body */}
                                <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '24px' }}>
                                    {selected.content ? renderMarkdown(selected.content) : (
                                        <div style={{
                                            padding: '40px 0',
                                            textAlign: 'center',
                                            color: '#a8a29e',
                                            fontSize: '14px',
                                        }}>
                                            下書き準備中
                                        </div>
                                    )}
                                </div>

                                {/* Article footer */}
                                {selected.content && (
                                    <div style={{
                                        borderTop: '1px solid #f5f5f4',
                                        marginTop: '40px',
                                        paddingTop: '16px',
                                        display: 'flex',
                                        gap: '20px',
                                        alignItems: 'center',
                                    }}>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#a8a29e', letterSpacing: '0.5px' }}>
                                            {getCharCount(selected.content).toLocaleString()} chars
                                        </span>
                                        <span style={{ width: '1px', height: '10px', backgroundColor: '#e7e5e4' }} />
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#a8a29e', letterSpacing: '0.5px' }}>
                                            {getReadTime(selected.content)} min read
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ color: '#a8a29e', fontSize: '14px' }}>
                                記事を選択してください
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
