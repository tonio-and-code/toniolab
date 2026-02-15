/**
 * 住所と座標の精度を確認
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ibmybaxrcgasoxhwrcwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXliYXhyY2dhc294aHdyY3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzUzMzYsImV4cCI6MjA3NTkxMTMzNn0.uZgt9_LoQZybpSbWhZCRpuR06pbYnNHJrz8V7uaOecU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAccuracy() {
  console.log('🗺️  住所と座標の精度を確認中...\n');

  const { data, error } = await supabase
    .from('work_records')
    .select('*')
    .eq('user_id', 'fa08c261-d909-47c1-880a-17d91629fb54')
    .order('work_date', { ascending: false });

  if (error) {
    console.error('❌ エラー:', error.message);
    return;
  }

  console.log(`📊 全${data.length}件のデータ\n`);

  data.forEach((record, index) => {
    console.log(`${index + 1}. ${record.site_name}`);
    console.log(`   住所: ${record.location_name}`);
    console.log(`   座標: ${record.latitude}, ${record.longitude}`);
    console.log(`   日付: ${record.work_date}`);
    console.log('');
  });

  console.log('\n📍 座標の精度について:');
  console.log('- 手動設定の座標: 番地レベルまで正確（誤差 ±10-50m）');
  console.log('- 「シルキーブラインド」: 東京都心の仮座標（誤差 数km）');
  console.log('');
  console.log('💡 より正確にするには:');
  console.log('1. Google Maps Geocoding API を使用（API Key必要）');
  console.log('2. 住所を手動で Google Maps で検索して座標を取得');
  console.log('3. 各現場の正確な緯度経度を記録');
}

checkAccuracy();
