'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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
import { Card, CardContent } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Trash2,
  Edit,
  Eye,
  Users,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Info,
} from 'lucide-react'
import { format, getDaysInMonth, addMonths, subMonths, isSameMonth, parseISO, getDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { toast } from 'sonner'

interface FundsEntry {
  id: string
  entry_date: string
  entry_type: 'revenue' | 'expense' | 'operatingCost'
  amount: number
  description: string
  project_id?: string
  is_project_linked?: boolean
  entry_category?: string
  transfer_type?: string
  transfer_destination?: string
  memo?: string
}

interface MonthlySettings {
  month_key: string
  initial_balance: number
  fixed_deposit: number
}

interface FixedDepositInfo {
  current_amount: number
  initial_amount?: number
  transfer_total?: number
  deposits?: any[]
}

interface ProjectData {
  id: string
  project_name: string
  project_status?: string
  receivable_amount?: number
  receivable_payment_date?: string
  receivable_customer?: {
    customer_name: string
  }
  project_payables?: {
    id: string
    payable_amount: number
    payment_scheduled_date?: string
    payable_customer?: {
      customer_name: string
    }
    description?: string
  }[]
}

export default function FundsCalendarDB() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<FundsEntry[]>([])
  const [monthlySettings, setMonthlySettings] = useState<MonthlySettings>({
    month_key: format(currentDate, 'yyyy-MM'),
    initial_balance: 5368791,
    fixed_deposit: 1050000,
  })
  const [fixedDepositInfo, setFixedDepositInfo] = useState<FixedDepositInfo>({
    current_amount: 1050000,
  })
  const [showFixedDepositDialog, setShowFixedDepositDialog] = useState(false)
  const [prevMonthEndBalance, setPrevMonthEndBalance] = useState(0)
  const [showBalanceSettings, setShowBalanceSettings] = useState(false)
  const [showEntryDialog, setShowEntryDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [editingEntry, setEditingEntry] = useState<FundsEntry | null>(null)
  const [newEntry, setNewEntry] = useState<{
    type: 'revenue' | 'expense' | 'operatingCost'
    amount: string
    description: string
    category?: string
    transferType?: string
    transferDestination?: string
    memo?: string
    isTransfer?: boolean
  }>({
    type: 'revenue',
    amount: '',
    description: '',
    category: '',
    transferType: '',
    transferDestination: '',
    memo: '',
    isTransfer: false,
  })
  const [tempInitialBalance, setTempInitialBalance] = useState(5368791)
  const [tempFixedDeposit, setTempFixedDeposit] = useState(1050000)
  const [loading, setLoading] = useState(false)
  const [groupByCustomer, setGroupByCustomer] = useState(false)
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set())
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set())
  const [expandedDayCustomers, setExpandedDayCustomers] = useState<Set<string>>(new Set())
  
  const supabase = createClient()
  const monthKey = format(currentDate, 'yyyy-MM')
  const daysInMonth = getDaysInMonth(currentDate)

  // ステータスの並び順を定義
  const statusOrder: { [key: string]: number } = {
    '施工前': 1,
    '売上前': 2,
    '入金待ち': 3,
    '完了': 4,
    '施工後': 5,
  }

  // カテゴリ定義
  const categories = {
    revenue: [
      { value: '売掛金入金', label: '売掛金入金' },
      { value: '現金売上', label: '現金売上' },
      { value: 'その他収入', label: 'その他収入' },
    ],
    expense: [
      { value: '買掛金支払', label: '買掛金支払' },
      { value: '材料仕入', label: '材料仕入' },
      { value: '外注費支払', label: '外注費支払' },
    ],
    operatingCost: [
      { value: '給与・賃金', label: '給与・賃金' },
      { value: '地代家賃', label: '地代家賃' },
      { value: '水道光熱費', label: '水道光熱費' },
      { value: '通信費', label: '通信費' },
      { value: '交通費', label: '交通費' },
      { value: '消耗品費', label: '消耗品費' },
      { value: 'その他経費', label: 'その他経費' },
    ],
    transfer: [
      { value: '定期預金振替', label: '定期預金へ振替' },
      { value: '普通預金振替', label: '普通預金間振替' },
      { value: '現金引出', label: '現金引出' },
      { value: '現金預入', label: '現金預入' },
    ],
  }

  // 前月の最終残高を計算
  const calculatePreviousMonthEndBalance = async () => {
    const prevMonth = subMonths(currentDate, 1)
    const prevMonthKey = format(prevMonth, 'yyyy-MM')
    
    try {
      // 前月の設定を取得
      const { data: prevSettings } = await supabase
        .from('funds_monthly_settings')
        .select('*')
        .eq('month_key', prevMonthKey)
        .single()
      
      let balance = prevSettings?.initial_balance || 5368791
      
      // 前月のエントリーを取得
      const startDate = format(prevMonth, 'yyyy-MM-01')
      const endDate = format(new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0), 'yyyy-MM-dd')
      
      const { data: prevEntries } = await supabase
        .from('funds_entries')
        .select('*')
        .gte('entry_date', startDate)
        .lte('entry_date', endDate)
      
      if (prevEntries) {
        prevEntries.forEach(entry => {
          if (entry.entry_type === 'revenue') {
            balance += entry.amount
          } else {
            balance -= entry.amount
          }
        })
      }
      
      setPrevMonthEndBalance(balance)
      return balance
    } catch {
      return 5368791 // デフォルト値
    }
  }

  // 定期預金残高をDBから取得
  const fetchFixedDepositBalance = async () => {
    try {
      // アクティブな定期預金の全データを取得
      const { data: activeDeposits } = await supabase
        .from('fixed_deposits')
        .select('*')
        .eq('is_active', true)
        .order('deposit_date', { ascending: true })

      if (!activeDeposits || activeDeposits.length === 0) {
        setFixedDepositInfo({ current_amount: 1050000 })
        return
      }

      // 初期残高を取得
      const initialDeposit = activeDeposits.find(d => d.memo === '初期残高')
      const initialAmount = initialDeposit?.amount || 1050000

      // 振替入金のみを取得（初期残高を除く）
      const transferDeposits = activeDeposits.filter(d => d.memo !== '初期残高')
      const transferTotal = transferDeposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0)

      // 合計を計算
      const totalAmount = initialAmount + transferTotal

      setFixedDepositInfo({
        current_amount: totalAmount,
        initial_amount: initialAmount,
        transfer_total: transferTotal,
        deposits: activeDeposits
      })
    } catch {
      // エラーの場合はデフォルト値を使用
      setFixedDepositInfo({ current_amount: 1050000 })
    }
  }

  // DBからデータを取得
  const fetchData = async () => {
    setLoading(true)
    try {
      // 月のエントリーを取得
      const startDate = format(currentDate, 'yyyy-MM-01')
      const endDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), 'yyyy-MM-dd')
      
      const { data: entriesData, error: entriesError } = await supabase
        .from('funds_entries')
        .select('*')
        .gte('entry_date', startDate)
        .lte('entry_date', endDate)
        .order('entry_date')

      if (entriesError) throw entriesError
      setEntries(entriesData || [])

      // 月設定を取得
      const { data: settingsData, error: settingsError } = await supabase
        .from('funds_monthly_settings')
        .select('*')
        .eq('month_key', monthKey)
        .single()

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError
      
      if (settingsData) {
        setMonthlySettings(settingsData)
        setTempInitialBalance(settingsData.initial_balance)
        setTempFixedDeposit(settingsData.fixed_deposit)
      } else {
        // デフォルト設定を使用
        const defaultSettings = {
          month_key: monthKey,
          initial_balance: 5368791,
          fixed_deposit: 1050000,
        }
        setMonthlySettings(defaultSettings)
        setTempInitialBalance(defaultSettings.initial_balance)
        setTempFixedDeposit(defaultSettings.fixed_deposit)
      }
      
      // 前月の最終残高を計算
      await calculatePreviousMonthEndBalance()
    } catch {
      toast.error('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 月が変わったらデータを取得
  useEffect(() => {
    fetchData()
    fetchFixedDepositBalance()
  }, [currentDate])


  // エントリーを保存
  const handleSaveEntry = async () => {
    if (!selectedDay || !newEntry.amount) {
      toast.error('金額を入力してください')
      return
    }

    // 摘要が空の場合はカテゴリまたは種別から自動設定
    let finalDescription = newEntry.description
    if (!finalDescription) {
      if (newEntry.isTransfer && newEntry.transferType) {
        finalDescription = newEntry.transferType === '定期預金振替' ? '定期預金への振替' : newEntry.transferType
      } else if (newEntry.category) {
        finalDescription = newEntry.category
      } else {
        finalDescription = getTypeLabel(newEntry.type, newEntry.isTransfer)
      }
    }

    try {
      const entryDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay), 'yyyy-MM-dd')
      
      if (editingEntry) {
        // 基本的な更新データ
        const updateData: any = {
          entry_type: newEntry.type,
          amount: parseFloat(newEntry.amount),
          description: finalDescription,
        }

        // 新しいカラムは存在する場合のみ追加（データベース互換性のため）
        // これらのカラムがなくても動作するようにする
        if (newEntry.category) updateData.entry_category = newEntry.category
        if (newEntry.transferType) updateData.transfer_type = newEntry.transferType
        if (newEntry.transferDestination) updateData.transfer_destination = newEntry.transferDestination
        if (newEntry.memo) updateData.memo = newEntry.memo

        const { error } = await supabase
          .from('funds_entries')
          .update(updateData)
          .eq('id', editingEntry.id)
        
        if (error) throw error
        toast.success('更新しました')
      } else {
        // 基本的な挿入データ
        const insertData: any = {
          entry_date: entryDate,
          entry_type: newEntry.type,
          amount: parseFloat(newEntry.amount),
          description: finalDescription,
          is_project_linked: false,
        }

        // 新しいカラムは存在する場合のみ追加（データベース互換性のため）
        // これらのカラムがなくても動作するようにする
        if (newEntry.category) insertData.entry_category = newEntry.category
        if (newEntry.transferType) insertData.transfer_type = newEntry.transferType
        if (newEntry.transferDestination) insertData.transfer_destination = newEntry.transferDestination
        if (newEntry.memo) insertData.memo = newEntry.memo

        const { error } = await supabase
          .from('funds_entries')
          .insert(insertData)
        
        if (error) throw error
        toast.success('登録しました')

        // 定期預金への振替の場合、定期預金残高をDBに保存
        if (newEntry.isTransfer && newEntry.transferType === '定期預金振替') {
          const { error: depositError } = await supabase
            .from('fixed_deposits')
            .insert({
              deposit_date: entryDate,
              amount: parseFloat(newEntry.amount),
              bank_name: '振替入金',
              memo: finalDescription,
              is_active: true
            })

          if (!depositError) {
            // 表示を更新
            const newAmount = fixedDepositInfo.current_amount + parseFloat(newEntry.amount)
            setFixedDepositInfo({ current_amount: newAmount })
          }
        }
      }

      await fetchData()
      setShowEntryDialog(false)
      setShowEditDialog(false)
      setEditingEntry(null)
      setNewEntry({ type: 'revenue', amount: '', description: '', category: '', transferType: '', transferDestination: '', memo: '', isTransfer: false })
    } catch (error: any) {
      const errorMessage = error?.message || error?.details || '保存に失敗しました'
      toast.error(errorMessage)
    }
  }

  // エントリーを削除
  const handleDeleteEntry = async (entryId: string) => {
    try {
      // 削除前にエントリーの詳細を取得
      const { data: entryData, error: fetchError } = await supabase
        .from('funds_entries')
        .select('*')
        .eq('id', entryId)
        .single()

      if (fetchError) throw fetchError

      // エントリーを削除
      const { error } = await supabase
        .from('funds_entries')
        .delete()
        .eq('id', entryId)

      if (error) throw error

      // 定期預金振替の場合、対応する定期預金レコードも削除
      if (entryData && entryData.is_transfer && entryData.transfer_type === '定期預金振替') {
        const { error: depositError } = await supabase
          .from('fixed_deposits')
          .delete()
          .eq('deposit_date', entryData.entry_date)
          .eq('memo', entryData.description)
          .eq('bank_name', '振替入金')

        if (!depositError) {
          // 定期預金情報を再取得
          await fetchFixedDepositBalance()
        }
      }

      toast.success('削除しました')
      await fetchData()
    } catch {
      toast.error('削除に失敗しました')
    }
  }

  // 月設定を保存
  const handleSaveBalanceSettings = async () => {
    try {
      const { error } = await supabase
        .from('funds_monthly_settings')
        .upsert({
          month_key: monthKey,
          initial_balance: tempInitialBalance,
          fixed_deposit: tempFixedDeposit,
        })
      
      if (error) throw error
      
      setMonthlySettings({
        month_key: monthKey,
        initial_balance: tempInitialBalance,
        fixed_deposit: tempFixedDeposit,
      })
      
      setShowBalanceSettings(false)
      toast.success('設定を保存しました')
    } catch {
      toast.error('設定の保存に失敗しました')
    }
  }

  // 日付ごとのエントリーを取得（ステータス順にソート）
  const getDayEntries = (day: number) => {
    const dayStr = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd')
    const dayEntries = entries.filter(e => e.entry_date === dayStr)

    // ステータス順にソート
    return dayEntries.sort((a, b) => {
      // ステータスを抽出
      const statusA = a.description.match(/^\[([^\]]+)\]/)?.[1] || ''
      const statusB = b.description.match(/^\[([^\]]+)\]/)?.[1] || ''

      const orderA = statusOrder[statusA] || 999
      const orderB = statusOrder[statusB] || 999

      // まずステータス順
      if (orderA !== orderB) {
        return orderA - orderB
      }

      // 同じステータスなら種別順（売掛 → 買掛 → 経費）
      const typeOrder = { 'revenue': 1, 'expense': 2, 'operatingCost': 3 }
      const typeOrderA = typeOrder[a.entry_type] || 999
      const typeOrderB = typeOrder[b.entry_type] || 999

      return typeOrderA - typeOrderB
    })
  }

  // 累積残高を計算（前月繰越を考慮）
  const calculateCumulativeBalance = (upToDay: number) => {
    // 前月繰越残高から開始
    let balance = prevMonthEndBalance || monthlySettings.initial_balance
    
    for (let day = 1; day <= upToDay; day++) {
      const dayEntries = getDayEntries(day)
      dayEntries.forEach(entry => {
        if (entry.entry_type === 'revenue') {
          balance += entry.amount
        } else {
          balance -= entry.amount
        }
      })
    }
    
    return balance
  }

  // 月の合計を計算
  const monthRevenue = entries
    .filter(e => e.entry_type === 'revenue')
    .reduce((sum, e) => sum + e.amount, 0)
  
  const monthExpense = entries
    .filter(e => e.entry_type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0)
  
  const monthOperatingCost = entries
    .filter(e => e.entry_type === 'operatingCost')
    .reduce((sum, e) => sum + e.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount)
  }

  const getTypeLabel = (type: string, isTransfer?: boolean, transferType?: string) => {
    // 振替の場合は振替の種類を表示
    if (isTransfer || transferType) {
      if (transferType === '定期預金振替') return '定期振替'
      if (transferType === '普通預金振替') return '普通振替'
      if (transferType === '現金引出') return '現金引出'
      if (transferType === '現金預入') return '現金預入'
      return '振替'
    }
    // 通常の種別表示
    switch (type) {
      case 'revenue': return '売掛'
      case 'expense': return '買掛'
      case 'operatingCost': return '経費'
      default: return type
    }
  }

  // 日付の展開/折りたたみを切り替える
  const toggleDayExpansion = (day: number) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(day)) {
      newExpanded.delete(day)
    } else {
      newExpanded.add(day)
    }
    setExpandedDays(newExpanded)
  }

  // 取引先の展開/折りたたみを切り替える
  const toggleCustomerExpansion = (customerName: string) => {
    const newExpanded = new Set(expandedCustomers)
    if (newExpanded.has(customerName)) {
      newExpanded.delete(customerName)
    } else {
      newExpanded.add(customerName)
    }
    setExpandedCustomers(newExpanded)
  }

  // 日付内の取引先展開を切り替える
  const toggleDayCustomerExpansion = (day: number, customerName: string) => {
    const key = `${day}-${customerName}`
    const newExpanded = new Set(expandedDayCustomers)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedDayCustomers(newExpanded)
  }

  // 日付内のエントリーを取引先別にグループ化
  const groupDayEntriesByCustomer = (dayEntries: FundsEntry[]) => {
    const grouped: { [key: string]: {
      customerName: string,
      entries: FundsEntry[],
      totalRevenue: number,
      totalExpense: number,
      totalOperatingCost: number
    }} = {}

    dayEntries.forEach(entry => {
      let customerName = ''

      // 取引先名を抽出
      if (entry.is_project_linked && entry.description.includes(' - ')) {
        const parts = entry.description.split(' - ')
        customerName = parts[1] || ''
        const customerParts = customerName.trim().split(/\s+/)
        if (customerParts.length > 0) {
          customerName = customerParts[0]
        }
      } else {
        customerName = entry.description
      }

      if (!customerName) {
        customerName = entry.description
      }

      if (!grouped[customerName]) {
        grouped[customerName] = {
          customerName,
          entries: [],
          totalRevenue: 0,
          totalExpense: 0,
          totalOperatingCost: 0
        }
      }

      grouped[customerName].entries.push(entry)

      if (entry.entry_type === 'revenue') {
        grouped[customerName].totalRevenue += entry.amount
      } else if (entry.entry_type === 'expense') {
        grouped[customerName].totalExpense += entry.amount
      } else if (entry.entry_type === 'operatingCost') {
        grouped[customerName].totalOperatingCost += entry.amount
      }
    })

    return Object.values(grouped)
  }

  // 取引先別にエントリーをグループ化する関数
  const groupEntriesByCustomer = () => {
    const grouped: { [key: string]: {
      customerName: string,
      entries: FundsEntry[],
      totalRevenue: number,
      totalExpense: number,
      totalOperatingCost: number,
      dates: string[],
      projectNames: string[]
    }} = {}


    entries.forEach(entry => {
      let customerName = ''
      let projectName = ''

      // 案件連携データの場合、descriptionから取引先名を抽出
      if (entry.is_project_linked && entry.description.includes(' - ')) {
        const parts = entry.description.split(' - ')
        projectName = parts[0] // 案件名
        // 取引先名を適切に抽出（複数の部分がある場合は2番目の要素全体を使用）
        customerName = parts[1] || ''

        // "永浜クロス株式会社 材料" のような形式から会社名のみを抽出
        // ただし、全体をそのまま使用することも検討
        const customerParts = customerName.trim().split(/\s+/)
        if (customerParts.length > 0) {
          // 会社名と思われる部分を取得（株式会社を含む）
          customerName = customerParts[0]
        }
      } else {
        // 案件連携でない場合はdescriptionそのものを使用
        customerName = entry.description
      }

      // 取引先名が空の場合はdescriptionを使用
      if (!customerName) {
        customerName = entry.description
      }

      if (!grouped[customerName]) {
        grouped[customerName] = {
          customerName,
          entries: [],
          totalRevenue: 0,
          totalExpense: 0,
          totalOperatingCost: 0,
          dates: [],
          projectNames: []
        }
      }

      grouped[customerName].entries.push(entry)

      // 日付を追加（重複しないように）
      const dateStr = format(parseISO(entry.entry_date), 'M/d')
      if (!grouped[customerName].dates.includes(dateStr)) {
        grouped[customerName].dates.push(dateStr)
      }

      // 案件名を追加（重複しないように）
      if (projectName && !grouped[customerName].projectNames.includes(projectName)) {
        grouped[customerName].projectNames.push(projectName)
      }

      // 金額を集計
      if (entry.entry_type === 'revenue') {
        grouped[customerName].totalRevenue += entry.amount
      } else if (entry.entry_type === 'expense') {
        grouped[customerName].totalExpense += entry.amount
      } else if (entry.entry_type === 'operatingCost') {
        grouped[customerName].totalOperatingCost += entry.amount
      }
    })

    // ソート（金額の大きい順）
    return Object.values(grouped).sort((a, b) => {
      const totalA = a.totalRevenue + a.totalExpense + a.totalOperatingCost
      const totalB = b.totalRevenue + b.totalExpense + b.totalOperatingCost
      return totalB - totalA
    })
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">
            {format(currentDate, 'yyyy年M月', { locale: ja })}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {/* 定期預金情報（クリック可能） */}
          <button
            onClick={() => setShowFixedDepositDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <div className="text-xs text-gray-500">定期預金</div>
              <div className="text-sm font-bold text-gray-900">
                {formatCurrency(fixedDepositInfo.current_amount)}
              </div>
            </div>
          </button>

          {/* 表示切替 */}
          <Button
            variant={groupByCustomer ? "default" : "outline"}
            size="sm"
            onClick={() => setGroupByCustomer(!groupByCustomer)}
            className="h-9"
          >
            <Users className="h-4 w-4 mr-1.5" />
            取引先別
          </Button>

          {/* 設定 */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setTempInitialBalance(monthlySettings.initial_balance)
              setTempFixedDeposit(monthlySettings.fixed_deposit)
              setShowBalanceSettings(true)
            }}
            className="h-9 w-9"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-b">
        <div className="grid grid-cols-5 gap-3">
          {/* 前月繰越 */}
          <div className="bg-white rounded p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">前月繰越</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(prevMonthEndBalance || monthlySettings.initial_balance)}
            </div>
          </div>

          {/* 売掛 */}
          <div className="bg-white rounded p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">売掛合計</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(monthRevenue)}
            </div>
          </div>

          {/* 買掛 */}
          <div className="bg-white rounded p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">買掛合計</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(monthExpense)}
            </div>
          </div>

          {/* 経費 */}
          <div className="bg-white rounded p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">経費合計</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(monthOperatingCost)}
            </div>
          </div>

          {/* 月末残高（強調） */}
          <div className="bg-gray-900 rounded p-3 border border-gray-800 shadow">
            <div className="text-xs text-gray-400 mb-1">月末残高</div>
            <div className="text-xl font-bold text-white">
              {formatCurrency(calculateCumulativeBalance(daysInMonth))}
            </div>
          </div>
        </div>
      </div>

      <Card className="flex-1 mx-6 my-4 overflow-hidden shadow-md border-0">
        <CardContent className="p-0 h-full overflow-auto">
          {groupByCustomer ? (
            // 取引先別表示（簡素化版）
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 border-b-2 border-gray-200">
                <TableRow>
                  <TableHead className="font-semibold text-gray-600">取引先名</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">金額合計</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">件数</TableHead>
                  <TableHead className="w-20 font-semibold text-gray-600 text-center">詳細</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupEntriesByCustomer().map((group, index) => {
                  const total = group.totalRevenue - group.totalExpense - group.totalOperatingCost
                  const isExpanded = expandedCustomers.has(group.customerName)

                  return (
                    <React.Fragment key={index}>
                      {/* メイン行 */}
                      <TableRow className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleCustomerExpansion(group.customerName)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                            <span>{group.customerName}</span>
                            {group.entries.some(e => e.is_project_linked) && (
                              <Badge variant="outline" className="border-blue-600 text-blue-600 text-xs">
                                案件
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${total >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(total))}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-600">
                          {group.entries.length}件
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCustomerExpansion(group.customerName)
                            }}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* 展開詳細行 */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={4} className="bg-gray-50 p-4">
                            <div className="space-y-3">
                              {/* サマリー情報 */}
                              <div className="grid grid-cols-4 gap-4 mb-3 pb-3 border-b">
                                <div>
                                  <div className="text-xs text-gray-500">関連案件</div>
                                  <div className="text-sm font-medium">
                                    {group.projectNames.length > 0 ? group.projectNames.join(', ') : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">取引日</div>
                                  <div className="text-sm font-medium">
                                    {group.dates.sort().join(', ')}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-green-700">売掛合計</div>
                                  <div className="text-sm font-medium text-green-600">
                                    {group.totalRevenue > 0 ? formatCurrency(group.totalRevenue) : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-red-700">支出合計</div>
                                  <div className="text-sm font-medium text-red-600">
                                    {(group.totalExpense + group.totalOperatingCost) > 0
                                      ? formatCurrency(group.totalExpense + group.totalOperatingCost)
                                      : '-'}
                                  </div>
                                </div>
                              </div>

                              {/* 取引明細リスト */}
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-gray-600 mb-2">取引明細</div>
                                {group.entries.map((entry) => (
                                  <div key={entry.id} className="flex items-center justify-between py-1.5 px-2 bg-white rounded text-sm">
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-xs text-gray-500">
                                        {format(parseISO(entry.entry_date), 'M/d')}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          entry.entry_type === 'revenue' ? 'border-green-600 text-green-600' :
                                          entry.entry_type === 'expense' ? 'border-red-600 text-red-600' :
                                          'border-red-400 text-red-500'
                                        }`}
                                      >
                                        {getTypeLabel(entry.entry_type, false, entry.transfer_type)}
                                      </Badge>
                                      <span className="text-xs truncate max-w-[200px]">{entry.description}</span>
                                    </div>
                                    <span className={`font-medium ${
                                      entry.entry_type === 'revenue' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {formatCurrency(entry.amount)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            // 日付別表示（改善版）
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 border-b-2 border-gray-200">
                <TableRow>
                  <TableHead className="w-24 font-semibold text-gray-600">日付</TableHead>
                  <TableHead className="w-32 font-semibold text-gray-600">売掛</TableHead>
                  <TableHead className="w-32 font-semibold text-gray-600">買掛</TableHead>
                  <TableHead className="w-32 font-semibold text-gray-600">経費</TableHead>
                  <TableHead className="min-w-[300px] font-semibold text-gray-600">詳細</TableHead>
                  <TableHead className="w-40 font-semibold text-gray-600">残高</TableHead>
                  <TableHead className="w-20 font-semibold text-center text-gray-600">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayEntries = getDayEntries(day)
                const revenue = dayEntries
                  .filter(e => e.entry_type === 'revenue')
                  .reduce((sum, e) => sum + e.amount, 0)
                const expense = dayEntries
                  .filter(e => e.entry_type === 'expense')
                  .reduce((sum, e) => sum + e.amount, 0)
                const operatingCost = dayEntries
                  .filter(e => e.entry_type === 'operatingCost')
                  .reduce((sum, e) => sum + e.amount, 0)
                const cumulativeBalance = calculateCumulativeBalance(day)
                const hasProjectData = dayEntries.some(e => e.is_project_linked)

                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][getDay(date)]
                const isWeekend = getDay(date) === 0 || getDay(date) === 6

                return (
                  <TableRow key={day} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <TableCell className="font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{day}</span>
                        <span className={`text-xs ${isWeekend ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                          {dayOfWeek}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {revenue > 0 && formatCurrency(revenue)}
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                      {expense > 0 && formatCurrency(expense)}
                    </TableCell>
                    <TableCell className="font-semibold text-orange-600">
                      {operatingCost > 0 && formatCurrency(operatingCost)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {dayEntries.length > 0 && (
                        <div className="space-y-1">
                          {/* 取引先別に集約して表示 */}
                          {(() => {
                            const customerGroups = groupDayEntriesByCustomer(dayEntries)

                            // 3件以上の取引先がある場合は折りたたみ
                            if (customerGroups.length > 3 && !expandedDays.has(day)) {
                              return (
                                <>
                                  {/* 最初の2取引先のみ表示 */}
                                  {customerGroups.slice(0, 2).map((group, idx) => {
                                    const key = `${day}-${group.customerName}`
                                    const isExpanded = expandedDayCustomers.has(key)
                                    const total = group.totalRevenue + group.totalExpense + group.totalOperatingCost

                                    return (
                                      <div key={idx} className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${
                                            group.totalRevenue > 0 ? 'border-green-600 text-green-600' :
                                            group.totalExpense > 0 ? 'border-red-600 text-red-600' :
                                            'border-orange-600 text-orange-600'
                                          }`}
                                        >
                                          {group.totalRevenue > 0 ? '売掛' : group.totalExpense > 0 ? '買掛' : '経費'}
                                        </Badge>
                                        <span className="text-xs font-medium">{group.customerName}</span>
                                        {group.entries.length > 1 && (
                                          <Badge variant="outline" className="text-xs bg-gray-100">
                                            {group.entries.length}件
                                          </Badge>
                                        )}
                                        <span className="text-xs text-gray-600 ml-auto">
                                          {formatCurrency(total)}
                                        </span>
                                      </div>
                                    )
                                  })}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                                    onClick={() => toggleDayExpansion(day)}
                                  >
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    他{customerGroups.length - 2}取引先を表示
                                  </Button>
                                </>
                              )
                            }

                            // 全取引先表示
                            return (
                              <>
                                {customerGroups.map((group, idx) => {
                                  const key = `${day}-${group.customerName}`
                                  const isExpanded = expandedDayCustomers.has(key)
                                  const total = group.totalRevenue + group.totalExpense + group.totalOperatingCost

                                  return (
                                    <div key={idx}>
                                      <div
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5"
                                        onClick={() => group.entries.length > 1 && toggleDayCustomerExpansion(day, group.customerName)}
                                      >
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${
                                            group.totalRevenue > 0 ? 'border-green-600 text-green-600' :
                                            group.totalExpense > 0 ? 'border-red-600 text-red-600' :
                                            'border-orange-600 text-orange-600'
                                          }`}
                                        >
                                          {group.totalRevenue > 0 ? '売掛' : group.totalExpense > 0 ? '買掛' : '経費'}
                                        </Badge>
                                        <span className="text-xs font-medium">{group.customerName}</span>
                                        {group.entries.length > 1 && (
                                          <>
                                            <Badge variant="outline" className="text-xs bg-gray-100">
                                              {group.entries.length}件
                                            </Badge>
                                            {isExpanded ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
                                          </>
                                        )}
                                        <span className="text-xs text-gray-600 ml-auto">
                                          {formatCurrency(total)}
                                        </span>
                                      </div>

                                      {/* 展開時の詳細 */}
                                      {isExpanded && group.entries.length > 1 && (
                                        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-2">
                                          {group.entries.map((entry) => {
                                            const statusMatch = entry.description.match(/^\[([^\]]+)\]\s*(.*)/)
                                            const status = statusMatch?.[1]
                                            const displayText = statusMatch?.[2] || entry.description

                                            return (
                                              <div key={entry.id} className="flex items-center gap-2 text-xs text-gray-600">
                                                {status && (
                                                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                    {status}
                                                  </Badge>
                                                )}
                                                <span className="truncate max-w-[150px]">{displayText}</span>
                                                <span className="ml-auto">{formatCurrency(entry.amount)}</span>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                                {customerGroups.length > 3 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                                    onClick={() => toggleDayExpansion(day)}
                                  >
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    折りたたむ
                                  </Button>
                                )}
                              </>
                            )
                          })()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-gray-900 border-l border-gray-300">
                      {formatCurrency(cumulativeBalance)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {hasProjectData && (
                          <Badge variant="outline" className="mr-1 border-blue-600 text-blue-600 text-xs">
                            案件
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedDay(day)
                            setNewEntry({ type: 'revenue', amount: '', description: '', category: '', transferType: '', transferDestination: '', memo: '', isTransfer: false })
                            setShowEntryDialog(true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {dayEntries.length > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedDay(day)
                              setShowViewDialog(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* 登録ダイアログ */}
      <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {format(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay || 1), 'M月d日')}の取引登録
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 取引種別 */}
            <div className="grid grid-cols-5 gap-2">
              <Button
                type="button"
                variant={newEntry.type === 'revenue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'revenue', category: '', isTransfer: false })}
                className={newEntry.type === 'revenue' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                収入
              </Button>
              <Button
                type="button"
                variant={newEntry.type === 'expense' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'expense', category: '', isTransfer: false })}
                className={newEntry.type === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                支出
              </Button>
              <Button
                type="button"
                variant={newEntry.type === 'operatingCost' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'operatingCost', category: '', isTransfer: false })}
                className={newEntry.type === 'operatingCost' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                経費
              </Button>
              <Button
                type="button"
                variant={newEntry.isTransfer ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'expense', category: '', transferType: '定期預金振替', isTransfer: true })}
                className={newEntry.isTransfer ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                振替
              </Button>
            </div>

            {/* カテゴリ選択（振替の場合） */}
            {newEntry.isTransfer && (
              <div>
                <label className="text-sm font-medium mb-2 block">振替種類</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.transfer.map(cat => (
                    <Button
                      key={cat.value}
                      type="button"
                      variant={newEntry.transferType === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const description = cat.value === '定期預金振替'
                          ? '定期預金への振替'
                          : cat.label
                        setNewEntry({
                          ...newEntry,
                          transferType: cat.value,
                          description: description,
                          transferDestination: cat.value === '定期預金振替' ? '定期預金口座' : ''
                        })
                      }}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* カテゴリ選択（振替以外） */}
            {!newEntry.isTransfer && (
              <div>
                <label className="text-sm font-medium mb-2 block">カテゴリ</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories[newEntry.type as keyof typeof categories]?.map(cat => (
                    <Button
                      key={cat.value}
                      type="button"
                      variant={newEntry.category === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewEntry({ ...newEntry, category: cat.value, description: cat.label })}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 金額入力 */}
            <div>
              <label className="text-sm font-medium mb-1 block">金額 *</label>
              <Input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                placeholder="例: 100000"
                className="text-lg"
              />
            </div>

            {/* 振替先（振替の場合） */}
            {newEntry.isTransfer && newEntry.transferType === '定期預金振替' && (
              <div>
                <label className="text-sm font-medium mb-1 block">振替先</label>
                <Input
                  value={newEntry.transferDestination || '定期預金口座'}
                  onChange={(e) => setNewEntry({ ...newEntry, transferDestination: e.target.value })}
                  placeholder="振替先を入力"
                />
              </div>
            )}

            {/* 摘要（詳細） - 任意 */}
            <div>
              <label className="text-sm font-medium mb-1 block">摘要（任意）</label>
              <Input
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder={"空欄可 - 自動でカテゴリ名が入ります"}
              />
            </div>

            {/* メモ */}
            <div>
              <label className="text-sm font-medium mb-1 block">メモ（任意）</label>
              <Input
                value={newEntry.memo || ''}
                onChange={(e) => setNewEntry({ ...newEntry, memo: e.target.value })}
                placeholder="備考があれば入力"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEntryDialog(false)
              setNewEntry({ type: 'revenue', amount: '', description: '', category: '', transferType: '', transferDestination: '', memo: '', isTransfer: false })
            }}>
              キャンセル
            </Button>
            <Button
              onClick={handleSaveEntry}
              disabled={!newEntry.amount}
            >
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>取引を編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 取引種別 */}
            <div className="grid grid-cols-5 gap-2">
              <Button
                type="button"
                variant={newEntry.type === 'revenue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'revenue', category: '', isTransfer: false })}
                className={newEntry.type === 'revenue' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                収入
              </Button>
              <Button
                type="button"
                variant={newEntry.type === 'expense' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'expense', category: '', isTransfer: false })}
                className={newEntry.type === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                支出
              </Button>
              <Button
                type="button"
                variant={newEntry.type === 'operatingCost' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'operatingCost', category: '', isTransfer: false })}
                className={newEntry.type === 'operatingCost' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                経費
              </Button>
              <Button
                type="button"
                variant={newEntry.isTransfer ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewEntry({ ...newEntry, type: 'expense', category: '', transferType: '定期預金振替', isTransfer: true })}
                className={newEntry.isTransfer ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                振替
              </Button>
            </div>

            {/* 金額入力 */}
            <div>
              <label className="text-sm font-medium mb-1 block">金額 *</label>
              <Input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                placeholder="例: 100000"
                className="text-lg"
              />
            </div>

            {/* 摘要 */}
            <div>
              <label className="text-sm font-medium mb-1 block">摘要（任意）</label>
              <Input
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="空欄可 - 自動でカテゴリ名が入ります"
              />
            </div>

            {/* メモ */}
            <div>
              <label className="text-sm font-medium mb-1 block">メモ</label>
              <Input
                value={newEntry.memo || ''}
                onChange={(e) => setNewEntry({ ...newEntry, memo: e.target.value })}
                placeholder="備考があれば入力"
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
            <Button onClick={handleSaveEntry} disabled={!newEntry.amount}>
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 詳細表示ダイアログ */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedDay}日の取引詳細
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-2">
              {selectedDay && getDayEntries(selectedDay).length === 0 ? (
                <p className="text-gray-500 text-center py-4">取引データがありません</p>
              ) : (
                selectedDay && getDayEntries(selectedDay).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <Badge className={
                      entry.transfer_type ? 'bg-blue-100 text-blue-700' :
                      entry.entry_type === 'revenue' ? 'bg-green-100 text-green-700' :
                      entry.entry_type === 'expense' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }>
                      {getTypeLabel(entry.entry_type, false, entry.transfer_type)}
                    </Badge>
                    {entry.is_project_linked && (
                      <Badge variant="outline">案件連携</Badge>
                    )}
                    <span>{entry.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      entry.entry_type === 'revenue' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(entry.amount)}
                    </span>
                    {!entry.is_project_linked && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setShowViewDialog(false)
                            setEditingEntry(entry)
                            setNewEntry({
                              type: entry.entry_type as any,
                              amount: entry.amount.toString(),
                              description: entry.description,
                              category: entry.entry_category || '',
                              transferType: entry.transfer_type || '',
                              transferDestination: entry.transfer_destination || '',
                              memo: entry.memo || '',
                            })
                            setShowEditDialog(true)
                          }}
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
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 残高設定ダイアログ */}
      <Dialog open={showBalanceSettings} onOpenChange={setShowBalanceSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>残高設定</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">初期残高</label>
              <Input
                type="number"
                value={tempInitialBalance}
                onChange={(e) => setTempInitialBalance(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">定期預金</label>
              <Input
                type="number"
                value={tempFixedDeposit}
                onChange={(e) => setTempFixedDeposit(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBalanceSettings(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveBalanceSettings}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 定期預金表示ダイアログ */}
      <Dialog open={showFixedDepositDialog} onOpenChange={setShowFixedDepositDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-green-600" />
              定期預金
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300 shadow-inner">
              <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                現在残高
              </div>
              <div className="text-4xl font-bold text-green-800 tracking-tight">
                {formatCurrency(fixedDepositInfo.current_amount)}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-2">振替履歴</div>
              <div className="text-xs text-blue-700">
                初期残高: {formatCurrency(fixedDepositInfo.initial_amount || 1050000)}
              </div>
              {fixedDepositInfo.transfer_total && fixedDepositInfo.transfer_total > 0 && (
                <div className="text-xs text-blue-700 mt-1">
                  振替合計: +{formatCurrency(fixedDepositInfo.transfer_total)}
                </div>
              )}
              {fixedDepositInfo.deposits && fixedDepositInfo.deposits.length > 1 && (
                <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-blue-200">
                  振替回数: {fixedDepositInfo.deposits.filter(d => d.memo !== '初期残高').length}回
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <Info className="h-3 w-3 mt-0.5 text-gray-500" />
              <span>定期預金への振替は、入力画面の「振替」→「定期預金振替」から行えます</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFixedDepositDialog(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}