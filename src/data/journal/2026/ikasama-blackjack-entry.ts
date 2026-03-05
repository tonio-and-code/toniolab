/**
 * 134 - イカサマブラックジャック ― トランプを捨てた日
 * バラトロ的ローグライクBJを作って、途中でトランプの意味がないことに気づいた話
 */

import { JournalEntry } from '../types';

export const ikasamaBlackjackEntry: JournalEntry = {
    id: '134',
    date: '2026-03-05',
    title: 'イカサマブラックジャック ― トランプを捨てた日',
    summary: 'ブラックジャックを作った。チップの代わりにSP、トランプの代わりに英語カード。チャクラで覗き見、種族値で数字操作、属性コンボで+1。バラトロ風ローグライクにしたら、途中でスペードもハートも意味ないことに気づいた。トランプ、いらなくね？',
    featured: false,
    readTime: 6,
    businessTags: ['ゲーム設計', 'UX', 'ローグライク'],
    techTags: ['React', 'ゲーミフィケーション', 'カードUI'],

    // ===== Piece 1: Japanese Journal =====
    conversation: `
## ブラックジャックを作ろう

英語カードにゲーム性が足りない。

コレクションとして眺めるのは楽しい。ゴールドフレーム、ホログラフィック、レジェンダリー。見た目は最高。でも「やること」がない。復習してSP貯めて、カードの見た目が変わる。それだけ。

もっと「遊べる」要素が欲しい。トランプゲームを英語カードでやれないか？

まず普通のブラックジャックを作った。

---

## 考えが浅い

作ってすぐ気づいた。**つまらない。**

数学的に全部決まってる。プレイヤーの期待値はマイナス0.5%。ディーラーの勝率がわずかに高い。カジノはこの0.5%で何十億も稼ぐ。

でもここはカジノじゃない。0.5%の差で儲ける相手がいない。SPを賭けてSPが増えたり減ったりするだけ。

**パチンコの二の舞。ベットとリターンが同じもの。**

130番で書いたやつと同じ構造的欠陥。金を賭けて金が返ってくるだけの閉じたループ。何も学ばない。

---

## イカサマの発明

ここで天才的な転換（また自分で言う）。

普通のブラックジャックにはない要素がある。**英語カードには属性と種族値とチャクラがある。**

これを「イカサマ」として使えばいい。

- **PEEK**：チャクラLv.3以上のカードがあれば、ディーラーの伏せカードが見える
- **FLEX**：種族値AかSのカードは、数字を±2できる（15を17に、22を20に）
- **COMBO**：同じ属性のカードが2枚揃えば、合計に+1
- **REVIVE**：チャクラLv.5以上で、バストしても1回だけ復活
- **BJ x3**：S種族値のカードで21が出たら、配当3倍

突然ゲームが変わった。

もう確率だけのゲームじゃない。**どのカードが手札に来るかで、使えるイカサマが変わる。** 英語を復習してチャクラを上げたカードが来れば、PEEKが使える。種族値の高いカードなら、数字を操作できる。

**英語の復習がゲームの有利に直結する。** これ。

---

## バラトロの影響

でもまだ足りない。1回のブラックジャックで終わり。勝っても負けても「もう1回やる？」だけ。

バラトロを思い出した。

バラトロの何がすごいかって、**負けるまで続く連勝システム**。ラウンドを重ねるたびに強くなる。ジョーカーを集める。でもディーラーも強くなる。いつか必ず負ける。「何連勝できたか」が記録になる。

これをブラックジャックに入れた。

- ラウンドが進むとディーラーの「立つ基準」が上がる（17→18→19）
- さらにボーナスが乗る（ディーラーの手に+1、+2）
- 勝つたびにジョーカーを1枚選べる（12種類、3段階のレアリティ）
- HOT HANDで全カード+1、RUBBERでバスト閾値22、PHOENIXで追加リバイブ

**負けは必ず来る。でもジョーカーが揃うと「まだいける」感がすごい。**

---

## トランプ、いらなくね？

ここまで作って、ふと気づいた。

スペード、ハート、ダイヤ、クラブ。**ゲームに一切関係ない。**

ブラックジャックは数字だけのゲーム。スーツ（柄）は飾り。数字も英語カードに毎回ランダムに割り当ててるだけ。固定してない。

じゃあもう、トランプの見た目いらなくない？

英語カードのコレクションデザイン -- あのゴールドフレームとかホログラフィックのやつ -- をそのまま使って、トランプの数字は小さいバッジで載せるだけでいい。

**トランプを「着ぐるみ」にした。** 中身は英語カード。外見だけトランプの数字。

コレクションのビジュアルが活きる。ランクに応じたフレームの美しさ。レジェンダリーカードが手札に来たら、見た目だけでテンション上がる。

---

## 自分のゲームの胴元になる（また）

130番でパチンコの設計を英語学習に応用した。あの時は「ベットが勉強時間なら負けがない」という発見だった。

今回はもう一段上。

**ゲームの有利要素が、英語の復習量に比例する。**

チャクラを上げた（= たくさん復習した）カードが来たら、PEEK、REVIVE、BJ x3が使える。種族値が高い（= 定期的に復習している）カードなら、FLEX。

つまり：
- 復習をサボる → カードが弱い → イカサマが使えない → 負ける
- 復習をする → カードが強い → イカサマが使える → 勝てる

**ゲームに勝ちたければ、英語を勉強しろ。**

しかもこれ、負けても「今日のハンドに出た英語フレーズ」が表示される。ゲーム中に自然と英語を目にしてる。

パチンコ式学習（130番）→ イカサマブラックジャック（今回）。

**胴元としてのスキルが上がってる気がする。**
`,

    // ===== Piece 2: Memoria (same topic) =====
    conversationData: {
        english: [
            { speaker: 'male', text: "So I built blackjack." },
            { speaker: 'female', text: "Like... actual blackjack?" },
            { speaker: 'male', text: "Yeah, full blackjack. Cards, dealer, hit or stay, the whole -- the whole thing. In my English app." },
            { speaker: 'female', text: "Why?" },
            { speaker: 'male', text: "Because the cards were just... sittin' there. Like, you review your phrases, you get SP, the card frames change -- gold, holographic, legendary -- and they look amazing. But there's nothin' to DO with 'em. You know? Just... collecting." },
            { speaker: 'female', text: "So you wanted gameplay." },
            { speaker: 'male', text: "Exactly. And I thought, OK, blackjack. Simple. Twenty-one. Everybody knows the rules. I'll just -- I'll slap it together, bet some SP, done." },
            { speaker: 'female', text: "And?" },
            { speaker: 'male', text: "Boring. Immediately boring." },
            { speaker: 'female', text: "Ha!" },
            { speaker: 'male', text: "No, seriously, it was -- I sat there and I'm like, this is just math. The dealer wins fifty-point-five percent of the time. That's literally it. There's no -- um, there's no REASON to keep playing." },
            { speaker: 'female', text: "Isn't that why casinos work though? The slight edge?" },
            { speaker: 'male', text: "Yeah, but casinos have -- I mean, there's money. Real money. That's the hook. I don't have real money. I've got SP, which is -- it's just a number in my own app. Bettin' SP to win SP is like... bettin' against yourself. There's no tension." },
            { speaker: 'female', text: "Same problem as the pachinko thing you wrote about." },
            { speaker: 'male', text: "EXACTLY. Same -- yes! Same structural flaw. The bet and the reward are the same thing. Closed loop. Nothing changes. Nothing -- nothing grows." },
            { speaker: 'female', text: "So what'd you do?" },
            { speaker: 'male', text: "OK, so here's where it gets -- here's the thing. My cards aren't normal cards. They have attributes. Element, like fire or water. BST, which is like a -- think of it as a power rating. And chakra, which is basically how much you've studied that card." },
            { speaker: 'female', text: "Right." },
            { speaker: 'male', text: "So I turned all of that into cheats. Ikasama. That's the Japanese word for cheating at cards." },
            { speaker: 'female', text: "Wait, you're cheating at your own game?" },
            { speaker: 'male', text: "I'm DESIGNING cheats into the game! So like, if a card in your hand has chakra level three or higher -- meaning you've reviewed it a bunch -- you can PEEK at the dealer's hidden card." },
            { speaker: 'female', text: "Oh, that's clever." },
            { speaker: 'male', text: "And if you've got an S-tier or A-tier BST card, you can FLEX the value. Like, bump a nine up to eleven, or pull a twelve back down to ten. Plus or minus two." },
            { speaker: 'female', text: "So the better you study, the more cheats you unlock." },
            { speaker: 'male', text: "That's -- yeah. That's the whole point. Your English review directly makes you stronger in the game. Chakra five? You get REVIVE -- you survive a bust once. Same element twice? COMBO -- plus one to your total. S-tier BST with a blackjack? Triple payout." },
            { speaker: 'female', text: "OK, I'm startin' to see it. But isn't one game of blackjack still kinda... done quick?" },
            { speaker: 'male', text: "So I added a roguelike system." },
            { speaker: 'female', text: "A what?" },
            { speaker: 'male', text: "Like Balatro. You know Balatro? The poker roguelike?" },
            { speaker: 'female', text: "I've heard of it." },
            { speaker: 'male', text: "It's -- OK so the idea is, you don't just play one hand. You play rounds. You keep goin' until you lose. Round one, round two, round five, round ten. And every time you win, you pick a joker." },
            { speaker: 'female', text: "A joker?" },
            { speaker: 'male', text: "Yeah, passive buffs. Like, Hot Hand makes all your card values plus one. Rubber raises the bust limit to twenty-two. Phoenix gives you an extra revive. There's twelve of 'em, three rarities." },
            { speaker: 'female', text: "And the dealer gets harder?" },
            { speaker: 'male', text: "Yep. Rounds one through three, dealer stays on seventeen. Normal rules. Round four, eighteen. Round ten, nineteen. And on top of that, bonus -- the dealer gets invisible plus-ones added to their hand." },
            { speaker: 'female', text: "So eventually you HAVE to lose." },
            { speaker: 'male', text: "Eventually you have to lose. That's the whole -- that's what makes it a roguelike. The question isn't IF you lose, it's WHEN. How far can you get? Your best round gets saved. And you're always chasin' that record." },
            { speaker: 'female', text: "That's actually..." },
            { speaker: 'male', text: "Wait, it gets better. So I'm playin' this thing, right? And I look at the cards and I'm like... why are there suits?" },
            { speaker: 'female', text: "Suits? Like spades and hearts?" },
            { speaker: 'male', text: "Yeah. In blackjack, suits don't matter. At all. It's only numbers. And I'm randomly assigning numbers to English cards every hand anyway. The suit is completely -- it's decorative." },
            { speaker: 'female', text: "So you just... dropped the playing card look?" },
            { speaker: 'male', text: "Replaced it. The cards now look like the collection cards. The beautiful ones with the gold frames and holographic effects. And the trump number is just a tiny badge in the corner." },
            { speaker: 'female', text: "The collection cards ARE the playing cards." },
            { speaker: 'male', text: "Exactly. So now when you're playin' blackjack, you see your actual English phrases. With the rank frame -- normal, bronze, silver, gold, holo, legendary. A legendary card in your hand? It's got the dark background, the particles, the glow. AND it might have an S-tier BST, which means you can flex the value." },
            { speaker: 'female', text: "Form and function." },
            { speaker: 'male', text: "The pretty cards aren't just pretty anymore. They're POWERFUL." },
        ],
        japanese: [
            { speaker: 'male', text: "ブラックジャック作った。" },
            { speaker: 'female', text: "え、ガチのブラックジャック？" },
            { speaker: 'male', text: "うん、フルの。カード、ディーラー、ヒットかステイか、全部入り。英語アプリの中に。" },
            { speaker: 'female', text: "なんで？" },
            { speaker: 'male', text: "カードがただ置いてあるだけだったから。復習して、SP貯めて、フレームが変わる -- ゴールド、ホログラフィック、レジェンダリー -- 見た目は最高。でもやることがない。コレクションしてるだけ。" },
            { speaker: 'female', text: "ゲーム性がほしかった。" },
            { speaker: 'male', text: "そう。で、ブラックジャックでいいじゃん、シンプルだし。21。みんなルール知ってる。SP賭けて、はい完成。" },
            { speaker: 'female', text: "で？" },
            { speaker: 'male', text: "つまらない。即つまらない。" },
            { speaker: 'female', text: "あはは！" },
            { speaker: 'male', text: "いや本当に、座ってやってみて、これただの数学じゃんって。ディーラーが50.5%勝つ。それだけ。続ける理由がない。" },
            { speaker: 'female', text: "でもカジノってそのわずかな差で成り立ってるんでしょ？" },
            { speaker: 'male', text: "うん、でもカジノにはリアルマネーがある。本物の金。俺にあるのはSP。自分のアプリの中の数字。SPを賭けてSP増やすのは、自分に賭けてるようなもんで。緊張感ゼロ。" },
            { speaker: 'female', text: "前に書いてたパチンコと同じ問題。" },
            { speaker: 'male', text: "まさに！同じ構造的欠陥。ベットとリターンが同じもの。閉じたループ。何も変わらない。何も育たない。" },
            { speaker: 'female', text: "で、どうした？" },
            { speaker: 'male', text: "ここからなんだけど。俺のカードは普通のカードじゃない。属性がある。火とか水とか。種族値、パワーレーティングみたいなもの。チャクラ、そのカードをどれだけ勉強したか。" },
            { speaker: 'female', text: "うん。" },
            { speaker: 'male', text: "それ全部イカサマにした。" },
            { speaker: 'female', text: "え、自分のゲームでイカサマ？" },
            { speaker: 'male', text: "イカサマをゲームに組み込んだ！チャクラ3以上のカードが手札にあれば、ディーラーの伏せカードが見える。PEEK。" },
            { speaker: 'female', text: "あ、それ賢い。" },
            { speaker: 'male', text: "種族値SかAのカードは数字を操作できる。9を11にしたり、12を10に戻したり。プラスマイナス2。FLEX。" },
            { speaker: 'female', text: "勉強すればするほどイカサマが増える。" },
            { speaker: 'male', text: "そう。英語の復習がゲームの強さに直結する。チャクラ5でREVIVE、バスト1回生存。同属性2枚でCOMBO、合計+1。S種族値でブラックジャック出たら配当3倍。" },
            { speaker: 'female', text: "なるほど。でもブラックジャック1回で終わりじゃない？" },
            { speaker: 'male', text: "だからローグライクにした。" },
            { speaker: 'female', text: "ローグライク？" },
            { speaker: 'male', text: "バラトロみたいな。ポーカーのローグライク知ってる？" },
            { speaker: 'female', text: "聞いたことある。" },
            { speaker: 'male', text: "1回じゃなくてラウンド制。負けるまで続く。ラウンド1、2、5、10。勝つたびにジョーカーを1枚選ぶ。" },
            { speaker: 'female', text: "ジョーカー？" },
            { speaker: 'male', text: "パッシブバフ。HOT HANDで全カード+1、RUBBERでバスト上限22、PHOENIXで追加リバイブ。12種類、3段階のレアリティ。" },
            { speaker: 'female', text: "ディーラーも強くなる？" },
            { speaker: 'male', text: "うん。ラウンド1-3はディーラー17でステイ。普通。4から18。10から19。さらにボーナスで見えない+1が乗る。" },
            { speaker: 'female', text: "いつか必ず負ける。" },
            { speaker: 'male', text: "必ず負ける。それがローグライク。問題はIFじゃなくてWHEN。何ラウンドいけるか。ベスト記録を更新し続ける。" },
            { speaker: 'female', text: "それは..." },
            { speaker: 'male', text: "まだある。やってて気づいた。スーツって意味なくない？" },
            { speaker: 'female', text: "スーツ？スペードとかハートとか？" },
            { speaker: 'male', text: "ブラックジャックでスーツは関係ない。数字だけ。しかも毎ハンド英語カードにランダム割り当てしてる。スーツは完全に飾り。" },
            { speaker: 'female', text: "じゃあトランプの見た目やめた？" },
            { speaker: 'male', text: "コレクションカードのデザインに変えた。ゴールドフレームとかホログラフィックのやつ。トランプの数字は小さいバッジで角に載せるだけ。" },
            { speaker: 'female', text: "コレクションカードがそのままプレイングカード。" },
            { speaker: 'male', text: "そう。ブラックジャック中に自分の英語フレーズが見える。ランクフレーム付き。レジェンダリーカードが手札に来たら、暗い背景にパーティクルが舞う。しかもS種族値かもしれなくてFLEXできる。" },
            { speaker: 'female', text: "デザインと機能の一致。" },
            { speaker: 'male', text: "綺麗なカードが、ただ綺麗なだけじゃなくなった。強い。" },
        ],
        tone: 'energetic' as const,
        generatedAt: new Date('2026-03-05'),
    },

    // ===== Piece 3: Tangent (completely unrelated topic) =====
    tangentData: {
        english: [
            { speaker: 'male', text: "Have you ever tried to assemble furniture at midnight?" },
            { speaker: 'female', text: "Oh no." },
            { speaker: 'male', text: "So I ordered this desk off Amazon, right? And it gets delivered at like -- I dunno, six PM. And I look at the box and I think, 'I'll do it tomorrow.'" },
            { speaker: 'female', text: "But you didn't." },
            { speaker: 'male', text: "I lasted twenty minutes. Twenty minutes of the box just SITTIN' there, judging me, and I'm like, OK fine. Fine! I'll just open it and see how bad it is." },
            { speaker: 'female', text: "That's how it starts." },
            { speaker: 'male', text: "Two hundred and thirty-seven pieces. I'm not -- I'm not exaggerating. There were TWO bags of screws. Two. Labeled A through, uh, N. Fourteen types of screws." },
            { speaker: 'female', text: "Fourteen?" },
            { speaker: 'male', text: "Fourteen. And the instruction manual -- it's not even a manual, it's this thin little pamphlet with drawings that look like they were done by, um, like a first-year engineering student havin' a bad day." },
            { speaker: 'female', text: "Those IKEA-style drawings where everything's arrows and dotted lines." },
            { speaker: 'male', text: "Exactly, except worse, 'cause this isn't IKEA. IKEA at least numbers stuff clearly. This thing -- the screw labeled 'G' looks IDENTICAL to the screw labeled 'H.' I'm sittin' there with a magnifying glass at eleven PM goin', 'Is this a G or an H? Is this -- does this have a flat head or a -- it's round. They're both round.'" },
            { speaker: 'female', text: "At eleven PM." },
            { speaker: 'male', text: "At eleven PM! With parts spread across my entire living room floor. My cat's sittin' on panel B. Like, physically ON panel B, refusing to move." },
            { speaker: 'female', text: "Your cat claimed it." },
            { speaker: 'male', text: "She claimed it. That's her territory now. So I'm assembling around the cat. Step twelve says 'attach panel B to frame C at a forty-five-degree angle using screws G and dowel pins K.' And panel B is under the cat." },
            { speaker: 'female', text: "Did you move the cat?" },
            { speaker: 'male', text: "You don't MOVE a cat. You -- you negotiate. I put treats on the other side of the room. She looked at me. Looked at the treats. Looked back at me. And laid down harder." },
            { speaker: 'female', text: "Laid down harder. That's a power move." },
            { speaker: 'male', text: "Maximum defiance. So I worked around her for -- I don't know, forty minutes? Until she decided on her own that the couch was better. Cats, man." },
            { speaker: 'female', text: "So when did you finish?" },
            { speaker: 'male', text: "Two thirty AM." },
            { speaker: 'female', text: "Two thirty?!" },
            { speaker: 'male', text: "Two thirty in the morning. And I -- here's the worst part. I have three screws left over." },
            { speaker: 'female', text: "Three extra screws." },
            { speaker: 'male', text: "Three. And I don't know where they go. Like, the desk seems fine? It's standin'. It holds my monitor. But somewhere in this desk, there are three holes without screws, and I just -- I live with that now." },
            { speaker: 'female', text: "You live with it." },
            { speaker: 'male', text: "I live with three missing screws and the vague anxiety that one day this desk is just gonna... fold. Like a lawn chair. In the middle of a meeting." },
            { speaker: 'female', text: "That's terrifying." },
            { speaker: 'male', text: "Every time it creaks I hold my breath. It's been two weeks now and I'm still not a hundred percent sure it's structurally sound." },
            { speaker: 'female', text: "Have you considered going back to the instructions?" },
            { speaker: 'male', text: "I burned the instructions." },
            { speaker: 'female', text: "You did NOT." },
            { speaker: 'male', text: "Figuratively. I threw 'em in the recycling so fast -- I never wanna see screw G again. Or H. Or whatever they were. Three leftover screws is my cross to bear." },
            { speaker: 'female', text: "Your cross to bear. Over a desk." },
            { speaker: 'male', text: "It's the principle! You follow all forty-two steps, you use all fourteen screw types, and at the end there's THREE LEFT? That means either the instructions were wrong or I was wrong, and honestly? I choose to believe the instructions were wrong." },
            { speaker: 'female', text: "Of course you do." },
            { speaker: 'male', text: "The desk is standing. That's the only metric that matters." },
        ],
        japanese: [
            { speaker: 'male', text: "深夜に家具組み立てたことある？" },
            { speaker: 'female', text: "あ、やっちゃったパターン。" },
            { speaker: 'male', text: "Amazonでデスク買って、6時くらいに届いた。箱見て、「明日やろう」って思った。" },
            { speaker: 'female', text: "でもやっちゃった。" },
            { speaker: 'male', text: "20分もたなかった。箱がそこにただ座って、こっちを裁いてる感じ。で、OK、開けるだけ開けてどんなもんか見よう。" },
            { speaker: 'female', text: "そうやって始まる。" },
            { speaker: 'male', text: "237パーツ。大げさじゃなく。ネジの袋が2つ。AからNまでラベル付き。14種類のネジ。" },
            { speaker: 'female', text: "14種類？" },
            { speaker: 'male', text: "14種類。で、説明書 -- 説明書っていうか、ペラい小冊子で、図面がたぶん工学部1年生がやる気ない日に描いたみたいなやつ。" },
            { speaker: 'female', text: "IKEAみたいな矢印と点線だらけの絵。" },
            { speaker: 'male', text: "それの劣化版。IKEAはまだ番号がはっきりしてる。これはGって書いてあるネジとHって書いてあるネジが完全に同じに見える。夜11時に虫眼鏡持って「これGかHか？平頭か -- 丸い。両方丸い。」" },
            { speaker: 'female', text: "夜11時に。" },
            { speaker: 'male', text: "夜11時に！パーツがリビングの床一面に散らばってる。で、猫がパネルBの上に座ってる。物理的にパネルBの上。動かない。" },
            { speaker: 'female', text: "猫が領有宣言。" },
            { speaker: 'male', text: "領有宣言。もう彼女のテリトリー。猫の周りで組み立ててた。ステップ12、「パネルBをフレームCに45度の角度でネジGとダボピンKで取り付ける」。パネルBは猫の下。" },
            { speaker: 'female', text: "猫動かした？" },
            { speaker: 'male', text: "猫は動かすもんじゃない。交渉するもの。部屋の反対側にオヤツ置いた。猫は俺を見た。オヤツを見た。俺を見た。そしてもっと力強く寝た。" },
            { speaker: 'female', text: "もっと力強く寝た。それはパワームーブ。" },
            { speaker: 'male', text: "最大限の反抗。40分くらい猫の周りで作業した。猫が自主的にソファのほうがいいと判断するまで。猫ってやつは。" },
            { speaker: 'female', text: "で、いつ終わった？" },
            { speaker: 'male', text: "午前2時半。" },
            { speaker: 'female', text: "2時半？！" },
            { speaker: 'male', text: "朝の2時半。で、ここが最悪。ネジが3本余った。" },
            { speaker: 'female', text: "3本余り。" },
            { speaker: 'male', text: "3本。どこに入るかわからない。デスクは立ってる。モニター乗せてる。でもどこかに3個、ネジの入ってない穴がある。もうそれと生きてる。" },
            { speaker: 'female', text: "共存してる。" },
            { speaker: 'male', text: "ネジ3本不足と、いつかこのデスクがキャンプ椅子みたいにパタンと折れるっていう漠然とした不安と共存してる。ミーティング中に。" },
            { speaker: 'female', text: "怖い。" },
            { speaker: 'male', text: "軋むたびに息止める。2週間経ったけどまだ構造的に大丈夫か確信持てない。" },
            { speaker: 'female', text: "説明書見直す気は？" },
            { speaker: 'male', text: "説明書は燃やした。" },
            { speaker: 'female', text: "燃やしてない。" },
            { speaker: 'male', text: "比喩的に。リサイクルに光速で投げた。二度とネジGを見たくない。HでもGでもなんでもいい。ネジ3本余りは俺の十字架。" },
            { speaker: 'female', text: "十字架。デスクで。" },
            { speaker: 'male', text: "原理の問題！42ステップ全部やって、14種類のネジ全部使って、最後に3本余る？それは説明書が間違ってるか俺が間違ってるかで、正直？説明書が間違ってたことにする。" },
            { speaker: 'female', text: "当然そうなる。" },
            { speaker: 'male', text: "デスクは立ってる。それだけが唯一の指標。" },
        ],
        tone: 'comedic' as const,
        generatedAt: new Date('2026-03-05'),
    },

    // ===== Piece 4: Pro (Expression Teaching) =====
    englishSummary: {
        title: 'Five Expressions from the Ikasama Blackjack Episode',
        readTime: 5,
        sections: [
            {
                heading: "The whole nine yards -- 全部入り、完全装備",
                paragraphs: [
                    "In the Memoria, he's talkin' about the gacha animation -- 'seven hundred seventy-seven sparks, gold everywhere, the whole nine yards.' This is one of those all-purpose expressions that means 'everything, the full package, nothin' left out.' The origin's debated -- some say football, some say WWII ammo belts -- but nobody cares about the origin when they're usin' it. You just throw it in when you wanna say 'ALL of it.'",
                    "You can use it pretty much anywhere. 'We got the cake, the decorations, the DJ, the whole nine yards.' Or at work: 'He did the research, the presentation, the follow-up calls -- the whole nine yards.' It's got this energy of being impressed by how thorough somethin' is. Like, you didn't expect all that effort, but here it is.",
                    "Similar ones: 'the full package,' 'the works,' 'everything and the kitchen sink.' That last one's funny -- it implies even things you don't need were included. 'The whole nine yards' is more neutral. It's like, yeah, everything that SHOULD be there IS there. No corners cut.",
                ],
                japaneseParagraphs: [
                    "「全部入り」「フルセット」みたいな意味。ガチャ演出の話で「金色のアニメーション、全部入りの演出」って言ってるとこ。語源は諸説あるけど（アメフトのフィールド？WWII の弾帯？）誰も気にしてない。「ぜんぶ」って言いたい時に使う。",
                    "使える場面がめちゃくちゃ広い。「ケーキ、飾り付け、DJ、全部揃えた」みたいな。仕事でも「リサーチ、プレゼン、フォローの電話、全部やった」。ニュアンスとしては「よくそこまでやったな」っていう感心が入る。手抜きがない感じ。",
                    "似た表現：'the full package'（フルセット）、'the works'（全部載せ）、'everything and the kitchen sink'（キッチンのシンクまで含めて、つまり余計なものまで全部）。'the whole nine yards' はもっとニュートラルで、あるべきものが全部ある、という意味合い。",
                ],
            },
            {
                heading: "Double down -- さらに賭ける、倍プッシュ",
                paragraphs: [
                    "This one actually comes from blackjack! In the game, doubling down means you double your bet but only get one more card. High risk, high reward. But in everyday English, it's way broader. In the Memoria he says 'double down on yourself, literally' -- meanin' he's investin' even more in his own system. The joke is that it's LITERALLY blackjack this time.",
                    "People use 'double down' all the time now, especially in business and arguments. 'The CEO doubled down on the remote work policy.' 'He got criticized and instead of backin' off, he doubled down.' It's got this stubborn energy -- you're not just standin' your ground, you're LEANING INTO it. Pushin' harder. Sometimes it's smart, sometimes it's reckless. Context tells you which.",
                    "The opposite would be 'back off' or 'walk it back.' Like, 'She walked back her comments after the backlash.' You can also say 'go all in' -- which is poker, not blackjack, but same vibe. 'All in' is more dramatic though. 'Double down' has that calculated feel. You've already bet once. Now you're bettin' again.",
                ],
                japaneseParagraphs: [
                    "元々ブラックジャック用語。ベットを倍にして1枚だけ引く。ハイリスク・ハイリターン。でも日常英語では「さらに突っ込む」「倍プッシュする」って意味で超よく使う。メモリアで「自分自身にダブルダウン」って言ってるのは、文字通りブラックジャックの話だから二重の意味。",
                    "ビジネスとか議論の場面でめちゃくちゃ出る。「CEOがリモートワーク方針にdoubled down」（さらに推し進めた）。「批判されて、引くどころかdoubled down」（むしろ強気に出た）。引かない、むしろ押す、っていう頑固さがある。それが賢いか無謀かは文脈次第。",
                    "反対は 'back off'（引く）か 'walk it back'（撤回する）。'She walked back her comments'（発言を撤回した）。'go all in' はポーカー由来で似た意味だけどもっとドラマチック。'double down' はもうちょっと計算高い感じ。一度賭けた上で、もう一度賭ける。",
                ],
            },
            {
                heading: "Cross to bear -- 背負う十字架、避けられない苦難",
                paragraphs: [
                    "In the tangent conversation about the desk, he says 'three leftover screws is my cross to bear.' Dramatic? Absolutely. But that's the fun of this expression. 'Cross to bear' comes from the Bible -- Jesus carryin' the cross. But in modern English, people use it for way less serious stuff. Like three extra screws. Or a noisy neighbor. Or a boss who replies-all.",
                    "It means a burden you gotta deal with, usually long-term and unavoidable. 'Her cross to bear is a two-hour commute.' 'His cross to bear is bein' the only one who knows the legacy codebase.' There's this flavor of acceptance in it, like -- I can't change this, so I'm just gonna carry it. It's heavier than 'inconvenience' but not as dramatic as 'tragedy.' Right in the middle.",
                    "You can also say 'that's my lot in life' -- similar resignation but without the religious imagery. Or 'the price I pay for...' which ties the burden to a specific choice. 'Cross to bear' is the heaviest of the three. It implies you didn't choose this burden. It was given to you. By IKEA, apparently.",
                ],
                japaneseParagraphs: [
                    "デスクの話で「ネジ3本余りは俺の十字架」って言ってる。大げさ？もちろん。でもそれがこの表現の面白さ。聖書由来（イエスが十字架を背負う）だけど、現代英語ではもっと軽い場面でガンガン使う。余ったネジ。うるさい隣人。全員返信する上司。",
                    "長期的で避けられない負担、っていう意味。「彼女の十字架は通勤2時間」「彼の十字架はレガシーコードを唯一知ってること」。受け入れてる感じがある。変えられないから背負う、っていう。「不便」よりは重くて「悲劇」ほどではない。ちょうど中間。",
                    "似た表現：'that's my lot in life'（それが俺の宿命）、'the price I pay for...'（〜の代償）。'cross to bear' が一番重い。自分で選んだんじゃない負担、っていうニュアンス。IKEAから与えられた十字架。",
                ],
            },
            {
                heading: "Power move -- 見せつけ、支配的行動",
                paragraphs: [
                    "When the cat refuses to move off the desk panel and 'laid down harder,' she calls it a 'power move.' This is super common in casual English right now. A power move is any action that establishes dominance or control, especially when it's bold or unexpected. The cat refusing to move despite treats? Total power move.",
                    "You hear it in business talk a lot: 'Walkin' into the meeting ten minutes late with a coffee? Power move.' 'She asked for a raise on her first day? Power move.' It can be genuine admiration or sarcastic, dependin' on context. Sometimes the 'power move' is actually kinda dumb, but you call it a power move anyway because it's funny how audacious it is.",
                    "Related: 'boss move' is similar but more positive -- like, that was genuinely impressive. 'Alpha move' exists but sounds kinda cringe now. 'Power play' is the more strategic version -- it implies calculated intent. 'Power move' can be accidental. The cat didn't PLAN to assert dominance. She just... did.",
                ],
                japaneseParagraphs: [
                    "猫がパネルの上から動かず「もっと力強く寝た」のを「パワームーブ」って呼んでる。今のカジュアル英語でめちゃくちゃ使う。支配的な行動、大胆な行動。予想外に強気に出ること。オヤツで釣ろうとしても動かない猫。完全なパワームーブ。",
                    "ビジネスでもよく聞く。「ミーティングに10分遅れてコーヒー持って入る？パワームーブ。」「初日に昇給要求？パワームーブ。」本気で感心してる場合と皮肉の場合がある。実際はアホな行動でも、その大胆さが面白くて「パワームーブ」って呼ぶ。",
                    "似た表現：'boss move' はもっとポジティブ（ガチですごい）。'alpha move' は今ちょっとイタい。'power play' は戦略的（計算された意図がある）。'power move' は偶然でもいい。猫は支配を計画してない。ただ、そうなった。",
                ],
            },
            {
                heading: "Form and function -- 形と機能の一致",
                paragraphs: [
                    "At the end of the Memoria, when he explains how the collection card design replaced the plain playing card look, she says 'form and function.' It's short, punchy, and perfectly placed. This expression comes from design and architecture -- the idea that how somethin' looks and how it works should support each other. Not beauty for beauty's sake. Not ugly but practical.",
                    "In tech and design, you hear it constantly. 'The new iPhone nailed form and function.' 'This building sacrifices function for form.' Notice you can flip it -- 'function over form' means you prioritized usefulness over looks. 'Form over function' means it looks great but doesn't work well. When someone just says 'form and function' with no 'over,' it means both are working together.",
                    "The architectural origin is from Louis Sullivan: 'form follows function' -- meanin' the shape of a building should be based on what it's used for. But the modern casual usage is looser. You can use it for anythin' that's both beautiful and useful. A well-designed app. A chef's knife. A sentence that sounds good AND communicates clearly. Form and function.",
                ],
                japaneseParagraphs: [
                    "コレクションカードがプレイングカードになった話の最後で「デザインと機能の一致」って一言。短くて的確。建築やデザインの概念で、見た目と機能がお互いを支えるべきっていう考え。美しいだけでもダメ、機能的だけど醜いのもダメ。",
                    "テックとデザインの世界で頻出。「新しいiPhoneはform and functionを両立してる」。「このビルはfunctionを犠牲にしてformを取った」。ひっくり返せる -- 'function over form'（見た目より実用性）、'form over function'（実用性より見た目）。ただ 'form and function' って言ったら「両方いい」。",
                    "建築家ルイス・サリヴァンの「form follows function」（形態は機能に従う）が元。でも現代の使い方はもっとゆるい。美しくて便利なもの全般に使える。いいアプリ、包丁、カッコよくて意味も通る文章。全部 form and function。",
                ],
            },
        ],
    },
};
