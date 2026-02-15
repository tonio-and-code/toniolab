// Seed Day 036 (words 1750-1799) -- Feb 5
// Day 036: 高校初日（15歳、男）
// Mixed perspectives: 15歳男子本人, 母(42), 父(45), 姉(18), 友達(15), 先生, 祖父

const DAY36_DATA = [
    {
        id: '3c50UX6Z', // bicentennial
        sentence: "So we're in history class on the first day and the teacher's going on about some bicentennial celebration and I'm like... great, how do I break the ice with anyone here when we're talking about stuff from 200 years ago?",
        idiom: "break the ice",
        idiom_meaning: "start a conversation with strangers / 初対面で打ち解ける"
    },
    {
        id: '3c7fYTNz', // phenom
        sentence: "Dude this kid Marcus in our class is like a total phenom at basketball. First day and he's already hitting the ground running, made the varsity team before lunch. Insane.",
        idiom: "hit the ground running",
        idiom_meaning: "start doing something successfully right away / 最初から全力で取り組む"
    },
    {
        id: '3cDf4_kl', // glare
        sentence: "The glare from the hallway lights was killing me and I'm standing there on the fence about whether to ask someone where room 204 is or just wander around like an idiot.",
        idiom: "on the fence",
        idiom_meaning: "undecided / 迷っている"
    },
    {
        id: '3cEkhAUx', // Great Scott
        sentence: "Great Scott, my grandson's starting high school already? I mean, the elephant in the room is I'm getting old, but we don't need to talk about that. Just let me be proud.",
        idiom: "the elephant in the room",
        idiom_meaning: "obvious problem nobody mentions / 誰も触れない明らかな問題"
    },
    {
        id: '3CEme7z5', // newfangled
        sentence: "They've got all these newfangled apps for tracking homework now and my son keeps telling me the password's 'ilovemom' -- he's totally pulling my leg but I fell for it twice.",
        idiom: "pull someone's leg",
        idiom_meaning: "joke with someone / からかう"
    },
    {
        id: '3cEoJhOm', // manual labor
        sentence: "The PE teacher was like 'welcome to manual labor 101' on the first day and I'm already feeling under the weather. Like sir, I haven't exercised since June, chill.",
        idiom: "under the weather",
        idiom_meaning: "feeling sick / 体調が悪い"
    },
    {
        id: '3CkkNltn', // ring up
        sentence: "My brother asked me to ring up Mom for a ride 'cause he missed the bus on his first day. This kid once in a blue moon actually admits he needs help so I was like wow, OK.",
        idiom: "once in a blue moon",
        idiom_meaning: "very rarely / めったにない"
    },
    {
        id: '3cUvvmNj', // lithograph
        sentence: "Art class had these old lithograph prints on the wall and honestly me and the teacher don't see eye to eye on what counts as 'beautiful art' but whatever, easy A hopefully.",
        idiom: "see eye to eye",
        idiom_meaning: "agree with someone / 意見が合う"
    },
    {
        id: '3cxs9OVg', // Free Will Theorem
        sentence: "So Priya was telling me the Free Will Theorem basically says particles make choices? And I'm like girl the textbook that explains this probably costs an arm and a leg, no thanks.",
        idiom: "cost an arm and a leg",
        idiom_meaning: "be extremely expensive / めちゃくちゃ高い"
    },
    {
        id: '3dMQdfnZ', // composure
        sentence: "I tried to keep my composure when I walked into the wrong classroom but honestly I almost threw in the towel and just went home. Everyone stared at me. Nightmare.",
        idiom: "throw in the towel",
        idiom_meaning: "give up / 諦める"
    },
    {
        id: '3dUiPhON', // still going strong
        sentence: "My son's nerves were still going strong by dinner. He totally got cold feet about going back tomorrow. I told him day two's always easier. No idea if that's true.",
        idiom: "get cold feet",
        idiom_meaning: "become too nervous to do something / 怖じけづく"
    },
    {
        id: '3dzkyCNA', // burning the candle at both ends
        sentence: "He's already burning the candle at both ends trying to impress everyone on day one. Stayed up organizing his backpack till midnight. I'm like honey you're barking up the wrong tree -- nobody cares about your pencil case.",
        idiom: "barking up the wrong tree",
        idiom_meaning: "wasting effort on the wrong thing / 見当違いなことをする"
    },
    {
        id: '3E1Jt69h', // dated
        sentence: "The school building is so dated it looks like something from a movie. Teacher said they're renovating next year so just sit tight. Yeah cool, love ceiling tiles from 1985.",
        idiom: "sit tight",
        idiom_meaning: "wait patiently / じっと待つ"
    },
    {
        id: '3e40wuim', // the lowest rung on the ladder
        sentence: "Told my little bro he's on the lowest rung on the ladder as a freshman and he looked like he was gonna lose his marbles. I was kidding but also... not really.",
        idiom: "lose one's marbles",
        idiom_meaning: "go crazy / おかしくなる"
    },
    {
        id: '3e4tbGg5', // Customs and Excise
        sentence: "I explained that Customs and Excise controls what enters the country and then I'm like 'the ball is in your court -- anyone wanna guess what gets taxed?' Dead silence. Classic first day.",
        idiom: "the ball is in your court",
        idiom_meaning: "it's your turn to act / あなたの番だよ"
    },
    {
        id: '3E7Ml6Ri', // corner office
        sentence: "The principal's got this corner office with windows everywhere and he's like 'welcome to high school, don't start on thin ice.' Real warm fuzzy vibes there sir.",
        idiom: "on thin ice",
        idiom_meaning: "in a risky situation / 危ない立場"
    },
    {
        id: '3EJteg9R', // quotation
        sentence: "Mia got a quotation for her prom dress already -- we're FRESHMEN -- and people started throwing shade at her for it. I'm like let the girl plan ahead, dang.",
        idiom: "throw shade",
        idiom_meaning: "publicly criticize / 陰口を叩く"
    },
    {
        id: '3EKZ7-_o', // handsomely
        sentence: "The teacher said we'd be 'rewarded handsomely' for hard work. Bro read the room -- nobody's trying that hard on day one. We're just trying to survive.",
        idiom: "read the room",
        idiom_meaning: "sense the atmosphere / 空気を読む"
    },
    {
        id: '3epcq8ZC', // chopped liver
        sentence: "I said hi to Jake in the hallway and he straight-up gave me the cold shoulder. Like am I chopped liver now that you've got your new basketball friends? Cool.",
        idiom: "give the cold shoulder",
        idiom_meaning: "ignore someone / 冷たくあしらう"
    },
    {
        id: '3eQH5N0E', // augment
        sentence: "The school wants us to augment their supplies with stuff from home and I'm like sure, I'll just go buy 50 folders at the drop of a hat. No big deal.",
        idiom: "at the drop of a hat",
        idiom_meaning: "immediately, without hesitation / すぐに・即座に"
    },
    {
        id: '3eSldJ_5', // open up
        sentence: "My kid won't open up about his first day. Just says 'it was fine.' I can't wrap my head around how 'fine' is the only word a 15-year-old knows.",
        idiom: "wrap one's head around",
        idiom_meaning: "understand something / 理解する"
    },
    {
        id: '3eST7NkX', // fricassee
        sentence: "First day in cooking class they're talking about making a fricassee and I can barely boil water. Teacher says I'll get the hang of it. Sure, we'll see about that.",
        idiom: "get the hang of",
        idiom_meaning: "learn how to do something / コツをつかむ"
    },
    {
        id: '3eV27u5H', // inimical
        sentence: "Some of these cliques can be really inimical to new students. But you're off the hook if you just find your people early. That's my advice every year.",
        idiom: "off the hook",
        idiom_meaning: "free from trouble / 責任から逃れる"
    },
    {
        id: '3FbF4yz7', // hambone
        sentence: "The drama teacher was looking for someone to play a hambone character and she already has her hands full with like 30 freshmen who all wanna be the lead.",
        idiom: "have one's hands full",
        idiom_meaning: "be very busy / 手一杯"
    },
    {
        id: '3fbUZ_5r', // tournament bracket
        sentence: "Someone leaked the tournament bracket for the gaming club and now they're in hot water with the club president. It's day ONE and there's already drama.",
        idiom: "in hot water",
        idiom_meaning: "in trouble / トラブっている"
    },
    {
        id: '3fhEHn7q', // pack it in
        sentence: "By sixth period I was ready to pack it in. The teacher asked if 'mitochondria' rings a bell and I'm like... kinda? From a meme? She was not amused.",
        idiom: "ring a bell",
        idiom_meaning: "sound familiar / 聞き覚えがある"
    },
    {
        id: '3fHQZCuT', // levitate
        sentence: "So this magician kid in talent show tryouts looked like he could literally levitate. Stole the whole show on day one. Rest of us are just sitting there like... OK then.",
        idiom: "steal the show",
        idiom_meaning: "get all the attention / 主役を奪う"
    },
    {
        id: '3fiqZoxb', // diminishing returns
        sentence: "I told him studying 6 hours straight gives diminishing returns but he's panicking about keeping up. I'm like let's cross that bridge when we come to it, it's literally day one.",
        idiom: "cross that bridge when we come to it",
        idiom_meaning: "deal with it later / その時になったら考える"
    },
    {
        id: '3fOf4Gfm', // mulligan
        sentence: "I wish I could get a mulligan on that whole lunch situation. Sat at the wrong table. My sister hit the nail on the head -- 'you just gotta own it and move on.'",
        idiom: "hit the nail on the head",
        idiom_meaning: "say exactly the right thing / 的を射る"
    },
    {
        id: '3FUhEa1A', // space ranger
        sentence: "My brother's wandering around like a total space ranger after his first day, completely zoned. Bet you he'll pull an all-nighter tonight stressing about tomorrow.",
        idiom: "pull an all-nighter",
        idiom_meaning: "stay up all night / 徹夜する"
    },
    {
        id: '3Gb-Lq9E', // pulsate
        sentence: "My heart was literally pulsating so hard walking through those doors. But I took the plunge and just walked in like I owned the place. Fake confidence, you know?",
        idiom: "take the plunge",
        idiom_meaning: "finally do something scary / 思い切ってやる"
    },
    {
        id: '3gHAogns', // abound
        sentence: "Opportunities abound here at this school, but we all need to be on the same page about expectations. That's what I tell every freshman class on day one.",
        idiom: "on the same page",
        idiom_meaning: "in agreement / 同じ認識でいる"
    },
    {
        id: '3GHL7oOG', // breaking news
        sentence: "Got home and Mom's like 'TELL ME EVERYTHING' like it's breaking news or something. She'll talk my ear off about her first day of high school if I let her.",
        idiom: "talk someone's ear off",
        idiom_meaning: "talk way too much / 延々としゃべる"
    },
    {
        id: '3gOHHs4q', // win an account
        sentence: "I won a huge account at work today but all dinner conversation was about my son's first day. He really stepped up to the plate though -- joined two clubs already.",
        idiom: "step up to the plate",
        idiom_meaning: "take on responsibility / 責任を引き受ける"
    },
    {
        id: '3gpdFIAE', // lace your fingers
        sentence: "I was so nervous I just sat there lacing my fingers together like some weirdo. My friend's like 'dude you're making a mountain out of a molehill, it's just school.'",
        idiom: "make a mountain out of a molehill",
        idiom_meaning: "overreact to something small / 大げさにする"
    },
    {
        id: '3gPmvrfG', // pursuant to
        sentence: "Pursuant to school policy, all freshmen must attend orientation -- the whole nine yards. Uniforms, schedules, locker assignments. I give this speech every single year.",
        idiom: "the whole nine yards",
        idiom_meaning: "everything / 全部・何から何まで"
    },
    {
        id: '3gPQ0x5S', // no use
        sentence: "It's no use trying to explain I was late 'cause of the bus. My friend literally threw me under the bus and told the teacher I was in the bathroom playing games.",
        idiom: "throw someone under the bus",
        idiom_meaning: "betray someone / 裏切る・仲間を売る"
    },
    {
        id: '3GPqfy55', // moonlight flit
        sentence: "Lily said the kid who transferred feels like he did a moonlight flit from his old school. I wouldn't wanna be in his shoes -- starting fresh mid-year is rough.",
        idiom: "in someone's shoes",
        idiom_meaning: "in someone's situation / 誰かの立場で"
    },
    {
        id: '3gubLxpy', // all told
        sentence: "All told, the first day wasn't as bad as I thought. Seven classes, one wrong room, zero friends made. I'm calling it a day. Gonna pass out.",
        idiom: "call it a day",
        idiom_meaning: "stop working for today / 今日はここまで"
    },
    {
        id: '3H1d9M8r', // leg day
        sentence: "PE was basically leg day from hell. Now everyone's jumping on the bandwagon saying they wanna join track? Bro, you were all dying five minutes ago.",
        idiom: "jump on the bandwagon",
        idiom_meaning: "follow a trend / 流行に乗る"
    },
    {
        id: '3hC7d31P', // It's not every day that
        sentence: "OK so it's not every day that a senior actually talks to a freshman, right? Mia's over here spilling the tea about how this senior dude asked her where the gym was.",
        idiom: "spill the tea",
        idiom_meaning: "share gossip / ゴシップを話す"
    },
    {
        id: '3hkOhzcu', // preamble
        sentence: "The teacher sent this long preamble email about class expectations and I swear she's keeping tabs on every kid already. That woman does not play around.",
        idiom: "keep tabs on",
        idiom_meaning: "monitor closely / しっかり見張る"
    },
    {
        id: '3Hkua6ln', // aorta
        sentence: "Bio teacher asked what the aorta does and I totally had to wing it. Said 'it's like... the main blood highway?' She actually said that wasn't bad. Lucky guess.",
        idiom: "wing it",
        idiom_meaning: "do something without preparation / ぶっつけ本番でやる"
    },
    {
        id: '3hLZ_WZY', // too many cooks spoil the soup
        sentence: "Teacher put us in groups of SIX for a project on day one. Too many cooks spoil the soup, you know? Ideas were a dime a dozen but nobody could agree on anything.",
        idiom: "a dime a dozen",
        idiom_meaning: "very common, not special / ありふれた"
    },
    {
        id: '3hNIlNsN', // Tendinitis
        sentence: "Told my brother 'break a leg' before his first day and he goes 'with my luck I'll actually get tendinitis from carrying this heavy backpack.' Such a drama queen.",
        idiom: "break a leg",
        idiom_meaning: "good luck / 頑張ってね"
    },
    {
        id: '3HnPInFw', // toenail
        sentence: "Some kid stepped on my toenail in the hallway and didn't even say sorry. That really pushed my buttons. It's day one and people are already on my nerves.",
        idiom: "push someone's buttons",
        idiom_meaning: "annoy someone / イラっとさせる"
    },
    {
        id: '3HQE2K8e', // Rhodes Scholarship
        sentence: "I joked that he better be aiming for a Rhodes Scholarship now that high school's started. He went outside to blow off steam. Guess the pressure jokes aren't landing.",
        idiom: "blow off steam",
        idiom_meaning: "release stress / ストレス発散する"
    },
    {
        id: '3i4J-0Um', // aircraft boneyard
        sentence: "The history teacher showed us pics of an aircraft boneyard which was kinda cool but then cut to the chase -- first test is in two weeks. TWO WEEKS. Already??",
        idiom: "cut to the chase",
        idiom_meaning: "get to the point / 本題に入る"
    },
    {
        id: '3ijK2Pqy', // Get your juices flowing
        sentence: "The PE teacher literally goes 'get your juices flowing, people!' Like sir it is 8 AM. Then he's like 'let's get the ball rolling with some laps.' My legs are already dead.",
        idiom: "get the ball rolling",
        idiom_meaning: "start something / 始める・動き出す"
    },
    {
        id: '3IrTEyMP', // when push comes to shove
        sentence: "When push comes to shove, I'll figure out this whole high school thing. But right now? I just need to sleep on it. Tomorrow's a whole new nightmare. Can't wait.",
        idiom: "sleep on it",
        idiom_meaning: "think about it overnight / 一晩考える"
    },
];

async function seedDay36() {
    console.log('Seeding Day 036 -- First day of high school (15M)...\n');
    let success = 0;
    let failed = 0;

    for (const item of DAY36_DATA) {
        try {
            const res = await fetch(`http://localhost:3001/api/user-phrases/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    review_sentence: item.sentence,
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

seedDay36();
