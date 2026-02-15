/**
 * work_records テーブルのデータを確認
 */

const { createClient } = require('@supabase/supabase-js');

// CRAFTSMAN Supabase設定
const supabaseUrl = 'https://ibmybaxrcgasoxhwrcwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXliYXhyY2dhc294aHdyY3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzUzMzYsImV4cCI6MjA3NTkxMTMzNn0.uZgt9_LoQZybpSbWhZCRpuR06pbYnNHJrz8V7uaOecU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWorkRecords() {
  console.log('🔍 work_records テーブルのデータを確認中...\n');

  const { data, error } = await supabase
    .from('work_records')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ エラー:', error.message);
    return;
  }

  console.log('📋 最新5件のデータ:');
  console.log(JSON.stringify(data, null, 2));

  console.log('\n📊 データ件数:', data.length);

  // あいおいニッセイのデータを確認
  const aioi = data.find(d => d.site_name?.includes('あいおいニッセイ'));
  if (aioi) {
    console.log('\n✅ あいおいニッセイのデータが見つかりました:');
    console.log(JSON.stringify(aioi, null, 2));
  } else {
    console.log('\n⚠️  あいおいニッセイのデータが見つかりません');
  }
}

checkWorkRecords();
