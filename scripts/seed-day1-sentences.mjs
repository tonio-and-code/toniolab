// Seed Day 1 (first 50 words) -- ULTRA CASUAL rewrite
// Day 001: Baby's first words and sounds at home

const DAY1_DATA = [
    {
        id: 'g74RzJSk', // exponent
        sentence: "Yeah so my dad's like a huge exponent of bedtime stories. Rain or shine, doesn't matter how tired he is, he's reading us something every single night.",
        idiom: "rain or shine",
        idiom_meaning: "no matter what / どんな状況でも"
    },
    {
        id: 'SX4twdcK', // remit
        sentence: "OK so I came clean about spilling juice all over the rug and Mom actually remitted the 'no dessert' thing? I was like wait, seriously?",
        idiom: "come clean",
        idiom_meaning: "confess honestly / 正直に白状する"
    },
    {
        id: 'Pl67jauO', // prodigal son
        sentence: "Uncle Dave showed up after like three years and Grandma literally killed the fatted calf for him. Total prodigal son vibes, you know?",
        idiom: "kill the fatted calf",
        idiom_meaning: "throw a huge welcome / 盛大に歓迎する"
    },
    {
        id: 'VHjc2F7f', // hydrofoil
        sentence: "Dude we saw this hydrofoil thing just flying across the water and my jaw literally dropped. Like how is that even a boat??",
        idiom: "jaw dropped",
        idiom_meaning: "be shocked / 驚きで口が開く"
    },
    {
        id: 'YTPLH-dZ', // double helix
        sentence: "Wait so the teacher showed us this double helix model and I'm like... THAT tiny spiral thing runs my whole body? Blew my freakin' mind.",
        idiom: "blow someone's mind",
        idiom_meaning: "totally shock you / 度肝を抜く"
    },
    {
        id: 'NIWY6inA', // resurgence
        sentence: "OK there's like this whole resurgence of kids playing outside now and honestly? About time. Screens were literally taking over.",
        idiom: "about time",
        idiom_meaning: "finally! / やっとだよ"
    },
    {
        id: '0x9VsS2s', // phagocyte
        sentence: "So apparently phagocytes are like these crazy little cells that go the extra mile to just eat up all the bad stuff in your body. Kinda metal honestly.",
        idiom: "go the extra mile",
        idiom_meaning: "do more than expected / 期待以上にやる"
    },
    {
        id: 'wPDHE-lW', // obliterate
        sentence: "Yo the rain just obliterated our sandcastle. Like completely gone. We were kinda bummed but whatever, just went with the flow and built another one.",
        idiom: "go with the flow",
        idiom_meaning: "just roll with it / 流れに任せる"
    },
    {
        id: 'VIjqfbNn', // obsidian
        sentence: "I found this sick piece of obsidian on the trail and I legit thought I hit the jackpot. Looked like an actual gemstone or something.",
        idiom: "hit the jackpot",
        idiom_meaning: "get super lucky / 大当たり"
    },
    {
        id: 'xQIgRbL5', // faction
        sentence: "So at recess there were like two factions going at it over what game to play. Teacher just made 'em meet halfway -- did both games. Problem solved.",
        idiom: "meet halfway",
        idiom_meaning: "compromise / 歩み寄る"
    },
    {
        id: '-Z1muqJJ', // doom
        sentence: "I forgot my homework and I'm like OK I'm doomed. But Mrs. Chen actually cut me some slack? Gave me till tomorrow. Bless her honestly.",
        idiom: "cut someone some slack",
        idiom_meaning: "not be so strict / 大目に見る"
    },
    {
        id: 'BLct-zIn', // equivocal
        sentence: "He gave this super equivocal answer about who ate the last cookie. Like bro just stop beating around the bush, we all know it was you.",
        idiom: "beat around the bush",
        idiom_meaning: "avoid saying it straight / 遠回しに言う"
    },
    {
        id: 'l38MCrgV', // conifer
        sentence: "Wait so conifers just... keep their needles all year? Kinda feels like the other trees got the short end of the stick losing everything every winter.",
        idiom: "get the short end of the stick",
        idiom_meaning: "get a bad deal / 割を食う"
    },
    {
        id: 'EFug-otR', // rebuff
        sentence: "She straight-up rebuffed him when he tried sharing crayons lol. He didn't take it to heart though, just kept doing his own thing.",
        idiom: "take it to heart",
        idiom_meaning: "get really hurt by it / 深く気にする"
    },
    {
        id: 'RXOLHEwI', // frugal
        sentence: "Grandma's so frugal dude, she saves like every single jar and rubber band. A penny saved is a penny earned I guess -- that's literally her life motto.",
        idiom: "a penny saved is a penny earned",
        idiom_meaning: "saving = earning / 節約は稼ぎと同じ"
    },
    {
        id: 'rjE2Ai4G', // confidential
        sentence: "She goes 'OK this is totally confidential' about the birthday plans and I'm like OK I'll keep it under my hat. Spoiler: I almost blabbed like twice.",
        idiom: "keep it under one's hat",
        idiom_meaning: "keep it secret / 秘密にする"
    },
    {
        id: 'xCD4ahDC', // impeccable
        sentence: "This girl's handwriting is impeccable and she's literally six. She's just got a knack for it I guess? Like every single letter looks printed.",
        idiom: "have a knack for",
        idiom_meaning: "be naturally good at / 生まれつき上手い"
    },
    {
        id: '7lIFxXtB', // perspire
        sentence: "Everyone was perspiring like crazy after the relay race but nobody cared 'cause we won and we were all on cloud nine. Best day ever.",
        idiom: "on cloud nine",
        idiom_meaning: "insanely happy / 最高に幸せ"
    },
    {
        id: 'PMq7cj95', // exonerate
        sentence: "The camera footage totally exonerated Tommy. Turns out he wasn't even the one who let the cat out of the bag about the surprise party. My bad Tommy.",
        idiom: "let the cat out of the bag",
        idiom_meaning: "accidentally spoil a secret / うっかり秘密をばらす"
    },
    {
        id: 'KYu739fN', // embark
        sentence: "We embarked on our first camping trip and I'm not gonna lie, from the get-go everything went wrong. Still the best weekend ever though.",
        idiom: "from the get-go",
        idiom_meaning: "from the very start / 最初っから"
    },
    {
        id: 'Yq5M3xaK', // brute
        sentence: "That dog looks like an absolute brute but honestly don't judge a book by its cover -- he's like the gentlest boy ever. Total softie.",
        idiom: "don't judge a book by its cover",
        idiom_meaning: "looks can be deceiving / 見た目で判断するな"
    },
    {
        id: 'F3OkFAVT', // construe
        sentence: "She totally construed my silence as me being pissed off but I was literally just spacing out. Wasn't even thinking about anything lol.",
        idiom: "space out",
        idiom_meaning: "zone out / ぼーっとする"
    },
    {
        id: '1jbUruo0', // in the wake of
        sentence: "In the wake of that insane snowstorm school got canceled and we just had a field day outside. Snowmen everywhere. Zero regrets.",
        idiom: "have a field day",
        idiom_meaning: "go all out having fun / 思いっきり楽しむ"
    },
    {
        id: 's55SjL2Y', // rescind
        sentence: "Mom finally rescinded the screen time ban after I shaped up and did all my chores. Took me like a week but hey, worth it.",
        idiom: "shape up",
        idiom_meaning: "get your act together / ちゃんとする"
    },
    {
        id: 'XM2CbZQf', // balk
        sentence: "I totally balked at trying sushi the first time. Dad's like 'just bite the bullet dude, one piece.' ...OK fine it was actually amazing.",
        idiom: "bite the bullet",
        idiom_meaning: "just force yourself to do it / 思い切ってやる"
    },
    {
        id: 'oo9c7sui', // janitor
        sentence: "Our school janitor is honestly the GOAT -- dude goes out of his way to fix stuff before anyone even notices something's broken.",
        idiom: "go out of one's way",
        idiom_meaning: "make a special effort / わざわざやる"
    },
    {
        id: 'V1-pgH5i', // maritime
        sentence: "Grandpa's always going off about his maritime days in the navy. Says it was the time of his life. He tells the same stories every time but whatever.",
        idiom: "the time of one's life",
        idiom_meaning: "the best time ever / 最高の時"
    },
    {
        id: 'wEVBItB3', // prod
        sentence: "Mom literally has to prod me outta bed every morning. I'm such a night owl -- I'm up reading manga till like 2am, can't help it.",
        idiom: "night owl",
        idiom_meaning: "late-night person / 夜型人間"
    },
    {
        id: 'vNAg9xiK', // abate
        sentence: "The storm finally abated and we could go outside and oh my god it was such a breath of fresh air. Being stuck inside all day sucked.",
        idiom: "a breath of fresh air",
        idiom_meaning: "a welcome change / いい気分転換"
    },
    {
        id: 'qdWu92fB', // fraught
        sentence: "Moving to a new town was just fraught with worries honestly. My parents kept saying hang in there, you'll make friends. Easy for them to say.",
        idiom: "hang in there",
        idiom_meaning: "don't give up / 頑張れ・耐えろ"
    },
    {
        id: 'N6zoePqX', // scurry
        sentence: "A mouse scurried across the kitchen floor and Mom literally almost had a cow. Full-on screaming, jumped on a chair, the whole thing.",
        idiom: "have a cow",
        idiom_meaning: "completely freak out / めちゃくちゃ慌てる"
    },
    {
        id: 'HszEI6-I', // proprietary
        sentence: "Grandma's cookie recipe is like proprietary information or something. She will NOT spill the beans no matter how much you beg. She's taking that to the grave.",
        idiom: "spill the beans",
        idiom_meaning: "tell the secret / ばらす"
    },
    {
        id: 'Teq7Ajbf', // submerge
        sentence: "We submerged all our toy boats in the tub and had a blast pretending there was like this massive storm. Water got literally everywhere. Mom was not happy.",
        idiom: "have a blast",
        idiom_meaning: "have an awesome time / めちゃ楽しむ"
    },
    {
        id: 'N3KtJv8v', // vegitation
        sentence: "The vegetation in the backyard just went nuts over summer. The weeds spread like wildfire -- couldn't even see the garden anymore lol.",
        idiom: "spread like wildfire",
        idiom_meaning: "spread crazy fast / 一気に広がる"
    },
    {
        id: 'CcihPnH5', // tardy
        sentence: "I was tardy again. I just drag my feet every morning, I can't help it. I'm literally not a morning person at all.",
        idiom: "drag one's feet",
        idiom_meaning: "be slow about it / ダラダラする"
    },
    {
        id: '9d5IS6ty', // grudge
        sentence: "She held a grudge about the toy thing for like two straight weeks. But eventually they buried the hatchet and went back to being besties.",
        idiom: "bury the hatchet",
        idiom_meaning: "make peace / 仲直りする"
    },
    {
        id: '5FZ6H3w7', // zeal
        sentence: "He went at the art project with crazy zeal, like totally in the zone. Didn't stop painting for three hours straight. Didn't even eat.",
        idiom: "in the zone",
        idiom_meaning: "totally focused / ゾーンに入ってる"
    },
    {
        id: 'f3b4AqDT', // perturb
        sentence: "Thunder really perturbs my little sister. I'm always like keep your chin up it'll pass, but she still hides under the blanket every time.",
        idiom: "keep one's chin up",
        idiom_meaning: "stay positive / 元気出せ"
    },
    {
        id: 'MuDvU2uA', // haggle
        sentence: "Dad loves to haggle at flea markets dude. He drives such a hard bargain -- literally gets stuff for half price every single time. It's embarrassing.",
        idiom: "drive a hard bargain",
        idiom_meaning: "negotiate aggressively / ガンガン値切る"
    },
    {
        id: 'QZRDVPud', // pinnacle
        sentence: "Winning that spelling bee was like the pinnacle of my whole year honestly. I was over the moon. Couldn't shut up about it for days.",
        idiom: "over the moon",
        idiom_meaning: "so so happy / 超嬉しい"
    },
    {
        id: 'XjGBgBM1', // topple
        sentence: "My block tower toppled right when I was about to finish and I'm like... great, back to square one. So annoying.",
        idiom: "back to square one",
        idiom_meaning: "start all over / 振り出しに戻る"
    },
    {
        id: 'ZOLC2je0', // lid
        sentence: "Couldn't get the lid off the jar and Mom goes 'hold your horses, gimme a sec' -- got it open in like one try. How??",
        idiom: "hold your horses",
        idiom_meaning: "chill, wait a sec / ちょっと待って"
    },
    {
        id: 'ExDzQeC_', // multitude
        sentence: "There was like a multitude of fireflies in the yard and catching them was a piece of cake 'cause they were literally everywhere.",
        idiom: "a piece of cake",
        idiom_meaning: "super easy / 楽勝"
    },
    {
        id: 'Ratdwxqo', // act up
        sentence: "My stomach started acting up right before the school play and I'm like no no no, gotta get my act together real quick. Made it just in time.",
        idiom: "get one's act together",
        idiom_meaning: "pull yourself together / しっかりしろ"
    },
    {
        id: '_R-aOESY', // dissertation
        sentence: "My cousin's been working on her dissertation and she's literally burning the midnight oil every night. Haven't seen her in weeks. Feel bad for her honestly.",
        idiom: "burn the midnight oil",
        idiom_meaning: "work super late / 夜中まで頑張る"
    },
    {
        id: 'hzTywXZ7', // burgeon
        sentence: "The tomato plants just burgeoned overnight and Mom's like 'the garden's finally coming into its own!' She was so hyped about those tomatoes lol.",
        idiom: "come into one's own",
        idiom_meaning: "finally reach potential / やっと本領発揮"
    },
    {
        id: '8RI7h0Mv', // pliable
        sentence: "Play-Doh's so pliable you can literally make anything with it. We didn't even have a plan -- just played it by ear and made random animals.",
        idiom: "play it by ear",
        idiom_meaning: "wing it / ノリでやる"
    },
    {
        id: '-MZ4mwvX', // resurrection
        sentence: "Learned about the Resurrection at church then spent the whole afternoon on this wild goose chase looking for Easter eggs. Found like three. Out of fifty.",
        idiom: "wild goose chase",
        idiom_meaning: "pointless search / 無駄な探し物"
    },
    {
        id: 'O1hhcZN5', // aerosol can
        sentence: "Dad grabbed the aerosol can to kill a spider before the BBQ. 'Better safe than sorry,' he said. Mom still screamed when she saw it though lol.",
        idiom: "better safe than sorry",
        idiom_meaning: "play it safe / 念には念を"
    },
    {
        id: 'Mj8OKYD6', // subjugate
        sentence: "The older kids tried to like subjugate the little ones at recess but our teacher nipped that in the bud real quick. She don't play.",
        idiom: "nip it in the bud",
        idiom_meaning: "stop it early / 芽を摘む"
    },
];

async function seedDay1() {
    console.log('Seeding Day 1 -- ULTRA CASUAL version...\n');
    let success = 0;
    let failed = 0;

    for (const item of DAY1_DATA) {
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

seedDay1();
