// Seed Day 042 (words 500-549) -- Feb 20-24
// Day 042: First Movie Without Parents (12歳, グループ)
// ALL sentences are SPOKEN DIALOGUE -- actual things people say out loud
// g-dropping (70-80%), grammar breaking, fillers, real spoken English
// Characters: Jayden(12M, ringleader, acts 16 but panics at real decisions),
//   Maddie(12F, anxious about everything, mom texts every 3 min, hand sanitizer),
//   Tyler C.(12M, class clown, nonstop commentary, eats everyone's snacks),
//   Ava(12F, film nerd, already read every spoiler, wanted the indie movie),
//   Benji(11M, Jayden's little brother, wasn't supposed to come, zero volume control),
//   Mrs. Chen(42F, Jayden's mom, hovering via text, threatened to come inside),
//   Marcus(17M, movie theater usher, bored, on phone, zero authority),
//   Old Man Gus(70M, grumpy retiree in row F, shushes everyone)
// Story: 5-day arc. Day 1: Drop-off, lobby, buying tickets/snacks.
//   Day 2: Finding seats, movie starts, trying to act cool.
//   Day 3: Mid-movie chaos -- bathroom, noise, Gus confrontation.
//   Day 4: Movie climax + real drama between friends.
//   Day 5: Post-movie, waiting for pickup, reflecting.
// Sub-plots: Jayden picked superhero movie vs Ava's indie preference,
//   Maddie's mom texts constantly, Tyler vs Old Man Gus comedy/silence war,
//   Benji keeps doing embarrassing things (too loud, asks dumb questions)

