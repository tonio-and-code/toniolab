'use client';

import { useState, useCallback } from 'react';

interface PPWordPickerState {
    id: string;
    words: string[];
    selected: boolean[];
}

export function usePPWordPicker() {
    const [ppWordPicker, setPpWordPicker] = useState<PPWordPickerState | null>(null);

    const openPP = useCallback((id: string, englishText: string) => {
        const words = englishText.replace(/[^\w\s'-]/g, ' ').trim().split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return;
        setPpWordPicker({ id, words, selected: words.map(() => false) });
    }, []);

    const toggleWord = useCallback((idx: number) => {
        setPpWordPicker(prev => {
            if (!prev) return prev;
            const next = [...prev.selected];
            next[idx] = !next[idx];
            return { ...prev, selected: next };
        });
    }, []);

    const closePP = useCallback(() => setPpWordPicker(null), []);

    const search = useCallback(() => {
        if (!ppWordPicker) return;
        const query = ppWordPicker.words.filter((_, i) => ppWordPicker.selected[i]).join(' ');
        if (!query.trim()) return;
        window.open(`https://www.playphrase.me/#/search?q=${encodeURIComponent(query.trim())}`, '_blank');
    }, [ppWordPicker]);

    return { ppWordPicker, openPP, toggleWord, closePP, search };
}

export function PPButton({ onClick, style }: { onClick: () => void; style?: React.CSSProperties }) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            style={{
                padding: '2px 10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #D4AF37, #F5D76E)',
                color: '#1a1a1a',
                fontSize: '10px',
                fontWeight: '700',
                transition: 'all 0.15s',
                letterSpacing: '0.3px',
                ...style,
            }}
        >
            PP
        </button>
    );
}

export function PPPopup({ state, onToggle, onClose, onSearch }: {
    state: PPWordPickerState;
    onToggle: (idx: number) => void;
    onClose: () => void;
    onSearch: () => void;
}) {
    const hasSelection = state.selected.some(s => s);

    return (
        <div style={{
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 1100, backgroundColor: '#fff', borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)', padding: '16px 20px',
            maxWidth: '600px', width: '90vw',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#D4AF37', letterSpacing: '1px' }}>PlayPhrase.me</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px' }}>X</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {state.words.map((word, idx) => (
                    <button
                        key={idx}
                        onClick={() => onToggle(idx)}
                        style={{
                            padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '14px', fontWeight: state.selected[idx] ? '700' : '400',
                            border: state.selected[idx] ? '2px solid #D4AF37' : '1px solid #e5e5e5',
                            backgroundColor: state.selected[idx] ? '#FFFBEB' : '#f9f9f9',
                            color: state.selected[idx] ? '#92400E' : '#666',
                            transition: 'all 0.1s',
                        }}
                    >
                        {word}
                    </button>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1, fontSize: '13px', color: '#999', minHeight: '20px' }}>
                    {hasSelection
                        ? state.words.filter((_, i) => state.selected[i]).join(' ')
                        : 'Tap words to select'}
                </div>
                {hasSelection && (
                    <button
                        onClick={() => {
                            const text = state.words.filter((_, i) => state.selected[i]).join(' ');
                            const u = new SpeechSynthesisUtterance(text);
                            u.lang = 'en-US'; u.rate = 0.9;
                            window.speechSynthesis.cancel();
                            window.speechSynthesis.speak(u);
                        }}
                        style={{
                            padding: '8px 12px', borderRadius: '10px', border: '1px solid #ddd',
                            background: '#f9f9f9', color: '#666', fontSize: '13px', cursor: 'pointer',
                        }}
                    >
                        Listen
                    </button>
                )}
                <button
                    onClick={onSearch}
                    disabled={!hasSelection}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', border: 'none',
                        background: hasSelection ? 'linear-gradient(135deg, #D4AF37, #F5D76E)' : '#e5e5e5',
                        color: hasSelection ? '#1a1a1a' : '#999',
                        fontSize: '13px', fontWeight: '700',
                        cursor: hasSelection ? 'pointer' : 'not-allowed',
                    }}
                >
                    Search
                </button>
            </div>
        </div>
    );
}
