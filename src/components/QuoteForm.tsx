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
import { Plus, Trash2, Save, FileText, Calculator } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { useDocuments, type Quote, type QuoteItem } from '@/contexts/DocumentContext'
import { useDataSync } from '@/contexts/DataSyncContext'

interface QuoteFormProps {
  quote?: Quote
  clientId?: string
  projectId?: string
  onSave?: (quoteId: string) => void
  onCancel?: () => void
}

export default function QuoteForm({ quote, clientId, projectId, onSave, onCancel }: QuoteFormProps) {
  const { clients, addQuote, updateQuote, generateQuoteNumber, calculateTotals, linkQuoteToProject } = useDocuments()
  const { projects } = useDataSync()
  
  const [formData, setFormData] = useState<Partial<Quote>>({
    quoteNumber: quote?.quoteNumber || '',
    issueDate: quote?.issueDate || format(new Date(), 'yyyy-MM-dd'),
    expiryDate: quote?.expiryDate || format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    clientId: quote?.clientId || clientId || '',
    clientName: quote?.clientName || '',
    clientAddress: quote?.clientAddress || '',
    projectId: quote?.projectId || projectId || '',
    projectName: quote?.projectName || '',
    constructionSite: quote?.constructionSite || '',
    constructionPeriod: quote?.constructionPeriod || '',
    paymentTerms: quote?.paymentTerms || '月末締め翌月末払い',
    deliveryDate: quote?.deliveryDate || '',
    items: quote?.items || [],
    subtotal: quote?.subtotal || 0,
    tax: quote?.tax || 0,
    total: quote?.total || 0,
    notes: quote?.notes || '',
    status: quote?.status || 'draft',
  })
  
  const [newItem, setNewItem] = useState<Partial<QuoteItem>>({
    description: '',
    quantity: 1,
    unit: '式',
    unitPrice: 0,
    amount: 0,
  })
  
  useEffect(() => {
    if (!formData.quoteNumber && !quote) {
      setFormData(prev => ({ ...prev, quoteNumber: generateQuoteNumber() }))
    }
  }, [generateQuoteNumber, quote])
  
  useEffect(() => {
    if (formData.clientId) {
      const client = clients.find(c => c.id === formData.clientId)
      if (client) {
        setFormData(prev => ({
          ...prev,
          clientName: client.companyName,
          clientAddress: client.address,
          paymentTerms: client.paymentTerms || prev.paymentTerms,
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
          constructionPeriod: `${project.start_date} ～ ${project.end_date}`,
        }))
      }
    }
  }, [formData.projectId, projects])
  
  const handleAddItem = () => {
    if (!newItem.description || !newItem.unitPrice) return
    
    const item: QuoteItem = {
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
    
    let quoteId: string
    
    if (quote) {
      updateQuote(quote.id, formData)
      quoteId = quote.id
    } else {
      quoteId = addQuote(formData as Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>)
    }
    
    // プロジェクトとの連携
    if (formData.projectId && formData.projectName) {
      linkQuoteToProject(quoteId, formData.projectId, formData.projectName)
    }
    
    if (onSave) {
      onSave(quoteId)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            見積書 {formData.quoteNumber}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>見積番号</Label>
              <Input value={formData.quoteNumber} disabled />
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
              <Label>有効期限</Label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
            <div>
              <Label>ステータス</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Quote['status']) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="sent">送付済み</SelectItem>
                  <SelectItem value="accepted">承認済み</SelectItem>
                  <SelectItem value="rejected">却下</SelectItem>
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
            <h3 className="font-semibold">工事情報</h3>
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label>工事名</Label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="工事名を入力"
                />
              </div>
              <div>
                <Label>工事場所</Label>
                <Input
                  value={formData.constructionSite}
                  onChange={(e) => setFormData({ ...formData, constructionSite: e.target.value })}
                  placeholder="工事場所を入力"
                />
              </div>
              <div>
                <Label>工期</Label>
                <Input
                  value={formData.constructionPeriod}
                  onChange={(e) => setFormData({ ...formData, constructionPeriod: e.target.value })}
                  placeholder="例: 2024年1月～2024年3月"
                />
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
          
          {/* その他情報 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>納期</Label>
                <Input
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  placeholder="納期を入力"
                />
              </div>
              <div>
                <Label>支払条件</Label>
                <Input
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  placeholder="支払条件を入力"
                />
              </div>
            </div>
            <div>
              <Label>備考</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="備考を入力"
                rows={3}
              />
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex justify-end gap-2">
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
        </CardContent>
      </Card>
    </div>
  )
}