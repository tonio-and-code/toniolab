"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphismSectionProps {
    videoSrc: string;
    className?: string;
    title?: string;
    content?: string;
}

export function GlassmorphismSection({
    videoSrc,
    className,
    title = "BEFORE → AFTER",
    content = "Drag the slider to reveal the transformation",
}: GlassmorphismSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Handle slider drag
    const handleMove = (clientX: number) => {
        if (containerRef.current && isDragging) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
            setSliderPosition(percentage);
        }
    };

    // Scroll-based parallax
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const elementTop = rect.top;
                const elementHeight = rect.height;

                // Calculate how much of the element is in view
                const progress = Math.max(0, Math.min(1,
                    (viewportHeight - elementTop) / (viewportHeight + elementHeight)
                ));
                setScrollProgress(progress);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-screen overflow-hidden bg-neutral-950", className)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={() => setIsDragging(false)}
        >
            {/* Before Side (Grayscale/Raw) */}
            <div className="absolute inset-0">
                <video
                    className="w-full h-full object-cover"
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        filter: 'grayscale(100%) brightness(0.6) contrast(0.9)',
                        transform: `scale(${1.05 + scrollProgress * 0.1})`
                    }}
                />
                {/* Noise overlay */}
                <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                {/* Before Label */}
                <div className="absolute top-1/2 left-8 -translate-y-1/2 text-white/50">
                    <span className="text-xs tracking-[0.3em] uppercase">Before</span>
                    <div className="mt-2 text-2xl font-light">Raw Footage</div>
                </div>
            </div>

            {/* After Side (Color Graded) */}
            <div
                className="absolute inset-0"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
            >
                <video
                    className="w-full h-full object-cover"
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        filter: 'saturate(1.4) contrast(1.15) brightness(1.05)',
                        transform: `scale(${1.05 + scrollProgress * 0.1})`
                    }}
                />
                {/* Teal & Orange color grade overlay */}
                <div
                    className="absolute inset-0 mix-blend-color opacity-20"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0,128,128,0.3) 0%, transparent 50%, rgba(255,140,0,0.3) 100%)'
                    }}
                />
                {/* Vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
                    }}
                />

                {/* After Label */}
                <div className="absolute top-1/2 right-8 -translate-y-1/2 text-right text-white">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#D4AF37]">After</span>
                    <div className="mt-2 text-2xl font-light">Color Graded</div>
                    <div className="mt-1 text-sm text-white/60">Teal & Orange</div>
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize z-20 group"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
            >
                {/* Handle Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-neutral-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                        </svg>
                        <svg className="w-3 h-3 text-neutral-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                    </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 w-1 bg-[#D4AF37] blur-sm opacity-50" />
            </div>

            {/* Title Overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-30">
                <h2 className="text-white text-3xl md:text-4xl font-light tracking-widest">
                    {title}
                </h2>
                <p className="mt-2 text-white/50 text-sm tracking-wider">
                    {content}
                </p>
            </div>

            {/* DaVinci Resolve Reference */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                <div className="flex items-center gap-4 text-white/40 text-xs tracking-widest">
                    <span>POWERED BY</span>
                    <span className="text-[#D4AF37] font-medium">DaVinci Resolve</span>
                    <span>COLOR GRADING</span>
                </div>
            </div>

            {/* Percentage Indicators */}
            <div
                className="absolute bottom-20 z-30 text-white/60 text-sm font-mono transition-all duration-200"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                {Math.round(sliderPosition)}%
            </div>

            {/* Corner Labels */}
            <div className="absolute top-6 left-6 text-neutral-500 text-xs tracking-widest z-30">
                VISUAL EFFECT 03
            </div>
            <div className="absolute top-6 right-6 text-[#D4AF37]/50 text-xs tracking-widest z-30">
                COMPARISON VIEW
            </div>
        </div>
    );
}
