/**
 * プロジェクト（案件）データ
 */

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold'

export type ProjectMember = {
  craftsmanId: string // 職人ID
  role: string // 役割（主担当、サブ、など）
  involvement: number // 関与度 1-10
  workDays: number // 作業日数
}

export type Project = {
  id: string
  name: string
  client: string
  location: string
  category: string
  status: ProjectStatus
  startDate: string
  endDate: string
  budget: number
  members: ProjectMember[]
  description: string
}

export const projectsData: Project[] = [
  {
    id: 'p001',
    name: '墨田区Oビル 3F事務所改装',
    client: 'O社',
    location: '墨田区業平',
    category: '店舗・オフィス',
    status: 'completed',
    startDate: '2022-06-15',
    endDate: '2022-06-28',
    budget: 1500000,
    members: [
      { craftsmanId: 'c001', role: '主担当（クロス）', involvement: 10, workDays: 8 },
      { craftsmanId: 'c004', role: 'サブ（タイルカーペット）', involvement: 8, workDays: 5 },
      { craftsmanId: 'c007', role: 'LGS・ボード', involvement: 6, workDays: 4 },
    ],
    description: '入居前のリニューアル工事。GLボンドクロス剥がし→石膏ボード+クロス。床はタイルカーペット。電気屋さんと同時進行。'
  },
  {
    id: 'p002',
    name: '江東区Mマンション クロス・CF張替',
    client: 'M様',
    location: '江東区東陽町',
    category: '住宅・マンション',
    status: 'completed',
    startDate: '2024-08-06',
    endDate: '2024-08-10',
    budget: 580000,
    members: [
      { craftsmanId: 'c002', role: '主担当', involvement: 10, workDays: 4 },
      { craftsmanId: 'c003', role: 'サブ（CF）', involvement: 5, workDays: 2 },
    ],
    description: '築25年3LDK。天井シミあり下地補修実施。サンゲツSP使用、廊下・洗面はCF張替。'
  },
  {
    id: 'p003',
    name: '台東区K様邸 バリアフリー改修',
    client: 'K様',
    location: '台東区浅草',
    category: '住宅・マンション',
    status: 'completed',
    startDate: '2020-05-01',
    endDate: '2020-05-15',
    budget: 950000,
    members: [
      { craftsmanId: 'c005', role: '主担当（バリアフリー）', involvement: 10, workDays: 10 },
      { craftsmanId: 'c003', role: 'サブ（床CF）', involvement: 6, workDays: 4 },
      { craftsmanId: 'c001', role: 'クロス補助', involvement: 3, workDays: 2 },
    ],
    description: '80代ご夫婦。介護保険利用。手すり、段差スロープ、ノンスリップCF。ケアマネさんと打合せ。'
  },
  {
    id: 'p004',
    name: '渋谷区Sカフェ 内装工事',
    client: 'Sカフェ',
    location: '渋谷区神南',
    category: '店舗・オフィス',
    status: 'completed',
    startDate: '2019-04-10',
    endDate: '2019-04-20',
    budget: 2300000,
    members: [
      { craftsmanId: 'c006', role: '主担当（複合）', involvement: 10, workDays: 10 },
      { craftsmanId: 'c001', role: 'クロス', involvement: 7, workDays: 5 },
      { craftsmanId: 'c010', role: 'ダイノック', involvement: 6, workDays: 4 },
    ],
    description: '居抜きカフェ改装。壁一部塗装、カウンター廻りダイノック。大工さんと連携。'
  },
  {
    id: 'p005',
    name: '大田区Tクリニック 開業工事',
    client: 'Tクリニック',
    location: '大田区蒲田',
    category: '公共施設',
    status: 'completed',
    startDate: '2005-02-28',
    endDate: '2005-03-18',
    budget: 3800000,
    members: [
      { craftsmanId: 'c007', role: '主担当（LGS〜クロス）', involvement: 10, workDays: 15 },
      { craftsmanId: 'c004', role: '床CF', involvement: 7, workDays: 6 },
      { craftsmanId: 'c001', role: 'クロス補助', involvement: 6, workDays: 8 },
    ],
    description: 'テナント新規開業。医療用クロス、LGS組立〜ボード張り〜クロス。設備屋さんと調整。'
  },
  {
    id: 'p006',
    name: '江戸川区I様 和室→洋室改装',
    client: 'I様',
    location: '江戸川区西葛西',
    category: '住宅・マンション',
    status: 'completed',
    startDate: '2018-03-15',
    endDate: '2018-03-22',
    budget: 1200000,
    members: [
      { craftsmanId: 'c003', role: '主担当（床）', involvement: 10, workDays: 7 },
      { craftsmanId: 'c002', role: 'クロス', involvement: 7, workDays: 4 },
      { craftsmanId: 'c007', role: '大工（押入れ造替え）', involvement: 6, workDays: 3 },
    ],
    description: '6畳和室→洋室。畳撤去→合板下地→フローリング。天井クロス、押入れ→クローゼット。'
  },
  {
    id: 'p007',
    name: '足立区F福祉施設 デイルーム',
    client: 'F福祉施設',
    location: '足立区綾瀬',
    category: '公共施設',
    status: 'completed',
    startDate: '2001-01-10',
    endDate: '2001-01-25',
    budget: 2100000,
    members: [
      { craftsmanId: 'c005', role: '主担当（バリアフリー）', involvement: 10, workDays: 12 },
      { craftsmanId: 'c009', role: '長尺シート', involvement: 8, workDays: 6 },
      { craftsmanId: 'c001', role: 'クロス', involvement: 6, workDays: 4 },
    ],
    description: 'デイサービス食堂・リハビリスペース。手すり、ノンスリップ長尺シート。ケアマネ立会検査。'
  },
  {
    id: 'p008',
    name: '新宿区N美容室 床CF張替',
    client: 'N美容室',
    location: '新宿区高田馬場',
    category: '店舗・オフィス',
    status: 'completed',
    startDate: '2008-09-03',
    endDate: '2008-09-05',
    budget: 420000,
    members: [
      { craftsmanId: 'c009', role: '主担当', involvement: 10, workDays: 2 },
      { craftsmanId: 'c004', role: 'サブ', involvement: 8, workDays: 2 },
    ],
    description: '営業中の美容室。定休日2日間のみ作業。夜間作業で完工。'
  },
  {
    id: 'p009',
    name: '中央区Hビル会議室改装',
    client: 'Hビル管理組合',
    location: '中央区日本橋',
    category: '店舗・オフィス',
    status: 'completed',
    startDate: '2012-11-01',
    endDate: '2012-11-15',
    budget: 3200000,
    members: [
      { craftsmanId: 'c004', role: '主担当（OAフロア・カーペット）', involvement: 10, workDays: 12 },
      { craftsmanId: 'c010', role: 'クロス', involvement: 7, workDays: 6 },
      { craftsmanId: 'c001', role: 'クロス補助', involvement: 5, workDays: 4 },
    ],
    description: '5階建てビル3階会議室。OAフロア組直し→カーペット。音響業者と調整。'
  },
  {
    id: 'p010',
    name: '品川区Y様 キッチン壁CF張り',
    client: 'Y様',
    location: '品川区大井町',
    category: '住宅・マンション',
    status: 'completed',
    startDate: '2015-02-06',
    endDate: '2015-02-08',
    budget: 180000,
    members: [
      { craftsmanId: 'c010', role: '主担当（ダイノック）', involvement: 10, workDays: 2 },
    ],
    description: 'キッチン壁面のみ張替え。油汚れ下地処理に時間。3Mダイノックでタイル調。'
  },
]
