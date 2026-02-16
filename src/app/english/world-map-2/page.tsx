"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import * as d3Geo from 'd3-geo';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Map as MapIcon, Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import worldData from '../../../data/world-topo-50m.json';

// --- Configuration ---
// Stylish Wood Palettes (Matches Map 4)
const WOOD_COLORS = [
    '#E3C195', // Birch
    '#C69C6D', // Oak
    '#A67C52', // Walnut
    '#D4B08C', // Maple
    '#8B5A2B', // Mahogany
];

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/english/dashboard', icon: ArrowLeft },
    { label: 'Natural Earth (Map 4)', href: '/english/world-map-4', icon: Globe },
];

export default function WorldMap2Page() {
    const [features, setFeatures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCountry, setHoveredCountry] = useState<any | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);

    // --- Data Loading ---
    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });

        if (worldData) {
            // @ts-ignore
            const countries = topojson.feature(worldData, worldData.objects.countries);
            // @ts-ignore
            const filtered = countries.features.filter(f => f.id !== "010" && f.properties?.name !== "Antarctica");
            setFeatures(filtered);
            setLoading(false);
        }
    }, []);

    // --- Resize Handler ---
    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Projection (Natural Earth - Same as Map 4) ---
    const projection = useMemo(() => {
        // Natural Earth 1 projection
        // Rotated to 150E (Japan Center)
        // Sphere Fitting ensures perfect visibility
        return d3Geo.geoNaturalEarth1()
            .rotate([-150, 0])
            .fitExtent(
                [[50, 50], [dimensions.width - 50, dimensions.height - 50]],
                { type: "Sphere" } as any
            );
    }, [dimensions, features]);

    const pathGenerator = useMemo(() => {
        return d3Geo.geoPath().projection(projection);
    }, [projection]);

    // --- Zoom Behavior ---
    useEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const zoom = d3Zoom.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 10])
            .translateExtent([[-100, -100], [dimensions.width + 100, dimensions.height + 100]])
            .on('zoom', (event) => {
                if (gRef.current) {
                    d3Selection.select(gRef.current as any).attr('transform', event.transform);
                }
            });

        const svg = d3Selection.select(svgRef.current);
        svg.call(zoom);
    }, [dimensions]);

    const handleZoom = (factor: number) => {
        if (!svgRef.current) return;
        const svg = d3Selection.select(svgRef.current);
        svg.transition().duration(500).call((d3Zoom.zoom() as any).scaleBy, factor);
    };

    const handleReset = () => {
        if (!svgRef.current) return;
        const svg = d3Selection.select(svgRef.current);
        svg.transition().duration(750)
            .call((d3Zoom.zoom() as any).transform, d3Zoom.zoomIdentity);
    };

    const getCountryColor = (feature: any) => {
        const id = feature.id || feature.properties?.name || 'unknown';
        let hash = 0;
        for (let i = 0; i < String(id).length; i++) {
            hash = String(id).charCodeAt(i) + ((hash << 5) - hash);
        }
        return WOOD_COLORS[Math.abs(hash) % WOOD_COLORS.length];
    };

    return (
        <div className="min-h-screen font-serif relative overflow-hidden bg-[#F5F5F0]">

            {/* Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Header */}
            <header className="absolute top-0 left-0 w-full z-10 p-8 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto flex gap-4">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#EEECE5] hover:bg-[#E3C195] border border-[#D4B08C] text-[#5D4037] rounded-sm shadow-sm transition-all font-serif tracking-widest text-xs uppercase"
                        >
                            <item.icon size={14} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-end pointer-events-auto">
                    <h1 className="text-4xl text-[#3E2723] font-serif tracking-widest uppercase mb-1 drop-shadow-sm">
                        The World
                    </h1>
                    <div className="h-0.5 w-24 bg-[#8B5A2B] mb-2" />
                    <p className="text-[#8D6E63] text-xs uppercase tracking-widest">
                        Dot Map (Map 2)
                    </p>
                </div>
            </header>

            {/* Main Map Area */}
            <main className="w-full h-screen cursor-move">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 text-[#8B5A2B] animate-pulse">
                        <Loader2 className="animate-spin" />
                        <span className="font-serif tracking-widest">GENERATING DOT MATRIX...</span>
                    </div>
                ) : (
                    <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full">
                        <defs>
                            {/* 1. Dot Pattern Definition */}
                            <pattern id="dot-pattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                                {/* Radius 1.2 = Diameter 2.4. Gap = 1.6px. Nice density. */}
                                <circle cx="2" cy="2" r="1.2" fill="white" />
                            </pattern>

                            {/* 2. Mask Definition */}
                            <mask id="dot-mask">
                                {/* Fill with Pattern using a huge rect to cover any zoom level */}
                                <rect x="-10000" y="-10000" width="40000" height="40000" fill="url(#dot-pattern)" />
                            </mask>

                            {/* 3. Shadow Filter */}
                            <filter id="wood-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="-1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.2" />
                            </filter>
                        </defs>

                        <g ref={gRef} className="map-layer" filter="url(#wood-shadow)">
                            {features.map((feature, i) => {
                                const isHovered = hoveredCountry?.id === feature.id;
                                const baseColor = getCountryColor(feature);
                                const area = pathGenerator.area(feature);
                                const showLabel = area > 500;

                                return (
                                    <g key={feature.id || i}
                                        onMouseEnter={() => setHoveredCountry(feature)}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                        className="transition-opacity"
                                        style={{ transformOrigin: 'center' }}
                                    >
                                        {/* The Country Path - MASKED by Dots */}
                                        <path
                                            d={pathGenerator(feature) as string}
                                            fill={baseColor}
                                            stroke="none" // No stroke for pure dot look
                                            mask="url(#dot-mask)" // APPLY THE DOT MASK
                                            style={{
                                                filter: isHovered ? 'brightness(1.3) saturate(1.2)' : 'brightness(1)',
                                                opacity: isHovered ? 1 : 0.8, // Slight transparency for dot blend
                                                transition: 'all 0.2s ease'
                                            }}
                                        />

                                        {/* Label (Only show for large areas) */}
                                        {showLabel && (
                                            <text
                                                x={pathGenerator.centroid(feature)[0]}
                                                y={pathGenerator.centroid(feature)[1]}
                                                textAnchor="middle"
                                                alignmentBaseline="middle"
                                                className="text-[8px] uppercase font-serif tracking-widest pointer-events-none select-none"
                                                style={{
                                                    fill: '#3E2723',
                                                    opacity: isHovered ? 1 : 0.4,
                                                    fontSize: isHovered ? '10px' : '8px',
                                                    textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                                                }}
                                            >
                                                {feature.properties?.name}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                )}
            </main>

            {/* Controls */}
            <div className="absolute bottom-12 left-12 flex flex-col gap-2 z-20 pointer-events-auto">
                <button onClick={() => handleZoom(1.5)} className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195]">
                    <ZoomIn size={20} />
                </button>
                <button onClick={() => handleZoom(0.6)} className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195]">
                    <ZoomOut size={20} />
                </button>
                <button onClick={handleReset} className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195]">
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredCountry && (
                    <div className="absolute top-32 right-12 z-20 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="bg-[#EEECE5]/90 backdrop-blur p-6 shadow-xl border border-[#8B5A2B] min-w-[240px]"
                        >
                            <h2 className="text-2xl text-[#3E2723] font-serif font-bold uppercase tracking-wider mb-2 border-b border-[#D4B08C] pb-2">
                                {hoveredCountry.properties?.name}
                            </h2>
                            <div className="text-[#5D4037] text-xs font-serif tracking-wide">
                                <p>Code: {hoveredCountry.id}</p>
                                <p className="mt-1 text-[10px] opacity-70">INTERACTIVE DOT MATRIX</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
