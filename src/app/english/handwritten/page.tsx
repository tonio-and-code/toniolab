'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Note {
    date: string;
    images: string[];
    description?: string;
}

const notes: Note[] = [
    {
        date: '2026-01-12',
        images: [
            'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/cfb6bd17-6732-4ec8-82f7-abff6ca44600/public',
            'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/a9ad8ec0-5cdd-4f8d-88fa-920ca5677400/public',
            'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/f1699065-287a-4fc0-c5f3-6905de2ded00/public'
        ],
        description: '最初の手書きノート一式。デジタル全盛の時代にあえてアナログで書くことの「科学的」な効用を検証中。'
    }
];

export default function HandwrittenNotesPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [secretClickCount, setSecretClickCount] = useState(0);
    const [isDomainExpansion, setIsDomainExpansion] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showScience, setShowScience] = useState(false);

    const handleSecretClick = () => {
        const newCount = secretClickCount + 1;
        setSecretClickCount(newCount);
        if (newCount >= 3) {
            setIsDomainExpansion(true);
            setSecretClickCount(0);
        }
    };

    // Create a map of date -> notes for quick lookup
    const notesByDate = useMemo(() => {
        const map = new Map<string, Note>();
        notes.forEach(note => {
            map.set(note.date, note);
        });
        return map;
    }, []);

    // Calendar helper functions
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
        setSelectedDay(null);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDay(null);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    // Generate calendar days
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const today = new Date();
    const isToday = (day: number) => {
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    const getNoteForDay = (day: number): Note | undefined => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return notesByDate.get(dateKey);
    };

    const selectedNote = selectedDay ? getNoteForDay(selectedDay) : null;

    return (
        <div style={{ padding: '16px 24px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Introduction / Meta Context */}
                <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h1 style={{ fontSize: '20px', marginBottom: '6px', color: '#10b981' }}>
                        Subject Note: Analog Experiment
                    </h1>
                    <p style={{ lineHeight: '1.5', color: '#666', marginBottom: '0', fontSize: '13px' }}>
                        「俺はもう英語に興味がないけど、自分が実験台にならないといけないからやってる。」
                    </p>
                </div>

                {/* Calendar Section */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    marginBottom: '24px'
                }}>
                    {/* Month Navigation */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={() => navigateMonth('prev')}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                padding: '8px 12px',
                                color: '#888'
                            }}
                        >
                            ‹
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e' }}>
                                {monthNames[month]} {year}
                            </div>
                            <button
                                onClick={goToToday}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '12px',
                                    color: '#D4AF37',
                                    cursor: 'pointer',
                                    marginTop: '4px'
                                }}
                            >
                                Today
                            </button>
                        </div>
                        <button
                            onClick={() => navigateMonth('next')}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                padding: '8px 12px',
                                color: '#888'
                            }}
                        >
                            ›
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                        marginBottom: '8px'
                    }}>
                        {dayNames.map((day, index) => (
                            <div
                                key={day}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '11px',
                                    color: index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : '#666',
                                    fontWeight: '500',
                                    padding: '4px 0'
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px'
                    }}>
                        {calendarDays.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} style={{ aspectRatio: '1', padding: '4px' }} />;
                            }

                            const dayNote = getNoteForDay(day);
                            const hasNote = !!dayNote;
                            const isTodayDate = isToday(day);
                            const isSelected = selectedDay === day;
                            const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
                            const isSunday = dayOfWeek === 0;
                            const isSaturday = dayOfWeek === 6;

                            return (
                                <div
                                    key={day}
                                    onClick={() => hasNote && setSelectedDay(isSelected ? null : day)}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        cursor: hasNote ? 'pointer' : 'default',
                                        backgroundColor: isSelected ? '#D4AF37' : isTodayDate ? '#fffdf5' : 'transparent',
                                        border: isTodayDate && !isSelected ? '2px solid #D4AF37' : '1px solid transparent',
                                        position: 'relative',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: hasNote ? '600' : '400',
                                        color: isSelected ? '#000' : isSunday ? '#ef4444' : isSaturday ? '#3b82f6' : '#1a1a2e'
                                    }}>
                                        {day}
                                    </span>
                                    {hasNote && (
                                        <div style={{
                                            marginTop: '2px',
                                            fontSize: '10px',
                                            color: isSelected ? '#000' : '#D4AF37'
                                        }}>
                                            ✎
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Day Note */}
                {selectedDay && selectedNote && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px'
                        }}>
                            <span style={{
                                backgroundColor: '#D4AF37',
                                color: '#000',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}>
                                {month + 1}/{selectedDay}
                            </span>
                            <span style={{ fontSize: '14px', color: '#888' }}>
                                {selectedNote.images.length} pages
                            </span>
                        </div>

                        {/* Image Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                            {selectedNote.images.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    style={{
                                        aspectRatio: '3/4',
                                        backgroundColor: '#222',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: '1px solid #333',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`Note ${selectedNote.date} - ${i + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        right: '4px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: '#fff',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '9px'
                                    }}>
                                        {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedNote.description && (
                            <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', margin: 0 }}>
                                {selectedNote.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                                {notes.length}
                            </div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Sessions</div>
                        </div>
                        <div style={{ width: '1px', backgroundColor: '#e5e5e5' }} />
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                                {notes.reduce((sum, n) => sum + n.images.length, 0)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Pages</div>
                        </div>
                    </div>
                </div>

                {/* Scientific Explanation Toggle */}
                <button
                    onClick={() => setShowScience(!showScience)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#fff',
                        border: '1px solid #e5e5e5',
                        borderRadius: '12px',
                        color: '#666',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                >
                    <span onClick={(e) => { e.stopPropagation(); handleSecretClick(); }} style={{ cursor: 'help' }}>
                        {showScience ? '▼' : '▶'}
                    </span>
                    Why Handwriting? (Scientific Reason)
                </button>

                {/* Scientific Explanation Section (Collapsible) */}
                {showScience && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '3px solid #10b981', border: '1px solid #e5e5e5' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#1a1a2e' }}>1. Superior Memory Retention</h3>
                                <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.5', margin: 0 }}>
                                    手書きは文字ごとの複雑な運動を伴い、脳（RAS）を刺激して情報を「重要」と認識させます。
                                </p>
                            </div>

                            <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '3px solid #10b981', border: '1px solid #e5e5e5' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#1a1a2e' }}>2. Deepening Understanding</h3>
                                <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.5', margin: 0 }}>
                                    全てを瞬時に記録できない不便さが、脳に「要約」と「取捨選択」を強制します。
                                </p>
                            </div>

                            <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '3px solid #10b981', border: '1px solid #e5e5e5' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#1a1a2e' }}>3. Emotion & Context Preservation</h3>
                                <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.5', margin: 0 }}>
                                    筆跡には当時の熱量が残り、未来の自分への最強の復習材料となります。
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Full size note"
                        style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                    />
                    <button
                        style={{
                            position: 'absolute', top: '20px', right: '20px',
                            background: 'none', border: 'none', color: '#fff', fontSize: '32px', cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Domain Expansion Overlay */}
            {isDomainExpansion && (
                <div
                    onClick={() => setIsDomainExpansion(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: '#000',
                        zIndex: 2000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.5s ease-out',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'url(https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/dba6816d-90b8-4472-f5c2-f22ea22b6e00/public)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.6
                    }} />
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '24px' }}>
                        <h1 style={{
                            fontSize: '48px', fontWeight: 'bold', color: '#fff',
                            textShadow: '0 0 20px #a855f7, 0 0 40px #a855f7',
                            marginBottom: '16px',
                            fontFamily: 'serif'
                        }}>
                            領域展開
                        </h1>
                        <h2 style={{
                            fontSize: '24px', color: '#d8b4fe',
                            letterSpacing: '0.2em',
                            textShadow: '0 0 10px rgba(0,0,0,0.8)'
                        }}>
                            無量空処
                        </h2>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
