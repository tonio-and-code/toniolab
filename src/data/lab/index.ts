/**
 * Lab（非公開）記事データ
 */

import { JournalEntry } from '../journal/types';

// 既存のジャーナルエントリをインポート
import { coldWaterSurrenderEntry } from '../journal/2026/cold-water-surrender-entry';
import { criticalThinkingHiroyukiEntry } from '../journal/2026/critical-thinking-hiroyuki-entry';
import { teasingAiEntry } from '../journal/2026/teasing-ai-entry';

// lab用のエントリをexport
export const labEntries: JournalEntry[] = [
    teasingAiEntry,               // 089: AIをあおってみた
    coldWaterSurrenderEntry,      // 077: 冷水とサレンダー
    criticalThinkingHiroyukiEntry, // 071: エゴの鏡としての批判的思考
];
