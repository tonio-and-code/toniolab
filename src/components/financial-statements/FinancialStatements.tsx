'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { FileText, TrendingUp, Calculator, Building2, PenTool, Package, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AccountBalance {
  code: string
  name: string
  category: string
  account_type: string
  total_debit: number
  total_credit: number
  balance: number
}

interface FinancialStatementItem {
  item_code: string
  item_name: string
  item_level: number
  account_codes: string[] | null
  display_order: number
  is_total: boolean
  amount?: number
}

interface TaxCalculation {
  tax_type: string
  taxable_income: number
  tax_rate: number
  calculated_tax: number
  final_tax: number
}

interface FixedAsset {
  asset_name: string
  acquisition_cost: number
  accumulated_depreciation: number
  book_value: number
}

export function FinancialStatements() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('7')
  const [selectedTab, setSelectedTab] = useState('pl')
  const [trialBalance, setTrialBalance] = useState<AccountBalance[]>([])
  const [plItems, setPlItems] = useState<FinancialStatementItem[]>([])
  const [bsItems, setBsItems] = useState<FinancialStatementItem[]>([])
  const [taxCalculations, setTaxCalculations] = useState<TaxCalculation[]>([])
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccountingData, setHasAccountingData] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAccountingData()
  }, [])

  useEffect(() => {
    if (hasAccountingData) {
      fetchFinancialData()
    } else {
      fetchLegacyData()
    }
  }, [selectedYear, selectedMonth, hasAccountingData])

  const checkAccountingData = async () => {
    // 新しい会計テーブルが存在するか確認
    const { data, error } = await supabase
      .from('account_codes')
      .select('code')
      .limit(1)

    if (!error && data && data.length > 0) {
      setHasAccountingData(true)
    }
  }

  const fetchFinancialData = async () => {
    setLoading(true)

    const startDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`
    const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0)
      .toISOString().split('T')[0]

    try {
      // 試算表データの取得
      const { data: balanceData, error: balanceError } = await supabase
        .from('trial_balance')
        .select('*')
        .order('code')

      if (!balanceError && balanceData) {
        setTrialBalance(balanceData)
      }

      // 財務諸表テンプレートの取得
      const { data: plTemplate } = await supabase
        .from('financial_statement_templates')
        .select('*')
        .eq('statement_type', 'PL')
        .order('display_order')

      const { data: bsTemplate } = await supabase
        .from('financial_statement_templates')
        .select('*')
        .eq('statement_type', 'BS')
        .order('display_order')

      // 金額の計算
      if (plTemplate && balanceData) {
        const plWithAmounts = calculateStatementAmounts(plTemplate, balanceData)
        setPlItems(plWithAmounts)
      }

      if (bsTemplate && balanceData) {
        const bsWithAmounts = calculateStatementAmounts(bsTemplate, balanceData)
        setBsItems(bsWithAmounts)
      }

      // 税額計算データの取得
      const { data: taxData } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('fiscal_year', selectedYear)

      if (taxData) {
        setTaxCalculations(taxData)
      }

      // 固定資産データの取得
      const { data: assetData } = await supabase
        .from('fixed_assets')
        .select(`
          *,
          depreciation_schedule (
            accumulated_depreciation,
            ending_book_value
          )
        `)
        .eq('is_active', true)

      if (assetData) {
        const assetsWithDepreciation = assetData.map(asset => ({
          asset_name: asset.asset_name,
          acquisition_cost: asset.acquisition_cost,
          accumulated_depreciation: asset.depreciation_schedule?.[0]?.accumulated_depreciation || 0,
          book_value: asset.depreciation_schedule?.[0]?.ending_book_value || asset.acquisition_cost
        }))
        setFixedAssets(assetsWithDepreciation)
      }
    } catch {
      // Failed to fetch financial data
    }

    setLoading(false)
  }

  const calculateStatementAmounts = (
    template: FinancialStatementItem[],
    balances: AccountBalance[]
  ): FinancialStatementItem[] => {
    return template.map(item => {
      let amount = 0

      if (item.account_codes && item.account_codes.length > 0) {
        // 関連勘定科目の残高を合計
        amount = item.account_codes.reduce((sum, code) => {
          const account = balances.find(b => b.code === code)
          return sum + (account?.balance || 0)
        }, 0)
      } else if (item.is_total) {
        // 合計行の場合は別途計算（実装省略）
        // 実際には親項目の合計を計算する処理が必要
      }

      return { ...item, amount }
    })
  }

  const fetchLegacyData = async () => {
    setLoading(true)
    
    // 従来のプロジェクトベースのデータを取得（新システム移行前の暫定処理）
    const startDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`
    const endDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-31`

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)

    if (projectsData) {
      // 簡易的な試算表データを生成
      const simplifiedBalance: AccountBalance[] = [
        {
          code: '1210',
          name: '売掛金',
          category: '資産',
          account_type: '借方',
          total_debit: projectsData.reduce((sum, p) => sum + (p.receivable_amount || 0), 0),
          total_credit: 0,
          balance: projectsData.reduce((sum, p) => sum + (p.receivable_amount || 0), 0)
        },
        {
          code: '6110',
          name: '売上高',
          category: '収益',
          account_type: '貸方',
          total_debit: 0,
          total_credit: projectsData.reduce((sum, p) => sum + (p.receivable_amount || 0), 0),
          balance: projectsData.reduce((sum, p) => sum + (p.receivable_amount || 0), 0)
        }
      ]
      setTrialBalance(simplifiedBalance)
    }

    setLoading(false)
  }

  // 損益計算書の計算（新システム）
  const calculatePL = () => {
    if (hasAccountingData && plItems.length > 0) {
      const revenue = plItems.find(i => i.item_code === 'P100')?.amount || 0
      const cogs = plItems.find(i => i.item_code === 'P200')?.amount || 0
      const grossProfit = revenue - cogs
      const operatingExpenses = plItems.find(i => i.item_code === 'P400')?.amount || 0
      const operatingIncome = grossProfit - operatingExpenses
      const nonOperatingIncome = plItems.find(i => i.item_code === 'P610')?.amount || 0
      const nonOperatingExpenses = plItems.find(i => i.item_code === 'P620')?.amount || 0
      const ordinaryIncome = operatingIncome + nonOperatingIncome - nonOperatingExpenses
      const tax = taxCalculations.find(t => t.tax_type === '法人税')?.final_tax || 0
      const netIncome = ordinaryIncome - tax

      return {
        revenue,
        cogs,
        grossProfit,
        totalOperatingExpenses: operatingExpenses,
        operatingIncome,
        otherIncome: nonOperatingIncome,
        otherExpenses: nonOperatingExpenses,
        ordinaryIncome,
        incomeBeforeTax: ordinaryIncome,
        tax,
        netIncome
      }
    }

    // 従来の計算ロジック（フォールバック）
    const revenue = trialBalance
      .filter(a => a.code === '6110' || a.code === '6120')
      .reduce((sum, a) => sum + a.balance, 0)
    const cogs = trialBalance
      .filter(a => a.code.startsWith('71'))
      .reduce((sum, a) => sum + a.balance, 0)
    const grossProfit = revenue - cogs
    const totalOperatingExpenses = trialBalance
      .filter(a => a.code.startsWith('81') || a.code.startsWith('82') || a.code.startsWith('83'))
      .reduce((sum, a) => sum + a.balance, 0)
    const operatingIncome = grossProfit - totalOperatingExpenses
    const otherIncome = trialBalance
      .filter(a => a.code.startsWith('62'))
      .reduce((sum, a) => sum + a.balance, 0)
    const otherExpenses = trialBalance
      .filter(a => a.code.startsWith('84'))
      .reduce((sum, a) => sum + a.balance, 0)
    const ordinaryIncome = operatingIncome + otherIncome - otherExpenses
    const incomeBeforeTax = ordinaryIncome
    const tax = Math.max(0, Math.floor(incomeBeforeTax * 0.232))
    const netIncome = incomeBeforeTax - tax

    return {
      revenue,
      cogs,
      grossProfit,
      totalOperatingExpenses,
      operatingIncome,
      otherIncome,
      otherExpenses: otherExpenses || 0,
      ordinaryIncome,
      incomeBeforeTax,
      tax,
      netIncome
    }
  }

  // 貸借対照表の計算（新システム）
  const calculateBS = () => {
    if (hasAccountingData && bsItems.length > 0) {
      // 流動資産
      const cashAndDeposits = bsItems.find(i => i.item_code === 'A111')?.amount || 0
      const accountsReceivable = bsItems.find(i => i.item_code === 'A112')?.amount || 0
      const inventory = bsItems.find(i => i.item_code === 'A113')?.amount || 0
      const currentAssets = bsItems.find(i => i.item_code === 'A119')?.amount ||
        (cashAndDeposits + accountsReceivable + inventory)

      // 固定資産
      const tangibleAssets = bsItems.find(i => i.item_code === 'A121')?.amount || 0
      const intangibleAssets = bsItems.find(i => i.item_code === 'A122')?.amount || 0
      const fixedAssets = bsItems.find(i => i.item_code === 'A129')?.amount ||
        (tangibleAssets + intangibleAssets)

      // 資産合計
      const totalAssets = currentAssets + fixedAssets

      // 流動負債
      const accountsPayable = bsItems.find(i => i.item_code === 'L111')?.amount || 0
      const shortTermDebt = bsItems.find(i => i.item_code === 'L112')?.amount || 0
      const accruedExpenses = bsItems.find(i => i.item_code === 'L113')?.amount || 0
      const incomeTaxPayable = bsItems.find(i => i.item_code === 'L114')?.amount || 0
      const currentLiabilities = bsItems.find(i => i.item_code === 'L119')?.amount ||
        (accountsPayable + shortTermDebt + accruedExpenses + incomeTaxPayable)

      // 固定負債
      const longTermDebt = bsItems.find(i => i.item_code === 'L121')?.amount || 0

      // 負債合計
      const totalLiabilities = currentLiabilities + longTermDebt

      // 純資産
      const equity = totalAssets - totalLiabilities

      return {
        cashAndDeposits,
        accountsReceivable,
        inventory,
        currentAssets,
        tangibleAssets,
        intangibleAssets,
        fixedAssets,
        totalAssets,
        accountsPayable,
        shortTermDebt,
        accruedExpenses,
        incomeTaxPayable,
        currentLiabilities,
        longTermDebt,
        totalLiabilities,
        equity
      }
    }

    // 従来の計算ロジック（フォールバック）
    const cashAndDeposits = trialBalance
      .filter(a => a.code.startsWith('11') && a.code <= '1140')
      .reduce((sum, a) => sum + a.balance, 0) || 3000000
    const accountsReceivable = trialBalance
      .filter(a => a.code === '1210' || a.code === '1220')
      .reduce((sum, a) => sum + a.balance, 0)
    const inventory = trialBalance
      .filter(a => a.code.startsWith('13'))
      .reduce((sum, a) => sum + a.balance, 0)
    const currentAssets = cashAndDeposits + accountsReceivable + inventory

    const tangibleAssets = trialBalance
      .filter(a => a.code.startsWith('21'))
      .reduce((sum, a) => sum + a.balance, 0)
    const intangibleAssets = trialBalance
      .filter(a => a.code.startsWith('22'))
      .reduce((sum, a) => sum + a.balance, 0)
    const fixedAssets = tangibleAssets + intangibleAssets || 500000

    const totalAssets = currentAssets + fixedAssets

    const accountsPayable = trialBalance
      .filter(a => a.code === '3110' || a.code === '3120')
      .reduce((sum, a) => sum + a.balance, 0)
    const shortTermDebt = trialBalance
      .filter(a => a.code === '3130')
      .reduce((sum, a) => sum + a.balance, 0)
    const accruedExpenses = trialBalance
      .filter(a => a.code === '3210' || a.code === '3220')
      .reduce((sum, a) => sum + a.balance, 0)
    const incomeTaxPayable = trialBalance
      .filter(a => a.code === '3230')
      .reduce((sum, a) => sum + a.balance, 0)
    const currentLiabilities = accountsPayable + shortTermDebt + accruedExpenses + incomeTaxPayable

    const longTermDebt = trialBalance
      .filter(a => a.code === '4110')
      .reduce((sum, a) => sum + a.balance, 0)

    const totalLiabilities = currentLiabilities + longTermDebt
    const equity = totalAssets - totalLiabilities

    return {
      cashAndDeposits,
      accountsReceivable,
      inventory: inventory || 0,
      currentAssets,
      tangibleAssets: tangibleAssets || 0,
      intangibleAssets: intangibleAssets || 0,
      fixedAssets,
      totalAssets,
      accountsPayable,
      shortTermDebt: shortTermDebt || 0,
      accruedExpenses: accruedExpenses || 0,
      incomeTaxPayable: incomeTaxPayable || 0,
      currentLiabilities,
      longTermDebt,
      totalLiabilities,
      equity
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const pl = calculatePL()
  const bs = calculateBS()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">財務諸表</h1>
            <p className="text-muted-foreground">
              {hasAccountingData ? '複式簿記システムから生成' : '簡易版（プロジェクトデータから生成）'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/fiscal-report')}
              variant="default"
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              第31期決算書
            </Button>
            <Button
              onClick={() => router.push('/journal-entries')}
              variant="outline"
              className="gap-2"
            >
              <PenTool className="w-4 h-4" />
              仕訳入力
            </Button>
            <Button
              onClick={() => router.push('/fixed-assets')}
              variant="outline"
              className="gap-2"
            >
              <Package className="w-4 h-4" />
              固定資産管理
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024年</SelectItem>
            <SelectItem value="2025">2025年</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}月
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => {
            if (hasAccountingData) {
              fetchFinancialData()
            } else {
              fetchLegacyData()
            }
          }}
          variant="outline"
        >
          更新
        </Button>
      </div>

      {hasAccountingData && (
        <div className="space-y-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="grid grid-cols-4 w-[600px]">
              <TabsTrigger value="pl">損益計算書</TabsTrigger>
              <TabsTrigger value="bs">貸借対照表</TabsTrigger>
              <TabsTrigger value="trial">試算表</TabsTrigger>
              <TabsTrigger value="tax">税額計算</TabsTrigger>
            </TabsList>
          </Tabs>

          {!trialBalance.length && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>データがありません。</strong>
                まず「仕訳入力」から取引を記録してください。
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 損益計算書 */}
        <Card>
          <CardHeader>
            <CardTitle>損益計算書</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedYear}年{selectedMonth}月
            </p>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <tbody className="divide-y">
                <tr className="flex justify-between py-2">
                  <td className="font-medium">売上高</td>
                  <td className="text-right">{formatCurrency(pl.revenue)}</td>
                </tr>
                <tr className="flex justify-between py-2">
                  <td className="font-medium">売上原価</td>
                  <td className="text-right">{formatCurrency(pl.cogs)}</td>
                </tr>
                <tr className="flex justify-between py-2 bg-muted/50">
                  <td className="font-semibold">売上総利益</td>
                  <td className="text-right font-semibold">{formatCurrency(pl.grossProfit)}</td>
                </tr>
                <tr className="flex justify-between py-2">
                  <td className="font-medium">販売費及び一般管理費</td>
                  <td className="text-right">{formatCurrency(pl.totalOperatingExpenses)}</td>
                </tr>
                <tr className="flex justify-between py-2 bg-muted/50">
                  <td className="font-semibold">営業利益</td>
                  <td className="text-right font-semibold">{formatCurrency(pl.operatingIncome)}</td>
                </tr>
                <tr className="flex justify-between py-2">
                  <td className="font-medium">営業外収益</td>
                  <td className="text-right">{formatCurrency(pl.otherIncome)}</td>
                </tr>
                <tr className="flex justify-between py-2">
                  <td className="font-medium">営業外費用</td>
                  <td className="text-right">{formatCurrency(pl.otherExpenses)}</td>
                </tr>
                <tr className="flex justify-between py-2 bg-muted/50">
                  <td className="font-semibold">経常利益</td>
                  <td className="text-right font-semibold">{formatCurrency(pl.ordinaryIncome)}</td>
                </tr>
                <tr className="flex justify-between py-2">
                  <td className="font-medium">税引前当期純利益</td>
                  <td className="text-right">{formatCurrency(pl.incomeBeforeTax)}</td>
                </tr>
                <tr className="flex justify-between py-2">
                  <td className="font-medium">法人税等</td>
                  <td className="text-right">{formatCurrency(pl.tax)}</td>
                </tr>
                <tr className="flex justify-between py-2 bg-primary/10">
                  <td className="font-bold">当期純利益</td>
                  <td className="text-right font-bold">{formatCurrency(pl.netIncome)}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* 貸借対照表 */}
        <Card>
          <CardHeader>
            <CardTitle>貸借対照表</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedYear}年{selectedMonth}月末
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 資産の部 */}
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">資産の部</h4>
                <table className="w-full">
                  <tbody className="divide-y">
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">現金預金</td>
                      <td className="text-right text-sm">{formatCurrency(bs.cashAndDeposits)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">売掛金</td>
                      <td className="text-right text-sm">{formatCurrency(bs.accountsReceivable)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">棚卸資産</td>
                      <td className="text-right text-sm">{formatCurrency(bs.inventory)}</td>
                    </tr>
                    <tr className="flex justify-between py-1 font-medium">
                      <td>流動資産合計</td>
                      <td className="text-right">{formatCurrency(bs.currentAssets)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">有形固定資産</td>
                      <td className="text-right text-sm">{formatCurrency(bs.tangibleAssets)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">無形固定資産</td>
                      <td className="text-right text-sm">{formatCurrency(bs.intangibleAssets)}</td>
                    </tr>
                    <tr className="flex justify-between py-1 font-medium">
                      <td>固定資産合計</td>
                      <td className="text-right">{formatCurrency(bs.fixedAssets)}</td>
                    </tr>
                    <tr className="flex justify-between py-2 bg-muted/50">
                      <td className="font-semibold">資産合計</td>
                      <td className="text-right font-semibold">{formatCurrency(bs.totalAssets)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 負債の部 */}
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">負債の部</h4>
                <table className="w-full">
                  <tbody className="divide-y">
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">買掛金</td>
                      <td className="text-right text-sm">{formatCurrency(bs.accountsPayable)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">短期借入金</td>
                      <td className="text-right text-sm">{formatCurrency(bs.shortTermDebt)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">未払費用</td>
                      <td className="text-right text-sm">{formatCurrency(bs.accruedExpenses)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">未払法人税等</td>
                      <td className="text-right text-sm">{formatCurrency(bs.incomeTaxPayable)}</td>
                    </tr>
                    <tr className="flex justify-between py-1 font-medium">
                      <td>流動負債合計</td>
                      <td className="text-right">{formatCurrency(bs.currentLiabilities)}</td>
                    </tr>
                    <tr className="flex justify-between py-1">
                      <td className="text-sm">長期借入金</td>
                      <td className="text-right text-sm">{formatCurrency(bs.longTermDebt)}</td>
                    </tr>
                    <tr className="flex justify-between py-2 bg-muted/50">
                      <td className="font-semibold">負債合計</td>
                      <td className="text-right font-semibold">{formatCurrency(bs.totalLiabilities)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 純資産の部 */}
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">純資産の部</h4>
                <table className="w-full">
                  <tbody>
                    <tr className="flex justify-between py-2 bg-primary/10">
                      <td className="font-bold">純資産合計</td>
                      <td className="text-right font-bold">{formatCurrency(bs.equity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 負債・純資産合計 */}
              <div>
                <table className="w-full">
                  <tbody>
                    <tr className="flex justify-between py-2 border-t-2 border-primary">
                      <td className="font-bold">負債・純資産合計</td>
                      <td className="text-right font-bold">{formatCurrency(bs.totalAssets)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 試算表タブ（新システムのみ） */}
      {hasAccountingData && selectedTab === 'trial' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              試算表
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedYear}年{selectedMonth}月末
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">勘定科目</th>
                    <th className="text-right py-2 px-4">借方残高</th>
                    <th className="text-right py-2 px-4">貸方残高</th>
                    <th className="text-right py-2 px-4">残高</th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalance.map(account => (
                    <tr key={account.code} className="border-b hover:bg-muted/50">
                      <td className="py-2">
                        <span className="text-xs text-muted-foreground mr-2">{account.code}</span>
                        {account.name}
                      </td>
                      <td className="text-right py-2 px-4">
                        {account.account_type === '借方' && account.balance > 0
                          ? formatCurrency(account.balance)
                          : '-'}
                      </td>
                      <td className="text-right py-2 px-4">
                        {account.account_type === '貸方' && account.balance > 0
                          ? formatCurrency(account.balance)
                          : '-'}
                      </td>
                      <td className="text-right py-2 px-4 font-medium">
                        {formatCurrency(Math.abs(account.balance))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td className="py-2">合計</td>
                    <td className="text-right py-2 px-4">
                      {formatCurrency(
                        trialBalance
                          .filter(a => a.account_type === '借方' && a.balance > 0)
                          .reduce((sum, a) => sum + a.balance, 0)
                      )}
                    </td>
                    <td className="text-right py-2 px-4">
                      {formatCurrency(
                        trialBalance
                          .filter(a => a.account_type === '貸方' && a.balance > 0)
                          .reduce((sum, a) => sum + a.balance, 0)
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 税額計算タブ（新システムのみ） */}
      {hasAccountingData && selectedTab === 'tax' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              税額計算書
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedYear}年度
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {taxCalculations.map(tax => (
                <div key={tax.tax_type} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">{tax.tax_type}</h4>
                  <table className="w-full">
                    <tbody className="divide-y">
                      <tr className="flex justify-between py-2">
                        <td>課税所得</td>
                        <td className="text-right">{formatCurrency(tax.taxable_income)}</td>
                      </tr>
                      <tr className="flex justify-between py-2">
                        <td>税率</td>
                        <td className="text-right">{(tax.tax_rate * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="flex justify-between py-2">
                        <td>算出税額</td>
                        <td className="text-right">{formatCurrency(tax.calculated_tax)}</td>
                      </tr>
                      <tr className="flex justify-between py-2 font-bold bg-muted/50">
                        <td>確定税額</td>
                        <td className="text-right">{formatCurrency(tax.final_tax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}

              {/* 固定資産一覧 */}
              {fixedAssets.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">固定資産一覧</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">資産名</th>
                        <th className="text-right py-2">取得価額</th>
                        <th className="text-right py-2">償却累計</th>
                        <th className="text-right py-2">簿価</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fixedAssets.map((asset, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{asset.asset_name}</td>
                          <td className="text-right py-2">{formatCurrency(asset.acquisition_cost)}</td>
                          <td className="text-right py-2">{formatCurrency(asset.accumulated_depreciation)}</td>
                          <td className="text-right py-2">{formatCurrency(asset.book_value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}