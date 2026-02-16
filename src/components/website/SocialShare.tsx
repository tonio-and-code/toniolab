'use client'

import { Facebook, Twitter } from 'lucide-react'

interface SocialShareProps {
  title: string
  description?: string
  url?: string
}

export default function SocialShare({ title, description, url }: SocialShareProps) {
  // URLを取得（サーバーサイドでは空文字）
  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : ''
  const shareText = description || title

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=550,height=450')
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=550,height=450')
  }

  const handleLineShare = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`
    window.open(lineUrl, '_blank', 'width=550,height=450')
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-[#252423]/70">共有:</span>

        {/* Twitter */}
        <button
          onClick={handleTwitterShare}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1DA1F2] text-white text-sm hover:bg-[#1a8cd8] transition-colors"
          aria-label="Twitterでシェア"
        >
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1877F2] text-white text-sm hover:bg-[#166fe5] transition-colors"
          aria-label="Facebookでシェア"
        >
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline">Facebook</span>
        </button>

        {/* LINE */}
        <button
          onClick={handleLineShare}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#06C755] text-white text-sm hover:bg-[#05b34c] transition-colors"
          aria-label="LINEでシェア"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          <span className="hidden sm:inline">LINE</span>
        </button>
      </div>
    </div>
  )
}
