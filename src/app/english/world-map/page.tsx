'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';
import dotsData from '../../../data/world-map-dots.json';

// Region name mapping
const REGION_NAMES: Record<string, string> = {
    USA: 'United States',
    CAN: 'Canada',
    MEX: 'Mexico',
    BRA: 'Brazil',
    ARG: 'Argentina',
    GBR: 'United Kingdom',
    FRA: 'France',
    DEU: 'Germany',
    ITA: 'Italy',
    ESP: 'Spain',
    RUS: 'Russia',
    CHN: 'China',
    JPN: 'Japan',
    KOR: 'South Korea',
    IND: 'India',
    AUS: 'Australia',
    GRL: 'Greenland',
    NOR: 'Norway',
    SWE: 'Sweden',
    FIN: 'Finland',
    POL: 'Poland',
    UKR: 'Ukraine',
    TUR: 'Turkey',
    SAU: 'Saudi Arabia',
    EGY: 'Egypt',
    ZAF: 'South Africa',
    NGA: 'Nigeria',
    KEN: 'Kenya',
    IDN: 'Indonesia',
    THA: 'Thailand',
    VNM: 'Vietnam',
    PHL: 'Philippines',
    MYS: 'Malaysia',
    NZL: 'New Zealand',
    COL: 'Colombia',
    PER: 'Peru',
    CHL: 'Chile',
    VEN: 'Venezuela',
    PRT: 'Portugal',
    NLD: 'Netherlands',
    BEL: 'Belgium',
    CHE: 'Switzerland',
    AUT: 'Austria',
    GRC: 'Greece',
    CZE: 'Czech Republic',
    HUN: 'Hungary',
    ROU: 'Romania',
    BGR: 'Bulgaria',
    HRV: 'Croatia',
    SRB: 'Serbia',
    DNK: 'Denmark',
    IRL: 'Ireland',
    ISL: 'Iceland',
    PAK: 'Pakistan',
    BGD: 'Bangladesh',
    MMR: 'Myanmar',
    NPL: 'Nepal',
    LKA: 'Sri Lanka',
    KAZ: 'Kazakhstan',
    UZB: 'Uzbekistan',
    IRN: 'Iran',
    IRQ: 'Iraq',
    SYR: 'Syria',
    ISR: 'Israel',
    JOR: 'Jordan',
    LBN: 'Lebanon',
    ARE: 'United Arab Emirates',
    QAT: 'Qatar',
    KWT: 'Kuwait',
    OMN: 'Oman',
    YEM: 'Yemen',
    AFG: 'Afghanistan',
    MAR: 'Morocco',
    DZA: 'Algeria',
    TUN: 'Tunisia',
    LBY: 'Libya',
    SDN: 'Sudan',
    ETH: 'Ethiopia',
    TZA: 'Tanzania',
    COD: 'DR Congo',
    AGO: 'Angola',
    MOZ: 'Mozambique',
    MDG: 'Madagascar',
    GHA: 'Ghana',
    CIV: "Cote d'Ivoire",
    CMR: 'Cameroon',
    SEN: 'Senegal',
    MNG: 'Mongolia',
    PRK: 'North Korea',
    TWN: 'Taiwan',
    HKG: 'Hong Kong',
    SGP: 'Singapore',
    BRN: 'Brunei',
    KHM: 'Cambodia',
    LAO: 'Laos',
    PNG: 'Papua New Guinea',
    FJI: 'Fiji',
    CUB: 'Cuba',
    HTI: 'Haiti',
    DOM: 'Dominican Republic',
    JAM: 'Jamaica',
    PRI: 'Puerto Rico',
    GTM: 'Guatemala',
    HND: 'Honduras',
    SLV: 'El Salvador',
    NIC: 'Nicaragua',
    CRI: 'Costa Rica',
    PAN: 'Panama',
    ECU: 'Ecuador',
    BOL: 'Bolivia',
    PRY: 'Paraguay',
    URY: 'Uruguay',
    GUY: 'Guyana',
    SUR: 'Suriname',
    EST: 'Estonia',
    LVA: 'Latvia',
    LTU: 'Lithuania',
    BLR: 'Belarus',
    MDA: 'Moldova',
    GEO: 'Georgia',
    ARM: 'Armenia',
    AZE: 'Azerbaijan',
    TKM: 'Turkmenistan',
    TJK: 'Tajikistan',
    KGZ: 'Kyrgyzstan',
    SVK: 'Slovakia',
    SVN: 'Slovenia',
    BIH: 'Bosnia and Herzegovina',
    MKD: 'North Macedonia',
    ALB: 'Albania',
    MNE: 'Montenegro',
    XKX: 'Kosovo',
    LUX: 'Luxembourg',
    MLT: 'Malta',
    CYP: 'Cyprus',
};

