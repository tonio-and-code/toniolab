/**
 * あいおいニッセイ同和損保ビルを work_records に追加
 * 会社ウェブサイトのSupabaseに追加してLeafletマップに表示
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase環境変数が設定されていません')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function addAioiWorkRecord() {
  console.log('🚀 あいおいニッセイ同和損保ビルを work_records に追加します...\n')
  console.log(`📍 Supabase: ${supabaseUrl}\n`)

  // work_recordsテーブルにデータを追加
  const workRecordData = {
    site_name: 'あいおいニッセイ同和損保ビル',
    address: '東京都千代田区二番町5-6',
    work_date: '2025-07-26',
    memo: '共用通路床タイルカーペット貼替工事（約180㎡）。夜間作業で昼間業務に支障なく完工。既存床材の撤去から下地調整、新規T/C施工まで一貫対応。',
    latitude: 35.6937,
    longitude: 139.7433,
    photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop']
  }

  const { data: workRecord, error: workError } = await supabase
    .from('work_records')
    .insert(workRecordData)
    .select()
    .single()

  if (workError) {
    console.error('❌ work_recordsへの追加エラー:', workError)
    return
  }

  console.log('✅ work_recordsに追加成功!')
  console.log('ID:', workRecord.id)
  console.log('現場名:', workRecord.site_name)
  console.log('住所:', workRecord.address)
  console.log('座標:', `${workRecord.latitude}, ${workRecord.longitude}`)
  console.log('\n🎉 完了！http://localhost:3001 のLeafletマップを確認してください')
  console.log('   ※ページをリロードすると地図上に表示されます')
}

addAioiWorkRecord().catch(console.error)
