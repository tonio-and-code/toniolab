'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import '../styles/print.css'
import {
  Printer,
  Save,
  Plus,
  Trash2,
  Edit,
  FileText,
  Search,
  Building,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
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
import { ProjectSelect } from '@/components/ui/project-select'

interface InvoiceItem {
  id?: string
  item_order: number
  item_name: string
  description?: string
  quantity: number | null
  unit: string | null
  unit_price: number | null
  amount: number
  tax_rate?: number
  notes?: string
}

interface Invoice {
  id?: string
  invoice_number: string
  project_id?: string
  customer_id?: string
  quotation_id?: string
  issue_date: string
  due_date?: string
  customer_name: string
  customer_address: string
  customer_postal?: string
  payment_terms: string
  delivery_date: string
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_status?: string
  status?: string
  paid_date?: string
  notes?: string
  items?: InvoiceItem[]
}

interface Props {
  projectId?: string
  editId?: string
  quotationId?: string
}

export default function InvoicesManagerV3({ projectId, editId, quotationId }: Props) {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // 請求番号の自動生成
  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}${day}-${random}`
  }

  // フォームの状態（見積書と同じ構造）
  const [formData, setFormData] = useState<Invoice>({
    invoice_number: generateInvoiceNumber(),
    project_id: projectId || '',
    customer_id: '',
    quotation_id: '',
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
    customer_name: '',
    customer_address: '',
    customer_postal: '',
    payment_terms: '月末締め翌月末払い',
    delivery_date: '',
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0,
    notes: '',
    items: Array(20).fill(null).map((_, index) => ({
      item_order: index + 1,
      item_name: '',
      description: '',
      quantity: null,
      unit: null,
      unit_price: null,
      amount: 0,
      tax_rate: 10,
      notes: ''
    }))
  })

  // 小計・税額の状態
  const [subtotal10, setSubtotal10] = useState(0)
  const [tax10, setTax10] = useState(0)
  const [subtotal8, setSubtotal8] = useState(0)
  const [tax8, setTax8] = useState(0)
  const [subtotal0, setSubtotal0] = useState(0)

  // データ取得
  useEffect(() => {
    fetchInvoices()
    fetchCustomers()
    fetchProjects()
  }, [projectId])

  const fetchInvoices = async () => {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (!error && data) {
      const formattedData = data.map(inv => ({
        ...inv,
        items: inv.invoice_items || []
      }))
      setInvoices(formattedData)
    }
  }

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('customer_name')

    if (!error && data) {
      setCustomers(data)
    }
  }

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && projectsData) {
        setProjects(projectsData)
      }
    } catch {
      // Failed to fetch projects
    }
  }

  // 月の選択肢を取得
  const getAvailableMonths = () => {
    const months = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(format(date, 'yyyy-MM'))
    }
    for (let i = 1; i <= 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      months.push(format(date, 'yyyy-MM'))
    }
    return months
  }

  // フィルタリング
  const filteredInvoices = invoices.filter(invoice => {
    const matchesMonth = invoice.issue_date.startsWith(selectedMonth)
    const matchesSearch = searchTerm === '' ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesMonth && matchesSearch
  })

  // 案件選択時の処理
  const handleProjectSelect = (projectId: string) => {
    const project = projects.find((p: any) => p.id === projectId)
    if (project) {
      setFormData({
        ...formData,
        project_id: projectId,
        customer_id: project.customer_id || '',
        customer_name: project.customer_name || '',
        customer_address: project.customer?.address || '',
        customer_postal: project.customer?.postal_code || '',
        delivery_date: project.project_name || ''
      })
    }
  }

  // 顧客選択時の処理
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      setFormData({
        ...formData,
        customer_id: customerId,
        customer_name: customer.customer_name,
        customer_address: customer.address || '',
        customer_postal: customer.postal_code || ''
      })
    }
  }

  // 明細行の更新
  const updateItem = (index: number, field: string, value: any) => {
    if (!formData.items) return
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // 金額の自動計算
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? Number(value) || 0 : Number(newItems[index].quantity) || 0
      const unitPrice = field === 'unit_price' ? Number(value) || 0 : Number(newItems[index].unit_price) || 0
      newItems[index].amount = quantity * unitPrice
    }

    setFormData({ ...formData, items: newItems })
    calculateTotals(newItems)
  }

  // 合計計算
  const calculateTotals = (items: InvoiceItem[]) => {
    let sub10 = 0
    let sub8 = 0
    let sub0 = 0

    items.forEach(item => {
      const amount = Number(item.amount) || 0
      const taxRate = item.tax_rate || 10

      if (taxRate === 10) {
        sub10 += amount
      } else if (taxRate === 8) {
        sub8 += amount
      } else if (taxRate === 0) {
        sub0 += amount
      }
    })

    const t10 = Math.floor(sub10 * 0.1)
    const t8 = Math.floor(sub8 * 0.08)

    setSubtotal10(sub10)
    setTax10(t10)
    setSubtotal8(sub8)
    setTax8(t8)
    setSubtotal0(sub0)

    const subtotal = sub10 + sub8 + sub0
    const taxAmount = t10 + t8
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
    if (!formData.project_id) {
      toast.error('案件を選択してください')
      return
    }

    try {
      // 請求書データの保存
      const invoiceData = {
        invoice_number: formData.invoice_number,
        project_id: formData.project_id || null,
        customer_id: formData.customer_id || null,
        quotation_id: formData.quotation_id || null,
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        customer_name: formData.customer_name,
        customer_address: formData.customer_address,
        customer_postal: formData.customer_postal,
        payment_terms: formData.payment_terms,
        delivery_date: formData.delivery_date,
        subtotal: formData.subtotal,
        tax_amount: formData.tax_amount,
        total_amount: formData.total_amount,
        payment_status: 'unpaid',
        status: 'sent',
        notes: formData.notes
      }

      let invoiceId: string

      if (selectedInvoice?.id) {
        // 更新
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', selectedInvoice.id)

        if (error) throw error
        invoiceId = selectedInvoice.id

        // 既存の明細を削除
        await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', invoiceId)
      } else {
        // 新規作成
        const { data, error } = await supabase
          .from('invoices')
          .insert(invoiceData)
          .select()
          .single()

        if (error) throw error
        invoiceId = data.id
      }

      // 明細の保存
      const itemsToSave = (formData.items || [])
        .filter(item => item.item_name)
        .map(item => ({
          invoice_id: invoiceId,
          item_order: item.item_order,
          item_name: item.item_name,
          description: item.description || '',
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          amount: item.amount,
          tax_rate: item.tax_rate || 10,
          notes: item.notes || ''
        }))

      if (itemsToSave.length > 0) {
        const { error } = await supabase
          .from('invoice_items')
          .insert(itemsToSave)

        if (error) throw error
      }

      toast.success('請求書を保存しました')
      await fetchInvoices()
      setIsDialogOpen(false)
      resetForm()
    } catch {
      toast.error('保存中にエラーが発生しました')
    }
  }

  // フォームリセット
  const resetForm = () => {
    setSelectedInvoice(null)
    setFormData({
      invoice_number: generateInvoiceNumber(),
      project_id: projectId || '',
      customer_id: '',
      quotation_id: '',
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
      customer_name: '',
      customer_address: '',
      customer_postal: '',
      payment_terms: '月末締め翌月末払い',
      delivery_date: '',
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0,
      notes: '',
      items: Array(20).fill(null).map((_, index) => ({
        item_order: index + 1,
        item_name: '',
        description: '',
        quantity: null,
        unit: null,
        unit_price: null,
        amount: 0,
        tax_rate: 10,
        notes: ''
      }))
    })
    setSubtotal10(0)
    setTax10(0)
    setSubtotal8(0)
    setTax8(0)
    setSubtotal0(0)
  }

  // 編集処理
  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)

    // 明細を20行に調整
    const items = [...(invoice.items || [])]
    while (items.length < 20) {
      items.push({
        item_order: items.length + 1,
        item_name: '',
        description: '',
        quantity: null,
        unit: null,
        unit_price: null,
        amount: 0,
        tax_rate: 10,
        notes: ''
      })
    }

    setFormData({
      ...invoice,
      items
    })
    calculateTotals(items)
    setIsDialogOpen(true)
  }

  // 削除処理
  const handleDelete = async (id: string) => {
    if (!confirm('この請求書を削除しますか？')) return

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('請求書を削除しました')
      await fetchInvoices()
    } catch {
      toast.error('削除中にエラーが発生しました')
    }
  }

  // PDF生成（見積書と同じ実装）
  const generatePDF = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <title>請求書_${formData.invoice_number}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 10mm 15mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: "MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif !important;
              line-height: 1.4;
              color: #000;
              background: white;
            }
            .container {
              width: 1050px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              font-family: "MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif !important;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 25px;
            }
            .customer-section {
              width: 60%;
            }
            .company-section {
              width: 35%;
              text-align: right;
              position: relative;
            }
            .stamp {
              position: absolute;
              right: 30px;
              top: 55px;
              width: 65px;
              height: 65px;
              opacity: 0.7;
              z-index: 10;
            }
            .main-table {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
            }
            .main-table th {
              border-top: 1px solid #999;
              border-bottom: 1px solid #999;
              border-left: none;
              border-right: 0.5px solid #ccc;
              padding: 8px;
              font-weight: normal;
              font-size: 12px;
              font-family: "MS Mincho", "MS 明朝", serif !important;
            }
            .main-table th:first-child {
              border-left: none;
            }
            .main-table th:last-child {
              border-right: none;
            }
            .main-table td {
              border-top: 0.5px solid #ccc;
              border-bottom: 0.5px solid #ccc;
              border-left: none;
              border-right: 0.5px solid #ccc;
              padding: 6px 8px;
              font-size: 12px;
              height: 28px;
              font-family: "MS Mincho", "MS 明朝", serif !important;
            }
            .main-table td:first-child {
              border-left: none;
            }
            .main-table td:last-child {
              border-right: none;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="customer-section">
                <div style="margin-bottom: 15px;">
                  <div style="font-size: 11px; margin-bottom: 2px; font-family: 'MS Mincho', serif;">${formData.customer_postal ? '〒' + formData.customer_postal.replace(/[^0-9]/g, '').substring(0, 3) + '-' + formData.customer_postal.replace(/[^0-9]/g, '').substring(3, 7) : ''}</div>
                  <div style="font-size: 11px; margin-bottom: 8px; font-family: 'MS Mincho', serif;">${formData.customer_address || ''}</div>
                  <div style="font-size: 16px; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 3px; min-width: 300px; font-family: 'MS Mincho', serif;">
                    ${formData.customer_name || ''} <span style="margin-left: 20px">御中</span>
                  </div>
                </div>
                <div style="font-size: 12px; line-height: 1.8; margin-top: 15px; font-family: 'MS Mincho', serif;">
                  <p style="margin-bottom: 8px;">下記の通り、御請求申し上げます。</p>
                  <div style="margin-bottom: 3px;"><span style="border-bottom: 1px solid #000; padding-bottom: 1px; min-width: 350px; display: inline-block;">件名: ${formData.delivery_date || '　　　　　　　　　　　　　　　　'}</span></div>
                  <div style="margin-bottom: 3px;">納期: <span style="margin-right: 50px;">${formData.due_date ? format(new Date(formData.due_date), 'yyyy年MM月dd日') : ''}</span>支払条件: ${formData.payment_terms || ''}</div>
                </div>
                <div style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 5px; margin: 20px 0; display: inline-block; min-width: 400px; font-family: 'MS Mincho', serif;">
                  合計金額　　¥${formData.total_amount.toLocaleString()}　(税込)
                </div>
              </div>
              <div class="company-section">
                <h1 style="font-size: 28px; font-weight: normal; margin-bottom: 10px; font-family: 'MS Mincho', serif;">御請求書</h1>
                <div style="font-size: 13px; margin-bottom: 20px; font-family: 'MS Mincho', serif;">No.${formData.invoice_number}</div>
                <img src="/hanko.png" class="stamp">
                <div style="font-size: 12px; line-height: 1.5; margin-top: 20px; text-align: left; font-family: 'MS Mincho', serif; position: relative; padding-left: 150px;">
                  <div style="margin-bottom: 5px; font-size: 14px; font-family: 'MS Mincho', serif;">有限会社イワサキ内装</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">〒130-0021</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">東京都墨田区緑1丁目-24-2タカミビル101</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">登録番号：T6010602034026</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">TEL:03-5638-7402　FAX:03-5638-7403</div>
                </div>
              </div>
            </div>

            <table class="main-table">
              <thead>
                <tr>
                  <th width="5%" class="text-center">番号</th>
                  <th width="45%">商品名</th>
                  <th width="8%" class="text-center">数量</th>
                  <th width="8%" class="text-center">単位</th>
                  <th width="12%" class="text-right">単価(税抜)</th>
                  <th width="5%" class="text-center">税率</th>
                  <th width="17%" class="text-right">金額(税抜)</th>
                </tr>
              </thead>
              <tbody>
                ${(formData.items || []).map((item, i) => `
                  <tr>
                    <td class="text-center">${i + 1}</td>
                    <td>${item.item_name || ''}</td>
                    <td class="text-center">${item.quantity || ''}</td>
                    <td class="text-center">${item.unit || ''}</td>
                    <td class="text-right">${item.unit_price ? Number(item.unit_price).toLocaleString() : ''}</td>
                    <td class="text-center">${item.tax_rate ? item.tax_rate + '%' : ''}</td>
                    <td class="text-right">${item.amount ? Number(item.amount).toLocaleString() : ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="display: flex; justify-content: space-between; margin-top: 20px; align-items: flex-start;">
              <div style="width: 48%; font-size: 11px; font-family: 'MS Mincho', serif;">
                ${subtotal10 > 0 ? `<div style="margin-bottom: 2px;">10%対象 ${subtotal10.toLocaleString()}円 (消費税 ${tax10.toLocaleString()}円)</div>` : ''}
                ${subtotal8 > 0 ? `<div style="margin-bottom: 2px;">8%対象 ${subtotal8.toLocaleString()}円 (消費税 ${tax8.toLocaleString()}円)</div>` : ''}
                ${subtotal0 > 0 ? `<div style="margin-bottom: 2px;">非課税 ${subtotal0.toLocaleString()}円</div>` : ''}
              </div>

              <div style="width: 40%; text-align: left; margin-bottom: 10px; font-size: 11px;">
                <div>振込先：りそな銀行 神田支店（276）</div>
                <div style="margin-left: 50px;">普通 1020315</div>
              </div>

              <table style="width: 280px; border-collapse: collapse;">
                <tr>
                  <td style="border: 1px solid #999; padding: 6px; font-size: 12px; width: 50%; font-family: 'MS Mincho', serif;">小計</td>
                  <td style="border: 1px solid #999; padding: 6px; text-align: right; font-size: 12px; font-family: 'MS Mincho', serif;">¥${formData.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #999; padding: 6px; font-size: 12px; font-family: 'MS Mincho', serif;">消費税</td>
                  <td style="border: 1px solid #999; padding: 6px; text-align: right; font-size: 12px; font-family: 'MS Mincho', serif;">¥${formData.tax_amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #999; padding: 8px; font-size: 14px; font-weight: bold; font-family: 'MS Mincho', serif;">合計金額</td>
                  <td style="border: 1px solid #999; padding: 8px; text-align: right; font-size: 14px; font-weight: bold; font-family: 'MS Mincho', serif;">¥${formData.total_amount.toLocaleString()}</td>
                </tr>
              </table>
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
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">請求書管理</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const months = getAvailableMonths()
                const currentIndex = months.indexOf(selectedMonth)
                if (currentIndex > 0) {
                  setSelectedMonth(months[currentIndex - 1])
                }
              }}
              disabled={getAvailableMonths().indexOf(selectedMonth) === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableMonths().map(month => (
                  <SelectItem key={month} value={month}>
                    {format(new Date(month + '-01'), 'yyyy年MM月')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const months = getAvailableMonths()
                const currentIndex = months.indexOf(selectedMonth)
                if (currentIndex < months.length - 1) {
                  setSelectedMonth(months[currentIndex + 1])
                }
              }}
              disabled={getAvailableMonths().indexOf(selectedMonth) === getAvailableMonths().length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
          <Button
            onClick={() => {
              if (router) {
                const targetProjectId = projectId || formData.project_id || selectedInvoice?.project_id
                if (targetProjectId && targetProjectId !== '') {
                  router.push(`/dashboard/projects?id=${targetProjectId}`)
                } else {
                  router.push('/dashboard/projects')
                }
              }
            }}
            variant="outline"
          >
            <X className="mr-2 h-4 w-4" />
            閉じる
          </Button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="顧客名・請求番号で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 一覧 */}
      <div className="flex-1 overflow-auto">
        <div className="text-sm text-gray-600 mb-2">
          {selectedMonth}の請求書: {filteredInvoices.length}件
        </div>
        <div className="grid gap-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold">{invoice.invoice_number}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(invoice.issue_date), 'yyyy/MM/dd')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{invoice.customer_name}</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ¥{invoice.total_amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(invoice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(invoice.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 編集ダイアログ（見積書と同じレイアウト） */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="!max-w-[99vw] !w-[99vw] !h-[98vh] overflow-auto !p-3"
          style={{
            maxWidth: '99vw !important',
            width: '99vw !important',
            height: '98vh !important'
          }}>
          <DialogHeader>
            <DialogTitle>
              {selectedInvoice ? '請求書編集' : '新規請求書作成'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-3">
              <label className="text-xs">請求番号 (自動生成)</label>
              <Input
                value={formData.invoice_number}
                disabled
                className="bg-gray-100 h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs">発行日</label>
              <Input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-7">
              <label className="text-xs">案件 *必須</label>
              <ProjectSelect
                projects={projects}
                value={formData.project_id || ''}
                onValueChange={handleProjectSelect}
                placeholder="案件を選択してください"
                showCustomerName={false}
                showAmount={false}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <div className="w-48">
              <label className="text-xs">顧客名（自動設定）</label>
              <Select
                value={formData.customer_id || ''}
                onValueChange={handleCustomerSelect}
              >
                <SelectTrigger className="h-8 text-sm">
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
            <div className="w-36">
              <label className="text-xs">支払期限</label>
              <Input
                type="date"
                value={formData.due_date || ''}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                className="h-8 text-sm"
              />
            </div>
            <div className="w-36">
              <label className="text-xs">支払条件</label>
              <Input
                value={formData.payment_terms}
                onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* 請求書プレビュー */}
          <div
            ref={invoiceRef}
            id="invoice-container"
            className="bg-white border rounded mx-auto"
            style={{
              width: '1200px',
              maxWidth: '100%',
              padding: '40px 50px',
              fontFamily: '"MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif',
            }}
          >
            {/* ヘッダー部分 */}
            <div className="flex justify-between mb-6">
              <div style={{ width: '60%' }}>
                <div className="mb-4">
                  <div className="text-xs mb-1" style={{ fontFamily: '"MS Mincho", serif' }}>
                    {formData.customer_postal && `〒${formData.customer_postal.replace(/[^0-9]/g, '').substring(0, 3)}-${formData.customer_postal.replace(/[^0-9]/g, '').substring(3, 7)}`}
                  </div>
                  <div className="text-xs mb-2" style={{ fontFamily: '"MS Mincho", serif' }}>
                    {formData.customer_address}
                  </div>
                  <div className="text-lg border-b border-black inline-block pb-1" style={{ fontFamily: '"MS Mincho", serif', minWidth: '300px' }}>
                    {formData.customer_name} 御中
                  </div>
                </div>

                <div className="text-sm mb-4" style={{ fontFamily: '"MS Mincho", serif', lineHeight: '1.8' }}>
                  <p className="mb-2">下記の通り、御請求申し上げます。</p>
                  <div className="mb-1">
                    <span className="border-b border-black inline-block" style={{ minWidth: '350px' }}>
                      件名: {formData.delivery_date || '　　　　　　　　　　　　　　　　'}
                    </span>
                  </div>
                  <div>
                    納期: {formData.due_date ? format(new Date(formData.due_date), 'yyyy年MM月dd日') : ''}
                    <span className="ml-8">支払条件: {formData.payment_terms}</span>
                  </div>
                </div>

                <div className="text-xl border-b-2 border-black pb-2 inline-block" style={{ fontFamily: '"MS Mincho", serif', minWidth: '400px' }}>
                  合計金額　　¥{formData.total_amount.toLocaleString()}　(税込)
                </div>
              </div>

              <div className="text-right" style={{ width: '35%' }}>
                <h1 className="text-3xl mb-2" style={{ fontFamily: '"MS Mincho", serif' }}>御請求書</h1>
                <div className="text-sm mb-6" style={{ fontFamily: '"MS Mincho", serif' }}>
                  No.{formData.invoice_number}
                </div>
                <img src="/hanko.png" alt="社印" className="absolute" style={{ width: '65px', height: '65px', opacity: 0.7, right: '30px', top: '55px', zIndex: 10 }} />
                <div className="text-xs text-left mt-8" style={{ fontFamily: '"MS Mincho", serif', paddingLeft: '150px', lineHeight: '1.5' }}>
                  <div className="text-sm mb-1">有限会社イワサキ内装</div>
                  <div>〒130-0021</div>
                  <div>東京都墨田区緑1丁目-24-2タカミビル101</div>
                  <div>登録番号：T6010602034026</div>
                  <div>TEL:03-5638-7402　FAX:03-5638-7403</div>
                </div>
              </div>
            </div>

            {/* 明細テーブル */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-t border-b border-gray-600">
                  <th className="text-center p-2 text-xs" style={{ width: '5%', fontFamily: '"MS Mincho", serif' }}>番号</th>
                  <th className="text-left p-2 text-xs" style={{ width: '45%', fontFamily: '"MS Mincho", serif' }}>商品名</th>
                  <th className="text-center p-2 text-xs" style={{ width: '8%', fontFamily: '"MS Mincho", serif' }}>数量</th>
                  <th className="text-center p-2 text-xs" style={{ width: '8%', fontFamily: '"MS Mincho", serif' }}>単位</th>
                  <th className="text-right p-2 text-xs" style={{ width: '12%', fontFamily: '"MS Mincho", serif' }}>単価(税抜)</th>
                  <th className="text-center p-2 text-xs" style={{ width: '5%', fontFamily: '"MS Mincho", serif' }}>税率</th>
                  <th className="text-right p-2 text-xs" style={{ width: '17%', fontFamily: '"MS Mincho", serif' }}>金額(税抜)</th>
                </tr>
              </thead>
              <tbody>
                {(formData.items || []).map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="text-center p-1 text-xs" style={{ fontFamily: '"MS Mincho", serif' }}>
                      {index + 1}
                    </td>
                    <td className="p-1">
                      <Input
                        value={item.item_name}
                        onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                        className="border-0 h-7 text-xs"
                        style={{ fontFamily: '"MS Mincho", serif' }}
                      />
                    </td>
                    <td className="text-center p-1">
                      <Input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="border-0 h-7 text-xs text-center"
                        style={{ fontFamily: '"MS Mincho", serif' }}
                      />
                    </td>
                    <td className="text-center p-1">
                      <Input
                        value={item.unit || ''}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className="border-0 h-7 text-xs text-center"
                        style={{ fontFamily: '"MS Mincho", serif' }}
                      />
                    </td>
                    <td className="text-right p-1">
                      <Input
                        type="number"
                        value={item.unit_price || ''}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        className="border-0 h-7 text-xs text-right"
                        style={{ fontFamily: '"MS Mincho", serif' }}
                      />
                    </td>
                    <td className="text-center p-1">
                      <Select
                        value={String(item.tax_rate || 10)}
                        onValueChange={(value) => updateItem(index, 'tax_rate', Number(value))}
                      >
                        <SelectTrigger className="border-0 h-7 text-xs" style={{ fontFamily: '"MS Mincho", serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="8">8%</SelectItem>
                          <SelectItem value="0">0%</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="text-right p-1 text-xs" style={{ fontFamily: '"MS Mincho", serif' }}>
                      {item.amount ? item.amount.toLocaleString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 合計部分 */}
            <div className="flex justify-between mt-6">
              <div className="text-xs" style={{ width: '48%', fontFamily: '"MS Mincho", serif' }}>
                {subtotal10 > 0 && (
                  <div>10%対象 {subtotal10.toLocaleString()}円 (消費税 {tax10.toLocaleString()}円)</div>
                )}
                {subtotal8 > 0 && (
                  <div>8%対象 {subtotal8.toLocaleString()}円 (消費税 {tax8.toLocaleString()}円)</div>
                )}
                {subtotal0 > 0 && (
                  <div>非課税 {subtotal0.toLocaleString()}円</div>
                )}
              </div>

              <div className="text-xs mb-2" style={{ width: '40%', fontFamily: '"MS Mincho", serif' }}>
                <div>振込先：りそな銀行 神田支店（276）</div>
                <div style={{ marginLeft: '50px' }}>普通 1020315</div>
              </div>

              <table className="border-collapse" style={{ width: '280px' }}>
                <tbody>
                  <tr>
                    <td className="border border-gray-600 p-2 text-xs" style={{ fontFamily: '"MS Mincho", serif', width: '50%' }}>小計</td>
                    <td className="border border-gray-600 p-2 text-right text-xs" style={{ fontFamily: '"MS Mincho", serif' }}>
                      ¥{formData.subtotal.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-600 p-2 text-xs" style={{ fontFamily: '"MS Mincho", serif' }}>消費税</td>
                    <td className="border border-gray-600 p-2 text-right text-xs" style={{ fontFamily: '"MS Mincho", serif' }}>
                      ¥{formData.tax_amount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-600 p-2 text-sm font-bold" style={{ fontFamily: '"MS Mincho", serif' }}>合計金額</td>
                    <td className="border border-gray-600 p-2 text-right text-sm font-bold" style={{ fontFamily: '"MS Mincho", serif' }}>
                      ¥{formData.total_amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-between mt-4">
            <div className="flex gap-2">
              <Button
                onClick={generatePDF}
                variant="outline"
              >
                <Printer className="mr-2 h-4 w-4" />
                印刷・PDF
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              <Button
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
                variant="outline"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}