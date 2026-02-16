"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useVideoTexture, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// Elegant floating video screen
function VideoScreen({ videoSrc }: { videoSrc: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const screenRef = useRef<THREE.Mesh>(null);

    // useVideoTexture handles video loading automatically
    const texture = useVideoTexture(videoSrc, {
        muted: true,
        loop: true,
        start: true,
        crossOrigin: "anonymous",
    });

    // Subtle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
            <group ref={groupRef}>
                {/* Main video screen - curved for elegance */}
                <mesh ref={screenRef}>
                    <planeGeometry args={[6, 3.375, 32, 32]} />
                    <meshStandardMaterial
                        map={texture}
                        toneMapped={false}
                        side={THREE.DoubleSide}
                        emissive="#ffffff"
                        emissiveMap={texture}
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Frame - thin golden border */}
                <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[6.15, 3.5]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Ambient glow behind screen */}
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[7, 4]} />
                    <meshBasicMaterial
                        color="#D4AF37"
                        transparent
                        opacity={0.05}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// Minimal grid floor
function MinimalGrid() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
            <planeGeometry args={[30, 30, 30, 30]} />
            <meshBasicMaterial
                color="#D4AF37"
                wireframe
                transparent
                opacity={0.08}
            />
        </mesh>
    );
}

// Loading fallback
function LoadingScreen() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color="#D4AF37" wireframe />
        </mesh>
    );
}

interface SimpleVideo3DProps {
    videoSrc: string;
    className?: string;
}

export function SimpleVideo3D({ videoSrc, className }: SimpleVideo3DProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={cn("relative w-full h-screen bg-[#0a0a0a]", className)}>
            {/* Subtle gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.06) 0%, transparent 60%)'
                }}
            />

            {/* Three.js Canvas */}
            <div className="absolute inset-0">
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 50 }}
                    onPointerEnter={() => setIsHovered(true)}
                    onPointerLeave={() => setIsHovered(false)}
                >
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
                    <pointLight position={[-5, 3, 5]} intensity={0.4} color="#D4AF37" />

                    <Suspense fallback={<LoadingScreen />}>
                        <VideoScreen videoSrc={videoSrc} />
                        <MinimalGrid />
                    </Suspense>

                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        minDistance={4}
                        maxDistance={12}
                        autoRotate={!isHovered}
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 1.8}
                        minPolarAngle={Math.PI / 3}
                    />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top title */}
                <div className="absolute top-8 left-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                        <span className="text-[#D4AF37] text-xs font-mono tracking-[0.2em] uppercase">
                            Video Display
                        </span>
                    </div>
                    <h2 className="text-white text-3xl md:text-4xl font-light tracking-tight">
                        Digital<br />
                        <span className="text-[#D4AF37]">Sumitsubo</span>
                    </h2>
                </div>

                {/* Version indicator */}
                <div className="absolute top-8 right-8 text-right">
                    <div className="text-white/30 text-xs font-mono tracking-widest">VERSION</div>
                    <div className="text-[#D4AF37] text-2xl font-light">03</div>
                </div>

                {/* Bottom controls hint */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white/40 text-xs font-mono tracking-wider">
                    <span>ドラッグで回転</span>
                    <span className="text-white/20">|</span>
                    <span>スクロールでズーム</span>
                </div>

                {/* Bottom right tech info */}
                <div className="absolute bottom-8 right-8 text-right">
                    <div className="text-white/20 text-xs font-mono tracking-widest">SIMPLE 3D</div>
                    <div className="text-white/30 text-xs">Clean Display</div>
                </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-[#D4AF37]/20" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-[#D4AF37]/20" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l border-b border-[#D4AF37]/20" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-[#D4AF37]/20" />
        </div>
    );
}
