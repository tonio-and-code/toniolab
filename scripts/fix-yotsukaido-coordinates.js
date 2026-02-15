/**
 * 四街道市大日1973-15の正確な座標を確認
 */

console.log('🗺️  四街道市大日1973-15の座標を調査中...\n');

// 私が設定した座標
const myCoords = {
  lat: 35.6644,
  lng: 140.1678
};

// 四街道市の中心座標（参考）
const yotsukaido = {
  lat: 35.6667,
  lng: 140.1667
};

// 大日エリアの推定座標
const oohi = {
  lat: 35.6428,
  lng: 140.1817
};

console.log('📍 設定した座標:', myCoords);
console.log('📍 四街道市中心:', yotsukaido);
console.log('📍 大日エリア推定:', oohi);
console.log('');

console.log('⚠️  問題：');
console.log('四街道市は千葉県内陸部（千葉市の北）にあります。');
console.log('経度 140.1678 は正しいですが、緯度がずれている可能性があります。');
console.log('');

console.log('💡 解決方法：');
console.log('1. Google Maps で「千葉県四街道市大日1973-15」を検索');
console.log('2. 右クリック→「この場所について」で正確な座標を取得');
console.log('3. その座標でDBを更新');
console.log('');

console.log('🔧 更新SQLの例：');
console.log(`
UPDATE work_records
SET
  latitude = 35.6428,
  longitude = 140.1817,
  updated_at = NOW()
WHERE site_name LIKE '%みらいえ四街道%';
`);
