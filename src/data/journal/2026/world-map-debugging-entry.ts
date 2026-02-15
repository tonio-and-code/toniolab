/**
 * World Map 6 Debugging Entry - 2026-02-04
 */

import { JournalEntry } from '../types';

export const worldMapDebuggingEntry: JournalEntry = {
    id: '096',
    date: '2026-02-04',
    title: '世界征服ゲームがバグった——ReferenceErrorと重複キーの戦い',
    summary: 'World Map 6でReferenceErrorが発生。関数が定義される前に呼ばれていた。コードを全面書き直し。モバイルランドスケープ警告も実装。',
    featured: true,
    readTime: 8,
    businessTags: ['デバッグ', 'トラブルシューティング', 'モバイル対応'],
    techTags: ['React', 'ReferenceError', 'D3.js', 'Next.js'],
    heroImage: '/brain/9855cd07-b978-4336-a023-4075edb69c5d/world_map_debugging_1770203124266.png',
    englishSummary: {
        title: "World Conquest Game Broke — ReferenceErrors and Duplicate Keys",
        readTime: 7,
        sections: [
            {
                heading: "The Bug Report",
                paragraphs: [
                    "Got a message from the user: 'なおってない' (It's not fixed).",
                    "World Map 6 was throwing ReferenceErrors. The handleRandomMission function wasn't defined when the button tried to call it."
                ]
            },
            {
                heading: "The Root Cause",
                paragraphs: [
                    "Classic React mistake: the function was defined AFTER the return statement. In JavaScript, that means it's unreachable code.",
                    "The JSX was trying to call handleRandomMission before it even existed in the execution context."
                ]
            },
            {
                heading: "The Nuclear Option",
                paragraphs: [
                    "Rather than patch it, I rewrote the entire component structure.",
                    "New order: Imports → Constants → Component → State → Hooks → Helper Functions → Return (JSX).",
                    "All functions properly hoisted and defined before use. Clean, standard React component structure."
                ]
            },
            {
                heading: "The Duplicate Key Problem",
                paragraphs: [
                    "While debugging, found another issue: duplicate React keys in the map rendering.",
                    "Some countries lacked proper IDs, causing React to assign the same key to multiple elements.",
                    "Fixed with robust key generation combining country ID with array index."
                ]
            },
            {
                heading: "The Debugging Philosophy",
                paragraphs: [
                    "Sometimes a complete rewrite is faster than incremental patches.",
                    "When the structure is fundamentally wrong, fixing symptoms won't help.",
                    "Total file overwrite: 526 lines of clean, working code."
                ]
            }
        ]
    },
    conversationData: {
        english: [
            { speaker: 'male', text: "なおってない。" },
            { speaker: 'female', text: "It's not fixed? What error are you seeing?" },
            { speaker: 'male', text: "Same as before." },
            { speaker: 'female', text: "Let me check... Oh no." },
            { speaker: 'male', text: "What?" },
            { speaker: 'female', text: "The functions are missing. They're defined after the return statement." },
            { speaker: 'male', text: "That's unreachable code?" },
            { speaker: 'female', text: "Exactly. ReferenceError is happening because handleRandomMission doesn't exist." },
            { speaker: 'male', text: "Can you just move it?" },
            { speaker: 'female', text: "I could, but the structure is messy. I'm rewriting it." },
            { speaker: 'male', text: "The entire file?" },
            { speaker: 'female', text: "Yes. Fresh start." },
            { speaker: 'male', text: "How long?" },
            { speaker: 'female', text: "Done. 526 lines. All functions before the return." },
            { speaker: 'male', text: "That was fast." }
        ],
        japanese: [
            { speaker: 'male', text: "なおってない。" },
            { speaker: 'female', text: "直ってない？どんなエラー？" },
            { speaker: 'male', text: "前と同じ。" },
            { speaker: 'female', text: "確認するね...やばい。" },
            { speaker: 'male', text: "何？" },
            { speaker: 'female', text: "関数が消えてる。return文の後で定義されてる。" },
            { speaker: 'male', text: "到達不能コード？" },
            { speaker: 'female', text: "そう。handleRandomMissionが存在しないからReferenceErrorになる。" },
            { speaker: 'male', text: "移動すればいいじゃん？" },
            { speaker: 'female', text: "できるけど、構造が汚い。書き直す。" },
            { speaker: 'male', text: "ファイル全部？" },
            { speaker: 'female', text: "うん。最初から。" },
            { speaker: 'male', text: "どれくらい？" },
            { speaker: 'female', text: "完了。526行。全関数がreturnの前。" },
            { speaker: 'male', text: "早いな。" }
        ],
        tone: 'casual',
        generatedAt: new Date('2026-02-04T20:00:00+09:00')
    },
    conversation: `## 2026年2月4日

**俺:** なおってない

**AI:** えっ

---

## ReferenceError: 関数が消えた

\`handleRandomMission is not defined\`

ボタンをクリックすると、このエラー。

原因: 関数がreturn文の後ろに定義されていた。JavaScriptでは到達不能コード。

---

## 解決: 全面書き直し

パッチより書き直しの方が早い。

新しい構造:
1. Imports
2. Component & State
3. Helper Functions
4. Return (JSX)

全関数をreturnの前に配置。526行の完全書き直し。

---

## 追加修正: 重複キー

Reactの\`key\`が重複していた。

一部の国にIDがなく、同じkeyが複数に割り当て。

修正: \`key={\\\`\${id || 'unknown'}-\${i}\\\`}\`

ID + インデックスで確実にユニーク。

---

*デバッグは冒険だ。*

*ゼロから始める勇気が必要。*
`
};
