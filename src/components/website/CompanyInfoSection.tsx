'use client'

import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'

export default function CompanyInfoSection() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iwasaki-naisou.com'

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 border-t-4 border-green-500 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
            イワサキ内装について
          </h2>
          <p className="text-gray-600">
            詳しい会社情報は公式HPをご覧ください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左: QRコード */}
          <div className="bg-white border-2 border-gray-200 p-8 text-center rounded-lg shadow-lg">
            <div className="inline-block bg-white p-4 rounded-lg shadow-inner mb-4">
              <QRCodeSVG
                value={siteUrl}
                size={200}
                level="H"
                includeMargin
                fgColor="#10B981"
              />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">公式HP QRコード</h3>
            <p className="text-sm text-gray-600 mb-4">
              スマホで読み取って会社情報をチェック
            </p>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded">
              <p className="text-xs text-gray-500 break-all">{siteUrl}</p>
            </div>
          </div>

          {/* 右: 会社概要 */}
          <div className="bg-white border-2 border-gray-200 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b-2 border-green-500 pb-2">
              会社概要
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-gray-700 mb-1">会社名</div>
                <div className="text-gray-900">有限会社イワサキ内装</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-700 mb-1">創業</div>
                <div className="text-gray-900">1994年</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-700 mb-1">事業内容</div>
                <div className="text-gray-900">
                  内装工事、リフォーム、バリアフリー改修、店舗デザイン
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-700 mb-1">対応エリア</div>
                <div className="text-gray-900">東京都、神奈川県を中心に首都圏全域</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-700 mb-1">特徴</div>
                <div className="text-gray-900">
                  AI・DX技術を活用した施工管理、50名超の職人ネットワーク
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/"
                className="block bg-green-500 text-white text-center px-6 py-3 font-bold hover:bg-green-600 transition-all rounded-lg"
              >
                公式HPトップページへ
              </Link>
              <Link
                href="/corporate"
                className="block bg-white text-gray-900 text-center px-6 py-3 font-bold border-2 border-gray-300 hover:border-green-500 transition-all rounded-lg"
              >
                会社情報の詳細を見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
