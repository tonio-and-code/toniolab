'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Plus, Minus, Save, Calculator, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface AccountCode {
  code: string
  name: string
  category: string
  account_type: string
}

interface JournalItem {
  account_code: string
  debit_amount: number
  credit_amount: number
  tax_type?: string
  tax_rate?: number
  note?: string
}

export function JournalEntryForm() {
  const [entryDate, setEntryDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [description, setDescription] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [items, setItems] = useState<JournalItem[]>([
    { account_code: '', debit_amount: 0, credit_amount: 0 },
    { account_code: '', debit_amount: 0, credit_amount: 0 }
  ])
  const [accountCodes, setAccountCodes] = useState<AccountCode[]>([])
  const [totalDebit, setTotalDebit] = useState(0)
  const [totalCredit, setTotalCredit] = useState(0)
  const [isBalanced, setIsBalanced] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchAccountCodes()
  }, [])

  useEffect(() => {
    // 貸借合計の計算
    const debit = items.reduce((sum, item) => sum + (item.debit_amount || 0), 0)
    const credit = items.reduce((sum, item) => sum + (item.credit_amount || 0), 0)
    setTotalDebit(debit)
    setTotalCredit(credit)
    setIsBalanced(debit === credit && debit > 0)
  }, [items])

  const fetchAccountCodes = async () => {
    const { data, error } = await supabase
      .from('account_codes')
      .select('*')
      .eq('is_active', true)
      .order('code')

    if (data && !error) {
      setAccountCodes(data)
    }
  }

  const addItem = () => {
    setItems([...items, { account_code: '', debit_amount: 0, credit_amount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 2) {
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
    }
  }

  const updateItem = (index: number, field: keyof JournalItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // 借方・貸方の排他制御
    if (field === 'debit_amount' && value > 0) {
      newItems[index].credit_amount = 0
    } else if (field === 'credit_amount' && value > 0) {
      newItems[index].debit_amount = 0
    }

    setItems(newItems)
  }

  const handleSubmit = async () => {
    if (!isBalanced) {
      toast.error('貸借が一致していません')
      return
    }

    if (!description.trim()) {
      toast.error('摘要を入力してください')
      return
    }

    const validItems = items.filter(item =>
      item.account_code && (item.debit_amount > 0 || item.credit_amount > 0)
    )

    if (validItems.length < 2) {
      toast.error('最低2つの有効な仕訳明細が必要です')
      return
    }

    setLoading(true)

    try {
      // 仕訳ヘッダーの作成
      const { data: journalEntry, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          entry_date: entryDate,
          description,
          document_number: documentNumber || null,
          is_approved: false
        })
        .select()
        .single()

      if (entryError) throw entryError

      // 仕訳明細の作成
      const itemsToInsert = validItems.map((item, index) => ({
        journal_entry_id: journalEntry.id,
        account_code: item.account_code,
        debit_amount: item.debit_amount || 0,
        credit_amount: item.credit_amount || 0,
        tax_type: item.tax_type || null,
        tax_rate: item.tax_rate || null,
        note: item.note || null,
        display_order: index + 1
      }))

      const { error: itemsError } = await supabase
        .from('journal_entry_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      toast.success('仕訳を登録しました')

      // フォームのリセット
      setDescription('')
      setDocumentNumber('')
      setItems([
        { account_code: '', debit_amount: 0, credit_amount: 0 },
        { account_code: '', debit_amount: 0, credit_amount: 0 }
      ])
    } catch (error: any) {
      toast.error(error.message || '仕訳の登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          仕訳入力
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="entry_date">仕訳日付 *</Label>
            <Input
              id="entry_date"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="document_number">証憑番号</Label>
            <Input
              id="document_number"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="例: INV-2025-001"
            />
          </div>
          <div>
            <Label htmlFor="description">摘要 *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="取引内容を入力"
              required
            />
          </div>
        </div>

        {/* 仕訳明細 */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">仕訳明細</h3>
            <Button
              onClick={addItem}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              行追加
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">勘定科目</th>
                  <th className="text-right py-2 px-2">借方金額</th>
                  <th className="text-right py-2 px-2">貸方金額</th>
                  <th className="text-left py-2 px-2">備考</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-2">
                      <Select
                        value={item.account_code}
                        onValueChange={(value) => updateItem(index, 'account_code', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選択..." />
                        </SelectTrigger>
                        <SelectContent>
                          {accountCodes.map(ac => (
                            <SelectItem key={ac.code} value={ac.code}>
                              <span className="text-xs text-muted-foreground mr-2">
                                {ac.code}
                              </span>
                              {ac.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        value={item.debit_amount || ''}
                        onChange={(e) => updateItem(index, 'debit_amount', Number(e.target.value))}
                        className="text-right"
                        min="0"
                        disabled={item.credit_amount > 0}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        value={item.credit_amount || ''}
                        onChange={(e) => updateItem(index, 'credit_amount', Number(e.target.value))}
                        className="text-right"
                        min="0"
                        disabled={item.debit_amount > 0}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        value={item.note || ''}
                        onChange={(e) => updateItem(index, 'note', e.target.value)}
                        placeholder="備考"
                      />
                    </td>
                    <td className="py-2 px-2">
                      {items.length > 2 && (
                        <Button
                          onClick={() => removeItem(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="py-3 px-2">合計</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(totalDebit)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(totalCredit)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 貸借チェック */}
          <div className="mt-4 p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
                <span className={isBalanced ? 'text-green-700' : 'text-destructive'}>
                  {isBalanced ? '貸借一致' : '貸借不一致'}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                差額: {formatCurrency(Math.abs(totalDebit - totalCredit))}
              </span>
            </div>
          </div>
        </div>

        {/* 登録ボタン */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!isBalanced || loading}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? '登録中...' : '仕訳を登録'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}