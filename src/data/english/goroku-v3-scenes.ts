// Goroku v3: Scene-based curriculum -- INTERLEAVED layout
// 31 scenes across 5 meta-categories, cycling every 5 days
// Every week you practice all 5 functions

export interface MetaCategory {
  key: string;
  label: string;
  ja: string;
  color: string;
  days: number[];
}

export interface SceneInfo {
  day: number;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  metaCategory: string;
}

export const V3_META_CATEGORIES: MetaCategory[] = [
  {
    key: 'connect',
    label: 'CONNECT',
    ja: '繋がる',
    color: '#D4AF37',
    days: [1, 6, 11, 16, 21, 26],
  },
  {
    key: 'inform',
    label: 'INFORM',
    ja: '伝える',
    color: '#3B82F6',
    days: [2, 7, 12, 17, 22, 27],
  },
  {
    key: 'influence',
    label: 'INFLUENCE',
    ja: '動かす',
    color: '#10B981',
    days: [3, 8, 13, 18, 23, 28],
  },
  {
    key: 'express',
    label: 'EXPRESS',
    ja: '表す',
    color: '#F59E0B',
    days: [4, 9, 14, 19, 24, 29, 31],
  },
  {
    key: 'navigate',
    label: 'NAVIGATE',
    ja: '乗り切る',
    color: '#8B5CF6',
    days: [5, 10, 15, 20, 25, 30],
  },
];

// Old day -> Scene key mapping (for seed data remapping):
// Old 1->meeting, 2->reconnect, 3->smalltalk, 4->inviting, 5->declining, 6->parting
// Old 7->asking, 8->answering, 9->explaining, 10->reporting, 11->confirming, 12->correcting
// Old 13->requesting, 14->suggesting, 15->persuading, 16->negotiating, 17->permission, 18->directing
// Old 19->joy, 20->frustration, 21->surprise, 22->gratitude, 23->apologizing, 24->empathy, 25->opinions
// Old 26->time, 27->directions, 28->shopping, 29->trouble, 30->phone, 31->selftalk

// Remapping table (oldDay -> newDay):
// 1->1, 2->6, 3->11, 4->16, 5->21, 6->26
// 7->2, 8->7, 9->12, 10->17, 11->22, 12->27
// 13->3, 14->8, 15->13, 16->18, 17->23, 18->28
// 19->4, 20->9, 21->14, 22->19, 23->24, 24->29, 25->31
// 26->5, 27->10, 28->15, 29->20, 30->25, 31->30
export const DAY_REMAP: Record<number, number> = {
  1:1, 2:6, 3:11, 4:16, 5:21, 6:26,
  7:2, 8:7, 9:12, 10:17, 11:22, 12:27,
  13:3, 14:8, 15:13, 16:18, 17:23, 18:28,
  19:4, 20:9, 21:14, 22:19, 23:24, 24:29, 25:31,
  26:5, 27:10, 28:15, 29:20, 30:25, 31:30,
};

