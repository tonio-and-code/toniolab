'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { V3_SEEDS } from '@/data/english/goroku-v3-seed';
import { V3_META_CATEGORIES, V3_SCENES, DAY_REMAP } from '@/data/english/goroku-v3-scenes';

const META_CATEGORIES = V3_META_CATEGORIES;
const SCENES = V3_SCENES;

// ── 4-Level System ──
const LEVELS = [
    { key: 'core',  label: 'Core',  ja: '核',   desc: '最短の型',         color: '#78716C' },
    { key: 'vibe',  label: 'Vibe',  ja: '空気', desc: '感情込み',         color: '#D4AF37' },
    { key: 'scene', label: 'Scene', ja: '場面', desc: '実際の一言',       color: '#10B981' },
    { key: 'flow',  label: 'Flow',  ja: '流れ', desc: 'ネイティブの脳内', color: '#3B82F6' },
] as const;

// ── Types ──
interface V3Entry {
    id: string;
    day_slot: number;
    japanese: string;
    english: string[];
    context: string;
    mastery_level: number;
}

function buildV3Entries(): V3Entry[] {
    const counters: Record<number, number> = {};
    return V3_SEEDS.map(seed => {
        const newDay = DAY_REMAP[seed.daySlot] ?? seed.daySlot;
        const idx = counters[newDay] || 0;
        counters[newDay] = idx + 1;
        return {
            id: `v3_d${String(newDay).padStart(2, '0')}_${idx}`,
            day_slot: newDay,
            japanese: seed.japanese,
            english: seed.english,
            context: seed.context,
            mastery_level: 0,
        };
    });
}

// ── Persistence ──
const MASTERY_KEY = 'goroku-v3-mastery';

