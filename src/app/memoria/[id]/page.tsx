'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MemoriaStorage } from '@/lib/memoria-storage';
import { MemoriaEntry } from '@/types/memoria';
import { journalEntries } from '@/data/journal';
import { labEntries } from '@/data/lab';
import { collegePartyRecapEntries } from '@/data/english/college-party-recap';
import { monsterUnderBedEntries } from '@/data/english/monster-under-bed';
import { marinersTradeEntries } from '@/data/english/mariners-trade-talk';
import { skeletonTalkEntries } from '@/data/english/skeleton-talk';
import { movieNightEntries } from '@/data/english/movie-night';
import { SavedPhrasesStorage } from '@/lib/saved-phrases';

type ThemeMode = 'dark' | 'light';
type LineMode = 'sequential' | 'shuffle' | 'repeat-one';
type ArticleMode = 'manual' | 'auto' | 'shuffle';

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

// Extract character name from "Name: dialogue" format (College Party entries)
const extractSpeaker = (text: string): { name: string | null; dialogue: string; ttsText: string } => {
    const match = text.match(/^([A-Z][a-zA-Z ]{0,20}):\s(.+)$/s);
    if (match) {
        const dialogue = match[2];
        // Strip leading stage directions like "(texting)" or "(group text)" for TTS only
        const ttsText = dialogue.replace(/^\([^)]+\)\s*/, '');
        return { name: match[1].trim(), dialogue, ttsText };
    }
    return { name: null, dialogue: text, ttsText: text };
};

const CHARACTER_COLORS: Record<string, string> = {
    // College Party
    'Tyler': '#6366F1',
    'Brandon': '#F59E0B',
    'Alyssa': '#EC4899',
    'Derek': '#10B981',
    'Megan': '#8B5CF6',
    'Professor Hayes': '#78716C',
    'Zoe': '#F97316',
    'Jake': '#EF4444',
    'Kenji': '#06B6D4',
    'Rosa': '#14B8A6',
    // Monster Under the Bed
    'Timmy': '#60A5FA',
    'Sarah': '#F472B6',
    'Greg': '#6366F1',
    'Emma': '#A78BFA',
    'Grandpa Frank': '#D97706',
    'Noah': '#34D399',
    'Kayla': '#FB923C',
    'Danny': '#EF4444',
    'Uncle Danny': '#EF4444',
    // Mariners Trade Talk
    'Marcus': '#DC2626',
    'Kai': '#0284C7',
    // Skeleton Talk
    'Tai': '#D97706',
    'Aoki': '#4F46E5',
    // Movie Night (Marcus usher uses different color from Mariners Marcus)
    'Jayden': '#2563EB',
    'Maddie': '#EC4899',
    'Tyler C': '#F59E0B',
    'Ava': '#8B5CF6',
    'Benji': '#EF4444',
    'Mrs Chen': '#78716C',
    'Old Man Gus': '#92400E',
};

