/**
 * AI診断 Ver.4.0 質問データ
 *
 * 設計方針：
 * - 質問数：3問（コア情報のみ）
 * - 表現：具体的で日常的な言葉
 * - 目的：性格診断ではなく「施工ニーズの把握」
 * - 2択維持：入力負担ゼロ
 */

export interface DiagnosticQuestionV4 {
  id: number
  category: string // 質問カテゴリ
  question: string // 質問文（日常的で具体的）
  optionA: {
    label: string // 選択肢ラベル（短く）
    value: string // 内部値
    description: string // 補足説明（軽め）
    chatResponse: string // タクミの雑談コメント（共感・情報提供）
  }
  optionB: {
    label: string
    value: string
    description: string
    chatResponse: string
  }
}

export const diagnosticQuestionsV4: DiagnosticQuestionV4[] = [
  // ========================================
  // 質問1：予算感・緊急度の把握
  // ========================================
  {
    id: 1,
    category: 'urgency_budget',
    question: '今のお住まい、どんな感じですか？',
    optionA: {
      label: '気になるところがある',
      value: 'has_concerns',
      description: '壁の汚れや床のきしみなど、気になる箇所がある',
      chatResponse: 'わかります！ちょっとした汚れとか、気になり始めると気になっちゃいますよね。早めに対処すると、気分も変わりますよ。'
    },
    optionB: {
      label: 'まだ大丈夫だけど',
      value: 'planning_ahead',
      description: '今すぐではないが、そろそろ考え始めている',
      chatResponse: 'いいタイミングですね！余裕があるうちに計画立てると、納得のいくリフォームができますよ。焦らず相談しましょう。'
    }
  },

  // ========================================
  // 質問2：施工範囲・優先順位の把握
  // ========================================
  {
    id: 2,
    category: 'scope_priority',
    question: '特に気になるのは、どっちですか？',
    optionA: {
      label: '見た目（壁・床）',
      value: 'appearance',
      description: '壁紙の汚れや床の傷など、見た目が気になる',
      chatResponse: '見た目は大事ですよね！壁紙や床を変えるだけで、部屋の印象がガラッと変わります。うちの得意分野です！'
    },
    optionB: {
      label: '使いやすさ（段差・手すり）',
      value: 'functionality',
      description: '段差や手すりなど、使いやすさを改善したい',
      chatResponse: 'バリアフリーですね！ご家族の安全を考えるのは大切です。段差解消や手すり設置、けっこう相談多いんですよ。'
    }
  },

  // ========================================
  // 質問3：好みの方向性（施工例マッチング用）
  // ========================================
  {
    id: 3,
    category: 'style_preference',
    question: '普段、どんな雰囲気が好きですか？',
    optionA: {
      label: 'シンプル・スッキリ',
      value: 'simple_clean',
      description: '白や明るい色で、すっきりした空間が好き',
      chatResponse: 'シンプル派ですね！うちの施工例でも、白系の壁紙とか明るい床材が人気ですよ。清潔感あって、飽きないですしね。'
    },
    optionB: {
      label: '落ち着き・温かみ',
      value: 'warm_cozy',
      description: '木目や暖色系で、落ち着いた雰囲気が好き',
      chatResponse: '落ち着いた雰囲気、いいですよね。木目調の壁紙とか、温かみのある床材で、ホッとする空間になりますよ。'
    }
  }
]

// ========================================
// 最初の選択肢（悩みの種類）
// ========================================
export interface InitialConcernOption {
  id: string
  label: string
  icon: string // 絵文字
  description: string
  followUpMessage: string // タクミの返答
}

export const initialConcernOptions: InitialConcernOption[] = [
  {
    id: 'wallpaper',
    label: '壁紙の汚れ・張替え',
    icon: '',
    description: '壁紙の汚れや剥がれが気になる',
    followUpMessage: '壁紙ですね！汚れや剥がれが気になってきました？それとも、雰囲気を変えたい感じですか？'
  },
  {
    id: 'flooring',
    label: '床の傷・張替え',
    icon: '',
    description: '床のきしみや傷が気になる',
    followUpMessage: '床ですね！きしみや傷が気になりますか？それとも、もっと歩きやすい床材にしたいとか？'
  },
  {
    id: 'barrier_free',
    label: 'バリアフリー（段差・手すり）',
    icon: '',
    description: '段差解消や手すり設置を検討',
    followUpMessage: 'バリアフリー改修ですね！段差解消や手すり設置、ご家族の安全を考えてのことですよね？'
  },
  {
    id: 'overall',
    label: '全体的なリフォーム',
    icon: '',
    description: '壁も床もまとめて綺麗にしたい',
    followUpMessage: '全体的なリフォームですね！壁も床も、まとめて綺麗にしたい感じですか？'
  },
  {
    id: 'undecided',
    label: 'まだ決めてない・相談したい',
    icon: '',
    description: 'ちょっと話を聞いてみたい',
    followUpMessage: 'まだ具体的には決まってない感じですね！全然OKです。ざっくばらんに話しましょう。'
  }
]

