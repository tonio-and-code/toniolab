'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Building2, Briefcase, TrendingUp, TrendingDown, DollarSign, ChevronDown, ChevronRight, CalendarDays, CalendarRange, Printer, ChevronLeft } from 'lucide-react';
import { format, startOfMonth, endOfMonth, parse } from 'date-fns';
import { ja } from 'date-fns/locale';
import { PrintStyles, handlePrint } from './PrintStyles';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  customer_name: string;
}

interface ProjectPayable {
  id: string;
  project_id: string;
  payable_customer_id: string;
  payable_amount: number;
  description?: string;
  payment_status?: string;
  payment_scheduled_date?: string;
  transaction_date?: string;
  created_at?: string;
  payable_customer?: Customer;
}

interface Project {
  id: string;
  project_name: string;
  receivable_customer_id?: string;
  receivable_amount?: number;
  receivable_payment_date?: string;
  transaction_date?: string;
  created_at: string;
  receivable_customer?: Customer;
  project_payables?: ProjectPayable[];
  total_payable_amount?: number;
}

interface MonthlyData {
  month: string;
  projects: Project[];
  totalReceivable: number;
  totalPayable: number;
  balance: number;
}

interface CustomerData {
  customer: Customer;
  receivableProjects: Project[];
  payableProjects: Project[];
  totalReceivable: number;
  totalPayable: number;
  balance: number;
}

interface CustomerMonthlyData {
  month: string;
  customer: Customer;
  receivableProjects: Project[];
  payableProjects: Project[];
  totalReceivable: number;
  totalPayable: number;
  balance: number;
}

interface CustomerYearlyData {
  year: string;
  customer: Customer;
  receivableProjects: Project[];
  payableProjects: Project[];
  totalReceivable: number;
  totalPayable: number;
  balance: number;
}

