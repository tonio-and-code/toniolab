// Seed Day 039 (words 1900-1949) -- Feb 8
// Day 039: 初めての給料交渉（23歳、女）
// ALL sentences are SPOKEN DIALOGUE -- actual things people say out loud
// g-dropping, grammar breaking, fillers, real spoken English
// Characters: Maya(23F,protagonist), Jen(24F,work bestie), Brad(35M,manager), HR Karen(42F),
//   Dad(52M,construction worker), Mom(50F,teacher), Uncle Ray(48M,finance bro),
//   Tasha(23F,tech friend), Mike(27M,office gossip), Grandma Dotty(78F)

const DAY39_DATA = [
    {
        id: '3xLp3rPg', // sell a bill of goods
        speaker: "Jen",
        meaning: "騙す・嘘の情報を売りつける",
        sentence: "Girl, they totally sold you a bill of goods about that 'competitive salary.' If Brad thinks the package is so great, tell him to put his money where his mouth is and show you the actual numbers.",
        sentence_ja: "あんた、「競争力のある給与」って完全に騙されたよ。ブラッドがそんなに待遇がいいと思うなら、口先だけじゃなく実際の数字を見せてって言いなよ。",
        idiom: "put your money where your mouth is",
        idiom_meaning: "back up words with action / 口先だけでなく行動で示す"
    },
    {
        id: '3XUMDOwI', // ceasefire
        speaker: "Maya",
        sentence: "OK so me and Jen called a ceasefire on our lunch spot debate 'cause we got bigger problems -- I gotta figure out how to ask for a raise. Tasha keeps tellin' me to know my worth but like... how do you even do that?",
        sentence_ja: "ジェンとのランチスポット論争は休戦にした、もっと大事な問題があるから -- 昇給の頼み方を考えなきゃ。タシャが自分の価値を知れって言うんだけど...それってどうやるの？",
        idiom: "know your worth",
        idiom_meaning: "understand your own value / 自分の価値を知る"
    },
    {
        id: '3XvsJ1hy', // Big eats small
        speaker: "Uncle Ray",
        meaning: "大が小を食う・弱肉強食",
        sentence: "Listen kiddo, corporate world is simple -- big eats small. Nobody's gonna advocate for you so you gotta do it yourself. Remember, the squeaky wheel gets the grease. I'm tellin' ya.",
        sentence_ja: "いいか、企業の世界はシンプルだ -- 弱肉強食。誰もお前の代わりに主張してくれないから自分でやるんだ。声を上げる者が得をする、言ってるだろ。",
        idiom: "the squeaky wheel gets the grease",
        idiom_meaning: "those who complain get attention / 声を上げる者が得をする"
    },
    {
        id: '3xWrsYj1', // tears of vexation
        speaker: "Maya",
        meaning: "悔し涙",
        sentence: "I almost cried tears of vexation when I saw my paycheck after taxes. Jen's like 'stick to your guns and ask for more' but I'm literally terrified of confrontation, you don't even know.",
        sentence_ja: "税金引いた後の給料見て悔し涙出そうだった。ジェンが「ひるまずにもっと要求しな」って言うけど、私マジで対立が怖いの、ほんとに。",
        idiom: "stick to your guns",
        idiom_meaning: "maintain your position firmly / 自分の意見を貫く"
    },
    {
        id: '3XZaBkV4', // spin yarns
        speaker: "Mike",
        sentence: "Brad loves to spin yarns about how he 'worked his way up from nothin'' but dude, we all know his dad's a VP. Anyway, when you come to the table for your review, don't buy any of that bootstrap nonsense.",
        sentence_ja: "ブラッドは「何もないところから這い上がった」ってほら話するの好きだけど、お父さんがVPなの皆知ってるから。とにかく、面談の時あの自力成功ナンセンスには騙されないように。",
        idiom: "come to the table",
        idiom_meaning: "show up to negotiate / 交渉の場に臨む"
    },
    {
        id: '3y7vQmH3', // Rick Astley Rick Rolled
        speaker: "Tasha",
        meaning: "リックロール（ネットのいたずらで、リック・アストリーの曲に誘導される現象）",
        sentence: "Dude my coworker literally Rick Rolled the entire Slack channel durin' standup and nobody even got mad 'cause he's that likeable. But for real, you're leavin' money on the table if you don't negotiate. My starting offer went up 15K just 'cause I asked.",
        sentence_ja: "同僚がスタンドアップ中にSlackチャンネル全体をリックロールしたんだけど、好かれすぎてて誰も怒らなかった。でもマジで、交渉しないとお金みすみす逃すよ。私の初任給、頼んだだけで1万5千ドル上がったから。",
        idiom: "leave money on the table",
        idiom_meaning: "miss out on potential gains / みすみす金を逃す"
    },
    {
        id: '3y9eFuVL', // tannin
        speaker: "Maya",
        meaning: "タンニン（渋み成分）",
        sentence: "I'm drinkin' this super tannic red wine tryin' to calm my nerves before tomorrow. Tasha says I should play hardball but like... I get nervous orderin' at Starbucks. How am I supposed to negotiate a salary?",
        sentence_ja: "明日に備えてめっちゃタンニン強い赤ワイン飲んで神経落ち着けようとしてる。タシャが強気でいけって言うけど...スタバで注文するだけで緊張するのに。どうやって給料交渉すんの？",
        idiom: "play hardball",
        idiom_meaning: "negotiate aggressively / 強気で交渉する"
    },
    {
        id: '3yfvzVQz', // forge ahead
        speaker: "Jen",
        meaning: "前進する・突き進む",
        sentence: "Look, just forge ahead and ask. Yeah it's kinda a shot in the dark not knowin' what they'll say, but the worst thing that happens is they say no. And then? You start lookin' elsewhere. Simple.",
        sentence_ja: "いいから前に進んで聞きなよ。うん、何て言われるかわかんないから当てずっぽうだけど、最悪ノーって言われるだけ。それで？他を探し始める。シンプルでしょ。",
        idiom: "a shot in the dark",
        idiom_meaning: "a guess with little basis / 当てずっぽう"
    },
    {
        id: '3YH3aEfa', // wigwam
        speaker: "Dad",
        meaning: "ウィグワム（ネイティブアメリカンのドーム型住居）",
        sentence: "When I was your age I was livin' in somethin' that might as well've been a wigwam -- no heat, no AC, nothin'. But I could see the writing on the wall that the company wasn't gonna last, so I jumped to a union job.",
        sentence_ja: "お前の年の頃、ウィグワムみたいなとこに住んでた -- 暖房なし、エアコンなし、何もなし。でも会社がもたないって前兆は見えてたから、組合のある仕事に移った。",
        idiom: "the writing on the wall",
        idiom_meaning: "obvious signs of future trouble / 明らかな前兆・不吉な兆し"
    },
    {
        id: '3YK2N5g7', // head torch
        speaker: "Mike",
        meaning: "ヘッドライト・ヘッドランプ（頭につける懐中電灯）",
        sentence: "So Dave from accounting was wearin' a head torch at his desk 'cause the overhead light's been broken for weeks and IT won't fix it. But seriously Maya, get your ducks in a row before that meeting -- bring receipts, numbers, everything.",
        sentence_ja: "経理のデイブがデスクでヘッドライトつけてた、天井の照明が何週間も壊れたままでITが直さないから。でもマジでマヤ、ミーティング前にしっかり準備して -- 証拠、数字、全部持ってけ。",
        idiom: "get one's ducks in a row",
        idiom_meaning: "get organized and prepared / 準備を整える"
    },
    {
        id: '3YkzZN9r', // What's the win here?
        speaker: "Brad",
        meaning: "ここでの勝ちは何？・何がメリット？",
        sentence: "So Maya, what's the win here for both of us? I wanna make sure we're aligned on expectations goin' forward. And just my two cents -- your Q3 numbers were really solid. Let's talk about where you wanna grow.",
        sentence_ja: "で、マヤ、お互いにとっての勝ちは何？今後の期待値をすり合わせたいんだ。あと俺の意見だけど -- Q3の数字はかなり良かったよ。どこで成長したいか話そう。",
        idiom: "two cents",
        idiom_meaning: "one's opinion or input / 意見・私見"
    },
    {
        id: '3yQcJd7B', // lag behind
        speaker: "Maya",
        sentence: "My salary's laggin' behind literally everyone else on the team and I know it 'cause Mike told me. At the end of the day, I just want what's fair. Is that really too much to ask?",
        sentence_ja: "私の給料、チームの他の全員より遅れてるの知ってる、マイクが教えてくれたから。結局のところ、公平なものが欲しいだけ。それって贅沢なお願い？",
        idiom: "at the end of the day",
        idiom_meaning: "ultimately, when all is considered / 結局のところ"
    },
    {
        id: '3yY6PhLh', // fleece
        speaker: "Grandma Dotty",
        sentence: "Your grandfather wore the same fleece jacket for twenty years and never once asked for a raise. Sometimes you just take one for the team, sweetheart. That's what your generation doesn't understand.",
        sentence_ja: "おじいちゃんは同じフリースジャケットを20年着て、一度も昇給を頼まなかったのよ。チームのために我慢することもあるの。あなたたちの世代はそれがわからないのよ。",
        idiom: "take one for the team",
        idiom_meaning: "make a personal sacrifice for the group / チームのために犠牲になる"
    },
    {
        id: '3yYktAy5', // Madison Square Garden
        speaker: "Uncle Ray",
        sentence: "I once closed a deal courtside at Madison Square Garden -- swear to god. Hit it off with the guy next to me, turned out he was runnin' a hedge fund. Networking is everything, kid. EVERYTHING.",
        sentence_ja: "マディソン・スクエア・ガーデンのコートサイドで商談まとめたことあるんだ -- マジで。隣の人と意気投合して、ヘッジファンド経営してた。ネットワーキングが全て。全て。",
        idiom: "hit it off",
        idiom_meaning: "immediately get along well / 意気投合する"
    },
    {
        id: '3za_FRTB', // get caught
        speaker: "Mike",
        sentence: "Don't get caught comparin' salaries out loud -- HR absolutely hates that. But once you got a year under your belt, you totally have leverage. I'm just sayin'. Knowledge is power and all that.",
        sentence_ja: "給料の比較を大声でやるのバレないように -- HRはあれ大嫌いだから。でも1年の経験があれば完全にレバレッジあるよ。ただ言ってるだけ。知識は力ってやつ。",
        idiom: "under one's belt",
        idiom_meaning: "as part of one's experience / 経験として持っている"
    },
    {
        id: '3zbuuYrl', // lay low
        speaker: "Jen",
        meaning: "おとなしくする・身を潜める",
        sentence: "I'd lay low and NOT mention the salary thing at tonight's team dinner. But you should at least have a ballpark figure in mind for what you're gonna ask for. Don't go in there with no number, that's amateur hour.",
        sentence_ja: "今夜のチームディナーでは給料の話はおとなしくしときな。でも最低限、いくら要求するかのざっくりした数字は頭に入れときなよ。数字なしで行くのは素人だから。",
        idiom: "a ballpark figure",
        idiom_meaning: "a rough estimate / おおよその数字"
    },
    {
        id: '3ZfVLKtY', // with one's tail between one's legs
        speaker: "Maya",
        meaning: "しっぽを巻いて・すごすごと退散する",
        sentence: "If I walk outta that meeting with my tail between my legs and no raise, I'm gonna be SO bummed. I need somethin' that actually moves the needle, you know? Even like 5% would help so much right now.",
        sentence_ja: "もしミーティングからしっぽ巻いて出てきて昇給なしだったら、めっちゃ凹む。本当に変化をもたらすものが必要なの。5%でも今はすごく助かる。",
        idiom: "move the needle",
        idiom_meaning: "make a noticeable difference / 変化をもたらす"
    },
    {
        id: '3zGk5T4d', // brochette
        speaker: "Mom",
        meaning: "串焼き・ブロシェット",
        sentence: "I made your favorite chicken brochettes for dinner -- you need brain food before your big day! And honey, start with the low-hanging fruit in your meeting. Lead with your project wins, those are easy points.",
        sentence_ja: "あなたの好きなチキンのブロシェット作ったわよ -- 大事な日の前に脳の栄養が必要でしょ！あとね、ミーティングでは簡単なところから始めなさい。プロジェクトの成果から入って。",
        idiom: "low-hanging fruit",
        idiom_meaning: "easy wins, simple targets / 簡単に手に入る成果"
    },
    {
        id: '3ZHW4K4J', // Don't make waves
        speaker: "Dad",
        sentence: "Don't make waves, Maya. I've seen guys get let go for bein' too pushy about money. The bottom line is, you got a job with benefits and that's more than a lotta people got right now.",
        sentence_ja: "波風立てるな、マヤ。金のことでしつこくして首になったやつ何人も見てきた。結論として、福利厚生付きの仕事があるだけで、今の世の中それだけで恵まれてる。",
        idiom: "the bottom line",
        idiom_meaning: "the final result, what matters most / 最終結果・結論"
    },
    {
        id: '3zHwKCWK', // salutation
        speaker: "Maya",
        sentence: "I've rewritten the salutation on my email to Brad like fifteen times. 'Hi Brad,' 'Hey Brad,' 'Dear Brad' -- oh my god just pick one. Jen literally grabbed my phone and hit send. 'Get the show on the road, girl.'",
        sentence_ja: "ブラッドへのメールの挨拶部分を15回くらい書き直した。「Hi Brad」「Hey Brad」「Dear Brad」-- もう一つ選びなよ。ジェンが私の携帯奪って送信ボタン押した。「さっさと始めなよ」って。",
        idiom: "get the show on the road",
        idiom_meaning: "get started, begin / さっさと始める"
    },
    {
        id: '3zrDluPY', // predispose
        speaker: "HR Karen",
        meaning: "～しやすくする・素因となる",
        sentence: "Your performance reviews predispose us to consider a merit increase. In a nutshell, we have a structured process for comp adjustments and your timing is actually pretty good. Let me pull up your file.",
        sentence_ja: "あなたの人事評価から、昇給を検討する素地はあります。要するに、報酬調整には体系的なプロセスがあって、タイミングはかなりいいです。ファイルを出しますね。",
        idiom: "in a nutshell",
        idiom_meaning: "in brief, summarized / 要するに・一言で言えば"
    },
    {
        id: '3ztLbcnA', // consecutive
        speaker: "Maya",
        meaning: "連続した",
        sentence: "I've hit my targets three consecutive quarters in a row and I'm STILL barely makin' ends meet in this city. Rent went up $200 last month. Somethin's gotta give, seriously.",
        sentence_ja: "3四半期連続で目標達成してるのに、まだこの街でやりくりするのがギリギリ。先月家賃が200ドル上がった。マジで何とかしないと。",
        idiom: "make ends meet",
        idiom_meaning: "manage to pay all bills / やりくりする・生活をまかなう"
    },
    {
        id: '3zZ1NruW', // roll over
        speaker: "Uncle Ray",
        meaning: "繰り越す・（言いなりに）屈服する",
        sentence: "Don't just roll over and accept whatever they throw at you first! That's exactly what they're expectin'. And quit penny-pinching on your coffee -- invest in yourself, go to that negotiation workshop I sent you.",
        sentence_ja: "最初に出されたものにすぐ屈服するなよ！向こうはそれを期待してんだから。あとコーヒーでケチケチするのやめろ -- 自分に投資しろ、送った交渉ワークショップに行け。",
        idiom: "penny-pinching",
        idiom_meaning: "being excessively frugal / ケチケチする・細かく節約する"
    },
    {
        id: '3ZzXQWae', // anaerobically
        speaker: "Tasha",
        meaning: "嫌気的に・酸素なしで",
        sentence: "OK random but my gym trainer was explainin' how muscles grow anaerobically and I was like huh, cool. Anyway here's some food for thought -- the gender pay gap ain't gonna close itself. You gotta fight for every dollar, girl.",
        sentence_ja: "OK 全然関係ないけどジムのトレーナーが筋肉が嫌気的に成長するって説明してて、へーって。とにかく考える材料をあげると -- 男女の賃金格差は勝手に縮まらないから。1ドルずつ戦わないと。",
        idiom: "food for thought",
        idiom_meaning: "something worth thinking about / 考える材料・一考の価値あり"
    },
    {
        id: '4_0IMl8m', // hairpin turn
        speaker: "Maya",
        meaning: "ヘアピンカーブ・急カーブ（急な方向転換）",
        sentence: "The conversation took a total hairpin turn when Brad randomly asked about my five-year plan. Like sir, I barely have a five-MINUTE plan. This job is honestly a blessing and a curse -- love the work, hate the pay.",
        sentence_ja: "ブラッドがいきなり5年計画を聞いてきて、会話が急カーブした。いや、5分の計画もないんですけど。この仕事、正直いいとこもあり悪いとこもあり -- 仕事は好き、給料は嫌い。",
        idiom: "a blessing and a curse",
        idiom_meaning: "has both good and bad aspects / 良くも悪くもある・一長一短"
    },
    {
        id: '4_x4BP7Q', // once bitten twice shy
        speaker: "Jen",
        meaning: "一度噛まれたら二度目は用心する",
        sentence: "I know you're once bitten twice shy after that internship disaster where they ghosted you, but you gotta throw your hat in the ring anyway. Worst case they say no, and you're right where you started. No harm done.",
        sentence_ja: "あのインターンで音信不通にされた後、怖いのはわかる。でも挑戦しないと。最悪ノーって言われるだけで、元の場所に戻るだけ。何も失わないよ。",
        idiom: "throw one's hat in the ring",
        idiom_meaning: "enter a competition or challenge / 名乗りを上げる・挑戦する"
    },
    {
        id: '4_yHh0QT', // Reich
        speaker: "Mike",
        sentence: "So I fell down this Wikipedia rabbit hole about the Third Reich last night and apparently hyperinflation was so bad that money was literally burning a hole in everyone's pocket 'cause it lost value by the hour. Absolutely wild stuff.",
        sentence_ja: "昨夜ウィキペディアで第三帝国の記事にハマって、ハイパーインフレがやばくて、お金が1時間ごとに価値失うから使わずにはいられなかったらしい。マジでヤバい話。",
        idiom: "burning a hole in one's pocket",
        idiom_meaning: "eager to spend money / お金が使いたくてたまらない"
    },
    {
        id: '4-Msn-tH', // Cordyceps militaris
        speaker: "Tasha",
        meaning: "サナギタケ（冬虫夏草の一種、エネルギーサプリとして人気）",
        sentence: "I started takin' Cordyceps militaris supplements for energy and honestly? I feel like a completely new person at work. But supplements aren't cheap -- another reason you gotta start bringin' home more bacon. Negotiate that raise.",
        sentence_ja: "サナギタケのサプリ飲み始めたんだけど、正直？仕事で完全に別人みたい。でもサプリ高いから -- もっと稼がないといけないもう一つの理由。昇給交渉しなよ。",
        idiom: "bring home the bacon",
        idiom_meaning: "earn a living, make money / 生活費を稼ぐ"
    },
    {
        id: '401JkV4F', // Those who fail to learn from the past...
        speaker: "Grandma Dotty",
        meaning: "歴史から学ばぬ者は同じ過ちを繰り返す運命にある",
        sentence: "Those who fail to learn from the past are doomed to repeat it -- your grandfather said that every single Thanksgiving dinner. He never even broke even on his little hardware store, bless his heart, but he was the wisest man I ever knew.",
        sentence_ja: "歴史から学ばない者は繰り返す運命にある -- おじいちゃんが毎年の感謝祭で言ってたわ。あの小さな金物店は損益分岐点にすら達しなかったけど、今まで会った中で一番賢い人だった。",
        idiom: "break even",
        idiom_meaning: "neither profit nor loss / 損益分岐点に達する・とんとんになる"
    },
    {
        id: '406Ey9pg', // PG
        speaker: "Mom",
        sentence: "When I was in college I was a PG at this sweet old lady's house -- barely paid anything for rent, it was so nice. But honey, your situation is the real deal now. Adult bills, adult problems. I understand why you need that raise.",
        sentence_ja: "大学時代、優しいおばあちゃんの家に下宿してて -- 家賃ほとんどかからなくて最高だった。でもあなたの今は本番なのよ。大人の請求書、大人の問題。昇給が必要な理由はわかってるわ。",
        idiom: "the real deal",
        idiom_meaning: "the genuine thing, serious / 本物・本番"
    },
    {
        id: '40LRve31', // hunger pangs
        speaker: "Maya",
        sentence: "Skipped lunch 'cause of nerves and now these hunger pangs are absolutely killin' me. It's such a tough pill to swallow that I've been here a whole YEAR and I'm still the lowest paid person on my team.",
        sentence_ja: "緊張でランチ抜いたから空腹がマジでやばい。丸1年いるのにチームで一番給料低いって、受け入れがたすぎる。",
        idiom: "a tough pill to swallow",
        idiom_meaning: "something hard to accept / 受け入れがたいこと"
    },
    {
        id: '40p7wCrq', // Fajita
        speaker: "Jen",
        meaning: "ファヒータ（メキシコ料理・焼いた肉と野菜をトルティーヤで巻く）",
        sentence: "OK before you go into that meeting tomorrow, let's grab fajitas tonight and you can get everything off your chest. You've been stressin' for weeks and I can literally see the bags under your eyes, babe.",
        sentence_ja: "明日のミーティング前に、今夜ファヒータ食べながら溜め込んでること全部吐き出しなよ。何週間もストレスためてて、目の下のクマが見えてるから。",
        idiom: "get something off one's chest",
        idiom_meaning: "express what's been bothering you / 胸のつかえを下ろす"
    },
    {
        id: '41_8dQIT', // hound
        speaker: "Maya",
        meaning: "猟犬・しつこく追い回す",
        sentence: "Tasha's been houndin' me ALL week about askin' for a raise. She's such a go-getter -- literally negotiated her offer before day one and got extra PTO. Meanwhile I can't even hit send on a stupid email.",
        sentence_ja: "タシャが1週間ずっと昇給を頼めってしつこい。あの子は本当にやり手 -- 初日前にオファーを交渉して追加休暇もゲットした。一方私はメールの送信ボタンすら押せない。",
        idiom: "go-getter",
        idiom_meaning: "an ambitious, driven person / やり手・頑張り屋"
    },
    {
        id: '41bFXyqK', // take the mickey out of people
        speaker: "Mike",
        meaning: "人をからかう・馬鹿にする",
        sentence: "Brad loves takin' the mickey out of people at team meetings but honestly he's not a terrible boss. Just make sure your raise request doesn't fall through the cracks -- always follow up in writing. Trust me on this one.",
        sentence_ja: "ブラッドはチームミーティングで人をからかうの好きだけど、正直そこまで悪い上司じゃない。ただ昇給リクエストが見落とされないように -- 必ず書面でフォローアップして。これは信じて。",
        idiom: "fall through the cracks",
        idiom_meaning: "be overlooked or missed / 見落とされる・抜け落ちる"
    },
    {
        id: '41BitOeS', // bullshit
        speaker: "Jen",
        meaning: "でたらめ・嘘・くだらない",
        sentence: "That 'we don't have budget right now' line is total bullshit -- they literally just hired three new people last month. Time to put your foot down, babe. You deserve better and you KNOW it.",
        sentence_ja: "「今予算がない」って完全にでたらめ -- 先月新しく3人も雇ったじゃん。断固とした態度取る時だよ。もっといい待遇受ける価値があるのあんたもわかってるでしょ。",
        idiom: "put one's foot down",
        idiom_meaning: "be firm and assertive / 断固とした態度を取る"
    },
    {
        id: '42BGNfcT', // The Four Horsemen of the Apocalypse
        speaker: "Uncle Ray",
        meaning: "黙示録の四騎士（破滅の象徴）",
        sentence: "Debt, taxes, rent, and student loans -- the Four Horsemen of the Apocalypse for your generation, am I right? Just don't bite off more than you can chew with lifestyle creep if you DO get that raise, OK? I've seen it happen.",
        sentence_ja: "借金、税金、家賃、学生ローン -- お前の世代の黙示録の四騎士だろ？もし昇給したら、生活水準の上昇で身の丈以上のことすんなよ？それで失敗したやつ見てきたから。",
        idiom: "bite off more than one can chew",
        idiom_meaning: "take on more than you can handle / 手に余ることに手を出す"
    },
    {
        id: '42CIxOBC', // drive-by attack
        speaker: "Jen",
        meaning: "通りすがりの攻撃・不意打ち",
        sentence: "Brad just did a total drive-by attack on my desk -- dropped off extra work and literally bounced before I could even say no. But if you play your cards right in that meeting, use the extra workload as leverage.",
        sentence_ja: "ブラッドがデスクに通りすがり攻撃してきた -- 追加の仕事置いてノーって言う前に消えた。でもミーティングでうまく立ち回れば、その追加業務をレバレッジにできるよ。",
        idiom: "play one's cards right",
        idiom_meaning: "act strategically / うまく立ち回る"
    },
    {
        id: '42f-pQCl', // au pair
        speaker: "Mom",
        sentence: "My friend's daughter worked as an au pair in Paris for a year and made practically nothin'. Don't end up like that, sweetie. We're already payin' through the nose for your student loans -- you really need a proper salary.",
        sentence_ja: "友達の娘さんがパリでオペアを1年やって、ほとんど稼げなかったの。そうならないでね。学生ローンでもう法外な額払ってるんだから -- ちゃんとした給料が必要よ。",
        idiom: "pay through the nose",
        idiom_meaning: "pay an excessive price / 法外な金を払う"
    },
    {
        id: '42iaXv-y', // I beam
        speaker: "Dad",
        meaning: "I型鋼（建設用の鉄骨）",
        sentence: "I been carryin' I beams on construction sites for thirty years and never once negotiated my pay. But that loyalty thing, it's a double-edged sword -- they respect you but they'll also underpay you forever if you let 'em.",
        sentence_ja: "30年間建設現場でI型鋼運んできて一度も給料交渉しなかった。でも忠誠心ってのは両刃の剣 -- 尊敬されるけど、許せば一生安く使われる。",
        idiom: "a double-edged sword",
        idiom_meaning: "something with both advantages and disadvantages / 両刃の剣"
    },
    {
        id: '42SdkrkH', // heed
        speaker: "Grandma Dotty",
        sentence: "Heed my words, dear -- when your grandfather started at the factory, he made twelve cents an hour and was grateful. But each generation should raise the bar a little higher. I'm proud of you for speakin' up.",
        sentence_ja: "よく聞きなさい -- おじいちゃんが工場で働き始めた時、時給12セントで感謝してた。でも各世代が少しずつ基準を上げるべきなの。声を上げてること、誇りに思うわ。",
        idiom: "raise the bar",
        idiom_meaning: "set a higher standard / 基準を上げる"
    },
    {
        id: '42YC_jcc', // tidal wave
        speaker: "Maya",
        sentence: "I get this tidal wave of anxiety every time I think about that meeting. Maybe I should test the waters first? Like casually mention to Brad that I've been gettin' recruiter DMs on LinkedIn. That's not too aggressive, right?",
        sentence_ja: "あのミーティングのこと考えるたびに不安の大波が来る。まず様子見た方がいいかな？LinkedInでリクルーターからDM来てるってブラッドにさりげなく言うとか。攻撃的すぎない、よね？",
        idiom: "test the waters",
        idiom_meaning: "cautiously try something / 様子を見る・探りを入れる"
    },
    {
        id: '43O9xl4n', // influx
        speaker: "HR Karen",
        sentence: "We've had quite an influx of compensation review requests this quarter, so you're not alone. Let me get to the bottom of your specific situation and I'll circle back by Friday with concrete numbers for you.",
        sentence_ja: "今期は報酬見直しリクエストが殺到してるので、あなただけじゃないですよ。あなたの具体的な状況を詳しく調べて、金曜までに具体的な数字をお伝えします。",
        idiom: "get to the bottom of",
        idiom_meaning: "investigate thoroughly / 真相を突き止める・詳しく調べる"
    },
    {
        id: '43PCbyX-', // We are now gods, but for the wisdom.
        speaker: "Tasha",
        meaning: "我々は今や神のような力を持つが、知恵だけが足りない",
        sentence: "My philosophy prof used to say 'we are now gods, but for the wisdom' and I think about that a lot. Anyway girl, your pay stub should be a serious wake-up call. You're doin' senior-level work for junior-level pay.",
        sentence_ja: "哲学の教授が「我々は神になったが知恵だけが足りない」ってよく言ってて、結構考えるんだよね。てかマヤ、給与明細は本気で目覚ましになるべきだよ。シニアの仕事をジュニアの給料でやってんだから。",
        idiom: "a wake-up call",
        idiom_meaning: "an event that alerts you to change / 目覚ましの一撃・警告"
    },
    {
        id: '43SfYhPn', // bay leaf
        speaker: "Mom",
        sentence: "I'm puttin' a bay leaf in the soup for good luck before your big meeting tomorrow. And remember, you pull your weight at that office -- more than most people from what you tell me. Don't sell yourself short, honey.",
        sentence_ja: "明日の大事なミーティングの前に、幸運のためにスープにローリエ入れてるわ。忘れないで、あなたはあのオフィスで自分の役割をしっかり果たしてる。自分を安売りしないで。",
        idiom: "pull one's weight",
        idiom_meaning: "do one's fair share of work / 自分の役割を果たす"
    },
    {
        id: '44bWoTbl', // stumble
        speaker: "Maya",
        sentence: "I stumbled over my words SO bad durin' the practice run with Jen. She's like 'you gotta turn the tables -- make THEM sell the job to YOU, not the other way around.' Easier said than done when you're shakin'.",
        sentence_ja: "ジェンとの練習で言葉がめっちゃつっかえた。「形勢を逆転させて -- 向こうにこの仕事を売り込ませなよ、逆じゃなくて」って。震えてる時は言うのは簡単だけどね。",
        idiom: "turn the tables",
        idiom_meaning: "reverse the situation / 形勢を逆転させる"
    },
    {
        id: '44el6bon', // abject
        speaker: "Jen",
        meaning: "惨めな・悲惨な・絶対的な",
        sentence: "You're sittin' there in abject misery over this and for what? You basically cornered the market on social media analytics at this company -- literally nobody else knows how to do what you do. USE that.",
        sentence_ja: "そこで惨めに座って何の意味があんの？あんたこの会社でSNS分析の市場を独占してるんだよ -- あんたにしかできないことがある。それを使いなよ。",
        idiom: "corner the market",
        idiom_meaning: "dominate a particular area / 市場を独占する"
    },
    {
        id: '44IrYgdL', // textbook racket
        speaker: "Tasha",
        meaning: "教科書のぼったくり商法",
        sentence: "College textbooks were such a textbook racket, right? $300 for a book you crack open once. But at least companies can't cut corners on your salary forever. The market's gonna catch up and they know it.",
        sentence_ja: "大学の教科書って完全にぼったくり商法だったよね？一度しか開かない本に300ドル。でも少なくとも会社は永遠に給料をケチれないから。市場が追いつくし、向こうもわかってる。",
        idiom: "cut corners",
        idiom_meaning: "do something cheaply or poorly / 手抜きをする・ケチる"
    },
    {
        id: '44Ryxago', // blabbermouth
        speaker: "Maya",
        sentence: "Mike's a total blabbermouth but honestly? That's super useful right now. I'm gonna pick his brain about what everyone else in my role is makin' and bring those numbers to my meeting. Is that shady? Don't care.",
        sentence_ja: "マイクは完全におしゃべりだけど正直？今はめっちゃ役に立つ。同じ職種の人がいくらもらってるか聞き出して、その数字をミーティングに持ってく。ずるい？気にしない。",
        idiom: "pick someone's brain",
        idiom_meaning: "get information from someone / 知恵を借りる・聞き出す"
    },
    {
        id: '44YW90ZI', // You've fought the good fight...
        speaker: "Dad",
        meaning: "よく戦い抜いた・善い戦いを戦った",
        sentence: "You've fought the good fight just gettin' through college and landing this job, kiddo. I might not know nothin' about salary negotiation but I got skin in the game here -- I want my daughter to do better than me.",
        sentence_ja: "大学出てこの仕事に就いただけで、もう十分頑張った。給料交渉のことは何もわからんけど、俺もこの件には利害関係がある -- 娘に俺よりいい人生を送って欲しいんだ。",
        idiom: "have skin in the game",
        idiom_meaning: "have personal stake in the outcome / 利害関係がある"
    },
    {
        id: '44z4EUP3', // writhe in pain
        speaker: "Maya",
        meaning: "痛みでのたうち回る",
        sentence: "My stomach was literally writhin' in pain the whole meeting from nerves. But you know what? I rose to the occasion and said my number out loud. Brad didn't even flinch. Honestly... maybe I should've asked for more.",
        sentence_ja: "緊張でミーティング中ずっとお腹が痛みでのたうち回ってた。でもね？奮起して希望額を声に出して言った。ブラッドは微動だにしなかった。正直...もっと要求すればよかったかも。",
        idiom: "rise to the occasion",
        idiom_meaning: "perform well under pressure / 奮起する・期待に応える"
    },
];

async function seedDay39() {
    console.log('Seeding Day 039 -- First Salary Negotiation (23F)...\n');
    let success = 0;
    let failed = 0;
    let meaningFixed = 0;

    for (const item of DAY39_DATA) {
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

seedDay39();
