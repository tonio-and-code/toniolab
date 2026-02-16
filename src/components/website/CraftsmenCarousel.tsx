'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Hammer, Paintbrush, Wrench, Ruler, Layers, Sparkles, HardHat, Lightbulb } from 'lucide-react'

export default function CraftsmenCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragRotation, setDragRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const craftsmen = [
    {
      icon: Paintbrush,
      color: 'from-emerald-400 to-teal-500',
      borderColor: 'border-emerald-500',
      title: 'クロス職人',
      subtitle: '壁紙施工のプロフェッショナル',
      description: '15名の熟練職人が、美しい仕上がりと耐久性を実現します',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
      count: '15名'
    },
    {
      icon: Layers,
      color: 'from-teal-400 to-cyan-500',
      borderColor: 'border-teal-500',
      title: '床職人',
      subtitle: 'フローリング・タイル施工',
      description: '12名のスペシャリストが、快適な床空間を作り出します',
      image: 'https://images.unsplash.com/photo-1581858707460-6d87c99d6e97?w=400&h=300&fit=crop',
      count: '12名'
    },
    {
      icon: Ruler,
      color: 'from-cyan-400 to-blue-500',
      borderColor: 'border-cyan-500',
      title: '建具職人',
      subtitle: 'ドア・窓枠・造作家具',
      description: '8名の職人が、精密な建具施工で空間を仕上げます',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      count: '8名'
    },
    {
      icon: Paintbrush,
      color: 'from-blue-400 to-indigo-500',
      borderColor: 'border-blue-500',
      title: '塗装職人',
      subtitle: '内装塗装・仕上げ',
      description: '10名の職人が、美しい色彩と質感を表現します',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
      count: '10名'
    },
    {
      icon: Hammer,
      color: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-500',
      title: '左官職人',
      subtitle: '壁・床の下地処理',
      description: '5名の熟練職人が、確かな下地で品質を支えます',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
      count: '5名'
    },
    {
      icon: Wrench,
      color: 'from-purple-400 to-violet-500',
      borderColor: 'border-purple-500',
      title: '大工職人',
      subtitle: '造作家具・木工事',
      description: '伝統の技で、オーダーメイド家具を製作します',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      count: '6名'
    },
    {
      icon: HardHat,
      color: 'from-red-400 to-pink-500',
      borderColor: 'border-red-500',
      title: '設備職人',
      subtitle: '配管・電気工事',
      description: '快適な住環境を支える、設備のプロフェッショナル',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      count: '4名'
    },
    {
      icon: Lightbulb,
      color: 'from-lime-400 to-green-500',
      borderColor: 'border-lime-500',
      title: 'デザイナー',
      subtitle: '空間デザイン・設計',
      description: 'お客様の理想を形にする、クリエイティブチーム',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      count: '3名'
    },
  ]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + craftsmen.length) % craftsmen.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % craftsmen.length)
  }

  const handleDotClick = (index: number) => {
    if (index === activeIndex) return
    setActiveIndex(index)
  }

  // 自動回転（ドラッグ中は停止）
  useEffect(() => {
    if (isDragging) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % craftsmen.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [isDragging, craftsmen.length])

  // マウスドラッグ操作
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragRotation(0)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const sensitivity = 0.003
    setDragRotation((prev) => prev + e.movementX * sensitivity)
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    const totalItems = craftsmen.length
    const anglePerItem = (2 * Math.PI) / totalItems
    const rotationSteps = Math.round(dragRotation / anglePerItem)

    const newIndex = (activeIndex - rotationSteps + totalItems * 10) % totalItems
    setActiveIndex(newIndex)

    setIsDragging(false)
    setDragRotation(0)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }

  // 背景エフェクト（ゴールド・シルバー・エメラルドグリーン）
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = 900
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    type Light = {
      x: number
      y: number
      opacity: number
      fadeSpeed: number
      size: number
      color: 'gold' | 'silver' | 'emerald'
    }

    const lights: Light[] = []
    const colors: Array<'gold' | 'silver' | 'emerald'> = ['gold', 'silver', 'emerald', 'gold', 'silver', 'emerald', 'gold', 'silver', 'emerald', 'gold']

    for (let i = 0; i < 10; i++) {
      lights.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: 0,
        fadeSpeed: Math.random() * 0.003 + 0.001,
        size: Math.random() * 70 + 60,
        color: colors[i],
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      lights.forEach((light) => {
        light.opacity += light.fadeSpeed
        if (light.opacity >= 0.9 || light.opacity <= 0) {
          light.fadeSpeed *= -1
        }

        let innerColor, middleColor, outerColor

        if (light.color === 'gold') {
          innerColor = `rgba(255, 255, 255, ${light.opacity})`
          middleColor = `rgba(212, 175, 55, ${light.opacity * 0.7})`
          outerColor = `rgba(212, 175, 55, ${light.opacity * 0.2})`
        } else if (light.color === 'silver') {
          innerColor = `rgba(255, 255, 255, ${light.opacity})`
          middleColor = `rgba(192, 192, 192, ${light.opacity * 0.7})`
          outerColor = `rgba(192, 192, 192, ${light.opacity * 0.2})`
        } else {
          innerColor = `rgba(255, 255, 255, ${light.opacity})`
          middleColor = `rgba(16, 185, 129, ${light.opacity * 0.7})`
          outerColor = `rgba(16, 185, 129, ${light.opacity * 0.2})`
        }

        const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.size)
        gradient.addColorStop(0, innerColor)
        gradient.addColorStop(0.4, middleColor)
        gradient.addColorStop(0.8, outerColor)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  return (
    <section className="py-12 bg-white border-t border-[#DAE2E8] relative overflow-hidden">
      {/* 背景エフェクト */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-[#252423] border-b-2 border-[#10B981] pb-3 inline-block mb-2">
            多彩な職人たち
          </h2>
          <p className="text-sm text-[#252423]/70">各分野のスペシャリストが、あなたの空間を創ります</p>
        </div>

        {/* 3D Circle Carousel Container */}
        <div
          className="relative h-[700px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ userSelect: 'none' }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: '1800px' }}
          >
            {craftsmen.map((item, index) => {
              const Icon = item.icon
              const totalItems = craftsmen.length
              const angleStep = (2 * Math.PI) / totalItems

              let angleDiff = index - activeIndex
              if (angleDiff > totalItems / 2) angleDiff -= totalItems
              if (angleDiff < -totalItems / 2) angleDiff += totalItems

              const currentAngle = angleStep * angleDiff + dragRotation
              const isActive = index === activeIndex

              const radius = 500
              const baseX = Math.sin(currentAngle) * radius
              const baseZ = (Math.cos(currentAngle) - 1) * radius
              const baseRotateY = -(currentAngle * 180) / Math.PI

              const distance = Math.abs(currentAngle)
              const baseScale = isActive ? 1.1 : Math.max(0.6, 1 - distance * 0.2)
              const baseOpacity = isActive ? 1 : Math.max(0.5, 1 - distance * 0.3)

              return (
                <div
                  key={index}
                  className={`absolute ${isDragging ? 'transition-none' : 'transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]'}`}
                  style={{
                    transform: `
                      translateX(${baseX}px)
                      translateZ(${baseZ}px)
                      rotateY(${baseRotateY}deg)
                      scale(${baseScale})
                    `,
                    opacity: baseOpacity,
                    zIndex: isActive ? 50 : Math.round(30 - Math.abs(baseZ) / 10),
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'visible',
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  <div
                    className={`
                      relative bg-white border-4 ${item.borderColor}
                      w-80 overflow-hidden
                      transition-shadow duration-[800ms]
                      ${isActive ? 'shadow-[0_20px_60px_rgba(0,0,0,0.3)]' : 'shadow-[0_10px_30px_rgba(0,0,0,0.15)]'}
                    `}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Speech Bubble Arrow */}
                    <div
                      className={`
                        absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0
                        border-l-[24px] border-l-transparent
                        border-r-[24px] border-r-transparent
                        border-t-[24px] ${item.borderColor.replace('border-', 'border-t-')}
                        transition-all duration-[800ms]
                      `}
                      style={{
                        filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                      }}
                    ></div>

                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-all duration-[800ms]"
                        style={{
                          transform: isActive ? 'scale(1)' : 'scale(1.1)',
                          filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                      {/* 人数バッジ */}
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 border border-[#DAE2E8]">
                        <span className="text-sm font-bold text-[#10B981]">{item.count}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold text-gray-900 text-center mb-2 transition-all duration-[800ms]"
                        style={{
                          opacity: isActive ? 1 : 0.7,
                          transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm text-emerald-600 font-semibold text-center mb-3 transition-all duration-[800ms] delay-75"
                        style={{
                          opacity: isActive ? 1 : 0.6,
                          transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                        }}
                      >
                        {item.subtitle}
                      </p>
                      <p
                        className="text-sm text-gray-600 text-center leading-relaxed transition-all duration-[800ms] delay-150"
                        style={{
                          opacity: isActive ? 1 : 0.5,
                          transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2 z-40
              w-14 h-14 bg-white border border-[#DAE2E8] flex items-center justify-center
              transition-all duration-300 ease-out
              hover:bg-[#F5F5F5] hover:border-[#10B981] hover:shadow-lg
              active:scale-95
            `}
            aria-label="前へ"
          >
            <ChevronLeft className="w-6 h-6 text-[#252423]" />
          </button>
          <button
            onClick={handleNext}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 z-40
              w-14 h-14 bg-white border border-[#DAE2E8] flex items-center justify-center
              transition-all duration-300 ease-out
              hover:bg-[#F5F5F5] hover:border-[#10B981] hover:shadow-lg
              active:scale-95
            `}
            aria-label="次へ"
          >
            <ChevronRight className="w-6 h-6 text-[#252423]" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-8">
          {craftsmen.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                h-2 transition-all duration-500 ease-out
                ${index === activeIndex
                  ? 'w-8 bg-[#10B981]'
                  : 'w-2 bg-[#DAE2E8] hover:bg-[#10B981]/50'
                }
              `}
              aria-label={`${index + 1}番目の職人へ`}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="text-center mt-6">
          <span className="text-sm text-[#252423]/50">
            {activeIndex + 1} / {craftsmen.length}
          </span>
        </div>
      </div>
    </section>
  )
}