function loadMastery(): Record<string, number> {
    try {
        const saved = localStorage.getItem(MASTERY_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
}

function saveMastery(mastery: Record<string, number>) {
    try { localStorage.setItem(MASTERY_KEY, JSON.stringify(mastery)); } catch { /* ignore */ }
}

// ── Component ──
export default function GorokuV3Page() {
    const [entries, setEntries] = useState<V3Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const todayDay = Math.min(new Date().getDate(), 31);
    const todayMeta = META_CATEGORIES.find(m => m.days.includes(todayDay))?.key || 'connect';
    const [selectedDay, setSelectedDay] = useState<number>(todayDay);
    const [selectedMeta, setSelectedMeta] = useState<string>(todayMeta);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [levelMap, setLevelMap] = useState<Record<string, number>>({});
    const [globalLevel, setGlobalLevel] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const sceneStripRef = useRef<HTMLDivElement>(null);

    // ── DB Registration ──
    const [registeredPhrases, setRegisteredPhrases] = useState<Set<string>>(new Set());
    const [loadingPhrases, setLoadingPhrases] = useState(true);
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [batchRegistering, setBatchRegistering] = useState(false);
    const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const calDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const calFirstDay = new Date(viewYear, viewMonth, 1).getDay();
    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
    const calMonthLabel = new Date(viewYear, viewMonth).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

    const selectDayFromCalendar = (d: number) => {
        const slot = Math.min(d, 31);
        const meta = META_CATEGORIES.find(m => m.days.includes(slot));
        if (meta) setSelectedMeta(meta.key);
        setSelectedDay(slot);
        setShowCalendar(false);
        setExpandedId(null);
    };

    useEffect(() => {
        const allEntries = buildV3Entries();
        const mastery = loadMastery();
        setEntries(allEntries.map(e => ({ ...e, mastery_level: mastery[e.id] || 0 })));
        setLoading(false);
    }, []);

    // Fetch registered phrases from daily phrases DB
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/phrases');
                if (res.ok) {
                    const data = await res.json();
                    const set = new Set<string>();
                    (data.phrases || []).forEach((p: { english: string }) => set.add(p.english.toLowerCase()));
                    setRegisteredPhrases(set);
                }
            } catch { /* silently fail */ }
            setLoadingPhrases(false);
        })();
    }, []);

    const isRegistered = useCallback((phrase: string) => {
        return registeredPhrases.has(phrase.toLowerCase());
    }, [registeredPhrases]);

    const registerPhrase = useCallback(async (entry: V3Entry) => {
        const english = Array.isArray(entry.english) ? entry.english : [entry.english];
        const phrase = english[1] || english[0];
        if (isRegistered(phrase) || registeringId === entry.id) return;
        setRegisteringId(entry.id);
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: phrase,
                    japanese: entry.japanese,
                    category: 'goroku',
                    date: today,
                }),
            });
            if (res.ok || res.status === 409) {
                setRegisteredPhrases(prev => new Set(prev).add(phrase.toLowerCase()));
            }
        } finally {
            setRegisteringId(null);
        }
    }, [isRegistered, registeringId]);

    const batchRegisterRef = useRef<(dayEntries: V3Entry[]) => Promise<void>>(async () => {});
    batchRegisterRef.current = async (dayEntries: V3Entry[]) => {
        if (batchRegistering) return;
        const unregistered = dayEntries.filter(e => {
            const eng = Array.isArray(e.english) ? e.english : [e.english];
            return !isRegistered(eng[1] || eng[0]);
        });
        if (unregistered.length === 0) return;
        setBatchRegistering(true);
        setBatchProgress({ current: 0, total: unregistered.length });
        for (let i = 0; i < unregistered.length; i++) {
            const entry = unregistered[i];
            const eng = Array.isArray(entry.english) ? entry.english : [entry.english];
            const phrase = eng[1] || eng[0];
            setBatchProgress({ current: i + 1, total: unregistered.length });
            try {
                const today = new Date().toISOString().split('T')[0];
                const res = await fetch('/api/phrases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        english: phrase,
                        japanese: entry.japanese,
                        category: 'goroku',
                        date: today,
                    }),
                });
                if (res.ok || res.status === 409) {
                    setRegisteredPhrases(prev => new Set(prev).add(phrase.toLowerCase()));
                }
            } catch { /* continue */ }
        }
        setBatchRegistering(false);
        setBatchProgress(null);
    };

    // Scroll scene strip to selected day
    useEffect(() => {
        if (sceneStripRef.current) {
            const btn = sceneStripRef.current.querySelector(`[data-day="${selectedDay}"]`) as HTMLElement;
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [selectedDay]);

    const byDay = useMemo(() => {
        const map: Record<number, V3Entry[]> = {};
        entries.forEach(e => {
            if (!map[e.day_slot]) map[e.day_slot] = [];
            map[e.day_slot].push(e);
        });
        return map;
    }, [entries]);

    const selectedEntries = byDay[selectedDay] || [];
    const currentScene = SCENES[selectedDay];
    const currentMeta = META_CATEGORIES.find(m => m.key === selectedMeta);
    const scenesInMeta = currentMeta?.days.map(d => SCENES[d]) || [];

    const totalMastered = entries.filter(e => e.mastery_level >= 3).length;
    const totalEntries = entries.length;

    const speak = useCallback((text: string, id: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes('Samantha'))
            || voices.find(v => v.lang === 'en-US' && v.localService);
        if (preferred) utterance.voice = preferred;
        setPlayingId(id);
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
    }, []);

    const toggleLearned = useCallback((entry: V3Entry) => {
        const next = entry.mastery_level >= 3 ? 0 : 3;
        setEntries(prev => prev.map(e =>
            e.id === entry.id ? { ...e, mastery_level: next } : e
        ));
        const mastery = loadMastery();
        mastery[entry.id] = next;
        saveMastery(mastery);
    }, []);

    const getDisplayText = useCallback((entry: V3Entry): string => {
        const arr = Array.isArray(entry.english) ? entry.english : [entry.english];
        const lvl = globalLevel ?? levelMap[entry.id] ?? 1;
        return arr[lvl] || arr[1] || arr[0];
    }, [levelMap, globalLevel]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF9' }}>
                <span style={{ color: '#A8A29E', fontSize: '13px' }}>Loading...</span>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FAFAF9',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            maxWidth: '100vw',
            overflowX: 'hidden',
        }}>
            {/* ── Header ── */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: 'rgba(250,250,249,0.92)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #F5F5F4',
            }}>
                <div style={{
                    maxWidth: '640px', margin: '0 auto',
                    padding: '12px 12px 0',
                }}>
                    {/* Title */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                        marginBottom: '14px',
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '18px', fontWeight: '800', color: '#1C1917',
                                letterSpacing: '-0.5px', margin: 0,
                            }}>
                                310 Phrases
                            </h1>
                            <p style={{
                                fontSize: '11px', color: '#A8A29E', margin: '2px 0 0',
                                letterSpacing: '0.3px',
                            }}>
                                5 functions / 31 scenes / all of daily life
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37' }}>
                                {totalMastered}<span style={{ color: '#D6D3D1', fontWeight: '400' }}>/{totalEntries || 310}</span>
                            </div>
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                style={{
                                    width: '32px', height: '32px',
                                    borderRadius: '8px', border: '1px solid #E7E5E4',
                                    backgroundColor: showCalendar ? '#1C1917' : '#fff',
                                    color: showCalendar ? '#fff' : '#78716C',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '14px',
                                    transition: 'all 0.15s',
                                }}
                                title="Calendar"
                            >
                                {'\u2630'}
                            </button>
                        </div>
                    </div>

                    {/* Calendar overlay */}
                    {showCalendar && (
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #E7E5E4',
                            padding: '12px',
                            marginBottom: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        }}>
                            {/* Month nav */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: '10px',
                            }}>
                                <button onClick={() => {
                                    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
                                    else setViewMonth(m => m - 1);
                                }} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: '16px', color: '#78716C', padding: '4px 8px',
                                }}>{'<'}</button>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1C1917' }}>
                                    {calMonthLabel}
                                </span>
                                <button onClick={() => {
                                    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
                                    else setViewMonth(m => m + 1);
                                }} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: '16px', color: '#78716C', padding: '4px 8px',
                                }}>{'>'}</button>
                            </div>
                            {/* Weekday headers */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(w => (
                                    <div key={w} style={{
                                        textAlign: 'center', fontSize: '9px', fontWeight: '600',
                                        color: '#A8A29E', padding: '2px 0',
                                    }}>{w}</div>
                                ))}
                            </div>
                            {/* Date grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                {Array.from({ length: calFirstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: calDaysInMonth }, (_, i) => i + 1).map(d => {
                                    const slot = Math.min(d, 31);
                                    const scene = SCENES[slot];
                                    const meta = META_CATEGORIES.find(m => m.days.includes(slot));
                                    const isSelected = d === selectedDay && isCurrentMonth;
                                    const isToday = d === todayDay && isCurrentMonth;
                                    const dayEntries = byDay[slot] || [];
                                    const hasMastered = dayEntries.some(e => e.mastery_level >= 3);
                                    const allMastered = dayEntries.length > 0 && dayEntries.every(e => e.mastery_level >= 3);

                                    return (
                                        <button
                                            key={d}
                                            onClick={() => selectDayFromCalendar(d)}
                                            style={{
                                                padding: '4px 2px',
                                                borderRadius: '8px',
                                                border: isToday ? `1.5px solid ${meta?.color || '#D4AF37'}` : 'none',
                                                backgroundColor: isSelected ? '#1C1917' : 'transparent',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.1s',
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '12px', fontWeight: isSelected || isToday ? '700' : '500',
                                                color: isSelected ? '#fff' : '#1C1917',
                                            }}>
                                                {d}
                                            </div>
                                            <div style={{
                                                fontSize: '8px',
                                                color: isSelected ? 'rgba(255,255,255,0.7)' : (meta?.color || '#A8A29E'),
                                                lineHeight: 1.2,
                                                marginTop: '1px',
                                            }}>
                                                {scene?.title || ''}
                                            </div>
                                            {dayEntries.length > 0 && (
                                                <div style={{
                                                    width: '4px', height: '4px', borderRadius: '50%',
                                                    backgroundColor: allMastered ? '#D4AF37' : hasMastered ? '#E7E5E4' : '#D6D3D1',
                                                    margin: '2px auto 0',
                                                }} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Today button */}
                            {!isCurrentMonth && (
                                <button onClick={() => {
                                    setViewYear(now.getFullYear());
                                    setViewMonth(now.getMonth());
                                }} style={{
                                    width: '100%', marginTop: '8px',
                                    padding: '6px', borderRadius: '8px',
                                    border: '1px solid #E7E5E4', backgroundColor: '#FAFAF9',
                                    color: '#78716C', fontSize: '11px', fontWeight: '600',
                                    cursor: 'pointer',
                                }}>
                                    Today
                                </button>
                            )}
                        </div>
                    )}

                    {/* Meta category tabs */}
                    <div style={{
                        display: 'flex', gap: '2px',
                        marginBottom: '10px',
                    }}>
                        {META_CATEGORIES.map(meta => {
                            const isActive = selectedMeta === meta.key;
                            return (
                                <button
                                    key={meta.key}
                                    onClick={() => {
                                        setSelectedMeta(meta.key);
                                        setSelectedDay(meta.days[0]);
                                        setExpandedId(null);
                                    }}
                                    style={{
                                        flex: 1, padding: '8px 4px',
                                        border: 'none', cursor: 'pointer',
                                        borderRadius: '8px',
                                        backgroundColor: isActive ? meta.color : 'transparent',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <div style={{
                                        fontSize: '9px', fontWeight: '800',
                                        color: isActive ? '#fff' : '#A8A29E',
                                        letterSpacing: '1px',
                                    }}>
                                        {meta.label}
                                    </div>
                                    <div style={{
                                        fontSize: '10px', fontWeight: '600',
                                        color: isActive ? 'rgba(255,255,255,0.8)' : '#D6D3D1',
                                        marginTop: '1px',
                                    }}>
                                        {meta.ja}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Scene strip within selected meta */}
                    <div
                        ref={sceneStripRef}
                        style={{
                            display: 'flex', gap: '4px',
                            paddingBottom: '10px',
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                        }}
                    >
                        {scenesInMeta.map(scene => {
                            if (!scene) return null;
                            const isSelected = scene.day === selectedDay;
                            const dayEntries = byDay[scene.day] || [];
                            const masteredCount = dayEntries.filter(e => e.mastery_level >= 3).length;
                            const allMastered = dayEntries.length > 0 && masteredCount === dayEntries.length;

                            return (
                                <button
                                    key={scene.day}
                                    data-day={scene.day}
                                    onClick={() => { setSelectedDay(scene.day); setExpandedId(null); }}
                                    style={{
                                        padding: '5px 10px',
                                        borderRadius: '10px',
                                        border: isSelected
                                            ? `1.5px solid ${currentMeta?.color || '#D4AF37'}`
                                            : '1px solid #E7E5E4',
                                        backgroundColor: isSelected ? '#fff' : 'transparent',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <div style={{
                                        fontSize: '13px', fontWeight: '700',
                                        color: isSelected ? '#1C1917' : '#78716C',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {scene.title}
                                    </div>
                                    <div style={{
                                        fontSize: '9px',
                                        color: isSelected ? (currentMeta?.color || '#D4AF37') : '#A8A29E',
                                        marginTop: '1px',
                                    }}>
                                        {scene.subtitle}
                                        {allMastered && <span style={{ marginLeft: '4px', color: '#D4AF37' }}>{'\u2713'}</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{
                maxWidth: '640px', margin: '0 auto',
                padding: '12px 12px 80px',
            }}>
                {/* Scene header */}
                {currentScene && (
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'baseline', gap: '8px',
                            marginBottom: '4px',
                        }}>
                            <span style={{
                                fontSize: '22px', fontWeight: '800', color: '#1C1917',
                            }}>
                                {currentScene.title}
                            </span>
                            <span style={{
                                fontSize: '13px', fontWeight: '600',
                                color: currentMeta?.color || '#78716C',
                            }}>
                                {currentScene.subtitle}
                            </span>
                        </div>
                        <p style={{
                            fontSize: '12px', color: '#78716C', margin: 0,
                            lineHeight: 1.6,
                        }}>
                            {currentScene.description}
                        </p>
                    </div>
                )}

                {/* Registration bar */}
                {(() => {
                    const regCount = selectedEntries.filter(e => {
                        const eng = Array.isArray(e.english) ? e.english : [e.english];
                        return isRegistered(eng[1] || eng[0]);
                    }).length;
                    const unregCount = selectedEntries.length - regCount;
                    return selectedEntries.length > 0 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '8px 12px', marginBottom: '10px',
                            backgroundColor: '#fff', borderRadius: '10px',
                            border: '1px solid #F5F5F4',
                        }}>
                            <span style={{ fontSize: '12px', color: '#78716C' }}>
                                {loadingPhrases ? '...' : (
                                    <><span style={{ fontWeight: '700', color: '#10B981' }}>{regCount}</span> / {selectedEntries.length} registered</>
                                )}
                            </span>
                            {!loadingPhrases && unregCount > 0 && (
                                <button
                                    onClick={() => batchRegisterRef.current(selectedEntries)}
                                    disabled={batchRegistering}
                                    style={{
                                        padding: '5px 14px', borderRadius: '8px',
                                        border: 'none', cursor: batchRegistering ? 'default' : 'pointer',
                                        backgroundColor: '#10B981', color: '#fff',
                                        fontSize: '11px', fontWeight: '700',
                                        opacity: batchRegistering ? 0.6 : 1,
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {batchRegistering && batchProgress
                                        ? `${batchProgress.current}/${batchProgress.total}`
                                        : `Register All (${unregCount})`}
                                </button>
                            )}
                            {!loadingPhrases && unregCount === 0 && (
                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#10B981' }}>All registered</span>
                            )}
                        </div>
                    );
                })()}

                {/* Level toggle */}
                <div style={{
                    display: 'flex', gap: '2px', marginBottom: '14px',
                    backgroundColor: '#F5F5F4', borderRadius: '8px', padding: '3px',
                }}>
                    {LEVELS.map((lv, i) => {
                        const isActive = globalLevel === i;
                        return (
                            <button
                                key={lv.key}
                                onClick={() => setGlobalLevel(isActive ? null : i)}
                                style={{
                                    flex: 1, textAlign: 'center',
                                    padding: '5px 0',
                                    borderRadius: '6px',
                                    border: 'none', cursor: 'pointer',
                                    backgroundColor: isActive ? '#fff' : 'transparent',
                                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <div style={{
                                    fontSize: '10px', fontWeight: '700',
                                    color: isActive ? lv.color : '#A8A29E',
                                    letterSpacing: '0.5px',
                                }}>
                                    {lv.label}
                                </div>
                                <div style={{
                                    fontSize: '9px',
                                    color: isActive ? '#78716C' : '#D6D3D1',
                                }}>
                                    {lv.desc}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedEntries.length === 0 && (
                        <div style={{
                            textAlign: 'center', padding: '60px 20px',
                            color: '#D6D3D1',
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }}>
                                {currentScene?.title || ''}
                            </div>
                            <div style={{ fontSize: '13px' }}>
                                Coming soon -- 10 expressions for this scene
                            </div>
                        </div>
                    )}
                    {selectedEntries.map((entry) => {
                        const isPlaying = playingId === entry.id;
                        const learned = entry.mastery_level >= 3;
                        const currentLevel = globalLevel ?? levelMap[entry.id] ?? 1;
                        const englishArr = Array.isArray(entry.english) ? entry.english : [entry.english];
                        const maxLevel = englishArr.length - 1;
                        const displayText = getDisplayText(entry);
                        const levelInfo = LEVELS[currentLevel] || LEVELS[1];
                        const isFlow = currentLevel === 3;
                        const isExpanded = expandedId === entry.id;

                        return (
                            <div
                                key={entry.id}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '14px',
                                    border: isPlaying
                                        ? `1.5px solid ${currentMeta?.color || '#D4AF37'}`
                                        : '1px solid #F5F5F4',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s',
                                    opacity: learned ? 0.55 : 1,
                                }}
                            >
                                <div style={{ padding: '12px 12px 8px' }}>
                                    {/* Japanese */}
                                    <div style={{
                                        fontSize: '16px', fontWeight: '800', color: '#1C1917',
                                        lineHeight: 1.4, marginBottom: '6px',
                                    }}>
                                        {entry.japanese}
                                    </div>

                                    {/* English (tap to cycle) */}
                                    <div
                                        onClick={() => {
                                            setLevelMap(prev => ({
                                                ...prev,
                                                [entry.id]: ((prev[entry.id] ?? 1) + 1) % (maxLevel + 1),
                                            }));
                                            if (globalLevel !== null) setGlobalLevel(null);
                                        }}
                                        style={{ cursor: 'pointer', marginBottom: '8px' }}
                                    >
                                        <div style={{
                                            fontSize: isFlow ? '12px' : '14px',
                                            fontWeight: '600',
                                            color: levelInfo.color,
                                            lineHeight: isFlow ? 1.8 : 1.5,
                                            transition: 'all 0.2s',
                                        }}>
                                            {displayText}
                                        </div>
                                    </div>

                                    {/* Level dots + label + actions */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                            {englishArr.map((_, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        setLevelMap(prev => ({ ...prev, [entry.id]: i }));
                                                        if (globalLevel !== null) setGlobalLevel(null);
                                                    }}
                                                    style={{
                                                        width: i === currentLevel ? '16px' : '6px',
                                                        height: '6px',
                                                        borderRadius: '3px',
                                                        backgroundColor: i === currentLevel
                                                            ? (LEVELS[i]?.color || '#D4AF37')
                                                            : '#E7E5E4',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span style={{
                                            fontSize: '9px', fontWeight: '600',
                                            color: levelInfo.color,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                        }}>
                                            {levelInfo.label}
                                        </span>
                                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => speak(displayText, entry.id)}
                                                style={{
                                                    width: '28px', height: '28px',
                                                    borderRadius: '50%', border: 'none',
                                                    cursor: 'pointer',
                                                    backgroundColor: isPlaying ? '#1C1917' : '#F5F5F4',
                                                    color: isPlaying ? '#fff' : '#78716C',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '11px',
                                                    transition: 'all 0.15s',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {isPlaying ? '\u25A0' : '\u25B6'}
                                            </button>
                                            <button
                                                onClick={() => toggleLearned(entry)}
                                                style={{
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    fontSize: '18px', padding: '0 2px',
                                                    color: learned ? '#D4AF37' : '#E7E5E4',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                {learned ? '\u2713' : '\u25CB'}
                                            </button>
                                            {(() => {
                                                const vibePhrase = englishArr[1] || englishArr[0];
                                                const registered = isRegistered(vibePhrase);
                                                const isReg = registeringId === entry.id;
                                                return (
                                                    <button
                                                        onClick={() => registerPhrase(entry)}
                                                        disabled={registered || isReg}
                                                        style={{
                                                            padding: '2px 8px', borderRadius: '6px',
                                                            border: registered ? '1px solid #D1FAE5' : '1px solid #E7E5E4',
                                                            backgroundColor: registered ? '#ECFDF5' : '#fff',
                                                            color: registered ? '#10B981' : isReg ? '#A8A29E' : '#78716C',
                                                            fontSize: '9px', fontWeight: '700',
                                                            cursor: registered || isReg ? 'default' : 'pointer',
                                                            transition: 'all 0.15s',
                                                            letterSpacing: '0.3px',
                                                        }}
                                                    >
                                                        {registered ? 'DB' : isReg ? '...' : '+DB'}
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Context */}
                                <div
                                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                    style={{
                                        borderTop: '1px solid #F5F5F4',
                                        padding: isExpanded ? '8px 12px 12px' : '6px 12px',
                                        cursor: 'pointer',
                                        backgroundColor: isExpanded ? '#FAFAF9' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {isExpanded ? (
                                        <div style={{
                                            fontSize: '12px', color: '#57534E',
                                            lineHeight: 1.8,
                                        }}>
                                            {entry.context}
                                        </div>
                                    ) : (
                                        <div style={{
                                            fontSize: '11px', color: '#A8A29E',
                                            whiteSpace: 'nowrap', overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {entry.context}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
