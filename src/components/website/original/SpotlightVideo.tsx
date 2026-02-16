"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightVideoProps {
    videoSrc: string;
    initialRadius?: number;
    className?: string;
    text?: string;
}

export function SpotlightVideo({
    videoSrc,
    initialRadius = 250,
    className,
    text = "FIND THE LIGHT",
}: SpotlightVideoProps) {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-screen overflow-hidden bg-black cursor-none",
                className
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Background Hint (Darkened) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2 className="text-neutral-900 text-6xl font-black tracking-widest select-none opacity-20">
                    {text}
                </h2>
            </div>

            {/* The Video Layer (Revealed by Spotlight) */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    maskImage: `radial-gradient(circle ${initialRadius}px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(circle ${initialRadius}px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 100%)`,
                }}
            >
                <video
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                {/* White text inside the video for contrast */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white mix-blend-overlay text-6xl font-black tracking-widest select-none opacity-80">
                        {text}
                    </h2>
                </div>
            </div>

            {/* Custom Cursor / Flashlight Rim */}
            <div
                className="absolute pointer-events-none rounded-full border border-white/20 z-50 transition-opacity duration-300"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    width: initialRadius * 2,
                    height: initialRadius * 2,
                    transform: "translate(-50%, -50%)",
                    opacity: isHovering ? 1 : 0,
                    boxShadow: "0 0 40px rgba(255,255,255,0.1) inset"
                }}
            />
        </div>
    );
}
