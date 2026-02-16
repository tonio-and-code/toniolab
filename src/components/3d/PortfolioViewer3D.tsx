'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import PortfolioScene from './PortfolioScene'

export default function PortfolioViewer3D() {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <Suspense fallback={null}>
          <PortfolioScene />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}
