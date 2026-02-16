'use client'

import { useEffect, useState } from 'react'

interface VisitorStats {
  daysSinceFounding: number
  today: number
  yesterday: number
  total: number
  isDemo: boolean
}

export default function GuestBook() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [hasCountedThisSession, setHasCountedThisSession] = useState(false)

  useEffect(() => {
    // セッション中に既にカウント済みかチェック
    const counted = sessionStorage.getItem('visitor_counted')

    async function fetchAndCount() {
      try {
        // まだカウントしていなければカウント
        if (!counted && !hasCountedThisSession) {
          await fetch('/api/visitor-count', { method: 'POST' })
          sessionStorage.setItem('visitor_counted', 'true')
          setHasCountedThisSession(true)
        }

        // 統計を取得
        const res = await fetch('/api/visitor-count')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch visitor stats:', error)
      }
    }

    fetchAndCount()
  }, [hasCountedThisSession])

  if (!stats) {
    return null // ローディング中は何も表示しない
  }

  // コルクじじいのコメントを生成
  const getComment = () => {
    if (stats.today === 0) {
      return '今日はまだ誰も来ておらぬ。'
    } else if (stats.today === 1) {
      return 'ひとりのお客人が訪ねてきた。'
    } else if (stats.today <= 3) {
      return `${stats.today}人のお客人が訪ねてきた。`
    } else if (stats.today <= 10) {
      return `${stats.today}人ものお客人が訪ねてきた。賑やかな日じゃ。`
    } else {
      return `${stats.today}人...！ 何事じゃ...！`
    }
  }

  const getYesterdayComment = () => {
    if (stats.yesterday === 0) {
      return '昨日は静かな日じゃった。'
    } else if (stats.yesterday <= 3) {
      return `昨日は${stats.yesterday}人。静かな日じゃった。`
    } else {
      return `昨日は${stats.yesterday}人。`
    }
  }

  return (
    <div className="relative py-8">
      {/* 縦書き風の装飾ライン */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />

      <div className="text-center space-y-4">
        {/* 創業からの日数 */}
        <div className="text-[10px] tracking-[0.3em] text-[#D4AF37]/60 uppercase font-light">
          Since 1994
        </div>

        <div className="text-white/40 text-xs tracking-wider">
          創業から <span className="text-white/70 font-medium">{stats.daysSinceFounding.toLocaleString()}</span> 日目。
        </div>

        {/* メインのカウント表示 */}
        <div className="py-4 space-y-2">
          <p className="text-white/60 text-sm leading-relaxed tracking-wide">
            {getComment()}
          </p>
          <p className="text-white/40 text-xs tracking-wide">
            {getYesterdayComment()}
          </p>
        </div>

        {/* 総訪問者数 */}
        <div className="pt-2">
          <p className="text-white/40 text-xs tracking-wide">
            これまでに <span className="text-[#D4AF37]/70 font-medium">{stats.total.toLocaleString()}</span> 人が足を運んでくれた。
          </p>
        </div>

        {/* じじいの一言 */}
        <div className="pt-4">
          <p className="text-white/30 text-[10px] tracking-widest">
            ...ありがたいことじゃ。
          </p>
        </div>

        {/* 署名 */}
        <div className="pt-6 flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">C</span>
          </div>
          <span className="text-[10px] text-white/30 tracking-widest">Cork Jijii</span>
        </div>

        {/* デモモード表示 */}
        {stats.isDemo && (
          <div className="pt-2">
            <span className="text-[8px] text-white/20 tracking-wider">
              [Demo Mode - Set UPSTASH_REDIS_REST_URL to enable]
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
