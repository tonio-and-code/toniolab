/**
 * コンテンツ哲学フレームワーク
 * 
 * 「ニュースにコメントする」じゃない。
 * 「内装を通じて、人間の意識を探求する」
 * これがイワサキ内装にしかできないこと。
 */

// ======================================
// 4つのコンテンツ柱
// ======================================
export const CONTENT_PILLARS = {
    spatialPsychology: {
        id: 'spatial-psychology',
        name: '空間心理学',
        nameEn: 'Spatial Psychology',

        description: '内装が人間の心理に与える影響',

        // 普通 vs イワサキ
        contrast: {
            ordinary: '2025年トレンドの壁紙はこれ！',
            iwasaki: 'なぜ人は壁紙を変えたくなるのか。それは「自分を変えたい」という無意識の叫びだ。',
        },

        // トピック例
        topics: [
            '壁の色が集中力に与える影響',
            '天井の高さと創造性の関係',
            '「居心地の悪さ」が生む行動変容',
            '部屋の広さと意思決定の質',
        ],

        // 3人の視点
        perspectives: {
            corkJijii: '空間は鏡じゃ。お前の心が映っておる',
            takumi: 'データでは、天井の高さが10cm上がると創造的思考が〇〇%向上します',
            anya: 'ねえ、なんで狭い部屋のほうが落ち着くの？不思議〜',
        },
    },

    craftPath: {
        id: 'craft-path',
        name: '職人道',
        nameEn: 'The Craft Path',

        description: '技術を極めることと悟りの関係',

        // 普通 vs イワサキ
        contrast: {
            ordinary: 'プロの技を公開！壁紙の貼り方',
            iwasaki: '1枚の壁紙を貼る。その30分間、職人は何を考えているのか。それは瞑想と同じ「無」だ。',
        },

        // トピック例
        topics: [
            '「上手くなる」と「極める」の違い',
            '失敗から学ぶ技術と、失敗を恐れない心',
            '道具との対話',
            '30年同じことをする意味',
        ],

        // 3人の視点
        perspectives: {
            corkJijii: '技術じゃない。心じゃ。心が定まれば、手は勝手に動く',
            takumi: '僕はAIですが、30年分のデータを学習しても「魂」は学習できませんでした',
            anya: 'じじい、なんで同じこと30年もやって飽きないの？',
        },
    },

    materialPhilosophy: {
        id: 'material-philosophy',
        name: '素材哲学',
        nameEn: 'Material Philosophy',

        description: 'なぜコルクなのか、なぜ木なのか、素材の意味',

        // 普通 vs イワサキ
        contrast: {
            ordinary: 'コルク床のメリット・デメリット',
            iwasaki: 'コルク床を選ぶ人は、何を求めているのか。それは「地に足をつけたい」という渇望だ。',
        },

        // トピック例
        topics: [
            '素材が持つ「記憶」',
            '木は死んでからも呼吸する',
            'ビニールクロスと本物の違いは何か',
            '素材と人間の相性',
        ],

        // 3人の視点
        perspectives: {
            corkJijii: 'コルクはワインを守り、音を吸い、足を温める。万能じゃ。だって俺の床、コルクなんだもん',
            takumi: 'コルクの熱伝導率は0.04W/mK。フローリングの1/3です。だから冬でも温かい',
            anya: 'コルクって木なの？樹皮なの？謎すぎる！',
        },
    },

    colorConsciousness: {
        id: 'color-consciousness',
        name: '色彩意識',
        nameEn: 'Color Consciousness',

        description: '色が意識状態に与える影響',

        // 普通 vs イワサキ
        contrast: {
            ordinary: '部屋を広く見せる色の選び方',
            iwasaki: '白い壁は「空白」ではない。「可能性」だ。黒い壁は「暗さ」ではない。「深さ」だ。',
        },

        // トピック例
        topics: [
            '朝と夜で同じ壁が違って見える理由',
            '色が感情に与える無意識の影響',
            '「自分らしい色」の見つけ方',
            '色による空間の「重さ」の調整',
        ],

        // 3人の視点
        perspectives: {
            corkJijii: '色は見るものじゃない。感じるものじゃ',
            takumi: '色彩心理学のデータによると、青は心拍数を下げ、赤は代謝を上げます',
            anya: 'この色、なんて名前？絶対普通の「白」じゃないよね？',
        },
    },

    makerRelations: {
        id: 'maker-relations',
        name: '素材供給者論',
        nameEn: 'Material Maker Relations',

        description: 'サンゲツ・リリカラ・東リ——メーカーの「虚構」を「現実」に翻訳する',

        // 普通 vs イワサキ
        contrast: {
            ordinary: 'サンゲツの新商品はこれ！リリカラの人気ランキング！',
            iwasaki: 'メーカーは「希望」や「彩り」を売っている。でも壁紙はビニールと紙だ。誰がその虚構を現実に変えるのか。',
        },

        // トピック例
        topics: [
            'サンゲツの「やすらぎと希望」とは何か',
            'リリカラの「心を彩る」を翻訳する',
            '東リの「信頼」を肉体化する',
            'メーカー営業との正しい距離',
            '虚構を見抜きながら価値を見出す眼',
        ],

        // 3人の視点
        perspectives: {
            corkJijii: 'メーカーは物語を作る。俺たちはその物語を現場で生きる。それだけじゃ',
            takumi: 'サンゲツは総合力、リリカラはデザイン、東リは技術。それぞれの強みをデータで把握しています',
            anya: 'ねえ、サンゲツとリリカラって何が違うの？全部壁紙じゃないの？',
        },

        // 各メーカーの魂
        makers: {
            sangetsu: {
                name: 'サンゲツ',
                purpose: 'すべての人と共に、やすらぎと希望にみちた空間を創造する',
                fiction: 'トータルコーディネートができる安心感',
                truth: '選択肢を減らすことで意思決定を助ける',
            },
            lilycolor: {
                name: 'リリカラ',
                purpose: '人の心を彩り続ける',
                fiction: '環境に配慮しながら美しい',
                truth: 'ホタテ壁紙など、ゴミを宝に変える発想',
            },
            toli: {
                name: '東リ',
                purpose: '信頼を糧として新たな価値を創造する',
                fiction: '確かな技術がある',
                truth: '床材で培った技術を全方位に展開',
            },
        },
    },
}

