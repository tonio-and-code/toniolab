#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const financeUrl = process.env.NEXT_PUBLIC_FINANCE_SUPABASE_URL
const financeKey = process.env.NEXT_PUBLIC_FINANCE_SUPABASE_ANON_KEY

const supabase = createClient(financeUrl, financeKey)

async function checkStructure() {
  console.log('🔍 テーブル構造確認中...\n')

  try {
    // 最新のレコードを1件取得してカラムを確認
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('❌ エラー:', error)
      return
    }

    if (data && data.length > 0) {
      console.log('✅ 最新レコード取得成功\n')
      console.log('📊 カラム一覧:')
      const columns = Object.keys(data[0])
      columns.forEach(col => {
        console.log(`  - ${col}`)
      })

      console.log('\n🔍 Ver.4.0カラムチェック:')
      const v4Columns = ['flow_type', 'initial_concern', 'completed_at']
      v4Columns.forEach(col => {
        const exists = columns.includes(col)
        console.log(`  ${exists ? '✅' : '❌'} ${col}`)
      })

      console.log('\n📝 最新レコードの内容:')
      console.log(JSON.stringify(data[0], null, 2))
    }

    // テスト挿入を試みる
    console.log('\n\n🧪 テスト挿入実行...')
    const testData = {
      answers: {
        version: '4.0',
        initial_concern: 'test',
        core_questions: { '1': 'A', '2': 'B', '3': 'A' }
      },
      result_type: 'ai_takumi_v4',
      result_content: 'テスト診断結果',
      session_id: 'test_' + Date.now(),
      user_agent: 'Test Script',
      flow_type: 'full_diagnostic',
      initial_concern: 'test',
      completed_at: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from('diagnostic_results')
      .insert(testData)
      .select()
      .single()

    if (insertError) {
      console.error('❌ テスト挿入失敗:', insertError)

      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n⚠️  Ver.4.0のカラムが存在しません')
        console.log('📌 次のステップ:')
        console.log('1. Supabase Studio (https://supabase.com/dashboard) にアクセス')
        console.log('2. FINANCEプロジェクト (rpxrmxxb...) を選択')
        console.log('3. SQL Editorを開く')
        console.log('4. supabase-diagnostic-v4-migration.sql の内容を実行')
      }
    } else {
      console.log('✅ テスト挿入成功！')
      console.log('📝 挿入されたデータ:')
      console.log(JSON.stringify(insertData, null, 2))

      // テストデータを削除
      await supabase
        .from('diagnostic_results')
        .delete()
        .eq('id', insertData.id)
      console.log('\n🗑️  テストデータを削除しました')
    }

  } catch (err) {
    console.error('❌ エラー:', err)
  }
}

checkStructure()
