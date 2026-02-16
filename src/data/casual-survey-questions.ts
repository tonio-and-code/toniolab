// イワサキ内装からのアンケート協力依頼
// 性格特性を自然に聞き出す質問（表向きは普通のアンケート）

export interface SurveyChoice {
  text: string
  value: string
}

export interface CasualSurveyQuestion {
  id: number
  question: string
  subtitle?: string
  choices: SurveyChoice[]
  allowCustomInput: boolean
  customInputPlaceholder?: string
  // 隠された性格特性の分析軸
  hiddenTrait?: 'communication_style' | 'decision_making' | 'work_approach' | 'customer_focus' | 'innovation_level' | 'reliability' | 'collaboration'
}

export const casualSurveyQuestions: CasualSurveyQuestion[] = [
  {
    id: 1,
    question: '休日は何をされていることが多いですか？',
    subtitle: 'よろしければお聞かせください',
    choices: [
      { text: '家でゆっくり過ごす', value: 'relax' },
      { text: '趣味や運動を楽しむ', value: 'active' },
      { text: '家族や友人と過ごす', value: 'social' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：釣り、ドライブ、映画鑑賞など',
    hiddenTrait: 'work_approach',
  },
  {
    id: 2,
    question: '新しい現場で最初に気にされることは何ですか？',
    subtitle: 'お仕事での大切なポイントについて',
    choices: [
      { text: 'お客様のご要望を細かくお聞きすること', value: 'customer_first' },
      { text: '現場の状況を把握すること', value: 'situation_check' },
      { text: 'スムーズに仕事を進められるか', value: 'efficiency' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：安全確認、段取りの確認など',
    hiddenTrait: 'customer_focus',
  },
  {
    id: 3,
    question: '連絡（LINEやメール）への返信はどのようにされていますか？',
    subtitle: 'コミュニケーションのスタイルについて',
    choices: [
      { text: 'できるだけすぐに返信する', value: 'immediate' },
      { text: '手が空いた時にまとめて返信する', value: 'batch' },
      { text: '重要なものから優先して返信する', value: 'selective' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：状況による、電話が多いなど',
    hiddenTrait: 'communication_style',
  },
  {
    id: 4,
    question: 'お仕事で困った時、どのように対処されますか？',
    subtitle: '問題解決の方法について',
    choices: [
      { text: '自分で調べて解決する', value: 'self_solve' },
      { text: '詳しい方に相談する', value: 'ask_expert' },
      { text: '色々試しながら進める', value: 'trial_error' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：親方に相談、インターネットで調べるなど',
    hiddenTrait: 'decision_making',
  },
  {
    id: 5,
    question: 'どのような現場のお仕事が得意ですか？',
    subtitle: 'ご自身の強みについて',
    choices: [
      { text: '短期間で完了する現場', value: 'quick' },
      { text: 'じっくり丁寧に仕上げる現場', value: 'careful' },
      { text: '難易度の高い現場', value: 'challenge' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：リピーター様の現場、大規模現場など',
    hiddenTrait: 'work_approach',
  },
  {
    id: 6,
    question: 'お客様との接し方で心がけていることはありますか？',
    subtitle: 'コミュニケーションのスタイルについて',
    choices: [
      { text: '親しみやすく、気さくに', value: 'friendly' },
      { text: '礼儀正しく、プロフェッショナルに', value: 'professional' },
      { text: '必要なことを的確に', value: 'focused' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：お客様に応じて変える、自然体でなど',
    hiddenTrait: 'communication_style',
  },
  {
    id: 7,
    question: 'お客様のどのような点に魅力を感じますか？',
    subtitle: 'お仕事で大切にされていること',
    choices: [
      { text: '話が通じる・理解してくださる', value: 'understanding' },
      { text: '信頼して任せてくださる', value: 'trust' },
      { text: '技術を評価してくださる', value: 'appreciation' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：人柄、予算が明確など',
    hiddenTrait: 'customer_focus',
  },
  {
    id: 8,
    question: '今後、どのような働き方を希望されていますか？',
    subtitle: '理想のお仕事スタイルについて',
    choices: [
      { text: '安定して長く続けたい', value: 'stable' },
      { text: '技術を磨いてさらに成長したい', value: 'growth' },
      { text: '自分のペースで自由に', value: 'flexible' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：後進の育成、独立など',
    hiddenTrait: 'innovation_level',
  },
  {
    id: 9,
    question: '約束や納期についてどのように考えていますか？',
    subtitle: 'スケジュール管理について',
    choices: [
      { text: '必ず守ることを最優先にしている', value: 'strict' },
      { text: '基本的に守り、状況に応じて柔軟に対応', value: 'flexible' },
      { text: 'できる範囲で最善を尽くす', value: 'best_effort' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：余裕を持って設定する、状況によるなど',
    hiddenTrait: 'reliability',
  },
  {
    id: 10,
    question: '最後に、ご自身のお仕事スタイルを一言で表すとしたら？',
    subtitle: 'あなたらしさについて',
    choices: [
      { text: '真面目でコツコツ取り組む', value: 'steady' },
      { text: '明るくコミュニケーションを大切にする', value: 'cheerful' },
      { text: '職人気質でこだわりを持つ', value: 'craftsman' },
    ],
    allowCustomInput: true,
    customInputPlaceholder: '例：頼れる存在、几帳面など',
    hiddenTrait: 'communication_style',
  },
]

export interface SurveyAnswer {
  question_id: number
  question: string
  selected_choice?: string
  custom_answer?: string
  hidden_trait?: string
}