export default function MemoriaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Entry state
    const [entry, setEntry] = useState<MemoriaEntry | null>(null);
    const [allEntries, setAllEntries] = useState<MemoriaEntry[]>([]);
    const [currentEntryIndex, setCurrentEntryIndex] = useState(-1);

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(0.9);
    const [playedCount, setPlayedCount] = useState(0); // Track lines played in shuffle mode

    // Mode state
    const [lineMode, setLineMode] = useState<LineMode>('sequential');
    const [articleMode, setArticleMode] = useState<ArticleMode>('manual');

    // UI state
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [maleVoice, setMaleVoice] = useState<string>('');
    const [femaleVoice, setFemaleVoice] = useState<string>('');

    // Phrase saving
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveExample, setSaveExample] = useState<string>('');
    const [saveWord, setSaveWord] = useState('');
    const [saveMeaning, setSaveMeaning] = useState('');
    const [saveType, setSaveType] = useState('word');
    const [isSavingPhrase, setIsSavingPhrase] = useState(false);

    // Refs for callbacks
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lineModeRef = useRef<LineMode>('sequential');
    const articleModeRef = useRef<ArticleMode>('manual');
    const allEntriesRef = useRef<MemoriaEntry[]>([]);
    const currentEntryIndexRef = useRef(-1);
    const entryRef = useRef<MemoriaEntry | null>(null);
    const playedCountRef = useRef(0);

    const t = themes[theme];

    // Keep refs in sync
    useEffect(() => {
        lineModeRef.current = lineMode;
    }, [lineMode]);

    useEffect(() => {
        articleModeRef.current = articleMode;
    }, [articleMode]);

    useEffect(() => {
        allEntriesRef.current = allEntries;
    }, [allEntries]);

    useEffect(() => {
        currentEntryIndexRef.current = currentEntryIndex;
    }, [currentEntryIndex]);

    useEffect(() => {
        entryRef.current = entry;
    }, [entry]);

    useEffect(() => {
        playedCountRef.current = playedCount;
    }, [playedCount]);

    // Load settings from localStorage
    useEffect(() => {
        const savedLineMode = localStorage.getItem('player_lineMode') as LineMode | null;
        const savedArticleMode = localStorage.getItem('player_articleMode') as ArticleMode | null;
        const savedSpeed = localStorage.getItem('player_speed');
        const savedTheme = localStorage.getItem('english_theme') as ThemeMode | null;

        if (savedLineMode && ['sequential', 'shuffle', 'repeat-one'].includes(savedLineMode)) {
            setLineMode(savedLineMode);
            lineModeRef.current = savedLineMode;
        }
        if (savedArticleMode && ['manual', 'auto', 'shuffle'].includes(savedArticleMode)) {
            setArticleMode(savedArticleMode);
            articleModeRef.current = savedArticleMode;
        }
        if (savedSpeed) setSpeed(parseFloat(savedSpeed));
        if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);

        setSettingsLoaded(true);
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('player_lineMode', lineMode);
    }, [lineMode, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('player_articleMode', articleMode);
    }, [articleMode, settingsLoaded]);

    useEffect(() => {
        if (!settingsLoaded) return;
        localStorage.setItem('player_speed', speed.toString());
    }, [speed, settingsLoaded]);

    // Load all entries
    useEffect(() => {
        const loadAllEntries = async () => {
            const userEntries = await MemoriaStorage.getAll();

            const journalMemoriaEntries: MemoriaEntry[] = (journalEntries as any[])
                .filter(e => e.conversationData)
                .map(e => ({
                    id: `journal-${e.id}`,
                    date: e.date,
                    title: e.title,
                    content: e.summary,
                    conversation: e.conversationData,
                    tone: e.conversationData?.tone,
                    createdAt: e.conversationData?.generatedAt ?? new Date(e.date),
                    updatedAt: e.conversationData?.generatedAt ?? new Date(e.date),
                    tags: [...e.businessTags, ...e.techTags],
                }));

            const labMemoriaEntries: MemoriaEntry[] = (labEntries as any[])
                .filter(e => e.conversationData)
                .map(e => ({
                    id: `lab-${e.id}`,
                    date: e.date,
                    title: e.title,
                    content: e.summary,
                    conversation: e.conversationData,
                    tone: e.conversationData?.tone,
                    createdAt: e.conversationData?.generatedAt ?? new Date(e.date),
                    updatedAt: e.conversationData?.generatedAt ?? new Date(e.date),
                    tags: [...e.businessTags, ...e.techTags],
                }));

            const partyMemoriaEntries: MemoriaEntry[] = collegePartyRecapEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const monsterMemoriaEntries: MemoriaEntry[] = monsterUnderBedEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const marinersMemoriaEntries: MemoriaEntry[] = marinersTradeEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const skeletonMemoriaEntries: MemoriaEntry[] = skeletonTalkEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const movieMemoriaEntries: MemoriaEntry[] = movieNightEntries.map(e => ({
                id: e.id,
                date: e.date,
                title: e.title,
                content: e.content,
                conversation: e.conversation,
                tone: e.tone,
                series: e.series,
                seriesTitle: e.seriesTitle,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                tags: e.tags,
            }));

            const all = [...userEntries, ...journalMemoriaEntries, ...labMemoriaEntries, ...partyMemoriaEntries, ...monsterMemoriaEntries, ...marinersMemoriaEntries, ...skeletonMemoriaEntries, ...movieMemoriaEntries].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setAllEntries(all);
            allEntriesRef.current = all;
        };
        loadAllEntries();
    }, []);

    // Load entry
    useEffect(() => {
        const id = params?.id as string;
        if (!id) return;

        const loadEntry = async () => {
            let loadedEntry: MemoriaEntry | null = null;

            if (id.startsWith('party-')) {
                const partyEntry = collegePartyRecapEntries.find(e => e.id === id);
                if (partyEntry) {
                    loadedEntry = {
                        id,
                        date: partyEntry.date,
                        title: partyEntry.title,
                        content: partyEntry.content,
                        conversation: partyEntry.conversation,
                        tone: partyEntry.tone,
                        series: partyEntry.series,
                        seriesTitle: partyEntry.seriesTitle,
                        createdAt: partyEntry.createdAt,
                        updatedAt: partyEntry.updatedAt,
                        tags: partyEntry.tags,
                    };
                }
            } else if (id.startsWith('monster-')) {
                const monsterEntry = monsterUnderBedEntries.find(e => e.id === id);
                if (monsterEntry) {
                    loadedEntry = {
                        id,
                        date: monsterEntry.date,
                        title: monsterEntry.title,
                        content: monsterEntry.content,
                        conversation: monsterEntry.conversation,
                        tone: monsterEntry.tone,
                        series: monsterEntry.series,
                        seriesTitle: monsterEntry.seriesTitle,
                        createdAt: monsterEntry.createdAt,
                        updatedAt: monsterEntry.updatedAt,
                        tags: monsterEntry.tags,
                    };
                }
            } else if (id.startsWith('mariners-')) {
                const marinersEntry = marinersTradeEntries.find(e => e.id === id);
                if (marinersEntry) {
                    loadedEntry = {
                        id,
                        date: marinersEntry.date,
                        title: marinersEntry.title,
                        content: marinersEntry.content,
                        conversation: marinersEntry.conversation,
                        tone: marinersEntry.tone,
                        series: marinersEntry.series,
                        seriesTitle: marinersEntry.seriesTitle,
                        createdAt: marinersEntry.createdAt,
                        updatedAt: marinersEntry.updatedAt,
                        tags: marinersEntry.tags,
                    };
                }
            } else if (id.startsWith('skeleton-')) {
                const skeletonEntry = skeletonTalkEntries.find(e => e.id === id);
                if (skeletonEntry) {
                    loadedEntry = {
                        id,
                        date: skeletonEntry.date,
                        title: skeletonEntry.title,
                        content: skeletonEntry.content,
                        conversation: skeletonEntry.conversation,
                        tone: skeletonEntry.tone,
                        series: skeletonEntry.series,
                        seriesTitle: skeletonEntry.seriesTitle,
                        createdAt: skeletonEntry.createdAt,
                        updatedAt: skeletonEntry.updatedAt,
                        tags: skeletonEntry.tags,
                    };
                }
            } else if (id.startsWith('movie-')) {
                const movieEntry = movieNightEntries.find(e => e.id === id);
                if (movieEntry) {
                    loadedEntry = {
                        id,
                        date: movieEntry.date,
                        title: movieEntry.title,
                        content: movieEntry.content,
                        conversation: movieEntry.conversation,
                        tone: movieEntry.tone,
                        series: movieEntry.series,
                        seriesTitle: movieEntry.seriesTitle,
                        createdAt: movieEntry.createdAt,
                        updatedAt: movieEntry.updatedAt,
                        tags: movieEntry.tags,
                    };
                }
            } else if (id.startsWith('journal-')) {
                const journalId = id.replace('journal-', '');
                const journalEntry = (journalEntries as any[]).find(e => e.id === journalId);
                if (journalEntry?.conversationData) {
                    loadedEntry = {
                        id,
                        date: journalEntry.date,
                        title: journalEntry.title,
                        content: journalEntry.summary,
                        conversation: journalEntry.conversationData,
                        tone: journalEntry.conversationData.tone,
                        createdAt: journalEntry.conversationData.generatedAt,
                        updatedAt: journalEntry.conversationData.generatedAt,
                        tags: [...journalEntry.businessTags, ...journalEntry.techTags],
                    };
                }
            } else if (id.startsWith('lab-')) {
                const labId = id.replace('lab-', '');
                const labEntry = (labEntries as any[]).find(e => e.id === labId);
                if (labEntry?.conversationData) {
                    loadedEntry = {
                        id,
                        date: labEntry.date,
                        title: labEntry.title,
                        content: labEntry.summary,
                        conversation: labEntry.conversationData,
                        tone: labEntry.conversationData.tone,
                        createdAt: labEntry.conversationData.generatedAt,
                        updatedAt: labEntry.conversationData.generatedAt,
                        tags: [...labEntry.businessTags, ...labEntry.techTags],
                    };
                }
            } else {
                loadedEntry = await MemoriaStorage.getById(id);
            }

            if (!loadedEntry) {
                router.push('/memoria');
                return;
            }

            setEntry(loadedEntry);
            entryRef.current = loadedEntry;
            setCurrentIndex(0);
            setPlayedCount(0);
            playedCountRef.current = 0;
        };

        loadEntry();
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
            stopProgress();
        };
    }, [params, router]);

    // Update entry index
    useEffect(() => {
        if (entry && allEntries.length > 0) {
            const idx = allEntries.findIndex(e => e.id === entry.id);
            setCurrentEntryIndex(idx);
            currentEntryIndexRef.current = idx;
        }
    }, [entry, allEntries]);

    // Auto-play on navigation (supports ?line=X&autoplay=true for deep-linking)
    useEffect(() => {
        const autoplay = searchParams?.get('autoplay');
        const lineParam = searchParams?.get('line');
        const hasConversation = entry?.conversation?.english?.length && entry.conversation.english.length > 0;
        if (entry && hasConversation) {
            const lineIdx = lineParam ? Math.min(Math.max(0, parseInt(lineParam, 10)), entry.conversation!.english.length - 1) : 0;
            if (lineParam) {
                setCurrentIndex(lineIdx);
            }
            if (autoplay === 'true') {
                const timer = setTimeout(() => {
                    playLine(lineIdx);
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [entry, searchParams]);

    // Load saved phrases
    useEffect(() => {
        const saved = SavedPhrasesStorage.getAll();
        setSavedPhrases(new Set(saved.map(p => p.english)));
    }, []);

    const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
        setVoices(enVoices);

        if (!maleVoice && enVoices.length > 0) {
            const defaultMale = enVoices.find(v => v.name.includes('Google US English') || v.name.includes('Male')) || enVoices[0];
            setMaleVoice(defaultMale.name);
        }
        if (!femaleVoice && enVoices.length > 0) {
            const defaultFemale = enVoices.find(v => v.name.includes('Female')) || enVoices[1] || enVoices[0];
            setFemaleVoice(defaultFemale.name);
        }
    };

    const getVoiceByName = (name: string) => {
        const allVoices = window.speechSynthesis.getVoices();
        const selected = allVoices.find(v => v.name === name);
        if (selected) return selected;
        const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
        if (enVoices.length > 0) {
            return enVoices.find(v => v.name.includes('Google US English')) || enVoices[0];
        }
        return allVoices.find(v => v.lang.includes('en')) || null;
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

    // Navigate to next article
    const goToNextEntry = useCallback(() => {
        const entries = allEntriesRef.current;
        const currentIdx = currentEntryIndexRef.current;
        const mode = articleModeRef.current;

        if (entries.length === 0 || mode === 'manual') return;

        window.speechSynthesis.cancel();
        stopProgress();
        setIsPlaying(false);

        let nextIdx: number;
        if (mode === 'shuffle') {
            // Random article (avoid same article)
            do {
                nextIdx = Math.floor(Math.random() * entries.length);
            } while (nextIdx === currentIdx && entries.length > 1);
        } else {
            // Sequential
            nextIdx = currentIdx + 1;
            if (nextIdx >= entries.length) nextIdx = 0;
        }

        const nextEntry = entries[nextIdx];
        if (nextEntry) {
            router.push(`/memoria/${nextEntry.id}?autoplay=true`);
        }
    }, [router]);

    // Get next line index
    const getNextIndex = useCallback((current: number): number => {
        const currentEntry = entryRef.current;
        if (!currentEntry?.conversation) return -1;

        const total = currentEntry.conversation.english.length;
        const mode = lineModeRef.current;
        const played = playedCountRef.current;

        // Repeat one: stay on same line
        if (mode === 'repeat-one') return current;

        // Shuffle: random line, but track plays
        if (mode === 'shuffle') {
            // After playing total lines, consider "done"
            if (played >= total) {
                // Article finished in shuffle mode
                const artMode = articleModeRef.current;
                if (artMode !== 'manual' && allEntriesRef.current.length > 1) {
                    setTimeout(() => goToNextEntry(), 1000);
                }
                return -1;
            }
            // Get random unplayed-like index (just random for simplicity)
            return Math.floor(Math.random() * total);
        }

        // Sequential
        const next = current + 1;
        if (next >= total) {
            // Article finished
            const artMode = articleModeRef.current;
            if (artMode !== 'manual' && allEntriesRef.current.length > 1) {
                setTimeout(() => goToNextEntry(), 1000);
            }
            return -1;
        }
        return next;
    }, [goToNextEntry]);

    // Play a specific line
    const playLine = useCallback((index: number) => {
        const currentEntry = entryRef.current;
        if (!currentEntry?.conversation || index < 0 || index >= currentEntry.conversation.english.length) {
            setIsPlaying(false);
            stopProgress();
            return;
        }

        const line = currentEntry.conversation.english[index];
        const { ttsText } = extractSpeaker(line.text);
        const utterance = new SpeechSynthesisUtterance(ttsText);

        const voiceName = line.speaker === 'male' ? femaleVoice : maleVoice;
        const voice = getVoiceByName(voiceName);
        if (voice) utterance.voice = voice;

        utterance.lang = 'en-US';
        utterance.rate = speed;

        setCurrentIndex(index);
        setIsPlaying(true);
        setPlayedCount(prev => prev + 1);
        playedCountRef.current += 1;
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
                    setPlayedCount(0);
                    playedCountRef.current = 0;
                }
            }, 500);
        };

        utterance.onerror = () => {
            stopProgress();
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [femaleVoice, maleVoice, speed, getNextIndex]);

    const goToPrevEntry = () => {
        if (allEntries.length === 0) return;
        window.speechSynthesis.cancel();
        stopProgress();
        setIsPlaying(false);

        let prevIdx = currentEntryIndex - 1;
        if (prevIdx < 0) prevIdx = allEntries.length - 1;

        const prevEntry = allEntries[prevIdx];
        if (prevEntry) {
            router.push(`/memoria/${prevEntry.id}`);
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            stopProgress();
        } else {
            setPlayedCount(0);
            playedCountRef.current = 0;
            playLine(currentIndex);
        }
    };

    const playNext = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const total = entry?.conversation?.english?.length || 0;
        const next = (currentIndex + 1) % total;
        setPlayedCount(0);
        playedCountRef.current = 0;
        playLine(next);
    };

    const playPrevious = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const total = entry?.conversation?.english?.length || 1;
        const prev = currentIndex <= 0 ? total - 1 : currentIndex - 1;
        setPlayedCount(0);
        playedCountRef.current = 0;
        playLine(prev);
    };

    const cycleLineMode = () => {
        const modes: LineMode[] = ['sequential', 'shuffle', 'repeat-one'];
        const currentIdx = modes.indexOf(lineMode);
        const nextMode = modes[(currentIdx + 1) % modes.length];
        setLineMode(nextMode);
        lineModeRef.current = nextMode;
    };

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
                source: entry ? `Memoria: ${entry.title}` : 'Memoria',
            });
            setSavedPhrases(prev => new Set(prev).add(text));
        }
    };

    const openVocabModal = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSaveExample(text);
        setSaveWord('');
        setSaveMeaning('');
        setSaveType('word');
        setShowSaveModal(true);
    };

    const saveToVocabulary = async () => {
        if (!saveWord.trim() || !saveMeaning.trim()) return;
        setIsSavingPhrase(true);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: saveWord.trim(),
                    type: saveType,
                    meaning: saveMeaning,
                    example: saveExample,
                    source: entry ? `Memoria: ${entry.title}` : 'Memoria',
                }),
            });
            if (res.ok || res.status === 409) {
                setShowSaveModal(false);
            }
        } finally {
            setIsSavingPhrase(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('english_theme', newTheme);
    };

    if (!entry) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>Loading...</div>
            </div>
        );
    }

    const conversation = entry.conversation?.english || [];
    const currentLine = conversation[currentIndex];

    // UI labels
    const lineModeLabels: Record<LineMode, string> = {
        'sequential': 'SEQ',
        'shuffle': 'SHUF',
        'repeat-one': 'RPT1',
    };
    const articleModeLabels: Record<ArticleMode, string> = {
        'manual': 'MANUAL',
        'auto': 'AUTO',
        'shuffle': 'RANDOM',
    };

    return (
        <div style={{
            height: '100%',
            backgroundColor: t.bg,
            color: t.text,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 20px',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <button
                    onClick={() => {
                        window.speechSynthesis.cancel();
                        stopProgress();
                        setIsPlaying(false);
                        router.push('/memoria');
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: t.textMuted,
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>&#8249;</span> Calendar
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {savedPhrases.size > 0 && (
                        <button
                            onClick={() => router.push('/english/saved')}
                            style={{
                                background: 'none',
                                border: `1px solid ${t.accent}`,
                                color: t.accent,
                                cursor: 'pointer',
                                padding: '5px 10px',
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
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none',
                            border: `1px solid ${t.borderLight}`,
                            color: t.textMuted,
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '11px'
                        }}
                    >
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                </div>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                WebkitOverflowScrolling: 'touch'
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Entry Info */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: t.accent, fontWeight: '500', marginBottom: '6px' }}>
                        {new Date(entry.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.3', margin: 0 }}>{entry.title}</h1>
                </div>

                {/* Article Navigation */}
                {allEntries.length > 1 && (
                    <div style={{
                        marginBottom: '24px',
                        padding: '16px',
                        backgroundColor: t.bgSecondary,
                        borderRadius: '12px',
                        border: `1px solid ${t.borderLight}`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Article {currentEntryIndex + 1} / {allEntries.length}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <select
                                    value={articleMode}
                                    onChange={(e) => {
                                        const mode = e.target.value as ArticleMode;
                                        setArticleMode(mode);
                                        articleModeRef.current = mode;
                                    }}
                                    style={{
                                        background: t.bgSecondary,
                                        border: `1px solid ${articleMode !== 'manual' ? t.accent : t.borderLight}`,
                                        color: articleMode !== 'manual' ? t.accent : t.textMuted,
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <option value="manual">MANUAL</option>
                                    <option value="auto">AUTO NEXT</option>
                                    <option value="shuffle">SHUFFLE ARTICLES</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={goToPrevEntry}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: `1px solid ${t.borderLight}`,
                                    color: t.text,
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
                                    border: `1px solid ${t.borderLight}`,
                                    color: t.text,
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

                {/* Original Content */}
                <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: t.bgSecondary, borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: t.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                        日記
                    </div>
                    <div style={{ fontSize: '15px', color: t.text, lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {entry.content}
                    </div>
                </div>

                {/* Conversation Player */}
                {conversation.length > 0 && (
                    <>
                        <h2 style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                            English Conversation
                        </h2>

                        {/* Current Line Display */}
                        <div style={{ backgroundColor: t.bgTertiary, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                            {(() => {
                                const extracted = currentLine ? extractSpeaker(currentLine.text) : null;
                                const speakerName = extracted?.name || (currentLine?.speaker === 'male' ? 'Takumi' : 'Anya');
                                const speakerColor = extracted?.name
                                    ? (CHARACTER_COLORS[extracted.name] || (currentLine?.speaker === 'male' ? '#4A9EFF' : '#FF69B4'))
                                    : (currentLine?.speaker === 'male' ? '#4A9EFF' : '#FF69B4');
                                const displayText = extracted?.dialogue || currentLine?.text || 'Select a line to play';

                                return (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: speakerColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {extracted?.name ? (
                                                    <div style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        backgroundColor: speakerColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '10px',
                                                        fontWeight: '700',
                                                        color: '#fff',
                                                    }}>
                                                        {extracted.name[0]}
                                                    </div>
                                                ) : (
                                                    <img src={currentLine?.speaker === 'male' ? '/icons/takumi.png' : '/icons/anya.png'} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                                                )}
                                                {speakerName}
                                            </div>
                                            {currentLine && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <button
                                                        onClick={(e) => openVocabModal(currentLine.text, e)}
                                                        style={{
                                                            background: 'none',
                                                            border: `1px solid ${t.borderLight}`,
                                                            cursor: 'pointer',
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            fontSize: '11px',
                                                            color: t.accent,
                                                        }}
                                                        title="Save to My Vocabulary"
                                                    >
                                                        +Vocab
                                                    </button>
                                                    <button
                                                        onClick={(e) => toggleSavePhrase(currentLine.text, e)}
                                                        style={{
                                                            background: savedPhrases.has(currentLine.text) ? t.accent : 'none',
                                                            border: `1px solid ${savedPhrases.has(currentLine.text) ? t.accent : t.borderLight}`,
                                                            cursor: 'pointer',
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            fontSize: '14px',
                                                            color: savedPhrases.has(currentLine.text) ? '#000' : t.textMuted,
                                                        }}
                                                        title={savedPhrases.has(currentLine.text) ? 'Remove from saved' : 'Save phrase'}
                                                    >
                                                        {savedPhrases.has(currentLine.text) ? '★' : '☆'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '15px', color: t.text, lineHeight: '1.6', minHeight: '48px' }}>
                                            {displayText}
                                        </div>
                                    </>
                                );
                            })()}
                            {entry.conversation?.japanese?.[currentIndex] && (
                                <div style={{
                                    fontSize: '14px',
                                    color: t.textMuted,
                                    lineHeight: '1.6',
                                    marginTop: '12px',
                                    paddingTop: '12px',
                                    borderTop: `1px solid ${t.borderLight}`
                                }}>
                                    {entry.conversation.japanese[currentIndex].text}
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ height: '4px', backgroundColor: t.borderLight, borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${progress}%`, backgroundColor: t.accent, transition: 'width 0.05s linear' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: t.textMuted }}>
                                <span>{currentIndex + 1} / {conversation.length}</span>
                                <span>{speed.toFixed(2)}x</span>
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                            {/* Shuffle Button */}
                            <button
                                onClick={cycleLineMode}
                                style={{ background: 'none', border: 'none', color: lineMode === 'shuffle' ? t.accent : t.textMuted, cursor: 'pointer', padding: '8px' }}
                                title={lineMode === 'sequential' ? 'Sequential' : lineMode === 'shuffle' ? 'Shuffle' : 'Repeat One'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                                </svg>
                            </button>

                            <button onClick={playPrevious} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                </svg>
                            </button>

                            <button
                                onClick={togglePlay}
                                style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: t.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {isPlaying ? (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#000">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#000" style={{ marginLeft: '3px' }}>
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>

                            <button onClick={playNext} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', padding: '8px' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                </svg>
                            </button>

                            {/* Repeat Button */}
                            <button
                                onClick={cycleLineMode}
                                style={{ background: 'none', border: 'none', color: lineMode === 'repeat-one' ? t.accent : t.textMuted, cursor: 'pointer', padding: '8px', position: 'relative' }}
                                title={lineMode === 'repeat-one' ? 'Repeat One' : 'Repeat Off'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                                </svg>
                                {lineMode === 'repeat-one' && <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 'bold', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: t.accent }}>1</span>}
                            </button>
                        </div>

                        {/* Speed Control */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '12px', color: t.textMuted, minWidth: '32px' }}>0.5x</span>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.05"
                                value={speed}
                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                style={{ width: '150px', accentColor: t.accent }}
                            />
                            <span style={{ fontSize: '12px', color: t.textMuted, minWidth: '32px' }}>1.5x</span>
                            <span style={{ fontSize: '14px', color: t.accent, fontWeight: '600', minWidth: '45px', textAlign: 'center' }}>{speed.toFixed(2)}x</span>
                        </div>

                        {/* Voice Selectors */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#FF69B4' }}>Female:</span>
                                <select
                                    value={maleVoice}
                                    onChange={(e) => setMaleVoice(e.target.value)}
                                    style={{
                                        backgroundColor: t.bgSecondary,
                                        color: t.text,
                                        border: `1px solid ${t.borderLight}`,
                                        borderRadius: '8px',
                                        padding: '6px 10px',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        minWidth: '140px'
                                    }}
                                >
                                    {voices.map((v) => (
                                        <option key={v.name} value={v.name}>{v.name.replace('Microsoft ', '').replace(' Online (Natural)', '')}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#4A9EFF' }}>Male:</span>
                                <select
                                    value={femaleVoice}
                                    onChange={(e) => setFemaleVoice(e.target.value)}
                                    style={{
                                        backgroundColor: t.bgSecondary,
                                        color: t.text,
                                        border: `1px solid ${t.borderLight}`,
                                        borderRadius: '8px',
                                        padding: '6px 10px',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        minWidth: '140px'
                                    }}
                                >
                                    {voices.map((v) => (
                                        <option key={v.name} value={v.name}>{v.name.replace('Microsoft ', '').replace(' Online (Natural)', '')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Conversation Lines List */}
                        <h3 style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                            Lines ({conversation.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {conversation.map((line, i) => {
                                const isActive = i === currentIndex;
                                const extracted = extractSpeaker(line.text);
                                const speakerName = extracted.name || (line.speaker === 'male' ? 'Takumi' : 'Anya');
                                const speakerColor = extracted.name
                                    ? (CHARACTER_COLORS[extracted.name] || (line.speaker === 'male' ? '#4A9EFF' : '#FF69B4'))
                                    : (line.speaker === 'male' ? '#4A9EFF' : '#FF69B4');

                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            window.speechSynthesis.cancel();
                                            stopProgress();
                                            setPlayedCount(0);
                                            playedCountRef.current = 0;
                                            playLine(i);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            padding: '12px 16px',
                                            backgroundColor: isActive ? t.bgSecondary : 'transparent',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ width: '24px', textAlign: 'center', fontSize: '13px', color: isActive ? t.accent : t.textMuted }}>
                                            {isActive && isPlaying ? '♫' : i + 1}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: speakerColor, marginBottom: '4px', textTransform: 'uppercase' }}>
                                                {extracted.name ? (
                                                    <div style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        backgroundColor: speakerColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '8px',
                                                        fontWeight: '700',
                                                        color: '#fff',
                                                        flexShrink: 0,
                                                    }}>
                                                        {extracted.name[0]}
                                                    </div>
                                                ) : (
                                                    <img src={line.speaker === 'male' ? '/icons/takumi.png' : '/icons/anya.png'} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                                                )}
                                                {speakerName}
                                            </div>
                                            <div style={{ fontSize: '14px', color: isActive ? t.accent : t.text, lineHeight: '1.5' }}>
                                                {extracted.dialogue}
                                            </div>
                                            {entry.conversation?.japanese?.[i] && (
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: t.textMuted,
                                                    lineHeight: '1.5',
                                                    marginTop: '4px',
                                                    paddingLeft: '8px',
                                                    borderLeft: `2px solid ${t.borderLight}`
                                                }}>
                                                    {entry.conversation.japanese[i].text}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => openVocabModal(line.text, e)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '8px',
                                                fontSize: '11px',
                                                color: t.accent,
                                            }}
                                            title="Save to My Vocabulary"
                                        >
                                            +Vocab
                                        </button>
                                        <button
                                            onClick={(e) => toggleSavePhrase(line.text, e)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '8px',
                                                fontSize: '18px',
                                                color: savedPhrases.has(line.text) ? '#FFD700' : t.textMuted,
                                            }}
                                            title={savedPhrases.has(line.text) ? 'Remove from saved' : 'Save phrase'}
                                        >
                                            {savedPhrases.has(line.text) ? '★' : '☆'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Vocabulary Picks - Pre-extracted vocabulary */}
                        {entry.conversation?.vocabulary && entry.conversation.vocabulary.length > 0 && (
                            <>
                                <h3 style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: t.accent,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginTop: '32px',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    Vocabulary Picks ({entry.conversation.vocabulary.length})
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {entry.conversation.vocabulary.map((vocab, i) => {
                                        const levelColors: Record<string, string> = {
                                            'A1': '#22c55e', 'A2': '#84cc16',
                                            'B1': '#eab308', 'B2': '#f97316',
                                            'C1': '#ef4444', 'C2': '#dc2626'
                                        };
                                        const typeColors: Record<string, string> = {
                                            'word': t.textMuted,
                                            'phrasal verb': '#8b5cf6',
                                            'idiom': '#ec4899',
                                            'slang': '#f97316',
                                            'collocation': '#06b6d4',
                                            'expression': '#10b981'
                                        };

                                        return (
                                            <div
                                                key={i}
                                                onClick={async () => {
                                                    // Quick save with pre-filled data
                                                    try {
                                                        const res = await fetch('/api/user-phrases', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                phrase: vocab.word,
                                                                type: vocab.type,
                                                                meaning: vocab.meaning,
                                                                example: vocab.example || '',
                                                                source: entry ? `Memoria: ${entry.title}` : 'Memoria',
                                                            }),
                                                        });
                                                        if (res.ok) {
                                                            // Visual feedback - could add toast
                                                            const el = document.getElementById(`vocab-${i}`);
                                                            if (el) {
                                                                el.style.backgroundColor = t.accent;
                                                                el.style.color = '#000';
                                                                setTimeout(() => {
                                                                    el.style.backgroundColor = t.bgSecondary;
                                                                    el.style.color = t.text;
                                                                }, 500);
                                                            }
                                                        }
                                                    } catch (e) {
                                                        console.error('Failed to save vocab:', e);
                                                    }
                                                }}
                                                id={`vocab-${i}`}
                                                style={{
                                                    padding: '14px 16px',
                                                    backgroundColor: t.bgSecondary,
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    border: `1px solid ${t.borderLight}`,
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '16px', fontWeight: '600', color: t.text }}>
                                                            {vocab.word}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '10px',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            backgroundColor: typeColors[vocab.type] || t.textMuted,
                                                            color: '#fff',
                                                            fontWeight: '500'
                                                        }}>
                                                            {vocab.type}
                                                        </span>
                                                        {vocab.level && (
                                                            <span style={{
                                                                fontSize: '10px',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                backgroundColor: levelColors[vocab.level] || t.textMuted,
                                                                color: '#fff',
                                                                fontWeight: '600'
                                                            }}>
                                                                {vocab.level}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '11px', color: t.accent }}>TAP TO SAVE</span>
                                                </div>
                                                <div style={{ fontSize: '14px', color: t.textSecondary, marginBottom: '4px' }}>
                                                    {vocab.meaning}
                                                </div>
                                                {vocab.example && (
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: t.textMuted,
                                                        fontStyle: 'italic',
                                                        borderLeft: `2px solid ${t.accent}`,
                                                        paddingLeft: '8px',
                                                        marginTop: '8px'
                                                    }}>
                                                        "{vocab.example}"
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* No Conversation Yet */}
                {conversation.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: t.text }}>
                            会話を生成中...
                        </h2>
                        <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: '1.6' }}>
                            AIが英語会話を生成しています。<br />
                            しばらくお待ちください。
                        </p>
                    </div>
                )}
                </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px',
                    }}
                    onClick={() => setShowSaveModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: t.bgSecondary,
                            borderRadius: '16px',
                            padding: '24px',
                            width: '100%',
                            maxWidth: '450px',
                            border: `1px solid ${t.borderLight}`,
                        }}
                    >
                        <div style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                            Save to My Vocabulary
                        </div>

                        <div style={{
                            fontSize: '13px',
                            color: t.textSecondary,
                            marginBottom: '20px',
                            padding: '12px',
                            backgroundColor: t.bg,
                            borderRadius: '8px',
                            lineHeight: '1.5',
                            borderLeft: `3px solid ${t.accent}`,
                        }}>
                            {saveExample}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>
                                Word / Phrase to save *
                            </label>
                            <input
                                type="text"
                                value={saveWord}
                                onChange={(e) => setSaveWord(e.target.value)}
                                placeholder="e.g. rabbit hole"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: t.bg,
                                    color: t.text,
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>
                                Type
                            </label>
                            <select
                                value={saveType}
                                onChange={(e) => setSaveType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: t.bg,
                                    color: t.text,
                                    fontSize: '14px',
                                }}
                            >
                                <option value="word">word</option>
                                <option value="phrasal verb">phrasal verb</option>
                                <option value="idiom">idiom</option>
                                <option value="slang">slang</option>
                                <option value="collocation">collocation</option>
                                <option value="expression">expression</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>
                                Meaning (Japanese) *
                            </label>
                            <input
                                type="text"
                                value={saveMeaning}
                                onChange={(e) => setSaveMeaning(e.target.value)}
                                placeholder="意味を入力..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: t.bg,
                                    color: t.text,
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${t.borderLight}`,
                                    backgroundColor: 'transparent',
                                    color: t.textMuted,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveToVocabulary}
                                disabled={isSavingPhrase || !saveWord.trim() || !saveMeaning.trim()}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: (saveWord.trim() && saveMeaning.trim()) ? '#10B981' : t.borderLight,
                                    color: (saveWord.trim() && saveMeaning.trim()) ? '#fff' : t.textMuted,
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: (saveWord.trim() && saveMeaning.trim() && !isSavingPhrase) ? 'pointer' : 'default',
                                }}
                            >
                                {isSavingPhrase ? '...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
