/**
 * お知らせデータ（静的データ）
 */

export type NewsItem = {
  id: string
  title: string
  content: string
  category: string
  published_at: string
  thumbnail_url?: string
}

export const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'AI日報システム本格導入開始',
    content: 'イワサキ内装では、職人の日報作成を効率化するAI日報システムの本格導入を開始しました。現場の写真をアップロードするだけで、AIが自動的に作業内容を解析し、日報を作成します。これにより、職人の事務作業時間を大幅に削減し、本来の技術に集中できる環境を整えました。\n\nシステムの主な機能：\n• 写真からの自動作業内容認識\n• 工程管理データとの自動連携\n• 材料使用量の自動計算\n• 品質チェックポイントのAI提案\n\nこのシステムにより、1日あたり平均30分の業務効率化を実現。職人からも「現場に集中できるようになった」と好評です。',
    category: 'DX',
    published_at: '2025-10-20',
    thumbnail_url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'あいおいニッセイ同和損保ビル 共用通路床T/C貼替工事完工',
    content: '千代田区二番町のあいおいニッセイ同和損保ビルにて、共用通路床タイルカーペット貼替工事が無事完工しました。夜間作業での施工となりましたが、予定通り完了いたしました。',
    category: '施工実績',
    published_at: '2025-10-15',
    thumbnail_url: '/images/portfolio/aioi.png'
  },
  {
    id: '8',
    title: '夏季休業のお知らせ',
    content: '誠に勝手ながら、2025年8月13日（水）〜8月16日（土）まで夏季休業とさせていただきます。休業期間中のお問い合わせは、メールにて受け付けております。17日（日）より通常営業いたします。',
    category: 'お知らせ',
    published_at: '2025-08-01',
  },
  {
    id: '9',
    title: 'ゴールデンウィーク休業のお知らせ',
    content: '誠に勝手ながら、2025年4月29日（火）〜5月6日（火）までゴールデンウィーク休業とさせていただきます。休業期間中のお問い合わせは、メールまたはお問い合わせフォームにて受け付けております。7日（水）より通常営業いたします。',
    category: 'お知らせ',
    published_at: '2025-04-15',
  }
]
