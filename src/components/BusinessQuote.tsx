'use client'

import React, { useEffect, useState } from 'react'
import { RefreshCw, Lightbulb, TrendingUp, Target } from 'lucide-react'
import { Card } from '@/components/ui/card'

// リアルタイムで経営格言を生成（DBに保存しない）
export function BusinessQuote() {
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const generateQuote = () => {
    setLoading(true)

    // 現在の時刻や曜日に基づいて適切な格言を選択
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()

    const quotes = [
      // 朝の時間帯用
      ...(hour < 10 ? [
        { quote: "早起きは三文の徳。朝の1時間は夜の3時間に匹敵する", author: "ベンジャミン・フランクリン", category: "時間管理" },
        { quote: "朝の挨拶が会社の雰囲気を決める", author: "松下幸之助", category: "人間関係" },
        { quote: "1日の計は朝にあり", author: "中国のことわざ", category: "計画" }
      ] : []),

      // 昼の時間帯用
      ...(hour >= 10 && hour < 15 ? [
        { quote: "集中力は90分が限界。適度な休憩が生産性を上げる", author: "ポモドーロ・テクニック", category: "生産性" },
        { quote: "ランチタイムこそ、人脈を広げる最高の機会", author: "デール・カーネギー", category: "人脈" }
      ] : []),

      // 夕方の時間帯用
      ...(hour >= 15 ? [
        { quote: "今日できることを明日に延ばすな", author: "ベンジャミン・フランクリン", category: "実行力" },
        { quote: "1日の終わりに、明日の準備をすることが成功への近道", author: "ピーター・ドラッカー", category: "準備" }
      ] : []),

      // 月曜日用
      ...(day === 1 ? [
        { quote: "月曜日は新しい週の新しいスタート、新しいチャンス", author: "不明", category: "モチベーション" },
        { quote: "先週の失敗は、今週の成功の糧となる", author: "ヘンリー・フォード", category: "成長" }
      ] : []),

      // 金曜日用
      ...(day === 5 ? [
        { quote: "週末前こそ、来週の準備をする最良の時", author: "スティーブン・コヴィー", category: "計画" },
        { quote: "1週間の締めくくりは、次週への布石", author: "稲盛和夫", category: "継続" }
      ] : []),

      // 一般的な格言
      { quote: "顧客の声は神の声", author: "サム・ウォルトン", category: "顧客志向" },
      { quote: "失敗は成功の母", author: "トーマス・エジソン", category: "挑戦" },
      { quote: "継続は力なり", author: "日本のことわざ", category: "継続" },
      { quote: "時は金なり", author: "ベンジャミン・フランクリン", category: "時間管理" },
      { quote: "信頼は築くのに年月がかかり、失うのは一瞬", author: "ウォーレン・バフェット", category: "信頼" },
      { quote: "最も強い者が生き残るのではなく、変化に対応できる者が生き残る", author: "ダーウィン", category: "適応" },
      { quote: "完璧を目指すより、まず終わらせろ", author: "マーク・ザッカーバーグ", category: "実行" },
      { quote: "小さな改善の積み重ねが、大きな革新を生む", author: "稲盛和夫", category: "改善" },
      { quote: "現場に答えがある", author: "トヨタ生産方式", category: "現場主義" },
      { quote: "人を大切にする経営が、最も強い経営である", author: "松下幸之助", category: "人材" }
    ]

    // ランダムに選択
    const selected = quotes[Math.floor(Math.random() * quotes.length)]

    setTimeout(() => {
      setQuote(selected)
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    generateQuote()
  }, [])

  const getIcon = () => {
    switch(quote?.category) {
      case '経営哲学': return <Lightbulb className="h-5 w-5" />
      case '顧客志向': return <Target className="h-5 w-5" />
      case '改善': return <TrendingUp className="h-5 w-5" />
      default: return <Lightbulb className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="animate-pulse">
          <div className="h-4 bg-amber-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-amber-100 rounded w-1/4"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-amber-600">
              {getIcon()}
            </div>
            <span className="text-sm font-semibold text-amber-700">今の経営格言</span>
            {quote?.category && (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                {quote.category}
              </span>
            )}
          </div>

          {/* メイン格言 - より大きく表示 */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xl font-bold text-gray-800 mb-3 leading-relaxed">
              「{quote?.quote}」
            </p>
            <p className="text-sm text-gray-600 mb-4">
              ― {quote?.author}
            </p>
          </div>

          {/* 追加の解説やアドバイス */}
          <div className="mt-4 p-4 bg-white/70 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              💡 <span className="font-semibold">今日の実践ポイント：</span>
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {quote?.category === '時間管理' && '時間を大切にし、優先順位を明確にして行動しましょう。'}
              {quote?.category === '顧客志向' && 'お客様の立場に立って考え、期待を超えるサービスを提供しましょう。'}
              {quote?.category === '改善' && '小さな改善を積み重ね、日々進化し続けることが大切です。'}
              {quote?.category === '挑戦' && '失敗を恐れず、新しいことに積極的にチャレンジしましょう。'}
              {quote?.category === '継続' && '諦めずに続けることで、必ず成果が現れます。'}
              {quote?.category === '人材' && 'チームメンバーを大切にし、共に成長することを目指しましょう。'}
              {quote?.category === '実行' && '考えすぎず、まず行動に移すことが重要です。'}
              {quote?.category === '計画' && 'しっかりとした計画を立て、着実に実行しましょう。'}
              {(!quote?.category || !['時間管理', '顧客志向', '改善', '挑戦', '継続', '人材', '実行', '計画'].includes(quote.category)) &&
                'この格言を心に留めて、今日一日を充実したものにしましょう。'}
            </p>

            {/* 関連する統計や事実 */}
            <div className="mt-3 p-3 bg-amber-50 rounded">
              <p className="text-xs text-amber-800">
                <span className="font-semibold">豆知識：</span>
                {quote?.author === 'ピーター・ドラッカー' && 'ドラッカーは「マネジメントの父」と呼ばれ、現代経営学の基礎を築きました。'}
                {quote?.author === '松下幸之助' && 'パナソニック創業者。「経営の神様」と呼ばれ、日本的経営の模範とされています。'}
                {quote?.author === '稲盛和夫' && '京セラ・KDDI創業者。JAL再建でも手腕を発揮した名経営者です。'}
                {quote?.author === '本田宗一郎' && 'ホンダ創業者。技術者出身で、ものづくりへの情熱で世界的企業を築きました。'}
                {quote?.author === 'スティーブ・ジョブズ' && 'Apple創業者。革新的な製品で世界を変え続けました。'}
                {(!quote?.author || !['ピーター・ドラッカー', '松下幸之助', '稲盛和夫', '本田宗一郎', 'スティーブ・ジョブズ'].includes(quote.author)) &&
                  '成功者の言葉には、実践から得られた深い知恵が込められています。'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={generateQuote}
          className="ml-4 p-2 hover:bg-amber-100 rounded-lg transition-colors"
          title="新しい格言を取得"
        >
          <RefreshCw className="h-4 w-4 text-amber-600" />
        </button>
      </div>
    </Card>
  )
}

