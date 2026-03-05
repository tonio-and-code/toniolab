'use client';

import { useState, useEffect } from 'react';
import EnglishSidebar from '@/components/EnglishSidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
            <EnglishSidebar desktopOpen={desktopSidebarOpen} />

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
