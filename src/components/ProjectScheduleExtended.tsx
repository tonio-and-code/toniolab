'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, parseISO, addDays, isWithinInterval, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ExternalLink, Filter, Check, Trash2, Edit2, X, Save, Maximize2, ChevronDown, ChevronUp, Palette, AlertCircle, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PayableInfo {
  date: string;
  customerName: string;
  amount: number;
}

interface Project {
  id: string;
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
  color: string;
  notes?: string;
  receivablePaymentDate?: string; // 入金予定日
  receivableAmount?: number; // 入金金額
  payables?: PayableInfo[]; // 支払情報（日付、支払先、金額）
  order?: number; // 表示順序
  hideAfterPayment?: boolean; // 入出金完了後に非表示
  isLocal?: boolean; // ローカルで作成されたバーかどうか
}

const statusColors: Record<string, string> = {
  '施工前': '#94a3b8',
  '売上前': '#3b82f6',
  '入出金待': '#eab308',
  '完了': '#10b981',
  '施工後': '#06b6d4', // 追加のステータス（必要に応じて）
};

const localBarColors = [
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f43f5e', // Rose
  '#6366f1', // Indigo
];

// メモの色オプション（業務種類別）
const memoColorOptions = [
  { name: '施工', bgClass: 'bg-blue-100' },
  { name: '予定', bgClass: 'bg-green-100' },
  { name: '事務処理', bgClass: 'bg-yellow-100' },
  { name: 'その他', bgClass: 'bg-gray-100' },
];

