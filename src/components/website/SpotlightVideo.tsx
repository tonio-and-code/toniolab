"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SpotlightVideoProps {
    videoSrc: string;
    initialRadius?: number;
    className?: string;
    text?: string;
}

export function SpotlightVideo({
    videoSrc,
    initialRadius = 200,
    className,
    text = "DISCOVER",
}: SpotlightVideoProps) {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const trailIdRef = useRef(0);

    // Handle mouse movement with trail effect
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const newPos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            setMousePos(newPos);

            // Add trail
            trailIdRef.current++;
            setTrails(prev => [...prev.slice(-8), { ...newPos, id: trailIdRef.current }]);
        }
    }, []);

    // Clean up old trails
    useEffect(() => {
        const interval = setInterval(() => {
            setTrails(prev => prev.slice(-5));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Force video play
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // Autoplay might be blocked, that's okay
            });
        }
    }, [isVideoReady]);

    // Create gradient string for multiple spotlights
    const createSpotlightMask = () => {
        const mainSpot = `radial-gradient(circle ${initialRadius}px at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`;
        const trailSpots = trails.map((t, i) => {
            const size = initialRadius * (0.3 + (i / trails.length) * 0.4);
            const opacity = 0.3 + (i / trails.length) * 0.5;
            return `radial-gradient(circle ${size}px at ${t.x}px ${t.y}px, rgba(0,0,0,${opacity}) 10%, transparent 100%)`;
        });

        return [mainSpot, ...trailSpots].join(', ');
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-screen overflow-hidden bg-neutral-950 cursor-none",
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setMousePos({ x: -1000, y: -1000 });
            }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Background Hint Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <h2 className="text-neutral-900 text-[12vw] font-black tracking-widest select-none opacity-10">
                        {text}
                    </h2>
                    <p className="text-neutral-800 text-sm tracking-[0.5em] uppercase opacity-20">
                        Move your mouse to reveal
                    </p>
                </div>
            </div>

            {/* The Video Layer (Revealed by Spotlight) */}
            <div
                className="absolute inset-0 w-full h-full transition-all duration-75"
                style={{
                    maskImage: createSpotlightMask(),
                    WebkitMaskImage: createSpotlightMask(),
                    maskComposite: 'add',
                    WebkitMaskComposite: 'source-over',
                }}
            >
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onCanPlay={() => setIsVideoReady(true)}
                    onLoadedData={() => setIsVideoReady(true)}
                    style={{
                        filter: 'saturate(1.3) contrast(1.1)'
                    }}
                >
                    <source src={videoSrc} type="video/quicktime" />
                    <source src={videoSrc} type="video/mp4" />
                    <source src={videoSrc.replace('.mov', '.mp4')} type="video/mp4" />
                </video>

                {/* Golden overlay on revealed video */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent mix-blend-overlay" />

                {/* Text inside the video */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-[12vw] font-black tracking-widest select-none drop-shadow-2xl">
                        {text}
                    </h2>
                </div>
            </div>

            {/* Custom Cursor - Outer Ring */}
            <div
                className="absolute pointer-events-none rounded-full z-50 transition-all duration-200"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    width: initialRadius * 2,
                    height: initialRadius * 2,
                    transform: "translate(-50%, -50%)",
                    opacity: isHovering ? 1 : 0,
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    boxShadow: `
                        0 0 30px rgba(212, 175, 55, 0.2),
                        inset 0 0 60px rgba(212, 175, 55, 0.1)
                    `,
                }}
            />

            {/* Custom Cursor - Inner Ring */}
            <div
                className="absolute pointer-events-none rounded-full z-50 transition-all duration-100"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    width: 20,
                    height: 20,
                    transform: "translate(-50%, -50%)",
                    opacity: isHovering ? 1 : 0,
                    background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
                }}
            />

            {/* Trail Rings */}
            {trails.map((trail, i) => (
                <div
                    key={trail.id}
                    className="absolute pointer-events-none rounded-full z-40"
                    style={{
                        left: trail.x,
                        top: trail.y,
                        width: initialRadius * (0.5 + (i / trails.length) * 0.8),
                        height: initialRadius * (0.5 + (i / trails.length) * 0.8),
                        transform: "translate(-50%, -50%)",
                        opacity: (i / trails.length) * 0.3,
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                />
            ))}

            {/* Instructions */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300"
                style={{ opacity: isHovering ? 0 : 1 }}
            >
                <div className="flex items-center gap-3 text-neutral-500 text-sm">
                    <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
                    </div>
                    <span className="tracking-widest uppercase">Explore with cursor</span>
                </div>
            </div>

            {/* Corner Elements */}
            <div className="absolute top-6 left-6 text-[#D4AF37]/50 text-xs tracking-widest z-50">
                IWASAKI INTERIOR
            </div>
            <div className="absolute top-6 right-6 text-neutral-600 text-xs tracking-widest z-50">
                VISUAL EFFECT 02
            </div>
        </div>
    );
}
