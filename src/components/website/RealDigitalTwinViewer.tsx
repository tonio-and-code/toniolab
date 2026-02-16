'use client'

import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, ContactShadows, Environment, Float, OrthographicCamera, PerspectiveCamera, Sparkles, Text } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X, Layers, Ruler, MousePointer2, Scan, Terminal, Sparkles as SparklesIcon, Copy, Check, Eye, Grid, Box, Map, RefreshCw } from 'lucide-react'
import * as THREE from 'three'
import RenovationChat from './RenovationChat'
import RenovationModal from './RenovationModal'

// --- Data ---

const ROOM_DATA = {
    'wall-yellow': {
        id: 'wall-yellow',
        name: 'Accent Wall / Living',
        beforeImage: '/renovation-examples/living-before.png',
        afterImage: '/renovation-examples/living-after.png',
        description: '無機質な空間に温かみを与えるためのアクセントウォール提案。イエローの塗装により、視覚的なフォーカルポイントを作成し、空間全体を明るい印象にします。',
        prompt: '/imagine prompt: interior design, living room, yellow accent wall, benjamin moore paint, matte finish, modern furniture, warm lighting, 8k resolution --v 6.0'
    },
    'kitchen': {
        id: 'kitchen',
        name: 'Island Kitchen',
        beforeImage: '/renovation-examples/living-before.png',
        afterImage: '/renovation-examples/living-after.png',
        description: '既存の壁付けキッチンから、対面式のアイランドキッチンへの変更提案。家族とのコミュニケーションを重視したレイアウトです。',
        prompt: '/imagine prompt: modern kitchen design, island kitchen, matte black finish, stainless steel countertop, pendant lights, open concept, photorealistic --v 6.0'
    }
}

// --- Components ---

function ScanningPlane() {
    const meshRef = useRef<THREE.Mesh>(null)
    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.5) * 4
        }
    })

    return (
        <mesh ref={meshRef} rotation={[0, 0, 0]} position={[0, 2, 0]}>
            <boxGeometry args={[10, 6, 0.05]} />
            <meshBasicMaterial color="#10B981" transparent opacity={0.1} side={THREE.DoubleSide} />
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(10, 6, 0.05)]} />
                <lineBasicMaterial color="#10B981" transparent opacity={0.3} />
            </lineSegments>
        </mesh>
    )
}

function LidarObject({ position, rotation, size, color = "#374151", onClick, id, isSelected }: any) {
    const [hovered, setHovered] = useState(false)
    const isInteractive = !!id && !!ROOM_DATA[id as keyof typeof ROOM_DATA]
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (hovered && meshRef.current) {
            meshRef.current.material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 10) * 0.1
        }
    })

    // Determine colors based on state
    const edgeColor = isInteractive ? (hovered ? "#10B981" : "#059669") : "#4b5563"
    const fillColor = isInteractive ? (hovered ? "#10B981" : "#064e3b") : "#111827"
    const opacity = isInteractive ? (hovered ? 0.3 : 0.1) : 0.5

    return (
        <group position={position} rotation={rotation}>
            {/* Wireframe / Edges */}
            <mesh
                ref={meshRef}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = isInteractive ? 'pointer' : 'auto' }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto' }}
                onClick={(e) => {
                    if (isInteractive && onClick) {
                        e.stopPropagation()
                        onClick(id)
                    }
                }}
            >
                <boxGeometry args={size} />
                <meshBasicMaterial color={fillColor} transparent opacity={opacity} wireframe={false} />
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
                    <lineBasicMaterial color={edgeColor} linewidth={1} />
                </lineSegments>
            </mesh>

            {/* Interactive Marker */}
            {isInteractive && (
                <Html position={[0, 0, 0]} center distanceFactor={15} zIndexRange={[100, 0]}>
                    <div className={`transition-all duration-300 ${hovered ? 'scale-150' : 'scale-100'}`}>
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <div className="absolute w-full h-full bg-[#10B981]/30 rounded-full animate-ping" />
                            <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_10px_#10B981]" />
                        </div>
                        {hovered && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-[#10B981] text-[10px] px-2 py-1 rounded whitespace-nowrap border border-[#10B981]/30">
                                CLICK TO ANALYZE
                            </div>
                        )}
                    </div>
                </Html>
            )}
        </group>
    )
}

