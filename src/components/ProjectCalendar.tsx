'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface ProjectItemProps {
  project: Project;
  style: React.CSSProperties;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, style }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...dragStyle }}
      {...attributes}
      {...listeners}
      className={`absolute px-2 py-1 text-xs font-medium rounded cursor-move border ${
        project.status === '完了' ? 'opacity-70' : ''
      }`}
      title={`${project.projectName} - ${project.clientName}`}
    >
      <div className="truncate">{project.projectName}</div>
      <div className="truncate text-[10px] opacity-80">{project.clientName}</div>
    </div>
  );
};

const ProjectCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      projectName: 'オフィス改装工事',
      clientName: '株式会社ABC',
      startDate: '2025-09-05',
      endDate: '2025-09-15',
      status: '施工中',
      color: 'bg-blue-500 text-white border-blue-600',
      row: 0,
    },
    {
      id: '2',
      projectName: '店舗内装工事',
      clientName: 'XYZ商店',
      startDate: '2025-09-10',
      endDate: '2025-09-20',
      status: '未着工',
      color: 'bg-green-500 text-white border-green-600',
      row: 1,
    },
    {
      id: '3',
      projectName: 'マンションリノベーション',
      clientName: '田中様',
      startDate: '2025-09-01',
      endDate: '2025-09-08',
      status: '完了',
      color: 'bg-gray-500 text-white border-gray-600',
      row: 2,
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = getDay(monthStart);
  const emptyDays = Array(startDayOfWeek).fill(null);

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const calculateProjectPosition = (project: Project, day: Date) => {
    const projectStart = parseISO(project.startDate);
    const projectEnd = parseISO(project.endDate);
    
    if (day >= projectStart && day <= projectEnd) {
      return true;
    }
    return false;
  };

  const calculateProjectWidth = (project: Project, day: Date, dayIndex: number) => {
    const projectStart = parseISO(project.startDate);
    const projectEnd = parseISO(project.endDate);
    
    if (isSameDay(day, projectStart)) {
      let daysCount = 1;
      for (let i = dayIndex + 1; i < monthDays.length; i++) {
        if (monthDays[i] <= projectEnd) {
          daysCount++;
        } else {
          break;
        }
      }
      return daysCount;
    }
    return 0;
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">工事スケジュール</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
          >
            前月
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
          >
            今日
          </button>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
          >
            翌月
          </button>
          <span className="ml-4 text-lg font-semibold">
            {format(currentDate, 'yyyy年MM月', { locale: ja })}
          </span>
        </div>
      </div>

      <div className="border border-gray-300 overflow-x-auto">
        <table className="w-full table-fixed" style={{ minWidth: '1200px' }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-xs font-semibold text-center w-24">案件</th>
              {monthDays.map((day, index) => {
                const dayOfWeek = getDay(day);
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isToday = isSameDay(day, new Date());
                return (
                  <th
                    key={index}
                    className={`border border-gray-300 p-1 text-xs font-semibold text-center ${
                      isWeekend ? 'bg-gray-200' : ''
                    } ${isToday ? 'bg-blue-100' : ''}`}
                    style={{ minWidth: '35px' }}
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
          <tbody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={projects}
                strategy={verticalListSortingStrategy}
              >
                {projects.map((project, projectIndex) => (
                  <tr key={project.id} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 p-2 text-xs font-medium bg-gray-50">
                      <div className="truncate">{project.projectName}</div>
                      <div className="truncate text-[10px] text-gray-600">{project.clientName}</div>
                    </td>
                    {monthDays.map((day, dayIndex) => {
                      const dayOfWeek = getDay(day);
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const isToday = isSameDay(day, new Date());
                      const projectStart = parseISO(project.startDate);
                      const isProjectStart = isSameDay(day, projectStart);
                      const daysWidth = isProjectStart ? calculateProjectWidth(project, day, dayIndex) : 0;

                      return (
                        <td
                          key={dayIndex}
                          className={`border-r border-gray-300 relative h-12 ${
                            isWeekend ? 'bg-gray-50' : ''
                          } ${isToday ? 'bg-blue-50' : ''}`}
                        >
                          {isProjectStart && (
                            <ProjectItem
                              project={project}
                              style={{
                                width: `calc(${daysWidth * 100}% + ${(daysWidth - 1) * 1}px)`,
                                zIndex: 10,
                                top: '2px',
                                left: '2px',
                                right: '2px',
                                bottom: '2px',
                                height: 'calc(100% - 4px)',
                                backgroundColor: project.color.split(' ')[0].replace('bg-', '').replace('500', ''),
                              }}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>未着工</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>施工中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>完了</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>保留</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;