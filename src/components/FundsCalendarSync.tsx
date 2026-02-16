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
  Link2,
} from 'lucide-react'
import { format, getDaysInMonth, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useDataSync } from '@/contexts/DataSyncContext'

export default function FundsCalendarSync() {
  const {
    fundsEntries,
    addFundsEntry,
    updateFundsEntry,
    deleteFundsEntry,
    getFundsEntriesByDate,
    projects,
    linkFundsEntryToProject,
    unlinkFundsEntryFromProject,
  } = useDataSync()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showBalanceSettings, setShowBalanceSettings] = useState(false)
  const [showEntryDialog, setShowEntryDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedDayEntries, setSelectedDayEntries] = useState<any[]>([])
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [linkingEntry, setLinkingEntry] = useState<any>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [newEntry, setNewEntry] = useState<{
    type: 'revenue' | 'expense' | 'operatingCost'
    amount: string
    description: string
  }>({
    type: 'revenue',
    amount: '',
    description: '',
  })
  const [initialBalance, setInitialBalance] = useState(5368791)
  const [fixedDeposit, setFixedDeposit] = useState(1050000)
  const [tempInitialBalance, setTempInitialBalance] = useState(5368791)
  const [tempFixedDeposit, setTempFixedDeposit] = useState(1050000)

  const monthKey = format(currentDate, 'yyyy-MM')
  const daysInMonth = getDaysInMonth(currentDate)

  const categories = {
    revenue: ['工事売上', '手数料収入', '補助金'],
    expense: ['材料費', '外注費', '労務費', '運送費', '諸経費'],
    operatingCost: ['給与', '賃貸料', '水道光熱費', '通信費', '保険料'],
  }

  const calculateDailyBalance = (day: number) => {
    let balance = initialBalance
    const currentMonth = format(currentDate, 'yyyy-MM')
    
    for (let d = 1; d <= day; d++) {
      const dateStr = `${currentMonth}-${String(d).padStart(2, '0')}`
      const entries = getFundsEntriesByDate(dateStr)
      
      entries.forEach(entry => {
        if (entry.type === 'revenue') {
          balance += entry.amount
        } else {
          balance -= entry.amount
        }
      })
    }
    
    return balance
  }

  const handleAddEntry = () => {
    if (!selectedDay || !newEntry.amount || !newEntry.description) return

    const dateStr = `${format(currentDate, 'yyyy-MM')}-${String(selectedDay).padStart(2, '0')}`
    addFundsEntry({
      amount: parseInt(newEntry.amount),
      description: newEntry.description,
      type: newEntry.type,
      date: dateStr,
    })

    setNewEntry({ type: 'revenue', amount: '', description: '' })
    setShowEntryDialog(false)
  }

  const handleEditEntry = () => {
    if (!editingEntry || !newEntry.amount || !newEntry.description) return

    updateFundsEntry(editingEntry.id, {
      amount: parseInt(newEntry.amount),
      description: newEntry.description,
      type: newEntry.type,
    })

    setEditingEntry(null)
    setNewEntry({ type: 'revenue', amount: '', description: '' })
    setShowEditDialog(false)
  }

  const handleDeleteEntry = (entryId: string) => {
    deleteFundsEntry(entryId)
    const dateStr = `${format(currentDate, 'yyyy-MM')}-${String(selectedDay).padStart(2, '0')}`
    setSelectedDayEntries(getFundsEntriesByDate(dateStr))
  }

  const handleViewEntries = (day: number) => {
    const dateStr = `${format(currentDate, 'yyyy-MM')}-${String(day).padStart(2, '0')}`
    const entries = getFundsEntriesByDate(dateStr)
    setSelectedDay(day)
    setSelectedDayEntries(entries)
    setShowViewDialog(true)
  }

  const handleStartEdit = (entry: any) => {
    setEditingEntry(entry)
    setNewEntry({
      type: entry.type,
      amount: entry.amount.toString(),
      description: entry.description,
    })
    setShowViewDialog(false)
    setShowEditDialog(true)
  }

  const handleLinkToProject = (entry: any) => {
    setLinkingEntry(entry)
    setSelectedProjectId(entry.projectId || '')
    setShowLinkDialog(true)
  }

  const handleSaveLink = () => {
    if (!linkingEntry) return
    
    if (selectedProjectId) {
      linkFundsEntryToProject(linkingEntry.id, selectedProjectId)
    } else {
      unlinkFundsEntryFromProject(linkingEntry.id)
    }
    
    setLinkingEntry(null)
    setSelectedProjectId('')
    setShowLinkDialog(false)
    
    // 表示を更新
    if (selectedDay) {
      handleViewEntries(selectedDay)
    }
  }

  const getLinkedProjectName = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find(p => p.id === projectId)
    return project ? project.project_name : null
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>資金表</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(currentDate, 'yyyy年MM月', { locale: ja })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBalanceSettings(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              残高設定
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{initialBalance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">月初残高</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    ¥{calculateDailyBalance(daysInMonth).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">月末残高</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">¥{fixedDeposit.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">定期預金</p>
                </CardContent>
              </Card>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">日付</TableHead>
                  <TableHead>収入</TableHead>
                  <TableHead>支出</TableHead>
                  <TableHead>経費</TableHead>
                  <TableHead>残高</TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dateStr = `${format(currentDate, 'yyyy-MM')}-${String(day).padStart(2, '0')}`
                  const dayEntries = getFundsEntriesByDate(dateStr)
                  const revenue = dayEntries
                    .filter(e => e.type === 'revenue')
                    .reduce((sum, e) => sum + e.amount, 0)
                  const expense = dayEntries
                    .filter(e => e.type === 'expense')
                    .reduce((sum, e) => sum + e.amount, 0)
                  const operatingCost = dayEntries
                    .filter(e => e.type === 'operatingCost')
                    .reduce((sum, e) => sum + e.amount, 0)
                  const balance = calculateDailyBalance(day)
                  const hasLinkedProject = dayEntries.some(e => e.projectId)

                  return (
                    <TableRow key={day}>
                      <TableCell className="font-medium">
                        {format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'MM/dd')}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {revenue > 0 ? `¥${revenue.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {expense > 0 ? `¥${expense.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        {operatingCost > 0 ? `¥${operatingCost.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>¥{balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedDay(day)
                              setShowEntryDialog(true)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          {dayEntries.length > 0 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewEntries(day)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {hasLinkedProject && (
                                <Link2 className="h-4 w-4 text-blue-500" />
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 残高設定ダイアログ */}
      <Dialog open={showBalanceSettings} onOpenChange={setShowBalanceSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>残高設定</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">月初残高</label>
              <Input
                type="number"
                value={tempInitialBalance}
                onChange={(e) => setTempInitialBalance(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">定期預金</label>
              <Input
                type="number"
                value={tempFixedDeposit}
                onChange={(e) => setTempFixedDeposit(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBalanceSettings(false)}>
              キャンセル
            </Button>
            <Button onClick={() => {
              setInitialBalance(tempInitialBalance)
              setFixedDeposit(tempFixedDeposit)
              setShowBalanceSettings(false)
            }}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* エントリー追加ダイアログ */}
      <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay),
                'MM月dd日'
              )} の取引を追加
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">種別</label>
              <Select
                value={newEntry.type}
                onValueChange={(value: any) => setNewEntry({ ...newEntry, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">収入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
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
                placeholder="金額を入力"
              />
            </div>
            <div>
              <label className="text-sm font-medium">摘要</label>
              <Input
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="摘要を入力"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEntryDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleAddEntry}>
              <Save className="h-4 w-4 mr-2" />
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* エントリー表示ダイアログ */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay),
                'MM月dd日'
              )} の取引
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedDayEntries.length === 0 ? (
              <p className="text-center text-gray-500 py-4">取引がありません</p>
            ) : (
              selectedDayEntries.map((entry) => {
                const projectName = getLinkedProjectName(entry.projectId)
                return (
                  <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <span className={`font-medium ${
                        entry.type === 'revenue' ? 'text-green-600' :
                        entry.type === 'expense' ? 'text-red-600' :
                        'text-orange-600'
                      }`}>
                        ¥{entry.amount.toLocaleString()}
                      </span>
                      <span className="ml-3">{entry.description}</span>
                      {projectName && (
                        <span className="ml-2 text-sm text-blue-600">
                          [プロジェクト: {projectName}]
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleLinkToProject(entry)}
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleStartEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* エントリー編集ダイアログ */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>取引を編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">種別</label>
              <Select
                value={newEntry.type}
                onValueChange={(value: any) => setNewEntry({ ...newEntry, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">収入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
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
                placeholder="金額を入力"
              />
            </div>
            <div>
              <label className="text-sm font-medium">摘要</label>
              <Input
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="摘要を入力"
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
            <Button onClick={handleEditEntry}>
              <Save className="h-4 w-4 mr-2" />
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* プロジェクト連携ダイアログ */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロジェクトと連携</DialogTitle>
            <DialogDescription>
              この取引をプロジェクトと関連付けることができます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">プロジェクト</label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="プロジェクトを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">連携なし</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.project_name} ({project.client_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowLinkDialog(false)
              setLinkingEntry(null)
            }}>
              キャンセル
            </Button>
            <Button onClick={handleSaveLink}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}