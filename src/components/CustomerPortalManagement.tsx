'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, Search, Key, Upload, Eye, EyeOff,
  FileText, Package, ClipboardList, MoreHorizontal,
  Calendar, Download, Copy, RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Customer {
  id: string;
  customer_name: string;
}

interface PortalAccount {
  id: string;
  customer_id: string;
  login_id: string;
  password_plain?: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  customer?: Customer;
}

interface PortalDocument {
  id: string;
  customer_id: string;
  document_type: 'invoice' | 'delivery_note' | 'quotation' | 'other';
  document_name: string;
  file_url: string;
  file_size: number;
  is_visible: boolean;
  uploaded_at: string;
  view_count: number;
  viewed_at: string | null;
  customer?: Customer;
}

const CustomerPortalManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<PortalAccount[]>([]);
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PortalAccount | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 顧客データ取得
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('customer_name');

      if (customersError) throw customersError;
      setCustomers(customersData || []);

      // ポータルアカウント取得
      const { data: accountsData, error: accountsError } = await supabase
        .from('customer_portal_accounts')
        .select(`
          *,
          customer:customers(*)
        `)
        .order('created_at', { ascending: false });

      if (!accountsError) {
        setAccounts(accountsData || []);
      } else if (accountsError.code === '42P01') {
        // Table doesn't exist yet
        setAccounts([]);
      }

      // ドキュメント取得
      const { data: documentsData, error: documentsError } = await supabase
        .from('customer_portal_documents')
        .select(`
          *,
          customer:customers(*)
        `)
        .order('uploaded_at', { ascending: false });

      if (!documentsError) {
        setDocuments(documentsData || []);
      } else if (documentsError.code === '42P01') {
        // Table doesn't exist yet
        setDocuments([]);
      }
    } catch {
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const generateLoginId = (customerName: string) => {
    const prefix = 'IW';
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}${random}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateAccount = async () => {
    if (!selectedCustomer) {
      toast.error('顧客を選択してください');
      return;
    }

    try {
      // 既存アカウントチェック
      const { data: existing } = await supabase
        .from('customer_portal_accounts')
        .select('id')
        .eq('customer_id', selectedCustomer)
        .single();

      if (existing) {
        toast.error('この顧客のアカウントは既に存在します');
        return;
      }

      // パスワードのハッシュ化（実際にはサーバー側で行うべき）
      // ここでは仮実装として平文で保存（本番環境では必ずハッシュ化）
      const hashedPassword = btoa(password); // 仮のエンコード

      const { data, error } = await supabase
        .from('customer_portal_accounts')
        .insert({
          customer_id: selectedCustomer,
          login_id: loginId,
          password_hash: hashedPassword,
          password_plain: password, // 平文パスワードも保存（管理用）
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('アカウントを作成しました');
      setShowAccountDialog(false);
      setSelectedCustomer('');
      setLoginId('');
      setPassword('');
      fetchData();
    } catch {
      toast.error('アカウントの作成に失敗しました');
    }
  };

  const handleResetPassword = async (accountId: string) => {
    const newPassword = generatePassword();

    try {
      const hashedPassword = btoa(newPassword); // 仮のエンコード

      const { error } = await supabase
        .from('customer_portal_accounts')
        .update({
          password_hash: hashedPassword,
          password_plain: newPassword, // 平文パスワードも更新
          last_password_change: new Date().toISOString()
        })
        .eq('id', accountId);

      if (error) throw error;

      // 新しいパスワードをクリップボードにコピー
      await navigator.clipboard.writeText(newPassword);
      toast.success(`パスワードをリセットしました: ${newPassword} (クリップボードにコピー済み)`);
      fetchData();
    } catch {
      toast.error('パスワードのリセットに失敗しました');
    }
  };

  const handleToggleAccountStatus = async (account: PortalAccount) => {
    try {
      const { error } = await supabase
        .from('customer_portal_accounts')
        .update({ is_active: !account.is_active })
        .eq('id', account.id);

      if (error) throw error;

      toast.success(account.is_active ? 'アカウントを無効化しました' : 'アカウントを有効化しました');
      fetchData();
    } catch {
      toast.error('ステータスの変更に失敗しました');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('このアカウントを削除しますか？')) return;

    try {
      const { error } = await supabase
        .from('customer_portal_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      toast.success('アカウントを削除しました');
      fetchData();
    } catch {
      toast.error('アカウントの削除に失敗しました');
    }
  };

  const handleUploadDocument = async (file: File, customerId: string, documentType: string) => {
    try {
      // ファイル名をサニタイズ（日本語や特殊文字を除去）
      const fileExt = file.name.split('.').pop() || 'pdf';
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_') // 英数字とピリオド、ハイフン以外をアンダースコアに置換
        .replace(/_+/g, '_') // 連続するアンダースコアを1つに
        .slice(0, 50); // 長さ制限

      const fileName = `${customerId}/${Date.now()}_${documentType}_${sanitizedName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('customer-documents')
        .upload(fileName, file, {
          upsert: true // 既存ファイルの上書きを許可
        });

      if (uploadError) {
        // バケットが存在しない場合は作成を促す
        if (uploadError.message?.includes('bucket')) {
          toast.error('Storageバケット"customer-documents"を作成してください');
          return;
        }
        // RLSエラーの場合
        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('RLS')) {
          toast.error('RLSエラー: sql-migrations/17_disable_rls_customer_portal.sqlを実行してください');
          return;
        }
        throw uploadError;
      }

      // データベースに記録（元のファイル名を保持）
      const { data: docData, error: docError } = await supabase
        .from('customer_portal_documents')
        .insert({
          customer_id: customerId,
          document_type: documentType,
          document_name: file.name, // 表示用に元のファイル名を保持
          file_url: fileName, // Storage用のサニタイズされたパス
          file_size: file.size,
          mime_type: file.type,
          is_visible: true
        })
        .select()
        .single();

      if (docError) {
        // RLSエラーの場合
        if (docError.message?.includes('row-level security') || docError.code === '42501') {
          toast.error('データベースのRLSエラー: Supabaseで17_disable_rls_customer_portal.sqlを実行してください');

          // アップロードしたファイルを削除
          await supabase.storage
            .from('customer-documents')
            .remove([fileName]);

          return;
        }
        throw docError;
      }

      toast.success('ドキュメントをアップロードしました');
      fetchData();
    } catch {
      toast.error('アップロードに失敗しました');
    }
  };

  const handleToggleDocumentVisibility = async (doc: PortalDocument) => {
    try {
      const { error } = await supabase
        .from('customer_portal_documents')
        .update({ is_visible: !doc.is_visible })
        .eq('id', doc.id);

      if (error) throw error;

      toast.success(doc.is_visible ? '非表示にしました' : '表示にしました');
      fetchData();
    } catch {
      toast.error('表示設定の変更に失敗しました');
    }
  };

  const handleDeleteDocument = async (docId: string, fileUrl: string) => {
    if (!confirm('このドキュメントを削除しますか？')) return;

    try {
      // Storageから削除
      await supabase.storage
        .from('customer-documents')
        .remove([fileUrl]);

      // データベースから削除
      const { error: dbError } = await supabase
        .from('customer_portal_documents')
        .delete()
        .eq('id', docId);

      if (dbError) throw dbError;

      toast.success('ドキュメントを削除しました');
      fetchData();
    } catch {
      toast.error('ドキュメントの削除に失敗しました');
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice': return <FileText className="h-4 w-4" />;
      case 'delivery_note': return <Package className="h-4 w-4" />;
      case 'quotation': return <ClipboardList className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice': return '請求書';
      case 'delivery_note': return '納品書';
      case 'quotation': return '見積書';
      default: return 'その他';
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.customer?.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.login_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc =>
    doc.customer?.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="accounts">アカウント管理</TabsTrigger>
          <TabsTrigger value="documents">ドキュメント管理</TabsTrigger>
        </TabsList>

        {/* アカウント管理タブ */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>顧客ポータルアカウント</CardTitle>
                <Button onClick={() => {
                  const customer = customers.find(c => !accounts.some(a => a.customer_id === c.id));
                  if (customer) {
                    setSelectedCustomer(customer.id);
                    setLoginId(generateLoginId(customer.customer_name));
                    setPassword(generatePassword());
                  }
                  setShowAccountDialog(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  アカウント作成
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>顧客名</TableHead>
                    <TableHead>ログインID</TableHead>
                    <TableHead>パスワード</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>最終ログイン</TableHead>
                    <TableHead>作成日</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">読み込み中...</TableCell>
                    </TableRow>
                  ) : filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">アカウントがありません</TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.customer?.customer_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {account.login_id}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText(account.login_id);
                                toast.success('IDをコピーしました');
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {account.password_plain || '********'}
                            </code>
                            {account.password_plain && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(account.password_plain || '');
                                  toast.success('パスワードをコピーしました');
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.is_active ? 'default' : 'secondary'}>
                            {account.is_active ? '有効' : '無効'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {account.last_login ? formatDate(account.last_login) : '未ログイン'}
                        </TableCell>
                        <TableCell>{formatDate(account.created_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleResetPassword(account.id)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                パスワードリセット
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleAccountStatus(account)}>
                                {account.is_active ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    無効化
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    有効化
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteAccount(account.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                削除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ドキュメント管理タブ */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>アップロード済みドキュメント</CardTitle>
                <Button onClick={() => setShowDocumentDialog(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  ドキュメントアップロード
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>顧客名</TableHead>
                    <TableHead>種類</TableHead>
                    <TableHead>ファイル名</TableHead>
                    <TableHead>表示</TableHead>
                    <TableHead>閲覧回数</TableHead>
                    <TableHead>アップロード日</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">読み込み中...</TableCell>
                    </TableRow>
                  ) : filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">ドキュメントがありません</TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.customer?.customer_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDocumentTypeIcon(doc.document_type)}
                            <span>{getDocumentTypeLabel(doc.document_type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.document_name}</TableCell>
                        <TableCell>
                          <Badge variant={doc.is_visible ? 'default' : 'secondary'}>
                            {doc.is_visible ? '表示' : '非表示'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {doc.view_count}回
                          {doc.viewed_at && <span className="text-xs text-gray-500 ml-1">(初回: {formatDate(doc.viewed_at)})</span>}
                        </TableCell>
                        <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleDocumentVisibility(doc)}>
                                {doc.is_visible ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    非表示にする
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    表示にする
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDocument(doc.id, doc.file_url)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                削除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* アカウント作成ダイアログ */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>顧客ポータルアカウント作成</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>顧客選択</Label>
              <select
                className="w-full p-2 border rounded"
                value={selectedCustomer}
                onChange={(e) => {
                  setSelectedCustomer(e.target.value);
                  const customer = customers.find(c => c.id === e.target.value);
                  if (customer) {
                    setLoginId(generateLoginId(customer.customer_name));
                  }
                }}
              >
                <option value="">選択してください</option>
                {customers
                  .filter(c => !accounts.some(a => a.customer_id === c.id))
                  .map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label>ログインID</Label>
              <div className="flex gap-2">
                <Input value={loginId} onChange={(e) => setLoginId(e.target.value)} />
                <Button
                  variant="outline"
                  onClick={() => {
                    const customer = customers.find(c => c.id === selectedCustomer);
                    if (customer) {
                      setLoginId(generateLoginId(customer.customer_name));
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>初期パスワード</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPassword(generatePassword())}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(password);
                    toast.success('パスワードをコピーしました');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAccountDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={handleCreateAccount}>
                作成
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ドキュメントアップロードダイアログ */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ドキュメントアップロード</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>顧客選択</Label>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">選択してください</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.customer_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>ドキュメント種類</Label>
              <select className="w-full p-2 border rounded" id="doc-type">
                <option value="invoice">請求書</option>
                <option value="delivery_note">納品書</option>
                <option value="quotation">見積書</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <Label>ファイル選択</Label>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && selectedCustomer) {
                    const docType = (document.getElementById('doc-type') as HTMLSelectElement).value;
                    await handleUploadDocument(file, selectedCustomer, docType);
                    setShowDocumentDialog(false);
                    setSelectedCustomer('');
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF、PNG、JPG形式に対応
              </p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>
                キャンセル
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerPortalManagement;