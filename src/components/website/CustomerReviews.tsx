'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Review {
  id: string
  customer_name: string
  work_type: string
  rating: number
  comment: string
  location: string
  created_at: string
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="text-gray-500 mt-4">お客様の声を読み込み中...</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 p-12 text-center rounded-lg">
        <div className="text-6xl mb-4 text-gray-300">※</div>
        <h3 className="text-xl font-bold text-gray-700 mb-3">
          お客様の声を募集中です
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          施工させていただいたお客様のご意見・ご感想を掲載予定です。<br />
          現在、アンケートシステムを準備しております。
        </p>
        <div className="bg-white border border-gray-200 p-6 rounded-lg max-w-2xl mx-auto">
          <h4 className="font-bold text-gray-800 mb-3">代わりに、施工実績をご覧ください</h4>
          <p className="text-sm text-gray-600 mb-4">
            これまでに手がけた内装工事の詳細をご確認いただけます。
          </p>
          <Link
            href="/portfolio"
            className="inline-block bg-green-500 text-white px-6 py-3 font-bold hover:bg-green-600 transition-all rounded-lg"
          >
            施工実績を見る（100+件）→
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {review.customer_name.charAt(0)}
            </div>
            <div className="ml-4 flex-1">
              <div className="font-bold text-gray-900">{review.customer_name}</div>
              <div className="text-sm text-gray-500">{review.work_type}</div>
              <div className="text-xs text-gray-400">{review.location}</div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">「{review.comment}」</p>
          <div className="mt-3 text-xs text-gray-400">
            {new Date(review.created_at).toLocaleDateString('ja-JP')}
          </div>
        </div>
      ))}
    </div>
  )
}
