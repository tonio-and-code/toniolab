/**
 * Fitness Report - トレーナーへの報告を英語学習に活用
 */

export interface FitnessReport {
    id: string;
    date: string; // ISO date format
    japaneseReport: string; // 日本語の自由記述報告
    conversation?: FitnessConversation; // Takumi & Anya会話
    healthInfo?: HealthInfo; // AIが調べた健康情報
    createdAt: Date;
    updatedAt: Date;
}

export interface FitnessConversation {
    english: DialogueLine[];
    japanese: DialogueLine[];
    generatedAt: Date;
}

export interface DialogueLine {
    speaker: 'male' | 'female'; // male=Takumi, female=Anya (trainer)
    text: string;
}

export interface HealthInfo {
    topic: string; // e.g., "タンパク質の重要性"
    englishTopic: string; // "The Importance of Protein"
    summary: string; // 短い説明（日本語）
    englishSummary: string; // 短い説明（英語）
    tips: string[]; // アドバイス（日本語）
    englishTips: string[]; // アドバイス（英語）
    researchedAt: Date;
}
