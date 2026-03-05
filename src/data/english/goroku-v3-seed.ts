// 俺語録 v3 Seed Data -- 5 Meta-Category Sampler (50 expressions)
// Days 1, 7, 13, 19, 26 -- one day per meta-category
// CONNECT / INFORM / INFLUENCE / EXPRESS / NAVIGATE
// 4-level english: [0]=core, [1]=vibe, [2]=scene, [3]=flow (stream-of-consciousness)

export interface V3Seed {
    daySlot: number;
    japanese: string;
    english: string[];  // 4 levels: [0]=core, [1]=vibe, [2]=scene, [3]=flow
    context: string;
}

export const V3_SEEDS: V3Seed[] = [

    // ═══════════════════════════════════════════════════════════════
    // Day 1: 出会い (First Encounters) -- CONNECT
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 1, japanese: '初めまして', english: [
        "nice to meet you",
        "hey, nice to meet you, I'm Tonio",
        "nice to finally meet you, I've heard a lot about you",
        "nice to meet you. and I always feel weird sayin' that 'cause like, what's the alternative? 'bad to meet you'? nobody says that. it's one of those phrases that means nothin' on its own but if you DON'T say it people think you're rude. it's a social tax. you pay it and move on."
    ], context: "「初めまして」は儀式。英語のnice to meet youも儀式。でも構造が違う。日本語は「初めて」=事実の報告。英語はnice=感想を先に言う。会った瞬間に「いい出会いですね」って評価してる。まだ何も知らないのに。英語は感想ファースト、事実セカンド。" },

    { daySlot: 1, japanese: 'お仕事は何されてますか', english: [
        "what do you do",
        "so what do you do for work?",
        "what do you do? like, for a living, I mean",
        "so what do you do? and I know that's like the most basic question ever but honestly it tells you a lot. people's whole vibe changes when they talk about work. some light up. some deflate. the answer's less about the job and more about whether they like their life right now."
    ], context: "英語はWhat do you do?で仕事を聞く。直訳は「何してるの?」。「仕事」って単語が入ってない。for a livingを付けると丁寧だけど、なくても仕事の話だと通じる。英語圏では「何してる人?」=「何の仕事?」が自動変換される。仕事=アイデンティティの国。" },

    { daySlot: 1, japanese: 'どこ出身？', english: [
        "where are you from",
        "so where are you from originally?",
        "where are you from? you don't sound like you're from around here",
        "where are you from? 'cause I'm tryin' to place your accent and I can't figure it out. and I don't mean that in a bad way. I'm just one of those people who hears someone talk and immediately starts guessin'. I'm usually wrong. like, spectacularly wrong. but I still do it every time."
    ], context: "Where are you from?は出身を聞く定番。でもfromの位置に注目。日本語は「どこ出身?」で出身が文末。英語はfromが最後に来る。本来はFrom where are you?が文法的だけど、会話ではwhereを先に出してfromを最後に残す。英語は疑問詞を先頭に持ってきたい衝動が強い。" },

    { daySlot: 1, japanese: 'ここ初めて？', english: [
        "first time here?",
        "is this your first time here? it's great, right?",
        "you ever been here before or is this your first time?",
        "first time here? 'cause I remember my first time here and I was like 'oh, this is the place.' you know that feelin'? when you walk in somewhere and you just know you're gonna be back? that. I had that. and now look at me. I'm basically furniture at this point."
    ], context: "「初めて?」は日本語だと3文字で済む。英語はIs this your first time?と文をフルで組み立てないといけない。this、your、firstと全部の部品を並べる。日本語の省略力に比べて、英語は毎回フルセットを要求する。でもカジュアルならFirst time here?と主語を省略できる。砕けると日本語に近づく。" },

    { daySlot: 1, japanese: 'よろしくお願いします', english: [
        "looking forward to it",
        "lookin' forward to workin' with you",
        "I'm looking forward to it, let's make it happen",
        "lookin' forward to it. and I know Americans don't really have a 'yoroshiku' but 'lookin' forward to it' is the closest thing. it's not the same though. yoroshiku is like a blanket -- it covers everything. the English version is specific. forward to WHAT? you gotta name it. English doesn't do blankets. it does receipts."
    ], context: "「よろしく」は英語に直訳できない。翻訳不能四天王の一角。場面によってnice to meet you、looking forward to it、please take care of itと全部違う。日本語は「よろしく」1語で全方向カバー。英語は毎回場面に合わせて着替える。便利すぎて英語に輸出したいレベル。" },

    { daySlot: 1, japanese: '久しぶり！', english: [
        "long time no see",
        "hey! long time no see, how've you been?",
        "oh my god, it's been forever! how are you?",
        "long time no see! and I know I say that but honestly I don't even know how long it's been. a year? two? time does that thing where it either crawls or teleports and there's no in-between. feels like we just hung out last week but also feels like another lifetime. time is broken."
    ], context: "long time no seeは文法的にめちゃくちゃ。主語なし、動詞なし、形容詞と名詞だけ。実はピジン英語(中国語の好久不見)が起源って説がある。正しい英語じゃないのに全員使ってる。壊れた文法が定着した珍しい例。言語は正しさじゃなくて便利さで生き残る。" },

    { daySlot: 1, japanese: '何て呼べばいい？', english: [
        "what should I call you",
        "what should I call you? got a nickname?",
        "what do you go by? or should I just use your full name?",
        "what should I call you? 'cause names are tricky. some people have a name but go by somethin' totally different. and then there's people who introduce themselves as one thing and then their friends call 'em somethin' else and now I don't know which one I'm allowed to use. name politics. it's a whole thing."
    ], context: "What should I call you?は「何て呼べばいい?」。英語にはgo byという便利な句動詞もある。I go by Mike(マイクで通ってる)。「本名とは別の名前で社会を渡り歩いてる」感覚。日本語は名前=呼び名がほぼ一致するけど、英語圏はニックネーム文化が強い。William→Bill、Robert→Bob。原形ない。" },

    { daySlot: 1, japanese: 'こっち来たばっかで', english: [
        "just moved here",
        "I just moved here, still figuring things out",
        "I literally just got here, I don't know anything yet",
        "I just moved here. like, my boxes aren't even unpacked. I don't know where anything is. the grocery store, the station, the good coffee spot -- all mysteries. I'm basically a tourist except I live here. I've been googlin' 'best ramen near me' like a visitor in my own neighborhood."
    ], context: "just movedの justは「たった今」。図々しいくらい直近を強調する。I just got here(今来たばっかり)、I just started(始めたばっかり)。日本語の「ばっかり」と近いけど、justは1語で済む。しかもjustは「ちょっとだけ」にも「ただの」にも使える。英語で一番働いてる単語かもしれない。" },

    { daySlot: 1, japanese: '連絡先交換しない？', english: [
        "let me get your number",
        "hey, let me get your number, we should hang out",
        "we should exchange info, what's the best way to reach you?",
        "let me get your number. and I promise I'm not one of those people who gets your number and never texts. I mean, I might take a week. or two. OK sometimes a month. but I'll text eventually. 'eventually' is doin' a lot of heavy liftin' in that sentence but the point is I'll do it. probably."
    ], context: "Let me get your numberの getは「もらう」。日本語は「交換しない?」と対等な提案。英語はlet me get=「俺にもらわせて」と片方がもらう構造。give me your number(番号くれ)だと命令っぽいけど、let me getだとソフト。letが許可のクッションになってる。英語は行動の前にlet meで許可を取る文化。" },

    { daySlot: 1, japanese: '何か飲む？', english: [
        "want something to drink",
        "you want somethin' to drink? I'm grabbin' one",
        "can I get you something? water, coffee, whatever",
        "want somethin' to drink? 'cause I'm about to grab one anyway so it's no trouble. that's the trick by the way -- 'I'm already goin'' makes the offer feel lighter. if you just say 'want a drink?' it's formal. 'I'm grabbin' one, you want?' is casual. English runs on these little softeners. hard offers feel like sales pitches."
    ], context: "「飲む?」は日本語だと2文字。英語はDo you want something to drink?とフルで聞く。でもカジュアルだとwant somethin'?まで圧縮できる。Do youを省略してwant...?で始めるのがカジュアルの証。英語は丁寧さ=長さ。短くなるほどカジュアル。日本語は最初から短い。英語は長いところから削って調整する。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 7: 聞く (Asking) -- INFORM
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 7, japanese: 'ちょっと聞いていい？', english: [
        "can I ask you something",
        "hey, can I ask you somethin' real quick?",
        "can I ask you something? and it might be kinda personal",
        "can I ask you somethin'? and I'm prefacin' it so you know it's not a normal question. normal questions don't need a preface. 'what time is it?' -- no preface needed. but 'can I ask you somethin'?' means the next sentence is either awkward, nosy, or both. you've been warned."
    ], context: "Can I ask you something?は「質問していい?」だけど、これ自体が質問。質問するために質問してる。メタ質問。日本語の「ちょっと聞いていい?」も同じ構造。でも英語版のほうが「これから来る質問はちょっとヤバいかも」の警告度が高い。普通の質問にはこのプレフィックスつけない。" },

    { daySlot: 7, japanese: 'これどういう意味？', english: [
        "what does this mean",
        "wait, what does this even mean?",
        "I keep seeing this everywhere, what does it actually mean?",
        "what does this mean? 'cause I've been noddin' along like I understand but I don't. I've been fakin' comprehension for like ten minutes. and the longer I wait to ask, the weirder it gets. there's a window for askin' 'what does that mean?' and I'm pretty sure I missed it five minutes ago."
    ], context: "what does this mean?のdoesに注目。日本語は「どういう意味?」で直接聞ける。英語はwhat+does+this+meanと部品を4つ並べる。doesは疑問の旗。meanは「意味する」という動詞。英語は「意味」を名詞じゃなくて動詞で扱う。This means X(これはXを意味する)。意味は動くもの。" },

    { daySlot: 7, japanese: 'なんて言った？', english: [
        "what'd you say",
        "sorry, what'd you say? I missed that",
        "wait, say that again? I totally zoned out for a second",
        "what'd you say? and don't give me that look. I was listenin'. I was just... listenin' to the wrong thing. my brain picked up a sound in the background and followed it like a dog chasin' a squirrel. I'm back now. fully present. hit me again. from the top."
    ], context: "What did you say?がWhat'd you say?に縮まる。did youがd'youになって、さらにdに圧縮。英語は聞き返すときに超高速で省略する。Excuse me?、Sorry?、Come again?、Huh?と選択肢が多い。丁寧さのレベルで使い分ける。Huh?は最もカジュアル。Excuse me?は丁寧だけど怒ってるときにも使う。怖い。" },

    { daySlot: 7, japanese: '具体的には？', english: [
        "like what",
        "like what exactly? gimme an example",
        "can you be more specific? I need details here",
        "like what? and I'm not tryin' to be difficult, I genuinely don't understand. 'cause you said 'stuff' and 'stuff' could mean anything. 'stuff' is the vaguest word in English. it means everything and nothing. I need you to translate your 'stuff' into actual nouns. what stuff. which stuff. whose stuff."
    ], context: "「具体的には?」を英語にすると何パターンもある。Like what?(どんなの?)、Such as?(たとえば?)、Can you be more specific?(もっと具体的に)。面白いのはlike whatが一番カジュアルで一番よく使われること。likeは「好き」じゃなくて「たとえば」の意味で1日100回出てくる。" },

    { daySlot: 7, japanese: 'いつから？', english: [
        "since when",
        "wait, since when? how long has this been goin' on?",
        "hold on -- since when? why am I just now hearing about this?",
        "since when?! and why didn't anyone tell me? I feel like I'm the last person to find out about everything. is there a group chat I'm not in? a newsletter? a carrier pigeon I missed? since when is two words but it carries a LOT of betrayal energy. since when means 'I should have known sooner and I'm offended.'"
    ], context: "since whenは「いつから?」だけど、裏に「え、聞いてないんだけど」って不満が入ってる。中立的に期間を聞くならhow long?を使う。since when?は「知らなかった怒り」が含まれてる。日本語の「いつから?」は中立にも不満にも使える。英語はhow long(中立)とsince when(不満)で使い分ける。感情が文法に染みてる。" },

    { daySlot: 7, japanese: 'それって本当？', english: [
        "is that true",
        "wait, is that actually true? no way",
        "are you serious right now? that can't be real",
        "is that true? 'cause I wanna believe you but my brain is runnin' a fact-check in the background and it's returnin' 'suspicious.' and I don't wanna be that guy who goes 'source?' in a normal conversation but also... source? where did you hear this? who told you? was it the internet? the internet lies."
    ], context: "Is that true?は疑い半分。本当に信じてないときはFor real?、Seriously?、Are you messing with me?と疑いの強度が上がる。日本語は「マジ?」一個で全強度をカバーするけど、英語は段階がある。Really?→Seriously?→Are you kidding me?→No way. 疑いにグラデーションがある。" },

    { daySlot: 7, japanese: 'どうやってやるの？', english: [
        "how do you do that",
        "how do you do that? teach me",
        "OK wait, show me how you did that, step by step",
        "how do you DO that? 'cause I've tried and it doesn't work for me. is it a talent thing? a practice thing? a 'you either got it or you don't' thing? 'cause if it's the last one I need to know so I can stop wastin' my time and find somethin' I'm actually good at. which might be nothin'. but at least I'd know."
    ], context: "How do you do that?のdoが2回出てくる。最初のdoは疑問の旗、2番目のdoは「やる」の動詞。英語はdoを疑問用と動詞用で二重使いする。日本語は「どうやるの?」でどう+やる。英語はhow+do+you+do+that。部品が多い。でもネイティブはhow d'you do thatと一瞬で言う。部品は多いけど発音は圧縮される。" },

    { daySlot: 7, japanese: 'なんで知ってんの？', english: [
        "how do you know that",
        "wait, how do you even know that?",
        "how do you know that? that's weirdly specific information to have",
        "how do you know that? that's a suspiciously specific piece of information. like, normal people don't just KNOW that. you either researched it, experienced it, or you're hiding a secret life. which one is it? and don't say 'I just know' 'cause that's the most suspicious answer possible."
    ], context: "how do you know?は「なんで知ってるの?」。howは「どうやって」=入手経路を聞いてる。日本語の「なんで」は理由を聞いてるけど、英語のhowは方法を聞いてる。知識の入手ルートが気になる言語。Where did you hear that?(どこで聞いた?)も同じ。英語は情報のサプライチェーンを追う。" },

    { daySlot: 7, japanese: 'これ合ってる？', english: [
        "is this right",
        "is this right? just wanna double-check",
        "can you check this for me? I'm like 80% sure but not 100%",
        "is this right? 'cause I did it myself and whenever I do things myself there's a 40% chance I messed up somewhere. I'm not bad at it. I'm just... inconsistently good. like, sometimes I nail it, sometimes I'm off by a mile, and I never know which one it's gonna be until someone checks."
    ], context: "Is this right?の rightは「正しい」。でも英語のrightは「右」も「正しい」も「権利」も同じ単語。right answer(正しい答え)、right turn(右折)、human rights(人権)。全部right。なぜ? 歴史的に「右=正しい」のバイアスがあったから。left(左)=sinister(不吉)。言語に偏見が化石化してる。" },

    { daySlot: 7, japanese: 'それ誰が言ってた？', english: [
        "who said that",
        "who said that? was it reliable?",
        "who told you that? 'cause that doesn't sound right to me",
        "who said that? 'cause the source matters. if your friend said it, fine. if 'someone on the internet' said it, I need more info. and if you start with 'well, I read somewhere that...' -- stop. 'somewhere' is doing too much work. somewhere is not a source. somewhere is where lost socks go. be specific."
    ], context: "Who said that?は情報源を問い詰める表現。日本語は「誰が言ってた?」で軽く聞けるけど、英語のwho said thatはちょっと圧がある。特にthatを強調するとI don't believe itのニュアンスが入る。英語は情報の出どころに敏感。According to whom?(誰によると?)が自然に出てくる文化。ソースは?って聞くのが普通。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 8: 答える (Answering) -- INFORM
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 8, japanese: 'うん、そうだよ', english: [
        "yeah, that's right",
        "yeah, that's right, you got it",
        "yep, that's exactly it, you nailed it",
        "yeah, that's right. and I love when people get it on the first try 'cause then I don't have to explain myself. explainin' yourself is exhaustin'. especially when the answer is simple. yes. that's it. that's the whole thing. no asterisks, no footnotes, no 'well actually.' just... yes. enjoy the simplicity."
    ], context: "英語のyeahは「うん」だけど、温度が違う。Yes(はい)→Yeah(うん)→Yep(おう)→Uh-huh(ふーん)。カジュアルになるほど音が短く雑になる。you got itは「正解」だけど直訳は「それを手に入れた」。英語は理解=入手。分かった=掴んだ。I get it(分かる)も同じ。理解は狩り。" },

    { daySlot: 8, japanese: 'さあ、わからない', english: [
        "beats me",
        "beats me, I got no clue",
        "honestly? I have no idea, your guess is as good as mine",
        "beats me. and I'm not bein' humble. I genuinely don't know. there's 'I don't know but I could figure it out' and there's 'I don't know and I've accepted that I'll never know.' this is the second one. my brain looked at that question, said 'nope,' and moved on. no effort was made. zero investigation conducted."
    ], context: "beats meは「わからん」。直訳は「俺を打ち負かす」。その質問が俺に勝った=降参=わからん。負けを認める言い方。日本語の「さあ」は空気を出すだけで答えを放棄する。英語は「負けた」と宣言して放棄する。知らないことを戦いの敗北として表現する。知識はバトル。" },

    { daySlot: 8, japanese: 'たぶんね', english: [
        "probably",
        "yeah, probably, I'm not 100% sure though",
        "I think so? like 80% sure, don't quote me on that",
        "probably. and I wish I could give you a solid yes but my confidence is at like 75%. which is enough to say 'probably' but not enough to say 'definitely.' there's a whole zone between those two words. probably lives in that zone. it's non-committal. it's the Switzerland of answers. neutral but leaning slightly yes."
    ], context: "probablyは「たぶん」だけど確率のニュアンスが入ってる。probably(80%)、maybe(50%)、possibly(30%)と英語は曖昧さにもグラデーションがある。日本語は「たぶん」で全部カバーするけど、英語は確信度を単語で分ける。don't quote me on thatは「引用しないでね」=責任取らないよの保険。英語は曖昧にも保険をかける。" },

    { daySlot: 8, japanese: 'ちょっと違う', english: [
        "not exactly",
        "not exactly, it's more like this",
        "well, you're close but not quite, let me explain",
        "not exactly. and I don't wanna be that guy who corrects people 'cause nobody likes that guy. but also, leavin' you wrong feels worse. so here I am. bein' that guy. you're in the right neighborhood but the wrong house. close enough to see the right answer from where you're standin' but not quite there yet."
    ], context: "not exactlyは完全否定しないソフトな訂正。「違う」じゃなくて「正確にはそうじゃない」。英語は否定にもクッションを入れる。not quite(もうちょい)、not really(そうでもない)、not necessarily(必ずしも)。全部notの後にワンクッション。日本語は「違う」で一刀両断できるけど、英語はnotの後にやさしさを挟む。" },

    { daySlot: 8, japanese: '簡単に言うと', english: [
        "basically",
        "basically, the short version is this",
        "long story short, here's the deal in a nutshell",
        "basically. and I'm sayin' 'basically' because the actual explanation is way too long and I can see your eyes glazin' over already. so I'm gonna compress it. a lot. like, lossy compression. some detail will be lost. but the core will survive. think of it as the trailer, not the movie. you'll get the vibe. not the plot."
    ], context: "basicallyは「基本的に」だけど会話では「ざっくり言うと」の意味で使いまくる。in a nutshellも同じ。nutshell=クルミの殻。巨大な話をクルミの殻に詰め込むイメージ。英語は要約を「小さい容器に入れる」と表現する。日本語は「簡単に言うと」で難易度を下げる。英語はサイズを小さくする。圧縮方法が違う。" },

    { daySlot: 8, japanese: '正直に言うと', english: [
        "honestly",
        "honestly? I'll just be straight with you",
        "I'm gonna be real with you, no sugarcoating",
        "honestly? and when someone says 'honestly' it means everything they said BEFORE was slightly dishonest. that's the implication. 'honestly' is a reset button. it means 'OK forget the polite version, here's the real version.' which is kinda terrifying. but also refreshing. depends which side you're on."
    ], context: "honestlyは「正直に言うと」だけど、これを言った瞬間「今までのは正直じゃなかったの?」ってなる。no sugarcoating(砂糖コーティングなし)は面白い比喩。嫌な真実に砂糖をかけて甘くする=オブラートに包む。英語は砂糖、日本語はオブラート。どっちも「包んで飲みやすくする」。不快な真実は薬。" },

    { daySlot: 8, japanese: '覚えてない', english: [
        "I don't remember",
        "I don't remember, my memory's garbage",
        "I have zero recollection of that, are you sure it happened?",
        "I don't remember. and it's not that it didn't happen. it's that my brain decided it wasn't worth keepin'. my brain has a filing system and that piece of information got sent to the shredder. gone. irretrievable. my brain is a terrible librarian. it keeps random song lyrics from 2003 but deletes actual useful information."
    ], context: "I don't rememberとI forgetは違う。rememberは「記憶にない」、forgetは「忘れた」。rememberは記憶倉庫に行って探したけど見つからなかった。forgetは記憶倉庫に入れたはずが消えた。結果は同じだけどプロセスが違う。日本語は「覚えてない」と「忘れた」で分けるけど、ほぼ同義で使う。英語は微妙にこだわる。" },

    { daySlot: 8, japanese: 'だいたいそんな感じ', english: [
        "something like that",
        "yeah, something like that, close enough",
        "more or less, that's the gist of it",
        "somethin' like that. which is my way of sayin' 'you're not exactly right but I don't have the energy to correct you.' it's a lazy agreement. a participation trophy of answers. 'close enough' energy. and honestly? sometimes close enough IS enough. not everything needs surgical precision. sometimes you just need the vibe."
    ], context: "something like thatは「だいたいそんな感じ」。便利すぎる曖昧肯定。more or less(多かれ少なかれ)も同じゾーン。gist(要旨)は「大体の意味」。That's the gist of it(だいたいそういうこと)。英語は「完全正解じゃないけどOK」の表現が豊富。roughly、approximately、give or take。正確さを手放す技術が発達してる。" },

    { daySlot: 8, japanese: '場合による', english: [
        "depends",
        "it depends, there's no one answer for that",
        "that's a tricky one, it really depends on the situation",
        "it depends. and I know that's a frustrating answer. you want yes or no and I'm givin' you 'it depends.' but life is full of 'it depends' answers. almost nothin' is absolute. is coffee good for you? depends. should I quit my job? depends. is this a good movie? DEPENDS. context is king and I refuse to give a simple answer to a complicated question."
    ], context: "It dependsは「場合による」の万能回答。何にでも使える回避ワザ。depends on(〜次第)で条件を指定できる。depends on the weather(天気次第)、depends on you(あなた次第)。英語は「ぶら下がってる」イメージ。dependはラテン語でde(下に)+pendere(ぶら下がる)。答えが条件からぶら下がってて、条件を引っ張らないと落ちてこない。" },

    { daySlot: 8, japanese: '長くなるけどいい？', english: [
        "it's a long story",
        "it's a long story, you sure you wanna hear it?",
        "you got time? 'cause this is gonna take a while to explain",
        "it's a long story. and when someone says 'it's a long story' they're askin' for permission to monologue. it's a social contract. you say 'yeah, go ahead' and now you're locked in for ten minutes minimum. there's no bailin' out halfway. you signed up. you agreed to the terms and conditions. no refunds."
    ], context: "It's a long storyは「長い話になるよ」=「聞く覚悟ある?」の確認。英語は話を物語(story)として扱う。long story short(長い話を短く)、that's a whole other story(それはまた別の話)、same old story(いつもの話)。人生の全てがstory。英語話者は自分の人生をナレーションしてる。全員が自分のドラマの脚本家。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 9: 説明 (Explaining) -- INFORM
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 9, japanese: '要するに', english: [
        "the point is",
        "the point is, it all comes down to this",
        "look, I've been going back and forth but the bottom line is this",
        "the point is -- and I should've started with this instead of rambling for five minutes -- the point is THIS. everything I said before was the scenic route. this is the destination. I do that. I take the long way to a simple point. my GPS is broken. I always arrive, just... eventually. after many detours."
    ], context: "the point isは「要するに」。pointは「点」。話の全体から核心の一点を指す。bottom lineも同じ。直訳は「一番下の行」=会計の最終行=結局いくら?。英語は要約を「点」か「最終行」で表現する。日本語は「要するに」=「要を掴む」。英語は点を指す、日本語は掴む。要約の身体動作が違う。" },

    { daySlot: 9, japanese: 'つまりこういうこと', english: [
        "what I'm saying is",
        "what I'm sayin' is, it works like this",
        "let me put it this way -- think of it like this",
        "what I'm sayin' is -- and I realize I'm explainin' my explanation which is never a good sign -- what I'm sayin' is this. and the fact that I had to rephrase it means my first attempt was trash. which happens. communication is a draft. nobody nails it first try. this is draft two. hopefully better. no guarantees."
    ], context: "what I'm saying isは自分の発言を言い直すシグナル。「つまり」を英語にするとso、basically、in other wordsと色々あるけど、what I'm saying isが一番会話的。自分の言葉を引用してる構造。put it this way(こう言い換えると)も便利。英語は説明が通じないとき「別の容器に入れ直す」感覚。同じ中身、違う包装。" },

    { daySlot: 9, japanese: '例えばさ', english: [
        "like, say",
        "like, say for example you're at a store, right?",
        "OK let me give you an example so this actually makes sense",
        "OK so like, say for example -- and this is a terrible example but bear with me -- say you're at a store. and you see a thing. and you want the thing. but you don't need the thing. that's basically what this is. except replace 'store' with 'life' and 'thing' with 'every decision you've ever made.' now you get it? no? OK different example."
    ], context: "for exampleはフォーマル。会話ではlikeかsayを使う。like, say you're...(例えばさ、あなたが...)。sayは「言う」じゃなくて「仮にこうだとして」の仮定用法。Let's say(仮に言えば)も同じ。英語は仮定を「言ってみよう」で始める。日本語は「例えば」=「例を出せば」。英語は「言ってみれば」。仮定は発話行為。" },

    { daySlot: 9, japanese: 'なんて言えばいいかな', english: [
        "how do I put this",
        "how do I put this... it's hard to explain",
        "I'm trying to find the right words here, bear with me",
        "how do I put this. and the fact that I'm askin' means the next sentence is either complicated, awkward, or offensive. possibly all three. I'm stalling. I'm bufferin'. my brain has the idea but the words aren't cooperatin'. it's like havin' the melody but not the lyrics. the vibe is there. the articulation is not."
    ], context: "how do I put thisの putは「置く」。言葉をどこに置けばいいか探してるイメージ。英語は表現することを「言葉を置く」と言う。put it simply(簡単に置くと)、I can't put it into words(言葉に置けない)、well put(いい置き方)。日本語は「言う」中心だけど、英語は「置く」。言葉はテーブルの上に並べるもの。" },

    { daySlot: 9, japanese: 'ここがポイント', english: [
        "here's the thing",
        "here's the thing though, this is the key part",
        "this is the important part so pay attention for a sec",
        "here's the thing. and I say 'here's the thing' because I need you to shift gears. everything before this was context. this is the payload. the setup is over. we're at the punchline. 'here's the thing' is the drumroll before the reveal. it says 'stop scrolling your phone and listen to the next sentence.' wake-up call."
    ], context: "here's the thingは最強の注目フレーズ。「ここからが本題」の合図。the thingは「そのこと」だけど、ここでは「核心」の意味。英語はthingを使いまくる。The thing is(問題は)、It's a thing(流行ってる)、Do your thing(好きにやれ)。thingは英語で最も怠けてる名詞。何でもthingで済ませる。便利すぎて具体性ゼロ。" },

    { daySlot: 9, japanese: '順番に言うと', english: [
        "step by step",
        "OK let me walk you through it step by step",
        "let me break it down for you, first things first",
        "OK step by step. first, this. then, that. then the other thing. and I'm goin' slow on purpose 'cause last time I tried to explain this I went too fast and lost everyone by step two. I'm a bad teacher 'cause I skip steps that feel obvious to me but aren't obvious to anyone else. so. step. by. step. we're walkin' together."
    ], context: "walk you through itは「一緒に歩いて通り抜ける」=「順を追って説明する」。英語は説明を散歩に見立てる。walk through(通り抜ける)、run through(ざっと通す)、go over(上を通る)。全部「道を一緒に進む」イメージ。日本語は「順番に」と順序を言うだけ。英語は「一緒に歩こう」と誘う。説明は一人旅じゃない。" },

    { daySlot: 9, japanese: 'ざっくり言うと', english: [
        "roughly speaking",
        "roughly speakin', it's somethin' like this",
        "I'll give you the rough version, we can get into details later",
        "roughly speakin'. and when I say 'roughly' I mean VERY roughly. like, sandpaper rough. the details have been sanded off. what you're gettin' is the shape, not the texture. the silhouette, not the portrait. if you want the full HD version, that's a separate conversation. this is the 144p preview. bufferin' not included."
    ], context: "roughlyは「大まかに」。rough=荒い。説明の表面が荒い=細部がない。英語は精度を表面の質感で表現する。rough(荒い)→smooth(滑らか)。rough draft(荒い下書き)、rough estimate(大まかな見積もり)。日本語の「ざっくり」はハサミでざくっと切る擬音。英語は触感。日本語は音。省略の感覚が五感で違う。" },

    { daySlot: 9, japanese: '逆に言えば', english: [
        "flip side is",
        "but on the flip side, look at it this way",
        "if you look at it from the other angle though, it actually makes sense",
        "but on the flip side -- and there's always a flip side, nothin' in life is one-sided -- on the flip side, this could actually be a good thing. perspective is a coin. you've been starin' at heads this whole time. I'm just askin' you to look at tails. it's the same coin. same situation. just... rotated. flip it."
    ], context: "flip sideは「裏面」。コインをflip(ひっくり返す)した側。英語は議論の別視点をコインの裏に見立てる。on the other hand(もう一方の手)も同じ。片手に賛成、もう片手に反対を載せて天秤にかけてる。日本語は「逆に言えば」で方向を反転させる。英語はコインを投げるか手を広げるか。視点切り替えが物理的。" },

    { daySlot: 9, japanese: 'わかりやすく言うと', english: [
        "in plain English",
        "in plain English, it just means this",
        "let me dumb it down a little -- no offense -- it basically means this",
        "in plain English -- and I love this phrase 'cause it implies that the rest of English is NOT plain. which is true. English has layers. there's plain English, there's business English, there's legal English, and there's 'what did you just say?' English. I'm bringin' it down to the ground floor. everybody welcome."
    ], context: "in plain Englishは「平易な英語で」。plainは「飾りがない」。面白いのは英語圏の人が「英語をわかりやすい英語で言い直す」こと。日本語で「わかりやすい日本語で言うと」とはあまり言わない。英語は専門レベルと日常レベルの差が激しい。同じ英語なのにlegalese(法律語)は外国語に近い。英語の中に複数の英語が住んでる。" },

    { daySlot: 9, japanese: '伝わった？', english: [
        "does that make sense",
        "does that make sense? or am I losin' you",
        "am I making any sense here or am I just talking in circles?",
        "does that make sense? and please be honest. don't give me the polite nod. I've seen the polite nod. the polite nod means 'I understood zero percent but I want this conversation to end.' if you don't get it, tell me. I'll try again. differently. worse, possibly. but differently. communication is just failing forward until it clicks."
    ], context: "does that make sense?は英語話者が説明のたびに確認する定番。make senseは「意味を作る」。意味は自動的に存在しない。話し手と聞き手が一緒に「作る」もの。日本語は「伝わった?」=意味が向こうに届いたかを聞く。英語は「意味が生成されたか」を聞く。伝達vs生成。コミュニケーション観が根本的に違う。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 10: 報告 (Reporting) -- INFORM
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 10, japanese: '終わったよ', english: [
        "done",
        "all done, just finished it up",
        "that's a wrap, everything's taken care of",
        "done. finito. complete. and it feels amazing. there's no better feeling than crossin' somethin' off your list. the check mark. the line-through. the 'I did the thing.' it's like a tiny graduation ceremony every time. no cap, no gown. just the satisfaction of done-ness. and now I'm gonna do absolutely nothin' for twenty minutes."
    ], context: "doneは「終わった」の一語完結。I'm doneは「俺は終わった」だけど、主語が人なのが面白い。日本語は「終わった」=作業が終わった。英語はI'm done=俺が完了した状態。作業じゃなくて自分が完了品になる。I'm done with this(もういい)は「この件における俺は完了」。自分を完成品として出荷するイメージ。" },

    { daySlot: 10, japanese: 'まだ途中', english: [
        "still working on it",
        "still workin' on it, not quite there yet",
        "it's a work in progress, I'm getting there though",
        "still workin' on it. and I know you want an ETA but the honest answer is 'I don't know.' it's one of those things where every time I think I'm done, another thing pops up. like whack-a-mole. I whack one problem, another one appears. I'm makin' progress but 'progress' and 'done' are different countries. I'm still in transit."
    ], context: "work in progressは「進行中」。略してWIP。英語は未完成の状態にちゃんと名前がある。日本語は「まだ途中」=中間地点にいる。英語はwork in progress=進行中の作品。未完成を「作品」と呼ぶのが面白い。完成品だけが作品じゃない。途中も作品。プロセスを肯定する文化。" },

    { daySlot: 10, japanese: '問題が起きた', english: [
        "we've got a problem",
        "heads up, we've got a problem here",
        "so something went wrong and I need to tell you about it before it gets worse",
        "we've got a problem. and I hate bein' the bearer of bad news but someone's gotta say it. and it's always me. I'm always the one who notices the problem. and then I become the problem because I pointed it out. kill the messenger. classic. but ignoring problems doesn't make them go away. it makes them bigger. like feeding a stray cat."
    ], context: "we've got a problemのweに注目。問題が起きたとき英語はweを使いがち。自分のミスでもweで共有する。my problem(俺の問題)よりwe have a problem(俺たちに問題がある)のほうが柔らかい。責任を分散させるテクニック。Houston, we have a problemはアポロ13の名言。危機を報告するときの英語はまずweで巻き込む。" },

    { daySlot: 10, japanese: 'うまくいった', english: [
        "it worked",
        "it worked! I can't believe it actually worked",
        "good news -- it worked out, everything went according to plan",
        "it worked! and honestly I'm as surprised as you are. I went in with maybe 60% confidence and somehow pulled it off. there's a version of this story where it goes horribly wrong and I'm in damage control mode. but not today. today the universe cooperated. which means tomorrow it's gonna overcompensate. but that's tomorrow's problem."
    ], context: "it workedは「うまくいった」。work=働くが「機能する」の意味で使われてる。Does this work?(これ機能する?)、It's not working(動かない)。英語はモノが「働く」。リモコンが「働かない」、計画が「働いた」。日本語は「うまくいった」で結果を言うけど、英語は「それが働いた」と機械みたいに言う。全部を労働者にする言語。" },

    { daySlot: 10, japanese: '予定通り', english: [
        "right on schedule",
        "everything's right on schedule, no surprises",
        "we're on track, everything's going exactly as planned",
        "right on schedule. which honestly feels suspicious. things NEVER go according to plan. plans are suggestions. they're hopes. they're wishes with a timeline attached. so when something actually goes on schedule, I don't trust it. I'm waitin' for the surprise. the plot twist. 'cause smooth sailin' always ends. the question is when."
    ], context: "on scheduleは「予定通り」。scheduleの上に乗ってるイメージ。on track(軌道上)も同じ。英語は予定を線路に見立てる。off track(脱線)、derailed(脱線した)。予定は電車で、計画通り=線路の上。日本語は「予定通り」=予定に「沿って」いる。英語は予定に「乗って」いる。沿うvs乗る。接触の仕方が違う。" },

    { daySlot: 10, japanese: '遅れてる', english: [
        "behind schedule",
        "we're behind schedule, it's takin' longer than expected",
        "I'm not gonna sugarcoat it, we're falling behind and need to catch up",
        "we're behind. and I could give you a bunch of excuses but the bottom line is: it's late. some things took longer than expected. 'expected' bein' the key word 'cause my expectations were delusional. I planned like a optimist and executed like a realist. the gap between those two is called 'delay.' and here we are."
    ], context: "behind scheduleは予定の「後ろ」にいる。fall behind(遅れる=落ちて後ろへ)、catch up(追いつく=捕まえて追いつく)。英語は遅れを追いかけっこで表現する。予定が先を走ってて、自分が後ろから追いかけてる。日本語は「遅れてる」で時間の遅延を言うだけ。英語は物理的な位置関係。予定が逃げてて自分が追いかけてる。" },

    { daySlot: 10, japanese: '一応報告', english: [
        "just a heads up",
        "just a heads up, nothing urgent though",
        "wanted to loop you in real quick, it's not a big deal but you should know",
        "just a heads up. and 'heads up' is weird if you think about it. I'm tellin' you to lift your head. like somethin's flyin' at you and you need to see it comin'. and that's exactly what this is. information incoming. duck or catch. your choice. but at least your head is up now and you can't say I didn't warn you."
    ], context: "heads upは「頭を上げろ」=注意。ボールが飛んでくるとき「頭上げて!」と叫ぶのが語源。今は「事前通告」の意味。give someone a heads up(事前に知らせる)。loop you inは「輪の中に入れる」=情報共有する。英語は情報共有を「輪に入れる」と言う。out of the loop=輪の外=情報が来てない。情報は輪で回る。" },

    { daySlot: 10, japanese: '結局こうなった', english: [
        "so basically what happened was",
        "so long story short, it ended up like this",
        "after everything, this is where we landed, not what I expected",
        "so basically what happened was -- and I'll spare you the drama -- it ended up like THIS. which is not what anyone planned. not plan A, not plan B, not even plan C. we're at plan D. the plan nobody wrote down because nobody thought we'd get here. but here we are. plan D. the accidental plan. the 'oops' plan."
    ], context: "ended upは「結局〜になった」。endは「終わる」だけど、ended upは「想定外の場所に着地した」ニュアンスがある。I ended up walking(結局歩くことになった)。意図してない結果。日本語は「結局こうなった」で結果を言うだけ。英語のended upは「上に着地した」。予想外の場所に不時着した感じ。人生は不時着の連続。" },

    { daySlot: 10, japanese: '大事なことがある', english: [
        "there's something you should know",
        "hey, there's somethin' you should know, can we talk?",
        "I need to tell you something important, and I probably should've said it sooner",
        "there's somethin' you should know. and the fact that I'm startin' with this sentence means it's either really good or really bad. there's no middle ground for 'there's something you should know.' it's either 'you won the lottery' or 'your car got towed.' brace yourself. or don't. bracin' never actually helps."
    ], context: "there's something you should knowは「知っておくべきことがある」。shouldが入ってるのがポイント。「知ったほうがいい」=知らないままだとマズい。must know(知らなきゃダメ)より少し柔らかいけど、十分深刻。英語は重要な報告の前にこういう前置きフレーズを入れる。I need to tell you(言わなきゃいけないことが)も同じ。宣告の儀式。" },

    { daySlot: 10, japanese: '先に言っておくと', english: [
        "just so you know",
        "just so you know, before we start",
        "I wanna get ahead of this -- before you hear it from someone else",
        "just so you know -- and I'm tellin' you now instead of later because later is worse. bad news ages like milk, not wine. the longer you wait, the worse it gets. so here it is. fresh. still warm. slightly unpleasant but at least it's current. you're welcome. and yes, I am the kind of person who rips off the band-aid. efficiency."
    ], context: "just so you knowは「一応言っとくけど」。soは「だから」じゃなくてso that(〜するために)の短縮。「あなたが知ってる状態にするために」=情報を先に渡しておく。get ahead of thisは「これの前に出る」=先手を打つ。英語は情報戦。先に言う=有利。後から知る=不利。情報にも鮮度がある。先出し=新鮮。後出し=腐る。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 11: 確認 (Confirming) -- INFORM
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 11, japanese: '合ってる？', english: [
        "am I right",
        "am I right or am I totally off here?",
        "is that correct? just wanna make sure I'm on the same page",
        "am I right? 'cause I'm sayin' this with confidence but my internal confidence meter is at like 55%. which is enough to say it out loud but not enough to bet money on it. I'm confident-ish. I'm in the gray zone between 'I think so' and 'I know so.' so just... confirm. please. so my brain can relax."
    ], context: "on the same pageは「同じページにいる」=認識が合ってる。英語は理解を本のページに見立てる。We're on the same page(同じ理解)、We're on different pages(認識がズレてる)。日本語は「合ってる?」で正誤を聞くけど、英語は「同じ場所にいるか?」と位置確認する。理解は地図。合ってる=同じ座標にいる。" },

    { daySlot: 11, japanese: 'もう一回言って', english: [
        "say that again",
        "can you say that again? I missed the last part",
        "sorry, one more time? my brain wasn't fully online for that one",
        "say that again? and slower this time. my brain has a processin' speed and you exceeded it. you were talkin' at 2x speed and my brain runs at 1x. maybe 0.8x on a bad day. today's a 0.8 day. so rewind. press play. at normal speed. and maybe pause between sentences so my brain can load each one. bufferin'. still bufferin'. OK go."
    ], context: "one more timeは「もう一回」。英語は回数をtime(時間)で数える。one time(1回)、two times(2回)、every time(毎回)。日本語は「回」で数える。英語は1回=1時間的な瞬間。timeを使うことで「時間の中の一点」を指す。回数と時間が同じ単語。Could you repeat that?(繰り返して)はフォーマル。Say that again?はカジュアル。" },

    { daySlot: 11, japanese: 'つまりこういうこと？', english: [
        "so you're saying",
        "so you're sayin' it's basically this, right?",
        "wait, let me make sure I got this -- you mean that, correct?",
        "so you're sayin'... and let me translate this into my brain's language... you're sayin' THIS? is that what you're sayin'? 'cause I wanna make sure I'm not hearin' what I WANT to hear. that happens. the brain edits incoming information to match expectations. my brain is an unreliable editor. so I'm fact-checkin'. with you. the source."
    ], context: "so you're sayingは相手の発言を自分の言葉で言い直す確認テクニック。英語はparaphrase(言い換え)文化が強い。Let me get this straight(整理させて)も同じ。straightは「まっすぐ」=情報をまっすぐに並べ直す。日本語は「つまり?」で短く確認できるけど、英語はso you're sayingと相手の発言を引用形式で返す。確認が丁寧。" },

    { daySlot: 11, japanese: '本当に？', english: [
        "for real",
        "for real? you're not messin' with me, right?",
        "are you being serious right now? 'cause I can't tell",
        "for real? FOR real? like, real real? 'cause there's 'for real' as in 'oh interesting' and there's 'FOR REAL' as in 'I need you to swear on something important that this is true.' and right now I need the second one. swear on somethin'. your phone. your coffee. whatever you value most. is. this. real."
    ], context: "for realは「マジで」の直訳に近い。でも英語はrealの強調で本気度を変える。really?(軽い驚き)→for real?(中程度)→are you serious?(強い)→are you kidding me?(最強)。日本語は「マジで?」のトーンで調整するけど、英語は単語を変えて段階を作る。疑いの表現にグラデーションがある。辞書を見ないと本気度がわからない。" },

    { daySlot: 11, japanese: '間違いない？', english: [
        "you sure about that",
        "you sure about that? like, a hundred percent?",
        "are you absolutely sure? 'cause we can't undo this once it's done",
        "you sure? like, SURE sure? 'cause there's different levels of sure. there's 'yeah I think so' sure. there's 'pretty sure' sure. and there's 'I would bet my life on it' sure. I need to know which one you are. 'cause the stakes here are non-trivial and I don't wanna base my next move on a 'pretty sure.' gimme a percentage."
    ], context: "sure about thatのabout thatは「それについて」。英語は確信にも方向がある。sure about(〜について確信)、sure of(〜を確信)。微妙に違う。aboutは「周辺」、ofは「直接」。I'm sure of it(それ自体を確信)はI'm sure about it(それに関して確信)より強い。日本語は「間違いない?」で確信全体を聞くけど、英語は前置詞で確信の角度を変える。" },

    { daySlot: 11, japanese: '念のため確認', english: [
        "just to be safe",
        "just to be safe, let me double-check that",
        "I'm probably overthinking this but let me confirm one more time",
        "just to be safe. and I know I'm bein' paranoid but paranoid people don't get surprised. they get validated. every time I DON'T double-check, something goes wrong. every time I DO double-check, everything's fine. so am I paranoid or am I just experienced? experience looks a lot like paranoia. the only difference is the track record."
    ], context: "just to be safeは「安全のために」=念のため。double-check(二重チェック)も定番。日本語は「念のため」で気持ちを伝えるけど、英語はto be safe(安全でいるために)と目的を明示する。英語は「なぜ確認するか」の理由を添える。念のため=safetyのため。確認は安全装置。チェックはシートベルト。締めないと事故る。" },

    { daySlot: 11, japanese: 'え、マジで？', english: [
        "wait, what",
        "wait, what? say that again, slowly",
        "hold on -- are you serious? that came outta nowhere",
        "wait WHAT? nah. nah nah nah. you can't just drop that casually. that's a bomb. you just detonated a bomb in the middle of a normal conversation and kept goin' like nothin' happened. no. stop. rewind. go back to the bomb part. explain. in detail. 'cause my brain just did a hard reboot and I need the context patch."
    ], context: "wait whatは2語で完璧な驚き表現。waitは「待て」=思考を一時停止させる。whatは「何?」=情報を要求する。この2語で「止まれ、今の何?」が完成する。日本語は「え、マジで?」と感嘆+確認。英語は「停止+質問」。驚きの処理方法が違う。日本語は驚きながら確認する。英語はまず停止してから質問する。" },

    { daySlot: 11, japanese: 'それで合ってるの？', english: [
        "is that right",
        "is that right? that doesn't sound right to me",
        "are you sure that's how it works? 'cause something feels off",
        "is that right? 'cause my gut is sayin' no but my gut has been wrong before. like, frequently. my gut has a terrible track record with facts. great with food though. 'should I eat this?' -- gut never fails. 'is this information correct?' -- gut is basically guessin'. so I'm askin' you instead. you're more reliable than my gut. probably."
    ], context: "something feels offは「何かが外れてる感じがする」。offは「ズレてる」。feel off(違和感がある)、look off(見た目がおかしい)、taste off(味が変)。英語は五感全部にoffを付けて「何か違う」と言える。日本語は「なんか変」で全部まとめるけど、英語はどの感覚で変なのかを指定する。違和感にも住所がある。" },

    { daySlot: 11, japanese: '聞き取れなかった', english: [
        "I didn't catch that",
        "sorry, I didn't catch that, it was too fast",
        "you're gonna have to repeat that, I completely missed it",
        "I didn't catch that. and catch is the right word 'cause listenin' is basically catchin'. words fly at you and you either catch 'em or you don't. and that one flew right past me. my glove was up but the ball went over it. my ears were open but the words were too fast. can you throw it again? softer this time. underhand."
    ], context: "catch thatは「それを捕まえた」=聞き取れた。英語はリスニングを野球のキャッチに見立てる。I caught that(聞き取れた)、I missed that(聞き逃した)。missも「外す」。言葉はボール、耳はグローブ。Did you catch that?(聞き取れた?)はcatch=捕球の感覚。聞くことは受動的じゃなくて能動的な「キャッチ」。耳は手。" },

    { daySlot: 11, japanese: '今なんて言った？', english: [
        "what was that",
        "I'm sorry, what was that? I totally spaced out",
        "my bad, I wasn't paying attention, what did you just say?",
        "what was that? and before you judge me -- I WAS listenin'. I was listenin' to the first part. and then my brain went on a field trip. it does that. it hears a word, associates it with somethin' else, follows that thought for thirty seconds, and by the time it comes back the conversation has moved on. my brain is a wanderer. it's not rude. it's adventurous."
    ], context: "spaced outは「宇宙に飛んだ」=ぼーっとしてた。space=宇宙。注意力が宇宙に飛んでいく。zoned outも同じ(zone=違うゾーンに行った)。英語はぼーっとすることを「別の場所に行く」と表現する。日本語は「ぼーっとしてた」で状態を言うけど、英語はspaced out=場所移動。注意は飛行物体。着陸しないと聞けない。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 12: 訂正 (Correcting) -- INFORM
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 12, japanese: '違う違う', english: [
        "no no no",
        "no no no, that's not it at all",
        "wait wait wait, you've got it all wrong, let me start over",
        "no no no. and the number of no's matters. one 'no' is a normal denial. two no's is emphasis. three no's is 'you are SO far from the right answer that I need to physically stop you before you go further.' three no's is an emergency brake. I'm pullin' it. the train of wrong information stops here."
    ], context: "noの連打は英語でも日本語でも焦りを表現する。でも英語はno no noのリズムで緊急度が上がる。日本語の「違う違う」も同じ。面白いのは英語では否定語を繰り返すと強くなること。普通は二重否定=肯定(not + not = yes)だけど、会話のno no noは否定×3で超否定。文法と感情は別回路で動いてる。" },

    { daySlot: 12, japanese: 'そうじゃなくて', english: [
        "that's not what I meant",
        "no, that's not what I meant, hear me out",
        "hold on, you're misunderstanding me, what I'm trying to say is this",
        "that's not what I meant. and this is partly my fault 'cause I said it wrong. but it's also partly YOUR fault 'cause you heard what you wanted to hear. we're both guilty. communication is a two-player game and we both fumbled. let me try again. same idea, different words. take two. action."
    ], context: "that's not what I meantは「そういう意味じゃない」。meantはmean(意味する)の過去形。英語は意図と表現のズレを認める文化がある。I meant to say(言いたかったのは)、That came out wrong(言い方が悪かった)。came out wrong=「間違って出てきた」。言葉が口から勝手に変な形で出てくるイメージ。口は工場。不良品も出る。" },

    { daySlot: 12, japanese: '正確に言うと', english: [
        "technically",
        "well technically, it's more like this",
        "if we're being precise here, the correct answer is actually this",
        "technically. and I know nobody likes the 'technically' guy. the 'technically' guy is the most annoying person at every party. but sometimes technical accuracy matters. sometimes the difference between 'roughly' and 'exactly' is the difference between success and disaster. so yeah. I'm bein' that guy. you're welcome. and I'm sorry. simultaneously."
    ], context: "technicallyは「厳密に言うと」。この一語で「今から細かいことを言う」の予告になる。well actuallyも近いけど、こっちはもっとウザい。Actually(実は)は相手を否定するニュアンスが強くて、英語圏ではactually guyは嫌われる。日本語の「正確に言うと」は中立的だけど、英語のactuallyは戦闘的。使い方注意。" },

    { daySlot: 12, japanese: 'ちょっと違うかな', english: [
        "not quite",
        "mmm, not quite, you're close though",
        "you're in the right ballpark but the details are a little off",
        "not quite. and 'not quite' is the nicest way to say 'wrong.' it's wrong with a ribbon on it. wrong with gift wrap. 'cause I could say 'no, that's wrong' but that's harsh. 'not quite' says 'you tried, you got close, you're a good person, but the answer is different.' it's a compliment sandwich with a correction filling."
    ], context: "right ballparkは「正しい球場の中にはいる」=大体合ってる。ballpark figure(ざっくりした数字)も同じ。英語は正確さを球場で表現する。球場の中=近い、球場の外=全然違う。in the right ballpark(大体OK)、not even in the same ballpark(全然違う)。日本語に球場比喩はないけど、「いい線いってる」は線の比喩。正解は点。近さは線と球場。" },

    { daySlot: 12, japanese: '逆だよ', english: [
        "other way around",
        "it's the other way around, you got it backwards",
        "actually it's the opposite -- A is B, not B is A",
        "other way around. you flipped it. A is B, not B is A. and I know they SOUND the same but they're not. it's like sayin' 'all dogs are animals' vs 'all animals are dogs.' one is true, one is chaos. direction matters. the arrow goes THIS way, not THAT way. you pointed the arrow backwards. let's rotate it. there."
    ], context: "other way aroundは「逆」。直訳は「もう一方の方法で回って」。around=回転。180度回す。backwards(後ろ向き)も「逆」。got it backwards(逆に理解した)。英語は間違いの方向を物理的に表現する。日本語の「逆だよ」はシンプルに方向反転。英語はaround(回転)かbackwards(後退)。間違いを「間違った方向に歩いてる」と見る。" },

    { daySlot: 12, japanese: '誤解してる', english: [
        "you've got it wrong",
        "I think you're misunderstandin' me here",
        "there's been a misunderstanding, that's not the situation at all",
        "you've got it wrong. and I don't blame you 'cause my explanation was probably garbage. but the version in your head and the version in my head are different movies. same title, different plot. we went to the same theater but watched different films. let me re-screen my version for you. popcorn not included."
    ], context: "misunderstandingは「誤解」。mis+understanding=間違った理解。英語はmis-を付けるだけで「間違いバージョン」が作れる。misread(読み間違い)、mishear(聞き間違い)、misjudge(判断間違い)。日本語は「誤解」「誤読」「聞き間違い」と漢字を変えるけど、英語はmis-一個で全部処理。接頭辞の効率がすごい。レゴブロック式。" },

    { daySlot: 12, japanese: '言い方が悪かった', english: [
        "that came out wrong",
        "sorry, that came out wrong, lemme rephrase",
        "OK that's not how I wanted to say it, let me try again",
        "that came out wrong. and it's weird 'cause in my head it sounded fine. my brain approved it. my mouth delivered it. and somewhere between brain and mouth, the package got damaged. the intent was good. the delivery was bad. it's not what I said, it's how I said it. same ingredients, bad recipe. let me cook it again. differently."
    ], context: "that came out wrongは「変な言い方になっちゃった」。came outは「出てきた」。言葉が口から出てくるときに変形したイメージ。英語は発言を「出産」的に扱う。言葉が口から生まれてくる。came out wrong=奇形で出てきた。rephraseは「再フレーズ化」=同じ意味を別の形で再出産する。言葉は毎回新しく生まれる一回性のもの。" },

    { daySlot: 12, japanese: '補足すると', english: [
        "and to add to that",
        "and just to add to that, there's one more thing",
        "one more thing I should mention -- I left out an important detail",
        "and to add to that -- 'cause I realize I left somethin' out and the picture's not complete without it. it's like givin' someone a puzzle with a missin' piece. the image makes sense but there's a hole. this is the hole-filler. the missing piece. the thing I should've said first but didn't 'cause my brain doesn't prioritize correctly. ever."
    ], context: "add to thatは「それに追加する」。情報を積み上げるイメージ。left outは「外に置いてきた」=言い忘れた。英語は情報を物として扱う。add(足す)、leave out(外に置く)、fill in(中を埋める)。情報は建築材料。足りないと建物が不完全。fill you inは「あなたの中を情報で埋める」。人は情報の容器。空っぽだと補充が必要。" },

    { daySlot: 12, japanese: 'そういう意味じゃない', english: [
        "that's not what I'm saying",
        "no, that's not what I'm sayin' at all",
        "you're taking it the wrong way, I didn't mean it like that",
        "that's not what I'm sayin'. and I can see how you got there. the path from what I said to what you heard makes sense. but you took a wrong turn somewhere. probably at the word 'but.' 'but' is a dangerous word. everything before 'but' gets erased. 'you're great BUT...' -- nobody hears the 'great.' they only hear what's after 'but.' but is a trapdoor."
    ], context: "taking it the wrong wayは「間違った方向に受け取ってる」。takeは「取る」。英語は発言を「受け取る物」として扱う。take it personally(個人的に受け取る)、take it seriously(真剣に受け取る)。受け取り方=takeの方向。日本語は「そういう意味じゃない」で意味の否定。英語はtakeの方向修正。同じ荷物を違う向きで持ち直すイメージ。" },

    { daySlot: 12, japanese: '訂正させて', english: [
        "let me correct myself",
        "actually, let me take that back and rephrase",
        "wait, scratch that, what I should've said was this",
        "let me correct myself. 'cause I just heard what I said and it was wrong. and the best thing about talkin' is you can ctrl+Z in real time. scratch that means 'delete the last thing.' take that back means 'I want a refund on that sentence.' and rephrase means 'same product, better packaging.' language has an undo button. and I'm pressin' it."
    ], context: "scratch thatは「今の取り消して」。scratchは「引っ掻く」=書いたものを引っ掻いて消すイメージ。take it backは「取り戻す」=言葉を回収する。英語は発言を「物」として扱うから、回収(take back)も消去(scratch)もできる。日本語は「訂正させて」=正しく直す。英語は「消す」か「回収する」。修正じゃなくて削除してやり直し。ctrl+Z思考。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 13: 頼む (Requesting) -- INFLUENCE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 13, japanese: 'ちょっといい？', english: [
        "got a sec",
        "hey, got a sec? it's quick, I promise",
        "do you have a minute? I need to talk to you about something",
        "got a sec? and I know I always say 'it's quick' and it never is, but this time it actually is. probably. OK I can't guarantee it but my INTENTION is quick. the execution might vary. but the intent is there and that's what counts. right? right. so, got a sec?"
    ], context: "Got a sec?は Do you have a second?の超圧縮版。Do you、have、aが全部消えてgot a secだけ残る。英語のカジュアルは引き算。部品を削って削って骨だけにする。Got a sec?→Got a minute?→Do you have a moment?→Would you happen to have a moment? 丁寧になるほど長くなる。礼儀=文字数。" },

    { daySlot: 13, japanese: 'お願いがあるんだけど', english: [
        "I need a favor",
        "hey, I need a favor, and feel free to say no",
        "so I have kind of a big ask, and you can totally say no",
        "I need a favor. and before you hear what it is, I want you to know that 'no' is a perfectly acceptable answer. I'm givin' you the exit before the entrance. that's how you know it's a real favor and not a guilt trip. a guilt trip doesn't give you the option. I'm givin' you the option. ...but please say yes."
    ], context: "favor=お願い。でもI need a favorの後に必ずand you can say no(断っていいからね)が来る。日本語の「お願いがあるんだけど」はクッションが「んだけど」に内蔵されてる。英語は「断れるよ」と明示的に言わないと圧迫になる。自由意志を口で保証する文化。空気で察してはダメ。" },

    { daySlot: 13, japanese: '手伝ってくれない？', english: [
        "can you help me",
        "can you help me out with this? I'm stuck",
        "I could really use a hand here, do you mind?",
        "can you help me out? and I hate askin' for help 'cause it makes me feel like I should be able to do this myself. but I can't. I tried. I failed. I tried again. failed again. and at some point you gotta accept that askin' for help isn't weakness. it's efficiency. I'm being efficient. that's my story."
    ], context: "help me outのoutに注目。help meだけでも通じるのに、なぜoutを足す? outは「完了」のニュアンスを加える。help me=助けて、help me out=助けて完了させて。figureもfigure out(解決する)、work out(うまくいく)。英語のoutは「最後まで到達」の旗。未完了を完了にする魔法のout。" },

    { daySlot: 13, japanese: '急いでもらえる？', english: [
        "can you hurry",
        "any chance you can speed it up a little?",
        "I don't wanna rush you but we're kinda running out of time",
        "can you speed it up? and I know nobody likes bein' rushed. I don't like bein' rushed. but time is a thing that exists and it's runnin' out. and I'm not tryin' to be that person but someone's gotta be that person and apparently today it's me. I'll buy you coffee later as an apology. deal? deal."
    ], context: "「急いで」を英語で言うとHurry up、Speed it up、Can you pick up the pace?とバリエーションがある。面白いのはhurry upのup。upは「完了・上昇」を足す。速度を「上げる」イメージ。eat up(食べきる)、clean up(片付け切る)、hurry up(急ぎ切る)。upは英語の「もっと!」ボタン。" },

    { daySlot: 13, japanese: '代わりにやってくれる？', english: [
        "can you cover for me",
        "can you cover for me? I'll owe you one",
        "would you mind taking over? something came up and I gotta go",
        "can you cover for me? and I'll owe you one. actually, I already owe you like three. but who's countin'? you are? OK fair. but this is the last one. I promise. and I know my promises have a sketchy track record but THIS one I mean. for real this time. probably."
    ], context: "cover for meは「代わりをする」。カバー=覆う=代わりに自分の上に被さるイメージ。I'll owe you one(一つ借りができる)はセットでよく使う。面白いのは英語が恩をone(1個)と数えること。2回助けてもらったらI owe you two。恩を数値化する。貸し借りの帳簿をつける言語。商売人だなあ。" },

    { daySlot: 13, japanese: 'これ見てもらっていい？', english: [
        "can you take a look",
        "can you take a look at this when you get a chance?",
        "would you mind looking this over? I wanna get a second opinion",
        "can you take a look? and be honest. don't do that thing where you say 'it's good' but your face says 'this is terrible.' I can handle the truth. I think. actually, be gentle. but honest. gently honest. is that a thing? it should be a thing."
    ], context: "take a look(見る)は直訳すると「一つの視線を取る」。look(見る行為)をtake(取る)する。英語は動作を「取る」で始めるのが好き。take a break(休憩を取る)、take a shower(シャワーを取る)、take a chance(チャンスを取る)。全部「能動的に手を伸ばして掴む」イメージ。英語は受動的に何かが起きるのが嫌い。" },

    { daySlot: 13, japanese: 'ここだけの話にして', english: [
        "keep it between us",
        "keep this between us, OK? don't tell anyone",
        "I'm telling you this in confidence, so please don't spread it around",
        "keep this between us. and I mean actually between us. not 'between us plus your best friend.' and not 'between us but I'll vaguely reference it later.' between US. two people. a sealed envelope. if I hear this come back to me from someone else, I'll know. I always know."
    ], context: "between usは「私たちの間に」。秘密を2人の間に物理的に置くイメージ。英語は秘密を空間的に扱う。keep it under wraps(包みの下に保管)、don't let it out(外に出すな)。秘密は「中にあるもの」で、バレる=leak(漏れる)。まるで液体。英語の秘密は水漏れ事故。" },

    { daySlot: 13, japanese: '先に行ってて', english: [
        "go ahead",
        "go ahead, I'll catch up in a sec",
        "go on without me, I'll be right behind you",
        "go ahead. I'll catch up. and if I don't catch up, just... keep goin'. don't wait. I might get distracted. I might stop to look at somethin'. I might forget where we were goin'. these are all realistic possibilities. just text me the location and I'll find my way. eventually. probably. maybe."
    ], context: "go aheadは「先に行って」だけじゃない。Go ahead(どうぞ)は許可にもなる。ドアの前で「どうぞ先に」、会議で「どうぞ話して」、注文で「どうぞ先に」。全部go ahead。日本語の「どうぞ」と「先に行って」が1つの表現に合体してる。aheadは「前方に」=物理的な先行が、抽象的な許可に進化してる。" },

    { daySlot: 13, japanese: '静かにして', english: [
        "keep it down",
        "hey, keep it down a little, please?",
        "do you mind keeping it down? I'm trying to focus here",
        "keep it down. and I'm not tryin' to be the noise police but I literally cannot hear my own thoughts right now. and my thoughts are important. well, some of them. most of them are garbage but occasionally there's a good one in there and I don't wanna miss it 'cause of background noise."
    ], context: "keep it downのdownは音量を「下げる」。英語は音量を上下で表現する。turn it up(音上げて)、keep it down(音下げて)、volume's too loud(音量が大きすぎ)。loudは「大きい」じゃなくて元は「うるさい」。日本語は「静かにして」=静かさを要求する。英語はkeep it down=今の音量を下の位置に保持しろ。指示が具体的。" },

    { daySlot: 13, japanese: 'それ後にしてくれない？', english: [
        "can it wait",
        "can that wait? I'm kinda in the middle of somethin'",
        "not right now, can we do this later? I'm swamped",
        "can it wait? 'cause I'm in the middle of somethin' and if I stop now I'm gonna lose my flow and it'll take me 20 minutes to get back into it. and I know your thing is important too but my brain can only do one thing at a time. I'm not a computer. well, I am. but a slow one. with bad RAM."
    ], context: "Can it wait?は「それ待てる?」。itに注目。「それ」は用件のことだけど、用件を物みたいに扱って「お前は待てるか?」と聞いてる。英語は抽象的なことにitを使って物扱いする。Let's call it a day(今日はこれで終わりにしよう)もitが「状況」を指す。便利だけど、何を指してるか毎回推理が必要。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 14: 提案 (Suggesting) -- INFLUENCE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 14, japanese: 'こうしたら？', english: [
        "how about this",
        "how about this -- hear me out for a sec",
        "what if we tried it this way? just throwing it out there",
        "how about this. and before you say no, just hear me out. I know my ideas have a mixed track record. some were genius. some were... learning experiences. but THIS one? this one's got potential. I can feel it. and yeah, I say that every time. but a broken clock is right twice a day and I'm due."
    ], context: "how about~?は提案の王道。日本語の「こうしたら?」は動作ベース(する+たら)だけど、英語はhow about=「これについてどう思う?」と相手の感想を聞いてる。提案なのに質問形式。命令じゃなくて「どう?」って聞くのが英語の提案マナー。押し付けない。メニューを差し出す感覚。" },

    { daySlot: 14, japanese: 'こういうのどう？', english: [
        "what do you think about",
        "what do you think about somethin' like this?",
        "I had an idea -- tell me if this sounds crazy",
        "what do you think about this? and I'm genuinely askin'. I'm not one of those people who asks for opinions and then gets mad when the opinion is different from mine. OK, I might pout a little. but I won't get MAD. there's a difference. pouting is healthy. anger is not. I'm emotionally mature. mostly."
    ], context: "What do you think?は「どう思う?」。提案してるのに、文の中心は相手の思考(think)。英語の提案は「俺はこう思うけど、お前はどう?」が基本構造。日本語は「こういうのどう?」で物を差し出す。英語は脳みそに質問する。物じゃなくて思考にアクセスしに行く。提案=思考の共有依頼。" },

    { daySlot: 14, japanese: '一つ提案があるんだけど', english: [
        "I have a suggestion",
        "so I have an idea, and it might be stupid, but hear me out",
        "I wanna run something by you -- feel free to shoot it down",
        "I have a suggestion. and I'm prefacin' it with 'it might be stupid' so if you hate it, I already gave myself an exit. that's strategy. you pre-disown your idea so rejection doesn't hurt. 'it might be dumb BUT...' -- the BUT is where the real idea lives. everything before it is emotional insurance."
    ], context: "run something by youは「ちょっと聞いてもらいたい」。run by=走らせて通過させる。アイデアを相手の前を走らせて反応を見る、というイメージ。shoot it down(撃ち落としていいよ)も面白い。アイデアは飛行物体で、ダメなら撃墜していいと。英語は提案を軍事演習みたいに扱う。発射→飛行→承認or撃墜。" },

    { daySlot: 14, japanese: 'こっちの方がよくない？', english: [
        "isn't this better",
        "isn't this way better? like, obviously?",
        "I feel like this one makes more sense, don't you think?",
        "isn't this better? and I'm askin' it as a question but we both know it's not really a question. it's a statement with a question mark. the question mark is decorative. I already decided this is better. but I'm givin' you the illusion of choice 'cause that's what polite people do. democracy theater."
    ], context: "isn't this better?は否定疑問文。「こっちのほうが良くない?」。でもこれ、同意を求めてる。betterは比較級だから「今のより良い」が前提に入ってる。質問してるけど答えはもう決まってる。英語の否定疑問文は「俺はYesだと思ってるけど、お前もそうだよね?」という圧。丁寧に見えて実は誘導。" },

    { daySlot: 14, japanese: '試しにやってみたら？', english: [
        "why not give it a shot",
        "just give it a shot, what's the worst that can happen?",
        "why don't you try it? if it doesn't work, no big deal",
        "give it a shot. and I know 'give it a shot' sounds like I'm askin' you to fire a gun but it just means try it. English has SO many 'try' expressions that come from violence. take a stab at it. give it a crack. have a go at it. what is wrong with this language? every attempt is an act of aggression. try=attack, apparently."
    ], context: "give it a shotは「やってみなよ」。shotは「弾丸」。take a stab(刺してみる)、give it a crack(割ってみる)も同じ「試す」の意味。英語は「試す」を暴力的な動詞で表現する。日本語は「やってみる」と中立的。英語は挑戦=攻撃のメタファー。「安全に試す」という概念が言語に組み込まれてない。全部体当たり。" },

    { daySlot: 14, japanese: '俺だったらこうする', english: [
        "if it were me",
        "if it were me, I'd do it differently, but that's just me",
        "personally? I'd go a different route, but hey, it's your call",
        "if it were me -- and it's NOT me, so take this with a grain of salt -- I'd do it this way. but I'm also the guy who thought investing in a food truck was a good idea so maybe don't listen to me. my track record is... educational. I've learned a lot from my mistakes. mainly that I make a lot of them."
    ], context: "if it were meの wereに注目。I wasじゃなくてI were。仮定法。「実際には俺じゃないけど、もし俺だったら」という非現実の話だとwereになる。日本語は「俺だったら」で「たら」1個。英語は動詞の形を変えて「これは現実じゃないですよ」と文法レベルで宣言する。時制で現実と妄想を区別する。律儀。" },

    { daySlot: 14, japanese: '別の方法もあるよ', english: [
        "there's another way",
        "there's another way to look at it, actually",
        "have you considered doing it a different way? might be easier",
        "there's another way. and I'm not sayin' your way is wrong. your way is... a way. it's A way. but there are other ways. multiple ways. a buffet of ways. and maybe one of those other ways is slightly less painful. I'm not judgin' your choice. I'm just... expanding the menu. options are good. options are freedom."
    ], context: "there's another wayは「別の方法がある」。英語はthere is/areで存在を宣言する。日本語は「あるよ」で「ある」だけ。英語はthere(そこに)+is(ある)と場所を指定する。何もない空間にthere isで何かを出現させる。提案の前にまず「選択肢が存在する」と宣言する手順。英語は存在証明から始める。" },

    { daySlot: 14, japanese: 'いっそのこと', english: [
        "might as well",
        "at this point, might as well just go all in",
        "you know what, screw it -- let's just go big or go home",
        "might as well. and 'might as well' is the language of surrender. you've tried the careful route. it didn't work. now you're like 'you know what? forget the plan. let's just DO the thing.' it's giving up on caution and embracing chaos. 'might as well' is the moment you stop overthinking and start over-doing."
    ], context: "might as wellは「いっそ」「どうせなら」。直訳すると「同じくらいの可能性で」。やってもやらなくても同じなら、やっちゃえ、というニュアンス。日本語の「いっそのこと」に近い諦めと開き直りが入ってる。go big or go home(でかくやるか帰るか)も同じ精神。中途半端が一番ダメ、と。英語は極端を好む。" },

    { daySlot: 14, japanese: '考えてみて', english: [
        "think about it",
        "just think about it, no pressure",
        "sleep on it, you don't have to decide right now",
        "think about it. and I mean actually think about it. not that fake thinkin' where you've already decided but you pretend to consider it for two seconds. real thinkin'. overnight thinkin'. sleep on it. and 'sleep on it' is genius English 'cause it literally means put the problem under your pillow and let your brain work on it while you sleep. subconscious overtime."
    ], context: "sleep on itは「一晩寝かせて考えて」。枕の上で寝る=寝てる間に脳が処理する。日本語にはこの表現がない。「一晩考えて」はあるけど「寝て考える」とは言わない。英語は睡眠を意思決定ツールとして使う。寝ることが考えることの一部。怠惰に見えて実は脳科学的に正しい。寝るのも仕事。" },

    { daySlot: 14, japanese: 'とりあえずやってみよう', english: [
        "let's just try it",
        "let's just try it and see what happens",
        "you know what, let's just wing it, we'll figure it out as we go",
        "let's just try it. and 'let's just' is the official start of every impulsive decision. nobody says 'let's just' before somethin' responsible. it's always 'let's just wing it' or 'let's just see what happens.' the 'just' is doin' all the heavy liftin'. it shrinks the risk. makes it sound casual. 'we're not committin', we're just tryin'.' the just is emotional bubble wrap."
    ], context: "wing itは「ぶっつけ本番でやる」。wingは翼。飛びながら翼を作るイメージ。日本語の「とりあえず」に近いけど、wing itのほうがもっと無計画。「台本なし、準備なし、気合いだけ」。figure it out as we go(やりながら考える)も同じ精神。英語は計画より行動を先にする表現が多い。Ready, fire, aimの文化。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 15: 説得 (Persuading) -- INFLUENCE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 15, japanese: '絶対こっちがいい', english: [
        "this one's way better",
        "trust me, this one's way better, not even close",
        "I'm telling you, this is the move -- you won't regret it",
        "this one's way better. and I don't say that lightly. I've done the research. I've compared. I've agonized. and the verdict is in. this one. end of discussion. and yeah I sound intense but that's because I AM intense about this. some things matter. this is one of those things. I will die on this hill. it's a good hill."
    ], context: "way betterのwayは「ずっと」「はるかに」。道(way)が強調副詞になってる。way better、way more、way too much。距離の「遠さ」が程度の「大きさ」に変換されてる。日本語は「絶対」で確信度を上げるけど、英語はwayで差の距離を広げる。説得のコツは「差がでかい」と見せること。wayはその武器。" },

    { daySlot: 15, japanese: '考えてみてよ', english: [
        "just think about it",
        "just think about it for a second, it makes total sense",
        "hear me out -- once you see it from this angle, it clicks",
        "just think about it. really think about it. not surface-level thinkin'. deep thinkin'. and I know I'm bein' pushy but that's because I genuinely believe this is the right call and I want you to arrive at the same conclusion on your own. I'm not tellin' you what to think. I'm tellin' you to think. there's a difference. a subtle one. but it's there."
    ], context: "hear me outは「最後まで聞いて」。outがまた出てきた。hear me=聞いて、hear me out=最後まで聞いて。outは「完了まで」の旗。説得のときに必ず出る表現。途中で遮られたくないから「outまで聞いて」と予防線を張る。英語の説得は「完了まで聞く権利をまず確保する」ところから始まる。発言権の予約。" },

    { daySlot: 15, japanese: '俺を信じて', english: [
        "trust me",
        "trust me on this one, I've been through it",
        "I know it sounds crazy but trust me, I've seen this play out before",
        "trust me. and I know 'trust me' is the least trustworthy thing a person can say. it's right up there with 'I'm not lying' and 'this won't hurt.' but I'm sayin' it anyway 'cause I don't know how else to convince you. my evidence is vibes. my data is gut feeling. that's all I got. trust the gut. the gut knows."
    ], context: "trust meは説得の最終兵器だけど、逆効果になることも多い。「信じて」と言うほど怪しく聞こえる。英語では「trust meと言う人を信じるな」がジョーク定番。日本語の「信じて」も同じだけど、英語のtrust meのほうが胡散臭さが強い。信頼は口で要求するものじゃなくて態度で示すもの、という文化の裏返し。" },

    { daySlot: 15, japanese: '理由を聞いて', english: [
        "let me explain why",
        "OK let me explain why, 'cause there's a legit reason",
        "before you decide, at least let me walk you through my reasoning",
        "let me explain why. and I know 'let me explain' sounds like I'm about to give a TED talk but I'm not. it's short. three points. boom boom boom. and then you can decide. but at least you'll be decidin' with information instead of just vibes. informed decisions. that's all I'm askin' for. give my logic a chance."
    ], context: "walk you throughは「順を追って説明する」。歩いて通り抜ける=一緒に道を歩く。英語の説明は「同じ道を一緒に歩くこと」。日本語は「説明する」と一方的だけど、英語はwalk THROUGH=通過させる。出口まで連れていく。理解=目的地に到着すること。説得は旅行ガイド。道案内をして、相手を結論まで連れていく。" },

    { daySlot: 15, japanese: 'こう考えたらどう？', english: [
        "look at it this way",
        "look at it this way -- it's actually a win-win",
        "try looking at it from a different angle, it changes everything",
        "look at it this way. and 'this way' means MY way, obviously. I'm rearranging the furniture in your brain so the room looks better from where I'm standin'. that's what persuasion IS. it's interior design for someone else's thoughts. you're not changin' the facts. you're changin' the lighting. same room, different vibe. perspective is everything."
    ], context: "look at it this wayは「こう見てみて」。wayは「方向」。視点を変えさせる表現。from a different angle(別の角度から)も同じ。英語は理解=視覚。I see(わかった=見えた)、I don't see your point(言いたいことが見えない)。日本語は「わかる」=分かる=分ける。英語は「見える」=理解。視覚優先の言語。" },

    { daySlot: 15, japanese: 'データ見てよ', english: [
        "look at the numbers",
        "look at the numbers, they don't lie",
        "just look at the data for a second -- the numbers speak for themselves",
        "look at the numbers. 'cause numbers don't have opinions. numbers don't have bad days. numbers just sit there bein' numbers. and right now the numbers are sayin' exactly what I'm sayin'. so you can argue with ME all you want but are you really gonna argue with math? math doesn't care about your feelings. math is cold. math is reliable. be like math."
    ], context: "the numbers speak for themselvesは「数字が自分で語ってる」。英語はデータを擬人化する。数字が「喋る」。the data shows(データが見せる)、the evidence suggests(証拠が提案する)。データに人格を与えることで、「俺が言ってるんじゃない、データが言ってる」と責任転嫁できる。説得の技術。主語をデータにすり替える。" },

    { daySlot: 15, japanese: 'リスクないよ', english: [
        "there's no downside",
        "there's literally no downside, what do you have to lose?",
        "worst case scenario, you're right back where you started -- zero risk",
        "there's no downside. zero. none. and I've looked. I've actively searched for downsides like a detective and came up empty. and 'what do you have to lose?' is the most persuasive question in English 'cause it reframes the whole thing. you stop thinkin' about what could go wrong and start thinkin' about what you're missin'. loss aversion. works every time."
    ], context: "what do you have to lose?は「失うものある?」。これ最強の説得フレーズ。人間はgain(得る)よりloss(失う)に敏感。だから「失うものないよ」と言われると動きやすい。行動経済学でいうloss aversion(損失回避)を逆手に取ってる。英語の説得は心理学が文法に染み込んでる。downsideも「下側」=リスクは下にある。" },

    { daySlot: 15, japanese: '損はないでしょ', english: [
        "you can't go wrong",
        "you can't go wrong with this, it's a no-brainer",
        "either way you win -- there's literally no way to lose here",
        "you can't go wrong. and a no-brainer means you don't even need to think. your brain can take a nap. the answer is that obvious. and I love that English has a word for 'so easy your brain is unnecessary.' Japanese doesn't really have that. 考えるまでもない is close but no-brainer is more brutal. your brain? not needed. sit down, brain."
    ], context: "no-brainerは「考えるまでもない」。脳みそ不要=brainがno。この表現のすごさは、相手の思考を止めさせること。「考えなくていい」=「俺の提案に従え」を上品に言ってる。説得の究極形。相手の脳の電源を切りに行く表現。you can't go wrongも「間違えようがない」=ミスの可能性を消す。退路を塞ぐ言語。" },

    { daySlot: 15, japanese: '一回だけ試してみて', english: [
        "just try it once",
        "just try it once, that's all I'm askin'",
        "one time -- give it one shot and if you hate it, I'll never bring it up again",
        "just try it once. ONE time. that's all I'm askin'. and if you hate it, I'll never mention it again. I'll delete it from my vocabulary. it'll be like it never existed. but if you LIKE it? then I get to say 'I told you so.' and honestly, that's my main motivation here. not your happiness. the 'I told you so.' I'm petty like that."
    ], context: "I'll never bring it up againの bring upは「話題に出す」。upが「表面に持ち上げる」。話題は地面の下にあって、bring upで掘り起こす。I told you soは「だから言ったじゃん」で説得が成功した後の勝利宣言。英語は「正しかった自分」を祝う文化がある。日本語だと「ほらね」くらいで控えめだけど、英語のI told you soは堂々としてる。" },

    { daySlot: 15, japanese: '後悔するよ', english: [
        "you'll regret it",
        "you're gonna regret not doing this, mark my words",
        "five years from now you're gonna look back and wish you'd done it",
        "you're gonna regret it. and I know that sounds like a threat but it's a prophecy. future you is gonna look back at present you and go 'why didn't I listen?' and present you can prevent that. you have the power to save future you from disappointment. this is a time travel opportunity. don't waste it. future you is countin' on you."
    ], context: "mark my wordsは「俺の言葉を覚えとけ」。mark=印をつける。英語は言葉に印をつけて記録する。「後で答え合わせするからな」という宣言。日本語の「後悔するよ」は未来の感情を予告するけど、mark my wordsは「俺の予言を記録しろ」と証拠を残させる。説得が脅しに変わる瞬間。預言者モード。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 16: 交渉 (Negotiating) -- INFLUENCE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 16, japanese: 'じゃあ間を取って', english: [
        "let's meet in the middle",
        "OK let's meet in the middle, fair's fair",
        "how about we split the difference? that way nobody loses",
        "let's meet in the middle. and 'the middle' in negotiation is never actually the middle. it's wherever the better negotiator plants the flag. the real middle is a myth. it's like the equator -- technically exists but nobody lives there. you pick your middle, I pick mine, and we argue until one of us gets tired. that's compromise."
    ], context: "meet in the middleは「中間で会う」。交渉を道に見立てて、お互いが歩み寄って真ん中で出会う。split the difference(差額を割る)も数学的。英語の交渉用語は全部「距離」と「計算」。日本語の「間を取る」も空間的だけど、英語のmeet in the middleは「お互いが同じ距離だけ歩く」公平さが入ってる。対等の交渉=同じ歩数。" },

    { daySlot: 16, japanese: 'それは厳しい', english: [
        "that's a tough one",
        "yeah, that's a tough sell, I'm not gonna lie",
        "I hear you, but that's gonna be a hard sell on my end",
        "that's a tough one. and 'tough' is the polite way of sayin' 'no' without actually sayin' 'no.' English has a whole category of soft rejections. 'that's tricky.' 'that's challenging.' 'that's ambitious.' they all mean the same thing: no. but wrapped in bubble wrap. a padded no. the Japanese version is もちろん厳しい but English dresses up the rejection in a blazer."
    ], context: "a tough sellは「売り込みが難しい」。sellは「売る」。交渉=販売。英語では提案はすべて「売り物」で、受け入れてもらう=「売れる」。a hard sell(押し売り)、an easy sell(すぐ売れる)。I'm not buying it(信じない=買わない)。英語の交渉は全部商取引のメタファー。提案は商品。拒否は「買わない」。市場経済の言語。" },

    { daySlot: 16, japanese: 'もうちょっとなんとかならない？', english: [
        "can you do any better",
        "can you do a little better than that? come on",
        "is there any wiggle room here? I feel like we can work something out",
        "can you do any better? and 'any better' is classic negotiation. you don't say HOW MUCH better. you leave it open. let them decide how much to move. if you say 'can you do 10% better' you've capped yourself. 'any better' is uncapped. it's a blank check for improvement. vague on purpose. negotiation 101: never be the first to name a number."
    ], context: "wiggle roomは「交渉の余地」。wiggle=もぞもぞ動く。交渉のスペースを「もぞもぞ動ける部屋」と呼ぶ。日本語の「なんとかならない?」は漠然としてるけど、wiggle roomは物理的な空間。動ける隙間があるかないか。英語は交渉を建築みたいに扱う。room(部屋)がある=動ける。ない=壁に挟まれてる。" },

    { daySlot: 16, japanese: '条件次第', english: [
        "depends on the terms",
        "depends on the terms -- whatcha got?",
        "I'm open to it, but it depends on what you're offering",
        "depends on the terms. and 'depends' is the most diplomatic word in English. it's not yes. it's not no. it's 'convince me.' it keeps the door open without walkin' through it. you're standin' in the doorway. one foot in, one foot out. maximum flexibility. 'depends' is the Switzerland of conversation. neutral but strategic."
    ], context: "it dependsは「場合による」。dependは「ぶら下がる」が語源。条件にぶら下がってる=条件次第で揺れる。交渉でdependsと言うと、「俺はまだ決めてないけど、お前次第で動くよ」というシグナル。ボールを相手に投げてる。日本語の「条件次第」は条件を主語にするけど、英語のit dependsは状況全体を主語にする。もっと曖昧。" },

    { daySlot: 16, japanese: '落とし所は？', english: [
        "where do we land",
        "so where do we land on this? what works for both of us?",
        "what's the sweet spot here? there's gotta be something that works for everyone",
        "where do we land on this? 'cause we've been circlin' for a while. back and forth. back and forth. we're like planes in a holding pattern waitin' for clearance. at some point someone's gotta land the plane. let's be that someone. let's pick a runway and commit. I'm runnin' low on fuel. metaphorically. also literally. I skipped lunch."
    ], context: "sweet spotは「ちょうどいいところ」。甘い場所=最適点。テニスのラケットの芯もsweet spot。英語は交渉の妥協点を「甘い場所」と呼ぶ。お互いが「これなら甘い」と思えるポイント。日本語の「落とし所」は落とす=着地させるイメージ。英語は甘さ。日本語は重力。交渉のゴールの描き方が真逆。" },

    { daySlot: 16, japanese: '半分ずつ', english: [
        "let's go halves",
        "let's go halves, fifty-fifty, straight down the middle",
        "how about we split it evenly? each of us takes half",
        "let's go halves. fifty-fifty. clean split. no drama. and going halves is the laziest form of negotiation 'cause nobody has to think. just divide by two. done. it's mathematically fair but emotionally? sometimes fifty-fifty doesn't FEEL fair 'cause one person wanted it more. but math doesn't care about feelings. math splits and moves on."
    ], context: "go halvesは「折半する」。halvesはhalfの複数形。英語は「半分たちに行く」と複数形で言う。fifty-fiftyは数字で公平さを可視化する。日本語の「半分ずつ」は配分の説明だけど、英語のfifty-fiftyは「両方が同じ数字を持ってる」とパーセンテージで証明する。公平さを数値化する言語。感情じゃなくて算数で解決する。" },

    { daySlot: 16, japanese: '一歩譲るから', english: [
        "I'll give on this one",
        "OK I'll give on this one, but I need you to budge too",
        "I'm willing to bend here, but I need something in return",
        "I'll give on this one. but. BUT. I need you to give too. 'cause that's how this works. I bend, you bend. it's yoga for two. and if I'm the only one bendin' I'm just doin' solo yoga and that's not negotiation, that's submission. give and take. emphasis on the TAKE. I gave. now take your turn. your turn to give. do the thing."
    ], context: "give on thisの giveは「譲る」。take(取る)の反対。give and take(譲り合い)は交渉の基本ルール。budge(少し動く)も面白い。動かない人に「ちょっとだけ動いて」とお願いする。英語は交渉を物理的な運動として扱う。bend(曲がる)、budge(動く)、flex(柔軟に対応する)。全部身体の動き。交渉はストレッチ。" },

    { daySlot: 16, japanese: 'ギリギリだけどOK', english: [
        "I can live with that",
        "it's tight, but I can live with that",
        "it's not ideal, but I can work with it -- you got a deal",
        "I can live with that. and 'I can live with that' is the most backhanded agreement in English. it means 'I don't love it. I don't even like it. but it won't kill me.' it's acceptance without enthusiasm. the minimum viable yes. and in negotiation, that's actually a win. if both sides say 'I can live with that,' you've hit the perfect compromise. mutual dissatisfaction. success."
    ], context: "I can live with thatは「まあそれで生きていける」。最高の褒め言葉じゃない。「死にはしない」レベルの承諾。でも交渉ではこれがベスト。両者がI can live with itなら成功。片方がI love itだともう片方は損してる。英語は「妥協=お互いが微妙に不満」と認識してる。完全な幸福は交渉の失敗。不満の均等配分が成功。" },

    { daySlot: 16, japanese: '最終オファー', english: [
        "final offer",
        "this is my final offer, take it or leave it",
        "I'm not going any higher -- this is it, last chance",
        "final offer. take it or leave it. and I know 'final offer' gets thrown around a lot and it's usually NOT final. there's always a 'final final offer' and then a 'no really this time final offer.' the word final has lost all credibility in negotiation. it's the boy who cried wolf. but THIS time? I mean it. probably. maybe. ...OK, what's your counter?"
    ], context: "take it or leave itは「受けるか断るか」。選択肢を2つだけに減らす。英語の交渉の終わらせ方は二択を突きつけること。日本語の「最終オファー」は英語からの借用語。面白いのはfinal offerと言った後にまた交渉が続くこと。finalは「最終」のはずなのに更新される。交渉のfinalは「最終回のはず」程度の意味。信用度ゼロ。" },

    { daySlot: 16, japanese: 'それなら考える', english: [
        "now we're talking",
        "OK now we're talkin', that's more like it",
        "see, now THAT I can work with -- let's hash out the details",
        "NOW we're talkin'. and 'now we're talkin'' is the green light of negotiation. everything before this was foreplay. this is the real conversation. you finally said somethin' I can work with. the vibe shifted. the energy changed. we went from 'I'm walkin' away' to 'let me sit back down.' one good offer can resurrect a dead deal. magic words."
    ], context: "now we're talkingは「そうこなくちゃ」。直訳すると「今やっと話してる」。つまりそれまでは「話にもなってなかった」ということ。hash outは「徹底的に話し合う」。hashは「細かく切る」。議題を細かく切って一つずつ処理する。英語の交渉は料理に近い。材料(条件)を切って、混ぜて、煮込んで、仕上げる。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 17: 許可 (Permission) -- INFLUENCE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 17, japanese: 'これ使っていい？', english: [
        "mind if I use this",
        "hey, mind if I use this? I'll put it right back",
        "do you mind if I borrow this for a sec? I just need it real quick",
        "mind if I use this? and I'm askin' 'mind if' instead of 'can I' because 'mind if' is softer. 'can I' is direct. 'do you mind if' is askin' about their FEELINGS about it. not permission, but emotional permission. it's like permission with a cushion. English has levels of askin'. 'can I' < 'could I' < 'do you mind if I' < 'would it be OK if I.' each step adds padding."
    ], context: "do you mind if~?は「〜しても気にしない?」。許可を「相手の感情」として聞いてる。can I(できる?)は能力、may I(してよい?)は許可、do you mind(気にする?)は感情。英語は許可を3つのレイヤーで使い分ける。日本語の「いい?」は1語で全部カバー。英語は丁寧さに応じてレイヤーを選ぶ。面倒だけど精密。" },

    { daySlot: 17, japanese: '先に帰っていい？', english: [
        "mind if I head out",
        "is it cool if I head out early? I got somethin' at home",
        "would it be alright if I left a little early today? nothing urgent, just stuff",
        "mind if I head out? and I hate askin' this 'cause it always feels like I'm askin' for a favor when it should be a right. like, I finished my work. there's nothing left to do. but I still gotta ASK. and then do the awkward 'is it really OK?' follow-up. and then the 'are you SURE?' double-check. three rounds of permission for one exit. exhausting."
    ], context: "head outは「出る」「帰る」。headは名詞なら「頭」だけど、動詞だと「向かう」。head out(出て行く)、head home(家に向かう)、head over(そっちに向かう)。頭=方向。頭が向いてる方に体が進む。日本語は「帰っていい?」と帰るという動作の許可を求めるけど、英語は「向かっていい?」と方向の許可を求める。" },

    { daySlot: 17, japanese: 'ダメ？', english: [
        "is that a no",
        "is that a no? just tell me straight",
        "are you saying no? 'cause if it's a no, just say it -- I can take it",
        "is that a no? 'cause your face is sayin' no but your mouth hasn't actually said the word yet. and I need the word. I need the actual 'no.' 'cause if you don't SAY it I'm gonna keep assumin' there's a chance. that's how my brain works. silence is not rejection. silence is hope. say the word. free me."
    ], context: "英語のnoは1語で完結する。日本語の「ダメ」もそう。でも英語圏では直接noと言うのを避ける文化がある。I don't think so(そうは思わない)、I'm not sure about that(それはどうかな)、That might be difficult(難しいかも)。全部no。でも直接言わない。noの周りをぐるぐる回る。直接的なのに間接的。矛盾してるけどそれが英語。" },

    { daySlot: 17, japanese: '全然いいよ', english: [
        "go for it",
        "yeah go for it, no need to ask",
        "absolutely, go right ahead, it's all yours",
        "go for it! and 'go for it' is the most enthusiastic yes in English. it's not just 'yes.' it's 'YES and I'm excited about it.' there's momentum in it. go FOR it. attack it. grab it. it's an aggressive yes. a yes with velocity. Japanese 全然いいよ is 'totally fine' which is permission. go for it is permission PLUS encouragement. English permission can come with a pep talk."
    ], context: "go for itは「やっちゃえ」。forが目標に向かう方向を示して、itに突進するイメージ。ただの許可じゃなくて背中を押してる。go ahead(どうぞ)より勢いがある。be my guest(どうぞご自由に)は丁寧だけどちょっと冷たい。help yourself(ご自由にどうぞ)は物に対して使う。許可の表現だけでテンションが読める。言い方=温度。" },

    { daySlot: 17, japanese: 'ちょっと待って', english: [
        "hold on",
        "hold on, let me think about it for a sec",
        "wait -- before you do that, let me make sure it's OK first",
        "hold on. and 'hold on' is not a no. it's a 'not yet.' it's a pause button. a timeout. I need more information before I can give you a green light. and the 'hold' part is physical -- you're literally tellin' someone to grab onto the current moment and freeze. hold ON. grip it. don't let go. stay right here until I figure this out."
    ], context: "hold onの holdは「握る」。onは「その状態を続ける」。「今の状態を握り続けて」=「待って」。hang on(ぶら下がり続けて)も同じ意味。英語はwait(待て)よりhold on/hang onのほうがカジュアル。面白いのは物理動作が「待つ」になること。何かを掴んで離さない=時間を止める。英語の「待つ」は能動的。ただ立ってるんじゃなくて、何かを掴んでる。" },

    { daySlot: 17, japanese: '勝手にやっていいよ', english: [
        "knock yourself out",
        "knock yourself out, you don't need my permission for that",
        "go wild, I honestly don't care -- do whatever you want",
        "knock yourself out. and that sounds violent but it just means 'go ahead, do whatever.' the implication is 'go so hard you knock YOURSELF out.' like, I'm not gonna stop you. go crazy. and 'go wild' is the same vibe. permission to be unrestrained. Japanese 勝手にやって can sound annoyed but knock yourself out is generous. it's permission with a smile."
    ], context: "knock yourself outは直訳すると「自分を殴って気絶しろ」だけど意味は「好きにどうぞ」。勢いよくやりすぎて気絶するくらいやれ、という許可。日本語の「勝手にやって」は冷たく聞こえることがあるけど、knock yourself outは「思う存分やれ」のポジティブな許可。同じ「好きにしろ」なのに温度が真逆。言語の感情フィルターが違う。" },

    { daySlot: 17, japanese: '俺に聞かなくていい', english: [
        "you don't need my OK",
        "you don't need to ask me, just do it",
        "you're a grown-up, you don't need my permission for this stuff",
        "you don't need my OK. and I mean that. stop askin'. every time you ask me for permission to do something obvious, a tiny part of my soul dies. you're capable. you're competent. you can make decisions. I believe in you. now stop askin' and start doin'. this is my version of empowerment. it's aggressive but it's genuine."
    ], context: "you don't need my permissionは「許可いらない」だけど、これが一番難しい許可かもしれない。「聞くな」と言うことで自律を与えてる。英語はautonomyを大事にする。You're your own person(あなたはあなた)、It's your call(あなたの判断)。個人の意思決定権を尊重するフレーズが多い。許可を不要にすること=最高の信頼。" },

    { daySlot: 17, japanese: '今回だけね', english: [
        "just this once",
        "fine, but just this once -- don't make it a habit",
        "I'll let it slide this time, but next time the answer's no",
        "just this once. and we both know 'just this once' is a lie. it's never once. once becomes twice. twice becomes 'well we already did it twice so what's one more.' and before you know it 'just this once' has become a tradition. 'just this once' is the gateway drug of permission. first hit is free. then you're hooked. I know the pattern. I'm still sayin' it."
    ], context: "let it slideは「見逃す」。slideは「滑らせる」。問題をツルっと滑らせて見なかったことにする。日本語の「今回だけね」は条件付き許可。英語のjust this onceも同じだけど、don't make it a habit(習慣にするな)がセットで来る。英語は例外を許可するときに「これは例外である」と宣言する。ルールの存在を確認してから破る。律儀な違反。" },

    { daySlot: 17, japanese: '誰に聞けばいい？', english: [
        "who do I ask",
        "who do I talk to about this? who's in charge?",
        "I need to get this approved -- who's the right person to ask?",
        "who do I ask? 'cause there's always a 'right person' and I never know who it is. I ask person A. person A says 'oh you need person B.' I go to person B. person B says 'actually that's person C.' person C is on vacation. I'm in a permission loop. a bureaucratic hamster wheel. all I wanted was a yes or no. why does it require a scavenger hunt."
    ], context: "who's in charge?は「誰が責任者?」。in charge=担当している。chargeは「充電」「請求」「担当」。全部「エネルギーを注入される」イメージ。担当者=そのタスクにエネルギーを注入された人。日本語は「誰に聞けばいい?」と動作(聞く)を聞くけど、英語はwho's in charge?と権限の所在を聞く。許可=権限。権限の地図を先に確認する。" },

    { daySlot: 17, japanese: '許可いる？', english: [
        "do I need to ask",
        "do I even need to ask or can I just go ahead?",
        "is this something I need approval for or can I just do it?",
        "do I even need to ask? 'cause sometimes I ask for permission and people look at me like 'why are you askin'?' and it's embarrassing. but other times I DON'T ask and people go 'why didn't you ask?!' so I can't win. the line between 'you should have asked' and 'you didn't need to ask' is invisible and it moves. English has no user manual for this. you just guess and pray."
    ], context: "do I need approval?のapprovalは「承認」。approve=認める、にalを足して名詞化。英語は許可と承認を区別する。permission(許可)=やっていいよ。approval(承認)=やり方を認めるよ。permissionは行動の可否、approvalは内容の評価。日本語は両方「許可」で済むけど、英語は2段階。やっていい(permission)→やり方もOK(approval)。二重チェック。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 18: 指示 (Directing) -- INFLUENCE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 18, japanese: 'まずこれやって', english: [
        "start with this",
        "OK first things first -- start with this one",
        "before anything else, I need you to do this first, then we'll go from there",
        "start with this. and I'm sayin' 'first things first' 'cause order matters. you can't build the roof before the walls. well, you CAN, but it'll fall. and then you'll be standin' there with a roof on the ground goin' 'maybe I should've done the walls first.' sequencing. it's not sexy but it's the difference between a house and a pile of materials."
    ], context: "first things firstは「まず最初のことから」。最初のことが最初=当たり前のことを言ってるけど、これが指示の定番フレーズ。英語は順序を強調するときにfirstを2回繰り返す。日本語の「まずこれ」は「まず」1回で済む。英語は「最初のことは最初だ」と念押しする。当たり前を宣言することで優先順位を釘付けにする。" },

    { daySlot: 18, japanese: '次はこっち', english: [
        "next up",
        "OK next up -- this one, right here",
        "alright, that's done, now move on to this one",
        "next up. and 'next up' comes from batting order. baseball. who's next at bat? 'you're up.' your turn. it's gone from baseball to everything. restaurants: 'next!' offices: 'who's next?' life: 'what's next?' English borrowed a batting order system and applied it to reality. everything is a lineup. everyone is waiting their turn. life is baseball. or baseball is life. either way."
    ], context: "next upは「次はこれ」。upは「順番が来た」のニュアンス。you're up(あなたの番)、what's up next(次は何?)。日本語は「次はこっち」と方向で指示するけど、英語はup=上に来る、と表現する。順番は下から上に上がってくるイメージ。待ち行列の先頭に浮上する。日本語の順番は横に流れるけど、英語の順番は縦に上がる。" },

    { daySlot: 18, japanese: 'ここ注意して', english: [
        "watch out for this part",
        "heads up -- watch out for this part, it's tricky",
        "pay attention here, this is where people usually mess up",
        "watch out for this part. and when I say 'watch out' I mean literally watch. with your eyes. open. focused. because this is the part where things go wrong. every time. without fail. it's like a video game boss. you can breeze through the easy parts but THIS part? this part eats people alive. so eyes forward. brain on. let's do this."
    ], context: "heads upは「注意して」。頭を上げろ=上を見ろ=何か来るぞ。もともとは物が上から落ちてくる警告。それが一般的な「気をつけて」に進化した。watch outも「外を見ろ」=危険を見張れ。英語の注意喚起は全部視覚ベース。日本語の「注意して」は「意を注ぐ」=心を注ぐ。英語は「目を使え」、日本語は「心を使え」。注意の器官が違う。" },

    { daySlot: 18, japanese: 'こうやるんだよ', english: [
        "this is how you do it",
        "here, this is how you do it -- watch me",
        "let me show you the right way, it's easier than you think",
        "this is how you do it. watch. and I mean WATCH. don't look at your phone. don't zone out. 'cause I'm only showin' this once. well, probably twice. OK maybe three times. but after three times I'm gonna start sighin' heavily and that's unpleasant for everyone. so let's aim for once. eyes on me. this is a masterclass. in something very minor. but still."
    ], context: "let me show youは「見せてあげる」。showは「見せる」=言葉じゃなくて実演する。英語の指示はtell(言う)とshow(見せる)を明確に使い分ける。Don't tell me, show me(言わないで見せて)は「口だけじゃなくて行動で」の定番フレーズ。英語は「見せる」ことを言葉より上に置く。Show, don't tell。映画脚本の基本でもある。" },

    { daySlot: 18, japanese: '見ててね', english: [
        "watch this",
        "watch this -- I'm only gonna do it once",
        "keep your eyes on this part, I'll walk you through it step by step",
        "watch this. and 'watch this' is either the beginning of something amazing or something terrible. there's no middle ground. every great stunt starts with 'watch this.' every trip to the emergency room also starts with 'watch this.' it's a coin flip. but right now, it's the educational version. the safe version. nobody's gettin' hurt. probably."
    ], context: "watch thisの2語は英語で最も危険なフレーズの一つとネタにされてる。YouTubeのfail動画は大体watch thisから始まる。でも指示の場面ではちゃんと「見てて、教えるから」の意味。同じ2語なのに場面で意味が真逆になる。日本語の「見ててね」は優しいけど、英語のwatch thisは「すごいことが起きるぞ」の興奮が入ってる。" },

    { daySlot: 18, japanese: '順番間違えないで', english: [
        "don't skip steps",
        "don't skip steps -- the order actually matters here",
        "make sure you follow the order, if you skip ahead it won't work",
        "don't skip steps. and I know you wanna skip ahead 'cause you think you know where this is goin'. but you don't. I've seen people skip step three and end up back at step one. which means they did NEGATIVE work. they went backwards. skipping is not a shortcut. skipping is a time machine to frustration. do. the. steps. in. order. please."
    ], context: "skip stepsは「手順を飛ばす」。skipは「スキップする」=軽快に飛ぶ。でも指示の場面では「必要な手順を無視する」とネガティブ。follow the steps(手順に従う)が正しい動作。英語はstep(一歩)で手順を表現する。step by step(一歩一歩)、the next step(次の一歩)。手順=歩行。作業は道を歩くこと。脱線=道から外れること。" },

    { daySlot: 18, japanese: 'ここ大事', english: [
        "this part's key",
        "listen, this part's key -- don't mess it up",
        "this is the important part, everything else depends on getting this right",
        "this part's key. and I say that 'cause not everything is equally important. some steps are filler. some steps are structural. this? this is structural. if you get this wrong, everything after it is wrong too. it's a domino. the first domino. and if the first one falls wrong the whole chain goes sideways. no pressure. but also, all the pressure."
    ], context: "keyは「鍵」=重要。英語は重要なことを「鍵」と呼ぶ。key point(重要なポイント)、key player(重要人物)。鍵がないとドアが開かない=これがないと先に進めない。日本語は「大事」=大きい事。英語は「鍵」=なくてはならない道具。重要性のメタファーが違う。日本語はサイズで、英語は機能で重要性を表現する。" },

    { daySlot: 18, japanese: '最後にこれ', english: [
        "last thing",
        "last thing -- almost done, I promise",
        "one more thing and then you're good to go, just do this last part",
        "last thing. and I know I've said 'last thing' three times already. but THIS is actually the last thing. for real. and one more thing is the Steve Jobs move, by the way. he'd end presentations with 'one more thing' and drop a bomb. I'm not droppin' a bomb. I'm droppin' a mundane task. but the energy is similar. anticlimax is also a form of drama."
    ], context: "one more thingは「あともう一つ」。Steveジョブズの代名詞。プレゼンの最後に「もう一つだけ」と言って最大のサプライズを出す技。でも日常では「あともう一つだけ」は大体しょぼい。落差がすごい。last thingも「最後のこと」だけど、finalと違ってlastは本当に最後。finalは更新されるけどlastは信用できる。ちょっとだけ。" },

    { daySlot: 18, japanese: 'やり方教えるね', english: [
        "let me walk you through it",
        "here, let me walk you through it, it's pretty simple",
        "I'll break it down for you step by step, it's not as hard as it looks",
        "let me walk you through it. and 'walk you through' is my favorite English teaching phrase. 'cause it's not 'I'll tell you.' it's not 'I'll explain.' it's 'I'll WALK you through.' we're gonna take a stroll through this process together. side by side. at your pace. hand-holding optional. it's the gentlest form of instruction. a guided tour of knowledge. come, walk with me."
    ], context: "walk you throughは「一緒に歩いて通り抜ける」=「順を追って説明する」。break it downは「分解する」=「わかりやすく砕く」。英語は教えることを物理的な行動で表現する。walk through(歩いて通過する)、break down(壊して小さくする)、run through(走って通過する)。指示の速さも動詞でわかる。walk=丁寧、run=ざっくり。" },

    { daySlot: 18, japanese: '違う、こうだよ', english: [
        "no, like this",
        "no no no, not like that -- like THIS, see?",
        "hold on, that's not quite right -- here, let me show you the right way",
        "no, like THIS. and the emphasis on THIS is everything. 'cause it's not just 'no.' it's 'no, and watch my hands, and copy exactly what I'm doing, and don't add your own interpretation.' THIS means 'my way.' not your way. not a way. MY way. and yeah that sounds controlling but when someone's doin' it wrong, 'my way' IS the right way. temporarily. until they learn."
    ], context: "not like that, like THISは修正の定番。thatが相手の間違い、thisが正解。英語はthat(あれ=遠い=間違い)とthis(これ=近い=正解)で距離を使い分ける。間違いを「遠く」に押しやって、正解を「近く」に引き寄せる。日本語は「違う、こう」で方向で示すけど、英語は距離で示す。正解は近く、間違いは遠く。空間で教える。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 19: 喜び (Joy) -- EXPRESS
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 19, japanese: 'やった！', english: [
        "yes!",
        "yes! let's go! I knew it!",
        "YES! finally! I've been waiting for this!",
        "YES! LET'S GOOO! I KNEW it! everyone doubted me. everyone said 'nah, it's not gonna happen.' and what happened? it happened. and now I'm that guy doin' a victory lap in front of people who didn't believe. is it petty? absolutely. am I enjoyin' it? absolutely. pettiness tastes amazing when you're right."
    ], context: "「やった」は日本語だと「やる」の過去形。動作完了=喜び。英語のYes!は「はい」が喜びの叫びになってる。Let's go!も「行こう」が喜びに。I did it!も「やった」だけど自分を主語にする。英語は喜びでも「誰が」を省略しない。I did it、I made it、I got it。全部I始まり。喜びにも著作権がある。" },

    { daySlot: 19, japanese: '最高！', english: [
        "this is amazing",
        "this is the best thing ever, I'm not even exaggeratin'",
        "I can't believe how good this is, honestly I'm blown away",
        "this is the best thing ever. and I know I say that a lot. I said it about pizza last week. and about a sunset before that. but THIS TIME I mean it for real. my 'best thing ever' has a high turnover rate and I'm OK with that 'cause life keeps upgradin'. every best thing gets replaced by a better best thing. inflation of joy."
    ], context: "the best thing everのever=「今まで」。everは時間の全範囲をカバーする。「人生で一番」と毎回言い切る。日本語の「最高」は相対的だけど、英語のbest everは絶対的な宣言。しかも何回でも使う。矛盾してるけど英語話者は気にしない。bestは毎回更新される。永久欠番がない。" },

    { daySlot: 19, japanese: '信じられない（嬉しい）', english: [
        "I can't believe it",
        "I can't believe it, this is unreal",
        "I literally can't believe this is happening right now",
        "I can't believe it. and I keep sayin' it but the belief is not comin'. my brain is bufferin'. you know that loading circle on your computer? that's my brain right now. still processin'. still tryin' to accept that this is real. someone pinch me. actually don't. that hurts. just tell me it's real. is it real? it's real."
    ], context: "I can't believe itは嬉しいときも悲しいときも使う。万能驚き表現。どっちかはトーンでわかる。面白いのはliterallyを足すと強調になること。I literally can't believe it。literallyは「文字通り」だけど、実際は「マジで」の意味で使われてて、辞書の意味と真逆。英語で一番仕事内容が変わった単語。" },

    { daySlot: 19, japanese: 'マジ嬉しい', english: [
        "I'm so happy",
        "I'm so freakin' happy right now, you have no idea",
        "you have no idea how happy I am, this made my whole week",
        "I'm so happy. like, unreasonably happy. disproportionately happy. the thing that happened doesn't even warrant this level of happiness but my brain doesn't care about proportions. my brain said 'we're celebratin'' and the rest of me just went along with it. sometimes you don't question the joy. you just ride it."
    ], context: "I'm so happyのsoは強調の万能ワード。so happy、so tired、so done。何にでもsoを付ければ強くなる。日本語の「めっちゃ」「マジ」と同じポジション。でもsoは本来「だから」(接続詞)が先。So what?(だから何?)のso。強調のsoと理由のsoが同じ単語。文脈で使い分ける。忙しい単語。" },

    { daySlot: 19, japanese: 'ずっと待ってた', english: [
        "I've been waiting for this",
        "I've been waitin' for this for SO long",
        "this is what I've been waiting for, it was worth every second",
        "I've been waitin' for this. and waitin'. and waitin'. at some point the waitin' became a hobby. I was so used to waitin' that when it finally happened I almost didn't recognize it. like when you order food and forget what you ordered and the waiter brings it and you're like 'oh right, I wanted this.' that. but with more emotions."
    ], context: "I've been waiting=現在完了進行形。過去から今までずっと継続してるニュアンス。日本語の「ずっと待ってた」は過去形。英語は「今もまだその状態が続いてる」と時制で表現する。I waited(待った=終わった)vs I've been waiting(ずっと待ってて今もその延長線上にいる)。時間の幅が文法に入ってる。" },

    { daySlot: 19, japanese: '夢みたい', english: [
        "feels like a dream",
        "this feels like a dream, seriously",
        "someone pinch me, this can't be real, it's too good",
        "this feels like a dream. and not the weird kind where you're at school in your underwear. the GOOD kind. the kind where everything goes right and you wake up and you're mad it's over. except this time I'm not wakin' up. this is real. I think. let me check. yep. still real. OK we're good."
    ], context: "feels like a dreamのlike=「みたい」。英語のlikeは比喩製造機。feels like(〜みたい)、looks like(〜っぽい)、sounds like(〜に聞こえる)。五感全部にlikeを付けて比喩にできる。日本語は「みたい」「っぽい」「らしい」と使い分けるけど、英語はlikeで統一。万能比喩接着剤。" },

    { daySlot: 19, japanese: 'もう最高の気分', english: [
        "on top of the world",
        "I'm on top of the world right now, can't stop smilin'",
        "I feel like I could do anything right now, nothing can bring me down",
        "I'm on top of the world. and I know that's a cheesy thing to say but it's accurate. I'm at the summit. peak happiness. maximum capacity. and the smart thing would be to enjoy it quietly but nah. I'm gonna be loud about it. you're allowed to be loud when you're happy. that's the rule. I just made that rule."
    ], context: "on top of the worldは「世界の頂上にいる」=最高の気分。英語は感情を場所で表現する。I'm in a good place(いい状態にいる)、I'm at rock bottom(どん底)、I'm on cloud nine(天にも昇る気分)。感情に住所がある。日本語は「気分がいい」と状態で言うけど、英語は「今どこにいるか」で気分を伝える。感情=GPS。" },

    { daySlot: 19, japanese: 'これ好きすぎる', english: [
        "I love this",
        "I love this so much, this is everything",
        "I'm obsessed with this, I can't get enough of it",
        "I love this. and not like 'I love pizza' love. like, real love. deep love. the kind where you think about it when it's not around. which is weird because it's a thing and not a person but my brain doesn't care. my brain has decided to emotionally attach to this and I'm just along for the ride."
    ], context: "英語のloveは何にでも使う。I love pizza、I love this song、I love your shoes。日本語で「ピザ愛してる」とは言わない。英語のloveは「大好き」から「愛してる」まで幅が広すぎる。だから本気の愛には I'm IN love with you と inを足して区別する。loveだけだと「好き」、in loveだと「恋してる」。前置詞1個で重さが激変する。" },

    { daySlot: 19, japanese: 'テンション上がる！', english: [
        "I'm hyped",
        "I'm so hyped right now, let's goooo",
        "I'm pumped, this is gonna be sick, I can feel it",
        "I'm hyped. HYPED. and the Japanese 'tension' and English 'tension' are NOT the same thing. English tension is stress. Japanese テンション is excitement. completely different. so if you say 'my tension is high' in English people think you're about to snap. not that you're excited. language trap. been there. it's awkward."
    ], context: "テンションは和製英語の代表格。英語のtensionは「緊張・ストレス」で、日本語の「テンション上がる」とは真逆。英語で興奮を言うならI'm hyped、I'm pumped、I'm stoked。全部身体的。hype=過熱、pump=ポンプで膨らむ、stoke=火を焚く。英語の興奮は全部エンジン系。燃料と温度の言語。" },

    { daySlot: 19, japanese: '感動した', english: [
        "that hit different",
        "wow, that really hit me right in the feels",
        "I'm not gonna lie, that genuinely moved me, I got chills",
        "that hit different. and I don't cry. I'm not a crier. but that? that got me. my eyes got a little... misty. not tears. mist. there's a difference. tears fall. mist just kinda sits there. and if you tell anyone I got misty I'll deny it. but between us? yeah. that hit different. sometimes things just get you."
    ], context: "that hit differentは最近のスラングで「刺さった」。hitは「殴る」が元だけど、感情に殴られるイメージ。英語は感動=衝撃。It moved me(動かされた)、It blew me away(吹き飛ばされた)、I was touched(触れられた)。全部物理的な力。日本語の「感動」は「感じて動く」で自発的。英語は外からの力で動かされる。受動的。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 26: 時間 (Time) -- NAVIGATE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 26, japanese: '何時？', english: [
        "what time",
        "what time? I need to plan around it",
        "what time are we talking? I gotta figure out my schedule",
        "what time? 'cause I need to mentally prepare. I'm not one of those people who can just show up spontaneously. I need lead time. not a lot. but enough to go through the five stages: denial, bargaining, acceptance, outfit crisis, and then finally leaving the house twelve minutes late."
    ], context: "What time?は2語で完結する質問。英語は疑問詞+名詞だけで質問が作れる。What time?(何時?)、Which one?(どれ?)、How much?(いくら?)。動詞なし。カジュアル英語は動詞を捨てられる。でもフォーマルだとWhat time is it?と動詞を入れる。丁寧さ=部品の数、は英語の鉄則。" },

    { daySlot: 26, japanese: '遅れそう', english: [
        "gonna be late",
        "I'm gonna be late, don't wait for me",
        "heads up, I'm running behind, I'll be there in like twenty",
        "I'm gonna be late. and I know I said 'five minutes' but that was aspirational. it was a goal, not a promise. my 'five minutes' is more of a vibe than a measurement. it could be five. it could be fifteen. the only guarantee is that it won't be five. I'm sorry. I'm workin' on it. I'm not. but I'm sorry."
    ], context: "running behindは「遅れてる」の口語表現。直訳すると「後ろを走ってる」。予定という線路の後ろを走ってるイメージ。英語は時間を道に見立てる。ahead of schedule(予定の前方)、behind schedule(予定の後方)、on track(線路の上)。時間=道。人生はロードムービーで、予定はナビ。" },

    { daySlot: 26, japanese: '間に合う？', english: [
        "are we gonna make it",
        "think we'll make it? it's gettin' tight",
        "are we gonna make it in time or should we just give up now?",
        "are we gonna make it? 'cause I'm doin' the math in my head and the math isn't mathin'. like, we need to be there in twenty minutes and we haven't left yet. and there's traffic. and parking. and the walk from the parking lot. my calculation says we're seven minutes late at best. but miracles happen. supposedly."
    ], context: "make itは「間に合う」「成功する」「到着する」。万能の達成動詞。We made it!(間に合った!/やり遂げた!)。日本語は「間に合う」「成功する」「着く」と全部別の動詞。英語はmake itで全部カバー。make=「作る」が「目標に到達する」に進化してる。ゴールは自分で作るもの。到達も自力。英語は何でもDIY。" },

    { daySlot: 26, japanese: '予定ある？', english: [
        "you busy",
        "you busy later? I was thinkin' we could hang",
        "you got any plans this weekend or are you free?",
        "you busy? and by 'busy' I mean actually busy, not 'I don't feel like going out' busy. 'cause those are different. and both are valid! but I need to know which one so I can adjust my disappointment accordingly. if you're actually busy, I get it. if you just don't wanna go, also fine. I just wanna know which lie I'm bein' told."
    ], context: "Are you busy?は主語と動詞を省略してYou busy?にできる。ここでも丁寧さ=長さの法則。面白いのはhave plans(予定がある)の表現。planを「持つ」と言う。日本語は「予定ある?」で存在を聞くけど、英語はDo you have plans?で所有を聞く。予定は持ち物。今日のスケジュールは今日のカバンの中身。" },

    { daySlot: 26, japanese: 'そろそろ行かないと', english: [
        "I should get going",
        "I should probably get goin', it's gettin' late",
        "I hate to leave but I really gotta go, I've got an early morning",
        "I should get goin'. and I've been sayin' that for twenty minutes. 'I should go' is the longest goodbye in English. you say it, then you stand up, then you talk for ten more minutes, then you walk to the door, then you talk AGAIN. the Irish goodbye exists because regular goodbyes take forty-five minutes. I respect the efficiency."
    ], context: "I should get goingの get goingは「動き出す」。面白いのはshouldの使い方。should=「すべき」だけど、ここでは「そろそろ」のニュアンス。まだ動いてない。shouldは「やるべきだけどまだやってない」のサイン。I should study(勉強すべき=してない)、I should sleep(寝るべき=寝てない)。shouldは怠惰の告白。" },

    { daySlot: 26, japanese: 'ギリギリだった', english: [
        "that was close",
        "that was way too close, my heart's still racin'",
        "I barely made it, literally got there with zero time to spare",
        "that was close. TOO close. I was runnin' -- actually runnin' -- through the parking lot. like full sprint. in dress shoes. which is not recommended. and I slid into my seat like a baseball player slidin' into home. safe. barely. my dignity? gone. but I made it. and in the end, that's all that matters. arrival > style."
    ], context: "That was closeは「危なかった」。closeは「近い」=ギリギリの距離感。a close call(際どい判定)、cutting it close(ギリギリを攻める)。英語は「危険との距離」で緊迫感を表現する。日本語は「ギリギリ」「危なかった」で状態を言うけど、英語はclose=近さという空間の概念。セーフとアウトの間の隙間が見える。" },

    { daySlot: 26, japanese: 'あっという間だった', english: [
        "flew by",
        "that flew by, I can't believe it's over already",
        "it went by so fast, feels like we just started",
        "that flew by. and I HATE when things fly by 'cause it means I was havin' fun and now the fun is over. boring stuff drags. fun stuff flies. there's no in-between. time is biased. it speeds up when you're happy and slows down when you're miserable. time needs to be investigated for unfair practices."
    ], context: "time fliesは「時が飛ぶ」。日本語は「あっという間」で音の速さ。「あ」って言う間。英語は飛ぶ速さ。でもどっちも「体感時間と実際の時間のズレ」を表現してる。drag(ダラダラ進む)の反対がfly。楽しい=fly、退屈=drag。英語は時間に速度をつけて擬人化する。時間は乗り物。" },

    { daySlot: 26, japanese: 'もうこんな時間', english: [
        "look at the time",
        "oh wow, look at the time, I totally lost track",
        "it's already midnight?! how did that happen?",
        "look at the time! HOW. how is it already this late? I sat down 'thirty minutes ago' and apparently three hours passed. my phone says it's midnight. my phone is a liar. except it's not. I'm the one who lost track. time didn't speed up. I just stopped payin' attention. time doesn't owe me awareness. I owe time an apology."
    ], context: "Look at the time!は「時計を見ろ!」=「もうこんな時間!」。lost track of timeは「時間を見失った」。英語は時間を追跡対象として扱う。track=追跡する、keep track of=把握し続ける。時間は逃げる獲物。見失ったら自分のせい。日本語は「もうこんな時間」と時間のほうが勝手に進んだ感じ。責任の所在が違う。" },

    { daySlot: 26, japanese: '予定変更になった', english: [
        "plans changed",
        "heads up, plans changed, I'll fill you in later",
        "so change of plans -- something came up and we gotta reschedule",
        "plans changed. and I know that's annoying 'cause you already mentally prepared. you picked an outfit. you cleared your schedule. and now I'm hittin' you with a 'plans changed' and your afternoon is suddenly empty. I'm sorry. but also, unexpected free time is kinda a gift? silver lining? no? OK, I'm sorry."
    ], context: "change of plansは「予定変更」。注意すべきはsomething came upという表現。何かが「上がってきた」=予想外のことが発生した。came upのupは「表面に出てきた」のニュアンス。問題もcome up、話題もcome up。英語では出来事は地面の下から上がってくるイメージ。火山みたいに噴出する。" },

    { daySlot: 26, japanese: 'まだ決まってない', english: [
        "not sure yet",
        "not sure yet, I'm still figurin' it out",
        "I haven't decided yet, I'm kinda going back and forth on it",
        "not sure yet. and I know that's a frustrating answer but it's honest. my brain has two options and they're both equally good -- or equally bad -- and I can't tell which. I've been goin' back and forth for three days. at this point I might just flip a coin. the coin doesn't overthink. the coin just decides. I respect the coin."
    ], context: "going back and forthは「行ったり来たり」=迷ってる。英語は迷いを物理的な移動で表現する。I'm torn(引き裂かれてる)、I'm on the fence(フェンスの上)、I'm leaning towards(〜の方に傾いてる)。全部身体の位置。日本語は「迷ってる」=心理状態。英語は迷いにもGPS座標がある。今フェンスの上? 右に傾いてる? どこ?" },

    // ═══════════════════════════════════════════════════════════════
    // Day 2: 再会 (Catching Up) -- CONNECT
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 2, japanese: '久しぶり！元気だった？', english: [
        "how've you been",
        "hey! how've you been? it's been ages!",
        "oh my god, it's been so long! how have you been? you look great!",
        "how've you BEEN? and I mean actually how've you been, not the polite version where you say 'good' and we move on. I wanna know. like, what happened? last time I saw you, you were doin' that thing. did the thing work out? or did it explode? I need the full download. unfiltered."
    ], context: "How've you been?は現在完了。「会ってない間ずっとどうだった?」と空白期間を丸ごと聞いてる。How are you?は「今」だけ。How have you been?は「前回から今日までの全部」。時間の幅が違う。再会専用の挨拶。久しぶりじゃないと使えない。会う頻度で時制が変わる。英語は時間に正直。" },

    { daySlot: 2, japanese: '全然変わらないね', english: [
        "you haven't changed",
        "you haven't changed a bit, seriously",
        "you look exactly the same as I remember, it's crazy",
        "you haven't changed a BIT. and I don't know if that's genetics or effort or witchcraft but whatever you're doin', keep doin' it. meanwhile I've aged like a president. you know how presidents age ten years in four? that's me. except I'm not runnin' a country. I'm just... tired. but you? you're frozen in time. it's suspicious."
    ], context: "not a bitは「少しも〜ない」。bitは「ちょっと」だけど、否定と合わさると「1ミリも」になる。a bit=ほんの少し、not a bit=1ミリもない。英語は「少し」を否定して「全く」を作る。日本語の「全然」と同じ仕組み。「全然変わらない」=「全ての然り(=そう)が変わらない」。どっちも全否定で褒める。" },

    { daySlot: 2, japanese: '最近どうしてた？', english: [
        "what've you been up to",
        "so what've you been up to? catch me up",
        "fill me in, what's been going on with you lately?",
        "what've you been up to? and don't say 'nothin' much' 'cause nobody does nothin'. you've been alive for however many months since I last saw you. stuff happened. you ate food. you had opinions. you probably got mad at somethin' on the internet. give me the highlights. or the lowlights. I'll take either."
    ], context: "What have you been up to?のup toが面白い。upは「上」、toは「〜まで」。直訳すると「何の上まで行ってた?」。活動の到達点を聞いてる。I've been up to a lot(色々やってた)。upは活動レベルの高さ。何もしてないとnot much。英語は「活動量=上下」で測る。忙しい=高い位置にいる。暇=低い。" },

    { daySlot: 2, japanese: '懐かしいなあ', english: [
        "those were the days",
        "man, those were the days, remember that?",
        "that takes me back, I miss those times, everything was so simple",
        "those were the days. and I know every generation says that about their past but it's true for US specifically. our 'those days' were actually good. other people's 'those days' were mid. ours were elite. and I'm not bein' nostalgic. I'm bein' accurate. OK maybe a little nostalgic. but mostly accurate."
    ], context: "those were the daysは「あの頃はよかった」。the daysと定冠詞theが付く。特定の「あの日々」。英語はtheで「あなたも知ってるあの日々ね」と共有記憶を呼び出す。日本語の「懐かしい」は自分の中の感情。英語は「あの日々がthe(特定の)日々だった」と日々の方を主語にする。懐かしさの主語が違う。" },

    { daySlot: 2, japanese: 'あの頃は楽しかったよね', english: [
        "we had a blast",
        "we had such a good time back then, didn't we?",
        "I think about those days all the time, we had so much fun",
        "we had a blast. a BLAST. and the thing about good times is you don't know they're the good times until they're gone. nobody stops mid-fun and goes 'this right here, this is the peak.' you only see it in the rearview. which is annoying. I wish there was an alert. like 'heads up, this moment is special. pay attention.'"
    ], context: "had a blastは「めちゃくちゃ楽しかった」。blastは爆発。楽しさを爆発で表現する。have a ball(舞踏会みたいに楽しむ)、have the time of your life(人生最高の時を過ごす)。英語は楽しさのスケールがでかい。爆発、人生最高。日本語の「楽しかった」はシンプルに感情を報告するけど、英語は比喩で盛る。感想に演出が入る。" },

    { daySlot: 2, japanese: '連絡してなくてごめんね', english: [
        "sorry I dropped off",
        "sorry I've been MIA, life got crazy",
        "I feel bad for not keeping in touch, time just got away from me",
        "sorry I dropped off. and I know that's not a real excuse 'cause textin' takes ten seconds. I had ten seconds. I had millions of ten seconds. but for some reason my brain treated textin' you like a task instead of a conversation and tasks get procrastinated. it's not you. it's my brain's filing system. it's broken."
    ], context: "dropped offは「途絶えた」。drop off=落ちる。連絡が崖から落ちたイメージ。MIA=Missing In Actionは軍事用語「行方不明」がカジュアル化したもの。life got crazyのgot=「なった」。getは変化動詞。got crazy、got busy、got complicated。英語は状態の変化にgetを使う。人生が勝手にcrazyに「なった」。自分のせいじゃない感。便利。" },

    { daySlot: 2, japanese: '変わったね〜', english: [
        "you've changed",
        "whoa, you've totally changed! in a good way though",
        "I almost didn't recognize you! you're like a different person",
        "you've changed! and I mean that in the best way possible 'cause 'you've changed' can go either way. it's one of those phrases that's either a compliment or an accusation dependin' on tone. happy voice: you've changed! = glow-up. disappointed voice: you've changed. = you used to be cool. tone is the jury."
    ], context: "you've changedは褒め言葉にも非難にもなる二面性フレーズ。ポジティブかネガティブかは100%トーン次第。日本語の「変わったね」も同じだけど、英語版はより極端に振れる。compliment(褒め)とaccusation(非難)が同じ3単語。英語は表情や声色に意味を外注する。言葉は器だけ。中身はトーンが決める。" },

    { daySlot: 2, japanese: 'また会えて嬉しい', english: [
        "glad we caught up",
        "I'm really glad we could catch up, this was great",
        "it's so good to see you again, we gotta do this more often",
        "I'm glad we caught up. and I mean that. I'm not just sayin' it 'cause the conversation's endin'. I genuinely enjoyed this. and I'm gonna say 'let's do this again soon' and we both know 'soon' means 'sometime in the next six months to never' but my INTENTION is soon. the execution is... pending."
    ], context: "caught upは「追いついた」。catch upは物理的に追いつく意味が「近況を交換する」に進化した。情報の差を埋める=追いつく。Let's catch up(近況報告しよう)。日本語は「会えて嬉しい」と感情を言うけど、英語はcatch up=情報同期完了という作業報告っぽい。再会を「データの同期」として扱ってる。効率的だけどちょっと冷たい。" },

    { daySlot: 2, japanese: '連絡先変わった？', english: [
        "same number",
        "you still got the same number? or did you change it?",
        "hey, is your number still the same? I wanna make sure I have the right one",
        "same number? 'cause I texted you once like three months ago and got no reply and I didn't know if you were ignorin' me or if I was textin' a stranger. and I didn't wanna double-text 'cause double-textin' feels desperate. so I just... waited. and here we are. in person. like cavemen. actually talkin'. face to face. revolutionary."
    ], context: "Same number?は2語で確認完了。英語のカジュアルは省略力がすごい。You still have the same number?から主語も動詞もhaveも消える。残るのは形容詞+名詞だけ。same number、same place、same time。英語は「同じ?」を聞くときsameだけで成立する。日本語は「変わった?」と変化を聞く。英語は「同じ?」と不変を確認する。視点が逆。" },

    { daySlot: 2, japanese: '今度ゆっくり話そうよ', english: [
        "let's grab coffee sometime",
        "we should grab coffee and properly catch up",
        "let's not wait this long next time, we should hang out for real",
        "let's grab coffee sometime. and I know 'sometime' is the vaguest word in English and 'let's grab coffee' is the most broken promise in adult friendship. but I mean it. I think. I'm like 70% sure I mean it. the other 30% is my couch callin' my name. but 70% is a passing grade. let's aim for that."
    ], context: "let's grab coffeeは「コーヒー行こう」。grabは「掴む」。コーヒーを掴みに行く。英語は食べ物を取りに行く動作で誘いを表現する。grab lunch(ランチ掴む)、grab dinner(ディナー掴む)、grab drinks(飲み物掴む)。全部grab。カジュアルな誘いはgrab一択。haveだとフォーマル。eatだと直接的すぎ。grabがちょうどいい軽さ。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 3: 雑談 (Small Talk) -- CONNECT
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 3, japanese: '暑いね〜', english: [
        "it's so hot",
        "it's so freakin' hot, I can't deal",
        "is it just me or is it insanely hot today? I'm melting over here",
        "it's SO hot. and I know talkin' about the weather is the most basic conversation starter but there's a reason it works. weather is the one thing everyone agrees on. politics? divisive. food? opinions vary. but 'it's hot'? unanimous. weather is the last safe topic. and honestly, when it's this hot, there IS nothin' else to talk about."
    ], context: "天気の話は英語圏の雑談の王様。It's hot、It's cold、Nice day。なぜ天気? 全員が体験してるから。安全で反論不能。I can't deal(対処できない)はカジュアルな「もう無理」。日本語は「暑いね〜」と共感を求める「ね」が付く。英語にはこの「ね」がないからright?やisn't it?を後ろに付ける。共感の求め方が違う。" },

    { daySlot: 3, japanese: '週末なにしてた？', english: [
        "what'd you do this weekend",
        "so what'd you do this weekend? anything fun?",
        "how was your weekend? did you get up to anything good?",
        "what'd you do this weekend? and I'm askin' 'cause I genuinely wanna know, not 'cause I have nothin' to say. actually, both. it's both. I had a boring weekend and I need to live vicariously through yours. so please tell me you did somethin' interesting. even a little interesting. I'll take mildly interesting. the bar is low."
    ], context: "What'd you do?は月曜の定番。英語圏の職場では月曜=週末報告会。did youがd'youに圧縮されてwhat'd you doになる。get up to(〜する)も面白い。What did you get up to?は「何の上まで行った?」で、活動の到達点を聞く。日本語は「何してた?」で行動を聞くけど、英語は「どこまで行った?」で到達度を聞く。" },

    { daySlot: 3, japanese: '最近忙しい？', english: [
        "been busy",
        "you been busy? you look kinda tired",
        "things been hectic for you lately? you seem swamped",
        "you been busy? 'cause you got that look. that 'I haven't slept properly in a week' look. that 'I'm runnin' on coffee and willpower' look. I know it well 'cause I see it in the mirror. there should be a support group for busy people. but we'd all be too busy to attend. which is the whole problem."
    ], context: "Been busy?はHave you been busy?の超圧縮。Have youが消滅。英語のカジュアルは主語もhaveも消せる。swampedは「沼にはまった」=仕事で溺れてる。英語は忙しさを水害で表現する。swamped(沼)、drowning(溺れてる)、underwater(水中)。忙しい人は沈んでいく。暇になると浮上する。busy=沈没。" },

    { daySlot: 3, japanese: 'あ、そうだ', english: [
        "oh, that reminds me",
        "oh wait, that reminds me -- I meant to tell you",
        "actually, you know what, that just made me think of something",
        "oh, that reminds me. and this is completely unrelated to what we were talkin' about but my brain works like a pinball machine. one topic hits a bumper and bounces to somethin' totally different. I have zero control over it. the connection makes sense in my head but if I try to explain the logic you'll look at me like I'm crazy. so just trust me. it's related. somehow."
    ], context: "that reminds meは「それで思い出した」。remindは「再び心に入れる」(re+mind)。英語は記憶を「心への再投入」と表現する。日本語の「そうだ」は気づきの瞬間。英語のthat reminds meは「今の話がトリガーになった」と因果関係を示す。日本語は突然の気づき、英語は連想の連鎖。思い出す経路が言語に出る。" },

    { daySlot: 3, japanese: '話変わるけど', english: [
        "by the way",
        "oh, by the way, totally different topic but --",
        "this is completely off topic, but I just remembered something",
        "by the way. and I love 'by the way' 'cause it's basically a license to change the subject without any transition. no segue. no connection. just 'by the way' and BAM, new topic. it's the conversational equivalent of a jump cut. one second we're talkin' about food, next second we're talkin' about space. by the way is a teleporter."
    ], context: "by the wayは「ちなみに」。直訳は「道のそばに」。本題という道の横道にそれるイメージ。英語は会話を道に見立てる。get back on track(本題に戻る)、go off on a tangent(脱線する)。会話=道路。by the wayは横道の入口。日本語の「話変わるけど」は正直に宣言してるけど、英語は「道の脇ですが」と控えめに装う。" },

    { daySlot: 3, japanese: 'へぇ〜そうなんだ', english: [
        "oh really",
        "oh really? I had no idea, that's interesting",
        "no way, I didn't know that, tell me more",
        "oh really? and I'm sayin' 'really' but it's not a question. it's a reaction. English has like five different 'really's. there's surprised really, suspicious really, bored really, sarcastic really, and impressed really. they're all the same word but the tone does ALL the work. this one's impressed really. just so we're clear."
    ], context: "oh reallyは万能リアクション。でもトーンで全部意味が変わる。上がり調子=驚き、フラット=へえ、下がり調子=疑い。日本語の「そうなんだ」も同じで、言い方で温度が変わる。でも英語のreallyは「本当に?」の疑問から「へえ」の感嘆まで幅が広すぎる。1語で5感情カバー。忙しい単語ランキング上位。" },

    { daySlot: 3, japanese: 'ところで', english: [
        "so anyway",
        "so anyway, I wanted to ask you something",
        "speaking of which -- actually no, this is totally unrelated, but --",
        "so anyway. and 'so anyway' is fascinating 'cause it means 'I'm done with that topic and switchin' to what I actually wanna talk about.' it's a polite eject button. you were talkin', I was listenin', and now I'm redirectin'. 'so anyway' is the conversation's steering wheel. whoever says it gets to drive next."
    ], context: "so anywayは話題転換の最強ツール。soは接続、anywayは「とにかく」。2語で「今の話は置いといて」が完成する。日本語の「ところで」と似てるけど、anywayにはちょっと「もうその話いいでしょ」のニュアンスがある。丁寧に切り上げてるように見えて、実は主導権を奪ってる。会話のクーデター。柔らかいけど確実。" },

    { daySlot: 3, japanese: '最近ハマってるのある？', english: [
        "into anything new lately",
        "you into anything new lately? I need recommendations",
        "what've you been binging? I ran out of stuff to watch",
        "into anything new? 'cause I'm in that phase where I've finished everything and I need someone to tell me what to do with my free time. I tried pickin' for myself but my taste is broken. I'll watch the first five minutes of twelve things and commit to nothin'. I need external guidance. be my algorithm. a human algorithm. please."
    ], context: "be into something=〜にハマってる。intoは「の中に入ってる」。趣味の中に自分が入るイメージ。I'm into cooking(料理にハマってる)、I'm really into this show(この番組にどっぷり)。深さもintoで表現する。get into(ハマり始める)→be into(ハマってる)→be way too into(ハマりすぎ)。沼は英語でもinto。入ったら出てこない。" },

    { daySlot: 3, japanese: 'なんか面白いことあった？', english: [
        "anything exciting happen",
        "anything exciting goin' on? I need some good news",
        "tell me something good, I've had the most boring week",
        "anything exciting happen? 'cause my life has been aggressively uneventful. nothin' bad happened. nothin' good happened. just... nothin'. I woke up, existed, went to sleep, repeated. I need someone else's excitement to break the monotony. live vicariously. that's the plan. your joy is my entertainment. no pressure."
    ], context: "anything excitingは「何かワクワクすること」。anythingは疑問文で「何か」。英語のanythingは範囲が無限大。anything goes(何でもあり)、anything works(何でもいい)。日本語の「なんか」に近いけど、anythingはもっと全範囲をカバーしてる。「存在する全ての可能性の中から何かある?」と聞いてる。贅沢な質問。" },

    { daySlot: 3, japanese: 'そういえば', english: [
        "come to think of it",
        "come to think of it, I totally forgot to mention --",
        "you know what, now that you mention it, that reminds me of something",
        "come to think of it. and I love this phrase 'cause it admits that thinkin' wasn't happenin' before. 'come to think of it' = 'now that I've finally started thinkin' about this.' the thought CAME to me. I didn't go to the thought. the thought arrived. like a late delivery. my brain's processing speed is on dial-up but hey, it got here."
    ], context: "come to think of itは「考えてみれば」。直訳は「それを考えることに来た」。思考が自分に来るイメージ。日本語の「そういえば」は「そう言えば」=「そう言うと(思い出す)」で、発言がトリガー。英語はcome to=到着する。考えが自分のところに到着する。日本語は言葉がきっかけ、英語は思考が移動してくる。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 4: 誘う (Inviting) -- CONNECT
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 4, japanese: '今度飯行こうよ', english: [
        "let's grab food",
        "we should grab food sometime, I know a good spot",
        "let's go eat sometime, there's this new place I've been wanting to try",
        "let's grab food. and I'm actually gonna follow through this time. I know I've said 'let's grab food' like nine times and we've grabbed zero food. but this time I'm puttin' it in my calendar. right now. ...OK I didn't. but I WILL. tonight. before bed. probably. the intention is iron-clad. the execution is under review."
    ], context: "let's grabはカジュアルな誘いの定番。grab=「掴む」で、食事を軽く掴むだけのニュアンス。let's have dinnerだとちゃんとした食事感。let's grab foodだと「サクッと飯」感。grabは気軽さの象徴。ちなみにfoodは「飯」、mealは「食事」、dinnerは「ディナー」。カジュアル度: grab food > grab lunch > have dinner。単語の格がある。" },

    { daySlot: 4, japanese: '暇？', english: [
        "you free",
        "you free later? I got an idea",
        "what are you doing right now? feel like going out?",
        "you free? and I realize I'm askin' this at the last minute and last-minute plans stress some people out. but I'm a last-minute person. I don't plan ahead. my best ideas happen twenty minutes before I wanna do 'em. spontaneous? yes. inconsiderate? maybe. but also exciting. right? it's exciting. say it's exciting."
    ], context: "You free?はAre you free?の超圧縮。2語。英語のfreeは「自由」じゃなくて「空いてる」。日本語の「暇?」はちょっとネガティブ(暇=することない)だけど、英語のfreeはポジティブ(free=拘束されてない)。同じ状況を「暇」と見るか「自由」と見るか。日本語は退屈を聞いて、英語は解放を聞いてる。" },

    { daySlot: 4, japanese: '予定空いてる？', english: [
        "you got plans",
        "you got any plans Saturday? I might have somethin'",
        "are you doing anything this weekend? 'cause I was thinking --",
        "you got plans? and this is the pre-invitation question. I'm not invitin' you yet. I'm checkin' availability first. 'cause if I invite you and you're busy, that's a rejection. but if I ask if you're free first, and you're not, then I never technically got rejected. I just gathered information. it's strategic. dating and hangouts use the same playbook."
    ], context: "you got plans?は「予定ある?」。英語はplansと複数形にする。予定は1個じゃなくて複数あるのがデフォルト。日本語は「予定」は単数でOK。英語の複数形plansには「人生は複数の予定で埋まってるもの」という前提がある。空いてる日=予定がない日=例外。英語話者はスケジュールが埋まってる前提で生きてる。" },

    { daySlot: 4, japanese: '一緒に来ない？', english: [
        "wanna come",
        "wanna come? it'll be fun, I promise",
        "you should come with us, the more the merrier",
        "wanna come? and there's no pressure. like, actually no pressure. I'm not doin' that thing where I say 'no pressure' but then make a face when you say no. if you say no, I'll be like 'cool' and move on. ...I'll be a little sad inside but on the outside? cool. totally cool. professional-level cool. Academy Award-level cool."
    ], context: "wanna come?はDo you want to come?の超圧縮版。want to→wannaに縮み、Do you+主語も消える。3語が2語になった。the more the merrier(多ければ多いほど楽しい)は定番フレーズ。merryは「陽気」。人数=楽しさと直結する英語の考え方。日本語は「来ない?」と否定疑問で誘うのが面白い。「来ない」前提で聞いて、YESのハードルを下げてる。" },

    { daySlot: 4, japanese: '興味ある？', english: [
        "you interested",
        "would you be down? it could be fun",
        "is that something you'd be into? no pressure if not",
        "you interested? or at least curious? I'll accept curious. curious is interest's younger sibling. it's not a commitment. it's a 'tell me more and I'll decide.' and that's fine. I don't need a yes right now. I need a maybe. a maybe is a door that's not closed. I can work with a door that's not closed. closed doors are a different conversation."
    ], context: "be downは「乗り気」のスラング。I'm down(乗った)。downなのにポジティブ。なぜ? down=着地=決定のイメージ。I'm down for it(それに着地する=OKする)。be into(ハマる)も誘いに使える。「その中に入る気ある?」。日本語の「興味ある?」は知的好奇心っぽいけど、英語のdown/intoは身体的な参加意欲。頭じゃなくて体で答える。" },

    { daySlot: 4, japanese: 'いつがいい？', english: [
        "when works for you",
        "when works for you? I'm flexible",
        "when are you free? I can work around your schedule",
        "when works for you? 'cause I'm flexible. and by flexible I mean my schedule is basically empty. I'm not busy. I WANT to be busy. invite me to things. I'll say yes to anything. Tuesday lunch? yes. Thursday night? yes. Sunday morning hike? ...OK maybe not that. but most things. I'm available. aggressively available."
    ], context: "When works for you?は「いつが合う?」。worksは「機能する」。日本語は「いつがいい?」と好みを聞くけど、英語はwhen works=「いつなら作動する?」とスケジュールを機械みたいに扱う。workは「働く」から「機能する」に拡張されてる。Does that work?(それでいける?)も同じ。英語は予定を機械のように組み立てる。" },

    { daySlot: 4, japanese: 'どこにする？', english: [
        "where should we go",
        "where should we go? you pick, I'm bad at deciding",
        "any place in mind or should we figure it out later?",
        "where should we go? and please don't say 'I don't care, anywhere is fine' 'cause that means I have to decide and my decisions are terrible. last time I picked we ended up at that place with the questionable hygiene rating. I can't be trusted with restaurant choices. I need an adult. a food-competent adult. that's you. you decide."
    ], context: "Where should we go?のshouldは提案を求める疑問。I don't care, anywhere is fine(どこでもいい)は英語圏で最も嫌われる返事の一つ。「どこでもいい」と言って提案を全部却下する人は万国共通。英語ではこれをindecisive(優柔不断)と言う。でもI'm bad at deciding(決めるの苦手)と自覚してれば許される。英語は自覚の言語化が免罪符。" },

    { daySlot: 4, japanese: '他に誰か誘う？', english: [
        "should we invite anyone else",
        "wanna keep it small or invite more people?",
        "should we ask anyone else? or just us? I'm cool either way",
        "should we invite anyone else? and this is a loaded question. 'cause if I say 'let's keep it small' that sounds exclusive. and if I say 'invite everyone' then it becomes a whole production. there's a sweet spot between 'lonely' and 'overwhelmed' and it's exactly four people. four is the perfect group size. I'll die on this hill."
    ], context: "should we invite...?のinviteは日本語の「誘う」とニュアンスが違う。日本語の「誘う」はカジュアルだけど、英語のinviteはちょっとフォーマル。カジュアルならask(聞く)を使う。Should we ask someone else?のほうが日常的。I'm cool either way(どっちでもいい)のcool=OK。coolは「かっこいい」だけじゃなくて「了解」の意味で毎日使う。" },

    { daySlot: 4, japanese: '楽しみにしてる', english: [
        "can't wait",
        "can't wait, this is gonna be awesome",
        "I'm looking forward to it, it's gonna be a great time",
        "can't wait. and I literally mean I cannot wait. my patience for good things is zero. when somethin' fun is planned, the time between now and then is TORTURE. it crawls. every minute is an hour. but when the fun actually starts? it flies. time is a scam. it goes slow when you want fast and fast when you want slow. rigged."
    ], context: "can't waitは「待てない」=「楽しみ」。否定で期待を表現する。面白いのは、英語は楽しみ=待てないと否定形で言うこと。日本語の「楽しみ」はポジティブ直球。英語は「待てない(ほど楽しみ)」と裏から攻める。I'm dying to go(死ぬほど行きたい)も否定的な単語(dying)でポジティブを表現する。英語は大げさな否定=最上級の肯定。" },

    { daySlot: 4, japanese: 'じゃあ決まりね', english: [
        "it's a plan",
        "alright, it's a plan then, I'll text you the details",
        "cool, so we're doing this, let's lock it in before someone bails",
        "it's a plan. and I'm sayin' that now to make it official 'cause if I don't say it, it's just a 'maybe' floatin' in the air. and 'maybe's die. they drift away. they dissolve. but 'it's a plan' -- that's concrete. that's commitment. well, commitment-adjacent. it's a plan until someone texts 'hey, about tomorrow...' which is the universal cancel preface."
    ], context: "it's a planは「決まり」を宣言するフレーズ。planと名詞にすることで確定感を出す。lock it in(確定させる)のlockは鍵をかけるイメージ。予定に鍵をかけて動かないようにする。bail(逃げる)は保釈金(bail)から。約束から保釈される=ドタキャン。英語は約束を「拘束」、キャンセルを「脱獄」と表現する。約束は牢獄。面白い。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 5: 断る (Declining) -- CONNECT
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 5, japanese: 'ごめん、無理', english: [
        "I can't make it",
        "sorry, I can't make it, bad timing",
        "I wish I could but I really can't, I'm so sorry",
        "I can't make it. and I hate sayin' that 'cause I wanna be a 'yes' person. I wanna be the person who shows up to everything. but I'm not. I'm a 'check my energy levels first' person. and right now my energy is at like 12%. which is enough to exist but not enough to socialize. existing is a full-time job. socializing is overtime."
    ], context: "I can't make itのmake itは「間に合う」「たどり着く」。「作る」じゃない。make it to the partyで「パーティーに到達する」。日本語の「無理」は能力の限界だけど、英語のI can't make itは「物理的にそこに到達できない」。断りの表現に移動のイメージがある。行けない=到達不能。英語の断りは距離の問題。" },

    { daySlot: 5, japanese: '今回はパスで', english: [
        "I'll pass",
        "I'll pass this time, but next time for sure",
        "I'm gonna sit this one out, but hit me up next time",
        "I'll pass. and pass is perfect 'cause it's borrowed from card games. when you pass in cards, you skip your turn. you're not quittin' the game. you're just sayin' 'not this round.' and that's exactly what I'm doin'. I'm still in the game. I'm still your friend. I'm just skippin' this particular hand. deal me in next time."
    ], context: "passは「パスする」。カードゲーム由来で「自分のターンをスキップ」。sit this one outは「この回は座って見てる」。元はダンスで、踊りを一回休むこと。英語の断り表現にはゲームやダンスの比喩が多い。rain check(また今度)も野球の雨天中止券が由来。断りに遊びの語彙を使うから深刻にならない。軽い。" },

    { daySlot: 5, japanese: 'また今度ね', english: [
        "rain check",
        "rain check? I really do wanna go, just not this time",
        "can I take a rain check? I promise I'm not just saying that",
        "rain check. and I know 'rain check' sounds like a polite no. and sometimes it is. but THIS rain check is genuine. I actually wanna go. just not today. today is a no. but future me? future me is a yes. future me has energy and enthusiasm and a clean outfit. current me has none of those things. trust future me."
    ], context: "rain checkは野球由来。雨で試合が中止になると、チケットの代わりに次回使える券(rain check)をもらえた。「今日は無理だけど次回ね」の意味で日常に定着。英語は断りをチケットにする。「次回使える権利を発行します」という商取引的な発想。日本語の「また今度」は約束が曖昧。英語はrain check=権利の保証。形がある断り。" },

    { daySlot: 5, japanese: '行きたいけど...', english: [
        "I wish I could",
        "I wish I could, honestly, but I just can't swing it",
        "trust me, I wanna go SO bad, but I've got something I can't move",
        "I wish I could. and that 'wish' is doin' a lot of work. 'wish' means 'in an alternate universe where I'm not me, I'd be there.' but in THIS universe, I have obligations. and obligations are the enemy of fun. every time somethin' fun comes up, obligations show up like 'remember us?' yes. I remember. unfortunately."
    ], context: "I wish I couldは仮定法。wishは「現実と違う希望」専用動詞。I hope=実現可能。I wish=実現不可能。I hope I can go(行けるといいな)は可能性あり。I wish I could go(行けたらなあ)は無理っぽい。hopeとwishで可能性の温度が全然違う。日本語の「行きたいけど」は文を閉じない。英語はwishで不可能を先に宣言する。" },

    { daySlot: 5, japanese: 'その日ちょっと...', english: [
        "that day's no good",
        "that day doesn't work for me, sorry",
        "I actually have something that day, can we do a different day?",
        "that day's no good. and I'm not gonna tell you why 'cause sometimes the reason is embarrassing. like 'I have a dentist appointment' is fine. but 'I'm binge-watching a show and I'm at a critical point in the plot' is less fine. the REAL reason is always less noble than the vague excuse. 'that day doesn't work' is a gift. accept it without questions."
    ], context: "that day doesn't work for meは「その日は自分には機能しない」。またworkが出てくる。予定=機械、日程=その機械が動くかどうか。日本語の「その日ちょっと...」は文を最後まで言わない。「ちょっと」で止めて理由を濁す。英語もthat day doesn't workで理由を言ってない。でも英語版は「機能しない」と機械のせいにしてる。日本語は濁す、英語はシステムのせいにする。" },

    { daySlot: 5, japanese: '気持ちは嬉しいけど', english: [
        "I appreciate the offer",
        "I appreciate the offer, really, but I'll have to pass",
        "that's really sweet of you to ask, but I'm gonna have to say no this time",
        "I appreciate the offer. and I want you to know I'm not just sayin' that. I genuinely appreciate being asked. bein' invited is a compliment. it means you thought of me. you went through your mental contact list and my name came up. that's nice. I just can't. but the thought? the thought is appreciated. the thought gets an A+."
    ], context: "I appreciate the offerは大人の断り方。appreciate=「価値を認める」。日本語の「気持ちは嬉しい」は感情を返す。英語は「提案の価値を認めます」とビジネスっぽい。offerは「提供」で、誘いを商品のように扱ってる。「商品は素晴らしいですが購入は見送ります」的な。英語の丁寧な断りはビジネスレターに近い。感情じゃなくて評価で断る。" },

    { daySlot: 5, japanese: '考えとくね', english: [
        "let me think about it",
        "let me think about it and I'll get back to you",
        "hmm, lemme sleep on it, I'll let you know tomorrow",
        "let me think about it. which is code for either 'I need time to come up with a good excuse' OR 'I genuinely need to check.' it's 50/50. even I don't know which one it is yet. my brain hasn't decided if it wants to say yes or manufacture a reason to say no. I'm waitin' for my own answer. it's like a Magic 8-Ball in there. ask again later."
    ], context: "let me think about itは「考えさせて」。でも70%は断りの前兆。sleep on itは「一晩寝かせる」=枕の上で考える。英語は思考を「寝る」と結びつける。日本語の「考えとく」も本当に考える場合と断りの場合がある。万国共通の曖昧表現。I'll get back to you(また連絡する)も半分は連絡しない。未来形の約束は現在の逃げ道。" },

    { daySlot: 5, japanese: '先約があって', english: [
        "I already have plans",
        "I already have plans, otherwise I'd totally be there",
        "I'm already committed to something else, such bad timing",
        "I already have plans. and it's the perfect excuse 'cause it's uncheckable. you can't verify my plans. you can't look up my calendar. 'I have plans' is the undefeatable defense. nobody says 'what plans?' 'cause that's invasive. so 'I have plans' is the conversation ender. it's the uno reverse card of social obligations. checkmate."
    ], context: "I already have plansは最強の断り文句。「既に予定がある」。alreadyが「もう埋まってる」の確定感を出す。committedは「約束済み」で、commitment(約束)が入ってる。面白いのは英語の予定=commitmentsで、コミットメント=拘束。約束が先にあると新しい誘いが入れない。予定は椅子取りゲーム。先に座った人が勝ち。" },

    { daySlot: 5, japanese: '体調悪くて', english: [
        "I'm not feeling well",
        "I'm not feelin' great, I think I'm coming down with something",
        "I'm kinda under the weather, I don't wanna push it",
        "I'm not feelin' well. and I know this sounds like a convenient excuse and honestly? sometimes it is. but sometimes it's real. and the problem is nobody can tell the difference. there's no way to prove you're sick without a doctor's note and I'm not goin' to the doctor to prove to you that I can't come to dinner. so you'll just have to trust me. or not. but I'm stayin' home either way."
    ], context: "under the weatherは「体調悪い」。直訳は「天気の下」。航海用語で、船乗りが嵐で体調崩すことから来た。天候=体調の比喩。coming down with something(何かにかかりそう)のdown=降下。病気は上から降ってくる。catch a cold(風邪を捕まえる)も面白い。英語では風邪は自分が捕まえるもの。被害者じゃなくて捕獲者。" },

    { daySlot: 5, japanese: '次は絶対行く', english: [
        "next time for sure",
        "next time, I swear, I'll be there, a hundred percent",
        "I'm dead serious, next time count me in, no excuses",
        "next time for sure. and I know 'for sure' has lost all meaning 'cause people say it and then don't follow through. but MY 'for sure' is at least 80% reliable. which is higher than the national average. I've done the math. most people's 'for sure' is a 40% at best. mine's 80. that's double. respect the 80. it's the best I can offer."
    ], context: "for sureは「絶対」。でも英語のfor sureは確信度にグラデーションがある。definitely(確実)>for sure(まず間違いなく)>probably(たぶん)>maybe(もしかしたら)。日本語の「絶対」は100%感があるけど、英語のfor sureは90%くらい。隙間がある。count me in(参加で)はカードゲーム用語。チップを入れる=参加する。また賭け事の言語。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 6: 別れ (Parting) -- CONNECT
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 6, japanese: 'じゃあね', english: [
        "see ya",
        "alright, see ya, take care",
        "OK I'm out, see you later, don't do anything I wouldn't do",
        "see ya. and 'see ya' is interesting 'cause it's a promise you can't keep. you're not guaranteein' that you'll see them. you're just... sayin' words. it's a verbal handshake. the content doesn't matter. the gesture does. 'see ya' could mean tomorrow, next week, or never. but it sounds warm. and warm is all that matters at the door."
    ], context: "see yaはsee youの口語圧縮。youがyaになるのは英語の超基本カジュアル化。see you→see ya、thank you→thank ya、love you→love ya。youがyaになった瞬間に親密度が上がる。フォーマルなyouとカジュアルなyaの差は、日本語の「あなた」と「お前」くらい違う。でも英語はたった一文字の差。効率的。" },

    { daySlot: 6, japanese: 'また今度ね', english: [
        "let's do this again",
        "let's do this again soon, this was fun",
        "we gotta do this again, seriously, let's not wait so long next time",
        "let's do this again. and I always say 'again' at the end of hangin' out and then three months pass. the gap between 'let's do this again' and actually doin' it again is the biggest distance in the universe. it's bigger than space. space is finite. 'let's do this again soon' is infinite. soon is a black hole where plans go to die."
    ], context: "let's do this againは「またやろう」。againは「再び」だけど、別れ際のagainは社交辞令色が強い。soonを付けるとlet's do this again soon。このsoonは宇宙で最も長い「すぐ」。明日かもしれないし来年かもしれない。日本語の「また今度」も同じ時間の曖昧さがある。「今度」がいつかは誰にもわからない。万国共通の先送り。" },

    { daySlot: 6, japanese: '気をつけてね', english: [
        "be safe",
        "be safe out there, text me when you get home",
        "get home safe, OK? the roads are crazy this time of night",
        "be safe. and I mean it. text me when you get home. I know that sounds like a parent thing but I don't care. I wanna know you arrived alive. 'cause my brain does this thing where if I don't hear from you, I assume the worst. not 'you forgot to text.' the WORST. car accident. kidnapping. aliens. my brain goes there. so please. one text. 'home.' that's all I need."
    ], context: "text me when you get homeは「着いたら連絡して」。英語圏でもこれは友達間の定番。be safeのsafeは「安全な状態でいて」と命令形。英語の別れ際は命令形が多い。Take care(気をつけろ)、Stay safe(安全でいろ)、Be good(いい子でいろ)。全部命令。日本語は「気をつけてね」と「ね」で柔らかくするけど、英語は直球命令を愛情として投げる。" },

    { daySlot: 6, japanese: '楽しかった！', english: [
        "that was a blast",
        "that was a blast, I had such a good time",
        "honestly, this was the most fun I've had in a while, thank you",
        "that was a blast. and I don't say that about everything. I have standards. most hangin' out is 'fine.' some is 'good.' this was a BLAST. that's top tier. my hangout ranking goes: meh, fine, good, great, blast. you made blast. congratulations. that's rare. I'm stingy with blasts. you earned it."
    ], context: "blastは「爆発」=「超楽しかった」。爆発的な楽しさ。英語は楽しさをいつも派手に表現する。blast、ball、time of my life。感想に演出を入れる文化。日本語の「楽しかった」はシンプルに事実報告。英語は「爆発だった」と感想を映画のレビューみたいに評価する。星5つみたいな。別れ際のレビューが高いと次回も誘われる。レーティング社会。" },

    { daySlot: 6, japanese: 'お疲れ〜', english: [
        "good job today",
        "great work today, go get some rest",
        "nice job, you crushed it today, go home and relax",
        "good job today. and 'otsukaresama' doesn't exist in English which is a crime. the closest is 'good job' or 'great work' but those are evaluations. otsukaresama isn't judgin' your work. it's acknowledgin' your tiredness. it's sayin' 'I see that you're tired and I respect it.' English doesn't have that. English rates your output. Japanese validates your effort."
    ], context: "お疲れは英語に直訳できない四天王の一角(よろしく、いただきます、お疲れ、お世話になってます)。英語のgood jobは「いい仕事した」で成果を評価してる。日本語の「お疲れ」は「疲れましたね」で労いの気持ち。成果じゃなくて疲労を認める。文化の差がモロに出る。英語は結果主義、日本語はプロセス重視。翻訳不能には理由がある。" },

    { daySlot: 6, japanese: '先に帰るね', english: [
        "I'm gonna head out",
        "I'm gonna head out first, you guys stay and have fun",
        "I gotta take off, but don't let me kill the vibe, keep going",
        "I'm gonna head out. and I know leavin' first is always awkward. you feel like you're abandonin' the group. but someone's gotta be first. someone's gotta break the seal. and once the first person leaves, everyone else starts checkin' their phones. I'm not killin' the party. I'm givin' everyone else permission to leave. I'm a hero. you're welcome."
    ], context: "head outは「出発する」。headは「頭」が動詞化して「向かう」になってる。頭の向き=進行方向。head out(外に向かう)、head home(家に向かう)、head over(そっちに向かう)。take off(離陸する)も使う。まるで飛行機。英語の「帰る」は移動のイメージが強い。日本語は「先に帰るね」と順番(先に)を示すけど、英語は方向(out)を示す。" },

    { daySlot: 6, japanese: 'そろそろ行かないと', english: [
        "I should head out",
        "I should probably head out, it's gettin' late",
        "as much as I wanna stay, I really gotta go, I've got an early start",
        "I should probably head out. 'probably.' that probably is doin' so much work. it's the cushion between 'I want to stay' and 'I need to leave.' without probably, it sounds abrupt. with probably, it sounds like I'm still debatin'. I'm not debatin'. I've decided. but probably makes the exit softer. it's an emotional air bag for goodbyes."
    ], context: "probablyは「たぶん」だけど、ここでは柔らかくするクッション。I should go(行かなきゃ)→I should probably go(そろそろ行かなきゃかな)。probablyを入れると確定感が薄れて「まだ迷ってます感」が出る。日本語の「そろそろ」も同じ機能。「そろそろ」=「もうすぐだけどまだ」。どっちも「帰りたいけど帰りたくない演技」をしてる。" },

    { daySlot: 6, japanese: 'また連絡するね', english: [
        "I'll hit you up",
        "I'll text you, let's figure out the next one",
        "I'll reach out soon, we gotta make plans before too long",
        "I'll hit you up. and 'hit you up' sounds slightly violent if you think about it. I'll HIT you UP. but nobody questions it 'cause it's just how we talk. reach out is another one. I'll REACH out. like you're drowning and I'm extendin' my hand. no. I'm just textin'. but English makes textin' sound heroic. every message is a rescue mission."
    ], context: "hit you upは「連絡する」のスラング。hit(打つ)+up(方向)で「連絡を叩きつける」。reach out(手を伸ばす)もカジュアルに使う。英語は「連絡」を物理的な動作で表現する。hit up、reach out、get in touch(接触する)、drop a line(一行落とす)。全部身体が動いてる。日本語の「連絡する」は抽象的だけど、英語は毎回体が何かしてる。" },

    { daySlot: 6, japanese: '送ってこうか？', english: [
        "want a ride",
        "need a ride? I can drop you off, it's on my way",
        "let me give you a ride, it's late and I don't want you walking alone",
        "want a ride? and I know you're gonna say 'nah, I'm fine' but you're not fine. it's cold. it's dark. and the walk is longer than you think. every walk home at night is longer than you think. distance doubles after midnight. that's science. OK it's not science but it feels true. just get in the car. your pride can ride shotgun."
    ], context: "rideは「乗ること」。give you a rideは「乗せてあげる」。drop you offのdrop off=降ろす。人をまるで荷物みたいに「降ろす」。pick up(拾う)→ride(運ぶ)→drop off(降ろす)。英語の車移動は宅配便の動詞と同じ。人を拾って、運んで、降ろす。乗客=荷物。効率的だけどちょっと雑。on my way(途中だから)は「ついでに」の意味。" },

    { daySlot: 6, japanese: 'おやすみ', english: [
        "night",
        "g'night, sleep well, see you tomorrow",
        "alright, I'm calling it a night, sweet dreams if you're heading to bed too",
        "night. and the fact that good night became g'night became night shows how English compresses over time. three words to two to one. in fifty years it'll probably be just 'n.' efficiency at the cost of warmth. but honestly? 'night' said with the right tone carries the same weight as 'good night, dear friend, may your slumber be peaceful.' tone > words. always."
    ], context: "good nightがg'nightになり、さらにnightだけになる。英語の圧縮進化が見える。calling it a night(今夜はこれで終わりにする)はcall it(宣言する)のパターン。call it a day(今日は終わり)、call it quits(やめる)。callは「呼ぶ」だけじゃなくて「宣言する」。審判がアウトを宣言するように、自分で終了を宣言する。人生はセルフジャッジ。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 27: 場所 (Directions) -- NAVIGATE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 27, japanese: 'ここどこ？', english: [
        "where are we",
        "wait, where are we? I'm totally lost",
        "I have no idea where we are right now, do you?",
        "where are we? 'cause nothin' looks familiar. I thought I knew this area but apparently I don't. my brain's GPS just said 'recalculating' and then gave up. it's not recalculating. it's bufferin'. it's starin' at the map like I'm starin' at the map. we're both lost. me and my brain. a team of losers."
    ], context: "Where are we?は「ここどこ?」。日本語は「ここ」=場所が主語。英語はwe=自分たちが主語。「この場所はどこ?」じゃなくて「私たちはどこにいる?」。同じ状況なのに視点が逆。日本語は地図目線、英語は自分目線。迷子でも主語は自分。英語は常に「俺が今どこにいるか」を基準にする。" },

    { daySlot: 27, japanese: '右に曲がって', english: [
        "turn right",
        "turn right here, right at this light",
        "take a right at the next intersection, you'll see it",
        "turn right. right HERE. no, you passed it. that was it. the turn was RIGHT THERE. OK now we gotta go around the block. and I know I said 'turn right' too late but in my defense, it came up faster than I expected. streets do that. they just appear. it's not my fault streets are sneaky."
    ], context: "turn rightのturnは「回る」。曲がるんじゃなくて回る。take a rightも使う。右折を「取る」。日本語は「曲がる」で体が曲がるイメージ。英語は体を「回す」か、右折を「取る」。面白いのはhang a right(右にぶら下がる)というスラングもある。右折にこんなにバリエーションがある言語、他にない。" },

    { daySlot: 27, japanese: 'まっすぐ行って', english: [
        "go straight",
        "just go straight, it's up ahead",
        "keep going straight for like two blocks, you can't miss it",
        "go straight. just... straight. don't turn. don't do anything creative. straight. I know that sounds simple but you'd be surprised how many people can't go straight. they drift. they wander. they see a shiny thing and veer off. this is not the time for exploration. this is the time for straight. commit to straight."
    ], context: "go straightは「まっすぐ行って」。keep goingも同じ。straightは「まっすぐ」以外にstraight answer(率直な答え)、straight up(マジで)にも使う。曲がらない=嘘がない=正直。英語では「まっすぐ」=「正直」。曲がる人は信用できない。道案内と人格が同じ形容詞。道徳は道路から来てる。" },

    { daySlot: 27, japanese: '近い？', english: [
        "is it close",
        "is it close? like walkin' distance?",
        "how far is it? are we talkin' five minutes or thirty?",
        "is it close? and when I say 'close' I mean 'can I walk there without wantin' to die.' 'cause people have very different definitions of close. someone once told me a place was 'close' and it was a forty-minute drive. that's not close. that's a road trip. we need a universal standard for close. like, under ten minutes. anything else is 'far.'"
    ], context: "Is it close?は距離を聞いてるけど、本当に聞いてるのは「歩けるか?」「タクシー必要か?」。walking distance(歩ける距離)という表現がある。車社会のアメリカでwalking distanceは「例外的に近い」の意味。日本語は「近い?」で済むけど、英語圏では「何で行く近さ?」まで聞かないと答えが出ない。移動手段込みの距離感。" },

    { daySlot: 27, japanese: '迷った', english: [
        "I'm lost",
        "I'm totally lost, nothin' looks right",
        "I've been walking in circles, I think I'm completely lost",
        "I'm lost. and not in a deep philosophical 'lost in life' way. literally lost. geographically. my body is in the wrong location. and Google Maps is tellin' me to 'continue north' but I don't know which way north is. I'm not a compass. I'm a person. tell me left or right. north is not helpful. north is for birds."
    ], context: "I'm lostは物理的に「迷った」と精神的に「途方に暮れた」の両方で使える。lost in thought(考え事に迷い込む)、lost in translation(翻訳で迷子)。英語は「迷う」を空間的に処理する。日本語も「迷う」は判断と道の両方に使うから似てるけど、英語はI'm lost=「自分が消えた場所にいる」。存在が行方不明。" },

    { daySlot: 27, japanese: 'あの建物の隣', english: [
        "next to that building",
        "it's right next to that big building over there",
        "you see that building? it's right next to it, can't miss it",
        "next to that building. that one. the big one. no, not THAT big one. the OTHER big one. why are there two big ones? this is the problem with 'next to' as a direction. it assumes there's only one landmark. but there's always two. or three. and now we're playin' 'which building' instead of actually gettin' there."
    ], context: "next toは「隣」。英語の位置表現は前置詞が命。next to(隣)、across from(向かい)、behind(後ろ)、between(間)。日本語は「隣」「向かい」で済むけど、英語は全部前置詞+名詞のセット。右隣はto the right of、左隣はto the left of。位置を説明するのに部品が多い。道案内は前置詞の総合試験。" },

    { daySlot: 27, japanese: '何番出口？', english: [
        "which exit",
        "which exit do I take? there's like five of them",
        "do you know which exit number? I keep picking the wrong one",
        "which exit? 'cause I'm standin' here starin' at a sign with twelve options and none of 'em make sense. exit 3A? 3B? what happened to just 3? why does 3 need sub-categories? and the arrows are pointin' in directions that don't exist on a compass. this sign was designed by someone who hates people."
    ], context: "which exit?のwhichは「どの」。英語はwhich(どの)とwhat(何)を使い分ける。選択肢が限られてるときはwhich、オープンなときはwhat。What color?(何色?)vsWhich color, red or blue?(赤と青どっち?)。日本語は「どの」「何」の使い分けがもっとゆるい。英語は選択肢の範囲によって疑問詞を変える。几帳面。" },

    { daySlot: 27, japanese: 'ここで合ってる？', english: [
        "is this the right place",
        "is this it? this doesn't look right",
        "are we in the right spot? it looks completely different from the picture",
        "is this it? 'cause this does NOT look like the photos. the photos showed a cute little building with flowers. this is a concrete box next to a dumpster. either the photos lied or we're at the wrong place. I'm hopin' it's the wrong place 'cause if this IS it, I have questions. many questions. mostly about the dumpster."
    ], context: "Is this the right place?のrightは「正しい」。英語はright place(正しい場所)、right time(正しい時間)、right person(正しい人)と何にでもrightを付けて「正解」を確認する。日本語は「合ってる?」で照合してる。英語は「正しい?」で正解を聞いてる。照合vs正誤判定。微妙に違うけど、結局やってることは同じ。不安の表現方法が違うだけ。" },

    { daySlot: 27, japanese: '通り過ぎた', english: [
        "we passed it",
        "we passed it, go back, it was back there",
        "I think we went too far, we definitely passed it already",
        "we passed it. I KNEW we passed it. I felt it in my gut five minutes ago but I didn't say anything 'cause I wasn't sure and I didn't wanna be wrong. and now we're definitely past it and I was right and I'm annoyed at myself for not speakin' up. the gut was right. the gut is always right. I need to start trustin' the gut."
    ], context: "We passed itは「通り過ぎた」。passは「通過する」「合格する」「パスする」全部同じ単語。pass the test(試験に受かる)もpass the salt(塩を渡す)もpass away(亡くなる)も全部pass。通過=移動の概念が全てのpassに入ってる。時間もpass(過ぎる)。人生もpass。英語ではすべてが通り過ぎていくもの。" },

    { daySlot: 27, japanese: 'あっちの方', english: [
        "over there",
        "it's over there, that way, see?",
        "it should be over in that direction, past the traffic light",
        "over there. and I'm pointin' but my pointin' is vague and I know it. I'm gesturin' in a general direction like a broken compass. 'that way' could mean fourteen different things. but I'm committed to the point now. I can't take it back. so just... go that way. broadly. we'll figure it out. exploration is fun. supposedly."
    ], context: "over thereのoverは「あっち側に」。thereだけでも「そこ」だけど、overを足すと「向こう側に」と距離感が出る。right there(すぐそこ)、over there(あっちの方)、way over there(ずっとあっち)。英語は距離の微調整ができる。日本語は「そこ」「あそこ」の2段階。英語はthere系だけで3段階以上。距離に解像度がある。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 28: 買い物 (Shopping) -- NAVIGATE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 28, japanese: 'これください', english: [
        "I'll take this one",
        "I'll take this one, can you wrap it up?",
        "I'll go with this one, and do you do gift wrapping?",
        "I'll take this one. and I love how English uses 'take' for buyin'. you're takin' it. like it's yours already. you haven't paid yet but the language says you're already takin' it. Japanese uses 'ください' which is 'please give me.' humble. polite. English? nah. I'M takin' it. ownership first, payment second. confidence is built into the grammar."
    ], context: "I'll take thisのtakeは「取る」。日本語は「ください」=「くれ」で相手にお願いする。英語は「俺が取る」と自分から行く。注文でもI'll haveは「俺が持つ」。全部能動的。レストランでもI'll have the pasta=「パスタを持つことにする」。英語の買い物は狩り。商品は獲物。取りに行く。" },

    { daySlot: 28, japanese: 'いくら？', english: [
        "how much",
        "how much is this? there's no price tag",
        "excuse me, how much does this run? I don't see a price",
        "how much? and I'm askin' casually but inside I'm doin' emergency math. 'cause if it's over budget I need to do the face. you know the face. the 'hmm interesting let me think about it' face. which means 'absolutely not but I don't wanna say that out loud.' everyone has the face. the face protects our dignity in stores."
    ], context: "How much?は金額を聞く定番。面白いのはHow much does it run?という表現。直訳すると「これいくらで走る?」。値段が「走る」。英語は値段を動きで表現する。prices go up(上がる)、prices drop(落ちる)、it runs about $50(50ドルくらいで走る)。値段は動物みたいに走り回ってる。固定されてない感覚。" },

    { daySlot: 28, japanese: 'カードでいい？', english: [
        "do you take card",
        "can I pay by card? or is it cash only?",
        "do you guys take credit cards or should I hit the ATM first?",
        "do you take card? and please say yes 'cause I have exactly zero cash. I'm a card person. my wallet is just cards. loyalty cards, gift cards, credit cards, a library card I haven't used since 2019. but cash? no. cash is a rumor. I've heard of it. people used to use it. like VHS tapes. a relic."
    ], context: "Do you take card?のtakeは「受け取る」。お店が支払い方法を「取る」かどうか。日本語は「カードでいい?」と聞くけど、英語は「カードを受け取ってくれる?」と聞く。Do you accept...?はフォーマル版。take=カジュアル、accept=フォーマル。同じことを聞いてるのに動詞で丁寧さが変わる。服装みたいなもの。" },

    { daySlot: 28, japanese: '他の色ある？', english: [
        "got this in another color",
        "do you have this in a different color? maybe black?",
        "I love the style but not the color, do you carry it in anything else?",
        "got this in another color? 'cause I like the shape and the size and the feel and everything about it EXCEPT the color. and the color is the one thing I can't unsee. I'll be wearin' it and just... thinkin' about the color. it'll haunt me. I need a different color or I need therapy. the color is cheaper."
    ], context: "Do you have this in...?は「これの〜版ある?」。in a different color、in a size M、in blue。inで変数を差し替える。日本語は「他の色ある?」で色を聞くけど、英語はthis in another colorで「この商品のカラバリ」を構造的に聞く。inが「バリエーション切り替えスイッチ」として働いてる。便利なin。" },

    { daySlot: 28, japanese: '試着していい？', english: [
        "can I try this on",
        "mind if I try this on? where's the fitting room?",
        "is it OK if I try this on real quick? I just wanna check the fit",
        "can I try this on? 'cause I've been burned before. it looks great on the hanger. perfect on the mannequin. and then I put it on and it looks like I'm wearin' a tent. the mirror in the fitting room never lies. that's why I need the fitting room. the hanger lies. the mannequin lies. the mirror is brutally honest."
    ], context: "try onのonは「身につける」。try it on(試しに着てみる)のonが着用を意味する。put on(着る)、take off(脱ぐ)、have on(着てる)。英語の服はon/offで管理する。スイッチみたい。日本語は「着る」「脱ぐ」「試着」と全部別の動詞。英語はon/offの2つで衣類の全操作をカバー。シンプルだけど無機質。服がスイッチ扱い。" },

    { daySlot: 28, japanese: '返品したいんですけど', english: [
        "I'd like to return this",
        "hey, I need to return this, I've got the receipt",
        "I'd like to return this if possible, it didn't work out",
        "I'd like to return this. and I can already feel the cashier judgin' me. they're not sayin' it but their eyes are sayin' 'what was wrong with it?' and the answer is 'nothing was wrong with it, I just changed my mind.' which is a perfectly valid reason. buyer's remorse is real. it's a medical condition. probably. I haven't googled it."
    ], context: "I'd like to return thisはとても丁寧。I'd like to=I want toのソフト版。returnは「返す」だけど、元いた場所に「戻す」のニュアンス。日本語の「返品」は品物を返す。英語は「物を元の場所に戻す」。面白いのはit didn't work out(うまくいかなかった)が返品理由の万能フレーズになること。人間関係の破綻と同じ言い回し。商品とも別れる。" },

    { daySlot: 28, japanese: 'レシートいらない', english: [
        "no receipt",
        "I'm good on the receipt, thanks",
        "you can skip the receipt, I don't need it, thanks though",
        "no receipt. and the cashier always hesitates. like they wanna warn me. 'but what if you need to return it?' I won't. I've never returned anything using a receipt. receipts go in my pocket, then the washing machine, then they become confetti. that's the lifecycle of a receipt in my house. pocket, laundry, garbage. every time."
    ], context: "I'm good on the receiptのI'm goodは「大丈夫です」の万能表現。No, thank you.より柔らかい。I'm goodは断りのクッション。食事で「おかわりは?」「I'm good」=「もう十分」。英語のgoodは「良い」だけじゃなくて「足りてる」「不要」の意味にもなる。goodは満足の表現であり、丁寧な拒否でもある。忙しい単語。" },

    { daySlot: 28, japanese: '袋いる？', english: [
        "need a bag",
        "do you need a bag? or are you good?",
        "want me to bag that for you or are you all set?",
        "need a bag? and this question didn't exist ten years ago. bags were just... given. no one asked. but now it's a whole decision. paper or plastic? bring your own? how many items before a bag becomes necessary? three items, no bag, you're a hero. ten items, no bag, you're an acrobat. there's a threshold and nobody knows where it is."
    ], context: "Do you need a bag?は店員の定番フレーズ。Are you all set?もよく聞く。all setは「全部セット完了」=準備万端。日本語の「袋いる?」はストレート。英語はneed a bag?(必要?)とwant a bag?(欲しい?)で微妙に違う。needは必要性、wantは欲求。店員はneedを使うことが多い。欲しいかどうかじゃなくて、必要かどうかを聞いてる。合理的。" },

    { daySlot: 28, japanese: 'おつり', english: [
        "keep the change",
        "here, keep the change, don't worry about it",
        "you can keep the change, it's not worth the coins anyway",
        "keep the change. and I say that like I'm bein' generous but really I just don't want coins. coins are heavy. coins are loud. coins fall out of your pocket at the worst time. in a quiet room. during a meeting. everyone turns around. you're on the floor chasin' a quarter like a pirate. I'd rather lose the money than carry coins."
    ], context: "keep the changeは「おつりはいいよ」。直訳は「変化を保持して」。changeは「変化」と「おつり」が同じ単語。元の金額から変化した差額=おつり。英語は「差額」を「変化」で表現する。日本語の「お釣り」は「釣る」から来てる。釣り=天秤で釣り合わせる。どっちも面白い語源。英語は変化、日本語はバランス。" },

    { daySlot: 28, japanese: 'これセールになる？', english: [
        "does this go on sale",
        "any chance this goes on sale soon? I can wait",
        "is this gonna be on sale anytime soon or is this the best price?",
        "does this go on sale? 'cause I like it but I don't 'full price' like it. I 'thirty percent off' like it. maybe 'forty percent off' like it. there are levels of like, and each level has a price range. full price is love. on sale is strong like. clearance is impulse. I'm in the 'strong like' zone. I need a discount to commit."
    ], context: "go on saleは「セールになる」。英語はon saleとfor saleを区別する。on sale=値下げ中、for sale=売り出し中。onは「値引きイベントの上に乗ってる」、forは「売る目的がある」。日本語は両方「セール」「売り出し」で済むけど、英語はon/forで意味が全然違う。間違えると「これ安い?」のつもりが「これ売り物?」になる。前置詞こわい。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 29: トラブル (Trouble) -- NAVIGATE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 29, japanese: '助けて', english: [
        "help",
        "somebody help! I need help over here!",
        "can somebody please help me? this is an emergency!",
        "HELP! and it's funny how help is one of the first English words everyone learns but nobody practices sayin' it out loud. we practice 'hello' and 'thank you' but not 'help.' and then when you actually NEED it, it gets stuck. the most important word and it's the one that freezes. languages are cruel that way."
    ], context: "helpは1語で完結する。日本語の「助けて」は「助ける」+「て」で依頼形。英語はhelpだけ。1語。しかも名詞にもなる。I need help(助けが必要)。動詞にも名詞にも使える。ちなみにhelp yourselfは「ご自由にどうぞ」。助ける=自分で自分を助けろ。セルフサービスの精神がここにも。" },

    { daySlot: 29, japanese: '財布盗まれた', english: [
        "my wallet got stolen",
        "someone stole my wallet, I don't know what to do",
        "my wallet's gone, I think someone took it, what do I do?",
        "my wallet got stolen. and my whole life was in there. cards, ID, that punch card from the coffee shop with eight stamps. EIGHT. I was two away from a free latte. the thief doesn't even know what they took from me. the money I can replace. the credit cards I can cancel. but those eight stamps? gone forever. that's the real crime."
    ], context: "got stolenは受動態のカジュアル版。was stolenよりgot stolenの方が口語的で「やられた感」が出る。英語のgotは受動態に悔しさを足す。I got fired(クビにされた)、I got dumped(フラれた)。全部gotで「被害を受けた」ニュアンス。wasは客観的事実、gotは主観的被害感情。gotは悔しさの動詞。" },

    { daySlot: 29, japanese: '壊れた', english: [
        "it's broken",
        "it just broke, I didn't even do anything",
        "it stopped working out of nowhere, I swear I didn't break it",
        "it broke. and before you ask -- no, I didn't drop it. no, I didn't sit on it. no, I didn't spill anything on it. it just BROKE. spontaneously. on its own. things do that sometimes. they wake up and choose death. and now I'm standin' here holdin' a dead machine like a funeral for technology. rest in pieces."
    ], context: "It's brokenとIt brokeは違う。It's broken=壊れてる状態。It broke=壊れた瞬間。日本語は「壊れた」で両方いける。英語は状態と出来事を時制で区別する。しかもI broke it(俺が壊した)とIt broke(勝手に壊れた)で責任の所在が変わる。主語を物にすれば無罪。英語は主語選びが裁判。" },

    { daySlot: 29, japanese: '警察呼んで', english: [
        "call the police",
        "someone call the police! right now!",
        "we need to call the cops, this is serious, does anyone have a phone?",
        "call the police! and I've never actually said this in real life before. it's one of those phrases you know but never use. like the fire extinguisher instructions. you KNOW they're there but you've never read 'em. and now I'm yellin' it and it doesn't feel real. it feels like I'm in a movie. a bad movie. with no budget."
    ], context: "call the policeのcallは「呼ぶ」。日本語も「呼ぶ」だから同じ。でもcops(警官)というカジュアル版がある。police=フォーマル、cops=カジュアル。緊急時はpolice、友達との会話ではcops。日本語は「警察」一択。英語はフォーマル度で単語が変わる。同じものを指してるのに着せ替えが必要。" },

    { daySlot: 29, japanese: 'パスポートなくした', english: [
        "I lost my passport",
        "I can't find my passport, I think I lost it",
        "my passport is gone, I've looked everywhere, I'm freaking out",
        "I lost my passport. and that sentence just ruined my whole trip. four words. four words and my vacation went from 'relaxing' to 'nightmare.' I've checked every pocket. every bag. every surface in this hotel room. I've even checked the fridge. why the fridge? I don't know. panic makes you check the fridge. that's what panic does."
    ], context: "I lostのlostは「失った」。英語は「なくした」=「私が失った」と自分の責任にする。日本語は「なくなった」(物が消えた)とも言える。主語の選び方が違う。I lost it=俺の失敗。It's gone=物が消えた。freaking outは「パニック中」。freakは「おかしくなる」。パニックを動詞にしてる。感情が行動になる言語。" },

    { daySlot: 29, japanese: '事故った', english: [
        "I got into an accident",
        "I got in an accident, I'm OK but the car's messed up",
        "there was an accident, nothing serious but we need to deal with it",
        "I got in an accident. and the first thing everyone says is 'are you OK?' and I appreciate that but also I'm callin' you FROM the accident, so I'm at least OK enough to use a phone. the real question is 'is the car OK?' and the answer is no. the car is not OK. the car is havin' a worse day than me."
    ], context: "got into an accidentのintoは「中に入る」。事故に「入る」。英語は事故を空間として扱う。get in trouble(トラブルに入る)、get into a fight(喧嘩に入る)。日本語は「事故った」で動詞。英語は「事故という空間に入った」で名詞+前置詞。英語は出来事を場所にする。トラブルは行き先。入ったら出ないといけない。" },

    { daySlot: 29, japanese: '保険は？', english: [
        "am I covered",
        "does my insurance cover this? I need to check",
        "hold on, let me check if I'm covered, where's my policy number?",
        "am I covered? 'cause I pay for insurance every month and I have NO idea what it actually covers. it's like a subscription I never read the terms for. I just pay it and hope it works when I need it. insurance is basically a trust fall with a corporation. you fall and hope they catch you. they usually don't. but you hope."
    ], context: "Am I covered?のcoveredは「カバーされてる?」。保険がcoverする=覆って守る。日本語は「保険きく?」で保険が「効く」=薬みたいに作用する。英語は保険が「覆って」くれる。カバーは毛布みたいに上からかぶさるイメージ。coverageは「カバー範囲」。保険は毛布。範囲外は寒い。はみ出た部分は自腹。" },

    { daySlot: 29, japanese: 'どこに連絡すれば？', english: [
        "who do I call",
        "who do I call about this? who handles this stuff?",
        "where do I even start? who's the right person to contact?",
        "who do I call? 'cause there's no 'one number for everything' in life. there should be. one number. you call it. you say 'I have a problem.' they say 'OK what kind.' and they route you. like a human Google. but instead I'm googlin' 'who to call when [specific problem]' and gettin' seventeen different answers. modern life needs a help desk."
    ], context: "Who do I call?は「誰に電話すれば?」。英語はwho(誰)を先に出す。日本語は「どこに連絡すれば」で場所(どこ)を聞く。英語は人(誰)を聞く。面白い違い。日本語は組織・場所に連絡する感覚。英語は人に連絡する感覚。call someone(人に電話する)vsどこかに連絡する。主語の好みが違う。" },

    { daySlot: 29, japanese: '証拠ある', english: [
        "I have proof",
        "I've got proof, it's all right here on my phone",
        "don't worry, I've got evidence, I took pictures of everything",
        "I have proof. and thank god for smartphones. twenty years ago 'proof' was your word against theirs. now? everything is documented. I took pictures. I took video. I took screenshots. I probably have more evidence than a detective. my phone is basically a crime scene investigation lab that also plays music and orders pizza."
    ], context: "I have proofのproofは「証拠」。evidenceも「証拠」。違いは? proofは「決定的な証明」、evidenceは「証拠の一部」。proof=これで確定、evidence=これも材料の一つ。日本語は「証拠」一語。英語は確定度で使い分ける。法廷ドラマでevidence(証拠品)は複数出てくるけど、proof(証明)は一発で決める。重みが違う。" },

    { daySlot: 29, japanese: '大丈夫じゃない', english: [
        "I'm not OK",
        "I'm not OK, I really need some help here",
        "honestly? I'm not OK right now, this is a lot to deal with",
        "I'm not OK. and I know we live in a world where you're supposed to say 'I'm fine' even when you're not. but I'm not doin' that right now. I'm not fine. I'm the opposite of fine. I'm un-fine. and sayin' it out loud is scary but also kinda relieving? like poppin' a pressure valve. the truth comes out and the pressure drops. OK. that helped."
    ], context: "I'm not OKはシンプルだけど言うのが難しいフレーズ。英語圏はI'm fineが自動応答になってて、not OKと言うには勇気がいる。How are you?からI'm fine(条件反射)。この自動応答を壊すのがI'm not OK。日本語は「大丈夫じゃない」をわりと言えるけど、英語のI'm not OKは「助けを求めてる」サインとして重い。正直さにコストがかかる言語。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 30: 電話・画面 (Phone/Screen) -- NAVIGATE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 30, japanese: 'もしもし', english: [
        "hello?",
        "hello? hey, can you hear me?",
        "hello? is anyone there? I think the call went through",
        "hello? and I always say it like a question. 'hello?' with the upward inflection. like I'm not sure I'm actually on the phone. I DIALED the number. I HEARD it ring. someone PICKED UP. but still I say 'hello?' like it might not be real. phone calls start with mutual disbelief. 'are you there?' 'are YOU there?' we're both there. let's talk."
    ], context: "「もしもし」は日本語オリジナルの電話挨拶。英語はhello?で済ます。もしもしの語源は「申す申す」=「自分はちゃんと喋ってますよ」の確認。英語のhello?は疑問形にして「あなたいますか?」の確認。両方とも通話開始の不安を解消する儀式。回線の向こうに人間がいることの確認作業。テクノロジーへの不信感。" },

    { daySlot: 30, japanese: '聞こえる？', english: [
        "can you hear me",
        "can you hear me? hello? am I on mute?",
        "can you hear me or did I freeze again? tap something if you can hear me",
        "can you hear me? 'cause I've been talkin' for thirty seconds and getting zero response and I can't tell if you're listenin' or if I'm talkin' to myself. and if I AM talkin' to myself, that's a podcast, not a phone call. and I'm not ready for a podcast. I don't have the equipment. or the audience. hello? anyone?"
    ], context: "Can you hear me?は2020年代の最頻出フレーズかもしれない。Zoom時代の挨拶。面白いのはhearとlistenの違い。hear=聞こえる(自動的に)、listen=聴く(意識的に)。Can you hear me?は「音が届いてるか?」。Are you listening?は「ちゃんと聴いてるか?」。物理の確認と態度の確認。hear=耳の問題、listen=心の問題。" },

    { daySlot: 30, japanese: '電波悪い', english: [
        "bad signal",
        "sorry, bad signal, you're breakin' up",
        "the signal's terrible, let me move to a different spot, hold on",
        "bad signal. and you're breakin' up. which means I'm hearin' every third word. 'so I... yesterday... and then... really...' and I'm supposed to respond to that? I'm assemblin' a sentence from ruins. archaeologists do this with ancient texts. I'm doin' it with a phone call from 2026. technology is simultaneously the best and worst thing ever."
    ], context: "you're breaking upは「声が途切れてる」。直訳すると「あなたが壊れてきてる」。人間が壊れる表現。breakは物理的な断裂。音声が「割れる」感覚。日本語は「電波悪い」で原因(電波)を言う。英語は「あなたが壊れてる」で結果(音質)を言う。問題の報告の仕方が違う。英語は症状を伝える。医者に行くときと同じ。" },

    { daySlot: 30, japanese: '切れた', english: [
        "got disconnected",
        "we got cut off, lemme call you back",
        "the call dropped, I'm calling you right back, one sec",
        "got disconnected. and of course it happened right when you were sayin' somethin' important. calls never drop during small talk. never during 'yeah the weather's nice.' always during 'so the thing I wanted to tell you is--' BEEP. gone. the universe has comedic timing. it waits for the worst possible moment. every time."
    ], context: "got disconnectedは「接続が切れた」。the call droppedは「電話が落ちた」。cut offは「切られた」。英語は通話の終了を3つの動詞で表現する。disconnect=接続解除、drop=落下、cut off=切断。全部物理的な力。日本語は「切れた」一つ。英語は切れ方のバリエーションが豊富。ハサミで切るか、落とすか、引き抜くか。切断にも個性がある。" },

    { daySlot: 30, japanese: 'かけ直す', english: [
        "I'll call you back",
        "lemme call you back in five, somethin' came up",
        "I'll call you right back, I just need to deal with something real quick",
        "I'll call you back. and 'I'll call you back' is one of the most broken promises in human communication. right up there with 'we should hang out sometime' and 'I'll think about it.' I MEAN to call back. I INTEND to. but then life happens and I forget. and three days later I remember and it's too late. the window has closed. I'm a bad person."
    ], context: "call backのbackは「戻る」。電話を「戻す」=かけ直す。英語は行動の方向をback/out/up/downで制御する。call back(かけ直す)、call off(中止する)、call out(指摘する)、call up(電話する)。同じcallなのにback/off/out/upで意味が全然違う。英語は方向詞で意味を操縦する。callはハンドル、方向詞がギア。" },

    { daySlot: 30, japanese: '留守電残して', english: [
        "leave a message",
        "just leave a message, I'll get back to you",
        "if I don't pick up, leave a voicemail and I'll call you back",
        "leave a message. and nobody does anymore. voicemail is dead. texting killed it. the voicemail inbox is a graveyard of messages from 2018 that I still haven't listened to. and now my phone says 'voicemail full' and I'm like good. perfect. no more voicemails. just text me. texts don't require me to LISTEN to anything. reading is faster. evolution."
    ], context: "leave a messageのleaveは「残す」「置いていく」。メッセージを「置いていく」。去るけど言葉だけ残す。英語のleaveは「去る」と「残す」が同じ単語。I'm leaving(去る)、Leave it(残して/放っておいて)。去ることと残すことが一つの動詞に共存してる。去る人は何かを残す。英語の哲学がleaveに詰まってる。" },

    { daySlot: 30, japanese: '今話せる？', english: [
        "can you talk",
        "hey, can you talk right now? is this a bad time?",
        "got a minute to chat? or should I call later?",
        "can you talk? and I know callin' without textin' first is basically a crime in 2026. you're supposed to text 'can I call?' BEFORE callin'. callin' without warnin' is an ambush. a phone ambush. my grandparents used to just call whenever. no warning. no text. the phone would RING and you'd ANSWER. like animals. we've evolved past that."
    ], context: "Can you talk?は「今話せる?」。is this a bad time?は「今まずい?」。英語は電話の前に「話す許可」を取る文化。日本語は「今大丈夫?」。構造は似てるけど、英語はa bad timeと「悪い時間」かどうかを聞く。時間に善悪がある。good time(いいタイミング)、bad time(悪いタイミング)。時間に道徳がある。面白い。" },

    { daySlot: 30, japanese: 'ミュートになってる', english: [
        "you're on mute",
        "hey, you're on mute, we can't hear you",
        "I think you're muted, your lips are moving but nothing's coming through",
        "you're on mute. THE phrase of the 2020s. this sentence didn't exist in 2019 and now everyone has said it at least five hundred times. lips movin', no sound. it's the modern equivalent of talkin' to someone with headphones on. you're performin' for an audience of zero. and the worst part? you don't know until someone tells you. silent comedy."
    ], context: "You're on muteは2020年代を代表する新定番フレーズ。on muteのonは「ミュート状態の上に乗ってる」。英語は状態をon/offで管理する。on mute(ミュート中)、on hold(保留中)、on speaker(スピーカー中)。全部onで「その状態が起動してる」。offにすると解除。人間もデバイスも同じスイッチで操作される。人間のOS化。" },

    { daySlot: 30, japanese: '画面共有して', english: [
        "share your screen",
        "can you share your screen? I wanna see what you're lookin' at",
        "do you mind sharing your screen? it'll be easier to follow along",
        "share your screen. and that moment of panic when someone says that and you realize your screen has seventeen tabs open, including the one where you were shopping for shoes. during a work meeting. so you do the frantic close-close-close before hittin' share. everyone does this. nobody admits it. screen sharing is a trust exercise with your browser history."
    ], context: "share your screenのshareは「共有する」。英語のshareは「分ける」が元。screen sharing=画面を分ける=一緒に見る。日本語は「画面共有」で漢字2語。英語はshare(動詞)+screen(名詞)で動作感がある。面白いのは画面を「見せる」じゃなくて「共有する」と言うこと。一方通行じゃなくて双方向。見る側も参加してるニュアンス。" },

    { daySlot: 30, japanese: '後でメールする', english: [
        "I'll email you",
        "I'll shoot you an email later with the details",
        "let me send you an email about it after this, I'll lay it all out",
        "I'll email you. which is code for 'I don't wanna talk about this anymore right now.' email is the escape hatch of conversations. anything that's too long, too complicated, or too boring for a phone call gets the 'I'll email you.' email is where conversations go to die. peacefully. in paragraph form. with an attachment nobody opens."
    ], context: "shoot you an emailのshootは「撃つ」。メールを「撃つ」。日本語は「メール送る」で「送る」。英語は「撃つ」。send(送る)だとフォーマル。shoot(撃つ)だとカジュアル。fire off an email(メールを発射する)もある。英語のメールは飛び道具。送信ボタンはトリガー。受信箱は的。ビジネスコミュニケーションが戦場用語。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 31: 独り言 (Self-talk) -- NAVIGATE
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 31, japanese: 'えーっと', english: [
        "um, let me think",
        "uh, hold on, let me think for a sec",
        "umm, give me a second, I know I know this, it's on the tip of my tongue",
        "uhh... hmm... let me think. and I'm makin' sounds while I think 'cause silence is terrifying. if I stop makin' sounds people think I died. so I fill the air with 'um' and 'uh' and 'hmm' and none of them mean anything. they're placeholder noises. my brain's loading screen. please wait. buffering. still buffering."
    ], context: "um、uh、hmmは英語のフィラー(つなぎ音)。日本語は「えーっと」「あのー」。面白いのは国によってフィラーが全然違うこと。フランス語はeuh、韓国語は음、英語はum。脳は世界共通で考え中なのに、その間に出す音は言語ごとに違う。フィラーにも国籍がある。「えーっと」で日本人バレする。音の国境。" },

    { daySlot: 31, japanese: 'なんだっけ', english: [
        "what was it",
        "what was it again? I just had it",
        "what was it... I literally JUST thought of it and now it's gone",
        "what was it? I JUST had it. it was RIGHT THERE in my brain. I could feel it. and then it left. my thought packed its bags and walked out without notice. no forwarding address. just gone. and now I'm standin' here with my mouth open, replayin' the last thirty seconds like security camera footage tryin' to find the moment I lost it."
    ], context: "What was it?は「なんだっけ?」。had itのitは「あの言葉/記憶」。英語はitで「あれ」を指して、そのitを「持ってた」と表現する。記憶を所有物として扱う。I had it=持ってた=失った。日本語は「なんだっけ」=情報の再検索。英語は「持ってたのに落とした」=所有物の紛失。記憶は財布みたいなもの。落とすことがある。" },

    { daySlot: 31, japanese: 'どうしよう', english: [
        "what do I do",
        "what do I do? I have no idea what to do here",
        "oh man, what am I gonna do? I'm completely stuck",
        "what do I do. what do I DO. see how the emphasis shifts? first time is a genuine question. second time is panic. same words, different stress, completely different meaning. English does that a lot. 'I didn't say HE stole it' versus 'I didn't SAY he stole it.' seven words, seven meanings depending on which one you yell. stress is the secret boss of English."
    ], context: "What do I do?は独り言にも相談にもなる。面白いのはdo(する)が2回入ること。what+do+I+do。最初のdoは疑問の旗、2つ目のdoは動詞の「する」。英語はdoを酷使する。日本語は「どうしよう」でdoに当たる単語が1回だけ。英語は構造上doが2回必要。同じ意味なのに部品が多い。英語は文法にコストがかかる言語。" },

    { daySlot: 31, japanese: 'あ、思い出した', english: [
        "oh wait, I remember",
        "oh! I remember now, it just came back to me",
        "wait wait wait -- I got it! it just popped back into my head!",
        "OH WAIT. I remember. it came back. it literally just walked back into my brain like it never left. no apology. no explanation. just 'hey I'm back.' where did it GO? where do lost thoughts go when they disappear? is there a waiting room? a lobby? do they sit there until they feel like returnin'? thoughts are unreliable tenants."
    ], context: "it came back to meは「戻ってきた」。記憶が自分のところに「来る」。英語は記憶を人みたいに扱う。It hit me(思い出がぶつかってきた)、It popped into my head(頭にポンと入ってきた)。記憶は勝手に来たり去ったりする。日本語は「思い出した」で自分が能動的に思い出す。英語は記憶のほうが自分のとこに来る。受動的。思い出に主導権がある。" },

    { daySlot: 31, japanese: '忘れた', english: [
        "I forgot",
        "I totally forgot, my bad",
        "I completely forgot, I'm so sorry, it slipped my mind",
        "I forgot. and I know I said I'd remember. I even set a reminder. and then I forgot to check the reminder. so the reminder was reminding nobody. it was just sittin' there. on my phone. glowing. ignored. the reminder did its job. I didn't do mine. I failed the reminder. the reminder deserves better. I'm sorry, reminder."
    ], context: "it slipped my mindは「頭からすべり落ちた」。slip=滑る。記憶が脳の表面を滑って落ちた。英語の記憶は物理法則に従う。slip(滑る)、fade(消える)、stick(くっつく)。That sticks(それは覚えやすい)=脳にくっつく。日本語は「忘れた」=忘却動作。英語は記憶がどう動いたかを描写する。記憶に物理エンジンが入ってる。" },

    { daySlot: 31, japanese: '次何するんだっけ', english: [
        "what was I doing",
        "wait, what was I about to do? I walked in here for a reason",
        "what was I doing? I came in here for something and now I'm just standing here",
        "what was I doing? I walked into this room with PURPOSE. I had a mission. a goal. and then the doorway ate my memory. that's a real thing by the way. the doorway effect. your brain resets when you walk through a door. science proved it. so it's not my fault I forgot. it's the door's fault. I'm blaming architecture."
    ], context: "What was I doing?は「何してたんだっけ?」。I was about to...は「〜しようとしてた」。英語は「しようとしてた」をbe about to doで未来の直前にいたことを表現する。日本語は「何するんだっけ」で未来を聞いてる。英語は「何をしてる途中だった?」で過去に戻る。思い出すために過去に行く英語、未来に聞く日本語。時間の向きが逆。" },

    { daySlot: 31, japanese: 'やばい', english: [
        "oh no",
        "oh no no no, this is bad, this is really bad",
        "oh crap, this is not good, I think I messed up",
        "oh no. oh NO. and there are levels of 'oh no.' one 'oh no' is mild. 'oh no I spilled water.' two 'oh no's is medium. 'oh no oh no I forgot the meeting.' three is panic. 'oh no oh no oh no the deadline was yesterday.' the number of oh-no's is directly proportional to the severity of the situation. it's a scale. the oh-no scale."
    ], context: "「やばい」は万能すぎる日本語。良い意味でも悪い意味でも使える。英語は場面で変える。悪い=oh no、oh crap、oh shoot。良い=oh wow、that's sick、insane。「やばい」一語でカバーする範囲を英語は10個以上の表現で分担する。やばいの守備範囲の広さは日本語の天才的発明。英語には輸出不可能。" },

    { daySlot: 31, japanese: 'しまった', english: [
        "shoot",
        "shoot, I just realized I messed up",
        "dang it, I knew I was forgetting something, I can't believe I did that",
        "shoot. and 'shoot' is the clean version. what I WANTED to say was something else. but I caught myself. that's what 'shoot' is -- it's the emergency brake on a swear word. you feel the real word comin' and you swap it at the last millisecond. sugar, shoot, fudge, frick. the English language has a whole fake-swear industry. censorship at the speed of speech."
    ], context: "shootはsh*tの婉曲表現。英語は悪い言葉の「きれいバージョン」をたくさん持ってる。shoot(sh*tの代替)、fudge(f**kの代替)、dang(damnの代替)。日本語にもあるけど(くそ→くっそ→あっ)、英語のほうが体系的。発音の最初だけ同じにして、途中で別の単語にすり替える。高速言い換え技術。口のファインプレー。" },

    { daySlot: 31, japanese: 'まあいっか', english: [
        "oh well",
        "oh well, it is what it is, can't change it now",
        "you know what? whatever, it's fine, I'll deal with it later",
        "oh well. and 'oh well' is the most underrated phrase in English. it's acceptance in two syllables. you tried, it didn't work, oh well. you can't control it, oh well. life is unfair, oh well. it's not giving up. it's... strategic acceptance. selective surrender. you pick your battles and 'oh well' is how you walk away from the ones you can't win."
    ], context: "oh wellは「まあいいか」の英語版。it is what it is(それはそういうもの)は最近の流行フレーズ。トートロジー(同語反復)なのに深い。A is A。当たり前のことを言ってるだけなのに哲学的に聞こえる。日本語の「しょうがない」と似てる。受け入れの表現は英語も日本語も「考えるのをやめる」瞬間。思考の電源OFF。" },

    { daySlot: 31, japanese: '考えすぎだな', english: [
        "I'm overthinking it",
        "I'm totally overthinking this, I need to just do it",
        "I've been going back and forth for way too long, I'm definitely overthinking it",
        "I'm overthinking it. and I KNOW I'm overthinking it. which means I'm now thinking about how I'm overthinking. which is meta-overthinking. overthinking about overthinking. it's recursive. it's a loop. and the only way to break the loop is to just DO something. anything. even the wrong thing. action beats analysis. eventually. theoretically. let me think about it."
    ], context: "overthinkingのover-は「過剰」。英語はover-を付けるだけで何でも「やりすぎ」にできる。overeat(食べすぎ)、oversleep(寝すぎ)、overreact(反応しすぎ)。日本語は「考えすぎ」「食べすぎ」と「すぎ」を後ろに付ける。英語は前(over-)、日本語は後ろ(すぎ)。位置は逆だけど機能は同じ。「やりすぎ」マーカーの位置が言語で違う。面白い対称性。" },


    // ═══════════════════════════════════════════════════════════════
    // Day 20: 不満 (Frustration) -- EXPRESS
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 20, japanese: 'ありえない', english: [
        "are you kidding me",
        "are you kidding me right now? this is ridiculous",
        "you've gotta be kidding me, there's no way this is actually happening",
        "are you KIDDING me? no. no no no. this is not happenin'. I refuse. my brain is filin' a formal complaint. like, I knew things could go wrong but THIS? this wasn't even on the list of possible wrong things. this is a brand new wrong. a wrong nobody warned me about. congratulations, universe. you surprised me. I hate it."
    ], context: "are you kidding me?のkidは「冗談を言う」。怒ってるのに「冗談でしょ?」と聞く形。日本語の「ありえない」は状況を否定するけど、英語は相手に「ふざけてるのか?」と質問の形で怒る。怒りを質問で包装する。答えを求めてない質問。英語の怒りは修辞疑問でくる。" },

    { daySlot: 20, japanese: 'ムカつく', english: [
        "this pisses me off",
        "this really pisses me off, I can't even deal right now",
        "I'm so pissed off right now I can barely think straight",
        "this pisses me off. and I know I should be chill about it but I'm NOT chill. I'm the opposite of chill. I'm heated. I'm a kettle. I'm whistlin'. and the worst part? I can't even explain WHY it makes me this mad. it just does. some things just hit your anger button and your rational brain goes on break."
    ], context: "piss offはかなり強い。怒りの段階でいうとannoy(イラッ) < upset(ムカッ) < piss off(ムカつく) < furious(ブチギレ)。pissは元々下品な単語だけど、怒り表現としてはもう日常語。日本語の「ムカつく」も元は胃がムカムカする身体感覚。英語も怒りは体で感じるもの。" },

    { daySlot: 20, japanese: '最悪', english: [
        "this is the worst",
        "this is the absolute worst, I can't even",
        "everything about this is terrible, I'm so done right now",
        "this is the worst. THE worst. not 'one of the worst.' THE worst. singular. champion of terrible. gold medal in awful. and I know I said 'the worst' yesterday about the weather but that was a different category. this is the overall worst. there are divisions. today's worst is heavyweight class."
    ], context: "the worstは「最悪」の直訳だけど、英語は頻繁にthe worst/the bestを使いすぎる。毎日何かがthe worst。インフレしてる。日本語の「最悪」も同じくインフレしてるけど、英語のthe worstはさらに軽い。友達が遅刻しても「the worst」。靴下が濡れても「the worst」。最悪のハードルが低い。" },

    { daySlot: 20, japanese: 'なんでこうなるの', english: [
        "how did this happen",
        "how did this even happen? I don't get it",
        "can someone explain to me how we got here? because I'm lost",
        "how did this happen? like, walk me through it. step by step. 'cause I was payin' attention and I still don't understand how we went from 'everything's fine' to 'everything's on fire' in like two minutes. was there a warning? did I miss a sign? was there a memo? 'cause I didn't get the memo. I never get the memo."
    ], context: "how did this happen?は「どうしてこうなった?」。howは方法を聞いてる=プロセスを知りたい。whyだと理由を聞く。英語は「なぜ?」と「どうやって?」を明確に使い分ける。日本語の「なんで」はhowとwhyの両方をカバーする。英語は原因(why)と経緯(how)を別の引き出しに入れてる。怒ってるときもロジカル。" },

    { daySlot: 20, japanese: '勘弁してよ', english: [
        "give me a break",
        "oh, give me a break, seriously?",
        "give me a break already, I've had enough of this",
        "give me a BREAK. just... a break. a tiny one. is that too much to ask? the universe has been hittin' me with one thing after another like a boxing match where the bell never rings. I'm not askin' for a vacation. I'm askin' for five minutes where nothin' goes wrong. five. minutes. that's it. please."
    ], context: "give me a breakは「勘弁して」。breakは「休憩」。怒りの中で「ちょっと休ませて」と言ってる。日本語の「勘弁して」は「許して」が語源だけど実際は「もうやめて」の意味。英語は「休憩をくれ」で同じニュアンスに到達する。到着地は同じなのに、出発点が違う。英語は疲労から、日本語は許しから。" },

    { daySlot: 20, japanese: 'ふざけんな', english: [
        "cut it out",
        "cut it out, that's not funny anymore",
        "knock it off, seriously, I'm not in the mood for this",
        "cut it out. I'm serious. and when I say 'I'm serious' with THIS face, I mean it. there's my normal 'I'm serious' which is like 60% serious. and then there's THIS 'I'm serious' which is 100%. full capacity. no room for jokes. the joke window is closed. boarded up. out of business. try again tomorrow. maybe."
    ], context: "cut it outは「やめろ」。cutは「切る」=その行為を切断しろ。knock it off(叩き落とせ)も同じ意味。英語は「やめる」を物理的な動作で表現する。切る、叩き落とす、止める(stop)。日本語の「ふざけんな」は相手の態度を否定するけど、英語は「その動作を物理的に除去しろ」と命令する。解体業者みたい。" },

    { daySlot: 20, japanese: 'いい加減にして', english: [
        "enough is enough",
        "enough is enough, I'm done puttin' up with this",
        "I've had it up to here, something's gotta change or I'm out",
        "enough is enough. and I know I've said that before. like, multiple times. and then I kept puttin' up with it anyway. so my 'enough' has a credibility problem. but THIS time it's real. I think. yeah. it's real. probably. OK it might not be real. but I WANT it to be real. the intention is there. the follow-through? TBD."
    ], context: "enough is enoughは「もう十分だ」の直訳。enoughがenoughだと言ってる。トートロジーで怒りを表現する。AはAだ。反論不能。日本語の「いい加減にして」は「ちょうどいいところで止めて」が語源なのに意味は真逆。すでに限界を超えてる。言葉の意味と使い方が逆転してるのは日英どっちにもある。言葉は意味から逃げる。" },

    { daySlot: 20, japanese: '信じられない（怒）', english: [
        "unbelievable",
        "that's unbelievable, who does that?",
        "I can't believe this, this is absolutely unacceptable",
        "unbelievable. UN. BELIEVABLE. I'm breakin' the word into pieces because I need you to feel each syllable of my disbelief. 'cause 'unbelievable' is doing double duty -- it means both 'I can't believe it' and 'this shouldn't exist.' it's a rejection of reality. I'm vetoing what just happened. reality? denied."
    ], context: "unbelievableは嬉しいときにも怒りのときにも使える。Day 19の信じられない(嬉し)とペア。トーンだけで意味が変わる。同じ単語で天国と地獄。英語は感情の極端が同じ単語を共有する。sick(最悪/最高)、crazy(ヤバい良/ヤバい悪)。一語で正反対。忙しすぎる単語たち。" },

    { daySlot: 20, japanese: 'もう限界', english: [
        "I can't take it anymore",
        "I can't take this anymore, I'm at my limit",
        "I've reached my breaking point, something's gotta give here",
        "I can't take it anymore. and I'm not sayin' that for drama. I'm sayin' it as a status report. my tolerance bar? empty. my patience meter? zero. I've been runnin' on fumes for a week and the fumes just ran out. I'm operatin' on nothin'. I'm a phone at 1%. about to shut down. plug me in or lose me."
    ], context: "I can't take itのtakeは「受け取る」=もう受け取れない。英語はストレスを荷物として扱う。I can't handle it(持てない)、I can't deal with it(対処できない)、it's too much(多すぎる)。全部容量の問題。人間にはストレスの容器があって、溢れたらcant take it。日本語の「限界」=ラインだけど、英語は「容器」。" },

    { daySlot: 20, japanese: '誰の責任？', english: [
        "whose fault is this",
        "whose fault is this? someone's gotta own it",
        "who's responsible for this mess? I need answers",
        "whose fault is this? and I'm not askin' to blame anyone. I'm askin' to blame SOMEONE. there's a difference. I don't have a target yet. but I need one. 'cause anger without a target just floats around and that's worse. unfocused anger is exhaustin'. focused anger is productive. I just need a direction. point me."
    ], context: "whose faultのfaultは「過失」。元は地質学の「断層(fault line)」と同じ語源。地面のひび割れ=責任のひび割れ。It's my fault(俺のせい)、Nobody's fault(誰のせいでもない)。英語は責任をfault=亀裂で表現する。壊れたところ=犯人。日本語の「せい」は「所為」=やった行為。動作vs亀裂。見方が違う。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 21: 驚き (Surprise) -- EXPRESS
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 21, japanese: 'マジで？', english: [
        "for real?",
        "wait, for real? you're not messin' with me?",
        "are you being serious right now? 'cause I honestly can't tell",
        "for real? FOR REAL for real? 'cause there's 'for real' and then there's 'for real for real.' the first one is like 70% belief. the second one is 'I need full confirmation before I allow my brain to accept this information.' I'm at the second one. my brain has a security gate and you haven't cleared it yet."
    ], context: "for realは「マジで?」の直訳に近い。面白いのはfor real for realと重ねる用法。英語は繰り返すと強調になるけど、同じ単語を2回続けるのは普通ルール違反。でもfor realだけは許される。日本語の「マジでマジで?」と同じ構造。驚きが強すぎると文法が壊れる。感情は文法より強い。" },

    { daySlot: 21, japanese: '嘘でしょ', english: [
        "no way",
        "no way, you're lyin', there's no way that happened",
        "shut up, that did not just happen, I refuse to believe it",
        "no way. NO WAY. I'm sorry but my brain has rejected this information. it went through the processing center and got stamped 'DENIED.' returned to sender. 'cause if what you're tellin' me is true, then everything I thought I knew is wrong. and I'm not ready for that level of restructuring today. maybe tomorrow."
    ], context: "no wayは「ありえない」=道がない。way=道。可能性の道が存在しない。There's no way(道がない)。日本語の「嘘でしょ」は「嘘だと言ってくれ」。英語は可能性を否定し、日本語は真実を否定する。アプローチが違う。ちなみにshut upも驚きで使う。「黙れ」じゃなく「マジか」。文脈でガラッと変わる。" },

    { daySlot: 21, japanese: '信じられない（驚）', english: [
        "I can't believe it",
        "I literally cannot believe what I'm hearin' right now",
        "my brain is not processing this, can you say that one more time?",
        "I can't believe it. and this is different from the angry 'I can't believe it.' this is the amazed one. the good one. it's the same exact words but the delivery is completely different. English is wild. same sentence, two opposite emotions. it's like a fork in the road except both roads have the same sign. you just gotta FEEL which way to go."
    ], context: "I can't believe itが3回目の登場(Day 19=嬉し、Day 20=怒り、ここ=驚き)。同じ6単語で3つの感情。英語は表情と声のトーンに意味を委託する。テキストだけだと判別不能。だから会話では表情が命。日本語は「信じられない」「ありえない」「マジか」と単語を変えて感情を分ける。英語は単語を変えずにトーンを変える。省エネ設計。" },

    { daySlot: 21, japanese: 'え、ちょっと待って', english: [
        "hold on",
        "hold on hold on, wait, what did you just say?",
        "wait wait wait, back up, say that again from the beginning",
        "hold on. HOLD on. time out. I need a second. my brain just hit a speed bump and it needs to recalibrate. 'cause you dropped that so casually like it was nothin' and it's NOT nothin'. that's a SOMETHING. a big something. and you just slipped it in between 'pass the salt' and 'nice weather.' no. we're unpacking this. NOW."
    ], context: "hold onは「待って」だけど、直訳は「つかまってろ」。何かにつかまれ=動くな。wait(待て)より物理的。しかもhold on hold onと繰り返すと驚きの急ブレーキになる。英語は驚いたとき会話を物理的に止める。back up(戻れ)、rewind(巻き戻せ)、pump the brakes(ブレーキ踏め)。会話は乗り物。" },

    { daySlot: 21, japanese: '聞いてない', english: [
        "nobody told me",
        "wait, nobody told me, how come I'm the last to know?",
        "why am I just now finding out about this? I'm always out of the loop",
        "nobody told me. NOBODY. and I'm not sayin' I'm the most important person to tell but I'm at LEAST top five. right? RIGHT? apparently not. apparently there's a whole information hierarchy and I'm at the bottom. below the dog. the dog knew before I did. the dog can't even read. and he still found out first."
    ], context: "out of the loop(輪の外)=情報網から外れてる。英語は情報共有を「輪(loop)」で表現する。keep someone in the loop(輪の中に入れておく=共有する)。日本語の「聞いてない」は受動的で「伝えられてない」感。英語はout of the loop=自分が輪の外にいるという空間的な疎外感。情報は輪を回る。入ってないと届かない。" },

    { daySlot: 21, japanese: '知らなかった', english: [
        "I had no idea",
        "I had no idea, how long has this been goin' on?",
        "wait, seriously? I had absolutely no clue, that's crazy",
        "I had no idea. ZERO idea. not a fraction of an idea. my awareness level was at absolute zero. and it's not like I wasn't payin' attention. I WAS payin' attention. to the wrong things. my attention was on a completely different channel. I was watchin' channel 5 and this was on channel 12. nobody told me to switch."
    ], context: "I had no ideaのideaは「考え」=考えすら持ってなかった。not a clue(手がかりゼロ)も同じニュアンス。日本語の「知らなかった」はシンプルに知識の不在。英語は「考えの不在」「手がかりの不在」と、知識を持ち物として扱う。had(持っていた)が過去形なのは「その時点で持ってなかった」を明示する。時制が証言になる。" },

    { daySlot: 21, japanese: 'まさか', english: [
        "no chance",
        "there's no chance, that was NOT supposed to happen",
        "of all the things I expected, that was absolutely not one of them",
        "no chance. zero. zilch. nada. I ran every possible scenario in my head -- and I run a LOT of scenarios, I'm an overthinker -- and this wasn't in ANY of them. my imagination has limits and apparently reality doesn't. reality went off-script. someone gave reality improv classes and now it's just doin' whatever it wants."
    ], context: "「まさか」は英語に直訳しにくい四天王の一角。no way、I never expected、of all thingsで近づけるけど完全一致がない。「まさか」は「正に(まさ)」+「か」=本当にそうなのか?という反語。予想の完全否定が2文字に圧縮されてる。英語はno chanceやI never thought...と毎回構文を組み立てる。「まさか」の圧縮率は異常。" },

    { daySlot: 21, japanese: '予想外', english: [
        "didn't see that comin'",
        "wow, didn't see that comin' at all, I'm shook",
        "that came completely out of left field, I was not prepared",
        "didn't see that comin'. and I SHOULD have. the signs were there. lookin' back, it was obvious. but in the moment? blind. completely blind. and that's the thing about surprises -- they're only surprising in real-time. in hindsight everything's 'obvious.' hindsight is that annoying friend who says 'I told you so' after the fact."
    ], context: "didn't see it comingは「来るのが見えなかった」。英語は出来事を「近づいてくる物体」として扱う。see it coming(来るのが見える)=予測できる。out of left field(左翼から)は野球から来た表現で「予想外の方向から」。blind-sided(死角から攻撃される)も同じ。英語の予想外は全部「視界の外」。見えなかった=予想外。目の言語。" },

    { daySlot: 21, japanese: 'びっくりした', english: [
        "you scared me",
        "oh my god, you scared the crap outta me",
        "don't DO that! you nearly gave me a heart attack, I jumped",
        "you scared me! and my soul left my body for a second. like, physically. I felt it leave. it went somewhere, looked around, decided the situation was safe, and came back. my soul does a threat assessment every time I'm startled. it's like a cat. one loud noise and it's on the ceiling. I need a minute. my soul's still comin' down."
    ], context: "you scared meのscareは「怖がらせる」。主語がyou=相手のせいにする。日本語の「びっくりした」は自分が驚いた=自分に起きた。英語は「お前が俺を怖がらせた」と犯人を指定する。gave me a heart attack(心臓発作をくれた)も相手が主語。英語の驚きは常に加害者と被害者がいる。サプライズにも犯人がいる。責任追及の言語。" },

    { daySlot: 21, japanese: 'そんなことある？', english: [
        "that's a thing?",
        "wait, that's actually a thing? since when?",
        "are you telling me that's a real thing that actually exists in the world?",
        "that's a THING? an actual thing? that exists? in this world? on this planet? 'cause I've been alive for a while and I thought I knew most of the things and then you come along and introduce me to a NEW thing. where was this thing hidin'? was it behind the other things? I need to reorganize my things. my thing-shelf is outdated."
    ], context: "that's a thing?のthingは「それって存在するの?」。英語はthingを使って存在確認をする。Is that a thing?(それって世の中にあるの?)。日本語の「そんなことある?」は出来事の可能性を疑う。英語は「それは\"もの\"として存在するのか?」と存在自体を疑う。thingは万能名詞。何でもthingにできる。逆に何も具体的じゃない。便利で曖昧な最強の名詞。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 22: 感謝 (Gratitude) -- EXPRESS
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 22, japanese: 'ありがとう', english: [
        "thanks, I mean it",
        "seriously, thank you, that means a lot to me",
        "I just wanna say thank you, genuinely, from the bottom of my heart",
        "thank you. and I know 'thank you' gets thrown around a lot. cashiers say it. emails say it. automated messages say it. but when I say it right now, I mean it. this is a hand-crafted, artisanal thank you. not mass-produced. small-batch gratitude. made with real feelings. accept no substitutes."
    ], context: "thank youは世界で一番言われてる英語フレーズかもしれない。でも言いすぎて軽くなってる。だからI mean itを足す。「本気で言ってる」と本気度を証明しないといけない。日本語の「ありがとう」は「有り難い」=存在が困難=まれなこと。感謝の語源が希少性。英語のthankは「考える」が語源。感謝=相手を思うこと。出発点が全然違う。" },

    { daySlot: 22, japanese: '助かった', english: [
        "you saved me",
        "you totally saved me, I owe you big time",
        "I don't know what I would've done without you, you're a lifesaver",
        "you saved me. like, literally saved me. I was drownin' and you threw me a rope. metaphorically. but it felt literal. my stress levels were at 'hair on fire' and you came in with a fire extinguisher. I didn't even have to ask. you just saw the fire and acted. that's rare. most people just watch the fire. you put it out. hero stuff."
    ], context: "you saved meは「助かった」の英語版だけど、saved=「救った」で大げさ。日本語の「助かった」は「助かる=楽になる」くらいの温度感。英語のsaveは命を救うレベル。lifesaver(命の恩人)もカジュアルに使う。You're a lifesaver!(命の恩人!)とコーヒー買ってくれただけで言う。英語は感謝のスケールが映画的。小さな親切も命の恩。" },

    { daySlot: 22, japanese: '感謝してる', english: [
        "I appreciate it",
        "I really appreciate it, more than you know",
        "I want you to know how much I appreciate everything you've done",
        "I appreciate it. and 'appreciate' is a big word for me. I don't use it lightly. 'thanks' is easy. 'appreciate' takes effort. it's the difference between a text and a handwritten letter. both say thank you but one of 'em means you sat down and thought about it. this is me sittin' down. thinkin' about it. appreciatin'."
    ], context: "appreciateは「感謝する」だけじゃなくて「価値を理解する」が原義。appreciate art(芸術を理解する)、appreciate the difficulty(難しさを理解する)。感謝+理解がセット。日本語の「感謝してる」は純粋に感謝だけ。英語のappreciateは「あなたがやってくれたことの価値を、俺はちゃんとわかってる」まで含む。感謝の精度が高い。" },

    { daySlot: 22, japanese: '恩に着る', english: [
        "I owe you one",
        "I owe you one, seriously, name it and it's done",
        "you've done me a huge favor and I won't forget it, I owe you big",
        "I owe you one. and I mean that. I'm not one of those people who says 'I owe you one' and then conveniently forgets. I keep a mental ledger. it's not written down but it's up here. and your name has a credit. a big one. whenever you need somethin', cash it in. no expiration date. this is a lifetime IOU."
    ], context: "I owe you oneは「一つ借りができた」。owe=借りがある。恩を数字で管理する。one(1個)。2回助けてもらったらI owe you two。英語は恩を帳簿に記録する。日本語の「恩に着る」は恩を衣服のように身につける。恩は着るもの。英語では恩は通貨。返すか溜まるかする。文化が違うと恩の形が変わる。" },

    { daySlot: 22, japanese: '気を使わなくていいのに', english: [
        "you didn't have to",
        "you didn't have to do that, but I'm glad you did",
        "you really didn't have to go through all that trouble for me",
        "you didn't have to do that. and I mean it. you DIDN'T have to. nobody asked you to. nobody expected you to. and yet you did. and that's what makes it special. the stuff people do when they don't have to? that's the real stuff. obligatory kindness is fine. voluntary kindness? that's the premium tier. that's the good stuff."
    ], context: "you didn't have toは「する必要なかったのに」。have to=義務がなかった。義務じゃないのにやってくれた、だから特別。英語は「義務の不在」を指摘することで感謝する。日本語の「気を使わなくていいのに」は「気」=配慮。英語は義務(have to)、日本語は配慮(気)。感謝のフレームが義務vs気遣い。" },

    { daySlot: 22, japanese: 'あなたのおかげ', english: [
        "all because of you",
        "this is all because of you, I couldn't have done it alone",
        "none of this would've happened without you, you made this possible",
        "this is all because of you. ALL of it. and I know you're gonna be humble and say 'nah, you did the work.' but that's a lie. a nice lie. but still a lie. you were the difference between me doin' it and me givin' up. you were the bridge. I was standin' on one side starin' at the gap and you WERE the bridge. that's your superpower."
    ], context: "because of youは原因を人に帰する表現。面白いのは同じ形が良い意味(感謝)にも悪い意味(非難)にもなること。It's all because of you(あなたのおかげ/あなたのせい)。トーンだけで正反対。thanks to youも同じ。Thanks to you, I'm late(あなたのおかげで遅刻した)=皮肉。感謝の形で怒る。英語の二面性。" },

    { daySlot: 22, japanese: '何かお返しさせて', english: [
        "let me return the favor",
        "let me do somethin' for you, it's the least I can do",
        "you've done so much for me, please let me pay you back somehow",
        "let me return the favor. and don't say 'no no it's fine.' let me. please. 'cause if I don't, this gratitude's gonna sit inside me and ferment. and fermented gratitude turns into guilt. and guilt turns into weird energy. and weird energy turns into buyin' you a gift that's too expensive and then it's awkward. so just let me buy you lunch. keep it simple."
    ], context: "return the favorのreturnは「返す」。恩を返品するイメージ。favor=好意を物として扱って、返却する。pay you back(返済する)もお金の言葉。英語は恩と借金を同じ動詞で処理する。日本語の「お返し」も「返す」だけど、「お」がついて丁寧になる。英語のreturn the favorには丁寧さがない。ビジネスライクに返す。商取引感。" },

    { daySlot: 22, japanese: '言葉にならない', english: [
        "I don't know what to say",
        "I'm speechless, honestly I don't know what to say",
        "I'm at a loss for words, this is just... I can't even express it",
        "I don't know what to say. and that's sayin' somethin' 'cause I ALWAYS know what to say. I'm a words guy. words are my thing. but right now? the word factory is closed. the conveyor belt stopped. my brain sent a request for the perfect sentence and the response came back 'error 404: gratitude too large to process.' so just... thank you. that's all I got."
    ], context: "speechlessは「言葉を失った」。speech+less=発話能力マイナス。at a loss for words(言葉に対して途方に暮れてる)も同じ。英語は「言えない」状態をちゃんと言語化する。言葉がないことを言葉で伝える矛盾。日本語の「言葉にならない」も同じ矛盾を抱えてる。感謝が大きすぎると言語がクラッシュする。どの言語でも。" },

    { daySlot: 22, japanese: '本当にありがたい', english: [
        "I'm truly grateful",
        "I'm truly grateful, you have no idea how much this means",
        "from the bottom of my heart, I am genuinely, truly grateful for this",
        "I'm truly grateful. and I know 'truly' sounds formal but I need it. 'grateful' alone feels light. 'truly grateful' has weight. it's the difference between 'I like you' and 'I really like you.' that 'really' does heavy liftin'. same with 'truly.' it's the anchor that keeps 'grateful' from floatin' away into generic territory."
    ], context: "gratefulは「感謝に満ちた」。-fulは「いっぱいの」。thankful、grateful、appreciative。感謝の形容詞が3つもある。thankful=ありがたい(一般)、grateful=恩を感じてる(深い)、appreciative=価値を理解して感謝(知的)。日本語は「ありがたい」一語。英語は感謝の深度で単語を変える。感謝にも階級がある。" },

    { daySlot: 22, japanese: 'いつも感謝してる', english: [
        "I never take it for granted",
        "I never take what you do for granted, just so you know",
        "I know I don't say it enough but I appreciate you every single day",
        "I never take it for granted. and I know people say that and don't mean it. but I do. 'cause I've seen what life looks like without it. without YOU. and it's worse. significantly worse. so yeah, I notice. every time. I just don't always say it out loud. 'cause sayin' it every day would make it sound routine. and it's not routine. it's the opposite."
    ], context: "take it for grantedは「当たり前だと思う」。grantedは「認められた」=既に確定したもの扱い。for grantedで「確定済みとして」。当たり前だと思わない=まだ新鮮に感じてる。日本語の「当たり前」も「当たり前」=「当然」で同じ構造。面白いのは、感謝してることを「否定形」で伝えること。never take for granted。しないことで、していることを伝える。裏返しの感謝。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 23: 謝罪 (Apologizing) -- EXPRESS
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 23, japanese: 'ごめん', english: [
        "my bad",
        "my bad, that was on me, I messed up",
        "I'm sorry, that was totally my fault, I should've known better",
        "my bad. and I'm sayin' 'my bad' instead of 'sorry' on purpose. 'cause 'sorry' has been diluted. people say 'sorry' when they bump into a chair. the chair doesn't care. but 'my bad' is ownership. it's MY bad. mine. I'm claimin' it. I'm puttin' my name on the mistake. it's registered. it's got a title deed. property of me."
    ], context: "my badは「俺のミス」。badを名詞化して所有してる。my(俺の)+bad(悪いこと)=俺が所有する悪いこと。日本語の「ごめん」は「御免」=許しを請う。英語のmy badは許しを請わない。ただ事実として「俺のせい」と認める。I'm sorryは感情(すまなく思ってる)、my badは事実(俺のミス)。謝罪のアプローチが違う。" },

    { daySlot: 23, japanese: '悪かった', english: [
        "I was wrong",
        "I was wrong, straight up, no excuses",
        "I'll be the first to admit I was completely wrong about this",
        "I was wrong. there. I said it. three words. hardest three words in the English language. harder than 'I love you' honestly. 'cause 'I love you' makes you vulnerable but 'I was wrong' makes you accountable. and accountability is scary. love is a gamble. being wrong is a receipt. proof of failure. signed and dated."
    ], context: "I was wrongは「俺が間違ってた」。wrongは形容詞。I was wrong=俺はwrongな状態だった。英語は「人がwrongになる」と言う。日本語の「悪かった」も「俺が悪い状態だった」だから構造は似てる。でも英語のwrongは「間違い」で、日本語の「悪い」は道徳的。英語は正誤、日本語は善悪。ミスvs罪。重さが違う。" },

    { daySlot: 23, japanese: '俺のせい', english: [
        "that's on me",
        "that's on me, 100%, don't blame anyone else",
        "I take full responsibility, this whole thing is on me",
        "that's on me. ON me. like a weight. it's sittin' on my shoulders and I'm carryin' it. and I could try to pass it to someone else -- point fingers, make excuses -- but nah. it's mine. the weight is mine. and honestly? carryin' it is better than dodgin' it. dodging is exhaustin'. at least carryin' it is honest. heavy, but honest."
    ], context: "that's on meのonは「上に乗っかってる」。責任が自分の上に乗ってるイメージ。英語は責任を物理的な重さとして扱う。bear the responsibility(責任を担ぐ)、shoulder the blame(非難を肩に載せる)。全部重量物。日本語の「せい」は「所為」=した行為。原因を指す。英語は重さ、日本語は原因。責任の可視化が違う。" },

    { daySlot: 23, japanese: '言い訳しない', english: [
        "no excuses",
        "no excuses, I'm not gonna sugarcoat it",
        "I could make excuses but I won't, the truth is I dropped the ball",
        "no excuses. none. zero. and believe me, I HAVE excuses. a whole list. traffic, weather, my alarm, the dog, a suspicious noise I had to investigate. all technically valid. but I'm not usin' 'em. 'cause excuses are like junk food. they feel good in the moment but they don't solve anything. I'm eatin' my vegetables today. accountability vegetables."
    ], context: "excuseは「言い訳」だけど、語源はex(外へ)+causa(原因)=原因を外に出す=自分の外に責任を置く。だからno excuses=原因を外に出さない=全部自分の中に留める。dropped the ball(ボールを落とした)はスポーツ由来で「ミスした」。英語はミスをスポーツのプレーに例える。試合は続く。次のプレーで取り返せ。" },

    { daySlot: 23, japanese: '二度としない', english: [
        "it won't happen again",
        "it won't happen again, I promise, lesson learned",
        "I give you my word this will never happen again, I'm serious",
        "it won't happen again. and I know that's what everyone says and then it happens again. but this time I mean it. I've done the analysis. I've identified the root cause. I've implemented countermeasures. I'm my own quality control department now. there's a whole internal review happening. flowcharts and everything. OK not flowcharts. but I thought about it. hard."
    ], context: "it won't happen againのitに注目。何が起きたか具体的に言わない。itで隠す。「あれはもう起きません」。日本語の「二度としない」は「俺が」しない=自分が主語。英語はit won't happen=出来事が主語。自分を主語から外してる。意図的? 無意識? たぶん無意識。英語は出来事を主語にして責任をぼかす癖がある。パッシブ謝罪。" },

    { daySlot: 23, japanese: '許してくれる？', english: [
        "can you forgive me",
        "look, can you forgive me? I know I messed up",
        "I know I don't deserve it but is there any chance you can forgive me?",
        "can you forgive me? and you don't have to answer right now. take your time. 'cause forgiveness isn't a light switch -- you can't just flip it on. it's more like a dimmer. it comes back gradually. and if it never fully comes back, I understand that too. I'm not askin' for a full pardon. I'm askin' for a crack in the door. just a crack."
    ], context: "forgiveはfor(完全に)+give(与える)=完全に与える=手放す。罪を完全に手放してくれ、が語源。日本語の「許す」は「許可する」と同じ語。許す=再び許可を与える。英語は「手放す」、日本語は「許可を再発行する」。forgiveは贈与、許すはライセンス更新。プロセスが違う。" },

    { daySlot: 23, japanese: '反省してる', english: [
        "I've learned my lesson",
        "I've had time to think and I've really learned my lesson",
        "I've done a lot of reflecting and I know exactly where I went wrong",
        "I've learned my lesson. and not the surface-level lesson. the deep one. the one that makes you lie awake at 3 AM starin' at the ceiling goin' 'why did I do that?' THAT lesson. the existential one. the one that restructures your whole decision-makin' framework. yeah. I got that one. it downloaded. firmware updated."
    ], context: "learn my lessonは「教訓を学ぶ」。lessonは「授業」=ミスが先生になる。英語は失敗を教育として扱う。日本語の「反省」は「反(振り返り)」+「省(省みる)」=振り返って自分を見る。英語は「学ぶ」、日本語は「見る」。英語は前進(次に活かす)、日本語は内省(自分を見直す)。ベクトルが外向きvs内向き。" },

    { daySlot: 23, japanese: '取り返しがつかない', english: [
        "I can't undo this",
        "there's no taking this back, the damage is done",
        "I know I can't undo what happened and I have to live with that",
        "I can't undo this. there's no ctrl-Z for real life. no rewind button. no save point to go back to. this happened and it's permanent and I gotta live in the timeline where I made this mistake. there's no alternate universe where I didn't do it. this is the only universe. and in this universe, I messed up. and now I gotta figure out what's next."
    ], context: "undoは「元に戻す」。un+do=やったことを解除する。コンピュータのCtrl+Zと同じ概念。英語はundo、日本語は「取り返す」。取って返す=取りに行って戻す。英語は行為を解除(undo)、日本語は結果を回収(取り返す)。the damage is done(ダメージは完了した)のdoneは完了形。もう終わった。巻き戻せない。" },

    { daySlot: 23, japanese: '弁償する', english: [
        "I'll make it right",
        "let me make it right, tell me what I can do",
        "whatever it takes to fix this, I'm willing to do it, just name it",
        "I'll make it right. and I don't know HOW yet. but the commitment is there. the 'how' is under construction. the 'will' is ready to go. and sometimes that's all you can offer -- the willingness. 'cause the actual solution might take time. but the willingness? that's immediate. I'm willin' right now. this second. deploy me."
    ], context: "make it rightは「正しくする」=修復する。弁償は金銭的な償いだけど、make it rightはもっと広い。金も行動も含む。rightは「正しい」=元のあるべき状態に戻す。英語は修復を「正しさの回復」として捉える。日本語の「弁償」は「弁(わきまえる)」+「償(つぐなう)」=分別を持って代価を払う。英語はright、日本語は代価。" },

    { daySlot: 23, japanese: '謝って済む問題じゃない', english: [
        "sorry isn't enough",
        "I know sorry doesn't cut it, words aren't gonna fix this",
        "I'm not gonna insult you by thinking a simple apology fixes this",
        "I know sorry doesn't cut it. five letters. S-O-R-R-Y. they're just sounds. vibrations in the air. and what I did? that's concrete. real. measurable damage. you can't fix concrete damage with air vibrations. that's not how physics works. sorry is a down payment. the balance is due in actions. and I intend to pay. in full. with interest."
    ], context: "doesn't cut itは「足りない」。cutは「切る」=基準に届かない。cut it=基準線を切る(到達する)ができない。日本語の「済む」は「済=完了」=これで終わりにならない。英語は到達の失敗(cut it)、日本語は完了の不可能(済まない)。面白いのは「すみません」も「済みません」=まだ済んでない=終わらない=申し訳ない。日本語の謝罪は永久に完了しない宣言。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 24: 共感 (Empathy) -- EXPRESS
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 24, japanese: 'わかるよ', english: [
        "I get it",
        "yeah no, I totally get it, that makes sense",
        "I hear you, I completely understand where you're coming from",
        "I get it. and I'm not sayin' 'I get it' as a conversation ender. some people say 'I get it' meanin' 'stop talkin'.' that's not this. this is a real 'I get it.' like, I have felt what you're feelin'. maybe not the same situation. but the same frequency. the same flavor of awful. I've tasted it. I know the taste. keep goin'. I'm here."
    ], context: "I get itは「わかる」だけど、getは「得る」。理解を「手に入れる」感覚。I understand(理解する)よりカジュアル。I feel you(お前を感じる)はさらに共感度が高い。日本語の「わかる」は「分かる」=分けてわかる。英語は得る(get)、日本語は分ける(分かる)。英語は受け取り、日本語は分析。理解のプロセスが違う。" },

    { daySlot: 24, japanese: '大変だったね', english: [
        "that's rough",
        "that's rough, man, I'm sorry you went through that",
        "I can only imagine how hard that must've been, that's really tough",
        "that's rough. and I'm not gonna pretend I know exactly how you feel 'cause I don't. nobody does. your pain is YOUR pain. custom-made. one of a kind. but I've had my own version of rough and it's close enough to know that right now? you don't need advice. you need someone to just sit here and say 'yeah. that sucks.' so yeah. that sucks."
    ], context: "that's roughは「それはキツいね」。roughは「荒い・粗い」。道が荒い=歩くのが大変。英語は人生を道に例える。going through a rough patch(荒い区間を通過中)。日本語の「大変」は「大(おおきい)」+「変(へん)」=大きな変化=異常事態。英語は表面の質感(rough)、日本語は状態の異常さ(大変)。視点が違う。" },

    { daySlot: 24, japanese: '辛いよね', english: [
        "that's gotta hurt",
        "that's gotta hurt, I'm sorry, nobody deserves that",
        "I can see how painful that is, and it's OK to feel that way",
        "that's gotta hurt. and you don't have to pretend it doesn't. you can sit in the hurt for a minute. there's no time limit. no 'you should be over it by now.' there IS no 'by now.' grief and pain don't come with expiration dates. they take as long as they take. and anyone who tells you to 'move on' has never been where you are."
    ], context: "that's gotta hurtのgottaはgot to(〜に違いない)の短縮。hurt(痛い)を相手の代わりに感じてる。英語の共感は「それは痛いに違いない」と推測の形を取る。日本語の「辛いよね」の「よね」は確認。「辛い、でしょ?」と相手に同意を求めてる。英語は推測(gotta)、日本語は確認(よね)。共感の角度が違う。" },

    { daySlot: 24, japanese: '無理しないで', english: [
        "don't push yourself",
        "hey, don't push yourself too hard, take it easy",
        "take care of yourself first, OK? everything else can wait",
        "don't push yourself. and I know you will anyway 'cause you're that type. the 'I'm fine' type. the 'I can handle it' type. but here's the thing -- you don't HAVE to handle it. not everything needs to be handled. some things need to be put down. put it down. walk away. come back when you're ready. the thing will still be there. things are patient."
    ], context: "don't push yourselfのpushは「押す」。自分を押す=無理して前に進ませる。英語は頑張りを「自分を押す」と表現する。push through(押し通る=乗り越える)、push the limits(限界を押す=限界に挑む)。全部pushが「努力」の代名詞。日本語の「無理」は「道理がない」=合理性がない行為。英語は物理力(push)、日本語は論理性(無理)。" },

    { daySlot: 24, japanese: '俺もそういうことあった', english: [
        "I've been there",
        "I've been there, man, I know exactly how that feels",
        "I went through something similar, so I really do understand what you're dealing with",
        "I've been there. and 'there' is a specific place. it's dark. it's lonely. the wifi is bad. and when you're there, everyone's advice sounds like noise. 'cause they're talkin' from 'here' and you're stuck in 'there' and the distance between the two is massive. so I'm not gonna give you advice from here. I'm comin' to there. I'm sittin' with you in the dark."
    ], context: "I've been thereは「俺もそこにいたことがある」。感情を場所として扱う。there=あの辛い場所。英語は感情経験を「行ったことがある場所」にする。I've been in your shoes(お前の靴を履いたことがある)も同じ。日本語の「そういうことあった」は出来事ベース。英語は場所ベース。辛さは場所。行って帰ってきた人だけがわかる地形。" },

    { daySlot: 24, japanese: '気持ちはわかる', english: [
        "I feel you",
        "I feel you, that's a totally valid way to feel",
        "I may not know exactly what you're going through but I feel you on this",
        "I feel you. and not in a 'yeah yeah I get it' way. in a real way. in a 'my chest just got heavy 'cause you're hurtin'' way. 'cause empathy isn't just understandin' someone's pain. it's FEELIN' it. a little. like a sample. not the full meal. but enough to know the flavor. enough to know it's bitter. and I'm tastin' it with you."
    ], context: "I feel youは「お前を感じる」。understand(理解する)より深い。理解は頭、feelは体。英語は共感をfeel(体感)で表現する。日本語の「気持ちはわかる」は「気持ち」を「分かる」=感情を知的に処理してる。英語は体で感じる(feel)、日本語は頭でわかる(分かる)。共感の臓器が違う。英語は心臓、日本語は脳。" },

    { daySlot: 24, japanese: '話聞くよ', english: [
        "I'm here for you",
        "I'm here for you, talk to me, I'm listenin'",
        "whenever you need to talk, I'm here, no judgment, I promise",
        "I'm here for you. and 'here' means here. not 'here but check my phone.' not 'here but thinkin' about dinner.' HERE. full attention. ears open. mouth shut. well, mostly shut. I might say 'mm-hmm' and 'yeah' at appropriate intervals but other than that? I'm a wall you can bounce words off of. a supportive wall. load-bearing wall. I gotchu."
    ], context: "I'm here for youは「ここにいるよ」。forがポイント。for you=お前のために。here(ここ)に存在するだけじゃなく、目的がある存在。I'm here(ここにいる)とI'm here FOR you(お前のためにここにいる)は全然違う。forが目的を注入する。日本語の「話聞くよ」は行為(聞く)を提供してる。英語は存在(here)を提供してる。行為vs存在。" },

    { daySlot: 24, japanese: '一人で抱えないで', english: [
        "you don't have to do this alone",
        "hey, you don't have to carry this alone, let me help",
        "please don't try to handle everything by yourself, that's what friends are for",
        "you don't have to do this alone. and I know you WANT to. 'cause askin' for help feels like admittin' you can't handle it. and you CAN handle it. you're tough. you're capable. but 'can' and 'should' are different words. just 'cause you CAN carry it alone doesn't mean you SHOULD. let me grab one end. we'll carry it together. it's lighter with two."
    ], context: "aloneは「一人で」。do this aloneの「this」は重荷のこと。carry this alone(一人で運ぶ)、go through this alone(一人で通過する)。英語は辛さを荷物か道に例える。日本語の「抱える」は「胸に抱く」=物理的に近い。英語のcarry(運ぶ)は移動。日本語は抱きしめる、英語は運搬する。苦しみとの距離感が違う。日本語のほうが密着してる。" },

    { daySlot: 24, japanese: 'それは辛い', english: [
        "that's brutal",
        "man, that's brutal, I wouldn't wish that on anyone",
        "I'm so sorry, that's genuinely one of the hardest things to go through",
        "that's brutal. and I'm not gonna try to find a silver lining. 'cause sometimes there isn't one. sometimes it's just bad. pure, uncut bad. no upside. no 'but at least...' no 'look on the bright side.' sometimes the whole thing is the dark side and you just gotta sit in it. and the bravest thing you can do? sit in it without runnin'."
    ], context: "brutalは「残酷な」。brut(獣)+al=獣のような。英語の辛さは暴力的な言葉で表現される。brutal、crushing(押し潰す)、devastating(荒廃させる)。全部物理的なダメージ。日本語の「辛い」は味覚(辛い)から来た感情表現。英語は打撃、日本語は味。痛みの感覚チャンネルが違う。英語は殴られる、日本語は食べる。" },

    { daySlot: 24, japanese: '味方だよ', english: [
        "I got your back",
        "I got your back, no matter what, you know that right?",
        "I'm on your side, always have been, always will be, don't forget that",
        "I got your back. and I mean that literally. like, your back. the part you can't see. the blind spot. that's where I am. guardin' the part you can't guard yourself. 'cause everyone can protect their front. you see what's comin'. but the back? that's where you're vulnerable. and that's where I'm standin'. the bodyguard of the blind spot. unpaid, but committed."
    ], context: "I got your backは「お前の背中を守る」。背中=見えない場所=弱点。軍事用語から来てて、仲間の背後を守る意味。英語は味方を「背中の守備」で表現する。日本語の「味方」は「味(mi)+方(kata)」=こちら側の人。英語は空間(背中)、日本語は陣営(こちら側)。サポートの形が違う。英語は守備、日本語は所属。" },

    // ═══════════════════════════════════════════════════════════════
    // Day 25: 意見 (Opinions) -- EXPRESS
    // ═══════════════════════════════════════════════════════════════

    { daySlot: 25, japanese: '俺はこう思う', english: [
        "the way I see it",
        "the way I see it, there's only one real option here",
        "here's my take on it -- you don't have to agree but hear me out",
        "the way I see it -- and this is JUST the way I see it, your mileage may vary -- but the way I see it, there's really only one answer here. and I could be wrong. I've BEEN wrong. spectacularly wrong. but right now, in this moment, with the information I have? this is my read. take it or leave it. I recommend takin' it. but that's just me."
    ], context: "the way I see itは「俺の見方だと」。see=見る。意見を「見え方」として表現する。英語は意見を視覚で扱う。I see your point(お前の言いたいことが見える)、from my perspective(俺の視点から)、in my view(俺の景色では)。全部目の言葉。日本語の「思う」は心の動き。英語は見る、日本語は思う。意見の臓器が目vs心。" },

    { daySlot: 25, japanese: '賛成', english: [
        "I'm with you",
        "I'm with you on this one, that's exactly what I was thinkin'",
        "couldn't agree more, you nailed it, that's spot on",
        "I'm with you. and I don't say that just to agree. I'm not a yes-man. I have my own brain. it does its own thing. but your brain and my brain looked at this and came to the same conclusion independently. like two GPS systems givin' the same route. when two separate calculations match? that's a good sign. we're probably right. probably."
    ], context: "I'm with youは「お前と一緒にいる」=賛成。物理的な位置で立場を表現する。I'm on your side(お前の側にいる)、I stand with you(お前と一緒に立ってる)。全部体の位置。日本語の「賛成」は「賛(たたえる)」+「成(なる)」=褒めて成立させる。英語は「横に立つ」、日本語は「褒めて成立させる」。英語は位置、日本語は評価。" },

    { daySlot: 25, japanese: '反対', english: [
        "I disagree",
        "I gotta disagree on this one, here's why",
        "no disrespect but I see it completely differently, let me explain",
        "I disagree. and I know that sounds confrontational but it's not. disagreement isn't disrespect. it's the opposite. it means I think enough of you to be honest instead of just noddin'. people who always agree with you? they're not your friends. they're your echo. I'd rather be your mirror. mirrors show you the truth. echoes just repeat what you already said."
    ], context: "disagreeのdis-は否定の接頭辞。agree(同意する)を否定。英語は「同意しない」と言う。日本語の「反対」は「反(ひっくり返す)」+「対(向かい合う)」=反転して対面する。英語は否定(dis)、日本語は反転(反)。英語は「NO」を足す、日本語は「向きを変える」。英語は直接否定、日本語は方向転換。だから日本語の反対はソフトに聞こえる。" },

    { daySlot: 25, japanese: '正直に言うと', english: [
        "honestly",
        "honestly? I think we're overthinking this",
        "I'm gonna be straight with you because I think you need to hear this",
        "honestly? and when I say 'honestly' I mean I'm about to say somethin' you might not like. 'cause nobody starts with 'honestly' before good news. 'honestly, you look great' -- nobody says that. 'honestly' is the warning label before a hard truth. it's the seatbelt click before the crash. buckle up. here it comes."
    ], context: "honestlyは意見の前に置く「正直」マーカー。面白いのは、honestlyって言った瞬間「今から本音言うよ」の宣言になること。つまり普段は本音じゃない? 建前があるって暗に認めてる。日本語の「正直に言うと」も同じ。普段は正直じゃないと告白してる。どっちの言語も「これから本音」宣言は「普段は仮面」の証拠。" },

    { daySlot: 25, japanese: '個人的には', english: [
        "personally",
        "personally, I wouldn't go that route, but that's just me",
        "this is just my personal opinion so take it with a grain of salt",
        "personally -- and this is PERSONALLY, not objectively, not universally, not as a fact -- personally, I think there's a better way. but who am I? one person. one brain. one set of experiences. my 'personally' is built on MY life. which is a sample size of one. statistically insignificant. but it's all I got. so here it is. my statistically meaningless opinion."
    ], context: "personallyは「個人的に」。person+ally=人として。意見にpersonallyをつけると「俺だけの意見」と範囲を限定する。日本語の「個人的には」も同じクッション。でも英語のpersonallyは「客観じゃないよ」という免責事項。take it with a grain of salt(一粒の塩と一緒に受け取れ)=話半分に聞けよ。自分の意見に保証書をつけない。" },

    { daySlot: 25, japanese: '一理ある', english: [
        "you've got a point",
        "OK fair, you've got a point there, I'll give you that",
        "I hadn't thought of it that way but you actually make a really good point",
        "you've got a point. and I hate that you've got a point 'cause I was SO committed to MY point. I had my point all polished up. ready to go. and then you come in with YOUR point and now my point looks less pointy. your point is pointier. congratulations. you win the point competition. this round. I'll be back with a sharper point. watch me."
    ], context: "you've got a pointのpointは「先端」=鋭い主張。英語は意見を「尖ったもの」として扱う。a good point(いい指摘)、make a point(主張する)、miss the point(要点を外す)。全部point。日本語の「一理ある」は「一つの理(道理)がある」。英語は尖り(point)、日本語は道理(理)。英語の議論は剣術で、日本語の議論は哲学。" },

    { daySlot: 25, japanese: 'それはどうかな', english: [
        "I'm not so sure",
        "hmm, I'm not so sure about that, something feels off",
        "I don't wanna shut it down but I have some concerns about that approach",
        "I'm not so sure. and I'm not sayin' you're wrong. I'm sayin' I'm not sure you're RIGHT. there's a difference. 'you're wrong' is a wall. 'I'm not sure' is a door. it's open. you can walk through it with evidence and change my mind. I WANT you to change my mind. convince me. I'm convincible. that's a word. I just made it one."
    ], context: "I'm not so sureは「そうかな」の英語版。直接否定しない。sure(確信)がnot so(それほどない)。100%否定じゃなく確信度を下げるだけ。日本語の「どうかな」もsure/unsureのグレーゾーン。英語は確信のレベルを数値的に下げる(not SO sure=それほど確実じゃない)。日本語は「どう」=方向を疑問にする。英語は強度、日本語は方向。" },

    { daySlot: 25, japanese: '俺の意見だけど', english: [
        "just my two cents",
        "just my two cents, but I think we should go a different direction",
        "take this or leave it but here's what I think we should do",
        "just my two cents. and I know two cents isn't worth much. it's literally the lowest denomination of opinion. but here's the thing -- sometimes the cheap opinions are the honest ones. the expensive opinions come with agendas. two-cent opinions come with nothin'. no strings attached. it's the clearance rack of advice. low price, surprisingly useful."
    ], context: "my two centsは「俺の2セント」=俺のちっぽけな意見。2セント(約3円)の価値しかない意見、と謙遜する。put in my two cents(2セント入れさせて)。英語は意見を硬貨として投入する。日本語の「俺の意見だけど」の「だけど」は逆接で「聞かなくてもいいけど」のクッション。英語は金額で謙遜、日本語は接続詞で謙遜。方法は違うけど目的は同じ。" },

    { daySlot: 25, japanese: '間違ってるかもしれないけど', english: [
        "I could be wrong",
        "I could be totally wrong but here's what I'm thinkin'",
        "correct me if I'm off base but isn't the real issue something else entirely?",
        "I could be wrong. and I want you to know that's not false modesty. I COULD be wrong. historically, I HAVE been wrong. many times. about many things. my track record of being right is... let's say 'inconsistent.' but even a broken clock is right twice a day. and maybe this is one of my twice-a-day moments. let's find out together."
    ], context: "I could be wrongのcouldは仮定法。「間違ってる可能性がある」と自分の意見にリスクラベルを貼る。correct me if I'm wrong(間違ってたら訂正して)も同じ。英語は意見を言う前に「間違いの可能性」を公式に認める文化。日本語の「かもしれないけど」も同じだけど、英語のほうがフォーマルに聞こえる。could(可能性)が仮定法という文法装置。日本語の「かも」はもっとカジュアルに不確実さを出せる。" },

    { daySlot: 25, japanese: 'はっきり言って', english: [
        "let me be blunt",
        "let me be blunt here -- this isn't working",
        "I'm not gonna sugarcoat it, I think we need a completely new plan",
        "let me be blunt. and I know 'blunt' can feel aggressive but I think we're past the point of diplomatic language. diplomacy is great when you have time. we don't have time. so here it is. raw. unfiltered. no seasoning. the plain truth. and the plain truth is ugly sometimes. but ugly truth beats pretty lies. every time. in every universe. fight me."
    ], context: "bluntは「鈍い・無遠慮な」。刃物のblunt(切れない)と同じ語。鋭くない=繊細じゃない=ストレートに言う。sugarcoat(砂糖でコーティングする)しない=甘い包装をしない。英語は率直さを「コーティングの除去」で表現する。日本語の「はっきり」は「はっきり」=くっきり見える。英語は包装(sugar)を剥がす、日本語は視界(はっきり)を確保する。率直さの比喩が違う。" },

];
