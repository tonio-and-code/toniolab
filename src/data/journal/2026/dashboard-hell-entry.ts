/**
 * 128 - ダッシュボード地獄
 * 3つの指標を作ったら2つは同じだった話
 */

import { JournalEntry } from '../types';

export const dashboardHellEntry: JournalEntry = {
    id: '128',
    date: '2026-02-25',
    title: 'ダッシュボード地獄 ― 3つの指標を作ったら2つは同じだった',
    summary: '英語の勉強0分、ダッシュボードの開発5時間。Reps・Power・XPを定義したらPowerとXPがほぼ同じだった。測るのが目的になってる。でもダッシュボードがあると毎日やる気が出る。本末転倒が結果的に回ってる。',
    featured: false,
    readTime: 5,
    businessTags: ['ダッシュボード', 'ゲーミフィケーション', '指標設計'],
    techTags: ['Analytics', 'SVG', 'メトリクス', 'UX'],
    conversation: `
## ダッシュボードに5時間溶けた

今日、英語の勉強した時間：0分。
英語の勉強を「計測するダッシュボード」を作った時間：5時間。

**本末転倒。**

---

## 3つの指標を作った

AIと一緒に分析ページを作り直した。最初は棒グラフだった。ショボい。折れ線にした。まだショボい。ヒートマップカレンダー入れた。Shopifyっぽくした。ちょっとマシ。

で、指標を3つ定義した。

- **Reps（積み上げ）**: 何回復習したか。純粋な回数。量の指標。
- **Power（戦力）**: フレーズのChakraレベル合計。英語力の総合値。成長の結果。
- **XP（経験値）**: Reps × 平均レベル。その日の努力量。汗の結晶。

名前も考えた。日本語と英語両方。色も決めた。グリーン、ゴールド、オレンジ。説明書まで作った。折りたたみ式。

**ここまで3時間。**

---

## PowerとXPって同じじゃね？

ふと気づいた。

Power = フレーズ数 × 平均レベル。
XP = 復習回数 × 平均レベル。

**共通因子：平均レベル。**

違うのは「フレーズ数」と「復習回数」だけ。で、フレーズ数は日ごとにほぼ固定。復習回数が増えればXPが伸びるだけ。

グラフの形、ほぼ同じになる。

**2時間かけて「同じもの」を2つ作った。**

AIに「まあ同じだよね？（笑）」って言ったら長々と「いや微妙に違くて...」って説明し始めた。フレーズ数が固定じゃないとか、avgLvが共通因子だとか。聞いてて意味わからんかった。

「あほ」って言った。

---

## 軸の設計で30分使った

3つの指標をグラフに全部載せようとした。

最初：全部独立スケール。3本の軸。左に2本、右に1本。ごちゃごちゃ。

次：RepsとXPを左軸で共有。でもRepsが100超えてXPが400超えたら潰れる。あほ。

最後：Repsだけ左軸、PowerとXPは右軸で共有。両方「レベル加重」系だから同じスケールで見れる。

**軸の設計に30分。英語の勉強は0分。**

---

## 測るのが目的になってる

体重計に毎日乗る人を思い出した。

乗るだけで痩せると思ってる。数字を見て「ふむ」って言って、そのあとポテチ食う。

**俺、それの英語版やってる。**

SVGのパス計算をいじった。cardinal splineの滑らかさを調整した。ヒートマップの3分割セル（緑・オレンジ・金）のopacity計算で15分。

その間、英語のフレーズ1個も覚えてない。

---

## でも不思議なことに

悔しいけど、効果はある。

ダッシュボードを作ってから、毎日の復習回数が増えた。Repsのグラフが伸びてるのを見ると「もうちょっとやるか」ってなる。カレンダーが色で埋まると嬉しい。

ゲーミフィケーション。人間は数字が動くのを見るのが好き。進捗バーが進むのが好き。

**中身より見た目。それが人間。**

測ること自体が成長じゃない。でも測ることがモチベーションを作って、モチベーションが行動を作って、行動が成長を作る。

遠回りだけど、回ってる。回ってればいい。

---

## Tangent

最後にもう一つ作ることにした。「Tangent」。

ジャーナルの内容を参考にしつつ、全く別のトピックで英会話する機能。メモリアみたいにキャラクターが会話する形式で、でもジャーナルとは違う話をする。

**ジャーナルから脱線して、違う内容で英語する。**

tangent = 接線。本線に触れて、そのまま別の方向に飛んでいく。

ダッシュボード5時間、指標は同じもの2つ、英語の勉強は0分。

**でも「Tangent」って名前は5秒で決まった。**

測るより脱線するほうが向いてるかもしれない。
`,
    conversationData: {
        english: [
            { speaker: 'male', text: "I spent five hours on my English app today." },
            { speaker: 'female', text: "Oh nice, how many phrases did you learn?" },
            { speaker: 'male', text: "Zero." },
            { speaker: 'female', text: "...zero?" },
            { speaker: 'male', text: "Five hours building the DASHBOARD. Not one second actually studying." },
            { speaker: 'female', text: "That's incredible. In like, the worst way." },
            { speaker: 'male', text: "Started with a bar chart. Too boring. Switched to a line chart with smooth curves. Still boring. Added a heatmap calendar. Made it look like Shopify." },
            { speaker: 'female', text: "You Shopify'd your English app." },
            { speaker: 'male', text: "Three hours just on the look. Then I designed three metrics." },
            { speaker: 'female', text: "Three metrics for what?" },
            { speaker: 'male', text: "For measuring progress. Reps -- how many times you review. Power -- total strength, sum of all your phrase levels. And XP -- daily effort, reps times your average level." },
            { speaker: 'female', text: "OK, that sounds reasonable." },
            { speaker: 'male', text: "Named 'em in Japanese and English. Picked colors -- green, gold, orange. Built a collapsible guide explainin' each one. Felt really good about myself." },
            { speaker: 'female', text: "And then?" },
            { speaker: 'male', text: "And then I looked at the math. Power equals phrase count times average level. XP equals reps times average level." },
            { speaker: 'female', text: "...average level is in both." },
            { speaker: 'male', text: "Average level is in BOTH. The only difference is 'how many phrases you have' versus 'how many times you reviewed.' Two hours buildin' the same thing twice with different colors." },
            { speaker: 'female', text: "Did you tell the AI?" },
            { speaker: 'male', text: "I said, 'These are basically the same, right?' And it launched into this long explanation about how they're subtly different. Phrase count isn't fixed, XP is dynamic, blah blah." },
            { speaker: 'female', text: "What'd you say?" },
            { speaker: 'male', text: "I said 'shut up.'" },
            { speaker: 'female', text: "Ha!" },
            { speaker: 'male', text: "Sometimes the honest answer is just 'yeah, same thing, my bad.'" },
            { speaker: 'female', text: "So two hours on duplicate metrics. What about the other three?" },
            { speaker: 'male', text: "Axis design. Should Reps and XP share the left axis? Independent scales? Three axes -- two on the left, one on the right? I went through like four combinations." },
            { speaker: 'female', text: "For a graph nobody's gonna see." },
            { speaker: 'male', text: "For a graph only I'm gonna see. And I spent thirty minutes on it. English phrases learned: still zero." },
            { speaker: 'female', text: "You're like someone who buys a scale, polishes it, calibrates it--" },
            { speaker: 'male', text: "And then eats chips. Yeah. I'm the English version of that. Step on the scale every morning, nod thoughtfully, do nothin' about it." },
            { speaker: 'female', text: "But does the graph actually make you study more?" },
            { speaker: 'male', text: "...yes." },
            { speaker: 'female', text: "Wait, really?" },
            { speaker: 'male', text: "That's the annoyin' part. Since I built the dashboard, my daily review count actually went up. Seein' the line climb makes me go, 'Eh, few more.' The calendar fillin' up with color just feels good." },
            { speaker: 'female', text: "Gamification works." },
            { speaker: 'male', text: "Gamification works and I hate it. Measurin' isn't growing. But measuring creates motivation, motivation creates action, action creates growth. It's the dumbest roundabout path." },
            { speaker: 'female', text: "But it's turning." },
            { speaker: 'male', text: "It's turning. Five hours wasted today? Maybe. Five hours that'll generate five hundred hours of actual study? Also maybe. The ROI is either zero or infinite." },
            { speaker: 'female', text: "You genuinely can't tell which." },
            { speaker: 'male', text: "Not a clue. But the wheel's movin'. That's gotta count for somethin'." },
        ],
        japanese: [
            { speaker: 'male', text: "今日、英語アプリに5時間使った。" },
            { speaker: 'female', text: "おお、フレーズ何個覚えた？" },
            { speaker: 'male', text: "ゼロ。" },
            { speaker: 'female', text: "...ゼロ？" },
            { speaker: 'male', text: "5時間ダッシュボード作ってた。勉強は1秒もしてない。" },
            { speaker: 'female', text: "すごいね。最悪の意味で。" },
            { speaker: 'male', text: "棒グラフから始めた。つまらない。折れ線グラフにした。まだつまらない。ヒートマップカレンダー入れた。Shopifyっぽくした。" },
            { speaker: 'female', text: "英語アプリをShopify化した。" },
            { speaker: 'male', text: "見た目だけで3時間。で、指標を3つ設計した。" },
            { speaker: 'female', text: "何の指標？" },
            { speaker: 'male', text: "進捗を測るやつ。Reps -- 復習回数。Power -- 総合戦力、フレーズレベルの合計。XP -- 日々の努力量、復習回数かける平均レベル。" },
            { speaker: 'female', text: "うん、合理的に聞こえる。" },
            { speaker: 'male', text: "日本語と英語で名前つけた。色も決めた。グリーン、ゴールド、オレンジ。折りたたみ式の説明書まで作った。満足してた。" },
            { speaker: 'female', text: "で？" },
            { speaker: 'male', text: "で、数式をよく見た。Power = フレーズ数 かける 平均レベル。XP = 復習回数 かける 平均レベル。" },
            { speaker: 'female', text: "...平均レベルが共通。" },
            { speaker: 'male', text: "平均レベルが共通。違いは『フレーズ数』と『復習回数』だけ。2時間かけて同じものを色違いで2つ作った。" },
            { speaker: 'female', text: "AIに言った？" },
            { speaker: 'male', text: "「これ同じだよね？」って聞いたら、「いや微妙に違くて」って長々と説明し始めた。フレーズ数は固定じゃないとか、XPは動的とか。" },
            { speaker: 'female', text: "で？" },
            { speaker: 'male', text: "「あほ」って言った。" },
            { speaker: 'female', text: "あはは！" },
            { speaker: 'male', text: "正直に「同じだわ、すまん」でいいのに。" },
            { speaker: 'female', text: "で、重複指標で2時間。残りの3時間は？" },
            { speaker: 'male', text: "軸の設計。RepsとXPで左軸を共有する？独立スケール？軸3本？4パターンくらい試した。" },
            { speaker: 'female', text: "誰も見ないグラフのために。" },
            { speaker: 'male', text: "自分しか見ないグラフのために。それに30分。英語フレーズ：まだゼロ。" },
            { speaker: 'female', text: "体重計を買って、磨いて、校正して--" },
            { speaker: 'male', text: "で、ポテチ食う。うん、まさにそれ。英語版の体重計族。毎朝乗って、ふむって言って、何もしない。" },
            { speaker: 'female', text: "でも実際、グラフのおかげで勉強量増えてる？" },
            { speaker: 'male', text: "...増えてる。" },
            { speaker: 'female', text: "え、マジで？" },
            { speaker: 'male', text: "悔しいけど、ダッシュボード作ってから毎日の復習回数が上がった。折れ線が伸びてるの見ると「もうちょっとやるか」ってなる。カレンダーが色で埋まると嬉しい。" },
            { speaker: 'female', text: "ゲーミフィケーション効いてる。" },
            { speaker: 'male', text: "効いてて腹立つ。測ることは成長じゃない。でも測ることがモチベーションを作って、モチベーションが行動を作って、行動が成長を作る。一番アホな遠回り。" },
            { speaker: 'female', text: "でも回ってる。" },
            { speaker: 'male', text: "回ってる。今日の5時間、無駄？たぶん。この5時間が500時間の勉強を生む？それもたぶん。ROIはゼロか無限大。" },
            { speaker: 'female', text: "自分でもどっちかわかんないでしょ。" },
            { speaker: 'male', text: "全くわかんない。でもホイールは動いてる。それだけでいいんじゃないかな。" },
        ],
        tone: 'humorous' as const,
        generatedAt: new Date('2026-02-25'),
    },

    tangentData: {
        english: [
            { speaker: 'male', text: "I made pasta from scratch yesterday." },
            { speaker: 'female', text: "Like, from-scratch from scratch? Flour and eggs?" },
            { speaker: 'male', text: "Rolling pin, the whole thing." },
            { speaker: 'female', text: "Since when do you cook?" },
            { speaker: 'male', text: "Since I started avoiding work, apparently." },
            { speaker: 'female', text: "OK, walk me through this." },
            { speaker: 'male', text: "So I was supposed to be studying, right? Laptop open, flashcards ready. And I just -- went to the kitchen." },
            { speaker: 'female', text: "Classic." },
            { speaker: 'male', text: "At first it was gonna be like, boil some spaghetti, heat up sauce. Five minutes. But then I saw this bag of flour and thought, 'How hard can it be?'" },
            { speaker: 'female', text: "That question has ruined so many evenings." },
            { speaker: 'male', text: "Three hours. I'm covered in flour, dough's stuck to the counter, I'm usin' a wine bottle as a rolling pin 'cause I don't own one--" },
            { speaker: 'female', text: "A wine bottle!" },
            { speaker: 'male', text: "An empty one, obviously. And the pasta came out thick. Real thick. Like little planks." },
            { speaker: 'female', text: "Little planks." },
            { speaker: 'male', text: "But they weren't bad? Like, the texture was all wrong but the taste was there. And I felt this weird sense of accomplishment." },
            { speaker: 'female', text: "You built something. Tiny flour planks." },
            { speaker: 'male', text: "And that's the thing. Building the dashboard? No accomplishment. Zero. Stared at graphs for five hours, felt nothing. But these ugly pasta things? PROUD." },
            { speaker: 'female', text: "Maybe it's the physical thing. You can hold it. You can eat it." },
            { speaker: 'male', text: "Exactly. Tangible. A dashboard is just pixels. You can't eat a line chart." },
            { speaker: 'female', text: "Well, you could try." },
            { speaker: 'male', text: "Don't eat your monitor." },
            { speaker: 'female', text: "I wasn't gonna!" },
            { speaker: 'male', text: "But seriously, I think makin' food hits different. Humans have been doin' it for thousands of years. Our brains are wired for 'I found the thing, I prepared the thing, I ate the thing.' The full loop." },
            { speaker: 'female', text: "And dashboards don't have a full loop." },
            { speaker: 'male', text: "You build it and then you just... look at it. And look at it again tomorrow. It's the scale thing all over again." },
            { speaker: 'female', text: "So the cure for dashboard addiction is carbs." },
            { speaker: 'male', text: "The cure for everything is carbs." },
            { speaker: 'female', text: "That tracks." },
            { speaker: 'male', text: "Looked up a proper recipe after. Turns out it's one egg per hundred grams of flour. That's the whole recipe." },
            { speaker: 'female', text: "And you used?" },
            { speaker: 'male', text: "Four eggs and like fifty grams of flour. Basically made an omelet with flour in it." },
            { speaker: 'female', text: "An omelet with flour! No wonder they came out like planks!" },
            { speaker: 'male', text: "The point is, I learned something. Not what I was supposed to learn. Not English. But something." },
            { speaker: 'female', text: "Productive procrastination." },
            { speaker: 'male', text: "I'll study tomorrow. Tonight, round two. Proper ratio." },
            { speaker: 'female', text: "You're gonna track your pasta attempts, aren't you." },
            { speaker: 'male', text: "Flour weight, egg count, thickness, taste rating one to ten--" },
            { speaker: 'female', text: "There it is." },
            { speaker: 'male', text: "I can't escape it. I'm a measurement goblin." },
        ],
        japanese: [
            { speaker: 'male', text: "昨日、パスタ手作りした。" },
            { speaker: 'female', text: "え、ガチの手作り？小麦粉と卵から？" },
            { speaker: 'male', text: "麺棒とか全部。" },
            { speaker: 'female', text: "いつから料理するようになったの？" },
            { speaker: 'male', text: "仕事から逃げ始めてからかな。" },
            { speaker: 'female', text: "OK、順を追って話して。" },
            { speaker: 'male', text: "勉強するはずだったんだよ。パソコン開いて、フラッシュカード準備して。で、気づいたら台所にいた。" },
            { speaker: 'female', text: "あるある。" },
            { speaker: 'male', text: "最初はスパゲッティ茹でてソース温めて5分で済ますつもりだった。でも小麦粉の袋が目に入って、『どんくらい難しいんだろ？』って。" },
            { speaker: 'female', text: "その疑問、何回夜を潰してきたか。" },
            { speaker: 'male', text: "3時間。全身小麦粉だらけ、カウンターに生地がこびりついて、麺棒持ってないからワインの瓶で伸ばしてた。" },
            { speaker: 'female', text: "ワインの瓶！" },
            { speaker: 'male', text: "空のやつだよ、当然。で、できたパスタが厚い。めっちゃ厚い。板みたいな。" },
            { speaker: 'female', text: "板。" },
            { speaker: 'male', text: "でも悪くなかった？食感は全然ダメだけど味はあった。で、なんか達成感があった。" },
            { speaker: 'female', text: "何か作ったんだよ。小さい小麦粉の板。" },
            { speaker: 'male', text: "でもダッシュボード作った時？達成感ゼロ。5時間グラフ眺めて何も感じなかった。でもこの不格好なパスタ？誇らしかった。" },
            { speaker: 'female', text: "物理的なものだからかも。持てる。食べれる。" },
            { speaker: 'male', text: "そう。具体的。ダッシュボードはただのピクセル。折れ線グラフ食べれないし。" },
            { speaker: 'female', text: "食べようと思えば。" },
            { speaker: 'male', text: "モニター食うな。" },
            { speaker: 'female', text: "食べないよ！" },
            { speaker: 'male', text: "でもマジで、料理って違うんだよ。人類が何千年もやってきたこと。『見つけた→調理した→食べた』のフルループに脳が反応するようにできてる。" },
            { speaker: 'female', text: "ダッシュボードにはフルループがない。" },
            { speaker: 'male', text: "作って、眺めて、明日また眺める。体重計と同じ。" },
            { speaker: 'female', text: "じゃあダッシュボード中毒の治療法は炭水化物。" },
            { speaker: 'male', text: "全ての治療法は炭水化物。" },
            { speaker: 'female', text: "確かに。" },
            { speaker: 'male', text: "あとでちゃんとしたレシピ調べたら、小麦粉100gに卵1個。それだけ。レシピの全て。" },
            { speaker: 'female', text: "で、あなたは？" },
            { speaker: 'male', text: "卵4個に小麦粉50g。要するに小麦粉入りのオムレツ作ってた。" },
            { speaker: 'female', text: "小麦粉入りオムレツ！そりゃ板になるわ！" },
            { speaker: 'male', text: "ポイントは、何か学んだってこと。学ぶべきことじゃないけど。英語じゃないけど。何か。" },
            { speaker: 'female', text: "生産的な先延ばし。" },
            { speaker: 'male', text: "明日勉強する。今夜はラウンド2。ちゃんとした配合で。" },
            { speaker: 'female', text: "パスタの記録つけるでしょ。" },
            { speaker: 'male', text: "小麦粉の重さ、卵の数、厚さ、味の10段階評価--" },
            { speaker: 'female', text: "ほら来た。" },
            { speaker: 'male', text: "逃げらんない。俺は計測ゴブリンだ。" },
        ],
        tone: 'humorous' as const,
        generatedAt: new Date('2026-02-25'),
    },

    englishSummary: {
        title: "Dashboard Hell -- I Made Three Metrics and Two Were the Same Thing",
        readTime: 4,
        sections: [
            {
                heading: "Five Hours, Zero English",
                paragraphs: [
                    "OK so -- let me just lay this out real quick. Today I spent five hours on my English learning app. Five hours. Wanna know how many English phrases I actually learned? Zero. Not a single one. I spent the ENTIRE time makin' the dashboard look nice.",
                    "Started with a bar chart. Too boring. Switched to a line chart with smooth cardinal spline curves. Still boring. Added a heatmap calendar. Debated the area fill gradient opacity -- should it be 25% or 30%? Made it Shopify-looking. Built a collapsible metrics guide. Five hours gone.",
                ]
            },
            {
                heading: "Three Metrics, Two Are Twins",
                paragraphs: [
                    "So I made three metrics. Reps -- pure review count, how many times you hit the button. Power -- total combat strength, the sum of all your phrase levels. And XP -- daily effort, reps times your average chakra level. Green, gold, orange. Named 'em in English and Japanese. Felt REAL good about myself.",
                    "Then I looked at 'em and went... hold on. Power is phrase count times average level. XP is reps times average level. Average level is literally the same number in both. The only difference is 'how many phrases you have' versus 'how many times you reviewed.' I spent two hours buildin' the same metric twice with different colors.",
                    "Told the AI, 'These are basically the same thing, right?' And it launched into this long-winded explanation about how they're subtly different -- Power is static, XP is dynamic, the phrase count varies -- and I just went, 'Shut up.' Because sometimes the honest answer is just 'yeah, they're the same thing, my bad.'",
                ]
            },
            {
                heading: "The Scale Doesn't Make You Thinner",
                paragraphs: [
                    "You know those people who step on the scale every morning? They look at the number, nod thoughtfully, and then eat a bag of chips? The scale's not makin' them thinner. Measuring and improving are two completely different activities. You can do one without ever doin' the other.",
                    "I'm runnin' the English version of that. I spent thirty minutes debating whether Reps and XP should share the left axis or get independent scales. I smoothed SVG path calculations. I built three-way split heatmap cells with green-orange-gold opacity gradients. Beautiful engineering. Zero English learned.",
                ]
            },
            {
                heading: "But the Stupid Graph Works",
                paragraphs: [
                    "Here's the annoyin' part though -- it actually works. Since I built the dashboard, my daily review count went up. Seein' the line climb makes me go, 'Eh, lemme do a few more.' The calendar fillin' up with color just... feels good. Humans are embarrassingly simple like that.",
                    "Measuring isn't growing. But measuring creates motivation, and motivation creates action, and action creates growth. It's a dumb roundabout path, but the wheel's turnin'. Five hours wasted? Maybe. Five hours that'll generate five hundred hours of actual study? Also maybe. The ROI is either zero or infinite and I genuinely cannot tell which.",
                    "Oh, and we named a new feature today. 'Tangent.' Took five seconds. Tangent -- like the math thing, where a line touches a curve and flies off in a different direction. That's what the feature does -- takes a journal topic, bounces off it, and lands somewhere completely different. Five hours on metrics that are the same. Five seconds on a name that's perfect. Maybe I should stop measurin' and start tangentin'.",
                ]
            }
        ]
    }
};
