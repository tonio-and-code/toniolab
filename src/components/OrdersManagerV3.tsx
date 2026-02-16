'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Plus, X, Trash2, Edit2, Save, Copy, Mail,
  Printer, Package, Wrench, CheckCircle, AlertCircle, Eye, Trash,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import type { Database } from '@/types/database';
import { ProjectSelect } from '@/components/ui/project-select';

type MaterialOrder = Database['public']['Tables']['material_orders']['Row'] & {
  items?: MaterialOrderItem[];
  project?: Database['public']['Tables']['projects']['Row'];
  supplier?: Database['public']['Tables']['customers']['Row'];
  other_customer?: Database['public']['Tables']['customers']['Row'];
};

type MaterialOrderItem = Database['public']['Tables']['material_order_items']['Row'];
type Project = Database['public']['Tables']['projects']['Row'] & {
  created_at: string;
  customer_name?: string;
  receivable_amount?: number;
};
type Customer = Database['public']['Tables']['customers']['Row'];

interface OrderForm {
  order_type: 'material' | 'other';
  order_number: string;
  project_id: string;
  supplier_id?: string;
  other_customer_id?: string;
  order_date: string;
  delivery_date?: string;
  delivery_address?: string;
  delivery_site_name?: string;
  work_description?: string;
  notes?: string;
  total_amount?: number;
  items?: {
    material_name: string;
    specification: string;
    quantity: number;
    unit: string;
    unit_price: number;
    amount: number;
  }[];
  email_content?: string;
}

