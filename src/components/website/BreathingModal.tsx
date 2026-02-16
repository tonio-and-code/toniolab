'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface BreathingModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('ready')
    const [cycleCount, setCycleCount] = useState(0)

    // Ref to track if component is mounted/open to prevent state updates after close
    useEffect(() => {
        let isActive = true;

        if (!isOpen) {
            setPhase('ready')
            setCycleCount(0)
            return
        }

        // Breathing Cycle Logic (4-4-4 Rhythm)
        const runCycle = async () => {
            // Small delay before start
            if (isActive) await new Promise(r => setTimeout(r, 1000))

            while (isActive && isOpen) {
                if (!isActive) break;
                setPhase('inhale') // 4s
                await new Promise(r => setTimeout(r, 4000))

                if (!isActive || !isOpen) break

                setPhase('hold') // 4s
                await new Promise(r => setTimeout(r, 4000))

                if (!isActive || !isOpen) break

                setPhase('exhale') // 4s
                await new Promise(r => setTimeout(r, 4000))

                if (!isActive || !isOpen) break

                setCycleCount(c => c + 1)
            }
        }

        runCycle()

        return () => { isActive = false }

    }, [isOpen])

    // Phase text
    const getPhaseText = () => {
        switch (phase) {
            case 'ready': return 'Ready... (準備)'
            case 'inhale': return 'Inhale (吸って)'
            case 'hold': return 'Hold (止めて)'
            case 'exhale': return 'Exhale (吐いて)'
        }
    }

    // Circle scaling
    const getScale = () => {
        switch (phase) {
            case 'ready': return 1
            case 'inhale': return 2.5   // Expand
            case 'hold': return 2.5     // Stay expanded
            case 'exhale': return 1   // Contract
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose} // Click background to close
                >
                    {/* Main Breathing Circle */}
                    <div className="relative flex items-center justify-center pointer-events-none">
                        {/* Outer Glow Ring */}
                        <motion.div
                            className="absolute w-64 h-64 border border-blue-200/30 rounded-full"
                            animate={{
                                scale: getScale(),
                                opacity: phase === 'hold' ? 0.6 : 0.1,
                                borderColor: phase === 'hold' ? 'rgba(147, 197, 253, 0.8)' : 'rgba(191, 219, 254, 0.3)'
                            }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                        />

                        {/* Ambient Particles (Optional for visual flair) */}
                        <div className="absolute inset-0 w-full h-full animate-pulse opacity-20">
                            <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full blur-[1px]" />
                        </div>


                        {/* Core Circle */}
                        <motion.div
                            className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-[0_0_80px_rgba(34,211,238,0.4)] flex items-center justify-center"
                            animate={{
                                scale: getScale(),
                                boxShadow: phase === 'exhale'
                                    ? '0 0 20px rgba(34,211,238,0.2)'
                                    : '0 0 100px rgba(34,211,238,0.6)'
                            }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                        >
                            <div className="bg-white/10 w-full h-full rounded-full backdrop-blur-sm" />
                        </motion.div>

                        {/* Text Overlay */}
                        <div className="absolute flex flex-col items-center justify-center mt-96 md:mt-[450px]">
                            <motion.p
                                className="text-white font-serif tracking-[0.2em] text-xl md:text-3xl whitespace-nowrap drop-shadow-lg"
                                key={phase} // Re-animate on phase change
                                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                                transition={{ duration: 0.8 }}
                            >
                                {getPhaseText()}
                            </motion.p>

                            {cycleCount > 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    className="text-white/50 text-sm mt-4 font-mono"
                                >
                                    Cycle: {cycleCount}
                                </motion.p>
                            )}
                        </div>

                        <p className="absolute bottom-[-30vh] text-white/30 text-[10px] tracking-widest uppercase animate-pulse">
                            Click anywhere to finish
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