// Region colors - warm wood palette
const REGION_COLORS: Record<string, string> = {
    USA: '#E3C195',
    CAN: '#C69C6D',
    MEX: '#D4B08C',
    BRA: '#A67C52',
    ARG: '#C69C6D',
    GBR: '#8B5A2B',
    FRA: '#D4B08C',
    DEU: '#E3C195',
    ITA: '#C69C6D',
    ESP: '#A67C52',
    RUS: '#8B5A2B',
    CHN: '#D4B08C',
    JPN: '#E3C195',
    KOR: '#C69C6D',
    IND: '#A67C52',
    AUS: '#8B5A2B',
    GRL: '#D4B08C',
};

const DEFAULT_COLOR = '#9CA3AF';

export default function WorldMapPage() {
    const [loading, setLoading] = useState(true);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });

    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const zoomRef = useRef<d3Zoom.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    // Process dots data with uniform density (sample every nth dot based on grid)
    const dots = useMemo(() => {
        const allDots = dotsData as Array<{ x: number; y: number; region: string }>;
        // Use a grid-based approach to ensure uniform density
        const gridSize = 1; // Adjust for density (smaller = more dots)
        const seen = new Set<string>();
        return allDots.filter((dot) => {
            const gridKey = `${Math.floor(dot.x / gridSize)},${Math.floor(dot.y / gridSize)}`;
            if (seen.has(gridKey)) return false;
            seen.add(gridKey);
            return true;
        }).map((dot, i) => ({
            ...dot,
            id: i,
        }));
    }, []);

    // Calculate bounds
    const bounds = useMemo(() => {
        if (dots.length === 0) return { minX: 0, maxX: 200, minY: 0, maxY: 100 };
        const xs = dots.map(d => d.x);
        const ys = dots.map(d => d.y);
        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys),
        };
    }, [dots]);

    // Get unique regions
    const regions = useMemo(() => {
        const uniqueRegions = new Set(dots.map(d => d.region));
        return Array.from(uniqueRegions);
    }, [dots]);

    // Count dots per region
    const regionCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        dots.forEach(d => {
            counts[d.region] = (counts[d.region] || 0) + 1;
        });
        return counts;
    }, [dots]);

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        setLoading(false);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Initialize zoom
    useEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const zoom = d3Zoom.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 20])
            .on('zoom', (event) => {
                if (gRef.current) {
                    d3Selection.select(gRef.current as any).attr('transform', event.transform.toString());
                    setTransform({ k: event.transform.k, x: event.transform.x, y: event.transform.y });
                }
            });

        zoomRef.current = zoom;
        const svg = d3Selection.select(svgRef.current);
        svg.call(zoom);

        // Initial fit - centered on Japan
        const japanX = 178 * 8; // Japan approximate x coordinate
        const japanY = 38 * 8;  // Japan approximate y coordinate
        const scale = 1.5; // Initial zoom level

        const translateX = dimensions.width / 2 - japanX * scale;
        const translateY = dimensions.height / 2 - japanY * scale;

        svg.call(zoom.transform, d3Zoom.zoomIdentity.translate(translateX, translateY).scale(scale));
    }, [dimensions]);

    const handleZoom = useCallback((factor: number) => {
        if (!svgRef.current || !zoomRef.current) return;
        const svg = d3Selection.select(svgRef.current);
        svg.transition().duration(300).call(zoomRef.current.scaleBy, factor);
    }, []);

    const handleReset = useCallback(() => {
        if (!svgRef.current || !zoomRef.current) return;
        const svg = d3Selection.select(svgRef.current);

        // Reset to Japan-centered view
        const japanX = 178 * 8;
        const japanY = 38 * 8;
        const scale = 1.5;

        const translateX = dimensions.width / 2 - japanX * scale;
        const translateY = dimensions.height / 2 - japanY * scale;

        svg.transition().duration(500).call(
            zoomRef.current.transform,
            d3Zoom.zoomIdentity.translate(translateX, translateY).scale(scale)
        );
    }, [dimensions]);

    const getColor = (region: string) => {
        if (hoveredRegion && region === hoveredRegion) {
            return '#6B7280';
        }
        return '#9CA3AF';
    };

    const getRadius = (region: string) => {
        const base = 3;
        if (hoveredRegion === region) {
            return base * 1.3;
        }
        return base;
    };

    return (
        <div className="min-h-screen font-serif relative overflow-hidden bg-[#F5F5F0]">
            {/* Subtle texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Header */}
            <header className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Link
                        href="/english"
                        className="flex items-center gap-2 px-4 py-2 bg-[#EEECE5] hover:bg-[#E3C195] border border-[#D4B08C] text-[#5D4037] rounded-sm shadow-sm transition-all font-serif tracking-widest text-xs uppercase"
                    >
                        <ArrowLeft size={14} />
                        <span>Dashboard</span>
                    </Link>
                </div>

                <div className="flex flex-col items-end pointer-events-auto">
                    <h1 className="text-3xl text-[#3E2723] font-serif tracking-widest uppercase mb-1 drop-shadow-sm">
                        World Map
                    </h1>
                    <div className="h-0.5 w-20 bg-[#8B5A2B] mb-2" />
                    <p className="text-[#8D6E63] text-xs uppercase tracking-widest">
                        Dot Matrix Visualization
                    </p>
                </div>
            </header>

            {/* Main Map */}
            <main className="w-full h-screen cursor-move">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 text-[#8B5A2B] animate-pulse">
                        <Loader2 className="animate-spin" />
                        <span className="font-serif tracking-widest">LOADING MAP...</span>
                    </div>
                ) : (
                    <svg
                        ref={svgRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        className="w-full h-full"
                    >
                        <g ref={gRef}>
                            {dots.map((dot) => (
                                <circle
                                    key={dot.id}
                                    cx={dot.x * 8}
                                    cy={dot.y * 8}
                                    r={getRadius(dot.region)}
                                    fill={getColor(dot.region)}
                                    onMouseEnter={() => setHoveredRegion(dot.region)}
                                    onMouseLeave={() => setHoveredRegion(null)}
                                    style={{
                                        transition: 'fill 0.15s ease, r 0.15s ease',
                                        cursor: 'pointer',
                                    }}
                                />
                            ))}
                        </g>
                    </svg>
                )}
            </main>

            {/* Zoom Controls */}
            <div className="absolute bottom-12 left-6 flex flex-col gap-2 z-20 pointer-events-auto">
                <button
                    onClick={() => handleZoom(1.5)}
                    className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195] transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn size={18} />
                </button>
                <button
                    onClick={() => handleZoom(0.67)}
                    className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195] transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut size={18} />
                </button>
                <button
                    onClick={handleReset}
                    className="p-3 bg-[#EEECE5] border border-[#D4B08C] rounded shadow text-[#5D4037] hover:bg-[#E3C195] transition-colors"
                    title="Reset View"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute bottom-12 right-6 z-20 pointer-events-none">
                <div className="bg-[#EEECE5]/80 backdrop-blur px-3 py-1.5 rounded border border-[#D4B08C] text-[#5D4037] text-xs font-mono">
                    {Math.round(transform.k * 100)}%
                </div>
            </div>

            {/* Hovered Region Info */}
            <AnimatePresence>
                {hoveredRegion && (
                    <div className="absolute top-24 right-6 z-20 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="bg-[#EEECE5]/95 backdrop-blur p-5 shadow-xl border border-[#8B5A2B] min-w-[200px]"
                        >
                            <h2 className="text-xl text-[#3E2723] font-serif font-bold uppercase tracking-wider mb-2 border-b border-[#D4B08C] pb-2">
                                {REGION_NAMES[hoveredRegion] || hoveredRegion}
                            </h2>
                            <div className="text-[#5D4037] text-sm font-serif tracking-wide space-y-1">
                                <p>Code: {hoveredRegion}</p>
                                <p>Dots: {regionCounts[hoveredRegion]?.toLocaleString() || 0}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Stats Panel */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="bg-[#EEECE5]/80 backdrop-blur px-4 py-2 rounded border border-[#D4B08C] text-[#5D4037] text-xs font-serif tracking-wider flex gap-6">
                    <span>{dots.length.toLocaleString()} dots</span>
                    <span>{regions.length} regions</span>
                </div>
            </div>
        </div>
    );
}
