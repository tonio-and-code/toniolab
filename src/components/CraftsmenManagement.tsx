'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { MessageSquare, Edit2, Trash2, Plus, Phone, MapPin, Mail, ExternalLink, Eye, Copy, LayoutGrid, List, Users, TrendingUp } from 'lucide-react'
import type { Craftsman } from '@/types/database'
import { CraftsmanDetailModal } from './CraftsmanDetailModal'

export function CraftsmenManagement() {
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([])
  const [selectedCraftsman, setSelectedCraftsman] = useState<Craftsman | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterTrade, setFilterTrade] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [detailModalCraftsman, setDetailModalCraftsman] = useState<Craftsman | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [showEmailList, setShowEmailList] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  const supabase = createClient()

  const trades = ['床', 'クロス', 'その他']

  useEffect(() => {
    fetchCraftsmen()
  }, [])

  const fetchCraftsmen = async () => {
    try {
      const { data, error } = await supabase
        .from('craftsmen')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error


      setCraftsmen(data || [])
    } catch {
      toast.error('職人データの取得に失敗しました')
    }
  }

  const filteredCraftsmen = craftsmen.filter(craftsman => {
    const matchesTrade = filterTrade === 'all' || craftsman.trade === filterTrade
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'awaiting_reply' && craftsman.awaiting_reply) ||
      (filterStatus === 'message_sent' && craftsman.message_sent && !craftsman.awaiting_reply)
    const matchesSearch =
      searchTerm === '' ||
      craftsman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (craftsman.address && craftsman.address.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesTrade && matchesStatus && matchesSearch
  })

  const handleCopyEmails = () => {
    const emails = filteredCraftsmen
      .filter(c => c.email)
      .map(c => c.email)
      .join('; ')

    if (emails) {
      navigator.clipboard.writeText(emails)
      toast.success(`${filteredCraftsmen.filter(c => c.email).length}件のメールアドレスをコピーしました`)
    } else {
      toast.error('コピーできるメールアドレスがありません')
    }
  }

  const handleSave = async (formData: any) => {
    setLoading(true)
    try {
      // 空文字列をnullに変換
      const dataToSave = {
        name: formData.name,
        trade: formData.trade,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        sukedachi_url: formData.sukedachi_url || null,
        message_sent: formData.message_sent,
        awaiting_reply: formData.awaiting_reply,
        notes: formData.notes || null,
        details: formData.details
      }


      if (selectedCraftsman) {
        const { error } = await supabase
          .from('craftsmen')
          .update(dataToSave)
          .eq('id', selectedCraftsman.id)

        if (error) {
          toast.error(`更新エラー: ${error.message}`)
          return
        }
        toast.success('職人情報を更新しました')
      } else {
        const { error } = await supabase
          .from('craftsmen')
          .insert([dataToSave])

        if (error) {
          toast.error(`登録エラー: ${error.message}`)
          return
        }
        toast.success('職人を登録しました')
      }

      await fetchCraftsmen()
      setIsDialogOpen(false)
      setSelectedCraftsman(null)
    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return

    try {
      const { error } = await supabase
        .from('craftsmen')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('職人を削除しました')
      fetchCraftsmen()
    } catch {
      toast.error('削除に失敗しました')
    }
  }

  const getStatusBadge = (craftsman: Craftsman) => {
    if (craftsman.awaiting_reply) {
      return <Badge variant="secondary">返信待ち</Badge>
    }
    if (craftsman.message_sent) {
      return <Badge variant="outline">送信済み</Badge>
    }
    return null
  }

  // 統計データの計算
  const stats = {
    total: craftsmen.length,
    filtered: filteredCraftsmen.length,
    byTrade: trades.reduce((acc, trade) => {
      acc[trade] = craftsmen.filter(c => c.trade === trade).length
      return acc
    }, {} as Record<string, number>),
    awaitingReply: craftsmen.filter(c => c.awaiting_reply).length,
    withEmail: craftsmen.filter(c => c.email).length
  }

  return (
    <div className="space-y-3">
      {/* コンパクトな統計バー */}
      <div className="flex items-center gap-4 p-2 bg-muted/30 border text-xs">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span className="font-medium">全{stats.total}人</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <span>床: {stats.byTrade['床'] || 0}</span>
        <span>クロス: {stats.byTrade['クロス'] || 0}</span>
        <span>その他: {stats.byTrade['その他'] || 0}</span>
        <div className="h-3 w-px bg-border" />
        <span className="text-orange-600">返信待ち: {stats.awaitingReply}</span>
        <span className="text-blue-600">メール登録: {stats.withEmail}</span>
        <div className="ml-auto text-muted-foreground">
          {stats.filtered}件表示中
        </div>
      </div>

      {/* メインコンテンツカード */}
      <Card>
        <CardHeader className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Input
                placeholder="名前・住所で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-48 text-sm"
              />
              <Select value={filterTrade} onValueChange={setFilterTrade}>
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全職種</SelectItem>
                  {trades.map(trade => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  <SelectItem value="awaiting_reply">返信待ち</SelectItem>
                  <SelectItem value="message_sent">送信済み</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1">
              {filteredCraftsmen.filter(c => c.email).length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleCopyEmails}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    BCC ({filteredCraftsmen.filter(c => c.email).length})
                  </Button>
                  <Dialog open={showEmailList} onOpenChange={setShowEmailList}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Mail className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>メールアドレス一覧</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          BCC欄にコピペしてください
                        </p>
                        <div className="p-2 bg-muted border text-xs">
                          <code className="break-all">
                            {filteredCraftsmen
                              .filter(c => c.email)
                              .map(c => c.email)
                              .join('; ')}
                          </code>
                        </div>
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => {
                            handleCopyEmails()
                            setShowEmailList(false)
                          }}
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          コピーして閉じる
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              <div className="flex border">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('card')}
                >
                  <LayoutGrid className="w-3 h-3" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('table')}
                >
                  <List className="w-3 h-3" />
                </Button>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8" onClick={() => setSelectedCraftsman(null)}>
                    <Plus className="w-3 h-3 mr-1" />
                    新規
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedCraftsman ? '職人情報編集' : '新規職人登録'}
                    </DialogTitle>
                  </DialogHeader>
                  <CraftsmanForm
                    craftsman={selectedCraftsman}
                    trades={trades}
                    onSave={handleSave}
                    loading={loading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredCraftsmen.map((craftsman) => (
                <Card key={craftsman.id} className="hover:border-primary transition-colors">
                  <CardContent className="p-2">
                    {/* ヘッダー */}
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{craftsman.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge variant="default" className="h-4 text-[10px] px-1">{craftsman.trade}</Badge>
                          {getStatusBadge(craftsman) && (
                            <Badge variant={craftsman.awaiting_reply ? 'secondary' : 'outline'} className="h-4 text-[10px] px-1">
                              {craftsman.awaiting_reply ? '返信待ち' : '送信済'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* クイックアクション */}
                    <div className="flex gap-1 mb-2">
                      {craftsman.phone && (
                        <a
                          href={`tel:${craftsman.phone}`}
                          className="flex-1 flex items-center justify-center gap-1 p-1 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-[10px] font-medium"
                          title={craftsman.phone}
                        >
                          <Phone className="w-3 h-3" />
                          電話
                        </a>
                      )}
                      {craftsman.email && (
                        <a
                          href={`mailto:${craftsman.email}`}
                          className="flex-1 flex items-center justify-center gap-1 p-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-medium"
                          title={craftsman.email}
                        >
                          <Mail className="w-3 h-3" />
                          メール
                        </a>
                      )}
                      {craftsman.sukedachi_url && (
                        <a
                          href={craftsman.sukedachi_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 p-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          助太刀
                        </a>
                      )}
                    </div>

                    {/* 詳細情報 */}
                    <div className="space-y-0.5 text-[11px] text-muted-foreground mb-2">
                      {craftsman.phone && (
                        <div className="flex items-center gap-1 truncate">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span className="truncate">{craftsman.phone}</span>
                        </div>
                      )}
                      {craftsman.address && (
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{craftsman.address}</span>
                        </div>
                      )}
                      {(craftsman.details as any)?.coverage_areas?.length > 0 && (
                        <div className="text-[10px] text-muted-foreground truncate">
                          対応: {(craftsman.details as any).coverage_areas.slice(0, 2).join(', ')}
                          {(craftsman.details as any).coverage_areas.length > 2 && '...'}
                        </div>
                      )}
                    </div>

                    {/* アクションボタン */}
                    <div className="flex gap-1 pt-1 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-6 text-[10px] px-1"
                        onClick={() => {
                          setDetailModalCraftsman(craftsman)
                          setIsDetailModalOpen(true)
                        }}
                      >
                        <Eye className="w-3 h-3 mr-0.5" />
                        詳細
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-6 text-[10px] px-1"
                        onClick={() => {
                          setSelectedCraftsman(craftsman)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit2 className="w-3 h-3 mr-0.5" />
                        編集
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDelete(craftsman.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-8">名前</TableHead>
                    <TableHead className="h-8">職種</TableHead>
                    <TableHead className="h-8">連絡先</TableHead>
                    <TableHead className="h-8">対応エリア</TableHead>
                    <TableHead className="h-8">ステータス</TableHead>
                    <TableHead className="h-8 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCraftsmen.map((craftsman) => (
                    <TableRow key={craftsman.id} className="h-12">
                      <TableCell className="font-medium py-1">{craftsman.name}</TableCell>
                      <TableCell className="py-1">
                        <Badge variant="default" className="h-4 text-[10px] px-1">{craftsman.trade}</Badge>
                      </TableCell>
                      <TableCell className="py-1">
                        <div className="flex gap-1">
                          {craftsman.phone && (
                            <a
                              href={`tel:${craftsman.phone}`}
                              className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-[10px]"
                              title={craftsman.phone}
                            >
                              <Phone className="w-3 h-3" />
                              {craftsman.phone}
                            </a>
                          )}
                          {craftsman.email && (
                            <a
                              href={`mailto:${craftsman.email}`}
                              className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] max-w-[150px] truncate"
                              title={craftsman.email}
                            >
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{craftsman.email}</span>
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[11px] text-muted-foreground">
                        {(craftsman.details as any)?.coverage_areas?.length > 0 ? (
                          <span className="truncate max-w-[200px] inline-block">
                            {(craftsman.details as any).coverage_areas.slice(0, 3).join(', ')}
                            {(craftsman.details as any).coverage_areas.length > 3 && '...'}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-1">
                        {getStatusBadge(craftsman) && (
                          <Badge variant={craftsman.awaiting_reply ? 'secondary' : 'outline'} className="h-4 text-[10px] px-1">
                            {craftsman.awaiting_reply ? '返信待ち' : '送信済'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setDetailModalCraftsman(craftsman)
                              setIsDetailModalOpen(true)
                            }}
                            title="詳細"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setSelectedCraftsman(craftsman)
                              setIsDialogOpen(true)
                            }}
                            title="編集"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDelete(craftsman.id)}
                            title="削除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 詳細表示モーダル */}
      <CraftsmanDetailModal
        craftsman={detailModalCraftsman}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setDetailModalCraftsman(null)
        }}
      />
    </div>
  )
}

function CraftsmanForm({
  craftsman,
  trades,
  onSave,
  loading
}: {
  craftsman: Craftsman | null
  trades: string[]
  onSave: (data: any) => void
  loading: boolean
}) {
  const details = (craftsman?.details as any) || {}

  const [formData, setFormData] = useState({
    name: craftsman?.name || '',
    trade: craftsman?.trade || '床',
    sukedachi_url: craftsman?.sukedachi_url || '',
    email: craftsman?.email || '',
    phone: craftsman?.phone || '',
    address: craftsman?.address || '',
    message_sent: craftsman?.message_sent === true,
    awaiting_reply: craftsman?.awaiting_reply === true,
    notes: craftsman?.notes || '',
    details: {
      age: details.age || null,
      residence: details.residence || '',
      coverage_areas: details.coverage_areas || [],
      coverage_trades: details.coverage_trades || [],
      company_name: details.company_name || '',
      employment_type: details.employment_type || '',
      introduction: details.introduction || ''
    }
  })

  // craftsmanが変更されたらformDataも更新
  useEffect(() => {
    if (craftsman) {
      const details = (craftsman.details as any) || {}
      setFormData({
        name: craftsman.name || '',
        trade: craftsman.trade || '床',
        sukedachi_url: craftsman.sukedachi_url || '',
        email: craftsman.email || '',
        phone: craftsman.phone || '',
        address: craftsman.address || '',
        message_sent: craftsman.message_sent === true,
        awaiting_reply: craftsman.awaiting_reply === true,
        notes: craftsman.notes || '',
        details: {
          age: details.age || null,
          residence: details.residence || '',
          coverage_areas: details.coverage_areas || [],
          coverage_trades: details.coverage_trades || [],
          company_name: details.company_name || '',
          employment_type: details.employment_type || '',
          introduction: details.introduction || ''
        }
      })
    } else {
      // 新規作成時のデフォルト値
      setFormData({
        name: '',
        trade: '床',
        sukedachi_url: '',
        email: '',
        phone: '',
        address: '',
        message_sent: false,
        awaiting_reply: false,
        notes: '',
        details: {
          age: null,
          residence: '',
          coverage_areas: [],
          coverage_trades: [],
          company_name: '',
          employment_type: '',
          introduction: ''
        }
      })
    }
  }, [craftsman?.id]) // craftsmanのIDが変わった時のみ更新

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基本情報</TabsTrigger>
          <TabsTrigger value="contact">連絡先・詳細</TabsTrigger>
          <TabsTrigger value="status">ステータス</TabsTrigger>
        </TabsList>

        {/* 基本情報タブ */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>名前 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>職種 *</Label>
              <Select
                value={formData.trade}
                onValueChange={(value) => setFormData({ ...formData, trade: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trades.map(trade => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>年齢</Label>
              <Input
                type="number"
                value={formData.details.age || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, age: e.target.value ? parseInt(e.target.value) : null }
                })}
                placeholder="25"
              />
            </div>

            <div>
              <Label>居住地</Label>
              <Input
                value={formData.details.residence}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, residence: e.target.value }
                })}
                placeholder="大阪府摂津市"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>屋号</Label>
              <Input
                value={formData.details.company_name}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, company_name: e.target.value }
                })}
                placeholder="ネクストステージマーケティング"
              />
            </div>

            <div>
              <Label>雇用形態</Label>
              <Select
                value={formData.details.employment_type}
                onValueChange={(value) => setFormData({
                  ...formData,
                  details: { ...formData.details, employment_type: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="個人事業主">個人事業主</SelectItem>
                  <SelectItem value="法人">法人</SelectItem>
                  <SelectItem value="従業員">従業員</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>自己紹介</Label>
            <Textarea
              value={formData.details.introduction}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, introduction: e.target.value }
              })}
              placeholder="関西全域で活動しております！出張も対応してます！..."
              rows={4}
            />
          </div>
        </TabsContent>

        {/* 連絡先・詳細タブ */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>メールアドレス</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@example.com"
              />
            </div>

            <div>
              <Label>電話番号</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="090-0000-0000"
              />
            </div>
          </div>

          <div>
            <Label>住所</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="東京都..."
            />
          </div>

          <div>
            <Label>助太刀URL</Label>
            <Input
              value={formData.sukedachi_url}
              onChange={(e) => setFormData({ ...formData, sukedachi_url: e.target.value })}
              placeholder="https://sukedachi.jp/..."
            />
          </div>

          <div>
            <Label>対応エリア（カンマ区切り）</Label>
            <Input
              value={formData.details.coverage_areas.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                details: {
                  ...formData.details,
                  coverage_areas: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }
              })}
              placeholder="京都府, 兵庫県, 和歌山県, 大阪府, 奈良県"
            />
          </div>

          <div>
            <Label>対応職種（カンマ区切り）</Label>
            <Input
              value={formData.details.coverage_trades.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                details: {
                  ...formData.details,
                  coverage_trades: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }
              })}
              placeholder="ボード, クロス, 大工"
            />
          </div>
        </TabsContent>

        {/* ステータスタブ */}
        <TabsContent value="status" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="message_sent"
                checked={formData.message_sent}
                onCheckedChange={(checked) => setFormData({ ...formData, message_sent: !!checked })}
              />
              <Label htmlFor="message_sent" className="cursor-pointer">メッセージ送信済み</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="awaiting_reply"
                checked={formData.awaiting_reply}
                onCheckedChange={(checked) => setFormData({ ...formData, awaiting_reply: !!checked })}
              />
              <Label htmlFor="awaiting_reply" className="cursor-pointer">返信待ち</Label>
            </div>
          </div>

          <div>
            <Label>備考</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="メモや特記事項を記入してください"
              rows={6}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  )
}