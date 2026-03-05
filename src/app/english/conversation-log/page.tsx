'use client';

import { useState, useEffect } from 'react';

interface ConversationExchange {
    timestamp: string;
    japanese: string;
    english: string;
    responseEN: string;
    responseJP: string;
}

export default function ConversationLogPage() {
    const [reviewMode, setReviewMode] = useState(false);
    const [showAnswer, setShowAnswer] = useState<{ [key: number]: boolean }>({});
    const [conversations, setConversations] = useState<ConversationExchange[]>([]);
    const [newConv, setNewConv] = useState({
        japanese: '',
        english: '',
        responseEN: '',
        responseJP: ''
    });

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('english_conversations');
        if (saved) setConversations(JSON.parse(saved));
    }, []);

    // Add conversation
    const addConversation = () => {
        const conv: ConversationExchange = {
            ...newConv,
            timestamp: new Date().toLocaleString('ja-JP')
        };
        const updated = [...conversations, conv];
        setConversations(updated);
        localStorage.setItem('english_conversations', JSON.stringify(updated));
        setNewConv({ japanese: '', english: '', responseEN: '', responseJP: '' });
    };

    // Export as Markdown
    const exportToMarkdown = () => {
        let md = `# English Conversation Log\n\nExported: ${new Date().toLocaleString('ja-JP')}\n\n---\n\n`;

        conversations.forEach((conv, i) => {
            md += `## Exchange ${i + 1}\n\n`;
            md += `**Time:** ${conv.timestamp}\n\n`;
            md += `**Your Japanese:**\n> ${conv.japanese}\n\n`;
            md += `**English Translation:**\n> ${conv.english}\n\n`;
            md += `**AI Response (EN):**\n${conv.responseEN}\n\n`;
            md += `**AI Response (JP):**\n${conv.responseJP}\n\n`;
            md += `---\n\n`;
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-log-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

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

                <header style={{ marginBottom: '60px' }}>
                    <h1 style={{
                        fontSize: '14px',
                        fontWeight: 'normal',
                        letterSpacing: '0.3em',
                        color: '#737373',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                    }}>
                        Conversation Log
                    </h1>
                    <p style={{
                        fontSize: '12px',
                        color: '#a3a3a3',
                        fontFamily: 'sans-serif',
                    }}>
                        日英対訳会話記録
                    </p>
                </header>

                {/* Quick Add Form */}
                <section style={{
                    marginBottom: '60px',
                    padding: '32px',
                    backgroundColor: '#f5f5f4',
                    border: '1px solid #e7e5e4',
                }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: 'normal',
                        marginBottom: '24px',
                        color: '#525252',
                    }}>
                        Add New Exchange
                    </h2>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            color: '#737373',
                            marginBottom: '6px',
                        }}>
                            Your Japanese
                        </label>
                        <textarea
                            value={newConv.japanese}
                            onChange={(e) => setNewConv({ ...newConv, japanese: e.target.value })}
                            placeholder="すべて実験なんです。のちのちアプリにできるかもしれないし..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                fontFamily: 'Georgia, serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                                lineHeight: '1.6',
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
                            English Translation
                        </label>
                        <textarea
                            value={newConv.english}
                            onChange={(e) => setNewConv({ ...newConv, english: e.target.value })}
                            placeholder="It's all an experiment. Maybe it'll become an app later..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                fontFamily: 'Georgia, serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                                lineHeight: '1.6',
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
                            AI Response (English)
                        </label>
                        <textarea
                            value={newConv.responseEN}
                            onChange={(e) => setNewConv({ ...newConv, responseEN: e.target.value })}
                            placeholder="That's a smart approach..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                fontFamily: 'Georgia, serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                                lineHeight: '1.6',
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
                            AI Response (Japanese)
                        </label>
                        <textarea
                            value={newConv.responseJP}
                            onChange={(e) => setNewConv({ ...newConv, responseJP: e.target.value })}
                            placeholder="賢いアプローチですね..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                fontFamily: 'Georgia, serif',
                                border: '1px solid #d4d4d4',
                                backgroundColor: '#ffffff',
                                lineHeight: '1.6',
                            }}
                        />
                    </div>

                    <button
                        onClick={addConversation}
                        disabled={!newConv.japanese || !newConv.english}
                        style={{
                            padding: '10px 24px',
                            fontSize: '12px',
                            fontFamily: 'Georgia, serif',
                            letterSpacing: '0.1em',
                            border: '1px solid #525252',
                            backgroundColor: '#525252',
                            color: '#fafaf9',
                            cursor: newConv.japanese && newConv.english ? 'pointer' : 'not-allowed',
                            opacity: newConv.japanese && newConv.english ? 1 : 0.4,
                        }}
                    >
                        Add
                    </button>
                </section>

                {/* Export Button */}
                {conversations.length > 0 && (
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <button
                            onClick={exportToMarkdown}
                            style={{
                                padding: '12px 32px',
                                fontSize: '13px',
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '0.1em',
                                border: '1px solid #171717',
                                backgroundColor: '#171717',
                                color: '#fafaf9',
                                cursor: 'pointer',
                            }}
                        >
                            Export as Markdown ({conversations.length} exchanges)
                        </button>
                    </div>
                )}

                {/* Review Mode Toggle */}
                {conversations.length > 0 && (
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <button
                            onClick={() => setReviewMode(!reviewMode)}
                            style={{
                                padding: '10px 24px',
                                fontSize: '13px',
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '0.1em',
                                border: reviewMode ? '1px solid #171717' : '1px solid #a3a3a3',
                                backgroundColor: reviewMode ? '#171717' : 'transparent',
                                color: reviewMode ? '#fafaf9' : '#525252',
                                cursor: 'pointer',
                                marginRight: '12px',
                            }}
                        >
                            {reviewMode ? '復習モード: ON' : '復習モード: OFF'}
                        </button>
                    </div>
                )}

                {/* Conversation List */}
                <section>
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: 'normal',
                        marginBottom: reviewMode ? '16px' : '32px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #e5e5e5',
                    }}>
                        {reviewMode ? 'Flashcard Review' : 'Recent Exchanges'}
                    </h2>

                    {reviewMode && (
                        <p style={{
                            fontSize: '13px',
                            color: '#737373',
                            marginBottom: '32px',
                            fontStyle: 'italic',
                        }}>
                            クリックして答えを表示
                        </p>
                    )}

                    {conversations.length === 0 && (
                        <p style={{
                            fontSize: '14px',
                            color: '#a3a3a3',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            padding: '40px 0',
                        }}>
                            No conversations logged yet.
                        </p>
                    )}

                    {conversations.slice().reverse().map((conv, i) => {
                        const isRevealed = showAnswer[i] || false;

                        return (
                            <div
                                key={i}
                                onClick={() => reviewMode && setShowAnswer({ ...showAnswer, [i]: !isRevealed })}
                                style={{
                                    marginBottom: '40px',
                                    paddingBottom: '40px',
                                    borderBottom: '1px solid #f5f5f4',
                                    cursor: reviewMode ? 'pointer' : 'default',
                                    backgroundColor: reviewMode && !isRevealed ? '#fffef0' : 'transparent',
                                    padding: reviewMode ? '20px' : '0',
                                    border: reviewMode ? '1px solid #e7e5e4' : 'none',
                                }}
                            >
                                <div style={{
                                    fontSize: '11px',
                                    color: '#a3a3a3',
                                    marginBottom: '16px',
                                }}>
                                    {conv.timestamp}
                                </div>

                                {/* Always show Japanese (the "question") */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#737373',
                                        marginBottom: '6px',
                                    }}>
                                        Japanese
                                    </div>
                                    <div style={{
                                        fontSize: '15px',
                                        color: '#525252',
                                        lineHeight: '1.8',
                                        padding: '12px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e7e5e4',
                                    }}>
                                        {conv.japanese}
                                    </div>
                                </div>

                                {/* Show English and responses only if not in review mode OR if revealed */}
                                {(!reviewMode || isRevealed) && (
                                    <>
                                        <div style={{ marginBottom: '20px' }}>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#737373',
                                                marginBottom: '6px',
                                            }}>
                                                English
                                            </div>
                                            <div style={{
                                                fontSize: '15px',
                                                color: '#171717',
                                                lineHeight: '1.8',
                                                padding: '12px',
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #d4d4d4',
                                            }}>
                                                {conv.english}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#737373',
                                                marginBottom: '6px',
                                            }}>
                                                Response (EN)
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#171717',
                                                lineHeight: '1.8',
                                                padding: '12px',
                                                backgroundColor: '#f5f5f4',
                                            }}>
                                                {conv.responseEN}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#737373',
                                                marginBottom: '6px',
                                            }}>
                                                Response (JP)
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#525252',
                                                lineHeight: '1.8',
                                                padding: '12px',
                                                backgroundColor: '#f5f5f4',
                                            }}>
                                                {conv.responseJP}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Show hint in review mode */}
                                {reviewMode && !isRevealed && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '24px',
                                        fontSize: '13px',
                                        color: '#a3a3a3',
                                        fontStyle: 'italic',
                                    }}>
                                        クリックして英語訳と回答を表示
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </section>

                {/* Navigation */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <a
                        href="/english/study"
                        style={{
                            fontSize: '13px',
                            color: '#737373',
                            textDecoration: 'underline',
                            marginRight: '24px',
                        }}
                    >
                        ← Study Dashboard
                    </a>
                    <a
                        href="/english"
                        style={{
                            fontSize: '13px',
                            color: '#737373',
                            textDecoration: 'underline',
                        }}
                    >
                        Introduction
                    </a>
                </div>

            </div>
        </div>
    );
}
