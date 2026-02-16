/**
 * リファクタリング後の使用例
 *
 * 【変更前】
 * - コンポーネント内でSupabaseクエリを直接実行
 * - ローディング状態を個別管理
 * - エラーハンドリングが不統一
 * - 日付フォーマットが重複
 *
 * 【変更後】
 * - useProjects フックで全てのロジックを統合
 * - formatters で共通フォーマット処理
 * - コンポーネントはUIに専念
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProjects } from '@/hooks/useProjects'
import { formatDate, formatCurrencyPlain } from '@/lib/formatters'
import { Loader2, Plus, Trash2 } from 'lucide-react'

export default function ProjectListExample() {
  const {
    projects,
    loading,
    error,
    deleteProject,
  } = useProjects()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        エラーが発生しました: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">プロジェクト一覧</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.project_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    取引先: {project.receivable_customer?.customer_name || '未設定'}
                  </p>
                </div>
                <Badge variant={project.status === '完了' ? 'default' : 'secondary'}>
                  {project.status || '未設定'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.receivable_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">売掛金額:</span>
                    <span className="font-medium">
                      ¥{formatCurrencyPlain(project.receivable_amount)}
                    </span>
                  </div>
                )}
                {project.receivable_payment_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">入金予定日:</span>
                    <span>{formatDate(project.receivable_payment_date)}</span>
                  </div>
                )}
                {project.transaction_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">取引日:</span>
                    <span>{formatDate(project.transaction_date)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('本当に削除しますか？')) {
                      deleteProject(project.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          プロジェクトがありません
        </div>
      )}
    </div>
  )
}

/**
 * 使用方法の比較
 *
 * === 変更前（散在したロジック）===
 *
 * const [projects, setProjects] = useState([])
 * const [loading, setLoading] = useState(true)
 * const supabase = createClient()
 *
 * useEffect(() => {
 *   const fetchData = async () => {
 *     try {
 *       const { data, error } = await supabase
 *         .from('projects')
 *         .select(`
 *           *,
 *           receivable_customer:customers!receivable_customer_id (
 *             customer_name
 *           )
 *         `)
 *         .order('created_at', { ascending: false })
 *
 *       if (error) throw error
 *       setProjects(data)
 *     } catch {
 *       alert('エラーが発生しました')
 *     } finally {
 *       setLoading(false)
 *     }
 *   }
 *   fetchData()
 * }, [])
 *
 * // 日付フォーマットが重複
 * {format(parseISO(project.receivable_payment_date), 'yyyy-MM-dd')}
 *
 *
 * === 変更後（統合されたロジック）===
 *
 * const { projects, loading, error, deleteProject } = useProjects()
 *
 * // 日付フォーマットは共通関数
 * {formatDate(project.receivable_payment_date)}
 *
 *
 * === メリット ===
 * 1. コード量が50%削減
 * 2. 重複が排除され、メンテナンス性向上
 * 3. エラーハンドリングが統一（toast表示）
 * 4. 型安全性が向上
 * 5. テストが容易（ロジックとUIが分離）
 */