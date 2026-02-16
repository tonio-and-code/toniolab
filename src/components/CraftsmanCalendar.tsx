'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, getDaysInMonth, addMonths, subMonths, getDay, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react'
import { toast } from 'sonner'

interface Schedule {
  id?: string
  craftsman_id: string
  schedule_date: string
  status: 'available' | 'busy' | 'morning_only' | 'afternoon_only' | 'support_available'
  memo?: string
  project_name?: string
  visibility?: 'default' | 'public' | 'colleagues' | 'private'
  craftsman_name?: string // 仲間の名前表示用
}

export default function CraftsmanCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [colleagueSchedules, setColleagueSchedules] = useState<Schedule[]>([])
  const [selectedCraftsman, setSelectedCraftsman] = useState<string>('')
  const [craftsmen, setCraftsmen] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const monthKey = format(currentDate, 'yyyy-MM')
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfWeek = getDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))

  // 職人リストを取得
  useEffect(() => {
    fetchCraftsmen()
  }, [])

  // スケジュールを取得
  useEffect(() => {
    if (selectedCraftsman) {
      fetchSchedules()
    }
  }, [currentDate, selectedCraftsman])

  const fetchCraftsmen = async () => {
    try {
      const { data, error } = await supabase
        .from('craftsmen')
        .select('*')
        .order('craftsman_name')

      if (error) throw error
      setCraftsmen(data || [])

      // LocalStorageから最後に選択した職人を復元
      const lastSelected = localStorage.getItem('selected_craftsman_id')
      if (lastSelected && data?.some(c => c.id === lastSelected)) {
        setSelectedCraftsman(lastSelected)
      } else if (data && data.length > 0) {
        setSelectedCraftsman(data[0].id)
      }
    } catch {
      toast.error('職人データの取得に失敗しました')
    }
  }

  const fetchSchedules = async () => {
    if (!selectedCraftsman) return

    setLoading(true)
    try {
      const startDate = format(currentDate, 'yyyy-MM-01')
      const endDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), 'yyyy-MM-dd')

      // 自分のスケジュールを取得
      const { data: mySchedules, error: myError } = await supabase
        .from('craftsman_schedules')
        .select('*')
        .eq('craftsman_id', selectedCraftsman)
        .gte('schedule_date', startDate)
        .lte('schedule_date', endDate)

      if (myError) throw myError
      setSchedules(mySchedules || [])

      // 仲間関係を取得（双方向チェック - 自分がcraftsman_idの場合）
      const { data: relationships1, error: relError1 } = await supabase
        .from('craftsman_relationships')
        .select('colleague_id')
        .eq('craftsman_id', selectedCraftsman)
        .eq('status', 'accepted')

      // 仲間関係を取得（双方向チェック - 自分がcolleague_idの場合）
      const { data: relationships2, error: relError2 } = await supabase
        .from('craftsman_relationships')
        .select('craftsman_id')
        .eq('colleague_id', selectedCraftsman)
        .eq('status', 'accepted')

      const colleagueIds = [
        ...(relationships1 || []).map(r => r.colleague_id),
        ...(relationships2 || []).map(r => r.craftsman_id)
      ]

      if (colleagueIds.length > 0) {

        // 仲間のスケジュールを取得（仲間のみ公開または全体公開）
        const { data: colleagueData, error: colError } = await supabase
          .from('craftsman_schedules')
          .select(`
            *,
            craftsmen!inner(craftsman_name)
          `)
          .in('craftsman_id', colleagueIds)
          .in('visibility', ['public', 'colleagues'])
          .gte('schedule_date', startDate)
          .lte('schedule_date', endDate)

        if (colError) throw colError

        // craftsman_nameを追加
        const colleagueSchedulesWithName = (colleagueData || []).map(schedule => ({
          ...schedule,
          craftsman_name: schedule.craftsmen?.craftsman_name
        }))

        setColleagueSchedules(colleagueSchedulesWithName)
      } else {
        setColleagueSchedules([])
      }
    } catch {
      toast.error('スケジュールの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDayClick = (day: number) => {
    if (!selectedCraftsman) {
      toast.error('職人を選択してください')
      return
    }

    const dateStr = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd')
    const existing = schedules.find(s => s.schedule_date === dateStr)

    setSelectedDay(day)
    setSelectedSchedule(existing || {
      craftsman_id: selectedCraftsman,
      schedule_date: dateStr,
      status: 'available',
      memo: '',
      project_name: '',
      visibility: 'default'
    })
    setDialogOpen(true)
  }

  const handleSaveSchedule = async () => {
    if (!selectedSchedule) return

    setLoading(true)
    try {
      if (selectedSchedule.id) {
        // 更新
        const { error } = await supabase
          .from('craftsman_schedules')
          .update({
            status: selectedSchedule.status,
            memo: selectedSchedule.memo || null,
            project_name: selectedSchedule.project_name || null,
            visibility: selectedSchedule.visibility || 'default',
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedSchedule.id)

        if (error) throw error
      } else {
        // 新規作成
        const { error } = await supabase
          .from('craftsman_schedules')
          .insert({
            craftsman_id: selectedSchedule.craftsman_id,
            schedule_date: selectedSchedule.schedule_date,
            status: selectedSchedule.status,
            memo: selectedSchedule.memo || null,
            project_name: selectedSchedule.project_name || null,
            visibility: selectedSchedule.visibility || 'default'
          })

        if (error) throw error
      }

      toast.success('スケジュールを保存しました')
      fetchSchedules()
      setDialogOpen(false)
    } catch {
      toast.error('スケジュールの保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule?.id) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('craftsman_schedules')
        .delete()
        .eq('id', selectedSchedule.id)

      if (error) throw error

      toast.success('スケジュールを削除しました')
      fetchSchedules()
      setDialogOpen(false)
    } catch {
      toast.error('スケジュールの削除に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'morning_only': return 'bg-yellow-500'
      case 'afternoon_only': return 'bg-yellow-500'
      case 'support_available': return 'bg-blue-500'
      default: return 'bg-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return '空き'
      case 'busy': return '現場'
      case 'morning_only': return '午前のみ'
      case 'afternoon_only': return '午後のみ'
      case 'support_available': return '応援可'
      default: return ''
    }
  }

  const handleCraftsmanChange = (craftsmanId: string) => {
    setSelectedCraftsman(craftsmanId)
    localStorage.setItem('selected_craftsman_id', craftsmanId)
  }

  const monthNavigation = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <Select value={selectedCraftsman} onValueChange={handleCraftsmanChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="職人を選択" />
                </SelectTrigger>
                <SelectContent>
                  {craftsmen.map(craftsman => (
                    <SelectItem key={craftsman.id} value={craftsman.id}>
                      {craftsman.craftsman_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => monthNavigation('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold w-32 text-center">
                {format(currentDate, 'yyyy年M月', { locale: ja })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => monthNavigation('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カレンダー */}
      <Card>
        <CardContent className="p-4">
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm font-semibold p-2 ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* カレンダー本体 */}
          <div className="grid grid-cols-7 gap-1">
            {/* 月初の空白 */}
            {Array.from({ length: firstDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="h-20" />
            ))}

            {/* 日付セル */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const dateStr = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd')
              const schedule = schedules.find(s => s.schedule_date === dateStr)
              const colleagueSchedulesForDay = colleagueSchedules.filter(s => s.schedule_date === dateStr)
              const dayOfWeek = (firstDayOfWeek + index) % 7
              const isHoliday = dayOfWeek === 0 || dayOfWeek === 6
              const isTodayDate = isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`
                    h-20 p-2 border rounded-lg transition-all hover:shadow-md
                    ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                    ${isHoliday ? 'bg-gray-50' : 'bg-white'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  disabled={loading}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-semibold mb-1 ${
                      dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : ''
                    }`}>
                      {day}
                    </div>
                    {schedule && (
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className={`w-full h-6 rounded-full ${getStatusColor(schedule.status)} text-white text-xs flex items-center justify-center`}>
                          {getStatusLabel(schedule.status)}
                        </div>
                        {schedule.project_name && (
                          <div className="text-xs mt-1 truncate w-full text-center text-gray-600">
                            {schedule.project_name}
                          </div>
                        )}
                      </div>
                    )}
                    {colleagueSchedulesForDay.length > 0 && (
                      <div className="flex-1 flex flex-col gap-1 mt-1">
                        {colleagueSchedulesForDay.slice(0, 2).map((colSchedule, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(colSchedule.status)}`} />
                            <span className="text-xs text-gray-500 truncate">
                              {colSchedule.craftsman_name}
                            </span>
                          </div>
                        ))}
                        {colleagueSchedulesForDay.length > 2 && (
                          <span className="text-xs text-gray-400">+{colleagueSchedulesForDay.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* 凡例 */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-sm">空き</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-sm">現場あり</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span className="text-sm">午前/午後のみ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <span className="text-sm">応援可能</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スケジュール編集ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay), 'M月d日(E)', { locale: ja })}のスケジュール
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">状態</label>
              <Select
                value={selectedSchedule?.status || 'available'}
                onValueChange={(value) => setSelectedSchedule(prev => prev ? {...prev, status: value as any} : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">空いている</SelectItem>
                  <SelectItem value="busy">現場あり</SelectItem>
                  <SelectItem value="morning_only">午前のみ</SelectItem>
                  <SelectItem value="afternoon_only">午後のみ</SelectItem>
                  <SelectItem value="support_available">応援可能</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">現場名</label>
              <Input
                value={selectedSchedule?.project_name || ''}
                onChange={(e) => setSelectedSchedule(prev => prev ? {...prev, project_name: e.target.value} : null)}
                placeholder="〇〇邸改修工事"
              />
            </div>

            <div>
              <label className="text-sm font-medium">メモ</label>
              <Textarea
                value={selectedSchedule?.memo || ''}
                onChange={(e) => setSelectedSchedule(prev => prev ? {...prev, memo: e.target.value} : null)}
                placeholder="雨天中止、13時から等"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">公開設定</label>
              <Select
                value={selectedSchedule?.visibility || 'default'}
                onValueChange={(value) => setSelectedSchedule(prev => prev ? {...prev, visibility: value as any} : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">標準</SelectItem>
                  <SelectItem value="public">全体公開</SelectItem>
                  <SelectItem value="colleagues">仲間のみ公開</SelectItem>
                  <SelectItem value="private">非公開</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            {selectedSchedule?.id && (
              <Button
                variant="destructive"
                onClick={handleDeleteSchedule}
                disabled={loading}
              >
                削除
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSaveSchedule}
              disabled={loading}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}