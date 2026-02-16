// 職人の仕事記録データ型定義

export type WorkRecord = {
  id: string
  user_id: string
  site_name: string
  work_date: string // YYYY-MM-DD
  location_name?: string
  latitude?: number
  longitude?: number
  before_photo_url: string
  after_photo_url: string
  memo?: string
  created_at: string
  updated_at: string
}

export type WorkRecordInsert = Omit<WorkRecord, 'id' | 'created_at' | 'updated_at'>

export type WorkRecordUpdate = Partial<Omit<WorkRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>>

// 統計データ型
export type WorkStats = {
  total_count: number
  this_year_count: number
  this_month_count: number
  this_week_count: number
  area_breakdown: {
    area_name: string
    count: number
  }[]
  yearly_breakdown: {
    year: number
    count: number
  }[]
}
