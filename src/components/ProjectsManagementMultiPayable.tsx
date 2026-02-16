'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatCurrency, parseCurrency } from '@/lib/currency-formatter';
import { Plus, Edit2, Trash2, Search, Briefcase, Building2, Calendar, DollarSign, TrendingUp, TrendingDown, X, Users, CalendarDays, List, Eye, Printer, Calculator, ChevronLeft, ChevronRight, Package, FileText, Receipt, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';
import { PrintStyles, handlePrint } from './PrintStyles';

interface Customer {
  id: string;
  customer_name: string;
}

interface ProjectPayable {
  id?: string;
  payable_customer_id: string;
  payable_amount: number;
  description?: string;
  payment_scheduled_date?: string;
  transaction_date?: string;
  payable_customer?: Customer;
}

interface Project {
  id: string;
  project_name: string;
  receivable_customer_id?: string;
  receivable_amount?: number;
  receivable_payment_date?: string;
  transaction_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  receivable_customer?: Customer;
  project_payables?: ProjectPayable[];
  total_payable_amount?: number;
}

const ProjectsManagementMultiPayable: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectOrders, setProjectOrders] = useState<any[]>([]);
  const [projectQuotations, setProjectQuotations] = useState<any[]>([]);
  const [projectGrossProfitSheet, setProjectGrossProfitSheet] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const supabase = createClient();

  // ステータスの並び順を定義
  const statusOrder: { [key: string]: number } = {
    '施工前': 1,
    '売上前': 2,
    '入金待ち': 3,
    '完了': 4,
    '施工後': 5,
  }

  // 単一案件を資金表に反映
  const syncProjectToFunds = async (projectId: string) => {
    try {
      // まず該当案件の既存エントリーを削除
      await supabase
        .from('funds_entries')
        .delete()
        .eq('project_id', projectId)
        .eq('is_project_linked', true)

      // 案件データを取得
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          receivable_customer:receivable_customer_id(customer_name),
          project_payables(
            *,
            payable_customer:payable_customer_id(customer_name)
          )
        `)
        .eq('id', projectId)
        .single()

      if (error) throw error
      if (!project) return

      const newEntries: Partial<any>[] = []
      const statusBadge = project.status ? `[${project.status}] ` : ''

      // 売掛
      if (project.receivable_payment_date && project.receivable_amount) {
        newEntries.push({
          entry_date: project.receivable_payment_date,
          entry_type: 'revenue',
          amount: project.receivable_amount,
          description: `${statusBadge}${project.project_name} - ${project.receivable_customer?.customer_name || ''}`,
          project_id: project.id,
          is_project_linked: true,
        })
      }

      // 買掛
      project.project_payables?.forEach((payable: any) => {
        if (payable.payment_scheduled_date && payable.payable_amount) {
          newEntries.push({
            entry_date: payable.payment_scheduled_date,
            entry_type: 'expense',
            amount: payable.payable_amount,
            description: `${statusBadge}${project.project_name} - ${payable.payable_customer?.customer_name || ''} ${payable.description || ''}`,
            project_id: project.id,
            is_project_linked: true,
          })
        }
      })

      if (newEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('funds_entries')
          .insert(newEntries)

        if (insertError) throw insertError
      }
    } catch {
      // エラーは出すが、案件保存自体は成功扱い
    }
  }
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdFromUrl = searchParams.get('id');

  // URLパラメータがある場合は詳細表示モードで開始
  const [showDetailOnly, setShowDetailOnly] = useState(!!projectIdFromUrl);

  // Default to monthly view with current month
  const currentMonth = new Date().toISOString().substring(0, 7);
  const [viewMode, setViewMode] = useState<'all' | 'byCustomer' | 'byMonth' | 'byPaymentMonth'>('byMonth');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState<string>(currentMonth);
  const [customerTypes, setCustomerTypes] = useState<{[key: string]: 'receivable' | 'payable' | 'both'}>({});
  const STORAGE_KEY = 'iwasaki_customer_types';

  useEffect(() => {
    // LocalStorageから顧客種別データを読み込み
    const storedTypes = localStorage.getItem(STORAGE_KEY);
    if (storedTypes) {
      try {
        setCustomerTypes(JSON.parse(storedTypes));
      } catch {
        // Ignore JSON parse errors for customer types
      }
    }
    fetchProjects();
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, viewMode, selectedCustomerId, selectedMonth, selectedPaymentMonth]);

  // URLパラメータでIDが指定されている場合、その案件を開く
  useEffect(() => {
    if (projectIdFromUrl && projects.length > 0) {
      const targetProject = projects.find(p => p.id === projectIdFromUrl);
      if (targetProject) {
        setSelectedProject(targetProject);
        setShowDetailOnly(true);  // 詳細表示モードに切り替え
        // 発注一覧を取得
        fetchProjectOrders(targetProject.id);
        // 見積書一覧を取得
        fetchProjectQuotations(targetProject.id);
        // 粗利表データを取得
        fetchProjectGrossProfitSheet(targetProject.id);
      }
    } else if (!projectIdFromUrl) {
      setShowDetailOnly(false);  // URLパラメータがない場合は一覧表示
    }
  }, [projectIdFromUrl, projects]);

  const fetchProjectOrders = async (projectId: string) => {
    try {
      const { data: orders } = await supabase
        .from('material_orders')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      setProjectOrders(orders || []);
    } catch {
      setProjectOrders([]);
    }
  };

  const fetchProjectQuotations = async (projectId: string) => {
    try {
      const { data: quotations } = await supabase
        .from('quotations')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      setProjectQuotations(quotations || []);
    } catch {
      setProjectQuotations([]);
    }
  };

  const fetchProjectGrossProfitSheet = async (projectId: string) => {
    try {
      const { data: sheet, error } = await supabase
        .from('gross_profit_sheets')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Ignore not found errors
      }
      setProjectGrossProfitSheet(sheet || null);
    } catch {
      setProjectGrossProfitSheet(null);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('customer_name', { ascending: true });

      if (error) {
        toast.error(`顧客リストの取得に失敗しました: ${error.message}`);
        setCustomers([]);
        return;
      }

      setCustomers(data || []);
    } catch {
      setCustomers([]);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // プロジェクトと売掛先情報を結合して取得
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          receivable_customer:receivable_customer_id(id, customer_name)
        `)
        .order('created_at', { ascending: false });

      if (projectError) {
        if (projectError.code === '42P01') {
          toast.error('プロジェクトテーブルが存在しません。create_projects_table.sqlを実行してください。');
        } else {
          toast.error(`プロジェクトの取得に失敗しました: ${projectError.message}`);
        }
        setProjects([]);
        return;
      }

      // 各プロジェクトの買掛明細を取得
      const projectsWithPayables = await Promise.all(
        (projectData || []).map(async (project) => {
          const { data: payablesData, error: payablesError } = await supabase
            .from('project_payables')
            .select(`
              *,
              payable_customer:payable_customer_id(id, customer_name)
            `)
            .eq('project_id', project.id);

          if (payablesError) {
            return {
              ...project,
              project_payables: [],
              total_payable_amount: 0
            };
          }

          const totalPayable = (payablesData || []).reduce((sum, p) => sum + (p.payable_amount || 0), 0);

          return {
            ...project,
            project_payables: payablesData || [],
            total_payable_amount: totalPayable
          };
        })
      );

      setProjects(projectsWithPayables);
      
      // Maintain selected project if it still exists after reload
      if (selectedProject) {
        const stillExists = projectsWithPayables.find(p => p.id === selectedProject.id);
        if (stillExists) {
          setSelectedProject(stillExists);
        }
      }
    } catch (error: any) {
      toast.error(`エラーが発生しました: ${error.message || error}`);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.receivable_customer?.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_payables?.some(p => 
          p.payable_customer?.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // 表示モードによるフィルター - 該当しない項目は完全に除外
    if (viewMode === 'byCustomer') {
      if (selectedCustomerId !== 'all') {
        filtered = filtered.filter(project => 
          project.receivable_customer_id === selectedCustomerId ||
          project.project_payables?.some(p => p.payable_customer_id === selectedCustomerId)
        );
      }
    } else if (viewMode === 'byMonth') {
      // 月別表示の場合、取引日を基準に選択月に該当する案件のみ表示
      filtered = filtered.filter(project => {
        // 取引日が選択月に含まれるかチェック（取引日がない場合は作成日を使用）
        const dateStr = project.transaction_date || project.created_at;
        if (!dateStr) return false;
        const projectMonth = dateStr.substring(0, 7);
        return projectMonth === selectedMonth;
      });
    } else if (viewMode === 'byPaymentMonth') {
      // 入出金月表示の場合、入金・支払予定日を基準にフィルタリング
      filtered = filtered.filter(project => {
        const receivableMonth = project.receivable_payment_date?.substring(0, 7);
        const hasPayableInMonth = project.project_payables?.some(p => 
          p.payment_scheduled_date?.substring(0, 7) === selectedPaymentMonth
        );
        return receivableMonth === selectedPaymentMonth || hasPayableInMonth;
      });
    }

    setFilteredProjects(filtered);
  };

  // プロジェクトから利用可能な月のリストを取得（取引日基準）
  const getAvailableMonths = () => {
    const monthsSet = new Set<string>();
    projects.forEach(project => {
      const dateStr = project.transaction_date || project.created_at;
      if (dateStr) {
        monthsSet.add(dateStr.substring(0, 7));
      }
    });
    return Array.from(monthsSet).sort().reverse();
  };
  
  // プロジェクトから利用可能な入出金月のリストを取得
  const getAvailablePaymentMonths = () => {
    const monthsSet = new Set<string>();
    projects.forEach(project => {
      if (project.receivable_payment_date) {
        monthsSet.add(project.receivable_payment_date.substring(0, 7));
      }
      project.project_payables?.forEach(payable => {
        if (payable.payment_scheduled_date) {
          monthsSet.add(payable.payment_scheduled_date.substring(0, 7));
        }
      });
    });
    return Array.from(monthsSet).sort().reverse();
  };

  // プロジェクトをグループ化して表示
  const getGroupedProjects = () => {
    if (viewMode === 'byCustomer') {
      const grouped: { [key: string]: Project[] } = {};
      filteredProjects.forEach(project => {
        // 売掛先でグループ化
        if (project.receivable_customer) {
          const customerName = project.receivable_customer.customer_name;
          if (!grouped[customerName]) grouped[customerName] = [];
          grouped[customerName].push(project);
        }
        // 買掛先でもグループ化（重複を許可）
        project.project_payables?.forEach(payable => {
          if (payable.payable_customer) {
            const customerName = payable.payable_customer.customer_name;
            if (!grouped[customerName]) grouped[customerName] = [];
            if (!grouped[customerName].find(p => p.id === project.id)) {
              grouped[customerName].push(project);
            }
          }
        });
      });
      return grouped;
    } else if (viewMode === 'byMonth') {
      // 月別表示の場合、選択月の案件のみ表示
      const monthLabel = (() => {
        const [year, month] = selectedMonth.split('-');
        return `${year}年${parseInt(month)}月`;
      })();
      return { [monthLabel]: filteredProjects };
    } else if (viewMode === 'byPaymentMonth') {
      // 入出金月表示の場合、選択月の案件のみ表示
      const monthLabel = (() => {
        const [year, month] = selectedPaymentMonth.split('-');
        return `${year}年${parseInt(month)}月の入出金`;
      })();
      return { [monthLabel]: filteredProjects };
    }
    return { 'すべての案件': filteredProjects };
  };

  const handleSaveProject = async (formData: any) => {
    try {
      // 必須項目チェック
      if (!formData.project_name || formData.project_name.trim() === '') {
        toast.error('案件名を入力してください');
        return;
      }
      
      const projectData: any = {
        project_name: formData.project_name.trim(),
        receivable_customer_id: formData.receivable_customer_id === 'none' ? null : (formData.receivable_customer_id || null),
        receivable_amount: formData.receivable_amount ? parseFloat(formData.receivable_amount) : 0,
        status: formData.status || '施工前'
      };
      
      // 入金予定日フィールドがある場合のみ追加
      if (formData.receivable_payment_date) {
        projectData.receivable_payment_date = formData.receivable_payment_date;
      }
      
      // 取引日フィールドがある場合のみ追加
      if (formData.transaction_date) {
        projectData.transaction_date = formData.transaction_date;
      }
      
      // 工事開始日と終了日を追加

      let projectId: string;

      if (editingProject) {
        projectId = editingProject.id;
        
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId);

        if (error) {
          // receivable_payment_dateフィールドが存在しない場合のエラーチェック
          if (error.code === '42703') {
            toast.error('データベースに入金予定日フィールドがありません。execute_payment_date_migration.sqlを実行してください。');
          } else {
            toast.error(`更新に失敗しました: ${error.message}`);
          }
          return;
        }
        
        // 既存の買掛明細を削除
        await supabase
          .from('project_payables')
          .delete()
          .eq('project_id', projectId);
        
        toast.success('案件を更新しました');
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) {
          if (error.code === '42P01') {
            toast.error('プロジェクトテーブルが存在しません。create_project_payables_table.sqlを実行してください。');
          } else if (error.code === '23503') {
            toast.error('選択された顧客が存在しません');
          } else {
            toast.error(`保存に失敗しました: ${error.message || 'Unknown error'}`);
          }
          return;
        }

        projectId = data.id;
      }
      
      // 買掛明細を登録
      if (formData.payables && formData.payables.length > 0) {
        const validPayables = formData.payables.filter((payable: any) => 
          payable.payable_customer_id && 
          payable.payable_amount && 
          parseFloat(payable.payable_amount) > 0
        );
        
        if (validPayables.length > 0) {
          const payablesData = validPayables.map((payable: any) => {
            const payableData: any = {
              project_id: projectId,
              payable_customer_id: payable.payable_customer_id,
              payable_amount: parseFloat(payable.payable_amount),
              description: payable.description || null,
              payment_status: 'unpaid'
            };
            
            // 支払予定日フィールドがある場合のみ追加
            if (payable.payment_scheduled_date) {
              payableData.payment_scheduled_date = payable.payment_scheduled_date;
            }
            
            // 取引日フィールドがある場合のみ追加
            if (payable.transaction_date) {
              payableData.transaction_date = payable.transaction_date;
            }
            
            return payableData;
          });
          
          const { error: payablesError } = await supabase
            .from('project_payables')
            .insert(payablesData);

          if (payablesError) {
            toast.error(`買掛明細の保存に失敗しました: ${payablesError.message}`);
            // テーブルが存在しない場合のエラーメッセージ
            if (payablesError.code === '42P01') {
              toast.error('project_payablesテーブルが存在しません。fix_projects_and_create_payables.sqlを実行してください。');
            }
          } else {
            toast.success(`${validPayables.length}件の買掛明細を登録しました`);
          }
        }
      }
      
      if (!editingProject) {
        toast.success('案件を登録しました');
      }

      // 資金表に自動反映
      await syncProjectToFunds(projectId);

      await fetchProjects();
      setShowDialog(false);
      setEditingProject(null);
    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error.message || error}`);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('この案件を削除しますか？\n関連する買掛明細も削除されます。\n資金表の関連データも削除されます。')) return;

    try {
      // 資金表から該当案件のエントリーを削除
      await supabase
        .from('funds_entries')
        .delete()
        .eq('project_id', projectId)
        .eq('is_project_linked', true)

      // 案件を削除（買掛明細はカスケード削除）
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // 古いlocalStorageデータも削除（後方互換性のため）
      const STORAGE_KEY = 'iwasaki_funds_data_with_projects';
      const storedData = localStorage.getItem(STORAGE_KEY);

      if (storedData) {
        try {
          const allData = JSON.parse(storedData);
          
          // すべての月のデータから該当プロジェクトのエントリーを削除
          Object.keys(allData).forEach(monthKey => {
            const monthData = allData[monthKey].data;
            Object.keys(monthData).forEach(day => {
              const dayNum = parseInt(day);
              if (monthData[dayNum] && monthData[dayNum].entries) {
                // 削除するプロジェクトのエントリーをフィルタリング
                monthData[dayNum].entries = monthData[dayNum].entries.filter(
                  (entry: any) => {
                    // プロジェクトIDが一致するエントリーを削除
                    if (entry.projectId === projectId) return false;
                    // 買掛の場合、projectIdに案件IDが含まれているかチェック
                    if (entry.projectId && entry.projectId.startsWith(`${projectId}-`)) return false;
                    return true;
                  }
                );
                // エントリーが空になった場合は日付データを削除
                if (monthData[dayNum].entries.length === 0) {
                  delete monthData[dayNum];
                }
              }
            });
          });
          
          // 更新されたデータを保存
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
          toast.info('資金表からも関連データを削除しました');
        } catch {
          toast.warning('資金表の更新に失敗しました。資金表画面で「案件データ取得」→「案件データ反映」を実行してください');
        }
      }
      
      toast.success('案件を削除しました');
      await fetchProjects();
      setSelectedProject(null);
    } catch (error: any) {
      toast.error(`削除に失敗しました: ${error.message}`);
    }
  };


  return (
    <div className="h-full">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-6 pt-6">
          <h1 className="text-3xl font-bold">案件管理</h1>
        </div>

        {/* ツールバー - URLパラメータがある場合は非表示 */}
        {!showDetailOnly && (
          <div className="space-y-4 px-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="案件名または顧客名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditingProject(null);
                setShowDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              新規登録
            </Button>
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
        
        {/* 表示モード切り替え */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'byMonth' ? 'default' : 'ghost'}
              onClick={() => {
                setViewMode('byMonth');
                // Ensure current month is selected when switching to monthly view
                if (!selectedMonth || selectedMonth === 'all') {
                  const currentMonth = new Date().toISOString().substring(0, 7);
                  setSelectedMonth(currentMonth);
                }
              }}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              月別
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'byCustomer' ? 'default' : 'ghost'}
              onClick={() => setViewMode('byCustomer')}
            >
              <Users className="h-4 w-4 mr-1" />
              取引先別
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'byPaymentMonth' ? 'default' : 'ghost'}
              onClick={() => {
                setViewMode('byPaymentMonth');
                // Ensure current month is selected when switching to payment month view
                if (!selectedPaymentMonth || selectedPaymentMonth === 'all') {
                  const currentMonth = new Date().toISOString().substring(0, 7);
                  setSelectedPaymentMonth(currentMonth);
                }
              }}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              入出金月
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'all' ? 'default' : 'ghost'}
              onClick={() => {
                setViewMode('all');
                setSelectedCustomerId('all');
              }}
            >
              <List className="h-4 w-4 mr-1" />
              すべて
            </Button>
          </div>
          
          {/* 取引先フィルター */}
          {viewMode === 'byCustomer' && (
            <Select
              value={selectedCustomerId}
              onValueChange={setSelectedCustomerId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="取引先を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての取引先</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.customer_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* 月フィルター */}
          {viewMode === 'byMonth' && (
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
              <div className="px-3 py-1 min-w-[120px] text-center font-medium">
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
          )}
          
          {/* 入出金月フィルター */}
          {viewMode === 'byPaymentMonth' && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const availableMonths = getAvailablePaymentMonths();
                  const currentIndex = availableMonths.indexOf(selectedPaymentMonth);
                  if (currentIndex < availableMonths.length - 1) {
                    setSelectedPaymentMonth(availableMonths[currentIndex + 1]);
                  }
                }}
                disabled={getAvailablePaymentMonths().indexOf(selectedPaymentMonth) === getAvailablePaymentMonths().length - 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1 min-w-[120px] text-center font-medium">
                {(() => {
                  const [year, monthNum] = selectedPaymentMonth.split('-');
                  return `${year}年${parseInt(monthNum)}月`;
                })()}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const availableMonths = getAvailablePaymentMonths();
                  const currentIndex = availableMonths.indexOf(selectedPaymentMonth);
                  if (currentIndex > 0) {
                    setSelectedPaymentMonth(availableMonths[currentIndex - 1]);
                  }
                }}
                disabled={getAvailablePaymentMonths().indexOf(selectedPaymentMonth) === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* メインコンテンツ */}
      <div className={showDetailOnly ? "" : "grid grid-cols-1 lg:grid-cols-3 gap-4"}>
        {/* 案件リスト - URLパラメータがある場合は非表示 */}
        {!showDetailOnly && (
          <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">案件一覧 ({filteredProjects.length}件)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">読み込み中...</div>
              ) : filteredProjects.length === 0 ? (
                <div className="p-4 text-center text-gray-500">案件がありません</div>
              ) : viewMode !== 'all' ? (
                /* グループ表示 */
                Object.entries(getGroupedProjects()).map(([groupName, groupProjects]) => (
                  <div key={groupName}>
                    <div className="bg-gray-50 px-4 py-2 font-medium text-sm text-gray-700 sticky top-0">
                      {groupName} ({groupProjects.length}件)
                    </div>
                    {groupProjects.map((project) => (
                      <div
                        key={project.id}
                        id={`project-${project.id}`}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedProject?.id === project.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedProject(project);
                          fetchProjectOrders(project.id);
                          fetchProjectQuotations(project.id);
                          fetchProjectGrossProfitSheet(project.id);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="font-medium">{project.project_name}</span>
                            {project.status === '施工前' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                                施工前
                              </span>
                            )}
                            {project.status === '売上前' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                                売上前
                              </span>
                            )}
                            {project.status === '入出金待' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                                入出金待
                              </span>
                            )}
                            {project.status === '完了' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 ml-2">
                                完了
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                /* 通常表示 */
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    id={`project-${project.id}`}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedProject?.id === project.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedProject(project);
                      fetchProjectOrders(project.id);
                      fetchProjectQuotations(project.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{project.project_name}</span>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {project.receivable_payment_date && (
                              <span className="text-green-600">
                                入金: {new Date(project.receivable_payment_date).toLocaleDateString('ja-JP', {month: 'numeric', day: 'numeric'})}
                              </span>
                            )}
                            {project.project_payables?.some(p => p.payment_scheduled_date) && (
                              <span className="text-red-600">
                                支払: {(() => {
                                  const dates = project.project_payables
                                    .filter(p => p.payment_scheduled_date)
                                    .map(p => new Date(p.payment_scheduled_date!).toLocaleDateString('ja-JP', {month: 'numeric', day: 'numeric'}));
                                  return dates.length > 1 ? `${dates[0]}他` : dates[0];
                                })()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
          )}

          {/* 詳細表示 */}
          <Card className={showDetailOnly ? "" : "xl:col-span-2"}>
          {selectedProject ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold mb-2">{selectedProject.project_name}</CardTitle>
                    {selectedProject.receivable_customer && (
                      <p className="text-sm text-gray-600">顧客: {selectedProject.receivable_customer.customer_name}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {showDetailOnly && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowDetailOnly(false);
                          router.push('/dashboard/projects');
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        一覧に戻る
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProject(selectedProject);
                          setShowDialog(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProject(selectedProject.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        削除
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 関連書類へのリンク */}
                  <div className="grid grid-cols-3 gap-2 p-4 bg-gradient-to-r from-emerald-50 to-gray-50 rounded-lg border border-emerald-200">
                    <Button
                      variant="outline"
                      className="h-12 bg-white hover:bg-emerald-50"
                      onClick={() => {
                        const timestamp = new Date().getTime()
                        router.push(`/gross-profit?projectId=${selectedProject.id}&t=${timestamp}`)
                      }}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      粗利表
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 bg-white hover:bg-emerald-50"
                      onClick={() => router.push(`/quotations?projectId=${selectedProject.id}`)}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      見積書
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 bg-white hover:bg-emerald-50"
                      onClick={() => router.push(`/orders?projectId=${selectedProject.id}`)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      発注書
                    </Button>
                  </div>

                  {/* 見積書一覧 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold text-gray-700">見積書</Label>
                    </div>
                    <div className="space-y-2">
                      {projectQuotations.length > 0 ? (
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {projectQuotations.map((quotation: any) => (
                            <div
                              key={quotation.id}
                              className="flex items-center justify-between p-2 bg-white rounded hover:bg-emerald-50 cursor-pointer border border-gray-200"
                              onClick={() => router.push(`/quotations?editId=${quotation.id}&projectId=${selectedProject.id}`)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{quotation.quotation_number}</span>
                                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                                    quotation.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                    quotation.status === 'sent' ? 'bg-gray-100 text-gray-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {quotation.status === 'accepted' ? '承認' :
                                     quotation.status === 'sent' ? '送信済' : '下書き'}
                                  </span>
                                  <span className="text-xs text-gray-600">¥{quotation.total_amount?.toLocaleString()}</span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-3">見積書がありません</p>
                      )}
                    </div>
                  </div>

                  {/* 発注一覧 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold text-gray-700">発注書</Label>
                    </div>
                    <div className="space-y-2">
                      {projectOrders.length > 0 ? (
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {projectOrders.map((order: any) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-2 bg-white rounded hover:bg-emerald-50 cursor-pointer border border-gray-200"
                              onClick={() => router.push(`/orders?editId=${order.id}&projectId=${selectedProject.id}`)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{order.order_number}</span>
                                  {order.order_type === 'material' || !order.order_type ? (
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">材料</span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">工事</span>
                                  )}
                                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                                    order.status === '納品済' ? 'bg-emerald-100 text-emerald-700' :
                                    order.status === '発注済' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {order.status || '未発注'}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-3">発注がありません</p>
                      )}
                    </div>
                  </div>

                  {/* 粗利表（簡潔に） */}
                  <div className="bg-gradient-to-r from-emerald-50 to-gray-50 p-4 rounded-lg border-2 border-emerald-200">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">売上</p>
                        <p className="font-bold text-emerald-600">
                          ¥{(projectGrossProfitSheet?.selling_price || selectedProject.receivable_amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">原価</p>
                        <p className="font-bold text-red-600">
                          ¥{(projectGrossProfitSheet?.total_cost || selectedProject.total_payable_amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">粗利益</p>
                        <p className={`font-bold text-lg ${
                          ((projectGrossProfitSheet?.gross_profit || ((selectedProject.receivable_amount || 0) - (selectedProject.total_payable_amount || 0)))) >= 0
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}>
                          ¥{(projectGrossProfitSheet?.gross_profit || ((selectedProject.receivable_amount || 0) - (selectedProject.total_payable_amount || 0))).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 text-right">
                      粗利率: {
                        projectGrossProfitSheet?.profit_rate?.toFixed(1) ||
                        (selectedProject.receivable_amount && selectedProject.receivable_amount > 0
                          ? (((selectedProject.receivable_amount - (selectedProject.total_payable_amount || 0)) / selectedProject.receivable_amount) * 100).toFixed(1)
                          : '0.0')
                      }%
                    </div>
                  </div>

                  {/* 案件情報（簡潔に） */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">ステータス</Label>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          selectedProject.status === '施工前' ? 'bg-gray-100 text-gray-800' :
                          selectedProject.status === '売上前' ? 'bg-gray-100 text-gray-800' :
                          selectedProject.status === '入出金待' ? 'bg-yellow-100 text-yellow-800' :
                          selectedProject.status === '完了' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedProject.status || '施工前'}
                        </span>
                      </p>
                    </div>
                    {selectedProject.transaction_date && (
                      <div>
                        <Label className="text-xs text-gray-600">取引日</Label>
                        <p className="mt-1 font-medium">{new Date(selectedProject.transaction_date).toLocaleDateString('ja-JP')}</p>
                      </div>
                    )}
                  </div>
                  {/* 入出金情報 */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedProject.receivable_payment_date && (
                        <div>
                          <Label className="text-xs text-gray-600">入金予定日</Label>
                          <p className="mt-1 font-medium text-emerald-600">
                            {new Date(selectedProject.receivable_payment_date).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      )}
                      {selectedProject.project_payables && selectedProject.project_payables.some(p => p.payment_scheduled_date) && (
                        <div>
                          <Label className="text-xs text-gray-600">支払予定日</Label>
                          <div className="mt-1 text-red-600 text-xs">
                            {selectedProject.project_payables
                              .filter(p => p.payment_scheduled_date)
                              .map((p, i) => (
                                <div key={i}>{new Date(p.payment_scheduled_date!).toLocaleDateString('ja-JP')}</div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 買掛明細（簡潔に） */}
                  {selectedProject.project_payables && selectedProject.project_payables.length > 0 && (
                    <div className="border-t pt-4">
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">買掛明細</Label>
                      <div className="space-y-1">
                        {selectedProject.project_payables.map((payable, index) => (
                          <div key={payable.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{payable.payable_customer?.customer_name}</span>
                              {payable.description && (
                                <span className="text-xs text-gray-600 ml-2">（{payable.description}）</span>
                              )}
                            </div>
                            <span className="font-medium text-red-600">¥{payable.payable_amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <p>案件を選択してください</p>
              </div>
            </div>
          )}
          </Card>
        </div>

        {/* 登録・編集ダイアログ */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] overflow-y-auto sm:max-w-[95vw]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          style={{ width: 'calc(100vw - 4rem)' }}
        >
          <DialogHeader>
            <DialogTitle>{editingProject ? '案件編集' : '新規案件登録'}</DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            customers={customers}
            onSave={handleSaveProject}
            onCancel={() => {
              setShowDialog(false);
              setEditingProject(null);
            }}
          />
        </DialogContent>
        </Dialog>
        <PrintStyles />
      </div>
    </div>
  );
};

// フォームコンポーネント
interface ProjectFormProps {
  project: Project | null;
  customers: Customer[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, customers, onSave, onCancel }) => {
  // LocalStorageから顧客種別データを取得
  const STORAGE_KEY = 'iwasaki_customer_types';
  const [customerTypes, setCustomerTypes] = useState<{[key: string]: 'receivable' | 'payable' | 'both'}>({});
  const [displayAmounts, setDisplayAmounts] = useState({
    receivable: project?.receivable_amount?.toString() || '',
    payables: project?.project_payables?.map(p => p.payable_amount.toString()) || []
  });
  
  React.useEffect(() => {
    const storedTypes = localStorage.getItem(STORAGE_KEY);
    if (storedTypes) {
      try {
        setCustomerTypes(JSON.parse(storedTypes));
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, []);
  
  // デフォルトの工事期間を計算（今日から7日間）
  const [formData, setFormData] = useState({
    project_name: project?.project_name || '',
    receivable_customer_id: project?.receivable_customer_id || 'none',
    receivable_amount: project?.receivable_amount?.toString() || '',
    receivable_payment_date: project?.receivable_payment_date || '',
    transaction_date: project?.transaction_date || new Date().toISOString().split('T')[0], // デフォルトを今日の日付に
    status: project?.status || '施工前',
    payables: project?.project_payables?.map(p => ({
      payable_customer_id: p.payable_customer_id,
      payable_amount: p.payable_amount.toString(),
      description: p.description || '',
      payment_scheduled_date: p.payment_scheduled_date || '',
      transaction_date: p.transaction_date || ''
    })) || []
  });

  // 消費税率（10%）
  const TAX_RATE = 0.10;

  // 税込金額から税抜金額と消費税を計算
  const calculateTax = (amountWithTax: number) => {
    const amountWithoutTax = Math.floor(amountWithTax / (1 + TAX_RATE));
    const tax = amountWithTax - amountWithoutTax;
    return { amountWithoutTax, tax };
  };

  const handleAddPayable = () => {
    setFormData({
      ...formData,
      payables: [...formData.payables, {
        payable_customer_id: '',
        payable_amount: '',
        description: '',
        payment_scheduled_date: '',
        transaction_date: ''
      }]
    });
  };

  const handleRemovePayable = (index: number) => {
    const newPayables = formData.payables.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      payables: newPayables
    });
  };

  const handlePayableChange = (index: number, field: string, value: string) => {
    const newPayables = [...formData.payables];
    newPayables[index] = {
      ...newPayables[index],
      [field]: value
    };
    setFormData({
      ...formData,
      payables: newPayables
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      payables: formData.payables // すべての買掛データを送信（空のものも含む）
    });
  };

  const calculateTotal = () => {
    const receivable = parseFloat(formData.receivable_amount) || 0;
    const payable = formData.payables.reduce((sum, p) => 
      sum + (parseFloat(p.payable_amount) || 0), 0
    );
    return receivable - payable;
  };

  // 売掛金の税額計算
  const receivableTax = calculateTax(parseFloat(formData.receivable_amount) || 0);
  // 買掛金合計の税額計算
  const totalPayableAmount = formData.payables.reduce((sum, p) => 
    sum + (parseFloat(p.payable_amount) || 0), 0
  );
  const payableTax = calculateTax(totalPayableAmount);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">案件名 <span className="text-red-500">*</span></Label>
            <Input
              className="h-12 text-lg font-medium"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              required
              placeholder="案件名を入力してください"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">売掛先（顧客）</Label>
            <Select
              value={formData.receivable_customer_id}
              onValueChange={(value) => setFormData({ ...formData, receivable_customer_id: value })}
            >
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="売掛先を選択（任意）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">選択しない</SelectItem>
                {customers
                  .filter(customer => {
                    const type = customerTypes[customer.id] || 'both';
                    return type === 'receivable' || type === 'both';
                  })
                  .map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">取引日（売上計上日） <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              required
              className="h-12 text-lg"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">売掛金（顧客から受け取る金額）</Label>
            <Input
              type="text"
              value={formData.receivable_amount ? formatCurrency(formData.receivable_amount) : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, receivable_amount: value });
              }}
              placeholder="売掛金額を入力（税込）"
              className="h-12 text-lg font-bold"
            />
        {formData.receivable_amount && parseFloat(formData.receivable_amount) > 0 && (
          <div className="text-sm text-gray-600 mt-1 ml-1">
            税抜: ¥{receivableTax.amountWithoutTax.toLocaleString()} / 
            消費税: ¥{receivableTax.tax.toLocaleString()}
          </div>
        )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">入金予定日</Label>
            <Input
              type="date"
              value={formData.receivable_payment_date}
              onChange={(e) => setFormData({ ...formData, receivable_payment_date: e.target.value })}
              className="h-12 text-lg"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">案件ステータス</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="施工前">施工前</SelectItem>
                <SelectItem value="売上前">売上前</SelectItem>
                <SelectItem value="入出金待">入出金待</SelectItem>
                <SelectItem value="完了">完了（入出金完了）</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600 mt-1">
              施工から入出金完了までの進捗を管理します
            </p>
          </div>
        </div>

        {/* 買掛明細セクション */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-lg font-bold">買掛明細</Label>
            <Button
              type="button"
              size="lg"
              className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddPayable}
            >
              <Plus className="h-5 w-5 mr-2" />
              買掛先を追加
            </Button>
          </div>

          {formData.payables.map((payable, index) => (
            <div key={index} className="border-2 rounded-lg p-5 space-y-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-blue-800">買掛先 {index + 1}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemovePayable(index)}
                  className="h-9 px-4"
                >
                  <X className="h-4 w-4 mr-1" />
                  削除
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold mb-2 block text-gray-700">買掛先</Label>
                  <Select
                    value={payable.payable_customer_id}
                    onValueChange={(value) => handlePayableChange(index, 'payable_customer_id', value)}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="買掛先を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers
                        .filter(customer => {
                          const type = customerTypes[customer.id] || 'both';
                          return type === 'payable' || type === 'both';
                        })
                        .map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.customer_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block text-gray-700">金額（税込）</Label>
                  <Input
                    type="text"
                    value={payable.payable_amount ? formatCurrency(payable.payable_amount) : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handlePayableChange(index, 'payable_amount', value);
                    }}
                    placeholder="金額を入力"
                    className="h-11 text-base font-bold text-red-600"
                  />
                {payable.payable_amount && parseFloat(payable.payable_amount) > 0 && (() => {
                  const tax = calculateTax(parseFloat(payable.payable_amount));
                  return (
                    <div className="text-xs text-gray-600 mt-1">
                      税抜: ¥{tax.amountWithoutTax.toLocaleString()} / 
                      税: ¥{tax.tax.toLocaleString()}
                    </div>
                  );
                })()}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block text-gray-700">内容・備考</Label>
                <Input
                  value={payable.description}
                  onChange={(e) => handlePayableChange(index, 'description', e.target.value)}
                  placeholder="材料費、外注費など"
                  className="h-11 text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold mb-2 block text-gray-700">支払予定日</Label>
                  <Input
                    type="date"
                    value={payable.payment_scheduled_date}
                    onChange={(e) => handlePayableChange(index, 'payment_scheduled_date', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block text-gray-700">取引日（仕入計上日）</Label>
                  <Input
                    type="date"
                    value={payable.transaction_date}
                    onChange={(e) => handlePayableChange(index, 'transaction_date', e.target.value)}
                    placeholder="税務上の仕入計上日"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.payables.length === 0 && (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
              買掛先が登録されていません
            </div>
          )}
        </div>
      </div>

      {/* 合計表示 */}
      <div className="border-t-2 pt-6 bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>売掛金合計（税込）</span>
            <span className="font-medium text-green-600">
              ¥{(parseFloat(formData.receivable_amount) || 0).toLocaleString()}
            </span>
          </div>
          {receivableTax.amountWithoutTax > 0 && (
            <div className="flex justify-between text-sm text-gray-600 pl-4">
              <span>（内訳：税抜 ¥{receivableTax.amountWithoutTax.toLocaleString()} / 消費税 ¥{receivableTax.tax.toLocaleString()}）</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>買掛金合計（税込）</span>
            <span className="font-medium text-red-600">
              ¥{totalPayableAmount.toLocaleString()}
            </span>
          </div>
          {payableTax.amountWithoutTax > 0 && (
            <div className="flex justify-between text-sm text-gray-600 pl-4">
              <span>（内訳：税抜 ¥{payableTax.amountWithoutTax.toLocaleString()} / 消費税 ¥{payableTax.tax.toLocaleString()}）</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t pt-2">
            <span>粗利益（税込）</span>
            <span className={calculateTotal() >= 0 ? 'text-blue-600' : 'text-red-600'}>
              ¥{calculateTotal().toLocaleString()}
            </span>
          </div>
          {calculateTotal() !== 0 && (() => {
            const profitTax = calculateTax(Math.abs(calculateTotal()));
            return (
              <div className="flex justify-between text-sm text-gray-600 pl-4">
                <span>（内訳：税抜 ¥{(calculateTotal() >= 0 ? profitTax.amountWithoutTax : -profitTax.amountWithoutTax).toLocaleString()} / 消費税 ¥{(calculateTotal() >= 0 ? profitTax.tax : -profitTax.tax).toLocaleString()}）</span>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t-2">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 h-10">
          キャンセル
        </Button>
        <Button type="submit" className="px-8 h-10 bg-blue-600 hover:bg-blue-700">
          {project ? '更新する' : '登録する'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectsManagementMultiPayable;