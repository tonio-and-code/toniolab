'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SavedPhrasesStorage } from '@/lib/saved-phrases';

declare global {
    interface Window {
        YT?: {
            Player: new (
                elementId: string,
                config: {
                    videoId: string;
                    playerVars?: Record<string, number | string>;
                    events?: {
                        onReady?: (event: { target: YTPlayer }) => void;
                        onStateChange?: (event: { data: number }) => void;
                    };
                }
            ) => YTPlayer;
            PlayerState: {
                PLAYING: number;
                PAUSED: number;
                ENDED: number;
            };
        };
        onYouTubeIframeAPIReady?: () => void;
    }
}

interface YTPlayer {
    getCurrentTime: () => number;
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
    getPlayerState: () => number;
    destroy: () => void;
}

interface TranscriptSegment {
    id: number;
    text: string;
    offset: number;   // ms
    duration: number;  // ms
}

function parseVideoId(input: string): { videoId: string | null; startTime: number } {
    const trimmed = input.trim();
    let startTime = 0;

    // Bare video ID (11 chars)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return { videoId: trimmed, startTime: 0 };
    }

    try {
        // Try parsing as URL
        let urlStr = trimmed;
        if (!urlStr.startsWith('http')) urlStr = 'https://' + urlStr;
        const url = new URL(urlStr);

        // Extract ?t= or ?start= parameter
        const tParam = url.searchParams.get('t') || url.searchParams.get('start');
        if (tParam) {
            startTime = parseInt(tParam, 10) || 0;
        }

        // youtu.be/VIDEO_ID
        if (url.hostname === 'youtu.be') {
            const id = url.pathname.slice(1).split('/')[0];
            if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return { videoId: id, startTime };
        }

        // youtube.com/watch?v=VIDEO_ID
        const vParam = url.searchParams.get('v');
        if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
            return { videoId: vParam, startTime };
        }

        // youtube.com/embed/VIDEO_ID
        const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        if (embedMatch) return { videoId: embedMatch[1], startTime };

        // youtube.com/v/VIDEO_ID
        const vMatch = url.pathname.match(/\/v\/([a-zA-Z0-9_-]{11})/);
        if (vMatch) return { videoId: vMatch[1], startTime };

    } catch {
        // Not a valid URL
    }

    return { videoId: null, startTime: 0 };
}

function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

const WORD_TYPES = ['word', 'phrasal verb', 'idiom', 'slang', 'collocation', 'expression'] as const;

