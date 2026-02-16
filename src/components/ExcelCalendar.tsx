'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, parseISO, differenceInDays, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Project {
  id: string;
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: '未着工' | '施工中' | '完了' | '保留';
  color: string;
  row: number;
}

const ExcelCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      projectName: 'オフィス改装工事',
      clientName: '株式会社ABC',
      startDate: '2025-09-05',
      endDate: '2025-09-15',
      status: '施工中',
      color: '#3B82F6',
      row: 0,
    },
    {
      id: '2',
      projectName: '店舗内装工事',
      clientName: 'XYZ商店',
      startDate: '2025-09-10',
      endDate: '2025-09-20',
      status: '未着工',
      color: '#10B981',
      row: 1,
    },
    {
      id: '3',
      projectName: 'マンションリノベーション',
      clientName: '田中様',
      startDate: '2025-09-01',
      endDate: '2025-09-08',
      status: '完了',
      color: '#6B7280',
      row: 2,
    },
    {
      id: '4',
      projectName: '住宅リフォーム',
      clientName: '山田様',
      startDate: '2025-09-18',
      endDate: '2025-09-25',
      status: '未着工',
      color: '#EF4444',
      row: 0,
    },
  ]);

  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const maxRows = 5;

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleMouseDown = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    setDraggedProject(project);
    setDraggedElement(e.currentTarget as HTMLElement);
    setIsDragging(true);

    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '0.5';
    element.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggedProject || !calendarRef.current) return;

    const calendarRect = calendarRef.current.getBoundingClientRect();
    const cellWidth = calendarRect.width / monthDays.length;
    const cellHeight = 60;
    
    const relativeX = e.clientX - calendarRect.left;
    const relativeY = e.clientY - calendarRect.top - 50;

    const newDayIndex = Math.floor(relativeX / cellWidth);
    const newRow = Math.floor(relativeY / cellHeight);

    if (newDayIndex >= 0 && newDayIndex < monthDays.length && newRow >= 0 && newRow < maxRows) {
      const projectElement = document.getElementById(`project-${draggedProject.id}`);
      if (projectElement) {
        projectElement.style.transform = `translate(${newDayIndex * cellWidth}px, ${newRow * cellHeight}px)`;
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !draggedProject || !calendarRef.current) return;

    const calendarRect = calendarRef.current.getBoundingClientRect();
    const cellWidth = calendarRect.width / monthDays.length;
    const cellHeight = 60;
    
    const relativeX = e.clientX - calendarRect.left;
    const relativeY = e.clientY - calendarRect.top - 50;

    const newDayIndex = Math.floor(relativeX / cellWidth);
    const newRow = Math.floor(relativeY / cellHeight);

    if (newDayIndex >= 0 && newDayIndex < monthDays.length && newRow >= 0 && newRow < maxRows) {
      const newStartDate = monthDays[newDayIndex];
      const originalStart = parseISO(draggedProject.startDate);
      const originalEnd = parseISO(draggedProject.endDate);
      const duration = differenceInDays(originalEnd, originalStart);
      const newEndDate = addDays(newStartDate, duration);

      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === draggedProject.id
            ? {
                ...p,
                startDate: format(newStartDate, 'yyyy-MM-dd'),
                endDate: format(newEndDate, 'yyyy-MM-dd'),
                row: newRow,
              }
            : p
        )
      );
    }

    if (draggedElement) {
      draggedElement.style.opacity = '1';
      draggedElement.style.cursor = 'grab';
      draggedElement.style.transform = '';
    }

    setDraggedProject(null);
    setDraggedElement(null);
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, draggedProject]);

  const getProjectsForCell = (dayIndex: number, row: number) => {
    const day = monthDays[dayIndex];
    return projects.filter(project => {
      const projectStart = parseISO(project.startDate);
      const projectEnd = parseISO(project.endDate);
      return project.row === row && isSameDay(projectStart, day);
    });
  };

  const calculateProjectWidth = (project: Project) => {
    const projectStart = parseISO(project.startDate);
    const projectEnd = parseISO(project.endDate);
    
    let startIndex = monthDays.findIndex(day => isSameDay(day, projectStart));
    let endIndex = monthDays.findIndex(day => isSameDay(day, projectEnd));
    
    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = monthDays.length - 1;
    
    return endIndex - startIndex + 1;
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case '未着工': return '#10B981';
      case '施工中': return '#3B82F6';
      case '完了': return '#6B7280';
      case '保留': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">工事スケジュール管理</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
          >
            ◀ 前月
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors"
          >
            今日
          </button>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
          >
            翌月 ▶
          </button>
          <span className="ml-4 text-lg font-semibold">
            {format(currentDate, 'yyyy年MM月', { locale: ja })}
          </span>
        </div>
      </div>

      <div className="border-2 border-gray-400 bg-white" style={{ userSelect: 'none' }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${monthDays.length}, 1fr)` }}>
          {monthDays.map((day, index) => {
            const dayOfWeek = getDay(day);
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={index}
                className={`border-r border-b-2 border-gray-400 p-1 text-center font-bold ${
                  isWeekend ? 'bg-gray-100' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-100' : ''}`}
                style={{ minHeight: '50px' }}
              >
                <div className="text-sm">{format(day, 'd')}</div>
                <div className={`text-xs ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
                  {weekDays[dayOfWeek]}
                </div>
              </div>
            );
          })}
        </div>

        <div ref={calendarRef} className="relative" style={{ minHeight: `${maxRows * 60}px` }}>
          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid" style={{ gridTemplateColumns: `repeat(${monthDays.length}, 1fr)`, height: '60px' }}>
              {monthDays.map((day, dayIndex) => {
                const dayOfWeek = getDay(day);
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isToday = isSameDay(day, new Date());
                const cellProjects = getProjectsForCell(dayIndex, rowIndex);

                return (
                  <div
                    key={dayIndex}
                    className={`border-r border-b border-gray-300 relative ${
                      isWeekend ? 'bg-gray-50' : 'bg-white'
                    } ${isToday ? 'bg-blue-50' : ''}`}
                    style={{ height: '60px' }}
                  >
                    {cellProjects.map(project => {
                      const width = calculateProjectWidth(project);
                      return (
                        <div
                          key={project.id}
                          id={`project-${project.id}`}
                          className="absolute top-1 left-1 px-2 py-1 text-white text-xs font-medium rounded cursor-grab shadow-md hover:shadow-lg transition-shadow"
                          style={{
                            backgroundColor: project.color,
                            width: `calc(${width * 100}% - 8px)`,
                            height: 'calc(100% - 8px)',
                            zIndex: isDragging && draggedProject?.id === project.id ? 1000 : 10,
                            transition: isDragging && draggedProject?.id === project.id ? 'none' : 'all 0.2s',
                          }}
                          onMouseDown={(e) => handleMouseDown(e, project)}
                          title={`${project.projectName} - ${project.clientName}\n期間: ${project.startDate} ～ ${project.endDate}`}
                        >
                          <div className="truncate font-bold">{project.projectName}</div>
                          <div className="truncate text-[10px] opacity-90">{project.clientName}</div>
                          <div className="text-[10px] opacity-80 mt-1">
                            {format(parseISO(project.startDate), 'M/d')} - {format(parseISO(project.endDate), 'M/d')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
          <span>未着工</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
          <span>施工中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B7280' }}></div>
          <span>完了</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
          <span>保留</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          💡 ヒント: プロジェクトをドラッグして日付や行を変更できます
        </p>
      </div>
    </div>
  );
};

export default ExcelCalendar;