'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SavedPhrasesStorage, SavedPhrase } from '@/lib/saved-phrases';

export default function BookmarksPage() {
    const router = useRouter();
    const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
    const [mounted, setMounted] = useState(false);
    const [syncing, setSyncing] = useState<string | null>(null);
    const [editingJapanese, setEditingJapanese] = useState<string | null>(null);
    const [japaneseText, setJapaneseText] = useState<string>('');
    const [bulkDate, setBulkDate] = useState<string>('');
    const [bulkSyncing, setBulkSyncing] = useState(false);
    const [phraseDates, setPhraseDates] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Vocabulary modal state
    const [showVocabModal, setShowVocabModal] = useState(false);
    const [vocabExample, setVocabExample] = useState('');
    const [vocabWord, setVocabWord] = useState('');
    const [vocabMeaning, setVocabMeaning] = useState('');
    const [vocabType, setVocabType] = useState('word');
    const [vocabSaving, setVocabSaving] = useState(false);
    const [vocabDate, setVocabDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });

    useEffect(() => {
        setMounted(true);
        loadPhrases();
    }, []);

    const loadPhrases = () => {
        setPhrases(SavedPhrasesStorage.getAll());
    };

    const handleRemove = (id: string) => {
        SavedPhrasesStorage.remove(id);
        loadPhrases();
    };

    const speakPhrase = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
        window.speechSynthesis.speak(utterance);
    };

    const getTodayStr = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const syncPhrase = async (phrase: SavedPhrase, date: string) => {
        setSyncing(phrase.id);
        try {
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: phrase.english,
                    japanese: phrase.japanese || '',
                    category: 'daily',
                    date: date,
                }),
            });

            if (res.ok) {
                SavedPhrasesStorage.markSynced([phrase.id]);
                loadPhrases();
            }
        } catch (e) {
            console.error('Sync failed:', e);
        } finally {
            setSyncing(null);
        }
    };

    const updateJapanese = (id: string, japanese: string) => {
        const allPhrases = SavedPhrasesStorage.getAll();
        const updated = allPhrases.map(p =>
            p.id === id ? { ...p, japanese } : p
        );
        localStorage.setItem('saved_phrases', JSON.stringify(updated));
        loadPhrases();
        setEditingJapanese(null);
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const unsyncedPhrases = phrases.filter(p => !p.syncedToDb);
    const syncedPhrases = phrases.filter(p => p.syncedToDb);

    const syncSelectedPhrases = async () => {
        if (!bulkDate || selectedIds.size === 0) return;
        setBulkSyncing(true);
        const syncedIds: string[] = [];
        const toSync = unsyncedPhrases.filter(p => selectedIds.has(p.id));

        for (const phrase of toSync) {
            try {
                const res = await fetch('/api/phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        english: phrase.english,
                        japanese: phrase.japanese || '',
                        category: 'daily',
                        date: bulkDate,
                    }),
                });
                if (res.ok) {
                    syncedIds.push(phrase.id);
                }
            } catch (e) {
                console.error('Sync failed:', e);
            }
        }

        if (syncedIds.length > 0) {
            SavedPhrasesStorage.markSynced(syncedIds);
            setSelectedIds(prev => {
                const next = new Set(prev);
                syncedIds.forEach(id => next.delete(id));
                return next;
            });
            loadPhrases();
        }
        setBulkSyncing(false);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === unsyncedPhrases.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(unsyncedPhrases.map(p => p.id)));
        }
    };

    const openVocabModal = (english: string) => {
        setVocabExample(english);
        setVocabWord('');
        setVocabMeaning('');
        setVocabType('word');
        setShowVocabModal(true);
    };

    const saveToVocabulary = async () => {
        if (!vocabWord.trim() || !vocabMeaning.trim()) return;
        setVocabSaving(true);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: vocabWord.trim(),
                    type: vocabType,
                    meaning: vocabMeaning.trim(),
                    example: vocabExample,
                    source: 'Bookmarks',
                    date: vocabDate,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowVocabModal(false);
                setVocabWord('');
                setVocabMeaning('');
                setVocabExample('');
                alert('Saved!');
            } else {
                alert(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Failed to save vocabulary:', err);
            alert('Error saving vocabulary');
        } finally {
            setVocabSaving(false);
        }
    };

    if (!mounted) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#888' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e5e5',
                backgroundColor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/english" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
                        ← Back
                    </Link>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                        {unsyncedPhrases.length} pending
                    </span>
                </div>
            </div>

            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Title */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                        Bookmarks
                    </h1>
                    <p style={{ fontSize: '13px', color: '#888' }}>
                        Save phrases, add Japanese, then register to Daily Phrases
                    </p>
                </div>

                {/* Empty State */}
                {phrases.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 24px',
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e5e5e5',
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                            No bookmarks yet
                        </h2>
                        <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.6', marginBottom: '24px' }}>
                            Tap the bookmark icon on any phrase<br />to save it here
                        </p>
                        <button
                            onClick={() => router.push('/memoria')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#D4AF37',
                                color: '#000',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Browse Memoria
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Unsynced Section */}
                        {unsyncedPhrases.length > 0 && (
                            <div>
                                {/* Bulk Registration */}
                                <div style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: '2px solid #D4AF37',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                                            Batch Register ({selectedIds.size}/{unsyncedPhrases.length} selected)
                                        </div>
                                        <button
                                            onClick={toggleSelectAll}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #D4AF37',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                fontSize: '12px',
                                                color: '#D4AF37',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {selectedIds.size === unsyncedPhrases.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            type="date"
                                            value={bulkDate}
                                            onChange={(e) => {
                                                setBulkDate(e.target.value);
                                                const newDates: Record<string, string> = {};
                                                unsyncedPhrases.forEach(p => {
                                                    newDates[p.id] = e.target.value;
                                                });
                                                setPhraseDates(newDates);
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e5e5',
                                                fontSize: '14px',
                                            }}
                                        />
                                        <button
                                            onClick={syncSelectedPhrases}
                                            disabled={!bulkDate || bulkSyncing || selectedIds.size === 0}
                                            style={{
                                                padding: '12px 20px',
                                                backgroundColor: !bulkDate || bulkSyncing || selectedIds.size === 0 ? '#e5e5e5' : '#10b981',
                                                color: !bulkDate || bulkSyncing || selectedIds.size === 0 ? '#888' : '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: !bulkDate || bulkSyncing || selectedIds.size === 0 ? 'not-allowed' : 'pointer',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {bulkSyncing ? 'Registering...' : `Register (${selectedIds.size})`}
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                                        Check phrases below to select, then pick a date
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#888',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}>
                                    PENDING ({unsyncedPhrases.length})
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {unsyncedPhrases.map((phrase) => (
                                        <div
                                            key={phrase.id}
                                            style={{
                                                backgroundColor: selectedIds.has(phrase.id) ? '#fefce8' : '#fff',
                                                borderRadius: '12px',
                                                border: selectedIds.has(phrase.id) ? '1px solid #D4AF37' : '1px solid #e5e5e5',
                                                overflow: 'hidden',
                                                transition: 'background-color 0.15s, border-color 0.15s',
                                            }}
                                        >
                                            {/* Phrase Content */}
                                            <div style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                    {/* Checkbox */}
                                                    <button
                                                        onClick={() => toggleSelect(phrase.id)}
                                                        style={{
                                                            width: '22px',
                                                            height: '22px',
                                                            borderRadius: '4px',
                                                            border: selectedIds.has(phrase.id) ? '2px solid #D4AF37' : '2px solid #ccc',
                                                            backgroundColor: selectedIds.has(phrase.id) ? '#D4AF37' : 'transparent',
                                                            cursor: 'pointer',
                                                            flexShrink: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginTop: '1px',
                                                            padding: 0,
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        {selectedIds.has(phrase.id) && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                                                                <path d="M20 6L9 17l-5-5" />
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* Play Button */}
                                                    <button
                                                        onClick={() => speakPhrase(phrase.english)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '4px',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#D4AF37">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </button>

                                                    {/* Content */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '15px', color: '#1a1a1a', lineHeight: '1.5', marginBottom: '8px' }}>
                                                            {phrase.english}
                                                        </div>

                                                        {/* Japanese Input */}
                                                        {editingJapanese === phrase.id ? (
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <input
                                                                    type="text"
                                                                    value={japaneseText}
                                                                    onChange={(e) => setJapaneseText(e.target.value)}
                                                                    placeholder="日本語訳"
                                                                    autoFocus
                                                                    style={{
                                                                        flex: 1,
                                                                        padding: '8px 12px',
                                                                        borderRadius: '8px',
                                                                        border: '1px solid #e5e5e5',
                                                                        fontSize: '13px',
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => updateJapanese(phrase.id, japaneseText)}
                                                                    style={{
                                                                        padding: '8px 12px',
                                                                        backgroundColor: '#10b981',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        fontSize: '12px',
                                                                        fontWeight: '600',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    OK
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingJapanese(phrase.id);
                                                                    setJapaneseText(phrase.japanese || '');
                                                                }}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    padding: 0,
                                                                    cursor: 'pointer',
                                                                    textAlign: 'left',
                                                                }}
                                                            >
                                                                <span style={{
                                                                    fontSize: '13px',
                                                                    color: phrase.japanese ? '#666' : '#D4AF37',
                                                                    borderBottom: phrase.japanese ? 'none' : '1px dashed #D4AF37',
                                                                }}>
                                                                    {phrase.japanese || '+ Add Japanese'}
                                                                </span>
                                                            </button>
                                                        )}

                                                        {phrase.source && (
                                                            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
                                                                {phrase.source}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* +Vocab Button */}
                                                    <button
                                                        onClick={() => openVocabModal(phrase.english)}
                                                        style={{
                                                            background: 'none',
                                                            border: '1px solid #10B981',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            padding: '4px 8px',
                                                            fontSize: '11px',
                                                            color: '#10B981',
                                                            fontWeight: '600',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        +Vocab
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleRemove(phrase.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '4px',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                                                            <path d="M18 6L6 18M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Footer with individual date */}
                                            <div style={{
                                                padding: '12px 16px',
                                                backgroundColor: '#fafafa',
                                                borderTop: '1px solid #f0f0f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}>
                                                <input
                                                    type="date"
                                                    value={phraseDates[phrase.id] || bulkDate || ''}
                                                    onChange={(e) => setPhraseDates(prev => ({ ...prev, [phrase.id]: e.target.value }))}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e5e5e5',
                                                        fontSize: '13px',
                                                        backgroundColor: '#fff',
                                                    }}
                                                />
                                                <button
                                                    onClick={() => syncPhrase(phrase, phraseDates[phrase.id] || bulkDate)}
                                                    disabled={syncing === phrase.id || (!phraseDates[phrase.id] && !bulkDate)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: syncing === phrase.id || (!phraseDates[phrase.id] && !bulkDate) ? '#e5e5e5' : '#10b981',
                                                        color: syncing === phrase.id || (!phraseDates[phrase.id] && !bulkDate) ? '#888' : '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        cursor: syncing === phrase.id || (!phraseDates[phrase.id] && !bulkDate) ? 'not-allowed' : 'pointer',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {syncing === phrase.id ? '...' : 'Register'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Synced Section */}
                        {syncedPhrases.length > 0 && (
                            <div style={{ marginTop: unsyncedPhrases.length > 0 ? '24px' : 0 }}>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#10b981',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}>
                                    <span style={{
                                        backgroundColor: '#10b981',
                                        color: '#fff',
                                        borderRadius: '10px',
                                        padding: '2px 8px',
                                        fontSize: '10px',
                                    }}>
                                        {syncedPhrases.length}
                                    </span>
                                    REGISTERED
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {syncedPhrases.map((phrase) => (
                                        <div
                                            key={phrase.id}
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '10px',
                                                border: '1px solid #e5e5e5',
                                                padding: '12px 16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                            }}
                                        >
                                            <button
                                                onClick={() => speakPhrase(phrase.english)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '2px',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '14px', color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {phrase.english}
                                                </div>
                                                {phrase.japanese && (
                                                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                                                        {phrase.japanese}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => openVocabModal(phrase.english)}
                                                style={{
                                                    background: 'none',
                                                    border: '1px solid #10B981',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    padding: '4px 8px',
                                                    fontSize: '11px',
                                                    color: '#10B981',
                                                    fontWeight: '600',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                +Vocab
                                            </button>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                                <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom Spacer */}
                <div style={{ height: '100px' }} />
            </div>

            {/* Vocabulary Save Modal */}
            {showVocabModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Save to Vocabulary</h3>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
                            >
                                x
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Example Sentence</label>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.5'
                            }}>
                                {vocabExample}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Date</label>
                            <input
                                type="date"
                                value={vocabDate}
                                onChange={(e) => setVocabDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Word / Phrase to Learn *</label>
                            <input
                                type="text"
                                value={vocabWord}
                                onChange={(e) => setVocabWord(e.target.value)}
                                placeholder="e.g., rabbit hole, get the hang of"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Type</label>
                            <select
                                value={vocabType}
                                onChange={(e) => setVocabType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="word">Word</option>
                                <option value="idiom">Idiom</option>
                                <option value="phrasal verb">Phrasal Verb</option>
                                <option value="slang">Slang</option>
                                <option value="expression">Expression</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Meaning (Japanese) *</label>
                            <input
                                type="text"
                                value={vocabMeaning}
                                onChange={(e) => setVocabMeaning(e.target.value)}
                                placeholder="e.g., 深みにはまる、コツをつかむ"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowVocabModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: '#f5f5f5',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveToVocabulary}
                                disabled={vocabSaving || !vocabWord.trim() || !vocabMeaning.trim()}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: (!vocabWord.trim() || !vocabMeaning.trim()) ? '#ccc' : '#10B981',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: (!vocabWord.trim() || !vocabMeaning.trim()) ? 'not-allowed' : 'pointer',
                                    color: '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                {vocabSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
