'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
    Text,
    Float,
    useTexture,
    MeshTransmissionMaterial,
    Sparkles,
    Environment,
    ContactShadows,
} from '@react-three/drei'
import * as THREE from 'three'

// Character data
const CHARACTERS = [
    {
        id: 'cork-jijii',
        name: 'コルクじじい',
        role: '床材の伝道師',
        image: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/32c616ad-8c26-4945-1e8e-35040d65a100/public',
        color: '#D4AF37',
        catchphrase: 'だって俺の床、コルクなんだもん！',
        position: [-2.5, 0, 0] as [number, number, number],
    },
    {
        id: 'takumi',
        name: 'AIタクミ',
        role: '内装AI助手',
        image: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/c3e01106-43b4-4d9c-b3af-f799f32e3300/public',
        color: '#10B981',
        catchphrase: '質問してね！',
        position: [0, 0, 0] as [number, number, number],
    },
    {
        id: 'anya',
        name: 'アーニャ',
        role: 'デジタルナビゲーター',
        image: '/images/anya-avatar.png',
        color: '#EC4899',
        catchphrase: 'DIGITAL CRAFTSMANSHIP',
        position: [2.5, 0, 0] as [number, number, number],
    },
]

// Holographic scan line effect
function ScanLine({ height = 3 }: { height?: number }) {
    const lineRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (lineRef.current) {
            // Move scan line up and down
            const y = Math.sin(state.clock.elapsedTime * 0.8) * height * 0.5
            lineRef.current.position.y = y
        }
    })

    return (
        <mesh ref={lineRef} position={[0, 0, 0.01]}>
            <planeGeometry args={[10, 0.02]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
        </mesh>
    )
}

// Cyberpunk Grid Floor
function CyberGrid() {
    const gridRef = useRef<THREE.GridHelper>(null)

    useFrame((state) => {
        if (gridRef.current) {
            // Subtle animation
            gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1
        }
    })

    return (
        <group position={[0, -1.5, 0]}>
            <gridHelper ref={gridRef} args={[40, 40, '#D4AF37', '#1a1a1a']} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[40, 40]} />
                <meshBasicMaterial color="#050505" transparent opacity={0.9} />
            </mesh>
        </group>
    )
}

// Floating holographic character card
function HolographicCard({
    character,
    onSelect
}: {
    character: typeof CHARACTERS[0]
    onSelect: (id: string) => void
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)
    const glowRef = useRef<THREE.Mesh>(null)

    // Load character texture
    const texture = useTexture(character.image)

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle float animation
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + character.position[0]) * 0.1

            // Rotation on hover
            if (hovered) {
                meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
            } else {
                meshRef.current.rotation.y *= 0.95
            }
        }

        if (glowRef.current) {
            // Pulsing glow
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
            glowRef.current.scale.set(scale, scale, 1)
        }
    })

    const glowColor = new THREE.Color(character.color)

    return (
        <Float
            speed={2}
            rotationIntensity={0.1}
            floatIntensity={0.3}
        >
            <group position={character.position}>
                {/* Glow background */}
                <mesh ref={glowRef} position={[0, 0, -0.05]}>
                    <planeGeometry args={[1.8, 2.4]} />
                    <meshBasicMaterial
                        color={glowColor}
                        transparent
                        opacity={hovered ? 0.6 : 0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Main card */}
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onClick={() => onSelect(character.id)}
                >
                    <planeGeometry args={[1.5, 2]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Holographic frame */}
                <lineSegments position={[0, 0, 0.01]}>
                    <edgesGeometry args={[new THREE.PlaneGeometry(1.6, 2.1)]} />
                    <lineBasicMaterial color={character.color} linewidth={2} />
                </lineSegments>

                {/* Character name */}
                <Text
                    position={[0, -1.3, 0]}
                    fontSize={0.15}
                    color={character.color}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="#000000"
                >
                    {character.name}
                </Text>

                {/* Role badge */}
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.08}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    {character.role}
                </Text>

                {/* Sparkles around card */}
                <Sparkles
                    count={30}
                    scale={2.5}
                    size={3}
                    speed={0.4}
                    color={character.color}
                    opacity={hovered ? 1 : 0.5}
                />
            </group>
        </Float>
    )
}

// Main 3D scene
function Scene({ onSelectCharacter }: { onSelectCharacter: (id: string) => void }) {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#10B981" />
            <spotLight
                position={[0, 10, 0]}
                angle={0.5}
                penumbra={1}
                intensity={2}
                color="#ffffff"
                castShadow
            />

            {/* Background */}
            <color attach="background" args={['#050505']} />

            {/* Grid floor */}
            <CyberGrid />

            {/* Scan line effect */}
            <ScanLine />

            {/* Character cards */}
            {CHARACTERS.map((char) => (
                <HolographicCard
                    key={char.id}
                    character={char}
                    onSelect={onSelectCharacter}
                />
            ))}

            {/* Ambient particles */}
            <Sparkles
                count={200}
                scale={20}
                size={2}
                speed={0.3}
                color="#D4AF37"
                opacity={0.3}
            />

            {/* Title text */}
            <Text
                position={[0, 2.5, 0]}
                fontSize={0.4}
                color="#D4AF37"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                IWASAKI CREW
            </Text>
            <Text
                position={[0, 2.1, 0]}
                fontSize={0.12}
                color="#888888"
                anchorX="center"
                anchorY="middle"
            >
                — AI × 職人技 × デジタル —
            </Text>

            {/* Contact shadows */}
            <ContactShadows
                position={[0, -1.4, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4}
            />
        </>
    )
}

// Camera controller
function CameraController() {
    const { camera } = useThree()

    useFrame((state) => {
        // Subtle camera movement
        camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5
        camera.position.y = 1 + Math.sin(state.clock.elapsedTime * 0.15) * 0.2
        camera.lookAt(0, 0, 0)
    })

    return null
}

// Main export component
interface Character3DShowcaseProps {
    onSelectCharacter?: (id: string) => void
    className?: string
}

export default function Character3DShowcase({
    onSelectCharacter = () => { },
    className = ''
}: Character3DShowcaseProps) {
    return (
        <div className={`w-full h-[600px] bg-black rounded-2xl overflow-hidden ${className}`}>
            <Canvas
                camera={{ position: [0, 1, 6], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                dpr={[1, 2]}
            >
                <CameraController />
                <Scene onSelectCharacter={onSelectCharacter} />
            </Canvas>

            {/* Overlay effects */}
            <div className="pointer-events-none absolute inset-0">
                {/* Scanline overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)'
                    }}
                />

                {/* Vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)'
                    }}
                />

                {/* Corner decorations */}
                <svg className="absolute top-4 left-4 w-8 h-8 text-amber-500/50">
                    <path d="M0 20 L0 0 L20 0" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <svg className="absolute top-4 right-4 w-8 h-8 text-amber-500/50">
                    <path d="M32 20 L32 0 L12 0" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <svg className="absolute bottom-4 left-4 w-8 h-8 text-amber-500/50">
                    <path d="M0 12 L0 32 L20 32" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <svg className="absolute bottom-4 right-4 w-8 h-8 text-amber-500/50">
                    <path d="M32 12 L32 32 L12 32" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
        </div>
    )
}