const ReceivablesPayablesMulti: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [customerMonthlyData, setCustomerMonthlyData] = useState<CustomerMonthlyData[]>([]);
  const [customerYearlyData, setCustomerYearlyData] = useState<CustomerYearlyData[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [customerViewPeriod, setCustomerViewPeriod] = useState<'all' | 'monthly' | 'yearly'>('all');
  const [selectedCustomerYear, setSelectedCustomerYear] = useState(new Date().getFullYear().toString());
  const [selectedCustomerMonth, setSelectedCustomerMonth] = useState((new Date().getMonth() + 1).toString());
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    processMonthlyData();
  }, [projects, selectedYear]);

  useEffect(() => {
    processCustomerData();
  }, [projects, selectedCustomer, customerViewPeriod, selectedCustomerYear, selectedCustomerMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 顧客データを取得
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .order('customer_name', { ascending: true });

      if (customerError) {
        toast.error('顧客データの取得に失敗しました');
      } else {
        setCustomers(customerData || []);
      }

      // プロジェクトデータを取得
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          receivable_customer:receivable_customer_id(id, customer_name)
        `)
        .order('created_at', { ascending: false });

      if (projectError) {
        toast.error('プロジェクトデータの取得に失敗しました');
      } else {
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
      }
    } catch {
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = () => {
    const grouped: { [key: string]: Project[] } = {};
    
    projects.forEach(project => {
      // 売掛の取引日で月を決定
      if (project.receivable_amount && project.receivable_amount > 0) {
        const dateStr = project.transaction_date || project.created_at;
        const date = new Date(dateStr);
        const year = date.getFullYear();
        
        if (year.toString() === selectedYear) {
          const monthKey = format(date, 'yyyy-MM');
          if (!grouped[monthKey]) {
            grouped[monthKey] = [];
          }
          // 同じプロジェクトがまだ追加されていない場合のみ追加
          if (!grouped[monthKey].find(p => p.id === project.id)) {
            grouped[monthKey].push(project);
          }
        }
      }
      
      // 買掛の取引日で月を決定  
      project.project_payables?.forEach(payable => {
        if (payable.payable_amount && payable.payable_amount > 0) {
          const dateStr = payable.transaction_date || payable.created_at || project.created_at;
          const date = new Date(dateStr);
          const year = date.getFullYear();
          
          if (year.toString() === selectedYear) {
            const monthKey = format(date, 'yyyy-MM');
            if (!grouped[monthKey]) {
              grouped[monthKey] = [];
            }
            // 同じプロジェクトがまだ追加されていない場合のみ追加
            if (!grouped[monthKey].find(p => p.id === project.id)) {
              grouped[monthKey].push(project);
            }
          }
        }
      });
    });

    const monthlyDataArray: MonthlyData[] = Object.entries(grouped).map(([month, monthProjects]) => {
      // 該当月の売掛・買掛を計算
      let totalReceivable = 0;
      let totalPayable = 0;
      
      monthProjects.forEach(project => {
        // 売掛: 取引日が該当月の場合のみ計上
        if (project.receivable_amount && project.receivable_amount > 0) {
          const dateStr = project.transaction_date || project.created_at;
          const receivableMonth = format(new Date(dateStr), 'yyyy-MM');
          if (receivableMonth === month) {
            totalReceivable += project.receivable_amount;
          }
        }
        
        // 買掛: 各買掛明細の取引日が該当月の場合のみ計上
        project.project_payables?.forEach(payable => {
          if (payable.payable_amount && payable.payable_amount > 0) {
            const dateStr = payable.transaction_date || payable.created_at || project.created_at;
            const payableMonth = format(new Date(dateStr), 'yyyy-MM');
            
            if (payableMonth === month) {
              totalPayable += payable.payable_amount;
            }
          }
        });
      });
      
      return {
        month,
        projects: monthProjects,
        totalReceivable,
        totalPayable,
        balance: totalReceivable - totalPayable
      };
    }).sort((a, b) => a.month.localeCompare(b.month));

    setMonthlyData(monthlyDataArray);
  };

  const processCustomerData = () => {
    if (customerViewPeriod === 'monthly') {
      processCustomerMonthlyData();
    } else if (customerViewPeriod === 'yearly') {
      processCustomerYearlyData();
    } else {
      processCustomerAllData();
    }
  };

  const processCustomerAllData = () => {
    const customerMap: { [key: string]: CustomerData } = {};

    projects.forEach(project => {
      // 売掛先として処理
      if (project.receivable_customer_id && project.receivable_customer) {
        const customerId = project.receivable_customer_id;
        if (!customerMap[customerId]) {
          customerMap[customerId] = {
            customer: project.receivable_customer,
            receivableProjects: [],
            payableProjects: [],
            totalReceivable: 0,
            totalPayable: 0,
            balance: 0
          };
        }
        customerMap[customerId].receivableProjects.push(project);
        customerMap[customerId].totalReceivable += project.receivable_amount || 0;
      }

      // 買掛先として処理
      project.project_payables?.forEach(payable => {
        if (payable.payable_customer_id && payable.payable_customer) {
          const customerId = payable.payable_customer_id;
          if (!customerMap[customerId]) {
            customerMap[customerId] = {
              customer: payable.payable_customer,
              receivableProjects: [],
              payableProjects: [],
              totalReceivable: 0,
              totalPayable: 0,
              balance: 0
            };
          }
          // 既にこのプロジェクトが買掛プロジェクトリストにあるか確認
          const existingProject = customerMap[customerId].payableProjects.find(p => p.id === project.id);
          if (!existingProject) {
            customerMap[customerId].payableProjects.push(project);
          }
          customerMap[customerId].totalPayable += payable.payable_amount || 0;
        }
      });
    });

    // 差引残高を計算
    Object.values(customerMap).forEach(data => {
      data.balance = data.totalReceivable - data.totalPayable;
    });

    // フィルタリング
    let filteredData = Object.values(customerMap);
    if (selectedCustomer !== 'all') {
      filteredData = filteredData.filter(d => d.customer.id === selectedCustomer);
    }

    setCustomerData(filteredData.sort((a, b) => b.totalReceivable - a.totalReceivable));
  };

  const processCustomerMonthlyData = () => {
    const dataMap: { [key: string]: CustomerMonthlyData } = {};
    const targetMonth = `${selectedCustomerYear}-${selectedCustomerMonth.padStart(2, '0')}`;

    projects.forEach(project => {
      // 売掛の取引日で月判定
      const receivableInTargetMonth = (() => {
        if (!project.receivable_amount || project.receivable_amount === 0) return false;
        const dateStr = project.transaction_date || project.created_at;
        return format(new Date(dateStr), 'yyyy-MM') === targetMonth;
      })();
      
      // 買掛の取引日で月判定
      const hasPayableInTargetMonth = project.project_payables?.some(payable => {
        const dateStr = payable.transaction_date || payable.created_at || project.created_at;
        return format(new Date(dateStr), 'yyyy-MM') === targetMonth;
      });
      
      // どちらもターゲット月に該当しない場合はスキップ
      if (!receivableInTargetMonth && !hasPayableInTargetMonth) return;

      // 売掛先として処理（取引日が該当月の場合）
      if (receivableInTargetMonth && project.receivable_customer_id && project.receivable_customer) {
        const key = `${project.receivable_customer_id}_${targetMonth}`;
        if (!dataMap[key]) {
          dataMap[key] = {
            month: targetMonth,
            customer: project.receivable_customer,
            receivableProjects: [],
            payableProjects: [],
            totalReceivable: 0,
            totalPayable: 0,
            balance: 0
          };
        }
        dataMap[key].receivableProjects.push(project);
        dataMap[key].totalReceivable += project.receivable_amount || 0;
      }

      // 買掛先として処理（取引日が該当月の場合）
      project.project_payables?.forEach(payable => {
        const dateStr = payable.transaction_date || payable.created_at || project.created_at;
        if (format(new Date(dateStr), 'yyyy-MM') === targetMonth &&
            payable.payable_customer_id && payable.payable_customer) {
          const key = `${payable.payable_customer_id}_${targetMonth}`;
          if (!dataMap[key]) {
            dataMap[key] = {
              month: targetMonth,
              customer: payable.payable_customer,
              receivableProjects: [],
              payableProjects: [],
              totalReceivable: 0,
              totalPayable: 0,
              balance: 0
            };
          }
          const existingProject = dataMap[key].payableProjects.find(p => p.id === project.id);
          if (!existingProject) {
            dataMap[key].payableProjects.push(project);
          }
          dataMap[key].totalPayable += payable.payable_amount || 0;
        }
      });
    });

    // 差引残高を計算
    Object.values(dataMap).forEach(data => {
      data.balance = data.totalReceivable - data.totalPayable;
    });

    // フィルタリング
    let filteredData = Object.values(dataMap);
    if (selectedCustomer !== 'all') {
      filteredData = filteredData.filter(d => d.customer.id === selectedCustomer);
    }

    setCustomerMonthlyData(filteredData.sort((a, b) => b.totalReceivable - a.totalReceivable));
  };

  const processCustomerYearlyData = () => {
    const dataMap: { [key: string]: CustomerYearlyData } = {};

    projects.forEach(project => {
      // 売掛の取引日で年判定
      const receivableInTargetYear = (() => {
        if (!project.receivable_amount || project.receivable_amount === 0) return false;
        const dateStr = project.transaction_date || project.created_at;
        return new Date(dateStr).getFullYear().toString() === selectedCustomerYear;
      })();
      
      // 買掛の取引日で年判定
      const hasPayableInTargetYear = project.project_payables?.some(payable => {
        const dateStr = payable.transaction_date || payable.created_at || project.created_at;
        return new Date(dateStr).getFullYear().toString() === selectedCustomerYear;
      });
      
      // どちらもターゲット年に該当しない場合はスキップ
      if (!receivableInTargetYear && !hasPayableInTargetYear) return;

      // 売掛先として処理（取引日が該当年の場合）
      if (receivableInTargetYear && project.receivable_customer_id && project.receivable_customer) {
        const key = `${project.receivable_customer_id}_${selectedCustomerYear}`;
        if (!dataMap[key]) {
          dataMap[key] = {
            year: selectedCustomerYear,
            customer: project.receivable_customer,
            receivableProjects: [],
            payableProjects: [],
            totalReceivable: 0,
            totalPayable: 0,
            balance: 0
          };
        }
        dataMap[key].receivableProjects.push(project);
        dataMap[key].totalReceivable += project.receivable_amount || 0;
      }

      // 買掛先として処理（取引日が該当年の場合）
      project.project_payables?.forEach(payable => {
        const dateStr = payable.transaction_date || payable.created_at || project.created_at;
        if (new Date(dateStr).getFullYear().toString() === selectedCustomerYear &&
            payable.payable_customer_id && payable.payable_customer) {
          const key = `${payable.payable_customer_id}_${selectedCustomerYear}`;
          if (!dataMap[key]) {
            dataMap[key] = {
              year: selectedCustomerYear,
              customer: payable.payable_customer,
              receivableProjects: [],
              payableProjects: [],
              totalReceivable: 0,
              totalPayable: 0,
              balance: 0
            };
          }
          const existingProject = dataMap[key].payableProjects.find(p => p.id === project.id);
          if (!existingProject) {
            dataMap[key].payableProjects.push(project);
          }
          dataMap[key].totalPayable += payable.payable_amount || 0;
        }
      });
    });

    // 差引残高を計算
    Object.values(dataMap).forEach(data => {
      data.balance = data.totalReceivable - data.totalPayable;
    });

    // フィルタリング
    let filteredData = Object.values(dataMap);
    if (selectedCustomer !== 'all') {
      filteredData = filteredData.filter(d => d.customer.id === selectedCustomer);
    }

    setCustomerYearlyData(filteredData.sort((a, b) => b.totalReceivable - a.totalReceivable));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const getPaymentScheduleDisplay = (date?: string, type: 'receivable' | 'payable' = 'payable') => {
    if (!date) {
      return <span className="text-gray-400">未設定</span>;
    }
    const scheduledDate = new Date(date);
    const formattedDate = scheduledDate.toLocaleDateString('ja-JP');
    const label = type === 'receivable' ? '入金予定' : '支払予定';
    
    return (
      <div className="text-sm">
        <span className="text-gray-600">{label}: </span>
        <span className="font-medium">{formattedDate}</span>
      </div>
    );
  };

  const toggleProjectExpanded = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getSelectedMonthData = () => {
    const monthKey = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
    return monthlyData.find(data => data.month === monthKey);
  };

  // 動的に年のリストを生成（現在の年を含む前後の年）
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}月`
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">売掛・買掛管理</h1>
        <div className="text-center py-8">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">売掛・買掛管理</h1>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="print-button"
        >
          <Printer className="h-4 w-4 mr-2" />
          印刷
        </Button>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">月別表示</TabsTrigger>
          <TabsTrigger value="customer">顧客別表示</TabsTrigger>
          <TabsTrigger value="summary">サマリー</TabsTrigger>
        </TabsList>

        {/* 月別表示 */}
        <TabsContent value="monthly" className="space-y-4">
          <div className="flex gap-4">
            <div>
              <Label>月選択</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const currentDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1);
                    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
                    setSelectedYear(prevMonth.getFullYear().toString());
                    setSelectedMonth((prevMonth.getMonth() + 1).toString());
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-3 py-1 min-w-[120px] text-center font-medium">
                  {selectedYear}年{parseInt(selectedMonth)}月
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const currentDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1);
                    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
                    setSelectedYear(nextMonth.getFullYear().toString());
                    setSelectedMonth((nextMonth.getMonth() + 1).toString());
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {(() => {
            const monthData = getSelectedMonthData();
            if (!monthData) {
              return (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    選択された月のデータがありません
                  </CardContent>
                </Card>
              );
            }

            return (
              <>
                {/* サマリーカード */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">売掛金合計</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(monthData.totalReceivable)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">買掛金合計</CardTitle>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(monthData.totalPayable)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">差引残高</CardTitle>
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${monthData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(monthData.balance)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* プロジェクトリスト */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedYear}年{selectedMonth}月のプロジェクト一覧
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>案件名</TableHead>
                          <TableHead>売掛先</TableHead>
                          <TableHead>売掛金</TableHead>
                          <TableHead>取引日</TableHead>
                          <TableHead>入金予定</TableHead>
                          <TableHead>買掛金合計</TableHead>
                          <TableHead>粗利益</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthData.projects.map(project => (
                          <React.Fragment key={project.id}>
                            <TableRow>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {project.project_payables && project.project_payables.length > 0 && (
                                    <button
                                      onClick={() => toggleProjectExpanded(project.id)}
                                      className="hover:bg-gray-100 rounded p-1"
                                    >
                                      {expandedProjects.has(project.id) ? 
                                        <ChevronDown className="h-4 w-4" /> : 
                                        <ChevronRight className="h-4 w-4" />
                                      }
                                    </button>
                                  )}
                                  <Briefcase className="h-4 w-4 text-gray-400" />
                                  <span 
                                    className="cursor-pointer hover:text-blue-600 hover:underline"
                                    onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                                  >
                                    {project.project_name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-green-700">
                                {project.receivable_customer?.customer_name || '-'}
                              </TableCell>
                              <TableCell className="text-green-600">
                                {project.receivable_amount && project.receivable_amount > 0 
                                  ? formatCurrency(project.receivable_amount) 
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-sm">
                                {project.transaction_date 
                                  ? new Date(project.transaction_date).toLocaleDateString('ja-JP')
                                  : project.created_at 
                                    ? new Date(project.created_at).toLocaleDateString('ja-JP')
                                    : '-'}
                              </TableCell>
                              <TableCell>
                                {getPaymentScheduleDisplay(project.receivable_payment_date, 'receivable')}
                              </TableCell>
                              <TableCell className="text-red-600">
                                {(() => {
                                  // この月の買掛金合計を計算
                                  const monthPayableTotal = (project.project_payables || []).reduce((sum, payable) => {
                                    const dateStr = payable.transaction_date || payable.created_at || project.created_at;
                                    const payableMonth = format(new Date(dateStr), 'yyyy-MM');
                                    if (payableMonth === monthData.month) {
                                      return sum + (payable.payable_amount || 0);
                                    }
                                    return sum;
                                  }, 0);
                                  return monthPayableTotal > 0 ? formatCurrency(monthPayableTotal) : '-';
                                })()}
                              </TableCell>
                              <TableCell className={`font-medium ${
                                (() => {
                                  // この月の売掛金を計算
                                  const monthReceivable = (() => {
                                    if (project.transaction_date || project.receivable_amount) {
                                      const dateStr = project.transaction_date || project.created_at;
                                      const receivableMonth = format(new Date(dateStr), 'yyyy-MM');
                                      if (receivableMonth === monthData.month) {
                                        return project.receivable_amount || 0;
                                      }
                                    }
                                    return 0;
                                  })();
                                  
                                  // この月の買掛金合計を計算
                                  const monthPayableTotal = (project.project_payables || []).reduce((sum, payable) => {
                                    const dateStr = payable.transaction_date || payable.created_at || project.created_at;
                                    const payableMonth = format(new Date(dateStr), 'yyyy-MM');
                                    if (payableMonth === monthData.month) {
                                      return sum + (payable.payable_amount || 0);
                                    }
                                    return sum;
                                  }, 0);
                                  
                                  return (monthReceivable - monthPayableTotal) >= 0;
                                })()
                                  ? 'text-blue-600'
                                  : 'text-red-600'
                              }`}>
                                {(() => {
                                  // この月の売掛金を計算
                                  const monthReceivable = (() => {
                                    if (project.transaction_date || project.receivable_amount) {
                                      const dateStr = project.transaction_date || project.created_at;
                                      const receivableMonth = format(new Date(dateStr), 'yyyy-MM');
                                      if (receivableMonth === monthData.month) {
                                        return project.receivable_amount || 0;
                                      }
                                    }
                                    return 0;
                                  })();
                                  
                                  // この月の買掛金合計を計算
                                  const monthPayableTotal = (project.project_payables || []).reduce((sum, payable) => {
                                    const dateStr = payable.transaction_date || payable.created_at || project.created_at;
                                    const payableMonth = format(new Date(dateStr), 'yyyy-MM');
                                    if (payableMonth === monthData.month) {
                                      return sum + (payable.payable_amount || 0);
                                    }
                                    return sum;
                                  }, 0);
                                  
                                  return formatCurrency(monthReceivable - monthPayableTotal);
                                })()}
                              </TableCell>
                            </TableRow>
                            {expandedProjects.has(project.id) && project.project_payables && project.project_payables.filter(payable => {
                              // この月に該当する買掛のみ表示
                              const dateStr = payable.transaction_date || payable.created_at || project.created_at;
                              const payableMonth = format(new Date(dateStr), 'yyyy-MM');
                              return payableMonth === monthData.month;
                            }).map(payable => (
                              <TableRow key={payable.id} className="bg-gray-50">
                                <TableCell colSpan={2} className="pl-12">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-red-400" />
                                    {payable.payable_customer?.customer_name}
                                  </div>
                                  {payable.description && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      {payable.description}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-red-600">
                                  {formatCurrency(payable.payable_amount)}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {payable.transaction_date
                                    ? new Date(payable.transaction_date).toLocaleDateString('ja-JP')
                                    : payable.created_at
                                      ? new Date(payable.created_at).toLocaleDateString('ja-JP')
                                      : project.created_at
                                        ? new Date(project.created_at).toLocaleDateString('ja-JP')
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                  {getPaymentScheduleDisplay(payable.payment_scheduled_date, 'payable')}
                                </TableCell>
                                <TableCell colSpan={2}></TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </TabsContent>

        {/* 顧客別表示 */}
        <TabsContent value="customer" className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* 期間切り替え */}
            <div>
              <Label>表示期間</Label>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={customerViewPeriod === 'all' ? 'default' : 'ghost'}
                  onClick={() => setCustomerViewPeriod('all')}
                >
                  全期間
                </Button>
                <Button
                  size="sm"
                  variant={customerViewPeriod === 'monthly' ? 'default' : 'ghost'}
                  onClick={() => setCustomerViewPeriod('monthly')}
                >
                  <CalendarDays className="h-4 w-4 mr-1" />
                  月別
                </Button>
                <Button
                  size="sm"
                  variant={customerViewPeriod === 'yearly' ? 'default' : 'ghost'}
                  onClick={() => setCustomerViewPeriod('yearly')}
                >
                  <CalendarRange className="h-4 w-4 mr-1" />
                  年別
                </Button>
              </div>
            </div>

            {/* 顧客フィルター */}
            <div>
              <Label>顧客フィルター</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての顧客</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 月選択（月別表示時） */}
            {customerViewPeriod === 'monthly' && (
              <div>
                <Label>月選択</Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const currentDate = new Date(parseInt(selectedCustomerYear), parseInt(selectedCustomerMonth) - 1);
                      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
                      setSelectedCustomerYear(prevMonth.getFullYear().toString());
                      setSelectedCustomerMonth((prevMonth.getMonth() + 1).toString());
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="px-3 py-1 min-w-[120px] text-center font-medium">
                    {selectedCustomerYear}年{parseInt(selectedCustomerMonth)}月
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const currentDate = new Date(parseInt(selectedCustomerYear), parseInt(selectedCustomerMonth) - 1);
                      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
                      setSelectedCustomerYear(nextMonth.getFullYear().toString());
                      setSelectedCustomerMonth((nextMonth.getMonth() + 1).toString());
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* 年選択（年別表示時） */}
            {customerViewPeriod === 'yearly' && (
              <div>
                <Label>年</Label>
                <Select value={selectedCustomerYear} onValueChange={setSelectedCustomerYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}年</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* 全期間表示 */}
          {customerViewPeriod === 'all' && customerData.map(data => (
            <Card key={data.customer.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {data.customer.customer_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 顧客サマリー */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">関連案件数</p>
                    <p className="text-lg font-medium">
                      {[...new Set([...data.receivableProjects, ...data.payableProjects].map(p => p.id))].length}件
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">売掛金合計</p>
                    <p className="text-lg font-medium text-green-600">
                      {formatCurrency(data.totalReceivable)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">買掛金合計</p>
                    <p className="text-lg font-medium text-red-600">
                      {formatCurrency(data.totalPayable)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">差引残高</p>
                    <p className={`text-lg font-medium ${data.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(data.balance)}
                    </p>
                  </div>
                </div>

                {/* 売掛プロジェクト */}
                {data.receivableProjects.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">売掛案件</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>案件名</TableHead>
                          <TableHead>登録日</TableHead>
                          <TableHead>売掛金</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.receivableProjects.map(project => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">
                              <span 
                                className="cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                              >
                                {project.project_name}
                              </span>
                            </TableCell>
                            <TableCell>
                              {format(new Date(project.created_at), 'yyyy/MM/dd')}
                            </TableCell>
                            <TableCell className="text-green-600">
                              {formatCurrency(project.receivable_amount || 0)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* 買掛プロジェクト */}
                {data.payableProjects.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">買掛案件</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>案件名</TableHead>
                          <TableHead>登録日</TableHead>
                          <TableHead>買掛明細</TableHead>
                          <TableHead>買掛金</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.payableProjects.map(project => {
                          const relevantPayables = project.project_payables?.filter(
                            p => p.payable_customer_id === data.customer.id
                          ) || [];
                          const payableTotal = relevantPayables.reduce((sum, p) => sum + p.payable_amount, 0);
                          
                          return (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium">
                              <span 
                                className="cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                              >
                                {project.project_name}
                              </span>
                            </TableCell>
                              <TableCell>
                                {format(new Date(project.created_at), 'yyyy/MM/dd')}
                              </TableCell>
                              <TableCell className="text-sm">
                                {relevantPayables.map((p, idx) => (
                                  <div key={idx}>
                                    {p.description || '買掛金'}
                                  </div>
                                ))}
                              </TableCell>
                              <TableCell className="text-red-600">
                                {formatCurrency(payableTotal)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* 月別表示 */}
          {customerViewPeriod === 'monthly' && (
            <>
              <div className="text-lg font-medium">
                {selectedCustomerYear}年{selectedCustomerMonth}月の顧客別データ
              </div>
              {customerMonthlyData.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    選択された期間のデータがありません
                  </CardContent>
                </Card>
              ) : (
                customerMonthlyData.map(data => (
                  <Card key={`${data.customer.id}_${data.month}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {data.customer.customer_name}
                        <Badge variant="outline">{data.month}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* 顧客サマリー */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">関連案件数</p>
                          <p className="text-lg font-medium">
                            {[...new Set([...data.receivableProjects, ...data.payableProjects].map(p => p.id))].length}件
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">売掛金合計</p>
                          <p className="text-lg font-medium text-green-600">
                            {formatCurrency(data.totalReceivable)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">買掛金合計</p>
                          <p className="text-lg font-medium text-red-600">
                            {formatCurrency(data.totalPayable)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">差引残高</p>
                          <p className={`text-lg font-medium ${data.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(data.balance)}
                          </p>
                        </div>
                      </div>

                      {/* 売掛プロジェクト */}
                      {data.receivableProjects.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">売掛案件</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>案件名</TableHead>
                                <TableHead>登録日</TableHead>
                                <TableHead>売掛金</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.receivableProjects.map(project => (
                                <TableRow key={project.id}>
                                  <TableCell className="font-medium">
                              <span 
                                className="cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                              >
                                {project.project_name}
                              </span>
                            </TableCell>
                                  <TableCell>
                                    {format(new Date(project.created_at), 'yyyy/MM/dd')}
                                  </TableCell>
                                  <TableCell className="text-green-600">
                                    {formatCurrency(project.receivable_amount || 0)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {/* 買掛プロジェクト */}
                      {data.payableProjects.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">買掛案件</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>案件名</TableHead>
                                <TableHead>登録日</TableHead>
                                <TableHead>買掛明細</TableHead>
                                <TableHead>買掛金</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.payableProjects.map(project => {
                                const relevantPayables = project.project_payables?.filter(
                                  p => p.payable_customer_id === data.customer.id
                                ) || [];
                                const payableTotal = relevantPayables.reduce((sum, p) => sum + p.payable_amount, 0);
                                
                                return (
                                  <TableRow key={project.id}>
                                    <TableCell className="font-medium">
                              <span 
                                className="cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                              >
                                {project.project_name}
                              </span>
                            </TableCell>
                                    <TableCell>
                                      {format(new Date(project.created_at), 'yyyy/MM/dd')}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {relevantPayables.map((p, idx) => (
                                        <div key={idx}>
                                          {p.description || '買掛金'}
                                        </div>
                                      ))}
                                    </TableCell>
                                    <TableCell className="text-red-600">
                                      {formatCurrency(payableTotal)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}

          {/* 年別表示 */}
          {customerViewPeriod === 'yearly' && (
            <>
              <div className="text-lg font-medium">
                {selectedCustomerYear}年の顧客別データ
              </div>
              {customerYearlyData.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    選択された期間のデータがありません
                  </CardContent>
                </Card>
              ) : (
                customerYearlyData.map(data => (
                  <Card key={`${data.customer.id}_${data.year}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {data.customer.customer_name}
                        <Badge variant="outline">{data.year}年</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* 顧客サマリー */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">関連案件数</p>
                          <p className="text-lg font-medium">
                            {[...new Set([...data.receivableProjects, ...data.payableProjects].map(p => p.id))].length}件
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">売掛金合計</p>
                          <p className="text-lg font-medium text-green-600">
                            {formatCurrency(data.totalReceivable)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">買掛金合計</p>
                          <p className="text-lg font-medium text-red-600">
                            {formatCurrency(data.totalPayable)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">差引残高</p>
                          <p className={`text-lg font-medium ${data.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(data.balance)}
                          </p>
                        </div>
                      </div>

                      {/* 売掛プロジェクト */}
                      {data.receivableProjects.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">売掛案件</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>案件名</TableHead>
                                <TableHead>登録日</TableHead>
                                <TableHead>売掛金</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.receivableProjects.map(project => (
                                <TableRow key={project.id}>
                                  <TableCell className="font-medium">
                              <span 
                                className="cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                              >
                                {project.project_name}
                              </span>
                            </TableCell>
                                  <TableCell>
                                    {format(new Date(project.created_at), 'yyyy/MM/dd')}
                                  </TableCell>
                                  <TableCell className="text-green-600">
                                    {formatCurrency(project.receivable_amount || 0)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {/* 買掛プロジェクト */}
                      {data.payableProjects.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">買掛案件</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>案件名</TableHead>
                                <TableHead>登録日</TableHead>
                                <TableHead>買掛明細</TableHead>
                                <TableHead>買掛金</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.payableProjects.map(project => {
                                const relevantPayables = project.project_payables?.filter(
                                  p => p.payable_customer_id === data.customer.id
                                ) || [];
                                const payableTotal = relevantPayables.reduce((sum, p) => sum + p.payable_amount, 0);
                                
                                return (
                                  <TableRow key={project.id}>
                                    <TableCell className="font-medium">
                              <span 
                                className="cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                              >
                                {project.project_name}
                              </span>
                            </TableCell>
                                    <TableCell>
                                      {format(new Date(project.created_at), 'yyyy/MM/dd')}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {relevantPayables.map((p, idx) => (
                                        <div key={idx}>
                                          {p.description || '買掛金'}
                                        </div>
                                      ))}
                                    </TableCell>
                                    <TableCell className="text-red-600">
                                      {formatCurrency(payableTotal)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
        </TabsContent>

        {/* サマリー */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総売掛金</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(projects.reduce((sum, p) => sum + (p.receivable_amount || 0), 0))}
                </div>
                <p className="text-xs text-muted-foreground">全プロジェクト合計</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総買掛金</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(projects.reduce((sum, p) => sum + (p.total_payable_amount || 0), 0))}
                </div>
                <p className="text-xs text-muted-foreground">全プロジェクト合計</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総粗利益</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  (projects.reduce((sum, p) => sum + (p.receivable_amount || 0) - (p.total_payable_amount || 0), 0)) >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}>
                  {formatCurrency(
                    projects.reduce((sum, p) => sum + (p.receivable_amount || 0) - (p.total_payable_amount || 0), 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">売掛金 - 買掛金</p>
              </CardContent>
            </Card>
          </div>

          {/* 年間推移 */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedYear}年 月別推移</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>月</TableHead>
                    <TableHead>案件数</TableHead>
                    <TableHead>売掛金</TableHead>
                    <TableHead>買掛金</TableHead>
                    <TableHead>粗利益</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.map(data => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">
                        {format(parse(data.month, 'yyyy-MM', new Date()), 'yyyy年M月', { locale: ja })}
                      </TableCell>
                      <TableCell>{data.projects.length}件</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(data.totalReceivable)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(data.totalPayable)}
                      </TableCell>
                      <TableCell className={`font-medium ${
                        data.balance >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(data.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {monthlyData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        データがありません
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <PrintStyles />
    </div>
  );
};

export default ReceivablesPayablesMulti;