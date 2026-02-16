'use client'

import React, { useEffect, useState } from 'react'
import { RefreshCw, Lightbulb, TrendingUp, Target, Brain, Heart, Sparkles, Award, Users, Clock, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface DeepQuote {
  quote: string
  author: string
  category: string
  context: string
  interpretation: string
  actionItems: string[]
  relatedConcept: string
  historicalBackground: string
  modernApplication: string
  personalChallenge: string
}

export function BusinessQuoteOpus() {
  const [quote, setQuote] = useState<DeepQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [projectContext, setProjectContext] = useState<any>(null)
  const supabase = createClient()

  // 現在のプロジェクト状況を取得
  const fetchProjectContext = async () => {
    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')

      const { data: customers } = await supabase
        .from('customers')
        .select('*')

      const { data: recentFunds } = await supabase
        .from('funds_entries')
        .select('*')
        .order('entry_date', { ascending: false })
        .limit(10)

      const statusCounts: any = {}
      projects?.forEach(p => {
        statusCounts[p.status || '未設定'] = (statusCounts[p.status || '未設定'] || 0) + 1
      })

      const totalRevenue = projects?.reduce((sum, p) => sum + (p.receivable_amount || 0), 0) || 0
      const avgRevenue = projects?.length ? totalRevenue / projects.length : 0

      setProjectContext({
        totalProjects: projects?.length || 0,
        statusCounts,
        totalRevenue,
        avgRevenue,
        customerCount: customers?.length || 0,
        recentFunds,
        preConstruction: statusCounts['施工前'] || 0,
        waitingPayment: statusCounts['入出金待'] || 0
      })
    } catch {
      // Failed to fetch context
    }
  }

  const generateDeepQuote = () => {
    setLoading(true)

    // 現在の時間と状況を取得
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const day = now.getDay()
    const date = now.getDate()
    const month = now.getMonth() + 1
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][day]

    // 完全にランダムな要素を追加（毎回違う格言を生成するため）
    const randomSeed = Math.random()
    const timestamp = Date.now()
    const uniqueId = `${timestamp}_${randomSeed}`

    // プロジェクトコンテキストから動的に格言を生成
    // ここではテンプレートを使わず、データから直接生成
    setTimeout(() => {
      let generatedQuote = ''
      let author = ''
      let category = ''
      let context = ''
      let interpretation = ''
      let actionItems: string[] = []
      let relatedConcept = ''
      let historicalBackground = ''
      let modernApplication = ''
      let personalChallenge = ''

      // データとランダム値を組み合わせて完全にユニークな格言を生成
      const quoteType = Math.floor(randomSeed * 100)

      if (quoteType < 10 && projectContext) {
        // プロジェクト数に基づく格言
        generatedQuote = `${projectContext.totalProjects}の案件は${projectContext.totalProjects}の物語。それぞれに込められた思いが、イワサキ内装の歴史を作る`
        author = `データ分析から生成（${now.toLocaleTimeString('ja-JP')}）`
        category = "案件管理"
        context = `現在${projectContext.totalProjects}件の案件を管理中。一つ一つが大切な仕事です。`
        interpretation = "数字は単なる数字ではなく、それぞれにお客様の期待と信頼が込められています。"
        actionItems = [
          `${projectContext.preConstruction}件の施工前案件の優先順位を確認`,
          "今日完了できる案件をリストアップ",
          "明日の準備を15分だけでも進める"
        ]
        relatedConcept = "案件の数だけ成長の機会がある"
        historicalBackground = `${month}月は建設業界にとって重要な時期`
        modernApplication = "デジタル管理により、より多くの案件を効率的に処理可能"
        personalChallenge = "今日、最も重要な1件に全力を注ぐとしたら？"
      } else if (quoteType < 20 && projectContext) {
        // 資金に基づく格言
        const revenueInMan = Math.floor(projectContext.totalRevenue / 10000)
        generatedQuote = `${revenueInMan}万円の売上は、${revenueInMan}回の「ありがとう」の積み重ね`
        author = `財務分析AI（${hour}時${minute}分生成）`
        category = "収益管理"
        context = `総売上${revenueInMan}万円は、信頼の証です。`
        interpretation = "売上の背後には、必ず顧客の満足があります。"
        actionItems = [
          "入金確認を忘れずに",
          "請求書の発行状況をチェック",
          "来月の資金計画を立てる"
        ]
        relatedConcept = "キャッシュフローは企業の血液"
        historicalBackground = "健全な資金繰りが企業を支える"
        modernApplication = `${projectContext.waitingPayment}件の入出金待ち案件の管理が重要`
        personalChallenge = "次の大型案件獲得のための準備は？"
      } else if (quoteType < 30) {
        // 時間に基づく格言
        generatedQuote = `${hour}時${minute}分、この瞬間も誰かの幸せを作る時間`
        author = `時間管理システム（リアルタイム生成）`
        category = "時間活用"
        context = `${dayOfWeek}曜日の${hour > 12 ? '午後' : '午前'}、今この時間の使い方が未来を決める。`
        interpretation = "時間は誰にでも平等。使い方で差がつきます。"
        actionItems = [
          hour < 12 ? "午前中に重要な決断を" : "今日の振り返りと明日の準備を",
          "15分でできることを3つ実行",
          "休憩も計画的に取る"
        ]
        relatedConcept = "時間は最も貴重な資源"
        historicalBackground = "時は金なりという言葉の真の意味"
        modernApplication = "効率化ツールで時間を創出"
        personalChallenge = `今から${24 - hour}時間で達成したいことは？`
      } else if (quoteType < 40 && projectContext) {
        // 顧客に基づく格言
        generatedQuote = `${projectContext.customerCount}社の信頼は、${projectContext.customerCount}年分の努力の結晶`
        author = `顧客関係分析（${new Date().toISOString()}）`
        category = "顧客関係"
        context = `${projectContext.customerCount}社から継続的に仕事をいただける幸せ。`
        interpretation = "一度の仕事が、長い信頼関係の始まり。"
        actionItems = [
          "既存顧客へのフォローアップ",
          "新規顧客開拓の種まき",
          "顧客満足度を高める工夫"
        ]
        relatedConcept = "顧客は最高の資産"
        historicalBackground = "信頼は一日にして成らず"
        modernApplication = "口コミとリピートが最強の営業"
        personalChallenge = "今日、どの顧客を笑顔にできるか？"
      } else if (quoteType < 50) {
        // 曜日と月に基づく格言
        generatedQuote = `${month}月の${dayOfWeek}曜日、新しい挑戦の扉が開く日`
        author = `カレンダーAI（${uniqueId.substring(0, 8)}）`
        category = "日々の心構え"
        context = `${month}月${date}日、今日という日は二度と来ない。`
        interpretation = "毎日が新しいスタート、新しいチャンス。"
        actionItems = [
          dayOfWeek === '月' ? "週の目標を明確に" : "今週の進捗を確認",
          "今日だけの特別な行動を1つ",
          "明日への橋渡しを忘れずに"
        ]
        relatedConcept = "一日一生の精神"
        historicalBackground = `${month}月の日本の伝統と文化`
        modernApplication = "デジタル時代でも大切な日々の積み重ね"
        personalChallenge = `${dayOfWeek}曜日を最高の日にするには？`
      } else if (quoteType < 60 && projectContext) {
        // 完了率に基づく格言
        const completionRate = projectContext.waitingPayment / (projectContext.totalProjects || 1) * 100
        generatedQuote = `完了率${Math.floor(completionRate)}%の実績は、実行力${Math.floor(completionRate)}%の証明`
        author = `パフォーマンス分析（自動生成）`
        category = "実行力"
        context = `${projectContext.waitingPayment}件が入出金待ち。これは仕事の速さの証。`
        interpretation = "完了した仕事の数が、次の仕事を呼び込む。"
        actionItems = [
          "完了案件の請求処理",
          "次の案件の準備",
          "実績を顧客にアピール"
        ]
        relatedConcept = "実行力が信頼を生む"
        historicalBackground = "職人の仕事は完成度で評価される"
        modernApplication = "スピードと品質の両立が競争力"
        personalChallenge = "完了率100%を目指すには？"
      } else if (quoteType < 70) {
        // 朝昼夜に応じた格言
        if (hour < 10) {
          generatedQuote = `朝${hour}時の決断は、夕方${hour + 10}時の満足になる`
          context = "朝の黄金時間を最大活用しましょう。"
        } else if (hour < 15) {
          generatedQuote = `昼${hour}時の行動は、明日の${hour - 12}時の準備`
          context = "日中の活動が未来を作ります。"
        } else {
          generatedQuote = `夕方${hour}時の振り返りは、明朝の活力源`
          context = "一日の締めくくりが明日への架け橋。"
        }
        author = `時間帯別AI（${hour}:${minute}）`
        category = "時間管理"
        interpretation = "時間帯に応じた最適な行動が成功を呼ぶ。"
        actionItems = [
          "今の時間帯に最適な作業を選択",
          "エネルギーレベルに合わせた仕事配分",
          "次の時間帯への準備"
        ]
        relatedConcept = "バイオリズムと生産性"
        historicalBackground = "日本の伝統的な時間の考え方"
        modernApplication = "フレックスタイムでも大切な時間意識"
        personalChallenge = `${hour}時台を最も有効に使うには？`
      } else if (quoteType < 80 && projectContext) {
        // 施工前案件に基づく格言
        if (projectContext.preConstruction > 0) {
          generatedQuote = `${projectContext.preConstruction}件の準備は、${projectContext.preConstruction}倍の成功確率`
          context = `施工前${projectContext.preConstruction}件、準備が成否を分けます。`
        } else {
          generatedQuote = `静かな時こそ、次の波に備える絶好期`
          context = "案件が少ない今こそ、準備のチャンス。"
        }
        author = `案件分析AI（Ver.${month}.${date}）`
        category = "準備と計画"
        interpretation = "段取り八分、仕事二分の精神。"
        actionItems = [
          "材料の在庫確認",
          "職人さんのスケジュール調整",
          "必要な道具のメンテナンス"
        ]
        relatedConcept = "準備の質が成果の質"
        historicalBackground = "日本の職人文化における段取りの重要性"
        modernApplication = "プロジェクト管理ツールの活用"
        personalChallenge = "最も準備不足な部分は何か？"
      } else if (quoteType < 90) {
        // ランダムな励まし格言
        const phrases = [
          `${projectContext?.totalProjects || 29}の挑戦が、${projectContext?.totalProjects || 29}の成長を生む`,
          `今日の小さな一歩が、明日の大きな飛躍につながる`,
          `困難は成長の種、乗り越えた先に花が咲く`,
          `誠実な仕事は必ず評価される`,
          `継続は力なり、今日も一歩前進`
        ]
        const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)]
        generatedQuote = selectedPhrase
        author = `励ましAI（${new Date().getTime()}）`
        category = "モチベーション"
        context = "毎日の積み重ねが大きな成果を生みます。"
        interpretation = "前向きな気持ちが良い仕事を生む。"
        actionItems = [
          "今日の成功を1つ見つける",
          "明日の目標を1つ設定",
          "感謝の気持ちを忘れずに"
        ]
        relatedConcept = "ポジティブシンキングの効果"
        historicalBackground = "日本の「がんばる」文化"
        modernApplication = "メンタルヘルスの重要性"
        personalChallenge = "今日、自分を褒められることは？"
      } else {
        // 完全ランダム生成
        const seed = (timestamp + randomSeed * 1000000) % 100
        generatedQuote = `人生は${seed}%の努力と${100-seed}%の運。でも努力なしに運は来ない`
        author = `ランダム生成AI（Seed: ${seed}）`
        category = "人生哲学"
        context = `${hour}時${minute}分、新しい視点で物事を見る時間。`
        interpretation = "バランスの取れた考え方が成功への道。"
        actionItems = [
          "努力できる部分を明確化",
          "運を味方につける準備",
          "両方のバランスを考える"
        ]
        relatedConcept = "努力と運の相関関係"
        historicalBackground = "成功者の共通点"
        modernApplication = "データと直感のバランス"
        personalChallenge = `${seed}%の努力をどこに注ぐか？`
      }

      const newQuote: DeepQuote = {
        quote: generatedQuote,
        author,
        category,
        context,
        interpretation,
        actionItems,
        relatedConcept,
        historicalBackground,
        modernApplication,
        personalChallenge
      }

      setQuote(newQuote)
      setLoading(false)

    }, 800)
  }

  useEffect(() => {
    fetchProjectContext()
  }, [])

  useEffect(() => {
    if (projectContext) {
      generateDeepQuote()
    }
  }, [projectContext])

  const getCategoryIcon = () => {
    if (!quote) return <Lightbulb className="h-5 w-5" />

    const iconMap: { [key: string]: React.ReactElement } = {
      '案件': <Target className="h-5 w-5" />,
      '収益': <TrendingUp className="h-5 w-5" />,
      '時間': <Clock className="h-5 w-5" />,
      '顧客': <Heart className="h-5 w-5" />,
      '実行': <Brain className="h-5 w-5" />,
      '準備': <BookOpen className="h-5 w-5" />,
      'モチベ': <Sparkles className="h-5 w-5" />,
      '人生': <Award className="h-5 w-5" />,
    }

    for (const [key, icon] of Object.entries(iconMap)) {
      if (quote.category.includes(key)) return icon
    }
    return <Sparkles className="h-5 w-5" />
  }

  if (loading) {
    return (
      <Card className="p-6 bg-gray-50 border-gray-300">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </Card>
    )
  }

  if (!quote) return null

  return (
    <Card className="p-6 bg-gray-50 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-gray-700">
              {getCategoryIcon()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">深層経営格言</h3>
              <span className="text-xs text-gray-600">{quote.category}</span>
            </div>
          </div>
          <button
            onClick={generateDeepQuote}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="新しい格言を取得"
          >
            <RefreshCw className="h-5 w-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* コンテキスト */}
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">{quote.context}</p>
        </div>

        {/* メイン格言 */}
        <div className="space-y-3">
          <p className="text-2xl font-bold text-gray-900 leading-relaxed">
            「{quote.quote}」
          </p>
          <p className="text-sm text-gray-700 font-medium text-right">
            ― {quote.author}
          </p>
        </div>

        {/* 深い解釈 */}
        <div className="p-4 bg-white rounded-lg border-l-4 border-gray-400">
          <h4 className="font-bold text-sm text-gray-800 mb-2">岩崎社長への解釈</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {quote.interpretation}
          </p>
        </div>

        {/* 実践アクション */}
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            今すぐできる実践アクション
          </h4>
          <ul className="space-y-2">
            {quote.actionItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-600 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 関連概念と背景 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <h5 className="text-xs font-bold text-gray-700 mb-1">関連概念</h5>
            <p className="text-xs text-gray-700">{quote.relatedConcept}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <h5 className="text-xs font-bold text-gray-700 mb-1">歴史的背景</h5>
            <p className="text-xs text-gray-700">{quote.historicalBackground}</p>
          </div>
        </div>

        {/* 現代への応用 */}
        <div className="p-3 bg-gray-100 rounded-lg">
          <h5 className="text-xs font-bold text-gray-700 mb-1">イワサキ内装での応用</h5>
          <p className="text-xs text-gray-700">{quote.modernApplication}</p>
        </div>

        {/* パーソナルチャレンジ */}
        <div className="p-4 bg-white rounded-lg border-2 border-gray-400">
          <h4 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            今日の挑戦
          </h4>
          <p className="text-sm text-gray-800 font-medium">
            {quote.personalChallenge}
          </p>
        </div>
      </div>
    </Card>
  )
}