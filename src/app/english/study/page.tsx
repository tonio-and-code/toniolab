'use client';

import { useState, useEffect } from 'react';

interface Session {
    date: string;
    topic: string;
    duration: number;
    phrases: string[];
    notes: string;
}

interface Phrase {
    original: string;
    corrected: string;
    natural: string;
    category: string;
    date: string;
}

interface ConversationExchange {
    timestamp: string;
    japanese: string;
    english: string;
    responseEN: string;
    responseJP: string;
}

export default function EnglishStudyPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [newSession, setNewSession] = useState({
        topic: '',
        duration: 0,
        phrases: [''],
        notes: ''
    });
    const [newPhrase, setNewPhrase] = useState({
        original: '',
        corrected: '',
        natural: '',
        category: 'Daily'
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Load data from localStorage
    useEffect(() => {
        const savedSessions = localStorage.getItem('english_sessions');
        const savedPhrases = localStorage.getItem('english_phrases');
        if (savedSessions) setSessions(JSON.parse(savedSessions));
        if (savedPhrases) setPhrases(JSON.parse(savedPhrases));
    }, []);

    // Save session
    const saveSession = () => {
        const session: Session = {
            ...newSession,
            date: new Date().toISOString().split('T')[0]
        };
        const updated = [...sessions, session];
        setSessions(updated);
        localStorage.setItem('english_sessions', JSON.stringify(updated));
        setNewSession({ topic: '', duration: 0, phrases: [''], notes: '' });
    };

    // Save phrase
    const savePhrase = () => {
        const phrase: Phrase = {
            ...newPhrase,
            date: new Date().toISOString().split('T')[0]
        };
        const updated = [...phrases, phrase];
        setPhrases(updated);
        localStorage.setItem('english_phrases', JSON.stringify(updated));
        setNewPhrase({ original: '', corrected: '', natural: '', category: 'Daily' });
    };

    // Calculate stats
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalPhrases = phrases.length;
    const streak = calculateStreak(sessions);

    function calculateStreak(sessions: Session[]): number {
        if (sessions.length === 0) return 0;
        const dates = sessions.map(s => s.date).sort().reverse();
        let streak = 1;
        for (let i = 0; i < dates.length - 1; i++) {
            const current = new Date(dates[i]);
            const next = new Date(dates[i + 1]);
            const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
            if (diff === 1) streak++;
            else break;
        }
        return streak;
    }

    // Filter phrases
    const filteredPhrases = phrases.filter(p =>
        p.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.corrected.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.natural.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#fafaf9',
            color: '#171717',
            fontFamily: 'Georgia, "Yu Mincho", serif',
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '60px 24px',
            }}>

                {/* Header */}
                <header style={{ marginBottom: '80px' }}>
                    <h1 style={{
                        fontSize: '14px',
                        fontWeight: 'normal',
                        letterSpacing: '0.3em',
                        color: '#737373',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                    }}>
                        English Study Dashboard
                    </h1>
                    <p style={{
                        fontSize: '12px',
                        color: '#a3a3a3',
                        fontFamily: 'sans-serif',
                    }}>
                        個人用学習記録
                    </p>
                </header>

                {/* 1. Quick Reference */}
                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'normal',
                        marginBottom: '40px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #e5e5e5',
                    }}>
                        Quick Reference
                    </h2>

                    <div style={{
                        lineHeight: '2.2',
                        fontSize: '15px',
                        color: '#525252',
                    }}>
                        <p style={{ marginBottom: '16px' }}>
                            <span style={{ color: '#171717' }}>Workflow:</span><br />
                            GPT (日本語→英語) → Claude (英語会話) → 添削依頼 → 記録
                        </p>

                        <p style={{ marginBottom: '16px' }}>
                            <span style={{ color: '#171717' }}>Useful Phrases:</span><br />
                            "Could you make this more natural?"<br />
                            "How would a native speaker say this?"<br />
                            "What's the natural way to express this?"
                        </p>

                        <p>
                            <span style={{ color: '#171717' }}>Topics:</span><br />
                            Business / Philosophy / Daily Life / Technology / Interior Design
                        </p>

                        <div style={{
                            marginTop: '24px',
                            paddingTop: '24px',
                            borderTop: '1px solid #e5e5e5',
                        }}>
                            <a
                                href="/english/conversation-log"
                                style={{
                                    fontSize: '14px',
                                    color: '#171717',
                                    textDecoration: 'underline',
                                }}
                            >
                                → Conversation Log (会話記録)
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. Session Logger */}
                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'normal',
                        marginBottom: '40px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #e5e5e5',
                    }}>
                        Log Today's Session
                    </h2>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            color: '#737373',
                            marginBottom: '8px',
                        }}>
                            Topic
                        </label>
                        <input
                            type="text"
                            value={newSession.topic}
                            onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                            placeholder="e.g. Explaining interior design philosophy"
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '15px',
                                fontFamily: 'Georgia, "Yu Mincho", serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                                color: '#171717',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            color: '#737373',
                            marginBottom: '8px',
                        }}>
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={newSession.duration || ''}
                            onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 0 })}
                            placeholder="15"
                            style={{
                                width: '120px',
                                padding: '12px',
                                fontSize: '15px',
                                fontFamily: 'Georgia, "Yu Mincho", serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                                color: '#171717',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            color: '#737373',
                            marginBottom: '8px',
                        }}>
                            Notes
                        </label>
                        <textarea
                            value={newSession.notes}
                            onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                            placeholder="How did it go? What did you learn?"
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '15px',
                                fontFamily: 'Georgia, "Yu Mincho", serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                                color: '#171717',
                                lineHeight: '1.8',
                            }}
                        />
                    </div>

                    <button
                        onClick={saveSession}
                        disabled={!newSession.topic || !newSession.duration}
                        style={{
                            padding: '12px 32px',
                            fontSize: '13px',
                            fontFamily: 'Georgia, serif',
                            letterSpacing: '0.1em',
                            border: '1px solid #171717',
                            backgroundColor: '#171717',
                            color: '#fafaf9',
                            cursor: newSession.topic && newSession.duration ? 'pointer' : 'not-allowed',
                            opacity: newSession.topic && newSession.duration ? 1 : 0.4,
                        }}
                    >
                        Save Session
                    </button>
                </section>

                {/* 3. Phrase Library */}
                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'normal',
                        marginBottom: '40px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #e5e5e5',
                    }}>
                        Phrase Library
                    </h2>

                    {/* Add new phrase */}
                    <div style={{
                        marginBottom: '40px',
                        padding: '24px',
                        backgroundColor: '#f5f5f4',
                        border: '1px solid #e7e5e4',
                    }}>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: 'normal',
                            marginBottom: '24px',
                            color: '#525252',
                        }}>
                            Add New Phrase
                        </h3>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#737373',
                                marginBottom: '6px',
                            }}>
                                Your English (imperfect)
                            </label>
                            <input
                                type="text"
                                value={newPhrase.original}
                                onChange={(e) => setNewPhrase({ ...newPhrase, original: e.target.value })}
                                placeholder="I want to make interior that make people feel good"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '14px',
                                    fontFamily: 'Georgia, serif',
                                    border: '1px solid #d4d4d4',
                                    backgroundColor: '#ffffff',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#737373',
                                marginBottom: '6px',
                            }}>
                                Corrected Version
                            </label>
                            <input
                                type="text"
                                value={newPhrase.corrected}
                                onChange={(e) => setNewPhrase({ ...newPhrase, corrected: e.target.value })}
                                placeholder="I want to make interiors that make people feel good"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '14px',
                                    fontFamily: 'Georgia, serif',
                                    border: '1px solid #d4d4d4',
                                    backgroundColor: '#ffffff',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#737373',
                                marginBottom: '6px',
                            }}>
                                Natural Version
                            </label>
                            <input
                                type="text"
                                value={newPhrase.natural}
                                onChange={(e) => setNewPhrase({ ...newPhrase, natural: e.target.value })}
                                placeholder="I want to create spaces that make people feel good"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '14px',
                                    fontFamily: 'Georgia, serif',
                                    border: '1px solid #d4d4d4',
                                    backgroundColor: '#ffffff',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#737373',
                                marginBottom: '6px',
                            }}>
                                Category
                            </label>
                            <select
                                value={newPhrase.category}
                                onChange={(e) => setNewPhrase({ ...newPhrase, category: e.target.value })}
                                style={{
                                    padding: '10px',
                                    fontSize: '14px',
                                    fontFamily: 'Georgia, serif',
                                    border: '1px solid #d4d4d4',
                                    backgroundColor: '#ffffff',
                                }}
                            >
                                <option>Business</option>
                                <option>Daily</option>
                                <option>Philosophy</option>
                                <option>Tech</option>
                            </select>
                        </div>

                        <button
                            onClick={savePhrase}
                            disabled={!newPhrase.original || !newPhrase.corrected || !newPhrase.natural}
                            style={{
                                padding: '10px 24px',
                                fontSize: '12px',
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '0.1em',
                                border: '1px solid #525252',
                                backgroundColor: '#525252',
                                color: '#fafaf9',
                                cursor: newPhrase.original && newPhrase.corrected && newPhrase.natural ? 'pointer' : 'not-allowed',
                                opacity: newPhrase.original && newPhrase.corrected && newPhrase.natural ? 1 : 0.4,
                            }}
                        >
                            Add Phrase
                        </button>
                    </div>

                    {/* Search */}
                    <div style={{ marginBottom: '24px' }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search phrases..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                fontFamily: 'Georgia, serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                            }}
                        />
                    </div>

                    {/* Phrase List */}
                    {filteredPhrases.length === 0 && (
                        <p style={{
                            fontSize: '14px',
                            color: '#a3a3a3',
                            fontStyle: 'italic',
                        }}>
                            No phrases saved yet.
                        </p>
                    )}

                    {filteredPhrases.map((phrase, i) => (
                        <div
                            key={i}
                            style={{
                                marginBottom: '32px',
                                paddingBottom: '32px',
                                borderBottom: '1px solid #f5f5f4',
                            }}
                        >
                            <div style={{
                                fontSize: '11px',
                                color: '#a3a3a3',
                                marginBottom: '12px',
                            }}>
                                {phrase.category} · {phrase.date}
                            </div>

                            <div style={{ marginBottom: '8px' }}>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#737373',
                                }}>
                                    Original:
                                </span>
                                <br />
                                <span style={{
                                    fontSize: '15px',
                                    color: '#525252',
                                    fontStyle: 'italic',
                                }}>
                                    {phrase.original}
                                </span>
                            </div>

                            <div style={{ marginBottom: '8px' }}>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#737373',
                                }}>
                                    Corrected:
                                </span>
                                <br />
                                <span style={{
                                    fontSize: '15px',
                                    color: '#171717',
                                }}>
                                    {phrase.corrected}
                                </span>
                            </div>

                            <div>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#737373',
                                }}>
                                    Natural:
                                </span>
                                <br />
                                <span style={{
                                    fontSize: '15px',
                                    color: '#171717',
                                    fontWeight: '500',
                                }}>
                                    {phrase.natural}
                                </span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4. Progress Tracker */}
                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'normal',
                        marginBottom: '40px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #e5e5e5',
                    }}>
                        Progress
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '24px',
                        marginBottom: '40px',
                    }}>
                        <div style={{
                            padding: '24px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: '#ffffff',
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: 'normal',
                                color: '#171717',
                                marginBottom: '8px',
                            }}>
                                {totalHours}
                            </div>
                            <div style={{
                                fontSize: '13px',
                                color: '#737373',
                                letterSpacing: '0.05em',
                            }}>
                                Total Minutes
                            </div>
                        </div>

                        <div style={{
                            padding: '24px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: '#ffffff',
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: 'normal',
                                color: '#171717',
                                marginBottom: '8px',
                            }}>
                                {totalPhrases}
                            </div>
                            <div style={{
                                fontSize: '13px',
                                color: '#737373',
                                letterSpacing: '0.05em',
                            }}>
                                Phrases Learned
                            </div>
                        </div>

                        <div style={{
                            padding: '24px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: '#ffffff',
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: 'normal',
                                color: '#171717',
                                marginBottom: '8px',
                            }}>
                                {streak}
                            </div>
                            <div style={{
                                fontSize: '13px',
                                color: '#737373',
                                letterSpacing: '0.05em',
                            }}>
                                Day Streak
                            </div>
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 'normal',
                        marginBottom: '24px',
                        color: '#525252',
                    }}>
                        Recent Sessions
                    </h3>

                    {sessions.length === 0 && (
                        <p style={{
                            fontSize: '14px',
                            color: '#a3a3a3',
                            fontStyle: 'italic',
                        }}>
                            No sessions logged yet.
                        </p>
                    )}

                    {sessions.slice().reverse().slice(0, 10).map((session, i) => (
                        <div
                            key={i}
                            style={{
                                marginBottom: '24px',
                                paddingBottom: '24px',
                                borderBottom: '1px solid #f5f5f4',
                            }}
                        >
                            <div style={{
                                fontSize: '11px',
                                color: '#a3a3a3',
                                marginBottom: '8px',
                            }}>
                                {session.date}
                            </div>
                            <div style={{
                                fontSize: '15px',
                                color: '#171717',
                                marginBottom: '8px',
                            }}>
                                {session.topic}
                            </div>
                            <div style={{
                                fontSize: '13px',
                                color: '#737373',
                            }}>
                                {session.duration} minutes
                            </div>
                            {session.notes && (
                                <div style={{
                                    fontSize: '14px',
                                    color: '#525252',
                                    marginTop: '12px',
                                    fontStyle: 'italic',
                                    lineHeight: '1.6',
                                }}>
                                    {session.notes}
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* Back link */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <a
                        href="/english"
                        style={{
                            fontSize: '13px',
                            color: '#737373',
                            textDecoration: 'underline',
                        }}
                    >
                        ← Back to Introduction
                    </a>
                </div>

            </div>
        </div>
    );
}