export default function OrdersManagerV3() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [orders, setOrders] = useState<MaterialOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'material' | 'other'>('all');
  const [orderForm, setOrderForm] = useState<OrderForm>({
    order_type: 'material',
    order_number: '',
    project_id: '',
    order_date: format(new Date(), 'yyyy-MM-dd'),
    items: []
  });
  const [emailContent, setEmailContent] = useState('');
  const [currentOrderStatus, setCurrentOrderStatus] = useState<string | null>(null);
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const supabase = createClient();

  // 初回ロード時とパラメータ変更時の処理
  useEffect(() => {
    fetchData();
    
    // URLパラメータを取得
    const projectId = searchParams.get('projectId');
    const editId = searchParams.get('editId');
    
    if (projectId) {
      setTimeout(() => handleNewOrderWithProject(projectId), 500);
    } else if (editId) {
      setTimeout(() => handleEditOrder(editId), 500);
    } else {
      // パラメータがない場合はフォームを閉じる（ホームに戻る）
      setShowForm(false);
      setEditingId(null);
      setCurrentOrderStatus(null);
    }
    
    // URLからパラメータをクリア
    if (projectId || editId) {
      window.history.replaceState({}, document.title, '/orders');
    }
  }, [searchParams]);
  
  // パス変更時（サイドバークリック時）の処理
  useEffect(() => {
    if (pathname === '/orders') {
      // 発注管理に遷移したらフォームを閉じる
      setShowForm(false);
      setEditingId(null);
      setCurrentOrderStatus(null);
      setShowEmailSection(false);
    }
  }, [pathname]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, projectsRes, customersRes] = await Promise.all([
        supabase
          .from('material_orders')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('customers')
          .select('*')
          .order('customer_name')
      ]);

      if (ordersRes.data) {
        const ordersWithDetails = await Promise.all(
          ordersRes.data.map(async (order) => {
            const { data: items } = await supabase
              .from('material_order_items')
              .select('*')
              .eq('order_id', order.id);
            
            return {
              ...order,
              items: items || [],
              project: projectsRes.data?.find(p => p.id === order.project_id),
              supplier: customersRes.data?.find(s => s.id === order.supplier_id),
              other_customer: customersRes.data?.find(c => c.id === order.craftsman_id)
            };
          })
        );
        setOrders(ordersWithDetails);
      }

      // Add customer info to projects
      const projectsWithCustomers = await Promise.all(
        (projectsRes.data || []).map(async (project) => {
          if (project.receivable_customer_id) {
            const { data: customerData } = await supabase
              .from('customers')
              .select('customer_name')
              .eq('id', project.receivable_customer_id)
              .single();

            return {
              ...project,
              customer_name: customerData?.customer_name || '',
              receivable_amount: project.receivable_amount || 0
            };
          }
          return {
            ...project,
            customer_name: '',
            receivable_amount: project.receivable_amount || 0
          };
        })
      );

      setProjects(projectsWithCustomers);
      setCustomers(customersRes.data || []);
    } catch {
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const generateOrderNumber = async (orderType: 'material' | 'other') => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const prefix = orderType === 'material' ? 'PO' : 'WO';
    
    try {
      const { data } = await supabase
        .from('material_orders')
        .select('order_number')
        .eq('order_type', orderType)
        .like('order_number', `${prefix}${year}${month}%`)
        .order('order_number', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].order_number.slice(-3));
        return `${prefix}${year}${month}${String(lastNumber + 1).padStart(3, '0')}`;
      }
    } catch {
      // Use default order number
    }

    return `${prefix}${year}${month}001`;
  };

  const generateEmailContent = (order: OrderForm) => {
    let subject = '';
    let body = '';

    if (order.order_type === 'material') {
      const supplier = customers.find(s => s.id === order.supplier_id);
      const project = projects.find(p => p.id === order.project_id);
      
      subject = `【発注書】${project?.project_name || '案件名'} - ${order.order_number}`;
      
      body = `${supplier?.customer_name || ''} 御中

いつもお世話になっております。
下記の通り発注させていただきます。

【発注内容】
発注番号：${order.order_number}
案件名：${project?.project_name || ''}
納品日：${order.delivery_date ? format(new Date(order.delivery_date), 'yyyy年MM月dd日', { locale: ja }) : '別途ご連絡'}
納品先：${order.delivery_site_name || ''}
${order.delivery_address ? `住所：${order.delivery_address}` : ''}

【発注明細】
${order.items?.map(item => 
  `・${item.material_name} ${item.specification ? `(${item.specification})` : ''} 
   数量：${item.quantity}${item.unit}`
).join('\n') || ''}

${order.notes ? `備考：${order.notes}` : ''}

ご確認の上、納品をお願いいたします。

`;
    } else {
      const customer = customers.find(c => c.id === order.other_customer_id);
      const project = projects.find(p => p.id === order.project_id);
      
      subject = `【工事依頼】${project?.project_name || '案件名'} - ${order.order_number}`;
      
      body = `${customer?.customer_name || ''} 様

お世話になっております。
下記の通り工事をお願いいたします。

【工事内容】
発注番号：${order.order_number}
案件名：${project?.project_name || ''}
施工日：${order.delivery_date ? format(new Date(order.delivery_date), 'yyyy年MM月dd日', { locale: ja }) : '別途ご連絡'}
現場：${order.delivery_site_name || ''}
${order.delivery_address ? `住所：${order.delivery_address}` : ''}

【作業内容】
${order.work_description || ''}

${order.notes ? `備考：${order.notes}` : ''}

よろしくお願いいたします。

`;
    }

    return { subject, body };
  };

  const handleNewOrder = async () => {
    const orderType = 'material';
    const orderNumber = await generateOrderNumber(orderType);
    setOrderForm({
      order_type: orderType,
      order_number: orderNumber,
      project_id: '',
      order_date: format(new Date(), 'yyyy-MM-dd'),
      items: [{
        material_name: '',
        specification: '',
        quantity: 1,
        unit: '個',
        unit_price: 0,
        amount: 0
      }]
    });
    setEditingId(null);
    setCurrentOrderStatus(null);
    setShowForm(true);
  };

  const handleEditOrder = async (orderId: string) => {
    try {
      // 発注情報を取得
      const { data: order } = await supabase
        .from('material_orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!order) return;

      // 発注明細を取得
      const { data: items } = await supabase
        .from('material_order_items')
        .select('*')
        .eq('order_id', orderId);

      setOrderForm({
        order_type: (order.order_type as 'material' | 'other') || 'material',
        order_number: order.order_number,
        project_id: order.project_id || '',
        supplier_id: order.supplier_id || undefined,
        other_customer_id: order.craftsman_id || undefined,
        order_date: order.order_date,
        delivery_date: order.delivery_date || undefined,
        delivery_address: order.delivery_address || undefined,
        delivery_site_name: order.delivery_site_name || undefined,
        work_description: order.work_description || undefined,
        notes: order.notes || undefined,
        total_amount: order.total_amount || undefined,
        items: items?.map(item => ({
          material_name: item.material_name,
          specification: item.specification || '',
          quantity: item.quantity,
          unit: item.unit,
          unit_price: 0,
          amount: 0
        })) || [],
        email_content: order.email_content || undefined
      });
      setEditingId(orderId);
      setCurrentOrderStatus(order.status || null);
      setShowForm(true);
    } catch {
      toast.error('発注情報の読み込みに失敗しました');
    }
  };

  const handleNewOrderWithProject = async (projectId: string) => {
    const orderType = 'material';
    const orderNumber = await generateOrderNumber(orderType);
    setOrderForm({
      order_type: orderType,
      order_number: orderNumber,
      project_id: projectId,
      order_date: format(new Date(), 'yyyy-MM-dd'),
      items: [{
        material_name: '',
        specification: '',
        quantity: 1,
        unit: '個',
        unit_price: 0,
        amount: 0
      }]
    });
    setEditingId(null);
    setCurrentOrderStatus(null);
    setShowForm(true);
  };

  const handleSaveOrder = async (newStatus?: string): Promise<boolean> => {
    if (!orderForm.project_id) {
      toast.error('案件を選択してください');
      return false;
    }

    if (orderForm.order_type === 'material' && (!orderForm.items || orderForm.items.length === 0)) {
      toast.error('発注明細を入力してください');
      return false;
    }

    try {
      const orderData: any = {
        order_number: orderForm.order_number,
        order_type: orderForm.order_type,
        project_id: orderForm.project_id,
        supplier_id: orderForm.order_type === 'material' ? orderForm.supplier_id : null,
        craftsman_id: orderForm.order_type === 'other' ? orderForm.other_customer_id : null,
        order_date: orderForm.order_date,
        delivery_date: orderForm.delivery_date || null,
        delivery_address: orderForm.delivery_address || null,
        delivery_site_name: orderForm.delivery_site_name || null,
        work_description: orderForm.work_description || null,
        status: newStatus || currentOrderStatus || '作成済',
        total_amount: 0,
        notes: orderForm.notes || null,
        email_content: orderForm.email_content || null
      };
      
      // 新規に発注済みにする場合のみemail_sent_atを設定
      if (newStatus === '発注済' && currentOrderStatus !== '発注済') {
        orderData.email_sent_at = new Date().toISOString();
      }

      let savedOrderId = editingId;
      
      if (editingId) {
        const { error } = await supabase
          .from('material_orders')
          .update(orderData)
          .eq('id', editingId);
        
        if (error) throw error;

        // Delete existing items and re-insert
        await supabase
          .from('material_order_items')
          .delete()
          .eq('order_id', editingId);
      } else {
        const { data, error } = await supabase
          .from('material_orders')
          .insert(orderData)
          .select()
          .single();
        
        if (error) throw error;
        savedOrderId = data.id;
      }

      // Insert order items for material orders
      if (orderForm.order_type === 'material' && orderForm.items && savedOrderId) {
        const items = orderForm.items.map(item => ({
          order_id: savedOrderId,
          material_name: item.material_name,
          specification: item.specification || null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: 0,
          amount: 0
        }));

        const { error: itemsError } = await supabase
          .from('material_order_items')
          .insert(items);
        
        if (itemsError) throw itemsError;
      }

      toast.success(
        newStatus === '発注済' ? '発注を完了しました' :
        newStatus === '納品済' ? '納品を完了しました' :
        newStatus === '完了' ? '工事を完了しました' :
        '発注情報を保存しました'
      );
      setShowForm(false);
      // URLパラメータをクリア
      window.history.replaceState({}, document.title, '/orders');
      fetchData();
      return true;
    } catch (error: any) {
      const errorMessage = error?.message || error?.error_description || '保存に失敗しました';
      toast.error(errorMessage);
      return false;
    }
  };

  const handleShowEmailEditor = () => {
    // 既存のメール内容があればそれを使用、なければ自動生成
    if (orderForm.email_content) {
      setEmailContent(orderForm.email_content);
    } else {
      const { subject, body } = generateEmailContent(orderForm);
      setEmailContent(`件名: ${subject}\n\n${body}`);
    }
    setShowEmailEditor(true);
  };


  const handleSaveEmail = () => {
    setOrderForm({ ...orderForm, email_content: emailContent });
    setShowEmailEditor(false);
    toast.success('メール内容を保存しました');
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('この発注を削除してもよろしいですか？')) {
      return;
    }

    try {
      // まず発注明細を削除
      await supabase
        .from('material_order_items')
        .delete()
        .eq('order_id', orderId);

      // 次に発注本体を削除
      const { error } = await supabase
        .from('material_orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast.success('発注を削除しました');
      fetchData();
    } catch {
      toast.error('削除に失敗しました');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailContent).then(() => {
      toast.success('メール内容をコピーしました');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('メール内容をコピーしました');
      } catch (err) {
        toast.error('コピーに失敗しました');
      }
      document.body.removeChild(textArea);
    });
  };

  const handleAddItem = () => {
    setOrderForm({
      ...orderForm,
      items: [
        ...(orderForm.items || []),
        {
          material_name: '',
          specification: '',
          quantity: 1,
          unit: '個',
          unit_price: 0,
          amount: 0
        }
      ]
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...(orderForm.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    setOrderForm({
      ...orderForm,
      items: newItems
    });
  };

  // 月別フィルタリング
  const getFilteredByMonth = () => {
    return orders.filter(order => {
      const orderDate = order.order_date.substring(0, 7); // YYYY-MM形式
      return orderDate === selectedMonth;
    });
  };

  // 利用可能な月のリストを取得
  const getAvailableMonths = () => {
    const months = new Set<string>();
    orders.forEach(order => {
      const month = order.order_date.substring(0, 7);
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  };

  // タブと月別フィルタリング
  const filteredOrders = getFilteredByMonth().filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'material') return order.order_type === 'material' || !order.order_type;
    if (activeTab === 'other') return order.order_type === 'other';
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-full">読み込み中...</div>;
  }

  // 発注登録・編集フォーム
  if (showForm) {
    return (
      <div className="overflow-auto">
        <Card className="max-w-5xl mx-auto shadow-md border-0 rounded-none">
          <div className="bg-gray-100 p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingId ? '発注編集' : '新規発注登録'}
                </h2>
                {currentOrderStatus && (
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    currentOrderStatus === '納品済' || currentOrderStatus === '完了' ? 'bg-green-100 text-green-800' :
                    currentOrderStatus === '発注済' ? 'bg-blue-100 text-blue-800' :
                    currentOrderStatus === '作成済' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {currentOrderStatus}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                className="text-gray-600 hover:bg-gray-200"
                onClick={() => {
                  setShowForm(false);
                  window.history.replaceState({}, document.title, '/orders');
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center justify-between gap-2 bg-gray-50 px-4 py-3 border-b">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setCurrentOrderStatus(null);
                    window.history.replaceState({}, document.title, '/orders');
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  閉じる
                </Button>

                {editingId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('この発注を削除してもよろしいですか？')) {
                        handleDeleteOrder(editingId);
                        setShowForm(false);
                      }
                    }}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSaveOrder()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>

                {currentOrderStatus !== '発注済' && currentOrderStatus !== '納品済' && currentOrderStatus !== '完了' && (
                  <Button
                    onClick={() => handleSaveOrder('発注済')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    発注完了
                  </Button>
                )}

                {currentOrderStatus === '発注済' && orderForm.order_type === 'material' && (
                  <Button
                    onClick={() => handleSaveOrder('納品済')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Package className="h-4 w-4 mr-1" />
                    納品完了
                  </Button>
                )}

                {currentOrderStatus === '発注済' && orderForm.order_type === 'other' && (
                  <Button
                    onClick={() => handleSaveOrder('完了')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Wrench className="h-4 w-4 mr-1" />
                    工事完了
                  </Button>
                )}
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-4">
          {/* 発注タイプ選択 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-semibold">発注タイプ *</Label>
              <Select
                value={orderForm.order_type}
                onValueChange={async (value: 'material' | 'other') => {
                  const newOrderNumber = await generateOrderNumber(value);
                  setOrderForm({ 
                    ...orderForm, 
                    order_type: value,
                    order_number: newOrderNumber,
                    items: value === 'material' ? [{
                      material_name: '',
                      specification: '',
                      quantity: 1,
                      unit: '個',
                      unit_price: 0,
                      amount: 0
                    }] : []
                  });
                }}
                disabled={editingId !== null}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">材料発注</SelectItem>
                  <SelectItem value="other">その他発注（工事依頼）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold">発注番号</Label>
              <Input
                value={orderForm.order_number}
                disabled
                className="bg-gray-50 font-mono text-sm" 
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">発注日</Label>
              <Input
                type="date"
                value={orderForm.order_date}
                onChange={(e) => setOrderForm({ ...orderForm, order_date: e.target.value })}
                className="h-12 text-lg"
              />
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">案件 *</Label>
              <ProjectSelect
                projects={projects}
                value={orderForm.project_id}
                onValueChange={(value) => setOrderForm({ ...orderForm, project_id: value })}
                placeholder="案件を選択"
                showCustomerName={false}
                showAmount={false}
                className="h-12 text-lg"
              />
            </div>

            {orderForm.order_type === 'material' ? (
              <div>
                <Label className="text-sm font-semibold">仕入先</Label>
                <Select
                  value={orderForm.supplier_id || ''}
                  onValueChange={(value) => setOrderForm({ ...orderForm, supplier_id: value })}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="仕入先を選択" />
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
            ) : (
              <div>
                <Label className="text-sm font-semibold">工事依頼先</Label>
                <Select
                  value={orderForm.other_customer_id || ''}
                  onValueChange={(value) => setOrderForm({ ...orderForm, other_customer_id: value })}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="工事依頼先を選択" />
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
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">{orderForm.order_type === 'material' ? '納品日' : '施工日'}</Label>
              <Input
                type="date"
                value={orderForm.delivery_date || ''}
                onChange={(e) => setOrderForm({ ...orderForm, delivery_date: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">{orderForm.order_type === 'material' ? '納品先' : '施工現場'}</Label>
              <Input
                value={orderForm.delivery_site_name || ''}
                onChange={(e) => setOrderForm({ ...orderForm, delivery_site_name: e.target.value })}
                placeholder="例：ロイヤル若葉606号室"
                className="h-12 text-lg"
              />
            </div>
          </div>


          {/* 材料発注の明細 */}
          {orderForm.order_type === 'material' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-xl font-bold">発注明細</Label>
                <Button type="button" size="lg" onClick={handleAddItem}>
                  <Plus className="h-5 w-5 mr-1" />
                  明細追加
                </Button>
              </div>
              
              <div className="space-y-3">
                {orderForm.items?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded">
                    <Input
                      className="col-span-4 h-12 text-lg"
                      placeholder="品名"
                      value={item.material_name}
                      onChange={(e) => handleItemChange(index, 'material_name', e.target.value)}
                    />
                    <Input
                      className="col-span-4 h-12 text-lg"
                      placeholder="仕様"
                      value={item.specification}
                      onChange={(e) => handleItemChange(index, 'specification', e.target.value)}
                    />
                    <Input
                      className="col-span-2 h-12 text-lg"
                      type="number"
                      placeholder="数量"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                    <div className="col-span-2 flex items-center gap-2">
                      <Input
                        className="h-12 text-lg"
                        placeholder="単位"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newItems = orderForm.items?.filter((_, i) => i !== index) || [];
                          setOrderForm({ ...orderForm, items: newItems });
                        }}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* その他発注の作業内容 */}
          {orderForm.order_type === 'other' && (
            <div>
              <Label className="text-sm font-semibold">作業内容</Label>
              <Textarea
                value={orderForm.work_description || ''}
                onChange={(e) => setOrderForm({ ...orderForm, work_description: e.target.value })}
                placeholder="作業内容を詳しく記載してください"
                rows={6}
                className="text-lg"
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-semibold">備考</Label>
            <Textarea
              value={orderForm.notes || ''}
              onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
              rows={3}
              className="text-lg"
            />
          </div>

          {/* メール内容 */}
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setShowEmailSection(!showEmailSection)}
            >
              <h3 className="text-lg font-semibold">メール内容</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmailSection(!showEmailSection);
                }}
              >
                {showEmailSection ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
            
            {showEmailSection && (
              <div className="p-6 pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={async () => {
                        // まずDB保存
                        const saved = await handleSaveOrder(false);
                        if (!saved) return;

                        // メール送信（mailtoリンク）
                        const { subject, body } = orderForm.email_content ? (() => {
                          const lines = orderForm.email_content.split('\n');
                          const subjectLine = lines.find(line => line.startsWith('件名:'));
                          const subject = subjectLine ? subjectLine.replace('件名:', '').trim() : '';
                          const bodyStartIndex = lines.findIndex(line => line === '') + 1;
                          const body = lines.slice(bodyStartIndex).join('\n');
                          return { subject, body };
                        })() : generateEmailContent(orderForm);

                        const recipient = orderForm.order_type === 'material'
                          ? customers.find(c => c.id === orderForm.supplier_id)
                          : customers.find(c => c.id === orderForm.other_customer_id);

                        if (!recipient?.email) {
                          toast.error('送信先のメールアドレスが登録されていません');
                          return;
                        }

                        const mailtoLink = `mailto:${encodeURIComponent(recipient.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        window.location.href = mailtoLink;
                      }}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      メール送信
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        // まずDB保存
                        const saved = await handleSaveOrder(false);
                        if (!saved) return;

                        // 編集されたメール内容があればそれを使用、なければ自動生成
                        const fullText = orderForm.email_content || (() => {
                          const { subject, body } = generateEmailContent(orderForm);
                          return `件名: ${subject}\n\n${body}`;
                        })();

                        navigator.clipboard.writeText(fullText).then(() => {
                          toast.success('メール内容をコピーしました');
                        }).catch(() => {
                          const textArea = document.createElement('textarea');
                          textArea.value = fullText;
                          document.body.appendChild(textArea);
                          textArea.select();
                          try {
                            document.execCommand('copy');
                            toast.success('メール内容をコピーしました');
                          } catch (err) {
                            toast.error('コピーに失敗しました');
                          }
                          document.body.removeChild(textArea);
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      コピー
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleShowEmailEditor}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      編集
                    </Button>
                  </div>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  {(() => {
                    // 編集されたメール内容があればそれを使用、なければ自動生成
                    if (orderForm.email_content) {
                      const lines = orderForm.email_content.split('\n');
                      const subjectLine = lines.find(line => line.startsWith('件名:'));
                      const subject = subjectLine ? subjectLine.replace('件名:', '').trim() : '';
                      const bodyStartIndex = lines.findIndex(line => line === '') + 1;
                      const body = lines.slice(bodyStartIndex).join('\n');
                      return (
                        <>
                          <div className="mb-3 pb-3 border-b">
                            <span className="font-semibold text-gray-600">件名:</span>
                            <p className="mt-1">{subject}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-600">本文:</span>
                            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{body}</pre>
                          </div>
                        </>
                      );
                    } else {
                      const { subject, body } = generateEmailContent(orderForm);
                      return (
                        <>
                          <div className="mb-3 pb-3 border-b">
                            <span className="font-semibold text-gray-600">件名:</span>
                            <p className="mt-1">{subject}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-600">本文:</span>
                            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{body}</pre>
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>

            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectId = searchParams.get('projectId');
  // 編集中またはフォーム表示中はorderForm.project_idを使用（空文字列は除外）
  const currentProjectId = projectId || (orderForm.project_id && orderForm.project_id !== '' ? orderForm.project_id : null);

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">発注管理</h1>
          {/* 月別ナビゲーション */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const availableMonths = getAvailableMonths();
                const currentIndex = availableMonths.indexOf(selectedMonth);
                if (currentIndex < availableMonths.length - 1) {
                  setSelectedMonth(availableMonths[currentIndex + 1]);
                }
              }}
              disabled={getAvailableMonths().indexOf(selectedMonth) === getAvailableMonths().length - 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 min-w-[120px] text-center font-medium border rounded">
              {(() => {
                const [year, monthNum] = selectedMonth.split('-');
                return `${year}年${parseInt(monthNum)}月`;
              })()}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const availableMonths = getAvailableMonths();
                const currentIndex = availableMonths.indexOf(selectedMonth);
                if (currentIndex > 0) {
                  setSelectedMonth(availableMonths[currentIndex - 1]);
                }
              }}
              disabled={getAvailableMonths().indexOf(selectedMonth) === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewOrder}>
            <Plus className="h-4 w-4 mr-1" />
            新規発注
          </Button>
          {currentProjectId && (
            <Button
              onClick={() => router.push(`/dashboard/projects?id=${currentProjectId}`)}
              variant="outline"
            >
              <X className="h-4 w-4 mr-1" />
              閉じる
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">発注一覧</TabsTrigger>
          <TabsTrigger value="material">
            <Package className="h-4 w-4 mr-1" />
            材料発注
          </TabsTrigger>
          <TabsTrigger value="other">
            <Wrench className="h-4 w-4 mr-1" />
            その他発注
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="text-sm text-gray-600 mb-2">
            {selectedMonth}の発注: {filteredOrders.length}件
          </div>

          {/* テーブル表示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">発注No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">日付</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">案件名</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">発注先</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">品名</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">種別</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ステータス</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.flatMap((order) => {
                  const supplierName = order.order_type === 'material' || !order.order_type
                    ? order.supplier?.customer_name
                    : order.other_customer?.customer_name;

                  // 品名がない場合は1行のみ
                  if (!order.items || order.items.length === 0) {
                    return (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setOrderForm({
                            order_type: (order.order_type as 'material' | 'other') || 'material',
                            order_number: order.order_number,
                            project_id: order.project_id || '',
                            supplier_id: order.supplier_id || undefined,
                            other_customer_id: order.craftsman_id || undefined,
                            order_date: order.order_date,
                            delivery_date: order.delivery_date || undefined,
                            delivery_address: order.delivery_address || undefined,
                            delivery_site_name: order.delivery_site_name || undefined,
                            work_description: order.work_description || undefined,
                            notes: order.notes || undefined,
                            total_amount: order.total_amount || undefined,
                            items: [],
                            email_content: order.email_content || undefined
                          });
                          setEditingId(order.id);
                          setCurrentOrderStatus(order.status || null);
                          setShowForm(true);
                        }}
                      >
                        <td className="px-4 py-2 text-sm text-gray-900">{order.order_number}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{format(new Date(order.order_date), 'M/d')}</td>
                        <td className="px-4 py-2 text-sm font-medium">{order.project?.project_name || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{supplierName || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">-</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            order.order_type === 'material' || !order.order_type
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {order.order_type === 'material' || !order.order_type ? '材料' : '工事'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            order.status === '納品済' || order.status === '完了' ? 'bg-green-100 text-green-700' :
                            order.status === '発注済' ? 'bg-blue-100 text-blue-700' :
                            order.status === '作成済' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status || '作成済'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order.id);
                              }}
                            >
                              <Trash className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // 品名ごとに行を表示（Excel風）
                  return order.items.map((item, itemIndex) => (
                    <tr
                      key={`${order.id}-${itemIndex}`}
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setOrderForm({
                          order_type: (order.order_type as 'material' | 'other') || 'material',
                          order_number: order.order_number,
                          project_id: order.project_id || '',
                          supplier_id: order.supplier_id || undefined,
                          other_customer_id: order.craftsman_id || undefined,
                          order_date: order.order_date,
                          delivery_date: order.delivery_date || undefined,
                          delivery_address: order.delivery_address || undefined,
                          delivery_site_name: order.delivery_site_name || undefined,
                          work_description: order.work_description || undefined,
                          notes: order.notes || undefined,
                          total_amount: order.total_amount || undefined,
                          items: order.items?.map(item => ({
                            material_name: item.material_name,
                            specification: item.specification || '',
                            quantity: item.quantity,
                            unit: item.unit,
                            unit_price: 0,
                            amount: 0
                          })) || [],
                          email_content: order.email_content || undefined
                        });
                        setEditingId(order.id);
                        setCurrentOrderStatus(order.status || null);
                        setShowForm(true);
                      }}
                    >
                      {/* 発注No・日付・案件名・発注先は最初の行のみ表示 */}
                      <td className="px-4 py-2 text-sm text-gray-900">{itemIndex === 0 ? order.order_number : ''}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{itemIndex === 0 ? format(new Date(order.order_date), 'M/d') : ''}</td>
                      <td className="px-4 py-2 text-sm font-medium">{itemIndex === 0 ? order.project?.project_name || '-' : ''}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{itemIndex === 0 ? supplierName || '-' : ''}</td>
                      {/* 品名は各行に表示 */}
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.material_name}
                        {item.specification && <span className="text-gray-500 ml-1">({item.specification})</span>}
                        {item.quantity && item.unit && <span className="text-gray-600 ml-2">{item.quantity}{item.unit}</span>}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {itemIndex === 0 && (
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            order.order_type === 'material' || !order.order_type
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {order.order_type === 'material' || !order.order_type ? '材料' : '工事'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {itemIndex === 0 && (
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            order.status === '納品済' || order.status === '完了' ? 'bg-green-100 text-green-700' :
                            order.status === '発注済' ? 'bg-blue-100 text-blue-700' :
                            order.status === '作成済' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status || '作成済'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {itemIndex === 0 && (
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order.id);
                              }}
                            >
                              <Trash className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                発注データがありません
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* メール内容編集ダイアログ */}
      <Dialog open={showEmailEditor} onOpenChange={setShowEmailEditor}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>メール内容の確認・編集</DialogTitle>
            <DialogDescription>
              メール内容を確認し、必要に応じて編集してください
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEmailEditor(false)}>
                閉じる
              </Button>
              <Button onClick={handleCopyEmail}>
                <Copy className="h-4 w-4 mr-1" />
                コピー
              </Button>
              <Button onClick={handleSaveEmail}>
                <Save className="h-4 w-4 mr-1" />
                保存して戻る
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}