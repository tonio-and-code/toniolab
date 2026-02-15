/**
 * スパム警告ブログ記事エントリ
 */

import { JournalEntry } from '../types';

export const spamWarningEntry: JournalEntry = {
    id: '072',
    date: '2026-01-16',
    title: '【注意喚起】「会社にいらっしゃいますか」メールが届いたら',
    summary: 'フィッシングメールが届いた。実在する会社名を騙り、ランダムなGmailアドレスから。CEO詐欺の典型パターン。エックハルト・トールの視点で「恐怖ではなく意識的行動」を考える。',
    featured: true,
    readTime: 5,
    businessTags: ['セキュリティ', '詐欺対策', 'ビジネス', '注意喚起'],
    techTags: ['フィッシング', 'メールセキュリティ', 'マインドフルネス'],
    heroImage: 'https://imagedelivery.net/k1Zw56y2FNiZaFcOP7Rs2Q/84dd3f51-781b-4b08-ddc5-8ffffd354000/public',
    englishSummary: {
        title: "Spam Alert: When You Get 'Are You at the Office?' Emails",
        readTime: 4,
        sections: [
            {
                heading: "The Suspicious Email",
                paragraphs: [
                    "I received a phishing email today. The subject line was 'Are you at the office?' - a typical CEO fraud opener.",
                    "The sender claimed to be from a real construction company, but the email address was a random string of characters at Gmail. That's the dead giveaway."
                ]
            },
            {
                heading: "The Three-Step Scam Pattern",
                paragraphs: [
                    "Step one: Confirm active recipients. Step two: Request assistance. Step three: Demand payment.",
                    "These scams target small businesses because we're more likely to respond personally. The human touch becomes a vulnerability."
                ]
            },
            {
                heading: "Eckhart Tolle's Perspective",
                paragraphs: [
                    "Instead of reacting with fear or anger, I chose conscious action. Delete. Block. Move on.",
                    "The ego wants to engage - to argue, to expose, to feel righteous. But presence teaches us: respond, don't react."
                ]
            },
            {
                heading: "What to Do",
                paragraphs: [
                    "Never reply. Delete immediately. Block the sender. Check for missing company information in signatures.",
                    "Random Gmail addresses from 'companies' are always fake. Real businesses use corporate email domains."
                ]
            }
        ]
    },
    conversationData: {
        english: [
            { speaker: 'male', text: "I got a weird email today." },
            { speaker: 'female', text: "What kind of email?" },
            { speaker: 'male', text: "Subject line was 'Are you at the office?' From some construction company." },
            { speaker: 'female', text: "That sounds suspicious already." },
            { speaker: 'male', text: "Yeah. The sender address was like... random characters at Gmail." },
            { speaker: 'female', text: "Classic phishing. They use real company names to seem legit." },
            { speaker: 'male', text: "Exactly. It's called CEO fraud apparently." },
            { speaker: 'female', text: "How does that work?" },
            { speaker: 'male', text: "Three steps. First, confirm you're active. Second, ask for help. Third, demand money." },
            { speaker: 'female', text: "And people fall for this?" },
            { speaker: 'male', text: "Small businesses do. We respond personally to emails." },
            { speaker: 'female', text: "That's kind of sad. The human touch becomes a weakness." },
            { speaker: 'male', text: "Right. So I thought about Eckhart Tolle." },
            { speaker: 'female', text: "The mindfulness guy? What does he have to do with spam?" },
            { speaker: 'male', text: "He talks about responding versus reacting." },
            { speaker: 'female', text: "Okay..." },
            { speaker: 'male', text: "My ego wanted to engage. Reply angrily. Expose them. Feel righteous." },
            { speaker: 'female', text: "But that's exactly what they want, right?" },
            { speaker: 'male', text: "Exactly. Any response confirms I'm real. So I chose conscious action." },
            { speaker: 'female', text: "Which was?" },
            { speaker: 'male', text: "Delete. Block. Move on. No energy wasted." },
            { speaker: 'female', text: "That's actually pretty zen." },
            { speaker: 'male', text: "Fear feeds the scam. Presence dissolves it." },
            { speaker: 'female', text: "So what should people look out for?" },
            { speaker: 'male', text: "Random Gmail addresses from 'companies'. Missing signatures. Vague requests." },
            { speaker: 'female', text: "Real companies use corporate email domains." },
            { speaker: 'male', text: "Always. If it's random letters at Gmail, it's fake." },
            { speaker: 'female', text: "Good to know. Thanks for the heads up." },
            { speaker: 'male', text: "Stay present. Don't let fear drive your clicks." }
        ],
        japanese: [
            { speaker: 'male', text: "今日、変なメールが来たんだ。" },
            { speaker: 'female', text: "どんなメール？" },
            { speaker: 'male', text: "件名が「会社にいらっしゃいますか」で、内装会社からって。" },
            { speaker: 'female', text: "もうその時点で怪しいね。" },
            { speaker: 'male', text: "そう。送信元がランダムな文字列のGmailだった。" },
            { speaker: 'female', text: "典型的なフィッシング。実在する会社名を使って信用させようとするやつ。" },
            { speaker: 'male', text: "そう、CEO詐欺っていうらしい。" },
            { speaker: 'female', text: "どういう手口？" },
            { speaker: 'male', text: "3ステップ。まず、相手が生きてるか確認。次に、助けを求める。最後に、金を要求。" },
            { speaker: 'female', text: "これに引っかかる人いるの？" },
            { speaker: 'male', text: "中小企業は引っかかる。メールに個人的に返信するから。" },
            { speaker: 'female', text: "悲しいね。人間味が弱点になるなんて。" },
            { speaker: 'male', text: "そう。だからエックハルト・トールのことを考えた。" },
            { speaker: 'female', text: "マインドフルネスの人？スパムと何の関係が？" },
            { speaker: 'male', text: "彼は「反応」と「応答」の違いを説いてる。" },
            { speaker: 'female', text: "なるほど..." },
            { speaker: 'male', text: "エゴは関わりたがった。怒って返信して、暴露して、正義感に浸りたい。" },
            { speaker: 'female', text: "でもそれが相手の狙いでしょ？" },
            { speaker: 'male', text: "その通り。どんな返信でも、俺が実在する証明になる。だから意識的行動を選んだ。" },
            { speaker: 'female', text: "どうしたの？" },
            { speaker: 'male', text: "削除。ブロック。先に進む。エネルギーを無駄にしない。" },
            { speaker: 'female', text: "けっこう禅だね。" },
            { speaker: 'male', text: "恐怖は詐欺を養う。プレゼンス（今ここにいること）が詐欺を溶かす。" },
            { speaker: 'female', text: "みんな何に気をつければいい？" },
            { speaker: 'male', text: "「会社」からのランダムなGmailアドレス。署名がない。曖昧な依頼。" },
            { speaker: 'female', text: "本物の会社は企業ドメインを使うよね。" },
            { speaker: 'male', text: "必ずね。ランダムな文字のGmailは偽物。" },
            { speaker: 'female', text: "覚えておく。教えてくれてありがとう。" },
            { speaker: 'male', text: "プレゼンスを保って。恐怖にクリックを支配させないで。" }
        ],
        tone: 'casual',
        generatedAt: new Date('2026-01-16')
    },
    conversation: `
## 2026年1月16日

今日、フィッシングメールが届いた。

**「会社にいらっしゃいますか」**

内装業者を騙る、典型的なCEO詐欺の手口だった。

---

## 怪しいメールの特徴

![Phishing Email](/images/journal/journal_spam_cyber_threat.png)

差出人：「株式会社〇〇内装」（実在する会社名）

メールアドレス：\`etstehrmagdalader@gmail.com\`

——**ランダムな文字列のGmail**。

これが一発でバレるポイント。

本物の会社は、企業ドメインのメールを使う。

---

## CEO詐欺の3ステップ

1. **確認**: 相手が生きてるかを確かめる（「いらっしゃいますか」）
2. **依頼**: 助けを求める（「お忙しいところすみません」）
3. **要求**: 金を要求する（「至急振り込んでください」）

中小企業は狙われやすい。

**人間味のある対応が、弱点になる。**

---

## エックハルト・トールの視点

![Mindfulness vs Spam](/images/journal/journal_spam_mindfulness.png)

こういうメールを見ると、エゴが騒ぐ。

「返信して暴露してやる」
「正義の鉄槌を下してやる」

でも、それが相手の狙い。

**どんな返信も「この人は実在する」という証明になる。**

---

## 意識的行動

トールは「反応（react）」と「応答（respond）」の違いを説く。

**反応**：エゴに支配され、感情的に動く

**応答**：プレゼンス（今ここにいること）から、意識的に選ぶ

俺が選んだのは——

**削除。ブロック。先に進む。**

エネルギーを無駄にしない。

---

## 対策まとめ

- **返信しない**
- **即削除**
- **送信元をブロック**
- **署名がないメールは疑う**
- **ランダムなGmailアドレス = 偽物**

---

*恐怖は詐欺を養う。*

*プレゼンスが詐欺を溶かす。*

*クリックする前に、一呼吸。*

---

**なんて日だ！**

——でも、こうして記録に残す。

誰かの役に立てば、この詐欺メールにも意味がある。
`
};
