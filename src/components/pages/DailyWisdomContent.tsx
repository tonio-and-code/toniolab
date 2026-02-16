'use client';

import React from 'react';
import { useDailyWisdom } from '@/hooks/useDailyWisdom';

export default function DailyWisdomContent() {
    const { quote, dateString } = useDailyWisdom();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 text-gray-800 font-serif">
            {/* Background decoration - subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-purple-50/30 pointer-events-none" />

            <main className="relative z-10 flex flex-col items-center justify-center p-6 h-full w-full max-w-md mx-auto">

                {/* Date Display (Horizontal, Small) */}
                <div className="mb-12 text-gray-500 tracking-widest text-sm font-sans">
                    {dateString}
                </div>

                {/* Main Content Area - Vertical Writing */}
                <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[60vh]">
                    <div className="flex flex-row-reverse items-start justify-center gap-8 md:gap-12 py-8">

                        {/* Quote Content */}
                        <div
                            className="text-4xl md:text-5xl font-medium tracking-wider leading-relaxed py-4 select-none"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                        >
                            {quote.content}
                        </div>

                        {/* Source/Author */}
                        <div
                            className="text-lg md:text-xl text-gray-600 tracking-wide mt-12 md:mt-16"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                        >
                            ── {quote.source}
                        </div>

                    </div>
                </div>

                {/* Footer/Note */}
                <div className="mt-12 text-xs text-gray-400 font-sans opacity-70">
                    Daily Wisdom
                </div>

            </main>
        </div>
    );
}
