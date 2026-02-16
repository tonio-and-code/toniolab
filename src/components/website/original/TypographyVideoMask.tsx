"use client";

import React from "react";
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
    return (
        <div
            className={cn(
                "relative w-full h-screen overflow-hidden flex items-center justify-center font-bold",
                mode === "light" ? "bg-white" : "bg-black",
                className
            )}
        >
            {/* Video Layer */}
            <video
                className="absolute inset-0 w-full h-full object-cover z-0"
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Mask Layer */}
            <div
                className={cn(
                    "absolute inset-0 z-10 flex flex-col items-center justify-center",
                    mode === "light"
                        ? "bg-white mix-blend-screen text-black"
                        : "bg-black mix-blend-multiply text-white"
                )}
            >
                <h1 className="text-[15vw] leading-none tracking-tighter uppercase select-none">
                    {text}
                </h1>
                {subText && (
                    <p className="mt-4 text-xl md:text-2xl font-light tracking-widest opacity-80">
                        {subText}
                    </p>
                )}
            </div>
        </div>
    );
}
