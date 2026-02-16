// LP作成アンケート用の10問（静的質問リスト）

export interface SurveyQuestion {
  id: number
  category: string
  question: string
  placeholder?: string
}

export const lpSurveyQuestionsV2: SurveyQuestion[] = [
  {
    id: 1,
    category: '基本情報',
    question: 'まず、あなたの事業内容と経験年数を教えてください。',
    placeholder: '例：クロス張替え専門、15年'
  },
  {
    id: 2,
    category: '強みとこだわり',
    question: 'あなたの技術や対応力で、特に自信のある点は何ですか？',
    placeholder: '例：丁寧な下地処理、スピード施工'
  },
  {
    id: 3,
    category: '印象的なエピソード',
    question: 'これまでで最も印象に残っている仕事や、お客様の反応を教えてください。',
    placeholder: '例：〇〇の現場で、お客様に涙を流して喜んでいただいた'
  },
  {
    id: 4,
    category: 'ターゲット客層',
    question: 'どのようなお客様に、特に喜んでいただけると思いますか？',
    placeholder: '例：子育て世代、リフォームを検討中の方'
  },
  {
    id: 5,
    category: '差別化ポイント',
    question: '他の職人や会社と比べて、あなたならではの強みは何ですか？',
    placeholder: '例：アフターフォロー、細かい要望への対応力'
  },
  {
    id: 6,
    category: 'ビジョンと想い',
    question: 'なぜこの仕事を続けているのか、あなたの想いを聞かせてください。',
    placeholder: '例：お客様の笑顔を見るのが一番の喜び'
  },
  {
    id: 7,
    category: '提供サービス',
    question: '具体的にどのようなサービスを提供していますか？価格帯も教えてください。',
    placeholder: '例：クロス張替え（6畳〜）、床材施工'
  },
  {
    id: 8,
    category: 'お客様の声',
    question: 'お客様からよく言われる言葉や、評価されている点を教えてください。',
    placeholder: '例：「丁寧で安心できる」「仕上がりが綺麗」'
  },
  {
    id: 9,
    category: '仕事への姿勢',
    question: '日々の仕事で大切にしていることは何ですか？',
    placeholder: '例：お客様とのコミュニケーション、現場の整理整頓'
  },
  {
    id: 10,
    category: '将来の展望',
    question: '今後、どのような職人でありたいと思いますか？',
    placeholder: '例：地域で信頼される職人、若手の育成にも力を入れたい'
  },
]

export interface SurveyAnswer {
  question_id: number
  question: string
  answer: string
}
