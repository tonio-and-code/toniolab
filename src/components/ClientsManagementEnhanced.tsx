'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  DollarSign,
  Eye,
  Download,
  Search,
  Filter,
  Users
} from 'lucide-react'
import { useDocuments, type Client } from '@/contexts/DocumentContext'
import { useDataSync } from '@/contexts/DataSyncContext'
import QuoteForm from '@/components/QuoteForm'
import InvoiceForm from '@/components/InvoiceForm'
import { useRouter } from 'next/navigation'

export default function ClientsManagementEnhanced() {
  const router = useRouter();
  const { 
    clients, 
    addClient, 
    updateClient, 
    deleteClient, 
    getQuotesByClient,
    getInvoicesByClient,
    quotes,
    invoices,
    createInvoiceFromQuote
  } = useDocuments()
  const { projects } = useDataSync()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientDialog, setShowClientDialog] = useState(false)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Partial<Client>>({
    companyName: '',
    companyNameKana: '',
    postalCode: '',
    address: '',
    phone: '',
    fax: '',
    email: '',
    contactPerson: '',
    contactPersonKana: '',
    department: '',
    website: '',
    taxNumber: '',
    notes: '',
    paymentTerms: '月末締め翌月末払い',
    creditLimit: 0,
    tags: [],
  })
  
  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleSaveClient = () => {
    if (!formData.companyName || !formData.address) {
      alert('会社名と住所は必須です')
      return
    }
    
    if (editingClient) {
      updateClient(editingClient.id, formData)
    } else {
      addClient(formData as Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'quotes' | 'invoices'>)
    }
    
    setShowClientDialog(false)
    setEditingClient(null)
    setFormData({
      companyName: '',
      companyNameKana: '',
      postalCode: '',
      address: '',
      phone: '',
      fax: '',
      email: '',
      contactPerson: '',
      contactPersonKana: '',
      department: '',
      website: '',
      taxNumber: '',
      notes: '',
      paymentTerms: '月末締め翌月末払い',
      creditLimit: 0,
      tags: [],
    })
  }
  
  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setFormData({
      companyName: client.companyName,
      companyNameKana: client.companyNameKana,
      postalCode: client.postalCode,
      address: client.address,
      phone: client.phone,
      fax: client.fax,
      email: client.email,
      contactPerson: client.contactPerson,
      contactPersonKana: client.contactPersonKana,
      department: client.department,
      website: client.website,
      taxNumber: client.taxNumber,
      notes: client.notes,
      paymentTerms: client.paymentTerms,
      creditLimit: client.creditLimit,
      tags: client.tags,
    })
    setShowClientDialog(true)
  }
  
  const handleDeleteClient = (clientId: string) => {
    if (confirm('この取引先を削除しますか？関連する見積書と請求書も削除されます。')) {
      deleteClient(clientId)
      if (selectedClient?.id === clientId) {
        setSelectedClient(null)
      }
    }
  }
  
  const calculateClientStats = (clientId: string) => {
    const clientQuotes = getQuotesByClient(clientId)
    const clientInvoices = getInvoicesByClient(clientId)
    
    const totalQuoted = clientQuotes.reduce((sum, q) => sum + q.total, 0)
    const totalInvoiced = clientInvoices.reduce((sum, i) => sum + i.total, 0)
    const totalPaid = clientInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + (i.paidAmount || 0), 0)
    const outstandingAmount = clientInvoices
      .filter(i => i.status === 'sent' || i.status === 'overdue')
      .reduce((sum, i) => sum + i.total, 0)
    
    return {
      totalQuoted,
      totalInvoiced,
      totalPaid,
      outstandingAmount,
      quoteCount: clientQuotes.length,
      invoiceCount: clientInvoices.length,
    }
  }
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">取引先管理</h1>
          <p className="text-gray-600">取引先情報と関連文書を管理</p>
        </div>
        <Button onClick={() => {
          setEditingClient(null)
          setFormData({
            companyName: '',
            companyNameKana: '',
            postalCode: '',
            address: '',
            phone: '',
            fax: '',
            email: '',
            contactPerson: '',
            contactPersonKana: '',
            department: '',
            website: '',
            taxNumber: '',
            notes: '',
            paymentTerms: '月末締め翌月末払い',
            creditLimit: 0,
            tags: [],
          })
          setShowClientDialog(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          新規取引先
        </Button>
      </div>
      
      {/* 検索バー */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="会社名、担当者、住所で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* メインコンテンツ */}
      <div className="grid grid-cols-3 gap-6">
        {/* 取引先リスト */}
        <div className="col-span-1">
          <Card className="h-[600px] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                取引先一覧
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredClients.map((client) => {
                const stats = calculateClientStats(client.id)
                return (
                  <div
                    key={client.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedClient?.id === client.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{client.companyName}</h3>
                        {client.contactPerson && (
                          <p className="text-sm text-gray-600">{client.contactPerson}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{client.address}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClient(client)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClient(client.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {stats.outstandingAmount > 0 && (
                      <div className="mt-2 text-xs text-orange-600">
                        未収金: ¥{stats.outstandingAmount.toLocaleString()}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
        
        {/* 詳細情報 */}
        <div className="col-span-2">
          {selectedClient ? (
            <Card className="h-[600px] overflow-y-auto">
              <CardHeader>
                <CardTitle>{selectedClient.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">基本情報</TabsTrigger>
                    <TabsTrigger value="quotes">見積書</TabsTrigger>
                    <TabsTrigger value="invoices">請求書</TabsTrigger>
                    <TabsTrigger value="projects">プロジェクト</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>会社名</Label>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span>{selectedClient.companyName}</span>
                        </div>
                      </div>
                      <div>
                        <Label>会社名カナ</Label>
                        <span>{selectedClient.companyNameKana || '-'}</span>
                      </div>
                      <div>
                        <Label>郵便番号</Label>
                        <span>{selectedClient.postalCode || '-'}</span>
                      </div>
                      <div>
                        <Label>住所</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{selectedClient.address}</span>
                        </div>
                      </div>
                      <div>
                        <Label>電話番号</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedClient.phone || '-'}</span>
                        </div>
                      </div>
                      <div>
                        <Label>FAX</Label>
                        <span>{selectedClient.fax || '-'}</span>
                      </div>
                      <div>
                        <Label>メールアドレス</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{selectedClient.email || '-'}</span>
                        </div>
                      </div>
                      <div>
                        <Label>ウェブサイト</Label>
                        <span>{selectedClient.website || '-'}</span>
                      </div>
                      <div>
                        <Label>担当者</Label>
                        <span>{selectedClient.contactPerson || '-'}</span>
                      </div>
                      <div>
                        <Label>部署</Label>
                        <span>{selectedClient.department || '-'}</span>
                      </div>
                      <div>
                        <Label>支払条件</Label>
                        <span>{selectedClient.paymentTerms || '-'}</span>
                      </div>
                      <div>
                        <Label>与信限度額</Label>
                        <span>¥{(selectedClient.creditLimit || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {selectedClient.notes && (
                      <div>
                        <Label>備考</Label>
                        <p className="mt-1 text-sm">{selectedClient.notes}</p>
                      </div>
                    )}
                    
                    {/* 統計情報 */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {(() => {
                        const stats = calculateClientStats(selectedClient.id)
                        return (
                          <>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                  ¥{stats.totalQuoted.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">見積総額</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-2xl font-bold">
                                  ¥{stats.totalInvoiced.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">請求総額</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-orange-600">
                                  ¥{stats.outstandingAmount.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">未収金額</p>
                              </CardContent>
                            </Card>
                          </>
                        )
                      })()}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quotes" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">見積書一覧</h3>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedQuoteId(null)
                          setShowQuoteDialog(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        新規見積書
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>見積番号</TableHead>
                          <TableHead>発行日</TableHead>
                          <TableHead>工事名</TableHead>
                          <TableHead>金額</TableHead>
                          <TableHead>ステータス</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getQuotesByClient(selectedClient.id).map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell>{quote.quoteNumber}</TableCell>
                            <TableCell>{quote.issueDate}</TableCell>
                            <TableCell>{quote.projectName || '-'}</TableCell>
                            <TableCell>¥{quote.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {quote.status === 'draft' ? '下書き' :
                                 quote.status === 'sent' ? '送付済み' :
                                 quote.status === 'accepted' ? '承認済み' : '却下'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedQuoteId(quote.id)
                                    setShowQuoteDialog(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {quote.status === 'accepted' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      const invoiceId = createInvoiceFromQuote(quote.id)
                                      setSelectedInvoiceId(invoiceId)
                                      setShowInvoiceDialog(true)
                                    }}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="invoices" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">請求書一覧</h3>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedInvoiceId(null)
                          setShowInvoiceDialog(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        新規請求書
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>請求番号</TableHead>
                          <TableHead>発行日</TableHead>
                          <TableHead>支払期日</TableHead>
                          <TableHead>金額</TableHead>
                          <TableHead>ステータス</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getInvoicesByClient(selectedClient.id).map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>¥{invoice.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {invoice.status === 'draft' ? '下書き' :
                                 invoice.status === 'sent' ? '送付済み' :
                                 invoice.status === 'paid' ? '入金済み' :
                                 invoice.status === 'overdue' ? '期限超過' : 'キャンセル'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedInvoiceId(invoice.id)
                                  setShowInvoiceDialog(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="projects" className="space-y-4">
                    <h3 className="font-semibold">関連プロジェクト</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>プロジェクト名</TableHead>
                          <TableHead>開始日</TableHead>
                          <TableHead>終了日</TableHead>
                          <TableHead>ステータス</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects
                          .filter(p => p.client_name === selectedClient.companyName)
                          .map((project) => (
                            <TableRow key={project.id}>
                              <TableCell>
                                <span 
                                  className="cursor-pointer hover:text-blue-600 hover:underline"
                                  onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                                >
                                  {project.project_name}
                                </span>
                              </TableCell>
                              <TableCell>{project.start_date}</TableCell>
                              <TableCell>{project.end_date}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  project.status === '完了' ? 'bg-green-100 text-green-800' :
                                  project.status === '施工中' ? 'bg-blue-100 text-blue-800' :
                                  project.status === '保留' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>取引先を選択してください</p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* 取引先追加/編集ダイアログ */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? '取引先編集' : '新規取引先'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>会社名 *</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label>会社名カナ</Label>
                <Input
                  value={formData.companyNameKana}
                  onChange={(e) => setFormData({ ...formData, companyNameKana: e.target.value })}
                />
              </div>
              <div>
                <Label>郵便番号</Label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="123-4567"
                />
              </div>
              <div>
                <Label>住所 *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label>電話番号</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>FAX</Label>
                <Input
                  value={formData.fax}
                  onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                />
              </div>
              <div>
                <Label>メールアドレス</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>ウェブサイト</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div>
                <Label>担当者名</Label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
              <div>
                <Label>担当者名カナ</Label>
                <Input
                  value={formData.contactPersonKana}
                  onChange={(e) => setFormData({ ...formData, contactPersonKana: e.target.value })}
                />
              </div>
              <div>
                <Label>部署</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div>
                <Label>税務番号</Label>
                <Input
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>支払条件</Label>
                <Input
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                />
              </div>
              <div>
                <Label>与信限度額</Label>
                <Input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label>備考</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClientDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveClient}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 見積書ダイアログ */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <QuoteForm
            quote={selectedQuoteId ? quotes.find(q => q.id === selectedQuoteId) : undefined}
            clientId={selectedClient?.id}
            onSave={() => {
              setShowQuoteDialog(false)
              setSelectedQuoteId(null)
            }}
            onCancel={() => {
              setShowQuoteDialog(false)
              setSelectedQuoteId(null)
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* 請求書ダイアログ */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <InvoiceForm
            invoice={selectedInvoiceId ? invoices.find(i => i.id === selectedInvoiceId) : undefined}
            clientId={selectedClient?.id}
            onSave={() => {
              setShowInvoiceDialog(false)
              setSelectedInvoiceId(null)
            }}
            onCancel={() => {
              setShowInvoiceDialog(false)
              setSelectedInvoiceId(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}