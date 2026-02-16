'use client'

import { useEffect, useState } from 'react'

interface Stats {
  craftsmenCount: number
  projectsCount: number
  satisfactionRate: number
  reviewCount: number
}

export default function RealTimeStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 p-6 text-center rounded-lg animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
        <p className="text-yellow-800">統計データの取得に失敗しました</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border-2 border-green-500 p-6 text-center rounded-lg hover:shadow-lg transition-all">
        <div className="text-3xl sm:text-4xl font-black text-green-500 mb-2">
          {stats.projectsCount}+
        </div>
        <div className="text-sm text-gray-700 font-bold">施工実績</div>
        <div className="text-xs text-gray-500 mt-1">※データベース集計</div>
      </div>

      <div className="bg-white border-2 border-blue-500 p-6 text-center rounded-lg hover:shadow-lg transition-all">
        <div className="text-3xl sm:text-4xl font-black text-blue-500 mb-2">
          {stats.craftsmenCount}名
        </div>
        <div className="text-sm text-gray-700 font-bold">職人ネットワーク</div>
        <div className="text-xs text-gray-500 mt-1">※登録職人数</div>
      </div>

      {stats.reviewCount > 0 ? (
        <div className="bg-white border-2 border-yellow-500 p-6 text-center rounded-lg hover:shadow-lg transition-all">
          <div className="text-3xl sm:text-4xl font-black text-yellow-500 mb-2">
            {stats.satisfactionRate}%
          </div>
          <div className="text-sm text-gray-700 font-bold">顧客満足度</div>
          <div className="text-xs text-gray-500 mt-1">※{stats.reviewCount}件のレビューから算出</div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 text-center rounded-lg">
          <div className="text-3xl sm:text-4xl font-black text-gray-400 mb-2">
            --%
          </div>
          <div className="text-sm text-gray-600 font-bold">顧客満足度</div>
          <div className="text-xs text-gray-500 mt-1">※レビュー募集中</div>
        </div>
      )}

      <div className="bg-white border-2 border-purple-500 p-6 text-center rounded-lg hover:shadow-lg transition-all">
        <div className="text-3xl sm:text-4xl font-black text-purple-500 mb-2">
          30年
        </div>
        <div className="text-sm text-gray-700 font-bold">創業からの実績</div>
        <div className="text-xs text-gray-500 mt-1">1994年創業</div>
      </div>
    </div>
  )
}
