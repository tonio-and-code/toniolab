/**
 * 133 - Vercelが落ちて覚者になりかけた
 * デプロイ障害から感情のサレンダーに気づいた話
 */

import { JournalEntry } from '../types';

export const vercelSurrenderEntry: JournalEntry = {
    id: '133',
    date: '2026-03-02',
    title: 'Vercelが落ちて覚者になりかけた ― デプロイ障害とサレンダーの構造',
    summary: 'Vercelの大規模障害でデプロイできず、1時間ログと格闘。結局Twitterで障害情報を見つけて終了。インフラも感情も、全部サレンダーゲームだった。',
    featured: false,
    readTime: 5,
    businessTags: ['インフラ', '障害対応', '哲学'],
    techTags: ['Vercel', 'Next.js', 'CVE', 'デプロイ'],

    // ===== Piece 1: Japanese Journal =====
    conversation: `
## デプロイが通らない

Vercelにデプロイしようとした。

Next.jsのCVE（セキュリティ脆弱性）が出て、古いバージョンがブロックされた。仕方なく15.5.12にアップグレード。ビルドは通った。350ページの静的生成も完了。

で、デプロイフェーズで「We encountered an internal error」。

は？

コード見直した。next.config見直した。package.json見直した。ビルドログ全行読んだ。「Retrying 1/3...」が200行以上並んでるログを、ひたすらスクロールして。

何も悪くない。俺のコードは完璧に動いてる。なのにVercelが「内部エラー」を返す。

## 原因はお前じゃない

結局、Vercelの大規模障害だった。

Washington D.C.、San Francisco、Dubai、EU、アジア太平洋。世界中で落ちてた。

最初からTwitter見てればよかった。1時間無駄にした。ビルドログの「Retrying 1/3...」を200行読んで、パッケージのバージョンを調べて、設定ファイルを見直して。全部意味なかった。

Claude（AI）にも聞いて、「メモリ不足かもしれません」「バージョン変えましょう」「vercel.jsonに設定追加しましょう」って提案されて、全部やりかけた。AIも障害だとは思わなかったわけだ。

「最初からTwitter調べろよ」って自分で言って、笑った。

## どこまでいってもサレンダーゲーム

でもこれ、考えてみたら全部サレンダーゲームなんだよな。

CVEが出たらアップグレードするしかない。Vercelが落ちたら待つしかない。向こうのルールに従うゲーム。自分のコードが完璧でも、インフラが止まったら何もできない。

でもそれって、自分でVPS管理してたらもっと地獄だから、結局サレンダーの恩恵でもある。障害対応はVercelの中の人が今頃汗かいてやってくれてる。

で、ここまで考えて思った。

これ、感情も同じだよな。

汗かいても、喜んでも、期待しても、怖がっても、怒っても ―― 全部サレンダー。死んでも生きても。

感情が来ること自体は止められない。Vercelが落ちたらイラつく。デプロイ通ったら嬉しい。それは起こる。

でもそれに「掴まない」ってこと。

怒りが来た、OK、通り過ぎる。喜びが来た、OK、それも通り過ぎる。

Vercelの障害と同じ。リトライしても直らない。復旧したら勝手に通る。感情も同じで、掴んでもがいても何も変わらない。来たものが過ぎるのを見てるだけ。

サレンダーって「諦め」じゃなくて「掴まない」。

覚者が言ってるのは多分そういうこと。

…で、Vercelはまだ落ちてる。
`,

    // ===== Piece 2: English Summary (Pro expression teaching) =====
    englishSummary: {
        title: "Five Expressions from the Vercel Surrender Episode",
        readTime: 5,
        sections: [
            {
                heading: "Go Full [X] Mode -- 〜モード全開になる",
                paragraphs: [
                    "'I go full detective mode.' In the Memoria, the deploy fails and he starts diggin' through build logs like a crime scene investigator. That's 'goin' full [something] mode.' You take a role or identity and crank it to maximum. The word 'full' is doin' all the heavy liftin' here -- it means you're not half-assin' it.",
                    "The pattern is endlessly flexible. 'She went full mama bear when someone yelled at her kid.' 'He went full nerd on us at dinner.' 'Don't go full Karen on the waiter.' You can slot any noun in there and people instantly get it. It's always a bit exaggerated, a bit dramatic, and that's the fun of it.",
                    "Related: 'go all out' means givin' maximum effort -- 'She went all out for the party.' 'Go all in' is from poker -- committin' everything. 'Go hard' is the gym-bro version. But 'go full [X]' is more visual and funnier than all of 'em because you're paintin' a character, not just describig effort. Oh, and there's the Tropic Thunder line: 'Never go full [X].' If you know, you know.",
                ],
                japaneseParagraphs: [
                    "\"full\" + 役割名 で「〜モード全開」。Memoriaでデプロイが落ちてビルドログを犯罪現場みたいに調べるシーン -- \"go full detective mode\"。中途半端じゃない、全力でそのキャラに入ってる感じ。\"full\" が「手加減なし」の意味を担ってる。",
                    "何でもハマる。\"full mama bear\"（母親モード全開）、\"full nerd\"（オタク全開）、\"full Karen\"（クレーマーモード全開）。名詞を入れ替えるだけで無限に作れる。常にちょっと大げさで、ちょっとドラマチック。それが面白い。",
                    "仲間: \"go all out\" = 全力を出す。\"go all in\" = ポーカー用語で全賭け。\"go hard\" = ジム系。でも \"go full [X]\" はキャラクターを描くから、努力を描写する他の表現より映像的で笑える。映画Tropic Thunderの名台詞 \"Never go full [X]\" も知っておくと通。",
                ],
            },
            {
                heading: "At Someone's Mercy -- なすがまま、振り回される",
                paragraphs: [
                    "'You're at their mercy when things break.' Mercy means kindness shown to someone you have power over. If you're 'at someone's mercy,' they hold all the cards. You can't do anything without their say-so. In the Memoria, Vercel goes down and there's literally nothin' he can do except wait. That's bein' at their mercy.",
                    "This works for any situation where someone or something else has all the control. 'Small businesses are at the mercy of big tech platforms.' 'We're at the mercy of the weather.' 'Renters are at the mercy of their landlords.' It's not always negative -- sometimes you choose to be at someone's mercy because the alternative is worse. Like usin' Vercel instead of managin' your own servers.",
                    "The mercy family is rich. 'Show mercy' = be kind to someone weaker. 'No mercy' = zero forgiveness, full intensity. 'Have mercy' = a plea, like 'have mercy, it's my first day.' 'Mercy killing' = endin' something to stop the suffering. 'Left to the mercy of' = abandoned to face it alone. One word, six shades. That's English for you.",
                ],
                japaneseParagraphs: [
                    "mercy = 慈悲。\"at someone's mercy\" = 相手の慈悲にすがるしかない状態。力関係が完全に一方的。Memoriaで Vercelが落ちて何もできない、ただ待つしかない -- まさにこれ。相手が「直す」と決めるまで、こっちは何もできない。",
                    "コントロールできない相手がいる場面なら全部使える。\"at the mercy of the weather\"（天気に振り回される）、\"at the mercy of big tech\"（大手テックになすがまま）。でもネガティブだけじゃない。自分でサーバー管理する地獄よりVercelに任せるほうがマシ、っていう「選んだサレンダー」もある。",
                    "mercyファミリーは表現が豊か。\"show mercy\" = 慈悲を見せる。\"no mercy\" = 容赦なし。\"have mercy\" = 許してくれ（\"have mercy, it's my first day\"）。\"mercy killing\" = 楽にしてやる。\"left to the mercy of\" = 放り出される。mercy一語から6つの表現。英語の奥行き。",
                ],
            },
            {
                heading: "Let It Pass -- 通り過ぎるのを見送る",
                paragraphs: [
                    "'Anger shows up? OK. It'll pass.' In the Memoria, he compares emotions to Vercel outages -- they show up uninvited, you can't fix 'em by force, and the only real option is to let 'em pass. 'Let it pass' sounds simple, but it's actually one of the hardest phrases to live by. You're not doin' anything. You're just... letting.",
                    "Usage covers everything from emotions to weather to awkward moments. 'She said somethin' weird but I just let it pass.' 'The pain'll pass, give it a few days.' 'Let the moment pass before you respond.' There's a quiet strength in 'let it pass' -- it's not passivity, it's patience. You could react, you could fight, but you choose not to.",
                    "Related: 'This too shall pass' is the philosophical big brother -- ancient proverb, means everything is temporary. 'Ride it out' is more active -- you're in the storm, holdin' on until it stops. 'Wait it out' is similar but more passive. And 'sit with it' is the therapy version -- not lettin' it pass but deliberately staying with the discomfort. Different flavors of the same wisdom.",
                ],
                japaneseParagraphs: [
                    "Memoriaで感情をVercelの障害に例えるシーン。来たものは通り過ぎる。リトライしても直らない。復旧したら勝手に通る。\"Let it pass\" = 通り過ぎるのを見送る。シンプルに聞こえるけど、実行するのが一番難しい表現かもしれない。何もしないことを選ぶ、という能動的な行為。",
                    "感情にも天気にも気まずい瞬間にも使える。\"She said somethin' weird but I let it pass\"（変なこと言ったけどスルーした）。\"The pain'll pass\"（痛みは引くよ）。受け身じゃなくて、反応しないという選択。戦えるけど戦わない。それが \"let it pass\" の静かな強さ。",
                    "仲間: \"This too shall pass\" = 古いことわざ、全ては一時的。\"Ride it out\" = 嵐の中で耐える（もうちょっと能動的）。\"Wait it out\" = ただ待つ（もっと受動的）。\"Sit with it\" = セラピー用語、不快感と一緒に座る（通り過ぎさせるんじゃなく、あえて向き合う）。同じ知恵の、違うフレーバー。",
                ],
            },
            {
                heading: "On Brand -- らしい、その人っぽい",
                paragraphs: [
                    "'Pretty on-brand for me.' He gets a philosophical revelation from a deploy error, not a meditation retreat. And that's just... very him. That's what 'on brand' means. Your 'brand' isn't a company logo -- it's your pattern, your identity, the thing people expect from you. When something fits that pattern perfectly, it's 'on brand.'",
                    "It started as a marketing term -- companies worrying about stayin' 'on brand' with their messaging. But around 2015ish it jumped to personal use and now everybody says it. 'Gettin' lost on a road trip? Very on-brand for you.' 'Forgetting my keys again? Extremely on-brand.' It's self-aware, a little self-deprecating, and kinda funny.",
                    "The opposite is 'off-brand' -- doin' somethin' people don't expect from you. 'You went to the gym at 6 AM? That's so off-brand.' There's also 'brand new' which is completely unrelated (just means new), and 'rebrand' which means changing your whole image. But 'on brand' as a personality comment? That's pure 2020s English. Social media made it happen.",
                ],
                japaneseParagraphs: [
                    "デプロイエラーから哲学的な悟りを得る。瞑想リトリートじゃなく。\"Pretty on-brand for me\" = 「いかにも俺」。\"brand\" はここでは会社のブランドじゃなくて、自分のキャラ、パターン、周りが期待する「らしさ」のこと。それにピッタリ合ってる時が \"on brand\"。",
                    "元はマーケティング用語（ブランドイメージに沿ってるか）だったのが、2015年頃から個人に転用された。\"Getting lost? Very on-brand for you\"（迷子？あなたらしい）。自虐に使えるのがポイント。自分のダメなパターンを認識してて、笑いに変えてる。",
                    "反対語は \"off-brand\" = らしくない。\"You went to the gym? That's off-brand\"（ジム？ らしくないね）。\"brand new\"（新品）は全く別の意味。\"rebrand\"（イメチェン）も関連語。でも人格コメントとしての \"on brand\" は完全に2020年代の英語。SNS文化が生んだ表現。",
                ],
            },
            {
                heading: "By That Logic -- その理屈でいくと",
                paragraphs: [
                    "From the hot dog tangent: 'By that logic, a taco's a sandwich.' Someone says a hot dog is a sandwich because it's meat between bread. She extends that logic to tacos -- and suddenly the argument falls apart. That's what 'by that logic' does. You take someone's reasoning and stretch it until it breaks.",
                    "'By that logic' is a debate weapon disguised as agreement. You're not sayin' they're wrong directly -- you're showin' them their OWN logic leads to an absurd place. 'By that logic, walking is just controlled falling.' 'By that logic, every email is a letter.' It's less aggressive than 'you're wrong' and way more effective because the other person has to deal with their own argument.",
                    "The toolbox: 'By that same logic' adds emphasis. 'Following that logic' is slightly more formal. 'That's a slippery slope' is when the extension goes to a dark place. 'Where do you draw the line?' asks them to find the boundary. And 'that's a stretch' means the logic barely holds. These are the phrases that make you dangerous in any English argument. Not louder -- sharper.",
                ],
                japaneseParagraphs: [
                    "ホットドッグのTangentから。「パンの間に肉 = サンドイッチ」→ \"By that logic, a taco's a sandwich\"（その理屈ならタコスもサンドイッチだよね）。相手の論理を延長して矛盾を見せる。直接「違う」と言わずに、相手の理屈を引き伸ばして破綻させる技。",
                    "議論のテクニックとして最強クラス。相手に直接反論するんじゃなくて、相手自身のロジックが変な場所に着地することを見せる。\"By that logic, walking is just controlled falling\"（その理屈なら歩行は制御された転倒だ）。「お前が間違ってる」より100倍効く。自分のロジックの矛盾を突きつけられるから。",
                    "議論ツールキット: \"by that same logic\" = 強調版。\"following that logic\" = ちょっとフォーマル。\"slippery slope\" = 論理の延長がヤバい方向に行く時。\"where do you draw the line?\" = 境界線はどこ？ \"that's a stretch\" = その論理はギリギリ。これらを使えると英語の議論で「うるさい」じゃなく「鋭い」になれる。",
                ],
            },
        ],
    },

    // ===== Piece 3: Memoria Conversation (Same topic) =====
    conversationData: {
        english: [
            { speaker: 'male', text: "OK so I gotta -- I gotta tell you about this thing that happened today. So I'm tryin' to deploy my site to Vercel, right? And there's this security vulnerability -- a CVE -- and they go, \"Your version's blocked. Upgrade.\" Fine. So I upgrade." },
            { speaker: 'female', text: "OK." },
            { speaker: 'male', text: "Build goes through. Three hundred and fifty pages, static generation, everything compiles, all green. And then the deploy step just... dies. \"Internal error.\" That's all it says." },
            { speaker: 'female', text: "Wait, that's it? Just \"internal error\"?" },
            { speaker: 'male', text: "That's it. No stack trace, no -- nothin'. Just \"we encountered an internal error, please try again.\" So naturally I'm like, OK, what did I break? And I start diggin'." },
            { speaker: 'female', text: "Oh no." },
            { speaker: 'male', text: "Oh yeah. I spent -- and I'm not exaggerating -- a full hour readin' build logs. And there's like two hundred lines of \"Retrying 1/3\" which tells you absolutely nothing, and I'm checkin' package versions, goin' through config files, and I even asked my AI assistant, and IT starts suggestin' things --" },
            { speaker: 'female', text: "The AI didn't know either?" },
            { speaker: 'male', text: "The AI didn't know! It's like, \"Maybe it's a memory issue, try a different version, add this setting\" -- and I'm, uh, doin' all of it. Every single suggestion." },
            { speaker: 'female', text: "And?" },
            { speaker: 'male', text: "And nothing works. 'Cause it was a Vercel outage. The whole platform was down. Globally. Washington, San Francisco, Dubai, everywhere. And I could've just... checked Twitter." },
            { speaker: 'female', text: "Ha! One search!" },
            { speaker: 'male', text: "One search! Five seconds! But no, I'm over here for an hour debuggin' my config like it's MY fault. Like I personally broke Vercel's infrastructure." },
            { speaker: 'female', text: "That's -- OK, that's honestly really funny. But also I get it. Your first instinct is always \"I broke something.\"" },
            { speaker: 'male', text: "Right, right. And that's -- that's actually what got me thinkin' about this whole... surrender thing." },
            { speaker: 'female', text: "Surrender?" },
            { speaker: 'male', text: "Yeah, so -- hear me out. The whole situation is basically a surrender game. A security vulnerability drops, you upgrade. No choice. The platform goes down, you wait. That's it. You're playin' by someone else's rules and there's no option C." },
            { speaker: 'female', text: "I mean... yeah? But isn't that just, like, using any service? You're always dependent on something." },
            { speaker: 'male', text: "Yeah, but here's the thing. It goes both ways. When it breaks, you're stuck. But ALSO, you don't have to manage your own servers. You don't wake up at 3 AM 'cause your VPS crashed. Someone at Vercel is, um, sweating that problem right now so I don't have to. So surrender's not just the bad parts." },
            { speaker: 'female', text: "Huh. OK, I actually like that. The surrender gives you stuff too." },
            { speaker: 'male', text: "Exactly. And then -- this is where it gets kinda weird -- I started thinkin' about emotions. 'Cause it's the same thing, right? You get angry. Can you stop that? You get excited, scared -- it just... shows up." },
            { speaker: 'female', text: "Wait, you're comparing emotions to a Vercel outage?" },
            { speaker: 'male', text: "I am! And I know it sounds weird but think about it. You didn't ask for the anger. You can't prevent it. And you can sit there hittin' retry -- tryin' to push it away or fix it -- but it doesn't work. It just has to pass on its own." },
            { speaker: 'female', text: "That's... actually kinda good. So surrender isn't giving up." },
            { speaker: 'male', text: "No, that's the key. It's not giving up. It's not gripping. Anger shows up? Fine, let it pass. Joy shows up? Cool, that passes too. You're not fighting, you're not chasing, you're just... watching it move through." },
            { speaker: 'female', text: "But even the good stuff? You don't hold onto happiness either?" },
            { speaker: 'male', text: "That's -- yeah. That's the hard part. 'Cause we WANT to grip the good stuff. \"Oh this is great, lemme keep this forever.\" But that's where the suffering comes from. You grip the good, you push away the bad, and you're just... constantly fighting what's actually happening." },
            { speaker: 'female', text: "So the enlightened people -- they're not happy all the time?" },
            { speaker: 'male', text: "I don't think so. I think they just let stuff come and go. They're not on a roller coaster 'cause they're not holding on. The ride's still happening, ups and downs, they're just... sittin' there. Not gripping." },
            { speaker: 'female', text: "Sitting on a roller coaster without holding on. That's terrifying AND beautiful." },
            { speaker: 'male', text: "Right? And it took a Vercel outage for me to get that. Not a meditation retreat. Not some book. A deployment error. Pretty on-brand for me." },
            { speaker: 'female', text: "Getting enlightened from a 500 error." },
            { speaker: 'male', text: "A 500 error and a build log. That's my spiritual path apparently." },
            { speaker: 'female', text: "Is Vercel back up yet?" },
            { speaker: 'male', text: "...No." },
            { speaker: 'female', text: "So you're just..." },
            { speaker: 'male', text: "Surrendering. Yeah." },
        ],
        japanese: [
            { speaker: 'male', text: "ちょっと聞いてよ、今日あったこと。Vercelにデプロイしようとしたんだけどさ、セキュリティの脆弱性が出て、「古いバージョンはブロックします、アップグレードしてください」って。しょうがないからアップグレードした。" },
            { speaker: 'female', text: "うん。" },
            { speaker: 'male', text: "ビルドは通った。350ページ、静的生成、コンパイル、全部グリーン。で、デプロイのステップで死んだ。「内部エラー」。それだけ。" },
            { speaker: 'female', text: "え、それだけ？「内部エラー」だけ？" },
            { speaker: 'male', text: "それだけ。スタックトレースもなし。「内部エラーが発生しました、もう一度お試しください」だけ。当然「何壊した？」ってなるじゃん。で、調べ始めた。" },
            { speaker: 'female', text: "あー..." },
            { speaker: 'male', text: "いや、まじで。1時間、誇張じゃなく1時間、ビルドログ読んでた。「Retrying 1/3」が200行並んでて何の情報量もないやつ。パッケージのバージョン調べて、設定ファイル見直して、AIにも聞いたらAIも提案し始めて --" },
            { speaker: 'female', text: "AIも分かんなかったの？" },
            { speaker: 'male', text: "分かんなかった！「メモリの問題かもしれません」「バージョン変えましょう」「設定にこれ追加しましょう」って。で、全部やりかけた。全部試した。" },
            { speaker: 'female', text: "で？" },
            { speaker: 'male', text: "で、何も直らない。だって、Vercelの障害だったから。プラットフォーム全体が落ちてた。世界規模で。Washington、San Francisco、Dubai、全部。Twitter見ればすぐ分かった。" },
            { speaker: 'female', text: "あはは！検索1回で！" },
            { speaker: 'male', text: "1回！5秒！なのに俺は1時間、設定ファイルデバッグしてた。俺がVercelのインフラ壊したみたいな顔して。" },
            { speaker: 'female', text: "それは...正直おもしろい。でも分かる。最初に「自分が壊した」って思うよね。" },
            { speaker: 'male', text: "そうそう。で、それがきっかけで考え始めたんだよ。サレンダーの話。" },
            { speaker: 'female', text: "サレンダー？" },
            { speaker: 'male', text: "そう。だってさ、全部サレンダーゲームじゃん。脆弱性が出たらアップグレードするしかない。プラットフォーム落ちたら待つしかない。ずっと誰かのルールで遊んでて、選択肢Cがない。" },
            { speaker: 'female', text: "まあ...そうだけど、それってサービス使ってたら当たり前じゃない？常に何かに依存してる。" },
            { speaker: 'male', text: "そうなんだけど、逆もあるんだよ。壊れた時は詰む。でも自分でサーバー管理しなくていい。朝3時にVPS落ちて起こされない。Vercelの中の人が今頃汗かいて対応してくれてる。サレンダーって悪いことだけじゃない。" },
            { speaker: 'female', text: "あー、なるほど。サレンダーで得られるものもある。" },
            { speaker: 'male', text: "そう。で、ここからちょっと変な方向行くんだけど、感情も同じだなって。だって同じじゃん？怒りが来る、止められる？興奮したり怖くなったり、勝手に来る。" },
            { speaker: 'female', text: "感情をVercelの障害に例えてるの？" },
            { speaker: 'male', text: "例えてる！変に聞こえるのは分かるけど考えてみて。怒りは頼んでない。防げない。で、リトライするみたいに押し返そうとしても意味ない。勝手に通り過ぎるのを待つしかない。" },
            { speaker: 'female', text: "それ...実はけっこういいかも。じゃあサレンダーって諦めじゃないんだ。" },
            { speaker: 'male', text: "違う。そこが肝。諦めじゃなくて掴まない。怒りが来た？いい、通り過ぎる。喜びが来た？いい、それも通り過ぎる。何とも戦ってない、何も追いかけてない、ただ通り過ぎるのを見てる。" },
            { speaker: 'female', text: "でもいいものも？幸せにも掴まない？" },
            { speaker: 'male', text: "そう。それが難しい。いいものは掴みたいじゃん。「ずっとこの気分でいたい」って。でもそれが苦しみの元。いいものを掴んで、悪いものを押し返して、ずっと現実と戦ってる。" },
            { speaker: 'female', text: "じゃあ覚者って、ずっと幸せなわけじゃないの？" },
            { speaker: 'male', text: "多分違う。来るものを来させて去るものを去らせてるだけ。ジェットコースター乗ってるけど何も掴まってない。上がり下がりはあるけど、ただ座ってる。" },
            { speaker: 'female', text: "ジェットコースターで掴まらない。怖いけど美しいね。" },
            { speaker: 'male', text: "な。で、それに気づいたのがVercelの障害きっかけっていう。瞑想でもなく本でもなく、デプロイエラー。俺らしい。" },
            { speaker: 'female', text: "500エラーで悟り開くの！" },
            { speaker: 'male', text: "500エラーとビルドログ。それが俺のスピリチュアルパスらしい。" },
            { speaker: 'female', text: "Vercelもう復旧した？" },
            { speaker: 'male', text: "...してない。" },
            { speaker: 'female', text: "じゃあ今は..." },
            { speaker: 'male', text: "サレンダー中。" },
        ],
        tone: 'philosophical' as const,
        generatedAt: new Date('2026-03-02'),
    },

    // ===== Piece 4: Tangent (Completely different topic) =====
    tangentData: {
        english: [
            { speaker: 'male', text: "OK completely random question -- is a hot dog a sandwich?" },
            { speaker: 'female', text: "Oh no. We're doin' this?" },
            { speaker: 'male', text: "We're doin' this. I was at Costco the other day, right? Eatin' a hot dog. And the guy next to me goes, \"That's a good sandwich.\" And I just -- I froze." },
            { speaker: 'female', text: "He called your hot dog a sandwich." },
            { speaker: 'male', text: "He called it a sandwich! And I didn't know what to do with that information. 'Cause if you think about it, it's meat between bread. That's -- I mean, that's technically a sandwich, right?" },
            { speaker: 'female', text: "OK but by that logic, a taco's a sandwich." },
            { speaker: 'male', text: "Is a taco a sandwich?!" },
            { speaker: 'female', text: "No! A taco is a taco!" },
            { speaker: 'male', text: "But it's filling inside a, um, bread-adjacent container. How is that different from a sub? Like, a Subway sandwich. That bread doesn't fully separate either. Neither does a hot dog bun. So they're -- are they the same thing?" },
            { speaker: 'female', text: "I hate that you're making sense right now." },
            { speaker: 'male', text: "And then there's the structural argument versus the ingredient argument. Structurally, a hot dog is basically an open-faced sub. But ingredient-wise, nobody puts yellow mustard and relish on a sandwich. Those are hot dog toppings." },
            { speaker: 'female', text: "Wait, people definitely put mustard on sandwiches." },
            { speaker: 'male', text: "Different mustard! Hot dog mustard is that bright yellow squeeze bottle stuff. Sandwich mustard is dijon or whole grain or whatever. They're completely different mustards livin' in different culinary universes." },
            { speaker: 'female', text: "You've thought about this way too much." },
            { speaker: 'male', text: "I've thought about it the exact right amount. And here's my final take. A hot dog is structurally a sandwich but culturally NOT a sandwich. If someone invites you over and says, \"I'm makin' sandwiches,\" and hands you a hot dog? You'd be confused." },
            { speaker: 'female', text: "Ha! That's true. I'd be like, \"This is... not what I expected.\"" },
            { speaker: 'male', text: "Right? So it's a sandwich by definition but not by vibes. And honestly, I think vibes win." },
            { speaker: 'female', text: "Vibes over definitions. There's a life lesson in there somewhere." },
            { speaker: 'male', text: "Don't. Don't make the hot dog deep." },
            { speaker: 'female', text: "The hot dog is already deep. You just won't accept it." },
        ],
        japanese: [
            { speaker: 'male', text: "全然関係ない質問なんだけど、ホットドッグってサンドイッチなの？" },
            { speaker: 'female', text: "えー、その話する？" },
            { speaker: 'male', text: "する。この前コストコでホットドッグ食べてたら隣の人が「いいサンドイッチだね」って。固まった。" },
            { speaker: 'female', text: "ホットドッグをサンドイッチって呼んだの。" },
            { speaker: 'male', text: "呼んだ！で、考えてみたらパンの間に肉。それって技術的にはサンドイッチじゃない？" },
            { speaker: 'female', text: "その理屈だとタコスもサンドイッチになるよ。" },
            { speaker: 'male', text: "タコスはサンドイッチなの？！" },
            { speaker: 'female', text: "違う！タコスはタコス！" },
            { speaker: 'male', text: "でもパンっぽいものの中に具が入ってる。サブウェイのサンドイッチと何が違うの？あのパンも完全には分かれてない。ホットドッグのパンも分かれてない。じゃあ同じもの？" },
            { speaker: 'female', text: "今あなたが正論言ってるの腹立つ。" },
            { speaker: 'male', text: "で、構造的な議論と材料の議論があって。構造的にはホットドッグはオープンフェイスのサブ。でも材料的には、サンドイッチに黄色いマスタードとレリッシュは乗せない。あれはホットドッグのトッピング。" },
            { speaker: 'female', text: "サンドイッチにマスタードつける人いるでしょ。" },
            { speaker: 'male', text: "マスタードが違う！ホットドッグのは黄色いチューブのやつ。サンドイッチのはディジョンとか粒マスタード。全然違うマスタードが違う料理宇宙にいる。" },
            { speaker: 'female', text: "考えすぎでしょ。" },
            { speaker: 'male', text: "ちょうどいい量考えてる。で、最終結論。ホットドッグは構造的にはサンドイッチだけど文化的にはサンドイッチじゃない。「サンドイッチ作るね」って言われてホットドッグ出てきたら困るでしょ。" },
            { speaker: 'female', text: "あはは！確かに。「思ってたのと違う」ってなる。" },
            { speaker: 'male', text: "でしょ。定義的にはサンドイッチだけどバイブス的にはサンドイッチじゃない。バイブスが勝つ。" },
            { speaker: 'female', text: "バイブスが定義に勝つ。人生の教訓っぽい。" },
            { speaker: 'male', text: "やめて。ホットドッグを深くしないで。" },
            { speaker: 'female', text: "ホットドッグはもう深いよ。あなたが受け入れないだけ。" },
        ],
        tone: 'humorous' as const,
        generatedAt: new Date('2026-03-02'),
    },
};
