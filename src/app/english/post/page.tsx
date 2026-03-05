'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

// Demo examples
const demoExamples = [
    {
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
        english: "Finally tried that ramen place everyone's been hyping up. The broth was thick and rich, exactly what I needed after a long week. Definitely coming back.",
        japanese: "みんなが絶賛してたラーメン屋にやっと行けた。スープが濃厚でこってり、長い一週間の後にぴったりだった。絶対また来る。",
    },
    {
        image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600',
        english: "Woke up early for once and caught this view. Sometimes the best moments are the ones you almost miss. Coffee hits different at sunrise.",
        japanese: "珍しく早起きしてこの景色に出会えた。最高の瞬間って、見逃しそうになるやつだったりする。日の出のコーヒーは格別。",
    },
    {
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
        english: "Another day, another debugging session. Three hours to find a missing semicolon. This is fine. Everything is fine.",
        japanese: "今日もデバッグ。セミコロン一個見つけるのに3時間。大丈夫。全然大丈夫。",
    },
    {
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
        english: "Found this little cafe tucked away in a side street. No wifi, no outlets, just good coffee and my own thoughts. Sometimes that's all you need.",
        japanese: "路地裏で見つけた小さなカフェ。WiFiもコンセントもない、ただ美味しいコーヒーと自分の考えだけ。たまにはそれでいい。",
    },
];

