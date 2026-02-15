// Seed Day 040 (words 400-449) -- Feb 10-14
// Day 040: 暗闇が怖い、ベッドの下のモンスター（4歳、男）
// ALL sentences are SPOKEN DIALOGUE -- actual things people say out loud
// g-dropping, grammar breaking, fillers, real spoken English
// Characters: Timmy(4M,scared boy), Mom/Sarah(32F,ER nurse), Dad/Greg(35M,lawyer),
//   Emma(8F,science nerd sister), Grandpa Frank(68M,retired plumber),
//   Noah(4M,sleepover buddy), Kayla(16F,babysitter), Uncle Danny(30M,conspiracy theorist)

const DAY40_DATA = [
    {
        id: '0u5GAHY6', // life of the party
        speaker: "Mom",
        sentence: "Timmy's usually the life of the party but tonight he's scared stiff 'cause he thinks there's somethin' under his bed. Greg, can you please talk to him before we leave?",
        sentence_ja: "ティミーは普段盛り上げ役なのに、今夜はベッドの下に何かいると思って怖くて固まってる。グレッグ、出かける前に話してくれない？",
        idiom: "scared stiff",
        idiom_meaning: "so frightened you can't move / 怖くて固まる"
    },
    {
        id: 'VjbXsKnB', // softy
        speaker: "Dad",
        sentence: "OK fine, I'll go check under the bed. I'm such a softy. But if somethin' jumps out at me and I jump out of my skin, that's on you, Sarah.",
        sentence_ja: "わかったよ、ベッドの下見てくるよ。俺って甘いよな。でも何か出てきて俺がびっくり仰天したら、それはサラのせいだからな。",
        idiom: "jump out of one's skin",
        idiom_meaning: "be extremely startled / びっくり仰天する"
    },
    {
        id: '-xWjMx1D', // Random Joe
        speaker: "Timmy",
        sentence: "Daddy, you can't just send some Random Joe to check. YOU gotta check. And tell me when the coast is clear. Promise?",
        sentence_ja: "パパ、知らない人に見てもらうんじゃダメなの。パパが見なきゃ。安全ってわかったら教えて。約束？",
        idiom: "the coast is clear",
        idiom_meaning: "no danger present / 安全である・危険がない"
    },
    {
        id: 'j8WzuQTs', // inattentive
        speaker: "Dad",
        meaning: "不注意な・注意散漫な",
        sentence: "Timmy, I checked, there's nothin' there. You're bein' inattentive to the facts, buddy. The monster -- if there was one -- would've made a beeline for the kitchen by now. Monsters love snacks.",
        sentence_ja: "ティミー、確認したよ、何もない。事実をちゃんと見てないぞ。モンスターがいたとしても、もうとっくにキッチンにまっすぐ行ってるよ。モンスターはおやつが大好きだから。",
        idiom: "make a beeline for",
        idiom_meaning: "go directly toward / まっすぐ向かう"
    },
    {
        id: 'nPZ_sEmF', // standoff
        speaker: "Kayla",
        sentence: "OK so I just got here and Timmy's already in a standoff with his own bedroom. Cool. How am I supposed to get these kids to catch some z's? This is gonna be a long night.",
        sentence_ja: "着いたばかりなのにティミーもう自分の部屋とにらみ合いしてる。いいね。どうやってこの子たち寝かせるの？長い夜になりそう。",
        idiom: "catch some z's",
        idiom_meaning: "get some sleep / 睡眠を取る"
    },
    {
        id: '0HfHo1MX', // set up
        speaker: "Emma",
        sentence: "Noah, my parents totally set up this whole babysitter thing so they could go to dinner. Dad thinks he's sneaky but honestly it cracks me up how bad he is at lying.",
        sentence_ja: "ノア、パパとママ完全にディナー行くためにベビーシッター仕組んだんだよ。パパ自分では上手いつもりだけど、ウソがヘタすぎてマジ笑える。",
        idiom: "crack someone up",
        idiom_meaning: "make someone laugh hard / 爆笑させる"
    },
    {
        id: 'shYQ-ECD', // squad
        speaker: "Noah",
        sentence: "Timmy! My mom dropped me off! Our squad is here! I brought my flashlight AND my ninja sword. I get a kick out of monster huntin'. Let's DO this.",
        sentence_ja: "ティミー！ママが送ってくれた！仲間が来たよ！懐中電灯と忍者の剣持ってきた。モンスター退治めっちゃ楽しいんだよね。やろうぜ！",
        idiom: "get a kick out of",
        idiom_meaning: "enjoy something a lot / すごく楽しむ"
    },
    {
        id: 'wphsc4Iy', // jurisdiction
        speaker: "Dad",
        sentence: "OK Kayla, as of right now this apartment is under your jurisdiction. Don't let the kids run around like headless chickens after 8 PM. And call us if -- actually, just... handle it.",
        sentence_ja: "OK ケイラ、今からこのアパートは君の管轄だ。8時以降は子供たちを走り回らせないで。もし何かあったら電話 -- いや、まあ...よろしく。",
        idiom: "run around like headless chickens",
        idiom_meaning: "act frantically without direction / パニックで無秩序に動き回る"
    },
    {
        id: 'gCFZfNHp', // spank
        speaker: "Grandpa Frank",
        sentence: "In MY day, if a kid wouldn't go to bed, you'd get a spank and that was that. But I'm just a stone's throw away in the guest room if you kids need me, alright?",
        sentence_ja: "ワシの時代は、寝ない子はお尻ペンペンで終わりだった。でもワシはゲストルームのすぐ近くにいるから、何かあったら呼びな。",
        idiom: "a stone's throw away",
        idiom_meaning: "very close / すぐ近く"
    },
    {
        id: 'Gw5UmA8j', // spanker
        speaker: "Uncle Danny",
        meaning: "(英俗) すごいもの・最高のもの",
        sentence: "Frank, nobody's spankin' anybody. Also that movie we watched earlier was a real spanker, right? Anyway, I'll keep an eye on the boys. Go rest, old man.",
        sentence_ja: "フランク、誰もお尻なんか叩かないよ。あとさっき見た映画マジ最高だったよね？とにかく、男の子たち見とくから。爺さんは休みなよ。",
        idiom: "keep an eye on",
        idiom_meaning: "watch carefully / 見張る・注意して見る"
    },
    {
        id: 'OBpKxpHF', // gig
        speaker: "Kayla",
        meaning: "仕事・短期バイト・ライブ",
        sentence: "This babysittin' gig is way harder than I thought. Timmy's dad is a lawyer and Timmy already argues like one -- the apple doesn't fall far from the tree, I swear.",
        sentence_ja: "このベビーシッターのバイト、思ったよりキツい。ティミーのパパが弁護士でティミーもう弁護士みたいに議論するし -- カエルの子はカエルって本当だわ。",
        idiom: "the apple doesn't fall far from the tree",
        idiom_meaning: "children resemble their parents / カエルの子はカエル"
    },
    {
        id: 'yw1Jun7b', // patronize
        speaker: "Emma",
        meaning: "見下す・恩着せがましくする",
        sentence: "Mom, stop patronizing Timmy. Tellin' him 'there's no monsters' doesn't work. Actions speak louder than words. Gimme the flashlight, I'll PROVE there's nothin' under there.",
        sentence_ja: "ママ、ティミーに子供扱いするのやめて。「モンスターなんていないよ」って言っても無駄。行動で示さなきゃ。懐中電灯貸して、ベッドの下に何もないって証明するから。",
        idiom: "actions speak louder than words",
        idiom_meaning: "doing is better than just saying / 行動は言葉より雄弁"
    },
    {
        id: 'ZuBCS_oY', // log on
        speaker: "Kayla",
        sentence: "OK I'm gonna log on to Disney Plus for you guys. And Timmy? Monsters under beds? That's an old wives' tale. Like, literally no one has ever found one. Ever.",
        sentence_ja: "OK、ディズニープラスつけてあげるね。あとティミー？ベッドの下のモンスター？あれはおばあちゃんの迷信だよ。マジで今まで誰も見つけたことないから。一度も。",
        idiom: "an old wives' tale",
        idiom_meaning: "a superstition or false belief / 迷信・根拠のない言い伝え"
    },
    {
        id: 'zjI_IbyD', // roll the dice
        speaker: "Dad",
        sentence: "I know leavin' tonight was kinda rollin' the dice, but the kid's gotta learn. And Sarah, please don't encourage him to investigate weird noises -- curiosity killed the cat, remember?",
        sentence_ja: "今夜出かけるのはちょっとギャンブルだったけど、あの子も学ばなきゃ。あとサラ、変な音を調べるよう勧めないで -- 好奇心は猫を殺すって言うだろ？",
        idiom: "curiosity killed the cat",
        idiom_meaning: "being too curious can be dangerous / 好奇心は身を滅ぼす"
    },
    {
        id: 'wMeYZrZj', // entrap
        speaker: "Timmy",
        sentence: "Noah, I think the monster is tryin' to entrap us! It's makin' noises to get us to come out! ...No I'm NOT cryin' wolf, there really IS a noise! Listen!",
        sentence_ja: "ノア、モンスターが僕たちを罠にかけようとしてると思う！おびき出すために音立ててるんだ！...嘘じゃないよ、本当に音するんだってば！聞いて！",
        idiom: "cry wolf",
        idiom_meaning: "give a false alarm / 嘘の警報を出す・オオカミ少年"
    },
    {
        id: 'Qfh01trW', // forks
        speaker: "Grandpa Frank",
        meaning: "(俗) 親（folks）/ フォーク",
        sentence: "My forks -- my folks, I mean -- they would've fought tooth and nail to keep us safe from anythin'. Just like I would for you rascals. Now pipe down and go to sleep.",
        sentence_ja: "ワシの親は -- 何からでも俺たちを守るために死ぬ気で戦っただろう。お前たちのためにも同じだ。さあ静かにして寝なさい。",
        idiom: "fight tooth and nail",
        idiom_meaning: "fight with everything you have / 死に物狂いで戦う"
    },
    {
        id: 'EuQcvVWk', // on the block
        speaker: "Uncle Danny",
        sentence: "Dude, this is literally the oldest house on the block. They built it from scratch like 80 years ago. Of course it makes creepy noises. ...That doesn't mean there AREN'T ghosts though.",
        sentence_ja: "いや、ここマジでこの近所で一番古い家だぞ。80年前にゼロから建てたんだから。変な音するの当たり前。...でもだからって幽霊がいないとは言ってないけどね。",
        idiom: "from scratch",
        idiom_meaning: "from the very beginning / ゼロから・一から"
    },
    {
        id: 'hvJC-7jP', // water main
        speaker: "Grandpa Frank",
        meaning: "水道本管",
        sentence: "For cryin' out loud, Danny, give it a rest with the ghost talk. That noise? It's the water main. Old pipes make noise. I was a plumber for 40 years, I know pipes.",
        sentence_ja: "もういい加減にしろよダニー、幽霊の話はやめろ。あの音？水道本管だよ。古いパイプは音がする。ワシは40年配管工やったんだ、パイプのことはわかる。",
        idiom: "give it a rest",
        idiom_meaning: "stop talking about it / いい加減にやめろ"
    },
    {
        id: 'KcllGdlY', // geyser
        speaker: "Emma",
        sentence: "Noah, did you know a geyser can shoot water like 200 feet in the air? Old Faithful goes off every 90 minutes. Timmy always goes bananas when I talk about Yellowstone.",
        sentence_ja: "ノア、間欠泉って水を60メートルも噴き上げるって知ってた？オールドフェイスフルは90分ごとに噴き出すんだよ。イエローストーンの話するとティミーいっつも大興奮するの。",
        idiom: "go bananas",
        idiom_meaning: "go crazy with excitement / 大興奮する・おかしくなる"
    },
    {
        id: 'mk0GqhGj', // spew
        speaker: "Noah",
        sentence: "What if the monster can spew fire?! ...OK OK your grandpa has a heart of gold and he says it's just pipes. But WHAT IF the pipes are actually a dragon?",
        sentence_ja: "もしモンスターが火を吐けたら？！...わかったわかった、おじいちゃんは優しくてただのパイプだって言ってるけど。でもそのパイプが実はドラゴンだったら？",
        idiom: "have a heart of gold",
        idiom_meaning: "be very kind and generous / とても優しい心を持つ"
    },
    {
        id: 'ObpRVX1G', // hatch
        speaker: "Timmy",
        meaning: "孵化する・（計画を）企む",
        sentence: "Noah! I hatched a plan! We build a fort with ALL the pillows! Kayla, bring the couch cushions! We gotta do it in the nick of time before the monster comes out at midnight!",
        sentence_ja: "ノア！作戦思いついた！全部の枕で砦作る！ケイラ、ソファのクッション持ってきて！真夜中にモンスターが出てくる前にギリギリ間に合わせなきゃ！",
        idiom: "in the nick of time",
        idiom_meaning: "just barely in time / ギリギリ間に合う"
    },
    {
        id: 'rwZR1tkx', // buzz cut
        speaker: "Grandpa Frank",
        sentence: "When I got my first buzz cut in the Army, I was about as scared as you two. My sergeant looked at me cryin' and said 'I'll let it slide THIS time, private.' Heh. Good times.",
        sentence_ja: "ワシが軍隊で初めてスポーツ刈りにされた時、お前たちと同じくらい怖かったぞ。軍曹がワシの泣き顔見て『今回だけは見逃してやる、二等兵』って。ヘヘ。いい思い出だ。",
        idiom: "let it slide",
        idiom_meaning: "overlook or ignore something / 見逃す・大目に見る"
    },
    {
        id: 'C-6b-rAc', // all hands on deck
        speaker: "Kayla",
        sentence: "OK it's all hands on deck for this pillow fort. Noah, grab those cushions. Emma, sheets. Gettin' these kids to sleep is like pulling teeth, I swear to God.",
        sentence_ja: "OK、枕砦作るの全員総出でやるよ。ノア、クッション取って。エマ、シーツ。この子たち寝かせるのマジ至難の業だわ。",
        idiom: "like pulling teeth",
        idiom_meaning: "extremely difficult / 至難の業・非常に困難"
    },
    {
        id: 'cuGX0fEh', // asleep at the wheel
        speaker: "Mom",
        sentence: "Kayla, I hope you're not asleep at the wheel over there. Long story short, Timmy gets like this every time there's a thunderstorm. Just put on Bluey and he'll calm down.",
        sentence_ja: "ケイラ、ちゃんと見ててくれてるよね。手短に言うと、ティミーは雷のたびにこうなるの。Bluey つけてあげたら落ち着くから。",
        idiom: "long story short",
        idiom_meaning: "to summarize briefly / 手短に言うと"
    },
    {
        id: 'kJSSQK7d', // landslide
        speaker: "Noah",
        meaning: "地すべり・（選挙の）圧勝",
        sentence: "OH NO THE FORT! It's a landslide! All the pillows fell! Timmy I can't make heads or tails of where the door was! We're trapped! ...Wait no, that's just the blanket on my face.",
        sentence_ja: "あーーフォートが！地滑りだ！枕全部落ちた！ティミー、ドアがどこだったかわかんない！閉じ込められた！...あ待って、毛布が顔の上にあっただけだ。",
        idiom: "make heads or tails of",
        idiom_meaning: "understand or figure out / 理解する・見当がつく"
    },
    {
        id: 'xaXVm0x9', // with good reason
        speaker: "Dad",
        sentence: "He's freaked out and honestly, with good reason -- that house makes weird noises at night. Sendin' the plumber over tomorrow is a no-brainer. I should've done it months ago.",
        sentence_ja: "あいつ怖がってるけど、正直無理もない -- あの家は夜変な音するから。明日配管工呼ぶのは当然だ。何ヶ月も前にやるべきだった。",
        idiom: "no-brainer",
        idiom_meaning: "an obvious decision / 考えるまでもないこと"
    },
    {
        id: 'IMs54kBe', // stay-at-home mom (typo: sty-at-home mom in DB)
        speaker: "Uncle Danny",
        meaning: "専業主婦",
        sentence: "My neighbor Lisa's a stay-at-home mom and she told me her kid saw a shadow figure in the hallway. I'm like, not in a million years would I sleep in that house. ...Why are you all lookin' at me like that?",
        sentence_ja: "隣のリサは専業主婦なんだけど、子供が廊下で影の人を見たって。俺ならあの家には絶対に住まない。...なんでみんなそんな目で俺を見てるの？",
        idiom: "not in a million years",
        idiom_meaning: "absolutely never / 絶対にありえない"
    },
    {
        id: 'KKXW6K5Z', // cryptic
        speaker: "Emma",
        meaning: "謎めいた・暗号のような",
        sentence: "I left a cryptic note under Timmy's pillow that says 'the darkness is your friend.' I thought it'd help but now he's even more on edge. Oops. Maybe I shoulda worded that different.",
        sentence_ja: "ティミーの枕の下に『闇はあなたの味方』って謎のメモ置いといた。助けになると思ったのに余計ピリピリしてる。やば。言い方変えればよかった。",
        idiom: "on edge",
        idiom_meaning: "nervous and anxious / ピリピリしている・神経質な"
    },
    {
        id: 'N3SiKFKp', // trite
        speaker: "Kayla",
        meaning: "ありきたりな・陳腐な",
        sentence: "OK I know 'there's nothin' to be afraid of' sounds super trite, but like... what else am I supposed to say? Emma's science explanations are way over his head and Danny's ghost stories are NOT helpin'.",
        sentence_ja: "「怖いことなんて何もないよ」がありきたりに聞こえるのはわかるけど...他に何て言えばいいの？エマの科学的説明は難しすぎるし、ダニーの幽霊話は全然助けになってないし。",
        idiom: "over one's head",
        idiom_meaning: "too difficult to understand / 難しすぎる・理解できない"
    },
    {
        id: 'V3OsEbcE', // nerd
        speaker: "Noah",
        sentence: "Emma, you're such a nerd but like in a cool way. Hey is Timmy out cold? ...No wait, he's just coverin' his whole head with the blanket again. Dude. You can't breathe like that.",
        sentence_ja: "エマ、マジオタクだけどカッコいいオタクだよね。あれ、ティミー気絶してる？...いや待って、また毛布で頭全部隠してるだけだ。おい、そんなんじゃ息できないぞ。",
        idiom: "out cold",
        idiom_meaning: "completely unconscious or asleep / 完全に気絶・爆睡"
    },
    {
        id: '7p3Ha1Ro', // desist
        speaker: "Dad",
        meaning: "やめる・中止する",
        sentence: "Danny, I'm gonna need you to cease and desist with the paranormal stories RIGHT now. Scaryin' a 4-year-old is out of your league -- you're supposed to be the cool uncle, not the creepy one.",
        sentence_ja: "ダニー、心霊話は今すぐやめてくれ。4歳児を怖がらせるなんてお前の柄じゃない -- クールなおじさんのはずだろ、怖いおじさんじゃなくて。",
        idiom: "out of one's league",
        idiom_meaning: "beyond one's ability or status / 分不相応・手に負えない"
    },
    {
        id: 'g0lh0XQK', // fatwa
        speaker: "Uncle Danny",
        meaning: "ファトワー（イスラム法学者の宗教的裁定）",
        sentence: "Yo Greg, chill. Mom basically issued a fatwa on me tellin' ghost stories when I was like 12. Old habits. Anyway, these two boys are packed like sardines in that pillow fort. Kinda adorable.",
        sentence_ja: "よーグレッグ、落ち着けよ。ママが俺が12歳の時に幽霊話禁止令出したんだよ。古い癖だわ。つーかあの二人、枕砦にすし詰めになってる。ちょっとかわいいな。",
        idiom: "packed like sardines",
        idiom_meaning: "very tightly crowded / すし詰め・ぎゅうぎゅう"
    },
    {
        id: '9FOF9MVH', // screw around
        speaker: "Kayla",
        meaning: "ふざける・時間を無駄にする",
        sentence: "OK boys, stop screwin' around. It's 9:30. Here's my pep talk: monsters aren't real, your grandpa's right here, and if you go to sleep now I'll make pancakes in the morning. Deal?",
        sentence_ja: "OK、ふざけるのやめて。もう9時半だよ。はい、励ましの言葉：モンスターはいない、おじいちゃんがすぐそこにいる、今寝たら朝パンケーキ作ってあげる。約束？",
        idiom: "pep talk",
        idiom_meaning: "a motivational speech / 励ましの言葉・激励"
    },
    {
        id: 'lZwkMZv4', // condescend
        speaker: "Emma",
        meaning: "見下す・恩着せがましくする",
        sentence: "I HATE it when grown-ups condescend to me. Like, I'm 8, not stupid. And Uncle Danny's 'shadow figure' story? Total red herring. He just doesn't want us to notice he ate all the cookies.",
        sentence_ja: "大人が見下してくるのマジ嫌い。8歳だけどバカじゃないから。あとダニーおじさんの「影の人」の話？完全にミスリード。クッキー全部食べたのバレたくないだけでしょ。",
        idiom: "red herring",
        idiom_meaning: "a misleading distraction / ミスリード・目くらまし"
    },
    {
        id: 'gkPjNQ1O', // snide
        speaker: "Uncle Danny",
        sentence: "OK that was kinda a snide comment, Emma. I'm just tryin' to have fun here, no need to rock the boat. ...But for real though, I did eat those cookies. My bad.",
        sentence_ja: "エマ、それちょっとイヤミだよね。俺はただ楽しもうとしてるだけ、波風立てなくていいよ。...でもマジでクッキーは食べた。ごめん。",
        idiom: "rock the boat",
        idiom_meaning: "cause trouble or disruption / 波風を立てる"
    },
    {
        id: '4ErsZNv6', // larceny
        speaker: "Dad",
        sentence: "Danny, eatin' all the kids' cookies? That's straight-up larceny, dude. I know you're rough around the edges but come on. Buy more on the way home tomorrow.",
        sentence_ja: "ダニー、子供たちのクッキー全部食べたの？それ完全に窃盗だぞ。ガサツなのはわかるけど、頼むよ。明日の帰りに買ってきて。",
        idiom: "rough around the edges",
        idiom_meaning: "lacking refinement / 粗削り・ガサツ"
    },
    {
        id: '6_wqx1bw', // scramble
        speaker: "Timmy",
        sentence: "NOAH! Did you hear that?! SCRAMBLE SCRAMBLE! Get in the fort! ...Actually I'm kinda runnin' out of steam. I've been scared for like a billion hours. Can I just sleep in the fort?",
        sentence_ja: "ノア！聞こえた？！逃げろ逃げろ！砦に入って！...ていうかもう疲れてきた。もう百万時間くらい怖がってる。砦で寝てもいい？",
        idiom: "run out of steam",
        idiom_meaning: "lose energy or motivation / 力尽きる・息切れする"
    },
    {
        id: 'hM8T5pKW', // regenerative medicine
        speaker: "Mom",
        sentence: "Kayla, I had a patient today who's in a regenerative medicine trial -- amazing stuff. Anyway, are the boys safe and sound? Tell Timmy I'll be home in 20 minutes.",
        sentence_ja: "ケイラ、今日再生医療の治験の患者さんがいて -- すごい技術なの。それはそうと、男の子たち大丈夫？ティミーに20分で帰るって伝えて。",
        idiom: "safe and sound",
        idiom_meaning: "unharmed and secure / 無事に・安全に"
    },
    {
        id: 'GX8hZ8VS', // concurrent
        speaker: "Kayla",
        meaning: "同時進行の・並行する",
        sentence: "I got like three concurrent crises goin' on -- Timmy's monster, Noah's gotta pee but won't leave the fort, and my SAT practice test is due tomorrow. I'm startin' to see the light though. They're gettin' sleepy.",
        sentence_ja: "同時進行で3つ危機がある -- ティミーのモンスター、ノアがトイレ行きたいけど砦から出たくない、そして私のSAT模試が明日締切。でも光が見えてきた。眠くなってきてる。",
        idiom: "see the light",
        idiom_meaning: "begin to understand or see hope / 光が見える・理解し始める"
    },
    {
        id: 'u9AuvV3_', // graft
        speaker: "Mom",
        sentence: "I'm home! ...Why is everyone in the living room? Danny, stop shootin' the breeze about ghosts. Oh, today at work we did a skin graft on a burn patient -- went really well. Timmy, baby, you OK?",
        sentence_ja: "ただいま！...なんでみんなリビングにいるの？ダニー、幽霊話もうやめて。あ、今日仕事でやけど患者さんに皮膚移植したんだけど、うまくいったの。ティミー、大丈夫？",
        idiom: "shoot the breeze",
        idiom_meaning: "chat casually / 雑談する・おしゃべりする"
    },
    {
        id: 'J3PAluHG', // hideous
        speaker: "Timmy",
        meaning: "ひどく醜い・おぞましい",
        sentence: "Mommy! The monster is hideous! It's got big teeth and red eyes and -- and it makes the pipes go BAAANG and my heart skipped a beat and Noah almost peed!",
        sentence_ja: "ママ！モンスターすっごく怖いの！大きい歯と赤い目があって -- パイプがバーンって鳴って心臓ドキッてなってノアおしっこしそうになった！",
        idiom: "skip a beat",
        idiom_meaning: "feel a sudden shock of emotion / ドキッとする"
    },
    {
        id: 'H39176Px', // retina
        speaker: "Mom",
        sentence: "OK baby, listen. Mommy's a nurse, right? Your retina -- that's the back of your eye -- it does funny things in the dark. It sees shapes that aren't there. Snap out of it, sweetheart. Your eyes are tricking you.",
        sentence_ja: "OK、聞いて。ママは看護師でしょ？網膜 -- 目の奥の部分 -- は暗いと変なことするの。ないものが見えたりする。しっかりして。目がイタズラしてるだけだよ。",
        idiom: "snap out of it",
        idiom_meaning: "stop being in a bad state / しっかりする・我に返る"
    },
    {
        id: 'OaK8lPgZ', // iris
        speaker: "Emma",
        sentence: "And also? Your iris -- that's the colored part -- opens up super wide in the dark to let in more light. So you see MORE but it's all blurry and weird. So far so good with my explanation?",
        sentence_ja: "あとね？虹彩 -- 色がついてる部分 -- は暗いとすごく大きく開いて光をもっと入れるの。だからもっと見えるけど全部ぼやけて変になる。ここまでの説明OK？",
        idiom: "so far so good",
        idiom_meaning: "everything is fine up to now / 今のところ順調"
    },
    {
        id: 'quhLUOjl', // cornea
        speaker: "Mom",
        sentence: "The cornea is like a little window on your eye. In the dark, everything looks different through it. The monster was right under your nose the whole time -- it was just your pile of stuffed animals, baby.",
        sentence_ja: "角膜は目の上の小さい窓みたいなの。暗いとそこを通して全部違って見える。モンスターはずっと目の前にいたよ -- ぬいぐるみの山だっただけ。",
        idiom: "under one's nose",
        idiom_meaning: "right in front of someone / 目の前に・すぐそばに"
    },
    {
        id: '04TQ2lZE', // amputee
        speaker: "Grandpa Frank",
        sentence: "You know, my Army buddy Jim was an amputee -- lost his leg in '82. Bravest guy I knew. We stuck together through thick and thin. If HE wasn't scared of anything, you shouldn't be either, Timmy.",
        sentence_ja: "ワシの戦友のジムは片足を失った -- 82年にな。知ってる中で一番勇敢な男だった。どんな時も一緒にいた。あいつが何も怖くなかったんだから、お前も怖がらなくていいぞ。",
        idiom: "through thick and thin",
        idiom_meaning: "through good and bad times / どんな時も・苦楽を共に"
    },
    {
        id: 'OA-hWDKg', // take on
        speaker: "Timmy",
        sentence: "OK... OK I'll take on the monster. But I need Captain Fuzzy. And my ninja sword. And Noah. Noah, you got anythin' up your sleeve? Like... a real weapon?",
        sentence_ja: "OK...OK、モンスターやっつける。でもキャプテンファジーが必要。あと忍者の剣。あとノア。ノア、何か隠し技ある？本物の武器とか...？",
        idiom: "up one's sleeve",
        idiom_meaning: "a hidden trick or plan / 隠し技・奥の手"
    },
    {
        id: 'O_6LjMNX', // solemn
        speaker: "Grandpa Frank",
        meaning: "厳粛な・真剣な",
        sentence: "Timmy, I make a solemn promise right now: no monster's gettin' past this old man. They'd take ME on? Ha! When pigs fly. Now close those eyes, soldier.",
        sentence_ja: "ティミー、今ここで厳粛に約束する：このじいさんを通り越してモンスターなんか来ない。ワシに挑む？ハッ！ありえない。さあ目を閉じろ、兵士。",
        idiom: "when pigs fly",
        idiom_meaning: "something that will never happen / ありえない・絶対ない"
    },
    {
        id: 'UowXXxu0', // elbow grease
        speaker: "Grandpa Frank",
        meaning: "懸命な労力・力仕事",
        sentence: "Tomorrow we'll fix that pillow fort proper. It needs some real elbow grease -- yours fell apart 'cause you used too many blankets. And Noah thinkin' it'd hold without tape? Wishful thinkin', kid.",
        sentence_ja: "明日ちゃんと枕砦直すぞ。本気の力仕事がいる -- お前らのは毛布使いすぎて崩れたんだ。テープなしで持つと思ったノア？甘い考えだぞ。",
        idiom: "wishful thinking",
        idiom_meaning: "believing something because you want it to be true / 甘い考え・希望的観測"
    },
    {
        id: 'jZygh3SB', // somehow
        speaker: "Kayla",
        sentence: "Timmy somehow fell asleep holdin' Captain Fuzzy in one hand and Noah's ninja sword in the other. I think we can officially call it a night. Thank GOD.",
        sentence_ja: "ティミーがなぜか片手にキャプテンファジー、もう片手にノアの忍者の剣を持ったまま寝てた。公式に今夜は終了でいいよね。マジよかった。",
        idiom: "call it a night",
        idiom_meaning: "stop what you're doing for the evening / 今夜はおしまいにする"
    },
    {
        id: 'K0wv2M7Y', // circulation
        speaker: "Mom",
        meaning: "循環・血行・流通",
        sentence: "Greg, the blanket's too tight around his legs -- you gotta check his circulation. But look at him... he's sleepin' like a log now. Both of 'em. Our little monster hunters.",
        sentence_ja: "グレッグ、毛布が脚の周りきつすぎる -- 血行確認して。でも見てよ...ぐっすり寝てる。二人とも。うちの小さなモンスターハンターたち。",
        idiom: "sleep like a log",
        idiom_meaning: "sleep very deeply / ぐっすり眠る"
    },
];

async function seedDay40() {
    console.log('Seeding Day 040 -- Monster Under the Bed (words 400-449)...');
    let success = 0;
    let failed = 0;
    let meaningFixed = 0;

    for (const item of DAY40_DATA) {
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

seedDay40();
