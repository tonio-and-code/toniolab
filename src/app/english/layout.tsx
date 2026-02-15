'use client';

import { useState, useEffect } from 'react';
import EnglishSidebar from '@/components/EnglishSidebar';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const auth = sessionStorage.getItem('english_auth');
        if (auth === 'true') setIsAuthenticated(true);
        setIsLoading(false);
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

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f5f6fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}>
                <form onSubmit={handleSubmit} style={{
                    backgroundColor: '#fff',
                    padding: '40px 32px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '320px',
                }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1a1a2e' }}>
                        English
                    </div>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>
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
                            padding: '14px 18px',
                            borderRadius: '10px',
                            border: `1px solid ${error ? '#ef4444' : '#e5e5e5'}`,
                            backgroundColor: '#f8f9fa',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                    {error && <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '10px' }}>Incorrect</div>}
                    <button type="submit" style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '20px',
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

            {/* Desktop Sidebar Toggle - Middle Left Tab */}
            {!isMobile && (
                <button
                    onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: desktopSidebarOpen ? '240px' : '0',
                        zIndex: 1002,
                        backgroundColor: '#164038',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0 12px 12px 0',
                        width: '24px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
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
