'use client'

import React, { useState, useEffect } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Download,
  Trash2,
  Save,
  Edit,
  Eye,
} from 'lucide-react'
import { format, getDaysInMonth, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'

interface FundsEntry {
  id: string
  amount: number
  description: string
  type: 'revenue' | 'expense' | 'operatingCost'
}

interface DayData {
  entries: FundsEntry[]
}

interface MonthData {
  [day: number]: DayData
}

interface AllData {
  [monthKey: string]: {
    data: MonthData
    initialBalance: number
    fixedDeposit: number
  }
}

const STORAGE_KEY = 'iwasaki_funds_data'

export default function FundsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [allData, setAllData] = useState<AllData>({})
  const [showBalanceSettings, setShowBalanceSettings] = useState(false)
  const [showEntryDialog, setShowEntryDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedDayEntries, setSelectedDayEntries] = useState<FundsEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<FundsEntry | null>(null)
  const [newEntry, setNewEntry] = useState<{
    type: 'revenue' | 'expense' | 'operatingCost'
    amount: string
    description: string
  }>({
    type: 'revenue',
    amount: '',
    description: '',
  })
  const [tempInitialBalance, setTempInitialBalance] = useState(5368791)
  const [tempFixedDeposit, setTempFixedDeposit] = useState(1050000)

  const monthKey = format(currentDate, 'yyyy-MM')
  const currentMonthData = allData[monthKey] || {
    data: {},
    initialBalance: 5368791,
    fixedDeposit: 1050000,
  }

  const dayData = currentMonthData.data
  const initialBalance = currentMonthData.initialBalance
  const fixedDeposit = currentMonthData.fixedDeposit

  const daysInMonth = getDaysInMonth(currentDate)

  // データをlocalStorageから読み込む
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setAllData(parsed)
      } catch {
        // Failed to load saved data from localStorage
      }
    }
  }, [])

  // データを保存する
  const saveData = (newData: AllData) => {
    setAllData(newData)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    } catch {
      // Failed to save data to localStorage
    }
  }

  const updateMonthData = (updater: (prev: MonthData) => MonthData) => {
    const newAllData = {
      ...allData,
      [monthKey]: {
        ...currentMonthData,
        data: updater(currentMonthData.data),
      },
    }
    saveData(newAllData)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const openEntryDialog = (day: number) => {
    setSelectedDay(day)
    setNewEntry({
      type: 'revenue',
      amount: '',
      description: '',
    })
    setShowEntryDialog(true)
  }

  const openViewDialog = (day: number) => {
    setSelectedDay(day)
    const dayInfo = dayData[day]
    const entries = (dayInfo && Array.isArray(dayInfo.entries)) ? dayInfo.entries : []
    setSelectedDayEntries(entries)
    setShowViewDialog(true)
  }

  const addEntry = () => {
    if (!selectedDay || !newEntry.amount || !newEntry.description) {
      alert('金額と説明を入力してください')
      return
    }

    const entry: FundsEntry = {
      id: `entry-${Date.now()}-${Math.random()}`,
      type: newEntry.type,
      amount: Number(newEntry.amount),
      description: newEntry.description,
    }

    updateMonthData(prev => {
      const dayInfo = prev[selectedDay] || { entries: [] }
      const currentEntries = Array.isArray(dayInfo.entries) ? dayInfo.entries : []
      return {
        ...prev,
        [selectedDay]: {
          entries: [...currentEntries, entry],
        },
      }
    })

    setShowEntryDialog(false)
  }

  const openEditDialog = (entry: FundsEntry) => {
    setEditingEntry(entry)
    setNewEntry({
      type: entry.type,
      amount: String(entry.amount),
      description: entry.description,
    })
    setShowEditDialog(true)
  }

  const updateEntry = () => {
    if (!editingEntry || !selectedDay || !newEntry.amount || !newEntry.description) {
      alert('金額と説明を入力してください')
      return
    }

    updateMonthData(prev => {
      const dayInfo = prev[selectedDay]
      if (!dayInfo) return prev
      
      const currentEntries = Array.isArray(dayInfo.entries) ? dayInfo.entries : []
      const updatedEntries = currentEntries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, type: newEntry.type, amount: Number(newEntry.amount), description: newEntry.description }
          : entry
      )
      
      return {
        ...prev,
        [selectedDay]: {
          entries: updatedEntries,
        },
      }
    })
    
    // ダイアログ内の表示も更新
    setSelectedDayEntries(prev => 
      prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, type: newEntry.type, amount: Number(newEntry.amount), description: newEntry.description }
          : entry
      )
    )
    
    setShowEditDialog(false)
    setEditingEntry(null)
  }

  const deleteEntry = (day: number, entryId: string) => {
    updateMonthData(prev => {
      const dayInfo = prev[day]
      if (!dayInfo) return prev
      
      const currentEntries = Array.isArray(dayInfo.entries) ? dayInfo.entries : []
      return {
        ...prev,
        [day]: {
          entries: currentEntries.filter(e => e.id !== entryId),
        },
      }
    })
    
    // ダイアログ内の表示も更新
    if (day === selectedDay) {
      setSelectedDayEntries(prev => prev.filter(e => e.id !== entryId))
    }
  }

  const saveBalanceSettings = () => {
    const newAllData = {
      ...allData,
      [monthKey]: {
        ...currentMonthData,
        initialBalance: tempInitialBalance,
        fixedDeposit: tempFixedDeposit,
      },
    }
    saveData(newAllData)
    setShowBalanceSettings(false)
  }

  const calculateDayTotal = (day: number) => {
    const data = dayData[day]
    if (!data || !Array.isArray(data.entries)) return { revenue: 0, expense: 0, total: 0 }

    let revenue = 0
    let expense = 0

    data.entries.forEach(entry => {
      if (entry.type === 'revenue') {
        revenue += entry.amount
      } else {
        expense += entry.amount
      }
    })

    return { revenue, expense, total: revenue - expense }
  }

  const calculateRunningBalance = (day: number) => {
    let balance = initialBalance
    for (let d = 1; d <= day; d++) {
      const { total } = calculateDayTotal(d)
      balance += total
    }
    return balance
  }

  const calculateMonthTotal = () => {
    let revenue = 0
    let expense = 0

    Object.values(dayData).forEach(data => {
      if (data && Array.isArray(data.entries)) {
        data.entries.forEach((entry: FundsEntry) => {
          if (entry.type === 'revenue') {
            revenue += entry.amount
          } else {
            expense += entry.amount
          }
        })
      }
    })

    return { revenue, expense, profit: revenue - expense }
  }

  const exportToCSV = () => {
    const rows = []
    rows.push(['資金表', format(currentDate, 'yyyy年MM月')])
    rows.push([])
    rows.push(['月初残高', initialBalance])
    rows.push(['定期預金', fixedDeposit])
    rows.push([])
    rows.push(['日付', '種別', '金額', '説明', '日計', '現預金残'])
    
    for (let day = 1; day <= daysInMonth; day++) {
      const data = dayData[day]
      const { total } = calculateDayTotal(day)
      const balance = calculateRunningBalance(day)
      
      if (data && data.entries && data.entries.length > 0) {
        data.entries.forEach((entry, index) => {
          rows.push([
            index === 0 ? `${day}日` : '',
            entry.type === 'revenue' ? '収入' : entry.type === 'expense' ? '支出' : '経費',
            entry.type === 'revenue' ? entry.amount : -entry.amount,
            entry.description,
            index === 0 ? total : '',
            index === 0 ? balance : ''
          ])
        })
      } else {
        rows.push([`${day}日`, '', '', '', 0, balance])
      }
    }
    
    const csvContent = rows.map(row => row.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `資金表_${format(currentDate, 'yyyy年MM月')}.csv`
    link.click()
  }

  const monthTotal = calculateMonthTotal()
  const endingBalance = calculateRunningBalance(daysInMonth)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'revenue': return '売掛'
      case 'expense': return '買掛'
      case 'operatingCost': return '経費'
      default: return ''
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return 'text-blue-600'
      case 'expense': return 'text-red-600'
      case 'operatingCost': return 'text-orange-600'
      default: return ''
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-2xl font-bold">
                {format(currentDate, 'yyyy年M月', { locale: ja })} 資金表
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempInitialBalance(initialBalance)
                  setTempFixedDeposit(fixedDeposit)
                  setShowBalanceSettings(true)
                }}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-2" />
                残高設定
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV出力
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-gray-50">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">月初残高</div>
            <div className="text-lg font-bold">{formatCurrency(initialBalance)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">収入計</div>
            <div className="text-lg font-bold text-blue-600">{formatCurrency(monthTotal.revenue)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">支出計</div>
            <div className="text-lg font-bold text-red-600">{formatCurrency(monthTotal.expense)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">収支</div>
            <div className={`text-lg font-bold ${monthTotal.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(monthTotal.profit)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">月末残高</div>
            <div className="text-lg font-bold">{formatCurrency(endingBalance)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">定期預金</div>
            <div className="text-lg font-bold">{formatCurrency(fixedDeposit)}</div>
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">日付</TableHead>
                <TableHead>取引内容</TableHead>
                <TableHead className="text-right">収入</TableHead>
                <TableHead className="text-right">支出</TableHead>
                <TableHead className="text-right">日計</TableHead>
                <TableHead className="text-right">残高</TableHead>
                <TableHead className="w-24">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay()
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                const { revenue, expense, total } = calculateDayTotal(day)
                const runningBalance = calculateRunningBalance(day)
                const dayInfo = dayData[day]
                const entries = (dayInfo && Array.isArray(dayInfo.entries)) ? dayInfo.entries : []

                return (
                  <TableRow key={day} className={isWeekend ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">
                      <div>
                        <span className={`font-bold ${isWeekend ? 'text-red-500' : ''}`}>
                          {day}日
                        </span>
                        <span className="text-xs ml-1 text-gray-500">
                          ({['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {entries.length > 0 ? (
                        <div className="space-y-1">
                          {entries.slice(0, 2).map(entry => (
                            <div key={entry.id} className="text-sm">
                              <span className={`font-medium ${getTypeColor(entry.type)}`}>
                                [{getTypeLabel(entry.type)}]
                              </span>
                              <span className="ml-2">{entry.description}</span>
                            </div>
                          ))}
                          {entries.length > 2 && (
                            <div className="text-xs text-gray-500">
                              他{entries.length - 2}件
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-blue-600">
                      {revenue > 0 ? formatCurrency(revenue) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {expense > 0 ? formatCurrency(expense) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      <span className={total >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(total)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(runningBalance)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEntryDialog(day)}
                          className="h-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {entries.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openViewDialog(day)}
                            className="h-8"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 取引追加ダイアログ */}
      <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>取引を追加 - {selectedDay}日</DialogTitle>
            <DialogDescription>
              新しい取引を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">種別</label>
              <Select
                value={newEntry.type}
                onValueChange={(value) => setNewEntry({ ...newEntry, type: value as any })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">売掛（収入）</SelectItem>
                  <SelectItem value="expense">買掛（支出）</SelectItem>
                  <SelectItem value="operatingCost">経費</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">金額</label>
              <Input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">説明</label>
              <Input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="取引の説明を入力"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEntryDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={addEntry} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取引一覧ダイアログ */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDay}日の取引一覧</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedDayEntries.length > 0 ? (
              selectedDayEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <span className={`font-medium ${getTypeColor(entry.type)}`}>
                      [{getTypeLabel(entry.type)}]
                    </span>
                    <span className="ml-2">{entry.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {formatCurrency(entry.type === 'revenue' ? entry.amount : -entry.amount)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(entry)}
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('この取引を削除しますか？')) {
                          deleteEntry(selectedDay!, entry.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">取引がありません</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取引編集ダイアログ */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>取引を編集 - {selectedDay}日</DialogTitle>
            <DialogDescription>
              取引内容を編集してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">種別</label>
              <Select
                value={newEntry.type}
                onValueChange={(value) => setNewEntry({ ...newEntry, type: value as any })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">売掛（収入）</SelectItem>
                  <SelectItem value="expense">買掛（支出）</SelectItem>
                  <SelectItem value="operatingCost">経費</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">金額</label>
              <Input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">説明</label>
              <Input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="取引の説明を入力"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false)
              setEditingEntry(null)
            }}>
              キャンセル
            </Button>
            <Button onClick={updateEntry} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 残高設定ダイアログ */}
      <Dialog open={showBalanceSettings} onOpenChange={setShowBalanceSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>残高設定 - {format(currentDate, 'yyyy年M月')}</DialogTitle>
            <DialogDescription>
              この月の初期残高と定期預金を設定してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">月初現預金残高</label>
              <Input
                type="number"
                value={tempInitialBalance}
                onChange={(e) => setTempInitialBalance(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">定期預金</label>
              <Input
                type="number"
                value={tempFixedDeposit}
                onChange={(e) => setTempFixedDeposit(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-sm text-gray-600">合計残高</div>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(tempInitialBalance + tempFixedDeposit)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBalanceSettings(false)}>
              キャンセル
            </Button>
            <Button onClick={saveBalanceSettings} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}