"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import * as d3Geo from 'd3-geo';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Loader2, ZoomIn, ZoomOut, RotateCcw, X, Volume2, ChevronRight, Sparkles, MapPin, BookOpen, BookmarkPlus } from 'lucide-react';
import { getStateVibe, type StateExpression } from '../../../data/state-vibes';

// --- Colors ---
const COLOR_UNVISITED = '#E8E5DE';
const COLOR_IN_PROGRESS = '#F6C85F';
const COLOR_COMPLETE = '#D4AF37';
const COLOR_HOVER = '#10B981';
const COLOR_SELECTED = '#F97316';

// Territories to exclude
const EXCLUDED_NAMES = new Set([
    'American Samoa', 'Guam',
    'Commonwealth of the Northern Mariana Islands',
    'Puerto Rico', 'United States Virgin Islands',
]);

// Progress stored per state: array of booleans for each expression
type StateProgress = Record<string, boolean[]>;

const STORAGE_KEY = 'us-map-conquest';

export default function USMapPage() {
    const [features, setFeatures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredState, setHoveredState] = useState<any | null>(null);
    const [selectedState, setSelectedState] = useState<any | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [progress, setProgress] = useState<StateProgress>({});
    const [panelOpen, setPanelOpen] = useState(false);
    const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
    const [missionTarget, setMissionTarget] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
    const [registerSaving, setRegisterSaving] = useState<string | null>(null);

    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);

    // Load data
    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });

        import('../../../data/us-states-10m.json')
            .then((data: any) => {
                const topoData = data.default || data;
                // @ts-ignore
                const states = topojson.feature(topoData, topoData.objects.states);
                // @ts-ignore
                const filtered = states.features.filter((f: any) => !EXCLUDED_NAMES.has(f.properties?.name));
                setFeatures(filtered);
                setLoading(false);
            })
            .catch(err => console.error(err));

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setProgress(JSON.parse(saved));
        } catch (e) { }

        // Load voices
        const loadVoices = () => {
            const all = window.speechSynthesis.getVoices();
            setVoices(all.filter(v => v.lang.startsWith('en')));
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => { window.speechSynthesis.cancel(); };
    }, []);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Save progress
    const saveProgress = useCallback((newProgress: StateProgress) => {
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }, []);

    // Projection - geoAlbersUsa includes Alaska/Hawaii insets
    const projection = useMemo(() => {
        const panelWidth = panelOpen ? 420 : 0;
        const mapWidth = dimensions.width - panelWidth;
        return d3Geo.geoAlbersUsa()
            .fitExtent(
                [[40, 80], [mapWidth - 40, dimensions.height - 60]],
                { type: "FeatureCollection", features: features.length ? features : [] } as any
            );
    }, [dimensions, features, panelOpen]);

    const pathGenerator = useMemo(() => {
        return d3Geo.geoPath().projection(projection);
    }, [projection]);

    // Zoom
    useEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const zoom = d3Zoom.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .translateExtent([[-100, -100], [dimensions.width + 100, dimensions.height + 100]])
            .on('zoom', (event) => {
                if (gRef.current) d3Selection.select(gRef.current as any).attr('transform', event.transform);
            });

        d3Selection.select(svgRef.current).call(zoom);
    }, [dimensions, loading]);

    const handleZoom = (factor: number) => {
        if (!svgRef.current) return;
        (d3Selection.select(svgRef.current) as any).transition().duration(500).call((d3Zoom.zoom() as any).scaleBy, factor);
    };

    const handleReset = () => {
        if (!svgRef.current) return;
        (d3Selection.select(svgRef.current) as any).transition().duration(750).call((d3Zoom.zoom() as any).transform, d3Zoom.zoomIdentity);
    };

    // State color based on progress
    const getStateColor = (feature: any) => {
        const name = feature.properties?.name;
        const stateProgress = progress[name];
        if (!stateProgress) return COLOR_UNVISITED;
        const learned = stateProgress.filter(Boolean).length;
        if (learned === 0) return COLOR_UNVISITED;
        if (learned >= 5) return COLOR_COMPLETE;
        return COLOR_IN_PROGRESS;
    };

    const getStateStatus = (name: string) => {
        const p = progress[name];
        if (!p) return { learned: 0, total: 5, status: 'new' as const };
        const learned = p.filter(Boolean).length;
        return {
            learned,
            total: 5,
            status: learned >= 5 ? 'complete' as const : learned > 0 ? 'progress' as const : 'new' as const,
        };
    };

    // Click state -> open panel
    const onStateClick = (feature: any) => {
        setSelectedState(feature);
        setPanelOpen(true);
        setMissionTarget(null);
    };

    // Toggle expression mastery
    const toggleExpression = (stateName: string, idx: number) => {
        const current = progress[stateName] || [false, false, false, false, false];
        const updated = [...current];
        updated[idx] = !updated[idx];
        saveProgress({ ...progress, [stateName]: updated });
    };

    // Mark all expressions for a state
    const markAllLearned = (stateName: string) => {
        saveProgress({ ...progress, [stateName]: [true, true, true, true, true] });
    };

    // Reset state progress
    const resetState = (stateName: string) => {
        const newProgress = { ...progress };
        delete newProgress[stateName];
        saveProgress(newProgress);
    };

    // TTS
    const speak = (text: string, idx: number) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        const enVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (enVoice) utterance.voice = enVoice;

        setSpeakingIdx(idx);
        utterance.onend = () => setSpeakingIdx(null);
        utterance.onerror = () => setSpeakingIdx(null);
        window.speechSynthesis.speak(utterance);
    };

    // Save expression to vocabulary (ボキャブラリー)
    const saveToVocab = async (stateName: string, expr: StateExpression, idx: number) => {
        const key = `${stateName}-${idx}-vocab`;
        if (registerSaving === key) return;
        setRegisterSaving(key);
        try {
            const res = await fetch('/api/user-phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: expr.en,
                    type: 'expression',
                    meaning: expr.ja,
                    source: `US Map: ${stateName}`,
                }),
            });
            const data = await res.json();
            if (data.success || data.error === 'Phrase already in collection') {
                setRegisterSuccess(key);
                setTimeout(() => setRegisterSuccess(null), 2000);
            } else {
                alert(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Failed to save to vocabulary:', err);
        } finally {
            setRegisterSaving(null);
        }
    };

    // Save example sentence to daily phrases (デイリーフレーズ)
    const saveToPhrase = async (stateName: string, expr: StateExpression, idx: number) => {
        const key = `${stateName}-${idx}-phrase`;
        if (registerSaving === key) return;
        setRegisterSaving(key);
        try {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const res = await fetch('/api/phrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    english: expr.example,
                    japanese: `${expr.en}: ${expr.ja}`,
                    category: 'daily',
                    date: dateStr,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setRegisterSuccess(key);
                setTimeout(() => setRegisterSuccess(null), 2000);
            } else {
                alert(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Failed to save to phrases:', err);
        } finally {
            setRegisterSaving(null);
        }
    };

    // Random mission
    const handleRandomMission = () => {
        if (!features.length) return;
        const incomplete = features.filter(f => {
            const s = getStateStatus(f.properties?.name);
            return s.status !== 'complete';
        });
        if (incomplete.length === 0) return;

        const target = incomplete[Math.floor(Math.random() * incomplete.length)];
        setMissionTarget(target.properties?.name);
        setSelectedState(target);
        setPanelOpen(true);

        // Zoom to target
        if (svgRef.current) {
            const path = pathGenerator(target);
            if (!path) return;
            const bounds = pathGenerator.bounds(target);
            if (!bounds || !isFinite(bounds[0][0])) return;
            const dx = bounds[1][0] - bounds[0][0];
            const dy = bounds[1][1] - bounds[0][1];
            const x = (bounds[0][0] + bounds[1][0]) / 2;
            const y = (bounds[0][1] + bounds[1][1]) / 2;
            const scale = Math.max(1, Math.min(5, 0.8 / Math.max(dx / dimensions.width, dy / dimensions.height)));
            const translate = [dimensions.width / 2 - scale * x, dimensions.height / 2 - scale * y];

            (d3Selection.select(svgRef.current) as any).transition().duration(1200)
                .call(
                    (d3Zoom.zoom() as any).transform,
                    d3Zoom.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
                );
        }
    };

    // Stats
    const totalStates = features.length;
    const completedStates = features.filter(f => getStateStatus(f.properties?.name).status === 'complete').length;
    const inProgressStates = features.filter(f => getStateStatus(f.properties?.name).status === 'progress').length;
    const totalExpressions = totalStates * 5;
    const learnedExpressions = Object.values(progress).reduce((sum, arr) => sum + arr.filter(Boolean).length, 0);

    const todayKey = new Date().toISOString().split('T')[0];
    const todayCount = (() => {
        try {
            const todayData = localStorage.getItem(`us-map-daily-${todayKey}`);
            return todayData ? JSON.parse(todayData) : 0;
        } catch { return 0; }
    })();

    // Track daily when toggling
    const trackDaily = () => {
        try {
            const key = `us-map-daily-${todayKey}`;
            const current = localStorage.getItem(key);
            const count = current ? JSON.parse(current) + 1 : 1;
            localStorage.setItem(key, JSON.stringify(count));
        } catch { }
    };

    const toggleExpressionWithDaily = (stateName: string, idx: number) => {
        const current = progress[stateName] || [false, false, false, false, false];
        if (!current[idx]) trackDaily(); // Only count learning, not un-learning
        toggleExpression(stateName, idx);
    };

    // Rank
    const getRank = () => {
        const pct = totalStates > 0 ? (completedStates / totalStates) * 100 : 0;
        if (pct === 0 && inProgressStates === 0) return "Newcomer";
        if (pct < 10) return "Tourist";
        if (pct < 20) return "Road Tripper";
        if (pct < 35) return "Explorer";
        if (pct < 50) return "Adventurer";
        if (pct < 70) return "Pioneer";
        if (pct < 90) return "Pathfinder";
        return "All-American";
    };

    // Currently selected state data
    const selectedName = selectedState?.properties?.name;
    const selectedVibe = selectedName ? getStateVibe(selectedName) : null;
    const selectedStatus = selectedName ? getStateStatus(selectedName) : null;

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f8f6', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
                flexShrink: 0,
                zIndex: 20,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/english" style={{ textDecoration: 'none', color: '#888', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </Link>
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#e5e5e5' }} />
                    <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0, letterSpacing: '-0.3px' }}>
                        American Discovery
                    </h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Stats pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            padding: '4px 12px',
                            backgroundColor: completedStates > 0 ? '#FEF3C7' : '#f5f5f5',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: completedStates > 0 ? '#92400E' : '#888',
                        }}>
                            {completedStates}/{totalStates} states
                        </div>
                        <div style={{
                            padding: '4px 12px',
                            backgroundColor: learnedExpressions > 0 ? '#D1FAE5' : '#f5f5f5',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: learnedExpressions > 0 ? '#065F46' : '#888',
                        }}>
                            {learnedExpressions}/{totalExpressions} words
                        </div>
                        <div style={{
                            padding: '4px 12px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#D4AF37',
                            letterSpacing: '0.5px',
                        }}>
                            {getRank()}
                        </div>
                    </div>

                    {/* Next Journey button */}
                    <button
                        onClick={handleRandomMission}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            backgroundColor: '#D4AF37',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            letterSpacing: '0.3px',
                        }}
                    >
                        <Sparkles size={14} />
                        Next Journey
                    </button>

                    <Link href="/english/world-map-6" style={{
                        textDecoration: 'none',
                        color: '#888',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}>
                        <Globe size={14} />
                        World
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
                {/* Map area */}
                <div style={{ flex: 1, position: 'relative', cursor: 'move' }}>
                    {loading ? (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#888' }}>
                            <Loader2 size={20} className="animate-spin" />
                            <span style={{ fontSize: '14px' }}>Loading map...</span>
                        </div>
                    ) : (
                        <svg ref={svgRef} width={panelOpen ? dimensions.width - 420 : dimensions.width} height={dimensions.height - 56} style={{ width: '100%', height: '100%' }}>
                            <defs>
                                <filter id="state-shadow" x="-5%" y="-5%" width="110%" height="110%">
                                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.12" />
                                </filter>
                            </defs>
                            <g ref={gRef} filter="url(#state-shadow)">
                                {features.map((feature, i) => {
                                    const name = feature.properties?.name;
                                    const pathD = pathGenerator(feature);
                                    if (!pathD) return null;
                                    const isHovered = hoveredState?.properties?.name === name;
                                    const isSelected = selectedName === name;
                                    const status = getStateStatus(name);
                                    const baseColor = getStateColor(feature);

                                    return (
                                        <g key={`${name}-${i}`}
                                            onMouseEnter={() => setHoveredState(feature)}
                                            onMouseLeave={() => setHoveredState(null)}
                                            onClick={() => onStateClick(feature)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <path
                                                d={pathD}
                                                fill={isHovered ? (status.status === 'complete' ? '#E5C84B' : COLOR_HOVER) : baseColor}
                                                stroke={isSelected ? COLOR_SELECTED : '#fff'}
                                                strokeWidth={isSelected ? 2.5 : 0.8}
                                                style={{
                                                    transition: 'fill 0.2s, stroke 0.2s, stroke-width 0.2s',
                                                    filter: isSelected ? `drop-shadow(0 0 6px ${COLOR_SELECTED}80)` : 'none',
                                                }}
                                            />
                                            {/* Small dot for in-progress states */}
                                            {status.status === 'progress' && (() => {
                                                const centroid = pathGenerator.centroid(feature);
                                                if (!centroid || !isFinite(centroid[0])) return null;
                                                return (
                                                    <circle
                                                        cx={centroid[0]}
                                                        cy={centroid[1]}
                                                        r={3}
                                                        fill="#92400E"
                                                        opacity={0.7}
                                                        style={{ pointerEvents: 'none' }}
                                                    />
                                                );
                                            })()}
                                        </g>
                                    );
                                })}
                            </g>
                        </svg>
                    )}

                    {/* Zoom controls */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 10 }}>
                        <button onClick={() => handleZoom(1.5)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer', color: '#555' }}><ZoomIn size={16} /></button>
                        <button onClick={() => handleZoom(0.6)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer', color: '#555' }}><ZoomOut size={16} /></button>
                        <button onClick={handleReset} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer', color: '#555' }}><RotateCcw size={16} /></button>
                    </div>

                    {/* Hover tooltip */}
                    <AnimatePresence>
                        {hoveredState && !panelOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    border: '1px solid #e5e5e5',
                                    minWidth: '200px',
                                    pointerEvents: 'none',
                                    zIndex: 10,
                                }}
                            >
                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                                    {hoveredState.properties?.name}
                                </div>
                                {(() => {
                                    const vibe = getStateVibe(hoveredState.properties?.name);
                                    const status = getStateStatus(hoveredState.properties?.name);
                                    return (
                                        <>
                                            <div style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '600', marginBottom: '8px' }}>
                                                {vibe.vibe}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {[0, 1, 2, 3, 4].map(i => (
                                                    <div key={i} style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: status.learned > i ? '#D4AF37' : '#e5e5e5',
                                                    }} />
                                                ))}
                                                <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
                                                    {status.learned}/5
                                                </span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Mission target indicator */}
                    <AnimatePresence>
                        {missionTarget && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#F97316',
                                    color: '#fff',
                                    padding: '8px 20px',
                                    borderRadius: '24px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
                                    zIndex: 10,
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <MapPin size={14} />
                                NEXT STOP: {missionTarget}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Legend */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: panelOpen ? '440px' : '20px',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                        border: '1px solid #e5e5e5',
                        zIndex: 10,
                        transition: 'right 0.3s',
                    }}>
                        <div style={{ fontSize: '10px', color: '#888', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.5px' }}>LEGEND</div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#555' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: COLOR_UNVISITED }} />
                                Unvisited
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: COLOR_IN_PROGRESS }} />
                                In Progress
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: COLOR_COMPLETE }} />
                                Complete
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide-out lesson panel */}
                <AnimatePresence>
                    {panelOpen && selectedVibe && selectedName && (
                        <motion.div
                            initial={{ x: 420 }}
                            animate={{ x: 0 }}
                            exit={{ x: 420 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            style={{
                                width: '420px',
                                height: '100%',
                                backgroundColor: '#fff',
                                borderLeft: '1px solid #e5e5e5',
                                display: 'flex',
                                flexDirection: 'column',
                                flexShrink: 0,
                                position: 'relative',
                                zIndex: 15,
                            }}
                        >
                            {/* Panel header */}
                            <div style={{
                                padding: '20px 24px 16px',
                                borderBottom: '1px solid #f0f0f0',
                                flexShrink: 0,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.2 }}>
                                            {selectedName}
                                        </h2>
                                        <div style={{ fontSize: '13px', color: '#D4AF37', fontWeight: '600' }}>
                                            {selectedVibe.vibe}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setPanelOpen(false); setMissionTarget(null); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Progress dots */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <div key={i} style={{
                                            flex: 1,
                                            height: '4px',
                                            borderRadius: '2px',
                                            backgroundColor: (progress[selectedName]?.[i]) ? '#D4AF37' : '#e5e5e5',
                                            transition: 'background-color 0.3s',
                                        }} />
                                    ))}
                                    <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px', flexShrink: 0 }}>
                                        {selectedStatus?.learned || 0}/5
                                    </span>
                                </div>
                            </div>

                            {/* Scrollable content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                                {/* Cultural description */}
                                <div style={{
                                    padding: '16px 24px',
                                    backgroundColor: '#FAFAF8',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    <div style={{ fontSize: '10px', color: '#888', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                        ABOUT THIS STATE
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0 }}>
                                        {selectedVibe.description}
                                    </p>
                                </div>

                                {/* Expressions */}
                                <div style={{ padding: '16px 0' }}>
                                    <div style={{ padding: '0 24px 12px', fontSize: '10px', color: '#888', fontWeight: '600', letterSpacing: '0.5px' }}>
                                        LOCAL EXPRESSIONS
                                    </div>
                                    {selectedVibe.expressions.map((expr: StateExpression, idx: number) => {
                                        const isLearned = progress[selectedName]?.[idx] || false;
                                        const isSpeaking = speakingIdx === idx;

                                        return (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: '14px 24px',
                                                    borderBottom: idx < 4 ? '1px solid #f5f5f5' : 'none',
                                                    backgroundColor: isLearned ? '#FEFCE8' : 'transparent',
                                                    transition: 'background-color 0.2s',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                                    {/* Mastery toggle */}
                                                    <button
                                                        onClick={() => toggleExpressionWithDaily(selectedName, idx)}
                                                        style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '6px',
                                                            border: isLearned ? '2px solid #D4AF37' : '2px solid #ddd',
                                                            backgroundColor: isLearned ? '#D4AF37' : 'transparent',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                            marginTop: '2px',
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        {isLearned && (
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* Content */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                            <span style={{
                                                                fontSize: '16px',
                                                                fontWeight: '700',
                                                                color: isLearned ? '#92400E' : '#1a1a1a',
                                                            }}>
                                                                {expr.en}
                                                            </span>
                                                            {/* TTS button */}
                                                            <button
                                                                onClick={() => speak(expr.example, idx)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    color: isSpeaking ? '#D4AF37' : '#ccc',
                                                                    padding: '2px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Volume2 size={14} />
                                                            </button>
                                                        </div>
                                                        <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
                                                            {expr.ja}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            color: '#555',
                                                            lineHeight: '1.6',
                                                            fontStyle: 'italic',
                                                            backgroundColor: '#f8f8f6',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            borderLeft: '3px solid #e5e5e5',
                                                        }}>
                                                            &ldquo;{expr.example}&rdquo;
                                                        </div>
                                                        {/* Registration buttons */}
                                                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                                            <button
                                                                onClick={() => saveToVocab(selectedName, expr, idx)}
                                                                disabled={registerSaving === `${selectedName}-${idx}-vocab`}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    padding: '4px 10px',
                                                                    fontSize: '11px',
                                                                    fontWeight: '600',
                                                                    border: '1px solid #E0D4F5',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    backgroundColor: registerSuccess === `${selectedName}-${idx}-vocab` ? '#D1FAE5' : '#F5F3FF',
                                                                    color: registerSuccess === `${selectedName}-${idx}-vocab` ? '#065F46' : '#7C3AED',
                                                                    transition: 'all 0.2s',
                                                                }}
                                                            >
                                                                {registerSuccess === `${selectedName}-${idx}-vocab` ? (
                                                                    'OK'
                                                                ) : (
                                                                    <><BookmarkPlus size={12} />+Vocab</>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => saveToPhrase(selectedName, expr, idx)}
                                                                disabled={registerSaving === `${selectedName}-${idx}-phrase`}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    padding: '4px 10px',
                                                                    fontSize: '11px',
                                                                    fontWeight: '600',
                                                                    border: '1px solid #FDE68A',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    backgroundColor: registerSuccess === `${selectedName}-${idx}-phrase` ? '#D1FAE5' : '#FFFBEB',
                                                                    color: registerSuccess === `${selectedName}-${idx}-phrase` ? '#065F46' : '#92400E',
                                                                    transition: 'all 0.2s',
                                                                }}
                                                            >
                                                                {registerSuccess === `${selectedName}-${idx}-phrase` ? (
                                                                    'OK'
                                                                ) : (
                                                                    <><BookOpen size={12} />+Phrase</>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Panel footer */}
                            <div style={{
                                padding: '12px 24px',
                                borderTop: '1px solid #f0f0f0',
                                display: 'flex',
                                gap: '8px',
                                flexShrink: 0,
                                backgroundColor: '#FAFAF8',
                            }}>
                                {selectedStatus && selectedStatus.learned < 5 ? (
                                    <button
                                        onClick={() => {
                                            markAllLearned(selectedName);
                                            // Count remaining as daily
                                            const remaining = 5 - (selectedStatus?.learned || 0);
                                            for (let i = 0; i < remaining; i++) trackDaily();
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#D4AF37',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Mark All Learned
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => resetState(selectedName)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#fff',
                                            color: '#888',
                                            border: '1px solid #e5e5e5',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Reset Progress
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        // Find next unfinished state
                                        const currentIdx = features.findIndex(f => f.properties?.name === selectedName);
                                        for (let i = 1; i <= features.length; i++) {
                                            const next = features[(currentIdx + i) % features.length];
                                            const nextName = next?.properties?.name;
                                            if (nextName && getStateStatus(nextName).status !== 'complete') {
                                                setSelectedState(next);
                                                setMissionTarget(null);
                                                return;
                                            }
                                        }
                                    }}
                                    style={{
                                        padding: '12px 16px',
                                        backgroundColor: '#fff',
                                        color: '#555',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    Next
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
