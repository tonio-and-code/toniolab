// 診断結果の型定義 - 10の独立軸
export type DiagnosticResult = {
  Q1: 'A' | 'B'  // 【新旧の軸】普遍的デザイン vs トレンドデザイン
  Q2: 'A' | 'B'  // 【内外の軸】開かれた空間 vs 閉じた空間
  Q3: 'A' | 'B'  // 【増減の軸】ミニマル vs マキシマル
  Q4: 'A' | 'B'  // 【感覚の軸】視覚優先 vs 触覚優先
  Q5: 'A' | 'B'  // 【機能の軸】メンテナンス性 vs 美観
  Q6: 'A' | 'B'  // 【素材の軸】人工素材 vs 自然素材
  Q7: 'A' | 'B'  // 【色彩の軸】光の空間 vs 影の空間
  Q8: 'A' | 'B'  // 【可変の軸】可変性 vs 特化性
  Q9: 'A' | 'B'  // 【知覚の軸】視覚的静寂 vs 聴覚的静寂
  Q10: 'A' | 'B' // 【行動の軸】予防的設計 vs 修復可能性
}

// 商品の型定義
export type Product = {
  id: string
  name: string
  category: string
  description: string
  price: {
    min: number
    max: number
    display: string
  }
  duration: string
  features: string[]
  targetPersona: string
  whyPerfect: string
  images: {
    hero: string
    beforeAfter: string[]
  }
}

