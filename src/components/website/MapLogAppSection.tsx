'use client'

import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
import { Smartphone, Users, Star, MessageCircle, TrendingUp, CheckCircle } from 'lucide-react'

export default function MapLogAppSection() {
  const maplogAppUrl = 'https://maplog.iwasaki-naisou.com' // MapLogアプリのデプロイ先URL

  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500 text-white px-4 py-2 text-sm font-bold mb-4 rounded-full">
            NEW - お客様向けサービス
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            MapLog（マップログ）<br />
            <span className="text-green-600">職人とお客様をつなぐアプリ</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            施工の依頼から進捗確認、口コミ投稿、職人紹介まで。<br />
            信頼関係を築き、継続的なお付き合いをサポートします。
          </p>
        </div>

        {/* メイン: アプリ紹介 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 左: お客様向け機能 */}
          <div className="bg-white border-2 border-green-500 p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">お客様向け機能</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">施工依頼・進捗確認</h4>
                  <p className="text-sm text-gray-600">アプリから簡単に施工を依頼。リアルタイムで進捗を確認できます。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">口コミ・評価投稿</h4>
                  <p className="text-sm text-gray-600">施工後にアプリから評価・レビューを投稿。他のお客様の参考になります。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">職人との直接やりとり</h4>
                  <p className="text-sm text-gray-600">担当職人と直接メッセージでやりとり。細かい要望もスムーズに伝わります。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">紹介プログラム</h4>
                  <p className="text-sm text-gray-600">信頼できる職人を友人・知人に紹介。紹介特典もご用意しています。</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-green-50 border-2 border-green-200 p-6 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-green-600">✓</span>
                こんな方におすすめ
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">●</span>
                  <span>信頼できる職人と長期的な関係を築きたい</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">●</span>
                  <span>施工の進捗をリアルタイムで確認したい</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">●</span>
                  <span>過去の施工履歴を一元管理したい</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">●</span>
                  <span>友人に良い職人を紹介したい</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 右: QRコード・ダウンロード */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-xl text-center">
              <h3 className="text-xl font-black text-gray-900 mb-6">アプリをダウンロード</h3>

              <div className="inline-block bg-white p-6 rounded-2xl shadow-inner mb-6">
                <QRCodeSVG
                  value={maplogAppUrl}
                  size={200}
                  level="H"
                  includeMargin
                  fgColor="#10B981"
                />
              </div>

              <p className="text-sm text-gray-600 mb-6">
                スマホで読み取ってアプリにアクセス
              </p>

              <div className="space-y-3">
                <a
                  href={maplogAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-green-500 text-white px-8 py-4 font-bold text-lg hover:bg-green-600 transition-all rounded-lg shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    <span>MapLogアプリを開く</span>
                  </div>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#"
                    className="bg-black text-white px-4 py-3 text-sm font-bold hover:bg-gray-800 transition-all rounded-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <span>App Store</span>
                  </a>
                  <a
                    href="#"
                    className="bg-green-600 text-white px-4 py-3 text-sm font-bold hover:bg-green-700 transition-all rounded-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <span>Google Play</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 利用イメージ */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-4">利用イメージ</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-xs">1</span>
                  <span>アプリをダウンロード・登録（1分で完了）</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-xs">2</span>
                  <span>施工を依頼（写真添付で状況を伝える）</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-xs">3</span>
                  <span>担当職人と直接やりとり（見積もり・日程調整）</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-xs">4</span>
                  <span>施工完了後、評価・口コミ投稿</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-xs">5</span>
                  <span>信頼できる職人を友人に紹介</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部: メリット */}
        <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">
            MapLogアプリを使うメリット
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">信頼関係の構築</h4>
              <p className="text-sm text-gray-600">
                直接やりとりで職人との信頼関係を築けます。長期的なお付き合いが可能に。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">透明性の高いコミュニケーション</h4>
              <p className="text-sm text-gray-600">
                施工内容、費用、日程が明確。やりとりの履歴が残るので安心です。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎁</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">紹介特典</h4>
              <p className="text-sm text-gray-600">
                友人に職人を紹介すると、あなたと友人の両方に特典をプレゼント。
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            従来のお問い合わせフォームも引き続きご利用いただけます
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 font-bold hover:bg-gray-300 transition-all rounded-lg"
          >
            お問い合わせフォームはこちら
          </Link>
        </div>
      </div>
    </section>
  )
}
