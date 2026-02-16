'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface VideoMatch {
    videoId: string;
    title: string;
    matches: {
        text: string;
        timestamp: number;
        duration: number;
    }[];
}


export default function VideosPage() {
    const [phrase, setPhrase] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<VideoMatch[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<{ videoId: string; timestamp: number; text: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const playerRef = useRef<HTMLIFrameElement>(null);

    const search = async () => {
        if (!phrase.trim()) return;

        setIsSearching(true);
        setResults([]);
        setSelectedMatch(null);
        setError(null);

        const searchPhrase = phrase.trim().toLowerCase();

        try {
            const res = await fetch('/api/phrase-videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phrase: searchPhrase }),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error + (data.message ? `: ${data.message}` : ''));
            } else if (data.results && data.results.length > 0) {
                setResults(data.results);
                const first = data.results[0];
                if (first.matches.length > 0) {
                    setSelectedMatch({
                        videoId: first.videoId,
                        timestamp: first.matches[0].timestamp,
                        text: first.matches[0].text,
                    });
                }
            } else {
                setError(`No videos found with "${searchPhrase}". Checked ${data.videosChecked || 0} videos.`);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed. Check console for details.');
        } finally {
            setIsSearching(false);
        }
    };

    const selectMatch = (videoId: string, timestamp: number, text: string) => {
        setSelectedMatch({ videoId, timestamp, text });
    };

    const getYouTubeEmbedUrl = (videoId: string, timestamp: number) => {
        return `https://www.youtube.com/embed/${videoId}?start=${Math.max(0, timestamp - 2)}&autoplay=1`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0a',
            color: '#fff',
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #222',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                backgroundColor: '#0a0a0a',
                zIndex: 10,
            }}>
                <Link href="/english" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
                    Back
                </Link>
                <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    Phrase Videos
                </span>
                <div style={{ width: '40px' }} />
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
                {/* Search */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={phrase}
                            onChange={(e) => setPhrase(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && search()}
                            placeholder="Enter a phrase (e.g., tucked away)"
                            style={{
                                flex: 1,
                                padding: '14px 16px',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                backgroundColor: '#1a1a1a',
                                color: '#fff',
                                fontSize: '15px',
                                outline: 'none',
                            }}
                        />
                        <button
                            onClick={search}
                            disabled={isSearching || !phrase.trim()}
                            style={{
                                padding: '14px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: phrase.trim() && !isSearching ? '#D4AF37' : '#333',
                                color: phrase.trim() && !isSearching ? '#000' : '#666',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: phrase.trim() && !isSearching ? 'pointer' : 'default',
                            }}
                        >
                            {isSearching ? '...' : 'Search'}
                        </button>
                    </div>

                    {/* Quick tags */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {['tucked away', 'hits different', 'low-key', 'no cap'].map((p) => (
                            <button
                                key={p}
                                onClick={() => { setPhrase(p); }}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    border: '1px solid #333',
                                    backgroundColor: 'transparent',
                                    color: '#888',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        color: '#888',
                        fontSize: '13px',
                        marginBottom: '20px',
                    }}>
                        {error}
                    </div>
                )}

                {/* Results */}
                {results.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Left: Video Player */}
                        <div>
                            <div style={{
                                fontSize: '11px',
                                color: '#666',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ef4444',
                                }} />
                                Video
                            </div>

                            {selectedMatch && (
                                <>
                                    <div style={{
                                        position: 'relative',
                                        paddingBottom: '56.25%',
                                        backgroundColor: '#111',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                    }}>
                                        <iframe
                                            ref={playerRef}
                                            key={`${selectedMatch.videoId}-${selectedMatch.timestamp}`}
                                            src={getYouTubeEmbedUrl(selectedMatch.videoId, selectedMatch.timestamp)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                            }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>

                                    {/* Current subtitle */}
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '16px',
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '8px',
                                        border: '1px solid #D4AF37',
                                    }}>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#D4AF37',
                                            marginBottom: '8px',
                                        }}>
                                            SUBTITLE
                                        </div>
                                        <div style={{
                                            fontSize: '15px',
                                            color: '#fff',
                                            lineHeight: '1.6',
                                        }}>
                                            "{selectedMatch.text}"
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right: Match List */}
                        <div>
                            <div style={{
                                fontSize: '11px',
                                color: '#666',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '12px',
                            }}>
                                Found {results.reduce((sum, r) => sum + r.matches.length, 0)} clips
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
                                {results.map((video) => (
                                    <div key={video.videoId}>
                                        {video.matches.map((match, i) => (
                                            <div
                                                key={`${video.videoId}-${i}`}
                                                onClick={() => selectMatch(video.videoId, match.timestamp, match.text)}
                                                style={{
                                                    padding: '14px',
                                                    backgroundColor: selectedMatch?.videoId === video.videoId && selectedMatch?.timestamp === match.timestamp
                                                        ? '#2a2a00'
                                                        : '#1a1a1a',
                                                    borderRadius: '8px',
                                                    border: `1px solid ${selectedMatch?.videoId === video.videoId && selectedMatch?.timestamp === match.timestamp ? '#D4AF37' : '#222'}`,
                                                    cursor: 'pointer',
                                                    marginBottom: '8px',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '8px',
                                                }}>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        color: '#D4AF37',
                                                        backgroundColor: '#2a2a00',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                    }}>
                                                        {Math.floor(match.timestamp / 60)}:{(match.timestamp % 60).toString().padStart(2, '0')}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '11px',
                                                        color: '#666',
                                                    }}>
                                                        {video.videoId.slice(0, 8)}...
                                                    </span>
                                                </div>
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: '#ccc',
                                                    lineHeight: '1.5',
                                                }}>
                                                    "{match.text}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!isSearching && results.length === 0 && !error && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#666',
                    }}>
                        <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                            Search for a phrase to see real video examples
                        </div>
                        <div style={{ fontSize: '12px' }}>
                            YouTube subtitles searched automatically
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: '48px',
                    textAlign: 'center',
                    color: '#444',
                    fontSize: '11px',
                    lineHeight: '1.8',
                }}>
                    Real phrases from real videos.<br />
                    No YouGlish. Just YouTube.
                </div>
            </div>
        </div>
    );
}
