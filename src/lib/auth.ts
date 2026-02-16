import { createClient } from './supabase/client'
import type { Database } from '@/types/supabase'

type CraftsmanProfile = Database['public']['Tables']['craftsmen_profiles']['Row']

// Create a client instance for this module
const supabase = createClient()

export interface SignUpData {
  email: string
  password: string
  displayName: string
  profession?: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * サインアップ（新規登録）
 */
export async function signUp(data: SignUpData) {
  try {
    // 1. Supabase Authでユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/craftsman/dashboard`,
      },
    })

    if (authError) {
      throw new Error(`認証エラー: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('ユーザー作成に失敗しました')
    }

    // 2. craftsmen_profilesテーブルにプロフィール作成
    const { error: profileError } = await supabase
      .from('craftsmen_profiles')
      .insert({
        user_id: authData.user.id,
        display_name: data.displayName,
        profession: data.profession || null,
      })

    if (profileError) {
      throw new Error(`プロフィール作成エラー: ${profileError.message}`)
    }

    return { user: authData.user, session: authData.session }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('登録に失敗しました')
  }
}

/**
 * サインイン（ログイン）
 */
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error
    return { user: authData.user, session: authData.session }
  } catch (error) {
    throw error
  }
}

/**
 * サインアウト（ログアウト）
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    throw error
  }
}

/**
 * 現在のユーザー取得
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch {
    return null
  }
}

/**
 * 現在のセッション取得
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch {
    return null
  }
}

/**
 * 職人プロフィール取得
 */
export async function getCraftsmanProfile(userId: string): Promise<CraftsmanProfile | null> {
  try {
    const { data, error } = await supabase
      .from('craftsmen_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // プロフィールが存在しない場合はnullを返す（エラーではない）
      if (error.code === 'PGRST116') {
        return null
      }
      // その他のエラーもnullを返して続行（公開ページに影響させない）
      return null
    }

    return data
  } catch (error) {
    // エラーでもnullを返して続行
    return null
  }
}

/**
 * 職人プロフィール作成
 */
export async function createCraftsmanProfile(
  userId: string,
  profileData: {
    display_name: string
    company_name?: string | null
    profession?: string | null
    experience_years?: number | null
    bio?: string | null
    phone?: string | null
    location_area?: string | null
  }
) {
  try {
    const { data, error } = await supabase
      .from('craftsmen_profiles')
      .insert({
        user_id: userId,
        ...profileData,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    throw error
  }
}

/**
 * 職人プロフィール更新
 */
export async function updateCraftsmanProfile(
  userId: string,
  updates: Partial<CraftsmanProfile>
) {
  try {
    const { data, error } = await supabase
      .from('craftsmen_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    throw error
  }
}

/**
 * パスワードリセットメール送信
 */
export async function sendPasswordResetEmail(email: string) {
  try {
    // サイトURLを取得（サーバーサイド対応）
    const siteUrl = typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL || 'https://iwasaki-naisou.com')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/craftsman/reset-password`,
    })
    if (error) throw error
  } catch (error) {
    throw error
  }
}

/**
 * パスワード更新
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
  } catch (error) {
    throw error
  }
}
