/**
 * Monster Expressions -- casual expressions from Monster Under the Bed scenario
 * Tracked separately from idiom list (no overlap with used-idioms.json)
 * 75 expressions across 5 days, all commonly used in spoken English
 */

export interface MonsterExpression {
    expression: string;
    meaning: string;
    meaningEn: string;
    day: number;
    speaker: string;
    example: string;
}

export const MONSTER_EXPRESSIONS: MonsterExpression[] = [
    // ============================================================
    // DAY 1 -- THE GOODBYE (15 expressions)
    // Parents leaving, arrivals, Timmy's anxiety
    // ============================================================
    { expression: "no fair", meaning: "ずるい・不公平", meaningEn: "that's not fair, unfair (childish protest)", day: 1, speaker: "Timmy", example: "No fair! You always get to stay up late!" },
    { expression: "sweetie", meaning: "かわいい子(呼びかけ)", meaningEn: "term of endearment for a child or loved one", day: 1, speaker: "Sarah", example: "Sweetie, we'll be back before you know it." },
    { expression: "for the record", meaning: "一応言っておくと", meaningEn: "I want to officially state, just so you know", day: 1, speaker: "Greg", example: "For the record, I checked the closet twice." },
    { expression: "back in my day", meaning: "俺の時代にはな", meaningEn: "when I was young (nostalgic/boomer opening)", day: 1, speaker: "Grandpa Frank", example: "Back in my day, we didn't have nightlights. We had the moon." },
    { expression: "I call dibs", meaning: "先に予約した・俺の", meaningEn: "I claim first rights to something", day: 1, speaker: "Noah", example: "I call dibs on the top bunk!" },
    { expression: "you're gonna be fine", meaning: "大丈夫だから", meaningEn: "reassurance that everything will be OK", day: 1, speaker: "Sarah", example: "You're gonna be fine, OK? Grandpa's right downstairs." },
    { expression: "in theory", meaning: "理論上は", meaningEn: "hypothetically, it should work but maybe not", day: 1, speaker: "Greg", example: "In theory, they should be asleep by nine." },
    { expression: "literally", meaning: "マジで・文字通り", meaningEn: "actually, truly (often used as emphasis)", day: 1, speaker: "Kayla", example: "I literally just got here and there's already yelling." },
    { expression: "technically", meaning: "厳密に言うと", meaningEn: "strictly speaking, if you want to be precise", day: 1, speaker: "Emma", example: "Technically, monsters can't exist because there's no biological classification for them." },
    { expression: "pinky promise", meaning: "指切りげんまん", meaningEn: "a solemn promise sealed by linking pinkies", day: 1, speaker: "Timmy", example: "Pinky promise you'll come back?" },
    { expression: "just sayin'", meaning: "一応言っとくけど", meaningEn: "I'm pointing something out (disclaimer)", day: 1, speaker: "Danny", example: "The government's been real quiet about monsters lately. Just sayin'." },
    { expression: "settle down", meaning: "落ち着け・静かにしろ", meaningEn: "calm down, stop being rowdy", day: 1, speaker: "Grandpa Frank", example: "Alright, settle down, both of ya." },
    { expression: "not gonna lie", meaning: "正直に言うと", meaningEn: "honestly, to be truthful", day: 1, speaker: "Kayla", example: "Not gonna lie, this house is kinda creepy at night." },
    { expression: "take a deep breath", meaning: "深呼吸して", meaningEn: "calm yourself by breathing slowly", day: 1, speaker: "Sarah", example: "Take a deep breath, buddy. In through the nose, out through the mouth." },
    { expression: "scaredy-cat", meaning: "怖がり・ビビり", meaningEn: "someone who is easily frightened (teasing)", day: 1, speaker: "Emma", example: "Don't be such a scaredy-cat, Timmy." },

    // ============================================================
    // DAY 2 -- THE NOISES (15 expressions)
    // Pipes, creaks, fear escalation, investigation
    // ============================================================
    { expression: "for real?", meaning: "マジで?・本当に?", meaningEn: "seriously? are you being honest?", day: 2, speaker: "Noah", example: "For real? You heard it too?" },
    { expression: "for your information", meaning: "ちなみに言っておくと", meaningEn: "just so you know (often sassy/corrective)", day: 2, speaker: "Emma", example: "For your information, old pipes expand when the heat comes on." },
    { expression: "I'm tellin' you", meaning: "だから言ってるだろ", meaningEn: "believe me, I'm serious about this", day: 2, speaker: "Danny", example: "I'm tellin' you, that sound is NOT normal pipes." },
    { expression: "no way", meaning: "ありえない・絶対嫌", meaningEn: "absolutely not, impossible, I refuse", day: 2, speaker: "Timmy", example: "No way I'm going down there alone!" },
    { expression: "for cryin' out loud", meaning: "いい加減にしろよ", meaningEn: "expression of frustration or exasperation", day: 2, speaker: "Grandpa Frank", example: "For cryin' out loud, it's the water heater!" },
    { expression: "I can't even", meaning: "もう無理・信じられない", meaningEn: "I'm overwhelmed, I can't handle this", day: 2, speaker: "Kayla", example: "I can't even right now. Why is everyone screaming?" },
    { expression: "think about it", meaning: "よく考えてみろよ", meaningEn: "consider this carefully (persuasive)", day: 2, speaker: "Danny", example: "Think about it. Why would a pipe make that sound at exactly midnight?" },
    { expression: "what if", meaning: "もし~だったら", meaningEn: "hypothetical question, imagining a scenario", day: 2, speaker: "Timmy", example: "What if it comes upstairs?" },
    { expression: "give me a break", meaning: "勘弁してくれ", meaningEn: "stop being ridiculous, come on", day: 2, speaker: "Grandpa Frank", example: "Give me a break. I've been a plumber for forty years." },
    { expression: "hypothetically", meaning: "仮定の話として", meaningEn: "speaking in theory, just suppose", day: 2, speaker: "Emma", example: "Hypothetically, if there WERE a creature, it would need a food source." },
    { expression: "it is what it is", meaning: "しょうがない・そういうもん", meaningEn: "accept the situation, can't change it", day: 2, speaker: "Kayla", example: "The Wi-Fi's out. It is what it is." },
    { expression: "told you so", meaning: "だから言ったじゃん", meaningEn: "I warned you and I was right", day: 2, speaker: "Danny", example: "SEE? Told you so! That's no pipe!" },
    { expression: "come on", meaning: "おいおい・頼むよ", meaningEn: "expression of encouragement or disbelief", day: 2, speaker: "Grandpa Frank", example: "Come on, kid. There's nothin' down there." },
    { expression: "you guys", meaning: "お前ら・みんな", meaningEn: "informal address to a group of people", day: 2, speaker: "Kayla", example: "OK you guys, can we please just calm down?" },
    { expression: "on my life", meaning: "命に誓って", meaningEn: "I swear it's true, I promise absolutely", day: 2, speaker: "Timmy", example: "I heard it, on my life!" },

    // ============================================================
    // DAY 3 -- FORT BUILDING (15 expressions)
    // Construction, teamwork, Danny's conspiracy stories
    // ============================================================
    { expression: "dibs on", meaning: "~は俺の・先に取った", meaningEn: "claiming something before others can", day: 3, speaker: "Noah", example: "Dibs on the big pillow!" },
    { expression: "hold on", meaning: "ちょっと待って", meaningEn: "wait a moment, pause", day: 3, speaker: "Grandpa Frank", example: "Hold on, hold on. You can't stack 'em like that." },
    { expression: "all set", meaning: "準備OK・完了", meaningEn: "ready, everything is prepared", day: 3, speaker: "Kayla", example: "Snacks are all set. We got popcorn and juice boxes." },
    { expression: "my point exactly", meaning: "まさにそれが言いたかった", meaningEn: "that proves what I was saying", day: 3, speaker: "Danny", example: "My point exactly! Why would the government hide it?" },
    { expression: "how come", meaning: "なんで?・どうして?", meaningEn: "why? how is that? (casual question)", day: 3, speaker: "Timmy", example: "How come Emma gets to be the boss?" },
    { expression: "let me guess", meaning: "当ててやろうか", meaningEn: "I think I already know what you'll say", day: 3, speaker: "Emma", example: "Let me guess. Uncle Danny told you about aliens again." },
    { expression: "no offense", meaning: "悪気はないけど", meaningEn: "I don't mean to be rude, but...", day: 3, speaker: "Kayla", example: "No offense, Frank, but your knot tying is kinda sketchy." },
    { expression: "I got this", meaning: "任せて・俺がやる", meaningEn: "I can handle it, leave it to me", day: 3, speaker: "Grandpa Frank", example: "Step aside. I got this. I once built a deck in two hours." },
    { expression: "look it up", meaning: "調べてみなよ", meaningEn: "search for it, verify it yourself", day: 3, speaker: "Danny", example: "Look it up. There's a whole subreddit about basement creatures." },
    { expression: "not helping", meaning: "助けになってないよ", meaningEn: "what you're saying/doing makes it worse", day: 3, speaker: "Kayla", example: "Danny, you're not helping." },
    { expression: "good to go", meaning: "準備万端・OKです", meaningEn: "ready, everything checks out", day: 3, speaker: "Grandpa Frank", example: "Flashlight, blankets, duct tape. We're good to go." },
    { expression: "trust me", meaning: "信じてくれ", meaningEn: "believe me, I know what I'm talking about", day: 3, speaker: "Danny", example: "Trust me. Tin foil over the windows blocks their signals." },
    { expression: "real quick", meaning: "ちょっとだけ・すぐ", meaningEn: "very briefly, just for a moment", day: 3, speaker: "Kayla", example: "I'm gonna check my phone real quick." },
    { expression: "super cool", meaning: "めっちゃかっこいい", meaningEn: "very cool, really awesome (childish enthusiasm)", day: 3, speaker: "Noah", example: "This fort is super cool!" },
    { expression: "in all fairness", meaning: "公平に言えば", meaningEn: "to be fair, considering both sides", day: 3, speaker: "Greg", example: "In all fairness, Danny, scaring children is not babysitting." },

    // ============================================================
    // DAY 4 -- THE SHOWDOWN (15 expressions)
    // Chaos, fort collapse, phone calls, peak fear
    // ============================================================
    { expression: "watch out", meaning: "気をつけて・危ない", meaningEn: "be careful, look out for danger", day: 4, speaker: "Emma", example: "Watch out! The left wall's about to go!" },
    { expression: "uh-oh", meaning: "やばい・あちゃー", meaningEn: "expression of alarm or mild trouble", day: 4, speaker: "Noah", example: "Uh-oh. The blanket's ripping." },
    { expression: "whoops", meaning: "おっと・しまった", meaningEn: "exclamation when you make a small mistake", day: 4, speaker: "Danny", example: "Whoops. I leaned on the wrong pillow." },
    { expression: "hang on", meaning: "待って・つかまって", meaningEn: "wait / hold tight (dual meaning)", day: 4, speaker: "Grandpa Frank", example: "Hang on, I'll get the duct tape." },
    { expression: "are you kidding me", meaning: "冗談でしょ・マジかよ", meaningEn: "expression of disbelief or frustration", day: 4, speaker: "Kayla", example: "Are you kidding me? The whole thing just collapsed!" },
    { expression: "I knew it", meaning: "やっぱり・思った通り", meaningEn: "I was right, I suspected this", day: 4, speaker: "Danny", example: "I KNEW it! Something knocked it over from OUTSIDE!" },
    { expression: "calm down", meaning: "落ち着いて", meaningEn: "relax, stop panicking", day: 4, speaker: "Sarah", example: "Calm down, calm down. Tell me what happened." },
    { expression: "right now", meaning: "今すぐ", meaningEn: "immediately, at this moment", day: 4, speaker: "Greg", example: "We're coming home right now." },
    { expression: "it's OK", meaning: "大丈夫だよ", meaningEn: "reassurance, everything is alright", day: 4, speaker: "Kayla", example: "It's OK, it's OK. Nobody's hurt." },
    { expression: "I'm scared", meaning: "怖い", meaningEn: "expressing fear (direct, childlike)", day: 4, speaker: "Timmy", example: "I'm scared. I wanna go home." },
    { expression: "you're already home", meaning: "もう家にいるでしょ", meaningEn: "literal correction (gentle humor)", day: 4, speaker: "Emma", example: "Timmy, you're already home." },
    { expression: "not now", meaning: "今はやめて・後にして", meaningEn: "this isn't the time for that", day: 4, speaker: "Kayla", example: "Not now, Danny. Seriously. Not now." },
    { expression: "I'm on my way", meaning: "今向かってる", meaningEn: "I'm coming, I'm heading there now", day: 4, speaker: "Greg", example: "Stay on the line. I'm on my way." },
    { expression: "what happened", meaning: "何があったの", meaningEn: "asking for an explanation of events", day: 4, speaker: "Sarah", example: "What happened? Is anyone hurt?" },
    { expression: "hold still", meaning: "じっとして", meaningEn: "don't move, stay in position", day: 4, speaker: "Grandpa Frank", example: "Hold still, both of ya. I'm gonna check the basement one more time." },

    // ============================================================
    // DAY 5 -- SAFE AND SOUND (15 expressions)
    // Resolution, comfort, sleep, morning after
    // ============================================================
    { expression: "see?", meaning: "ほらね・でしょ?", meaningEn: "I told you, look at the evidence", day: 5, speaker: "Grandpa Frank", example: "See? Raccoon. Just a fat ol' raccoon in the crawl space." },
    { expression: "the whole time", meaning: "ずっと・最初から", meaningEn: "during the entire period", day: 5, speaker: "Emma", example: "It was a raccoon the whole time. I literally said it was an animal." },
    { expression: "that's what they want you to think", meaning: "それが奴らの狙いだ", meaningEn: "conspiracy reframing, don't trust appearances", day: 5, speaker: "Danny", example: "A raccoon. Sure. That's what they want you to think." },
    { expression: "I'm just glad", meaning: "~でよかった", meaningEn: "expressing relief about an outcome", day: 5, speaker: "Sarah", example: "I'm just glad everyone's OK." },
    { expression: "bottom line", meaning: "結局・要するに", meaningEn: "the most important point, what it comes down to", day: 5, speaker: "Greg", example: "Bottom line, everyone's safe. That's what matters." },
    { expression: "pretty brave", meaning: "結構勇気あったよ", meaningEn: "fairly courageous (gentle praise)", day: 5, speaker: "Grandpa Frank", example: "You were pretty brave tonight, kid." },
    { expression: "best night ever", meaning: "最高の夜", meaningEn: "the greatest night (enthusiastic)", day: 5, speaker: "Noah", example: "That was the best night ever!" },
    { expression: "you did great", meaning: "よく頑張ったね", meaningEn: "praising someone's performance", day: 5, speaker: "Sarah", example: "You did great, Kayla. Seriously." },
    { expression: "can we do it again", meaning: "またやっていい?", meaningEn: "asking to repeat a fun experience", day: 5, speaker: "Timmy", example: "Mom? Can we do it again next weekend?" },
    { expression: "absolutely not", meaning: "絶対ダメ", meaningEn: "emphatic refusal, no way", day: 5, speaker: "Greg", example: "Absolutely not." },
    { expression: "we'll see", meaning: "考えとくね(多分OK)", meaningEn: "maybe, I'll think about it (soft yes)", day: 5, speaker: "Sarah", example: "We'll see." },
    { expression: "out like a light", meaning: "すぐ寝落ちした", meaningEn: "fell asleep instantly, passed out", day: 5, speaker: "Grandpa Frank", example: "Both boys are out like a light." },
    { expression: "good as new", meaning: "元通り・新品同様", meaningEn: "restored to original condition", day: 5, speaker: "Grandpa Frank", example: "Fixed the pipe, too. Good as new." },
    { expression: "to be fair", meaning: "正直なところ", meaningEn: "in fairness, to be reasonable about it", day: 5, speaker: "Kayla", example: "To be fair, it WAS a really loud raccoon." },
    { expression: "sleep tight", meaning: "ぐっすりおやすみ", meaningEn: "sleep well (bedtime farewell)", day: 5, speaker: "Sarah", example: "Sleep tight, baby. No monsters. Just raccoons." },
];

export const MONSTER_EXPRESSIONS_PER_DAY = 15;
export const TOTAL_MONSTER_EXPRESSIONS = MONSTER_EXPRESSIONS.length;

export const MONSTER_DAY_IDS: Record<number, string> = {
    1: 'monster-day1',
    2: 'monster-day2',
    3: 'monster-day3',
    4: 'monster-day4',
    5: 'monster-day5',
};

/**
 * Find the conversation line index where an expression is spoken by its speaker.
 * Returns the array index or -1 if not found.
 */
export function findMonsterExpressionLineIndex(
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
