'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

// Dynamic import with SSR disabled for Three.js component
const Character3DShowcase = dynamic(
    () => import('@/components/three/Character3DShowcase'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[600px] bg-gradient-to-b from-stone-900 to-black rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-amber-400 animate-pulse">3D空間を構築中...</p>
                    <p className="text-stone-500 text-sm mt-2">INITIALIZING METAVERSE</p>
                </div>
            </div>
        )
    }
)

interface CrewShowcaseProps {
    onSelectCharacter?: (id: string) => void
}

export default function CrewShowcase({ onSelectCharacter }: CrewShowcaseProps) {
    const [error, setError] = useState<string | null>(null)

    // WebGL check on mount
    if (typeof window !== 'undefined') {
        try {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            if (!gl && !error) {
                setError('WebGL is not supported on this device')
            }
        } catch (e) {
            if (!error) {
                setError('Failed to initialize WebGL')
            }
        }
    }

    if (error) {
        return (
            <div className="w-full h-[400px] bg-gradient-to-b from-stone-800 to-stone-900 rounded-2xl flex items-center justify-center border border-stone-700">
                <div className="text-center p-8">
                    <div className="text-4xl mb-4">🎮</div>
                    <p className="text-white text-lg font-bold mb-2">3Dビューは利用できません</p>
                    <p className="text-stone-400 text-sm">{error}</p>
                    <p className="text-stone-500 text-xs mt-4">
                        別のブラウザまたはデバイスでお試しください
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">LIVE</span>
            </div>

            {/* 3D Canvas */}
            <Character3DShowcase
                onSelectCharacter={onSelectCharacter}
                className="relative"
            />

            {/* Instructions */}
            <div className="text-center mt-4 text-stone-400 text-sm">
                <span className="inline-flex items-center gap-2">
                    <span className="text-amber-400">⟲</span>
                    マウスを動かして視点を変更
                    <span className="mx-2">|</span>
                    <span className="text-amber-400">👆</span>
                    キャラクターをクリックで詳細
                </span>
            </div>
        </div>
    )
}
