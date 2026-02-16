'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import '../styles/print.css'
import '../styles/quotation-print.css'
import {
  Printer,
  Download,
  Save,
  Plus,
  Trash2,
  Edit,
  FileText,
  Search,
  Building,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectSelect } from '@/components/ui/project-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface QuotationItem {
  id?: string
  item_name: string
  quantity: string
  unit: string
  unit_price: string
  tax_rate: string
  amount: string
}

interface Quotation {
  id?: string
  quotation_number: string
  project_id?: string
  customer_id?: string
  issue_date: string
  customer_name: string
  customer_address: string
  customer_postal?: string
  payment_terms: string
  delivery_date: string
  delivery_period?: string
  transaction_method?: string
  billing_date?: string  // 請求日を追加
  effective_period: string
  subtotal: number
  tax_amount: number
  total_amount: number
  notes?: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  items: QuotationItem[]
}

interface Props {
  projectId?: string
  editId?: string
}

export default function QuotationsManager({ projectId, editId }: Props) {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()
  const [isInvoiceMode, setIsInvoiceMode] = useState(false)

  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  
  // 見積番号の自動生成
  const generateQuotationNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `Q${year}${month}${day}-${random}`
  }

  // フォームの状態
  const [formData, setFormData] = useState<Quotation>({
    quotation_number: generateQuotationNumber(),
    project_id: '',
    customer_id: '',
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    customer_name: '',
    customer_address: '',
    customer_postal: '',
    payment_terms: '',
    delivery_date: '',
    delivery_period: '',
    transaction_method: '従来通り',
    billing_date: format(new Date(), 'yyyy年M月d日'),  // 請求日を追加
    effective_period: '提出後30日',
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0,
    notes: '',
    status: 'draft',
    items: [
      { item_name: '', quantity: '', unit: '', unit_price: '', tax_rate: '10%', amount: '' },
    ]
  })

  const [subtotal10, setSubtotal10] = useState('0')
  const [tax10, setTax10] = useState('0')
  const [subtotal8, setSubtotal8] = useState('0')
  const [tax8, setTax8] = useState('0')

  // データ取得
  useEffect(() => {
    fetchQuotations()
    fetchCustomers()
    fetchProjects()
  }, [projectId])

  // projectIdが指定されたら自動選択して新規作成ダイアログを開く
  useEffect(() => {
    const loadProjectData = async () => {
      if (projectId && projects.length > 0 && !editId) {
        const project = projects.find(p => p.id === projectId)
        if (project) {
          // 顧客情報を確実に取得
          if (project.receivable_customer_id) {
            const { data: customerData } = await supabase
              .from('customers')
              .select('*')
              .eq('id', project.receivable_customer_id)
              .single()
            
            setFormData(prev => ({
              ...prev,
              project_id: projectId,
              customer_id: project.receivable_customer_id || '',
              customer_name: customerData?.customer_name || '',
              customer_address: customerData?.address || '',
              customer_postal: customerData?.postal_code || '',
              delivery_date: project.project_name || ''
            }))
          } else {
            setFormData(prev => ({
              ...prev,
              project_id: projectId,
              delivery_date: project.project_name || ''
            }))
          }
          setIsDialogOpen(true)
        }
      }
    }
    loadProjectData()
  }, [projectId, projects, editId])

  // editIdが指定されたらその見積書を編集モードで開く
  useEffect(() => {
    if (editId && quotations.length > 0) {
      const quotation = quotations.find(q => q.id === editId)
      if (quotation) {
        handleEdit(quotation)
      }
    }
  }, [editId, quotations])

  const fetchQuotations = async () => {
    let query = supabase
      .from('quotations')
      .select(`
        *,
        quotation_items (*)
      `)
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) {
      toast.error('見積書の取得に失敗しました')
      return
    }

    const formattedData = data?.map(q => ({
      ...q,
      items: q.quotation_items || []
    })) || []

    setQuotations(formattedData)
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
      // 全プロジェクトを取得（月ごとにグループ化して表示）
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) {
        return
      }

      // 顧客情報を別途取得してマージ
      const projectsWithCustomers = await Promise.all(
        (projectsData || []).map(async (project) => {
          if (project.receivable_customer_id) {
            const { data: customerData } = await supabase
              .from('customers')
              .select('*')
              .eq('id', project.receivable_customer_id)
              .single()

            return {
              ...project,
              receivable_customer: customerData,
              customer_name: customerData?.customer_name || '',
              receivable_amount: project.receivable_amount || 0
            }
          }
          return {
            ...project,
            customer_name: '',
            receivable_amount: project.receivable_amount || 0
          }
        })
      )

      setProjects(projectsWithCustomers)
    } catch {
      // Ignore fetch errors
    }
  }

  // 明細項目の更新
  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if ((field === 'quantity' || field === 'unit_price')) {
      const qty = parseFloat(newItems[index].quantity) || 0
      const price = parseFloat(newItems[index].unit_price) || 0
      newItems[index].amount = qty && price ? (qty * price).toLocaleString() : ''
    }
    
    setFormData({ ...formData, items: newItems })
    calculateTotals(newItems)
  }

  // 明細項目の削除
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: newItems })
      calculateTotals(newItems)
    }
  }

  // 合計計算
  const calculateTotals = (currentItems: QuotationItem[]) => {
    let sub10 = 0
    let sub8 = 0
    
    currentItems.forEach(item => {
      const amount = parseFloat(item.amount.replace(/,/g, '')) || 0
      if (item.tax_rate === '10%') {
        sub10 += amount
      } else if (item.tax_rate === '8%') {
        sub8 += amount
      }
    })
    
    const t10 = Math.floor(sub10 * 0.1)
    const t8 = Math.floor(sub8 * 0.08)
    const subtotal = sub10 + sub8
    const tax = t10 + t8
    const total = subtotal + tax
    
    setSubtotal10(sub10.toLocaleString())
    setTax10(t10.toLocaleString())
    setSubtotal8(sub8.toLocaleString())
    setTax8(t8.toLocaleString())
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount: tax,
      total_amount: total
    }))
  }

  // 顧客選択時の処理
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customer_id: customer.id,
        customer_name: customer.customer_name || '',
        customer_address: customer.address || '',
        customer_postal: customer.postal_code || ''
      }))
    }
  }

  // プロジェクト選択時の処理
  const handleProjectSelect = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    
    if (project) {
      // プロジェクトIDを設定
      setFormData(prev => ({
        ...prev,
        project_id: projectId,
        delivery_date: project.project_name || ''
      }))
      
      // 顧客情報がある場合は自動設定
      if (project.receivable_customer_id) {
        // 顧客情報を別途取得
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('id', project.receivable_customer_id)
          .single()

        if (customerData) {
          setFormData(prev => ({
            ...prev,
            customer_id: project.receivable_customer_id,
            customer_name: customerData.customer_name || '',
            customer_address: customerData.address || '',
            customer_postal: customerData.postal_code || ''
          }))
        }
      }
    }
  }

  // 請求書として保存
  const handleSaveAsInvoice = async () => {
    try {
      // 必須チェック
      if (!formData.project_id) {
        toast.error('案件を選択してください')
        return
      }
      if (!formData.customer_name) {
        toast.error('顧客名を入力してください')
        return
      }

      // 請求書データを作成（invoicesテーブルに保存）
      const invoiceData: any = {
        invoice_number: `INV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        project_id: formData.project_id,
        customer_id: formData.customer_id || null,
        issue_date: formData.issue_date,
        due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30日後
        customer_name: formData.customer_name,
        customer_address: formData.customer_address || '',
        customer_postal: formData.customer_postal || '',
        payment_terms: formData.payment_terms || '',
        delivery_date: formData.delivery_date || '',
        subtotal: formData.subtotal,
        tax_amount: formData.tax_amount,
        total_amount: formData.total_amount,
        notes: formData.notes || '',
        status: 'sent',
        payment_status: 'unpaid',
        quotation_id: formData.id || null // 見積書IDがあれば紐付け
      }

      // 請求書を新規作成
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single()

      if (error) throw error
      const invoiceId = data.id

      // 明細の保存
      const itemsToSave = formData.items
        .filter(item => item.item_name || item.quantity || item.unit_price)
        .map((item, index) => ({
          invoice_id: invoiceId,
          item_order: index + 1,
          item_name: item.item_name,
          description: item.item_name,  // 既存のdescriptionカラムにも保存
          quantity: parseFloat(item.quantity) || 0,
          unit: item.unit || '式',
          unit_price: parseFloat(item.unit_price) || 0,
          amount: parseFloat(item.amount.replace(/,/g, '')) || 0,
          tax_rate: item.tax_rate === '10%' ? 10 : item.tax_rate === '8%' ? 8 : 10,
          notes: ''  // 空でOK
        }))

      if (itemsToSave.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsToSave)

        if (itemsError) throw itemsError
      }

      toast.success('請求書として保存しました')
      setIsDialogOpen(false)
      resetForm()
      setIsInvoiceMode(false)
      // 請求書一覧ページへ遷移
      router.push('/invoices')
    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error.message || 'エラーが発生しました'}`)
    }
  }

  // 保存処理
  const handleSave = async () => {
    try {
      // 必須チェック
      if (!formData.project_id) {
        toast.error('案件を選択してください')
        return
      }
      if (!formData.customer_name) {
        toast.error('顧客名を入力してください')
        return
      }
      // 見積番号の生成（必要に応じて）
      const quotationNumber = formData.quotation_number || 
        `Q${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

      // 見積書の保存
      const quotationData: any = {
        quotation_number: quotationNumber,
        project_id: formData.project_id || null,
        customer_id: formData.customer_id || null,
        issue_date: formData.issue_date,
        customer_name: formData.customer_name,
        customer_address: formData.customer_address,
        customer_postal: formData.customer_postal || '',
        payment_terms: formData.payment_terms,
        delivery_date: formData.delivery_date,
        billing_date: formData.billing_date || null,  // 請求日を追加
        effective_period: formData.effective_period,
        subtotal: formData.subtotal,
        tax_amount: formData.tax_amount,
        total_amount: formData.total_amount,
        notes: formData.notes,
        status: formData.status
      }
      
      // 新しいカラムがDBに存在する場合のみ追加
      if (formData.delivery_period !== undefined) {
        quotationData.delivery_period = formData.delivery_period || ''
      }
      if (formData.transaction_method !== undefined) {
        quotationData.transaction_method = formData.transaction_method || ''
      }

      let quotationId = formData.id

      if (quotationId) {
        // 更新
        const { error } = await supabase
          .from('quotations')
          .update(quotationData)
          .eq('id', quotationId)

        if (error) throw error

        // 既存の明細を削除
        await supabase
          .from('quotation_items')
          .delete()
          .eq('quotation_id', quotationId)
      } else {
        // 新規作成
        const { data, error } = await supabase
          .from('quotations')
          .insert(quotationData)
          .select()
          .single()

        if (error) throw error
        quotationId = data.id
      }

      // 明細の保存
      const itemsToSave = formData.items
        .filter(item => item.item_name || item.quantity || item.unit_price)
        .map((item, index) => ({
          quotation_id: quotationId,
          item_order: index + 1,
          item_name: item.item_name,
          quantity: parseFloat(item.quantity) || 0,
          unit: item.unit || '式',
          unit_price: parseFloat(item.unit_price) || 0,
          amount: parseFloat(item.amount.replace(/,/g, '')) || 0,
          tax_rate: item.tax_rate === '10%' ? 10 : item.tax_rate === '8%' ? 8 : 10
        }))

      if (itemsToSave.length > 0) {
        const { error } = await supabase
          .from('quotation_items')
          .insert(itemsToSave)

        if (error) throw error
      }

      toast.success('見積書を保存しました')
      await fetchQuotations()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error.message || 'エラーが発生しました'}`)
    }
  }

  // フォームリセット
  const resetForm = () => {
    const newData = {
      quotation_number: generateQuotationNumber(),
      project_id: '',
      customer_id: '',
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      customer_name: '',
      customer_address: '',
      customer_postal: '',
      payment_terms: '',
      delivery_date: '',
      delivery_period: '',
      transaction_method: '従来通り',
      billing_date: format(new Date(), 'yyyy年M月d日'),  // 請求日を追加
      effective_period: '提出後30日',
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0,
      notes: '',
      status: 'draft' as const,
      items: [
        { item_name: '', quantity: '', unit: '', unit_price: '', tax_rate: '10%', amount: '' },
      ]
    }
    setFormData(newData)
    calculateTotals(newData.items)
    setSelectedQuotation(null)
  }

  // 編集
  const handleEdit = (quotation: Quotation) => {
    // 明細を5行フォーマットに変換
    const items: QuotationItem[] = []
    for (let i = 0; i < 5; i++) {
      if (quotation.items && quotation.items[i]) {
        const item = quotation.items[i] as any
        items.push({
          item_name: item.item_name || '',
          quantity: item.quantity ? String(item.quantity) : '',
          unit: item.unit || '',
          unit_price: item.unit_price ? String(item.unit_price) : '',
          tax_rate: item.tax_rate ? `${item.tax_rate}%` : '10%',
          amount: item.amount ? String(item.amount) : ''
        })
      } else {
        items.push({ item_name: '', quantity: '', unit: '', unit_price: '', tax_rate: '', amount: '' })
      }
    }

    setFormData({
      ...quotation,
      items
    })
    setSelectedQuotation(quotation)
    calculateTotals(items)
    setIsDialogOpen(true)
  }

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm('この見積書を削除しますか？')) return

    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('削除に失敗しました')
    } else {
      toast.success('見積書を削除しました')
      await fetchQuotations()
    }
  }

  // PDF出力
  const exportToPDF = async () => {
    try {
      // 新しいウィンドウでPDF用のHTMLを生成
      const pdfWindow = window.open('', '_blank', 'width=1200,height=800')
      if (!pdfWindow) {
        toast.error('ポップアップがブロックされています。ポップアップを許可してください。')
        return
      }

      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${isInvoiceMode ? '請求書' : '見積書'}PDF</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: "MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif !important;
            }
            body {
              background: white;
              font-family: "MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif !important;
              padding: 20px;
              color: #000;
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
                  <p style="margin-bottom: 8px;">${isInvoiceMode ? '下記の通り、御請求申し上げます。' : '下記の通り、御見積り申し上げます。'}</p>
                  <div style="margin-bottom: 3px;"><span style="border-bottom: 1px solid #000; padding-bottom: 1px; min-width: 350px; display: inline-block;">件名: ${formData.delivery_date || '　　　　　　　　　　　　　　　　'}</span></div>
                  ${isInvoiceMode ?
                    `<div style="margin-bottom: 3px;">請求日: ${formData.billing_date || format(new Date(), 'yyyy年M月d日')}</div>` :
                    `<div style="margin-bottom: 3px;">納期: <span style="margin-right: 50px;">${formData.delivery_period || ''}</span>取引方法: ${formData.transaction_method || ''}</div>
                     <div>有効期限: ${formData.effective_period || '提出後30日'}</div>`
                  }
                </div>
                <div style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 5px; margin: 20px 0; display: inline-block; min-width: 400px; font-family: 'MS Mincho', serif;">
                  合計金額　　¥${formData.total_amount.toLocaleString()}　(税込)
                </div>
              </div>
              <div class="company-section">
                <h1 style="font-size: 28px; font-weight: normal; margin-bottom: 10px; font-family: 'MS Mincho', serif;">${isInvoiceMode ? '御請求書' : '御見積書'}</h1>
                <div style="font-size: 13px; margin-bottom: 20px; font-family: 'MS Mincho', serif;">No.${isInvoiceMode ? 'INV-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0') : formData.quotation_number}</div>
                ${!isInvoiceMode ? '<img src="/hanko.png" class="stamp">' : ''}
                <div style="font-size: 12px; line-height: 1.5; margin-top: 20px; text-align: left; font-family: 'MS Mincho', serif; position: relative; padding-left: 150px;">
                  <div style="margin-bottom: 5px; font-size: 14px; font-family: 'MS Mincho', serif;">有限会社イワサキ内装</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">〒130-0021</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">東京都墨田区緑1丁目-24-2タカミビル101</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">登録番号：T6010602034026</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">TEL:03-5638-7402　FAX:03-5638-7403</div>
                  <div style="font-size: 10px; font-family: 'MS Mincho', serif;">担当：岩﨑　泰氏</div>
                </div>
              </div>
            </div>
            
            <table class="main-table">
              <thead>
                <tr>
                  <th style="text-align: left; width: 45%">内容</th>
                  <th class="text-center" style="width: 10%">数量</th>
                  <th class="text-center" style="width: 8%">単位</th>
                  <th class="text-right" style="width: 15%">単価(税抜)</th>
                  <th class="text-center" style="width: 8%">税率</th>
                  <th class="text-right" style="width: 14%">金額(税抜)</th>
                </tr>
              </thead>
              <tbody>
                ${formData.items.map(item => `
                  <tr>
                    <td style="padding-left: 10px;">${item.item_name || ''}</td>
                    <td class="text-center">${item.quantity || ''}</td>
                    <td class="text-center">${item.unit || ''}</td>
                    <td class="text-right" style="padding-right: 10px;">${item.unit_price || ''}</td>
                    <td class="text-center">${item.tax_rate || ''}</td>
                    <td class="text-right" style="padding-right: 10px;">¥${item.amount || '0'}</td>
                  </tr>
                `).join('')}
                ${Array(Math.max(0, 10 - formData.items.length)).fill(0).map(() => `
                  <tr>
                    <td style="height: 28px;">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px">
              <div style="font-size: 11px; font-family: 'MS Mincho', serif;">
                <table style="border: none">
                  <tr>
                    <td style="border: none; padding: 3px 15px 3px 0; font-family: 'MS Mincho', serif;">税別内訳</td>
                    <td style="border: none; padding: 3px 15px; text-align: center; font-family: 'MS Mincho', serif;">小計(税抜金額)</td>
                    <td style="border: none; padding: 3px 0; text-align: center; font-family: 'MS Mincho', serif;">小計(税のみ)</td>
                  </tr>
                  <tr>
                    <td style="border: none; padding: 3px 15px 3px 0; font-family: 'MS Mincho', serif;">10%対象分</td>
                    <td style="border: none; padding: 3px 15px; text-align: right; font-family: 'MS Mincho', serif;">¥${subtotal10}</td>
                    <td style="border: none; padding: 3px 0; text-align: right; font-family: 'MS Mincho', serif;">¥${tax10}</td>
                  </tr>
                  <tr>
                    <td style="border: none; padding: 3px 15px 3px 0; font-family: 'MS Mincho', serif;">8%対象分</td>
                    <td style="border: none; padding: 3px 15px; text-align: right; font-family: 'MS Mincho', serif;">¥${subtotal8}</td>
                    <td style="border: none; padding: 3px 0; text-align: right; font-family: 'MS Mincho', serif;">¥${tax8}</td>
                  </tr>
                </table>
              </div>
              ${isInvoiceMode ? `
              <div style="border: 1px solid #999; padding: 8px; margin: 0 20px; font-size: 11px; font-family: 'MS Mincho', serif;">
                <div style="margin-bottom: 3px;">お支払いにつきましては、下記口座へお振込みくださいますようお願い申し上げます。</div>
                <div>りそな銀行 神田支店（276）普通 1020315</div>
              </div>
              ` : ''}
              <div style="text-align: right; font-size: 13px; font-family: 'MS Mincho', serif;">
                <div style="margin-bottom: 5px; font-family: 'MS Mincho', serif; border-bottom: 0.5px solid #999; padding-bottom: 2px; display: inline-block;">小計（税抜金額）：　¥${formData.subtotal.toLocaleString()}</div><br/>
                <div style="font-family: 'MS Mincho', serif; border-bottom: 0.5px solid #999; padding-bottom: 2px; display: inline-block;">消費税（10%）：　¥${formData.tax_amount.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
          <script>
            window.onload = async function() {
              try {
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const { jsPDF } = window.jspdf;
                const container = document.querySelector('.container');
                
                const canvas = await html2canvas(container, {
                  scale: 1.5, // スケールを2から1.5に削減してファイルサイズを縮小
                  logging: false,
                  useCORS: true,
                  backgroundColor: '#ffffff',
                  imageTimeout: 0, // 画像読み込みのタイムアウトを無効化
                  letterRendering: true // 文字の描画品質を向上
                });

                const pdf = new jsPDF('l', 'mm', 'a4');
                // JPEG形式で圧縮率を設定してファイルサイズを削減
                const imgData = canvas.toDataURL('image/jpeg', 0.85); // PNG→JPEGに変更、品質85%
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('${isInvoiceMode ? '請求書' : '見積書'}_${formData.quotation_number || 'new'}.pdf');
                
                setTimeout(() => window.close(), 1000);
              } catch {
                alert('PDF生成に失敗しました。');
              }
            }
          </script>
        </body>
        </html>
      `

      pdfWindow.document.write(pdfContent)
      pdfWindow.document.close()
      
      toast.success('PDFを生成中です...')
    } catch {
      toast.error('PDF生成に失敗しました。')
    }
  }

  // 印刷
  const printInvoice = () => {
    // PDFと同じHTMLを印刷用に生成
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (!printWindow) {
      toast.error('ポップアップがブロックされています。ポップアップを許可してください。')
      return
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${isInvoiceMode ? '請求書' : '見積書'}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif !important;
          }
          body {
            background: white;
            font-family: "MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif !important;
            padding: 20px;
            color: #000;
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
                <p style="margin-bottom: 8px;">${isInvoiceMode ? '下記の通り、御請求申し上げます。' : '下記の通り、御見積り申し上げます。'}</p>
                <div style="margin-bottom: 3px;"><span style="border-bottom: 1px solid #000; padding-bottom: 1px; min-width: 350px; display: inline-block;">件名: ${formData.delivery_date || '　　　　　　　　　　　　　　　　'}</span></div>
                ${isInvoiceMode ?
                  `<div style="margin-bottom: 3px;">請求日: ${formData.billing_date || format(new Date(), 'yyyy年M月d日')}</div>` :
                  `<div style="margin-bottom: 3px;">納期: <span style="margin-right: 50px;">${formData.delivery_period || ''}</span>取引方法: ${formData.transaction_method || ''}</div>
                   <div>有効期限: ${formData.effective_period || '提出後30日'}</div>`
                }
              </div>
              <div style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 5px; margin: 20px 0; display: inline-block; min-width: 400px; font-family: 'MS Mincho', serif;">
                合計金額　　¥${formData.total_amount.toLocaleString()}　(税込)
              </div>
            </div>
            <div class="company-section">
              <h1 style="font-size: 28px; font-weight: normal; margin-bottom: 10px; font-family: 'MS Mincho', serif;">${isInvoiceMode ? '御請求書' : '御見積書'}</h1>
              <div style="font-size: 13px; margin-bottom: 20px; font-family: 'MS Mincho', serif;">No.${isInvoiceMode ? `INV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : formData.quotation_number}</div>
              ${!isInvoiceMode ? '<img src="/hanko.png" class="stamp">' : ''}
              <div style="font-size: 12px; line-height: 1.5; margin-top: 20px; text-align: left; font-family: 'MS Mincho', serif; position: relative; padding-left: 150px;">
                <div style="margin-bottom: 5px; font-size: 14px; font-family: 'MS Mincho', serif;">有限会社イワサキ内装</div>
                <div style="font-size: 10px; font-family: 'MS Mincho', serif;">〒130-0021</div>
                <div style="font-size: 10px; font-family: 'MS Mincho', serif;">東京都墨田区緑1丁目-24-2タカミビル101</div>
                <div style="font-size: 10px; font-family: 'MS Mincho', serif;">登録番号：T6010602034026</div>
                <div style="font-size: 10px; font-family: 'MS Mincho', serif;">TEL:03-5638-7402　FAX:03-5638-7403</div>
                <div style="font-size: 10px; font-family: 'MS Mincho', serif;">担当：岩﨑　泰氏</div>
              </div>
            </div>
          </div>
          
          <table class="main-table">
            <thead>
              <tr>
                <th style="text-align: left; width: 45%">内容</th>
                <th class="text-center" style="width: 10%">数量</th>
                <th class="text-center" style="width: 8%">単位</th>
                <th class="text-right" style="width: 15%">単価(税抜)</th>
                <th class="text-center" style="width: 8%">税率</th>
                <th class="text-right" style="width: 14%">金額(税抜)</th>
              </tr>
            </thead>
            <tbody>
              ${formData.items.map(item => `
                <tr>
                  <td style="padding-left: 10px;">${item.item_name || ''}</td>
                  <td class="text-center">${item.quantity || ''}</td>
                  <td class="text-center">${item.unit || ''}</td>
                  <td class="text-right" style="padding-right: 10px;">${item.unit_price || ''}</td>
                  <td class="text-center">${item.tax_rate || ''}</td>
                  <td class="text-right" style="padding-right: 10px;">¥${item.amount || '0'}</td>
                </tr>
              `).join('')}
              ${Array(Math.max(0, 10 - formData.items.length)).fill(0).map(() => `
                <tr>
                  <td style="height: 28px;">&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <div style="font-size: 11px; font-family: 'MS Mincho', serif;">
              <table style="border: none">
                <tr>
                  <td style="border: none; padding: 3px 15px 3px 0; font-family: 'MS Mincho', serif;">税別内訳</td>
                  <td style="border: none; padding: 3px 15px; text-align: center; font-family: 'MS Mincho', serif;">小計(税抜金額)</td>
                  <td style="border: none; padding: 3px 0; text-align: center; font-family: 'MS Mincho', serif;">小計(税のみ)</td>
                </tr>
                <tr>
                  <td style="border: none; padding: 3px 15px 3px 0; font-family: 'MS Mincho', serif;">10%対象分</td>
                  <td style="border: none; padding: 3px 15px; text-align: right; font-family: 'MS Mincho', serif;">¥${subtotal10}</td>
                  <td style="border: none; padding: 3px 0; text-align: right; font-family: 'MS Mincho', serif;">¥${tax10}</td>
                </tr>
                <tr>
                  <td style="border: none; padding: 3px 15px 3px 0; font-family: 'MS Mincho', serif;">8%対象分</td>
                  <td style="border: none; padding: 3px 15px; text-align: right; font-family: 'MS Mincho', serif;">¥${subtotal8}</td>
                  <td style="border: none; padding: 3px 0; text-align: right; font-family: 'MS Mincho', serif;">¥${tax8}</td>
                </tr>
              </table>
            </div>
            ${isInvoiceMode ? `
            <div style="border: 1px solid #999; padding: 8px; margin: 0 20px; font-size: 11px; font-family: 'MS Mincho', serif;">
              <div style="margin-bottom: 3px;">お支払いにつきましては、下記口座へお振込みくださいますようお願い申し上げます。</div>
              <div>りそな銀行 神田支店（276）普通 1020315</div>
            </div>
            ` : ''}
            <div style="text-align: right; font-size: 13px; font-family: 'MS Mincho', serif;">
              <div style="margin-bottom: 5px; font-family: 'MS Mincho', serif; border-bottom: 0.5px solid #999; padding-bottom: 2px; display: inline-block;">小計（税抜金額）：　¥${formData.subtotal.toLocaleString()}</div><br/>
              <div style="font-family: 'MS Mincho', serif; border-bottom: 0.5px solid #999; padding-bottom: 2px; display: inline-block;">消費税（10%）：　¥${formData.tax_amount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // 印刷ダイアログを開く
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  // 検索フィルター
  // 月別フィルタリング
  const getFilteredByMonth = () => {
    return quotations.filter(q => {
      const quotationDate = q.issue_date.substring(0, 7) // YYYY-MM形式
      return quotationDate === selectedMonth
    })
  }

  // 検索フィルタリング
  const filteredQuotations = getFilteredByMonth().filter(q =>
    q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quotation_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 利用可能な月のリストを取得
  const getAvailableMonths = () => {
    const months = new Set<string>()
    quotations.forEach(q => {
      const month = q.issue_date.substring(0, 7)
      months.add(month)
    })
    return Array.from(months).sort().reverse()
  }

  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">見積書管理</h1>
          {/* 月別ナビゲーション */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const availableMonths = getAvailableMonths()
                const currentIndex = availableMonths.indexOf(selectedMonth)
                if (currentIndex < availableMonths.length - 1) {
                  setSelectedMonth(availableMonths[currentIndex + 1])
                }
              }}
              disabled={getAvailableMonths().indexOf(selectedMonth) === getAvailableMonths().length - 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 min-w-[120px] text-center font-medium border rounded">
              {(() => {
                const [year, monthNum] = selectedMonth.split('-')
                return `${year}年${parseInt(monthNum)}月`
              })()}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const availableMonths = getAvailableMonths()
                const currentIndex = availableMonths.indexOf(selectedMonth)
                if (currentIndex > 0) {
                  setSelectedMonth(availableMonths[currentIndex - 1])
                }
              }}
              disabled={getAvailableMonths().indexOf(selectedMonth) === 0}
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
              // 優先順位: URLパラメータ > フォームのproject_id > 選択された見積書のproject_id
              const targetProjectId = projectId || formData.project_id || selectedQuotation?.project_id;
              if (targetProjectId && targetProjectId !== '') {
                router.push(`/dashboard/projects?id=${targetProjectId}`);
              } else {
                router.push('/dashboard/projects');
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
            placeholder="顧客名・見積番号で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 一覧 */}
      <div className="flex-1 overflow-auto">
        <div className="text-sm text-gray-600 mb-2">
          {selectedMonth}の見積書: {filteredQuotations.length}件
        </div>
        <div className="grid gap-4">
          {filteredQuotations.map((quotation) => (
            <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold">{quotation.quotation_number}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(quotation.issue_date), 'yyyy/MM/dd')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{quotation.customer_name}</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ¥{quotation.total_amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(quotation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(quotation.id!)}
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

      {/* 編集ダイアログ */}
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
              {selectedQuotation ? '見積書編集' : '新規見積書作成'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-3">
              <label className="text-xs">見積番号 (自動生成)</label>
              <Input
                value={formData.quotation_number}
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
              <label className="text-xs">納期</label>
              <Input
                value={formData.delivery_period || ''}
                onChange={(e) => setFormData({...formData, delivery_period: e.target.value})}
                className="h-8 text-sm"
              />
            </div>
            <div className="w-36">
              <label className="text-xs">取引方法</label>
              <Input
                value={formData.transaction_method}
                onChange={(e) => setFormData({...formData, transaction_method: e.target.value})}
                className="h-8 text-sm"
              />
            </div>
            <div className="w-36">
              <label className="text-xs">有効期限</label>
              <Input
                value={formData.effective_period}
                onChange={(e) => setFormData({...formData, effective_period: e.target.value})}
                placeholder="提出後30日"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex items-end ml-4">
              <Button
                type="button"
                onClick={() => setIsInvoiceMode(!isInvoiceMode)}
                variant={isInvoiceMode ? "default" : "outline"}
                className="h-8"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                {isInvoiceMode ? "請求書モード" : "請求書に変換"}
              </Button>
            </div>
          </div>

          {/* 見積書プレビュー */}
          <div 
            ref={invoiceRef}
            id="quotation-container"
            className="bg-white border rounded mx-auto"
            style={{
              width: '1200px',
              maxWidth: '100%',
              padding: '40px 50px',
              fontFamily: '"MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif',
              color: '#000',
              lineHeight: '1.4',
              transform: 'scale(1.1)',
              transformOrigin: 'top center'
            }}
          >
            {/* ヘッダー */}
            <div className="flex justify-between items-start" style={{ marginBottom: '25px' }}>
              {/* 左側 - 顧客情報と金額 */}
              <div style={{ width: '62%' }}>
                {/* 顧客情報エリア */}
                <div style={{ 
                  marginBottom: '15px'
                }}>
                  <div style={{ fontSize: '11px', marginBottom: '4px' }}>
                    {(() => {
                      if (!formData.customer_postal || formData.customer_postal === '') {
                        return '〒'
                      }
                      const cleanPostal = formData.customer_postal.replace(/[^0-9]/g, '')
                      if (cleanPostal.length >= 7) {
                        return `〒${cleanPostal.substring(0, 3)}-${cleanPostal.substring(3, 7)}`
                      } else if (cleanPostal.length > 0) {
                        return `〒${cleanPostal}`
                      }
                      return '〒'
                    })()}
                  </div>
                  <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                    {formData.customer_address || ''}
                  </div>
                  <div className="flex items-baseline">
                    <div style={{ 
                      fontSize: '15px',
                      borderBottom: '1px solid #000',
                      width: '350px',
                      paddingBottom: '1px'
                    }}>
                      {formData.customer_name || ''}
                    </div>
                    <span style={{ 
                      fontSize: '15px',
                      marginLeft: '15px'
                    }}>御中</span>
                  </div>
                </div>
                
                {/* 見積内容 */}
                <div style={{ fontSize: '12px', marginBottom: '12px', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '10px' }}>{isInvoiceMode ? '下記の通り、御請求申し上げます。' : '下記の通り、御見積り申し上げます。'}</p>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ display: 'inline-block', width: '45px' }}>件名:</span>
                    <Input
                      value={formData.delivery_date || ''}
                      onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                      style={{
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: '1px solid #000',
                        borderRadius: '0',
                        display: 'inline-block',
                        width: '420px',
                        fontSize: '12px',
                        padding: '0 2px',
                        height: 'auto',
                        lineHeight: '1.2',
                        fontFamily: '"MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif'
                      }}
                      className="no-print-border"
                    />
                  </div>
                  {isInvoiceMode ? (
                    <div style={{ marginBottom: '5px' }}>
                      <span style={{ display: 'inline-block', width: '60px' }}>請求日:</span>
                      <Input
                        value={formData.billing_date || format(new Date(), 'yyyy年M月d日')}
                        onChange={(e) => setFormData({...formData, billing_date: e.target.value})}
                        style={{
                          fontSize: '12px',
                          display: 'inline-block',
                          width: '200px',
                          border: '1px solid #ddd',
                          padding: '2px 5px',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ marginBottom: '5px' }}>
                      <span style={{ display: 'inline-block', width: '45px' }}>納期:</span>
                      <span style={{
                        fontSize: '12px',
                        display: 'inline-block',
                        width: '150px',
                        marginRight: '30px'
                      }}>
                        {formData.delivery_period || ''}
                      </span>
                      <span style={{ marginRight: '5px' }}>取引方法:</span>
                      <span style={{
                        fontSize: '12px',
                        display: 'inline-block',
                        width: '150px'
                      }}>
                        {formData.transaction_method || ''}
                      </span>
                    </div>
                  )}
                  {!isInvoiceMode && (
                    <div>
                      <span style={{ display: 'inline-block', width: '65px' }}>有効期限:</span>
                      <span style={{ fontSize: '12px', display: 'inline-block', width: '150px' }}>
                        {formData.effective_period}
                      </span>
                    </div>
                  )}
                </div>

                {/* 合計金額 */}
                <div style={{ 
                  marginTop: '15px',
                  borderBottom: '1px solid #000',
                  paddingBottom: '3px'
                }}>
                  <span style={{ fontSize: '15px', marginRight: '25px' }}>合計金額</span>
                  <span style={{ fontSize: '20px' }}>
                    ¥{formData.total_amount.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '13px', marginLeft: '15px' }}>(税込)</span>
                </div>
              </div>

              {/* 右側 - 会社情報 */}
              <div style={{ width: '35%', textAlign: 'right' }}>
                <h1 style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                  fontWeight: 'normal',
                  letterSpacing: '2px'
                }}>{isInvoiceMode ? '御請求書' : '御見積書'}</h1>
                <div style={{ fontSize: '12px', marginBottom: '20px' }}>
                  No.{isInvoiceMode ? `INV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : formData.quotation_number}
                </div>

                <div className="relative inline-block text-left">
                  <div style={{ fontSize: '12px', lineHeight: '1.5', position: 'relative' }}>
                    <div style={{ marginBottom: '8px', letterSpacing: '1px' }}>
                      有限会社イワサキ内装
                    </div>
                    {/* 印鑑画像 - 見積書モードのみ */}
                    {!isInvoiceMode && (
                      <img
                        src="/hanko.png"
                        alt="印鑑"
                        className="print-stamp"
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '5px',
                          width: '65px',
                          height: '65px',
                          objectFit: 'contain',
                          opacity: 0.85,
                          filter: 'contrast(1.3) brightness(0.8)'
                        }}
                      />
                    )}
                    <div style={{ fontSize: '10px' }}>〒130-0021</div>
                    <div style={{ fontSize: '10px' }}>東京都墨田区緑1丁目-24-2タカミビル101</div>
                    <div style={{ fontSize: '10px' }}>登録番号：T6010602034026</div>
                    <div style={{ fontSize: '10px' }}>TEL:03-5638-7402　　FAX:03-5638-7403</div>
                    <div style={{ fontSize: '10px' }}>担当：岩﨑　泰氏</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 明細 */}
            <div className="mb-2">
              <table style={{ 
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px'
              }}>
                <thead>
                  <tr>
                    <th style={{ 
                      borderTop: '2px solid #000',
                      borderBottom: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'left',
                      fontWeight: 'normal',
                      width: '40%'
                    }}>内容</th>
                    <th style={{ 
                      borderTop: '2px solid #000',
                      borderBottom: '2px solid #000',
                      padding: '6px',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      width: '10%'
                    }}>数量</th>
                    <th style={{ 
                      borderTop: '2px solid #000',
                      borderBottom: '2px solid #000',
                      padding: '6px',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      width: '10%'
                    }}>単位</th>
                    <th style={{ 
                      borderTop: '2px solid #000',
                      borderBottom: '2px solid #000',
                      padding: '6px',
                      textAlign: 'right',
                      fontWeight: 'normal',
                      width: '15%'
                    }}>単価(税抜)</th>
                    <th style={{ 
                      borderTop: '2px solid #000',
                      borderBottom: '2px solid #000',
                      padding: '6px',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      width: '10%'
                    }}>税率</th>
                    <th style={{ 
                      borderTop: '2px solid #000',
                      borderBottom: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'right',
                      fontWeight: 'normal',
                      width: '15%'
                    }}>金額(税抜)</th>
                    <th style={{ 
                      borderTop: '2px solid #000',
                      borderBottom: '2px solid #000',
                      padding: '6px',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      width: '5%'
                    }}
                    className="no-print"
                    >削除</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ 
                        borderBottom: '1px solid #000',
                        padding: '5px 8px'
                      }}>
                        <Input 
                          value={item.item_name}
                          onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                          className="border-0 bg-transparent p-0 w-full h-6"
                          style={{ fontSize: '12px' }}
                          placeholder="内容を入力"
                        />
                      </td>
                      <td style={{ 
                        borderBottom: '1px solid #000',
                        padding: '5px',
                        textAlign: 'center'
                      }}>
                        <Input 
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          className="border-0 bg-transparent p-0 text-center w-full h-6"
                          style={{ fontSize: '12px' }}
                          type="number"
                        />
                      </td>
                      <td style={{ 
                        borderBottom: '1px solid #000',
                        padding: '5px',
                        textAlign: 'center'
                      }}>
                        <Input 
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                          className="border-0 bg-transparent p-0 text-center w-full h-6"
                          style={{ fontSize: '12px' }}
                          placeholder="式"
                        />
                      </td>
                      <td style={{ 
                        borderBottom: '1px solid #000',
                        padding: '5px',
                        textAlign: 'right'
                      }}>
                        <Input 
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                          className="border-0 bg-transparent p-0 text-right w-full h-6"
                          style={{ fontSize: '12px' }}
                          type="number"
                        />
                      </td>
                      <td style={{ 
                        borderBottom: '1px solid #000',
                        padding: '5px',
                        textAlign: 'center'
                      }}>
                        <select 
                          value={item.tax_rate}
                          onChange={(e) => updateItem(index, 'tax_rate', e.target.value)}
                          className="border-0 bg-transparent p-0 w-full text-center h-6"
                          style={{ fontSize: '12px', cursor: 'pointer' }}
                        >
                          <option value="">　</option>
                          <option value="10%">10%</option>
                          <option value="8%">8%</option>
                        </select>
                      </td>
                      <td style={{ 
                        borderBottom: '1px solid #000',
                        padding: '5px 8px',
                        textAlign: 'right',
                        fontSize: '12px'
                      }}>
                        ¥{item.amount || '0'}
                      </td>
                      <td style={{ 
                        borderBottom: '1px solid #000',
                        padding: '5px',
                        textAlign: 'center'
                      }}
                      className="no-print"
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                          className="p-1 h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <Button 
                size="sm" 
                variant="outline"
                className="mt-2 no-print"
                onClick={() => {
                  const newItems = [...formData.items,
                    { item_name: '', quantity: '', unit: '', unit_price: '', tax_rate: '10%', amount: '' }
                  ]
                  setFormData({...formData, items: newItems})
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                明細を追加
              </Button>
            </div>

            {/* 合計セクション */}
            <div className="flex justify-between" style={{ marginTop: '15px' }}>
              {/* 左側 - 税別内訳 */}
              <div>
                <table style={{ fontSize: '10px', marginLeft: '10px' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '2px 20px 2px 0' }}>税別内訳</td>
                      <td style={{ padding: '2px 20px', textAlign: 'right' }}>小計(税抜金額)</td>
                      <td style={{ padding: '2px 15px 2px 0', textAlign: 'right' }}>小計(税のみ)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 20px 2px 0' }}>10%対象分</td>
                      <td style={{ padding: '2px 20px', textAlign: 'right' }}>¥{subtotal10}</td>
                      <td style={{ padding: '2px 15px 2px 0', textAlign: 'right' }}>¥{tax10}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 20px 2px 0' }}>8%対象分</td>
                      <td style={{ padding: '2px 20px', textAlign: 'right' }}>¥{subtotal8}</td>
                      <td style={{ padding: '2px 15px 2px 0', textAlign: 'right' }}>¥{tax8}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 中央 - 請求書モード時に振込先を表示 */}
              {isInvoiceMode && (
                <div style={{
                  padding: '5px 20px',
                  fontFamily: '"MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif',
                  border: '1px solid #999',
                  alignSelf: 'center'
                }}>
                  <div style={{ fontSize: '10px', marginBottom: '3px', fontFamily: '"MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif' }}>お支払いにつきましては、下記口座へお振込みくださいますようお願い申し上げます。</div>
                  <div style={{ fontSize: '11px', fontFamily: '"MS Mincho", "MS 明朝", "ヒラギノ明朝 Pro", serif' }}>りそな銀行 神田支店（276）普通 1020315</div>
                </div>
              )}

              {/* 右側 - 合計 */}
              <div className="text-right mr-4">
                <div className="text-sm mb-1">
                  <span>小計（税抜金額）：</span>
                  <span className="font-semibold ml-2">¥{formData.subtotal.toLocaleString()}</span>
                </div>
                <div className="text-sm mb-1">
                  <span>消費税（10%）：</span>
                  <span className="font-semibold ml-2">¥{formData.tax_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-between mt-4 no-print">
            <div className="flex gap-2">
              <Button onClick={printInvoice} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                印刷
              </Button>
              <Button onClick={exportToPDF} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={isInvoiceMode ? handleSaveAsInvoice : handleSave} className="bg-blue-600 hover:bg-blue-700">
                {isInvoiceMode ? '請求書として保存' : '更新'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}