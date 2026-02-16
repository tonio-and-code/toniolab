/**
 * 職人データ（内部管理用）
 */

export type CraftsmanStatus = 'available' | 'busy' | 'off'

export type Craftsman = {
  id: string
  name: string
  specialty: string[] // 専門分野
  mainArea: string // 主な活動エリア
  coordinates: {
    lat: number
    lng: number
  }
  status: CraftsmanStatus
  rating: number // 内部評価 1-5
  experience: number // 経験年数
  phone?: string
  email?: string
  recentWorks: string[] // 直近の施工実績ID
  skills: {
    wallpaper: number // クロス 1-5
    flooring: number // 床 1-5
    barrierFree: number // バリアフリー 1-5
    painting: number // 塗装 1-5
    carpentry: number // 大工 1-5
  }
  notes?: string // 備考
}

export const craftsmenData: Craftsman[] = [
  // クロス専門
  {
    id: 'c001',
    name: '田中 太郎',
    specialty: ['クロス', '壁紙'],
    mainArea: '墨田区',
    coordinates: { lat: 35.7101, lng: 139.8107 },
    status: 'available',
    rating: 5,
    experience: 15,
    phone: '090-1234-5678',
    recentWorks: ['2', '9'],
    skills: {
      wallpaper: 5,
      flooring: 3,
      barrierFree: 2,
      painting: 2,
      carpentry: 1,
    },
    notes: 'GLボンド剥がしが得意。大型物件対応可能。'
  },
  {
    id: 'c002',
    name: '佐藤 次郎',
    specialty: ['クロス', 'CF'],
    mainArea: '江東区',
    coordinates: { lat: 35.6702, lng: 139.8176 },
    status: 'busy',
    rating: 4,
    experience: 10,
    phone: '090-2345-6789',
    recentWorks: ['1'],
    skills: {
      wallpaper: 4,
      flooring: 4,
      barrierFree: 2,
      painting: 1,
      carpentry: 1,
    },
    notes: 'マンション案件が得意。丁寧な仕上げ。'
  },

  // 床・CF専門
  {
    id: 'c003',
    name: '鈴木 三郎',
    specialty: ['床', 'CF', 'フローリング'],
    mainArea: '江戸川区',
    coordinates: { lat: 35.6645, lng: 139.8682 },
    status: 'available',
    rating: 5,
    experience: 20,
    phone: '090-3456-7890',
    recentWorks: ['4', '10'],
    skills: {
      wallpaper: 2,
      flooring: 5,
      barrierFree: 4,
      painting: 1,
      carpentry: 3,
    },
    notes: '和室改装のエキスパート。フローリング張りが正確。'
  },
  {
    id: 'c004',
    name: '高橋 四郎',
    specialty: ['CF', 'タイルカーペット'],
    mainArea: '台東区',
    coordinates: { lat: 35.7148, lng: 139.7967 },
    status: 'available',
    rating: 4,
    experience: 12,
    phone: '090-4567-8901',
    recentWorks: ['7'],
    skills: {
      wallpaper: 2,
      flooring: 5,
      barrierFree: 3,
      painting: 1,
      carpentry: 2,
    },
    notes: 'オフィス案件が得意。OAフロア対応可能。'
  },

  // バリアフリー専門
  {
    id: 'c005',
    name: '伊藤 五郎',
    specialty: ['バリアフリー', '手すり設置'],
    mainArea: '足立区',
    coordinates: { lat: 35.7649, lng: 139.8261 },
    status: 'available',
    rating: 5,
    experience: 18,
    phone: '090-5678-9012',
    recentWorks: ['3', '12'],
    skills: {
      wallpaper: 2,
      flooring: 3,
      barrierFree: 5,
      painting: 2,
      carpentry: 3,
    },
    notes: '介護保険対応精通。ケアマネさんとの連携得意。'
  },

  // 複合スキル
  {
    id: 'c006',
    name: '渡辺 六郎',
    specialty: ['クロス', '床', '塗装'],
    mainArea: '渋谷区',
    coordinates: { lat: 35.6627, lng: 139.7025 },
    status: 'busy',
    rating: 4,
    experience: 14,
    phone: '090-6789-0123',
    recentWorks: ['6'],
    skills: {
      wallpaper: 4,
      flooring: 4,
      barrierFree: 2,
      painting: 4,
      carpentry: 3,
    },
    notes: '店舗案件が得意。デザイン性の高い仕上げ。'
  },
  {
    id: 'c007',
    name: '山本 七郎',
    specialty: ['クロス', 'LGS', 'ボード'],
    mainArea: '大田区',
    coordinates: { lat: 35.5619, lng: 139.7231 },
    status: 'available',
    rating: 5,
    experience: 22,
    phone: '090-7890-1234',
    recentWorks: ['11'],
    skills: {
      wallpaper: 5,
      flooring: 2,
      barrierFree: 3,
      painting: 3,
      carpentry: 4,
    },
    notes: 'クリニック案件経験豊富。LGS組立からクロス仕上げまで。'
  },

  // 若手
  {
    id: 'c008',
    name: '中村 八郎',
    specialty: ['クロス', '床'],
    mainArea: '品川区',
    coordinates: { lat: 35.6056, lng: 139.7341 },
    status: 'available',
    rating: 3,
    experience: 5,
    phone: '090-8901-2345',
    recentWorks: ['5'],
    skills: {
      wallpaper: 3,
      flooring: 3,
      barrierFree: 2,
      painting: 2,
      carpentry: 1,
    },
    notes: '若手だが丁寧。小規模案件向き。成長株。'
  },

  // ベテラン
  {
    id: 'c009',
    name: '小林 九郎',
    specialty: ['クロス', '長尺シート'],
    mainArea: '新宿区',
    coordinates: { lat: 35.7126, lng: 139.7038 },
    status: 'off',
    rating: 5,
    experience: 30,
    phone: '090-9012-3456',
    recentWorks: ['8', '9'],
    skills: {
      wallpaper: 5,
      flooring: 5,
      barrierFree: 4,
      painting: 3,
      carpentry: 2,
    },
    notes: 'ベテラン。難易度の高い案件も対応可能。現在休養中。'
  },
  {
    id: 'c010',
    name: '加藤 十郎',
    specialty: ['クロス', 'CF', 'ダイノック'],
    mainArea: '中央区',
    coordinates: { lat: 35.6828, lng: 139.7745 },
    status: 'available',
    rating: 4,
    experience: 16,
    phone: '090-0123-4567',
    recentWorks: ['5', '7'],
    skills: {
      wallpaper: 4,
      flooring: 4,
      barrierFree: 2,
      painting: 3,
      carpentry: 2,
    },
    notes: 'ダイノック貼りが得意。オフィス・店舗案件多数。'
  },
]
