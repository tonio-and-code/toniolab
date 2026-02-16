/**
 * Daily English - 日付ベースで追加していくコンテンツ
 *
 * 毎日追加:
 * 1. Discussion - ニュース/トピックについての会話
 * 2. Expressions - 日常で使える表現
 */

export interface DailyDiscussion {
    topic: string;
    topicJa: string;
    lines: { speaker: 'A' | 'B'; text: string }[];
    keyPhrases: { en: string; ja: string }[];
}

export interface DailyExpression {
    english: string;
    japanese: string;
    situation?: string;
}

export interface DailyContent {
    date: string;
    discussion: DailyDiscussion;
    expressions: DailyExpression[];
}

export const dailyEnglishContent: DailyContent[] = [
    // ===== 2026-01-16 =====
    {
        date: '2026-01-16',
        discussion: {
            topic: 'The 1% Carbon Problem',
            topicJa: '富裕層1%の炭素問題',
            lines: [
                { speaker: 'A', text: "Did you see that Oxfam report? The richest 1% used up their whole year's carbon budget in just ten days." },
                { speaker: 'B', text: "Ten days? That's insane. And we're over here worrying about our plastic bags." },
                { speaker: 'A', text: "Yeah, what really stood out to me was the investment side. Almost two million tons per billionaire, just from where they put their money." },
                { speaker: 'B', text: "Right, it's not even about their lifestyle. It's the companies they fund." },
                { speaker: 'A', text: "It makes you wonder, what's the point of individual action when the system is this broken?" },
                { speaker: 'B', text: "I get that feeling. But I still think individual action matters. It's just not enough on its own." },
                { speaker: 'A', text: "So what would actually make a difference? Taxing private jets?" },
                { speaker: 'B', text: "That'd be a start. If you can afford a private jet, you can afford to pay for the damage." },
                { speaker: 'A', text: "Fair point. But good luck getting that through any legislature." },
                { speaker: 'B', text: "Yeah, that's the thing though. The people making the rules benefit from keeping things the way they are." },
            ],
            keyPhrases: [
                { en: "that's insane", ja: "ありえない、信じられない" },
                { en: "what really stood out to me", ja: "特に印象に残ったのは" },
                { en: "it makes you wonder", ja: "考えさせられる" },
                { en: "it's not enough on its own", ja: "それだけでは不十分" },
                { en: "that'd be a start", ja: "それはいいスタートだね" },
                { en: "fair point", ja: "確かにそうだね" },
                { en: "that's the thing though", ja: "でもそこが問題で" },
            ],
        },
        expressions: [
            { english: "That's a good point.", japanese: "それはいいポイントだね。", situation: "agreeing" },
            { english: "I see what you mean, but...", japanese: "言いたいことはわかるけど...", situation: "partial disagreement" },
            { english: "The way I see it...", japanese: "私の見方では...", situation: "giving opinion" },
            { english: "There's some truth to that.", japanese: "一理あるね。", situation: "partial agreement" },
            { english: "At the end of the day...", japanese: "結局のところ...", situation: "concluding" },
            { english: "It depends, I guess.", japanese: "場合によるかな。", situation: "hedging" },
            { english: "That's the thing though.", japanese: "でもそこが問題で。", situation: "counterpoint" },
            { english: "Fair enough.", japanese: "まあそうだね。", situation: "accepting" },
            { english: "I hadn't thought of it that way.", japanese: "そういう見方はしてなかった。", situation: "reconsidering" },
            { english: "You've got a point there.", japanese: "それは一理あるね。", situation: "acknowledging" },
        ],
    },

    // ===== 2026-01-17 =====
    {
        date: '2026-01-17',
        discussion: {
            topic: 'The Art of Surrender',
            topicJa: '手放すということ',
            lines: [
                { speaker: 'A', text: "I've been thinking about this idea of surrender lately. Like, truly accepting whatever is happening." },
                { speaker: 'B', text: "What do you mean by surrender? That sounds kind of passive." },
                { speaker: 'A', text: "Not passive. More like... not fighting reality. We easily accept happy moments, right? That's not even called surrender." },
                { speaker: 'B', text: "True. Nobody struggles to accept a good time." },
                { speaker: 'A', text: "But here's what got me — even in happy moments, there's resistance. When you think, 'I don't want this to end.'" },
                { speaker: 'B', text: "Oh, that's interesting. So the fear of losing happiness is itself a kind of suffering?" },
                { speaker: 'A', text: "Exactly. And that's when you need to surrender too. Accept that you're clinging, accept the fear." },
                { speaker: 'B', text: "So it's surrender all the way down. Not just to bad moments, but to everything — including your own resistance." },
                { speaker: 'A', text: "Right. The resistance is just another thing to accept. Not fight it, not judge it. Just let it be there." },
                { speaker: 'B', text: "That's harder than it sounds. We're so wired to hold on." },
                { speaker: 'A', text: "It is hard. But I think the alternative is worse. Constantly bracing against life." },
                { speaker: 'B', text: "Yeah, that's exhausting. Always trying to control what can't be controlled." },
            ],
            keyPhrases: [
                { en: "I've been thinking about", ja: "最近〜について考えていた" },
                { en: "here's what got me", ja: "気づいたのは" },
                { en: "all the way down", ja: "徹底的に、どこまでも" },
                { en: "we're wired to", ja: "〜するようにできている" },
                { en: "the alternative is worse", ja: "そうしないともっと悪い" },
                { en: "bracing against", ja: "〜に身構える" },
            ],
        },
        expressions: [
            { english: "Let it be.", japanese: "そのままにしておく。", situation: "acceptance" },
            { english: "It is what it is.", japanese: "それが現実だから。", situation: "acceptance" },
            { english: "I'm trying not to fight it.", japanese: "抵抗しないようにしてる。", situation: "acceptance" },
            { english: "That's easier said than done.", japanese: "言うは易く行うは難し。", situation: "acknowledging difficulty" },
            { english: "I never thought of it that way.", japanese: "そういう考え方したことなかった。", situation: "new perspective" },
            { english: "You've got a point.", japanese: "一理あるね。", situation: "agreeing" },
            { english: "I'm still working on that.", japanese: "まだ練習中。", situation: "self-improvement" },
            { english: "That really resonates with me.", japanese: "すごく共感する。", situation: "agreeing deeply" },
            { english: "I catch myself doing that.", japanese: "気づいたら自分もそうしてる。", situation: "self-awareness" },
            { english: "It's a work in progress.", japanese: "まだ途中の段階。", situation: "ongoing effort" },
        ],
    },

    // ===== 2026-01-18 =====
    {
        date: '2026-01-18',
        discussion: {
            topic: 'Facing Your Core Suffering',
            topicJa: '一番の苦しみと向き合う',
            lines: [
                { speaker: 'A', text: "I read somewhere that real growth comes from facing your deepest suffering. Not avoiding it." },
                { speaker: 'B', text: "What kind of suffering are we talking about?" },
                { speaker: 'A', text: "The core stuff. Fear, anger, shame. The things we carry around all day but pretend aren't there." },
                { speaker: 'B', text: "That's heavy. Most people spend their whole lives running from those." },
                { speaker: 'A', text: "Exactly. We distract ourselves — work, phones, Netflix, whatever. Anything to not feel it." },
                { speaker: 'B', text: "But you're saying we should sit with it instead? Like, 24/7?" },
                { speaker: 'A', text: "Not forcing it, but not running either. When fear comes up, you don't push it away. You just... be with it." },
                { speaker: 'B', text: "That sounds unbearable honestly." },
                { speaker: 'A', text: "At first, yeah. But here's the thing — the running is more exhausting than the facing." },
                { speaker: 'B', text: "I guess we never actually escape it anyway. It's always there in the background." },
                { speaker: 'A', text: "Right. Shame doesn't disappear because you ignore it. It just drives you from underneath." },
                { speaker: 'B', text: "So facing it is the only way through. Not around, but through." },
            ],
            keyPhrases: [
                { en: "the core stuff", ja: "根本的なもの、核心" },
                { en: "carry around", ja: "抱えて歩く" },
                { en: "sit with it", ja: "それと共にいる、向き合う" },
                { en: "push it away", ja: "押しのける、避ける" },
                { en: "drives you from underneath", ja: "深層から突き動かす" },
                { en: "the only way through", ja: "乗り越える唯一の方法" },
            ],
        },
        expressions: [
            { english: "I've been avoiding this.", japanese: "ずっと避けてきた。", situation: "self-awareness" },
            { english: "It's always there in the background.", japanese: "いつも心の奥にある。", situation: "acknowledging" },
            { english: "I don't want to face it.", japanese: "向き合いたくない。", situation: "honesty" },
            { english: "That hits close to home.", japanese: "それ、身に覚えがある。", situation: "relating" },
            { english: "I've been running from this.", japanese: "ずっとこれから逃げてた。", situation: "realization" },
            { english: "It's hard to admit.", japanese: "認めるのが難しい。", situation: "vulnerability" },
            { english: "I feel it in my chest.", japanese: "胸のあたりで感じる。", situation: "physical sensation" },
            { english: "There's no way around it.", japanese: "避けて通れない。", situation: "acceptance" },
            { english: "I'm tired of pretending.", japanese: "ふりをするのに疲れた。", situation: "honesty" },
            { english: "This is uncomfortable but necessary.", japanese: "辛いけど必要なこと。", situation: "acceptance" },
        ],
    },

    // ===== 2026-01-19 =====
    {
        date: '2026-01-19',
        discussion: {
            topic: 'Hope as a Trap',
            topicJa: '希望という罠',
            lines: [
                { speaker: 'A', text: "I've been thinking about hope. Not as something positive, but maybe as a trap." },
                { speaker: 'B', text: "Hope as a trap? That sounds backwards." },
                { speaker: 'A', text: "Think about it. Hope keeps you running toward a future that never arrives. At least despair is honest about having given up." },
                { speaker: 'B', text: "That's dark. But I see what you mean." },
                { speaker: 'A', text: "'This too shall pass' — everyone says it like it's comforting. But the relief also passes. Everything passes." },
                { speaker: 'B', text: "So there's no solid ground anywhere?" },
                { speaker: 'A', text: "None. And hoping for solid ground might be the trap itself." },
                { speaker: 'B', text: "But without hope, what keeps people going?" },
                { speaker: 'A', text: "Maybe that's the wrong question. Maybe going somewhere isn't the point." },
                { speaker: 'B', text: "Just being here, wherever here is?" },
                { speaker: 'A', text: "Something like that. Not running toward or away from anything." },
                { speaker: 'B', text: "That sounds peaceful. And also kind of terrifying." },
            ],
            keyPhrases: [
                { en: "that sounds backwards", ja: "逆じゃない？" },
                { en: "at least despair is honest", ja: "少なくとも絶望は正直だ" },
                { en: "this too shall pass", ja: "これも過ぎ去る" },
                { en: "solid ground", ja: "確かな足場" },
                { en: "that's the wrong question", ja: "それは間違った問いだ" },
                { en: "kind of terrifying", ja: "ちょっと怖い" },
            ],
        },
        expressions: [
            { english: "This too shall pass.", japanese: "これも過ぎ去る。", situation: "acceptance" },
            { english: "There's no solid ground.", japanese: "確かな足場がない。", situation: "realization" },
            { english: "I'm not sure that's the right question.", japanese: "それが正しい問いかわからない。", situation: "questioning" },
            { english: "That's one way to look at it.", japanese: "そういう見方もあるね。", situation: "acknowledging" },
            { english: "I never thought about it that way.", japanese: "そう考えたことなかった。", situation: "new perspective" },
            { english: "That changes everything.", japanese: "それで全部変わるね。", situation: "realization" },
            { english: "I'm still processing that.", japanese: "まだ消化中。", situation: "thinking" },
            { english: "That's a lot to take in.", japanese: "受け止めるのが大変。", situation: "overwhelmed" },
            { english: "You've given me something to think about.", japanese: "考えさせられた。", situation: "reflection" },
            { english: "I need to sit with that.", japanese: "それについてじっくり考えたい。", situation: "contemplation" },
        ],
    },

    // ===== 2026-01-20 =====
    {
        date: '2026-01-20',
        discussion: {
            topic: 'Who Is Suffering?',
            topicJa: '苦しんでいるのは誰？',
            lines: [
                { speaker: 'A', text: "There's this story about Ramana Maharshi. Someone asked him why he doesn't go out and change the world." },
                { speaker: 'B', text: "What did he say?" },
                { speaker: 'A', text: "He just asked back: 'Who is suffering?'" },
                { speaker: 'B', text: "That's it? That's the whole answer?" },
                { speaker: 'A', text: "That's it. Not 'suffering is an illusion.' Just a question. Can you find the one who suffers?" },
                { speaker: 'B', text: "That's a strange way to answer." },
                { speaker: 'A', text: "At sixteen, he had a spontaneous experience of dying. Went through the whole thing psychologically, without actually dying." },
                { speaker: 'B', text: "And that changed him permanently?" },
                { speaker: 'A', text: "Apparently. No years of practice. He just faced death directly, once." },
                { speaker: 'B', text: "Most people spend their whole lives running from death." },
                { speaker: 'A', text: "Exactly. He stopped running. That might be the whole difference." },
                { speaker: 'B', text: "So the question 'who is suffering' is about looking for who's doing the running?" },
            ],
            keyPhrases: [
                { en: "change the world", ja: "世界を変える" },
                { en: "that's the whole answer", ja: "それが答えの全て" },
                { en: "a strange way to answer", ja: "変わった答え方" },
                { en: "spontaneous experience", ja: "自発的な体験" },
                { en: "without actually dying", ja: "実際には死なずに" },
                { en: "that might be the whole difference", ja: "それが唯一の違いかも" },
            ],
        },
        expressions: [
            { english: "Who is suffering?", japanese: "苦しんでいるのは誰？", situation: "inquiry" },
            { english: "Can you find the one who...?", japanese: "〜している人を見つけられる？", situation: "questioning" },
            { english: "That changed everything.", japanese: "それで全部変わった。", situation: "transformation" },
            { english: "Most people spend their whole lives...", japanese: "ほとんどの人は一生を〜に費やす", situation: "observation" },
            { english: "He stopped running.", japanese: "彼は逃げるのをやめた。", situation: "realization" },
            { english: "That's a good question.", japanese: "いい質問だね。", situation: "acknowledging" },
            { english: "I never looked at it that way.", japanese: "そういう見方はしてなかった。", situation: "new perspective" },
            { english: "Something shifted.", japanese: "何かが変わった。", situation: "change" },
            { english: "The question itself is the answer.", japanese: "問い自体が答え。", situation: "insight" },
            { english: "That's worth thinking about.", japanese: "考える価値がある。", situation: "reflection" },
        ],
    },

    // ===== 追加はここから =====
];

// Helper: 日付でコンテンツを取得
export function getDailyContent(date: string): DailyContent | null {
    return dailyEnglishContent.find(c => c.date === date) || null;
}

// Helper: 全ての日付を取得（新しい順）
export function getAllDates(): string[] {
    return dailyEnglishContent
        .map(c => c.date)
        .sort((a, b) => b.localeCompare(a));
}

// Helper: 最新のコンテンツを取得
export function getLatestContent(): DailyContent | null {
    const dates = getAllDates();
    return dates.length > 0 ? getDailyContent(dates[0]) : null;
}
