'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface GrossProfitRow {
  id?: string;
  category: string;
  size: string;
  quantity: number;
  unit_price: number;
  amount: number;
  display_order: number;
}

interface GrossProfitData {
  id?: string;
  project_id: string;
  location: string;
  construction_fee: number;
  other_expenses: number;
  items: GrossProfitRow[];
}

interface ProjectGrossProfitDBProps {
  projectId: string;
  projectName: string;
  clientName: string;
}

const ProjectGrossProfitDB: React.FC<ProjectGrossProfitDBProps> = ({
  projectId,
  projectName,
  clientName,
}) => {
  const [data, setData] = useState<GrossProfitData>({
    project_id: projectId,
    location: '',
    construction_fee: 0,
    other_expenses: 0,
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchGrossProfitData();
  }, [projectId]);

  const fetchGrossProfitData = async () => {
    try {
      setLoading(true);
      
      // 粗利表データ取得
      const { data: profitData, error: profitError } = await supabase
        .from('project_gross_profit')
        .select('*, project_gross_profit_items(*)')
        .eq('project_id', projectId)
        .single();

      if (profitError && profitError.code !== 'PGRST116') {
        return;
      }

      if (profitData) {
        setData({
          id: profitData.id,
          project_id: projectId,
          location: profitData.location || '',
          construction_fee: profitData.construction_fee || 0,
          other_expenses: profitData.other_expenses || 0,
          items: profitData.project_gross_profit_items
            ?.sort((a: any, b: any) => a.display_order - b.display_order)
            .map((item: any) => ({
              id: item.id,
              category: item.category,
              size: item.size || '',
              quantity: item.quantity || 0,
              unit_price: item.unit_price || 0,
              amount: item.amount || 0,
              display_order: item.display_order || 0,
            })) || [],
        });
      }
    } catch {
      // Failed to load gross profit data
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (index: number, field: keyof GrossProfitRow, value: any) => {
    setData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // 数量と単価が変更されたら金額を自動計算
      if (field === 'quantity' || field === 'unit_price') {
        newItems[index].amount = newItems[index].quantity * newItems[index].unit_price;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const addRow = () => {
    const newRow: GrossProfitRow = {
      category: '',
      size: '',
      quantity: 0,
      unit_price: 0,
      amount: 0,
      display_order: data.items.length,
    };
    setData(prev => ({ ...prev, items: [...prev.items, newRow] }));
  };

  const deleteRow = (index: number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const saveData = async () => {
    try {
      setSaving(true);
      
      // 粗利表メインデータの保存/更新
      let grossProfitId = data.id;
      
      if (grossProfitId) {
        // 更新
        const { error } = await supabase
          .from('project_gross_profit')
          .update({
            location: data.location,
            construction_fee: data.construction_fee,
            other_expenses: data.other_expenses,
          })
          .eq('id', grossProfitId);
          
        if (error) throw error;
      } else {
        // 新規作成
        const { data: newData, error } = await supabase
          .from('project_gross_profit')
          .insert({
            project_id: projectId,
            location: data.location,
            construction_fee: data.construction_fee,
            other_expenses: data.other_expenses,
          })
          .select()
          .single();
          
        if (error) throw error;
        grossProfitId = newData.id;
        setData(prev => ({ ...prev, id: grossProfitId }));
      }
      
      // 既存の明細を削除
      const { error: deleteError } = await supabase
        .from('project_gross_profit_items')
        .delete()
        .eq('gross_profit_id', grossProfitId);
        
      if (deleteError) throw deleteError;
      
      // 新しい明細を挿入
      if (data.items.length > 0) {
        const itemsToInsert = data.items.map((item, index) => ({
          gross_profit_id: grossProfitId,
          category: item.category,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
          display_order: index,
        }));
        
        const { error: insertError } = await supabase
          .from('project_gross_profit_items')
          .insert(itemsToInsert);
          
        if (insertError) throw insertError;
      }
      
      toast.success('粗利表を保存しました');
      await fetchGrossProfitData(); // 再読み込み
    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const 材料費合計 = data.items.reduce((sum, item) => sum + item.amount, 0);
  const 売上金額 = 材料費合計 + data.construction_fee + data.other_expenses;
  const 粗利 = 売上金額 - 材料費合計;
  const 粗利率 = 売上金額 > 0 ? ((粗利 / 売上金額) * 100).toFixed(1) : '0';

  if (loading) {
    return <Card className="p-6">読み込み中...</Card>;
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">工　事　台　帳</h2>
          <Button onClick={saveData} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? '保存中...' : 'DBに保存'}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <span className="font-semibold mr-2">得意先:</span>
            <span>{clientName}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">現場所在:</span>
            <Input
              value={data.location}
              onChange={(e) => setData(prev => ({ ...prev, location: e.target.value }))}
              className="w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1 text-left">材料費</th>
              <th className="border border-gray-300 px-2 py-1 text-center">サイズ</th>
              <th className="border border-gray-300 px-2 py-1 text-center">数量</th>
              <th className="border border-gray-300 px-2 py-1 text-center">単価</th>
              <th className="border border-gray-300 px-2 py-1 text-center">金額</th>
              <th className="border border-gray-300 px-2 py-1 text-center">小計</th>
              <th className="border border-gray-300 px-2 py-1 text-center w-16">削除</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-1 py-1">
                  <Input
                    value={row.category}
                    onChange={(e) => updateRow(index, 'category', e.target.value)}
                    className="w-full h-7 px-1"
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <Input
                    value={row.size}
                    onChange={(e) => updateRow(index, 'size', e.target.value)}
                    className="w-20 h-7 px-1 text-center"
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <Input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => updateRow(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-20 h-7 px-1 text-right"
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1">
                  <Input
                    type="number"
                    value={row.unit_price}
                    onChange={(e) => updateRow(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    className="w-24 h-7 px-1 text-right"
                  />
                </td>
                <td className="border border-gray-300 px-1 py-1 text-right bg-gray-50">
                  {row.amount.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-right">
                  {index === 0 ? 材料費合計.toLocaleString() : ''}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center">
                  <button
                    onClick={() => deleteRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={7} className="border border-gray-300 px-2 py-1">
                <button
                  onClick={addRow}
                  className="text-blue-500 hover:text-blue-700"
                >
                  + 行を追加
                </button>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1 font-semibold">施工料</td>
              <td colSpan={3} className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1">
                <Input
                  type="number"
                  value={data.construction_fee}
                  onChange={(e) => setData(prev => ({ ...prev, construction_fee: parseFloat(e.target.value) || 0 }))}
                  className="w-24 h-7 px-1 text-right"
                />
              </td>
              <td className="border border-gray-300 px-1 py-1 text-right">
                {data.construction_fee.toLocaleString()}
              </td>
              <td className="border border-gray-300 px-1 py-1"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1 font-semibold">諸経費</td>
              <td colSpan={3} className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1">
                <Input
                  type="number"
                  value={data.other_expenses}
                  onChange={(e) => setData(prev => ({ ...prev, other_expenses: parseFloat(e.target.value) || 0 }))}
                  className="w-24 h-7 px-1 text-right"
                />
              </td>
              <td className="border border-gray-300 px-1 py-1 text-right">
                {data.other_expenses.toLocaleString()}
              </td>
              <td className="border border-gray-300 px-1 py-1"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="border border-gray-300 p-2">
          <div className="flex justify-between">
            <span className="font-semibold">売上　金額</span>
            <span className="font-bold">{売上金額.toLocaleString()}</span>
          </div>
        </div>
        <div className="border border-gray-300 p-2">
          <div className="flex justify-between">
            <span className="font-semibold">粗利</span>
            <span className="font-bold">{粗利.toLocaleString()}</span>
          </div>
        </div>
        <div className="border border-gray-300 p-2">
          <div className="flex justify-between">
            <span className="font-semibold">粗利率</span>
            <span className="font-bold">{粗利率}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectGrossProfitDB;