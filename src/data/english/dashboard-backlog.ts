/**
 * 積み上げダッシュボード 改善バックログ
 *
 * これが改善の記録そのもの。
 * 実装したら done: true + doneDate を入れて、永遠に積み上げていく。
 * 新しいアイデアは末尾に追加。IDは連番。
 */

export interface BacklogItem {
    id: number;
    category: 'animation' | 'data' | 'ux' | 'visual' | 'feature' | 'infra';
    description: string;
    done: boolean;
    addedDate: string;       // YYYY-MM-DD
    doneDate?: string;       // YYYY-MM-DD
    note?: string;           // 実装時のメモ
}

export const CATEGORY_LABELS: Record<BacklogItem['category'], { label: string; color: string }> = {
    animation: { label: 'ANIM', color: '#7C3AED' },
    data:      { label: 'DATA', color: '#2563EB' },
    ux:        { label: 'UX',   color: '#D97706' },
    visual:    { label: 'VIS',  color: '#DB2777' },
    feature:   { label: 'FEAT', color: '#059669' },
    infra:     { label: 'INFRA', color: '#64748B' },
};

export const BACKLOG: BacklogItem[] = [
    // --- V3 初期リリース (2026-02-22) ---
    { id: 1,  category: 'infra',     description: '積み上げダッシュボード V3 基盤実装',                               done: true, addedDate: '2026-02-22', doneDate: '2026-02-22', note: 'V2 analytics → V3 積み上げに全面置換' },
    { id: 2,  category: 'data',      description: 'Word Review 訪問トラッキング追加',                                 done: true, addedDate: '2026-02-22', doneDate: '2026-02-22', note: 'localStorage wordreview-visited-* キー' },
    { id: 3,  category: 'infra',     description: '改善バックログシステム導入',                                         done: true, addedDate: '2026-02-22', doneDate: '2026-02-22', note: 'データファイル + ページ内レンダリング' },

    // --- Animation ---
    { id: 10, category: 'animation', description: 'ヒーロー数字のカウントアップアニメーション（0 → N）',               done: false, addedDate: '2026-02-22' },
    { id: 11, category: 'animation', description: 'プログレスバーのロード時に左から伸びるアニメーション',               done: false, addedDate: '2026-02-22' },
    { id: 12, category: 'animation', description: 'タップ時のリプルエフェクト / フィードバック',                         done: false, addedDate: '2026-02-22' },
    { id: 13, category: 'animation', description: 'マイルストーン到達時の演出（100, 500, 1000）',                       done: false, addedDate: '2026-02-22' },
    { id: 14, category: 'animation', description: 'ページ遷移時のフェードイン',                                         done: false, addedDate: '2026-02-22' },

    // --- Data ---
    { id: 20, category: 'data',      description: '前回訪問との差分表示（+3 since yesterday）',                         done: false, addedDate: '2026-02-22' },
    { id: 21, category: 'data',      description: '週間ミニスパークライン（各バーの下に7日推移）',                       done: false, addedDate: '2026-02-22' },
    { id: 22, category: 'data',      description: 'ストリーク表示（連続学習日数）',                                     done: false, addedDate: '2026-02-22' },
    { id: 23, category: 'data',      description: '月間カレンダーヒートマップ（GitHub風）',                              done: false, addedDate: '2026-02-22' },
    { id: 24, category: 'data',      description: '最終更新タイムスタンプ表示',                                         done: false, addedDate: '2026-02-22' },
    { id: 25, category: 'data',      description: '訪問履歴をlocalStorageにスナップショット保存（差分計算用）',          done: false, addedDate: '2026-02-22' },

    // --- UX ---
    { id: 30, category: 'ux',        description: '並び替え機能（進捗率順 / デフォルト順）',                             done: false, addedDate: '2026-02-22' },
    { id: 31, category: 'ux',        description: '各featureの詳細展開パネル（タップで内訳表示）',                       done: false, addedDate: '2026-02-22' },
    { id: 32, category: 'ux',        description: '空状態の改善（0件 → 励ましメッセージ）',                             done: false, addedDate: '2026-02-22' },
    { id: 33, category: 'ux',        description: 'Pull-to-refresh（モバイル）',                                        done: false, addedDate: '2026-02-22' },
    { id: 34, category: 'ux',        description: 'キーボードショートカット（j/k で行移動、Enter で遷移）',             done: false, addedDate: '2026-02-22' },

    // --- Visual ---
    { id: 40, category: 'visual',    description: '各バーにパーセント表示（右端に薄く %）',                              done: false, addedDate: '2026-02-22' },
    { id: 41, category: 'visual',    description: '各バー左にカラードット追加',                                          done: false, addedDate: '2026-02-22' },
    { id: 42, category: 'visual',    description: '達成済み（100%）のバーにチェックマーク',                              done: false, addedDate: '2026-02-22' },
    { id: 43, category: 'visual',    description: 'プログレスバーの太さ調整（モバイルでもう少し太く）',                  done: false, addedDate: '2026-02-22' },
    { id: 44, category: 'visual',    description: 'ヒーロー数字の背景にうっすらゴールドのグラデーション',                done: false, addedDate: '2026-02-22' },
    { id: 45, category: 'visual',    description: 'バーのホバー時にツールチップ（詳細数値）',                            done: false, addedDate: '2026-02-22' },

    // --- Feature ---
    { id: 50, category: 'feature',   description: '目標設定機能（今月 XX 個触れる）',                                    done: false, addedDate: '2026-02-22' },
    { id: 51, category: 'feature',   description: '共有機能（スクリーンショット or テキスト）',                           done: false, addedDate: '2026-02-22' },
    { id: 52, category: 'feature',   description: '通知機能（3日サボったらリマインド）',                                 done: false, addedDate: '2026-02-22' },
    { id: 53, category: 'feature',   description: 'CSV / JSON エクスポート',                                            done: false, addedDate: '2026-02-22' },
    { id: 54, category: 'feature',   description: 'フレーズを累計ではなく月別推移で見せるオプション',                    done: false, addedDate: '2026-02-22' },
];
