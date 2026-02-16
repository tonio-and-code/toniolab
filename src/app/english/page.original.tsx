'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ThemeMode = 'dark' | 'light';

const themes = {
    dark: {
        bg: '#0a0a0a',
        bgSecondary: '#1a1a1a',
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
        text: '#1a1a1a',
        textSecondary: '#555',
        textMuted: '#666',
        border: '#e5e5e5',
        borderLight: '#d5d5d5',
        accent: '#B8960C',
        success: '#059669',
    },
};

export default function EnglishHomePage() {
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('english_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);

        const auth = sessionStorage.getItem('english_auth');
        if (auth === 'true') setIsAuthenticated(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'wim') {
            setIsAuthenticated(true);
            sessionStorage.setItem('english_auth', 'true');
            setError(false);
        } else {
            setError(true);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('english_theme', newTheme);
    };

    const t = themes[theme];

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: t.bg,
                color: t.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <form onSubmit={handleSubmit} style={{
                    backgroundColor: t.bgSecondary,
                    padding: '40px',
                    borderRadius: '16px',
                    border: `1px solid ${t.borderLight}`,
                    textAlign: 'center',
                    width: '300px'
                }}>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '8px'
                    }}>
                        English
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: t.textMuted,
                        marginBottom: '24px'
                    }}>
                        Enter password to continue
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `1px solid ${error ? '#ef4444' : t.borderLight}`,
                            backgroundColor: t.bg,
                            color: t.text,
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    {error && (
                        <div style={{
                            fontSize: '12px',
                            color: '#ef4444',
                            marginTop: '8px'
                        }}>
                            Incorrect password
                        </div>
                    )}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: t.accent,
                            color: '#000',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '16px'
                        }}
                    >
                        Enter
                    </button>
                </form>
            </div>
        );
    }

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
                <Link href="/" style={{ color: t.textMuted, textDecoration: 'none', fontSize: '13px' }}>
                    Home
                </Link>
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'none',
                        border: `1px solid ${t.borderLight}`,
                        color: t.textMuted,
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                    }}
                >
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
            </div>

            <div style={{ padding: '0 24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Hero */}
                <div style={{
                    position: 'relative',
                    marginBottom: '40px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '200px'
                }}>
                    <img
                        src="https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/84dd3f51-781b-4b08-ddc5-8ffffd354000/public"
                        alt="English Learning"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)'
                    }} />
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0, color: '#fff' }}>
                            English
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '8px 0 0' }}>
                            Daily practice from real life
                        </p>
                    </div>
                </div>

                {/* Main Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                    {/* 0. English Post - Layer 1 */}
                    <Link href="/english/post" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '16px',
                            padding: '24px',
                            border: `2px solid #0095f6`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            background: `linear-gradient(135deg, ${t.bgSecondary} 0%, ${theme === 'dark' ? '#1a2744' : '#e8f4fd'} 100%)`,
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="#fff" strokeWidth="2"/>
                                    <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="2"/>
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/>
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#0095f6',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px',
                                    fontWeight: '600',
                                }}>
                                    NEW - LAYER 1
                                </div>
                                <div style={{ fontSize: '18px', color: t.text, fontWeight: '600' }}>
                                    English Diary
                                </div>
                                <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
                                    Photo to Instagram-ready English
                                </div>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={t.textMuted}>
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                        </div>
                    </Link>

                    {/* 1. Daily Phrases */}
                    <Link href="/english/phrases" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '16px',
                            padding: '24px',
                            border: `1px solid ${t.accent}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                backgroundColor: t.accent,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#000'
                            }}>
                                A
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '11px',
                                    color: t.accent,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px'
                                }}>
                                    PHRASES
                                </div>
                                <div style={{ fontSize: '18px', color: t.text, fontWeight: '600' }}>
                                    Daily Phrases
                                </div>
                                <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
                                    Curated sentences for memorization
                                </div>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={t.textMuted}>
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                        </div>
                    </Link>

                    {/* 2. Memoria */}
                    <Link href="/memoria" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '16px',
                            padding: '24px',
                            border: `1px solid ${t.borderLight}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#764ba2',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px'
                                }}>
                                    DIARY
                                </div>
                                <div style={{ fontSize: '18px', color: t.text, fontWeight: '600' }}>
                                    Memoria
                                </div>
                                <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
                                    Journal summaries as conversations
                                </div>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={t.textMuted}>
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                        </div>
                    </Link>

                    {/* 3. Native Dialogues */}
                    <Link href="/english/native" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '16px',
                            padding: '24px',
                            border: `1px solid #06b6d4`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                backgroundColor: '#06b6d4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#06b6d4',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px'
                                }}>
                                    NEW - SPEAKING
                                </div>
                                <div style={{ fontSize: '18px', color: t.text, fontWeight: '600' }}>
                                    Native Dialogues
                                </div>
                                <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
                                    Real messy conversations for memorization
                                </div>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={t.textMuted}>
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                        </div>
                    </Link>

                    {/* 4. English Journal */}
                    <Link href="/english/journal" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '16px',
                            padding: '24px',
                            border: `1px solid ${t.borderLight}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                backgroundColor: t.success,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '11px',
                                    color: t.success,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px'
                                }}>
                                    ARTICLES
                                </div>
                                <div style={{ fontSize: '18px', color: t.text, fontWeight: '600' }}>
                                    English Journal
                                </div>
                                <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
                                    Full English versions of journal entries
                                </div>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={t.textMuted}>
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Dashboard Banner */}
                <Link href="/english/dashboard" style={{ textDecoration: 'none' }}>
                    <div style={{
                        marginBottom: '40px',
                        backgroundColor: t.bgSecondary,
                        borderRadius: '16px',
                        padding: '24px',
                        border: `2px solid ${t.accent}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            backgroundColor: t.accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#000">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '11px',
                                color: t.accent,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '4px',
                                fontWeight: '600',
                            }}>
                                HUB
                            </div>
                            <div style={{ fontSize: '18px', color: t.text, fontWeight: '600' }}>
                                Dashboard
                            </div>
                            <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
                                Quick add, track progress, view collection
                            </div>
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={t.textMuted}>
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                    </div>
                </Link>

                {/* Additional Tools */}
                <h2 style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: t.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '16px'
                }}>
                    Tools
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
                    {/* Phrase Videos - Main Feature */}
                    <Link href="/english/videos" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `2px solid #ef4444`,
                            height: '100%',
                            gridColumn: 'span 2',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                                        <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', color: t.text, fontWeight: '600' }}>Phrase Videos</div>
                                    <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>
                                        YouTube subtitles + timestamp playback - No YouGlish
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Text Analyzer */}
                    <Link href="/english/analyze" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid #D4AF37`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#D4AF37',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>Text Analyzer</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Paste text, find idioms
                            </div>
                        </div>
                    </Link>

                    {/* Phrase Lookup */}
                    <Link href="/english/lookup" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${t.borderLight}`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>Phrase Lookup</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Search single phrase
                            </div>
                        </div>
                    </Link>

                    {/* Podcast */}
                    <Link href="/podcast" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${t.borderLight}`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>Podcast</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Solo English conversation
                            </div>
                        </div>
                    </Link>

                    {/* Voice Lab */}
                    <Link href="/voice-lab" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${t.borderLight}`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: t.accent,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>Voice Lab</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Pronunciation practice
                            </div>
                        </div>
                    </Link>

                    {/* SRS Review */}
                    <Link href="/english/review" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${t.borderLight}`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: t.success,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>SRS Review</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Spaced repetition
                            </div>
                        </div>
                    </Link>

                    {/* Handwritten */}
                    <Link href="/english/handwritten" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${t.borderLight}`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#f97316',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>Handwritten</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Analog archives
                            </div>
                        </div>
                    </Link>
                    {/* Listening */}
                    <Link href="/english/listening" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${t.borderLight}`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>Listening</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Video transcripts
                            </div>
                        </div>
                    </Link>

                    {/* My Vocabulary */}
                    <Link href="/english/vocabulary" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `2px solid #10B981`,
                            height: '100%'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#10B981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '15px', color: t.text, fontWeight: '600' }}>My Vocabulary</div>
                            <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '4px' }}>
                                Words and phrases you learn
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div style={{ height: '60px' }} />
        </div>
    );
}
