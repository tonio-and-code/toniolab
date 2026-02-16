// Project Portal Template System
// Reusable structure for client-facing project pages

export interface ProjectScheduleItem {
  date: string       // e.g., "2/10"
  day: string        // e.g., "Tue"
  task: string       // English description
  taskJa?: string    // Japanese description
  status: 'upcoming' | 'today' | 'complete' | '休'
  floor?: string
  note?: string
  milestone?: string
}

export interface CostItem {
  name: string
  nameJa?: string
  amount: number
  note?: string
}

export interface CostCategory {
  category: string
  categoryJa?: string
  items: CostItem[]
  subtotal: number
}

export interface ProjectFAQ {
  q: string
  qJa?: string
  a: string
  aJa?: string
}

export interface ProjectData {
  // Basic Info
  id: string
  clientName: string
  clientNameJa?: string
  location: string
  locationJa?: string

  // Dates
  startDate: string  // YYYY-MM-DD
  endDate: string
  totalDays: number

  // Scope
  scope: string
  scopeJa?: string
  totalArea: string

  // Financial
  totalBeforeTax: number
  taxRate: number
  totalWithTax: number

  // Schedule
  schedule: ProjectScheduleItem[]

  // Costs
  costBreakdown: CostCategory[]

  // FAQ
  faq: ProjectFAQ[]

  // Contact
  projectManager: {
    name: string
    nameJa?: string
    title?: string
    phone: string
    email: string
  }

  // Meta
  language: 'en' | 'ja' | 'both'
  createdAt: string
  updatedAt: string
}

// Default FAQ for renovation projects (English)
export const DEFAULT_FAQ_EN: ProjectFAQ[] = [
  {
    q: 'Can I stay home during the work?',
    a: 'Yes, this is a "live-in" renovation. We will work floor by floor to minimize disruption. We recommend staying out of the active work area each day.'
  },
  {
    q: 'Do I need to move furniture?',
    a: 'Yes, please move furniture away from walls before we begin each area. We will provide a schedule so you know which rooms to prepare.'
  },
  {
    q: 'What about dust and smell?',
    a: 'We use thorough protective covering (養生) and clean daily. Modern wallpaper adhesive has minimal odor, but we recommend ventilating.'
  },
  {
    q: 'What if there is a problem with the wall underneath?',
    a: 'Minor damage is included in our estimate. If we discover major issues (water damage, mold), we will consult with you before proceeding.'
  },
  {
    q: 'How do I pay?',
    a: 'Invoice will be issued after completion. Payment is due within 30 days via bank transfer.'
  },
  {
    q: 'What is your warranty?',
    a: 'We provide a 1-year warranty on workmanship. If any issues arise due to our work, we will repair at no charge.'
  },
]

// Default FAQ for renovation projects (Japanese)
export const DEFAULT_FAQ_JA: ProjectFAQ[] = [
  {
    q: '工事中は家にいないといけませんか？',
    a: '基本的にはいなくても大丈夫です。鍵をお預かりするか、キーボックスを使用します。ただし、工事開始時と終了時の立ち会いをお願いしています。'
  },
  {
    q: '家具は動かす必要がありますか？',
    a: '壁紙工事の場合、壁際の家具は移動が必要です。軽いものは当社で移動できますが、大型家具やピアノなどは事前に移動をお願いしています。'
  },
  {
    q: 'ホコリや臭いは大丈夫ですか？',
    a: '徹底した養生と毎日の清掃を行います。最近の壁紙用接着剤は臭いが少ないですが、換気をおすすめします。'
  },
  {
    q: '下地に問題があった場合は？',
    a: '軽微な補修は見積もりに含まれています。重大な問題（水漏れ、カビ等）が見つかった場合は、追加工事について相談させていただきます。'
  },
  {
    q: '支払い方法は？',
    a: '工事完了後、請求書をお送りします。銀行振込（30日以内）が基本です。'
  },
]

// Helper: Calculate progress percentage
export function calculateProgress(schedule: ProjectScheduleItem[]): number {
  const workDays = schedule.filter(s => s.status !== '休')
  const completed = workDays.filter(s => s.status === 'complete')
  return Math.round((completed.length / workDays.length) * 100)
}

// Helper: Get current status
export function getProjectStatus(startDate: string, endDate: string): 'upcoming' | 'in-progress' | 'completed' {
  const today = new Date().toISOString().split('T')[0]
  if (today < startDate) return 'upcoming'
  if (today > endDate) return 'completed'
  return 'in-progress'
}

// Helper: Days until start
export function daysUntilStart(startDate: string): number {
  const today = new Date()
  const start = new Date(startDate)
  const diff = start.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Helper: Format currency
export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString()}`
}

// Template: Generate schedule from start date and tasks
export function generateSchedule(
  startDate: string,
  tasks: Array<{ task: string; floor: string; note?: string; milestone?: string }>,
  restDays: string[] = ['Sun'] // Default: Sundays off
): ProjectScheduleItem[] {
  const schedule: ProjectScheduleItem[] = []
  const start = new Date(startDate)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  let taskIndex = 0
  let currentDate = new Date(start)

  while (taskIndex < tasks.length) {
    const dayName = dayNames[currentDate.getDay()]
    const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`

    if (restDays.includes(dayName)) {
      schedule.push({
        date: dateStr,
        day: dayName,
        task: 'Site closed',
        status: '休',
        floor: '-'
      })
    } else {
      const task = tasks[taskIndex]
      schedule.push({
        date: dateStr,
        day: dayName,
        task: task.task,
        status: 'upcoming',
        floor: task.floor,
        note: task.note,
        milestone: task.milestone
      })
      taskIndex++
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return schedule
}
