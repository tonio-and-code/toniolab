/**
 * Daily English Pool - Large pool of content for date-based generation
 *
 * Two types:
 * 1. Discussion snippets - Short exchanges about real topics
 * 2. Everyday expressions - Useful phrases for daily life
 */

export interface DiscussionSnippet {
    id: string;
    topic: string;
    topicJa: string;
    lines: { speaker: 'A' | 'B'; text: string }[];
    keyPhrase: { en: string; ja: string };
}

export interface EverydayExpression {
    id: string;
    situation: string;
    situationJa: string;
    english: string;
    japanese: string;
    note?: string;
}

// 50+ Discussion Snippets (short 4-6 line exchanges)
export const discussionSnippets: DiscussionSnippet[] = [
    // Climate & Environment
    {
        id: 'd001',
        topic: 'Carbon footprint of the rich',
        topicJa: '富裕層の炭素排出',
        lines: [
            { speaker: 'A', text: "Did you see that report? The top 1% used their whole year's carbon budget in ten days." },
            { speaker: 'B', text: "Yeah, it's pretty alarming. And meanwhile we're stressing about reusable bags." },
            { speaker: 'A', text: "It makes you wonder what the point of individual action even is." },
            { speaker: 'B', text: "I think it still matters, it's just not enough on its own." },
        ],
        keyPhrase: { en: "it's not enough on its own", ja: "それだけでは不十分" },
    },
    {
        id: 'd002',
        topic: 'Electric cars',
        topicJa: '電気自動車',
        lines: [
            { speaker: 'A', text: "Are you thinking about getting an EV?" },
            { speaker: 'B', text: "I've thought about it, but the charging infrastructure is still pretty limited here." },
            { speaker: 'A', text: "That's fair. It depends a lot on where you live." },
            { speaker: 'B', text: "Yeah, if I had a house with a garage, it'd be a no-brainer." },
        ],
        keyPhrase: { en: "it'd be a no-brainer", ja: "迷うまでもない" },
    },
    {
        id: 'd003',
        topic: 'Plastic waste',
        topicJa: 'プラスチックごみ',
        lines: [
            { speaker: 'A', text: "Japan recycles a lot of plastic, but I heard most of it just gets burned anyway." },
            { speaker: 'B', text: "Wait, really? That's kind of defeating the purpose." },
            { speaker: 'A', text: "Apparently. The recycling rates are misleading." },
            { speaker: 'B', text: "Huh. That's not something I would've expected." },
        ],
        keyPhrase: { en: "that's kind of defeating the purpose", ja: "それじゃ意味がない" },
    },

    // Technology & AI
    {
        id: 'd004',
        topic: 'AI taking jobs',
        topicJa: 'AIと雇用',
        lines: [
            { speaker: 'A', text: "Do you think AI is actually going to replace most jobs?" },
            { speaker: 'B', text: "Probably more than people expect, but not in the way we imagine." },
            { speaker: 'A', text: "What do you mean?" },
            { speaker: 'B', text: "It's not robots taking over. It's tasks getting automated one by one until the job looks completely different." },
        ],
        keyPhrase: { en: "not in the way we imagine", ja: "想像してるのとは違う形で" },
    },
    {
        id: 'd005',
        topic: 'Social media algorithms',
        topicJa: 'SNSのアルゴリズム',
        lines: [
            { speaker: 'A', text: "I've been trying to use social media less. It's designed to be addictive." },
            { speaker: 'B', text: "The algorithms are specifically made to keep you scrolling." },
            { speaker: 'A', text: "Exactly. And it's messing with my attention span." },
            { speaker: 'B', text: "Same here. I can barely focus on anything for more than five minutes now." },
        ],
        keyPhrase: { en: "specifically made to", ja: "〜するために意図的に作られた" },
    },
    {
        id: 'd006',
        topic: 'Screen time for kids',
        topicJa: '子供のスクリーンタイム',
        lines: [
            { speaker: 'A', text: "How much screen time do you let your kids have?" },
            { speaker: 'B', text: "It's a constant battle, honestly. We try to limit it, but it's hard when all their friends are online." },
            { speaker: 'A', text: "Yeah, you don't want them to be the only one left out." },
            { speaker: 'B', text: "That's the dilemma. It's a collective action problem." },
        ],
        keyPhrase: { en: "it's a collective action problem", ja: "みんなで足並み揃えないと解決しない問題" },
    },
    {
        id: 'd007',
        topic: 'Working from home',
        topicJa: 'リモートワーク',
        lines: [
            { speaker: 'A', text: "My company wants us back in the office three days a week." },
            { speaker: 'B', text: "That's becoming common. What's their reasoning?" },
            { speaker: 'A', text: "The usual stuff — collaboration, company culture." },
            { speaker: 'B', text: "There's some truth to that, but is it worth a two-hour commute?" },
        ],
        keyPhrase: { en: "there's some truth to that", ja: "一理ある" },
    },

    // Work & Career
    {
        id: 'd008',
        topic: 'Hustle culture',
        topicJa: 'ハッスル文化',
        lines: [
            { speaker: 'A', text: "Have you noticed that whole hustle culture thing is kind of fading?" },
            { speaker: 'B', text: "A little bit. People are burning out and being more vocal about it." },
            { speaker: 'A', text: "The pandemic changed a lot of perspectives." },
            { speaker: 'B', text: "Yeah, people realized that work isn't everything." },
        ],
        keyPhrase: { en: "being more vocal about it", ja: "声を上げるようになった" },
    },
    {
        id: 'd009',
        topic: 'Quiet quitting',
        topicJa: '静かな退職',
        lines: [
            { speaker: 'A', text: "What do you think about this whole 'quiet quitting' trend?" },
            { speaker: 'B', text: "I hate that term. It's not really quitting — it's just doing your job and going home." },
            { speaker: 'A', text: "Right? That shouldn't be controversial." },
            { speaker: 'B', text: "The fact that we needed a name for it says a lot." },
        ],
        keyPhrase: { en: "the fact that... says a lot", ja: "〜という事実が多くを物語っている" },
    },
    {
        id: 'd010',
        topic: 'Changing jobs',
        topicJa: '転職',
        lines: [
            { speaker: 'A', text: "I'm thinking about looking for a new job." },
            { speaker: 'B', text: "Oh yeah? What's making you want to leave?" },
            { speaker: 'A', text: "No growth opportunities. I've been doing the same thing for three years." },
            { speaker: 'B', text: "That's frustrating. At some point, you have to put yourself first." },
        ],
        keyPhrase: { en: "at some point, you have to", ja: "いつかは〜しないと" },
    },
    {
        id: 'd011',
        topic: 'Work-life balance',
        topicJa: 'ワークライフバランス',
        lines: [
            { speaker: 'A', text: "I've been working late every day this week. I'm exhausted." },
            { speaker: 'B', text: "That's not sustainable. Have you talked to your manager?" },
            { speaker: 'A', text: "I'm worried about how it'll look if I push back." },
            { speaker: 'B', text: "But if you burn out, you're no use to anyone, including yourself." },
        ],
        keyPhrase: { en: "that's not sustainable", ja: "それは長続きしない" },
    },

    // Society & Japan
    {
        id: 'd012',
        topic: 'Japan\'s population decline',
        topicJa: '日本の人口減少',
        lines: [
            { speaker: 'A', text: "Japan's birth rate hit another record low. Under 800,000 births." },
            { speaker: 'B', text: "The government's response has been pretty underwhelming." },
            { speaker: 'A', text: "Throwing money at the problem isn't going to work." },
            { speaker: 'B', text: "The core issue is that raising kids here is just too hard." },
        ],
        keyPhrase: { en: "throwing money at the problem", ja: "お金をつぎ込んで解決しようとする" },
    },
    {
        id: 'd013',
        topic: 'Immigration in Japan',
        topicJa: '日本と移民',
        lines: [
            { speaker: 'A', text: "Some people say immigration is the answer to Japan's labor shortage." },
            { speaker: 'B', text: "It could help, but Japan has been pretty resistant to that historically." },
            { speaker: 'A', text: "Do you think attitudes will change?" },
            { speaker: 'B', text: "Maybe out of necessity. When there aren't enough workers, things have to change." },
        ],
        keyPhrase: { en: "out of necessity", ja: "必要に迫られて" },
    },
    {
        id: 'd014',
        topic: 'Cost of living',
        topicJa: '生活費',
        lines: [
            { speaker: 'A', text: "Everything is getting more expensive. Groceries, rent, utilities..." },
            { speaker: 'B', text: "And wages aren't keeping up." },
            { speaker: 'A', text: "It adds up fast. I'm barely saving anything these days." },
            { speaker: 'B', text: "Same here. Something's gotta give." },
        ],
        keyPhrase: { en: "something's gotta give", ja: "何かが変わらないと" },
    },

    // Health & Lifestyle
    {
        id: 'd015',
        topic: 'Mental health',
        topicJa: 'メンタルヘルス',
        lines: [
            { speaker: 'A', text: "I've been feeling really burned out lately." },
            { speaker: 'B', text: "Have you thought about talking to someone? Like a therapist?" },
            { speaker: 'A', text: "I've considered it, but there's still kind of a stigma around it here." },
            { speaker: 'B', text: "That's changing though. A lot of people are more open about it now." },
        ],
        keyPhrase: { en: "there's kind of a stigma around it", ja: "まだなんとなく偏見がある" },
    },
    {
        id: 'd016',
        topic: 'Exercise habits',
        topicJa: '運動習慣',
        lines: [
            { speaker: 'A', text: "I really need to start going to the gym again." },
            { speaker: 'B', text: "When did you stop?" },
            { speaker: 'A', text: "Like three months ago? I kept saying 'I'll go tomorrow' and then..." },
            { speaker: 'B', text: "Tomorrow never comes. Maybe start small — just 20 minutes?" },
        ],
        keyPhrase: { en: "tomorrow never comes", ja: "「明日」は永遠に来ない" },
    },
    {
        id: 'd017',
        topic: 'Sleep habits',
        topicJa: '睡眠習慣',
        lines: [
            { speaker: 'A', text: "I've been sleeping terribly. Can't stop scrolling before bed." },
            { speaker: 'B', text: "The blue light thing is real. Have you tried putting your phone in another room?" },
            { speaker: 'A', text: "I use it as my alarm though." },
            { speaker: 'B', text: "Get a cheap alarm clock. It's a game changer, honestly." },
        ],
        keyPhrase: { en: "it's a game changer", ja: "それで全然違う" },
    },

    // Education & Learning
    {
        id: 'd018',
        topic: 'Learning English as an adult',
        topicJa: '大人の英語学習',
        lines: [
            { speaker: 'A', text: "I've been trying to improve my English for years, but I feel like I've plateaued." },
            { speaker: 'B', text: "That's common. What have you been doing to practice?" },
            { speaker: 'A', text: "Mostly apps and watching shows with subtitles." },
            { speaker: 'B', text: "Those are fine for basics, but they won't get you to fluency. You need to actually use the language." },
        ],
        keyPhrase: { en: "I feel like I've plateaued", ja: "伸び悩んでる気がする" },
    },
    {
        id: 'd019',
        topic: 'Online courses',
        topicJa: 'オンライン講座',
        lines: [
            { speaker: 'A', text: "I signed up for an online course but I haven't finished it." },
            { speaker: 'B', text: "Join the club. I have like five half-finished courses." },
            { speaker: 'A', text: "It's so easy to start, but hard to follow through." },
            { speaker: 'B', text: "The completion rate for online courses is like 10%. We're not alone." },
        ],
        keyPhrase: { en: "join the club", ja: "俺も同じだよ（仲間だね）" },
    },

    // Entertainment & Culture
    {
        id: 'd020',
        topic: 'Streaming vs cinema',
        topicJa: '配信 vs 映画館',
        lines: [
            { speaker: 'A', text: "I can't remember the last time I went to a movie theater." },
            { speaker: 'B', text: "Same. Netflix and my couch are just too convenient." },
            { speaker: 'A', text: "But are we losing something? The whole theater experience?" },
            { speaker: 'B', text: "Maybe. But honestly, most movies don't need a big screen." },
        ],
        keyPhrase: { en: "I can't remember the last time", ja: "最後にいつ〜したか思い出せない" },
    },
    {
        id: 'd021',
        topic: 'Binge watching',
        topicJa: '一気見',
        lines: [
            { speaker: 'A', text: "I stayed up until 3am binging that new show." },
            { speaker: 'B', text: "Was it worth it?" },
            { speaker: 'A', text: "In the moment, yes. The next day at work, absolutely not." },
            { speaker: 'B', text: "Story of my life. I have no self-control with good shows." },
        ],
        keyPhrase: { en: "story of my life", ja: "あるあるだわ（俺もそう）" },
    },
    {
        id: 'd022',
        topic: 'News consumption',
        topicJa: 'ニュースの消費',
        lines: [
            { speaker: 'A', text: "I've been trying to limit how much news I consume." },
            { speaker: 'B', text: "That's probably healthy. It's overwhelming these days." },
            { speaker: 'A', text: "But I also don't want to be completely out of the loop." },
            { speaker: 'B', text: "There's a balance. Maybe just check once a day instead of constantly." },
        ],
        keyPhrase: { en: "out of the loop", ja: "情報から取り残される" },
    },

    // Relationships
    {
        id: 'd023',
        topic: 'Dating apps',
        topicJa: 'マッチングアプリ',
        lines: [
            { speaker: 'A', text: "Have you tried any dating apps?" },
            { speaker: 'B', text: "Yeah, but it's exhausting. So many matches but conversations go nowhere." },
            { speaker: 'A', text: "The paradox of choice, I guess." },
            { speaker: 'B', text: "Exactly. When there's always someone else, nobody invests in anyone." },
        ],
        keyPhrase: { en: "the paradox of choice", ja: "選択肢のパラドックス" },
    },
    {
        id: 'd024',
        topic: 'Making friends as an adult',
        topicJa: '大人になってからの友達作り',
        lines: [
            { speaker: 'A', text: "Is it just me or is it way harder to make friends as an adult?" },
            { speaker: 'B', text: "It's not just you. Without school or shared activities, it takes real effort." },
            { speaker: 'A', text: "And everyone's so busy. Scheduling anything is a nightmare." },
            { speaker: 'B', text: "You basically have to treat it like dating — put yourself out there intentionally." },
        ],
        keyPhrase: { en: "put yourself out there", ja: "積極的に自分から行く" },
    },

    // Money & Finance
    {
        id: 'd025',
        topic: 'Saving money',
        topicJa: '貯金',
        lines: [
            { speaker: 'A', text: "I'm trying to save more, but it feels impossible." },
            { speaker: 'B', text: "Have you tried automating it? Like, transferring to savings right when you get paid?" },
            { speaker: 'A', text: "I've heard that helps. Out of sight, out of mind." },
            { speaker: 'B', text: "Exactly. If it's in your checking account, you'll spend it." },
        ],
        keyPhrase: { en: "out of sight, out of mind", ja: "見えなければ忘れる" },
    },
    {
        id: 'd026',
        topic: 'Investing',
        topicJa: '投資',
        lines: [
            { speaker: 'A', text: "Do you invest in stocks?" },
            { speaker: 'B', text: "Just index funds. I don't have the time or knowledge to pick individual stocks." },
            { speaker: 'A', text: "That's the sensible approach, honestly." },
            { speaker: 'B', text: "Boring, but it works. I'm not trying to get rich quick." },
        ],
        keyPhrase: { en: "I'm not trying to get rich quick", ja: "一攫千金を狙ってるわけじゃない" },
    },

    // Food & Cooking
    {
        id: 'd027',
        topic: 'Meal planning',
        topicJa: '献立計画',
        lines: [
            { speaker: 'A', text: "I keep ordering delivery because I never know what to cook." },
            { speaker: 'B', text: "Have you tried meal planning? Like, deciding everything on Sunday?" },
            { speaker: 'A', text: "That sounds like a lot of work." },
            { speaker: 'B', text: "It's actually less work overall. You only have to think about it once." },
        ],
        keyPhrase: { en: "it's actually less work overall", ja: "トータルではむしろ楽" },
    },
    {
        id: 'd028',
        topic: 'Food delivery',
        topicJa: 'フードデリバリー',
        lines: [
            { speaker: 'A', text: "I spend way too much on Uber Eats." },
            { speaker: 'B', text: "The convenience tax is real. Have you calculated how much it adds up to?" },
            { speaker: 'A', text: "I'm scared to look, honestly." },
            { speaker: 'B', text: "Sometimes ignorance is bliss, but also... maybe take a look." },
        ],
        keyPhrase: { en: "ignorance is bliss", ja: "知らぬが仏" },
    },

    // Travel
    {
        id: 'd029',
        topic: 'Travel planning',
        topicJa: '旅行計画',
        lines: [
            { speaker: 'A', text: "I want to travel more, but planning is so overwhelming." },
            { speaker: 'B', text: "Start small. Even a weekend trip somewhere nearby counts." },
            { speaker: 'A', text: "That's true. I keep waiting for the 'perfect' trip." },
            { speaker: 'B', text: "Perfect is the enemy of good. Just go somewhere." },
        ],
        keyPhrase: { en: "perfect is the enemy of good", ja: "完璧を求めすぎるとダメ" },
    },
    {
        id: 'd030',
        topic: 'Overtourism',
        topicJa: 'オーバーツーリズム',
        lines: [
            { speaker: 'A', text: "Kyoto is so crowded now. It's hard to enjoy." },
            { speaker: 'B', text: "Overtourism is a real problem. Some places are being loved to death." },
            { speaker: 'A', text: "Maybe we need to spread out more — visit lesser-known places." },
            { speaker: 'B', text: "Or travel off-season. It makes a huge difference." },
        ],
        keyPhrase: { en: "being loved to death", ja: "愛されすぎてダメになる" },
    },

    // More varied topics
    {
        id: 'd031',
        topic: 'Minimalism',
        topicJa: 'ミニマリズム',
        lines: [
            { speaker: 'A', text: "I've been trying to own less stuff. It's harder than I thought." },
            { speaker: 'B', text: "What's the hardest part?" },
            { speaker: 'A', text: "Letting go of things I might need 'someday'." },
            { speaker: 'B', text: "That 'someday' rarely comes. If you haven't used it in a year, you probably won't." },
        ],
        keyPhrase: { en: "that 'someday' rarely comes", ja: "その「いつか」はめったに来ない" },
    },
    {
        id: 'd032',
        topic: 'Subscription fatigue',
        topicJa: 'サブスク疲れ',
        lines: [
            { speaker: 'A', text: "I just realized I'm paying for like six streaming services." },
            { speaker: 'B', text: "Subscription creep is real. It adds up without you noticing." },
            { speaker: 'A', text: "I should probably cancel a few." },
            { speaker: 'B', text: "Or rotate them. Subscribe to one, binge, cancel, move to the next." },
        ],
        keyPhrase: { en: "subscription creep", ja: "サブスクがいつの間にか増える現象" },
    },
    {
        id: 'd033',
        topic: 'Aging parents',
        topicJa: '親の介護',
        lines: [
            { speaker: 'A', text: "My parents are getting older. I'm starting to worry about them." },
            { speaker: 'B', text: "Have you talked to them about their plans?" },
            { speaker: 'A', text: "It's a hard conversation to start." },
            { speaker: 'B', text: "It is, but it's better to have it now than during a crisis." },
        ],
        keyPhrase: { en: "better to have it now than during a crisis", ja: "危機的状況になる前に話した方がいい" },
    },
    {
        id: 'd034',
        topic: 'Side projects',
        topicJa: '副業・個人プロジェクト',
        lines: [
            { speaker: 'A', text: "I have so many ideas for side projects but never follow through." },
            { speaker: 'B', text: "The starting is easy. It's the finishing that's hard." },
            { speaker: 'A', text: "How do you stay motivated?" },
            { speaker: 'B', text: "I try to make them small enough to actually complete. Scope creep kills everything." },
        ],
        keyPhrase: { en: "scope creep kills everything", ja: "やりたいことを広げすぎると全部ダメになる" },
    },
    {
        id: 'd035',
        topic: 'Imposter syndrome',
        topicJa: 'インポスター症候群',
        lines: [
            { speaker: 'A', text: "I got promoted but I feel like I don't deserve it." },
            { speaker: 'B', text: "That's imposter syndrome. Almost everyone feels it." },
            { speaker: 'A', text: "Really? Even successful people?" },
            { speaker: 'B', text: "Especially successful people. The ones who don't feel it are usually the problem." },
        ],
        keyPhrase: { en: "almost everyone feels it", ja: "ほとんど誰もが感じる" },
    },
];

