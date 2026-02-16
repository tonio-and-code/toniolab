'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface ProjectWithProfit {
  id: string
  project_name: string
  receivable_customer?: {
    customer_name: string
  } | null
  gross_profit_sheet?: {
    selling_price: number
    total_cost: number
    gross_profit: number
    profit_rate: number
    updated_at: string
  }
}

export function ProfitReport() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithProfit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    fetchProjectsWithProfit()
  }, [selectedPeriod])

  const fetchProjectsWithProfit = async () => {
    try {
      // まずシンプルに粗利表データを取得
      const { data: sheetsData, error: sheetsError } = await supabase
        .from('gross_profit_sheets')
        .select('*')
        .order('gross_profit', { ascending: false })

      if (sheetsError) {
        // テーブルが存在しない場合のエラーハンドリング
        setProjects([])
        return
      }

      if (sheetsData && sheetsData.length > 0) {
        // 各シートに対してプロジェクト情報を取得
        const formattedData = await Promise.all(
          sheetsData.map(async (sheet) => {
            // まずプロジェクト情報を取得
            const { data: projectData, error: projectError } = await supabase
              .from('projects')
              .select('id, project_name, receivable_customer_id')
              .eq('id', sheet.project_id)
              .single()
            
            // 顧客情報を取得
            let customerData = null
            if (projectData?.receivable_customer_id) {
              const { data: customer } = await supabase
                .from('customers')
                .select('customer_name')
                .eq('id', projectData.receivable_customer_id)
                .single()
              customerData = customer
            }
            
            return {
              id: sheet.project_id,
              project_name: projectData?.project_name || '案件名なし',
              receivable_customer: customerData,
              gross_profit_sheet: {
                selling_price: Number(sheet.selling_price) || 0,
                total_cost: Number(sheet.total_cost) || 0,
                gross_profit: Number(sheet.gross_profit) || 0,
                profit_rate: Number(sheet.profit_rate) || 0,
                updated_at: sheet.updated_at
              }
            }
          })
        )
        
        // 期間でフィルタリング
        let filteredData = formattedData
        if (selectedPeriod !== 'all') {
          const now = new Date()
          filteredData = filteredData.filter(project => {
            if (!project.gross_profit_sheet?.updated_at) return false
            const updatedDate = new Date(project.gross_profit_sheet.updated_at)
            
            switch (selectedPeriod) {
              case 'this_month':
                return updatedDate.getMonth() === now.getMonth() && 
                       updatedDate.getFullYear() === now.getFullYear()
              case 'last_month':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
                return updatedDate.getMonth() === lastMonth.getMonth() && 
                       updatedDate.getFullYear() === lastMonth.getFullYear()
              case 'this_year':
                return updatedDate.getFullYear() === now.getFullYear()
              default:
                return true
            }
          })
        }
        setProjects(filteredData)
      } else {
        setProjects([])
      }
    } catch {
      // Error silently handled
    } finally {
      setLoading(false)
    }
  }

  // 集計値の計算
  const totalSelling = projects.reduce((sum, p) => sum + (p.gross_profit_sheet?.selling_price || 0), 0)
  const totalCost = projects.reduce((sum, p) => sum + (p.gross_profit_sheet?.total_cost || 0), 0)
  const totalProfit = projects.reduce((sum, p) => sum + (p.gross_profit_sheet?.gross_profit || 0), 0)
  const avgProfitRate = projects.length > 0 
    ? projects.reduce((sum, p) => sum + (p.gross_profit_sheet?.profit_rate || 0), 0) / projects.length
    : 0

  // トップ5の高収益案件
  const topProjects = projects.slice(0, 5)

  // 低収益案件（粗利率20%未満）
  const lowProfitProjects = projects.filter(p => 
    p.gross_profit_sheet && p.gross_profit_sheet.profit_rate < 20
  )

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">収益レポート</h1>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全期間</SelectItem>
            <SelectItem value="this_month">今月</SelectItem>
            <SelectItem value="last_month">先月</SelectItem>
            <SelectItem value="this_year">今年度</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">売上合計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                ¥{totalSelling.toLocaleString()}
              </div>
              <DollarSign className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">原価合計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                ¥{totalCost.toLocaleString()}
              </div>
              <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">粗利益合計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                ¥{totalProfit.toLocaleString()}
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均粗利率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {avgProfitRate.toFixed(1)}%
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* トップ5高収益案件 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-green-500" />
            高収益案件 TOP5
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProjects.map((project, index) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">
                      <span 
                        className="cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                      >
                        {project.project_name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.receivable_customer?.customer_name || '-'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ¥{project.gross_profit_sheet?.gross_profit.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    利益率: {project.gross_profit_sheet?.profit_rate.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 低収益案件アラート */}
      {lowProfitProjects.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <ArrowDownRight className="h-5 w-5" />
              要注意案件（粗利率20%未満）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowProfitProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                  <div>
                    <div className="font-medium">
                      <span 
                        className="cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                      >
                        {project.project_name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.receivable_customer?.customer_name || '-'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-700">
                      利益率: {project.gross_profit_sheet?.profit_rate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      粗利: ¥{project.gross_profit_sheet?.gross_profit.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 案件別詳細テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>案件別収益詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">案件名</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">得意先</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">売上</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">原価</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">粗利益</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">利益率</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      <span 
                        className="cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                      >
                        {project.project_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {project.receivable_customer?.customer_name || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ¥{project.gross_profit_sheet?.selling_price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ¥{project.gross_profit_sheet?.total_cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      ¥{project.gross_profit_sheet?.gross_profit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        (project.gross_profit_sheet?.profit_rate || 0) >= 30 
                          ? 'bg-green-100 text-green-700'
                          : (project.gross_profit_sheet?.profit_rate || 0) >= 20
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.gross_profit_sheet?.profit_rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}