// ========================================
// 診断スキップ時のメッセージ
// ========================================
export const skipDiagnosticMessage = `診断スキップですね！全然OKです。

気になることがあれば、何でも聞いてください。
見積もりのこと、工期のこと、素材のこと、何でも答えますよ！

ちなみに、どんなことでお困りですか？`

// ========================================
// 診断完了後の提案パターン
// ========================================
export interface DiagnosticResult {
  concernType: string // initial_concern
  answers: {
    urgency: 'has_concerns' | 'planning_ahead'
    priority: 'appearance' | 'functionality'
    style: 'simple_clean' | 'warm_cozy'
  }
}

/**
 * 診断結果から施工例タグを選定
 * @param result 診断結果
 * @returns 施工例フィルタリング用タグ配列
 */
export function getRecommendedTags(result: DiagnosticResult): string[] {
  const tags: string[] = []

  // 悩みの種類からタグ追加
  if (result.concernType === 'wallpaper') {
    tags.push('クロス', '壁紙')
  } else if (result.concernType === 'flooring') {
    tags.push('床材', 'CF', 'フローリング')
  } else if (result.concernType === 'barrier_free') {
    tags.push('バリアフリー', '段差解消', '手すり')
  }

  // 優先順位からタグ追加
  if (result.answers.priority === 'appearance') {
    tags.push('デザイン', 'リフォーム')
  } else {
    tags.push('バリアフリー', '機能改善')
  }

  // スタイルからタグ追加
  if (result.answers.style === 'simple_clean') {
    tags.push('シンプル', 'モダン')
  } else {
    tags.push('ナチュラル', '木目')
  }

  return tags
}

