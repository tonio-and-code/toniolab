'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Printer,
  Download,
  Save,
  Plus,
  Trash2,
  FileText,
  Building,
  CheckSquare,
  Square,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InvoiceItem {
  id: string
  project_name: string
  delivery_date: string
  amount: number
  selected: boolean
}

interface SummaryInvoice {
  id?: string
  invoice_number: string
  customer_id: string
  customer_name: string
  customer_address: string
  customer_postal: string
  issue_date: string
  due_date: string
  payment_terms: string
  items: InvoiceItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
}

export default function SummaryInvoiceManager() {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null

  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [customerInvoices, setCustomerInvoices] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `SINV-${year}${month}${day}-${random}`
  }

  const [formData, setFormData] = useState<SummaryInvoice>({
    invoice_number: generateInvoiceNumber(),
    customer_id: '',
    customer_name: '',
    customer_address: '',
    customer_postal: '',
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
    payment_terms: '月末締め翌月末払い',
    items: [],
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0
  })

  // データ取得
  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerInvoices()
    }
  }, [selectedCustomer, selectedMonth])

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('customer_name')

    if (!error && data) {
      setCustomers(data)
    }
  }

  const fetchCustomerInvoices = async () => {
    try {
      // 選択された顧客名で請求書を検索（customer_nameで検索）
      const customer = customers.find(c => c.id === selectedCustomer)
      if (!customer) {
        return
      }

      // customer_nameで請求書を取得
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_name', customer.customer_name)
        .gte('issue_date', `${selectedMonth}-01`)
        .lte('issue_date', `${selectedMonth}-31`)
        .order('issue_date', { ascending: true })

      if (error) {
        // customer_idでも試す（UUIDの場合）
        const { data: invoicesByID, error: idError } = await supabase
          .from('invoices')
          .select('*')
          .eq('customer_id', selectedCustomer)
          .gte('issue_date', `${selectedMonth}-01`)
          .lte('issue_date', `${selectedMonth}-31`)
          .order('issue_date', { ascending: true })

        if (!idError && invoicesByID && invoicesByID.length > 0) {
          processInvoices(invoicesByID)
        } else {
          setCustomerInvoices([])
          toast.info('選択された月の請求書がありません')
        }
      } else if (invoices && invoices.length > 0) {
        processInvoices(invoices)
      } else {
        setCustomerInvoices([])
        toast.info('選択された月の請求書がありません')
      }
    } catch {
      setCustomerInvoices([])
      toast.error('請求書の取得中にエラーが発生しました')
    }
  }

  const processInvoices = (invoices: any[]) => {
    // 請求書データを集計用に変換
    const items: InvoiceItem[] = invoices.map(inv => ({
      id: inv.id,
      project_name: inv.delivery_date || inv.notes || '案件名未設定',
      delivery_date: inv.issue_date,
      amount: inv.total_amount || 0,
      selected: true
    }))

    setCustomerInvoices(items)

    // フォームデータを更新
    const customer = customers.find(c => c.id === selectedCustomer)
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customer_id: customer.id,
        customer_name: customer.customer_name,
        customer_address: customer.address || '',
        customer_postal: customer.postal_code || '',
        items: items
      }))
      calculateTotals(items)
    }
  }

  // 選択切り替え
  const toggleItemSelection = (index: number) => {
    const newItems = [...formData.items]
    newItems[index].selected = !newItems[index].selected
    setFormData({ ...formData, items: newItems })
    calculateTotals(newItems)
  }

  // 合計計算
  const calculateTotals = (items: InvoiceItem[]) => {
    const selectedItems = items.filter(item => item.selected)
    const subtotal = selectedItems.reduce((sum, item) => {
      // 税込み金額から税抜き金額を逆算
      const taxExcluded = Math.floor(item.amount / 1.1)
      return sum + taxExcluded
    }, 0)

    const taxAmount = selectedItems.reduce((sum, item) => {
      const taxExcluded = Math.floor(item.amount / 1.1)
      return sum + (item.amount - taxExcluded)
    }, 0)

    const totalAmount = subtotal + taxAmount

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    }))
  }

  // 保存処理
  const handleSave = async () => {
    if (!formData.customer_id) {
      toast.error('顧客を選択してください')
      return
    }

    const selectedItems = formData.items.filter(item => item.selected)
    if (selectedItems.length === 0) {
      toast.error('請求項目を選択してください')
      return
    }

    try {
      // 合計請求書を保存
      const invoiceData = {
        invoice_number: formData.invoice_number,
        customer_id: formData.customer_id,
        customer_name: formData.customer_name,
        customer_address: formData.customer_address,
        customer_postal: formData.customer_postal,
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        payment_terms: formData.payment_terms,
        delivery_date: `${selectedMonth} 合計請求`,
        subtotal: formData.subtotal,
        tax_amount: formData.tax_amount,
        total_amount: formData.total_amount,
        status: 'sent',
        payment_status: 'unpaid',
        notes: `含まれる案件: ${selectedItems.map(item => item.project_name).join(', ')}`
      }

      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single()

      if (error) throw error

      // 明細を保存
      const itemsToSave = selectedItems.map((item, index) => ({
        invoice_id: data.id,
        item_order: index + 1,
        item_name: item.project_name,
        description: `発行日: ${format(new Date(item.delivery_date), 'yyyy/MM/dd')}`,
        quantity: 1,
        unit: '式',
        unit_price: Math.floor(item.amount / 1.1), // 税抜き金額
        amount: Math.floor(item.amount / 1.1),
        tax_rate: 10,
        notes: ''
      }))

      if (itemsToSave.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsToSave)

        if (itemsError) throw itemsError
      }

      toast.success('合計請求書を保存しました')
      setIsDialogOpen(false)
      resetForm()
    } catch {
      toast.error('保存中にエラーが発生しました')
    }
  }

  // フォームリセット
  const resetForm = () => {
    setFormData({
      invoice_number: generateInvoiceNumber(),
      customer_id: '',
      customer_name: '',
      customer_address: '',
      customer_postal: '',
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
      payment_terms: '月末締め翌月末払い',
      items: [],
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0
    })
    setSelectedCustomer('')
    setCustomerInvoices([])
  }

  // PDF生成
  const generatePDF = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const selectedItems = formData.items.filter(item => item.selected)

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <title>合計請求書_${formData.invoice_number}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: "MS Mincho", "MS 明朝", serif;
              line-height: 1.6;
              color: #000;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              margin-bottom: 30px;
            }
            .title {
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
              letter-spacing: 4px;
            }
            .customer-info {
              margin-bottom: 20px;
            }
            .customer-name {
              font-size: 18px;
              border-bottom: 1px solid #000;
              display: inline-block;
              padding-bottom: 2px;
              margin-bottom: 10px;
            }
            .summary {
              margin-bottom: 20px;
              padding: 10px;
              background: #f5f5f5;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items-table th {
              border: 1px solid #333;
              padding: 8px;
              background: #f0f0f0;
              text-align: left;
              font-weight: normal;
            }
            .items-table td {
              border: 1px solid #333;
              padding: 6px 8px;
            }
            .items-table .amount {
              text-align: right;
            }
            .totals {
              text-align: right;
              margin-top: 20px;
            }
            .totals-table {
              margin-left: auto;
              border-collapse: collapse;
            }
            .totals-table td {
              border: 1px solid #333;
              padding: 8px 15px;
            }
            .totals-table .label {
              background: #f0f0f0;
            }
            .bank-info {
              margin-top: 30px;
              padding: 15px;
              border: 1px solid #666;
              background: #fafafa;
            }
            .company-info {
              margin-top: 30px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="title">御 請 求 書</h1>

            <div class="header">
              <div style="text-align: right; margin-bottom: 10px;">
                No. ${formData.invoice_number}
              </div>
              <div style="text-align: right; margin-bottom: 20px;">
                発行日: ${format(new Date(formData.issue_date), 'yyyy年MM月dd日')}
              </div>
            </div>

            <div class="customer-info">
              <div style="font-size: 10px;">${formData.customer_postal ? '〒' + formData.customer_postal : ''}</div>
              <div style="font-size: 10px; margin-bottom: 5px;">${formData.customer_address}</div>
              <div class="customer-name">${formData.customer_name} 御中</div>
            </div>

            <div class="summary">
              <p>下記の通り、${selectedMonth}分の御請求を申し上げます。</p>
              <div style="font-size: 20px; font-weight: bold; margin-top: 10px;">
                合計請求金額: ¥${formData.total_amount.toLocaleString()} (税込)
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 8%">No.</th>
                  <th style="width: 60%">案件名</th>
                  <th style="width: 16%">発行日</th>
                  <th style="width: 16%">金額(税込)</th>
                </tr>
              </thead>
              <tbody>
                ${selectedItems.map((item, index) => `
                  <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${item.project_name}</td>
                    <td style="text-align: center;">${format(new Date(item.delivery_date), 'MM/dd')}</td>
                    <td class="amount">¥${item.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <table class="totals-table">
                <tr>
                  <td class="label">小計(税抜)</td>
                  <td style="text-align: right; width: 150px;">¥${formData.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td class="label">消費税(10%)</td>
                  <td style="text-align: right;">¥${formData.tax_amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td class="label" style="font-weight: bold;">合計金額</td>
                  <td style="text-align: right; font-weight: bold;">¥${formData.total_amount.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div class="bank-info">
              <p style="margin-bottom: 5px;">お支払いにつきましては、下記口座へお振込みくださいますようお願い申し上げます。</p>
              <p>振込先：りそな銀行 神田支店（276）普通 1020315</p>
              <p style="margin-top: 5px;">支払期限: ${format(new Date(formData.due_date), 'yyyy年MM月dd日')}</p>
            </div>

            <div class="company-info">
              <div style="font-size: 16px; margin-bottom: 5px;">有限会社イワサキ内装</div>
              <div style="font-size: 10px;">〒130-0021</div>
              <div style="font-size: 10px;">東京都墨田区緑1丁目-24-2タカミビル101</div>
              <div style="font-size: 10px;">登録番号：T6010602034026</div>
              <div style="font-size: 10px;">TEL:03-5638-7402　FAX:03-5638-7403</div>
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">合計請求書作成</h2>
        <Button
          onClick={() => router?.push('/invoices')}
          variant="outline"
        >
          <X className="mr-2 h-4 w-4" />
          閉じる
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">対象月</label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">顧客選択</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="顧客を選択" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setIsDialogOpen(true)}
                disabled={!selectedCustomer || customerInvoices.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="mr-2 h-4 w-4" />
                合計請求書を作成
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 請求書一覧 */}
      {customerInvoices.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">対象請求書一覧</h3>
            <div className="space-y-2">
              {customerInvoices.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const newItems = [...customerInvoices]
                        newItems[index].selected = !newItems[index].selected
                        setCustomerInvoices(newItems)
                        setFormData({ ...formData, items: newItems })
                        calculateTotals(newItems)
                      }}
                      className="text-blue-600"
                    >
                      {item.selected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                    </button>
                    <div>
                      <div className="font-medium">{item.project_name}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(item.delivery_date), 'yyyy/MM/dd')}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    ¥{item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* 合計表示 */}
            <div className="mt-4 pt-4 border-t">
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  選択件数: {customerInvoices.filter(i => i.selected).length}件
                </div>
                <div className="text-xl font-bold mt-2">
                  合計: ¥{formData.total_amount.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* プレビューダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>合計請求書プレビュー</DialogTitle>
          </DialogHeader>

          <div ref={invoiceRef} className="bg-white p-8">
            <h1 className="text-2xl text-center mb-6 tracking-widest">御請求書</h1>

            <div className="text-right mb-4">
              <div className="text-sm">No. {formData.invoice_number}</div>
              <div className="text-sm">発行日: {format(new Date(formData.issue_date), 'yyyy年MM月dd日')}</div>
            </div>

            <div className="mb-6">
              <div className="text-xs">{formData.customer_postal && `〒${formData.customer_postal}`}</div>
              <div className="text-xs mb-1">{formData.customer_address}</div>
              <div className="text-lg border-b border-black inline-block pb-1">
                {formData.customer_name} 御中
              </div>
            </div>

            <div className="bg-gray-100 p-4 mb-6 rounded">
              <p>下記の通り、{selectedMonth}分の御請求を申し上げます。</p>
              <div className="text-xl font-bold mt-2">
                合計請求金額: ¥{formData.total_amount.toLocaleString()} (税込)
              </div>
            </div>

            <table className="w-full mb-6">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-600">
                  <th className="text-left p-2 w-12">No.</th>
                  <th className="text-left p-2">案件名</th>
                  <th className="text-center p-2 w-24">発行日</th>
                  <th className="text-right p-2 w-32">金額(税込)</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.filter(item => item.selected).map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">{item.project_name}</td>
                    <td className="p-2 text-center">
                      {format(new Date(item.delivery_date), 'MM/dd')}
                    </td>
                    <td className="p-2 text-right">¥{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-6">
              <table className="w-64">
                <tr>
                  <td className="border p-2 bg-gray-100">小計(税抜)</td>
                  <td className="border p-2 text-right">¥{formData.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-100">消費税(10%)</td>
                  <td className="border p-2 text-right">¥{formData.tax_amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border p-2 bg-gray-100 font-bold">合計金額</td>
                  <td className="border p-2 text-right font-bold">¥{formData.total_amount.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div className="border p-4 bg-gray-50">
              <p className="text-sm mb-2">お支払いにつきましては、下記口座へお振込みくださいますようお願い申し上げます。</p>
              <p className="text-sm">振込先：りそな銀行 神田支店（276）普通 1020315</p>
              <p className="text-sm mt-2">支払期限: {format(new Date(formData.due_date), 'yyyy年MM月dd日')}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-2">
              <Button onClick={generatePDF} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                印刷・PDF
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                キャンセル
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}