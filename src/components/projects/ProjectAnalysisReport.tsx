'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Target,
  Users,
  Calendar,
  FileText,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface ProjectAnalysisReportProps {
  projectId: string
}

interface AnalysisReport {
  id: string
  project_id: string
  report_type: string
  title: string
  summary: string
  analysis_content: any
  recommendations: any[]
  risk_factors: any[]
  opportunities: any[]
  metrics: any
  data_snapshot: any
  created_at: string
}

interface Metric {
  label: string
  value: number | string
  change?: number
  status?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}

export function ProjectAnalysisReport({ projectId }: ProjectAnalysisReportProps) {
  const [reports, setReports] = useState<AnalysisReport[]>([])
  const [latestReport, setLatestReport] = useState<AnalysisReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadReports()
  }, [projectId])

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('project_analysis_reports')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReports(data || [])
      if (data && data.length > 0) {
        setLatestReport(data[0])
      }
    } catch {
      toast.error('レポートの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const generateNewAnalysis = async () => {
    setGenerating(true)
    try {
      // プロジェクトデータを取得
      const { data: project } = await supabase
        .from('projects')
        .select('*, project_payables(*)')
        .eq('id', projectId)
        .single()

      // 関連データを取得
      const [quotationsRes, invoicesRes, transactionsRes, scheduleRes] = await Promise.all([
        supabase.from('quotations').select('*').eq('project_id', projectId),
        supabase.from('invoices').select('*').eq('project_id', projectId),
        supabase.from('transactions').select('*').eq('project_id', projectId),
        supabase.from('project_schedules').select('*').eq('project_id', projectId)
      ])

      // 分析データを生成
      const totalPayables = project?.project_payables?.reduce((sum: number, p: any) => sum + (p.payable_amount || 0), 0) || 0
      const grossProfit = (project?.receivable_amount || 0) - totalPayables
      const profitMargin = project?.receivable_amount ? (grossProfit / project.receivable_amount * 100) : 0

      const analysisContent = {
        profitability_analysis: {
          gross_margin: profitMargin,
          gross_profit: grossProfit,
          revenue: project?.receivable_amount || 0,
          costs: totalPayables,
          quotation_count: quotationsRes.data?.length || 0,
          invoice_count: invoicesRes.data?.length || 0
        },
        timeline_analysis: {
          construction_status: project?.construction_status,
          sales_status: project?.sales_status,
          transaction_date: project?.transaction_date,
          schedule_count: scheduleRes.data?.length || 0
        },
        financial_metrics: {
          transaction_count: transactionsRes.data?.length || 0,
          total_transactions: transactionsRes.data?.reduce((sum: number, t: any) => sum + t.amount, 0) || 0
        }
      }

      // 推奨事項を生成
      const recommendations = []
      if (profitMargin < 20) {
        recommendations.push({
          priority: 'high',
          category: 'profitability',
          title: '利益率の改善',
          description: `現在の利益率${profitMargin.toFixed(1)}%は目標を下回っています`,
          action_items: ['コスト削減の検討', '価格交渉の実施']
        })
      }
      if (project?.construction_status === '施工前' && project?.transaction_date) {
        const daysUntilTransaction = Math.floor((new Date(project.transaction_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        if (daysUntilTransaction < 7) {
          recommendations.push({
            priority: 'high',
            category: 'schedule',
            title: '施工開始の遅延',
            description: '売上計上日が近づいていますが、まだ施工前です',
            action_items: ['施工スケジュールの確認', 'リソースの確保']
          })
        }
      }

      // リスク要因を生成
      const riskFactors = []
      if (grossProfit < 0) {
        riskFactors.push({
          severity: 'high',
          probability: 1.0,
          category: 'financial',
          description: '赤字案件',
          impact: `${Math.abs(grossProfit).toLocaleString()}円の損失`,
          mitigation: '原価の見直しと追加請求の検討'
        })
      }

      // 機会を生成
      const opportunities = []
      if (quotationsRes.data && quotationsRes.data.length > 1) {
        opportunities.push({
          category: 'sales',
          title: '追加受注の可能性',
          description: '複数の見積もりが存在します',
          potential_value: '追加収益の獲得'
        })
      }

      // レポートを保存
      const newReport = {
        project_id: projectId,
        report_type: 'comprehensive',
        title: `${project?.project_name} - 総合分析レポート`,
        summary: `利益率: ${profitMargin.toFixed(1)}% | 粗利益: ${grossProfit.toLocaleString()}円 | ステータス: ${project?.construction_status}/${project?.sales_status}`,
        analysis_content: analysisContent,
        recommendations,
        risk_factors: riskFactors,
        opportunities,
        metrics: {
          profit_margin: profitMargin,
          gross_profit: grossProfit,
          payables_count: project?.project_payables?.length || 0
        },
        data_snapshot: {
          project,
          quotations: quotationsRes.data,
          invoices: invoicesRes.data
        }
      }

      const { data, error } = await supabase
        .from('project_analysis_reports')
        .insert(newReport)
        .select()
        .single()

      if (error) throw error

      toast.success('分析レポートを生成しました')
      await loadReports()
    } catch {
      toast.error('分析の生成に失敗しました')
    } finally {
      setGenerating(false)
    }
  }

  const getMetricIcon = (status: string) => {
    switch (status) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    }
    return <Badge variant={variants[priority] || 'outline'}>{priority}</Badge>
  }

  const getSeverityBadge = (severity: string) => {
    const variants: any = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    }
    return <Badge variant={variants[severity] || 'outline'}>{severity}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!latestReport && !generating) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">分析レポートがありません</h3>
          <p className="text-gray-500 mb-4">AI分析を実行して、プロジェクトの詳細な分析を取得しましょう</p>
          <Button onClick={generateNewAnalysis} disabled={generating}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI分析を実行
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI分析レポート</h2>
          {latestReport && (
            <p className="text-sm text-gray-500">
              最終更新: {format(new Date(latestReport.created_at), 'yyyy/MM/dd HH:mm')}
            </p>
          )}
        </div>
        <Button onClick={generateNewAnalysis} disabled={generating} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          再分析
        </Button>
      </div>

      {latestReport && (
        <>
          {/* サマリーカード */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                分析サマリー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{latestReport.summary}</p>
            </CardContent>
          </Card>

          {/* メトリクスカード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">利益率</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestReport.metrics?.profit_margin?.toFixed(1) || 0}%
                </div>
                <Progress
                  value={Math.max(0, Math.min(100, latestReport.metrics?.profit_margin || 0))}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">粗利益</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${latestReport.metrics?.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{latestReport.metrics?.gross_profit?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">取引先数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestReport.metrics?.payables_count || 0}社
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 詳細タブ */}
          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations">推奨事項</TabsTrigger>
              <TabsTrigger value="risks">リスク</TabsTrigger>
              <TabsTrigger value="opportunities">機会</TabsTrigger>
              <TabsTrigger value="details">詳細分析</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {latestReport.recommendations?.length > 0 ? (
                latestReport.recommendations.map((rec: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        {getPriorityBadge(rec.priority)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{rec.description}</p>
                      {rec.action_items && (
                        <div>
                          <p className="text-sm font-medium mb-2">アクション項目:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {rec.action_items.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500">現時点で推奨事項はありません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              {latestReport.risk_factors?.length > 0 ? (
                latestReport.risk_factors.map((risk: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          {risk.category}
                        </CardTitle>
                        {getSeverityBadge(risk.severity)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-2">{risk.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">影響:</p>
                          <p className="font-medium">{risk.impact}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">対策:</p>
                          <p className="font-medium">{risk.mitigation}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">発生確率</p>
                        <Progress value={risk.probability * 100} className="mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500">重大なリスクは検出されていません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-4">
              {latestReport.opportunities?.length > 0 ? (
                latestReport.opportunities.map((opp: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        {opp.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-2">{opp.description}</p>
                      <p className="text-sm text-gray-500">
                        期待される価値: <span className="font-medium">{opp.potential_value}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">追加の機会を探索中です</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>収益性分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">売上高</span>
                      <span className="font-medium">
                        ¥{latestReport.analysis_content?.profitability_analysis?.revenue?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">原価</span>
                      <span className="font-medium">
                        ¥{latestReport.analysis_content?.profitability_analysis?.costs?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-500">粗利益</span>
                      <span className="font-bold">
                        ¥{latestReport.analysis_content?.profitability_analysis?.gross_profit?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">利益率</span>
                      <span className="font-bold">
                        {latestReport.analysis_content?.profitability_analysis?.gross_margin?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ステータス情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">工事ステータス</p>
                      <p className="font-medium">
                        {latestReport.analysis_content?.timeline_analysis?.construction_status || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">売上ステータス</p>
                      <p className="font-medium">
                        {latestReport.analysis_content?.timeline_analysis?.sales_status || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">見積書数</p>
                      <p className="font-medium">
                        {latestReport.analysis_content?.profitability_analysis?.quotation_count || 0}件
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">請求書数</p>
                      <p className="font-medium">
                        {latestReport.analysis_content?.profitability_analysis?.invoice_count || 0}件
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}