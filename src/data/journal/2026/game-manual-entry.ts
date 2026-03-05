/**
 * 134 - ゲームの説明書を書いたら、ゲームが始まった
 * XPガイドを書いたことで見えた、仕様書と現実の関係
 */

import { JournalEntry } from '../types';

export const gameManualEntry: JournalEntry = {
    id: '134',
    date: '2026-03-04',
    title: 'ゲームの説明書を書いたら、ゲームが始まった ― XPガイドと仕様書の魔法',
    summary: '英語トレーニングの全仕組みをゲームマニュアルとして書き出した。パチンコ、ポケモン、スロット。書いた瞬間、コードより先にゲームが存在し始めた。',
    featured: false,
    readTime: 5,
    businessTags: ['ゲーミフィケーション', '仕様書', 'UX設計'],
    techTags: ['XP', 'ガチャ', '確率設計', 'ゲームデザイン'],

    // ===== Piece 1: Japanese Journal =====
    conversation: `
## ゲームの説明書を書いた

XPガイドというページを作った。

英語トレーニングシステムの仕組みを全部書き出した説明書。チャクラシステム、スロットマシン、連荘モード、運気システム、カードランク。テーブルと数字とルール。10セクション。目次付き。

昔のゲームに入ってた説明書あるじゃん。ファミコンとかスーファミの箱を開けたら最初に入ってる、あの薄い冊子。あれを英語学習アプリ用に書いた。

## パチンコの構造だけ借りた

Entry 130で書いた。パチンコが嫌いだ、でも仕組みは天才だ、と。

その仕組みを丸ごと持ってきた。確変、激熱、連荘カウンター。3連で確変突入、5連で激熱、10連で神モード。ハズレ確率がどんどん下がる。パチンコそのもの。

ただし、一番大事なところだけ変えた。

パチンコは胴元が必ず勝つ。数学的に確定してる。長く打てば打つほど負ける。

このシステムは逆。やればやるほど運が良くなる。SPが貯まると運気ステータスが上がって、激レアティアの確率が倍になる。10,000SP貯めたらLUCK x2.0。PHANTOMの1/8192が1/4096になる。

胴元がいない。というか胴元は俺で、俺はプレイヤーに勝ってほしい。

## ポケモンの記憶を借りる

確率設計で一番こだわったのは、数字を「体験」に変換すること。

SHINYティアの確率は1/4096。これはポケモン第6世代の色違い遭遇率と完全に同じ。PHANTOMは1/8192で、第5世代。MYTHICは1/400で、パチンコの海物語。

「0.024%」って言われてもピンとこない。でも「ポケモンの色違いと同じ確率」って言われた瞬間、あの草むらを3時間歩き回った記憶が蘇る。画面がキラッて光った時の興奮。

他人の体験記憶を借りて、自分のシステムに重ねる。ゼロから「この確率はすごいです」って説明するより、「あれと同じ」の一言で全部伝わる。

## 説明書が先、コードが後

面白いことに気づいた。

ゲームのコードはまだ半分しかできてない。スロットは回るけどカードランクはまだ。マイルストーン演出も未実装。運気の表示もまだ。

でも説明書は完成してる。

チャクラの7段階、9ティアの確率表、連荘の4モード、運気の計算式、カードの6ランク。全部ページの上に存在してる。

で、不思議なことに、それだけでもう「ゲーム」に見える。

説明書を読んだ人は「確変突入したら激熱狙えるんだ」って考える。「PHANTOM引くには神モードに入りたい」って計算する。コードがなくても、脳内でプレイが始まってる。

仕様書を書くと、現実が仕様に追いつこうとする。

## 自分が一番ハマってる

最大の問題がある。

このシステムを一番プレイしたがってるの、俺自身。

XPガイドを書いてて途中で気づいた。「これ俺がやりたいゲームだ」。PHANTOM引きたい。神モード入りたい。LEGENDARYカード作りたい。

英語を教えるシステムを設計してるはずが、自分用のゲームを作ってた。

まあ、それが一番いいんだけどな。自分がやりたくないものを人に勧めるのは詐欺だし。最初の客は常に自分。自分がやりたくなければ、誰もやらない。

…で、まだカードランクの実装してないんだけど。説明書はもう完成してるんだけど。

順番おかしくない？

いや、これでいい。説明書が先。コードは後から追いつく。
`,

    // ===== Piece 2: English Summary (Pro expression teaching) =====
    englishSummary: {
        title: "Five Expressions from the Game Manual Episode",
        readTime: 5,
        sections: [
            {
                heading: "Scratch That Itch -- ムズムズを解消する",
                paragraphs: [
                    "'I'm sittin' here scratchin' my own itch.' In the Memoria, he builds this elaborate gamification system for English learners -- XP, slot machines, chain combos, the whole nine yards -- and then realizes he's the person who wants to play it most. That's 'scratchin' your own itch.' You build something because YOU need it. The itch is a craving, a frustration, a gap that won't go away until someone fills it.",
                    "In tech and business, 'scratch your own itch' is basically a startup philosophy. Basecamp, Craigslist, Slack -- all started because the founders had a problem nobody else was solvin'. 'I was tired of bad project management tools, so I scratched my own itch.' But it works outside tech too. 'She started cookin' 'cause no restaurant in town scratched that itch.' 'He built a home gym to scratch the itch.'",
                    "Related: 'an itch you can't scratch' means a craving you can't satisfy -- super frustrating. 'Get it out of your system' is similar but more about doing something once to stop wanting it. 'Fill a void' is the emotional version. And 'have an itch for' is a lighter way to say you want something -- 'I've got an itch for sushi tonight.' The word 'itch' is doin' a LOT of work in English. One sensation, six different expressions.",
                ],
                japaneseParagraphs: [
                    "Memoriaで、英語学習者向けにXP、スロット、チェーンコンボの仕組みを全部作って、結局「一番やりたいの自分じゃん」って気づくシーン。\"scratch your own itch\" = 自分のムズムズを自分で解消する。痒いところを自分でかく。誰かが埋めてくれるのを待つんじゃなく、自分で作る。",
                    "テック業界では起業哲学の定番。Basecamp、Craigslist、Slack -- 全部創業者が「これ誰も作ってくれないから自分で作った」。でもテック以外でも使える。\"She started cooking 'cause no restaurant scratched that itch\"（どの店も満足できなくて自炊し始めた）。",
                    "仲間: \"an itch you can't scratch\" = 解消できない欲求（超フラストレーション）。\"get it out of your system\" = 一回やって気が済む。\"fill a void\" = 感情的な穴を埋める。\"have an itch for\" = 軽い欲求（\"I've got an itch for sushi tonight\" = 今夜寿司な気分）。\"itch\" 一語で6つの表現。英語の便利さ。",
                ],
            },
            {
                heading: "Stack the Deck -- 自分に有利な仕組みを作る",
                paragraphs: [
                    "'You're stackin' the deck in your own favor.' In card games, 'stacking the deck' means secretly arranging the cards so you win. It's cheating. But in the Memoria, he flips it. His learning system is DESIGNED so the more you play, the luckier you get. SP raises your luck stat, luck makes ultra-rares more likely. He's deliberately stackin' the deck -- but for the player, not against them.",
                    "Normally this phrase is negative. 'The system is stacked against small businesses.' 'College admissions are stacked in favor of the wealthy.' 'The deck was stacked from the start.' It implies unfairness, rigged outcomes. But when you stack the deck in YOUR OWN favor through effort -- like studyin' hard before an exam or networkin' before a job search -- it becomes a smart move, not a dirty one.",
                    "'Stack the deck' is part of a bigger family. 'The odds are stacked against you' means the situation is unfair. 'Play the hand you're dealt' means accept your circumstances. 'Deal someone a bad hand' means give them a tough situation. 'Hold all the cards' means have all the power. Notice how English uses card games to talk about life? We live in metaphors and half of 'em come from gambling.",
                ],
                japaneseParagraphs: [
                    "カードゲームで \"stack the deck\" = カードを仕込んで自分が勝つようにする。イカサマ。でもMemoriaでは逆転してる。学習システムを「やるほど運が良くなる」仕組みに設計してる。SP貯める→運気上がる→激レア出やすくなる。プレイヤーのためにデッキを積む。",
                    "普通はネガティブ。\"stacked against small businesses\"（中小企業に不利）、\"stacked in favor of the wealthy\"（金持ち有利）。不公平、出来レース。でも自分の努力で有利にする場合 -- 試験前にしっかり勉強する、面接前にコネ作る -- は「賢い戦略」になる。同じ表現で善悪が逆転する。",
                    "トランプ系表現ファミリー: \"odds are stacked against you\" = 状況が不利。\"play the hand you're dealt\" = 配られた手で勝負する。\"deal someone a bad hand\" = 不利な状況を与える。\"hold all the cards\" = 全権力を握る。英語は人生をトランプで語る。比喩の半分はギャンブルから来てる。",
                ],
            },
            {
                heading: "The House Always Wins -- 胴元が必ず勝つ",
                paragraphs: [
                    "'The house always wins. That's the fundamental problem.' In the Memoria, he's explainin' why he took pachinko mechanics but rejected pachinko economics. Pachinko is brilliant game design -- kakuhen, chain combos, probability shifts -- but the math guarantees you lose. 'The house' is the casino, the establishment, the one running the game. And the house ALWAYS wins. Not sometimes. Always.",
                    "This phrase extends way beyond gambling. 'I tried to negotiate my cable bill but the house always wins.' 'Social media algorithms -- the house always wins.' 'Insurance companies? House always wins.' Any time you're dealin' with a system designed to extract value from you, the house always wins. It's become kinda cynical shorthand for 'the system is rigged and you can't beat it.'",
                    "The beauty of the Memoria moment is the flip: 'There IS no house. Or the house is me, and I want you to win.' That's rare. Related: 'beat the house' means overcoming the system -- 'She beat the house and got a full refund.' 'Play house money' means risking nothing because you're already ahead. And 'on the house' means free -- 'This drink's on the house.' Four expressions, one word, zero connection between 'em. English is wild.",
                ],
                japaneseParagraphs: [
                    "Memoriaでパチンコの仕組みを借りたけどパチンコの経済を拒否した理由。パチンコは天才的ゲームデザイン -- 確変、チェーン、確率変動 -- でも数学的に必ず負ける。\"the house\" = カジノ、胴元、運営側。\"always\" がポイント。時々じゃなく、必ず。",
                    "ギャンブル以外にも広く使える。\"Tried to negotiate my cable bill but the house always wins\"（ケーブルTV値下げ交渉したけど無理だった）。SNSのアルゴリズム、保険会社、何でも。自分から価値を搾り取るシステム相手なら全部使える。「仕組まれてて勝てない」の皮肉な短縮形。",
                    "Memoriaの名シーン: \"There IS no house. Or the house is me, and I want you to win.\"（胴元がいない。いるとしたら俺で、俺はプレイヤーに勝ってほしい）。仲間: \"beat the house\" = システムに勝つ。\"play house money\" = 既に勝ってるからリスクゼロ。\"on the house\" = おごり。4つの表現、\"house\" 一語、意味の繋がりゼロ。英語ってやつは。",
                ],
            },
            {
                heading: "Go Through the Motions -- 形だけやる",
                paragraphs: [
                    "'You're standin' there, goin' through the motions, pressin' a button that does nothin'.' From the elevator tangent. You know the close-door button in elevators? Most of 'em don't work. They've been disconnected since the ADA passed in 1990. But people keep pressin' them. That's 'going through the motions.' You're doing the actions without the actions actually doing anything.",
                    "This one's everywhere in daily life. 'I went to the gym but I was just goin' through the motions.' 'He showed up to work but he was clearly goin' through the motions.' 'She apologized but it felt like she was goin' through the motions.' The key nuance: the EXTERNAL behavior looks right, but the internal substance is missing. The form is there. The meaning isn't.",
                    "Interesting contrast: 'fake it till you make it' is going through the motions ON PURPOSE, hoping the substance eventually catches up. 'Just show up' is the motivational version -- sometimes going through the motions IS enough, especially on bad days. And 'phone it in' is the harsher version -- doin' the bare minimum with zero effort. The elevator button is the perfect physical metaphor: the motion feels real, the result is zero, and you do it anyway because the motion itself is oddly satisfying.",
                ],
                japaneseParagraphs: [
                    "Tangentのエレベーターの話から。「閉」ボタン、実はほとんど配線されてない。1990年のADA（障害者差別禁止法）以降、ドアは一定時間開いてないといけない。でもみんな押し続ける。\"go through the motions\" = 動作はしてるけど、効果がない。形だけ。",
                    "日常のどこにでも使える。\"Went to the gym but just goin' through the motions\"（ジム行ったけど惰性でやってた）。\"She apologized but it felt like goin' through the motions\"（謝ったけど心がなかった）。外側の行動は正しいけど、中身が空っぽ。形はある。意味がない。",
                    "面白い対比: \"fake it till you make it\" = わざと形だけやって、中身が追いつくのを待つ（ポジティブ）。\"just show up\" = とにかく現れろ（調子悪い日はこれだけでOK）。\"phone it in\" = やる気ゼロの最低限（もっとキツい言い方）。エレベーターのボタンは完璧な比喩。動作はリアル、結果はゼロ、でも押す行為自体がなぜか気持ちいい。",
                ],
            },
            {
                heading: "Push Someone's Buttons -- 人の神経を逆なでする",
                paragraphs: [
                    "From the tangent: 'That pushes my buttons in a very specific way.' She drops this as a pun -- they're literally talkin' about elevator buttons that don't work, and she pivots to the emotional meaning. 'Push someone's buttons' means to annoy or provoke them, usually in a way that's targeted and deliberate. You know exactly WHICH buttons to push because you know the person.",
                    "'My little brother knows exactly how to push my buttons.' 'Don't let him push your buttons -- that's what he wants.' 'She's really good at pushin' people's buttons.' The image is a control panel: everyone's got specific triggers, and someone who knows you well can find the right one. It's almost always intentional. Accidental button-pushing is just 'annoying.' Deliberate button-pushing is 'manipulative.'",
                    "The family: 'hot button' is a topic that triggers strong reactions -- 'Immigration is a hot-button issue.' 'Hit a nerve' is similar but more about accidentally touchin' a sensitive spot. 'Get under someone's skin' means irritate them so deeply they can't shake it. 'Wind someone up' is the British version. And 'trigger' has, uh, evolved -- it used to be neutral but now carries a whole internet-culture layer. 'Push someone's buttons' stays clean. It's playful. It's almost affectionate. Like, 'I know your buttons and I'm pushin' 'em because I love you.'",
                ],
                japaneseParagraphs: [
                    "Tangentでエレベーターのボタンの話をしてて、彼女が \"That pushes my buttons\" ってダジャレ。物理的なボタンの話から感情のボタンに転換。\"push someone's buttons\" = 人の怒りのツボを押す。狙って刺激する。相手をよく知ってるから「どのボタン」か分かる。",
                    "\"My little brother knows how to push my buttons\"（弟は俺のキレるポイントを知ってる）。\"Don't let him push your buttons\"（挑発に乗るな）。イメージはコントロールパネル。誰にでも特定のトリガーがあって、親しい人はその位置を知ってる。偶然イラつかせるのは \"annoying\"。わざとやるのが \"push buttons\"。",
                    "仲間: \"hot button\" = 強い反応を起こすテーマ（\"Immigration is a hot-button issue\"）。\"hit a nerve\" = うっかり敏感な部分に触れる。\"get under someone's skin\" = 深いところまでイラつかせる。\"wind someone up\" = イギリス英語版。\"trigger\" は元々中立だったけど今はネット文化の層が乗ってる。\"push buttons\" は軽い。ほぼ愛情表現。「あなたのボタン知ってるから押してるんだよ」的な。",
                ],
            },
        ],
    },

    // ===== Piece 3: Memoria Conversation (Same topic: XP Guide / Game Manual) =====
    conversationData: {
        english: [
            { speaker: 'male', text: "So I, um -- I did this thing where I wrote a complete game manual. Like, a full-on instruction booklet. For my English app." },
            { speaker: 'female', text: "A game manual?" },
            { speaker: 'male', text: "Yeah! Like the ones that used to come inside video game boxes? Except it's for -- OK so you know how I built this training system with XP and slot machines and stuff? I went and wrote every single rule down. Every probability, every number, every mode. On a page. With a table of contents." },
            { speaker: 'female', text: "Wait, you published the actual odds?" },
            { speaker: 'male', text: "Published 'em! The whole thing. PHANTOM tier is 1/8192, SHINY is 1/4096, MYTHIC is 1/400. It's right there. Anybody can look at it." },
            { speaker: 'female', text: "That's... not normal. Most games hide that." },
            { speaker: 'male', text: "Right? And that's -- that's kinda the point. 'Cause I was thinkin' about pachinko, right? I wrote about this before. Pachinko has this, um, incredible structure -- kakuhen, which is the probability shift mode, and gekiatsu, the super hot mode, and this chain system where you keep hittin' and the odds keep changing. It's genuinely brilliant game design." },
            { speaker: 'female', text: "But..." },
            { speaker: 'male', text: "But the house always wins. That's -- like, that's the fundamental problem with pachinko. No matter how clever the chain combos are, no matter how exciting gekiatsu feels, the math is set up so you lose. The longer you play, the more you lose. Every. Single. Time." },
            { speaker: 'female', text: "And yours is different?" },
            { speaker: 'male', text: "Mine flips it. I took the exact same structure -- kakuhen at 3 chains, gekiatsu at 5, god mode at 10 -- but the more you play, the STRONGER you get. You earn SP from the slot, and SP raises your luck stat, and luck makes the ultra-rare tiers more likely. So instead of, you know, bleedin' money, you're stackin' the deck in your own favor. Every spin makes the next spin better." },
            { speaker: 'female', text: "So the house doesn't win." },
            { speaker: 'male', text: "There IS no house! Or -- well, the house is me. And I want you to win. That's the whole difference. Pachinko wants your money. I want your English to get better." },
            { speaker: 'female', text: "Ha!" },
            { speaker: 'male', text: "I'm serious." },
            { speaker: 'female', text: "No, I believe you. I just -- the way you said it. OK, so where'd you get the specific numbers? Like, 1/8192. That's very specific." },
            { speaker: 'male', text: "Pokemon." },
            { speaker: 'female', text: "...Pokemon?" },
            { speaker: 'male', text: "Gen 5 shiny encounter rate. 1/8192. And gen 6 is 1/4096. If you've -- like, if you've ever played Pokemon, those numbers are burned into your brain. I don't need to explain what 1/4096 feels like. You already know. You remember that grass. You remember walking in circles for three hours." },
            { speaker: 'female', text: "You're borrowing other people's memories." },
            { speaker: 'male', text: "YES. That's -- that's exactly what I'm doing. 'Cause if I just wrote '0.024 percent,' that's nothin'. Nobody feels that. But 'same odds as a shiny Pokemon'? Now you feel it. Now you remember the screen sparkling and your heart -- like, your actual heart rate goin' up. I'm borrowing that feeling and attaching it to my system." },
            { speaker: 'female', text: "That's actually really smart. But here's my thing -- you said the game isn't finished yet?" },
            { speaker: 'male', text: "Uh, half finished. The slot spins, the XP works, chains work, but card ranks aren't in yet. Milestones aren't in. The luck system isn't fully wired up to the display." },
            { speaker: 'female', text: "But the manual is done." },
            { speaker: 'male', text: "The manual is done." },
            { speaker: 'female', text: "Doesn't that feel backwards?" },
            { speaker: 'male', text: "It should, right? But -- and this is the weird part -- writing the manual is what made it real. Before I wrote it, it was just... scattered code. A slot here, an XP counter there, a chain tracker somewhere. But once I put 'CONTENTS: 1. Currency. 2. Chakra. 3. Player Level' -- once I wrote it like a game manual, it FELT like a game. The spec created the experience." },
            { speaker: 'female', text: "The manual creates the game. Not the code." },
            { speaker: 'male', text: "Not the code. The manual. Someone reads it and goes, 'Oh, so if I hit god mode, PHANTOMs are 10 times easier.' They're already playing. In their head. Before touchin' a single button." },
            { speaker: 'female', text: "Huh." },
            { speaker: 'male', text: "And the funniest part? The person who wants to play this game the most is me. I wrote it and I'm sittin' there going, 'I wanna hit PHANTOM. I wanna reach god mode. I wanna build a LEGENDARY card.' I designed it for English learners and I'm over here scratchin' my own itch." },
            { speaker: 'female', text: "You built a game nobody asked for and you're the biggest fan." },
            { speaker: 'male', text: "That's -- yeah. That's exactly what happened. And honestly? I think that's the right way to do it. If you wouldn't play your own game, why would anyone else?" },
            { speaker: 'female', text: "The first customer is yourself." },
            { speaker: 'male', text: "The first customer is always yourself." },
        ],
        japanese: [
            { speaker: 'male', text: "あのさ、ちょっと変なことしたんだけど。ゲームの説明書を書いた。ちゃんとした取扱説明書。英語アプリ用の。" },
            { speaker: 'female', text: "ゲームの説明書？" },
            { speaker: 'male', text: "そう！昔ゲームの箱に入ってたやつあるじゃん？あれを英語トレーニング用に書いた。XPとかスロットマシンとか作ったの知ってるでしょ？そのルールを全部、確率も数字もモードも全部、一つのページに書き出した。目次付きで。" },
            { speaker: 'female', text: "え、確率を公開したの？" },
            { speaker: 'male', text: "公開した！全部。PHANTOMが1/8192、SHINYが1/4096、MYTHICが1/400。誰でも見れる。" },
            { speaker: 'female', text: "それ...普通じゃないよね。大抵のゲームは隠すでしょ。" },
            { speaker: 'male', text: "でしょ？で、そこがポイント。パチンコのこと考えてて。前にも書いたけど、パチンコって仕組みがすごいんだよ。確変、激熱、チェーンシステム。当たりが続くと確率が変わっていく。ゲームデザインとしては天才的。" },
            { speaker: 'female', text: "でも..." },
            { speaker: 'male', text: "でも胴元が必ず勝つ。そこがパチンコの根本的な問題。どんなにチェーンコンボが面白くても、激熱がどんなに興奮しても、数学的に負けるようにできてる。長く打てば打つほど負ける。必ず。" },
            { speaker: 'female', text: "で、あなたのは違うの？" },
            { speaker: 'male', text: "逆にした。構造は同じ -- 3連で確変、5連で激熱、10連で神モード -- でもやればやるほど強くなる。スロットでSPが貯まって、SPが運気を上げて、運気が激レアの確率を上げる。金を失う代わりに、自分に有利な仕組みを積み上げてる。回すたびに次の一回が良くなる。" },
            { speaker: 'female', text: "胴元が勝たないんだ。" },
            { speaker: 'male', text: "胴元がいない！いるとしたら俺で、俺はプレイヤーに勝ってほしい。パチンコは金が欲しい。俺は英語が上手くなってほしい。" },
            { speaker: 'female', text: "あはは！" },
            { speaker: 'male', text: "まじで言ってる。" },
            { speaker: 'female', text: "いや、分かる。言い方が面白かっただけ。で、確率の数字はどこから？1/8192って、すごく具体的だけど。" },
            { speaker: 'male', text: "ポケモン。" },
            { speaker: 'female', text: "...ポケモン？" },
            { speaker: 'male', text: "第5世代の色違い遭遇率。1/8192。第6世代が1/4096。ポケモンやったことあれば、この数字は脳に焼き付いてる。1/4096がどういう感覚か説明しなくていい。もう知ってる。あの草むら覚えてるでしょ。3時間歩き回った。" },
            { speaker: 'female', text: "他人の記憶を借りてるんだ。" },
            { speaker: 'male', text: "そう！それ！「0.024%」って書いても何も感じない。でも「ポケモンの色違いと同じ確率」って言った瞬間、画面がキラッて光った時の興奮を思い出す。心拍数が上がったあの感覚。それを俺のシステムに載せてる。" },
            { speaker: 'female', text: "それ実はすごく賢い。でもさ、ゲームまだ完成してないんでしょ？" },
            { speaker: 'male', text: "半分。スロットは回る、XPは動く、チェーンも動く。でもカードランクはまだ。マイルストーンもまだ。運気の表示もまだ。" },
            { speaker: 'female', text: "でも説明書はできてる。" },
            { speaker: 'male', text: "説明書はできてる。" },
            { speaker: 'female', text: "順番おかしくない？" },
            { speaker: 'male', text: "おかしいはずなんだけど、説明書を書いたことでゲームになった。書く前は、ただのコードの寄せ集めだった。ここにスロット、あそこにXPカウンター、どこかにチェーントラッカー。でも「目次: 1.通貨 2.チャクラ 3.プレイヤーレベル」って書いた瞬間、ゲームに見えた。仕様が体験を作った。" },
            { speaker: 'female', text: "説明書がゲームを作る。コードじゃなくて。" },
            { speaker: 'male', text: "コードじゃなくて。説明書。読んだ人が「神モード入ったらPHANTOM10倍引きやすいんだ」って計算し始める。もうプレイしてる。頭の中で。ボタン触る前に。" },
            { speaker: 'female', text: "へぇ。" },
            { speaker: 'male', text: "で、一番面白いの。このゲームを一番やりたがってるの、俺自身。書いてて「PHANTOM引きたい、神モード入りたい、LEGENDARYカード作りたい」って。英語学習者向けに設計したはずが、自分のムズムズを自分で解消してた。" },
            { speaker: 'female', text: "誰にも頼まれてないゲームを作って、自分が一番のファン。" },
            { speaker: 'male', text: "そう。まさにそれ。で、それが正解だと思う。自分がやりたくないゲームを人に勧めても、誰もやらない。" },
            { speaker: 'female', text: "最初のお客さんは自分自身。" },
            { speaker: 'male', text: "最初のお客さんは常に自分自身。" },
        ],
        tone: 'casual' as const,
        generatedAt: new Date('2026-03-04'),
    },

    // ===== Piece 4: Tangent (Completely different topic: Elevator buttons) =====
    tangentData: {
        english: [
            { speaker: 'male', text: "OK totally random question -- you know the close-door button in elevators? Does it actually do anything?" },
            { speaker: 'female', text: "Of course it does. I press it every time." },
            { speaker: 'male', text: "Yeah, but have you ever, like, actually timed it? 'Cause I went down this -- this rabbit hole, right? And there are studies showin' that most of those buttons aren't even connected to anything." },
            { speaker: 'female', text: "What." },
            { speaker: 'male', text: "Since the Americans with Disabilities Act in 1990, elevators have to stay open long enough for people with disabilities to get in. So a lot of elevator companies just... disconnected the button. It's still there, you can press it, but it does nothin'." },
            { speaker: 'female', text: "I press that button HARD. Like, multiple times." },
            { speaker: 'male', text: "Everyone does! And that's -- that's the beautiful part. You're standin' there, goin' through the motions, pressin' a button that literally does zero, and it STILL feels like it works. Your brain goes, 'I pressed it, the door's closing, therefore I caused that.' Classic placebo." },
            { speaker: 'female', text: "But sometimes it DOES close faster. I swear I've seen it." },
            { speaker: 'male', text: "Sometimes the timer just, um, expires at the right moment. You press the button, two seconds later the door closes, and you think -- aha, that was me. But the door was gonna close in two seconds anyway. It's -- it's a coincidence that your brain turns into causation." },
            { speaker: 'female', text: "I don't like this conversation." },
            { speaker: 'male', text: "And crosswalk buttons! Same exact thing. A bunch of the ones in New York are, uh, completely deactivated. They've been dead since the '80s. Nobody ever removed 'em 'cause the city figured, eh, people like pressing somethin'. Keeps 'em calm." },
            { speaker: 'female', text: "OK NOW I'm upset." },
            { speaker: 'male', text: "But here's the thing I actually find interesting. Even when people find out the button's fake... they keep pressin' it. I still press the close-door button. I KNOW it doesn't work. I've read the studies. And I'm still standin' there -- tap tap tap -- 'cause it just... feels like I should be doing something." },
            { speaker: 'female', text: "Because it feels like you're in control." },
            { speaker: 'male', text: "Exactly. The illusion of control isn't, like -- it's not a bug, it's a feature. Our brains NEED to feel like we can affect things. Even when we can't. Even when it's totally, provably fake. The motion itself is the reward. Not the result." },
            { speaker: 'female', text: "That pushes my buttons in a very specific way." },
            { speaker: 'male', text: "Did you just -- was that a pun?" },
            { speaker: 'female', text: "It was a pun and I'm not sorry." },
            { speaker: 'male', text: "You should be. But also, now I'm never gonna hear 'push my buttons' without picturing a fake elevator panel. So thanks for that." },
            { speaker: 'female', text: "You're welcome. Now press the button." },
        ],
        japanese: [
            { speaker: 'male', text: "全然関係ない質問なんだけど、エレベーターの「閉」ボタンって、あれ意味あるの？" },
            { speaker: 'female', text: "当たり前でしょ。毎回押してるよ。" },
            { speaker: 'male', text: "いやでも実際に計ったことある？ちょっと調べてみたんだけどさ、あのボタン、大半が何にも繋がってないらしい。" },
            { speaker: 'female', text: "は？" },
            { speaker: 'male', text: "1990年にADA -- 障害者差別禁止法 -- ができて、エレベーターは一定時間ドアを開けとかないといけなくなった。で、メーカーがボタンの配線を外した。ボタン自体は残ってる。押せる。でも何も起きない。" },
            { speaker: 'female', text: "私あれ強く押すよ。連打する。" },
            { speaker: 'male', text: "みんなそう！で、そこが面白いところ。形だけの動作をして、何の効果もないボタンを押して、それでも「効いた」って感じる。脳が「押した→ドア閉まった→俺のおかげ」って処理する。完全にプラセボ。" },
            { speaker: 'female', text: "でも早く閉まることもあるじゃん。見たことあるし。" },
            { speaker: 'male', text: "それ、たまたまタイマーが切れるタイミング。ボタン押す、2秒後にドアが閉まる、「やった俺のおかげ」。でもどのみち2秒後に閉まる予定だった。偶然を因果関係に変換してる。" },
            { speaker: 'female', text: "この話好きじゃない。" },
            { speaker: 'male', text: "横断歩道のボタンも！ニューヨークのやつ、かなりの数が80年代から無効化されてる。撤去しないのは「押すもんがあったほうが市民が落ち着く」かららしい。" },
            { speaker: 'female', text: "もう怒る。" },
            { speaker: 'male', text: "でも面白いのはさ、ボタンが偽物って知った後でも、みんな押し続ける。俺もエレベーターの閉ボタン押す。効かないって知ってる。論文読んだ。でも立ってて -- ポチポチポチ -- やっちゃう。何かしてないと気が済まない。" },
            { speaker: 'female', text: "コントロールしてる感じが欲しいんでしょ。" },
            { speaker: 'male', text: "そう。コントロールの錯覚って、バグじゃなくて機能。脳は「自分が影響を与えてる」って感じたい。無理でも。完全に偽物でも。動作そのものが報酬。結果じゃなくて。" },
            { speaker: 'female', text: "それ、すごく特定の方法で私のボタンを押してる。" },
            { speaker: 'male', text: "今の -- ダジャレ？" },
            { speaker: 'female', text: "ダジャレ。反省してない。" },
            { speaker: 'male', text: "反省しろ。でもこれで「push my buttons」聞くたびに偽エレベーターのパネル思い出すわ。ありがとう。" },
            { speaker: 'female', text: "どういたしまして。ほら、ボタン押して。" },
        ],
        tone: 'humorous' as const,
        generatedAt: new Date('2026-03-04'),
    },
};
