export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      craftsmen_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          company_name: string | null
          profession: string | null
          experience_years: number | null
          bio: string | null
          phone: string | null
          location_area: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          company_name?: string | null
          profession?: string | null
          experience_years?: number | null
          bio?: string | null
          phone?: string | null
          location_area?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          company_name?: string | null
          profession?: string | null
          experience_years?: number | null
          bio?: string | null
          phone?: string | null
          location_area?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      work_records: {
        Row: {
          id: string
          user_id: string
          site_name: string
          work_date: string
          location_name: string | null
          latitude: number | null
          longitude: number | null
          before_photo_url: string
          after_photo_url: string
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          site_name: string
          work_date?: string
          location_name?: string | null
          latitude?: number | null
          longitude?: number | null
          before_photo_url: string
          after_photo_url: string
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          site_name?: string
          work_date?: string
          location_name?: string | null
          latitude?: number | null
          longitude?: number | null
          before_photo_url?: string
          after_photo_url?: string
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
