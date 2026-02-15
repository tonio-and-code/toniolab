/**
 * Mariners Trade Talk Expressions -- casual podcast expressions from the trade discussion series
 * Tracked separately from idiom list (no overlap with used-idioms.json)
 * 75 expressions across 5 days, all commonly used in spoken English podcasts
 */

export interface MarinersExpression {
    expression: string;
    meaning: string;
    meaningEn: string;
    day: number;
    speaker: string;
    example: string;
}

export const MARINERS_EXPRESSIONS: MarinersExpression[] = [
    // ============================================================
    // DAY 1 -- THE DEAL (15 expressions)
    // Trade announcement, origin story, evaluation split
    // ============================================================
    { expression: "rough around the edges", meaning: "粗削り・まだ未熟", meaningEn: "not yet polished or refined, somewhat awkward", day: 1, speaker: "Kai", example: "This is my first time doin' this, so I might be a little rough around the edges." },
    { expression: "pumped", meaning: "めちゃくちゃ興奮してる", meaningEn: "extremely excited and enthusiastic", day: 1, speaker: "Kai", example: "I'm so pumped about this team right now, I gotta talk about it." },
    { expression: "that's wild", meaning: "やばいね・すごい", meaningEn: "that's amazing, surprising, or hard to believe", day: 1, speaker: "Marcus", example: "That's wild. 'Cause 2001 Seattle was somethin' else entirely." },
    { expression: "stacked", meaning: "戦力が揃ってる・豪華", meaningEn: "loaded with talent, very strong lineup", day: 1, speaker: "Marcus", example: "Bret Boone, Olerud, Edgar at DH... that lineup was stacked." },
    { expression: "the whole vibe", meaning: "全体の雰囲気", meaningEn: "the overall atmosphere or feeling of a place", day: 1, speaker: "Kai", example: "The whole vibe was completely different from Japanese baseball." },
    { expression: "don't even get me started", meaning: "その話は始めないでくれ(語り出したら止まらない)", meaningEn: "I have so much to say about this I might never stop", day: 1, speaker: "Kai", example: "Oh, don't even get me started. Twenty-plus years without a title." },
    { expression: "built different", meaning: "別次元・格が違う", meaningEn: "uniquely tough or resilient, on another level", day: 1, speaker: "Marcus", example: "You guys are built different." },
    { expression: "that's a haul", meaning: "大漁・豊作だ", meaningEn: "a great return or collection of assets from a deal", day: 1, speaker: "Marcus", example: "Seinche, Ty Pete, two draft picks -- for a guy with two years of control? That's a haul." },
    { expression: "from where I'm sittin'", meaning: "俺の立場から見ると", meaningEn: "from my perspective, the way I see it", day: 1, speaker: "Kai", example: "From where I'm sittin', the price was heavy." },
    { expression: "held firm", meaning: "一歩も譲らなかった", meaningEn: "refused to back down or compromise in negotiations", day: 1, speaker: "Marcus", example: "Chaim held firm for months -- didn't blink." },
    { expression: "the whole thing was dead", meaning: "話は完全に流れた", meaningEn: "the deal or negotiation had completely fallen through", day: 1, speaker: "Marcus", example: "There were points where I honestly thought the whole thing was dead." },
    { expression: "didn't fold", meaning: "折れなかった・妥協しなかった", meaningEn: "didn't give in or surrender under pressure", day: 1, speaker: "Kai", example: "Please tell me Chaim didn't fold. Please tell me he didn't sell cheap." },
    { expression: "not fatal", meaning: "致命傷じゃない", meaningEn: "not catastrophic, survivable, not a dealbreaker", day: 1, speaker: "Kai", example: "It hurt. But it's not fatal. We kept Montesdeoca." },
    { expression: "full-on celebration mode", meaning: "完全にお祝いモード", meaningEn: "completely ecstatic, going all out with joy", day: 1, speaker: "Kai", example: "The American Mariners fans are mostly ecstatic, like full-on celebration mode." },
    { expression: "walked away feelin' pretty good", meaning: "割と満足して去った", meaningEn: "left a negotiation or situation feeling satisfied", day: 1, speaker: "Marcus", example: "All three teams actually walked away feelin' pretty good about it." },

    // ============================================================
    // DAY 2 -- THE OFFSEASON (15 expressions)
    // Offseason grade, roster depth, division rivals
    // ============================================================
    { expression: "hit me", meaning: "言ってみろ・聞かせて", meaningEn: "go ahead, tell me (inviting someone to share)", day: 2, speaker: "Marcus", example: "Hit me. What's the highlight?" },
    { expression: "no contest", meaning: "文句なし・議論の余地なし", meaningEn: "undisputed, clearly the best with no competition", day: 2, speaker: "Kai", example: "Naylor's extension. No contest." },
    { expression: "the price was steep", meaning: "代償が大きかった", meaningEn: "the cost was very high, expensive", day: 2, speaker: "Kai", example: "The acquisition makes sense, but the price was steep for a setup man." },
    { expression: "a jam", meaning: "困った状況・渋滞", meaningEn: "a difficult or tight situation, a predicament", day: 2, speaker: "Marcus", example: "Oh, that IS a jam. So it's almost like they need to move somebody." },
    { expression: "patchworkin'", meaning: "その場しのぎで何とかする", meaningEn: "improvising with whatever resources are available", day: 2, speaker: "Kai", example: "They were just patchworkin' the rotation together." },
    { expression: "not a plan", meaning: "計画とは言えない", meaningEn: "not a sustainable strategy, just luck", day: 2, speaker: "Kai", example: "They survived it, but that's not a plan." },
    { expression: "the bones are there", meaning: "骨組みはできてる", meaningEn: "the foundation or structure is solid and in place", day: 2, speaker: "Kai", example: "The bones are there. Just need a little more insurance." },
    { expression: "the ceiling is really high", meaning: "天井(ポテンシャル)は相当高い", meaningEn: "the maximum potential is very impressive", day: 2, speaker: "Marcus", example: "The ceiling is really high, but the floor could be ugly if guys start gettin' hurt." },
    { expression: "the floor could be ugly", meaning: "底が抜ける可能性がある", meaningEn: "the worst-case scenario could be very bad", day: 2, speaker: "Marcus", example: "The ceiling is really high, but the floor could be ugly." },
    { expression: "the window's open", meaning: "チャンスが来てる", meaningEn: "a competitive opportunity currently exists", day: 2, speaker: "Kai", example: "The window's open for Seattle right now, but it won't stay open forever." },
    { expression: "flip someone", meaning: "トレードで捌く", meaningEn: "trade a player quickly, often for a different asset", day: 2, speaker: "Kai", example: "If they could flip Raley for a middle reliever, that would solve two problems." },
    { expression: "massive upgrade", meaning: "大幅なグレードアップ", meaningEn: "a significantly better replacement or improvement", day: 2, speaker: "Kai", example: "Donovan instead of Polanco at third -- that's a massive upgrade." },
    { expression: "a cakewalk", meaning: "楽勝・簡単なこと", meaningEn: "something very easy, no challenge at all", day: 2, speaker: "Marcus", example: "The AL West isn't exactly a cakewalk." },
    { expression: "lottery tickets", meaning: "宝くじ枠(当たれば大きい)", meaningEn: "low-probability, high-reward gambles", day: 2, speaker: "Kai", example: "They're takin' lottery tickets -- guys who could be elite if they bounce back." },
    { expression: "make it count", meaning: "チャンスを活かす", meaningEn: "take full advantage of an opportunity", day: 2, speaker: "Kai", example: "Gotta make it count while we can." },

    // ============================================================
    // DAY 3 -- THE PERFECT FIT (15 expressions)
    // Leadoff role, T-Mobile Park, health, salary, clubhouse
    // ============================================================
    { expression: "break it down", meaning: "詳しく説明して", meaningEn: "explain in detail, analyze piece by piece", day: 3, speaker: "Kai", example: "Break it down for me. What makes him a leadoff guy?" },
    { expression: "table setter", meaning: "テーブルセッター(出塁型1番打者)", meaningEn: "a leadoff hitter whose job is getting on base for power hitters behind them", day: 3, speaker: "Kai", example: "Arozarena's a five-hole hitter, not a table setter." },
    { expression: "like a metronome", meaning: "メトロノームのように安定して", meaningEn: "consistently reliable, steady and repetitive", day: 3, speaker: "Marcus", example: "He just gets on base. Over and over. He's like a metronome." },
    { expression: "bread and butter", meaning: "最大の持ち味・十八番", meaningEn: "someone's main strength or core skill", day: 3, speaker: "Kai", example: "Line drives, doubles in the gap -- that's his bread and butter." },
    { expression: "doesn't clog up", meaning: "邪魔にならない・渋滞させない", meaningEn: "doesn't block or create an obstacle for others", day: 3, speaker: "Kai", example: "Donovan doesn't clog up the pathway for our young guys." },
    { expression: "Cinderella fit", meaning: "シンデレラフィット(完璧にハマる)", meaningEn: "a perfect, almost magical match", day: 3, speaker: "Marcus", example: "He's like the Cinderella fit. I can't find a reason it doesn't work." },
    { expression: "tanked", meaning: "急降下した・ガタ落ちした", meaningEn: "dropped sharply, collapsed in performance or value", day: 3, speaker: "Kai", example: "Teoscar's numbers tanked at T-Mobile Park." },
    { expression: "cautiously optimistic", meaning: "慎重に楽観的", meaningEn: "hopeful but careful, not getting too excited yet", day: 3, speaker: "Kai", example: "I'm cautiously optimistic on the health front." },
    { expression: "a beast", meaning: "化け物・めちゃくちゃ強い", meaningEn: "an incredibly dominant performer", day: 3, speaker: "Kai", example: "Against righties? He's a beast -- .385 OBP." },
    { expression: "absolutely disgusting", meaning: "えげつない(褒め言葉)", meaningEn: "insanely good (used as high praise in sports)", day: 3, speaker: "Kai", example: "Lefsnyder is absolutely disgusting against left-handed pitching." },
    { expression: "sold me on", meaning: "~で心を掴まれた", meaningEn: "convinced or won someone over about something", day: 3, speaker: "Kai", example: "What really sold me on Donovan as a person was the arbitration story." },
    { expression: "checking out", meaning: "やる気をなくす・腐る", meaningEn: "mentally disengaging, no longer putting in effort", day: 3, speaker: "Kai", example: "When you're losin' that much, guys start checking out." },
    { expression: "vets for character", meaning: "人間性を徹底調査する", meaningEn: "evaluates someone's personality and integrity before committing", day: 3, speaker: "Kai", example: "The organization really vets guys for character before they trade for 'em." },
    { expression: "rah-rah leader", meaning: "声を上げて引っ張るリーダー", meaningEn: "a vocal, cheerleader-type leader who motivates through enthusiasm", day: 3, speaker: "Marcus", example: "He's not a rah-rah leader type, but he leads by quietly doin' his job." },
    { expression: "a nightmare", meaning: "最悪・悪夢", meaningEn: "an awful experience or terrible situation", day: 3, speaker: "Kai", example: "Polanco playin' third was a nightmare." },

    // ============================================================
    // DAY 4 -- THE NEXT GENERATION (15 expressions)
    // Emerson, three-way trade, Williamson, front-office feuds
    // ============================================================
    { expression: "tipped you off", meaning: "気づかせた・ヒントになった", meaningEn: "gave you a clue, alerted you to something", day: 4, speaker: "Marcus", example: "What tipped you off that Emerson would start?" },
    { expression: "rockets through the system", meaning: "システムを猛スピードで駆け上がる", meaningEn: "advances extremely quickly through organizational levels", day: 4, speaker: "Kai", example: "He rockets through the system in under two years and makes his Major League debut." },
    { expression: "doesn't crack under pressure", meaning: "プレッシャーで折れない", meaningEn: "stays calm and performs well in stressful situations", day: 4, speaker: "Kai", example: "They've been ravin' about his makeup. The kid doesn't crack under pressure." },
    { expression: "get his feet wet", meaning: "最初の経験を積む", meaningEn: "gain initial experience in a new role or environment", day: 4, speaker: "Kai", example: "2026 at third to get his feet wet, then 2027 onward at short." },
    { expression: "the tools are there", meaning: "素材は揃ってる", meaningEn: "the raw physical abilities and skills exist", day: 4, speaker: "Kai", example: "The tools are there -- power AND contact, improving range." },
    { expression: "go way back", meaning: "長い付き合い", meaningEn: "have a long shared history or relationship", day: 4, speaker: "Kai", example: "They go way back. Neander was Chaim's colleague in Tampa Bay." },
    { expression: "swooped in", meaning: "突然飛び込んできた", meaningEn: "arrived suddenly to seize an opportunity", day: 4, speaker: "Kai", example: "It wasn't just that the Rays swooped in at the last minute." },
    { expression: "bridge the gap", meaning: "橋渡しをする", meaningEn: "connect two sides that don't normally deal with each other", day: 4, speaker: "Kai", example: "Neander can bridge the gap between Seattle and St. Louis." },
    { expression: "came to a head", meaning: "ついに爆発した・決裂した", meaningEn: "reached a crisis point, a conflict escalated to its peak", day: 4, speaker: "Kai", example: "When it came to a head, the owner sided with Scioscia." },
    { expression: "dead silence", meaning: "完全沈黙", meaningEn: "complete absence of communication or activity", day: 4, speaker: "Kai", example: "He trades with Houston and Texas. But Anaheim? Dead silence." },
    { expression: "cross off", meaning: "リストから消す・除外する", meaningEn: "eliminate from a list, rule out completely", day: 4, speaker: "Kai", example: "Every offseason, I cross off every Angels player immediately." },
    { expression: "the human element", meaning: "人間的な要素", meaningEn: "the personal, emotional, and relational factor in decisions", day: 4, speaker: "Kai", example: "Front-office relationships matter more than people think. The human element is real." },
    { expression: "peanuts", meaning: "はした金・雀の涙", meaningEn: "a very small, almost insignificant amount of money", day: 4, speaker: "Kai", example: "Sixty-thousand dollar bonus, which is peanuts for a second-rounder." },
    { expression: "a different engine", meaning: "エンジンが違う(異次元の情熱)", meaningEn: "unique internal drive, an extraordinary work ethic", day: 4, speaker: "Kai", example: "His college coach said the guy had a 'different engine.'" },
    { expression: "walk away with somethin' good", meaning: "いつも何かしら持って帰る", meaningEn: "consistently end up with a positive outcome from deals", day: 4, speaker: "Kai", example: "Tampa always seems to walk away with somethin' good." },

    // ============================================================
    // DAY 5 -- BUILDING THE FUTURE (15 expressions)
    // Seinche, Gilbert extension, payroll, Kirby trade, World Series dream
    // ============================================================
    { expression: "sounds like a gimmick", meaning: "ギミック(見せ物)にしか聞こえない", meaningEn: "seems like a novelty or trick rather than something genuine", day: 5, speaker: "Kai", example: "Seinche can pitch with both arms. Which sounds like a gimmick, but it's actually not." },
    { expression: "dominant stuff", meaning: "圧倒的なパフォーマンス", meaningEn: "overwhelmingly impressive performance or statistics", day: 5, speaker: "Kai", example: ".480 OPS allowed, 30% strikeout rate. That's dominant stuff." },
    { expression: "the right call", meaning: "正しい判断", meaningEn: "the correct decision in a given situation", day: 5, speaker: "Kai", example: "Going right-arm only? I think that's the right call." },
    { expression: "landing spot", meaning: "着地点・良い移籍先", meaningEn: "a good destination or place to end up", day: 5, speaker: "Kai", example: "I think St. Louis is a good landing spot for him." },
    { expression: "the heavy stuff", meaning: "重い話・本題", meaningEn: "the serious, important, or difficult topics", day: 5, speaker: "Marcus", example: "OK, now the heavy stuff. Gilbert's contract situation." },
    { expression: "what's the holdup", meaning: "何がネックなの", meaningEn: "what's causing the delay or preventing progress", day: 5, speaker: "Marcus", example: "So what's the holdup on the extension?" },
    { expression: "come off the books", meaning: "契約が切れる(帳簿から外れる)", meaningEn: "contracts expire, salary obligations end", day: 5, speaker: "Kai", example: "In 2027, Crawford and Arozarena come off the books -- that's forty million freed up." },
    { expression: "force their hand", meaning: "決断を迫る・追い込む", meaningEn: "compel someone to act or make a decision they'd rather avoid", day: 5, speaker: "Kai", example: "It's painful, but the math might force their hand." },
    { expression: "hear me out", meaning: "最後まで聞いてくれ", meaningEn: "listen to my full argument before judging", day: 5, speaker: "Kai", example: "Hear me out. If they extend Gilbert, they've locked down their ace." },
    { expression: "sky-high", meaning: "天井知らず・最高値", meaningEn: "extremely high in value, price, or level", day: 5, speaker: "Kai", example: "Kirby's got two years of control left, so his trade value is sky-high." },
    { expression: "high-class problems", meaning: "贅沢な悩み", meaningEn: "difficulties that arise from being in a fortunate position", day: 5, speaker: "Marcus", example: "As a Cardinals fan, these are unbelievably high-class problems." },
    { expression: "the farm", meaning: "ファーム(マイナーリーグ組織)", meaningEn: "the minor league development system of a baseball team", day: 5, speaker: "Marcus", example: "When the big-league team is struggling, watch the farm." },
    { expression: "non-negotiable", meaning: "譲れない・絶対", meaningEn: "absolutely required, not up for discussion", day: 5, speaker: "Kai", example: "Division title is non-negotiable." },
    { expression: "if everything breaks right", meaning: "全部うまくいけば", meaningEn: "if all circumstances turn out favorably", day: 5, speaker: "Kai", example: "The maximum output this team can produce -- if everything breaks right -- is the best it's ever been." },
    { expression: "keep the faith", meaning: "信じ続ける", meaningEn: "maintain hope and belief despite difficulties", day: 5, speaker: "Kai", example: "Find the next great prospect, get excited about THAT, and keep the faith." },
];

export const MARINERS_EXPRESSIONS_PER_DAY = 15;
export const TOTAL_MARINERS_EXPRESSIONS = MARINERS_EXPRESSIONS.length;

export const MARINERS_DAY_IDS: Record<number, string> = {
    1: 'mariners-day1',
    2: 'mariners-day2',
    3: 'mariners-day3',
    4: 'mariners-day4',
    5: 'mariners-day5',
};

/**
 * Find the conversation line index where an expression is spoken by its speaker.
 * Returns the array index or -1 if not found.
 */
export function findMarinersExpressionLineIndex(
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
