'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ServicesCarousel() {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startRotation, setStartRotation] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || isDragging) return

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    const rotationSpeed = isMobile ? 0.15 : 0.05 // スマホは3倍速

    const animate = () => {
      setRotation((prev) => prev + rotationSpeed)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMounted, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setStartRotation(rotation)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = e.clientX - startX
    setRotation(startRotation + diff * 0.3)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartRotation(rotation)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startX
    setRotation(startRotation + diff * 0.3)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  if (!isMounted) return null

  const services = [
    {
      icon: '/icons/home.png',
      title: '内装工事',
      desc: '新築・改修施工',
      href: '/services/interior',
      bgImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop'
    },
    {
      icon: '/icons/settings.png',
      title: 'リフォーム',
      desc: '暮らしに対応',
      href: '/services/reform',
      bgImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop'
    },
    {
      icon: '/icons/user.png',
      title: 'バリアフリー',
      desc: '安心安全',
      href: '/services/barrier-free',
      bgImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop'
    },
    {
      icon: '/icons/cart.png',
      title: '店舗デザイン',
      desc: 'コンセプトを形に',
      href: '/services/shop-design',
      bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop'
    },
    {
      icon: '/icons/photo.png',
      title: '施工実績',
      desc: 'これまでの実績',
      href: '/portfolio',
      bgImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop'
    },
    {
      icon: '/icons/calendar.png',
      title: 'スケジュール',
      desc: '工程管理',
      href: '/services/interior',
      bgImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop'
    },
    {
      icon: '/icons/contact.png',
      title: 'お問い合わせ',
      desc: '無料相談',
      href: '/contact',
      bgImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&auto=format&fit=crop'
    },
    {
      icon: '/icons/search.png',
      title: '職人ネットワーク',
      desc: '50名のプロ',
      href: '/technology/craftsmen',
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop'
    },
  ]

  const numCards = services.length
  const angleStep = 360 / numCards

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-black text-[#252423] border-b-2 border-[#D4AF37] pb-3 inline-block mb-4">
          SERVICES
        </h2>
        <p className="text-sm text-[#252423]/70 mb-12">お客様の理想を確かな技術で形にします</p>

        <div
          className="relative mx-auto select-none"
          style={{
            width: '100%',
            height: '500px',
            perspective: '2000px',
          }}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {services.map((service, index) => {
              const angle = (rotation + index * angleStep) * (Math.PI / 180)

              const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
              const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024

              const radius = isMobile ? 250 : isTablet ? 300 : 350 // 半径を小さく
              const x = Math.sin(angle) * radius
              const z = Math.cos(angle) * radius
              const rotateY = 0

              const normalizedZ = (z + radius) / (radius * 2)
              const baseScale = isMobile ? 0.6 : isTablet ? 0.7 : 0.8 // カードを大きく
              const scale = baseScale + normalizedZ * 0.3
              const opacity = 0.2 + normalizedZ * 0.8

              const zIndex = Math.round(1000 + z)

              const isNearFront = normalizedZ > 0.4

              return (
                <div
                  key={index}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    transform: `translateX(${x.toFixed(2)}px) translateZ(${z.toFixed(2)}px) translateY(${(Math.abs(z) * -0.05).toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                    opacity: opacity.toFixed(3),
                    zIndex: zIndex,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'visible',
                    pointerEvents: isNearFront ? 'auto' : 'none',
                    transition: isDragging ? 'none' : 'all 0.3s ease-out',
                    filter: `brightness(${(0.7 + normalizedZ * 0.3).toFixed(2)}) contrast(${(0.9 + normalizedZ * 0.1).toFixed(2)})`,
                    left: '50%',
                    top: '50%',
                    marginLeft: isMobile ? '-96px' : isTablet ? '-104px' : '-112px', // カード幅の半分
                    marginTop: isMobile ? '-128px' : isTablet ? '-139px' : '-149px', // カード高さの半分（3:4比率）
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <Link href={service.href}>
                    <div
                      className="relative bg-white w-48 sm:w-52 lg:w-56 overflow-hidden transition-all duration-300"
                      style={{
                        transformStyle: 'preserve-3d',
                        boxShadow: `
                          0 ${(10 + normalizedZ * 30).toFixed(0)}px ${(20 + normalizedZ * 40).toFixed(0)}px -${(5 + normalizedZ * 10).toFixed(0)}px rgba(0, 0, 0, ${(0.3 + normalizedZ * 0.3).toFixed(2)}),
                          0 ${(5 + normalizedZ * 15).toFixed(0)}px ${(10 + normalizedZ * 20).toFixed(0)}px -${(3 + normalizedZ * 5).toFixed(0)}px rgba(0, 0, 0, ${(0.2 + normalizedZ * 0.2).toFixed(2)})
                        `,
                        borderRadius: '6px',
                        aspectRatio: '3/4',
                      }}
                    >
                      {/* 背景画像 */}
                      <div className="absolute inset-0 opacity-20">
                        <img
                          src={service.bgImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* コンテンツ */}
                      <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 mb-4 flex items-center justify-center">
                          <img src={service.icon} alt={service.title} className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-lg font-bold text-[#252423] mb-2 text-center">{service.title}</h3>
                        <p className="text-sm text-[#252423]/70 text-center">{service.desc}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 床の影エフェクト */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 30% at 50% 100%, rgba(0,0,0,0.15) 0%, transparent 70%)'
        }}
      />
    </section>
  )
}
