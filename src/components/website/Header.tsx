'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'

type NavItem = {
  name: string
  href: string
  submenu?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  {
    name: '企業情報',
    href: '/corporate',
    submenu: [
      { name: '会社概要', href: '/corporate/about' },
      { name: '企業理念', href: '/corporate/philosophy' },
      { name: '沿革', href: '/corporate/history' },
    ],
  },
  {
    name: '事業案内',
    href: '/services',
    submenu: [
      { name: '内装工事', href: '/services/interior' },
      { name: 'リフォーム', href: '/services/reform' },
      { name: 'バリアフリー', href: '/services/barrier-free' },
      { name: '店舗デザイン', href: '/services/shop-design' },
      { name: '色彩・デザイン提案', href: '/services/color-design' },
    ],
  },
  { name: '施工実績', href: '/portfolio' },
  {
    name: 'お客様へ',
    href: '/technology',
    submenu: [
      { name: 'ゼヒトモご利用の方', href: '/lp/zehitomo' },
      { name: 'AI活用', href: '/technology/ai' },
      { name: '職人ネットワーク・マップログ', href: '/technology/craftsmen' },
      { name: '品質管理', href: '/technology/quality' },
    ],
  },
  { name: 'インサイト', href: '/blog' },
  { name: 'お知らせ', href: '/news' },
  { name: 'AIタクミ', href: '/chat' },
  { name: 'お問い合わせ', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  // スクロール進捗バー
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollableHeight = documentHeight - windowHeight
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      setScrollProgress(progress)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // メニュー開閉時の body scroll 制御
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      firstFocusableRef.current?.focus()
      // タクミ（DigitalHuman）を閉じるイベント
      window.dispatchEvent(new CustomEvent('closeTakumi'))
    } else {
      document.body.style.overflow = ''
      setExpandedMenus(new Set())
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Escapeキーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const handleMenuItemClick = () => setMobileMenuOpen(false)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[200] w-full transition-all duration-500 ease-in-out ${scrollProgress > 0 ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' : 'bg-transparent border-b border-transparent'}`}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50" />

        {/* Scroll Progress Bar (Lightning Effect) */}
        <div
          className="absolute bottom-0 left-0 h-[1px] z-[201] transition-all duration-[50ms] ease-out will-change-[width] opacity-70"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Main Beam - Gradient from gold to white heat */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#FFF] shadow-[0_0_15px_#D4AF37]" />

          {/* The "Spark" (Lightning Head) - Subtle elegance */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-l from-white via-[#F4CF57] to-transparent blur-[0.5px]" />
        </div>

        <nav className="mx-auto max-w-[1440px] px-6 lg:px-12" aria-label="Top">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Area - Premium Typographic */}
            <div className="flex items-center group cursor-pointer">
              <Link href="/" className="flex flex-col items-center justify-center">
                <div className="relative">
                  <span className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-[#252423] group-hover:text-[#D4AF37] transition-colors duration-500">
                    IWASAKI
                  </span>

                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-[1px] w-4 bg-[#D4AF37]/50"></span>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#252423]/60 font-medium">Interior Design</span>
                  <span className="h-[1px] w-4 bg-[#D4AF37]/50"></span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:gap-x-8 items-center">
              {navigation.map((item) => {
                // const isContact = item.name === 'お問い合わせ'
                // if (isContact) return null // Render Contact as normal link now

                return (
                  <div key={item.name} className="group relative h-20 flex items-center">
                    <Link
                      href={item.href}
                      className="relative inline-flex items-center gap-x-1 text-[12px] font-medium tracking-[0.1em] text-[#252423] hover:text-[#D4AF37] transition-colors duration-300 uppercase"
                    >
                      <span className="relative z-10">{item.name}</span>
                      {item.submenu && <ChevronDown className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                    </Link>

                    {/* Premium Mega Menu / Dropdown */}
                    {item.submenu && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-64 pt-2 hidden group-hover:block transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                        <div className="relative bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-[#D4AF37]/10 py-3 rounded-sm overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/50 to-[#D4AF37]/0" />
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              className="block px-6 py-3 text-xs tracking-wider text-[#252423]/80 hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] transition-all border-l-2 border-transparent hover:border-[#D4AF37]"
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                ref={firstFocusableRef}
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#252423] hover:text-[#D4AF37] transition-colors z-[210] relative"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="メニュー"
              >
                <div className="space-y-1.5 cursor-pointer group">
                  <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block w-4 h-[2px] bg-current ml-auto transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'group-hover:w-6'}`} />
                  <span className={`block w-6 h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu: headerの外で描画（タクミより高いz-index） */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[300] bg-[#252423]/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div
            ref={menuRef}
            className="fixed top-20 left-0 bottom-0 z-[310] w-[85%] max-w-sm bg-white shadow-2xl lg:hidden origin-top-left"
            role="dialog"
            aria-modal="true"
            aria-label="ナビゲーションメニュー"
          >
            <nav className="h-full overflow-y-auto">
              <div className="px-4 py-6 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name} className="border-b border-[#DAE2E8] last:border-0">
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className="w-full flex items-center justify-between px-4 py-4 text-left text-base font-medium text-[#252423] hover:bg-[#10B981]/5 active:bg-[#10B981]/10 transition-colors rounded-lg"
                          aria-expanded={expandedMenus.has(item.name)}
                        >
                          <span>{item.name}</span>
                          <ChevronRight
                            className={`h-5 w-5 text-[#10B981] transition-transform duration-200 ${expandedMenus.has(item.name) ? 'rotate-90' : ''}`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenus.has(item.name) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div className="pl-4 pb-2 space-y-1">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                onClick={handleMenuItemClick}
                                className="block px-4 py-3 text-sm text-[#252423] hover:bg-[#10B981]/5 active:bg-[#10B981]/10 hover:text-[#10B981] transition-colors rounded-lg"
                              >
                                {subitem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleMenuItemClick}
                        className="block px-4 py-4 text-base font-medium text-[#252423] hover:bg-[#10B981]/5 active:bg-[#10B981]/10 hover:text-[#10B981] transition-colors rounded-lg"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}

      {/* 固定ヘッダー分のスペーサー */}
      <div className="h-20" aria-hidden="true" />
    </>
  )
}
