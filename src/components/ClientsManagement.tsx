'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Search, Printer } from 'lucide-react';
import { PrintStyles, handlePrint } from './PrintStyles';

interface Customer {
  id: string;
  customer_name: string;
  postal_code?: string | null;
  address?: string | null;
  phone?: string | null;
  fax?: string | null;
  contact_person?: string | null;
  email?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}


const ClientsManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const supabase = createClient();


  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);


  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('customer_name', { ascending: true });

      if (error) {
        if (error.code === '42P01') {
          toast.error('顧客テーブルが存在しません。create_customers_table.sqlを実行してください。');
        } else {
          toast.error(`顧客の取得に失敗しました: ${error.message}`);
        }
        setCustomers([]);
        return;
      }

      setCustomers(data || []);
    } catch (error: any) {
      toast.error(`エラーが発生しました: ${error.message || error}`);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  };


  const handleSaveCustomer = async (formData: any) => {
    try {
      // 空文字チェック
      if (!formData.customer_name || formData.customer_name.trim() === '') {
        toast.error('顧客名を入力してください');
        return;
      }

      // 顧客データの準備
      const processedData = {
        customer_name: formData.customer_name.trim(),
        postal_code: formData.postal_code?.trim() || null,
        address: formData.address?.trim() || null,
        phone: formData.phone?.trim() || null,
        fax: formData.fax?.trim() || null,
        contact_person: formData.contact_person?.trim() || null,
        email: formData.email?.trim() || null
      };

      if (editingCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(processedData)
          .eq('id', editingCustomer.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        toast.success('顧客を更新しました');
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert([processedData])
          .select()
          .single();

        if (error) {
          if (error.code === '42P01') {
            toast.error('顧客テーブルが存在しません。create_customers_table.sqlを実行してください。');
          } else if (error.code === '23505') {
            toast.error('既に同じ名前の顧客が存在します');
          } else {
            toast.error(`保存に失敗しました: ${error.message || 'Unknown error'}`);
          }
          return;
        }

        if (data) {
          toast.success('顧客を登録しました');
        }
      }

      // データ再取得
      await fetchCustomers();
      setShowDialog(false);
      setEditingCustomer(null);
    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error.message || error}`);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('この顧客を削除しますか？')) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      toast.success('顧客を削除しました');
      await fetchCustomers();
      setSelectedCustomer(null);
    } catch (error: any) {
      toast.error(`削除に失敗しました: ${error.message}`);
    }
  };


  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="顧客名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="print-button"
          >
            <Printer className="h-4 w-4 mr-2" />
            印刷
          </Button>
          <Button
            onClick={() => {
              setEditingCustomer(null);
              setShowDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            新規登録
          </Button>
        </div>
      </div>


      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 顧客リスト */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              顧客一覧 ({filteredCustomers.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">読み込み中...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">顧客がありません</div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <span className="font-medium">{customer.customer_name}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* 詳細表示 */}
        <Card className="lg:col-span-2">
          {selectedCustomer ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedCustomer.customer_name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCustomer(selectedCustomer);
                        setShowDialog(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      編集
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">顧客名</Label>
                    <p className="font-medium text-lg">{selectedCustomer.customer_name}</p>
                  </div>
                  {selectedCustomer.postal_code && (
                    <div>
                      <Label className="text-gray-600">郵便番号</Label>
                      <p className="font-medium">〒{selectedCustomer.postal_code}</p>
                    </div>
                  )}
                  {selectedCustomer.address && (
                    <div>
                      <Label className="text-gray-600">住所</Label>
                      <p className="font-medium">{selectedCustomer.address}</p>
                    </div>
                  )}
                  {selectedCustomer.phone && (
                    <div>
                      <Label className="text-gray-600">電話番号</Label>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                  )}
                  {selectedCustomer.fax && (
                    <div>
                      <Label className="text-gray-600">FAX番号</Label>
                      <p className="font-medium">{selectedCustomer.fax}</p>
                    </div>
                  )}
                  {selectedCustomer.contact_person && (
                    <div>
                      <Label className="text-gray-600">担当者</Label>
                      <p className="font-medium">{selectedCustomer.contact_person}</p>
                    </div>
                  )}
                  {selectedCustomer.email && (
                    <div>
                      <Label className="text-gray-600">メールアドレス</Label>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                  )}
                  {selectedCustomer.created_at && (
                    <div>
                      <Label className="text-gray-600">登録日時</Label>
                      <p className="font-medium">{new Date(selectedCustomer.created_at).toLocaleString('ja-JP')}</p>
                    </div>
                  )}
                  {selectedCustomer.updated_at && (
                    <div>
                      <Label className="text-gray-600">更新日時</Label>
                      <p className="font-medium">{new Date(selectedCustomer.updated_at).toLocaleString('ja-JP')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <p>顧客を選択してください</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 登録・編集ダイアログ */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? '顧客編集' : '新規顧客登録'}</DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={editingCustomer}
            onSave={handleSaveCustomer}
            onCancel={() => {
              setShowDialog(false);
              setEditingCustomer(null);
            }}
          />
        </DialogContent>
      </Dialog>
      <PrintStyles />
    </div>
  );
};

// フォームコンポーネント
interface CustomerFormProps {
  customer: Customer | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer_name: customer?.customer_name || '',
    postal_code: customer?.postal_code || '',
    address: customer?.address || '',
    phone: customer?.phone || '',
    fax: customer?.fax || '',
    contact_person: customer?.contact_person || '',
    email: customer?.email || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>顧客名 <span className="text-red-500">*</span></Label>
        <Input
          value={formData.customer_name}
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          required
          placeholder="顧客名を入力してください"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>郵便番号</Label>
          <Input
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            placeholder="1234567（ハイフンなし）"
            maxLength={7}
          />
        </div>
        <div>
          <Label>住所</Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="東京都墨田区緑1-24-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>電話番号</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="03-1234-5678"
          />
        </div>
        <div>
          <Label>FAX番号</Label>
          <Input
            value={formData.fax}
            onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
            placeholder="03-1234-5679"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>担当者</Label>
          <Input
            value={formData.contact_person}
            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
            placeholder="山田太郎"
          />
        </div>
        <div>
          <Label>メールアドレス</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@company.com"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit">
          {customer ? '更新' : '登録'}
        </Button>
      </div>
    </form>
  );
};

export default ClientsManagement;