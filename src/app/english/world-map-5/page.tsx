"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import * as d3Geo from 'd3-geo';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Map as MapIcon, Loader2, ZoomIn, ZoomOut, RotateCcw, Plus, Save, X } from 'lucide-react';

// --- Configuration ---
const WOOD_COLORS = [
    '#E3C195', '#C69C6D', '#A67C52', '#D4B08C', '#8B5A2B'
];
const DOT_COLOR_BASE = '#A67C52';
const DOT_COLOR_HOVER = '#10B981';
const DOT_COLOR_ACTIVE = '#F59E0B';
const DOT_RADIUS = 1.5;

const GRID_STEP = 0.9;

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/english/dashboard', icon: ArrowLeft },
    { label: 'Map 2 (Dot Visual)', href: '/english/world-map-2', icon: Globe },
];

type Dot = {
    lat: number;
    lon: number;
    country: string | null;
    id: string;
};

type ScreenDot = Dot & { px: number; py: number; };

type RegisteredWord = {
    word: string;
    meaning: string;
    date: string;
};

export default function WorldMap5Page() {
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0); // Progress %
    const [landDots, setLandDots] = useState<Dot[]>([]);
    const [registeredData, setRegisteredData] = useState<Record<string, RegisteredWord>>({});
    const [error, setError] = useState<string | null>(null);

    const [hoveredDot, setHoveredDot] = useState<Dot | null>(null);
    const [selectedDot, setSelectedDot] = useState<Dot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const transformRef = useRef({ k: 1, x: 0, y: 0 });
    const featuresRef = useRef<any[]>([]);
    const screenDotsRef = useRef<ScreenDot[]>([]);

    // 1. Data Loading
    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });

        // Dynamic Import
        import('../../../data/world-topo-50m.json')
            .then((data: any) => {
                const worldData = data.default || data;
                // @ts-ignore
                const countries = topojson.feature(worldData, worldData.objects.countries);
                // @ts-ignore
                featuresRef.current = countries.features.filter((f: any) => f.id !== "010" && f.properties?.name !== "Antarctica");
                setLoading(false);
                setGenerating(true);
            })
            .catch((err) => {
                console.error("Failed to load map data:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Resize
    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 2. Async Chunked Generation (Anti-Freeze)
    useEffect(() => {
        if (!generating || featuresRef.current.length === 0) return;

        let isMounted = true;

        const generateAsync = async () => {
            const dots: Dot[] = [];
            const features = featuresRef.current;
            const latMin = -58;
            const latMax = 85;
            const totalSteps = Math.ceil((latMax - latMin) / GRID_STEP);
            let steps = 0;

            for (let lat = latMin; lat <= latMax; lat += GRID_STEP) {
                if (!isMounted) return;

                // Yield control every row
                await new Promise(r => setTimeout(r, 0));

                const latRad = (lat * Math.PI) / 180;
                const cosLat = Math.max(0.1, Math.cos(latRad));
                const lonStep = GRID_STEP / cosLat;

                for (let lon = -180; lon <= 180; lon += lonStep) {
                    const point = [lon, lat];
                    // Check inclusion
                    for (const feature of features) {
                        if (d3Geo.geoContains(feature, point as [number, number])) {
                            dots.push({
                                lat,
                                lon,
                                country: feature.properties?.name || 'Unknown',
                                id: `${lat.toFixed(2)},${lon.toFixed(2)}`
                            });
                            break;
                        }
                    }
                }
                steps++;
                setProgress(Math.round((steps / totalSteps) * 100));
            }

            if (isMounted) {
                setLandDots(dots);
                setGenerating(false);
            }
        };

        generateAsync();
        return () => { isMounted = false; };
    }, [generating]);

    // 3. Projection Helper
    const projection = useMemo(() => {
        return d3Geo.geoNaturalEarth1()
            .rotate([-150, 0])
            .fitExtent(
                [[50, 50], [dimensions.width - 50, dimensions.height - 50]],
                { type: "Sphere" } as any
            );
    }, [dimensions]);

    // 4. Pre-calc Coords (Optimized)
    useEffect(() => {
        if (landDots.length === 0) return;

        screenDotsRef.current = landDots.map(dot => {
            const coords = projection([dot.lon, dot.lat]);
            if (!coords) return null;
            return { ...dot, px: coords[0], py: coords[1] };
        }).filter((d): d is ScreenDot => d !== null);

        draw();
    }, [landDots, projection]);

    // 5. Canvas Render
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = dimensions;
        const { k, x, y } = transformRef.current;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(k, k);

        const cachedDots = screenDotsRef.current;
        for (let i = 0; i < cachedDots.length; i++) {
            const dot = cachedDots[i];
            const { px, py } = dot;

            const isHovered = hoveredDot?.id === dot.id;
            const isRegistered = !!registeredData[dot.id];
            const isSelected = selectedDot?.id === dot.id;

            ctx.beginPath();
            const r = (DOT_RADIUS / k) * (isHovered ? 2.5 : 1.2);
            ctx.arc(px, py, r, 0, 2 * Math.PI);

            if (isSelected) ctx.fillStyle = '#EF4444';
            else if (isHovered) ctx.fillStyle = DOT_COLOR_HOVER;
            else if (isRegistered) ctx.fillStyle = DOT_COLOR_ACTIVE;
            else ctx.fillStyle = DOT_COLOR_BASE;

            ctx.fill();
        }
        ctx.restore();
    }, [dimensions, hoveredDot, selectedDot, registeredData]);

    // Interaction
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const zoom = d3Zoom.zoom<HTMLCanvasElement, unknown>()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                transformRef.current = event.transform;
                draw();
            })

        d3Selection.select(canvas).call(zoom)
            .on("mousemove", handleMouseMove)
            .on("click", handleClick);

        return () => { d3Selection.select(canvas).on(".zoom", null); }
    }, [draw]);

    const handleMouseMove = (event: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const t = transformRef.current;
        const wx = (event.clientX - rect.left - t.x) / t.k;
        const wy = (event.clientY - rect.top - t.y) / t.k;

        let closest: Dot | null = null;
        let minDistSq = (10 / t.k) ** 2;

        const cachedDots = screenDotsRef.current;
        for (let i = 0; i < cachedDots.length; i++) {
            const dot = cachedDots[i];
            const dx = dot.px - wx;
            if (dx * dx > minDistSq) continue; // box check x
            const dy = dot.py - wy;
            if (dy * dy > minDistSq) continue; // box check y

            const distSq = dx * dx + dy * dy;
            if (distSq < minDistSq) {
                minDistSq = distSq;
                closest = dot;
            }
        }
        setHoveredDot(closest);
    };

    const handleClick = () => {
        if (hoveredDot) {
            setSelectedDot(hoveredDot);
            setIsModalOpen(true);
        }
    };

    const handleSaveWord = (word: string, meaning: string) => {
        if (!selectedDot) return;
        setRegisteredData(prev => ({
            ...prev,
            [selectedDot.id]: { word, meaning, date: new Date().toISOString() }
        }));
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen font-serif relative overflow-hidden bg-[#F5F5F0]">
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <header className="absolute top-0 left-0 w-full z-10 p-8 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto flex gap-4">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className="flex items-center gap-2 px-5 py-2.5 bg-[#EEECE5] hover:bg-[#E3C195] border border-[#D4B08C] text-[#5D4037] rounded-sm shadow-sm transition-all font-serif tracking-widest text-xs uppercase">
                            <item.icon size={14} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col items-end pointer-events-auto">
                    <h1 className="text-4xl text-[#3E2723] font-serif tracking-widest uppercase mb-1 drop-shadow-sm">Word Galaxy</h1>
                    <div className="h-0.5 w-24 bg-[#8B5A2B] mb-2" />
                    <p className="text-[#8D6E63] text-xs uppercase tracking-widest">Interactive Dot Map (Map 5)</p>
                    <p className="text-[10px] text-[#8D6E63] tracking-widest mt-1">{landDots.length.toLocaleString()} POINTS ONLINE</p>
                </div>
            </header>

            <main className="w-full h-screen cursor-move">
                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center p-10 bg-[#F5F5F0]">
                        <div className="text-red-800 border-2 border-red-800 p-8 rounded bg-red-50 max-w-lg text-center">
                            <h2 className="text-2xl font-bold mb-4">SYSTEM MALFUNCTION</h2>
                            <p className="font-mono text-sm mb-4">{error}</p>
                        </div>
                    </div>
                ) : (
                    <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="block w-full h-full" />
                )}

                {(loading || generating) && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[#8B5A2B] bg-[#F5F5F0]/95 z-20">
                        <Loader2 className="animate-spin" size={48} />
                        <div className="text-center">
                            <p className="font-serif tracking-widest text-lg font-bold">TERRAFORMING...</p>
                            <p className="text-xs tracking-widest opacity-70">
                                SCANNING SECTOR: {progress}% <br />
                                ({GRID_STEP}° RESOLUTION)
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {hoveredDot && !isModalOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute z-30 pointer-events-none" style={{ bottom: 40, right: 40, position: 'fixed' }}>
                        <div className="bg-[#EEECE5]/90 backdrop-blur p-6 shadow-xl border border-[#8B5A2B] min-w-[200px]">
                            <div className="text-[#8B5A2B] text-[10px] tracking-widest uppercase mb-1">{hoveredDot.country}</div>
                            <div className="text-[#3E2723] font-bold font-serif text-lg">{registeredData[hoveredDot.id]?.word || 'Empty Slot'}</div>
                            <div className="text-[#8D6E63] text-xs mt-1 italic">{registeredData[hoveredDot.id] ? registeredData[hoveredDot.id].meaning : 'Click to register'}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && selectedDot && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-[#F5F5F0] w-full max-w-sm p-6 shadow-2xl border-2 border-[#8B5A2B] relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#8B5A2B] hover:text-[#3E2723]"><X size={20} /></button>
                            <h2 className="text-xl font-serif font-bold text-[#3E2723] mb-1">Pixel Registration</h2>
                            <p className="text-xs text-[#8D6E63] tracking-widest mb-6">COORD: {selectedDot.lat.toFixed(2)}, {selectedDot.lon.toFixed(2)}</p>
                            <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; handleSaveWord(form.word.value, form.meaning.value); }}>
                                <div className="space-y-4">
                                    <div><label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">Word</label><input name="word" autoFocus defaultValue={registeredData[selectedDot.id]?.word || ''} className="w-full bg-[#EEECE5] border border-[#D4B08C] p-3 text-[#3E2723] font-serif focus:outline-none focus:border-[#8B5A2B]" /></div>
                                    <div><label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">Meaning</label><textarea name="meaning" defaultValue={registeredData[selectedDot.id]?.meaning || ''} className="w-full bg-[#EEECE5] border border-[#D4B08C] p-3 text-[#3E2723] font-serif focus:outline-none focus:border-[#8B5A2B] h-24 resize-none" /></div>
                                    <button type="submit" className="w-full bg-[#8B5A2B] text-[#F5F5F0] py-3 font-serif font-bold tracking-widest hover:bg-[#3E2723] transition-colors">SAVE RECORD</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
