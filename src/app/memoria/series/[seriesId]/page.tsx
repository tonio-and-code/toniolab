'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MemoriaStorage } from '@/lib/memoria-storage';
import { MemoriaEntry } from '@/types/memoria';

type ThemeMode = 'dark' | 'light';

const themes = {
    dark: {
        bg: '#0a0a0a',
        bgSecondary: '#1a1a1a',
        bgTertiary: '#141414',
        text: '#fff',
        textSecondary: '#888',
        textMuted: '#666',
        border: '#1a1a1a',
        borderLight: '#333',
        accent: '#D4AF37',
        success: '#10b981',
    },
    light: {
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
    },
};

const seriesInfo: Record<string, { title: string; description: string; sourceJournal?: string }> = {
    'ego-trap': {
        title: 'エゴの罠シリーズ',
        description: 'Journal #071より。アジャシャンティ批判を通じて、批判すること自体がエゴの罠だと気づく物語。',
        sourceJournal: '071',
    },
    'skeleton-talk': {
        title: 'Skeleton Talk -- 会話の骨格',
        description: '4時間の実際の会話を英語にポーティング。10の日本語スピーチパターンがそのまま英語になる実験。Journal #115より。',
        sourceJournal: '115',
    },
};

export default function SeriesPage() {
    const params = useParams();
    const seriesId = params.seriesId as string;
    const [entries, setEntries] = useState<MemoriaEntry[]>([]);
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

    const info = seriesInfo[seriesId] || { title: seriesId, description: '' };

    useEffect(() => {
        const loadEntries = async () => {
            const allEntries = await MemoriaStorage.getAll();
            const seriesEntries = allEntries
                .filter(e => e.series === seriesId)
                .sort((a, b) => a.id.localeCompare(b.id));
            setEntries(seriesEntries);
        };
        loadEntries();

        const savedTheme = localStorage.getItem('english_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
    }, [seriesId]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('english_theme', newTheme);
    };

    const t = themes[theme];

    const totalLines = entries.reduce((sum, e) => sum + (e.conversation?.english?.length || 0), 0);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/memoria" style={{ color: t.textMuted, textDecoration: 'none', fontSize: '13px' }}>
                    &#8249; Memoria
                </Link>
                <button
                    onClick={toggleTheme}
                    style={{ background: 'none', border: `1px solid ${t.borderLight}`, color: t.textMuted, cursor: 'pointer', padding: '6px 10px', borderRadius: '6px', fontSize: '11px' }}
                >
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
            </div>

            {/* Series Header */}
            <div style={{ padding: '32px 24px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ fontSize: '11px', color: t.accent, marginBottom: '8px', letterSpacing: '0.5px' }}>
                    SERIES
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                    {info.title}
                </h1>
                <p style={{ fontSize: '14px', color: t.textSecondary, lineHeight: '1.6', marginBottom: '16px' }}>
                    {info.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: t.textMuted }}>
                    <span>{entries.length} episodes</span>
                    <span>{totalLines} lines</span>
                    {info.sourceJournal && (
                        <Link
                            href={`/journal/${info.sourceJournal}`}
                            style={{ color: t.accent, textDecoration: 'none' }}
                        >
                            Source: Journal #{info.sourceJournal}
                        </Link>
                    )}
                </div>
            </div>

            {/* Play All Button */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${t.border}` }}>
                <Link
                    href={entries[0] ? `/memoria/${entries[0].id}?autoNext=true` : '#'}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        backgroundColor: t.accent,
                        color: '#000',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                >
                    <span style={{ fontSize: '16px' }}>&#9658;</span>
                    Play All
                </Link>
            </div>

            {/* Episode List */}
            <div style={{ padding: '16px 0' }}>
                {entries.map((entry, index) => (
                    <Link
                        key={entry.id}
                        href={`/memoria/${entry.id}`}
                        style={{
                            display: 'block',
                            padding: '16px 24px',
                            borderBottom: `1px solid ${t.border}`,
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = t.bgSecondary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Episode Number */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: t.bgTertiary,
                                border: `1px solid ${t.borderLight}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                color: t.textMuted,
                                flexShrink: 0,
                            }}>
                                {index + 1}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                                    {entry.title}
                                </div>
                                <div style={{ fontSize: '13px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {entry.content}
                                </div>
                            </div>

                            {/* Line Count */}
                            <div style={{ fontSize: '12px', color: t.textMuted, flexShrink: 0 }}>
                                {entry.conversation?.english?.length || 0} lines
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {entries.length === 0 && (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: t.textMuted }}>
                    No episodes found in this series.
                </div>
            )}
        </div>
    );
}