// 100+ Everyday Expressions
export const everydayExpressions: EverydayExpression[] = [
    // Agreeing
    { id: 'e001', situation: 'Agreeing strongly', situationJa: '強く同意', english: "Absolutely.", japanese: "まさにその通り。" },
    { id: 'e002', situation: 'Agreeing casually', situationJa: 'カジュアルに同意', english: "Yeah, for sure.", japanese: "うん、確かに。" },
    { id: 'e003', situation: 'Agreeing with reservation', situationJa: '留保付きで同意', english: "I see your point, but...", japanese: "言いたいことはわかるけど..." },
    { id: 'e004', situation: 'Partial agreement', situationJa: '部分的同意', english: "There's some truth to that.", japanese: "一理あるね。" },
    { id: 'e005', situation: 'Acknowledging a good point', situationJa: '良い点を認める', english: "That's a good point.", japanese: "それはいいポイントだね。" },
    { id: 'e006', situation: 'Agreeing reluctantly', situationJa: '渋々同意', english: "I guess you're right.", japanese: "まあ、そうかもね。" },

    // Disagreeing
    { id: 'e007', situation: 'Soft disagreement', situationJa: '柔らかく反対', english: "I'm not so sure about that.", japanese: "それはどうかな。" },
    { id: 'e008', situation: 'Polite disagreement', situationJa: '丁寧に反対', english: "I see it differently.", japanese: "私は違う見方をしてる。" },
    { id: 'e009', situation: 'Challenging an idea', situationJa: '意見に疑問を呈す', english: "That's the thing though...", japanese: "でも問題は..." },
    { id: 'e010', situation: 'Pointing out a flaw', situationJa: '問題点を指摘', english: "The problem with that is...", japanese: "それの問題点は..." },

    // Expressing uncertainty
    { id: 'e011', situation: 'Being unsure', situationJa: '不確か', english: "I'm not sure how I feel about it.", japanese: "どう思うか自分でもわからない。" },
    { id: 'e012', situation: 'Hedging', situationJa: '言葉を濁す', english: "It depends, I guess.", japanese: "場合によるかな。" },
    { id: 'e013', situation: 'Admitting ignorance', situationJa: '知らないことを認める', english: "I honestly have no idea.", japanese: "正直、全然わからない。" },
    { id: 'e014', situation: 'Uncertain recall', situationJa: '記憶が曖昧', english: "I wanna say... maybe around 2020?", japanese: "確か...2020年くらい？" },

    // Asking for clarification
    { id: 'e015', situation: 'Asking for explanation', situationJa: '説明を求める', english: "What do you mean by that?", japanese: "それどういうこと？" },
    { id: 'e016', situation: 'Asking for details', situationJa: '詳細を聞く', english: "How so?", japanese: "どういうふうに？" },
    { id: 'e017', situation: 'Confirming understanding', situationJa: '理解を確認', english: "So what you're saying is...", japanese: "つまり言いたいのは..." },
    { id: 'e018', situation: 'Seeking examples', situationJa: '例を求める', english: "Can you give me an example?", japanese: "例えば？" },

    // Expressing opinions
    { id: 'e019', situation: 'Introducing opinion', situationJa: '意見を述べる', english: "The way I see it...", japanese: "私の見方では..." },
    { id: 'e020', situation: 'Personal view', situationJa: '個人的見解', english: "Personally, I think...", japanese: "個人的には..." },
    { id: 'e021', situation: 'Honest opinion', situationJa: '正直な意見', english: "Honestly? I think...", japanese: "正直に言うと..." },
    { id: 'e022', situation: 'Strong opinion', situationJa: '強い意見', english: "If you ask me...", japanese: "私に言わせれば..." },

    // Changing topics
    { id: 'e023', situation: 'Smooth transition', situationJa: '話題を変える', english: "Speaking of which...", japanese: "そういえば..." },
    { id: 'e024', situation: 'Abrupt change', situationJa: '急に話題を変える', english: "Anyway, moving on...", japanese: "まあとにかく、次の話だけど..." },
    { id: 'e025', situation: 'Returning to topic', situationJa: '話を戻す', english: "Going back to what you said earlier...", japanese: "さっき言ってたことに戻るけど..." },

    // Showing interest
    { id: 'e026', situation: 'Showing curiosity', situationJa: '興味を示す', english: "Oh really? Tell me more.", japanese: "へー、もっと聞かせて。" },
    { id: 'e027', situation: 'Surprised interest', situationJa: '驚きつつ興味', english: "Wait, what? That's wild.", japanese: "え、なにそれ。すごいね。" },
    { id: 'e028', situation: 'Engaged listening', situationJa: '聞いてる姿勢', english: "I see, I see.", japanese: "なるほどね。" },

    // Expressing frustration
    { id: 'e029', situation: 'Mild frustration', situationJa: '軽いイラつき', english: "That's kind of annoying.", japanese: "ちょっとイラっとするね。" },
    { id: 'e030', situation: 'Exasperation', situationJa: '呆れ', english: "I can't believe this.", japanese: "信じられない。" },
    { id: 'e031', situation: 'Resignation', situationJa: '諦め', english: "It is what it is.", japanese: "しょうがないね。" },
    { id: 'e032', situation: 'Giving up', situationJa: '諦める', english: "Whatever, I give up.", japanese: "もういいや、諦める。" },

    // Offering help/suggestions
    { id: 'e033', situation: 'Offering suggestion', situationJa: '提案', english: "Have you tried...?", japanese: "〜してみた？" },
    { id: 'e034', situation: 'Gentle advice', situationJa: '優しいアドバイス', english: "Maybe you could...", japanese: "〜してみたら？" },
    { id: 'e035', situation: 'Strong recommendation', situationJa: '強く勧める', english: "You should definitely...", japanese: "絶対〜した方がいいよ。" },
    { id: 'e036', situation: 'Alternative suggestion', situationJa: '代替案', english: "What about...?", japanese: "〜はどう？" },

    // Reactions
    { id: 'e037', situation: 'Positive surprise', situationJa: 'ポジティブな驚き', english: "No way! That's awesome.", japanese: "マジで！すごいじゃん。" },
    { id: 'e038', situation: 'Negative surprise', situationJa: 'ネガティブな驚き', english: "Oh no, that sucks.", japanese: "うわ、それは最悪だね。" },
    { id: 'e039', situation: 'Sympathy', situationJa: '共感', english: "I feel you. That's rough.", japanese: "わかる。大変だったね。" },
    { id: 'e040', situation: 'Understanding', situationJa: '理解を示す', english: "That makes sense.", japanese: "それは納得。" },

    // Time expressions
    { id: 'e041', situation: 'Vague time', situationJa: '曖昧な時間', english: "Around 8ish?", japanese: "8時くらい？" },
    { id: 'e042', situation: 'Soon', situationJa: 'もうすぐ', english: "Any minute now.", japanese: "もうそろそろ。" },
    { id: 'e043', situation: 'Eventually', situationJa: 'いつかは', english: "Sooner or later.", japanese: "遅かれ早かれ。" },
    { id: 'e044', situation: 'For now', situationJa: '今のところ', english: "For the time being.", japanese: "当面は。" },

    // Degree/Intensity
    { id: 'e045', situation: 'Very much', situationJa: 'とても', english: "Big time.", japanese: "めちゃくちゃ。" },
    { id: 'e046', situation: 'Somewhat', situationJa: 'ある程度', english: "To some extent.", japanese: "ある程度は。" },
    { id: 'e047', situation: 'Barely', situationJa: 'かろうじて', english: "Just barely.", japanese: "ギリギリ。" },
    { id: 'e048', situation: 'Not at all', situationJa: '全然', english: "Not even close.", japanese: "全然違う。" },

    // Conversation fillers
    { id: 'e049', situation: 'Thinking', situationJa: '考え中', english: "Let me think...", japanese: "えーっと..." },
    { id: 'e050', situation: 'Hesitation', situationJa: 'ためらい', english: "I mean...", japanese: "まあ、その..." },
    { id: 'e051', situation: 'Continuation', situationJa: '続き', english: "So basically...", japanese: "つまり..." },
    { id: 'e052', situation: 'Conclusion', situationJa: '結論', english: "Long story short...", japanese: "要するに..." },

    // Ending conversations
    { id: 'e053', situation: 'Wrapping up', situationJa: '締め', english: "Anyway, I should get going.", japanese: "まあとにかく、そろそろ行かないと。" },
    { id: 'e054', situation: 'Acknowledging time', situationJa: '時間を認識', english: "I didn't realize how late it was.", japanese: "こんな時間だったんだ。" },
    { id: 'e055', situation: 'Planning to continue', situationJa: '続きを約束', english: "Let's pick this up later.", japanese: "また続き話そう。" },

    // Expressing preferences
    { id: 'e056', situation: 'Strong preference', situationJa: '強い好み', english: "I'd much rather...", japanese: "どちらかというと〜の方がいい。" },
    { id: 'e057', situation: 'No preference', situationJa: '好みなし', english: "I'm easy. Whatever works.", japanese: "なんでもいいよ。" },
    { id: 'e058', situation: 'Mild preference', situationJa: '軽い好み', english: "I'm kind of leaning towards...", japanese: "どっちかというと〜かな。" },

    // Comparing
    { id: 'e059', situation: 'Similar', situationJa: '似ている', english: "It's pretty much the same thing.", japanese: "ほぼ同じだね。" },
    { id: 'e060', situation: 'Different', situationJa: '異なる', english: "It's a whole different story.", japanese: "全然別の話だね。" },
    { id: 'e061', situation: 'Contrast', situationJa: '対比', english: "On the other hand...", japanese: "一方で..." },

    // Generalizing
    { id: 'e062', situation: 'General statement', situationJa: '一般化', english: "For the most part...", japanese: "大体の場合..." },
    { id: 'e063', situation: 'Typical case', situationJa: '典型的', english: "Nine times out of ten...", japanese: "十中八九..." },
    { id: 'e064', situation: 'Exception', situationJa: '例外', english: "With a few exceptions...", japanese: "いくつか例外はあるけど..." },

    // Emphasizing
    { id: 'e065', situation: 'Strong emphasis', situationJa: '強調', english: "The thing is...", japanese: "問題は..." },
    { id: 'e066', situation: 'Key point', situationJa: '重要点', english: "What it comes down to is...", japanese: "結局のところ..." },
    { id: 'e067', situation: 'Core issue', situationJa: '核心', english: "At the end of the day...", japanese: "結局..." },

    // Admitting mistakes
    { id: 'e068', situation: 'Taking blame', situationJa: '責任を認める', english: "My bad. I should have...", japanese: "ごめん、〜すべきだった。" },
    { id: 'e069', situation: 'Acknowledging error', situationJa: '間違いを認める', english: "You're right, I was wrong about that.", japanese: "そうだね、俺が間違ってた。" },
    { id: 'e070', situation: 'Hindsight', situationJa: '後から思えば', english: "In hindsight, I should have...", japanese: "今思えば〜すべきだった。" },

    // Expressing relief
    { id: 'e071', situation: 'Relief', situationJa: '安堵', english: "Thank god. I was worried.", japanese: "よかった。心配してた。" },
    { id: 'e072', situation: 'Close call', situationJa: 'ギリギリ', english: "That was a close one.", japanese: "危なかったね。" },
    { id: 'e073', situation: 'Lucky', situationJa: '運がいい', english: "We dodged a bullet there.", japanese: "ギリギリ助かったね。" },

    // Expressing concern
    { id: 'e074', situation: 'Worried', situationJa: '心配', english: "That's what worries me.", japanese: "それが心配なんだよ。" },
    { id: 'e075', situation: 'Uncertain future', situationJa: '先が見えない', english: "I'm not sure what's gonna happen.", japanese: "どうなるかわからない。" },
    { id: 'e076', situation: 'Bad feeling', situationJa: '嫌な予感', english: "I have a bad feeling about this.", japanese: "なんか嫌な予感がする。" },

    // Being realistic
    { id: 'e077', situation: 'Reality check', situationJa: '現実を見る', english: "Let's be realistic here.", japanese: "現実的に考えよう。" },
    { id: 'e078', situation: 'Practical view', situationJa: '実際的な見方', english: "Easier said than done.", japanese: "言うは易く行うは難し。" },
    { id: 'e079', situation: 'No simple solution', situationJa: '簡単な解決策なし', english: "There's no silver bullet.", japanese: "万能薬はない。" },
    { id: 'e080', situation: 'Trade-offs', situationJa: 'トレードオフ', english: "It's a trade-off.", japanese: "何かを得れば何かを失う。" },

    // More casual expressions
    { id: 'e081', situation: 'Casual yes', situationJa: 'カジュアルなYes', english: "Yeah, sounds good.", japanese: "うん、いいね。" },
    { id: 'e082', situation: 'Acknowledgment', situationJa: '了解', english: "Got it.", japanese: "了解。" },
    { id: 'e083', situation: 'Understanding', situationJa: '納得', english: "Fair enough.", japanese: "まあそうだね。" },
    { id: 'e084', situation: 'Agreement', situationJa: '同意', english: "Same here.", japanese: "俺もそう。" },
    { id: 'e085', situation: 'Relating', situationJa: '共感', english: "I know, right?", japanese: "だよね？" },
    { id: 'e086', situation: 'Confirmation', situationJa: '確認', english: "For real?", japanese: "マジで？" },
    { id: 'e087', situation: 'Disbelief', situationJa: '信じられない', english: "No way.", japanese: "嘘でしょ。" },
    { id: 'e088', situation: 'Excitement', situationJa: '興奮', english: "That's sick.", japanese: "やばいね。" },
    { id: 'e089', situation: 'Dismissal', situationJa: '却下', english: "Whatever.", japanese: "どうでもいい。" },
    { id: 'e090', situation: 'Acceptance', situationJa: '受け入れ', english: "It is what it is.", japanese: "しょうがない。" },
];

// Helper function to get content for a specific date
export function getDailyContent(dateStr: string): {
    discussions: DiscussionSnippet[];
    expressions: EverydayExpression[];
} {
    // Use date as seed for consistent but varied daily content
    const seed = dateStr.split('-').reduce((acc, num) => acc + parseInt(num), 0);

    // Shuffle function with seed
    const seededShuffle = <T,>(arr: T[], s: number): T[] => {
        const shuffled = [...arr];
        let currentSeed = s;
        for (let i = shuffled.length - 1; i > 0; i--) {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            const j = Math.floor((currentSeed / 233280) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Get 3 discussions and 10 expressions for the day
    const shuffledDiscussions = seededShuffle(discussionSnippets, seed);
    const shuffledExpressions = seededShuffle(everydayExpressions, seed);

    return {
        discussions: shuffledDiscussions.slice(0, 3),
        expressions: shuffledExpressions.slice(0, 10),
    };
}
