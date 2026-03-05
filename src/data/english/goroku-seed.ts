// 俺語録 Seed Data -- 7-Pillar English Speaking Curriculum
// 骨格(50) / 動詞(50) / 小語(50) / 音(40) / メタファー(40) / 会話武器(40) / 文化OS(40)
// Each entry teaches a structural EN↔JP difference. context = the product core.
// 4-level english: [0]=short punch, [1]=attitude phrase (UI display), [2]=full sentence, [3]=stream-of-consciousness monologue

export interface GorokuSeed {
    daySlot: number;
    japanese: string;
    english: string[];  // 4 levels: [0]=short punch, [1]=with attitude, [2]=full sentence, [3]=stream-of-consciousness monologue
    literal?: string;
    context: string;
    category: 'reaction' | 'request' | 'opinion' | 'suggestion' | 'filler' | 'shutdown';
    slot?: string;       // swappable word in english[1] for pattern practice
    slotHints?: string[]; // example replacement words
    month?: string;      // '2026-03' etc. omitted = '2026-02' default
}

// ============================================================
// 310 expressions across 31 days (10 per day)
// 7-pillar systematic curriculum, mixed across all days
// ============================================================

export const GOROKU_SEEDS: GorokuSeed[] = [
    // ── Day 1 ──
    { daySlot: 1, japanese: '暑いな', english: [
        "it's so hot",
        "it's so hot I can't even think straight",
        "it's ridiculously hot out, I'm meltin' over here",
        "it's so hot my brain stopped workin' about an hour ago. I walked outside and my motivation evaporated. literally. I had plans today. big plans. now my only plan is findin' shade and stayin' there till October. this is not livin'. this is survivin'."
    ], context: "日本語は「暑い」だけで文が成立する。主語なし。英語は必ずit's hotと言う。このitは何も指してない。天気に主語はないのに、英語は主語がないと文を始められない。だから幽霊みたいなitを置く。時間もit's 3 o'clock、距離もit's far。全部ダミーのit。英語は「誰が?」に答えられないと喋れない言語。", category: 'reaction' },
    { daySlot: 1, japanese: 'ご飯食べた', english: [
        "already ate",
        "I already ate, I'm good",
        "I already ate so I'm not really hungry right now",
        "I already ate. grabbed somethin' on the way home 'cause I knew if I waited I'd end up orderin' pizza at midnight again. and that's a cycle I'm tryin' to break. tryin'. not succeedin'. but tryin'."
    ], context: "「ご飯食べた」。日本語はご飯(O)→食べた(V)の順。英語はI ate(S→V)で動詞が先に来る。しかも「ご飯」は省略。英語は「誰が何した」が最優先で、「何を」は後回し。日本語は目的語を先に見せて期待させてからオチの動詞。英語はオチから始まる言語。ネタバレ体質。", category: 'reaction' },
    { daySlot: 1, japanese: '怒られた', english: [
        "got in trouble",
        "I got in so much trouble for that",
        "I got in trouble for that and honestly I deserved it",
        "I got in trouble. big time. and the worst part is I knew it was comin'. like, I did the thing, I knew it was wrong while I was doin' it, and I still did it. then acted surprised when the consequences showed up. like buddy, the consequences sent you a calendar invite. you accepted."
    ], literal: 'got angry-ed at', context: "「怒った」はgot mad、「疲れた」はgot tired、「酔った」はgot drunk。全部getで「なる」を表現する。日本語は「怒る」「疲れる」って動詞が変わるけど、英語はget+形容詞で全部いける。getは「今の状態から別の状態に移動した」という変化の万能動詞。日本語の10個の動詞がget1個で済む。チート。", category: 'reaction' },
    { daySlot: 1, japanese: '自然に覚えた', english: [
        "picked it up",
        "I just picked it up along the way",
        "nobody taught me, I just picked it up naturally",
        "nobody sat me down and taught me. I just picked it up. watched people do it, tried it myself, messed up a bunch, and one day it just clicked. that's how I learn everything honestly. not from books. from doin' it wrong enough times that doin' it right becomes the accident."
    ], literal: 'picked up naturally', context: "pick up=「拾う」が元の意味。でも英語では「自然に覚える」もpick up。道に落ちてる知識を拾うイメージ。I picked up some Japanese in Tokyo(東京で日本語を拾った)。教科書で勉強したんじゃなくて、歩いてたら足元に落ちてた感覚。英語の句動詞は身体の動きが知識の動きになる。", category: 'opinion' },
    { daySlot: 1, japanese: 'ちょっとだけ', english: [
        "just a little",
        "just a little bit, nothin' serious",
        "just a little, don't make a big deal out of it",
        "just a little. and when I say 'a little' I mean it could be a lot but I'm downplayin' it 'cause I don't want the follow-up questions. 'just a little' is my shield. behind it is a whole story I'm not ready to tell. but on the surface? just a little. nothin' to see here."
    ], context: "justは「ただの」「ちょっと」で何でも小さくする魔法の単語。I'm just looking(見てるだけ)、it's just me(俺だけ)、just a thought(ただの思いつき)。justを付けた瞬間に全部がミニチュアになる。日本人は丁寧に小さくする。英語はjust1語で圧縮する。省エネ言語。", category: 'filler' },
    { daySlot: 1, japanese: '実はさ', english: [
        "actually",
        "actually, here's the real story",
        "OK so actually, what really happened was this",
        "actually -- and I wasn't gonna say this but whatever -- the whole story's different from what you heard. like, completely different. the version you got was the polished one. the actual version involves a convenience store at 2 AM and a decision I can't fully explain."
    ], context: "actuallyは「実は」だけど、もっと大事な機能がある。相手の思い込みをひっくり返す合図。A: That's expensive. B: Actually, it's pretty cheap. このactuallyは「あなたの情報、間違ってますよ」という方向転換シグナル。日本語の「実は」は新情報の追加。英語のactuallyは既存情報の修正。ベクトルが逆。", category: 'filler' },
    { daySlot: 1, japanese: 'もう何言ってるかわかんない', english: [
        "gonna and wanna",
        "I'm gonna -- wait, I wanna -- ugh, I dunno",
        "I wanna go but I'm not gonna 'cause I gotta work",
        "I wanna go out but I'm gonna stay 'cause I gotta finish this thing. and I kinda hafta do laundry too. shoulda done it yesterday. coulda gone today but nah. English has like ten of these shortcuts and if you don't use 'em you sound like a robot readin' a legal document."
    ], context: "going toはgonna、want toはwanna、got toはgotta。教科書は「正式にはgoing toです」って言うけど、ネイティブは99%gonna。gonnaを使わないと「この人、英語できるけどなんか固い」って思われる。フルで言うと逆に不自然。I am going to=怒ってるか、超フォーマルか、どっちか。", category: 'filler' },
    { daySlot: 1, japanese: '時間がもったいない', english: [
        "waste of time",
        "that's a total waste of my time",
        "I'm not gonna spend my time on something that pointless",
        "don't waste my time. don't spend my time. don't steal my time. English treats time like money. you save time, invest time, budget time, run out of time. Japanese says 時間がもったいない -- time is precious. English says time is literally currency. you're either spendin' it wisely or gettin' robbed."
    ], context: "英語ではtime=money。save time(時間を貯金)、spend time(時間を使う)、invest time(時間を投資)、waste time(時間を浪費)。全部お金の動詞。日本語は「もったいない」で済むけど、英語は金融用語で時間を管理する。この感覚のせいで英語圏の人は「時間を無駄にされた」に本気で怒る。時間泥棒は英語では重罪。", category: 'opinion' },
    { daySlot: 1, japanese: 'えーっと', english: [
        "let me think",
        "hmm, let me think about that for a sec",
        "how do I put this... give me a second",
        "let me think... how do I put this... OK so basically -- no wait. let me start over. the thing is -- actually that's not it either. you know when you have the thought but the words aren't cooperatin'? that. I'm havin' that. gimme a sec."
    ], context: "日本語は「えーっと」で時間を稼ぐ。英語はlet me think、how do I put this、what's the word。全部「今考えてますよ」という実況。黙ると「聞いてないのかな」って思われるから、考え中であることを言葉で報告しないといけない。沈黙が許されない言語。考えてることすら喋る。", category: 'filler' },
    { daySlot: 1, japanese: '走ってる', english: [
        "I'm running",
        "I'm running right now, can't talk",
        "I'm out for a run, call you back in twenty",
        "I'm runnin'. and notice -- in English you HAVE to say 'I'm running.' you can't just say 'running.' in Japanese you say 走ってる and that's a full sentence. who's running? doesn't matter. context handles it. in English, if you say 'running' with no subject, people look around like 'who? what? where?' English can't handle an action without an actor. every verb needs a name tag."
    ], context: "日本語は「走ってる」で完全な文。誰が? 文脈でわかる。英語はI'm runningと必ず主語を置く。省略不可。She's sleeping(彼女は寝てる)、It's raining(雨が降ってる)。誰が何をしてるか、毎回宣言する。日本語は「省略の言語」、英語は「宣言の言語」。日本語は空気を読む。英語は空気を読まない代わりに全部口で言う。", category: 'opinion' },

    // ── Day 2 ──
    { daySlot: 2, japanese: '冷蔵庫に何かある？', english: [
        "is there anything",
        "is there anything in the fridge?",
        "is there anything good in the fridge or just condiments?",
        "is there anything in the fridge? 'cause last time I checked it was just mustard, old milk, and regret. there's always stuff IN the fridge but never stuff you actually wanna eat. it's like a museum of things I bought with good intentions and then ignored."
    ], context: "「何かある?」。日本語は「ある」で存在を言う。英語はthere is somethingと言う。このthereはそこじゃない。場所の意味はゼロ。ただの存在アナウンサー。「これから存在の話をします」という予告編。there's a problem(問題がある)、there's no way(ありえない)。全部このダミーのthere。", category: 'suggestion' },
    { daySlot: 2, japanese: '知ってる？', english: [
        "do you know",
        "do you know about this? it's wild",
        "wait, do you even know about this whole thing?",
        "do you know about this? 'cause if you don't, buckle up. I found out yesterday and I'm still processin'. it's one of those things where once you know, you can't unknow, and now I gotta share the burden with someone. that someone is you. sorry in advance."
    ], context: "「知ってる?」は日本語だとそのまま聞ける。英語はdo you know?とdoを挟む。なぜ? 英語は疑問文を作るとき、普通の文にdoを挿入して「これは質問です」という旗を立てる。You know(知ってる)→Do you know?(知ってる?)。このdoは意味ゼロ。存在理由は「質問の旗」だけ。日本語は語尾の「?」だけで質問になるのに、英語は毎回doを建設工事する。", category: 'suggestion' },
    { daySlot: 2, japanese: '決めた', english: [
        "made up my mind",
        "I made up my mind, it's happening",
        "that's it, I made my decision, no going back",
        "I made my decision. done. and don't try to talk me out of it 'cause once I make up my mind it stays made up. it's not a rental. it's a purchase. I bought this decision and I'm keepin' the receipt but I'm never returnin' it. probably. unless it's really bad. then maybe. but probably not."
    ], context: "「決断する」は英語でmake a decision。作る? 何を? 決断を。日本語は「決める」という動詞1個で済むのに、英語はmake+名詞で分解する。effort(努力)もmake an effort、mistake(間違い)もmake a mistake。英語は動作を「作る+モノ」に分けたがる。makeは英語の万能工場長。", category: 'reaction' },
    { daySlot: 2, japanese: '休憩しよう', english: [
        "take a break",
        "let's take a quick break, I need it",
        "I need to take a break before my brain shuts down",
        "let's take a break. and I mean an actual break. not a 'five minutes that turns into thirty seconds' break. I'm talkin' sit down, close the laptop, stare at nothin' for a solid ten minutes. my brain's been runnin' nonstop and it's startin' to overheat. breaks aren't laziness. breaks are maintenance."
    ], context: "「休憩する」は英語でtake a break。取る? 休憩を? 日本語は「する」で全部動詞にできるけど、英語はtake+名詞が大好き。take a look(見る)、take a chance(賭ける)、take a shower(シャワー浴びる)。全部「つかみ取る」動作。英語は休憩すら「能動的に獲得するもの」。", category: 'request' },
    { daySlot: 2, japanese: 'まあでもな', english: [
        "it's fine though",
        "I mean, it's fine though, whatever",
        "it is what it is though, can't really complain",
        "it's fine though. and I know I just spent five minutes complainin' so 'fine' might sound weird but that's the thing -- you can complain AND be fine. both are true at the same time. I'm annoyed but I accept it. that's maturity. or laziness. honestly it's hard to tell the difference sometimes."
    ], context: "though を文末に置くと「でもな」になる。I like it though(でも好きだけどね)、it's fine though(まあいいけど)。この文末thoughは教科書に載ってないのに会話では超頻出。butは文頭で使うけど、thoughは文末。ポジションが逆。日本語の「けどね」と同じ後付け感。言い終わった後に「まあでもね」って付け足す。thoughは英語の「けどね」。", category: 'filler' },
    { daySlot: 2, japanese: 'ありえない', english: [
        "not even close",
        "not even close, that's not even in the ballpark",
        "that's not even close to what actually happened",
        "not even close. and I'm not exaggeratin'. the real version and your version aren't even in the same zip code. like, yours is in Tokyo and the truth is in Buenos Aires. that's how far apart we are. I don't even know where to start correctin' this. maybe I should just let it go. ...I can't let it go. OK here's what actually happened."
    ], context: "evenは「〜すら」「〜でさえ」で驚きを増幅する装置。not close(近くない)→not even close(近くすらない)。I didn't know(知らなかった)→I didn't even know(知りすらしなかった)。even1語で「え、マジで?」感が10倍になる。日本語は「すら」「でさえ」でやるけど、使用頻度が英語のevenの半分以下。英語話者はevenを1日50回は使ってる。", category: 'reaction' },
    { daySlot: 2, japanese: 'ぶっちゃけ、いい感じ', english: [
        "lookin' good",
        "honestly? it's actually lookin' pretty good",
        "I'm not gonna lie, it turned out way better than I expected",
        "I'm not gonna lie, it's lookin' good. like, actually good. and I was fully prepared for it to be trash 'cause my expectations were underground. but nah. this is legit. which now makes me nervous 'cause when things go well I start waitin' for the catch. there's always a catch. ...right? please tell me there's no catch."
    ], context: "going→goin'、looking→lookin'、thinking→thinkin'。-ingの g を落とすのはカジュアルの証。怠けてるんじゃない。「今フォーマルな場じゃないよ」というシグナル。友達にI am going(フル発音)って言ったら「何怒ってんの?」って聞かれる。g-droppingはリラックスの音。", category: 'reaction' },
    { daySlot: 2, japanese: '議論に負けた', english: [
        "got destroyed",
        "I got completely destroyed in that argument",
        "they tore my argument apart, I had no comeback",
        "I got destroyed. demolished. they came at me with facts, data, logic -- the whole arsenal -- and I'm over there with 'well, I feel like...' which is basically bringin' a pillow to a gunfight. I didn't lose the argument. the argument lost me. I was a casualty. someone should send flowers."
    ], context: "英語では議論=戦争。attacked(攻撃された)、defended(防御した)、shot down(撃ち落とされた)、tore apart(引き裂かれた)。全部戦場の言葉。日本語は「議論する」「反論する」で済むけど、英語は毎回バトルフィールドが展開される。I destroyed his argument(彼の議論を破壊した)。物騒すぎる。", category: 'reaction' },
    { daySlot: 2, japanese: '言いにくいんだけど', english: [
        "here's the thing",
        "so here's the thing, and don't hate me for this",
        "OK so here's the thing, and I really don't wanna say this but",
        "so here's the thing. and I prefaced it with 'here's the thing' so you know somethin' uncomfortable is comin'. that's the deal with 'here's the thing' -- it's never followed by good news. nobody says 'here's the thing... you're amazing.' nah. it's always bad. and you already braced yourself, right? see? the phrase did its job. cushion deployed."
    ], context: "悪いニュースの前にクッションを置く文化。so here's the thing、look、the thing is、I don't know how to say this but。全部「これから痛いこと言うけど準備してね」の合図。日本語は「あのさ」「ちょっといい?」で軽く入るけど、英語は毎回クッションを膨らませてから座らせる。衝撃吸収が文化。", category: 'filler' },
    { daySlot: 2, japanese: '思うんだけど', english: [
        "I think",
        "I think, and this is just me, but",
        "I think -- and I could be totally wrong -- but here's my take",
        "I think -- and look, this is just my brain, my brain's been wrong before, it'll be wrong again -- but I think the whole approach is off. not like catastrophically off. just subtly off. like a picture frame that's tilted two degrees. you can't tell at first but once you see it you can't unsee it. and I see it. and now you're gonna see it too. sorry."
    ], context: "日本語は「思うんだけど」と主語なしで意見を言える。英語は必ずI thinkと「I」を置く。I believe、I feel、I guess。全部「I」始まり。英語は「誰の意見か」を必ず名札で示す。日本語は名札なしで意見が浮遊できる。「思うんだけど」って誰が? → 空気が。英語にはその空気がない。", category: 'opinion' },

    // ── Day 3 ──
    { daySlot: 3, japanese: '行かないの？', english: [
        "aren't you going?",
        "wait, aren't you going? I thought you were",
        "aren't you coming? everyone's gonna be there",
        "aren't you going? 'cause like, everyone's goin'. and I know you said you weren't sure but I kinda assumed that meant yes. 'cause when people say 'not sure' they usually mean 'convince me.' so here I am. convincin'. it's gonna be fun. probably. at minimum it won't be boring. that's my pitch."
    ], context: "「行かないの?」は質問のフリをした圧力。本当に聞いてるなら「行く?」でいい。わざわざ否定形にする理由は「行くべきでしょ」という期待が入ってるから。英語も同じ。Are you going?(中立)vs Aren't you going?(え、行かないの? マジで?)。否定疑問文は両言語で「質問のフリした圧力」。ただし英語のほうが圧が3倍強い。", category: 'suggestion' },
    { daySlot: 3, japanese: 'だよね', english: [
        "right?",
        "that's what I thought, right?",
        "I'm not crazy, right? you see it too?",
        "right? RIGHT? thank you. finally someone agrees. I've been sayin' this for weeks and everyone's lookin' at me like I'm the weird one. but you see it. you get it. and now that two of us see it, it's not just my opinion anymore. it's a movement. a tiny, two-person movement. but still."
    ], context: "日本語は「だよね」で同意を求める。英語は文末にright?、isn't it?、don't you think?をくっつける。これがtag question(付加疑問文)。面白いのは答えを期待してないこと。It's cold, isn't it?(寒いよね?)に対して「いや暑いけど」とは言いにくい。答えが決まってる質問。日本語の「ね」と全く同じ。", category: 'filler' },
    { daySlot: 3, japanese: 'やめられない', english: [
        "can't stop",
        "I can't stop, I just keep going",
        "I keep telling myself to stop but I just keep going",
        "I keep goin'. I told myself 'one more episode' three episodes ago. I told myself 'last one' four times. the word 'last' has lost all meaning. my brain knows it's a lie and it doesn't care. keep + -ingは中毒の文法。I keep eating、I keep checking my phone。英語で自分の弱さを実況するのに最適。"
    ], context: "keep + -ingは「止められずにやり続ける」。I keep forgetting(何度も忘れちゃう)、I keep making the same mistake(同じミスを繰り返す)。日本語は「〜し続ける」だけど、keepには「やめたいのにやめられない」ニュアンスがある。意志に反して続いてる感じ。keep goingは「頑張れ」にもなる。止まらない=強さにもなれる。", category: 'reaction' },
    { daySlot: 3, japanese: '結局よかった', english: [
        "turned out fine",
        "it turned out fine in the end, weirdly",
        "I was stressed for nothing, it turned out totally fine",
        "it turned out fine. which is annoying, actually. 'cause I spent like three days stressin' about it. imagined every worst-case scenario. planned escape routes. prepared emotional speeches. and then? fine. totally fine. all that anxiety for nothin'. my brain is the boy who cried wolf except the wolf never shows up and the boy is exhausted."
    ], context: "turn outは「フタを開けてみたら〜だった」。it turned out to be great(結局すごくよかった)、he turned out to be nice(会ってみたらいい人だった)。日本語の「結局」に近いけど、turn outには「予想と違った」サプライズ感が必ずある。予想通りだったときは使わない。期待を裏切る専用の動詞。", category: 'reaction' },
    { daySlot: 3, japanese: 'まだやってんの', english: [
        "still at it?",
        "wait, you're still doing that? seriously?",
        "hold on, you're STILL doin' that? it's been hours",
        "you're still at it? I left three hours ago and you were doin' this. I came back and you're still here. same screen. same position. I'm honestly not sure if I should be impressed or concerned. maybe both. you look like you haven't blinked. have you blinked? blink once for yes. OK good. you're alive. carry on I guess."
    ], context: "stillは「まだ続いてる」だけど、裏に「え、まだ?」って驚きが隠れてる。still going?(まだ続けてんの?)、still here?(まだいんの?)。「もう終わってるはず」という期待があるからstillが効く。期待してなかったら使わない。stillは「予想より長い」のサイン。日本語の「まだ」も同じ構造。期待が裏切られてる。", category: 'reaction' },
    { daySlot: 3, japanese: 'なんていうか', english: [
        "kinda",
        "it's kinda... y'know, weird",
        "it's kinda hard to explain but somethin' feels off",
        "it's kinda... how do I say this... not bad, but not great either. it's in that weird middle zone where you can't complain but you also can't celebrate. like a C+. nobody's ever been excited about a C+. it's the 'fine' of grades. it exists. it happened. moving on."
    ], context: "kind of(口語ではkinda)は意図的にぼかす装置。I'm kind of tired(なんか疲れた)、it's kind of weird(なんか変)。100%言い切らない。80%くらいで止める。日本語の「なんか」「ちょっと」と同じ。面白いのは、英語圏でも断言を避けたい時がちゃんとあること。全部ハッキリ言う言語だと思ったら大間違い。kindaは英語の「なんか」。", category: 'filler' },
    { daySlot: 3, japanese: 'できないじゃん、それ', english: [
        "can't, literally can't",
        "I literally can't -- it's physically impossible",
        "that's impossible, you literally cannot do that, full stop",
        "you can't. and I don't mean 'it's hard.' I mean the laws of physics, time, and common sense are all sayin' no. simultaneously. it's a triple no. and when physics, time, AND common sense agree on somethin', you listen. those three don't agree on anything usually. the fact that they're united against this tells you everything."
    ], context: "英語の短縮形can'tは初期設定。I can not do this(フル形)は怒ってるか裁判か。普段は絶対にcan't。won't(will not)、don't(do not)、isn't(is not)、全部短縮がデフォルト。フルで言うと「あ、この人今ガチだ」ってなる。I am NOT going(俺は行かない、絶対に)。フル形は武器。", category: 'opinion' },
    { daySlot: 3, japanese: 'あ、なるほど', english: [
        "oh I see",
        "ohh, I see what you're gettin' at now",
        "OH, I see it now, that makes so much more sense",
        "ohh. OHHH. OK I see it now. I've been lookin' at this wrong the whole time. you said X and I was thinkin' Y and they're completely different things. that's why nothin' was clickin'. my brain was solvin' the wrong puzzle. with the wrong pieces. in the wrong room. but now I see it. and it's obvious. annoyingly obvious."
    ], context: "なるほど=I see。理解する=見える。英語では「わかる」が「見る」で表現される。I see(わかった)、I see what you mean(言いたいことが見える)、I see your point(論点が見える)。理解=視覚。日本語の「なるほど」は音だけで意味がない。英語は「理解した瞬間に目が開いた」と身体で語る。", category: 'reaction' },
    { daySlot: 3, japanese: 'いや、わかるけどさ', english: [
        "I see what you mean but",
        "I see what you mean, but here's where I disagree",
        "look, I see your point, I do, but I gotta push back on this",
        "I see what you mean. I do. and I'm not dismissin' it. it's a valid point. BUT -- and here's where it gets tricky -- I think you're right about the surface and wrong about the underneath. like, the facts check out but the conclusion doesn't follow. it's like havin' all the right ingredients and makin' the wrong dish. the math is right. the recipe is wrong."
    ], context: "英語で反論するとき、まず相手の意見を認める。I see your point, but... / I get what you're saying, but... まずYes、そしてBut。日本語は「でもさ」でいきなり切り返せるけど、英語は先にうなずいてからひっくり返す。同意→反論の二段構え。これをやらないと「聞いてなかっただろ」って思われる。英語の議論は礼儀正しい格闘技。", category: 'opinion' },
    { daySlot: 3, japanese: '結論から言うと', english: [
        "bottom line",
        "OK so bottom line -- here's what matters",
        "long story short, the whole thing boils down to this",
        "bottom line. and I shoulda started with this but my brain doesn't work front-to-back. it works back-to-front. I think of the details first and the conclusion last. but English people want the conclusion first. so here it is. everything else I said was backstory. this is the headline. if you only remember one thing from the last ten minutes, this is it."
    ], context: "英語は結論が先。日本語は結論が最後。メールもプレゼンも英語は1行目に結論→理由→詳細。日本語は背景→理由→結論。順番が真逆。英語で「結論から言うと」はbottom line、long story short、the point is。全部「今からオチ言います」の予告。日本語は最後まで聞かないとオチがわからない。英語はネタバレから始まる。", category: 'filler' },

    // ── Day 4 ──
    { daySlot: 4, japanese: '昨日買った本', english: [
        "the book I got",
        "the book I bought yesterday is actually fire",
        "that book I grabbed yesterday turned out to be incredible",
        "the book I bought yesterday -- and I almost didn't buy it, almost walked right past it -- is incredible. like, I'm three chapters in and I've already underlined half the pages. my brain is havin' a field day. it's one of those books where every page has a line that makes you stop and stare at the ceiling for a minute."
    ], context: "「昨日買った本」。日本語は修飾語が名詞の前に来る。昨日買った→本。英語は逆。the book→I bought yesterday。名詞が先に来て、説明が後ろから追いかける。日本語は「お膳立てしてからメイン」、英語は「メインを出してから説明を添える」。レストランで言えば、日本語は前菜→メイン、英語はメインがいきなりドン。", category: 'reaction' },
    { daySlot: 4, japanese: '褒められた', english: [
        "got complimented",
        "I actually got complimented on that, believe it or not",
        "someone complimented me and I had no idea how to react",
        "I got complimented. and my brain immediately went 'it's a trap.' 'cause I don't know how to receive compliments. someone says 'nice job' and I'm like 'who, me? are you sure? you got the right person?' Japanese people deflect compliments. English speakers say 'thanks!' and move on. I stand there buffering like a 2005 laptop."
    ], context: "「褒められた」。日本語は「褒める」の受身形。英語はI was complimentedだけど、もっと自然なのはI got complimented。受身なのに視点が「俺」にある。英語のpassiveは「誰に何された」より「俺がどうなった」が主役。日本語は「先生に褒められた」と行為者が大事。英語は「俺が褒められた状態になった」と結果が大事。フォーカスの置き場が違う。", category: 'reaction' },
    { daySlot: 4, japanese: '思いついた！', english: [
        "came up with something",
        "I just came up with something, hear me out",
        "OK wait, I just came up with something kinda genius",
        "I just came up with somethin'. and before you judge it, let me finish. 'cause it sounds crazy at first. like, the first three seconds you're gonna think I lost it. but if you give it ten seconds, you'll see it. trust me. the best ideas always sound insane at first. this one sounds EXTREMELY insane. which means it might be the best one yet."
    ], context: "come up with=「思いつく」。アイデアが下から上に来るイメージ。come(来る)+up(上に)+with(一緒に)。英語ではアイデアは自分が作るんじゃなくて、どこかから浮かび上がってくる感覚。I came up with a plan(計画が浮かび上がってきた)。日本語の「思いつく」も「つく」で外から来る感じがある。", category: 'reaction' },
    { daySlot: 4, japanese: 'やっとわかった', english: [
        "finally figured it out",
        "I finally figured it out and I feel so dumb",
        "it took me forever but I finally figured the whole thing out",
        "I finally figured it out. and the answer was so obvious I'm actually mad at myself for not seein' it sooner. like, it was RIGHT THERE. the whole time. starin' at me. and I was starin' back and seein' nothin'. three days of confusion for an answer that took one sentence to explain. my brain needs a firmware update."
    ], context: "figure outは「頭を使って解明する」。ただわかるのはunderstand。figure outには「苦労してやっとたどり着いた」感がある。パズルを解いた達成感。I figured out the problem(問題を解明した)、I can't figure out why(なぜか解明できない)。日本語の「わかった」は一瞬。figure outは過程が見える。汗かいてる。", category: 'reaction' },
    { daySlot: 4, japanese: 'だからさ', english: [
        "so like",
        "so like I said, that's exactly what I meant",
        "so, y'know, that's basically the whole point right there",
        "so basically -- and this is the fifth time I've said 'so' in this conversation -- the word does everything. 'so' means 'therefore,' it means 'anyway,' it means 'moving on,' it means 'listen up,' it means 'well then.' five functions, two letters. Japanese 'dakara' does the same thing. both languages have this one word that connects everything to everything."
    ], context: "soは英語の「だから」だけど、5つの顔を持つ。so(だから)、so(えーと)、so(それで?)、so(つまり)、so(さて)。文頭のsoは接続詞じゃなくて会話のギアチェンジ。So, what happened?(で、どうなった?)のsoは「だから」じゃない。「話を戻すよ」のサイン。日本語の「で」と同じ。2文字で場面転換する最強の小道具。", category: 'filler' },
    { daySlot: 4, japanese: 'ね？', english: [
        "right?",
        "crazy, right? I knew you'd think so",
        "that's weird, right? tell me that's weird",
        "right? see, I knew it wasn't just me. when someone else confirms what you were thinkin', there's this relief. like 'OK cool, I'm not insane.' 'cause sometimes you think somethin' and you're not sure if it's a real thought or just your brain bein' weird. validation from another human is underrated. seriously. right?"
    ], context: "right?は英語で最も使われる確認タグ。文末にくっつけて「だよね?」をやる。It's hot, right?(暑いよね?)、You're coming, right?(来るよね?)。日本語の「ね」と全く同じ機能。面白いのは、right(正しい)が「同意してくれ」に変わること。正しさを確認してるんじゃなくて、味方を確認してる。", category: 'filler' },
    { daySlot: 4, japanese: '俺が言いたいのはそこじゃない', english: [
        "that's not my point",
        "no no, that's not what I'm tryin' to say at all",
        "you're focusin' on the wrong part, that's not my point",
        "that's not my point. you heard the words but missed the meaning. it's like I showed you a painting and you commented on the frame. the frame's fine. I don't care about the frame. look at the PAINTING. the thing inside the frame. that's what I'm talkin' about. the frame is just how I got there. ignore the frame. please."
    ], context: "英語は声の強さで意味が変わる。I didn't SAY that(俺は言ってない→言ったのは別の人)、I DIDN'T say that(言ってないよ→否定を強調)、I didn't say THAT(それは言ってない→別のことは言った)。同じ5語でも、どこに力を入れるかで意味が3つに分かれる。日本語は語順や助詞で変える。英語は音量で変える。", category: 'reaction' },
    { daySlot: 4, japanese: 'それ消化できてない', english: [
        "still processing",
        "I'm still processing that, gimme a minute",
        "my brain hasn't digested that yet, it's a lot to take in",
        "I'm still digestin' that. you just dumped a lot of information on me and my brain's like a slow cooker. it needs time. some people hear somethin' and instantly get it. I hear somethin' and it sits in my brain for three days and then at 2 AM I go 'OHHH.' that's my processin' speed. slow but thorough."
    ], context: "英語ではアイデア=食べ物。digest(消化する)、swallow(飲み込む)、chew on(噛み砕く)、food for thought(思考の食料)、half-baked idea(生焼けのアイデア)。日本語でも「消化する」「咀嚼する」はあるけど、英語のほうが圧倒的に多い。英語にとって考える=食べる。情報はご飯。", category: 'reaction' },
    { daySlot: 4, japanese: 'あ、そういえば', english: [
        "oh by the way",
        "oh by the way, totally unrelated but",
        "oh that reminds me, completely different topic but",
        "oh by the way -- and this has absolutely nothin' to do with what we're talkin' about, I just remembered it and if I don't say it now I'll forget -- did you see that thing yesterday? I know, random. but my brain works like a browser with forty tabs open. sometimes a tab from three days ago suddenly loads. this is that tab."
    ], context: "by the way(BTW)は話題を変えるときの魔法の言葉。直訳すると「道のついでに」。メインの道(話題)を歩いてて、横道にそれるイメージ。oh by the way(あ、ついでに)で全然関係ない話に飛べる。日本語の「そういえば」と同じだけど、英語のby the wayは使用頻度が異常に高い。会話の30%はby the wayの後に起きてる。", category: 'filler' },
    { daySlot: 4, japanese: '回りくどいな', english: [
        "just get to it",
        "just say it, stop beatin' around the bush",
        "stop dancing around it and just tell me straight",
        "just say it. please. I'm beggin' you. you've been warmin' up for five minutes and I still don't know what you're tryin' to tell me. is it good news? bad news? did someone die? just rip the Band-Aid off. the anticipation is worse than whatever the thing is. probably. unless someone actually died. then the anticipation was warranted."
    ], context: "英語圏では遠回しに言う=相手の時間を奪う。get to the point(要点を言え)、cut to the chase(本題に入れ)、spit it out(吐き出せ)。全部「早くしろ」の別表現。日本語は遠回しが配慮。英語は遠回しが失礼。同じ「ぼかし」が真逆の評価を受ける。文化のOSが違う。", category: 'request' },

    // ── Day 5 ──
    { daySlot: 5, japanese: '問題はそこじゃない', english: [
        "that's not the issue",
        "it's not the X that's the problem, it's the Y",
        "look, it's not the work that's hard, it's the waiting",
        "it's not the job that's killin' me, it's the commute. it's not the meeting that's painful, it's the small talk before it. the actual THING is fine. it's always the stuff AROUND the thing that gets you. the side quests. the hidden fees. the terms and conditions of life."
    ], context: "it's not A that's the problem, it's Bで「犯人はAじゃなくBだ」と指差す構文。スポットライトを当て直す感じ。日本語は「問題はAじゃなくてB」でOKだけど、英語はit's...thatで額縁を作って中身を照らす。ドラマチック。犯人指名の瞬間。刑事ドラマの最終回。", category: 'opinion' },
    { daySlot: 5, japanese: '必要なのは時間', english: [
        "what I need is time",
        "what I need right now is just time, that's it",
        "what I really need isn't advice, it's just time to figure it out",
        "what I need isn't a solution. it's not a plan. it's not advice. what I need is time. just time. to sit with it. to let it marinate. everyone wants to fix things immediately and I'm like -- some things aren't broken, they're just unfinished. give it a minute. stop tryin' to microwave what needs to slow-cook."
    ], context: "what I need is ~で「俺に必要なのは〜だ」。whatで始めると、答えを先に隠して最後に明かす構造になる。what I want is honesty(欲しいのは正直さ)、what bothers me is the timing(気になるのはタイミング)。日本語の「〜なのは」と同じだけど、英語ではwhat節で包むと急にスピーチっぽくなる。説得力が3倍。", category: 'opinion' },
    { daySlot: 5, japanese: 'もう無理', english: [
        "can't take it",
        "I can't put up with this anymore, I'm done",
        "I've been putting up with this for way too long",
        "I can't put up with this. and I've been tryin'. I've been patient. I've been the bigger person. I've been takin' deep breaths. and all that did was prolong the suffering. sometimes you gotta stop bein' patient and start bein' honest. and honestly? I'm done puttin' up with it. the 'up' has been put. the tolerance tank is empty. done."
    ], context: "put up with=我慢する。直訳すると「〜と一緒に上に置く」。意味わからん。でもこれが英語のリアル。句動詞は部品の意味を足しても全体の意味にならない。put(置く)+up(上)+with(一緒)=我慢。なんで? 考えるな。覚えろ。句動詞は英語の方言みたいなもの。理屈より回数。100回聞けば体が覚える。", category: 'reaction' },
    { daySlot: 5, japanese: 'なんとかなる', english: [
        "it'll work out",
        "it'll work out somehow, it always does",
        "don't worry about it, things always work out in the end",
        "it'll work out. it always does. and I have zero evidence for that claim but I believe it with my whole chest. 'cause every time I've panicked, every time I thought 'this is it, it's over,' it worked out. not perfectly. not the way I planned. but it worked out. the universe has a terrible sense of timing but a decent track record."
    ], context: "work outは「うまくいく」。workは「働く」じゃなくて「機能する」。out=「最後まで」。つまり「最後まで機能する」→「うまくいく」。筋トレのwork outも「体を最後まで動かす」。同じwork outなのに文脈で全然違う意味になる。things will work out(なんとかなるよ)は英語圏の最強の慰めフレーズ。根拠ゼロ、でも効く。", category: 'opinion' },
    { daySlot: 5, japanese: 'えっと', english: [
        "well",
        "well... it's complicated, let me explain",
        "well, it's not a simple yes or no, lemme think",
        "well... and that 'well' was me buyin' time 'cause I don't have an answer yet. well is the most honest word in English. it means 'I heard you, I'm thinkin', and the answer is comin' but it's not here yet.' it's a placeholder for a thought that hasn't fully formed. respect the well. it's doin' important work."
    ], context: "wellは「えっと」。文頭に置くだけで「今から考えて喋ります」の合図になる。Well, the thing is...(えーと、実はね)。直前の質問に即答できないとき、wellを置いて時間を稼ぐ。日本語の「ええっと」と全く同じ機能。ただし英語のwellはもう1個ある。well=「まあ」で話題を変える。「Well, anyway」(まあいいや)。一語で二役。", category: 'filler' },
    { daySlot: 5, japanese: 'なんか、こう、あれよ', english: [
        "it was like...",
        "it was like, y'know, one of those things",
        "it was like -- you know when you -- like THAT kind of thing",
        "it was like -- OK how do I explain this -- you know when you're tryin' to describe somethin' and the word's RIGHT there but your mouth won't cooperate? like, the thought is fully formed in your brain but the translation to speech is laggin'? that. it was like that. I still don't know the word. but you get it. right? please say you get it."
    ], context: "likeは「〜みたいな」だけじゃない。会話では毎文に挟まる接続詞。I was like(俺は〜って感じで)、it's like(なんていうか)、like, seriously(いやマジで)。文法的には不要。でもないと不自然。英語のlikeは日本語の「なんか」。どっちも意味はほぼゼロ。でもないと会話のリズムが壊れる。潤滑油。", category: 'filler' },
    { daySlot: 5, japanese: '「読んだ」んじゃなくて「言った」んだよ', english: [
        "I didn't SAY that",
        "I didn't READ it, I SAID it -- big difference",
        "emphasis changes everything -- I didn't SAY that versus I didn't say THAT",
        "watch this. 'I didn't SAY that' means someone else said it. 'I didn't say THAT' means I said somethin' else. same five words. different stress. different meaning. English is a language where volume is grammar. you can't just read English. you gotta hear where the punch lands. the dictionary won't tell you this. only ears will."
    ], context: "英語は同じ文でもストレスの位置で意味が変わる。I didn't SAY that(言ったのは俺じゃない)。I didn't say THAT(それは言ってない、別のことは言った)。I DIDN'T say that(断じて言ってない)。単語は同じ。語順も同じ。変わるのは音だけ。日本語は「は」「が」「を」で区別する。英語は声の強さで区別する。文字には残らない文法。", category: 'opinion' },
    { daySlot: 5, japanese: '冷静になれ', english: [
        "cool down",
        "just cool down for a sec, it's not that serious",
        "take a breath and cool down, you're way too heated right now",
        "cool down. and I know nobody in the history of ever has actually cooled down because someone told 'em to cool down. it usually makes it worse. but I'm sayin' it anyway. 'cause you're hot right now. not attractive-hot. angry-hot. and angry-hot people make angry-hot decisions. which are always bad. always."
    ], context: "英語では感情=温度。cool down(冷静になれ)、hot-headed(頭に血が上った)、heated argument(白熱した議論)、warm personality(温かい人柄)、cold shoulder(冷たい態度)。怒り=熱い、冷静=冷たい。日本語でも「頭を冷やせ」とは言うけど、英語は温度メタファーの密度が異常。感情の辞書の半分は温度計でできてる。", category: 'request' },
    { daySlot: 5, japanese: 'うんうん', english: [
        "uh-huh",
        "uh-huh, yeah, totally, I hear you",
        "right right, yeah, I'm with you, keep going",
        "uh-huh. yeah. mm-hmm. right. yep. -- see, those are all different. uh-huh is 'I'm listenin'.' yeah is 'I agree.' mm-hmm is 'go on.' right is 'I follow.' and yep is 'confirmed.' five words that all sound like agreement but are doin' five different jobs. English backchannel signals are a whole language within the language."
    ], context: "日本語の「うんうん」は万能相槌。英語はもっと細かい。uh-huh(聞いてる)、yeah(同意)、mm-hmm(続けて)、right(理解した)、I see(なるほど)。全部「うん」なのに役割が違う。しかも英語では相槌を打たないと「聞いてない」と思われる。沈黙=無関心。日本語は黙って聞くのが礼儀な場面もあるのに。", category: 'filler' },
    { daySlot: 5, japanese: '人って不思議だよな', english: [
        "you never know",
        "you never know with people, that's the wild part",
        "people are weird, you just never know what anyone's thinkin'",
        "you never know. and the 'you' here isn't you specifically. it's everyone. it's the universal 'you.' you wake up, you eat, you go to work -- that's not about YOU. it's about humans in general. English uses 'you' to talk about everybody. Japanese doesn't need a pronoun at all. English picked the most personal word to describe the most impersonal thing."
    ], context: "英語のyouは「お前」だけじゃない。you never know(人はわからないものだ)のyouは「人間全般」。日本語は「人って」と言えば済むのに、英語は「あなた」を使って一般論を語る。なぜ? 英語は聞き手を巻き込みたがる言語だから。「他人事じゃないよ、お前もだよ」という圧がyouに入ってる。", category: 'opinion' },

    // ── Day 6 ──
    { daySlot: 6, japanese: 'やるって言ったのは知ってた', english: [
        "I knew that",
        "I knew that you said you'd do it",
        "I already knew you said you'd handle it, that's not the issue",
        "I knew you said you'd do it. the question isn't whether you SAID it. the question is whether you'll actually DO it. 'cause there's a Grand Canyon-sized gap between 'I'll do it' and doin' it. I've seen that gap swallow entire projects. whole careers. I'm standin' at the edge of that gap right now lookin' down."
    ], context: "I knew that you said ~。英語は文の中に丸ごと別の文を入れられる。I knew(俺は知ってた)+that+you said(お前が言った)+you'd do it(お前がやると)。3層構造。日本語は「やるって言ったのは知ってた」と助詞で繋ぐ。英語はthatで文を文の中にネスト(入れ子)する。プログラミングの関数みたい。", category: 'opinion' },
    { daySlot: 6, japanese: '来るかどうかわからない', english: [
        "not sure whether",
        "I'm not sure whether they're comin' or not",
        "honestly don't know whether it's gonna happen, could go either way",
        "I don't know whether it's gonna happen. and the not-knowin' is the worst part. like, if it's a no, fine. I can deal with no. if it's a yes, great. but this middle zone where it could be either? this is where anxiety lives. anxiety's address is 'Maybe Street.' whether or not is the street sign."
    ], context: "whether or notは「〜かどうか」で二択をパッケージする。来るor来ない、やるorやらない。日本語は「かどうか」だけど、英語のwhetherは「天気(weather)」と同じ語源。天気=「晴れるか降るかわからない」状態。不確実さを1語に圧縮してる。面白いことに、口語ではifで代用する人が多い。whetherはちょっとフォーマル。", category: 'reaction' },
    { daySlot: 6, japanese: '絶対諦めない', english: [
        "not giving up",
        "I'm not giving up, not now, not ever",
        "nah, I refuse to give up on this, it's too important",
        "I'm not givin' up. and I know I look like I should. every rational indicator is sayin' 'bro, let it go.' but I can't. somethin' in me won't. it's not even stubbornness at this point. it's just -- I started this. and I finish what I start. even when finishin' it is objectively stupid. especially when it's objectively stupid."
    ], context: "give up=諦める。give(渡す)+up(上に)=白旗を上にあげて降参するイメージ。英語ではコントロールを手放す行為はgiveで表現する。give in(屈する)、give way(道を譲る)。逆にnot giving upは「白旗を渡さない」。日本語の「諦める」は心の状態。英語のgive upは身体の動作。手を上げるか上げないか。", category: 'opinion' },
    { daySlot: 6, japanese: 'その話持ち出すなよ', english: [
        "don't bring that up",
        "don't bring that up, seriously, not now",
        "why would you bring that up right now of all times",
        "don't. don't bring that up. we buried that. we had a funeral for that topic. there were flowers. people cried. it was beautiful. and you just dug it up. in the middle of dinner. you're a topic necromancer. you resurrect dead conversations. it's a horrible superpower and I need you to stop usin' it."
    ], context: "bring up=話題を持ち出す。bring(持ってくる)+up(上に)=地下に埋まってた話題を地上に引き上げる。英語では話題は「場に上がるもの」。come up(話題が出る)、bring up(話題を出す)、drop(話題を落とす=やめる)。話題は物理的に上下する。テーブルに乗せたり、床に落としたり。会話は物の運搬。", category: 'shutdown' },
    { daySlot: 6, japanese: 'え、もう？', english: [
        "wait, already?",
        "hold on, already? that was way too fast",
        "wait, that's done already? when did that happen?",
        "already? ALREADY? I wasn't ready. I thought I had time. I thought there was a buffer. a grace period. a 'we'll get to it eventually' zone. but no. it's already here. the future showed up early. without knocking. rude. I specifically asked the future to wait and it said 'nah.'"
    ], context: "alreadyは「もう」だけど、裏に「早すぎない?」という驚きがある。You're done already?(もう終わったの?)=「思ったより早い」。It's 5 already(もう5時)=「思ったより時間が経ってた」。already自体は中立なのに、文脈で自動的に「予想より早い」サプライズが付く。日本語の「もう」も同じ。もう=既に+驚き。", category: 'reaction' },
    { daySlot: 6, japanese: 'まだ来てない', english: [
        "not yet",
        "nah, not yet, still waitin'",
        "it hasn't happened yet but I'm not givin' up hope",
        "not yet. and those two words are the most optimistic words in English. 'cause 'not' is negative. 'yet' is hope. together they mean 'no, BUT eventually.' it's not here NOT YET. the yet is doin' all the emotional work. without yet it's just 'not here' which is depressing. yet turns a dead end into a 'to be continued.' powerful little word."
    ], context: "yetは「まだ」=「予定にはあるけどまだ起きてない」。not yetは否定+未来の期待。「今はダメ、でもいつかは」が3文字に入ってる。Have you eaten yet?(もう食べた?)のyetは「当然食べるよね?」という前提つき。alreadyとyetはセット。already=予想より早い。yet=予想よりまだ。片方は加速、もう片方は待機。", category: 'reaction' },
    { daySlot: 6, japanese: 'え？', english: [
        "wait what?",
        "wait, what? say that again with your whole chest",
        "hold on -- what did you just say? run that back",
        "wait what? did I hear that right? 'cause my ears just did a double take. you know that thing where you hear somethin' and your brain goes 'nah, rewind'? that just happened. say it again. slower. louder. with context. 'cause what I just heard can't possibly be what you actually said. ...right?"
    ], context: "同じ言葉でもイントネーションが上がれば質問になる。「He's coming.」(来るよ)→「He's coming?」(来るの?)。語順を変えず、音だけで疑問文を作る。正式にはIs he coming?だけど、会話では語尾を上げるだけでOK。日本語の「来る。」→「来る?」と全く同じ原理。書き言葉では?を付ける。話し言葉では音が?になる。", category: 'reaction' },
    { daySlot: 6, japanese: '景気いいね', english: [
        "things are looking up",
        "hey, things are finally looking up for once",
        "seems like things are looking up, about time honestly",
        "things are lookin' up. finally. after like three months of everything goin' sideways, somethin' good happened. and I'm not gonna jinx it by talkin' about it too much. I'm just gonna quietly acknowledge that up is better than down and move on before the universe notices I'm happy and sends a curveball."
    ], context: "英語ではmore=up、less=down。things are looking up(上向き=良くなってる)、sales went down(売上が下がった)、cheer up(元気出せ=上に行け)、feeling down(落ち込んでる=下にいる)。量も気分も全部上下で表現する。日本語でも「テンション上がる/下がる」はあるけど、英語は生活の全てが上下。エレベーター言語。", category: 'reaction' },
    { daySlot: 6, japanese: 'たぶんね', english: [
        "I'm not sure but",
        "I'm not sure, but I think that's how it works",
        "honestly I don't know for sure, but my gut says yes",
        "I'm not sure, but I think so. and when I say 'I think so' that's like a sixty percent. not confident enough to bet money but confident enough to nod. there's this sweet spot between 'I know' and 'I have no idea' where most of my opinions live. it's called 'I'm not sure but.' it's my home. I've decorated. there's a couch."
    ], context: "I'm not sureは「わからない」だけど、I don't knowとニュアンスが違う。I don't know=情報がない(知識の問題)。I'm not sure=情報はあるけど確信がない(判断の問題)。日本語は両方「わからない」で済む。英語は「知らない」と「迷ってる」を区別する。not sureは「考え中の途中経過」を見せてる。", category: 'filler' },
    { daySlot: 6, japanese: 'すみません、遅れて', english: [
        "thanks for waiting",
        "hey, thanks for waiting, I appreciate it",
        "sorry I'm late -- actually no, thank you for waiting",
        "thanks for waiting. not 'sorry I'm late.' thanks for waiting. see the difference? 'sorry' puts the spotlight on my failure. 'thanks' puts the spotlight on your patience. same situation. completely different framing. Japanese defaults to すみません for everything. English switches between sorry and thanks depending on who you wanna make the hero. tactical gratitude."
    ], context: "日本語は「すみません(遅れて)」と謝る。英語はthanks for waiting(待ってくれてありがとう)と感謝する。同じ状況で謝罪と感謝が入れ替わる。英語圏では最近「sorry→thanksに変えよう」が流行ってる。Sorry for being late → Thanks for your patience。ネガティブ→ポジティブへの変換。文化のOSアップデート。", category: 'reaction' },

    // ── Day 7 ──
    { daySlot: 7, japanese: '行けたらいいのに', english: [
        "wish I could",
        "I wish I could go but I'm stuck here",
        "I wish I could make it, seriously, but there's no way",
        "I wish I could. and I genuinely mean that. this isn't one of those 'I wish I could' that means 'I don't want to and this is my polite way out.' I actually want to. but the universe decided today is the day everything goes wrong simultaneously. so I can't. and I'm bummed about it. actually bummed. for real this time."
    ], context: "I wish I couldのcouldは現在の話なのに過去形。なぜ? 英語では「現実と違うこと」を言うとき、時制を1つ後ろにずらす。I wish I could(できればいいのに→実際はできない)。このcouldはcanの過去形じゃなくて「仮想世界の印」。日本語は「〜たらいいのに」で仮定を作る。英語は時制をイジって「今ここじゃない世界」を表現する。タイムトラベル文法。", category: 'reaction' },
    { daySlot: 7, japanese: '走るの好き', english: [
        "running's my thing",
        "runnin's kinda my thing, always has been",
        "I've always been into running, it clears my head",
        "runnin's my thing. and I know that sounds basic but hear me out. it's not about fitness. it's about the thirty minutes where my brain shuts up. 'cause normally my brain is a group chat with twelve people all talkin' at once. but when I run? silence. it's the only mute button I've found. and it's free."
    ], context: "「走るのが好き」。日本語は「走る+の」で動詞を名詞化する。英語はrunning(走ること)と-ingを付けて名詞にする。Running is fun(走るのは楽しい)。動詞がそのまま主語になる。英語の動名詞(-ing)は動詞と名詞の二重国籍。日本語の「の」と同じ役割だけど、英語は形が変わる。走る→running。服を着替えて別の仕事に行く感じ。", category: 'opinion' },
    { daySlot: 7, japanese: 'おかしくなりそう', english: [
        "going crazy",
        "I'm going crazy, like actually losing it",
        "I'm seriously going crazy, this is driving me insane",
        "I'm goin' crazy. and not the fun kind of crazy. the 'I've been starin' at the same problem for six hours and my brain is dissolving' kind of crazy. I can feel the sanity leavin'. it's packin' a suitcase. it's callin' a cab. it's gone. I'm operatin' on whatever's left, which is mostly caffeine and spite."
    ], literal: 'about to become strange', context: "goは「行く」だけじゃない。go+形容詞で「(悪い方に)変化する」を表す。go crazy(おかしくなる)、go bad(腐る)、go wrong(うまくいかなくなる)、go blank(真っ白になる)。全部ネガティブ方向。ポジティブには使わない。go happyとは言わない。getは両方いけるけど、goは下り坂専用。英語は悪化に専用動詞がある。嫌な効率の良さ。", category: 'reaction' },
    { daySlot: 7, japanese: '遅れてる', english: [
        "running late",
        "I'm running late, sorry, be there in ten",
        "I'm running about fifteen minutes late, don't wait for me",
        "I'm runnin' late. again. 'cause I'm always runnin' late. at this point people should just add twenty minutes to whatever time I say. 'I'll be there at 3' means 3:20. 'almost there' means I just left. 'on my way' means I'm still in the shower. it's a whole system. a bad system. but a system."
    ], context: "running lateの runは「走る」じゃない。機械が作動してるイメージ。running late(遅れモードで稼働中)、running low(残りが少ないモードで稼働中)、running smoothly(スムーズに稼働中)。人間を機械として描写する英語の癖。日本語は「遅れてる」で状態を言うだけ。英語は「遅延プログラムが実行中」と機械的に言う。人間も機械も同じ動詞で動く。", category: 'reaction' },
    { daySlot: 7, japanese: 'もうちょいだった', english: [
        "almost had it",
        "I almost had it, SO close it hurts",
        "I was this close, like literally millimeters away from getting it",
        "almost. almost almost almost. that word haunts me. 'cause almost means you did everything right except the last part. you climbed the whole mountain and tripped at the summit. you wrote the whole essay and misspelled the title. almost is the cruelest word in English. it means you earned the failure. you didn't just lose. you almost won. which is worse."
    ], context: "almostは「もう少しで〜だった」。あと一歩で届いたのに届かなかった悔しさが詰まってる。almost won(ほぼ勝った=負けた)、almost died(死にかけた=生きてる)。結果は逆なのにalmostで「あの世を覗いた」感じが出る。nearly(もう少し)よりalmostのほうが「ギリギリ感」が強い。指先が触れたのに掴めなかった、あの距離感。", category: 'reaction' },
    { daySlot: 7, japanese: 'ギリギリセーフ', english: [
        "barely made it",
        "barely made it, by like a second, I'm sweating",
        "I barely made it in time, that was way too close",
        "barely made it. and by 'barely' I mean the door was closin' and I slid through like an action movie hero except way less cool and way more sweaty. my heart was at like 180. my lungs were filing a complaint. but I made it. technically. if you define 'made it' as 'arrived in a state of near-death.' which I do."
    ], context: "barelyは「かろうじて」。almostの逆。almost didn't make it(ほぼ間に合わなかった)≒barely made it(かろうじて間に合った)。結果は同じ「ギリギリセーフ」なのに視点が違う。almostは「失敗の方を見てる」、barelyは「成功の方を見てる」。コップの水が半分=half full(barely) or half empty(almost)。同じ人生を楽観か悲観かで語る道具。", category: 'reaction' },
    { daySlot: 7, japanese: 'うん、いや、うん', english: [
        "yeah no yeah",
        "yeah no, you're right -- wait no yeah, I agree actually",
        "yeah no that's not -- oh wait, no yeah you're onto somethin'",
        "yeah no yeah. and if you're confused, welcome to English. 'yeah no' means no. 'no yeah' means yes. 'yeah no yeah' means 'I started disagreeing, changed my mind, and now I agree.' it's three words and a complete emotional journey. it's a rollercoaster in a sentence. Japanese has nothing like this. this is purely English madness."
    ], context: "yeah no=いいえ。no yeah=はい。yeah no yeah=最初は違うと思ったけどやっぱり賛成。カオス。でもネイティブは自然に使い分けてる。最初のyeahは「聞いたよ」の確認、noが本音。no yeahのnoは「違う違う(そんなことないよ)」の否定、yeahが本音。最後の言葉が本音。日本語の「うん、いや、うん」と全く同じ構造。迷いが音になる。", category: 'filler' },
    { daySlot: 7, japanese: '迷ってる', english: [
        "lost",
        "I'm completely lost, no idea which way to go",
        "I'm lost, like, genuinely don't know what to do here",
        "I'm lost. and not like 'oh I took a wrong turn' lost. I mean existentially lost. I don't know where I'm goin'. I don't know where I came from. and the GPS of life has been recalculatin' for the last three years. at some point you gotta accept that the GPS is broken and just drive. pick a direction. any direction. movement beats standing still."
    ], context: "英語では「迷い=道に迷う」。I'm lost(迷ってる=自分を見失った)、lost in thought(考えに迷い込んだ)、I lost my way(道を失った)。物理的に道がわからない=心理的に方向がわからない。日本語も「迷う」は両方に使えるけど、英語のlostは「人生のGPSが壊れた」感がもっと強い。人生=旅が英語の根底にある。", category: 'reaction' },
    { daySlot: 7, japanese: '個人的にはさ', english: [
        "I mean personally",
        "I mean, personally, I wouldn't do that but hey",
        "personally -- and this is just me -- I think there's a better way",
        "personally -- and I always say 'personally' like it's a disclaimer, like 'the following opinion is mine and mine alone, please don't sue me' -- I think the whole thing is overrated. but that's just me. I know people who love it. good for them. different strokes. but MY stroke? nah. my stroke says no."
    ], context: "英語で意見を言う前にクッションを置く。personally(個人的に)、I mean(つまりさ)、in my opinion(俺の意見だけど)。なぜ? 英語圏は「意見には所有者をつけろ」文化。「この意見は俺のであって、お前に押し付けてない」という保険。日本語は「個人的に」なしでも意見が浮遊できる。英語は意見に名札を付けないと無責任扱いされる。", category: 'opinion' },
    { daySlot: 7, japanese: 'いや、いい', english: [
        "nah I'm good",
        "nah, I'm good, thanks though",
        "I appreciate it but nah, I'm good, seriously",
        "nah, I'm good. and watch -- that right there is the most efficient refusal in English. three words. no explanation needed. no excuse needed. no apology needed. 'I'm good' means 'no thank you' without the guilt. Japanese people explain WHY they're refusing. 'ちょっと今日は...' 'いや、さっき食べたから...' English just goes 'I'm good.' done. clean. no loose ends."
    ], context: "I'm good=「いらない、大丈夫」。直訳は「俺は良い状態」。断りなのにポジティブな言葉で断る。コーヒーいる? → I'm good(いい状態だから要らない)。I'll passも「パスする」で軽く断れる。日本語は「いや、ちょっと...」と言い訳を準備するけど、英語は理由なしで断れる。Noに理由は不要。この感覚が日本人に一番難しい。", category: 'shutdown' },

    // ── Day 8 ──
    { daySlot: 8, japanese: 'タバコやめた', english: [
        "quit smoking",
        "I stopped smoking -- like, actually stopped this time",
        "I finally quit smoking for real, cold turkey, done",
        "I stopped smokin'. and before you ask, yes for real this time. and yes I know I said that last time. and the time before. but this time -- stop laughin' -- this time is different. I can feel it. my lungs can feel it. well, my lungs can't feel anything anymore but that's besides the point."
    ], context: "stop -ing(やめた=もうしてない)とstop to do(立ち止まって〜する)は全然違う。I stopped smoking(タバコをやめた)vs I stopped to smoke(立ち止まってタバコを吸った)。真逆。-ingは「やってたことを止める」、toは「新しいことを始めるために止まる」。日本語は「やめた」で両方いける。英語は-ingとtoで命運が分かれる。一文字の差で人生が変わる。", category: 'reaction' },
    { daySlot: 8, japanese: '読んだことある', english: [
        "I've read that",
        "I've read that one before, it's so good",
        "oh I've read that, yeah, it changed how I think about everything",
        "I've read it. and by 'read' I mean I read it three years ago and remember approximately twelve percent of it. but I remember the vibe. the vibe was good. and honestly that's what sticks -- not the facts, not the quotes, just the vibe. if a book changes your vibe, it did its job. the rest is details."
    ], context: "I've read(読んだことある)と I read(読んだ)。have+過去分詞は「過去にやって、今の俺に繋がってる」。I've been to Tokyo(東京に行ったことがある→今の俺の経験値)。I went to Tokyo(東京に行った→過去の事実)。日本語は「〜したことある」で区別するけど、英語はhaveの有無で「今と繋がってるか」が変わる。have=今に引っ張るロープ。", category: 'reaction' },
    { daySlot: 8, japanese: 'やらせて', english: [
        "let me try",
        "just let me try, what's the worst that could happen",
        "c'mon, let me give it a shot, I won't break anything",
        "let me try. just once. and if it goes wrong -- which it might, I'm not gonna lie -- at least we'll know. right now we're in 'what if' territory and 'what if' is the worst place to live. let me just try and if it explodes we'll deal with the explosion. but at least the what-if is dead. I'd rather have a mess than a mystery."
    ], context: "letは「させてあげる」「許可する」。let me try(やらせて)、let it go(放してやれ)、let them in(入れてやれ)。letは支配を手放す動詞。コントロールしてた手を開く。make(強制する)の真逆。makeは握りしめる、letは開く。日本語の「させる」は使役で1種類だけど、英語はlet(許可)とmake(強制)で手の形が違う。", category: 'request' },
    { daySlot: 8, japanese: '笑わせないでよ', english: [
        "you made me laugh",
        "don't make me laugh, I'm tryin' to be serious here",
        "stop, you're making me laugh and this is supposed to be serious",
        "stop. stop makin' me laugh. I'm tryin' to have a serious conversation and you keep droppin' bombs outta nowhere. my face muscles are fighting. half of 'em wanna stay stern and the other half are losin' the battle. this is your fault. I had a whole serious thing planned and now it's ruined. ruined by comedy. the worst kind of ruining."
    ], context: "madeは「強制的に〜させた」。you made me laugh(お前が俺を笑わせた=俺の意志じゃない)。letは許可、makeは強制。He let me go(行かせてくれた)vsHe made me go(行かされた)。日本語は両方「〜させる」。英語は「本人が望んだか望んでないか」で動詞が変わる。made me cryと聞いた瞬間、「泣きたくなかったのに泣かされた」とわかる。動詞1個に同意の有無が入ってる。", category: 'reaction' },
    { daySlot: 8, japanese: 'それしかなかった', english: [
        "only option",
        "that was literally the only option, no choice",
        "there was no other choice, it was the only way",
        "it was the only option. THE only option. not 'the best option' or 'the safest option.' the ONLY. meaning there was one door and I walked through it. 'cause what else was I gonna do? stand in the hallway forever? some decisions aren't decisions. they're inevitabilities dressed up as choices."
    ], context: "onlyは「それだけ」で世界を1個に狭める。the only option(唯一の選択肢)、my only chance(最後のチャンス)。onlyを付けた瞬間に選択肢が消滅して、逃げ道がなくなる。日本語は「〜しかない」で壁を感じるけど、英語のonlyは壁じゃなくてスポットライト。暗い部屋で1つだけ照らされてる感じ。他に何もない孤独感。", category: 'reaction' },
    { daySlot: 8, japanese: 'ほぼわからない', english: [
        "can hardly tell",
        "I can hardly tell the difference honestly",
        "I can hardly tell what's going on, it's all a blur",
        "I can hardly tell. and 'hardly' is doin' heavy liftin' in that sentence. it doesn't mean 'hard.' it means 'almost not.' I can hardly see(ほぼ見えない)。I can hardly hear(ほぼ聞こえない)。hardly is 'the signal exists but it's at one percent.' the Wi-Fi icon is gray. technically connected. practically useless."
    ], context: "hardlyは「ほとんど〜ない」。hardの副詞じゃなくて完全に別の意味。hardly=almost not。I can hardly wait(待ちきれない)、hardly anyone(ほとんど誰も)。存在するけどギリギリ。0.5%くらいの残り。ちなみにhard(一生懸命)とhardly(ほとんどない)は真逆の意味。同じ単語に-lyをつけて意味が180度変わる。英語の嫌がらせ。", category: 'reaction' },
    { daySlot: 8, japanese: 'えーっと、あのさ', english: [
        "um, so like",
        "um... so, like, here's the thing about that",
        "uh... y'know... how do I put this...",
        "um. uh. er. three different sounds and three different jobs. um = I'm CHOOSING the right word. uh = I LOST the word. er = I'm UNCOMFORTABLE with the topic. next time you watch an interview, listen for which one they use. you'll never unhear it. the filler sounds are narrating their brain in real time."
    ], context: "英語の「えーっと」は3種類ある。um=言葉を選んでる最中。uh=言葉を見失った。er=言いにくいことがある。日本語は全部「えーっと」で済むけど、英語は無意識に使い分けてる。umが多い人は慎重、uhが多い人は即興型。フィラー音で性格が出る。言語学者はこれを研究して論文書いてる。「えーっと」の学問。", category: 'filler' },
    { daySlot: 8, japanese: '充電切れ', english: [
        "running on empty",
        "I'm running on empty, batteries at zero",
        "I've been running on fumes since yesterday honestly",
        "I'm runnin' on empty. and by empty I mean negative. like, I'm past empty. I'm in the red zone. the check engine light's been on for a week and I've been ignorin' it. my body sent me a notification saying 'hey, maybe eat a vegetable' and I swiped it away. I'm operatin' on caffeine, bread, and stubbornness. in that order."
    ], literal: 'charging ran out', context: "英語では人間=機械。running on empty(燃料切れで走ってる)、burned out(燃え尽きた)、recharge(充電する)、shut down(シャットダウン)、broke down(壊れた)。全部エンジンの言葉。日本語でも「充電切れ」「ガス欠」は使うけど、英語は公式にburnout(燃え尽き症候群)が医学用語。人間を機械として修理する文化。", category: 'reaction' },
    { daySlot: 8, japanese: '死ぬかと思った', english: [
        "literally died",
        "I literally died, I'm telling you, I'm dead",
        "dude, I literally almost died laughing, my stomach hurts",
        "I literally died. and yes I know 'literally' doesn't mean literally anymore. it means 'I'm exaggeratin' and I want you to know I know I'm exaggeratin' but the exaggeration IS the point.' English speakers use literally to mean figuratively and nobody bats an eye. Japanese does the same with マジ. 'マジで死んだ.' you're clearly not dead. but the マジ sells it."
    ], literal: 'thought I would die', context: "英語のhyperbole(大げさ表現)は日常。I'm dying(死にそう)、I'm starving(餓死しそう)、I literally can't(物理的に無理)。全部嘘。でも全部普通。日本語も「死ぬかと思った」は大げさだけど、英語のほうが頻度が10倍。every(毎回)、never(一度も)、always(いつも)も全部盛ってる。英語は大げさがデフォルト。控えめに言うほうが難しい。", category: 'reaction' },
    { daySlot: 8, japanese: 'なんで遅刻したかっていうと', english: [
        "the reason is",
        "so the reason I was late is actually kinda funny",
        "OK so the reason -- and hear me out on this -- is completely stupid",
        "so the reason I was late -- and I know you didn't ask for an explanation but I'm givin' you one anyway 'cause the silence is killin' me -- is that I forgot today was today. not 'I forgot the meeting.' I forgot WHAT DAY IT WAS. my brain was operatin' on yesterday's schedule. I was on time for yesterday. just not for today."
    ], context: "英語は自動的に理由をつける。I'm late because ~。遅刻した→理由を説明→言い訳を補足。日本語は「遅れました、すみません」で終われる。理由は聞かれたら答える。英語は聞かれなくても理由を出す。なぜ? 英語圏では「理由のない行動=無計画=信用できない」。理由を言うこと自体が信頼構築。日本語は謝罪で信頼を示す。英語は説明で信頼を示す。", category: 'filler' },

    // ── Day 9 ──
    { daySlot: 9, japanese: '正直言うと', english: [
        "honestly",
        "honestly? I didn't think it was gonna work",
        "honestly, if we're being real here, the whole plan was shaky",
        "honestly. and when I say honestly I mean the kind of honestly where I'm about to say somethin' I've been holdin' back for a while. 'cause there's 'honestly' as a filler and there's 'honestly' as a warning shot. this is the warning shot one. brace yourself. or don't. either way, here it comes."
    ], context: "honestly、seriously、frankly。英語には「今から本気で言いますよ」と予告する副詞がある。1語で文全体の温度を変える。Honestly, I don't care(正直どうでもいい)。このhonestlyがなくてもI don't careは成立する。じゃあ何してるの? 「これは建前じゃなくて本音です」というラベルを貼ってる。日本語の「ぶっちゃけ」と同じ機能。1語で本気モードON。", category: 'filler' },
    { daySlot: 9, japanese: '食べて寝て繰り返す', english: [
        "eat sleep repeat",
        "eat, sleep, repeat -- that's literally my whole life",
        "wake up, eat, work, sleep, repeat -- every single day",
        "eat. sleep. repeat. that's it. that's the schedule. there's no plot twist. no character development. no dramatic arc. just three verbs on loop. and honestly? I'm at peace with it. not every day needs to be an adventure. some days are just maintenance runs. keep the machine going. refuel. restart. it's boring but it's honest."
    ], context: "eat, sleep, repeat。リズムが同じ長さの言葉を並べると英語は急に説得力が増す。I came, I saw, I conquered(カエサル)。短い言葉を3つ並べるリズム。日本語は「食べて、寝て、繰り返す」。英語は動詞の原形をカンマで並べるだけで詩になる。リズム=説得力。同じ構造の繰り返しが英語の最強修辞法。CM、演説、名言、全部これ。", category: 'reaction' },
    { daySlot: 9, japanese: 'ちょっと見てみよう', english: [
        "have a look",
        "lemme have a quick look at that",
        "hold on, let me have a look and I'll tell you what I think",
        "lemme have a look. and 'a look' means anywhere from two seconds to forty-five minutes dependin' on how interestin' it is. 'a quick look' is the lie I tell myself before I disappear into a rabbit hole. 'just a look' turns into 'just a deep dive' turns into 'just an all-nighter.' every addiction starts with 'have a look.'"
    ], context: "have a look(見る)、have a try(試す)、have a chat(話す)。全部「have a+名詞」でカジュアルな動作になる。look(見る)をhave a lookにすると「ちょっと見てみる」と軽くなる。haveが「軽くやる」の空気を足す。日本語の「〜してみる」と似てる。do(やる)は真剣、have a do(ない)、have a go(やってみる)は軽い。haveは英語のお試し券。", category: 'suggestion' },
    { daySlot: 9, japanese: 'つい見ちゃう', english: [
        "can't help it",
        "I can't help it, I just keep looking",
        "I can't help checking my phone every five minutes, it's a disease",
        "I can't help it. and I've tried. I've tried not doin' it. I've set timers. I've deleted apps. I've told myself 'this is the last time' approximately four hundred times. but my hands have their own agenda. they just DO it. my brain says no, my fingers say 'too late, already scrollin'.' I'm a passenger in my own body."
    ], context: "can't help -ingは「どうしても〜しちゃう」。意志じゃ止められない。I can't help laughing(笑わずにいられない)、can't help feeling sad(悲しく思わずにいられない)。helpは「助ける」だけど、ここでは「避ける/抑える」の意味。can't help = コントロール不能。日本語の「つい」「思わず」。英語は「自分を助けられない」と表現する。自分との戦いに負けてる。", category: 'reaction' },
    { daySlot: 9, japanese: 'けっこうすごい', english: [
        "quite impressive",
        "that's actually quite impressive, not gonna lie",
        "I'm not easily impressed but that was genuinely quite good",
        "that's quite impressive. and I don't say 'quite' lightly. in British English, 'quite good' means 'meh.' in American English, 'quite good' means 'actually pretty good.' same word, different temperature dependin' on which side of the Atlantic you're on. I'm usin' the American one. which means I'm genuinely impressed. just so we're clear."
    ], context: "quiteは「けっこう」で控えめに褒める。quite good(なかなかいい)、quite interesting(けっこう面白い)。直接的にgreat!って言わないで、ワンクッション置く。understatement(控えめ表現)は特にイギリス英語の文化。「これはかなりいい」をquite good。「これは最高」をnot bad。小さく言うほど大きい意味。逆説的。", category: 'reaction' },
    { daySlot: 9, japanese: 'むしろ逆', english: [
        "I'd rather not",
        "I'd rather not, actually, if that's OK",
        "I'd rather not get into that right now if I'm being honest",
        "I'd rather not. and notice how 'I'd rather not' is way softer than 'no.' 'no' is a wall. 'I'd rather not' is a polite detour sign. it says 'I could do it, technically, but I'm choosin' not to, and I'm bein' real nice about it.' Japanese 'むしろ' flips the direction. English 'rather' does the same. it's a steering wheel for the conversation."
    ], context: "ratherは「むしろ」「どちらかと言えば」。I'd rather stay home(むしろ家にいたい)。preferよりカジュアル。I'd rather notは「できればやりたくない」で、Noの丁寧版。断ってるのに攻撃的じゃない。英語にはNoの言い方が20個くらいあって、ratherはその中で最も紳士的な断り方の1つ。刀じゃなくて扇子で断る感じ。", category: 'opinion' },
    { daySlot: 9, japanese: 'うんうん、それで？', english: [
        "uh-huh, and then?",
        "mm-hmm, right, right, and then what happened?",
        "uh-huh, I'm followin', keep goin', what happened next?",
        "uh-huh. mm-hmm. right. yeah. -- and every one of those sounds I just made? different job. uh-huh means 'I'm listenin'.' mm-hmm means 'I agree.' 'right' means 'I understand.' 'yeah' means 'keep goin'.' I just had a four-word conversation using only backchannel signals. it's like Morse code for social situations."
    ], context: "英語のbackchannel(相槌)は音で意味が変わる。uh-huh(↗上げ)=聞いてる。uh-huh(→平坦)=まあね。mm-hmm(↗上げ)=同意。hmm(↘下げ)=考え中。全部「うん」なのに音の高さで4つの意味になる。日本語も「うん」の言い方で変わるけど、英語はさらに音のバリエーションが多い。言葉じゃない言葉。", category: 'filler' },
    { daySlot: 9, japanese: '壁にぶつかった', english: [
        "hit a wall",
        "I hit a wall and I can't get around it",
        "been workin' on this for days and I just hit a massive wall",
        "I hit a wall. a big one. and I've been standin' in front of it for three days now. I've tried goin' over it. tried goin' around it. tried talkin' to it nicely. nothin'. it's just there. bein' a wall. doin' wall things. and I'm startin' to think the wall isn't the problem. the wall is the wall. the problem is I thought I could get past it without changing direction."
    ], context: "英語では問題=物理的障害物。hit a wall(壁にぶつかった)、get around it(回り込む)、get over it(乗り越える)、run into a problem(問題に走り込んだ)、way out(出口)。全部空間の言葉。日本語も「壁にぶつかる」は言うけど、英語のほうが解決策まで空間で語る。go around(回る)、break through(突破)。問題は景色。解決は移動。", category: 'reaction' },
    { daySlot: 9, japanese: 'まあまあかな', english: [
        "not bad",
        "not bad, actually, better than I expected",
        "eh, not bad, could be worse, could be better",
        "not bad. which in English is actually high praise. 'cause not bad doesn't mean 'not bad.' it means 'good but I'm too cool to say good.' it's understatement. sayin' less to mean more. if someone says 'not bad' about your cookin', that's basically a standing ovation. if they say 'not bad at all?' you won the Nobel Prize of dinner."
    ], context: "not bad=「悪くない」が実は褒め言葉。英語のunderstatement(控えめ表現)。not bad(いいね)、not gonna lie(正直言うと=これから褒める)、I wouldn't say no(断らないよ=欲しい)。小さく言って大きく意味する。日本語の「まあまあ」は本当にまあまあ。英語のnot badはまあまあ以上。二重否定で肯定を作る。めんどくさいけどカッコいい。", category: 'reaction' },
    { daySlot: 9, japanese: '今の気持ちを一言で言うと', english: [
        "I'm frustrated",
        "if I had to name it, I'm frustrated, honestly",
        "right now? I'm frustrated. that's the word. frustrated.",
        "I'm frustrated. and I know 'frustrated' is a specific word. not angry. not sad. not annoyed. frustrated. 'cause in English, you're supposed to NAME your emotion. precisely. like you're orderin' off a menu. 'I'll have the frustration with a side of disappointment.' Japanese lets you feel vaguely. English makes you file a report."
    ], context: "英語は感情を名前で呼ぶ。I'm frustrated(挫折してる)、I'm anxious(不安)、I'm overwhelmed(圧倒されてる)。日本語は「なんかモヤモヤする」「微妙」で済む。英語はfrustratedとanxiousとoverwhelmedを区別して使い分ける。「何を感じてるか正確に言え」が英語の文化。therapy(セラピー)でまず聞かれるのがhow do you feel? 感情に名前をつけることが治療の第一歩。", category: 'reaction' },

    // ── Day 10 ──
    { daySlot: 10, japanese: '俺が言いたいのはさ', english: [
        "what I'm saying is",
        "what I'm tryin' to say is, this changes everything",
        "what I'm getting at -- and I know I'm taking forever -- is this one thing",
        "what I'm tryin' to say -- and I promise there's a point, it's just buried under fifteen tangents and three false starts -- is that the whole thing comes down to one sentence. one. and I coulda just said that sentence ten minutes ago. but no. I had to take the scenic route. through every thought I've ever had. you're welcome for the tour."
    ], context: "what I'm trying to say isで「俺が言いたいのは」を額縁にする。whatで始めると聞き手が「次に来る情報が本題だ」と構える。what matters is(大事なのは)、what I mean is(言いたいのは)。日本語の「〜のは」と同じだけど、英語のwhat節は口語でもスピーチっぽくなる。会話の中にプレゼンが始まる。", category: 'filler' },
    { daySlot: 10, japanese: '多ければ多いほど', english: [
        "the more the merrier",
        "the more people the better, bring everyone",
        "the more I learn about this the less I understand, honestly",
        "the more I read, the less I know. which sounds like a contradiction but it's not. 'cause every answer opens three new questions. it's like hydra. cut one head, two grow back. I started this topic thinkin' I'd be done in an hour. that was six months ago. I'm deeper than ever and further from the exit."
    ], context: "the more ~ the more ~は「〜すればするほど」。the more, the merrier(多ければ多いほど楽しい)、the sooner the better(早ければ早いほどいい)。theを2回使って比較を対にする。日本語の「〜ば〜ほど」と同じ構造だけど、英語のほうがリズムが良くてキャッチフレーズになりやすい。CM、ことわざ、名言に多用される。リズムの良さ=記憶に残る。", category: 'opinion' },
    { daySlot: 10, japanese: '結局泊まっちゃった', english: [
        "ended up staying",
        "I ended up staying way longer than I planned",
        "I went for an hour and ended up staying the whole night",
        "I ended up stayin'. and I had no intention of stayin'. the plan was 'one drink and go home.' the plan was solid. airtight. and then one drink became two, two became food, food became 'well it's already late,' and 'already late' became the sunrise. I didn't choose to stay. stayin' chose me. end up is the autobiography of bad decisions."
    ], context: "end up -ingは「結局〜してしまった」。計画にはなかった結末。I ended up buying it(結局買っちゃった)、ended up in Tokyo(なぜか東京にいた)。目的地を決めずに歩いてたら着いちゃった感じ。日本語の「結局」は中立だけど、end upは「いや、そのつもりじゃなかったんだけど」が入ってる。人生の予定外を語る専用動詞。", category: 'reaction' },
    { daySlot: 10, japanese: '遊びに行きたい気分', english: [
        "feel like going out",
        "I feel like going out, dunno where though",
        "I feel like doing something fun tonight, anything really",
        "I feel like goin' out. and 'feel like' is key. it's not 'I want to go out.' that's a decision. 'I feel like going out' is a mood. it might pass in ten minutes. it's not a commitment. it's a vibe check. and right now the vibe says 'go out.' but ask me again in thirty minutes and the vibe might say 'couch.' vibes are unreliable. but honest."
    ], context: "feel like -ingは「〜したい気分」。want toより弱くて気まぐれ。I feel like eating pizza(ピザの気分)は「ピザが食べたい!」じゃなくて「なんかピザっぽい気分」。気分は変わるかもしれない。want=意志、feel like=ムード。日本語の「〜したい気分」と完全一致。便利なのは断るときにも使えること。I don't feel like it(そういう気分じゃない)。理由不要。気分で断れる。", category: 'suggestion' },
    { daySlot: 10, japanese: 'けっこういいじゃん', english: [
        "pretty good",
        "that's pretty good actually, didn't expect that",
        "wait, that's actually pretty good, I'm pleasantly surprised",
        "that's pretty good. and 'pretty' here isn't 'beautiful.' it's 'surprisingly.' pretty good = 思ったよりいい。pretty bad = 思ったより悪い。it's an understatement amplifier. it says 'I wasn't gonna be impressed but here we are.' prettyは褒めてるのに全力じゃない。七割の拍手。でもその七割がちょうどいい。"
    ], context: "prettyは「かわいい」じゃなくて「けっこう」。pretty good(けっこういい)、pretty sure(けっこう確信してる)、pretty much(ほぼ)。強調なのに100%じゃない。very good(とてもいい)は100%。pretty goodは75%。この微妙な「まあまあ以上、最高未満」が英語の会話でめちゃくちゃ使われる。日本語の「けっこう」と温度がほぼ同じ。", category: 'reaction' },
    { daySlot: 10, japanese: 'やりすぎ', english: [
        "way too much",
        "that's way too much, like, dial it back",
        "you went way overboard on that, it was supposed to be simple",
        "that's way too much. and 'way' is doin' all the work here. 'too much' is already a lot. 'WAY too much' is too much times ten. way is the turbo button of English. way better, way worse, way more, way less. it takes any comparison and launches it into orbit. it's not in the textbook but it's in every conversation."
    ], context: "wayは「めっちゃ」の強調。way too much(めっちゃやりすぎ)、way better(はるかに良い)、way more than I expected(予想よりはるかに多い)。veryとの違いは? veryはフォーマル、wayはカジュアル。This is very important(これは非常に重要)vsThis is way more important(これマジでもっと大事)。wayのほうが体温が高い。感情が入ってる。", category: 'reaction' },
    { daySlot: 10, japanese: 'A、B、そしてC', english: [
        "A, B, and C",
        "first there's the time, then the money, and then the stress",
        "it's the planning, the execution, and the cleanup that kills you",
        "there's three parts. the setup. the execution. and the aftermath. and each one is its own nightmare. but here's the thing -- when you're listenin' to someone list three things in English, the voice goes UP on the first, UP on the second, and DOWN on the last. that falling pitch on the last item means 'that's all, I'm done.' if the voice stays up? there's more comin'."
    ], context: "英語のリストは音にルールがある。A↗、B↗、and C↘。最初と2番目は上がり、最後だけ下がる。上がる=「まだ続くよ」、下がる=「これで終わり」。3つ並べるとき最後に下がらないと「え、まだあるの?」と思われる。日本語にもイントネーションはあるけど、英語ほど「上がり下がりが文法」じゃない。英語は音が句読点の代わりをしてる。", category: 'opinion' },
    { daySlot: 10, japanese: '伝わった？', english: [
        "did that make sense?",
        "did that come across right? or was it just noise?",
        "I hope that made sense 'cause I can't explain it any better",
        "did that come across? 'cause sometimes I explain things and I THINK I'm bein' clear but the other person's face tells a different story. and 'come across' is interesting -- it means the meaning traveled from my brain to yours. like a package. did the package arrive? was it damaged in transit? 'cause I sent a thought and I need delivery confirmation."
    ], context: "come across=「伝わる」。意味が自分から相手に移動するイメージ。did my point come across?(言いたいこと伝わった?)。英語では情報=荷物。送る(convey)、届く(come across)、受け取る(get)。コミュニケーション=配送。日本語の「伝わる」は「伝える」の自動詞。英語は「意味がパイプの中を通って相手に到着した」と物理的に考える。conduit metaphor。", category: 'suggestion' },
    { daySlot: 10, japanese: 'すごいですね〜(棒)', english: [
        "oh wow amazing",
        "oh wow, amazing, so cool -- anyway moving on",
        "wow that's SO impressive -- said no one, including me",
        "oh wow. amazing. incredible. groundbreaking. -- and if you can't tell, that's sarcasm. flat voice, big words. that's the recipe. English sarcasm is sayin' the most positive thing in the most negative tone. the words say 'amazing.' the tone says 'I would rather be anywhere else.' Japanese has 棒読み for this. English has 'deadpan delivery.' same energy. different accent."
    ], context: "英語のsarcasm(皮肉)は声のトーンが全て。oh wow, amazing(平坦な声)=「全然すごくない」。同じ言葉を熱量ゼロで言うと意味が反転する。日本語の「すごいですね〜」(棒読み)と同じ原理。言葉と声のギャップが笑いを生む。ただし英語圏のsarcasmは日本の10倍日常的。友達同士の会話の30%はsarcasm。相手がsarcasmに気づかないと空気が凍る。", category: 'reaction' },
    { daySlot: 10, japanese: '沈黙が気まずい', english: [
        "awkward silence",
        "the silence is gettin' real awkward real fast",
        "someone please say something, this silence is killing me",
        "someone say somethin'. please. 'cause this silence has been goin' on for approximately eight seconds and that's about six seconds too long in English. in Japanese, silence can be comfortable. meditative even. in English, silence means somethin' went wrong. someone said the wrong thing. someone's offended. the silence IS the emergency. fill it. with anything. weather. sports. literally anything."
    ], context: "英語圏では沈黙=異常事態。3秒以上の沈黙はawkward silence(気まずい沈黙)と呼ばれて、誰かが埋めないといけない。日本語では黙って一緒にいるのが心地よい場面がある。「沈黙は金」。でも英語ではsilence is golden(沈黙は金)と言いながら、実際の会話で黙ると全員がパニックになる。理論と実践が真逆。英語は「喋ることが存在証明」の言語。", category: 'opinion' },

    // ── Day 11 ──
    { daySlot: 11, japanese: '知ってる人', english: [
        "someone I know",
        "oh yeah, someone I know went through the same thing",
        "it's actually someone I know from way back, small world",
        "someone I know. not 'a person who I know.' just 'someone I know.' three words and the relative clause is invisible. no 'who,' no comma, nothin'. English deletes the glue and the sentence still holds. that's the cheat code. every time you wanna describe a person, just smash the description right after the noun. no connector needed. the brain fills in the gap."
    ], context: "英語は関係代名詞を省略できる。someone I know(俺が知ってる人)。whoがない。でも通じる。日本語は「知ってる人」と前から修飾する。英語は「person → I know」と後ろから修飾する。方向が逆。しかもその接続詞(who)すら消せる。日本語は修飾語をどんどん前に積む。英語は後ろに追加していく。ビルの建て方が違う。日本語は上から、英語は横から。", category: 'filler' },
    { daySlot: 11, japanese: 'そうだよね？', english: [
        "right?",
        "that's weird, right? I'm not the only one who thinks so?",
        "it's kinda unfair, don't you think? or is it just me?",
        "this is good, isn't it? I mean, it IS good, right? -- see, I already know the answer. I'm not really askin'. the 'right?' at the end is just me beggin' for validation. tag questions are the grammatical equivalent of puppy eyes. 'please agree with me. please. I need this.'"
    ], context: "付加疑問文(tag question)。It's good, isn't it? / You like it, don't you? 肯定文の後ろに否定の疑問を付ける。日本語は「〜だよね?」1パターン。英語は主語と動詞を毎回変えないといけない。is→isn't、do→don't、can→can't。面倒。でもright?って言えば全部代用できる。ネイティブも面倒だから最近はright?で済ませる。文法の退化は怠惰が原因。世界共通。", category: 'reaction' },
    { daySlot: 11, japanese: '泣かせるなよ', english: [
        "you're gonna make me cry",
        "stop it, you're gonna make me cry for real",
        "don't make me cry in public, that's embarrassing",
        "you made me cry. not 'I cried because of you.' YOU made ME cry. see? English assigns blame with make. make me laugh, make me angry, make me think. the subject is the remote control and the object is the TV. you pushed my button. I had no choice. 'make' removes my free will from the equation. convenient."
    ], context: "makeの使役は「強制」。you made me cry(お前が俺を泣かせた)。泣いたのは俺なのに、原因はお前。主語が操縦者、目的語が操縦される側。letは「許可」(let me go=行かせて)、haveは「依頼/手配」(have him call me=彼に電話させて)。make/let/haveの3兄弟で「強制/許可/手配」を使い分ける。日本語は全部「〜させる」。英語は力関係を動詞で可視化する。", category: 'reaction' },
    { daySlot: 11, japanese: 'ちょっと休憩しよ', english: [
        "take a break",
        "let's take five -- my brain's fried",
        "I need to take a break before I lose my mind",
        "take a break. take a walk. take a seat. take a look. take your time. take a chance. English doesn't DO things, it TAKES them. you don't break, you take a break. you don't sit, you take a seat. taking = grabbing an experience off the shelf and holding it for a moment. every experience is a product. you take it, use it, put it back."
    ], context: "takeは「取る」だけじゃない。take a break(休憩を取る)、take a look(見てみる)、take a walk(散歩する)。なぜ動詞がtakeなの? 英語は体験を「取る」ものとして扱う。棚から商品を取るように、休憩も散歩も「取る」。日本語は「休憩する」「散歩する」とそのまま動詞化。英語は名詞を取る。する/取る の差が英語と日本語のアクション哲学の差。", category: 'suggestion' },
    { daySlot: 11, japanese: 'その話、聞いたことある', english: [
        "heard about that",
        "oh yeah, THE thing -- everybody's been talkin' about it",
        "that's the thing everyone keeps bringing up at every party",
        "THE thing. not A thing. THE. one little word and suddenly everyone knows exactly what you're talkin' about. 'a thing' could be anything. 'THE thing' is THE one. the specific one. the one in the news, on Twitter, in everyone's group chat. 'the' is a spotlight. 'a' is a flashlight. same light, wildly different focus."
    ], context: "theとaの差は「共有知識」。a book=どの本かわからない。the book=お互いどの本か知ってる。日本語に冠詞はない。「本を読んだ」で済む。英語は毎回「この本は相手も知ってるか?」を判断してthe/aを選ぶ。しかも間違えると意味が変わる。I saw a dog(犬を見た)とI saw the dog(あの犬を見た)。日本語話者にとってthe/a判定は英語最難関のひとつ。しかも説明できるネイティブはほぼいない。", category: 'filler' },
    { daySlot: 11, japanese: '電車の中で寝ちゃった', english: [
        "fell asleep on the train",
        "I fell asleep on the train and missed my stop, classic",
        "passed out on the train -- woke up at the last station",
        "I fell asleep ON the train. not IN the train. ON. because I'm on the surface of the train, not inside a box. wait, I AM inside the train. but English says 'on.' why? because 'on' is for vehicles you can walk around in. on the bus, on the train, on the plane. but IN the car. 'cause you can't walk around in a car. the rule is walkability. wild."
    ], context: "on the train(電車で)、on the bus(バスで)、on the plane(飛行機で)。でもin the car(車で)。なぜ? 中で歩き回れる乗り物はon、歩けないのはin。これは「接触の面積」の感覚。電車の床の上に立つ=on。車のシートに収まる=in。日本語は全部「〜で」。英語は乗り物のサイズで前置詞が変わる。on/inの選択は「自分の体と乗り物の関係」を毎回計算してる。", category: 'reaction' },
    { daySlot: 11, japanese: '写真と全然ちがう', english: [
        "REcord vs reCORD",
        "like, is it REcord or reCORD? depends what you mean",
        "same spelling, totally different word -- stress changes everything",
        "PREsent vs preSENT. REcord vs reCORD. OBject vs obJECT. same letters. same spelling. different stress = different word. the first one's a noun, the second one's a verb. English hides two words inside one spelling and trusts your ears to sort it out. Japanese uses kanji for this. English uses volume. same problem, completely different solution."
    ], literal: 'totally different from the photo', context: "英語は同じスペルでもストレス位置で品詞が変わる。REcord(名詞:記録)とreCORD(動詞:録音する)。PERmit(名詞:許可証)とperMIT(動詞:許可する)。前にアクセント=名詞、後ろにアクセント=動詞。この法則を知らないと聞き取れない。日本語は漢字で区別(記録/録音)。英語は音圧で区別。文字じゃなくて息の強さで意味を分ける。口が辞書。", category: 'opinion' },
    { daySlot: 11, japanese: 'その意見、ちょっと弱くない？', english: [
        "shot it down",
        "they shot down every single point he made -- brutal",
        "she attacked his argument and he couldn't defend any of it",
        "he defended his position but she shot it down. then he retreated. she won the argument. -- notice? defend, shoot down, retreat, win. this isn't a discussion. this is a WAR. English treats every argument like a battlefield. you attack points. you defend claims. you shoot down ideas. nobody's actually firing weapons. but the language sure sounds like it."
    ], context: "英語では議論=戦争。attack an argument(議論を攻撃)、defend your point(主張を守る)、shoot down an idea(アイデアを撃ち落とす)、win an argument(議論に勝つ)。全部軍事用語。日本語は「反論する」「主張する」と比較的中立。英語は討論の時点で戦闘モード。だからディベート文化が強い。言語が「議論=勝ち負け」って教えてるから、英語話者は議論で引かない。言語が性格を作る。", category: 'opinion' },
    { daySlot: 11, japanese: 'たぶんそうだと思う', english: [
        "I think so, maybe",
        "I think so, I mean, I'm not a hundred percent sure",
        "I think that's right, but don't quote me on it",
        "I think so. maybe. probably. I'm not sure. kinda. sorta. -- English has like fifteen ways to say 'I'm not confident.' and people stack them. 'I kinda think maybe it's probably sort of right?' that's four hedges in one sentence. four layers of uncertainty. Japanese goes 「たぶん」 and done. English wraps every opinion in bubble wrap."
    ], context: "英語はhedging(ぼかし)の道具が異常に多い。I think、maybe、probably、sort of、kind of、I guess、I suppose、I'd say、in my opinion。全部「確信ない」の表現。でもレベルが違う。I think(70%確信)、I guess(40%)、maybe(50%)、sort of(形が違う)。日本語の「たぶん」は1語でカバー。英語は確信度を10段階で報告できる。精密に曖昧。矛盾してるけどそういう言語。", category: 'filler' },
    { daySlot: 11, japanese: '気まずい沈黙', english: [
        "awkward silence",
        "that awkward silence when nobody knows what to say",
        "the silence got so awkward someone coughed just to break it",
        "three seconds of silence in English conversation and everyone panics. someone coughs. someone checks their phone. someone says 'soooo...' because silence is FAILURE in English. it means the conversation died. in Japanese, silence is fine. it's ma. it's breathing room. in English, silence is a corpse on the dinner table. everyone sees it. nobody knows what to do."
    ], context: "英語圏で沈黙は「事故」。3秒黙ると誰かがsoooo...とかanywayとか言って埋めにくる。日本語の沈黙は「間(ま)」=自然な呼吸。英語の沈黙は「failure」=会話の死。だから英語話者はsmall talkを大量にする。天気、スポーツ、週末の予定。中身ゼロでも音を出し続ける。沈黙より無意味な音のほうがマシ。これが英語の社会契約。静かにする権利は日本語だけの特権。", category: 'opinion' },

    // ── Day 12 ──
    { daySlot: 12, japanese: '近くにコンビニある？', english: [
        "is there one nearby?",
        "is there a convenience store around here?",
        "there's gotta be a convenience store somewhere near here",
        "is there a...? there is a...! there's not a...! -- 'there' is the stage director. it brings things into existence on the stage of conversation. 'there's a problem' = a problem just appeared on stage. 'there's no way' = possibility just walked off stage. 'there' controls what exists in the shared reality of this conversation."
    ], context: "there is/areは「存在の導入」。there's a cat outside(外に猫がいる)。このthereは場所じゃない。「今からこの世界に猫を登場させます」という舞台演出。日本語は「猫がいる」で直接言う。英語はthereという前置きで「新キャラ登場」を予告する。it isと似てるけど違う。it is=既知のものを説明。there is=未知のものを初登場させる。英語は情報管理が几帳面。", category: 'filler' },
    { daySlot: 12, japanese: '一番驚いたのがオチだった', english: [
        "it was the ending",
        "it was the ending that blew my mind, not the twist",
        "what really got me was the ending -- everything else was buildup",
        "it was THE ENDING that shocked me. not the beginning. not the character development. it was the ending. this structure puts a spotlight on one thing by making the rest of the sentence a dark stage. 'it was X that Y' = everything else is background noise. X is the star. one grammatical move and you've got a Hollywood close-up."
    ], context: "強調構文 it is...that。It was the ending that surprised me(驚いたのは結末だった)。普通に言えばThe ending surprised meで済む。でもit was...thatで包むと、endingにスポットライトが当たる。日本語の「〜のは〜だった」と同じ効果。普通の文の材料を並べ替えるだけでドラマが生まれる。英語は語順で感情を操作する。同じ事実でも、置き方で温度が変わる。", category: 'opinion' },
    { daySlot: 12, japanese: '我慢してたんだけどさ', english: [
        "put up with it",
        "I put up with it for way too long honestly",
        "I've been puttin' up with this nonsense and I'm done",
        "I put up with it. put. up. with. it. four tiny words that mean 'I suffered quietly and I deserve a medal.' 'put up with' is the most passive-aggressive phrasal verb in English. it doesn't say 'I endured.' it says 'I tolerated YOU.' the blame is built into the prepositions. up = above. with = alongside. I raised myself above the annoyance and walked alongside it. saint behavior. verbalized."
    ], context: "put up withは「我慢する」だけど、tolerateより感情がこもってる。I tolerate noise(騒音を許容する)は事務的。I put up with your nonsense(お前のバカに付き合ってやってる)は怒りが透けてる。putの句動詞は多すぎて地獄。put off(延期)、put on(着る/演じる)、put out(消す)、put down(置く/けなす)。同じputなのに前置詞で意味が7回変わる。英語の句動詞は多言語話者の最大の敵。", category: 'reaction' },
    { daySlot: 12, japanese: '昔はよくそうしてたな', english: [
        "would always do that",
        "I would always stay up late readin' manga, every night",
        "we would go to that ramen place every Friday without fail",
        "we would go. every Friday. without fail. that 'would' isn't conditional. it's not 'if I could.' it's nostalgia in a word. 'would' for past habits paints everything in sepia tone. 'I went every Friday' = fact. 'I would go every Friday' = memory with feelings attached. same information, different emotional filter. 'would' is Instagram for the past."
    ], context: "wouldは仮定法だけじゃない。I would always eat there(いつもそこで食べてたな)。過去の習慣にwouldを使うと、ただの事実報告が思い出に変わる。used to(昔は〜だった)は客観的終了。would(よく〜したものだ)は感傷的回想。同じ過去なのに温度が違う。日本語の「〜したものだ」と完全一致。would = 記憶のフィルター。事実にノスタルジアをかける1語。文法が感情を運ぶ。", category: 'filler' },
    { daySlot: 12, japanese: 'これ、あなたに買ったの', english: [
        "bought this for you",
        "I got this for you -- thought you'd like it",
        "here, I picked this up for you, no special reason",
        "I bought this FOR you. not TO you. FOR you. 'to' delivers. 'for' dedicates. I gave it TO you = transfer of object. I bought it FOR you = this purchase was motivated by your existence. 'for' carries intent. 'to' carries direction. same gift, different emotional GPS. choose the wrong preposition and the romance dies."
    ], literal: 'bought this for you', context: "forとtoの差。I gave it to you(あなたに渡した)=物理的移動。I bought it for you(あなたのために買った)=動機。toは矢印、forは理由。日本語は「あなたに」で両方カバーできるけど、英語は方向(to)と目的(for)を分ける。cook for you(あなたのために料理)、cook to order(注文に合わせて料理)。1文字の差で「愛情」か「業務」か変わる。前置詞は感情のスイッチ。", category: 'reaction' },
    { daySlot: 12, japanese: '駅で待ち合わせね', english: [
        "meet at the station",
        "let's meet at the station -- the big exit, not the small one",
        "I'll be at the station at noon, don't be late",
        "at the station. at noon. at 100 miles per hour. at first glance. at all costs. -- 'at' is a dart. it hits a precise point. 'in' fills a space. 'on' covers a surface. 'at' just pokes one exact spot. 'at the station' = that specific dot on the map. 'in the station' = somewhere inside the building. 'at' doesn't care about interiors. it just marks the X."
    ], context: "atは「点」。at the station(駅という1点)、at noon(正午という1点)、at 30 degrees(30度という1点)。in the station(駅の中)だと建物内部の空間に入る。on the station(駅の上)は屋上にいる。日本語は「駅で」の1語で全部OK。英語はat/in/onで「点/中/上」を毎回選ぶ。3D空間を前置詞で常にナビゲーションしてる。英語話者の脳は常にGPSが起動してる。", category: 'suggestion' },
    { daySlot: 12, japanese: '言い方で全部変わるやん', english: [
        "it's all in the stress",
        "the meaning totally changes depending on which word you stress",
        "same exact words, different stress, completely different meaning",
        "I didn't say HE stole it. I didn't SAY he stole it. I didn't say he STOLE it. I didn't say he stole IT. -- same seven words. four completely different meanings. move the stress and you move the meaning. English is a piano. the notes are the same. the music depends on which key you hit harder. Japanese does this with particles. English does it with volume."
    ], context: "I didn't say he stole it。HEを強調すると「彼がやったとは言ってない(別の人)」。STOLEを強調すると「盗んだとは言ってない(借りたかも)」。ITを強調すると「それを盗んだとは言ってない(別のもの)」。同じ7語で4つの意味。ストレス位置が意味を決める。日本語は「は/が」の助詞で同じことをする。英語は息の強さで。道具は違うけど結果は同じ: 強調が意味を変える。", category: 'opinion' },
    { daySlot: 12, japanese: 'わかった！見えた！', english: [
        "I see it now",
        "ohh I see it now -- that makes so much sense!",
        "I finally see what you mean, it just clicked",
        "I SEE. not 'I understand' -- I SEE. English treats understanding as vision. I see your point. I see what you mean. clear explanation. foggy idea. bright student. dim person. understanding = light entering your eyes. if you can see it, you get it. blindness = ignorance. vision = knowledge. the entire English philosophy of learning is built on eyeballs."
    ], context: "英語は理解=視覚。I see(わかった=見えた)、clear(明確=透明)、vague(曖昧=霧がかった)、bright(頭いい=明るい)、outlook(見通し)。全部目の比喩。日本語は「分かる」=「分ける」。理解は分解。英語の理解は観察。I don't see your point(あなたの論点が見えない=理解できない)。目を使わない理解は英語では存在しない。だからshow me(見せて=説明して)が通じる。", category: 'reaction' },
    { daySlot: 12, japanese: 'ところでさ', english: [
        "by the way",
        "oh by the way, completely unrelated, but guess what",
        "speaking of which -- actually no, this is totally off topic",
        "by the way. three words that mean 'I'm about to change the subject and I know it.' it's a verbal turn signal. 'by the way' warns the listener: we're leaving this road. the current topic is about to die. but politely. with notice. without 'by the way,' you'd just swerve and confuse everyone. it's conversational courtesy."
    ], context: "by the wayは「今の話から横道にそれます」宣言。道(way)のそば(by)を通りますよ、と。本道から外れる前の予告。日本語の「ところで」も同じ機能。speaking of which(それに関連して)はもっと滑らか。ちなみにby the wayは文頭にも文末にも置ける。I'm leaving, by the way.(文末)のほうがカジュアル。文末に置くと「あ、ついでに」感が出る。位置で温度が変わる。", category: 'filler' },
    { daySlot: 12, japanese: '天気の話しかしないやん', english: [
        "small talk about weather",
        "why do English speakers always talk about the weather first?",
        "nice weather, huh? -- that's not a question, that's a social contract",
        "nice day, isn't it? -- nobody cares about the weather. nobody. it's not meteorology. it's a password. you say 'nice day' and the other person says 'yeah, gorgeous' and now the door is open. conversation has been authorized. in Japan, you bow. in English, you talk about clouds. both are rituals. both mean 'I acknowledge your existence.' the weather is just the handshake."
    ], context: "英語のsmall talkは社会的義務。天気、週末の予定、スポーツ。中身はどうでもいい。目的は「私はあなたに敵意がない」の表明。日本語では「お疲れ様です」がこの機能を果たす。情報量ゼロでも言わないと関係が壊れる。英語の天気トーク=日本語のお疲れ様。形は違うけど役割は同じ: 社会の潤滑油。潤滑油の中身を分析しても意味がない。滑ればいい。", category: 'opinion' },

    // ── Day 13 ──
    { daySlot: 13, japanese: 'いくらかかるか気になる', english: [
        "wondering how much",
        "I wonder how much it costs -- too scared to ask",
        "I've been wondering how much that thing costs but nobody'll tell me",
        "I wonder how much it costs. not 'I wonder how much does it cost.' the question flips. inside a sentence, questions stop being questions. 'how much does it cost?' = question. 'I wonder how much it costs' = statement wearing a question's clothes. the word order changes. the question mark disappears. the curiosity stays. English disguises questions as statements all the time."
    ], context: "間接疑問文。How much does it cost?(直接)→I wonder how much it costs(間接)。語順が変わる。does it cost → it costs。疑問文を文の中に入れると、疑問の語順(助動詞+主語)が消えて平叙文の語順(主語+動詞)に戻る。日本語は「いくらかかるか」で語順変わらない。英語は「質問モード」と「報告モード」で語順を切り替える。モード切替が1文の中で起きる。", category: 'filler' },
    { daySlot: 13, japanese: '窓が割れてた', english: [
        "the window was broken",
        "came home and the window was broken -- no idea who did it",
        "the window was already broken when I got there, I swear",
        "the window was broken. not 'someone broke the window.' the WINDOW was broken. passive voice. the criminal disappeared. the victim became the subject. and suddenly the story is about the window's experience, not the criminal's action. English passive = the security camera is broken. we know something happened. we just can't see who did it."
    ], context: "受動態は「犯人を消す」装置。The window was broken(窓が割れていた)。誰が割ったか不明、または言いたくない。Mistakes were made(ミスがあった)は政治家の名文句。「俺がやった」と言わずに事実だけ報告する。日本語は「窓が割れてた」で自然に犯人が消える。英語は能動態が基本だから、受動態を選ぶ=意図的に犯人を隠してる。選択が透ける。", category: 'reaction' },
    { daySlot: 13, japanese: 'ガソリンなくなった', english: [
        "ran out of gas",
        "we ran out of gas in the middle of nowhere -- worst timing",
        "I'm runnin' out of patience and also actual gasoline",
        "ran out of gas. ran out of time. ran out of ideas. ran out of patience. 'run out' is the exit door for everything. gas runs out of the tank. time runs out of the clock. patience runs out of your body. the thing was inside a container, and it ran away. empty container = crisis. 'run out of' is the three-word alarm bell."
    ], context: "run out ofは「容器から走り出た=なくなった」。ガソリンがタンクから出た、忍耐が体から出た。全部「中にあったものが逃げた」イメージ。日本語は「なくなった」で終わり。英語はrun(走る)+out(外へ)+of(から)で3段階の物理描写。ものがなくなる現象を「逃走」として語る。なくなったんじゃない、逃げられたんだ。英語は消失を動的に描く言語。", category: 'reaction' },
    { daySlot: 13, japanese: '続けてよ、もっと聞きたい', english: [
        "keep going",
        "no don't stop, keep goin' -- this is getting good",
        "keep it up, I wanna hear the rest of this story",
        "keep going. keep talking. keep trying. keep dreaming. 'keep' is the anti-stop button. whatever verb comes after 'keep,' you're not allowed to quit it. 'keep' grabs the action by the collar and says 'you're not done yet.' it's the verb of persistence. the verb of stubbornness. the verb of every motivational poster ever printed."
    ], context: "keepは「維持する」。keep going(続ける)、keep trying(頑張り続ける)、keep in mind(心に留めておく)、keep up(ついていく)。stopの反対。何かを止めさせない力。日本語は「続ける」「頑張る」と動詞が変わるけど、英語はkeep+動詞ingで全部カバー。keepは動詞にしがみつく接着剤。どんな動作にもkeepを貼れば「やめない」宣言になる。万能の継続マーカー。", category: 'request' },
    { daySlot: 13, japanese: '予定パンパン', english: [
        "day off tomorrow",
        "finally got a day off -- I'm doin' absolutely nothing",
        "took the day off 'cause I needed to just breathe for once",
        "day off. off duty. off the clock. off the grid. 'off' = disconnected. unplugged. when you're 'off,' you've been removed from the system. day off = a day removed from the work schedule. take off = remove yourself from the ground. call off = remove the event from existence. 'off' is the undo button. English's ctrl+Z."
    ], context: "offは「離脱」。day off(仕事から離脱した日)、take off(地面から離脱する=離陸)、call off(予定から離脱させる=中止)、put off(今から離脱させる=延期)、turn off(電源から離脱=消す)。日本語だと「休み」「離陸」「中止」「延期」「消す」と全部別の単語。英語はoff1語で「離脱」の概念を横断的にカバー。offが見えたら「何かが何かから離れた」と思えばだいたい合ってる。", category: 'filler' },
    { daySlot: 13, japanese: 'ようやくわかった', english: [
        "figured it out",
        "I finally figured it out -- took me way too long though",
        "after three hours of starin' at it, I figured it out",
        "figured it out. work it out. sort it out. find out. turn out. -- 'out' is the reveal. the answer was hidden inside and you brought it out. 'figure out' = you calculated the answer out of the mess. 'work out' = you labored the solution out of the problem. 'out' is always the moment the hidden thing becomes visible. out = ta-da!"
    ], context: "outは「外に出す」。figure out(考えて外に出す=解決する)、work out(努力して外に出す=うまくいく)、find out(探して外に出す=発見する)、turn out(回して外に出す=結果がわかる)、point out(指さして外に出す=指摘する)。全部「隠れてたものを外に出す」。日本語はそれぞれ別の動詞。英語はout1語で「発見の瞬間」を表現する。outは知識の産声。", category: 'reaction' },
    { daySlot: 13, japanese: 'りんごって言うと繋がるよね', english: [
        "an apple sounds weird",
        "it's 'an apple' not 'a apple' -- say it out loud, you'll feel why",
        "English hates two vowels crashin' into each other",
        "an apple. an orange. an hour. not 'a apple.' why? because 'a' followed by a vowel sound makes your mouth do an awkward stop. try it. 'a apple.' your throat literally chokes. 'an apple' flows. that little 'n' is a bridge. it connects two vowels so your mouth doesn't crash. English built a grammatical traffic light to prevent mouth accidents."
    ], context: "aとanの切り替えは「口の交通整理」。母音の前はan、子音の前はa。a bookはスムーズ。a appleは喉が詰まる。だからanを入れて橋を作る。面白いのはan hour。hは子音なのにanを使う。なぜ? hを発音しないから。スペルじゃなくて「音」で判断する。a university(ユニ=子音yで始まる)。英語のルールは文字じゃなくて口が決める。耳で書くルール。", category: 'opinion' },
    { daySlot: 13, japanese: '人生って旅みたいだよね', english: [
        "life's a journey",
        "I feel like I'm at a crossroads right now -- which way do I go?",
        "we've come a long way, but the road ahead is still unclear",
        "we're at a crossroads. we've hit a dead end. we need to find a new path. we've gone down the wrong road. -- nobody's actually walking anywhere. but English treats every life decision as a physical journey. you're always on a road, at a fork, taking a detour. your career has a trajectory. your relationship has direction. English can't think about life without legs."
    ], context: "人生=旅のメタファー。at a crossroads(岐路に立つ)、dead end(行き止まり)、go down the wrong path(間違った道を行く)、long way to go(先は長い)。英語は人生の全ステージを道路で表現する。日本語も「人生の岐路」と言うけど、英語ほど徹底してない。英語はcareer path(キャリアの道)、life journey(人生の旅)と全部に道路を敷く。GPSなしの人生ドライブ。", category: 'opinion' },
    { daySlot: 13, japanese: 'ま、言いたいことはわかるけど', english: [
        "I see what you mean, but",
        "I see what you're sayin', but I don't totally agree",
        "look, I get your point, I just think there's another way to look at it",
        "I see what you mean, but... -- this is the gentlest knife in English. you acknowledge their point (I see what you mean) then stab them with 'but.' the first half is anesthesia. the second half is surgery. 'I hear you' + 'you're wrong' in one smooth motion. it's disagreement disguised as understanding. polite violence."
    ], context: "英語の丁寧な反論パターン。I see what you mean, but...。前半で相手を認めて(I see)、butで切る。日本語の「ま、わかるけど」と同じ構造。butの前は麻酔、butの後は手術。このパターンを知らないと、butの後しか聞かないネイティブと、butの前で安心する日本人の間にギャップが生まれる。英語話者はbutの後に本音があることを知ってる。butは「ここからが本題」の合図。", category: 'suggestion' },
    { daySlot: 13, japanese: 'ごめん、ごめん、マジごめん', english: [
        "sorry sorry sorry",
        "oh my god I'm so sorry, I didn't mean to -- I'm such an idiot",
        "I am SO sorry, please forgive me, I feel terrible about this",
        "I'm sorry. oh I'm sorry. I'm SO sorry. excuse me. my bad. my apologies. pardon me. -- English has like eight levels of sorry and you need to pick the right one or you'll either sound like a psychopath or like you just ran over someone's dog. 'my bad' = spilled your coffee. 'I am so terribly sorry' = spilled your coffee on your wedding dress."
    ], context: "英語の謝罪はレベル制。my bad(軽い)→sorry(中)→I'm so sorry(重い)→I sincerely apologize(公式)。日本語は「ごめん」→「すみません」→「申し訳ございません」と敬語レベルで変わる。英語は感情の込め方で変わる。でも英語圏の人はsorryを言いすぎる。ドアを開けてもらってsorry、道を譲ってもらってsorry。カナダ人は存在にsorry。謝罪インフレ。言えば言うほど価値が下がる。", category: 'reaction' },

    // ── Day 14 ──
    { daySlot: 14, japanese: '雨降らなかったら行くよ', english: [
        "if it doesn't rain",
        "I'll go if it doesn't rain -- but knowin' my luck...",
        "if the weather's decent I'll definitely be there",
        "if it rains, I'll stay home. if it rained, I'd stay home. if it had rained, I would've stayed home. -- three ifs. three realities. the first one: maybe it'll rain. the second: it's not raining but imagine if it were. the third: it didn't rain and I'm rewriting history. English has three versions of 'if' because English speakers can't stop imagining parallel universes."
    ], context: "英語のif文は3段階。1st: If it rains, I'll stay(降るかも→降ったら残る)。2nd: If it rained, I'd stay(今降ってないけど仮に降ったら)。3rd: If it had rained, I would've stayed(あの時降ってたら)。日本語は全部「降ったら」で済む。英語は「現実の可能性/仮定/過去の仮定」を文法で区別する。3つの平行世界を文法で管理してる。英語の脳は常にifの分岐を計算してる。", category: 'suggestion' },
    { daySlot: 14, japanese: '行かないわけにはいかない', english: [
        "can't not go",
        "I literally can't NOT go -- it'd be weird if I didn't",
        "there's no way I can skip it, I can't not show up",
        "I can't not go. double negative. logically it means 'I must go.' but emotionally? it means 'I don't wanna go but I have to.' the double negative carries the reluctance. 'I have to go' = neutral. 'I can't not go' = I tried every excuse and none of them worked. it's obligation with a struggle attached. the grammar is fighting itself."
    ], context: "二重否定はロジック上は肯定(can't + not = must)。でも感情は違う。I have to go(行かなきゃ)は義務。I can't not go(行かないわけにはいかない)は「行きたくないけど逃げられない」。否定を2回重ねることで、1回の肯定より複雑な感情が出る。日本語の「行かないわけにはいかない」も二重否定で同じ効果。両言語とも、義務に抵抗してから従う構文がある。ため息の文法。", category: 'opinion' },
    { daySlot: 14, japanese: '結局どうなったの？', english: [
        "how'd it turn out",
        "so how'd it all turn out in the end? good? bad?",
        "I'm dying to know how it turned out -- don't leave me hangin'",
        "how'd it turn out? turn out. TURN. the situation rotated and showed its other face. like a coin flip. heads or tails. good or bad. you don't know until the thing turns. 'it turned out great' = the coin landed on the good side. 'it turned out to be a disaster' = the coin landed face-down in a puddle. 'turn out' = fate completing its rotation."
    ], context: "turn outは「回転して結果が見える」。It turned out great(結果的に良かった)。turnは回転。結果が裏側に隠れてて、回転して表になった瞬間がturn out。日本語の「結局」は結論だけ言う。英語のturn outは結論が出る瞬間のドラマを含んでる。turn up(現れる)、turn down(断る)、turn around(好転する)。turnは状況が回転するたびに新しい面を見せる。人生はルーレット。", category: 'reaction' },
    { daySlot: 14, japanese: '持ってきてくれる？', english: [
        "bring it over",
        "hey can you bring that over here? I'm too lazy to get up",
        "bring it here, don't take it there -- see the difference?",
        "bring it here. take it there. bring = movement toward the speaker. take = movement away from the speaker. English cares about direction from YOUR perspective. Japanese uses 持ってくる (bring=come) and 持っていく (take=go). same concept, different anchor. English anchors to 'me.' if it's coming to me, it's 'bring.' if it's going away from me, it's 'take.' ego GPS."
    ], context: "bringは「話者の方向に持ってくる」。takeは「話者から離れる方向に持っていく」。Bring me water(水を持ってきて)=こっちに来い。Take this to him(これを彼に持っていけ)=あっちへ行け。日本語は「持ってくる/持っていく」で来る/行くの方向をくっつける。英語はbring/takeで1語に圧縮。でも間違えやすい。パーティーに何か「持っていく」はI'll bring something(相手の場所だから)。視点が大事。", category: 'request' },
    { daySlot: 14, japanese: 'テンション上がる', english: [
        "I'm so pumped up",
        "I'm so pumped up right now I could run through a wall",
        "my energy's up, my mood's up, everything's lookin' up",
        "pumped UP. hyped UP. fired UP. cheered UP. livened UP. in English, positive energy goes UP. always. feel down. look down. let down. that's all bad. cheer up. look up. keep your chin up. that's all good. English has a moral compass built into prepositions: up = good, down = bad. literally. your emotional GPS is vertical."
    ], context: "upは「良い」、downは「悪い」。cheer up(元気出せ)、feel down(落ち込む)、look up to(尊敬する)、look down on(見下す)。英語は感情を垂直に配置する。天国は上、地獄は下。だから幸せはup、悲しいはdown。日本語も「気持ちが上がる/下がる」と同じだけど、英語のほうがup/downの使用頻度が高い。毎日何十回もup/downで気分報告してる。垂直の言語。", category: 'reaction' },
    { daySlot: 14, japanese: 'テンション下がるわ', english: [
        "such a letdown",
        "what a letdown, I was expecting way more than this",
        "that totally brought my mood down, I'm so bummed",
        "let down. brought down. came down. calmed down. settled down. cooled down. broken down. -- 'down' is gravity for emotions. everything heavy falls. sadness falls. energy falls. anger cools and falls. 'down' is what happens when the up runs out. and in English, up always runs out. goes up, must come down. Newton wrote English grammar apparently."
    ], context: "downは「落下」。let down(期待を落とす=がっかり)、break down(壊れ落ちる=故障/泣き崩れる)、calm down(静まり落ちる=落ち着く)、come down(降りてくる=値下げ)。upが「上昇=良い」ならdownは「下降=悪い/終了」。でもcalm downは良い意味。downは「激しさの終了」でもある。激しい怒りが落ちる=落ち着く。downは物理法則。感情にも重力がある。", category: 'reaction' },
    { daySlot: 14, japanese: 'ウォーターっていうかワラーだよね', english: [
        "wader not water",
        "Americans don't say 'water' -- they say 'wader'",
        "better, butter, water, letter -- all the T's turn into D's",
        "water. but Americans say wader. butter becomes budder. letter becomes ledder. better becomes bedder. the T between two vowels flaps into a D. it's not laziness -- it's efficiency. the tongue doesn't fully stop for the T. it just taps. one tap instead of a full stop. the mouth is optimizing. every mouth is an engineer tryin' to build sentences with the least energy possible."
    ], context: "T-flapping(T音の弾き)。waterの真ん中のTがDに聞こえる。母音に挟まれたTは舌が完全に止まらず、軽くタップするだけになる。better→bedder、city→ciddy、party→pardy。アメリカ英語の特徴。イギリス英語はTをちゃんと言う。日本人は「ウォーター」と覚えてるから「ワラー」が聞き取れない。音の変化を知らないと、知ってる単語でも聞こえなくなる。リスニングの壁はここ。", category: 'opinion' },
    { daySlot: 14, japanese: '頭にきた', english: [
        "heated argument",
        "things got really heated and I said stuff I didn't mean",
        "I was boiling inside but I kept my cool -- barely",
        "she was fuming. he was burning up. the argument was heated. things boiled over. he blew up. she exploded. she needed to cool down. -- feelings aren't just emotions in English. they're TEMPERATURES. anger is literally heat. you boil, you steam, you smoke. calm is cold. you cool off, you chill out, you freeze someone out. your body is a thermometer and your mood is the mercury."
    ], context: "英語は感情=温度。angry=hot: boil over(沸騰する)、heated argument(白熱した議論)、hot-headed(頭が熱い=短気)。calm=cold: cool down(冷める=落ち着く)、chill out(冷える=リラックス)。日本語も「頭にきた」(熱い)、「冷静に」(冷たい)と同じ。でも英語のほうが温度語彙が多い。warm welcome(温かい歓迎)、cold shoulder(冷たい肩=無視)。英語は体温計で感情を測る言語。", category: 'reaction' },
    { daySlot: 14, japanese: 'で、どうなったかって言うと', english: [
        "so what happened was",
        "OK so what happened was -- and this is the crazy part --",
        "so basically, long story short, here's what went down",
        "so what happened was -- OK wait lemme back up. so FIRST, she called, THEN he showed up, and THEN -- oh wait I forgot the part where -- OK start over. so what happened was... -- this is how real storytelling works in English. messy. full of restarts. the narrator keeps interrupting themselves. 'so' and 'and then' are the duct tape holding the whole thing together."
    ], context: "英語のストーリーテリングはso what happened wasで始まる。「何が起きたかというと」。and then(そして)、and then(そして)、and THEN(そして!)と連結していく。long story short(長い話を短くすると)で強制着地。日本語は「でさ、それでさ、でさ」。両言語とも接続詞の連打でストーリーを進める。英語のsoは理由、and thenは時間、butは転換。3つのギアで物語を運転する。", category: 'filler' },
    { daySlot: 14, japanese: '俺は俺、お前はお前', english: [
        "you do you",
        "hey man, you do you -- I'm not gonna judge",
        "it's your life, you do you, I'll do me",
        "you do you. I'll do me. -- four words and it's a complete philosophy of individualism. in Japanese, 人は人、自分は自分 (people are people, self is self) is descriptive. English turns it into a command: YOU DO YOU. it's an instruction. go be yourself. actively. as a verb. English doesn't just accept individuality. it demands it. identity is not a state. it's an action."
    ], context: "you do youは「お前はお前らしくやれ」。主語も目的語もyou。自分で自分をやれ、という命令。日本語の「人は人、自分は自分」は状態の説明。英語のyou do youは行動の命令。存在じゃなくて実行。英語は個人主義を動詞で表現する。be yourself(自分でいろ)、express yourself(自分を表現しろ)、love yourself(自分を愛せ)。全部命令形。英語は個性を義務にしてる。", category: 'shutdown' },

    // ── Day 15 ──
    { daySlot: 15, japanese: '勉強すればするほど分からなくなる', english: [
        "the more the more",
        "the more I study, the more confused I get -- ironic right?",
        "the harder I try the worse it gets, there's gotta be a lesson here",
        "the more I learn, the less I know. the faster I run, the further the goal moves. the harder I try, the worse it gets. -- 'the more...the more' is English's seesaw. one side goes up, the other responds. it's the grammar of proportion. cause and effect married into one structure. Japanese does this with 〜ば〜ほど. same seesaw, different playground."
    ], context: "the more...the more構文は比例関係を1文で表す。The more you eat, the fatter you get(食べるほど太る)。theが2回来る。このtheは普通の冠詞じゃない。「その分だけ」の意味の古英語の生き残り。日本語の「〜ば〜ほど」と同じ機能。でも英語のthe more...the moreはリズムが良い。シーソーみたいに上下する。文の構造自体が「比例」を視覚化してる。形が意味を語る。", category: 'opinion' },
    { daySlot: 15, japanese: 'あいつ、マジでヤバい', english: [
        "that guy, man",
        "that guy? absolute legend. like, you can't make this stuff up",
        "that dude, I'm tellin' you, he's on a completely different level",
        "that guy -- you know that guy? -- HE is the reason I have trust issues. -- did you notice? I said 'that guy' and paused. separated it from the rest. that's left dislocation. topic first, comment later. 'that guy' floats outside the sentence like a preview. English textbooks hate this. real English speakers do it every day. grammar rules are suggestions."
    ], context: "left dislocation(左方転位)。That guy, he's crazy.。「あいつ」を文の外に出して、heで拾い直す。文法的にはHe's crazyで十分。でもthat guyを先に出すことで「あいつの話だけどさ」と前置きする。日本語の「あいつさ、マジやばいんだけど」と同じ。トピック→コメント構造。英語の教科書にはないけど、会話では超頻出。カジュアルになるほど日本語の語順に近づく。", category: 'reaction' },
    { daySlot: 15, japanese: 'やるだけやってみよう', english: [
        "go for it",
        "just go for it -- worst case, you learn somethin'",
        "let's go for it, we got nothin' to lose at this point",
        "go for it. go through it. go with it. go about it. go without it. go against it. go around it. go along with it. -- 'go' is the Swiss Army knife of English verbs. change the preposition and the meaning does a backflip. and somehow native speakers just know which one to use. no rules. no chart. pure instinct. the rest of us are guessing."
    ], context: "goの句動詞が多すぎる問題。go for it(やってみろ)、go through(経験する)、go with(〜に合わせる)、go off(爆発する/鳴る)、go about(取りかかる)、go over(確認する)。前置詞を変えるだけで意味が7回変わる。日本語は「行く」に方向を付けるだけ(行ってみる、行き過ぎる)。英語は「行く」が「やる/経験する/爆発する」に化ける。goは動詞じゃなくて変身キット。", category: 'suggestion' },
    { daySlot: 15, japanese: 'ピンときた', english: [
        "it came to me",
        "it just came to me outta nowhere -- didn't even try",
        "I wasn't even thinkin' about it and then it hit me",
        "it came to me. not I went to it. IT came to ME. the idea had legs. it walked to my brain. I was just standing there and knowledge showed up at my door. 'come up with' is similar -- the idea rises up from the subconscious like a bubble. English treats ideas as living things that move independently. you don't find ideas. ideas find you."
    ], context: "come up withは「思いつく」。アイデアが下から浮き上がってくる(come up)イメージ。it came to me(ピンときた)=アイデアが自分に来た。it hit me(ひらめいた)=アイデアに殴られた。全部、アイデアが主語。人間は受け身。英語ではひらめきは「自分が見つける」んじゃなくて「アイデアに見つけられる」。日本語の「思いつく」は自分が主体。英語は知識が主体。知識が人を選ぶ。", category: 'reaction' },
    { daySlot: 15, japanese: 'なしでは生きていけない', english: [
        "can't live without it",
        "can't live without coffee -- that's not a joke, it's a diagnosis",
        "I literally cannot function without my phone, it's pathetic",
        "without. with-out. the opposite of 'with.' you had something, now it's out. gone. absent. 'without you' is 'with' + 'your absence.' the word literally describes the hole where you used to be. 'I can't live without you' = there's a you-shaped hole in my life and nothing else fits. that's not romance. that's geometry."
    ], context: "withoutはwith(一緒に)+out(外に)=「一緒にいたものが外に出た」。without you(あなたなし)は「あなたの不在と一緒にいる」。面白い構造。withは「付属」、withoutは「欠如の付属」。日本語は「〜なし」で1文字。英語は「一緒に(with)」+「ない(out)」の2段階。不在を存在として扱ってる。ないのに、ある。英語の哲学的な構造。", category: 'opinion' },
    { daySlot: 15, japanese: 'どうする？', english: [
        "how about this",
        "how about we just wing it and see what happens?",
        "what about trying a completely different approach?",
        "how about this. what about that. how about vs what about -- they're NOT the same. 'how about sushi?' = suggestion. let's do this. 'what about the budget?' = concern. we forgot this. 'how about' opens doors. 'what about' blocks them. one is a green light, the other is a speed bump. same structure, opposite functions. English is full of these evil twins."
    ], context: "how aboutは提案。How about sushi?(寿司どう?)=行こうよ。what aboutは問題提起。What about the cost?(費用はどうするの?)=忘れてない?。日本語は両方「〜はどう?」で表現できるけど、英語はhow(提案)とwhat(懸念)で分ける。howは方法を聞いてるから前向き。whatは物事を聞いてるから確認。1語の差で推進力が変わる。how=アクセル、what=ブレーキ。", category: 'suggestion' },
    { daySlot: 15, japanese: 'あの音、英語で一番多い音', english: [
        "the schwa sound",
        "that lazy 'uh' sound is literally in every English word",
        "the most common sound in English is the one nobody teaches you",
        "banana. b-uh-NAN-uh. the first and last 'a' aren't really 'a.' they're schwa. the lazy sound. the 'I don't care about this syllable' sound. English stresses one syllable and CRUSHES all the others into this mushy 'uh.' about = uh-BOUT. support = suh-PORT. English is a language of peaks and valleys. schwa is every valley."
    ], context: "シュワー(ə)は英語で最も頻出する母音。banana(bəˈnænə)の最初と最後のaはシュワー。about、support、today、theの全部にシュワーが隠れてる。強いストレスを受けない母音は全部シュワーに潰れる。日本語は全母音をはっきり発音する。英語はサボる。重要な音節だけちゃんと言って、あとはてきとう。このメリハリが英語のリズム。全部ちゃんと発音すると逆に不自然になる。", category: 'opinion' },
    { daySlot: 15, japanese: '頭の中にある', english: [
        "keep that in mind",
        "keep that in mind for next time -- it'll come in handy",
        "I'll keep it in mind, I'll file that away in the brain somewhere",
        "keep it in mind. it's in mind. mind is a room. ideas go IN. they stay in. sometimes they fall OUT of mind. sometimes they're at the back of your mind. sometimes something's on your mind (sitting on top, heavy). your mind is a filing cabinet, a room, a stage -- all at once. English treats the brain as a physical space you can walk around in."
    ], context: "英語はmind=容器。in mind(心の中に)、on my mind(心の上に=気になってる)、out of mind(心の外=忘れた)、at the back of my mind(心の奥=なんとなく覚えてる)。心を部屋として扱ってる。日本語は「心に留める」「頭にある」と体の部位が変わるけど、英語はmind1語に前置詞を変えて位置を報告する。in(中)、on(上)、out of(外)。心はGoogleマップ。", category: 'suggestion' },
    { daySlot: 15, japanese: 'あー、はいはい、なるほどね', english: [
        "uh-huh, right, totally",
        "uh-huh... right... yeah totally... -- am I even listening? maybe",
        "yeah no for sure, that makes sense, uh-huh, go on",
        "uh-huh. right. totally. mmhmm. yeah. sure. I see. OK. -- these aren't words. they're pings. 'I'm still here.' 'I'm still listening.' 'my brain hasn't left.' in English, silence from the listener = you're talking to yourself. you NEED these little sounds or the speaker thinks you died. Japanese lets you listen quietly. English requires a heartbeat monitor."
    ], context: "バックチャネル(相槌)。英語はuh-huh、right、yeah、totally、sure、I seeを会話中に大量に挟む。これがないと「聞いてない」と思われる。日本語の「うん」「へえ」と同じだけど、英語のほうが頻度が高い。しかも種類が重要。uh-huh(聞いてる)、right(理解した)、totally(完全に同意)、mmm(考え中)。相槌の選択で「どの程度聞いてるか」がバレる。反応がない=関係の終わり。", category: 'filler' },
    { daySlot: 15, japanese: '愛してるって毎日言うの？', english: [
        "say I love you daily",
        "English speakers say 'I love you' like it's a daily requirement",
        "in English, if you don't say 'I love you' regularly, there's a problem",
        "I love you. three words. said every morning, every night, every phone call ending, every text sign-off. in Japan, 愛してる is almost too heavy to say. reserved for life-changing moments. in English, 'I love you' is daily maintenance. like oil in an engine. skip it and the relationship makes a weird noise. same emotion, completely different frequency."
    ], context: "英語のI love youは日常語。毎晩言う。電話の最後に言う。日本語の「愛してる」は重すぎてほぼ使わない。「好き」ですら言わない人が多い。英語圏では言わない=愛がない。日本語圏では言わない=言わなくてもわかるでしょ。愛の表現頻度が違う。英語は言語で愛を確認する。日本語は行動で愛を確認する。どっちが深いかじゃなくて、確認方法が違う。Love Languages(愛の言語)は文字通り。", category: 'opinion' },

    // ── Day 16 ──
    { daySlot: 16, japanese: '来るって言ってたのに', english: [
        "said she'd come",
        "she said she'd come but then ghosted -- typical",
        "he told me he was gonna be there and then just didn't show",
        "she said she would come. not 'she said she will come.' would. because when you report someone's words, the future slides back into the past. will becomes would. can becomes could. am becomes was. it's like time travel grammar. you're quoting from a moment that's already gone, so everything shifts one step back."
    ], context: "間接話法(reported speech)。直接: She said 'I will come.' 間接: She said she would come。willがwouldになる。時制の一致。報告する時点が過去だから、引用する内容も過去にずれる。日本語は「来るって言ってた」で時制が変わらない。英語は報告のたびに全動詞を過去にシフトする。面倒。でもこれのおかげで「いつの話?」が文法で明確になる。精密な時間管理。", category: 'reaction' },
    { daySlot: 16, japanese: 'なんて日だ', english: [
        "what a day",
        "what a day, man -- I need like twelve hours of sleep",
        "what a mess, what a disaster, what a beautiful disaster",
        "what a day! what a view! what a waste! -- this 'what a' structure is pure emotion. it's not a question. it's not 'what is this day?' it's 'THIS DAY!' with feeling. 'what' here doesn't ask anything. it amplifies. like turning the volume knob. 'a nice view' = fact. 'what a nice view!' = fact + my heart is exploding. three words that add emotion to any noun."
    ], context: "感嘆文。What a day!(なんて日だ!)のwhatは疑問じゃない。感情アンプ。What a beautiful sunset!のwhatは「この美しさを見てくれ」という叫び。日本語の「なんて〜だ!」と完全に同じ構造。How beautiful!(なんて美しい!)もある。What+名詞、How+形容詞。日本語は「なんて」1語で両方カバー。英語はwhat/howで分ける。でもカジュアルな会話ではwhat a...のほうが圧倒的に多い。", category: 'reaction' },
    { daySlot: 16, japanese: '調べておくよ', english: [
        "look into it",
        "I'll look into it -- give me a day or two",
        "let me look into that and get back to you",
        "look into it. look up to someone. look out for danger. look forward to the weekend. look down on people. look back on memories. look after kids. -- 'look' is just eyes. but add a preposition and suddenly you're investigating (into), respecting (up to), protecting (out for), anticipating (forward to). eyes + direction = brain function. English thinks with its eyes."
    ], context: "lookの句動詞は方向で意味が変わる。look into(調べる=中を覗く)、look up to(尊敬する=見上げる)、look down on(見下す=見下ろす)、look forward to(楽しみにする=前を見る)、look out(気をつける=外を見る)。全部「目の方向」が動作の種類を決めてる。上を見る=尊敬。下を見る=軽蔑。前を見る=期待。目の向きが心の向き。英語は視線で思考を表現する。", category: 'suggestion' },
    { daySlot: 16, japanese: 'なんとかなるって', english: [
        "work it out",
        "we'll work it out somehow -- we always do",
        "it'll work out in the end, it always does",
        "work out. work on. work through. work around. work up. -- 'work' is effort, and the preposition is the direction of that effort. work out = solve (push the answer out). work on = improve (focus effort on it). work through = survive (push through the pain). work around = avoid (effort goes around the obstacle). five prepositions, five completely different jobs. same sweat, different direction."
    ], context: "workの句動詞。work out(うまくいく/解決する)、work on(取り組む)、work through(乗り越える)、work around(回避する)、work up(奮い立たせる)。「働く」に方向を付けるだけで5種類の努力が表現できる。日本語は「解決する」「取り組む」「乗り越える」と全部別の動詞。英語は1つの動詞+前置詞で努力のベクトルを変える。work=汗、前置詞=汗の方向。", category: 'suggestion' },
    { daySlot: 16, japanese: 'まだ届いてないんだけど', english: [
        "hasn't arrived yet",
        "it hasn't arrived yet -- should I be worried?",
        "I ordered it a week ago and it still hasn't come yet",
        "yet. still. already. three tiny words that tell you WHERE you are on the timeline. 'yet' = it hasn't happened but I expect it to. 'still' = it started and hasn't stopped. 'already' = it happened sooner than expected. three different relationships with time. Japanese uses もう and まだ. two words for three concepts. English is more granular. three timers running simultaneously."
    ], context: "yet/still/alreadyは時間の位置を示す。yet(まだ〜ない=期待してるけどまだ)、still(まだ〜してる=続行中)、already(もう〜した=予想より早い)。日本語は「まだ」でyetとstillの両方をカバーする。英語は「期待付きのまだ(yet)」と「継続中のまだ(still)」を分ける。alreadyは「もう」だけど驚きのニュアンスがある。already finished?(もう終わったの?!=早くない?)。3語で時間への態度が透ける。", category: 'reaction' },
    { daySlot: 16, japanese: 'あいつでさえ驚いてた', english: [
        "even HE was surprised",
        "even he was shocked -- and that guy's seen everything",
        "if even SHE's impressed, you know it's legit",
        "even I know that. even SHE was surprised. even THEN it was hard. 'even' is the word of exception. it takes the least likely candidate and says 'yep, this person too.' 'even I' = I'm the last person you'd expect, but yes. it sets up a contrast between expectation and reality. one word that says 'this is surprising because of WHO.'"
    ], context: "evenは「予想外の追加」。Even I know that(俺でさえ知ってる=俺が知ってるくらいだから当然)。evenを入れることで「こいつが? 意外!」を1語で表現する。日本語の「でさえ/さえ」と同じ。でもevenは位置が自由。even I know(俺でさえ)、I even know(知ってさえいる)、I know even that(それさえ)。置く場所で「何が意外か」が変わる。移動する驚きマーカー。", category: 'reaction' },
    { daySlot: 16, japanese: 'そこ強調してなかった？', english: [
        "contrastive stress",
        "I said RED, not BLUE -- did you even listen?",
        "I didn't say I LIKED it, I said I TOLERATED it -- big difference",
        "I DIDN'T steal it. vs I didn't STEAL it. vs I didn't steal IT. -- capital letters in speech. that's what contrastive stress is. English doesn't have bold font in spoken language, so it uses volume. you HIT the word that corrects the misunderstanding. one word louder than the rest. and the listener instantly knows 'oh, THAT'S the part I got wrong.'"
    ], context: "対照ストレス。相手の間違いを正すとき、正しい部分を強く言う。A: You went to Kyoto? B: No, I went to OSAKA. 大阪を強調して「京都じゃなくて大阪」。英語は音圧で修正箇所をマーキングする。日本語は「京都じゃなくて大阪」と言葉で否定してから正す。英語は声の大きさで否定する。太字の代わりに音量。目じゃなくて耳で太字を読む。", category: 'opinion' },
    { daySlot: 16, japanese: '壁を乗り越えた', english: [
        "got through it",
        "it was rough but I got through it -- came out the other side",
        "we pushed through every obstacle and somehow made it work",
        "get through it. get over it. get around it. get past it. -- English treats problems as physical obstacles on a road. you go THROUGH them (straight line, painful). you go OVER them (climb, effort). you go AROUND them (detour, smart). you get PAST them (leave behind). four different strategies, four different prepositions. your approach to life revealed by your choice of preposition."
    ], context: "英語は問題=障害物。get through(突き抜ける=乗り越える)、get over(上を越える=立ち直る)、get around(回り込む=回避する)、get past(通り過ぎる=超える)。全部「問題の向こう側に行く」だけど、ルートが違う。through=正面突破、over=飛び越え、around=迂回、past=通過。日本語は「乗り越える」「解決する」。英語は解決のルートまで前置詞で報告する。", category: 'opinion' },
    { daySlot: 16, japanese: '俺ってほんとダメだわ', english: [
        "I'm such an idiot",
        "I'm such an idiot -- can't believe I did that again",
        "I'm the worst, I literally do this every single time",
        "I'm such an idiot. I'm a disaster. I'm the worst. I'm a walking catastrophe. -- in English, self-deprecation is a FLEX. saying 'I'm so dumb' actually means 'I'm confident enough to laugh at myself.' it's inverted bragging. the person who says 'I'm an idiot' is usually the smartest person in the room. false humility is English's favorite paradox."
    ], context: "英語の自虐は社交術。I'm such an idiot(俺ほんとバカ)と言うことで「自分を笑える余裕がある」をアピールする。日本語の謙遜(いえいえ、まだまだです)は地位を下げる。英語の自虐は笑いを取る。目的が違う。日本語の謙遜=相手を上げる。英語の自虐=場を和ませる。日本語は「関係性」を調整し、英語は「空気」を調整する。どっちも自分を下げてるけど、下げ方の美学が違う。", category: 'reaction' },
    { daySlot: 16, japanese: 'ありがとう連発しすぎ', english: [
        "thanks for everything",
        "thanks for the ride, thanks for dinner, thanks for existing",
        "English speakers say thank you for literally every tiny thing",
        "thank you. thanks. thank you so much. I appreciate it. I can't thank you enough. cheers. ta. -- English has a thank-you for every level. and you MUST use them. hold a door? thanks. pass the salt? thanks. exist near me in a socially acceptable way? thanks. in Japan, silence can mean gratitude. in English, silence means 'that person is rude.' thank-flation is real."
    ], context: "英語はthanksの使用頻度が異常。ドア開けてもらってthanks、塩取ってもらってthanks、レジで会計してthanks。日本語は「どうも」で済むか、何も言わないことすらある。英語でthankを言わない=失礼。日本語でいちいち感謝する=大げさ。感謝のデフォルト設定が違う。英語は「感謝を言う」がデフォルト。日本語は「感謝を感じる」がデフォルト。言語化 vs 内面化。", category: 'opinion' },

    // ── Day 17 ──
    { daySlot: 17, japanese: 'あんたが言ったことは正しい', english: [
        "what you said makes sense",
        "what you said actually makes a lot of sense, I'll give you that",
        "OK I gotta admit, what you said was right on the money",
        "what you said makes sense. 'what you said' -- that whole chunk is the subject. not 'you.' not 'it.' WHAT YOU SAID. a whole sentence acting as one noun. English can take any sentence, slap 'what' on the front, and turn it into a thing. what I need. what she wants. what we forgot. sentences inside sentences. Russian nesting dolls."
    ], context: "名詞節。what you said(あなたが言ったこと)が文の主語になる。文の中に文がある。What I need is time(俺が必要なのは時間)。What he doesn't understand is...(彼がわかってないのは...)。日本語は「あなたが言ったこと」と「こと」を付けて名詞化する。英語はwhatで名詞化する。whatは「〜こと」の英語版。ただしwhatは文頭に来る。日本語の「こと」は文末。接着剤の位置が逆。", category: 'opinion' },
    { daySlot: 17, japanese: '来て、見て、買った', english: [
        "came saw bought",
        "I came, I saw, I bought it -- couldn't help myself",
        "walked in, checked it out, walked out with three bags",
        "I came, I saw, I conquered. three clauses. same length. same structure. same rhythm. that's parallel structure. and it's not just Caesar. English loves threes. life, liberty, and the pursuit of happiness. stop, drop, and roll. friends, Romans, countrymen. the rule of three isn't a suggestion. it's a heartbeat. da-da-DA. the third one always lands hardest."
    ], context: "パラレル構造(並列)。I came, I saw, I conquered。3つの同じ構造を並べる。英語は3の法則が強い。3つ並べるとリズムが生まれて、3つ目が最も強く着地する。日本語も「来た、見た、買った」とできるけど、英語のほうがパラレルへの執着が強い。スピーチ、ジョーク、広告、全部3つで構成される。2つは不完全、4つは多すぎ、3つがジャストライト。3は英語のゴールデンナンバー。", category: 'filler' },
    { daySlot: 17, japanese: 'ちょっと見てみてよ', english: [
        "have a look",
        "hey, have a look at this -- you're not gonna believe it",
        "just have a quick look, it'll only take a sec",
        "have a look. have a seat. have a go. have a think. -- English uses 'have' for experiences. you don't look, you HAVE a look. you don't try, you HAVE a go. it's like the experience is a thing on a shelf and you pick it up and hold it for a moment. 'having a look' is more casual than 'looking.' softer. like borrowing the experience instead of committing to it."
    ], context: "have+a+動作名詞。have a look(ちょっと見る)、have a seat(座る)、have a go(やってみる)、have a think(ちょっと考える)。動詞を名詞化してhaveで持つ。直接look(見る)よりhave a look(見を持つ)のほうがカジュアルで軽い。日本語の「ちょっと見てみる」の「ちょっと」感がhave aに内蔵されてる。haveは体験のレンタル。buyじゃなくてrent。軽く借りて返す感覚。", category: 'suggestion' },
    { daySlot: 17, japanese: '今それ考えてるとこ', english: [
        "thinking about it",
        "I'm thinking about it right now -- hold on, don't rush me",
        "I'm still thinkin' about it, haven't decided yet",
        "I think it's good. vs I'm thinking about it. -- present simple vs present continuous. 'I think' = my opinion exists. done. settled. 'I'm thinking' = my brain is actively processing right now. the -ing means the thinking is IN PROGRESS. not finished. still cooking. English separates 'what I believe' from 'what I'm processing.' belief is simple. processing is continuous."
    ], context: "I think(意見)とI'm thinking(思考中)の差。thinkは状態動詞のはずなのに進行形にできる。ただし意味が変わる。I think it's good=良いと思う(意見の表明)。I'm thinking about it=考え中(プロセスの報告)。同じ動詞が形を変えると「結果」と「過程」に分かれる。日本語は「思ってる」で両方カバー。英語は思考の完了/未完了を時制で分ける。脳の進捗報告を文法でやる言語。", category: 'filler' },
    { daySlot: 17, japanese: 'どっちでもいいよ', english: [
        "either works",
        "either one works for me, you pick",
        "either's fine, I don't have a strong opinion either way",
        "either one. neither one. both of them. -- three answers for a two-choice question. either = this one or that one, both OK. neither = not this, not that, both rejected. both = why choose? take them all. English gives you three exits from a binary question. Japanese just goes どっちでもいい. one exit. clean. efficient. English overengineers choice."
    ], context: "either/neither/both。2択に対する3つの返答。either(どちらでも)、neither(どちらでもない)、both(両方)。日本語は「どっちでも」「どっちも嫌」「両方」。似てるけど英語のほうがパターンが固定されてる。either...or(AかBか)、neither...nor(AもBもない)。ペアで使う。日本語は「〜も〜も」で全部行ける。英語は肯定ペアと否定ペアを分ける。二択への態度を文法で明示する言語。", category: 'filler' },
    { daySlot: 17, japanese: '何言ってるか全然聞こえない', english: [
        "can't hear a thing",
        "the music's so loud I can't hear myself think",
        "she's talkin' but I genuinely cannot make out a single word",
        "English is a stress-timed language. that means stressed syllables come at regular intervals, and unstressed ones get CRUSHED between them. 'I wanna go to the store' = 'I WANNA GO tuh thuh STORE.' five words got compressed into mush. Japanese is syllable-timed -- every mora gets equal time. that's why English sounds like a machine gun and Japanese sounds like a metronome."
    ], context: "英語はストレスタイミング言語。強い音節が等間隔で来て、弱い音節は潰される。I want to go to the store → I WANNA GO tuh thuh STORE。to theは「たざ」に潰れる。日本語はモーラタイミング -- 全音節が等しい長さ。だから英語のリスニングが難しい。弱く言われる部分が聞こえない。日本人が「英語が速い」と感じる原因はスピードじゃなくて圧縮。弱い部分が消えるから情報密度が高く感じる。", category: 'opinion' },
    { daySlot: 17, japanese: '暗い中で手探りだった', english: [
        "in the dark",
        "I was totally in the dark -- nobody told me anything",
        "they kept me in the dark the whole time, I had zero info",
        "I was in the dark. then she shed light on the situation. suddenly I could see the whole picture clearly. it was a bright idea. -- knowledge is LIGHT in English. ignorance is DARK. enlightenment. illumination. bright student. dim understanding. brilliant mind. shady deal. the entire knowledge system runs on a light switch metaphor. flip it on: you know. flip it off: you don't."
    ], context: "英語は知識=光。in the dark(暗い中=知らない)、shed light on(光を当てる=明らかにする)、enlighten(光を入れる=啓蒙する)、bright(明るい=頭いい)、dim(暗い=鈍い)。知らない=暗い、知ってる=明るい。日本語は「明らかにする」と同じ比喩があるけど、英語ほど徹底してない。英語は「知識の電球」比喩を数百年磨いてきた。啓蒙時代(Enlightenment)の名前自体がこの比喩。", category: 'opinion' },
    { daySlot: 17, japanese: 'なんの意味があるの？', english: [
        "what's the point",
        "what's the point of even trying if nobody's gonna listen?",
        "I'm sorry but what is the actual point of any of this",
        "what's the POINT? who CARES? why BOTHER? -- rhetorical questions. you're not asking. you're declaring. 'what's the point?' = 'there is no point.' 'who cares?' = 'nobody cares.' the question format is a disguise for a statement. it's more powerful as a question because it DARES the other person to answer. and they can't. because you're right. the question is the argument."
    ], context: "修辞疑問文。What's the point?(何の意味がある?)は「意味ない」の意味。Who cares?(誰が気にする?)は「誰も気にしない」の意味。質問の形をした断言。答えを求めてない。日本語も「誰が気にするんだよ」と同じことをする。でも英語の修辞疑問は攻撃力が高い。相手に答えさせることで「ほら、答えられないでしょ?」と勝つ。質問=武器。答えられない質問が最強の主張。", category: 'shutdown' },
    { daySlot: 17, japanese: 'ストレートに言ってくれ', english: [
        "just say it",
        "just say it straight -- don't sugarcoat it",
        "stop beating around the bush and just tell me what you think",
        "just tell me. straight up. no sugarcoating. no beating around the bush. -- and here's the cultural paradox: English speakers SAY they want directness, but then they hedge everything with 'I think,' 'maybe,' 'kind of,' 'sort of.' 'just say it' is a demand that English itself can barely fulfill. the language is BUILT for indirectness. the culture ASKS for directness. identity crisis."
    ], context: "英語は「直接言え」文化のはずなのに、文法はhedging(ぼかし)だらけ。I think(たぶん)、kind of(みたいな)、sort of(なんとなく)、maybe(かも)。「直接言って」と要求する人も自分は直接言えない。日本語は最初から間接的だと自覚してる。英語は直接的だと思い込んでるけど実は間接的。自覚があるかないかの差。日本語は正直に曖昧。英語は不正直に直接。どっちが本当に直接?", category: 'request' },
    { daySlot: 17, japanese: '何かあったら言って', english: [
        "if you need anything",
        "if you need anything at all, don't hesitate to ask",
        "is there anything I can do? seriously, anything, just say the word",
        "is there ANYTHING I can do? do you need SOMETHING? -- 'anything' for offers and questions. 'something' when you expect yes. 'do you want something to eat?' = I think you're hungry. 'do you want anything to eat?' = I genuinely don't know. 'some' assumes. 'any' opens the floor. one implies. the other invites. same question, different expectations baked in."
    ], context: "someとanyの差は「期待値」。something(何か=ある前提)とanything(何でも=ない可能性もある)。Would you like something to drink?(何か飲む?=飲むでしょ?)とWould you like anything to drink?(何か飲みたい?=わからないけど)。someは肯定方向にバイアスがかかってる。anyは中立。日本語は「何か」で両方カバー。英語は聞く前から「たぶんyes」と「わからない」を使い分ける。予測が文法に出る。", category: 'suggestion' },

    // ── Day 18 ──
    { daySlot: 18, japanese: 'あの時こうしてたらなあ', english: [
        "wish I had",
        "I wish I had said something -- too late now though",
        "I wish I'd known that earlier, things would've been different",
        "I wish I HAD studied harder. I wish I WERE taller. -- notice the past tense? 'wish' forces the verb backward in time even when you're talking about now. 'I wish I were' not 'I wish I am.' because wishes are about what ISN'T. the grammar literally moves you away from reality. past tense = unreality. that's why fairy tales start with 'once upon a time.'"
    ], context: "wish+過去形で「現在の非現実」を表す。I wish I were taller(背が高ければなあ)。今の話なのにwere(過去)を使う。wishが時制を1段過去にずらす。I wish I had studied(勉強してれば)は過去の非現実で2段ずれる。日本語は「〜だったらなあ」で時制変化なし。英語は「現実じゃない=過去形」という等式がある。過去は遠い。非現実も遠い。だから同じ文法で表現する。距離の文法。", category: 'opinion' },
    { daySlot: 18, japanese: '疲れすぎて動けない', english: [
        "so tired that",
        "I'm so tired that I can't even lift my phone to check the time",
        "I was so exhausted that I fell asleep with my shoes on",
        "I'm SO tired THAT I can't move. so...that. the magic combo. 'so' cranks up the intensity. 'that' shows the consequence. 'I'm tired' = info. 'I'm SO tired THAT I can't move' = drama. the 'that' connects cause and effect in one sentence. you feel the tiredness AND see its result. two stories in one. efficiency meets theater."
    ], context: "so...that構文は「原因→結果」を1文に詰め込む。I was so hungry that I ate two pizzas(腹減りすぎてピザ2枚食べた)。soが程度を上げて、thatが結果を報告する。日本語は「〜すぎて〜」。英語はso + 形容詞 + that + 結果。面白いのはthatを省略しても通じること。I was so hungry I ate two pizzas。thatなしでも因果関係が伝わる。接続詞がなくても脳が自動補完する。英語話者は省エネが好き。", category: 'reaction' },
    { daySlot: 18, japanese: 'あ、わかった！理解した！', english: [
        "I get it now",
        "ohhh I get it now -- took me a minute but I get it",
        "finally get what you were talkin' about -- my brain was lagging",
        "I get it. not 'I understand it.' I GET it. 'get' is the verb of acquisition. you grab knowledge. it arrives at your brain and you catch it. 'understand' is formal and complete. 'get' is casual and instant. 'I get it' = the lightbulb just turned on. 'I understand' = I've studied the manual. 'get' is the street version of 'understand.'"
    ], context: "getは「手に入れる」→「理解する」。I get it(わかった)はunderstandより瞬間的。getは到達の動詞。知識が脳に到達した=理解した。I don't get it(わからない)=知識が届いてない。get along(仲良くする)、get over(乗り越える)、get away(逃げる)、get through(切り抜ける)。getは「状態Aから状態Bに移動する」万能動詞。英語で最も使用頻度が高い動詞の一つ。チートコード。", category: 'reaction' },
    { daySlot: 18, japanese: 'もうどうでもよくなった', english: [
        "threw it all away",
        "I just threw it all away -- the plan, the backup plan, everything",
        "at some point you gotta throw out everything you thought you knew",
        "throw away the plan. throw off your routine. throw in the towel. throw out the old stuff. throw up your hands. -- 'throw' is violence applied to ideas. you don't just discard a plan, you THROW it. physicality. the arm motion. the release. English speakers need to feel the action of letting go. saying 'I discarded it' is sterile. 'I threw it away' has momentum."
    ], context: "throwの句動詞。throw away(捨てる)、throw out(放り出す)、throw in the towel(タオルを投げる=降参する)、throw off(狂わせる)、throw up(吐く/両手を上げる)。全部「投げる」の方向が違う。away=遠くへ、out=外へ、in=中へ、off=離脱、up=上へ。日本語は「捨てる」「諦める」「吐く」と全部別の動詞。英語はthrow+方向で全部カバー。1つの腕の動きで5つの人生行動を表現する。", category: 'reaction' },
    { daySlot: 18, japanese: '情報少ないけどね', english: [
        "few details",
        "there are few details available -- nobody knows much",
        "I've got very little info to go on, but here's what I know",
        "few details. a few details. same words. one tiny 'a' and the meaning flips. 'few' = almost none. negative. sad. 'a few' = some, enough. positive. OK. 'little money' = broke. 'a little money' = not rich but surviving. the letter 'a' is the difference between depression and hope. one letter. one entire emotional shift. English is brutal."
    ], context: "fewとa fewの差が残酷。few friends(友達がほぼいない=否定的)。a few friends(何人かいる=肯定的)。littleとa littleも同じ。little hope(希望がない)、a little hope(少しある)。aが1つ付くかどうかで絶望か希望か変わる。日本語は「少ない」で終わり。英語は「少ないけどある」と「少なすぎてない」を冠詞1文字で分ける。1文字の判決。aの有無が人生の明暗を分ける。怖い言語。", category: 'opinion' },
    { daySlot: 18, japanese: 'まあまあいいんじゃない？', english: [
        "pretty good actually",
        "that's pretty good actually -- better than I expected",
        "it's quite nice, rather impressive, pretty decent overall",
        "pretty good. quite good. rather good. fairly good. -- four different levels of 'good' and English speakers know exactly which is which. 'pretty good' = 70%. 'quite good' = 80%. 'rather good' = 75% with surprise. 'fairly good' = 65% being generous. Japanese goes まあまあ. one word. one level. English has a precision instrument where Japanese has a blunt hammer."
    ], context: "程度副詞の微妙な差。pretty(結構)、quite(かなり)、rather(思ったより)、fairly(まずまず)。全部「良い」の前に付くけど温度が違う。prettyは「予想以上」、quiteは「しっかり」、ratherは「意外にも」、fairlyは「控えめに良い」。日本語は「まあまあ」「結構」「なかなか」。英語のほうが段階が細かい。特にratherは「思ってなかったけど」の驚きが内蔵されてる。副詞1つで期待値がバレる。", category: 'filler' },
    { daySlot: 18, japanese: 'なんとかなるよ、時間稼ごう', english: [
        "that's a great question",
        "that's a great question -- let me think about how to answer that",
        "hmm, interesting point, I'm glad you brought that up",
        "that's a great question. -- translation: I have no idea. this is a stalling technique. politicians do it. teachers do it. your boss does it. 'great question' buys you three seconds to think. 'let me think about that' buys ten. 'I'm glad you asked' buys five and earns goodwill. English has an entire toolkit for looking smart while your brain is buffering."
    ], context: "時間稼ぎフレーズ。That's a great question(良い質問ですね)=答えを考え中。Let me think about that(ちょっと考えさせて)=まだ考えてない。I'm glad you brought that up(良い点ですね)=全然準備してなかった。英語はバッファリング中でも賢く見えるツールがある。日本語は「えーっと」「うーん」と正直に迷う。英語は迷ってる間も演技する。考えてないことを「良い質問」で隠す。ポーカーの文化。", category: 'filler' },
    { daySlot: 18, japanese: '年齢聞くの？マジ？', english: [
        "that's personal",
        "whoa, that's kinda personal -- you don't just ask someone's age",
        "in English, asking someone's age is lowkey considered rude",
        "how old are you? how much do you make? are you married? -- three questions that are totally normal in Japanese and potentially career-ending in English. English has invisible walls around personal data. age, salary, relationship status, weight, political views -- all locked behind social firewalls. in Japan, these walls are lower. not nonexistent, but lower. English privacy is a fortress. Japanese privacy is a fence."
    ], context: "英語圏では年齢・給料・体重・結婚の有無は聞かない。プライバシーの壁が日本より高い。How old are you?(何歳?)は初対面では失礼。How much do you make?(いくら稼いでる?)は親友でも微妙。日本語では「おいくつですか?」は普通の会話。文化のデフォルト設定が違う。英語圏は「個人情報は自分の資産」。共有は自分の選択。聞かれたら侵入。日本語圏は「情報共有が親密さ」。聞かないほうが距離がある。", category: 'opinion' },
    { daySlot: 18, japanese: 'あのー、もしよければ', english: [
        "if you don't mind",
        "if you don't mind me askin' -- and feel free to say no --",
        "I was wonderin', if it's not too much trouble, maybe you could...",
        "I was wondering if you could possibly maybe perhaps help me. -- count the hedges. 'was wondering' (past tense = distance). 'if' (conditional = escape route). 'could' (modal = softener). 'possibly' (adverb = doubt). 'maybe' (another doubt). 'perhaps' (yet another). six layers of padding around one simple request: help me. English politeness = wrapping a sword in cotton candy."
    ], context: "英語の丁寧さは文を長くすることで作る。Help me.(2語、直球)→Could you help me?(4語、控えめ)→I was wondering if you could possibly help me.(10語、超丁寧)。長いほど丁寧。日本語は「手伝って」→「手伝ってもらえますか」→「お手伝いいただけますでしょうか」。日本語は動詞を変形。英語は語数を増やす。丁寧さのコストが違う。日本語は変形コスト、英語は文字数コスト。距離=礼儀。", category: 'request' },
    { daySlot: 18, japanese: 'ここだけの話', english: [
        "between you and me",
        "between you and me? I think this whole thing's gonna fall apart",
        "just between us, I heard some stuff and it's not good",
        "between you and me. not among. BETWEEN. because there's exactly two of us in this secret. 'between' is for two. 'among' is for three or more. if I say 'between us' to three people, a grammar cop somewhere cries. but honestly? nobody follows this rule anymore. 'between us' now means 'don't tell anyone' regardless of the headcount. usage killed the rule."
    ], context: "betweenは「2者の間」。between you and me(ここだけの話)。本来betweenは2人、amongは3人以上のルール。among friends(友人の間で)、among the crowd(群衆の中で)。でも現代英語ではbetween usを3人以上でも使う。ルールは死にかけてる。日本語の「〜の間」は人数制限なし。英語は2人と3人以上で前置詞を変える(はずだった)。言語の規則は使用頻度に負ける。", category: 'filler' },

    // ── Day 19 ──
    { daySlot: 19, japanese: 'さっき言ってたやつ', english: [
        "the thing I mentioned",
        "remember the thing I was talkin' about earlier?",
        "you know that thing I brought up? well, turns out I was right",
        "the thing I was talking about. not 'the thing about which I was talking.' that's Shakespeare English. real English puts the preposition at the end and moves on. 'the person I work with' not 'the person with whom I work.' ending a sentence with a preposition is one of those rules that everyone breaks and nobody cares. except your English teacher. she still cares."
    ], context: "関係節の前置詞は後ろに置く。the thing I was talking about(さっき話してたやつ)。文法的には'about which I was talking'が正しいけど、誰もそう言わない。前置詞を文末に置くのは「間違い」と教わるけど、ネイティブ全員やってる。Churchill: 'This is the sort of English up with which I will not put.' -- 正しい文法にしたら意味不明になる皮肉。実用が文法に勝つ。", category: 'filler' },
    { daySlot: 19, japanese: '良さそうに見えるね', english: [
        "looks good on you",
        "that looks really good on you -- suits your vibe perfectly",
        "it sounds like a solid plan, and it feels right too",
        "it looks good. it sounds good. it feels right. it smells amazing. it tastes incredible. -- English uses sense verbs as judgment tools. 'looks good' isn't about eyesight. it's about approval. 'sounds right' isn't about hearing. it's about agreement. your five senses became five ways to say 'I approve.' English doesn't just think with its eyes. it thinks with all five senses."
    ], context: "知覚動詞が判断動詞になる。looks good(良さそう=目の判断)、sounds good(良さそう=耳の判断)、feels right(正しそう=触覚の判断)。全部「五感+形容詞」で意見を言う。日本語は「良さそう」で感覚を指定しない。英語はどの感覚で判断したか毎回報告する。That sounds interesting(面白そうに聞こえる)=あなたの話を聞いた上で判断した。感覚器官を通して意見を言う。五感が陪審員。", category: 'reaction' },
    { daySlot: 19, japanese: 'あいつのことマジ無理', english: [
        "can't stand him",
        "I can't stand that guy -- everything about him bugs me",
        "I literally cannot stand bein' in the same room as her",
        "I can't stand it. physically: I cannot remain standing in its presence. the thing is so bad that my legs give out. I collapse. that's how strong 'can't stand' is. it's not 'I dislike.' it's 'my body literally cannot maintain an upright position near this thing.' English turns hatred into a physical disability. your disgust has gravitational pull."
    ], context: "can't standは「立っていられない」=「耐えられない」。嫌いすぎて物理的に立てない。I can't stand the heat(暑さに耐えられない)、I can't stand him(あいつ無理)。standは「立つ」=「耐える」。日本語の「無理」は理由不明。英語のcan't standは「体が拒否してる」。stand out(目立つ)、stand for(表す)、stand up for(味方する)。standは「立場を取る」動詞。立つ=存在する=耐える=主張する。直立の哲学。", category: 'shutdown' },
    { daySlot: 19, japanese: 'バラバラになった', english: [
        "fell apart",
        "the whole plan just fell apart at the last minute",
        "everything was fine and then it all fell apart overnight",
        "fell apart. FELL. like gravity did it. nobody pushed. nobody broke it. it just... fell. apart. into pieces. 'fell apart' removes human agency entirely. the thing self-destructed. relationships fall apart. plans fall apart. people fall apart. 'fall' = nobody's fault. gravity is to blame. English uses physics to explain emotional collapse."
    ], context: "fall apartは「重力でバラバラになる」。誰かが壊したんじゃない。自然に崩れた。The plan fell apart(計画が崩壊した)。fallは「落ちる」=誰のせいでもない。日本語の「バラバラになった」も自動詞だけど、英語のfallは重力が原因というニュアンスがある。fall behind(遅れる)、fall for(惚れる/騙される)、fall through(失敗する)。全部「制御できずに落ちた」。fallは人間の無力さを表現する動詞。重力には勝てない。", category: 'reaction' },
    { daySlot: 19, japanese: '全部経験した', english: [
        "been through it all",
        "trust me, I've been through it all -- the good, the bad, everything",
        "I went through hell and back and somehow I'm still standin'",
        "I went through it. THROUGH. not around, not over, not under. straight through the middle. 'through' means the experience was a tunnel and I walked the entire length. I entered from one side and came out the other, changed. 'go through' = the hard way. no shortcuts. the full experience. the suffering buffet. all you can eat."
    ], context: "throughは「貫通」。go through(経験する=通り抜ける)。経験がトンネルで、その中を歩いて反対側に出た。through a crisis(危機を通り抜ける)、through a breakup(別れを通り抜ける)。acrossは「表面を横切る」、throughは「内部を貫通する」。throughのほうが辛い。中を通るから。日本語の「乗り越える」は上を越える。英語のgo throughは中を通る。日本語は上ルート、英語は中ルート。", category: 'opinion' },
    { daySlot: 19, japanese: '超えてるよそれ', english: [
        "over the line",
        "nah that's over the line -- you went too far this time",
        "you crossed the line, got over it, and kept runnin'",
        "get over it. game over. over the hill. over the moon. over the line. -- 'over' is the word of exceeding. going past the limit. 'over the line' = you passed the boundary. 'over the moon' = happiness exceeded the ceiling. 'get over it' = climb past the obstacle. 'over' always implies there was a barrier and you're now on the other side. for better or worse."
    ], context: "overは「上を越えて向こう側」。over the line(線を越えた=やりすぎ)、over the moon(月を越えた=超嬉しい)、get over it(乗り越えろ)、over and over(何度も何度も=超えて繰り返す)。全部「基準を超えた」。日本語は「超える」「越す」と漢字で使い分ける。英語はover1語。でもoverは超えた先が良い場合(over the moon)も悪い場合(over the line)もある。超える行為自体は中立。超えた先が問題。", category: 'shutdown' },
    { daySlot: 19, japanese: 'ちょっと発音違うかも', english: [
        "think vs the",
        "the TH in 'think' and the TH in 'the' -- completely different sounds",
        "English has two TH sounds and Japanese speakers usually can't do either",
        "think. the. two different sounds, both written TH. 'think' = your tongue touches your teeth and air hisses through. voiceless. 'the' = same position but your vocal cords vibrate. voiced. Japanese has neither sound. so Japanese speakers often use 's' for 'think' and 'z' for 'the.' close but not quite. it's like using a spoon when the recipe calls for chopsticks."
    ], context: "THは2種類ある。think(無声: θ)とthe(有声: ð)。舌を歯に当てるのは同じだけど、声帯が震えるかどうかが違う。thinkのTHは息だけ。theのTHは声+息。日本人はthink→sinkにしがち(sで代用)。日本語にTH音が存在しないから体が知らない。発音は筋トレ。知識じゃなくて筋肉の問題。口の中に「TH筋」を作る必要がある。舌の新しい仕事場を覚えさせる作業。", category: 'opinion' },
    { daySlot: 19, japanese: 'トップに立ってる', english: [
        "on top of things",
        "she's always on top of everything -- never drops the ball",
        "I'm trying to stay on top of it all but it's a lot",
        "on top. at the top. over the top. to the top. top of the world. top of my game. -- success in English is VERTICAL. you climb to the top. you rise. you're on top. failure? you sink. you hit rock bottom. you're at the lowest point. English stacks everything vertically. social status, quality, mood -- all measured on a Y-axis. life is a graph and you want to be the peak."
    ], context: "成功=高さ。on top(頂点にいる)、climb the ladder(はしごを登る)、peak performance(ピーク性能)、reach the top(頂点に達する)。失敗=低さ。rock bottom(どん底)、hit a low(最低を打つ)、sink(沈む)。英語は人生をY軸で測る。上が良くて下が悪い。日本語も「頂点」「底辺」と同じだけど、英語のほうが垂直メタファーが日常会話に浸透してる。毎日何回も上がったり下がったり。", category: 'opinion' },
    { daySlot: 19, japanese: 'あ、ちが、そうじゃなくて', english: [
        "wait no I mean",
        "wait no, that came out wrong -- what I meant was",
        "hold on, I didn't mean it like that, let me rephrase",
        "that came out wrong. what I MEANT was. let me rephrase. -- English has a built-in repair system. when your mouth says the wrong thing, these phrases are the undo button. 'what I meant was' separates intention from execution. 'my mouth said X but my brain meant Y.' it acknowledges the error without losing face. Japanese goes 「いや、違くて」 -- same function, less elaborate."
    ], context: "会話修復。what I meant was(言いたかったのは)、that came out wrong(変な言い方になった)、let me rephrase(言い直させて)。英語は「口と脳が別物」として扱う。口が先走って脳が後から修正する。日本語は「違くて」「そうじゃなくて」と否定から入る。英語は「what I MEANT was」と意図を再提示する。否定(それは違う)じゃなくて再定義(本当はこう)。修正のアプローチが違う。削除 vs 上書き。", category: 'filler' },
    { daySlot: 19, japanese: 'なんとかなるさ', english: [
        "it'll work out",
        "don't worry, it'll work out -- it always does somehow",
        "I'm sure things'll figure themselves out eventually",
        "it'll work out. I'll figure it out. we'll cross that bridge when we get to it. -- English optimism lives in the future tense. 'will' is the verb of hope. I WILL figure it out = I have no idea how but I'm committing to a future where I do. Japanese goes なんとかなる -- 'somehow it'll become something.' vaguer. less personal. English puts 'I' in the driver's seat. Japanese lets fate drive."
    ], context: "英語の楽観主義はI'll figure it out(俺がなんとかする)。主語がI。自分がやる。日本語は「なんとかなる」。主語がない。状況が勝手になんとかなる。英語は個人が未来を作る。日本語は未来が自然に来る。I'll make it happen(俺が実現する)vs「うまくいくでしょ」。能動 vs 受動。アメリカ文化の'self-made'精神がI'llに凝縮されてる。未来は作るもの vs 来るもの。言語が人生観を作る。", category: 'suggestion' },

    // ── Day 20 ──
    { daySlot: 20, japanese: '俺が欲しいのは時間だけ', english: [
        "all I want is time",
        "all I want is a little more time -- is that too much to ask?",
        "what I need right now is just some space to breathe",
        "all I want is time. ALL I want. not 'the only thing I want' -- ALL. it sounds bigger. grander. 'all I want' = I've reduced my entire universe of desires to this one thing. 'what I need is' does the same job. these structures put the spotlight on the answer by making the question part of the sentence. the buildup IS the sentence. the answer is the climax."
    ], context: "cleft構文の変形。all I want is...(俺が欲しいのは...だけ)。what I need is...(俺が必要なのは...)。主語が「俺が欲しいもの全部」で述語が「これ」。巨大な期待を1つに絞り込む構造。日本語の「欲しいのは〜だけ」と同じだけど、英語のallが強い。allは「全体」を意味するのに「1つだけ」を指す。矛盾してるけど、だからこそ「本当にこれだけ」感が強まる。逆説の強調。", category: 'opinion' },
    { daySlot: 20, japanese: 'それでも信じてる', english: [
        "even though I know",
        "even though I know it's probably not gonna work, I still believe",
        "despite everything that's happened, I haven't given up yet",
        "even though. despite. although. in spite of. regardless. -- five different ways to say 'but this is true anyway.' English has an arsenal of concession words because English speakers love arguing with reality. 'it's raining, but I'm still going.' the first half is reality. the second half is defiance. concessive clauses are where stubbornness becomes grammar."
    ], context: "譲歩構文。even though(〜にもかかわらず)、despite(〜にもかかわらず)、although(〜だけど)。全部「事実A、でもB」。日本語は「〜けど」で済む。英語はeven though(感情強い)、although(中立)、despite(フォーマル)とレベルが違う。even thoughが一番「まじでこれなのに!」感がある。evenが「驚き」を足してるから。thoughだけだとalthoughと同じ。even1語が感情のブースター。", category: 'opinion' },
    { daySlot: 20, japanese: '不意打ちだった', english: [
        "caught off guard",
        "that totally caught me off guard -- wasn't expecting that at all",
        "I was caught off guard, didn't know what to say",
        "caught off guard. catch up. catch on. catch someone's eye. -- 'catch' is the verb of surprise contact. something moving fast meets you. catch a cold (the cold caught you). catch a glimpse (the image briefly caught your eye). catch someone's attention (their attention was running and you grabbed it). catching isn't intentional. it's reactive. the thing comes to you. you just react."
    ], context: "catchは「飛んでくるものを受け止める」。catch off guard(不意打ちを食らう)、catch up(追いつく)、catch on(理解する/流行る)、catch someone's eye(目に留まる)。全部「動いてるものとの接触」。catch a cold(風邪を引く)は風邪がお前を捕まえた。catch someone red-handed(現行犯で捕まえる)。日本語は「捕まえる」と「引く」が別。英語はcatch1語で全部。飛来物を受ける動作が人生の半分を説明する。", category: 'reaction' },
    { daySlot: 20, japanese: '連絡して', english: [
        "hit me up",
        "hit me up whenever you're free -- my schedule's wide open",
        "just hit me up, shoot me a text, drop me a line",
        "hit me up. shoot me a text. drop me a line. fire off an email. -- every communication verb in casual English is violent. hit. shoot. drop. fire. you don't gently send a message. you LAUNCH it. communication in English is a projectile sport. messages are bullets. emails are missiles. texts are grenades. we're not talking, we're conducting information warfare."
    ], context: "英語のカジュアルな「連絡して」は暴力的。hit me up(俺を打て=連絡して)、shoot me a text(テキストを撃て=送って)、drop me a line(1行落として=一報ちょうだい)。なぜ連絡が暴力? メッセージが「飛来物」だから。手紙もメールもテキストも「飛んでくるもの」として扱う。日本語の「連絡して」は中立。英語の「連絡して」は投擲。言語が違うと「連絡」の物理イメージが違う。", category: 'request' },
    { daySlot: 20, japanese: 'ついでに', english: [
        "by the way / by car",
        "I'll go by car -- oh and by the way, can you come too?",
        "by the way, by then, by far -- 'by' is doin' a lot of heavy lifting",
        "by the way. by car. by Monday. by accident. by far. by myself. -- 'by' has at least six unrelated meanings. method (by car). deadline (by Monday). proximity (stand by). agency (made by). accident (by chance). comparison (by far). one word, six jobs. it's the most overworked preposition in English. no wonder nobody can explain it. it does everything and explains nothing."
    ], context: "byは最も多義の前置詞。by car(手段)、by Monday(期限)、by the door(近く)、by Shakespeare(作者)、by accident(偶然)、by far(断然)。6つの意味が1語に詰まってる。日本語だと「で/まで/の近く/による/偶然/断然」と全部別の助詞。英語はby1語で全部。なぜ? 元の意味は「そばに」。車のそば→車で。月曜のそば→月曜まで。全部「近接」から派生してる。1つの空間感覚が6方向に伸びた結果。", category: 'filler' },
    { daySlot: 20, japanese: '不利だったのに', english: [
        "against all odds",
        "she made it against all odds -- nobody thought she could",
        "they were up against it from day one but they pulled through",
        "against all odds. against the wall. against the grain. against my better judgment. -- 'against' is the preposition of resistance. you're pushing against something that pushes back. odds push, you push back. walls push, you push back. English treats difficulty as physical friction. two forces, one direction. and you're always the underdog. 'against' makes you the hero automatically."
    ], context: "againstは「抵抗」。against all odds(全ての確率に逆らって)、against the wall(壁に追い詰められて)、against the grain(流れに逆らって)。全部「力と力がぶつかる」。lean against the wall(壁にもたれる)だけは穏やか。日本語は「〜に逆らって」「〜に対して」。英語のagainstは物理的な圧力を感じる。2つの力がぶつかるイメージ。againstがある文は常に戦ってる。摩擦の前置詞。", category: 'opinion' },
    { daySlot: 20, japanese: 'そんな言い方ないでしょ', english: [
        "that's not cool",
        "oh GREAT, what a SURPRISE -- yeah no, that's sarcasm",
        "wow, amazing, incredible, SO happy for you -- can you hear me not meaning any of it?",
        "oh GREAT. oh WONDERFUL. oh how NICE. -- sarcasm in English is intonation homicide. the words say positive, the tone says negative. and somehow everyone hears the tone, not the words. the meaning isn't in the dictionary. it's in the music. same notes, different key. major key = sincere. minor key = sarcasm. English has two channels: words and music. they don't always agree."
    ], context: "英語の皮肉はイントネーションで作る。'Oh great'を普通に言えば嬉しい。大げさに言えば皮肉。同じ単語でもトーンが逆転する。日本語の皮肉は「はいはい、すごいすごい」と繰り返しで作ることが多い。英語は音の高さと長さで作る。GREAAAAT(伸ばす=皮肉)。文字では区別できない。音声専用のユーモア。だからテキストでは/sを付ける。口の皮肉を文字に翻訳するための記号が必要になった。", category: 'shutdown' },
    { daySlot: 20, japanese: '言いにくいんだけど', english: [
        "hate to say this",
        "I hate to say this but I think we need to talk",
        "look, I hate to break it to you, but the news isn't good",
        "I hate to say this, but... -- six words of emotional cushioning before the blow. 'I hate to' = I'm about to cause you pain and I want you to know it hurts ME too. it's empathy pre-loaded into the sentence. the messenger apologizes for the message before delivering it. English has a ritual for bad news: announce that you hate delivering it, then deliver it anyway."
    ], context: "I hate to say this but...(言いにくいんだけど...)は悪いニュースの前に置くクッション。I hate to break it to you(壊す=ショックを与える)、I'm sorry to say(残念ながら)。全部「今から痛いこと言うよ、ごめんね」の前置き。日本語は「言いにくいんだけど」。英語はI hate to(嫌なんだけど)と感情をモロに出す。日本語は「言いにくい」(行為の困難さ)。英語は「嫌い」(感情)。クッションの素材が違う。", category: 'suggestion' },
    { daySlot: 20, japanese: 'アピールしろって言われても', english: [
        "sell yourself",
        "in English, you gotta sell yourself -- modesty won't get you hired",
        "they want you to brag? fine, I'll brag, but it feels so wrong",
        "sell yourself. promote yourself. brand yourself. -- English treats job hunting like marketing. YOU are the product. your resume is the brochure. the interview is the sales pitch. in Japan, 履歴書 (resume) is a humble document. in America, a resume is an advertisement. same paper, different philosophy. Japanese resumes whisper. American resumes shout. the volume is the culture."
    ], context: "英語圏の就活は自己宣伝。sell yourself(自分を売れ)、personal brand(個人ブランド)、elevator pitch(短い自己PR)。日本の履歴書は控えめに事実を並べる。アメリカのresumeは成果を派手に書く。'I spearheaded a cross-functional initiative'(部門横断プロジェクトを先導した)は日本語だと大げさすぎる。英語は実績を膨張させるのがルール。膨張しないと「やる気がない」と判断される。謙遜=死。", category: 'opinion' },
    { daySlot: 20, japanese: '伝わった？', english: [
        "did that make sense",
        "does that make sense? or am I just ramblin' again?",
        "I hope that came across right -- I'm bad at explainin' stuff",
        "did that make sense? did I get my point across? did my message come through? -- all three phrases treat communication as physical movement. 'across' = my idea crossed the gap between us. 'through' = my idea penetrated your mental wall. English sees communication as SENDING. ideas are packages. words are delivery trucks. understanding = successful delivery. lost in translation = package lost in transit."
    ], context: "英語はコミュニケーション=送信。get my point across(ポイントを向こう側に届ける)、the message came through(メッセージが通り抜けた)、send a signal(信号を送る)、receive feedback(フィードバックを受信する)。全部、物理的な移動。日本語は「伝わる/伝える」で送受信は表現するけど、英語ほど物理的じゃない。英語は意思疎通を郵便局のように扱う。送信者、受信者、配達、未着。コミュニケーションは物流。", category: 'filler' },

    // ── Day 21 ──
    { daySlot: 21, japanese: 'まるでプロみたい', english: [
        "as if",
        "as if I'd actually know what I'm doin'",
        "I walked in as if I owned the place",
        "I walked in as if I owned the place, ordered as if I'd been there a hundred times, and the waiter looked at me as if I was insane. three 'as ifs' and I built a whole fake reality in one sentence."
    ], literal: 'just like a pro', context: "as ifは「嘘の世界を一瞬で建てる」道具。I walked in as if I owned the place -- 実際はオーナーじゃない。でもas ifの後ろに仮定法を置くだけで、聞き手の頭に偽の映像が流れる。日本語の「まるで」は比喩。英語のas ifは仮想現実の起動スイッチ。1秒で別世界に連れていける。映画監督の文法。", category: 'opinion' },
    { daySlot: 21, japanese: '考えてみれば当然だよね', english: [
        "thinking about it",
        "thinking about it, yeah, that tracks",
        "thinking about it now, that actually makes total sense",
        "thinking about it -- and I shoulda thought about it sooner honestly -- the signs were all there. every single one. I just wasn't payin' attention 'cause I was too busy bein' surprised by somethin' that was completely predictable."
    ], context: "thinking about itは主語がない。誰が考えてるか言わなくていい。日本語は「考えてみれば」で同じことやってる。でも英語の教科書は「分詞構文」とか怖い名前つけて難しくする。実態はただの省エネ。I was thinking about itの前半を捨てただけ。英語話者は毎日これやってる。文法用語を知らずに。", category: 'filler' },
    { daySlot: 21, japanese: '休憩ほしい', english: [
        "could use a break",
        "I could really use a break right about now",
        "I could use a coffee and like three hours of silence",
        "I could use a nap, a raise, a vacation, and someone to tell me I'm doin' OK. in that order. actually no, the 'you're doin' OK' first. then the nap. priorities."
    ], context: "could useは「ほしい」のくせに超控えめ。I want a break(欲しい!)は直球。I could use a break(あったら使えるんだけどなあ)は横から忍び寄る。wantが正面突破なら、could useは裏口入学。英語の丁寧さは「欲しがってない振り」で作る。日本語の「〜できたらなあ」と同じ仮定法の匂い。本音を仮定の服で包む技術。", category: 'request' },
    { daySlot: 21, japanese: '最近ハマってるやつ', english: [
        "really into it",
        "I've been super into this thing lately",
        "I'm really into this -- can't stop thinkin' about it",
        "I've been really into pottery lately. don't ask me why. I can't explain it. two weeks ago I didn't know clay existed and now I own three books about glazing techniques. this is what 'into' does to a person. you fall in and forget what the surface looks like."
    ], context: "intoは物理的に「中に入る」。I'm into cooking = 料理の中にいる。ハマるって日本語も「穴にハマる」だから同じ発想。でも英語のintoは深さが調整できる。a little into(浅い穴)、really into(深い穴)、way too into(もう出れない穴)。前置詞1個で沼の深さを報告できる。便利すぎる。", category: 'reaction' },
    { daySlot: 21, japanese: 'どうでもいいわ', english: [
        "whatever",
        "whatever, I honestly could not care less",
        "whatever, it doesn't matter, I'm over it",
        "whatever. and I mean that in the most peaceful way possible. I used to fight about stuff like this. now? whatever. it's not defeat, it's strategy. you can't lose a game you stopped playin'. whatever is the exit door. I walked through it. bye."
    ], context: "whateverは疑問詞のくせに答えを求めてない。what(何?) + ever(どれでも) = 「何だろうと知らん」。選択肢を全部まとめて捨てる1語。日本語の「どうでもいい」は4語かかる。英語は1語で全放棄。しかもeverを付けた瞬間に「可能性の全範囲」をカバーする。whatever, wherever, whenever -- 全部「範囲の全焼」。英語のeverは火炎放射器。", category: 'shutdown' },
    { daySlot: 21, japanese: 'マジで死ぬかと思った', english: [
        "literally dying",
        "I was literally dyin' -- like, not literally, but literally",
        "I literally almost died laughin', I couldn't breathe",
        "I literally could not breathe. and yes I know 'literally' doesn't mean literally anymore. it means 'I need you to feel how much I felt this.' it's an emotion amplifier now. the word committed suicide and came back as a ghost of itself. RIP literal literally."
    ], context: "literallyは元々「文字通り」。I'm literally dying = 文字通り死んでる。でも今は誰も文字通りに使ってない。I'm literally starving(腹減った程度)、literally the best(まあまあ良い程度)。意味が正反対に進化した珍しい単語。言語学者は怒ってるけど、全員使ってる。言葉は民主主義。多数決で意味が変わる。", category: 'reaction' },
    { daySlot: 21, japanese: 'えーっと、なんだっけ', english: [
        "um, what was it",
        "so, uh -- wait, what was I gonna say?",
        "I had it, I swear I had it, and now it's gone",
        "it was right there. right on the tip of my tongue. and then my mouth opened and it just -- poof. gone. like a browser tab I accidentally closed. it existed two seconds ago and now I have no proof it was ever real. my brain is a search engine with terrible RAM."
    ], context: "英語のフィラー位置で意味が変わる。um...I think(考え中、まだ文が始まってない)とI think, um...(文の途中で迷子)。最初に来るumは「今からエンジンかける」の合図。途中のumは「エンストした」の合図。日本語の「えーっと」は位置が自由だけど、英語は置く場所で脳の状態が透けて見える。", category: 'filler' },
    { daySlot: 21, japanese: 'ゼロから作った', english: [
        "from scratch",
        "built this whole thing from scratch, no template",
        "started from scratch -- no base, no framework, nothin'",
        "I built it from scratch. which sounds impressive until you realize 'from scratch' literally means 'from the line you scratch in the dirt before a race.' the starting line. that's all. you didn't do anything magical, you just started where everyone starts. but somehow 'from scratch' sounds like you're a genius. branding is everything."
    ], literal: 'from scratch = the scratched line', context: "build from scratch、start from scratch、cook from scratch。英語は「作る」系の動詞に全部scratchを付けられる。scratchは地面に引っかいた線=スタートライン。つまりfrom scratch=ゼロ地点から。日本語の「ゼロから」は数字の比喩。英語は体を使った比喩。地面を引っかく動作が語源に残ってる。英語は体の記憶で喋る言語。", category: 'opinion' },
    { daySlot: 21, japanese: 'きついなそれ', english: [
        "that's rough",
        "oh man, that's rough -- I feel for you",
        "that's really rough, dude, I'm sorry you're dealin' with that",
        "that's rough. and I'm not gonna hit you with some 'everything happens for a reason' garbage. sometimes stuff just sucks. the best thing I can do is sit here and go 'yeah, that sucks.' no advice. no silver lining. just acknowledgment. that's what 'rough' does -- it says 'I felt the texture of your pain and it's not smooth.'"
    ], context: "roughは触感。ざらざらしてる=つらい。英語は感情を触覚で表現する。rough day(ざらざらの日)、smooth sailing(つるつるの航海)、hard time(硬い時間)。全部、指で触れる比喩。日本語の「きつい」はきつく締まる感覚。どっちも体で感じてる。でも英語の共感表現はI hear you(聞こえてるよ)、I feel you(感じてるよ)と五感で受け止める。同情じゃなくて共鳴。", category: 'reaction' },
    { daySlot: 21, japanese: '日本人は控えめが美徳でしょ', english: [
        "understatement game",
        "our understatement game is on a whole different level",
        "Japanese understatement versus American overstatement -- two planets",
        "in Japan you eat the best ramen of your life and go 'maa maa.' in America you eat a decent burger and go 'OH MY GOD THIS IS THE BEST THING I'VE EVER HAD.' same satisfaction, completely different volume. neither is lying. it's just that one culture whispers ten and the other screams seven."
    ], literal: 'modesty is a virtue for Japanese', context: "日本語の「まあまあ」は80点でも使う。英語のamazingは60点でも使う。同じ感動を日本語は圧縮して、英語は膨張させる。日本人が英語でまあまあ=it was OK、って言うとネイティブには「微妙だった」に聞こえる。本当は「けっこう良かった」なのに。逆にアメリカ人のamazingを真に受けると毎回感動することになる。翻訳じゃなくて音量調整が必要。", category: 'opinion' },

    // ── Day 22 ──
    { daySlot: 22, japanese: 'クビになった', english: [
        "got fired",
        "I got fired -- yeah, they just straight up let me go",
        "I got fired outta nowhere, didn't even see it comin'",
        "I got fired. not 'I was fired' -- I GOT fired. feel the difference? 'was fired' is a news report. 'got fired' is a gut punch. it happened TO me. I felt it. the 'get' is the impact. I got hit, I got dumped, I got scammed. every 'got' has a bruise on it."
    ], context: "I was fired(事実の報告)とI got fired(食らった感)は同じ事実なのに温度が全然違う。wasは記者。gotは当事者。日本語だと「クビになった」の1パターンしかないけど、英語はwas/gotの選択で「これ、俺の話なんだよ」って距離感を調整できる。gotを選んだ瞬間にその人の感情が漏れる。文法で泣いてる。", category: 'reaction' },
    { daySlot: 22, japanese: '髪切ってもらった', english: [
        "got it cut",
        "I got my hair cut -- finally, I was lookin' rough",
        "got my hair cut, got my car fixed, got my life together -- one outta three",
        "I got my hair cut, I got my nails done, I got my apartment cleaned. notice how I didn't do any of it? 'got' is the ultimate outsourcing word. I got it done means someone else did the work and I take credit for initiating it. CEO grammar. delegate and claim victory."
    ], literal: 'had someone cut my hair', context: "I cut my hair(自分で切った)とI got my hair cut(切ってもらった)。gotを挟むだけで「俺はやってない、誰かにやらせた」になる。have/getの使役構文って呼ばれるけど、要は「外注報告」。日本語は「〜してもらった」と恩恵の感覚がある。英語のgetにはそれがない。ただの事務連絡。感謝なしの外注。効率の言語。", category: 'filler' },
    { daySlot: 22, japanese: 'もう終わりでしょ', english: [
        "it's over",
        "yeah no, it's over -- that ship has sailed",
        "it's over, it's done, there's no comin' back from this",
        "it's over. and when I say over, I don't mean 'on a break.' I mean the credits rolled, the lights came on, and everyone's puttin' on their coats. over. the word even looks like an arc -- something went up, came over the top, and landed on the other side. past the peak. done."
    ], context: "overは「上を越えて向こう側」。it's over = 山を越えちゃった = もう戻れない。game over、the party's over、we're over。全部「ピークの向こう側に落ちた」イメージ。日本語の「終わり」は時間が止まる感じ。英語のoverは空間を超えてしまった感じ。時間じゃなくて位置で「終了」を表現する。英語は空間で考える言語。", category: 'opinion' },
    { daySlot: 22, japanese: '最近何してんの', english: [
        "what're you up to",
        "hey, what've you been up to these days?",
        "so what are you up to lately -- anything good?",
        "what are you up to? and this is the casual version. 'what are you doing' sounds like your mom caught you with your hand in the cookie jar. 'what are you up to' is just 'hey, where's your life at these days?' totally different vibe. same question. different relationship."
    ], context: "up toのupは「到達点」。what are you up to = 「どこまで来てる?」。進捗報告を求める前置詞。でも日常会話では「最近何してる?」くらいの軽さ。面白いのはup toにはもう1つ「企んでる」の意味がある。What are you up to?(何してんの?)とWhat are you up to?(何たくらんでんの?)は同じ文。トーンだけで善人か悪人か決まる。怖い。", category: 'suggestion' },
    { daySlot: 22, japanese: '要するにさ', english: [
        "basically",
        "basically what happened was -- OK lemme simplify",
        "so basically, long story short, the whole thing collapsed",
        "basically. I love this word. it's a compression machine. you just spent ten minutes explainin' somethin' and then go 'so basically...' and say it in one sentence. that one sentence was the whole point. the other ten minutes were scenic route. basically = 'I'm gonna delete 90% of what I said and give you the 10% that matters.'"
    ], context: "basicallyは「今から圧縮します」宣言。10分の話をbasically...の後の1文に潰す。日本語の「要するに」と同じ機能だけど、置く場所が自由すぎる。文頭(basically, he quit)、文中(he basically quit)、文末(he quit, basically)。どこに置いても機能する移動式圧縮機。日本語の「要するに」は文頭限定。英語のbasicallyは遊牧民。", category: 'filler' },
    { daySlot: 22, japanese: '正直に言うとさ', english: [
        "honestly",
        "honestly? I don't even know what I'm doin' half the time",
        "honestly though, I have no idea how I got here",
        "honestly? and I mean honestly honestly, not the fake honestly people throw in before a compliment -- I have no clue. zero. I'm makin' it up as I go. and the fact that it's workin' is either proof that I'm secretly competent or proof that nobody's payin' attention. I'm bettin' on the second one."
    ], context: "honestlyは「フィルター外します」宣言。言った瞬間に次の文の信頼度が上がる。でも面白いのは、honestly自体が使われすぎて信頼度がインフレしてる。honestly? I loved it(本当に良かった)と、Honestly, I'm fine(全然大丈夫じゃない)。正直って言ってるのに嘘つくこともある。正直の皮を被った嘘。日本語の「正直に言うと」も同じ。宣言するほど怪しくなる逆説。", category: 'filler' },
    { daySlot: 22, japanese: 'あのさ、わかる？', english: [
        "you know",
        "it's like, you know, one of those things, y'know?",
        "it was -- you know when you just feel it? like that",
        "you know? and that's two different words doin' two different jobs. 'you KNOW?' at the end of a sentence = 'please confirm you understand me.' but 'y'know' in the middle = nothing. it's a comma you say out loud. y'know is the verbal equivalent of tapping your fingers on the table. pure habit. zero meaning. maximum frequency."
    ], context: "you knowは英語で最も多機能な2語。文末のyou know?(わかる? = 確認)と文中のy'know(えーっと = つなぎ)は同じ単語なのに仕事が違う。速度で区別する。ゆっくり言うと質問、速く言うとフィラー。日本語の「ね」も同じ。「いいね」(同意)と「えっとね」(つなぎ)。2文字で2つの仕事。小さい言葉ほど多機能。言語の法則。", category: 'filler' },
    { daySlot: 22, japanese: '時間を投資する', english: [
        "invest time",
        "I invested way too much time in this -- no returns",
        "I spent energy, invested time, and got zero ROI on that conversation",
        "I invested three hours. invested. not spent -- invested. 'cause 'spent' means it's gone. 'invested' means I expect somethin' back. and when you invest three hours and get nothin' back, that's not just a waste of time. that's a bad investment. and now I'm emotionally bankrupt. the metaphor writes itself."
    ], context: "英語は全部お金。spend time(時間を使う)、invest energy(エネルギーを投資する)、emotional currency(感情の通貨)、pay attention(注意を払う)。時間も感情も注意力も全部「通貨」扱い。日本語だと「時間をかける」「気を使う」とバラバラの動詞を使うけど、英語は全部に金融用語を貼る。人生のあらゆるリソースに値札がついてる。商人の言語。", category: 'opinion' },
    { daySlot: 22, japanese: 'え、マジで？嘘でしょ', english: [
        "wait, seriously?",
        "wait -- seriously? no way. get outta here",
        "wait, for real? you're messin' with me. no way that happened",
        "get outta here. and I don't mean literally leave -- I mean my brain can't process what you just said so it's tellin' you to exit. 'get outta here' is my brain's 404 error page. information not found. please try again with something believable. my reality just crashed and it needs a reboot."
    ], context: "英語の驚きは身体コマンドで表現する。get outta here(出てけ)、shut up(黙れ)、stop it(やめろ)。全部命令形なのに、意味は「え、マジ?」。身体を動かす命令を驚きに転用してる。日本語だと「嘘!」「マジ?」と事実確認するけど、英語は体に命令する。脳がバグったときに出る言葉が身体命令になるの、面白すぎる。", category: 'reaction' },
    { daySlot: 22, japanese: 'お願いしますって言えばいいと思うなよ', english: [
        "please doesn't fix it",
        "just sayin' please doesn't make it polite automatically",
        "please isn't magic -- sometimes it makes it worse",
        "can you move? -- fine, neutral. can you move please? -- polite, nice. can you PLEASE move? -- I've asked three times and I'm about to lose it. please with stress on it flips from polite to furious. the same word. the polite word. turned into a weapon. that's English stress for you. volume is grammar."
    ], literal: "don't think just saying please fixes everything", context: "pleaseは丁寧語のはずなのに、強く言うと怒りになる。Could you PLEASE stop? = 「いい加減にしろ」。音圧が意味を反転させる。日本語の「お願いします」はどんなに強く言っても丁寧のまま。壊れない。でも英語のpleaseは壊れる。強調しすぎると礼儀が攻撃に変わる。英語では丁寧さにも耐荷重がある。重さをかけすぎると折れる。", category: 'opinion' },

    // ── Day 23 ──
    { daySlot: 23, japanese: '昔はそう思ってた', english: [
        "used to think so",
        "I used to think that way -- not anymore though",
        "I used to believe that, genuinely, but things changed",
        "I used to think sleep was optional. used to think I could run on four hours and coffee. used to think that was tough. now I think that was stupid. 'used to' is the English time machine. it takes you back, shows you who you were, and quietly adds 'but not anymore.' two words that bury your past self."
    ], literal: 'in the past I thought so', context: "used toは「昔は〜だった(けど今は違う)」を2語に圧縮する時限爆弾。I used to smoke -- この文が終わった瞬間に「もう吸ってない」が爆発する。言ってないのに伝わる。日本語は「昔は吸ってたけど今はやめた」と全部言わないと伝わらない。英語のused toは後半を省略しても勝手に届く。沈黙が情報を運ぶ構造。省エネの極致。", category: 'opinion' },
    { daySlot: 23, japanese: 'まさにそれ言おうとしてた', english: [
        "about to say that",
        "dude, I was literally about to say the exact same thing",
        "I was just about to say that -- you read my mind",
        "I was about to say that. about to. not 'going to' -- about to. 'going to' is a plan. 'about to' is the last second before launch. the rocket's on the pad, engines are lit, T-minus one. I was THAT close to sayin' it and you stole it. the thought was already in my throat. you word-sniped me."
    ], context: "about toは「あと0.5秒で起きる」。be going toは予定、be about toは寸前。I'm going to eat(これから食べる)とI'm about to eat(今まさに食べるとこ)。距離が全然違う。日本語の「〜しようとしてた」は幅が広いけど、英語は予定(going to)と寸前(about to)をきっちり分ける。0.5秒の差を文法で区別する。英語の時間感覚は細かい。", category: 'reaction' },
    { daySlot: 23, japanese: 'いいよ、やろうぜ', english: [
        "down for that",
        "yeah I'm totally down for that, let's go",
        "I'm down -- just tell me when and where",
        "I'm down. not up. down. which is weird, right? 'I'm up for it' also means yes. so up = yes and down = yes? how? because 'down' here means 'I'm puttin' my money down.' like a bet. I'm committed. 'up' means 'I'm standing up and ready.' both mean go. English has two opposite words for the same answer. chaos language."
    ], context: "I'm down(やる)とI'm up for it(やる)が同じ意味。上も下もyes。なぜ? downは「金を置く=賭ける=コミットする」。upは「立ち上がる=準備OK」。全然違う理由で同じ結論に着く。日本語で「乗った!」も「落ちた!」もyesにはならない。英語の空間メタファーは方向が意味を持たない。到達した態度が意味を持つ。ゴールが同じなら道順は問わない。", category: 'reaction' },
    { daySlot: 23, japanese: 'よくやったなそれ', english: [
        "pulled it off",
        "can't believe you actually pulled that off, respect",
        "you pulled that off? seriously? I didn't think it was possible",
        "you pulled it off. pulled. like it was stuck somewhere and you yanked it free. that's what 'pull off' is -- ripping success out of a situation that was holdin' on to failure. it wasn't gonna happen, and then you grabbed it and pulled. physical verb for a mental achievement. English treats success like a heist."
    ], literal: 'you did well on that', context: "pull offは「引き剥がす」。成功を無理やり引っ張り出すイメージ。日本語の「やり遂げた」は最後まで走り切った感じ。英語のpull offは「本来くっついてた失敗から成功を引き剥がした」感じ。もっと暴力的。難易度が高いほどpull offが似合う。簡単なことにpull offは使わない。「無理ゲーだったのにやった」専用。褒め言葉の中に驚きが内蔵されてる。", category: 'reaction' },
    { daySlot: 23, japanese: 'もう十分でしょ', english: [
        "that's enough",
        "OK that's enough -- I've heard plenty, thanks",
        "that's enough, I don't need to hear any more",
        "that's enough. two words. and they draw a line in the sand. 'enough' is the word that says 'the container is full, stop pouring.' it's not angry, it's not sad, it's just -- full. I've had enough coffee, enough drama, enough of this conversation. the tank's at capacity. one more drop and it overflows."
    ], context: "enoughは「ちょうどのライン」を引く単語。good enough(ギリギリOK)、that's enough(ここまで)、enough is enough(限界突破)。日本語の「十分」は「足りてる」。英語のenoughは「これ以上入らない」。容器のメタファー。足りてるんじゃなくて、満タンなの。だからenoughの次に来るのはstop。「足りた」じゃなくて「止めろ」。境界線の単語。", category: 'shutdown' },
    { daySlot: 23, japanese: 'やりすぎだって', english: [
        "that's too much",
        "nah that's too much -- you crossed the line there",
        "too much, dude, you went way past the acceptable zone",
        "too much. two letters. T-O-O. and those two letters are the difference between 'good' and 'ruined.' this coffee is strong -- great. this coffee is TOO strong -- trash. the dress is short -- fine. the dress is TOO short -- problem. 'too' is the word that says 'you passed the line and now you're in the danger zone.' one syllable, instant judgment."
    ], context: "tooはenoughの向こう側。enough=容器の縁、too=溢れた。too much、too late、too bad。全部「ラインを超えた」報告。日本語の「すぎ」も同じだけど、英語のtooは3文字で独立して立てる。That's too much.(5語で完結)。日本語は「それはやりすぎだよ」(7語必要)。英語のtooは短くて鋭い。ナイフみたい。一瞬で切る。", category: 'opinion' },
    { daySlot: 23, japanese: 'で、あたしは「マジで?」って感じで', english: [
        "I was like, no way",
        "and I was like 'no way' and she was like 'yes way'",
        "so I was like 'are you serious' and he goes 'dead serious'",
        "and she was like 'I'm moving to Iceland' and I was like 'WHAT' and she was like 'yeah' and I was like 'ICELAND?' -- notice how 'like' replaced 'said' entirely? nobody says 'said' in casual storytelling anymore. 'like' is the new 'said.' and it comes with a built-in movie screen. I was like = 'picture my face doing this.'"
    ], context: "likeは引用符になった。I was like 'no way' = 「マジで?って感じだった」。saidが「言った」ならlikeは「こんな感じだった」。言葉だけじゃなくて表情もリアクションも全部含む。日本語の「〜って感じで」と完全に同じ進化をしてる。両方とも引用動詞が曖昧な方向に進化した。言語は違うのに変化の方向が同じ。人間の脳が同じだから。", category: 'filler' },
    { daySlot: 23, japanese: '完全にホームラン', english: [
        "knocked it outta the park",
        "you knocked that outta the park, honestly, grand slam",
        "that presentation? straight-up home run, you crushed it",
        "you crushed it. you killed it. you nailed it. you knocked it outta the park. four different violent metaphors for 'you did well.' English treats success like a crime scene. you didn't just succeed, you DESTROYED. the competition didn't lose, they got murdered. Japanese says 'good job.' English says 'you committed excellence with extreme prejudice.'"
    ], context: "英語は成功を暴力で表現する。killed it(殺した)、crushed it(潰した)、nailed it(釘で打った)、smashed it(叩き壊した)。全部「良くやった」。日本語の「やったね」は平和。英語の「やったね」は戦場。なぜ? たぶんスポーツ文化。野球のhome run、バスケのslam dunk。スポーツ→戦い→日常会話。「勝った=壊した」が染み込んでる。", category: 'reaction' },
    { daySlot: 23, japanese: 'もう無理、限界', english: [
        "I can't even",
        "I'm so done with this -- I literally can't even",
        "I can't even deal right now, I'm at my absolute limit",
        "I can't even. can't even what? doesn't matter. the sentence doesn't finish because my ability to cope doesn't finish. 'I can't even' is a sentence that performs its own meaning. it can't even complete itself. the grammar broke because my patience broke. that's poetic, actually. the structure mirrors the emotion. broken sentence for a broken person."
    ], context: "I can't evenは文法的に壊れてる。can't even何? 動詞がない。でもそれが完璧に「もう無理」を表現する。文が壊れることで感情の壊れ具合を表現してる。日本語の「もう無理」も理由を言わない。何が無理かは言わなくていい。「無理」で全部通る。両言語とも限界の表現は不完全になる。余裕がないから文法にまで手が回らない。壊れた文が正しい。", category: 'reaction' },
    { daySlot: 23, japanese: '敬語って文法じゃん、英語は空気読むんだよね', english: [
        "it's all about tone",
        "Japanese has grammar for politeness -- English just vibes it",
        "Japanese builds politeness into grammar, English builds it into word choice and tone",
        "in Japanese, politeness is grammar. you conjugate differently for your boss and your friend. in English? same grammar. 'give me that' to your friend, 'would you mind passing that' to your boss. same action, same grammar slot, completely different words. Japanese changes the engine. English changes the paint job."
    ], context: "日本語の敬語は動詞が変形する。食べる→召し上がる→いただく。文法レベルで丁寧さが組み込まれてる。英語は動詞は変わらない。代わりにwould you mind、could you possibly、I was wonderingと文全体を長くして丁寧にする。つまり日本語は「短く→丁寧に変形」、英語は「長く→丁寧に膨張」。丁寧さのコストが真逆。日本語は変形コスト、英語は文字数コスト。", category: 'opinion' },

    // ── Day 24 ──
    { daySlot: 24, japanese: 'たまたま居合わせた', english: [
        "happened to be there",
        "I just happened to be there -- total coincidence",
        "I happened to walk in right when it all went down",
        "I happened to be there. happened to. not 'I planned to be there.' not 'I chose to be there.' the universe just put me in that spot at that time for no reason. 'happen to' is English for 'fate did it, not me.' zero responsibility. maximum alibi. I was just standin' there, your honor."
    ], context: "happen toは「偶然フィルター」。I saw it(見た)とI happened to see it(たまたま見た)。happenを挟むだけで「意図ゼロ」を証明する。日本語の「たまたま」は副詞。英語のhappen toは動詞に寄生する構造。動詞の前に住み着いて「この行動に意思はなかった」と無罪を主張する。弁護士の文法。", category: 'filler' },
    { daySlot: 24, japanese: 'どうやらそうっぽい', english: [
        "seems like it",
        "it seems like that's the case -- apparently, anyway",
        "seems like that's what happened, from what I can tell",
        "it seems like it. seems. not 'is.' big difference. 'it is' = I'm sure. 'it seems' = my eyes are tellin' me this but my brain hasn't signed off yet. there's a gap between what I see and what I believe. 'seems' lives in that gap. it's the word of not-quite-convinced. permanent maybe."
    ], context: "seemは「見た目と中身が一致してない可能性」を1語で表す。it seems nice(良さそうに見えるけど...)。このけど以降は言わなくても漂う。日本語の「〜っぽい」も同じ不確定感があるけど、英語のseemはもっと慎重。it seems、it appears、it looks like -- 全部「目は信じたけど脳がまだ」。英語話者は断言を避ける道具をたくさん持ってる。確信を薄める語彙が異常に豊富。用心深い言語。", category: 'filler' },
    { daySlot: 24, japanese: '偶然見つけちゃった', english: [
        "came across it",
        "I came across this random thing and now I can't stop",
        "I came across this article at 2 AM and fell down a rabbit hole",
        "I came across it. came across. like I was walkin' and it was just... there. in my path. I didn't search for it. I didn't want it. it appeared. that's what 'come across' does -- it frames discovery as a physical encounter. you were movin' through space and the thing was in your way. you tripped over knowledge. accidental genius."
    ], context: "come acrossは「横切ったら出会った」。acrossは「向こう側」だから、歩いてたら道の反対側に何かあった感じ。日本語の「見つけた」は意図的にも偶然にも使える。英語はfind(探して見つけた)とcome across(たまたま出会った)を分ける。偶然にわざわざ専用動詞がある。英語話者にとって「偶然の発見」は「計画的発見」と同じくらい重要な体験ってこと。語彙の数=重要度のバロメーター。", category: 'reaction' },
    { daySlot: 24, japanese: '今度遊ぼうよ', english: [
        "let's hang out",
        "we should hang out sometime -- for real though",
        "let's hang out soon, I need to get outta the house",
        "let's hang out. and by 'hang out' I mean... nothing specific. no plan. no agenda. just exist in the same space. that's the beauty of 'hang out.' it's anti-plan. you're not doing an activity, you're doing a person. you're hanging. like laundry. just... there. in the breeze. doing nothing, together. that's friendship distilled to its purest form."
    ], literal: "let's play/hang next time", context: "日本語の「遊ぶ」は大人が使うと子供っぽく聞こえることがある。英語のhang outは年齢不問。でもhang outの本質は「ぶら下がる」。何もせず、ただそこにいる。日本語の「遊ぶ」は何かする前提。英語のhang outは何もしない前提。虚無を共有する行為に専用動詞がある。英語圏の人にとって「一緒に何もしない」は立派な予定。", category: 'suggestion' },
    { daySlot: 24, japanese: '他に何かある？', english: [
        "what else",
        "what else you got? anything else goin' on?",
        "anything else? or is that the whole story?",
        "what else? two words that open the next door. you told me one thing and I want more. 'else' is the 'next page' button for conversation. someone else, something else, somewhere else -- it always points away from where you are right now toward the thing you haven't mentioned yet. else is the exit sign from the current topic."
    ], context: "elseは「今ここにないもの」を指す。something else(別の何か)、someone else(別の誰か)、or else(さもなくば=別の結果)。日本語は「他に」「別の」と2語必要なものを英語は4文字に圧縮。しかもelseは名詞の後ろにつく。something+else。前じゃなくて後ろ。英語は普通、形容詞を前に置くのに(big house)、elseだけ後ろ。VIP席。ルール破りが許される特権的な単語。", category: 'suggestion' },
    { daySlot: 24, japanese: '自分の城を持つ', english: [
        "my own place",
        "I finally got my own place -- nobody's rules but mine",
        "having my own space makes all the difference, honestly",
        "my OWN place. hear that emphasis? not 'a' place. not 'the' place. MY OWN. two possessives stacked. 'my' says it's mine, 'own' says AND NOBODY ELSE'S. Japanese uses 自分の and that's enough. English felt the need to double down. my + own. because in English, possession is never secure until you've said it twice. once for the claim. twice for the threat."
    ], context: "ownは「自分で」の強調マーカー。my place(私の場所)とmy own place(自分だけの場所)。ownを入れると排他性が生まれる。他の人は関係ない。on my own(自力で)、my own way(自分なりに)。日本語の「自分の」はあっさりしてるけど、英語のownは主張が強い。独立宣言の単語。アメリカの建国精神がownの4文字に凝縮されてる気がする。", category: 'opinion' },
    { daySlot: 24, japanese: '間を空ける', english: [
        "the pause",
        "the pause is where the power is -- wait for it",
        "and the answer is... (three second pause) ...nothing. boom.",
        "and the winner is... (silence) ...see what I just did? you leaned in. your brain went into overdrive trying to fill the gap. that's the power of a pause. silence isn't empty. silence is a container that the listener fills with anticipation. the longer the pause, the bigger the container, the louder the answer lands. comedians know this. speakers know this. your mom knew this when she used your full name and then... waited."
    ], context: "英語のスピーチで間(ま)は武器。and the answer is...(3秒沈黙)...でドラマを作る。日本語の「間」は文化的に尊重されてるけど、英語の間は戦略的に使われる。沈黙=聞き手の脳が先回りし始める時間。答えを言わないことで聞き手が自分で考え始める。沈黙が情報を運ぶ。何も言ってないのに何かが伝わる。空白が最大音量になる瞬間。", category: 'opinion' },
    { daySlot: 24, japanese: '締切と戦ってる', english: [
        "battling deadlines",
        "I've been battling deadlines all week -- can't catch a break",
        "I'm fighting fires, battling deadlines, struggling to keep up",
        "I'm battling a deadline. battling. not 'working toward.' BATTLING. like the deadline has a sword and I have a laptop and we're in mortal combat. English turns every daily annoyance into a war. 'struggling with' taxes, 'fighting' traffic, 'killing' time. we don't just live. we wage war on life itself. and somehow that makes it feel more heroic than it is."
    ], context: "英語は日常を戦場にする。battle a deadline(締切と戦う)、fight traffic(渋滞と戦う)、struggle with anxiety(不安と格闘する)。全部軍事用語。日本語は「追われる」「間に合わない」と逃走側。英語は「戦う」と攻撃側。同じ状況でも日本語は被害者ポジション、英語はファイターポジション。どっちが正確かじゃなくて、どっちの気分で生きたいかが言語に出てる。", category: 'reaction' },
    { daySlot: 24, japanese: 'できたらでいいんだけど', english: [
        "any chance you could",
        "any chance you could take a look at this when you get a sec?",
        "would you mind if I asked you a quick favor? no pressure",
        "any chance you could... see how soft that is? 'any chance' means 'I know the probability is low and I'm OK with a no.' it's pre-apologizing for the request before you even make it. Japanese does this with すみませんが... English does it with 'any chance.' both languages have a ritual bow before the ask. just built differently."
    ], context: "any chanceは「可能性ありますか?」と聞くことでお願いのハードルを下げる装置。Can you...?(できる?)より圧倒的に柔らかい。日本語の「できたらでいいんだけど」も同じ -- 条件をつけて逃げ道を先に作る。英語も日本語も、丁寧なお願い=「断ってOKだよ」を先に言うこと。直接聞くほど失礼、間接的に聞くほど丁寧。これは世界共通。遠回りの距離=礼儀の深さ。", category: 'request' },
    { daySlot: 24, japanese: 'すぐ名前で呼ぶよね英語って', english: [
        "first name basis",
        "we're on a first-name basis already -- that was fast",
        "in English you skip to first names in like five minutes flat",
        "met this guy ten minutes ago and he's already callin' me by my first name. in Japan that would take months. maybe years. maybe never if it's your boss. English just bulldozes through that wall on day one. 'hey, just call me Mike.' done. intimacy speedrun. the Japanese system has gates. the English system has a welcome mat."
    ], literal: 'English calls by first name quickly right', context: "英語は初対面で名前(ファーストネーム)を使う。日本語は苗字+さんがデフォルト。この差は距離感の設計思想が違う。英語は「まず近づいて、必要なら距離を取る」。日本語は「まず距離を取って、徐々に近づく」。出発点が逆。英語のHi, I'm Tomは「俺はもう壁を開けた、お前も開けろ」という宣言。日本語の名刺交換は「壁はあるけど覗き穴を開けましょう」。建築思想が違う。", category: 'opinion' },

    // ── Day 25 ──
    { daySlot: 25, japanese: 'この店、高いな', english: [
        "this place? pricey.",
        "this place? expensive. like, offensively expensive.",
        "this place, man -- way too expensive for what you get",
        "this place? expensive. see that structure? topic first, judgment after. 'this place' is the target. pause. then the bullet. 'expensive.' that's topic-comment structure and English does it all the time in casual speech. textbooks say English needs S-V-O. real English says 'nah, throw the topic out there and let it hang for a sec.'"
    ], literal: 'this store, expensive huh', context: "教科書は「英語はSVO」って言うけど、カジュアルな会話ではトピック先出しが普通。This place? Expensive. Your brother? Genius. That movie? Overrated.。全部「これね→こう」構造。日本語の「この店、高いな」と完全に同じ。日本語はいつもこれ。英語はカジュアルなときだけこれ。つまりカジュアルな英語は日本語に近づく。リラックスすると言語の壁は薄くなる。面白い。", category: 'opinion' },
    { daySlot: 25, japanese: '驚いたのはオチだった', english: [
        "the ending got me",
        "what got me was the ending -- didn't see it comin'",
        "what surprised me was the ending, not the twist itself",
        "what surprised me was the ENDING. not the beginning. not the middle. the ending. see how English puts new information last? 'what surprised me was' -- that's all setup. packaging. the actual payload is the last word. English is a delivery truck. everything before the last word is the road. the last word is the package. and you don't open it until it arrives."
    ], context: "英語は新情報を最後に置く。What surprised me was the ENDING。「何が驚きだったかというと」= 旧情報(セットアップ)。「結末」= 新情報(着地)。英語は文を配達トラックみたいに使う。前半は道路、最後が荷物。日本語は「結末が驚きだった」と新情報を先に言える。英語は先に言えない。最後まで焦らす。英語の文は全部、小さなミステリー。答えは常に最後。", category: 'opinion' },
    { daySlot: 25, japanese: '結局こうなるんだよな', english: [
        "wound up here",
        "how'd we wind up here again? every time, man",
        "we always wind up in the same place no matter what",
        "started the night at a nice restaurant. classy. refined. wound up at a convenience store at 2 AM eatin' onigiri on the curb. how? how does this keep happening? 'wind up' is the perfect verb because winding is what thread does -- it goes around and around and ends up somewhere you didn't aim for. life is tangled thread."
    ], context: "wind upは糸が巻かれるように「ぐるぐる回って結局ここに着く」。end upと似てるけどwind upのほうが「道中の迷走感」がある。日本語の「結局」は結論だけ言う。英語のwind upは結論+過程のカオスを1語に圧縮してる。windには「曲がりくねる」の意味もある。winding road=曲がりくねった道。人生は直線じゃなくて巻き糸。着地点は予測不能。", category: 'filler' },
    { daySlot: 25, japanese: '自然にそうなった', english: [
        "grew into it",
        "she kinda grew into the role -- wasn't forced at all",
        "I didn't plan it, I just grew into it over time",
        "I grew into it. like a plant grows into sunlight. not because someone told it to. not because it read a self-help book. it just... reached toward the warm thing. that's 'grow into.' nobody decided. nobody planned. the growth happened because the conditions were right. the most honest verb for natural change. no ambition required."
    ], context: "grow intoは「服がだんだん体に合ってくる」イメージ。子供が大きい服を着て、成長して似合うようになる。日本語の「成長した」は結果報告。英語のgrew into itは過程が見える。intoがあるから「外にいた→中に入った」の移動が含まれてる。最初はフィットしてなかったけど、だんだんフィットした。成長を空間移動で表現する。英語の前置詞は時間を空間に翻訳する装置。", category: 'opinion' },
    { daySlot: 25, japanese: '人ってさ', english: [
        "one might think",
        "one might think that's obvious -- but it's really not",
        "one might assume that, but the reality's totally different",
        "one might think this sounds pretentious. and one would be right. nobody actually says 'one' in casual conversation. it's a formal ghost. 'one' is what you say when you want to sound smart and distant at the same time. real people say 'you' -- 'you might think.' 'one' is 'you' in a tuxedo. same person, fancier outfit."
    ], literal: 'people, you know', context: "oneは「誰でもない誰か」。you might thinkは「お前は」と指差す。one might thinkは誰も指してない。空気に向かって喋ってる。日本語の「人ってさ」も同じ曖昧さがある。でもoneはフォーマルすぎてカジュアルな会話では浮く。英語では「一般的な人」を指すのにyouを使う。You never know(人生わからないもの)。お前のことじゃないのにyou。英語のyouは二人称の皮を被った一般論。", category: 'opinion' },
    { daySlot: 25, japanese: 'あのやつ', english: [
        "that thing",
        "the thing -- you know, THAT thing, the one we talked about",
        "can you grab that thing? the thing on the thing?",
        "the thing. on the thing. near the other thing. -- English speakers can have entire conversations using only the word 'thing' and somehow understand each other perfectly. 'thing' is the ultimate placeholder. it replaces any noun your brain can't access fast enough. the word exists because human memory is trash and language adapted."
    ], context: "thingは「名前を思い出せない全て」を吸収する万能名詞。the thing(あれ)、that thing(それ)、the thing is(要はさ)、it's a thing(流行ってる)、do your thing(お前らしくやれ)。1語で5つの仕事。日本語の「やつ」「あれ」も同じだけど、thingはもっと広い。文の主語にも使える(the thing is...)。名詞のくせに接続詞の仕事もする。万能すぎて正体不明。最強の曖昧語。", category: 'filler' },
    { daySlot: 25, japanese: 'え、語尾上げで報告するの？', english: [
        "so I went there?",
        "so I went to the store? and I bought milk? -- why is this a question?",
        "she's tellin' me a story but every sentence sounds like a question",
        "so I was at work? and my boss comes in? and he goes, like, 'we need to talk?' -- that's three declarative sentences delivered as questions. it's not asking anything. it's checking if you're still following. every rising tone is a ping. 'you still there? you still there? you still there?' it's a read receipt for conversation."
    ], literal: 'you report with rising intonation?', context: "最近の英語、特に若者は報告なのに語尾を上げる。so I went to the store?(店に行ったんだけど?)。質問してない。「ここまでついてきてる?」の確認。日本語で言うと「〜じゃん?」「〜でさ?」に近い。言語学者はuptalkって呼んで嫌がるけど、全員やってる。機能は明確: 聞き手の注意を途切れさせない。語尾上げ=既読確認。ピンを打ち続ける話し方。", category: 'filler' },
    { daySlot: 25, japanese: '生煮えのアイデア', english: [
        "half-baked",
        "that idea's half-baked -- needs way more time in the oven",
        "it's a half-baked plan, honestly, not ready for the real world",
        "half-baked. not raw -- that would mean you haven't started. half-baked means you started, you put it in the oven, and you pulled it out too early. impatience made it bad. the idea exists but it's doughy in the middle. English treats ideas like food. raw deal, tough to swallow, hard to digest, food for thought. your brain is a stomach."
    ], literal: 'half-cooked idea', context: "half-bakedは「半分しか焼けてない」=「考えが甘い」。英語は思考を料理で表現する。raw(生=未熟)、half-baked(半焼け=中途半端)、well-done(よく焼けた=完成)。日本語は「煮詰まる」「味がある」と和食系。英語はオーブン系。food for thought(思考の食べ物)、digest information(情報を消化する)。脳が胃。考えることは食べること。言語ごとにキッチンが違う。", category: 'opinion' },
    { daySlot: 25, japanese: 'いいよ、行こう！ / ごめん厳しい', english: [
        "I'm down! / I wish I could",
        "I'm so down! -- vs -- I wish I could but I really can't",
        "count me in! -- vs -- I'd love to but I've got a thing",
        "count me in! vs I'd love to but... -- notice the 'but'? when you hear 'I'd love to' followed by 'but,' the answer is always no. the 'love to' is a courtesy coffin. the real answer is whatever comes after 'but.' English yeses are short: 'I'm in.' English nos are long: 'I would but...' Length = guilt. the longer the no, the more they care."
    ], context: "英語のyes: sure / I'm in / count me in / I'm down / let's go。短い。英語のno: I wish I could but... / I'd love to but... / I would if I could but...。長い。断りの文が長いのは罪悪感の量。日本語も同じ。「いいよ」(2文字)vs「ごめん、ちょっとその日は...」(長い)。両言語とも「yesは短く、noは長く」。断るときは言い訳という荷物を運ぶから文が重くなる。言語学じゃなくて心理学。", category: 'reaction' },
    { daySlot: 25, japanese: '褒められたら「ありがとう」でしょ', english: [
        "just say thanks",
        "in English you just say thanks -- don't deflect, don't deny",
        "someone compliments you? just take it. 'thanks!' -- done.",
        "nice shirt! -- 'thanks!' in English. nice shirt! -- 'え、いやいや、これ古いやつで、安かったし...' in Japanese. exact opposite reactions. English receives compliments like catching a ball. Japanese deflects them like dodging a ball. same ball. different sport. and when Japanese people deflect in English, Americans think they're insulting the compliment giver. cultural collision in three seconds."
    ], literal: "when complimented it's 'thanks' right", context: "褒められたときの反応。英語: thanks!(受け取る)。日本語: いやいやそんな(否定する)。英語で謙遜すると「お前の目は節穴か」と侮辱になりかねない。逆に日本語で即thanks!と言うと「この人、自覚あるんだ」とナルシストに見える。同じ行動の評価が真逆。褒めの受け取り方は翻訳できない。文化ごと入れ替える必要がある。これは単語の問題じゃなくて態度の問題。", category: 'reaction' },

    // ── Day 26 ──
    { daySlot: 26, japanese: '学ぶために来た', english: [
        "came here to learn",
        "I came here to learn -- that's it, that's the whole reason",
        "I moved across the world to learn this one thing",
        "I came here to learn. seven words. subject, verb, destination, purpose. and the purpose is packed into two words: 'to learn.' that little 'to' is doing all the heavy lifting. it means 'in order to.' but nobody says 'in order to' in real life. they just say 'to.' two letters carrying the entire reason for your existence in this sentence."
    ], context: "toは英語で最も働いてる2文字。I came to learn(学ぶために来た)、I eat to live(生きるために食べる)。「ために」を2文字に圧縮してる。日本語は「〜するために」と明示するけど、英語はtoだけで理由がつながる。さらにto不定詞は文のどこにでも挿入できる。something to eat(食べるもの)、easy to understand(理解しやすい)。toは英語のスイスアーミーナイフ。2文字で10個の仕事。", category: 'opinion' },
    { daySlot: 26, japanese: '好き？ -- 好き。', english: [
        "do you? -- I do.",
        "do you like it? -- I do. -- see? two words, full answer",
        "did you finish? -- I did. do you agree? -- I do.",
        "do you like coffee? -- I do. did you go? -- I did. can you swim? -- I can. will you come? -- I will. notice the pattern? English echoes the helper verb. the question's verb bounces back as the answer. two words. full sentence. Japanese needs 'うん、好き' or just 'うん.' English built a mirror system. ask with 'do,' answer with 'do.' elegant. mechanical. perfectly symmetrical."
    ], context: "英語の短い返事は助動詞のエコー。Do you? → I do. Can you? → I can. Will you? → I will. 質問に使った助動詞をそのまま返す。鏡のシステム。日本語は「うん」で全部済む。英語は質問ごとに返す動詞が変わる。面倒に見えるけど、この鏡システムのおかげで2語で完全な文が作れる。I do.は主語+動詞で立派な文。日本語の「うん」は文じゃない。英語は短くても文の形を崩さない。形式へのこだわりが骨の髄まで。", category: 'reaction' },
    { daySlot: 26, japanese: 'まあしょうがないか', english: [
        "I can live with that",
        "it's not perfect but I can live with that, whatever",
        "not ideal, but I can live with it -- life goes on",
        "I can live with that. literally: I can continue living even though this exists. it's not acceptance. it's not happiness. it's cohabitation with imperfection. 'I can live with a messy desk.' the desk is still messy. I just decided it's not worth dying over. that's the lowest bar of acceptance. 'will this kill me? no? then it's fine.' English optimism at its absolute floor."
    ], context: "live withは「一緒に住む」=「受け入れる」。不完全なものと同居するイメージ。I can live with that(それと暮らせる=まあいいか)。日本語の「しょうがない」は諦めが入ってる。英語のlive withは諦めじゃなくて共存。嫌だけど殺さない。隣に置いとく。完璧じゃないものと暮らす能力。これが英語の「受け入れ」。許すんじゃなくて、同じ部屋にいることを許可する。距離感が絶妙。", category: 'opinion' },
    { daySlot: 26, japanese: 'ちょっと待って、考える', english: [
        "hold on",
        "hold on -- lemme think for a sec, don't rush me",
        "hold on hold on, my brain needs a minute to catch up",
        "hold on. physically: grab something so you don't fall. mentally: grab the conversation so it doesn't move forward. same verb, same action, different dimension. your hand holds a railing. your brain holds a thought. 'hold on' in conversation means 'stop the train, I need to board.' English uses body verbs for brain actions constantly. hold a thought. grasp a concept. catch my drift."
    ], context: "holdは「つかむ」。hold on(つかまれ→待って)、hold a thought(考えをつかめ→覚えとけ)、get a hold of yourself(自分をつかめ→落ち着け)。英語は思考を物理的につかむ。grasp the idea(アイデアを握る=理解する)、catch my meaning(意味を捕まえる=わかる)。全部、手の動作。日本語は「わかる」(分かる=分ける)。英語は「つかむ」。理解の比喩が違う。日本語は分解して理解。英語はつかんで理解。", category: 'request' },
    { daySlot: 26, japanese: 'いろいろあってさ', english: [
        "and stuff",
        "work and stuff, y'know, the usual",
        "I've been dealin' with stuff -- just life stuff, nothin' crazy",
        "stuff. the most beautiful word in English for people who don't wanna explain. 'what happened?' 'stuff.' 'what'd you buy?' 'stuff.' 'what's wrong?' '...stuff.' it's a noun-shaped curtain. you pull it across any topic you don't wanna open. and somehow everyone accepts it. 'oh, stuff? say no more.' stuff is English for 'none of your business, politely.'"
    ], context: "stuffは「いろいろ」を1語に圧縮するカーテン。and stuff(とかいろいろ)、life stuff(人生のアレコレ)、stuff like that(そういうの)。具体的に何かは絶対言わない。中身ゼロ。でもstuffと言えば会話が進む。日本語の「いろいろ」も同じカーテン。でもstuffのほうが守備範囲が広い。物理的なもの(買ったstuff)も抽象的なこと(考えるstuff)も全部飲み込む。万能の煙幕。", category: 'filler' },
    { daySlot: 26, japanese: 'なんか閉店するらしいよ', english: [
        "apparently",
        "apparently they're shutting down -- I dunno, just what I heard",
        "apparently the whole place is closing, or so they say",
        "apparently. one word and I'm already protected. 'apparently they're closing.' if it's wrong? not my fault. I said apparently. that's my legal shield. I didn't say 'they're closing.' I said 'apparently.' the word exists entirely to avoid blame for bad intel. it's the English equivalent of 「らしいよ、知らんけど」 compressed into one beautiful, responsibility-free adverb."
    ], context: "apparentlyは「俺は確認してないけど」免責1語。they're closing(閉店する=事実として言い切り)とapparently they're closing(閉店するらしい=伝聞、俺のせいじゃない)。1語付けるだけで責任から逃げられる。日本語の「らしい」と完全に同じ機能。でもapparentlyは文頭に1語置くだけ。日本語は文末で「らしい」。情報の信頼度タグを前に貼るか後ろに貼るかの違い。英語は先に警告。日本語は後から注釈。", category: 'filler' },
    { daySlot: 26, japanese: '長い話だと音が段々下がるよね', english: [
        "pitch drops off",
        "the pitch just keeps droppin' the longer the sentence goes",
        "by the end of a long sentence your voice is basically in the basement",
        "listen to anyone tell a long story. the first sentence is up here. the second sentence drops a bit. the third drops more. by the time they finish the paragraph they're practically whispering. then NEW topic -- boom, pitch resets to the top. it's like a staircase. each sentence is a step down. new topic = new staircase. your voice is an elevator that only goes down until someone presses reset."
    ], context: "英語の長い文は音程が段々下がる。文頭が高くて、文末に向かってじわじわ低くなる。そして新しいトピックが始まると音程がリセットされて高く戻る。この上下動で聞き手は「まだ同じ話」と「新しい話に変わった」を判別してる。日本語も同じ傾向があるけど、英語のほうが落差が大きい。高低差=トピックの境界線。音程はただの飾りじゃなくて、文章構造のナビゲーション。", category: 'opinion' },
    { daySlot: 26, japanese: 'チキンかよ', english: [
        "don't be a chicken",
        "don't be a chicken -- just do it, what's the worst that happens?",
        "stop bein' such a chicken and go talk to 'em",
        "don't be a chicken. he ratted me out. she's a lone wolf. he's being a snake. what a pig. in English, calling someone an animal is always an insult. always. even 'fox' (sly) and 'wolf' (predator). Japanese has 猫かぶり and 亀 but they're milder. English animal insults hit harder because the image is immediate. you don't explain. you just say 'chicken' and everyone sees the feathers."
    ], context: "英語は性格を動物で表現する。chicken(臆病)、snake(裏切り者)、rat(密告者)、wolf(一匹狼)、pig(汚い)。全部1語で人格評価が完了する。日本語も「猫をかぶる」とかあるけど慣用句。英語は名詞一発。You're a snake.で終わり。その人の全人格を動物1匹に圧縮する。短くて残酷。辞書に載ってない暴力。動物園が人間の欠点カタログになってる。", category: 'shutdown' },
    { daySlot: 26, japanese: 'すごくいいんだけど、一個だけ', english: [
        "one small thing",
        "this is great, honestly -- just one small thing though",
        "love it overall, but there's one tiny thing I'd tweak",
        "this is great. love it. one small thing though. -- see what I just did? two compliments, then 'one small thing.' that's the compliment sandwich. bread, meat, bread. the meat is 'I think this part is wrong.' the bread is 'but you're great!' and somehow people eat the whole sandwich without tasting the criticism. emotional engineering. works every time."
    ], context: "フィードバックの鉄則: 褒める→指摘→褒める(compliment sandwich)。日本語の「いいんだけど、一個だけ」も同じ構造。でも英語はthough(けどね)を文末に置く。I love it, one thing though.のthoughが「今からネガティブなこと言うよ」の予告。日本語の「けど」は文中に来る。英語のthoughは文末に来れる。後出しジャンケンみたいに、良いこと全部言い終わってから「けどね」を最後にポンと置く。ずるい。", category: 'suggestion' },
    { daySlot: 26, japanese: '元気？ -- 元気元気。そっちは？', english: [
        "good, you?",
        "how are you? -- good, you? -- good. -- ...that's it.",
        "hey how's it going? -- not bad, yourself? -- same old.",
        "how are you? good, you? good. -- congratulations, you just completed the most meaningless exchange in the English language. nobody answered honestly. nobody expected honesty. it's a verbal handshake. a social ping. 'are you functional?' 'yes.' 'me too.' 'great, let's proceed.' it's not a question. it's a protocol. TCP/IP for humans."
    ], literal: 'how are you? fine fine. you?', context: "How are you?は質問じゃない。社会的プロトコル。Good, you?が正しい返事。I'm experiencing existential dread, thanksとか言ったら空気が凍る。日本語の「お元気ですか?」はまだ本気度がある。英語のHow are you?は完全にロボット化してる。意味が蒸発して儀式だけ残った。でもこれ言わないと「この人、怖い」ってなる。意味がない言葉を言わないと人間関係が壊れる。言語って不思議。", category: 'filler' },

    // ── Day 27 ──
    { daySlot: 27, japanese: '友達の、医者の、あいつ', english: [
        "my friend, a doctor",
        "my friend, a doctor, says you shouldn't eat that much sugar",
        "this guy I know -- great dude, total genius by the way -- he agrees",
        "my friend, a doctor, told me to stop. see that comma pause? 'my friend' and 'a doctor' are the same person. that little aside, sandwiched between commas, adds identity without stopping the sentence. it's a name tag inserted mid-sentence. English lets you introduce someone and describe them in one breath. Japanese needs a separate clause. English just drops a comma and keeps rolling."
    ], context: "同格(appositive)。my friend, a doctor(友達の、医者の)。カンマで挟んだ補足情報。主語を紹介しながら属性を追加する。日本語は「医者の友達が」と前に置く。英語は「友達、医者だけど、が」と途中に挿入する。カンマが括弧の代わり。英語はこの挿入が大好き。Bob, my neighbor, who by the way is also a chef, said...と無限に挿入できる。文の中に文を入れ子にする。マトリョーシカ文法。", category: 'filler' },
    { daySlot: 27, japanese: '始めたら止まらない', english: [
        "once you start",
        "once you start you can't stop -- that's the whole problem",
        "once I started watchin' that show I couldn't put it down",
        "once you start, you can't stop. once I saw it, I understood. once we get there, we'll figure it out. -- 'once' is the trigger word. it means 'the moment this happens, everything changes.' it's a one-way gate. before the gate: one reality. after: another. 'once' turns a moment into a turning point. every 'once' sentence is a tiny story with a before and after."
    ], context: "onceは「一度〜したら」のトリガー。Once you start, you can't stop(始めたら止まらない)。onceの後に条件、メインが結果。日本語の「〜したら」と同じだけど、onceは「1回で十分」のニュアンスがある。once=たった1回で状況が変わる。一発で決まる。if(もし)は可能性。once(一度)は確定的。ifは未来が不確実。onceは未来を既に見てる。確信の接続詞。", category: 'opinion' },
    { daySlot: 27, japanese: 'もう壊れた', english: [
        "broke down again",
        "the car broke down again -- third time this month",
        "I broke down cryin' in the middle of the store, couldn't help it",
        "the car broke down. she broke down crying. the talks broke down. negotiations broke down. -- 'break down' works for machines, humans, and systems. anything that stops functioning = broke down. the machine stopped working. the human stopped coping. the system stopped progressing. one phrasal verb covers mechanical failure, emotional collapse, and diplomatic disaster. universal malfunction word."
    ], context: "break downは「機能停止」万能。car broke down(車が故障)、broke down crying(泣き崩れた)、talks broke down(交渉が決裂)。機械も人間もシステムも同じ動詞で壊れる。break up(別れる/分解する)、break out(勃発する/脱出する)、break through(突破する)、break in(侵入する/慣らす)。breakは「壊す」だけど方向で意味が7種類。壊し方のカタログ。英語の暴力は方向に敏感。", category: 'reaction' },
    { daySlot: 27, japanese: '本題に入ろう', english: [
        "cut to the chase",
        "let's cut to the chase -- what do you actually need?",
        "OK enough small talk, let me cut to the chase here",
        "cut to the chase. cut in line. cut corners. cut someone off. cut it out. -- 'cut' is the verb of shortcuts and boundaries. cut to the chase = skip the buildup, go straight to the climax (from movie editing). cut corners = skip the proper way. cut someone off = remove them from the conversation. every 'cut' removes something. time, effort, access. scissors for abstract things."
    ], context: "cutの句動詞。cut to the chase(本題に入る=映画の追跡シーンまで飛ぶ)、cut corners(手を抜く=角を切る)、cut in(割り込む)、cut it out(やめろ=切り取れ)、cut someone off(遮断する)。全部「余計な部分を切り落とす」。日本語は「省略する」「端折る」「遮る」と別々。英語はcut+方向で全部カバー。はさみ1本で人生のいろんな場面を切り取る。cutは編集の動詞。人生は映像で、自分が編集者。", category: 'suggestion' },
    { daySlot: 27, japanese: 'ずっとそうだったんだ', english: [
        "all along",
        "turns out he knew all along -- never said a word",
        "she was right all along and I was too stubborn to admit it",
        "all along. the whole time. from the very beginning. -- 'along' is the preposition of duration. it stretches time into a line. 'I knew all along' = I knew from the start of the line to the end. the knowledge walked the entire path with me. it was there the whole journey. 'along' makes time feel like a road you walk. not a point. a road."
    ], context: "all alongは「最初からずっと」。alongは「沿って」。時間を道に見立てて「その道に沿ってずっと」。I knew all along(ずっと知ってた)=知識が道の最初から最後まで一緒に歩いてた。come along(一緒に来る)、go along with(従う)、get along(仲良くする)。全部「一緒に沿って進む」イメージ。alongは並走。何かの横を一緒に歩く。英語は時間を歩く旅として表現する。", category: 'filler' },
    { daySlot: 27, japanese: '想像を超えてた', english: [
        "beyond my expectations",
        "that was beyond anything I could've imagined -- blown away",
        "it went beyond good, beyond great, into a whole different category",
        "beyond. past the limit. past the line. past the edge. 'beyond belief' = I can't believe it, my belief stops here and this thing is further. 'beyond repair' = too broken, repair can't reach that far. 'beyond me' = I can't understand, my comprehension stops here. 'beyond' draws a line and says 'this is on the other side.' it's the preposition of unreachable things."
    ], context: "beyondは「向こう側」。beyond belief(信じられないほど=信念の向こう側)、beyond repair(修理不能=修理の向こう側)、beyond me(俺には理解不能=俺の能力の向こう側)。全部「限界線の外」。日本語の「超える」は動詞。英語のbeyondは前置詞。超えた「結果の場所」を指す。超える動作じゃなくて、超えた先の位置。英語は超越を場所として扱う。到達点じゃなくて、到達できない点。", category: 'reaction' },
    { daySlot: 27, japanese: '大事なとこ、ゆっくり言うよね', english: [
        "slow down for impact",
        "notice how people slow way down right before the punchline?",
        "speed up for the boring parts, slow down for the killer line",
        "fast fast fast fast... SLOW. that's how English speakers deliver a point. all the context, the buildup, the background -- speed. then the key word -- brake. decelerate. the listener's brain goes 'wait, why did they slow down?' and pays extra attention. speed change IS emphasis. you don't need to yell. you just need to change your rhythm. silence's cousin is slowness."
    ], context: "英語のスピーチは速度変化で強調する。前振りは速く、キーワードはゆっくり。速い→遅いの変化で聞き手の注意を引く。日本語のプレゼンも同じテクニックはあるけど、英語のほうが速度差が大きい。ラップと同じ原理。Eminemが速いパートの後に1語だけゆっくり言う。そこがパンチライン。速度は句読点の一種。速い=カンマ。遅い=ピリオド。口が句読点を打つ。", category: 'opinion' },
    { daySlot: 27, japanese: '覚えてる？前にも言ったやつ', english: [
        "remember earlier",
        "remember what I said earlier? yeah, that -- it's happening again",
        "callback to what we were talkin' about -- told you so",
        "remember what I said twenty minutes ago? about the thing? yeah. THAT. -- callbacks are the glue of conversation. you reference something from earlier and the listener goes 'oh yeah!' instant connection. comedians use callbacks as their strongest tool. the first mention plants the seed. the callback harvests the laugh. it rewards people for paying attention. memory becomes humor."
    ], context: "コールバック(前の話を引用する)は会話の最強武器。さっき言ったネタをもう一度出すと、聞き手が「あ、あれ!」となる。お笑いの伏線回収と同じ。英語の会話でremember what I said about...?(さっき言ったの覚えてる?)と前の話を拾うとコネクションが生まれる。日本語の「さっきの話だけどさ」と同じ。でも英語はこれを意識的にやる。callback = 記憶を報酬にする技術。聞いてた人だけ笑える。", category: 'filler' },
    { daySlot: 27, japanese: 'スポーツで全部例えるよね英語', english: [
        "ball's in your court",
        "ball's in your court now -- your move, not mine",
        "we need a game plan, a home run, and a slam dunk -- all by Friday",
        "drop the ball. step up to the plate. hit a home run. move the goalposts. ball's in your court. the whole nine yards. down to the wire. -- English uses sports metaphors for EVERYTHING. business meetings are games. relationships are matches. life is a tournament. Japanese does this too but with martial arts (一本を取る). English does it with ball sports. two cultures, two playing fields."
    ], context: "英語は日常をスポーツで表現する。ball's in your court(次はお前の番=テニス)、step up to the plate(責任を取る=野球)、drop the ball(失敗する=ボール落とした)、move the goalposts(ルールを変える=サッカー)。ビジネスでも恋愛でもスポーツ用語。日本語は武道(一本取る、気合)や戦争(戦略、攻略)。英語はチームスポーツ、日本語は個人技の比喩が多い。文化が選ぶスポーツが比喩に出る。", category: 'opinion' },
    { daySlot: 27, japanese: 'ダメ元で聞いてみよう', english: [
        "worth a shot",
        "it's worth a shot -- worst case they say no, right?",
        "might as well try, it's not like we got anything to lose",
        "worth a shot. worth a try. worth asking. -- 'worth' is the cost-benefit calculator in one word. 'is it worth it?' = does the benefit exceed the cost? 'worth a shot' = the cost of trying is low enough that even a small chance of success makes it worthwhile. Japanese goes ダメ元 = assuming failure as the baseline. English goes 'worth a shot' = calculating ROI. pessimism vs economics."
    ], context: "worth a shotは「試す価値がある」。worthは費用対効果の計算機。Is it worth it?(それだけの価値ある?)。日本語の「ダメ元」は「ダメが元(デフォルト)」=失敗前提。英語のworth a shotは「コストが低い(shot=1発)からやってみろ」=投資判断。同じ「とりあえずやる」でも、日本語は悲観(どうせダメ)、英語は経済(コスト低い)。行動の理由付けが文化で違う。", category: 'suggestion' },

    // ── Day 28 ──
    { daySlot: 28, japanese: '提案なんだけど、行ったほうがいいよ', english: [
        "I suggest he go",
        "I suggest he go -- not 'goes,' go -- yeah, weird grammar",
        "the boss insisted that everyone be there by nine, no exceptions",
        "I suggest he GO. not 'he goes.' GO. base form. no 's.' this is the subjunctive mood. English's ghost grammar. it rarely appears, but when it does, it sounds wrong to non-native ears. 'I insist he BE there.' 'they demanded she LEAVE.' the verb strips down to its naked form. no tense, no agreement. pure action. grammar's version of going commando."
    ], context: "仮定法現在(subjunctive)。I suggest he go(彼が行くことを提案する)。goesじゃなくてgo。三人称なのにsが付かない。提案・要求・命令の動詞の後ろでは動詞が原形になる。I insist she be there(彼女がそこにいることを要求する)。isじゃなくてbe。英語のゴースト文法。知らないと「なんでsないの?」ってなる。日本語にはない概念。英語でも消えかけてるけど、ビジネス英語ではまだ現役。フォーマルの亡霊。", category: 'suggestion' },
    { daySlot: 28, japanese: 'こんなの見たことない', english: [
        "never have I seen",
        "never have I seen anything like this -- it's insane",
        "rarely do I say this, but that was genuinely incredible",
        "never have I seen such a thing. -- notice the word order? 'never have I' not 'I have never.' the subject and verb SWAPPED. when you start a sentence with a negative (never, rarely, seldom, not only), English flips the order for dramatic effect. it sounds Shakespearean. old-fashioned. powerful. it's the grammar of speeches, not conversations. you save it for when you mean it."
    ], context: "否定倒置。Never have I seen(一度も見たことがない)。普通はI have never seenだけど、neverを文頭に出すとhave+主語に倒置する。Rarely do I complain(滅多に文句は言わない)。Not only did he lie(嘘をついたどころか)。否定語が文頭に来ると主語と動詞がひっくり返る。日本語にはない構造。英語のドラマティック装置。演説やスピーチで使う。日常会話で使うと「なんか急にカッコつけた?」ってなる。使う場所を選ぶ文法。", category: 'reaction' },
    { daySlot: 28, japanese: 'もう少しだけ待って', english: [
        "hold off for a bit",
        "can you hold off on that for a sec? I need more time",
        "hold on to that thought -- don't let go, just hold it",
        "hold off. hold on. hold back. hold up. hold out. -- 'hold' plus direction = five kinds of resistance. hold off = delay (keep distance). hold on = wait (maintain grip). hold back = restrain (keep from advancing). hold up = delay/rob (stop motion). hold out = endure (maintain until empty). English grabs the concept of 'grip' and spins it in five directions. fingers wrapped around time."
    ], context: "holdの句動詞。hold off(延期する=離して持つ)、hold on(待つ=つかんだまま)、hold back(抑える=後ろに持つ)、hold up(遅らせる/強盗する=上に持つ)、hold out(持ちこたえる=外に差し出す)。全部「つかむ」の方向が違うだけ。日本語は「待つ」「抑える」「耐える」と別々の動詞。英語はhold+方向で全部。握力1つで5つの人生場面に対応する。holdは指の多機能ツール。", category: 'request' },
    { daySlot: 28, japanese: '準備しておいて', english: [
        "set it up",
        "can you set everything up before I get there?",
        "just set it aside for now and we'll deal with it later",
        "set up a meeting. set off an alarm. set back progress. set aside time. set someone straight. -- 'set' is the verb of placement. but WHERE you place it changes everything. set up = arrange. set off = trigger. set back = reverse. set aside = reserve. set straight = correct. same hand motion, five different consequences. 'set' is a chess piece -- the move depends on the square."
    ], context: "setの句動詞。set up(設定/準備する)、set off(出発する/作動させる)、set back(後退させる)、set aside(取っておく)、set in(始まる=悪いこと)。全部「置く」の方向が違う。up=立てる、off=離す、back=戻す、aside=横へ。日本語は「準備する」「出発する」「後退する」と全部別。英語はset+方向。何かを「置く」ことで状況をコントロールする。set=配置の動詞。世界は碁盤で、setは石を置く行為。", category: 'request' },
    { daySlot: 28, japanese: '壁の中にいる感じ', english: [
        "within these walls",
        "within these walls, you can say whatever you want",
        "the answer lies within -- sounds deep but it's literally inside",
        "within. without. two medieval words that somehow survived. 'within' = inside. 'without' = outside/lacking. 'within these walls' sounds like a castle. 'without warning' sounds like a battle. both words carry stone-cold ancient energy. modern English uses 'inside' and 'outside.' but when you want gravity, when you want WEIGHT, you reach for 'within' and 'without.' they're the formal grandfather of 'in' and 'out.'"
    ], context: "withinとwithoutは古い英語の生き残り。within(〜の中に)はinsideのフォーマル版。without(〜なしに)はwithout warningのように「欠如」を表す。within my reach(手の届く範囲内)、within 5 minutes(5分以内)。日本語の「以内」に近い。withoutはwith+out(一緒に+外)=「一緒にいたものが外にある」=「ない」。古英語の構造が現代まで残ってる。英語の化石。使うだけで文に重みが出る。", category: 'opinion' },
    { daySlot: 28, japanese: '俺とお前の間でしょ、2人と3人は違う', english: [
        "between us two",
        "this stays between us, I mean it -- nobody else needs to know",
        "it's between you and me, not among the whole team",
        "between and among. both mean 'in the middle of.' but between divides: between you and me, between two choices. among mixes: among friends, among the crowd. between sees individuals. among sees a group. 'between us' = we are two distinct people sharing a secret. 'among us' = we are a group and the secret lives inside the group. borders vs blending."
    ], context: "betweenは「2者の間」、amongは「3者以上の中」...が教科書のルール。でも実際はbetween three countries(3国間)も普通に使う。本当の差は「個別認識」。between = 1人1人が見えてる。among = 集団としてまとまってる。between us(俺たちの間)は個人同士。among friends(友人の中で)は集団。日本語は「〜の間」で両方カバー。英語は「個人を見てるか、集団を見てるか」で前置詞が変わる。視線の解像度。", category: 'filler' },
    { daySlot: 28, japanese: '静かに言うほうが怖い', english: [
        "whisper to intimidate",
        "she didn't yell -- she whispered, and that was way scarier",
        "the quieter the voice, the bigger the threat -- classic power move",
        "I need you to listen very carefully. -- whispered. slow. every word articulated. that's terrifying. because yelling is emotional. it means you've lost control. but whispering? whispering means you're so in control that you don't need volume. the message is a bullet, not a bomb. bombs are loud and messy. bullets are quiet and precise. the quietest person in the room is usually the most dangerous."
    ], context: "英語で怒りを囁きで表現すると最も怖い。叫ぶ=感情的=コントロール失ってる。囁く=冷静=完全にコントロールしてる。映画の悪役はいつも静かに話す。I will find you. And I will...(Liam Neeson)。日本語でも「静かな怒り」は怖いけど、英語圏のほうがこの技術を意識的に使う。声のボリュームは感情の温度計。大きい=熱い。小さい=冷たい。冷たい怒りのほうが質量がある。", category: 'opinion' },
    { daySlot: 28, japanese: 'ブチギレ寸前', english: [
        "about to blow up",
        "I'm about to blow up -- one more thing and I'm done",
        "she was boiling inside, you could see the steam comin' off her",
        "blow up. boil over. let off steam. blow a fuse. lose it. snap. explode. -- English anger is a PRESSURE COOKER. the emotion builds like steam. the container (you) tries to hold it. eventually the pressure wins. you blow up. explode. pop. the lid comes off. anger in English is always a container-under-pressure story. Japanese goes キレる (snap). one clean break. English goes BOOM. messy explosion."
    ], context: "英語は怒り=圧力容器。blow up(爆発する)、boil over(沸騰して溢れる)、let off steam(蒸気を抜く)、blow a fuse(ヒューズが飛ぶ)。全部「内圧が限界を超える」イメージ。日本語の「キレる」は糸が切れる(一瞬)。英語は圧力が徐々に上がって爆発する(プロセス)。日本語の怒りは瞬間。英語の怒りは蓄積。だからEnglishにはcool down(冷まして圧力を下げる)がある。温度管理。", category: 'reaction' },
    { daySlot: 28, japanese: 'ちょっと話それるけど', english: [
        "that's interesting but",
        "that's interesting, but can we circle back to the main point?",
        "I hear you, but I think we're gettin' off track here",
        "that's interesting, but... -- the softest redirect in English. you validate them ('interesting') then change direction ('but'). it's the conversational steering wheel. you don't slam the brakes. you gently turn. 'that's a good point, however...' 'I hear what you're saying, on the other hand...' English has a whole toolkit for changing topics without making the other person feel dismissed."
    ], context: "方向転換フレーズ。That's interesting, but...(面白いね、でも...)で相手を認めてから話題を変える。Can we circle back?(元の話に戻れる?)は「今の話は横道」宣言。Let's table that(それは後で)は「今は扱わない」宣言。日本語は「ところで」「それはそうと」。英語はもっとクッションを入れる。相手のメンツを守りながら方向を変える。ハンドル操作が滑らか。急カーブは事故になる。", category: 'suggestion' },
    { daySlot: 28, japanese: '食べ物で愛情表現するよね', english: [
        "food is love",
        "in English, cookin' for someone is basically saying I love you",
        "the way to someone's heart is through their stomach -- it's literal",
        "honey. sugar. sweetie. pumpkin. cupcake. muffin. -- English endearments are 80% food. you call your loved ones edible things. sweet = loveable. bitter = resentful. sour = bad mood. salty = angry. the entire emotional spectrum is seasoned. Japanese does 甘い (sweet) for romantic. but English puts the whole menu on the table. your partner is a snack. literally."
    ], context: "英語は愛情を食べ物で表現する。honey(蜂蜜=あなた)、sugar(砂糖=あなた)、sweetie(甘いもの=あなた)、cupcake(カップケーキ=あなた)。恋人を全部食べ物で呼ぶ。sweet(甘い=優しい)、bitter(苦い=恨み)、salty(塩辛い=怒ってる)。感情が味覚。日本語は「甘い」を「考えが甘い」と使うけど、英語ほど食べ物愛称は多くない。英語圏の愛は胃袋経由。food=love方程式。", category: 'opinion' },

    // ── Day 29 ──
    { daySlot: 29, japanese: 'え、何したって？', english: [
        "she did WHAT?",
        "wait, he said WHAT? to WHO? where? WHEN?",
        "she went WHERE? with HIM? are you kidding me right now?",
        "she did WHAT?! -- echo questions. you heard them. you understood them. but your brain refused to process it. so you repeat the sentence but replace the shocking part with a screaming WH-word. 'she married WHO?' 'they went WHERE?' the WH-word is a spotlight on the part that broke your brain. it's not a question. it's an emotional error message. 404: reality not found."
    ], context: "エコー疑問文。She married WHO?(彼女、誰と結婚したの?!)。聞こえたけど信じられない部分をWH語で叫ぶ。普通の疑問文はWH語が文頭に来る(Who did she marry?)。エコー疑問文はWH語が元の位置のまま(She married WHO?)。語順を変えないのがポイント。聞こえた文をそのまま繰り返して、ショックの箇所だけ大文字にする。日本語の「え、誰と!?」と同じ反射。驚きの即時反応。文法を考える暇がない。", category: 'reaction' },
    { daySlot: 29, japanese: 'タバコやめたの？ vs 吸いに行ったの？', english: [
        "stopped smoking",
        "I stopped smokin' -- not 'stopped to smoke,' big difference",
        "she stopped to talk means something completely different from she stopped talking",
        "I stopped smoking. vs I stopped to smoke. same words. one letter different (-ing vs to). completely opposite meanings. 'stopped smoking' = quit the habit. 'stopped to smoke' = paused in order to smoke. -ing = the activity you quit. 'to' = the purpose of stopping. English hides opposite meanings in almost-identical structures. it's a trap. a grammatical landmine."
    ], context: "動名詞 vs 不定詞。stop smoking(タバコをやめた)とstop to smoke(吸うために立ち止まった)。-ingは「その行為をやめる」。toは「その目的のために止まる」。remember to call(電話するのを覚えてる=未来)、remember calling(電話したのを覚えてる=過去)。try to open(開けようとする=努力)、try opening(開けてみる=実験)。同じ動詞でも後ろが-ingかtoかで時間の方向が変わる。地雷原。", category: 'opinion' },
    { daySlot: 29, japanese: 'なるほど、つまりこういうことか', english: [
        "figure it out",
        "took me a while but I finally figured it out on my own",
        "once you figure out the pattern, everything clicks",
        "figure out. figure in. go figure. figure of speech. -- 'figure' originally meant 'shape' or 'form.' figuring something out = shaping the answer in your mind. your brain is a sculptor. the answer is the statue. you chip away confusion until the shape appears. 'I can't figure it out' = the shape won't emerge. the clay won't cooperate. your mental hands keep slipping."
    ], context: "figure outは「形を見出す=理解する」。figureの元の意味は「形」。頭の中で情報の形を作る=理解する。I can't figure it out(わからない=形が見えない)。figure in(計算に入れる)、go figure(わかるもんか)、figure of speech(表現技法=言葉の形)。日本語は「わかる」(分かる=分ける)。英語は「形を見る」。理解の比喩が違う。日本語は分解、英語は造形。解体 vs 建設。", category: 'reaction' },
    { daySlot: 29, japanese: 'いつも文句言ってるよね', english: [
        "always picking on me",
        "why are you always pickin' on me? what did I do?",
        "stop bein' so picky -- not everything has to be perfect",
        "pick on someone. pick up a skill. pick apart an argument. pick out the best one. -- 'pick' is a precision tool. you don't grab, you PICK. one item, carefully selected. picking on someone = selecting one person for targeting. picky = too selective. pick apart = disassemble piece by piece. 'pick' is the verb of precision. the tweezer of English."
    ], context: "pickは「つまむ」=精密な選択。pick on(いじめる=1人を選んで狙う)、pick up(拾う/覚える/ナンパする)、pick apart(粗探しする=1つずつバラす)、pick out(選び出す)、picky(うるさい=選びすぎ)。全部「指でつまんで選ぶ」動作。日本語の「選ぶ」は大きい動作。英語のpickは指先の動作。繊細。小さい動きで大きな意味を持つ。ピンセットの動詞。", category: 'shutdown' },
    { daySlot: 29, japanese: '格が違う', english: [
        "on another level",
        "that was on another level -- above and beyond anything I've seen",
        "she's above average, above reproach, above it all",
        "above average. above suspicion. above the law. above and beyond. -- 'above' in English is hierarchical. it's not just physically higher -- it's morally higher, socially higher, qualitatively higher. 'above' = better than. 'below' = worse than. 'above average' = better than normal. 'below standard' = not good enough. English stacks quality vertically. the higher you are, the better you are."
    ], context: "above/belowは物理的な上下だけじゃなく品質の上下。above average(平均以上)、below standard(基準以下)、above suspicion(疑いの余地なし=疑いの上にいる)。英語は品質を垂直に配置する。日本語も「以上/以下」と同じだけど、英語のaboveは「高い場所から見下ろす余裕」が含まれてる。above it all(全部の上にいる=超然としてる)。高さ=地位=品質。英語のY軸はいつも忙しい。", category: 'opinion' },
    { daySlot: 29, japanese: '全員に共通してる', english: [
        "across the board",
        "the changes apply across the board -- no exceptions",
        "we cut costs across the board and it came across wrong",
        "across the board. come across. get across. run across. -- 'across' sweeps horizontally. 'across the board' = covering every category (from a game board). 'come across' = encounter while crossing. 'get across' = deliver a message to the other side. 'across' is the horizontal equivalent of 'through.' 'through' penetrates depth. 'across' covers breadth. width vs depth."
    ], context: "acrossは「横断」。across the board(全面的に=盤面を横切って)、come across(出くわす=横切ったら会った)、get across(伝える=向こう岸に届ける)、run across(偶然見つける)。throughは「貫通」(縦方向)、acrossは「横断」(横方向)。同じ「渡る」でもthrough a forest(森を突っ切る)は深さ、across the field(野原を横切る)は広さ。英語は移動の方向で体験の質感を変える。", category: 'filler' },
    { daySlot: 29, japanese: 'いや、ないない、ないです', english: [
        "no no no",
        "no no no, that's not what I meant -- let me explain",
        "nonono wait, I take it back, that came out completely wrong",
        "no. no no. no no no. nonononono. -- repetition in English isn't just emphasis. it's escalation. one 'no' = answer. two 'no's = correction. three 'no's = panic. four+ = system failure. the same word, repeated, changes meaning purely through quantity. 'yeah yeah yeah' = I'm bored of agreeing. 'wait wait wait' = something just happened. repetition is English's volume knob for urgency."
    ], context: "英語は同じ単語の繰り返しで緊急度を表す。no(1回)=通常の否定。no no(2回)=訂正。no no no(3回)=パニック。yeah yeah(2回)=もうわかった(飽きてる)。wait wait wait(3回)=ストップ!何か起きた!。繰り返すほど感情が上がる。日本語も「いやいやいや」と同じことをする。でも英語はイントネーションの変化も加わる。各noの音程が上がっていくと緊急度が上がる。量+音程=感情。", category: 'reaction' },
    { daySlot: 29, japanese: 'しっかりしろ', english: [
        "get a grip",
        "get a grip on yourself -- you're losin' it right now",
        "I'm tryin' to get a grip on the situation but it keeps slipping",
        "get a grip. lose your grip. have a firm grasp. it slipped through my fingers. -- control in English is GRIP. your hand, wrapped around the situation. tight grip = in control. loose grip = losing it. 'grasp the concept' = grab it with your brain-hands. 'it slipped away' = your brain-hands couldn't hold on. control is a physical act of squeezing. let go and everything falls."
    ], context: "英語はコントロール=握力。get a grip(しっかりしろ=握れ)、lose your grip(コントロールを失う=握れなくなる)、grasp the concept(概念を握る=理解する)、slip through my fingers(指をすり抜ける=逃す)。全部「手で握る」比喩。日本語は「把握する」(握る)と同じだけど、英語ほど日常的に使わない。英語は制御を手の筋力として体験する。握力=支配力。手を開いたら全部落ちる。", category: 'shutdown' },
    { daySlot: 29, japanese: 'まあそれぞれだよね', english: [
        "agree to disagree",
        "let's just agree to disagree -- we're not gonna change each other's minds",
        "I respect your opinion even though I think it's completely wrong",
        "let's agree to disagree. -- the most civilized sentence in English. it says 'we are both right in our own ways and I'm choosing peace over victory.' it doesn't resolve the conflict. it files it under 'unsolvable' and moves on. Japanese goes それぞれ (each person is each person). descriptive. English goes 'agree to disagree.' contractual. it's a verbal ceasefire. a handshake between enemies."
    ], context: "agree to disagreeは「不一致に合意する」。反対意見のまま和解する契約。日本語の「それぞれだよね」は状態の描写。英語は契約の締結。agreeは動詞=行動。「同意しないことに同意する」は論理的に矛盾してるけど、社会的には完璧な解決策。議論を終わらせるための魔法の公式。日本語は「まあいいか」で流す。英語は「正式に不一致を認める」。流す vs 認める。", category: 'suggestion' },

    { daySlot: 29, japanese: '言い方を変えると', english: [
        "let me put it this way",
        "let me put it this way -- imagine you're the one in that situation",
        "OK lemme rephrase that so it actually makes sense this time",
        "let me put it this way. PUT it. like I'm placing the idea on a different shelf. moving it from the confusing shelf to the clear shelf. 'put it this way' = same idea, different packaging. same product, new box. I didn't change the content. I changed the delivery. and sometimes that's all people need. not new information. just a better container for the old information."
    ], context: "put it this wayは「こう置いてみると」=「言い方を変えると」。putは「置く」。アイデアを別の場所に置き直す。同じ内容を違う角度から提示する。日本語の「つまり」は圧縮。英語のlet me put it this wayは再配置。情報を圧縮するんじゃなくて、別の棚に移す。内容は同じ、位置が変わる。聞き手が見やすい場所にアイデアを引っ越す。コミュニケーション=家具の配置換え。", category: 'suggestion' },

    // ── Day 30 ──
    { daySlot: 30, japanese: 'それだけじゃなくて', english: [
        "not only but also",
        "not only was it late, but it was also wrong -- double fail",
        "not only did he forget, but he also lied about forgetting",
        "not only did he lie, BUT he ALSO blamed someone else. -- this structure is a one-two punch. the first hit (not only) says 'this alone would be bad enough.' the second hit (but also) says 'oh but WAIT, there's MORE.' it escalates. each half feeds the other. Japanese does it with だけでなく...も. but the English version inverts the first clause (not only DID he) for dramatic effect. drama built into the grammar."
    ], context: "not only...but also構文は「これだけでも十分なのに、さらに」のエスカレーション装置。Not only did he lie, but he also denied it(嘘をついただけでなく、否定までした)。not onlyの後に倒置が起きる(did he)。日本語の「〜だけでなく〜も」と同じだけど、英語は倒置というドラマチック演出が付く。前半で驚かせて後半で追い打ち。1-2パンチの文法。", category: 'opinion' },
    { daySlot: 30, japanese: '本当に欲しいのは', english: [
        "what I really want",
        "what I really want is just some peace and quiet, honestly",
        "what matters isn't the money -- it's the freedom",
        "what I want is freedom. what matters is the process. what we need is time. -- pseudo-cleft. you take a normal sentence (I want freedom) and wrap the subject in a 'what' clause. why? because it builds SUSPENSE. 'what I want is...' -- the listener is waiting. what? WHAT DO YOU WANT? then: freedom. boom. delivery with a drumroll built into the grammar."
    ], context: "擬似分裂文(pseudo-cleft)。What I want is freedom(俺が欲しいのは自由)。普通に言えばI want freedom。でもwhat I want is...と言うと前半がドラムロールになる。聞き手が「何?」と待つ。そしてfreedom。着地の衝撃が強まる。日本語の「俺が欲しいのは〜だ」と同じ。前半で期待させて後半で答える。英語はこの構造で日常的にプレゼンする。every presentation starts with 'what we need is...'。ビジネスの基本技。", category: 'opinion' },
    { daySlot: 30, japanese: '今日はここまでにしよう', english: [
        "call it a day",
        "let's call it a day -- I'm runnin' on empty",
        "I think we should call it a night, it's past midnight",
        "call it a day. call it off. call someone out. call it quits. -- 'call' isn't about phones. it's about NAMING. 'call it a day' = I'm naming this moment 'the end.' 'call it off' = I'm naming this event 'cancelled.' 'call someone out' = I'm naming their behavior 'wrong.' in English, naming IS action. the moment you call something, it becomes that thing. words create reality."
    ], context: "callは「呼ぶ」=「名付ける」=「決める」。call it a day(今日はここまでにする=この瞬間を「1日の終わり」と名付ける)。call it off(中止する=「中止」と名付ける)。call someone out(批判する=「間違い」と名付ける)。call it quits(やめる=「終了」と宣言する)。英語では名前をつけることが現実を作る。名付け=創造。聖書のLet there be light(光あれ)と同じ構造。言葉が世界を作る言語。", category: 'suggestion' },
    { daySlot: 30, japanese: '確認しに来ただけ', english: [
        "just checking in",
        "hey, just checkin' in -- how's everything goin'?",
        "I'll check it out and check back with you later",
        "check in. check out. check up on. check back. -- 'check' is the verification verb. check in = verify arrival. check out = verify departure (or admire something). check up on = verify someone's status (caring or suspicious, your pick). 'check' comes from chess. checkmate. you're verifying the king's position. every 'check' in English is a tiny chess move. strategic verification."
    ], context: "checkの句動詞。check in(到着確認/様子を伺う)、check out(退出/調べる/見てみる)、check up on(確認する=監視or心配)、check back(後で戻って確認)。全部「確認」だけど方向が違う。in=入る確認、out=出る確認、up on=上から見る確認。checkの語源はチェス。checkmate(王手)。相手の王を確認する。英語の確認行為は全部チェスの一手。戦略的に相手の状態を把握する。", category: 'filler' },
    { daySlot: 30, japanese: '適当にやっといて', english: [
        "work around it",
        "just work around it for now -- we'll fix it properly later",
        "let's fool around a bit before gettin' serious",
        "work around. come around. fool around. get around to. -- 'around' is the detour preposition. work around = find a detour past the problem. come around = arrive eventually after circling. fool around = waste time going in circles. get around to = eventually reach the task after delays. 'around' is never direct. always circular. the scenic route of prepositions."
    ], context: "aroundは「回る」=「迂回」。work around(回避策=問題を回って解決)、come around(最終的に来る=ぐるっと回って到着)、fool around(ふざける=目的なく回る)、get around to(ようやく取りかかる=回り道した後にたどり着く)。全部「直線じゃなくて円を描く」。日本語は「適当に」「ようやく」と曖昧。英語はaroundで「遠回りした」ことを正直に報告する。回り道の告白。", category: 'request' },
    { daySlot: 30, japanese: 'もう離すよ、持ってて', english: [
        "put it away",
        "just put it away and we'll deal with it tomorrow",
        "I need to put this behind me and move on",
        "put away. give away. throw away. take away. right away. far away. -- 'away' is distance. physical or emotional. 'put away' = store at a distance. 'give away' = transfer to distance. 'right away' = zero distance from now (immediately). the direction of 'away' is always FROM HERE. from the speaker. from the present. 'away' points to everywhere that isn't here and now."
    ], context: "awayは「ここから離れて」。put away(しまう=離して置く)、give away(あげる/ばらす=離して渡す)、throw away(捨てる=離して投げる)、right away(すぐに=距離ゼロ=今すぐ)、far away(遠く)。全部「ここからの距離」。日本語は「しまう」「捨てる」「すぐ」と別々。英語はaway1語で「距離」の概念を横断する。away=「ここじゃない場所」。場所の否定。", category: 'filler' },
    { daySlot: 30, japanese: '3つでまとめろ', english: [
        "rule of three",
        "life, liberty, and the pursuit of happiness -- see? always three",
        "say it once, it's a comment. twice, a coincidence. three times, a pattern",
        "blood, sweat, and tears. stop, look, and listen. friends, Romans, countrymen. -- English loves three. not two, not four. three. the first sets up. the second builds. the third LANDS. it's the rhythm of persuasion. da-da-DAH. speeches, jokes, slogans -- all built on three. two feels incomplete. four feels bloated. three is the Goldilocks number. the rhythm your ear was born expecting."
    ], context: "英語の3の法則(Rule of Three)。スピーチ、ジョーク、広告、全部3つで構成される。government of the people, by the people, for the people(リンカーン)。location, location, location(不動産)。stop, drop, and roll(火災)。3つ目が最も強く着地する。1つ目=提示、2つ目=発展、3つ目=結論。日本語にも「松竹梅」「序破急」と3の文化はあるけど、英語のスピーチは3に執着する。リズムが法律。", category: 'opinion' },
    { daySlot: 30, japanese: '断り方が下手なんだよ', english: [
        "I'm gonna have to pass",
        "I appreciate the offer but I'm gonna have to pass on this one",
        "I'd love to but I really can't -- rain check?",
        "I'm gonna have to pass. I appreciate the offer. maybe next time. rain check? I'd love to but... -- English has an ART of saying no without saying 'no.' the word 'no' almost never appears in a polite rejection. instead, you build a fortress of soft alternatives. 'not this time.' 'I can't make it.' 'I wish I could.' the goal: reject without the rejection word. verbal origami."
    ], context: "英語の断り方はnoを使わない。I'm gonna have to pass(パスしなきゃ)、I appreciate the offer(ありがたいけど)、maybe next time(次回ね)、rain check(また今度ね)。全部noの言い換え。直接no thank youは使えるけど、もっと柔らかく断りたいときは5-10語に膨張する。日本語は「ちょっと...」で濁す。英語は「理由+代替案+感謝」のサンドイッチで断る。断りに手順がある。プロトコルの文化。", category: 'suggestion' },
    { daySlot: 30, japanese: '友達の前と上司の前で人格変わる', english: [
        "code-switching",
        "watch how fast my voice changes when my boss walks in",
        "I'm one person with friends and a completely different person at work",
        "hey what's up bro! -- 'good morning, I hope this email finds you well.' -- same person. same day. same brain. different audience = different English. casual register: contractions, slang, fragments. formal register: full sentences, hedging, Latin words. English speakers flip between registers like changing channels. Japanese has 敬語 levels. English has register levels. both are code-switching. both are exhausting."
    ], context: "コードスイッチング。友達: 'yo what's good' → 上司: 'Good morning, I trust you're well.' 同じ人が場面で言葉を切り替える。日本語は敬語/タメ口のスイッチ。英語はregister(レジスター)のスイッチ。カジュアル(短縮、スラング)とフォーマル(完全文、ラテン系語彙)。英語は動詞は変わらない(食べる→召し上がるみたいな変形がない)けど、語彙セット全体が入れ替わる。衣替えの言語。", category: 'opinion' },

    { daySlot: 30, japanese: '天気いいっすね', english: [
        "nice day isn't it",
        "gorgeous day, huh? -- feels like we should be outside",
        "can you believe this weather? it's like summer came early",
        "nice day, isn't it? beautiful weather we're having. can you believe this rain? -- weather talk is English's default screensaver. when there's nothing to say, the sky fills the gap. it's not information. nobody needs a weather report from the person standing next to them in the elevator. it's a protocol. 'I am human. you are human. let us acknowledge this through mutual cloud discussion.'"
    ], context: "天気の話は英語のデフォルトスクリーンセーバー。何も話すことがないときに天気が画面を埋める。Nice day, isn't it?は情報じゃない。横にいる人に天気予報する必要はない。でも沈黙は英語では死。天気=沈黙の穴埋め材料。日本語は「いい天気ですね」も使うけど、「お疲れ様です」のほうが頻出。英語はweather、日本語は疲労。社交の潤滑油の種類が違う。英語は空を見上げ、日本語は相手の体を気遣う。", category: 'filler' },

    // ── Day 31 ──
    { daySlot: 31, japanese: 'わかってきた', english: [
        "it turns out",
        "turns out I was wrong this whole time -- who knew?",
        "it turns out that everything I believed was based on bad info",
        "it turns out. it seems. it appears. it happened that. -- English has a collection of 'it' sentences where 'it' means nothing. 'it turns out' = reality rotated and showed a new face. 'it seems' = appearance suggests something. 'it happened that' = events arranged themselves. who is 'it'? nobody. nothing. 'it' is the narrator of reality. the invisible voice telling the story."
    ], context: "it節。it turns out(わかった=現実が回転した)、it seems(〜みたい=見た目がそう)、it appears(〜らしい=表面がそう)、it happened that(偶然〜した=出来事がそう配置した)。全部のitは何も指してない。天気のit(it's raining)と同じダミー。英語は「誰が?」に答えられないとき、itを主語にする。itは英語の匿名アカウント。責任者不明のときに出てくる幽霊主語。", category: 'filler' },
    { daySlot: 31, japanese: 'バレないように', english: [
        "so that nobody notices",
        "I did it quietly so that nobody would notice",
        "she left early so that she wouldn't have to deal with the drama",
        "I left early so that I wouldn't get caught. -- 'so that' = purpose clause. it answers 'why' by linking two events. I left (action) so that I wouldn't get caught (purpose). 'so that' is the bridge between what you did and why you did it. Japanese uses ように/ために. one structure. English uses 'so that' (purpose), 'in order to' (formal purpose), 'for fear of' (negative purpose). three bridges for one gap."
    ], context: "目的節。so that(〜するために)。I studied hard so that I could pass(受かるために頑張った)。in order to(〜するために=フォーマル)。for fear of(〜を恐れて=否定的目的)。日本語は「〜ために」「〜ように」。英語は目的の種類で表現を変える。so thatは結果重視。in order toは手段重視。for fear ofは回避重視。同じ「ために」でもモチベーションの方向が違う。前に進む目的と、後ろから逃げる目的。", category: 'filler' },
    { daySlot: 31, japanese: '頭おかしくなりそう', english: [
        "mind-blowing",
        "that was absolutely mind-blowing -- my brain needs a reboot",
        "blow my mind, blow your cover, blow a chance -- blow up everything",
        "blow my mind. blow up. blow off. blow over. blow away. -- 'blow' is wind as a verb. your mind is blown = wind scattered your thoughts. blow up = wind inflated until explosion. blow off = wind pushed it away (ignored). blow over = wind passed and calm returned. blow away = wind removed it entirely. English turns breathing into destruction. every exhale is potentially devastating."
    ], context: "blowは「息/風」が力になる。mind-blowing(頭が吹き飛ぶ=衝撃的)、blow up(爆発/怒る)、blow off(すっぽかす=風で吹き飛ばす)、blow over(収まる=風が通り過ぎる)、blow away(圧倒する=風で飛ばす)。全部「風の力」の方向が違う。日本語は「衝撃」「爆発」「すっぽかす」「収まる」と全部別。英語はblow+方向。息1つで5つの状況変化。呼吸が世界を動かす。", category: 'reaction' },
    { daySlot: 31, japanese: '最後まで付き合ってよ', english: [
        "stick with me",
        "just stick with me on this -- I promise it'll make sense",
        "stick around, stick to the plan, stick it out till the end",
        "stick with me. stick to the plan. stick around. stick it out. stick up for someone. -- 'stick' is adhesion. glue. staying power. 'stick with' = stay attached to a person. 'stick to' = stay attached to a plan. 'stick around' = don't un-stick yourself from this location. 'stick it out' = stay glued until the end. loyalty in English is expressed as GLUE. the strongest relationships are the stickiest ones."
    ], context: "stickは「くっつく」=「離れない」。stick with me(俺について来い=俺にくっつけ)、stick to the plan(計画を守れ=計画にくっつけ)、stick around(その辺にいろ=くっついたまま)、stick it out(最後までやれ=くっつき続けろ)。忠誠心=接着力。英語は「離れない」ことを「くっつく」で表現する。日本語の「付き合う」も「付く」が入ってる。両言語とも忠誠=接着。くっつき度=信頼度。", category: 'request' },
    { daySlot: 31, japanese: 'トンネルを抜けた vs 橋を渡った', english: [
        "through the tunnel",
        "we went through the tunnel, across the bridge, and into the unknown",
        "I pushed through the tough part and came out the other side",
        "through the tunnel. across the bridge. two different crossings. 'through' = you enter, you're surrounded, you exit. there's an inside. darkness. then light. 'across' = you stay on the surface. one side to the other. no interior. 'going through something' is painful because you're INSIDE it. 'getting across something' is about reaching the other side. through = immersion. across = transit."
    ], context: "throughとacrossの差。through the tunnel(トンネルを通って)=内部を移動。across the bridge(橋を渡って)=表面を移動。throughは「中に入って出る」体験。acrossは「上を横切る」体験。go through a crisis(危機の中を通る)は辛い。come across a problem(問題を横切る=出くわす)は偶然。throughは体験の深さ、acrossは体験の幅。前置詞で人生の通り方が変わる。", category: 'opinion' },
    { daySlot: 31, japanese: 'いつからか、ずっと', english: [
        "ever since then",
        "ever since that day, everything changed -- can't go back now",
        "whatever, whenever, wherever, whoever -- ever makes everything infinite",
        "ever since. forever. whatever. whenever. wherever. whoever. however. -- 'ever' is infinity in four letters. 'since' = from a point. 'ever since' = from that point to INFINITY. 'what' = something. 'whatever' = EVERYTHING. 'ever' takes any word and removes its limits. it's the mathematical infinity symbol turned into a suffix. stick it on any word and that word becomes endless."
    ], context: "everは「無限化」接尾辞。whatever(何でも=whatの無限化)、whenever(いつでも)、wherever(どこでも)、whoever(誰でも)。ever since(あれ以来ずっと=sinceの無限化)、forever(永遠に=forの無限化)。everは単語の制限を外すスイッチ。what→whatever。限定が無制限になる。日本語の「でも」(何でも、誰でも)と同じ機能。4文字で無限を作る。英語の∞記号。", category: 'filler' },
    { daySlot: 31, japanese: 'この沈黙が全てを語ってる', english: [
        "the silence says it all",
        "sometimes the silence says more than any words ever could",
        "the pause before the answer -- that's where the truth lives",
        "silence. the final tool. not a word. not a sound. nothing. and yet silence in English SPEAKS. 'the silence was deafening.' 'a pregnant pause.' 'the quiet said everything.' English, a language that fears silence, still acknowledges its power. silence is the nuclear option of communication. when words fail, when nothing else works, the absence of language becomes the loudest thing in the room."
    ], context: "沈黙は英語の最終兵器。英語は沈黙を怖がる言語(small talkで埋める)なのに、沈黙の力を認めてる。deafening silence(耳が聞こえなくなる沈黙)、pregnant pause(何かを孕んだ間)。言葉の不在が最大の存在感を持つ瞬間。310個の表現を学んだ最後に覚えておくこと: 一番強い英語は、何も言わないこと。言葉を知れば知るほど、沈黙の価値がわかる。知識のゴール=適切な沈黙。", category: 'opinion' },
    { daySlot: 31, japanese: 'とりあえずやってみよう', english: [
        "let's just start",
        "let's just start and figure it out as we go",
        "don't overthink it -- open your mouth and see what comes out",
        "let's just start. not 'let's perfectly prepare.' not 'let's study more.' just START. open your mouth. say something. get it wrong. say it again. get it less wrong. that's the method. three hundred expressions. ten patterns. thirty-one days. and the only thing between you and fluency is the willingness to sound stupid for a while. that's the price. it's worth paying."
    ], context: "310個の表現を31日で。ここまで来たらあとは口を開けるだけ。完璧を待つな、始めろ。get it wrong(間違える)→get it less wrong(マシになる)→get it right(合ってくる)。英語学習の全プロセスがgetで表現できる。get started(始める)、get going(進む)、get better(上達する)、get there(到達する)。getは変化の動詞。今の自分から次の自分へのget。さあ、始めよう。", category: 'suggestion' },
    { daySlot: 31, japanese: 'とにかく喋れ', english: [
        "anyway, I should go",
        "anyway, it's been real -- I should probably head out",
        "well, I think that's everything -- guess I'll wrap it up here",
        "anyway. well. so. right then. I should probably get going. -- closing a conversation in English is an ART. you can't just stop talking. you need exit words. 'anyway' = topic shift to departure. 'well' = I'm transitioning. 'so' = conclusion approaching. 'right then' = British goodbye. and then you say goodbye three more times before actually leaving. the English goodbye is a five-act play."
    ], context: "英語の会話の終わらせ方。anyway(ま、そろそろ)→well(えっと)→I should probably get going(そろそろ行かなきゃ)→it was nice talking to you(話せて良かった)→we should do this again(またやろう)→bye!(じゃあ!)。5段階。日本語は「じゃあね」で終わる。英語は別れの儀式が長い。特にイギリス人は「帰る」と言ってから30分いる。さよならの言い方にも文化が出る。始まりも終わりも、英語は儀式が好き。", category: 'filler' },
    { daySlot: 31, japanese: '300個で足りるの？足りるよ', english: [
        "three hundred is enough",
        "three hundred expressions and you're good -- trust the process",
        "three hundred chunked expressions beat ten thousand random vocab words",
        "three hundred. that's it. not three thousand. not ten thousand. three hundred chunks that you actually say, that map to your actual personality, in your actual conversations. quality over quantity. every single time. I know because I counted every one. and if you got this far, you're not a student anymore. you're a speaker. now go prove it."
    ], context: "310個で会話の全場面をカバーできる。10,000個の単語を暗記するより、310個のチャンクを自分のものにするほうが話せる。なぜ? 単語は部品。チャンクは完成品。完成品をそのまま口から出すほうが速い。300個の完成品 > 10,000個の部品。ここまで読んだあなたはもう生徒じゃない。話す人だ。あとは口を開けるだけ。最初の50回は恥ずかしい。51回目から魔法が始まる。", category: 'opinion' },


    // ============================================================
    // March 2026 -- 310 expressions across 31 days (10 per day)
    // ============================================================

    // -- Day 1: 朝の日常 (Morning routines) --
    { daySlot: 1, japanese: '目覚ましより先に起きちゃった', english: [
        "beat the alarm",
        "woke up before my alarm like some kinda psycho",
        "I woke up before the alarm went off and honestly I don't know what to do with this energy",
        "I woke up before the alarm. before. the alarm. that never happens. my body just decided 'hey let's be productive today' without consultin' me first. and now I'm just layin' here in the dark like... what do people even do at 5 AM? is this what motivated people feel like? I don't trust it. somethin's off."
    ], context: "beat the alarm は「目覚ましに勝った」。英語は目覚まし時計と自分の関係を「競争」で語る。beat=「打ち負かす」だから、起きることが勝利、寝坊が敗北。日本語は「より先に」で時間の前後関係だけど、英語はスポーツの試合にしちゃう。朝から戦ってる。", category: 'reaction', month: '2026-03' },
    { daySlot: 1, japanese: '顔洗わないと目が覚めない', english: [
        "gotta wash my face",
        "can't wake up till I splash some water on my face",
        "I'm not awake until cold water hits my face, that's just how it works",
        "I need to splash water on my face or I'm basically sleepwalkin' through the first hour of my day. it's like my brain has a boot sequence and cold water is the power button. no water, no boot. I've tried coffee first but that's just givin' fuel to a machine that hasn't turned on yet. water first. always water first."
    ], context: "splash water on my face は「顔に水をバシャッとかける」。splashは水が飛び散る音と動きが一語に入ってる。日本語の「洗う」は静かだけど、splashは暴力的。英語は朝の洗顔すらアクション映画にする。wake upも「上に起きる」で、意識が下から上に移動するイメージ。", category: 'reaction', month: '2026-03' },
    { daySlot: 1, japanese: '朝ごはん作るの面倒くさい', english: [
        "too lazy for breakfast",
        "makin' breakfast is too much effort this early",
        "I can't be bothered to cook breakfast when my brain's barely online",
        "makin' breakfast at 7 AM is askin' too much of me as a human being. you want me to crack eggs? operate a stove? make decisions about seasoning? at this hour? my brain is runnin' on like 15% battery. I'll have toast. toast is the only thing I trust myself with right now. one button. done."
    ], context: "can't be bothered は「面倒でやる気が出ない」。bother は「わざわざ〜する」の否定形。I can't be bothered to cook は「料理するほどの気力がない」。日本語の「面倒くさい」は感情だけど、英語は「わざわざ〜するに値しない」と損得勘定が入ってる。やるかやらないかを投資判断してる。", category: 'opinion', month: '2026-03' },
    { daySlot: 1, japanese: '今日何曜日だっけ', english: [
        "what day is it",
        "wait, what day is it? I genuinely don't know",
        "I woke up and had zero idea what day of the week it was",
        "what day is it. seriously. is it Wednesday? Thursday? I just woke up and my brain hasn't loaded the calendar app yet. every mornin' there's this three-second window where I don't know what day it is, what year it is, or who I am. and honestly? those three seconds are the most peaceful part of my day. then reality boots up and I'm like 'oh right. Tuesday.'"
    ], context: "what day is it は「今何曜日?」だけど、ここが面白い。日本語は「何曜日」と曜日を指定して聞く。英語は just what day で「日」だけ。文脈で曜日のことだとわかる。英語は最低限の情報で投げて、相手に補完させる。省エネ言語の極み。", category: 'filler', month: '2026-03' },
    { daySlot: 1, japanese: '寝癖やばい', english: [
        "bed head",
        "my bed head is out of control today",
        "I looked in the mirror and my hair was doin' its own thing entirely",
        "my hair woke up in a different timezone. I looked in the mirror and half of it was goin' left, the other half was reachin' for the ceiling, and one strand in the back was just pointin' straight out like an antenna pickin' up signals from another dimension. I tried water. I tried pattin' it down. it fought back. my hair has more personality in the mornin' than I do."
    ], context: "bed head は「寝癖」を一語で表す。bed(ベッド)+ head(頭)。枕で潰れた頭。英語はこういう合成語が天才的。morning breath(朝の口臭)、bedside(ベッドサイド)。2つの名詞をくっつけるだけで新しい概念が生まれる。日本語は「寝+癖」で同じことしてるけど、英語のほうが組み合わせ自由度が高い。", category: 'reaction', month: '2026-03' },
    { daySlot: 1, japanese: '二度寝の誘惑に負けた', english: [
        "went back to sleep",
        "the snooze button won again, I'm weak",
        "I told myself five more minutes and woke up an hour later",
        "I hit snooze. and then I hit it again. and again. and at some point I stopped hittin' snooze and just turned the alarm off entirely. and my brain was like 'we'll just rest our eyes for a sec' which is the biggest lie a human brain can tell itself. 'rest our eyes.' nobody in history has ever just rested their eyes. that's sleepin'. you slept. own it."
    ], context: "hit snooze は「スヌーズボタンを押す」。hit は「叩く」だけど、ボタンを押すのも hit。英語では打つ・叩く・押す・当たる、全部 hit 一語。日本語は「押す」「叩く」「打つ」と使い分けるけど、英語は「何かに force を加える」が全部 hit。雑だけど便利。", category: 'reaction', month: '2026-03' },
    { daySlot: 1, japanese: '歯磨きしながらスマホ見てる', english: [
        "scrollin' while brushin'",
        "brushin' my teeth and doomscrollin' at the same time, peak mornin'",
        "I can't even brush my teeth without checking my phone, it's a problem",
        "I'm standin' in front of the mirror, toothbrush in one hand, phone in the other, scrollin' through absolutely nothin' important. like, what am I gonna find at 7 AM that can't wait two minutes? nothin'. but my hand just grabs the phone automatically. it's muscle memory at this point. my thumb has its own agenda and I'm just along for the ride."
    ], context: "while は「〜しながら」。日本語は「〜しながら」で2つの動作を同時進行させる。英語も while で同じことするけど、面白いのは doomscrolling という造語。doom(破滅)+ scrolling(スクロール)=「意味もなくスマホを永遠にスクロールし続ける」。2020年代に生まれた言葉。英語は新しい行動が生まれると即座に名前をつける。名前がないと存在しない言語。", category: 'opinion', month: '2026-03' },
    { daySlot: 1, japanese: 'ゴミ出し忘れた', english: [
        "forgot the trash",
        "I forgot to take the trash out, again",
        "the garbage truck already came and I'm standin' here holdin' the bag like an idiot",
        "I forgot to take the trash out. again. and I can hear the truck leavin'. every single time. I put it by the door so I won't forget. I set a reminder. I even told myself last night 'tomorrow, trash, don't forget.' and what did I do? I forgot. my brain has a trash blind spot. it sees the bag, acknowledges the bag, and then just walks right past it. every week. without fail."
    ], context: "take the trash out で「ゴミを出す」。take out は「外に持っていく」。日本語の「出す」は方向が曖昧だけど、英語は take(持って)+ out(外に)と経路を明確にする。英語は移動する動作に必ず方向をつける。take in(中に入れる)、take away(持ち去る)、take back(返す)。動詞+方向で意味が変わる組み合わせシステム。", category: 'reaction', month: '2026-03' },
    { daySlot: 1, japanese: '電車の時間ギリギリ', english: [
        "gonna miss it",
        "I'm cuttin' it close, might miss my train",
        "I've got about ninety seconds to make this train and I'm still puttin' my shoes on",
        "I'm cuttin' it so close right now. my train leaves in like two minutes and I'm still at the door tryin' to decide if I need an umbrella. spoiler: I don't have time to decide. I'm just gonna run. and runnin' for a train in the mornin' is the most cardio I get all week. it's not exercise, it's panic. but it counts. I'm countin' it."
    ], context: "cuttin' it close は「ギリギリ」。cut it close で「際どいところを切り取る」イメージ。close は「近い」で、セーフとアウトの境界線に限りなく近いこと。日本語の「ギリギリ」は擬態語だけど、英語は cut(切る)という物理動作で表現する。ナイフで薄く切るように、余裕をゼロまで削ってる感覚。", category: 'reaction', month: '2026-03' },
    { daySlot: 1, japanese: '朝から元気な人が信じられない', english: [
        "mornin' people are aliens",
        "people who are cheerful in the mornin' scare me honestly",
        "I don't understand morning people, like how are you smiling at seven AM",
        "mornin' people freak me out. you ever met someone who wakes up at 6 AM and is just immediately happy? like, no warm-up period? no buffer zone between sleep and joy? they just open their eyes and choose happiness. meanwhile I'm over here needin' forty-five minutes and two cups of coffee before I can form a sentence. we're not the same species. we can't be."
    ], context: "morning people は「朝型の人」。people を後ろにつけるだけで「〜な人種」を作れる。cat people(猫派)、night people(夜型)、dog people(犬派)。日本語は「朝型の人」と修飾語が必要だけど、英語は名詞+people で一発。カテゴリ分けが速い。人間をタイプ別に分類するのが英語は得意。", category: 'opinion', month: '2026-03' },

    // -- Day 2: 買い物 (Shopping) --
    { daySlot: 2, japanese: 'これ、値段ついてないんですけど', english: [
        "no price tag",
        "there's no price on this -- how much is it?",
        "excuse me, this doesn't have a price tag, can you check for me?",
        "there's no price on this. and in my experience, when there's no price tag, it's either dirt cheap or terrifyingly expensive. there's no middle ground. it's either 'oh that's nothin'' or 'oh I need to sit down.' and I'm standin' here holdin' it tryin' to decide if I'm brave enough to ask. 'cause once they tell me, I gotta react. and I'm bad at hidin' sticker shock."
    ], context: "price tag は「値札」。tag は「札」で、名前を付ける小さいラベル。英語では name tag(名札)、dog tag(犬の認識票)、price tag(値札)。物に情報を貼り付ける文化。sticker shock は「値段を見てビックリする」。shock をつけることで、値段が身体的衝撃になる。お金の話を身体感覚で語るのが英語。", category: 'request', month: '2026-03' },
    { daySlot: 2, japanese: '見てるだけです', english: [
        "just browsin'",
        "I'm just browsin', no pressure",
        "I'm not looking for anything specific, just seeing what's out there",
        "just browsin'. and I know the second I say 'just browsin'' the sales person is supposed to back off. but some of 'em don't. they follow you. they hover. and then you gotta do that thing where you pretend to be interested in somethin' you don't want just to seem polite. I'm holdin' a candle I'll never buy just 'cause someone asked if I needed help."
    ], context: "just browsin' は買い物の魔法の呪文。browse は元々「草を食む」という意味。牛が草原をぶらぶら食べ歩く感じ。それが「店をぶらぶら見て回る」になった。just をつけて「ただ見てるだけ」と防御壁を張る。英語圏の店員は話しかけてくるから、この一言で「放っておいて」を丁寧に伝える。日本語の「見てるだけです」と機能は同じだけど、使用頻度が段違い。", category: 'shutdown', month: '2026-03' },
    { daySlot: 2, japanese: 'もうちょっと安くならない？', english: [
        "any cheaper?",
        "any chance you could knock a little off the price?",
        "is there any way to bring the price down a bit? I'm on a budget",
        "is there any way to get this a little cheaper? and I know askin' for a discount feels weird but you miss a hundred percent of the discounts you don't ask for. that's a quote. I just made it up. but it's true. the worst they can say is no. actually the worst they can say is 'no and please leave' but that's never happened. ...yet."
    ], context: "knock off は「値引きする」。knock(叩く)+ off(落とす)で、値段を叩いて落とすイメージ。Can you knock 10% off? で「10%引きにならない?」。英語は値引き交渉を物理的な動作で表現する。bring down(引き下げる)も同じ。値段は高い場所にあって、それを下に引っ張る。お金が上下に動く言語。", category: 'request', month: '2026-03' },
    { daySlot: 2, japanese: 'レジ混みすぎ', english: [
        "line's insane",
        "the checkout line is ridiculous right now",
        "I've been standin' in this line for ten minutes and it hasn't moved",
        "this line hasn't moved in ten minutes. ten. I've counted. and there's only like three people ahead of me which means somethin' is very wrong up front. someone's probably arguin' about a coupon. it's always a coupon. and I'm stuck here holdin' my three items thinkin' 'is this really worth it? can I just put these back and leave?' but I've already invested too much time. I'm committed now."
    ], context: "line は「列」。アメリカは line、イギリスは queue。同じ「並ぶ」でも国が違えば単語が違う。日本語の「レジ」は英語で checkout。register とも言うけど、checkout line が一番自然。check out は「確認して出る」で、お金を払って商品を持ち出すプロセス全体。日本語の「会計」より動きが見える。", category: 'reaction', month: '2026-03' },
    { daySlot: 2, japanese: 'ポイントカードお持ちですか、が毎回来る', english: [
        "the loyalty card question",
        "do I have a loyalty card? no. same as last time",
        "every single store asks if I have their rewards card and the answer is always no",
        "do you have our rewards card? no. do you want one? no. are you sure? yes I'm sure. this happens at every store. every single one. they all want me to sign up for their card and carry it around like I don't already have thirty cards I never use. my wallet is a graveyard of loyalty cards from 2019. I'm not addin' more. I'm loyal to nobody. I'm a free agent."
    ], context: "loyalty card は「ポイントカード」。loyalty は「忠誠心」。カードを持つこと=その店への忠誠を誓うこと、という発想。英語ではお客さんの loyalty(忠誠)を earn(獲得)する、build(築く)すると言う。買い物が主従関係になってる。日本語の「ポイントカード」は点数を貯めるだけだけど、英語は忠誠心の話をしてる。", category: 'reaction', month: '2026-03' },
    { daySlot: 2, japanese: '試着していいですか', english: [
        "can I try this on?",
        "mind if I try this on real quick?",
        "excuse me, is there a fitting room? I wanna try this on before I decide",
        "can I try this on? 'cause I've learned the hard way that 'it looks like it'll fit' and 'it actually fits' are two completely different things. especially with pants. pants are liars. they look fine on the hanger and then you put 'em on and suddenly you're a different shape than you were five minutes ago. the fittin' room is not optional. it's insurance."
    ], context: "try on は「試着する」。try(試す)+ on(身につける)。on がポイントで、服を体の上に乗せるイメージ。try on shoes(靴を試す)、try on a hat(帽子をかぶってみる)。put on(着る)の「お試し版」が try on。英語は着脱を on/off で管理する。put on(着る)、take off(脱ぐ)。服が体に乗ったり降りたりしてる。", category: 'request', month: '2026-03' },
    { daySlot: 2, japanese: '買うつもりなかったのに買っちゃった', english: [
        "impulse buy",
        "wasn't gonna buy it but here we are",
        "I went in for one thing and came out with a bag full of stuff I didn't need",
        "I went in for toothpaste. toothpaste. that's it. and I came out with toothpaste, snacks, a magazine, some weird gadget that was on sale, and a candle. a candle. I don't even burn candles. but it was 30% off and my brain went 'that's a deal' even though savin' money on somethin' you don't need isn't savin' money. it's spendin' money with extra steps. I know this. I still bought the candle."
    ], context: "impulse buy は「衝動買い」。impulse は「衝動」で、考える前に体が動いちゃうやつ。buy を名詞として使ってるのが英語的。good buy(いい買い物)、bad buy(ハズレ)。「買う」という行為そのものを物として扱える。日本語は「衝動買い」と動詞+名詞だけど、英語は impulse(形容詞的)+ buy(名詞)で、買い物にラベルを貼ってる。", category: 'reaction', month: '2026-03' },
    { daySlot: 2, japanese: '袋いりますか？って聞かれるやつ', english: [
        "need a bag?",
        "do I need a bag? I always say no and then regret it",
        "they asked if I needed a bag and I said no, now I'm juggling five items",
        "do you need a bag? no thanks. I say this every time. and then I'm walkin' out holdin' six items like some kind of circus performer. one in each hand, one under my arm, one between my chin and chest. and I'm thinking 'why didn't I just take the bag.' pride. that's why. I said no and I'm stickin' with no. even if I drop everything in the parking lot. principles."
    ], context: "do you need a bag? は英語圏のレジの定番フレーズ。need は「必要ですか?」だけど、実質「いりますか?」のカジュアル確認。日本語の「袋いりますか」と同じだけど、英語は do you need(あなたは必要ですか)と主語が you。日本語は「袋」が主語的だけど、英語は「あなた」が主語。常に人が中心。", category: 'filler', month: '2026-03' },
    { daySlot: 2, japanese: 'セールに踊らされてる', english: [
        "fell for the sale",
        "I got suckered by the sale sign, classic me",
        "I know it's a marketing trick but the 'SALE' sign still gets me every time",
        "I fell for the sale. I know it's a trap. I know they marked it up just to mark it down. I know '50% off' means nothin' if the original price was fake. I know all of this. I've read the articles. I've watched the videos. and I still walked in and bought three things 'cause the red sticker said SALE. my brain sees red tag, brain goes 'ooh deal.' I'm a goldfish."
    ], context: "fall for は「だまされる」「引っかかる」。fall(落ちる)+ for(〜のために)で、罠に落ちるイメージ。fall for a scam(詐欺に引っかかる)、fall for someone(恋に落ちる)。詐欺も恋も同じ fall for。英語では「だまされる」と「恋する」が同じ構造。どっちも judgment が飛ぶ瞬間を fall(落下)で表現してる。深い。", category: 'reaction', month: '2026-03' },
    { daySlot: 2, japanese: 'これ返品できますか', english: [
        "can I return this?",
        "can I return this? I changed my mind",
        "I bought this yesterday but it doesn't work out, can I get a refund?",
        "can I return this? I know the receipt says 30 days but it's been... let me check... 31 days. one day. one. and I know one day shouldn't matter but rules are rules and I'm already rehearsin' my argument in my head. 'it was basically 30 days.' 'I was busy.' 'have a heart.' I'm prepared to beg. not proud of it. but prepared."
    ], context: "return は「返品する」。元の場所に戻す=返す。英語圏は返品文化がすごくて、return policy(返品ポリシー)が買い物の判断基準になる。日本語の「返品」は気まずい行為だけど、英語では普通の権利。no questions asked(理由聞かずに返品OK)という表現もある。買い物の「失敗」を許容するシステムが言語に組み込まれてる。", category: 'request', month: '2026-03' },

    // -- Day 3: 天気トーク (Weather talk) --
    { daySlot: 3, japanese: '今日めっちゃいい天気じゃん', english: [
        "gorgeous day",
        "what a gorgeous day, finally",
        "the weather is perfect today, I almost don't wanna go inside",
        "what a gorgeous day. and I know 'gorgeous' sounds dramatic for weather but look at it. blue sky, nice breeze, perfect temperature. this is the kinda day you take a picture of the sky and send it to no one in particular. just put it on your story like 'look at this.' and everyone already knows 'cause they're outside too. but you post it anyway. 'cause it's gorgeous."
    ], context: "gorgeous は「めちゃくちゃキレイ」。beautiful より一段上の感嘆。天気、人、食べ物、なんにでも使える。what a gorgeous day は感嘆文。what a + 名詞で「なんて〜な!」。日本語の「めっちゃいい天気じゃん」は形容詞+名詞だけど、英語は感嘆詞 what が文頭に来て驚きのフレームを作ってから中身を言う。驚きが先、情報が後。", category: 'reaction', month: '2026-03' },
    { daySlot: 3, japanese: 'なんか降りそうだな', english: [
        "looks like rain",
        "it looks like it's gonna rain, grab an umbrella just in case",
        "the sky's getting dark, I bet it's gonna pour any minute now",
        "it looks like rain. and I'm sayin' this while starin' at the sky like I know what I'm talkin' about. I don't. I have zero meteorological knowledge. but there's somethin' in the clouds that just feels rainy. it's a vibe. and nine times outta ten the vibe is wrong. but that one time it's right? I feel like a weather prophet. 'told you it was gonna rain.' peak satisfaction."
    ], context: "it looks like rain は「雨っぽい」。looks like は「〜のように見える」で、推測を視覚ベースで語る。面白いのは rain が名詞として裸で立ってること。it's going to rain(動詞)じゃなくて、rain(名詞)をそのまま置く。「雨の気配がする」を「雨に見える」で処理してる。日本語の「降りそう」は動詞の推量形だけど、英語は見た目の話にしちゃう。", category: 'opinion', month: '2026-03' },
    { daySlot: 3, japanese: '風つよ', english: [
        "windy as heck",
        "the wind is brutal today, my hair's done for",
        "I stepped outside and the wind almost knocked me over, not even kidding",
        "the wind is insane today. I opened the door and it literally pushed me back. like, physically. the door fought me. and then I got outside and my hair went in four different directions at once. my umbrella? inverted in two seconds. just turned inside out like it gave up. even the wind is aggressive today. nature woke up and chose violence."
    ], context: "brutal は「容赦ない」「ひどい」。元は「残忍な」だけど、カジュアルに使うと「マジでキツい」。brutal heat(容赦ない暑さ)、brutal honesty(容赦ない正直さ)。天気にも人にも使える。日本語の「風つよ」は事実の報告だけど、英語の brutal は風に人格を与えてる。風が意図的に攻撃してくるニュアンス。自然現象を擬人化するのが英語の癖。", category: 'reaction', month: '2026-03' },
    { daySlot: 3, japanese: '花粉がやばい季節になった', english: [
        "allergy season",
        "allergy season hit me like a truck this year",
        "the pollen count is through the roof and I'm basically dyin' over here",
        "allergy season is here and my nose knows it. my eyes know it. my entire face knows it. I stepped outside for five seconds and sneezed eight times. eight. in a row. and every sneeze gets more violent. by the fifth one people are lookin' at me like I need medical attention. I don't need a doctor. I need to live inside a sealed box from March through May. is that an option? somebody make that an option."
    ], context: "hit me like a truck は「トラックにぶつかられたみたいに」=「めちゃくちゃキた」。through the roof は「屋根を突き抜けるほど」=「異常に高い」。英語は程度を表すのに物理的な衝撃や空間を使う。日本語の「やばい」は一語で済むけど、英語はどのくらいやばいかを建物や乗り物のスケールで具体化する。大げさ力が違う。", category: 'reaction', month: '2026-03' },
    { daySlot: 3, japanese: 'もう春じゃん', english: [
        "spring already",
        "wait, it's spring already? where'd winter go",
        "it feels like spring snuck up on us when nobody was paying attention",
        "it's spring already. and I feel like winter was just here. like, literally yesterday it was cold and dark and now there's birds chirpin' and flowers poppin' up outta nowhere. time doesn't move at a constant speed. winter is three months but feels like one. summer is three months but feels like ten. spring is the only season that actually surprises you. it just shows up. 'hey I'm here.' oh. OK. hi spring."
    ], context: "snuck up on は「忍び寄った」「気づかないうちに来た」。sneak(忍ぶ)の過去形が snuck。季節が人間に忍び寄る。英語は季節を泥棒みたいに扱う。時間も the weekend crept up on me(週末が忍び寄ってきた)と言う。日本語は「もう春」と時間の経過に驚くだけだけど、英語は春が能動的に近づいてきたと描写する。季節に足がある。", category: 'reaction', month: '2026-03' },
    { daySlot: 3, japanese: '洗濯物乾かないな', english: [
        "won't dry",
        "my laundry's takin' forever to dry in this weather",
        "I hung the laundry out hours ago and it's still soaking wet",
        "my laundry has been hangin' outside for six hours and it's still damp. six hours. that's a full work day for most people and my shirts accomplished nothin'. just hangin' there. wet. the weather app said 'partly cloudy' which apparently means 'your laundry's not dryin' today, deal with it.' I'm startin' to think 'partly cloudy' is weather code for 'we don't actually know.'"
    ], context: "take forever は「めちゃくちゃ時間がかかる」。forever(永遠)を使って大げさにする。it's taking forever は日本語の「全然終わらない」と同じだけど、forever のスケールが壮大。5分待ってるだけでも forever って言う。英語話者は待ち時間を永遠に引き伸ばすのが趣味。逆に良いことは it went by so fast(一瞬だった)と圧縮する。嫌な時間は長く、楽しい時間は短く語る。万国共通。", category: 'reaction', month: '2026-03' },
    { daySlot: 3, japanese: 'なんか蒸し暑くない？', english: [
        "kinda muggy",
        "is it just me or is it super muggy today?",
        "the humidity is killin' me, I'm sweating just standing here",
        "is it humid or is it just me? 'cause I walked outside and immediately felt like I was breathin' through a wet towel. and I'm not even doin' anything. just standin'. standin' and sweatin'. my shirt is stickin' to my back and it's been four minutes. muggy is the worst kind of hot 'cause you can't escape it. regular hot you find shade. muggy follows you into the shade. muggy doesn't respect boundaries."
    ], context: "muggy は「蒸し暑い」。humid のカジュアル版。mug は「もやっとした」イメージ。英語は暑さの種類が豊富: hot(暑い)、humid(湿度が高い)、muggy(蒸し暑い)、scorching(焼けるような)、sweltering(うだるような)。日本語の「蒸し暑い」一語に対して英語は5段階ある。天気の語彙力がイギリス発祥の言語だけある。天気トークの国。", category: 'suggestion', month: '2026-03' },
    { daySlot: 3, japanese: '急に冷えてきたな', english: [
        "got chilly quick",
        "it got chilly out of nowhere, shoulda brought a jacket",
        "the temperature dropped outta nowhere, I was not prepared for this",
        "it was fine an hour ago. fine. I left the house in a t-shirt like a confident person. and now I'm standin' here shiverin'. what happened? where did the warmth go? it just vanished. like someone flipped a switch. and the worst part is I can see my jacket at home in my head. hangin' on the chair where I left it. mocking me. shoulda brought it. but nooo, I trusted the weather. never trust the weather."
    ], context: "out of nowhere は「どこからともなく」「突然」。nowhere(どこでもない場所)から来る=予測不能。英語は「突然」を空間で表現する。out of the blue(青空から=まさかの)、from left field(左翼から=予想外)。全部「予想してなかった方向から来た」。日本語の「急に」は時間の話だけど、英語は空間の話にする。突然=変な方向から来た。", category: 'reaction', month: '2026-03' },
    { daySlot: 3, japanese: '夕焼けがきれいすぎる', english: [
        "insane sunset",
        "this sunset is unreal, look at those colors",
        "I stopped walking just to stare at this sunset, it's that good",
        "look at this sunset. just look at it. the sky's doin' that thing where it's orange and pink and purple all at the same time and it looks fake. like someone put an Instagram filter on reality. and I'm standin' here takin' five photos that all look the same 'cause my phone can't capture what my eyes are seein'. phones aren't built for sunsets. some things you just gotta see in person and be mad you can't share it properly."
    ], context: "unreal は「ありえないくらいキレイ」。real(現実)の否定で「現実じゃないレベル」。英語は感動を「これは現実じゃないでしょ」で表現する。insane(正気じゃない)、unreal(現実じゃない)、crazy(狂ってる)。全部「普通の枠を超えた」という褒め言葉。日本語の「きれいすぎる」は程度の話だけど、英語は「現実のカテゴリーから外れた」と分類してる。", category: 'reaction', month: '2026-03' },
    { daySlot: 3, japanese: '天気予報あてにならん', english: [
        "weather forecast lied",
        "the forecast said sunny and it's pourin' right now, typical",
        "I stopped trusting weather forecasts a long time ago, they're wrong half the time",
        "the forecast said no rain. no rain. and I'm standin' here gettin' absolutely soaked. I left my umbrella at home 'cause the app said 0% chance of precipitation. zero. and yet. here we are. in the rain. precipitation-ing. I think weather apps should have a disclaimer that says 'we're guessin' most of the time, bring an umbrella anyway.' at least be honest about it."
    ], context: "forecast は「予報」。fore(前もって)+ cast(投げる)。未来に情報を投げるイメージ。天気予報だけじゃなくて、sales forecast(売上予測)、forecast for the economy(経済見通し)にも使う。英語は「予測」を「先に投げる」で表現する。日本語の「予報」は「前もって報告」で受動的だけど、英語は能動的に未来に投げてる。でも当たらない。", category: 'opinion', month: '2026-03' },

    // -- Day 4: 予定・スケジュール (Plans & scheduling) --
    { daySlot: 4, japanese: '来週ちょっと忙しいんだよね', english: [
        "slammed next week",
        "next week's gonna be insane, I'm already dreadin' it",
        "I've got back-to-back stuff next week, barely any breathing room",
        "next week is packed. like, Monday through Friday, every single slot is full. and I did this to myself. past me looked at the calendar and went 'yeah sure I can fit that in' like twelve times. and now present me is starin' at this schedule thinkin' 'who agreed to all of this?' it was me. I know it was me. but I'm gonna blame past me anyway 'cause he's not here to defend himself."
    ], context: "slammed は「予定でぎゅうぎゅう」。slam は「バタンと閉める」で、スケジュールがバタンと詰まってる。packed(パンパン)、swamped(溺れるほど)、slammed(叩きつけられるほど)。英語は「忙しい」を身体的圧迫で表現する。busy は軽い。本当に忙しいときは物理的な暴力で語る。", category: 'reaction', month: '2026-03' },
    { daySlot: 4, japanese: 'その日空いてるか確認するわ', english: [
        "lemme check",
        "lemme check my calendar real quick",
        "hold on, let me see if I'm free that day, I'll get back to you",
        "lemme check. and by 'lemme check' I mean I'm gonna open my calendar, stare at it for thirty seconds, realize I have no idea what half these events are, and then say 'yeah I think I'm free' while bein' about 60% sure. my calendar is a mess. there's stuff on there from months ago that I never deleted. ghost events. phantom meetings. I'm navigatin' a haunted calendar."
    ], context: "lemme は let me の超カジュアル短縮。let me → lemme。教科書には載ってないけど会話では全員使う。lemme think(考えさせて)、lemme see(見せて)。let me をフルで言うとちょっとフォーマルに聞こえる。短縮するかしないかで空気が変わる。カジュアル度のスイッチ。check my calendar は「予定を確認する」だけど、check には「問題ないか確かめる」ニュアンスがある。", category: 'filler', month: '2026-03' },
    { daySlot: 4, japanese: 'ダブルブッキングしちゃった', english: [
        "double-booked",
        "I double-booked myself again, classic mistake",
        "I somehow scheduled two things at the same time and now I gotta pick one",
        "I double-booked myself. two things. same day. same time. and I don't know how this happened 'cause I literally have a calendar. the calendar exists specifically to prevent this. and yet here I am. with two commitments at 3 PM on Saturday. and I gotta cancel one. and whichever one I cancel, that person's gonna know they were the backup. nobody wants to be the backup. this is a lose-lose situation."
    ], context: "double-booked は「予定をダブらせた」。book(予約する)を double(二重に)してしまった。英語は booking(予約)を動詞として自由に使う。overbooked(予約取りすぎ)は飛行機でよくあるやつ。日本語は「ダブルブッキング」とカタカナで輸入してるけど、英語では自分のミスとして使う。I double-booked myself の myself が「自分のせい」感を出してる。", category: 'reaction', month: '2026-03' },
    { daySlot: 4, japanese: 'リスケしてもいい？', english: [
        "can we reschedule?",
        "hey, any chance we can push it to next week?",
        "I hate to ask but can we reschedule? something came up",
        "can we reschedule? and I know that's annoying to hear. nobody likes bein' rescheduled on. but somethin' came up. and by 'somethin' came up' I mean I realized I can't deal with two things on the same day. one thing per day is my limit. two is chaos. so I'm movin' one. and I'll say 'somethin' came up' 'cause that's vague enough to sound important without havin' to explain that I just need a nap."
    ], context: "push it は「後ろにずらす」。push(押す)で予定を未来方向に押す。push it back(後ろに押す)、push it to next week(来週に押す)。英語は予定を物体のように動かす。move(動かす)、shift(ずらす)、bump(ぶつけてずらす)。日本語の「リスケ」は英語の reschedule から来てるけど、ネイティブは push のほうがカジュアルで頻出。", category: 'request', month: '2026-03' },
    { daySlot: 4, japanese: '予定詰めすぎた', english: [
        "overcommitted",
        "I overcommitted and now I'm payin' for it",
        "I said yes to everything and now my schedule is a nightmare",
        "I said yes to too many things. way too many. and the problem is each individual yes seemed reasonable at the time. 'yeah sure I can do that.' 'oh that sounds fun, I'm in.' 'no problem.' and now it's all happenin' at once and I'm drownin'. the lesson here is learn to say no. but will I learn it? no. next month I'll do the same thing. I'm a yes machine with a no deficiency."
    ], context: "overcommit は「引き受けすぎる」。over(超えて)+ commit(約束する)。キャパを超えて約束した状態。英語は over- をつけるだけで「やりすぎ」を表現できる。overwork(働きすぎ)、overeat(食べすぎ)、overthink(考えすぎ)。日本語は「〜すぎ」だけど、英語は over- を頭にくっつける。接頭辞一つで意味が反転する効率のいいシステム。", category: 'opinion', month: '2026-03' },
    { daySlot: 4, japanese: '何時がいい？', english: [
        "what time works?",
        "what time works for you? I'm pretty flexible",
        "when's a good time for you? I can make most things work",
        "what time works for you? and I say 'I'm flexible' but honestly there's like a two-hour window that actually works and the rest is a lie. but I say flexible 'cause it sounds accommodating. and then when they pick a time outside my window I go 'oh, hmm, actually can we do an hour later?' and now we're negotiatin'. schedulin' is just negotiation with a calendar."
    ], context: "what time works は「何時が都合いい?」。work は「働く」じゃなくて「機能する」「うまくいく」。Does that work for you?(それで大丈夫?)、That doesn't work(それは無理)。英語では予定が work する(機能する)か work しない(機能しない)か。日本語は「都合がいい」と主語が曖昧だけど、英語は時間自体が working してる。時間に仕事させてる。", category: 'suggestion', month: '2026-03' },
    { daySlot: 4, japanese: 'ドタキャンされた', english: [
        "got cancelled on",
        "they cancelled on me last minute, seriously?",
        "they bailed on me at the last second after I already got ready and everything",
        "they cancelled. last minute. after I already showered, got dressed, and mentally prepared myself to be social. do you know how much energy it takes to mentally prepare to be social? a lot. and they just hit me with a 'hey sorry can't make it' text. a text. not even a call. the audacity. I'm already in my nice clothes sittin' on my couch with nowhere to go. guess I'm overdressed for Netflix tonight."
    ], context: "bail on は「ドタキャンする」。bail は元々「保釈」。保釈金を払って逃げるイメージが、約束から逃げるに転用された。bail on me は「俺との約束から逃走した」。cancel on me は中立的だけど、bail on me は「逃げやがった」という怒りが入る。last minute は「直前に」。minute(分)が「ギリギリ」の単位になってる。", category: 'reaction', month: '2026-03' },
    { daySlot: 4, japanese: '予定がなさすぎて逆に困る', english: [
        "too free",
        "I've got nothin' goin' on and it's kinda stressin' me out",
        "my calendar is completely empty and I don't know if that's freedom or a problem",
        "I have zero plans. none. and you'd think that would feel great but it doesn't. it feels weird. when you're busy you dream about free time. and when you have free time you don't know what to do with it. it's a trap. my brain needs just the right amount of busy. too much and I'm stressed. too little and I'm anxious about bein' not stressed. I can't win."
    ], context: "nothin' goin' on は「何も予定がない」。go on は「起きてる」「進行中」で、人生にイベントが発生してない状態。What's going on?(何が起きてるの?)の否定形。英語は予定がないことを「何も起きてない」と表現する。日本語は「予定がない」と所有の話だけど、英語は「イベントが発生してない」と世界の話にする。スケールが違う。", category: 'opinion', month: '2026-03' },
    { daySlot: 4, japanese: 'とりあえず仮で入れとくね', english: [
        "pencil it in",
        "I'll pencil it in for now, we can always change it",
        "let me put it on the calendar tentatively, nothing's set in stone yet",
        "I'll pencil it in. and 'pencil it in' is perfect 'cause pencil can be erased. if I say 'I'll ink it in' that means it's final. but pencil? pencil is 'maybe.' pencil is 'probably but don't hold me to it.' pencil is the commitment level of someone who wants to say yes but also wants an escape route. which is me. always. pencil is my love language."
    ], context: "pencil it in は「鉛筆で書いておく」=「仮で入れておく」。鉛筆だから消せる。pen it in だと「ペンで書く」=「確定」。この pencil vs pen の対比が英語の面白いところ。仮と確定を筆記具で区別する。set in stone(石に刻む)は「絶対に変えない」。英語は「確定度」を書く道具の永続性で表現する。鉛筆 < ペン < 石。", category: 'suggestion', month: '2026-03' },
    { daySlot: 4, japanese: '今日やるはずだったのに', english: [
        "was supposed to",
        "I was supposed to do that today but it didn't happen",
        "that was on my to-do list today and it's still there untouched",
        "I was supposed to do like five things today. five. and how many did I do? one. maybe one and a half if you count startin' somethin' and then gettin' distracted. 'supposed to' is the saddest phrase in English. it's the gap between the plan and reality. I was supposed to go to the gym. I was supposed to clean. I was supposed to be a functional adult today. supposed to. didn't."
    ], context: "was supposed to は「〜するはずだった」。suppose は「想定する」で、was supposed to は「想定されていたけど実現しなかった」。予定と現実のギャップを表す専用フレーズ。日本語の「〜はずだったのに」と同じ残念感。英語は supposed to を過去形にした瞬間に「やらなかった」が確定する。時制で結果がわかる。ネタバレ文法。", category: 'reaction', month: '2026-03' },

    // -- Day 5: 体調・健康 (Physical condition) --
    { daySlot: 5, japanese: 'なんか調子悪い', english: [
        "feelin' off",
        "I'm feelin' off today, can't pinpoint what it is",
        "something's not right with me today, I just feel kinda blah",
        "I'm feelin' off. not sick. not tired. just... off. like somethin' in my body is at 85% instead of 100% and I can't figure out which part. it's like when your car makes a weird noise but only sometimes. you go to the mechanic and it stops. that's my body right now. makin' a weird noise that I can't describe to anyone. 'I feel off.' 'Off how?' 'Just... off.' helpful, I know."
    ], context: "off は「ズレてる」「いつもと違う」。on が正常なら off は異常。feel off は「何かが狂ってる」。I'm off today(今日は調子悪い)、something's off(何かがおかしい)、the milk smells off(牛乳が変な匂いする)。on/off のスイッチ感覚で、正常からズレた状態を表現する。日本語の「調子悪い」は程度の話だけど、英語は正常/異常のスイッチ。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: '肩こりがひどい', english: [
        "shoulders are killin' me",
        "my shoulders are so stiff I can barely turn my head",
        "I've been sittin' at my desk too long and now my shoulders are completely locked up",
        "my shoulders are done. finished. they've been tensed up since like Tuesday and they refuse to relax. I tried stretchin'. I tried that thing where you roll your shoulders back. I tried hot water in the shower. nothin'. they're locked. my muscles have made a decision and that decision is 'we're stayin' tight.' it's like my shoulders are holdin' a grudge against me for sittin' too long. and honestly? fair."
    ], context: "killin' me は「殺すほど痛い」。my back is killing me(腰が殺しにかかってくる)。英語は痛みを「身体の部位が自分を殺そうとしてる」で表現する。体のパーツが反乱を起こして攻撃してくるイメージ。日本語の「ひどい」は程度だけど、英語は殺人未遂。痛みの表現が常に命がけ。stiff は「硬い」で、locked up は「ロックされた」。機械の故障みたいに体を語る。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: '寝不足だわ', english: [
        "sleep-deprived",
        "I'm runnin' on like four hours of sleep, don't expect much",
        "I barely slept last night and I can feel it in everything I do today",
        "I got four hours of sleep. four. and now I'm out here pretendin' to be a functional human. smilin' at people. answerin' emails. makin' decisions. all on four hours. my brain is basically bufferin' right now. you know that spinny wheel on your computer? that's my brain. it's still loadin'. give it a minute. or an hour. or maybe just don't talk to me till tomorrow."
    ], context: "runnin' on は「〜で動いてる」。running on four hours は「4時間の睡眠で稼働中」。車の燃料と同じ発想。running on empty(ガス欠で走ってる)、running on fumes(蒸気だけで走ってる)。人間をエンジンに例えて、睡眠を燃料として語る。日本語の「寝不足」は状態の報告だけど、英語は「何の燃料でどう動いてるか」を実況する。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: 'ストレッチしないとまずい', english: [
        "gotta stretch",
        "if I don't stretch soon my body's gonna snap in half",
        "I haven't moved in three hours and everything is starting to seize up",
        "I need to stretch. I've been sittin' so long that standin' up is gonna be an event. like, I'm gonna stand and my knees are gonna make that cracklin' sound and everyone in the room is gonna hear it and pretend they didn't. and then I'm gonna do that old-person groan. the 'ohhhhh' groan. the one that just comes out automatically when you're over thirty. stretching isn't exercise anymore. it's survival."
    ], context: "snap in half は「真っ二つに折れる」。snap は「パキッと折れる」の音と動きが一語。if I don't stretch, I'm gonna snap は大げさだけど、英語の日常会話はこういう誇張が標準装備。seize up は「固まる」で、エンジンが焼き付く表現を体に使ってる。英語は常に体を機械として語る。メンテナンス(stretch)しないと故障(snap)する。", category: 'opinion', month: '2026-03' },
    { daySlot: 5, japanese: '薬飲んだけど効かない', english: [
        "meds aren't workin'",
        "I took somethin' but it's not kickin' in yet",
        "I popped some medicine an hour ago and I still feel exactly the same",
        "I took the medicine. an hour ago. and nothin'. zero change. and the bottle says 'fast-acting' which is apparently a lie. or maybe my body is just resistant at this point. like, my immune system looked at the pill and went 'that's cute' and ignored it. I've been poppin' painkillers like candy and my headache is just sittin' there, unbothered, watchin' me struggle. it's mocking me."
    ], context: "kick in は「効き始める」。kick(蹴る)が「効果が蹴り込んでくる」イメージ。薬、コーヒー、アドレナリン、全部 kick in で「効果が来た!」。the coffee kicked in(コーヒーが効いてきた)。pop は「ポンと口に放り込む」。pop a pill は「薬をポイッと飲む」。英語は薬を飲む動作も音で表現する。日本語の「飲む」は静かだけど、英語の pop は軽快。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: '目が疲れすぎて画面見たくない', english: [
        "screen fatigue",
        "my eyes are fried from starin' at screens all day",
        "I've been looking at a screen for ten hours straight and my eyes are begging for mercy",
        "my eyes are done. they quit. I've been starin' at this screen since 8 AM and it's now... I don't even wanna check. everything's blurry and my eyes feel like they've been rubbed with sandpaper. and the worst part is I gotta keep goin'. more emails. more tabs. more pixels. my eyes are submitting a formal complaint to my brain and my brain is goin' 'noted' and doin' nothin' about it."
    ], context: "fried は「揚げられた」=「ぶっ壊れた」。フライドポテトの fried。my brain is fried(脳が揚げ物にされた)、I'm fried(俺は揚がった)。疲労を料理で表現するのが英語。cooked(煮られた)、toasted(トーストにされた)、burnt out(燃え尽きた)。体の疲労を全部キッチンの熱で語る。日本語は「疲れた」一語だけど、英語は調理法のバリエーションが豊富。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: '足つった', english: [
        "got a cramp",
        "my leg just cramped up outta nowhere, ow ow ow",
        "I was just lying in bed and my calf decided to seize up for no reason",
        "my leg cramped. in bed. at 3 AM. for absolutely no reason. I was just lyin' there, doin' nothin', and my calf went 'hey watch this' and locked up like a fist. and there's nothin' you can do except grab it and wait. and make sounds. weird sounds. sounds you didn't know you could make. sounds that scare your partner awake. 'are you OK?' no I am not OK my leg is tryin' to kill me."
    ], context: "cramp up は「つる」「痙攣する」。cramp は筋肉がギュッと縮む状態。charley horse は「足がつる」のスラング。なぜ馬(horse)なのかは諸説あるけど、筋肉が暴れてコントロールできない感じを動物で例えてる。seize up は「固まる」で、エンジンの焼き付きから来てる。英語は体の不調を機械の故障と動物の暴走で語る。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: 'なんかだるい', english: [
        "feelin' sluggish",
        "I'm so sluggish today, zero energy",
        "I don't know what's wrong but I have absolutely no energy today",
        "I'm sluggish. that's the only word for it. not sick. not sad. not tired exactly. just... sluggish. like I'm movin' through honey. everything takes twice the effort. pickin' up my phone? effort. walkin' to the kitchen? effort. thinkin'? big effort. it's like someone turned down my power settings to eco mode without askin'. I'm runnin' at minimum specs today. low resolution life."
    ], context: "sluggish は「ナメクジみたいにのろい」。slug(ナメクジ)+ ish(〜っぽい)。動きが遅くてだるい状態をナメクジで表現する。英語は体調を動物で例えるのが好き。sluggish(ナメクジ)、catty(猫みたいに意地悪)、sheepish(羊みたいにモジモジ)。日本語の「だるい」は感覚だけど、英語は生き物の動きに変換する。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: '水飲まなすぎた', english: [
        "so dehydrated",
        "I realized I haven't had water all day, that explains a lot",
        "no wonder I feel terrible, I've been runnin' on coffee and nothin' else",
        "I just realized I haven't had a single glass of water today. not one. it's 3 PM and I've had three coffees and zero water. my body is basically a coffee filter at this point. no wonder I have a headache. no wonder I'm dizzy. my brain is sendin' me error messages and the fix is literally just... water. the most basic thing on earth. and I forgot to consume it. humans shouldn't be in charge of their own hydration."
    ], context: "no wonder は「どうりで」「そりゃそうだ」。wonder(不思議)が no(ない)=「不思議じゃない」=「当然だ」。原因がわかった瞬間に使う。No wonder I'm tired, I slept three hours(3時間しか寝てないならそりゃ疲れるわ)。日本語の「どうりで」と完全に同じ機能だけど、英語は「不思議じゃない」と二重否定で回り道する。直接言わないのが面白い。", category: 'reaction', month: '2026-03' },
    { daySlot: 5, japanese: '体力の衰えを感じる', english: [
        "not what I used to be",
        "I'm definitely not what I used to be, my body's remindin' me daily",
        "I used to be able to do this no problem but now everything hurts",
        "I'm not what I used to be. and I know that sounds dramatic but hear me out. I went up two flights of stairs today and needed a break at the top. two flights. that's like twenty steps. twenty. and my legs were burnin' and I was breathin' heavy and some college kid jogged past me like it was nothin'. I used to be that kid. now I'm the guy he jogged past. time is undefeated."
    ], context: "not what I used to be は「昔の自分じゃない」。used to は「昔は〜だった」で、今との対比を作る。what I used to be の what は「かつての状態」を丸ごと指す。日本語は「衰えを感じる」と衰えが主語だけど、英語は「昔の自分との比較」で語る。衰えという概念じゃなくて、「過去の自分 vs 今の自分」の対決にする。英語は常にビフォーアフター。", category: 'opinion', month: '2026-03' },

    // -- Day 6: 移動・交通 (Transportation) --
    { daySlot: 6, japanese: '電車遅れてるし', english: [
        "train's delayed",
        "the train's delayed again, shocker",
        "the train's running late and I'm just standing here watching the minutes tick by",
        "the train is delayed. again. and the announcement says 'approximately five minutes' which in train language means 'somewhere between five and thirty.' I've never in my life seen a train delay that was actually five minutes. that number is a fairy tale. a bedtime story they tell commuters to keep us calm. 'five minutes.' sure. and I'm the queen of England."
    ], context: "shocker は「驚き(皮肉)」。shock(衝撃)+ er で「衝撃的なこと」だけど、皮肉で使うと「全然驚かない」の意味になる。電車の遅延に shocker って言うのは「またかよ、驚きゼロ」。英語は皮肉が日常武器。日本語の「〜し」は理由の列挙だけど、投げやりなニュアンスもある。英語は皮肉の一語で同じトーンを出す。", category: 'reaction', month: '2026-03' },
    { daySlot: 6, japanese: '乗り換え間に合うかな', english: [
        "gonna make my transfer?",
        "I dunno if I'm gonna make my connection, it's tight",
        "if this train doesn't hurry up I'm gonna miss my transfer and be stuck for twenty minutes",
        "I'm watchin' the clock and doin' math in my head. the train arrives at 8:47. my connection leaves at 8:49. that's two minutes. two minutes to get off, run across the platform, and get on. and I'm not a fast runner. and there's gonna be people in my way. slow people. people who don't understand urgency. I need the universe to cooperate for exactly two minutes. that's all I'm askin'."
    ], context: "make my connection は「乗り換えに間に合う」。make には「間に合う」の意味がある。make the train(電車に間に合う)、make the deadline(締切に間に合う)。日本語は「間に合う」と時間の話だけど、英語は make(作る/達成する)で「成功か失敗か」のチャレンジにしてる。電車に乗れた=成功、乗れなかった=失敗。移動が毎回ゲーム。", category: 'reaction', month: '2026-03' },
    { daySlot: 6, japanese: '渋滞にハマった', english: [
        "stuck in traffic",
        "I'm stuck in traffic and I'm losin' my mind",
        "I've been sitting in traffic for thirty minutes and I've moved maybe a hundred meters",
        "stuck in traffic. not movin'. the car in front of me has had its brake lights on for so long they might as well be permanent. and there's always that one lane that's movin' faster than yours. always. and you think about switchin' but every time you switch, the other lane starts movin'. it's a conspiracy. traffic is a conspiracy against specifically me. everyone else is fine. I'm cursed."
    ], context: "stuck は「ハマって動けない」。stick(くっつく)の過去分詞で「くっついて離れない」。stuck in traffic(渋滞にハマった)、stuck in a meeting(会議から抜けられない)、stuck at home(家から出られない)。全部「くっついて動けない」。日本語の「ハマる」は良い意味にも使う(趣味にハマる)けど、英語の stuck はほぼネガティブ。接着剤で固定された不自由。", category: 'reaction', month: '2026-03' },
    { daySlot: 6, japanese: 'タクシー呼ぶか', english: [
        "just grab a cab",
        "screw it, I'm just gonna grab a cab",
        "I'm running too late for the train, let me just call a taxi",
        "I'm callin' a cab. I know it's expensive. I know the train is cheaper. I know I'm supposed to be savin' money. but I'm late. and when you're late, money becomes fake. it's like monopoly money. 'twenty bucks for a ride? sure, whatever, just get me there.' and then tomorrow when I check my bank account I'll regret it. but right now? right now twenty bucks is the price of not bein' late. worth it. probably."
    ], context: "grab a cab は「タクシーをつかまえる」。grab(つかむ)は「素早く手に入れる」のカジュアル版。grab coffee(コーヒー買う)、grab lunch(昼飯食べる)、grab a cab(タクシー乗る)。全部「サッと手に入れる」。日本語の「呼ぶ」は電話で呼び寄せるイメージだけど、英語の grab は自分から飛びついて捕まえるイメージ。能動的。ハンター。", category: 'suggestion', month: '2026-03' },
    { daySlot: 6, japanese: '席空いてない', english: [
        "no seats",
        "not a single seat open, guess I'm standin'",
        "the whole train is packed and I'm sardined between two strangers",
        "no seats. of course. and I got on early enough that there should be seats but nope. all taken. so now I'm standin' and holdin' onto the rail and tryin' not to fall into people every time the train brakes. and there's always someone with a backpack that takes up the space of two people. a backpack that's at my face level. and they don't know. or they don't care. either way, I'm breathin' nylon."
    ], context: "packed は「ぎゅうぎゅう詰め」。pack(詰める)の過去分詞で「詰められた状態」。sardined は「イワシみたいに詰め込まれた」。sardine(イワシ)を動詞化して「イワシ缶状態にされた」。英語は名詞を動詞にするのが超得意。google it(ググれ)、uber there(Uberで行け)。なんでも動詞にしちゃう。日本語もカタカナでやるけど、英語は名詞→動詞の変換がゼロコスト。", category: 'reaction', month: '2026-03' },
    { daySlot: 6, japanese: '道間違えた', english: [
        "wrong way",
        "I went the wrong way, classic me",
        "I just realized I've been walking in the completely wrong direction for ten minutes",
        "I've been walkin' the wrong way. for ten minutes. ten whole minutes of confident walkin' in the wrong direction. and the moment I realized it I just stopped and stared at my phone like it betrayed me. but it didn't. the map said turn right. I turned left. that's on me. but I'm still blamin' the map 'cause acceptin' that I can't follow simple directions is too much for my ego right now."
    ], context: "wrong way は「逆方向」。英語は方向ミスに wrong(間違った)を使う。right way(正しい道)vs wrong way(間違った道)。道に正解と不正解がある発想。日本語は「道を間違えた」と行為のミスだけど、英語は道自体が wrong。道のせいにしてるように聞こえるけど実際は自分のミス。classic me は「いつもの俺」で自虐。", category: 'reaction', month: '2026-03' },
    { daySlot: 6, japanese: '歩くと意外と近い', english: [
        "walkable actually",
        "turns out it's totally walkable, didn't need the train",
        "I always take the train but walkin' it was only fifteen minutes, I feel dumb",
        "I walked. for the first time. and it took fifteen minutes. fifteen. and I've been takin' the train for this same trip for months. months. waitin' on the platform, cramming onto the car, transferrin'. the whole thing takes twenty minutes. I coulda been walkin' this whole time and savin' five minutes and also gettin' exercise. I feel so dumb. and also kinda smart for figurin' it out. but mostly dumb."
    ], context: "walkable は「歩ける距離」。walk + able で「歩行可能な」。英語は -able をつけるだけで「〜できる」形容詞が作れる。doable(やれる)、readable(読める)、manageable(なんとかなる)。日本語は「歩ける距離」と3語必要だけど、英語は walkable の1語。接尾辞 -able のコスパが異常。何にでもくっつく。", category: 'opinion', month: '2026-03' },
    { daySlot: 6, japanese: '終電ヤバいぞ', english: [
        "last train",
        "dude we gotta go, last train's in like ten minutes",
        "if we don't leave right now we're gonna miss the last train and that's game over",
        "last train. last train. we gotta go NOW. and I've been sayin' 'we should leave soon' for the past hour and nobody listened. and now 'soon' is 'right this second.' and someone's still finishin' their drink. and someone's in the bathroom. and I'm standin' by the door like a stressed-out parent at a theme park. 'let's go! we're gonna miss it!' I'm always the last-train police. somebody has to be."
    ], context: "game over は「終わり」「詰み」。ゲームからの借用で「もう取り返しがつかない」。miss the last train = game over は英語の等式。日本語の「ヤバい」は広すぎて何がヤバいか不明だけど、英語は game over と結果を明示する。「最終的にどうなるか」を先に言って危機感を出す。結論ファースト文化は警告にも適用される。", category: 'reaction', month: '2026-03' },
    { daySlot: 6, japanese: '反対方向の電車に乗っちゃった', english: [
        "wrong train",
        "I got on the wrong train and didn't realize for three stops",
        "I hopped on the train going the opposite direction and now I'm in the middle of nowhere",
        "I got on the wrong train. the opposite direction. and I didn't notice for three stops 'cause I was on my phone. three stops. in the wrong direction. so now I gotta get off, cross the platform, wait for the right train, go back those three stops, and then continue to my actual destination. I've added like thirty minutes to my commute 'cause I was readin' someone's tweet about a dog. worth it? ...kinda, actually. it was a really cute dog."
    ], context: "hop on は「ひょいと乗る」。hop(ぴょんと跳ぶ)で、軽く乗り込む感じ。hop on the bus(バスにひょいと乗る)、hop in the car(車にひょいと乗り込む)。日本語の「乗る」は中立的だけど、英語の hop は動きが軽い。jump on だと勢いが強すぎる。hop on は「気軽にポンと」。乗り物に乗る動作に軽快さがある。", category: 'reaction', month: '2026-03' },
    { daySlot: 6, japanese: '定期切れてるの忘れてた', english: [
        "pass expired",
        "my train pass expired and I didn't notice till the gate rejected me",
        "I got stopped at the gate 'cause my commuter pass ran out and I had no idea",
        "my pass expired. and I found out the fun way. by walkin' confidently into the ticket gate and gettin' rejected. in front of everyone. the gate just went BEEP and the doors didn't open and I'm standin' there like I got dumped by a machine. in public. and the line behind me is growin'. and I'm panickin'. tappin' my card again like 'come on, work, don't do this to me.' it didn't work. it's expired. just like my dignity at that gate."
    ], context: "expired は「期限切れ」。expire は「息を吐き出す」が原義(ex=外に、spire=呼吸)。最後の息を吐いた=死んだ=期限切れ。パスポートが expire する、牛乳が expire する、クーポンが expire する。全部「死んだ」。英語では有効期限が切れることは小さな死。日本語の「切れる」も面白いけど、expire の「最後の呼吸」感のほうがドラマチック。", category: 'reaction', month: '2026-03' },

    // -- Day 7: 料理・食事 (Cooking & meals) --
    { daySlot: 7, japanese: '何作ろうかな', english: [
        "what should I make",
        "what should I make tonight... I've got nothin' in mind",
        "I'm standing in front of the fridge trying to figure out what to cook",
        "what should I make. I'm standin' in front of the open fridge just... starin'. hopin' the ingredients will arrange themselves into a recipe. they won't. they never do. and I've been standin' here so long the fridge is startin' to beep at me. 'close the door.' no. I need inspiration. the fridge is my vision board right now. and it's sayin'... eggs. again. eggs it is."
    ], context: "what should I make は「何を作ろう」。英語の should は「〜すべき」だけど、ここでは「何がいいかな」の軽い相談。should は義務じゃなくて提案のニュアンスもある。what should I do(どうしよう)、where should we go(どこ行こう)。日本語の「〜かな」の迷い感を should が担当してる。", category: 'filler', month: '2026-03' },
    { daySlot: 7, japanese: '味見してみて', english: [
        "try this",
        "here, try this and tell me if it needs anythin'",
        "taste this for me real quick, I can't tell if it's right",
        "try this. and be honest. like actually honest. don't do that thing where you say 'mmm that's good' when it's clearly just OK. I need real feedback. is it too salty? not enough garlic? does it taste like sadness? tell me. 'cause my taste buds stopped workin' after the third taste test. I've tasted it so many times I don't know what flavor means anymore. I need fresh taste buds. yours."
    ], context: "try this は「これ食べてみて」。try(試す)一語で「味見」になる。taste this だと「味わって」でもうちょっと丁寧。try は「やってみて」の万能動詞で、食べ物にも使えるのが便利。tell me if it needs anything は「何か足りないか教えて」。needs は「必要としてる」で、料理に人格を与えてる。料理が何かを「必要としてる」。英語は無生物が意思を持つ。", category: 'request', month: '2026-03' },
    { daySlot: 7, japanese: '焦げた匂いがする', english: [
        "somethin's burnin'",
        "wait -- do you smell that? somethin's definitely burnin'",
        "I got distracted for two minutes and now the whole kitchen smells like smoke",
        "somethin's burnin'. I can smell it. and I'm 90% sure it's the thing I put in the pan five minutes ago and then completely forgot about 'cause I started scrollin' on my phone. this is why I can't cook and use my phone at the same time. the phone always wins. the food always loses. and now I'm runnin' to the kitchen like it's an emergency. 'cause it is. my dinner is on fire. metaphorically. maybe literally."
    ], context: "somethin's burnin' は「何か焦げてる」。英語は smell(匂い)を動詞で使う。I smell something burning(何か燃えてる匂いがする)。日本語は「匂いがする」と匂いが主語だけど、英語は I smell で「俺が嗅いでる」と自分が主語。感覚の主導権が違う。匂いが来るんじゃなくて、俺が嗅ぎ取る。能動的な鼻。", category: 'reaction', month: '2026-03' },
    { daySlot: 7, japanese: '塩入れすぎた', english: [
        "too much salt",
        "I way oversalted this, it's ruined",
        "I added too much salt and now there's no saving this dish",
        "I put too much salt in. and I knew it was too much the second it left my hand. like, the salt was fallin' and my brain was screamin' 'STOP' but my hand didn't listen. and now it's in there. mixed in. no goin' back. and I tried addin' water. I tried addin' sugar. I tried all the tricks the internet says work. none of 'em work. once it's salty, it's salty. that's a life lesson and a cooking lesson."
    ], context: "way oversalted は「めっちゃ塩入れすぎた」。way は「めっちゃ」の強調。way too much(多すぎ)、way better(ずっといい)、way worse(ずっと悪い)。日本語の「かなり」「めちゃくちゃ」に当たる。over + salt + ed で「塩しすぎた状態」。英語は over- で「超過」、-ed で「された」。接頭辞と接尾辞だけで新しい形容詞を即席で作れる。語彙の DIY。", category: 'reaction', month: '2026-03' },
    { daySlot: 7, japanese: '冷めちゃった', english: [
        "it got cold",
        "ugh, it got cold while I was doin' other stuff",
        "I spent so long plating it nicely that by the time I sat down it was cold",
        "it's cold. the food is cold. and it's my fault 'cause I spent five minutes takin' a photo of it instead of eatin' it. five minutes of findin' the right angle, adjustin' the lighting, takin' fifteen shots that all look the same. and now my beautiful, photogenic dinner is room temperature. was the Instagram post worth it? probably not. did I post it anyway? obviously. priorities, right? ...wrong. but here we are."
    ], context: "it got cold は「冷めちゃった」。got は「〜になった」の変化。get cold(冷める)、get hot(熱くなる)、get old(古くなる)。get は状態変化の万能動詞。日本語は「冷める」「熱くなる」と動詞が変わるけど、英語は get + 形容詞で全部処理する。get は変化のスイス・アーミー・ナイフ。一本で何でも切れる。", category: 'reaction', month: '2026-03' },
    { daySlot: 7, japanese: 'これ美味しくない？', english: [
        "good right?",
        "this is good, right? tell me it's good",
        "try this and tell me I didn't just make the best thing ever",
        "is this good? like, actually good? 'cause I think it's good but I also made it so I'm biased. the cook always thinks their own food is good. that's why you need a second opinion. a brutally honest second opinion. and not from someone who loves me and will say it's great no matter what. I need a critic. a food enemy. someone who will look me in the eye and say 'it needs more garlic.' that's love."
    ], context: "right? を文末につけると「だよね?」の確認タグ。でもここの right? は本気で確認してるんじゃなくて、「美味しいって言ってほしい」の催促。英語の right? は質問のフリをした同意の強制。日本語の「美味しくない?」も否定疑問で同じ構造。「美味しいよね? ね? 言って?」という圧。両言語とも質問形で同意を強要するテクニックが同じ。", category: 'suggestion', month: '2026-03' },
    { daySlot: 7, japanese: '今日のご飯当たりだった', english: [
        "nailed it",
        "tonight's dinner was a hit, I'm proud of myself",
        "I actually made something really good today and I'm genuinely impressed with myself",
        "I nailed it. the food is good. actually good. not 'it's edible' good. not 'well at least I didn't burn it' good. actually, genuinely, delicious good. and I'm shocked. 'cause I was just throwin' stuff in a pan hopin' for the best. no recipe. no plan. just vibes. and vibes-based cookin' worked today. this is the peak. it's all downhill from here. tomorrow I'll burn water."
    ], context: "nailed it は「バッチリ決めた」。nail(釘)を打つように一発で決める。You nailed it(完璧だよ)は最高の褒め言葉。a hit は「大当たり」。ヒット曲の hit と同じ。英語は成功を「釘を打つ」「当てる」で表現する。打撃系。日本語の「当たり」も同じだけど、nail it は自分の技術で当てたニュアンスがある。運じゃなくて実力。", category: 'reaction', month: '2026-03' },
    { daySlot: 7, japanese: '片付けが面倒', english: [
        "dreadin' the dishes",
        "the cookin' was fun but now I gotta deal with the dishes",
        "I love cooking but whoever invented dirty dishes is my enemy",
        "the food was great. the cookin' was fun. and now I'm starin' at the sink full of dishes and my soul is leavin' my body. this is the part nobody talks about. cookbooks don't have a chapter called 'now wash everything for thirty minutes.' and there's always that one pan that needs soakin'. and soakin' means 'I'll deal with it tomorrow.' and tomorrow means 'it'll sit there for three days.' I know myself."
    ], context: "dread は「ものすごく嫌がる」。fear(恐怖)より弱くて、嫌だけど避けられない感じ。I'm dreading Monday(月曜が来るのが嫌すぎる)。dread は「来るとわかってる嫌なこと」に使う。日本語の「面倒」は作業の重さだけど、英語の dread は精神的な嫌悪。soaking は「つけ置き」だけど、実際は「後回し」の婉曲表現。万国共通の食器洗い回避戦略。", category: 'opinion', month: '2026-03' },
    { daySlot: 7, japanese: '出前にしようか', english: [
        "just order in?",
        "wanna just order in? I don't feel like cookin'",
        "let's skip cooking tonight and just order delivery, I'm too tired",
        "let's order in. and I know we said we'd cook more this month. I know. the grocery bags are right there. the ingredients are bought. the recipe is pulled up on my phone. but I looked at all of that and my body said 'no.' and when the body says no, you listen. delivery isn't givin' up. delivery is... strategic delegation. I'm outsourcin' my dinner. that's smart. that's efficiency. that's definitely not laziness."
    ], context: "order in は「出前を取る」。in が「家の中に」で、外に行かずに食べ物を中に呼ぶ。eat out(外食)の反対。order in(出前)、eat in(家で食べる)、dine in(店内で食べる)。in/out で食事の場所を管理する。delivery(配達)も使うけど、order in のほうがカジュアルで「外出る気ない」感が強い。", category: 'suggestion', month: '2026-03' },
    { daySlot: 7, japanese: 'おかわりしていい？', english: [
        "seconds?",
        "can I go for seconds? this is too good to stop",
        "is there enough for seconds? 'cause I could definitely eat more",
        "can I get seconds? and I know I already had a full plate. and I know I said I was tryin' to eat less. and I know my stomach is technically full. but my mouth is not full. my mouth still wants more. and there's a difference between stomach full and mouth full and right now my mouth is runnin' the show. stomach says stop. mouth says go. mouth always wins. always."
    ], context: "seconds は「おかわり」。second helping の省略。最初の一杯が first、おかわりが seconds。go for seconds は「おかわりを取りに行く」。英語はおかわりを「2回目」と数字で処理する。thirds(3回目)も理論的にはあるけど、あまり言わない。日本語の「おかわり」は「代わりをまた」で行為の繰り返し。英語は回数管理。1回目、2回目。ビジネスライク。", category: 'request', month: '2026-03' },

    // -- Day 8: テクノロジー (Technology & devices) --
    { daySlot: 8, japanese: 'Wi-Fi繋がらないんだけど', english: [
        "Wi-Fi's down",
        "the Wi-Fi's not workin' again, what is goin' on",
        "the internet just dropped and I'm in the middle of something important",
        "the Wi-Fi is down. and I'm in the middle of sendin' an email. a important email. and now I'm just sittin' here watchin' the little circle spin. spinnin' and spinnin'. and I'm hittin' refresh like that's gonna help. it never helps. but I do it anyway. every time. like refresh is a magic spell. 'maybe if I click it harder.' that's not how technology works. but my brain doesn't care."
    ], context: "down は「落ちてる」「動いてない」。the server is down(サーバーが落ちてる)、my phone is down(電話が使えない)。up が「稼働中」、down が「停止中」。英語はシステムの状態を上下で管理する。up and running(稼働中)、go down(落ちる)、bring it back up(復旧させる)。テクノロジーの世界は全部上下運動。", category: 'reaction', month: '2026-03' },
    { daySlot: 8, japanese: 'アプデしたら変になった', english: [
        "update broke it",
        "I updated the app and now everything's messed up",
        "why do I always update immediately? I should know better by now",
        "I updated. why. why did I update. it was workin' fine before. fine. and then that little notification popped up sayin' 'update available' and my finger just tapped it. no research. no checkin' reviews. just blind trust. and now the whole layout is different and the button I used to press is gone and there's a new feature I didn't ask for. every update makes things worse. that's the law. I should have that tattooed on my hand. 'do not update.'"
    ], context: "broke it は「壊した」。break は「壊す」で、アップデートが犯人。英語ではソフトウェアの不具合を break で語る。the update broke the app(アプデがアプリを壊した)、don't break anything(何も壊すなよ)。コードの世界では break は日常語。messed up は「めちゃくちゃにした」で、mess(散らかり)+ up(完全に)。散らかりが完了した状態。", category: 'reaction', month: '2026-03' },
    { daySlot: 8, japanese: 'パスワード何だっけ', english: [
        "forgot my password",
        "what was my password again... I literally just changed it",
        "I reset my password last week and I already have no idea what it is",
        "I forgot my password. again. and I just changed it. three days ago. 'cause they made me change it 'cause it 'didn't meet security requirements.' so I made a new one with a capital letter and a number and a symbol and a hieroglyph and the blood of a unicorn. and now I can't remember it. 'cause it's not a word. it's a hostage negotiation. P@ssw0rd! that's not a password. that's a cry for help."
    ], context: "forgot my password は現代人の定番セリフ。英語では password fatigue(パスワード疲れ)という言葉まである。reset は「リセット」で re(再び)+ set(設定する)。meet requirements は「要件を満たす」で、パスワードが試験に合格するイメージ。英語はパスワードに人格を与えて「要件を満たせ」と命令する。パスワードが受験生。", category: 'reaction', month: '2026-03' },
    { daySlot: 8, japanese: '通知多すぎてうざい', english: [
        "notification overload",
        "my phone won't stop buzzin', I'm about to throw it",
        "I get so many notifications that I've stopped reading any of them",
        "my phone has buzzed forty-seven times today. forty-seven. I counted. and out of those forty-seven, maybe two were important. two. the rest were apps beggin' for my attention like 'hey come back!' 'you haven't opened me in a while!' 'your friend posted something!' I don't care. I didn't ask for this. my phone is supposed to work for me, not the other way around. I'm turnin' on do not disturb. permanently."
    ], context: "overload は「過負荷」。over(超えて)+ load(荷物)。情報の荷物が多すぎて壊れそう。information overload(情報過多)、sensory overload(感覚過多)。英語はストレスを重量で表現する。日本語の「多すぎてうざい」は感情だけど、英語は物理的な重さとして語る。脳の上に通知が積み重なって潰れるイメージ。", category: 'opinion', month: '2026-03' },
    { daySlot: 8, japanese: 'バッテリー残り3%', english: [
        "about to die",
        "my phone's at 3%, I'm livin' on borrowed time",
        "my battery is at 3% and I don't have a charger, this is a crisis",
        "3%. three percent. and I'm not near a charger. and I need this phone. I need maps. I need my train pass. I need to text someone that I'm gonna be late. and this little rectangle of glass is about to betray me. and it's my fault 'cause I watched videos on the train and drained it. and now I'm rationing battery like it's water in a desert. close all apps. lower brightness. don't breathe on it. 3% is a hostage situation."
    ], context: "about to die は「死にそう」。英語ではバッテリーが死ぬ。my phone died(スマホが死んだ)、it's dying(死にかけてる)。日本語は「切れる」だけど、英語は「死ぬ」。デバイスに生死の概念がある。living on borrowed time は「借りた時間で生きてる」=「もう時間がない」。バッテリー3%は延命治療中。英語はスマホの電池切れを命の話にする。", category: 'reaction', month: '2026-03' },
    { daySlot: 8, japanese: '既読スルーされてる', english: [
        "left on read",
        "they left me on read and it's been two hours",
        "I can see they read my message and they're not responding, so that's fun",
        "left on read. two hours ago. and I can see the read receipt. the blue check marks. starin' at me. mockin' me. they read it. they saw it. and they chose silence. and now I'm sittin' here wonderin' if I said somethin' wrong. was it the message? the tone? the emoji? should I send a follow-up? no. that's desperate. but also... maybe just a casual '?' no. don't do it. be cool. I'm not cool. I'm refreshin' the chat every thirty seconds."
    ], context: "left on read は「既読スルー」。leave(残す)+ on read(既読の状態で)。2010年代に生まれた表現。read receipt(既読通知)のせいで「読んだのに返事しない」が可視化された。英語はこの現象に即座に名前をつけた。ghost(ゴースト=急に連絡を絶つ)も同じ。デジタルコミュニケーションの新現象に名前をつけるスピードが英語は異常に速い。", category: 'reaction', month: '2026-03' },
    { daySlot: 8, japanese: '画面割れたまま使ってる', english: [
        "cracked screen gang",
        "my screen's been cracked for months and I'm just livin' with it",
        "I dropped my phone and the screen cracked but I refuse to pay to fix it",
        "my screen is cracked. has been for like four months. and I'm still usin' it. every day. runnin' my finger over broken glass like that's normal. and everyone who sees it goes 'oh you should get that fixed.' yeah. I know. I should. but it still works. everything still functions. it's cosmetic damage. and cosmetic damage is just character in my book. my phone has battle scars. it's lived a life. we've been through things together."
    ], context: "cracked は「ひび割れた」。crack は「パキッとひび割れる音と状態」が一語。英語は音と結果が一体化した動詞が多い。snap(パキッと折れる)、pop(ポンと弾ける)、splash(バシャッとかかる)。日本語は「割れた」で結果だけだけど、英語の cracked には割れた瞬間の音が残ってる。cosmetic damage は「見た目だけの損傷」で、機能は無事。英語は damage を外見と機能で分類する。", category: 'opinion', month: '2026-03' },
    { daySlot: 8, japanese: 'ググればわかる', english: [
        "just google it",
        "just google it, you'll find it in two seconds",
        "you don't need to ask me, the answer is literally one search away",
        "just google it. and I don't mean that rudely. well, maybe a little rudely. but we live in an age where the answer to 90% of questions is in your pocket. on that little glowing rectangle. and yet people still ask other people questions that Google could answer in 0.3 seconds. 'what time does it close?' google it. 'how far is it?' google it. I love helpin' but I'm not a search engine. or am I. don't google that."
    ], context: "google it は「ググれ」。Google が動詞になった稀有な例。名詞→動詞の転換(conversion)が英語は自由すぎる。Uber there(Uberで行け)、Photoshop it(フォトショで加工しろ)。ブランド名がそのまま動詞になる。日本語も「ググる」を輸入したけど、英語はこれを文法レベルでゼロコストでやる。名詞と動詞の境界が存在しない。", category: 'shutdown', month: '2026-03' },
    { daySlot: 8, japanese: 'データ飛んだ', english: [
        "lost everything",
        "my data's gone, I didn't back it up, I wanna cry",
        "everything I was working on just vanished and I have no backup",
        "it's gone. all of it. gone. I didn't save. I didn't back up. I just assumed the cloud was handlin' it. the cloud. I trusted the cloud. and the cloud betrayed me. three hours of work. vanished. into the actual cloud. and now I'm sittin' here with an empty screen and an empty soul tryin' to remember what I wrote. and I can't. 'cause my brain didn't back up either. lesson learned? probably not."
    ], context: "back up は「バックアップする」。back(後ろに)+ up(上に)。データを後方の安全な場所に置く。面白いのは back up が「車をバックさせる」「支援する」「渋滞する」にもなること。I'll back you up(援護する)、traffic backed up(渋滞した)。同じ back up で意味が5つくらいある。英語の句動詞は一つの組み合わせで世界を回す。", category: 'reaction', month: '2026-03' },
    { daySlot: 8, japanese: 'このアプリ神', english: [
        "game changer",
        "this app is a game changer, seriously where has it been",
        "I just found this app and it does everything I needed, I'm obsessed",
        "this app. this app. I just found it and I don't know how I was livin' without it. like, I was doin' things the hard way this whole time. manually. like a caveman. and now this app does it in two taps. two taps. and I wanna tell everyone about it. but nobody cares. I've tried. 'hey you should try this app.' 'sure.' they never try it. so I'm just here. alone. obsessed with an app. doin' two-tap things while everyone else does it in twenty."
    ], context: "game changer は「ゲームのルールを変えるもの」=「革命的なもの」。スポーツから来た表現で、試合の流れを一変させるプレー。それが日常語になって「人生を変えるレベルのもの」に。obsessed は「取り憑かれてる」で、ハマりすぎて離れられない。日本語の「神」は一語で最上級。英語は game changer, life-changing, revolutionary と段階がある。でも会話では this is insane の一言で全部カバーする。", category: 'reaction', month: '2026-03' },
    // -- Day 9: 仕事・オフィス --
    { daySlot: 9, japanese: '今日やる気ゼロ', english: [
        "zero motivation",
        "I got zero motivation today, don't ask me to do stuff",
        "I walked into work today with absolutely zero motivation and it hasn't improved since",
        "zero motivation. like, genuinely zero. I sat down at my desk, opened my laptop, stared at it for a solid ten minutes, and then closed it again. my brain's on strike today. it didn't even file a complaint, just walked off the job. I'm basically a warm body occupyin' a chair right now."
    ], context: "motivation は日本語の「やる気」にぴったりだけど、使い方が違う。日本語は「やる気がない」と「ない」で消す。英語は zero motivation と数字で量を表す。英語は感情や意欲すら数値化する。zero tolerance, zero interest, zero chance。全部ゼロで「完全にない」。日本語は「ない」の一語。英語はわざわざゼロを置いて「測定した結果、ゼロでした」って報告する。理系の言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 9, japanese: '会議長すぎ', english: [
        "that meeting dragged",
        "that meeting dragged on forever, I lost half my day",
        "the meeting went way over time and I couldn't get anything done after",
        "that meeting dragged on so long I forgot why we were there. someone brought up one question and then we spiraled into forty-five minutes of people sayin' the same thing in slightly different words. I coulda sent that in an email. actually, someone DID send it in an email. we just read the email out loud together. as a group. for an hour."
    ], context: "drag on は「ダラダラ続く」。drag は「引きずる」が原義で、重い物を引きずるように時間が進まない感覚。日本語は「長い」で形容詞一発。英語は drag という動詞で「時間が自分の意志に反して引き延ばされてる」ことを表現する。被害者感がある。時間が自分を引きずってる。", category: 'reaction', month: '2026-03' },
    { daySlot: 9, japanese: '上司に振り回される', english: [
        "my boss is all over the place",
        "my boss keeps changin' his mind and I'm the one runnin' around",
        "every time I finish something my boss changes direction and I have to start over",
        "my boss is all over the place. Monday it's 'do this.' Tuesday it's 'actually, do that.' Wednesday it's 'why didn't you finish the first thing?' and I'm sittin' there like, 'cause YOU told me to stop? but you can't say that. you just nod and redo everything. it's like workin' for a GPS that keeps recalculatin'."
    ], context: "all over the place は「あちこちバラバラ」。直訳は「あらゆる場所に散らばってる」。日本語の「振り回される」は受身で被害を表現するけど、英語は相手を主語にして「あいつがバラバラなんだ」と描写する。自分の被害じゃなくて相手の状態として言う。攻撃ではなく観察として伝えるのが英語流。", category: 'opinion', month: '2026-03' },
    { daySlot: 9, japanese: 'この仕事向いてないかも', english: [
        "not cut out for this",
        "I don't think I'm cut out for this job honestly",
        "I've been thinking lately that maybe I'm just not cut out for this kind of work",
        "I don't think I'm cut out for this. and it's not like I'm bad at it -- I can DO the work. but there's a difference between bein' able to do somethin' and actually bein' built for it. some people wake up excited about spreadsheets. I wake up and the spreadsheet is already judgin' me. that's the difference."
    ], context: "cut out for は「向いている」。元は布を型に合わせて切り抜くイメージ。自分がその仕事の型にハマる形に切られてるかどうか。日本語は「向いてる」で方向のメタファー。英語は「その形に切り出されてるか」。つまり英語では適性は生まれつきの形。日本語では進む方向。根本的に違う。", category: 'opinion', month: '2026-03' },
    { daySlot: 9, japanese: 'やっと終わった', english: [
        "finally done",
        "FINALLY. that took way longer than it should've",
        "I finally finished and I honestly don't know how I got through it",
        "finally done. FINALLY. I've been starin' at this thing for three days and it's done. is it perfect? no. do I care? also no. it's done and that's all that matters right now. I'm hittin' save, closin' the file, and I'm not openin' it again till someone forces me. it's their problem now."
    ], context: "finally は「やっと」だけど、感情の爆発力が違う。日本語の「やっと」は静かな安堵。英語の finally は「待たせやがって!」の怒りと解放が混ざってる。FINALLY! と大文字で書くと「いい加減にしろ、やっとかよ!」。finally には苦労の蓄積が全部詰まってる。我慢の限界突破ワード。", category: 'reaction', month: '2026-03' },
    { daySlot: 9, japanese: 'サボりたい', english: [
        "wanna slack off",
        "I just wanna slack off and do nothin' productive",
        "I really don't feel like working today, I just want to slack off",
        "I wanna slack off so bad. like, not even hide-it-slack-off. full on, feet-on-the-desk, scrollin'-my-phone, openly-not-workin' slack off. the dream is gettin' paid to stare out the window and think about lunch. that's the job I want. chief window officer. CWO."
    ], context: "slack off は「サボる」。slack は「たるんだロープ」が原義。ロープがピンと張ってない=緊張感がない=仕事してない。日本語の「サボる」はフランス語の sabotage から来てるけど、英語の slack off はもっと緩い。破壊工作じゃなくて、ただ弛んでるだけ。悪意なき怠惰。", category: 'opinion', month: '2026-03' },
    { daySlot: 9, japanese: '締め切りヤバい', english: [
        "deadline's comin'",
        "the deadline's breathin' down my neck and I'm not ready",
        "the deadline is way too close and I haven't even started the hard part yet",
        "the deadline is breathin' down my neck. I can feel it. it's right there. and the worst part is I had two weeks. TWO WEEKS. and I spent the first week and a half tellin' myself I'd start tomorrow. tomorrow never came. well, it came, but I wasn't ready for it. I'm never ready for tomorrow. tomorrow is my nemesis."
    ], context: "breathing down my neck は「首の後ろで息してる」=「追い詰められてる」。締め切りを人間扱いして、後ろに立たれてる恐怖で表現する。日本語の「ヤバい」は万能形容詞だけど、英語は脅威を擬人化して具体的な恐怖シーンにする。英語は抽象的なプレッシャーを映画のワンシーンにする言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 9, japanese: 'それ俺の仕事じゃないし', english: [
        "not my job",
        "that's not my job and I'm not doin' it",
        "that's not in my job description so I'm gonna have to pass on that one",
        "that's not my job. I know that sounds cold but hear me out. if I start doin' everyone else's stuff, suddenly it IS my job 'cause I did it once. and once you do somethin' once, the expectation is set. you become 'the guy who does that.' I don't wanna be that guy. I got enough guys I already am."
    ], context: "not my job は日本語だと言いにくいフレーズ。日本の職場文化では「それ俺の担当じゃない」って言うと冷たく聞こえる。でも英語圏では boundary setting（境界線を引く）として健全。that's above my pay grade（俺の給料で対応する話じゃない）もよく使う。自分の領域を守るのは英語では美徳。", category: 'shutdown', month: '2026-03' },
    { daySlot: 9, japanese: '根回ししとかないと', english: [
        "gotta lay the groundwork",
        "I gotta lay the groundwork first or this ain't gonna fly",
        "before I bring this up in the meeting I need to lay the groundwork with a few people",
        "gotta lay the groundwork. can't just walk in there and drop the idea cold. people don't like surprises in meetings. so you gotta go around before the meeting, plant the seed, let 'em think about it, and by the time you actually propose it, half the room already thinks it was their idea. that's how stuff gets done. politics, baby."
    ], context: "lay the groundwork は「地盤を作る」=「根回しする」。groundwork は建物の基礎工事。英語も日本語も「根」「地盤」と地面のメタファーを使うのが面白い。ただし英語は lay（置く）で自分が主体的に作る感覚。日本語の「根回し」は植木の移植準備が原義で、もっと繊細。英語版の方が建設工事っぽくて力強い。", category: 'suggestion', month: '2026-03' },
    { daySlot: 9, japanese: '仕事終わり何する？', english: [
        "what're you doin' after work",
        "hey what're you doin' after work? I need a drink",
        "so what's the plan after work? I could really use a break from all this",
        "what're you doin' after work? 'cause I need to do somethin' that isn't starin' at a screen. my eyes are done. my brain is done. my soul left the office around 2 PM. I'm just the shell now. I need food, a drink, and a conversation that has nothin' to do with deliverables. zero deliverables talk. that's my only rule tonight."
    ], context: "what are you doing after は「何する?」だけど、英語は未来のことでも現在進行形で聞く。what are you doing tonight?（今夜何してる?）。日本語感覚だと「今してる最中」に聞こえるけど、英語では近い未来は進行形で語る。「もう予定が動き出してる」イメージ。英語の時制はタイムラインじゃなくて心理的距離。", category: 'suggestion', month: '2026-03' },

    // -- Day 10: 趣味・ハマり --
    { daySlot: 10, japanese: '最近ハマってる', english: [
        "I'm really into it",
        "I've been super into it lately, can't stop",
        "I've been really into this thing lately and it's basically taken over my free time",
        "I've been super into it. like, embarrassingly into it. I started a week ago and now it's all I think about. I'm watchin' videos about it, readin' forums at 2 AM, talkin' about it to people who clearly don't care. I've become that person. the person who won't shut up about their new thing. I'm aware. I don't care."
    ], context: "be into は「ハマってる」。into は「中に入ってる」が原義。趣味の中に自分が入り込んでるイメージ。日本語の「ハマる」も穴にハマるだから似てるけど、英語の into はもっと能動的。自分から中に飛び込んでる。I'm into you なら「あなたに夢中」。物理的に相手の中に入りたいくらい好き。ちょっと怖い。", category: 'reaction', month: '2026-03' },
    { daySlot: 10, japanese: '沼にハマった', english: [
        "fell down the rabbit hole",
        "I fell down the rabbit hole and I can't get out",
        "I started looking into it and fell completely down the rabbit hole",
        "I fell down the rabbit hole. hard. it started with one YouTube video. 'just one,' I said. three hours later I'm on some guy's blog from 2014 readin' about obscure techniques that I will never use but absolutely need to know. the rabbit hole has no bottom. it just keeps goin'. and I keep followin'. willingly."
    ], context: "rabbit hole は「不思議の国のアリス」から来た表現。アリスがウサギの穴に落ちて別世界に行ったように、一つの興味からどんどん深みにハマる。日本語の「沼」と同じ概念。でも英語は「穴に落ちる」で始まりは偶然。日本語の「沼」は底なし沼で抜け出せない。英語は冒険、日本語は罠。ポジティブ度が違う。", category: 'reaction', month: '2026-03' },
    { daySlot: 10, japanese: '何が楽しいのかわからない', english: [
        "I don't get the appeal",
        "I honestly don't get the appeal, sorry",
        "I've tried to understand what people see in it but I just don't get the appeal",
        "I don't get the appeal. and I've tried. I watched people do it, I read about it, I even attempted it once. nothin'. zero spark. and everyone's actin' like it's the greatest thing ever and I'm sittin' there like... am I broken? is this what bein' old feels like? when the world moves on and you're just standin' there confused?"
    ], context: "appeal は「魅力」だけど、元は裁判用語の「訴え」。I don't get the appeal は「その訴えが通らない」=「魅力が自分に届かない」。get は「理解する」。日本語の「何が楽しいか分からない」は自分の理解力の話。英語は appeal が自分に reach してない、つまり魅力の方に問題があるニュアンス。責任転嫁が上手い言語。", category: 'opinion', month: '2026-03' },
    { daySlot: 10, japanese: '一回やってみなよ', english: [
        "just try it once",
        "just try it once, you might actually like it",
        "I know it sounds weird but just try it once and see what you think",
        "just try it once. that's all I'm askin'. one time. if you hate it, fine, I'll never bring it up again. but you can't say you don't like somethin' you've never tried. that's like sayin' you don't like a restaurant you've never been to. give it one shot. one. if it's terrible, I'll buy you dinner as an apology."
    ], context: "just try it once の just が重要。just は「ちょっとだけ」のハードルを下げる魔法。just one bite（一口だけ）、just hear me out（ちょっと聞いてよ）、just think about it（考えるだけでいいから）。全部 just で相手の抵抗を溶かす。日本語の「ちょっと」と同じ機能だけど、英語の just はもっと戦略的。営業トーク必須ワード。", category: 'suggestion', month: '2026-03' },
    { daySlot: 10, japanese: '気づいたら朝だった', english: [
        "lost track of time",
        "I completely lost track of time and it was already morning",
        "I sat down to play for an hour and before I knew it the sun was coming up",
        "I lost track of time. completely. sat down at like 10 PM thinkin' I'd do it for an hour. next thing I know, birds are chirpin'. BIRDS. the sun is comin' up. I haven't moved in six hours. my back hurts. my eyes are dry. but was it worth it? absolutely. I regret nothin'. well, maybe the back thing."
    ], context: "lose track of は「見失う」。track は「足跡・軌道」。時間の足跡を追えなくなった、つまり時間がどこに行ったかわからない。日本語は「気づいたら」で意識の話。英語は track（追跡）を lose（失う）で、時間を追いかけてたのに逃げられた感覚。英語は時間を獲物として扱う。ハンター言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 10, japanese: '飽きっぽいんだよね', english: [
        "I get bored easy",
        "I get bored of stuff real quick, it's a problem",
        "I'm the kind of person who gets really into something and then moves on way too fast",
        "I get bored easy. like, dangerously easy. I'll be obsessed with somethin' for two weeks, buy all the gear, watch every tutorial, tell everyone about it, and then one day... nothin'. the fire's out. and now I got a closet full of hobbies I abandoned. guitar, camera, runnin' shoes. it's a hobby graveyard in there."
    ], context: "get bored は「飽きる」。bore は「退屈させる」で受身。I'm bored は「退屈させられてる」=「退屈だ」。日本語の「飽きっぽい」は自分の性格。英語は I get bored easily で「自分は簡単に退屈させられる」。退屈にさせた原因が外にある書き方。飽きたのは俺のせいじゃない、退屈が俺を襲ったんだ。責任回避の文法。", category: 'opinion', month: '2026-03' },
    { daySlot: 10, japanese: '推しが尊い', english: [
        "I stan so hard",
        "I stan so hard, they can do no wrong in my eyes",
        "my favorite is so amazing that everything they do just feels precious to me",
        "I stan so hard it's not even funny. every time they post somethin' I lose it. they could literally sneeze and I'd be like 'that was art.' I know it's irrational. I know I'm bein' ridiculous. but the heart wants what it wants and my heart wants to throw money at someone who doesn't know I exist. normal human behavior."
    ], context: "stan はエミネムの曲から生まれた新しい動詞。熱狂的なファン= stan。日本語の「推し」文化を英語が取り込んだ。でも「尊い」に直接対応する英語はない。precious、sacred と言えるけど、日本語の「尊い」にある崇拝+感動+泣きそうの複合体は英語で一語にならない。日本のオタク文化が生んだ翻訳不能語。", category: 'reaction', month: '2026-03' },
    { daySlot: 10, japanese: 'にわかだけど', english: [
        "I'm a total newbie",
        "I'm a total newbie at this, don't judge me",
        "I just got into it so I'm still a total newbie and don't know much yet",
        "I'm a total newbie. like, I started last week. I don't know the lingo, I don't know the history, I don't know the unwritten rules yet. but I'm here and I'm enthusiastic and I think that should count for somethin'. every expert was a beginner once, right? that's what I tell myself while I'm googlin' the most basic stuff."
    ], context: "にわか は日本語特有の概念。「最近知ったくせに語るな」という批判を先に封じる予防線。英語の newbie は単に「新人」で、にわかの持つ「浅い知識で偉そうにしてる」ニュアンスがない。I'm no expert とか I just got into it で近づけるけど、にわかの「自嘲+防御」の二重機能は英語にない。日本語のファン文化の繊細さ。", category: 'filler', month: '2026-03' },
    { daySlot: 10, japanese: 'オタクで何が悪い', english: [
        "and I'm proud of it",
        "yeah I'm obsessed, and I'm proud of it, fight me",
        "I know I'm way too into this but honestly I don't care what anyone thinks",
        "yeah I'm obsessed. and? what about it? at least I got somethin' I'm passionate about. some people go home and stare at the ceiling. I go home and I got a whole world waitin' for me. it makes me happy. it hurts nobody. so if you wanna judge me for havin' a thing I love, go ahead. I'll be over here havin' fun."
    ], context: "「何が悪い」に対応する英語は and? / so what? / what about it? 全部「だから何?」の開き直り。日本語は「何が悪い」と疑問形で反撃するけど、英語は and? の一語で相手の批判を無効化する。たった三文字で「お前の意見は求めてない」を伝える。英語の and? は世界最短の反論。", category: 'shutdown', month: '2026-03' },
    { daySlot: 10, japanese: 'これ見て、すごくない？', english: [
        "check this out",
        "dude check this out, isn't this insane?",
        "look at this, seriously, tell me this isn't the coolest thing you've ever seen",
        "check this out. no seriously, stop what you're doin' and look at this. isn't this insane? I found it at like 3 AM and I've been waitin' all day to show someone. and you're the lucky winner. look at the detail. LOOK AT IT. I need someone to be as excited as I am right now 'cause I'm losin' my mind over here alone."
    ], context: "check this out は「これ見て」の定番だけど、check は「確認する」が原義。「見て楽しんで」じゃなくて「確認しろ」。英語は感動の共有を命令形でやる。look at this, check this out, tell me this isn't amazing。全部命令。日本語は「すごくない?」と同意を求める。英語は「見ろ、認めろ、同意しろ」と攻めてくる。感動の押し売り言語。", category: 'request', month: '2026-03' },

    // -- Day 11: 人間関係の距離 --
    { daySlot: 11, japanese: 'あの人ちょっと距離感おかしい', english: [
        "no sense of boundaries",
        "that person has zero sense of personal boundaries",
        "something about the way they act is just a little too close for comfort",
        "that person has no sense of boundaries. like, I met 'em twice and they're already actin' like we're best friends. sharin' personal stuff, touchin' my shoulder, askin' about my weekend. bro, we're acquaintances. there's a process. you gotta earn the friendship tier. you can't just skip the tutorial."
    ], context: "boundaries は「境界線」。英語圏では personal boundaries（個人の境界線）が超重要概念。日本語の「距離感」は空間のメタファーだけど、英語の boundaries はフェンスや壁のイメージ。「線を越えるな」と明確に区切る。日本語は「なんとなく近すぎる」、英語は「俺の領域に入ってくるな」。英語の方がテリトリー意識が強い。", category: 'opinion', month: '2026-03' },
    { daySlot: 11, japanese: 'そこまで仲良くないけど', english: [
        "we're not that close",
        "I mean, we're not that close, so it's kinda weird",
        "we know each other but we're not really close enough for that kind of conversation",
        "we're not that close. like, we're friendly but we're not friends. there's a difference. friendly is 'hey how's it goin' in the hallway. friends is 'I'll help you move on a Saturday.' we are firmly in hallway territory. and that's fine. not everyone needs to be inner circle. some people are lobby people. and that's okay."
    ], context: "close は「近い」で、物理的距離がそのまま心理的距離になる英語の基本。we're close = 仲良い、we're not that close = そこまでじゃない。日本語は「仲良い」「仲良くない」で関係性を言うけど、英語は距離で語る。get closer（もっと仲良くなる）= 物理的に近づく動詞で心の距離を縮める。英語は心も GPS で管理してる。", category: 'filler', month: '2026-03' },
    { daySlot: 11, japanese: '深入りしない方がいい', english: [
        "don't get too involved",
        "I wouldn't get too involved in that if I were you",
        "I'd stay out of it honestly, getting too involved never ends well",
        "don't get too involved. I know you wanna help. I know you care. but some situations are like quicksand -- the more you move, the deeper you sink. just stand on solid ground and watch from a distance. sometimes the best thing you can do for someone is nothin'. hard to accept, but it's true."
    ], context: "get involved は「関わる」。involve は「巻き込む」が原義。get too involved = 巻き込まれすぎる。日本語の「深入り」は「深く入る」で自分の意志。英語の involved は「巻き込まれる」で、状況の方が自分を引っ張り込む。自分から入るんじゃなくて、入らされる。英語は人間関係のトラブルを「事故」のように語る。", category: 'suggestion', month: '2026-03' },
    { daySlot: 11, japanese: 'あいつとは表面的な付き合い', english: [
        "we keep it surface level",
        "we keep it surface level, nothin' deep",
        "our relationship is pretty surface level, we don't really talk about real stuff",
        "we keep it surface level. weather, sports, work complaints. that's the menu. and honestly, that's all I want from that relationship. not everyone needs to know my deep stuff. some people are small-talk people and that's their permanent role. I don't mean that as an insult. it's just resource allocation. emotional resource allocation."
    ], context: "surface level は「表面的」。surface = 表面。英語は関係の深さを水深で表現する。deep conversation（深い会話）、shallow friendship（浅い友情）、surface level（表面レベル）。日本語も「深い」「浅い」を使うけど、英語は level を付けて段階として測定する。関係性にレベルがある RPG 的発想。", category: 'opinion', month: '2026-03' },
    { daySlot: 11, japanese: '一人の時間が必要', english: [
        "I need my alone time",
        "I need my alone time, don't take it personally",
        "it's nothing personal but I really need some time to myself right now",
        "I need my alone time. and it's not 'cause I don't like you. it's 'cause I like me, and me needs to recharge. I'm like a phone. if you use me all day without pluggin' me in, I'm gonna hit 2% and start shuttin' down apps. social battery is a real thing. mine's blinking red right now. gotta plug in."
    ], context: "alone time は「一人の時間」。英語圏では me time、alone time、personal space を堂々と主張する。I need space は「距離が欲しい」。日本語で「一人にさせて」って言うと相手を傷つけそうだけど、英語では healthy boundaries として肯定される。introvert（内向的）がポジティブな自己紹介になる文化。一人を選ぶことが強さ。", category: 'request', month: '2026-03' },
    { daySlot: 11, japanese: 'なんか最近よそよそしくない？', english: [
        "they've been kinda distant",
        "is it just me or have they been kinda distant lately?",
        "I feel like they've been acting different around me, kind of cold and distant",
        "have they been kinda distant lately? or is it just me? 'cause last month we were talkin' every day and now it's like pulling teeth to get a reply. and the replies are short. one word. 'yeah.' 'cool.' 'lol.' that's not a conversation, that's a pulse check. something shifted and I can't figure out what."
    ], context: "distant は「遠い」。物理的距離が感情の距離になる英語の典型。He's been distant = 最近よそよそしい。距離が開いた感覚を一語で表現する。日本語は「よそよそしい」で「よそ」（他所）の繰り返し。英語は distant 一語。でも英語はこの distant に cold（冷たい）を足して cold and distant とよく言う。温度+距離のダブルパンチ。", category: 'reaction', month: '2026-03' },
    { daySlot: 11, japanese: '気を使いすぎて疲れる', english: [
        "walking on eggshells",
        "I'm so tired of walkin' on eggshells around everyone",
        "I spend so much energy being careful about what I say that it just drains me",
        "I'm so tired of walkin' on eggshells. every conversation feels like a minefield. did I say the wrong thing? was that too direct? should I not have mentioned that? it's exhaustin'. I just wanna talk like a normal human without runnin' every sentence through a sensitivity filter first. is that too much to ask?"
    ], context: "walking on eggshells は「卵の殻の上を歩く」。割れないように慎重に歩く=相手の機嫌を壊さないように気を使う。日本語の「気を使う」はエネルギーの消費。英語は物理的な緊張感で表現する。eggshells の壊れやすさが相手の感情の壊れやすさを映す。日本語は気配りの美学、英語は地雷原の恐怖。同じ行為なのに受け取り方が真逆。", category: 'reaction', month: '2026-03' },
    { daySlot: 11, japanese: '本音で話せる人って少ない', english: [
        "few people I can be real with",
        "there's only a few people I can actually be real with",
        "honestly the number of people I can have a completely honest conversation with is really small",
        "there's only a few people I can actually be real with. like, the list is short. dangerously short. most people get the filtered version of me. the 'I'm fine, how are you, nice weather' version. the real version -- the messy, opinionated, overthinking version -- that's reserved for like three people. and even they don't get all of it."
    ], context: "be real with は「本音で接する」。real = 本物の自分。keep it real（リアルでいろ）、get real（現実見ろ）。英語は「本物の自分」と「社会用の自分」を明確に分ける。日本語の「本音と建前」と似てるけど、英語は real/fake で語る。偽物か本物か。日本語は「表と裏」。英語の方が厳しい。fake は犯罪っぽい響きがある。", category: 'opinion', month: '2026-03' },
    { daySlot: 11, japanese: 'あの人苦手', english: [
        "not my favorite person",
        "yeah they're... not exactly my favorite person",
        "I don't have anything against them specifically but they're just not someone I click with",
        "they're not my favorite person. and I know that sounds harsh but I'm not sayin' I hate 'em. I just... don't vibe with 'em. you know those people where every interaction takes effort? like, it's not natural. it feels like work. and I got enough work at work. I don't need social work on top of it."
    ], context: "not my favorite person は「苦手」の婉曲表現。直接 I don't like them と言わずに「お気に入りではない」と控えめに言う。英語のポライトネス技術。日本語の「苦手」は「得意じゃない」で自分の能力の問題にする。英語は「好きランキングの上位にいない」と順位の問題にする。どっちも相手を直接否定しない回避テクニック。", category: 'opinion', month: '2026-03' },
    { daySlot: 11, japanese: 'ほっといてくれ', english: [
        "leave me alone",
        "just leave me alone for a bit, yeah?",
        "I'm not in the mood to talk right now so just leave me alone please",
        "just leave me alone. I'm not mad at you. I'm not mad at anyone specific. I'm just... full. my brain is full. my patience is full. my social tank is full -- actually it's empty. it's the opposite of full. I ran out. I'm on social fumes right now. so just gimme some space and I'll come back when I'm human again."
    ], context: "leave me alone は「ほっといて」。leave は「去る」じゃなくて「そのまま置いておく」。Leave it alone = 触るな。Leave me alone = 俺に構うな。日本語の「ほっとく」も「放っておく」で似てるけど、英語の leave me alone はもっと強い。almost 怒ってる。calm down と組み合わせると最悪の効果を発揮する。言われた側は余計に話しかけたくなる。", category: 'shutdown', month: '2026-03' },

    // -- Day 12: 失敗・ミス --
    { daySlot: 12, japanese: 'やらかした', english: [
        "I messed up",
        "I messed up bad, this is not good",
        "I really messed things up and I don't know how to fix it now",
        "I messed up. bad. and the worst part is I KNEW I was messin' up while I was doin' it. my brain was screamin' 'STOP' and my hands just kept goin'. it was like watchin' a car crash in slow motion except I was drivin'. now I gotta clean this up and pretend I had no idea it would go wrong. narrator voice: he had every idea."
    ], context: "mess up は「やらかす」。mess は「散らかす」が原義。状況をぐちゃぐちゃにした。screw up、blow it も同じ意味。英語は失敗を「破壊」で表現する。screw（ネジを壊す）、blow（爆破する）、mess（散らかす）。日本語の「やらかす」は「やってしまった」で、行為の完了。英語は結果の惨状をビジュアルで見せる。", category: 'reaction', month: '2026-03' },
    { daySlot: 12, japanese: '完全にミスった', english: [
        "totally blew it",
        "I totally blew it, there's no comin' back from this",
        "I completely dropped the ball and now everyone knows about it",
        "I totally blew it. like, not a small mistake. a full-blown, everyone-saw-it, can't-pretend-it-didn't-happen blunder. the kind where you lie in bed at 3 AM replaying it. I'm gonna be replaying this one for years. this is a core memory now. a bad one. it's goin' in the hall of shame right next to that time I -- actually, never mind."
    ], context: "drop the ball は「ボールを落とす」=「チャンスを逃す・ミスる」。スポーツのメタファー。blow it は「吹き飛ばす」=「台無しにする」。英語は失敗をスポーツと爆発で語る。日本語の「ミスった」は淡白。英語は drop, blow, crash, bomb と全部派手。失敗すら大げさに演出する。エンタメ言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 12, japanese: 'あの時ああしてれば', english: [
        "shoulda done it different",
        "I shoulda done it different, I keep thinkin' about it",
        "if I could go back I would've handled the whole situation completely differently",
        "I shoulda done it different. I know that now. hindsight's 20/20 and all that. but man, if I could go back... I'd change like three things. just three small decisions and the whole outcome woulda been different. but you can't go back. you just gotta sit with it. sit with the shoulda-coulda-woulda and eventually it stops hurtin'. eventually. not today though."
    ], context: "should have = shoulda（すべきだった）。英語の後悔三兄弟: shoulda（すべきだった）、coulda（できたのに）、woulda（したのに）。全部過去を悔やむ。日本語は「〜してれば」の一パターン。英語は should/could/would で後悔の種類を分ける。義務の後悔、可能性の後悔、意志の後悔。後悔にも文法がある。几帳面。", category: 'opinion', month: '2026-03' },
    { daySlot: 12, japanese: '言わなきゃよかった', english: [
        "shouldn't have said that",
        "I really shouldn't have said that, my mouth moves faster than my brain",
        "the second it came out of my mouth I knew I should've kept that to myself",
        "I shouldn't have said that. the SECOND it left my mouth I wanted to grab it out of the air and shove it back in. but words don't work like that. once they're out, they're out. flyin' around the room. hittin' people in the face. and everyone's lookin' at me like I just set off a fire alarm in a library. which, emotionally, I kinda did."
    ], context: "shouldn't have said that は「言わなきゃよかった」だけど、面白いのは came out of my mouth。英語は言葉が「口から出てくる」もの。自分が言ったんじゃなくて、言葉が勝手に出た。it slipped out（滑り出た）、it came out wrong（変な形で出た）。英語は失言を「口から脱走した言葉」として描く。俺は悪くない、口が悪い。", category: 'reaction', month: '2026-03' },
    { daySlot: 12, japanese: 'ドンマイ', english: [
        "don't sweat it",
        "don't sweat it, everyone messes up",
        "hey seriously don't worry about it, it's not as bad as you think",
        "don't sweat it. I know it feels like the end of the world right now but I promise it's not. a year from now you won't even remember this. actually that's a lie, you'll remember it at 3 AM randomly. but it won't MATTER. that's the point. the embarrassment fades. the lesson stays. or somethin' deep like that. I dunno, I'm tryin' to make you feel better."
    ], context: "don't sweat it は「気にするな」。sweat は「汗をかく」。心配して汗かくな、の意味。日本語の「ドンマイ」は don't mind の和製英語だけど、ネイティブは don't mind とは言わない。don't sweat it、don't worry about it、no big deal が自然。ドンマイは日本に帰化した英語の幽霊。元の形はもう存在しない。", category: 'filler', month: '2026-03' },
    { daySlot: 12, japanese: '取り返しがつかない', english: [
        "there's no undoing this",
        "there's no undoing this one, the damage is done",
        "I think I've gone past the point of no return and there's no way to fix it now",
        "there's no undoing this. the damage is done. and I've been sittin' here for an hour tryin' to figure out a way to undo it and there isn't one. it's like tryin' to unscramble an egg. you can't. the egg is scrambled. that's its life now. and this situation is my scrambled egg. I just gotta eat it and move on."
    ], context: "the damage is done は「ダメージは済んだ」。point of no return は「帰れない地点」。undo は「元に戻す」で、Ctrl+Z 的な発想。英語は失敗の修復不可能性を「一方通行」で語る。there's no going back、can't unring the bell（鳴らした鐘は戻せない）。日本語の「取り返し」は「取って返す」。英語は物理法則で不可逆を説明する。理系っぽい。", category: 'shutdown', month: '2026-03' },
    { daySlot: 12, japanese: '笑い話にできる日が来るかな', english: [
        "maybe someday I'll laugh",
        "maybe someday I'll laugh about this but today is not that day",
        "I keep telling myself it'll be a funny story eventually but right now it still stings",
        "maybe someday I'll laugh about this. that's what people say, right? 'you'll look back and laugh.' cool. when? 'cause right now I'm lookin' back and cringing. hard. like, full-body cringe. maybe in five years. maybe ten. maybe on my deathbed I'll finally chuckle about it. 'remember when I...' and then I'll flatline. perfect comedic timing."
    ], context: "look back and laugh は「振り返って笑う」。英語では comedy = tragedy + time（コメディ = 悲劇 + 時間）という公式がある。今は辛いけど、時間が経てば笑い話になる。日本語の「笑い話」も同じ発想だけど、英語は look back で時間軸の移動を明示する。今の自分を未来の自分が見下ろしてる構図。タイムトラベル的後悔処理。", category: 'opinion', month: '2026-03' },
    { daySlot: 12, japanese: '同じミス繰り返すのやめたい', english: [
        "gotta break the cycle",
        "I gotta break the cycle, I keep makin' the same mistake",
        "I'm so tired of making the same mistake over and over, I need to actually change this time",
        "I gotta break the cycle. 'cause right now I'm in a loop. I mess up, I feel bad, I promise myself I'll change, I feel better, and then I do the exact same thing again. it's like a bad subscription I can't cancel. the mess-up-monthly plan. unlimited regret. auto-renewed every time I think I've learned my lesson. spoiler: I have not."
    ], context: "break the cycle は「サイクルを壊す」。繰り返しパターンを物理的に「破壊」するイメージ。英語は悪習慣を cycle（回転）として捉える。vicious cycle（悪循環）を break する。日本語は「繰り返す」で直線的。英語は circle、cycle と回転で「また同じ場所に戻ってきた」感を出す。人生を回転寿司に見立ててる。同じネタがまた来た。", category: 'opinion', month: '2026-03' },
    { daySlot: 12, japanese: '誰にも言わないで', english: [
        "keep this between us",
        "keep this between us, I'm beggin' you",
        "please don't tell anyone about this, I need this to stay between us",
        "keep this between us. I'm dead serious. if this gets out I'm done. socially done. professionally done. every kind of done. I'm trustin' you with this and trust is not somethin' I hand out like candy. this is classified information. top secret. burn-after-reading level. you tell anyone and I'm movin' to another country. I've already picked one."
    ], context: "keep this between us は「二人の間に留めて」=「内緒にして」。between us が「私たちの間」で、情報を二人の間の空間に閉じ込める。this stays between us（これは二人だけの話）もよく使う。日本語の「内緒」は「内の証」で内側の話。英語は between（間）で二人の壁を作る。秘密の守り方: 日本語は内側に隠す、英語は間に閉じ込める。", category: 'request', month: '2026-03' },
    { daySlot: 12, japanese: 'まあいい勉強になった', english: [
        "lesson learned",
        "well, lesson learned I guess, won't do that again",
        "it didn't go well but at least I learned something from the whole experience",
        "lesson learned. I guess. that's what you say when somethin' goes wrong and you need to find a silver lining. 'at least I learned somethin'.' did I though? did I really learn? or am I just sayin' that to feel better about the wreckage? probably the second one. but hey, fake growth is still growth. right? right? someone validate me."
    ], context: "lesson learned は「教訓を得た」。失敗を learning experience（学びの経験）と言い換えるのが英語文化。ポジティブに変換する技術。日本語の「勉強になった」も同じ機能。でも英語の lesson learned はもっとドライ。感情抜きの報告書みたい。軍隊用語から来てるのもあって、「以上、報告終わり」感がある。失敗を感情じゃなく情報として処理する。", category: 'filler', month: '2026-03' },

    // -- Day 13: お金の話 --
    { daySlot: 13, japanese: '今月カツカツ', english: [
        "broke this month",
        "I'm so broke this month it's not even funny",
        "money is really tight this month and I'm trying to make it to payday without going under",
        "I'm broke this month. like, check-my-bank-account-and-wince broke. I got paid two weeks ago and somehow it's all gone. where does it go? I don't buy anything fancy. I eat at home. but money just... evaporates. it's like havin' a hole in your pocket except the hole is rent and utilities and that subscription I keep forgettin' to cancel."
    ], context: "broke は「壊れた」が原義だけど、お金の文脈では「金欠」。I'm broke = 財布が壊れた=金がない。tight も「きつい」で money is tight = 金がきつい。英語は金欠を物理的な破損や締め付けで表現する。日本語の「カツカツ」は音のオノマトペ。ギリギリの擬音。英語には金欠のオノマトペがない。その代わり壊す。", category: 'reaction', month: '2026-03' },
    { daySlot: 13, japanese: 'それ高くない？', english: [
        "isn't that pricey",
        "isn't that kinda pricey though? like, for what it is?",
        "I don't know, that seems pretty expensive for what you're actually getting",
        "isn't that kinda pricey? like, I'm not sayin' don't buy it. your money, your choice. but for what it IS? it's a lot. you're payin' for the brand at that point. the actual product is the same as the one that costs half as much. but it doesn't have the logo so it doesn't count, right? that's how they get you. the logo tax."
    ], context: "pricey は「高い」のカジュアル版。expensive はフォーマル。pricey は友達との会話向き。isn't that pricey? は疑問形にすることで「高いよね?」と同意を求める。英語は値段を直接 expensive と言うより、isn't it...? で相手に言わせる技術がある。自分で批判せず相手に同意させる。英語の price negotiation はこの誘導から始まる。", category: 'suggestion', month: '2026-03' },
    { daySlot: 13, japanese: '割に合わない', english: [
        "not worth it",
        "honestly it's just not worth it for what you get",
        "when you think about what you're paying versus what you're getting, it just doesn't add up",
        "it's not worth it. and I say this as someone who bought it. the money-to-happiness ratio is way off. I spent this much and got this much joy. that's a terrible exchange rate. I coulda gotten the same amount of happiness from a convenience store onigiri. for 150 yen. my purchase was basically an expensive way to feel nothing."
    ], context: "worth it は「それだけの価値がある」。worth は「価値」で、is it worth it? は「元取れる?」。英語は全てを投資対効果で判断する。worth your time（時間の価値がある?）、worth the effort（努力の価値がある?）。日本語の「割に合う」は「割」=比率。英語も「価値の比率」。どっちも数学。人生は方程式。", category: 'opinion', month: '2026-03' },
    { daySlot: 13, japanese: 'おごるよ', english: [
        "I got this",
        "I got this one, put your wallet away",
        "don't even think about reaching for your wallet, this one's on me",
        "I got this. put your wallet away. seriously, put it away. don't do that fake reach. you know the fake reach? where you go for your wallet but you're movin' real slow hopin' I'll stop you? I see it. I see the fake reach. just accept the free meal and say thank you. we'll do this dance next time and you can pay. or fake reach again. whatever."
    ], context: "I got this / this one's on me は「おごるよ」。my treat も定番。it's on me は「俺のアカウントに載せてくれ」が原義。on は「〜の負担で」。The drinks are on the house（店のおごり）。英語は支払いを「誰の上に載せるか」で語る。日本語の「おごる」は「奢る」で贅沢の意味。英語は accounting（会計）の発想。バランスシート言語。", category: 'request', month: '2026-03' },
    { daySlot: 13, japanese: '衝動買いしちゃった', english: [
        "impulse buy",
        "total impulse buy, I don't even need it",
        "I wasn't planning to buy anything but then I saw it and my wallet just opened itself",
        "impulse buy. a bad one. I walked in for toothpaste and walked out with a blender I don't need. how? how does this happen? I blame the store layout. they put the cool stuff between you and the toothpaste on purpose. it's a trap. and I fall for it every single time. my apartment is basically a museum of things I bought while going to get toothpaste."
    ], context: "impulse buy は「衝動買い」。impulse は「衝動」で、神経が勝手に発火するイメージ。日本語と直訳で同じ。でも面白いのは英語の retail therapy（買い物セラピー）。ストレス解消の買い物を「治療」と呼ぶ。日本語にはない概念。英語圏は消費を正当化する言葉が豊富。treat yourself（自分にご褒美）も同じ系統。罪悪感を消すボキャブラリーが発達してる。", category: 'reaction', month: '2026-03' },
    { daySlot: 13, japanese: 'コスパ最強', english: [
        "bang for your buck",
        "honestly the best bang for your buck out there",
        "for the price you're paying you really can't beat the value you get from this",
        "best bang for your buck. and I don't say that about many things. usually when people say 'great value' they mean 'it's cheap and it shows.' but this one is actually good AND cheap. that combo barely exists in this world. usually you pick one: good or cheap. both? that's a unicorn. and I found one. at the convenience store. for 300 yen."
    ], context: "bang for your buck は「金に対する爆発力」=「コスパ」。bang = ドカン、buck = 1ドル。1ドルでどれだけドカンとくるか。日本語の「コスパ」は cost performance の和製英語。英語では value for money が普通だけど、bang for your buck の方がカジュアルで力強い。爆発で価値を測る。アメリカっぽい。", category: 'opinion', month: '2026-03' },
    { daySlot: 13, japanese: '金の話しにくい', english: [
        "money's awkward to talk about",
        "money talk is always awkward, nobody wants to go first",
        "I find it really hard to bring up money in conversations, it always makes things weird",
        "money's awkward to talk about. like, how much do you make? can't ask that. how much did you pay? kinda rude. can you lend me some? super uncomfortable. money is the one topic everyone thinks about constantly but nobody wants to discuss. it's the Voldemort of conversations. the-amount-that-shall-not-be-named."
    ], context: "awkward は「気まずい」。money talk is awkward は英語圏の文化的タブー。how much do you make?（いくら稼いでる?）は英語圏で超失礼。日本語でも聞きにくいけど、英語圏はもっと厳しい。it's rude to ask（聞くのは失礼）が強い。でも日本語の「お金の話」がタブーなのは遠慮。英語圏のタブーはプライバシー侵害。理由が違う。", category: 'opinion', month: '2026-03' },
    { daySlot: 13, japanese: '無駄遣いすんな', english: [
        "stop wastin' money",
        "stop wastin' money on stuff you don't need, seriously",
        "you really need to stop throwing money away on things that don't matter",
        "stop wastin' money. I know, I know, it's your money. but as your friend I gotta say somethin'. you bought three things this week you haven't even opened yet. they're still in the bags. WITH the receipts. you're not even committin' to the purchase. you're hedgin' your bets with the return policy. that's not shoppin', that's rentin' with extra steps."
    ], context: "waste money は「お金を無駄にする」。throw money away（お金を捨てる）も同じ。burn money（お金を燃やす）はもっと激しい。英語は無駄遣いを「捨てる」「燃やす」で表現する。日本語の「無駄遣い」は「無駄に使う」で、使い方の問題。英語は money を物理的に破壊してる。お金は大切にしろ、じゃなくて、破壊をやめろ。", category: 'request', month: '2026-03' },
    { daySlot: 13, japanese: '元取れた？', english: [
        "was it worth the money",
        "so was it actually worth the money or nah?",
        "looking back on it now, do you feel like you got your money's worth out of it?",
        "so was it worth it? real talk. 'cause you were so excited when you bought it. you were evangelizin'. tellin' everyone about it. and now it's been a month and you haven't mentioned it once. which tells me one of two things: either you're quietly enjoyin' it, or it's collectin' dust and you don't wanna admit it. which one?"
    ], context: "get your money's worth は「お金分の価値を得る」=「元を取る」。money's worth で「お金が持つ価値の分だけ」。worth が二重に効いてる。was it worth it? は日常で最もよく使う価値判断フレーズ。映画を見た後、旅行の後、高い買い物の後。英語圏の人は体験の後に必ず worth it 判定をする。人生を常にレビューしてる。星いくつ?的発想。", category: 'suggestion', month: '2026-03' },
    { daySlot: 13, japanese: '貯金が趣味って言うやつ信用できない', english: [
        "saving money isn't a hobby",
        "people who say savin' money is their hobby are just scared of spendin'",
        "I don't trust anyone who says their hobby is saving money, that's not a hobby",
        "savin' money is not a hobby. I'm sorry. hobbies are supposed to bring you joy. if stakin' at your bank account goin' up is what brings you joy, you need to examine some things. that's not a hobby, that's an anxiety response. you're not savin', you're hoardin' with a spreadsheet. at least buy yourself a coffee once in a while. live a little."
    ], context: "hobby は「趣味」だけど、英語圏では hobby の範囲が日本語より狭い。日本語は「趣味は読書です」が普通だけど、英語で My hobby is reading はちょっと堅い。I like to read / I'm into reading が自然。hobby はもっと具体的な活動（模型作り、釣りなど）に使う。saving money を hobby と呼ぶ違和感は日英共通。どっちの言語でもツッコまれる。", category: 'shutdown', month: '2026-03' },

    // -- Day 14: 比較・評価 --
    { daySlot: 14, japanese: 'どっちでもいい', english: [
        "either way's fine",
        "honestly either way's fine, I don't have a preference",
        "I really don't mind either way, just pick whichever one you think is better",
        "either way's fine. and I mean that. I genuinely do not have a preference. I know that annoys people. they want me to pick. but my brain is sayin' both options are equally fine and forcin' me to choose is just addin' stress for no reason. just flip a coin. if I'm disappointed with the result, then I had a preference all along. life hack."
    ], context: "either way は「どっちでも」。either は二択の両方。I don't mind either way は「どちらでも気にしない」。日本語の「どっちでもいい」は投げやりに聞こえることがあるけど、英語は I'm fine with either で丁寧にできる。fine with = 「〜でOK」。英語は「OK の出し方」のバリエーションが豊富。I'm good with that, works for me, I'm cool with it。全部「いいよ」の言い方違い。", category: 'filler', month: '2026-03' },
    { daySlot: 14, japanese: '比べるものじゃないでしょ', english: [
        "apples and oranges",
        "that's apples and oranges, you can't compare 'em",
        "those are two completely different things and comparing them doesn't even make sense",
        "that's apples and oranges. you can't compare 'em. it's like sayin' 'what's better, pizza or a sunset?' they're not in the same category. they don't compete. they exist in different universes. so stop tryin' to rank everything. not everything is a competition. some things are just... different. and different doesn't mean one is better."
    ], context: "apples and oranges は「リンゴとオレンジ」=「比較にならない」。英語圏で最もよく使われる比較不可能の表現。日本語だと「比べるものじゃない」で直接言うけど、英語はフルーツに例える。なぜリンゴとオレンジかは諸説あるけど、どっちも果物なのに全然違う、という絶妙な距離感。完全に違うものは比較しようとすらしない。微妙に近いから困る。", category: 'shutdown', month: '2026-03' },
    { daySlot: 14, japanese: '圧倒的にこっちの方がいい', english: [
        "this one's way better",
        "this one's way better, it's not even close",
        "there's no competition between the two, this one is leagues ahead of the other",
        "this one's way better. and it's not even close. like, they're not even in the same league. one is in the major leagues and the other is still in Little League eatin' orange slices. I don't even know why this is a debate. just look at 'em side by side. one is clearly superior and if you can't see that I question your eyesight."
    ], context: "it's not even close は「比較にもならない」。接戦ですらない。way better の way は「ずっと」「はるかに」の強調。leagues ahead は「リーグ(段階)が上」。英語は比較を距離やスポーツの階級で表現する。日本語の「圧倒的」は「圧倒する」で力のメタファー。英語は distance（距離）。差を「どれくらい離れてるか」で測る。", category: 'opinion', month: '2026-03' },
    { daySlot: 14, japanese: '一長一短だね', english: [
        "pros and cons",
        "both got their pros and cons honestly",
        "each one has its strengths and weaknesses so it really depends on what you prioritize",
        "both got their pros and cons. like, this one's faster but that one's cheaper. this one looks better but that one lasts longer. there's no perfect option. there never is. life is just a series of trade-offs where you pick the least annoying combination of problems. 'which set of flaws can I live with?' that's basically every decision."
    ], context: "pros and cons は「良い点と悪い点」。pro = 賛成、con = 反対。ラテン語から来てる。日本語の「一長一短」は「一つの長所と一つの短所」。英語の方が複数形(pros, cons)で、良い点も悪い点も複数ある前提。日本語は「一つずつ」でバランスを強調。英語は「リストにして全部並べよう」。分析的。pros and cons list を作るのが英語圏の意思決定文化。", category: 'opinion', month: '2026-03' },
    { daySlot: 14, japanese: '人それぞれでしょ', english: [
        "to each their own",
        "to each their own, I'm not gonna judge",
        "everyone's different and what works for one person might not work for another",
        "to each their own. and I mean that. no judgment. you like what you like. I like what I like. we don't gotta agree. the world would be boring if everyone had the same taste. imagine if everyone liked the same music. the same food. the same everything. nightmare. variety is what makes it interesting. so go be weird. I'll be weird over here."
    ], context: "to each their own は「人それぞれ」の完璧な対訳。each = それぞれ、their own = 自分の好み。この表現は寛容を示すときの定番。different strokes for different folks（人によってやり方が違う）も同じ意味。日本語の「人それぞれ」は議論を終わらせるフレーズ。英語の to each their own も同じ機能。「もうこの話やめよう」の合図。世界共通の会話終了ボタン。", category: 'filler', month: '2026-03' },
    { daySlot: 14, japanese: '思ったほどじゃなかった', english: [
        "didn't live up to the hype",
        "it didn't really live up to the hype honestly",
        "everyone was raving about it but when I actually tried it I was kind of underwhelmed",
        "it didn't live up to the hype. and the hype was HUGE. everyone was losin' their minds over this thing. so I tried it. and it was... fine. just fine. not bad. not amazing. fine. and fine after massive hype feels like a letdown. it's not the thing's fault. it's the expectation's fault. hype ruins everything. we gotta stop hyping stuff. we won't. but we should."
    ], context: "live up to the hype は「期待に応える」。hype は「大騒ぎ・誇大宣伝」。live up to は「〜に達する」。hype が高すぎて実物が追いつかない。underwhelmed は overwhelmed（圧倒された）の反対。whelm は「波に飲まれる」で、under = 波が足りない=期待外れ。英語は感動を波の高さで測る。高い波=感動、低い波=がっかり。", category: 'reaction', month: '2026-03' },
    { daySlot: 14, japanese: 'あれに比べたらマシ', english: [
        "could be worse",
        "I mean, could be worse -- remember that other time?",
        "it's not great but compared to what happened last time this is actually pretty decent",
        "could be worse. that's my go-to coping mechanism. bad day? could be worse. bad meal? could be worse. bad haircut? at least I have hair. I compare everything to the worst-case scenario and suddenly everything's fine. it's not optimism. it's strategic lowering of expectations. if you expect nothin', you can't be disappointed. galaxy brain move."
    ], context: "could be worse は「もっと悪くなり得た」=「まだマシ」。英語圏の鉄板フレーズ。どんな状況でも could be worse と言えば慰めになる。日本語の「マシ」は「まだいい」で比較が内蔵されてる。英語は could（可能性）を使って「最悪じゃない」と確率論で慰める。「80%の確率でもっと悪い結果だった」と統計で自分を励ます。理系的ポジティブシンキング。", category: 'filler', month: '2026-03' },
    { daySlot: 14, japanese: 'あいつ過大評価されてる', english: [
        "overrated",
        "honestly they're kinda overrated and I'm not afraid to say it",
        "I think people give them way too much credit, they're not as good as everyone says",
        "overrated. and I know that's a hot take. I know everyone loves 'em. but I'm sayin' it. overrated. they're good. not great. not legendary. not the-best-ever. just... good. and good is fine! but stop actin' like they're the second coming. they're a solid B+. and there's nothin' wrong with B+. but it's not an A. facts."
    ], context: "overrated は「過大評価」。over + rated（評価された）。逆は underrated（過小評価）。英語は全てを rate（評価）する文化。Yelp、Google Review、Rotten Tomatoes。星をつけて点数をつける。overrated は「みんなの星の数が多すぎる」。日本語の「過大評価」はフォーマルだけど、英語の overrated はカジュアルに日常で使う。コーヒーもoverrated。", category: 'opinion', month: '2026-03' },
    { daySlot: 14, japanese: 'まあ悪くないんじゃない', english: [
        "not bad actually",
        "not bad actually, I'm kinda impressed",
        "I wasn't expecting much but it actually turned out to be pretty decent",
        "not bad. and from me, that's basically a five-star review. I don't hand out compliments easy. so when I say 'not bad,' that means I'm genuinely impressed but I refuse to show too much enthusiasm 'cause that's how I'm wired. it's not bad = it's great. I'm sorry for bein' emotionally unavailable. this is the best I can do."
    ], context: "not bad は「悪くない」だけど、英語ではこれが褒め言葉になる。not bad at all = かなりいい。控えめに褒めるイギリス英語の影響。「最高!」と言わずに「悪くない」で褒める。日本人の「まあまあ」と同じ機能。直接褒めると照れるから否定の否定で褒める。二重否定の褒め技術。言語は違っても照れ屋の戦略は一緒。", category: 'reaction', month: '2026-03' },
    { daySlot: 14, japanese: '何を基準にしてるの', english: [
        "compared to what though",
        "compared to what though? what's your baseline?",
        "I mean that depends entirely on what you're comparing it to, what's your reference point?",
        "compared to what though? 'cause when you say 'that's expensive' or 'that's good,' I need a reference point. expensive compared to what? good compared to what? everything is relative. a 1000-yen lunch is expensive for a konbini but cheap for a restaurant. without context, words mean nothin'. I need your baseline. show me your ruler before you start measurin'."
    ], context: "compared to what は「何と比べて?」。英語は比較に baseline（基準線）を求める。What's your frame of reference?（あなたの参照枠は?）とも言う。日本語の「基準」は抽象的だけど、英語は frame（枠）、baseline（底線）、benchmark（基準点）と測定ツールの言葉を使う。英語は意見にもエビデンスと測定基準を要求する。議論が裁判っぽくなる理由。", category: 'suggestion', month: '2026-03' },

    // -- Day 15: 待つ・イライラ --
    { daySlot: 15, japanese: 'まだ来ないの？', english: [
        "still not here?",
        "they're STILL not here? what's takin' so long?",
        "I've been waiting forever and they're still not here, this is getting ridiculous",
        "still not here? seriously? it's been thirty minutes. THIRTY. I could've done a lot in thirty minutes. I could've made dinner. I could've watched an episode. instead I'm standin' here like an idiot checkin' my phone every two minutes. time moves slower when you're waitin'. that's a scientific fact. I didn't look it up but I'm sure it is."
    ], context: "what's taking so long は「なんでこんなに時間かかってるの」。taking は「取る」で、時間を「取られてる」感覚。英語は待つことを時間の盗難として語る。you're wasting my time（俺の時間を無駄にしてる）。日本語は「まだ来ない」で事実の確認。英語は「何が時間を奪ってるんだ」と犯人を探す。待たされること=被害。英語は待機時間を損害として計上する。", category: 'reaction', month: '2026-03' },
    { daySlot: 15, japanese: 'イライラする', english: [
        "this is so annoying",
        "this is so annoying I can feel my eye twitching",
        "I'm getting really frustrated with this whole situation and I'm about to lose it",
        "this is so annoying. like, my whole vibe is ruined. I was havin' a fine day. a normal, peaceful, nothin'-special day. and then THIS happened. and now I'm irritated. and when I'm irritated, everything else starts botherin' me too. the noise. the light. the temperature. once the annoyance switch flips, everything becomes annoying. it's a domino effect of irritation."
    ], context: "annoying は「イライラさせる」。日本語の「イライラする」は自分の状態。英語は this is annoying で「これがイライラさせてる」と原因を指す。さらに frustrated は「阻止された」が原義。ゴールに向かってるのに邪魔されてる感覚。irritated は「皮膚が擦れてる」が原義。英語のイライラは物理的な刺激。日本語のイライラは擬音。表現の根っこが全然違う。", category: 'reaction', month: '2026-03' },
    { daySlot: 15, japanese: 'いつまで待たせんの', english: [
        "how much longer",
        "how much longer do I gotta wait, seriously",
        "I've been waiting way too long already and I need to know when this is actually going to happen",
        "how much longer. that's all I wanna know. just give me a number. five minutes? ten? an hour? I can handle any answer except 'I don't know.' 'I don't know' is the worst answer when you're waitin'. just lie to me. tell me five minutes even if it's thirty. at least I'll have hope for five minutes before the betrayal hits."
    ], context: "how much longer は「あとどれくらい」。longer は long の比較級で「今より長く」。英語は待ち時間を量（much）で測る。how long have you been waiting?（どれくらい待ってる?）は経過時間を尋ねる。日本語の「いつまで」は終了時点を聞く。英語は「あとどれくらいの量?」。日本語は「いつ終わる?」。時間の捉え方: 英語=量、日本語=点。", category: 'request', month: '2026-03' },
    { daySlot: 15, japanese: '待つの苦手なんだよね', english: [
        "I'm bad at waiting",
        "I'm terrible at waitin', I got zero patience",
        "I've never been a patient person and waiting is genuinely one of the hardest things for me",
        "I'm terrible at waitin'. like, medically bad. my body rejects inactivity. if I'm not doin' somethin', my brain starts eatin' itself. I can't just sit there. I start tappin' my foot, checkin' my phone, lookin' around for something to read. I once reorganized my entire bag while waitin' for coffee. the barista was concerned."
    ], context: "I'm bad at waiting の bad at は「〜が苦手」。patient は「我慢強い」で I have no patience = 忍耐力ゼロ。英語の patience は「苦しみに耐える」が語源（ラテン語 patientia）。つまり待つことは苦しみに耐えること。日本語の「苦手」は能力の問題。英語は suffering（苦痛）の問題。待つのが下手なんじゃない、待つのが痛いんだ。", category: 'opinion', month: '2026-03' },
    { daySlot: 15, japanese: '遅すぎ', english: [
        "took forever",
        "that took forever, I almost gave up",
        "it took so long I was genuinely about to leave before it finally happened",
        "took forever. and I'm not bein' dramatic. OK I'm bein' a little dramatic. but it felt like forever. there's a difference between actual time and perceived time. actual time: twenty minutes. perceived time: three lifetimes. when you're waitin', minutes become hours. hours become centuries. my great-grandchildren could've been born and graduated by the time that was done."
    ], context: "took forever は「永遠にかかった」。forever を日常で使うのが英語の特徴。I've been waiting forever（永遠に待ってる）。実際は30分でも forever。英語は体感時間を大げさに表現する。日本語の「遅すぎ」は事実の報告。英語は「永遠」を持ち出して感情を盛る。forever, ages, eternity。全部「めっちゃ長い」の大げさ版。英語はリアクション芸人の言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 15, japanese: 'なんで毎回遅れんの', english: [
        "why are you always late",
        "why are you ALWAYS late, it's every single time",
        "I don't understand how you manage to be late literally every time we make plans",
        "why are you always late? every. single. time. and it's not like you're five minutes late. that I could handle. you're twenty, thirty minutes late. with the same excuse. 'traffic.' bro, traffic exists for all of us. I was in the same traffic. I left earlier. that's the secret. leavin' earlier. groundbreaking concept. Nobel Prize worthy."
    ], context: "always は「いつも」だけど、怒りの文脈で使うと「毎回毎回」の非難になる。you always do this は「あんたいつもこうだよね」で、相手の性格を攻撃するフレーズ。心理学でも you always / you never は relationship（関係）を壊す言葉として有名。always は「100%の頻度」を主張するから相手は反論したくなる。ケンカを激化させる核ボタン。取扱注意。", category: 'reaction', month: '2026-03' },
    { daySlot: 15, japanese: 'もういい、帰る', english: [
        "forget it, I'm leaving",
        "forget it, I'm done waitin', I'm out",
        "I've had enough of this, I'm not waiting any longer, I'm going home",
        "forget it. I'm leavin'. I hit my limit. everyone has a limit and mine just got hit. there's a certain amount of time I'm willin' to wait and we passed that like ten minutes ago. I stayed extra out of politeness. that grace period is now over. I'm goin' home, puttin' on sweats, and pretendin' this never happened. good night."
    ], context: "forget it は「もういい」。直訳は「忘れろ」だけど、実際は「もう諦めた・もう付き合ってられない」。I'm done は「終わり」で、自分が状況を終了させる宣言。I'm out は「抜ける」。全部、自分が主導権を取って状況を終わらせる表現。日本語の「もういい」は諦めの受動感があるけど、英語は「俺が終わらせる」の能動宣言。", category: 'shutdown', month: '2026-03' },
    { daySlot: 15, japanese: 'ギリギリセーフ', english: [
        "just made it",
        "just barely made it, that was way too close",
        "I thought I was going to be late but somehow I made it just in the nick of time",
        "just made it. barely. by like thirty seconds. my heart is still racin'. I was runnin' -- literally runnin' -- and I slid in right before the door closed. like an action movie. except instead of savin' the world I was savin' myself from an awkward entrance. not as cool. but the adrenaline was the same."
    ], context: "in the nick of time は「ギリギリ間に合って」。nick は「小さな刻み目」で、時間の最後の一瞬。just made it は「ギリギリ間に合った」。made it の it は目的地や期限。make it = 「たどり着く」。日本語の「セーフ」は野球の safe から来てるけど、英語では時間にギリギリ間に合う意味では safe を使わない。close call（危なかった）、cutting it close（ギリギリ）が自然。和製英語の罠。", category: 'reaction', month: '2026-03' },
    { daySlot: 15, japanese: '並ぶのだけは無理', english: [
        "I can't do lines",
        "I absolutely cannot do lines, it's my kryptonite",
        "waiting in line is the one thing I just physically cannot make myself do, no matter what",
        "I can't do lines. physically cannot. my body rejects it. people are like 'it's only thirty minutes' and I'm like that's THIRTY MINUTES of standin' still. doin' nothin'. starin' at someone's back. I don't care how good it is on the other end. no food, no product, no experience is worth standin' in line for. I will go somewhere else. always."
    ], context: "I can't do lines の do は「耐える・対処する」。I can't do mornings（朝は無理）、I can't do spicy food（辛いの無理）と同じ構文。do は「する」だけじゃなくて「受け入れる」の意味がある。日本語の「無理」は不可能の宣言。英語の I can't do は「自分の処理能力の範囲外」。CPUが対応してないファイル形式みたいな感覚。人間のスペック不足として語る。", category: 'shutdown', month: '2026-03' },
    { daySlot: 15, japanese: 'あともうちょっと', english: [
        "almost there",
        "almost there, just hang on a little longer",
        "we're so close to being done, just a little more patience and we're there",
        "almost there. almost. that word is either the best or worst word in English dependin' on the context. 'almost there' when you're hikin' = hope. 'almost there' from tech support = lies. they said 'almost' twenty minutes ago. 'almost' is the most abused word in customer service. it means nothin'. it's a verbal pacifier. shh, baby, almost."
    ], context: "almost は「もうちょっと」で、到達の直前を示す。英語の almost は数学的に「限りなく近いが到達していない」。almost there, almost done, almost ready。全部「あと一歩」。日本語の「もうちょっと」は距離のイメージ。英語の almost は完了率90%以上のニュアンス。でも実際は50%でも almost って言う人いる。almost は体感の単語であって、数字の単語ではない。", category: 'filler', month: '2026-03' },

    // -- Day 16: 謝る・許す --
    { daySlot: 16, japanese: 'ごめん、俺が悪かった', english: [
        "my bad",
        "my bad, that was totally on me",
        "I'm sorry, that was completely my fault and I take full responsibility for it",
        "my bad. that was on me. 100%. no excuses. I could give you five reasons why it happened but none of 'em matter 'cause at the end of the day I'm the one who messed up. and I'm not gonna be that person who apologizes but then explains why it wasn't really their fault. it was my fault. period. we good?"
    ], context: "my bad は「俺が悪い」の超カジュアル版。90年代のバスケスラングから広まった。that's on me は「それは俺のせい」。on は「〜の上に」で、責任が自分の上に載ってるイメージ。日本語の「悪かった」は状態の報告。英語の my bad / on me は責任の所在を宣言する。「この失敗の持ち主は俺です」。所有権の申告。", category: 'reaction', month: '2026-03' },
    { daySlot: 16, japanese: '許してとは言わないけど', english: [
        "I'm not askin' you to forgive me",
        "I'm not askin' you to forgive me, I just want you to know I'm sorry",
        "I know I can't ask for forgiveness but I at least want you to understand that I genuinely regret what happened",
        "I'm not askin' you to forgive me. I know that's not how it works. you can't just say sorry and expect everything to reset. forgiveness isn't a button you press. it's a process. and I gotta earn it. so I'm not askin' for it. I'm just sayin' I know I was wrong. what you do with that is up to you. I'll wait."
    ], context: "forgive は「許す」だけど、give（与える）が入ってる。for + give = 「代わりに与える」。怒りや恨みを手放して、代わりに自由を相手に与える。日本語の「許す」は「許可する」の許と同じ漢字で、元は「通行を認める」。英語は贈り物、日本語は通行許可。forgiveness のハードルが高い理由：それは贈り物だから、タダじゃない。", category: 'request', month: '2026-03' },
    { daySlot: 16, japanese: 'もう気にしてないよ', english: [
        "water under the bridge",
        "it's water under the bridge, don't worry about it",
        "honestly I stopped being upset about it a while ago, it's all water under the bridge now",
        "water under the bridge. literally. it's gone. flowed away. I'm not holdin' onto it. life's too short to keep score of every time someone messed up. if I held grudges for every little thing, I'd be carrying a backpack full of anger everywhere I go. who wants that? not me. let it flow. the river doesn't stop. neither should we."
    ], context: "water under the bridge は「橋の下を流れた水」=「もう済んだこと」。水は流れて戻らない=過去は変えられない。let it go も「手放せ」で同じ概念。日本語の「水に流す」と完全にパラレル。面白いことに、日英両方とも水のメタファーで「過去を許す」を表現する。水=時間の流れは人類共通の感覚。川は世界中で同じことを教えてる。", category: 'filler', month: '2026-03' },
    { daySlot: 16, japanese: '言い訳しないで', english: [
        "no excuses",
        "I don't wanna hear excuses, just own it",
        "please don't try to explain it away, I just need you to acknowledge what happened",
        "no excuses. please. I've heard 'em all. 'I was busy.' 'I forgot.' 'I didn't know.' cool. but none of that changes what happened. and the more you explain, the less sorry you sound. the best apology is three words: I messed up. that's it. no 'but,' no 'because,' no backstory. just three words and a genuine look on your face. that's all I need."
    ], context: "own it は「認めろ」。own は「所有する」。自分のミスを自分のものとして所有しろ。英語は責任を「持ち物」として扱う。take responsibility（責任を取る=持つ）、own your mistakes（ミスを所有しろ）。日本語は「認める」で知覚の話。英語は「所有しろ」で財産の話。責任は持ち物。重いけど持て。それが大人。", category: 'shutdown', month: '2026-03' },
    { daySlot: 16, japanese: '許せないわけじゃないけど', english: [
        "I'll get over it, just not today",
        "I'll get over it eventually, just... not today",
        "I know I'll forgive you at some point but right now I'm still processing everything",
        "I'll get over it. eventually. not today. today I'm still in the 'feelin' it' phase. there are stages, you know? like grief but for trust. denial, anger, bargaining, depression, acceptance. I'm somewhere between anger and bargaining. 'if they apologize ONE MORE TIME maybe I'll feel better.' so far, nope. but I'll get there. give me time."
    ], context: "get over it は「乗り越える」。over は「上を越える」で、問題を障害物として飛び越えるイメージ。日本語の「許せないわけじゃない」は二重否定で複雑な感情を表す。英語は get over の段階的プロセスで語る。I'm getting over it（今乗り越え中）は進行形が使える。許しは瞬間じゃなくてプロセス。英語の方がその時間的流れを表現しやすい。", category: 'opinion', month: '2026-03' },
    { daySlot: 16, japanese: '謝って済む問題じゃない', english: [
        "sorry doesn't cut it",
        "sorry doesn't cut it this time, words aren't enough",
        "an apology isn't going to fix this, what happened goes beyond just saying sorry",
        "sorry doesn't cut it. not this time. I've accepted 'sorry' before. many times. and every time I accepted it, it happened again. so at this point, sorry is just a word. it's not backed by anything. it's a check that keeps bouncin'. I need proof. I need change. I need to see it, not hear it. actions, not words. show me."
    ], context: "doesn't cut it は「足りない・通用しない」。cut は「切る」で、基準線を切れない=基準に達しない。make the cut（基準をクリアする）の否定形。日本語の「済む」は「終わる」で「それで終わりにならない」。英語は「基準を超えられない」。日本語は解決の有無、英語は品質の合否。sorry が品質テストに不合格。QC 的発想。", category: 'shutdown', month: '2026-03' },
    { daySlot: 16, japanese: 'お互い様でしょ', english: [
        "we're even",
        "we both messed up so I'd say we're even",
        "look, we both made mistakes here so let's just call it even and move on",
        "we're even. you messed up. I messed up. we both got some things wrong. if we start keepin' score of who was more wrong, we'll be here all night. and nobody wins that game. nobody. so let's just agree that we both could've handled it better, shake on it, and move on. deal? deal. good. I'm starvin'. let's eat."
    ], context: "we're even は「お互い様」。even は「平ら・同じ」。借りも貸しもゼロ=イーブン。call it even（イーブンにしよう）は便利な和解フレーズ。日本語の「お互い様」は「お互いが同じ立場」。英語の even は数学的に equal。0対0。帳簿を合わせるイメージ。英語は人間関係すらバランスシートで管理する。会計言語。", category: 'filler', month: '2026-03' },
    { daySlot: 16, japanese: 'もうあの話蒸し返さないで', english: [
        "don't bring that up again",
        "please don't bring that up again, it's done",
        "I really don't want to go back to that conversation, we already dealt with it",
        "don't bring that up again. we talked about it. we settled it. it's in the past. and every time you bring it up, we go back to square one. all the progress we made -- gone. it's like save files that keep getting corrupted. we resolved this on level five and you just loaded the level-one save. I don't wanna replay this boss fight. I already won. barely. but I won."
    ], context: "bring up は「持ち出す」。bring = 持ってくる、up = 上に。過去の話を地面の下から掘り起こして上に持ってくるイメージ。日本語の「蒸し返す」は料理のメタファーで、冷めた話をもう一度温める。英語は考古学的に掘り起こす。dig up the past（過去を掘り起こす）も同じ。日本語は台所、英語は発掘現場。終わった話を復活させる行為を、文化が違う場所で表現する。", category: 'shutdown', month: '2026-03' },
    { daySlot: 16, japanese: 'ちゃんと謝れる人って少ない', english: [
        "most people can't apologize properly",
        "most people can't apologize properly and it drives me crazy",
        "it's actually rare to meet someone who knows how to give a genuine, no-strings-attached apology",
        "most people can't apologize. they think they can. they say 'I'm sorry.' but then they add 'but' and everything after the 'but' cancels out the sorry. 'I'm sorry BUT you also...' nope. that's not an apology. that's a counter-attack with a sorry hat on. a real apology has no 'but.' no conditions. no redirect. just 'I'm sorry, I was wrong.' three words. most people can't do three words."
    ], context: "apologize properly は「ちゃんと謝る」。英語圏では non-apology apology（謝ってないのに謝ったフリ）が問題になる。I'm sorry you feel that way（あなたがそう感じたことは残念です）は最悪の謝罪。相手の感情のせいにしてる。真の謝罪は I'm sorry I did that（俺がやったことを謝る）。主語が I で、動詞が自分の行為を指すこと。英語は謝罪の文法にまで厳しい。", category: 'opinion', month: '2026-03' },
    { daySlot: 16, japanese: 'まあ、しょうがないか', english: [
        "it is what it is",
        "it is what it is, no point bein' mad about it",
        "I've thought about it and honestly there's nothing anyone could've done differently, so it is what it is",
        "it is what it is. the most philosophical six words in English. it means 'I accept this reality even though I don't like it.' it means 'I'm done fighting.' it means 'the universe won and I'm too tired to appeal.' it's surrender dressed up as wisdom. and honestly? sometimes surrender is the smartest move. not every battle needs to be fought. some just need to be... accepted."
    ], context: "it is what it is は「しょうがない」の完璧な対訳。A is A（AはAである）というトートロジー（同語反復）。意味がないようで、最も深い受容の表現。これは変えられない現実を受け入れる宣言。日本語の「しょうがない」は「仕方がない」で、方法がないという意味。英語は「それはそれである」と存在そのものを肯定する。哲学的に一段深い。でも使う場面は同じ。負けた時。", category: 'filler', month: '2026-03' },
    // -- Day 17: 約束・ドタキャン --
    { daySlot: 17, japanese: 'ドタキャンされた', english: [
        "got bailed on",
        "they bailed on me last minute, classic",
        "I got stood up, they cancelled right before we were supposed to meet",
        "they bailed on me. last minute. like, I was already dressed. shoes on. keys in hand. and then my phone buzzes and it's 'hey sorry can't make it.' cool. cool cool cool. I coulda been in my pajamas this whole time. I gave up sweatpants for this. that's the real crime here."
    ], context: "bail on someoneは「ドタキャンする」。bail=保釈金。つまり「保釈して逃げる」イメージ。He bailed on dinner(夕飯をドタキャンした)。日本語は「ドタキャン」で1語だけど、英語はbail on / stood up / flaked onと3パターンある。stood upは特にデートのドタキャンに使う。flakeは「信用できない人」のニュアンス。", category: 'reaction', month: '2026-03' },
    { daySlot: 17, japanese: '絶対来るって言ったじゃん', english: [
        "you promised",
        "you literally promised, don't even",
        "you gave me your word and now you're backing out?",
        "you promised. you looked me in the eye and said 'I'll be there.' those were your words. your words! and now what? suddenly you're busy? you weren't busy yesterday when you said yes. the busy fairy didn't visit you overnight. you just don't wanna go. which is fine, but own it. don't hide behind 'something came up.'"
    ], context: "give someone your wordは「約束する」の重い版。wordは「言葉」だけど、ここでは「信用」。My word is my bond(俺の言葉は契約書だ)。英語では約束=言葉を渡す行為。back outは「後から抜ける」。日本語の「やっぱやめた」より裏切り感が強い。英語圏では口約束でも結構重い。", category: 'reaction', month: '2026-03' },
    { daySlot: 17, japanese: 'まあ、しょうがないか', english: [
        "can't be helped",
        "it is what it is, whatever",
        "nothing I can do about it now, just gotta move on",
        "it is what it is. and I hate that phrase 'cause it's basically the white flag of emotions. you wave it when you're too tired to be mad anymore. am I disappointed? yeah. am I gonna do anything about it? nah. that's the 'it is what it is' zone. acceptance through exhaustion. the most adult coping mechanism."
    ], context: "it is what it isは英語圏の万能あきらめフレーズ。「しょうがない」に一番近いけど、もっとドライ。日本語の「しょうがない」には少し温かさがあるけど、it is what it isは完全に感情のシャッターを下ろす音。can't be helpedは直訳だけど実際はあまり使わない。ネイティブはit is what it is一択。", category: 'filler', month: '2026-03' },
    { daySlot: 17, japanese: '予定合わなすぎ', english: [
        "schedules never line up",
        "our schedules never line up, it's cursed",
        "we've been trying to meet up for weeks but our schedules just won't align",
        "we've been tryin' to meet up for like three weeks. three weeks. and every time one of us is free, the other one's busy. it's like a sitcom where two characters keep just missin' each other. at this point I'm startin' to think the universe doesn't want us to hang out. maybe we're not supposed to be in the same room. maybe it's a safety thing."
    ], context: "line upは「揃う・一致する」。schedules line up(予定が合う)。日本語は「合う」1語だけど、英語はline up=「列に並ぶ」イメージ。2つのスケジュールが横に並んで一致するか確認する感じ。alignも同じ。英語は予定を物理的な物体として扱う。予定を動かす(move)、ぶつける(clash)、空ける(clear)。", category: 'opinion', month: '2026-03' },
    { daySlot: 17, japanese: 'リスケでいい？', english: [
        "can we reschedule?",
        "can we rain check this? something came up",
        "hey, any chance we could push this to next week?",
        "hey so... something came up. and I know I know, I'm the worst. but can we reschedule? next week? same time? I'll even buy coffee to make up for it. actually no, I'll buy lunch. that's how guilty I feel. you pick the place. I owe you. I genuinely owe you. put it on my tab of social debt."
    ], context: "rain checkは元々野球用語。雨で試合が中止になったときの振替チケット。今は「今回はダメだけど次回に」の意味で日常会話に定着。Can I take a rain check?(また今度でいい?)。pushは「押す」→「後ろにずらす」。push it to Friday(金曜にずらそう)。英語は予定を物理的に押して動かす。", category: 'request', month: '2026-03' },
    { daySlot: 17, japanese: 'すっぽかされるの慣れた', english: [
        "used to it by now",
        "I'm used to gettin' flaked on at this point",
        "honestly I've been cancelled on so many times it doesn't even faze me anymore",
        "I'm used to it. like, genuinely used to it. at this point when someone says 'let's hang out' I mentally add 'probably not' to the end of it. I don't even get ready until I get the confirmation text. and even then I give it a 60-40. is that cynical? yeah. is it also accurate? also yeah. experience is a brutal teacher."
    ], context: "be used to + -ingは「〜に慣れている」。get used to(慣れる過程)とbe used to(もう慣れた状態)は違う。fazeは「動揺させる」。doesn't faze meは「もう動じない」。日本語の「慣れた」は1語だけど、英語は慣れの段階を区別する。getting used to(慣れてきてる)→used to(もう慣れた)。プロセスと結果を分ける。", category: 'reaction', month: '2026-03' },
    { daySlot: 17, japanese: '約束は約束でしょ', english: [
        "a promise is a promise",
        "a deal's a deal, you can't just back out",
        "you made a commitment, I expect you to follow through",
        "a promise is a promise. that's not a complicated concept. you said you'd do it. I believed you. that's how trust works. it's a two-step process -- you say, then you do. not you say, then you don't, then you text 'my bad' with a sad emoji. that's not how any of this works. the system has rules."
    ], context: "follow throughは「最後までやり遂げる」。ゴルフのスイングで振り切る動作が語源。He never follows through(あいつはいつも中途半端)。commitmentは「約束」だけど、promiseより重い。仕事やプロジェクトの約束はcommitment。promiseは個人間。a deal's a deal=「取引は取引」=約束したなら守れ。英語は約束を契約として扱う。", category: 'opinion', month: '2026-03' },
    { daySlot: 17, japanese: '今日はやめとく', english: [
        "I'll pass",
        "I'm gonna pass on today, not feelin' it",
        "think I'm gonna sit this one out, maybe next time",
        "I'm gonna pass. and before you say anything -- no, I'm not mad. no, nothin' happened. I just don't feel like it. is that allowed? can a person just not feel like doin' something without it bein' a whole investigation? I'm tired. that's it. that's the whole reason. tired. case closed. see you next time."
    ], context: "passは「パスする」=「今回はやめとく」。I'll passは日本語の「やめとく」そのまま。sit this one outは「今回は見送る」。元はダンスで「この曲は踊らない」。not feelin' itは「気分じゃない」。英語は断るときの選択肢が多い。pass、skip、sit out、take a rain check。丁寧さのレベルで使い分ける。", category: 'shutdown', month: '2026-03' },
    { daySlot: 17, japanese: 'ダブルブッキングしちゃった', english: [
        "double-booked myself",
        "I accidentally double-booked myself, I'm an idiot",
        "I somehow managed to schedule two things at the same time like a genius",
        "I double-booked myself. because of course I did. I looked at my calendar, saw a gap, and thought 'perfect.' except it wasn't a gap. it was just my phone not loading fast enough. now I've got two things at the same time and I gotta pick one and disappoint somebody. this is why I need a secretary. or a better phone. or a brain."
    ], context: "double-bookは「ダブルブッキングする」。英語でもそのまま使う。managed toは「なんとか〜した」だけど、皮肉で使うと「やらかした」になる。I managed to break it(見事に壊した)。like a geniusも皮肉。「天才だからね」=「バカだからね」。英語は褒め言葉を皮肉に転用するのが得意。", category: 'reaction', month: '2026-03' },
    { daySlot: 17, japanese: '言ってくれれば調整したのに', english: [
        "coulda worked it out",
        "if you'd told me sooner I coulda figured somethin' out",
        "I wish you'd said something earlier, I would've made it work",
        "if you'd just told me. that's all I'm sayin'. one text. one little text sayin' 'hey, can't make it.' and I woulda adjusted. rearranged. figured somethin' out. but no. radio silence until the last second. and now I'm standin' here like an idiot with reservations for two. communication. it's free. it's unlimited. please use it."
    ], context: "coulda = could haveの口語。would've = would haveの短縮。仮定法過去完了だけど、英語ネイティブはそんな文法名知らない。coulda / woulda / shoulda は「あのとき〜できたのに」の三兄弟。shoulda told me(言うべきだった)が一番責める力が強い。日本語の「〜してくれれば」は英語では仮定法が発動する。面倒だけど感情表現にはこれしかない。", category: 'opinion', month: '2026-03' },

    // -- Day 18: 体のメンテナンス --
    { daySlot: 18, japanese: '体バキバキ', english: [
        "I'm so stiff",
        "my whole body's stiff, I can barely move",
        "everything hurts and I haven't even done anything, that's the sad part",
        "my body is destroyed. and not from workin' out or doin' anything cool. just from existin'. from sittin' in a chair. from sleepin' wrong. I'm fallin' apart from inactivity. that's the most embarrassin' way to break. I didn't get injured. I got injured by not movin'. my body's protestin' my lifestyle choices."
    ], context: "stiffは「硬い・こわばった」。日本語の「バキバキ」は擬音だけど英語にはこの擬音がない。代わりにstiff / sore / tightで使い分ける。soreは「筋肉痛」、tightは「張ってる」、stiffは「動かない」。英語は痛みの種類を細かく分類する。日本語の「バキバキ」は全部まとめて一音で表現する天才的な擬音。", category: 'reaction', month: '2026-03' },
    { daySlot: 18, japanese: '最近ジム行けてない', english: [
        "haven't been to the gym",
        "I haven't hit the gym in ages, it's bad",
        "I keep telling myself I'll go tomorrow but tomorrow never comes",
        "I haven't been to the gym in... I'm not even gonna say how long. it's embarrassin'. my gym membership is basically a charity donation at this point. I'm payin' monthly for a building I don't enter. that's not fitness. that's philanthropy. the gym should send me a thank-you card for my generous contribution."
    ], context: "hit the gymは「ジムに行く」のカジュアル版。hitは「打つ」だけど、場所に使うと「行く」になる。hit the road(出発する)、hit the sack(寝る)、hit the books(勉強する)。全部「その場所/行動にぶつかりに行く」イメージ。in agesは「長い間」。英語は時間を大げさに言うのが好き。", category: 'opinion', month: '2026-03' },
    { daySlot: 18, japanese: 'ストレッチだけはやってる', english: [
        "at least I stretch",
        "I mean, at least I'm stretchin', that counts right?",
        "I can't do much but I try to stretch every day, it's something",
        "I stretch. that's it. that's my entire fitness routine. ten minutes of stretchin' while watchin' YouTube. is it a workout? no. is it better than nothin'? technically yes. and I'm gonna ride that 'technically yes' all the way to my grave. at least I stretch. put it on my tombstone. 'he didn't do much, but he stretched.'"
    ], context: "at leastは「少なくとも」だけど、会話では「せめてこれだけは」の自己弁護に使う。At least I tried(少なくともやった)。that countsは「それもカウントに入る」。Does that count?(それって数に入る?)は「微妙な努力」を認めてほしいときの定番。日本語の「一応やってる」のニュアンスにぴったり。", category: 'opinion', month: '2026-03' },
    { daySlot: 18, japanese: '肩こりヤバい', english: [
        "my shoulders are killing me",
        "my neck and shoulders are absolutely wrecked",
        "I've got so much tension in my shoulders it feels like I'm carrying the world",
        "my shoulders. oh my god, my shoulders. I don't know what I did. wait, yes I do -- I sat at a desk for eight hours with the posture of a shrimp. and now I'm payin' for it. my shoulders are up by my ears permanently. I look like I'm perpetually surprised. someone needs to come push 'em back down. I can't reach."
    ], context: "killing meは「殺される」=「超痛い」。英語は痛みを暴力で表現する。My back is killing me(腰が俺を殺しにきてる)。wreck=「破壊する」。I'm wrecked(壊れた)。tensionは「緊張・張り」。日本語の「肩こり」は英語に直訳できない。shoulder tension / stiff shouldersで説明するしかない。「こり」は日本語固有の概念。", category: 'reaction', month: '2026-03' },
    { daySlot: 18, japanese: '寝すぎて逆にだるい', english: [
        "slept too much",
        "I overslept and somehow feel worse, make it make sense",
        "I got too much sleep and now I'm more tired than if I'd gotten none",
        "I slept twelve hours. twelve. and you'd think I'd wake up feelin' amazing, right? refreshed? reborn? nope. I feel like I got hit by a bus. a slow bus. how does that work? how does MORE sleep make you MORE tired? my body is broken. the math doesn't math. someone explain sleep science to me 'cause I'm clearly doin' it wrong."
    ], context: "make it make senseは「意味わかるように説明して」。同じmakeが2回出る面白い構造。the math doesn't mathは最近のスラングで「計算が合わない」。名詞のmathを動詞として使う遊び。英語は何でも動詞にできる。日本語の「逆に」は英語では表現しにくい。somehow(なぜか)で代用するけど、「逆に」の感覚は薄い。", category: 'reaction', month: '2026-03' },
    { daySlot: 18, japanese: '水もっと飲まなきゃ', english: [
        "gotta drink more water",
        "I gotta hydrate, I'm runnin' on caffeine and regret",
        "I need to seriously start drinking more water, I'm basically dehydrated 24/7",
        "I need to drink more water. I know this. everyone knows this. every health article ever written says 'drink water.' and what do I drink? coffee. energy drinks. more coffee. my blood type is probably espresso at this point. my body's screamin' for water and I keep handin' it caffeine like 'here, figure it out.'"
    ], context: "hydrate(水分補給する)は最近よく聞く健康系の単語。stay hydrated(水分補給を忘れずに)はSNSでも定番。running on~は「〜で動いてる」。I'm running on fumes(ガス欠寸前)、running on caffeine(カフェインだけで動いてる)。エンジンの燃料のイメージ。人間を機械として語る英語の癖が出てる。", category: 'suggestion', month: '2026-03' },
    { daySlot: 18, japanese: '姿勢悪いって言われた', english: [
        "got called out on my posture",
        "someone told me my posture's terrible and honestly, fair",
        "I got called out for slouching and I couldn't even argue because they were right",
        "someone said 'you should sit up straighter' and I was like... yeah, probably. but also, have you seen modern life? everything is designed to make you hunch over. phones, laptops, desks. we're all slowly evolvin' into question marks. I'm not slounchin' by choice. society did this to me. I'm a victim of ergonomics."
    ], context: "get called outは「指摘される・ツッコまれる」。call outは「声をかける」が原義だけど、今は「問題点を公に指摘する」。SNSではcall-out culture(指摘文化)とも。slouch=「猫背で座る」。fairは「フェアだ」→「まあ正しい」。相手の批判を認めるときのカジュアルな一言。honestly, fairは「正直、その通り」。", category: 'reaction', month: '2026-03' },
    { daySlot: 18, japanese: '整体行きたい', english: [
        "need a massage",
        "I desperately need to see a chiropractor or somethin'",
        "my body's falling apart, I need professional help at this point",
        "I need to go to a chiropractor. or a masseuse. or an exorcist. whatever it takes to get my spine back in line. I've been crackin' my own neck like a glow stick and that's probably not great. my body didn't come with a manual and I've been guessin' for thirty-some years. the guessin' is not goin' well."
    ], context: "chiropractorは「カイロプラクター」。日本語の「整体」に一番近いけど完全一致ではない。英語圏にはchiropractor(骨格矯正)、massage therapist(マッサージ師)、physical therapist(理学療法士)と分かれてる。日本の「整体」は全部まとめた概念。falling apartは「バラバラになる」=「体がボロボロ」。物にも人にも使える。", category: 'request', month: '2026-03' },
    { daySlot: 18, japanese: '朝起きた瞬間からだるい', english: [
        "tired from the jump",
        "I woke up already tired, the day didn't stand a chance",
        "I opened my eyes this morning and immediately wanted to close them again",
        "I woke up tired. like, the alarm went off and my first thought wasn't 'good morning' it was 'already?' I hadn't even done anything yet and I was exhausted. day hadn't started and I was already behind on energy. it's like startin' a video game with zero health. no power-ups. just a guy in his underwear versus the entire day. good luck."
    ], context: "from the jumpは「最初から」。jumpは「始まり」。from the jump = from the startのスラング版。didn't stand a chanceは「勝ち目がなかった」。the day didn't stand a chanceは「その日は最初から終わってた」。英語は1日を対戦相手として扱う。beat the day(日に勝つ)、survive the day(生き延びる)。毎日がボス戦。", category: 'reaction', month: '2026-03' },
    { daySlot: 18, japanese: '運動した後って気持ちいいのにな', english: [
        "always feels good after",
        "workin' out always feels amazing after, getting started is the problem",
        "I know I'll feel great once I start, but convincing myself to actually start is the hard part",
        "the thing about exercise is -- after you do it, you feel incredible. like a new person. endorphins, energy, all that. the problem is the before. the before is where dreams go to die. 'cause the couch is right there. and Netflix is right there. and my gym clothes are... somewhere. probably in the laundry. so really it's the laundry's fault I don't work out."
    ], context: "getting started is the problemは「始めるのが問題」。英語はthe+名詞+is the problemで「〜が問題」と言える。The money is the issue(お金が問題)、The timing is off(タイミングが悪い)。convince myselfは「自分を説得する」。英語では自分の中に「やりたくない自分」と「やるべき自分」がいて、説得交渉する。自分との会議。", category: 'opinion', month: '2026-03' },

    // -- Day 19: SNS・ネット --
    { daySlot: 19, japanese: 'また時間溶けた', english: [
        "lost track of time",
        "I just lost an hour scrollin' and I can't get it back",
        "I picked up my phone to check one thing and somehow an hour disappeared",
        "I opened Instagram to check one thing. one. thing. and then the algorithm got me. next thing I know it's an hour later and I've watched fourteen dog videos, three cooking reels, and a guy buildin' a cabin in the woods. do I regret it? kinda. would I do it again? absolutely. the algorithm knows me better than I know myself."
    ], context: "lost track of timeは「時間の感覚を失った」。trackは「追跡」=時間を追いかけるのをやめてしまった。scrollin'は「スクロールする」。日本語の「時間が溶ける」は英語にない美しい表現。英語はtime flew(時間が飛んだ)かlost track。溶ける感覚は日本語独自。物質が液体になる=形をなくす。消えるより詩的。", category: 'reaction', month: '2026-03' },
    { daySlot: 19, japanese: 'バズってるやつ見た？', english: [
        "did you see that viral thing?",
        "yo, did you see what's blowin' up online?",
        "have you seen that thing everyone's talking about? it's everywhere",
        "did you see it? it's everywhere. literally everywhere. my feed, your feed, my mom's feed probably. when somethin' goes viral it's like a disease -- you can't avoid it. you don't choose to see it. it chooses you. it finds you. even if you don't have social media, someone'll show you on their phone. there is no escape from viral content."
    ], context: "go viralは「バズる」。viralは「ウイルスの」。つまりバズる=ウイルスのように広がる。日本語の「バズる」は英語のbuzzから来てるけど、英語ではgo viralのほうが圧倒的に使われる。blow up(爆発する)も同義。trending(トレンド入り)はランキング的ニュアンス。それぞれ微妙に違う。viral=制御不能、trending=数字で測定可能。", category: 'suggestion', month: '2026-03' },
    { daySlot: 19, japanese: 'コメント欄が地獄', english: [
        "the comments are a mess",
        "don't read the comments, it's a warzone down there",
        "I made the mistake of reading the comments and now I've lost faith in humanity",
        "I read the comments. I know. I know you're not supposed to. everyone says 'don't read the comments.' and every time I think 'it can't be that bad.' but it is. it's always that bad. people in comment sections are a different species. they say things they'd never say in person. the internet gave everyone a microphone and zero consequences. fun combo."
    ], context: "warzoneは「戦場」。コメント欄を戦場に例えるのは英語圏の定番。dumpster fire(ゴミ箱の火事)も同義。lost faith in humanityは「人類への信頼を失った」。大げさだけどネットでは日常的に使う。don't read the commentsは英語圏のお約束。日本語の「コメ欄荒れてる」に近いけど、英語のほうが破壊的イメージ。", category: 'reaction', month: '2026-03' },
    { daySlot: 19, japanese: 'いいね押しといた', english: [
        "liked it",
        "I liked it, that's my level of support",
        "I hit like on your post, that's basically a standing ovation from me",
        "I liked your post. and for me, that's huge. I barely like anything. my feed is full of stuff I scroll past without reactin'. so when I actually stop and press that little heart, that means somethin'. it means I acknowledged your existence on the internet. you're welcome. that's the highest honor I can bestow upon a fellow human."
    ], context: "hit likeは「いいねを押す」。hitは「叩く」。ボタンを叩くイメージ。standing ovationは「スタンディングオベーション」=最高の称賛。from meを付けると「俺から」の限定で特別感を出す。英語ではいいね=最小限のコミュニケーション。likeは名詞にも動詞にもなる。SNS時代に意味が拡張した単語の代表格。", category: 'filler', month: '2026-03' },
    { daySlot: 19, japanese: 'フォロワー増えない', english: [
        "nobody follows me",
        "my follower count hasn't moved in weeks, brutal",
        "I'm posting into the void, nobody's seeing this stuff",
        "my follower count is the same as it was three months ago. actually, I think it went down by two. who unfollowed me? I wanna know. not to confront them. just to stare at their profile and wonder what I did wrong. was it the food pic? it was the food pic, wasn't it? I knew that lighting was bad. my audience has standards apparently."
    ], context: "posting into the voidは「虚空に投稿する」=「誰も見てない」。the voidは「虚空・空虚」。brutalis「残酷」。一言で「キツい」を表現する。unfollowは「フォロー解除する」。英語はun-を付けるだけで逆の動詞を作れる。unlike(いいね取り消し)、unsubscribe(登録解除)。日本語は全部「〜を解除する」と長くなる。", category: 'opinion', month: '2026-03' },
    { daySlot: 19, japanese: 'ネットの情報ってどこまで信じていいの', english: [
        "can you even trust the internet?",
        "I don't know what's real anymore, the internet broke me",
        "you can't believe anything online these days, everything's either fake or exaggerated",
        "I don't know what's real anymore. I see a headline and my first instinct is 'that's fake.' and half the time I'm right. but the other half I'm wrong and I missed actual news 'cause I assumed it was clickbait. the internet trained me to distrust everything. which is probably healthy? or maybe it's paranoia? see, I don't even trust my own judgment about trustin' things."
    ], context: "clickbaitは「クリックベイト」=タイトル詐欺。bait=「餌」。クリックさせるための餌。take it with a grain of salt(話半分に聞く)も定番。grain of saltは「塩一粒」。塩一粒分の疑いを持って聞け、という意味。日本語の「鵜呑みにするな」に近い。英語は塩、日本語は鳥。どっちも面白い比喩。", category: 'opinion', month: '2026-03' },
    { daySlot: 19, japanese: '既読スルーされた', english: [
        "left on read",
        "they left me on read, that's cold",
        "I can see they read my message and just chose not to respond, ouch",
        "left on read. the two blue checkmarks of betrayal. they saw it. they read it. they made a conscious decision to not reply. and now I'm sittin' here like 'was it something I said? was the message too long? too short? did the tone feel off?' I'm analyzin' a text message like it's a crime scene. this is what technology does to people."
    ], context: "left on readは「既読スルー」。英語圏でもこの概念は最近生まれた。read receipts(既読通知)がある前は存在しなかった問題。that's coldは「冷たい」=「ひどい」。ouchは「痛っ」だけど、精神的ダメージにも使う。日本語の「既読スルー」は名詞だけど、英語のleft on readは受動態。「放置された」という被害者感が強い。", category: 'reaction', month: '2026-03' },
    { daySlot: 19, japanese: 'スマホ依存だわ', english: [
        "totally addicted to my phone",
        "I'm glued to my phone, it's actually a problem",
        "I can't put my phone down for more than five minutes, I think I have a real problem",
        "I'm addicted to my phone. and I know I'm addicted. the screen time report comes in every week and I just... close it. immediately. don't even look at the number. 'cause if I looked at the number I'd have to do somethin' about it. and I don't wanna do somethin' about it. ignorance is bliss. informed ignorance is even blisser."
    ], context: "glued toは「くっついて離れない」。glue=接着剤。I'm glued to the screen(画面にくっついてる)。screen timeは「スクリーンタイム」=スマホ使用時間。英語圏でも社会問題になってる。put downは「置く」。I can't put it down(置けない)は本にもスマホにも使える。何かに夢中で手放せない状態。依存とハマりの境界が曖昧。", category: 'reaction', month: '2026-03' },
    { daySlot: 19, japanese: 'アカウント乗っ取られたかも', english: [
        "think I got hacked",
        "I think my account got hacked, this is not good",
        "something weird's going on with my account, I think someone got into it",
        "I think I got hacked. either that or past-me posted somethin' I don't remember. which is also scary in its own way. there's a post from 3 AM that I definitely didn't write. unless I sleepwalk and sleep-post now. which would be a new low. either way, I'm changin' all my passwords. all of 'em. even the ones I don't remember havin'. especially those."
    ], context: "get hackedは「ハッキングされる」。gotは受動態のカジュアル版。get + 過去分詞=「〜される」のカジュアル形。get fired(クビになる)、get robbed(盗まれる)。was hackedより口語的。past-meは「過去の自分」。英語は時制の違う自分を別人扱いする。future me(未来の俺)will deal with it(任せた)。自分を複数人として語る。", category: 'reaction', month: '2026-03' },
    { daySlot: 19, japanese: 'もう寝ようと思ったのにまた開いた', english: [
        "opened it again",
        "I was about to sleep and opened my phone again like a fool",
        "I literally said 'OK last check' twenty minutes ago and I'm still scrolling",
        "I said I was gonna sleep. put the phone on the charger. pulled the blanket up. closed my eyes. lasted about forty-five seconds. then grabbed the phone again. didn't even have a reason. just muscle memory. my hand just went for it like a reflex. I'm not controllin' the phone anymore. the phone's controllin' me. we switched roles and I didn't notice."
    ], context: "muscle memoryは「筋肉の記憶」=「体が勝手に動く」。reflexは「反射」。英語では「体が勝手にやった」をmuscle memory / on autopilot / out of habitで表現する。日本語の「つい」に近いけど、英語はもっと具体的に理由を説明しようとする。just / automatically / without thinkingも使える。「つい」の一語で済む日本語が羨ましい場面。", category: 'reaction', month: '2026-03' },

    // -- Day 20: 家事・掃除 --
    { daySlot: 20, japanese: '洗い物溜まりすぎ', english: [
        "dishes are piling up",
        "the dishes are pilin' up and I'm runnin' out of excuses",
        "I've been ignoring the sink for three days and it's starting to fight back",
        "the dishes. oh god, the dishes. they're pilin' up like they're buildin' a civilization in my sink. I swear they're multiplyin'. I used one cup and now there's somehow seven. it's a dish ecosystem. I'm afraid to touch it at this point 'cause I feel like it might collapse. it's structural. one wrong move and the whole tower comes down."
    ], context: "pile upは「積み重なる」。pile=「山」。日本語の「溜まる」と近いけど、pile upは物理的に積み上がるイメージ。The work is piling up(仕事が山積み)。fight backは「反撃する」。物が反撃するのは英語のユーモア。The laundry is fighting back(洗濯物が逆襲してきた)。無生物を敵として擬人化する。", category: 'reaction', month: '2026-03' },
    { daySlot: 20, japanese: '掃除したら広くなった', english: [
        "so much more space now",
        "I cleaned up and my room doubled in size somehow",
        "I finally cleaned and it turns out my apartment is actually bigger than I thought",
        "I cleaned my room. and turns out there's a floor under all that stuff. who knew? the room's like twice as big now. I found things I forgot I owned. a book from 2019. a charger for a phone I don't have anymore. it's like archaeological discovery. every cleaning session is a trip through my personal history. some of it I'd rather forget."
    ], context: "turns outは「判明した・分かった」。it turns out + 文で「実は〜だった」。掃除して「実は広かった」という発見。doubled in sizeは「サイズが2倍になった」。doubleは動詞で「2倍になる」。英語は数字を動詞にするのが得意。tripled(3倍になった)、halved(半分になった)。日本語は「2倍になった」と言うけど、英語はdoubled一語。", category: 'reaction', month: '2026-03' },
    { daySlot: 20, japanese: '洗濯物干さなきゃ', english: [
        "gotta hang the laundry",
        "the laundry's not gonna hang itself, sadly",
        "I need to hang up the laundry before it starts smelling weird in the machine",
        "the laundry's done. has been done for... a while. it's just sittin' in the washer. marinatin'. every hour I don't hang it up, it gets a little more questionable. there's a window of time between 'clean' and 'needs to be rewashed' and I'm dangerously close to the border. I'm playin' laundry chicken with myself. and I'm losin'."
    ], context: "it's not gonna [verb] itselfは「勝手にはやってくれない」の定番表現。The house isn't gonna clean itself(家は勝手にきれいにならない)。自分でやるしかないという諦めのユーモア。marinateは「漬け込む」。洗濯物が洗濯機の中でマリネされてる。食べ物の動詞を服に使うギャップが笑いを生む。英語は比喩の転用が自由。", category: 'request', month: '2026-03' },
    { daySlot: 20, japanese: 'ゴミの日忘れた', english: [
        "missed trash day",
        "I missed trash day again, my garbage is judging me",
        "I forgot to take the trash out and now I gotta live with it for another week",
        "I missed trash day. again. and it's not like I didn't know. I knew. I set an alarm. the alarm went off. I hit snooze. and then just... forgot. so now I've got a week's worth of trash sittin' there. starin' at me. remindin' me of my failure. my garbage has become a monument to my inability to function as an adult. a shrine of procrastination."
    ], context: "take the trash outは「ゴミを出す」。take outは「外に出す」。日本語は「ゴミを出す」だけど、英語はtake it out(持ち出す)。出すという行為を「持って外に運ぶ」と描写する。trash day(ゴミの日)は英語圏にもある。live with itは「それと共存する」=「我慢する」。ゴミと同居するハメになる切なさ。", category: 'reaction', month: '2026-03' },
    { daySlot: 20, japanese: '片付けてもすぐ散らかる', english: [
        "gets messy right away",
        "I just cleaned and it's already a mess again, how?",
        "I literally cleaned this morning and it looks like I didn't do anything",
        "I cleaned this morning. this morning. like, six hours ago. and look at it. LOOK AT IT. it's like the cleaning never happened. like time reversed itself. I'm convinced my apartment has a factory reset. every twelve hours it just goes back to chaos. there's no point. I'm cleanin' a house that wants to be dirty. it's fightin' me. and it's winnin'."
    ], context: "messy=「散らかった」。a messは名詞で「めちゃくちゃな状態」。What a mess(なんて散らかりよう)。it looks like~は「〜みたい」。it looks like I didn't do anythingは「何もやってないみたい」。factory resetは「工場出荷状態に戻す」。テック用語を部屋に使うのは現代英語っぽい。部屋がデフォルト=散らかった状態に戻る、という比喩。", category: 'reaction', month: '2026-03' },
    { daySlot: 20, japanese: '料理するより片付けの方がめんどい', english: [
        "cleanup's worse than cooking",
        "cookin's the fun part, cleanup is the price you pay",
        "I love making food but the dishes afterwards make me wanna order delivery forever",
        "I'll cook. I like cookin'. it's the aftermath I can't handle. the dishes, the counters, the stove, the floor somehow. how did sauce get on the floor? I was nowhere near the floor. cookin' creates chaos in dimensions I didn't know existed. the food took thirty minutes. the cleanup takes an hour. the ratio is broken. the system is flawed. someone fix this."
    ], context: "the price you payは「払う代償」。fun has a price(楽しさには代償がある)。aftermathは「余波・後始末」。元は戦争用語。the aftermath of war(戦争の余波)。料理の後片付けを「余波」と呼ぶ大げささ。英語は日常を戦場に例えるのが得意。order delivery(デリバリーを頼む)は片付けを根本から回避する究極の解決策。", category: 'opinion', month: '2026-03' },
    { daySlot: 20, japanese: '換気しないとヤバい', english: [
        "need to air this place out",
        "I gotta open a window, it's gettin' funky in here",
        "this room needs fresh air badly, it smells like a closed system",
        "I need to open a window. I've been in here with the windows closed for... I don't wanna think about how long. the air in this room has been recycled through my lungs so many times it's basically used. it's secondhand air. I'm breathin' my own exhaust. like a car idlin' in a garage. except the car is me and the garage is my apartment. open the window."
    ], context: "air outは「換気する」。airを動詞で使う。air out the room(部屋を換気する)。funkyは「臭い・怪しい」のスラング。原義は音楽のファンキーだけど、匂いに使うと「なんか変な匂い」。it's getting funkyは「ヤバくなってきた」。英語のfunkyは文脈で意味が180度変わる。音楽=かっこいい、匂い=ヤバい。同じ単語。", category: 'request', month: '2026-03' },
    { daySlot: 20, japanese: 'やり始めると止まらないタイプ', english: [
        "once I start I can't stop",
        "once I get goin' I go full cleaning mode, no in-between",
        "I either don't clean at all or I deep-clean everything, there's no middle ground",
        "I'm an all-or-nothing cleaner. zero or a hundred. there's no casual tidy-up for me. either the room stays as-is or I'm movin' furniture, scrubbin' grout, organizin' drawers by color. last time I started cleanin' I ended up rearrangin' the entire kitchen. I went in to do dishes and came out four hours later havin' changed the room's whole identity. I'm a cleaning extremist."
    ], context: "all-or-nothingは「全か無か」。二択人間を表現する定番。no middle ground(中間地帯がない)=「加減ができない」。deep-cleanは「徹底的に掃除する」。deepを付けると強度が上がる。deep sleep(深い眠り)、deep dive(深掘り)。英語はdeepを何にでも付けて「ガチ版」を作れる。日本語の「ガチ」に近い接頭語。", category: 'opinion', month: '2026-03' },
    { daySlot: 20, japanese: 'ルンバに任せたい', english: [
        "let the robot do it",
        "where's my robot vacuum when I need it, do the work for me",
        "I just want a Roomba to handle everything so I never have to clean again",
        "I want a Roomba for everything. dishes? Roomba. laundry? Roomba. cookin'? Roomba. I don't care if the technology doesn't exist yet. invent it. I'll pay. I'll pay whatever it costs. my dream life is one where I do absolutely nothin' and machines handle the rest. is that lazy? yes. do I care? not even a little. the future was supposed to be robots doin' chores. where are my robots?"
    ], context: "let someone/something do itは「〜に任せる」。letは「させる・許可する」。Let me handle it(俺に任せて)。handle=「処理する」も便利。Can you handle it?(対応できる?)。where's my~when I need it?は「必要なときに限ってない」パターン。英語は不在を嘆く構文が多い。Where's my coffee?(コーヒーどこ?)で「今すぐ必要」を表現する。", category: 'suggestion', month: '2026-03' },
    { daySlot: 20, japanese: 'キッチンだけは綺麗にしてる', english: [
        "kitchen stays clean",
        "I keep my kitchen clean, that's my one flex",
        "the rest of my place is a disaster but the kitchen? spotless, always",
        "my kitchen is clean. always. it's the one thing I'm disciplined about. the rest of the apartment? chaos. my bedroom looks like a tornado auditioned there and got the part. but the kitchen? pristine. I have standards. they're very specific and very narrow. but they exist. everyone's got their one thing they keep together. mine's the kitchen. everything else is negotiable."
    ], context: "flexは「自慢」のスラング。That's my one flex(唯一の自慢)。元はflexing muscles(筋肉を見せびらかす)から。spotlessは「シミひとつない」=「完璧にきれい」。a disasterは「災害」=「ひどい状態」。pristineは「手つかずの美しさ」。英語は「きれい」の段階が多い。clean < spotless < pristine。日本語は「きれい」一語で全部カバー。", category: 'opinion', month: '2026-03' },

    // -- Day 21: 季節の変わり目 --
    { daySlot: 21, japanese: '朝晩の気温差えぐい', english: [
        "temperature swings are wild",
        "it's freezin' in the morning and boiling by noon, pick one",
        "the temperature difference between morning and afternoon is ridiculous right now",
        "this morning I walked out in a jacket. by lunch I was dyin' of heat. took the jacket off. by evening I needed it again. I'm changin' layers like a fashion show. morning is winter, afternoon is summer, evening is fall. we're speedrunnin' all four seasons in one day. my wardrobe can't keep up. I need a personal meteorologist just to get dressed."
    ], context: "swingsは「揺れ・変動」。temperature swings(気温の変動)。mood swings(気分の変動)も同じ構造。wildは「ヤバい」のカジュアル版。That's wild(それヤバいな)。pick oneは「どっちか選べ」。二択を迫る命令形。英語は天気に命令する。気温差を「どっちかにしろ」と文句を言う。天気すら交渉相手にする言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 21, japanese: '何着ればいいかわからん', english: [
        "no idea what to wear",
        "I have no idea what to wear, the weather's messin' with me",
        "I stood in front of my closet for ten minutes and still couldn't figure out what to wear",
        "what do I wear. jacket? no jacket? long sleeves? short sleeves? both? do I layer? do I bring a backup outfit in a bag? this is too many decisions for 7 AM. I'm not a weather analyst. I'm a guy tryin' to leave the house without freezin' or sweatin'. is that too much to ask? apparently yes. the season said 'figure it out yourself' and left."
    ], context: "mess with meは「俺を困らせる・翻弄する」。messは「めちゃくちゃにする」。Don't mess with me(俺をナメるな)と脅しにもなるけど、天気に使うと「振り回される」。layerは「重ね着する」。名詞(層)が動詞になる英語の柔軟さ。Layer up(重ね着しろ)。figure outは「解明する」。英語では服選びすら「解明」作業。", category: 'reaction', month: '2026-03' },
    { daySlot: 21, japanese: '花粉やばくない？', english: [
        "pollen's brutal",
        "is it just me or is pollen tryin' to kill everyone right now?",
        "the pollen count must be insane because I can't stop sneezing",
        "my eyes are waterin'. my nose is runnin'. I'm sneezin' every thirty seconds. and I walked outside for what? two minutes? pollen is on a personal vendetta against my face. every spring it's the same war and I lose every single year. I've never won. not once. pollen is undefeated. someone needs to have a talk with the trees. tell 'em to chill."
    ], context: "personal vendettaは「個人的な恨み」。イタリア語由来で復讐の意味。花粉が自分を狙ってるという被害妄想的ユーモア。pollen countは「花粉量」。count=数えた結果の数値。英語では花粉を「量」で語る。日本語の「花粉やばい」は感覚的だけど、英語は数値化して語る傾向。undefeatedは「無敗の」。花粉をスポーツの対戦相手に見立てる。", category: 'reaction', month: '2026-03' },
    { daySlot: 21, japanese: '桜そろそろ咲くかな', english: [
        "cherry blossoms soon",
        "cherry blossoms should be comin' soon, can't wait",
        "I think the cherry blossoms are about to bloom, it's that time of year",
        "cherry blossom season's comin'. and I know everyone makes a big deal about it. but honestly? it IS a big deal. for like two weeks the world looks like a screensaver. and then it's over. and that's what makes it special. if cherry blossoms lasted all year nobody'd care. scarcity creates beauty. that's deep. I'm a philosopher now. blame the trees."
    ], context: "cherry blossom=「桜」。日本語は「桜」一語だけど英語は二語必要。bloomは「咲く」。flowers bloom(花が咲く)。it's that time of yearは「毎年この時期だね」の定番表現。seasonal event(季節行事)を語るときの前置き。scarcityは「希少性」。英語圏では桜の儚さを「希少性が価値を生む」と経済学的に語る人もいる。", category: 'opinion', month: '2026-03' },
    { daySlot: 21, japanese: '衣替えしなきゃ', english: [
        "gotta swap out my clothes",
        "time to switch over to spring clothes, finally",
        "I need to put away winter stuff and pull out the spring wardrobe",
        "I gotta do the seasonal closet swap. and by that I mean I gotta move a mountain of sweaters to make room for t-shirts. and then in six months I'll do it again. in reverse. it's like migration. I'm a clothing bird. flyin' my wardrobe south for the summer. this is the most boring adventure a human can go on. but it must be done."
    ], context: "swap outは「入れ替える」。swap=交換。日本語の「衣替え」は英語に直訳できない。seasonal wardrobe swap / switch over to spring clothesで説明する。「衣替え」は日本文化特有の概念。英語圏にも季節の服の入れ替えはあるけど、名前がついてない。名前がある=文化として認識してる証拠。日本語の整理力。", category: 'request', month: '2026-03' },
    { daySlot: 21, japanese: '雨多くない？最近', english: [
        "been raining a lot",
        "it's been rainin' nonstop, I'm over it",
        "it feels like it's been raining every single day for the past two weeks",
        "rain. again. I swear it's been rainin' for like two weeks straight. I've forgotten what the sun looks like. I'm developin' a personal relationship with my umbrella. we go everywhere together. I named it. its name is Disappointing Greg. 'cause every time I grab it I think 'again?' and it just silently confirms. again. always again."
    ], context: "I'm over itは「もううんざり」。overは「超えた」=「もう限界を超えた」。be over someone/something=「飽きた・もう嫌」。I'm over this weather(この天気もう無理)。nonstopは「ノンストップ」。ずっと続いてることを強調。straightは「連続で」。two weeks straight(2週間連続)。日本語の「〜っぱなし」に近い。rain keeps fallingより口語的。", category: 'reaction', month: '2026-03' },
    { daySlot: 21, japanese: '暖かくなってきた', english: [
        "warmin' up",
        "it's finally warmin' up, about time",
        "the weather's getting warmer and I can feel my mood improving already",
        "it's warmin' up. finally. I can feel it. the air's different. the light's different. my depression is slightly less depressing. that's how I measure seasons -- by my mental health. winter = bad. spring = less bad. summer = sweaty but hopeful. fall = pretty but suspicious. right now we're in 'less bad' territory and I'll take it. progress."
    ], context: "about timeは「やっとだよ」。It's about time!(やっとかよ!)。ずっと待ってたことが起きたときの定番。直訳は「時間について」だけど実際は「遅すぎ」の意味。I can feel itは「感じる」。英語は体感を重視する。feel the change(変化を感じる)、feel the difference(違いを感じる)。五感で季節を語る。", category: 'reaction', month: '2026-03' },
    { daySlot: 21, japanese: 'エアコンつけるか迷う時期', english: [
        "AC or no AC, that is the question",
        "it's that weird in-between where you can't decide on AC or windows",
        "it's not hot enough for AC but not cool enough to be comfortable, the worst zone",
        "the worst time of year. not summer. not winter. the in-between. where it's kinda warm but not AC warm. so you open the window but then it's too cold. close it. too warm. open. cold. you're just sittin' there adjustin' the window like a human thermostat. I'm not temperature-comfortable for approximately four months of the year. the other eight? also no. I'm never comfortable."
    ], context: "in-betweenは「中間」。the awkward in-between(微妙な中間期)。awkward=「気まずい・微妙」。英語では季節の変わり目を「awkward」と形容する。thermostatは「サーモスタット」=温度調節器。人間をサーモスタットに例える。英語は人を機械に見立てるのが好き。running on empty(ガス欠)、recharging(充電中)、overheating(オーバーヒート)。", category: 'opinion', month: '2026-03' },
    { daySlot: 21, japanese: '日が長くなってきたね', english: [
        "days are gettin' longer",
        "the days are gettin' longer and it actually helps, mentally",
        "I noticed the sun's staying out later now and it genuinely makes me happier",
        "the sun's out later now. like, it's 6 PM and it's still bright. and that does somethin' to your brain. in winter it's dark at 4:30 and your body's like 'OK, day's over, shut down.' but now? 6 PM and there's still light? my brain goes 'bonus round!' it feels like free time. like the day gave you extra credit. spring light is a mood drug and it's legal."
    ], context: "staying outは「外にいる」。太陽が「外に残ってる」=「日が長い」。英語は太陽を人として扱う。The sun came out(太陽が出てきた)、the sun's hiding(太陽が隠れてる)。bonus roundは「ボーナスラウンド」=ゲーム用語で「おまけの時間」。日が長い=おまけの時間をもらった感覚。英語は時間をゲーム化する。", category: 'reaction', month: '2026-03' },
    { daySlot: 21, japanese: '冬物しまうのめんどくさ', english: [
        "hate putting winter stuff away",
        "packin' up winter clothes is the most boring chore alive",
        "I dread putting winter clothes away because it means dealing with my closet disaster",
        "puttin' winter clothes away. the chore nobody talks about. you gotta fold everything. find boxes or bags. make room. then you open the closet and it's already full. where does this stuff come from? I don't remember buyin' half of it. and now I gotta play Tetris with sweaters. real-life Tetris. no score. no music. just frustration and mothballs."
    ], context: "dreadは「恐れる・嫌がる」。I dread Mondays(月曜が怖い)。dreadはfear(恐怖)より日常的。「やりたくなさすぎて考えただけで嫌」の強さ。the most boring chore aliveは「この世で一番退屈な家事」。aliveを付けると「現存する中で」の意味。the best pizza alive(現存最高のピザ)。英語は無生物にaliveを使って強調する遊び。", category: 'opinion', month: '2026-03' },

    // -- Day 22: 愚痴・ストレス --
    { daySlot: 22, japanese: 'もう無理、限界', english: [
        "I'm done",
        "I'm done, I've hit my limit, don't push me",
        "I have reached my absolute limit and I cannot handle one more thing today",
        "I'm done. capital D done. don't ask me to do one more thing. my capacity is at zero. actually it's at negative. I'm operatin' in the red. the tank is empty. the battery is dead. pick whatever metaphor you want -- they all apply. I'm not burnin' out. I've already burned. I'm the ash. I'm the aftermath. just let me sit here and be nothing for a while."
    ], context: "I'm doneは「もう終わり」。物理的に終わったんじゃなくて、精神的に限界。hit my limitは「限界に達した」。hitは「打つ」→「到達する」。hit the wall(壁にぶつかる)も同じ。日本語の「限界」は英語でlimit / breaking point / last straw。last strawは「最後の藁」=ラクダの背中に藁を一本ずつ乗せて最後の一本で折れる話から。", category: 'shutdown', month: '2026-03' },
    { daySlot: 22, japanese: '聞いてくれる？愚痴なんだけど', english: [
        "can I vent?",
        "can I vent real quick? I just need to get this off my chest",
        "I need to complain about something, do you have a minute to just listen?",
        "OK so -- can I vent? I'm not lookin' for advice. I don't want solutions. I don't want 'have you tried...' I just need someone to sit there and go 'ugh, that sucks' while I talk. that's it. that's the service I require. professional sympathetic nodding. can you do that? great. buckle up 'cause this is gonna take a minute."
    ], context: "ventは「愚痴を言う・吐き出す」。元は「換気する」。感情を換気する=外に出す。get this off my chestは「胸の重荷を下ろす」。chestは「胸」。重い感情が胸に乗ってるイメージ。日本語の「愚痴」は英語ではvent / rant / complain。ventは一番カジュアルで「ちょっと聞いて」の軽さ。rantは「長い怒りの独演会」。温度が違う。", category: 'request', month: '2026-03' },
    { daySlot: 22, japanese: 'なんかずっとイライラする', english: [
        "been on edge all day",
        "I've been irritated all day and I can't even explain why",
        "I've had this constant low-level anger simmering all day for no apparent reason",
        "I've been annoyed since I woke up. and there's no reason. nothing happened. nobody did anything. I'm just... mad at the concept of today. the vibes are off. the energy is wrong. my patience is at zero and everything is a trigger. the coffee machine beeped too loud. the door closed too slow. I'm aware I'm being irrational. doesn't help. still mad."
    ], context: "on edgeは「ピリピリしてる」。edgeは「端」。崖の端に立ってるイメージ=いつ落ちてもおかしくない。simmeringは「くすぶってる」。料理用語で「弱火でグツグツ」。怒りが弱火で煮えてる状態。low-level angerは「低レベルの怒り」=爆発はしてないけど常にある。日本語の「イライラ」は英語にぴったりの一語がない。irritated / on edge / annoyedの合わせ技。", category: 'reaction', month: '2026-03' },
    { daySlot: 22, japanese: 'あいつまた適当なこと言ってる', english: [
        "talkin' out of their neck again",
        "they're just makin' stuff up again, classic them",
        "that person is once again confidently saying things that are completely wrong",
        "they're at it again. sayin' stuff with full confidence. zero facts. just vibes and audacity. and the worst part? people are believin' it. 'cause if you say nonsense loud enough and confidently enough, it becomes truth to someone. that's terrifying. I'm over here with actual facts lookin' like the crazy one. reality is a suggestion to these people."
    ], context: "making stuff upは「でっち上げる」。make up=「作り上げる」。嘘だけでなく「適当に言う」もこれ。confidently wrongは「自信満々に間違ってる」。英語圏ではconfidently incorrect(自信たっぷりに不正確)がネットのミームになった。at it againは「またやってる」。it=いつもの行動。itで具体的に言わなくても「いつものアレ」が伝わる。", category: 'reaction', month: '2026-03' },
    { daySlot: 22, japanese: '自分だけ損してる気がする', english: [
        "feel like I'm gettin' the short end",
        "I always end up gettin' the short end of the stick somehow",
        "it feels like no matter what I do, I'm the one who ends up worse off",
        "I keep endin' up with the short end of the stick. every. single. time. and I'm not bein' dramatic. well, maybe a little. but look at the pattern. I do the work, someone else gets the credit. I make the plan, someone else changes it. I bring the snacks, someone else eats 'em all. at what point do I stop being generous and start being a doormat? askin' for a friend. the friend is me."
    ], context: "the short end of the stickは「損な役回り」。棒(stick)の短い方を掴まされる=不利な立場。doormatは「玄関マット」=「踏みつけにされる人」。be a doormatは「いいように使われる」。asking for a friendは「友達が聞いてるんだけど」=「本当は自分のこと」。英語圏の定番ジョーク。自分のことを聞くのが恥ずかしいときに使う。", category: 'opinion', month: '2026-03' },
    { daySlot: 22, japanese: 'もう考えたくない', english: [
        "don't wanna think about it",
        "my brain needs a break, I'm done thinkin' for today",
        "I physically cannot think about this anymore, my brain is refusing to cooperate",
        "I don't wanna think about it. and I mean that literally. my brain has put up an 'out of order' sign. no more processin'. no more analyzin'. the thinking department is closed. come back tomorrow. actually, don't come back tomorrow either. leave a message after the beep. there is no beep. go away. I'm on mental vacation and I didn't book a return flight."
    ], context: "out of orderは「故障中」。自販機やエレベーターに貼る張り紙。これを脳に貼る。英語は脳を機械扱いする。my brain is fried(脳が焼けた)、brain fog(脳の霧)、mental shutdown(メンタルのシャットダウン)。日本語は「頭が回らない」で回転のイメージ。英語は故障・過熱・停止。機械の壊れ方で脳の状態を語る。", category: 'shutdown', month: '2026-03' },
    { daySlot: 22, japanese: 'ストレスで食べすぎる', english: [
        "stress eating",
        "I'm stress eatin' again, it's not great",
        "when I'm stressed I eat everything in sight and then feel worse about it",
        "I stress eat. I know this about myself. and knowin' doesn't stop it. I'll be stressed, open the fridge, and my brain goes 'comfort food will fix this.' spoiler: it won't. but in the moment? those chips are therapy. that ice cream is a counselor. that leftover pizza is a licensed psychiatrist. and then twenty minutes later I'm stressed AND full. double trouble."
    ], context: "stress eatingは「ストレス食い」。英語はstress+動詞で「ストレスで〜する」パターンを作れる。stress shop(ストレス買い物)、stress clean(ストレス掃除)。in sightは「視界に入る」=「目に入るもの全部」。comfort foodは「慰めの食べ物」=「心を癒す食べ物」。英語圏では公式にcomfort foodというジャンルがある。マカロニチーズ、グリルドチーズなど。", category: 'reaction', month: '2026-03' },
    { daySlot: 22, japanese: '誰にも会いたくない日', english: [
        "not a people day",
        "today's not a people day, don't take it personal",
        "I don't want to see or talk to anyone today, I just need to be alone",
        "I don't wanna see anyone. hear anyone. text anyone. I want to exist in a bubble where nobody can reach me. no notifications. no calls. no 'hey got a minute?' no. I don't got a minute. I got zero minutes. for anyone. today is a me-only day. solo. party of one. and the party is just me sittin' in silence doin' absolutely nothin'. best party ever."
    ], context: "not a people dayは造語だけど通じる。people personは「社交的な人」。a people dayは「人と会える日」。notを付けて「今日は無理」。don't take it personalは「個人的に取らないで」。It's not personal(あなたのせいじゃない)。party of oneは「1名様」。レストランで「1人です」の言い方を自分の人生に使うユーモア。", category: 'shutdown', month: '2026-03' },
    { daySlot: 22, japanese: '寝たら治ると思いたい', english: [
        "sleep it off",
        "I'm just gonna sleep it off and hope tomorrow's better",
        "I'm convinced that sleep is the only thing that can fix this mess of a day",
        "I'm goin' to bed. and when I wake up, today won't exist anymore. that's the magic of sleep. it's a reset button. today was garbage? cool. sleep. wake up. new day. new garbage. wait, that's not the inspirational version. new day. new possibilities. yeah. that sounds better. I don't believe it. but it sounds better. sometimes that's enough."
    ], context: "sleep it offは「寝て回復する」。offは「取り除く」。walk it off(歩いて治す)、shake it off(振り払う)。全部「it」を「off」する=嫌なことを動作で除去する。resetは日本語でもリセット。英語は人生をゲームに例える。new game(新しいゲーム)、game over(終了)、level up(レベルアップ)。日常=ゲームの比喩が英語に根付いてる。", category: 'suggestion', month: '2026-03' },
    { daySlot: 22, japanese: '愚痴って楽にならないけど言いたい', english: [
        "doesn't help but I gotta say it",
        "complainin' doesn't fix anything but I'm gonna do it anyway",
        "I know venting won't solve the problem but sometimes you just need to say it out loud",
        "ventin' doesn't solve anything. I know that. you know that. everyone knows that. but here's the thing -- it's not about solvin'. it's about the sound of your own frustration leavin' your body. like, you say it, it's out there now, and it's not just yours anymore. you shared it. distributed the weight. it's emotional crowdfundin'. doesn't fix it, but the load's lighter."
    ], context: "say it out loudは「声に出して言う」。out loudは「声に出して」。think out loud(考えを口に出す)も使える。doesn't fix anything but~は「解決にはならないけど〜」。英語では「意味ないけどやる」をjustify(正当化)する文化がある。It's the principle(原理原則の問題)、It's the thought that counts(気持ちが大事)。結果より過程を語る。", category: 'opinion', month: '2026-03' },

    // -- Day 23: 驚き・リアクション --
    { daySlot: 23, japanese: 'マジで？', english: [
        "for real?",
        "wait, for real? you're not messin' with me?",
        "are you serious right now? I genuinely can't tell if you're joking",
        "for real? FOR REAL? 'cause I need you to look me in the eye and confirm this. my brain heard it but it's not processin'. it's bufferin'. like a YouTube video on bad wifi. the information went in but it hasn't loaded yet. gimme a second. OK. still bufferin'. are you absolutely sure? 'cause I'm gonna react and I need to know which reaction to use."
    ], context: "for realは「マジで」。realは「本当の」。for real?は疑問で「本当に?」。no cap(嘘じゃなく)と同義のスラング。messin' with meは「からかってる」。buffering(バッファリング)は動画の読み込み中。脳の処理をネットの読み込みに例えるのは現代英語の特徴。日本語の「マジ」も多用するけど、英語のfor realも同じくらい万能。驚き・確認・強調、全部いける。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: 'え、うそでしょ', english: [
        "no way",
        "no way, shut up, you're lying",
        "there's absolutely no way that just happened, I refuse to believe it",
        "no way. no. way. nuh-uh. I don't accept this. this is not real. this is a simulation and someone's messin' with the settings. 'cause in what universe does this happen? in no universe. except apparently this one. where anything goes and nothin' makes sense. reality jumped the shark. I need someone to confirm I'm awake 'cause this feels like a fever dream."
    ], context: "shut upは「黙れ」だけど、驚きのリアクションでは「嘘でしょ!?」の意味になる。友達同士でShut up! No way!(マジで!? 嘘でしょ!?)。声のトーンで全く逆の意味になる。jumped the sharkは「やりすぎた・ありえない展開になった」。テレビ番組『Happy Days』でフォンジーがサメを飛び越えたシーンから。現実がフィクションを超えた瞬間に使う。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: '鳥肌立った', english: [
        "got goosebumps",
        "I literally got goosebumps, that was intense",
        "that gave me full-body chills, I was not expecting that kind of reaction from myself",
        "I got goosebumps. actual goosebumps. like my arms just went full chicken skin without my permission. my body reacted before my brain could process what was happenin'. that's how you know somethin's real -- when your body responds before your mind catches up. goosebumps are your body's spoiler alert. it felt the emotion before you understood it."
    ], context: "goosebumpsは「鳥肌」。goose=ガチョウ + bumps=ブツブツ。日本語は「鳥の肌」、英語は「ガチョウのブツブツ」。同じ現象を別の鳥で表現してるのが面白い。full-body chillsは「全身のゾクゾク」。chill=「寒気」だけど感動や恐怖のゾクッにも使う。英語は寒さと感情が直結してる。chilling story(ゾッとする話)。温度で感情を語る。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: 'さすがにびっくりした', english: [
        "that caught me off guard",
        "OK even I was caught off guard by that one",
        "I don't surprise easily but that genuinely got me, not gonna lie",
        "OK that one got me. and I'm not easy to surprise. I'm usually the 'yeah I saw that comin'' guy. but this? did not see it comin'. not even close. I was completely blindsided. my guard was up and it still got through. which means it wasn't just surprising -- it was next-level surprising. the kind where your mouth opens but no sound comes out. that level."
    ], context: "caught me off guardは「不意を突かれた」。guardは「防御」。off guard=「防御が外れてる状態」。blindsidedは「死角から攻撃された」。blind side=見えない側。アメフト用語から日常に入った。not gonna lie(嘘じゃなく)は前置きの定番。got me=「やられた」。英語では驚きを「攻撃」として表現する。防御・不意打ち・死角。全部戦闘用語。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: 'やばっ、聞いた？', english: [
        "did you hear?",
        "yo, did you hear about that? it's wild",
        "please tell me you heard about this because I need someone to freak out with",
        "did you hear? you didn't hear? oh you're gonna love this. or hate it. one of the two. actually probably both. it's that kind of news. the kind where your face does three expressions in two seconds. ready? you sure? sit down first. actually no, stand up, you might need to pace. OK here it comes. wait let me set the scene first--"
    ], context: "freak outは「パニックになる・大騒ぎする」。freak=「変わり者」が動詞化。freak out with(一緒に騒ぐ)は「共感を求める」行為。英語では驚きを1人で処理できないとき「一緒にリアクションしてくれる相手」を探す。paceは「ウロウロ歩く」。set the sceneは「場面を設定する」=「前置きする」。英語は情報の出し方を演出する。", category: 'suggestion', month: '2026-03' },
    { daySlot: 23, japanese: '想像の10倍すごかった', english: [
        "ten times better than I expected",
        "it was like ten times crazier than I imagined, no joke",
        "what I was expecting and what actually happened are on completely different planets",
        "I went in expectin' like a six outta ten. reasonable expectations. not too high, not too low. and what I got was a fourteen. a fourteen outta ten. the scale broke. my expectations looked at reality and said 'we don't know her.' it was so much better than I thought that I'm actually mad I didn't expect more. I lowballed myself. never again."
    ], context: "no jokeは「冗談じゃなく」=「マジで」。I lowballed myselfは「自分を低く見積もった」。lowballは「低い球を投げる」=「安く見積もる」。元はビジネス用語。on completely different planetsは「全然違う星にいる」=「次元が違う」。英語は「距離」で差を表現する。miles apart(何マイルも離れてる)、not even in the same ballpark(同じ球場にすらいない)。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: 'あ、やっちまった', english: [
        "oh no",
        "oh no no no no, that was not supposed to happen",
        "I immediately knew I messed up the second it happened, instant regret",
        "the moment it happened I knew. you know that feelin'? where time slows down and your brain goes 'oh. oh no. oh no no no.' and you can see the mistake happenin' in slow motion but you can't stop it. it's already in motion. physics has taken over. all you can do is watch and accept your fate. and then clean up the mess. always a mess."
    ], context: "instant regretは「瞬間的な後悔」。instantは「即座の」。instant coffee(インスタントコーヒー)と同じ単語。後悔もインスタントで来る。oh no no noは繰り返しで焦りを表現。英語は同じ単語の繰り返しで感情の強さを示す。no(1回)=普通の否定。no no no(3回)=パニック。wait wait wait=焦り。英語のリピート法。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: 'こんな展開ある？', english: [
        "plot twist",
        "what a plot twist, didn't see that comin' at all",
        "I could not have predicted this outcome if you gave me a hundred guesses",
        "plot twist. actual real-life plot twist. this is the kind of thing that happens in movies and you go 'that's unrealistic' and then it happens to you and you go 'oh.' life doesn't follow a script. it follows chaos theory. you think you know what's comin' next? you don't. nobody does. the universe is a bad writer with good timing."
    ], context: "plot twistは「どんでん返し」。plot=物語の筋、twist=ひねり。映画やドラマの用語だけど日常会話で「予想外の展開」に使う。What a plot twist!(なんというどんでん返し!)。日本語の「まさかの展開」に近い。didn't see that coming=「来るとは思わなかった」。see it comingは「予見する」。I saw it coming(わかってた)の否定形。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: '笑いが止まらん', english: [
        "can't stop laughing",
        "I physically cannot stop laughin', send help",
        "I've been laughing for five minutes straight and my stomach hurts",
        "I can't stop. I'm tryin'. I'm really tryin'. but every time I think I've calmed down I remember it and it starts again. my abs hurt. my face hurts. I'm cryin'. not sad cryin'. laugh cryin'. which is the best kind of cryin'. someone said the thing and now I'm broken. I'm a broken person. a broken, laughin', cryin', stomach-hurtin' person. no regrets."
    ], context: "send helpは「助けを送ってくれ」=「もうダメ」のネットスラング。元は緊急要請だけど、笑いすぎ・食べすぎなど「自分で制御できない」状態に使う。straight=「連続で」。five minutes straight(5分間ぶっ通し)。abs=abdominals(腹筋)の略。laugh cryingは「笑い泣き」。英語では笑いと泣きが同時に起きる状態に名前がある。", category: 'reaction', month: '2026-03' },
    { daySlot: 23, japanese: '世の中何が起こるかわかんないね', english: [
        "you never know",
        "you just never know what's gonna happen, that's life",
        "life is completely unpredictable and today proved it, once again",
        "you never know. you think you know. you plan like you know. you make schedules and set reminders and create backup plans. and then life goes 'nah' and does whatever it wants. and you just stand there with your planner open like 'but I had a system.' yeah? life doesn't care about your system. life is jazz. it improvises. learn to riff or get left behind."
    ], context: "you never knowは「何が起こるかわからない」。主語のyouは「あなた」じゃなくて「人は」の一般論。英語はyouで一般論を語る。unpredictableは「予測不能な」。un + predict + able。英語は接頭語+語根+接尾語で長い形容詞を作る。日本語は「読めない」で済む。life is jazzは比喩。ジャズ=即興=人生。英語は人生を音楽に例えるのが好き。", category: 'opinion', month: '2026-03' },

    // -- Day 24: 提案・誘い --
    { daySlot: 24, japanese: '今度飯行かない？', english: [
        "wanna grab food sometime?",
        "we should grab food sometime, for real this time",
        "hey, we should actually go eat together soon, it's been too long",
        "we should grab food. and I mean actually grab food. not the 'yeah we should totally hang out' that turns into nothin'. I'm talkin' pick a date. pick a place. put it in the calendar. lock it in. 'cause if we don't, it's gonna be another three months of 'we should hang out' texts that lead nowhere. I'm tired of placeholder plans. let's do a real one."
    ], context: "grabは「掴む」だけど、grab food / grab coffee / grab a drink で「軽く食べる/飲む」。grabのカジュアルさが「がっつりディナー」じゃなくて「サクッと」の雰囲気を出す。for real this timeは「今回はマジで」。前回も言って実現しなかった自覚がある。lock it inは「確定させる」。lock=鍵をかける=変更不可にする。予定に鍵をかける。", category: 'suggestion', month: '2026-03' },
    { daySlot: 24, japanese: '暇だったら付き合ってよ', english: [
        "come with me if you're free",
        "if you're not doin' anything, come hang out",
        "I've got nothing going on and I could use some company, you down?",
        "hey, you free? 'cause I'm free. and when two free people exist at the same time, the math says we should hang out. that's science. or sociology. or just me not wantin' to go alone. yeah it's the last one. I don't wanna go alone. goin' places alone is fine and all but sometimes you need someone to turn to and say 'you seein' this?' you know?"
    ], context: "you down?は「乗る?」。downは「下」じゃなくて「賛成・参加する」。I'm down(いいよ)、Are you down?(やる?)。could use some companyは「誰かいてくれると嬉しい」。could useは「あると助かる」。I could use a drink(一杯欲しい)。companyは「仲間・同伴者」。英語では「一人は嫌だ」を直接言わず、could use companyと婉曲表現する。", category: 'request', month: '2026-03' },
    { daySlot: 24, japanese: 'どう？興味ある？', english: [
        "interested?",
        "sounds good right? you in?",
        "what do you think, does that sound like something you'd be into?",
        "so? whaddya think? good idea? bad idea? somewhere in between? I can't read your face right now. gimme somethin'. a nod. a shrug. a facial expression. anything. 'cause I just pitched this idea and now I'm standin' here in the silence and the silence is very loud. the longer you take to respond the more I assume it's a no. so please. say words."
    ], context: "you in?は「参加する?」。inは「中にいる」=「その計画の中に入る?」。I'm in(参加する)は2語で最もカジュアルな承諾。be into somethingは「〜に興味がある」。I'm into jazz(ジャズにハマってる)。into=中に入る=のめり込む。whatdya=what do youの超圧縮形。英語のカジュアルは音をどれだけ省略できるかの競争。", category: 'suggestion', month: '2026-03' },
    { daySlot: 24, japanese: 'たまにはいいんじゃない？', english: [
        "why not, treat yourself",
        "once in a while won't hurt, go for it",
        "you deserve a break, treat yourself every now and then",
        "why not? life's short. that's what I tell myself every time I'm about to do somethin' I probably shouldn't. 'life's short' is the permission slip for every bad decision. wanna buy that thing? life's short. eat the cake? life's short. skip the gym? life's short. it's the most dangerous phrase in the English language 'cause it justifies literally everything."
    ], context: "treat yourselfは「自分にご褒美を」。treat=「おごる・ご馳走する」。自分を自分でおもてなし。once in a whileは「たまには」。won't hurtは「害はない」=「大丈夫だよ」。permission slipは「許可書」。学校で遠足に行くときの親のサイン。life's shortを「許可書」に例える。英語は「自分に許可を出す」概念がある。日本語の「まあいっか」より能動的。", category: 'suggestion', month: '2026-03' },
    { daySlot: 24, japanese: 'ちょっと気分転換しない？', english: [
        "wanna take a breather?",
        "let's get out for a bit, I need a change of scenery",
        "I think we both need a break, let's go somewhere and clear our heads",
        "I need a change of scenery. these walls are startin' to talk to me. and not in a fun way. in a 'you've been starin' at the same room for nine hours' way. let's go somewhere. anywhere. I don't care where. a park. a cafe. a parking lot. literally anywhere that isn't here. my brain needs new visual input or it's gonna start recyclin' old thoughts. and old thoughts are never good."
    ], context: "change of sceneryは「気分転換」。scenery=「景色」。景色を変える=気分が変わる。英語では気分転換=場所を変えること。clear our headsは「頭をスッキリさせる」。clear=「晴れる・きれいにする」。頭の中の霧を晴らすイメージ。breatherは「一息」。take a breatherは「一息つく」。breathe(呼吸する)から派生。呼吸=休憩。体の動作が精神の回復になる英語的感覚。", category: 'suggestion', month: '2026-03' },
    { daySlot: 24, japanese: '一緒にやらない？', english: [
        "wanna do it together?",
        "let's do it together, it'll be way more fun",
        "it's gonna be way better with two people, come do it with me",
        "let's do it together. 'cause alone it's a task. together it's an activity. that's the magic of company. fold laundry alone? torture. fold laundry while talkin' to someone? practically a party. the thing itself doesn't change. the experience does. humans are weird like that. we'll do anything if there's someone next to us doin' it too. that's either teamwork or codependency. either way, you in?"
    ], context: "way moreは「ずっと〜」。wayは「道」だけど強調語としても使う。way better(ずっといい)、way too much(多すぎ)。wayの強調力はveryより口語的でカジュアル。it'll be~は「〜になるよ」の誘い文句。the magic of companyは「人がいる魔法」。company=「仲間」。misery loves company(不幸は仲間を求める)という諺もある。一人より二人の哲学。", category: 'suggestion', month: '2026-03' },
    { daySlot: 24, japanese: 'ここいいらしいよ', english: [
        "heard this place is good",
        "someone told me this spot's really good, wanna check it out?",
        "I've been hearing good things about this place, we should try it",
        "so I heard about this place. a friend went. said it was legit. and I trust this friend's taste 'cause they've never steered me wrong. well, once. but we don't talk about that. point is -- this place apparently slaps. and I've been wantin' to try it but I don't wanna go alone 'cause what if it's awkward? safety in numbers. you're my safety number."
    ], context: "spotは「場所」のカジュアル版。placeよりcool。a good spot(いい場所)、my favorite spot(お気に入りの場所)。check it outは「見てみる・試してみる」。slapsは「めちゃくちゃいい」の最新スラング。元は音楽(this song slaps)から食べ物や場所にも拡大。steered me wrongは「間違った方向に導いた」。steer=「ハンドルを切る」。人を車のように導く比喩。", category: 'suggestion', month: '2026-03' },
    { daySlot: 24, japanese: '無理しなくていいよ', english: [
        "no pressure",
        "no pressure at all, only if you're up for it",
        "seriously, don't force yourself, I totally get it if you can't make it",
        "no pressure. genuinely. I'm not one of those people who says 'no pressure' but then makes you feel guilty if you say no. if you can't come, you can't come. life happens. I'll go alone. I'll be fine. a little sad. like a puppy at a window. but fine. totally fine. no guilt trip. zero guilt. OK maybe 0.5 guilt. but that's natural. ignore it. we're good."
    ], context: "no pressureは「プレッシャーなしで」=「無理しないで」。pressure=「圧力」。up for itは「やる気がある」。Are you up for it?(その気ある?)。guilt tripは「罪悪感を植え付ける」。trip=「旅」。相手を罪悪感の旅に連れて行く。英語ではno pressureと言いながら実はプレッシャーをかけてる場合が多い。それ自体がジョークになってる文化。", category: 'filler', month: '2026-03' },
    { daySlot: 24, japanese: 'じゃ、決まりね', english: [
        "it's a plan",
        "alright, it's settled then, let's do this",
        "OK we're locked in, no backing out now, this is happening",
        "it's a plan. a real one. with a date and a time and everything. I'm excited. and slightly nervous 'cause now we actually have to follow through. and follow-through is historically not our strong suit. but this time's different. I can feel it. this time we're actually gonna do the thing we said we'd do. revolutionary concept. groundbreaking. adults makin' plans and keepin' 'em. wow."
    ], context: "it's settledは「決定」。settle=「落ち着く・定まる」。未決定のものが着地した。locked inは「確定した」。ロックされて変更不可。no backing out(後戻りなし)。back out=「抜ける」=Day 17のドタキャンテーマと繋がる。follow throughは「最後までやる」。strong suitは「得意分野」。トランプの「強いスート(マーク)」から。not our strong suit=「苦手」。", category: 'reaction', month: '2026-03' },
    { daySlot: 24, japanese: 'また誘うね', english: [
        "I'll hit you up",
        "I'll hit you up next time, for sure",
        "I'll let you know when something comes up, we'll make it happen eventually",
        "I'll hit you up. and I know that sounds like one of those things people say and never follow up on. like 'we should hang out' or 'let's get lunch sometime.' those are social pleasantries. polite lies. but when I say I'll hit you up, I mean it. ...probably. look, my intentions are good. my execution needs work. but the intention is there. and that's gotta count for somethin'. right?"
    ], context: "hit you upは「連絡する」。hitは「打つ」だけど、人に使うと「連絡を打つ」=メッセージを送る。I'll hit you up later(あとで連絡するわ)。social pleasantriesは「社交辞令」。英語圏にも社交辞令はある。Let's do lunch(ランチしよう)は「たぶんしない」の意味で使われることが多い。日本語の「また今度ね」と全く同じ機能。言語が違っても社交辞令の構造は同じ。", category: 'suggestion', month: '2026-03' },
    // -- Day 25: 片付け・整理 (Organizing & decluttering) --
    { daySlot: 25, japanese: '捨てられないんだよな', english: [
        "can't throw it out",
        "I just can't throw it out, what if I need it?",
        "I know I should throw it out but there's this voice in my head saying 'what if?'",
        "I can't throw it out. I know it's been sittin' there for three years and I haven't touched it once but the SECOND I throw it away I'm gonna need it. that's the law of the universe. the moment trash hits the curb, you remember why you kept it. it's not hoarding. it's strategic risk management."
    ], context: "throw outは「捨てる」。日本語は「捨てる」一語だけど英語はthrow(投げる)+out(外へ)で物理的に家の外に放り投げるイメージ。get rid ofも「処分する」だけど、rid=解放だから「そのモノから自由になる」感覚。英語は「捨てる」を2種類持ってる。投げ出すか、解放されるか。どっちも重い。", category: 'reaction', month: '2026-03' },
    { daySlot: 25, japanese: 'どこに置いたっけ', english: [
        "where'd I put it",
        "where the heck did I put that thing?",
        "I swear I just had it in my hand two seconds ago",
        "where'd I put it? it was RIGHT HERE. I'm not crazy. I had it. I set it down for ONE second to do something else and now it's gone. vanished. like it grew legs and walked away. this happens every single day and every single day I'm equally baffled. you'd think I'd learn to put things in the same spot. you'd think."
    ], context: "where'd=where didの短縮。「どこに置いた」の英語はwhere did I put it。putは「置く」だけど、英語は過去形putも現在形putも同じ形。不規則動詞の中でも最も怠けてるやつ。put-put-put。変化する気ゼロ。でも会話では超頻出。put it here、put it away、put it back。putは整理整頓の司令官。", category: 'reaction', month: '2026-03' },
    { daySlot: 25, japanese: 'とりあえず箱に突っ込む', english: [
        "just shove it in a box",
        "just shove it in a box and deal with it later",
        "I don't have time to sort this so I'm just gonna shove everything in a box",
        "just shove it in a box. that's my organizing strategy. step one: get a box. step two: put everything in the box. step three: close the box. step four: pretend the box doesn't exist. is it clean? technically yes. is it organized? absolutely not. but the surface is clear and that's all that matters. out of sight, out of mind. the box is my therapist."
    ], context: "shoveは「押し込む」「突っ込む」。putより乱暴で雑なニュアンス。shove it in(突っ込め)は「丁寧に入れる」の真逆。deal with it laterは「後で何とかする」で、dealは「取引する」が原義。問題を「後日の自分と取引する」感覚。英語は問題をビジネス的に先送りする。日本語の「後でやる」より罪悪感が薄い。", category: 'suggestion', month: '2026-03' },
    { daySlot: 25, japanese: 'スッキリした', english: [
        "feels so much better",
        "ahh, that feels so much better now",
        "I finally cleaned everything up and honestly it feels like a weight off my shoulders",
        "feels so much better. like my brain got decluttered too. there's this weird connection between a clean room and a clear head and I don't understand the science behind it but it's real. five minutes ago this place was a disaster and I was stressed. now it's clean and I feel like I can take on the world. is this what functional adults feel every day?"
    ], context: "「スッキリ」は英語に直訳がない。feels betterが一番近いけど、スッキリの「爽快感+達成感+開放感」全部は入らない。weight off my shouldersは「肩の荷が下りた」で物理的な重さで表現する。英語は感情を体の感覚で言う。日本語のオノマトペ(スッキリ、サッパリ)は英語では全部フルセンテンスに展開される。圧縮率が違いすぎる。", category: 'reaction', month: '2026-03' },
    { daySlot: 25, japanese: 'いつか使うかもって思って取っとく', english: [
        "just in case",
        "I'm keepin' it just in case, you never know",
        "I keep everything 'just in case' and that's why my closet looks like a warehouse",
        "just in case. those three words have cost me so much storage space. every single item I can't throw away is protected by 'just in case.' the broken charger? just in case. the shirt that doesn't fit? just in case. a manual for a printer I don't own anymore? just in case. I'm not a hoarder. I'm a just-in-case collector. there's a difference. probably."
    ], context: "just in caseは「念のため」「万が一のために」。in case=「〜の場合に備えて」で、justを付けると「ちょっと念のためね」と軽くなる。日本語の「いつか使うかも」は未来の可能性に賭けてるけど、just in caseは「最悪の事態への保険」。ニュアンスが違う。英語はリスク管理、日本語はもったいない精神。動機が違う。", category: 'opinion', month: '2026-03' },
    { daySlot: 25, japanese: '片付けてから始めよう', english: [
        "lemme clean up first",
        "lemme clean up first, I can't think in this mess",
        "I gotta clean this up before I start anything else, it's driving me nuts",
        "lemme clean up first. I know it looks like I'm procrastinating but I genuinely cannot function in a messy space. my brain goes 'hey you should work' and my eyes go 'hey there's a pile of clothes on your chair' and then the brain goes 'OK we're cleaning now.' it's not a choice. it's a compulsion. a productive compulsion. the best kind."
    ], context: "lemme=let meの口語形。教科書には載ってないけどネイティブは毎日50回使う。clean upは「きれいにする」で、upは完了を表す。cleanだけだと「掃除する」、clean upだと「すっかりきれいにする」。このupが「最後まで仕上げる」感を出す。finish up、wrap up、tidy up。upは英語の「完了スタンプ」。", category: 'request', month: '2026-03' },
    { daySlot: 25, japanese: 'どれを残すか迷う', english: [
        "can't decide what to keep",
        "I can't decide what to keep and what to toss",
        "every time I try to declutter I end up keeping everything because I can't decide",
        "can't decide what to keep. I pick something up, look at it, think about it, put it in the 'keep' pile. then I pick up the next thing. same process. keep pile. by the end, the keep pile IS the original pile. I've accomplished nothing. I just moved everything from one side of the room to the other and called it progress."
    ], context: "declutterは「散らかりを除去する」。de-(除去)+clutter(散らかり)で英語らしい造語。日本語の「断捨離」に近いけど、declutterのほうが物理的。断捨離は哲学、declutterは作業。英語はkeep or toss(残すか捨てるか)の二択で考える。toss=軽く投げる。throwより気軽。英語の「捨てる」は軽い順にtoss→throw out→get rid of→dump。", category: 'reaction', month: '2026-03' },
    { daySlot: 25, japanese: '見ないふりしてた', english: [
        "been ignoring it",
        "I've been pretending that pile doesn't exist",
        "I've been walking past that mess for two weeks pretending it's invisible",
        "I've been ignoring it. not like 'I forgot about it' ignoring. like 'I see it every day, I make eye contact with it, and I consciously choose to look away' ignoring. it's an active choice. a daily negotiation between me and the mess. and the mess has been winning. for weeks. but today? today I fight back. maybe. after lunch."
    ], context: "pretendは「ふりをする」。日本語の「見ないふり」はturn a blind eyeとも言える。blind eye=盲目の目で、わざと見えないフリ。英語はignore(無視する)とpretend(ふりをする)で使い分ける。ignoreは意識的に無視、pretendは演技。日本語はどっちも「ふり」で済むけど、英語は「本当に無視してる」と「演技で無視してる」を区別する。正直な言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 25, japanese: '一個出すと芋づる式に出てくる', english: [
        "one thing leads to another",
        "I pulled out one thing and now the whole closet's on the floor",
        "I was just gonna organize one drawer but one thing led to another and now my entire room is torn apart",
        "one thing led to another. I opened ONE drawer. just one. to find a pen. and then I saw the drawer was messy so I started organizing it. and then I noticed the shelf above it. and then the closet. and now three hours later my entire room looks like a crime scene and I still don't have the pen. this is how cleaning works. you make it worse before it gets better. allegedly."
    ], context: "one thing leads to anotherは「芋づる式」に一番近い英語。直訳すると「1つのことが次のことに繋がる」。日本語は「芋づる」という具体的なイメージ。英語は抽象的にthingで済ます。面白いのは英語ではこのフレーズ、言い訳にも使えること。Why did you eat the whole cake? One thing led to another. 何の説明にもなってないけど通じる。万能言い訳。", category: 'reaction', month: '2026-03' },
    { daySlot: 25, japanese: 'もう要らないもの多すぎ', english: [
        "too much stuff",
        "I have way too much stuff I don't even use",
        "half the things in this room I haven't touched in years and I still won't get rid of them",
        "too much stuff. way too much. I look around and I'm like, when did I become a person who owns this many things? I don't even remember buying half of this. it just appeared. like stuff breeds when you're not looking. you buy one cable and suddenly you have seventeen. that's not shopping. that's multiplication. my apartment is a stuff incubator."
    ], context: "stuffは「もの」の超カジュアル版。things(もの)より更にざっくり。数えない。量で考える。too much stuff(もの多すぎ)。日本語の「もの」は数えられるけど、stuffは数えられない名詞。a lot of stuff、so much stuff。決して two stuffsとは言わない。英語は「もの」を液体みたいに扱う。流れてくる、溜まる、あふれる。面白い感覚。", category: 'opinion', month: '2026-03' },

    // -- Day 26: 夢・将来 (Dreams & future) --
    { daySlot: 26, japanese: 'いつかやりたいことリスト', english: [
        "bucket list",
        "it's on my bucket list, been there forever",
        "I've had this on my bucket list for years but I never actually do anything about it",
        "it's on my bucket list. and by 'bucket list' I mean 'a list of things I'll think about doing but never actually do.' like, skydiving's been on there since 2015. have I gone? no. have I even googled how much it costs? also no. the list exists purely so I can feel like I have ambitions. it's a decoration. a vision board for the lazy."
    ], context: "bucket listは「死ぬまでにやりたいことリスト」。kick the bucket=死ぬ、から来てる。バケツを蹴る=死ぬ。なぜ? 首吊りのときにバケツの上に立って、蹴って落ちるから。超物騒な由来なのに、今は明るく「やりたいことリスト」として使われてる。英語はダークな語源をポップに再利用するのが得意。", category: 'opinion', month: '2026-03' },
    { daySlot: 26, japanese: '将来のことなんてわかんないよ', english: [
        "who knows what'll happen",
        "who knows, I can't predict the future",
        "honestly, who knows what's gonna happen? I stopped trying to plan that far ahead",
        "who knows what'll happen. seriously. I had a five-year plan once. wanna know what happened? nothing on the plan. literally zero percent accuracy. life went completely off-script. and you know what? the stuff that DID happen was better than what I planned. so now my plan is to not have a plan. it's working great. I think. I can't tell 'cause I have no plan to compare it to."
    ], context: "who knowsは「誰にもわからない」。直訳だと「誰が知ってる?」って質問だけど、答えを期待してない修辞疑問。英語はこのパターンが多い。who cares?(誰が気にする?=どうでもいい)、what's the point?(何の意味がある?=意味ない)。質問の形をした諦め。日本語の「知るかよ」に近いけど、もう少し哲学的。", category: 'opinion', month: '2026-03' },
    { daySlot: 26, japanese: '夢見すぎかな', english: [
        "maybe I'm dreaming too big",
        "am I dreaming too big? probably, but whatever",
        "people keep telling me to be realistic but I feel like dreaming big is the whole point",
        "maybe I'm dreaming too big. but like, what's the alternative? dream small? dream medium? nobody ever says 'I have a medium-sized dream.' that's not inspiring. that's a TED talk nobody would watch. dream big, fail big, learn big. that's my philosophy. also I stole that from somewhere. can't remember where. but it's mine now."
    ], context: "dream bigは「大きな夢を見る」。英語ではdreamは動詞でも名詞でも使える。dream big(大きく夢見ろ)、live your dream(夢を生きろ)、dream come true(夢が現実に)。日本語は「夢を見る」「夢を叶える」と助詞が変わるけど、英語はdreamを直接動かす。dream it, do it. シンプル。動詞と名詞の壁が薄い言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 26, japanese: 'まだ間に合うかな', english: [
        "is it too late",
        "you think it's too late for me to start?",
        "I keep wondering if it's too late to change direction at this point",
        "is it too late? that question haunts me at like 2 AM. I'll be lying there staring at the ceiling going 'should I have started five years ago? yes. can I start now? also yes. will I start now? unclear.' the window's not closed. but it's definitely not as wide open as it used to be. which is fine. I can squeeze through. probably. if I lose a few pounds."
    ], context: "too lateは「遅すぎる」だけど、英語にはit's never too late(遅すぎることは決してない)という名言がある。tooは「過度に」で、ネガティブ。too hot(暑すぎ)、too cold(寒すぎ)。でもnever too lateだけはポジティブ。唯一の例外。日本語の「まだ間に合う」は希望を語ってるけど、英語のis it too lateは恐怖を語ってる。同じ状況なのに入口が逆。", category: 'reaction', month: '2026-03' },
    { daySlot: 26, japanese: '現実見ろよ', english: [
        "be realistic",
        "c'mon, be realistic about this",
        "look, I get the dream, but at some point you gotta face reality",
        "be realistic. and I hate sayin' that 'cause I sound like every boring adult who ever crushed a kid's dream. but there's a difference between 'be realistic' and 'give up.' I'm not sayin' give up. I'm sayin' make a plan. dreams without plans are just wishes. and wishes are what you throw pennies at. I want results, not pennies."
    ], context: "realisticは「現実的な」。日本語の「現実見ろ」はキツいけど、英語のbe realisticも同じくらいキツい。face realityは更に強い。faceは「顔を向ける」で、reality(現実)に顔を向けろ=直視しろ。英語は現実を「見る」んじゃなくて「顔を向ける」。逃げてた顔をグッと回される感覚。物理的に痛い。", category: 'shutdown', month: '2026-03' },
    { daySlot: 26, japanese: 'なりたい自分ってあるじゃん', english: [
        "the person I wanna be",
        "there's this version of me I wanna become, y'know?",
        "I have this picture in my head of who I wanna be, and I'm not there yet but I'm working on it",
        "there's this version of me that I wanna be. future me. he's got his life together. he wakes up early. he exercises. he doesn't eat ramen at midnight. and current me looks at future me and goes 'nice, how do I get there?' and future me goes 'stop eating ramen at midnight.' and current me goes '...any other options?' there are not."
    ], context: "version of meは「自分のバージョン」。英語は自分を複数のバージョンで語る。the best version of myself(最高の自分)、a better version(もっといい自分)。ソフトウェアのアップデートみたいに自分を語る。日本語は「なりたい自分」で1つだけど、英語はバージョン管理してる。me 1.0、me 2.0みたいな感覚。自分をプロダクトとして扱う文化。", category: 'opinion', month: '2026-03' },
    { daySlot: 26, japanese: '何がしたいかわかんなくなった', english: [
        "lost",
        "I'm kinda lost right now, honestly",
        "I used to know exactly what I wanted but now I have no clue",
        "I'm lost. not like geographically. existentially. I used to have this clear picture of what I wanted and now it's all fuzzy. like someone took my life plan and put it through a washing machine. the colors are still there but you can't read it anymore. and everyone's like 'just follow your passion' and I'm like 'cool, which one? I have twelve. and none of them pay rent.'"
    ], context: "lostは「迷った」。道に迷うのもlost、人生に迷うのもlost。英語は物理的な迷子と精神的な迷子を同じ単語で表現する。I'm lost in this conversation(話についていけない)も同じlost。日本語は「迷う」「わからなくなった」「見失った」と状況で使い分けるけど、英語はlost一語で全部カバー。迷いの万能薬。", category: 'reaction', month: '2026-03' },
    { daySlot: 26, japanese: '小さいことからやってみよう', english: [
        "start small",
        "just start small, don't overthink it",
        "you don't have to change everything at once, just start with something small",
        "start small. everyone says 'think big' but nobody talks about starting small. you wanna run a marathon? cool. start by walking to the mailbox. you wanna write a book? cool. start with a sentence. the gap between 'nothing' and 'something small' is the hardest part. after that it's just momentum. physics. Newton figured this out centuries ago. I'm just catching up."
    ], context: "start smallの反対はthink big。英語はsmall/bigを人生のアドバイスに使いまくる。start small(小さく始めろ)、go big or go home(やるならデカくやれ)、don't sweat the small stuff(小さいことを気にするな)。大きさで人生を語る。日本語は「千里の道も一歩から」で距離で語る。英語はサイズ、日本語は距離。メタファーの軸が違う。", category: 'suggestion', month: '2026-03' },
    { daySlot: 26, japanese: '考えすぎて動けない', english: [
        "stuck in my head",
        "I'm stuck in my own head and I can't get out",
        "I've been overthinking this so much that I'm completely paralyzed",
        "I'm stuck in my head. it's like my brain built a maze and then trapped itself inside. I think about doing the thing, then I think about what could go wrong, then I think about what people will say, then I think about whether I'm thinking too much, and by that point the day's over. analysis paralysis. my brain is both the analyst and the paralyzed patient. not ideal."
    ], context: "overthinkは「考えすぎる」。over-は「過剰に」のプレフィックス。oversleep(寝すぎ)、overeat(食べすぎ)、overreact(反応しすぎ)。日本語は「〜すぎる」を後ろに付けるけど、英語はover-を前に付ける。位置が逆。analysis paralysisは「分析麻痺」で韻を踏んでる。英語はダジャレで深刻な問題を語る。笑えるけど痛い。", category: 'reaction', month: '2026-03' },
    { daySlot: 26, japanese: '5年後の自分に聞いてみたい', english: [
        "wish I could ask future me",
        "I wish I could ask future me if this is worth it",
        "if I could talk to myself five years from now, I'd ask 'did it work out?'",
        "I wish I could ask future me. just one question. 'does it work out?' that's all I need. a yes or no. I don't need details. I don't need spoilers. just a thumbs up or thumbs down. 'cause right now I'm makin' decisions based on guesswork and vibes and honestly the vibes are unreliable. they told me to buy crypto in 2021. the vibes owe me money."
    ], context: "I wish I couldは「〜できたらいいのに」で仮定法。現実には不可能なことへの願望。wishの後ろは必ず過去形(could, were, had)。なぜ過去形? 英語は「現実から離れる」ときに過去形を使う。距離のメタファー。今から遠い=過去形。日本語の「〜たい」は直接的な欲望だけど、英語のI wishは「無理だとわかってて言う」切なさが入ってる。", category: 'opinion', month: '2026-03' },

    // -- Day 27: 文句・クレーム (Complaints & customer service) --
    { daySlot: 27, japanese: '聞いてないんだけど', english: [
        "nobody told me",
        "uh, nobody told me about this?",
        "wait, since when? nobody told me anything about this",
        "nobody told me. and I checked my email. I checked my messages. I checked the group chat that I muted three months ago and even THAT didn't have it. so either everyone forgot to tell me or this is some kind of social experiment where you see how long it takes me to notice. either way I'm annoyed. and I want answers. preferably with an apology attached."
    ], context: "nobody told meは「誰も教えてくれなかった」。日本語は「聞いてない」で受動的。英語はnobody told meで「誰かがやるべきことをやらなかった」と責任を外に向ける。同じ状況なのに日本語は「私が聞いてない」(自分の状態)、英語は「誰も教えなかった」(他人の不作為)。クレームの入口が逆。英語はクレームが上手い言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 27, japanese: 'いつまで待たせるの', english: [
        "how much longer",
        "how much longer do I gotta wait for this?",
        "I've been waiting forever, how much longer is this gonna take?",
        "how much longer? I've been here for forty minutes. FORTY. I could've watched an entire episode of something. I could've taken a nap. I could've reconsidered my life choices that led me to this waiting room. but no. I'm here. waiting. and the person at the counter keeps saying 'just a moment' and it's been seventeen moments. I've been counting."
    ], context: "how much longerは「あとどれくらい」で、直訳は「どれだけ長く」。英語は待ち時間を「長さ」で測る。日本語は「いつまで」で「終点」を聞く。英語=長さ、日本語=終点。同じ質問なのに測り方が違う。しかもhow much longerには怒りが含まれてる。純粋に聞きたいならhow long will it take?(どれくらいかかる?)。much longerは「もう十分待った」の圧。", category: 'request', month: '2026-03' },
    { daySlot: 27, japanese: 'それ、話が違うよね', english: [
        "that's not what I was told",
        "hold on, that's not what I was told at all",
        "that's completely different from what they told me, this is ridiculous",
        "that's not what I was told. and I don't mean 'kinda different.' I mean the complete opposite. they said A. you're saying Z. we skipped the entire alphabet. and now I'm standing here looking like an idiot 'cause I made plans based on information that apparently came from a parallel universe. someone lied. or someone's confused. and it ain't me."
    ], context: "that's not what I was toldは「そんなこと聞いてない」の英語版。was told=受動態で「言われた」。英語のクレームは受動態が多い。I was told(言われた)、I was promised(約束された)、I was charged(請求された)。なぜ? 主語を消すため。「誰が」言ったかは問題じゃない。「言われた内容が違う」が重要。受動態=責任者不明のクレーム。効率的。", category: 'shutdown', month: '2026-03' },
    { daySlot: 27, japanese: '対応が雑すぎる', english: [
        "terrible service",
        "the service here is honestly terrible",
        "I can't believe how poorly they handled this, it's completely unacceptable",
        "terrible service. and I'm not a Karen. I don't complain about everything. but this? this deserves a complaint. they didn't listen, they didn't care, and they definitely didn't solve anything. I left more confused than when I walked in. which is impressive in the worst way. like, it takes talent to make a situation WORSE when your job is to make it better."
    ], context: "serviceは「サービス」だけど、日本語の「サービス」とは全然違う。日本語のサービス=おまけ、無料。英語のservice=接客、対応。customer service(顧客対応)は英語の最重要概念の一つ。terrible service=対応が最悪、は英語圏で最も強いクレーム。日本語は「対応が悪い」で済むけど、英語はserviceという一語に怒りを全部込める。", category: 'opinion', month: '2026-03' },
    { daySlot: 27, japanese: '責任者出して', english: [
        "get me your manager",
        "can I speak to whoever's in charge here?",
        "this isn't getting anywhere, I need to talk to someone who can actually do something",
        "get me your manager. and yes, I know how that sounds. I know I sound like THAT person. but I've explained this three times to three different people and nobody's doing anything. I'm not asking for a miracle. I'm asking for basic competence. is the manager gonna fix it? probably not. but at least they'll pretend to care with more authority."
    ], context: "managerは「マネージャー」だけど、英語のcan I speak to your managerは文化的ミーム。「マネージャーを出せ」はクレーマーの定番セリフで、ネットでは「Karen」(クレーマーおばさん)の代名詞。日本語の「責任者出して」は正当な要求だけど、英語では言った瞬間にKaren認定されるリスクがある。同じ行為なのに文化的な重みが全然違う。", category: 'request', month: '2026-03' },
    { daySlot: 27, japanese: 'もういいです（怒りの）', english: [
        "forget it",
        "you know what? just forget it",
        "I'm done trying to explain this, just forget it, I'll figure it out myself",
        "forget it. just forget it. I'm not even mad anymore. I'm past mad. I went through mad, came out the other side, and now I'm in this weird calm place where I've accepted that this is never getting resolved. it's like the five stages of grief but for customer service. denial, anger, bargaining, depression, 'forget it.' that's the final stage. peaceful surrender."
    ], context: "forget itは「もういい」の怒りバージョン。普通のforget itは「気にしないで」だけど、怒ってるときのforget itは「もう話にならない」。同じフレーズなのにトーンで180度意味が変わる。日本語も「もういいです」が丁寧な諦めか怒りの爆発かはトーン次第。両言語で同じ構造。言葉じゃなくて「怒りの温度」が意味を決める。", category: 'shutdown', month: '2026-03' },
    { daySlot: 27, japanese: '前もそうだったよね', english: [
        "not the first time",
        "this isn't the first time this has happened either",
        "this keeps happening and every time they act like it's the first time I'm bringing it up",
        "not the first time. not even the second. this is like the fourth time and I've been patient every single time 'cause I'm a reasonable person. but reasonable has a limit. and that limit is four. five on a good day. today is not a good day. so we're at four. which means the next time this happens I become unreasonable. and nobody wants that. least of all me."
    ], context: "not the first timeは「初めてじゃない」=「何回目だよ」。英語は回数を「最初かどうか」で判断する。not the first time(初めてじゃない)、not the last time(最後じゃない)。日本語は「また?」「何回目?」で回数を直接聞くけど、英語は「初回ではない」という事実で怒りを表現する。遠回しだけど重い。事実ベースのクレーム。", category: 'reaction', month: '2026-03' },
    { daySlot: 27, japanese: '言い訳しないでよ', english: [
        "don't make excuses",
        "don't give me excuses, just fix it",
        "I don't wanna hear excuses, I wanna hear what you're gonna do about it",
        "don't make excuses. I didn't come here for a story. I came here for a solution. and every time I ask for a solution I get a reason why there isn't one. that's not a solution. that's a rejection letter with extra steps. 'we can't because...' 'unfortunately...' 'the system doesn't...' I don't care about the system. the system works for me or I find a new system."
    ], context: "make excusesは「言い訳をする」。makeを使うのがポイント。言い訳は「作る」もの。fabricate(でっち上げる)にも近い。英語は言い訳を「製造行為」として扱う。日本語は「言い訳する」で「する」だけど、英語は「作る」。ニュアンスが違う。作ってる=嘘くさい。英語で言い訳=捏造に近い。だからdon't make excusesは「嘘を作るな」くらい強い。", category: 'shutdown', month: '2026-03' },
    { daySlot: 27, japanese: '金返して', english: [
        "give me my money back",
        "I want a refund, like, now",
        "this is not what I paid for and I want my money back, period",
        "give me my money back. I don't want store credit. I don't want a replacement. I don't want a coupon for next time 'cause there IS no next time. I want the money. the actual money. back in my account. where it was. before I made the mistake of spending it here. this is the financial equivalent of 'I want my two hours back' after a bad movie. except I can actually get this one back."
    ], context: "refundは「返金」。英語ではI want a refund(返金を要求する)が公式のクレーム用語。give me my money backはもっと直接的でカジュアル。日本語の「金返せ」に近い。英語はお金の話を直接するのに抵抗が薄い。日本語では「金返せ」は相当キツいけど、英語のI want a refundはビジネスの当然の権利。お金の話=タブーという感覚が英語にはない。合理的。", category: 'request', month: '2026-03' },
    { daySlot: 27, japanese: 'ちゃんとしてくれ', english: [
        "get it together",
        "seriously, get it together, this is basic stuff",
        "I shouldn't have to ask for this, just get it together already",
        "get it together. and I mean that in the nicest possible way. which is still not that nice. but come on. this is basic. this is day one stuff. this is 'you had ONE job' territory. and the one job was not hard. it was like... entry level one job. and it still didn't get done. I'm not asking for excellence. I'm asking for the bare minimum. the floor. not even the ceiling."
    ], context: "get it togetherは「しっかりしろ」。直訳は「それを一緒に集めろ」。バラバラになってるものをまとめろ=ちゃんとしろ。get your act together(ちゃんとしろ)はもっと強い。actは「演技」で、お前の演技がバラバラだぞ=お前の仕事がグダグダだぞ。英語は人生をact(演技)に例える。all the world's a stageのシェイクスピアから変わってない。", category: 'request', month: '2026-03' },

    // -- Day 28: 別れ・終わり (Goodbyes & endings) --
    { daySlot: 28, japanese: 'またね、じゃなくてさよなら', english: [
        "this is goodbye",
        "this isn't a 'see you later,' this is goodbye",
        "I don't think we're gonna see each other again, so... this is actually goodbye",
        "this is goodbye. the real one. not the 'see ya!' where you actually see them next week. not the 'let's hang out soon!' where soon means never. this is the one where you both know it's the last time and neither of you wants to say it out loud. so you just stand there a little longer than normal. and the hug lasts a little longer. and then you walk away. and you don't look back. 'cause if you look back you'll cry."
    ], context: "goodbyeとsee you laterの違いは重い。see you later(またね)は再会前提。goodbye(さよなら)は永別の可能性がある。だから英語ネイティブはgoodbyeを避けてsee ya、take care、catch you laterを使う。goodbyeの語源はGod be with ye(神があなたと共にあれ)。別れに神を持ち出すくらい重い言葉。日本語の「じゃあね」の100倍重い。", category: 'reaction', month: '2026-03' },
    { daySlot: 28, japanese: 'もう終わりにしよう', english: [
        "let's just end it",
        "I think we should just end this here",
        "this isn't going anywhere and I think we both know it's time to call it",
        "let's end it. and I don't say that lightly. I've been thinking about it for a while. turning it over in my head. trying to find a way to make it work. but some things just don't work no matter how much you want them to. and forcing it makes it worse. so yeah. let's call it. not 'cause I don't care. because I do. and caring means knowing when to stop."
    ], context: "call itは「そこで終わりにする」。元はスポーツの審判が試合を終わらせるcall。the ref called the game(審判が試合を止めた)。そこから「何かを終了宣言する」意味に。let's call it a day(今日はここまで)、let's call it quits(やめにしよう)。英語は「終わり」を宣言する。日本語は「終わりにしよう」と提案する。英語のほうが権力的。審判だから。", category: 'suggestion', month: '2026-03' },
    { daySlot: 28, japanese: '最後にひとつだけ', english: [
        "one last thing",
        "one last thing before I go",
        "before we say goodbye, there's one last thing I wanna say",
        "one last thing. and I know 'one last thing' is never actually one thing. it's usually three things pretending to be one. but this time it really is one thing. I promise. OK here it is: thank you. that's it. just thank you. for everything. even the bad parts. especially the bad parts. 'cause those taught me more than the good ones. ...OK that was technically three things. I lied. sorry."
    ], context: "one last thingは「最後にひとつだけ」。ドラマや映画の定番セリフ。刑事コロンボのjust one more thingも同じ構造。英語はone more(もう一つ)とone last(最後の一つ)を使い分ける。moreは追加、lastは最終。日本語はどっちも「もう一つ」で済むけど、英語はこれが最後かどうかを宣言する。終わりの予告が義務。", category: 'filler', month: '2026-03' },
    { daySlot: 28, japanese: 'お世話になりました', english: [
        "thanks for everything",
        "seriously, thanks for everything, I mean it",
        "I know I don't say it enough but I really appreciate everything you've done",
        "thanks for everything. and that 'everything' isn't just a word. it's every late night, every early morning, every time you put up with my nonsense. every time you pretended my jokes were funny. every time you had my back when I didn't even know I needed backup. that's a lot of everything. and one 'thanks' doesn't cover it. but it's all I got. so... thanks. for real."
    ], context: "「お世話になりました」は英語に直訳できない。thanks for everythingが一番近いけど、日本語の「お世話になりました」には上下関係と感謝の深さが入ってる。英語のthanks for everythingはフラット。上司にも友達にも使える。日本語は場面で言葉が変わる(お世話になりました/ありがとうございました)けど、英語はthanksで全部済む。省エネだけど、深みが足りない。", category: 'reaction', month: '2026-03' },
    { daySlot: 28, japanese: '寂しくなるな', english: [
        "gonna miss this",
        "I'm really gonna miss this, not gonna lie",
        "it's weird knowing this is the last time, I'm already getting nostalgic",
        "gonna miss this. already miss it, actually. and it hasn't even ended yet. is that possible? missing something that's still happening? 'cause that's where I am. I'm sitting here looking around trying to memorize everything 'cause I know future me is gonna want to remember. the sounds. the feeling. the way everything just felt... right. ugh. why do good things end. rhetorical question. don't answer that."
    ], context: "missは「寂しく思う」「恋しい」。日本語の「寂しい」は感情だけど、英語のmissは「欠けてる」が原義。I miss you=あなたが欠けてる。you're missing=あなたがいない。同じmissが「失う」「外す」「逃す」にもなる。miss the train(電車を逃す)、miss the point(要点を外す)。全部「あるべきものがない」。英語のmissは喪失の万能語。", category: 'reaction', month: '2026-03' },
    { daySlot: 28, japanese: '区切りをつけないと', english: [
        "gotta move on",
        "I gotta move on, can't keep holding onto this",
        "at some point you gotta close the chapter and move on, even if you're not ready",
        "gotta move on. and moving on doesn't mean forgetting. it means carrying it differently. like, you don't drop the weight. you just shift it from your arms to your back. it's still there. you still feel it. but your hands are free now. free to grab something new. that's what moving on is. not letting go. just rearranging. the emotional equivalent of reorganizing your closet. stuff's still there. just in a better place."
    ], context: "move onは「前に進む」「気持ちを切り替える」。直訳は「移動し続ける」。英語は人生を旅に例える。move on(前に進む)、move forward(前進する)、leave it behind(置いていく)。日本語の「区切りをつける」は「線を引く」イメージ。英語は「歩き続ける」イメージ。日本語は空間を区切る、英語は空間を移動する。別れの処理方法が違う。", category: 'opinion', month: '2026-03' },
    { daySlot: 28, japanese: '楽しかったよ', english: [
        "had a blast",
        "I had a blast, seriously, no regrets",
        "whatever happens next, I'm glad this happened and I had the time of my life",
        "I had a blast. and I don't use that word lightly. a blast. an explosion of fun. that's how English describes peak enjoyment -- as an explosion. had a blast, had a ball, had the time of my life. it's always violent or dramatic. English doesn't do 'quiet happiness' well. if you had fun, it has to be an EVENT. a DETONATION of joy. subtlety is not the language's strong suit."
    ], context: "have a blastは「めちゃくちゃ楽しかった」。blast=爆発。楽しさを爆発で表現するのが英語。have a ball(ボールを持つ=楽しむ)、have the time of your life(人生最高の時間)。全部「普通じゃない楽しさ」。日本語の「楽しかった」はシンプルだけど、英語は楽しさを大袈裟に表現しないと「そこまでじゃなかった」と思われる。感情のインフレ言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 28, japanese: '次に会うときは違う自分かも', english: [
        "I'll be different",
        "next time you see me, I'll be a different person",
        "by the time we meet again, I'll probably be a completely different version of myself",
        "next time you see me, I'll be different. better, hopefully. or at least different in an interesting way. 'cause people change. that's just what happens. the me you know right now is a limited edition. a seasonal flavor. next year's model is gonna have new features and fewer bugs. probably. some bugs might carry over. but the UI's getting an upgrade for sure."
    ], context: "by the timeは「〜するまでに」で、英語の時間表現で一番厄介なやつの一つ。by the time we meet(次に会うまでに)は未来の話なのにmeet(現在形)を使う。なぜ? 英語は時の副詞節(when, by the time, before)の中では未来形を使わないルール。日本語にはないルール。「次に会うときは」→by the time we meet。willを入れたくなるけど入れない。英語の罠。", category: 'opinion', month: '2026-03' },
    { daySlot: 28, japanese: 'ここまでよくやったよ', english: [
        "we did good",
        "we did good, I'm proud of what we built",
        "looking back, we really did put in the work and it paid off",
        "we did good. and I know 'good' sounds basic but sometimes basic is enough. we didn't change the world. we didn't break any records. but we showed up. every day. even when it sucked. even when we wanted to quit. and that consistency? that's the real achievement. not the result. the showing up. anyone can start. finishing is the hard part. and we finished. so yeah. we did good."
    ], context: "we did goodは文法的にはwe did wellが正しい。good=形容詞、well=副詞。でも口語ではwe did goodが圧倒的に多い。Superman's motto: truth, justice, and doing good. 英語は「正しい文法」と「実際の使い方」が乖離してる。教科書は 'well'、現実は 'good'。この二重基準が英語学習者を苦しめる。ネイティブは文法を知った上で無視する。確信犯。", category: 'reaction', month: '2026-03' },
    { daySlot: 28, japanese: '終わりがあるから意味がある', english: [
        "that's what makes it matter",
        "it ending is what makes it matter",
        "nothing lasts forever and honestly that's what gives it meaning",
        "it ending is what makes it matter. I know that sounds like a fortune cookie but hear me out. if this lasted forever, we'd stop appreciating it. that's how humans work. we're terrible at valuing what we have. we only realize how good it was when it's gone. which is a design flaw, honestly. if I were designing humans I'd add a 'gratitude update.' but I wasn't consulted."
    ], context: "英語にはnothing lasts forever(永遠に続くものはない)という定番フレーズがある。nothingが主語で「何もない」が永遠に続く。日本語は「永遠はない」とシンプルだけど、英語は「何も永遠に続かない」と主語をnothing(無)にする。無が主語になれる英語。面白い。日本語は「ない」で終わるけど、英語は「ない」から始まる。", category: 'opinion', month: '2026-03' },

    // -- Day 29: 気づき・発見 (Realizations & discoveries) --
    { daySlot: 29, japanese: 'そういうことか！', english: [
        "ohhhh, that's what it is",
        "OHHH that makes so much sense now",
        "wait wait wait -- oh my god, THAT'S what they meant this whole time?",
        "OHHH. that's what it is. the puzzle piece just clicked. I've been staring at this for DAYS and it was right there the whole time. it's like those magic eye pictures from the 90s -- you stare and stare and see nothing and then suddenly the dolphin appears and you can never unsee it. that just happened. in my brain. the dolphin appeared. everything makes sense now."
    ], context: "that makes senseは「なるほど、筋が通る」。make sense=意味を作る。英語は「理解する」を「意味が作られる」と表現する。it doesn't make sense(意味が通らない)、it makes perfect sense(完全に筋が通る)。主語はit。理解するのは自分なのに、英語では「それが意味を作る」と対象に責任を持たせる。わからないのは俺のせいじゃない、お前が意味を作れてないんだ。責任転嫁の構文。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: '今まで気づかなかった', english: [
        "never noticed that",
        "how did I never notice that before?",
        "I can't believe I've been looking at this the whole time and never once noticed",
        "how did I never notice that? it's been right in front of me. literally right in front of my face. every single day. and my brain just... filtered it out. like it was wallpaper. background noise. and now that I see it, I see it EVERYWHERE. it's like buying a new car and suddenly every other car on the road is the same model. my brain had a blind spot and now it's gone and I'm overwhelmed."
    ], context: "never noticedの面白さは、noticeとseeの違い。seeは「目に入る」(受動的)、noticeは「気づく」(能動的)。I saw it but didn't notice it(見えてたけど気づかなかった)が成立する。日本語も「見る」と「気づく」は違うけど、英語はsee/look/watch/notice/spot/catch全部違う。見る行為を6段階に分ける。視覚に異常にこだわる言語。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: '答え合わせできた', english: [
        "that confirms it",
        "yep, that confirms exactly what I thought",
        "I had a feeling I was right and now I finally have proof",
        "that confirms it. and I'm not gonna say 'I told you so' but... I told you so. I had this theory for weeks and everyone looked at me like I was crazy. and now? confirmed. validated. proven. I want a trophy. or at least an apology. I'll accept a nod. a reluctant nod. just acknowledge that I was right and they were wrong. that's all I need. that and the trophy."
    ], context: "confirmは「確認する」「裏付ける」。日本語の「答え合わせ」は英語にぴったりの訳がない。confirm(確認)、verify(検証)、validate(承認)は全部微妙に違う。confirmは「そうだと思ってたことが正しかった」。verifyは「事実を突き合わせる」。validateは「公式に認める」。日本語は「合ってた」一語で済むけど、英語は確信の段階が3つある。面倒。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: 'やっぱそうだよな', english: [
        "I knew it",
        "I KNEW it, I freakin' knew it",
        "I had a gut feeling and it turns out I was right all along",
        "I knew it. I KNEW it. my gut told me. and people say 'trust your gut' but then when you do they say 'do you have evidence?' no I don't have evidence. I have a GUT. guts don't come with receipts. they just know. and mine was right. again. my gut has a better track record than my brain at this point. maybe I should let my stomach make all my decisions."
    ], context: "gut feelingは「直感」。gut=腸。英語は直感を「腹」で感じる。trust your gut(腹を信じろ)、gut reaction(腹からの反応)、gut instinct(腹の本能)。日本語も「腹」を使う(腹が立つ、腹黒い)けど、直感は「勘」であって腹じゃない。英語は「脳じゃなくて腹が考える」感覚が強い。科学的にも腸にニューロンがあるらしい。英語が先に気づいてた。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: '見方が変わった', english: [
        "see it differently now",
        "I totally see it differently now",
        "after hearing that, I can't look at it the same way anymore",
        "I see it differently now. like, completely differently. same thing, new eyes. it's like watching a movie for the second time and catching all the foreshadowing you missed. the information didn't change. I changed. and that's kinda wild 'cause it means everything I'm looking at right now might look totally different next year. reality isn't fixed. perception is a moving target. that's either exciting or terrifying."
    ], context: "see it differentlyの面白さは、see=「見る」が「理解する」も意味すること。I see(わかった)、I see your point(あなたの言いたいことがわかる)、the way I see it(俺の見方では)。英語は「見る=わかる」。日本語も「なるほど、見えてきた」と言うけど、英語のほうがsee=understandの結びつきが強い。盲目=無知(blind to the truth)。英語は理解を完全に視覚に依存してる。", category: 'opinion', month: '2026-03' },
    { daySlot: 29, japanese: 'ずっと勘違いしてた', english: [
        "had it all wrong",
        "turns out I had it completely wrong this whole time",
        "I've been operating under a totally wrong assumption and I just now realized",
        "I had it all wrong. ALL wrong. not like 'a little off.' like, the exact opposite of correct. which is impressive in its own way. being slightly wrong is easy. being 180 degrees wrong takes commitment. I was so confidently wrong that people believed me. I was spreading misinformation with enthusiasm. somebody should've stopped me. but they were probably wrong about something else too. we're all just confidently wrong about different things."
    ], context: "had it wrongは「間違って理解してた」。have it right(合ってる)/ have it wrong(間違ってる)。面白いのはhave(持ってる)を使うこと。理解を「所有物」として扱ってる。you've got the wrong idea(間違った考えを持ってる)。日本語は「勘違いしてた」で動詞だけど、英語は「間違ったものを所有してた」。理解=持ち物。なくすこともできるし、渡すこともできる。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: '灯台下暗しだった', english: [
        "right under my nose",
        "it was right under my nose this whole time",
        "I spent forever looking for it and it was right here the entire time",
        "right under my nose. UNDER MY NOSE. I could've literally smelled it. that's how close it was. and I'm out here searching in drawers, checking online, asking people -- and the whole time it was just sitting there. waiting. patiently. like a cat that knows you'll come back eventually. and now I feel stupid. but also relieved. but mostly stupid. a solid 70-30 stupid-to-relieved ratio."
    ], context: "right under my noseは「鼻の真下に」=灯台下暗し。英語は「鼻」を使う。日本語は「灯台」を使う。どっちも「近すぎて見えない」だけど、英語は体(鼻)、日本語は物(灯台)がメタファーの素材。英語は体を使った比喩が異常に多い。keep an eye on(目を置いておく=見張る)、lend me a hand(手を貸す)、face the music(音楽に顔を向ける=結果を受け入れる)。英語は体で考える。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: 'なんでもっと早く気づかなかったんだろ', english: [
        "why didn't I see this sooner",
        "why didn't I see this sooner, it's so obvious now",
        "looking back it's painfully obvious and I can't believe it took me this long",
        "why didn't I see this sooner? it's SO obvious now. like, embarrassingly obvious. the kind of obvious where if I told someone how long it took me to figure out, they'd lose respect for me. so I'm not telling anyone. I'm just gonna act like I always knew. 'oh yeah, I've known that for a while.' no I haven't. I figured it out ten minutes ago. but nobody needs to know that."
    ], context: "in hindsightは「後から振り返ると」。hindsight=後知恵。hind(後ろ)+sight(視力)。英語にはhindsight is 20/20(後知恵は視力2.0)という諺がある。20/20は完璧な視力の意味。後からなら全部クリアに見える。日本語の「後の祭り」は「もう遅い」だけど、英語のhindsightは「後からなら誰でも天才」。皮肉度が高い。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: 'つながった', english: [
        "it all connects",
        "oh wow, it all connects, everything makes sense",
        "all these random pieces just clicked together and now I see the whole picture",
        "it all connects. every random thing I've been learning, every weird experience, every detour -- it all connects. like a conspiracy board with the red string. except it's not a conspiracy. it's my life. making sense. retroactively. which means all the stuff happening now that makes no sense? it'll probably connect to something later. hopefully. or it's just chaos. but I'm choosing to believe in the string theory. the red string theory."
    ], context: "connect the dotsは「点と点を繋げる」。Steve Jobsのスピーチで有名になったフレーズ。英語は理解を「点の接続」で表現する。I connected the dots(全部繋がった)。日本語は「つながった」で線のイメージだけど、英語はdots(点)が先にある。バラバラの情報=点。理解=線で繋ぐ。英語は理解のプロセスを2段階(点を見る→線で繋ぐ)に分ける。日本語より工程が1つ多い。", category: 'reaction', month: '2026-03' },
    { daySlot: 29, japanese: '知らなきゃよかった', english: [
        "wish I didn't know",
        "honestly, I wish I never found out",
        "some things are better left unknown and this is definitely one of them",
        "wish I didn't know. you ever learn something and immediately think 'put it back'? like, I want a refund on this knowledge. I didn't ask for it. it was given to me without consent. and now it lives in my brain rent-free. taking up space. and I can't unlearn it. there's no ctrl+z for the brain. no undo button. once you know, you know. and knowing sucks sometimes."
    ], context: "ignorance is bliss(無知は至福)が英語の有名な格言。知らないほうが幸せ。日本語にも「知らぬが仏」があって、ほぼ同じ。でも英語はbliss(至福)、日本語は仏。英語は「幸せ」で表現、日本語は「悟り」で表現。文化の違いが見える。英語は知らない=楽、日本語は知らない=悟ってる。ポジティブの種類が違う。", category: 'reaction', month: '2026-03' },

    // -- Day 30: 挑戦・チャレンジ (Challenges & trying new things) --
    { daySlot: 30, japanese: 'やったことないけどやってみる', english: [
        "first time for everything",
        "never done it before but hey, first time for everything",
        "I have zero experience with this but I'm just gonna go for it and figure it out",
        "never done it before. not even close to this. but there's a first time for everything, right? that's what people say. usually right before something goes wrong. but I'm choosing optimism today. I'm choosing to believe that 'figuring it out as I go' is a valid strategy and not just a fancy way of saying 'I have no idea what I'm doing.' confidence is 90% pretending anyway."
    ], context: "there's a first time for everythingは「何事にも初めてがある」。励ましにも皮肉にも使える万能フレーズ。初めて何かやるとき→励まし。誰かが珍しいことをしたとき→皮肉。go for itは「やっちゃえ」「思い切ってやれ」。forは「〜に向かって」で、目標にgo(行く)するイメージ。英語は挑戦を「前進する動き」で表現する。止まってるのが一番ダメ。", category: 'reaction', month: '2026-03' },
    { daySlot: 30, japanese: 'ビビってても始まらない', english: [
        "can't let fear win",
        "I can't let fear run the show forever",
        "if I keep waiting until I'm not scared, I'll never start, so I'm just doing it",
        "can't let fear win. and fear's been winning for a while, to be honest. fear's been undefeated. a champion. but today I'm challenging the champion. and yeah, the champion will probably still win 'cause fear is really good at its job. but at least I showed up to the fight. that counts. showing up counts. even if I get knocked out in round one. I showed up. put that on my tombstone."
    ], context: "let fear winは「恐怖に勝たせる」。英語は感情を擬人化する。fear wins(恐怖が勝つ)、anger took over(怒りが支配した)、sadness crept in(悲しみが忍び込んだ)。感情が自分の中の別キャラクターで、主導権争いをしてる。Pixarのインサイドヘッドそのまま。日本語は「怖くて動けない」と自分の状態を言うけど、英語は「恐怖が勝ってる」と対戦相手として語る。", category: 'opinion', month: '2026-03' },
    { daySlot: 30, japanese: '失敗しても経験になる', english: [
        "learn from it either way",
        "even if I fail, I'll learn something from it",
        "worst case scenario I fail and learn something, best case I actually pull it off",
        "even if I fail, I learn. that's what I tell myself. and it's TRUE. I have learned from every failure. the problem is I've also failed at applying what I learned from those failures. so I'm learning and failing and learning about failing and failing at learning and it's this beautiful cycle of incompetence and growth. but net positive. I think. the math is complicated."
    ], context: "learn from itは「そこから学ぶ」。英語はfailure(失敗)をlearning experience(学習経験)と言い換える文化がある。失敗=経験。ポジティブすぎない? でもこのリフレーミングが英語圏のイノベーション文化を支えてる。fail fast(早く失敗しろ)はシリコンバレーの格言。日本語は「失敗は成功のもと」だけど、もと(元)=材料。英語は経験=プロセス。失敗の扱い方が根本的に違う。", category: 'opinion', month: '2026-03' },
    { daySlot: 30, japanese: '背中を押してくれ', english: [
        "give me a push",
        "I need someone to just push me off the cliff already",
        "I'm standing at the edge, I just need one little push to actually do it",
        "give me a push. not a big one. just a nudge. a tiny shove in the right direction. 'cause I'm standing on the diving board and the water looks fine but my feet won't move. my brain says 'jump' and my legs say 'we don't work for you anymore.' I need external force. a friend who goes 'just do it' at the exact right moment. that's all. a well-timed nudge. is that too much to ask?"
    ], context: "pushは「押す」、nudgeは「肘で軽くつつく」。英語は「背中を押す」の強さを3段階で表現する。nudge(軽く)、push(普通に)、shove(強く)。日本語は「背中を押す」一つだけ。英語は物理的な力の加減を言葉で細かく指定する。take the plunge(飛び込む)は「思い切ってやる」。plunge=急に飛び込む。英語は挑戦を「高い場所から飛ぶ」で表現する。高所恐怖の言語。", category: 'request', month: '2026-03' },
    { daySlot: 30, japanese: '居心地いいところにいたら成長しない', english: [
        "comfort zone",
        "gotta get outta my comfort zone",
        "nothing good happens inside my comfort zone, I know that, but it's so comfy in here",
        "gotta get outta my comfort zone. and I KNOW that. everyone knows that. it's on every motivational poster ever made. but knowing and doing are two completely different sports. knowing is chess. doing is boxing. I'm great at chess. terrible at boxing. my comfort zone has a couch and snacks and Netflix and you're asking me to leave? for GROWTH? growth doesn't have snacks. growth has discomfort. the name says it all. DIScomfort zone."
    ], context: "comfort zoneは日本語にもなりつつあるけど、英語のほうがニュアンスが深い。zone=区域で、物理的な領域として扱う。step out of your comfort zone(快適区域から出ろ)。英語は抽象概念を物理空間にする癖がある。in a dark place(暗い場所にいる=精神的に辛い)、in a good place(いい場所にいる=調子いい)。感情=場所。英語は感情に住所がある。", category: 'opinion', month: '2026-03' },
    { daySlot: 30, japanese: '完璧じゃなくていいから出せ', english: [
        "done is better than perfect",
        "stop polishing it and just ship it already",
        "it doesn't have to be perfect, it just has to be out there, you can fix it later",
        "done is better than perfect. I know perfectionists hate this phrase but it's true. 'cause perfect doesn't exist. it's a moving target. you finish something, look at it, and immediately see ten things to fix. and if you fix those ten, you'll see ten more. it never ends. so at some point you gotta say 'good enough' and push it out the door. perfection is procrastination wearing a fancy hat."
    ], context: "ship itは「出荷しろ」。元はソフトウェア用語で「リリースしろ」。今はどんな仕事にも使う。ship your work(仕事を出せ)、ship it(出しちゃえ)。done is better than perfectはFacebook社のモットーだった。英語圏は「完璧より完了」を美徳とする。日本語は「中途半端はダメ」文化。この違いがスピード差を生む。英語の文化は70点で出して後から直す。日本語は100点になるまで出さない。", category: 'suggestion', month: '2026-03' },
    { daySlot: 30, japanese: 'とりあえず手を動かせ', english: [
        "just start",
        "stop thinking and just start already",
        "you don't need a plan, you don't need to be ready, just start and figure it out",
        "just start. don't plan. don't research. don't make a pros-and-cons list. don't ask three people for advice. just START. open the thing. write the first word. take the first step. the hardest part of anything is the first five minutes. after that, momentum kicks in and your brain goes 'oh wait, this isn't so bad.' your brain is a drama queen at the start of every task. just ignore it and start."
    ], context: "just do itはNikeのスローガンだけど、英語の哲学そのもの。just=「ただ」で、余計なことを削ぎ落とす。don't think, just do(考えるな、やれ)。日本語は「石橋を叩いて渡る」文化だけど、英語はjust cross the bridge(とにかく橋を渡れ)。叩いてる暇はない。渡ってから考える。この「行動→思考」の順序が英語圏の文化コード。日本語は「思考→行動」。順番が逆。", category: 'request', month: '2026-03' },
    { daySlot: 30, japanese: '無理って言われたけどやる', english: [
        "watch me",
        "they said I can't? watch me",
        "everyone told me it's impossible and honestly that just makes me wanna do it more",
        "they said I can't. cool. watch me. there's no better fuel than someone telling you 'no.' every successful person has a story that starts with 'they told me I couldn't.' and ends with 'so I did.' it's the world's oldest plot line. doubt is rocket fuel. and I've got a full tank. so either I'm about to launch or I'm about to explode. either way it's gonna be spectacular."
    ], context: "watch meは「見てろ」。たった2語で挑戦状を叩きつける。英語はこういう短い宣戦布告が得意。bring it on(かかってこい)、try me(やってみろ)、game on(勝負だ)。全部3語以下。日本語は「見てろよ」「今に見てろ」で同じだけど、英語のwatch meは目を指す。「お前の目で見届けろ」という命令。証人になれ、という覚悟の表明。かっこいい。", category: 'shutdown', month: '2026-03' },
    { daySlot: 30, japanese: 'やらない後悔よりやる後悔', english: [
        "rather try and fail",
        "I'd rather try and fail than never try at all",
        "the worst feeling isn't failure, it's wondering 'what if I had actually tried?'",
        "I'd rather try and fail. 'cause regret is heavier than failure. failure fades. you fail, you feel bad for a week, you move on. but 'what if'? what if stays FOREVER. what if is that 3 AM thought that never goes away. twenty years later you're lying in bed going 'what if I had done it?' and you'll never know. at least if you fail you know. knowing beats wondering. every single time."
    ], context: "what ifは「もしも」。英語で最も怖い2語と言われる。what if I had tried?(もし挑戦してたら?)は仮定法過去完了で、もう変えられない過去への後悔。英語は後悔を「what if + 過去完了」で表現する。文法構造自体が「もう手遅れ」を示してる。日本語の「もし」は未来にも過去にも使えるけど、英語のwhat if I hadは過去限定。文法が時間を閉じる。残酷。", category: 'opinion', month: '2026-03' },
    { daySlot: 30, japanese: '壁にぶつかったけど諦めない', english: [
        "hit a wall but I'll keep going",
        "hit a wall but I'm not done yet, not even close",
        "I've hit a wall and everything in me wants to quit but I know I'll regret it if I do",
        "hit a wall. a big one. the kind where you can't see over it and you can't go around it and the only option is through it. and 'through a wall' is not a fun option. but quitting is worse. 'cause then the wall wins. and I refuse to lose to a wall. a wall doesn't even have a brain. I'm not getting outsmarted by concrete. I have thumbs. I have tools. the wall's going down."
    ], context: "hit a wallは「壁にぶつかる」。英語も日本語も壁のメタファーは同じ。でも英語はhit(ぶつかる)で物理的な衝撃を強調。break through the wall(壁を突き破る)、climb over(乗り越える)、go around(回り込む)。壁への対処法を3つ持ってる。日本語は「壁を越える」が主流。英語は破壊・登頂・迂回の3択。選択肢が多い。攻略法がある言語。", category: 'reaction', month: '2026-03' },

    // -- Day 31: 振り返り・成長 (Reflection & growth) --
    { daySlot: 31, japanese: '振り返ると成長してた', english: [
        "come a long way",
        "I've actually come a long way, huh",
        "looking back at where I started, I can't believe how far I've come",
        "I've come a long way. and I didn't notice 'cause growth is slow. it's like watching grass grow. you don't see it day to day. but if you take a picture today and compare it to a year ago? completely different person. same face, different software. I got updates I didn't even know were downloading. background processes. the operating system upgraded while I was busy complaining about the loading speed."
    ], context: "come a long wayは「長い道のりを来た」=「かなり成長した」。英語は成長を「移動距離」で測る。how far you've come(どこまで来たか)、where you started(どこから始めたか)。人生=旅のメタファーが深く根付いてる。日本語は「成長した」と状態変化で言うけど、英語は「遠くまで来た」と移動で言う。英語話者にとって成長は旅。止まったら成長してない。", category: 'reaction', month: '2026-03' },
    { daySlot: 31, japanese: '前の自分に言ってやりたい', english: [
        "wish I could tell past me",
        "I wish I could go back and tell my younger self",
        "if I could talk to my past self, I'd say 'it's gonna be OK, just keep going'",
        "I wish I could tell past me. like, sit him down and go 'hey, idiot. that thing you're stressing about? doesn't matter. that person you're trying to impress? doesn't matter either. the only thing that matters is that you keep going. and you DO keep going. I know 'cause I'm the proof. I'm future you. and I turned out OK. not great. but OK. and OK is enough.'"
    ], context: "past me / future meは「過去の自分 / 未来の自分」。英語は自分を時間軸で分割する。past me(過去の俺)、present me(今の俺)、future me(未来の俺)。全部別人扱い。past me was an idiot(過去の俺はバカだった)。自分を客観視するのに「時間で分ける」手法。日本語は「あの頃の自分」「昔の自分」で、英語ほど別人感がない。英語は自分を複数人として管理する。", category: 'opinion', month: '2026-03' },
    { daySlot: 31, japanese: '無駄なことなんてなかった', english: [
        "nothing was wasted",
        "turns out nothing was wasted, it all counted",
        "every detour, every mistake, every failure -- it all led to right here",
        "nothing was wasted. and I say that now, in hindsight, from a comfortable position. would I have said that while it was happening? absolutely not. during the messy parts I was saying 'this is pointless' and 'why is this happening to me.' but now I see. every wrong turn was a scenic route. every failure was a lesson wearing a disguise. every setback was a setup. I didn't see it then. I see it now."
    ], context: "waste(無駄)は英語で最も嫌われる概念の一つ。waste of time(時間の無駄)、waste of money(金の無駄)。英語圏は効率至上主義だから「無駄」を極端に嫌う。nothing was wastedは「何も無駄じゃなかった」でとても強い慰め。日本語の「無駄じゃなかった」と同じだけど、英語のほうがwasteに対する嫌悪感が強い分、この言葉の救済力も大きい。", category: 'opinion', month: '2026-03' },
    { daySlot: 31, japanese: 'まだまだだな', english: [
        "still got a ways to go",
        "I've grown but I still got a long ways to go",
        "I'm proud of how far I've come but I know I'm not even close to where I wanna be",
        "still got a ways to go. and that's OK. 'cause the day I think I'm done growing is the day I actually stop. there's this weird paradox where the more you learn, the more you realize you don't know. it's like climbing a mountain and every time you reach a peak, you see a taller one behind it. annoying? yes. motivating? also yes. the mountain never ends. and neither do I."
    ], context: "a ways to goは「まだ先がある」。wayは「道」で、距離を測ってる。a long way to go(まだ長い道がある)、a short way(もう少し)。日本語の「まだまだ」は距離じゃなくて程度。英語は旅のメタファーで成長を語るから、残りの距離が常に意識される。日本語の「まだまだ」は漠然としてるけど、英語のa ways to goは道が見えてる。ゴールの方向はわかってる。", category: 'reaction', month: '2026-03' },
    { daySlot: 31, japanese: '一年前の自分と比べたら', english: [
        "compared to a year ago",
        "compared to a year ago? night and day, honestly",
        "if you put me from a year ago next to me now, you wouldn't believe it's the same person",
        "compared to a year ago? night and day. completely different human. well, same human, different firmware. a year ago I couldn't do half the things I do now without thinking. and a year from now I'll look back at today-me and think 'wow, that guy had no clue.' and that's how it should be. if future you isn't embarrassed by current you, you're not growing fast enough."
    ], context: "night and dayは「月とスッポン」「雲泥の差」。夜と昼くらい違う。英語は極端な対比が好き。night and day、black and white、hot and cold。日本語は「月とスッポン」「天と地」で動物や場所を使うけど、英語は自然現象(昼夜、色、温度)を使う。compare(比較する)はcom-(一緒に)+par(等しい)で「並べて等しさを見る」。比較は英語の基本操作。", category: 'reaction', month: '2026-03' },
    { daySlot: 31, japanese: '変わったなって言われた', english: [
        "people say I've changed",
        "people keep saying I've changed, like it's a bad thing",
        "everyone says I'm different now and I'm like yeah, that's the whole point",
        "people say I've changed. and they say it like it's an accusation. 'you've changed.' yeah. I have. on purpose. that was the PLAN. staying the same isn't a virtue. it's stagnation. a pond that doesn't move grows algae. I don't wanna be algae. I wanna be a river. moving. changing. occasionally flooding. but always going somewhere. you've changed is a compliment I accept. thank you."
    ], context: "you've changedは英語では微妙な表現。褒めてる場合もあるけど、多くの場合は批判。「前のあなたのほうがよかった」の意味が隠れてる。日本語の「変わったね」も同じ二面性がある。でも英語のほうがネガティブ寄り。change=不安定、consistency=信頼、という英語圏の価値観。日本語は「変わる」にもっと中立的。変化自体に善悪をつけない。英語は変化を警戒する。", category: 'reaction', month: '2026-03' },
    { daySlot: 31, japanese: '後悔はしてない', english: [
        "no regrets",
        "I regret nothing, I'd do it all again",
        "if I could go back, I wouldn't change a single thing because all of it made me who I am",
        "no regrets. and I mean that. not in the Instagram-caption way where people say 'no regrets' under a photo of bad food. I mean I genuinely wouldn't change anything. even the cringe parts. especially the cringe parts. 'cause the cringe parts taught me who I don't wanna be. and knowing who you don't wanna be is just as valuable as knowing who you do wanna be. maybe more. cringe is education. painful, humiliating education."
    ], context: "no regretsは「後悔なし」。regretの語源はフランス語のregreter(嘆く)。英語はI have no regrets(後悔はない)と「持ってない」で表現する。後悔を「所有物」として扱ってる。日本語は「後悔してない」と動詞。英語は後悔を物として持つか持たないか。物だから捨てることもできる。let go of regret(後悔を手放す)。英語は感情を物体化して操作する。合理的だけど、ちょっと冷たい。", category: 'opinion', month: '2026-03' },
    { daySlot: 31, japanese: 'ここまで来れたのは周りのおかげ', english: [
        "couldn't have done it alone",
        "I couldn't have done any of this without the people around me",
        "I take zero credit for getting here because every step was supported by someone else",
        "couldn't have done it alone. and I tried. trust me. I tried the solo thing. the 'I don't need anyone' thing. didn't work. turns out humans are social animals and that includes me, the guy who said 'I work better alone.' I don't. nobody does. every success I've had has fingerprints on it that aren't mine. and I'm finally OK admitting that. took me long enough."
    ], context: "couldn't have done itは仮定法過去完了で「〜なしではできなかった」。would have、could have、should haveは英語の後悔三兄弟。could have(できたのに)=能力の後悔、would have(するつもりだったのに)=意志の後悔、should have(すべきだったのに)=義務の後悔。ここではcouldn't have=「不可能だった」と断言してる。周りへの感謝を「不可能性」で表現する。強い。", category: 'opinion', month: '2026-03' },
    { daySlot: 31, japanese: 'まだ終わりじゃない', english: [
        "not done yet",
        "I'm not done yet, not by a long shot",
        "this isn't the end of the story, it's just the end of this chapter",
        "not done yet. not even close. this feels like an ending but it's not. it's a comma, not a period. a pause, not a stop. and I'm gonna use this pause to catch my breath, look around, appreciate how far I've come, and then keep going. 'cause the next chapter is gonna be even better. I don't know that for sure. but I choose to believe it. and sometimes believing is enough to make it true."
    ], context: "not done yetは「まだ終わってない」。doneは「完了した」で、口語では超頻出。I'm done(終わった)、are you done?(終わった?)、we're done here(もう終わりだ)。finishedよりカジュアル。not by a long shotは「全然まだ」。long shot=「遠い的を撃つ」=可能性が低い。not by a long shot=「そんな遠い話じゃない」=まだまだ先がある。射撃のメタファー。英語は距離感を弾丸で測る。", category: 'reaction', month: '2026-03' },
    { daySlot: 31, japanese: '来月の自分が楽しみ', english: [
        "excited for what's next",
        "I'm actually excited to see what's next for once",
        "for the first time in a while, I'm genuinely looking forward to what comes next",
        "I'm excited for what's next. and that's new for me. usually I'm anxious about the future. dreading it. building worst-case scenarios like a hobby. but right now? right now I'm actually looking forward to it. whatever 'it' is. I don't know what's coming. but for the first time, that's exciting instead of terrifying. and that shift -- from fear to curiosity -- that might be the biggest growth of all."
    ], context: "look forward toは「楽しみにする」。直訳は「前を見る」。forward=前方。英語は未来を「前」に置く。look back(振り返る)=過去、look forward(前を見る)=未来。日本語も「先を見る」と言うから同じ構造。でも面白いのは一部の言語(アイマラ語など)では未来が「後ろ」にある。見えないから。英語と日本語は「未来=前」で一致してる。珍しい共通点。", category: 'reaction', month: '2026-03' },
];
