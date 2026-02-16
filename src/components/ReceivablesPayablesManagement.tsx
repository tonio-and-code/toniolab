'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { AccountsReceivable, AccountsPayable, ClientBalance, PaymentStatus } from '../../types/receivables-payables';
import { Plus, Edit, Trash2, DollarSign, FileText, Calendar, Building2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function ReceivablesPayablesManagement() {
  const supabase = createClient();
  const [clientBalances, setClientBalances] = useState<ClientBalance[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [receivables, setReceivables] = useState<AccountsReceivable[]>([]);
  const [payables, setPayables] = useState<AccountsPayable[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [entryType, setEntryType] = useState<'receivable' | 'payable'>('receivable');
  const [selectedItem, setSelectedItem] = useState<AccountsReceivable | AccountsPayable | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    project_id: '',
    invoice_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: '',
    invoice_number: '',
    description: '',
    amount: '',
    notes: ''
  });
  const [paymentData, setPaymentData] = useState({
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    payment_method: '',
    reference_number: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [selectedClient]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch clients
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      setClients(clientsData || []);

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      setProjects(projectsData || []);

      // Fetch receivables with client and project info
      let receivablesQuery = supabase
        .from('accounts_receivable')
        .select(`
          *,
          client:clients(id, name, type),
          project:projects(id, name)
        `)
        .order('due_date');
      
      if (selectedClient !== 'all') {
        receivablesQuery = receivablesQuery.eq('client_id', selectedClient);
      }
      
      const { data: receivablesData } = await receivablesQuery;
      setReceivables(receivablesData || []);

      // Fetch payables with client and project info
      let payablesQuery = supabase
        .from('accounts_payable')
        .select(`
          *,
          client:clients(id, name, type),
          project:projects(id, name)
        `)
        .order('due_date');
      
      if (selectedClient !== 'all') {
        payablesQuery = payablesQuery.eq('client_id', selectedClient);
      }
      
      const { data: payablesData } = await payablesQuery;
      setPayables(payablesData || []);

      // Calculate client balances
      calculateClientBalances(receivablesData || [], payablesData || []);
    } catch {
      // Error fetching data silently handled
    } finally {
      setLoading(false);
    }
  };

  const calculateClientBalances = (receivablesData: AccountsReceivable[], payablesData: AccountsPayable[]) => {
    const balanceMap = new Map<string, ClientBalance>();

    // Process receivables
    receivablesData.forEach(item => {
      if (!item.client) return;
      
      if (!balanceMap.has(item.client_id)) {
        balanceMap.set(item.client_id, {
          client_id: item.client_id,
          client_name: item.client.name,
          client_type: item.client.type,
          total_receivable: 0,
          total_payable: 0,
          paid_receivable: 0,
          paid_payable: 0,
          balance_receivable: 0,
          balance_payable: 0,
          overdue_receivable: 0,
          overdue_payable: 0,
          items_receivable: [],
          items_payable: []
        });
      }
      
      const balance = balanceMap.get(item.client_id)!;
      balance.total_receivable += item.amount;
      balance.paid_receivable += item.paid_amount;
      balance.balance_receivable += item.balance;
      if (item.status === 'overdue') {
        balance.overdue_receivable += item.balance;
      }
      balance.items_receivable.push(item);
    });

    // Process payables
    payablesData.forEach(item => {
      if (!item.client) return;
      
      if (!balanceMap.has(item.client_id)) {
        balanceMap.set(item.client_id, {
          client_id: item.client_id,
          client_name: item.client.name,
          client_type: item.client.type,
          total_receivable: 0,
          total_payable: 0,
          paid_receivable: 0,
          paid_payable: 0,
          balance_receivable: 0,
          balance_payable: 0,
          overdue_receivable: 0,
          overdue_payable: 0,
          items_receivable: [],
          items_payable: []
        });
      }
      
      const balance = balanceMap.get(item.client_id)!;
      balance.total_payable += item.amount;
      balance.paid_payable += item.paid_amount;
      balance.balance_payable += item.balance;
      if (item.status === 'overdue') {
        balance.overdue_payable += item.balance;
      }
      balance.items_payable.push(item);
    });

    setClientBalances(Array.from(balanceMap.values()));
  };

  const handleAddEntry = async () => {
    try {
      const table = entryType === 'receivable' ? 'accounts_receivable' : 'accounts_payable';
      const { error } = await supabase.from(table).insert({
        client_id: formData.client_id,
        project_id: formData.project_id || null,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        invoice_number: formData.invoice_number || null,
        description: formData.description,
        amount: parseFloat(formData.amount),
        notes: formData.notes || null
      });

      if (error) throw error;

      setIsAddDialogOpen(false);
      setFormData({
        client_id: '',
        project_id: '',
        invoice_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: '',
        invoice_number: '',
        description: '',
        amount: '',
        notes: ''
      });
      fetchData();
    } catch {
      // Error adding entry silently handled
    }
  };

  const handleAddPayment = async () => {
    if (!selectedItem) return;

    try {
      const table = entryType === 'receivable' ? 'receivable_payments' : 'payable_payments';
      const idField = entryType === 'receivable' ? 'receivable_id' : 'payable_id';
      
      const { error } = await supabase.from(table).insert({
        [idField]: selectedItem.id,
        payment_date: paymentData.payment_date,
        amount: parseFloat(paymentData.amount),
        payment_method: paymentData.payment_method || null,
        reference_number: paymentData.reference_number || null,
        notes: paymentData.notes || null
      });

      if (error) throw error;

      setIsPaymentDialogOpen(false);
      setPaymentData({
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        payment_method: '',
        reference_number: '',
        notes: ''
      });
      setSelectedItem(null);
      fetchData();
    } catch {
      // Error adding payment silently handled
    }
  };

  const handleDeleteEntry = async (id: string, type: 'receivable' | 'payable') => {
    if (!confirm('この項目を削除してもよろしいですか？')) return;

    try {
      const table = type === 'receivable' ? 'accounts_receivable' : 'accounts_payable';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch {
      // Error deleting entry silently handled
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      pending: { label: '未払い', variant: 'secondary' as const, icon: Clock },
      partial: { label: '一部支払済', variant: 'default' as const, icon: DollarSign },
      paid: { label: '支払済', variant: 'default' as const, icon: CheckCircle },
      overdue: { label: '期限切れ', variant: 'destructive' as const, icon: AlertCircle },
      cancelled: { label: 'キャンセル', variant: 'secondary' as const, icon: null }
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    const extraClassName = status === 'paid' ? 'bg-green-500' : undefined;

    return (
      <Badge variant={config.variant} className={extraClassName}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>売掛・買掛管理</span>
            <div className="flex gap-2">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="取引先を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全ての取引先</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    新規追加
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新規{entryType === 'receivable' ? '売掛' : '買掛'}登録</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={entryType === 'receivable' ? 'default' : 'outline'}
                        onClick={() => setEntryType('receivable')}
                        className="flex-1"
                      >
                        売掛金
                      </Button>
                      <Button
                        variant={entryType === 'payable' ? 'default' : 'outline'}
                        onClick={() => setEntryType('payable')}
                        className="flex-1"
                      >
                        買掛金
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client">取引先</Label>
                        <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.filter(c => 
                              entryType === 'receivable' 
                                ? c.type === 'customer' || c.type === 'both'
                                : c.type === 'supplier' || c.type === 'both'
                            ).map(client => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="project">プロジェクト</Label>
                        <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください（任意）" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">なし</SelectItem>
                            {projects.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="invoice_date">請求日</Label>
                        <Input
                          type="date"
                          value={formData.invoice_date}
                          onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="due_date">支払期限</Label>
                        <Input
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="invoice_number">請求書番号</Label>
                        <Input
                          value={formData.invoice_number}
                          onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                          placeholder="INV-001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">金額</Label>
                        <Input
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">説明</Label>
                        <Input
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="請求内容を入力"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="notes">備考</Label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="備考があれば入力"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        キャンセル
                      </Button>
                      <Button onClick={handleAddEntry}>
                        登録
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">取引先別サマリー</TabsTrigger>
              <TabsTrigger value="receivables">売掛金一覧</TabsTrigger>
              <TabsTrigger value="payables">買掛金一覧</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <ScrollArea className="h-[600px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>取引先</TableHead>
                      <TableHead className="text-center">種別</TableHead>
                      <TableHead className="text-right">売掛金残高</TableHead>
                      <TableHead className="text-right">買掛金残高</TableHead>
                      <TableHead className="text-right">期限切れ売掛</TableHead>
                      <TableHead className="text-right">期限切れ買掛</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientBalances.map(balance => (
                      <TableRow key={balance.client_id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                            {balance.client_name}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {balance.client_type === 'customer' ? '顧客' : 
                             balance.client_type === 'supplier' ? '仕入先' : '両方'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(balance.balance_receivable)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(balance.balance_payable)}
                        </TableCell>
                        <TableCell className="text-right">
                          {balance.overdue_receivable > 0 && (
                            <span className="text-red-600">
                              {formatCurrency(balance.overdue_receivable)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {balance.overdue_payable > 0 && (
                            <span className="text-red-600">
                              {formatCurrency(balance.overdue_payable)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClient(balance.client_id)}
                          >
                            詳細
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="receivables">
              <ScrollArea className="h-[600px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>取引先</TableHead>
                      <TableHead>プロジェクト</TableHead>
                      <TableHead>請求日</TableHead>
                      <TableHead>支払期限</TableHead>
                      <TableHead>説明</TableHead>
                      <TableHead className="text-right">金額</TableHead>
                      <TableHead className="text-right">入金済</TableHead>
                      <TableHead className="text-right">残高</TableHead>
                      <TableHead className="text-center">ステータス</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivables.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.client?.name}
                        </TableCell>
                        <TableCell>{item.project?.name || '-'}</TableCell>
                        <TableCell>
                          {format(new Date(item.invoice_date), 'yyyy/MM/dd', { locale: ja })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.due_date), 'yyyy/MM/dd', { locale: ja })}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.paid_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.balance)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Dialog open={isPaymentDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                              setIsPaymentDialogOpen(open);
                              if (open) {
                                setSelectedItem(item);
                                setEntryType('receivable');
                              } else {
                                setSelectedItem(null);
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <DollarSign className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>入金登録</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>残高: {formatCurrency(item.balance)}</Label>
                                  </div>
                                  <div>
                                    <Label htmlFor="payment_date">入金日</Label>
                                    <Input
                                      type="date"
                                      value={paymentData.payment_date}
                                      onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="amount">入金額</Label>
                                    <Input
                                      type="number"
                                      value={paymentData.amount}
                                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="payment_method">支払方法</Label>
                                    <Select value={paymentData.payment_method} onValueChange={(value) => setPaymentData({ ...paymentData, payment_method: value })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="選択してください" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="bank_transfer">銀行振込</SelectItem>
                                        <SelectItem value="cash">現金</SelectItem>
                                        <SelectItem value="check">小切手</SelectItem>
                                        <SelectItem value="credit_card">クレジットカード</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="reference_number">参照番号</Label>
                                    <Input
                                      value={paymentData.reference_number}
                                      onChange={(e) => setPaymentData({ ...paymentData, reference_number: e.target.value })}
                                      placeholder="振込番号など"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">備考</Label>
                                    <Textarea
                                      value={paymentData.notes}
                                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                                      キャンセル
                                    </Button>
                                    <Button onClick={handleAddPayment}>
                                      登録
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEntry(item.id, 'receivable')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="payables">
              <ScrollArea className="h-[600px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>取引先</TableHead>
                      <TableHead>プロジェクト</TableHead>
                      <TableHead>請求日</TableHead>
                      <TableHead>支払期限</TableHead>
                      <TableHead>説明</TableHead>
                      <TableHead className="text-right">金額</TableHead>
                      <TableHead className="text-right">支払済</TableHead>
                      <TableHead className="text-right">残高</TableHead>
                      <TableHead className="text-center">ステータス</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payables.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.client?.name}
                        </TableCell>
                        <TableCell>{item.project?.name || '-'}</TableCell>
                        <TableCell>
                          {format(new Date(item.invoice_date), 'yyyy/MM/dd', { locale: ja })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.due_date), 'yyyy/MM/dd', { locale: ja })}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.paid_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.balance)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Dialog open={isPaymentDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                              setIsPaymentDialogOpen(open);
                              if (open) {
                                setSelectedItem(item);
                                setEntryType('payable');
                              } else {
                                setSelectedItem(null);
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <DollarSign className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>支払登録</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>残高: {formatCurrency(item.balance)}</Label>
                                  </div>
                                  <div>
                                    <Label htmlFor="payment_date">支払日</Label>
                                    <Input
                                      type="date"
                                      value={paymentData.payment_date}
                                      onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="amount">支払額</Label>
                                    <Input
                                      type="number"
                                      value={paymentData.amount}
                                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="payment_method">支払方法</Label>
                                    <Select value={paymentData.payment_method} onValueChange={(value) => setPaymentData({ ...paymentData, payment_method: value })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="選択してください" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="bank_transfer">銀行振込</SelectItem>
                                        <SelectItem value="cash">現金</SelectItem>
                                        <SelectItem value="check">小切手</SelectItem>
                                        <SelectItem value="credit_card">クレジットカード</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="reference_number">参照番号</Label>
                                    <Input
                                      value={paymentData.reference_number}
                                      onChange={(e) => setPaymentData({ ...paymentData, reference_number: e.target.value })}
                                      placeholder="振込番号など"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">備考</Label>
                                    <Textarea
                                      value={paymentData.notes}
                                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                                      キャンセル
                                    </Button>
                                    <Button onClick={handleAddPayment}>
                                      登録
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEntry(item.id, 'payable')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}




