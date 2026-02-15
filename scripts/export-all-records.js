/**
 * 全31件のwork_recordsをportfolio.ts形式にエクスポート
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ibmybaxrcgasoxhwrcwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXliYXhyY2dhc294aHdyY3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzUzMzYsImV4cCI6MjA3NTkxMTMzNn0.uZgt9_LoQZybpSbWhZCRpuR06pbYnNHJrz8V7uaOecU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportAllRecords() {
  console.log('📥 全work_recordsデータを取得中...\n');

  const { data, error } = await supabase
    .from('work_records')
    .select('*')
    .eq('user_id', 'fa08c261-d909-47c1-880a-17d91629fb54')
    .order('work_date', { ascending: false });

  if (error) {
    console.error('❌ エラー:', error.message);
    return;
  }

  console.log(`✅ ${data.length}件のデータを取得しました\n`);

  // TypeScript形式に変換
  const portfolioData = data.map((record, index) => {
    // エリア判定
    let area = 'その他';
    const location = record.location_name || '';
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

    // 工事内容を抽出
    let workType = '内装工事';
    const siteName = record.site_name || '';
    if (siteName.includes('クロス')) workType = 'クロス貼替工事';
    else if (siteName.includes('床') || siteName.includes('T/C') || siteName.includes('タイルカーペット')) workType = '床貼替工事';
    else if (siteName.includes('ブラインド')) workType = 'ブラインド納入';
    else if (siteName.includes('トイレ') || siteName.includes('WC')) workType = 'トイレ改修工事';
    else if (siteName.includes('ダイノック')) workType = 'ダイノック貼り工事';

    // 説明文を生成
    const description = `${location}での${workType}。${siteName}の施工を担当しました。`;

    return {
      id: index + 1,
      title: record.site_name,
      category: area.includes('千葉') || area.includes('神奈川') ? '店舗・オフィス' : '住宅・マンション',
      location: location,
      area: area,
      completion_date: record.work_date,
      work_type: workType,
      description: description,
      image_url: record.after_photo_url || record.before_photo_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      tags: [],
      is_featured: false,
      is_published: true,
    };
  });

  // TypeScriptファイルとして出力
  const output = `// 実際の施工実績データ（work_recordsから自動生成）
// 生成日時: ${new Date().toISOString()}

export type PortfolioProject = {
  id: number
  title: string
  category: string
  location: string
  area: string
  completion_date: string
  work_type: string
  description: string
  image_url: string
  tags: string[]
  is_featured: boolean
  is_published: boolean
}

export const portfolioData: PortfolioProject[] = ${JSON.stringify(portfolioData, null, 2)}
`;

  fs.writeFileSync('src/data/portfolio-real.ts', output, 'utf-8');
  console.log('✅ src/data/portfolio-real.ts に出力しました\n');

  console.log('📋 最初の3件:');
  portfolioData.slice(0, 3).forEach(p => {
    console.log(`  - ${p.title} (${p.area}, ${p.completion_date})`);
  });
}

exportAllRecords();
