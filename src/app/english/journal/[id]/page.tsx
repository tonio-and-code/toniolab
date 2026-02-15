/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, useParams, notFound } from 'next/navigation';
import { journalEntries } from '@/data/journal';
import { SavedPhrasesStorage } from '@/lib/saved-phrases';

export default function EnglishJournalDetailPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speed, setSpeed] = useState(0.9);
    const [repeatMode, setRepeatMode] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [progress, setProgress] = useState(0);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [autoNextEntry, setAutoNextEntry] = useState(false);
    const [shuffleEntries, setShuffleEntries] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
    const repeatModeRef = useRef(0);
    const isShuffleRef = useRef(false);
    const playHistoryRef = useRef<number[]>([]);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const autoNextEntryRef = useRef(false);
    const shuffleEntriesRef = useRef(false);

    useEffect(() => {
        autoNextEntryRef.current = autoNextEntry;
        shuffleEntriesRef.current = shuffleEntries;
    }, [autoNextEntry, shuffleEntries]);

    // Load settings from localStorage
    useEffect(() => {
        const savedPlayMode = localStorage.getItem('player_playMode');
        const savedSpeed = localStorage.getItem('player_speed');
        const savedRepeatMode = localStorage.getItem('player_repeatMode');
        const savedShuffle = localStorage.getItem('player_shuffle');

        if (savedPlayMode === 'auto') {
            setAutoNextEntry(true);
            setShuffleEntries(false);
        } else if (savedPlayMode === 'shuffle') {
            setAutoNextEntry(true);
            setShuffleEntries(true);
        }

        if (savedSpeed) setSpeed(parseFloat(savedSpeed));
        if (savedRepeatMode) {
            const mode = parseInt(savedRepeatMode);
            setRepeatMode(mode);
            repeatModeRef.current = mode;
        }
        if (savedShuffle === 'true') {
            setIsShuffle(true);
            isShuffleRef.current = true;
        }

        setSettingsLoaded(true);
    }, []);

    // Save settings to localStorage when they change
    useEffect(() => {
        if (!settingsLoaded) return;
        const playMode = !autoNextEntry ? 'manual' : shuffleEntries ? 'shuffle' : 'auto';
        localStorage.setItem('player_playMode', playMode);
    }, [autoNextEntry, shuffleEntries, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('player_speed', speed.toString());
    }, [speed, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('player_repeatMode', repeatMode.toString());
    }, [repeatMode, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('player_shuffle', isShuffle.toString());
    }, [isShuffle, settingsLoaded]);

    const entry = journalEntries.find(e => e.id === id);

    // Get all entries with englishSummary for navigation
    const allEntriesWithEnglish = (journalEntries as any[])
        .filter(e => e.englishSummary)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentEntryIndex = allEntriesWithEnglish.findIndex(e => e.id === id);

    if (!entry || !(entry as any).englishSummary) {
        notFound();
    }

    const { englishSummary, heroImage } = entry as any;

    // Create tracks from sections
    const allTracks: { title: string; content: string; image: string }[] = [];
    for (const section of englishSummary.sections as { heading: string; paragraphs: string[]; image?: string }[]) {
        for (const paragraph of section.paragraphs) {
            allTracks.push({
                title: section.heading,
                content: paragraph,
                image: section.image || heroImage
            });
        }
    }

    const total = allTracks.length;
    const currentTrack = allTracks[currentIndex] || allTracks[0];

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
        // First try to find the selected voice
        const selected = allVoices.find(v => v.name === selectedVoice);
        if (selected) return selected;

        // Fallback: ONLY use English voices, never Japanese
        const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
        if (enVoices.length > 0) {
            // Prefer Google US English
            return enVoices.find(v => v.name.includes('Google US English')) || enVoices[0];
        }

        // Last resort: find any voice with 'en' in the lang
        return allVoices.find(v => v.lang.includes('en')) || null;
    };

    const getNextIndex = (cur: number): number => {
        if (repeatModeRef.current === 2) return cur;
        if (isShuffleRef.current) {
            const avail = allTracks.map((_: any, i: number) => i).filter((i: number) => !playHistoryRef.current.includes(i));
            if (avail.length === 0) {
                // All tracks played in this entry
                if (repeatModeRef.current === 1) {
                    // Repeat all: reset history and continue shuffling
                    playHistoryRef.current = [];
                    const nextIdx = Math.floor(Math.random() * total);
                    playHistoryRef.current.push(nextIdx);
                    return nextIdx;
                }
                // No repeat - check auto next entry
                if (autoNextEntryRef.current && allEntriesWithEnglish.length > 1) {
                    setTimeout(() => goToNextEntry(), 500);
                    return -1;
                }
                return -1;
            }
            // Pick random from available tracks
            const nextIdx = avail[Math.floor(Math.random() * avail.length)];
            playHistoryRef.current.push(nextIdx);
            return nextIdx;
        }

        const next = cur + 1;
        if (next >= total) {
            // Repeat all: loop within this article
            if (repeatModeRef.current === 1) return 0;

            // Article finished and repeat is off - check if we should go to next article
            if (autoNextEntryRef.current && allEntriesWithEnglish.length > 1) {
                setTimeout(() => goToNextEntry(), 500);
                return -1;
            }
            return -1;
        }
        return next;
    };

    const startProgress = () => {
        setProgress(0);
        let elapsed = 0;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => {
            elapsed += 50;
            setProgress(Math.min((elapsed / 3000) * 100, 100));
        }, 50);
    };

    const stopProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const playTrack = (index: number) => {
        if (index < 0 || index >= total) {
            setIsPlaying(false);
            setProgress(0);
            stopProgress();
            return;
        }
        const track = allTracks[index];
        const utterance = new SpeechSynthesisUtterance(track.content);
        const voice = getSelectedVoice();
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
                const n = getNextIndex(index);
                if (n >= 0) playTrack(n);
                else { setIsPlaying(false); setProgress(0); }
            }, 500);
        };
        window.speechSynthesis.speak(utterance);
    };

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            stopProgress();
        } else {
            playTrack(currentIndex);
        }
    };

    const playNext = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const n = getNextIndex(currentIndex);
        playTrack(n >= 0 ? n : 0);
    };

    const playPrev = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        playTrack(currentIndex <= 0 ? (repeatModeRef.current >= 1 ? total - 1 : 0) : currentIndex - 1);
    };

    const selectTrack = (i: number) => {
        window.speechSynthesis.cancel();
        stopProgress();
        playTrack(i);
    };

    const toggleRepeat = () => {
        const next = (repeatMode + 1) % 3;
        setRepeatMode(next);
        repeatModeRef.current = next;
    };

    const toggleShuffle = () => {
        const newShuffle = !isShuffle;
        setIsShuffle(newShuffle);
        isShuffleRef.current = newShuffle;
        playHistoryRef.current = newShuffle ? [currentIndex] : [];
    };

    // Article navigation functions
    const goToNextEntry = () => {
        if (allEntriesWithEnglish.length === 0) return;

        window.speechSynthesis.cancel();
        stopProgress();
        setIsPlaying(false);

        // Reset shuffle history for the new entry
        playHistoryRef.current = [];

        let nextIdx: number;
        if (shuffleEntriesRef.current) {
            nextIdx = Math.floor(Math.random() * allEntriesWithEnglish.length);
        } else {
            nextIdx = currentEntryIndex + 1;
            if (nextIdx >= allEntriesWithEnglish.length) nextIdx = 0;
        }

        const nextEntry = allEntriesWithEnglish[nextIdx];
        if (nextEntry) {
            router.push(`/english/journal/${nextEntry.id}?autoplay=true`);
        }
    };

    const goToPrevEntry = () => {
        if (allEntriesWithEnglish.length === 0) return;

        window.speechSynthesis.cancel();
        stopProgress();
        setIsPlaying(false);

        // Reset shuffle history for the new entry
        playHistoryRef.current = [];

        let prevIdx = currentEntryIndex - 1;
        if (prevIdx < 0) prevIdx = allEntriesWithEnglish.length - 1;

        const prevEntry = allEntriesWithEnglish[prevIdx];
        if (prevEntry) {
            router.push(`/english/journal/${prevEntry.id}`);
        }
    };

    // Auto-play when navigating from previous article
    useEffect(() => {
        const autoplay = searchParams?.get('autoplay');
        if (autoplay === 'true' && total > 0) {
            const timer = setTimeout(() => {
                playTrack(0);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchParams, total]);

    useEffect(() => {
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.cancel(); stopProgress(); };
    }, []);

    // Load saved phrases
    useEffect(() => {
        const saved = SavedPhrasesStorage.getAll();
        setSavedPhrases(new Set(saved.map(p => p.english)));
    }, []);

    // Toggle save phrase
    const toggleSavePhrase = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (savedPhrases.has(text)) {
            const all = SavedPhrasesStorage.getAll();
            const found = all.find(p => p.english === text);
            if (found) SavedPhrasesStorage.remove(found.id);
            setSavedPhrases(prev => {
                const next = new Set(prev);
                next.delete(text);
                return next;
            });
        } else {
            SavedPhrasesStorage.save({
                english: text,
                source: `Journal #${id}`,
            });
            setSavedPhrases(prev => new Set(prev).add(text));
        }
    };

    const currentIsSaved = currentTrack ? savedPhrases.has(currentTrack.content) : false;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF9', color: '#1C1917' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E7E5E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/english/journal" style={{ color: '#78716C', textDecoration: 'none', fontSize: '13px' }}>
                    &#8249; Back to Journal
                </Link>
                {savedPhrases.size > 0 && (
                    <button
                        onClick={() => router.push('/english/saved')}
                        style={{
                            background: 'none',
                            border: '1px solid #D4AF37',
                            color: '#D4AF37',
                            cursor: 'pointer',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <span>★</span>
                        <span>{savedPhrases.size}</span>
                    </button>
                )}
            </div>
            <div style={{ textAlign: 'center', padding: '20px 24px 40px' }}>
                {/* Article Navigation */}
                {allEntriesWithEnglish.length > 1 && (
                    <div style={{
                        maxWidth: '400px',
                        margin: '0 auto 24px',
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #E7E5E4'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', color: '#78716C', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Article {currentEntryIndex + 1} / {allEntriesWithEnglish.length}
                            </span>
                            <select
                                value={autoNextEntry ? (shuffleEntries ? 'shuffle' : 'auto') : 'off'}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAutoNextEntry(val !== 'off');
                                    setShuffleEntries(val === 'shuffle');
                                }}
                                style={{
                                    background: '#fff',
                                    border: `1px solid ${autoNextEntry ? '#D4AF37' : '#D6D3D1'}`,
                                    color: autoNextEntry ? '#D4AF37' : '#78716C',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: '600'
                                }}
                            >
                                <option value="off">MANUAL</option>
                                <option value="auto">AUTO</option>
                                <option value="shuffle">SHUFFLE</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={goToPrevEntry}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: '1px solid #E7E5E4',
                                    color: '#44403C',
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                </svg>
                                Prev
                            </button>
                            <button
                                onClick={goToNextEntry}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: '1px solid #E7E5E4',
                                    color: '#44403C',
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                Next
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                <div style={{ width: '280px', height: '280px', margin: '0 auto 32px', backgroundColor: '#F5F5F4', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentTrack?.image || heroImage} alt={`Journal ${id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '200', color: '#D4AF37', fontFamily: 'serif' }}>{id}</div>
                    </div>
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 8px', color: '#1C1917' }}>{englishSummary.title}</h1>
                <p style={{ fontSize: '14px', color: '#78716C', margin: 0 }}>Journal #{id} - {total} tracks</p>
            </div>
            <div style={{ padding: '0 24px 24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Now Playing with Save */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #E7E5E4' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '11px', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{currentTrack?.title}</div>
                            <div style={{ fontSize: '15px', color: '#1C1917', lineHeight: '1.6', minHeight: '48px' }}>{currentTrack?.content}</div>
                        </div>
                        {currentTrack && (
                            <button
                                onClick={(e) => toggleSavePhrase(currentTrack.content, e)}
                                style={{
                                    background: currentIsSaved ? 'rgba(212, 175, 55, 0.1)' : 'none',
                                    border: currentIsSaved ? '1px solid #D4AF37' : '1px solid #D6D3D1',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    fontSize: '18px',
                                    color: currentIsSaved ? '#D4AF37' : '#A8A29E',
                                    flexShrink: 0,
                                    transition: 'all 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                                title={currentIsSaved ? 'Remove from saved' : 'Save phrase'}
                            >
                                {currentIsSaved ? '★' : '☆'}
                                <span style={{ fontSize: '11px', fontWeight: '600' }}>{currentIsSaved ? 'Saved' : 'Save'}</span>
                            </button>
                        )}
                    </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ height: '4px', backgroundColor: '#E7E5E4', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#D4AF37', transition: 'width 0.05s linear' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#78716C' }}>
                        <span>{currentIndex + 1} / {total}</span>
                        <span>{speed.toFixed(2)}x</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                    <button onClick={toggleShuffle} style={{ background: 'none', border: 'none', color: isShuffle ? '#D4AF37' : '#A8A29E', cursor: 'pointer', padding: '8px' }} title="Shuffle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
                    </button>
                    <button onClick={playPrev} style={{ background: 'none', border: 'none', color: '#44403C', cursor: 'pointer', padding: '8px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                    </button>
                    <button onClick={togglePlay} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D4AF37', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isPlaying ? <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: '3px' }}><path d="M8 5v14l11-7z" /></svg>}
                    </button>
                    <button onClick={playNext} style={{ background: 'none', border: 'none', color: '#44403C', cursor: 'pointer', padding: '8px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                    </button>
                    <button onClick={toggleRepeat} style={{ background: 'none', border: 'none', color: repeatMode > 0 ? '#D4AF37' : '#A8A29E', cursor: 'pointer', padding: '8px', position: 'relative' }} title={repeatMode === 0 ? 'Repeat Off' : repeatMode === 1 ? 'Repeat All' : 'Repeat One'}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
                        {repeatMode === 2 && <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>1</span>}
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', color: '#78716C', minWidth: '32px' }}>0.5x</span>
                    <input type="range" min="0.5" max="1.5" step="0.05" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} style={{ width: '150px', accentColor: '#D4AF37' }} />
                    <span style={{ fontSize: '12px', color: '#78716C', minWidth: '32px' }}>1.5x</span>
                    <span style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '600', minWidth: '45px', textAlign: 'center' }}>{speed.toFixed(2)}x</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#78716C' }}>Voice:</span>
                    <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} style={{ backgroundColor: '#fff', color: '#1C1917', border: '1px solid #E7E5E4', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', minWidth: '200px' }}>
                        {voices.map((v) => (
                            <option key={v.name} value={v.name}>{v.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#78716C', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Tracks</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {allTracks.map((track, i) => {
                        const isActive = i === currentIndex;
                        return (
                            <div key={i} onClick={() => selectTrack(i)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: isActive ? '#F5F5F0' : 'transparent', borderRadius: '8px', cursor: 'pointer' }}>
                                {track.image ? (
                                    <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={track.image} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ) : (
                                    <div style={{ width: '24px', textAlign: 'center', fontSize: '13px', color: isActive ? '#D4AF37' : '#A8A29E' }}>{isActive && isPlaying ? <span style={{ color: '#D4AF37' }}>&#9835;</span> : i + 1}</div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', color: isActive ? '#D4AF37' : '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.content.slice(0, 60)}{track.content.length > 60 ? '...' : ''}</div>
                                    <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>{track.title}</div>
                                </div>
                                <button
                                    onClick={(e) => toggleSavePhrase(track.content, e)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        fontSize: '16px',
                                        color: savedPhrases.has(track.content) ? '#D4AF37' : '#D6D3D1',
                                        flexShrink: 0,
                                    }}
                                    title={savedPhrases.has(track.content) ? 'Remove from saved' : 'Save phrase'}
                                >
                                    {savedPhrases.has(track.content) ? '★' : '☆'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ height: '100px' }} />
        </div>
    );
}
