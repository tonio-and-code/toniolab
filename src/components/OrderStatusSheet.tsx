'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Printer, ChevronLeft, ChevronRight } from 'lucide-react';

interface OrderItem {
  id: string;
  order_id: string;
  material_name: string;
  specification?: string;
  quantity?: number;
  unit?: string;
}

interface OrderRow {
  sellNo: string;
  acceptNo: string;
  date: string;
  projectName: string;
  supplier: string;
  productName: string;
  quantity: string;
  construction: string;
  status: string;
}

export default function OrderStatusSheet() {
  const [loading, setLoading] = useState(true);
  const [orderRows, setOrderRows] = useState<OrderRow[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, [selectedMonth]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 月の範囲を計算
      const [year, month] = selectedMonth.split('-');
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${year}-${month}-${lastDay}`;

      // 発注データを取得
      const { data: orders, error: ordersError } = await supabase
        .from('material_orders')
        .select(`
          id,
          order_number,
          order_date,
          status,
          project:projects(id, project_name),
          supplier:customers!material_orders_supplier_id_fkey(customer_name)
        `)
        .gte('order_date', startDate)
        .lte('order_date', endDate)
        .order('order_date', { ascending: true });

      if (ordersError) {
        throw ordersError;
      }

      // 各発注の明細を取得
      const rows: OrderRow[] = [];

      for (const order of orders || []) {
        const { data: items, error: itemsError } = await supabase
          .from('material_order_items')
          .select('*')
          .eq('order_id', order.id);

        // エラーがあっても続行して、発注自体は表示する

        // 明細がある場合は各行を追加
        if (items && items.length > 0) {
          items.forEach((item: OrderItem, index: number) => {
            rows.push({
              sellNo: index === 0 ? order.order_number.replace(/^(ORD-|PO)/, '') : '',
              acceptNo: '', // 受注Noは空欄
              date: index === 0 ? formatDate(order.order_date) : '',
              projectName: index === 0 ? (order.project?.project_name || '') : '',
              supplier: index === 0 ? (order.supplier?.customer_name || '') : '',
              productName: item.material_name || '',
              quantity: item.quantity && item.unit ? `${item.quantity}${item.unit}` : (item.specification || ''),
              construction: '', // 施工は空欄
              status: order.status || '未発注'
            });
          });
        } else {
          // 明細がない場合も1行追加
          rows.push({
            sellNo: order.order_number.replace(/^(ORD-|PO)/, ''),
            acceptNo: '',
            date: formatDate(order.order_date),
            projectName: order.project?.project_name || '',
            supplier: order.supplier?.customer_name || '',
            productName: '',
            quantity: '',
            construction: '',
            status: order.status || '未発注'
          });
        }
      }

      setOrderRows(rows);
    } catch (error: any) {
      toast.error(`データの取得に失敗しました: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}-`;
  };

  const handlePrint = () => {
    window.print();
  };

  const changeMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(newMonth);
  };

  const getMonthLabel = () => {
    const [year, month] = selectedMonth.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  return (
    <div className="h-full p-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">発注状況一覧</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => changeMonth(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-4 py-2 min-w-[140px] text-center font-medium bg-gray-50 rounded">
                  {getMonthLabel()}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => changeMonth(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="print-button"
              >
                <Printer className="h-4 w-4 mr-2" />
                印刷
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96 text-gray-500">
              読み込み中...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-emerald-50 border-b-2 border-emerald-200">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-24">売No.</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-24">受注No</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-20">日付</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-48">プロジェクト名</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-32">得意先</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300">商品名</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-32">数量等</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-24">施工</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 w-20">済</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                        発注データがありません
                      </td>
                    </tr>
                  ) : (
                    orderRows.map((row, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-3 py-2 border-r border-gray-200">{row.sellNo}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{row.acceptNo}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{row.date}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{row.projectName}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{row.supplier}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{row.productName}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{row.quantity}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{row.construction}</td>
                        <td className="px-3 py-2 text-center">
                          {row.status === '納品済' || row.status === '完了' ? '済' : ''}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-button {
            display: none !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </div>
  );
}
