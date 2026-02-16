'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface Post {
    slug: string
    title: string
    date: string
    image?: string
    description?: string
    businessTags?: string[]
}

export default function InsightsPreviewSection() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const itemsPerPage = 3

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/insights/latest')
                const data = await res.json()
                setPosts(data)
            } catch {
                // silent
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [])

    const totalPages = Math.ceil(posts.length / itemsPerPage)

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
    }, [totalPages])

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }

    // Auto-play logic
    useEffect(() => {
        if (!isPaused && totalPages > 1) {
            const timer = setInterval(() => {
                nextPage()
            }, 5000)
            return () => clearInterval(timer)
        }
    }, [isPaused, nextPage, totalPages])

    const currentPosts = posts.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )

    if (isLoading) return null

    return (
        <section className="py-24 bg-[#0a0a0a] relative overflow-hidden text-white">
            {/* Background Decoration */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="w-12 h-px bg-[#D4AF37]" />
                            <span className="text-[#D4AF37] font-serif tracking-[0.2em] text-sm uppercase">Not Just a Blog</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-serif font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
                        >
                            Iwasaki <span className="italic text-[#D4AF37]">Insights</span>
                        </motion.h2>
                    </div>

                    <div className="flex items-center gap-6 mt-6 md:mt-0">
                        {/* Premium Progress Bar Indicator */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-serif text-white/40">
                                    {String(currentPage + 1).padStart(2, '0')} <span className="text-[#D4AF37]/50">/</span> {String(totalPages).padStart(2, '0')}
                                </span>
                            </div>

                            {/* The Progress Bar Line */}
                            <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                                {!isPaused && (
                                    <motion.div
                                        key={currentPage} // Reset animation on page change
                                        className="absolute inset-y-0 left-0 bg-[#D4AF37]"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 5, ease: "linear" }}
                                    />
                                )}
                                {isPaused && ( // Show full bar or current state when paused? Let's show full to indicate "holding"
                                    <div className="absolute inset-y-0 left-0 bg-[#D4AF37]/50 w-full" />
                                )}
                            </div>
                        </div>


                        {/* Navigation Controls */}
                        <div className="flex gap-2">
                            <button
                                onClick={prevPage}
                                className="p-2 rounded-full border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-white/60 hover:text-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextPage}
                                className="p-2 rounded-full border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-white/60 hover:text-white"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <Link href="/blog" className="hidden md:flex group items-center gap-2 text-sm text-[#D4AF37] hover:text-white transition-colors duration-300 tracking-wider uppercase font-medium ml-4">
                            View All Articles
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Carousel Area */}
                <div
                    className="relative min-h-[400px]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // "Premium" easing (easeOutQuint-ish)
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                        >
                            {currentPosts.map((post, index) => (
                                <Link
                                    key={`${post.slug}-${index}`}
                                    href={`/blog/${post.slug}`}
                                    className="group relative block w-full"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-900 border border-white/10 group-hover:border-[#D4AF37] transition-colors duration-300">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black" />
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                            {post.businessTags?.slice(0, 2).map((tag) => (
                                                <span key={tag} className="px-1.5 py-0.5 bg-black/80 backdrop-blur border border-white/10 text-[8px] uppercase tracking-wider text-[#D4AF37]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="text-[10px] font-serif italic text-white/60 mb-1">{post.date}</div>
                                            <h3 className="text-sm md:text-base font-serif font-medium text-white group-hover:text-[#D4AF37] transition-colors leading-relaxed line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile View All Link */}
                <div className="md:hidden mt-8 flex justify-center">
                    <Link href="/blog" className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-white transition-colors duration-300 tracking-wider uppercase font-medium">
                        View All Articles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section >
    )
}
