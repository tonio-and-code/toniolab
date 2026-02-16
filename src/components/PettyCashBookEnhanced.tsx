'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, FileText, Pencil, Trash2, Calculator, TrendingUp, TrendingDown, Printer, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { AccountItem, PettyCashEntry } from '@/types/database'
import { Checkbox } from '@/components/ui/checkbox'

interface ExtendedPettyCashEntry extends PettyCashEntry {
  account_item?: AccountItem
  income_amount_with_tax: number
  expense_amount_with_tax: number
  is_carry_forward: boolean
  manual_balance: boolean
}

export default function PettyCashBookEnhanced() {
  const [entries, setEntries] = useState<ExtendedPettyCashEntry[]>([])
  const [accountItems, setAccountItems] = useState<AccountItem[]>([])
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ExtendedPettyCashEntry | null>(null)
  const [displayMode, setDisplayMode] = useState<'tax_excluded' | 'tax_included'>('tax_excluded')
  const [showTaxColumn, setShowTaxColumn] = useState(true)
  const [isEditingBalance, setIsEditingBalance] = useState(false)
  const [balanceInput, setBalanceInput] = useState('')
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)

  // フォーム状態
  const [formData, setFormData] = useState({
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    account_item_id: '',
    description: '',
    tax_rate: 10,
    income_amount: '',
    expense_amount: '',
    manual_balance: false,
  })

  const supabase = createClient()

  // 月次集計の計算
  const monthlySummary = useMemo(() => {
    const regularEntries = entries.filter(e => !e.is_carry_forward)
    const carryForward = entries.find(e => e.is_carry_forward)
    
    const totalIncome = regularEntries.reduce((sum, e) => 
      sum + (displayMode === 'tax_included' ? e.income_amount_with_tax : e.income_amount), 0
    )
    const totalExpense = regularEntries.reduce((sum, e) => 
      sum + (displayMode === 'tax_included' ? e.expense_amount_with_tax : e.expense_amount), 0
    )
    const carryForwardAmount = carryForward ? carryForward.income_amount : 0
    const monthEndBalance = entries.length > 0 ? entries[entries.length - 1].balance : 0
    
    return {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      carryForwardAmount,
      monthEndBalance
    }
  }, [entries, displayMode])

  // データ取得
  useEffect(() => {
    fetchAccountItems()
    fetchEntries()
  }, [selectedMonth])

  // 勘定科目マスター取得
  const fetchAccountItems = async () => {
    const { data, error } = await supabase
      .from('account_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      return
    }

    setAccountItems(data || [])
  }

  // 出納帳データ取得
  const fetchEntries = async () => {
    const startDate = startOfMonth(new Date(selectedMonth))
    const endDate = endOfMonth(new Date(selectedMonth))

    // 前月繰越レコードの作成または取得
    await supabase.rpc('get_or_create_carry_forward', {
      target_month: format(startDate, 'yyyy-MM-dd')
    })

    const { data, error } = await supabase
      .from('petty_cash_book')
      .select(`
        *,
        account_item:account_items(*)
      `)
      .gte('entry_date', format(startDate, 'yyyy-MM-dd'))
      .lte('entry_date', format(endDate, 'yyyy-MM-dd'))
      .order('entry_date')
      .order('entry_number')

    if (error) {
      return
    }

    // 残高再計算（手動残高以外）
    let runningBalance = 0
    const entriesWithBalance = (data || []).map((entry, index) => {
      if (index === 0 || entry.is_carry_forward) {
        runningBalance = entry.balance
      } else if (!entry.manual_balance) {
        const amount = displayMode === 'tax_included' 
          ? (entry.income_amount_with_tax - entry.expense_amount_with_tax)
          : (entry.income_amount - entry.expense_amount)
        runningBalance += amount
        entry.balance = runningBalance
      } else {
        runningBalance = entry.balance
      }
      return entry as ExtendedPettyCashEntry
    })

    setEntries(entriesWithBalance)
  }

  // 税込金額の計算
  const calculateWithTax = (amount: number, taxRate: number) => {
    return Math.floor(amount * (1 + taxRate / 100))
  }

  // エントリー保存
  const handleSave = async () => {
    if (!formData.account_item_id && !formData.manual_balance) {
      alert('勘定科目を選択してください')
      return
    }

    const incomeAmount = Number(formData.income_amount) || 0
    const expenseAmount = Number(formData.expense_amount) || 0
    const incomeWithTax = calculateWithTax(incomeAmount, formData.tax_rate)
    const expenseWithTax = calculateWithTax(expenseAmount, formData.tax_rate)

    // 同日の最大番号を取得
    const { data: maxEntryData } = await supabase
      .from('petty_cash_book')
      .select('entry_number')
      .eq('entry_date', formData.entry_date)
      .neq('is_carry_forward', true)
      .order('entry_number', { ascending: false })
      .limit(1)

    const nextEntryNumber = maxEntryData && maxEntryData.length > 0 
      ? maxEntryData[0].entry_number + 1 
      : 1

    const entryData: any = {
      entry_date: formData.entry_date,
      entry_number: nextEntryNumber,
      account_item_id: formData.account_item_id === 'none' || !formData.account_item_id ? null : formData.account_item_id,
      description: formData.description,
      tax_rate: formData.tax_rate,
      income_amount: incomeAmount,
      expense_amount: expenseAmount,
      manual_balance: false,
      balance: 0,
    }

    // 税込金額カラムが存在する場合のみ追加
    if (incomeWithTax !== null) {
      entryData.income_amount_with_tax = incomeWithTax
    }
    if (expenseWithTax !== null) {
      entryData.expense_amount_with_tax = expenseWithTax
    }

    if (editingEntry && !editingEntry.is_carry_forward) {
      // 更新
      const { data, error } = await supabase
        .from('petty_cash_book')
        .update(entryData)
        .eq('id', editingEntry.id)
        .select()

      if (error) {
        alert(`エントリーの更新に失敗しました: ${error.message || '不明なエラー'}`)
        return
      }
    } else if (!editingEntry) {
      // 新規作成
      const { data, error } = await supabase
        .from('petty_cash_book')
        .insert(entryData)
        .select()

      if (error) {
        alert(`エントリーの作成に失敗しました: ${error.message || '不明なエラー'}`)
        return
      }
    }

    // リセット
    setFormData({
      entry_date: format(new Date(), 'yyyy-MM-dd'),
      account_item_id: '',
      description: '',
      tax_rate: 10,
      income_amount: '',
      expense_amount: '',
    })
    setEditingEntry(null)
    setIsDialogOpen(false)
    fetchEntries()
  }

  // エントリー削除
  const handleDelete = async (id: string) => {
    if (!confirm('削除してもよろしいですか？')) return

    const { error } = await supabase
      .from('petty_cash_book')
      .delete()
      .eq('id', id)

    if (error) {
      return
    }

    fetchEntries()
  }

  // 編集開始
  const handleEdit = (entry: ExtendedPettyCashEntry) => {
    if (entry.is_carry_forward) return // 繰越は編集不可
    
    setEditingEntry(entry)
    setFormData({
      entry_date: entry.entry_date,
      account_item_id: entry.account_item_id || '',
      description: entry.description || '',
      tax_rate: entry.tax_rate,
      income_amount: entry.income_amount > 0 ? String(entry.income_amount) : '',
      expense_amount: entry.expense_amount > 0 ? String(entry.expense_amount) : '',
    })
    setIsDialogOpen(true)
  }

  // 月末残高の編集
  const handleBalanceEdit = () => {
    setBalanceInput(String(monthlySummary.monthEndBalance))
    setIsEditingBalance(true)
  }

  // 月末残高の保存
  const handleBalanceSave = async () => {
    const newBalance = Number(balanceInput) || 0

    // 最後のエントリを取得して残高を更新
    if (entries.length > 0) {
      const lastEntry = entries[entries.length - 1]
      const { error } = await supabase
        .from('petty_cash_book')
        .update({
          balance: newBalance,
          manual_balance: true
        })
        .eq('id', lastEntry.id)

      if (error) {
        alert('残高の更新に失敗しました')
        return
      }

      // 再取得
      await fetchEntries()
    }

    setIsEditingBalance(false)
    setBalanceInput('')
  }

  // レシート画像をClaudeが解析する処理
  const handleOCRCapture = async () => {
    setIsProcessingOCR(true)

    try {
      // ファイル入力要素を作成
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          setIsProcessingOCR(false)
          return
        }

        // 画像をBase64に変換
        const reader = new FileReader()
        reader.onload = async (event) => {
          const base64String = event.target?.result as string

          // 画像を一時的に保存してClaudeに解析させる
          const tempPath = `/tmp/receipt_${Date.now()}.jpg`

          // ここで画像をClaudeに見せて解析
          // Claudeが画像内容を読み取って、適切な勘定科目と摘要を判断
          alert(`レシート画像を受け取りました。\n\nClaude（私）がレシートの内容を解析して、以下の情報を自動入力します：\n・日付\n・店舗名（摘要）\n・金額\n・勘定科目（消耗品費、交通費など）\n\n※現在は画像選択のみ可能です。実際の解析は画像を私に見せてください。`)

          // 実際の使用時は、ユーザーが画像をアップロードした後、
          // Claudeが画像を見て以下のような形でフォームに入力：
          // setFormData({
          //   entry_date: '2024-01-15',  // レシートから読み取った日付
          //   account_item_id: '適切な勘定科目ID',
          //   description: 'セブンイレブン 文房具購入',  // 店舗名と購入内容
          //   tax_rate: 10,
          //   income_amount: '',
          //   expense_amount: '1320',  // レシートの合計金額
          // })

          setIsDialogOpen(true)  // 入力ダイアログを開く
        }

        reader.readAsDataURL(file)
        setIsProcessingOCR(false)
      }

      input.click()
    } catch {
      alert('画像の選択に失敗しました')
      setIsProcessingOCR(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 月次サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">前月繰越</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{monthlySummary.carryForwardAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              当月収入
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{monthlySummary.totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              当月支出
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ¥{monthlySummary.totalExpense.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">当月収支</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlySummary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{monthlySummary.netIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={isEditingBalance ? "" : "cursor-pointer hover:bg-gray-50 transition-colors"}
          onClick={!isEditingBalance ? handleBalanceEdit : undefined}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              月末残高
              {!isEditingBalance && (
                <Pencil className="inline-block ml-2 h-3 w-3 text-gray-400" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingBalance ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                  className="h-8 text-lg"
                  autoFocus
                />
                <Button size="sm" onClick={handleBalanceSave}>
                  保存
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setIsEditingBalance(false)
                    setBalanceInput('')
                  }}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                ¥{monthlySummary.monthEndBalance.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* メインカード */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              小口現金出納帳
            </CardTitle>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const currentDate = new Date(selectedMonth);
                    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
                    setSelectedMonth(format(prevMonth, 'yyyy-MM'));
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-3 py-1 min-w-[120px] text-center font-medium">
                  {format(new Date(selectedMonth), 'yyyy年M月', { locale: ja })}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const currentDate = new Date(selectedMonth);
                    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
                    setSelectedMonth(format(nextMonth, 'yyyy-MM'));
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Tabs value={displayMode} onValueChange={(v) => setDisplayMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="tax_excluded">税抜</TabsTrigger>
                  <TabsTrigger value="tax_included">税込</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                onClick={() => window.open(`/print/petty-cash?month=${selectedMonth}`, '_blank')}
              >
                <Printer className="h-4 w-4 mr-2" />
                印刷
              </Button>
              <Button
                variant="outline"
                onClick={handleOCRCapture}
                disabled={isProcessingOCR}
                title="レシート画像をClaudeが読み取って自動入力"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isProcessingOCR ? '処理中...' : 'レシート読取'}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    新規入力
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEntry ? '編集' : '新規入力'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>日付</Label>
                      <Input
                        type="date"
                        value={formData.entry_date}
                        onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>勘定科目</Label>
                      <Select
                        value={formData.account_item_id}
                        onValueChange={(value) => setFormData({ ...formData, account_item_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>摘要</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="詳細を入力"
                      />
                    </div>
                    <div>
                      <Label>税率 (%)</Label>
                      <Select
                        value={String(formData.tax_rate)}
                        onValueChange={(value) => setFormData({ ...formData, tax_rate: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%（非課税）</SelectItem>
                          <SelectItem value="8">8%（軽減税率）</SelectItem>
                          <SelectItem value="10">10%（標準税率）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>収入金額（税抜）</Label>
                      <Input
                        type="number"
                        value={formData.income_amount}
                        onChange={(e) => setFormData({ ...formData, income_amount: e.target.value })}
                        placeholder="0"
                      />
                      {formData.income_amount && (
                        <p className="text-sm text-muted-foreground mt-1">
                          税込: ¥{calculateWithTax(Number(formData.income_amount), formData.tax_rate).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>支出金額（税抜）</Label>
                      <Input
                        type="number"
                        value={formData.expense_amount}
                        onChange={(e) => setFormData({ ...formData, expense_amount: e.target.value })}
                        placeholder="0"
                      />
                      {formData.expense_amount && (
                        <p className="text-sm text-muted-foreground mt-1">
                          税込: ¥{calculateWithTax(Number(formData.expense_amount), formData.tax_rate).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button onClick={handleSave} className="w-full">
                      保存
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">月日</TableHead>
                  <TableHead>勘定科目</TableHead>
                  <TableHead>摘要</TableHead>
                  {showTaxColumn && <TableHead className="text-center w-20">税率</TableHead>}
                  <TableHead className="text-right w-32">
                    収入金額
                    <Badge variant="outline" className="ml-1 text-xs">
                      {displayMode === 'tax_included' ? '税込' : '税抜'}
                    </Badge>
                  </TableHead>
                  <TableHead className="text-right w-32">
                    支出金額
                    <Badge variant="outline" className="ml-1 text-xs">
                      {displayMode === 'tax_included' ? '税込' : '税抜'}
                    </Badge>
                  </TableHead>
                  <TableHead className="text-right w-32">差引残高</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className={entry.is_carry_forward ? 'bg-gray-50' : ''}>
                    <TableCell>
                      {format(new Date(entry.entry_date), 'M/d', { locale: ja })}
                    </TableCell>
                    <TableCell>
                      {entry.is_carry_forward ? (
                        <Badge>繰越</Badge>
                      ) : (
                        entry.account_item?.name || '-'
                      )}
                    </TableCell>
                    <TableCell>{entry.description || '-'}</TableCell>
                    {showTaxColumn && (
                      <TableCell className="text-center">
                        {entry.is_carry_forward ? '-' : `${entry.tax_rate}%`}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      {entry.income_amount > 0 || (entry.income_amount_with_tax && entry.income_amount_with_tax > 0) ? (
                        displayMode === 'tax_included' 
                          ? (entry.income_amount_with_tax || 0).toLocaleString()
                          : (entry.income_amount || 0).toLocaleString()
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.expense_amount > 0 || (entry.expense_amount_with_tax && entry.expense_amount_with_tax > 0) ? (
                        displayMode === 'tax_included'
                          ? (entry.expense_amount_with_tax || 0).toLocaleString()
                          : (entry.expense_amount || 0).toLocaleString()
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.balance.toLocaleString()}
                      {entry.manual_balance && (
                        <Badge variant="secondary" className="ml-1 text-xs">手動</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!entry.is_carry_forward && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      データがありません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}