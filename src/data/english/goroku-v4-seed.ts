// Goroku V4: Session-curated expressions (max 5 per day)
// Auto-curated from Claude conversations, polished to native-level fun

export interface V4Entry {
    daySlot: number;      // 1-31 (day of month)
    month: string;        // "2026-02"
    japanese: string;
    english: string;      // Single best expression (no 4-level)
    context: string;      // Why this expression is useful + cultural note
    category: 'reaction' | 'shutdown' | 'filler' | 'opinion' | 'request' | 'meta';
    source: string;       // Where it came from (session summary)
}

export const V4_SEEDS: V4Entry[] = [

    // =================================================================
    // 2026-02-01 -- Session: Monday morning, zero motivation
    // =================================================================

    {
        daySlot: 1,
        month: '2026-02',
        japanese: 'あー、無理。今日マジで無理',
        english: "I am not functionin' today, don't even try",
        context: "functionin' は「機能してる」。人間に使うと「まともに動いてない」。I'm not functioning は「頭が回ってない・体が動かない」を一言で表現する。マシンが壊れてる感覚で自分を語る英語の面白さ。月曜の朝に最適。",
        category: 'shutdown',
        source: 'Monday morning, zero motivation',
    },
    {
        daySlot: 1,
        month: '2026-02',
        japanese: 'コーヒー飲まないと人間になれない',
        english: "don't talk to me till I've had my coffee, I'm not safe yet",
        context: "I'm not safe yet は「まだ安全じゃない」。コーヒー前の自分を危険人物扱い。safe は「安全」だけど、ここでは「まともに対応できる状態」。yet が「まだその段階に達してない」を追加。till = until のカジュアル形。自分を爆弾に見立てるユーモア。英語は自分の機嫌を他人への警告として発信する。",
        category: 'filler',
        source: 'Monday morning, zero motivation',
    },
    {
        daySlot: 1,
        month: '2026-02',
        japanese: 'やる気スイッチどこだよ',
        english: "where's my motivation? I swear I had some yesterday",
        context: "I swear I had some は「昨日まであったはずなのに」。swear は「誓う」だけど会話では「マジで」の強調。some が motivation を受けてて、やる気を物体みたいに扱ってる。英語は抽象的なものを「持ってる/なくした」で語る。やる気は財布と同じ扱い。",
        category: 'reaction',
        source: 'Monday morning, zero motivation',
    },
    {
        daySlot: 1,
        month: '2026-02',
        japanese: '布団から出たくない、以上',
        english: "my bed is winnin' and I'm not even puttin' up a fight",
        context: "put up a fight は「抵抗する・戦う」。not even putting up a fight で「抵抗すらしてない」=完全敗北。ベッドとの戦いを勝負として語るのが英語的。日本語は「出たくない」で完結するけど、英語は負け試合の実況をする。",
        category: 'opinion',
        source: 'Monday morning, zero motivation',
    },
    {
        daySlot: 1,
        month: '2026-02',
        japanese: '月曜ってだけで罪じゃん',
        english: "Monday should be illegal, honestly",
        context: "should be illegal は「違法にすべき」。嫌いなものに対して「法律で禁止しろ」って言う英語の大げさパターン。That should be illegal(それ禁止にしろ)は日常で使える万能ツッコミ。honestly を最後に付けると「ガチで言ってる」感が出る。",
        category: 'opinion',
        source: 'Monday morning, zero motivation',
    },

    // =================================================================
    // 2026-02-02 -- Session: Code that won't work
    // =================================================================

    {
        daySlot: 2,
        month: '2026-02',
        japanese: '何回やっても同じエラー出るんだけど',
        english: "same error, twentieth time -- at this point it's personal",
        context: "it's personal は「個人的な因縁だ」。ビジネスや問題を「個人的な恨み」に格上げする映画的フレーズ。This isn't business, it's personal はゴッドファーザーの逆パロディ。バグとの戦いを私怨に昇格させるユーモア。at this point は「ここまで来ると」。twentieth time が「20回目」の具体性で絶望の深さを演出。",
        category: 'reaction',
        source: 'Code not working',
    },
    {
        daySlot: 2,
        month: '2026-02',
        japanese: 'なんで動いてたの逆に',
        english: "wait, how was this even workin' before?",
        context: "how was this even working は「これ前はどうやって動いてたの?」。even が「そもそも」の驚きを追加する。「動いてたこと自体がおかしい」というニュアンス。コードが偶然動いてた事実を発見したときの定番リアクション。",
        category: 'reaction',
        source: 'Code not working',
    },
    {
        daySlot: 2,
        month: '2026-02',
        japanese: 'もう全部消して書き直したい',
        english: "I wanna burn it all down and start from scratch",
        context: "burn it all down は「全部燃やす」。start from scratch は「ゼロからやり直す」。scratch は「引っかき傷」=何もない地面から始める。この2つのコンボはエンジニアの定番フレーズ。実際に消す勇気はないけど言いたくなる。",
        category: 'opinion',
        source: 'Code not working',
    },
    {
        daySlot: 2,
        month: '2026-02',
        japanese: 'StackOverflow様に聞くか',
        english: "time to go beggin' the internet for answers",
        context: "go begging は「物乞いに行く」。ネットに「答えください」って頭下げに行く自虐。for answers で「答えを求めて」。プログラマーが Stack Overflow に頼る行為を「物乞い」と表現するユーモア。time to... は「そろそろ〜する時間だ」の便利構文。",
        category: 'filler',
        source: 'Code not working',
    },
    {
        daySlot: 2,
        month: '2026-02',
        japanese: 'あ、セミコロンだった',
        english: "it was a typo. three hours of my life, gone. over a typo.",
        context: "three hours of my life, gone は「人生の3時間が消えた」。gone を一語で突き放す。over a typo は「たかがタイポのために」。over は「〜のせいで」。短い文を連打するリズムがネイティブっぽい。怒りは短文で表現すると伝わる。",
        category: 'shutdown',
        source: 'Code not working',
    },

    // =================================================================
    // 2026-02-03 -- Session: Wallpaper consultation at site
    // =================================================================

    {
        daySlot: 3,
        month: '2026-02',
        japanese: 'お客さんがさ、「なんでもいい」って言うの一番困る',
        english: "\"anything's fine\" is the hardest thing to work with, honestly",
        context: "the hardest thing to work with は「一番扱いにくいもの」。work with は「〜と一緒にやる」で、要望すら work with の対象になる。「なんでもいい」を仕事相手として扱ってる感覚が面白い。anything's fine が逆に一番 fine じゃないというパラドックス。",
        category: 'opinion',
        source: 'Wallpaper consultation at site',
    },
    {
        daySlot: 3,
        month: '2026-02',
        japanese: 'サンプル見せたら「あ、これは違う」って、結局あるじゃん好み',
        english: "funny how \"I don't care\" turns into \"not that one\" real quick",
        context: "funny how は「〜って面白いよね」。皮肉を入れるときの定番オープナー。turns into は「〜に変わる」。real quick は「めっちゃ早く」。「こだわりないです」が一瞬で「それは嫌です」に変わる矛盾を突くフレーズ。接客業あるある。",
        category: 'meta',
        source: 'Wallpaper consultation at site',
    },
    {
        daySlot: 3,
        month: '2026-02',
        japanese: 'まあ俺がいい感じにしますんで',
        english: "leave it to me, I'll make it work",
        context: "leave it to me は「任せてください」。I'll make it work は「なんとかします」。make it work は材料がイマイチでも腕でカバーする職人ニュアンス。Project Runway の Tim Gunn の決め台詞でもある。プロが言うとめちゃくちゃかっこいい。",
        category: 'request',
        source: 'Wallpaper consultation at site',
    },
    {
        daySlot: 3,
        month: '2026-02',
        japanese: 'この柄、実際貼ると全然印象違うんすよ',
        english: "it looks totally different once it's actually up on the wall",
        context: "once it's up は「実際に貼ったら」。once が「〜したら」の時間スイッチ。up on the wall で「壁に上がった状態」。英語は「壁紙が壁に上がる」と表現する。貼る=上げる(put up)。壁紙だけじゃなくて、ポスターも絵も全部 put up。壁は上方向。",
        category: 'opinion',
        source: 'Wallpaper consultation at site',
    },
    {
        daySlot: 3,
        month: '2026-02',
        japanese: '現場着いたら寸法違うとかやめて',
        english: "showin' up to a job and the measurements are off -- that's my nightmare",
        context: "showing up to は「現場に到着する」。off は「ズレてる」。measurements are off で「寸法が合ってない」。off は一語で「正しくない」を表現する。something is off は「何かがおかしい」で超頻出。my nightmare は「俺の悪夢」=最悪のシナリオ。",
        category: 'reaction',
        source: 'Wallpaper consultation at site',
    },

    // =================================================================
    // 2026-02-04 -- Session: Baseball talk (Mariners)
    // =================================================================

    {
        daySlot: 4,
        month: '2026-02',
        japanese: 'マリナーズ、毎年「今年こそ」って言ってる気がする',
        english: "every year it's \"this is our year\" and every year it's not",
        context: "this is our year は「今年は俺たちの年だ」。スポーツファンが毎年シーズン前に言う呪文。and every year it's not で「そして毎年違う」。この対比のリズムが英語のジョーク構造。期待→裏切りを1文で往復する。ファンの悲哀を笑いに変える定番。",
        category: 'opinion',
        source: 'Baseball talk (Mariners)',
    },
    {
        daySlot: 4,
        month: '2026-02',
        japanese: 'トレードの噂だけで1日潰れる',
        english: "I lost a whole day just doom-scrollin' trade rumors",
        context: "doom-scrolling は「悪いニュースを延々スクロールする」。元々はSNSで暗いニュースを見続ける行為だけど、今はトレード情報を追い続ける意味でも使う。lost a whole day は「丸一日失った」。時間を失くし物として扱う英語の感覚。",
        category: 'reaction',
        source: 'Baseball talk (Mariners)',
    },
    {
        daySlot: 4,
        month: '2026-02',
        japanese: '守備はいいんだよ、打てないだけで',
        english: "the defense is solid, they just can't hit to save their lives",
        context: "can't do something to save their lives は「命がかかっても〜できない」。最高に強い「できない」の表現。「死んでも打てない」を英語で言うとこうなる。to save one's life は誇張表現の定番。He can't cook to save his life(あいつの料理は致命的)。",
        category: 'opinion',
        source: 'Baseball talk (Mariners)',
    },
    {
        daySlot: 4,
        month: '2026-02',
        japanese: 'あのトレード、フロントの正気を疑う',
        english: "what were they thinkin'? like, who signed off on that?",
        context: "what were they thinking は「何考えてたの?」。過去進行形で「あの時の判断」を攻撃する。sign off on は「承認する・GOサインを出す」。ビジネスでも日常でも使える。「誰がOK出したの?」は責任追及の一発目。フロントへの怒りに最適。",
        category: 'shutdown',
        source: 'Baseball talk (Mariners)',
    },
    {
        daySlot: 4,
        month: '2026-02',
        japanese: 'でも応援やめられないんだよなあ',
        english: "and yet here I am, still watchin' every game like a clown",
        context: "and yet here I am は「それなのに俺はここにいる」。自虐の黄金フレーズ。like a clown は「ピエロみたいに」。ダメだとわかってるのにやめられない自分をピエロに例える。英語の自虐は「自分を観察して実況する」スタイル。メタ実況パターン。",
        category: 'meta',
        source: 'Baseball talk (Mariners)',
    },

    // =================================================================
    // 2026-02-05 -- Session: Watched too much Netflix
    // =================================================================

    {
        daySlot: 5,
        month: '2026-02',
        japanese: '気づいたら朝4時だった',
        english: "I looked at the clock and it was four in the mornin' -- how?",
        context: "I looked at the clock は「時計を見た」。how? を最後に一語で置くのがポイント。「どうやって4時になったの?」を how? だけで表現。疑問詞一語で文を終える英語のテクニック。驚きと困惑を最短で伝える。Netflix night の定番オチ。",
        category: 'reaction',
        source: 'Watched too much Netflix',
    },
    {
        daySlot: 5,
        month: '2026-02',
        japanese: '「あと1話だけ」が5回目',
        english: "\"just one more episode\" -- I've been tellin' myself that for three hours",
        context: "I've been telling myself は「自分に言い聞かせ続けてる」。現在完了進行形で「ずっとやってる」継続感が出る。just one more は「あと1つだけ」。この just が嘘つきの just。毎回 just って言うけど毎回嘘。just は英語最大の詐欺師。",
        category: 'filler',
        source: 'Watched too much Netflix',
    },
    {
        daySlot: 5,
        month: '2026-02',
        japanese: 'あのドラマ、途中から意味わかんなくなった',
        english: "I was followin' it at first and then it completely lost me",
        context: "lost me は「俺を見失った」。主語がドラマで、ドラマが俺を見失ったという逆転構造。日本語は「俺がわからなくなった」だけど、英語は「作品が俺を置いていった」。理解できない=相手に捨てられた。You lost me(ついていけない)は会議でも使える。",
        category: 'reaction',
        source: 'Watched too much Netflix',
    },
    {
        daySlot: 5,
        month: '2026-02',
        japanese: '寝なきゃいけないのはわかってる',
        english: "I know I should go to bed, I just... won't",
        context: "I know I should は「〜すべきなのはわかってる」。I just won't は「ただ、やらない」。should(すべき)と won't(しない)の対比が自虐の核。わかってるけどやらない。人間の本質を2文で表現。just の後の間(...)が「葛藤ゼロ」を演出してる。",
        category: 'meta',
        source: 'Watched too much Netflix',
    },
    {
        daySlot: 5,
        month: '2026-02',
        japanese: '明日の俺がなんとかするだろ',
        english: "that's future me's problem, present me doesn't care",
        context: "future me は「未来の俺」。英語では自分を時間で分割する。present me(今の俺)と future me(未来の俺)が別人扱い。past me(過去の俺)に怒ることもできる。自分を3人に分けて責任を押し付け合う。英語の自己分裂ユーモア。",
        category: 'shutdown',
        source: 'Watched too much Netflix',
    },

    // =================================================================
    // 2026-02-06 -- Session: Cooking failure
    // =================================================================

    {
        daySlot: 6,
        month: '2026-02',
        japanese: 'レシピ通りにやったはずなのに',
        english: "I followed it to the letter and it still turned out like garbage",
        context: "to the letter は「一字一句その通りに」。letter は「文字」で、レシピの文字を完全再現した意味。Follow the instructions to the letter(指示を一字一句守れ)は契約でも仕事でも使える万能フレーズ。turned out like garbage は「ゴミみたいな出来になった」。完璧に従ったのにゴミ。料理の絶望を1文で凝縮。",
        category: 'reaction',
        source: 'Cooking failure',
    },
    {
        daySlot: 6,
        month: '2026-02',
        japanese: '味見したら「ん？」ってなった',
        english: "took one bite and went \"...huh.\" not great.",
        context: "went \"huh\" は「『ん?』って言った」。go は say の代わりにカジュアルな会話で使う。He goes, she goes は「彼が言った、彼女が言った」。say より臨場感がある。went huh は味見の瞬間を再現してる。not great を後に置くオチの作り方がネイティブっぽい。",
        category: 'reaction',
        source: 'Cooking failure',
    },
    {
        daySlot: 6,
        month: '2026-02',
        japanese: 'もう今日はコンビニでいいや',
        english: "screw it, convenience store run it is",
        context: "screw it は「もういいや」。投げやりの定番。..it is を文末に持ってくる倒置がポイント。A convenience store run it is = 「コンビニ飯に決定」。it is を後ろに回すと「もうこれでいいでしょ」の諦め感が出る。格調高い倒置を投げやりに使うギャップ。",
        category: 'shutdown',
        source: 'Cooking failure',
    },
    {
        daySlot: 6,
        month: '2026-02',
        japanese: '料理できる人マジで尊敬する',
        english: "anyone who can just whip somethin' up from scratch is built different",
        context: "whip something up は「パパッと作る」。whip は「鞭を振る」だけど料理では「手早く仕上げる」。I'll whip something up(なんかパパッと作るよ)は料理できる人の決め台詞。built different は「作りが違う=別格」。元々アスリートへの称賛だけど今は万能の褒め言葉。from scratch は「ゼロから」。3つのキラーフレーズを1文に詰め込んだ贅沢仕様。",
        category: 'opinion',
        source: 'Cooking failure',
    },
    {
        daySlot: 6,
        month: '2026-02',
        japanese: '焦がした。また焦がした',
        english: "burned it. again. I'm startin' to think the problem is me",
        context: "I'm starting to think は「そろそろ気づいてきた」。the problem is me は「問題は俺だ」。「料理が難しい」じゃなくて「俺が問題」と主語を自分に持ってくる自虐構文。starting to think は「薄々わかってたけどやっと認めた」の絶妙な遅さ。",
        category: 'meta',
        source: 'Cooking failure',
    },

    // =================================================================
    // 2026-02-07 -- Session: Writing a note article
    // =================================================================

    {
        daySlot: 7,
        month: '2026-02',
        japanese: '書き出しが決まらない',
        english: "I've been starin' at the first line for twenty minutes",
        context: "staring at は「じっと見つめる」。20分間最初の1行を見つめてる、という状況描写が英語的。日本語は「決まらない」と結果を言うけど、英語は「20分見つめてる」と行動を実況する。状態じゃなくて動作で語る言語。show, don't tell の精神。",
        category: 'filler',
        source: 'Writing a note article',
    },
    {
        daySlot: 7,
        month: '2026-02',
        japanese: '途中まで書いて全部消すやつ',
        english: "wrote half of it, hated it, deleted the whole thing",
        context: "wrote, hated, deleted の3連打。短い動詞を句読点で並べるリズムが英語のストーリーテリング。came, saw, conquered(来た、見た、勝った)と同じ構造。日本語は「〜して〜して」で繋ぐけど、英語は動詞をポンポン並べてテンポを作る。",
        category: 'reaction',
        source: 'Writing a note article',
    },
    {
        daySlot: 7,
        month: '2026-02',
        japanese: '誰が読むんだろうこれ',
        english: "who's even gonna read this? besides me. and maybe my mom.",
        context: "who's even gonna は「そもそも誰が〜するの?」。even が「そもそも」の疑問を追加。besides me は「俺以外で」。and maybe my mom は自虐のオチ。読者が自分と母親だけという悲しい現実を笑いに変える。besides は「〜を除いて」で日常超頻出。",
        category: 'meta',
        source: 'Writing a note article',
    },
    {
        daySlot: 7,
        month: '2026-02',
        japanese: 'あ、いい感じに書けてきた',
        english: "OK wait, this is actually comin' together now",
        context: "coming together は「まとまってきた」。バラバラだったパーツが1つになる感覚。It's all coming together は計画が順調に進んでるときの定番。wait は「ちょっと待って」だけど、ここでは自分の驚きを表現。自分の成果に自分で驚いてる。",
        category: 'reaction',
        source: 'Writing a note article',
    },
    {
        daySlot: 7,
        month: '2026-02',
        japanese: '公開ボタン押すの怖い',
        english: "my finger's on the publish button and I can't press it",
        context: "my finger's on は「指がボタンの上にある」。物理的な描写で心理的な恐怖を伝える。I can't press it は「押せない」。能力じゃなくて勇気の問題。can't が「物理的に不可能」じゃなくて「心理的に無理」の意味で使われてる。日常の can't の8割はこっち。",
        category: 'reaction',
        source: 'Writing a note article',
    },

    // =================================================================
    // 2026-02-08 -- Session: Hate phone calls
    // =================================================================

    {
        daySlot: 8,
        month: '2026-02',
        japanese: '電話してくんなよ、LINEでいいだろ',
        english: "just text me, don't call -- why do people still call?",
        context: "why do people still call は「なぜまだ電話する人がいるの?」。still が「まだ」で時代遅れ感を出す。just text me の just は「〜するだけでいいだろ」。テキストで済む話を電話にする人への苛立ちを全世代共通で表現。introvert の魂の叫び。",
        category: 'shutdown',
        source: 'Hate phone calls',
    },
    {
        daySlot: 8,
        month: '2026-02',
        japanese: '知らない番号は絶対出ない',
        english: "unknown number? straight to voicemail, no exceptions",
        context: "straight to voicemail は「即留守電行き」。straight to は「直行で」。no exceptions は「例外なし」。ルールを宣言するときの断言フレーズ。英語は自分のポリシーを法律みたいに宣言する。My rule is... も同じ。個人ルールを公式化する文化。",
        category: 'shutdown',
        source: 'Hate phone calls',
    },
    {
        daySlot: 8,
        month: '2026-02',
        japanese: '電話だと何言ったか忘れるじゃん',
        english: "calls don't leave a paper trail, that's the problem",
        context: "paper trail は「紙の証拠・記録」。元々は法律用語で「書類の痕跡」。チャットなら履歴が残るけど電話は消える。that's the problem が最後に来て「それが問題なんだよ」とオチをつける。ビジネスでも使える論理的な電話嫌いの理由。",
        category: 'opinion',
        source: 'Hate phone calls',
    },
    {
        daySlot: 8,
        month: '2026-02',
        japanese: '「ちょっと電話いい？」が一番怖い',
        english: "\"got a sec for a quick call?\" -- those words haunt me",
        context: "haunt は「取り憑く」。ホラー映画の幽霊が使う動詞を日常の恐怖に転用。those words haunt me は「あの言葉が俺に取り憑いてる」。大げさに言うことで笑いを作る英語のパターン。haunt は「忘れられない嫌な記憶」にも使う。That haunts me(あれがトラウマ)。",
        category: 'reaction',
        source: 'Hate phone calls',
    },
    {
        daySlot: 8,
        month: '2026-02',
        japanese: '用件をまずテキストで送れ',
        english: "lead with a text, then we'll talk -- maybe",
        context: "lead with は「〜から始める」。プレゼンでも使う。Lead with the data(データから始めろ)。then we'll talk は「それから話そう」。maybe を最後に付けて「まあ気が向いたらね」と逃げ道を残す。maybe の位置が絶妙。文末 maybe は「たぶんやらない」のサイン。",
        category: 'request',
        source: 'Hate phone calls',
    },

    // =================================================================
    // 2026-02-09 -- Session: Terrible weather
    // =================================================================

    {
        daySlot: 9,
        month: '2026-02',
        japanese: '外出たくないレベルの天気',
        english: "it's a \"stay inside and pretend the world doesn't exist\" kinda day",
        context: "it's a ... kinda day は「〜な日だ」。kinda = kind of。中にどんな長いフレーズでも入れられる万能テンプレ。It's a \"do nothing\" kinda day(何もしない日)。日の種類をその場で発明できる。英語のカジュアル表現で最も応用が効くパターンの1つ。",
        category: 'opinion',
        source: 'Terrible weather',
    },
    {
        daySlot: 9,
        month: '2026-02',
        japanese: '傘持ってくの忘れた、最悪',
        english: "forgot my umbrella and now I'm payin' for it",
        context: "paying for it は「その代償を払ってる」。物理的にお金を払うんじゃなくて、過去の判断ミスの罰を受けてる意味。英語は失敗の結果を「支払い」で表現する。You'll pay for this(覚えてろ)も同じ構造。因果応報 = 請求書が届く。",
        category: 'reaction',
        source: 'Terrible weather',
    },
    {
        daySlot: 9,
        month: '2026-02',
        japanese: '天気予報ハズれすぎだろ',
        english: "the forecast said sunny -- the forecast lied",
        context: "the forecast lied は「天気予報が嘘をついた」。無生物を主語にして「嘘をついた」と人間扱いする英語の擬人化。GPS lied to me(ナビが嘘ついた)、my alarm betrayed me(アラームに裏切られた)。機械を人間として弾劾する英語の面白さ。",
        category: 'shutdown',
        source: 'Terrible weather',
    },
    {
        daySlot: 9,
        month: '2026-02',
        japanese: 'この湿気なんとかならんの',
        english: "the humidity is out of control, I'm literally meltin'",
        context: "out of control は「制御不能」。humidity(湿度)が暴走してる感覚。I'm literally melting は「文字通り溶けてる」。literally は本来「文字通り」だけど、今は「マジで」の強調で使う。literally が literally の意味で使われない皮肉。英語の進化を体現する一語。",
        category: 'reaction',
        source: 'Terrible weather',
    },
    {
        daySlot: 9,
        month: '2026-02',
        japanese: '洗濯物、終わった',
        english: "my laundry's done for, it's been sittin' out there all day",
        context: "done for は「もうダメだ・終わった」。done(終了)とは全然違う。done for = 救いようがない。sittin' out there は「外に放置されてる」。sit は「座る」だけじゃなくて「放置されてる」意味がある。The food's just sitting there(料理が放置されてる)。sit は静物の存在動詞。",
        category: 'filler',
        source: 'Terrible weather',
    },

    // =================================================================
    // 2026-02-10 -- Session: Complaining about English study
    // =================================================================

    {
        daySlot: 10,
        month: '2026-02',
        japanese: '読めるけど喋れない、この現象なに',
        english: "I can read it fine, I just can't get it out of my mouth",
        context: "get it out of my mouth は「口から出せない」。知識が頭にあるけど口から出てこない。get out は「外に出す」。英語は理解と発話を完全に別スキルとして扱う。I know the word, it's on the tip of my tongue(喉まで出かかってる)も近い表現。tip of my tongue は超有名。",
        category: 'opinion',
        source: 'Complaining about English study',
    },
    {
        daySlot: 10,
        month: '2026-02',
        japanese: '文法はわかるのに会話になると飛ぶ',
        english: "the second someone talks to me in English, my brain goes blank",
        context: "the second は「〜した瞬間」。the moment、the minute と同じだけど the second が一番「一瞬」感が強い。goes blank は「真っ白になる」。blank は「空白」。my mind went blank は「頭が真っ白になった」で試験・面接・会話のパニック全般に使える。",
        category: 'reaction',
        source: 'Complaining about English study',
    },
    {
        daySlot: 10,
        month: '2026-02',
        japanese: '英語の勉強法が多すぎて逆に何もできない',
        english: "total analysis paralysis -- too many options, zero progress",
        context: "analysis paralysis は「考えすぎて動けなくなること」。分析(analysis)で麻痺(paralysis)する。韻を踏んでるから一発で覚える。ビジネスでもプライベートでも超使える。I'm stuck in analysis paralysis(考えすぎてフリーズしてる)。選択肢が多すぎて逆に何も選べない現代病を一語で表現した天才ワード。",
        category: 'meta',
        source: 'Complaining about English study',
    },
    {
        daySlot: 10,
        month: '2026-02',
        japanese: '字幕なしで映画観れる日来るのかな',
        english: "will I ever get to the point where I don't need subtitles?",
        context: "get to the point where は「〜のレベルに到達する」。point は「地点」で、人生を地図のように扱う。where 以下が到達先の描写。will I ever は「いつか俺は〜できるのか?」。ever が「一生のうちに」の切なさを追加。希望と諦めが同居する疑問文。",
        category: 'filler',
        source: 'Complaining about English study',
    },
    {
        daySlot: 10,
        month: '2026-02',
        japanese: 'ネイティブの速さ、チートだろ',
        english: "native speakers talk so fast it should be considered cheatin'",
        context: "it should be considered は「〜と見なすべきだ」。受動態で「世間がそう判断すべき」の客観風ジョーク。cheating は「ズル」。ネイティブの速さをチートと呼ぶユーモア。so ... it should be は「〜すぎて〜すべき」の誇張パターン。不満を笑いに変換する構造。",
        category: 'shutdown',
        source: 'Complaining about English study',
    },

    // =================================================================
    // 2026-02-11 -- Session: Tax filing panic
    // =================================================================

    {
        daySlot: 11,
        month: '2026-02',
        japanese: '確定申告、見なかったことにしたい',
        english: "I'm just gonna pretend tax season isn't happening",
        context: "pretend ... isn't happening は「起きてないフリをする」。現実逃避の定番表現。tax season は「確定申告の時期」。アメリカでも4月15日締切で毎年パニックになる。pretend は「フリをする」で、一時的な精神安定剤として機能。大人の現実逃避は万国共通。",
        category: 'shutdown',
        source: 'Tax filing panic',
    },
    {
        daySlot: 11,
        month: '2026-02',
        japanese: 'レシート、どこ行った',
        english: "I had the receipts, I know I did -- where'd they go?",
        context: "I know I did は「絶対あったはず」。確信を追加する挿入句。where'd they go は where did they go の短縮。英語はモノが「行った(went)」と表現する。日本語は「どこにある?」と存在を聞くけど、英語は「どこに行った?」と移動を追う。レシートが歩いて逃げた前提。",
        category: 'reaction',
        source: 'Tax filing panic',
    },
    {
        daySlot: 11,
        month: '2026-02',
        japanese: '経費の計算、永遠に終わらない',
        english: "been crunchin' numbers all day and my eyes are glazin' over",
        context: "crunch numbers は「数字をガリガリ計算する」。crunch は「バリバリ噛む」音だけど数字に使うと「必死に計算する」。number cruncher は「計算屋・会計士」。glaze over は「目がトロンとする」。退屈や疲労で焦点が合わなくなる。His eyes glazed over(彼の目が死んだ)は会議中の定番描写。2つのキラーフレーズを1文に詰め込んだ贅沢仕様。",
        category: 'filler',
        source: 'Tax filing panic',
    },
    {
        daySlot: 11,
        month: '2026-02',
        japanese: '来年こそちゃんとやる（毎年言ってる）',
        english: "next year I'll stay on top of it -- I say that every year though",
        context: "stay on top of は「ちゃんと管理し続ける」。上に乗り続ける=制御下に置く。I say that every year は「毎年言ってる」。though を文末に付けて「でもね」の自虐オチ。自分の嘘を自分で暴露するメタ構文。though の文末使いは英語の「けどね」。",
        category: 'meta',
        source: 'Tax filing panic',
    },
    {
        daySlot: 11,
        month: '2026-02',
        japanese: '税理士に丸投げしたい',
        english: "can I just hand this whole mess off to someone?",
        context: "hand off は「引き渡す」。hand over とほぼ同じだけど hand off はスポーツの「パスする」ニュアンスがある。whole mess は「このぐちゃぐちゃ全部」。mess は「混乱」で自分の状況を正直に認めてる。can I just は「〜するだけでいい?」の願望フレーズ。",
        category: 'request',
        source: 'Tax filing panic',
    },

    // =================================================================
    // 2026-02-12 -- Session: What to eat for lunch
    // =================================================================

    {
        daySlot: 12,
        month: '2026-02',
        japanese: '昼何食うか30分悩んでる',
        english: "I've been goin' back and forth on lunch for half an hour",
        context: "go back and forth は「行ったり来たりする」=「迷ってる」。物理的な往復じゃなくて思考の往復。on lunch は「昼飯について」。for half an hour は「30分間」。決められない自分を実況中継するスタイル。back and forth は交渉でも使う。We went back and forth(何度もやりとりした)。",
        category: 'filler',
        source: 'What to eat for lunch',
    },
    {
        daySlot: 12,
        month: '2026-02',
        japanese: '結局いつもの店になる',
        english: "I always end up at the same place, every single time",
        context: "end up at は「結局〜にたどり着く」。every single time は「毎回毎回」。single が「1回も例外なく」を強調する。every time でも同じ意味だけど single を挟むと「マジで毎回」の重みが増す。パターンから抜け出せない自分への呆れ。",
        category: 'meta',
        source: 'What to eat for lunch',
    },
    {
        daySlot: 12,
        month: '2026-02',
        japanese: 'ラーメンは楽だけど健康的にはアウト',
        english: "ramen's the easy choice but my body's gonna hate me later",
        context: "my body's gonna hate me は「体が後で俺を恨む」。未来の体を別人として扱う。hate me later は「後で怒られる」の擬人化。easy choice は「楽な選択」。gonna が going to のカジュアル形。自分の体と交渉してる感覚。英語は体のパーツが独立して怒る。",
        category: 'opinion',
        source: 'What to eat for lunch',
    },
    {
        daySlot: 12,
        month: '2026-02',
        japanese: 'もうカップ麺でいいかな',
        english: "you know what, cup noodles it is -- I've given up",
        context: "you know what は「もういいや」の切り替えスイッチ。直訳は「知ってる?」だけど会話では「よし決めた」の宣言。I've given up は「諦めた」。give up は降参。cup noodles it is は倒置で「カップ麺に決定」。it is の倒置は諦めの決断に似合う。",
        category: 'shutdown',
        source: 'What to eat for lunch',
    },
    {
        daySlot: 12,
        month: '2026-02',
        japanese: '食べたいものがないんじゃなくて、選べないだけ',
        english: "it's not that I don't want anything, I want everything and can't pick",
        context: "it's not that は「〜ってわけじゃない」。否定の否定で正確に説明する構文。I want everything and can't pick は「全部食べたいけど選べない」。pick は choose のカジュアル版。it's not that A, it's that B は「AじゃなくてBなんだよ」の訂正パターン。論理的に自分を弁護する構文。",
        category: 'opinion',
        source: 'What to eat for lunch',
    },

    // =================================================================
    // 2026-02-13 -- Session: AI talk
    // =================================================================

    {
        daySlot: 13,
        month: '2026-02',
        japanese: 'AIに仕事奪われるって言うけど、もう奪われてない？',
        english: "people keep sayin' AI's gonna take our jobs -- isn't it already?",
        context: "keep saying は「ずっと言い続けてる」。isn't it already は「もう取られてない?」。already が「もう手遅れでは」の不安を1語で表現。疑問文を文末に投げるレトリカル・クエスチョン。答えは求めてない。「気づけよ」って意味。",
        category: 'opinion',
        source: 'AI talk',
    },
    {
        daySlot: 13,
        month: '2026-02',
        japanese: 'プロンプト書くの結局スキルだよな',
        english: "turns out promptin' is a whole skill in itself",
        context: "turns out は「結局〜だとわかった」。予想外の事実を報告する。a whole skill in itself は「それ自体が1つの完全なスキル」。whole が「まるまる1つの」を強調。in itself は「それだけで」。思ってたより奥が深い、という発見をコンパクトに伝える。",
        category: 'opinion',
        source: 'AI talk',
    },
    {
        daySlot: 13,
        month: '2026-02',
        japanese: 'AIの回答、長すぎるんだよ',
        english: "dude, just give me the short version, I don't need a lecture",
        context: "give me the short version は「短いバージョンをくれ」。version で回答をバージョン管理してる感覚。I don't need a lecture は「講義は要らない」。lecture は「退屈な長話」のニュアンスがある。AIの長文回答への苛立ちは英語圏でも共通。dude はカジュアルな呼びかけ。",
        category: 'request',
        source: 'AI talk',
    },
    {
        daySlot: 13,
        month: '2026-02',
        japanese: '結局自分で直すから二度手間',
        english: "I end up fixin' it myself anyway, so what's the point?",
        context: "what's the point は「意味あるの?」。point は「要点・意味」。直訳は「ポイントは何?」だけど、実質「無駄じゃない?」の反語。anyway は「どうせ」。end up fixing は「結局直すハメになる」。anyway + what's the point のコンボは「徒労感」の最強表現。",
        category: 'meta',
        source: 'AI talk',
    },
    {
        daySlot: 13,
        month: '2026-02',
        japanese: 'でもAIなしにはもう戻れない',
        english: "hate to admit it, but there's no goin' back now",
        context: "hate to admit it は「認めたくないけど」。認めたくない事実を認める前置き。there's no going back は「もう後戻りできない」。no + -ing は「〜する余地がない」。going back(戻ること)が存在しない=不可逆。テクノロジー依存を認める定番フレーズ。",
        category: 'filler',
        source: 'AI talk',
    },

    // =================================================================
    // 2026-02-14 -- Session: Valentine's? Don't care
    // =================================================================

    {
        daySlot: 14,
        month: '2026-02',
        japanese: 'バレンタインとか俺には関係ない行事',
        english: "Valentine's Day is not my department, never has been",
        context: "not my department は「俺の担当じゃない」。仕事の「管轄外」を私生活に転用するユーモア。never has been は「一度もそうだったことがない」。現在完了で「過去から今まで一貫して無関係」を強調。department を使うことで恋愛を業務として突き放す。",
        category: 'shutdown',
        source: "Valentine's? Don't care",
    },
    {
        daySlot: 14,
        month: '2026-02',
        japanese: 'チョコ売り場の圧がすごい',
        english: "the chocolate section is givin' me anxiety I didn't ask for",
        context: "giving me anxiety は「不安にさせる」。I didn't ask for は「頼んでない」。頼んでもいない不安を勝手に渡される被害者感。give + 人 + 感情 は英語の便利構文。This gives me hope(希望をくれる)、That gives me the creeps(ゾッとする)。感情を渡す動詞が give。",
        category: 'reaction',
        source: "Valentine's? Don't care",
    },
    {
        daySlot: 14,
        month: '2026-02',
        japanese: '1人で焼肉行くほうがいい',
        english: "I'd rather hit up yakiniku solo than deal with all that",
        context: "I'd rather は「〜するほうがマシ」。比較して選ぶ構文。hit up は「行く」のカジュアル版。solo は「1人で」。deal with all that は「あの全部に対処する」。deal with は「面倒なことに向き合う」ニュアンス。I don't wanna deal with it(面倒くさい)は日常で超頻出。",
        category: 'opinion',
        source: "Valentine's? Don't care",
    },
    {
        daySlot: 14,
        month: '2026-02',
        japanese: 'SNSのカップル投稿、別にいいけどさ',
        english: "I'm happy for them, I guess, in theory, maybe",
        context: "I'm happy for them は「彼らのために嬉しい」。for が「彼らのために」。I guess, in theory, maybe と3段階で確信を下げていくのがこのフレーズの真骨頂。言うたびに本音が漏れる。「嬉しい」→「たぶん」→「理論上は」→「かもね」。グラデーション自虐。",
        category: 'filler',
        source: "Valentine's? Don't care",
    },
    {
        daySlot: 14,
        month: '2026-02',
        japanese: '半額チョコは明日買う、それが本番',
        english: "half-price chocolate tomorrow -- that's the real Valentine's Day",
        context: "that's the real は「それが本物の〜だ」。本物を再定義する構文。half-price は「半額」。価格を形容詞にしてそのまま名詞の前に置く英語の合理性。the real + 名詞 は「本質はこっちだ」の宣言。ジョークでも哲学でも使える。本質を書き換える力がある。",
        category: 'meta',
        source: "Valentine's? Don't care",
    },

    // =================================================================
    // 2026-02-15 -- Session: Skipped the gym
    // =================================================================

    {
        daySlot: 15,
        month: '2026-02',
        japanese: '今日はいいや、明日やろう（フラグ）',
        english: "I'll do it tomorrow -- and we both know that's a lie",
        context: "we both know は「お互いわかってるよね」。自分の嘘を聞き手と共犯にする。that's a lie は「それ嘘だけど」。自分で言って自分で否定する。I'll do it tomorrow は全人類共通の嘘。we both know が入ることで自己認識してるのに止められない人間の弱さを表現。",
        category: 'meta',
        source: 'Skipped the gym',
    },
    {
        daySlot: 15,
        month: '2026-02',
        japanese: '体動かさないとダメなのわかってるけど',
        english: "I know workin' out is good for me, I just don't wanna",
        context: "I know ... I just don't wanna は「わかってるけどやりたくない」。知識と行動の乖離を2文で完璧に表現。wanna = want to。just が「ただ単に」で理由の浅さを正直に認めてる。深い理由はない。ただやりたくない。この正直さが英語の自虐の核。",
        category: 'opinion',
        source: 'Skipped the gym',
    },
    {
        daySlot: 15,
        month: '2026-02',
        japanese: 'ジム代だけ払い続けてる',
        english: "I'm basically donatin' to the gym at this point",
        context: "donating to は「寄付してる」。会費を払って行かないことを「寄付」と呼ぶ自虐。at this point は「もはや・ここまで来ると」。時間の経過で状況が変質したことを示す。basically が「実質的に」で言い換えの合図。会員費 = 寄付金。痛い真実。",
        category: 'filler',
        source: 'Skipped the gym',
    },
    {
        daySlot: 15,
        month: '2026-02',
        japanese: 'YouTubeで筋トレ動画見て満足してる',
        english: "I watched a workout video and counted that as exercise",
        context: "counted that as は「〜としてカウントした」。count A as B は「AをBと見なす」。動画を見ただけなのに運動としてカウントする自己欺瞞。count as は判定基準をズラす便利な表現。Does this count as a date?(これデートにカウントしていい?)。",
        category: 'reaction',
        source: 'Skipped the gym',
    },
    {
        daySlot: 15,
        month: '2026-02',
        japanese: '階段使ったから今日はOKということで',
        english: "took the stairs today so technically I worked out",
        context: "technically は「厳密に言えば」。嘘スレスレの主張を正当化するときに使う。technically correct(技術的には正しい)は自分を納得させるための魔法の言葉。took the stairs は「階段を使った」。take は「選ぶ・利用する」の意味。technically は言い訳の守護神。",
        category: 'shutdown',
        source: 'Skipped the gym',
    },

    // =================================================================
    // 2026-02-16 -- Session: Found a new tool
    // =================================================================

    {
        daySlot: 16,
        month: '2026-02',
        japanese: 'これやばい、めっちゃ便利',
        english: "OK this is a game changer, I can already tell",
        context: "game changer は「ゲームを変えるもの」=「革命的」。I can already tell は「もうわかる」。まだ使い始めたばかりなのに「これは違う」と直感する瞬間。already が即断の速さを強調。tell は「わかる・判断する」。I can tell は「見ればわかる」で超頻出。",
        category: 'reaction',
        source: 'Found a new tool',
    },
    {
        daySlot: 16,
        month: '2026-02',
        japanese: '今まで何で使ってなかったの俺',
        english: "where has this been all my life?",
        context: "where has this been all my life は「これ今まで俺の人生のどこにいたの?」。出会いが遅すぎた感動を表現する定番フレーズ。食べ物、ツール、音楽、何にでも使える。all my life が大げさだけどそこがいい。恋に落ちた瞬間のテンション。モノに対して使うのがポイント。",
        category: 'reaction',
        source: 'Found a new tool',
    },
    {
        daySlot: 16,
        month: '2026-02',
        japanese: '設定に3時間溶けた',
        english: "I went down a rabbit hole settin' it up and lost three hours",
        context: "rabbit hole は「うさぎの穴」=「深みにハマる」。不思議の国のアリスが由来。go down a rabbit hole は「気づいたら深くまで入り込んでた」。ネットサーフィン、設定、調べ物で時間が消えるときに使う。lost three hours は「3時間を失った」。時間は財産。",
        category: 'filler',
        source: 'Found a new tool',
    },
    {
        daySlot: 16,
        month: '2026-02',
        japanese: '前のツールに戻れない体になった',
        english: "I'm ruined, I can never go back to the old one now",
        context: "I'm ruined は「俺はもうダメだ」。良いものを知ってしまって以前のものに戻れなくなった状態。ruin は「台無しにする」だけど、ここでは「良い経験に台無しにされた」という逆説。can never go back は「二度と戻れない」。品質の一方通行。",
        category: 'shutdown',
        source: 'Found a new tool',
    },
    {
        daySlot: 16,
        month: '2026-02',
        japanese: '誰かに教えたいけど誰も興味ない',
        english: "I wanna tell someone about this but nobody in my life would care",
        context: "nobody in my life は「俺の人生にいる誰も」。周りに同じ趣味の人がいない孤独。would care は仮定法で「関心を持つだろう(けど持たない)」。wanna tell someone は「誰かに言いたい」。テック系の発見を共有できない一人暮らしの寂しさを凝縮。",
        category: 'opinion',
        source: 'Found a new tool',
    },

    // =================================================================
    // 2026-02-17 -- Session: Couldn't sleep
    // =================================================================

    {
        daySlot: 17,
        month: '2026-02',
        japanese: '3時に目が覚めてそっから寝れない',
        english: "woke up at three and my brain just refused to shut off",
        context: "refused to shut off は「シャットダウンを拒否した」。脳がPC みたいに拒否する擬人化。shut off は「電源を切る」。my brain refused は脳を自分と別の意志を持つ存在として扱う英語の面白さ。I couldn't sleep より「脳のせい」にできる。責任転嫁の擬人化。",
        category: 'reaction',
        source: "Couldn't sleep",
    },
    {
        daySlot: 17,
        month: '2026-02',
        japanese: '寝る前にスマホ見るのやめろって自分',
        english: "I know screens before bed are bad and I do it anyway 'cause I'm a genius",
        context: "'cause I'm a genius は「なぜなら俺は天才だから」。100%の反語。やっちゃいけないことをやる自分への皮肉。I do it anyway は「それでもやる」。anyway は「どうせ」で、知識があっても行動が変わらない人間の本質。反語で自虐するのは英語圏の得意技。",
        category: 'meta',
        source: "Couldn't sleep",
    },
    {
        daySlot: 17,
        month: '2026-02',
        japanese: '眠いのに寝れない拷問',
        english: "bein' exhausted but unable to sleep is actual torture",
        context: "actual torture は「ガチの拷問」。actual が「マジの」強調。being A but unable to B は「AなのにBできない」の矛盾構文。unable は can't よりフォーマルだけど、actual torture との組み合わせでギャップが面白くなる。大げさとフォーマルのミックス。",
        category: 'opinion',
        source: "Couldn't sleep",
    },
    {
        daySlot: 17,
        month: '2026-02',
        japanese: '明日の会議のこと考え始めてもう終わり',
        english: "started thinkin' about tomorrow's meeting and that was it -- game over",
        context: "that was it は「もうそれで終わり」。it が「全て」を指す。game over は「ゲームオーバー」。ゲーム用語を日常に転用。started thinking は「考え始めた」。考え始めた瞬間にもう眠れない。that was it は「取り返しがつかない瞬間」を示すタイミング表現。",
        category: 'shutdown',
        source: "Couldn't sleep",
    },
    {
        daySlot: 17,
        month: '2026-02',
        japanese: '結局寝たのか寝てないのかわからない',
        english: "did I sleep? I honestly couldn't tell you",
        context: "I couldn't tell you は「自分でもわからない」。tell は「言う」だけど「判断する・区別する」の意味もある。I can't tell the difference(違いがわからない)。couldn't tell you は「聞かれても答えられない」の定番。自分の睡眠状態すら判定不能。couldn't は能力の否定。",
        category: 'filler',
        source: "Couldn't sleep",
    },

    // =================================================================
    // 2026-02-18 -- Session: Junior's sloppy work
    // =================================================================

    {
        daySlot: 18,
        month: '2026-02',
        japanese: 'なんでこれでOK出したの自分で',
        english: "how did you look at this and think \"yeah, that's good enough\"?",
        context: "look at this and think は「これを見て〜と思った」。2つの動作を and で繋いで「見た結果→判断した」の因果を作る。good enough は「十分良い」だけど、ここでは皮肉。「これでOKだと?」の不満。how did you は「どうやったら」=「信じられない」の反語。",
        category: 'shutdown',
        source: "Junior's sloppy work",
    },
    {
        daySlot: 18,
        month: '2026-02',
        japanese: '雑すぎてどこからツッコめばいいかわからない',
        english: "there's so much wrong I don't even know where to start",
        context: "I don't know where to start は「どこから始めればいいかわからない」。問題が多すぎて着手点が見つからない。so much wrong は「間違いが多すぎる」。where to start は疑問詞 + to 不定詞の便利構文。what to do(何すればいい)、how to fix it(どう直せばいい)。",
        category: 'reaction',
        source: "Junior's sloppy work",
    },
    {
        daySlot: 18,
        month: '2026-02',
        japanese: '自分でやったほうが早いまである',
        english: "at this rate, I might as well just do it myself",
        context: "might as well は「〜したほうがマシ」。消極的選択。他に良い選択肢がないから「もういっそ」。at this rate は「このペースだと」。rate は「速度・割合」。do it myself は「自分でやる」。might as well は「仕方ないからこっちにする」の諦めが入ってる。積極的な選択じゃない。",
        category: 'opinion',
        source: "Junior's sloppy work",
    },
    {
        daySlot: 18,
        month: '2026-02',
        japanese: '教えるのも体力いるんだよ',
        english: "teachin' someone takes more outta you than just doin' it yourself",
        context: "takes more out of you は「もっと消耗させる」。take out of は「〜から奪う」。エネルギーを奪われる感覚。outta = out of のカジュアル形。than just doing it yourself は「自分でやるより」。教育コストが実作業より高いという大人の現実。takes it out of me は「疲れ果てる」。",
        category: 'opinion',
        source: "Junior's sloppy work",
    },
    {
        daySlot: 18,
        month: '2026-02',
        japanese: 'まあ俺も最初はこんなもんだったか',
        english: "I mean, I was probably just as bad when I started out",
        context: "just as bad は「同じくらいダメだった」。just as は「ちょうど同じくらい」。when I started out は「始めた頃」。start out は start より「最初の一歩」感が強い。probably が「たぶん」で記憶の曖昧さを認めつつ自分を許してる。怒りから共感への転換。大人の余裕。",
        category: 'filler',
        source: "Junior's sloppy work",
    },

    // =================================================================
    // 2026-02-19 -- Session: Want a beer
    // =================================================================

    {
        daySlot: 19,
        month: '2026-02',
        japanese: '今日はもうビールでいいだろ',
        english: "I think I've earned a beer at this point",
        context: "earned は「稼いだ・獲得した」。ビールを「稼いだ」と表現する。頑張った報酬として飲む権利がある、というロジック。at this point は「もはや」。I've earned it は「俺にはその資格がある」の自己正当化。英語は飲酒を「報酬」として語る。労働→報酬→ビール。",
        category: 'opinion',
        source: 'Want a beer',
    },
    {
        daySlot: 19,
        month: '2026-02',
        japanese: '風呂上がりのビールが人生のピーク',
        english: "a cold beer after a hot bath -- that's peak existence right there",
        context: "peak existence は「存在のピーク」。peak は「頂点」。人生の頂点をビールの瞬間に設定する大げささ。right there は「まさにそこ」で断定を強める。that's peak + 名詞 は「それこそが究極の〜だ」。That's peak comedy(あれこそ究極のコメディ)。何にでも使える。",
        category: 'reaction',
        source: 'Want a beer',
    },
    {
        daySlot: 19,
        month: '2026-02',
        japanese: '発泡酒じゃなくてちゃんとしたやつ飲みたい',
        english: "I don't want the cheap stuff, I want the real deal tonight",
        context: "the real deal は「本物」。deal は「取引」で、「本物の取引=本物の商品」。cheap stuff は「安物」。stuff は何にでも使える万能名詞。the good stuff(いいやつ)、the hard stuff(強い酒)、the right stuff(適任者)。stuff は英語の「やつ」。",
        category: 'request',
        source: 'Want a beer',
    },
    {
        daySlot: 19,
        month: '2026-02',
        japanese: 'つまみは何があったかな',
        english: "what do I have that goes with beer... let me check",
        context: "goes with は「〜に合う」。go with は「一緒に行く」が元の意味だけど、食べ物・飲み物の相性に使う。Red wine goes with steak(赤ワインはステーキに合う)。let me check は「確認させて」。let me は「〜させてくれ」の許可要求。自分に許可を出す不思議。",
        category: 'filler',
        source: 'Want a beer',
    },
    {
        daySlot: 19,
        month: '2026-02',
        japanese: 'あー、沁みる',
        english: "oh man, that hits different after a long day",
        context: "hits different は「いつもと違う効き方をする」。最近のスラングで「格別にいい」。that hits は「効く・刺さる」。after a long day は「長い1日の後で」。oh man は感嘆詞で「あー」に最も近い。hits different は Z世代発だけどもう全世代に浸透した。疲れた後のビールに最適。",
        category: 'reaction',
        source: 'Want a beer',
    },

    // =================================================================
    // 2026-02-20 -- Session: No weekend plans
    // =================================================================

    {
        daySlot: 20,
        month: '2026-02',
        japanese: '予定？ないけど',
        english: "plans? nah. and I'm completely fine with that",
        context: "I'm completely fine with that は「それで全然いい」。fine with は「〜で構わない」。completely が「完全に」で強調。「予定なし」を堂々と肯定する。nah は no のカジュアル版。plans? nah. の2語で質問と回答が完結する効率の良さ。ミニマリスト英語。",
        category: 'shutdown',
        source: 'No weekend plans',
    },
    {
        daySlot: 20,
        month: '2026-02',
        japanese: '何もしない贅沢を知ってるかお前は',
        english: "doin' absolutely nothin' is an art form and I've mastered it",
        context: "art form は「芸術」。何もしないことを「芸術」に格上げする。mastered は「極めた」。master は動詞で「習得する」。an art form は「それ自体が芸術だ」と言いたいときの定番。Cooking is an art form(料理は芸術だ)。何でも art form にできる。怠惰の正当化に最適。",
        category: 'opinion',
        source: 'No weekend plans',
    },
    {
        daySlot: 20,
        month: '2026-02',
        japanese: 'ソファから動かない宣言',
        english: "I'm plantin' myself on this couch and I'm not movin' till Monday",
        context: "planting myself は「自分を植える」。plant は「植物を植える」。自分をソファに植え付けて動かない宣言。root(根を張る)と似てるけど plant のほうが「意図的に動かない」。英語は人間を植物に例える表現が多い。I'm rooted to the spot(その場に根が生えた)。",
        category: 'meta',
        source: 'No weekend plans',
    },
    {
        daySlot: 20,
        month: '2026-02',
        japanese: '休みの日に早く起きるの損した気分',
        english: "wakin' up early on a day off feels like a waste of a perfectly good sleep-in",
        context: "a perfectly good は「せっかくの」。perfectly good を壊す/無駄にすると「もったいない」。a waste of は「〜の無駄」。sleep-in は「朝寝坊」を名詞化したもの。a perfectly good sleep-in を waste するという表現が英語的。もったいない = waste of a perfectly good + 名詞。",
        category: 'filler',
        source: 'No weekend plans',
    },
    {
        daySlot: 20,
        month: '2026-02',
        japanese: '結局ダラダラしてたら日曜終わる',
        english: "Sunday just kinda... happens, and then it's over, and I've done nothin'",
        context: "Sunday just happens は「日曜がただ起きる」。日曜日が勝手に過ぎていく受動感。kinda と ... の間が「ぼんやり」を音で表現。and then it's over は「そして終わる」。I've done nothing は「何もしてない」。3つの短文連打で「気づいたら終わってた」テンポを作る。",
        category: 'reaction',
        source: 'No weekend plans',
    },

    // =================================================================
    // 2026-02-21 -- Session: It's Monday again
    // =================================================================

    {
        daySlot: 21,
        month: '2026-02',
        japanese: 'え、もう月曜？',
        english: "wait, it's Monday already? who authorized this?",
        context: "who authorized this は「誰がこれを許可した?」。月曜の到来を「無許可の行為」として抗議する。authorize は「正式に許可する」で、ビジネス用語を月曜への怒りに転用。already は「もう」で時間の速さへの不満。お役所言葉で曜日に文句言うギャップが笑いになる。",
        category: 'reaction',
        source: "It's Monday again",
    },
    {
        daySlot: 21,
        month: '2026-02',
        japanese: '週末短すぎない？バグだろこれ',
        english: "weekends are way too short, it's gotta be a glitch in the system",
        context: "a glitch in the system は「システムのバグ」。現実世界をプログラムに見立てる表現。way too short は「あまりにも短い」。way が too を強調する副詞。gotta = got to = have to。it's gotta be は「〜に違いない」。エンジニア的な世界観で日常の不満を語るスタイル。",
        category: 'opinion',
        source: "It's Monday again",
    },
    {
        daySlot: 21,
        month: '2026-02',
        japanese: 'あと5日頑張れば休みだ（遠い）',
        english: "only five more days... five. that's basically a lifetime",
        context: "only five more days は「あと5日だけ」。only で少なく見せようとしてるのに、直後の five. で「5日」の重さを再認識する。that's basically a lifetime は「実質一生」。basically が「実質的に」。5日を一生に例える大げささ。英語は距離感を伸縮自在に操る。",
        category: 'filler',
        source: "It's Monday again",
    },
    {
        daySlot: 21,
        month: '2026-02',
        japanese: 'とりあえずコーヒー入れてから考える',
        english: "first things first -- coffee, then I'll figure out the rest",
        context: "first things first は「まず最初のことから」。優先順位を宣言する定番フレーズ。figure out は「なんとかする・解決する」。the rest は「残り全部」。コーヒーを最優先にして他を後回しにする。figure out は plan より「手探りでなんとかする」ニュアンス。即興感。",
        category: 'request',
        source: "It's Monday again",
    },
    {
        daySlot: 21,
        month: '2026-02',
        japanese: 'まあ、やるしかないか',
        english: "welp, it is what it is -- let's get this over with",
        context: "it is what it is は「しょうがない」。英語圏の「まあ、そういうもんだ」。受け入れの表現で超頻出。get this over with は「さっさと終わらせる」。over with は「終了させる」。welp は well のカジュアル版で、諦めと覚悟が同居する音。月曜の朝に最も似合うフレーズ。",
        category: 'filler',
        source: "It's Monday again",
    },

    // =================================================================
    // 2026-02-22 -- Session: goroku-v3 build + thumbnail generator
    // =================================================================

    {
        daySlot: 22,
        month: '2026-02',
        japanese: '勝手にログアウトしたんだよお前が',
        english: "don't pin that on me -- you're the one who bailed",
        context: "pin something on someoneは「罪をなすりつける」。bail は「逃げる・ドタキャンする」。この2つをセットで使うと「俺のせいにすんなよ、消えたのお前だろ」が一発で言える。友達同士のケンカで最強の切り返し。",
        category: 'shutdown',
        source: 'Session: goroku-v3 build',
    },
    {
        daySlot: 22,
        month: '2026-02',
        japanese: 'いたいいたい（笑）いたい',
        english: "oh god, I can't unsee that... that is physically painful",
        context: "can't unsee は「一度見たら忘れられない（悪い意味で）」。ネットスラング発祥だけど日常会話でも普通に使う。physically painful は本当に体が痛いわけじゃなくて「見てるこっちが恥ずかしい」の最上級。cringe より大人っぽい表現。",
        category: 'reaction',
        source: 'Session: goroku-v3 build',
    },
    {
        daySlot: 22,
        month: '2026-02',
        japanese: 'BEERはないだろｗ',
        english: "c'mon, you can't just slap that on there and call it a day",
        context: "slap something on は「雑に貼り付ける・適当に置く」。call it a day は「これで終わりにする」。組み合わせると「適当にやって終わりにすんなよ」。デザインレビューでも仕事でも使える万能ツッコミ。you can't just... は「さすがにそれは...」の黄金パターン。",
        category: 'shutdown',
        source: 'Session: goroku-v3 build',
    },
    {
        daySlot: 22,
        month: '2026-02',
        japanese: 'あとは苦しむだけかな（笑）なぜか（笑）',
        english: "all that's left is the hard part, and somehow I keep signin' up for it",
        context: "sign up for は「自ら志願する」。I keep signing up for it で「なぜか毎回自分からやりに行く」。自虐ネタの定番構文。somehow が効いてる -- 「なぜか」を一語で表現。日本語の（笑）のニュアンスはこの somehow に全部詰まってる。",
        category: 'filler',
        source: 'Session: goroku-v3 build',
    },
    {
        daySlot: 22,
        month: '2026-02',
        japanese: 'どこに？',
        english: "where's that goin'? like, where does it actually live?",
        context: "where does it live は「それどこに保存されるの？」。コードの話でもファイルの話でも、物理的な場所じゃなくて「所属先」を聞くときにliveを使う。Where does this data live? はエンジニア英語の基本。goin' は going の g-drop、カジュアルの証。",
        category: 'request',
        source: 'Session: goroku-v3 build',
    },

    // =================================================================
    // 2026-02-23 -- Session: Naming things + article procrastination
    // =================================================================

    {
        daySlot: 23,
        month: '2026-02',
        japanese: 'てきとーにやっといて',
        english: "just throw somethin' together, I'm not gonna micromanage this",
        context: "throw something together は「ありもので適当に組み立てる」。料理でも仕事でも「パパッと作る」感覚。micromanage は「細かく管理する」で、上司が部下の作業を逐一チェックする行為。I'm not gonna micromanage で「いちいち口出さない」=丸投げ宣言。信頼と怠惰の境界線にある最高のフレーズ。",
        category: 'filler',
        source: 'Naming things + article procrastination',
    },
    {
        daySlot: 23,
        month: '2026-02',
        japanese: 'もうちょっと覚えガイある感じにしてｗ',
        english: "gimme somethin' that actually sticks, this is forgettable",
        context: "sticks は「くっつく・記憶に残る」。Nothing sticks(何も頭に入らない)。sticky は「粘着性のある」で、a sticky idea は「忘れられないアイデア」。forgettable は「忘れられるレベル」=印象が薄い。an unforgettable night(忘れられない夜)の逆。ダメ出しを1文で完結させる破壊力。",
        category: 'shutdown',
        source: 'Naming things + article procrastination',
    },
    {
        daySlot: 23,
        month: '2026-02',
        japanese: 'なんの工夫をしたの？',
        english: "walk me through what you actually changed, 'cause I'm not seein' it",
        context: "walk me through は「順を追って説明して」。walk(歩く)で「一歩ずつ案内する」意味になる。プレゼンでも仕事でもめちゃくちゃ使う。'cause I'm not seeing it は「だって俺には見えてないから」。見えてない=成果が見当たらない。丁寧に聞いてるようで実は圧がすごい。上品な詰め方の教科書。",
        category: 'opinion',
        source: 'Naming things + article procrastination',
    },
    {
        daySlot: 23,
        month: '2026-02',
        japanese: 'なんでもいいけどちゃんとしろよ',
        english: "I'm easy, but don't half-ass it",
        context: "I'm easy は「俺はなんでもいいよ・こだわりない」。食事の場所を決めるときとか超頻出。half-ass は「中途半端にやる」。ass(尻)の半分=片方の尻しか座ってない=本気じゃない。don't half-ass it は「手抜きすんな」の直球。「こだわりはないけど雑はダメ」を6語で言い切る効率。",
        category: 'request',
        source: 'Naming things + article procrastination',
    },
    {
        daySlot: 23,
        month: '2026-02',
        japanese: '名前つけるのが一番むずい',
        english: "namin' things is harder than buildin' things, and I'll die on that hill",
        context: "I'll die on that hill は「この主張は絶対に譲らない」。戦場で「この丘を守って死ぬ」=撤退しない覚悟。Is this the hill you wanna die on?(そこまでこだわるとこ?)は「本当にそれで戦うの?」の確認。プログラマーの名言「命名が一番難しい」を英語でかっこよく言い切る。",
        category: 'meta',
        source: 'Naming things + article procrastination',
    },

    // =================================================================
    // 2026-02-24 -- Session: Duplicate data cleanup + feature naming
    // =================================================================

    {
        daySlot: 24,
        month: '2026-02',
        japanese: 'もういいからそれだけ直して',
        english: "just fix that one thing, that's all I'm askin'",
        context: "that's all I'm asking は「それだけ頼んでるんだけど」。余計なことすんなのニュアンスが詰まってる。all が強い -- 「全部の中でたった一個」。I'm asking は現在進行形で「今まさにお願いしてる」のライブ感。日本語の「もういいから」は疲れ+諦め+指示が3つ同時。英語では that's all で切り捨てる。",
        category: 'request',
        source: 'Duplicate data cleanup + feature naming',
    },
    {
        daySlot: 24,
        month: '2026-02',
        japanese: 'そもそもどこから来たの、これ',
        english: "where did this even come from? like, who put this here?",
        context: "where did this come from は「出所はどこ」。even を挟むと「そもそも」の疑問強化。like は口語の接続詞。who put this here は「誰が置いたんだよ」で犯人探しモード。データにゴミが混じってるとき、コードの謎の変数を見つけたとき、冷蔵庫の謎のタッパーを見つけたとき。万能。",
        category: 'reaction',
        source: 'Duplicate data cleanup + feature naming',
    },
    {
        daySlot: 24,
        month: '2026-02',
        japanese: '差別化を図りたい',
        english: "we gotta make these two actually feel different, not just... slightly different",
        context: "feel different は「違うと感じさせる」。look differentじゃなくてfeel。体験として違わないと意味がない。not just slightly different で「微妙に違うだけじゃダメ」を追加。... の間が「考えながら喋ってる」リアルタイム感を出す。差別化は differentiate だけど会話では重すぎる。feel different の方が100倍使える。",
        category: 'opinion',
        source: 'Duplicate data cleanup + feature naming',
    },
    {
        daySlot: 24,
        month: '2026-02',
        japanese: 'どんな案がある？',
        english: "whatcha got? throw some ideas at me",
        context: "whatcha got は what do you have のカジュアル極限形。仕事でもカジュアルな場面なら全然使える。throw ideas at me は「アイデアをぶつけて」。at me が「俺に向かって投げろ」で積極的に受け止める姿勢。brainstorm しようぜ、をこの短さで言える。丁寧に聞くより「投げてこい」の方が相手も気楽。",
        category: 'request',
        source: 'Duplicate data cleanup + feature naming',
    },
    {
        daySlot: 24,
        month: '2026-02',
        japanese: 'まず作ってよ（笑）',
        english: "how 'bout you build it first and THEN we'll talk",
        context: "how about you は「お前がやれば?」の挑発的提案。build it first で「まず作れ」。and THEN we'll talk は「話はそれから」。THEN の強調が「順番間違えんな」を伝える。議論ばっかで手が動かない人へのツッコミ。（笑）のニュアンスは how 'bout の軽さが担当。命令じゃなくて提案の形を取るのがミソ。",
        category: 'shutdown',
        source: 'Duplicate data cleanup + feature naming',
    },

    // =================================================================
    // 2026-02-25 -- Session: Too many pages, decision fatigue
    // =================================================================

    {
        daySlot: 25,
        month: '2026-02',
        japanese: 'ページ多すぎてどれがどれかわからん',
        english: "there's so many pages I don't even know which one I'm on anymore",
        context: "I don't even know は「もはやわからん」。even が諦め感を追加。which one I'm on は「自分がどこにいるか」。anymore は「前はわかってたけどもう無理」の時間経過。ページやタブが増えすぎて迷子になる現代人の叫び。anymore が効いてる -- 昔は把握してたのに、を1語で言う。",
        category: 'reaction',
        source: 'Too many pages, decision fatigue',
    },
    {
        daySlot: 25,
        month: '2026-02',
        japanese: '一回整理しないとやばい',
        english: "if we don't clean this up soon it's gonna be a total mess",
        context: "clean up は「片付ける・整理する」。コードでもデスクでも使える万能動詞。it's gonna be は「このままだと〜になる」の未来予測。total mess は「完全にぐちゃぐちゃ」。total が mess を強調。soon が「今すぐじゃなくていいけど近いうちに」の緊急度。日本語の「やばい」は gonna be a total mess まるごと。",
        category: 'opinion',
        source: 'Too many pages, decision fatigue',
    },
    {
        daySlot: 25,
        month: '2026-02',
        japanese: 'どれかに統合できない？',
        english: "can we just merge these? like, do we really need both?",
        context: "merge は「統合する」。Git用語だけど日常会話でも使える。can we just は「ただ〜するだけでよくない?」の簡略化提案。do we really need both は「両方本当に要る?」の本質的な問い。really が「いやマジで考えてみ?」の圧。片方消せばいいじゃんを丁寧に包んだ形。開発でもミーティングでも最強の整理提案。",
        category: 'request',
        source: 'Too many pages, decision fatigue',
    },
    {
        daySlot: 25,
        month: '2026-02',
        japanese: '作ったはいいけど使ってない',
        english: "I built it and then never touched it again -- story of my life",
        context: "never touched it again は「二度と触らなかった」。touch は「触る」だけど、プロジェクトや作品に対して使うと「手を加える・メンテする」。story of my life は「俺の人生あるある」。自虐の定番フレーズ。That's the story of my life で「いつもそう」。作って放置の罪悪感を笑いに変換する。",
        category: 'meta',
        source: 'Too many pages, decision fatigue',
    },
    {
        daySlot: 25,
        month: '2026-02',
        japanese: 'もう考えたくない、決めて',
        english: "I'm out of opinions, just pick one -- I'll go with whatever",
        context: "out of opinions は「意見が尽きた」。out of は「〜を使い果たした」(out of gas, out of time)。just pick one は「もうどれでもいいから選べ」。I'll go with whatever は「何でも乗る」。whatever が最強の放棄ワード。decision fatigue(決断疲れ)を体現する3連コンボ。選べない日本人に最適な降参フレーズ。",
        category: 'shutdown',
        source: 'Too many pages, decision fatigue',
    },

    // =================================================================
    // 2026-02-26 -- Session: Writing vs building, procrastination guilt
    // =================================================================

    {
        daySlot: 26,
        month: '2026-02',
        japanese: '書かなきゃいけないのはわかってる',
        english: "I know I gotta write it, I just... don't wanna",
        context: "I know I gotta は「やらなきゃなのはわかってる」。gotta = got to のカジュアル形。I just don't wanna は「ただやりたくない」。just が「理由はそれだけ」の潔さ。... の間が葛藤を表現。わかってるけどやらない -- 人類最大の課題を7語で要約。wanna = want to。この正直さが英語の魅力。",
        category: 'filler',
        source: 'Writing vs building, procrastination guilt',
    },
    {
        daySlot: 26,
        month: '2026-02',
        japanese: 'コード書いてる方が楽しい',
        english: "codin' is the fun part -- writin' about it? that's the job",
        context: "the fun part は「楽しいパート」。仕事の好きな部分を the fun part と呼ぶのは英語あるある。that's the job は「それが仕事ってもんだ」。楽しくないけどやるべきこと=仕事の本質。codin' vs writin' の対比がきれい。ダッシュ(--) で区切って、前半が本音、後半が現実。",
        category: 'opinion',
        source: 'Writing vs building, procrastination guilt',
    },
    {
        daySlot: 26,
        month: '2026-02',
        japanese: '完璧にしてから出したい病',
        english: "I keep polishin' somethin' that nobody's even seen yet -- classic me",
        context: "keep polishing は「磨き続ける」。polish は物理的にも比喩的にも「仕上げる」。nobody's even seen yet は「まだ誰も見てない」。even が「見てすらいない」の強調。完璧主義で永遠に公開できないあるある。classic me は「典型的な俺」。自分の悪癖を認めつつ笑う最高のフレーズ。",
        category: 'meta',
        source: 'Writing vs building, procrastination guilt',
    },
    {
        daySlot: 26,
        month: '2026-02',
        japanese: 'とりあえず出せばいいんだよ',
        english: "just ship it -- done is better than perfect, always",
        context: "ship it は「出荷しろ・リリースしろ」。ソフトウェア業界の合言葉。done is better than perfect は Facebook の元モットー。always を最後に置くことで「例外なし」の断言。完璧主義の人に言う最強の励まし(というか叱咤)。just が「ごちゃごちゃ言わずに」のニュアンス。3語で背中を押す。",
        category: 'shutdown',
        source: 'Writing vs building, procrastination guilt',
    },
    {
        daySlot: 26,
        month: '2026-02',
        japanese: '誰も読まないかもだけど書く',
        english: "maybe nobody reads it, but I wrote it -- and that counts",
        context: "that counts は「それには価値がある」。count は「数える」→「有効とみなす」。Every vote counts(一票一票に意味がある)と同じ構造。maybe nobody reads it で最悪のケースを先に認めてから、but で逆転する。wrote が過去形で「もう書いた」=完了の事実。結果じゃなくて行為に価値を置く宣言。",
        category: 'opinion',
        source: 'Writing vs building, procrastination guilt',
    },

    // =================================================================
    // 2026-02-27 -- Session: Explaining things to non-tech people
    // =================================================================

    {
        daySlot: 27,
        month: '2026-02',
        japanese: 'いや説明むずいんだって',
        english: "dude, try explainin' this to someone who doesn't code -- it's brutal",
        context: "try explaining は「説明してみろよ」。try + -ing で「やってみろ(難しいぞ)」の挑発。someone who doesn't code は「コード書かない人」。it's brutal は「えぐい・残酷」。brutal は本来「残忍な」だけど口語では「めちゃくちゃキツい」。技術者が非技術者に説明する苦行をbrutalの一語で表現。",
        category: 'reaction',
        source: 'Explaining things to non-tech people',
    },
    {
        daySlot: 27,
        month: '2026-02',
        japanese: 'わかった？って聞くと全員「うん」って言うけど絶対わかってない',
        english: "they all nod but I KNOW they didn't get it -- the nod is a lie",
        context: "they all nod は「全員うなずく」。nod(うなずき)は理解のサイン...のはずが。I KNOW は「わかってる(確信)」の強調。the nod is a lie は「あのうなずきは嘘」。the をつけることで「あの、例の、みんなやるやつ」の共有知識化。プレゼン後の「質問ありますか?」→沈黙のあるある。",
        category: 'meta',
        source: 'Explaining things to non-tech people',
    },
    {
        daySlot: 27,
        month: '2026-02',
        japanese: 'たとえ話しか通じない',
        english: "unless I turn it into a metaphor, nobody's followin'",
        context: "turn it into は「〜に変換する」。技術的な話を比喩に変換する行為。unless は「〜しない限り」で条件を先に出す。nobody's following は「誰もついてきてない」。follow は「後をついていく」→「話についていく」。フォロワーの follow と同じ語。メタファーなしでは誰もフォローしてくれない皮肉。",
        category: 'opinion',
        source: 'Explaining things to non-tech people',
    },
    {
        daySlot: 27,
        month: '2026-02',
        japanese: 'もっと簡単に言って',
        english: "pretend I'm five -- explain it like that",
        context: "pretend I'm five は「俺が5歳だと思って」。ELI5 (Explain Like I'm 5) は Reddit の有名サブレディット。複雑なことを超簡単に説明するフォーマット。pretend は「ふりをする」。like that は「そんな感じで」。自分をバカに見立てて相手に説明のハードルを下げさせる。むしろ知性のある頼み方。",
        category: 'request',
        source: 'Explaining things to non-tech people',
    },
    {
        daySlot: 27,
        month: '2026-02',
        japanese: 'もういい、自分でやる',
        english: "forget it -- I'll just do it myself, it's faster",
        context: "forget it は「もういい・忘れて」。説明を諦めた瞬間の定番。I'll just do it myself は「自分でやるわ」。just が「もう面倒だから」のニュアンス。it's faster は「その方が早い」。説明するより自分でやった方が早いという結論。チーム作業の敗北宣言であり、実は一番効率的な選択肢。",
        category: 'shutdown',
        source: 'Explaining things to non-tech people',
    },

    // =================================================================
    // 2026-02-28 -- Session: Month-end wrap-up, small wins
    // =================================================================

    {
        daySlot: 28,
        month: '2026-02',
        japanese: '気づいたら2月終わるじゃん',
        english: "wait -- February's OVER? when did that happen?",
        context: "wait は「ちょっと待って」の驚き。OVER の強調が「え、終わり?」のショック。when did that happen は「いつそうなった?」。時間の経過に気づいてなかったリアクション。日本語の「気づいたら」は when did that happen に近い。月末に毎回言えるテンプレ。March already? も同じパターン。",
        category: 'reaction',
        source: 'Month-end wrap-up, small wins',
    },
    {
        daySlot: 28,
        month: '2026-02',
        japanese: '地味に進んでた',
        english: "didn't feel like progress, but lookin' back? yeah, stuff got done",
        context: "didn't feel like progress は「進んでる感じしなかった」。feel like は体感の表現。lookin' back は「振り返ると」。yeah が「あ、意外と」の気づき。stuff got done は「色々片付いてた」。stuff は漠然とした「あれこれ」。got done は受動態で「いつの間にか終わってた」。地味な進捗を認める大人のフレーズ。",
        category: 'meta',
        source: 'Month-end wrap-up, small wins',
    },
    {
        daySlot: 28,
        month: '2026-02',
        japanese: '来月はもっとちゃんとやる（毎月言ってる）',
        english: "next month I'm goin' all in -- I say that every month but this time I mean it",
        context: "go all in は「全力投入する」。ポーカー用語で「全チップ賭ける」→「本気出す」。I say that every month は「毎月言ってる」の自覚。but this time I mean it は「でも今回はマジ」。mean it は「本気で言ってる」。毎月同じこと言う自分をメタで笑いつつ、hope を捨てない構造。",
        category: 'filler',
        source: 'Month-end wrap-up, small wins',
    },
    {
        daySlot: 28,
        month: '2026-02',
        japanese: '完璧じゃないけど、まあいいか',
        english: "it ain't perfect but hey -- good enough is good enough",
        context: "ain't は isn't のカジュアル極限形。hey は「まあ聞けよ」の挟み込み。good enough is good enough は同語反復で「十分は十分」。完璧主義を手放す瞬間のフレーズ。繰り返しが「これ以上求めない」の決意になる。Voltaire の「完璧は善の敵」を6語で庶民語に落とした形。",
        category: 'opinion',
        source: 'Month-end wrap-up, small wins',
    },
    {
        daySlot: 28,
        month: '2026-02',
        japanese: 'おつかれ、俺',
        english: "honestly? I did alright this month -- cheers to that",
        context: "honestly は「正直に言うと」で自己評価の前置き。I did alright は「まあまあやった」。alright は great でも terrible でもない絶妙なライン。cheers to that は「それに乾杯」。本来は酒の場のフレーズだけど、一人で自分を称える独り乾杯にも使える。自分にお疲れを言う英語版。月末の締めに最適。",
        category: 'filler',
        source: 'Month-end wrap-up, small wins',
    },
];
