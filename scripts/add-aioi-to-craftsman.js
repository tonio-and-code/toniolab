/**
 * あいおいニッセイ同和損保ビル 工事記録追加スクリプト
 * CRAFTSMAN Supabase の work_records テーブルに追加
 * engineworks.iwasaki@gmail.com 用
 */

const { createClient } = require('@supabase/supabase-js');

// CRAFTSMAN Supabase設定
const supabaseUrl = 'https://ibmybaxrcgasoxhwrcwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXliYXhyY2dhc294aHdyY3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzUzMzYsImV4cCI6MjA3NTkxMTMzNn0.uZgt9_LoQZybpSbWhZCRpuR06pbYnNHJrz8V7uaOecU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAioiToWorkRecords() {
  console.log('🔧 あいおいニッセイ同和損保ビル 工事記録を追加中...\n');

  // まず、engineworks.iwasaki@gmail.com のユーザーIDを取得
  const userEmail = 'engineworks.iwasaki@gmail.com';

  // user_id を指定（スクリーンショットから fa08c261-d909-47c1-880a-7f49f6... のようなUUID）
  // 実際のユーザーIDを確認する必要があります

  console.log('⚠️  user_id を確認する必要があります。');
  console.log('スクリーンショットから user_id をコピーしてください：');
  console.log('fa08c261-d909-47c1-880a-7f49f6...\n');

  // スクリーンショットに表示されているカラムのみ使用
  const workRecord = {
    user_id: 'fa08c261-d909-47c1-880a-7f49f6dd9558', // スクリーンショットから推測
    site_name: 'あいおいニッセイ同和損保ビル',
    work_date: '2025-07-26',
    location_name: '東京都千代田区二番町5-6',
    latitude: 35.6646912, // 千代田区二番町付近の座標
    longitude: 139.7360896,
  };

  console.log('📋 追加するデータ:');
  console.log(JSON.stringify(workRecord, null, 2));
  console.log('\n');

  const { data, error } = await supabase
    .from('work_records')
    .insert([workRecord])
    .select();

  if (error) {
    console.error('❌ エラー:', error.message);
    console.error('詳細:', error);
    return;
  }

  console.log('✅ 追加成功！\n');
  console.log('📋 追加されたデータ:');
  console.log(JSON.stringify(data, null, 2));

  // 確認：最新レコードを取得
  const { data: checkData, error: checkError } = await supabase
    .from('work_records')
    .select('*')
    .eq('site_name', 'あいおいニッセイ同和損保ビル')
    .order('created_at', { ascending: false })
    .limit(1);

  if (checkError) {
    console.error('❌ 確認エラー:', checkError.message);
    return;
  }

  console.log('\n🔍 確認結果:');
  console.log(JSON.stringify(checkData, null, 2));
}

addAioiToWorkRecords();