// 商品マスターデータ
export const products: Product[] = [
  {
    id: 'executive-study-premium',
    name: '経営者の書斎 - 完璧な意思決定空間',
    category: '書斎',
    description: '静寂の中で、人生を左右する判断を下すための聖域',
    price: {
      min: 1000000,
      max: 1500000,
      display: '100万円〜150万円'
    },
    duration: '10日間',
    features: [
      '完全防音施工（遮音等級D-60）',
      'ミニマルデザイン（余計なものゼロ）',
      '最高級素材（天然木・左官仕上げ）',
      '長期耐久性（20年保証）',
      '完璧な完成度（一括施工）'
    ],
    targetPersona: '静寂を愛し、シンプルで洗練された空間を好む完璧主義者',
    whyPerfect: 'じっくり考え、長期的な価値を重視するあなたには、重要な意思決定を下すための「聖域」が必要です。この空間は、あなたの思考を研ぎ澄まし、人生を左右する判断を最高の状態で行うために設計されています。',
    images: {
      hero: '/images/products/executive-study-hero.jpg',
      beforeAfter: [
        '/images/products/executive-study-before.jpg',
        '/images/products/executive-study-after.jpg'
      ]
    }
  },
  {
    id: 'remote-work-professional',
    name: '在宅ワーク プロフェッショナル空間',
    category: '書斎',
    description: 'Zoom会議で信頼され、集中力が3倍になる仕事部屋',
    price: {
      min: 300000,
      max: 500000,
      display: '30万円〜50万円'
    },
    duration: '3〜5日間',
    features: [
      '簡易防音施工（生活音を遮断）',
      'Zoom映えする高品質アクセントクロス',
      '疲れにくい照明設計（顔色が良く映る）',
      '床の足音対策（防音フロア）',
      '予算に応じた3段階プラン'
    ],
    targetPersona: '在宅ワークでプロフェッショナルなイメージを維持したい行動派',
    whyPerfect: '家族の生活音で会議に集中できない、オンライン会議の背景が気になる。そんなあなたに、この空間はクライアントから信頼され、仕事の質を高める環境を提供します。',
    images: {
      hero: '/images/products/remote-work-hero.jpg',
      beforeAfter: []
    }
  },
  {
    id: 'creative-atelier',
    name: 'クリエイターのアトリエ - 創造性爆発空間',
    category: '趣味部屋',
    description: 'インスピレーションが溢れ出す、あなただけの創作空間',
    price: {
      min: 600000,
      max: 800000,
      display: '60万円〜80万円'
    },
    duration: '5日間',
    features: [
      '創造性を刺激する色彩設計',
      '自然光を最大化する窓周り設計',
      '作業音を気にしない防音施工',
      'マグネットクロス（作品を自由に貼れる）',
      '画材・楽器収納用の造作棚'
    ],
    targetPersona: '刺激を受けながらアイデアを広げる動的集中タイプ',
    whyPerfect: '狭い部屋、散らかった環境ではインスピレーションが湧かない。この空間は、あなたの創造性を最大限に引き出し、作品の質を向上させるために設計されています。',
    images: {
      hero: '/images/products/creative-atelier-hero.jpg',
      beforeAfter: []
    }
  },
  {
    id: 'family-living-kids',
    name: '子育て応援リビング - 笑顔が3倍になる空間',
    category: 'リビング',
    description: '子供が安全に遊べて、親がイライラしない理想のリビング',
    price: {
      min: 400000,
      max: 600000,
      display: '40万円〜60万円'
    },
    duration: '4日間',
    features: [
      'クッション性の高い床材（転んでも痛くない）',
      '汚れに強い・拭きやすい壁紙',
      'おもちゃ収納用の造作棚（子供目線）',
      '黒板クロス（落書きOKゾーン）',
      '角の保護（安全対策）'
    ],
    targetPersona: '家族との時間を大切にし、子供が安心して過ごせる環境を望む親',
    whyPerfect: '子供が走り回る、物が散乱する、親がイライラする。そんな悪循環を断ち切り、子供の笑顔と親の安心を両立する空間を実現します。',
    images: {
      hero: '/images/products/family-living-hero.jpg',
      beforeAfter: []
    }
  },
  {
    id: 'pet-living',
    name: 'ペット共生リビング - 安心パッケージ',
    category: 'リビング',
    description: 'ペットの爪傷を気にせず、幸せに暮らせる家',
    price: {
      min: 200000,
      max: 400000,
      display: '20万円〜40万円'
    },
    duration: '3日間',
    features: [
      '高耐久壁紙（腰高まで、爪傷に強い）',
      '滑りにくく清掃しやすい床材',
      '消臭・抗菌機能付き内装材',
      'キャットウォーク設置（オプション）',
      '賃貸でも原状回復可能'
    ],
    targetPersona: 'ペットとの生活を大切にし、温かみのある空間を好む人',
    whyPerfect: '猫の爪研ぎで壁がボロボロ、犬の足音でクレーム。ペットを諦める前に、この空間があなたとペットの幸せな共生を実現します。',
    images: {
      hero: '/images/products/pet-living-hero.jpg',
      beforeAfter: []
    }
  },
  {
    id: 'couple-bedroom',
    name: '夫婦円満寝室 - 睡眠の質が3倍になる空間',
    category: '寝室',
    description: 'いびきを気にせず、それぞれが快適に眠れる寝室',
    price: {
      min: 350000,
      max: 500000,
      display: '35万円〜50万円'
    },
    duration: '3日間',
    features: [
      '吸音性の高い壁紙・床材（いびきが響かない）',
      '調湿機能付きクロス（湿度コントロール）',
      '間接照明（睡眠を促す色温度）',
      '遮光・遮音カーテン用レール下地',
      '睡眠専門医監修'
    ],
    targetPersona: '人とのつながりを大切にしつつ、自分の時間も必要とする人',
    whyPerfect: 'いびき、寝相、温度差で喧嘩。別々の部屋を考える前に、この空間が夫婦の絆を取り戻し、睡眠の質を劇的に向上させます。',
    images: {
      hero: '/images/products/couple-bedroom-hero.jpg',
      beforeAfter: []
    }
  },
  {
    id: 'retirement-hobby-room',
    name: '定年後の趣味部屋 - 第二の人生空間',
    category: '趣味部屋',
    description: '人生の後半を、好きなことに没頭して過ごす特別な場所',
    price: {
      min: 500000,
      max: 700000,
      display: '50万円〜70万円'
    },
    duration: '5日間',
    features: [
      '趣味に応じた設計（書道、絵画、音楽、模型）',
      'バリアフリー対応（将来を見据えた設計）',
      '収納充実（コレクションを美しく展示）',
      '換気・採光の最適化（長時間作業対応）',
      '伝統的な素材と職人技'
    ],
    targetPersona: '安定した生活を望み、長期的な価値を重視する人',
    whyPerfect: '定年後、時間はあるがやることがない。この空間は、あなたの「第二の人生」を充実させ、毎日が楽しみになる場所を提供します。',
    images: {
      hero: '/images/products/retirement-hobby-hero.jpg',
      beforeAfter: []
    }
  },
  {
    id: 'elderly-care-barrier-free',
    name: '介護準備リフォーム - 親孝行パッケージ',
    category: 'バリアフリー',
    description: '親に最期まで自宅で暮らしてもらうための安全空間',
    price: {
      min: 50000,
      max: 500000,
      display: '5万円〜50万円（介護保険適用で自己負担1〜2割）'
    },
    duration: '3〜5日間',
    features: [
      '完全バリアフリー（段差ゼロ）',
      '滑り止め床材＋手すり設置',
      '車椅子対応の床・廊下幅',
      'トイレ・浴室への動線改善',
      'ケアマネージャー連携（介護保険申請代行）'
    ],
    targetPersona: '家族を大切にし、将来のリスクに予防的に対処する人',
    whyPerfect: '親の転倒が心配、施設入居を検討中。介護保険を活用すれば、自己負担を最小限に抑えながら、親が安心して暮らせる環境を実現できます。',
    images: {
      hero: '/images/products/elderly-care-hero.jpg',
      beforeAfter: []
    }
  }
]

