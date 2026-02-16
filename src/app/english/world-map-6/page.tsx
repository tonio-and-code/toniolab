"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import * as d3Geo from 'd3-geo';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Map as MapIcon, Loader2, ZoomIn, ZoomOut, RotateCcw, X, Bookmark, Trophy, Sparkles } from 'lucide-react';
import { getCountryVibe } from '../../../data/country-vibes';

// --- Configuration ---
const WOOD_COLORS = [
    '#E3C195', '#C69C6D', '#A67C52', '#D4B08C', '#8B5A2B'
];

const GOLD_COLOR = '#F59E0B'; // Collected Color
const HOVER_COLOR = '#10B981'; // Hover Color
const TARGET_COLOR = '#F97316'; // Orange for Target (Softer than Red)

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/english/dashboard', icon: ArrowLeft },
    { label: 'Map 4', href: '/english/world-map-4', icon: MapIcon },
];

type ConqueredCountry = {
    word: string;
    meaning: string;
    date: string;
};

export default function WorldMap6Page() {
    const [features, setFeatures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCountry, setHoveredCountry] = useState<any | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [conqueredData, setConqueredData] = useState<Record<string, ConqueredCountry>>({});
    const [missionTarget, setMissionTarget] = useState<any | null>(null);
    const [isPortraitWarningDismissed, setIsPortraitWarningDismissed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);

    // Load Data
    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });

        import('../../../data/world-topo-50m.json')
            .then((data: any) => {
                const worldData = data.default || data;
                // @ts-ignore
                const countries = topojson.feature(worldData, worldData.objects.countries);
                // @ts-ignore
                const filtered = countries.features.filter(f => f.id !== "010" && f.properties?.name !== "Antarctica");
                setFeatures(filtered);
                setLoading(false);
            })
            .catch(err => console.error(err));

        // Load Saved Data
        try {
            const saved = localStorage.getItem('world-map-6-conquest');
            if (saved) {
                setConqueredData(JSON.parse(saved));
            }
        } catch (e) { }

    }, []);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Projection & Path
    const projection = useMemo(() => {
        return d3Geo.geoNaturalEarth1()
            .rotate([-150, 0])
            .fitExtent(
                [[50, 50], [dimensions.width - 50, dimensions.height - 50]],
                { type: "FeatureCollection", features: features.length ? features : [] } as any
            );
    }, [dimensions, features]);

    const pathGenerator = useMemo(() => {
        return d3Geo.geoPath().projection(projection);
    }, [projection]);

    // Zoom Logic
    useEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const zoom = d3Zoom.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 10])
            .translateExtent([[-100, -100], [dimensions.width + 100, dimensions.height + 100]])
            .on('zoom', (event) => {
                if (gRef.current) d3Selection.select(gRef.current as any).attr('transform', event.transform);
            });

        d3Selection.select(svgRef.current).call(zoom);
    }, [dimensions, loading]);

    // Handlers
    const handleZoom = (factor: number) => {
        if (!svgRef.current) return;
        d3Selection.select(svgRef.current).transition().duration(500).call((d3Zoom.zoom() as any).scaleBy, factor);
    };

    const handleReset = () => {
        if (!svgRef.current) return;
        d3Selection.select(svgRef.current).transition().duration(750).call((d3Zoom.zoom() as any).transform, d3Zoom.zoomIdentity);
    };

    const handleRandomMission = () => {
        if (!features.length) return;

        const unconquered = features.filter(f => !conqueredData[f.properties?.name]);
        if (unconquered.length === 0) {
            alert("JOURNEY COMPLETE! You have visited every corner of the world.");
            return;
        }

        const target = unconquered[Math.floor(Math.random() * unconquered.length)];
        setSelectedCountry(target);
        setMissionTarget(target);

        // Zoom to Target
        if (svgRef.current) {
            const bounds = pathGenerator.bounds(target);
            const dx = bounds[1][0] - bounds[0][0];
            const dy = bounds[1][1] - bounds[0][1];
            const x = (bounds[0][0] + bounds[1][0]) / 2;
            const y = (bounds[0][1] + bounds[1][1]) / 2;
            const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / dimensions.width, dy / dimensions.height)));
            const translate = [dimensions.width / 2 - scale * x, dimensions.height / 2 - scale * y];

            d3Selection.select(svgRef.current).transition().duration(1500)
                .call(
                    (d3Zoom.zoom() as any).transform,
                    d3Zoom.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
                );
        }
    };

    const saveConquest = (word: string, meaning: string) => {
        if (!selectedCountry) return;
        const countryId = selectedCountry.properties.name;

        const newData = {
            ...conqueredData,
            [countryId]: {
                word,
                meaning,
                date: new Date().toISOString()
            }
        };
        setConqueredData(newData);
        localStorage.setItem('world-map-6-conquest', JSON.stringify(newData));
        setIsModalOpen(false);
        setMissionTarget(null);
    };

    const deleteConquest = () => {
        if (!selectedCountry) return;
        const countryId = selectedCountry.properties.name;
        const newData = { ...conqueredData };
        delete newData[countryId];
        setConqueredData(newData);
        localStorage.setItem('world-map-6-conquest', JSON.stringify(newData));
        setIsModalOpen(false);
    };

    const getCountryColor = (feature: any) => {
        const id = feature.properties?.name;
        if (conqueredData[id]) return GOLD_COLOR;

        // Random Wood Color logic
        const code = feature.id || id || 'unknown';
        let hash = 0;
        for (let i = 0; i < String(code).length; i++) hash = String(code).charCodeAt(i) + ((hash << 5) - hash);
        return WOOD_COLORS[Math.abs(hash) % WOOD_COLORS.length];
    };

    const onCountryClick = (feature: any) => {
        setSelectedCountry(feature);
        setMissionTarget(null);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen font-serif relative overflow-hidden bg-[#F5F5F0]">
            {/* MOBILE LANDSCAPE WARNING */}
            {!isPortraitWarningDismissed && (
                <div className="hidden portrait:flex md:hidden fixed inset-0 z-[60] bg-[#3E2723]/95 backdrop-blur-sm text-[#F5F5F0] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                    <RotateCcw size={48} className="mb-4 animate-spin-slow text-[#F59E0B]" />
                    <h2 className="text-xl font-bold mb-2 uppercase tracking-widest">Rotate Device</h2>
                    <p className="text-sm opacity-80 leading-relaxed font-sans mb-8">
                        The World Collection map is best experienced in landscape mode.
                    </p>
                    <button
                        onClick={() => setIsPortraitWarningDismissed(true)}
                        className="px-6 py-3 border border-[#F5F5F0]/30 rounded-full text-xs font-bold tracking-widest hover:bg-[#F5F5F0]/10 transition-colors uppercase"
                    >
                        Continue in Portrait
                    </button>
                    <p className="text-[10px] text-[#F5F5F0]/40 mt-4 absolute bottom-8">
                        Some features may be cramped.
                    </p>
                </div>
            )}

            {/* Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <header className="absolute top-0 left-0 w-full z-10 p-4 md:p-8 flex flex-col md:flex-row justify-between items-start pointer-events-none gap-4">
                <div className="pointer-events-auto flex flex-wrap gap-2 md:gap-4">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-[#EEECE5] hover:bg-[#E3C195] border border-[#D4B08C] text-[#5D4037] rounded-sm shadow-sm transition-all font-serif tracking-widest text-[10px] md:text-xs uppercase">
                            <item.icon size={12} className="md:w-3.5 md:h-3.5" />
                            <span className="hidden md:inline">{item.label}</span>
                        </Link>
                    ))}
                    {/* MISSION BUTTON */}
                    <button
                        onClick={handleRandomMission}
                        className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-[#8B5A2B] text-[#F5F5F0] border border-[#8B5A2B] rounded-sm shadow-lg hover:bg-[#3E2723] transition-all font-serif tracking-widest text-[10px] md:text-xs uppercase animate-pulse font-bold"
                    >
                        <Sparkles size={12} className="md:w-3.5 md:h-3.5" />
                        <span>Next Journey</span>
                    </button>
                </div>
                <div className="flex flex-col items-end pointer-events-auto w-full md:w-auto">
                    <h1 className="text-xl md:text-3xl text-[#3E2723] font-serif tracking-widest uppercase mb-1 drop-shadow-sm flex items-center gap-2 md:gap-3">
                        <Globe size={20} className="md:w-6 md:h-6 text-[#F59E0B]" />
                        World Collection
                    </h1>

                    {/* EXPLORATION COUNTER */}
                    <div className="flex items-center gap-4 mt-2 bg-[#EEECE5]/80 backdrop-blur-sm p-3 rounded-lg border border-[#D4B08C] shadow-sm">
                        <div className="text-right">
                            <p className="text-[#8D6E63] text-[10px] uppercase tracking-widest mb-0.5">Explored</p>
                            <div className="flex items-baseline justify-end gap-1">
                                <span className="text-3xl font-serif font-bold text-[#F59E0B] leading-none">
                                    {Math.round((Object.keys(conqueredData).length / (features.length || 1)) * 100)}
                                </span>
                                <span className="text-xs text-[#8B5A2B] font-bold">%</span>
                            </div>
                        </div>

                        {/* Circular Progress */}
                        <div className="w-12 h-12 relative flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="24" cy="24" r="18" stroke="#D4B08C" strokeWidth="4" fill="none" className="opacity-30" />
                                <circle
                                    cx="24" cy="24" r="18"
                                    stroke="#F59E0B" strokeWidth="4" fill="none"
                                    strokeDasharray={113}
                                    strokeDashoffset={113 - (113 * (Object.keys(conqueredData).length / (features.length || 1)))}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                        </div>

                        <div className="h-8 w-[1px] bg-[#D4B08C] mx-1" />

                        <div className="text-right min-w-[80px]">
                            <p className="text-[#5D4037] text-xs font-bold tracking-widest uppercase">
                                {(() => {
                                    const p = (Object.keys(conqueredData).length / (features.length || 1)) * 100;
                                    if (p === 0) return "Traveler";
                                    if (p < 5) return "Backpacker";
                                    if (p < 15) return "Explorer";
                                    if (p < 30) return "Voyager";
                                    if (p < 50) return "Globetrotter";
                                    if (p < 80) return "World Citizen";
                                    return "Legend";
                                })()}
                            </p>
                            <p className="text-[#8D6E63] text-[10px] tracking-widest mt-0.5">
                                {Object.keys(conqueredData).length} / {features.length}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="w-full h-screen cursor-move select-none">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 text-[#8B5A2B] animate-pulse">
                        <Loader2 className="animate-spin" />
                        <span className="font-serif tracking-widest">LOADING MAP...</span>
                    </div>
                ) : (
                    <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full">
                        <defs>
                            <filter id="wood-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="-1" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                            </filter>
                        </defs>
                        <g ref={gRef} className="map-layer" filter="url(#wood-shadow)">
                            {features.map((feature, i) => {
                                const id = feature.properties?.name;
                                const isHovered = hoveredCountry?.properties?.name === id;
                                const isSelected = selectedCountry?.properties?.name === id;
                                const isConquered = !!conqueredData[id];
                                const baseColor = getCountryColor(feature);

                                return (
                                    <g key={`${id || 'unknown'}-${i}`}
                                        onMouseEnter={() => setHoveredCountry(feature)}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                        onClick={() => onCountryClick(feature)}
                                        className="transition-all cursor-pointer"
                                    >
                                        <path
                                            d={pathGenerator(feature) as string}
                                            fill={baseColor}
                                            stroke={isSelected ? TARGET_COLOR : "#F5F5F0"}
                                            strokeWidth={isSelected ? 3 : (isHovered ? 1.5 : 0.5)}
                                            style={{
                                                filter: isSelected
                                                    ? `brightness(1.1) drop-shadow(0 0 10px ${TARGET_COLOR}90)`
                                                    : (isHovered ? 'brightness(1.15)' : 'brightness(1)'),
                                                transition: 'all 0.3s',
                                                fill: isConquered && !isHovered ? GOLD_COLOR : (isConquered && isHovered ? '#FCD34D' : baseColor)
                                            }}
                                            className={isSelected ? "animate-pulse" : ""}
                                        />
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                )}
            </main>

            {/* Controls */}
            <div className="absolute bottom-12 left-12 flex flex-col gap-2 z-20 pointer-events-auto">
                <button onClick={() => handleZoom(1.5)} className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195]"><ZoomIn size={20} /></button>
                <button onClick={() => handleZoom(0.6)} className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195]"><ZoomOut size={20} /></button>
                <button onClick={handleReset} className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195]"><RotateCcw size={20} /></button>
            </div>

            {/* DAILY MISSION WIDGET */}
            <div className="absolute bottom-12 right-12 z-20 pointer-events-auto">
                <div className="bg-[#EEECE5]/90 backdrop-blur p-5 shadow-xl border border-[#D4B08C] rounded-sm min-w-[260px]">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-[#3E2723] font-serif font-bold uppercase tracking-widest text-sm">Daily Journey</h3>
                        <div className="bg-[#F59E0B] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {(() => {
                                const today = new Date().toISOString().split('T')[0];
                                const count = Object.values(conqueredData).filter(d => d.date.startsWith(today)).length;
                                return count >= 8 ? "COMPLETE" : "ACTIVE";
                            })()}
                        </div>
                    </div>

                    {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const count = Object.values(conqueredData).filter(d => d.date.startsWith(today)).length;
                        const target = 8;
                        const progress = Math.min(100, (count / target) * 100);

                        return (
                            <div>
                                <div className="flex justify-between text-xs text-[#5D4037] font-bold mb-1">
                                    <span>{count} / {target} Places</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#D4B08C]/30 rounded-full overflow-hidden mb-3">
                                    <div
                                        className="h-full bg-[#F59E0B] transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-[#8D6E63] italic">
                                    {count >= target
                                        ? "Great pace! You are a true explorer."
                                        : `Visit ${target - count} more places to keep the streak.`
                                    }
                                </p>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* TARGET INDICATOR */}
            <AnimatePresence>
                {missionTarget && !isModalOpen && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center justify-center mt-[-60px]">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="bg-[#F97316] text-white px-4 py-2 rounded-full shadow-lg font-bold tracking-widest text-sm mb-2 animate-bounce border-2 border-white">
                                DESTINATION: {missionTarget.properties?.name}
                            </div>
                            <div className="text-[#F97316] text-xs font-bold bg-white/80 px-2 py-0.5 rounded shadow-sm backdrop-blur-sm">
                                CLICK TO COLLECT
                            </div>
                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#F97316] mt-2 filter drop-shadow-md" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredCountry && (
                    <div className="absolute top-32 right-12 z-20 pointer-events-none">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="bg-[#EEECE5]/90 backdrop-blur p-6 shadow-xl border border-[#8B5A2B] min-w-[240px]">
                            <h2 className="text-2xl text-[#3E2723] font-serif font-bold uppercase tracking-wider mb-2 border-b border-[#D4B08C] pb-2">
                                {hoveredCountry.properties?.name}
                            </h2>
                            {conqueredData[hoveredCountry.properties?.name] ? (
                                <div>
                                    <div className="flex items-center gap-2 text-[#F59E0B] font-bold mb-1">
                                        <Bookmark size={16} />
                                        <span className="text-xs tracking-widest uppercase">Collected</span>
                                    </div>
                                    <div className="text-[#3E2723] font-bold text-lg">
                                        {conqueredData[hoveredCountry.properties?.name].word}
                                    </div>
                                    <div className="text-[#5D4037] text-xs italic mt-1">
                                        "{conqueredData[hoveredCountry.properties?.name].meaning}"
                                    </div>
                                </div>
                            ) : (
                                <div className="text-[#8D6E63] text-xs italic">
                                    Unexplored
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && selectedCountry && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-[#EEECE5] w-full max-w-sm p-8 shadow-2xl border border-[#D4B08C] relative rounded-sm">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#8B5A2B] hover:text-[#3E2723]"><X size={20} /></button>

                            {conqueredData[selectedCountry.properties?.name] ? (
                                // View Mode
                                <div>
                                    <h2 className="text-3xl text-[#3E2723] font-serif font-bold mb-4">{selectedCountry.properties?.name}</h2>
                                    <div className="bg-[#F59E0B]/20 border border-[#F59E0B] p-4 mb-6 rounded text-center">
                                        <div className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest mb-1">Memory Key</div>
                                        <div className="text-4xl text-[#3E2723] font-bold font-serif">{conqueredData[selectedCountry.properties?.name].word}</div>
                                    </div>
                                    <p className="text-[#5D4037] italic text-center mb-6">"{conqueredData[selectedCountry.properties?.name].meaning}"</p>
                                    <button onClick={deleteConquest} className="w-full border border-red-300 text-red-800 py-3 text-xs tracking-widest hover:bg-red-50 transition-colors">FORGET MEMORY</button>
                                </div>
                            ) : (
                                // Register Mode
                                <form id="conquest-form" onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; saveConquest(form.word.value, form.meaning.value); }}>
                                    <div className="flex items-center gap-2 text-[#8B5A2B] mb-2">
                                        <Globe size={16} />
                                        <span className="text-xs uppercase tracking-widest">Next Destination</span>
                                    </div>
                                    <h2 className="text-3xl text-[#3E2723] font-serif font-bold mb-6">{selectedCountry.properties?.name}</h2>

                                    {/* CONTEXT SUGGESTIONS */}
                                    {(() => {
                                        const vibe = getCountryVibe(selectedCountry.properties?.name);
                                        return (
                                            <div className="mb-6 bg-[#D4B08C]/20 p-4 rounded border border-[#D4B08C]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="text-[10px] text-[#8B5A2B] font-bold uppercase tracking-widest">Travel Guide</div>
                                                    <div className="h-[1px] flex-1 bg-[#D4B08C]/50" />
                                                </div>

                                                {/* English Description */}
                                                <p className="text-sm text-[#3E2723] font-serif leading-relaxed mb-3">
                                                    {vibe.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {vibe.words.map(w => (
                                                        <button
                                                            key={w} type="button"
                                                            onClick={(e) => {
                                                                // Simple autofill via DOM
                                                                const form = document.getElementById('conquest-form') as HTMLFormElement;
                                                                if (form) {
                                                                    form.word.value = w;
                                                                    form.meaning.focus();
                                                                }
                                                            }}
                                                            className="text-[10px] uppercase font-bold bg-[#F5F5F0] border border-[#D4B08C] px-3 py-1.5 text-[#5D4037] hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all"
                                                        >
                                                            {w}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <div className="space-y-4">
                                        <div><label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">Vibe Word</label><input name="word" autoFocus className="w-full bg-[#FAFAF8] border border-[#D4B08C] p-3 text-[#3E2723] font-serif focus:outline-none focus:border-[#8B5A2B]" placeholder="Select or type..." /></div>
                                        <div><label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">Memory Link</label><textarea name="meaning" className="w-full bg-[#FAFAF8] border border-[#D4B08C] p-3 text-[#3E2723] font-serif focus:outline-none focus:border-[#8B5A2B] h-20 resize-none" placeholder="What did you feel?" /></div>
                                        <button type="submit" className="w-full bg-[#8B5A2B] text-[#F5F5F0] py-4 font-serif font-bold tracking-widest hover:bg-[#3E2723] transition-colors shadow-lg flex items-center justify-center gap-2"><Bookmark size={16} /> SAVE MEMORY</button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
