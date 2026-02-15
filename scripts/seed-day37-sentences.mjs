// Seed Day 037 (words 1800-1849) -- Feb 6
// Day 037: ベビーシャワー（30歳、女）
// Mixed perspectives: Rachel(30F,pregnant), Dave(32M,husband), Mia(29F,best friend), Mom(55F), Mother-in-law(58F), Kate(33F,sister), Jess(26F,sister), Priya(31F), Sarah(28F,coworker), Dad(58M)

const DAY37_DATA = [
    {
        id: '3it3SL26', // clade
        sentence: "So my sister's going off about how our family's basically a clade of tall people and she's like 'this baby is DEFINITELY gonna be tall.' She totally had a change of heart about the name though -- was Team 'Oliver' all week and now she's pushing 'Leo.'",
        sentence_ja: "姉が「うちの家族は基本的に背が高い系統（クレード）だから、この赤ちゃんも絶対背が高くなる」って熱弁してて。でも名前については完全に気が変わったみたい -- 一週間ずっと「オリバー派」だったのに、今は「レオ」を推してる。",
        idiom: "have a change of heart",
        idiom_meaning: "change one's mind / 気持ちが変わる"
    },
    {
        id: '3IUNbb4X', // that'll do
        sentence: "I put out like fifteen different dips for the baby shower and Dave's like 'that'll do, babe.' Sir I am NOT done. There's still a charcuterie board in the fridge. He was working behind the scenes on the diaper cake though so I'll give him credit.",
        sentence_ja: "ベビーシャワーに15種類くらいのディップを出したらデイヴが「もう十分だよ」って。いやまだ終わってないし。冷蔵庫にシャルキュトリーボードがまだあるんだけど。でも彼は裏でおむつケーキ作ってたから、そこは認めてあげる。",
        idiom: "behind the scenes",
        idiom_meaning: "out of public view / 裏方で・陰で支える"
    },
    {
        id: '3iWY-iZW', // pendulum
        sentence: "My emotions are swinging like a pendulum today -- one second I'm sobbing over a tiny onesie, next second I'm panicking about the nursery not being ready. Everyone says just roll with the punches but I'm literally 8 months pregnant, I can't roll anywhere.",
        sentence_ja: "今日の感情が振り子みたいに揺れてて -- 小さいロンパース見て泣いたかと思えば、次の瞬間には子供部屋がまだできてないことでパニック。みんな「うまくやり過ごしなよ」って言うけど、妊娠8ヶ月でどこにも転がれないんですけど。",
        idiom: "roll with the punches",
        idiom_meaning: "deal with difficulties as they come / 困難にうまく対処する"
    },
    {
        id: '3j-EyNi8', // first period
        sentence: "Mia was like 'remember when you used to stress about making it to first period on time? Now you're stressing about a baby registry.' She left no stone unturned planning this shower -- even found matching napkins at the dollar store.",
        sentence_ja: "ミアが「1時間目に間に合うかどうかで焦ってた頃覚えてる？今はベビー用品リストで焦ってるんだね」って。シャワーの準備は徹底的にやってくれて -- 100均でお揃いのナプキンまで見つけてきた。",
        idiom: "leave no stone unturned",
        idiom_meaning: "try everything possible / 徹底的にやる"
    },
    {
        id: '3j6UORlO', // flying saucer
        sentence: "One of the shower games was tossing paper plates like flying saucers into a crib across the yard. It was so dumb but everyone loved it. Kate suggested it totally out of the blue and it ended up being the biggest hit.",
        sentence_ja: "シャワーのゲームの一つが、紙皿を空飛ぶ円盤みたいに庭の向こうのベビーベッドに投げ入れるやつ。めっちゃくだらないけどみんな大盛り上がり。ケイトが突然提案したんだけど、結局一番のヒットになった。",
        idiom: "out of the blue",
        idiom_meaning: "unexpectedly / 突然・予想外に"
    },
    {
        id: '3JFa7dNs', // click the tongue
        sentence: "My mother-in-law literally clicked her tongue when she saw we hadn't set up the changing table yet. I'm like ma'am the baby isn't here yet, relax. But honestly her nagging was a blessing in disguise 'cause Dave finally started assembling it.",
        sentence_ja: "義母がおむつ替え台をまだ設置してないのを見て舌打ちした。まだ赤ちゃん生まれてないですけど、落ち着いて。でも正直、彼女の小言は不幸中の幸いで、デイヴがやっと組み立て始めたから。",
        idiom: "a blessing in disguise",
        idiom_meaning: "something bad that turns out good / 不幸に見えて実は良いこと"
    },
    {
        id: '3jku5k8M', // a bone to pick
        sentence: "OK so I have a bone to pick with whoever bought the stroller without checking the registry first -- now we have TWO. Don't add fuel to the fire by telling me the receipt's gone. I will literally cry.",
        sentence_ja: "ちょっと、レジストリ確認せずにベビーカー買った人に文句があるんだけど -- 2台になっちゃったじゃん。レシートなくなったとか言って火に油を注がないで。マジで泣くから。",
        idiom: "add fuel to the fire",
        idiom_meaning: "make a bad situation worse / 火に油を注ぐ"
    },
    {
        id: '3JlYBsSo', // hogtied
        sentence: "Dave tried wrapping a gift and basically hogtied the ribbon around the box like some kind of hostage situation. I'm all ears if anyone has tips for teaching husbands how to wrap presents 'cause this man is hopeless.",
        sentence_ja: "デイヴがプレゼント包もうとして、リボンを箱にぐるぐる巻きにして人質事件みたいになってた。旦那にプレゼントの包み方教えるコツがあるなら何でも聞くよ、この人もうダメだから。",
        idiom: "all ears",
        idiom_meaning: "listening attentively / 聞く準備万端・よく聞いてるよ"
    },
    {
        id: '3jPmAKNk', // sit on
        sentence: "I sit on the neighborhood HOA board and I swear if one more person complains about our baby shower parking situation I'm going back to the drawing board and canceling the whole outdoor setup.",
        sentence_ja: "近所のHOA（管理組合）の理事やってるんだけど、ベビーシャワーの駐車問題にもう一人でも文句言ったら一からやり直して屋外セットアップ全部キャンセルする。",
        idiom: "back to the drawing board",
        idiom_meaning: "start over / やり直し・一から出直し"
    },
    {
        id: '3JSe6Ue2', // Purple Heart
        sentence: "My grandpa keeps saying I deserve a Purple Heart for surviving this pregnancy. He bent over backwards to get here from Florida for the shower -- drove twelve hours 'cause he refuses to fly.",
        sentence_ja: "おじいちゃんが「この妊娠を乗り越えたんだからパープルハート勲章ものだ」ってずっと言ってる。シャワーのためにフロリダから全力で来てくれた -- 飛行機嫌いだから12時間運転して。",
        idiom: "bend over backwards",
        idiom_meaning: "try very hard to help / 全力を尽くす・無理をしてでもやる"
    },
    {
        id: '3JSuGdu8', // starlet
        sentence: "Priya showed up to the shower looking like a total starlet in this gorgeous white dress and I'm over here in stretchy pants looking like a watermelon. She'd never burn bridges with anyone though -- brought the most beautiful bassinet as a gift.",
        sentence_ja: "プリヤがゴージャスな白いドレスで完全にスターレットみたいに登場して、私はストレッチパンツでスイカみたいな格好。でも彼女は誰とも関係を壊さない人で、めちゃくちゃ綺麗なバシネットをプレゼントに持ってきた。",
        idiom: "burn bridges",
        idiom_meaning: "destroy relationships / 関係を断つ・後戻りできなくする"
    },
    {
        id: '3K__7QOM', // damp squib
        sentence: "The confetti popper thing was a total damp squib -- wouldn't go off and Dave had to manually rip it open. We made it work by the skin of our teeth before the pink confetti landed in the punch bowl.",
        sentence_ja: "クラッカーが完全に不発で、デイヴが手で破かなきゃいけなかった。ギリギリのところでなんとかなったけど、ピンクの紙吹雪がパンチボウルに落ちちゃった。",
        idiom: "by the skin of one's teeth",
        idiom_meaning: "barely / ギリギリで・辛うじて"
    },
    {
        id: '3KLIBid-', // fodder
        sentence: "Honestly everything at this shower is fodder for Instagram. The balloon arch, the food spread, the diaper cake. Mia's aesthetic totally caught me off guard -- I did NOT expect it to look this professional.",
        sentence_ja: "正直このシャワーの全てがインスタのネタになる。バルーンアーチ、料理、おむつケーキ。ミアのセンスに完全に不意を突かれた -- こんなプロっぽくなるとは思ってなかった。",
        idiom: "catch someone off guard",
        idiom_meaning: "surprise someone / 不意を突く"
    },
    {
        id: '3kO4TZ6n', // mistress
        sentence: "My grandma used to be the mistress of ceremonies at every family event and now she's passing the torch. She says this baby's gonna be a real chip off the old block if she takes after our side.",
        sentence_ja: "おばあちゃんは昔、家族のイベントでいつも司会をしてたけど、今はバトンを渡してる。この赤ちゃんがうちの家系に似たら「まさに親の生き写しだ」って言ってる。",
        idiom: "chip off the old block",
        idiom_meaning: "similar to one's parent / 親にそっくり"
    },
    {
        id: '3KRMf7H8', // well hung
        sentence: "The 'Welcome Baby' banner was NOT well hung -- it fell down three times during the shower. Dave and I needed to clear the air about whose job decorations were 'cause I'm getting blamed and it was HIS task.",
        sentence_ja: "「Welcome Baby」のバナーがちゃんと掛けられてなくて、シャワー中に3回落ちた。デコレーションは誰の担当だったか誤解を解く必要があった。私のせいにされてるけど、彼の仕事だったんですけど。",
        idiom: "clear the air",
        idiom_meaning: "resolve misunderstandings / 誤解を解く・わだかまりを消す"
    },
    {
        id: '3KUbv0oP', // funfair
        sentence: "Mia turned the backyard into basically a funfair with all these silly shower games. My aunt was already counting her chickens before they hatch, bragging she'd win the 'guess the baby weight' game. Ma'am the baby is not born yet.",
        sentence_ja: "ミアが裏庭をバカバカしいシャワーゲームで遊園地みたいにしちゃった。おばさんはもう「取らぬ狸の皮算用」で、赤ちゃんの体重当てゲームに勝つって自慢してた。あの、まだ生まれてないんですけど。",
        idiom: "count one's chickens before they hatch",
        idiom_meaning: "assume success too early / 取らぬ狸の皮算用"
    },
    {
        id: '3l2ljWA6', // Portobello
        sentence: "The caterer made these stuffed Portobello mushroom things and Jess couldn't eat hers and spilled the whole plate. No use crying over spilled milk though -- there were like twenty other dishes on the countertop.",
        sentence_ja: "ケータリングがポルトベッロマッシュルームの詰め物を作ってくれたけど、ジェスが食べられなくてお皿ごとこぼした。でも覆水盆に返らず -- カウンターにあと20品くらいあったし。",
        idiom: "cry over spilled milk",
        idiom_meaning: "regret what can't be undone / 過ぎたことを嘆く"
    },
    {
        id: '3lACFw9v', // earwig
        sentence: "An EARWIG crawled across the patio table during the shower and three people screamed. My friend Sam was super down to earth about it though -- just flicked it away and was like 'it's called nature, people.'",
        sentence_ja: "シャワー中にハサミムシがテラスのテーブルを這ってて3人が叫んだ。でも友達のサムは超現実的で、パチンと弾いて「自然ってやつだよ、みんな」って。",
        idiom: "down to earth",
        idiom_meaning: "practical, unpretentious / 現実的な・気取らない"
    },
    {
        id: '3LaRmdTG', // party manager
        sentence: "Mia was basically the party manager for this entire event and she absolutely did not drop the ball on a single detail. The pacifier cookies? The wipes station? The little booties centerpiece? All her.",
        sentence_ja: "ミアはこのイベント全体のパーティーマネージャーみたいなもので、一つも手を抜かなかった。おしゃぶりクッキー？おしりふきステーション？小さいブーティーのセンターピース？全部彼女。",
        idiom: "drop the ball",
        idiom_meaning: "fail to do something important / 失敗する・しくじる"
    },
    {
        id: '3LbkkqXb', // jump off
        sentence: "Dave texted me 'if anything weird jumps off at the shower just call me' before leaving to get more ice. Every cloud has a silver lining though -- him being gone meant I could eat the last of the mini cupcakes in peace.",
        sentence_ja: "デイヴが氷を買いに行く前に「シャワーで何か変なことがあったら電話して」ってテキストくれた。でもどんな悪いことにも良い面はある -- 彼がいない間にミニカップケーキの最後の一個を平和に食べられた。",
        idiom: "every cloud has a silver lining",
        idiom_meaning: "something good in every bad situation / どんな悪いことにも良い面がある"
    },
    {
        id: '3lcMKtd_', // cadence
        sentence: "There was this nice cadence to the gift opening -- onesie, blanket, bottle warmer, repeat. But then I had to face the music and admit I completely forgot to write down who gave what. Major whoops moment.",
        sentence_ja: "プレゼント開封にいいリズムがあった -- ロンパース、ブランケット、哺乳瓶ウォーマー、の繰り返し。でも現実に向き合って、誰が何をくれたか書き留めるのを完全に忘れたことを認めなきゃいけなかった。大失態。",
        idiom: "face the music",
        idiom_meaning: "accept consequences / 現実に向き合う・責任を取る"
    },
    {
        id: '3lfMZXcD', // riffraff
        sentence: "My mother-in-law was worried about 'riffraff' showing up uninvited. Ma'am, it's a Tuesday afternoon baby shower in the suburbs. But then SHE spilled punch all over herself -- got a taste of her own medicine for being so judgmental.",
        sentence_ja: "義母が招待してない「ガラの悪い人」が来るんじゃないかと心配してた。あの、火曜の昼に郊外でやるベビーシャワーですよ。でもその本人がパンチを自分にぶちまけた -- 偉そうにしてた自業自得。",
        idiom: "get a taste of one's own medicine",
        idiom_meaning: "experience what you do to others / 自業自得"
    },
    {
        id: '3LiWy0ho', // Balnibarbi
        sentence: "I tried explaining that Balnibarbi is from Gulliver's Travels for the 'baby names from books' game and things totally got out of hand -- everyone started yelling fake names. 'Atticus!' 'Hermione!' 'BILBO!' My mom was not amused.",
        sentence_ja: "「本のキャラから赤ちゃんの名前」ゲームでバルニバービがガリバー旅行記からだと説明しようとしたら完全に収拾がつかなくなった -- みんなデタラメな名前を叫び始めて。「アティカス！」「ハーマイオニー！」「ビルボ！」。母は呆れてた。",
        idiom: "get out of hand",
        idiom_meaning: "become uncontrollable / 手に負えなくなる"
    },
    {
        id: '3LqraHFu', // surf and turf
        sentence: "My dad offered to bring surf and turf for the shower and I'm like Dad it's a baby shower, not a steakhouse. Somehow he got wind of the theme being 'ocean baby' and took it way too literally.",
        sentence_ja: "父がシャワーにサーフアンドターフ（海鮮とステーキ）を持ってくるって言い出して、パパ、ベビーシャワーだよ、ステーキハウスじゃないんだよ。テーマが「海の赤ちゃん」だってどこかで聞きつけて、めちゃくちゃ文字通りに受け取ったみたい。",
        idiom: "get wind of",
        idiom_meaning: "hear about something / うわさを聞きつける"
    },
    {
        id: '3lREvzyi', // catfight
        sentence: "There was almost a catfight over the last slice of cake between my aunt and my cousin. I'm giving my aunt the benefit of the doubt that she genuinely didn't see my cousin reaching for it first.",
        sentence_ja: "おばさんといとこの間でケーキの最後の一切れを巡ってあわや取っ組み合いになるところだった。おばさんがいとこが先に手を伸ばしてたのを本当に見てなかったと善意に解釈してあげる。",
        idiom: "give someone the benefit of the doubt",
        idiom_meaning: "trust someone despite uncertainty / 善意に解釈する"
    },
    {
        id: '3LSRTkuN', // amnesia
        sentence: "Pregnancy brain is basically amnesia at this point. I forgot my OWN baby shower was today. Kate's like 'let's go back to basics -- I'll just set alarms on your phone for literally everything.' Thanks, Mom 2.0.",
        sentence_ja: "妊娠脳がもうほぼ記憶喪失レベル。自分のベビーシャワーが今日だってこと忘れてた。ケイトが「基本に戻ろう -- スマホに全部アラーム設定するから」って。ありがとう、母2号。",
        idiom: "go back to basics",
        idiom_meaning: "return to fundamentals / 基本に戻る"
    },
    {
        id: '3LYVXcLP', // What I say goes
        sentence: "I told Dave 'what I say goes' about the seating chart. He tried to argue and that idea went down in flames real quick. Don't mess with a pregnant woman's party planning.",
        sentence_ja: "席順については「私が言ったことが絶対」ってデイヴに言った。反論しようとしたけどその試みはあっという間に大炎上。妊婦のパーティー計画に口出ししないこと。",
        idiom: "go down in flames",
        idiom_meaning: "fail spectacularly / 大失敗する"
    },
    {
        id: '3mf97BGW', // no stranger to
        sentence: "I'm no stranger to hosting but I had butterflies in my stomach all morning. Like, this is the party where everyone finally realizes I'm about to be responsible for an actual human being. Terrifying.",
        sentence_ja: "ホスティングには慣れてるけど、朝からずっと緊張でドキドキしてた。だって、みんなが「この人がもうすぐ実際の人間の命に責任を持つんだ」って気づくパーティーなんだよ。恐ろしい。",
        idiom: "have butterflies in one's stomach",
        idiom_meaning: "feel nervous / 緊張でドキドキする"
    },
    {
        id: '3mGitgNg', // exquisite
        sentence: "The diaper cake Mia built was honestly exquisite -- 80 diapers, ribbons, little booties on top. I hit a wall trying to figure out how she assembled it without the whole thing collapsing.",
        sentence_ja: "ミアが作ったおむつケーキは本当に絶品だった -- おむつ80枚、リボン、てっぺんに小さいブーティー。どうやって崩れずに組み立てたのか考えようとして行き詰まった。",
        idiom: "hit a wall",
        idiom_meaning: "reach a point where you can't continue / 行き詰まる"
    },
    {
        id: '3MMUDRDP', // fun and games
        sentence: "The shower was all fun and games until someone brought up sleep training. My mom and mother-in-law started giving completely opposite advice and I'm like... it takes two to tango, and you two are tangoing your way into a fight.",
        sentence_ja: "シャワーは楽しくワイワイだったのに、誰かがねんトレの話を出した。母と義母が真逆のアドバイスを始めて、私は...喧嘩は両方に原因がある、って二人が喧嘩に向かってタンゴ踊ってる。",
        idiom: "it takes two to tango",
        idiom_meaning: "both sides are responsible / 喧嘩両成敗・お互い様"
    },
    {
        id: '3MoF-0Tl', // crunch time
        sentence: "It's crunch time for the nursery -- two weeks till my due date and the paint's not even dry. Kate already jumped the gun and bought a baby gate even though this kid can't crawl for like six months. Slow down, sis.",
        sentence_ja: "子供部屋は正念場 -- 予定日まで2週間でまだペンキも乾いてない。ケイトはもう先走ってベビーゲートを買っちゃった、この子がハイハイするの6ヶ月後なのに。落ち着いて、姉ちゃん。",
        idiom: "jump the gun",
        idiom_meaning: "act too soon / 先走る・フライングする"
    },
    {
        id: '3MUzrjC-', // under belt
        sentence: "I've got two trimesters under my belt and honestly the third one's the worst. I tried to keep a straight face when Sarah said 'you look SO comfortable' at the shower. Girl, I haven't been comfortable since October.",
        sentence_ja: "妊娠2期を乗り越えたけど正直3期が一番つらい。シャワーでサラが「すごく楽そうだね」って言った時、真顔を保つのに必死だった。あのね、10月から快適だったことないんですけど。",
        idiom: "keep a straight face",
        idiom_meaning: "not show emotion / 真顔を保つ・笑いをこらえる"
    },
    {
        id: '3n8-0XPI', // operative
        sentence: "Mia was the operative behind this whole shower operation -- spreadsheets, timelines, backup plans, the works. She kept everyone in the loop about timing and I literally could not have done this without her.",
        sentence_ja: "ミアがこのシャワー作戦全体の司令塔だった -- スプレッドシート、タイムライン、バックアッププラン、全部。タイミングについてみんなに情報共有し続けてくれて、彼女なしでは本当に無理だった。",
        idiom: "keep someone in the loop",
        idiom_meaning: "keep someone informed / 情報を共有し続ける"
    },
    {
        id: '3NHjUrZA', // lummox
        sentence: "Dave's brother is such a lummox -- walked straight into the gift table and knocked half of it over. My dad's always joking he'll kick the bucket tripping over something someday. Dark humor runs strong in that family.",
        sentence_ja: "デイヴの兄はほんとにドジで、プレゼントテーブルにまっすぐ突っ込んで半分倒した。うちの父はいつも「いつかつまずいてくたばるぞ」ってジョーク言ってる。あの家族はブラックユーモアが強い。",
        idiom: "kick the bucket",
        idiom_meaning: "die (informal) / 死ぬ（くだけた表現）"
    },
    {
        id: '3nK0xEFd', // crow's foot
        sentence: "My mom was stressing about her crow's feet in the bathroom mirror and I'm like Mom, you look beautiful. I told her to just let sleeping dogs lie -- the baby's not gonna judge your wrinkles. She wasn't convinced.",
        sentence_ja: "母がバスルームの鏡でカラスの足跡（目尻のシワ）を気にしてて、「ママ、綺麗だよ」って言った。「寝た子を起こすな」って -- 赤ちゃんはシワなんて気にしないよ。納得してなかったけど。",
        idiom: "let sleeping dogs lie",
        idiom_meaning: "don't bring up old issues / 寝た子を起こすな"
    },
    {
        id: '3NKJudLZ', // a one-two punch
        sentence: "Planning the shower AND finishing the nursery this weekend was a one-two punch of exhaustion. But I can finally see the light at the end of the tunnel -- the crib's built, the breast pump's set up, we're almost ready.",
        sentence_ja: "シャワーの準備と子供部屋の仕上げを今週末にやるのはダブルパンチの疲労だった。でもやっとトンネルの先の光が見えてきた -- ベビーベッドは組み立てたし、搾乳機もセットアップした、もうほぼ準備OK。",
        idiom: "light at the end of the tunnel",
        idiom_meaning: "hope after difficulty / 希望の光"
    },
    {
        id: '3NM134LA', // care less
        sentence: "Sarah usually couldn't care less about baby showers but she showed up with the most gorgeous handmade swaddle blanket. I almost missed the boat on inviting her -- Mia talked me into it last minute.",
        sentence_ja: "サラは普段ベビーシャワーに全く興味ないのに、超ゴージャスな手作りのおくるみブランケットを持って来た。彼女を招待するチャンスを逃すところだった -- ミアがギリギリで説得してくれた。",
        idiom: "miss the boat",
        idiom_meaning: "miss an opportunity / チャンスを逃す"
    },
    {
        id: '3nm4Bumv', // wrapup
        sentence: "During the wrapup Mia announced all the leftover food was up for grabs, no strings attached. People were shoving mini sandwiches and petits fours into Tupperware containers. Absolutely zero shame.",
        sentence_ja: "締めの時にミアが残った料理は無条件で持って帰っていいよって発表した。みんなミニサンドイッチとプチフールをタッパーに詰め込んでた。恥ずかしさゼロ。",
        idiom: "no strings attached",
        idiom_meaning: "without conditions / 無条件で・見返りなし"
    },
    {
        id: '3NN7n1HW', // go down as
        sentence: "This shower's gonna go down as the best one in our whole friend group history. The decorations? The games? Chef's kiss. Gender reveals are honestly not my cup of tea but shower planning? Mia's got that on lock.",
        sentence_ja: "このシャワーは友達グループ史上最高として記録に残る。デコレーション？ゲーム？完璧。ジェンダーリヴィールは正直私の好みじゃないけど、シャワーの企画？ミアに任せとけば間違いない。",
        idiom: "not my cup of tea",
        idiom_meaning: "not something I enjoy / 好みじゃない"
    },
    {
        id: '3nsiCtO0', // cold feet
        sentence: "I keep getting cold feet about the whole parenting thing. Dave's dad said the first month of formula is on the house -- he's covering it. That honestly made me feel a little better about the budget stuff.",
        sentence_ja: "育児全般について怖気づいてばかり。デイヴのお父さんが最初の1ヶ月分のミルクはおごりだって -- カバーしてくれるって。正直それで予算の不安が少し楽になった。",
        idiom: "on the house",
        idiom_meaning: "free of charge / おごりで・無料で"
    },
    {
        id: '3nY4EnZh', // eatery
        sentence: "After the shower we hit up this little eatery down the street for dinner. The baby passed the last ultrasound with flying colors so we were double celebrating. Dave ordered for two, meaning me and the bump.",
        sentence_ja: "シャワーの後、近所の小さいレストランにご飯を食べに行った。赤ちゃんが最後のエコー検査を見事にパスしたからダブルでお祝い。デイヴが2人分注文した、つまり私とお腹の子の分。",
        idiom: "pass with flying colors",
        idiom_meaning: "succeed brilliantly / 見事に合格する・大成功"
    },
    {
        id: '3o8PUVRu', // install
        sentence: "Dave spent two hours trying to install the car seat and I'm over here trying to piece together instructions from three different YouTube videos. He kept saying 'babe I got this.' He did not got this.",
        sentence_ja: "デイヴがチャイルドシートの取り付けに2時間かけてて、私はYouTubeの3本の動画から説明をつなぎ合わせようとしてた。彼は「大丈夫、任せて」って言い続けてた。全然大丈夫じゃなかった。",
        idiom: "piece together",
        idiom_meaning: "assemble from parts / つなぎ合わせる・組み立てる"
    },
    {
        id: '3OgXBdHN', // loud-mouthed
        sentence: "My aunt is SO loud-mouthed she accidentally announced the baby's name before we were ready. I TOLD Dave not to put all his eggs in one basket and trust her with secrets. Lesson learned the hard way.",
        sentence_ja: "おばさんは本当にお喋りで、私たちの準備ができる前に赤ちゃんの名前をうっかりバラしちゃった。デイヴに「一つのことに全てを賭けて彼女に秘密を預けるな」って言ったのに。痛い目見て学んだね。",
        idiom: "put all one's eggs in one basket",
        idiom_meaning: "risk everything on one thing / 一つのことに全てを賭ける"
    },
    {
        id: '3OTV9Rob', // lad
        sentence: "Dave's friend kept calling the baby 'the little lad' even though we don't know the gender. Stubbornness really runs in the family -- Dave's entire side just DECIDES things and that's final.",
        sentence_ja: "デイヴの友達が性別わかってないのに赤ちゃんを「坊や」って呼び続けてた。頑固さは本当に家族に遺伝する -- デイヴ側の家族は物事を「決めたら終わり」。",
        idiom: "run in the family",
        idiom_meaning: "be inherited / 家系に遺伝する・一家の特徴"
    },
    {
        id: '3ovuSe9Z', // pull out
        sentence: "Three people pulled out of the shower last minute and I was mortified about the empty seats. Mia helped me save face by rearranging everything so it didn't look sad. She's the MVP of my entire life.",
        sentence_ja: "3人がギリギリでシャワーをキャンセルして、空席が恥ずかしかった。ミアが全部配置し直して寂しく見えないようにして面目を保ってくれた。彼女は私の人生のMVP。",
        idiom: "save face",
        idiom_meaning: "avoid embarrassment / 面目を保つ"
    },
    {
        id: '3OYrfEWe', // jostle
        sentence: "People were jostling to get a good view of the gift opening and honestly my mom's deviled eggs are second to none so most people eventually drifted back to the food table. Priorities, right?",
        sentence_ja: "みんなプレゼント開封を見ようと押し合いへし合いしてたけど、正直うちの母のデビルドエッグは最高なので結局ほとんどの人が料理テーブルに戻っていった。優先順位ってやつだよね。",
        idiom: "second to none",
        idiom_meaning: "the best / 誰にも負けない・最高"
    },
    {
        id: '3PbymVmL', // Golden bungee
        sentence: "My boss joked about a golden bungee exit since I'm starting maternity leave next month. Told him I'll take a rain check on retirement planning -- right now I just need to figure out where the burp cloths go.",
        sentence_ja: "上司が来月から産休に入るから「ゴールデンバンジー退職」ってジョーク言ってた。退職計画はまた今度にするって言った -- 今はゲップ用の布をどこにしまうか考えないと。",
        idiom: "take a rain check",
        idiom_meaning: "postpone / また今度にする"
    },
    {
        id: '3PCWBr8o', // dentition
        sentence: "Kate was going ON about dentition and how the teething ring literally saved her sanity with her first kid. That was the last straw for my mother-in-law who chimed in with 'in MY day we just used whiskey.' MA'AM.",
        sentence_ja: "ケイトが歯の生え方について延々と話してて、歯固めリングが一人目の時に本当に救いだったって。それが義母にとって最後の一撃で「私の時代はウイスキーを使ったものよ」って口を挟んだ。おばさん...。",
        idiom: "the last straw",
        idiom_meaning: "the final annoyance / 最後の一撃・もう限界"
    },
    {
        id: '3PImwlc-', // death's door
        sentence: "First trimester I felt like I was at death's door with the morning sickness. Somehow I weathered the storm though. Now I'm at 36 weeks feeling like a tank but at least I can keep food down.",
        sentence_ja: "妊娠初期はつわりで死にそうだった。でもなんとか嵐を乗り越えた。今は36週で戦車みたいな気分だけど、少なくとも食べ物は下に入る。",
        idiom: "weather the storm",
        idiom_meaning: "survive a difficult time / 困難を乗り越える"
    },
    {
        id: '3PKka0Y2', // FUD
        sentence: "There's so much FUD online about parenting -- every blog contradicts the last one. I told Dave I'm turning over a new leaf and deleting all those mommy forums. From now on I'm trusting my gut. And my pediatrician. Mostly my pediatrician.",
        sentence_ja: "ネット上の育児に関するFUD（恐怖・不安・疑念）が多すぎる -- どのブログも前のと矛盾してる。デイヴに心機一転してママフォーラム全部消すって言った。これからは自分の直感を信じる。あと小児科医。主に小児科医。",
        idiom: "turn over a new leaf",
        idiom_meaning: "make a fresh start / 心機一転・新たなスタートを切る"
    },
];

async function seedDay37() {
    console.log('Seeding Day 037 -- Baby Shower (30F)...\n');
    let success = 0;
    let failed = 0;

    for (const item of DAY37_DATA) {
        try {
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
                console.log(`  OK: ${item.idiom}`);
            } else {
                failed++;
                console.log(`  FAIL: ${item.id} - ${JSON.stringify(data)}`);
            }
        } catch (err) {
            failed++;
            console.log(`  ERROR: ${item.id} - ${err.message}`);
        }
    }

    console.log(`\nDone! ${success}/50`);
}

seedDay37();
