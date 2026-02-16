"use client";

import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface ObjectVideoMappingProps {
    videoSrc: string;
    className?: string;
    title?: string;
}

// Floating particles around the object
function GoldenParticles() {
    const count = 100;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = 3 + Math.random() * 3;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#D4AF37"
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

// Energy ring orbiting the object
function EnergyRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * speed;
            ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
        }
    });

    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[radius, 0.01, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
    );
}

// Main video-mapped sumitsubo
function VideoSumitsubo({ videoSrc }: { videoSrc: string }) {
    const texture = useVideoTexture(videoSrc);
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
        if (glowRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
            glowRef.current.scale.setScalar(scale);
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={groupRef}>
                {/* Outer glow sphere */}
                <mesh ref={glowRef} scale={1.8}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshBasicMaterial
                        color="#D4AF37"
                        transparent
                        opacity={0.05}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Main body - hexagonal prism */}
                <mesh>
                    <cylinderGeometry args={[0.8, 1, 3, 6]} />
                    <meshStandardMaterial
                        map={texture}
                        roughness={0.2}
                        metalness={0.9}
                        envMapIntensity={1.5}
                    />
                </mesh>

                {/* Top cap */}
                <mesh position={[0, 1.6, 0]}>
                    <cylinderGeometry args={[0.3, 0.8, 0.3, 6]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.3}
                        metalness={0.8}
                    />
                </mesh>

                {/* Bottom cap */}
                <mesh position={[0, -1.6, 0]}>
                    <cylinderGeometry args={[1, 0.5, 0.3, 6]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.3}
                        metalness={0.8}
                    />
                </mesh>

                {/* Gold rings */}
                {[-0.8, 0, 0.8].map((y, i) => (
                    <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.85 + (1.5 - y) * 0.05, 0.04, 16, 32]} />
                        <meshStandardMaterial
                            color="#D4AF37"
                            roughness={0.1}
                            metalness={1}
                            emissive="#D4AF37"
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                ))}

                {/* Thread coming out */}
                <mesh position={[0, -2, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                    <meshStandardMaterial
                        color="#8B0000"
                        emissive="#8B0000"
                        emissiveIntensity={0.5}
                    />
                </mesh>

                {/* Ink drop at the end */}
                <mesh position={[0, -2.5, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial
                        color="#000000"
                        roughness={0.1}
                        metalness={0.5}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// Loading placeholder
function LoadingSpinner() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial color="#D4AF37" wireframe />
        </mesh>
    );
}

export function ObjectVideoMapping({ videoSrc, className, title = "DIGITAL CRAFT" }: ObjectVideoMappingProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={cn("relative w-full h-screen overflow-hidden", className)}>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black" />

            {/* Animated Background Grid */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    animation: 'gridMove 20s linear infinite'
                }}
            />

            {/* Radial glow behind object */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)'
                }}
            />

            {/* Three.js Canvas */}
            <div className="absolute inset-0 z-10">
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    onPointerEnter={() => setIsHovered(true)}
                    onPointerLeave={() => setIsHovered(false)}
                >
                    {/* Lighting */}
                    <ambientLight intensity={0.3} />
                    <spotLight
                        position={[5, 5, 5]}
                        angle={0.4}
                        penumbra={1}
                        intensity={2}
                        color="#D4AF37"
                        castShadow
                    />
                    <spotLight
                        position={[-5, -3, 5]}
                        angle={0.4}
                        penumbra={1}
                        intensity={1}
                        color="#4a9eff"
                    />
                    <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffffff" />
                    <pointLight position={[0, -3, 0]} intensity={0.3} color="#D4AF37" />

                    <Suspense fallback={<LoadingSpinner />}>
                        <VideoSumitsubo videoSrc={videoSrc} />
                        <GoldenParticles />

                        {/* Energy Rings */}
                        <EnergyRing radius={2.5} speed={0.5} color="#D4AF37" />
                        <EnergyRing radius={3} speed={-0.3} color="#4a9eff" />
                        <EnergyRing radius={3.5} speed={0.2} color="#D4AF37" />

                        {/* Additional golden particles handled by GoldenParticles component */}

                        <Environment preset="city" />
                    </Suspense>

                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        minDistance={4}
                        maxDistance={12}
                        autoRotate={!isHovered}
                        autoRotateSpeed={0.5}
                    />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Title */}
                <div className="absolute top-8 left-8">
                    <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">
                        {title}
                    </span>
                    <h2 className="mt-2 text-white text-4xl md:text-5xl font-serif">
                        墨壺 <span className="text-2xl text-white/60">Sumitsubo</span>
                    </h2>
                    <p className="mt-4 max-w-sm text-white/50 text-sm leading-relaxed">
                        職人の魂が宿るデジタルの道具。<br />
                        表面には、映像という記憶が流れ続ける。
                    </p>
                </div>

                {/* Stats */}
                <div className="absolute top-8 right-8 text-right">
                    <div className="text-neutral-500 text-xs tracking-widest">VISUAL EFFECT 04</div>
                    <div className="mt-2 text-[#D4AF37] text-xs tracking-widest">3D VIDEO MAPPING</div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-8 left-8">
                    <div className="flex items-center gap-4 text-white/40 text-xs tracking-widest">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded border border-white/20 flex items-center justify-center">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                                </svg>
                            </div>
                            <span>DRAG TO ROTATE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded border border-white/20 flex items-center justify-center text-[10px]">
                                ⊕
                            </div>
                            <span>SCROLL TO ZOOM</span>
                        </div>
                    </div>
                </div>

                {/* Bottom right decoration */}
                <div className="absolute bottom-8 right-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                        <span className="text-white/30 text-xs tracking-widest">LIVE RENDER</span>
                    </div>
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-[#D4AF37]/30 z-20" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-[#D4AF37]/30 z-20" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l border-b border-[#D4AF37]/30 z-20" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-[#D4AF37]/30 z-20" />

            <style jsx>{`
                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(80px, 80px); }
                }
            `}</style>
        </div>
    );
}
