'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PageSlot {
  id: string
  path: string
  label: string
  labelEn: string
}

const PAGES: PageSlot[] = [
  { id: '1', path: '/', label: 'TOP', labelEn: 'Home' },
  { id: '2', path: '/services/reform', label: 'リフォーム', labelEn: 'Reform' },
  { id: '3', path: '/portfolio', label: '施工実績', labelEn: 'Portfolio' },
  { id: '4', path: '/corporate', label: '会社案内', labelEn: 'Corporate' },
  { id: '5', path: '/technology', label: 'テクノロジー', labelEn: 'Technology' },
  { id: '6', path: '/journal', label: 'ジャーナル', labelEn: 'Journal' },
  { id: '7', path: '/slot-browser', label: 'スロット', labelEn: 'Slot Browser' },
]

export default function SiteShowcase() {
  const [activeSlots, setActiveSlots] = useState<PageSlot[]>(PAGES.slice(0, 4))
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  const scrollTo = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const scrollAmount = 320
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const selectPage = (page: PageSlot, slotIndex: number) => {
    const newSlots = [...activeSlots]
    newSlots[slotIndex] = page
    setActiveSlots(newSlots)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-stone-100 via-white to-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-3">
            Site Navigation
          </span>
          <h2 className="text-2xl md:text-3xl font-light text-stone-800 tracking-wide mb-3">
            サイトを<span className="font-medium text-amber-700">俯瞰する</span>
          </h2>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            各ページをスマートフォンビューで並列表示。
            タップで切り替え、横スクロールで探索。
          </p>
        </div>

        {/* Page Selector Pills */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-stone-100/80 rounded-full border border-stone-200/50">
            {PAGES.map((page) => {
              const isActive = activeSlots.some(s => s.id === page.id)
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    if (!isActive && activeSlots.length < 6) {
                      setActiveSlots([...activeSlots, page])
                    }
                  }}
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-white'
                    }
                  `}
                >
                  {page.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Devices Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollTo('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-all opacity-0 md:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-all opacity-0 md:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`
              flex gap-6 overflow-x-auto pb-6 px-8 md:px-16
              scrollbar-hide snap-x snap-mandatory
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {activeSlots.map((slot, index) => (
              <DeviceFrame
                key={`${slot.id}-${index}`}
                slot={slot}
                index={index}
                allPages={PAGES}
                onSelectPage={(page) => selectPage(page, index)}
                onRemove={() => {
                  if (activeSlots.length > 1) {
                    setActiveSlots(activeSlots.filter((_, i) => i !== index))
                  }
                }}
              />
            ))}

            {/* Add New Slot */}
            {activeSlots.length < 6 && (
              <div className="flex-shrink-0 snap-center">
                <div className="w-[280px] h-[560px] rounded-[2.5rem] border-2 border-dashed border-stone-300 flex items-center justify-center bg-stone-50/50 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group"
                  onClick={() => {
                    const unusedPage = PAGES.find(p => !activeSlots.some(s => s.id === p.id))
                    if (unusedPage) {
                      setActiveSlots([...activeSlots, unusedPage])
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-stone-200 group-hover:bg-amber-200 flex items-center justify-center mx-auto mb-3 transition-colors">
                      <span className="text-2xl text-stone-400 group-hover:text-amber-600">+</span>
                    </div>
                    <p className="text-xs text-stone-400 group-hover:text-amber-600 transition-colors">
                      ページを追加
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-stone-100 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-stone-50 to-transparent pointer-events-none" />
        </div>

        {/* Footer Note */}
        <p className="text-center text-[10px] text-stone-400 mt-8">
          Drag to scroll. Tap device to change page. Real-time site preview.
        </p>
      </div>
    </section>
  )
}

function DeviceFrame({
  slot,
  index,
  allPages,
  onSelectPage,
  onRemove
}: {
  slot: PageSlot
  index: number
  allPages: PageSlot[]
  onSelectPage: (page: PageSlot) => void
  onRemove: () => void
}) {
  const [showSelector, setShowSelector] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className="flex-shrink-0 snap-center group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Device Container */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="relative w-[280px] h-[560px] bg-gradient-to-b from-stone-800 via-stone-900 to-stone-800 rounded-[2.5rem] p-2 shadow-2xl shadow-stone-400/30">
          {/* Inner bezel */}
          <div className="absolute inset-2 rounded-[2rem] bg-gradient-to-b from-stone-700 to-stone-900" />

          {/* Screen */}
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-stone-900 rounded-b-2xl z-10" />

            {/* Status bar space */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent z-10" />

            {/* Loading Indicator */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-stone-100 flex items-center justify-center z-20">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Iframe */}
            <iframe
              src={slot.path}
              className="w-full h-full border-0 bg-white"
              onLoad={() => setIsLoaded(true)}
              title={slot.label}
            />

            {/* Page Selector Overlay */}
            {showSelector && (
              <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-white/60 text-xs mb-4 tracking-wider">SELECT PAGE</p>
                <div className="space-y-2 w-full">
                  {allPages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        onSelectPage(page)
                        setShowSelector(false)
                        setIsLoaded(false)
                      }}
                      className={`
                        w-full px-4 py-3 rounded-xl text-left transition-all
                        ${page.id === slot.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                        }
                      `}
                    >
                      <span className="text-sm font-medium">{page.label}</span>
                      <span className="text-xs opacity-60 ml-2">{page.path}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowSelector(false)}
                  className="mt-6 text-white/40 text-xs hover:text-white/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Touch Overlay - Click to show selector */}
            <div
              className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setShowSelector(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                  Tap to change page
                </span>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs shadow-lg z-30"
        >
          x
        </button>
      </div>

      {/* Label */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-stone-700">{slot.label}</p>
        <p className="text-[10px] text-stone-400 tracking-wider">{slot.labelEn}</p>
      </div>
    </div>
  )
}
