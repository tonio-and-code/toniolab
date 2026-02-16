'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, RoundedBox } from '@react-three/drei'
import { Group } from 'three'
import usePortfolioStore from '@/store/portfolioStore'
import { portfolioData } from '@/data/portfolio'

export default function PortfolioScene() {
  const groupRef = useRef<Group>(null)
  const { selectedCategory, rotation } = usePortfolioStore()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation + state.clock.getElapsedTime() * 0.1
    }
  })

  const filteredPortfolio = selectedCategory === 'all'
    ? portfolioData.slice(0, 6)
    : portfolioData.filter(item => item.category === selectedCategory).slice(0, 6)

  const radius = 4
  const angleStep = (Math.PI * 2) / filteredPortfolio.length

  return (
    <group ref={groupRef}>
      {/* Center platform */}
      <RoundedBox args={[6, 0.2, 6]} radius={0.1} position={[0, -1, 0]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Portfolio items in circle */}
      {filteredPortfolio.map((item, index) => {
        const angle = angleStep * index
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <group key={item.id} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Card */}
            <RoundedBox args={[1.5, 2, 0.1]} radius={0.05}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.6}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Title */}
            <Text
              position={[0, 0.7, 0.06]}
              fontSize={0.12}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.3}
            >
              {item.title}
            </Text>

            {/* Location */}
            <Text
              position={[0, 0.3, 0.06]}
              fontSize={0.08}
              color="#888888"
              anchorX="center"
              anchorY="middle"
            >
              {item.location}
            </Text>

            {/* Category tag */}
            <Text
              position={[0, -0.7, 0.06]}
              fontSize={0.07}
              color="#4ade80"
              anchorX="center"
              anchorY="middle"
            >
              {item.category}
            </Text>

            {/* Completion date */}
            <Text
              position={[0, -0.9, 0.06]}
              fontSize={0.06}
              color="#666666"
              anchorX="center"
              anchorY="middle"
            >
              {item.completion_date}
            </Text>
          </group>
        )
      })}

      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  )
}
