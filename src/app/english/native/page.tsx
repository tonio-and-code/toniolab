'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllDates, getDailyContent, type DailyContent } from '@/data/daily-english';

const theme = {
    bg: '#f5f5f5',
    bgSecondary: '#ffffff',
    bgTertiary: '#fafafa',
    text: '#1a1a1a',
    textSecondary: '#555',
    textMuted: '#666',
    border: '#e5e5e5',
    borderLight: '#d5d5d5',
    accent: '#B8960C',
    success: '#059669',
    cyan: '#0891b2',
};

const getDayOfWeek = (dateStr: string): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateStr).getDay()];
};

const formatDate = (dateStr: string): { month: string; day: string } => {
    const date = new Date(dateStr);
    return {
        month: String(date.getMonth() + 1),
        day: String(date.getDate())
    };
};

export default function NativeDialoguesPage() {
    const router = useRouter();
    const [dailyContents, setDailyContents] = useState<DailyContent[]>([]);

    useEffect(() => {
        // Load all dates and their content
        const dates = getAllDates();
        const contents = dates.map(date => getDailyContent(date)).filter(Boolean) as DailyContent[];
        setDailyContents(contents);
    }, []);

    const t = theme;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link href="/english" style={{ color: t.textMuted, textDecoration: 'none', fontSize: '13px' }}>
                    &#8249; English
                </Link>
            </div>

            <div style={{ padding: '0 24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Hero */}
                <div style={{ padding: '32px 0', marginBottom: '24px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: t.cyan,
                        color: '#fff',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '16px'
                    }}>
                        DAILY PRACTICE
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 12px 0' }}>
                        Native English
                    </h1>
                    <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: '1.6', margin: 0 }}>
                        Real topics. Real opinions. Natural English.
                    </p>
                </div>

                {/* Philosophy Box */}
                <div style={{
                    backgroundColor: t.bgSecondary,
                    borderRadius: '16px',
                    padding: '24px',
                    border: `1px solid ${t.borderLight}`,
                    marginBottom: '32px'
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: t.cyan,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '12px',
                        fontWeight: '600'
                    }}>
                        Why This Matters
                    </div>
                    <p style={{ fontSize: '14px', color: t.textSecondary, lineHeight: '1.8', margin: '0 0 16px 0' }}>
                        Generic dialogues like "ordering coffee" or "asking for directions" are useless. You can already do that.
                    </p>
                    <p style={{ fontSize: '14px', color: t.text, lineHeight: '1.8', margin: '0 0 16px 0', fontWeight: '500' }}>
                        What you actually need is to discuss real topics with real opinions. The kind of conversations that matter.
                    </p>
                    <p style={{ fontSize: '14px', color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                        Each day: one topic discussion + everyday expressions. Memorize what resonates with you.
                    </p>
                </div>

                {/* Quick Start - Latest Day */}
                {dailyContents.length > 0 && (
                    <button
                        onClick={() => router.push(`/english/native/${dailyContents[0].date}`)}
                        style={{
                            width: '100%',
                            padding: '18px',
                            marginBottom: '24px',
                            backgroundColor: t.cyan,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        Start Today's Practice
                    </button>
                )}

                {/* Date List */}
                <h2 style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: t.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '16px'
                }}>
                    Daily Content ({dailyContents.length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '60px' }}>
                    {dailyContents.map((content) => {
                        const { month, day } = formatDate(content.date);
                        const dayOfWeek = getDayOfWeek(content.date);

                        return (
                            <Link
                                key={content.date}
                                href={`/english/native/${content.date}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={{
                                    backgroundColor: t.bgSecondary,
                                    borderRadius: '14px',
                                    padding: '16px 20px',
                                    border: `1px solid ${t.borderLight}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    transition: 'all 0.15s'
                                }}>
                                    {/* Date Box */}
                                    <div style={{
                                        width: '52px',
                                        height: '52px',
                                        borderRadius: '12px',
                                        backgroundColor: t.cyan + '20',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <span style={{
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            color: t.cyan,
                                            lineHeight: 1
                                        }}>
                                            {day}
                                        </span>
                                        <span style={{
                                            fontSize: '10px',
                                            color: t.cyan,
                                            fontWeight: '600'
                                        }}>
                                            {dayOfWeek}
                                        </span>
                                    </div>

                                    {/* Content Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '15px',
                                            color: t.text,
                                            fontWeight: '500',
                                            marginBottom: '4px'
                                        }}>
                                            {content.discussion.topic}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: t.textMuted,
                                            marginBottom: '6px'
                                        }}>
                                            {content.discussion.topicJa}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            fontSize: '11px',
                                            color: t.textSecondary
                                        }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                backgroundColor: t.bgTertiary,
                                                borderRadius: '10px'
                                            }}>
                                                {content.discussion.lines.length} lines
                                            </span>
                                            <span style={{
                                                padding: '2px 8px',
                                                backgroundColor: t.bgTertiary,
                                                borderRadius: '10px'
                                            }}>
                                                {content.expressions.length} expressions
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill={t.textMuted}>
                                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {dailyContents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No content yet</div>
                        <p style={{ fontSize: '14px', color: t.textMuted }}>Daily content will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
