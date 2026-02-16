'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { heroImages } from '@/data/home-data'
import { heroText } from '@/utils/animations'
import { AlertTriangle, Ghost } from 'lucide-react'

interface HeroSectionProps {
    onGlitchToggle?: () => void
    onHorrorToggle?: () => void
}

const heroTypingTexts = [
    "Reacting is boring. Creating is Freedom.",
    "New Wallpaper = New Life.\nDon't just change your wall.\nChange your Soul.\n(Seriously, it changes everything.)",
    "Change Space. Change Mind.\n(部屋が変われば、人生が変わる。)",
    "Future of Interior is Here.\n(内装の未来、始まります。)",
    "I am Iwasaki. Craftsman since 1994.\nWallpaper? Easy. CSS? Impossible.\nIf this site breaks, forgive me.\nMy wall-hanging skills are 100% perfect though.\n(Webは素人、現場は神。)"
]

export default function HeroSection({ onGlitchToggle, onHorrorToggle }: HeroSectionProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showImage, setShowImage] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!showImage) return

        const currentText = heroTypingTexts[currentImageIndex] || ""
        // Dynamic duration: 
        // Typing speed is now 15ms/char (High speed).
        // We add extra buffer (5000ms) for reading time after typing ends.
        // Minimum duration is 7000ms.
        const typingTime = currentText.length * 15
        const duration = Math.max(7000, typingTime + 5000)

        const timer = setTimeout(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, duration)

        return () => clearTimeout(timer)
    }, [showImage, currentImageIndex])

    // Avant-garde asymmetric polygon points
    const randomClip = "polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)"

    return (
        <section className="pt-12 px-2 sm:px-6 lg:px-8 pb-12 bg-[#F5F5F7] overflow-hidden">
            <div className="max-w-[1400px] mx-auto relative">
                {/* Decorative "Construction Lines" */}
                <div className="absolute top-0 left-10 w-px h-full bg-black/5 z-0" />
                <div className="absolute top-0 right-20 w-px h-full bg-black/5 z-0" />
                <div className="absolute top-20 left-0 w-full h-px bg-black/5 z-0" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* Text Area (Left - Overlapping) */}
                    <div className="lg:col-span-5 lg:pr-8 relative z-20 pointer-events-none order-2 lg:order-1">
                        <div className="pointer-events-auto">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-white/90 backdrop-blur-xl p-8 border-l-[6px] border-[#D4AF37] shadow-2xl relative"
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)' }}
                            >
                                <div className="absolute top-2 right-4 text-[10px] font-mono text-gray-400 tracking-widest">
                                    SYSTEM.VER.2.0.25
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#252423] leading-[1.1] tracking-tight mb-6 mt-2">
                                    <span className="text-[#E8B4B8]">色彩</span>×<span className="text-[#A8D5BA]">職人技</span>×<span className="text-[#B8C5E8]">AI</span>が、<br className="block" />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#252423] to-[#D4AF37]">暮らしを変える</span>
                                </h1>

                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-8 border-t border-gray-200 pt-4 leading-relaxed">
                                    色彩設計のプロと確かな施工技術。<br />
                                    そして、その奥にある「意識」が、理想の空間を創造する。
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/contact" className="group relative px-6 py-3 bg-[#252423] text-white font-bold overflow-hidden hover:bg-[#D4AF37] transition-colors shadow-lg rounded-sm">
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <div className="flex items-center gap-2">
                                            <span>お問い合わせ</span>
                                            <span className="text-xs opacity-50">→</span>
                                        </div>
                                    </Link>

                                    {/* Chaos Buttons Group */}
                                    <div className="flex gap-2">
                                        {onGlitchToggle && (
                                            <button
                                                onClick={onGlitchToggle}
                                                className="group px-3 py-2 border border-red-500/30 text-red-600 font-mono text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2 rounded-sm"
                                            >
                                                <AlertTriangle className="w-3 h-3" />
                                                <span className="hidden sm:inline group-hover:inline">EACH_OF</span>
                                            </button>
                                        )}
                                        {onHorrorToggle && (
                                            <button
                                                onClick={onHorrorToggle}
                                                className="group px-3 py-2 border border-purple-500/30 text-purple-600 font-mono text-xs font-bold hover:bg-purple-50 transition-colors flex items-center gap-2 rounded-sm"
                                            >
                                                <Ghost className="w-3 h-3" />
                                                <span className="hidden sm:inline group-hover:inline">CHAOS</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Image Area (Right - Glitch Frame) */}
                    <div className="lg:col-span-7 relative h-[60vh] lg:h-[80vh] order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 z-10"
                        >
                            <div className="relative w-full h-full group">
                                {/* The "Frame" that isn't a frame */}
                                <div
                                    className="absolute inset-0 bg-[#252423] transform translate-x-4 translate-y-4 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6"
                                    style={{ clipPath: randomClip }}
                                />

                                <div
                                    className="relative w-full h-full overflow-hidden bg-gray-900 shadow-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:-translate-x-2"
                                    style={{ clipPath: randomClip }}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {showImage && (
                                            <motion.img
                                                key={currentImageIndex}
                                                src={heroImages[currentImageIndex]}
                                                initial={{ opacity: 0, scale: 1.2, filter: 'grayscale(100%)' }}
                                                animate={{ opacity: 1, scale: 1, filter: 'grayscale(0%)' }}
                                                exit={{ opacity: 0, filter: 'grayscale(100%)' }}
                                                transition={{ duration: 3.5, ease: "easeOut" }}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                alt="Main Visual"
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* Typing Text Overlay */}
                                    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 text-center pointer-events-none z-30 px-4">
                                        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl inline-block max-w-[90%]">
                                            <TypingText
                                                key={currentImageIndex}
                                                text={heroTypingTexts[currentImageIndex]}
                                            />
                                        </div>
                                    </div>

                                    {/* Glitch Overlay Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent mix-blend-overlay pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                                    {/* Coordinates/Data Overlay */}
                                    <div className="absolute bottom-8 right-8 text-right font-mono text-[10px] text-white/60 pointer-events-none">
                                        <div className="flex flex-col gap-1">
                                            <span>IMG_SEQ: {currentImageIndex.toString().padStart(3, '0')}</span>
                                            <span>X: 139.7744° E</span>
                                            <span>Y: 35.6883° N</span>
                                            <span className="text-[#D4AF37] animate-pulse">● LIVE RENDERING</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}

function TypingText({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        let i = 0
        setDisplayedText('')

        const interval = setInterval(() => {
            setDisplayedText(text.substring(0, i + 1))
            i++
            if (i > text.length) clearInterval(interval)
        }, 15) // High speed typing (Updated to 15ms)

        return () => clearInterval(interval)
    }, [text])

    return (
        <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl font-black text-white/90 tracking-tighter px-4 font-mono whitespace-pre-wrap leading-tight">
            {displayedText}
            <span className="animate-pulse text-[#D4AF37]">_</span>
        </h2>
    )
}
