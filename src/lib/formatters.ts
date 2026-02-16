/**
 * フォーマッター関数集
 * 日付、数値、通貨などの共通フォーマット処理
 */

import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'

// ===========================
// 日付フォーマット
// ===========================

/**
 * 日付を 'yyyy-MM-dd' 形式にフォーマット
 * @param date - Date オブジェクトまたは日付文字列
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date | string): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}

/**
 * 日付を 'yyyy年MM月dd日' 形式にフォーマット
 */
export function formatDateJa(date: Date | string): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy年MM月dd日', { locale: ja })
}

/**
 * 日付を 'yyyy/MM/dd' 形式にフォーマット
 */
export function formatDateSlash(date: Date | string): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy/MM/dd')
}

/**
 * 月を 'yyyy年MM月' 形式にフォーマット
 */
export function formatMonth(date: Date | string): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy年MM月', { locale: ja })
}

// ===========================
// 数値・通貨フォーマット
// ===========================

/**
 * 数値をカンマ区切りにフォーマット
 * @param value - 数値または数値文字列
 * @returns カンマ区切りの文字列
 */
export function formatNumber(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  if (isNaN(numValue)) return ''
  return numValue.toLocaleString('ja-JP')
}

/**
 * 通貨フォーマット（¥記号付き）
 */
export function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  if (isNaN(numValue)) return ''
  return `¥${numValue.toLocaleString('ja-JP')}`
}

/**
 * 通貨フォーマット（¥記号なし）- 既存のcurrency-formatterと互換
 */
export function formatCurrencyPlain(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  if (isNaN(numValue)) return ''
  return numValue.toLocaleString('ja-JP')
}

/**
 * カンマ区切り文字列を数値に変換
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[¥,]/g, '')) || 0
}

/**
 * 日本円の単位付きフォーマット（億/万/千）
 * チャートのY軸ラベル用
 */
export function formatCurrencyShort(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}億`
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}千`
  return value.toString()
}

// ===========================
// パーセントフォーマット
// ===========================

/**
 * 小数を%表示にフォーマット
 * @param value - 0-1 の小数値
 * @param decimals - 小数点以下桁数（デフォルト1）
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%'
  return `${(value * 100).toFixed(decimals)}%`
}

// ===========================
// 電話番号フォーマット
// ===========================

/**
 * 電話番号をハイフン区切りにフォーマット
 * @param phone - 電話番号文字列
 */
export function formatPhone(phone: string): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')

  // 携帯電話（090/080/070）
  if (cleaned.match(/^(090|080|070)/)) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  // 固定電話（市外局番3桁）
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  // 固定電話（市外局番4桁）
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phone
}

// ===========================
// 郵便番号フォーマット
// ===========================

/**
 * 郵便番号をハイフン区切りにフォーマット
 * @param postal - 郵便番号文字列
 */
export function formatPostalCode(postal: string): string {
  if (!postal) return ''
  const cleaned = postal.replace(/\D/g, '')
  if (cleaned.length === 7) {
    return cleaned.replace(/(\d{3})(\d{4})/, '$1-$2')
  }
  return postal
}