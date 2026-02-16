"use client";

import React, { useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Float, Text, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// Holographic Crystal with video texture
function HolographicCrystal({ videoSrc }: { videoSrc: string }) {
    const texture = useVideoTexture(videoSrc);
    const groupRef = useRef<THREE.Group>(null);
    const crystalRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.15;
            groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;
        }
        if (wireframeRef.current) {
            wireframeRef.current.rotation.y = -t * 0.1;
            wireframeRef.current.rotation.x = t * 0.05;
        }
    });

    return (
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <group ref={groupRef}>
                {/* Main crystal - Icosahedron */}
                <mesh ref={crystalRef} scale={2}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshPhysicalMaterial
                        map={texture}
                        metalness={0.1}
                        roughness={0.1}
                        transmission={0.3}
                        thickness={0.5}
                        envMapIntensity={1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </mesh>

                {/* Outer wireframe */}
                <mesh ref={wireframeRef} scale={2.5}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshBasicMaterial
                        color="#D4AF37"
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Inner glow */}
                <mesh scale={1.8}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial
                        color="#D4AF37"
                        transparent
                        opacity={0.05}
                        side={THREE.BackSide}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// Floating geometric fragments
function FloatingFragments() {
    const fragmentsRef = useRef<THREE.Group>(null);
    const count = 30;

    const fragments = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 15,
            ] as [number, number, number],
            rotation: Math.random() * Math.PI * 2,
            scale: 0.05 + Math.random() * 0.15,
            speed: 0.5 + Math.random() * 1,
            offset: Math.random() * Math.PI * 2,
        }));
    }, []);

    useFrame((state) => {
        if (fragmentsRef.current) {
            fragmentsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <group ref={fragmentsRef}>
            {fragments.map((frag, i) => (
                <Fragment key={i} {...frag} index={i} />
            ))}
        </group>
    );
}

function Fragment({ position, rotation, scale, speed, offset, index }: {
    position: [number, number, number];
    rotation: number;
    scale: number;
    speed: number;
    offset: number;
    index: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.elapsedTime * speed + offset;
            meshRef.current.rotation.x = t;
            meshRef.current.rotation.y = t * 0.7;
            meshRef.current.position.y = position[1] + Math.sin(t) * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color={index % 2 === 0 ? "#D4AF37" : "#4a9eff"}
                metalness={0.9}
                roughness={0.1}
                emissive={index % 2 === 0 ? "#D4AF37" : "#4a9eff"}
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}

// Orbital rings
function OrbitalRings() {
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const ring3Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x = Math.PI / 2;
            ring1Ref.current.rotation.z = t * 0.3;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.x = Math.PI / 3;
            ring2Ref.current.rotation.z = -t * 0.2;
        }
        if (ring3Ref.current) {
            ring3Ref.current.rotation.x = Math.PI / 4;
            ring3Ref.current.rotation.y = t * 0.25;
        }
    });

    return (
        <>
            <mesh ref={ring1Ref}>
                <torusGeometry args={[4, 0.02, 16, 100]} />
                <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
            </mesh>
            <mesh ref={ring2Ref}>
                <torusGeometry args={[4.5, 0.015, 16, 100]} />
                <meshBasicMaterial color="#4a9eff" transparent opacity={0.4} />
            </mesh>
            <mesh ref={ring3Ref}>
                <torusGeometry args={[5, 0.01, 16, 100]} />
                <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} />
            </mesh>
        </>
    );
}

