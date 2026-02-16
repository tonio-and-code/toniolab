"use client";

import React from "react";
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
    title = "ATMOSPHERE",
    content = "The interplay of light and shadow creates a space where silence speaks. We build not just walls, but the air between them.",
}: GlassmorphismSectionProps) {
    return (
        <div className={cn("relative w-full h-screen overflow-hidden", className)}>
            {/* Background Video Layer */}
            <video
                className="absolute inset-0 w-full h-full object-cover"
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Dark Overlay for Video Readability */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Glass Panel Layer */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className="
                relative overflow-hidden
                p-8 md:p-12 max-w-2xl w-full
                bg-white/10 dark:bg-black/30
                backdrop-blur-xl
                border border-white/20
                rounded-2xl
                shadow-2xl
                text-white
            "
                >
                    {/* Subtle Gradient Overlay on glass for sheen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 text-center space-y-6">
                        <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] uppercase">
                            {title}
                        </h2>
                        <div className="w-16 h-px bg-white/50 mx-auto" />
                        <p className="text-lg md:text-xl font-light leading-relaxed tracking-wide opacity-90">
                            {content}
                        </p>
                        <button className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all duration-300 text-sm tracking-widest uppercase backdrop-blur-sm">
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
