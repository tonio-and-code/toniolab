'use client'

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

// 野球画像スライダー（格言の横に配置用）
export function BaseballImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // すべての野球画像
  const baseballImages = [
    { src: "/images/baseball-1.png", caption: "80分制...とにかく先制点！" },
    { src: "/images/baseball-2.png", caption: "チームワークで勝利を" },
    { src: "/images/baseball-3.png", caption: "走攻守のバランス" },
    { src: "/images/baseball-4.png", caption: "練習の成果を発揮" },
    { src: "/images/baseball-5.png", caption: "勝利への第一歩" },
    { src: "/images/baseball-6.png", caption: "全力プレー" },
    { src: "/images/baseball-7.png", caption: "チーム一丸" },
    { src: "/images/baseball-8.png", caption: "感動の瞬間" }
  ]

  // 自動スクロール
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % baseballImages.length)
    }, 300000) // 5分（300秒）ごとに自動で切り替え

    return () => clearInterval(interval)
  }, [baseballImages.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + baseballImages.length) % baseballImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % baseballImages.length)
  }

  const currentImage = baseballImages[currentIndex]

  return (
    <Card className="p-0 overflow-hidden h-full">
      <div className="relative h-full flex flex-col">
        {/* 画像エリア - アスペクト比を保持して全表示 */}
        <div className="relative flex-1 bg-gradient-to-br from-green-50 to-green-100">
          <img
            src={currentImage.src}
            alt={currentImage.caption}
            className="w-full h-full object-contain" // object-coverからobject-containに変更
            style={{ maxHeight: '400px' }} // 最大高さを設定
            onError={(e) => {
              // 画像が読み込めない場合
              const target = e.currentTarget
              target.style.display = 'none'
              const fallback = document.createElement('div')
              fallback.className = 'absolute inset-0 flex items-center justify-center'
              fallback.innerHTML = `
                <div class="text-center">
                  <div class="text-6xl mb-2">⚾</div>
                  <p class="text-lg font-bold text-gray-700">${currentImage.caption}</p>
                </div>
              `
              target.parentNode?.appendChild(fallback)
            }}
          />

          {/* キャプション */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-lg font-bold drop-shadow-lg">
              {currentImage.caption}
            </p>
          </div>

          {/* ナビゲーションボタン */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="前の画像"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="次の画像"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* インジケーター */}
        <div className="bg-white p-2">
          <div className="flex justify-center gap-1">
            {baseballImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-green-500'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`画像 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}