'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, parseISO, differenceInDays, addDays, isWithinInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  status: '未着工' | '施工中' | '完了' | '保留';
  color: string;
  notes?: string;
  row_position?: number;
}

const ProjectScheduleWithDB: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const calendarRef = useRef<HTMLTableSectionElement>(null);
  const supabase = createClient();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case '未着工': return '#98FB98';
      case '施工中': return '#4F9BFF';
      case '完了': return '#C0C0C0';
      case '保留': return '#FFD700';
      default: return '#87CEEB';
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('row_position', { ascending: true })
        .order('start_date', { ascending: true });

      if (error) {
        if (error.code === '42P01') {
          toast.error('プロジェクトテーブルが存在しません。データベースの設定を確認してください。');
          toast.info('migration SQLファイルを実行してテーブルを作成してください。');
        } else {
          toast.error('プロジェクトの取得に失敗しました');
        }
        setProjects([]);
        return;
      }

      if (data) {
        const formattedProjects = data.map(p => ({
          ...p,
          color: p.color || getStatusColor(p.status)
        }));
        setProjects(formattedProjects);
      }
    } catch {
      toast.error('プロジェクトの取得に失敗しました');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectDragStart = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    setDraggedProject(project);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !draggedProject || !calendarRef.current || !dragStartPos) return;

      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      
      const cellWidth = 40;
      const rowHeight = 30;
      
      const daysDelta = Math.round(deltaX / cellWidth);
      const rowDelta = Math.round(deltaY / rowHeight);

      const projectBar = document.getElementById(`project-bar-${draggedProject.id}`);
      if (projectBar) {
        projectBar.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        projectBar.style.opacity = '0.7';
        projectBar.style.zIndex = '1000';
      }
    };

    const handleMouseUp = async (e: MouseEvent) => {
      if (!isDragging || !draggedProject || !calendarRef.current || !dragStartPos) return;

      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      
      const cellWidth = 40;
      const rowHeight = 30;
      
      const daysDelta = Math.round(deltaX / cellWidth);
      const rowDelta = Math.round(deltaY / rowHeight);

      let updateData: any = {};
      let shouldUpdate = false;

      if (daysDelta !== 0) {
        const originalStart = parseISO(draggedProject.start_date);
        const originalEnd = parseISO(draggedProject.end_date);
        const newStartDate = addDays(originalStart, daysDelta);
        const newEndDate = addDays(originalEnd, daysDelta);

        updateData.start_date = format(newStartDate, 'yyyy-MM-dd');
        updateData.end_date = format(newEndDate, 'yyyy-MM-dd');
        shouldUpdate = true;
      }

      if (rowDelta !== 0 && Math.abs(rowDelta) >= 1) {
        const currentIndex = projects.findIndex(p => p.id === draggedProject.id);
        const newIndex = Math.max(0, Math.min(projects.length - 1, currentIndex + rowDelta));
        
        if (currentIndex !== newIndex) {
          updateData.row_position = newIndex;
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        try {
          const { error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', draggedProject.id);

          if (error) throw error;

          await fetchProjects();
          toast.success('プロジェクトを更新しました');
        } catch {
          toast.error('プロジェクトの更新に失敗しました');
        }
      }

      const projectBar = document.getElementById(`project-bar-${draggedProject.id}`);
      if (projectBar) {
        projectBar.style.transform = '';
        projectBar.style.opacity = '';
        projectBar.style.zIndex = '';
      }

      setDraggedProject(null);
      setDragStartPos(null);
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, draggedProject, dragStartPos, projects]);

  const handleSaveProject = async (formData: any) => {
    try {
      if (editingProject) {
        const { data, error } = await supabase
          .from('projects')
          .update({
            project_name: formData.projectName,
            client_name: formData.clientName,
            start_date: formData.startDate,
            end_date: formData.endDate,
            status: formData.status,
            notes: formData.notes,
            color: getStatusColor(formData.status),
          })
          .eq('id', editingProject.id)
          .select();

        if (error) throw error;
        toast.success('プロジェクトを更新しました');
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            project_name: formData.projectName,
            client_name: formData.clientName,
            start_date: formData.startDate,
            end_date: formData.endDate,
            status: formData.status,
            notes: formData.notes,
            color: getStatusColor(formData.status),
            row_position: projects.length,
          })
          .select();

        if (error) {
          if (error.code === '42501') {
            toast.error('権限エラー: RLSポリシーを確認してください。disable_auth.sqlを実行してください。');
          } else if (error.code === '23502') {
            toast.error('必須フィールドが不足しています');
          } else {
            toast.error(`エラー: ${error.message || 'プロジェクトの保存に失敗しました'}`);
          }
          return;
        }

        toast.success('プロジェクトを登録しました');
      }
      
      await fetchProjects();
      setShowDialog(false);
      setEditingProject(null);
    } catch (error: any) {
      toast.error(`プロジェクトの保存に失敗しました: ${error?.message || error}`);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      await fetchProjects();
      toast.success('プロジェクトを削除しました');
    } catch {
      toast.error('プロジェクトの削除に失敗しました');
    }
  };

  const renderProjectBar = (project: Project, rowIndex: number) => {
    const projectStart = parseISO(project.start_date);
    const projectEnd = parseISO(project.end_date);
    
    let startIndex = -1;
    let endIndex = -1;
    let barWidth = 0;

    monthDays.forEach((day, index) => {
      if (isSameDay(day, projectStart)) startIndex = index;
      if (isSameDay(day, projectEnd)) endIndex = index;
    });

    if (startIndex === -1 && projectStart < monthStart) startIndex = 0;
    if (endIndex === -1 && projectEnd > monthEnd) endIndex = monthDays.length - 1;
    
    if (startIndex !== -1 && endIndex !== -1) {
      barWidth = endIndex - startIndex + 1;
    } else if (isWithinInterval(monthStart, { start: projectStart, end: projectEnd })) {
      startIndex = 0;
      endIndex = monthDays.length - 1;
      barWidth = monthDays.length;
    } else {
      return null;
    }

    if (barWidth <= 0) return null;

    return (
      <div
        id={`project-bar-${project.id}`}
        className="absolute h-6 rounded-sm text-white text-xs font-medium px-1 flex items-center justify-between cursor-grab hover:opacity-90 transition-opacity"
        style={{
          backgroundColor: project.color,
          left: `${startIndex * 40 + 2}px`,
          width: `${barWidth * 40 - 4}px`,
          top: '2px',
        }}
        onMouseDown={(e) => handleProjectDragStart(e, project)}
        title={`${project.project_name} - ${project.client_name}`}
      >
        <span className="truncate flex-1">{project.project_name}</span>
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingProject(project);
              setShowDialog(true);
            }}
            className="hover:bg-white/20 rounded p-0.5"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('このプロジェクトを削除しますか？')) {
                handleDeleteProject(project.id);
              }
            }}
            className="hover:bg-white/20 rounded p-0.5"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">日程</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium">
                {format(currentDate, 'yyyy年MM月', { locale: ja })}
              </span>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                onClick={() => {
                  setEditingProject(null);
                }}
              >
                <Plus size={16} className="mr-1" />
                新規案件
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? '案件編集' : '新規案件登録'}
                </DialogTitle>
              </DialogHeader>
              <ProjectForm 
                project={editingProject}
                onSave={handleSaveProject}
                onCancel={() => {
                  setShowDialog(false);
                  setEditingProject(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto" style={{ maxHeight: '600px' }}>
          <div className="min-w-max">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-white">
                <tr>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-center w-32">
                    施工案件
                  </th>
                  {monthDays.map((day, index) => {
                    const dayOfWeek = getDay(day);
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const isToday = isSameDay(day, new Date());
                    return (
                      <th
                        key={index}
                        className={`border border-gray-300 px-0 py-1 text-xs font-medium text-center ${
                          isWeekend ? 'bg-gray-100' : 'bg-gray-50'
                        } ${isToday ? 'bg-blue-100' : ''}`}
                        style={{ width: '40px', minWidth: '40px' }}
                      >
                        <div>{format(day, 'd')}</div>
                        <div className={`text-[10px] ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : ''}`}>
                          {weekDays[dayOfWeek]}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody ref={calendarRef}>
                {projects.map((project, rowIndex) => (
                  <tr key={project.id} className="h-8">
                    <td className="border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-medium">
                      <div className="truncate">{project.client_name}</div>
                    </td>
                    <td 
                      className="relative border-l border-gray-300" 
                      colSpan={monthDays.length}
                      style={{ height: '30px' }}
                    >
                      <div className="absolute inset-0 flex">
                        {monthDays.map((day, index) => {
                          const dayOfWeek = getDay(day);
                          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                          const isToday = isSameDay(day, new Date());
                          return (
                            <div
                              key={index}
                              className={`border-r border-gray-200 ${
                                isWeekend ? 'bg-gray-50' : 'bg-white'
                              } ${isToday ? 'bg-blue-50' : ''}`}
                              style={{ width: '40px', minWidth: '40px' }}
                            />
                          );
                        })}
                      </div>
                      {renderProjectBar(project, rowIndex)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectFormProps {
  project: Project | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    projectName: project?.project_name || '',
    clientName: project?.client_name || '',
    startDate: project?.start_date || format(new Date(), 'yyyy-MM-dd'),
    endDate: project?.end_date || format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    status: project?.status || '未着工',
    notes: project?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>案件名</Label>
        <Input
          value={formData.projectName}
          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>顧客名</Label>
        <Input
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>開始日</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>終了日</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label>ステータス</Label>
        <Select 
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as Project['status'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="未着工">未着工</SelectItem>
            <SelectItem value="施工中">施工中</SelectItem>
            <SelectItem value="完了">完了</SelectItem>
            <SelectItem value="保留">保留</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>備考</Label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="メモや注意事項など"
        />
      </div>
      <div className="flex justify-end gap-2">
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

export default ProjectScheduleWithDB;