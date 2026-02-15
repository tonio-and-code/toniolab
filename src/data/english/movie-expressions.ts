/**
 * Movie Expressions -- casual expressions from First Movie Without Parents scenario
 * Tracked separately from idiom list (no overlap with used-idioms.json)
 * 75 expressions across 5 days, all commonly used in spoken English
 * Characters: Jayden(12M), Maddie(12F), Tyler C.(12M), Ava(12F), Benji(11M),
 *             Mrs. Chen(42F), Marcus(17M), Old Man Gus(70M)
 */

export interface MovieExpression {
    expression: string;
    meaning: string;
    meaningEn: string;
    day: number;
    speaker: string;
    example: string;
}

export const MOVIE_EXPRESSIONS: MovieExpression[] = [
    // ============================================================
    // DAY 1 -- THE ARRIVAL (15 expressions)
    // Getting dropped off, buying tickets, freedom hits
    // ============================================================
    { expression: "I'm so done", meaning: "もう限界・もうムリ", meaningEn: "fed up, can't take anymore of something", day: 1, speaker: "Maddie", example: "I'm so done with my mom texting me every two seconds." },
    { expression: "this is gonna slap", meaning: "これ絶対最高だわ", meaningEn: "this is going to be amazing, really good", day: 1, speaker: "Jayden", example: "Dude, this is gonna slap. No parents, big screen, let's go." },
    { expression: "she's blowing up my phone", meaning: "めっちゃ連絡来てる", meaningEn: "someone is sending many messages or calls nonstop", day: 1, speaker: "Maddie", example: "She's blowing up my phone and we literally JUST got here." },
    { expression: "act natural", meaning: "自然にしてて", meaningEn: "behave normally so no one suspects anything", day: 1, speaker: "Jayden", example: "Act natural. If we look lost they'll think we're here alone." },
    { expression: "that's cap", meaning: "嘘でしょ・ありえない", meaningEn: "that's a lie, that's not true", day: 1, speaker: "Tyler C.", example: "You said you'd buy your own popcorn. That's cap." },
    { expression: "I literally cannot", meaning: "マジで無理なんだけど", meaningEn: "I'm overwhelmed and can't handle this situation", day: 1, speaker: "Maddie", example: "She wants a photo of the exit signs. I literally cannot." },
    { expression: "you good?", meaning: "大丈夫?", meaningEn: "are you OK? is everything alright?", day: 1, speaker: "Jayden", example: "Maddie, you good? You look like you're gonna pass out." },
    { expression: "in my day", meaning: "俺の時代にはな", meaningEn: "when I was young (nostalgic old person opener)", day: 1, speaker: "Old Man Gus", example: "In my day, we didn't need assigned seats. You just sat down." },
    { expression: "I'm not even playing", meaning: "冗談じゃなくマジで", meaningEn: "I'm being completely serious, no joke", day: 1, speaker: "Tyler C.", example: "I'm not even playing, I could eat three buckets of popcorn right now." },
    { expression: "main character moment", meaning: "主人公の瞬間", meaningEn: "a moment where you feel like the star of a movie", day: 1, speaker: "Ava", example: "Walking into a theater without parents is a main character moment." },
    { expression: "keep it down", meaning: "静かにしろ", meaningEn: "be quieter, lower your voice", day: 1, speaker: "Marcus", example: "Hey. Keep it down over there. Movie hasn't even started." },
    { expression: "it's giving freedom", meaning: "自由って感じ", meaningEn: "it has the vibe/energy of freedom", day: 1, speaker: "Jayden", example: "No parents, own money, chose our own seats. It's giving freedom." },
    { expression: "I need a minute", meaning: "ちょっと待って・落ち着かせて", meaningEn: "I need a moment to collect myself", day: 1, speaker: "Maddie", example: "I need a minute. My mom just asked if the theater has a fire escape plan." },
    { expression: "who asked", meaning: "誰も聞いてないけど", meaningEn: "nobody requested your opinion (dismissive)", day: 1, speaker: "Tyler C.", example: "Ava wants the subtitled version. Who asked." },
    { expression: "I've had it up to here", meaning: "もう我慢の限界", meaningEn: "I'm at the absolute limit of my patience", day: 1, speaker: "Old Man Gus", example: "I've had it up to here with these kids runnin' around the lobby." },

    // ============================================================
    // DAY 2 -- THE PREVIEWS (15 expressions)
    // Settling in, snack wars, phone drama, previews drag on
    // ============================================================
    { expression: "scoot over", meaning: "ちょっとずれて", meaningEn: "move to the side to make room", day: 2, speaker: "Benji", example: "Scoot over! I can't see anything!" },
    { expression: "dibs on the armrest", meaning: "肘掛けは俺の", meaningEn: "claiming first rights to the shared armrest", day: 2, speaker: "Tyler C.", example: "Dibs on the armrest. I got here first." },
    { expression: "you always do this", meaning: "お前いっつもそうじゃん", meaningEn: "accusing someone of a repeated annoying behavior", day: 2, speaker: "Ava", example: "You always do this. You say you'll share and then you eat everything." },
    { expression: "pass the popcorn", meaning: "ポップコーン回して", meaningEn: "hand over the popcorn container", day: 2, speaker: "Benji", example: "Pass the popcorn! You've been hoggin' it since we sat down!" },
    { expression: "the previews are SO long", meaning: "予告長すぎ", meaningEn: "the movie trailers before the film go on forever", day: 2, speaker: "Jayden", example: "Bro, the previews are SO long. It's been like twenty minutes." },
    { expression: "on read", meaning: "既読スルー", meaningEn: "seen a message but not replied to it", day: 2, speaker: "Maddie", example: "I left my mom on read and now she's calling. I'm dead." },
    { expression: "that looks mid", meaning: "あれ微妙そう", meaningEn: "that looks mediocre, unimpressive", day: 2, speaker: "Tyler C.", example: "Another superhero sequel? That looks mid." },
    { expression: "I'm literally dying", meaning: "死ぬほど面白い・やばい", meaningEn: "extreme exaggeration of emotion (funny/excited)", day: 2, speaker: "Benji", example: "THIS SEAT RECLINES? I'm literally dying!" },
    { expression: "read receipts are evil", meaning: "既読通知は悪魔", meaningEn: "the feature showing your message was seen causes anxiety", day: 2, speaker: "Maddie", example: "Read receipts are evil. Now she knows I'm ignoring her." },
    { expression: "shh", meaning: "しーっ", meaningEn: "be quiet (sharp hissing sound)", day: 2, speaker: "Old Man Gus", example: "SHH. Some of us are tryin' to watch the screen." },
    { expression: "I called it", meaning: "やっぱりな・言った通り", meaningEn: "I predicted this correctly", day: 2, speaker: "Ava", example: "I called it. They're remaking that movie again. Zero originality." },
    { expression: "not my problem", meaning: "俺の知ったことじゃない", meaningEn: "I don't care, it doesn't concern me", day: 2, speaker: "Marcus", example: "You spilled soda on the seat? Not my problem." },
    { expression: "this better be good", meaning: "面白くなかったら許さない", meaningEn: "I have high expectations and will be disappointed if not met", day: 2, speaker: "Jayden", example: "Fourteen bucks for a ticket. This better be good." },
    { expression: "stop breathing so loud", meaning: "息うるさいんだけど", meaningEn: "your breathing is annoying me (petty complaint)", day: 2, speaker: "Ava", example: "Tyler, stop breathing so loud. You sound like a vacuum cleaner." },
    { expression: "bro chill", meaning: "落ち着けよ", meaningEn: "relax, calm down (directed at someone overreacting)", day: 2, speaker: "Jayden", example: "Bro chill, it's just a preview." },

    // ============================================================
    // DAY 3 -- THE MOVIE (15 expressions)
    // Actual film, reactions, bathroom runs, Benji's commentary
    // ============================================================
    { expression: "no one asked for your commentary", meaning: "誰も実況頼んでないから", meaningEn: "stop narrating, we don't need your play-by-play", day: 3, speaker: "Ava", example: "Benji, no one asked for your commentary. Just watch the movie." },
    { expression: "I can't breathe", meaning: "息できない(笑いすぎ/怖すぎ)", meaningEn: "I'm overwhelmed with laughter or fear", day: 3, speaker: "Maddie", example: "That jumpscare. I can't breathe." },
    { expression: "saw that coming", meaning: "そうなると思った", meaningEn: "I predicted that would happen (in the plot)", day: 3, speaker: "Ava", example: "The villain was the best friend? Saw that coming from the first scene." },
    { expression: "what just happened", meaning: "今の何?・え?", meaningEn: "confusion about a sudden or unexpected event", day: 3, speaker: "Jayden", example: "Wait wait wait. What just happened. Did he just die?" },
    { expression: "I gotta pee so bad", meaning: "トイレめっちゃ行きたい", meaningEn: "urgent need to use the bathroom", day: 3, speaker: "Tyler C.", example: "I gotta pee so bad but I don't wanna miss anything." },
    { expression: "use your inside voice", meaning: "小さい声で話して", meaningEn: "speak quietly, appropriate for indoors", day: 3, speaker: "Old Man Gus", example: "Use your inside voice, kid. This ain't a playground." },
    { expression: "that was insane", meaning: "今のやばかった", meaningEn: "that was incredibly impressive or shocking", day: 3, speaker: "Jayden", example: "That car chase scene? That was insane." },
    { expression: "oh my God oh my God", meaning: "やばいやばいやばい", meaningEn: "repeated exclamation of shock or excitement", day: 3, speaker: "Benji", example: "OH MY GOD OH MY GOD HE'S BEHIND THE DOOR!" },
    { expression: "you're not slick", meaning: "バレてるからね", meaningEn: "I see what you're doing, you're not as sneaky as you think", day: 3, speaker: "Ava", example: "Tyler, you're not slick. I saw you take my Skittles." },
    { expression: "the cinematography though", meaning: "映像美すごくない?", meaningEn: "the visual filmmaking quality is impressive", day: 3, speaker: "Ava", example: "Forget the plot. The cinematography though. That lighting." },
    { expression: "I don't get it", meaning: "意味わかんない", meaningEn: "I don't understand what's happening", day: 3, speaker: "Benji", example: "I don't get it. Why did she forgive him?" },
    { expression: "hold it", meaning: "我慢して", meaningEn: "don't go yet, wait (for bathroom urge or action)", day: 3, speaker: "Jayden", example: "Hold it, Tyler! This is the best part!" },
    { expression: "fr fr", meaning: "ガチでガチで", meaningEn: "for real for real, completely seriously", day: 3, speaker: "Tyler C.", example: "That villain speech was fire fr fr." },
    { expression: "back when I was your age", meaning: "お前らの年の頃はな", meaningEn: "nostalgic comparison to one's youth (lecture incoming)", day: 3, speaker: "Old Man Gus", example: "Back when I was your age, movies cost a dollar fifty." },
    { expression: "I'm on the edge of my seat", meaning: "ハラハラしてる", meaningEn: "extremely tense and engaged, full of suspense", day: 3, speaker: "Maddie", example: "I'm literally on the edge of my seat. My hands are shaking." },

    // ============================================================
    // DAY 4 -- THE INTERMISSION CHAOS (15 expressions)
    // Bathroom rush, lobby antics, Mrs. Chen calls, Marcus intervenes
    // ============================================================
    { expression: "that's not fair", meaning: "ずるいよそれ", meaningEn: "that's unjust, I object to this arrangement", day: 4, speaker: "Benji", example: "That's not fair! You said I could hold the candy!" },
    { expression: "don't make me come over there", meaning: "こっち行くぞ(脅し)", meaningEn: "warning that you'll intervene if behavior continues", day: 4, speaker: "Old Man Gus", example: "Don't make me come over there. I will talk to your parents." },
    { expression: "I literally don't care", meaning: "マジでどうでもいい", meaningEn: "expressing complete indifference", day: 4, speaker: "Marcus", example: "You want a refill? I literally don't care, the machine's over there." },
    { expression: "best day ever", meaning: "人生最高の日", meaningEn: "the greatest day of one's life (hyperbolic)", day: 4, speaker: "Benji", example: "Free refills? BEST DAY EVER!" },
    { expression: "she texted nine times", meaning: "9回もメッセ来た", meaningEn: "someone sent an excessive number of messages", day: 4, speaker: "Maddie", example: "I was in there for ten minutes and she texted nine times." },
    { expression: "what if something happens", meaning: "何かあったらどうすんの", meaningEn: "anxious hypothetical about potential danger", day: 4, speaker: "Mrs. Chen", example: "What if something happens and you can't reach me?" },
    { expression: "we're literally fine", meaning: "マジで大丈夫だって", meaningEn: "emphatic reassurance that nothing is wrong", day: 4, speaker: "Jayden", example: "Mom, we're literally fine. The theater has security and everything." },
    { expression: "you're embarrassing me", meaning: "恥ずかしいからやめて", meaningEn: "your behavior is making me feel ashamed in public", day: 4, speaker: "Jayden", example: "Mom, please. You're embarrassing me. My friends can hear." },
    { expression: "whatever", meaning: "もういいよ・知らない", meaningEn: "dismissive expression of not caring anymore", day: 4, speaker: "Marcus", example: "You dropped popcorn everywhere? Whatever. I'll sweep it later." },
    { expression: "that was so sus", meaning: "あれめっちゃ怪しかった", meaningEn: "that was suspicious, something felt off about it", day: 4, speaker: "Tyler C.", example: "That guy just walked into the wrong theater. That was so sus." },
    { expression: "no one asked", meaning: "誰も聞いてない", meaningEn: "nobody wanted your opinion (dismissive shutdown)", day: 4, speaker: "Tyler C.", example: "Ava started explaining the director's filmography. No one asked." },
    { expression: "you're so loud", meaning: "お前声でかすぎ", meaningEn: "you're speaking/acting at an excessive volume", day: 4, speaker: "Jayden", example: "Benji! You're so loud! People are staring!" },
    { expression: "my feet are stuck to the floor", meaning: "足が床にくっつく", meaningEn: "the floor is sticky (classic movie theater complaint)", day: 4, speaker: "Maddie", example: "Ew. My feet are stuck to the floor. This is so gross." },
    { expression: "worth it", meaning: "その価値あり", meaningEn: "the positive outcome justified the cost or effort", day: 4, speaker: "Jayden", example: "Twelve-dollar nachos? Honestly, worth it." },
    { expression: "can you not", meaning: "やめてくれない?", meaningEn: "please stop doing that (annoyed request)", day: 4, speaker: "Ava", example: "Can you not kick my seat? I'm trying to focus." },

    // ============================================================
    // DAY 5 -- THE AFTERMATH (15 expressions)
    // Credits roll, lobby exit, pickup, reliving the movie
    // ============================================================
    { expression: "that was a vibe", meaning: "最高の雰囲気だった", meaningEn: "that experience had a great atmosphere or feeling", day: 5, speaker: "Jayden", example: "Dude. That whole thing. That was a vibe." },
    { expression: "the ending though", meaning: "あのラストだけどさ", meaningEn: "drawing attention to the film's conclusion (impressed or confused)", day: 5, speaker: "Ava", example: "The ending though. That was some Kubrick-level ambiguity." },
    { expression: "I'm still shaking", meaning: "まだ震えてる", meaningEn: "still physically affected by fear or excitement", day: 5, speaker: "Maddie", example: "I'm still shaking from that last scene. My heart won't slow down." },
    { expression: "overrated", meaning: "過大評価", meaningEn: "not as good as people say it is", day: 5, speaker: "Old Man Gus", example: "Overrated. The original was better." },
    { expression: "it hits different in theaters", meaning: "映画館だと格別", meaningEn: "the experience is uniquely impactful on the big screen", day: 5, speaker: "Jayden", example: "You can watch it at home but it hits different in theaters." },
    { expression: "I'm never watching that again", meaning: "二度と見ない", meaningEn: "declaring you won't repeat the experience (often reversed later)", day: 5, speaker: "Maddie", example: "I'm never watching that again. My soul left my body three times." },
    { expression: "you missed the post-credits", meaning: "エンドロール後の見逃したよ", meaningEn: "there was a scene after the credits you didn't see", day: 5, speaker: "Ava", example: "WHERE ARE YOU GOING? You missed the post-credits scene!" },
    { expression: "nobody sits through credits", meaning: "エンドロール最後まで見る人いない", meaningEn: "most people leave before the credits finish", day: 5, speaker: "Tyler C.", example: "Nobody sits through credits, Ava. That's like twenty minutes of names." },
    { expression: "respectfully, you're wrong", meaning: "申し訳ないけど間違ってる", meaningEn: "polite but firm disagreement", day: 5, speaker: "Ava", example: "Respectfully, you're wrong. Post-credits are essential viewing." },
    { expression: "we gotta do this again", meaning: "またやろうぜ", meaningEn: "expressing desire to repeat the experience", day: 5, speaker: "Jayden", example: "We gotta do this again. Next weekend. Different movie." },
    { expression: "my mom's outside", meaning: "ママ外に来てる", meaningEn: "my parent has arrived for pickup", day: 5, speaker: "Maddie", example: "My mom's outside. She's been in the parking lot for forty minutes." },
    { expression: "that's so extra", meaning: "大げさすぎ", meaningEn: "that's excessive, over-the-top behavior", day: 5, speaker: "Tyler C.", example: "Your mom tracked your location the whole time? That's so extra." },
    { expression: "she means well", meaning: "悪気はないんだよ", meaningEn: "her intentions are good even if her actions are annoying", day: 5, speaker: "Jayden", example: "She means well. She's just... a lot." },
    { expression: "lowkey wanna cry", meaning: "ちょっと泣きそう", meaningEn: "quietly or secretly feeling emotional enough to cry", day: 5, speaker: "Maddie", example: "That was our first movie alone and it's over. Lowkey wanna cry." },
    { expression: "grow up already", meaning: "いい加減大人になれ", meaningEn: "stop being childish, act your age", day: 5, speaker: "Old Man Gus", example: "Grow up already. It's just a movie." },
];

export const MOVIE_EXPRESSIONS_PER_DAY = 15;
export const TOTAL_MOVIE_EXPRESSIONS = MOVIE_EXPRESSIONS.length;

export const MOVIE_DAY_IDS: Record<number, string> = {
    1: 'movie-day1',
    2: 'movie-day2',
    3: 'movie-day3',
    4: 'movie-day4',
    5: 'movie-day5',
};

/**
 * Find the conversation line index where an expression is spoken by its speaker.
 * Returns the array index or -1 if not found.
 */
export function findMovieExpressionLineIndex(
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
