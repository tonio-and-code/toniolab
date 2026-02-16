/**
 * 職人スケジュールデータ（ガントチャート用）
 */

export type ScheduleItem = {
  id: string
  craftsmanId: string
  craftsmanName: string
  projectId: string
  projectName: string
  startDate: string
  endDate: string
  status: 'scheduled' | 'in_progress' | 'completed'
  workDays: number
}

// 2025年10月〜11月のスケジュール例
export const schedulesData: ScheduleItem[] = [
  // 田中 太郎 (c001)
  {
    id: 's001',
    craftsmanId: 'c001',
    craftsmanName: '田中 太郎',
    projectId: 'p101',
    projectName: '江東区Aマンション改修',
    startDate: '2025-10-01',
    endDate: '2025-10-05',
    status: 'completed',
    workDays: 5,
  },
  {
    id: 's002',
    craftsmanId: 'c001',
    craftsmanName: '田中 太郎',
    projectId: 'p102',
    projectName: '墨田区Bビル クロス張替',
    startDate: '2025-10-07',
    endDate: '2025-10-12',
    status: 'in_progress',
    workDays: 6,
  },
  {
    id: 's003',
    craftsmanId: 'c001',
    craftsmanName: '田中 太郎',
    projectId: 'p103',
    projectName: '台東区C様邸 内装工事',
    startDate: '2025-10-15',
    endDate: '2025-10-20',
    status: 'scheduled',
    workDays: 6,
  },

  // 佐藤 次郎 (c002)
  {
    id: 's004',
    craftsmanId: 'c002',
    craftsmanName: '佐藤 次郎',
    projectId: 'p104',
    projectName: '江東区Dマンション',
    startDate: '2025-10-01',
    endDate: '2025-10-10',
    status: 'in_progress',
    workDays: 10,
  },
  {
    id: 's005',
    craftsmanId: 'c002',
    craftsmanName: '佐藤 次郎',
    projectId: 'p105',
    projectName: '中央区Eオフィス',
    startDate: '2025-10-14',
    endDate: '2025-10-18',
    status: 'scheduled',
    workDays: 5,
  },

  // 鈴木 三郎 (c003)
  {
    id: 's006',
    craftsmanId: 'c003',
    craftsmanName: '鈴木 三郎',
    projectId: 'p106',
    projectName: '江戸川区F様 フローリング',
    startDate: '2025-10-02',
    endDate: '2025-10-08',
    status: 'completed',
    workDays: 7,
  },
  {
    id: 's007',
    craftsmanId: 'c003',
    craftsmanName: '鈴木 三郎',
    projectId: 'p107',
    projectName: '足立区G保育園 床改修',
    startDate: '2025-10-21',
    endDate: '2025-10-28',
    status: 'scheduled',
    workDays: 8,
  },

  // 高橋 四郎 (c004)
  {
    id: 's008',
    craftsmanId: 'c004',
    craftsmanName: '高橋 四郎',
    projectId: 'p108',
    projectName: '台東区Hビル カーペット',
    startDate: '2025-10-03',
    endDate: '2025-10-07',
    status: 'completed',
    workDays: 5,
  },
  {
    id: 's009',
    craftsmanId: 'c004',
    craftsmanName: '高橋 四郎',
    projectId: 'p109',
    projectName: '品川区Iオフィス OAフロア',
    startDate: '2025-10-16',
    endDate: '2025-10-22',
    status: 'scheduled',
    workDays: 7,
  },

  // 伊藤 五郎 (c005)
  {
    id: 's010',
    craftsmanId: 'c005',
    craftsmanName: '伊藤 五郎',
    projectId: 'p110',
    projectName: '足立区J様 バリアフリー',
    startDate: '2025-10-01',
    endDate: '2025-10-14',
    status: 'in_progress',
    workDays: 14,
  },
  {
    id: 's011',
    craftsmanId: 'c005',
    craftsmanName: '伊藤 五郎',
    projectId: 'p111',
    projectName: '江戸川区K福祉施設',
    startDate: '2025-10-18',
    endDate: '2025-10-30',
    status: 'scheduled',
    workDays: 13,
  },

  // 渡辺 六郎 (c006)
  {
    id: 's012',
    craftsmanId: 'c006',
    craftsmanName: '渡辺 六郎',
    projectId: 'p112',
    projectName: '渋谷区L店舗',
    startDate: '2025-10-01',
    endDate: '2025-10-11',
    status: 'in_progress',
    workDays: 11,
  },
  {
    id: 's013',
    craftsmanId: 'c006',
    craftsmanName: '渡辺 六郎',
    projectId: 'p113',
    projectName: '新宿区Mカフェ',
    startDate: '2025-10-23',
    endDate: '2025-10-31',
    status: 'scheduled',
    workDays: 9,
  },

  // 山本 七郎 (c007)
  {
    id: 's014',
    craftsmanId: 'c007',
    craftsmanName: '山本 七郎',
    projectId: 'p114',
    projectName: '大田区Nクリニック',
    startDate: '2025-10-05',
    endDate: '2025-10-19',
    status: 'in_progress',
    workDays: 15,
  },

  // 中村 八郎 (c008)
  {
    id: 's015',
    craftsmanId: 'c008',
    craftsmanName: '中村 八郎',
    projectId: 'p115',
    projectName: '品川区O様邸',
    startDate: '2025-10-08',
    endDate: '2025-10-11',
    status: 'completed',
    workDays: 4,
  },
  {
    id: 's016',
    craftsmanId: 'c008',
    craftsmanName: '中村 八郎',
    projectId: 'p116',
    projectName: '港区P様邸',
    startDate: '2025-10-17',
    endDate: '2025-10-21',
    status: 'scheduled',
    workDays: 5,
  },

  // 小林 九郎 (c009) - 休養中のため予定なし

  // 加藤 十郎 (c010)
  {
    id: 's017',
    craftsmanId: 'c010',
    craftsmanName: '加藤 十郎',
    projectId: 'p117',
    projectName: '中央区Qビル ダイノック',
    startDate: '2025-10-02',
    endDate: '2025-10-06',
    status: 'completed',
    workDays: 5,
  },
  {
    id: 's018',
    craftsmanId: 'c010',
    craftsmanName: '加藤 十郎',
    projectId: 'p118',
    projectName: '渋谷区Rオフィス',
    startDate: '2025-10-14',
    endDate: '2025-10-20',
    status: 'scheduled',
    workDays: 7,
  },
]

// 今日の日付を基準に稼働状況を判定する関数
export const getCraftsmanStatus = (craftsmanId: string, targetDate: Date = new Date()): 'available' | 'busy' | 'off' => {
  const todayStr = targetDate.toISOString().split('T')[0]

  const activeSchedules = schedulesData.filter(schedule =>
    schedule.craftsmanId === craftsmanId &&
    schedule.startDate <= todayStr &&
    schedule.endDate >= todayStr &&
    (schedule.status === 'in_progress' || schedule.status === 'scheduled')
  )

  if (activeSchedules.length > 0) {
    return 'busy'
  }

  // 小林 九郎は休養中
  if (craftsmanId === 'c009') {
    return 'off'
  }

  return 'available'
}
