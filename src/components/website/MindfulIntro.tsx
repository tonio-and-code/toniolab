'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import BreathingModal from './BreathingModal'

export default function MindfulIntro({ startAnimation = true }: { startAnimation?: boolean }) {
    const [show, setShow] = useState(false)
    const [isBreathing, setIsBreathing] = useState(false)

    useEffect(() => {
        if (startAnimation) {
            // 少し遅れて表示を開始する
            const timer = setTimeout(() => setShow(true), 500)
            return () => clearTimeout(timer)
        } else {
            setShow(false);
        }
    }, [startAnimation])

    const lines = [
        "ここは、何者にもならなくていい場所です。",
        "ただ、深呼吸をしに来てくださいwim hof 。",
        "今日も、いい天気ですね（雨でも雷でも）。",
        "職人は今日、ただ壁紙を貼ります。",
        "あなたの一日も、心地よいものでありますように。"
    ]

    return (
        <section className="relative w-full min-h-[80vh] bg-white flex items-center justify-center overflow-hidden py-20 select-none">

            <BreathingModal isOpen={isBreathing} onClose={() => setIsBreathing(false)} />

            {/* Background Ambience - Subtle breathing gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Background Image - Wim Hof - Moved after gradient and increased opacity */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none grayscale mix-blend-multiply"
                style={{ backgroundImage: 'url(https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/25176566-4c71-481a-189d-e10c0bce0100/public)' }}
            />

            {/* Subtle Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

            <div className="relative z-10 flex flex-row gap-8 md:gap-16 items-start h-[60vh] max-w-5xl mx-auto px-6">
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        className="writing-mode-vertical-rl text-[#252423] font-serif text-lg md:text-xl lg:text-2xl leading-loose tracking-widest"
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                        transition={{
                            duration: 1.5,
                            delay: i * 0.8, // ゆっくりと1行ずつ表示
                            ease: [0.2, 0.65, 0.3, 0.9],
                        }}
                    >
                        {line === "ただ、深呼吸をしに来てくださいwim hof 。" ? (
                            <span
                                className="relative cursor-pointer group inline-flex items-center gap-2 hover:text-blue-600 transition-colors duration-500 py-1"
                                onClick={() => setIsBreathing(true)}
                            >
                                <span className="border-b-2 border-blue-200 group-hover:border-blue-500 transition-colors duration-300 pb-0.5">
                                    {line}
                                </span>

                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>

                                <motion.span
                                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-blue-200/50 group-hover:bg-blue-400 group-hover:h-48 transition-all duration-500"
                                    animate={{ height: ['0%', '100%', '0%'], opacity: [0, 1, 0], top: ['0%', '50%', '100%'] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                                />

                                {/* Enhanced Tooltip */}
                                <span className="absolute -left-4 top-1/2 -translate-y-1/2 -translate-x-full writing-mode-horizontal flex items-center gap-2 text-[10px] text-blue-500 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-x-[10px] pointer-events-none bg-white/90 px-3 py-1.5 rounded-full shadow-lg border border-blue-100">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                    Start Breathing
                                </span>
                            </span>
                        ) : (
                            line
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Scroll Indicator - Minimal */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 5, duration: 1 }}
            >
                <div className="w-[1px] h-12 bg-black/50"></div>
                <span className="text-[10px] tracking-[0.3em] font-serif uppercase">Scroll</span>
            </motion.div>

            {/* Hidden Easter Egg: Cold Shower Anthem */}
            <motion.div
                className="absolute bottom-24 right-10 text-right opacity-40 font-serif italic text-xs md:text-sm text-blue-900/60 mix-blend-multiply pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4, x: [-1, 1, -1, 0] }} // Shivering animation
                transition={{
                    opacity: { delay: 4, duration: 2 },
                    x: { repeat: Infinity, duration: 0.2, repeatDelay: 3 } // Occasional shiver
                }}
            >
                <p>Somewhere over the rainbow</p>
                <p>Way up high</p>
                <p className="text-[10px] opacity-60 mt-1 not-italic">~ Cold Shower Session ~</p>
            </motion.div>
            {/* Wim Hof Article Link - Subtle */}
            <motion.a
                href="/blog/2025-12-10-wim-hof-method"
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-blue-200/50 shadow-sm hover:shadow-lg transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5, duration: 1, ease: "easeOut" }}
            >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40">
                    <img
                        src="https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/b3002011-564b-45df-5fd8-54b29df18000/public"
                        alt="Wim Hof"
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="font-serif text-sm text-gray-700 group-hover:text-blue-900 transition-colors">
                    氷点下の禅 — Wim Hofメソッド
                </span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </motion.a>
        </section>
    )
}
