'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type WorkRecord = {
  id: string
  site_name: string
  work_date: string
  location_name?: string
  latitude?: number
  longitude?: number
  before_photo_url?: string | null  // NULLを許可
  after_photo_url?: string | null  // NULLを許可
  memo?: string
}

type WorkMapLeafletProps = {
  records: WorkRecord[]
  onMarkerClick: (record: WorkRecord) => void
}

export default function WorkMapLeaflet({ records, onMarkerClick }: WorkMapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  // マップ初期化
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // 東京都心を中心に
    const map = L.map(mapRef.current).setView([35.6895, 139.6917], 12)

    // OpenStreetMapタイル
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // マーカー更新
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // 既存マーカークリア
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    if (records.length === 0) return

    const map = mapInstanceRef.current
    const bounds = L.latLngBounds([])

    // 新しいマーカー作成
    records
      .filter(record => record.latitude && record.longitude)
      .forEach((record) => {
        const position: L.LatLngExpression = [record.latitude!, record.longitude!]

        // 表示用写真（after優先、なければbefore）
        const displayPhotoUrl = record.after_photo_url || record.before_photo_url

        // カスタム写真アイコン（写真なしの場合はピンアイコン）
        const photoIcon = displayPhotoUrl ? L.divIcon({
          className: 'custom-photo-marker',
          html: `
            <div style="
              width: 60px;
              height: 60px;
              border: 3px solid #10B981;
              border-radius: 50%;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              background: white;
              transition: all 0.3s;
            ">
              <img
                src="${displayPhotoUrl}"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                "
                alt="${record.site_name}"
              />
            </div>
          `,
          iconSize: [60, 60],
          iconAnchor: [30, 30],
        }) : L.divIcon({
          className: 'custom-pin-marker',
          html: `
            <div style="
              width: 40px;
              height: 40px;
              background: #10B981;
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s;
            ">
              <div style="
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        })

        const marker = L.marker(position, { icon: photoIcon })
          .addTo(map)

        // ホバー時のみ表示されるツールチップ（簡潔な情報）
        marker.bindTooltip(record.site_name, {
          permanent: false,  // ホバー時のみ表示
          direction: 'top',
          offset: [0, -25],
          className: 'hover-tooltip',
          opacity: 0.95
        })

        // 詳細ポップアップ - シンプル＆見やすく + 編集ボタン
        const popupContent = `
          <div style="padding: 0; margin: 0;">
            <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 15px; color: #111;">${record.site_name}</h3>
            <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">${record.work_date}</p>
            ${record.memo ? `<p style="font-size: 13px; color: #555; line-height: 1.5; margin: 0 0 12px 0;">${record.memo}</p>` : ''}
            ${record.before_photo_url || record.after_photo_url ? `
            <div style="display: grid; grid-template-columns: ${record.after_photo_url && record.before_photo_url ? '1fr 1fr' : '1fr'}; gap: 8px; margin: 0 0 12px 0;">
              ${record.before_photo_url ? `
                <img src="${record.before_photo_url}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; display: block;" alt="施工前" />
              ` : ''}
              ${record.after_photo_url ? `
                <img src="${record.after_photo_url}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; display: block;" alt="施工後" />
              ` : ''}
            </div>
            ` : ''}
            <a href="/record-work/edit/${record.id}" style="display: block; text-align: center; background: #10B981; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#0ea572'" onmouseout="this.style.background='#10B981'">
              編集する
            </a>
          </div>
        `
        marker.bindPopup(popupContent, {
          maxWidth: 280,
          minWidth: 260,
          autoPan: true,
          autoPanPadding: [20, 20],
          keepInView: true,
          className: 'work-map-popup',
          closeButton: true
        })

        // クリックでポップアップ表示 + ズーム
        marker.on('click', () => {
          map.setView(position, 15, { animate: true })
          // onMarkerClickは削除（サイドパネル連携不要）
        })

        // ホバーエフェクト
        marker.on('mouseover', (e) => {
          const markerElement = e.target.getElement()
          if (markerElement) {
            const div = markerElement.querySelector('div')
            if (div) {
              div.style.transform = 'scale(1.2)'
              div.style.borderColor = '#D4AF37'
              div.style.zIndex = '1000'
            }
          }
        })

        marker.on('mouseout', (e) => {
          const markerElement = e.target.getElement()
          if (markerElement) {
            const div = markerElement.querySelector('div')
            if (div) {
              div.style.transform = 'scale(1)'
              div.style.borderColor = '#10B981'
              div.style.zIndex = '1'
            }
          }
        })

        markersRef.current.push(marker)
        bounds.extend(position)
      })

    // 全マーカーが見えるように調整
    if (markersRef.current.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
    }
  }, [records, onMarkerClick])

  return <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
}
