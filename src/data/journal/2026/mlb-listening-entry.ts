/**
 * MLBオフシーズン配信リスニングコンテンツ追加記事
 */

import { JournalEntry } from '../types';

export const mlbListeningEntry: JournalEntry = {
    id: '070',
    date: '2026-01-15',
    title: 'MLBオフシーズン配信を英語教材にしたら再生プレイヤーまで作り直すことになった',
    summary: '日本人MLB配信者の1時間半の配信を日英バイリンガルコンテンツに変換。リスニングページのUIがゴミだったので、ConversationPlayerレベルに作り直した。ElevenLabsは高い。',
    featured: true,
    readTime: 5,
    businessTags: ['英語学習', 'MLB', 'コンテンツ制作', '野球'],
    techTags: ['TTS', 'Web Speech API', 'Next.js', 'TypeScript'],
    heroImage: '/images/journal/mlb-offseason-hero.png',
    englishSummary: {
        title: "Turning an MLB Offseason Stream into English Learning Material — And Rebuilding the Entire Player",
        readTime: 5,
        sections: [
            {
                heading: "The Idea",
                paragraphs: [
                    "I wanted to use MLB offseason content for English learning. The Arenado trade to the D-backs, Ryan Weathers to Yankees, Tucker's contract negotiations...",
                    "But here's the twist: I took a Japanese streamer's 1.5-hour broadcast and translated it INTO English. A Japanese person explaining MLB trades — now in English. Reverse immersion."
                ]
            },
            {
                heading: "What Got Translated",
                paragraphs: [
                    "The Arenado Trade: Cardinals dumped him to the D-backs with $31 million in salary relief. Arizona pays only $11 million over 2 years. The return? One 8th-round minor leaguer.",
                    "Ryan Weathers: Former Padres 1st-rounder (7th overall). High school ERA of 0.09. Velocity jumped from 93-94 to upper 90s touching 100. Yankees got him to fill the gap until Cole and Rodon return.",
                    "Tucker Market: Blue Jays reportedly offered 7 years, $300 million. Streamer's prediction: Mystery team, not the reported finalists.",
                    "Team USA WBC: Judge, Harper, Skubal, Skenes. 'If they don't win with this roster, no excuses.'",
                    "Padres Broke: The shocking revelation — Padres tried to get Arenado to play FIRST BASE. Using a bat-dead player at the most offense-dependent position? Hilarious and sad."
                ]
            },
            {
                heading: "The Player Was Garbage",
                paragraphs: [
                    "After adding the content, I checked the listening page. YouTube error (no video). No continuous playback. Speed control was a lie. The UI was trash compared to the ConversationPlayer used elsewhere.",
                    "User feedback: 'Do it properly. Like /memoria/journal-069.' Completely valid criticism."
                ]
            },
            {
                heading: "Rebuilding the Player",
                paragraphs: [
                    "Before: YouTube-dependent, missing features. After: TTS continuous playback, music player-style UI.",
                    "New features: Continuous playback (auto-advance on segment end), working speed control (0.5x to 2.0x), shuffle and repeat modes, progress bar, Japanese toggle, auto-scroll to current segment."
                ]
            },
            {
                heading: "ElevenLabs Is Expensive",
                paragraphs: [
                    "User wanted expressive, emotional TTS — like MLB Network commentators excitedly rambling. Browser TTS is robotic.",
                    "ElevenLabs pricing: Free tier 10,000 chars, Starter $5/month for 30,000 chars, Creator $22/month for 100,000 chars. The MLB content is about 20-30k characters.",
                    "User: 'ElevenLabs is expensive lol. Audio should be way cheaper than video generation, right?' Valid point."
                ]
            },
            {
                heading: "Conclusion",
                paragraphs: [
                    "Translation was easy (AI handles it). Rebuilding the UI was the real work. Good UI already existed (ConversationPlayer). ElevenLabs is pricey. Baseball nerds want MLB Network rapid-fire commentary.",
                    "80 segments. Bilingual Japanese-English. Continuous playback. The Padres trying to get Arenado for first base is both funny and depressing."
                ]
            }
        ]
    },
    conversationData: {
        english: [
            { speaker: 'male', text: "So I translated an MLB stream into English today." },
            { speaker: 'female', text: "Wait, you translated FROM Japanese? Not into Japanese?" },
            { speaker: 'male', text: "Exactly. A Japanese streamer talking about the Arenado trade, Weathers to Yankees, Tucker's market. Now it's English learning material." },
            { speaker: 'female', text: "That's... backwards. But interesting." },
            { speaker: 'male', text: "80 segments. Full bilingual. The problem was the listening page." },
            { speaker: 'female', text: "What was wrong with it?" },
            { speaker: 'male', text: "YouTube error because there's no video. No continuous playback. Speed control didn't actually work." },
            { speaker: 'female', text: "Ouch. So what did you do?" },
            { speaker: 'male', text: "Rebuilt the entire player. Like ConversationPlayer but for listening content." },
            { speaker: 'female', text: "Music player style?" },
            { speaker: 'male', text: "Yeah. Play, pause, skip, shuffle, repeat. Speed buttons that actually work. Progress bar. Auto-scroll." },
            { speaker: 'female', text: "Nice. What about the voice? Browser TTS sounds robotic." },
            { speaker: 'male', text: "I looked into ElevenLabs. Expressive, emotional, sounds like real broadcasters." },
            { speaker: 'female', text: "And?" },
            { speaker: 'male', text: "It's expensive. $22 a month for 100k characters. The MLB content alone is like 30k." },
            { speaker: 'female', text: "That's wild. Audio should be cheaper than video generation." },
            { speaker: 'male', text: "Exactly what I said. Anyway, the funniest part of the stream..." },
            { speaker: 'female', text: "What?" },
            { speaker: 'male', text: "Padres tried to get Arenado. For FIRST BASE." },
            { speaker: 'female', text: "Wait, Arenado's bat is dead. First base is the most offense-heavy position." },
            { speaker: 'male', text: "Exactly. Rosenthal reported it. Hilarious and sad at the same time." },
            { speaker: 'female', text: "The Padres are really broke, huh." },
            { speaker: 'male', text: "So broke. But hey, at least I got 80 segments of English learning content out of it." },
            { speaker: 'female', text: "Silver lining." }
        ],
        japanese: [
            { speaker: 'male', text: "今日、MLBの配信を英語に翻訳したんだ。" },
            { speaker: 'female', text: "え、日本語から？日本語にじゃなくて？" },
            { speaker: 'male', text: "そう。日本人配信者がアレナドトレードとか、ウェザースのヤンキース移籍とか、タッカーの市場について話してて。それを英語学習教材にした。" },
            { speaker: 'female', text: "逆...でも面白いね。" },
            { speaker: 'male', text: "80セグメント。完全バイリンガル。問題はリスニングページだった。" },
            { speaker: 'female', text: "何がダメだったの？" },
            { speaker: 'male', text: "YouTubeエラー、動画がないから。連続再生もできない。速度変更も嘘だった。" },
            { speaker: 'female', text: "うわ。で、どうしたの？" },
            { speaker: 'male', text: "プレイヤーを全部作り直した。ConversationPlayerみたいに。" },
            { speaker: 'female', text: "音楽プレイヤー風？" },
            { speaker: 'male', text: "そう。再生、一時停止、スキップ、シャッフル、リピート。ちゃんと効く速度ボタン。プログレスバー。自動スクロール。" },
            { speaker: 'female', text: "いいね。声は？ブラウザTTSはロボットっぽいでしょ。" },
            { speaker: 'male', text: "ElevenLabs調べた。表情豊かで、感情込めて、本物の放送みたいな声。" },
            { speaker: 'female', text: "で？" },
            { speaker: 'male', text: "高い。月22ドルで10万文字。MLBコンテンツだけで3万文字くらい。" },
            { speaker: 'female', text: "やばいね。音声は動画生成より安いはずなのに。" },
            { speaker: 'male', text: "まさにそれ言った。ところで、配信で一番面白かったのは..." },
            { speaker: 'female', text: "なに？" },
            { speaker: 'male', text: "パドレスがアレナド獲ろうとしてた。ファーストで。" },
            { speaker: 'female', text: "待って、アレナドの打撃終わってるじゃん。ファーストは一番打撃が重要なポジションだよ。" },
            { speaker: 'male', text: "そう。Rosenthalが報じてた。笑えるし悲しい。" },
            { speaker: 'female', text: "パドレス本当に金ないんだね。" },
            { speaker: 'male', text: "マジで金ない。でもまあ、80セグメントの英語学習コンテンツは手に入った。" },
            { speaker: 'female', text: "怪我の功名。" }
        ],
        tone: 'humorous',
        generatedAt: new Date('2026-01-15')
    },
    conversation: `
## 2026年1月15日

今日やったこと：

1. **日本人MLB配信者の1時間半のストリームを翻訳**
2. **80セグメントの日英バイリンガルコンテンツを作成**
3. **リスニングページを完全に作り直した**
4. **ElevenLabsの料金に驚愕した**

---

## きっかけ

MLBオフシーズンの配信を英語学習に使いたい。

アレナドのDバックストレード、ライアン・ウェザースのヤンキース移籍、タッカーの契約交渉...

**日本語で解説されてる配信を、英語に翻訳して、リスニング教材にする。**

逆転の発想だ。

---

## 翻訳した内容（ハイライト）

配信は約1時間半、以下のトピックをカバー：

### アレナドトレード
- カージナルスがDバックスに放出
- 残り4200万ドルのうち、カージナルスが3100万ドル負担
- アリゾナは2年で1100万ドルしか払わない
- 見返りはドラフト8巡目のマイナーリーガー1人

> "So basically, they gave him away for almost nothing plus $31 million in salary relief."

### ライアン・ウェザース
- 元パドレスの1巡目（全体7位）
- 高校時代の防御率0.09
- 球速が93-94から上位90後半〜100マイルに成長
- ヤンキースがコールとロドン復帰までの穴埋めに獲得

### タッカー市場
- ブルージェイズが7年3億ドル（年平均4000万ドル以上）をオファー？
- 配信者の予想：報道されてるファイナリスト3チームどこにも行かない。ミステリーチーム。

### Team USA WBC
- Judge、Harper、Skubal、Skenes
- 「このロースターで優勝できなかったら言い訳できない」

### パドレスの金欠
- **驚愕の事実：パドレスがアレナドをファーストで獲得しようとしてた**
- 「打撃が終わってる選手をファーストで使う？一番打撃が重要なポジションで？」

---

## 問題発生：リスニングページがゴミ

コンテンツを追加して確認したら...

- YouTubeエラー（そもそも動画がない）
- 連続再生ができない
- 速度変更が嘘
- UIがMemoriaのConversationPlayerに比べて劣りすぎ

**ユーザー:**「まじめにやれよ　これみたいに /memoria/journal-069」

完全に正論だった。

---

## リスニングページを作り直した

Before：YouTube依存、機能不足
After：TTS連続再生、音楽プレイヤー風UI

### 新機能
- ✅ **連続再生** - onendで自動的に次のセグメントへ
- ✅ **速度変更** - 0.5x〜2.0xボタン（ちゃんと効く）
- ✅ **シャッフル/リピート** - Spotifyみたいな操作感
- ✅ **プログレスバー**
- ✅ **日本語表示ON/OFF**
- ✅ **自動スクロール** - 再生中のセグメントが常に画面中央

---

## ElevenLabs高すぎ問題

**ユーザー:**「エンバトの流暢さがほしい。感情をこめた。じゃないと詰まんないじゃん？」

わかる。ブラウザTTSはロボット声。

**ElevenLabsの料金：**

| プラン | 文字数 | 月額 |
|--------|--------|------|
| 無料 | 10,000文字 | $0 |
| Starter | 30,000文字 | $5 |
| Creator | 100,000文字 | $22 |

今回のMLBコンテンツは約2-3万文字。

**ユーザー:**「エンバト高いねえｗｗｗ　音声なんて動画生成よりはるかにコスト低そうなのにね（笑）」

正論すぎる。

---

## 技術メモ

### ConversationPlayerから学んだこと

\`\`\`typescript
const playSegment = (index: number) => {
    const utterance = new SpeechSynthesisUtterance(segment.english);
    utterance.rate = speedRef.current; // リアルタイム速度参照
    
    utterance.onend = () => {
        const nextIndex = getNextIndex(index);
        if (nextIndex >= 0) {
            playSegment(nextIndex); // 自動連続再生
        }
    };
    
    window.speechSynthesis.speak(utterance);
};
\`\`\`

ポイント：
- **Refで速度を保持** - useStateだとクロージャ問題で古い値を参照してしまう
- **onendで次を呼ぶ** - setTimeoutで少し待ってから次のセグメントへ
- **getNextIndex()** - リピートモード、シャッフルモードを考慮

---

## 結論

1. **翻訳は簡単**（AIに任せればいい）
2. **UI作り直しが本番だった**
3. **良いUIはすでにある**（ConversationPlayer）
4. **ElevenLabsは高い**
5. **野球カスはMLB Networkの早口を聞きたい**

---

*URL: [/english/listening/mlb-offseason-jan2025](/english/listening/mlb-offseason-jan2025)*

*80セグメント、日英バイリンガル、連続再生対応*

*パドレスがアレナドをファーストで獲ろうとしてた件、笑えるし悲しい*
`
};
