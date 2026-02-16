/**
 * Cooking Journal Types
 * 料理ジャーナル - シェフメンターとの対話で料理英語を学ぶ
 */

// 入力データの型
export interface CookingJournalInput {
    dishName: string;           // 料理名
    dishNameEn?: string;        // 料理名（英語）
    ingredients: string;        // 使った材料
    process: string;            // 調理手順・やったこと
    tasteRating: number;        // 味の評価 (1-5)
    presentationRating: number; // 見た目の評価 (1-5)
    difficultyRating: number;   // 難易度 (1-5)
    notes?: string;             // メモ・感想
}

// 会話の1行
export interface ConversationLine {
    speaker: 'chef' | 'you';
    text: string;
    japanese: string;
}

// 調理語彙
export interface CookingVocabulary {
    word: string;
    meaning: string;
    type: 'verb' | 'noun' | 'adjective' | 'phrase' | 'measurement';
    example: string;
    category: 'technique' | 'ingredient' | 'texture' | 'taste' | 'equipment' | 'measurement';
    culturalNote?: string;  // 文化的な補足説明
}

// 料理文化Tips
export interface CulturalCookingTip {
    titleJa: string;
    titleEn: string;
    contentJa: string;
    contentEn: string;
    category: 'technique' | 'ingredient' | 'culture' | 'equipment' | 'safety';
}

// 英語翻訳セクション
export interface CookingEnglishTranslation {
    conversation: ConversationLine[];
    vocabulary: CookingVocabulary[];
    generatedAt: Date | string;
}

// 料理Insights
export interface CookingInsights {
    tips: CulturalCookingTip[];
    improvements: string[];      // 次回への改善提案
    encouragement: string;       // 励ましのメッセージ
    generatedAt: Date | string;
}

// 完全なエントリー
export interface CookingJournalEntry {
    id: string;
    date: string;
    title: string;
    dishName: string;
    dishNameEn?: string;
    ingredients: string;
    process: string;
    tasteRating: number;
    presentationRating: number;
    difficultyRating: number;
    notes?: string;
    englishTranslation?: CookingEnglishTranslation;
    cookingInsights?: CookingInsights;
    createdAt: Date | string;
    updatedAt: Date | string;
}