// ========================================
// 詳細診断用の追加10問（3問の後に続く）
// ========================================
export const detailedDiagnosticQuestions: DiagnosticQuestionV4[] = [
  // 質問4：予算感
  {
    id: 4,
    category: 'budget',
    question: '予算は、どれくらいを考えていますか？',
    optionA: {
      label: 'できるだけ抑えたい',
      value: 'budget_low',
      description: '必要最小限で、コストを抑えたい',
      chatResponse: 'コストを抑えたいんですね。うちは材料も工法も選べるので、予算に合わせた提案ができますよ。'
    },
    optionB: {
      label: '質を重視したい',
      value: 'budget_quality',
      description: '多少高くても、良いものを使いたい',
      chatResponse: '質重視ですね！長持ちする素材や、デザイン性の高い壁紙とか、いろいろありますよ。'
    }
  },

  // 質問5：工期
  {
    id: 5,
    category: 'timeline',
    question: '工事は、いつ頃を考えていますか？',
    optionA: {
      label: 'できるだけ早く',
      value: 'timeline_urgent',
      description: '1〜2ヶ月以内に始めたい',
      chatResponse: '急ぎなんですね。スケジュール調整してみますので、相談しましょう！'
    },
    optionB: {
      label: 'じっくり計画したい',
      value: 'timeline_flexible',
      description: '3ヶ月以降でも大丈夫',
      chatResponse: 'じっくり計画派ですね。時間があると、納得いくまで打ち合わせできますから、いいですよ。'
    }
  },

  // 質問6：施工範囲
  {
    id: 6,
    category: 'scope',
    question: '施工する範囲は、どれくらいですか？',
    optionA: {
      label: '1〜2部屋',
      value: 'scope_small',
      description: '気になる部屋だけ',
      chatResponse: '部分的な施工ですね。1部屋だけでも、けっこう雰囲気変わりますよ。'
    },
    optionB: {
      label: '3部屋以上・全体',
      value: 'scope_large',
      description: '複数の部屋や家全体',
      chatResponse: '全体的な施工ですね！まとめてやると、統一感が出て、お得になることもありますよ。'
    }
  },

  // 質問7：住みながら施工か
  {
    id: 7,
    category: 'living_situation',
    question: '工事中は、どうされますか？',
    optionA: {
      label: '住みながら',
      value: 'living_stay',
      description: '住みながら工事してほしい',
      chatResponse: '住みながらの施工ですね。音やホコリに配慮しながら進めますので、安心してください。'
    },
    optionB: {
      label: '一時的に退去',
      value: 'living_vacant',
      description: '空き家や、一時的に退去できる',
      chatResponse: '退去できるんですね。その方が一気に進められるので、工期が短くなりますよ。'
    }
  },

  // 質問8：壁紙の色・柄
  {
    id: 8,
    category: 'wallpaper_preference',
    question: '壁紙は、どんな感じが好みですか？',
    optionA: {
      label: '無地・シンプル',
      value: 'wallpaper_plain',
      description: '白やベージュの無地',
      chatResponse: '無地派ですね。シンプルな壁紙は、どんな家具にも合うし、飽きないですよ。'
    },
    optionB: {
      label: '柄・アクセント',
      value: 'wallpaper_pattern',
      description: '柄物やアクセントクロス',
      chatResponse: '柄物やアクセントクロスですね！1面だけ変えるだけでも、おしゃれになりますよ。'
    }
  },

  // 質問9：床材の好み
  {
    id: 9,
    category: 'flooring_preference',
    question: '床は、どんな素材が好みですか？',
    optionA: {
      label: 'フローリング・木目',
      value: 'flooring_wood',
      description: '温かみのある木目調',
      chatResponse: '木目調ですね。温かみがあって、人気ですよ。フローリング風のCFもあります。'
    },
    optionB: {
      label: 'タイル・クッションフロア',
      value: 'flooring_tile',
      description: '掃除しやすいタイルやCF',
      chatResponse: 'タイルやCFですね。水に強くて掃除しやすいので、キッチンとかトイレに最適ですよ。'
    }
  },

  // 質問10：ペットや小さいお子さん
  {
    id: 10,
    category: 'family_situation',
    question: 'ペットや小さいお子さんは、いますか？',
    optionA: {
      label: 'いる',
      value: 'has_pets_kids',
      description: 'ペットや小さいお子さんがいる',
      chatResponse: 'ペットやお子さんがいるんですね。傷に強い床材とか、汚れに強い壁紙がおすすめですよ。'
    },
    optionB: {
      label: 'いない',
      value: 'no_pets_kids',
      description: 'ペットや小さいお子さんはいない',
      chatResponse: 'そうなんですね。デザイン重視で選べますから、好みの素材を探しましょう。'
    }
  },

  // 質問11：バリアフリーの必要性
  {
    id: 11,
    category: 'barrier_free_need',
    question: '段差や手すりは、必要ですか？',
    optionA: {
      label: '必要',
      value: 'barrier_free_yes',
      description: '段差解消や手すり設置が必要',
      chatResponse: 'バリアフリー改修ですね。段差解消や手すりで、安全性がグッと上がりますよ。'
    },
    optionB: {
      label: '今のところ不要',
      value: 'barrier_free_no',
      description: '今は段差や手すりは不要',
      chatResponse: '今は不要なんですね。将来的に必要になったら、また相談してくださいね。'
    }
  },

  // 質問12：こだわりポイント
  {
    id: 12,
    category: 'priority_detail',
    question: '特にこだわりたいのは、どっちですか？',
    optionA: {
      label: 'デザイン・見た目',
      value: 'priority_design',
      description: 'おしゃれさ・見た目重視',
      chatResponse: 'デザイン重視ですね！施工例もたくさんあるので、好みのイメージを見つけましょう。'
    },
    optionB: {
      label: '機能・使いやすさ',
      value: 'priority_function',
      description: '使いやすさ・機能性重視',
      chatResponse: '機能性重視ですね。防音、防水、防汚など、機能的な素材もいろいろありますよ。'
    }
  },

  // 質問13：最終確認
  {
    id: 13,
    category: 'final_check',
    question: '最後に、一番気になることは何ですか？',
    optionA: {
      label: '費用・見積もり',
      value: 'concern_cost',
      description: '費用がどれくらいかかるか知りたい',
      chatResponse: '費用が一番気になりますよね。無料見積もりできますので、気軽に相談してください。'
    },
    optionB: {
      label: '仕上がり・イメージ',
      value: 'concern_image',
      description: 'どんな仕上がりになるか不安',
      chatResponse: '仕上がりが不安なんですね。施工例の写真もたくさんあるので、イメージしやすいですよ。'
    }
  }
]
