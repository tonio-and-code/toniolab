'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Building2, Plus, Edit2, Trash2, Calculator, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'

interface FixedAsset {
  id: number
  asset_number: string
  asset_name: string
  account_code: string
  acquisition_date: string
  acquisition_cost: number
  salvage_value: number
  useful_life: number
  depreciation_method: string
  depreciation_rate: number
  location: string
  department: string
  vendor_name: string
  disposal_date: string | null
  disposal_amount: number | null
  is_active: boolean
}

interface DepreciationSchedule {
  id: number
  fixed_asset_id: number
  fiscal_year: number
  fiscal_month: number
  beginning_book_value: number
  depreciation_amount: number
  accumulated_depreciation: number
  ending_book_value: number
}

export function FixedAssetsManager() {
  const [assets, setAssets] = useState<FixedAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null)
  const [depreciationSchedule, setDepreciationSchedule] = useState<DepreciationSchedule[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('list')

  // フォームの状態
  const [formData, setFormData] = useState<Partial<FixedAsset>>({
    asset_number: '',
    asset_name: '',
    account_code: '2140',
    acquisition_date: format(new Date(), 'yyyy-MM-dd'),
    acquisition_cost: 0,
    salvage_value: 1,
    useful_life: 5,
    depreciation_method: '定額法',
    depreciation_rate: 0,
    location: '',
    department: '',
    vendor_name: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from('fixed_assets')
      .select('*')
      .order('asset_number')

    if (data && !error) {
      setAssets(data)
    }
  }

  const fetchDepreciationSchedule = async (assetId: number) => {
    const { data } = await supabase
      .from('depreciation_schedule')
      .select('*')
      .eq('fixed_asset_id', assetId)
      .order('fiscal_year', { ascending: true })
      .order('fiscal_month', { ascending: true })

    if (data) {
      setDepreciationSchedule(data)
    }
  }

  const calculateDepreciationRate = (method: string, usefulLife: number): number => {
    if (method === '定額法') {
      return 1 / usefulLife
    } else if (method === '定率法') {
      // 定率法の償却率（簡易計算）
      return 2 / usefulLife
    }
    return 0
  }

  const generateDepreciationSchedule = async (asset: FixedAsset) => {
    const schedules = []
    const startYear = new Date(asset.acquisition_date).getFullYear()
    let bookValue = asset.acquisition_cost
    let accumulatedDepreciation = 0

    for (let year = 0; year < asset.useful_life; year++) {
      let annualDepreciation = 0

      if (asset.depreciation_method === '定額法') {
        annualDepreciation = Math.floor((asset.acquisition_cost - asset.salvage_value) / asset.useful_life)
      } else if (asset.depreciation_method === '定率法') {
        annualDepreciation = Math.floor(bookValue * asset.depreciation_rate)
      }

      // 最終年度の調整
      if (year === asset.useful_life - 1) {
        annualDepreciation = bookValue - asset.salvage_value
      }

      accumulatedDepreciation += annualDepreciation
      const endingBookValue = asset.acquisition_cost - accumulatedDepreciation

      schedules.push({
        fixed_asset_id: asset.id,
        fiscal_year: startYear + year,
        fiscal_month: 12, // 年次で計算
        beginning_book_value: bookValue,
        depreciation_amount: annualDepreciation,
        accumulated_depreciation: accumulatedDepreciation,
        ending_book_value: endingBookValue
      })

      bookValue = endingBookValue
    }

    // 減価償却スケジュールをDBに保存
    const { error } = await supabase
      .from('depreciation_schedule')
      .insert(schedules)

    // Error handling for depreciation schedule creation is silent
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const dataToSubmit = {
        ...formData,
        depreciation_rate: calculateDepreciationRate(
          formData.depreciation_method!,
          formData.useful_life!
        )
      }

      if (isEditMode && selectedAsset) {
        // 更新
        const { error } = await supabase
          .from('fixed_assets')
          .update(dataToSubmit)
          .eq('id', selectedAsset.id)

        if (error) throw error
        toast.success('固定資産を更新しました')
      } else {
        // 新規作成
        const { data, error } = await supabase
          .from('fixed_assets')
          .insert(dataToSubmit)
          .select()
          .single()

        if (error) throw error

        // 減価償却スケジュールの自動生成
        await generateDepreciationSchedule(data)
        toast.success('固定資産を登録しました')
      }

      fetchAssets()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error(error.message || '処理に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (asset: FixedAsset) => {
    setSelectedAsset(asset)
    setFormData(asset)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async (assetId: number) => {
    if (!confirm('この固定資産を削除しますか？')) return

    const { error } = await supabase
      .from('fixed_assets')
      .update({ is_active: false })
      .eq('id', assetId)

    if (!error) {
      toast.success('固定資産を削除しました')
      fetchAssets()
    }
  }

  const resetForm = () => {
    setFormData({
      asset_number: '',
      asset_name: '',
      account_code: '2140',
      acquisition_date: format(new Date(), 'yyyy-MM-dd'),
      acquisition_cost: 0,
      salvage_value: 1,
      useful_life: 5,
      depreciation_method: '定額法',
      depreciation_rate: 0,
      location: '',
      department: '',
      vendor_name: ''
    })
    setSelectedAsset(null)
    setIsEditMode(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // 資産合計の計算
  const totalAcquisitionCost = assets
    .filter(a => a.is_active)
    .reduce((sum, a) => sum + a.acquisition_cost, 0)

  const totalBookValue = assets
    .filter(a => a.is_active)
    .reduce((sum, a) => {
      // 簡易的に現在の簿価を計算
      const years = new Date().getFullYear() - new Date(a.acquisition_date).getFullYear()
      const annualDep = (a.acquisition_cost - a.salvage_value) / a.useful_life
      const accumulated = Math.min(annualDep * years, a.acquisition_cost - a.salvage_value)
      return sum + (a.acquisition_cost - accumulated)
    }, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">固定資産管理</h2>
          <p className="text-muted-foreground">
            固定資産の登録・管理と減価償却計算
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          新規登録
        </Button>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">登録資産数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(a => a.is_active).length}件
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">取得価額合計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAcquisitionCost)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">簿価合計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBookValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 資産一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            固定資産一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">資産番号</th>
                  <th className="text-left py-2">資産名</th>
                  <th className="text-right py-2">取得日</th>
                  <th className="text-right py-2">取得価額</th>
                  <th className="text-center py-2">耐用年数</th>
                  <th className="text-center py-2">償却方法</th>
                  <th className="text-right py-2">簿価</th>
                  <th className="text-center py-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {assets.filter(a => a.is_active).map(asset => {
                  const years = new Date().getFullYear() - new Date(asset.acquisition_date).getFullYear()
                  const annualDep = (asset.acquisition_cost - asset.salvage_value) / asset.useful_life
                  const accumulated = Math.min(annualDep * years, asset.acquisition_cost - asset.salvage_value)
                  const bookValue = asset.acquisition_cost - accumulated

                  return (
                    <tr key={asset.id} className="border-b hover:bg-muted/50">
                      <td className="py-2">{asset.asset_number}</td>
                      <td className="py-2">{asset.asset_name}</td>
                      <td className="py-2 text-right">
                        {format(new Date(asset.acquisition_date), 'yyyy/MM/dd')}
                      </td>
                      <td className="py-2 text-right">{formatCurrency(asset.acquisition_cost)}</td>
                      <td className="py-2 text-center">{asset.useful_life}年</td>
                      <td className="py-2 text-center">{asset.depreciation_method}</td>
                      <td className="py-2 text-right">{formatCurrency(bookValue)}</td>
                      <td className="py-2">
                        <div className="flex justify-center gap-1">
                          <Button
                            onClick={() => {
                              setSelectedAsset(asset)
                              fetchDepreciationSchedule(asset.id)
                              setSelectedTab('schedule')
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <TrendingDown className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEdit(asset)}
                            variant="ghost"
                            size="sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(asset.id)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 減価償却スケジュール */}
      {selectedAsset && depreciationSchedule.length > 0 && selectedTab === 'schedule' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              減価償却スケジュール - {selectedAsset.asset_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">年度</th>
                    <th className="text-right py-2">期首簿価</th>
                    <th className="text-right py-2">当期償却額</th>
                    <th className="text-right py-2">償却累計額</th>
                    <th className="text-right py-2">期末簿価</th>
                  </tr>
                </thead>
                <tbody>
                  {depreciationSchedule.map(schedule => (
                    <tr key={schedule.id} className="border-b">
                      <td className="py-2">{schedule.fiscal_year}年</td>
                      <td className="py-2 text-right">
                        {formatCurrency(schedule.beginning_book_value)}
                      </td>
                      <td className="py-2 text-right">
                        {formatCurrency(schedule.depreciation_amount)}
                      </td>
                      <td className="py-2 text-right">
                        {formatCurrency(schedule.accumulated_depreciation)}
                      </td>
                      <td className="py-2 text-right">
                        {formatCurrency(schedule.ending_book_value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 登録・編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? '固定資産の編集' : '固定資産の新規登録'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="asset_number">資産番号 *</Label>
              <Input
                id="asset_number"
                value={formData.asset_number}
                onChange={(e) => setFormData({ ...formData, asset_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="asset_name">資産名称 *</Label>
              <Input
                id="asset_name"
                value={formData.asset_name}
                onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="acquisition_date">取得日 *</Label>
              <Input
                id="acquisition_date"
                type="date"
                value={formData.acquisition_date}
                onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="acquisition_cost">取得価額 *</Label>
              <Input
                id="acquisition_cost"
                type="number"
                value={formData.acquisition_cost}
                onChange={(e) => setFormData({ ...formData, acquisition_cost: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="useful_life">耐用年数 *</Label>
              <Input
                id="useful_life"
                type="number"
                value={formData.useful_life}
                onChange={(e) => setFormData({ ...formData, useful_life: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="depreciation_method">償却方法 *</Label>
              <Select
                value={formData.depreciation_method}
                onValueChange={(value) => setFormData({ ...formData, depreciation_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="定額法">定額法</SelectItem>
                  <SelectItem value="定率法">定率法</SelectItem>
                  <SelectItem value="一括償却">一括償却</SelectItem>
                  <SelectItem value="少額減価償却">少額減価償却</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">設置場所</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="vendor_name">購入先</Label>
              <Input
                id="vendor_name"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              キャンセル
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? '処理中...' : isEditMode ? '更新' : '登録'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}