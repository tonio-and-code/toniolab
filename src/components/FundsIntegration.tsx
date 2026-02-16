'use client'

import React from 'react'
import { useFundsManagement } from '@/hooks/useFundsManagement'
import { FundsEntry } from '@/types/funds'

interface FundsIntegrationProps {
  children?: React.ReactNode
}

export const FundsContext = React.createContext<ReturnType<typeof useFundsManagement> | null>(null)

export function FundsIntegrationProvider({ children }: FundsIntegrationProps) {
  const fundsManagement = useFundsManagement({
    initialBalance: 5368791,
  })

  return (
    <FundsContext.Provider value={fundsManagement}>
      {children}
    </FundsContext.Provider>
  )
}

export function useFundsContext() {
  const context = React.useContext(FundsContext)
  if (!context) {
    throw new Error('useFundsContext must be used within FundsIntegrationProvider')
  }
  return context
}

interface CalendarIntegrationProps {
  onEventClick?: (entry: FundsEntry) => void
}

export function FundsCalendarIntegration({ onEventClick }: CalendarIntegrationProps) {
  const { getCalendarEvents, entries } = useFundsContext()
  const events = getCalendarEvents()

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">資金カレンダー連携</h3>
      <div className="grid gap-2">
        {events.map((event) => {
          const entry = entries.find(e => e.id === event.id)
          return (
            <div
              key={event.id}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => entry && onEventClick?.(entry)}
              style={{ borderLeftColor: event.backgroundColor, borderLeftWidth: '4px' }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500">{event.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {new Intl.NumberFormat('ja-JP', {
                      style: 'currency',
                      currency: 'JPY',
                    }).format(event.amount)}
                  </div>
                  <div className="text-xs text-gray-500">{event.category}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function FundsDashboardWidget() {
  const { getDashboardMetrics } = useFundsContext()
  const metrics = getDashboardMetrics()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount)
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">資金ダッシュボード</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">現在の残高</div>
          <div className="text-xl font-bold">{formatCurrency(metrics.currentBalance)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">今月の利益</div>
          <div className="text-xl font-bold">
            <span className={metrics.thisMonthProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(metrics.thisMonthProfit)}
            </span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">今月の売上</div>
          <div className="text-lg font-semibold">{formatCurrency(metrics.thisMonthRevenue)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">今月の支出</div>
          <div className="text-lg font-semibold">{formatCurrency(metrics.thisMonthExpense)}</div>
        </div>
      </div>
    </div>
  )
}

interface ProjectIntegrationProps {
  projectId: string
  projectName: string
}

export function FundsProjectIntegration({ projectId, projectName }: ProjectIntegrationProps) {
  const { getEntriesByProject, addEntry } = useFundsContext()
  const projectEntries = getEntriesByProject(projectId)

  const totalRevenue = projectEntries
    .filter(e => e.type === 'revenue')
    .reduce((sum, e) => sum + e.amount, 0)

  const totalExpense = projectEntries
    .filter(e => e.type === 'expense' || e.type === 'operating_cost')
    .reduce((sum, e) => sum + e.amount, 0)

  const handleAddProjectExpense = () => {
    const amount = prompt('費用金額を入力してください:')
    const description = prompt('説明を入力してください:')
    
    if (amount && description) {
      addEntry({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: '材料費',
        description: `${projectName}: ${description}`,
        amount: Number(amount),
        project_id: projectId,
      })
    }
  }

  const handleAddProjectRevenue = () => {
    const amount = prompt('売上金額を入力してください:')
    const description = prompt('説明を入力してください:')
    
    if (amount && description) {
      addEntry({
        date: new Date().toISOString().split('T')[0],
        type: 'revenue',
        category: '工事売上',
        description: `${projectName}: ${description}`,
        amount: Number(amount),
        project_id: projectId,
      })
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-semibold mb-3">{projectName} - 資金状況</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">売上合計:</span>
          <span className="font-medium text-blue-600">
            {new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            }).format(totalRevenue)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">費用合計:</span>
          <span className="font-medium text-red-600">
            {new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            }).format(totalExpense)}
          </span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-sm font-semibold">利益:</span>
          <span className={`font-bold ${totalRevenue - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            }).format(totalRevenue - totalExpense)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddProjectRevenue}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          売上追加
        </button>
        <button
          onClick={handleAddProjectExpense}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          費用追加
        </button>
      </div>
    </div>
  )
}