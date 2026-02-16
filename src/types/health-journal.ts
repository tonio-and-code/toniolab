/**
 * Health Journal - トレーナーへの健康報告を英語学習コンテンツに変換
 */

export interface HealthJournalEntry {
    id: string;
    date: string; // ISO date format
    title: string;

    // 日本語の報告内容
    food?: string;        // 食事の報告
    body?: string;        // 体調の報告
    exercise?: string;    // 運動の報告
    sleep?: string;       // 睡眠の報告
    notes?: string;       // その他メモ

    // 英語翻訳
    englishTranslation?: EnglishTranslation;

    // AI健康アドバイス
    healthInsights?: HealthInsights;

    createdAt: Date;
    updatedAt: Date;
}

export interface EnglishTranslation {
    // 各セクションの英語版
    food?: string;
    body?: string;
    exercise?: string;
    sleep?: string;
    notes?: string;

    // 全体をまとめた会話形式
    conversation?: DialogueLine[];

    // 語彙ピックアップ
    vocabulary?: VocabularyItem[];

    generatedAt: Date;
}

export interface DialogueLine {
    speaker: 'trainer' | 'you';
    text: string;
    japanese?: string; // 日本語訳（オプション）
}

export interface VocabularyItem {
    word: string;
    meaning: string;
    type: 'word' | 'phrasal verb' | 'idiom' | 'slang' | 'collocation' | 'expression';
    example?: string;
    healthContext?: string; // 健康関連での使い方
}

export interface HealthInsights {
    // AIがリサーチした健康情報
    tips: HealthTip[];
    warnings?: string[];      // 注意点
    encouragement?: string;   // 励ましの言葉

    generatedAt: Date;
}

export interface HealthTip {
    category: 'nutrition' | 'exercise' | 'sleep' | 'mental' | 'general';
    titleJa: string;
    titleEn: string;
    contentJa: string;
    contentEn: string;
    source?: string; // 情報源
}

// 入力フォーム用
export interface HealthJournalInput {
    food?: string;
    body?: string;
    exercise?: string;
    sleep?: string;
    notes?: string;
}
