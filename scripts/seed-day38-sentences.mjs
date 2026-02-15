// Seed Day 038 (words 1850-1899) -- Feb 7
// Day 038: 同窓会（28歳、混合）
// ALL sentences must be SPOKEN -- actual things people say out loud
// Mixed perspectives: Kevin(28M,organizer), Yuki(28F,returned from abroad), Marco(29M,chef), Lisa(28F,lawyer), Tommy(28M,gym bro), Brenda(55F,former teacher), Raj(28M,tech startup), Amanda(27F,vet), Hiro(28M,quiet guy), Stacy(28F,gossip queen)

const DAY38_DATA = [
    {
        id: '3pmyCokO', // obstinate
        sentence: "I tried to change the venue like THREE times but the committee was so obstinate about keeping it at the old gym. I finally threw in the towel and just ordered better catering instead.",
        sentence_ja: "会場を3回も変えようとしたんだけど、委員会が旧体育館にこだわりすぎて頑固すぎた。結局諦めて、代わりにケータリングを良くした。",
        idiom: "throw in the towel",
        idiom_meaning: "give up / 諦める・ギブアップする"
    },
    {
        id: '3Pn75MoZ', // cold-call
        sentence: "Yo remember when I used to cold-call random investors for my lemonade stand startup in senior year? Everyone thought I was nuts. Honestly I just hit the ground running out of college and never looked back.",
        sentence_ja: "高校最後の年にレモネードスタンドのスタートアップで見ず知らずの投資家に飛び込み電話してたの覚えてる？みんな頭おかしいと思ってたよね。正直、大学出てすぐ全力で走り出してそれっきり。",
        idiom: "hit the ground running",
        idiom_meaning: "start something with great energy / すぐに全力で取り組む"
    },
    {
        id: '3pOLl7H9', // the second coat of paint
        sentence: "OK but like the gym walls got the second coat of paint and it STILL looks like our old cafeteria. Honestly this place is just lipstick on a pig -- same busted bleachers, same leaky roof.",
        sentence_ja: "体育館の壁、二度塗りしたのにまだ昔のカフェテリアみたいじゃん。正直ここただの見かけ倒し -- 同じ壊れた観覧席、同じ雨漏りする屋根。",
        idiom: "lipstick on a pig",
        idiom_meaning: "superficial improvement / 見かけだけの改善・ごまかし"
    },
    {
        id: '3PRflUDh', // duffel bags
        sentence: "I brought TWO duffel bags -- one for clothes, one for my pre-workout and protein shakes. Don't judge me. We're all in the same boat with back pain now though, so maybe gym life ain't all sunshine.",
        sentence_ja: "ダッフルバッグ2つ持ってきた -- 1つは服、もう1つはプレワークアウトとプロテインシェイク。批判するなよ。でも腰痛はみんな同じ境遇だし、ジム生活もいいことばかりじゃないかも。",
        idiom: "in the same boat",
        idiom_meaning: "in the same situation / 同じ境遇・同じ立場"
    },
    {
        id: '3pyBRUQk', // cisgender
        sentence: "So at my university in Amsterdam we study terms like cisgender in gender studies, right? And I'm explaining this and Mrs. Brenda goes 'well I learned something new today -- you're never too old to learn!' So sweet.",
        sentence_ja: "アムステルダムの大学でジェンダー学でシスジェンダーみたいな用語を勉強するんだけど、それ説明したらブレンダ先生が『今日新しいこと学んだわ -- 学ぶのに遅すぎることはないのよ！』って。めっちゃいい。",
        idiom: "never too old to learn",
        idiom_meaning: "can always learn new things / 学ぶのに遅すぎることはない"
    },
    {
        id: '3pZ3vqAx', // a Caucasian
        sentence: "I was literally the only non-Caucasian kid in cooking club back in the day, and I'm the one who taught y'all how to make real pasta from scratch. You're welcome. I like to think I brought something to the table.",
        sentence_ja: "昔の料理部で唯一の非白人だったの俺だからね、しかもみんなに本物のパスタの作り方をゼロから教えたのも俺。どういたしまして。ちゃんと貢献したと思ってるよ。",
        idiom: "bring something to the table",
        idiom_meaning: "contribute something valuable / 貢献する・価値を提供する"
    },
    {
        id: '3q-o8sLG', // fine print
        sentence: "OK I'm gonna say this one more time -- ALWAYS read the fine print before you sign anything. I've seen clients lose their shirts over one missed clause. I know, I know, I'm giving free legal advice at a party again.",
        sentence_ja: "もう一回だけ言うね -- サインする前に必ず細かい字を読んで。一つの条項を見落として大損した依頼人を何人も見てきたから。わかってる、わかってる、また パーティーで無料の法律相談してるって。",
        idiom: "lose one's shirt",
        idiom_meaning: "lose a lot of money / 大損する・一文無しになる"
    },
    {
        id: '3qb24iav', // Fredo
        sentence: "Kevin just called me 'the Fredo of the friend group' because I leaked the surprise party plans that one time. I didn't bat an eye though -- just flexed and said 'Fredo didn't have these guns though.'",
        sentence_ja: "ケビンが俺を『友達グループのフレド』って呼んだ。あの時サプライズパーティーの計画バラしたから。全く動じなかったけどね -- 力こぶ作って『でもフレドにはこの筋肉なかっただろ』って。",
        idiom: "not bat an eye",
        idiom_meaning: "show no surprise or emotion / 全く動じない・平然としている"
    },
    {
        id: '3qHTiq2s', // inclement weather
        sentence: "We almost cancelled the outdoor part 'cause of inclement weather but I pulled strings and got a tent from my uncle's rental company last minute. Being an organizer is SO stressful, you guys have no idea.",
        sentence_ja: "悪天候で屋外パートを中止しそうになったけど、コネ使って叔父のレンタル会社からギリギリでテント手配した。幹事ってマジでストレスやばい、みんな全然わかってないでしょ。",
        idiom: "pull strings",
        idiom_meaning: "use personal connections / コネを使う・裏で手を回す"
    },
    {
        id: '3Qkvsvq6', // gaunt
        sentence: "Dude, Hiro looks kinda gaunt compared to high school, right? Turns out he's been burning the candle at both ends finishing his PhD. Four hours of sleep a night and living on convenience store onigiri. That's rough.",
        sentence_ja: "ヒロ、高校時代と比べてちょっとやつれてない？博士論文の仕上げで両端からロウソク燃やしてた（働き詰め）みたい。一晩4時間睡眠でコンビニおにぎり生活。きっつ。",
        idiom: "burn the candle at both ends",
        idiom_meaning: "overwork, exhaust oneself / 無理をする・働き詰め"
    },
    {
        id: '3QnORlfa', // fall off the wagon
        sentence: "OK fine I fell off the wagon with my diet. I found this new ramen place downtown and I go like three times a week now. Once you open that can of worms there's no going back to plain chicken breast, I'm sorry.",
        sentence_ja: "わかったよ、ダイエットから脱落した。街に新しいラーメン屋見つけて、今週3回通ってる。その扉開けちゃったらもう味気ないチキンブレストには戻れないの、ごめん。",
        idiom: "open a can of worms",
        idiom_meaning: "create new problems / 面倒な問題を引き起こす"
    },
    {
        id: '3Qo1Y_16', // the summer solstice
        sentence: "In Amsterdam they celebrate the summer solstice with bonfires and music and it's SO cool. Living abroad really opened my eyes to how different cultures mark the seasons. You guys should travel more, seriously.",
        sentence_ja: "アムステルダムでは夏至を焚き火と音楽で祝うんだけど、めっちゃいいの。海外生活で、文化によって季節の祝い方が全然違うって本当に目が開かれた。みんなもっと旅行した方がいいよ、マジで。",
        idiom: "open one's eyes",
        idiom_meaning: "become aware / 目が覚める・気づかされる"
    },
    {
        id: '3qYgTBfy', // groping
        sentence: "So this client of mine was basically groping in the dark trying to find evidence of workplace harassment, right? I ended up cracking the case wide open after I found deleted emails on the company server.",
        sentence_ja: "うちの依頼人が職場のハラスメントの証拠を手探りで探してたんだけど、会社のサーバーから削除されたメール見つけて事件を完全に解明した。",
        idiom: "crack the case",
        idiom_meaning: "solve a mystery or problem / 事件を解明する・解決する"
    },
    {
        id: '3QZswFBp', // combat pay
        sentence: "Honestly, working the Friday dinner rush should come with combat pay. The kitchen is pure chaos. But I learned to keep my cool under pressure from Mrs. Brenda's pop quizzes, so thanks for that I guess.",
        sentence_ja: "正直、金曜のディナーラッシュには戦闘手当つけるべき。キッチンは完全にカオス。でもプレッシャーの下で冷静でいることはブレンダ先生の抜き打ちテストで学んだから、まあ感謝してるよ。",
        idiom: "keep one's cool",
        idiom_meaning: "stay calm / 冷静を保つ・落ち着いている"
    },
    {
        id: '3RduBiSO', // have blood on your hands
        sentence: "I'm sorry but the old principal literally has blood on his hands for cutting the art program. OK maybe that's a bit much, but let's not beat around the bush -- that decision ruined so many students' plans.",
        sentence_ja: "ごめんだけど、前の校長は美術プログラムを廃止した責任がマジであるから。OK、ちょっと大げさかもだけど、遠回しに言うのはやめよう -- あの決定で何人もの生徒の計画が台無しになった。",
        idiom: "beat around the bush",
        idiom_meaning: "avoid the main point / 遠回しに言う・核心を避ける"
    },
    {
        id: '3rgCpfux', // photobombed
        sentence: "Wait, you guys didn't notice? I totally photobombed the group picture with the most deadpan face. Nobody caught it until like an hour later. That was honestly the icing on the cake for the whole evening.",
        sentence_ja: "え、みんな気づかなかった？めっちゃ無表情で集合写真にフォトボムしたんだけど。1時間後まで誰も気づかなかった。あれ正直、あの夜の最高の仕上げだった。",
        idiom: "the icing on the cake",
        idiom_meaning: "something extra that makes good even better / 最高の仕上げ・おまけ"
    },
    {
        id: '3rIJg2yD', // dead pan
        sentence: "I gave my toast with a completely dead pan expression on purpose. Something about how school prepared us for absolutely nothing useful. Everyone's dying laughing and I'm just standing there like a statue. That's my thing.",
        sentence_ja: "わざと完全に無表情で乾杯スピーチした。学校は何の役にも立つことを教えてくれなかったみたいな内容。みんな爆笑してるのに俺は彫像みたいに立ってるだけ。それが俺のスタイル。",
        idiom: "in stitches",
        idiom_meaning: "laughing uncontrollably / 大爆笑・笑いが止まらない"
    },
    {
        id: '3RKucu7u', // cleaning solutions
        sentence: "So I was just mentioning the cleaning solutions we use at the vet clinic and somehow it turned into a full-on vinegar versus bleach debate. That conversation went down the rabbit hole SO fast, I couldn't even keep up.",
        sentence_ja: "動物病院で使ってる洗浄液の話しただけなのに、なぜか酢vs漂白剤の大論争に発展した。あの会話、深みにはまるのが早すぎて、ついていけなかった。",
        idiom: "go down the rabbit hole",
        idiom_meaning: "get deeply into a complex topic / 深みにはまる・脱線する"
    },
    {
        id: '3rMPi13V', // Diphtheria
        sentence: "You kids have no idea -- back in my day we actually worried about things like Diphtheria. Your generation takes modern medicine for granted. Count your blessings, seriously. I'm not joking.",
        sentence_ja: "あなたたちは全然わかってない -- 昔は本当にジフテリアみたいな病気を心配してたの。あなたたちの世代は現代医学を当たり前だと思ってる。本当に感謝しなさい。冗談じゃなく。",
        idiom: "count one's blessings",
        idiom_meaning: "appreciate what you have / 感謝する・恵まれていることを数える"
    },
    {
        id: '3Rvww6gA', // stripped down
        sentence: "Check this out -- this is a stripped down version of my new app. No flashy graphics, just core features. I went back to basics after my first startup tanked from trying to do way too much at once.",
        sentence_ja: "これ見て -- 新しいアプリの簡素化バージョン。派手なグラフィックなし、コア機能だけ。最初のスタートアップが一度にやりすぎて失敗した後、基本に立ち返った。",
        idiom: "go back to basics",
        idiom_meaning: "return to fundamentals / 基本に立ち返る・原点回帰"
    },
    {
        id: '3S2-DcIG', // beat meat
        sentence: "This is how you properly beat meat for chicken katsu, OK? You gotta-- wait why is everyone laughing? Oh come on, grow up. I didn't miss a beat though -- kept pounding the chicken while explaining my secret marinade.",
        sentence_ja: "チキンカツの肉はこうやって叩くんだよ、いい？こうして-- え、なんでみんな笑ってんの？もう、大人になれよ。でも俺は全く動じなかった -- 秘密のマリネを説明しながら鶏肉を叩き続けた。",
        idiom: "not miss a beat",
        idiom_meaning: "continue without hesitation / 全く動じない・一拍も逃さない"
    },
    {
        id: '3sa55eEq', // against all odds
        sentence: "Wait, did you hear about the valedictorian? Against all odds he became a surf instructor in Bali instead of going to med school. He totally broke the mold -- nobody saw that career pivot coming.",
        sentence_ja: "え、首席の子の話聞いた？あらゆる困難を乗り越えて、医学部行かずにバリ島のサーフインストラクターになったんだよ。完全に型破り -- あのキャリアチェンジは誰も予想してなかった。",
        idiom: "break the mold",
        idiom_meaning: "do something unprecedented / 型を破る・前例のないことをする"
    },
    {
        id: '3SFrAEdk', // set up
        sentence: "I set up this whole reunion basically by myself -- decorations, food, music, seating, EVERYTHING. Lisa says I went above and beyond, which is nice, but honestly I'm just exhausted. Someone get me a drink.",
        sentence_ja: "この同窓会、基本的に全部一人でセットアップした -- 装飾、食事、音楽、座席、全部。リサが期待以上だって言ってくれるのは嬉しいけど、正直もう疲れた。誰か飲み物ちょうだい。",
        idiom: "go above and beyond",
        idiom_meaning: "do more than expected / 期待以上のことをする"
    },
    {
        id: '3SwIJZ8m', // not touch with a ten-foot pole
        sentence: "I wouldn't touch crypto with a ten-foot pole after watching three of my colleagues get absolutely burned. Raj is like 'you just gotta do your homework' but nah, I'm good. Too risky for me.",
        sentence_ja: "同僚3人が大やけどしたの見た後は、仮想通貨には絶対手を出さない。ラジは『ちゃんと下調べすればいいだけだよ』って言うけど、いや、いい。リスク高すぎ。",
        idiom: "do one's homework",
        idiom_meaning: "research thoroughly / しっかり下調べする・準備する"
    },
    {
        id: '3tBfW-nK', // headmistress
        sentence: "Oh my goodness, the old headmistress used to rule this school with an iron fist. Even we teachers were scared of her. She kept us all on our toes, but I'll say this -- we respected her.",
        sentence_ja: "まあ、前の女性校長は鉄拳で学校を支配してたのよ。先生たちも怖がってた。みんなを緊張させてたけど、一つ言えるのは -- 尊敬してた。",
        idiom: "keep on one's toes",
        idiom_meaning: "stay alert and ready / 油断させない・緊張感を保たせる"
    },
    {
        id: '3tmwjvKz', // spay and neuter
        sentence: "Please spay and neuter your pets, I'm begging you. This is my hill to die on. I've seen too many abandoned animals at the shelter to just stay quiet about it. I will literally never stop talking about this.",
        sentence_ja: "お願いだからペットの避妊・去勢手術して。これは絶対に譲れない信念。シェルターで捨てられた動物を見すぎて、黙ってられない。マジでこの話、一生やめないから。",
        idiom: "hill to die on",
        idiom_meaning: "something worth fighting for / 絶対に譲れないこと・信念"
    },
    {
        id: '3tPVjZ9u', // enlighten me
        sentence: "Go ahead, enlighten me about Dutch cycling culture. I'm all ears. ...OK wait, that actually sounds kinda cool? Maybe I should bike to work. You kinda won me over with the whole 'no parking stress' thing.",
        sentence_ja: "どうぞ、オランダの自転車文化について教えてくれよ。聞いてるよ。...え、ちょっと待って、それ結構いいかも？自転車通勤しようかな。『駐車のストレスなし』ってとこで説得されたわ。",
        idiom: "win someone over",
        idiom_meaning: "persuade / 説得する・味方につける"
    },
    {
        id: '3tR-ZUgA', // discretion is the better part of valor
        sentence: "Yo I was about to throw hands with that drunk dude who crashed our reunion but Lisa grabbed me and whispered 'discretion is the better part of valor.' She basically saved my skin -- that guy was HUGE.",
        sentence_ja: "同窓会に乗り込んできた酔っ払いとやり合いそうになったけど、リサが掴んで『思慮深さが勇気の最良の部分だ』って囁いた。マジで俺を救った -- あいつデカすぎた。",
        idiom: "save someone's skin",
        idiom_meaning: "rescue from danger / 危険から救う・窮地を救う"
    },
    {
        id: '3trjLAGd', // pestilence
        sentence: "My old apartment had a cockroach problem that was like a biblical pestilence. Not even exaggerating. I finally bit the bullet and hired a professional exterminator after months of DIY disasters.",
        sentence_ja: "前のアパートのゴキブリ問題、聖書レベルの疫病だった。大げさじゃなく。何ヶ月もDIYで失敗した後、ついに覚悟決めてプロの駆除業者を雇った。",
        idiom: "bite the bullet",
        idiom_meaning: "face something difficult bravely / 覚悟を決める・思い切ってやる"
    },
    {
        id: '3TuItsmP', // lackluster
        sentence: "OK I'll admit it, the DJ was pretty lackluster -- just playing the same top 40 on repeat. So Marco took the reins, plugged in his phone, and started blasting actual good music from our high school days. Legend.",
        sentence_ja: "認めるよ、DJは正直冴えなかった -- 同じトップ40をリピートしてるだけ。そしたらマルコが主導権握って、スマホつないで高校時代の本当にいい曲を爆音で流し始めた。伝説。",
        idiom: "take the reins",
        idiom_meaning: "take control / 主導権を握る・指揮を取る"
    },
    {
        id: '3tZtYLB5', // wardrobe
        sentence: "Oh my GOD Yuki's wardrobe tonight is insane -- this vintage Dutch coat she found at a flea market in Amsterdam. I'm so green with envy right now. Where do I buy one? Is it online? Send me the link.",
        sentence_ja: "やばいユキの今夜の服装イカれてる -- アムステルダムのフリマで見つけたヴィンテージのオランダのコート。今めっちゃ嫉妬してる。どこで買えるの？ネット？リンク送って。",
        idiom: "green with envy",
        idiom_meaning: "very jealous / 羨ましくてたまらない・嫉妬する"
    },
    {
        id: '3u1ZGya0', // dill
        sentence: "Try this salmon canape with fresh dill -- I made like fifty of 'em. The secret ingredient is love. ...OK Lisa just said 'the proof is in the pudding' and honestly? Yeah. The pudding is delicious. I'm that good.",
        sentence_ja: "このフレッシュなディルのサーモンカナッペ食べて -- 50個くらい作った。秘密の材料は愛。...リサが「結果が全てを物語る」って言ったんだけど、正直？うん。結果は最高。俺はそれくらいすごい。",
        idiom: "the proof is in the pudding",
        idiom_meaning: "results speak for themselves / 結果が全てを物語る"
    },
    {
        id: '3ubFE8Iu', // pigeon-hole
        sentence: "People always try to pigeon-hole me as 'the tech guy' but I actually paint watercolors on weekends. Don't judge a book by its cover, you know? My art Instagram has like 50K followers. I'm not even joking.",
        sentence_ja: "みんないつも俺を『テックの人』って決めつけるんだけど、実は週末に水彩画描いてるんだよね。見た目で判断するなよ。アートのインスタ、フォロワー5万人いるから。マジで。",
        idiom: "don't judge a book by its cover",
        idiom_meaning: "don't judge by appearance / 見た目で判断するな"
    },
    {
        id: '3uHsc9LL', // wimpy
        sentence: "Bro your handshake is so wimpy, come on. Here, like THIS. ...OK why's everyone looking at me like that? I'm just trying to help. I know I can be a bull in a china shop with people's feelings, my bad.",
        sentence_ja: "おいお前の握手弱すぎ、しっかりしろよ。ほら、こう。...え、なんでみんなそんな顔で見てんの？助けようとしてるだけなのに。俺が人の気持ちに関して不器用なのはわかってる、悪い。",
        idiom: "a bull in a china shop",
        idiom_meaning: "clumsy or tactless person / 不器用な人・繊細さに欠ける人"
    },
    {
        id: '3UJo3TJu', // writ
        sentence: "I served a writ to this massive corporation last month and honestly it felt like David versus Goliath. I'm still pretty wet behind the ears compared to the senior partners, but nobody at my firm works harder than me.",
        sentence_ja: "先月、大企業に令状を送達したんだけど、マジでダビデ対ゴリアテみたいだった。シニアパートナーと比べるとまだまだ若造だけど、事務所で俺より働くやつはいない。",
        idiom: "wet behind the ears",
        idiom_meaning: "inexperienced / 未熟な・経験不足の"
    },
    {
        id: '3UNJDv-P', // microcosm
        sentence: "You know what, our class was like a microcosm of the whole town -- farmers' kids, shop owners' kids, the mayor's daughter, all thrown together. And we learned to get along like a house on fire despite being so different.",
        sentence_ja: "ねえ、うちのクラスって町全体の縮図みたいだったよね -- 農家の子、商店主の子、市長の娘、全員ごちゃ混ぜ。全然違うのにすごく意気投合できるようになった。",
        idiom: "get along like a house on fire",
        idiom_meaning: "get along extremely well / すごく意気投合する"
    },
    {
        id: '3uotkHNz', // craze
        sentence: "Remember when fidget spinners were the craze? I was literally selling them out of my locker for profit. I've always had a nose for business -- I could smell an opportunity from a mile away even back then.",
        sentence_ja: "フィジェットスピナーが大流行してた時覚えてる？俺マジでロッカーから売って利益出してた。昔からビジネスの嗅覚あったんだよ -- あの頃からチャンスを遠くから嗅ぎ分けられた。",
        idiom: "have a nose for",
        idiom_meaning: "have an instinct for detecting / 嗅覚がある・見抜く力がある"
    },
    {
        id: '3UZ6SNHl', // pre workout supplement
        sentence: "This pre workout supplement literally changed my life, you guys don't even know. ...And then Hiro goes 'so did coffee' in the most monotone voice ever and the whole table just LOST it. That guy steals the show every time.",
        sentence_ja: "このプレワークアウトサプリメント、マジで人生変わった、みんなわかんないだろうけど。...そしたらヒロが史上最も単調な声で「コーヒーもだけど」って言って、テーブル全体が大爆笑。あいつ毎回主役の座奪うんだよ。",
        idiom: "steal the show",
        idiom_meaning: "attract the most attention / 主役の座を奪う・一番目立つ"
    },
    {
        id: '3vIakRFG', // the sun don't shine
        sentence: "When I found out my ex was cheating, I told him exactly where the sun don't shine. Kevin said I gave him a taste of his own medicine and honestly? He deserved every word. No regrets.",
        sentence_ja: "元カレの浮気がわかった時、『日の当たらない場所』がどこか教えてやった。ケビンが「自業自得だ」って言ってたけど、正直？全ての言葉に値した。後悔なし。",
        idiom: "a taste of one's own medicine",
        idiom_meaning: "same bad treatment returned / 自業自得・自分がされたことをされる"
    },
    {
        id: '3vMWzgYt', // hip hip hooray
        sentence: "When Mrs. Brenda walked in we all shouted 'hip hip hooray!' and I swear she almost cried. She said she was over the moon -- didn't think we'd remember her after all these years. Of course we do. She taught half the town.",
        sentence_ja: "ブレンダ先生が入ってきた時みんなで『ヒップヒップフレー！』って叫んだら、マジで泣きそうだった。大喜びだって -- こんな年月が経っても覚えてくれてるとは思わなかったって。当然覚えてるよ。町の半分を教えた先生だもん。",
        idiom: "over the moon",
        idiom_meaning: "extremely happy / 大喜び・有頂天"
    },
    {
        id: '3WgHHw9F', // divorce papers
        sentence: "Signing the divorce papers was honestly a weight off my shoulders. Me and my ex are on better terms now, actually. Sometimes you just gotta let sleeping dogs lie, you know? Especially with the custody stuff.",
        sentence_ja: "離婚届にサインしたのは正直肩の荷が下りた。元奥さんとの関係も今は実は良くなった。寝た子を起こすなってことあるでしょ？特に親権の件は。",
        idiom: "let sleeping dogs lie",
        idiom_meaning: "don't disturb a settled situation / 寝た子を起こすな・触らぬ神に祟りなし"
    },
    {
        id: '3wgrNj-3', // loom large
        sentence: "The 'so what are you doing with your life' question loomed large over literally every conversation tonight. Can we please stop keeping up with the Joneses and just be happy for each other? Is that too much to ask?",
        sentence_ja: "『で、人生何してるの？』って質問が今夜の全会話にのしかかってた。人と張り合うのやめて、お互いの幸せを喜べないの？それって贅沢なお願い？",
        idiom: "keep up with the Joneses",
        idiom_meaning: "compete with neighbors socially / 人と張り合う・見栄を張る"
    },
    {
        id: '3wIhZx3S', // quarry
        sentence: "Remember sneaking into the old quarry after prom to swim? I still get cold sweats thinking about it. That place was a total death trap but we thought we were invincible. The folly of youth, man.",
        sentence_ja: "プロムの後にこっそり古い採石場に泳ぎに行ったの覚えてる？今でも思い出すと冷や汗出る。あそこ完全に死の罠だったけど、俺たち無敵だと思ってた。若さゆえの愚かさだよ。",
        idiom: "the folly of youth",
        idiom_meaning: "foolish behavior of young people / 若さゆえの愚かさ"
    },
    {
        id: '3WWpBRy2', // No can do
        sentence: "No can do, my friend -- carbs are what make cake cake. You can't have a zero-carb birthday cake, that's just sad bread. I don't sugarcoat things. Pun totally intended.",
        sentence_ja: "無理だよ友よ -- 糖質があるからケーキはケーキなんだ。ゼロ糖質のバースデーケーキなんて、ただの悲しいパンだよ。俺はオブラートに包まない。ダジャレのつもり。",
        idiom: "sugarcoat",
        idiom_meaning: "make something seem better than it is / オブラートに包む・甘く見せる"
    },
    {
        id: '3X_yKXi6', // ASAP
        sentence: "I texted 'need your RSVP ASAP!!!' in the group chat for WEEKS and half of you dragged your feet until the last minute. Organizing this reunion was like herding cats, I swear to god.",
        sentence_ja: "グループチャットで何週間も「出欠をASAPで送って！！！」って送り続けたのに、半分がギリギリまでぐずぐずして。この同窓会の運営、マジで猫の群れをまとめるようなもんだった。",
        idiom: "like herding cats",
        idiom_meaning: "extremely difficult to organize / まとめるのが困難・統率不能"
    },
    {
        id: '3x1VGcYq', // BAT
        sentence: "OK so BAT tokens in crypto are basically-- why are your eyes glazing over? Come on, it's not that complicated. ...Fine, Lisa just said 'it's all Greek to me' but she still downloaded a crypto app after dinner so I count that as a win.",
        sentence_ja: "えっと仮想通貨のBATトークンっていうのは基本的に-- なんで目がうつろになってんの？そんな難しくないって。...まあリサが「チンプンカンプン」って言ったけど、夕食後に仮想通貨アプリダウンロードしてたから俺の勝ち。",
        idiom: "it's all Greek to me",
        idiom_meaning: "I don't understand it at all / チンプンカンプン・さっぱりわからない"
    },
    {
        id: '3X5aqAJn', // eczema
        sentence: "My eczema flares up every single winter and I've literally tried everything under the sun. Prescription creams, oatmeal baths, you name it. Nothing works long term. I've just learned to grin and bear it at this point.",
        sentence_ja: "湿疹が毎冬悪化するんだけど、ありとあらゆる方法を試した。処方クリーム、オートミール風呂、何でも。長期的に効くものはない。もう笑って耐えるしかないって悟った。",
        idiom: "grin and bear it",
        idiom_meaning: "endure without complaining / 笑って耐える・我慢する"
    },
    {
        id: '3XI8iKf4', // button one's lip
        sentence: "OK I was about to spill some MAJOR tea about you-know-who but Lisa literally told me to button my lip. 'Loose lips sink ships,' she said. Fine, FINE. But come find me later if you wanna know.",
        sentence_ja: "あの人のことで超特大のゴシップバラしそうになったけど、リサがマジで口をつぐめって。「口は災いの元」だって。わかった、わかったよ。でも後でこっそり来てくれたら教える。",
        idiom: "loose lips sink ships",
        idiom_meaning: "careless talk causes trouble / 口は災いの元・軽口は身を滅ぼす"
    },
    {
        id: '3XlDoAxS', // rumble
        sentence: "We heard a rumble of thunder RIGHT as the speeches started and everyone scrambled inside. It was touch and go for a minute but I had a backup plan for indoor seating. Always thinking ahead, that's me.",
        sentence_ja: "スピーチが始まった瞬間に雷のゴロゴロが聞こえてみんな慌てて中に入った。一瞬どうなるかわからなかったけど、室内座席のバックアッププランあったから。常に先を考えてる、それが俺。",
        idiom: "touch and go",
        idiom_meaning: "uncertain, could go either way / 五分五分・どうなるかわからない"
    },
    {
        id: '3xLkFYmw', // autocrat
        sentence: "Stacy just called me an autocrat because I won't let anyone else touch the playlist. Excuse me? That's the pot calling the kettle black coming from the girl who ran prom like an actual dictator.",
        sentence_ja: "ステイシーが私を独裁者って呼んだ。プレイリストを他の人に触らせないから。はあ？プロムを本物の独裁者みたいに仕切ってた子に言われたくない。自分のこと棚に上げて。",
        idiom: "the pot calling the kettle black",
        idiom_meaning: "hypocritically criticizing / 自分のことを棚に上げて・目くそ鼻くそ"
    },
];

async function seedDay38() {
    console.log('Seeding Day 038 -- Class Reunion (28, Mixed)...\n');
    let success = 0;
    let failed = 0;

    for (const item of DAY38_DATA) {
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

seedDay38();