export default function YouTubeSubtitlePage() {
    const [urlInput, setUrlInput] = useState('');
    const [videoId, setVideoId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
    const [transcriptLoading, setTranscriptLoading] = useState(false);
    const [transcriptError, setTranscriptError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(0); // ms
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSegments, setSelectedSegments] = useState<Set<number>>(new Set());
    const [phraseText, setPhraseText] = useState('');
    const [saveDate, setSaveDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [savingPhrase, setSavingPhrase] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [ytApiReady, setYtApiReady] = useState(false);

    // Word registration state
    const [wordForm, setWordForm] = useState<{
        phrase: string;
        type: string;
        meaning: string;
        note: string;
        example: string;
        segmentText: string;
        segmentOffset: number;
    } | null>(null);
    const [savingWord, setSavingWord] = useState(false);
    const [wordSaveSuccess, setWordSaveSuccess] = useState(false);
    const [wordSaveError, setWordSaveError] = useState<string | null>(null);

    const playerRef = useRef<YTPlayer | null>(null);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const activeSegmentRef = useRef<HTMLDivElement | null>(null);
    const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

    // Detect mobile
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Load YouTube IFrame API
    useEffect(() => {
        if (window.YT) {
            setYtApiReady(true);
            return;
        }

        const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
        if (existingScript) {
            // Script already loading, wait for it
            window.onYouTubeIframeAPIReady = () => setYtApiReady(true);
            return;
        }

        window.onYouTubeIframeAPIReady = () => setYtApiReady(true);
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
    }, []);

    // Initialize player when videoId changes
    useEffect(() => {
        if (!videoId || !ytApiReady) return;

        // Destroy existing player
        if (playerRef.current) {
            try { playerRef.current.destroy(); } catch { /* ignore */ }
            playerRef.current = null;
        }

        // Small delay to ensure DOM element exists
        const timer = setTimeout(() => {
            if (!window.YT) return;

            playerRef.current = new window.YT.Player('yt-player', {
                videoId,
                playerVars: {
                    autoplay: 0,
                    start: startTime,
                    rel: 0,
                    modestbranding: 1,
                },
                events: {
                    onStateChange: (event) => {
                        const playing = event.data === 1; // YT.PlayerState.PLAYING
                        setIsPlaying(playing);
                    },
                },
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [videoId, ytApiReady, startTime]);

    // Polling for current time
    useEffect(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }

        if (isPlaying && playerRef.current) {
            pollingRef.current = setInterval(() => {
                if (playerRef.current) {
                    try {
                        const timeSec = playerRef.current.getCurrentTime();
                        setCurrentTime(timeSec * 1000);
                    } catch { /* player not ready */ }
                }
            }, 250);
        }

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [isPlaying]);

    // Auto-scroll to active segment
    useEffect(() => {
        if (activeSegmentRef.current && transcriptContainerRef.current) {
            const container = transcriptContainerRef.current;
            const el = activeSegmentRef.current;
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            // Only scroll if element is outside visible area
            if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentTime, transcript]);

    // Fetch transcript
    const fetchTranscript = useCallback(async (vid: string) => {
        setTranscriptLoading(true);
        setTranscriptError(null);
        setTranscript([]);
        setSelectedSegments(new Set());

        try {
            const res = await fetch(`/api/youtube-transcript?videoId=${vid}`);
            const data = await res.json();

            if (!res.ok) {
                setTranscriptError(data.error || 'Failed to fetch transcript');
                return;
            }

            if (data.segments.length === 0) {
                setTranscriptError('This video has no subtitles available.');
                return;
            }

            setTranscript(data.segments);
        } catch {
            setTranscriptError('Network error. Please try again.');
        } finally {
            setTranscriptLoading(false);
        }
    }, []);

    // Handle URL submit
    const handleSubmit = useCallback(() => {
        const { videoId: vid, startTime: st } = parseVideoId(urlInput);
        if (!vid) return;

        setVideoId(vid);
        setStartTime(st);
        setCurrentTime(0);
        setIsPlaying(false);
        fetchTranscript(vid);
    }, [urlInput, fetchTranscript]);

    // Toggle segment selection
    const toggleSegment = useCallback((segId: number) => {
        setSelectedSegments(prev => {
            const next = new Set(prev);
            if (next.has(segId)) {
                next.delete(segId);
            } else {
                next.add(segId);
            }
            // Update editable phrase text
            const text = transcript
                .filter(s => next.has(s.id))
                .sort((a, b) => a.offset - b.offset)
                .map(s => s.text)
                .join(' ');
            setPhraseText(text);
            return next;
        });
    }, [transcript]);

    // Seek to segment
    const seekToSegment = useCallback((offsetMs: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(offsetMs / 1000, true);
        }
    }, []);

    // Handle segment click
    const handleSegmentClick = useCallback((seg: TranscriptSegment) => {
        toggleSegment(seg.id);
        seekToSegment(seg.offset);
    }, [toggleSegment, seekToSegment]);

    // Save selected phrases
    const handleSave = useCallback(async () => {
        if (!phraseText.trim() || !videoId) return;

        setSavingPhrase(true);
        setSaveSuccess(false);

        const textToSave = phraseText.trim();

        try {
            // Save to DB
            await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: textToSave,
                    japanese: `(YouTube: ${videoId})`,
                    category: 'YouTube',
                    date: saveDate,
                }),
            });

            // Save to localStorage bookmarks
            SavedPhrasesStorage.save({
                english: textToSave,
                source: `YouTube: ${videoId}`,
            });

            setSaveSuccess(true);
            setSelectedSegments(new Set());
            setPhraseText('');

            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setSavingPhrase(false);
        }
    }, [phraseText, videoId, saveDate]);

    // Open word registration form
    const handleWordClick = useCallback((word: string, seg: TranscriptSegment, e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger segment selection
        const cleaned = word.replace(/[^a-zA-Z'-]/g, '');
        if (!cleaned) return;
        seekToSegment(seg.offset);
        setWordForm({
            phrase: cleaned.toLowerCase(),
            type: 'word',
            meaning: '',
            note: '',
            example: seg.text,
            segmentText: seg.text,
            segmentOffset: seg.offset,
        });
        setWordSaveSuccess(false);
        setWordSaveError(null);
    }, [seekToSegment]);

    // Save word to vocabulary
    const handleWordSave = useCallback(async () => {
        if (!wordForm || !wordForm.phrase || !wordForm.meaning || !videoId) return;

        setSavingWord(true);
        setWordSaveError(null);

        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: wordForm.phrase,
                    type: wordForm.type,
                    meaning: wordForm.meaning,
                    note: wordForm.note || undefined,
                    example: wordForm.example || undefined,
                    source: `YouTube: ${videoId}`,
                    video_id: videoId,
                    video_timestamp: Math.floor(wordForm.segmentOffset / 1000),
                    video_text: wordForm.segmentText,
                }),
            });

            const data = await res.json();

            if (res.status === 409) {
                setWordSaveError('Already registered');
                return;
            }
            if (!res.ok) {
                setWordSaveError(data.error || 'Save failed');
                return;
            }

            setWordSaveSuccess(true);
            setTimeout(() => {
                setWordForm(null);
                setWordSaveSuccess(false);
            }, 1500);
        } catch {
            setWordSaveError('Network error');
        } finally {
            setSavingWord(false);
        }
    }, [wordForm, videoId]);

    // Find active segment
    const activeSegmentId = transcript.length > 0
        ? transcript.reduce((closest, seg) => {
            if (currentTime >= seg.offset && currentTime < seg.offset + seg.duration) {
                return seg.id;
            }
            // If between segments, find the last one that started
            if (currentTime >= seg.offset && (closest === -1 || seg.offset > (transcript.find(s => s.id === closest)?.offset || 0))) {
                return seg.id;
            }
            return closest;
        }, -1)
        : -1;

    // Select all / clear all
    const selectAll = () => {
        setSelectedSegments(new Set(transcript.map(s => s.id)));
        setPhraseText(transcript.sort((a, b) => a.offset - b.offset).map(s => s.text).join(' '));
    };
    const clearSelection = () => {
        setSelectedSegments(new Set());
        setPhraseText('');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <div style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
                padding: '16px 24px',
            }}>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1c1917',
                    margin: 0,
                    letterSpacing: '-0.3px',
                }}>
                    YouTube Subtitle Capture
                </h1>
                <p style={{
                    fontSize: '13px',
                    color: '#78716c',
                    margin: '4px 0 0',
                }}>
                    YouTube動画の字幕を表示し、フレーズを保存
                </p>
            </div>

            {/* URL Input */}
            <div style={{
                padding: '16px 24px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
            }}>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    maxWidth: '800px',
                }}>
                    <input
                        type="text"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                        placeholder="YouTube URL or Video ID (e.g., https://youtu.be/xxx)"
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: '1px solid #d6d3d1',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: '#fafaf9',
                        }}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!urlInput.trim()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: urlInput.trim() ? '#164038' : '#d6d3d1',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: urlInput.trim() ? 'pointer' : 'default',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Load
                    </button>
                </div>
                {urlInput.trim() && !parseVideoId(urlInput).videoId && (
                    <p style={{ fontSize: '12px', color: '#dc2626', margin: '6px 0 0' }}>
                        Valid YouTube URL or 11-character Video ID required
                    </p>
                )}
            </div>

            {/* Main Content */}
            {videoId && (
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '0',
                    maxWidth: '1400px',
                    margin: '0 auto',
                }}>
                    {/* Left: Player */}
                    <div style={{
                        flex: isMobile ? 'none' : '1 1 55%',
                        padding: '16px 16px 16px 24px',
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '56.25%', // 16:9
                            backgroundColor: '#000',
                            borderRadius: '12px',
                            overflow: 'hidden',
                        }}>
                            <div
                                id="yt-player"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </div>

                        {/* Save Panel: Phrase + Word side by side */}
                        <div style={{
                            marginTop: '12px',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: '10px',
                        }}>
                            {/* Left: Phrase Save */}
                            <div style={{
                                flex: 1,
                                padding: '12px 14px',
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                border: '1px solid #e5e5e5',
                                borderTop: '3px solid #D4AF37',
                                minHeight: '120px',
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#D4AF37',
                                    marginBottom: '8px',
                                    letterSpacing: '0.5px',
                                }}>
                                    PHRASE SAVE
                                </div>

                                {(selectedSegments.size > 0 || phraseText.trim()) ? (
                                    <>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#a8a29e',
                                            marginBottom: '6px',
                                        }}>
                                            {selectedSegments.size} segment{selectedSegments.size > 1 ? 's' : ''} selected
                                        </div>
                                        <textarea
                                            value={phraseText}
                                            onChange={e => setPhraseText(e.target.value)}
                                            rows={2}
                                            style={{
                                                width: '100%',
                                                fontSize: '13px',
                                                color: '#44403c',
                                                padding: '6px 8px',
                                                backgroundColor: 'rgba(212,175,55,0.08)',
                                                borderRadius: '5px',
                                                border: '1px solid #D4AF37',
                                                marginBottom: '8px',
                                                maxHeight: '60px',
                                                lineHeight: '1.4',
                                                resize: 'vertical',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            gap: '6px',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                        }}>
                                            <input
                                                type="date"
                                                value={saveDate}
                                                onChange={e => setSaveDate(e.target.value)}
                                                style={{
                                                    padding: '5px 8px',
                                                    border: '1px solid #d6d3d1',
                                                    borderRadius: '5px',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <button
                                                onClick={handleSave}
                                                disabled={savingPhrase}
                                                style={{
                                                    padding: '5px 14px',
                                                    backgroundColor: savingPhrase ? '#a8a29e' : '#D4AF37',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: savingPhrase ? 'default' : 'pointer',
                                                }}
                                            >
                                                {savingPhrase ? '...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={clearSelection}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: 'transparent',
                                                    color: '#78716c',
                                                    border: '1px solid #d6d3d1',
                                                    borderRadius: '5px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        {saveSuccess && (
                                            <div style={{ marginTop: '6px', fontSize: '11px', color: '#16a34a', fontWeight: '500' }}>
                                                Saved!
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#a8a29e',
                                        lineHeight: '1.5',
                                        padding: '8px 0',
                                    }}>
                                        Click timestamps to select subtitle segments, then save as a phrase
                                    </div>
                                )}
                            </div>

                            {/* Right: Word Registration */}
                            <div style={{
                                flex: 1,
                                padding: '12px 14px',
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                border: '1px solid #e5e5e5',
                                borderTop: '3px solid #10B981',
                                minHeight: '120px',
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#10B981',
                                    marginBottom: '8px',
                                    letterSpacing: '0.5px',
                                }}>
                                    WORD REGISTER
                                </div>

                                {wordForm ? (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            gap: '6px',
                                            marginBottom: '6px',
                                        }}>
                                            <input
                                                type="text"
                                                value={wordForm.phrase}
                                                onChange={e => setWordForm({ ...wordForm, phrase: e.target.value })}
                                                placeholder="Word / Phrase"
                                                style={{
                                                    flex: 1,
                                                    padding: '6px 8px',
                                                    border: '1px solid #d6d3d1',
                                                    borderRadius: '5px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                            <button
                                                onClick={() => setWordForm(null)}
                                                style={{
                                                    background: 'none',
                                                    border: '1px solid #e5e5e5',
                                                    borderRadius: '5px',
                                                    fontSize: '14px',
                                                    color: '#a8a29e',
                                                    cursor: 'pointer',
                                                    padding: '4px 8px',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                x
                                            </button>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: '3px',
                                            flexWrap: 'wrap',
                                            marginBottom: '6px',
                                        }}>
                                            {WORD_TYPES.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setWordForm({ ...wordForm, type: t })}
                                                    style={{
                                                        padding: '2px 6px',
                                                        fontSize: '10px',
                                                        borderRadius: '3px',
                                                        border: wordForm.type === t ? '1px solid #10B981' : '1px solid #e5e5e5',
                                                        backgroundColor: wordForm.type === t ? '#D1FAE5' : '#fff',
                                                        color: wordForm.type === t ? '#065F46' : '#78716c',
                                                        cursor: 'pointer',
                                                        fontWeight: wordForm.type === t ? '600' : '400',
                                                    }}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>

                                        <input
                                            type="text"
                                            value={wordForm.meaning}
                                            onChange={e => setWordForm({ ...wordForm, meaning: e.target.value })}
                                            placeholder="Meaning (Japanese) *"
                                            onKeyDown={e => { if (e.key === 'Enter' && wordForm.meaning) handleWordSave(); }}
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                padding: '6px 8px',
                                                border: '1px solid #d6d3d1',
                                                borderRadius: '5px',
                                                fontSize: '12px',
                                                marginBottom: '6px',
                                                boxSizing: 'border-box',
                                            }}
                                        />

                                        <div style={{
                                            display: 'flex',
                                            gap: '6px',
                                            marginBottom: '6px',
                                        }}>
                                            <input
                                                type="text"
                                                value={wordForm.note}
                                                onChange={e => setWordForm({ ...wordForm, note: e.target.value })}
                                                placeholder="Note"
                                                style={{
                                                    flex: 1,
                                                    padding: '5px 8px',
                                                    border: '1px solid #d6d3d1',
                                                    borderRadius: '5px',
                                                    fontSize: '11px',
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                            <input
                                                type="text"
                                                value={wordForm.example}
                                                onChange={e => setWordForm({ ...wordForm, example: e.target.value })}
                                                placeholder="Example"
                                                style={{
                                                    flex: 1,
                                                    padding: '5px 8px',
                                                    border: '1px solid #d6d3d1',
                                                    borderRadius: '5px',
                                                    fontSize: '11px',
                                                    boxSizing: 'border-box',
                                                    color: '#57534e',
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button
                                                onClick={handleWordSave}
                                                disabled={savingWord || !wordForm.meaning.trim()}
                                                style={{
                                                    padding: '5px 14px',
                                                    backgroundColor: (!wordForm.meaning.trim() || savingWord) ? '#a8a29e' : '#10B981',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: (!wordForm.meaning.trim() || savingWord) ? 'default' : 'pointer',
                                                }}
                                            >
                                                {savingWord ? '...' : 'Register'}
                                            </button>
                                            {wordSaveSuccess && (
                                                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '500' }}>Saved!</span>
                                            )}
                                            {wordSaveError && (
                                                <span style={{ fontSize: '11px', color: '#dc2626' }}>{wordSaveError}</span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#a8a29e',
                                        lineHeight: '1.5',
                                        padding: '8px 0',
                                    }}>
                                        Click a word in the subtitles to register it as vocabulary
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Transcript */}
                    <div style={{
                        flex: isMobile ? 'none' : '1 1 45%',
                        padding: isMobile ? '0 16px 16px' : '16px 24px 16px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {/* Transcript Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                        }}>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#44403c',
                            }}>
                                Subtitles
                                {transcript.length > 0 && (
                                    <span style={{ fontWeight: '400', color: '#a8a29e', marginLeft: '8px' }}>
                                        {transcript.length} segments
                                    </span>
                                )}
                            </span>
                            {transcript.length > 0 && (
                                <button
                                    onClick={selectedSegments.size === transcript.length ? clearSelection : selectAll}
                                    style={{
                                        fontSize: '12px',
                                        color: '#78716c',
                                        background: 'none',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '4px',
                                        padding: '3px 8px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {selectedSegments.size === transcript.length ? 'Deselect All' : 'Select All'}
                                </button>
                            )}
                        </div>

                        {/* Transcript List */}
                        <div
                            ref={transcriptContainerRef}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                maxHeight: isMobile ? '400px' : 'calc(100vh - 200px)',
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                border: '1px solid #e5e5e5',
                            }}
                        >
                            {transcriptLoading && (
                                <div style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#a8a29e',
                                    fontSize: '14px',
                                }}>
                                    Loading subtitles...
                                </div>
                            )}

                            {transcriptError && (
                                <div style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#dc2626',
                                    fontSize: '14px',
                                }}>
                                    {transcriptError}
                                </div>
                            )}

                            {!transcriptLoading && !transcriptError && transcript.length === 0 && (
                                <div style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#a8a29e',
                                    fontSize: '14px',
                                }}>
                                    No subtitles loaded yet
                                </div>
                            )}

                            {transcript.map(seg => {
                                const isActive = seg.id === activeSegmentId;
                                const isSelected = selectedSegments.has(seg.id);

                                return (
                                    <div
                                        key={seg.id}
                                        ref={isActive ? activeSegmentRef : null}
                                        onClick={() => handleSegmentClick(seg)}
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f5f5f4',
                                            backgroundColor: isSelected
                                                ? 'rgba(212,175,55,0.12)'
                                                : isActive
                                                    ? '#dcfce7'
                                                    : '#fff',
                                            borderLeft: isSelected
                                                ? '3px solid #D4AF37'
                                                : isActive
                                                    ? '3px solid #86efac'
                                                    : '3px solid transparent',
                                            transition: 'background-color 0.15s ease, border-left 0.15s ease',
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '11px',
                                            color: isActive ? '#16a34a' : '#a8a29e',
                                            fontFamily: 'monospace',
                                            whiteSpace: 'nowrap',
                                            lineHeight: '20px',
                                            minWidth: '36px',
                                        }}>
                                            {formatTime(seg.offset)}
                                        </span>
                                        <span style={{
                                            fontSize: '13px',
                                            color: isActive ? '#14532d' : '#44403c',
                                            lineHeight: '20px',
                                            fontWeight: isActive ? '500' : '400',
                                        }}>
                                            {seg.text.split(/(\s+)/).map((part, i) => {
                                                const isWord = /[a-zA-Z]/.test(part);
                                                if (!isWord) return <span key={i}>{part}</span>;
                                                return (
                                                    <span
                                                        key={i}
                                                        onClick={(e) => handleWordClick(part, seg, e)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            borderRadius: '2px',
                                                            transition: 'background-color 0.1s',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            (e.target as HTMLElement).style.backgroundColor = 'rgba(212,175,55,0.2)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            (e.target as HTMLElement).style.backgroundColor = 'transparent';
                                                        }}
                                                    >
                                                        {part}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!videoId && (
                <div style={{
                    padding: '80px 24px',
                    textAlign: 'center',
                    color: '#a8a29e',
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>
                        &#9654;
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#78716c' }}>
                        Paste a YouTube URL above to get started
                    </div>
                    <div style={{ fontSize: '13px', marginTop: '8px' }}>
                        View subtitles synced with playback and save phrases you want to learn
                    </div>
                </div>
            )}
        </div>
    );
}
