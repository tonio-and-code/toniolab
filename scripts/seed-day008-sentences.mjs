// Seed Scenario 008 (words 350-399) -- Feb 5-9
// Scenario 008: 大学のパーティー（20歳、男）
// ALL sentences are SPOKEN DIALOGUE -- actual things people say out loud
// g-dropping, grammar breaking, fillers, real spoken English
// Characters: Tyler(20M,host/introvert), Brandon(21M,roommate/party animal),
//   Alyssa(20F,Tyler's crush), Derek(22M,senior DJ), Megan(19F,freshman),
//   Professor Hayes(55M,neighbor), Zoe(20F,social media), Jake(21M,frat bro),
//   Kenji(20M,exchange student from Tokyo), Rosa(20F,designated driver/sober)

const DAY008_DATA = [
    {
        id: 'kQJgbWAs', // live rough
        speaker: "Rosa",
        meaning: "野宿する・路上生活をする",
        sentence: "Brandon thinks he's the life of the party but he's literally been livin' rough on Tyler's couch for two weeks 'cause his own apartment's got a roach problem. Somebody tell him.",
        sentence_ja: "ブランドンは自分がパーティーの盛り上げ役だと思ってるけど、自分のアパートにゴキブリが出るから2週間タイラーのソファで居候状態。誰か教えてあげて。",
        idiom: "the life of the party",
        idiom_meaning: "the most entertaining person at a social event / パーティーの中心人物"
    },
    {
        id: '8XtixQHV', // SPICU
        speaker: "Megan",
        meaning: "特殊病原体ICU（Special Pathogens ICU）",
        sentence: "So my roommate's pre-med and she was tellin' me about the SPICU -- like a special pathogens ICU? -- and I totally crashed and burned on my bio midterm this week tryin' to study that stuff. This party is exactly what I needed honestly.",
        sentence_ja: "ルームメイトが医学部志望で、SPICUっていう特殊病原体のICUの話してて、今週の生物の中間テストでその勉強しようとして大失敗した。正直このパーティー、まさに必要だったやつ。",
        idiom: "crash and burn",
        idiom_meaning: "fail spectacularly / 大失敗する・派手にコケる"
    },
    {
        id: 'wFK5fdUk', // another day's work
        speaker: "Brandon",
        meaning: "いつもの仕事・日常茶飯事",
        sentence: "Dude, settin' up a party? That's just another day's work for me, bro. But this time we went all out -- got a keg, three kinds of dip, the whole thing. Tyler's freakin' out about the security deposit but like... it's fine. Probably.",
        sentence_ja: "おい、パーティーのセッティング？俺にとっちゃ日常茶飯事だよ。でも今回は全力投球 -- ケグ、ディップ3種類、全部揃えた。タイラーが敷金のこと心配してるけど...大丈夫。多分。",
        idiom: "go all out",
        idiom_meaning: "put in maximum effort / 全力を出す・本気でやる"
    },
    {
        id: 'WEy5iaJ3', // I think for myself.
        speaker: "Tyler",
        meaning: "自分で考える・自分の意見を持つ",
        sentence: "I know Brandon's runnin' this whole thing but I think for myself, alright? I'm NOT lettin' Alyssa's comfort take a backseat just 'cause Jake showed up with like fifteen randos. If she's uncomfortable, I'm shuttin' it down.",
        sentence_ja: "ブランドンがこの全部を仕切ってるのはわかってるけど、俺は自分で考えるから。ジェイクが15人の知らん奴ら連れてきたからって、アリッサの居心地を後回しにはしない。彼女が嫌なら、終わりにする。",
        idiom: "take a backseat",
        idiom_meaning: "become less important or take a secondary role / 後回しになる・一歩引く"
    },
    {
        id: 'ROZjUmkJ', // something inside me
        speaker: "Tyler",
        meaning: "心の中の何か・内なる衝動",
        sentence: "There's somethin' inside me that wants to just go up to Alyssa and be like 'hey I really like you' but I can't just wear my heart on my sleeve like that at MY OWN party. If she says no I gotta live here. With Brandon. Who will NEVER let me forget it.",
        sentence_ja: "心の中の何かがアリッサのとこ行って『好きなんだ』って言いたがってるけど、自分のパーティーでそんな感情丸出しにできない。断られたらここに住み続けなきゃいけない。ブランドンと。絶対忘れさせてもらえない。",
        idiom: "wear one's heart on one's sleeve",
        idiom_meaning: "openly show your emotions / 感情を隠さない・気持ちを表に出す"
    },
    {
        id: 'JnDmqMxK', // tune out
        speaker: "Derek",
        meaning: "無視する・聞き流す",
        sentence: "Nah bro, just tune out the haters. I'm runnin' the show on this playlist and if one more person asks me to play that TikTok song I swear I'm unplugin' the speakers. My aux, my rules.",
        sentence_ja: "いや、アンチは聞き流せよ。このプレイリストは俺が仕切ってんの。もう一人でもあのTikTokの曲かけてって言ったらスピーカー抜くからな。俺のAUX、俺のルール。",
        idiom: "run the show",
        idiom_meaning: "be in charge of everything / 仕切る・取り仕切る"
    },
    {
        id: 'OEcub7Ru', // DNI
        speaker: "Zoe",
        meaning: "Do Not Interact（関わるな）/ 国家情報長官",
        sentence: "OK so that guy from Jake's group is totally on my DNI list -- do NOT interact -- but he keeps tryin' to get in my selfies. Also Tyler's been keepin' Alyssa totally in the dark about how he feels and it's SO obvious. Like, everyone can see it, dude.",
        sentence_ja: "OK あのジェイクのグループの奴、完全にDNIリスト -- 関わるな -- なのに私のセルフィーに入ろうとしてくる。あとタイラーがアリッサに気持ちを全然隠してるけど超バレバレ。みんなわかってるから。",
        idiom: "in the dark",
        idiom_meaning: "unaware, uninformed / 何も知らない・蚊帳の外"
    },
    {
        id: 'sJEiuVS6', // on the ground
        speaker: "Professor Hayes",
        meaning: "現場で・地上で",
        sentence: "I've been very patient but I'm here on the ground at your front door because I draw the line at rattlin' my bookshelves off the wall. This is the THIRD time tonight. Do I need to call campus police?",
        sentence_ja: "かなり我慢してきたが、本棚が壁から落ちそうになるのは一線を越えてる。だから直接玄関まで来た。今夜3回目だぞ。キャンパスポリスを呼ぶ必要があるか？",
        idiom: "draw the line",
        idiom_meaning: "set a limit on what you'll accept / 一線を引く・限度を設ける"
    },
    {
        id: 'rOmj5IMQ', // habeas corpus
        speaker: "Jake",
        sentence: "Bro the old dude next door is actin' like he's got a habeas corpus for the party or somethin'. Who does he think he is, callin' the shots about OUR music? It's a Saturday night, we have RIGHTS.",
        sentence_ja: "隣のジイさん、パーティーの人身保護令状でも持ってるみたいに振る舞ってんだけど。誰だよ、俺らの音楽に指図してんのは。土曜の夜だぞ、俺らには権利がある。",
        idiom: "call the shots",
        idiom_meaning: "make the decisions, be in control / 指図する・主導権を握る"
    },
    {
        id: '0SBBv9W_', // cut a rug
        speaker: "Brandon",
        meaning: "ダンスする・踊りまくる",
        sentence: "Yooo, Megan's actually cuttin' a rug out there! I thought freshmen were supposed to be all shy and stuff. Nah she's totally lettin' her hair down. Love the energy. This is what college is ALL about, baby.",
        sentence_ja: "おお、メーガンがマジで踊りまくってる！新入生って内気だと思ってたけど。いや完全にリラックスして楽しんでんじゃん。このエネルギー最高。これが大学ってやつだよ。",
        idiom: "let one's hair down",
        idiom_meaning: "relax and enjoy yourself / リラックスして楽しむ・はじける"
    },
    {
        id: 'lXLDJa1C', // misconstrue
        speaker: "Alyssa",
        meaning: "誤解する・曲解する",
        sentence: "Don't misconstrue this but I kinda came here tonight 'cause I heard Tyler was throwin' it. And like... I can see right through his whole 'oh I'm just bein' a cool host' act. He gets SO nervous when I'm around. It's cute, honestly.",
        sentence_ja: "誤解しないでほしいけど、今夜来たのはタイラーがパーティーやるって聞いたからなんだよね。あと...彼の「俺はただのクールなホスト」って演技、見透かしてるから。私がいると超緊張するの。正直かわいい。",
        idiom: "see right through",
        idiom_meaning: "recognize the truth behind a facade / 見透かす・お見通し"
    },
    {
        id: 'GKmbsKle', // stand idly by
        speaker: "Rosa",
        meaning: "傍観する・何もせず見ている",
        sentence: "I can't just stand idly by while people are drinkin' themselves stupid. Somebody's gotta be the responsible one tonight. Jake needs to get a grip -- he's already knocked over two lamps and the night's barely started.",
        sentence_ja: "みんなが酔いつぶれるのをただ傍観してるわけにいかない。今夜は誰かが責任ある行動しなきゃ。ジェイクはしっかりしろ -- もうランプ2個倒してて、夜はまだ始まったばっかなのに。",
        idiom: "get a grip",
        idiom_meaning: "get control of yourself / しっかりする・落ち着く"
    },
    {
        id: '89c7qZSK', // overbreath
        speaker: "Kenji",
        meaning: "オーバーブレス（overbreadth: 過度の広範性、法律用語）",
        sentence: "So in Japan we have this thing about... hmm, off the top of my head I can't remember the English word. But this 'overbreath' thing someone mentioned -- is that like a law thing? American parties are SO different from Japanese nomikai. Way more chaotic.",
        sentence_ja: "日本ではこういう...うーん、すぐには英語の単語が思い出せない。でもさっき誰かが言ってた「オーバーブレス」って法律の用語？アメリカのパーティーは日本の飲み会と全然違う。カオスすぎ。",
        idiom: "off the top of one's head",
        idiom_meaning: "immediately, without careful thought / 即座に・すぐ思いつくままに"
    },
    {
        id: 'Dc2VUpzh', // as luck would have it
        speaker: "Tyler",
        meaning: "幸運にも（不運にも）・偶然にも",
        sentence: "As luck would have it, Alyssa showed up right when I had BBQ sauce all over my shirt. Life keeps throwin' me curveballs, I swear. Brandon's like 'just change your shirt bro' but my room's full of coats now. WHOSE coats are those??",
        sentence_ja: "運の悪いことに、俺がシャツにBBQソースべったりの時にアリッサが来た。人生は予想外のことばかり。ブランドンが「シャツ着替えろよ」って言うけど部屋がコートだらけ。誰のコート？？",
        idiom: "throw a curveball",
        idiom_meaning: "do something unexpected / 予想外のことをする・不意を突く"
    },
    {
        id: 'TSxkt4jV', // stationary troops
        speaker: "Jake",
        meaning: "駐屯部隊（garrison）",
        sentence: "Yo me and my boys are like stationary troops guardin' the beer pong table -- we ain't movin'. If Derek wants to play he can stand his ground and wait his turn like everybody else. First come first served, bro.",
        sentence_ja: "俺と仲間はビアポンテーブルを守る駐屯兵みたいなもん -- 動かないよ。デレクがやりたきゃ自分の立場を守って順番待ちすればいい。早い者勝ちだぞ。",
        idiom: "stand one's ground",
        idiom_meaning: "maintain your position firmly / 立場を守る・一歩も引かない"
    },
    {
        id: 'A9sP8r12', // sign on the dotted line
        speaker: "Professor Hayes",
        meaning: "正式に署名する・契約する",
        sentence: "When I signed on the dotted line for my condo, I had NO idea I'd be living next to... this. The noise complaints are just the tip of the iceberg -- last week there was a pizza delivery at 3 AM and someone rang MY doorbell by mistake.",
        sentence_ja: "マンションの契約書に署名した時、こんなのが隣になるとは思わなかった。騒音の苦情なんて氷山の一角 -- 先週深夜3時にピザの配達が間違えてうちのドアベル鳴らしたんだ。",
        idiom: "the tip of the iceberg",
        idiom_meaning: "only a small part of a much larger problem / 氷山の一角"
    },
    {
        id: 'QYzPLS12', // surmise
        speaker: "Alyssa",
        meaning: "推測する・推察する",
        sentence: "I'm gonna surmise that Tyler specifically invited me... 'cause like, nobody else from our history class is here. He's totally playin' dumb about it too. 'Oh you came? Cool, whatever.' Boy, I know you planned this.",
        sentence_ja: "タイラーが特別に私を招待したって推察してるんだけど...だって歴史の授業の人、他に誰もいないし。しかもとぼけてんの。「あ、来たんだ？いいね」って。わかってるからね。",
        idiom: "play dumb",
        idiom_meaning: "pretend to not know something / とぼける・知らないふりをする"
    },
    {
        id: 'TygRhNKS', // yard of ale
        speaker: "Jake",
        meaning: "ヤード・オブ・エール（約90cmの長いグラスのビール）",
        sentence: "Bro I brought a yard of ale glass from my frat house -- it's like three FEET tall. Tonight we're livin' it up! Who wants to chug race? Tyler? You look like you need a drink, my guy.",
        sentence_ja: "フラットハウスからヤード・オブ・エールのグラス持ってきた -- 約90cmあるやつ。今夜は楽しむぞ！一気飲みレースやる人？タイラー？一杯必要そうだぞ。",
        idiom: "live it up",
        idiom_meaning: "enjoy life to the fullest / 人生を楽しむ・思いっきり遊ぶ"
    },
    {
        id: 'JBR4qgrq', // zygote
        speaker: "Megan",
        meaning: "接合子・受精卵",
        sentence: "I literally learned what a zygote was like two weeks ago in biology and now I can't unhear it. My whole major is still up in the air honestly -- I keep switchin' between bio and psych. College is confusin', man.",
        sentence_ja: "2週間前に生物学で受精卵って何かやっと学んだのに、もう頭から離れない。専攻はまだ宙ぶらりん正直 -- 生物と心理を行ったり来たり。大学ってわけわかんない。",
        idiom: "up in the air",
        idiom_meaning: "uncertain, undecided / 未定で・宙ぶらりん"
    },
    {
        id: '8cebYbL0', // lucre
        speaker: "Brandon",
        meaning: "金・金銭（filthy lucre = 不正な金）",
        sentence: "Don't even worry about the lucre for the party, bro -- I got like three people to Venmo me for snacks. Tonight we're paintin' the town red! Well, technically we're paintin' the apartment red but SAME THING.",
        sentence_ja: "パーティーの金のことなんか心配すんな -- 3人からスナック代をVenmoでもらった。今夜は大いに遊ぶぞ！まあ正確にはアパートの中で騒ぐだけだけど同じことだ。",
        idiom: "paint the town red",
        idiom_meaning: "go out and have a wild time / 町で大いに遊ぶ・どんちゃん騒ぎする"
    },
    {
        id: 'rIMH4rAk', // pander
        speaker: "Derek",
        meaning: "迎合する・おもねる",
        sentence: "I'm NOT panderin' to these people with their basic playlist requests. I don't care if everyone's got a soft spot for that old Drake song -- I'm playin' REAL music tonight. Deep cuts only. Y'all can thank me later.",
        sentence_ja: "こいつらのベタなリクエストに迎合するつもりはない。みんなあの昔のドレイクの曲が好きだとしても -- 今夜は本物の音楽をかける。マニアックな曲だけ。後で感謝しろ。",
        idiom: "have a soft spot for",
        idiom_meaning: "have a weakness or fondness for / ～に弱い・～が好き"
    },
    {
        id: 'SwX1dyH3', // look to
        speaker: "Tyler",
        meaning: "～に頼る・～を当てにする",
        sentence: "Everyone keeps lookin' to me to fix stuff 'cause it's my apartment and I'm like... I didn't even WANT this party? Brandon got totally carried away with the guest list -- was supposed to be like ten people, now there's fifty.",
        sentence_ja: "みんな俺のアパートだからって何かあると頼ってくるけど...このパーティー、そもそも俺は望んでなかったんだけど？ブランドンがゲストリストで完全に調子に乗って -- 10人のはずが50人になった。",
        idiom: "get carried away",
        idiom_meaning: "become overly excited and go too far / 調子に乗る・エスカレートする"
    },
    {
        id: 'XZ76b7Ja', // and all that jazz
        speaker: "Zoe",
        sentence: "I'm postin' stories about the vibe, the music, the food, and all that jazz. Documentin' the whole shebang tonight for content. My followers are gonna LOSE it when they see Jake try to do a keg stand.",
        sentence_ja: "雰囲気、音楽、食べ物、そういう全部をストーリーにあげてる。今夜は全部まるごとコンテンツ用に記録。ジェイクがケグスタンドやろうとするの見たらフォロワー発狂する。",
        idiom: "the whole shebang",
        idiom_meaning: "everything, the entire thing / 全部まるごと・一切合切"
    },
    {
        id: 'Ig2H5_Vk', // you zig when you should zag
        speaker: "Brandon",
        meaning: "逆の行動をとる・判断を間違える",
        sentence: "Tyler, you keep ziggin' when you should zag, bro. Alyssa's RIGHT THERE and you're in the kitchen washin' cups. You're gonna blow it! Go talk to her before some other dude does, I'm beggin' you.",
        sentence_ja: "タイラー、お前いつも逆の行動取るんだよ。アリッサがすぐそこにいるのに台所でコップ洗ってんの。しくじるぞ！他の奴にいかれる前に話しかけろよ、頼むから。",
        idiom: "blow it",
        idiom_meaning: "ruin an opportunity / しくじる・チャンスを逃す"
    },
    {
        id: 'ffifQHjH', // die laughing
        speaker: "Zoe",
        meaning: "大爆笑する・笑い死にする",
        sentence: "I literally DIED laughin' when Jake made a scene tryin' to do a backflip off the couch and completely ate it. Got the whole thing on video too. This is premium content right here, you guys.",
        sentence_ja: "ジェイクがソファからバク宙しようとして騒ぎ起こして見事に失敗した時、マジで爆笑した。全部動画撮ってある。これこそプレミアムコンテンツよ。",
        idiom: "make a scene",
        idiom_meaning: "cause a public disturbance / 騒ぎを起こす・大騒ぎする"
    },
    {
        id: '4pBdd0-K', // whisk off
        speaker: "Tyler",
        meaning: "さっと連れ去る・素早く片付ける",
        sentence: "I gotta whisk the good towels off the bathroom before someone ruins 'em. Brandon keeps sayin' we should spice things up with a pool party but WE DON'T HAVE A POOL. The man is delusional, I swear.",
        sentence_ja: "誰かに台無しにされる前にバスルームのいいタオルをさっと持ち出さなきゃ。ブランドンがプールパーティーで盛り上げようって言うけどプールないんだけど。あいつマジで妄想症だ。",
        idiom: "spice things up",
        idiom_meaning: "make something more exciting / 盛り上げる・刺激を加える"
    },
    {
        id: 'CtJDvUlC', // down for the count
        speaker: "Rosa",
        meaning: "ノックアウト状態・完全に寝落ち",
        sentence: "Jake's friend is already down for the count on the couch and it's not even midnight. People keep callin' me a party pooper for not drinkin' but somebody's gotta drive these fools home safe. You're welcome.",
        sentence_ja: "ジェイクの友達がまだ真夜中にもなってないのにソファでノックアウト状態。飲んでないからパーティーをしらけさせるなって言われるけど、この馬鹿たちを安全に家に送る人が必要でしょ。どういたしまして。",
        idiom: "party pooper",
        idiom_meaning: "someone who ruins the fun / 場をしらけさせる人・盛り下げ役"
    },
    {
        id: 'OA1ngRKG', // lead on
        speaker: "Alyssa",
        meaning: "先導する / 思わせぶりな態度をとる",
        sentence: "I don't wanna lead Tyler on if I'm not sure about my feelings yet but... he's kinda been comin' out of his shell tonight? Like he actually told a joke earlier and it was genuinely funny. Not just 'cute nervous boy' funny, actually funny.",
        sentence_ja: "まだ気持ちが確かじゃないならタイラーに思わせぶりはしたくないけど...今夜ちょっと殻を破ってきてる？さっきジョーク言ったんだけど本当に面白かった。「かわいい緊張してる男の子」じゃなくて、ガチで面白い。",
        idiom: "come out of one's shell",
        idiom_meaning: "become more sociable and confident / 殻を破る・打ち解ける"
    },
    {
        id: '_jsQlwJL', // fisticuffs
        speaker: "Jake",
        meaning: "殴り合い・拳での喧嘩",
        sentence: "Almost got into fisticuffs with some dude over the last slice of pizza but I put on a brave face and shared it. Nah I'm lyin', I just ripped it in half and shoved my piece in my mouth before he could say anything. Alpha move.",
        sentence_ja: "ピザの最後の1枚で知らん奴と殴り合いになりかけたけど、大人の対応して分けた。嘘、半分に引きちぎって何か言われる前に口に突っ込んだ。アルファの動き。",
        idiom: "put on a brave face",
        idiom_meaning: "pretend to be confident or happy / 平気なふりをする・強がる"
    },
    {
        id: 'ZCDCyIIy', // it stands to reason that
        speaker: "Kenji",
        meaning: "～は当然のことである・理にかなっている",
        sentence: "It stands to reason that Americans would have different party customs, but I didn't expect... all THIS. In Japan you gotta think on your feet when someone offers you a drink -- it's rude to say no. Here it's like... anything goes?",
        sentence_ja: "アメリカのパーティー文化が違うのは当然だけど、ここまでとは思わなかった。日本では飲み物を勧められたら臨機応変に対応しなきゃ -- 断るのは失礼。ここは...何でもありみたい？",
        idiom: "think on one's feet",
        idiom_meaning: "react quickly and effectively / 臨機応変に対応する・即座に判断する"
    },
    {
        id: 'YF2bhdf2', // NSCAR
        speaker: "Brandon",
        meaning: "NASCAR（全米自動車レース協会）",
        sentence: "Dude I just put NASCAR on the TV in the background and Derek FLIPPED. He's like 'this isn't the vibe' but honestly I'm turnin' a blind eye to his DJ dictatorship. My apartment, my TV, I'll watch whatever I want.",
        sentence_ja: "テレビでバックグラウンドにNASCAR流したらデレクがキレた。「雰囲気に合わない」って言うけど、正直彼のDJ独裁は見て見ぬふりだ。俺のアパート、俺のテレビ、好きなもん見る。",
        idiom: "turn a blind eye",
        idiom_meaning: "deliberately ignore something / 見て見ぬふりをする"
    },
    {
        id: 'lqTqSQkm', // mutual friend
        speaker: "Alyssa",
        meaning: "共通の友人",
        sentence: "Tyler and I have like eight mutual friends but we've never really hung out just the two of us. We had that weird moment last semester but that's water under the bridge now... I think. Unless it's not? Ugh, I'm overanalyzing this.",
        sentence_ja: "タイラーとは共通の友達が8人くらいいるけど、二人きりでは遊んだことない。去年の学期にちょっと気まずい瞬間があったけど、もう過ぎたこと...だと思う。そうじゃなかったら？うー、考えすぎ。",
        idiom: "water under the bridge",
        idiom_meaning: "past events that are no longer important / 過ぎたこと・水に流す"
    },
    {
        id: 'a1MFLZq1', // have it in for someone
        speaker: "Derek",
        meaning: "～を恨んでいる・～を目の敵にしている",
        sentence: "Jake definitely has it in for me tonight, keeps tryin' to steal the aux. That dude really rubs me the wrong way with his whole 'I brought fifteen people so I get to pick the music' logic. Nah bro, that's not how this works.",
        sentence_ja: "ジェイクは今夜確実に俺を狙ってる、ずっとAUXを奪おうとしてくる。あいつの「15人連れてきたから音楽選ぶ権利がある」って理屈マジで神経に障る。いや、そういうシステムじゃないから。",
        idiom: "rub someone the wrong way",
        idiom_meaning: "irritate or annoy someone / 神経に障る・反感を買う"
    },
    {
        id: 'xsRPE5Ds', // reciprocal
        speaker: "Kenji",
        meaning: "相互の・互恵的な",
        sentence: "In Japanese culture gift giving is very reciprocal -- you always give something back. So when Tyler offered me a beer I was put on the spot 'cause I didn't bring anything! Very embarrassing. Next time I'm bringing Japanese snacks for sure.",
        sentence_ja: "日本の文化ではお返しは相互的 -- 必ず何かお返しする。タイラーがビールくれた時、手ぶらだったから困った！すごく恥ずかしい。次は絶対日本のお菓子持ってくる。",
        idiom: "on the spot",
        idiom_meaning: "put in a difficult position suddenly / その場で困らされる・窮地に立たされる"
    },
    {
        id: 'GBuHRAQB', // come May, I'll be 28.
        speaker: "Alyssa",
        meaning: "5月になれば（come + 時 = ～になれば）",
        sentence: "Come May, I'll be twenty-one and can FINALLY buy my own drinks legally. But honestly I completely lost track of time tonight just talkin' to Tyler in the kitchen. We were in there for like an hour and it felt like ten minutes.",
        sentence_ja: "5月になったら21歳になってやっと合法的にお酒買える。でも正直今夜タイラーと台所で話してたら完全に時間忘れてた。1時間くらいいたのに10分みたいだった。",
        idiom: "lose track of time",
        idiom_meaning: "not be aware of how much time has passed / 時間を忘れる"
    },
    {
        id: 'mgSz134I', // introvert
        speaker: "Tyler",
        meaning: "内向的な人（対: extrovert）",
        sentence: "I'm literally the biggest introvert alive hostin' the biggest party of the semester. Brandon's totally in his element though -- dude's like a social butterfly on crack. Me? I've been hidin' in the kitchen refilling chip bowls for the past hour.",
        sentence_ja: "史上最大の内向型人間が学期最大のパーティーをホストしてる。ブランドンは完全に水を得た魚だけど -- あいつは社交の化身。俺？ここ1時間、台所でチップスの皿を補充して隠れてた。",
        idiom: "in one's element",
        idiom_meaning: "in a situation where you feel comfortable and capable / 水を得た魚のように・得意分野で"
    },
    {
        id: 'Njo6MAul', // squabble
        speaker: "Derek",
        meaning: "口論・些細な言い争い",
        sentence: "Me and Jake got into a squabble over the music AGAIN. He's always tryin' to hog the spotlight with his frat anthems. Bro, nobody here wants to hear 'Wagon Wheel' for the fifth time tonight. READ THE ROOM.",
        sentence_ja: "ジェイクとまた音楽のことで口論した。あいつはいつもフラットの定番曲で注目を独占しようとする。おい、今夜5回目の「ワゴンホイール」は誰も聴きたくないんだよ。空気読め。",
        idiom: "hog the spotlight",
        idiom_meaning: "take all the attention for yourself / 注目を独占する・目立ちたがる"
    },
    {
        id: 'ba4lsx1d', // atrocity
        speaker: "Professor Hayes",
        sentence: "The absolute atrocity of that bass level at 11 PM on a Saturday... I'm an adjunct professor making $2,800 a month and THIS is what I come home to. These kids will show their true colors when they get the noise fine from housing.",
        sentence_ja: "土曜夜11時のあの低音レベルの非道さよ...非常勤講師で月2800ドルしかもらってないのに、帰ったらこれか。住居課から騒音の罰金が来た時にこの子たちは本性を見せるだろう。",
        idiom: "show one's true colors",
        idiom_meaning: "reveal your real character / 本性を見せる・正体を現す"
    },
    {
        id: 'CXa6VmdP', // taxidermist
        speaker: "Megan",
        meaning: "剥製師（taxidermy = 剥製術）",
        sentence: "OK so random but there's a stuffed owl on the shelf and I asked Tyler about it and he said his uncle's a taxidermist? That totally set the tone for the weirdest conversation I've ever had at a party. College is WILD.",
        sentence_ja: "OK超ランダムだけど棚に剥製のフクロウがあって、タイラーに聞いたら叔父さんが剥製師なんだって。それがきっかけでパーティーで今まで最も変な会話になった。大学ってヤバい。",
        idiom: "set the tone",
        idiom_meaning: "establish the mood or atmosphere / 雰囲気を決める・ムードを作る"
    },
    {
        id: 'j7wDNqIt', // grind one's gears
        speaker: "Tyler",
        meaning: "イライラさせる・神経に障る",
        sentence: "It really grinds my gears that Brandon invited everybody and THEIR mom without askin' me first. And Jake's really gettin' under my skin with the uninvited crew. But Alyssa's here so... I guess I'll deal with it.",
        sentence_ja: "ブランドンが俺に聞かずに全員とその母親まで招待したの本当にイライラする。あとジェイクの招待されてない集団がマジで神経に障る。でもアリッサがいるから...我慢するか。",
        idiom: "get under someone's skin",
        idiom_meaning: "annoy or irritate someone deeply / 神経に障る・イライラさせる"
    },
    {
        id: '9H-etTXc', // surly
        speaker: "Brandon",
        meaning: "無愛想な・不機嫌な",
        sentence: "Professor Hayes came to the door again and he was SO surly about it. I had to bite my tongue and not say 'dude it's Saturday night, go to bed.' Tyler's givin' me that look like 'don't make it worse' so I just apologized. Boring.",
        sentence_ja: "ヘイズ教授がまたドアに来てめっちゃ不機嫌だった。「土曜の夜なんだから寝ろよ」って言いたいのを我慢した。タイラーが「悪化させるな」って顔してたから謝った。つまんね。",
        idiom: "bite one's tongue",
        idiom_meaning: "stop yourself from saying something / ぐっと我慢して黙る"
    },
    {
        id: 'F1YpOeKw', // dreary
        speaker: "Megan",
        meaning: "退屈な・陰鬱な・わびしい",
        sentence: "My dorm room is SO dreary -- like fluorescent lights and cinderblock walls, zero personality. That's why I love just kickin' back at someone else's place. Tyler's apartment actually has, like, real furniture and stuff. This is what growin' up looks like.",
        sentence_ja: "寮の部屋がマジで陰気 -- 蛍光灯にコンクリートブロックの壁、個性ゼロ。だから誰かの家でくつろぐの好き。タイラーのアパートには本物の家具とかあるし。これが大人になるってことか。",
        idiom: "kick back",
        idiom_meaning: "relax and take it easy / リラックスする・くつろぐ"
    },
    {
        id: 'f78-DK56', // sedentary
        speaker: "Rosa",
        meaning: "座りっぱなしの・定住性の",
        sentence: "I've been so sedentary this whole party just sittin' on this stool judgin' everybody. My friendship with Jake is honestly on the rocks after he showed up with all those randos without tellin' anyone. So rude.",
        sentence_ja: "パーティー中ずっとこのスツールに座りっぱなしでみんなを観察してた。ジェイクが誰にも言わずにあんな見知らぬ人連れてきたから、正直友情が危機的状況。失礼すぎ。",
        idiom: "on the rocks",
        idiom_meaning: "in trouble, likely to fail / 危機的状況で・うまくいっていない"
    },
    {
        id: 'qbfzw5Qr', // free-for-all
        speaker: "Zoe",
        meaning: "乱戦・何でもあり・誰でも参加の混乱",
        sentence: "Beer pong just turned into a complete free-for-all -- there's like four teams playin' at once and nobody knows whose turn it is. Everybody just cut loose after Derek played that throwback song. Content GOLD right now.",
        sentence_ja: "ビアポンが完全に乱戦になった -- 4チームが同時にプレーしてて誰の番かわからない。デレクがあの懐メロかけた後、みんなはじけた。今まさにコンテンツの宝庫。",
        idiom: "cut loose",
        idiom_meaning: "let go and enjoy freely / はじける・解放される"
    },
    {
        id: 'XolU-lmK', // coefficient of restitution
        speaker: "Kenji",
        sentence: "In physics class we learned about coefficient of restitution -- how bouncy something is, basically. That ping pong ball has a VERY high one. Anyway, I think Tyler wants to pull the plug on this party but Brandon won't let him. Interesting group dynamics.",
        sentence_ja: "物理の授業で反発係数を習った -- 基本的に弾むかどうか。あの卓球のボールはめっちゃ高い。ところで、タイラーはパーティーを終わらせたいみたいだけどブランドンが許さない。面白いグループダイナミクス。",
        idiom: "pull the plug",
        idiom_meaning: "put an end to something / やめる・中止する・終わらせる"
    },
    {
        id: 'ZSUAozW0', // vehemently
        speaker: "Professor Hayes",
        meaning: "激しく・猛烈に",
        sentence: "I am VEHEMENTLY opposed to this kind of behavior on a school night -- well, technically it's Saturday, but my point stands. If I have to have a go at calling campus security one more time, I WILL. Consider this your final warning.",
        sentence_ja: "このような振る舞いには猛烈に反対だ -- まあ技術的には土曜日だが、論点は変わらない。もう一度キャンパスセキュリティに連絡する羽目になるなら、するぞ。最終警告と思え。",
        idiom: "have a go at",
        idiom_meaning: "attempt or try something / やってみる・試みる"
    },
    {
        id: '0bhm77wL', // DD
        speaker: "Rosa",
        meaning: "DD（Designated Driver 代行運転手 / Development Disability 発達障害）",
        sentence: "Yeah I'm the DD tonight -- designated driver, not the other thing. Once people start hittin' the road around 1 AM I'll be the one makin' sure everyone gets home in one piece. It's not glamorous but somebody's gotta do it.",
        sentence_ja: "今夜のDDは私 -- 代行運転手ね、もう一つの意味じゃなくて。みんなが1時頃に帰り始めたら、全員無事に帰宅させるのが私の仕事。華やかじゃないけど誰かがやらないと。",
        idiom: "hit the road",
        idiom_meaning: "leave, start a journey / 出発する・帰る"
    },
    {
        id: 'FONZakhf', // muddy up
        speaker: "Tyler",
        meaning: "泥だらけにする・汚す",
        sentence: "Jake's crew totally muddied up the bathroom floor with their dirty shoes and I'm like... dude. The fact that he didn't even apologize speaks volumes about the kinda person he is. That's my security deposit walkin' out the door.",
        sentence_ja: "ジェイクの仲間が汚い靴でバスルームの床を泥だらけにして...おい。謝りもしない事実があいつの人間性を物語ってる。俺の敷金がドアから出ていくのが見える。",
        idiom: "speak volumes",
        idiom_meaning: "express a lot without words / 多くを物語る・雄弁に語る"
    },
    {
        id: 'kwSK93B3', // horse trading
        speaker: "Derek",
        meaning: "駆け引き・取引交渉",
        sentence: "OK fine, I'll do some horse trading with Jake -- he gets ONE song and then I get the aux back for the rest of the night. But if he throws a wrench in that deal and plays two songs, we're done. DONE.",
        sentence_ja: "OK わかった、ジェイクと駆け引きする -- 1曲だけ許可して残りは俺がAUXを取り返す。でもあの取り決めを台無しにして2曲かけたら、終わり。終わりだから。",
        idiom: "throw a wrench in",
        idiom_meaning: "disrupt or sabotage plans / 計画を台無しにする・邪魔をする"
    },
    {
        id: 'PNE3301r', // perk
        speaker: "Alyssa",
        meaning: "特典・おまけ・副収入",
        sentence: "One of the perks of showin' up to Tyler's party is the snacks are actually amazing -- like who makes homemade guac for a house party? Tyler told me to just take it easy and enjoy myself. I think he's finally relaxin' a little. About time.",
        sentence_ja: "タイラーのパーティーに来る特典はスナックが実はめっちゃ美味しいこと -- ホームパーティーで手作りワカモレ作る人いる？タイラーがリラックスして楽しんでって言ってくれた。やっと少しリラックスしてきたみたい。やっとね。",
        idiom: "take it easy",
        idiom_meaning: "relax, don't worry / リラックスする・気楽にやる"
    },
];

