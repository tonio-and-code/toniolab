'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// 2つの動画を交互に再生
const VIDEOS = [
    'e7ef8504173c6e0f14a347b46d46a021', // 動画生成の依頼と完了
    'f15a9dbc19165a494459c3d3dcb4c398', // 動画生成_動きを追加
]

export default function FeaturedVideoSection() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

    // 動画を8秒ごとに切り替え
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="relative w-full bg-gradient-to-b from-stone-900 via-stone-950 to-black py-16 md:py-24">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} />

            <div className="relative z-10 max-w-5xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-amber-400/80 font-bold mb-3">
                        <span className="w-8 h-[1px] bg-amber-400/50" />
                        Featured
                        <span className="w-8 h-[1px] bg-amber-400/50" />
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl text-white/90">
                        AI Video Journal
                    </h2>
                </motion.div>

                {/* Video Card */}
                <motion.a
                    href="/journal/044"
                    className="group relative block rounded-2xl bg-black/60 backdrop-blur-sm border border-white/10 hover:border-amber-400/50 shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 cursor-pointer overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Video Container */}
                    <div className="relative w-full aspect-video overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentVideoIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <iframe
                                    src={`https://customer-g3tngdysgdne3fza.cloudflarestream.com/${VIDEOS[currentVideoIndex]}/iframe?muted=true&autoplay=true&loop=true&controls=false&preload=auto`}
                                    className="w-full h-full object-cover pointer-events-none scale-150"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    style={{ border: 'none' }}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                        {/* Video indicator dots */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            {VIDEOS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                        i === currentVideoIndex
                                            ? 'bg-amber-400 scale-110 shadow-lg shadow-amber-400/50'
                                            : 'bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Play indicator on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-500/90 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">Journal 044</span>
                            </div>
                            <h3 className="font-serif text-xl md:text-3xl text-white leading-snug group-hover:text-amber-300 transition-colors mb-3">
                                $1Mの動画と職人の仕事
                            </h3>
                            <p className="text-sm md:text-base text-white/70 max-w-2xl group-hover:text-white/90 transition-colors mb-4">
                                ピラミッドの「上」をハックする——誰にも頼まれていない仕事の価値
                            </p>

                            {/* CTA Button */}
                            <div className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm md:text-base font-bold px-5 py-2.5 rounded-full transition-all group-hover:scale-105 shadow-lg">
                                <span>記事を読む</span>
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.a>
            </div>
        </section>
    )
}
