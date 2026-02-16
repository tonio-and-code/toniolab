'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Calculator, ChevronRight } from 'lucide-react'

interface GrossProfitListItem {
  id: string
  project_id: string
  site_name: string
  selling_price: number
  total_cost: number
  gross_profit: number
  profit_rate: number
  created_at: string
  updated_at: string
  projects?: {
    project_name: string
    receivable_customer?: {
      customer_name: string
    }
  }
}

export function GrossProfitList() {
  const [sheets, setSheets] = useState<GrossProfitListItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchSheets()
  }, [])

  const fetchSheets = async () => {
    try {
      // まずシンプルにデータを取得
      const { data: sheetsData, error: sheetsError } = await supabase
        .from('gross_profit_sheets')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (sheetsError) {
        setSheets([])
        return
      }

      if (!sheetsData || sheetsData.length === 0) {
        setSheets([])
        return
      }
      
      // 各シートに対してプロジェクト情報を取得
      const sheetsWithProjects = await Promise.all(
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
            ...sheet,
            selling_price: Number(sheet.selling_price) || 0,
            total_cost: Number(sheet.total_cost) || 0,
            gross_profit: Number(sheet.gross_profit) || 0,
            profit_rate: Number(sheet.profit_rate) || 0,
            projects: projectData ? {
              ...projectData,
              receivable_customer: customerData
            } : null
          }
        })
      )

      setSheets(sheetsWithProjects)
    } catch {
      // Error fetching sheets silently handled
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatCurrency = (value: number) => {
    return '¥' + (value || 0).toLocaleString()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">読み込み中...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          粗利表一覧
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sheets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            粗利表がありません。案件管理から粗利表を作成してください。
          </div>
        ) : (
          <div className="space-y-2">
            {sheets.map((sheet) => (
              <Button
                key={sheet.id}
                variant="outline"
                className="w-full justify-between text-left p-4 h-auto"
                onClick={() => {
                  // キャッシュを回避するためにタイムスタンプを追加
                  const timestamp = new Date().getTime()
                  router.push(`/gross-profit?projectId=${sheet.project_id}&t=${timestamp}`)
                }}
              >
                <div className="flex-1">
                  <div className="font-medium text-base">
                    {sheet.projects?.project_name || '案件名なし'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    得意先: {sheet.projects?.receivable_customer?.customer_name || '-'}
                  </div>
                  {sheet.site_name && (
                    <div className="text-sm text-gray-500 mt-1">
                      現場: {sheet.site_name}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    最終更新: {formatDate(sheet.updated_at)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">粗利益</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(sheet.gross_profit)}
                    </div>
                    <div className="text-sm text-gray-500">
                      利益率: {sheet.profit_rate?.toFixed(1) || 0}%
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}