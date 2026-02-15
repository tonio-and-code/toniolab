/**
 * あいおいニッセイ同和損保ビル 工事記録追加スクリプト
 * Finance Supabase の website_projects テーブルに追加
 */

const { createClient } = require('@supabase/supabase-js');

// Finance Supabase設定
const supabaseUrl = 'https://rpxrmxxbmkpyrszfkijx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweHJteHhibWtweXJzemZraWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTY2NDEsImV4cCI6MjA3MTA5MjY0MX0.sYTP6pNDkrVm_9fI2vQmUdlR28Q6WyTyuDzeNQregIQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAioiRecord() {
  console.log('🔧 あいおいニッセイ同和損保ビル 工事記録を追加中...\n');

  // データ追加
  const { data, error } = await supabase
    .from('website_projects')
    .insert([
      {
        title: 'あいおいニッセイ同和損保ビル 共用通路床T/C貼替工事',
        category: '店舗・オフィス',
        location: '東京都千代田区二番町5-6',
        completion_date: '2025-07-26',
        description: '共用通路床タイルカーペット貼替工事。既存床材の撤去から下地調整、新規T/C施工まで一貫対応。',
        image_url: null, // 写真なし
      }
    ])
    .select();

  if (error) {
    console.error('❌ エラー:', error.message);
    return;
  }

  console.log('✅ 追加成功！\n');
  console.log('📋 追加されたデータ:');
  console.log(JSON.stringify(data, null, 2));

  // 確認：最新レコードを取得
  const { data: checkData, error: checkError } = await supabase
    .from('website_projects')
    .select('*')
    .ilike('title', '%あいおいニッセイ%')
    .order('id', { ascending: false })
    .limit(1);

  if (checkError) {
    console.error('❌ 確認エラー:', checkError.message);
    return;
  }

  console.log('\n🔍 確認結果:');
  console.log(JSON.stringify(checkData, null, 2));
}

addAioiRecord();
