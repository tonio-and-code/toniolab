/**
 * Party Expressions -- slang and casual expressions from College Party Recap
 * Tracked separately from idiom list (no overlap with used-idioms.json)
 * 75 expressions across 5 days, all commonly used in spoken English
 */

export interface PartyExpression {
    expression: string;
    meaning: string;
    meaningEn: string;
    day: number;
    speaker: string;
    example: string;
}

export const PARTY_EXPRESSIONS: PartyExpression[] = [
    // ============================================================
    // DAY 1 -- THE SETUP (15 expressions)
    // ============================================================
    { expression: "pull up", meaning: "来る・到着する", meaningEn: "arrive, show up", day: 1, speaker: "Tyler", example: "When's everyone supposed to pull up?" },
    { expression: "lowkey", meaning: "ちょっと・密かに", meaningEn: "subtly, secretly, a little bit", day: 1, speaker: "Tyler", example: "I'm lowkey freakin' out." },
    { expression: "no cap", meaning: "マジで・嘘じゃなく", meaningEn: "honestly, no lie, for real", day: 1, speaker: "Brandon", example: "In girl language that means yes. No cap." },
    { expression: "that tracks", meaning: "それ納得・辻褄が合う", meaningEn: "that makes sense, that checks out", day: 1, speaker: "Tyler", example: "That tracks, I guess." },
    { expression: "chill", meaning: "落ち着け / リラックスした", meaningEn: "relax / relaxed, cool", day: 1, speaker: "Brandon", example: "Just chill." },
    { expression: "the vibe", meaning: "雰囲気・ムード", meaningEn: "the atmosphere, the mood, the energy", day: 1, speaker: "Rosa", example: "What's the vibe tonight?" },
    { expression: "for real", meaning: "マジで・本当に", meaningEn: "seriously, truly", day: 1, speaker: "Brandon", example: "It's hard to say, for real." },
    { expression: "my bad", meaning: "ごめん・俺のミス", meaningEn: "my mistake, sorry", day: 1, speaker: "Brandon", example: "My bad, my bad!" },
    { expression: "fire", meaning: "最高・ヤバい(良い意味)", meaningEn: "amazing, excellent, awesome", day: 1, speaker: "Brandon", example: "It's gonna be fire, trust me." },
    { expression: "the move", meaning: "正解・いい選択", meaningEn: "the right choice, the smart play", day: 1, speaker: "Brandon", example: "Matcha Kit Kats? That's the move right there." },
    { expression: "stoked", meaning: "超楽しみ・ワクワク", meaningEn: "very excited, pumped", day: 1, speaker: "Brandon", example: "I'm stoked." },
    { expression: "sus", meaning: "怪しい・胡散臭い", meaningEn: "suspicious, sketchy", day: 1, speaker: "Kenji", example: "English slang is kinda sus sometimes." },
    { expression: "bet", meaning: "了解・いいよ", meaningEn: "OK, for sure, you got it", day: 1, speaker: "Brandon", example: "Bet. Just throw everything on the counter." },
    { expression: "I'm down", meaning: "いいよ・賛成", meaningEn: "I agree, I'm OK with that, count me in", day: 1, speaker: "Rosa", example: "I'm down with that." },
    { expression: "pregame", meaning: "本番前に飲む", meaningEn: "drink before the main event", day: 1, speaker: "Brandon", example: "Pregame starts NOW, baby." },

    // ============================================================
    // DAY 2 -- IT'S GOING DOWN (15 expressions)
    // ============================================================
    { expression: "lit", meaning: "盛り上がってる・最高", meaningEn: "exciting, fun, amazing (event/vibe)", day: 2, speaker: "Derek", example: "Tonight's set is gonna be lit." },
    { expression: "main character energy", meaning: "主人公オーラ・目立つ存在感", meaningEn: "acting like the center of attention, protagonist vibes", day: 2, speaker: "Zoe", example: "Main character energy tonight." },
    { expression: "buzzkill", meaning: "盛り下げる人・しらける行為", meaningEn: "someone/something that ruins the fun", day: 2, speaker: "Brandon", example: "Stop bein' a buzzkill." },
    { expression: "from scratch", meaning: "ゼロから・手作りで", meaningEn: "from basic ingredients, from nothing", day: 2, speaker: "Tyler", example: "I made it from scratch." },
    { expression: "whatevs", meaning: "別にどうでもいい", meaningEn: "whatever (casual dismissal)", day: 2, speaker: "Tyler", example: "It's whatevs." },
    { expression: "hits different", meaning: "特別に感じる・格別", meaningEn: "has a unique or special impact", day: 2, speaker: "Kenji", example: "This hits different, honestly." },
    { expression: "feelin' it", meaning: "ノッてきた・楽しくなってきた", meaningEn: "getting into it, enjoying it", day: 2, speaker: "Megan", example: "I'm kinda feelin' it." },
    { expression: "salty", meaning: "イラついてる・ムカついてる", meaningEn: "bitter, resentful, annoyed", day: 2, speaker: "Jake", example: "Salty much?" },
    { expression: "curated", meaning: "厳選された(皮肉込み)", meaningEn: "carefully selected (often pretentious)", day: 2, speaker: "Derek", example: "I'm not salty, I'm curated." },
    { expression: "slay", meaning: "最高にキマる・圧勝する", meaningEn: "do amazingly well, kill it", day: 2, speaker: "Zoe", example: "This is gonna slay on TikTok." },
    { expression: "content", meaning: "コンテンツ(SNS素材)", meaningEn: "social media material (used as slang)", day: 2, speaker: "Tyler", example: "That's not content, that's property damage." },
    { expression: "a whole thing", meaning: "大事になる・面倒なことになる", meaningEn: "a big deal, a dramatic/chaotic situation", day: 2, speaker: "Rosa", example: "Tonight's gonna be a whole thing." },
    { expression: "rent-free", meaning: "頭から離れない", meaningEn: "living in someone's thoughts constantly", day: 2, speaker: "Brandon", example: "He's been thinkin' about you comin' rent-free for two weeks." },
    { expression: "go viral", meaning: "バズる・拡散する", meaningEn: "spread rapidly on the internet", day: 2, speaker: "Zoe", example: "You're gonna go viral, Tyler." },
    { expression: "catch feelings", meaning: "好きになっちゃう・恋に落ちる", meaningEn: "develop romantic feelings", day: 2, speaker: "Alyssa", example: "Is he about to catch feelings on camera?" },

    // ============================================================
    // DAY 3 -- PEAK HOURS (15 expressions)
    // ============================================================
    { expression: "wild", meaning: "ヤバい・信じられない", meaningEn: "crazy, unbelievable", day: 3, speaker: "Jake", example: "Yo that was wild." },
    { expression: "pop a vein", meaning: "ブチ切れる・キレそう", meaningEn: "get extremely angry", day: 3, speaker: "Jake", example: "He looked like he was about to pop a vein." },
    { expression: "live a little", meaning: "もっと楽しめよ", meaningEn: "loosen up, enjoy yourself more", day: 3, speaker: "Brandon", example: "Live a little, Prof!" },
    { expression: "tea", meaning: "ゴシップ・噂話", meaningEn: "gossip, juicy information", day: 3, speaker: "Zoe", example: "OK, tea time." },
    { expression: "rom-com", meaning: "ラブコメ", meaningEn: "romantic comedy (abbreviation)", day: 3, speaker: "Zoe", example: "That's not talkin'. That's a whole rom-com." },
    { expression: "read the room", meaning: "空気を読め", meaningEn: "understand the social situation", day: 3, speaker: "Rosa", example: "Read the room, people -- don't interrupt them." },
    { expression: "clutch", meaning: "ナイスタイミング・決定的", meaningEn: "perfectly timed, impressive in a key moment", day: 3, speaker: "Derek", example: "That transition was clutch." },
    { expression: "mid", meaning: "普通・微妙・大したことない", meaningEn: "mediocre, average, nothing special", day: 3, speaker: "Jake", example: "Mid. Average at best." },
    { expression: "pressed", meaning: "イライラしてる・気にしてる", meaningEn: "bothered, upset, worked up about something", day: 3, speaker: "Derek", example: "You are SO pressed right now." },
    { expression: "extra", meaning: "大げさ・やりすぎ", meaningEn: "over the top, dramatic, too much", day: 3, speaker: "Rosa", example: "You're BOTH bein' extra right now." },
    { expression: "fresh meat", meaning: "新人・カモ", meaningEn: "newcomer, easy target (playful)", day: 3, speaker: "Brandon", example: "Fresh meat. You're on my team." },
    { expression: "valid", meaning: "納得・それアリ", meaningEn: "legitimate, acceptable, fair point", day: 3, speaker: "Zoe", example: "This is valid content." },
    { expression: "drag", meaning: "こき下ろす・ディスる", meaningEn: "criticize harshly, roast someone", day: 3, speaker: "Zoe", example: "Don't drag me, Derek." },
    { expression: "dead", meaning: "爆笑・ウケる", meaningEn: "so funny I'm dying (exaggeration)", day: 3, speaker: "Megan", example: "I'm literally dead, that was so intense!" },
    { expression: "no cap (emphasis)", meaning: "ガチで(強調)", meaningEn: "truly, honestly (emphatic confirmation)", day: 3, speaker: "Alyssa", example: "Best night I've had all semester. No cap." },

    // ============================================================
    // DAY 4 -- AFTER MIDNIGHT (15 expressions)
    // ============================================================
    { expression: "crashin'", meaning: "泊まる・寝落ちする", meaningEn: "staying over, sleeping at someone's place", day: 4, speaker: "Jake", example: "I'm crashin' here." },
    { expression: "it's not that deep", meaning: "そんな大げさなことじゃない", meaningEn: "don't overthink it, it's not serious", day: 4, speaker: "Brandon", example: "Let him crash. It's not that deep." },
    { expression: "unhinged", meaning: "ぶっ飛んでる・カオス", meaningEn: "wildly chaotic, crazy (often positive)", day: 4, speaker: "Kenji", example: "American parties are unhinged." },
    { expression: "through the roof", meaning: "天井知らず・爆上がり", meaningEn: "extremely high, skyrocketing", day: 4, speaker: "Zoe", example: "Engagement's through the roof." },
    { expression: "say less", meaning: "了解・わかった", meaningEn: "I understand, enough said, got it", day: 4, speaker: "Zoe", example: "Say less." },
    { expression: "babe", meaning: "あなた(親しい呼びかけ)", meaningEn: "casual term of address (not always romantic)", day: 4, speaker: "Zoe", example: "Babe. Every angle is a good angle." },
    { expression: "went off", meaning: "キマった・最高だった", meaningEn: "performed amazingly, killed it", day: 4, speaker: "Derek", example: "I went off and I don't care what Jake says." },
    { expression: "aight", meaning: "まあまあ・OK", meaningEn: "alright, OK (casual pronunciation)", day: 4, speaker: "Jake", example: "It was aight. Six outta ten." },
    { expression: "felt that", meaning: "わかる・共感", meaningEn: "I relate, I understand that feeling", day: 4, speaker: "Tyler", example: "Felt that. I mean-- I had a good time too." },
    { expression: "highkey", meaning: "明らかに・めっちゃ", meaningEn: "obviously, openly (opposite of lowkey)", day: 4, speaker: "Alyssa", example: "Highkey charming, actually." },
    { expression: "I'm weak", meaning: "ウケる・笑いすぎ", meaningEn: "that's so funny I can't handle it", day: 4, speaker: "Brandon", example: "I'm weak. This is the BEST NIGHT EVER." },
    { expression: "big W", meaning: "大勝利", meaningEn: "big win, major success", day: 4, speaker: "Brandon", example: "Big W tonight, Tyler. Huge." },
    { expression: "cringe", meaning: "痛い・恥ずかしい", meaningEn: "embarrassingly awkward", day: 4, speaker: "Megan", example: "Is that cringe?" },
    { expression: "nah fr", meaning: "いやマジで", meaningEn: "no, for real / seriously though", day: 4, speaker: "Kenji", example: "Next time I'll bring more snacks. Nah fr." },
    { expression: "sweet", meaning: "優しい・いい人", meaningEn: "kind, nice, thoughtful", day: 4, speaker: "Alyssa", example: "YOU'RE sweet. Don't make it weird." },

    // ============================================================
    // DAY 5 -- THE MORNING AFTER (15 expressions)
    // ============================================================
    { expression: "wrecked", meaning: "ボロボロ・めちゃくちゃ", meaningEn: "destroyed, messed up, ruined", day: 5, speaker: "Brandon", example: "The apartment is WRECKED." },
    { expression: "an L", meaning: "負け・失敗", meaningEn: "a loss, a failure", day: 5, speaker: "Brandon", example: "That's an L. We might need a new lamp." },
    { expression: "brunch", meaning: "ブランチ(朝昼兼用)", meaningEn: "breakfast + lunch combined meal", day: 5, speaker: "Kenji", example: "I just discovered the concept of 'brunch.'" },
    { expression: "based", meaning: "かっこいい・信念がある", meaningEn: "admirable, agreeable, unapologetically yourself", day: 5, speaker: "Kenji", example: "I respect that. Based." },
    { expression: "ratio'd", meaning: "返しの方がバズった", meaningEn: "got more engagement/likes than the original", day: 5, speaker: "Zoe", example: "You just got ratio'd, Derek." },
    { expression: "iconic", meaning: "伝説的・最高すぎる", meaningEn: "legendary, unforgettable, amazing", day: 5, speaker: "Brandon", example: "ICONIC." },
    { expression: "era", meaning: "時代・フェーズ", meaningEn: "a defining period or phase (slang usage)", day: 5, speaker: "Brandon", example: "The Tyler and Alyssa era." },
    { expression: "stan", meaning: "熱狂的ファン・推す", meaningEn: "be a devoted fan of, strongly support", day: 5, speaker: "Brandon", example: "I stan." },
    { expression: "understood the assignment", meaning: "完璧にやり遂げた", meaningEn: "nailed it, did exactly what was needed", day: 5, speaker: "Brandon", example: "I understood the assignment." },
    { expression: "bussin", meaning: "最高に美味い・ヤバい", meaningEn: "amazing, excellent (originally about food)", day: 5, speaker: "Jake", example: "My head is bussin'. Wait, is that how you use that word?" },
    { expression: "the W", meaning: "勝利", meaningEn: "the win, the victory", day: 5, speaker: "Zoe", example: "This is the W that keeps on givin'." },
    { expression: "premium content", meaning: "最高級コンテンツ", meaningEn: "high-quality social media material", day: 5, speaker: "Zoe", example: "Premium content." },
    { expression: "code", meaning: "暗号・隠れた意味", meaningEn: "hidden meaning, a signal", day: 5, speaker: "Brandon", example: "THAT'S CODE. THAT'S LITERALLY CODE." },
    { expression: "a whole era", meaning: "一大フェーズ・大事件化", meaningEn: "making something into a big defining thing", day: 5, speaker: "Tyler", example: "Can we not make a whole era out of this?" },
    { expression: "bruh", meaning: "おい・マジか", meaningEn: "expression of disbelief or exasperation", day: 5, speaker: "Jake", example: "Bruh. Who took my jacket?" },
];

export const TOTAL_EXPRESSIONS = PARTY_EXPRESSIONS.length;
export const EXPRESSIONS_PER_DAY = 15;

export const PARTY_DAY_IDS: Record<number, string> = {
    1: 'party-day1',
    2: 'party-day2',
    3: 'party-day3',
    4: 'party-day4',
    5: 'party-day5',
};

/**
 * Find the conversation line index where an expression is spoken by its speaker.
 * Returns the array index or -1 if not found.
 */
export function findExpressionLineIndex(
    expression: string,
    speaker: string,
    conversationLines: Array<{ speaker: string; text: string }>
): number {
    const exprLower = expression.toLowerCase();
    return conversationLines.findIndex(line => {
        const textLower = line.text.toLowerCase();
        // Check the line contains the expression and is spoken by the matching character
        return textLower.includes(exprLower) && textLower.startsWith(`${speaker.toLowerCase()}:`);
    });
}
