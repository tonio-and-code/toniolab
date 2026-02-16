'use client'

import { useState, useEffect, useRef } from 'react'
import { Target, Heart, Lightbulb, Users, Zap } from 'lucide-react'

export default function PhilosophyCarousel() {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startRotation, setStartRotation] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // クライアントサイドでマウント後にフラグを立てる
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const philosophies = [
    {
      icon: Lightbulb,
      title: 'AI×職人技の融合',
      subtitle: 'Technology meets Craftsmanship',
      description: '伝統の職人技とAI技術を組み合わせ、誰もが驚く品質と効率を実現',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
    },
    {
      icon: Users,
      title: 'グローバル対応力',
      subtitle: 'English Communication Ready',
      description: '英語でのコミュニケーション力で、多国籍現場にも柔軟に対応',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
    },
    {
      icon: Target,
      title: 'ベテランの挑戦',
      subtitle: 'Experience meets Innovation',
      description: '30年の経験を持つ経営者が率先してDXに挑戦。年齢は関係ない',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
      icon: Heart,
      title: 'お客様第一主義',
      subtitle: 'Customer First Always',
      description: 'AIで24時間対応。人間の心とデジタルの便利さで、期待を超える',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400&h=300&fit=crop'
    },
    {
      icon: Zap,
      title: 'データ駆動経営',
      subtitle: 'Data-Driven Management',
      description: 'AI分析で現場を可視化。感覚ではなく、データで最適な意思決定',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      icon: Users,
      title: '職人ネットワーク',
      subtitle: '50+ Skilled Craftsmen',
      description: '50人超のプロ職人が連携。適材適所で、どんな工事も完璧に',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'
    },
    {
      icon: Target,
      title: '品質への執念',
      subtitle: 'Uncompromising Quality',
      description: 'デジタル管理×職人の目。二重チェックで妥協のない品質を保証',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'
    },
    {
      icon: Lightbulb,
      title: '業界の未来を創る',
      subtitle: 'Shaping Industry Future',
      description: '建設業界の課題を解決。自社の経験を業界全体に還元する',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop'
    },
    {
      icon: Zap,
      title: '働き方改革',
      subtitle: 'Work-Life Balance',
      description: 'AI業務サポートで残業削減。職人が誇りを持って働ける環境づくり',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop'
    },
    {
      icon: Heart,
      title: '透明性と誠実さ',
      subtitle: 'Transparency & Honesty',
      description: '見積もりから完工まで全て可視化。隠し事なし、正直一本勝負',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop'
    },
    {
      icon: Users,
      title: '多様性の尊重',
      subtitle: 'Diversity & Inclusion',
      description: '国籍・年齢・性別問わず。多様な人材が活躍できる現場を実現',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop'
    },
    {
      icon: Target,
      title: '継続的な学習',
      subtitle: 'Continuous Learning',
      description: '技術は日々進化。最新情報を海外からも収集し、常に学び続ける',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop'
    },
  ]

  // 自動回転アニメーション（風車のように連続回転）
  useEffect(() => {
    if (!isMounted || isDragging) return

    const animate = () => {
      setRotation((prev) => prev + 0.05) // 通常速度
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMounted, isDragging])

  // マウス・タッチドラッグ操作
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setStartRotation(rotation)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = e.clientX - startX
    setRotation(startRotation + diff * 0.3) // ゆっくり回転
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartRotation(rotation)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startX
    setRotation(startRotation + diff * 3.0) // スマホで高速回転
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
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
    <section className="py-8 sm:py-12 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* 背景エフェクト */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      />

      {/* 床の影エフェクト */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 30% at 50% 100%, rgba(0,0,0,0.12) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#252423] mb-2">イワサキ内装の経営理念</h2>
          <p className="text-sm text-[#252423]/70">AI × グローバル × 職人技で、建設業界の未来を創る</p>
        </div>

        {/* 3D Circle Carousel Container */}
        <div
          className="relative h-[350px] sm:h-[400px] lg:h-[450px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ userSelect: 'none', touchAction: 'pan-y pinch-zoom' }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: '800px' }}
          >
            {philosophies.map((item, index) => {
              if (!isMounted) return null // SSR時は何も表示しない

              const totalItems = philosophies.length
              const anglePerItem = 360 / totalItems

              // 各カードの角度（連続回転）
              const angle = (rotation + index * anglePerItem) * (Math.PI / 180)

              // 3D円形配置の座標計算（レスポンシブ対応）
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
              const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024

              const radius = isMobile ? 300 : isTablet ? 350 : 380
              const x = Math.sin(angle) * radius
              const z = Math.cos(angle) * radius
              const rotateY = 0 // 常に正面を向く

              // 正面に近いカードを判定（z値が最大のもの）
              const isNearFront = z > radius * 0.7

              // スケールと透明度（z位置ベース）
              const normalizedZ = (z + radius) / (radius * 2)
              const baseScale = isMobile ? 0.35 : isTablet ? 0.38 : 0.28
              const scale = baseScale + normalizedZ * 0.25
              const opacity = 0.2 + normalizedZ * 0.8

              // zIndexの計算（奥から手前へ）
              const zIndex = Math.round(50 + z / 10)

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    transform: `translateX(${x.toFixed(2)}px) translateZ(${z.toFixed(2)}px) translateY(${(Math.abs(z) * -0.05).toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                    opacity: opacity.toFixed(3),
                    zIndex: zIndex,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'visible',
                    pointerEvents: isNearFront ? 'auto' : 'none',
                    transition: isDragging ? 'none' : 'all 0.3s ease-out',
                    filter: `brightness(${0.7 + normalizedZ * 0.3}) contrast(${0.9 + normalizedZ * 0.1})`,
                  }}
                >
                  <div
                    className={`
                      relative bg-white
                      w-40 sm:w-44 lg:w-48 overflow-hidden
                      transition-all duration-300
                    `}
                    style={{
                      transformStyle: 'preserve-3d',
                      boxShadow: `
                        0 ${8 + normalizedZ * 20}px ${15 + normalizedZ * 30}px -${4 + normalizedZ * 8}px rgba(0, 0, 0, ${0.25 + normalizedZ * 0.25}),
                        0 ${4 + normalizedZ * 10}px ${8 + normalizedZ * 15}px -${2 + normalizedZ * 4}px rgba(0, 0, 0, ${0.15 + normalizedZ * 0.15})
                      `,
                      borderRadius: '4px',
                    }}
                  >
                    {/* Image Section */}
                    <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden" style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        style={{
                          filter: `brightness(${0.85 + normalizedZ * 0.15}) saturate(${0.9 + normalizedZ * 0.2})`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 sm:p-4 lg:p-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#252423] text-center mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#10B981] font-semibold text-center mb-2">
                        {item.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[#252423]/70 text-center leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
