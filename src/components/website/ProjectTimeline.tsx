'use client'

import { useState, useEffect, useRef } from 'react'
import { Rocket, Zap, Lightbulb, CheckCircle, Clock, AlertCircle } from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string
  progress: number
  status: 'completed' | 'in-progress' | 'planning' | 'blocked'
  startDate: string
  targetDate: string
  tasks: string[]
  color: string
}

export default function ProjectTimeline() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [time, setTime] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const projects: Project[] = [
    {
      id: '1',
      title: 'AI日報システム',
      description: '音声入力と自動文章生成で業務効率化',
      progress: 100,
      status: 'completed',
      startDate: '2024-12',
      targetDate: '2025-03',
      tasks: ['音声入力実装', 'AI文章生成', 'データベース構築', '運用開始'],
      color: '#10B981',
    },
    {
      id: '2',
      title: '職人マッチングシステム',
      description: '案件に最適な職人を自動でマッチング',
      progress: 100,
      status: 'completed',
      startDate: '2025-01',
      targetDate: '2025-04',
      tasks: ['職人DB構築', 'マッチングAI開発', 'テスト運用', '本番稼働'],
      color: '#10B981',
    },
    {
      id: '3',
      title: 'メールニュースレター',
      description: '顧客・職人向けの定期情報配信',
      progress: 45,
      status: 'in-progress',
      startDate: '2025-09',
      targetDate: '2025-11',
      tasks: ['配信システム選定', 'コンテンツ企画', 'デザイン作成', 'テスト配信'],
      color: '#D4AF37',
    },
    {
      id: '4',
      title: 'シニアリフォーム市場参入',
      description: 'バリアフリー特化サービスの本格展開',
      progress: 25,
      status: 'planning',
      startDate: '2025-10',
      targetDate: '2026-03',
      tasks: ['市場調査', 'サービス設計', 'パートナー開拓', 'マーケティング'],
      color: '#D4AF37',
    },
    {
      id: '5',
      title: 'AI日報ライセンス販売',
      description: '他社への技術提供・収益化',
      progress: 10,
      status: 'planning',
      startDate: '2025-11',
      targetDate: '2026-06',
      tasks: ['ライセンス設計', '価格戦略', 'セールス体制', 'サポート構築'],
      color: '#C0C0C0',
    },
    {
      id: '6',
      title: 'すけ台帳連携強化',
      description: '外部プラットフォームとの統合',
      progress: 5,
      status: 'blocked',
      startDate: '2025-12',
      targetDate: '2026-02',
      tasks: ['API仕様確認', '連携テスト', 'データ同期', '運用開始'],
      color: '#EF4444',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-white" />
      case 'in-progress':
        return <Zap className="w-5 h-5 text-white" />
      case 'planning':
        return <Lightbulb className="w-5 h-5 text-white" />
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-white" />
      default:
        return <Clock className="w-5 h-5 text-white" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了'
      case 'in-progress':
        return '進行中'
      case 'planning':
        return '計画中'
      case 'blocked':
        return 'ブロック'
      default:
        return '未着手'
    }
  }

  // 背景アニメーション
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // プログレスラインを描画
      projects.forEach((project, index) => {
        const y = 80 + index * 120
        const progressWidth = (canvas.width * project.progress) / 100

        // 背景ライン
        ctx.strokeStyle = '#DAE2E8'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(100, y)
        ctx.lineTo(canvas.width - 100, y)
        ctx.stroke()

        // プログレスライン（アニメーション）
        const animatedProgress = Math.min(progressWidth, (time % 200) * 5)
        ctx.strokeStyle = project.color
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.moveTo(100, y)
        ctx.lineTo(100 + animatedProgress, y)
        ctx.stroke()

        // パルスドット
        if (project.status === 'in-progress') {
          const pulse = Math.sin(time * 0.05) * 3 + 5
          ctx.fillStyle = project.color
          ctx.beginPath()
          ctx.arc(100 + progressWidth, y, pulse, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      setTime((t) => t + 1)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="bg-white border border-[#DAE2E8] p-8">
      <div className="relative">
        {/* Canvas背景 */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20" />

        {/* プロジェクトカード */}
        <div className="relative space-y-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`flex items-start gap-6 p-6 border-l-4 transition-all cursor-pointer ${
                selectedProject === project.id
                  ? 'bg-[#F5F5F5] shadow-lg'
                  : 'bg-white hover:bg-[#F5F5F5] hover:shadow-md'
              }`}
              style={{ borderColor: project.color }}
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            >
              {/* ステータスアイコン */}
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: project.color }}
              >
                {getStatusIcon(project.status)}
              </div>

              {/* プロジェクト情報 */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-black text-[#252423] mb-1">{project.title}</h4>
                    <p className="text-sm text-[#252423]/70">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-xs px-3 py-1 font-bold border"
                      style={{
                        color: project.color,
                        borderColor: project.color,
                        backgroundColor: `${project.color}15`,
                      }}
                    >
                      {getStatusText(project.status)}
                    </span>
                    <p className="text-xs text-[#252423]/50 mt-2">
                      {project.startDate} → {project.targetDate}
                    </p>
                  </div>
                </div>

                {/* プログレスバー */}
                <div className="relative h-3 bg-[#DAE2E8] overflow-hidden mb-3">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${project.progress}%`,
                      backgroundColor: project.color,
                    }}
                  >
                    {/* 進行中の場合、パルスアニメーション */}
                    {project.status === 'in-progress' && (
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#252423]/50">進捗率</span>
                  <span className="text-2xl font-black" style={{ color: project.color }}>
                    {project.progress}%
                  </span>
                </div>

                {/* タスク詳細（展開時） */}
                {selectedProject === project.id && (
                  <div className="mt-4 pt-4 border-t border-[#DAE2E8] animate-slideDown">
                    <p className="text-xs font-bold text-[#252423] mb-3">タスク一覧:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {project.tasks.map((task, i) => {
                        const isCompleted = i < (project.tasks.length * project.progress) / 100
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2 p-2 border transition-all ${
                              isCompleted
                                ? 'bg-[#10B981]/10 border-[#10B981]'
                                : 'bg-white border-[#DAE2E8]'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 flex items-center justify-center ${
                                isCompleted ? 'bg-[#10B981]' : 'bg-[#DAE2E8]'
                              }`}
                            >
                              {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs ${isCompleted ? 'text-[#252423] font-bold' : 'text-[#252423]/50'}`}>
                              {task}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