function Scene({ onObjectClick, viewMode }: { onObjectClick: (id: string) => void, viewMode: '2D' | '3D' }) {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#10B981" />

            {/* Ambient Particles */}
            <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#10B981" />

            {/* Scanning Effect */}
            {viewMode === '3D' && <ScanningPlane />}

            {/* Grid Floor */}
            <gridHelper args={[20, 20, "#1f2937", "#111827"]} position={[0, -1.5, 0]} />

            <group position={[0, -1.5, 0]}>
                {/* Floor (Invisible in LIDAR mode, just grid) */}
                {/* Walls */}
                <LidarObject position={[-4, 2.5, 0]} rotation={[0, 0, 0]} size={[0.2, 5, 8]} />
                <LidarObject position={[4, 2.5, 0]} rotation={[0, 0, 0]} size={[0.2, 5, 8]} />

                {/* Interactive Yellow Wall */}
                <LidarObject
                    id="wall-yellow"
                    position={[0, 1.5, -3.9]}
                    rotation={[0, 0, 0]}
                    size={[8, 3, 0.2]}
                    onClick={onObjectClick}
                />

                {/* Upper Back Wall */}
                <LidarObject position={[0, 4, -3.9]} size={[8, 2, 0.2]} />

                {/* Ceiling (Hidden in 2D mode for visibility) */}
                {viewMode === '3D' && (
                    <>
                        <LidarObject position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} size={[8, 8, 0.1]} />
                        {[-2, 0, 2].map((x, i) => (
                            <LidarObject key={i} position={[x, 4.8, 0]} size={[0.4, 0.4, 8]} />
                        ))}
                    </>
                )}

                {/* Window */}
                <group position={[-3.9, 2.5, 1]} rotation={[0, Math.PI / 2, 0]}>
                    <LidarObject position={[0, 0, 0]} size={[3, 4, 0.1]} />
                </group>

                {/* Stairs */}
                <group position={[-2.5, 0, 2.5]}>
                    <LidarObject position={[0, 2.5, 0]} size={[0.2, 5, 0.2]} /> {/* Center Pole */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <LidarObject key={i} position={[0, i * 0.2 + 0.1, 0]} rotation={[0, i * 0.5, 0]} size={[1.2, 0.05, 0.4]} />
                    ))}
                </group>

                {/* Interactive Kitchen */}
                <group position={[0, 0, -2.5]}>
                    <LidarObject
                        id="kitchen"
                        position={[0, 0.45, 0]}
                        size={[2.5, 0.9, 1]}
                        onClick={onObjectClick}
                    />
                    <LidarObject position={[0, 0.9, 0]} size={[2.6, 0.05, 1.1]} />
                </group>

                {/* Floating Text Labels in 3D Space */}
                {viewMode === '3D' && (
                    <>
                        <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                            <Text
                                position={[0, 3, -3]}
                                fontSize={0.2}
                                color="#10B981"
                                anchorX="center"
                                anchorY="middle"
                                outlineWidth={0.01}
                                outlineColor="#000000"
                            >
                                LIVING AREA
                            </Text>
                        </Float>
                    </>
                )}
            </group>
        </>
    )
}

function CameraController({ viewMode }: { viewMode: '2D' | '3D' }) {
    return viewMode === '2D' ? (
        <OrthographicCamera makeDefault position={[0, 10, 0]} zoom={40} near={-10} far={100} />
    ) : (
        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={45} />
    )
}

function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                <div className="text-[#10B981] text-xs font-mono animate-pulse">SCANNING GEOMETRY...</div>
            </div>
        </Html>
    )
}

export default function RealDigitalTwinViewer() {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D')
    const [latestPrompt, setLatestPrompt] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const handleObjectClick = (id: string) => {
        const data = ROOM_DATA[id as keyof typeof ROOM_DATA]
        if (data) {
            setSelectedItem(data)
        }
    }

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* 3D Viewer (LIDAR Mode) */}
            <div ref={containerRef} className="lg:col-span-2 relative w-full h-full bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">

                {/* Header UI */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md text-[#10B981] px-4 py-2 rounded-sm text-xs font-mono border border-[#10B981]/30 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <Scan className="w-3 h-3 animate-pulse" />
                        LIDAR SCAN: RESIDENCE_K
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono pl-1">
                        POINTS: 1,240,592 | ACCURACY: 99.8%
                    </div>
                </div>

                {/* View Controls */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <div className="bg-black/80 backdrop-blur-md rounded-lg border border-gray-800 p-1 flex">
                        <button
                            onClick={() => setViewMode('3D')}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === '3D' ? 'bg-[#10B981] text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            3D VIEW
                        </button>
                        <button
                            onClick={() => setViewMode('2D')}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === '2D' ? 'bg-[#10B981] text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            2D PLAN
                        </button>
                    </div>
                    <button onClick={toggleFullscreen} className="bg-black/80 backdrop-blur-md text-gray-400 hover:text-white p-2 rounded-lg border border-gray-800 transition-all">
                        {isFullscreen ? <X className="w-5 h-5" /> : <Scan className="w-5 h-5" />}
                    </button>
                </div>

                {/* Bottom UI */}
                <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-[#10B981] font-mono bg-[#10B981]/10 px-3 py-1 rounded border border-[#10B981]/20">
                            <MousePointer2 className="w-3 h-3" />
                            SELECT OBJECT TO ANALYZE
                        </div>
                        <div className="h-px w-16 bg-gradient-to-r from-[#10B981]/50 to-transparent" />
                    </div>
                </div>

                {/* Latest Prompt Overlay */}
                <AnimatePresence>
                    {latestPrompt && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-2xl bg-black/90 backdrop-blur-xl text-white p-6 rounded-xl border border-[#10B981]/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-[#10B981] text-xs font-bold tracking-wider">
                                    <SparklesIcon className="w-4 h-4" />
                                    GENERATED PROMPT
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">V 6.0</div>
                            </div>
                            <code className="block text-sm font-mono text-gray-300 break-all leading-relaxed">
                                {latestPrompt}
                            </code>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full h-full cursor-move">
                    <Canvas shadows>
                        <CameraController viewMode={viewMode} />
                        <Suspense fallback={<Loader />}>
                            <Scene onObjectClick={handleObjectClick} viewMode={viewMode} />
                        </Suspense>
                        <OrbitControls
                            enablePan={true}
                            enableDamping={true}
                            dampingFactor={0.05}
                            minPolarAngle={viewMode === '2D' ? 0 : Math.PI / 4}
                            maxPolarAngle={viewMode === '2D' ? 0 : Math.PI / 2}
                            enableRotate={viewMode === '3D'} // Disable rotation in 2D mode
                            minDistance={5}
                            maxDistance={20}
                        />
                    </Canvas>
                </div>
            </div>

            {/* AI Chat Interface */}
            <div className="h-full">
                <RenovationChat onPromptGenerate={(prompt) => setLatestPrompt(prompt)} />
            </div>

            {/* Modal */}
            <RenovationModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                data={selectedItem}
            />
        </div>
    )
}
