import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface DevLogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  mood: string
  duration: string
  content: string
}

const DEV_LOG_DIR = path.join(process.cwd(), 'src/content/dev-log')

/**
 * 全ての開発ログ記事を取得（日付降順）
 */
export function getAllDevLogs(): DevLogPost[] {
  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(DEV_LOG_DIR)) {
    return []
  }

  const files = fs.readdirSync(DEV_LOG_DIR)
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(DEV_LOG_DIR, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      return {
        slug: data.slug || file.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.date || '',
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        mood: data.mood || '🤔',
        duration: data.duration || '',
        content,
      } as DevLogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

/**
 * 特定のslugの記事を取得
 */
export function getDevLogBySlug(slug: string): DevLogPost | null {
  const filePath = path.join(DEV_LOG_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    slug: data.slug || slug,
    title: data.title || 'Untitled',
    date: data.date || '',
    tags: data.tags || [],
    excerpt: data.excerpt || '',
    mood: data.mood || '🤔',
    duration: data.duration || '',
    content,
  }
}

/**
 * タグで記事をフィルタリング
 */
export function getDevLogsByTag(tag: string): DevLogPost[] {
  return getAllDevLogs().filter((post) => post.tags.includes(tag))
}

/**
 * 全てのタグを取得（重複なし）
 */
export function getAllTags(): string[] {
  const allPosts = getAllDevLogs()
  const tags = new Set<string>()

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort()
}
