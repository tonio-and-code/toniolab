#!/usr/bin/env node

/**
 * AI診断テーブルマイグレーション実行スクリプト
 * FINANCE用Supabaseに診断テーブルを作成
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 環境変数読み込み
require('dotenv').config({ path: '.env.local' })

const financeUrl = process.env.NEXT_PUBLIC_FINANCE_SUPABASE_URL
const financeKey = process.env.NEXT_PUBLIC_FINANCE_SUPABASE_ANON_KEY

if (!financeUrl || !financeKey) {
  console.error('❌ FINANCE_SUPABASE環境変数が設定されていません')
  process.exit(1)
}

const supabase = createClient(financeUrl, financeKey)

async function runMigration() {
  console.log('🔄 AI診断テーブルマイグレーション開始...')
  console.log('📍 接続先:', financeUrl)

  try {
    // 1. 基本テーブル作成
    console.log('\n1️⃣ 基本テーブル作成中...')
    const baseTableSQL = fs.readFileSync(
      path.join(__dirname, '..', 'supabase-diagnostic-tables.sql'),
      'utf8'
    )

    // SQLを実行（注意: Supabase JSクライアントはDDLを直接実行できないため、エラーになる可能性あり）
    console.log('⚠️  注意: DDL（CREATE TABLE）はSupabase Studioで手動実行する必要があります')
    console.log('\n📋 実行すべきSQL:')
    console.log('=' .repeat(80))
    console.log(baseTableSQL)
    console.log('=' .repeat(80))

    // 2. Ver.4.0マイグレーション
    console.log('\n2️⃣ Ver.4.0マイグレーション（ALTER TABLE）...')
    const v4MigrationSQL = fs.readFileSync(
      path.join(__dirname, '..', 'supabase-diagnostic-v4-migration.sql'),
      'utf8'
    )

    console.log('\n📋 Ver.4.0 マイグレーションSQL:')
    console.log('=' .repeat(80))
    console.log(v4MigrationSQL)
    console.log('=' .repeat(80))

    // 3. テーブル存在確認
    console.log('\n3️⃣ テーブル存在確認...')
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('id')
      .limit(1)

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ テーブルが存在しません')
        console.log('\n📌 次のステップ:')
        console.log('1. Supabase Studio (https://supabase.com/dashboard) にログイン')
        console.log('2. FINANCEプロジェクト (rpxrmxxb...) を選択')
        console.log('3. SQL Editor を開く')
        console.log('4. 上記のSQLを順番に実行してください')
      } else {
        console.error('❌ エラー:', error)
      }
    } else {
      console.log('✅ テーブルは存在します')
      console.log('📊 レコード数確認中...')

      const { count } = await supabase
        .from('diagnostic_results')
        .select('*', { count: 'exact', head: true })

      console.log(`📈 現在のレコード数: ${count}件`)
    }

  } catch (err) {
    console.error('❌ マイグレーション実行エラー:', err)
    process.exit(1)
  }
}

runMigration()
