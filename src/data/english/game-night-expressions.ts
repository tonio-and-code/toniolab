/**
 * Game Night Expressions -- casual expressions from Game Night Gone Wrong scenario
 * Tracked separately from idiom list (no overlap with used-idioms.json)
 * 75 expressions across 5 days, all commonly used in spoken English
 * Characters: Marcus(29M), Jess(28F), Trent(28M), Nina(27F), Devon(30M), Priya(27F)
 */

export interface GameNightExpression {
    expression: string;
    meaning: string;
    meaningEn: string;
    day: number;
    speaker: string;
    example: string;
}

export const GAME_NIGHT_EXPRESSIONS: GameNightExpression[] = [
    // ============================================================
    // DAY 1 -- THE SETUP (15 expressions)
    // Arriving, food, catching up, performing normalcy
    // ============================================================
    { expression: "make yourself at home", meaning: "くつろいでね", meaningEn: "feel comfortable and relaxed, treat this place like your own", day: 1, speaker: "Marcus", example: "Hey come in, make yourself at home. Shoes off though, new rug." },
    { expression: "I brought a little something", meaning: "ちょっとしたもの持ってきた", meaningEn: "casually presenting a gift or food contribution", day: 1, speaker: "Jess", example: "I brought a little something. Banchan, obviously. My mom made extra." },
    { expression: "you didn't have to", meaning: "気を使わなくてよかったのに", meaningEn: "polite response when someone brings a gift or does something nice", day: 1, speaker: "Marcus", example: "Oh damn, you didn't have to. Wait, is that japchae?" },
    { expression: "long time no see", meaning: "久しぶり", meaningEn: "greeting someone you haven't seen in a while", day: 1, speaker: "Priya", example: "NINA! Long time no see! You look amazing, oh my God." },
    { expression: "what have you been up to", meaning: "最近何してんの", meaningEn: "asking someone about their recent activities or life", day: 1, speaker: "Marcus", example: "So what have you been up to? I feel like I haven't seen you since, like, March." },
    { expression: "same old same old", meaning: "相変わらずだよ", meaningEn: "nothing has changed, life is the same as usual", day: 1, speaker: "Trent", example: "What's new? Honestly, same old same old. Except I almost died, but yeah." },
    { expression: "you're being dramatic", meaning: "大げさすぎ", meaningEn: "accusing someone of exaggerating the situation", day: 1, speaker: "Nina", example: "You're being dramatic. It was a routine surgery." },
    { expression: "I literally almost died", meaning: "マジで死にかけた", meaningEn: "extreme exaggeration about a scary or dangerous experience", day: 1, speaker: "Trent", example: "Bruh, I literally almost died. My appendix was like THIS close to exploding." },
    { expression: "nobody asked for craft beer", meaning: "クラフトビールなんて誰も頼んでない", meaningEn: "rejecting someone's pretentious contribution nobody wanted", day: 1, speaker: "Jess", example: "Devon, nobody asked for craft beer. We have Bud Light like normal people." },
    { expression: "it's an acquired taste", meaning: "飲み慣れると美味しいんだよ", meaningEn: "something that takes time to appreciate, not immediately enjoyable", day: 1, speaker: "Devon", example: "It's an acquired taste. This one has notes of citrus and cedar." },
    { expression: "read the room", meaning: "空気読んで", meaningEn: "pay attention to the social atmosphere and act accordingly", day: 1, speaker: "Nina", example: "Devon. Read the room. Nobody wants a beer sommelier tonight." },
    { expression: "I'm just saying", meaning: "言ってるだけだって", meaningEn: "defending a comment after someone reacts negatively to it", day: 1, speaker: "Devon", example: "I'm just saying, a good IPA elevates any game night." },
    { expression: "can we not do this", meaning: "やめようこの話", meaningEn: "requesting to stop a conversation or argument before it starts", day: 1, speaker: "Marcus", example: "Can we not do this tonight? We literally just got here." },
    { expression: "I'm so down", meaning: "めっちゃやりたい", meaningEn: "enthusiastically willing and eager to participate", day: 1, speaker: "Priya", example: "Board games? I'm so down. What are we playing? I'll crush all of you." },
    { expression: "that's the energy we need", meaning: "そのテンション最高", meaningEn: "someone's enthusiasm is exactly what the group needs", day: 1, speaker: "Marcus", example: "See? That's the energy we need. Thank you, Priya." },

    // ============================================================
    // DAY 2 -- THE GAME STARTS (15 expressions)
    // Competitive streaks, rules arguments, trash talk
    // ============================================================
    { expression: "whose turn is it", meaning: "誰の番?", meaningEn: "asking which player should go next", day: 2, speaker: "Marcus", example: "Wait, whose turn is it? We've been arguing for five minutes." },
    { expression: "that's not how you play", meaning: "そのルールおかしいでしょ", meaningEn: "telling someone they're doing it wrong according to the rules", day: 2, speaker: "Devon", example: "That's not how you play. You can't trade on the same turn you build." },
    { expression: "show me where it says that", meaning: "どこに書いてあんの", meaningEn: "challenging someone to prove a rule exists", day: 2, speaker: "Jess", example: "Show me where it says that. Show me in the rulebook. I'll wait." },
    { expression: "it's right here in black and white", meaning: "ここにハッキリ書いてある", meaningEn: "pointing to written proof that something is clearly stated", day: 2, speaker: "Devon", example: "It's right here in black and white. Page seven, paragraph three." },
    { expression: "you're literally making that up", meaning: "今それ作ったでしょ", meaningEn: "accusing someone of inventing a rule on the spot", day: 2, speaker: "Trent", example: "Bruh, you're literally making that up. That rule does NOT exist." },
    { expression: "I'm just getting warmed up", meaning: "まだウォーミングアップだから", meaningEn: "I haven't even started playing seriously yet", day: 2, speaker: "Jess", example: "Three properties in two rounds? I'm just getting warmed up." },
    { expression: "that's lowkey cheating", meaning: "それ地味にズルじゃない?", meaningEn: "subtly accusing someone of bending the rules", day: 2, speaker: "Trent", example: "You moved seven spaces, not six. That's lowkey cheating." },
    { expression: "I counted twice", meaning: "2回数えたし", meaningEn: "defending accuracy by claiming you double-checked", day: 2, speaker: "Jess", example: "I counted twice. Seven. Don't come for me." },
    { expression: "this is getting heated", meaning: "だんだんやばくなってきた", meaningEn: "the situation is becoming tense or emotionally intense", day: 2, speaker: "Marcus", example: "Okay, this is getting heated. It's a board game, people." },
    { expression: "it's not that deep", meaning: "そこまで深い話じゃないでしょ", meaningEn: "it's not as serious or important as you're making it", day: 2, speaker: "Nina", example: "Devon, it's not that deep. It's fake money." },
    { expression: "I play to win", meaning: "やるからには勝つ", meaningEn: "declaring that you take competition seriously and won't hold back", day: 2, speaker: "Jess", example: "I don't do 'just for fun.' I play to win." },
    { expression: "noted", meaning: "了解(皮肉込み)", meaningEn: "sarcastic acknowledgment, implying you'll remember this", day: 2, speaker: "Nina", example: "Ah, Jess doesn't do fun. Noted." },
    { expression: "no cap", meaning: "嘘じゃなくマジで", meaningEn: "I'm being completely honest, no exaggeration", day: 2, speaker: "Trent", example: "No cap, I had the best hand. The dice just hated me." },
    { expression: "the dice are rigged", meaning: "サイコロ絶対おかしい", meaningEn: "blaming bad luck on the dice being unfair", day: 2, speaker: "Trent", example: "Four in a row? The dice are rigged. I'm switching dice." },
    { expression: "sore loser", meaning: "負けず嫌い", meaningEn: "someone who can't handle losing gracefully", day: 2, speaker: "Priya", example: "Don't be a sore loser, Trent. It's only round two." },

    // ============================================================
    // DAY 3 -- THE UNRAVELING (15 expressions)
    // Drinks flow, secrets surface, game becomes metaphor
    // ============================================================
    { expression: "who needs a refill", meaning: "おかわり欲しい人", meaningEn: "offering to get more drinks for the group", day: 3, speaker: "Marcus", example: "Alright, who needs a refill? I'm getting up anyway." },
    { expression: "I shouldn't but whatever", meaning: "ダメだけどまあいいか", meaningEn: "giving in to temptation despite knowing better", day: 3, speaker: "Priya", example: "I shouldn't but whatever. Pour me another. I'll run it off tomorrow." },
    { expression: "that's very on brand for you", meaning: "お前らしいわそれ", meaningEn: "someone's behavior is typical and unsurprising", day: 3, speaker: "Nina", example: "Counting calories at a party. That's very on brand for you, Priya." },
    { expression: "I'm just being honest", meaning: "正直に言ってるだけ", meaningEn: "defending a blunt or harsh comment as truthful", day: 3, speaker: "Jess", example: "I'm just being honest. Devon, you've been insufferable tonight." },
    { expression: "that was uncalled for", meaning: "それは言い過ぎ", meaningEn: "that comment was unnecessary and hurtful", day: 3, speaker: "Devon", example: "That was uncalled for. I've been perfectly pleasant." },
    { expression: "since when", meaning: "いつから?", meaningEn: "challenging someone's claim as new or surprising information", day: 3, speaker: "Trent", example: "You quit your job? Since when? Why didn't you tell us?" },
    { expression: "it's not a big deal", meaning: "大したことじゃないよ", meaningEn: "downplaying something to avoid further discussion", day: 3, speaker: "Nina", example: "It's not a big deal. I just... didn't want to make it a whole thing." },
    { expression: "that IS a big deal", meaning: "いや大したことだから", meaningEn: "insisting something is more important than the person admits", day: 3, speaker: "Priya", example: "Nina, that IS a big deal. You were there for six years." },
    { expression: "can we go back to the game", meaning: "ゲームに戻ろうよ", meaningEn: "trying to redirect attention away from an uncomfortable topic", day: 3, speaker: "Nina", example: "Cool, thanks for the concern. Can we go back to the game now?" },
    { expression: "you always deflect", meaning: "いつもはぐらかすよね", meaningEn: "accusing someone of consistently avoiding serious topics", day: 3, speaker: "Jess", example: "You always deflect. Every time something real comes up, you shut down." },
    { expression: "that's valid", meaning: "それはわかる・もっともだ", meaningEn: "acknowledging someone's feelings or point as legitimate", day: 3, speaker: "Marcus", example: "Okay, that's valid. She has a point though, Nina." },
    { expression: "I'm not drunk enough for this", meaning: "このノリに付き合うには酔いが足りない", meaningEn: "the conversation is too heavy for the current level of intoxication", day: 3, speaker: "Trent", example: "I'm not drunk enough for this. Are we doing therapy or Settlers of Catan?" },
    { expression: "actually, you know what", meaning: "ていうかさ", meaningEn: "pivoting to say something you've been holding back", day: 3, speaker: "Jess", example: "Actually, you know what, I've been wanting to say this for months." },
    { expression: "here we go", meaning: "出た、始まった", meaningEn: "resigned anticipation that something predictable is about to happen", day: 3, speaker: "Marcus", example: "Here we go. I knew this would happen." },
    { expression: "I'm dead", meaning: "もう無理(笑)", meaningEn: "figuratively dying from laughter, shock, or disbelief", day: 3, speaker: "Trent", example: "Jess just flipped the board. I'm dead." },

    // ============================================================
    // DAY 4 -- THE FIGHT (15 expressions)
    // Fight breaks out, real talk, vulnerability
    // ============================================================
    { expression: "that's not what I meant", meaning: "そういう意味じゃない", meaningEn: "clarifying that your words were misinterpreted", day: 4, speaker: "Jess", example: "That's not what I meant and you know it. Stop twisting my words." },
    { expression: "then what DID you mean", meaning: "じゃあどういう意味", meaningEn: "demanding clarification after someone claims to be misunderstood", day: 4, speaker: "Devon", example: "Then what DID you mean when you said I'm 'performing friendship'?" },
    { expression: "I think we all need to calm down", meaning: "みんな落ち着こう", meaningEn: "attempting to de-escalate a group argument", day: 4, speaker: "Marcus", example: "Hey. I think we all need to calm down. Nobody's the bad guy here." },
    { expression: "stay out of it", meaning: "口出さないで", meaningEn: "telling someone not to get involved in a conflict", day: 4, speaker: "Jess", example: "Marcus, stay out of it. Not everything needs a mediator." },
    { expression: "I'm so tired of being the middle guy", meaning: "間に入るの本当に疲れた", meaningEn: "exhaustion from always mediating others' conflicts", day: 4, speaker: "Marcus", example: "I'm so tired of being the middle guy. Every time. Every single time." },
    { expression: "nobody asked you to", meaning: "誰も頼んでないけど", meaningEn: "pointing out that someone's help was never requested", day: 4, speaker: "Nina", example: "Nobody asked you to, Marcus. You volunteer for it." },
    { expression: "that hit different", meaning: "今のは刺さった", meaningEn: "something affected you emotionally in a way you didn't expect", day: 4, speaker: "Marcus", example: "Okay. That hit different. Didn't know you felt that way." },
    { expression: "I didn't mean to go there", meaning: "そこまで言うつもりなかった", meaningEn: "apologizing for taking the conversation to an unintended place", day: 4, speaker: "Nina", example: "I didn't mean to go there. I'm sorry. That came out wrong." },
    { expression: "we never actually talk", meaning: "俺ら本当の話したことないよね", meaningEn: "acknowledging that conversations are always surface-level", day: 4, speaker: "Trent", example: "You know what's wild? We never actually talk. Like, real talk." },
    { expression: "what do you mean", meaning: "どういうこと", meaningEn: "asking someone to explain a surprising or confusing statement", day: 4, speaker: "Priya", example: "What do you mean we don't talk? We're literally always texting." },
    { expression: "texting isn't talking", meaning: "メールは会話じゃない", meaningEn: "distinguishing between real conversation and digital messaging", day: 4, speaker: "Trent", example: "Texting isn't talking. Sending memes isn't checking in." },
    { expression: "he's got a point", meaning: "一理ある", meaningEn: "conceding that someone's argument is valid", day: 4, speaker: "Jess", example: "I hate to say it but... he's got a point." },
    { expression: "I've been going through it", meaning: "最近キツかった", meaningEn: "experiencing a difficult period in life", day: 4, speaker: "Nina", example: "Honestly? I've been going through it. The job was the last straw." },
    { expression: "why didn't you say something", meaning: "なんで言ってくれなかったの", meaningEn: "expressing hurt that someone didn't share their struggles", day: 4, speaker: "Priya", example: "Nina, why didn't you say something? We would've been there." },
    { expression: "I didn't wanna be a burden", meaning: "迷惑かけたくなかった", meaningEn: "not wanting to trouble others with your problems", day: 4, speaker: "Nina", example: "I didn't wanna be a burden. Everyone's got their own stuff." },

    // ============================================================
    // DAY 5 -- THE MORNING AFTER (15 expressions)
    // Hangovers, honest conversation, reconnection
    // ============================================================
    { expression: "what time is it", meaning: "今何時", meaningEn: "disoriented question about the current time after waking up", day: 5, speaker: "Trent", example: "Bruh... what time is it. Why is the sun so aggressive." },
    { expression: "I feel like death", meaning: "死んだみたいにしんどい", meaningEn: "feeling extremely unwell, usually after drinking", day: 5, speaker: "Trent", example: "I feel like death. Who let me do shots on a Tuesday." },
    { expression: "whose idea was that", meaning: "誰のアイデアだよ", meaningEn: "blaming someone for a bad decision the group made", day: 5, speaker: "Marcus", example: "Tequila at midnight. Whose idea was that." },
    { expression: "I plead the fifth", meaning: "ノーコメントで", meaningEn: "refusing to answer to avoid self-incrimination (humorous)", day: 5, speaker: "Priya", example: "I plead the fifth. But also, you're welcome." },
    { expression: "do we need to talk about last night", meaning: "昨日の夜の話する?", meaningEn: "cautiously bringing up events from the previous evening", day: 5, speaker: "Marcus", example: "So... do we need to talk about last night? Or are we pretending." },
    { expression: "I said what I said", meaning: "言ったことは撤回しない", meaningEn: "standing by a statement without taking it back", day: 5, speaker: "Jess", example: "I said what I said. I meant it. But I could've said it nicer." },
    { expression: "fair enough", meaning: "まあそうだね", meaningEn: "conceding a point or accepting something as reasonable", day: 5, speaker: "Devon", example: "Fair enough. I can be... a lot. I know." },
    { expression: "that takes guts to admit", meaning: "それ認めるの勇気いるよね", meaningEn: "acknowledging someone's bravery in being honest", day: 5, speaker: "Priya", example: "Devon, that takes guts to admit. Respect." },
    { expression: "we're good, right", meaning: "俺ら大丈夫だよな?", meaningEn: "seeking confirmation that a relationship is still okay after conflict", day: 5, speaker: "Marcus", example: "Hey. We're good, right? Last night was... a lot." },
    { expression: "we're good", meaning: "大丈夫だよ", meaningEn: "confirming that the relationship is fine, no hard feelings", day: 5, speaker: "Nina", example: "Yeah, Marcus. We're good. I'm sorry too." },
    { expression: "I needed that honestly", meaning: "正直あれ必要だった", meaningEn: "admitting that a difficult experience was actually beneficial", day: 5, speaker: "Nina", example: "I needed that honestly. The blowup. All of it. I've been bottling stuff up." },
    { expression: "group hug or too soon", meaning: "ハグする?まだ早い?", meaningEn: "testing if the group is ready for a reconciliation gesture", day: 5, speaker: "Trent", example: "So... group hug or too soon? I'm emotional and hungover." },
    { expression: "don't make it weird", meaning: "変な空気にしないで", meaningEn: "asking someone not to make a moment awkward", day: 5, speaker: "Jess", example: "Okay fine, bring it in. But don't make it weird." },
    { expression: "same time next month", meaning: "来月も同じ時間で", meaningEn: "proposing to make the gathering a regular occurrence", day: 5, speaker: "Marcus", example: "Same time next month? And maybe less tequila." },
    { expression: "no promises", meaning: "約束はしない", meaningEn: "playfully refusing to commit to a condition", day: 5, speaker: "Priya", example: "Same time next month, sure. No promises on the tequila though." },
];

export const GAME_NIGHT_EXPRESSIONS_PER_DAY = 15;
export const TOTAL_GAME_NIGHT_EXPRESSIONS = GAME_NIGHT_EXPRESSIONS.length;

export const GAME_NIGHT_DAY_IDS: Record<number, string> = {
    1: 'gamenight-day1',
    2: 'gamenight-day2',
    3: 'gamenight-day3',
    4: 'gamenight-day4',
    5: 'gamenight-day5',
};

/**
 * Find the conversation line index where an expression is spoken by its speaker.
 * Returns the array index or -1 if not found.
 */
export function findGameNightExpressionLineIndex(
    expression: string,
    speaker: string,
    conversationLines: Array<{ speaker: string; text: string }>
): number {
    const exprLower = expression.toLowerCase();
    return conversationLines.findIndex(line => {
        const textLower = line.text.toLowerCase();
        return textLower.includes(exprLower) && textLower.startsWith(`${speaker.toLowerCase()}:`);
    });
}
