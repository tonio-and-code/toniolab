"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypographyVideoMaskProps {
    text: string;
    videoSrc: string;
    mode?: "light" | "dark";
    className?: string;
    subText?: string;
}

export function TypographyVideoMask({
    text,
    videoSrc,
    mode = "light",
    className,
    subText,
}: TypographyVideoMaskProps) {
    const [scrollY, setScrollY] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const scrollProgress = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
                setScrollY(scrollProgress);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Glitch effect characters
    const glitchChars = "アイウエオカキクケコ墨壺職人匠";

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-screen overflow-hidden flex items-center justify-center font-bold",
                mode === "light" ? "bg-white" : "bg-neutral-950",
                className
            )}
        >
            {/* Video Layer with Parallax */}
            <video
                className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
                style={{
                    transform: `scale(${1.1 + scrollY * 0.2}) translateY(${scrollY * 50}px)`,
                    opacity: isLoaded ? 1 : 0,
                    filter: `saturate(${1.2 + scrollY * 0.5}) contrast(${1.1 + scrollY * 0.2})`
                }}
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setIsLoaded(true)}
            />

            {/* Animated Grid Overlay */}
            <div
                className="absolute inset-0 z-5 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    transform: `translateY(${scrollY * 100}px)`
                }}
            />

            {/* Mask Layer with Glitch Effect */}
            <div
                className={cn(
                    "absolute inset-0 z-10 flex flex-col items-center justify-center",
                    mode === "light"
                        ? "bg-white mix-blend-screen text-black"
                        : "bg-neutral-950 mix-blend-multiply text-white"
                )}
            >
                {/* Glitch Shadow Layers */}
                <div className="relative">
                    {/* Red Glitch Layer */}
                    <h1
                        className="absolute text-[15vw] leading-none tracking-tighter uppercase select-none text-red-500/30"
                        style={{
                            transform: `translate(${Math.sin(Date.now() / 500) * 3}px, 0)`,
                            clipPath: 'inset(0 0 50% 0)'
                        }}
                        aria-hidden="true"
                    >
                        {text}
                    </h1>

                    {/* Cyan Glitch Layer */}
                    <h1
                        className="absolute text-[15vw] leading-none tracking-tighter uppercase select-none text-cyan-500/30"
                        style={{
                            transform: `translate(${-Math.sin(Date.now() / 500) * 3}px, 0)`,
                            clipPath: 'inset(50% 0 0 0)'
                        }}
                        aria-hidden="true"
                    >
                        {text}
                    </h1>

                    {/* Main Text */}
                    <h1 className="text-[15vw] leading-none tracking-tighter uppercase select-none relative">
                        {text.split('').map((char, i) => (
                            <span
                                key={i}
                                className="inline-block hover:text-[#D4AF37] transition-colors duration-200"
                                style={{
                                    transform: `translateY(${Math.sin((Date.now() / 1000) + i) * 2}px)`,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </h1>
                </div>

                {subText && (
                    <p
                        className="mt-6 text-xl md:text-2xl font-light tracking-[0.3em] opacity-80"
                        style={{
                            transform: `translateY(${scrollY * -30}px)`,
                            opacity: 1 - scrollY * 2
                        }}
                    >
                        {subText}
                    </p>
                )}

                {/* Scroll Indicator */}
                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ opacity: 1 - scrollY * 3 }}
                >
                    <span className="text-xs tracking-widest opacity-50">SCROLL</span>
                    <div className="w-px h-10 bg-current opacity-30 animate-pulse" />
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#D4AF37]/50 z-20" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#D4AF37]/50 z-20" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#D4AF37]/50 z-20" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#D4AF37]/50 z-20" />

            {/* Golden Particles */}
            <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-[#D4AF37] rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            opacity: 0.3 + Math.random() * 0.5
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
                }
                .animate-float {
                    animation: float linear infinite;
                }
            `}</style>
        </div>
    );
}
