/**
 * 実際のwork_recordsデータを分析して正確な統計を取得
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ibmybaxrcgasoxhwrcwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXliYXhyY2dhc294aHdyY3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzUzMzYsImV4cCI6MjA3NTkxMTMzNn0.uZgt9_LoQZybpSbWhZCRpuR06pbYnNHJrz8V7uaOecU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeData() {
  console.log('📊 実データを分析中...\n');

  const { data, error } = await supabase
    .from('work_records')
    .select('*')
    .eq('user_id', 'fa08c261-d909-47c1-880a-17d91629fb54')
    .order('work_date', { ascending: false });

  if (error) {
    console.error('❌ エラー:', error.message);
    return;
  }

  console.log(`📋 総実績件数: ${data.length}件\n`);

  // エリア別集計
  const areaCounts = {};
  data.forEach(record => {
    const location = record.location_name || '不明';

    // 区を抽出
    let area = 'その他';
    if (location.includes('中央区')) area = '中央区';
    else if (location.includes('千代田区')) area = '千代田区';
    else if (location.includes('新宿区')) area = '新宿区';
    else if (location.includes('港区')) area = '港区';
    else if (location.includes('台東区')) area = '台東区';
    else if (location.includes('墨田区')) area = '墨田区';
    else if (location.includes('江東区')) area = '江東区';
    else if (location.includes('品川区')) area = '品川区';
    else if (location.includes('渋谷区')) area = '渋谷区';
    else if (location.includes('世田谷区')) area = '世田谷区';
    else if (location.includes('千葉県')) area = '千葉県';
    else if (location.includes('神奈川県')) area = '神奈川県';
    else if (location.includes('国立市')) area = '東京都その他';

    areaCounts[area] = (areaCounts[area] || 0) + 1;
  });

  console.log('📍 主な施工エリア:');
  const sortedAreas = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sortedAreas.forEach(([area, count]) => {
    console.log(`   ${area}: ${count}件`);
  });

  console.log('\n');

  // 最古と最新の日付
  const dates = data.map(r => new Date(r.work_date)).sort((a, b) => a - b);
  const oldestDate = dates[0];
  const newestDate = dates[dates.length - 1];

  console.log(`📅 最古の記録: ${oldestDate.toLocaleDateString('ja-JP')}`);
  console.log(`📅 最新の記録: ${newestDate.toLocaleDateString('ja-JP')}`);
  console.log('');

  console.log('💡 正しい文章案:');
  console.log('「2024年〜2025年の最近の施工実績をマップに表示しています。」');
  console.log('または');
  console.log('「イワサキ内装の最近の施工実績の一部を地図上でご覧いただけます。」');
}

analyzeData();
