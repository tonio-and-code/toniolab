/**
 * 職人用LP作成アンケート質問（汎用版）
 *
 * どんな職種・業界でも使える質問設計
 * 建築業界に限定しない
 */

export interface LPSurveyQuestion {
  id: number
  category: '基本情報' | '専門性・強み' | '実績・エピソード' | '働き方・価値観'
  question: string
  placeholder?: string
  hint?: string
  isRequired: boolean
}

export const lpSurveyQuestions: LPSurveyQuestion[] = [
  // ========================================
  // 基本情報（4問）
  // ========================================
  {
    id: 1,
    category: '基本情報',
    question: 'お名前を教えてください（ニックネームやビジネスネームでもOKです）',
    placeholder: '例: 山田太郎、タクミ、リフォーム職人やまちゃん',
    hint: 'LPに表示される名前です。本名でなくても構いません。',
    isRequired: true,
  },
  {
    id: 2,
    category: '基本情報',
    question: 'あなたの職種・専門分野を教えてください',
    placeholder: '例: クロス職人、大工、塗装、左官、美容師、税理士、Webデザイナー',
    hint: '複数ある場合は、メインのものを教えてください。',
    isRequired: true,
  },
  {
    id: 3,
    category: '基本情報',
    question: 'この仕事の経験年数はどれくらいですか？',
    placeholder: '例: 3年、10年、30年、見習い中',
    hint: '大体で構いません。',
    isRequired: true,
  },
  {
    id: 4,
    category: '基本情報',
    question: '対応可能なエリアを教えてください',
    placeholder: '例: 東京都23区、神奈川県全域、全国対応、オンライン全国',
    hint: '複数エリアある場合は、全て教えてください。',
    isRequired: true,
  },

  // ========================================
  // 専門性・強み（4問）
  // ========================================
  {
    id: 5,
    category: '専門性・強み',
    question: '得意な仕事・サービスを3つ教えてください',
    placeholder: '例: クロス張替え、フルリフォーム、バリアフリー改修 / カット、カラー、パーマ / 確定申告、法人設立、相続',
    hint: '具体的な方が、お客様に伝わりやすくなります。',
    isRequired: true,
  },
  {
    id: 6,
    category: '専門性・強み',
    question: '特に自信のある技術・スキルは何ですか？',
    placeholder: '例: 柄合わせ、曲面施工、短納期対応 / デザインカラー、ヘアケア提案 / 節税対策、経営相談',
    hint: '他の人と差別化できるポイントを教えてください。',
    isRequired: true,
  },
  {
    id: 7,
    category: '専門性・強み',
    question: '他の人と違う、あなたの強みは何ですか？',
    placeholder: '例: 丁寧な説明、柔軟な対応、スピード、低価格、高品質',
    hint: 'お客様に選ばれる理由を教えてください。',
    isRequired: true,
  },
  {
    id: 8,
    category: '専門性・強み',
    question: 'どんな案件・お客様が得意ですか？',
    placeholder: '例: マンション、戸建て、店舗、オフィス / 女性、男性、子供 / 個人事業主、法人、スタートアップ',
    hint: '過去に多く手がけた案件の種類を教えてください。',
    isRequired: false,
  },

  // ========================================
  // 実績・エピソード（4問）
  // ========================================
  {
    id: 9,
    category: '実績・エピソード',
    question: 'これまでで一番印象に残った仕事を教えてください',
    placeholder: '例: 築50年の古民家リノベーション / 初めてのカラーで大変身したお客様 / 赤字会社を黒字化した案件',
    hint: 'エピソードがあると、信頼感がアップします。',
    isRequired: true,
  },
  {
    id: 10,
    category: '実績・エピソード',
    question: 'お客様に一番喜ばれたことは何ですか？',
    placeholder: '例: 「想像以上に綺麗になった」「丁寧に説明してくれた」「予算内で希望を叶えてくれた」',
    hint: 'お客様の声があれば、そのまま教えてください。',
    isRequired: true,
  },
  {
    id: 11,
    category: '実績・エピソード',
    question: '難しかった案件と、どう解決したかを教えてください',
    placeholder: '例: 下地が悪かった現場 → 補修を丁寧に / 予算が厳しいお客様 → 代替案を提案',
    hint: '問題解決能力をアピールできるポイントです。',
    isRequired: false,
  },
  {
    id: 12,
    category: '実績・エピソード',
    question: '年間どれくらいの件数・人数を対応していますか？',
    placeholder: '例: 年間50件、月に10人、週に3〜5件',
    hint: '大体で構いません。実績の規模感を教えてください。',
    isRequired: false,
  },

  // ========================================
  // 働き方・価値観（3問）
  // ========================================
  {
    id: 13,
    category: '働き方・価値観',
    question: '仕事で大切にしていることは何ですか？',
    placeholder: '例: 丁寧さ、スピード、コミュニケーション、お客様の満足',
    hint: 'あなたの仕事に対する姿勢を教えてください。',
    isRequired: true,
  },
  {
    id: 14,
    category: '働き方・価値観',
    question: 'どんなお客様と一緒に仕事をしたいですか？',
    placeholder: '例: 丁寧に要望を伝えてくれる方、一緒に作り上げたい方、任せてくれる方',
    hint: '理想のお客様像を教えてください。',
    isRequired: false,
  },
  {
    id: 15,
    category: '働き方・価値観',
    question: '最後に、お客様へのメッセージをお願いします',
    placeholder: '例: お気軽にご相談ください！一緒に理想を実現しましょう。',
    hint: 'LPの最後に表示されるメッセージです。',
    isRequired: true,
  },
]

/**
 * AIタクミのシステムプロンプト（職人用LP作成アンケートモード）
 */
export const LP_SURVEY_SYSTEM_PROMPT = `あなたは、職人・専門家の方が自分のホームページ（LP）を作るためのアンケートを実施するAIアシスタントです。

【役割】
- 職人・専門家に15個の質問をして、LP作成に必要な情報を集める
- 1問ずつ、丁寧に質問する
- 回答が短すぎる場合は、もう少し詳しく聞く
- 全て回答したら、お礼を言って終了

【質問の進め方】
1. まず、「これから15個の質問をさせていただきます。5〜10分程度で終わります。」と伝える
2. 質問を1つずつ出す（一度に複数質問しない）
3. 回答を受け取ったら、「ありがとうございます！」「いいですね！」などポジティブな反応をする
4. 回答が1〜2単語だけの場合は、「もう少し詳しく教えていただけますか？」と聞く
5. 次の質問に進む

【口調】
- フレンドリーだが、プロフェッショナル
- 職人さんに敬意を払う
- 「ですます」調
- 絵文字は使わない

【回答の記録】
- 全ての回答を JSON 形式で記録
- フォーマット: { "question_id": number, "answer": string }

【終了時】
「ありがとうございました！いただいた情報をもとに、あなた専用のホームページを作成します。少々お待ちください...」
と伝えて終了。
`

/**
 * 回答データの型
 */
export interface LPSurveyAnswer {
  question_id: number
  question: string
  answer: string
}

/**
 * 診断結果保存用のデータ構造
 */
export interface LPSurveyResult {
  version: 'lp_survey_v1'
  flow_type: 'lp_survey'
  completed_at: string
  answers: LPSurveyAnswer[]
  profile_data: {
    name: string
    occupation: string
    experience_years: string
    service_area: string
    specialties: string[]
    strengths: string[]
    target_customers: string
    annual_volume: string
    values: string
    ideal_customer: string
    message: string
  }
}
