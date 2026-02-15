/**
 * Memoria - 日常の体験を英語学習コンテンツに変換するシステム
 */

export interface MemoriaEntry {
    id: string;
    date: string; // ISO date format
    title: string;
    content: string; // 日本語の日記内容
    tags?: string[];
    mood?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm';
    conversation?: ConversationData;
    tone?: string;
    series?: string; // シリーズID (e.g., "ego-trap")
    seriesTitle?: string; // シリーズ名 (e.g., "エゴの罠シリーズ")
    heroImage?: string; // Hero image URL
    createdAt: Date;
    updatedAt: Date;
}

export interface ConversationData {
    english: DialogueLine[];
    japanese: DialogueLine[];
    audioUrl?: string;
    generatedAt?: Date;
    tone?: string;
    duration?: number; // 秒
    vocabulary?: VocabularyItem[]; // 自動抽出された語彙
}

export interface VocabularyItem {
    word: string;           // 単語・フレーズ
    meaning: string;        // 日本語の意味
    type: 'word' | 'phrasal verb' | 'idiom' | 'slang' | 'collocation' | 'expression';
    level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    example?: string;       // 例文（会話からの引用）
    lineIndex?: number;     // どの行に出現するか
}

export interface DialogueLine {
    speaker: 'male' | 'female' | 'ai' | 'human';
    text: string;
    timestamp?: number; // 音声再生用（秒）
}

export type ConversationTone = 'casual' | 'formal' | 'philosophical' | 'humorous' | 'playful' | 'comedic' | 'introspective' | 'cold_analytical' | 'energetic';

export interface ConversationGenerationOptions {
    tone: ConversationTone;
    targetDuration: 'short' | 'medium' | 'long'; // 1-2分, 3-5分, 5-10分
    includeJapanese: boolean;
}
