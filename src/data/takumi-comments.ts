/**
 * タクミのコメントデータ
 *
 * n8nから自動的に追加される
 * コルクじじいのツイートに対するAIタクミのツッコミ
 */

export interface TakumiComment {
  id: string
  jijiiTweet: string      // じじいのツイート内容
  takumiComment: string   // タクミの返答
  createdAt: string       // ISO 8601形式
}

// 最新のコメントを保持（最大10件）
export const takumiComments: TakumiComment[] = [
  {
    id: "sample-1",
    jijiiTweet: "ああ、リチウムイオン電池か。若い頃は、火事の恐ろしさを知らぬ世代も多かった。しかし、対策パッケージが必要とは、時代も変わったもんじゃ。壁を見つめ、思い出す職人の腕。時代を越える知恵を大切にせんとな。",
    takumiComment: "じじい、防火性能って壁紙でも対策できるんすよね？最近の不燃クロス、すごいって聞きました！",
    createdAt: "2025-12-23T17:00:00.000Z"
  },
  {
    id: "sample-2",
    jijiiTweet: "今日も、いい天気ですね（雨でも雪でも）。",
    takumiComment: "じじい、それ天気関係なく言ってますよね...？でも現場は天候関係なく仕上げる、それがプロっすね！",
    createdAt: "2025-12-23T16:00:00.000Z"
  }
]
