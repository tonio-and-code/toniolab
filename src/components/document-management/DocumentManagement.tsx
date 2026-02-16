'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Upload, Search, FileText, Download, Eye, Trash2, Filter, Calendar, DollarSign, Tag, Link, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ProjectSelect } from '@/components/ui/project-select'

interface Project {
  id: string
  project_name: string
  created_at: string
  customer_name?: string
  receivable_amount?: number
}

interface Document {
  id: string
  created_at: string
  document_type: string
  document_number?: string
  title: string
  description?: string
  issue_date?: string
  due_date?: string
  payment_date?: string
  status: string
  subtotal: number
  tax_amount: number
  total_amount: number
  file_url: string
  file_name?: string
  thumbnail_url?: string
  ocr_text?: string
  vendor?: { id: string; customer_name: string }
  project?: { id: string; project_name: string }
  tags?: Array<{ tag: { id: string; name: string; color: string } }>
}

interface SearchFilters {
  keyword: string
  documentType: string
  status: string
  vendorId: string
  projectId: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
  tags: string[]
}

export function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    documentType: 'all',
    status: 'all',
    vendorId: 'all',
    projectId: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    tags: []
  })
  const [vendors, setVendors] = useState<Array<{ id: string; customer_name: string }>>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tags, setTags] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadData, setUploadData] = useState({
    documentType: 'receipt',
    vendorId: 'none',
    projectId: 'none',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: '',
    amount: '',
    description: '',
    tags: [] as string[]
  })

  const supabase = createClient()

  useEffect(() => {
    fetchDocuments()
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    const [vendorsRes, projectsRes, tagsRes] = await Promise.all([
      supabase.from('customers').select('id, customer_name').order('customer_name'),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('tags').select('*').order('name')
    ])

    setVendors(vendorsRes.data || [])

    // Add customer info to projects
    const projectsWithCustomers = await Promise.all(
      (projectsRes.data || []).map(async (project) => {
        if (project.receivable_customer_id) {
          const { data: customerData } = await supabase
            .from('customers')
            .select('customer_name')
            .eq('id', project.receivable_customer_id)
            .single()

          return {
            ...project,
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
    setTags(tagsRes.data || [])
  }

  const fetchDocuments = async () => {
    setLoading(true)
    
    // シンプルなクエリから開始
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    // フィルターは一旦コメントアウト（基本的な取得を優先）
    // if (filters.keyword) {
    //   query = query.or(`title.ilike.%${filters.keyword}%`)
    // }

    const { data, error } = await query

    if (error) {
      toast.error(`証憑の取得に失敗しました: ${error?.message || 'Unknown error'}`)

      // テーブルが存在しない場合のメッセージ
      if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
        toast.error('documentsテーブルが存在しません。SQLマイグレーション19を実行してください')
      }
    } else {
      setDocuments(data || [])
    }
    
    setLoading(false)
  }

  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.error('ファイルを選択してください')
      return
    }

    try {
      // Upload file to Supabase Storage
      const timestamp = Date.now()
      // ファイル名をサニタイズ（英数字とピリオド、ハイフン、アンダースコアのみ許可）
      const fileExt = uploadFile.name.split('.').pop() || 'file'
      const sanitizedName = uploadFile.name
        .replace(/\.[^/.]+$/, '') // 拡張子を除去
        .replace(/[^a-zA-Z0-9_-]/g, '_') // 特殊文字を_に置換
        .substring(0, 50) // 長さ制限
      const fileName = `${timestamp}_${sanitizedName}.${fileExt}`
      const filePath = `documents/${fileName}`
      
      const { data: storageData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, uploadFile)

      if (uploadError) {
        // バケットが存在しない場合は作成を促す
        if (uploadError.message?.includes('not found')) {
          toast.error('Storageバケット"documents"を作成してください')
          return
        }
        toast.error(`アップロードエラー: ${uploadError.message}`)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // Calculate amounts
      const amount = parseFloat(uploadData.amount) || 0
      const taxRate = 0.10
      const taxAmount = Math.floor(amount * taxRate)
      const totalAmount = amount + taxAmount

      // Get current user (optional for development)
      const { data: { user } } = await supabase.auth.getUser()
      
      // Save to database - シンプルなデータから開始
      const insertData = {
        document_type: uploadData.documentType,
        title: uploadFile.name,
        status: 'received',
        file_url: publicUrl,
        file_name: uploadFile.name,
        file_size: uploadFile.size,
        mime_type: uploadFile.type,
        total_amount: totalAmount
      }

      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert(insertData)
        .select()
        .single()

      if (dbError) {
        // テーブルが存在しない場合
        if (dbError.code === '42P01') {
          toast.error('documentsテーブルが存在しません。SQLマイグレーション15を実行してください')
        } else {
          toast.error(`データベースエラー: ${dbError.message || 'データの保存に失敗しました'}`)
        }
        return
      }

      // Handle tags
      if (uploadData.tags.length > 0 && documentData) {
        const tagInserts = uploadData.tags.map(tagName => {
          const tag = tags.find(t => t.name === tagName)
          if (tag) {
            return {
              document_id: documentData.id,
              tag_id: tag.id
            }
          }
          return null
        }).filter(Boolean)

        if (tagInserts.length > 0) {
          await supabase
            .from('document_tags')
            .insert(tagInserts)
        }
      }

      toast.success('証憑をアップロードしました')
      setUploadDialogOpen(false)
      setUploadFile(null)
      setUploadData({
        documentType: 'receipt',
        vendorId: 'none',
        projectId: 'none',
        issueDate: format(new Date(), 'yyyy-MM-dd'),
        dueDate: '',
        amount: '',
        description: '',
        tags: []
      })
      fetchDocuments()
    } catch (error: any) {
      toast.error(`エラー: ${error?.message || 'アップロード中にエラーが発生しました'}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この証憑を削除してもよろしいですか？')) return

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('削除に失敗しました')
    } else {
      toast.success('証憑を削除しました')
      fetchDocuments()
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      draft: { label: '下書き', variant: 'secondary' },
      sent: { label: '送付済み', variant: 'default' },
      received: { label: '受領済み', variant: 'default' },
      approved: { label: '承認済み', variant: 'default' },
      paid: { label: '支払済み', variant: 'default' },
      overdue: { label: '期限超過', variant: 'destructive' },
      cancelled: { label: 'キャンセル', variant: 'outline' },
      archived: { label: 'アーカイブ', variant: 'secondary' }
    }
    const config = statusMap[status] || { label: status, variant: 'default' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getDocumentTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      receipt: '領収書',
      invoice_sent: '請求書(送付)',
      invoice_received: '請求書(受領)',
      quote: '見積書',
      contract: '契約書',
      purchase_order: '発注書',
      delivery_note: '納品書',
      bank_statement: '銀行明細',
      tax_document: '税務書類',
      other: 'その他'
    }
    return typeMap[type] || type
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">証憑管理</h1>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              証憑をアップロード
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>証憑のアップロード</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>ファイル選択</Label>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>証憑タイプ</Label>
                  <Select value={uploadData.documentType} onValueChange={(v) => setUploadData({...uploadData, documentType: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">領収書</SelectItem>
                      <SelectItem value="invoice_sent">請求書(送付)</SelectItem>
                      <SelectItem value="invoice_received">請求書(受領)</SelectItem>
                      <SelectItem value="quote">見積書</SelectItem>
                      <SelectItem value="contract">契約書</SelectItem>
                      <SelectItem value="purchase_order">発注書</SelectItem>
                      <SelectItem value="delivery_note">納品書</SelectItem>
                      <SelectItem value="bank_statement">銀行明細</SelectItem>
                      <SelectItem value="tax_document">税務書類</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>取引先</Label>
                  <Select value={uploadData.vendorId} onValueChange={(v) => setUploadData({...uploadData, vendorId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">なし</SelectItem>
                      {vendors.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.customer_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>案件</Label>
                  <ProjectSelect
                    projects={projects}
                    value={uploadData.projectId === 'none' ? '' : uploadData.projectId}
                    onValueChange={(v) => setUploadData({...uploadData, projectId: v || 'none'})}
                    placeholder="選択してください"
                    showCustomerName={true}
                    showAmount={true}
                  />
                </div>
                
                <div>
                  <Label>金額</Label>
                  <Input
                    type="number"
                    value={uploadData.amount}
                    onChange={(e) => setUploadData({...uploadData, amount: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label>発行日</Label>
                  <Input
                    type="date"
                    value={uploadData.issueDate}
                    onChange={(e) => setUploadData({...uploadData, issueDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>支払期日</Label>
                  <Input
                    type="date"
                    value={uploadData.dueDate}
                    onChange={(e) => setUploadData({...uploadData, dueDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label>説明</Label>
                <Input
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  placeholder="証憑の説明を入力"
                />
              </div>
              
              <div>
                <Label>タグ</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={uploadData.tags.includes(tag.name) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        if (uploadData.tags.includes(tag.name)) {
                          setUploadData({...uploadData, tags: uploadData.tags.filter(t => t !== tag.name)})
                        } else {
                          setUploadData({...uploadData, tags: [...uploadData.tags, tag.name]})
                        }
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleFileUpload}>
                  アップロード
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">検索・一覧</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {/* 検索フィルター */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">検索フィルター</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>キーワード</Label>
                  <Input
                    placeholder="タイトル、説明、OCRテキスト"
                    value={filters.keyword}
                    onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>証憑タイプ</Label>
                  <Select value={filters.documentType} onValueChange={(v) => setFilters({...filters, documentType: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="receipt">領収書</SelectItem>
                      <SelectItem value="invoice_sent">請求書(送付)</SelectItem>
                      <SelectItem value="invoice_received">請求書(受領)</SelectItem>
                      <SelectItem value="quote">見積書</SelectItem>
                      <SelectItem value="contract">契約書</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>ステータス</Label>
                  <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="draft">下書き</SelectItem>
                      <SelectItem value="sent">送付済み</SelectItem>
                      <SelectItem value="received">受領済み</SelectItem>
                      <SelectItem value="approved">承認済み</SelectItem>
                      <SelectItem value="paid">支払済み</SelectItem>
                      <SelectItem value="overdue">期限超過</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>取引先</Label>
                  <Select value={filters.vendorId} onValueChange={(v) => setFilters({...filters, vendorId: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {vendors.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.customer_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>案件</Label>
                  <ProjectSelect
                    projects={projects}
                    value={filters.projectId === 'all' ? '' : filters.projectId}
                    onValueChange={(v) => setFilters({...filters, projectId: v || 'all'})}
                    placeholder="すべて"
                    showCustomerName={true}
                    showAmount={false}
                  />
                </div>
                
                <div>
                  <Label>発行日（開始）</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>発行日（終了）</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button onClick={fetchDocuments} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    検索
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 証憑一覧 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">証憑一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>発行日</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>取引先</TableHead>
                    <TableHead>案件</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>タグ</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        {doc.created_at ? format(new Date(doc.created_at), 'yyyy/MM/dd', { locale: ja }) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{doc.title || doc.file_name || '-'}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">{formatCurrency(doc.total_amount || 0)}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(doc.file_url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">証憑総数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{documents.length}</div>
                <p className="text-sm text-muted-foreground">登録済み証憑</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">今月の総額</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(
                    documents
                      .filter(d => d.issue_date && new Date(d.issue_date).getMonth() === new Date().getMonth())
                      .reduce((sum, d) => sum + d.total_amount, 0)
                  )}
                </div>
                <p className="text-sm text-muted-foreground">今月分の合計</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">未処理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {documents.filter(d => d.status === 'draft' || d.status === 'received').length}
                </div>
                <p className="text-sm text-muted-foreground">処理待ち証憑</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}