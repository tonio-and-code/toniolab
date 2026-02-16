/**
 * 素材メーカーデータ
 * 
 * 岩崎内装が扱う主要メーカーの情報。
 * 単なるリストではなく、各メーカーの「魂」を定義する。
 */

export interface MaterialMaker {
    id: string
    name: string
    nameEn: string
    logo?: string
    website: string

    // パーパス・企業理念
    purpose: string

    // 虚構と真実
    fiction: string  // メーカーが売っている「物語」
    truth: string    // その物語の背後にある真の価値

    // 強み
    strengths: string[]

    // 代表的な製品カテゴリ
    categories: string[]

    // 岩崎内装としての評価
    iwasakiView: {
        whenToUse: string[]      // こういうとき使う
        caution: string          // 注意点
        personalNote: string     // 個人的な所感
    }

    // ショールーム情報
    showroom?: {
        name: string
        address: string
        url: string
    }
}

export const MATERIAL_MAKERS: MaterialMaker[] = [
    {
        id: 'sangetsu',
        name: 'サンゲツ',
        nameEn: 'Sangetsu',
        website: 'https://www.sangetsu.co.jp/',

        purpose: 'すべての人と共に、やすらぎと希望にみちた空間を創造する',

        fiction: 'トータルコーディネートで「やすらぎと希望」を実現する',
        truth: '膨大な選択肢の中から「迷わなくていい」安心感を提供している',

        strengths: [
            '壁装材・床材・ファブリックの総合提案力',
            '全国規模のショールームネットワーク',
            'デザインとクリエイティビティの重視',
            'サステナビリティへの取り組み',
        ],

        categories: ['壁紙', '床材', 'カーテン', '椅子張り', 'ラグ'],

        iwasakiView: {
            whenToUse: [
                'トータルコーディネートが求められる現場',
                '色合わせに時間をかけられないとき',
                '施主がブランドを指定してきたとき',
            ],
            caution: '「サンゲツだから大丈夫」と思考停止しない。製品ごとに評価する',
            personalNote: '最大手だけあって営業マンの質は高い。情報収集に使える。',
        },

        showroom: {
            name: 'サンゲツ東京ショールーム',
            address: '東京都港区南青山1-2-6',
            url: 'https://www.sangetsu.co.jp/showroom/',
        },
    },
    {
        id: 'lilycolor',
        name: 'リリカラ',
        nameEn: 'Lilycolor',
        website: 'https://www.lilycolor.co.jp/',

        purpose: '人の心を彩り続ける',

        fiction: '環境に配慮しながら美しい空間を作れる',
        truth: 'ホタテ貝殻壁紙など、廃棄物を価値に変える発想がある',

        strengths: [
            'グッドデザイン賞初受賞の先見性',
            'サステナブル素材への挑戦（ホタテ貝殻壁紙）',
            '100年以上の歴史に裏打ちされたデザイン力',
            'オフィスDXへのワンストップソリューション',
        ],

        categories: ['壁紙', '床材', 'カーテン', 'オフィスソリューション'],

        iwasakiView: {
            whenToUse: [
                '環境意識の高い施主への提案',
                'デザイン性で差別化したいとき',
                '「ただの壁紙じゃない」ストーリーが必要なとき',
            ],
            caution: 'サステナブル素材は施工に気を使う。下地の確認を怠らない',
            personalNote: 'ホタテ壁紙を紹介したブログ記事が反響あった。「ゴミを宝に」の哲学と相性がいい。',
        },

        showroom: {
            name: 'リリカラ東京ショールーム',
            address: '東京都新宿区西新宿3-2-11',
            url: 'https://www.lilycolor.co.jp/showroom/',
        },
    },
    {
        id: 'toli',
        name: '東リ',
        nameEn: 'Toli',
        website: 'https://www.toli.co.jp/',

        purpose: '信頼を糧として新たな価値を創造する',

        fiction: '確かな技術があるから間違いない',
        truth: '国産リノリウム製造から始まった技術蓄積が本物',

        strengths: [
            '国産初リノリウム製造からの技術的歴史',
            '床材で培った確かな品質',
            'バスナシリーズなど独自開発商品',
            'トータルインテリアへの展開',
        ],

        categories: ['床材', '壁紙', 'カーテン', '浴室用ビニル床'],

        iwasakiView: {
            whenToUse: [
                '床材に技術的な要求があるとき',
                '長期耐久性が重視される現場',
                '浴室など特殊環境での施工',
            ],
            caution: '床材は強いが、壁紙はサンゲツ・リリカラに比べて選択肢が少ない',
            personalNote: 'バスナフローレは浴室リフォームで重宝。技術屋としての信頼感がある。',
        },

        showroom: {
            name: '東リ東京ショールーム',
            address: '東京都港区港南2-16-4',
            url: 'https://www.toli.co.jp/showroom/',
        },
    },
]

// ======================================
// ヘルパー関数
// ======================================

export const getMakerById = (id: string): MaterialMaker | undefined => {
    return MATERIAL_MAKERS.find(maker => maker.id === id)
}

export const getMakersByCategory = (category: string): MaterialMaker[] => {
    return MATERIAL_MAKERS.filter(maker => maker.categories.includes(category))
}

// ======================================
// メーカー選択の哲学
// ======================================
export const MAKER_PHILOSOPHY = {
    principle: '虚構を見抜きながら、真実を見出す',

    approach: {
        surface: '「どのメーカーがいい？」という質問に答える',
        deep: '「この現場に、この施主に、何が最適か」を考える',
    },

    warning: 'メーカーに依存するな。メーカーを活用せよ。',

    iwasaki: {
        stance: '特定のメーカーに肩入れしない',
        reason: '岩崎内装の魂は「乱れの中に水平を作る」。メーカーの推し商品ではなく、見過ごされている素材に価値を見出す',
    },
}
