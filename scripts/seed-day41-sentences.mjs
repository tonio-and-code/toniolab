// Seed Day 041 (words 450-499) -- Feb 15-19
// Day 041: Mariners Trade Talk -- Baseball podcast (30s, 2 male hosts)
// ALL sentences are SPOKEN DIALOGUE -- actual things people say out loud
// g-dropping, grammar breaking, fillers, real spoken English
// Characters: Marcus(34M, host, Cardinals fan, loud hot takes),
//   Kai(32M, guest, Mariners superfan since 2001, analytical but emotional)
// Story: 5-episode podcast arc. Day 1: trade breakdown + tangent into random topics.
//   Day 2: prospect evaluation + stories about weird coaches. Day 3: roster fit +
//   childhood baseball memories. Day 4: rival analysis + life tangents.
//   Day 5: predictions + emotional wrap-up.

const DAY41_DATA = [
    // ========== DAY 1 (Feb 15) -- THE TRADE + TANGENTS ==========
    {
        id: 'u3Zncvd_', // beret
        speaker: "Marcus",
        meaning: "ベレー帽",
        sentence: "Alright we're LIVE, and before we get into the Donovan stuff -- Kai, why are you wearin' a beret? You look like you're tryin' to reinvent yourself and it's not exactly comin' up roses, buddy.",
        sentence_ja: "はい始まりました！ドノバンの話に入る前に -- カイ、なんでベレー帽被ってんの？自分改革しようとしてるけど全然うまくいってないぞ。",
        idiom: "coming up roses",
        idiom_meaning: "turning out well / うまくいく・順調にいく"
    },
    {
        id: 'Ev-gfoow', // season's greetings
        speaker: "Kai",
        meaning: "季節の挨拶（年末年始の祝辞）",
        sentence: "Bro it's February, nobody's sendin' season's greetings anymore, and yet my grandma STILL sends me Christmas cards. She's stuck in her ways, man. Anyway yeah -- let's talk this trade.",
        sentence_ja: "いや2月だよ、もう誰も季節の挨拶なんか送ってないのに、うちのばあちゃんまだクリスマスカード送ってくるんだよ。頑固なんだよね。まあいいや -- トレードの話しよう。",
        idiom: "stuck in one's ways",
        idiom_meaning: "unwilling to change habits / 頑固で変わらない"
    },
    {
        id: 'xuHYThNE', // hector
        speaker: "Marcus",
        meaning: "威圧する・いじめる",
        sentence: "So the Cards front office basically tried to hector the Mariners into givin' up Montesdeoca, and Dipoto didn't budge. Gotta hand it to the guy -- he stood his ground.",
        sentence_ja: "カーズのフロントオフィス、マリナーズにモンテスデオカを出させようと威圧しようとしたけど、ディポトは動かなかった。認めるよ -- 彼は一歩も引かなかった。",
        idiom: "didn't budge",
        idiom_meaning: "refused to move or change position / 微動だにしない・譲らない"
    },
    {
        id: 's67Cuat0', // copper shark
        speaker: "Kai",
        meaning: "ドウシザメ（サメの一種）",
        sentence: "Dude, Chaim Bloom is like a copper shark -- just circlin' and circlin' until you let your guard down, and then BAM, he takes a huge bite outta your farm system. That's literally what happened.",
        sentence_ja: "チェイム・ブルームってドウシザメみたいだよな -- ひたすらグルグル回って油断したところでバーン、ファームシステムからガッツリ噛みつく。マジでそうなった。",
        idiom: "let your guard down",
        idiom_meaning: "stop being cautious / 油断する・警戒を緩める"
    },
    {
        id: 'v2R5MVH2', // land mine
        speaker: "Marcus",
        meaning: "地雷",
        sentence: "Every question about Williamson's value is a total land mine. You bring it up in a Mariners fan group and people lose their minds. I learned that one the hard way.",
        sentence_ja: "ウィリアムソンの価値に関する質問はどれも完全に地雷。マリナーズのファングループで話題にしたらみんなブチ切れる。身をもって学んだわ。",
        idiom: "the hard way",
        idiom_meaning: "through painful experience / 痛い目にあって・身をもって"
    },
    {
        id: 'lT_jWPTC', // stocks
        speaker: "Kai",
        meaning: "株・株式 / さらし台（歴史的刑具）",
        sentence: "My Mariners stocks are THROUGH THE ROOF right now. I'm talkin' emotionally, not financially -- although honestly if they had real stocks I'd go whole hog and invest my entire savings.",
        sentence_ja: "俺のマリナーズ株は今天井知らずだよ。感情的にね、金銭的じゃなくて -- まあ正直本当の株があったら全力投球で貯金全部突っ込むけど。",
        idiom: "go whole hog",
        idiom_meaning: "do something completely, without restraint / 徹底的にやる・全力でいく"
    },
    {
        id: 'T8GvdCvo', // trinity
        speaker: "Marcus",
        meaning: "三位一体・三つ組",
        sentence: "The holy trinity of that Mariners rotation is gonna be Gilbert, Donovan, and Castillo. If all three are healthy? That's a recipe for disaster... for the rest of the AL West.",
        sentence_ja: "マリナーズのローテーションの三位一体はギルバート、ドノバン、カスティーヨだ。3人とも健康なら？AL西地区の他チームにとっては最悪のレシピだよ。",
        idiom: "a recipe for disaster",
        idiom_meaning: "a combination likely to cause problems / 最悪の結果を招く組み合わせ"
    },
    {
        id: '5JSf98TN', // lampshade
        speaker: "Kai",
        meaning: "ランプシェード・電気スタンドの笠",
        sentence: "OK random tangent but my cat knocked over my lampshade during the trade announcement and I didn't even notice for like three hours 'cause I was glued to my phone. My wife thought I'd lost the plot.",
        sentence_ja: "関係ない話だけど、トレード発表中に猫がランプシェード倒して3時間気づかなかった。ずっと携帯に釘付けで。妻にはおかしくなったと思われた。",
        idiom: "lost the plot",
        idiom_meaning: "gone crazy, lost focus / おかしくなる・正気を失う"
    },
    {
        id: 'CyR6uDv9', // headlong
        speaker: "Marcus",
        meaning: "真っ逆さまに・向こう見ずに・猪突猛進で",
        sentence: "Dipoto dove headlong into this trade without testin' the waters on cheaper options first, and honestly? I think it paid off in spades. Sometimes you just gotta commit.",
        sentence_ja: "ディポトは安い選択肢を試さずにこのトレードに猪突猛進したけど、正直？大当たりだったと思う。時には突き進むしかないんだよ。",
        idiom: "paid off in spades",
        idiom_meaning: "succeeded greatly, yielded big returns / 大成功する・大きく報われる"
    },
    {
        id: 'XE9qbwj3', // out of the frying pan into the fire
        speaker: "Kai",
        meaning: "一難去ってまた一難",
        sentence: "The thing is, we finally got outta that twenty-year playoff drought, and now it's like out of the frying pan into the fire 'cause we gotta actually WIN in October. The pressure's on a whole 'nother level now.",
        sentence_ja: "問題は、やっと20年のプレーオフ干ばつから脱出したと思ったら一難去ってまた一難で、10月に実際に勝たなきゃいけない。プレッシャーが全然違うレベルになった。",
        idiom: "on a whole 'nother level",
        idiom_meaning: "far beyond normal / 全く別次元の・桁違いの"
    },

    // ========== DAY 2 (Feb 16) -- PROSPECTS + WEIRD COACHES ==========
    {
        id: 'jVZTC7Bv', // fumigate
        speaker: "Marcus",
        meaning: "燻蒸消毒する・ガスで消毒する",
        sentence: "Kai, remember that minor league stadium in Fresno that was so gross they had to fumigate the visitor's clubhouse? Players were droppin' like flies from the smell.",
        sentence_ja: "カイ、フレズノのマイナーリーグの球場覚えてる？汚すぎてビジターのクラブハウスを燻蒸消毒しなきゃいけなかったやつ。選手たちが臭いでバタバタ倒れてた。",
        idiom: "dropping like flies",
        idiom_meaning: "collapsing or failing rapidly / バタバタ倒れる"
    },
    {
        id: 'caRVpFL4', // unassuming
        speaker: "Kai",
        meaning: "控えめな・謙虚な・気取らない",
        sentence: "Seinche is such an unassuming kid. You'd never guess he throws ninety-seven just lookin' at him. He flies under the radar, which honestly might be his biggest strength right now.",
        sentence_ja: "セインチェって本当に控えめな子だよね。見た目じゃ97マイル投げるなんて絶対わからない。目立たないのが正直今一番の強みかも。",
        idiom: "flies under the radar",
        idiom_meaning: "goes unnoticed / 目立たない・注目を避ける"
    },
    {
        id: 'nG3T-RSZ', // speak out of school
        speaker: "Marcus",
        meaning: "口を滑らす・秘密を漏らす",
        sentence: "I don't wanna speak out of school here, but a guy I know in the Cards org told me they were THIS close to demandin' Arroyo. Like, dead serious. Take that with a grain of salt though.",
        sentence_ja: "口を滑らすつもりはないけど、カーズの組織にいる知り合いがアロヨを要求する寸前だったって言ってた。マジで。まあ話半分に聞いてくれ。",
        idiom: "take that with a grain of salt",
        idiom_meaning: "don't believe it completely / 話半分に聞く"
    },
    {
        id: 'PCt1AmYO', // aphasia
        speaker: "Kai",
        meaning: "失語症（言語障害）",
        sentence: "When I saw the return package I swear I had like temporary aphasia -- couldn't form words for a solid minute. My buddy's like 'Dude, say somethin'' and I'm just starin' at my screen, totally at a loss for words.",
        sentence_ja: "返りのパッケージ見た時マジで一時的な失語症みたいになった -- 1分間まるまる言葉出なかった。友達が「何か言えよ」って言うんだけど画面凝視して完全に言葉を失った。",
        idiom: "at a loss for words",
        idiom_meaning: "unable to think of what to say / 言葉を失う"
    },
    {
        id: 'SqtF4Ium', // naked attraction
        speaker: "Marcus",
        meaning: "全裸アトラクション（英国のTV番組）/ 裸の魅力",
        sentence: "So my wife's watchin' that show Naked Attraction and I walk in right as she's changin' the channel. She's like 'It's not what it looks like!' I'm like babe, don't jump to conclusions, I didn't even say anythin'.",
        sentence_ja: "嫁がネイキッド・アトラクションってあの番組見てて、ちょうどチャンネル変えてる時に俺が入った。「見た通りじゃないから！」って。早合点するなよ、俺何も言ってないし。",
        idiom: "jump to conclusions",
        idiom_meaning: "make a hasty judgment without all the facts / 早合点する・決めつける"
    },
    {
        id: 'kZFdsUDC', // single celled organism
        speaker: "Kai",
        meaning: "単細胞生物",
        sentence: "Some of these Twitter trolls have the critical thinkin' skills of a single celled organism. I saw one dude say we should've traded Gilbert instead. Like, are you out of your mind?",
        sentence_ja: "Twitterの荒らしの一部は単細胞生物レベルの思考力しかない。ギルバートを代わりにトレードすべきだったとか言ってるやつ見た。正気か？",
        idiom: "out of your mind",
        idiom_meaning: "crazy, insane / 正気じゃない・頭おかしい"
    },
    {
        id: 'WAHRG_U5', // wasp
        speaker: "Marcus",
        meaning: "スズメバチ",
        sentence: "I got stung by a wasp at Spring Training last year and my arm swelled up like a balloon. The trainer's like 'Walk it off' and I'm thinkin', dude, I'm a PODCASTER, not a player. I don't walk things off.",
        sentence_ja: "去年スプリングトレーニングでスズメバチに刺されて腕が風船みたいに腫れた。トレーナーが「歩いて治せ」って言うから、俺はポッドキャスターだぞ、選手じゃねえよって思った。歩いて治さねえよ。",
        idiom: "walk it off",
        idiom_meaning: "deal with pain by continuing activity / 歩いて治す・気合で乗り越える"
    },
    {
        id: 'fOJ32VNx', // shack up
        speaker: "Kai",
        meaning: "同棲する・（異性と）一緒に住む",
        sentence: "Fun fact: my college roommate shacked up with a girl who turned out to be the daughter of a Mariners scout. It's a small world, right? She's the one who got me into advanced stats. Changed the whole game for me.",
        sentence_ja: "豆知識：大学のルームメイトがマリナーズのスカウトの娘と同棲し始めたんだよ。世界は狭いよね？彼女のおかげでアドバンスト・スタッツにハマった。俺の野球の見方を完全に変えた。",
        idiom: "it's a small world",
        idiom_meaning: "surprising coincidence of meeting someone / 世界は狭い"
    },
    {
        id: 'CkfwGhM4', // cleat
        speaker: "Marcus",
        meaning: "スパイク・クリート（スポーツ用靴底の突起）",
        sentence: "My weirdest minor league memory is a coach who used to hang a cleat from the dugout ceiling for good luck. Like a rabbit's foot but way grosser. It was beat up beyond belief.",
        sentence_ja: "マイナーリーグの一番変な思い出は、ダッグアウトの天井にスパイクをぶら下げてたコーチ。うさぎの足みたいなお守りだけどもっとキモい。信じられないくらいボロボロだった。",
        idiom: "beyond belief",
        idiom_meaning: "too extreme to be believed / 信じられないほど"
    },
    {
        id: 'l9wDGigm', // dysfunctional
        speaker: "Kai",
        meaning: "機能不全の・うまくいかない",
        sentence: "The mid-2010s Mariners front office was completely dysfunctional. Everybody and their mother knew somethin' was wrong, but nobody wanted to stir the pot. Classic organizational failure.",
        sentence_ja: "2010年代半ばのマリナーズのフロントオフィスは完全に機能不全だった。何かがおかしいって誰でもわかってたのに、誰も問題を蒸し返したくなかった。典型的な組織の失敗。",
        idiom: "stir the pot",
        idiom_meaning: "deliberately cause trouble or controversy / わざと問題を起こす・蒸し返す"
    },

    // ========== DAY 3 (Feb 17) -- ROSTER FIT + CHILDHOOD MEMORIES ==========
    {
        id: 'HlpKYp64', // jock
        speaker: "Marcus",
        meaning: "スポーツマン・体育会系の人",
        sentence: "I was NOT a jock growin' up. I was the nerdy kid who memorized every Cardinals stat since 1980 and couldn't throw a ball to save my life. But that ship has sailed -- now I just talk about it for a livin'.",
        sentence_ja: "俺は育ちは体育会系じゃなかった。1980年からのカーディナルズの全スタッツ暗記してるオタクで、ボールはまともに投げられなかった。でもその船はもう出港した -- 今は喋って飯食ってるだけ。",
        idiom: "that ship has sailed",
        idiom_meaning: "too late, the opportunity has passed / もう手遅れ・その機会は過ぎた"
    },
    {
        id: '0zYWPbH8', // walkie talkie
        speaker: "Kai",
        meaning: "トランシーバー・無線機",
        sentence: "When I was a kid my dad bought us walkie talkies so we could communicate from different rooms while watchin' the Mariners. Like one of us in the kitchen, one in the bedroom. He took it dead seriously.",
        sentence_ja: "子供の頃、父がトランシーバー買ってきて、マリナーズ見ながら別の部屋から連絡取り合ってた。片方がキッチン、片方がベッドルーム。父はマジで真剣だった。",
        idiom: "dead seriously",
        idiom_meaning: "completely serious, no joking / 超真剣に・ガチで"
    },
    {
        id: '9XZTjrtZ', // glut
        speaker: "Marcus",
        meaning: "供給過剰・過剰",
        sentence: "There's such a glut of outfielders on the market right now. Every team's got like five guys who can play center. It's a buyer's market if you're in the market for a bat, no two ways about it.",
        sentence_ja: "今市場に外野手が供給過剰すぎる。どのチームもセンター守れる選手5人くらいいる。バットが欲しいなら完全に買い手市場、間違いない。",
        idiom: "no two ways about it",
        idiom_meaning: "absolutely certain, no doubt / 間違いない・異論の余地なし"
    },
    {
        id: 'HD3KDTww', // unabomber
        speaker: "Kai",
        meaning: "ユナボマー（テッド・カジンスキー、米国の連続爆弾犯）",
        sentence: "My buddy's got a cabin in Montana that looks straight outta the Unabomber documentary and he goes there to 'disconnect.' I'm like bro, you don't need to go off the grid to watch baseball. That's what your phone's for.",
        sentence_ja: "友達がモンタナにユナボマーのドキュメンタリーそっくりの小屋持ってて、そこで「デジタルデトックス」するんだって。いや野球見るのにオフグリッドになる必要ないだろ。スマホあるじゃん。",
        idiom: "go off the grid",
        idiom_meaning: "disconnect from technology/society / テクノロジーから離れる・世間から離れる"
    },
    {
        id: '9bS5YbwD', // nuts and bolts
        speaker: "Marcus",
        meaning: "基本的な仕組み・核心部分",
        sentence: "OK let's get into the nuts and bolts of this roster. Where does Donovan slot in the lineup? 'Cause on paper this is a no-brainer, but in practice there's a lot of movin' parts.",
        sentence_ja: "OK、このロースターの核心部分に入ろう。ドノバンは打線のどこに入る？紙の上ではわかりきったことだけど、実際には動く要素がたくさんある。",
        idiom: "on paper",
        idiom_meaning: "in theory, but maybe not in practice / 理論上は・書面上は"
    },
    {
        id: 'rFH_IWLm', // malocclusion
        speaker: "Kai",
        meaning: "不正咬合（歯の噛み合わせ異常）",
        sentence: "OK totally off topic but I just got back from the dentist and apparently I've got malocclusion. My jaw's all messed up. The dentist said it's from grindin' my teeth durin' Mariners games. I kid you not.",
        sentence_ja: "完全に話逸れるけど、さっき歯医者から帰ってきて不正咬合だって言われた。顎がめちゃくちゃ。マリナーズの試合中に歯を食いしばるせいだって。冗談じゃなくて。",
        idiom: "I kid you not",
        idiom_meaning: "I'm completely serious / 冗談じゃなくて・マジで"
    },
    {
        id: 'afyxnF6r', // skimp on
        speaker: "Marcus",
        meaning: "ケチる・手を抜く",
        sentence: "You can NOT skimp on pitching in the postseason. The Mariners gotta walk the walk, not just talk the talk. You got the arms -- now go get the bullpen pieces too.",
        sentence_ja: "ポストシーズンでピッチングをケチっちゃダメ。マリナーズは口だけじゃなく行動で示さなきゃ。腕はある -- ブルペンの駒も取りに行け。",
        idiom: "walk the walk",
        idiom_meaning: "back up words with action / 口だけでなく実行する"
    },
    {
        id: 'FwoTKHIa', // terra firma
        speaker: "Kai",
        meaning: "陸地・大地・確固たる地盤",
        sentence: "After twenty years of wanderin' in the wilderness, it feels like the Mariners are finally on terra firma. Like we're actually buildin' somethin' real. Knock on wood, though. I've been burned before.",
        sentence_ja: "20年の荒野をさまよった後、マリナーズがやっと確固たる地盤に立ってる気がする。本当に何か築いてるって感じ。でも一応おまじない。前に痛い目見てるから。",
        idiom: "knock on wood",
        idiom_meaning: "said to prevent jinxing / おまじない（不吉を避ける）"
    },
    {
        id: '8Awc-xw5', // bean counter
        speaker: "Marcus",
        meaning: "経理屋・数字にうるさい人（軽蔑的）",
        sentence: "Every front office has some bean counter who kills trades 'cause the numbers don't add up. But sometimes you gotta go with your gut, you know? Analytics ain't everything.",
        sentence_ja: "どのフロントオフィスにも数字が合わないからってトレードを潰す経理屋がいる。でも時には直感で行かなきゃいけない時もあるだろ？データが全てじゃない。",
        idiom: "go with your gut",
        idiom_meaning: "follow your instinct / 直感に従う"
    },
    {
        id: 'pjdLBHSY', // househusband
        speaker: "Kai",
        meaning: "主夫（家事をする夫）",
        sentence: "If the Mariners win the World Series I told my wife I'll become a full-time househusband. Cook, clean, the whole deal. She didn't buy it for a second though. She knows me too well.",
        sentence_ja: "マリナーズがワールドシリーズ優勝したら専業主夫になるって妻に言った。料理、掃除、全部。でも全く信じてもらえなかった。俺のこと知り尽くしてるから。",
        idiom: "didn't buy it",
        idiom_meaning: "didn't believe it / 信じなかった"
    },

    // ========== DAY 4 (Feb 18) -- RIVAL ANALYSIS + LIFE TANGENTS ==========
    {
        id: 'hQPVpFUe', // worm eaten
        speaker: "Marcus",
        meaning: "虫食いの・腐りかけた",
        sentence: "The A's farm system is NOT worm eaten like people think. They've got some legit talent growin' down there, and if you're sleepin' on 'em, you're gonna get a rude awakenin'.",
        sentence_ja: "A'sのファームシステムはみんなが思ってるほど虫食いじゃない。ガチの才能が育ってるし、舐めてたら痛い目見るぞ。",
        idiom: "a rude awakening",
        idiom_meaning: "an unpleasant realization / 痛い目に遭う・目が覚める"
    },
    {
        id: 'A0cqbnoB', // dead on
        speaker: "Kai",
        meaning: "ぴったり正確な・的中して",
        sentence: "Your prediction about the Astros regresion was dead on, Marcus. They're lookin' shaky and their window is closin' fast. Couldn't've called it better. Give credit where credit is due.",
        sentence_ja: "アストロズの衰退予想はドンピシャだったよ、マーカス。彼ら不安定だし窓は急速に閉まってる。これ以上ない予想。功績は認めないとね。",
        idiom: "give credit where credit is due",
        idiom_meaning: "acknowledge someone's achievement / 功績は正当に認める"
    },
    {
        id: 'rYwmxV3X', // buttfuck
        speaker: "Marcus",
        meaning: "（卑語）ド田舎・何もない場所 / 肛門性交",
        sentence: "The A's new stadium is in the middle of buttfuck nowhere in Las Vegas and I STILL think it's gonna be packed. Baseball fans are crazy like that. We go above and beyond for our teams.",
        sentence_ja: "A'sの新しいスタジアムはラスベガスのド田舎のど真ん中だけど、それでも満員になると思う。野球ファンはそういうクレイジーさがある。チームのためなら何でもするんだよ。",
        idiom: "in the middle of nowhere",
        idiom_meaning: "in a very remote location / ド田舎に・何もないところに"
    },
    {
        id: '4juw35UO', // huckster
        speaker: "Kai",
        meaning: "押し売り・詐欺師・行商人",
        sentence: "Some of these baseball \"insiders\" on Twitter are total hucksters. They make stuff up, get retweets, and then when they're wrong they just sweep it under the rug. Zero accountability.",
        sentence_ja: "Twitterの野球「インサイダー」の一部は完全な詐欺師だよ。でっち上げて、リツイートされて、間違ったら臭いものに蓋。責任感ゼロ。",
        idiom: "sweep it under the rug",
        idiom_meaning: "hide a problem rather than deal with it / 臭いものに蓋・問題を隠す"
    },
    {
        id: '7zyQZ9Zy', // Westboro Baptist Church
        speaker: "Marcus",
        meaning: "ウェストボロ・バプテスト教会（米国の過激な教会）",
        sentence: "You know what's wild? The Westboro Baptist Church once picketed outside a minor league game. Like of ALL the things to protest, a single-A baseball game? You couldn't make this stuff up.",
        sentence_ja: "ヤバい話あるんだけど、ウェストボロ・バプテスト教会がマイナーリーグの試合場の外でピケやったことあるんだよ。よりによってシングルAの野球の試合に抗議？作り話みたいだよ。",
        idiom: "you can't make this stuff up",
        idiom_meaning: "too bizarre to be fictional / 作り話じゃないんだよ・嘘みたいな本当の話"
    },
    {
        id: 'U30xqqnI', // fashionista
        speaker: "Kai",
        meaning: "ファッショニスタ・おしゃれな人",
        sentence: "Dude, have you SEEN Julio Rodriguez's outfits? The man's a straight-up fashionista. And he plays ball. Meanwhile I'm wearin' the same Mariners hoodie I bought in 2019. I'm the exact opposite.",
        sentence_ja: "フリオ・ロドリゲスの服見た？あの人完全にファッショニスタ。しかも野球も上手い。一方俺は2019年に買ったマリナーズのパーカーずっと着てる。真逆だよ。",
        idiom: "the exact opposite",
        idiom_meaning: "completely different / 真逆・正反対"
    },
    {
        id: 'dfQn07yH', // doze off
        speaker: "Marcus",
        meaning: "うたた寝する・居眠りする",
        sentence: "I dozed off durin' the seventh inning of a regular season game last week and my kid drew a mustache on my face. I woke up none the wiser until I looked in the mirror.",
        sentence_ja: "先週レギュラーシーズンの7回で居眠りして、子供に顔にヒゲ描かれた。鏡見るまで全然気づかなかった。",
        idiom: "none the wiser",
        idiom_meaning: "without knowing or realizing / 全然気づかず"
    },
    {
        id: 'VbGOX-Np', // clown on
        speaker: "Kai",
        meaning: "バカにする・からかう",
        sentence: "Marcus, your Cardinals fans clown on us Mariners fans all the time, but at least we're ride or die for our team. You guys switch up the SECOND things go south.",
        sentence_ja: "マーカス、カーズファンはいつもマリナーズファンをバカにするけど、少なくとも俺たちはチームにとことん付き合う。お前らは状況悪くなった瞬間手のひら返すじゃん。",
        idiom: "ride or die",
        idiom_meaning: "loyal no matter what / どんな時も忠実・とことん付き合う"
    },
    {
        id: 'vN1eXpSd', // hominid
        speaker: "Marcus",
        meaning: "ヒト科の動物・ヒト科",
        sentence: "Some of these old-school scouts evaluate talent like they're still hominids livin' in caves. 'He LOOKS like a ballplayer.' Bro, use the data. We've evolved past the eye test. Get with the times.",
        sentence_ja: "オールドスクールのスカウトの中には、まだヒト科の洞窟人みたいな評価してるやつがいる。「野球選手に見える」って。データ使えよ。見た目だけの評価は超えたんだよ。時代に追いつけ。",
        idiom: "get with the times",
        idiom_meaning: "modernize, catch up with current trends / 時代に追いつけ・現代に適応しろ"
    },
    {
        id: 'zgG_mhQM', // ear mark
        speaker: "Kai",
        meaning: "充てる・割り当てる / 目印をつける",
        sentence: "The front office has already earmarked like thirty million for the bullpen this offseason. That money's spoken for. And if they don't spend it smart, heads will roll.",
        sentence_ja: "フロントオフィスはもう今オフのブルペンに3000万ドルくらい割り当ててる。その金はもう使い道が決まってる。賢く使わなかったら責任者の首が飛ぶぞ。",
        idiom: "heads will roll",
        idiom_meaning: "people will be punished / 首が飛ぶ・責任者が処罰される"
    },

    // ========== DAY 5 (Feb 19) -- PREDICTIONS + EMOTIONAL WRAP-UP ==========
    {
        id: 'tvHJlqvh', // living witness
        speaker: "Marcus",
        meaning: "生き証人",
        sentence: "I'm a living witness to Cardinals baseball since '92, and I'm tellin' you -- you don't trade a guy like Donovan unless you're gettin' the farm. Chaim knew the score from day one.",
        sentence_ja: "俺は92年からのカーディナルズ野球の生き証人として言うけど -- ファーム丸ごともらえない限りドノバンみたいな選手はトレードしない。チェイムは最初からわかってた。",
        idiom: "knew the score",
        idiom_meaning: "understood the real situation / 状況をわかっていた"
    },
    {
        id: 'j5wRTEap', // adieu
        speaker: "Kai",
        meaning: "さらば・別れの言葉（フランス語由来）",
        sentence: "I said adieu to my pessimism the day this trade dropped. Twenty years of expectin' the worst and now I'm all in. I'm drinkin' the Kool-Aid and I don't care who knows it.",
        sentence_ja: "このトレード発表された日に悲観主義にさよなら言った。20年間最悪を想定してきたけど、もう全賭け。完全に信者になったし、誰に知られても構わない。",
        idiom: "drinking the Kool-Aid",
        idiom_meaning: "blindly following or believing / 盲信する・鵜呑みにする"
    },
    {
        id: 'oCaqx7tb', // tiki torches
        speaker: "Marcus",
        meaning: "ティキトーチ（ハワイ風たいまつ装飾）",
        sentence: "If the Mariners make the World Series, Kai says he's gonna line his driveway with tiki torches and throw a luau. I'll believe it when I see it, but honestly I might fly out for that.",
        sentence_ja: "マリナーズがワールドシリーズ行ったら、カイは車道にティキトーチ並べてルアウパーティーやるって言ってる。見てから信じるけど、正直それのために飛行機乗るかも。",
        idiom: "I'll believe it when I see it",
        idiom_meaning: "I'm skeptical until proven / 見るまで信じない"
    },
    {
        id: '3bIlg0wt', // the time has come.
        speaker: "Kai",
        meaning: "時は来た",
        sentence: "The time has come, man. No more excuses, no more 'next year.' This IS the year. And if it's not, I swear I'm gonna eat my hat. Ninety-five wins minimum.",
        sentence_ja: "時は来たよ。もう言い訳なし、「来年」もなし。今年がその年だ。違ったら帽子食ってやる。最低95勝。",
        idiom: "eat my hat",
        idiom_meaning: "I'd be extremely surprised if wrong / 帽子を食ってやる（絶対そうなる）"
    },
    {
        id: '6EivQBzV', // funk
        speaker: "Marcus",
        meaning: "スランプ・落ち込み / ファンク音楽",
        sentence: "Every team goes through a funk in July or August. The question is whether your guys can pull themselves together or if it snowballs. The Mariners' depth is what scares me the most.",
        sentence_ja: "どのチームも7月か8月にスランプになる。問題は選手が立て直せるか、雪だるま式に悪化するか。マリナーズの選手層の厚さが一番怖い。",
        idiom: "pull themselves together",
        idiom_meaning: "regain composure and focus / 立て直す・態勢を整える"
    },
    {
        id: 'OSioW2Ul', // War in Darfur
        speaker: "Kai",
        meaning: "ダルフール紛争（スーダンの武力紛争）",
        sentence: "OK I know this sounds dramatic, but bein' a Mariners fan through the dark years felt like a War in Darfur for my soul. Twenty years, man. I'm not exaggeratin'. Well, maybe a little. Don't take it literally.",
        sentence_ja: "大げさに聞こえるけど、暗黒時代のマリナーズファンでいることは魂のダルフール紛争みたいだった。20年だぞ。大げさじゃない。...まあちょっと大げさか。文字通りに取らないで。",
        idiom: "don't take it literally",
        idiom_meaning: "I'm exaggerating for effect / 文字通りに取らないで"
    },
    {
        id: '8hQWrqHV', // laicization
        speaker: "Marcus",
        meaning: "非宗教化・還俗（聖職者が一般人に戻ること）",
        sentence: "Baseball is basically religion in St. Louis. If I stopped carin' about the Cards it'd be like laicization -- the whole community would disown me. My dad would straight up write me out of the will.",
        sentence_ja: "セントルイスでは野球はほぼ宗教。カーズへの興味を失ったら還俗みたいなもん -- コミュニティ全体から絶縁される。親父にはマジで遺言から外される。",
        idiom: "write someone out of the will",
        idiom_meaning: "remove someone from inheritance / 遺言から外す・相続させない"
    },
    {
        id: 'DTNnwSLt', // BDNF
        speaker: "Kai",
        meaning: "脳由来神経栄養因子（Brain-Derived Neurotrophic Factor）",
        sentence: "I read this article about how watchin' live sports boosts your BDNF levels -- it's like brain food. So technically when my wife says I watch too much baseball, I can say it's good for my head. I'm playin' the long game.",
        sentence_ja: "ライブスポーツ観戦がBDNFレベルを上げるって記事読んだ -- 脳の栄養みたいなもん。つまり妻に野球見すぎって言われたら、頭にいいんだよって言える。長期戦で攻めてる。",
        idiom: "playing the long game",
        idiom_meaning: "pursuing a strategy with long-term goals / 長期戦で攻める"
    },
    {
        id: 'ZhquhSSU', // gerbil
        speaker: "Marcus",
        meaning: "スナネズミ・ジャービル（小型のげっ歯類）",
        sentence: "My daughter's gerbil escaped during the ninth inning of Game 5 last year and I had to choose between watchin' the walk-off and catchin' it. I chose the game. Don't judge me -- she gave me an earful about it for a week.",
        sentence_ja: "去年のゲーム5の9回に娘のジャービルが脱走して、サヨナラ見るか捕まえるか選ばなきゃいけなかった。試合選んだ。批判するな -- 1週間ずっと小言言われたんだから。",
        idiom: "gave me an earful",
        idiom_meaning: "scolded me at length / 小言をたっぷり言われた"
    },
    {
        id: 'OfsS7SYv', // parishioner
        speaker: "Kai",
        meaning: "教区民・教会の信者",
        sentence: "Mariners fans are like parishioners at a church that keeps promisin' a miracle. And you know what? I think this year the miracle's actually comin'. It's been a blast doin' this podcast with you, Marcus. For real.",
        sentence_ja: "マリナーズファンは奇跡を約束し続ける教会の信者みたいだよ。でもね？今年はマジで奇跡が来ると思う。このポッドキャスト一緒にやれて本当に楽しかった、マーカス。マジで。",
        idiom: "it's been a blast",
        idiom_meaning: "it was a lot of fun / めちゃくちゃ楽しかった"
    },
];

async function seedDay41() {
    console.log('Seeding Day 041 -- Mariners Trade Talk (words 450-499)...');
    let success = 0;
    let failed = 0;
    let meaningFixed = 0;

    for (const item of DAY41_DATA) {
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

seedDay41();