export const V3_SCENES: Record<number, SceneInfo> = {
  // ── Round 1 (Days 1-5) ──
  1:  { day: 1,  key: 'meeting',     title: '出会い',     subtitle: 'First Encounters',  description: '初対面の人と話す。名前、仕事、どこから来た', metaCategory: 'connect' },
  2:  { day: 2,  key: 'asking',      title: '聞く',       subtitle: 'Asking',            description: '質問する。情報を引き出す', metaCategory: 'inform' },
  3:  { day: 3,  key: 'requesting',  title: '頼む',       subtitle: 'Requesting',        description: 'お願い、依頼、ちょっといい？', metaCategory: 'influence' },
  4:  { day: 4,  key: 'joy',         title: '喜び',       subtitle: 'Joy',               description: '嬉しい、最高、やった', metaCategory: 'express' },
  5:  { day: 5,  key: 'time',        title: '時間',       subtitle: 'Time',              description: '遅刻、予定、いつ？何時？', metaCategory: 'navigate' },

  // ── Round 2 (Days 6-10) ──
  6:  { day: 6,  key: 'reconnect',   title: '再会',       subtitle: 'Catching Up',       description: '久しぶりに会った人と近況を交換する', metaCategory: 'connect' },
  7:  { day: 7,  key: 'answering',   title: '答える',     subtitle: 'Answering',         description: '聞かれたことに答える。情報を返す', metaCategory: 'inform' },
  8:  { day: 8,  key: 'suggesting',  title: '提案',       subtitle: 'Suggesting',        description: 'こうしたら？こういうのどう？', metaCategory: 'influence' },
  9:  { day: 9,  key: 'frustration', title: '不満',       subtitle: 'Frustration',       description: 'ムカつく、ありえない、最悪', metaCategory: 'express' },
  10: { day: 10, key: 'directions',  title: '場所',       subtitle: 'Directions',        description: 'どこ？右？左？この道まっすぐ？', metaCategory: 'navigate' },

  // ── Round 3 (Days 11-15) ──
  11: { day: 11, key: 'smalltalk',   title: '雑談',       subtitle: 'Small Talk',        description: '天気、週末、最近どう。会話の潤滑油', metaCategory: 'connect' },
  12: { day: 12, key: 'explaining',  title: '説明',       subtitle: 'Explaining',        description: '仕組みや理由をわかりやすく話す', metaCategory: 'inform' },
  13: { day: 13, key: 'persuading',  title: '説得',       subtitle: 'Persuading',        description: 'だからこうすべき。理由を積む', metaCategory: 'influence' },
  14: { day: 14, key: 'surprise',    title: '驚き',       subtitle: 'Surprise',          description: 'マジで？嘘でしょ？信じられない', metaCategory: 'express' },
  15: { day: 15, key: 'shopping',    title: '買い物',     subtitle: 'Shopping',          description: '注文、会計、返品、サイズ', metaCategory: 'navigate' },

  // ── Round 4 (Days 16-20) ──
  16: { day: 16, key: 'inviting',    title: '誘う',       subtitle: 'Inviting',          description: '飯、遊び、イベントに誘う', metaCategory: 'connect' },
  17: { day: 17, key: 'reporting',   title: '報告',       subtitle: 'Reporting',         description: '何が起きたか、どうなったか伝える', metaCategory: 'inform' },
  18: { day: 18, key: 'negotiating', title: '交渉',       subtitle: 'Negotiating',       description: '落とし所を探る。妥協する', metaCategory: 'influence' },
  19: { day: 19, key: 'gratitude',   title: '感謝',       subtitle: 'Gratitude',         description: 'ありがとう、助かった、感謝してる', metaCategory: 'express' },
  20: { day: 20, key: 'trouble',     title: 'トラブル',   subtitle: 'Trouble',           description: '壊れた、盗まれた、助けて、警察', metaCategory: 'navigate' },

  // ── Round 5 (Days 21-25) ──
  21: { day: 21, key: 'declining',   title: '断る',       subtitle: 'Declining',         description: '角を立てずにNoと言う技術', metaCategory: 'connect' },
  22: { day: 22, key: 'confirming',  title: '確認',       subtitle: 'Confirming',        description: '合ってる？もう一回言って？', metaCategory: 'inform' },
  23: { day: 23, key: 'permission',  title: '許可',       subtitle: 'Permission',        description: 'いい？/いいよ。ダメ？/ダメ', metaCategory: 'influence' },
  24: { day: 24, key: 'apologizing', title: '謝罪',       subtitle: 'Apologizing',       description: 'ごめん、悪かった、責任取る', metaCategory: 'express' },
  25: { day: 25, key: 'phone',       title: '電話・画面', subtitle: 'Phone / Screen',    description: 'もしもし、聞こえる？切れた', metaCategory: 'navigate' },

  // ── Round 6 (Days 26-31) ──
  26: { day: 26, key: 'parting',     title: '別れ',       subtitle: 'Parting',           description: 'また今度、じゃあね、気をつけて', metaCategory: 'connect' },
  27: { day: 27, key: 'correcting',  title: '訂正',       subtitle: 'Correcting',        description: '違う、そうじゃなくて、正しくはこう', metaCategory: 'inform' },
  28: { day: 28, key: 'directing',   title: '指示',       subtitle: 'Directing',         description: 'こうして、ああして、次はこれ', metaCategory: 'influence' },
  29: { day: 29, key: 'empathy',     title: '共感',       subtitle: 'Empathy',           description: 'わかるよ、大変だったね、辛いよね', metaCategory: 'express' },
  30: { day: 30, key: 'selftalk',    title: '独り言',     subtitle: 'Self-talk',         description: '考え中、どうしよう、あれなんだっけ', metaCategory: 'navigate' },
  31: { day: 31, key: 'opinions',    title: '意見',       subtitle: 'Opinions',          description: '賛成、反対、俺はこう思う', metaCategory: 'express' },
};
