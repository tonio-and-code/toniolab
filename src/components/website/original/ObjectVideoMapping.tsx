"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface ObjectVideoMappingProps {
    videoSrc: string;
    className?: string;
    title?: string;
}

function VideoSumitsubo({ videoSrc }: { videoSrc: string }) {
    const texture = useVideoTexture(videoSrc);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group rotation={[1, 0, 0]}>
            <mesh ref={meshRef}>
                {/* Using a Cylinder to represent the Sumitsubo body abstractly */}
                <cylinderGeometry args={[1, 1, 4, 6]} />
                <meshStandardMaterial map={texture} roughness={0.3} metalness={0.8} />
            </mesh>
        </group>
    )
}


export function ObjectVideoMapping({ videoSrc, className, title = "DIGITAL CRAFT" }: ObjectVideoMappingProps) {
    return (
        <div className={cn("relative w-full h-screen bg-black overflow-hidden", className)}>
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <VideoSumitsubo videoSrc={videoSrc} />
                    </Suspense>
                    <OrbitControls enableZoom={false} />
                </Canvas>
            </div>

            <div className="absolute top-10 left-10 z-10 text-white pointer-events-none">
                <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">{title}</h3>
                <h2 className="text-4xl font-serif">墨壺 - Sumitsubo</h2>
                <p className="mt-4 max-w-sm text-white/60 text-sm leading-relaxed">
                    職人の魂が宿るデジタルの道具。<br />
                    表面には、あなたの記憶が映し出される。
                </p>
            </div>

            <div className="absolute bottom-10 left-10 text-white/30 text-xs">
                ドラッグで回転 / スクロールでズーム
            </div>
        </div>
    );
}