async function seedDay008() {
    console.log('Seeding Scenario 008 -- College Party (20M)...\n');
    let success = 0;
    let failed = 0;
    let meaningFixed = 0;

    for (const item of DAY008_DATA) {
        try {
            // PATCH review data
            const res = await fetch(`http://localhost:3001/api/user-phrases/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    review_sentence: item.sentence,
                    review_sentence_ja: item.sentence_ja,
                    review_idiom: item.idiom,
                    review_idiom_meaning: item.idiom_meaning,
                }),
            });
            const data = await res.json();
            if (data.success) {
                success++;
                console.log(`  OK: [${item.speaker}] ${item.idiom}`);
            } else {
                failed++;
                console.log(`  FAIL: ${item.id} - ${JSON.stringify(data)}`);
            }

            // PUT meaning fix (if meaning field exists)
            if (item.meaning) {
                const mRes = await fetch(`http://localhost:3001/api/user-phrases/${item.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ meaning: item.meaning }),
                });
                const mData = await mRes.json();
                if (mData.success) {
                    meaningFixed++;
                    console.log(`    -> meaning fixed: ${item.meaning}`);
                }
            }
        } catch (err) {
            failed++;
            console.log(`  ERROR: ${item.id} - ${err.message}`);
        }
    }

    console.log(`\nDone! Review: ${success}/50, Meanings fixed: ${meaningFixed}`);
}

seedDay008();
