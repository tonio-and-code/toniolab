'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MessageSquare } from 'lucide-react'

export default function HeaderNeo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // ヒーローセクション（画面の高さ）を通り過ぎたら切り替え
      const heroHeight = window.innerHeight
      setScrolled(window.scrollY > heroHeight - 100) // 100px手前で切り替え開始
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初回実行
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className={`w-8 h-8 transition-colors ${
              scrolled ? 'text-[#39A0EA]' : 'text-white'
            }`} strokeWidth={2.5} />
            <div>
              <p className={`text-lg font-bold transition-colors ${
                scrolled ? 'text-[#4D5B75]' : 'text-white'
              }`}>
                <span className={scrolled ? 'text-[#39A0EA]' : 'text-white'}>neo</span>career
              </p>
              <p className={`text-xs tracking-widest transition-colors ${
                scrolled ? 'text-[#80899C]' : 'text-white/90'
              }`}>GROUP</p>
            </div>
          </Link>

          {/* デスクトップメニュー */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { name: 'neocareerについて', href: '/about' },
              { name: '事業内容', href: '/business' },
              { name: '企業情報', href: '/corporate' },
              { name: 'ニュース', href: '/news' },
              { name: '採用情報', href: '/recruit' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-[#4D5B75] hover:text-[#39A0EA]'
                    : 'text-white hover:text-white/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 右側ボタン */}
          <div className="flex items-center gap-3">
            {/* 言語切替 */}
            <button className={`hidden lg:flex items-center gap-1 text-sm font-medium transition-colors ${
              scrolled
                ? 'text-[#80899C] hover:text-[#4D5B75]'
                : 'text-white/90 hover:text-white'
            }`}>
              日本語 <span className="text-xs">▼</span>
            </button>

            {/* お問い合わせボタン */}
            <Link
              href="/contact"
              className={`hidden lg:inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                scrolled
                  ? 'bg-white text-[#4D5B75] border border-gray-200 hover:border-[#39A0EA] hover:text-[#39A0EA] shadow-sm'
                  : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30'
              }`}
            >
              お問い合わせ
            </Link>

            {/* ハンバーガーメニュー */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                scrolled
                  ? 'bg-[#39A0EA] text-white hover:bg-[#2E8BD4]'
                  : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className={`lg:hidden py-4 transition-colors ${
            scrolled ? 'border-t border-gray-200' : 'border-t border-white/20'
          }`}>
            <div className="space-y-1">
              {[
                { name: 'neocareerについて', href: '/about' },
                { name: '事業内容', href: '/business' },
                { name: '企業情報', href: '/corporate' },
                { name: 'ニュース', href: '/news' },
                { name: '採用情報', href: '/recruit' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all ${
                    scrolled
                      ? 'text-[#4D5B75] hover:bg-[#39A0EA]/10 hover:text-[#39A0EA]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block mx-4 mt-4 text-center bg-[#39A0EA] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2E8BD4] transition-all"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
