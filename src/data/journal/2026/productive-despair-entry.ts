/**
 * 131 - どうしようもなさの効用
 * 完成しないことを受け入れたら手が止まらなくなった
 */

import { JournalEntry } from '../types';

export const productiveDespairEntry: JournalEntry = {
    id: '131',
    date: '2026-03-01',
    title: 'どうしようもなさの効用 ― 完成を捨てたら手が止まらなくなった',
    summary: 'バグは永遠に出る。完成は来ない。それを受け入れた瞬間、開発が速くなった。希望のフォーマットを「未来の完成」から「今日の1ミリ」に変えた話。',
    featured: false,
    readTime: 6,
    businessTags: ['開発哲学', 'メンタルモデル', '継続'],
    techTags: ['バグとの共存', '反復開発', '受容'],
    conversation: `
## どうしようもない

バグを直した。

Prevボタンが前のカードに戻れない。レベルアップしたカードがリストから消えるから、戻ったつもりが無関係なカードが出る。

直した。履歴スタックを追加して、ちゃんと「さっきのカード」に戻れるようにした。

で、次のバグが出る。

---

## 毎日同じことが起きる

朝：問題を見つける。
昼：直す。
夕方：別の問題を見つける。
夜：直す。
翌朝：また別の問題。

これを繰り返している。半年以上。

「完成」が来ない。

---

## 完成しないことについて

最初は焦っていた。「あと少しで完成する」「来週には」「来月には」。

来月は来なかった。正確には、来月は来たけど「完成」は来なかった。

アプリは使えるようになった。毎日使ってる。フレーズを復習して、レベルを上げて、ガチャを回して、ジャーナルを書いて。機能してる。

でも「完成」していない。たぶん永遠にしない。

---

## どうしようもなさの発見

ある日、これに名前をつけた。**どうしようもなさ。**

バグは出続ける。新しい機能を追加するたびに新しい問題が生まれる。ユーザー（自分しかいないけど）の使い方は予想通りにいかない。

これは能力の問題じゃない。サボりの問題でもない。

**ソフトウェアが本質的にそういうもの。**

庭の草むしりと同じ。全部抜いても来週にはまた生えてる。草を全部抜き終わることがゴールだったら、永遠に達成できない。

---

## 諦めたら速くなった

面白いことが起きた。

「完成」を諦めた瞬間、開発が速くなった。

理由は単純。「あと何個直せば完成する」を考えなくなったから。目の前のバグを直す。それだけ。今日のやつを直す。明日のやつは明日直す。

完成がゴールだったときは、残りのバグの数を数えて絶望してた。

完成を捨てたら、1個直すたびに前進してる実感だけが残った。

**どうしようもなさを受け入れたら、手が止まらなくなった。**

---

## 生産的な絶望

これは鬱じゃない。投げ出してもいない。

朝起きてコード書いて、バグ直して、機能追加して、ジャーナル書いてる。何もやめてない。

ただ「いつか全部うまくいく」を信じるのをやめた。

代わりに「今日やれることをやる」だけが残った。希望を捨てたんじゃなくて、希望のフォーマットを変えた。

「未来に完成する」から「今日1ミリ進む」へ。

パチンコ式で言えば：777が出ることを期待してベットしてたのを、1SP入るだけで十分だと思えるようになった。

---

## どうしようもないけど、どうにかなってる

6ヶ月前の自分に言っても信じないだろう。

「完成しないよ」「バグは永遠に出るよ」「でもそれでいいよ」

いいわけないだろ、って言うだろうな。

でも今日もPrevボタンを直した。明日も何か直す。

どうしようもないけど、どうにかなってる。

これが俺の答え。
`,
    conversationData: {
        english: [
            { speaker: 'male', text: "I think I figured somethin' out today." },
            { speaker: 'female', text: "What's that?" },
            { speaker: 'male', text: "So I was fixin' this bug, right? The Prev button on my flashcard app. When you level up a card, it disappears from the list, and then Prev just shows you some random unrelated card instead of the one you just did." },
            { speaker: 'female', text: "OK." },
            { speaker: 'male', text: "Fixed it. Added a history stack, the whole thing works now, you can go back and see what you just reviewed. Felt great. Pushed the code. And then I found another bug." },
            { speaker: 'female', text: "Immediately?" },
            { speaker: 'male', text: "Like within the hour. And it's -- look, this has been happening for six months. I fix something in the morning, something else breaks by afternoon. Next day, same thing. Over and over and over." },
            { speaker: 'female', text: "That sounds exhausting." },
            { speaker: 'male', text: "That's what I thought! For months. I was like, 'When is this gonna be done? When do I get to stop fixin' things and just... use it?'" },
            { speaker: 'female', text: "And?" },
            { speaker: 'male', text: "Never. The answer is never. It's never gonna be done." },
            { speaker: 'female', text: "That's... kind of depressing." },
            { speaker: 'male', text: "See, that's what I would've said too. Like, a month ago? If you told me 'it's never gonna be finished,' I would've been -- I dunno, gutted. But here's the thing. Here's what I figured out." },
            { speaker: 'female', text: "Hit me." },
            { speaker: 'male', text: "The moment I stopped expectin' it to be finished -- like, truly stopped, not just said the words but actually let go of the whole idea of 'done' -- I got faster. Way faster. I'm not kidding, my output basically doubled." },
            { speaker: 'female', text: "How does givin' up make you faster?" },
            { speaker: 'male', text: "It's not givin' up! That's -- OK, that's the whole point, right? There's a difference between givin' up and acceptin' that some things are just... beyond your control. When I was chasin' 'done,' I was countin' bugs. 'OK, fifteen bugs left, now fourteen, now -- wait, sixteen? Where'd those two come from?' And that was soul-crushin'." },
            { speaker: 'female', text: "Because the number never hits zero." },
            { speaker: 'male', text: "It NEVER hits zero! And I was -- I mean, I was measurin' progress by how close I was to zero, which means every new bug felt like goin' backwards. Like, I'd fix three things and feel worse because I found four new ones." },
            { speaker: 'female', text: "So you stopped counting." },
            { speaker: 'male', text: "Stopped counting. Stopped thinkin' about the finish line. Just -- today. What's broken today? Fix that. That's it. Tomorrow's bugs are tomorrow's problem." },
            { speaker: 'female', text: "That does sound like givin' up though. Like, a little bit?" },
            { speaker: 'male', text: "I get why you'd say that. But, um -- think about it like pullin' weeds. You ever pull weeds in a garden?" },
            { speaker: 'female', text: "Sure." },
            { speaker: 'male', text: "If your goal is 'pull every weed so there are zero weeds forever' -- you're gonna be miserable. Because weeds grow back. That's what weeds do. That's -- I mean, that's literally their whole thing. But if your goal is 'pull weeds today,' then you pull weeds today and you're done. Not done-done. Done for today." },
            { speaker: 'female', text: "Done for today. Not done-done." },
            { speaker: 'male', text: "Exactly. And that shift -- that tiny little shift -- it changed everything. I went from dreading my own app to actually enjoyin' the daily fix. Like, this morning I fixed the Prev button and it felt genuinely good. Not 'one step closer to done' good. Just... good. On its own." },
            { speaker: 'female', text: "You changed what 'progress' means." },
            { speaker: 'male', text: "Yeah! Yes. That's exactly it. Progress used to mean 'closer to finished.' Now it means 'better than yesterday.' And 'better than yesterday' is always achievable. Always. Even on bad days." },
            { speaker: 'female', text: "Isn't there a word for this in Japanese?" },
            { speaker: 'male', text: "Doushoumonasa. It literally means, uh -- the state of being helpless? Like, there's nothin' you can do about it. Can't be helped. But it's not negative, exactly. It's more like... acknowledgment. This is how things are. Now what?" },
            { speaker: 'female', text: "Now what." },
            { speaker: 'male', text: "Now you keep going. That's the part nobody tells you about helplessness. Accepting it doesn't mean stopping. It means you stop fighting the wrong thing and start workin' on the right thing." },
            { speaker: 'female', text: "Which is today's bug." },
            { speaker: 'male', text: "Which is today's bug. Always today's bug. And tomorrow there'll be a new one. And that's fine. That's -- honestly? That's fine. Six months ago I would've hated hearin' that. 'It's fine that it's broken' -- are you KIDDING me? But now I get it." },
            { speaker: 'female', text: "Productive despair." },
            { speaker: 'male', text: "Ha! Yeah, exactly. Productive despair. I should trademark that." },
        ],
        japanese: [
            { speaker: 'male', text: "今日、あることに気づいた。" },
            { speaker: 'female', text: "何？" },
            { speaker: 'male', text: "バグ直してたんだけど、フラッシュカードアプリのPrevボタン。レベルアップしたカードがリストから消えるから、Prev押しても全然関係ないカードが出ちゃう。" },
            { speaker: 'female', text: "うん。" },
            { speaker: 'male', text: "直した。履歴スタック追加して、ちゃんとさっきのカードに戻れるようにした。気持ちよかった。コードpushした。で、また別のバグ見つけた。" },
            { speaker: 'female', text: "すぐに？" },
            { speaker: 'male', text: "1時間以内。で、これが -- もう半年ずっとこう。朝に何か直して、午後には別の何かが壊れてる。次の日も同じ。繰り返し。" },
            { speaker: 'female', text: "疲れそう。" },
            { speaker: 'male', text: "そう思ってた！何ヶ月も。『いつ終わるんだ？いつ直すのやめて普通に使えるようになるんだ？』って。" },
            { speaker: 'female', text: "で？" },
            { speaker: 'male', text: "永遠に来ない。答えは「来ない」。永遠に終わらない。" },
            { speaker: 'female', text: "...ちょっと鬱になるね。" },
            { speaker: 'male', text: "俺もそう思ってた。1ヶ月前なら『永遠に終わらない』って言われたら絶望してた。でもここがポイント。今日気づいたこと。" },
            { speaker: 'female', text: "言って。" },
            { speaker: 'male', text: "「完成」を期待するのをやめた瞬間 -- 言葉だけじゃなくて本当にやめた瞬間 -- 速くなった。マジで倍くらい。冗談じゃなくてアウトプット倍増。" },
            { speaker: 'female', text: "諦めたのに速くなるの？" },
            { speaker: 'male', text: "諦めじゃない！そこが全てのポイント。諦めることと、コントロール外のことを受け入れることは全然違う。「完成」を追ってた時はバグの数を数えてた。『あと15個、今14個、あれ16個？2個どっから来た？』みたいな。あれは魂を削る。" },
            { speaker: 'female', text: "ゼロにならないから。" },
            { speaker: 'male', text: "ゼロにならない！で、ゼロへの距離で進捗を測ってたから、新しいバグが見つかるたびに後退した気分になる。3個直して4個見つかって、気分は悪化。" },
            { speaker: 'female', text: "だから数えるのをやめた。" },
            { speaker: 'male', text: "数えるのやめた。ゴールラインを考えるのもやめた。今日。今日壊れてるのは何？それを直す。以上。明日のバグは明日の問題。" },
            { speaker: 'female', text: "でもそれ、ちょっと諦めに聞こえるよ。" },
            { speaker: 'male', text: "わかる。でも、草むしりで考えてみて。庭の草むしりしたことある？" },
            { speaker: 'female', text: "あるよ。" },
            { speaker: 'male', text: "『全部抜いて永遠に草ゼロにする』がゴールだったら、一生惨めだよ。草は生えてくる。それが草。でも『今日草を抜く』がゴールなら、今日抜いたら終わり。完全に終わりじゃない。今日は終わり。" },
            { speaker: 'female', text: "今日は終わり。完全には終わらない。" },
            { speaker: 'male', text: "そう。で、このちっちゃいシフトで全部変わった。自分のアプリを嫌だと思ってたのが、毎日の修正を楽しむようになった。今朝Prevボタン直して、純粋に気持ちよかった。『完成に一歩近づいた』じゃなくて、ただ気持ちいい。それ自体で。" },
            { speaker: 'female', text: "「進捗」の定義を変えたんだ。" },
            { speaker: 'male', text: "そう！前は「完成に近づく」だった。今は「昨日より良い」。で、「昨日より良い」は常に達成できる。悪い日でも。" },
            { speaker: 'female', text: "日本語でなんて言うの？" },
            { speaker: 'male', text: "どうしようもなさ。文字通り、どうすることもできない状態。でもネガティブじゃない。認めること。これが現実。で、どうする？" },
            { speaker: 'female', text: "で、どうする。" },
            { speaker: 'male', text: "続ける。誰も教えてくれないこと。受け入れるのは止まることじゃない。間違ったものと戦うのをやめて、正しいものに取り組み始めること。" },
            { speaker: 'female', text: "つまり今日のバグ。" },
            { speaker: 'male', text: "今日のバグ。常に今日のバグ。明日はまた新しいのが出る。でいい。半年前の俺は嫌だっただろうな。『壊れてていい？冗談だろ？』って。でも今はわかる。" },
            { speaker: 'female', text: "生産的な絶望。" },
            { speaker: 'male', text: "ハハ、そう。生産的な絶望。商標取ろうかな。" },
        ],
        tone: 'philosophical' as const,
        generatedAt: new Date('2026-03-01'),
    },

    tangentData: {
        english: [
            { speaker: 'male', text: "Can I tell you about the fitted sheet?" },
            { speaker: 'female', text: "The what?" },
            { speaker: 'male', text: "The fitted sheet. You know, the one with the elastic corners? I tried to fold one yesterday." },
            { speaker: 'female', text: "Oh no." },
            { speaker: 'male', text: "What do you mean 'oh no'? It's a sheet. How hard can it be?" },
            { speaker: 'female', text: "Nobody can fold a fitted sheet." },
            { speaker: 'male', text: "That -- OK, that's what I found out. But I didn't KNOW that goin' in. I thought, like, there's gotta be a method, right? Everything has a method. So I looked it up." },
            { speaker: 'female', text: "YouTube?" },
            { speaker: 'male', text: "YouTube. And there's this woman -- super calm, big smile, she's got the sheet spread out on this giant table, and she goes, 'First, identify the corners.' And I'm like, OK, I can identify corners. I'm a grown adult. I can find four corners." },
            { speaker: 'female', text: "Famous last words." },
            { speaker: 'male', text: "So I grab two corners, and immediately the elastic just -- it bunches up. The whole thing turns into, like, a ball. A sheet ball. And in the video she's got this perfectly flat sheet and she's goin', 'Now tuck this corner into that corner,' and I'm standin' there holding what looks like a -- I dunno -- a deflated parachute?" },
            { speaker: 'female', text: "A deflated parachute. That's exactly what it looks like." },
            { speaker: 'male', text: "I tried three times. Three separate attempts. Rewound the video each time. The woman on screen is foldin' it into this perfect little rectangle and I have... a wad. A sheet wad. Like I just crumpled it up and gave up." },
            { speaker: 'female', text: "Because you did." },
            { speaker: 'male', text: "I did NOT give up! I adapted. I, um -- I developed what I'm callin' the Controlled Chaos method." },
            { speaker: 'female', text: "The what?" },
            { speaker: 'male', text: "You grab all four corners, right, you kinda shove 'em together, and then you fold the whole mess in half, and then you fold THAT in half, and what you end up with is -- it's not a rectangle. It's more of a... lump. But it's a FLAT lump. Flat-ish." },
            { speaker: 'female', text: "That's just stuffin' it." },
            { speaker: 'male', text: "It's ORGANIZED stuffin'. There's a difference. And it fits in the closet. It fits! That's the only metric that matters." },
            { speaker: 'female', text: "Your metric for success is 'fits in the closet'?" },
            { speaker: 'male', text: "What else would it be? Nobody's gonna open my closet and go, 'Excuse me, sir, your fitted sheet is not in a proper rectangle.' Nobody. In the entire history of human civilization, no guest has ever inspected someone's linen closet." },
            { speaker: 'female', text: "I mean, some people --" },
            { speaker: 'male', text: "No. Nobody. And the flat sheet? The flat sheet I can fold BEAUTIFULLY. Perfect thirds. Crisp edges. Museum quality. But the fitted sheet exists in a different universe where geometry doesn't apply." },
            { speaker: 'female', text: "It's the elastic. The elastic makes it impossible." },
            { speaker: 'male', text: "The elastic! Yes! It's like tryin' to fold a -- like tryin' to fold somethin' that doesn't want to be folded. The sheet is actively resistin' you. It has, like, its own agenda." },
            { speaker: 'female', text: "Sheet with an agenda." },
            { speaker: 'male', text: "I'm convinced the woman on YouTube is usin' a different kind of sheet. Or she's a wizard. Or both. 'Cause what she does and what happens when I try are two completely different activities that happen to involve the same object." },
            { speaker: 'female', text: "Have you considered just not folding it?" },
            { speaker: 'male', text: "Like, just throw it in the closet?" },
            { speaker: 'female', text: "Yeah. Like a normal person." },
            { speaker: 'male', text: "...I'm gonna pretend you didn't just solve my entire problem in five words." },
            { speaker: 'female', text: "You're welcome." },
            { speaker: 'male', text: "Forty-five minutes of my life. Forty-five minutes foldin' and unfoldin' and restartin' and rewinding this woman's video. And the answer was just... don't." },
            { speaker: 'female', text: "Don't." },
            { speaker: 'male', text: "Don't. Incredible. I love it. I hate it. The sheet wins." },
        ],
        japanese: [
            { speaker: 'male', text: "ボックスシーツの話していい？" },
            { speaker: 'female', text: "何の？" },
            { speaker: 'male', text: "ボックスシーツ。角にゴムが入ってるやつ。昨日畳もうとした。" },
            { speaker: 'female', text: "あー。" },
            { speaker: 'male', text: "何その反応。シーツだよ。どんだけ難しいの。" },
            { speaker: 'female', text: "ボックスシーツ畳めるやつ誰もいないよ。" },
            { speaker: 'male', text: "それ -- うん、知った。でもやる前は知らなかった。方法があると思った。何でもやり方あるでしょ。で、調べた。" },
            { speaker: 'female', text: "YouTube？" },
            { speaker: 'male', text: "YouTube。で、すごい穏やかな女の人が出てきて、笑顔で、巨大なテーブルにシーツ広げて、『まず角を見つけましょう』って。OK、角くらい見つけられる。大人だし。4つの角。" },
            { speaker: 'female', text: "最後の言葉。" },
            { speaker: 'male', text: "で、角2つ掴んだ瞬間、ゴムが -- 全体がボール状になる。シーツボール。動画の人は完璧に平らなシーツで『この角をあの角に入れて』って言ってて、俺はしぼんだパラシュートみたいなの持って立ってる。" },
            { speaker: 'female', text: "しぼんだパラシュート。まさにそれ。" },
            { speaker: 'male', text: "3回やった。3回別々に挑戦。毎回巻き戻して。動画の人は完璧な長方形に畳んでて、俺のは -- 塊。シーツの塊。くしゃくしゃにして諦めたみたいな。" },
            { speaker: 'female', text: "実際そうでしょ。" },
            { speaker: 'male', text: "諦めてない！適応した。名付けて、コントロールド・カオス法。" },
            { speaker: 'female', text: "何？" },
            { speaker: 'male', text: "4つの角全部掴んで、ぐしゃっとまとめて、全体を半分に折って、それをまた半分に折る。出来上がるのは -- 長方形じゃない。塊。でも平たい塊。平たいっぽい。" },
            { speaker: 'female', text: "それただの詰め込み。" },
            { speaker: 'male', text: "秩序ある詰め込み。違うから。で、クローゼットに入る。入る！それだけが重要な指標。" },
            { speaker: 'female', text: "成功の基準が『クローゼットに入る』なの？" },
            { speaker: 'male', text: "他に何があるの。誰もクローゼット開けて『すみません、ボックスシーツが長方形じゃないんですけど』とか言わない。人類文明の歴史上、他人のリネン棚を検査した客はいない。" },
            { speaker: 'female', text: "まあ、中には --" },
            { speaker: 'male', text: "いない。で、フラットシーツ？あっちは完璧に畳める。三つ折り。パリッとした端。美術館レベル。でもボックスシーツは幾何学が通用しない別次元に存在する。" },
            { speaker: 'female', text: "ゴムのせいだよ。ゴムがあるから無理。" },
            { speaker: 'male', text: "ゴム！そう！畳まれたくないものを畳もうとしてる感じ。シーツが抵抗してくる。自分の意思がある。" },
            { speaker: 'female', text: "意思のあるシーツ。" },
            { speaker: 'male', text: "YouTubeの人は別の種類のシーツ使ってる。か、魔法使い。両方かも。あの人がやってることと俺がやってることは、同じ物体を使ってるだけの全く別の活動。" },
            { speaker: 'female', text: "畳まないって選択肢は？" },
            { speaker: 'male', text: "クローゼットに放り込む？" },
            { speaker: 'female', text: "うん。普通の人みたいに。" },
            { speaker: 'male', text: "...今の5文字で俺の問題全部解決したの聞かなかったことにする。" },
            { speaker: 'female', text: "どういたしまして。" },
            { speaker: 'male', text: "45分。45分畳んでほどいてやり直して動画巻き戻して。答えは『やらない』。" },
            { speaker: 'female', text: "やらない。" },
            { speaker: 'male', text: "やらない。最高。最悪。シーツの勝ち。" },
        ],
        tone: 'humorous' as const,
        generatedAt: new Date('2026-03-01'),
    },

    englishSummary: {
        title: "Three Expressions from the Helplessness Episode",
        readTime: 5,
        sections: [
            {
                heading: "It Is What It Is -- もうしょうがない、そういうもん",
                paragraphs: [
                    "Today's Memoria circles around this idea of acceptin' what you can't control. And there's a phrase for that in English that you hear EVERYWHERE. 'It is what it is.' Six words. Zero information. And somehow it's one of the most useful sentences in the entire language.",
                    "Here's why it works. 'It is what it is' doesn't mean 'I don't care.' It doesn't mean 'I give up.' It means 'I've looked at this situation, I've accepted the reality, and I'm movin' on.' There's a quiet strength in it. You're not complainin'. You're not fixin'. You're acknowledgin'.",
                    "You use it after you've already tried. That's the key. 'I studied for three months and still failed the exam. It is what it is.' 'The flight got cancelled and there's nothin' I can do. It is what it is.' It's the phrase you reach for when effort has met its limit and you need to keep walkin'.",
                ],
                japaneseParagraphs: [
                    "今日のMemoriaはコントロールできないことを受け入れる話。英語にはそのための表現がある。\"It is what it is.\" 6語。情報量ゼロ。なのに英語で最も使える文の1つ。",
                    "なぜ機能するか。\"It is what it is\" は「気にしない」でも「諦める」でもない。「この状況を見た、現実を受け入れた、先に進む」という意味。静かな強さがある。文句じゃない。修正でもない。認めること。",
                    "使うのは「もう十分やった」後。これがポイント。\"I studied for three months and still failed. It is what it is.\"（3ヶ月勉強したけど落ちた。しょうがない。）努力が限界に達して、それでも歩き続ける時に出てくる言葉。",
                ],
            },
            {
                heading: "Move the Needle -- 目に見える変化を出す",
                paragraphs: [
                    "In the conversation, the guy talks about how every day he fixes one bug and that's enough. That daily 1-millimeter progress. In English, when somethin' creates visible, measurable change, we say it 'moves the needle.' Like the needle on a gauge or a speedometer -- if it moves, somethin's happenin'.",
                    "'Does this actually move the needle?' is somethin' you hear in every startup, every board meeting, every strategy session. It means: is this effort gonna produce a result I can SEE? 'We posted ten times on social media but it didn't move the needle.' 'Hirin' that one developer really moved the needle on our product quality.'",
                    "The beauty of this phrase is what happens when you STOP askin' it about the big picture and start askin' it about today. 'Did I move the needle today?' If you fixed one bug? Yeah. You moved it. Not a lot. But it moved. And that's the whole philosophy from today's episode -- stop measurin' the gap between here and 'done.' Just check: did the needle move?",
                ],
                japaneseParagraphs: [
                    "会話の中で、毎日バグを1個直せばそれで十分だと言ってた。毎日の1ミリの進歩。英語で、目に見える変化を生むことを \"move the needle\" と言う。計器やスピードメーターの針 -- 動けば何かが起きてる。",
                    "\"Does this actually move the needle?\" はスタートアップ、役員会議、戦略会議どこでも聞く。「この努力で目に見える結果が出るのか？」 \"We posted ten times but it didn't move the needle.\"（10回投稿したけど変化なし。）\"Hiring that developer really moved the needle.\"（あの開発者の採用で品質が目に見えて上がった。）",
                    "この表現の美しさは、大きな絵に対して聞くのをやめて「今日」に対して聞いた時に起きる。\"Did I move the needle today?\" バグ1個直した？なら動いた。大きくはない。でも動いた。今日のエピソードの哲学全体がこれ -- 「ここ」と「完成」の差を測るのをやめろ。針は動いたか？だけ確認しろ。",
                ],
            },
            {
                heading: "Famous Last Words -- 死亡フラグ",
                paragraphs: [
                    "'Famous last words' came up in the tangent about the fitted sheet -- 'How hard can it be? Famous last words.' It means: you just said something that's about to be proven hilariously wrong. The confidence before the disaster.",
                    "'I'll be there in five minutes -- famous last words.' 'It's just a small fix -- famous last words.' 'I'll just check one email before bed -- famous last words.' You get the pattern. It's always somethin' that sounds completely reasonable in the moment and turns into a three-hour ordeal.",
                    "The beauty of this expression is that it works both ways. You can use it in real time -- someone says 'this'll be quick' and you go 'famous last words' -- or you can use it after the fact, when you're tellin' the story of how everything went sideways. Either way, it's the universal flag for 'you have no idea what you're about to get into.'",
                ],
                japaneseParagraphs: [
                    "\"Famous last words\" はボックスシーツのTangentで出てきた -- 「どんだけ難しいの？死亡フラグ。」意味は「今の発言、すぐ盛大に間違ってたって証明される」。自信の直後の惨事。",
                    "\"I'll be there in five minutes -- famous last words.\"（5分で着く -- 死亡フラグ。）\"It's just a small fix -- famous last words.\"（ちょっとした修正 -- 死亡フラグ。）\"I'll just check one email before bed -- famous last words.\" パターンは同じ。その瞬間は完全に合理的に聞こえて、3時間の苦行に変わる。",
                    "この表現の美しさは双方向で使えること。リアルタイムで -- 誰かが「すぐ終わる」と言った瞬間に \"famous last words\" -- 事後でも、全てが崩壊した話をする時にも使える。どちらにしても「お前はこれから何に巻き込まれるか全くわかってない」の万能フラグ。",
                ],
            },
        ],
    },
};
