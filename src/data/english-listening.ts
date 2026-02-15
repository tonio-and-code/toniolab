export interface ScriptSegment {
    startTime: number;
    endTime?: number;
    english: string;
    japanese: string;
}

export interface ListeningContent {
    id: string;
    youtubeId: string;
    title: string;
    description: string;
    date: string;
    segments: ScriptSegment[];
}

export const listeningContents: ListeningContent[] = [
    {
        id: "kyle-tucker-dodgers-signing",
        youtubeId: "PO5NbXnUWwg",
        title: "Kyle Tucker Signs with Dodgers - Live Reaction",
        description: "Felix's live reaction to the breaking news of Kyle Tucker signing with the Los Angeles Dodgers for 4 years, $240 million.",
        date: "2026-01-17",
        segments: [
            {
                startTime: 0,
                english: "Alright everyone, this is an emergency breaking news stream. The biggest free agent this offseason, Kyle...",
                japanese: "はい、どうも皆さん。緊急速報配信でございます。このオフの目玉選手カイル…"
            },
            {
                startTime: 17,
                english: "Wait, what am I doing? Okay. So the biggest free agent this offseason, Kyle Tucker, has signed with the Dodgers.",
                japanese: "どうした?俺は何してん?はい。えっとこのオフの最大の目玉であった、え、カイル・タッカー、え、ドジャースと契約ということになりました。"
            },
            {
                startTime: 31,
                english: "From the current reports, it's 4 years, $240 million, which is about $60 million per year. And there's an opt-out after the second year.",
                japanese: "ま、今出ている情報だと、え、4年2億4000万ドル、1年あたり6000万ドルですかね。で、オプトアウト、2年目オフにオプトアウトがついているという話になっております。"
            },
            {
                startTime: 45,
                english: "I'm guessing there's probably deferred money involved. I'm pretty sure there is. But for now, the confirmed details are 4 years, $240 million.",
                japanese: "えっと、ま、きっと後払いあると思うんですけど、多分後払いあると思います。あると思うんですけど、ま、一応現時点で出てんのは4年の2億4000万ドルというとこまでですね。"
            },
            {
                startTime: 59,
                english: "There's probably no way there's no deferred money. It's decided. So yeah, breaking news.",
                japanese: "ま、さすがに多分後払いなしは起こらないと思いますね。はい、決まりました。決まったので、ま、緊急速報的。"
            },
            {
                startTime: 70,
                english: "4 years, and he could potentially leave after just 2 years if things go well.",
                japanese: "4年、4年で、ま、最短2年で出ていくことになるかな。順調に行けばというか、なんというか。"
            },
            {
                startTime: 82,
                english: "There were reports that the Mets offered around $50 million per year, but here we are. My Twitter is broken right now. Oh wait, it's fine.",
                japanese: "え、なんかメッツがね、単年あたり5000万ドルで出してたみたいな話もありましたけど、という感じになっております。Twitterが今破壊された。わあ、Twitter破壊された。あ、大丈夫、大丈夫。"
            },
            {
                startTime: 96,
                english: "Yeah, so the assumption is he'll leave after 2 years. I guess the team didn't want to give him a 1-year opt-out.",
                japanese: "2年で、そうですね、2年で出ていく前提ですね。ま、ちなみになんで1年はさすがに勘弁っていうとこでしょうか。"
            },
            {
                startTime: 108,
                english: "Oh, and there was also a trade right after the Tucker news. Passan dropped trade news too. The former Dodgers player Lux is being traded.",
                japanese: "ま、あとあのトレードもありましたけどね。え、なんかタッカードジャース入りの直後に、え、トレードのニュースまでパッさんがぶっ込んできて、しかもね、あの元ドジャースのラックスが、え、移籍するニュースだったんですけど。"
            },
            {
                startTime: 129,
                english: "Anyway. My energy is low right now. You think I'd be excited about this? There's no way I'm excited about this. But yeah, good for the Dodgers. Good for Dodgers fans.",
                japanese: "はい。え、テンション低い。テンション高くなると思うか?これで僕がテンション高くなるわけないっしょ。うん。まあ良かったね。良かったね。ドジャースさん、ドジャースファンの皆さん良かったですね。"
            },
            {
                startTime: 150,
                english: "At least it won't become a bad contract. Good for you. As for me, I'm kind of like... whatever. I'm over it.",
                japanese: "ま、不良債権になることもないし良かったですね。どうぞ。僕は、僕はもうなんかいっかなみたいな。もういいかなみたいなそんな気分になってますけど。"
            },
            {
                startTime: 167,
                english: "Speaking of which, Steve Cohen was doing that thing. You know, those hints and teases? That stuff really backfires, doesn't it? It really does.",
                japanese: "そう、コーエンね、スティーブ・コーエンが、ちょ、あのさ、まあもうこういうの、こういう匂わせみたいなのって本当ダメなんだろうな。ダメなんだと思う。"
            },
            {
                startTime: 181,
                english: "So Steve Cohen tweeted this earlier. Is this real? Yeah, this is it. Cohen tweeted asking everyone to let him know when they see smoke.",
                japanese: "スティーブ・コーエンがね、えっと、さっきこれ、これですかね?これ本物かな?あ、これだな。これ、これ、これ。スティーブ・コーエンがね、こんなツイートしてたんすよ。え、煙を、煙が見えたら教えてくれみたいなね。"
            },
            {
                startTime: 204,
                english: "When you see smoke, let me know, he said. This is a reference to the papal conclave, right? When a new Pope is chosen, white smoke rises.",
                japanese: "煙が見えたら教えてくれつったんですよね。で、これはまあ言ったらあのあれですよね。教皇コンクラーベのやつですよね。コンクラーベのコンクラーベって教皇、新しい教皇のね、決まる時ってあの煙が炊かれたらそれでね、あの決まったんだみたいな感じだから。"
            },
            {
                startTime: 225,
                english: "So Cohen was basically saying 'let me know when it's done.' Made everyone think it was going to be the Mets. And Jose Reyes, the former player, also posted 'Big Coming.'",
                japanese: "ま、言ったらもうコーエンがわざわざね、そんなこと言ってきて、ま、決まったら教えてくれよ。これはもうあのメッツなのかなって思ったりとか。ホセ・レイエスね。元のホセ・レイエスとかもそう。ホセ・レイエスもこれね、こんなこと、ビッグカミンというね、こんなこと言ってて。"
            },
            {
                startTime: 248,
                english: "I thought 'oh, this is definitely the Mets.' But what was all that about? What the heck was that? Seriously.",
                japanese: "お、もうこれメッツかなり自信、終わりですかみたいな思ったんですけども、あの、何だったんだ?ちょ、何だったんだよ。本当に。"
            },
            {
                startTime: 261,
                english: "So it ended up being the Dodgers after all. When it seemed like it was between the Mets and Blue Jays, the Dodgers, who were supposedly in third place with an unclear offer, swooped in.",
                japanese: "結局ドジャースなんかな、ま、メッツかブルージェイズかみたいな雰囲気になりてるところに、ま、その3番目の位置にいた、ま、あとオファーもどんな感じなのかよく分かってなかったドジャースがここでぶっ込んできたということで。"
            },
            {
                startTime: 281,
                english: "4 years, $240 million - I didn't really expect this. There's definitely deferred money, so we'll probably hear later how much of it is deferred.",
                japanese: "4年2億4000万ドルはなかなか、ちょっと想像だにしていなかったというか、まあ多分後払いがないっていうことはないはずなんで、ちょっとこの後多分ね、あのこのうち何ドル、どれぐらいが後払いだよみたいな、そういう話になってくるかなと思うんですけども。"
            },
            {
                startTime: 301,
                english: "Regardless of how much is deferred, this is going to be a massive contract. Even with deferrals, the AAV won't drop that dramatically.",
                japanese: "うん。後払いが、ま、いくらかにもよるけども、いくらだったとしてもすごい額になるかなと思います。後払いがいくらあったとしてもAAVはそんなめちゃくちゃ劇的に減ることないと思うから。"
            },
            {
                startTime: 320,
                english: "Even so, it'll probably stay around $50 million. Yeah, around $50 million per year will remain no matter how much they defer. Thank you for the Super Chat from Upturn Baseball. 'Wow. A Mets fan in despair.'",
                japanese: "ま、それでも多分ね、5000とか残るんじゃないかな。5000、5000万ドル前後ぐらいは残るんじゃないかなと思いますね。どんだけ後払いにしても。え、アップターンベースボールさん、スパチャありがとうございます。すごい。メッツファンの嘆き。"
            },
            {
                startTime: 338,
                english: "Yeah, Mets fans... I really thought it was going to be the Mets. I really did. But I'm also jealous of Cohen. Though I wonder if this is really Cohen's fault.",
                japanese: "ま、メッツファン。いや、ま、メッツ本当ありそうだなと思ったんだよね。ありそうだなと思ったんだけど、まあいやもコーエンはすごく羨ましいんだけど、果たしてこれコーエンの問題なのかな。"
            },
            {
                startTime: 358,
                english: "What was the sticking point for the Mets? But honestly, they might not have been able to match this offer. 4 years, $240 million - they might just not be able to compete with that. Even for Cohen.",
                japanese: "メッツはそのな、どこがネックになって、でもさ、これはこのオファーはちょっと勝てないかもしれないですね。4年2億4000万ドル普通に勝てないかもしんないですよ。コーエンだったとしても。"
            },
            {
                startTime: 373,
                english: "It's $60 million per year. I don't know the exact structure though. Is it evenly distributed at $60 million each year? Hard to say without knowing the details.",
                japanese: "単年あたり、ま、6000万。ま、どうだろうな。これどういう風なあの中身になってるか分かんないんで、4年2億4000万ドルでオプトアウトついてるけども、それ均等に6000万ドル、6000万ドルなのかって分からないから。"
            },
            {
                startTime: 385,
                english: "Thank you LF for the Super Chat. 'Honestly didn't think it would be the Dodgers. Thought it was the Mets. Well, now my Blue Jays can go all-in on Bichette.'",
                japanese: "え、LFさんスパチャありがとうございます。え、正直ドジャースはないかなと思ってました。え、メッツかなと。よし、これで我がトロントはビシェットに全力出せる。"
            },
            {
                startTime: 392,
                english: "That's right. Now the Blue Jays' chances of getting Bichette have gone way up, I think. After all this, if they miss out on both Tucker and Bichette, after going hard on Ohtani...",
                japanese: "そうなんですよね。これでトロントのビシェットの可能性がかなり上がったんじゃないかなと思いますね。まだこれでトロントこんだけ今まで暴れてきて、え、ここでビシェット、ま、タッカーは逃したと。で、次ビシェットも結局無理でしたってなったら。"
            },
            {
                startTime: 405,
                english: "Then it would be like, 'So you chased Ohtani and Tucker and Bichette, maybe even both, and ended up with just Okamoto?' That would be really awkward.",
                japanese: "じゃ、岡本でタッカーかビシェットかっていう風に、あるいはもしかしたら両方かみたいな、そういう状況になってたところにまさかのあの岡本か、で落ち着くみたいな感じになっちゃうから。"
            },
            {
                startTime: 423,
                english: "After doing all that, the Blue Jays' final move being a bit anticlimactic... they really need to lock down Bichette at this point. Now that they missed Tucker.",
                japanese: "こんだけ色々やってきてちょっとトロントの最後の一手が、ええ、なんかシリーズみたいな感じになっちゃうから、これはもうビシェットを残留させるしかないだろうね。タッカーを逃した以上は。"
            },
            {
                startTime: 442,
                english: "I don't know the present value yet. We don't know that yet. So Kyle Tucker signs for 4 years, $240 million with the Dodgers.",
                japanese: "現在価値は分からないっす。分からない。タッカーは4年2億4000万ドルでドジャース入り。"
            },
            {
                startTime: 460,
                english: "That's what we know so far. There are opt-outs after both the 2nd and 3rd year. So Tucker has two chances to opt out, which is great for him.",
                japanese: "はい。現時点で分かってんのはこれだけで、2年目オフと3年目オフのオプトアウト。オプトアウトついてますね。2年目オフだけじゃなくて3年目もオプトアウトついてますから、ま、2回タッカーからしたらチャンスがあるっていうことで、ま、これはタッカー的にはいいすよね。"
            },
            {
                startTime: 483,
                english: "If he gets injured in year 2, he can still wait until year 3. So the AAV is currently $60 million, which is second only to Ohtani's market value.",
                japanese: "2年目にちょっと怪我して思わしくなかったら3年目まで待つとかっていうのもできるから。そうだね。ま、AAV、現時点ではAAVが4、え、6000万ドルということなんで、ま、これはあの大谷に継ぐ市場。"
            },
            {
                startTime: 511,
                english: "Well, it's a short-term contract, so comparing directly is a bit different. But in terms of AAV, this is second in history. That's massive. 4 years, $240 million, okay.",
                japanese: "ま、短期契約だからね、また比較するのもちょっと違うなと思うんだけどね。このAAVで比較すると、史上2位ですね。とんでもない額になりますね。4年2億4000万であってね。"
            },
            {
                startTime: 557,
                english: "Twitter is having issues. X says there's a problem with Tucker signing with the Dodgers. Is there a problem? Apparently not, it says it's fine now.",
                japanese: "はい、Twitterで問題が発生しました。みんなタッカーのドジャース入り問題だってXが言うんだ。問題あるんだ、この契約。ちょっと問題ありますよって。Xがちょっと他の何かしがかわいそうだと思いませんかってちょっと問題らしいっすよ。あ、行けた。問題ないらしいです。すいませんでした。大変申し訳ございません。やっぱ問題ないらしいす。"
            },
            {
                startTime: 605,
                english: "Thank you Ridor for the Super Chat. You saw info that the Mets' final offer was 4 years, $200 million plus. Can't confirm if it's true. If it was really 4 years $200 million+, that's just being outbid.",
                japanese: "えっと、リドアさんスパチャありがとうございます。メッツの最終オファーは4年2億ドルプラスに達したという情報は見ました。真偽の確認はできていません。ま、僕もなんかね、4年、4年目あるみたいな話聞いたんで、ま、そうなんだろうなと思うんですけども、4年2億ドルは普通にだからオファー負けですよね。"
            },
            {
                startTime: 628,
                english: "If it was really 4 years and just over $200 million, they just got outbid. The Mets got outbid. Remember when the Mets and Dodgers both offered $320 million for Yamamoto?",
                japanese: "単純にもし本当に4年2億ちょいぐらいだったとしたらさ、オファー負けですよ、これ。だからメッツがオファー負けしたっていう話になっちゃう。確かあの山本義信の時もさ、メッツとドジャースが同額3億2000万ドルちょいだったかあれで同額で行ってましたけど。"
            },
            {
                startTime: 649,
                english: "That was a tie, so it's understandable. But this time they probably got outbid. What I'm really curious about is what the Blue Jays offered.",
                japanese: "あれもだからあれはもうだから仕方ないけど今回多分オファー負けしてると思うから、そこはちょっとね。ただ本当気になるのはブルージェイズがどんなオファーを出したかで。"
            },
            {
                startTime: 669,
                english: "There were reports the Blue Jays were willing to go 10 years. Passan said they might consider a 10-year deal. So if they really offered 10 years, why didn't Tucker take it?",
                japanese: "ブルージェイズがやったオファーのその多分長いと言われてる。しかもパッさんちょっと前にちょっと前っていうかもう本当昨日とか昨日だったかなにあのブルージェイズはタッカーに対して10年目も行ってもいいと思ってるみたいなこと言ってたんですよ。10年オファー行ってもいいみたいな唯一タッカーに10年オファーを出す可能性があるのがブルージェイズだっていうことをパッさんがあの番組かなんかで言ってたみたいなんですよね。"
            },
            {
                startTime: 695,
                english: "If they really offered 10 years and he didn't take it, that's strange. So maybe they didn't actually offer 10 years. Because $240 million for 6 years would be totally reasonable.",
                japanese: "だから仮に10年オファー出てたとしたらそっち選ばないのはもうすごく不思議だなと思うんですよね。だから実際は10年オファ出してないんじゃないかと思うけど、まあ例えば2億4000万ドルって6年だったとしても全然おかしくない数字じゃないですか?"
            },
            {
                startTime: 715,
                english: "If 6 years at $240M and 4 years at $240M were side by side, you'd obviously take the 4-year deal. I'm curious how long the Blue Jays' offer was and how different the total was.",
                japanese: "で、6年2億4000万ドルともしね、4年2億4000万並んでたらそれ4年選ぶに決まってるから。そ、ブルージェイズがどんだけ長いオファー、総額がどれぐらい違うオファーを出したのかとかがちょっと気になりますね。"
            },
            {
                startTime: 731,
                english: "By that, I mean how they got outbid. I think this was probably the best offer. Even if the AAV drops with deferred money, no one else offered more than this.",
                japanese: "それによって、ま、どういうオファーの負け方をしたのか。多分ね、これオファー1番良かったんだと思うんですよね。当然このAAV6000万ドルは仮にこの後払いでAAVが落ちたとしてもこれ以上出したところが他にあるとも思えないので。"
            },
            {
                startTime: 751,
                english: "I'm pretty sure this was the highest offer. Thank you Myu for the Super Chat. 'Blue Jays 10 years at $340 million, Dodgers breaking news...'",
                japanese: "ま、普通にこのオファーが最高額1番良かったっていうのは間違いないと思うんですよね。え、ムさんスパチャありがとうございます。トロント10年3億4000万ドル、ドジャースブレイキング…"
            },
            {
                startTime: 763,
                english: "Yeah, I had a bad feeling about this. The Dodgers were quiet while the Blue Jays and Mets were making noise. No reports about the Dodgers being behind in offers.",
                japanese: "いや、なんか嫌な予感はしてたんだよね。なんかドジャースだけちょっとね、雰囲気的にあんまりまだガッと来てないような雰囲気が出てて、具体的にブルージェイズメッツで盛り上がってた中がなんかやばいなってちょっと思ってた。"
            },
            {
                startTime: 780,
                english: "Nothing was coming out about the Dodgers. No reports of them falling behind. I thought 'this is bad' and it really was. Jim Bowden even did a poll asking where Tucker would go.",
                japanese: "ドジャースは何も出てこない。ドジャースオファーちょっと負けてますよみたいな話も出てなかったし、ま、これやばいなと思ってたんだけど本当にやばかったね。しかも誰だったかな?ジム・ボーデンだったかな?誰かがあのポールアンケートやってて、タッカーどこ行くと思う?みたいな。"
            },
            {
                startTime: 808,
                english: "I voted Mets in that poll. Jays, Mets, Dodgers, or mystery team. I picked Mets. And the Dodgers had by far the lowest votes. Everyone thought Jays or Mets.",
                japanese: "4択でさ。え、ジム・ボーデンこれ。これ僕メッツに入れたんだよね。ジェイズかメッツかドジャースかミステリーチームかみたいなやつでね、これやってて僕メッツに入れたんすよ。で、見た時にドジャースが圧倒的に低かったわけでやっぱりみんなジェイズかメッツだなって思ってる。"
            },
            {
                startTime: 827,
                english: "Based on reports, that made sense. But the Dodgers being so low in votes was scary. And then this happened in the morning.",
                japanese: "ま、そうじゃないですか。普通に今までの報道考えたらそうだけど、なんかこのドジャースの低さがもうめっちゃ怖いなと思って朝を過ごしていたら、まあこうなりました。"
            },
            {
                startTime: 844,
                english: "Thank you Neko700 for the Super Chat. 'You're working hard from noon. I'm definitely going to miss lunch because of this.' Thanks for watching.",
                japanese: "え、猫700さん、スパチャありがとうございます。お昼からご苦労様ですね。もうお昼、これはお昼ご飯食べ逃すやつだわ。ありがとうございます。"
            },
            {
                startTime: 853,
                english: "This is quite a shocking contract. Even Dodgers fans probably didn't expect this amount. But 4 years is actually pretty good.",
                japanese: "これはでもね、なかなかね、ま、結構ショッキングな契約だなと思いますね、やっぱり。ドジャースファンでもちょっとこれこの金額は全然予想してなかっただろうし。でも4年ってね、正直言うと結構素晴らしいと思いますね。4年。"
            },
            {
                startTime: 872,
                english: "A 1-year opt-out would be ideal, but for an injury-prone player, the team probably didn't want that. Minimum 2 years, max 4 years is great.",
                japanese: "ま、多分それは1年目オフにオプトアウトつけられたら1番いいんだけど、ま、怪我案件でもあるしそこまでは多分ドジャースやりたくなかったと思うんだよね。で、最短2年で最長4年でしょ。まあ、素晴らしいよね。"
            },
            {
                startTime: 890,
                english: "Even at Tucker's age, I don't see this becoming a bad contract. Unless he has a major injury like Tommy John, it won't become a bad contract.",
                japanese: "今のタッカーの年齢考えたとしても、ま、これで不良債権化する未来は特に見えない。ま、大怪我してトミージョンやってみたいなそんなことがない限りは、ま、不良債権化することはないでしょうし。"
            },
            {
                startTime: 904,
                english: "Regarding the cost-performance issue, players with similar performance to Tucker exist. But the performance itself is high. For a team that doesn't need to worry about cost-performance, performance is what matters.",
                japanese: "あの、高いそのコスパの問題で言うとタッカーと同じぐらいのパフォーマンスを最終的に出せる選手って、ま、きっと他にもいるわけですよね。だけどそのパフォーマンスは高いのは高いですよ。コスパを考えるチームではないから。"
            },
            {
                startTime: 917,
                english: "For the Dodgers, what matters is how high the performance is, not the cost. Tucker, if healthy, could potentially put up MVP-level numbers.",
                japanese: "ドジャースはそういうチームにとって重要なのはコストの方じゃなくてパフォーマンスがどれだけ高いかっていうところで、タッカーはまあ怪我がなければうまくいけばMVPみたいなパフォーマンスを出せる人なので。"
            },
            {
                startTime: 937,
                english: "For a team like the Dodgers that doesn't have to care about cost-per-performance, this contract probably won't become a problem.",
                japanese: "だからドジャースみたいなそのコストを気にしなくていい。コスパを気にしなくていい。パフォーマンスだけ見てたらいいみたいなチームにとっては、ま、この契約とかってのもそう問題になることは多分ないと思いますね。"
            },
            {
                startTime: 969,
                english: "If it was a 10-year deal, that's different. But being able to use Tucker in his prime on a short-term contract, honestly you'd pay any amount.",
                japanese: "ま、これが10年とかだったらまだ話違うんですけども、今全盛期のタッカーを短期で使えるっていうこと考えたら、ま、正直いくら出してもいいみたいな。"
            },
            {
                startTime: 980,
                english: "The Dodgers have already exceeded the luxury tax threshold. If they pay $60 million in year one, they have to pay 110% on top of that.",
                japanese: "で、それによって、ま、ドジャースもあのAAV、えっと、贅沢税のね、あの、超過してますから、ま、ぶっちゃけこの仮に1年目6000万ドル仮に払うんだとしたら、その6000万ドルに対して110%の贅沢税を払う。"
            },
            {
                startTime: 1007,
                english: "They've probably exceeded $300 million now. With Tucker, the current AAV count is showing $60 million, but there's probably deferred money involved.",
                japanese: "今もう3億ドル超えてるよね。多分超えてると思うんだけど。ま、これもあ、タッカーが入ったことで今AAVがもうタッカーこれ6000万ドルで一旦カウントされてますけども、ま、おそらくこれはこの後払いでAAV実はもうちょっと低いんだよみたいな話になってくると思います。"
            },
            {
                startTime: 1039,
                english: "Until we get the deferred money info, it's counted at $60 million. According to Fangraphs, it's almost $400 million total. That might be the first team ever.",
                japanese: "なってくると思うんだけども、現時点でこの後払い情報がない以上は現時点で6000万ドルでカウントするよね。そうするとファングラフスによるとほぼ4億ドルです。え、ま、ついに初めてかな。"
            },
            {
                startTime: 1051,
                english: "If they make more moves, they might be the first $400 million team. But the AAV will probably go down, so it won't be that high.",
                japanese: "もしこれでさらに、ま、補強したりしたら、ま、4億ドルって初めてのチームになるわけだけど、ま、実際はAAV下がると思いますから、これにはならないはずだけど。"
            },
            {
                startTime: 1065,
                english: "We might be entering the $400 million world. My guess is the AAV will drop to around $50 million.",
                japanese: "ま、あの、4億ドルの世界に突入するかもしれないという状態になってますね。で、ま、おそらく僕の勘だと5000万ドル前後ぐらいまで多分AAVが落ちるんじゃないかなと思うんです。"
            },
            {
                startTime: 1081,
                english: "Even then, it'll be just under $400 million. As I said, they have to pay 110% luxury tax. So $60 million means $66 million in luxury tax on top.",
                japanese: "そしたとしても、ま、ま、4億ドル手前ぐらいですかね。で、え、さっきも言ったんですけども110%の贅沢税を払う必要があります。つまり6000万ドルだとしたら、え、6600万ドルの贅沢税をここにプラス払うことになるから。"
            },
            {
                startTime: 1096,
                english: "Essentially, they're paying $126 million for one year of Tucker when you factor in luxury tax. That's a massive amount for one player.",
                japanese: "ま、ぶっちゃけその1年のタッカーに、ま、1億2600万ドル払ってるみたいなもんになるわけなんですよね。その計算上は贅沢税も込みで考えると今回の獲得によるコストってのはそれぐらいかかってくる。すごい額になりますね。1人の選手に。"
            },
            {
                startTime: 1120,
                english: "Thank you for the Super Chat. 'Will they also trade for an infielder?' The infield is probably fine now. With Tucker, second base goes to Edman.",
                japanese: "え、スパチャありがとうございます。タッカー獲得によってトレードで内野も補強してきたら笑う。内野はまあもういいんじゃないかな。これでタッカー入ったところで今セカンドがこうエドマンになった。"
            },
            {
                startTime: 1136,
                english: "So center is Edman and Pages is in left or right. Oh wait, right is Teoscar. So left is Pages. With Tucker in right, I think.",
                japanese: "だからセンターがエドマンでパヘスがこのライトとかレフト。あ、ま、ライトはテオスカだったな。で、これレフトがパヘスだったところを。"
            },
            {
                startTime: 1150,
                english: "Tucker is going to right based on his career. With Edman at second, there are no holes in the starting lineup anymore. Kim was in at second before.",
                japanese: "タッカーがライトに入るのかわかんないけど、ま、タッカーこれまでのキャリア考えたら普通はライト選ぶよね。で、エドマンがセカンドになったらもこれで一応先発レベルのところに一切穴がなくなったん。これまではここにキムヘソンがセカンドに入ってたんですけども。"
            },
            {
                startTime: 1175,
                english: "Kim is now in the minor league depth on Fangraphs. Pages can play good defense in center, and Tucker isn't bad at defense either.",
                japanese: "これがなくなったんで、ま、これでキムヘソンなんだったらもうマイナーのとこにね、ファングラフスだと落とされちゃいましたけど、マイナー落ちるからね。テオ、あの、キムヘソンは。だから守備面って考えてもパヘスはセンターで、ま、いい守備を見せるわけだから。"
            },
            {
                startTime: 1195,
                english: "If Teoscar goes to left, that's probably the cleanest setup. But I don't think they'll do more infield moves. They got Ibañez as a utility backup.",
                japanese: "もう本当にタッカーも別に守備悪いわけじゃない。そうするとセンターで、ま、レフトにテオスカを回せるんだったらこれが1番綺麗な形にはなるのかなと思いますね。ま、ただ内野は多分もうしない。こないだね、前、あの、控えレベルだとイバニエスがもう取ってきてましたけど。"
            },
            {
                startTime: 1211,
                english: "Thank you Onsen for the Super Chat. 'As a Dodgers fan, let's meet at next year's salary cap introduction. Small market teams can't win.'",
                japanese: "え、温泉さんスパチャありがとうございます。ドジャーファンですが、来年のサラリーキャップ導入でお会いしましょう。スモールマーケットチーム勝てんて。"
            },
            {
                startTime: 1223,
                english: "Yeah, that's true. Spending this much on one player is just... The Mets probably could if they really wanted to, but yeah.",
                japanese: "ま、そう、まあそうですね。ま、1人の選手にここまでの額出すのはちょっともう。ま、メッツは多分本当に本気でやろうとすればできるけど、まあそうだね。"
            },
            {
                startTime: 1238,
                english: "Small market teams definitely can't do this. If they put out this kind of offer, no one can compete. That's the reality.",
                japanese: "スモールマーケットチームには絶対できないから、ま、本気のオファーには勝てないですね。このオファー出してきたら、ま、どこも勝てないっていうのが現実問題ですね。"
            },
            {
                startTime: 1252,
                english: "Thank you Shiwachi for the Super Chat. 'Why did the Mets want Tucker on a short-term deal so badly? Their moves this season lack consistency.'",
                japanese: "え、しわっちさん、スパチャありがとうございます。というかメッツはなぜそんなに短期タッカーが欲しいんですか?今シーズンの動きに一貫性なくないですか?"
            },
            {
                startTime: 1272,
                english: "Their moves are consistent. One consistency is the Mets want to keep deals short, around 3 years or less. That's the thinking.",
                japanese: "今シーズンの動きに一貫性はあります。1つの一貫性はメッツは短期でとにかく抑えたいという感じですね。え、3年までで抑えたいっていう考え。"
            },
            {
                startTime: 1284,
                english: "Maybe they only offered up to 3 years to Tucker too, or maybe 4 years was acceptable given his age of 29. The consistent policy is no long-term contracts.",
                japanese: "ともしかしたらタッカーにも3年までしか出してなかったのか、本当に4年目出したのか、ま、4年ぐらいだったらいいだろうとタッカーの年齢だったらね、今29歳と思うんですけども、え、1つの間違いなくある一貫性っていうのは長期契約は出さない。短期で収めたい。"
            },
            {
                startTime: 1305,
                english: "This isn't Cohen's decision, I don't think. Probably Stearns' style. So even if the per-year amount is really high, if it's short-term, that's best.",
                japanese: "で、これは別に公園の移行だとは思わないです。公園の移行じゃなくて、おそらくは、ま、想像するに、ま、スターンズの移行なのかなと。ま、スタイルというかそういうことなのかなと思うんですけども。"
            },
            {
                startTime: 1325,
                english: "They don't want high-value long-term contracts except for Soto. That's the situation. If they offered 7-8 years at $50 million AAV, they probably would have won.",
                japanese: "なのでその1年あたりがすごく高額だったとしても短期で納められるんだったらそれが1番いいよねっていう話で、ま、外以外はもう現状あまり高額長期契約ってのは持ちたくないよっていうのがそういう状況だと思いますね。ま、だから仮にAAV5000万ドルで7年8年みたいなオファー出したら勝てただろうけど。"
            },
            {
                startTime: 1358,
                english: "But they simply got outbid this time. Thank you for the Super Chat about Judge's contract. Yes, that's how it works - inflation makes contracts look better over time.",
                japanese: "ま、単純に今回はオファーで負けてると思いますね。え、スパチャありがとうございます。ジャッジの契約ってま、こんな感じですよ。インフレだから例えばあの外野の契約とかも今高いって言ってるけど。"
            },
            {
                startTime: 1370,
                english: "Soto's 15-year deal - by year 10, if he's still performing, it might look like a good deal. Judge's contract was the highest FA deal in 2022.",
                japanese: "あれ15年契約なわけで10年目ぐらいになった時に外がずっと立派な成績を残してたらま、意外と悪くない契約だったねみたいな。ま、今の基準で言うと高いんだけども数年後、ま、下手したらジャッジの時なんて2022年であれはFA市場最高額の契約だったわけですよ。"
            },
            {
                startTime: 1388,
                english: "Now 3-4 years later, Judge's deal looks cheap. Long-term contracts can look better over time if the player keeps performing.",
                japanese: "あれでもね。ま、ところが、ま、それがどんどんどんどん更新されてて、今もう3年4年ぐらいでもうジャッジ安すぎるみたいな感じになるわけなんで、ま、当然本人の活躍がずっと続いてるという前提になりますけども。"
            },
            {
                startTime: 1401,
                english: "Long-term contracts might look reasonable after a few years. That's how it goes. So this is Cohen's fault? I don't think it's Cohen's fault this time.",
                japanese: "ま、長期契約なんて数年経ったら、ま、意外とそうでもなかったなみたいな気持ちになる時がある。活躍し続けてると前提ですけどね。そんなもんなんすよ。え、公園どっか行け。公園のせいじゃない気がするんだよな、今回。"
            },
            {
                startTime: 1428,
                english: "Did the Mets really need to compete for this? If they absolutely had to have Tucker, that's different.",
                japanese: "あの、しかもさ、メッツがここに付き合う必要あったかなって考えたらどうしても絶対にタッカーじゃないといけないとかって言うんだったら別だけど。"
            },
            {
                startTime: 1447,
                english: "With Soto, they absolutely wanted him. If they really wanted Tucker that badly, they could have offered a longer deal. But they didn't want to break their policy.",
                japanese: "公園はね。うん。ま、外の時はもう絶対欲しい。だからつまりタッカーも絶対欲しかったら長期契約を出せば良かっただけの話で、そこを出さないっていうことはもう方針を多分ブレさしたくないんだと思うんだよね。"
            },
            {
                startTime: 1467,
                english: "They probably didn't have to have Tucker specifically. He was just the best available option, not a must-have target.",
                japanese: "だからどうしてもタッカーじゃないといけない理由もなかったんじゃないかなと思うんですよね。だから実際はまあ、結局総合的に考えてここまで無茶する意味が今あるのかって話。"
            },
            {
                startTime: 1483,
                english: "If getting Tucker guaranteed a championship, they'd pay anything. But the Dodgers adding Tucker fills their last piece. For them, Tucker was more necessary.",
                japanese: "タッカーを取ったら確実に優勝できるんだったらタッカーいくらでも取ると思うけど、今のドジャースにタッカー来たらもうあの隙なしっていう状況にできるからそういう意味でタッカーが最後のピースになり得るかっていうところで考えたら。"
            },
            {
                startTime: 1507,
                english: "The Dodgers wanted him more, right? Thank you for the Super Chat. 'What are the odds of a salary cap?' I still think it's low.",
                japanese: "ま、ドジャースの方が欲しいと高いよねみたいな感じにはなりますよ。え、スパチャありがとうございます。実際サラリーキャップが導入される確率ってどんくらいですかね?うーん。ま、僕はまだ低いと思ってますけど、こういう状況ですけど、まだ低いと思ってますけどね。"
            },
            {
                startTime: 1527,
                english: "If they introduce a salary cap, they need a salary floor too. I don't think MLB has the capacity to implement that right now.",
                japanese: "サラリーキャップ入れて、じゃあサラリーフロアも入れてみたいな話で、こう本気で整備し始めたらじゃ、今のメジャーリーグにそういうまでできる余裕はないと思うんですよね。"
            },
            {
                startTime: 1546,
                english: "But teams can't compete with the Dodgers' spending level. Mets and Blue Jays are big spenders too, but most teams can't keep up.",
                japanese: "うん。ただそのドジャースレベルの天井に付き合えってドジャースとかメッツとかこの辺のま、今だったらブルージェイズもすごいですけどこの辺のレベルの天井に付き合えって言われたらちょっともう付き合えない。どう頑張っても付き合えないチームがいっぱいありますから。"
            },
            {
                startTime: 1574,
                english: "Something needs to change. The current luxury tax isn't a deterrent for the Dodgers. Maybe they'll enhance the luxury tax penalties instead of a hard cap.",
                japanese: "ま、なんかしらま、今贅沢税がまあ無意味かな。このドジャースにとっては少なくともあの贅沢税っていうルールは全然抑止力にはあまりなってないような感じはしますけど。だからもしやるとしたら現行の贅沢税というルールをもうちょっと。"
            },
            {
                startTime: 1598,
                english: "Rather than a hard cap, they might evolve the luxury tax. That way they don't need a salary floor, making it easier to agree on.",
                japanese: "うんサラリーキャップって新しい形にするんじゃなくて、さらにこの贅沢税をなんか進化させるというかここをいじるしかないと思うんですよね。で、そこだったらま、フロアを設けなくていいからもうあの合意しやすいみたいなところあるかもしれないです。"
            },
            {
                startTime: 1625,
                english: "Thank you Roshi's Diary Channel for the Super Chat. 'I'm done. The evil empire is now the Dodgers. They've surpassed the peak Yankees.'",
                japanese: "え、ロシの日記チャンネルさんスパチャありがとうございます。お疲れ様でした。さすがにちょっと行きました。悪の帝国ドジャース。ま、これはもうドジャースはもうね、もうヤンキース顔負け。全盛期ヤンキースも顔負けじゃないかな。"
            },
            {
                startTime: 1652,
                english: "What are the Yankees doing? Well, yesterday the Red Sox signed players. Another one of the Yankees' rivals got stronger.",
                japanese: "ヤンキース何してんですか?ま、ヤンキースもね、あの、ま、昨日はレンジャーですがね、レッドソックス行っておい、またヤンキースの敵が補強されたぞみたいな感じだったんですけども。"
            },
            {
                startTime: 1670,
                english: "The Yankees need to sign a big FA too. At this point, it's probably only Bellinger left for them.",
                japanese: "ヤンキースもFA大物ドッカン。ま、ここで言うともうベリンジャーしかないのかなと思うんですけどね。"
            },
            {
                startTime: 1690,
                english: "Thank you H for the Super Chat. 'This empire is worth fighting against. At least we have something to root for.' Do you really though?",
                japanese: "え、Hさんスパチャありがとうございます。この帝国に立ち向かっていくチームのファンで本当に良かった。倒しがいしかない。応援の死骸がある。応援の死骸ある?あるか本当に?"
            },
            {
                startTime: 1704,
                english: "Well, what's good about MLB is that even if you can't win the division, you can make the playoffs through wild card. There are 3 wild card spots now.",
                japanese: "まあでもあのメジャーリーグのいいなって思う点、あの優勝だけしかポストシーズンに出られないんだったら面白みもう本当に意味ないなって気持ちになっちゃう。現時点なんだよね。シーズン始まったらなんだかんだと応援するんだけど。"
            },
            {
                startTime: 1731,
                english: "With 3 wild card spots, teams aren't trying to compete directly with the Dodgers for the division. Just make the playoffs and anything can happen.",
                japanese: "ま、例えば何しの他のチームのファンがいやもうこんなんでは意味ないんだったら応援しても意味ない。どうせ今年もちドジャースみたいな気持ちになっちゃうけども、ま、メジャーリーグは少なくとも今えっとね、こない何年か前に拡張もされてワイルドカードの枠があってワイルドカード3枠もあるわけですから。"
            },
            {
                startTime: 1764,
                english: "The strategy of aiming for wild card and hoping something happens in the postseason hasn't changed, whether Tucker joined the Dodgers or not.",
                japanese: "ま、そこ元々もはやその優勝でバリバリドジャースと張り合おうじゃなくて、やっぱワイルドカードでポストシーズン行ってポストシーズンにさえ行けば何かが起こるかもしれないみたいな、そういう感じでいけるから。"
            },
            {
                startTime: 1798,
                english: "Whether Tucker is there or not, 99% of people would predict the Dodgers to win the division anyway. The wild card strategy hasn't changed for other teams.",
                japanese: "まだありがたいとこですよね。もう正直タッカーが入ろうがいまいが、ま、ドジャースが地区優勝するだろうって、ま、99%の人が予想するわけですよね。そう考えたらワイルドカードを元から狙ってたところっていう方針は何も変わってないわけですよね。他のチームの。"
            },
            {
                startTime: 1819,
                english: "Maybe internally teams are aiming for the division, but realistically they're targeting the wild card and hoping for the best in the postseason. Nothing has changed.",
                japanese: "ま、もしかしたら内部ではね、しっかりいや、もう地区優勝狙っていこうで、もう当然やるんだろうけど、やるだろうけど、現実的に考えた時にワイルドカード狙いでポストシーズンに行ってなんとかしましょう。ここは何にも変わってないと思いますね。"
            },
            {
                startTime: 1854,
                english: "Thank you for the Super Chat. Sorry for the harsh words about Cohen. Stearns, get out of the way?",
                japanese: "え、スパチャありがとうございます。公園ひどいこと言ってごめんね。スターンズお前どけ?"
            },
            {
                startTime: 1867,
                english: "Stearns... well, they haven't made any pitching moves in free agency. No trades either. Later, maybe I'll have to apologize to Stearns if things work out.",
                japanese: "スターンズはただちょっとでも結局FAで、ま、ピッチャーも補強してない。ピッチャーも全然動いてないんだよね。あの、トレードもしてないし。ま、この後スターンズにいや、あのスターンズさんちょっと方針にあの疑問を呈してすいませんでしたみたいにいう展開が来るかもしれないですけども。"
            },
            {
                startTime: 1896,
                english: "I still wonder if Stearns is really a good fit for the Mets. But they gave Soto that huge deal, so why not spend more aggressively?",
                japanese: "まあどうなんだ。そのスターンズが本当にメッツに合ってるのかどうかってちょっと未だに疑問があるけども、なんか外にあれだけのことしたんだからそこは一貫持ってこうもっと金使ムーブして欲しいなみたいなとこ。"
            },
            {
                startTime: 1914,
                english: "Thank you Lindor for the Super Chat. 'As a Mets fan, once the AAV exceeded Soto's, I figured it wasn't us.' Single year is different from 15-year deals though.",
                japanese: "え、リンドアさんスパチャありがとうございます。メッツファンだと外の規模を超えるAAVの契約がなった時点でうちじゃないかなとなった気がします。ま、単年だからね、やっぱ15年くらいの契約とはまた全然違うかなと思うんだけど。"
            },
            {
                startTime: 1935,
                english: "This amount is a bit unprecedented. Even for the Mets, going this far might be too much.",
                japanese: "さすがにちょっとこの金額はあの規格外すぎていくらなんでもっていう感じはするかな。さすがにちょっとメッツであってもここまで乗っていくのはちょっと違うかもなっていう。"
            },
            {
                startTime: 1950,
                english: "Tucker is a great player of course, but... Well, if he was their absolute must-have target at their exact position of need, they should have gone for it.",
                japanese: "そこまでは、うん。ま、タッカーっていう選手が素晴らしいのはもちろんなんだけど、けどそうだな。ま、元々補強ポイントドンピシャでもう絶対大本命この選手を取るしかないっていう選手だったら行けばよかったと思うんだけどね。"
            },
            {
                startTime: 1976,
                english: "It wasn't like that. He was just the best available option. Plus the Mets have great prospects coming up in outfield and pitching.",
                japanese: "そうじゃないからね。今いる中で1番いい選択肢かなみたいな感じで。ま、あとメッツは、えっと、ま、外野もそうだしピッチャーもそうなんだけど、若手がすごくプロスペクトが充実してるチームなので。"
            },
            {
                startTime: 1997,
                english: "Stearns' style is probably to let those young players develop. Only spend big on sure things like Soto. That's probably best for the long term.",
                japanese: "ま、スターンズの好みから考えるとその辺を育てていく。で、ま、あくまで外クラスとかっていう本当に間違いないぞみたいな選手に関してだけお金を使うみたいな感じが1番長期的に考えたらいいっていう方針なんだろうと思うし。"
            },
            {
                startTime: 2022,
                english: "That's not wrong, but it's different from what Mets fans expect. Thank you Boseido for the Super Chat.",
                japanese: "それは別に間違ってはないと思うんだけども、ま、メッツファンが期待してるものとちょっと違うよなとは思います。えっと、え、補正グレアさん、スパチャありがとうございます。"
            },
            {
                startTime: 2049,
                english: "Maybe the last infield utility piece will be Jose Iglesias now that the Dodgers are set. Could he end up with the Dodgers?",
                japanese: "もうこれワンチャン補正イグレシアス。もうドジャースやろ。もうこれナイアの最後の控えのピースが補正イグレシアスになる可能性。歌っちゃう。ドジャースタジアムで。"
            },
            {
                startTime: 2069,
                english: "Jose Iglesias going to the Dodgers would actually be a bit shocking for me. I'd rather he go to the Padres - they need a backup shortstop and McCoy isn't great.",
                japanese: "でも補正イグちょっとドジャース行ったら割とショックだな。いや、それだったらあのパドレスで是非ショート守れる控えがね、マッコイなんだよね。マッコイと補正だったら補正イグの方がいい気がするね。お値段次第だけど。"
            },
            {
                startTime: 2102,
                english: "Thank you Mu for the Super Chat. 'The last two years, MLB has been exciting because of the Dodgers. Would be better if there was a chance to beat them though.'",
                japanese: "なんだろうな。補正イグドジャースはちょっとショックかもしれない。え、ムさんスパチャありがとうございます。なんやかんや言ってこの2年MLB盛り上がってるのはドジャースのおかげですよ。ま、ドジャースを倒す余地があればもっと良かったですけどね。"
            },
            {
                startTime: 2130,
                english: "There is a chance though. These past two years, the Padres weren't that far behind in the regular season. There were moments where they were in first place.",
                japanese: "ま、余地はあるんだけどね、実際。この2年結局、え、レギュラーシーズンで言うとパドレスはそこまで絶望的に離されたわけじゃないし、一瞬首位に立ったりみたいな瞬間もあったわけで。"
            },
            {
                startTime: 2157,
                english: "In the regular season, there were moments where you thought 'maybe we can beat the Dodgers.' That's what makes baseball interesting despite all their spending.",
                japanese: "意外とまあレギュラーシーズンでこうちょっとこれもしかしてドジャース倒せるかみたいなシーンとかがあったわけですよね。こんだけ補強してて、ま、そこが野球面白いなって思うとこなんだけど。"
            },
            {
                startTime: 2180,
                english: "But last year they got Snell, Teoscar, then Sasaki, Tanner Scott... they keep getting the top free agents at each position every year.",
                japanese: "ところがまあ結局だから去年もスネルとか取ったし、ま、テオスカ、で、スネル取ってきて佐々木取ってきてタナースコット取ってきてっていう感じで、ま、毎年結局FA市場の、ま、そのポジションにおける最高の大物目玉選手を、ま、取り続けてますね。"
            },
            {
                startTime: 2219,
                english: "This year I thought they wouldn't go this far, but they got Edwin Diaz the top reliever and Kyle Tucker the best position player. Two big injury risks.",
                japanese: "今年はそこまでいかないんじゃないかって言ってたら結局リリーフで1番最高峰だったエドウィン・ディアスとそもそもFA市場で1番最高峰って言われていたカイル・タッカーのま、2枚取りっていう。しかもま、怪我案件2つっていう感じになりましたから。"
            },
            {
                startTime: 2260,
                english: "They'll lose their 2nd, 3rd, 5th, and 6th draft picks as a penalty, plus international bonus pool money. But it's worth it for them.",
                japanese: "ま、これでね、2番目と3番目とえっと、5番目と6番目の、え、ドラフト指名権を失うことになって、え、国際FAのボーナスプールとかも結構飛ぶんだけどね。"
            },
            {
                startTime: 2291,
                english: "Thank you for the Super Chat. 'Does the regular season even matter for the Dodgers?' Well, surprisingly these past two years it was competitive.",
                japanese: "え、スパチャありがとうございます。え、ドジャースってレギュラーシーズンする意味あるんですか?ま、意外とね、この2年意外とできたから、まあ、あるのかもしれないし、なんだかんだ盛り上がるのかもしれないけど。"
            },
            {
                startTime: 2321,
                english: "Tucker has had injuries and isn't a complete 100% healthy player. He's great but he's not adding another Ohtani. There are gaps.",
                japanese: "そのタッカーもね、故障したりとかして、ま、万全な100%万全な選手ではないと思うし、このコンプリートプレイヤーでもない。素晴らしい選手だけど、ま、別にその大谷翔平が増えてってるわけじゃないから。だから、ま、隙はあるとは思うんだけど。"
            },
            {
                startTime: 2363,
                english: "On paper, there's no weakness. Once the season starts, injuries happen. Like Betts' slump last year was unexpected.",
                japanese: "まが、そのなんだろう、ペーパー上の隙はないよね。シーズン始まったらやっぱりね、怪我したりとか。ま、去年もベッツのあ、あれだけシーズンとしての不調、最終的に調子上がったけど、ずっとこう不調になったみたいなのって想像できなかったじゃないですか。"
            },
            {
                startTime: 2399,
                english: "Betts declining significantly wasn't expected. With a roster this stacked, there might still be tough moments. But regular season rewards depth and consistency.",
                japanese: "ベッツがこの段階で成績を落としてくる。大幅に落とすっていうのはね、想像できなかったし、だから、ま、なんかしらやっぱりね、こんだけの陣容揃えてもこう苦しい瞬間みたいなので出てくるかもしれないですけど。ただ、ま、結局レギュラーシーズンって自力が強いチームが勝つ、デプスが強いチームが勝つ。"
            },
            {
                startTime: 2430,
                english: "The regular season can't be won by momentary luck. Even with ups and downs, the Dodgers winning the division is 99.5% likely.",
                japanese: "ま、瞬間的な運ではやっぱりレギュラーシーズン取れないですね。そう考えると、ま、なんだかんだもしかしたらシーズン色々あるかもしれないけど、最終的にはやっぱりドジャースが地区優勝する確率99.5%ぐらいかなと思いますね。"
            },
            {
                startTime: 2459,
                english: "Their starting rotation has injury concerns, but their depth is insane. There's really no weakness.",
                japanese: "まあ、先発ローテもね、故障、故障っていうところからどうしてもね、ありますけど、ただま、デプスはもうは本当にすごいですから。うん。まあ、弱点は特にないかな。"
            },
            {
                startTime: 2478,
                english: "Thank you Mr. Oka for the Super Chat about trade restrictions. Money-only penalties aren't enough. Maybe something like NBA's apron system?",
                japanese: "え、ミスターオカさん、スパチャありがとうございます。贅沢税や国際FAやドラフトのめちゃめちゃでかいペナルティがトレードに関して制限ができるとかそんなんじゃないと意味がなさそうな気がします。そうですね。お金以外のところでの縛りを大きくするしかないのかな。NBAのエプロン制度みたいな導入とかしんどですかね。"
            },
            {
                startTime: 2510,
                english: "I don't know much about NBA contracts. I just watch games casually. Many MLB fans who also follow NBA mention the apron system.",
                japanese: "僕エプロン制度実はあんまり詳しくないんですよね。あんまりあのNBAとかに関しては契約とかそっち周りとか全然興味持ってなくて普通にプレイ見てわあみたいなレベルなんで。あんまり興味ないんですけど結構みんなねあのメジャーリーグファンもねNBAとこう掛け持ちでやってるファンの方はねこのエプロン制度については結構言ってますよね。"
            },
            {
                startTime: 2545,
                english: "NBA has things like super max contracts. But basketball is different - one player has huge impact. In baseball, one player doesn't change everything dramatically.",
                japanese: "ま、NBAはね、またあの、例えば契約とかスーパーマックス契約とかなんかこう契約に関しては色々と違うところがあったりとかするんですけども、どうなんだろうな。いや、バスケって1人当たりのインパクトがえぐいからね。いくら金かけたとしてもその1人あたりのあの影響力。"
            },
            {
                startTime: 2577,
                english: "In baseball, one player alone can't create dramatic changes. In basketball, swapping one of five players makes a huge difference.",
                japanese: "野球って1人入ったから劇的にみたいなのってその1人だけでは起こり得ないと思うんですけどもバスケはね5人のうちの1人入れ替わるだけでも相当そういうことになりますからね。"
            },
            {
                startTime: 2610,
                english: "But you're right - non-money penalties need to be stricter. Either a hard cap with an absolute ceiling, or stricter penalties beyond money.",
                japanese: "までもおっしゃる通りお金じゃないところのペナルティをきつくするっていうま、ハードキャップじゃないんだったらハードキャップっていわゆる絶対に超えられない上限を作るか、それができないんだったらそのお金以外のペナルティを厳しくするじゃないと厳しいのかもしれないですね。"
            },
            {
                startTime: 2649,
                english: "Maybe future luxury tax reforms will go in that direction. They probably won't do a salary cap with salary floor - more likely to expand the luxury tax.",
                japanese: "もしだから今後は贅沢税をそっち方面で強化することになるかもしれないと思います。結局サラリーキャップ、サラリーフロアみたいなのはできなくて贅沢税を、ま、拡大する。"
            },
            {
                startTime: 2689,
                english: "Though the luxury tax threshold should probably be raised considering inflation. The annual increase doesn't match reality.",
                japanese: "ま、とはいえ贅沢税の上限自体もうちょっと上げた方がいいなと思うんですけどね。このインフレのこと考えたら実際ね、今までその合ってないからこの贅沢税の毎年数万ドル上限が上がっていくみたいな全然あってないんで。"
            },
            {
                startTime: 2721,
                english: "Stricter penalties at the top is fine, but the base threshold should match reality. Less than 10 teams even exceed the luxury tax - most teams are unaffected.",
                japanese: "ま、あの、その上の方のペナルティきつくするのはいいとしても、とりあえずね、贅沢税はもうちょっと世の中の流れにあったあの金額にした方がいいと思いますね。いくらまあて言っても贅沢税超えているチームって本当10チームもないわけなんで、ま、あの他のね、20何チームには関係ないっていう話なんですけども。"
            },
            {
                startTime: 2762,
                english: "The threshold should be raised more dramatically. Thank you Mu for the Super Chat about no big free agents coming in the next 3 years being a factor.",
                japanese: "これの枠はちょっと上げた方がいいとは思いますね。もうちょっと劇的に。え、ムさんスパチャありがとうございます。この先に3年大物が全く出てこないのも動かざるを得なかった理由ですかね。"
            },
            {
                startTime: 2787,
                english: "Contract extensions keep players off the FA market. The next year or two look weak. Plus there might be a lockout next year.",
                japanese: "ま、ね、契約延長とかもね、割とあるあって、こうFAにあんまり選手が出てこないみたいなのってよくあります。んで、ま、あの、村上の時にも言いましたけど、2年後とかも割と弱めだったりとか。ま、さらにこっから契約延長したらもっと弱めになったりとかって色々ありますから。"
            },
            {
                startTime: 2832,
                english: "Next year's situation is completely uncertain. We don't even know if there will be a season with a potential lockout. Spending now to secure 2-3 years of control makes sense.",
                japanese: "ま、特に来年に関してはもう全く計算できない。来シーズンはそもそもあるかどうかも不吉ですけどそこも分からないしやっぱりロックアウトした時にどれぐらいのあの補強に対する影響が起こるのか。えあとは自由に補強ができるのかみたいなこと考えたらまここで今来年分も補強しておくっていうのが絶対やっとくべきだと思うんですよね。お金あるチームは。"
            },
            {
                startTime: 2878,
                english: "Trades for 2-3 year control players work too. Even with opt-outs, minimum 2 years control is ideal for the Dodgers.",
                japanese: "だから、ま、トレードでね、2、3年保有できる選手を獲得してくるでもいいし、ま、こうやってオプトアウト付きだったとしても最低でも2年間保有できるってのはドジャースこれはあのベストだったんじゃないかなと思いますね。"
            },
            {
                startTime: 2912,
                english: "Thank you Chibayama for the Super Chat. 'Is this Tucker contract a tailwind for Bellinger? And the Angels made a trade!'",
                japanese: "千葉山さんスパチャありがとうございます。このタッカーの契約でベリンジャーに追い風ですか?あとエンゼルストレード来てやった。"
            },
            {
                startTime: 2939,
                english: "For Boras, this definitely won't be a headwind for Bellinger. The ages are different but opt-outs are still possible.",
                japanese: "ま、あのボラス的にはこれが逆風になることはまずありえないですね。だから、ま、タッカーと年齢ちょい違うけども、ベリンジャーもまだまだそのオプトアウト付きになる可能性もはらんでると思います。"
            },
            {
                startTime: 2960,
                english: "Yankees reportedly offered 5 years. He's asking for 7. It's not exactly a tailwind but not a headwind either.",
                japanese: "で、でもね、5年とか少なくともは5年契約のオファーはヤンキースはしてるって言われてるし、これがま、7年要求してるって言うけども逆風にはならないけども、言うほどちょっと追い風にもならないのかなみたいな感じはしてますね。"
            },
            {
                startTime: 2987,
                english: "As for the Angels trade. Jeff Passan tweeted about a three-way trade between the Rays, Reds, and Angels. Josh Lowe goes to the Angels.",
                japanese: "あとエンゼルスのトレードはね、これジェフ・パッサンさんがあの言ってますけど、えっと、ま、少なくともタッカー追ってたチーム、例えばメッツあたりがもしベリンジャーの方にもインしてきたらそれはまた加熱するかもしれないからその点には追い風っていうかもしれないですね。"
            },
            {
                startTime: 3005,
                english: "Every year the present value record gets broken. Wow. I knew it would happen eventually with Soto, but I didn't expect Tucker to break it.",
                japanese: "毎年現在価値最高額毎年更新されるやん。マジかよ。外までは分かったけどタッカーで更新されるとは。"
            },
            {
                startTime: 3020,
                english: "Thank you Tanaka for the Super Chat. Today is crazy. Tucker to the Dodgers, Kershaw in the WBC, the three-way trade. Maybe I'll stream tonight too.",
                japanese: "え、田中さんスパチャありがとうございます。今日すごいな。タッカーはドジャース、カーショウはWBC出るし、三角トレード起こるし。うん。いや、三角トレードもあれだし面白いし、ま、また夜もやろうかなと思うんだけども。"
            },
            {
                startTime: 3041,
                english: "Yesterday the Rangers-Athletics trade happened too. Things picked up suddenly. I hope the Padres do something with this momentum.",
                japanese: "ま、昨日はね、レンジャー・アスレチックスのトレードもあったし、また急にね、勢い出てきたな。この勢いに乗じてパドレスもなんかやってくんないかなと思うんだけどね。急に勢い出てきたわ。びっくりしたわ。"
            },
            {
                startTime: 3055,
                english: "Thank you Yogaku for the Super Chat. 'My prediction was wrong. I believed he'd go to Toronto because of the Bichette situation.'",
                japanese: "え、洋学さんスパチャありがとうございます。え、今日は予想が外れました。トロントに行ってくれると信じてましたかね。某ビシェットをしてたからね。"
            },
            {
                startTime: 3068,
                english: "Between Bichette and Tucker, I still thought Tucker was better. But now Bichette will probably stay with the Blue Jays.",
                japanese: "ま、でも某ビシェットもこれないすね。いや、僕はビシェットかタッカーだったらやっぱタッカーだと思ってましたよ。さすがに。ただ、ま、ビシェットこれでブルージェイズになるんじゃないかなと思いますけどね。"
            },
            {
                startTime: 3084,
                english: "If Bichette goes to the Phillies instead, that would be rough for the Blue Jays. So they expected Bichette or Tucker but got Okamoto?",
                japanese: "これでフィリーズ行ったらもうブルージェイズからしたらうんうんて感じ。ちょっとうんみたいな。そっか。じゃあビシェットかタッカーだと思ってたら岡本かって。ま、岡本はいいんですけどね。間違いなくいい選手なんですけど。"
            },
            {
                startTime: 3097,
                english: "Thank you Jinryu for the Super Chat. 'Betts, Freeman - players teams shouldn't let go. Ohtani too.' Yeah, the Dodgers are going all-in right now.",
                japanese: "え、人流さんスパチャありがとうございます。ベッツフリーマンとか本来チームが手放させない選手と契約してる。え、大谷とかプラス大谷。うん。ま、だから今いや本当にあのドジャースがやってるのは今全部ここに注ぎ込みますっていうことですよね。"
            },
            {
                startTime: 3124,
                english: "Surprisingly, they're not sacrificing the farm system either. They spend money while keeping the farm intact, then use prospects as accents for trades.",
                japanese: "ま、だけど意外とファームも犠牲にはしていないのがドジャース。お金使って、ファームは犠牲にしない範囲でお金使って、さらに、ま、アクセントとしてファームを使ってトレードしたりとかしているっていうのがドジャースですね。"
            },
            {
                startTime: 3149,
                english: "In contrast, the Padres can't spend more money, so they sacrifice the farm to make moves. But most teams don't do either.",
                japanese: "ま、それに対して、ま、お金もこれ以上使えないからファームを犠牲にしまくってなんとか補強してるのがパドレスです。でもどっちもやってないチームがほとんどだからね。そこまで犠牲にしないっていうのチームがほとんどだから。"
            },
            {
                startTime: 3174,
                english: "Thank you Boseido for the Super Chat. 'Hey, you're respecting the wrong person.' What are the Mets going to do now? Free agent starters are scarce.",
                japanese: "え、補正グレシアさん、スパチャあります。おい、めっちゃ尊敬する相手間違えてるぞ。うん。どうするんだろうな。メッツはこっからもう先発で取るとかも多分FAはなかなか厳しくなってると思うし。"
            },
            {
                startTime: 3192,
                english: "What would make Mets fans satisfied? Going with the current roster isn't out of the question since Soto is young. Hoping for young player growth...",
                japanese: "メッツどうするんだろうな。どうしたらメッツファンは納得だろうな。もうこのままま外がまだ若いからいいとして原有戦力でま行くのも絶対なしではないのかな。若手の成長に期待みたいなね。ちょっとブリッジ感出るけど。"
            },
            {
                startTime: 3217,
                english: "Fans won't accept that though. 'How many years are we going to keep saying that?' Thank you Sawan for the Super Chat.",
                japanese: "納得はできないよね。でもね、いや、どんだけ毎年そ感じやねんみたいな感じになるからね。え、サワンさんスパチャありがとうございます。"
            },
            {
                startTime: 3239,
                english: "'Last year I was a Mets fan but now I'm a Dodgers fan?' What happened? That's an interesting transition.",
                japanese: "昨年まで滅押しだったのにこんな動きされたらでしたがどじ押しになったの?今なら完え。昨年まで滅押しだったのが今年からドジ押しになったの?それどういう流れ?すごい流れだな。是非あの経緯を知りたいですよ。これは。"
            },
            {
                startTime: 3268,
                english: "Switching from Mets to Dodgers is wild. Not Mets to Angels to Dodgers, but directly Mets to Dodgers? Couldn't be satisfied with the Mets?",
                japanese: "滅しからエンゼルスからドジャースじゃなくて滅からドジャース乗り換えすごい。ちょっとメッツに満足できなかったか。"
            },
            {
                startTime: 3296,
                english: "Well, Mets fans are spending money and expecting guaranteed postseason appearances. Wait, why did Heyman tweet this twice? What's different?",
                japanese: "まあ、メッツに求めてるのは毎年オフシーズン、あの、ポストシーズンに間違いなく出るみたいな流れをね、お金かけてるから実際それを求めてるからね。ちょっと待って。ジョンヘイマンなんでこれ2回なんで2回ツイートしてんの?これ何が違う?"
            },
            {
                startTime: 3336,
                english: "What's different? Wait... 'on' and 'in'. Oh, that's it. Just a typo fix. So the $30 million deferred is real then.",
                japanese: "タッカーズドジャーズはずな。何が違う?これ。ああ。え、なんか違う。これどっか綴り間違ったとか。あ、お、オンとイン。あ、そん、あ、そか。オンとインか。そこか。なんだじゃあ3000万ドルは。じゃあガチなんだね。"
            },
            {
                startTime: 3362,
                english: "If he was wrong that would change things. $130 million vs $30 million is very different. So it's confirmed at $30 million deferred.",
                japanese: "これ間違ってたらだいぶ話違うからね。これ130万ドルですっていうのと30万ドルですっていうの全然違うからね。それと毎年30万ドルですっていうのとまた違うからね。そうっすか。3000万ドル。3000万ドルは変わらないってこと。2億4000万ドルでも。"
            },
            {
                startTime: 3387,
                english: "The Dodgers really went all out. Thank you Mu for the Super Chat. 'Can you hypnotize the Red Sox to trade Machado?' Some Padres fans joked about returning Bogaerts.",
                japanese: "あええ、だいぶ張り切ったな。ドジャース。え、ムさんスパチャありがとうございます。レッドソックスに催眠術かけて僕かマチをレッドソックスにトレードできないですか?なんかそれな。それ、あの、現地パドレスファンがじゃあ、レッドソックス、あの、ブレグマン逃したから、じゃ、ボガーツをお返ししますみたいなね。"
            },
            {
                startTime: 3421,
                english: "My prediction: the Red Sox will get Duran. They've been linked for a while. Maybe Duran and Jose Melo as a package.",
                japanese: "あのね、僕はこれ予想です。レッドソックスはどの番取ると思う?僕の予想。もう、あの、密月のもう付き合ってるんじゃないかっていうこのね、レッドソックス・カジなんですよ。もう1発、もう1発あると思う。ジョジョーメロとどの番なんだったらセットでレッドソックスに来るんじゃないかなって思ってます。"
            },
            {
                startTime: 3456,
                english: "Thank you Lindor for the Super Chat. 'There's hope in prospects at every position, but what about Lindor?' Having Lindor seems wasted.",
                japanese: "え、リンドアさんスパチャありがとうございます。プロスペクトに期待する気持ちはあります。全ポジションに原石が豊富なのでただリンドアはどうするのか。確かにリンドアの前ちょっともったいないすよね。そこはある。そこはあるが。"
            },
            {
                startTime: 3490,
                english: "If that's the case, Lindor's extension means nothing. But releasing Lindor is unthinkable. So they just have to try their best with current players.",
                japanese: "そうそれだったらリンドアは一生懸命保有の意味なくなるけど。でもリンドアは放出ありえない話だからな。だから今の戦力で、ま、行けるとこまで頑張りましょう。なんだよね。結局ブリッジな感じですわ、本当に。"
            },
            {
                startTime: 3530,
                english: "Lindor would want to make a real push while Soto is there. Trading Lindor... well, he's very popular. The Mets fanbase would still accept it.",
                japanese: "リンドアは外揃ってたらもう1発ちゃんとやってくれよってなるけどね。リンドアトレードはま、でもリンドア人気すごいしメッツからしても受け入れがいでしょうね。"
            },
            {
                startTime: 3553,
                english: "If you trade for Lindor and give Soto that huge deal, then say 'let's just hope our young players develop' - fans won't accept that.",
                japanese: "もしじゃあそんななんだろうな、リンドア取ってきてさらに外とあんだけの契約やってじゃあもうこれであのあとは若手の成長に期待ですみたいなこと言ったらさ、それは納得いかないでしょ。普通にファンとして。"
            },
            {
                startTime: 3578,
                english: "Especially with the richest owner in MLB. With an owner with that kind of financial power. So I don't think it'll come to that.",
                japanese: "しかも、ま、メジャーリーグで最も金持ちなオーナーがいてよ、そうやって資金力のあるオーナーがいてよ。だから、まあ、多分そんなことにはならないと思いますね。"
            },
            {
                startTime: 3602,
                english: "The Mets offer came out. Who's reporting this? Duquette? Jim Duquette, the former GM.",
                japanese: "え、メッツのオファー出た。メッツのオファー誰が言ってる?ウルサモンとか。あ、デュケットだ。ジムだ。元GM。"
            },
            {
                startTime: 3622,
                english: "Was confirmed. Mets offer was 4 years, $220 million. They got outbid. They really got outbid.",
                japanese: "wasconfm。メッツのオファー4年2億2000万と。オファー負けや。オファー負けしとる。やっぱりオファー負けしてるわ。4年はやっぱ出したんだな。"
            },
            {
                startTime: 3650,
                english: "Jim Duquette was reporting quite a bit about Tucker stuff. Thank you for the stream notification comment. Glad people are finding out about the news through this stream.",
                japanese: "今回のこのタッカー周りに関してはジム・デュケット結構色々とね、報じてましたけどオファー負けだ。フェリクスさんの配信通知来たから何だろうと思った。高額と出てはあ、配信通知してくれてることにありがとうございます。"
            },
            {
                startTime: 3677,
                english: "Rosenthal says the present value AAV is $57 million. So the $30 million deferred is confirmed.",
                japanese: "あ、ローゼンタールが、えっと、これによってAAV、現在価値のAAVがいくらになるか。5700万ドルらしいっす。ああ、じゃあやっぱり3000万ドルで合ってるらしいですね。"
            },
            {
                startTime: 3705,
                english: "So the first year has no deferred money. The deferred $30 million is spread over the last 3 years - $10 million each.",
                japanese: "え、ってことは1年目は後払いないってこと。へえ。えっと、この後払いはトータルで3000万ドルなんだけど、最後の3年間に対しての3000万ドル、1000万ドル×3らしいんですよ。"
            },
            {
                startTime: 3727,
                english: "Last 3 seasons, not first 3. So year 1 is $60 million with no deferral. Year 2 is $50 million plus $10 million deferred.",
                japanese: "最後の3年じゃなくてラスト3シーズンって書いてますね。ってことは1年目は後払いなしの6000万ドル払うってことで2年目も少なくとも2年は絶対いるわけだから2年目に5000万ドルプラス後払いが1000万ドルっていう形。"
            },
            {
                startTime: 3753,
                english: "If he opts out after 2 years, the total deferred is only $10 million. He'd receive $110 million immediately plus $10 million deferred later.",
                japanese: "だからもし2年でオプトアウトしたら実際の後払い額は1000万ドルになるってことだな。2年で実際にすぐに受け取るのが1億1000万ドル。それにプラス1000万ドルだけ。後払いで受け取るってことだね。"
            },
            {
                startTime: 3779,
                english: "This is really favorable for Tucker. Incredibly good terms. Does it make sense to opt out after year 1? Absolutely.",
                japanese: "だから相当これタッカー有利っていうかタッカーからしたらもう申し分ない。申し分ないっすよ。うん。だからオプトアウトしたら1000万ドルだけってことになりますね。1発目でこの契約オプトアウトする意味ありますか?めっちゃありますよ。"
            },
            {
                startTime: 3812,
                english: "Tucker would hit free agency at 31. At 31, he could still get a 6-7 year deal. At 33 (if he stays all 4 years), contracts get shorter.",
                japanese: "やっぱりだってタッカー31歳とかでFA市場に出てくるわけでしょ。31歳だったらそっからだってこの4年ずっといたとしたら33歳でFAに出るわけですよ。33歳だったとしても大型は取らないといけないわけ。"
            },
            {
                startTime: 3839,
                english: "At 31, he could get 6-7 years. At 33, fewer years. So if he's performing well, he'll opt out at 31.",
                japanese: "そうするとやっぱりあの高からした31歳で出たら6年7年ぐらいの契約も見込めるのに33歳だとどうしても契約年数短くなるから当然成績残してたらその31歳でのオプトアウトを選ぶと思います。"
            },
            {
                startTime: 3861,
                english: "So opting out means almost no deferred money matters. This is a really favorable deal for Tucker. The AAV is $57 million present value.",
                japanese: "うん。そう。オプトアウトしたらもうだからほぼ後払い関係ないしだそういう前提オプトアウトしてタッカーからしたら結構有利な契約になってると思いますね。で、AAVだと5700万ドルっていうことなので。"
            },
            {
                startTime: 3887,
                english: "The Dodgers will pay 110% luxury tax on that. So about $62.7 million in luxury tax plus the $57 million salary - over $110 million total cost per year.",
                japanese: "えっと、これの110%の贅沢税をドジャースは払うことになります。だから、え、6270万ドルプラス、え、5700万ドルなので、ま、今回かかった1年あたりのコストはだから1億1000万ドルぐらいですね。実質1億1000万ドル。すごい。"
            },
            {
                startTime: 3926,
                english: "In 2 years, they can just sign the next top FA. That might be Murakami. The luxury tax is 110% for the Dodgers.",
                japanese: "え、タッカーとれたらビシェットは最悪。ま、ビシェットはもうわかんないです。フィリーズかブルージェイズかはたまたミステリーチームなのかわかんないですね。2年後またFAのトップを取ればいいだけやもんな。2年後FAのトップはもしかしたらあの村上かもしれないすよ。村上。贅沢税は110%です。"
            },
            {
                startTime: 3974,
                english: "Thank you Boseido for the Super Chat. $60 million is about the same as DeNA and Yakult's combined payroll before 2025 season opening.",
                japanese: "え、補正グリシさんスパチャありがとうございます。ちなみに6000万ドルだと2025年開幕前のDeNAとヤクルトの総年俸とほぼ同じです。足した足した金額。6000万ドルって今日本円にしたらいくらなんだ?"
            },
            {
                startTime: 4004,
                english: "At around 150 yen per dollar, that's about 90-95 billion yen. So two NPB teams combined payroll for one MLB player.",
                japanese: "今150円台とかですか?160円ぐらいある?150円ぐらいかな?90億円ぐらい?90億100億ぐらいか?95億ぐらいじゃあ。あ、じゃあDeNAとヤクルト総年俸それぐらいなんだ。へえ。足して。"
            },
            {
                startTime: 4036,
                english: "NBA top players make that kind of money too. For one player, that's insane. Tucker already posted a Dodgers picture on Instagram.",
                japanese: "え、NPBの球団ってじゃあ今50億ぐらいはあるってこと?ソフトバンクとかはちょっと1個レベル違うかなと思うけど。そう、6000万ドル。そういうことだよね。だから90何億円。1年で90何億円。NBAだとトップ選手もうね、それぐらい稼ぐことあるけどもすごいね。1人の選手にそこまでか。タッカー早速インスタでドヤ顔ドジャース投稿してるやんけ。"
            },
            {
                startTime: 4089,
                english: "If a player accepts short-term deals like this, you avoid bad contract risks. Short deals with high AAV are better than long deals with potential bad years.",
                japanese: "不良再権リスクを可能で解決した感じなのか?動きとしたり納得できる。いや、だからこれ、あの、選手側がこういう短期を受け入れてくれるっていう土壌ができてるんだとしたら、あの、不良再権化しないというか。"
            },
            {
                startTime: 4128,
                english: "If money can solve the problem of avoiding long-term bad contracts, that's ideal. You don't need 6-7 year deals anymore.",
                japanese: "1番重要なのはいかに若いうちに使えるかみたいなところだからで、その選手を取るために終盤の不良再権リスクを受け入れないといけないっていうが、今までがそういう長期契約だったわけ。ところが、あの、ま、短い契約で、とにかく長期契約不良再権化のリスクを減らす動きをできるんだったら、ま、お金で解決できるよね。"
            },
            {
                startTime: 4181,
                english: "Diaz's deal was also shorter than expected at 3 years. Money can solve a lot. But farm system strength can't be bought - the Dodgers have that too.",
                japanese: "だ、もう本当6年7年の契約はいらないと。ま、ディアスに関しては、ま、ディアスも結局あれね、ま、思ったより短いっていうか3年だったけど、ま、そうですね。ま、お金があれば、あの、解決できる。でもファームシステムだけはどうにもならないんだけど、そのファームシステムはドジャースは強いから。"
            },
            {
                startTime: 4232,
                english: "Every year there are close games. Can we have close games this year too? The offense impact is really big - pitchers can get hurt.",
                japanese: "だから、ま、ダメージになってないっていうのは実際のところかな。なんだかんだ。毎年接戦だし大丈夫。今年も今年も接戦にできますか?これ。うー、なん、あのね、野手のインパクトやっぱでかいよね、正直。ピッチャーはもちろんなんだけど。"
            },
            {
                startTime: 4272,
                english: "Snell gets injured and has slow starts. A strong farm means good players - but they can't break through because the roster is stacked.",
                japanese: "ま、まだなんかスネルは結構怪我するよねとか、なんか春先はスネル良くないよねとか。だから。ファームシステム強いって本当最近生え抜きでいい選手いるっけ?生え抜きで大選手は出てこないんですよ。上が詰まってるから。だからトレードされるんですよ。"
            },
            {
                startTime: 4320,
                english: "They trade those prospects because there's no room. Like Bush who was traded and did well elsewhere. The Dodgers don't give young players time.",
                japanese: "で、その生え抜きの選手を定着してうん。その選手がちゃんとレギュラークラスになるだけの時間を、ま、与える余裕も今のドジャースには余裕がないってよりそこしなくてもじゃあもう即戦力取ってきた方が絶対確実じゃんっていうのが今のドジャースだから。"
            },
            {
                startTime: 4365,
                english: "Like Bush who was traded and succeeded elsewhere. Some players might have done well if given time at the Dodgers. Is the farm really #1?",
                japanese: "だからだ、ブッシュとかだって、ま、トレードして、トレード先で活躍したでしょ。だからもしかしたらドジャースでも、あの、もっと時間あれば活躍したであろう選手とかはいるだろうけど。ま、正直ね、あの、1位なのか、38チーム1位のファームシステムなのかって言われたら、ま、ちょっと下駄入ってる気がするけどね。"
            },
            {
                startTime: 4406,
                english: "I'm not sure it's really #1, but it's definitely top-tier. Consistently in the upper ranks. Signing bonus is $64 million for Tucker.",
                japanese: "そこは正直言うとね、下駄入ってる気がするけども。けど、ま、上位なのは間違いない。ずっと上位なのは間違いないと思う。それが38チームで1位っていうほどなのかと言ったらちょっとわかんないです。うん。でも上位なら間違いない。サイニングボーナス6400万ドル。"
            },
            {
                startTime: 4462,
                english: "Signing bonus $64 million for Tucker. The timing of payment varies case by case - could be all at once or spread out.",
                japanese: "サイニングボーナス6400万ドルらしいっす。はい。契約金6400万ドル。ただね、この契約金っていつ払うかってその場合により切りなんだよ。本当に場合により切り。だから例えばえっとこの契約するタイミングだから2月とかですかね。"
            },
            {
                startTime: 4510,
                english: "Could be paid all at once within a month of signing, or spread over years. The payment method doesn't affect AAV calculations.",
                japanese: "契約してから1ヶ月以内とかそういう2月とかにもう全部一括で払う場合もあれば、あの、何年間とかに分けて実際の年俸みたいな感じで分けて払うみたいな感じのこともあります。だからこれイコール一括で絶対払うっていうとは限らないです。人によって払い方ちょっと変わってきます。"
            },
            {
                startTime: 4554,
                english: "Of course they could pay all $64 million right now in February. Yamamoto also had a big bonus - paid in two installments I think.",
                japanese: "可能性。もちろん、もちろんここで今全部6400万ドル1発目にこの2月に払うっていう可能性もありますけど、で、この払い方とかは全然例えばAAVとかにはあの影響しないので。ドジャース大体初年度に全部払うよね。そうね。山本信もボーナスかなりあったと思うんだけど、あれもなんか2回に渡って払った気がするんだけど。"
            },
            {
                startTime: 4613,
                english: "Bregman also announced he's playing in the WBC. So why not just use the current USA roster? That's basically the Dodgers team anyway.",
                japanese: "アンコもさんスパチャありがとうございます。ドジャースは北韓る野球政治を迎撃するためにちゃくちゃくと準備を進めているんだ。も、もう今回のアメリカ代表でいいじゃん。もうそれブレグマンまで表明したよ。ブレグマン出るらしいよ。じゃもうブレグマンセカンドで良くないかって正直思うんだけどね。"
            },
            {
                startTime: 4666,
                english: "Kershaw announcing WBC participation is emotional. After winning with the Dodgers, his last time in uniform will be for Team USA.",
                japanese: "だからもう今回のアメリカ代表にやってもらおう。野球成人との戦いは。ね。カーショウのWBC出場はちょっと感動的というかそうですかとあのドジャースで最後リング取ってもうこれ以上ないぐらいの優秀の日を飾ったカーショウがその後に最後の最後にユニフォーム着てマウンドに立ちたいと思うのがWBCアメリカ代表だったってのは結構感動的ですね。"
            },
            {
                startTime: 4721,
                english: "Considering how people said Americans don't care about the WBC, for a pitcher like Kershaw to want this so badly shows how big the tournament has become.",
                japanese: "個人的にはあんだけアメリカ、アメリカはWBCなんて何も気にしてないみたいなこと言われた時代こと考えたらそのカーショウほどのピッチャーがそこまで思うぐらいの大会になったんだっていうところが個人的にはすごい感慨深いなと思いました。"
            },
            {
                startTime: 4759,
                english: "I want Trout to play. There are still roster spots open. Please show me Harper, Trout, and Kershaw in the same uniform.",
                japanese: "そして僕はトラウトに出てほしい。まだ枠残ってるんですよ。ま、この後事態とかもあるだろうけど枠残ってるんですよ。だからトラウトも出て欲しくて、ハーパーとトラウトとカーショウが並んでる同じユニフォーム着てるとこ見せてくれよ。本当に。あとそこだけお願いするよ。本当に。"
            },
            {
                startTime: 4806,
                english: "There's still an outfield spot open. Trout please. Even as a pinch hitter would be amazing. If he's announced as the final roster spot, I might cry.",
                japanese: "そう。まだ外野の若あるんですよ。トラウト出てくれよ。控えでいいから。大事な時に代打で出てきたらめちゃくちゃテンション上がるだろう。1番最後の枠でトラウト発表されたら僕ちょっと感動するかもしんない。"
            },
            {
                startTime: 4846,
                english: "I might declare I'm cheering for Team USA this time. As a Padres fan I lean toward Dominican Republic, and as Japanese I should root for Japan, but if Trout joins...",
                japanese: "もう今回アメリカ代表応援しますってもう表明するかもしんない。もう気持ち的にはあのパドレスファン的にはちょっとドミニカかなみたいなとかやっぱ日本人としては日本かなみたいな思うんだけど今回はアメリカに優勝してほしいみたいな気持ちになっちゃうぐらいにはこれトラウトできたらもうエモすぎる。"
            },
            {
                startTime: 4891,
                english: "The 3rd catcher spot isn't filled yet. When Kershaw pitches, I think Will Smith will catch him. That's also a nice touch.",
                japanese: "そうそう。捕手もね、あの3人目の捕手は出てないから。ただあのカーショウがそのマウントに上がるシチュエーションを考えた時に多分うん、なんかそんなすごいいいシーンでとかっていう感じじゃないと思うんだけどカーショウがマウンド上がってる時はきっとウィル・スミスがキャッチャーやると思うんだよね。そこもいいよね。"
            },
            {
                startTime: 4953,
                english: "Jeff Passan's summary is out. This will be the last topic for this stream. ESPN source on Kyle Tucker to the Dodgers.",
                japanese: "え、パッサンがまとめた。あ、オッケー。パッサン。えー、ま、じゃあこれが今日のこの配信の最後かな。え、パッサンによるカイル・タッカードジャース入り契約まとめESPNソースでございます。"
            },
            {
                startTime: 4984,
                english: "Face value is 4 years, $240 million. Two opt-outs after year 2 and 3. Signing bonus $64 million. Of the $240M, $30M is deferred.",
                japanese: "え、額面は4年2億4000万ドルです。そして、え、2年目、3年目終了時の2回ですね。オプトアウトがついてます。契約金6400万ドルです。どのタイミングでどういう風に支払うかはちょっと分からないです。え、2億4000万ドルのうち3000万ドルが後払いになってます。"
            },
            {
                startTime: 5037,
                english: "This lowers the present value. Face value is $60M AAV but present value drops to $57.1 million. That's what matters for luxury tax calculations.",
                japanese: "そして、えー、これによって現在価値下がります。え、額面上は6000万ドルなんですけど、現在価値ちょっと下がって、え、5710万ドルAAVになります。ま、これは贅沢税の換算計算をする時の必要な数字です。"
            },
            {
                startTime: 5079,
                english: "So only $30 million deferred. Ken Rosenthal says the $30M deferral is $10M each for the last 3 years. Year 1 is full $60M, year 2 is $50M plus $10M deferred.",
                japanese: "はい。だからやっぱり3000万ドルしか後払いはないと。で、ま、あの、ここには書かれてないですけども、ケン・ローゼンタールによるとこの3000万ドルの後払い分に関しては最後の3年で1000万ドルずつっていう話なんで、1年目は6000万ドル満額で2年目が5000万ドルプラス1000万ドルの後払い。"
            },
            {
                startTime: 5124,
                english: "If he opts out, only $10M deferred remains. Thank you Aoyuki for the Super Chat about how the Dodgers are well-run, not just rich.",
                japanese: "そこでオプトアウトしたらもう1000万ドルの後払いだけで終わっちゃうみたいな感じになりますかね。え、青雪さんスパチャありがとうございます。FAでより良い選択肢を手に入れて外れた選手をトレードしてファームシステムを強化金じゃなくて運営がうまいだけと言うけどこんなのスモールマーケットできないし真面目に制度かないとダメですよね。"
            },
            {
                startTime: 5187,
                english: "Not every team can do what the Dodgers do. 'Just defer money' people say - but most teams can't do that. Only big market/mega market teams can.",
                japanese: "ま、そうですね。とドジャースと同じことをえーじゃあどこのチームでできんのかって言われたら後払いしたらいいじゃんとかもよく言われるんですけどまできないです。これはやっぱりドジャースだからできてる。ま、あのビッグマーケットメガマーケットのチームだからできているっていうのは疑いはありません。"
            },
            {
                startTime: 5239,
                english: "They're not just a money team though. They have everything - money, farm system, front office. This is what happens when a complete team has money.",
                japanese: "そこに関してはどこでもできることではないのは確かだけど、ま、ドジャースは今全てを兼ね備えてるっていうのも確か。お金だけのチームではないのも確か。なので、ま、あらゆる全ての能力が揃ったチームにお金があったらこうなるよっていうのを今、あの、具現化してるっていう感じでございます。"
            },
            {
                startTime: 5285,
                english: "Thank you Ankoroman for the Super Chat. How do NL West fans feel? Well, division winner is Dodgers anyway. Let's aim for wild card.",
                japanese: "え、アンコロマさん、スパチャありがとうございます。リーグファンの私も衝撃的なんですけど、ドジャースと同リーグの方はどんな気持ちなんですか?まあうん。ま、地区優勝はどうせドジャースだし、まあワイルドカード頑張ろうみたいなワイルドカードでポストシーズン出るのを目指して頑張ってくれみたいな感じですね。"
            },
            {
                startTime: 5345,
                english: "Other divisions probably care more about their own rivals. When playoffs come, everyone has to worry about the Dodgers though.",
                japanese: "ま、でも他の地区からしたらあんま関係ないんじゃないか。あの、同じナ・リーグだったとしても、中地区とか東地区からしたら、ま、ドジャースよりも自分と同じ地区のチームの方がやっぱ気になるだろうから。うん。ま、あの、ポストシーズンに出てきたらね、どのチームにも関係ある話にはなるんだけど。"
            },
            {
                startTime: 5398,
                english: "With or without Tucker, they're strong anyway. Every year people say they'll win 116+ games but they don't even hit 100 wins.",
                japanese: "タッカー取ってても取ってなくてもどうせ強いから、ま、こういう補強をすると、ま、去年もそうだし、昨年もそうだし、ま、100何勝するんだろうみたいな。え、116勝のね、メジャー最高116勝をね、超えるんじゃないかって言われるんですけど、ま、結局100勝も行ってないわけなんで。"
            },
            {
                startTime: 5445,
                english: "Division realignment might happen at some point. I don't expect the Padres to be separated from the Dodgers - same area teams stay together.",
                japanese: "ま、だからなんだかんだ、あとは地区再編がどの辺で起こるかっていう、ま、どっかしらで起こるかもしんないですけど、ま、僕は別にパドレスがドジャースと離れる期待はしてなくて、え、なんか同じエリアのとこは離すみたいな話になってるっぽいですけど。"
            },
            {
                startTime: 5489,
                english: "Dodgers-Angels, Mets-Yankees, Rays-Marlins stay in different divisions. Chicago teams too. Padres will stay with the Dodgers as long as both are in SoCal.",
                japanese: "あの、例えばドジャースとエンジェルスとかメッツとヤンキースとか、ま、レイズとマーリンズみたいな感じで同じエリアにいるところは剥がす。それはこれまでと変わらないっぽいですね。だけど、ま、シカゴの2チームとかもね、ま、地区再編されても多分ね、パドレスはサンディエゴにいる限りはね、ドジャースと同じ地区になるかなと思いますね。"
            },
            {
                startTime: 5549,
                english: "If asked to predict, 99.9% of people would say Dodgers win the division. How do you even get to 116 wins? Maybe this year they'll get 116-117?",
                japanese: "そう、意外とね、そう簡単にはいかない。簡単にはいかないけども、ま、あの、もし予想しなさいって言われたらおそらく99.9%ぐらいの人は、ま、ドジャース優勝と、あの、予想するんじゃないかなと思いますね。116勝ってどうやったらできるんだろうね。逆にここまでやっても無理かわかんないけどね。今年116勝、117勝するかもしれないけどね。"
            },
            {
                startTime: 5609,
                english: "Once the season starts, it might not be that dominant. But Tucker is really strong. This signing is significant. Bob tweeted something vague about Bellinger...",
                japanese: "まあ、なんだろうな。意外と始まってみたらそうでもないみたいなこと思うんだけど、タッカーはでも本当に強い。タッカー獲得は。な、ボブがなんか言ってる。これ何?コディ・ベリンジャー・ステップ・トゥ・ザ・プレイ。え、なんだよ。思わせぶりなこと言うんじゃねえよ。"
            },
            {
                startTime: 5660,
                english: "Bob hasn't been on point this offseason. I don't remember him breaking anything. Weird to end with Bob's vague tweet. Anyway, that's it for this noon stream.",
                japanese: "このオフ。ボブ全然さえてないな。本当に。なんかボブ第一報とかも記憶ないし。なんかさえてないな。よくわかんないわ。ちょっとやだな。1番最後にボブが。やだな。ま、そういうことで、えー、お昼の速報配信はこれで終わろうと思うんですけども。"
            },
            {
                startTime: 5700,
                english: "I'll probably do another stream tonight to discuss the Rangers-Athletics trade and international FA stuff. Thanks for joining on a Friday afternoon.",
                japanese: "喋り逃したスパチャとかないっすね。ない、ないと思います。はい。ということで、え、これでお昼場終わろうと思いますけど、ま、あの、昨日のレンジャーズ・アスレチックスの話とか、あとは国際FA絡みの話とか、まだあのタッカー以外の話でも色々あると思うので夜にやろうかなと思ってますね。"
            },
            {
                startTime: 5744,
                english: "Thanks everyone for coming on a weekday Friday noon. Most of you were probably on lunch break. See you tonight if you can make it. Take care!",
                japanese: "なんでこんな平日の金曜日の昼に皆さんあの急に来てくれてありがとうございました。お昼休憩に見てた方が多いのかなと思うんですけども、あの、来てくださってありがとうございました。また夜ね、あの、来てくれるよという方は是非よろしくお願いいたします。ま、基本的にやるつもりではいます。何も体調とか大丈夫だったらやります。はい、ということでご視聴いただきありがとうございました。また次の配信でお会いしましょう。お疲れ様です。仕事頑張ってください。"
            }
        ]
    },
    {
        id: "tarik-skubal-arbitration",
        youtubeId: "AD19G-NOYQA",
        title: "Tarik Skubal’s Salary Arbitration",
        description: "Breakdown of the historic salary arbitration case between Tarik Skubal and the Detroit Tigers.",
        date: "2026-01-16",
        segments: [
            {
                startTime: 0,
                english: "Hey everyone, welcome back to the channel. I'm RenSox. Today, we’re talking about a major developing story: reports just came in that Tarik Skubal and the Detroit Tigers failed to reach an agreement, and they are now officially headed for salary arbitration. In this video, I want to break down how the system works, look at both sides of the argument, and discuss where things might go from here. Let’s jump right in.",
                japanese: "みなさん、こんにちは。チャンネルへようこそ。RenSoxです。今日は大きな進展があったニュースについてお話しします。タリク・スクーバルとデトロイト・タイガースが合意に至らず、正式に年俸調停に向かうことになったという報道が入ってきました。この動画では、この制度がどのように機能するのか、双方の主張、そして今後どうなる可能性があるのかについて詳しく解説したいと思います。それでは、早速見ていきましょう。"
            },
            {
                startTime: 23,
                english: "Here is the outline for today’s video. We’ll break it down into these sections. But before we get into the main topic, let’s take a quick look at the man himself, Tarik Skubal. Most of you watching probably already know him, so I won’t go too deep, but his 2025 season was absolutely dominant. As you can see here, he led the league in multiple categories. Most notably, he won the Cy Young Award for two consecutive years—2024 and 2025. That’s a historic feat we haven't seen since Pedro Martinez 25 years ago. He is, without a doubt, the best pitcher in the game right now, which is why everyone is watching this case so closely.",
                japanese: "今日の動画の構成はこちらです。これらのセクションに分けて解説していきます。しかし本題に入る前に、タリク・スクーバル本人について簡単に振り返っておきましょう。ご覧の皆さんのほとんどは既にご存知でしょうから深くは掘り下げませんが、彼の2025年シーズンは圧倒的でした。ご覧の通り、彼は複数の部門でリーグトップの成績を収めました。特筆すべきは、2024年と2025年の2年連続でサイ・ヤング賞を受賞したことです。これは25年前のペドロ・マルティネス以来の歴史的快挙です。彼は間違いなく現在最高の投手であり、それが皆がこのケースをこれほど注目している理由です。"
            },
            {
                startTime: 76,
                english: "To summarize the situation: Tarik Skubal has set a record for the largest salary gap in MLB history, with a difference of $13 million between the two proposals. Since they didn't agree by the January 9th deadline, the case is expected to proceed to a formal hearing. Here are the specific numbers they put on the table:\n\nSkubal’s Side: $32 million for one year.\n\nTigers’ Side: $19 million.\n\nThe Gap: $13 million. This gap is the largest since the arbitration system began. To put that in perspective, the $13 million difference alone is more than Skubal’s entire salary last year ($10.15 million). This shows just how far apart the team and the player really are.",
                japanese: "状況をまとめると、タリク・スクーバルはMLB史上最大の年俸希望額の隔たりを記録しました。双方の提案額には1300万ドルもの差があります。1月9日の期限までに合意に至らなかったため、この件は正式な聴聞会に進むと見られています。双方が提示した具体的な数字は以下の通りです。\n\nスクーバル側：単年3200万ドル。\n\nタイガース側：1900万ドル。\n\nその差：1300万ドル。この差額は調停制度が始まって以来最大です。わかりやすく言えば、この1300万ドルの差額だけで、スクーバルの昨年の年俸総額（1015万ドル）を上回っています。これは、チームと選手の隔たりがいかに大きいかを示しています。"
            },
            {
                startTime: 169,
                english: "Now, let’s talk about what the arbitration system actually is, as it’s a bit different from how things work in Japan. In MLB, this system gives players the right to negotiate their salary with the team. Normally, for the first few years after the draft, a player’s salary is fixed by the team. However, between their 4th and 6th years of major league service, players become 'arbitration-eligible' and can finally negotiate. Without this, a player would have no say in their pay until they hit Free Agency.",
                japanese: "さて、年俸調停制度とは実際どのようなものなのかお話ししましょう。日本の制度とは少し異なるからです。MLBにおいて、この制度は選手にチームと年俸を交渉する権利を与えるものです。通常、ドラフト後の最初の数年間は、選手の年俸はチームによって固定されています。しかし、メジャー在籍期間が4年から6年の間になると、選手は「調停権」を取得し、ついに交渉できるようになります。これがなければ、選手はフリーエージェント（FA）になるまで自分の給料について何も言えないことになります。"
            },
            {
                startTime: 247,
                english: "The process follows four main steps:\n\nNegotiation: The player and team try to settle. (Skubal and the Tigers failed here).\n\nExchange of Numbers: If they don't agree by the deadline, both sides' numbers are made public.\n\nThe Hearing: Held between late January and mid-February. Both sides present their case to a panel of three independent arbitrators.\n\nThe Decision: This is 'Winner-Take-All.' The panel must choose either the player’s number or the team’s number. There is no middle ground.",
                japanese: "このプロセスは主に4つのステップで行われます。\n\n交渉：選手とチームが解決を図る（スクーバルとタイガースはここで決裂しました）。\n\n数字の交換：期限までに合意できない場合、双方の希望額が公表されます。\n\n聴聞会：1月下旬から2月中旬にかけて開催されます。双方が3人の独立した仲裁人のパネルに対して自らの主張を提示します。\n\n決定：これは「勝者総取り（Winner-Take-All）」方式です。パネルは選手の希望額かチームの提示額のどちらかを選ばなければなりません。中間的な金額はありません。"
            },
            {
                startTime: 394,
                english: "What makes this case even more complicated is how they determine the value. Usually, they compare the player to others with similar service time. But there’s a special provision called the '5-Year Rule.' Since Skubal has over 5 years of service, he can be compared to any player in MLB, including those who signed massive Free Agent contracts. Skubal’s agent, Scott Boras, is arguing that Skubal’s performance over the last two years is better than any high-paid pitcher, like Max Scherzer ($43.3M avg), Zack Wheeler ($42M), or Gerrit Cole ($36M). Boras claims Skubal deserves similar treatment because he leads the league in ERA and WAR.",
                japanese: "このケースをさらに複雑にしているのは、価値の決定方法です。通常、同様の在籍期間を持つ選手と比較されます。しかし、「5年ルール」と呼ばれる特別な規定があります。スクーバルは5年以上の在籍期間があるため、巨額のFA契約を結んだ選手を含む、MLBの全選手と比較することができます。スクーバルの代理人であるスコット・ボラスは、過去2年間のスクーバルの成績は、マックス・シャーザー（平均4330万ドル）、ザック・ウィーラー（4200万ドル）、ゲリット・コール（3600万ドル）といった高給取りの投手よりも優れていると主張しています。ボラスは、スクーバルが防御率とWARでリーグトップであるため、同様の待遇を受けるに値すると主張しています。"
            },
            {
                startTime: 538,
                english: "Looking at history, the highest arbitration salary ever awarded to a pitcher was $19.75M to David Price in 2015. If we look at the Top 5 arbitration cases (Soto, Ohtani, Guerrero Jr., Betts, Arenado), every single case over $20M was settled before going to a hearing. Historically, teams have won more often than players (358 wins vs 270 losses). The highest amount ever decided by a hearing was Vlad Guerrero Jr.’s $19.9M.",
                japanese: "歴史を見ると、投手に認められた調停最高額は2015年のデビッド・プライスの1975万ドルでした。調停の上位5ケース（ソト、大谷、ゲレーロJr.、ベッツ、アレナド）を見ると、2000万ドルを超える案件はすべて聴聞会前に和解しています。歴史的に見ると、チーム側の勝率が選手側を上回っています（358勝対270敗）。聴聞会で決定された最高額はブラディミール・ゲレーロJr.の1990万ドルです。"
            },
            {
                startTime: 614,
                english: "What will they say during the 1-hour presentation?\n\nThe Tigers will likely emphasize precedent, pointing to David Price's $19.75M as the benchmark. They might also argue that Ohtani and Soto are hitters or two-way players, making them 'different' from a pure pitcher, and mention the injury risks associated with pitchers.\n\nSkubal’s side will likely push for 'inflation adjustment.' Price’s $19.75M from 2015 would be worth over $27M in today’s market. They’ll argue that the market has expanded and that Skubal’s back-to-back Cy Youngs make him a special case that deserves a new standard.",
                japanese: "1時間のプレゼンテーションで彼らは何を話すのでしょうか？\n\nタイガースは判例を重視し、デビッド・プライスの1975万ドルを基準として挙げるでしょう。また、大谷やソトは野手や二刀流であり、純粋な投手とは「違う」と主張したり、投手に付き物の怪我のリスクについて言及するかもしれません。\n\nスクーバル側は「インフレ調整」を強く推すでしょう。2015年のプライスの1975万ドルは、現在の市場では2700万ドル以上の価値になります。彼らは市場が拡大しており、スクーバルの2年連続サイ・ヤング賞受賞は新しい基準にふさわしい特別なケースだと主張するでしょう。"
            },
            {
                startTime: 808,
                english: "Where does this go? There are three patterns:\n\nPre-hearing Settlement: (Most likely) A deal around $24M–$27M. This saves the relationship and avoids a messy hearing.\n\nSkubal Wins: He gets $32M and sets a massive new market standard.\n\nTigers Win: He gets $19M, but the relationship likely sours, making him almost certain to leave in Free Agency.\n\nLastly, there's a big-picture issue. The current Labor Agreement expires soon, and there’s a possibility of a lockout in 2027. MLB wants to abolish arbitration in favor of an automated performance-based system, while the Players Association is fighting to keep it. As a member of the MLBPA executive committee, Skubal is at the center of this 'pre-war' battle. If he settles too easily, it might hurt the union's leverage.",
                japanese: "今後どうなるでしょうか？3つのパターンが考えられます。\n\n聴聞会前の和解：（最も可能性が高い）2400万〜2700万ドル前後での合意。これにより関係を維持し、泥沼の聴聞会を避けることができます。\n\nスクーバルの勝利：彼は3200万ドルを手にし、巨大な新しい市場基準を打ち立てます。\n\nタイガースの勝利：彼は1900万ドルになりますが、関係が悪化する可能性が高く、FAでの退団がほぼ確実になるでしょう。\n\n最後に、大局的な問題があります。現在の労使協定はまもなく期限切れとなり、2027年にはロックアウトの可能性があります。MLBは調停制度を廃止して自動化された成果主義システムへの移行を望んでいますが、選手会は制度維持のために戦っています。MLBPA執行委員会のメンバーとして、スクーバルはこの「戦前」の争いの中心にいます。彼が安易に妥協すれば、組合の交渉力を損なう可能性があります。"
            },
            {
                startTime: 1071,
                english: "This is a fascinating case that affects the whole league. What do you think will happen? Will they settle, or will we see a historic hearing? Let me know your thoughts in the comments. If you enjoyed this video, please hit the like button and subscribe. See you in the next one. Bye!",
                japanese: "これはリーグ全体に影響を与える興味深いケースです。皆さんはどうなると思いますか？和解するでしょうか、それとも歴史的な聴聞会を目撃することになるでしょうか？コメントで皆さんの考えを聞かせてください。この動画が気に入ったら、いいねボタンとチャンネル登録をお願いします。また次回の動画でお会いしましょう。さようなら！"
            }
        ]
    },
    {
        id: "tyler-glasnow-interview",
        youtubeId: "RvBg557MSro",
        title: "Tyler Glasnow Joins the Show | MLB Tonight",
        description: "Tyler Glasnow discusses joining the Dodgers, his pitching approach, and expectations for the upcoming season.",
        date: "2026-01-12",
        segments: [
            {
                startTime: 0,
                english: "Tyler, welcome to the show! It's great to have you. You're now a Los Angeles Dodger. How does it feel to put on that blue and white jersey and join such a historic franchise?",
                japanese: "タイラー、番組へようこそ！お会いできて嬉しいです。ついにロサンゼルス・ドジャースの一員になりましたね。あの青と白のユニフォームに袖を通し、歴史ある球団に加わった今の気持ちはいかがですか？"
            },
            {
                startTime: 12,
                english: "It feels amazing, honestly. Growing up in Southern California, I've always watched the Dodgers. To finally be here, playing close to home, it's really a dream come true. The organization is top-notch, and the winning culture they have built is something I've always wanted to be a part of.",
                japanese: "正直、最高の気分です。南カリフォルニアで育ったので、ずっとドジャースを見てきました。ついにここに来て、地元の近くでプレーできるなんて、本当に夢が叶ったようです。組織も一流ですし、彼らが築き上げてきた常勝の文化は、ずっとその一部になりたいと思っていたものでした。"
            },
            {
                startTime: 34,
                english: "Let's talk about your pitching. You have one of the most electric arms in the game. What adjustments, if any, are you looking to make this season with the Dodgers' coaching staff?",
                japanese: "ピッチングについて話しましょう。あなたは球界でも指折りの剛腕の持ち主です。今シーズン、ドジャースのコーチ陣と共に、何か修正しようとしている点はありますか？"
            },
            {
                startTime: 48,
                english: "I think for me, it's always about refining the command. My stuff has always been there, but consistency is key. We've been analyzing my delivery mechanics to ensure I can stay healthy and effective deep into games. The Dodgers heavily utilize data, and that's been really helpful for me to understand my pitch shapes better.",
                japanese: "私にとって、常に制球を磨くことが課題だと思っています。球威は常にありましたが、重要なのは一貫性です。健康を維持し、試合後半まで効果的な投球ができるよう、投球フォームのメカニクスを分析しています。ドジャースはデータを多用するので、自分の球種の変化をより深く理解するのにとても役立っています。"
            },
            {
                startTime: 75,
                english: "Obviously, joining a rotation that includes names like Yamamoto and potentially Kershaw is huge. What's the vibe like in the clubhouse right now with all these superstars?",
                japanese: "山本や、カーショウのような名前が並ぶローテーションに加わるのは明らかに大きなことです。これだけのスーパースターが揃っている今のクラブハウスの雰囲気はどうですか？"
            },
            {
                startTime: 88,
                english: "It's electric but also very focused. Everyone knows expectations are high, but we're just trying to get better every day. Specifically watching Yamamoto throw... his command is unbelievable. We're all pushing each other. It's a healthy competition, but ultimately we all want the same thing: to win a World Series.",
                japanese: "刺激的ですが、同時にとても集中した雰囲気です。期待が高いことは全員分かっていますが、私たちはただ毎日上手くなろうとしているだけです。特に山本の投球を見ていると…彼の制球力は信じられないほどです。お互いに刺激し合っています。健全な競争ですが、最終的に求めているものは全員同じ、ワールドシリーズ制覇です。"
            },
            {
                startTime: 115,
                english: "With Shohei Ohtani also joining the team, the media attention is unlike anything we've seen. Does that add pressure, or do you thrive on it?",
                japanese: "大谷翔平もチームに加わり、メディアの注目度はかつてないほどです。それはプレッシャーになりますか、それともそれを力に変えますか？"
            },
            {
                startTime: 126,
                english: "I think it forces you to lock in. There's no hiding. But honestly, as a competitor, you want to play on the biggest stage. Having Shohei on our side is better than facing him, that's for sure! He takes a lot of the spotlight, which actually lets us pitchers just focus on our jobs. It's going to be a fun year.",
                japanese: "集中せざるを得なくなりますね。隠れる場所はありません。でも正直、競技者としては最高の舞台でプレーしたいものです。翔平が味方にいるのは、彼と対戦するよりマシなのは間違いないですよ！彼がスポットライトを浴びてくれるおかげで、私たち投手は自分の仕事に集中できます。楽しい一年になりそうです。"
            },
            {
                startTime: 150,
                english: "Thanks for joining us, Tyler. We can't wait to see you on the mound at Dodger Stadium. Best of luck this season.",
                japanese: "出演してくれてありがとう、タイラー。ドジャースタジアムのマウンドであなたの姿を見るのを楽しみにしています。今シーズンの幸運を祈ります。"
            }
        ]
    },
    {
        id: "rensox-mario-tennis-aces",
        youtubeId: "R5pvOxNJ9IQ",
        title: "Mario Otaku's Mario Tennis Aces (Japanese)",
        description: "RenSox plays Mario Tennis Aces and talks about the upcoming 'Mario Tennis Fever'. (Japanese to English Practice)",
        date: "2026-01-14",
        segments: [
            { startTime: 5, english: "Ah, ah, ah. Good evening everyone. How are you doing? It's been a little while.", japanese: "あ、あ、あ。皆さんこんばんは。お元気でしょうか？ちょっとお久しぶりですね。" },
            { startTime: 11, english: "Sorry I haven't been able to do many live streams recently.", japanese: "えー、最近ちょっと生放送あんまりできてなくてすいません。" },
            { startTime: 16, english: "Mario Tennis Fever is coming out soon. Once it does, I want to do lots of Mario Tennis streams.", japanese: "あの、マリオテニスフィーバーもうちょっとしたら発売しますから。そしたらですね、マリオテニスの放送いっぱいしたいと思います。" },
            { startTime: 22, english: "I really love the Mario Tennis series. I'll talk about the details somewhere else later.", japanese: "僕もマリオテニスシリーズ本当に大好きで、ま、詳しくはまたどっかで語ります。" },
            { startTime: 27, english: "Anyway, this is Mario Tennis Aces. It's the previous game.", japanese: "とりあえずマリオテニスエースですね。1個前の作品です。" },
            { startTime: 30, english: "It was released in 2018, and I treat this game as a masterpiece.", japanese: "2018年に発売したゲームで、僕このゲーム名作扱いしてます。" },
            { startTime: 35, english: "Some game catalog described it as a 'Surume Game' (an acquired taste).", japanese: "スルメゲーってなんかゲームカタログには書いてありました。" },
            { startTime: 38, english: "Well, that's true. Honestly, it is a masterpiece, but I think it's a bit difficult for beginners.", japanese: "ま、そうですね。あ、正直名作ではあるんですけど、初心者にはちょっと難しいゲームかなと思います。" },
            { startTime: 42, english: "Because, after all, it is a fighting game.", japanese: "というのもやっぱ格闘ゲームなんで。" },
            { startTime: 48, english: "Right, right. Well, looking at the rankings, there seem to be a few people online, so I might try playing.", japanese: "そうそうそうそう。ま、オンラインもね、なんかまだランキング見てるとちょこちょこいるみたいなんでちょっとやってみようかな。" },
            { startTime: 55, english: "I'm doing a matching live stream, hoping someone will come. If no one comes, I'll give up and play against the computer.", japanese: "マッチング生放送やってるから誰か来ないかなと思って。ま、誰も来なかったら諦めてコンピューターと遊んでます。" },
            { startTime: 60, english: "Ah, this was a Free Match. Sorry. Tournament. This one.", japanese: "あ、これフリーマッチだった。ごめんなさい。トーナメントだ。こっちですね。" },
            { startTime: 69, english: "Good evening. Mario Tennis Fever is coming out, you know. I gotta play.", japanese: "こんばんは。ちょっとマリオテニスフィーバー出るからね。やっぱりやっておかないとね。" },
            { startTime: 79, english: "Simple Class represents skill well for the next game, but I want to use Rosetta (Rosalina), so Standard Class it is.", japanese: "まあ、シンプル部門ね、あの、やっぱり次回作に役立ちそうなんですけど、やっぱちょっとロゼッタ使いたいんでね。スタンダード部門かな。" },
            { startTime: 87, english: "Also, being able to play with Aces rules... everyone will move to Fever, so this is probably the last chance.", japanese: "ま、あとマリオテニスエースのルールで遊べるのがもうなんかね、みんなフィーバーに行っちゃうから多分これが最後かなと思うと。" },
            { startTime: 95, english: "Okay, let's go with Lady Rosetta.", japanese: "はい、じゃあロゼッタ様でやっていきましょう。" },
            { startTime: 100, english: "No, really. I played just a little bit for a shoot last month, but that's it.", japanese: "いや、本当にね、あれですよ。先月ちょっとだけ撮影でやったんですけど、もうそれだけです。" },
            { startTime: 107, english: "Honestly, I've gotten really bad at Mario Tennis. But I love this series and played it a lot, so I want to get it back somehow.", japanese: "正直僕マリオテニスめっちゃ下手になってます。ま、でも結構大好きというかもやり込んでたシリーズなんでなんとか取り戻したいですね。" },
            { startTime: 117, english: "Too fast. Wait a sec. The connection is dead. The connection display is dead, sorry. I'll cancel this one.", japanese: "も早。え、でもちょっと待って。回線が終わってる。回線が表示がちょっと終わってるかごめん。これはちょっとキャンセルさせてもらおう。" },
            { startTime: 123, english: "There wasn't a single bar on the connection display.", japanese: "回線の表示がちょっと1個もなかったんで。" },
            { startTime: 129, english: "Yeah, that's how it is. If you cancel a match, you can't see the next opponent's character. Well, can't be helped.", japanese: "いや、そうなんですよ。対戦キャンセルするとね、次の相手のキャラクター見れなくなります。ま、ま、それはしょうがないね。" },
            { startTime: 139, english: "But seriously, bad connection makes Mario Tennis Aces unplayable, so sorry about that.", japanese: "でもちょっともう回線悪いのはあの本当にね、マリオテニスエースはゲームにならないので申し訳ない。" },
            { startTime: 145, english: "Well, since you can't see the opponent's name, you can cancel without guilt. Yeah.", japanese: "ま、相手の対戦相手の名前とか見れないから気ねなくキャンセルできるのがいいですよね。うん。" },
            { startTime: 151, english: "That's right. I thought zero connection bars was bad.", japanese: "そうなんですよ。ちょっと回線ゼロだったのはまずいかなと思って。" },
            { startTime: 154, english: "Ah, well, not bad. Not bad. Totally fine. This one. Ah, good. Good connection. Let's play this person.", japanese: "あーあ、ま、悪くない。悪くない。全然よかった。これ。ああ、よかった。回線いい。この人とやりましょう。" },
            { startTime: 163, english: "Now, the opponent's character is hidden because I canceled once. That's the rule.", japanese: "さあ、相手のキャラクターは1回キャンセルしてるんで見えなくなります。そういうルールです。" },
            { startTime: 169, english: "Oh, isn't it Tottoko Ichitaro-san? I know him. He comes to the live streams. Thanks. Let's do this.", japanese: "おお、とっとこ一太郎さんじゃないか。知ってる人だ。生放送来てくれてる方だ。ありがとう。よろしく。" },
            { startTime: 178, english: "Let's play Mario Tennis with me. Whoa. Crap. I got smashed. But I got it.", japanese: "俺とマリオテニスしようぜ。うえ。やばい。ブやれた。でも取れた。" },
            { startTime: 187, english: "Too bad. I won't give up until the end. Don't think you can beat me with that level, Tottoko Ichitaro.", japanese: "残念だったな。俺は最後まで諦めないぜ。その程度で俺に勝てると思うなよ。とっとこ一太郎。" },
            { startTime: 194, english: "Thanks for always coming to the live broadcast.", japanese: "いつも生放送に来てくれてありがとう。" },
            { startTime: 199, english: "Take this! What? No way. He read it. This guy is good. Tottoko Ichitaro.", japanese: "くらえ。何？バカな。バレている。こいつやる。とっとこ一太郎。" },
            { startTime: 206, english: "Was he this good at Mario Tennis? All right. Close one. Here it comes. Okay.", japanese: "マリオテニスこんなうまかったのか。よっしゃ。危ねえ。来た。オッケー。" },
            { startTime: 215, english: "But I am better. Eh, too close. How embarrassing.", japanese: "だが私の方が上手な。え、近すぎた。恥ずかしい。" },
            { startTime: 224, english: "Nice, nice. Serve coming. Smash it. Okay. Good, good, good.", japanese: "ナイス、ナイス。サブ来た。ぶっ飛ばせ。オッケ。よしよしよしよしよし。" },
            { startTime: 234, english: "Here I go. I'll take the lead. I won't use a Zone Shot... or rather, I didn't have gauge.", japanese: "行くぜ。冷凍上げさせてもらうぜ。狙い打ちはしないというか。ゲージがなかった。" },
            { startTime: 243, english: "Ah, crap. Crap. Doing a Zone Shot without gauge is bad. Ah, discard this. Discard this. I'm discarding this.", japanese: "あ、やばい。やばい。これ狙い打ちもゲージがない状態の狙う打ちはやばい。あ、これもう捨て。これ捨て。これ捨てます。" },
            { startTime: 252, english: "This is a throwaway game. Well, I have no energy. Without energy, you can't do anything in this game.", japanese: "これステ会です。ま、エナジーがないんで。エナジーないと何もできないです、このゲーム。" },
            { startTime: 258, english: "Yeah, that's right. He plays quite a bit. Thanks.", japanese: "えー、そうなんですよ。結構やってる方ですね。ありがとう。" },
            { startTime: 262, english: "No, really, Mario Tennis is said to be dead, but there are still people playing.", japanese: "いや、ほんとね、マリオテニスはね、結構過疎と言われてますが、まだ全然いるんですよね。" },
            { startTime: 268, english: "So, it helps to get matches like this. Yes.", japanese: "だからね、結構こうしてマッチングするの助かります。はい。" },
            { startTime: 271, english: "Oh, nice block. Wait. This guy is good.", japanese: "お、ナイスブロック。ちょっと待って。この人うまいんだけど。" },
            { startTime: 275, english: "Wait a sec, Ichitaro-san. Wait. Isn't Ichitaro-san too good?", japanese: "ちょっと一太郎さん。ちょっと待って。一太郎さんうますぎない？" },
            { startTime: 280, english: "Crap. I haven't seen someone pull off a Technical Block in ages. Besides me.", japanese: "やばい。テクニカルブロック出せる人久々に見たんだけど俺。俺以外で。" },
            { startTime: 285, english: "Crap. This Tottoko Ichitaro person is dangerous. Quite an expert, this one.", japanese: "やばい。この人とっとこ一太郎やばいぞ。かなりの手誰だ、これ。" },
            { startTime: 290, english: "Wait. I'm gonna lose, normally. Wait a sec. Can I get serious?", japanese: "え、待って。俺負けるよ、普通に。ちょっと待って。本気出していいすか？" },
            { startTime: 294, english: "Going all out against Ichitaro-san is a bit much, but I don't want to lose so I'll try hard.", japanese: "ちょっと一太郎さん相手に本気出すのもあれだけど、ちょっと負けたくないんで頑張ります。" },
            { startTime: 300, english: "Eh, Ichitaro-san is super good. Is this guy a Newtype? Amazing.", japanese: "え、一太郎さんめっちゃうまいんだけど。この人ニュータイプか？すご。" },
            { startTime: 305, english: "Wait. I'll use acceleration. I'll take this point no matter what.", japanese: "え、待って。加速使います。ここはちょっと意地でも取る。" },
            { startTime: 310, english: "Close. No, I'll use Rosetta's floating ability to hit a Charge Shot.", japanese: "危ない。いや、ちょっとこれはね、ロゼッタの浮遊感を生かしてチャージショットを打っていく。" },
            { startTime: 316, english: "Ah, no good? Eee, good. Too good.", japanese: "あー、だめか。いー、うまい。うますぎる。" },
            { startTime: 321, english: "No, this person is really good. I'm a bit moved. That someone this good is still here.", japanese: "いや、この人本当にうまいな。ちょっと感動するわ。こんなうまい人がまだいてくれるなんて。" },
            { startTime: 328, english: "Seriously, when Mario Tennis Fever comes out, let's fight. Let's be friends.", japanese: "いや、マリオテニスフィーバー出たら絶対戦おうな。フレンドなろうぜ。" },
            { startTime: 334, english: "No way. He took one game. Damn, so frustrating.", japanese: "いや、まじか。1ゲーム取られた。くそー、悔しい。" },
            { startTime: 339, english: "But, you know, this is why Mario Tennis is fun.", japanese: "いや、でもね、これがあるからマリオテニスは面白いんですよ。" },
            { startTime: 343, english: "It's not just hitting the ball back. This bargaining, and energy management.", japanese: "ただボールを打ち返すだけじゃない。この駆け引き、そしてエナジー管理。" },
            { startTime: 348, english: "It's a fighting game, this is. A fighting game in the guise of a sports game.", japanese: "格ゲーなんですよ、これはもう。スポーツゲームの皮を被った格ゲーです。" },
            { startTime: 353, english: "Alright, pulling myself together. I have the serve.", japanese: "よし、気を取り直して。サーブ権は僕にある。" },
            { startTime: 357, english: "I'll make a comeback from here. Just watch.", japanese: "ここから巻き返しますよ。見ててください。" },
            { startTime: 362, english: "Yes, nice serve. And here, a drop shot.", japanese: "はい、ナイスサーブ。で、ここでドロップショット。" },
            { startTime: 366, english: "Ah, he read it. Damn, is this guy really a Newtype?", japanese: "あ、読まれてる。くそ、こいつマジでニュータイプか。" },
            { startTime: 370, english: "But don't underestimate Rosetta's reach.", japanese: "でもね、ロゼッタのリーチをなめないでいただきたい。" },
            { startTime: 374, english: "Here. Special move, Star Shot.", japanese: "ここだ。必殺、スターショット。" },
            { startTime: 378, english: "Yes, point. Did you see that, Ichitaro? This is the power of the galaxy.", japanese: "よし、決まった。見たか一太郎。これが銀河の力だ。" },
            { startTime: 385, english: "Phew, close close. If you let your guard down, you get tripped up immediately.", japanese: "ふう、危ない危ない。油断するとすぐ足元救われるな。" },
            { startTime: 390, english: "Everyone, when playing Mario Tennis, don't relax until the end.", japanese: "皆さんもね、マリオテニスやるときは最後まで気を抜かないように。" },
            { startTime: 395, english: "The scary and fun thing about this game is you can turn it around even from 0 points.", japanese: "0ポイントからでも逆転できるのがこのゲームの怖いところであり、面白いところなんで。" },
            { startTime: 405, english: "Now, match point. I'll finish it here.", japanese: "さあ、マッチポイント。これで決めさせてもらいます。" },
            { startTime: 410, english: "Here I go. Special Shot.", japanese: "いくぞ。スペシャルショット。" },
            { startTime: 415, english: "How's that? You can't return this.", japanese: "どうだ。これは返せないだろう。" },
            { startTime: 420, english: "Alright! Won. That was close.", japanese: "よっしゃー。勝った。危なかったー。" },
            { startTime: 425, english: "Wow, Tottoko Ichitaro-san, thanks for the match. You were strong.", japanese: "いやー、とっとこ一太郎さん、対戦ありがとうございました。強かった。" },
            { startTime: 430, english: "Seriously broke a sweat. Let's play again.", japanese: "マジで冷や汗かいたわ。またやりましょう。" },
            { startTime: 435, english: "Man, didn't think it would be such a hot match from the first game.", japanese: "いやー、初戦からこんな熱い試合になるとは思わなかったな。" },
            { startTime: 440, english: "A good start. I'll do my best to win the championship at this pace.", japanese: "幸先いいですね。この調子で優勝目指して頑張ります。" },
            { startTime: 450, english: "Now, who is the next opponent?", japanese: "さて、次の相手は誰かな。" },
            { startTime: 455, english: "Oh, next is Bowser? A Power Type.", japanese: "お、次はクッパか。パワータイプですね。" },
            { startTime: 460, english: "Power Types are annoying because they knock you back.", japanese: "パワータイプはね、吹き飛ばされるのが厄介なんですよ。" },
            { startTime: 464, english: "Rosetta is a Technique Type, so if we clash head-on, I'll lose the push.", japanese: "ロゼッタはテクニックタイプなんで、正面からぶつかると押し負けちゃうんですよね。" },
            { startTime: 470, english: "So, I'll use a strategy to dodge well and make the opponent run.", japanese: "だから、うまくかわして、相手を走らせる戦法でいきます。" },
            { startTime: 475, english: "Okay, matched. Nice to meet you.", japanese: "よし、マッチングしました。よろしくお願いします。" },
            { startTime: 480, english: "Opponent's name is... Tank-san? Sounds strong.", japanese: "相手の名前は...タンクさんか。強そうだな。" },
            { startTime: 485, english: "Tank-san, please go easy on me.", japanese: "タンクさん、お手柔らかにお願いしますよ。" },
            { startTime: 495, english: "Whoa, serve is fast. Isn't that a Max Serve?", japanese: "うわ、サーブ早っ。これマックスサーブじゃない？" },
            { startTime: 500, english: "Close. Managed to return it though.", japanese: "あぶね。なんとか返したけど。" },
            { startTime: 505, english: "Bowser's shots are heavy as expected. My gauge is getting shaved.", japanese: "やっぱクッパの球は重いなー。ゲージが削られる。" },
            { startTime: 510, english: "I have to parry with Technical Shots here.", japanese: "ここはテクニカルショットでいなすしかない。" },
            { startTime: 515, english: "There. A beautiful slice.", japanese: "ほらよっと。きれいなスライス。" },
            { startTime: 520, english: "Ah, he caught up. Not bad, Tank-san.", japanese: "あ、追いついてきた。やるなータンクさん。" },
            { startTime: 525, english: "But, I won't lose in stamina.", japanese: "でもね、スタミナなら負けないよ。" },
            { startTime: 530, english: "Alright, passing over the opponent's head with a lob.", japanese: "よし、ロブで相手の頭上を抜く。" },
            { startTime: 535, english: "It worked! Feels good.", japanese: "決まったー。気持ちいいー。" },
            { startTime: 540, english: "This is why I can't quit Mario Tennis.", japanese: "これだからマリオテニスはやめられないんですよ。" },
            { startTime: 545, english: "This pleasure when you outsmart the opponent. Unbearable.", japanese: "この、相手の裏をかいた瞬間の快感。たまりませんね。" },
            { startTime: 555, english: "Okay, I'll break here and decide it at once.", japanese: "よし、この調子でブレイクして一気に決めるぞ。" },
            { startTime: 560, english: "Orya. Smash.", japanese: "おりゃ。スマッシュ。" },
            { startTime: 565, english: "Ah, blocked. Seriously? Isn't his reaction speed amazing?", japanese: "あ、ブロックされた。まじか。反応速度すごくない？" },
            { startTime: 570, english: "But I made him use gauge, so he shouldn't be able to withstand the next one.", japanese: "でもゲージ消費させたから、次は耐えられないはず。" },
            { startTime: 575, english: "One more. Smash.", japanese: "もう一発。スマッシュ。" },
            { startTime: 580, english: "Yes, destroyed the racket. This is Mario Tennis Aces.", japanese: "よし、ラケット破壊した。これぞマリオテニスエース。" },
            { startTime: 585, english: "KO win. Tank-san, thanks for the match.", japanese: "ＫＯ勝ちです。タンクさん、対戦ありがとうございました。" },
            { startTime: 590, english: "Man, playing against Power Types is scary because of this, but the exhilaration when winning is exceptional.", japanese: "いやー、パワータイプ相手にはこれがあるから怖いけど、勝った時の爽快感もひとしおですね。" },
            { startTime: 600, english: "Now, that's the second round cleared.", japanese: "さて、これで2回戦突破か。" },
            { startTime: 605, english: "Next is semifinals?", japanese: "次は準決勝かな？" },
            { startTime: 610, english: "I might be in good form today. Could I go for an all-win championship?", japanese: "なんか今日調子いいかも。このまま全勝優勝いけるんじゃない？" },
            { startTime: 615, english: "Everyone, please cheer for me.", japanese: "皆さん、応援よろしくお願いしますね。" },
            { startTime: 620, english: "I'm reading all the comments too. Thank you.", japanese: "コメントも全部読んでますからね。ありがとうございます。" },
            { startTime: 625, english: "'Rosetta is cute'. Ah, exactly. I understand.", japanese: "「ロゼッタ可愛い」あ、それな。わかります。" },
            { startTime: 630, english: "Rosetta-sama's floating feeling, and how the dress sways. It's the best, isn't it?", japanese: "ロゼッタ様のこの浮遊感、そしてドレスの揺れ具合。最高ですよね。" },
            { startTime: 635, english: "Nintendo really does a good job.", japanese: "任天堂さん、いい仕事してますよ本当に。" },
            { startTime: 640, english: "'Will Rosetta continue in Mario Tennis Fever?'", japanese: "「マリオテニスフィーバーでもロゼッタ続投かな？」" },
            { startTime: 645, english: "No, that's definitely a yes. Getting cut is impossible.", japanese: "いや、それは絶対そうでしょ。リストラとかありえないから。" },
            { startTime: 650, english: "If Rosetta isn't there, I'll cry. I'll rampage.", japanese: "もしロゼッタいなかったら僕泣きますよ。暴れますよ。" },
            { startTime: 655, english: "Well, I don't think that's the case, so let's look forward to it.", japanese: "ま、そんなことはないと思うんで楽しみに待ちましょう。" },
            { startTime: 660, english: "Oh, the next opponent is decided.", japanese: "お、次の対戦相手が決まりました。" },
            { startTime: 665, english: "Semifinal opponent is... Waluigi.", japanese: "準決勝の相手は...ワルイージか。" },
            { startTime: 670, english: "A Defensive Type... I dislike them the most.", japanese: "ディフェンスタイプかー。一番苦手なんだよなー。" },
            { startTime: 675, english: "Because the ball never drops. And his arms are long.", japanese: "だって全然ボール落ちないんだもん。手長いし。" },
            { startTime: 680, english: "I guess I just have to outlast him. I'm prepared for a long battle.", japanese: "粘り勝ちするしかないかなー。長期戦覚悟でいきます。" },
            { startTime: 690, english: "Nice to meet you.", japanese: "よろしくお願いします。" },
            { startTime: 695, english: "Whoa, doing tricky moves right off the bat.", japanese: "うわ、いきなりトリッキーな動きしてくるな。" },
            { startTime: 700, english: "Waluigi is moonwalking.", japanese: "ムーンウォークしてるよワルイージ。" },
            { startTime: 705, english: "Is he taunting? Taunting me?", japanese: "煽ってる？煽ってるの？" },
            { startTime: 710, english: "Well, fine. I'll silence you with skill.", japanese: "まあいいでしょう。実力で黙らせてやりますよ。" },
            { startTime: 720, english: "There, opposite side.", japanese: "ほら、そこ。逆サイド。" },
            { startTime: 725, english: "Ah, he reaches it? His arms are too long.", japanese: "あー、届くのかよ。長いなー手が。" },
            { startTime: 730, english: " Then how about this. Drop.", japanese: "じゃあこっちはどうだ。ドロップ。" },
            { startTime: 735, english: "Okay, you can't get that.", japanese: "よし、取れないだろ。" },
            { startTime: 740, english: "Ah, he took it with a slide. You kidding?", japanese: "あ、スライディングで取った。嘘でしょ？" },
            { startTime: 745, english: "What's with Waluigi's defensive range? Isn't it bug-level?", japanese: "ワルイージの守備範囲どうなってんの？バグレベルじゃない？" },
            { startTime: 750, english: "No, complaining won't start anything. I have to break him.", japanese: "いや、文句言っても始まらない。崩すしかない。" },
            { startTime: 755, english: "Swing left and right, swing, and tire him out. This is it.", japanese: "左右に振って、振って、疲れさせる。これだ。" },
            { startTime: 765, english: "Here, right. Left. Right.", japanese: "ほら、右。左。右。" },
            { startTime: 770, english: "Yes, his posture broke.", japanese: "よし、体勢崩れた。" },
            { startTime: 775, english: "Now. Straight Charge Shot.", japanese: "ここだ。ストレートのチャージショット。" },
            { startTime: 780, english: "It worked! Finally got one point.", japanese: "決まったー。やっと1点取れた。" },
            { startTime: 785, english: "It was long. This one point is huge.", japanese: "長かったー。この1点は大きいよ。" },
            { startTime: 790, english: "The opponent must be panicked too. I'll pile it on from here.", japanese: "相手も焦ってるはず。ここから畳みかけるぞ。" },
            { startTime: 795, english: "Orya. Orya.", japanese: "おりゃ。おりゃ。" },
            { startTime: 800, english: "Yes, break successful.", japanese: "よし、ブレイク成功。" },
            { startTime: 805, english: "I'll take the set like this.", japanese: "このままセット取ります。" },
            { startTime: 810, english: "Alright! Game set.", japanese: "よっしゃー。ゲームセット。" },
            { startTime: 815, english: "I won. Phew, tired.", japanese: "勝ちましたー。ふー、疲れた。" },
            { startTime: 820, english: "Waluigi matches really drain mental strength.", japanese: "ワルイージ戦は本当に精神力削られるわ。" },
            { startTime: 825, english: "But I'm glad I won.", japanese: "でも勝ててよかった。" },
            { startTime: 830, english: "Now the finals. Finally the final match.", japanese: "これで決勝ですね。ついに決勝戦。" },
            { startTime: 835, english: "If I've come this far, I have to win.", japanese: "ここまで来たら優勝しかないでしょ。" },
            { startTime: 840, english: "Everyone, please watch until the end.", japanese: "皆さん、最後まで見てってくださいね。" },
            { startTime: 845, english: "Ah, I'll drink tea. Thirsty.", japanese: "あ、お茶飲みます。喉乾いた。" },
            { startTime: 855, english: "Everyone, don't forget to hydrate too.", japanese: "皆さんも水分補給忘れないでくださいね。" },
            { startTime: 860, english: "You tend to forget unexpectedly when engrossed in a game.", japanese: "ゲームに熱中してると意外と忘れがちなんですよね。" },
            { startTime: 865, english: "Especially in summer, you have to be careful. It's winter now though.", japanese: "特に夏場とかは気を付けないと。今は冬だけど。" },
            { startTime: 870, english: "Now, who is the final opponent.", japanese: "さあ、決勝の相手は誰だ。" },
            { startTime: 875, english: "Who is the Last Boss.", japanese: "ラスボスは誰だ。" },
            { startTime: 880, english: "...Mario?", japanese: "...マリオ？" },
            { startTime: 885, english: "Protagonist has come. Mario vs Rosetta.", japanese: "主人公来たー。マリオvsロゼッタ。" },
            { startTime: 890, english: "This is a match card that feels like 'Mario Tennis'.", japanese: "これぞマリオテニスって感じのカードですね。" },
            { startTime: 895, english: "Opponent is All-Round Type. No openings.", japanese: "相手はオールラウンドタイプ。隙がない。" },
            { startTime: 900, english: "But, will my love for Rosetta win, or Mario's protagonist armor?", japanese: "でも、僕のロゼッタ愛が勝つか、マリオの主人公補正が勝つか。" },
            { startTime: 905, english: "A battle I cannot lose is right there.", japanese: "負けられない戦いがそこにある。" },
            { startTime: 910, english: "Here I go. Finals.", japanese: "行きます。決勝戦。" },
            { startTime: 915, english: "Nice to meet you.", japanese: "よろしくお願いします。" },
            { startTime: 920, english: "Good. The course choice is nasty.", japanese: "うまい。コース取りがいやらしい。" },
            { startTime: 925, english: "Aiming right at the line limit. This person is a pro.", japanese: "ラインぎりぎりを狙ってくる。玄人だなこの人。" },
            { startTime: 930, english: "But I haven't played Mario Tennis for nothing.", japanese: "でも僕だって伊達にマリオテニスやり込んでないんでね。" },
            { startTime: 935, english: "I read that course.", japanese: "そのコースは読んでました。" },
            { startTime: 940, english: "Counter.", japanese: "カウンター。" },
            { startTime: 945, english: "Oh, surprised?", japanese: "お、驚いてる？" },
            { startTime: 950, english: "I'm not done yet.", japanese: "まだまだこんなもんじゃないですよ。" },
            { startTime: 955, english: "I'll show you the serious Lady Rosetta.", japanese: "本気のロゼッタ様をお見せしましょう。" },
            { startTime: 960, english: "May the Star protect me.", japanese: "スターの加護あれ。" },
            { startTime: 965, english: "Special Shot activate.", japanese: "スペシャルショット発動。" },
            { startTime: 970, english: "Stop it if you can.", japanese: "止められるものなら止めてみろ。" },
            { startTime: 975, english: "Ah, he blocked. Not bad, Mario.", japanese: "あ、ブロックした。やるなマリオ。" },
            { startTime: 980, english: "But the racket must have taken damage.", japanese: "でもラケットにダメージは入ったはず。" },
            { startTime: 985, english: "I'll break it with the next Special.", japanese: "次のスペシャルで壊してやる。" },
            { startTime: 990, english: "Rally continues. Long.", japanese: "ラリーが続く。長い。" },
            { startTime: 995, english: "Suffocating offense and defense. This is it.", japanese: "息が詰まるような攻防。これだよこれ。" },
            { startTime: 1000, english: "Fun. Brain juice is flowing.", japanese: "楽しいー。脳汁出るー。" },
            { startTime: 1005, english: "Yes, induced an opponent's error.", japanese: "よし、相手のミスを誘った。" },
            { startTime: 1010, english: "Chance ball.", japanese: "チャンスボール。" },
            { startTime: 1015, english: "I'll finish it. Smash.", japanese: "決めるぜ。スマッシュー。" },
            { startTime: 1020, english: "Alright! Championship!", japanese: "よっしゃー。優勝だー。" },
            { startTime: 1025, english: "Yay. First championship in a while. Happy.", japanese: "やったー。久しぶりの優勝。嬉しいー。" },
            { startTime: 1030, english: "Mario-san, thanks for the match. You were strong. Seriously strong.", japanese: "マリオさん、対戦ありがとうございました。強かった。マジで強かった。" },
            { startTime: 1035, english: "Man, that was a good match.", japanese: "いやー、いい試合だった。" },
            { startTime: 1040, english: "I'll keep this as an archive. It was a great bout.", japanese: "これアーカイブ残しとこう。名勝負だった。" },
            { startTime: 1045, english: "Everyone, thanks for the support.", japanese: "皆さん、応援ありがとうございました。" },
            { startTime: 1050, english: "Thanks to you, I was able to win.", japanese: "おかげで優勝できました。" },
            { startTime: 1055, english: "Mario Tennis is the best after all.", japanese: "やっぱマリオテニス最高ですね。" },
            { startTime: 1060, english: "I'll definitely buy the next game too.", japanese: "次回作も絶対買います。" },
            { startTime: 1065, english: "I'll polish my skills more until then.", japanese: "それまでもっと腕磨いておきます。" },
            { startTime: 1070, english: "Well then, that's it for today.", japanese: "それじゃあ今日はこの辺で。" },
            { startTime: 1075, english: "See you in the next broadcast.", japanese: "また次の放送でお会いしましょう。" },
            { startTime: 1080, english: "Goodbye. Good night.", japanese: "さようならー。おやすみなさい。" }
        ]
    },
    {
        id: "mlb-offseason-jan2025",
        youtubeId: "",
        title: "MLB Offseason Update - January 2025",
        description: "Japanese MLB streamer discusses Arenado trade to D-backs, Ryan Weathers to Yankees, Kyle Tucker market, Team USA WBC roster, and more.",
        date: "2026-01-15",
        segments: [
            { startTime: 31, english: "Yes, good evening everyone. There was some news today, right?", japanese: "はい、皆さんこんばんは。今日ニュースありましたよね？" },
            { startTime: 39, english: "There's a lot to talk about. Tucker, come on. Tucker, come here. Come now. I'm waiting.", japanese: "いろいろあるんですよ。タッカー来いよ。タッカー来て。来て今。待ってるんだから。" },
            { startTime: 49, english: "Waiting for Tucker. Waiting for Passan.", japanese: "タッカー待ち。Passan待ち。" },
            { startTime: 55, english: "Tucker endurance stream? No, it's not a Tucker endurance stream. I want to do one though.", japanese: "タッカー耐久配信？いや、タッカー耐久配信じゃないです。やりたいけどね。" },
            { startTime: 63, english: "He's not coming. Not coming. Let's wait a few more days for Tucker. A few days.", japanese: "来ないんだって。来ないの。タッカーはもう何日か待ちましょう。何日か。" },
            { startTime: 75, english: "Heyman's already awake. Heyman's up too. Well, it's daytime over there, right?", japanese: "Heymanもう起きてるし。Heymanも起きてるんだよね。まあ向こう昼間だよね。" },
            { startTime: 88, english: "So it was domestic after all. Oh, YP, thank you for the Super Chat. 'Finally, news that the NFL lockout is ending today, so I can relax. Alright, back-to-back Super Bowl wins next year.' Wait, there was an NFL lockout? I had no idea. I haven't been following at all. Oh really? There was lockout stuff going on? They're doing playoffs right now, right?", japanese: "やっぱ国内だったか。あ、YPさん、スパチャありがとうございます。「やっとNFLのロックアウト終わるって今日ニュース出たので安心できます。よし、来年も連覇だ」え、NFLロックアウトあったの？全然知らなかった。全然追ってないもん。あれ、マジ？ロックアウト話あったの？今プレーオフやってるよね？" },
            { startTime: 117, english: "Lockout recession, huh. All this lockout talk is depressing.", japanese: "ロックアウト不況か。ロックアウトの話ばっかで萎えるわ。" },
            { startTime: 128, english: "Oh, MLB Top 100? Yeah, that's right. The MLB prospect rankings are being gradually announced now.", japanese: "あ、MLBトップ100？そうそう。今MLBのプロスペクトランキングが順番に発表されてるんですよね。" },
            { startTime: 142, english: "Come on, breaking news. Seriously, come on.", japanese: "速報来いよ。マジで来いよ。" },
            { startTime: 150, english: "Alright, so today we've got a lot. The Arenado trade, Ryan Weathers to the Yankees, and also, unusually, Passan dropped some rumors, and there's some pretty concrete talk about Tucker coming out.", japanese: "さて、今日はいろいろありまして。アレナドトレード、ライアン・ウェザースのヤンキース移籍、あとですね珍しくPassanが噂を落としてくれて、タッカーについてかなり具体的な話が出てきてます。" },
            { startTime: 171, english: "Clement too. WBC. Buxton and Clement are both WBC.", japanese: "クレメントも。WBC。バクストンとクレメントは両方WBC。" },
            { startTime: 183, english: "Yeah. So let's start talking.", japanese: "うん。じゃあ話していきましょう。" },
            { startTime: 189, english: "What should I start with? Well, let's go with Arenado first.", japanese: "何から始めようかな。まあアレナドから行きましょう。" },
            { startTime: 196, english: "Arenado. This was late last night, right? The Arenado trade went through. I was completely surprised it happened at this timing. I was like 'seriously?' I thought Arenado would drag on until maybe late February, but it got done pretty quickly. Although...", japanese: "アレナド。これ昨日の夜遅くでしたよね？アレナドトレード成立しました。このタイミングでびっくりしたわ。「マジで？」って感じ。アレナドは2月下旬ぐらいまでずるずる行くと思ってたんだけど、意外と早く決まったね。ただ..." },
            { startTime: 220, english: "Yeah. The Cardinals, is this really okay for them? It felt like that kind of trade. They must have really wanted to get rid of him, or had no choice but to get rid of him. Just desperately wanted him gone. That kind of trade.", japanese: "うん。カージナルスこれでいいのか？って感じのトレードだったね。本当に出したかったんだろうな、出すしかなかったんだろうな。とにかく出したかった。そういうトレード。" },
            { startTime: 239, english: "So yeah, I was surprised it was the D-backs, and with that price and salary coverage, couldn't he have just gone to the Angels? Like, it was basically a complete salary dump. Just take a little something, anything. That was the vibe.", japanese: "だからまあ、Dバックスだったのも驚いたし、この値段と年俸負担だと、エンゼルスでも良かったんじゃないの？ってレベル。完全に年俸ダンプですよ基本的に。なんでもいいから少しでも取ってくれ。そんな感じ。" },
            { startTime: 257, english: "So let's talk about the Arenado trade.", japanese: "じゃあアレナドトレードについて話しましょう。" },
            { startTime: 263, english: "It's the D-backs. There's already a collage being made, but it's the D-backs.", japanese: "Dバックスです。もうコラージュ作られてるけど、Dバックスです。" },
            { startTime: 268, english: "So what's Arenado's current state? His hitting is basically a shadow of what it was.", japanese: "で、アレナドの今の状態は？打撃は正直もう見る影もない。" },
            { startTime: 283, english: "He's completely declined. He doesn't strike out much. His contact ability is still high. But he can't hit the ball hard anymore. His offensive contribution is very low. His on-base ability was never his strength anyway.", japanese: "完全に衰えてます。三振は少ない。コンタクト能力はまだ高い。でも強い打球が打てなくなってる。打撃貢献度はかなり低い。出塁能力はもともと売りじゃなかったし。" },
            { startTime: 300, english: "So his batting performance, his wRC+ is in the 80s now. Way below 100. Two or three years ago he was still a viable player, but considering his current age, it's really rough. He's only 34 but he's in a tough spot. However, his defense is still above average, though not elite like before.", japanese: "だから打撃成績、wRC+は今80台ですよ。100を大きく割ってる。2、3年前はまだ戦力になってたけど、今の年齢考えるときついね。まだ34歳なのにきつい。ただ守備はまだ平均以上、昔みたいなエリートレベルじゃないけど。" },
            { startTime: 338, english: "So yeah, maybe the D-backs were the perfect fit. Like, if it was a full contender with lots of money and a solid organization that just needed a third baseman as the final piece, Arenado would feel a bit underwhelming. But the D-backs, they have Lawlar at third as a prospect, but they need a mentor presence. The middle infield has Marte and Perdomo as fixtures—those two are arguably top-tier in the majors. But first and third base both opened up during the season.", japanese: "だからまあ、Dバックスが最適解だったのかもね。例えば金も組織力もある本格的な優勝候補で、最後のピースとしてサードが欲しいってチームにとっては、アレナドはちょっと物足りない。でもDバックス、サードにプロスペクトのローラーがいるけど、メンター的な存在が欲しい。二遊間はマルテとペルドモが固定、この2人はメジャーでもトップレベル。でもファーストとサードはシーズン中に空いたんだよね。" },
            { startTime: 392, english: "First base is open, and Locklear they got from the Naylor trade isn't working out. Third base—do they just give it to young Jordan Lawlar? A top prospect? In that situation, having Arenado come in makes sense. Plus, the salary Arizona has to pay is really suppressed. If the young guys develop and Arenado isn't cutting it, they can just bench him. They're not paying him much anyway. So D-backs might have been the optimal team.", japanese: "ファーストは空いてて、ネイラートレードで取ったロックリアはうまくいってない。サードは若いジョーダン・ローラーに任せちゃう？トッププロスペクトに？その状況だと、アレナドを入れるのは理にかなってる。しかもアリゾナが払う年俸はかなり抑えられてる。若手が育ってアレナドがダメなら、普通にベンチにできる。大した金払ってないし。だからDバックスが最適なチームだったのかもね。" },
            { startTime: 449, english: "For Arenado himself, there's the risk of being benched, and to contend, the Dodgers are just too dominant. So it's a difficult position. D-backs, where do they go from here? They don't have unlimited money either. But as a destination for a veteran, he landed somewhere decent.", japanese: "アレナド本人としては、ベンチになるリスクがあって、優勝争いするにはドジャースが強すぎる。難しい立場だよね。Dバックス、これからどうなるか？無限に金があるわけでもないし。でもベテランの行き先としては、まあまあいいところに収まったんじゃない。" },
            { startTime: 475, english: "So the key question is: how much is St. Louis paying? The Cardinals are covering $31 million of Arenado's remaining $42 million. It gets complicated with deferred payments and stuff.", japanese: "で、肝心の問題は、セントルイスはいくら払うのか？カージナルスはアレナドの残り4200万ドルのうち3100万ドルを負担する。後払いとかでややこしくなるけど。" },
            { startTime: 532, english: "Anyway, the Rockies were already covering about $5 million originally. So the Cardinals really covered a lot. The key point is Arizona only pays $5 million this year and $6 million next year. So for $11 million total over two years, they get a guy who still adds value on defense.", japanese: "とにかく、ロッキーズは元々約500万ドルを負担してた。だからカージナルスは本当にたくさん負担してる。重要なのはアリゾナは今年500万ドル、来年600万ドルしか払わない。だから2年で合計1100万ドルで、守備ではまだ価値のある選手が取れる。" },
            { startTime: 565, english: "His bat might bounce back a little, but you can't expect much. But he played his prime years in the NL West, so there's that familiarity. For Arizona, this is a no-lose trade.", japanese: "打撃は少し復活するかもしれないけど、期待しすぎはダメ。でもナ・リーグ西地区で全盛期を過ごしたから、その馴染みはある。アリゾナにとっては、負けがないトレードだね。" },
            { startTime: 738, english: "The return? Jack Martinez, a right-handed pitcher. He was an 8th-round pick from this year's draft.", japanese: "見返りは？ジャック・マルティネス、右投手。今年のドラフト8巡目指名。" },
            { startTime: 753, english: "Has anyone seen this guy pitch? Probably not. I didn't know his name either. He's from the 2025 draft, 8th round. College guy. His college stats weren't flashy at all.", japanese: "この人の投球見たことある人いる？多分いないでしょ。僕も名前知らなかったし。2025年ドラフト8巡目。大学出身。大学の成績は全然派手じゃない。" },
            { startTime: 769, english: "When you see 'Martinez,' you might think of Justin Martinez the closer, but this is different. Baseball America posted video of him. His delivery is wild—he drifts heavily toward first base. Very unique. Check it out.", japanese: "「マルティネス」って見ると、クローザーのジャスティン・マルティネスを思い浮かべるかもしれないけど、これは違う人。Baseball Americaが動画上げてた。フォームがすごい、一塁方向にめっちゃ流れる。すごくユニーク。チェックしてみて。" },
            { startTime: 884, english: "This one guy is the return for Arenado. The Cardinals don't think he's gonna be something special right now.", japanese: "この一人がアレナドの見返り。カージナルスは今すぐこの選手が何かすごいことになるとは思ってないでしょ。" },
            { startTime: 896, english: "So basically, they gave him away for almost nothing plus $31 million in salary relief. At least they don't have to pay the full $42 million. Arizona covering $11 million was the whole point of this trade.", japanese: "要するに、ほぼタダであげて、さらに3100万ドルの年俸削減。少なくとも4200万ドル全額払わなくて済む。アリゾナが1100万ドル負担してくれたのがこのトレードの全てだよね。" },
            { startTime: 914, english: "It's a dump. You could call it a bad contract, though with only two years left, maybe not that bad.", japanese: "ダンプだよ。不良債権と言えなくもないけど、残り2年だけだから、そこまで悪くはないかも。" },
            { startTime: 926, english: "The intent is clear. And Arenado had a no-trade clause, so he had to approve it. Whether it's because of the NL West connection or Arizona specifically, he said yes. Maybe they could've gotten a better return elsewhere, but Arenado had to agree.", japanese: "意図は明確。で、アレナドはノートレード条項を持ってたから、彼の承認が必要だった。ナ・リーグ西地区で馴染みがあるからか、アリゾナ限定かわからないけど、彼はイエスと言った。他でもっといい見返りが取れたかもしれないけど、アレナドが同意しないといけなかった。" },
            { startTime: 952, english: "The Cardinals probably had to go this far to make it work. It was up to Arenado's mood too.", japanese: "カージナルスはここまでやらないと成立しなかったんだろうね。アレナドの気分次第でもあったし。" },
            { startTime: 965, english: "So why did they give up so much? Because keeping him didn't make sense. He's not a huge asset anymore. He's lost his star power. He's declined.", japanese: "じゃあなんでこんなに譲歩したのか？残しても意味がなかったから。もう大きな戦力じゃない。スター性も失われた。衰えた。" },
            { startTime: 987, english: "If he was a franchise player, drafted and developed there, maybe you keep him even as a bad contract and let him retire with the team. But he came via trade. They inherited his contract extension. The Cardinals aren't contending now. No point keeping Arenado.", japanese: "もし生え抜きのフランチャイズプレイヤーだったら、不良債権でも残してチームで引退させたかもしれない。でもトレードで来た選手。契約延長も引き継いだ。カージナルスは今優勝争いしてない。アレナドを残す意味がない。" },
            { startTime: 1030, english: "Just wanted someone to take some of the money. That's the honest truth.", japanese: "誰かに金を少しでも持っていってほしかった。正直それだけ。" },
            { startTime: 1040, english: "Right, about Westford's position. For the Cardinals, they have Masyn Winn at short. He's only 23, great defender, the anchor. And now they have top prospect Westford.", japanese: "そうだ、ウェストフォードのポジションについて。カージナルスは、ショートにマシン・ウィンがいる。まだ23歳、守備上手い、中心選手。そして今トッププロスペクトのウェストフォードがいる。" },
            { startTime: 1066, english: "Westford is ranked 5th overall. He should be around there in this year's rankings too.", japanese: "ウェストフォードは全体5位にランクされてる。今年のランキングでもその辺にいるはず。" },
            { startTime: 1077, english: "He's been killing it in the minors. He's 23, good age. They can bring him up and give him a spot now.", japanese: "マイナーで無双してる。23歳、いい年齢。今上げてポジション与えられる。" },
            { startTime: 1090, english: "Going forward, Winn and Westford will be the young core for this team.", japanese: "これから先、ウィンとウェストフォードがこのチームの若い核になる。" },
            { startTime: 1102, english: "As for Donovan, they already traded Wilson Contreras, Arenado, and Sonny Gray. All three high-salary guys, all gone. Clean rebuild moves. They did add May for $22 million though.", japanese: "ドノヴァンについては、ウィルソン・コントレラス、アレナド、ソニー・グレイをもうトレードした。3人とも高給取り、全員いなくなった。きれいな再建の動き。ただメイを2200万ドルで追加したけどね。" },
            { startTime: 1128, english: "Contreras still had a lot of value, but they wanted to shed salary. The key now is what to do with Donovan and pitcher Jordan Romero. How do they move those guys? Romero will probably be traded. Donovan's chances seem lower right now.", japanese: "コントレラスはまだかなり価値があったけど、年俸を減らしたかった。今重要なのは、ドノヴァンと投手のジョーダン・ロメロをどうするか。この人たちをどう動かす？ロメロはたぶんトレードされる。ドノヴァンの可能性は今のところ低そう。" },
            { startTime: 1166, english: "Oh, they changed GMs. The new GM is the former Red Sox GM. And unusually, Jeff Passan dropped some rumors. Passan normally only reports done deals, but he's actually spreading rumors now.", japanese: "あ、GM変わったんだよね。新しいGMは元レッドソックスのGM。で、珍しくジェフ・Passanが噂を落としてくれた。Passanは普通確定情報しか報じないのに、今回は噂を流してる。" },
            { startTime: 1198, english: "This is rare. It must mean this has high likelihood of happening.", japanese: "これは珍しい。ほぼ確定に近いってことなんだろうね。" },
            { startTime: 1212, english: "What he's saying is that the San Francisco Giants are aggressively pursuing two players: Nico Hoerner and Brendan Donovan. These two.", japanese: "彼が言ってるのは、サンフランシスコ・ジャイアンツが2人の選手を積極的に追ってるってこと。ニコ・ホーナーとブレンダン・ドノヴァン。この2人。" },
            { startTime: 1231, english: "If this happens, either Hoerner or Donovan would make the Giants' infield one of the best in the league.", japanese: "もしこれが実現したら、ホーナーかドノヴァンのどちらかでジャイアンツの内野陣はリーグ最高レベルになる。" },
            { startTime: 1244, english: "Wait, the Padres were the strongest push for Arenado?", japanese: "え、パドレスがアレナドを一番強く押してたの？" },
            { startTime: 1271, english: "The Padres wanted Arenado? What?", japanese: "パドレスがアレナド欲しかったの？え？" },
            { startTime: 1280, english: "At first base? That makes no sense.", japanese: "ファーストで？意味わからん。" },
            { startTime: 1286, english: "That makes no sense. Why would Rosenthal report this? I don't get it.", japanese: "意味わからんって。なんでRosenthalがこんなこと報じるの？理解できない。" },
            { startTime: 1311, english: "Right, right. Padres, huh. I guess they were willing to take anything. Actually, I think it'd be better to convert Machado to first. That feels like it would be an overall upgrade—Machado at first, Arenado at third.", japanese: "そっかそっか。パドレスか。何でも取りたかったんだろうね。実際、マチャドをファーストにコンバートした方がいいと思うんだけど。その方が全体的にアップグレードな気がする、マチャドがファーストでアレナドがサード。" },
            { startTime: 1330, english: "Oh, so they really have no money. They must be broke. Since it's Rosenthal, I guess it's true. But they're really broke.", japanese: "あ、そんなに金ないんだ。本当に金欠なんだな。Rosenthalだから本当なんだろうけど。でも本当に金がないんだな。" },
            { startTime: 1344, english: "Sigh. Really broke.", japanese: "はぁ。本当に金欠。" },
            { startTime: 1407, english: "So yeah. Arenado. But I just said his bat has fallen off completely, and they want to use him at first base? The position where offense matters most? If this happened, I'd have to tell Preller we need to talk.", japanese: "まあそう。アレナド。でも今言ったように打撃は完全に落ちてて、それをファーストで使いたい？一番打撃が重要なポジションで？もしこれが実現してたら、Prellerに話があるって言わなきゃいけないところだった。" },
            { startTime: 1432, english: "Really. And spending $5 million on that? Their last precious $5 million? Please don't.", japanese: "マジで。しかも500万ドルもかけて？最後の貴重な500万ドルを？やめてくれ。" },
            { startTime: 1449, english: "Maybe the plan was just to grab whoever and fill first base. But they don't absolutely need to fill first. Sheets can play first. There's no need to force Arenado in there. I'll take this with a grain of salt.", japanese: "たぶん計画は誰でもいいからファーストを埋めるってことだったんだろう。でも絶対にファースト埋めなきゃいけないわけじゃない。シーツがファースト守れるし。アレナドを無理やり入れる必要はない。これは話半分に聞いとくよ。" },
            { startTime: 1535, english: "Laureano might still be traded though. He's only $6.5 million so not much of a dump. If they're dumping salary, it has to be Pivetta. He makes around $20 million. Trade Pivetta and replace him with someone cheaper.", japanese: "ラウレアーノはまだトレードされるかもしれないけどね。650万ドルしかないからダンプとしては少ない。年俸ダンプするならPivettaしかない。彼は約2000万ドルもらってる。Pivettaトレードして安い選手と入れ替える。" },
            { startTime: 1626, english: "If Darvish could pitch, everything would be different. That's a difficult point.", japanese: "ダルビッシュが投げられれば、全部違うんだけどね。それが難しいところ。" },
            { startTime: 1654, english: "But adding Arenado, the names look like an all-star lineup. But that's just on paper.", japanese: "でもアレナド加えたら、名前だけ見たらオールスターラインナップだよね。でもそれは紙の上だけ。" },
            { startTime: 1666, english: "Arenado is really just a name now. His defense is still good though, so if you're using him, it has to be at third. First makes no sense. I'd rather have Machado at first.", japanese: "アレナドは本当にもう名前だけ。守備はまだいいけどね、使うならサード一択。ファーストは意味がない。マチャドをファーストにした方がいい。" },
            { startTime: 1684, english: "That's how it is. Stacking big names when everyone's around 30 doesn't mean much.", japanese: "そういうこと。みんな30歳前後で大物の名前並べても意味ない。" },
            { startTime: 1689, english: "By the way, good news. Tomorrow. Do you know what day it is?", japanese: "ところでいいニュース。明日。何の日か知ってる？" },
            { startTime: 1701, english: "Tomorrow is January 15th. Today is January 14th Japan time. In about 24 hours it'll be the 15th. Do you know what that is? Remember this. It's the day the Padres trade candidates increase.", japanese: "明日は1月15日。今日は日本時間で1月14日。約24時間後には15日になる。何の日かわかる？覚えておいて。パドレスのトレード候補が増える日だよ。" },
            { startTime: 1720, english: "Oops, I misspoke. Not Padres trades. It's international free agency. The international FA signing day.", japanese: "あ、言い間違えた。パドレスのトレードじゃない。国際FAだ。国際FA契約解禁日。" },
            { startTime: 1732, english: "The international FA contract ban lifts. Sorry, I slipped up there.", japanese: "国際FA契約禁止が解除される。ごめん、言い間違えた。" },
            { startTime: 1741, english: "This is when Sasaki Roki signed last year. Actually, you can trade international signees right away. Trades are possible.", japanese: "去年佐々木朗希が契約したのがこの時期。実は、国際FA選手はすぐトレードできるんだよね。トレード可能。" },
            { startTime: 2053, english: "Weathers, right. Let's talk about Weathers. This was a good one.", japanese: "ウェザースね。ウェザースについて話しましょう。これはいい話だった。" },
            { startTime: 2066, english: "Choosing a former Padre, good eye. Max Fried. This team's rotation is all former Padres. Max Fried, Ryan Weathers. Former Padres first-rounders.", japanese: "元パドレスを選ぶなんて、目がいいね。マックス・フリード。このチームのローテーションは元パドレスだらけ。マックス・フリード、ライアン・ウェザース。元パドレスの1巡目指名。" },
            { startTime: 2083, english: "Former Padre starters are pretty good. Not just Weathers—Fried too, Gore too. Former Padre first-round starters, I don't know why, but Preller loves high school pitchers.", japanese: "元パドレスの先発はけっこういいんだよね。ウェザースだけじゃなく、フリードも、ゴアも。元パドレスの1巡目先発、なぜかわからないけど、Prellerは高校生投手が大好き。" },
            { startTime: 2105, english: "'How long are you gonna talk about exes?' As long as I want! I'm the type to keep talking about exes until retirement.", japanese: "「いつまで元カノの話するの？」好きなだけするよ！引退するまで元カノの話し続けるタイプなんで。" },
            { startTime: 2327, english: "Acquiring Weathers was a good move for the Yankees. Gerrit Cole and Carlos Rodon, plus Schmidt is out with Tommy John. Cole and Rodon should be back by mid-season. The question was whether the Yankees could hold together until then. They hadn't made real pitching additions.", japanese: "ウェザース獲得はヤンキースにとっていい動きだった。ゲリット・コールとカルロス・ロドン、さらにシュミットはトミー・ジョンで離脱。コールとロドンはシーズン半ばには戻るはず。問題はヤンキースがそれまで持つかどうか。まともな先発補強をしてなかったから。" },
            { startTime: 2366, english: "There was talk about acquiring Cabrera, but that would've cost more. Weathers is cheap considering he barely pitches. Tons of potential though.", japanese: "カブレラ獲得の話もあったけど、それだとコストがもっとかかる。ウェザースはほとんど投げてないから安い。ポテンシャルはめちゃくちゃあるけどね。" },
            { startTime: 2387, english: "In San Diego, his velocity didn't improve much. But his high school stats were insane—77 innings, 0.09 ERA. He was drafted 7th overall. Debuted young, around 20.", japanese: "サンディエゴでは球速がそんなに上がらなかった。でも高校時代の成績はヤバかった、77イニングで防御率0.09。全体7位指名。20歳ぐらいで若くしてデビュー。" },
            { startTime: 2416, english: "Didn't really work in San Diego. Then he was traded for Sean Reynolds—the guy who just signed with Yokohama.", japanese: "サンディエゴではあまりうまくいかなかった。それでショーン・レイノルズとトレードされた、横浜と契約したあの人ね。" },
            { startTime: 2467, english: "That trade was a huge loss for the Padres. Weathers improved after leaving.", japanese: "あのトレードはパドレスにとって大損失だった。ウェザースは移籍後に成長した。" },
            { startTime: 2479, english: "He barely pitches though. But his velocity jumped. From 93-94 mph to upper 90s now, even touching 100. He's become a power arm. But he doesn't strike out tons, so there are questions. Still, his stuff is excellent and keeps improving.", japanese: "ほとんど投げないけどね。でも球速は跳ね上がった。93-94マイルから今は90後半、100マイルに届くこともある。パワーアームになった。でも三振をそんなに取らないから疑問はある。それでも球は素晴らしいし、どんどん良くなってる。" },
            { startTime: 2524, english: "He just gets hurt. But this makes him perfect for the Yankees. He's done a few relief appearances in San Diego and Miami.", japanese: "とにかく怪我する。でもこれがヤンキースにぴったり。サンディエゴとマイアミでリリーフ登板もしてる。" },
            { startTime: 2542, english: "When Cole and Rodon return, Weathers can shift to the bullpen if needed. The flexibility is there. Unlike Cabrera, who can't really move to relief. Weathers can be used multiple ways.", japanese: "コールとロドンが戻ったら、ウェザースは必要ならブルペンに回せる。柔軟性がある。カブレラはリリーフに回すのは難しいけど、ウェザースは複数の使い方ができる。" },
            { startTime: 2567, english: "But don't expect him to stay healthy. A TJ situation would be worst case. Even without that, he'll probably miss time with minor injuries.", japanese: "でも健康でいることは期待しないで。トミー・ジョンが最悪のケース。それがなくても軽い怪我で離脱することは多分あるだろうね。" },
            { startTime: 2592, english: "He's a flexible piece. That's why the prospect cost was reasonable. Four prospects, but honestly, I expected more. Weathers has three years of control left and upside. The Marlins didn't lose, but neither did the Yankees.", japanese: "彼は柔軟なピース。だからプロスペクトのコストが妥当だった。4人のプロスペクト、正直もっとかかると思ってた。ウェザースは3年のコントロールが残ってて、アップサイドもある。マーリンズは損してないし、ヤンキースも損してない。" },
            { startTime: 3422, english: "Tucker probably won't go to any of the three reported finalists. I'm going contrarian—mystery team.", japanese: "タッカーはたぶん報道されてる3チームのファイナリストのどこにも行かない。逆張りで、ミステリーチーム。" },
            { startTime: 3808, english: "$50 million AAV with no deferrals? That outfield would cost over $100 million for two guys. Mets can afford that?", japanese: "後払いなしで年平均5000万ドル？その外野陣は2人で1億ドル以上かかる。メッツはそれ出せるの？" },
            { startTime: 3840, english: "Both power bats. Insane.", japanese: "両方パワーバット。ヤバい。" },
            { startTime: 3879, english: "Oh, LS says the Blue Jays offered Tucker 7 years, $300 million. That's over $40 million AAV. Very realistic. Long-term deals like that are plausible.", japanese: "あ、LSがブルージェイズがタッカーに7年3億ドルオファーしたって言ってる。年平均4000万ドル以上。かなり現実的。そういう長期契約はあり得る。" },
            { startTime: 3935, english: "If 7 years at $300 million is real, he should take that over a short-term $50 million AAV deal.", japanese: "もし7年3億ドルが本当なら、短期の年平均5000万ドルの契約よりそっちを取るべき。" },
            { startTime: 3967, english: "Phillies update? They had good talks with Bichette reportedly.", japanese: "フィリーズのアップデート？ビシェットといい話し合いをしたらしい。" },
            { startTime: 3979, english: "Realmuto re-signing talks might be fading. They seem focused on Bichette now.", japanese: "レアルミュートの再契約交渉は薄れてきてるかも。今はビシェットに集中してるみたい。" },
            { startTime: 4035, english: "If Realmuto leaves, they'll need a catcher via trade or FA. Haas is available but Realmuto's presence in the clubhouse is hard to replace.", japanese: "レアルミュートが出たら、トレードかFAで捕手が必要。ハースは使えるけど、レアルミュートのクラブハウスでの存在感は代えがきかない。" },
            { startTime: 4066, english: "Red Sox are also interested in Bichette and Realmuto.", japanese: "レッドソックスもビシェットとレアルミュートに興味がある。" },
            { startTime: 4083, english: "What if the Red Sox get both? That would be something.", japanese: "もしレッドソックスが両方取ったら？それはすごいことになる。" },
            { startTime: 4102, english: "Red Sox apparently didn't raise their offer for Bregman because they thought his other offers were bluffs. If true, they messed up.", japanese: "レッドソックスはブレグマンへのオファーを上げなかったみたい、他のオファーはブラフだと思ったから。もしそれが本当なら、ミスったね。" },
            { startTime: 4161, english: "LF, thank you for the Super Chat. 'Blue Jays fan here. What's your prediction for Toronto this year? I hope Bichette stays.'", japanese: "LFさん、スパチャありがとうございます。「ブルージェイズファンです。今年のトロントの予想は？ビシェットには残ってほしいです」" },
            { startTime: 4177, english: "They're my pick to win the division. Top contender.", japanese: "地区優勝の予想はブルージェイズ。トップ候補。" },
            { startTime: 4191, english: "Yankees made good moves. Orioles are motivated too. But the Blue Jays' commitment level is different.", japanese: "ヤンキースはいい動きをした。オリオールズもモチベーション高い。でもブルージェイズの本気度は違う。" },
            { startTime: 4204, english: "They'll probably push hard at the deadline too. After this offseason effort, they won't coast. I expect another move in the summer. Their motivation is sky-high. Now or never vibes.", japanese: "デッドラインでも強くプッシュするだろう。このオフの努力の後、流すことはない。夏にもう一手動くと思う。モチベーションは最高潮。今やるしかないって雰囲気。" },
            { startTime: 4230, english: "Blue Jays are my #1 pick. No matter what the Yankees, Red Sox, Orioles, or Rays do, the Jays are most motivated.", japanese: "ブルージェイズが僕の1位予想。ヤンキース、レッドソックス、オリオールズ、レイズが何をしても、ジェイズが一番モチベーション高い。" },
            { startTime: 4251, english: "Long-term, who knows. But this year, Blue Jays are my pick.", japanese: "長期的にはわからない。でも今年はブルージェイズが僕の予想。" },
            { startTime: 5087, english: "Oh, Griffin Jax officially announced for Team USA.", japanese: "あ、グリフィン・ジャックスがTeam USAに正式発表された。" },
            { startTime: 5100, english: "This team is stacked. Holy cow.", japanese: "このチームはやばい。マジで。" },
            { startTime: 5125, english: "If no one withdraws, this is insane.", japanese: "誰も辞退しなければ、これはヤバい。" },
            { startTime: 5200, english: "Want me to do watch-alongs for WBC? Yes, planning to.", japanese: "WBCの同時視聴やってほしい？うん、やる予定。" },
            { startTime: 5225, english: "Netflix has all games. Let's watch together.", japanese: "Netflixで全試合見られる。一緒に見よう。" },
            { startTime: 5250, english: "Exciting. USA vs anyone will be must-watch.", japanese: "興奮する。USAの試合は全部必見。" },
            { startTime: 5275, english: "If they don't win with this roster...", japanese: "このロースターで優勝できなかったら..." },
            { startTime: 5300, english: "No excuse. Has to be the championship.", japanese: "言い訳できない。優勝するしかない。" },
            { startTime: 5375, english: "Harper was clearly the big reveal. Final announcement.", japanese: "ハーパーは明らかに大きな発表だった。最終発表。" },
            { startTime: 5400, english: "Captain Judge and Harper finally on Team USA. Historic.", japanese: "キャプテン・ジャッジとハーパーがついにTeam USAに。歴史的。" },
            { startTime: 5425, english: "Pitching: Skubal and Skenes. Obvious choices.", japanese: "投手陣：スクーバルとスキーンズ。当然の選択。" },
            { startTime: 5450, english: "Withdrawals are the concern. Someone always does.", japanese: "辞退が心配。必ず誰かやるからね。" },
            { startTime: 5475, english: "Especially pitchers. Historically common.", japanese: "特に投手。歴史的によくある。" },
            { startTime: 5500, english: "Please no Skubal or Skenes withdrawals.", japanese: "スクーバルとスキーンズの辞退だけはやめてくれ。" },
            { startTime: 5525, english: "Scary if they withdraw.", japanese: "辞退したら怖い。" },
            { startTime: 5775, english: "50 days until WBC. Month and a half.", japanese: "WBCまで50日。1ヶ月半。" },
            { startTime: 5800, english: "Excited. Watch-alongs for sure.", japanese: "楽しみ。同時視聴絶対やる。" },
            { startTime: 5825, english: "Today's takeaway: Padres tried to get Arenado for first base.", japanese: "今日のまとめ：パドレスがアレナドをファーストで獲ろうとしてた。" },
            { startTime: 5850, english: "Hilarious and sad.", japanese: "笑えるし悲しい。" },
            { startTime: 5875, english: "Long stream today. More news coming probably.", japanese: "今日は長い配信だった。たぶんまだニュースが来る。" },
            { startTime: 5900, english: "Tucker won't sign today. I guarantee.", japanese: "タッカーは今日契約しない。保証する。" },
            { startTime: 5925, english: "Breaking news won't happen tonight. Relax.", japanese: "速報は今夜は来ない。落ち着いて。" },
            { startTime: 5950, english: "Thanks for watching. See you next time. Bye-bye.", japanese: "見てくれてありがとう。また次回。バイバイ。" }
        ]
    },
    {
        id: "2026-al-east-prospects",
        youtubeId: "KCc7a06fnjY",
        title: "2026 AL East Top Prospects - Pre-Season Preview",
        description: "A comprehensive look at the top 7 prospects for each AL East team heading into the 2026 season, referencing Baseball America rankings.",
        date: "2026-01-20",
        segments: [
            { startTime: 0, english: "Hello everyone, this is Rensox. Today's video is about the top prospects to watch heading into the 2026 season.", japanese: "はい、どうも皆さんこんにちは。レンソックスです。本日の企画は、2026年シーズン開幕前に注目のプロスペクトをご紹介したいと思っています。" },
            { startTime: 9, english: "Using Baseball America as our reference, I'll be introducing the top seven prospects for each team.", japanese: "ベースボールアメリカ誌を参考にしながら、各球団のトップセブンを皆さんに紹介していきたいと思っています。" },
            { startTime: 17, english: "If young players break through, a team can completely change. That's the spirit of this introduction. This episode covers the AL East.", japanese: "若手の台頭があれば球団は変わる。そんな気持ちでご紹介していきたいと思います。今回はアリーグ東地区編です。" },
            { startTime: 36, english: "Alright, so the first team is the Toronto Blue Jays. The number one prospect for Toronto is Trevin Page.", japanese: "はい、ということで最初の球団はトロントブルージェイズでございます。トロントブルージェイズの1位有望株はトレビン・ページになっています。" },
            { startTime: 50, english: "However, after June his batting average dropped to .184, falling into a severe slump.", japanese: "しかし6月以降は打率が1割8分4厘ということで極度のスランプに陥ってしまいました。" },
            { startTime: 55, english: "He's expected to become a power-hitting shortstop who can produce extra-base hits.", japanese: "彼は将来的には長打を量産する打てる遊撃手としての期待がされている選手でございます。" },
            { startTime: 61, english: "Defensively, he's shown the ability to stay at shortstop with his strong arm as his weapon.", japanese: "守備でも、強肩を武器にショートに止まれる能力を示しているという評価になっています。" },
            { startTime: 67, english: "His grades are: Hit 45, Power 55, Run 55, Field 55, and Arm 60 being his highest. Future Value is 60.", japanese: "この選手の能力値はヒット45、パワー55、ラン55、フィールド55。そしてアームが60となっていて、将来性は60と評価されている選手です。" },
            { startTime: 78, english: "The third-ranked prospect is Jojo Parker. He's known by the nickname 'Jojo' and saw his stock rise sharply heading into his senior year of high school.", japanese: "第3位の選手はジョジョ・パーカーでございます。通称ジョジョの愛称で呼ばれている選手ですけれども、高校最終学年にかけて評価が急上昇した選手です。" },
            { startTime: 94, english: "His twin brother Jacob Parker is also a promising college player and draft candidate.", japanese: "双子の兄弟であるジェイコブ・パーカーも有望な大学生ということでドラフト候補になっている選手でございます。" },
            { startTime: 100, english: "Among high school prospects of his generation, his balance of hitting and power is considered elite. He'll likely convert to third base eventually.", japanese: "同世代の高校プロスペクトの中でも、打撃とパワーのバランスは最高峰と評価されていて、将来的にはサードへコンバートされる可能性が高いという選手です。" },
            { startTime: 110, english: "His grades: Hit 55, Power 55, Run 50, Field 50, Arm 55. Future Value is 45.", japanese: "この選手の能力値はヒット55、パワー55、ラン50、フィールド50、そしてアーム55。将来性は45と評価されています。" },
            { startTime: 122, english: "Fourth-ranked is Johnny King. He made the biggest leap within the minor league organization in 2025.", japanese: "第4位の選手はジョニー・キングでございます。25年にマイナー組織内で最も飛躍を遂げた新進サウスポーという選手です。" },
            { startTime: 134, english: "In his first pro year of 2025, he recorded 105 strikeouts in 61.2 innings across Rookie League and Single-A.", japanese: "プロ1年目の2025年はルーキーリーグと1A合計で61.2回で105奪三振を奪う脱三振能力を披露しました。" },
            { startTime: 144, english: "His fastball from a low three-quarter release point creates an extremely difficult angle for hitters.", japanese: "低いスリークォーターのリリースポイントから放たれる直球は打者にとって極めて打ちづらい角度を持つという評価になっています。" },
            { startTime: 154, english: "His pitches: Fastball 60, Curveball 60. He has top-tier raw talent in the Blue Jays organization.", japanese: "この選手はファストボールが60、カーブが60。ブルージェイズの組織内で最高級の素質を持っています。" },
            { startTime: 325, english: "His batted ball velocity at just 18 years old is already considered Major League caliber.", japanese: "非常に恵まれた体格から繰り出される打球速度は18歳にして既にメジャー級という評価になっています。" },
            { startTime: 445, english: "Moving to the Yankees. This player was drafted 39th overall in the 2025 draft, defying pre-draft projections, and answered with results.", japanese: "ヤンキースについて。この選手は25年ドラフトにおいて、下馬評を覆して1巡目全体39位で指名を勝ち取り、25年は結果で答えるというシーズンになりました。" },
            { startTime: 457, english: "In Single-A, he hit .353 with a .457 OBP in 18 games. By the end of 2026, he could potentially take the number one prospect spot in the Yankees organization.", japanese: "1Aでは18試合で打率3割5分3厘、出塁率4割5分7厘ということで、おそらく26年シーズン終了時にはヤンキースの組織ナンバーワンプロスペクトの座を奪取する可能性すら秘めた選手です。" },
            { startTime: 475, english: "His grades: Hit 60, Power 55, Run 55, Field 50, Arm 40. Future Value is 60, showing very high expectations.", japanese: "能力値はヒット60、パワー55、ラン55、フィールド50、そしてアームが40。将来性は60ということで、非常に期待値が高い選手です。" },
            { startTime: 625, english: "He reached Double-A. His biggest draws are high baseball IQ, power, and speed combined with physical ability. Truly a Derek Jeter-type model player.", japanese: "2Aまで昇格をすることができました。最大の魅力は高い野球IQとパワー、そしてスピードを兼ね備えた身体能力ということになっています。まさにモデルデレク・ジーターというような選手だと思います。" },
            { startTime: 796, english: "Franklin Arias is currently the number one candidate to succeed Trevor Story as Boston's starting shortstop.", japanese: "現在ボストンのレギュラーショートのトレバー・ストーリーの後継第1候補になっているのはこのフランクリン・アリアスということで間違いないです。" },
            { startTime: 964, english: "This pitcher joined from Washington via trade. He's a 198cm tall left-hander, and his biggest weapon is his pitch coming straight down from overhead.", japanese: "この選手はワシントンからトレードで加入をしました。198cmの大型サウスポーということで、最大の武器は真上から投げ下ろす球です。" },
            { startTime: 1168, english: "He recorded career-best exit velocity and launch angle in the minors, showing about 90 percentile power metrics, demonstrating growth in the power department.", japanese: "マイナーでは自己最高の打球角度、そして打球速度、これはおよそ90%タイルを記録しているということでパワー面での成長を感じさせました。" },
            { startTime: 1180, english: "In 2026, he'll likely make the roster, so the goal is to secure a regular spot. His grades: Hit 50, Power 55, Run 60, Field 55, Arm 50. Future Value is 50.", japanese: "26年はおそらくロースターに入ってくると思いますので、レギュラー定着を目指すという形になると思います。メルトンの能力はヒット50、パワー55、ラン60、フィールド55、アーム50、そして将来性が50。" },
            { startTime: 1256, english: "If his changeup command improves, his dominance will increase even further. His pitch grades: Fastball 60, Slider 60.", japanese: "チェンジアップの精度が向上すればその支配力はさらに高まるということで能力を見てもファストボール60、スライダー60。" },
            { startTime: 1329, english: "His greatest weapon is his command, which ranks among the top in the minors. In 2025, he had only 8 walks in 52 innings.", japanese: "この選手の最大の武器はマイナーでもトップクラスに位置する制球力ということになります。25年は52イニングでわずか8四球でした。" },
            { startTime: 1345, english: "His strike percentage ranked second in all of minor league baseball among pitchers with 50+ innings.", japanese: "ストライク率は50イニング以上投げた投手の中でマイナー全体2位を記録しています。" },
            { startTime: 1412, english: "For Baltimore, Future Value is rated at 65.", japanese: "ボルティモアについて。将来性は65という評価になっています。" },
            { startTime: 1439, english: "Baltimore's second-ranked prospect is Dylan Beavers.", japanese: "ボルティモアの第2位はディラン・ビーバースということになっています。" },
            { startTime: 1485, english: "He posted an ERA of 1.55 with a 32.5% strikeout rate at Double-A, showcasing dominant pitching that made a name for himself.", japanese: "2Aでは防御率1.55、奪三振率32.5%という圧倒的な投球を披露し、その名を知らしめました。" },
            { startTime: 1497, english: "His pitch grades: Fastball 55, Curveball 60, Slider 60, Changeup 40, Sweeper 55, Control 50. Future Value is 55.", japanese: "能力としてはファストボールが55、カーブボールが60、スライダー60、チェンジアップ40、スイーパーが55、コントロールが50。将来性は55という評価になっています。" },
            { startTime: 1565, english: "He beautifully overcame the Double-A barrier. Even after the promotion, his momentum didn't fade.", japanese: "2Aの壁を鮮やかに乗り越えたということになります。2A昇格後も勢いは衰えず。" },
            { startTime: 1572, english: "Throughout 87.1 innings in 2025, he allowed zero home runs, showing incredible consistency. His fastball is graded at 70.", japanese: "25年の87.1イニングを通じて被本塁打は0というですね、驚異的な安定感を誇りました。威力抜群の速球はグレード70です。" },
            { startTime: 1641, english: "Baltimore's international free agent signing from 2024. This player joined from the Dominican Republic for just $150,000.", japanese: "ボルティモア24年の国際フリーエージェントの選手でございます。この選手はドミニカ共和国から15万ドルで入団をしました。" },
            { startTime: 1685, english: "That's it for the AL East. I'd appreciate if you could subscribe. Next up is the AL Central and AL West.", japanese: "というわけでアリーグ東地区はここまでです。チャンネル登録していただけると嬉しいです。続いてアリーグ中地区、アリーグ西地区とどんどんやっていきます。" },
            { startTime: 1691, english: "Please turn on notifications so you don't miss it. See you in the next video. Bye!", japanese: "是非見逃さないように、通知もオンにしていただけると嬉しいです。ということで、また次回の動画でお会いしましょう。バイ。" }
        ]
    },
    {
        id: "yoshi-history-everything",
        youtubeId: "xuhFaebmwJ4",
        title: "Everything About Yoshi - The Complete History",
        description: "A comprehensive look at Yoshi's history, from his creation to his evolution as a beloved Mario character, including his game appearances, design origins, and fun facts.",
        date: "2026-02-03",
        segments: [
            { startTime: 0, english: "With his adorable design, he has captured the hearts of many fans. When playing games with elementary school friends, he's usually chosen.", japanese: "そのアイ苦しいデザインから多くのファンを獲得しており、小学校の友達とゲームをする時は大体使われている。" },
            { startTime: 7, english: "Even those who don't know much about Mario recognize him. His merchandise sales must be insane. But he gets abandoned mid-ride.", japanese: "マリオを詳しく知らない層からも非常に認知度が高い。グッズの売上も絶対やばい。でも乗り捨てられる。" },
            { startTime: 16, english: "That's our mascot of the Mario world, Super Dragon Yoshi. But few people know his true story.", japanese: "それが我らがマリオ海のマスコット的存在スーパードラゴンヨッシーですが、彼の情を知るものはあまりいません。" },
            { startTime: 24, english: "Everyone knows the character, but his true identity remains unknown. Why was Yoshi even created in the first place?", japanese: "みんな知ってるケアなのにその正体は知られていない。そもそもなぜヨッシーは生まれたのか。" },
            { startTime: 30, english: "How did he become this popular? In this video, as a huge Yoshi fan whose first ever favorite character was Yoshi, I'll explain the Super Dragon's true nature clearly.", japanese: "どうやってここまで人気者になったのか。この動画では生まれて初めて押しになったキャラがヨッシーなヨッシー大輔オタが完潔に分かりやすくスーパードラゴンの実態を紹介します。" },
            { startTime: 42, english: "For those who usually abandon him mid-ride, this video might increase your guilt when you do it.", japanese: "普段乗り捨てている人はこの動画を見ることで乗り捨てる時の罪悪感が増強されるかもしれません。" },
            { startTime: 50, english: "Yoshi was born from Shigeru Miyamoto's desire to let Mario ride a horse. The concept existed since the Famicom era.", japanese: "ヨッシーはマリオ馬に乗せたいというマリオシリーズの海の親である宮本シルさんの思いから誕生しており、ファミコン時代の時点で構想がありました。" },
            { startTime: 60, english: "However, due to hardware limitations, it couldn't be realized. Finally, in 1990 with Super Mario World for Super Famicom, Yoshi made his debut.", japanese: "しかしハードの制約からか実現には至らず、1990年に発売したスーパーファミコンスーパーマリオワールドにてようやく登場を果たします。" },
            { startTime: 71, english: "Actually, in Devil World released in 1984 for Famicom, the sound of Yoshi hatching from an egg was already used.", japanese: "実は1984年にファミコンで発売されていたデビルワールドの時点でヨッシーが卵から変えるサウンドが使用されており、" },
            { startTime: 79, english: "The protagonist's egg appearance and abilities, plus Miyamoto being the game designer, led fans to speculate this was Yoshi's origin.", japanese: "主人公の卵の見た目やその能力、そしてゲームデザインを担当されたのが宮本シさんということもファンからはヨッシーの機嫌なのではないかと言われています。" },
            { startTime: 90, english: "Yoshi's design was handled by Hino-san. Together with Takashi Tezuka, one of Super Mario Bros' creators, they developed the current Yoshi.", japanese: "そしてヨッシーのデザインを担当されたのは日野ふさん。スーパーマリオブラザーズ海の親の1人である手塚孝志さんと共に現在のヨッシーを作り上げていきました。" },
            { startTime: 99, english: "Since he lived in Dinosaur Land, they started with a reptilian design. Initially, he looked like a crocodile.", japanese: "恐竜ランドにいるということで八類からスタートし、最初はワニみたいな見た目のオート影だったそうです。" },
            { startTime: 107, english: "Later, Tezuka's cute rough sketch became the deciding factor, giving Yoshi his current adorable appearance.", japanese: "その後手塚さんの書いた可愛いラフスケッチが決め手になり、現在の愛らしい姿になりました。" },
            { startTime: 113, english: "At this time, Tezuka established that Yoshi is a member of the turtle family. This is mentioned in the Super Mario Collection Special Pack booklet.", japanese: "この際に手塚さんはヨッシーは亀族の仲間だと設定したそうで、この話はスーパーマリオコレクションスペシャルパックに付属しているブックレットでも語られています。" },
            { startTime: 122, english: "So Yoshi is a self-proclaimed Super Dragon who's actually part of the turtle family, and that thing on his back is a shell.", japanese: "つまりヨッシーはスーパードラゴンを自称した亀族の仲間であり、背中に捨てているクは甲ーラだったと。" },
            { startTime: 131, english: "Indeed, in the animated movie, his back has a shell-like texture. In Mario Kart Tour, Yoshi is classified as a character carrying a shell.", japanese: "確かにアニメ映画でも背中の部分はコーラっぽい質感となっています。またゲーム内の表現としてはマリオカートツアーでヨッシーはコーラを背負っているキャラに分類されています。" },
            { startTime: 141, english: "The ambiguous settings that allow for various interpretations are one of the charms of Mario characters. By the way, Yoshi's name came from a Nintendo staff member.", japanese: "設定が曖昧で色々想像できるのはマリオキャラのいいところでもあります。ちなみにヨッシーの名前の依頼は任天END堂スタッフの1人からであり、開発中からヨッシーと呼ばれていたそうです。" },
            { startTime: 161, english: "When Yoshi debuted in Super Mario World, he didn't have the flutter jump or egg throwing abilities yet. He was a character who ate enemies and fruits with his tongue.", japanese: "スーパーマリオワールドで初登場を果たしたヨッシーですが、まだこの頃は踏ん張りジャンプや卵を投げうなどのアクションはなく、敵やフルーツをベドで食べるというキャラでした。" },
            { startTime: 173, english: "Depending on the shell color eaten, special actions were possible. Eating fruit gave small bonuses. He could also move while holding something in his mouth.", japanese: "食べた甲ー羅の色によっては特別なアクションが行えたり、フルーツを食べるとちょっといいことがあったり、何かを口に含んだ状態で移動することも可能と" },
            { startTime: 185, english: "His stomp attack was stronger than Mario's, making him a reliable partner. Baby Yoshis also appeared, and raising them created legendary three-colored Yoshis with unique traits.", japanese: "踏み攻撃もマリより強いのでかなり頼れる相棒です。他にも成長途中で小さいちびヨッシーが登場したり、育てうと通常とは違う特徴を持つ伝説の三色ヨッシーに成長したりと初登場にしてかなりの存在感を放っています。" },
            { startTime: 201, english: "However, what Yoshi became most famous for was... the mid-ride abandonment.", japanese: "しかし何よりもヨッシーの大名詞として有名になってしまったのはやはり乗り捨てでしょう。" },
            { startTime: 209, english: "While riding Yoshi, you can dismount by jumping. Using this, you can perform an extra mid-air jump.", japanese: "ヨッシーに乗ってる際にはジャンプで降りることができるのですが、これを利用することで1回鍵の空中ジャンプが可能となっています。" },
            { startTime: 218, english: "By sacrificing Yoshi, you can reach otherwise unreachable places and even save yourself from falling deaths.", japanese: "つまりヨッシーを捨てれば行けないところにも行けるし、落下ミスもなかったことにできると。" },
            { startTime: 225, english: "The impactful phrase 'abandoning the adorable Yoshi' caught attention and is still joked about online.", japanese: "相苦しいヨッシーを捨てるというインパクトのアレーザーが注目を集め、今でもネット上では度々ネタにされています。" },
            { startTime: 234, english: "There are even hidden goals that encourage abandoning Yoshi. The official side has always been okay with it. It was even briefly mentioned in an official interview.", japanese: "なんならノリ捨てを推奨してるような隠しゴールも存在しており、当時から公式側もざでもないという。実は公式インタビューである社長が聞くでもちょっとだけ触れられたことがあります。" },
            { startTime: 247, english: "Thus, Yoshi made his glamorous debut as a convenient creature living in Dinosaur Land who helps Mario as a reliable ally.", japanese: "こうしてヨッシーは恐竜ランドに生息する便利な生き物、そして仲間を助けためにマリに協力する頼れる味方として華やかなデビューを果たすのでした。" },
            { startTime: 259, english: "By the way, at this time he was scared of ghosts and wouldn't enter ghost houses. Cute.", japanese: "ちなみにこの頃はお化けを怖がって屋敷に入ってくれません。可愛い。" },
            { startTime: 265, english: "After appearing in Mario World and becoming instantly popular, Yoshi got his first title game 'Yoshi's Egg' the following year.", japanese: "マリオワールドで登場し、人やく人気者になったヨッシー。1年後には初の看板タイトルヨッシーの卵が発売されます。" },
            { startTime: 274, english: "It was a new puzzle game about trapping enemies between egg shells. It was developed by Game Freak before they released Pokemon.", japanese: "これは卵の殻で敵を挟むという新感覚のパズーゲームで、開発はなんとまだポケモンを発売していない頃のゲームフリークさん。" },
            { startTime: 284, english: "You can slightly feel the original Pokemon vibe in the BGM. Then in 1992, a new puzzle game 'Yoshi's Cookie' came out.", japanese: "BGMからはほのかに初代ポケモン感が漂っています。その後も1992年には新たなパズーゲームヨッシーのクッキー。" },
            { startTime: 294, english: "In 1993, Yoshi's Road Hunting came out using the Super Scope, with a title that had a distinct feel. In 1995, Super Mario World 2: Yoshi's Island was released.", japanese: "1993年にはスーパースコープを使うヨッシーのロードハンティングと鈴木様に名前を感じたタイトルが登場。1995年にはついに初のアクションゲームでの主演作スーパーマリオヨッシーアイランドが発売されます。" },
            { startTime: 308, english: "Though it's a Yoshi title, it's often treated as part of the Super Mario series. Overseas it's also called Super Mario World 2.", japanese: "ヨッシータイトルではありますが名前の通りスーパーマリオシリーズとして扱われることが多く海外ではスーパーマリオワールド2という名前もついています。" },
            { startTime: 319, english: "Yoshi became the protagonist because they felt they had done everything with side-scrolling Mario in Mario World. They believed Yoshi could create new gameplay.", japanese: "ロッシーが主役に抜擢された理由としては当時横スクロールのジャンプアクションとしてはマリオワールドでやり切った感があったからとのこと。ヨッシーなら新しい遊びを作ることができるだろうという思いがあったそうです。" },
            { startTime: 334, english: "From this game, the now-standard flutter jump was born, along with the egg-throwing shooting element.", japanese: "そしてこの作品からは今では定番である踏ん張りジャンプが生まれたり卵を投うというシューティング要素も登場。" },
            { startTime: 343, english: "A new system where you have a grace period even after taking damage was adopted, creating unique gameplay only found here. Fans still love this masterpiece.", japanese: "ダメージを受けても猶予があるという目新しいシステムも採用されここでしか味わえない唯一無のゲーム性が誕生。ファンからは今でも愛されている名作となりました。" },
            { startTime: 357, english: "The designer was Hisashi Nogami, now famous for Splatoon. The book-like visuals drawn with crayons and goofy characters were mostly designed by him.", japanese: "また本作のデザイナーは今では以下研究員などで有名なの神久しさん。今作のクレオンで描かれたような本若化した見た目やアホ系のキャラは大体彼がデザインしたと言われています。" },
            { startTime: 372, english: "Thus Yoshi secured a leading role in action games, and began a new chapter protecting baby Mario with his life.", japanese: "こうしてヨッシーはついにアクションゲームでも主役の座を手にし、そして命をかけて赤ちゃん時代のマリを守る存在として新たな活躍を始めたのでした。" },
            { startTime: 385, english: "By the way, in Mario 64 for N64 in 1996, Yoshi appears as a somewhat rare character you can meet after collecting all Power Stars - meaning 100% completion.", japanese: "ちなみに1996年にNintendo64で発売された初の3Dマリオタイトルマリオ64ではパワースターを全て集める、つまり完全クリアを果たすことで出会える。ちょっとレアなキャラとして登場しています。" },
            { startTime: 402, english: "In the remake Super Mario 64 DS, Yoshi was surprisingly made a protagonist - a title with many connections.", japanese: "リメイク作であるスーパーマリオ64DSではまさかの主人公に抜擢されており、何かと縁のあるタイトルです。" },
            { startTime: 415, english: "Going back in time to 1992, Super Mario Kart was born on Super Famicom - the great racing game that would develop into the Mario Kart series.", japanese: "時は少し遡り。1992年スーパーファミコンではスーパーマリオカートという後にマリオカートシリーズとして発展していく偉大なレースゲームが誕生していました。" },
            { startTime: 429, english: "Here, the foundation of the current Mario family was formed, and of course Yoshi participated.", japanese: "ここで今のマリオファミリーの原点が形成され、もちろんヨッシーも参戦。" },
            { startTime: 436, english: "In Mario Kart 64, he appeared as one of the strongest characters. He was featured in early Mario Party games, Mario Golf 64, Mario Tennis 64 - appearing in every Mario game.", japanese: "その後もマリオカート64では最強キャラの1人として登場していたり、マリオパーティーシリーズにも初期面として採用され、マリオゴルフ64でもマリオテニス64でもありとあらゆるマリオゲームに登場を果たします。" },
            { startTime: 452, english: "Of course, he's an original fighter in Smash Bros too. The title where Yoshi stood out most was Yoshi's Story in 1997.", japanese: "もちろんスマブラでも最初からいるファイターです。何よりもヨッシーが目立った作品は1997年に発売されたヨッシーストーリー。" },
            { startTime: 464, english: "Finally, an action game with only Yoshi and no Mario at all was released.", japanese: "ついに全くマリオが登場しないヨッシーだけのアクションゲームが登場しました。" },
            { startTime: 471, english: "In this game, eating 30 fruits clears the course - a uniquely Yoshi system. And the familiar 'Yoshi!' voice debuted here.", japanese: "今作ではフルーツを30個食べればコースクリアとなるヨッシーらしい独自のシステムを採用。そしてヨッシーのヨッシーというおな染みのボイスは本作から登場しています。" },
            { startTime: 485, english: "The voice was provided by Nintendo composer Kazumi Totaka. He's created many famous Nintendo game music and is also known as the in-game character Totakeke in Animal Crossing.", japanese: "声を当てたのは任天堂の作曲家とか和さん。様々な任天堂ゲームの名曲を手掛けており、動物の森シリーズに登場するとけとしても有名な方です。" },
            { startTime: 501, english: "Yoshi-starring titles continued to release regularly: Yoshi's Universal Gravitation, Catch! Touch! Yoshi, Yoshi's Island DS, Yoshi's New Island with Mega Eggs and new gameplay.", japanese: "その後もヨッシーが主演のタイトルは定期的に発売されており、本体を傾けることでギミックを動かすヨッシーの万留引力。DSの2画面とタッチパネルを生かしたキャッチタッチ。ヨッシー。複数のベビを切り替えて進むヨッシーアイランドDS。メガ卵など新しい遊びがいっぱいなヨッシーニューアイランド。" },
            { startTime: 530, english: "The super masterpiece Yoshi's Woolly World set in a yarn world. Yoshi's Crafted World exploring the depths of a craft world.", japanese: "ケイトの世界を冒険する超名作ヨッシーウールワールド。工作の世界を奥深く進むヨッシークラフトワールドが登場しています。" },
            { startTime: 539, english: "In spring 2026, a new game 'Yoshi and the Mysterious Encyclopedia' is scheduled, so Yoshi's game appearances continue even 35 years after his debut.", japanese: "6年春には最新作ヨッシーと不し議の図鑑の発売も予定されていますのでゲームでのヨッシーの活躍は登場から35年経った今でもずっと続いています。" },
            { startTime: 554, english: "Yoshi will continue to shine as a protagonist separate from Mario, and as a face of the Mario family. Of course, he's still active in Super Mario mainline games too.", japanese: "これからもヨッシーはマリオとは別の主役として輝き続け、そしてマリオファミリーの顔として登場していくことでしょう。もちろんスーパーマリオ本編でもまだまだ活躍しています。" },
            { startTime: 572, english: "Now let me introduce some different versions of Yoshi. First is Boshi from Super Mario RPG - a somewhat menacing-looking Yoshi.", japanese: "ここからはちょっと変わった別のヨッシえについても紹介します。まずはスーパーマリオRPGに登場するちょっと悪そうな見た目のワッシー。" },
            { startTime: 584, english: "He's good at racing, only cares about himself, and steals fun from other Yoshis - a rare villain version of Yoshi.", japanese: "レースを吸うのが得意でタマしか興味がなく他のヨッシーたちの楽しみを奪っているというかなり珍しい悪役版ヨッシーです。" },
            { startTime: 595, english: "Though he's a villain, his racing skills are real and he hasn't done anything too bad - he's more of a 'slightly bad' character.", japanese: "まあ悪役と言ってもレースの実力は本物で言うほど悪いこともしていないのでちょい悪よしぐらいのキャラとなっています。" },
            { startTime: 607, english: "A similar-looking character appears in Mario Kart World on Switch 2. With the remake also released, he might still be relevant.", japanese: "実はスイッチ2マリオカートワールドではとても似た姿が登場しているとかリメイク版も発売されていますので、まだまだ現役かもしれません。" },
            { startTime: 618, english: "Next is Baby Yoshi from Paper Mario RPG - the only Yoshi to become Mario's companion in the RPG series, fighting in true Yoshi fashion.", japanese: "お次はペーパーマリオRPGに登場したジビヨッシー。RPG系列では唯一マリオの仲間になるヨッシーで実にヨッシーらしい戦い方を数多く行ってくれます。" },
            { startTime: 632, english: "His color changes based on how long it takes to hatch, and you can name him - your very own Yoshi who helps you.", japanese: "誕生するまでの時間によって色が変わる仕様になっていたり、名前をつけることもできるので自分だけのヨッシーとして活躍してくるうという。" },
            { startTime: 644, english: "You can ride him too, making him invaluable in RPGs. This one's also been remade, so you can meet him on Switch.", japanese: "もちろん乗ることも可能なのでRPGでは非常に重宝するキャラですね。もリメイクされてますのでスイッチで出会うことができます。" },
            { startTime: 654, english: "Next is Yoob from Mario & Luigi RPG 2. The game is set in a past Mushroom Kingdom taken over by aliens - quite dark for a Mario game.", japanese: "次にマリオ&ルイージRPG2に登場したゲッシー。今作は過去のキノ王広告が宇宙人たちに占領されてしまうというマリオらしカの悲惨さとダークさを持ち合わせた作品なのですが、" },
            { startTime: 669, english: "This Yoob, due to its massive size, rampages through Yoshi's Village like a monster, eating many Yoshis - a terrifyingly scary existence.", japanese: "このゲッシーはその体の大きさから怪獣のようにヨッシーの村を荒らし、多くのヨッシーを捕食して回るというとんでもなく恐ろしい存在となっています。" },
            { startTime: 683, english: "But what's even more frightening is what happens next. The internal bio-plant was continuously converting Yoshis into more Yoobs.", japanese: "しかし何よりも恐ろしいのはその後のこと。なんと体内の生体プラントでヨッシーをゲッシーに変換し続けていたという。" },
            { startTime: 695, english: "If Mario hadn't stopped it, Yoshis might have gone extinct and only Yoobs would remain. Suddenly Boshi seems cute.", japanese: "マリオたちが食い止めていなければ今頃ヨッシーは絶滅しだらけになっていたかもしれません。ワッシーが可愛く見えてきますね。" },
            { startTime: 706, english: "Here's another rare Yoshi who actually became Mario's enemy, from Paper Mario: Color Splash on Wii U.", japanese: "そして別個体かと言うと微妙なラインなのですがマリオと敵退することになった珍しいヨッシーも紹介します。彼らが登場するのはWiiUで発売されたペーパーマリオカラースラッシュ。" },
            { startTime: 721, english: "In the late-game Million Circus, fake Yoshis appear who try to eat Mario since they don't know him.", japanese: "今作の終盤に登場するミリサーカスでは偽物として買われたヨッシーが登場するのですが、マリノのことを知らないのか普通に食べようとしてきます。" },
            { startTime: 733, english: "They appear in battle scenes too - if you fail to guard, they'll eat your attack cards. A troublesome but cute wild Yoshi.", japanese: "バトルシーンにも登場しており、ガードに失敗してしまうと攻撃に必要なカードを食べられてしまうという厄介な要素ではありますが、野生的なヨッシーも可愛いですね。" },
            { startTime: 747, english: "There's also the super realistic Yoshi from the live-action movie 'Super Mario Bros.' And the Japanese-speaking Yoshi from Mario & Yoshi's Adventure Land.", japanese: "他にも実写映画魔界帝国の女神に登場しためちゃくちゃリアルなヨッシーや。マリオとヨッシーの剣ランドに登場した日本語を喋りまくるヨッシー。" },
            { startTime: 759, english: "There's even a Yoshi who poops in Yukio Sawada's Super Mario-kun manga. Yoshi appears in various forms outside of games too.", japanese: "沢田幸夫先生のスーパーマリオ君に登場するうんこをするヨッシーなどゲーム以外でもヨッシーは色々な形で活躍しています。" },
            { startTime: 771, english: "In April 2026, Yoshi finally appears in an animated movie too. Yoshi's fascinating history will continue.", japanese: "2026年4月にはついにアニメ映画にも登場。ヨッシーの開心撃はこれからも続いていくことでしょう。" },
            { startTime: 786, english: "Finally, let me explain why Yoshi's sound is called 'Getty' - though it's not really related to official settings.", japanese: "最後に公式設定などとは少し関係のない話ですが、ヨッシーのこのサウンドがゲッティと呼ばれてることについても解説しておきます。" },
            { startTime: 796, english: "This sound plays when Yoshi hatches and when you mount him in Super Mario World. It was used frequently until Yoshi's Story when Yoshi started talking.", japanese: "このサウンドはスーパーマリオワールドでヨッシーが生まれた時とヨッシーに登場した際に再生されるサウンドでヨッシーストーリーでヨッシーと喋るまでよく使われており、" },
            { startTime: 809, english: "In Mario Kart 64, these sounds were used a lot too. In Super Mario Sunshine 2, this sound only plays when Mario mounts Yoshi to fight enemies.", japanese: "マリオカート64などではこうしたものが多くされています。一方でスーパーマリオシー2ではマリオがヨッシーに登場する敵だけ、ちゃんとこのサウンドがなるという息ながあったり、" },
            { startTime: 822, english: "In New Super Mario Bros. Wii and New Super Mario Bros. U, this sound plays when mounting Yoshi. This sound may continue to be associated with Yoshi forever.", japanese: "ニュースーパーマリオブラザーズVやニュースーパーマリオブラザーズUでもヨッシーに乗る時にはちゃんとこのサウンドが再生されています。今後もヨッシーといえばこの音と言われ続けるかもしれませんね。" },
            { startTime: 839, english: "In this video, I introduced various things about Yoshi, a character everyone knows. How was it?", japanese: "今回はみんなが知っている周りのキャラヨッシーについて色々と紹介してみたのですが、いかがだったでしょうか?" },
            { startTime: 848, english: "I actually wanted to cover more, like the melting Yoshi in Sunshine or the cute dialogue in Yoshi games, but there was too much information so I just covered the highlights.", japanese: "本当はサンシャインの解けるヨッシーとかイタス系の可愛いセリフが多いヨッシーとかもっと色々と細かく紹介したいところではあるのですが情報量が多すぎてもあれなので面白いところだけまとめました。" },
            { startTime: 862, english: "I'm planning videos on other characters too, so feel free to comment if there's a character you want me to cover.", japanese: "他のキャラの動画も作ろうと思ってますので何かこのキャラは紹介して欲しいなどありましたら遠慮なくコメント欄で教えてください。" },
            { startTime: 872, english: "By the way, I deliberately avoided the topic of whether Yoshi is male or female. The conclusion: Yoshi has no gender.", japanese: "ちなみに今回あえて避けていた話題としてはヨッシーはオスなのかそれともメスなのか問題です。結論ヨッシーには性別がありません。" },
            { startTime: 884, english: "Some games have gender-suggesting scenes, but it seems to be handled flexibly. Since Yoshi is cute, it doesn't matter if male or female.", japanese: "性別を匂わせるような描写が存在するゲームもあるのですがそこら辺は柔軟に扱われているのかなと思います。まあ可愛いのでオスでもメスでもどっちでもいいでしょう。" },
            { startTime: 897, english: "That's all for now. Thank you for watching. Let's all continue to support Yoshi together!", japanese: "それではこの辺でご視聴ありがとうございました。これからもみんなでヨッシーを応援しましょう。" }
        ]
    },
    {
        id: "felix-203-arraez-wbc-insurance",
        youtubeId: "zuJ_b-iO2kU",
        title: "Luis Arraez Signs with Giants & WBC Insurance Crisis",
        description: "Felix discusses Luis Arraez signing with the San Francisco Giants, the WBC insurance crisis affecting Puerto Rico's roster, Ohtani's pitching status, and more MLB offseason news.",
        date: "2026-02-03",
        segments: [
            { startTime: 22, english: "What's up everyone. I shifted the time a bit today.", japanese: "ワッツアップ。今日はちょっと時間をずらしました。" },
            { startTime: 29, english: "Starting 30 minutes later than usual, but since it's February now, thanks for your support. Speaking of February, baseball starts. It's not regular season yet, but baseball begins.", japanese: "いつもより30分遅れてのスタートとなりますが、え、2月になりましたんでね、皆さんどうぞよろしくお願いします。2月といえばね、野球が始まります。公式戦ではないが野球が始まるので、" },
            { startTime: 41, english: "Spring has finally arrived, though it's still too cold to really call it spring. But let's do this with some enthusiasm.", japanese: "え、いよいよね、九到来ということで、まだちょっと春とは言えないぐらいの寒さですけど、ま、黄ってやっていきましょうや。" },
            { startTime: 55, english: "There was some news today. Some disappointing news, or I don't know what to call it, but we'll talk about that too.", japanese: "今日は遺跡もありました。ま、ちょっと残念というかな、何というかよくわかんないニュースとかもありましたけど、ま、そこについてもね、お話できたらと思います。" },
            { startTime: 68, english: "Let me start with Yankees news. I didn't know Keiji was streaming today, so I had already scheduled this. So I delayed it by 30 minutes.", japanese: "ヤンキスラ城から話しごを。そう、今日刑ジピがやるの知らなくて枠立ててたから、あ、ちょっと30分ずらすわつってね。" },
            { startTime: 77, english: "Thank you for the Super Chat from Garner Henason. Likewise. It's quite shocking, honestly. It's really unpleasant.", japanese: "え、ガーナーヘナソンさん、スパチャありがとうございます。また同く。結構ショックなんだよな。結構嫌なんだよな。やっぱり" },
            { startTime: 91, english: "It sucks. The Giants situation is a bit weird too. But honestly, having him as an opponent is just annoying.", japanese: "嫌なんすよ。なんか、ま、ちょっとジャイアンツもちょっと謎いあれなんですけど。いや、でもね、もうはっきり言って敵に回したら普通に嫌なんですよね。" },
            { startTime: 106, english: "We'll play the Giants 13 times, and Arraez rarely gets injured, so there's a real possibility he hits crucial hits against the Padres. That's what worries me.", japanese: "アイスって1番試合をね、13試合やることになるんで、ジャイアンツとで、アライズも滅たに離脱もしないんで、これなんかそのパドレス戦とかでアライアズがめちゃくちゃ大事なヒット打ったりとかする可能性をめっちゃ感じてなん、嫌なんだよね。" },
            { startTime: 124, english: "I really wish he didn't go to a division rival. From an opponent's perspective, isn't this annoying? Players like Arraez who don't strike out are tough to face.", japanese: "やっぱ同地区はやめて欲しかったな。いや、これね、敵視点だと嫌じゃない?普通に普通に嫌じゃない。やっぱり敵視点だとアライズみたいなタイプで三振んもん。" },
            { startTime: 138, english: "The Giants are scary. Well, not scary exactly, but they seem to be lost in a way. They're not making flashy signings, but they're building steadily.", japanese: "だってジャイアンツ怖いな。なん怖いっていうかジャイアンツもまあなんだろう。瞑想してるような雰囲気にも見えるし一方でまあそんなにこうド派手な補強はせずにでも着実にま、そのアライズの補強が" },
            { startTime: 162, english: "Whether Arraez's signing will have that much impact depends on his defense. But a batter like Arraez being in the opposing lineup is just unpleasant.", japanese: "果たしてそれだけのインパクトあるかって言われたらこれは正直守備次第だと思うんですけどいやでもな嫌なんだよなこのア津みたいなバッターがさ相手の正直1番バッターでいてくれるんだったらありがたいけど" },
            { startTime: 192, english: "Alright, let's start. Thank you for coming from Keiji's channel. Feel free to participate.", japanese: "ということで、え、はい、始めていきますか。はい。えっとですね、あ、けジラチャンネルから来てくれてありがとう。全然参加してくれてもいいのよ。" },
            { startTime: 205, english: "Will the Padres play the Skins this year? We'll play them. It's the interleague schedule again, right?", japanese: "今年のパトレスはスキンズを対戦するか?いや、対戦やる。あれでしょ?神回避でしょ、今年も。" },
            { startTime: 216, english: "So Arraez signed. I was wondering when it would happen. Just before the Arraez signing, Mark Feinsand tweeted about it.", japanese: "はい。え、ちょっとアライズがね、決まったんですよ。ま、いつ決まるかななんて言ってたんですけどもとね、名前忘れた誰だ、誰?えっと、あ、名前忘れた。" },
            { startTime: 239, english: "Arraez was receiving both 1-year and multi-year contract offers from multiple teams. But his top priority was playing second base.", japanese: "え、アライズは、ま、今1年契約と複数年契約のオファー両方とも、ま、複数の球団から受けていると。だからオファーはあると。で、ナライズがただ最優先事項としてるのはセカンド" },
            { startTime: 267, english: "He could probably get a better contract elsewhere, but he wants to play second base. He's still young age-wise, so he wants to be a second baseman.", japanese: "固定、ま、固定っていうかセカンドを守ることということで、ま、そこおそらくもっといい契約があるんだけどもセカンドをやりたいんだと。ま、あらゆズも年齢的にまだそんなあれですからね。若い、まだ若い方ですからセカンドやりたいという話で、" },
            { startTime: 284, english: "With the Padres, he played a bit of second base, but mostly first base. His contract is 1 year, $12 million.", japanese: "で、パドレスではセカンドも、ま、ちょろっとやってましたけどね。そんなにほとんどやってないんですけど、基本はファーストで、え、1年1200万ドルということで" },
            { startTime: 307, english: "He had multi-year offers but chose the 1-year, $12 million deal. His last contract with the Padres was around $15.45 million, so this is actually a pay cut.", japanese: "数年契約のオファーがあったんですが、1年契約1200万ドル選んだということで、まあなんかやっぱこんな感じっていう去年のこのFAIのね、最終年の契約っていうのが1年で、ま、1500、4500万ぐらいだったんですよね。パドレスで。だから現方という形になる" },
            { startTime: 332, english: "For Arraez, he wants to show he can play second base. He's 28 now, and wants to hit free agency again as a second baseman in the offseason.", japanese: "ま、アライズにとっては今セカンドもできるというアピールをして、というよりメインポジションセカンドでやって、今28歳ですからで、ライオフにもう1度、えー、セカンドの選手としてフェシに出たいということなんでしょうね。" },
            { startTime: 354, english: "Since the Giants have Cronenworth who can play shortstop, they can put Cronenworth at short and Arraez at second.", japanese: "あ、そうそうそう。ボガツが黒ネオースがショートまでできるから、ま、その黒ネオースショートにしてアライズセカンドっていうのもあるし、" },
            { startTime: 368, english: "Arraez sometimes played second base due to Padres situations, but he was mainly a first baseman. I think his first base defense isn't bad from what I've seen.", japanese: "ま、あのパドレスの事情でセカンド守ってたことあったんだけど基本はねファーストで、ま、僕はですね、アライズのファースト守備そんななんだろう、見て、見てる分には悪くないと思ってるから、" },
            { startTime: 391, english: "People who watch him vs. those who just look at stats probably have very different impressions. His first base defense is solid - he rarely makes errors.", japanese: "ま、これは見てる人と数字だけ見た人では印象が相当違うと思うんですけど、ファースト守備に関してはあらゆって、ま、堅実なタイプですね。ほぼミスしないです。ミスすること滅たない。エラーも1個、1個ぐらいとかかな。" },
            { startTime: 417, english: "His range at first is narrow, but that's not the most important thing at first base. Look at Freddie Freeman - his stats dropped but his reliability to teammates matters.", japanese: "すごく守備範囲とか狭いんだけど、ま、1番ファーストで重要なのはそこじゃないと思ったから、ま、例えばフリーマンとかも、ま、そうじゃないですか、数字は落ちてるけども、その当手とか周りにとっての信頼感みたいなところで" },
            { startTime: 447, english: "But at second base, I think he'll really struggle. Second base defense is seriously tough. The Giants plan to use him at second.", japanese: "ま、一方でセカンドになっちゃうとちょマジでやばいと思うんすよね。セカンドはセカンド守備はマジできついんですよ。で、ま、ジャイアンツはセカンドで使っていくということなので、" },
            { startTime: 473, english: "Originally KC Schmidt was going to be the second baseman. But now offensive-minded Arraez will play second instead of the defensive Schmidt.", japanese: "ま、元々はシュミットってっていう選手がセカンドになってたんです。KCシミットっていうね、あのサンディエゴ出身なんですけど、出身っていうかサンディエゴでなんですけども、ま、サードとかショートとか守備型の選手でね、シュミットが入ってたんですけど、" },
            { startTime: 518, english: "So looking at the Giants' roster: they got Bader and he'll play center, and Arraez joins on a 1-year deal. Bader's signing pushed Lee Jung-hoo to right field.", japanese: "こうジャイアンツのメンツで言うとこんな感じですかね。ま、こな間だ、ベイダー獲得して、ベイダーがセンターに入るということで、ま、そのベイダーは2年契約式アライズも1年契約で入ってきて、ま、新規組で言うとこのベイダーアライズですね。で、それに押し出される形で、" },
            { startTime: 560, english: "Even if Arraez struggles at second base, they have Devers at first and Eldridge at DH, so moving Arraez to first isn't easy.", japanese: "もしあらゆズ、じゃあセカンドやばいな、もうこれダメだなってなったとしても、やっぱファーストにデバースがいて、今だとDHにエルドリッチがいるっていう状況なんで、あの、これあらゆえずやっぱファーストデーとかってなかなかしづらいですよね。" },
            { startTime: 605, english: "Devers probably wouldn't like being a permanent DH either. The Giants were clearly looking for a second baseman.", japanese: "デバースDHコテにするのもちょっと嫌そう。本人嫌そうだから。そうでジャイアンツはセカンド探してたわけですよね。" },
            { startTime: 624, english: "They wanted someone like Donovan or Horner. Horner would've been best maybe, but they ended up with the offensive-minded Arraez instead of a defensive type.", japanese: "だからあのジェフパッさんが、ま、あのジェフパッさんのやつは結局何だったんだっていう話になるんですけど、ま、セカンド探してたのは間違いないぞということで、あの、ま、ドの番だったりとか、ま、ホーナーだったりとか、" },
            { startTime: 675, english: "The Giants' 3rd base side defense is solid. Willy is one of the best defensive shortstops in MLB, and Chapman is an ironclad third baseman.", japanese: "で、ま、チャップマン引き入いるですね、この3塁側の守備っていうのは、まあ、なかなか硬いと思う。ま、ベイリーはね、あの、言でもなくメジャー最後峰の守備力の持ち主で、で、チャップマン鉄壁の3塁種ですよ。" },
            { startTime: 704, english: "But the 1st base side will be a real fire formation with Devers at first and Arraez at second. The infield defense will be tough.", japanese: "ただ1塁側はですね、ま、デバースの1塁守備とアライズのセカンド守備ということで相当ファイヤー、ファイアフォーメーションっていう状況になってますから、あの、まあまあ内野守備きついと思うし、" },
            { startTime: 746, english: "But in terms of name value: Arraez, Devers, Adames, Chapman - they're all star-level players. The outfield might lack name value compared to the infield.", japanese: "ただネバリューとしては確かにね、シュミットがアライズになって、アライズデバース、アダメスチャップて、ま、みんなスターレベルですよね。本当にね。ま、ガイアがちょっとや、ま、内アに比べたらね、ネームvalリュー的にはや見劣りしますけども。" },
            { startTime: 804, english: "Thank you for the Super Chat asking if the Giants can use the DH slot. They have Eldridge, so it's complicated.", japanese: "え、ソメリさん、スパチャありがとうございます。ジャイアンツはDH枠にできないんですか?エルドリッチがいるからね。だからこれ本当はエルドリッてファーストだったわけですよね。" },
            { startTime: 862, english: "Personally, I'm more concerned about the Giants' pitching staff than their offense. Their starters and bullpen need more work.", japanese: "で、ま、当手人の方がなんかジャイアンツ的にこのまま行っていいのかなっていうのが、ま、あの、多球団ファン視点としてね、当手人の方が正直気になるなっていうところですね、個人的には。" },
            { startTime: 908, english: "If the Giants could catch the Dodgers, they'd be the team to do it. But they're in the 2nd year of the Posey regime with a 1st year manager, so this might be a trial period.", japanese: "ま、1番本当はドアスに追いつく可能性があるとしたらやっぱジャイアンツだと思うんだけど、ま、今はまだね、ポージー政権2年目でバイテロ監督1年目ということで、ま、お試し期間に近いのかもしれないですね。" },
            { startTime: 961, english: "Since we mentioned the Padres, there was some news from today's Fan Fest. Preller and the manager and players like Tatis and Merrill were there.", japanese: "で、ま、今パドレスの話が出たんで、あの、ついでにパドレスの今日新しく出てた情報っていうかね、今日ファンフェスあったんです。" },
            { startTime: 1009, english: "GM Preller said they don't think payroll reduction is necessary. They're adding, not subtracting. But they're not ruling out trades if needed.", japanese: "年削減が必要とは考えてないっていう風に言ってて、で、普通に補強します。今は引き算じゃなくて足し算するて一方でそのなんだろうその除外していない可能性を別に除外してるわけじゃないから" },
            { startTime: 1068, english: "They're in talks with Darvish about his future. Darvish has shown interest in staying involved with the Padres organization going forward.", japanese: "でも、ま、ダルビッシュは今後もパドレスっていう組織に関わり続けるっていうことに興味を示しているっていう風にあの言っていて、" },
            { startTime: 1122, english: "Now about the big news: Ohtani will NOT pitch in the WBC. This was announced today at the Fan Fest.", japanese: "で、ま、今パドレスの話が出たんで、あの、太田に投げないという話ですね。太田に投げない。" },
            { startTime: 1150, english: "Ohtani himself said he's still consulting with his body and hasn't decided. But right after, manager Roberts said Ohtani has decided not to pitch.", japanese: "ま、本人は今日のファンフェスで、ま、そのなんだ、体と相談してまだ決まってない、分からないみたいなことを大谷本人は言ったんだけど、その割と直後にロバーツ監督がいや、大谷も本人の判断でもうピッチャーやらないんだみたいなことを明らかにして、" },
            { startTime: 1186, english: "If Ohtani wanted to pitch, insurance probably wouldn't cover him. Even if he wanted to pitch, insurance might say no.", japanese: "で、実際問題なんですけど、これ、ま、次の話に繋がるんですけど、あの、保険降りない可能性が高いと、大谷が投げたいと思ったとしても、" },
            { startTime: 1236, english: "Speaking of insurance, Puerto Rico might withdraw from the WBC. The situation has become quite serious.", japanese: "で、なんつな保険絡みで言うと、ま、今プエルトリコが今すごいもしかしたら撤退するかもっていう話をな、なっていて、" },
            { startTime: 1274, english: "I wrote a note about this today. Yesterday, Lindor was ruled ineligible. Puerto Rico's best player. He's been durable, playing 160 games at shortstop.", japanese: "で、今日僕ノートを出したんで、ま、あの、文字で読みたい方は是非この僕が書いたノート今トップになってると思うんで、こちらをね、読んでいただけたら" },
            { startTime: 1314, english: "The reason: he had a cleaning surgery in the offseason. He thought it would be fine for Spring Training and WBC, but the surgery caused problems.", japanese: "で、なんでこういうことになったかて言ったら、このオフに、え、オ、オフが始まってすぐにクリーニング手術を受けてるんですよね。" },
            { startTime: 1364, english: "8-10 players might not be able to play for Puerto Rico due to insurance. Some like Berrios are still under review.", japanese: "で、さらにどうやら8人から10人ぐらいの選手が、ま、想定していた中から保険のせいで出れないとブレイトリコ代表出れない可能性がある。" },
            { startTime: 1421, english: "In the 2023 WBC, the famous cases were Cabrera and Kershaw. Cabrera was allowed to play but Kershaw wasn't.", japanese: "で、ここからが、えっと、23年のまず話前回大会でやっぱ保険のケースですごくみんなが知ってるのはこのカブレラとカー賞の話ですよね。" },
            { startTime: 1468, english: "Cabrera was allowed because the Tigers agreed to let him play without insurance. But Kershaw couldn't play because the Dodgers wouldn't agree.", japanese: "で、カブレラはタイガースが無で出ていいよってオッケーしたんだよね。だから超レアケースですよね。" },
            { startTime: 1499, english: "The insurance process: the team invites the player, the team approves, and then the insurance company decides if they'll cover the player.", japanese: "で、まあここで今までだったら本人が出たいって言って球団がオッケーしたとしたら、ま、大体のケースは出れたんですよね、これまでの大会は。" },
            { startTime: 1545, english: "The insurance is getting stricter. In the 2023 WBC, Edwin Diaz and Jose Altuve got injured. Diaz was out for the whole season after his celebration injury.", japanese: "で、今回、ま、ちょっとこうなかなか先進37歳以上出場できないっていうなんか新しいルールが追加されてるんですけど、え、ま、ここで、ま、今日出たばっかりの記事とかを読むとですね、え、前回大会で23年の大会でですね、エドウンディアスとホルト2ベが怪我しましたよね。" },
            { startTime: 1624, english: "The insurance company probably paid tens of millions. Just like car insurance, if you use it, the rate goes up.", japanese: "で、この2人に関しておそらく保険会社数千万ドル払ったと思うんですよね。で、普通に、ま、考えてみたら確かに冷静に考えると、あの、車とか医療保険とかいろんな我々一般人が入るような保険とかでも保険って使ったら値上がりするんですよね。" },
            { startTime: 1701, english: "For the first time, specific insurance conditions were revealed. For hitters, they cover up to 2 years. For pitchers, up to 4 years. 100% salary coverage.", japanese: "あ、NFPの今回の保険、野種に対しては2年間まで最大で保証するらしいんです。で、当手に関しては4年間らしいんですよ、保証対象期間が。で、保証額は何割とかじゃなくて100%保証します。" },
            { startTime: 1770, english: "The conditions for being denied coverage: 60+ days on the IL last season, injury in final 3 games, post-season surgery, multiple career surgeries.", japanese: "この前シーズン、ま、だから今で言うと2025年シーズンですか。え、2025年シーズンにIL入り期間が合計で60日以上ってのはまず1つということは" },
            { startTime: 1831, english: "Now there's an age limit: players 37 and over can't be covered. That's why Miguel Rojas couldn't play for Venezuela.", japanese: "で、さらに驚きなのが今回ついに年齢制限がで、制限ができたんですよ。前回はさ、年齢制限なんてこれまではなかったんです。え、ところが今回から37歳以上の選手は保険適用できないという話になりました。" },
            { startTime: 1901, english: "That's why Ohtani isn't pitching in the WBC. He's had 2 elbow surgeries, which falls under 'multiple career surgeries.'", japanese: "で、大谷はだからWBC登板しないってこれで発表されたんだけども、ロバツ監督役で本人がもし投げたいと思っても多分この4のパターンで、" },
            { startTime: 1970, english: "This system may change for future tournaments. If it continues, maybe only players in their 20s will be eligible eventually.", japanese: "で、これ今後もずっとこのシステムでいくかどうかわかんないです。あくまで今回新設されたのが37歳だったっていうだけ。ま、この流れでズどずっとやっていくとしたらもしかしたら次は35歳になって、" },
            { startTime: 2010, english: "The problem is the insurance company, not the WBC itself. But the timing is terrible - 3 days before the final roster is due.", japanese: "ま、保険会社の問題なのは分かってるけども、でもこの直前になってこれ最終ロースター提出の3日前だとこのタイミングで林ドアはちょっとリストに入れられないなんてそんなのおかしくないかと。" },
            { startTime: 2100, english: "The WBCI needs to create a fund so they don't rely solely on insurance companies. They need a structural reform.", japanese: "僕が今考える朝で言うとWBCIが基金を作って保険会社だけに依存するんじゃなくて保険会社にお願いした上で保険会社がこの選手たちはちょっとうちでは引き受けできないわって言った選手に関しては" },
            { startTime: 2170, english: "Latin American teams are frustrated. They're saying this problem isn't happening to the US and Japan teams - only Latin American teams.", japanese: "ま、色々は今こうロハスとかも言ってるし、もう今中南米ではめっちゃ言われてるのがいやアメリカ代表、日本代表にこ同じ問題起こってないじゃんと。中米のチームだけがこういう問題が起こってるじゃんって" },
            { startTime: 2224, english: "The WBC has made progress - players now want to play. But the system can't keep up with the inflation of baseball salaries.", japanese: "ま、少なくとも最初の頃のみんな本当になんかわかんないけど出てるみたいな状況に比べたらやっぱりね、あの、成長はしてるんだろうなと思う。ただその成長するにつれて、ま、あるいはこの野球会のお金の部分のインフレとかに関して、" },
            { startTime: 2290, english: "Let's check Yoshida. Did he spend 60 days on the IL? Yeah, looks like it. So Yoshida probably can't play either.", japanese: "入ってたか?えっとね、これで見れるんだよ。入ってるな。入ってるわ。ダめだね。うん。じゃ、やっぱ今吉田が発表されてないのは多分本人も出る気満々だったと思うし、" },
            { startTime: 2371, english: "So no more MLB players will probably be added to Japan's roster. Yoshida was expected but now that's changed.", japanese: "多分メジャー組もうこれ以上追加で出ないんじゃないかな。吉田かなって思ってたけど話変わってきたんじゃないかなと思いますね。" },
            { startTime: 2460, english: "The subscription services topic came up. I subscribe to a lot - Netflix, U-NEXT, Hulu, Amazon Prime... I'm totally a marketing target.", japanese: "なんかサブスクの話し出したら僕はだからめっちゃ入ってるからユネクストとフールーとNetflixとアマプラと色々入ってるからね。" },
            { startTime: 2520, english: "Netflix does a good job with baseball content. They're making a Murakami documentary. They know what they're doing.", japanese: "でもね、ま、僕割とAppleユーザーでもあるから、もうなんか、ま、見るかつもって見るわけ。そしたらそしたらなんか色々やっぱ見れるもんあるから。" },
            { startTime: 2594, english: "For Padres merchandise, I recommend checking MLBshop.jp. They have sales sometimes.", japanese: "え、MLBの公式オンラインショップの2本版ですね。ここを検索したら大体解決します。ま、今回のWBC関連のアイテムもここにあるし、" },
            { startTime: 2686, english: "I talked for 1 hour about random stuff. Today was 30% baseball and 70% off-topic chat. Thanks for watching.", japanese: "ということで、もう終わろうかなとか言いながら1時間しょうもない話を雑談とかしながら、ま、また今度雑談配信はやりたいな。" },
            { startTime: 2723, english: "It's Monday tomorrow so everyone should sleep. Good night everyone. Bye bye.", japanese: "みんなも明日月曜日なんで。いや、朝まで朝までやりたいぐらいだけどちょっと今日眠い。また違う話題の時に喋りましょう。" },
            { startTime: 2732, english: "Thanks everyone for watching. See you in the next stream. Good night. Bye bye.", japanese: "はい、じゃあ皆さんお疲れ様でした。ご視聴いただきありがとうございます。また次回の配信でお会いいたしましょう。じゃあおやすみなさい。バイバイ。" }
        ]
    }
];