const DAY42_DATA = [
    // ========== DAY 1 (Feb 20) -- THE DROP-OFF ==========
    {
        id: '0bAQdesx', // dog and pony show
        speaker: "Jayden",
        meaning: "見世物・大げさなプレゼン",
        sentence: "OK so my mom made the whole drop-off into this huge dog and pony show -- she's givin' us the safety speech, checkin' our phones, the whole enchilada. I'm like Mom, we're TWELVE, not five.",
        sentence_ja: "うちの母さんが車から降ろすだけなのに大げさな見世物にしやがって -- 安全レクチャーして、スマホ確認して、もう全部やるの。お母さん、僕ら12歳だよ、5歳じゃないんだけど。",
        idiom: "the whole enchilada",
        idiom_meaning: "everything, the whole thing / 全部・丸ごと"
    },
    {
        id: '0bcKvTWO', // arm race
        speaker: "Tyler C.",
        meaning: "軍拡競争",
        sentence: "Dude there's like an arm race goin' on at the snack counter -- every kid's tryin' to get the biggest popcorn before the butter machine runs out. You get the picture? It's CHAOS.",
        sentence_ja: "おい、スナックカウンターで軍拡競争みたいなことになってる -- バターマシンがなくなる前にみんな一番デカいポップコーン取ろうとしてんの。わかる？カオスだよ。",
        idiom: "get the picture",
        idiom_meaning: "understand the situation / 状況がわかる"
    },
    {
        id: '0BGyLLsC', // cut across
        speaker: "Maddie",
        meaning: "横切る・渡る",
        sentence: "I don't wanna cut across the parking lot 'cause there's cars everywhere and my mom said if I get hit she's gonna -- oh wait she's textin' me again. I'm on the edge of my seat just GETTIN' here.",
        sentence_ja: "駐車場横切りたくない、車だらけだし、お母さんが轢かれたらって -- あ、またメール来た。ここに来るだけでハラハラしてるんだけど。",
        idiom: "on the edge of one's seat",
        idiom_meaning: "very anxious or excited / ハラハラする・興奮する"
    },
    {
        id: '0bHCGeYQ', // brass tacks
        speaker: "Jayden",
        meaning: "本題・核心",
        sentence: "Alright let's get down to brass tacks -- who's got money for tickets and who's broke? Don't make a big deal out of it, just be honest so I can figure this out.",
        sentence_ja: "よし本題に入ろう -- チケット代持ってるのは誰で、金ないの誰？大騒ぎしないで、正直に言ってくれたら計算するから。",
        idiom: "make a big deal",
        idiom_meaning: "overreact about something / 大騒ぎする・大げさにする"
    },
    {
        id: '0bhm77wL', // DD
        speaker: "Tyler C.",
        meaning: "DD（代行運転手 / 発達障害）",
        sentence: "My older brother says when you go out you need a DD -- a designated driver -- and I'm like bro, we're twelve, Mrs. Chen IS the DD. Stop givin' me a hard time about not knowin' that.",
        sentence_ja: "兄貴が出かける時はDD -- 代行運転手 -- が必要って言うんだけど、いや俺ら12歳だし、チェンさんのお母さんがDDだよ。知らなかったからってイジるなよ。",
        idiom: "give someone a hard time",
        idiom_meaning: "tease or criticize someone / イジる・からかう・責める"
    },
    {
        id: '0BIr_jns', // foolproof
        speaker: "Jayden",
        meaning: "確実な・失敗しようがない",
        sentence: "I got a foolproof plan for the seating -- me and Tyler on the end, girls in the middle, Benji... actually Benji shouldn't even be here. Just keep a low profile, dude, please.",
        sentence_ja: "座席の完璧な計画がある -- 俺とタイラーが端で、女子が真ん中、ベンジは...ていうかベンジはそもそも来るはずじゃなかったし。目立たないようにしてくれよ、頼むから。",
        idiom: "keep a low profile",
        idiom_meaning: "avoid attracting attention / 目立たないようにする"
    },
    {
        id: '0BKCqZJy', // veneer
        speaker: "Ava",
        meaning: "化粧板・表面的な見かけ・取り繕い",
        sentence: "This whole superhero franchise is just veneer, you guys. Pretty visuals, zero substance. There's an indie film playin' in theater four that would steal everyone's thunder but noooo, nobody listens to me.",
        sentence_ja: "このスーパーヒーローシリーズなんて表面だけだよ。映像は綺麗だけど中身ゼロ。シアター4でインディー映画やってて、そっちの方が全部持ってくのに、誰も私の話聞かないんだよね。",
        idiom: "steal someone's thunder",
        idiom_meaning: "take credit or attention from someone / お株を奪う・注目を奪う"
    },
    {
        id: '0bQj_dOA', // cyclopean
        speaker: "Benji",
        meaning: "キュクロプス的な・巨大な",
        sentence: "WHOA THAT POSTER IS LIKE CYCLOPEAN HUGE! The villain's got one eye and everything! IS HE GONNA BITE THE DUST IN THE MOVIE?! I BET HE DOES!",
        sentence_ja: "うわあのポスター超巨大！！悪役が目が一つだし！映画でやられるのかな？！絶対やられるよ！！",
        idiom: "bite the dust",
        idiom_meaning: "die or be defeated / やられる・倒れる"
    },
    {
        id: '0BUfgcLK', // shorting
        speaker: "Tyler C.",
        meaning: "空売り（株を借りて売ること）",
        sentence: "So my dad's always talkin' about shorting stocks and I still don't really get it, but I say we throw caution to the wind and just buy the large combo. Who cares if we're broke after?",
        sentence_ja: "うちの父さんいつも空売りがどうとか言ってるけど未だによくわかんない、でもとりあえず清水の舞台から飛び降りてLサイズコンボ買おうぜ。後で金なくなっても知らん。",
        idiom: "throw caution to the wind",
        idiom_meaning: "act recklessly, ignore risks / 思い切ってやる・リスクを無視する"
    },
    {
        id: '0Bz5vVbu', // aphids
        speaker: "Maddie",
        meaning: "アブラムシ",
        sentence: "Oh my GOD there's something on my popcorn -- Tyler is that a BUG? We literally just learned about aphids in science class and now I see bugs EVERYWHERE. I'm at my wit's end, I can't even eat this.",
        sentence_ja: "うそポップコーンに何か乗ってる -- タイラーこれ虫？？理科でアブラムシ習ったばっかりで今どこ見ても虫に見える。もう限界、これ食べられない。",
        idiom: "at one's wit's end",
        idiom_meaning: "extremely frustrated, out of ideas / 万策尽きた・もう限界"
    },

    // ========== DAY 2 (Feb 21) -- FINDING SEATS, MOVIE STARTS ==========
    {
        id: '0C5BvYjI', // exact revenge
        speaker: "Tyler C.",
        meaning: "復讐を果たす",
        sentence: "OK so the hero's definitely gonna exact revenge on the guy who destroyed his city, right? Like that's the WHOLE movie. Oh man, Jayden, you're a sight for sore eyes with that jumbo popcorn, gimme some.",
        sentence_ja: "ヒーローは絶対に街を壊したやつに復讐するよな？それが映画の全てだろ。あーージェイデン、そのジャンボポップコーン持ってるの最高だわ、ちょっとくれよ。",
        idiom: "a sight for sore eyes",
        idiom_meaning: "a welcome, pleasant sight / 嬉しい光景・待ち望んだもの"
    },
    {
        id: '0cAG1JgI', // signal lights
        speaker: "Benji",
        meaning: "ウインカー・信号灯",
        sentence: "HEY THE LITTLE SIGNAL LIGHTS ON THE FLOOR ARE SO COOL! They light up the stairs! GET A MOVE ON, JAYDEN, I WANNA SIT IN THE FRONT ROW!",
        sentence_ja: "ねえ床の小さいライトすごい！！階段が光ってる！急げよジェイデン、最前列に座りたい！！",
        idiom: "get a move on",
        idiom_meaning: "hurry up / 急げ・早くしろ"
    },
    {
        id: '0cFcVb42', // hash
        speaker: "Ava",
        meaning: "ごたまぜ・ハッシュ",
        sentence: "This sequel is gonna be a hash of like three different comic arcs thrown together. The original storyline was -- ugh, it's on the tip of my tongue -- the Sentinel arc! Way better than whatever this'll be.",
        sentence_ja: "この続編って3つの違うコミックのアークをごちゃ混ぜにしたやつだよ。元のストーリーラインは -- あー、喉まで出かかってる -- センチネル編！今回のよりずっと良かったのに。",
        idiom: "on the tip of one's tongue",
        idiom_meaning: "almost able to remember / 喉まで出かかってる"
    },
    {
        id: '0cFwkZI1', // buy out
        speaker: "Jayden",
        meaning: "買収する",
        sentence: "In the movie the bad corporation's gonna try to buy out the hero's company or somethin'. I read it online. Whatever, let's just lay low in the middle rows so nobody sees us actin' dumb.",
        sentence_ja: "映画の中で悪い会社がヒーローの会社を買収しようとするんだって。ネットで読んだ。まあいいや、真ん中の列で目立たないようにしよう、バカやってるの見られたくないし。",
        idiom: "lay low",
        idiom_meaning: "stay hidden, avoid attention / おとなしくする・身を潜める"
    },
    {
        id: '0Cjt_ihf', // could very well be
        speaker: "Old Man Gus",
        meaning: "十分にあり得る",
        sentence: "This could very well be the worst group of kids I've ever sat near. I quit sugar cold turkey last month and now I gotta listen to 'em crunchin' candy for two hours. Lord give me strength.",
        sentence_ja: "こいつらは今まで近くに座った中で最悪のガキどもかもしれん。先月砂糖をきっぱりやめたのに、2時間ガキどもの飴のバリバリ音を聞かなきゃならん。神よ力を。",
        idiom: "cold turkey",
        idiom_meaning: "abruptly, all at once (quit a habit) / きっぱりと（急にやめる）"
    },
    {
        id: '0CRm2lpz', // ovary
        speaker: "Maddie",
        meaning: "卵巣",
        sentence: "OK so in health class Mrs. Porter showed us a diagram of an ovary and Tyler made a joke and got sent to the principal and -- sorry I'm nervous, I talk a lot when I'm nervous. This movie's gonna blow me away though, right?",
        sentence_ja: "えっと保健の授業でポーター先生が卵巣の図見せた時タイラーがふざけて校長室送りになって -- ごめん緊張してて、緊張すると喋りすぎちゃうの。この映画すごいんだよね？",
        idiom: "blow someone away",
        idiom_meaning: "greatly impress / 圧倒する・感動させる"
    },
    {
        id: '0cV3HZuJ', // loud minority
        speaker: "Ava",
        meaning: "声の大きい少数派",
        sentence: "The people who think this franchise is 'cinema' are just a loud minority online. Real film critics gave it a 40%. But Jayden's all bark and no bite -- he said he'd watch my indie pick next time and I know he won't.",
        sentence_ja: "このシリーズを「映画芸術」って思ってるのはネットの声の大きい少数派だけ。本物の映画評論家は40点つけてる。でもジェイデンは口だけ -- 次は私のインディー映画見るって言ったけど絶対見ないし。",
        idiom: "all bark and no bite",
        idiom_meaning: "talks tough but doesn't follow through / 口だけ・吠えるだけ"
    },
    {
        id: '0cx0IolE', // sugar dispenser
        speaker: "Tyler C.",
        meaning: "砂糖入れ・シュガーディスペンサー",
        sentence: "Yo I found a sugar dispenser thing next to the coffee machine in the lobby. I put like ten packets in my Coke. Maddie said that's gross but honestly I've got my work cut out for me stayin' awake in a two-hour movie.",
        sentence_ja: "ロビーのコーヒーマシンの横に砂糖入れ見つけた。コーラに10袋入れた。マディにキモいって言われたけど正直2時間の映画で起きてるの大変なんだよ。",
        idiom: "have one's work cut out",
        idiom_meaning: "face a difficult task / 大変な仕事が待っている"
    },
    {
        id: '0D7mygZB', // derpy
        speaker: "Benji",
        meaning: "間抜けな・ドジな",
        sentence: "THE SIDEKICK IN THE TRAILER LOOKED SO DERPY! He just falls over for no reason! I wanna do that at school! DROP THE MIC AND FALL OVER!",
        sentence_ja: "予告のサイドキックめっちゃドジだったよね！理由もなく転ぶの！学校でもやりたい！マイク落として転ぶの！",
        idiom: "drop the mic",
        idiom_meaning: "make a dramatic final statement / 決め台詞を言い放つ・完璧に締める"
    },
    {
        id: '0DCGNPX8', // banner
        speaker: "Marcus",
        meaning: "横断幕・バナー",
        sentence: "Hey, kids. The banner says no phones during the movie. That's a stone-cold fact, not a suggestion. I don't make the rules. ...OK I don't actually enforce 'em either but, you know, just... keep it down.",
        sentence_ja: "おい、キッズ。横断幕に映画中スマホ禁止って書いてある。これ事実であって提案じゃないから。俺がルール作ったんじゃない。...まあ正直取り締まりもしないけど、とにかく静かにしてくれ。",
        idiom: "a stone-cold fact",
        idiom_meaning: "an undeniable truth / 紛れもない事実"
    },

    // ========== DAY 3 (Feb 22) -- MID-MOVIE CHAOS ==========
    {
        id: '0DLhupkS', // God speed
        speaker: "Tyler C.",
        meaning: "幸運を祈る・ご武運を",
        sentence: "Maddie's goin' to the bathroom and she's scared of the dark hallway. Godspeed, Maddie. Your anxiety is goin' through the roof and honestly it's kinda entertainin' to watch.",
        sentence_ja: "マディがトイレ行くんだけど暗い廊下が怖いんだって。ご武運を、マディ。お前の不安が天井突き抜けてるの、正直見てて面白い。",
        idiom: "go through the roof",
        idiom_meaning: "increase dramatically / 天井を突き抜ける・急上昇する"
    },
    {
        id: '0dXkIwAX', // back breaker
        speaker: "Old Man Gus",
        meaning: "つらい仕事・致命的な打撃",
        sentence: "Sittin' through this noise is a real back breaker for a man my age. In MY day, kids at the movies knew how to behave. Well, live and learn -- I shoulda picked the morning screening.",
        sentence_ja: "この騒音の中で座ってるのはワシの年にはこたえる。ワシらの時代は映画館のガキは行儀良くしたもんだ。まあ身をもって学んだわ -- 朝の回にすべきだった。",
        idiom: "live and learn",
        idiom_meaning: "learn from experience / 経験から学ぶ・身をもって学ぶ"
    },
    {
        id: '0DYIV0hl', // classist
        speaker: "Ava",
        meaning: "階級差別的な",
        sentence: "You know what's kinda classist? The VIP seats are twenty bucks more and they're basically the same chair with a cup holder. We're totally out of the loop on how theaters rip people off.",
        sentence_ja: "ちょっと階級差別的じゃない？VIP席が20ドル高いのにカップホルダーがついた同じ椅子なだけ。映画館がどうやってボッてるか私たち全然知らないよね。",
        idiom: "out of the loop",
        idiom_meaning: "unaware of what's happening / 情報から取り残されてる・知らない"
    },
    {
        id: '0E0iKKzJ', // putrid
        speaker: "Tyler C.",
        meaning: "腐った・悪臭を放つ",
        sentence: "OH MY GOD somethin' smells putrid in here. Benji, was that you?! Don't even deny it. Mind your own business? Bro, EVERYONE can smell it, it IS everyone's business!",
        sentence_ja: "うわ何かめっちゃ臭い。ベンジ、お前か？！否定すんなよ。関係ないだろって？いやみんな臭ってるから、みんなの問題だろ！",
        idiom: "mind one's own business",
        idiom_meaning: "don't interfere with others' affairs / 自分のことだけ気にしろ・余計なお世話"
    },
    {
        id: '0E1a4lXP', // trepanning
        speaker: "Ava",
        meaning: "穿頭術（頭蓋骨に穴を開ける古代の手術）",
        sentence: "We learned about trepanning in history -- they drilled holes in people's heads in ancient times. This scene right now is so bad it feels like somebody's trepanning my brain. This sequel is make or break for the franchise.",
        sentence_ja: "歴史で穿頭術習ったよ -- 古代に人の頭に穴開けたの。今のシーン酷すぎて脳に穴開けられてる気分。この続編がシリーズの命運を分けるよね。",
        idiom: "make or break",
        idiom_meaning: "determine success or failure / 成功か失敗かを決める・命運を分ける"
    },
    {
        id: '0e5w2dJ9', // rooster
        speaker: "Old Man Gus",
        meaning: "雄鶏・生意気な男",
        sentence: "That loud kid's struttin' around like a little rooster. Hey! You in the red shirt! Get off my back and sit DOWN. I paid good money for this ticket.",
        sentence_ja: "あの騒がしいガキが小さい雄鶏みたいに歩き回っとる。おい！赤いシャツのお前！うるさいんだよ、座れ。ワシはこのチケットに金払ったんだ。",
        idiom: "get off one's back",
        idiom_meaning: "stop bothering someone / うるさく言うな・放っておけ"
    },
    {
        id: '0earQGp8', // deify
        speaker: "Ava",
        meaning: "神格化する",
        sentence: "Everybody wants to deify this director just 'cause the first movie made a billion dollars. Meanwhile the dude who made the indie film has ants in his pants waitin' for ONE review. It's so unfair.",
        sentence_ja: "みんなこの監督を神格化したがるけど、最初の映画が10億ドル稼いだってだけじゃん。一方インディー映画の監督はたった一つのレビューをソワソワ待ってる。不公平すぎ。",
        idiom: "have ants in one's pants",
        idiom_meaning: "be restless or fidgety / そわそわしてる・落ち着かない"
    },
    {
        id: '0Ef_e7G9', // CST
        speaker: "Maddie",
        meaning: "頭蓋仙骨療法（Craniosacral Therapy）",
        sentence: "My mom does this thing called CST -- craniosacral therapy? She says it helps with stress. I saw an ad for it in the lobby and I'm like, that's the whole kit and caboodle of stuff my mom's into.",
        sentence_ja: "うちのお母さんCSTってのやってる -- 頭蓋仙骨療法？ストレスにいいんだって。ロビーで広告見て、お母さんがハマってるもの全部揃ってるって感じだった。",
        idiom: "the whole kit and caboodle",
        idiom_meaning: "everything, the entire collection / 一切合切・全部"
    },
    {
        id: '0EjuTJqh', // debt market
        speaker: "Tyler C.",
        meaning: "債券市場",
        sentence: "My dad said somethin' about the debt market on the phone this morning and I told Jayden I know about finance now. The popcorn line's takin' forever though. I'll learn about stocks when I'm like thirty.",
        sentence_ja: "父さんが今朝電話で債券市場がどうとか言ってて、ジェイデンに俺もう金融わかるって言った。でもポップコーンの列長すぎ。株の勉強は30歳くらいでいいわ。",
        idiom: "take forever",
        idiom_meaning: "take an extremely long time / めちゃくちゃ時間がかかる"
    },
    {
        id: '0ELMV_HA', // forge
        speaker: "Jayden",
        meaning: "偽造する / 苦労して前進する",
        sentence: "We just gotta forge ahead and ignore the old dude who keeps shushing us. Keepin' this group quiet for two hours is a tall order but I'm the one who planned this so I gotta deal with it.",
        sentence_ja: "あのシーシー言ってくるおじいさん無視して前に進むしかない。このグループを2時間静かにさせるのは無理難題だけど、計画したの俺だから何とかするしかない。",
        idiom: "a tall order",
        idiom_meaning: "a very difficult task / 無理難題・大変な注文"
    },

    // ========== DAY 4 (Feb 23) -- MOVIE CLIMAX + REAL DRAMA ==========
    {
        id: '0et6_33t', // pin money
        speaker: "Mrs. Chen",
        meaning: "へそくり・小遣い",
        sentence: "Jayden sweetie I'm texting because I gave Benji some pin money for snacks and he's not answering. Did his phone die? I'm about to hit rock bottom with worry over here. Text me back IMMEDIATELY.",
        sentence_ja: "ジェイデンちゃん、ベンジにスナック用のお小遣い渡したのに返事がないの。携帯切れた？心配で気が狂いそう。すぐ返信して。",
        idiom: "hit rock bottom",
        idiom_meaning: "reach the lowest point / 最悪の状態になる・どん底に達する"
    },
    {
        id: '0eyQ2n4Y', // blockhead
        speaker: "Jayden",
        meaning: "ばか・間抜け",
        sentence: "Benji you blockhead, Mom's been texting you for thirty minutes! Get a load of this -- sixteen missed texts, three missed calls. She's gonna come INSIDE the theater. You realize that, right?",
        sentence_ja: "ベンジこのバカ、お母さんが30分もメールしてんだぞ！これ見ろよ -- 未読16件、不在着信3件。シアターの中に来ちゃうぞ。わかってんのか？",
        idiom: "get a load of",
        idiom_meaning: "look at, pay attention to / これ見ろよ・注目しろ"
    },
    {
        id: '0f6Hnv0c', // hang in there !
        speaker: "Maddie",
        meaning: "頑張れ・粘れ",
        sentence: "Jayden, hang in there! I know your mom's freaking out but we've only got like forty minutes left. I just -- I'm tryin' not to be all thumbs with my phone 'cause my hands are shakin'.",
        sentence_ja: "ジェイデン、頑張れ！お母さんがパニックなの分かるけどあと40分くらいだから。私 -- 手が震えてスマホうまく触れないの。",
        idiom: "be all thumbs",
        idiom_meaning: "be clumsy with hands / 不器用・手が思うように動かない"
    },
    {
        id: '0FaGstIM', // makeunder
        speaker: "Ava",
        meaning: "控えめなメイク（メイクオーバーの逆）",
        sentence: "The hero's suit got a total makeunder in this scene -- less flashy, more battle-worn. It's actually the best design choice they've made. Everyone's walkin' on eggshells around me 'cause I keep criticizin' the movie, but that was genuinely good.",
        sentence_ja: "このシーンでヒーローのスーツが地味になった -- 派手さ減って戦い感増した。実はシリーズ最高のデザイン判断。みんな私の映画批評にビクビクしてるけど、あれはマジで良かった。",
        idiom: "walk on eggshells",
        idiom_meaning: "be very careful not to offend / 腫れ物に触るように・ビクビクする"
    },
    {
        id: '0fl2k3B1', // take a swing at
        speaker: "Tyler C.",
        meaning: "殴りかかる・挑戦する",
        sentence: "The villain just took a swing at the hero's kid in the movie and oh man, this is WORTH MY WHILE! I've been waitin' the whole time for a real fight scene!",
        sentence_ja: "悪役が映画の中でヒーローの子供に殴りかかった、うおお見る価値あった！ずっと本物のアクションシーン待ってたんだよ！",
        idiom: "worth one's while",
        idiom_meaning: "worth the time and effort / 時間をかける価値がある"
    },
    {
        id: '0fPwFDn_', // stale
        speaker: "Old Man Gus",
        meaning: "新鮮でない・よどんだ",
        sentence: "The air in this theater is gettin' stale with all you kids breathin' and talkin'. I'm about to lose my cool. In MY day we watched movies in SILENCE.",
        sentence_ja: "ガキどもが息して喋るから空気がよどんできた。そろそろ堪忍袋の緒が切れるぞ。ワシらの時代は映画は「静かに」観たもんだ。",
        idiom: "lose one's cool",
        idiom_meaning: "lose one's temper / キレる・冷静さを失う"
    },
    {
        id: '0fQzh3Rb', // camel toe
        speaker: "Tyler C.",
        meaning: "衣服の股間部分の食い込み",
        sentence: "Dude, in gym class last week some eighth grader pointed out a camel toe situation and the whole gym went silent. I'm not even gonna say who. That kid was makin' money hand over fist sellin' the story to everyone at lunch.",
        sentence_ja: "先週の体育で8年生がキャメルトーのこと指摘して体育館がシーンとなった。誰かは言わないけど。そいつ昼休みにその話をみんなに売りさばいてボロ儲けしてた。",
        idiom: "hand over fist",
        idiom_meaning: "rapidly, in large amounts (earning money) / どんどん・ボロ儲けで"
    },
    {
        id: '0FU5HeWV', // spasmodic
        speaker: "Maddie",
        meaning: "痙攣的な・断続的な",
        sentence: "My phone keeps makin' these spasmodic buzzing sounds 'cause Mom won't stop texting. I'm tryin' not to fly off the handle but she's sent TWENTY-THREE messages in the last hour.",
        sentence_ja: "お母さんがメールやめないから携帯がガタガタ断続的に震えてる。キレないようにしてるけど、この1時間で23通も送ってきたの。",
        idiom: "fly off the handle",
        idiom_meaning: "lose one's temper suddenly / 突然キレる・逆上する"
    },
    {
        id: '0fUS0Gik', // tattletale
        speaker: "Benji",
        meaning: "告げ口する人・チクり魔",
        sentence: "JAYDEN SAID I'M A TATTLETALE BUT I DIDN'T TELL MOM ANYTHING! She just KNOWS stuff! I'm tryin' to play it cool but NOBODY believes me!",
        sentence_ja: "ジェイデンがチクり魔って言ったけど僕お母さんに何も言ってないよ！！お母さんは勝手に知るんだよ！クール装ってるのに誰も信じてくれない！",
        idiom: "play it cool",
        idiom_meaning: "act calm and relaxed / 冷静を装う・クールにふるまう"
    },
    {
        id: '0fV4d11T', // whimsical
        speaker: "Ava",
        meaning: "気まぐれな・風変わりな",
        sentence: "OK the dream sequence was actually kinda whimsical and sweet. I'm... surprised. Keep it together, Ava, you're supposed to hate this movie. I can't be cryin' at a superhero film.",
        sentence_ja: "OK、ドリームシーケンスは実は風変わりで素敵だった。...意外。しっかりしろアヴァ、この映画嫌いなはずでしょ。スーパーヒーロー映画で泣くわけにいかない。",
        idiom: "keep it together",
        idiom_meaning: "maintain composure, don't break down / しっかりする・崩れないようにする"
    },

    // ========== DAY 5 (Feb 24) -- POST-MOVIE, PICKUP, REFLECTING ==========
    {
        id: '0g2J_lnh', // broom
        speaker: "Marcus",
        meaning: "ほうき",
        sentence: "Alright the movie's over, I gotta sweep with this broom before the next showing. Y'all left popcorn EVERYWHERE. But hey, I'll have the last laugh -- I get paid overtime for cleanin' up after you animals.",
        sentence_ja: "はい映画終わり、次の回の前にほうきで掃除しなきゃ。お前らポップコーンそこら中に散らかしやがって。まあ最後に笑うのは俺だけどね -- お前ら動物の後片付けで残業代もらえるから。",
        idiom: "the last laugh",
        idiom_meaning: "ultimate success after setbacks / 最後に笑う者が勝つ"
    },
    {
        id: '0GGyIhz6', // morsel
        speaker: "Tyler C.",
        meaning: "少量・一口分",
        sentence: "I don't got a single morsel of food left -- I ate Maddie's gummies, half of Jayden's popcorn, and Ava's pretzel. They kept it under wraps but I could smell snacks from three seats away, so.",
        sentence_ja: "食べ物一口分も残ってない -- マディのグミとジェイデンのポップコーン半分とアヴァのプレッツェル食った。隠してたけど3席先からスナックの匂いしたから、まあ。",
        idiom: "under wraps",
        idiom_meaning: "kept secret / 秘密にしている・隠している"
    },
    {
        id: '0GzvWPTp', // recluse
        speaker: "Old Man Gus",
        meaning: "隠遁者・世捨て人",
        sentence: "I've been thinkin' about becomin' a recluse after today. Just me, my house, and NO children within a hundred yards. Shoulda struck while the iron was hot and left during the previews.",
        sentence_ja: "今日の後、世捨て人になろうかと思ってる。ワシと家だけ、100ヤード以内にガキなし。予告編の時にさっさと出ればよかった。",
        idiom: "strike while the iron is hot",
        idiom_meaning: "act at the right moment / 鉄は熱いうちに打て・チャンスを逃すな"
    },
    {
        id: '0H-FV6vZ', // hitch
        speaker: "Jayden",
        meaning: "障害・引っかかり / ヒッチハイク",
        sentence: "There was definitely a hitch or two -- Benji bein' loud, Gus yellin' at us -- but we actually pulled it off. The movie was a far cry from what Ava wanted, but come on, it was fun.",
        sentence_ja: "確かにトラブルはあった -- ベンジがうるさかったり、ガスに怒鳴られたり -- でも実際やり遂げたよ。映画はアヴァが見たかったのとは程遠かったけど、楽しかったじゃん。",
        idiom: "a far cry from",
        idiom_meaning: "very different from / かけ離れている・程遠い"
    },
    {
        id: '0HfHo1MX', // set up
        speaker: "Benji",
        meaning: "はめる・罠にかける",
        sentence: "JAYDEN TOTALLY SET ME UP! He told Mom I was the one bein' loud but TYLER was louder! I COULDN'T EVEN GET A WORD IN EDGEWISE the whole time!",
        sentence_ja: "ジェイデン完全にハメたじゃん！僕がうるさかったってお母さんに言ったけどタイラーの方がうるさかったし！！ずっと口を挟む暇もなかったのに！",
        idiom: "get a word in edgewise",
        idiom_meaning: "manage to say something when others are talking / 口を挟む"
    },
    {
        id: '0hRLSol6', // a land of milk and honey
        speaker: "Tyler C.",
        meaning: "理想郷・約束の地",
        sentence: "That movie theater lobby with the free refill station is a land of milk and honey, dude. Unlimited Sprite? I'm gonna turn some heads next time -- I'm bringin' a GALLON jug.",
        sentence_ja: "あの映画館のロビーのおかわり自由ステーション、あそこは約束の地だよ。スプライト無制限？次は注目されるぞ -- ガロンジャグ持ってく。",
        idiom: "turn heads",
        idiom_meaning: "attract attention / 注目を集める・振り向かせる"
    },
    {
        id: '0huwTK-h', // detail(s) of
        speaker: "Mrs. Chen",
        meaning: "護衛チーム・警備班",
        sentence: "I'm not sayin' I need a whole security detail or anything, but next time you kids go to the movies, I'm sittin' in the parking lot. Jayden, did you think you could pull a fast one on me by not replying?",
        sentence_ja: "警備チームが必要とまでは言わないけど、次に映画行く時は駐車場で待ってるからね。ジェイデン、返信しなかったら騙せると思った？",
        idiom: "pull a fast one",
        idiom_meaning: "trick or deceive someone / 一杯食わせる・騙す"
    },
    {
        id: '0HxJ3piL', // Reform Party USA
        speaker: "Ava",
        meaning: "アメリカ改革党",
        sentence: "So random but we're learning about the Reform Party USA in social studies and how third parties never win. Kinda like how I never win the movie vote. But in the heat of the moment, I actually enjoyed the dumb superhero thing. Don't tell Jayden.",
        sentence_ja: "全然関係ないけど社会科でアメリカ改革党と第三政党は勝てないって習ってて。映画の投票で私が勝てないのと一緒。でもその場の勢いで、バカなスーパーヒーロー映画楽しんじゃった。ジェイデンには言わないで。",
        idiom: "in the heat of the moment",
        idiom_meaning: "while caught up in the excitement / その場の勢いで・興奮のあまり"
    },
    {
        id: '0hXjaobg', // bulk up
        speaker: "Jayden",
        meaning: "体を大きくする・増量する",
        sentence: "The hero in the movie was so jacked. I told Tyler I'm gonna bulk up this summer but he laughed so hard he choked on his soda. I'd think twice before laughin' at me though -- I'm dead serious.",
        sentence_ja: "映画のヒーローめっちゃムキムキだった。タイラーに今年の夏バルクアップするって言ったらソーダ吹いて笑ってた。でも俺のこと笑う前によく考えた方がいいぞ -- マジで言ってるから。",
        idiom: "think twice",
        idiom_meaning: "reconsider carefully / よく考える・二度考える"
    },
    {
        id: '0hYLvCf9', // Si vis pacem, para bellum
        speaker: "Maddie",
        meaning: "平和を望むなら戦いに備えよ（ラテン語）",
        sentence: "My mom always says this Latin thing, si vis pacem, para bellum -- if you want peace, prepare for war. She meant it about packing hand sanitizer and tissues. But you know what? Today was off the charts fun. I survived.",
        sentence_ja: "お母さんがいつもラテン語で言うの、si vis pacem, para bellum -- 平和を望むなら戦いに備えよって。手指消毒とティッシュを持ってけって意味だったけど。でもね？今日は最高に楽しかった。生き延びた。",
        idiom: "off the charts",
        idiom_meaning: "extremely high, beyond measurement / 計測不能・桁外れ"
    },
];

async function seedDay42() {
    console.log('Seeding Day 042 -- First Movie Without Parents (words 500-549)...');
    let success = 0;
    let failed = 0;
    let meaningFixed = 0;

    for (const item of DAY42_DATA) {
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

seedDay42();
