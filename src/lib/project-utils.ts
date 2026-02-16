import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'

export interface Project {
  id: string
  project_name: string
  created_at: string
  customer_name?: string
  receivable_amount?: number
  [key: string]: any
}

export interface GroupedProjects {
  month: string
  projects: Project[]
}

/**
 * 案件を月ごとにグループ化し、新しい順に並べ替える
 * @param projects 案件の配列
 * @returns 月ごとにグループ化された案件
 */
export function groupProjectsByMonth(projects: Project[]): GroupedProjects[] {
  // 作成日の新しい順にソート
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA // 新しい順
  })

  // 月ごとにグループ化
  const grouped = sortedProjects.reduce((acc, project) => {
    const monthKey = format(parseISO(project.created_at), 'yyyy年MM月', { locale: ja })

    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(project)

    return acc
  }, {} as Record<string, Project[]>)

  // 配列形式に変換し、月の新しい順にソート
  return Object.entries(grouped)
    .map(([month, projects]) => ({ month, projects }))
    .sort((a, b) => {
      // 月の文字列から日付を作成して比較
      const dateA = new Date(a.month.replace('年', '-').replace('月', '-01'))
      const dateB = new Date(b.month.replace('年', '-').replace('月', '-01'))
      return dateB.getTime() - dateA.getTime()
    })
}

/**
 * 案件を取得し、月ごとにグループ化して返す
 * @param supabase Supabaseクライアント
 * @returns グループ化された案件データ
 */
export async function fetchGroupedProjects(supabase: any) {
  const { data: projectsData, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return groupProjectsByMonth(projectsData || [])
}