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
import { Plus, Edit2, Trash2, Search, Briefcase, Building2, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface Customer {
  id: string;
  customer_name: string;
}

interface Project {
  id: string;
  project_name: string;
  receivable_customer_id?: string; // 売掛先（顧客）
  payable_customer_id?: string; // 買掛先（仕入先・外注先）
  receivable_amount?: number; // 売掛金
  payable_amount?: number; // 買掛金
  created_at?: string;
  updated_at?: string;
  receivable_customer?: Customer; // 売掛先情報
  payable_customer?: Customer; // 買掛先情報
}

const ProjectsManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm]);

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
      // プロジェクトと売掛先・買掛先情報を結合して取得
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          receivable_customer:receivable_customer_id(id, customer_name),
          payable_customer:payable_customer_id(id, customer_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          toast.error('プロジェクトテーブルが存在しません。create_projects_table.sqlを実行してください。');
        } else {
          toast.error(`プロジェクトの取得に失敗しました: ${error.message}`);
        }
        setProjects([]);
        return;
      }

      setProjects(data || []);
    } catch (error: any) {
      toast.error(`エラーが発生しました: ${error.message || error}`);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.receivable_customer?.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.payable_customer?.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handleSaveProject = async (formData: any) => {
    try {
      // 必須項目チェック
      if (!formData.project_name || formData.project_name.trim() === '') {
        toast.error('案件名を入力してください');
        return;
      }

      const processedData = {
        project_name: formData.project_name.trim(),
        receivable_customer_id: formData.receivable_customer_id || null,
        payable_customer_id: formData.payable_customer_id || null,
        receivable_amount: formData.receivable_amount ? parseFloat(formData.receivable_amount) : 0,
        payable_amount: formData.payable_amount ? parseFloat(formData.payable_amount) : 0
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(processedData)
          .eq('id', editingProject.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        toast.success('案件を更新しました');
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([processedData])
          .select()
          .single();

        if (error) {
          if (error.code === '42P01') {
            toast.error('プロジェクトテーブルが存在しません。create_projects_table.sqlを実行してください。');
          } else if (error.code === '23503') {
            toast.error('選択された顧客が存在しません');
          } else {
            toast.error(`保存に失敗しました: ${error.message || 'Unknown error'}`);
          }
          return;
        }

        if (data) {
          toast.success('案件を登録しました');
        }
      }

      await fetchProjects();
      setShowDialog(false);
      setEditingProject(null);
    } catch (error: any) {
      toast.error(`保存に失敗しました: ${error.message || error}`);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('この案件を削除しますか？')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success('案件を削除しました');
      await fetchProjects();
      setSelectedProject(null);
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
              placeholder="案件名または顧客名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setShowDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          新規案件登録
        </Button>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 案件リスト */}
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
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedProject?.id === project.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{project.project_name}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 ml-6">
                          {project.receivable_customer && (
                            <div>
                              <span className="text-green-700">売掛先: </span>
                              {project.receivable_customer.customer_name}
                            </div>
                          )}
                          {project.payable_customer && (
                            <div>
                              <span className="text-red-700">買掛先: </span>
                              {project.payable_customer.customer_name}
                            </div>
                          )}
                        </div>
                        {(project.receivable_amount || project.payable_amount) && (
                          <div className="text-sm font-medium mt-1 ml-6">
                            {(project.receivable_amount || 0) > 0 && (
                              <span className="text-green-600 mr-3">
                                <TrendingUp className="inline h-3 w-3 mr-1" />
                                売掛: ¥{(project.receivable_amount || 0).toLocaleString()}
                              </span>
                            )}
                            {(project.payable_amount || 0) > 0 && (
                              <span className="text-red-600">
                                <TrendingDown className="inline h-3 w-3 mr-1" />
                                買掛: ¥{(project.payable_amount || 0).toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* 詳細表示 */}
        <Card className="lg:col-span-2">
          {selectedProject ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedProject.project_name}</CardTitle>
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
                    <Label className="text-gray-600">案件名</Label>
                    <p className="font-medium text-lg">{selectedProject.project_name}</p>
                  </div>
                  {selectedProject.receivable_customer && (
                    <div>
                      <Label className="text-gray-600">売掛先（顧客）</Label>
                      <p className="font-medium">
                        <Building2 className="inline h-4 w-4 mr-2 text-green-600" />
                        {selectedProject.receivable_customer.customer_name}
                      </p>
                    </div>
                  )}
                  {selectedProject.payable_customer && (
                    <div>
                      <Label className="text-gray-600">買掛先（仕入先・外注先）</Label>
                      <p className="font-medium">
                        <Building2 className="inline h-4 w-4 mr-2 text-red-600" />
                        {selectedProject.payable_customer.customer_name}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-600">売掛金</Label>
                    <p className="font-medium text-lg">
                      {selectedProject.receivable_amount && selectedProject.receivable_amount > 0 ? (
                        <span className="text-green-600">
                          <TrendingUp className="inline h-4 w-4 mr-2" />
                          ¥{selectedProject.receivable_amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">買掛金</Label>
                    <p className="font-medium text-lg">
                      {selectedProject.payable_amount && selectedProject.payable_amount > 0 ? (
                        <span className="text-red-600">
                          <TrendingDown className="inline h-4 w-4 mr-2" />
                          ¥{selectedProject.payable_amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </p>
                  </div>
                  {selectedProject.created_at && (
                    <div>
                      <Label className="text-gray-600">登録日時</Label>
                      <p className="font-medium">
                        <Calendar className="inline h-4 w-4 mr-2 text-gray-400" />
                        {new Date(selectedProject.created_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  )}
                  {selectedProject.updated_at && (
                    <div>
                      <Label className="text-gray-600">更新日時</Label>
                      <p className="font-medium">
                        {new Date(selectedProject.updated_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-2" />
                <p>案件を選択してください</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 登録・編集ダイアログ */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
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
  const [formData, setFormData] = useState({
    project_name: project?.project_name || '',
    receivable_customer_id: project?.receivable_customer_id || '',
    payable_customer_id: project?.payable_customer_id || '',
    receivable_amount: project?.receivable_amount?.toString() || '',
    payable_amount: project?.payable_amount?.toString() || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>案件名 <span className="text-red-500">*</span></Label>
        <Input
          value={formData.project_name}
          onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
          required
          placeholder="案件名を入力してください"
        />
      </div>

      <div>
        <Label>売掛先（顧客）</Label>
        <Select
          value={formData.receivable_customer_id}
          onValueChange={(value) => setFormData({ ...formData, receivable_customer_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="売掛先を選択（任意）" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">選択しない</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.customer_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>買掛先（仕入先・外注先）</Label>
        <Select
          value={formData.payable_customer_id}
          onValueChange={(value) => setFormData({ ...formData, payable_customer_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="買掛先を選択（任意）" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">選択しない</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.customer_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>売掛金（顧客から受け取る金額）</Label>
        <Input
          type="number"
          value={formData.receivable_amount}
          onChange={(e) => setFormData({ ...formData, receivable_amount: e.target.value })}
          placeholder="売掛金額を入力"
          min="0"
        />
      </div>

      <div>
        <Label>買掛金（支払う金額）</Label>
        <Input
          type="number"
          value={formData.payable_amount}
          onChange={(e) => setFormData({ ...formData, payable_amount: e.target.value })}
          placeholder="買掛金額を入力"
          min="0"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit">
          {project ? '更新' : '登録'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectsManagement;