'use client';

import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SumitsuboMeshProps {
  videoUrl: string;
}

function SumitsuboMesh({ videoUrl }: SumitsuboMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    video.play().catch(() => { /* silent */ });

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    setVideoTexture(texture);

    return () => {
      video.pause();
      video.src = '';
      texture.dispose();
    };
  }, [videoUrl]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  // Sumitsubo shape: elongated cylinder with pointed ends (simplified ink line tool)
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Main body - elongated octagonal shape */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 2.5, 8]} />
          <meshStandardMaterial
            map={videoTexture}
            metalness={0.3}
            roughness={0.7}
            emissive={new THREE.Color(0x1a1a1a)}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Top cap */}
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.1, 0.4, 0.2, 8]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>

        {/* Bottom cap */}
        <mesh position={[0, -1.35, 0]}>
          <cylinderGeometry args={[0.5, 0.2, 0.2, 8]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>

        {/* Ink line (thread) coming out */}
        <mesh position={[0, -1.6, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial
            color="#8B0000"
            emissive={new THREE.Color(0x8B0000)}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Gold ring detail */}
        <mesh position={[0, 0.8, 0]}>
          <torusGeometry args={[0.42, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -0.8, 0]}>
          <torusGeometry args={[0.48, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

interface DigitalSumitsuboProps {
  videoId: string;
}

export default function DigitalSumitsubo({ videoId }: DigitalSumitsuboProps) {
  const videoUrl = `https://customer-g3tngdysgdne3fza.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  // Fallback to direct MP4 for Three.js compatibility
  const mp4Url = `https://customer-g3tngdysgdne3fza.cloudflarestream.com/${videoId}/downloads/default.mp4`;

  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-black rounded-xl overflow-hidden relative">
      {/* Title overlay */}
      <div className="absolute top-6 left-6 z-10">
        <p className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-1">Digital Craft</p>
        <h3 className="text-white text-2xl font-serif">墨壺 - Sumitsubo</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-xs">
          職人の魂が宿るデジタルの道具。<br/>
          表面には、あなたの記憶が映し出される。
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-10">
        <p className="text-slate-500 text-xs">
          ドラッグで回転 / スクロールでズーム
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#D4AF37"
        />
        <spotLight
          position={[-5, -5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#4a9eff"
        />
        <pointLight position={[0, 0, 3]} intensity={0.5} />

        <Suspense fallback={<LoadingFallback />}>
          <SumitsuboMesh videoUrl={mp4Url} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
