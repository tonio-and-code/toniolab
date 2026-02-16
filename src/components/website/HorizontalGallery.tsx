'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

interface HorizontalGalleryProps {
  images: string[]
  title?: string
  autoPlay?: boolean
}

export default function HorizontalGallery({ images, title, autoPlay = true }: HorizontalGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)

      // 進捗を計算
      const maxScroll = scrollWidth - clientWidth
      const currentProgress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
      setProgress(currentProgress)
    }
  }

  // 自動スライド
  useEffect(() => {
    if (!isPlaying || !scrollRef.current) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const maxScroll = scrollWidth - clientWidth

        // 最後まで行ったら最初に戻る
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' })
        }
      }
    }, 3000) // 3秒ごと

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="bg-white border border-[#DAE2E8]">
      {title && (
        <div className="px-4 py-3 border-b border-[#DAE2E8]">
          <h3 className="text-base font-black text-[#252423]">{title}</h3>
        </div>
      )}

      {/* 横スクロールコンテナ */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto p-4 scrollbar-hide"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 h-56 bg-[#F5F5F5] border border-[#DAE2E8] overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={img}
                alt={`施工例 ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 進捗バーとページ番号 - サンマルク風・下部配置 */}
      <div className="flex items-center justify-center gap-4 px-8 py-4 bg-white border-t border-[#DAE2E8]">
        <button
          onClick={() => scroll('left')}
          className="flex items-center justify-center text-[#252423] hover:text-[#D4AF37] transition-colors disabled:opacity-30"
          disabled={!showLeftArrow}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-md">
          <div className="h-px bg-[#DAE2E8] overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => scroll('right')}
          className="flex items-center justify-center text-[#252423] hover:text-[#D4AF37] transition-colors disabled:opacity-30"
          disabled={!showRightArrow}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="text-[#252423] font-black">
          <span className="text-2xl">{String(Math.floor(progress / (100 / images.length)) + 1).padStart(2, '0')}</span>
          <span className="text-sm text-[#252423]/50"> / {String(images.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}


