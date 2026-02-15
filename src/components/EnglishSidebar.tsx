'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EnglishSidebar({ desktopOpen = true }: { desktopOpen?: boolean }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    // Close menu on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const navItems = [
        { id: '/english', label: 'ダッシュボード' },
        { id: '/english/word-review', label: 'レクイエム' },
        { id: '/english/vocabulary', label: 'ボキャブラリー' },
        { id: '/english/phrases', label: 'デイリーフレーズ' },
        { id: '/english/saved', label: 'ブックマーク' },
        { id: '/memoria', label: 'メモリア' },
        { id: '/english/journal', label: '英語ジャーナル' },
        { id: '/english/listening', label: 'YouTube' },
        { id: '/english/expressions', label: 'スラング表現集' },
        { id: '/english/idiom-list', label: '熟語リスト一覧' },
        { id: '/english/everyday-words', label: '日常英単語' },
        { id: '/english/dashboard-v2', label: 'Analytics' },
        { id: '/english/world-map', label: 'World Map' },
        { id: '/english/world-map-2', label: 'World Map 2' },
        { id: '/english/world-map-3', label: 'World Map 3' },
        { id: '/english/world-map-4', label: 'World Map 4' },
        { id: '/english/world-map-5', label: 'Word Galaxy (Map 5)' },
        { id: '/english/world-map-6', label: 'Conquest (Map 6)' },
        { id: '/english/us-map', label: 'US States' },
        { id: '/english/jigsaw', label: 'Jigsaw Puzzle' },
        { id: '/health-journal', label: 'ヘルスジャーナル' },
        { id: '/cooking-journal', label: 'クッキングジャーナル' },
    ];

    const toolItems = [
        { label: 'note記事', href: '/english/note' },
        { label: 'スピーキングガイド', href: '/100h' },
        { label: 'フレーズマスター', href: '/english/mastery' },
        { label: 'セッション音声', href: '/english/sessions' },
        { label: 'Podcast', href: '/podcast' },
    ];

    const isActive = (path: string) => {
        if (!pathname) return false;
        if (path === '/english') return pathname === '/english';
        if (path === '/memoria') return pathname.startsWith('/memoria');
        if (path === '/health-journal') return pathname.startsWith('/health-journal');
        if (path === '/cooking-journal') return pathname.startsWith('/cooking-journal');
        if (path === '/podcast') return pathname.startsWith('/podcast');
        if (path === '/100h') return pathname.startsWith('/100h');
        if (path === '/english/mastery') return pathname.startsWith('/english/mastery');
        return pathname.startsWith(path);
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
                    backgroundColor: '#164038',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                    zIndex: 1001,
                }}>
                    <Link href="/english" style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>English Learning</span>
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
                            backgroundColor: '#fff',
                            transition: 'all 0.2s ease',
                            transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                        }} />
                        <span style={{
                            display: 'block',
                            width: '22px',
                            height: '2px',
                            backgroundColor: '#fff',
                            opacity: isOpen ? 0 : 1,
                            transition: 'opacity 0.2s ease',
                        }} />
                        <span style={{
                            display: 'block',
                            width: '22px',
                            height: '2px',
                            backgroundColor: '#fff',
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
                backgroundColor: '#164038',
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
                        <Link href="/english" style={{ textDecoration: 'none' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>
                                English Learning
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                                学習ダッシュボード
                            </div>
                        </Link>
                    </div>
                )}

                {/* Navigation */}
                <nav style={{ flex: 1 }}>
                    {navItems.map(item => (
                        <Link key={item.id} href={item.id} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '12px 24px',
                                color: isActive(item.id) ? '#fff' : 'rgba(255,255,255,0.6)',
                                backgroundColor: isActive(item.id) ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                                borderLeft: isActive(item.id) ? '3px solid #D4AF37' : '3px solid transparent',
                                fontSize: '14px',
                                fontWeight: isActive(item.id) ? '600' : '400',
                                transition: 'all 0.15s ease',
                            }}>
                                {item.label}
                            </div>
                        </Link>
                    ))}

                    {/* Tools Section */}
                    <div style={{ padding: '20px 24px 8px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>
                        ツール
                    </div>
                    {toolItems.map(item => (
                        <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '10px 24px',
                                color: isActive(item.href) ? '#fff' : 'rgba(255,255,255,0.5)',
                                backgroundColor: isActive(item.href) ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                fontSize: '13px',
                                transition: 'all 0.15s ease',
                            }}>
                                {item.label}
                            </div>
                        </Link>
                    ))}

                </nav>

                {/* Home Link */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                        ← ホームに戻る
                    </div>
                </Link>
            </div>

            {/* Spacer for mobile header */}
            {isMobile && <div style={{ height: '56px' }} />}
        </>
    );
}
