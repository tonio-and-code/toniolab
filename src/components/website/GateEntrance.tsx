'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GateEntranceProps {
  onEnter?: () => void
}

export default function GateEntrance({ onEnter }: GateEntranceProps) {
  const [entered, setEntered] = useState(false)
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Check if gate was already passed
    const gatePassed = sessionStorage.getItem('iwasaki-gate-passed')
    if (gatePassed === 'true') {
      setEntered(true)
    }
    // Fade in content
    setTimeout(() => setShowContent(true), 100)
  }, [])

  const handleEnter = (door: string) => {
    sessionStorage.setItem('iwasaki-gate-passed', 'true')
    setEntered(true)
    onEnter?.()
  }

  if (entered) return null

  const doors = [
    {
      id: 'interior',
      title: 'Interior',
      subtitle: '内装工事',
      description: '埃の中に線を引く',
      href: '/services',
      color: 'amber',
      image: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/ee18091e-8625-4af5-8af7-a1e416af5300/public',
    },
    {
      id: 'english',
      title: 'English',
      subtitle: '英語学習',
      description: '沈黙の中に仕上げを置く',
      href: '/english',
      color: 'cyan',
      image: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/84dd3f51-781b-4b08-ddc5-8ffffd354000/public',
    },
    {
      id: 'lab',
      title: 'LAB',
      subtitle: 'ただ漂う',
      description: '乱れの中に水平を作る',
      href: '#',
      color: 'purple',
      image: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/3a467ce5-cbee-46b6-6be3-a916d78a0700/public',
      onClick: () => handleEnter('lab'),
    },
  ]

  return (
    <div className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />

      {/* Header */}
      <div className="text-center mb-8 md:mb-12 px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-wider mb-4">
          IWASAKI<span className="text-amber-500">.</span>
        </h1>
        <p className="text-stone-500 text-sm md:text-base tracking-widest mb-6">
          急いでる人は帰ってください。
        </p>
        <p className="text-stone-600 text-xs tracking-wider">
          Choose a door.
        </p>
      </div>

      {/* Three Doors */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 relative z-10 w-full max-w-5xl">
        {doors.map((door) => {
          const isHovered = hoveredDoor === door.id
          const colorClasses = {
            amber: 'border-amber-500/30 hover:border-amber-500 hover:shadow-amber-500/20',
            cyan: 'border-cyan-500/30 hover:border-cyan-500 hover:shadow-cyan-500/20',
            purple: 'border-purple-500/30 hover:border-purple-500 hover:shadow-purple-500/20',
          }
          const textColorClasses = {
            amber: 'text-amber-500',
            cyan: 'text-cyan-500',
            purple: 'text-purple-500',
          }

          const content = (
            <div
              className={`relative group cursor-pointer rounded-xl border-2 ${colorClasses[door.color as keyof typeof colorClasses]} bg-stone-900/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-2xl ${isHovered ? 'scale-105' : 'scale-100'}`}
              onMouseEnter={() => setHoveredDoor(door.id)}
              onMouseLeave={() => setHoveredDoor(null)}
              onClick={door.onClick}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <img src={door.image} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 h-40 md:h-56 flex flex-col justify-end">
                <span className={`text-xs uppercase tracking-[0.3em] ${textColorClasses[door.color as keyof typeof textColorClasses]} mb-2`}>
                  {door.subtitle}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                  {door.title}
                </h2>
                <p className="text-stone-500 text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {door.description}
                </p>

                {/* Arrow */}
                <div className={`absolute right-6 bottom-6 ${textColorClasses[door.color as keyof typeof textColorClasses]} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          )

          if (door.onClick) {
            return <div key={door.id} className="flex-1">{content}</div>
          }

          return (
            <Link key={door.id} href={door.href} className="flex-1 block">
              {content}
            </Link>
          )
        })}
      </div>

      {/* Bottom poetry */}
      <div className="mt-8 md:mt-12 text-center px-4 relative z-10">
        <p className="text-stone-700 text-xs tracking-wider">
          雑さの中に境界を作る
        </p>
      </div>

      {/* Skip button */}
      <button
        onClick={() => handleEnter('skip')}
        className="absolute bottom-8 text-stone-600 hover:text-stone-400 text-xs tracking-widest transition-colors"
      >
        skip
      </button>
    </div>
  )
}
