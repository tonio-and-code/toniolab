/**
 * マップ設定
 * Leaflet/OpenStreetMap を使用
 */

export const mapConfig = {
  // Leaflet/OSM設定
  leaflet: {
    enabled: true,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    defaultCenter: { lat: 35.6812, lng: 139.7671 }, // 東京駅
    defaultZoom: 13,
  }
}
