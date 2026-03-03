import { createClient } from './supabase/client'

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
  const supabase = createClient()
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { display_name: data.displayName },
    },
  })

  if (authError) {
    throw new Error(authError.message)
  }

  if (!authData.user) {
    throw new Error('Registration failed')
  }

  return { user: authData.user, session: authData.session }
}

/**
 * サインイン（ログイン）
 */
export async function signIn(data: SignInData) {
  const supabase = createClient()
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) throw error
  return { user: authData.user, session: authData.session }
}

/**
 * サインアウト（ログアウト）
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * 現在のユーザー取得
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient()
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
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch {
    return null
  }
}

