'use client';

import { useState, useEffect, useRef } from 'react';

export type ConversationTone = 'casual' | 'formal' | 'philosophical' | 'humorous';

export interface DialogueLine {
    speaker: 'male' | 'female';
    text: string;
    timestamp?: number;
}

export interface ConversationData {
    english: DialogueLine[];
    japanese: DialogueLine[];
    audioUrl?: string;
    generatedAt: Date;
    tone: ConversationTone;
    duration?: number;
}

interface ConversationPlayerProps {
    conversation: DialogueLine[];
    theme?: 'dark' | 'light';
}

const themes = {
    dark: {
        bg: '#0a0a0a',
        bgSecondary: '#1a1a1a',
        bgTertiary: '#141414',
        text: '#fff',
        textSecondary: '#888',
        textMuted: '#666',
        border: '#1a1a1a',
        borderLight: '#333',
        accent: '#D4AF37',
        success: '#10b981',
    },
    light: {
        bg: '#f5f5f5',
        bgSecondary: '#ffffff',
        bgTertiary: '#fafafa',
        text: '#1a1a1a',
        textSecondary: '#555',
        textMuted: '#666',
        border: '#e5e5e5',
        borderLight: '#d5d5d5',
        accent: '#B8960C',
        success: '#059669',
    },
};

export default function ConversationPlayer({ conversation, theme = 'light' }: ConversationPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1.0);
    const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
    const [isShuffle, setIsShuffle] = useState(false);
    const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const repeatModeRef = useRef(0);
    const isShuffleRef = useRef(false);

    const t = themes[theme];
    const currentLine = conversation[currentIndex];

    // Initialize voices
    useEffect(() => {
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const enVoices = allVoices.filter(v => v.lang.startsWith('en'));

            if (enVoices.length > 0) {
                const male = enVoices.find(v => v.name.includes('Google US English') || v.name.includes('Male')) || enVoices[0];
                const female = enVoices.find(v => v.name.includes('Female')) || enVoices[1] || enVoices[0];
                setMaleVoice(male);
                setFemaleVoice(female);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
            stopProgress();
        };
    }, []);

    const startProgress = () => {
        setProgress(0);
        let elapsed = 0;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        const duration = 3000 * (1 / speed); // Approximate duration per line adjusted by speed

        progressIntervalRef.current = setInterval(() => {
            elapsed += 50;
            const p = Math.min((elapsed / duration) * 100, 100);
            setProgress(p);
        }, 50);
    };

    const stopProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const playLine = (index: number) => {
        if (index < 0 || index >= conversation.length) {
            setIsPlaying(false);
            stopProgress();
            return;
        }

        const line = conversation[index];
        const utterance = new SpeechSynthesisUtterance(line.text);

        const voice = line.speaker === 'male' ? maleVoice : femaleVoice;
        if (voice) utterance.voice = voice;

        utterance.lang = 'en-US';
        utterance.rate = speed;

        setCurrentIndex(index);
        setIsPlaying(true);
        startProgress();

        utterance.onend = () => {
            stopProgress();
            setProgress(100);

            setTimeout(() => {
                const nextIndex = getNextIndex(index);
                if (nextIndex >= 0) {
                    playLine(nextIndex);
                } else {
                    setIsPlaying(false);
                    setProgress(0);
                }
            }, 500);
        };

        window.speechSynthesis.speak(utterance);
    };

    const getNextIndex = (current: number): number => {
        const total = conversation.length;
        if (repeatModeRef.current === 2) return current; // repeat one

        if (isShuffleRef.current) {
            return Math.floor(Math.random() * total);
        }

        const next = current + 1;
        if (next >= total) {
            return repeatModeRef.current === 1 ? 0 : -1; // repeat all or stop
        }
        return next;
    };

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            stopProgress();
        } else {
            playLine(currentIndex);
        }
    };

    const playNext = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const next = getNextIndex(currentIndex);
        playLine(next >= 0 ? next : 0);
    };

    const playPrevious = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const prev = currentIndex <= 0 ? conversation.length - 1 : currentIndex - 1;
        playLine(prev);
    };

    const toggleRepeat = () => {
        const next = (repeatMode + 1) % 3;
        repeatModeRef.current = next;
        setRepeatMode(next);
    };

    const toggleShuffle = () => {
        isShuffleRef.current = !isShuffle;
        setIsShuffle(!isShuffle);
    };

    return (
        <div style={{ backgroundColor: t.bgSecondary, borderRadius: '16px', padding: '24px', border: `1px solid ${t.borderLight}` }}>
            <h3 style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                English Conversation
            </h3>

            {/* Current Line Display */}
            <div style={{ backgroundColor: t.bgTertiary, borderRadius: '12px', padding: '20px', marginBottom: '24px', border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: currentLine?.speaker === 'male' ? '#4A9EFF' : '#FF69B4', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    <img src={currentLine?.speaker === 'male' ? '/icons/takumi.png' : '/icons/anya.png'} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                    {currentLine?.speaker === 'male' ? 'Takumi' : 'Anya'}
                </div>
                <div style={{ fontSize: '16px', color: t.text, lineHeight: '1.6', minHeight: '48px', fontWeight: '500' }}>
                    {currentLine?.text || 'Select a line to play'}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ height: '4px', backgroundColor: t.borderLight, borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, backgroundColor: t.accent, transition: 'width 0.05s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: t.textMuted }}>
                    <span>{currentIndex + 1} / {conversation.length}</span>
                    <span>{speed.toFixed(1)}x</span>
                </div>
            </div>

            {/* Playback Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                <button onClick={toggleShuffle} style={{ background: 'none', border: 'none', color: isShuffle ? t.accent : t.textMuted, cursor: 'pointer', padding: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
                </button>
                <button onClick={playPrevious} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                </button>
                <button onClick={togglePlay} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: t.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    {isPlaying ? <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z" /></svg>}
                </button>
                <button onClick={playNext} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                </button>
                <button onClick={toggleRepeat} style={{ background: 'none', border: 'none', color: repeatMode > 0 ? t.accent : t.textMuted, cursor: 'pointer', padding: '8px', position: 'relative' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
                    {repeatMode === 2 && <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: t.accent }}>1</span>}
                </button>
            </div>

            {/* Conversation Lines List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '300px', overflowY: 'auto' }}>
                {conversation.map((line, i) => {
                    const isActive = i === currentIndex;
                    const speakerColor = line.speaker === 'male' ? '#4A9EFF' : '#FF69B4'; // Takumi: Blue, Anya: Pink

                    return (
                        <div key={i} onClick={() => { window.speechSynthesis.cancel(); stopProgress(); playLine(i); }} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', backgroundColor: isActive ? t.bgTertiary : 'transparent', borderRadius: '8px', cursor: 'pointer', border: isActive ? `1px solid ${t.borderLight}` : '1px solid transparent' }}>
                            <div style={{ width: '24px', textAlign: 'center', fontSize: '13px', color: isActive ? t.accent : t.textMuted }}>{isActive && isPlaying ? '♫' : i + 1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: speakerColor, marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                                    <img src={line.speaker === 'male' ? '/icons/takumi.png' : '/icons/anya.png'} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                                    {line.speaker === 'male' ? 'Takumi' : 'Anya'}
                                </div>
                                <div style={{ fontSize: '14px', color: isActive ? t.accent : t.text, lineHeight: '1.5' }}>{line.text}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
