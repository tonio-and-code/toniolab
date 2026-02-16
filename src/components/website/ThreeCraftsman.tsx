'use client'

import { useRef, Suspense, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// 光る粒子装飾
function Particles() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={group}>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.5,
              Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * 1.5
            ]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#10B981" : "#D4AF37"}
              emissive={i % 2 === 0 ? "#10B981" : "#D4AF37"}
              emissiveIntensity={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// 職人アイコンを使った3Dキャラクター
function CraftsmanAvatar() {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // 職人アイコン画像をテクスチャとして使用
  const texture = useTexture('/icons/craftsman.png')

  // アニメーション: 浮遊＋回転
  useFrame((state) => {
    if (group.current) {
      // ゆっくり上下に浮遊
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15

      // 自動回転（ゆっくり）
      group.current.rotation.y += 0.01

      // ホバー時は速く回転
      if (hovered) {
        group.current.rotation.y += 0.02
      }
    }
  })

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* メインキャラクター - 職人アイコンを3D球体に */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* 光るリング（職人の後光） */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* ツールベルト風の装飾リング */}
      <mesh position={[0, -0.3, 0]}>
        <torusGeometry args={[0.85, 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* 光る粒子装飾 */}
      <Particles />
    </group>
  )
}

// ライトとカメラを含む3Dシーン
export default function ThreeCraftsman() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-white">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0.3, 2.5]} />

        {/* 環境マップとライティング */}
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-3, 2, -3]} intensity={0.8} color="#10B981" />
          <pointLight position={[3, 2, -3]} intensity={0.8} color="#D4AF37" />

          {/* 3D職人アバター */}
          <CraftsmanAvatar />
        </Suspense>

        {/* 床（影表示用） */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.2} />
        </mesh>

        {/* カメラコントロール */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
