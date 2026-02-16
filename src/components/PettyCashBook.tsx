'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  Trash2,
  Edit,
  Printer,
  Camera,
  Upload,
  Loader2,
} from 'lucide-react'
import { format, getDaysInMonth, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import { toast } from 'sonner'
import Tesseract from 'tesseract.js'

interface CashEntry {
  id: string
  date: number
  description: string
  incomeAmount: number
  expenseAmount: number
}

interface MonthData {
  entries: CashEntry[]
  carryover: number
}

interface AllData {
  [monthKey: string]: MonthData
}

const STORAGE_KEY = 'iwasaki_petty_cash_book'

export default function PettyCashBook() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [allData, setAllData] = useState<AllData>({})
  const [showEntryDialog, setShowEntryDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<CashEntry | null>(null)
  const [newEntry, setNewEntry] = useState<{
    date: string
    description: string
    type: 'income' | 'expense'
    amount: string
  }>({
    date: '1',
    description: '',
    type: 'income',
    amount: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResult, setOcrResult] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const monthKey = format(currentDate, 'yyyy-MM')
  const currentMonthData = allData[monthKey] || {
    entries: [],
    carryover: 0,
  }

  const daysInMonth = getDaysInMonth(currentDate)

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      setAllData(JSON.parse(savedData))
    }
  }, [])

  const saveData = (newAllData: AllData) => {
    setAllData(newAllData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAllData))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' 
      ? subMonths(currentDate, 1)
      : addMonths(currentDate, 1))
  }

  const handlePrint = () => {
    window.print()
  }

  const openEntryDialog = () => {
    setEditingEntry(null)
    setNewEntry({
      date: '1',
      description: '',
      type: 'income',
      amount: '',
    })
    setOcrResult('')
    setShowEntryDialog(true)
  }

  const openEditDialog = (entry: CashEntry) => {
    setEditingEntry(entry)
    setNewEntry({
      date: entry.date.toString(),
      description: entry.description,
      type: entry.incomeAmount > 0 ? 'income' : 'expense',
      amount: (entry.incomeAmount || entry.expenseAmount).toString(),
    })
    setShowEntryDialog(true)
  }

  const handleSaveEntry = () => {
    const amount = parseInt(newEntry.amount) || 0
    if (amount <= 0) {
      toast.error('金額を入力してください')
      return
    }
    if (!newEntry.description) {
      toast.error('摘要を入力してください')
      return
    }

    const newAllData = { ...allData }
    if (!newAllData[monthKey]) {
      newAllData[monthKey] = {
        entries: [],
        carryover: calculatePreviousMonthEndBalance(),
      }
    }

    const entry: CashEntry = {
      id: editingEntry?.id || Date.now().toString(),
      date: parseInt(newEntry.date),
      description: newEntry.description,
      incomeAmount: newEntry.type === 'income' ? amount : 0,
      expenseAmount: newEntry.type === 'expense' ? amount : 0,
    }

    if (editingEntry) {
      const index = newAllData[monthKey].entries.findIndex(e => e.id === editingEntry.id)
      if (index !== -1) {
        newAllData[monthKey].entries[index] = entry
      }
    } else {
      newAllData[monthKey].entries.push(entry)
    }

    // 日付順にソート
    newAllData[monthKey].entries.sort((a, b) => a.date - b.date)

    saveData(newAllData)
    setShowEntryDialog(false)
    toast.success(editingEntry ? '更新しました' : '追加しました')
  }

  const handleDeleteEntry = (id: string) => {
    const newAllData = { ...allData }
    if (newAllData[monthKey]) {
      newAllData[monthKey].entries = newAllData[monthKey].entries.filter(e => e.id !== id)
      saveData(newAllData)
      toast.success('削除しました')
    }
  }

  const calculatePreviousMonthEndBalance = () => {
    const prevMonth = format(subMonths(currentDate, 1), 'yyyy-MM')
    const prevData = allData[prevMonth]
    if (!prevData) return 0

    let balance = prevData.carryover
    prevData.entries.forEach(entry => {
      balance += entry.incomeAmount
      balance -= entry.expenseAmount
    })
    return balance
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    toast.info('レシートを読み込んでいます...')

    try {
      const imageUrl = URL.createObjectURL(file)

      const { data: { text } } = await Tesseract.recognize(
        imageUrl,
        'jpn',
        {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100)
              if (progress % 20 === 0) {
                toast.info(`読み取り中... ${progress}%`)
              }
            }
          }
        }
      )

      URL.revokeObjectURL(imageUrl)

      // OCR結果を解析
      const parsedData = parseReceiptText(text)

      // 解析結果を新規エントリーダイアログに反映
      setNewEntry({
        date: parsedData.date || new Date().getDate().toString(),
        description: parsedData.description || '',
        type: 'expense', // レシートは基本的に支出
        amount: parsedData.amount || '',
      })

      setOcrResult(text)
      setShowEntryDialog(true)
      toast.success('レシートを読み取りました。内容を確認してください。')
    } catch {
      toast.error('レシートの読み取りに失敗しました')
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const parseReceiptText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())

    let amount = ''
    let description = ''
    let date = ''

    // 金額を探す（¥マークや数字のパターン）
    const amountPatterns = [
      /[¥￥]\s*([0-9,]+)/,
      /合計.*?([0-9,]+)円?/,
      /計.*?([0-9,]+)円?/,
      /([0-9]{3,}[0-9,]*)円?/
    ]

    for (const pattern of amountPatterns) {
      for (const line of lines) {
        const match = line.match(pattern)
        if (match) {
          amount = match[1].replace(/,/g, '')
          break
        }
      }
      if (amount) break
    }

    // 店名や商品名を探す（最初の方の行から）
    const descriptionCandidates = []
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim()
      if (line.length > 2 && !line.match(/^[0-9\s,¥￥]+$/)) {
        descriptionCandidates.push(line)
      }
    }

    if (descriptionCandidates.length > 0) {
      // 勘定科目の推測
      const keywords = {
        '交通費': ['駅', 'JR', '電車', 'バス', 'タクシー', '交通'],
        '消耗品費': ['コンビニ', 'セブン', 'ローソン', 'ファミリーマート', '文房具', '事務'],
        '会議費': ['カフェ', 'コーヒー', 'スターバックス', 'ドトール', '喫茶'],
        '接待交際費': ['レストラン', '居酒屋', '寿司', '焼肉'],
        '燃料費': ['ガソリン', 'ENEOS', '出光', 'シェル'],
        '通信費': ['ドコモ', 'au', 'ソフトバンク', '携帯'],
      }

      let category = ''
      const firstLine = descriptionCandidates[0]

      for (const [cat, words] of Object.entries(keywords)) {
        if (words.some(word => firstLine.includes(word))) {
          category = cat
          break
        }
      }

      description = category || firstLine.substring(0, 20)
    }

    // 日付を探す（MM/DD、MM月DD日などのパターン）
    const datePatterns = [
      /(\d{1,2})月(\d{1,2})日/,
      /(\d{1,2})\/(\d{1,2})/,
      /(\d{4})年(\d{1,2})月(\d{1,2})日/
    ]

    for (const pattern of datePatterns) {
      for (const line of lines) {
        const match = line.match(pattern)
        if (match) {
          if (match.length === 3) {
            date = match[2] // 日だけを取得
          } else if (match.length === 4) {
            date = match[3] // 年月日の場合は日だけ
          }
          break
        }
      }
      if (date) break
    }

    return {
      amount,
      description,
      date
    }
  }

  // 月の合計を計算
  const monthTotalIncome = currentMonthData.entries.reduce((sum, e) => sum + e.incomeAmount, 0)
  const monthTotalExpense = currentMonthData.entries.reduce((sum, e) => sum + e.expenseAmount, 0)
  
  // 差引残高を計算
  let runningBalance = currentMonthData.carryover || calculatePreviousMonthEndBalance()

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
        }
      `}</style>

      <div className="print-area">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="flex flex-row items-center justify-between no-print p-4 border-b bg-gray-50">
            <h1 className="text-2xl font-bold">小口現金出納帳</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold">
                {format(currentDate, 'yyyy年M月', { locale: ja })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={openEntryDialog}
                className="ml-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規追加
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="ml-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                レシート読込
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                印刷
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-center mb-6 print:block hidden">
              <h1 className="text-3xl font-bold">小口現金出納帳</h1>
              <p className="text-xl mt-2">{format(currentDate, 'yyyy年M月', { locale: ja })}</p>
            </div>
            
            {/* 上部のサマリー情報 - 写真のレイアウトに合わせて調整 */}
            <div className="mb-4 flex justify-between items-center no-print">
              <div className="flex gap-8 text-sm">
                <div>前月繰越: <span className="font-bold">¥{formatCurrency(currentMonthData.carryover || calculatePreviousMonthEndBalance())}</span></div>
                <div>売掛合計: <span className="font-bold text-green-600">¥{formatCurrency(monthTotalIncome)}</span></div>
                <div>買掛合計: <span className="font-bold text-red-600">¥{formatCurrency(monthTotalExpense)}</span></div>
                <div>経費合計: <span className="font-bold">¥{formatCurrency(monthTotalExpense)}</span></div>
                <div>月末残高: <span className="font-bold text-blue-600">¥{formatCurrency(runningBalance)}</span></div>
              </div>
            </div>
            
            <Table className="border-2 border-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-20 text-center border-2 border-gray-300 py-2">月日</TableHead>
                  <TableHead className="border-2 border-gray-300 py-2">摘要</TableHead>
                  <TableHead className="w-36 text-center border-2 border-gray-300 py-2">
                    <div>収入金額</div>
                    <div className="text-xs font-normal">消費税</div>
                  </TableHead>
                  <TableHead className="w-36 text-center border-2 border-gray-300 py-2">
                    <div>支出金額</div>
                    <div className="text-xs font-normal">消費税</div>
                  </TableHead>
                  <TableHead className="w-36 text-center border-2 border-gray-300 py-2">差引残高</TableHead>
                  <TableHead className="w-24 text-center no-print border-2 border-gray-300">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 繰越行 */}
                <TableRow className="border-b">
                  <TableCell className="text-center border-r"></TableCell>
                  <TableCell className="font-medium border-r">繰越</TableCell>
                  <TableCell className="text-right border-r"></TableCell>
                  <TableCell className="text-right border-r"></TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(runningBalance)}
                  </TableCell>
                  <TableCell className="no-print"></TableCell>
                </TableRow>

                {/* エントリー行 */}
                {currentMonthData.entries.map(entry => {
                  if (entry.incomeAmount > 0) {
                    runningBalance += entry.incomeAmount
                  } else if (entry.expenseAmount > 0) {
                    runningBalance -= entry.expenseAmount
                  }

                  return (
                    <TableRow key={entry.id} className="border-b hover:bg-gray-50">
                      <TableCell className="text-center border-r">{format(currentDate, 'M')}/{entry.date}</TableCell>
                      <TableCell className="border-r">{entry.description}</TableCell>
                      <TableCell className="text-right border-r">
                        {entry.incomeAmount > 0 ? (
                          <div>
                            <div>{formatCurrency(entry.incomeAmount)}</div>
                            <div className="text-xs text-gray-500">10%</div>
                          </div>
                        ) : ''}
                      </TableCell>
                      <TableCell className="text-right border-r">
                        {entry.expenseAmount > 0 ? (
                          <div>
                            <div>{formatCurrency(entry.expenseAmount)}</div>
                            <div className="text-xs text-gray-500">10%</div>
                          </div>
                        ) : ''}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(runningBalance)}
                      </TableCell>
                      <TableCell className="no-print">
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {/* 小口現金へ行 */}
                <TableRow className="border-b bg-gray-50">
                  <TableCell className="text-center border-r"></TableCell>
                  <TableCell className="font-medium border-r">小口現金へ</TableCell>
                  <TableCell className="text-right border-r">
                    <div>
                      <div className="font-bold">70,000</div>
                      <div className="text-xs text-gray-500">外</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right border-r"></TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(runningBalance + 70000)}
                  </TableCell>
                  <TableCell className="no-print"></TableCell>
                </TableRow>
                
                {/* 合計行 */}
                <TableRow className="font-bold bg-gray-100 border-t-2">
                  <TableCell colSpan={2} className="text-center border-r">
                    合計
                  </TableCell>
                  <TableCell className="text-right border-r">
                    {monthTotalIncome > 0 ? formatCurrency(monthTotalIncome + 70000) : formatCurrency(70000)}
                  </TableCell>
                  <TableCell className="text-right border-r">
                    {monthTotalExpense > 0 ? formatCurrency(monthTotalExpense) : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(runningBalance + 70000)}
                  </TableCell>
                  <TableCell className="no-print"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* エントリー追加/編集ダイアログ */}
        <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'エントリーを編集' : '新規エントリー'}
                {ocrResult && (
                  <span className="text-sm text-green-600 ml-2">
                    (レシートから読み取り済み)
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">日付</label>
                <Select
                  value={newEntry.date}
                  onValueChange={(value) => setNewEntry({ ...newEntry, date: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}日
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">種別</label>
                <Select
                  value={newEntry.type}
                  onValueChange={(value: 'income' | 'expense') => 
                    setNewEntry({ ...newEntry, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">収入</SelectItem>
                    <SelectItem value="expense">支出</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">摘要</label>
                <Input
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  placeholder="例: 小口現金へ、消耗品費、交通費など"
                  className={ocrResult ? 'border-green-500' : ''}
                />
                {ocrResult && (
                  <p className="text-xs text-gray-500 mt-1">
                    自動入力されました。必要に応じて修正してください。
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">金額</label>
                <Input
                  type="number"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                  placeholder="0"
                  className={ocrResult ? 'border-green-500' : ''}
                />
                {ocrResult && (
                  <p className="text-xs text-gray-500 mt-1">
                    レシートから読み取った金額です。確認してください。
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEntryDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSaveEntry}>
                {editingEntry ? '更新' : '追加'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}