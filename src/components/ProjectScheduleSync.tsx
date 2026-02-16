'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, parseISO, differenceInDays, addDays, isWithinInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, DollarSign, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataSync, type Project } from '@/contexts/DataSyncContext';
import { toast } from 'sonner';

const ProjectScheduleSync: React.FC = () => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    createPaymentFromProject,
    syncProjectDates,
    fundsEntries,
  } = useDataSync();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [paymentData, setPaymentData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    type: 'revenue' as 'revenue' | 'expense',
    description: '',
  });
  const calendarRef = useRef<HTMLTableSectionElement>(null);

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

      let shouldUpdate = false;

      if (daysDelta !== 0) {
        const originalStart = parseISO(draggedProject.start_date);
        const originalEnd = parseISO(draggedProject.end_date);
        const newStartDate = addDays(originalStart, daysDelta);
        const newEndDate = addDays(originalEnd, daysDelta);

        const newStart = format(newStartDate, 'yyyy-MM-dd');
        const newEnd = format(newEndDate, 'yyyy-MM-dd');

        // プロジェクトを更新し、関連するFundsEntryも同期
        updateProject(draggedProject.id, {
          start_date: newStart,
          end_date: newEnd,
        });

        toast.success('プロジェクトを更新しました');
      }

      if (rowDelta !== 0 && Math.abs(rowDelta) >= 1) {
        const currentIndex = projects.findIndex(p => p.id === draggedProject.id);
        const newIndex = Math.max(0, Math.min(projects.length - 1, currentIndex + rowDelta));
        
        if (currentIndex !== newIndex) {
          updateProject(draggedProject.id, {
            row_position: newIndex,
          });
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
  }, [isDragging, draggedProject, dragStartPos, projects, updateProject]);

  const handleSaveProject = (formData: any) => {
    if (editingProject) {
      updateProject(editingProject.id, {
        project_name: formData.projectName,
        client_name: formData.clientName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status,
        notes: formData.notes,
        color: getStatusColor(formData.status),
      });
      toast.success('プロジェクトを更新しました');
    } else {
      addProject({
        project_name: formData.projectName,
        client_name: formData.clientName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status,
        notes: formData.notes,
        color: getStatusColor(formData.status),
        row_position: projects.length,
      });
      toast.success('プロジェクトを登録しました');
    }
    
    setShowDialog(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    toast.success('プロジェクトを削除しました');
  };

  const handleAddPayment = () => {
    if (!selectedProject || !paymentData.amount || !paymentData.description) return;

    createPaymentFromProject(selectedProject.id, {
      date: paymentData.date,
      amount: parseInt(paymentData.amount),
      type: paymentData.type,
      description: paymentData.description,
    });

    toast.success('支払い情報を資金表に追加しました');
    setShowPaymentDialog(false);
    setSelectedProject(null);
    setPaymentData({
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      type: 'revenue',
      description: '',
    });
  };

  const getProjectPayments = (projectId: string) => {
    return fundsEntries.filter(entry => entry.projectId === projectId);
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

    const payments = getProjectPayments(project.id);
    const totalRevenue = payments
      .filter(p => p.type === 'revenue')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalExpense = payments
      .filter(p => p.type !== 'revenue')
      .reduce((sum, p) => sum + p.amount, 0);

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
          {payments.length > 0 && (
            <Link2 size={12} className="text-white/80" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(project);
              setShowPaymentDialog(true);
            }}
            className="hover:bg-white/20 rounded p-0.5"
            title="支払い情報を追加"
          >
            <DollarSign size={12} />
          </button>
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
              if (confirm('このプロジェクトを削除しますか？\n関連する資金表のデータも削除されます。')) {
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

  return (
    <div className="w-full h-full bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">日程（同期版）</h2>
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

      {/* 支払い情報追加ダイアログ */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>支払い情報を追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>プロジェクト</Label>
              <Input
                value={selectedProject?.project_name || ''}
                disabled
              />
            </div>
            <div>
              <Label>日付</Label>
              <Input
                type="date"
                value={paymentData.date}
                onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
              />
            </div>
            <div>
              <Label>種別</Label>
              <Select
                value={paymentData.type}
                onValueChange={(value: 'revenue' | 'expense') => 
                  setPaymentData({ ...paymentData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">収入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>金額</Label>
              <Input
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                placeholder="金額を入力"
              />
            </div>
            <div>
              <Label>摘要</Label>
              <Input
                value={paymentData.description}
                onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                placeholder="支払いの詳細"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPaymentDialog(false);
              setSelectedProject(null);
            }}>
              キャンセル
            </Button>
            <Button onClick={handleAddPayment}>
              資金表に追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

export default ProjectScheduleSync;