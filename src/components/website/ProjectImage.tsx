'use client'

import Image from 'next/image'

interface ProjectImageProps {
  src: string
  alt: string
  isRealPhoto?: boolean // 実写かどうか
  className?: string
}

export default function ProjectImage({ src, alt, isRealPhoto = false, className = '' }: ProjectImageProps) {
  // Unsplashの画像かどうかを判定
  const isStockPhoto = src.includes('unsplash.com')

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
      />
      {(isStockPhoto || !isRealPhoto) && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
          ※イメージ写真
        </div>
      )}
      {isRealPhoto && (
        <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded font-bold">
          ✓ 実際の施工写真
        </div>
      )}
    </div>
  )
}
