'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Layers, Ruler, Maximize, RotateCw, Loader2, MousePointer2 } from 'lucide-react'

export default function DigitalTwinViewer() {
    const [isLoading, setIsLoading] = useState(true)
    const [activeMode, setActiveMode] = useState<'normal' | 'xray' | 'measure'>('normal')
    const [rotation, setRotation] = useState(0)

    useEffect(() => {
        // Simulate loading heavy 3D data
        const timer = setTimeout(() => setIsLoading(false), 2500)
        return () => clearTimeout(timer)
    }, [])

    const handleRotate = () => {
        setRotation(prev => prev + 90)
    }

    return (
        <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    LIVE CONNECTED
                </div>
                <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono border border-white/10">
                    NANOBANANA PRO v2.4
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                    onClick={() => setActiveMode('normal')}
                    className={`p-2 rounded-lg backdrop-blur-md transition-all ${activeMode === 'normal' ? 'bg-[#10B981] text-white' : 'bg-black/50 text-gray-400 hover:bg-black/70'}`}
                    title="通常表示"
                >
                    <Box className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setActiveMode('xray')}
                    className={`p-2 rounded-lg backdrop-blur-md transition-all ${activeMode === 'xray' ? 'bg-[#3B82F6] text-white' : 'bg-black/50 text-gray-400 hover:bg-black/70'}`}
                    title="透視モード (X-Ray)"
                >
                    <Layers className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setActiveMode('measure')}
                    className={`p-2 rounded-lg backdrop-blur-md transition-all ${activeMode === 'measure' ? 'bg-[#D4AF37] text-white' : 'bg-black/50 text-gray-400 hover:bg-black/70'}`}
                    title="計測モード"
                >
                    <Ruler className="w-5 h-5" />
                </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <button
                    onClick={handleRotate}
                    className="p-2 rounded-lg bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all"
                >
                    <RotateCw className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all">
                    <Maximize className="w-5 h-5" />
                </button>
            </div>

            {/* Main Viewport */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative perspective-1000">

                {/* Grid Floor */}
                <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none transform perspective-3d rotate-x-60" />

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <Loader2 className="w-12 h-12 text-[#10B981] animate-spin" />
                            <p className="text-[#10B981] font-mono text-sm animate-pulse">GENERATING DIGITAL TWIN...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="model"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, rotateY: rotation }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="relative w-64 h-64 preserve-3d cursor-grab active:cursor-grabbing"
                        >
                            {/* Simulated 3D Room/Object */}
                            <div className={`w-full h-full border-4 transition-all duration-500 ${activeMode === 'xray'
                                    ? 'border-[#3B82F6]/50 bg-[#3B82F6]/10'
                                    : activeMode === 'measure'
                                        ? 'border-[#D4AF37] bg-gray-800'
                                        : 'border-gray-700 bg-gray-800'
                                } relative transform-style-3d shadow-2xl`}>

                                {/* Internal Walls/Structure */}
                                <div className="absolute inset-4 border-2 border-dashed border-gray-600 opacity-50" />

                                {/* Content based on mode */}
                                {activeMode === 'normal' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <Box className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                                            <p className="text-gray-500 text-xs">Living Room A-101</p>
                                        </div>
                                    </div>
                                )}

                                {activeMode === 'xray' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="grid grid-cols-2 gap-4 w-full h-full p-4 opacity-50">
                                            <div className="border border-[#3B82F6] rounded bg-[#3B82F6]/20 animate-pulse" />
                                            <div className="border border-[#3B82F6] rounded bg-[#3B82F6]/20 animate-pulse delay-75" />
                                            <div className="border border-[#3B82F6] rounded bg-[#3B82F6]/20 animate-pulse delay-150" />
                                            <div className="border border-[#3B82F6] rounded bg-[#3B82F6]/20 animate-pulse delay-200" />
                                        </div>
                                    </div>
                                )}

                                {activeMode === 'measure' && (
                                    <div className="absolute inset-0">
                                        <div className="absolute top-1/2 left-0 w-full h-px bg-[#D4AF37] flex items-center justify-center">
                                            <span className="bg-[#D4AF37] text-black text-[10px] px-1 rounded font-bold">3200mm</span>
                                        </div>
                                        <div className="absolute left-1/2 top-0 w-px h-full bg-[#D4AF37] flex items-center justify-center">
                                            <span className="bg-[#D4AF37] text-black text-[10px] px-1 rounded font-bold rotate-90">2400mm</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interaction Hint */}
                {!isLoading && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/30 text-xs flex items-center gap-2 pointer-events-none">
                        <MousePointer2 className="w-3 h-3" />
                        DRAG TO ROTATE
                    </div>
                )}
            </div>
        </div>
    )
}
