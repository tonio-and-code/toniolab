/**
 * エコシステム - キャラクター同士の会話システム
 *
 * 3人のキャラクターが確率的に反応し合う「生態系」
 * 誰も見ていなくても、勝手に会話している。
 */

export type Character = 'jijii' | 'anya' | 'takumi'

export interface EcosystemMessage {
  id: string
  threadId: string           // 会話スレッドID
  character: Character       // 発言者
  message: string            // 発言内容
  parentId: string | null    // 返信先（nullなら起点）
  trigger?: string           // 外部トリガー（NHK等）
  createdAt: string
}

export interface EcosystemThread {
  id: string
  messages: EcosystemMessage[]
  createdAt: string
}

// キャラクター定義
export const CHARACTERS = {
  jijii: {
    name: 'コルクじじい',
    icon: '/icons/jijii.png',
    color: '#D4AF37',                 // ゴールド
    style: {
      tone: 'short',                  // 短い
      perspective: 'craftsman',       // 職人視点
      tendency: 'nostalgic',          // 過去を振り返る
      quirks: ['〜じゃ', '〜のう', '昔は〜']
    }
  },
  anya: {
    name: 'アーニャ',
    icon: '/icons/anya.png',
    color: '#EC4899',                 // ピンク
    style: {
      tone: 'curious',                // 素朴な疑問
      perspective: 'young',           // 若い視点
      tendency: 'sometimes_off',      // 時々ズレてる
      quirks: ['〜なの？', 'えっと〜', 'わかんない']
    }
  },
  takumi: {
    name: 'AIタクミ',
    icon: '/icons/takumi.png',
    color: '#10B981',                 // グリーン
    style: {
      tone: 'polite',                 // 丁寧
      perspective: 'modern',          // 現代的
      tendency: 'tries_to_summarize', // まとめようとする
      quirks: ['〜っすね', '〜っすよ', 'つまり〜']
    }
  }
} as const

// 反応確率の設定
export const REACTION_CONFIG = {
  baseReactionChance: 0.5,      // 基本反応確率 50%
  maxChainLength: 5,            // 最大連鎖長
  silenceIsOkay: true,          // 沈黙も会話の一部
  mismatchAllowed: true,        // 噛み合わないのもOK

  // キャラクター別の反応傾向
  characterTendencies: {
    jijii: {
      reactsTo: ['anya', 'takumi'],
      reactionChance: 0.4,       // じじいはあまり反応しない
      ignoreChance: 0.3          // 無視することも
    },
    anya: {
      reactsTo: ['jijii', 'takumi'],
      reactionChance: 0.6,       // アーニャは反応しやすい
      confusedChance: 0.2        // 困惑することも
    },
    takumi: {
      reactsTo: ['jijii', 'anya'],
      reactionChance: 0.5,       // タクミは中間
      summarizeChance: 0.3       // まとめようとする
    }
  }
}

// サンプル会話データ
export const sampleEcosystemThreads: EcosystemThread[] = [
  {
    id: 'thread-1',
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-1',
        threadId: 'thread-1',
        character: 'jijii',
        message: '今朝のNHK見たか？リチウム電池の火事、怖いのう。昔は火の用心と言えば寝タバコじゃったが...',
        parentId: null,
        trigger: 'NHK朝ニュース',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        threadId: 'thread-1',
        character: 'anya',
        message: 'えっ、リチウム電池って...スマホのやつ？アーニャのスマホも燃えちゃうの？',
        parentId: 'msg-1',
        createdAt: new Date(Date.now() - 3000000).toISOString()
      },
      {
        id: 'msg-3',
        threadId: 'thread-1',
        character: 'takumi',
        message: 'アーニャさん、大丈夫っすよ！正しく使えば問題ないっす。ただ、内装的には不燃クロスとか防火対策も大事っすね。',
        parentId: 'msg-2',
        createdAt: new Date(Date.now() - 2400000).toISOString()
      },
      {
        id: 'msg-4',
        threadId: 'thread-1',
        character: 'jijii',
        message: '...クロスか。昔はコルクで断熱したもんじゃ。',
        parentId: 'msg-3',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  },
  {
    id: 'thread-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: 'msg-5',
        threadId: 'thread-2',
        character: 'jijii',
        message: '雨じゃな。',
        parentId: null,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'msg-6',
        threadId: 'thread-2',
        character: 'takumi',
        message: '雨の日は湿度管理が大事っすね！クロスの糊の乾燥に影響するんで...',
        parentId: 'msg-5',
        createdAt: new Date(Date.now() - 86000000).toISOString()
      },
      {
        id: 'msg-7',
        threadId: 'thread-2',
        character: 'anya',
        message: '雨...傘忘れた。',
        parentId: 'msg-5',
        createdAt: new Date(Date.now() - 85600000).toISOString()
      }
    ]
  }
]
