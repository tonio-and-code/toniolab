'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { journalEntries } from '@/data/journal';
import { useState, useEffect } from 'react';

type PlayMode = 'manual' | 'auto' | 'shuffle';

export default function EnglishJournalPage() {
    const router = useRouter();
    const [playMode, setPlayMode] = useState<PlayMode>('manual');
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const savedPlayMode = localStorage.getItem('player_playMode') as PlayMode;
        if (savedPlayMode) {
            setPlayMode(savedPlayMode);
        }
        setSettingsLoaded(true);
    }, []);

    // Save settings when changed
    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('player_playMode', playMode);
    }, [playMode, settingsLoaded]);

    // Filter entries that have English summaries
    const entriesWithEnglish = journalEntries
        .filter(entry => entry.englishSummary)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate total tracks for an entry
    const getTrackCount = (entry: typeof entriesWithEnglish[0]) => {
        if (!entry.englishSummary) return 0;
        return entry.englishSummary.sections.reduce((sum: number, s: any) => sum + (s.paragraphs?.length || 0), 0);
    };

    const totalTracks = entriesWithEnglish.reduce((sum, e) => sum + getTrackCount(e), 0);

    const handleArticleClick = (entryId: string) => {
        if (playMode === 'shuffle') {
            const randomEntry = entriesWithEnglish[Math.floor(Math.random() * entriesWithEnglish.length)];
            router.push(`/english/journal/${randomEntry.id}?autoplay=true`);
        } else if (playMode === 'auto') {
            router.push(`/english/journal/${entryId}?autoplay=true`);
        } else {
            router.push(`/english/journal/${entryId}`);
        }
    };

    const startPlayback = () => {
        if (entriesWithEnglish.length === 0) return;

        if (playMode === 'shuffle') {
            const randomEntry = entriesWithEnglish[Math.floor(Math.random() * entriesWithEnglish.length)];
            router.push(`/english/journal/${randomEntry.id}?autoplay=true`);
        } else {
            router.push(`/english/journal/${entriesWithEnglish[0].id}?autoplay=true`);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}`;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 80px' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <Link
                        href="/english"
                        style={{ color: '#78716C', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '20px' }}
                    >
                        &#8249; Back
                    </Link>

                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1C1917', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                        English Journal
                    </h1>
                    <p style={{ fontSize: '14px', color: '#78716C', margin: 0 }}>
                        {entriesWithEnglish.length} articles / {totalTracks} tracks
                    </p>
                </div>

                {/* Play Control Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '28px',
                    padding: '12px 16px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #E7E5E4',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {(['manual', 'auto', 'shuffle'] as PlayMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setPlayMode(mode)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px',
                                    transition: 'all 0.15s ease',
                                    backgroundColor: playMode === mode ? '#D4AF37' : 'transparent',
                                    color: playMode === mode ? '#fff' : '#78716C',
                                }}
                            >
                                {mode === 'manual' ? 'MANUAL' : mode === 'auto' ? 'AUTO' : 'SHUFFLE'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={startPlayback}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            backgroundColor: '#1C1917',
                            color: '#fff',
                            transition: 'opacity 0.15s ease',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        Play
                    </button>
                </div>

                {/* Articles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {entriesWithEnglish.map((entry) => {
                        const trackCount = getTrackCount(entry);
                        const title = entry.englishSummary?.title || entry.title;

                        return (
                            <article
                                key={entry.id}
                                onClick={() => handleArticleClick(entry.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'stretch',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '1px solid #E7E5E4',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#D4AF37';
                                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(212, 175, 55, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#E7E5E4';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Thumbnail */}
                                {entry.heroImage ? (
                                    <div style={{ width: '88px', minHeight: '88px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={entry.heroImage}
                                            alt={title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{
                                        width: '88px',
                                        minHeight: '88px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#F5F5F4',
                                    }}>
                                        <span style={{ fontSize: '24px', fontWeight: '200', color: '#D4AF37', fontFamily: 'serif' }}>
                                            {entry.id}
                                        </span>
                                    </div>
                                )}

                                {/* Content */}
                                <div style={{ flex: 1, padding: '12px 16px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#D4AF37' }}>
                                            #{entry.id}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#A8A29E' }}>
                                            {formatDate(entry.date)}
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#1C1917',
                                        margin: '0 0 6px',
                                        lineHeight: '1.4',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {title}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#A8A29E' }}>
                                        <span>{trackCount} tracks</span>
                                        <span>{entry.englishSummary?.readTime || entry.readTime} min</span>
                                    </div>
                                </div>

                                {/* Play hint */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingRight: '16px',
                                    flexShrink: 0,
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#D6D3D1"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Empty State */}
                {entriesWithEnglish.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '48px', color: '#D6D3D1', marginBottom: '16px' }}>--</div>
                        <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#78716C', marginBottom: '8px' }}>No articles yet</h2>
                        <p style={{ fontSize: '14px', color: '#A8A29E' }}>Check back soon for English journal articles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
