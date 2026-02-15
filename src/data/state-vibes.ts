export type StateExpression = {
    en: string;
    ja: string;
    example: string;
};

export type StateData = {
    vibe: string;
    description: string;
    expressions: StateExpression[];
};

export const STATE_DATA: Record<string, StateData> = {
    "Alabama": {
        vibe: "Southern Charm & Civil Rights",
        description: "The Heart of Dixie, where sweet tea flows freely and history runs deep. Alabama shaped the Civil Rights Movement from Montgomery to Birmingham, while its people perfected Southern hospitality and college football fanaticism.",
        expressions: [
            { en: "Fixin' to", ja: "〜するところ・〜しようとしている", example: "I'm fixin' to head down to the store, you need anything?" },
            { en: "Might could", ja: "〜できるかもしれない（二重助動詞）", example: "I might could help you move this weekend if it don't rain." },
            { en: "Roll Tide", ja: "アラバマ大学の掛け声（挨拶代わりにも）", example: "Nice truck, man. Roll Tide!" },
            { en: "Cattywampus", ja: "斜めになっている・歪んでいる", example: "That picture frame is all cattywampus, straighten it up." },
            { en: "Bless your heart", ja: "かわいそうに（同情・皮肉両方に使う）", example: "She tried to bake a cake from scratch -- bless her heart." },
        ],
    },
    "Alaska": {
        vibe: "Wild, Vast, & Frontier",
        description: "America's last frontier where glaciers meet the midnight sun. Alaskans measure distance in hours, not miles, and consider anything above zero degrees a warm spell. A land where wildlife outnumbers people and self-reliance isn't optional.",
        expressions: [
            { en: "Sourdough", ja: "アラスカの古参住民（パンではなく人を指す）", example: "That sourdough has been living off the grid near Fairbanks for thirty years." },
            { en: "Cheechako", ja: "アラスカの新参者", example: "You can always spot a cheechako -- they're the ones wearing cotton in winter." },
            { en: "Breakup", ja: "春の雪解け時期（恋愛じゃなく季節）", example: "Breakup is the ugliest time of year -- mud and slush everywhere." },
            { en: "Outside", ja: "アラスカ以外の場所（本土のこと）", example: "My daughter moved Outside to go to college in Seattle." },
            { en: "Termination dust", ja: "山頂に初雪が降ること（冬の始まりの合図）", example: "Saw termination dust on the mountains this morning -- summer's over." },
        ],
    },
    "Arizona": {
        vibe: "Desert, Canyon, & Sunsets",
        description: "A land sculpted by time itself, where saguaro cacti stand like sentinels and the Grand Canyon reminds you how small you are. Arizona blends Native American heritage, old cowboy spirit, and scorching heat that locals somehow learn to love.",
        expressions: [
            { en: "Dry heat", ja: "乾燥した暑さ（暑さの言い訳としても）", example: "It's 115 but it's a dry heat -- you barely feel it. Just kidding, you definitely feel it." },
            { en: "Haboob", ja: "砂嵐（アリゾナの巨大な砂塵嵐）", example: "Pull over and wait it out, there's a haboob rolling through Phoenix right now." },
            { en: "Snowbird", ja: "冬だけアリゾナに来る北部の高齢者", example: "Traffic gets terrible in winter when all the snowbirds show up." },
            { en: "Monsoon", ja: "夏の激しい雷雨シーズン", example: "Monsoon season hit hard this year -- our backyard flooded twice." },
            { en: "The Valley", ja: "フェニックス都市圏のこと", example: "I grew up in the Valley but moved to Flagstaff to escape the heat." },
        ],
    },
    "Arkansas": {
        vibe: "Natural Beauty & Southern Roots",
        description: "The Natural State lives up to its name with the Ozark Mountains, hot springs, and diamond mines. Arkansas is front-porch living, gospel music, and a quieter kind of Southern life where everybody knows your business.",
        expressions: [
            { en: "Holler", ja: "山あいの谷間・小さな渓谷", example: "My grandpa's cabin is way back in the holler, no cell service out there." },
            { en: "Over yonder", ja: "あっちの方に", example: "The gas station? It's over yonder past the church, can't miss it." },
            { en: "Tump over", ja: "ひっくり返す・倒す", example: "Be careful with that glass of tea, you're gonna tump it over." },
            { en: "Crawdad", ja: "ザリガニ", example: "We used to catch crawdads in the creek behind the house every summer." },
            { en: "Carry me", ja: "車で送ってくれる（運ぶじゃなく）", example: "Can you carry me to Walmart? My truck's in the shop." },
        ],
    },
    "California": {
        vibe: "Dream, Sun, & Innovation",
        description: "Where Silicon Valley meets Hollywood and surfers share the coast with tech billionaires. The Golden State is a land of reinvention, diversity, and the eternal pursuit of the next big thing -- from gold rush to tech rush.",
        expressions: [
            { en: "Hella", ja: "めっちゃ・すごく（北カリフォルニア方言）", example: "That concert was hella good, we should go again next week." },
            { en: "The 101", ja: "高速道路（番号の前にTheをつける）", example: "Take the 101 north and get off at Hollywood Boulevard." },
            { en: "No worries", ja: "大丈夫だよ・気にしないで", example: "You forgot the guac? No worries, we'll just get some on the way." },
            { en: "Gnarly", ja: "すごい・激しい（良い意味も悪い意味も）", example: "Dude, that wave was gnarly -- I totally wiped out." },
            { en: "Hype beast", ja: "流行に飛びつく人・ブランド好き", example: "He dropped 300 bucks on those sneakers -- total hype beast." },
        ],
    },
    "Colorado": {
        vibe: "Mountains, Adventure, & Altitude",
        description: "Mile-high living at its finest. Colorado draws skiers, hikers, and craft beer lovers to its Rocky Mountain playground. The altitude hits newcomers hard, but the views make it worth the headache -- literally.",
        expressions: [
            { en: "Fourteener", ja: "標高14,000フィート以上の山（登山目標）", example: "I've bagged twelve fourteeners this summer, trying to hit all fifty-three." },
            { en: "Powder day", ja: "新雪がたっぷり降った日（スキー最高の日）", example: "Called in sick for a powder day -- no way I'm sitting in an office when there's fresh snow." },
            { en: "Front Range", ja: "ロッキー山脈東側の都市部", example: "Most people in Colorado live along the Front Range, from Fort Collins to Pueblo." },
            { en: "Nosebleed", ja: "鼻血が出る（高地の乾燥で本当に出る）", example: "First week in Denver I got nosebleeds every night from the altitude." },
            { en: "Brewski", ja: "ビール（クラフトビール文化が盛ん）", example: "Let's grab a brewski at that new brewery on Larimer Street." },
        ],
    },
    "Connecticut": {
        vibe: "Old Money & Ivy League",
        description: "A small state with a big reputation. Home to Yale, hedge funds, and autumn foliage so perfect it looks staged. Connecticut is where New England prep culture meets quiet wealth and the world's best pizza outside New York.",
        expressions: [
            { en: "Nutmegger", ja: "コネチカット州民の呼び名", example: "As a born and raised Nutmegger, I can confirm our pizza is criminally underrated." },
            { en: "Grinder", ja: "サンドイッチ（他州のsub/hoagieのこと）", example: "I'll take an Italian grinder with everything on it." },
            { en: "Package store", ja: "酒屋（略してpackyとも）", example: "We need to stop at the package store before the party." },
            { en: "Tag sale", ja: "ガレージセール", example: "Found this vintage lamp at a tag sale for five bucks." },
            { en: "Apizza", ja: "ニューヘイブン式ピザ（アビーツァと発音）", example: "You haven't lived till you've tried apizza from Pepe's in New Haven." },
        ],
    },
    "Delaware": {
        vibe: "Small, First, & Tax-Free",
        description: "The First State may be tiny, but it punches above its weight. More corporations are incorporated here than anywhere else, there's no sales tax, and locals have a fierce pride that outsiders rarely understand.",
        expressions: [
            { en: "Slower Lower", ja: "デラウェア州南部（のんびりした地域）", example: "We rented a beach house down in Slower Lower for the whole month of August." },
            { en: "Tax-free", ja: "消費税なし（デラウェアの最大の売り）", example: "Drive to Delaware for big purchases -- everything's tax-free." },
            { en: "The First State", ja: "最初の州（憲法を最初に批准）", example: "Our license plates say The First State and we never let anyone forget it." },
            { en: "Scrapple", ja: "豚肉の切れ端で作るソーセージ的な食べ物", example: "Scrapple and eggs is the only proper Delaware breakfast." },
            { en: "Down the shore", ja: "ビーチに行く", example: "Everybody heads down the shore on Memorial Day weekend." },
        ],
    },
    "Florida": {
        vibe: "Sunshine, Chaos, & Beaches",
        description: "America's most unpredictable state. Where retirees, spring breakers, and the legendary 'Florida Man' coexist in a subtropical fever dream of theme parks, alligators, and endless coastline. The further north you go, the more Southern it gets.",
        expressions: [
            { en: "Florida Man", ja: "フロリダ発の奇妙なニュースの主人公的ミーム", example: "Did you see today's headline? Florida Man rides alligator into Wendy's drive-through." },
            { en: "Snowbird", ja: "冬だけフロリダに来る北部の人", example: "The snowbirds clog up I-95 every November, takes me twice as long to get to work." },
            { en: "Jit", ja: "若者・子ども（フロリダスラング）", example: "Some jit just cut me off on his skateboard, nearly wiped out." },
            { en: "No-see-ums", ja: "極小の刺す虫（ヌカカ）", example: "The no-see-ums are brutal tonight, grab the bug spray." },
            { en: "Hurricane party", ja: "ハリケーン接近中にあえて開くパーティー", example: "Category 2? That's just a hurricane party. We're not evacuating for that." },
        ],
    },
    "Georgia": {
        vibe: "Peaches, Hip-Hop, & Hospitality",
        description: "Atlanta's hip-hop empire meets small-town Southern charm. Georgia is where Outkast grew up, peaches grow sweet, and 'bless your heart' can mean absolutely anything. From Savannah's moss-draped squares to Atlanta's skyline, it's a state of contrasts.",
        expressions: [
            { en: "ATL", ja: "アトランタの略称", example: "I'm flying into ATL this Friday, let's link up." },
            { en: "Bussin'", ja: "めちゃくちゃ美味しい・最高", example: "That lemon pepper chicken from the gas station? Bussin'." },
            { en: "The Peach State", ja: "ジョージアの愛称", example: "Welcome to the Peach State -- sweet tea is mandatory, not optional." },
            { en: "Cap / No cap", ja: "嘘 / マジで本当", example: "No cap, Atlanta traffic is the worst I've ever seen in my life." },
            { en: "Buggy", ja: "ショッピングカート", example: "Grab a buggy, we need a lot of stuff from Kroger." },
        ],
    },
    "Hawaii": {
        vibe: "Aloha, Paradise, & Spirit",
        description: "The only state born from volcanoes and Polynesian voyagers. Hawaii's aloha spirit is more than a greeting -- it's a way of life where ocean, mountains, and multicultural traditions merge into something found nowhere else on Earth.",
        expressions: [
            { en: "Aloha", ja: "こんにちは・さようなら・愛", example: "Aloha! Welcome to the islands, first time visiting?" },
            { en: "Mahalo", ja: "ありがとう", example: "Mahalo for holding the door, bruddah." },
            { en: "Pau hana", ja: "仕事終わり（ハッピーアワー的な）", example: "It's pau hana time, let's grab some beers at the beach." },
            { en: "Talk story", ja: "おしゃべりする・世間話をする", example: "We just sat on the lanai and talked story for hours." },
            { en: "Da kine", ja: "アレ・あのやつ（万能な代名詞）", example: "Can you pass me da kine? You know, the thing on the counter." },
        ],
    },
    "Idaho": {
        vibe: "Potatoes, Peaks, & Peace",
        description: "More than just potatoes, though the potatoes are legendary. Idaho offers pristine wilderness, world-class skiing, and a laid-back pace that attracts people fleeing bigger states. The gem state is America's best-kept secret.",
        expressions: [
            { en: "Famous potatoes", ja: "ナンバープレートにも書いてあるスローガン", example: "Yes, I'm from Idaho. Yes, we really do eat that many potatoes." },
            { en: "Boise", ja: "ボイジーと発音（ボイシーではない）", example: "It's BOY-see, not boy-ZEE. Locals will correct you real fast." },
            { en: "Finger steaks", ja: "アイダホ名物の揚げた牛肉スティック", example: "You can't leave Idaho without trying finger steaks -- it's our thing." },
            { en: "Crick", ja: "小川（creekの方言発音）", example: "We used to fish in the crick behind the barn every afternoon." },
            { en: "Spendy", ja: "高い・お金がかかる", example: "Sun Valley is beautiful but man, it's gotten real spendy lately." },
        ],
    },
    "Illinois": {
        vibe: "Chicago, Blues, & Prairie",
        description: "The Land of Lincoln, dominated by Chicago's towering skyline. Deep-dish pizza, blues music, and political drama define a state split between big-city hustle and endless cornfields. Chicagoans will fight you over pizza styles.",
        expressions: [
            { en: "Da Bears", ja: "シカゴ・ベアーズ（独特の発音が名物）", example: "How 'bout da Bears? They're finally having a decent season." },
            { en: "Dibs", ja: "雪かきした駐車スペースの確保（椅子を置く）", example: "I shoveled that spot for an hour -- I'm calling dibs with a lawn chair." },
            { en: "Pop", ja: "炭酸飲料（sodaとは言わない）", example: "Want a pop? We got Coke, Sprite, and root beer in the fridge." },
            { en: "The L", ja: "シカゴの高架鉄道", example: "Just take the L downtown, parking is a nightmare." },
            { en: "Italian beef", ja: "シカゴ名物の薄切りビーフサンド", example: "Give me an Italian beef, dipped, with hot giardiniera." },
        ],
    },
    "Indiana": {
        vibe: "Racing, Corn, & Crossroads",
        description: "Home to the Indy 500 and the Crossroads of America. Indiana is heartland personified -- basketball hoops in every driveway, cornfields to the horizon, and genuine Midwestern kindness that isn't just an act.",
        expressions: [
            { en: "Hoosier", ja: "インディアナ州民の呼び名（語源は謎）", example: "I'm a Hoosier born and raised -- lived here my whole life." },
            { en: "Tenderloin", ja: "巨大な豚カツサンド（インディアナ名物）", example: "The breaded tenderloin at that diner is bigger than the plate." },
            { en: "The 500", ja: "インディ500（レースの代名詞）", example: "You coming to the 500 this year? I got tickets for Turn 4." },
            { en: "Ope", ja: "おっと・すみません（ぶつかりそうな時に）", example: "Ope, let me just squeeze right past ya there." },
            { en: "Cornhole", ja: "ビーンバッグ投げゲーム（裏庭定番）", example: "Set up the cornhole boards -- it's perfect weather for a cookout." },
        ],
    },
    "Iowa": {
        vibe: "Farmland, Caucus, & Community",
        description: "Where presidential campaigns begin and the corn grows taller than your truck. Iowa's rolling farmlands and tight-knit communities represent the backbone of American agriculture and the kind of neighbor who brings casseroles when you're sick.",
        expressions: [
            { en: "Knee-high by the Fourth of July", ja: "7月4日までにトウモロコシが膝丈に育つ（豊作の目安）", example: "Corn's already knee-high by the Fourth of July -- gonna be a good year." },
            { en: "You betcha", ja: "もちろん・その通り", example: "Can you give me a ride? You betcha, hop in." },
            { en: "Uff da", ja: "驚きや疲れの感嘆詞（北欧系の影響）", example: "Uff da, that snowstorm last night was something else." },
            { en: "Loose meat sandwich", ja: "マイドライト（ほぐした牛肉のサンド）", example: "You gotta try a loose meat sandwich at Maid-Rite -- it's an Iowa classic." },
            { en: "The caucus", ja: "アイオワ党員集会（大統領選の最初の関門）", example: "Every four years the whole country cares about Iowa because of the caucus." },
        ],
    },
    "Kansas": {
        vibe: "Wheat, Wind, & Wizard of Oz",
        description: "The geographic center of the contiguous US, where amber waves of grain stretch to every horizon. Tornadoes, sunflowers, and Dorothy's ghost define a flat, windswept state whose people are tougher than they look.",
        expressions: [
            { en: "Not in Kansas anymore", ja: "もう安全な場所じゃない（オズの魔法使いから）", example: "First day in New York and I thought, Toto, we're not in Kansas anymore." },
            { en: "Tornado alley", ja: "竜巻多発地帯", example: "Growing up in tornado alley, you learn to sleep through the sirens." },
            { en: "Wheat harvest", ja: "小麦の収穫期（州最大のイベント）", example: "Everything shuts down during wheat harvest -- whole town's in the fields." },
            { en: "Flatter than a pancake", ja: "パンケーキより平ら（カンザスの地形を描写）", example: "People say Kansas is flatter than a pancake, and scientifically, they're right." },
            { en: "Rock Chalk", ja: "カンザス大学の掛け声", example: "Rock Chalk Jayhawk! We're going to the Final Four this year!" },
        ],
    },
    "Kentucky": {
        vibe: "Bourbon, Bluegrass, & Derby",
        description: "The Bluegrass State, where bourbon ages in charred oak barrels and thoroughbreds thunder down the track at Churchill Downs. Kentucky is Appalachian soul meets Southern gentleman tradition, served neat.",
        expressions: [
            { en: "Bourbon", ja: "バーボンウイスキー（ケンタッキーが聖地）", example: "You can't call it bourbon unless it's made in Kentucky -- that's just the law." },
            { en: "Derby", ja: "ケンタッキーダービー（競馬の祭典）", example: "Derby Day is basically a state holiday -- everybody wears big hats and drinks mint juleps." },
            { en: "Holler", ja: "山あいの谷・渓谷", example: "My family's been living in this holler for five generations." },
            { en: "Y'ain't", ja: "you ain'tの短縮形", example: "Y'ain't gonna believe what happened at the church supper last night." },
            { en: "Burgoo", ja: "ケンタッキー名物の肉と野菜の煮込み", example: "There's nothing better than a bowl of burgoo on a cold fall night." },
        ],
    },
    "Louisiana": {
        vibe: "Cajun, Jazz, & Bayou",
        description: "A fever dream of French, African, and Caribbean cultures. Louisiana is jazz funerals, crawfish boils, Mardi Gras beads, and a language -- Cajun French -- you won't find anywhere else in America. The food alone is worth the trip.",
        expressions: [
            { en: "Lagniappe", ja: "おまけ・ちょっとした特典", example: "The chef threw in some bread pudding as lagniappe -- love this place." },
            { en: "Laissez les bons temps rouler", ja: "楽しい時間を過ごそう", example: "It's Mardi Gras -- laissez les bons temps rouler!" },
            { en: "Cher", ja: "親しい人への呼びかけ（シェーと発音）", example: "Come here, cher, let me tell you somethin'." },
            { en: "Crawfish boil", ja: "ザリガニの茹でパーティー", example: "We're throwing a crawfish boil this Saturday -- bring beer and newspaper." },
            { en: "Neutral ground", ja: "道路の中央分離帯", example: "Park on the neutral ground, there's no spots on the street." },
        ],
    },
    "Maine": {
        vibe: "Lobster, Lighthouses, & Solitude",
        description: "The northernmost New England state, where rocky coastlines meet dense pine forests. Maine is Stephen King country, lobster roll heaven, and the kind of quiet that city people find either peaceful or terrifying.",
        expressions: [
            { en: "Ayuh", ja: "うん・そうだね（メイン州の「yes」）", example: "Think it's gonna snow tonight? Ayuh, looks like it." },
            { en: "Wicked", ja: "すごく・めっちゃ（副詞）", example: "That lobster roll was wicked good, I could eat three more." },
            { en: "From away", ja: "メイン州出身じゃない人", example: "She's lived here twenty years but she's still from away." },
            { en: "Dooryard", ja: "家の前庭・玄関先", example: "Just pull into the dooryard, I'll come out and meet you." },
            { en: "Downeast", ja: "メイン州北東部の海岸地域", example: "The best blueberries come from Downeast, nowhere else compares." },
        ],
    },
    "Maryland": {
        vibe: "Crabs, Capital, & Chesapeake",
        description: "Nestled around the Chesapeake Bay and bordering the nation's capital. Maryland is Old Bay seasoning on everything, blue crabs eaten with mallets, and a fierce local pride that belies its small size.",
        expressions: [
            { en: "Old Bay", ja: "メリーランドの万能シーズニング（何にでもかける）", example: "Old Bay on crabs, fries, popcorn, ice cream -- we put it on everything." },
            { en: "Hon", ja: "親しみの呼びかけ（ボルチモア方言）", example: "Welcome to Bawlmer, hon. What can I get ya?" },
            { en: "DMV", ja: "DC・メリーランド・バージニア地域", example: "I grew up in the DMV, so I've been to every Smithsonian museum twice." },
            { en: "Steamed crabs", ja: "蒸しカニ（メリーランド名物）", example: "Saturday night means a bushel of steamed crabs and cold beer on the deck." },
            { en: "The Shore", ja: "チェサピーク湾の東海岸地域", example: "We rent a house on the Shore every summer -- best vacation ever." },
        ],
    },
    "Massachusetts": {
        vibe: "Revolution, Brains, & Boston",
        description: "Where America was born and Harvard was built. Massachusetts is colonial history, wicked accents, Dunkin' on every corner, and an intellectual intensity that drives everything from politics to the Red Sox.",
        expressions: [
            { en: "Wicked", ja: "すごく・めっちゃ（ボストン方言の代名詞）", example: "That game was wicked awesome, Pats crushed it." },
            { en: "Packie", ja: "酒屋（package storeの略）", example: "Swing by the packie and grab a case of Sam Adams." },
            { en: "Bang a uey", ja: "Uターンする", example: "You missed the turn -- bang a uey at the next light." },
            { en: "Dunks", ja: "ダンキンドーナツの愛称", example: "I can't function without my Dunks iced coffee, even in January." },
            { en: "Chowdah", ja: "チャウダー（ボストンアクセント）", example: "It's chowdah, not chowder. Say it right or don't say it at all." },
        ],
    },
    "Michigan": {
        vibe: "Motors, Lakes, & Motown",
        description: "Surrounded by Great Lakes and defined by Detroit's rise, fall, and reinvention. Michigan is Motown soul, automotive grit, cherry orchards, and the kind of lake sunsets that rival any ocean view.",
        expressions: [
            { en: "Up North", ja: "ミシガン北部（休暇先の定番）", example: "We're heading Up North to the cabin this weekend -- no cell service, pure bliss." },
            { en: "The Mitten", ja: "ミシガン州の形（手袋に似てる）", example: "I'm from right here on the Mitten -- points to palm of hand." },
            { en: "Party store", ja: "コンビニ（ミシガンの呼び方）", example: "Run to the party store and grab some pop and chips." },
            { en: "Michigan left", ja: "Uターンを使った左折方法（ミシガン独特）", example: "Visitors hate the Michigan left, but it actually keeps traffic moving." },
            { en: "Yooper", ja: "アッパー半島の住民", example: "Yoopers are built different -- they deal with lake-effect snow that'd shut down any other state." },
        ],
    },
    "Minnesota": {
        vibe: "Nice, Cold, & 10,000 Lakes",
        description: "Land of 10,000 Lakes and 'Minnesota Nice' -- that Scandinavian-influenced politeness that might be genuine warmth or passive aggression, depending who you ask. Brutal winters breed tough, friendly people who say 'ope' a lot.",
        expressions: [
            { en: "Ope", ja: "おっと（ぶつかりそうな時の反射的な言葉）", example: "Ope, sorry, just gonna sneak right past ya." },
            { en: "You betcha", ja: "もちろん・その通り", example: "Can you pick up the kids? You betcha, no problem." },
            { en: "Hotdish", ja: "キャセロール料理（casseroleとは言わない）", example: "Tater tot hotdish is the official food of Minnesota, don't argue." },
            { en: "Duck, Duck, Gray Duck", ja: "ダック・ダック・グレイダック（他州はGoose）", example: "It's Duck, Duck, Gray Duck, not Goose. The rest of the country is wrong." },
            { en: "Minnesota goodbye", ja: "帰ると言ってから実際に帰るまで30分かかること", example: "We did the Minnesota goodbye -- stood in the doorway talking for another forty-five minutes." },
        ],
    },
    "Mississippi": {
        vibe: "Blues, Delta, & Deep South",
        description: "The birthplace of the Blues and the soul of the Deep South. Mississippi's Delta region gave the world its most important musical export while wrestling with America's most complex history. The food is unmatched.",
        expressions: [
            { en: "Delta blues", ja: "デルタ・ブルース（音楽ジャンルの原点）", example: "You can't understand American music without understanding the Delta blues." },
            { en: "Catfish", ja: "ナマズ料理（ミシシッピの主食レベル）", example: "Fried catfish with hushpuppies -- that's Friday night in Mississippi." },
            { en: "Fixin's", ja: "おかず・付け合わせ", example: "Get a plate and load up on fixin's -- we got greens, cornbread, and slaw." },
            { en: "Come to Jesus", ja: "真剣な話し合い・説教", example: "We're gonna have a come to Jesus talk about your grades, young man." },
            { en: "Mess of", ja: "たくさんの", example: "I caught a mess of fish out on the river this morning." },
        ],
    },
    "Missouri": {
        vibe: "Show-Me, BBQ, & Gateway",
        description: "The Show-Me State, straddling the line between Midwest and South. Home to the Gateway Arch, legendary Kansas City barbecue, and a stubborn pragmatism that demands proof over promises.",
        expressions: [
            { en: "Show me", ja: "証明してみろ（ミズーリ州のモットー）", example: "We're the Show-Me State -- talk is cheap, show me it works." },
            { en: "Warsh", ja: "wash の方言発音（Rが入る）", example: "I need to warsh my car, it's covered in pollen." },
            { en: "Hoosier", ja: "ミズーリでは「ダサい人」の意味（インディアナと違う）", example: "Don't wear that to the restaurant, you look like a hoosier." },
            { en: "Toasted ravioli", ja: "揚げラビオリ（セントルイス名物）", example: "You haven't been to St. Louis if you haven't tried toasted ravioli." },
            { en: "Missourah", ja: "ミズーラ（州名の地元発音、最後がア）", example: "It's Missour-ah, not Missour-ee. At least that's what grandpa says." },
        ],
    },
    "Montana": {
        vibe: "Big Sky, Ranch, & Wild",
        description: "Big Sky Country, where the horizon stretches so far it bends. Montana is cattle ranches, grizzly bears, Glacier National Park, and the kind of open space that makes you feel both completely free and very small.",
        expressions: [
            { en: "Big Sky", ja: "モンタナの愛称（空が広い）", example: "You don't understand Big Sky Country until you drive through it -- nothing but sky and grass for hours." },
            { en: "Chinook", ja: "暖かい風（冬に急に気温を上げる）", example: "A chinook blew through last night -- went from negative ten to fifty degrees overnight." },
            { en: "Griz", ja: "グリズリー熊（地元の大学のマスコットでもある）", example: "Keep your food locked up, there's been griz sightings near the campsite." },
            { en: "Ranch dressing", ja: "牧場のドレッシング（ではなく本物の牧場生活）", example: "When we say ranch in Montana, we mean actual cattle, not the salad dressing." },
            { en: "Going to town", ja: "街に出かける（遠出のニュアンス）", example: "I'm going to town Saturday -- need anything? It's an hour each way." },
        ],
    },
    "Nebraska": {
        vibe: "Cornhusker, Plains, & Beef",
        description: "The Cornhusker State, where college football is religion and the Great Plains roll endlessly westward. Nebraska is steak country, sandhill crane migrations, and a quiet resilience forged by prairie winds.",
        expressions: [
            { en: "Go Big Red", ja: "ネブラスカ大学の応援スローガン", example: "Go Big Red! Memorial Stadium is the third-largest city in Nebraska on game day." },
            { en: "Runza", ja: "ネブラスカ名物の肉入りパン", example: "Grab me a Runza on the way home -- the original with cabbage and beef." },
            { en: "Sandhills", ja: "ネブラスカの砂丘草原地帯", example: "The Sandhills look empty but there's more cattle out there than people." },
            { en: "Husker", ja: "ネブラスカ大学のファン・卒業生", example: "Once a Husker, always a Husker -- my whole family bleeds red." },
            { en: "Steak night", ja: "ステーキの夜（ネブラスカでは週間行事）", example: "Tuesday is steak night -- I'm firing up the grill at six." },
        ],
    },
    "Nevada": {
        vibe: "Vegas, Desert, & Gamble",
        description: "What happens in Vegas is only a fraction of what Nevada offers. Beyond the neon, there's Area 51 alien lore, vast desert solitude, and a libertarian streak as wide as the state itself.",
        expressions: [
            { en: "The Strip", ja: "ラスベガス・ストリップ（メイン通り）", example: "Tourists walk the Strip, locals avoid it like the plague." },
            { en: "Comped", ja: "無料にしてもらう（カジノ用語）", example: "Play enough blackjack and they'll comp your room, meals, even the show." },
            { en: "Degenerate", ja: "ギャンブル好き（自虐的に）", example: "I'm a total degenerate -- put fifty on the over and another fifty on red." },
            { en: "Off-strip", ja: "ストリップ以外の場所（地元民エリア）", example: "The best food in Vegas is off-strip -- cheaper and way better." },
            { en: "Nevada", ja: "ネヴァダ（ネバーダじゃない、発音注意）", example: "It's Nev-AD-a, not Nev-AH-da. Say it wrong and locals will roast you." },
        ],
    },
    "New Hampshire": {
        vibe: "Live Free or Die",
        description: "New Hampshire's motto says it all. Fiercely independent, with no income tax, no sales tax, and a 'leave me alone' attitude wrapped in gorgeous fall foliage and granite mountains.",
        expressions: [
            { en: "Live Free or Die", ja: "自由に生きるか死か（州のモットー）", example: "Live Free or Die -- it's on every license plate and we mean it." },
            { en: "Leaf peepers", ja: "紅葉を見に来る観光客", example: "The leaf peepers clog up every back road in October." },
            { en: "Wicked", ja: "すごく（ニューイングランド共通）", example: "It's wicked cold out -- don't forget your hat." },
            { en: "The Old Man", ja: "かつての岩の顔（崩壊したが州のシンボル）", example: "The Old Man of the Mountain fell in 2003 but he's still on our quarter." },
            { en: "Flatlander", ja: "ニューハンプシャー以外から来た人", example: "Those flatlanders from Massachusetts don't know how to drive in snow." },
        ],
    },
    "New Jersey": {
        vibe: "Diner, Shore, & Attitude",
        description: "The most densely populated state and proud of it. New Jersey is boardwalks, diners at 2 AM, and a sharp-tongued attitude that hides genuine warmth. Don't pump your own gas -- it's illegal, and honestly, we like it that way.",
        expressions: [
            { en: "Jug handle", ja: "右に曲がって左折するNJ独特の道路構造", example: "You can't turn left on this road -- gotta use the jug handle up ahead." },
            { en: "Down the shore", ja: "ビーチに行く", example: "We're going down the shore for the weekend -- Wildwood or Seaside?" },
            { en: "Taylor Ham", ja: "ポークロール（北ジャージーの呼び方で論争に）", example: "It's Taylor Ham, not pork roll. I will die on this hill." },
            { en: "Benny", ja: "夏にジャージーショアに来る観光客", example: "The Bennys are back, clogging up Route 35 every weekend." },
            { en: "Full service", ja: "ガソリンはスタッフが入れる（セルフ禁止）", example: "We don't pump our own gas in Jersey -- full service only, baby." },
        ],
    },
    "New Mexico": {
        vibe: "Enchanted, Adobe, & Chile",
        description: "The Land of Enchantment, where adobe architecture glows under turquoise skies. A fusion of Native American, Spanish, and Anglo cultures creates something found nowhere else in America -- and the chile is a way of life.",
        expressions: [
            { en: "Red or green?", ja: "赤か緑か？（チリソースの選択、州の公式質問）", example: "Red or green? Christmas. Give me both." },
            { en: "Christmas", ja: "赤と緑のチリソース両方かけること", example: "I always order Christmas -- can't choose between red and green chile." },
            { en: "Adobe", ja: "日干しレンガの建物（ニューメキシコのシンボル）", example: "Every house in Santa Fe looks like it's made of adobe because it basically is." },
            { en: "Manana", ja: "明日・後で（のんびりした時間感覚）", example: "The plumber said he'd come manana, which in New Mexico could mean next week." },
            { en: "Ristra", ja: "軒先に吊るす唐辛子の束", example: "Every porch in town has a ristra hanging by the door -- it's not decoration, it's dinner." },
        ],
    },
    "New York": {
        vibe: "Empire, Hustle, & Culture",
        description: "The Empire State, where New York City's relentless energy overshadows upstate's rolling vineyards and Adirondack wilderness. If you can make it here, you can make it anywhere -- but the rent might kill you first.",
        expressions: [
            { en: "Deadass", ja: "マジで・本気で", example: "I'm deadass not going out in this weather, it's freezing." },
            { en: "Bodega", ja: "街角のコンビニ（何でも売ってる）", example: "Grabbed a bacon egg and cheese from the bodega on the corner." },
            { en: "Mad", ja: "すごく・めっちゃ（副詞として）", example: "It's mad cold out today, I'm not leaving this apartment." },
            { en: "Schlep", ja: "面倒な移動をする・重いものを運ぶ", example: "I had to schlep all the way to Brooklyn for one meeting." },
            { en: "Stoop", ja: "建物入口の階段（社交の場）", example: "We just sat on the stoop all afternoon watching people walk by." },
        ],
    },
    "North Carolina": {
        vibe: "BBQ, Mountains, & Research",
        description: "From the Research Triangle's tech scene to the Blue Ridge Mountains to the Outer Banks' wild beaches. North Carolina blends cutting-edge innovation with old-school barbecue wars -- vinegar vs. tomato is serious business.",
        expressions: [
            { en: "Bless your heart", ja: "かわいそうに・まあまあ（南部の万能フレーズ）", example: "He wore a suit to a pig pickin' -- bless his heart." },
            { en: "Pig pickin'", ja: "丸焼き豚のバーベキューパーティー", example: "Everybody's invited to the pig pickin' Saturday -- bring a side dish." },
            { en: "Tar Heel", ja: "ノースカロライナ州民の呼び名", example: "Once a Tar Heel, always a Tar Heel -- Go Heels!" },
            { en: "Buggy", ja: "ショッピングカート", example: "Grab a buggy when you walk in, we need a full grocery run." },
            { en: "Mash", ja: "ボタンを押す（pushじゃなく）", example: "Mash the button for the elevator, my hands are full." },
        ],
    },
    "North Dakota": {
        vibe: "Oil, Prairie, & Tough",
        description: "The Peace Garden State, where oil booms and prairie solitude coexist under a sky so big it swallows you whole. North Dakota's brutal winters create a hardiness and self-reliance that defines its people.",
        expressions: [
            { en: "Uff da", ja: "驚き・疲れの感嘆詞（スカンジナビア系の影響）", example: "Uff da, it's forty below with wind chill -- school's still open though." },
            { en: "Hot dish", ja: "キャセロール料理（カセロールとは言わない）", example: "Bring a hot dish to the potluck -- tater tot is always a hit." },
            { en: "The patch", ja: "油田地帯（バッケン油田エリア）", example: "Everybody moved out to the patch when oil prices were high." },
            { en: "Brrr", ja: "寒い（ノースダコタでは日常語）", example: "Negative thirty? That's just Tuesday. Brrr doesn't even cover it." },
            { en: "You betcha", ja: "もちろん・その通り", example: "Need help shoveling? You betcha, I'll be right over." },
        ],
    },
    "Ohio": {
        vibe: "Swing, Industry, & Buckeye",
        description: "The Buckeye State that decides presidents and perfected the roller coaster. Ohio is Rust Belt reinvention, the Rock and Roll Hall of Fame, and a perpetual identity crisis between Midwest nice and East Coast edge.",
        expressions: [
            { en: "O-H!", ja: "オハイオ州立大学の掛け声（相手がI-O!と返す）", example: "O-H! ...I-O! You can hear it at any airport in the country." },
            { en: "Pop", ja: "炭酸飲料", example: "What kind of pop do you want? We got Coke and ginger ale." },
            { en: "The Shoe", ja: "オハイオスタジアム（馬蹄形だから）", example: "Game day at the Shoe is the greatest experience in college football." },
            { en: "Buckeye", ja: "オハイオの木の実・州民の呼び名", example: "My grandma makes chocolate buckeyes every Christmas -- peanut butter dipped in chocolate." },
            { en: "Cbus", ja: "コロンバスの略称", example: "Cbus has gotten way cooler in the last ten years -- the food scene is incredible." },
        ],
    },
    "Oklahoma": {
        vibe: "Sooner, Storm, & Native Land",
        description: "Where the wind comes sweeping down the plain -- along with tornadoes. Oklahoma is Native American heritage, oil wealth, Sooner football pride, and a frontier toughness born from the Dust Bowl and land runs.",
        expressions: [
            { en: "Sooner", ja: "オクラホマ人（土地取得競争で早く出発した人から）", example: "Boomer Sooner! OU football is basically a religion here." },
            { en: "Fixin' to", ja: "〜しようとしている", example: "I'm fixin' to run to the store, need anything?" },
            { en: "Cattleguard", ja: "牛よけの地面の格子（道路上に設置）", example: "Slow down at the cattleguard, you'll rattle your teeth out." },
            { en: "Red dirt", ja: "赤い土（オクラホマの象徴的な風景）", example: "You can always spot an Oklahoma truck by the red dirt on the fenders." },
            { en: "Tornado watch", ja: "竜巻注意報（日常茶飯事）", example: "There's a tornado watch tonight but we're still having the cookout." },
        ],
    },
    "Oregon": {
        vibe: "Weird, Green, & Free",
        description: "Keep Portland Weird -- and the rest of Oregon isn't exactly normal either. It's craft everything (beer, coffee, cheese) surrounded by ancient forests, volcanic peaks, and a counterculture spirit that takes sustainability seriously.",
        expressions: [
            { en: "Keep Portland Weird", ja: "ポートランドを変わり者のままに（非公式スローガン）", example: "There's a guy who plays flaming bagpipes on a unicycle -- Keep Portland Weird." },
            { en: "The Gorge", ja: "コロンビア川渓谷", example: "We hiked Multnomah Falls out in the Gorge -- absolutely stunning." },
            { en: "Spendy", ja: "高い・値段が張る", example: "Portland used to be cheap but it's gotten real spendy." },
            { en: "Cascadia", ja: "太平洋岸北西部地域の呼称", example: "Some people dream of Cascadia becoming its own country -- Oregon, Washington, and BC." },
            { en: "No sales tax", ja: "消費税なし（オレゴンの自慢）", example: "Come to Oregon for the scenery, stay for the no sales tax." },
        ],
    },
    "Pennsylvania": {
        vibe: "Liberty, Steel, & Cheesesteak",
        description: "Where independence was declared and steel was forged. Pennsylvania stretches from Philly's cheesesteak culture to Pittsburgh's tech renaissance, connected by Amish country and Appalachian coal towns.",
        expressions: [
            { en: "Jawn", ja: "あれ・それ・何でも指す万能名詞（フィリー方言）", example: "Hand me that jawn over there -- no, the other jawn." },
            { en: "Yinz", ja: "あなたたち（ピッツバーグ方言のyou all）", example: "Are yinz coming to the Steelers game this Sunday?" },
            { en: "Wooder", ja: "水（waterのフィリー発音）", example: "Can I get a glass of wooder? I'm dying of thirst." },
            { en: "Cheesesteak", ja: "フィリーチーズステーキ（薄切り肉+チーズ）", example: "Pat's or Geno's? Wrong answer either way -- the best cheesesteaks are somewhere else." },
            { en: "Hoagie", ja: "サブサンドイッチ（フィリーの呼び方）", example: "I'll take an Italian hoagie with everything, extra peppers." },
        ],
    },
    "Rhode Island": {
        vibe: "Tiny, Coastal, & Feisty",
        description: "America's smallest state with the biggest attitude per square mile. Rhode Island is clam chowder, sailing culture, mansions in Newport, and a local accent so thick outsiders need subtitles.",
        expressions: [
            { en: "Quahog", ja: "大きなハマグリ（ロードアイランドの名物）", example: "We dug up a bucket of quahogs at the beach for stuffies tonight." },
            { en: "Stuffies", ja: "詰め物をしたハマグリ料理", example: "Grandma's stuffies are the best -- she uses chourico sausage in hers." },
            { en: "Bubbler", ja: "水飲み場（drinking fountainとは言わない）", example: "Where's the bubbler? I need some water." },
            { en: "Cabinets", ja: "ミルクシェイク（ロードアイランドの呼び方）", example: "I'll take a coffee cabinet -- that's a coffee milkshake for you out-of-staters." },
            { en: "Down city", ja: "プロビデンス中心部", example: "Let's meet down city for dinner, there's a new Italian place on Federal Hill." },
        ],
    },
    "South Carolina": {
        vibe: "Palmetto, History, & Charm",
        description: "Where Charleston's antebellum architecture meets Myrtle Beach chaos. South Carolina is sweet tea, Spanish moss, Gullah culture, and a complicated but honest relationship with its own history.",
        expressions: [
            { en: "Lowcountry", ja: "サウスカロライナの海岸低地地域", example: "Lowcountry boil is shrimp, corn, sausage, and potatoes all in one pot." },
            { en: "Shag", ja: "サウスカロライナ生まれのダンス", example: "We learned to shag at the beach pavilion -- it's the state dance." },
            { en: "Frogmore stew", ja: "ローカントリーボイルの別名", example: "Some call it Lowcountry boil, old-timers call it Frogmore stew." },
            { en: "Palmetto", ja: "ヤシの木（州の象徴）", example: "The palmetto tree is on our flag, our license plate, and half our tattoos." },
            { en: "Grits", ja: "挽いたトウモロコシの粥（南部の主食）", example: "Shrimp and grits for breakfast is non-negotiable in Charleston." },
        ],
    },
    "South Dakota": {
        vibe: "Rushmore, Badlands, & Bison",
        description: "Home to Mount Rushmore and the Badlands' otherworldly landscapes. South Dakota is wide-open grasslands, Lakota heritage, the Sturgis motorcycle rally, and more bison than you can count.",
        expressions: [
            { en: "The Hills", ja: "ブラックヒルズ（南ダコタの象徴的な山地）", example: "We're camping in the Hills this weekend -- Custer State Park." },
            { en: "Wall Drug", ja: "有名な観光トラップの薬局・店", example: "You'll see Wall Drug signs for 500 miles before you actually get there." },
            { en: "Sturgis", ja: "世界最大のバイクラリー", example: "During Sturgis, there are more Harleys than people in this state." },
            { en: "Chislic", ja: "南ダコタ名物の串刺し揚げ肉", example: "Order the chislic at any bar in South Dakota -- cubed lamb or beef, deep fried." },
            { en: "Jackrabbit", ja: "南ダコタ州立大学のマスコット・州民のニックネーム", example: "Go Jackrabbits! SDSU is having a monster season." },
        ],
    },
    "Tennessee": {
        vibe: "Music, Whiskey, & Soul",
        description: "If music is America's gift to the world, Tennessee is the wrapping paper. Nashville's country, Memphis's blues and soul, Smoky Mountain moonshine, and a state that practically has its own soundtrack.",
        expressions: [
            { en: "Honky-tonk", ja: "カントリー音楽のライブバー", example: "Lower Broadway is wall-to-wall honky-tonks -- live music on every stage." },
            { en: "Meat and three", ja: "メインの肉+3つのおかずを選ぶ食堂スタイル", example: "Let's hit the meat and three for lunch -- I'm getting fried chicken with mac and cheese." },
            { en: "Hot chicken", ja: "ナッシュビル名物の激辛フライドチキン", example: "Nashville hot chicken will make you sweat and cry and immediately order more." },
            { en: "Ain't nothing", ja: "大したことない", example: "Broke my arm? Ain't nothing -- I've had worse." },
            { en: "Fixin's", ja: "おかず・付け合わせ", example: "The brisket comes with all the fixin's -- beans, slaw, cornbread." },
        ],
    },
    "Texas": {
        vibe: "Big, Bold, & Barbecue",
        description: "Everything's bigger in Texas, and Texans will remind you. From NASA to cattle ranches, oil rigs to breakfast tacos, the Lone Star State runs on brisket, pride, and an unshakable belief in its own greatness.",
        expressions: [
            { en: "Y'all", ja: "みんな・あなたたち", example: "Y'all comin' to the barbecue this weekend or what?" },
            { en: "Fixin' to", ja: "〜するところ", example: "I'm fixin' to head out to the store real quick." },
            { en: "All hat, no cattle", ja: "口だけで中身がない", example: "That new manager is all hat, no cattle -- talks big but delivers nothing." },
            { en: "Brisket", ja: "牛の胸肉の燻製（テキサスBBQの王道）", example: "We smoked this brisket for fourteen hours straight -- low and slow." },
            { en: "Taco Tuesday", ja: "火曜のタコス（テキサスでは真剣な行事）", example: "Breakfast tacos on Taco Tuesday -- that's not optional in this office." },
        ],
    },
    "Utah": {
        vibe: "Red Rock, Outdoors, & Faith",
        description: "Five national parks, the Bonneville Salt Flats, and the headquarters of the LDS Church. Utah is dramatic red rock landscapes and a unique cultural identity shaped by faith, powder skiing, and green Jell-O.",
        expressions: [
            { en: "The Greatest Snow on Earth", ja: "地上最高の雪（ユタのスローガン）", example: "Utah license plates say Greatest Snow on Earth and they're not exaggerating." },
            { en: "Fry sauce", ja: "ケチャップとマヨを混ぜたソース（ユタ名物）", example: "No fries are complete without fry sauce -- it's a Utah law, basically." },
            { en: "Ward", ja: "LDS教会の地区（ご近所コミュニティ）", example: "Everyone in the ward brought food when my mom had surgery." },
            { en: "Slickrock", ja: "滑らかな砂岩（マウンテンバイクの聖地）", example: "The Slickrock Trail in Moab is the best mountain biking on the planet." },
            { en: "Oh my heck", ja: "なんてこった（heckでhellを避ける）", example: "Oh my heck, did you see that sunset over the canyon?" },
        ],
    },
    "Vermont": {
        vibe: "Maple, Green, & Independent",
        description: "The Green Mountain State, where maple syrup is liquid gold and covered bridges dot the landscape. Vermont is farm-to-table before it was trendy, fierce independence, and leaves so colorful they look photoshopped.",
        expressions: [
            { en: "Sugaring", ja: "メープルシロップを作る作業・シーズン", example: "Sugaring season starts in March -- we tap about two hundred trees." },
            { en: "Creemee", ja: "ソフトクリーム（Vermont方言）", example: "Pull over, that stand has maple creemees -- best thing you'll ever taste." },
            { en: "Mud season", ja: "泥のシーズン（雪解けの春）", example: "Mud season turns every dirt road into a swamp -- four-wheel drive mandatory." },
            { en: "Flatlander", ja: "バーモント以外から来た人", example: "The flatlanders are buying up all the farmland for vacation homes." },
            { en: "The Kingdom", ja: "ノースイースト・キングダム（VT北東部）", example: "The Kingdom is the most beautiful and remote part of Vermont." },
        ],
    },
    "Virginia": {
        vibe: "History, Government, & Tradition",
        description: "The birthplace of American presidents and home of the Pentagon. Virginia is Jamestown, Civil War battlefields, and the DC suburbs where government workers commute through rolling horse country.",
        expressions: [
            { en: "NOVA", ja: "北バージニア（DC郊外・政府関係者が多い）", example: "NOVA traffic is a nightmare -- my thirty-mile commute takes ninety minutes." },
            { en: "The Commonwealth", ja: "バージニアの正式呼称（州ではなく）", example: "It's the Commonwealth of Virginia, technically -- not a state." },
            { en: "Virginia is for Lovers", ja: "バージニアの観光スローガン", example: "Virginia is for Lovers -- it's on every welcome sign at the border." },
            { en: "Beltway", ja: "DC周辺の環状高速道路", example: "Inside the Beltway, everyone talks politics like it's a sport." },
            { en: "Hampton Roads", ja: "バージニア南東部の都市圏", example: "Hampton Roads has the biggest naval base in the world." },
        ],
    },
    "Washington": {
        vibe: "Rain, Tech, & Coffee",
        description: "Where Starbucks, Microsoft, and Amazon all started -- fueled by coffee and perpetual drizzle. Washington State is the Pacific Northwest at its finest: evergreen forests, orca whales, and flannel as formal wear.",
        expressions: [
            { en: "The Mountain is out", ja: "レーニア山が見える（曇りが多いので特別）", example: "The Mountain is out today -- quick, take a picture before the clouds come back." },
            { en: "Spendy", ja: "値段が高い", example: "Seattle's gotten so spendy that a studio apartment costs two grand a month." },
            { en: "Sunbreak", ja: "雲の合間の晴れ間（天気予報用語）", example: "The forecast says a sunbreak this afternoon -- everyone will be outside." },
            { en: "Passive-aggressive", ja: "消極的攻撃性（シアトルの社交スタイルの冗談）", example: "Seattle freeze is real -- people are nice to your face but never follow through." },
            { en: "The Eastside", ja: "シアトル東側の郊外（ベルビューなど）", example: "All the tech money moved to the Eastside -- Bellevue is basically a new city." },
        ],
    },
    "West Virginia": {
        vibe: "Mountains, Coal, & Country Roads",
        description: "Almost heaven. West Virginia is Appalachian beauty, coal mining heritage, and John Denver's eternal anthem. Mountain people with deep roots, strong communities, and a stubbornness that outsiders mistake for simplicity.",
        expressions: [
            { en: "Holler", ja: "山あいの谷間・集落", example: "I grew up in a holler so deep we didn't get TV reception." },
            { en: "Country roads", ja: "田舎の道（ジョン・デンバーの歌で有名）", example: "Every West Virginian can sing Country Roads from memory -- it's our anthem." },
            { en: "Ramps", ja: "野生のネギ（春の珍味）", example: "Ramp season means every restaurant has ramp specials -- the smell is intense." },
            { en: "Pepperoni roll", ja: "ペパロニ入りのパン（WV名物）", example: "Pepperoni rolls were invented for coal miners who needed lunch they could carry." },
            { en: "Crick", ja: "小川（creekの方言発音）", example: "We used to swim in the crick every summer till mama found out about the snakes." },
        ],
    },
    "Wisconsin": {
        vibe: "Cheese, Beer, & Packers",
        description: "America's Dairyland, where cheese curds squeak, bratwurst sizzles, and Packers fans own their team -- literally. Wisconsin is German-Scandinavian heritage, frozen tundra football, and a dedication to dairy that borders on spiritual.",
        expressions: [
            { en: "Cheesehead", ja: "ウィスコンシン人（チーズ帽子をかぶるファン）", example: "Every Packers fan owns a cheesehead hat -- it's basically required." },
            { en: "Bubbler", ja: "水飲み場（drinking fountainとは言わない）", example: "Get a drink from the bubbler in the hallway." },
            { en: "Supper club", ja: "ウィスコンシン式のレストラン（ステーキ+ドリンク）", example: "Friday fish fry at the supper club is a Wisconsin tradition." },
            { en: "Ope", ja: "おっと（ぶつかりそうな時の口癖）", example: "Ope, sorry, let me just squeeze past ya real quick." },
            { en: "Brat", ja: "ブラートヴルスト（ドイツ風ソーセージ）", example: "Throw some brats on the grill -- can't tailgate without 'em." },
        ],
    },
    "Wyoming": {
        vibe: "Cowboy, Wild West, & Yellowstone",
        description: "The least populated state in the union and fiercely proud of it. Wyoming is Yellowstone's geysers, Grand Teton peaks, and real working cowboys. A place where your nearest neighbor might live thirty miles away.",
        expressions: [
            { en: "Buckaroo", ja: "カウボーイ（スペイン語vaquero由来）", example: "My granddad was a real buckaroo -- worked cattle his whole life." },
            { en: "Dude ranch", ja: "観光牧場（都会の人が西部体験をする場所）", example: "The dude ranch tourists are always fun -- watching them try to saddle a horse." },
            { en: "Wind", ja: "風（ワイオミングでは最も話題になる天気）", example: "The wind in Wyoming will knock you sideways -- sixty mph gusts are normal." },
            { en: "Range", ja: "放牧地・開けた草原", example: "Cattle on the range have the right of way -- if they're on the road, you wait." },
            { en: "Powder River", ja: "パウダーリバー（「行くぞ」の掛け声にも使う）", example: "Powder River, let 'er buck! That's how you start a rodeo in Wyoming." },
        ],
    },
    "District of Columbia": {
        vibe: "Power, Politics, & Monuments",
        description: "Not a state, but the seat of American power. DC is marble monuments, political intrigue, free Smithsonian museums, and a local culture -- go-go music, mumbo sauce, half-smokes -- that most tourists never discover.",
        expressions: [
            { en: "Inside the Beltway", ja: "ベルトウェイ内（政治圏の意味）", example: "Inside the Beltway, everyone talks about politics 24/7 -- there's no escape." },
            { en: "Mumbo sauce", ja: "DC名物の甘辛いソース", example: "Mumbo sauce on everything -- wings, fries, pizza, you name it." },
            { en: "Half-smoke", ja: "DC名物のスモークソーセージ", example: "You haven't done DC right until you've had a half-smoke from Ben's Chili Bowl." },
            { en: "The Mall", ja: "ナショナルモール（ショッピングモールではない）", example: "Let's walk the Mall -- the Lincoln Memorial is gorgeous at night." },
            { en: "Metro", ja: "DCの地下鉄", example: "Take the Metro, parking downtown costs more than my lunch." },
        ],
    },
    "Default": {
        vibe: "American Spirit",
        description: "A place in America with its own unique story, people, and culture. Every corner of this country has something to teach you about what it means to be American -- the good, the weird, and the delicious.",
        expressions: [
            { en: "Y'all", ja: "みんな・あなたたち（南部発、今や全国区）", example: "Y'all ready to go? We're gonna be late." },
            { en: "No worries", ja: "大丈夫・気にしないで", example: "You spilled your coffee? No worries, I'll grab some napkins." },
            { en: "For real", ja: "マジで・本当に", example: "For real, that was the best burger I've ever had." },
            { en: "My bad", ja: "ごめん・自分のせい", example: "My bad, I totally forgot to text you back." },
            { en: "Low-key", ja: "ちょっと・密かに・控えめに", example: "I'm low-key obsessed with that new show on Netflix." },
        ],
    },
};

export function getStateVibe(name: string): StateData {
    return STATE_DATA[name] || STATE_DATA["Default"];
}