export default function ProjectScheduleExtended() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | '施工前' | '売上前' | '入出金待' | '完了'>('all');
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [editingLocalProject, setEditingLocalProject] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [weekColumnWidth, setWeekColumnWidth] = useState(180); // 週表示の施工案件列の幅
  const [monthColumnWidth, setMonthColumnWidth] = useState(120); // 月表示の施工案件列の幅
  const [isResizingColumn, setIsResizingColumn] = useState(false);

  // ドラッグ状態
  const [dragging, setDragging] = useState(false);
  const [dragProject, setDragProject] = useState<Project | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
  const [previewDates, setPreviewDates] = useState<{ start: string; end: string } | null>(null);
  const [resizing, setResizing] = useState<'start' | 'end' | null>(null);
  
  // 案件の順番変更用
  const [draggingProject, setDraggingProject] = useState<Project | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // メモ管理（TODO含む全ての行で使用）
  const [memos, setMemos] = useState<{[key: string]: string}>({});
  const [editingCell, setEditingCell] = useState<{row: string, date: string} | null>(null);
  const [expandedCell, setExpandedCell] = useState<{row: string, date: string} | null>(null);
  const [memoDialog, setMemoDialog] = useState<{row: string, date: string, memo: string, isEditing: boolean} | null>(null);
  
  // メモの色管理（キー: memoKey, 値: 色のクラス名）
  const [memoColors, setMemoColors] = useState<{[key: string]: string}>({});
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, memoKey: string} | null>(null);

  // 重要事項管理
  const [importantNotice, setImportantNotice] = useState('');
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [noticeInput, setNoticeInput] = useState('');
  const [showNoticePopup, setShowNoticePopup] = useState(false);

  // 入出金行の表示/非表示管理
  const [expandedPaymentRows, setExpandedPaymentRows] = useState<Set<string>>(new Set());

  // 入出金待案件の表示/非表示
  const [showCompletedPayments, setShowCompletedPayments] = useState(false);

  // チュートリアル管理
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // データベースからメモを読み込む
  const loadMemosFromDB = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('calendar_memos')
        .select('*');

      if (error) throw error;

      if (data) {
        const memosObj: Record<string, string> = {};
        const colorsObj: Record<string, string> = {};

        data.forEach((memo: any) => {
          memosObj[memo.memo_key] = memo.memo_value;
          colorsObj[memo.memo_key] = memo.color;
        });

        setMemos(memosObj);
        setMemoColors(colorsObj);
      }
    } catch {
      toast.error('メモの読み込みに失敗しました');
    }
  };

  // データベースにメモを保存
  const saveMemoToDB = async (memoKey: string, memoValue: string, memoColor: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('calendar_memos')
        .upsert({
          memo_key: memoKey,
          memo_value: memoValue,
          color: memoColor
        }, { onConflict: 'memo_key' });

      if (error) throw error;
    } catch {
      toast.error('メモの保存に失敗しました');
    }
  };

  // データベースからメモを削除
  const deleteMemoFromDB = async (memoKey: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('calendar_memos')
        .delete()
        .eq('memo_key', memoKey);

      if (error) throw error;
    } catch {
      toast.error('メモの削除に失敗しました');
    }
  };

  // 表示モード（月/週）
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  // 表示形式（テーブル/グリッド）
  const [displayFormat, setDisplayFormat] = useState<'table' | 'grid'>('grid');

  // 表示モードに応じた列幅
  const columnWidth = viewMode === 'week' ? weekColumnWidth : monthColumnWidth;

  // バックアップ機能
  const [isBackingUp, setIsBackingUp] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // バックアップ関数
  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const tables = [
        'projects',
        'customers',
        'craftsmen',
        'quotations',
        'invoices',
        'project_payables',
        'craftsman_schedules',
        'calendar_memos',
        'calendar_important_notes',
      ];

      const backup: any = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {},
      };

      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('*');
          if (error) {
            backup.data[table] = { error: error.message, count: 0, records: [] };
          } else {
            backup.data[table] = { count: data?.length || 0, records: data || [] };
          }
        } catch (err) {
          backup.data[table] = { error: String(err), count: 0, records: [] };
        }
      }

      const filename = `backup_${new Date().toISOString().split('T')[0]}.json`;
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      const totalRecords = Object.values(backup.data).reduce(
        (sum: number, table: any) => sum + (table.count || 0),
        0
      );
      toast.success(`バックアップ完了: ${totalRecords}件のレコードをエクスポートしました`);
    } catch (error) {
      toast.error(`バックアップエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  // 重要事項をDBから取得
  const fetchImportantNotice = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_important_notes')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return;
      }

      if (data) {
        setImportantNotice(data.content);
        setNoticeInput(data.content);
        // 起動時にポップアップ表示（内容がある場合のみ）
        if (data.content.trim()) {
          setShowNoticePopup(true);
        } else {
          // 重要事項がない場合、チュートリアルを直接表示
          const hasSeenTutorial = localStorage.getItem('calendar_tutorial_seen');
          if (!hasSeenTutorial) {
            setTimeout(() => setShowTutorial(true), 1000);
          }
        }
      } else {
        // データがない場合もチュートリアルを表示
        const hasSeenTutorial = localStorage.getItem('calendar_tutorial_seen');
        if (!hasSeenTutorial) {
          setTimeout(() => setShowTutorial(true), 1000);
        }
      }
    } catch {
      // Ignore fetch errors
    }
  };

  // 重要事項を保存
  const handleSaveNotice = async () => {
    try {
      // 既存のレコードを削除して新規作成（常に1件のみ保持）
      await supabase.from('calendar_important_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const { error } = await supabase
        .from('calendar_important_notes')
        .insert({ content: noticeInput });

      if (error) {
        toast.error('重要事項の保存に失敗しました');
        return;
      }

      setImportantNotice(noticeInput);
      setShowNoticeDialog(false);
      toast.success('重要事項を保存しました');
    } catch {
      toast.error('重要事項の保存に失敗しました');
    }
  };

  // 重要事項を削除
  const handleDeleteNotice = async () => {
    try {
      const { error } = await supabase
        .from('calendar_important_notes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // 全件削除

      if (error) {
        toast.error('重要事項の削除に失敗しました');
        return;
      }

      setImportantNotice('');
      setNoticeInput('');
      setShowNoticeDialog(false);
      toast.success('重要事項を削除しました');
    } catch {
      toast.error('重要事項の削除に失敗しました');
    }
  };

  // メモの色を変更（DBにも保存）
  const handleChangeMemoColor = async (memoKey: string, colorClass: string) => {
    const newColors = { ...memoColors, [memoKey]: colorClass };
    setMemoColors(newColors);
    localStorage.setItem('calendar_memo_colors', JSON.stringify(newColors));
    setContextMenu(null);
    
    // データベースに色を保存（メモが存在する場合のみ）
    try {
      // まず既存のメモを確認
      const { data: existingMemo } = await supabase
        .from('calendar_memos')
        .select('*')
        .eq('memo_key', memoKey)
        .single();
      
      if (existingMemo) {
        // 既存のメモがある場合は色を更新
        await supabase
          .from('calendar_memos')
          .update({ color: colorClass })
          .eq('memo_key', memoKey);
      }
    } catch {
      // Ignore memo color save errors
    }
  };

  // データベースからメモを取得
  const fetchMemos = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_memos')
        .select('*');
      
      if (error) {
        // エラー時はLocalStorageから読み込む
        const savedMemos = localStorage.getItem('calendar_memos');
        if (savedMemos) {
          setMemos(JSON.parse(savedMemos));
        }
        return;
      }
      
      // DBから取得したメモと色をオブジェクトに変換
      const memosObject: {[key: string]: string} = {};
      const colorsObject: {[key: string]: string} = {};
      data?.forEach(memo => {
        memosObject[memo.memo_key] = memo.memo_value;
        if (memo.color) {
          colorsObject[memo.memo_key] = memo.color;
        }
      });
      setMemos(memosObject);
      setMemoColors(colorsObject);
    } catch {
      // エラー時はLocalStorageから読み込む
      const savedMemos = localStorage.getItem('calendar_memos');
      if (savedMemos) {
        setMemos(JSON.parse(savedMemos));
      }
    }
  };

  // データベースからプロジェクトを取得
  useEffect(() => {
    fetchProjects();
    fetchMemos(); // メモをDBから取得
    fetchImportantNotice(); // 重要事項をDBから取得

    // LocalStorageからローカルプロジェクトを読み込む
    const savedLocalProjects = localStorage.getItem('calendar_local_projects');
    if (savedLocalProjects) {
      setLocalProjects(JSON.parse(savedLocalProjects));
    }
    // LocalStorageから表示順序を読み込む
    const savedOrder = localStorage.getItem('project_display_order');
    if (savedOrder) {
      const orderMap = JSON.parse(savedOrder);
      setProjects(prev => {
        return prev.map(p => ({
          ...p,
          order: orderMap[p.id] || 999
        })).sort((a, b) => (a.order || 999) - (b.order || 999));
      });
    }

    // メモの色を読み込み
    const savedColors = localStorage.getItem('calendar_memo_colors');
    if (savedColors) {
      try {
        setMemoColors(JSON.parse(savedColors));
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, []);

  const fetchProjects = async () => {
    try {
      // まずシンプルなクエリで取得（日付カラムが存在しない可能性があるのでcreated_atでソート）
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) {
        toast.error(`プロジェクトの取得に失敗しました: ${projectsError.message}`);
        return;
      }

      // 顧客情報を別途取得
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, customer_name');

      const customerMap = new Map();
      if (customersData) {
        customersData.forEach(c => customerMap.set(c.id, c.customer_name));
      }

      // 買掛情報を取得（顧客情報も含む）
      const { data: payablesData, error: payablesError } = await supabase
        .from('project_payables')
        .select(`
          *,
          payable_customer:customers!project_payables_payable_customer_id_fkey(
            id,
            customer_name
          )
        `);

      const payablesByProject = new Map();
      if (payablesData) {
        payablesData.forEach(p => {
          if (!payablesByProject.has(p.project_id)) {
            payablesByProject.set(p.project_id, []);
          }
          payablesByProject.get(p.project_id).push(p);
        });
      }

      if (projectsData) {
        // ローカルストレージから保存された日付を読み込む
        const savedDates = JSON.parse(localStorage.getItem('project_dates') || '{}');
        
        const mappedProjects: Project[] = projectsData.map((p, index) => {
          // ローカルストレージ優先、次にDB、なければデフォルト日付
          const saved = savedDates[p.id];
          const today = new Date();
          const defaultStartDate = format(addDays(today, index * 7), 'yyyy-MM-dd');
          const defaultEndDate = format(addDays(today, index * 7 + 5), 'yyyy-MM-dd');
          
          // DBに開始日・終了日があればそれを使用
          let startDate = saved?.startDate || p.start_date || p.construction_start_date || defaultStartDate;
          let endDate = saved?.endDate || p.end_date || p.construction_end_date || defaultEndDate;
          
          // 日付の妥当性チェック
          if (startDate > endDate) {
            endDate = format(addDays(parseISO(startDate), 5), 'yyyy-MM-dd');
          }
          
          // 買掛情報を整形
          const projectPayables = payablesByProject.get(p.id) || [];
          const payablesInfo = projectPayables
            .filter((payable: any) => payable.payment_scheduled_date)
            .map((payable: any) => ({
              date: payable.payment_scheduled_date,
              customerName: payable.payable_customer?.customer_name || '支払先未設定',
              amount: payable.payable_amount || 0
            }));

          return {
            id: p.id,
            projectName: p.project_name || '未設定',
            clientName: customerMap.get(p.receivable_customer_id) || '顧客未設定',
            startDate,
            endDate,
            status: p.status || '施工前',
            color: statusColors[p.status] || '#94a3b8',
            notes: p.description || '',
            receivablePaymentDate: p.receivable_payment_date || null,
            receivableAmount: p.receivable_amount || 0,
            payables: payablesInfo,
            order: 999, // デフォルトの表示順
            hideAfterPayment: p.hide_after_payment || false,
          };
        });
        
        // LocalStorageから表示順序を読み込んで適用
        const savedOrder = localStorage.getItem('project_display_order');
        if (savedOrder) {
          const orderMap = JSON.parse(savedOrder);
          mappedProjects.forEach((p, index) => {
            // 既存の順序がある場合はそれを使用、新規案件は-1（最上部）
            p.order = orderMap[p.id] !== undefined ? orderMap[p.id] : -1;
          });
        } else {
          // 初回はデフォルトの順番を設定（新しいものが上）
          mappedProjects.forEach((p, index) => {
            p.order = index;
          });
        }
        
        // ステータス優先順位でソート（施工前→売上前→入出金待→完了）
        const statusOrder: { [key: string]: number } = { '施工前': 0, '売上前': 1, '入出金待': 2, '完了': 3, '施工後': 4 };
        mappedProjects.sort((a, b) => {
          // まずステータスでソート
          const statusA = statusOrder[a.status] ?? 999;
          const statusB = statusOrder[b.status] ?? 999;
          if (statusA !== statusB) {
            return statusA - statusB;
          }
          // 同じステータスの場合はorder順（-1の新規案件が最上部）
          return (a.order || 999) - (b.order || 999);
        });
        setProjects(mappedProjects);
      }
    } catch {
      toast.error('プロジェクトの取得中にエラーが発生しました');
    }
  };

  // 表示期間の計算（月表示 or 週表示）
  const monthStart = viewMode === 'month'
    ? startOfMonth(currentDate)
    : startOfWeek(currentWeekStart, { weekStartsOn: 1 }); // 月曜始まり
  const monthEnd = viewMode === 'month'
    ? endOfMonth(currentDate)
    : endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];

  // グリッド表示用：月の最初の週の前に空白セルを追加して、1日が正しい曜日列に配置されるようにする
  const getCalendarGridDays = () => {
    if (viewMode !== 'month') {
      return monthDays; // 週表示の場合はそのまま
    }

    const firstDay = startOfMonth(currentDate);
    const firstDayOfWeek = getDay(firstDay); // 0=日曜, 1=月曜, ..., 6=土曜

    // 月曜始まりなので、日曜(0)なら6日前、月曜(1)なら0日前、火曜(2)なら1日前...
    const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // 月の最初の週の前に前月の日付を追加
    const calendarStart = addDays(firstDay, -daysToAdd);

    // 月の最後の日の後に次月の日付を追加して、7の倍数にする
    const lastDay = endOfMonth(currentDate);
    const lastDayOfWeek = getDay(lastDay);
    const daysToAddAtEnd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    const calendarEnd = addDays(lastDay, daysToAddAtEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const calendarGridDays = getCalendarGridDays();

  // グリッド表示用：その日に含まれるプロジェクトを取得
  const getProjectsForDateGrid = (dateStr: string) => {
    return [...localProjects, ...projects].filter(p => {
      // 入出金待ちの非表示設定チェック
      if (!showCompletedPayments && p.status === '入出金待' && p.hideAfterPayment) return false;

      // ステータスフィルタチェック（ローカルバーは常に表示）
      if (statusFilter !== 'all' && !p.isLocal && p.status !== statusFilter) return false;

      // この日付がプロジェクト期間に含まれるかチェック
      try {
        const projectStart = parseISO(p.startDate);
        const projectEnd = parseISO(p.endDate);
        const targetDate = parseISO(dateStr);

        return isWithinInterval(targetDate, { start: projectStart, end: projectEnd });
      } catch {
        return false;
      }
    });
  };

  // ドラッグ開始
  const handleDragStart = (e: React.MouseEvent, project: Project, isResize?: 'start' | 'end') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isResize) {
      setResizing(isResize);
      setDragProject(project);
      setDragStartX(e.clientX);
      setPreviewDates({ start: project.startDate, end: project.endDate });
    } else {
      setDragging(true);
      setDragProject(project);
      setDragStartX(e.clientX);
      const cellWidth = 35; // セル幅（ボーダー込み）
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickDayIndex = Math.floor(clickX / cellWidth);
      const projectStart = parseISO(project.startDate);
      setDragStartDate(addDays(projectStart, clickDayIndex));
      setPreviewDates({ start: project.startDate, end: project.endDate });
    }
  };

  // ドラッグ処理
  useEffect(() => {
    if ((!dragging && !resizing) || !dragProject) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
      const cellWidth = 35; // セル幅（ボーダー込み）
      const daysDelta = Math.round(deltaX / cellWidth);
      
      if (resizing) {
        // リサイズ処理
        const originalStart = parseISO(dragProject.startDate);
        const originalEnd = parseISO(dragProject.endDate);
        
        if (resizing === 'start') {
          const newStart = addDays(originalStart, daysDelta);
          if (newStart <= originalEnd) {
            setPreviewDates({
              start: format(newStart, 'yyyy-MM-dd'),
              end: dragProject.endDate
            });
          }
        } else {
          const newEnd = addDays(originalEnd, daysDelta);
          if (newEnd >= originalStart) {
            setPreviewDates({
              start: dragProject.startDate,
              end: format(newEnd, 'yyyy-MM-dd')
            });
          }
        }
      } else if (dragging) {
        // 移動処理
        const originalStart = parseISO(dragProject.startDate);
        const originalEnd = parseISO(dragProject.endDate);
        const duration = Math.round((originalEnd.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24));
        
        const newStart = addDays(originalStart, daysDelta);
        const newEnd = addDays(newStart, duration);
        
        setPreviewDates({
          start: format(newStart, 'yyyy-MM-dd'),
          end: format(newEnd, 'yyyy-MM-dd')
        });
      }
    };

    const handleMouseUp = () => {
      if (previewDates && dragProject) {
        // ローカル状態を更新
        setProjects(prev => prev.map(p => 
          p.id === dragProject.id 
            ? { ...p, startDate: previewDates.start, endDate: previewDates.end }
            : p
        ));
        
        // ローカルストレージに保存
        const projectDates = JSON.parse(localStorage.getItem('project_dates') || '{}');
        projectDates[dragProject.id] = { 
          startDate: previewDates.start, 
          endDate: previewDates.end 
        };
        localStorage.setItem('project_dates', JSON.stringify(projectDates));
        
        toast.success('工事日程を更新しました');
      }
      
      setDragging(false);
      setResizing(null);
      setDragProject(null);
      setDragStartDate(null);
      setPreviewDates(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, dragProject, dragStartX, previewDates]);

  // プロジェクトバーを描画（ローカルプロジェクトのみ）
  const renderProjectBar = (project: Project) => {
    // ローカルプロジェクトのみバーを表示
    if (!project.isLocal) return null;
    if (!project.startDate || !project.endDate) return null;
    
    const isBeingDragged = dragging && dragProject?.id === project.id;
    const dates = isBeingDragged && previewDates 
      ? { startDate: previewDates.start, endDate: previewDates.end }
      : { startDate: project.startDate, endDate: project.endDate };
    
    if (!dates.startDate || !dates.endDate) return null;
    
    const projectStart = parseISO(dates.startDate);
    const projectEnd = parseISO(dates.endDate);
    
    // 表示範囲内か確認
    if (projectEnd < monthStart || projectStart > monthEnd) {
      return null;
    }
    
    // バーの位置を計算
    let startCol = 0;
    let endCol = monthDays.length - 1;
    
    monthDays.forEach((day, index) => {
      if (isSameDay(day, projectStart)) startCol = index;
      if (isSameDay(day, projectEnd)) endCol = index;
    });
    
    // 月をまたぐ場合の調整
    if (projectStart < monthStart) startCol = 0;
    if (projectEnd > monthEnd) endCol = monthDays.length - 1;
    
    const colSpan = endCol - startCol + 1;
    
    const cellWidth = 35; // セル幅（ボーダー込み）
    const barWidth = colSpan * cellWidth - 8; // マージン分を引く
    
    return (
      <td
        colSpan={colSpan}
        className="relative p-0 h-8"
        style={{ minWidth: `${colSpan * cellWidth}px`, maxWidth: `${colSpan * cellWidth}px` }}
      >
        <div
          className="absolute flex items-center justify-between text-white text-xs rounded group"
          style={{
            backgroundColor: project.color,
            opacity: isBeingDragged ? 0.7 : 1,
            zIndex: isBeingDragged ? 10 : 1,
            left: '4px',
            right: '4px',
            top: '4px',
            bottom: '4px',
            width: `${barWidth}px`,
          }}
        >
          {/* 左端リサイズハンドル */}
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/20"
            onMouseDown={(e) => handleDragStart(e, project, 'start')}
          />
          
          {/* メインドラッグエリア */}
          <div
            className="flex-1 px-2 py-1 cursor-move overflow-hidden"
            onMouseDown={(e) => handleDragStart(e, project)}
            onClick={(e) => {
              if (!dragging && !resizing) {
                e.stopPropagation();
                setEditingProject(project);
                setShowProjectDialog(true);
              }
            }}
          >
            <span className="truncate block">{project.projectName}</span>
          </div>
          
          {/* 右端リサイズハンドル */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/20"
            onMouseDown={(e) => handleDragStart(e, project, 'end')}
          />
        </div>
      </td>
    );
  };

  // 空のセルを描画
  const renderEmptyCells = (project: Project, startCol: number) => {
    const cells = [];
    for (let i = 0; i < startCol; i++) {
      const cellDay = monthDays[i];
      const isToday = cellDay && isSameDay(cellDay, new Date());
      cells.push(
        <td
          key={`empty-${project.id}-${i}`}
          className={isToday ? 'border border-gray-300 bg-green-100/30' : 'border border-gray-300'}
        />
      );
    }
    return cells;
  };

  // プロジェクト行を計算
  const getProjectStartCol = (project: Project) => {
    if (!project.startDate) return -1;
    
    const isBeingDragged = dragging && dragProject?.id === project.id;
    const startDate = isBeingDragged && previewDates ? previewDates.start : project.startDate;
    
    if (!startDate) return -1;
    
    const projectStart = parseISO(startDate);
    
    let startCol = -1;
    monthDays.forEach((day, index) => {
      if (isSameDay(day, projectStart)) startCol = index;
    });
    
    if (projectStart < monthStart) startCol = 0;
    if (projectStart > monthEnd) startCol = monthDays.length;
    
    return startCol;
  };

  // メモ保存処理（Supabase連携）
  const handleSaveMemo = async (key: string, value: string) => {
    // まず即座にUIを更新
    const newMemos = { ...memos, [key]: value };
    setMemos(newMemos);
    setEditingCell(null);
    
    // メモの現在の色を取得（なければデフォルト）
    const currentColor = memoColors[key] || 'bg-blue-100';
    
    // バックグラウンドでDBに保存
    try {
      // upsert（存在すれば更新、なければ作成）
      const { error } = await supabase
        .from('calendar_memos')
        .upsert({ 
          memo_key: key, 
          memo_value: value,
          color: currentColor
        }, {
          onConflict: 'memo_key'
        });
      
      if (error) {
        toast.error('メモの保存に失敗しました（ローカルには保存されています）');
      }
    } catch {
      // Ignore save errors - local state is already updated
    }
  };

  // メモ削除処理（Supabase連携）
  const handleDeleteMemo = async (key: string) => {
    // まず即座にUIを更新
    const newMemos = { ...memos };
    delete newMemos[key];
    setMemos(newMemos);
    setEditingCell(null);
    
    // バックグラウンドでDBから削除
    try {
      const { error } = await supabase
        .from('calendar_memos')
        .delete()
        .eq('memo_key', key);
      
      if (error) {
        toast.error('メモの削除に失敗しました（ローカルからは削除されています）');
      }
    } catch {
      // Ignore delete errors - local state is already updated
    }
  };

  // プロジェクト保存（ローカルストレージのみ）
  const handleSaveProject = (formData: any) => {
    if (editingProject) {
      // ローカル状態を更新
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id 
          ? { 
              ...p, 
              projectName: formData.projectName,
              startDate: formData.startDate,
              endDate: formData.endDate,
              status: formData.status,
              notes: formData.notes,
              color: statusColors[formData.status] || '#94a3b8',
            }
          : p
      ));
      
      // ローカルストレージに保存
      const projectDates = JSON.parse(localStorage.getItem('project_dates') || '{}');
      projectDates[editingProject.id] = { 
        startDate: formData.startDate, 
        endDate: formData.endDate 
      };
      localStorage.setItem('project_dates', JSON.stringify(projectDates));
      
      toast.success('プロジェクトを更新しました');
    }
    setShowProjectDialog(false);
    setEditingProject(null);
  };

  // 入出金完了処理
  const handleCompletePayment = async (projectId: string) => {
    try {
      // ステータスを「完了」に更新
      const { error } = await supabase
        .from('projects')
        .update({ status: '完了' })
        .eq('id', projectId);

      if (error) {
        toast.error('更新に失敗しました');
        return;
      }

      // ローカル状態から削除（カレンダーから非表示）
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('入出金完了として記録しました');
    } catch {
      toast.error('処理中にエラーが発生しました');
    }
  };

  // ローカルプロジェクトの保存
  useEffect(() => {
    if (localProjects.length > 0 || localStorage.getItem('calendar_local_projects')) {
      localStorage.setItem('calendar_local_projects', JSON.stringify(localProjects));
    }
  }, [localProjects]);

  // ローカルプロジェクトの追加
  const addLocalProject = () => {
    const newProject: Project = {
      id: `local_${Date.now()}`,
      projectName: `新規スケジュール${localProjects.length + 1}`,
      clientName: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      status: 'local',
      color: localBarColors[localProjects.length % localBarColors.length],
      order: -1, // 最上部に表示
      isLocal: true,
    };
    setLocalProjects([...localProjects, newProject]);
    toast.success('新しいスケジュールバーを追加しました');
  };

  // ローカルプロジェクトの削除
  const deleteLocalProject = (id: string) => {
    setLocalProjects(prev => prev.filter(p => p.id !== id));
    toast.success('スケジュールバーを削除しました');
  };

  // ローカルプロジェクト名の編集開始
  const startEditingLocalName = (project: Project) => {
    setEditingLocalProject(project.id);
    setEditingName(project.projectName);
  };

  // ローカルプロジェクト名の保存
  const saveLocalName = () => {
    if (editingLocalProject) {
      setLocalProjects(prev => prev.map(p => 
        p.id === editingLocalProject ? { ...p, projectName: editingName } : p
      ));
      setEditingLocalProject(null);
      setEditingName('');
    }
  };

  // 列幅のリサイズ処理
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  useEffect(() => {
    if (!isResizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(80, Math.min(400, startWidth + deltaX));
      if (viewMode === 'week') {
        setWeekColumnWidth(newWidth);
      } else {
        setMonthColumnWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingColumn(false);
      // LocalStorageに保存（表示モード別）
      if (viewMode === 'week') {
        localStorage.setItem('calendar_week_column_width', weekColumnWidth.toString());
      } else {
        localStorage.setItem('calendar_month_column_width', monthColumnWidth.toString());
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingColumn, startX, startWidth, weekColumnWidth, monthColumnWidth, viewMode]);

  // 保存された列幅を読み込む
  useEffect(() => {
    const savedWeekWidth = localStorage.getItem('calendar_week_column_width');
    const savedMonthWidth = localStorage.getItem('calendar_month_column_width');
    if (savedWeekWidth) {
      setWeekColumnWidth(parseInt(savedWeekWidth));
    }
    if (savedMonthWidth) {
      setMonthColumnWidth(parseInt(savedMonthWidth));
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="bg-white border-b p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 月/週切り替え */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
                className="rounded-none"
              >
                月
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setViewMode('week');
                  setCurrentWeekStart(currentDate);
                }}
                className="rounded-none"
              >
                週
              </Button>
            </div>

            {/* 案件/カレンダー切り替え */}
            <div className="flex border rounded-lg overflow-hidden" data-tutorial="view-toggle">
              <Button
                variant={displayFormat === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayFormat('table')}
                className="rounded-none text-xs px-3"
              >
                案件
              </Button>
              <Button
                variant={displayFormat === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayFormat('grid')}
                className="rounded-none text-xs px-3"
              >
                カレンダー
              </Button>
            </div>

            {/* ナビゲーション */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (viewMode === 'month') {
                  setCurrentDate(prev => subMonths(prev, 1));
                } else {
                  setCurrentWeekStart(prev => subWeeks(prev, 1));
                }
              }}
            >
              <ChevronLeft />
            </Button>
            <h2 className="text-xl font-bold min-w-[200px] text-center">
              {viewMode === 'month'
                ? format(currentDate, 'yyyy年MM月', { locale: ja })
                : `${format(monthStart, 'M/d')} - ${format(monthEnd, 'M/d')}`
              }
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (viewMode === 'month') {
                  setCurrentDate(prev => addMonths(prev, 1));
                } else {
                  setCurrentWeekStart(prev => addWeeks(prev, 1));
                }
              }}
            >
              <ChevronRight />
            </Button>
          </div>
          
          {/* フィルターとアクション */}
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="ステータス絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての案件</SelectItem>
                <SelectItem value="施工前">施工前</SelectItem>
                <SelectItem value="売上前">売上前</SelectItem>
                <SelectItem value="入出金待">入出金待</SelectItem>
                <SelectItem value="完了">完了</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showCompletedPayments ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompletedPayments(!showCompletedPayments)}
              className={showCompletedPayments ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              <Check className="h-4 w-4 mr-1" />
              {showCompletedPayments ? '入出金待非表示' : '入出金待表示'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackup}
              disabled={isBackingUp}
              className="bg-green-50 hover:bg-green-100 border-green-300"
            >
              <Download className="h-4 w-4 mr-1" />
              {isBackingUp ? 'バックアップ中...' : 'バックアップ'}
            </Button>
            <Button
              variant={importantNotice ? "destructive" : "outline"}
              size="sm"
              onClick={() => {
                setNoticeInput(importantNotice);
                setShowNoticeDialog(true);
              }}
              className="gap-2"
              data-tutorial="important-notice"
            >
              <AlertCircle className="h-4 w-4" />
              {importantNotice ? '重要事項' : '重要事項'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              PDF出力
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowTutorial(true);
                setTutorialStep(0);
              }}
              className="text-xs"
            >
              使い方
            </Button>
          </div>
        </div>
      </div>

      {/* カレンダー */}
      <div className="flex-1 overflow-auto p-4" style={{ minHeight: 0 }}>
        {/* テーブル表示 */}
        {displayFormat === 'table' && (
        <table className="border-collapse bg-white w-full" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th 
                className="border border-gray-300 bg-gray-100 p-1 text-xs font-medium relative"
                style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px`, maxWidth: `${columnWidth}px` }}
              >
                施工案件
                <div
                  className="absolute right-0 top-0 bottom-0 w-2 hover:bg-blue-500 cursor-col-resize"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setStartX(e.clientX);
                    setStartWidth(columnWidth);
                    setIsResizingColumn(true);
                  }}
                  style={{ backgroundColor: isResizingColumn ? '#3b82f6' : 'transparent' }}
                />
              </th>
              {monthDays.map((day, index) => {
                const isToday = isSameDay(day, new Date());
                const dayOfWeek = getDay(day); // 0=日曜, 1=月曜, ..., 6=土曜
                const isSaturday = dayOfWeek === 6;
                const isSunday = dayOfWeek === 0;
                // weekDays配列は月曜始まりなので、getDay()の値を調整
                const weekDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 日曜(0)→6, 月曜(1)→0, ...

                return (
                  <th
                    key={index}
                    className={`border border-gray-300 text-center text-xs p-1 ${
                      isToday ? 'bg-green-100' :
                      isSunday ? 'bg-red-50 text-red-600' :
                      isSaturday ? 'bg-blue-50 text-blue-600' :
                      'bg-gray-50'
                    }`}
                  >
                    <div className={isToday ? 'font-bold text-green-700' : ''}>{format(day, 'd')}</div>
                    <div className={`text-[10px] ${isToday ? 'font-bold text-green-700' : ''}`}>
                      {weekDays[weekDayIndex]}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* TODO行 */}
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-yellow-50" style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px`, maxWidth: `${columnWidth}px`, height: '48px' }}>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="font-medium">ToDo</span>
                </div>
              </td>
              {monthDays.map((day, index) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const memoKey = `todo_${dateStr}`;
                const memo = memos[memoKey];
                const isEditing = editingCell?.row === 'todo' && editingCell?.date === dateStr;
                const isToday = isSameDay(day, new Date());

                return (
                  <td
                    key={index}
                    className={`border border-gray-300 relative transition-colors cursor-pointer ${
                      isToday ? 'bg-green-100' : 'bg-yellow-50/50 hover:bg-yellow-100/50'
                    }`}
                    style={{ height: '56px', minHeight: '56px' }}
                    onClick={() => setMemoDialog({ row: 'todo', date: dateStr, memo: memo || '', isEditing: true })}
                  >
                    {memo && (
                      <div className="p-0.5 text-[10px] break-words overflow-hidden">
                        <div
                          className={`${memoColors[memoKey] || 'bg-yellow-100'} rounded px-1 py-0.5 line-clamp-3`}
                          style={{
                            cursor: 'pointer',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextMenu({ x: e.clientX, y: e.clientY, memoKey });
                          }}
                        >
                          {memo.length > 50 ? memo.substring(0, 50) + '...' : memo}
                        </div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
            
            {/* プロジェクト行（DBとローカル両方） */}
            {[...localProjects, ...projects]
              .filter(p => {
                // 完了案件はカレンダーに表示しない
                if (p.status === '完了') return false;
                // ローカルプロジェクトはフィルター対象外
                if (p.isLocal) return true;
                // ステータスフィルター
                if (statusFilter === 'all') return true;
                return p.status === statusFilter;
              })
              .filter((project) => {
                // 入出金待案件をフィルター（showCompletedPaymentsがfalseの場合）
                if (!showCompletedPayments && project.status === '入出金待') {
                  return false;
                }
                return true;
              })
              .sort((a, b) => {
                // ローカルプロジェクトを最上部に
                if (a.isLocal && !b.isLocal) return -1;
                if (!a.isLocal && b.isLocal) return 1;
                // ステータス順
                const statusOrder: { [key: string]: number } = { '施工前': 0, '売上前': 1, '入出金待': 2, '完了': 3, '施工後': 4 };
                const statusA = statusOrder[a.status] ?? 999;
                const statusB = statusOrder[b.status] ?? 999;
                if (statusA !== statusB) return statusA - statusB;
                return (a.order || 999) - (b.order || 999);
              })
              .map((project, projectIndex) => {
              const startCol = getProjectStartCol(project);
              return (
                <React.Fragment key={project.id}>
                  {/* 施工期間の行 */}
                  <tr
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (draggingProject && draggingProject.id !== project.id) {
                        setDragOverIndex(projectIndex);
                      }
                    }}
                    onDragLeave={() => {
                      setDragOverIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggingProject && draggingProject.id !== project.id) {
                        // 同じステータス内でのみ順番を入れ替え可能
                        if (draggingProject.status !== project.status) {
                          toast.error('異なるステータス間での順番変更はできません');
                          setDraggingProject(null);
                          setDragOverIndex(null);
                          return;
                        }
                        
                        // 順番を入れ替え
                        const newProjects = [...projects];
                        const draggedIndex = projects.findIndex(p => p.id === draggingProject.id);
                        
                        // ドラッグしたプロジェクトを取り出す
                        const [draggedProject] = newProjects.splice(draggedIndex, 1);
                        
                        // 新しい位置に挿入（ドロップ位置に正確に挿入）
                        newProjects.splice(projectIndex, 0, draggedProject);
                        
                        // 順番を更新
                        newProjects.forEach((p, idx) => {
                          p.order = idx;
                        });

                        // ステータスでソートし直す
                        const statusOrder: { [key: string]: number } = { '施工前': 0, '売上前': 1, '入出金待': 2, '完了': 3, '施工後': 4 };
                        newProjects.sort((a, b) => {
                          const statusA = statusOrder[a.status] ?? 999;
                          const statusB = statusOrder[b.status] ?? 999;
                          if (statusA !== statusB) {
                            return statusA - statusB;
                          }
                          return (a.order || 999) - (b.order || 999);
                        });
                        
                        setProjects(newProjects);
                        
                        // LocalStorageに保存（ステータスグループ内での順序を保持）
                        const orderMap: {[key: string]: number} = {};
                        let orderCounter = 0;
                        ['施工前', '売上前', '入出金待', '完了', '施工後'].forEach(status => {
                          newProjects
                            .filter(p => p.status === status)
                            .forEach((p, idx) => {
                              orderMap[p.id] = orderCounter++;
                            });
                        });
                        localStorage.setItem('project_display_order', JSON.stringify(orderMap));
                        
                        setDraggingProject(null);
                        setDragOverIndex(null);
                      }
                    }}
                    className={`${
                      dragOverIndex === projectIndex ? 'border-t-4 border-t-blue-500' : ''
                    } ${
                      draggingProject?.id === project.id ? 'opacity-30' : ''
                    }`}
                  >
                    <td className="border border-gray-300 p-1 text-xs" style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px`, maxWidth: `${columnWidth}px` }}>
                      <div className="flex flex-col gap-0.5">
                        {/* 上段: 案件名 */}
                        <div className="flex items-center gap-1 min-w-0">
                          <div
                            className="cursor-move hover:bg-blue-100 p-0.5 rounded flex-shrink-0"
                            title="ドラッグして順番を変更"
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              e.dataTransfer.effectAllowed = 'move';
                              setDraggingProject(project);
                            }}
                            onDragEnd={() => {
                              setDraggingProject(null);
                              setDragOverIndex(null);
                            }}
                          >
                            ⋮⋮
                          </div>
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        {/* ローカルプロジェクトの場合は編集可能 */}
                        {project.isLocal ? (
                          editingLocalProject === project.id ? (
                            <div className="flex items-center gap-1 flex-1">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveLocalName();
                                  if (e.key === 'Escape') setEditingLocalProject(null);
                                }}
                                className="text-xs px-1 py-0.5 border rounded flex-1"
                                autoFocus
                              />
                              <button onClick={saveLocalName} className="p-0.5">
                                <Save className="w-3 h-3 text-green-600" />
                              </button>
                              <button onClick={() => setEditingLocalProject(null)} className="p-0.5">
                                <X className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 flex-1">
                              <span 
                                className="truncate text-xs flex-1 cursor-pointer hover:text-blue-600"
                                onClick={() => startEditingLocalName(project)}
                              >
                                {project.projectName}
                              </span>
                              <button 
                                onClick={() => startEditingLocalName(project)}
                                className="p-0.5"
                              >
                                <Edit2 className="w-3 h-3 text-gray-600" />
                              </button>
                              <button 
                                onClick={() => deleteLocalProject(project.id)}
                                className="p-0.5"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          )
                        ) : (
                          <button
                            onClick={() => router.push(`/dashboard/projects?id=${project.id}`)}
                            className="hover:underline hover:text-blue-600 transition-colors truncate flex-1 min-w-0 text-left"
                            title={`${project.projectName} - 案件管理で詳細を見る`}
                          >
                            <span className="truncate text-xs block">{project.projectName}</span>
                          </button>
                        )}
                        </div>

                        {/* 下段: ステータス・アイコン */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {/* ステータスバッジ */}
                          <span className={`inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium flex-shrink-0 ${
                            project.status === '施工前' ? 'bg-gray-100 text-gray-700' :
                            project.status === '売上前' ? 'bg-blue-100 text-blue-700' :
                            project.status === '入出金待' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {project.status}
                          </span>

                          {/* 入出金完了ボタン */}
                          {project.status === '入出金待' && (
                            <button
                              onClick={() => handleCompletePayment(project.id)}
                              className="text-green-600 hover:text-green-700 flex-shrink-0"
                              title="入出金完了後、カレンダーから削除"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}

                          {/* 入出金トグル */}
                          {(project.receivablePaymentDate || (project.payables && project.payables.length > 0)) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newExpandedRows = new Set(expandedPaymentRows);
                                if (newExpandedRows.has(project.id)) {
                                  newExpandedRows.delete(project.id);
                                } else {
                                  newExpandedRows.add(project.id);
                                }
                                setExpandedPaymentRows(newExpandedRows);
                              }}
                              className="p-0.5 hover:bg-blue-100 rounded flex-shrink-0"
                              title={expandedPaymentRows.has(project.id) ? '入出金行を隠す' : '入出金行を表示'}
                            >
                              {expandedPaymentRows.has(project.id) ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                          )}

                          {/* 入出金バッジ */}
                          {project.receivablePaymentDate && (
                            <span className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-medium bg-green-100 text-green-700" title={`入金: ${project.receivablePaymentDate}`}>
                              入
                            </span>
                          )}
                          {project.payables && project.payables.length > 0 && (
                            <span className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-medium bg-red-100 text-red-700" title={`支払: ${project.payables.length}件`}>
                              出{project.payables.length > 1 ? project.payables.length : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* ローカルプロジェクトの場合はバーを表示、DBプロジェクトの場合は通常のセル */}
                    {project.isLocal && startCol >= 0 && startCol < monthDays.length ? (
                      <>
                        {renderEmptyCells(project, startCol)}
                        {renderProjectBar(project)}
                      </>
                    ) : (
                      monthDays.map((day, index) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const memoKey = `${project.id}_construction_${dateStr}`;
                        const memo = memos[memoKey];
                        const isEditing = editingCell?.row === `${project.id}_construction` && editingCell?.date === dateStr;
                        
                        // この日付に入金または支払があるかチェック
                        const hasReceivable = project.receivablePaymentDate === dateStr;
                        const payableOnThisDate = project.payables?.filter(p => p.date === dateStr) || [];
                        const hasPayments = hasReceivable || payableOnThisDate.length > 0;
                        const isToday = isSameDay(day, new Date());

                        return (
                          <td
                            key={index}
                            className={`border border-gray-300 relative transition-colors cursor-pointer ${
                              isToday ? 'bg-green-100/30 hover:bg-green-100/50' : 'hover:bg-gray-50'
                            }`}
                            style={{ height: '40px', minHeight: '40px' }}
                            onClick={() => setMemoDialog({ row: `${project.id}_construction`, date: dateStr, memo: memo || '', isEditing: true })}
                          >
                            {/* 入出金インジケーター */}
                            {hasPayments && (
                              <div className="flex gap-0.5 mb-0.5">
                                {hasReceivable && (
                                  <div className="bg-green-500 rounded text-white text-[8px] px-0.5 py-0.5 text-center">
                                    入
                                  </div>
                                )}
                                {payableOnThisDate.map((_, idx) => (
                                  <div key={idx} className="bg-red-500 rounded text-white text-[8px] px-0.5 py-0.5 text-center">
                                    出
                                  </div>
                                ))}
                              </div>
                            )}
                            {memo && (
                              <div className="p-0.5 text-[10px] break-words overflow-hidden">
                                <div
                                  className={`${memoColors[memoKey] || 'bg-blue-100'} rounded px-1 py-0.5 line-clamp-2`}
                                  style={{
                                    cursor: 'pointer',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setContextMenu({ x: e.clientX, y: e.clientY, memoKey });
                                  }}
                                >
                                  {memo.length > 40 ? memo.substring(0, 40) + '...' : memo}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })
                    )}
                  </tr>
                  
                  {/* 入金予定日の行 */}
                  {project.receivablePaymentDate && expandedPaymentRows.has(project.id) && (
                    <tr key={`${project.id}-receivable`}>
                      <td className="border border-gray-300 p-1 text-xs text-gray-600 pl-8" style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px`, maxWidth: `${columnWidth}px` }}>
                        └ 入金 ({project.clientName})
                      </td>
                      {monthDays.map((day, index) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isPaymentDate = project.receivablePaymentDate === dateStr;
                        const memoKey = `${project.id}_receivable_${dateStr}`;
                        const memo = memos[memoKey];
                        const isEditing = editingCell?.row === `${project.id}_receivable` && editingCell?.date === dateStr;
                        
                        return (
                          <td
                            key={index}
                            className="border border-gray-300 relative hover:bg-green-50 transition-colors cursor-pointer"
                            style={{ height: '40px', minHeight: '40px' }}
                            onClick={() => setMemoDialog({ row: `${project.id}_receivable`, date: dateStr, memo: memo || '', isEditing: true })}
                          >
                            {isPaymentDate && (
                              <div className="bg-green-500 rounded text-white text-[10px] px-1 py-0.5 text-center mb-0.5">
                                入金
                              </div>
                            )}
                            {memo && (
                              <div className="p-0.5 text-[10px] break-words overflow-hidden">
                                <div
                                  className={`${memoColors[memoKey] || 'bg-blue-100'} rounded px-1 py-0.5 line-clamp-2`}
                                  style={{
                                    cursor: 'pointer',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setContextMenu({ x: e.clientX, y: e.clientY, memoKey });
                                  }}
                                >
                                  {memo.length > 40 ? memo.substring(0, 40) + '...' : memo}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}

                  {/* 支払予定日の行（複数） */}
                  {expandedPaymentRows.has(project.id) && project.payables?.map((payable, payableIndex) => (
                    <tr key={`${project.id}-payable-${payableIndex}`}>
                      <td className="border border-gray-300 p-1 text-xs text-gray-600 pl-8" style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px`, maxWidth: `${columnWidth}px` }}>
                        └ 支払 ({payable.customerName})
                      </td>
                      {monthDays.map((day, index) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isPaymentDate = payable.date === dateStr;
                        const memoKey = `${project.id}_payable_${payableIndex}_${dateStr}`;
                        const memo = memos[memoKey];

                        return (
                          <td
                            key={index}
                            className="border border-gray-300 relative hover:bg-red-50 transition-colors cursor-pointer"
                            style={{ height: '40px', minHeight: '40px' }}
                            onClick={() => setMemoDialog({ row: `${project.id}_payable_${payableIndex}`, date: dateStr, memo: memo || '', isEditing: true })}
                          >
                            {isPaymentDate && (
                              <div className="bg-red-500 rounded text-white text-[10px] px-1 py-0.5 text-center mb-0.5">
                                支払
                              </div>
                            )}
                            {memo && (
                              <div className="p-0.5 text-[10px] break-words overflow-hidden">
                                <div
                                  className={`${memoColors[memoKey] || 'bg-blue-100'} rounded px-1 py-0.5 line-clamp-2`}
                                  style={{
                                    cursor: 'pointer',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setContextMenu({ x: e.clientX, y: e.clientY, memoKey });
                                  }}
                                >
                                  {memo.length > 40 ? memo.substring(0, 40) + '...' : memo}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        )}

        {/* グリッド表示（メモ/TODOカレンダー） */}
        {displayFormat === 'grid' && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white h-full flex flex-col">
            <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
              <div className="grid grid-cols-7 bg-gray-200" style={{ fontFamily: '"Noto Sans JP", sans-serif', gridTemplateRows: 'auto repeat(auto-fill, minmax(140px, 1fr))' }}>
                {/* 曜日ヘッダー */}
                {['月', '火', '水', '木', '金', '土', '日'].map((day, index) => {
                  const isSaturday = index === 5; // 土曜
                  const isSunday = index === 6;   // 日曜

                  return (
                    <div
                      key={`header-${index}`}
                      className={`text-center py-1 px-2 text-xs border-r border-b border-gray-200 sticky top-0 z-10 bg-white ${
                        isSaturday ? 'text-blue-600' :
                        isSunday ? 'text-red-600' :
                        'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}

                {/* カレンダーグリッド */}
              {calendarGridDays.map((day, index) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isToday = isSameDay(day, new Date());
                const isPast = day < new Date() && !isToday; // 過去の日付（今日は除く）
                const dayOfWeek = getDay(day); // 0=日曜, 1=月曜, ..., 6=土曜
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isSaturday = dayOfWeek === 6;
                const isSunday = dayOfWeek === 0;

                // この日付に関連する全メモを収集
                const dayMemos: Array<{
                  key: string;
                  text: string;
                  color: string;
                  label: string;
                  row: string;
                  type: 'todo' | 'construction' | 'receivable' | 'payable';
                }> = [];

                // TODOメモ
                const todoKey = `todo_${dateStr}`;
                const todoMemo = memos[todoKey];
                if (todoMemo) {
                  dayMemos.push({
                    key: todoKey,
                    text: todoMemo,
                    color: memoColors[todoKey] || 'bg-yellow-100',
                    label: 'TODO',
                    row: 'todo',
                    type: 'todo'
                  });
                }

                // 案件関連メモ（施工期間、入金、支払）
                [...localProjects, ...projects]
                  .filter(p => {
                    if (!showCompletedPayments && p.status === '入出金待' && p.hideAfterPayment) return false;
                    if (statusFilter !== 'all' && !p.isLocal && p.status !== statusFilter) return false;
                    return true;
                  })
                  .forEach(project => {
                    // 施工期間メモ
                    const constructionKey = `${project.id}_construction_${dateStr}`;
                    const constructionMemo = memos[constructionKey];
                    if (constructionMemo) {
                      dayMemos.push({
                        key: constructionKey,
                        text: constructionMemo,
                        color: memoColors[constructionKey] || 'bg-blue-100',
                        label: project.projectName,
                        row: `${project.id}_construction`,
                        type: 'construction'
                      });
                    }

                    // 入金メモ
                    const receivableKey = `${project.id}_receivable_${dateStr}`;
                    const receivableMemo = memos[receivableKey];
                    if (receivableMemo) {
                      dayMemos.push({
                        key: receivableKey,
                        text: receivableMemo,
                        color: memoColors[receivableKey] || 'bg-blue-100',
                        label: `入金:${project.projectName}`,
                        row: `${project.id}_receivable`,
                        type: 'receivable'
                      });
                    }

                    // 支払メモ
                    project.payables?.forEach((payable, payableIndex) => {
                      const payableKey = `${project.id}_payable_${payableIndex}_${dateStr}`;
                      const payableMemo = memos[payableKey];
                      if (payableMemo) {
                        dayMemos.push({
                          key: payableKey,
                          text: payableMemo,
                          color: memoColors[payableKey] || 'bg-blue-100',
                          label: `支払:${payable.customerName}`,
                          row: `${project.id}_payable_${payableIndex}`,
                          type: 'payable'
                        });
                      }
                    });
                  });

                return (
                  <div
                    key={index}
                    className={`p-2 transition-all relative flex flex-col group ${
                      isToday ? 'bg-white border-2 border-green-400' :
                      !isCurrentMonth ? 'bg-gray-50 border-r border-b border-gray-200' :
                      'bg-white border-r border-b border-gray-200'
                    } ${isPast ? 'opacity-50' : 'opacity-100'}`}
                    style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('bg-blue-50');
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('bg-blue-50');

                      const oldKey = e.dataTransfer.getData('memoKey');
                      const memoText = e.dataTransfer.getData('memoText');
                      const memoRow = e.dataTransfer.getData('memoRow');
                      const memoColor = e.dataTransfer.getData('memoColor');

                      if (!oldKey || !memoText) return;

                      // 新しいキーを生成
                      const newKey = memoRow.includes('todo')
                        ? `todo_${dateStr}`
                        : `${memoRow.split('_')[0]}_${memoRow.split('_')[1]}_${dateStr}`;

                      // 古いメモを削除
                      await deleteMemoFromDB(oldKey);

                      // 新しい場所に保存
                      await saveMemoToDB(newKey, memoText, memoColor || 'bg-yellow-100');

                      // UIを更新
                      const updatedMemos = { ...memos };
                      delete updatedMemos[oldKey];
                      updatedMemos[newKey] = memoText;

                      const updatedColors = { ...memoColors };
                      if (memoColor) {
                        delete updatedColors[oldKey];
                        updatedColors[newKey] = memoColor;
                      }

                      setMemos(updatedMemos);
                      setMemoColors(updatedColors);

                      toast.success('メモを移動しました');
                    }}
                  >
                    {/* 日付表示とTODO追加ボタン */}
                    <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                      <div
                        className={`text-base ${
                          isToday ? 'text-green-700 font-bold' :
                          isSaturday ? 'text-blue-600' :
                          isSunday ? 'text-red-600' :
                          !isCurrentMonth ? 'text-gray-400' :
                          'text-gray-700'
                        }`}
                      >
                        {format(day, 'd')}
                      </div>
                      <button
                        onClick={() => {
                          const todoKey = `todo_${dateStr}`;
                          const existingTodo = memos[todoKey] || '';
                          setMemoDialog({ row: 'todo', date: dateStr, memo: existingTodo, isEditing: false });
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-all text-gray-500 hover:text-white hover:bg-green-500 rounded-full p-1 hover:scale-105"
                        title="TODOを追加"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>

                    {/* メモ一覧（タグ形式で表示） */}
                    <div className="flex-1 overflow-y-auto space-y-1" style={{ minHeight: 0 }}>
                      {dayMemos.map((memo) => (
                        <div
                          key={memo.key}
                          className={`text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 hover:shadow-md transition-all animate-fadeIn ${memo.color} border border-gray-300 shadow-sm`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMemoDialog({ row: memo.row, date: dateStr, memo: memo.text, isEditing: false });
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextMenu({ x: e.clientX, y: e.clientY, memoKey: memo.key });
                          }}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('memoKey', memo.key);
                            e.dataTransfer.setData('memoText', memo.text);
                            e.dataTransfer.setData('memoRow', memo.row);
                            e.dataTransfer.setData('memoColor', memo.color);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                        >
                          <div className="text-[10px] text-gray-600 truncate">
                            {memo.label}
                          </div>
                          <div className="line-clamp-2 break-all">
                            {memo.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* メモ編集ダイアログ */}
      <Dialog open={!!memoDialog} onOpenChange={(open) => !open && setMemoDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{memoDialog?.date}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">種類</Label>
              <div className="flex gap-2">
                {memoColorOptions.map((color) => {
                  const memoKey = `${memoDialog?.row}_${memoDialog?.date}`;
                  const isSelected = memoColors[memoKey] === color.bgClass;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      className={`flex-1 py-2 rounded ${color.bgClass} border-2 ${
                        isSelected ? 'border-gray-800' : 'border-gray-300'
                      } hover:border-gray-600 text-sm transition-colors`}
                      onClick={() => {
                        if (memoDialog) {
                          handleChangeMemoColor(memoKey, color.bgClass);
                        }
                      }}
                    >
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2 block">内容</Label>
              <textarea
                key={memoDialog?.date}
                defaultValue={memoDialog?.memo || ''}
                className="w-full h-64 p-3 text-base border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="メモを入力してください..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    const newMemo = e.currentTarget.value.trim();
                    const memoKey = `${memoDialog?.row}_${memoDialog?.date}`;
                    if (newMemo) {
                      handleSaveMemo(memoKey, newMemo);
                    } else {
                      handleDeleteMemo(memoKey);
                    }
                    setMemoDialog(null);
                  } else if (e.key === 'Escape') {
                    setMemoDialog(null);
                  }
                }}
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (memoDialog && confirm('このメモを削除しますか？')) {
                    const memoKey = `${memoDialog.row}_${memoDialog.date}`;
                    handleDeleteMemo(memoKey);
                    setMemoDialog(null);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                削除
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setMemoDialog(null)}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea && memoDialog) {
                      const newMemo = textarea.value.trim();
                      const memoKey = `${memoDialog.row}_${memoDialog.date}`;
                      if (newMemo) {
                        handleSaveMemo(memoKey, newMemo);
                      } else {
                        handleDeleteMemo(memoKey);
                      }
                      setMemoDialog(null);
                    }
                  }}
                >
                  保存
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* プロジェクト編集ダイアログ */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロジェクト編集</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveProject({
                projectName: formData.get('projectName'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                status: formData.get('status'),
                notes: formData.get('notes'),
              });
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="projectName">プロジェクト名</Label>
              <Input
                id="projectName"
                name="projectName"
                defaultValue={editingProject?.projectName}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">開始日</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={editingProject?.startDate}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">終了日</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={editingProject?.endDate}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">ステータス</Label>
              <Select name="status" defaultValue={editingProject?.status || '未着工'}>
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
              <Label htmlFor="notes">備考</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={editingProject?.notes}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowProjectDialog(false)}>
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 右クリックメニュー（種類選択） */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-300 rounded shadow-lg p-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <div className="flex flex-col gap-1">
            {memoColorOptions.map((color) => (
              <button
                key={color.name}
                className={`px-4 py-2 rounded ${color.bgClass} border border-gray-400 hover:border-gray-800 text-xs font-medium text-left`}
                onClick={() => {
                  handleChangeMemoColor(contextMenu.memoKey, color.bgClass);
                }}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 重要事項編集ダイアログ */}
      <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              重要事項
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {importantNotice && !noticeInput && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <p className="text-gray-800 whitespace-pre-wrap">{importantNotice}</p>
              </div>
            )}
            <div>
              <Label className="text-sm text-gray-600">内容</Label>
              <Textarea
                value={noticeInput}
                onChange={(e) => setNoticeInput(e.target.value)}
                placeholder="重要な連絡事項を入力してください..."
                className="w-full min-h-[200px] mt-2"
              />
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('重要事項を削除しますか？')) {
                  handleDeleteNotice();
                }
              }}
              disabled={!importantNotice}
            >
              <Trash2 size={14} className="mr-1" />
              削除
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setNoticeInput(importantNotice);
                  setShowNoticeDialog(false);
                }}
              >
                キャンセル
              </Button>
              <Button onClick={handleSaveNotice}>
                <Save size={14} className="mr-1" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 重要事項起動時ポップアップ */}
      <Dialog open={showNoticePopup} onOpenChange={setShowNoticePopup}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              重要事項
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-yellow-50 border border-yellow-200 p-4 rounded">
            <p className="text-gray-800 whitespace-pre-wrap">{importantNotice}</p>
          </div>
          <div className="flex justify-end pt-4 border-t flex-shrink-0">
            <Button onClick={() => {
              setShowNoticePopup(false);
              // 重要事項を閉じた後、チュートリアルを表示
              const hasSeenTutorial = localStorage.getItem('calendar_tutorial_seen');
              if (!hasSeenTutorial) {
                setTimeout(() => setShowTutorial(true), 500);
              }
            }}>
              確認しました
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* チュートリアルダイアログ */}
      {showTutorial && (
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">カレンダー機能の使い方</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-md"
                  style={{
                    animation: 'slideInFromLeft 0.5s ease-out',
                    animationDelay: '0s',
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">表示切り替え</h3>
                    <p className="text-sm text-gray-600">「カレンダー」と「案件」ボタンで表示を切り替えられます</p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-md"
                  style={{
                    animation: 'slideInFromLeft 0.5s ease-out',
                    animationDelay: '0.15s',
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">メモの追加</h3>
                    <p className="text-sm text-gray-600">日付セルにマウスを合わせると＋ボタンが表示されます。クリックでTODOメモを追加・編集できます</p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-md"
                  style={{
                    animation: 'slideInFromLeft 0.5s ease-out',
                    animationDelay: '0.3s',
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">4色分類</h3>
                    <p className="text-sm text-gray-600">施工（青）、予定（緑）、事務処理（黄）、その他（灰）で分類できます</p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-md"
                  style={{
                    animation: 'slideInFromLeft 0.5s ease-out',
                    animationDelay: '0.45s',
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">メモの編集</h3>
                    <p className="text-sm text-gray-600">メモカードをクリックで編集、右クリックで色変更できます</p>
                  </div>
                </div>
              </div>

              <div
                className="flex gap-2 pt-4 border-t"
                style={{
                  animation: 'fadeIn 0.5s ease-out',
                  animationDelay: '0.6s',
                  animationFillMode: 'both'
                }}
              >
                <Button
                  variant="outline"
                  className="flex-1 transform transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    localStorage.setItem('calendar_tutorial_seen', 'true');
                    setShowTutorial(false);
                  }}
                >
                  次回から表示しない
                </Button>
                <Button
                  className="flex-1 transform transition-all duration-300 hover:scale-105"
                  onClick={() => setShowTutorial(false)}
                >
                  始める
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* アニメーション用のスタイル */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @media print {
          /* 印刷時はボタンやナビゲーションを非表示 */
          button, .no-print {
            display: none !important;
          }

          /* カレンダーを紙いっぱいに */
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          /* メモの色を印刷 */
          .bg-blue-100, .bg-green-100, .bg-yellow-100, .bg-gray-100,
          .bg-blue-50, .bg-red-50, .bg-white {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          /* 影を印刷 */
          .shadow-sm, .shadow-md {
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
          }
        }
      `}</style>
    </div>
  );
}