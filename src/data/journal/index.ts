/**
 * ジャーナル記事データ
 *
 * このファイルは各月のエントリをまとめてexportします
 * 
 * ⚠️ 【重要】 画像の取り扱いについて ⚠️
 * 1. ローカル画像を配置したままコミットしないこと
 * 2. 以下のコマンドで必ずCloudflare Imagesにアップロードする
 *    `npm run upload-image public/images/journal/your-image.jpg`
 * 3. 取得したURL (`https://imagedelivery.net/...`) に置き換えてからコミットする
 */

export type { JournalEntry } from './types';
import { JournalEntry } from './types';

// 2026年のエントリ
import { january2026Entries } from './2026/01-january';
import { february2026Entries } from './2026/02-february';

console.log('DEBUG: In index.ts, february entries:', february2026Entries?.length);

// 全エントリを統合（新しい順）
export const journalEntries: JournalEntry[] = [
    ...february2026Entries,
    ...january2026Entries,
    // 他の月は元のjournal.tsから読み込む（一時的）
];
