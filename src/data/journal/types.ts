import { ConversationData } from '../../types/memoria';

export interface JournalEntry {
    id: string
    date: string // YYYY-MM-DD
    title: string // A面：経営者が共感するタイトル
    summary: string // 一言でわかる概要
    conversation: string // 会話内容（ Markdown形式）

    // Auto-generated English Conversation
    conversationData?: ConversationData

    // Auto-generated English Summary
    englishSummary?: EnglishSummary

    // タグ（2層構造）
    businessTags: string[] // A面：経営者向けタグ
    techTags: string[] // B面：技術タグ

    // メタデータ
    readTime: number // 読了時間（分）
    featured?: boolean // 注目記事
    pinned?: boolean // 固定記事（常にトップ表示）
    heroImage?: string // ヒーロー画像（記事ごとに異なる日常写真）
    videoId?: string // Cloudflare Stream動画ID（ヒーロー動画として埋め込み）

    // 技術詳細（オプション）
    metrics?: {
        performanceBefore?: string
        performanceAfter?: string
        costBefore?: string
        costAfter?: string
        timeSpent?: string
    }
    codeExamples?: Array<{
        language: string
        filename?: string
        code: string
        explanation: string
    }>
    failedAttempts?: string[] // 失敗した試み
    unsolvedIssues?: string[] // 未解決の課題
    relatedIssues?: string[]
    externalLinks?: Array<{ title: string; url: string }>
}

export interface EnglishSummary {
    title: string              // 英語タイトル
    sections: SummarySection[] // セクション分割された要約
    readTime: number           // 読了時間（分）
}

export interface SummarySection {
    heading: string            // セクション見出し
    paragraphs: string[]       // 段落のリスト
    image?: string             // セクションの画像（オプション）
}