// ======================================
// コンテンツ生成の原則
// ======================================
export const CONTENT_PRINCIPLES = {
    core: {
        statement: '「内装を通じて、人間の意識を探求する」',
        antithesis: '「ニュースにコメントする」ではない',
        uniqueness: 'これはイワサキ内装にしかできない',
    },

    approach: {
        surface: '空間の話をしているように見える',
        deep: '実は意識の話をしている',
        effect: '読み終わった後、自分の部屋を違う目で見る',
    },

    characterInterplay: {
        pattern: '3人が異なる角度から同じテーマを語る',
        corkJijii: '哲学的・直感的',
        takumi: '論理的・データ的',
        anya: '素朴・疑問形',
        synergy: '3つの視点が重なると、立体的な理解が生まれる',
    },
}

// ======================================
// サイトの存在意義
// ======================================
export const SITE_PHILOSOPHY = {
    headline: 'ここは、何者にもならなくていい場所です。',

    contrast: {
        ordinary: '普通のビジネスは「あなたを何者かにします」と言う',
        this: 'お前は逆を言ってる。「何者にもならなくていい」',
    },

    paradox: {
        statement: '「何者にもならなくていい」と気づくこと自体が、最大の変化',
        reference: 'エックハルト・トールの本が売れる理由もこれ',
    },

    workEssence: {
        surface: '壁紙を貼る。床を張る。表面的には「空間を変える仕事」',
        deep: '本質は「そこに住む人の意識を変える仕事」',
        chain: [
            '毎日見る壁が変われば',
            '意識が変わる',
            '意識が変われば、行動が変わる',
            '行動が変われば、人生が変わる',
        ],
        conclusion: '内装工事は人生を変える仕事',
    },
}

// ======================================
// コンテンツ生成テンプレート
// ======================================
export const CONTENT_TEMPLATES = {
    journalEntry: {
        structure: [
            '## 普通の問いかけ（表面）',
            '## コルクじじいの視点（哲学）',
            '## タクミの分析（データ）',
            '## アーニャの疑問（素朴）',
            '## 読者への問いかけ（深層）',
        ],
    },

    tvSegment: {
        structure: [
            'コルクじじいがテーマを提示',
            'タクミがデータや技術論を補足',
            'アーニャが「でも〇〇って何？」と質問',
            'コルクじじいが本質に戻す',
        ],
    },
}

// ======================================
// エクスポート
// ======================================
export type ContentPillarKey = keyof typeof CONTENT_PILLARS

export const getRandomPillar = (): ContentPillarKey => {
    const keys = Object.keys(CONTENT_PILLARS) as ContentPillarKey[]
    return keys[Math.floor(Math.random() * keys.length)]
}

export const getPillarPerspectives = (pillar: ContentPillarKey) => {
    return CONTENT_PILLARS[pillar].perspectives
}
