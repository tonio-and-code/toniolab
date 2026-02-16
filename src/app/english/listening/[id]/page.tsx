"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, List, Volume2, Star, Video, Headphones, ExternalLink, Maximize2, Minimize2, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { listeningContents } from "@/data/english-listening";
import { SavedPhrasesStorage } from "@/lib/saved-phrases";

// YouTube IFrame API types
declare global {
    interface Window {
        YT: {
            Player: new (elementId: string, config: YouTubePlayerConfig) => YouTubePlayer;
            PlayerState: {
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

interface YouTubePlayerConfig {
    height?: string;
    width?: string;
    videoId: string;
    playerVars?: {
        autoplay?: number;
        controls?: number;
        rel?: number;
        modestbranding?: number;
        start?: number;
    };
    events?: {
        onReady?: (event: { target: YouTubePlayer }) => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: (event: { data: number }) => void;
    };
}

interface YouTubePlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    stopVideo: () => void;
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    getPlayerState: () => number;
    setVolume: (volume: number) => void;
    destroy: () => void;
}

export default function ListeningPlayerPage() {
    const params = useParams();
    const router = useRouter();
    const contentId = params.id as string;

    const content = listeningContents.find((c) => c.id === contentId);

    // Mode: 'video' = YouTube sync, 'tts' = TTS player, 'lesson' = JP audio then EN TTS, 'dual' = JP + EN simultaneous
    const [mode, setMode] = useState<'video' | 'tts' | 'lesson' | 'dual'>('video');

    // Common state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showJapanese, setShowJapanese] = useState(true);
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());

    // Video mode state
    const [ytReady, setYtReady] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // TTS mode state
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1.0);
    const [repeatMode, setRepeatMode] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [englishVoice, setEnglishVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [showTranscript, setShowTranscript] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);

    // Video mode: sub-mode for English Voice overlay
    const [englishVoiceMode, setEnglishVoiceMode] = useState(false);
    const [isTTSPlaying, setIsTTSPlaying] = useState(false);
    const isTTSPlayingRef = useRef(false);
    const [showSubtitles, setShowSubtitles] = useState(true);
    const [subtitleSize, setSubtitleSize] = useState<'sm' | 'md' | 'lg'>('md');
    const [subtitleStyle, setSubtitleStyle] = useState<'dark' | 'light' | 'yellow'>('dark');
    const [showSubtitleSettings, setShowSubtitleSettings] = useState(false);

    // Lesson mode state
    const [lessonPlaying, setLessonPlaying] = useState(false);
    const [lessonPhase, setLessonPhase] = useState<'idle' | 'japanese' | 'english'>('idle');
    const [lessonReady, setLessonReady] = useState(false);
    const lessonPlayerRef = useRef<YouTubePlayer | null>(null);
    const lessonIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lessonPlayingRef = useRef(false);

    // Dual mode state (JP audio + EN TTS simultaneous)
    const [dualPlaying, setDualPlaying] = useState(false);
    const [dualReady, setDualReady] = useState(false);
    const dualPlayerRef = useRef<YouTubePlayer | null>(null);
    const dualIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const dualPlayingRef = useRef(false);
    const [jpVolume, setJpVolume] = useState(50);
    const [enVolume, setEnVolume] = useState(100);

    // Vocabulary modal state
    const [showVocabModal, setShowVocabModal] = useState(false);
    const [vocabExample, setVocabExample] = useState('');
    const [vocabWord, setVocabWord] = useState('');
    const [vocabMeaning, setVocabMeaning] = useState('');
    const [vocabType, setVocabType] = useState('word');
    const [vocabSaving, setVocabSaving] = useState(false);

    // Refs
    const listRef = useRef<HTMLDivElement>(null);
    const ytPlayerRef = useRef<YouTubePlayer | null>(null);
    const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const repeatModeRef = useRef(0);
    const isShuffleRef = useRef(false);
    const speedRef = useRef(1.0);

    const currentSegment = content?.segments[currentIndex];

    // ==================== COMMON FUNCTIONS ====================

    // Load saved phrases
    useEffect(() => {
        const all = SavedPhrasesStorage.getAll();
        setSavedPhrases(new Set(all.map(p => p.english)));
    }, []);

    // Auto-scroll to current segment
    useEffect(() => {
        if (listRef.current) {
            const activeItem = listRef.current.querySelector(`[data-index="${currentIndex}"]`);
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentIndex]);

    const toggleSavePhrase = (e: React.MouseEvent, english: string, japanese: string) => {
        e.stopPropagation();
        if (savedPhrases.has(english)) {
            const all = SavedPhrasesStorage.getAll();
            const found = all.find(p => p.english === english);
            if (found) SavedPhrasesStorage.remove(found.id);
            setSavedPhrases(prev => {
                const next = new Set(prev);
                next.delete(english);
                return next;
            });
        } else {
            SavedPhrasesStorage.save({
                english,
                japanese,
                source: `YouTube: ${content?.title || 'Listening'}`,
            });
            setSavedPhrases(prev => new Set(prev).add(english));
        }
    };

    const openVocabModal = (e: React.MouseEvent, english: string) => {
        e.stopPropagation();
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
                    source: `Listening: ${content?.title || 'YouTube'}`,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowVocabModal(false);
                setVocabWord('');
                setVocabMeaning('');
                setVocabExample('');
            }
        } catch (err) {
            console.error('Failed to save vocabulary:', err);
        } finally {
            setVocabSaving(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // ==================== VIDEO MODE FUNCTIONS ====================

    const findCurrentSegment = useCallback((currentTime: number) => {
        if (!content) return 0;
        for (let i = content.segments.length - 1; i >= 0; i--) {
            if (currentTime >= content.segments[i].startTime) {
                return i;
            }
        }
        return 0;
    }, [content]);

    // Load YouTube IFrame API
    useEffect(() => {
        if (!content?.youtubeId || mode !== 'video') return;

        const initYouTubePlayer = () => {
            if (ytPlayerRef.current) return;

            const playerContainer = document.getElementById('youtube-player');
            if (!playerContainer) {
                setTimeout(initYouTubePlayer, 100);
                return;
            }

            try {
                ytPlayerRef.current = new window.YT.Player('youtube-player', {
                    height: '100%',
                    width: '100%',
                    videoId: content.youtubeId,
                    playerVars: {
                        autoplay: 0,
                        controls: 1,
                        rel: 0,
                        modestbranding: 1,
                    },
                    events: {
                        onReady: () => {
                            setYtReady(true);
                        },
                        onStateChange: (event) => {
                            if (event.data === 1) {
                                setVideoPlaying(true);
                                if (timeUpdateIntervalRef.current) {
                                    clearInterval(timeUpdateIntervalRef.current);
                                }
                                timeUpdateIntervalRef.current = setInterval(() => {
                                    if (ytPlayerRef.current) {
                                        const currentTime = ytPlayerRef.current.getCurrentTime();
                                        const newIndex = findCurrentSegment(currentTime);
                                        setCurrentIndex(newIndex);
                                    }
                                }, 200);
                            } else {
                                setVideoPlaying(false);
                                if (timeUpdateIntervalRef.current) {
                                    clearInterval(timeUpdateIntervalRef.current);
                                    timeUpdateIntervalRef.current = null;
                                }
                            }
                        },
                    },
                });
            } catch (err) {
                console.error('Failed to init YouTube player:', err);
            }
        };

        const loadYouTubeAPI = () => {
            if (window.YT && window.YT.Player) {
                initYouTubePlayer();
                return;
            }

            if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                window.onYouTubeIframeAPIReady = initYouTubePlayer;
                return;
            }

            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initYouTubePlayer;
        };

        setTimeout(loadYouTubeAPI, 100);

        return () => {
            if (timeUpdateIntervalRef.current) {
                clearInterval(timeUpdateIntervalRef.current);
            }
        };
    }, [content?.youtubeId, findCurrentSegment, mode]);

    const seekToSegment = (index: number) => {
        if (ytPlayerRef.current && content) {
            const segment = content.segments[index];
            ytPlayerRef.current.seekTo(segment.startTime, true);
            setCurrentIndex(index);
        }
    };

    // Handle ESC key to exit fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    // ==================== ENGLISH VOICE MODE (in Video mode) ====================
    const speakSegmentSequential = useRef((index: number) => {});

    speakSegmentSequential.current = (index: number) => {
        if (!content || index >= content.segments.length || !isTTSPlayingRef.current) {
            setIsTTSPlaying(false);
            isTTSPlayingRef.current = false;
            return;
        }

        const segment = content.segments[index];
        setCurrentIndex(index);

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(segment.english);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        utterance.onend = () => {
            if (isTTSPlayingRef.current) {
                setTimeout(() => speakSegmentSequential.current(index + 1), 400);
            }
        };

        utterance.onerror = () => {
            setIsTTSPlaying(false);
            isTTSPlayingRef.current = false;
        };

        window.speechSynthesis.speak(utterance);
    };

    const toggleEnglishVoice = () => {
        if (isTTSPlaying) {
            setIsTTSPlaying(false);
            isTTSPlayingRef.current = false;
            window.speechSynthesis.cancel();
        } else {
            // Pause video if playing
            if (ytPlayerRef.current) {
                ytPlayerRef.current.pauseVideo();
            }
            setIsTTSPlaying(true);
            isTTSPlayingRef.current = true;
            speakSegmentSequential.current(currentIndex);
        }
    };

    const speakSingleSegment = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    // ==================== LESSON MODE FUNCTIONS ====================
    // Plays: YouTube audio (Japanese) for segment → English TTS → next segment

    const playLessonSegmentInternal = useRef((index: number) => {});

    playLessonSegmentInternal.current = (index: number) => {
        if (!content || index >= content.segments.length || !lessonPlayingRef.current) {
            stopLesson();
            return;
        }

        if (!lessonPlayerRef.current) {
            console.log('Lesson player not ready');
            return;
        }

        const segment = content.segments[index];
        const nextSegment = content.segments[index + 1];
        const endTime = nextSegment ? nextSegment.startTime : segment.startTime + 10;

        setCurrentIndex(index);
        setLessonPhase('japanese');

        // Play YouTube audio for this segment
        console.log('Playing Japanese segment:', index, 'from', segment.startTime, 'to', endTime);
        lessonPlayerRef.current.seekTo(segment.startTime, true);
        lessonPlayerRef.current.playVideo();

        // Monitor when segment ends
        if (lessonIntervalRef.current) clearInterval(lessonIntervalRef.current);
        lessonIntervalRef.current = setInterval(() => {
            if (lessonPlayerRef.current && lessonPlayingRef.current) {
                const currentTime = lessonPlayerRef.current.getCurrentTime();
                if (currentTime >= endTime - 0.3) {
                    lessonPlayerRef.current.pauseVideo();
                    if (lessonIntervalRef.current) clearInterval(lessonIntervalRef.current);
                    // Now play English TTS
                    playEnglishTTSForLessonInternal.current(index);
                }
            }
        }, 100);
    };

    const playEnglishTTSForLessonInternal = useRef((index: number) => {});

    playEnglishTTSForLessonInternal.current = (index: number) => {
        if (!content || !lessonPlayingRef.current) return;

        const segment = content.segments[index];
        setLessonPhase('english');

        console.log('Playing English TTS for segment:', index);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(segment.english);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        utterance.onend = () => {
            if (lessonPlayingRef.current && index + 1 < content.segments.length) {
                setTimeout(() => playLessonSegmentInternal.current(index + 1), 500);
            } else {
                stopLesson();
            }
        };

        utterance.onerror = () => {
            stopLesson();
        };

        window.speechSynthesis.speak(utterance);
    };

    const startLesson = () => {
        if (!lessonReady) {
            console.log('Lesson player not ready yet');
            alert('Player is loading, please wait...');
            return;
        }
        console.log('Starting lesson from segment:', currentIndex);
        lessonPlayingRef.current = true;
        setLessonPlaying(true);
        playLessonSegmentInternal.current(currentIndex);
    };

    const stopLesson = () => {
        console.log('Stopping lesson');
        lessonPlayingRef.current = false;
        setLessonPlaying(false);
        setLessonPhase('idle');
        if (lessonIntervalRef.current) {
            clearInterval(lessonIntervalRef.current);
            lessonIntervalRef.current = null;
        }
        if (lessonPlayerRef.current && typeof lessonPlayerRef.current.pauseVideo === 'function') {
            lessonPlayerRef.current.pauseVideo();
        }
        window.speechSynthesis.cancel();
    };

    const toggleLesson = () => {
        if (lessonPlayingRef.current) {
            stopLesson();
        } else {
            startLesson();
        }
    };

    // Initialize lesson player
    useEffect(() => {
        if (!content?.youtubeId || mode !== 'lesson') return;

        const initLessonPlayer = () => {
            if (lessonPlayerRef.current) return;

            const playerContainer = document.getElementById('lesson-player');
            if (!playerContainer) {
                setTimeout(initLessonPlayer, 100);
                return;
            }

            try {
                lessonPlayerRef.current = new window.YT.Player('lesson-player', {
                    height: '1',
                    width: '1',
                    videoId: content.youtubeId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                    },
                    events: {
                        onReady: () => {
                            console.log('Lesson player ready!');
                            setLessonReady(true);
                        },
                        onError: (event) => {
                            console.error('Lesson player error:', event.data);
                        },
                    },
                });
            } catch (err) {
                console.error('Failed to init lesson player:', err);
            }
        };

        const loadYouTubeAPI = () => {
            if (window.YT && window.YT.Player) {
                initLessonPlayer();
                return;
            }

            if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                window.onYouTubeIframeAPIReady = initLessonPlayer;
                return;
            }

            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initLessonPlayer;
        };

        setTimeout(loadYouTubeAPI, 100);

        return () => {
            if (lessonIntervalRef.current) {
                clearInterval(lessonIntervalRef.current);
            }
            // Reset ready state when leaving lesson mode
            setLessonReady(false);
            if (lessonPlayerRef.current) {
                try {
                    lessonPlayerRef.current.destroy();
                } catch (e) {
                    // ignore
                }
                lessonPlayerRef.current = null;
            }
        };
    }, [content?.youtubeId, mode]);

    // ==================== DUAL MODE FUNCTIONS ====================
    // Plays: YouTube audio (Japanese) + English TTS simultaneously

    const playDualSegmentInternal = useRef((index: number) => {});

    playDualSegmentInternal.current = (index: number) => {
        if (!content || index >= content.segments.length || !dualPlayingRef.current) {
            stopDual();
            return;
        }

        if (!dualPlayerRef.current) {
            console.log('Dual player not ready');
            return;
        }

        const segment = content.segments[index];
        const nextSegment = content.segments[index + 1];
        const endTime = nextSegment ? nextSegment.startTime : segment.startTime + 10;

        setCurrentIndex(index);

        // Play YouTube audio for this segment with volume
        console.log('Dual: Playing segment:', index);
        dualPlayerRef.current.setVolume(jpVolume);
        dualPlayerRef.current.seekTo(segment.startTime, true);
        dualPlayerRef.current.playVideo();

        // Play English TTS at the same time with volume
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(segment.english);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.volume = enVolume / 100;
        window.speechSynthesis.speak(utterance);

        // Monitor when segment ends, then move to next
        if (dualIntervalRef.current) clearInterval(dualIntervalRef.current);
        dualIntervalRef.current = setInterval(() => {
            if (dualPlayerRef.current && dualPlayingRef.current) {
                const currentTime = dualPlayerRef.current.getCurrentTime();
                if (currentTime >= endTime - 0.3) {
                    if (dualIntervalRef.current) clearInterval(dualIntervalRef.current);
                    // Move to next segment
                    if (index + 1 < content.segments.length) {
                        setTimeout(() => playDualSegmentInternal.current(index + 1), 300);
                    } else {
                        stopDual();
                    }
                }
            }
        }, 100);
    };

    const startDual = () => {
        if (!dualReady) {
            console.log('Dual player not ready yet');
            alert('Player is loading, please wait...');
            return;
        }
        console.log('Starting dual from segment:', currentIndex);
        dualPlayingRef.current = true;
        setDualPlaying(true);
        playDualSegmentInternal.current(currentIndex);
    };

    const stopDual = () => {
        console.log('Stopping dual');
        dualPlayingRef.current = false;
        setDualPlaying(false);
        if (dualIntervalRef.current) {
            clearInterval(dualIntervalRef.current);
            dualIntervalRef.current = null;
        }
        if (dualPlayerRef.current && typeof dualPlayerRef.current.pauseVideo === 'function') {
            dualPlayerRef.current.pauseVideo();
        }
        window.speechSynthesis.cancel();
    };

    const toggleDual = () => {
        if (dualPlayingRef.current) {
            stopDual();
        } else {
            startDual();
        }
    };

    const handleJpVolumeChange = (vol: number) => {
        setJpVolume(vol);
        if (dualPlayerRef.current && typeof dualPlayerRef.current.setVolume === 'function') {
            dualPlayerRef.current.setVolume(vol);
        }
    };

    const handleEnVolumeChange = (vol: number) => {
        setEnVolume(vol);
        // TTS volume can't be changed mid-utterance, will apply on next segment
    };

    // Initialize dual player
    useEffect(() => {
        if (!content?.youtubeId || mode !== 'dual') return;

        const initDualPlayer = () => {
            if (dualPlayerRef.current) return;

            const playerContainer = document.getElementById('dual-player');
            if (!playerContainer) {
                setTimeout(initDualPlayer, 100);
                return;
            }

            try {
                dualPlayerRef.current = new window.YT.Player('dual-player', {
                    height: '1',
                    width: '1',
                    videoId: content.youtubeId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                    },
                    events: {
                        onReady: () => {
                            console.log('Dual player ready!');
                            setDualReady(true);
                        },
                        onError: (event) => {
                            console.error('Dual player error:', event.data);
                        },
                    },
                });
            } catch (err) {
                console.error('Failed to init dual player:', err);
            }
        };

        const loadYouTubeAPI = () => {
            if (window.YT && window.YT.Player) {
                initDualPlayer();
                return;
            }

            if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                window.onYouTubeIframeAPIReady = initDualPlayer;
                return;
            }

            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initDualPlayer;
        };

        setTimeout(loadYouTubeAPI, 100);

        return () => {
            if (dualIntervalRef.current) {
                clearInterval(dualIntervalRef.current);
            }
            setDualReady(false);
            if (dualPlayerRef.current) {
                try {
                    dualPlayerRef.current.destroy();
                } catch (e) {
                    // ignore
                }
                dualPlayerRef.current = null;
            }
        };
    }, [content?.youtubeId, mode]);

    // ==================== TTS MODE FUNCTIONS ====================

    // Initialize voices
    useEffect(() => {
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const enVoices = allVoices.filter(v => v.lang.startsWith('en'));

            if (enVoices.length > 0) {
                const preferred = enVoices.find(v =>
                    v.name.includes('Google US English') ||
                    v.name.includes('Samantha') ||
                    v.name.includes('Daniel')
                ) || enVoices[0];
                setEnglishVoice(preferred);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
            stopProgress();
        };
    }, []);

    // Update refs when state changes
    useEffect(() => {
        repeatModeRef.current = repeatMode;
        isShuffleRef.current = isShuffle;
        speedRef.current = speed;
    }, [repeatMode, isShuffle, speed]);

    const startProgress = (estimatedDuration: number) => {
        setProgress(0);
        let elapsed = 0;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

        progressIntervalRef.current = setInterval(() => {
            elapsed += 50;
            const p = Math.min((elapsed / estimatedDuration) * 100, 100);
            setProgress(p);
        }, 50);
    };

    const stopProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const playSegment = (index: number) => {
        if (!content || index < 0 || index >= content.segments.length) {
            setIsPlaying(false);
            stopProgress();
            return;
        }

        const segment = content.segments[index];
        const utterance = new SpeechSynthesisUtterance(segment.english);

        if (englishVoice) utterance.voice = englishVoice;
        utterance.lang = 'en-US';
        utterance.rate = speedRef.current;

        const wordsCount = segment.english.split(' ').length;
        const estimatedDuration = (wordsCount / 2.5) * 1000 / speedRef.current;

        setCurrentIndex(index);
        setIsPlaying(true);
        startProgress(estimatedDuration);

        utterance.onend = () => {
            stopProgress();
            setProgress(100);

            setTimeout(() => {
                const nextIndex = getNextIndex(index);
                if (nextIndex >= 0) {
                    playSegment(nextIndex);
                } else {
                    setIsPlaying(false);
                    setProgress(0);
                }
            }, 300);
        };

        utterance.onerror = () => {
            stopProgress();
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const getNextIndex = (current: number): number => {
        if (!content) return -1;
        const total = content.segments.length;

        if (repeatModeRef.current === 2) return current;

        if (isShuffleRef.current) {
            return Math.floor(Math.random() * total);
        }

        const next = current + 1;
        if (next >= total) {
            return repeatModeRef.current === 1 ? 0 : -1;
        }
        return next;
    };

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            stopProgress();
        } else {
            playSegment(currentIndex);
        }
    };

    const playNext = () => {
        window.speechSynthesis.cancel();
        stopProgress();
        const next = getNextIndex(currentIndex);
        playSegment(next >= 0 ? next : 0);
    };

    const playPrevious = () => {
        if (!content) return;
        window.speechSynthesis.cancel();
        stopProgress();
        const prev = currentIndex <= 0 ? content.segments.length - 1 : currentIndex - 1;
        playSegment(prev);
    };

    const toggleRepeat = () => {
        const next = (repeatMode + 1) % 3;
        setRepeatMode(next);
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        setShowSpeedMenu(false);
    };

    // Mode switch handler
    const switchMode = (newMode: 'video' | 'tts' | 'lesson' | 'dual') => {
        // Stop current mode
        if (mode === 'video' && ytPlayerRef.current) {
            ytPlayerRef.current.pauseVideo();
        }
        if (mode === 'tts') {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            stopProgress();
        }
        if (mode === 'lesson') {
            stopLesson();
        }
        if (mode === 'dual') {
            stopDual();
        }
        setMode(newMode);
    };

    if (!content) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-800">
                <div className="text-center px-4">
                    <h1 className="text-xl mb-4">Content not found</h1>
                    <Link href="/english/listening" className="text-amber-600 hover:underline">
                        Back to YouTube English
                    </Link>
                </div>
            </div>
        );
    }

    // ==================== VIDEO FULLSCREEN MODE ====================
    if (isFullscreen && mode === 'video') {
        return (
            <div className="fixed inset-0 z-[9999] bg-stone-900 flex flex-col">
                <header className="flex items-center justify-between px-4 py-2 bg-stone-800 text-white">
                    <h1 className="text-sm font-medium truncate">{content.title}</h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSubtitles(!showSubtitles)}
                            className={`px-3 py-1 rounded text-xs ${showSubtitles ? 'bg-amber-500' : 'bg-stone-600'}`}
                        >
                            CC {showSubtitles ? 'ON' : 'OFF'}
                        </button>
                        <button
                            onClick={() => setShowJapanese(!showJapanese)}
                            className={`px-3 py-1 rounded text-xs ${showJapanese ? 'bg-emerald-600' : 'bg-stone-600'}`}
                        >
                            JP {showJapanese ? 'ON' : 'OFF'}
                        </button>
                        <button onClick={() => setIsFullscreen(false)} className="p-2 hover:bg-stone-700 rounded">
                            <Minimize2 size={18} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    <div className="w-[70%] bg-black flex items-center justify-center p-4">
                        <div className="w-full h-full max-h-[calc(100vh-100px)] aspect-video relative">
                            <div id="youtube-player" className="w-full h-full" />
                            {/* English Subtitle Overlay */}
                            {showSubtitles && currentSegment && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                                    <div className={`text-center py-2 px-4 rounded-lg max-w-[90%] mx-auto ${
                                        subtitleStyle === 'dark' ? 'bg-black/80 text-white' :
                                        subtitleStyle === 'light' ? 'bg-white/90 text-stone-900' :
                                        'bg-yellow-400 text-black'
                                    }`}>
                                        <p className={`leading-relaxed ${
                                            subtitleSize === 'sm' ? 'text-sm' :
                                            subtitleSize === 'lg' ? 'text-xl md:text-2xl' :
                                            'text-base md:text-lg'
                                        }`}>{currentSegment.english}</p>
                                    </div>
                                </div>
                            )}
                            {/* Subtitle Controls */}
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                <button
                                    onClick={() => setShowSubtitleSettings(!showSubtitleSettings)}
                                    className="px-2 py-1 rounded text-xs font-medium bg-black/50 text-white/70 hover:bg-black/70"
                                >
                                    Settings
                                </button>
                                <button
                                    onClick={() => setShowSubtitles(!showSubtitles)}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                        showSubtitles ? 'bg-amber-500 text-white' : 'bg-black/50 text-white/70'
                                    }`}
                                >
                                    CC {showSubtitles ? 'ON' : 'OFF'}
                                </button>
                            </div>
                            {/* Subtitle Settings Panel */}
                            {showSubtitleSettings && (
                                <div className="absolute top-12 right-3 bg-black/90 text-white p-3 rounded-lg text-xs space-y-3 min-w-[150px] z-10">
                                    <div>
                                        <p className="text-white/60 mb-1">Size</p>
                                        <div className="flex gap-1">
                                            {(['sm', 'md', 'lg'] as const).map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSubtitleSize(size)}
                                                    className={`px-2 py-1 rounded ${subtitleSize === size ? 'bg-amber-500' : 'bg-white/20'}`}
                                                >
                                                    {size === 'sm' ? 'S' : size === 'md' ? 'M' : 'L'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white/60 mb-1">Style</p>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => setSubtitleStyle('dark')}
                                                className={`px-2 py-1 rounded bg-black text-white border ${subtitleStyle === 'dark' ? 'border-amber-500' : 'border-white/30'}`}
                                            >
                                                Dark
                                            </button>
                                            <button
                                                onClick={() => setSubtitleStyle('light')}
                                                className={`px-2 py-1 rounded bg-white text-black border ${subtitleStyle === 'light' ? 'border-amber-500' : 'border-white/30'}`}
                                            >
                                                Light
                                            </button>
                                            <button
                                                onClick={() => setSubtitleStyle('yellow')}
                                                className={`px-2 py-1 rounded bg-yellow-400 text-black border ${subtitleStyle === 'yellow' ? 'border-amber-500' : 'border-white/30'}`}
                                            >
                                                Yellow
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowSubtitleSettings(false)}
                                        className="w-full py-1 bg-white/20 rounded hover:bg-white/30"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-[30%] bg-stone-50 flex flex-col overflow-hidden">
                        <div className="px-3 py-2 bg-white border-b border-stone-200">
                            <span className="text-xs font-medium text-stone-600">
                                {videoPlaying && <span className="text-red-500 mr-2">LIVE</span>}
                                {currentIndex + 1} / {content.segments.length}
                            </span>
                        </div>
                        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
                            {content.segments.map((segment, i) => {
                                const isActive = i === currentIndex;
                                return (
                                    <div
                                        key={i}
                                        data-index={i}
                                        onClick={() => seekToSegment(i)}
                                        className={`p-3 rounded-lg cursor-pointer transition-all text-sm ${isActive ? 'bg-amber-100 border border-amber-400' : 'bg-white hover:bg-stone-100 border border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-mono ${isActive ? 'text-amber-600' : 'text-stone-400'}`}>
                                                {formatTime(segment.startTime)}
                                            </span>
                                            <div className="flex-1" />
                                            <button onClick={(e) => openVocabModal(e, segment.english)} className="px-1.5 py-0.5 rounded text-[9px] border border-emerald-500 text-emerald-500 hover:bg-emerald-50">+V</button>
                                            <button onClick={(e) => toggleSavePhrase(e, segment.english, segment.japanese)} className="p-1">
                                                <Star size={12} className={savedPhrases.has(segment.english) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'} />
                                            </button>
                                        </div>
                                        <p className={`text-xs leading-relaxed ${isActive ? 'text-stone-800 font-medium' : 'text-stone-600'}`}>{segment.english}</p>
                                        {showJapanese && <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">{segment.japanese}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== VIDEO MODE ====================
    if (mode === 'video') {
        return (
            <div className="min-h-screen bg-stone-100 text-stone-800">
                <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
                    <div className="flex items-center justify-between px-4 py-2">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-800">
                            <ArrowLeft size={18} />
                            <span className="text-sm">Back</span>
                        </button>

                        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                            <button onClick={() => switchMode('video')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'video' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Video size={14} /> Video
                            </button>
                            <button onClick={() => switchMode('tts')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'tts' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Headphones size={14} /> TTS
                            </button>
                            <button onClick={() => switchMode('lesson')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'lesson' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <BookOpen size={14} /> Lesson
                            </button>
                            <button onClick={() => switchMode('dual')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'dual' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Layers size={14} /> Dual
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {savedPhrases.size > 0 && (
                                <Link href="/english/saved" className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                                    <Star size={10} className="fill-yellow-400" /> {savedPhrases.size}
                                </Link>
                            )}
                            <a href={`https://www.youtube.com/watch?v=${content.youtubeId}`} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-red-600">
                                <ExternalLink size={16} />
                            </a>
                            <button onClick={() => setIsFullscreen(true)} className="p-1.5 text-stone-500 hover:text-stone-800">
                                <Maximize2 size={18} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row h-[calc(100vh-49px)]">
                    <div className="w-full md:w-[70%] h-[40vh] md:h-full bg-stone-900">
                        <div className="w-full h-full relative">
                            <div id="youtube-player" className="w-full h-full" />
                            {!ytReady && <div className="w-full h-full flex items-center justify-center bg-stone-900 text-white text-sm">Loading player...</div>}
                            {/* English Subtitle Overlay */}
                            {showSubtitles && currentSegment && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                                    <div className={`text-center py-2 px-4 rounded-lg max-w-[90%] mx-auto ${
                                        subtitleStyle === 'dark' ? 'bg-black/80 text-white' :
                                        subtitleStyle === 'light' ? 'bg-white/90 text-stone-900' :
                                        'bg-yellow-400 text-black'
                                    }`}>
                                        <p className={`leading-relaxed ${
                                            subtitleSize === 'sm' ? 'text-sm' :
                                            subtitleSize === 'lg' ? 'text-xl md:text-2xl' :
                                            'text-base md:text-lg'
                                        }`}>{currentSegment.english}</p>
                                    </div>
                                </div>
                            )}
                            {/* Subtitle Controls */}
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                <button
                                    onClick={() => setShowSubtitleSettings(!showSubtitleSettings)}
                                    className="px-2 py-1 rounded text-xs font-medium bg-black/50 text-white/70 hover:bg-black/70"
                                >
                                    Settings
                                </button>
                                <button
                                    onClick={() => setShowSubtitles(!showSubtitles)}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                        showSubtitles ? 'bg-amber-500 text-white' : 'bg-black/50 text-white/70'
                                    }`}
                                >
                                    CC {showSubtitles ? 'ON' : 'OFF'}
                                </button>
                            </div>
                            {/* Subtitle Settings Panel */}
                            {showSubtitleSettings && (
                                <div className="absolute top-12 right-3 bg-black/90 text-white p-3 rounded-lg text-xs space-y-3 min-w-[150px]">
                                    <div>
                                        <p className="text-white/60 mb-1">Size</p>
                                        <div className="flex gap-1">
                                            {(['sm', 'md', 'lg'] as const).map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSubtitleSize(size)}
                                                    className={`px-2 py-1 rounded ${subtitleSize === size ? 'bg-amber-500' : 'bg-white/20'}`}
                                                >
                                                    {size === 'sm' ? 'S' : size === 'md' ? 'M' : 'L'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white/60 mb-1">Style</p>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => setSubtitleStyle('dark')}
                                                className={`px-2 py-1 rounded bg-black text-white border ${subtitleStyle === 'dark' ? 'border-amber-500' : 'border-white/30'}`}
                                            >
                                                Dark
                                            </button>
                                            <button
                                                onClick={() => setSubtitleStyle('light')}
                                                className={`px-2 py-1 rounded bg-white text-black border ${subtitleStyle === 'light' ? 'border-amber-500' : 'border-white/30'}`}
                                            >
                                                Light
                                            </button>
                                            <button
                                                onClick={() => setSubtitleStyle('yellow')}
                                                className={`px-2 py-1 rounded bg-yellow-400 text-black border ${subtitleStyle === 'yellow' ? 'border-amber-500' : 'border-white/30'}`}
                                            >
                                                Yellow
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowSubtitleSettings(false)}
                                        className="w-full py-1 bg-white/20 rounded hover:bg-white/30"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-[30%] flex-1 md:flex-none bg-white flex flex-col border-t md:border-t-0 md:border-l border-stone-200">
                        {/* Audio Mode Toggle */}
                        <div className="px-4 py-3 border-b border-stone-200">
                            <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-lg mb-3">
                                <button
                                    onClick={() => { setEnglishVoiceMode(false); setIsTTSPlaying(false); isTTSPlayingRef.current = false; window.speechSynthesis.cancel(); }}
                                    className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all ${!englishVoiceMode ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}
                                >
                                    Video Audio
                                </button>
                                <button
                                    onClick={() => { setEnglishVoiceMode(true); if (ytPlayerRef.current) ytPlayerRef.current.pauseVideo(); }}
                                    className={`py-1.5 px-3 rounded-md text-xs font-medium transition-all ${englishVoiceMode ? 'bg-indigo-500 text-white shadow' : 'text-stone-500'}`}
                                >
                                    English Voice
                                </button>
                            </div>

                            {englishVoiceMode ? (
                                <button
                                    onClick={toggleEnglishVoice}
                                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                        isTTSPlaying
                                            ? 'bg-red-100 text-red-600 border border-red-300'
                                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                    }`}
                                >
                                    {isTTSPlaying ? (
                                        <>Stop English</>
                                    ) : (
                                        <><Volume2 size={16} /> Play English Audio</>
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-stone-600">Transcript</span>
                                        {videoPlaying && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-medium animate-pulse">LIVE</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setShowJapanese(!showJapanese)} className={`px-2 py-1 rounded text-xs ${showJapanese ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>JP</button>
                                        <span className="text-xs text-stone-400">{content.segments.length}</span>
                                    </div>
                                </div>
                            )}

                            {englishVoiceMode && (
                                <p className="text-[10px] text-center text-stone-400 mt-2">Reads all English sentences sequentially</p>
                            )}
                        </div>

                        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[calc(60vh-100px)] md:max-h-none">
                            {content.segments.map((segment, i) => {
                                const isActive = i === currentIndex;
                                return (
                                    <div key={i} data-index={i} onClick={() => englishVoiceMode ? null : seekToSegment(i)} className={`p-3 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-400 shadow-sm' : 'bg-stone-50 hover:bg-stone-100 border border-transparent'}`}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${isActive ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-500'}`}>{i + 1}</span>
                                            <span className="text-[10px] text-stone-400 font-mono">{formatTime(segment.startTime)}</span>
                                            <div className="flex-1" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); speakSingleSegment(segment.english); }}
                                                className="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-indigo-500"
                                                title="Read aloud"
                                            >
                                                <Volume2 size={14} />
                                            </button>
                                            <button onClick={(e) => openVocabModal(e, segment.english)} className="px-1.5 py-0.5 rounded text-[9px] border border-emerald-500 text-emerald-500 hover:bg-emerald-50">+Vocab</button>
                                            <button onClick={(e) => toggleSavePhrase(e, segment.english, segment.japanese)} className="p-1">
                                                <Star size={14} className={savedPhrases.has(segment.english) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'} />
                                            </button>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${isActive ? 'text-stone-800 font-medium' : 'text-stone-600'}`}>{segment.english}</p>
                                        {showJapanese && <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">{segment.japanese}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Vocab Modal */}
                {showVocabModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5" onClick={() => setShowVocabModal(false)}>
                        <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-semibold">Save to Vocabulary</h3>
                                <button onClick={() => setShowVocabModal(false)} className="text-2xl text-stone-400 hover:text-stone-800">x</button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Example Sentence</label>
                                <div className="p-3 bg-stone-50 rounded-lg text-sm text-stone-500">{vocabExample}</div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Word / Phrase *</label>
                                <input type="text" value={vocabWord} onChange={(e) => setVocabWord(e.target.value)} placeholder="e.g., flutter jump" className="w-full p-3 border border-stone-200 rounded-lg text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Type</label>
                                <select value={vocabType} onChange={(e) => setVocabType(e.target.value)} className="w-full p-3 border border-stone-200 rounded-lg text-sm">
                                    <option value="word">Word</option>
                                    <option value="idiom">Idiom</option>
                                    <option value="phrasal verb">Phrasal Verb</option>
                                    <option value="expression">Expression</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs text-stone-400 mb-1.5">Meaning (Japanese) *</label>
                                <input type="text" value={vocabMeaning} onChange={(e) => setVocabMeaning(e.target.value)} placeholder="e.g., 踏ん張りジャンプ" className="w-full p-3 border border-stone-200 rounded-lg text-sm" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowVocabModal(false)} className="flex-1 py-3 bg-stone-100 rounded-lg text-sm">Cancel</button>
                                <button onClick={saveToVocabulary} disabled={!vocabWord.trim() || !vocabMeaning.trim()} className="flex-1 py-3 bg-emerald-500 text-white rounded-lg text-sm font-semibold disabled:bg-stone-200 disabled:text-stone-400">Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ==================== LESSON MODE ====================
    // Plays: YouTube audio (Japanese) for segment → English TTS → next segment
    if (mode === 'lesson') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 text-stone-800">
                <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
                    <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline text-sm">Back</span>
                        </button>

                        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                            <button onClick={() => switchMode('video')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'video' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Video size={14} /> Video
                            </button>
                            <button onClick={() => switchMode('tts')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'tts' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Headphones size={14} /> TTS
                            </button>
                            <button onClick={() => switchMode('lesson')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'lesson' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <BookOpen size={14} /> Lesson
                            </button>
                            <button onClick={() => switchMode('dual')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'dual' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Layers size={14} /> Dual
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {savedPhrases.size > 0 && (
                                <Link href="/english/saved" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 text-xs hover:bg-amber-200 transition-colors">
                                    <Star size={12} className="fill-yellow-400" />
                                    <span>{savedPhrases.size}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hidden YouTube player for audio */}
                <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 }}>
                    <div id="lesson-player" />
                </div>

                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Thumbnail and Status */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-2xl max-w-2xl mx-auto">
                        <img
                            src={`https://img.youtube.com/vi/${content.youtubeId}/maxresdefault.jpg`}
                            alt={content.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Phase indicator overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {lessonPlaying && (
                                <div className={`px-6 py-3 rounded-full text-white font-semibold text-lg ${
                                    lessonPhase === 'japanese' ? 'bg-red-500/90' : 'bg-indigo-500/90'
                                }`}>
                                    {lessonPhase === 'japanese' ? 'Japanese Audio' : 'English TTS'}
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-xs text-white/80 mb-1">Segment {currentIndex + 1} of {content.segments.length}</p>
                            <h2 className="text-white font-medium line-clamp-1">{content.title}</h2>
                        </div>
                    </div>

                    {/* Current segment display */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6 max-w-2xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            {!lessonReady && (
                                <div className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 animate-pulse">
                                    Loading Player...
                                </div>
                            )}
                            {lessonReady && (
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    lessonPhase === 'japanese' ? 'bg-red-100 text-red-700' :
                                    lessonPhase === 'english' ? 'bg-indigo-100 text-indigo-700' :
                                    'bg-stone-100 text-stone-500'
                                }`}>
                                    {lessonPhase === 'idle' ? 'Ready' : lessonPhase === 'japanese' ? 'JP Playing' : 'EN Reading'}
                                </div>
                            )}
                            <span className="text-xs text-stone-400 font-mono">{formatTime(currentSegment?.startTime || 0)}</span>
                        </div>
                        <p className="text-lg leading-relaxed mb-3">{currentSegment?.english}</p>
                        <p className="text-sm text-stone-500 leading-relaxed">{currentSegment?.japanese}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <button
                            onClick={() => {
                                if (currentIndex > 0) {
                                    stopLesson();
                                    setCurrentIndex(currentIndex - 1);
                                }
                            }}
                            className="p-3 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-all"
                        >
                            <SkipBack size={28} fill="currentColor" />
                        </button>

                        <button
                            onClick={toggleLesson}
                            disabled={!lessonReady}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                !lessonReady
                                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                    :
                                lessonPlaying
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }`}
                        >
                            {lessonPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                        </button>

                        <button
                            onClick={() => {
                                if (content && currentIndex < content.segments.length - 1) {
                                    stopLesson();
                                    setCurrentIndex(currentIndex + 1);
                                }
                            }}
                            className="p-3 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-all"
                        >
                            <SkipForward size={28} fill="currentColor" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="text-center mb-6">
                        <p className="text-xs text-stone-400">
                            Japanese audio plays first, then English TTS reads the translation.
                            <br />Automatically moves to the next segment.
                        </p>
                    </div>

                    {/* Transcript list */}
                    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                        <div className="sticky top-0 bg-white/95 backdrop-blur px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-stone-600">Lesson Transcript</h3>
                            <span className="text-xs text-stone-400">{content.segments.length} segments</span>
                        </div>

                        <div ref={listRef} className="max-h-[40vh] overflow-y-auto p-3 space-y-2">
                            {content.segments.map((segment, i) => {
                                const isActive = i === currentIndex;
                                return (
                                    <div
                                        key={i}
                                        data-index={i}
                                        onClick={() => {
                                            stopLesson();
                                            setCurrentIndex(i);
                                        }}
                                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                                            isActive
                                                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300'
                                                : 'bg-white hover:bg-stone-50 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                                                isActive ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-500'
                                            }`}>
                                                {isActive && lessonPlaying ? (
                                                    <span className="animate-pulse">...</span>
                                                ) : (
                                                    i + 1
                                                )}
                                            </div>
                                            <span className="text-[10px] text-stone-400 font-mono">{formatTime(segment.startTime)}</span>
                                            <div className="flex-1" />
                                            <button
                                                onClick={(e) => openVocabModal(e, segment.english)}
                                                className="px-2 py-1 rounded text-[10px] font-semibold border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                                            >
                                                +Vocab
                                            </button>
                                            <button
                                                onClick={(e) => toggleSavePhrase(e, segment.english, segment.japanese)}
                                                className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                                            >
                                                <Star size={16} className={savedPhrases.has(segment.english) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-400'} />
                                            </button>
                                        </div>
                                        <p className={`text-sm leading-relaxed mb-2 ${isActive ? 'text-stone-800 font-medium' : 'text-stone-600'}`}>
                                            {segment.english}
                                        </p>
                                        <p className="text-xs text-stone-400 leading-relaxed">{segment.japanese}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Vocab Modal */}
                {showVocabModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5" onClick={() => setShowVocabModal(false)}>
                        <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full max-h-[90vh] overflow-auto border border-stone-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-semibold">Save to Vocabulary</h3>
                                <button onClick={() => setShowVocabModal(false)} className="text-2xl text-stone-400 hover:text-stone-800">x</button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Example Sentence</label>
                                <div className="p-3 bg-stone-50 rounded-lg text-sm text-stone-500 leading-relaxed">{vocabExample}</div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Word / Phrase to Learn *</label>
                                <input type="text" value={vocabWord} onChange={(e) => setVocabWord(e.target.value)} placeholder="e.g., rabbit hole, get the hang of" className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Type</label>
                                <select value={vocabType} onChange={(e) => setVocabType(e.target.value)} className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-white text-stone-800 focus:outline-none focus:border-emerald-500">
                                    <option value="word">Word</option>
                                    <option value="idiom">Idiom</option>
                                    <option value="phrasal verb">Phrasal Verb</option>
                                    <option value="slang">Slang</option>
                                    <option value="expression">Expression</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs text-stone-400 mb-1.5">Meaning (Japanese) *</label>
                                <input type="text" value={vocabMeaning} onChange={(e) => setVocabMeaning(e.target.value)} placeholder="e.g., 深みにはまる、コツをつかむ" className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowVocabModal(false)} className="flex-1 py-3.5 bg-stone-100 rounded-lg text-sm text-stone-500 hover:bg-stone-200 transition-colors">Cancel</button>
                                <button onClick={saveToVocabulary} disabled={vocabSaving || !vocabWord.trim() || !vocabMeaning.trim()} className={`flex-1 py-3.5 rounded-lg text-sm font-semibold transition-colors ${(!vocabWord.trim() || !vocabMeaning.trim()) ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
                                    {vocabSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ==================== DUAL MODE ====================
    // Plays: YouTube audio (Japanese) + English TTS simultaneously
    if (mode === 'dual') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-violet-50 to-stone-100 text-stone-800">
                <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
                    <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline text-sm">Back</span>
                        </button>

                        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                            <button onClick={() => switchMode('video')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'video' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Video size={14} /> Video
                            </button>
                            <button onClick={() => switchMode('tts')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'tts' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Headphones size={14} /> TTS
                            </button>
                            <button onClick={() => switchMode('lesson')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'lesson' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <BookOpen size={14} /> Lesson
                            </button>
                            <button onClick={() => switchMode('dual')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'dual' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                                <Layers size={14} /> Dual
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {savedPhrases.size > 0 && (
                                <Link href="/english/saved" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 text-xs hover:bg-amber-200 transition-colors">
                                    <Star size={12} className="fill-yellow-400" />
                                    <span>{savedPhrases.size}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hidden YouTube player for audio */}
                <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 }}>
                    <div id="dual-player" />
                </div>

                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Thumbnail and Status */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-2xl max-w-2xl mx-auto">
                        <img
                            src={`https://img.youtube.com/vi/${content.youtubeId}/maxresdefault.jpg`}
                            alt={content.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Playing indicator overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {dualPlaying && (
                                <div className="px-6 py-3 rounded-full text-white font-semibold text-lg bg-violet-500/90 animate-pulse">
                                    JP + EN Playing
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-xs text-white/80 mb-1">Segment {currentIndex + 1} of {content.segments.length}</p>
                            <h2 className="text-white font-medium line-clamp-1">{content.title}</h2>
                        </div>
                    </div>

                    {/* Current segment display */}
                    <div className="bg-white border border-violet-200 rounded-2xl p-6 mb-6 max-w-2xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            {!dualReady && (
                                <div className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 animate-pulse">
                                    Loading Player...
                                </div>
                            )}
                            {dualReady && (
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    dualPlaying ? 'bg-violet-100 text-violet-700' : 'bg-stone-100 text-stone-500'
                                }`}>
                                    {dualPlaying ? 'Dual Playing' : 'Ready'}
                                </div>
                            )}
                            <span className="text-xs text-stone-400 font-mono">{formatTime(currentSegment?.startTime || 0)}</span>
                        </div>
                        <p className="text-lg leading-relaxed mb-3">{currentSegment?.english}</p>
                        <p className="text-sm text-stone-500 leading-relaxed">{currentSegment?.japanese}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <button
                            onClick={() => {
                                if (currentIndex > 0) {
                                    stopDual();
                                    setCurrentIndex(currentIndex - 1);
                                }
                            }}
                            className="p-3 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-all"
                        >
                            <SkipBack size={28} fill="currentColor" />
                        </button>

                        <button
                            onClick={toggleDual}
                            disabled={!dualReady}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                !dualReady
                                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                    : dualPlaying
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-violet-500 hover:bg-violet-600 text-white'
                            }`}
                        >
                            {dualPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                        </button>

                        <button
                            onClick={() => {
                                if (content && currentIndex < content.segments.length - 1) {
                                    stopDual();
                                    setCurrentIndex(currentIndex + 1);
                                }
                            }}
                            className="p-3 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-all"
                        >
                            <SkipForward size={28} fill="currentColor" />
                        </button>
                    </div>

                    {/* Volume Controls */}
                    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-red-600">JP (YouTube)</span>
                                    <span className="text-xs text-stone-400">{jpVolume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={jpVolume}
                                    onChange={(e) => handleJpVolumeChange(Number(e.target.value))}
                                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-indigo-600">EN (TTS)</span>
                                    <span className="text-xs text-stone-400">{enVolume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={enVolume}
                                    onChange={(e) => handleEnVolumeChange(Number(e.target.value))}
                                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-stone-400 text-center mt-3">
                            JP: YouTube audio / EN: Text-to-Speech
                        </p>
                    </div>

                    {/* Transcript list */}
                    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                        <div className="sticky top-0 bg-white/95 backdrop-blur px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-stone-600">Dual Transcript</h3>
                            <span className="text-xs text-stone-400">{content.segments.length} segments</span>
                        </div>

                        <div ref={listRef} className="max-h-[40vh] overflow-y-auto p-3 space-y-2">
                            {content.segments.map((segment, i) => {
                                const isActive = i === currentIndex;
                                return (
                                    <div
                                        key={i}
                                        data-index={i}
                                        onClick={() => {
                                            stopDual();
                                            setCurrentIndex(i);
                                        }}
                                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                                            isActive
                                                ? 'bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-300'
                                                : 'bg-white hover:bg-stone-50 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                                                isActive ? 'bg-violet-500 text-white' : 'bg-stone-100 text-stone-500'
                                            }`}>
                                                {isActive && dualPlaying ? (
                                                    <span className="animate-pulse">...</span>
                                                ) : (
                                                    i + 1
                                                )}
                                            </div>
                                            <span className="text-[10px] text-stone-400 font-mono">{formatTime(segment.startTime)}</span>
                                            <div className="flex-1" />
                                            <button
                                                onClick={(e) => openVocabModal(e, segment.english)}
                                                className="px-2 py-1 rounded text-[10px] font-semibold border border-violet-500 text-violet-500 hover:bg-violet-500/10 transition-colors"
                                            >
                                                +Vocab
                                            </button>
                                            <button
                                                onClick={(e) => toggleSavePhrase(e, segment.english, segment.japanese)}
                                                className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                                            >
                                                <Star size={16} className={savedPhrases.has(segment.english) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-400'} />
                                            </button>
                                        </div>
                                        <p className={`text-sm leading-relaxed mb-2 ${isActive ? 'text-stone-800 font-medium' : 'text-stone-600'}`}>
                                            {segment.english}
                                        </p>
                                        <p className="text-xs text-stone-400 leading-relaxed">{segment.japanese}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Vocab Modal */}
                {showVocabModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5" onClick={() => setShowVocabModal(false)}>
                        <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full max-h-[90vh] overflow-auto border border-stone-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-semibold">Save to Vocabulary</h3>
                                <button onClick={() => setShowVocabModal(false)} className="text-2xl text-stone-400 hover:text-stone-800">x</button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Example Sentence</label>
                                <div className="p-3 bg-stone-50 rounded-lg text-sm text-stone-500 leading-relaxed">{vocabExample}</div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Word / Phrase to Learn *</label>
                                <input type="text" value={vocabWord} onChange={(e) => setVocabWord(e.target.value)} placeholder="e.g., rabbit hole, get the hang of" className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:border-violet-500" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-stone-400 mb-1.5">Type</label>
                                <select value={vocabType} onChange={(e) => setVocabType(e.target.value)} className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-white text-stone-800 focus:outline-none focus:border-violet-500">
                                    <option value="word">Word</option>
                                    <option value="idiom">Idiom</option>
                                    <option value="phrasal verb">Phrasal Verb</option>
                                    <option value="slang">Slang</option>
                                    <option value="expression">Expression</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs text-stone-400 mb-1.5">Meaning (Japanese) *</label>
                                <input type="text" value={vocabMeaning} onChange={(e) => setVocabMeaning(e.target.value)} placeholder="e.g., 深みにはまる、コツをつかむ" className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:border-violet-500" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowVocabModal(false)} className="flex-1 py-3.5 bg-stone-100 rounded-lg text-sm text-stone-500 hover:bg-stone-200 transition-colors">Cancel</button>
                                <button onClick={saveToVocabulary} disabled={vocabSaving || !vocabWord.trim() || !vocabMeaning.trim()} className={`flex-1 py-3.5 rounded-lg text-sm font-semibold transition-colors ${(!vocabWord.trim() || !vocabMeaning.trim()) ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-violet-500 text-white hover:bg-violet-600'}`}>
                                    {vocabSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ==================== TTS MODE (ORIGINAL) ====================
    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 text-stone-800 pb-48 md:pb-8">
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
                <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="hidden sm:inline text-sm">Back</span>
                    </button>

                    <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                        <button onClick={() => switchMode('video')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'video' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                            <Video size={14} /> Video
                        </button>
                        <button onClick={() => switchMode('tts')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'tts' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                            <Headphones size={14} /> TTS
                        </button>
                        <button onClick={() => switchMode('lesson')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'lesson' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                            <BookOpen size={14} /> Lesson
                        </button>
                        <button onClick={() => switchMode('dual')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'dual' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}>
                            <Layers size={14} /> Dual
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {savedPhrases.size > 0 && (
                            <Link href="/english/saved" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 text-xs hover:bg-amber-200 transition-colors">
                                <Star size={12} className="fill-yellow-400" />
                                <span>{savedPhrases.size}</span>
                            </Link>
                        )}
                        <button onClick={() => setShowTranscript(!showTranscript)} className="flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors md:hidden">
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="order-1">
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-2xl">
                            <img src={`https://img.youtube.com/vi/${content.youtubeId}/maxresdefault.jpg`} alt={content.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-xs text-white/80 mb-1">Segment {currentIndex + 1} of {content.segments.length}</p>
                            </div>
                        </div>

                        <div className="hidden md:block bg-white backdrop-blur border border-stone-200 rounded-2xl p-6 mb-6">
                            <div className="text-xs text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Volume2 size={14} /> Now Playing
                            </div>
                            <p className="text-lg leading-relaxed mb-4">{currentSegment?.english}</p>
                            {showJapanese && <p className="text-sm text-stone-500 leading-relaxed">{currentSegment?.japanese}</p>}
                        </div>

                        <div className="hidden md:block">
                            <div className="mb-6">
                                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 mb-6">
                                <button onClick={toggleShuffle} className={`p-3 rounded-full transition-all ${isShuffle ? 'text-amber-600' : 'text-stone-400 hover:text-stone-800'}`}>
                                    <Shuffle size={20} />
                                </button>
                                <button onClick={playPrevious} className="p-3 text-stone-800 hover:scale-110 transition-transform">
                                    <SkipBack size={28} fill="currentColor" />
                                </button>
                                <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                                    {isPlaying ? <Pause size={28} className="text-black" fill="black" /> : <Play size={28} className="text-black ml-1" fill="black" />}
                                </button>
                                <button onClick={playNext} className="p-3 text-stone-800 hover:scale-110 transition-transform">
                                    <SkipForward size={28} fill="currentColor" />
                                </button>
                                <button onClick={toggleRepeat} className={`p-3 rounded-full transition-all relative ${repeatMode > 0 ? 'text-amber-600' : 'text-stone-400 hover:text-stone-800'}`}>
                                    {repeatMode === 2 ? <Repeat1 size={20} /> : <Repeat size={20} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-6 flex-wrap">
                                <div className="relative">
                                    <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="px-4 py-2 rounded-full bg-stone-100 text-sm hover:bg-stone-200 transition-colors">
                                        {speed}x
                                    </button>
                                    {showSpeedMenu && (
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl p-2 min-w-[120px]">
                                            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(s => (
                                                <button key={s} onClick={() => handleSpeedChange(s)} className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${speed === s ? 'bg-amber-100 text-amber-700' : 'hover:bg-stone-100'}`}>
                                                    {s}x {s === 1.0 && '(Normal)'}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setShowJapanese(!showJapanese)} className={`px-4 py-2 rounded-full text-sm transition-colors ${showJapanese ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                                    JP {showJapanese ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`order-2 ${showTranscript ? 'block' : 'hidden'} md:block`}>
                        <div className="bg-white backdrop-blur border border-stone-200 rounded-2xl overflow-hidden">
                            <div className="sticky top-0 bg-white/95 backdrop-blur px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-stone-600">Transcript</h3>
                                <span className="text-xs text-stone-400">{content.segments.length} segments</span>
                            </div>

                            <div ref={listRef} className="max-h-[50vh] lg:max-h-[calc(100vh-280px)] overflow-y-auto p-3 space-y-2">
                                {content.segments.map((segment, i) => {
                                    const isActive = i === currentIndex;
                                    return (
                                        <div key={i} data-index={i} onClick={() => { window.speechSynthesis.cancel(); stopProgress(); playSegment(i); }} className={`p-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300' : 'bg-white/5 hover:bg-stone-100 border border-transparent'}`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${isActive ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'}`}>
                                                    {isActive && isPlaying ? <span className="animate-pulse">...</span> : i + 1}
                                                </div>
                                                {segment.startTime > 0 && <span className="text-[10px] text-stone-400 font-mono">{formatTime(segment.startTime)}</span>}
                                                <div className="flex-1" />
                                                <button onClick={(e) => openVocabModal(e, segment.english)} className="px-2 py-1 rounded text-[10px] font-semibold border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 transition-colors">+Vocab</button>
                                                <button onClick={(e) => toggleSavePhrase(e, segment.english, segment.japanese)} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
                                                    <Star size={16} className={savedPhrases.has(segment.english) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-400'} />
                                                </button>
                                            </div>
                                            <p className={`text-sm leading-relaxed mb-2 ${isActive ? 'text-stone-800' : 'text-stone-600'}`}>{segment.english}</p>
                                            {showJapanese && <p className="text-xs text-stone-400 leading-relaxed">{segment.japanese}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Player */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 backdrop-blur-lg border-t border-stone-200 z-50">
                <div className="px-4 py-3 border-b border-stone-200">
                    <p className="text-sm leading-relaxed line-clamp-2">{currentSegment?.english}</p>
                    {showJapanese && <p className="text-xs text-stone-400 mt-1 line-clamp-1">{currentSegment?.japanese}</p>}
                </div>

                <div className="h-1 bg-stone-100">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>

                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button onClick={toggleShuffle} className={`p-2 rounded-full ${isShuffle ? 'text-amber-600' : 'text-stone-400'}`}>
                                <Shuffle size={18} />
                            </button>
                            <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="px-2 py-1 rounded-full bg-stone-100 text-xs">
                                {speed}x
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={playPrevious} className="p-2 text-stone-800 active:scale-90 transition-transform">
                                <SkipBack size={24} fill="currentColor" />
                            </button>
                            <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shadow-lg">
                                {isPlaying ? <Pause size={24} className="text-black" fill="black" /> : <Play size={24} className="text-black ml-0.5" fill="black" />}
                            </button>
                            <button onClick={playNext} className="p-2 text-stone-800 active:scale-90 transition-transform">
                                <SkipForward size={24} fill="currentColor" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowJapanese(!showJapanese)} className={`px-2 py-1 rounded-full text-xs ${showJapanese ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>
                                JP
                            </button>
                            <button onClick={toggleRepeat} className={`p-2 rounded-full ${repeatMode > 0 ? 'text-amber-600' : 'text-stone-400'}`}>
                                {repeatMode === 2 ? <Repeat1 size={18} /> : <Repeat size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {showSpeedMenu && (
                    <div className="absolute bottom-full left-0 right-0 bg-white border-t border-stone-200 p-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(s => (
                                <button key={s} onClick={() => handleSpeedChange(s)} className={`px-4 py-2 rounded-full text-sm transition-colors ${speed === s ? 'bg-amber-500 text-white font-medium' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                                    {s}x
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Vocab Modal */}
            {showVocabModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5" onClick={() => setShowVocabModal(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full max-h-[90vh] overflow-auto border border-stone-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-semibold">Save to Vocabulary</h3>
                            <button onClick={() => setShowVocabModal(false)} className="text-2xl text-stone-400 hover:text-stone-800">x</button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-stone-400 mb-1.5">Example Sentence</label>
                            <div className="p-3 bg-stone-50 rounded-lg text-sm text-stone-500 leading-relaxed">{vocabExample}</div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-stone-400 mb-1.5">Word / Phrase to Learn *</label>
                            <input type="text" value={vocabWord} onChange={(e) => setVocabWord(e.target.value)} placeholder="e.g., rabbit hole, get the hang of" className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-stone-400 mb-1.5">Type</label>
                            <select value={vocabType} onChange={(e) => setVocabType(e.target.value)} className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-white text-stone-800 focus:outline-none focus:border-emerald-500">
                                <option value="word">Word</option>
                                <option value="idiom">Idiom</option>
                                <option value="phrasal verb">Phrasal Verb</option>
                                <option value="slang">Slang</option>
                                <option value="expression">Expression</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs text-stone-400 mb-1.5">Meaning (Japanese) *</label>
                            <input type="text" value={vocabMeaning} onChange={(e) => setVocabMeaning(e.target.value)} placeholder="e.g., 深みにはまる、コツをつかむ" className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowVocabModal(false)} className="flex-1 py-3.5 bg-stone-100 rounded-lg text-sm text-stone-500 hover:bg-stone-200 transition-colors">Cancel</button>
                            <button onClick={saveToVocabulary} disabled={vocabSaving || !vocabWord.trim() || !vocabMeaning.trim()} className={`flex-1 py-3.5 rounded-lg text-sm font-semibold transition-colors ${(!vocabWord.trim() || !vocabMeaning.trim()) ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
                                {vocabSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
