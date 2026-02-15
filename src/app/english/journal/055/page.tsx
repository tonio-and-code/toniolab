'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Section { title: string; content: string[]; image?: string; }

export default function EnglishJournal055() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speed, setSpeed] = useState(0.9);
    const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
    const [isShuffle, setIsShuffle] = useState(false);
    const [progress, setProgress] = useState(0);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const repeatModeRef = useRef(0);
    const isShuffleRef = useRef(false);
    const playHistoryRef = useRef<number[]>([]);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Hero image for the journal
    const heroImage = 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/99d65d0e-c177-43e3-f3b7-84df97f5fb00/public';

    const sections: Section[] = [
        { title: 'Introduction', content: ['Listening to Martin Ball while hanging wallpaper, crying to Adyashanti while building n8n workflows. 365 days. 50 journal entries, 10,000 lines. What I saw at the end of it all.'], image: heroImage },
        { title: 'December 31, 2025', content: ['On the way to Kamogawa, a bird was circling above the dam.', 'Thats a kite.', 'The moment I thought that, my eyes began to see a kite.'] },
        { title: 'Krishnamurti', content: ['The moment you name it, you stop seeing it.', 'The moment I labeled it as a kite, my eyes stopped seeing that bird.', 'What Im seeing is the concept of kite.', 'Kites arent rare. Kites have no value.', 'These thoughts run automatically.', 'And the bird in front of me disappears.'] },
        { title: 'Chapter One', content: ['At the beginning of 2025, I was tired.', 'To be precise, I was tired of existing.', 'The fatigue of maintaining the concept of self.', 'The weight of carrying the sign Iwasaki.', 'The emptiness of continuing to play the roles.', 'I understood this intellectually. But my body didnt understand it.'] },
        { title: 'Chapter Two', content: ['I listened to Falling into Grace in my car.', 'While driving, tears wouldnt stop.', 'The door to God is the insecurity of not knowing anything.', 'I was clinging to knowing.', 'That knowing was suffocating me.', 'Grief, unresisted, is grace.', 'I stopped resisting sadness. I was just sad.'] },
        { title: 'Chapter Three', content: ['I found Martin Ball on YouTube.', '5-MeO-DMT, God Molecule, ego death.', 'Human wants to get out. God wants to get in.', 'I wanted to escape. From this body. From this life.', 'But Martin said: Something wants to come in.', 'The vectors are opposite.', 'Hearing this made me feel a little lighter.'] },
        { title: 'Chapter Four', content: ['I met Claude Code.', 'AI is a mirror.', 'The quality of the questions determines the quality of the answers.', 'Dont demand amazing answers from AI. Polish your own amazing questions.', 'AI only returns the average value of the past.', 'I chose to use AI as a tool to its fullest.'] },
        { title: 'Chapter Five', content: ['Ego Game: Fear, scarcity, need for approval leads to suffering.', 'Divine Game: Intuition, flow, truth leads to creation, art, and peace.', 'If you simply manifest the truth that descended from the Unmanifested, it becomes art.'] },
        { title: 'Finally', content: ['In 2025, I went back and forth between wallpaper craftsman, philosopher, and engineer.', 'I still dont know which is the real me.', 'But the feeling of I dont want to exist has faded a little.', 'I allowed myself to exist.', 'Grief, unresisted, is grace.', 'I allowed sadness. I allowed fatigue. I allowed not knowing.', 'And then, I felt a little lighter.'], image: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/57bd153c-fc66-4a52-c7d0-f45be6541e00/public' },
    ];

    const allP = sections.flatMap(s => s.content.map(c => ({ title: s.title, content: c, image: s.image })));
    const total = allP.length;
    const ct = allP[currentIndex] || allP[0];

    const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
        setVoices(enVoices);
        if (!selectedVoice && enVoices.length > 0) {
            const defaultVoice = enVoices.find(v => v.name.includes('Google US English')) || enVoices[0];
            setSelectedVoice(defaultVoice.name);
        }
    };

    const getSelectedVoice = () => {
        const allVoices = window.speechSynthesis.getVoices();
        const selected = allVoices.find(v => v.name === selectedVoice);
        if (selected) return selected;
        // Fallback: ONLY use English voices
        const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
        return enVoices.find(v => v.name.includes('Google US English')) || enVoices[0] || null;
    };

    const getNextIndex = (cur: number): number => {
        if (repeatModeRef.current === 2) return cur; // repeat one
        if (isShuffleRef.current) {
            const avail = allP.map((_, i) => i).filter(i => !playHistoryRef.current.includes(i));
            if (avail.length === 0) {
                if (repeatModeRef.current === 1) { playHistoryRef.current = []; return Math.floor(Math.random() * total); }
                return -1;
            }
            return avail[Math.floor(Math.random() * avail.length)];
        }
        return (cur + 1) >= total ? (repeatModeRef.current === 1 ? 0 : -1) : cur + 1;
    };

    const startProgress = () => {
        setProgress(0);
        let elapsed = 0;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => { elapsed += 50; setProgress(Math.min((elapsed / 3000) * 100, 100)); }, 50);
    };

    const stopProgress = () => { if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; } };

    const playTrack = (index: number) => {
        if (index < 0 || index >= total) { setIsPlaying(false); setProgress(0); stopProgress(); return; }
        const p = allP[index];
        const u = new SpeechSynthesisUtterance(p.content);
        const v = getSelectedVoice(); if (v) u.voice = v;
        u.lang = 'en-US'; u.rate = speed;
        setCurrentIndex(index); setIsPlaying(true); startProgress();
        if (isShuffleRef.current) playHistoryRef.current = [...playHistoryRef.current, index];
        u.onend = () => { stopProgress(); setProgress(100); setTimeout(() => { const n = getNextIndex(index); if (n >= 0) playTrack(n); else { setIsPlaying(false); setProgress(0); } }, 500); };
        window.speechSynthesis.speak(u);
    };

    const togglePlay = () => { if (isPlaying) { window.speechSynthesis.cancel(); setIsPlaying(false); stopProgress(); } else { playTrack(currentIndex); } };
    const playNext = () => { window.speechSynthesis.cancel(); stopProgress(); const n = getNextIndex(currentIndex); playTrack(n >= 0 ? n : 0); };
    const playPrev = () => { window.speechSynthesis.cancel(); stopProgress(); playTrack(currentIndex <= 0 ? (repeatModeRef.current >= 1 ? total - 1 : 0) : currentIndex - 1); };
    const selectTrack = (i: number) => { window.speechSynthesis.cancel(); stopProgress(); playTrack(i); };
    const toggleRepeat = () => { const next = (repeatMode + 1) % 3; repeatModeRef.current = next; setRepeatMode(next); };
    const toggleShuffle = () => { isShuffleRef.current = !isShuffle; setIsShuffle(!isShuffle); playHistoryRef.current = !isShuffle ? [currentIndex] : []; };

    useEffect(() => {
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.cancel(); stopProgress(); };
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1a1a' }}>
                <Link href="/english" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>&#8249; Back</Link>
            </div>
            <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div style={{ width: '280px', height: '280px', margin: '0 auto 32px', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ct?.image || heroImage} alt="Journal 055" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '200', color: '#D4AF37', fontFamily: 'serif' }}>055</div>
                    </div>
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 8px' }}>What Was I Doing in 2025?</h1>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Journal #055 - {total} tracks</p>
            </div>
            <div style={{ padding: '0 24px 24px', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ backgroundColor: '#141414', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{ct?.title}</div>
                    <div style={{ fontSize: '15px', color: '#fff', lineHeight: '1.6', minHeight: '48px' }}>{ct?.content}</div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ height: '4px', backgroundColor: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#D4AF37', transition: 'width 0.05s linear' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#666' }}>
                        <span>{currentIndex + 1} / {total}</span>
                        <span>{speed.toFixed(2)}x</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                    <button onClick={toggleShuffle} style={{ background: 'none', border: 'none', color: isShuffle ? '#D4AF37' : '#666', cursor: 'pointer', padding: '8px' }} title="Shuffle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
                    </button>
                    <button onClick={playPrev} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>
                    <button onClick={togglePlay} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D4AF37', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isPlaying ? <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg width="28" height="28" viewBox="0 0 24 24" fill="#000" style={{ marginLeft: '3px' }}><path d="M8 5v14l11-7z"/></svg>}
                    </button>
                    <button onClick={playNext} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>
                    <button onClick={toggleRepeat} style={{ background: 'none', border: 'none', color: repeatMode > 0 ? '#D4AF37' : '#666', cursor: 'pointer', padding: '8px', position: 'relative' }} title={repeatMode === 0 ? 'Repeat Off' : repeatMode === 1 ? 'Repeat All' : 'Repeat One'}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
                        {repeatMode === 2 && <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>1</span>}
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', color: '#666', minWidth: '32px' }}>0.5x</span>
                    <input type="range" min="0.5" max="1.5" step="0.05" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} style={{ width: '150px', accentColor: '#D4AF37' }} />
                    <span style={{ fontSize: '12px', color: '#666', minWidth: '32px' }}>1.5x</span>
                    <span style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '600', minWidth: '45px', textAlign: 'center' }}>{speed.toFixed(2)}x</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>Voice:</span>
                    <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} style={{ backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', minWidth: '200px' }}>
                        {voices.map((v) => (
                            <option key={v.name} value={v.name}>{v.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Tracks</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {allP.map((p, i) => {
                        const isA = i === currentIndex;
                        return (
                            <div key={i} onClick={() => selectTrack(i)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: isA ? '#1a1a1a' : 'transparent', borderRadius: '8px', cursor: 'pointer' }}>
                                {p.image ? (
                                    <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ) : (
                                    <div style={{ width: '24px', textAlign: 'center', fontSize: '13px', color: isA ? '#D4AF37' : '#444' }}>{isA && isPlaying ? <span style={{ color: '#D4AF37' }}>&#9835;</span> : i + 1}</div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', color: isA ? '#D4AF37' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.content.slice(0, 60)}{p.content.length > 60 ? '...' : ''}</div>
                                    <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{p.title}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ height: '100px' }} />
        </div>
    );
}