export default function EnglishPostPage() {
    const [mode, setMode] = useState<'demo' | 'create'>('demo');
    const [currentDemo, setCurrentDemo] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [english, setEnglish] = useState('');
    const [japanese, setJapanese] = useState('');
    const [copied, setCopied] = useState<'english' | 'both' | null>(null);
    const [mood, setMood] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const demo = demoExamples[currentDemo];

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to Cloudflare
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setImageUrl(data.url);
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            alert('Upload error');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const generateDiary = async () => {
        if (!imageUrl) return;

        setIsGenerating(true);
        setEnglish('');
        setJapanese('');

        try {
            const res = await fetch('/api/english-diary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl, mood }),
            });

            const data = await res.json();
            if (data.english) {
                setEnglish(data.english);
                setJapanese(data.japanese || '');
            } else {
                alert('Generation failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            alert('Generation error');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async (type: 'english' | 'both') => {
        const text = type === 'english'
            ? english
            : `${english}\n\n${japanese}`;

        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const reset = () => {
        setImageUrl(null);
        setImagePreview(null);
        setEnglish('');
        setJapanese('');
        setMood('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#fafafa',
            color: '#262626',
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #dbdbdb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <Link href="/english" style={{
                    color: '#262626',
                    textDecoration: 'none',
                    fontSize: '14px',
                }}>
                    Back
                </Link>
                <span style={{
                    fontWeight: '600',
                    fontSize: '16px',
                }}>
                    English Diary
                </span>
                <div style={{ width: '40px' }} />
            </div>

            <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '20px',
            }}>
                {/* Mode Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                }}>
                    <button
                        onClick={() => setMode('demo')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: mode === 'demo' ? '#262626' : '#fff',
                            color: mode === 'demo' ? '#fff' : '#262626',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Examples
                    </button>
                    <button
                        onClick={() => setMode('create')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: mode === 'create' ? '#0095f6' : '#fff',
                            color: mode === 'create' ? '#fff' : '#262626',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Create Yours
                    </button>
                </div>

                {/* DEMO MODE */}
                {mode === 'demo' && (
                    <>
                        {/* Demo Image */}
                        <div style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            border: '1px solid #dbdbdb',
                        }}>
                            <img
                                src={demo.image}
                                alt="Demo"
                                style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </div>

                        {/* Demo Results */}
                        <div style={{ marginTop: '20px' }}>
                            {/* English */}
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid #dbdbdb',
                                marginBottom: '12px',
                            }}>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#0095f6',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                }}>
                                    English
                                </div>
                                <div style={{
                                    fontSize: '15px',
                                    lineHeight: '1.6',
                                    color: '#262626',
                                }}>
                                    {demo.english}
                                </div>
                            </div>

                            {/* Japanese */}
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid #dbdbdb',
                                marginBottom: '12px',
                            }}>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#8e8e8e',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                }}>
                                    Japanese
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#8e8e8e',
                                }}>
                                    {demo.japanese}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '8px',
                                marginTop: '20px',
                            }}>
                                {demoExamples.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentDemo(i)}
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            backgroundColor: i === currentDemo ? '#0095f6' : '#dbdbdb',
                                            cursor: 'pointer',
                                            padding: 0,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Swipe hint */}
                            <div style={{
                                textAlign: 'center',
                                marginTop: '12px',
                                fontSize: '12px',
                                color: '#8e8e8e',
                            }}>
                                Tap dots to see more examples
                            </div>
                        </div>
                    </>
                )}

                {/* CREATE MODE */}
                {mode === 'create' && (
                    <>
                        {!imagePreview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: '2px dashed #dbdbdb',
                                    borderRadius: '12px',
                                    padding: '60px 20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#fff',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#8e8e8e'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#dbdbdb'}
                            >
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21 15 16 10 5 21"/>
                                </svg>
                                <div style={{ color: '#8e8e8e', fontSize: '14px' }}>
                                    Tap to select a photo
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                border: '1px solid #dbdbdb',
                            }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        display: 'block',
                                    }}
                                />
                                {isUploading && (
                                    <div style={{
                                        padding: '12px',
                                        textAlign: 'center',
                                        color: '#8e8e8e',
                                        fontSize: '13px',
                                    }}>
                                        Uploading...
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                {/* Mood Input (optional) */}
                {mode === 'create' && imageUrl && !english && (
                    <div style={{ marginTop: '16px' }}>
                        <input
                            type="text"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            placeholder="Mood? (optional: tired, happy, chill...)"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #dbdbdb',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                )}

                {/* Generate Button */}
                {mode === 'create' && imageUrl && !english && (
                    <button
                        onClick={generateDiary}
                        disabled={isGenerating}
                        style={{
                            width: '100%',
                            padding: '14px',
                            marginTop: '16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isGenerating ? '#b2dffc' : '#0095f6',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: isGenerating ? 'default' : 'pointer',
                        }}
                    >
                        {isGenerating ? 'Generating...' : 'Generate English Diary'}
                    </button>
                )}

                {/* Results */}
                {mode === 'create' && english && (
                    <div style={{ marginTop: '20px' }}>
                        {/* English */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #dbdbdb',
                            marginBottom: '12px',
                        }}>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#0095f6',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '8px',
                            }}>
                                English
                            </div>
                            <div style={{
                                fontSize: '15px',
                                lineHeight: '1.6',
                                color: '#262626',
                            }}>
                                {english}
                            </div>
                            <button
                                onClick={() => copyToClipboard('english')}
                                style={{
                                    marginTop: '12px',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #dbdbdb',
                                    backgroundColor: copied === 'english' ? '#0095f6' : '#fff',
                                    color: copied === 'english' ? '#fff' : '#262626',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {copied === 'english' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        {/* Japanese */}
                        {japanese && (
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid #dbdbdb',
                                marginBottom: '12px',
                            }}>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#8e8e8e',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                }}>
                                    Japanese
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#8e8e8e',
                                }}>
                                    {japanese}
                                </div>
                            </div>
                        )}

                        {/* Copy Both */}
                        <button
                            onClick={() => copyToClipboard('both')}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: copied === 'both' ? '#00c853' : '#262626',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginBottom: '12px',
                            }}
                        >
                            {copied === 'both' ? 'Copied!' : 'Copy Both for Instagram'}
                        </button>

                        {/* Try Again */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={generateDiary}
                                disabled={isGenerating}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #dbdbdb',
                                    backgroundColor: '#fff',
                                    color: '#262626',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                Regenerate
                            </button>
                            <button
                                onClick={reset}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #dbdbdb',
                                    backgroundColor: '#fff',
                                    color: '#262626',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                New Photo
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Message */}
                <div style={{
                    marginTop: '40px',
                    textAlign: 'center',
                    color: '#8e8e8e',
                    fontSize: '12px',
                    lineHeight: '1.6',
                }}>
                    {mode === 'demo' ? (
                        <>
                            Photo + AI = English diary<br />
                            Copy. Paste. Post. Done.
                        </>
                    ) : (
                        <>
                            Upload a photo, get an English diary entry.<br />
                            Copy and paste to Instagram, note, or Twitter.
                        </>
                    )}
                </div>

                {/* Value Proposition */}
                {mode === 'demo' && (
                    <div style={{
                        marginTop: '32px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #dbdbdb',
                    }}>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#262626',
                            marginBottom: '12px',
                        }}>
                            Why this works
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: '#8e8e8e',
                            lineHeight: '1.8',
                        }}>
                            You already take photos of your life.<br />
                            You already want to share them.<br />
                            Now you can do it in English.<br />
                            <span style={{ color: '#262626' }}>No studying. Just posting.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
