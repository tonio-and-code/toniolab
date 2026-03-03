'use client';

import { useState, useEffect, useRef } from 'react';
import EnglishSidebar from '@/components/EnglishSidebar';
import { createClient } from '@/lib/supabase/client';
import { signIn, signUp } from '@/lib/auth';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auth check - client only (inside useEffect to avoid SSR issues)
    useEffect(() => {
        let subscription: { unsubscribe: () => void } | null = null;

        try {
            const supabase = createClient();
            supabaseRef.current = supabase;

            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                setIsAuthenticated(!!session?.user);
                setIsLoading(false);
            });
            subscription = data.subscription;

            supabase.auth.getSession().then(({ data: { session } }) => {
                setIsAuthenticated(!!session?.user);
                setIsLoading(false);
            }).catch(() => {
                setIsAuthenticated(false);
                setIsLoading(false);
            });
        } catch {
            setIsAuthenticated(false);
            setIsLoading(false);
        }

        // Safety timeout: if auth check hangs, show login form
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => {
            subscription?.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (isSignUp) {
                await signUp({
                    email,
                    password,
                    displayName: displayName || email.split('@')[0],
                });
                setError('Check your email for a confirmation link.');
            } else {
                await signIn({ email, password });
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setSubmitting(false);
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
                    maxWidth: '360px',
                }}>
                    <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1a1a2e' }}>
                        English
                    </div>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>
                        {isSignUp ? 'Create your account' : 'Sign in to continue'}
                    </div>

                    {isSignUp && (
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Display Name"
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                borderRadius: '10px',
                                border: '1px solid #e5e5e5',
                                backgroundColor: '#f8f9fa',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                marginBottom: '12px',
                            }}
                        />
                    )}

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '14px 18px',
                            borderRadius: '10px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: '#f8f9fa',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            marginBottom: '12px',
                        }}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{
                            width: '100%',
                            padding: '14px 18px',
                            borderRadius: '10px',
                            border: `1px solid ${error && !error.includes('Check your email') ? '#ef4444' : '#e5e5e5'}`,
                            backgroundColor: '#f8f9fa',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                    {error && (
                        <div style={{
                            fontSize: '12px',
                            color: error.includes('Check your email') ? '#10b981' : '#ef4444',
                            marginTop: '10px',
                        }}>
                            {error}
                        </div>
                    )}
                    <button type="submit" disabled={submitting} style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: submitting ? '#9ca3af' : '#10b981',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        marginTop: '20px',
                    }}>
                        {submitting ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>

                    <div style={{ marginTop: '16px', fontSize: '13px', color: '#888' }}>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#10b981',
                                cursor: 'pointer',
                                fontSize: '13px',
                                textDecoration: 'underline',
                            }}
                        >
                            {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
                        </button>
                    </div>
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
