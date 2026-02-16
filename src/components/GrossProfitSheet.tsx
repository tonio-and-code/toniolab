'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'

interface MaterialItem {
  id: string
  name: string
  details: string
  quantity: number
  unitPrice: number
  amount: number
  subtotal: number
  profitRate: number
}

interface GrossProfitData {
  materials: MaterialItem[]
  laborCost: number
  expenses: number
  sellingPrice: number
  totalCost: number
  grossProfit: number
  profitRate: number
}

interface GrossProfitSheetProps {
  projectId?: string
}

export function GrossProfitSheet({ projectId: propProjectId }: GrossProfitSheetProps = {}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectIdFromUrl = searchParams.get('projectId')
  const projectId = propProjectId || projectIdFromUrl
  const [siteName, setSiteName] = useState('')
  const [siteAddress, setSiteAddress] = useState('')
  
  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: '1',
      name: '',
      details: '',
      quantity: 0,
      unitPrice: 0,
      amount: 0,
      subtotal: 0,
      profitRate: 0
    }
  ])
  
  const [laborCost, setLaborCost] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [sellingPrice, setSellingPrice] = useState(0)
  
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null)
  const [projectData, setProjectData] = useState<any>(null)
  
  const supabase = createClient()

  // 現在の案件の粗利表を取得
  const fetchCurrentSheet = async () => {
    if (!projectId) return

    try {
      // キャッシュを回避するためにタイムスタンプを追加
      const timestamp = new Date().getTime()
      const { data, error } = await supabase
        .from('gross_profit_sheets')
        .select('*')
        .eq('project_id', projectId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // Error already handled by checking error code
      } else if (data) {

        setSelectedSheetId(data.id)
        setSiteName(data.site_name || '')
        setSiteAddress(data.site_address || '')

        const sheetData = data.data as GrossProfitData
        setMaterials(sheetData.materials || [])
        setLaborCost(sheetData.laborCost || 0)
        setExpenses(sheetData.expenses || 0)
        setSellingPrice(sheetData.sellingPrice || 0)
      } else {
        // データがない場合は初期化
        setSelectedSheetId(null)
        setSiteName('')
        setSiteAddress('')
        setMaterials([{
          id: '1',
          name: '',
          details: '',
          quantity: 0,
          unitPrice: 0,
          amount: 0,
          subtotal: 0,
          profitRate: 0
        }])
        setLaborCost(0)
        setExpenses(0)
        // 案件の売掛金額を初期値として使用
        if (projectData?.receivable_amount) {
          setSellingPrice(projectData.receivable_amount)
        } else {
          setSellingPrice(0)
        }
      }
    } catch {
      // Error fetching sheet silently handled
    }
  }

  // 案件情報を取得
  const fetchProjectData = async () => {
    if (!projectId) return
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          receivable_customer:customers!projects_receivable_customer_id_fkey(customer_name),
          project_payables(
            *,
            payable_customer:customers!project_payables_payable_customer_id_fkey(customer_name)
          )
        `)
        .eq('id', projectId)
        .single()
      
      if (error) {
        // 案件が見つからない場合のエラーは無視
      } else {
        setProjectData(data)
        // 売掛金額を初期値として設定
        if (data && data.receivable_amount && !selectedSheetId) {
          setSellingPrice(data.receivable_amount)
        }
      }
    } catch {
      // Error fetching project data silently handled
    }
  }

  useEffect(() => {
    if (projectId) {
      // 常に最新データを取得
      fetchProjectData()
      fetchCurrentSheet()
    }
  }, [projectId])

  // 内容の追加
  const addMaterial = () => {
    const newMaterial: MaterialItem = {
      id: Date.now().toString(),
      name: '',
      details: '',
      quantity: 0,
      unitPrice: 0,
      amount: 0,
      subtotal: 0,
      profitRate: 0
    }
    setMaterials([...materials, newMaterial])
  }

  // 材料の削除
  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id))
  }

  // 材料の更新
  const updateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value }
        
        // 金額の自動計算
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = updated.quantity * updated.unitPrice
        }
        
        // 粗利率の計算
        if (field === 'subtotal' && updated.subtotal > 0) {
          const profit = updated.subtotal - updated.amount
          updated.profitRate = Math.round((profit / updated.subtotal) * 100)
        }
        
        return updated
      }
      return m
    }))
  }

  // 合計計算
  const totalAmount = materials.reduce((sum, m) => sum + m.amount, 0)
  const totalSubtotal = materials.reduce((sum, m) => sum + m.subtotal, 0)
  const totalCost = totalAmount + laborCost + expenses
  const grossProfit = sellingPrice - totalCost
  const profitRate = sellingPrice > 0 ? Math.round((grossProfit / sellingPrice) * 100) : 0

  // 保存
  const saveSheet = async () => {
    if (!projectId) {
      toast.error('案件が選択されていません')
      return
    }

    // 現在の計算値を使用
    const currentTotalCost = totalAmount + laborCost + expenses
    const currentGrossProfit = sellingPrice - currentTotalCost
    const currentProfitRate = sellingPrice > 0 ? Math.round((currentGrossProfit / sellingPrice) * 100) : 0

    const data: GrossProfitData = {
      materials,
      laborCost,
      expenses,
      sellingPrice,
      totalCost: currentTotalCost,
      grossProfit: currentGrossProfit,
      profitRate: currentProfitRate
    }

    try {
      if (selectedSheetId) {
        // 更新
        const { error } = await supabase
          .from('gross_profit_sheets')
          .update({
            site_name: siteName,
            site_address: siteAddress,
            selling_price: sellingPrice,
            total_cost: currentTotalCost,
            gross_profit: currentGrossProfit,
            profit_rate: currentProfitRate,
            data,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedSheetId)
        
        if (error) {
          if (error.code === '42P01') {
            toast.error('粗利表テーブルが未作成です。Supabaseで sql-migrations/create_gross_profit_table.sql を実行してください。')
          } else {
            toast.error('保存に失敗しました')
          }
        } else {
          toast.success('更新しました')
          // 保存後に最新データを再取得
          setTimeout(() => {
            fetchCurrentSheet()
          }, 500)
        }
      } else {
        // 新規作成
        const insertData = {
            project_id: projectId,
            site_name: siteName,
            site_address: siteAddress,
            selling_price: sellingPrice,
            total_cost: currentTotalCost,
            gross_profit: currentGrossProfit,
            profit_rate: currentProfitRate,
            data
        }

        const { data: insertedData, error } = await supabase
          .from('gross_profit_sheets')
          .insert(insertData)
          .select()
        
        if (error) {
          if (error.code === '42P01') {
            toast.error('粗利表テーブルが未作成です。Supabaseで sql-migrations/create_gross_profit_table.sql を実行してください。')
          } else {
            toast.error('保存に失敗しました')
          }
        } else {
          toast.success('保存しました')
          // 保存後に最新データを再取得
          setTimeout(() => {
            fetchCurrentSheet()
          }, 500)
        }
      }
    } catch {
      toast.error('保存中にエラーが発生しました')
    }
  }

  if (!projectId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">案件管理画面から案件を選択して粗利表を開いてください。</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">粗　利　表</h2>
          <div className="flex gap-2">
            <Button onClick={saveSheet} size="sm">
              <Save className="h-4 w-4 mr-1" />
              保存
            </Button>
            <Button
              onClick={() => router.push(`/dashboard/projects?id=${projectId}`)}
              size="sm"
              variant="outline"
            >
              <X className="h-4 w-4 mr-1" />
              閉じる
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 現場情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">現場名</label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="現場名を入力"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium">現場住所</label>
              <Input
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="現場住所を入力"
              />
            </div>
          </div>

          {/* 内容テーブル */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-r px-2 py-1 text-sm">内　容</th>
                  <th className="border-r px-2 py-1 text-sm">詳　細</th>
                  <th className="border-r px-2 py-1 text-sm w-20">数量</th>
                  <th className="border-r px-2 py-1 text-sm w-24">単価</th>
                  <th className="border-r px-2 py-1 text-sm w-28">金額</th>
                  <th className="border-r px-2 py-1 text-sm w-28">売値</th>
                  <th className="px-2 py-1 text-sm w-16">%</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, index) => (
                  <tr key={material.id} className="border-t">
                    <td className="border-r px-1 py-1">
                      <Input
                        value={material.name}
                        onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                        className="h-8 border-0"
                        placeholder="内容"
                      />
                    </td>
                    <td className="border-r px-1 py-1">
                      <Input
                        value={material.details}
                        onChange={(e) => updateMaterial(material.id, 'details', e.target.value)}
                        className="h-8 border-0"
                        placeholder="詳細"
                      />
                    </td>
                    <td className="border-r px-1 py-1">
                      <input
                        type="number"
                        value={material.quantity || ''}
                        onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="h-8 border-0 text-right w-full px-2"
                        placeholder="0"
                      />
                    </td>
                    <td className="border-r px-1 py-1">
                      <input
                        type="number"
                        value={material.unitPrice || ''}
                        onChange={(e) => updateMaterial(material.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="h-8 border-0 text-right w-full px-2"
                        placeholder="0"
                      />
                    </td>
                    <td className="border-r px-2 py-1 text-right bg-gray-50">
                      {material.amount ? material.amount.toLocaleString() : '0'}
                    </td>
                    <td className="border-r px-1 py-1">
                      <input
                        type="number"
                        value={material.subtotal || ''}
                        onChange={(e) => updateMaterial(material.id, 'subtotal', parseFloat(e.target.value) || 0)}
                        className="h-8 border-0 text-right w-full px-2"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-2 py-1 text-right">
                      {material.profitRate > 0 ? `${material.profitRate}%` : ''}
                    </td>
                    <td className="px-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(material.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {/* 合計 */}
                <tr className="border-t bg-gray-100">
                  <td colSpan={4} className="border-r px-2 py-2 text-right font-bold">
                    合計
                  </td>
                  <td className="border-r px-2 py-2 text-right font-bold">
                    {totalCost.toLocaleString()}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 売上・粗利 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="font-medium">売上金額</label>
                  <input
                    type="number"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="text-right px-2 py-1 border rounded w-32"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-600">円</span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {grossProfit.toLocaleString()}
                  <span className="text-sm text-gray-600 ml-1">円</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">粗利益金額</div>
              </div>
              <div>
                <div className="text-lg font-medium text-gray-700 mb-3">
                  原価合計: {totalCost.toLocaleString()}円
                </div>
                <div className="text-3xl font-bold">
                  {profitRate}%
                </div>
                <div className="text-sm text-gray-600 mt-1">粗利益率</div>
              </div>
            </div>
          </div>

          <Button onClick={addMaterial} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            内容を追加
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}