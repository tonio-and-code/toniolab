// 俺語録 -- 自然な日本語口語 → ネイティブ英語チャンク
// 教科書じゃない。俺が毎日使ってる日本語の英語版。

export interface Goroku {
    id: string;
    japanese: string;
    english: string;
    literal?: string;        // 直訳（ギャップを見せる用）
    context: string;         // いつ使う？
    category: GorokuCategory;
    tags?: string[];
}

export type GorokuCategory =
    | 'reaction'     // リアクション
    | 'request'      // お願い・指示
    | 'opinion'      // 意見・判断
    | 'suggestion'   // 提案・質問
    | 'filler'       // つなぎ・口癖
    | 'shutdown';    // 会話を終わらせる

export const CATEGORY_META: Record<GorokuCategory, { label: string; en: string }> = {
    reaction:   { label: 'リアクション', en: 'Reactions' },
    request:    { label: 'お願い・指示', en: 'Requests' },
    opinion:    { label: '意見・判断', en: 'Opinions' },
    suggestion: { label: '提案・質問', en: 'Suggestions' },
    filler:     { label: 'つなぎ', en: 'Fillers' },
    shutdown:   { label: '終了', en: 'Shutdowns' },
};

export const gorokuData: Goroku[] = [
    // === リアクション ===
    {
        id: 'r001',
        japanese: 'みにくくね？',
        english: "isn't this hard to read?",
        literal: "isn't this ugly?",
        context: '何か見せられて微妙なとき',
        category: 'reaction',
    },
    {
        id: 'r002',
        japanese: 'よくわからんがもういいや',
        english: "I don't really get it but whatever",
        context: '説明されたけど興味を失ったとき',
        category: 'reaction',
    },
    {
        id: 'r003',
        japanese: 'つかれがやばいな',
        english: "I'm absolutely wiped",
        literal: "tiredness is dangerous",
        context: '体力の限界',
        category: 'reaction',
    },
    {
        id: 'r004',
        japanese: 'もともこもない',
        english: "that defeats the whole purpose",
        literal: "no capital, no interest",
        context: '本末転倒なことを言われたとき',
        category: 'reaction',
    },
    {
        id: 'r005',
        japanese: '色がグロテスク',
        english: "the colors are an eyesore",
        context: 'デザインがひどいとき',
        category: 'reaction',
    },
    {
        id: 'r006',
        japanese: 'わるくはないけど',
        english: "not bad, but...",
        context: '70点くらいの感想',
        category: 'reaction',
    },
    {
        id: 'r007',
        japanese: 'それがオチで',
        english: "and that's the punchline",
        context: '話のオチを紹介するとき',
        category: 'reaction',
    },
    {
        id: 'r008',
        japanese: 'さあ（笑）',
        english: "beats me",
        literal: "well...",
        context: '答えを知らない/知る気がないとき',
        category: 'reaction',
    },
    {
        id: 'r009',
        japanese: 'すまほでも大丈夫？',
        english: "does it hold up on mobile?",
        context: 'レスポンシブ確認',
        category: 'reaction',
    },
    {
        id: 'r010',
        japanese: 'そう言ったらもともこもない',
        english: "if I say that it kind of defeats the purpose",
        context: '自分の発言が矛盾してると気づいたとき',
        category: 'reaction',
    },

    // === お願い・指示 ===
    {
        id: 'q001',
        japanese: 'ださいからいらない',
        english: "it's tacky, get rid of it",
        context: 'UIが気に入らないとき',
        category: 'request',
    },
    {
        id: 'q002',
        japanese: 'そこらへんを工夫して',
        english: "get creative with that",
        literal: "devise that area",
        context: '具体的な指示なしで改善を求めるとき',
        category: 'request',
    },
    {
        id: 'q003',
        japanese: '頑張って（笑）',
        english: "just make it work",
        literal: "do your best",
        context: '無茶振りするとき',
        category: 'request',
    },
    {
        id: 'q004',
        japanese: 'もとのは残してね',
        english: "just leave the original just in case",
        context: 'リスクヘッジ',
        category: 'request',
    },
    {
        id: 'q005',
        japanese: '色もうちょっと薄くして',
        english: "tone down the color a bit",
        literal: "make the color a little thinner",
        context: 'デザイン微調整',
        category: 'request',
    },
    {
        id: 'q006',
        japanese: '全体の数字を背景に表示してよ',
        english: "show the total as a background number",
        context: 'UI指示',
        category: 'request',
    },
    {
        id: 'q007',
        japanese: '終わった回の表示の色変えるとかして',
        english: "change the color for completed ones or something",
        context: '視覚的な区別を求めるとき',
        category: 'request',
    },
    {
        id: 'q008',
        japanese: '視覚的にわかりやすく',
        english: "make it visually obvious",
        literal: "visually easy to understand",
        context: 'UI改善の方向性を示すとき',
        category: 'request',
    },
    {
        id: 'q009',
        japanese: '全部済みにしてよ',
        english: "just mark everything as done",
        context: 'バルク操作を頼むとき',
        category: 'request',
    },
    {
        id: 'q010',
        japanese: 'さっきのに加えて書いて',
        english: "add it to the one from earlier",
        context: '既存のものに追記を頼むとき',
        category: 'request',
    },

    // === 意見・判断 ===
    {
        id: 'o001',
        japanese: 'なまえが全部かっこわるいよね？',
        english: "the names all suck, don't they?",
        context: 'ネーミングへの不満',
        category: 'opinion',
    },
    {
        id: 'o002',
        japanese: '数字だしても意味ないじゃん',
        english: "showing numbers is pointless",
        literal: "even if you show numbers there's no meaning",
        context: '不要な情報表示への指摘',
        category: 'opinion',
    },
    {
        id: 'o003',
        japanese: '進捗バーとかいらん',
        english: "don't need a progress bar",
        context: '機能の却下',
        category: 'opinion',
    },
    {
        id: 'o004',
        japanese: '気にすることが多すぎる',
        english: "there's way too much to keep track of",
        context: '複雑さへの指摘',
        category: 'opinion',
    },
    {
        id: 'o005',
        japanese: '統一したんだから',
        english: "since we already unified it",
        context: '一貫性を理由に変更を求めるとき',
        category: 'opinion',
    },
    {
        id: 'o006',
        japanese: 'カラフルにしてはいけない',
        english: "you can't make it that colorful",
        context: 'デザイン原則の指摘',
        category: 'opinion',
    },
    {
        id: 'o007',
        japanese: 'そんなカラフルにしてはいけない　わかるよね？',
        english: "you can't go that colorful, you know what I mean?",
        context: '当然の原則を確認するとき',
        category: 'opinion',
    },
    {
        id: 'o008',
        japanese: '意味がわからない',
        english: "I have no idea what this means",
        context: 'UIが直感的じゃないとき',
        category: 'opinion',
    },

    // === 提案・質問 ===
    {
        id: 's001',
        japanese: 'ほかのやりかたないの？',
        english: "can't you do it some other way?",
        context: '別のアプローチを求めるとき',
        category: 'suggestion',
    },
    {
        id: 's002',
        japanese: 'ふつうに終わりが確認できればいい',
        english: "I just need to see when it's done",
        literal: "normally if I can confirm the end that's fine",
        context: 'シンプルな要件を伝えるとき',
        category: 'suggestion',
    },
    {
        id: 's003',
        japanese: 'カレンダーを１枚にして',
        english: "just make it a single calendar",
        context: 'UI簡素化の提案',
        category: 'suggestion',
    },
    {
        id: 's004',
        japanese: 'なんかいい名前の案ない？',
        english: "got any ideas for better names?",
        context: 'ネーミングの相談',
        category: 'suggestion',
    },
    {
        id: 's005',
        japanese: 'じゃあ英語にもどろうか',
        english: "let's get back to English",
        context: '話題を切り替えるとき',
        category: 'suggestion',
    },
    {
        id: 's006',
        japanese: 'やってみようか',
        english: "wanna give it a shot?",
        literal: "shall we try doing it?",
        context: '新しいことを始めるとき',
        category: 'suggestion',
    },
    {
        id: 's007',
        japanese: '勝手にぶっこむとかしてみない？',
        english: "why don't you just throw them in?",
        context: '気軽に実行を促すとき',
        category: 'suggestion',
    },

    // === つなぎ・口癖 ===
    {
        id: 'f001',
        japanese: 'てか',
        english: "actually, / I mean,",
        context: '話題を微修正するとき',
        category: 'filler',
    },
    {
        id: 'f002',
        japanese: 'わかる？',
        english: "you know what I mean?",
        context: '理解を確認するとき（ほぼ口癖）',
        category: 'filler',
    },
    {
        id: 'f003',
        japanese: 'あとあれか',
        english: "oh and also,",
        context: '追加の気づき',
        category: 'filler',
    },
    {
        id: 'f004',
        japanese: 'そこらへん',
        english: "that whole thing / that area",
        context: '曖昧に範囲を指すとき',
        category: 'filler',
    },
    {
        id: 'f005',
        japanese: 'とりあえず',
        english: "for now, / let's just",
        context: '暫定的に決めるとき',
        category: 'filler',
    },
    {
        id: 'f006',
        japanese: 'ふつうに',
        english: "just / simply",
        literal: "normally",
        context: '普通の方法でいいよ、の意味',
        category: 'filler',
    },

    // === 会話を終わらせる ===
    {
        id: 'x001',
        japanese: 'もういいや',
        english: "forget it / never mind",
        context: '興味を失ったとき',
        category: 'shutdown',
    },
    {
        id: 'x002',
        japanese: 'いらない',
        english: "don't need it",
        context: '機能を却下するとき',
        category: 'shutdown',
    },
    {
        id: 'x003',
        japanese: 'git push',
        english: "ship it",
        context: '完了。議論終了。',
        category: 'shutdown',
        tags: ['dev'],
    },
];
