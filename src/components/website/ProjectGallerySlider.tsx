'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectGallerySliderProps {
  images: string[]
  title: string
  autoPlayInterval?: number // ミリ秒 (デフォルト: 5000)
}

export default function ProjectGallerySlider({
  images,
  title,
  autoPlayInterval = 5000
}: ProjectGallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 5秒ごとに自動切り替え
  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [images.length, autoPlayInterval])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">画像なし</p>
      </div>
    )
  }

  return (
    <div className="relative h-48 overflow-hidden border-b border-[#DAE2E8] group">
      {/* 全画像をスタック表示 - クロスフェード方式 */}
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`${title} - ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* 複数画像がある場合のみコントロール表示 */}
      {images.length > 1 && (
        <>
          {/* 前へボタン */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            aria-label="前の画像"
          >
            <ChevronLeft className="w-5 h-5 text-[#252423]" />
          </button>

          {/* 次へボタン */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            aria-label="次の画像"
          >
            <ChevronRight className="w-5 h-5 text-[#252423]" />
          </button>

          {/* インジケーター */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`画像 ${index + 1}`}
              />
            ))}
          </div>

          {/* 画像番号表示 */}
          <div className="absolute top-3 right-3 bg-[#252423]/70 text-white text-xs px-2 py-1">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
