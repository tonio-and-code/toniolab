'use client';

import { useState, useEffect } from 'react';
import EnglishSidebar from '@/components/EnglishSidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const [unlocked, setUnlocked] = useState(false);
    const [pw, setPw] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        if (localStorage.getItem('tonio-pass') === 'wim') setUnlocked(true);
        setLoading(false);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pw === 'wim') {
            localStorage.setItem('tonio-pass', 'wim');
            setUnlocked(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 1500);
        }
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8A29E' }}>...</div>;
    }

    if (!unlocked) {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#FAFAF9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}>
                <form onSubmit={handleSubmit} style={{
                    textAlign: 'center', width: '100%', maxWidth: '300px',
                }}>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#1C1917', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                        tonio<span style={{ color: '#D4AF37' }}>lab</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#A8A29E', marginBottom: '32px' }}>Enter password</div>
                    <input
                        type="password"
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                        autoFocus
                        placeholder="password"
                        style={{
                            width: '100%', padding: '14px 18px', borderRadius: '10px',
                            border: `1px solid ${error ? '#EF4444' : '#E7E5E4'}`,
                            backgroundColor: '#fff', fontSize: '16px', outline: 'none',
                            boxSizing: 'border-box', textAlign: 'center', letterSpacing: '2px',
                            transition: 'border-color 0.2s',
                        }}
                    />
                    <button type="submit" style={{
                        width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                        backgroundColor: '#1C1917', color: '#fff', fontSize: '14px', fontWeight: '700',
                        cursor: 'pointer', marginTop: '12px', letterSpacing: '1px',
                    }}>
                        Enter
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
            <EnglishSidebar desktopOpen={desktopSidebarOpen} />

            {!isMobile && (
                <button
                    onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                    style={{
                        position: 'fixed', top: '50%', transform: 'translateY(-50%)',
                        left: desktopSidebarOpen ? '240px' : '0', zIndex: 1002,
                        backgroundColor: '#164038', color: '#fff', border: 'none',
                        borderRadius: '0 12px 12px 0', width: '24px', height: '64px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                        transition: 'left 0.25s ease',
                    }}
                    title={desktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    {desktopSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                </button>
            )}

            <div style={{
                flex: 1,
                marginLeft: isMobile ? 0 : (desktopSidebarOpen ? '240px' : '0'),
                paddingTop: isMobile ? '56px' : 0,
                transition: 'margin-left 0.25s ease',
            }}>
                {children}
            </div>
        </div>
    );
}
