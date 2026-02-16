'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Calendar,
  Send,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Printer,
  Mail,
  Copy,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useSearchParams } from 'next/navigation';
import { ProjectSelect } from '@/components/ui/project-select';

interface Customer {
  id: string;
  customer_name: string;
}

interface Project {
  id: string;
  project_name: string;
  created_at: string;
  customer_name?: string;
  receivable_amount?: number;
}

interface MaterialOrderItem {
  id?: string;
  material_name: string;
  specification?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  amount: number;
  notes?: string;
}

interface MaterialOrder {
  id?: string;
  order_number?: string;
  project_id?: string;
  supplier_id?: string;
  order_date: string;
  delivery_date?: string;
  delivery_address?: string;
  delivery_site_name?: string;
  status?: string;
  total_amount?: number;
  notes?: string;
  items?: MaterialOrderItem[];
  project?: Project;
  supplier?: Customer;
}

const MaterialOrdersManagerV2: React.FC = () => {
  const [orders, setOrders] = useState<MaterialOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [suppliers, setSuppliers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState('list');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [editingOrder, setEditingOrder] = useState<MaterialOrder | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<MaterialOrder | null>(null);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get('projectId');

  // フォーム状態
  const [orderForm, setOrderForm] = useState<MaterialOrder>({
    order_date: new Date().toISOString().split('T')[0],
    items: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  // URLパラメータから案件IDが指定されている場合
  useEffect(() => {
    if (projectIdFromUrl && projects.length > 0 && suppliers.length > 0) {
      const nagahamaSupplier = suppliers.find(s => s.customer_name === '永浜クロス');
      
      setOrderForm({
        order_date: new Date().toISOString().split('T')[0],
        project_id: projectIdFromUrl,
        supplier_id: nagahamaSupplier?.id || suppliers[0]?.id,
        items: []
      });
      setShowForm(true);
    }
  }, [projectIdFromUrl, projects, suppliers]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 案件の取得
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // 顧客情報を追加
      const projectsWithCustomers = await Promise.all(
        (projectsData || []).map(async (project) => {
          if (project.receivable_customer_id) {
            const { data: customerData } = await supabase
              .from('customers')
              .select('customer_name')
              .eq('id', project.receivable_customer_id)
              .single();

            return {
              ...project,
              customer_name: customerData?.customer_name || ''
            };
          }
          return {
            ...project,
            customer_name: ''
          };
        })
      );

      setProjects(projectsWithCustomers);

      // 仕入先の取得
      const { data: suppliersData } = await supabase
        .from('customers')
        .select('*')
        .order('customer_name');
      
      setSuppliers(suppliersData || []);

      // 発注データの取得
      const { data: ordersData, error: ordersError } = await supabase
        .from('material_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (!ordersError && ordersData) {
        // 発注明細の取得
        if (ordersData.length > 0) {
          const orderIds = ordersData.map(o => o.id);
          const { data: itemsData } = await supabase
            .from('material_order_items')
            .select('*')
            .in('order_id', orderIds);

          if (itemsData) {
            const itemsByOrderId = itemsData.reduce((acc, item) => {
              if (!acc[item.order_id]) acc[item.order_id] = [];
              acc[item.order_id].push(item);
              return acc;
            }, {} as Record<string, MaterialOrderItem[]>);

            // プロジェクトと仕入先情報を追加
            for (const order of ordersData) {
              order.items = itemsByOrderId[order.id] || [];
              order.project = projectsData?.find(p => p.id === order.project_id);
              order.supplier = suppliersData?.find(s => s.id === order.supplier_id);
            }
          }
        }
        setOrders(ordersData);
      }

    } catch {
      // Error fetching data silently handled
    } finally {
      setLoading(false);
    }
  };

  const generateOrderNumber = async () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    try {
      const { data } = await supabase
        .from('material_orders')
        .select('order_number')
        .like('order_number', `PO${year}${month}%`)
        .order('order_number', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].order_number.slice(-3));
        return `PO${year}${month}${String(lastNumber + 1).padStart(3, '0')}`;
      }
    } catch {
      // Use default order number
    }

    return `PO${year}${month}001`;
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

  const handleRemoveItem = (index: number) => {
    const newItems = orderForm.items?.filter((_, i) => i !== index) || [];
    const total = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    setOrderForm({
      ...orderForm,
      items: newItems,
      total_amount: total
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...(orderForm.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // 金額の自動計算
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
      const unitPrice = field === 'unit_price' ? Number(value) : Number(newItems[index].unit_price);
      newItems[index].amount = quantity * unitPrice;
    }

    // 合計金額の計算
    const total = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);

    setOrderForm({
      ...orderForm,
      items: newItems,
      total_amount: total
    });
  };

  const handleSaveOrder = async () => {
    if (!orderForm.project_id) {
      toast.error('案件を選択してください');
      return;
    }

    if (!orderForm.items || orderForm.items.length === 0) {
      toast.error('発注明細を入力してください');
      return;
    }

    // 永浜クロスを自動設定
    let supplierId = orderForm.supplier_id;
    if (!supplierId) {
      const nagahamaSupplier = suppliers.find(s => s.customer_name === '永浜クロス');
      if (nagahamaSupplier) {
        supplierId = nagahamaSupplier.id;
      } else if (suppliers.length > 0) {
        supplierId = suppliers[0].id;
      } else {
        toast.error('発注先が登録されていません');
        return;
      }
    }

    try {
      const orderNumber = editingOrder?.order_number || await generateOrderNumber();
      
      const orderData = {
        order_number: orderNumber,
        project_id: orderForm.project_id,
        supplier_id: supplierId,
        order_date: orderForm.order_date,
        delivery_date: orderForm.delivery_date,
        delivery_address: orderForm.delivery_address,
        delivery_site_name: orderForm.delivery_site_name,
        status: orderForm.status || '未発注',
        total_amount: orderForm.total_amount,
        notes: orderForm.notes
      };

      if (editingOrder) {
        // 更新
        const { error: updateError } = await supabase
          .from('material_orders')
          .update(orderData)
          .eq('id', editingOrder.id);

        if (updateError) throw updateError;

        // 既存の明細を削除
        await supabase
          .from('material_order_items')
          .delete()
          .eq('order_id', editingOrder.id);

        // 新しい明細を追加
        const itemsData = orderForm.items?.map(item => ({
          order_id: editingOrder.id,
          ...item
        }));

        const { error: itemsError } = await supabase
          .from('material_order_items')
          .insert(itemsData);

        if (itemsError) throw itemsError;

        toast.success('発注情報を更新しました');
      } else {
        // 新規作成
        const { data: newOrder, error: insertError } = await supabase
          .from('material_orders')
          .insert(orderData)
          .select()
          .single();

        if (insertError) throw insertError;

        // 明細を追加
        const itemsData = orderForm.items?.map(item => ({
          order_id: newOrder.id,
          ...item
        }));

        const { error: itemsError } = await supabase
          .from('material_order_items')
          .insert(itemsData);

        if (itemsError) throw itemsError;

        toast.success('発注情報を登録しました');
      }

      setShowForm(false);
      setEditingOrder(null);
      setOrderForm({
        order_date: new Date().toISOString().split('T')[0],
        items: []
      });
      
      fetchData();

    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error?.message || '不明なエラー'}`);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('この発注を削除しますか？')) return;

    try {
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

  const handleEditOrder = (order: MaterialOrder) => {
    setEditingOrder(order);
    setOrderForm(order);
    setShowForm(true);
  };

  const handleNewOrder = () => {
    const nagahamaSupplier = suppliers.find(s => s.customer_name === '永浜クロス');
    
    setEditingOrder(null);
    setOrderForm({
      order_date: new Date().toISOString().split('T')[0],
      supplier_id: nagahamaSupplier?.id || suppliers[0]?.id,
      items: []
    });
    setShowForm(true);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '発注済':
        return 'bg-blue-100 text-blue-800';
      case '納品済':
        return 'bg-green-100 text-green-800';
      case 'キャンセル':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateEmailContent = (order: MaterialOrder) => {
    const supplier = order.supplier?.customer_name || '永浜クロス';
    const deliveryDate = order.delivery_date 
      ? format(new Date(order.delivery_date), 'yyyy年MM月dd日', { locale: ja })
      : '別途ご連絡';
    
    const subject = `【発注】${order.project?.project_name || ''} - ${order.order_number}`;
    
    const body = `${supplier} 御中

いつもお世話になっております。
下記の通り発注いたしますので、ご確認の上、手配をお願いいたします。

■発注番号：${order.order_number}
■案件名：${order.project?.project_name || ''}
■納品日：${deliveryDate}
■納品先：${order.delivery_site_name || '別途ご連絡'}
${order.delivery_address ? `■住所：${order.delivery_address}` : ''}

【発注明細】
${order.items?.map(item => 
`・${item.material_name}${item.specification ? ` (${item.specification})` : ''}
  数量：${item.quantity}${item.unit}　単価：¥${item.unit_price?.toLocaleString()}　金額：¥${item.amount?.toLocaleString()}`
).join('\n')}

合計金額：¥${order.total_amount?.toLocaleString()}

${order.notes ? `\n備考：\n${order.notes}\n` : ''}
何かご不明な点がございましたら、ご連絡ください。
よろしくお願いいたします。`;

    return { subject, body };
  };

  const handleCopyEmail = (order: MaterialOrder) => {
    const { subject, body } = generateEmailContent(order);
    const fullText = `件名: ${subject}\n\n${body}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      toast.success('メール内容をコピーしました');
    }).catch(() => {
      toast.error('コピーに失敗しました');
    });
  };

  const handleShowPreview = (order: MaterialOrder) => {
    setSelectedOrder(order);
    setShowPreview(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">読み込み中...</div>;
  }

  // 発注書プレビュー（印刷用）
  if (showPreview && selectedOrder) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 no-print">
            <h2 className="text-xl font-bold">発注書プレビュー</h2>
            <div className="flex gap-2">
              <Button onClick={() => handleCopyEmail(selectedOrder)}>
                <Copy className="h-4 w-4 mr-1" />
                メール内容をコピー
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                印刷
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPreview(false);
                  setSelectedOrder(null);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 印刷用発注書 */}
          <div className="max-w-4xl mx-auto">
            <div className="border-2 border-gray-800 p-8">
              <h1 className="text-3xl font-bold text-center mb-8">発　注　書</h1>
              
              <div className="mb-6">
                <div className="text-lg font-bold mb-2">
                  {selectedOrder.supplier?.customer_name || '永浜クロス'} 御中
                </div>
                <div className="text-right">
                  <div>発注番号：{selectedOrder.order_number}</div>
                  <div>発注日：{format(new Date(selectedOrder.order_date), 'yyyy年MM月dd日', { locale: ja })}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2">
                  <span className="font-bold">案件名：</span>
                  {selectedOrder.project?.project_name}
                </div>
                <div className="mb-2">
                  <span className="font-bold">納品日：</span>
                  {selectedOrder.delivery_date 
                    ? format(new Date(selectedOrder.delivery_date), 'yyyy年MM月dd日', { locale: ja })
                    : '別途ご連絡'}
                </div>
                <div className="mb-2">
                  <span className="font-bold">納品先：</span>
                  {selectedOrder.delivery_site_name || '別途ご連絡'}
                </div>
                {selectedOrder.delivery_address && (
                  <div className="mb-2">
                    <span className="font-bold">住所：</span>
                    {selectedOrder.delivery_address}
                  </div>
                )}
              </div>

              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="border-y-2 border-gray-800">
                    <th className="text-left py-2 px-2">品名</th>
                    <th className="text-left py-2 px-2">仕様</th>
                    <th className="text-center py-2 px-2 w-20">数量</th>
                    <th className="text-center py-2 px-2 w-16">単位</th>
                    <th className="text-right py-2 px-2 w-24">単価</th>
                    <th className="text-right py-2 px-2 w-28">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-2">{item.material_name}</td>
                      <td className="py-2 px-2">{item.specification || '-'}</td>
                      <td className="text-center py-2 px-2">{item.quantity}</td>
                      <td className="text-center py-2 px-2">{item.unit}</td>
                      <td className="text-right py-2 px-2">¥{item.unit_price?.toLocaleString()}</td>
                      <td className="text-right py-2 px-2">¥{item.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-800">
                    <td colSpan={5} className="text-right py-2 px-2 font-bold">合計金額</td>
                    <td className="text-right py-2 px-2 font-bold text-lg">
                      ¥{selectedOrder.total_amount?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {selectedOrder.notes && (
                <div className="mb-6">
                  <div className="font-bold mb-2">備考：</div>
                  <div className="whitespace-pre-wrap">{selectedOrder.notes}</div>
                </div>
              )}

              <div className="text-sm text-gray-600 mt-8">
                <div>何かご不明な点がございましたら、ご連絡ください。</div>
                <div>よろしくお願いいたします。</div>
              </div>
            </div>
          </div>
        </div>

        {/* 印刷用スタイル */}
        <style jsx>{`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .fixed {
              position: static;
            }
          }
        `}</style>
      </div>
    );
  }

  // フォーム表示（フルスクリーン）
  if (showForm) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {editingOrder ? '発注編集' : '新規発注登録'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setEditingOrder(null);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div>
              <Label>案件 *</Label>
              <ProjectSelect
                projects={projects}
                value={orderForm.project_id || ''}
                onValueChange={(value) => setOrderForm({...orderForm, project_id: value})}
                placeholder="案件を選択"
                showCustomerName={true}
                showAmount={true}
              />
            </div>

            <div>
              <Label>発注先</Label>
              <Input
                value="永浜クロス"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label>発注日</Label>
              <Input
                type="date"
                value={orderForm.order_date}
                onChange={(e) => setOrderForm({...orderForm, order_date: e.target.value})}
              />
            </div>

            <div>
              <Label>納品日</Label>
              <Input
                type="date"
                value={orderForm.delivery_date || ''}
                onChange={(e) => setOrderForm({...orderForm, delivery_date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label>納品先現場名</Label>
              <Input
                value={orderForm.delivery_site_name || ''}
                onChange={(e) => setOrderForm({...orderForm, delivery_site_name: e.target.value})}
                placeholder="例：新宿区若葉2-23-2 ロイヤル若葉606号室"
              />
            </div>

            <div>
              <Label>納品先住所</Label>
              <Input
                value={orderForm.delivery_address || ''}
                onChange={(e) => setOrderForm({...orderForm, delivery_address: e.target.value})}
                placeholder="例：東京都新宿区..."
              />
            </div>
          </div>

          {/* 発注明細 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg">発注明細 *</Label>
              <Button
                onClick={handleAddItem}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                明細追加
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">品名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">仕様</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-24">数量</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-20">単位</th>
                    <th className="px-4 py-3 text-right text-sm font-medium w-32">単価</th>
                    <th className="px-4 py-3 text-right text-sm font-medium w-32">金額</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {orderForm.items?.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">
                        <Input
                          value={item.material_name}
                          onChange={(e) => handleItemChange(index, 'material_name', e.target.value)}
                          placeholder="材料名を入力"
                          className="w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.specification || ''}
                          onChange={(e) => handleItemChange(index, 'specification', e.target.value)}
                          placeholder="仕様を入力"
                          className="w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full text-right"
                          min="0"
                          step="0.1"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          className="w-full text-center"
                          placeholder="個"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={item.unit_price || ''}
                          onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                          className="w-full text-right"
                          placeholder="0"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ¥{item.amount?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!orderForm.items || orderForm.items.length === 0) && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        明細を追加してください
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right font-semibold">
                      合計金額：
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-lg">
                      ¥{orderForm.total_amount?.toLocaleString() || 0}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 備考 */}
          <div className="mb-6">
            <Label>備考</Label>
            <Textarea
              value={orderForm.notes || ''}
              onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
              rows={3}
              placeholder="備考を入力"
              className="w-full"
            />
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingOrder(null);
              }}
            >
              キャンセル
            </Button>
            <Button onClick={handleSaveOrder}>
              <Save className="h-4 w-4 mr-1" />
              {editingOrder ? '更新' : '登録'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // メインビュー
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            材料発注管理
          </h2>
          <Button onClick={handleNewOrder}>
            <Plus className="h-4 w-4 mr-2" />
            新規発注
          </Button>
        </div>

        <Tabs value={viewTab} onValueChange={setViewTab}>
          <TabsList>
            <TabsTrigger value="list">発注一覧</TabsTrigger>
            <TabsTrigger value="calendar">カレンダー</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-4 mt-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">発注データがありません</p>
                    <Button onClick={handleNewOrder}>
                      <Plus className="h-4 w-4 mr-2" />
                      新規発注を作成
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderExpansion(order.id!)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {expandedOrders.has(order.id!) ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                            <span className="font-mono text-sm">{order.order_number}</span>
                          </div>
                          <Badge className={getStatusColor(order.status || '未発注')}>
                            {order.status || '未発注'}
                          </Badge>
                          <span className="text-sm">{order.project?.project_name}</span>
                          <span className="text-sm text-gray-500">
                            {order.order_date && format(new Date(order.order_date), 'yyyy/MM/dd')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            ¥{order.total_amount?.toLocaleString() || 0}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowPreview(order);
                            }}
                            title="発注書プレビュー"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyEmail(order);
                            }}
                            title="メール内容をコピー"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrder(order);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id!);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedOrders.has(order.id!) && (
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">納品日：</span>
                              <span className="ml-2">
                                {order.delivery_date ? 
                                  format(new Date(order.delivery_date), 'yyyy/MM/dd') : 
                                  '未定'
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">納品先：</span>
                              <span className="ml-2">{order.delivery_site_name || '-'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">発注先：</span>
                              <span className="ml-2">{order.supplier?.customer_name || '永浜クロス'}</span>
                            </div>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left">品名</th>
                                    <th className="px-4 py-2 text-left">仕様</th>
                                    <th className="px-4 py-2 text-right">数量</th>
                                    <th className="px-4 py-2 text-center">単位</th>
                                    <th className="px-4 py-2 text-right">単価</th>
                                    <th className="px-4 py-2 text-right">金額</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, index) => (
                                    <tr key={index} className="border-t">
                                      <td className="px-4 py-2">{item.material_name}</td>
                                      <td className="px-4 py-2">{item.specification || '-'}</td>
                                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                                      <td className="px-4 py-2 text-center">{item.unit}</td>
                                      <td className="px-4 py-2 text-right">
                                        ¥{item.unit_price?.toLocaleString() || 0}
                                      </td>
                                      <td className="px-4 py-2 text-right">
                                        ¥{item.amount?.toLocaleString() || 0}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {order.notes && (
                            <div className="text-sm">
                              <span className="text-gray-500">備考：</span>
                              <p className="mt-1">{order.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              size="sm"
                              onClick={() => handleShowPreview(order)}
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              発注書を印刷
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyEmail(order)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              メール内容をコピー
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  カレンダービューは準備中です
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MaterialOrdersManagerV2;