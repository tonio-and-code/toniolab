'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Check, Sparkles, Terminal, ArrowRightLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type RenovationData = {
    id: string
    name: string
    beforeImage: string
    afterImage: string
    description: string
    prompt: string
}

type RenovationModalProps = {
    isOpen: boolean
    onClose: () => void
    data: RenovationData | null
}

export default function RenovationModal({ isOpen, onClose, data }: RenovationModalProps) {
    const [sliderPosition, setSliderPosition] = useState(50)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setSliderPosition(50)
            setCopied(false)
        }
    }, [isOpen])

    if (!isOpen || !data) return null

    const handleCopy = () => {
        navigator.clipboard.writeText(data.prompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-5xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Image Comparison Section */}
                        <div className="relative w-full md:w-2/3 aspect-video md:aspect-auto bg-black group select-none">
                            <img
                                src={data.afterImage}
                                alt="After"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                            >
                                <img
                                    src={data.beforeImage}
                                    alt="Before"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>

                            {/* Slider Handle */}
                            <div
                                className="absolute inset-y-0 w-1 bg-white/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-ew-resize z-10"
                                style={{ left: `${sliderPosition}%` }}
                                onMouseDown={(e) => {
                                    const handleMouseMove = (e: MouseEvent) => {
                                        const el = e.target as HTMLElement;
                                        const container = el.closest('.group');
                                        if (container) {
                                            const rect = container.getBoundingClientRect();
                                            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                            setSliderPosition((x / rect.width) * 100);
                                        }
                                    };
                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };
                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                                onTouchMove={(e) => {
                                    const touch = e.touches[0];
                                    const container = (e.target as HTMLElement).closest('.group');
                                    if (container) {
                                        const rect = container.getBoundingClientRect();
                                        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
                                        setSliderPosition((x / rect.width) * 100);
                                    }
                                }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900">
                                    <ArrowRightLeft className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                ORIGINAL
                            </div>
                            <div className="absolute top-4 right-4 bg-[#10B981]/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-[#10B981]/20">
                                AI GENERATED
                            </div>
                        </div>

                        {/* Info & Prompt Section */}
                        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col bg-gray-900 border-l border-gray-800">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{data.name}</h2>
                                    <p className="text-sm text-gray-400">Nano Banana Pro Simulation</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {data.description}
                                </p>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center gap-2 mb-3 text-[#10B981] text-xs font-bold tracking-wider uppercase">
                                    <Terminal className="w-4 h-4" />
                                    Generated Prompt Code
                                </div>
                                <div className="relative group/code">
                                    <div className="bg-black rounded-lg border border-gray-800 p-4 font-mono text-xs text-gray-300 break-all leading-relaxed hover:border-[#10B981]/30 transition-colors">
                                        {data.prompt}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-[#10B981] text-gray-400 hover:text-white rounded-md transition-all opacity-0 group-hover/code:opacity-100"
                                        title="Copy Prompt"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="mt-3 text-[10px] text-gray-500 text-center">
                                    Use this code in Nano Banana Pro to generate high-resolution renders.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