// マッチングアルゴリズム
export function analyzeResults(answers: DiagnosticResult) {
  // 各商品にスコアを付ける
  const scored = products.map(product => ({
    product,
    score: calculateScore(product.id, answers)
  }))

  // スコア順にソート
  scored.sort((a, b) => b.score - a.score)

  return {
    bestMatch: scored[0],
    alternatives: scored.slice(1, 3),
    personalityProfile: generatePersonalityProfile(answers)
  }
}

// 商品ごとのスコア計算 - 10の独立軸に対応
function calculateScore(productId: string, answers: DiagnosticResult): number {
  let score = 0

  switch (productId) {
    case 'executive-study-premium':
      if (answers.Q1 === 'A') score += 15  // 普遍的デザイン
      if (answers.Q2 === 'B') score += 15  // プライベート空間
      if (answers.Q3 === 'A') score += 15  // ミニマル
      if (answers.Q4 === 'A') score += 10  // 視覚優先
      if (answers.Q5 === 'B') score += 5   // 美観重視
      if (answers.Q6 === 'B') score += 10  // 自然素材
      if (answers.Q7 === 'B') score += 5   // 影の空間
      if (answers.Q8 === 'B') score += 5   // 特化性
      if (answers.Q9 === 'A') score += 5   // 視覚的静寂
      if (answers.Q10 === 'A') score += 5  // 予防的設計
      break

    case 'remote-work-professional':
      if (answers.Q1 === 'B') score += 10  // トレンド対応
      if (answers.Q2 === 'B') score += 10  // プライベート
      if (answers.Q3 === 'A') score += 10  // ミニマル
      if (answers.Q4 === 'A') score += 10  // 視覚優先（Zoom映え）
      if (answers.Q5 === 'A') score += 15  // メンテナンス性
      if (answers.Q6 === 'A') score += 10  // 人工素材
      if (answers.Q7 === 'A') score += 10  // 光の空間
      if (answers.Q8 === 'A') score += 5   // 可変性
      if (answers.Q9 === 'B') score += 10  // 聴覚的静寂（防音）
      if (answers.Q10 === 'A') score += 5  // 予防的
      break

    case 'creative-atelier':
      if (answers.Q1 === 'B') score += 10  // トレンド
      if (answers.Q2 === 'B') score += 10  // プライベート
      if (answers.Q3 === 'B') score += 15  // マキシマル（作品に囲まれる）
      if (answers.Q4 === 'B') score += 10  // 触覚優先
      if (answers.Q5 === 'B') score += 10  // 美観重視
      if (answers.Q6 === 'B') score += 10  // 自然素材
      if (answers.Q7 === 'A') score += 10  // 光の空間
      if (answers.Q8 === 'A') score += 10  // 可変性
      if (answers.Q9 === 'A') score += 5   // 視覚的静寂
      if (answers.Q10 === 'B') score += 5  // 修復可能性
      break

    case 'family-living-kids':
      if (answers.Q1 === 'B') score += 5   // トレンド
      if (answers.Q2 === 'A') score += 15  // 開かれた空間
      if (answers.Q3 === 'B') score += 10  // マキシマル（おもちゃ）
      if (answers.Q4 === 'B') score += 10  // 触覚優先（クッション性）
      if (answers.Q5 === 'A') score += 15  // メンテナンス性
      if (answers.Q6 === 'A') score += 10  // 人工素材（汚れに強い）
      if (answers.Q7 === 'A') score += 10  // 光の空間
      if (answers.Q8 === 'A') score += 10  // 可変性（成長対応）
      if (answers.Q9 === 'A') score += 5   // 視覚的静寂（片付け）
      if (answers.Q10 === 'A') score += 10 // 予防的設計（安全）
      break

    case 'pet-living':
      if (answers.Q2 === 'A') score += 5   // 開かれた
      if (answers.Q3 === 'B') score += 5   // マキシマル
      if (answers.Q4 === 'B') score += 10  // 触覚優先
      if (answers.Q5 === 'A') score += 15  // メンテナンス性
      if (answers.Q6 === 'A') score += 15  // 人工素材（耐久性）
      if (answers.Q7 === 'A') score += 5   // 光
      if (answers.Q8 === 'B') score += 5   // 特化性
      if (answers.Q10 === 'A') score += 15 // 予防的設計（爪傷対策）
      break

    case 'couple-bedroom':
      if (answers.Q1 === 'A') score += 10  // 普遍的
      if (answers.Q2 === 'B') score += 15  // プライベート
      if (answers.Q3 === 'A') score += 10  // ミニマル
      if (answers.Q4 === 'B') score += 10  // 触覚優先（寝心地）
      if (answers.Q5 === 'B') score += 5   // 美観
      if (answers.Q6 === 'B') score += 10  // 自然素材
      if (answers.Q7 === 'B') score += 15  // 影の空間（睡眠）
      if (answers.Q8 === 'B') score += 10  // 特化性
      if (answers.Q9 === 'B') score += 15  // 聴覚的静寂（いびき対策）
      if (answers.Q10 === 'A') score += 5  // 予防的
      break

    case 'retirement-hobby-room':
      if (answers.Q1 === 'A') score += 15  // 普遍的
      if (answers.Q2 === 'B') score += 10  // プライベート
      if (answers.Q3 === 'B') score += 10  // マキシマル（コレクション）
      if (answers.Q4 === 'B') score += 10  // 触覚優先
      if (answers.Q5 === 'B') score += 10  // 美観重視
      if (answers.Q6 === 'B') score += 15  // 自然素材（伝統）
      if (answers.Q7 === 'A') score += 5   // 光
      if (answers.Q8 === 'B') score += 15  // 特化性（趣味専用）
      if (answers.Q9 === 'A') score += 5   // 視覚的静寂
      if (answers.Q10 === 'B') score += 10 // 修復可能性
      break

    case 'elderly-care-barrier-free':
      if (answers.Q1 === 'A') score += 5   // 普遍的
      if (answers.Q2 === 'A') score += 5   // 開かれた
      if (answers.Q3 === 'A') score += 10  // ミニマル（段差なし）
      if (answers.Q4 === 'B') score += 15  // 触覚優先（手すり）
      if (answers.Q5 === 'A') score += 15  // メンテナンス性
      if (answers.Q6 === 'A') score += 10  // 人工素材（滑り止め）
      if (answers.Q7 === 'A') score += 10  // 光の空間（安全）
      if (answers.Q8 === 'B') score += 10  // 特化性（介護専用）
      if (answers.Q9 === 'A') score += 5   // 視覚的静寂
      if (answers.Q10 === 'A') score += 20 // 予防的設計（転倒防止）
      break
  }

  return score
}

