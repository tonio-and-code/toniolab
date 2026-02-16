"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SpotlightTypographyProps {
    text: string;
    subText?: string;
    videoSrc?: string;
    cloudflareId?: string;
    initialRadius?: number;
    className?: string;
    onEnded?: () => void;
}

export default function SpotlightTypography({
    text,
    subText,
    videoSrc,
    cloudflareId,
    initialRadius = 150,
    className,
    onEnded
}: SpotlightTypographyProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasEndedRef = useRef(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Safe onEnded call - only fires once
    const triggerEnded = useCallback(() => {
        if (!hasEndedRef.current) {
            hasEndedRef.current = true;
            onEnded?.();
        }
    }, [onEnded]);

    // Force video play (for direct video src)
    useEffect(() => {
        if (videoRef.current && videoSrc) {
            videoRef.current.playbackRate = 1.0;
        }
    }, [videoSrc]);

    // Cloudflare Stream Event Listener + Fallback Timer
    useEffect(() => {
        if (!cloudflareId) return;

        // Fallback: If postMessage events don't work, auto-transition after 5 seconds
        const fallbackTimer = setTimeout(() => {
            triggerEnded();
        }, 5000);

        const handleMessage = (event: MessageEvent) => {
            // Accept messages from Cloudflare Stream domains
            if (!event.origin.includes('cloudflarestream.com')) {
                return;
            }

            try {
                const data = JSON.parse(event.data);

                if (data.event === 'timeupdate') {
                    const { currentTime, duration } = data;
                    // Transition Logic: duration - 4s
                    if (duration > 5 && currentTime > 3.0 && currentTime >= duration - 4.0) {
                        triggerEnded();
                    }
                }

                // Also listen for ended event
                if (data.event === 'ended') {
                    triggerEnded();
                }
            } catch (e) {
                // Not a JSON message, or not from Stream
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            clearTimeout(fallbackTimer);
            window.removeEventListener('message', handleMessage);
        };
    }, [cloudflareId, triggerEnded]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-full overflow-hidden bg-black cursor-default",
                className
            )}
        >
            {/* Base Background */}
            <div className="absolute inset-0 bg-black z-0" />

            {/* Cinematic Video Layer - FULL SCREEN BACKGROUND */}
            <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                {cloudflareId ? (
                    <iframe
                        src={`https://customer-g3tngdysgdne3fza.cloudflarestream.com/${cloudflareId}/iframe?poster=https%3A%2F%2Fcustomer-g3tngdysgdne3fza.cloudflarestream.com%2F${cloudflareId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&autoplay=true&muted=true&controls=false`}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        style={{ filter: 'contrast(1.1) saturate(1.1) brightness(0.8)' }}
                    />
                ) : (
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 object-[65%_center] md:object-center"
                        src={videoSrc}
                        autoPlay
                        muted
                        playsInline
                        onTimeUpdate={(e) => {
                            const video = e.currentTarget;
                            // Safeguard: Ensure video has played for at least 3 seconds
                            // and we are within 4 seconds of the end
                            if (video.duration > 5 && video.currentTime > 3.0 && video.currentTime >= video.duration - 4.0) {
                                onEnded?.();
                            }
                        }}
                        style={{ filter: 'contrast(1.1) saturate(1.1) brightness(0.8)' }}
                    />
                )}

                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none" />
            </div>

            {/* Typography Layer - OVERLAY (Not Mask) */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                <div className="relative text-center mix-blend-overlay px-4">
                    <h1 className="text-4xl md:text-8xl tracking-[0.2em] md:tracking-[0.5em] font-serif font-light text-white uppercase select-none drop-shadow-lg w-full text-center">
                        {text}
                    </h1>
                    {subText && (
                        <p className="mt-4 md:mt-6 text-[10px] md:text-base tracking-[0.3em] md:tracking-[0.8em] text-white/70 font-sans uppercase">
                            {subText}
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
}