// Beam lights
function BeamLights() {
    const beamsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (beamsRef.current) {
            beamsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={beamsRef}>
            {[0, 1, 2, 3].map((i) => (
                <mesh
                    key={i}
                    position={[0, -5, 0]}
                    rotation={[0, (Math.PI / 2) * i, 0.3]}
                >
                    <cylinderGeometry args={[0.01, 0.5, 12, 8, 1, true]} />
                    <meshBasicMaterial
                        color="#D4AF37"
                        transparent
                        opacity={0.1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Grid floor
function HolographicGrid() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[50, 50, 50, 50]} />
            <meshBasicMaterial
                color="#D4AF37"
                wireframe
                transparent
                opacity={0.1}
            />
        </mesh>
    );
}

// Loading state
function LoadingCube() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#D4AF37" wireframe />
        </mesh>
    );
}

interface HolographicVideoSculptureProps {
    videoSrc: string;
    className?: string;
}

export function HolographicVideoSculpture({ videoSrc, className }: HolographicVideoSculptureProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={cn("relative w-full h-screen overflow-hidden", className)}>
            {/* Deep space background */}
            <div className="absolute inset-0 bg-[#030308]">
                {/* Radial gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
                    }}
                />
                {/* Star field */}
                <div className="absolute inset-0">
                    {[...Array(100)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-px h-px bg-white rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: 0.3 + Math.random() * 0.7,
                                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Three.js Scene */}
            <div className="absolute inset-0 z-10">
                <Canvas
                    onPointerEnter={() => setIsHovered(true)}
                    onPointerLeave={() => setIsHovered(false)}
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

                    {/* Lighting */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[5, 5, 5]} intensity={1} color="#D4AF37" />
                    <pointLight position={[-5, -5, 5]} intensity={0.5} color="#4a9eff" />
                    <pointLight position={[0, 0, -5]} intensity={0.3} color="#ffffff" />
                    <spotLight
                        position={[0, 10, 0]}
                        angle={0.5}
                        penumbra={1}
                        intensity={1}
                        color="#D4AF37"
                    />

                    <Suspense fallback={<LoadingCube />}>
                        <HolographicCrystal videoSrc={videoSrc} />
                        <FloatingFragments />
                        <OrbitalRings />
                        <BeamLights />
                        <HolographicGrid />
                    </Suspense>

                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        minDistance={5}
                        maxDistance={20}
                        autoRotate={!isHovered}
                        autoRotateSpeed={0.3}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 4}
                    />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Top left - Title */}
                <div className="absolute top-8 left-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                        <span className="text-[#D4AF37] text-xs font-mono tracking-[0.3em] uppercase">
                            HOLOGRAPHIC DISPLAY
                        </span>
                    </div>
                    <h2 className="text-white text-5xl md:text-6xl font-light tracking-tight">
                        Crystal
                        <span className="block text-[#D4AF37]">Memory</span>
                    </h2>
                    <p className="mt-4 max-w-sm text-white/40 text-sm leading-relaxed font-light">
                        映像の記憶を結晶化した、<br />
                        デジタルアーティファクト。
                    </p>
                </div>

                {/* Top right - Stats */}
                <div className="absolute top-8 right-8 text-right">
                    <div className="space-y-2">
                        <div className="text-white/30 text-xs font-mono tracking-widest">VISUAL EFFECT</div>
                        <div className="text-[#D4AF37] text-4xl font-light">04</div>
                    </div>
                </div>

                {/* Bottom left - Controls */}
                <div className="absolute bottom-8 left-8">
                    <div className="flex items-center gap-6 text-white/30 text-xs font-mono tracking-wider">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                                </svg>
                            </div>
                            <span>DRAG</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                                </svg>
                            </div>
                            <span>ZOOM</span>
                        </div>
                    </div>
                </div>

                {/* Bottom right - Tech */}
                <div className="absolute bottom-8 right-8 text-right">
                    <div className="text-white/20 text-xs font-mono tracking-widest mb-2">POWERED BY</div>
                    <div className="text-white/40 text-sm">Three.js + React Three Fiber</div>
                </div>

                {/* Center scan lines effect */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                    }}
                />
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-16 h-16 border-l border-t border-[#D4AF37]/30 z-20" />
            <div className="absolute top-4 right-4 w-16 h-16 border-r border-t border-[#D4AF37]/30 z-20" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-l border-b border-[#D4AF37]/30 z-20" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-r border-b border-[#D4AF37]/30 z-20" />

            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
