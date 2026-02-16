'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'

const images = [
  '/images/baseball/スクリーンショット 2025-09-16 173430.png'
]

export function ImageDisplay() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setImageError(false)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setImageError(false)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage()
    }, 300000) // 5分ごとに切り替え

    return () => clearInterval(timer)
  }, [currentIndex])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          ギャラリー
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {images.length > 0 && !imageError ? (
            <>
              <img
                src={images[currentIndex]}
                alt={`画像 ${currentIndex + 1}`}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="前の画像"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="次の画像"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentIndex(index)
                          setImageError(false)
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`画像 ${index + 1} を表示`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Image className="w-12 h-12 mb-2" />
              <p>画像を表示できません</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}