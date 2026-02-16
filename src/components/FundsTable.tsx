'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  FundsEntry,
  FundsBalance,
  REVENUE_CATEGORIES,
  EXPENSE_CATEGORIES,
  OPERATING_COST_CATEGORIES,
} from '@/types/funds'

interface FundsTableProps {
  initialBalance?: number
  onDataChange?: (entries: FundsEntry[]) => void
}

export default function FundsTable({ 
  initialBalance = 0, 
  onDataChange 
}: FundsTableProps) {
  const [entries, setEntries] = useState<FundsEntry[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEntry, setNewEntry] = useState<Partial<FundsEntry>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'revenue',
    category: '',
    description: '',
    amount: 0,
  })

  const getCategoriesByType = (type: 'revenue' | 'expense' | 'operating_cost') => {
    switch (type) {
      case 'revenue':
        return REVENUE_CATEGORIES
      case 'expense':
        return EXPENSE_CATEGORIES
      case 'operating_cost':
        return OPERATING_COST_CATEGORIES
      default:
        return []
    }
  }

  const dailyBalances = useMemo(() => {
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const balanceMap = new Map<string, FundsBalance>()
    let runningBalance = initialBalance

    sortedEntries.forEach((entry) => {
      const dateKey = entry.date
      
      if (!balanceMap.has(dateKey)) {
        balanceMap.set(dateKey, {
          date: dateKey,
          opening_balance: runningBalance,
          total_revenue: 0,
          total_expense: 0,
          total_operating_cost: 0,
          closing_balance: runningBalance,
        })
      }

      const balance = balanceMap.get(dateKey)!
      
      switch (entry.type) {
        case 'revenue':
          balance.total_revenue += entry.amount
          runningBalance += entry.amount
          break
        case 'expense':
          balance.total_expense += entry.amount
          runningBalance -= entry.amount
          break
        case 'operating_cost':
          balance.total_operating_cost += entry.amount
          runningBalance -= entry.amount
          break
      }
      
      balance.closing_balance = runningBalance
    })

    return Array.from(balanceMap.values())
  }, [entries, initialBalance])

  const handleAddEntry = () => {
    if (!newEntry.category || !newEntry.description || !newEntry.amount) {
      alert('必須項目を入力してください')
      return
    }

    const entry: FundsEntry = {
      id: `entry-${Date.now()}`,
      date: newEntry.date!,
      type: newEntry.type as 'revenue' | 'expense' | 'operating_cost',
      category: newEntry.category,
      description: newEntry.description,
      amount: Number(newEntry.amount),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedEntries = [...entries, entry]
    setEntries(updatedEntries)
    onDataChange?.(updatedEntries)

    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'revenue',
      category: '',
      description: '',
      amount: 0,
    })
  }

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
    onDataChange?.(updatedEntries)
  }

  const handleEditEntry = (id: string, field: keyof FundsEntry, value: any) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id 
        ? { ...entry, [field]: value, updated_at: new Date().toISOString() }
        : entry
    )
    setEntries(updatedEntries)
    onDataChange?.(updatedEntries)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount)
  }

  const getTypeLabel = (type: 'revenue' | 'expense' | 'operating_cost') => {
    switch (type) {
      case 'revenue':
        return '売上'
      case 'expense':
        return '費用'
      case 'operating_cost':
        return '経費'
    }
  }

  const getTypeColor = (type: 'revenue' | 'expense' | 'operating_cost') => {
    switch (type) {
      case 'revenue':
        return 'text-blue-600'
      case 'expense':
        return 'text-red-600'
      case 'operating_cost':
        return 'text-orange-600'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>資金表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2">
              <Input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
              <Select
                value={newEntry.type}
                onValueChange={(value) => {
                  setNewEntry({ 
                    ...newEntry, 
                    type: value as 'revenue' | 'expense' | 'operating_cost',
                    category: ''
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">売上</SelectItem>
                  <SelectItem value="expense">費用</SelectItem>
                  <SelectItem value="operating_cost">経費</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newEntry.category}
                onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリー選択" />
                </SelectTrigger>
                <SelectContent>
                  {getCategoriesByType(newEntry.type as any).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="説明"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
              <Input
                type="number"
                placeholder="金額"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
              />
              <Button onClick={handleAddEntry}>
                <Plus className="w-4 h-4 mr-2" />
                追加
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日付</TableHead>
                    <TableHead>種別</TableHead>
                    <TableHead>カテゴリー</TableHead>
                    <TableHead>説明</TableHead>
                    <TableHead className="text-right">売上</TableHead>
                    <TableHead className="text-right">費用</TableHead>
                    <TableHead className="text-right">経費</TableHead>
                    <TableHead className="text-right">現預金残</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyBalances.map((balance) => {
                    const dayEntries = entries.filter(e => e.date === balance.date)
                    
                    return dayEntries.map((entry, index) => (
                      <TableRow key={entry.id}>
                        {index === 0 && (
                          <>
                            <TableCell rowSpan={dayEntries.length}>
                              {format(new Date(balance.date), 'M月d日', { locale: ja })}
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <span className={getTypeColor(entry.type)}>
                            {getTypeLabel(entry.type)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {editingId === entry.id ? (
                            <Select
                              value={entry.category}
                              onValueChange={(value) => handleEditEntry(entry.id, 'category', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getCategoriesByType(entry.type).map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            entry.category
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === entry.id ? (
                            <Input
                              value={entry.description}
                              onChange={(e) => handleEditEntry(entry.id, 'description', e.target.value)}
                            />
                          ) : (
                            entry.description
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.type === 'revenue' && (
                            editingId === entry.id ? (
                              <Input
                                type="number"
                                value={entry.amount}
                                onChange={(e) => handleEditEntry(entry.id, 'amount', Number(e.target.value))}
                                className="text-right"
                              />
                            ) : (
                              <span className="text-blue-600">
                                {formatCurrency(entry.amount)}
                              </span>
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.type === 'expense' && (
                            <span className="text-red-600">
                              -{formatCurrency(entry.amount)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.type === 'operating_cost' && (
                            <span className="text-orange-600">
                              -{formatCurrency(entry.amount)}
                            </span>
                          )}
                        </TableCell>
                        {index === 0 && (
                          <TableCell 
                            rowSpan={dayEntries.length} 
                            className="text-right font-bold"
                          >
                            {formatCurrency(balance.closing_balance)}
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-1">
                            {editingId === entry.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingId(null)}
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingId(null)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingId(entry.id)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  })}
                  {entries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">
                        データがありません
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">総売上</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      entries
                        .filter(e => e.type === 'revenue')
                        .reduce((sum, e) => sum + e.amount, 0)
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">総費用</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(
                      entries
                        .filter(e => e.type === 'expense')
                        .reduce((sum, e) => sum + e.amount, 0)
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">現預金残高</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      dailyBalances.length > 0
                        ? dailyBalances[dailyBalances.length - 1].closing_balance
                        : initialBalance
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}