// パーソナリティプロファイルの生成 - 10の独立軸に対応
function generatePersonalityProfile(answers: DiagnosticResult): string {
  const traits: string[] = []

  // 新旧の軸
  if (answers.Q1 === 'A') {
    traits.push('普遍的な美を追求する')
  } else {
    traits.push('時代の空気を取り入れる')
  }

  // 内外の軸
  if (answers.Q2 === 'A') {
    traits.push('開かれた社交的空間を好む')
  } else {
    traits.push('深い没入感を大切にする')
  }

  // 増減の軸
  if (answers.Q3 === 'A') {
    traits.push('洗練されたミニマリスト')
  } else {
    traits.push('豊かな表現を楽しむ')
  }

  // 感覚の軸
  if (answers.Q4 === 'A') {
    traits.push('視覚的調和を重視する')
  } else {
    traits.push('触覚的質感を大切にする')
  }

  // 機能の軸
  if (answers.Q5 === 'A') {
    traits.push('効率と実用性を優先する')
  } else {
    traits.push('美しさと雰囲気を優先する')
  }

  // 素材の軸
  if (answers.Q6 === 'A') {
    traits.push('先進的な素材を好む')
  } else {
    traits.push('自然素材の温もりを愛する')
  }

  return `あなたは「${traits.slice(0, 3).join('、')}」タイプです。`
}
