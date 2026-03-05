'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EnglishSidebar({ desktopOpen = true }: { desktopOpen?: boolean }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [proAllDone, setProAllDone] = useState(false);
    const [memoriaAllDone, setMemoriaAllDone] = useState(false);
    const [showLists, setShowLists] = useState(false);
    const [showArchive, setShowArchive] = useState(false);
    const [showWorldMaps, setShowWorldMaps] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Check if all items are completed
    useEffect(() => {
        let pro = 0, mem = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            if (key.startsWith('pro_') && key.endsWith('_completed') && localStorage.getItem(key) === 'true') pro++;
            if (key.startsWith('memoria_') && key.endsWith('_completed') && localStorage.getItem(key) === 'true') mem++;
        }
        const proTotal = parseInt(localStorage.getItem('pro_total') || '0', 10);
        const memTotal = parseInt(localStorage.getItem('memoria_total') || '0', 10);
        setProAllDone(proTotal > 0 && pro >= proTotal);
        setMemoriaAllDone(memTotal > 0 && mem >= memTotal);
    }, [pathname]);

    // Close menu on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Main nav: daily use items
    const mainItems = [
        { id: '/english/dashboard', label: 'ダッシュボード' },
        { id: '/english/training', label: 'トレーニング' },
        { id: '/english/xp-guide', label: '遊び方ガイド' },
        { id: '/english/training/card-preview', label: 'カードコレクション' },
        { id: '/memoria', label: 'メモリア日記' },
        { id: '/english/youtube', label: 'YouTube' },
        { id: '/english/pro', label: 'プロの解説' },
        { id: '/english/requiem', label: 'レクイエム鎮魂歌' },
        { id: '/english/conversation', label: '日常会話マスター' },
        { id: '/english/nihongo', label: '日本語から学ぶ' },
        { id: '/english/goroku', label: '俺語録' },
        { id: '/english/self-master', label: 'セルフマスター' },
        { id: '/english/note', label: 'note記事' },
        { id: '/english/vocabulary', label: 'ボキャブラリー' },
        { id: '/english/arena', label: 'WORD ARENA' },
        { id: '/english/arena/battle', label: 'CARD BATTLE' },
        { id: '/english/bookmarks', label: 'ブックマーク' },
        { id: '/english/dev', label: 'DEV' },
    ];

    // Reference lists - actively used
    const listItems = [
        { id: '/english/nihongo-list', label: '日本語リスト' },
        { id: '/english/expressions', label: 'レクイエム: 表現集' },
        { id: '/english/idiom-list', label: 'レクイエム: イディオム帳' },
        { id: '/english/everyday-words', label: '日常英単語' },
        { id: '/english/phrases-lab', label: 'Phrases Lab' },
        { id: '/english/us-map', label: 'US States' },
        { id: '/english/speaking-guide', label: 'スピーキングガイド' },
    ];

    const worldMapItems = [
        { id: '/english/world-map', label: 'World Map 1' },
        { id: '/english/world-map-2', label: 'World Map 2' },
        { id: '/english/world-map-3', label: 'World Map 3' },
        { id: '/english/world-map-4', label: 'World Map 4' },
        { id: '/english/world-map-6', label: 'Conquest' },
    ];

    // Archive - historical records only
    const archiveItems = [
        { id: '/english/phrases', label: 'デイリーフレーズ' },
        { id: '/english', label: '旧ダッシュボード' },
        { id: '/english/dashboard-v2', label: '積み上げ' },
        { id: '/english/goroku-v2', label: '俺語録 V2' },
        { id: '/english/anki', label: 'Anki' },
        { id: '/english/sessions', label: 'セッション音声' },
        { id: '/podcast', label: 'Podcast' },
    ];

    const allSecondaryItems = [...listItems, ...worldMapItems, ...archiveItems];

    const isActive = (path: string) => {
        if (!pathname) return false;
        if (path === '/english') return pathname === '/english';
        if (path === '/english/dashboard') return pathname === '/english/dashboard';
        if (path === '/english/training') return pathname === '/english/training' || pathname === '/english/training/guide';
        if (path === '/english/phrases') return pathname.startsWith('/english/phrases');
        if (path === '/memoria') return pathname.startsWith('/memoria');
        if (path === '/podcast') return pathname.startsWith('/podcast');
        return pathname.startsWith(path);
    };

    // Auto-expand sections if current page is in them
    useEffect(() => {
        if (listItems.some(item => isActive(item.id)) || worldMapItems.some(item => isActive(item.id))) {
            setShowLists(true);
            if (worldMapItems.some(item => isActive(item.id))) setShowWorldMaps(true);
        }
        if (archiveItems.some(item => isActive(item.id))) {
            setShowArchive(true);
        }
    }, [pathname]);

    const renderNavItem = (item: { id: string; label: string }, compact = false) => {
        const allDone = item.id === '/english/pro' ? proAllDone
            : item.id === '/memoria' ? memoriaAllDone
            : false;
        const active = isActive(item.id);
        return (
            <Link key={item.id} href={item.id} style={{ textDecoration: 'none' }}>
                <div style={{
                    padding: compact ? '7px 24px' : '10px 24px',
                    color: active ? '#1a1a1a' : compact ? '#999' : '#666',
                    backgroundColor: active ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    borderLeft: active ? '3px solid #D4AF37' : '3px solid transparent',
                    fontSize: compact ? '12px' : '13px',
                    fontWeight: active ? '600' : '400',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    {item.label}
                    {allDone && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Header */}
            {isMobile && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '56px',
                    backgroundColor: '#F5F5F4',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                    zIndex: 1001,
                }}>
                    <Link href="/english/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#D4AF37', letterSpacing: '-0.5px' }}>英語魂</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                        }}
                    >
                        <span style={{
                            display: 'block',
                            width: '22px',
                            height: '2px',
                            backgroundColor: '#999',
                            transition: 'all 0.2s ease',
                            transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                        }} />
                        <span style={{
                            display: 'block',
                            width: '22px',
                            height: '2px',
                            backgroundColor: '#999',
                            opacity: isOpen ? 0 : 1,
                            transition: 'opacity 0.2s ease',
                        }} />
                        <span style={{
                            display: 'block',
                            width: '22px',
                            height: '2px',
                            backgroundColor: '#999',
                            transition: 'all 0.2s ease',
                            transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                        }} />
                    </button>
                </div>
            )}

            {/* Overlay */}
            {isMobile && isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                    }}
                />
            )}

            {/* Sidebar */}
            <div style={{
                width: '240px',
                backgroundColor: '#F5F5F4',
                borderRight: '1px solid #e5e5e5',
                padding: isMobile ? '72px 0 24px' : '24px 0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto',
                zIndex: 1000,
                left: isMobile ? (isOpen ? 0 : '-240px') : (desktopOpen ? 0 : '-240px'),
                transition: 'left 0.25s ease',
            }}>
                {/* Logo - Desktop only */}
                {!isMobile && (
                    <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                        <Link href="/english/dashboard" style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '8px',
                            }}>
                                <span style={{
                                    fontSize: '22px',
                                    fontWeight: '900',
                                    color: '#D4AF37',
                                    letterSpacing: '0.05em',
                                }}>
                                    英語魂
                                </span>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: '#bbb',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}>
                                    EIGODAMASHII
                                </span>
                            </div>
                            <div style={{
                                fontSize: '10px',
                                color: '#bbb',
                                marginTop: '6px',
                                letterSpacing: '0.5px',
                            }}>
                                止まらない英語を、ここから。
                            </div>
                        </Link>
                    </div>
                )}

                {/* Navigation */}
                <nav style={{ flex: 1 }}>
                    {/* Main Items */}
                    {mainItems.map(item => renderNavItem(item))}

                    {/* Reference Lists */}
                    <button
                        onClick={() => setShowLists(!showLists)}
                        style={{
                            width: '100%',
                            padding: '16px 24px 8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#aaa',
                            fontSize: '10px',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            textAlign: 'left',
                        }}
                    >
                        <span style={{
                            display: 'inline-block',
                            transition: 'transform 0.2s ease',
                            transform: showLists ? 'rotate(90deg)' : 'rotate(0deg)',
                            fontSize: '9px',
                        }}>
                            ▶
                        </span>
                        リスト / 辞書
                    </button>
                    {showLists && (
                        <>
                            {listItems.map(item => renderNavItem(item, true))}
                            {/* World Maps - sub-toggle */}
                            <button
                                onClick={() => setShowWorldMaps(!showWorldMaps)}
                                style={{
                                    width: '100%',
                                    padding: '7px 24px 7px 36px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    color: '#999',
                                    fontSize: '12px',
                                    textAlign: 'left',
                                }}
                            >
                                <span style={{
                                    display: 'inline-block',
                                    transition: 'transform 0.2s ease',
                                    transform: showWorldMaps ? 'rotate(90deg)' : 'rotate(0deg)',
                                    fontSize: '8px',
                                }}>
                                    ▶
                                </span>
                                World Map ({worldMapItems.length})
                            </button>
                            {showWorldMaps && worldMapItems.map(item => renderNavItem(item, true))}
                        </>
                    )}

                    {/* Archive */}
                    <button
                        onClick={() => setShowArchive(!showArchive)}
                        style={{
                            width: '100%',
                            padding: '12px 24px 6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#ccc',
                            fontSize: '9px',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            textAlign: 'left',
                        }}
                    >
                        <span style={{
                            display: 'inline-block',
                            transition: 'transform 0.2s ease',
                            transform: showArchive ? 'rotate(90deg)' : 'rotate(0deg)',
                            fontSize: '8px',
                        }}>
                            ▶
                        </span>
                        記録
                    </button>
                    {showArchive && archiveItems.map(item => (
                        <Link key={item.id} href={item.id} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '4px 24px',
                                color: isActive(item.id) ? '#999' : '#ccc',
                                backgroundColor: isActive(item.id) ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                                borderLeft: isActive(item.id) ? '2px solid #D4AF37' : '2px solid transparent',
                                fontSize: '10px',
                                fontWeight: isActive(item.id) ? '600' : '400',
                                transition: 'all 0.15s ease',
                            }}>
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </nav>

                {/* Settings Link */}
                <Link href="/english/settings" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '10px 24px',
                        color: isActive('/english/settings') ? '#1a1a1a' : '#aaa',
                        backgroundColor: isActive('/english/settings') ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                        borderLeft: isActive('/english/settings') ? '3px solid #D4AF37' : '3px solid transparent',
                        fontSize: '13px',
                        fontWeight: isActive('/english/settings') ? '600' : '400',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        設定
                    </div>
                </Link>

                {/* Home Link */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '16px 24px', color: '#aaa', fontSize: '13px' }}>
                        ← ホームに戻る
                    </div>
                </Link>
            </div>

            {/* Spacer for mobile header */}
            {isMobile && <div style={{ height: '56px' }} />}
        </>
    );
}
