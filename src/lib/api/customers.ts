/**
 * 取引先（顧客）関連のSupabase APIクエリ
 */

import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/types/database'

const supabase = createClient()

// ===========================
// 取引先取得
// ===========================

/**
 * 全取引先を取得
 */
export async function getAllCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('customer_name', { ascending: true })

  if (error) {
    throw error
  }

  return data as Customer[]
}

/**
 * 取引先をIDで取得
 */
export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data as Customer
}

/**
 * 取引先を名前で検索
 */
export async function searchCustomersByName(searchTerm: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .ilike('customer_name', `%${searchTerm}%`)
    .order('customer_name', { ascending: true })

  if (error) {
    throw error
  }

  return data as Customer[]
}

// ===========================
// 取引先作成・更新・削除
// ===========================

/**
 * 新規取引先を作成
 */
export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Customer
}

/**
 * 取引先を更新
 */
export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
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

  return data as Customer
}

/**
 * 取引先を削除
 */
export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

// ===========================
// 統計情報
// ===========================

/**
 * 取引先の案件数を取得
 */
export async function getCustomerProjectCount(customerId: string) {
  const { count, error } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('receivable_customer_id', customerId)

  if (error) {
    throw error
  }

  return count || 0
}