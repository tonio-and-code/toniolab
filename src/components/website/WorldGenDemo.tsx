'use client'

import { useState, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Float, PerspectiveCamera, Stars } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Upload, Wand2 } from 'lucide-react'

function GeneratedScene() {
    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Abstract "Generated" Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
            </mesh>
            <gridHelper args={[50, 50, "#fbbf24", "#1e293b"]} position={[0, -1.99, 0]} />

            {/* Floating "Generated" Islands/Structures */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group position={[0, 0, 0]}>
                    {/* Main Platform */}
                    <mesh position={[0, -1, 0]}>
                        <cylinderGeometry args={[4, 3, 1, 6]} />
                        <meshStandardMaterial color="#1e293b" wireframe />
                    </mesh>
                    <mesh position={[0, -1, 0]}>
                        <cylinderGeometry args={[3.9, 2.9, 0.9, 6]} />
                        <meshStandardMaterial color="#0f172a" />
                    </mesh>

                    {/* Abstract Trees/Objects */}
                    <mesh position={[-2, 0.5, -1]}>
                        <coneGeometry args={[0.5, 2, 4]} />
                        <meshStandardMaterial color="#fbbf24" wireframe />
                    </mesh>
                    <mesh position={[2, 1, 1]}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="#10B981" wireframe />
                    </mesh>
                    <mesh position={[0, 2, -3]}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial color="#3b82f6" wireframe />
                    </mesh>
                </group>
            </Float>

            {/* Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <Float key={i} speed={1} rotationIntensity={2} floatIntensity={2} position={[
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 5 + 2,
                    (Math.random() - 0.5) * 10
                ]}>
                    <mesh>
                        <octahedronGeometry args={[0.1]} />
                        <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
                    </mesh>
                </Float>
            ))}
        </group>
    )
}

function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-amber-500 text-xs font-mono animate-pulse">ワールド生成中...</div>
            </div>
        </Html>
    )
}

export default function WorldGenDemo() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationStep, setGenerationStep] = useState(0)
    const [generationPrompt, setGenerationPrompt] = useState('')
    const [hasGenerated, setHasGenerated] = useState(false)

    const handleGenerate = () => {
        setIsGenerating(true)
        setGenerationStep(0)

        // Simulate generation process
        const steps = [
            'Analyzing Prompt...',
            'Constructing Geometry...',
            'Baking Lighting...',
            'Finalizing World...'
        ]

        let currentStep = 0
        const interval = setInterval(() => {
            currentStep++
            setGenerationStep(currentStep)
            if (currentStep >= steps.length) {
                clearInterval(interval)
                setIsGenerating(false)
                setHasGenerated(true)
            }
        }, 1500)
    }

    return (
        <div className="relative w-full h-[600px] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">

            {/* Header UI */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                <div className="bg-amber-900/80 backdrop-blur-md text-amber-400 px-4 py-2 rounded-sm text-xs font-mono border border-amber-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    AIワールド生成: {hasGenerated ? '完了' : '待機中'}
                </div>
                <div className="text-[10px] text-gray-500 font-mono pl-1">
                    ENGINE: MARBLE-SIM | V 1.0.0-BETA
                </div>
            </div>

            {/* Generation UI Overlay */}
            <AnimatePresence>
                {!isGenerating && !hasGenerated && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <div className="w-full max-w-md bg-black/90 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="w-8 h-8 text-amber-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">ワールドを作成</h3>
                                <p className="text-gray-400 text-sm">
                                    プロンプトを入力するか画像をアップロードして、没入型の3D環境を生成します。
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group cursor-pointer border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-amber-500/50 transition-colors text-center bg-gray-900/50">
                                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3 group-hover:text-amber-500 transition-colors" />
                                    <div className="text-sm text-gray-400">画像をドロップ または クリックしてアップロード</div>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ワールドを表現してください (例: 'サイバーパンクな日本庭園')..."
                                        value={generationPrompt}
                                        onChange={(e) => setGenerationPrompt(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!generationPrompt}
                                        className="absolute right-2 top-2 bottom-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white rounded-lg px-3 flex items-center justify-center transition-colors"
                                    >
                                        <Wand2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Processing Overlay */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center"
                    >
                        <div className="relative w-32 h-32 mb-8">
                            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-amber-500 animate-pulse" />
                        </div>
                        <div className="text-amber-500 font-mono text-xl font-bold animate-pulse tracking-widest">
                            {['初期化中...', 'プロンプト解析中...', 'ジオメトリ構築中...', 'ライティング計算中...', '仕上げ中...'][generationStep] || '処理中...'}
                        </div>
                        <div className="mt-3 text-gray-500 text-sm font-mono">
                            AI WORLD GENERATION IN PROGRESS
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom UI (Generation Mode) */}
            {hasGenerated && (
                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-amber-500/30 max-w-md pointer-events-auto">
                        <div className="text-amber-500 text-xs font-bold mb-1 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            生成されたワールド
                        </div>
                        <div className="text-white text-sm leading-relaxed">
                            "{generationPrompt || '未来的な抽象空間'}"
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setHasGenerated(false)
                            setGenerationPrompt('')
                        }}
                        className="pointer-events-auto bg-gray-900/80 hover:bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 text-xs font-bold transition-colors flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        リセット
                    </button>
                </div>
            )}

            {/* 3D Scene */}
            <div className="w-full h-full cursor-move">
                <Canvas shadows>
                    {/* Explicit Background Color to prevent black screen */}
                    <color attach="background" args={['#000000']} />

                    <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={60} />
                    <Suspense fallback={<Loader />}>
                        {hasGenerated ? (
                            <GeneratedScene />
                        ) : (
                            // Placeholder background when not generated
                            <group>
                                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
                                <gridHelper args={[50, 50, "#333", "#111"]} position={[0, -2, 0]} />
                            </group>
                        )}
                    </Suspense>
                    <OrbitControls
                        enablePan={true}
                        enableDamping={true}
                        dampingFactor={0.05}
                        minDistance={2}
                        maxDistance={20}
                        autoRotate={!hasGenerated}
                        autoRotateSpeed={0.5}
                    />
                </Canvas>
            </div>
        </div>
    )
}
