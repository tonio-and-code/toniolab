/**
 * プロジェクト関連のSupabase APIクエリ
 */

import { createClient } from '@/lib/supabase/client'
import type { Project, ProjectWithCustomer } from '@/types/database'

const supabase = createClient()

// ===========================
// プロジェクト取得
// ===========================

/**
 * 全プロジェクトを取得（取引先情報付き）
 */
export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      receivable_customer:customers!receivable_customer_id (
        customer_name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data as ProjectWithCustomer[]
}

/**
 * プロジェクトをIDで取得
 */
export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      receivable_customer:customers!receivable_customer_id (
        customer_name,
        address,
        phone,
        email
      ),
      project_payables (
        id,
        payable_amount,
        payment_scheduled_date,
        payable_customer:customers!payable_customer_id (
          customer_name
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * ステータスでフィルタリングしてプロジェクトを取得
 */
export async function getProjectsByStatus(status: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      receivable_customer:customers!receivable_customer_id (
        customer_name
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data as ProjectWithCustomer[]
}

/**
 * 期間でフィルタリングしてプロジェクトを取得
 */
export async function getProjectsByDateRange(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      receivable_customer:customers!receivable_customer_id (
        customer_name
      )
    `)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .order('transaction_date', { ascending: false })

  if (error) {
    throw error
  }

  return data as ProjectWithCustomer[]
}

// ===========================
// プロジェクト作成・更新・削除
// ===========================

/**
 * 新規プロジェクトを作成
 */
export async function createProject(project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Project
}

/**
 * プロジェクトを更新
 */
export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Project
}

/**
 * プロジェクトを削除
 */
export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

// ===========================
// プロジェクト買掛（project_payables）
// ===========================

/**
 * プロジェクトの買掛を取得
 */
export async function getProjectPayables(projectId: string) {
  const { data, error } = await supabase
    .from('project_payables')
    .select(`
      *,
      payable_customer:customers!payable_customer_id (
        customer_name,
        phone,
        email
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

/**
 * プロジェクト買掛を作成
 */
export async function createProjectPayable(payable: {
  project_id: string
  payable_customer_id?: string
  payable_amount?: number
  payment_scheduled_date?: string
}) {
  const { data, error } = await supabase
    .from('project_payables')
    .insert(payable)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * プロジェクト買掛を更新
 */
export async function updateProjectPayable(id: string, updates: Partial<{
  payable_customer_id: string | null
  payable_amount: number | null
  payment_scheduled_date: string | null
}>) {
  const { data, error } = await supabase
    .from('project_payables')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * プロジェクト買掛を削除
 */
export async function deleteProjectPayable(id: string) {
  const { error } = await supabase
    .from('project_payables')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}