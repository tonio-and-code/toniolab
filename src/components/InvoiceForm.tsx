'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Save, FileText, DollarSign, CheckCircle } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { useDocuments, type Invoice, type InvoiceItem } from '@/contexts/DocumentContext'
import { useDataSync } from '@/contexts/DataSyncContext'

interface InvoiceFormProps {
  invoice?: Invoice
  clientId?: string
  projectId?: string
  quoteId?: string
  onSave?: (invoiceId: string) => void
  onCancel?: () => void
}

export default function InvoiceForm({ invoice, clientId, projectId, quoteId, onSave, onCancel }: InvoiceFormProps) {
  const { 
    clients, 
    quotes,
    addInvoice, 
    updateInvoice, 
    generateInvoiceNumber, 
    calculateTotals, 
    linkInvoiceToProject,
    markInvoiceAsPaid 
  } = useDocuments()
  const { projects, addFundsEntry } = useDataSync()
  
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: invoice?.invoiceNumber || '',
    issueDate: invoice?.issueDate || format(new Date(), 'yyyy-MM-dd'),
    dueDate: invoice?.dueDate || format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    clientId: invoice?.clientId || clientId || '',
    clientName: invoice?.clientName || '',
    clientAddress: invoice?.clientAddress || '',
    projectId: invoice?.projectId || projectId || '',
    projectName: invoice?.projectName || '',
    quoteId: invoice?.quoteId || quoteId || '',
    items: invoice?.items || [],
    subtotal: invoice?.subtotal || 0,
    tax: invoice?.tax || 0,
    total: invoice?.total || 0,
    paymentMethod: invoice?.paymentMethod || '銀行振込',
    bankInfo: invoice?.bankInfo || '○○銀行 △△支店\n普通 1234567\nイワサキナイソウ（カ',
    notes: invoice?.notes || '',
    status: invoice?.status || 'draft',
    paidDate: invoice?.paidDate || '',
    paidAmount: invoice?.paidAmount || 0,
  })
  
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    description: '',
    quantity: 1,
    unit: '式',
    unitPrice: 0,
    amount: 0,
  })
  
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentData, setPaymentData] = useState({
    paidDate: format(new Date(), 'yyyy-MM-dd'),
    paidAmount: formData.total || 0,
  })
  
  useEffect(() => {
    if (!formData.invoiceNumber && !invoice) {
      setFormData(prev => ({ ...prev, invoiceNumber: generateInvoiceNumber() }))
    }
  }, [generateInvoiceNumber, invoice])
  
  useEffect(() => {
    if (formData.clientId) {
      const client = clients.find(c => c.id === formData.clientId)
      if (client) {
        setFormData(prev => ({
          ...prev,
          clientName: client.companyName,
          clientAddress: client.address,
          paymentMethod: prev.paymentMethod || '銀行振込',
        }))
      }
    }
  }, [formData.clientId, clients])
  
  useEffect(() => {
    if (formData.projectId) {
      const project = projects.find(p => p.id === formData.projectId)
      if (project) {
        setFormData(prev => ({
          ...prev,
          projectName: project.project_name,
        }))
      }
    }
  }, [formData.projectId, projects])
  
  useEffect(() => {
    if (formData.quoteId) {
      const quote = quotes.find(q => q.id === formData.quoteId)
      if (quote) {
        setFormData(prev => ({
          ...prev,
          items: quote.items.map(item => ({
            id: `inv_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            amount: item.amount,
          })),
          subtotal: quote.subtotal,
          tax: quote.tax,
          total: quote.total,
        }))
      }
    }
  }, [formData.quoteId, quotes])
  
  const handleAddItem = () => {
    if (!newItem.description || !newItem.unitPrice) return
    
    const item: InvoiceItem = {
      id: `item_${Date.now()}`,
      description: newItem.description!,
      quantity: newItem.quantity || 1,
      unit: newItem.unit || '式',
      unitPrice: newItem.unitPrice!,
      amount: (newItem.quantity || 1) * newItem.unitPrice!,
    }
    
    const updatedItems = [...(formData.items || []), item]
    const totals = calculateTotals(updatedItems)
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      ...totals,
    }))
    
    setNewItem({
      description: '',
      quantity: 1,
      unit: '式',
      unitPrice: 0,
      amount: 0,
    })
  }
  
  const handleRemoveItem = (itemId: string) => {
    const updatedItems = (formData.items || []).filter(item => item.id !== itemId)
    const totals = calculateTotals(updatedItems)
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      ...totals,
    }))
  }
  
  const handleSave = () => {
    if (!formData.clientId || !formData.items || formData.items.length === 0) {
      alert('取引先と明細項目を入力してください')
      return
    }
    
    let invoiceId: string
    
    if (invoice) {
      updateInvoice(invoice.id, formData)
      invoiceId = invoice.id
    } else {
      invoiceId = addInvoice(formData as Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>)
    }
    
    // プロジェクトとの連携
    if (formData.projectId && formData.projectName) {
      linkInvoiceToProject(invoiceId, formData.projectId, formData.projectName)
    }
    
    // 資金表に自動追加（ステータスが送付済みの場合）
    if (formData.status === 'sent' && formData.projectId) {
      addFundsEntry({
        amount: formData.total || 0,
        description: `請求書 ${formData.invoiceNumber} - ${formData.projectName}`,
        type: 'revenue',
        date: formData.dueDate || format(new Date(), 'yyyy-MM-dd'),
        projectId: formData.projectId,
      })
    }
    
    if (onSave) {
      onSave(invoiceId)
    }
  }
  
  const handleMarkAsPaid = () => {
    if (!invoice) return
    
    markInvoiceAsPaid(invoice.id, paymentData.paidDate, paymentData.paidAmount)
    
    // 資金表に入金記録を追加
    if (formData.projectId) {
      addFundsEntry({
        amount: paymentData.paidAmount,
        description: `入金 - 請求書 ${formData.invoiceNumber}`,
        type: 'revenue',
        date: paymentData.paidDate,
        projectId: formData.projectId,
      })
    }
    
    setShowPaymentDialog(false)
    if (onSave) {
      onSave(invoice.id)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            請求書 {formData.invoiceNumber}
            {formData.status === 'paid' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>請求番号</Label>
              <Input value={formData.invoiceNumber} disabled />
            </div>
            <div>
              <Label>発行日</Label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>
            <div>
              <Label>支払期日</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label>ステータス</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Invoice['status']) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="sent">送付済み</SelectItem>
                  <SelectItem value="paid">入金済み</SelectItem>
                  <SelectItem value="overdue">期限超過</SelectItem>
                  <SelectItem value="cancelled">キャンセル</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 取引先情報 */}
          <div className="space-y-4">
            <h3 className="font-semibold">取引先情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>取引先</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="取引先を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>住所</Label>
                <Input value={formData.clientAddress} disabled />
              </div>
            </div>
          </div>
          
          {/* プロジェクト情報 */}
          <div className="space-y-4">
            <h3 className="font-semibold">関連情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>見積書</Label>
                <Select
                  value={formData.quoteId}
                  onValueChange={(value) => setFormData({ ...formData, quoteId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="見積書を選択（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    {quotes
                      .filter(q => q.clientId === formData.clientId)
                      .map((quote) => (
                        <SelectItem key={quote.id} value={quote.id}>
                          {quote.quoteNumber} - {quote.projectName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>プロジェクト</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="プロジェクトを選択（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.project_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* 明細 */}
          <div className="space-y-4">
            <h3 className="font-semibold">明細</h3>
            
            {/* 新規項目追加 */}
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-2">
                <Input
                  placeholder="品名・仕様"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="数量"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Input
                  placeholder="単位"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="単価"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ 
                    ...newItem, 
                    unitPrice: parseInt(e.target.value) || 0,
                    amount: (newItem.quantity || 1) * (parseInt(e.target.value) || 0)
                  })}
                />
              </div>
              <div>
                <Button onClick={handleAddItem} className="w-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* 明細リスト */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>品名・仕様</TableHead>
                  <TableHead className="w-24">数量</TableHead>
                  <TableHead className="w-20">単位</TableHead>
                  <TableHead className="w-32">単価</TableHead>
                  <TableHead className="w-32">金額</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(formData.items || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>¥{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell>¥{item.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* 合計 */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥{(formData.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>消費税（10%）</span>
                  <span>¥{(formData.tax || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>合計</span>
                  <span>¥{(formData.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 支払情報 */}
          <div className="space-y-4">
            <h3 className="font-semibold">支払情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>支払方法</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="銀行振込">銀行振込</SelectItem>
                    <SelectItem value="現金">現金</SelectItem>
                    <SelectItem value="小切手">小切手</SelectItem>
                    <SelectItem value="クレジットカード">クレジットカード</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.status === 'paid' && (
                <div>
                  <Label>入金日</Label>
                  <Input value={formData.paidDate} disabled />
                </div>
              )}
            </div>
            {formData.paymentMethod === '銀行振込' && (
              <div>
                <Label>振込先情報</Label>
                <Textarea
                  value={formData.bankInfo}
                  onChange={(e) => setFormData({ ...formData, bankInfo: e.target.value })}
                  rows={3}
                />
              </div>
            )}
          </div>
          
          {/* 備考 */}
          <div>
            <Label>備考</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="備考を入力"
              rows={3}
            />
          </div>
          
          {/* アクションボタン */}
          <div className="flex justify-between">
            <div>
              {invoice && formData.status === 'sent' && (
                <Button 
                  variant="outline"
                  onClick={() => setShowPaymentDialog(true)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  入金処理
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  キャンセル
                </Button>
              )}
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 入金処理ダイアログ */}
      {showPaymentDialog && (
        <Card>
          <CardHeader>
            <CardTitle>入金処理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>入金日</Label>
              <Input
                type="date"
                value={paymentData.paidDate}
                onChange={(e) => setPaymentData({ ...paymentData, paidDate: e.target.value })}
              />
            </div>
            <div>
              <Label>入金額</Label>
              <Input
                type="number"
                value={paymentData.paidAmount}
                onChange={(e) => setPaymentData({ ...paymentData, paidAmount: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={handleMarkAsPaid}>
                <CheckCircle className="h-4 w-4 mr-2" />
                入金確認
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}