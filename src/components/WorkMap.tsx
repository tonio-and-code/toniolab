'use client'

import { useEffect, useRef, useState } from 'react'

type WorkRecord = {
  id: string
  site_name: string
  work_date: string
  location_name?: string
  latitude?: number
  longitude?: number
  before_photo_url: string
  after_photo_url: string
  memo?: string
}

type WorkMapProps = {
  records: WorkRecord[]
  onMarkerClick: (record: WorkRecord) => void
}

export default function WorkMap({ records, onMarkerClick }: WorkMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  // Google Maps初期化
  useEffect(() => {
    if (!mapRef.current || map) return

    const initMap = () => {
      if (!window.google) {
        setTimeout(initMap, 100)
        return
      }

      // 東京都心を中心に
      const center = { lat: 35.6895, lng: 139.6917 }

      const newMap = new google.maps.Map(mapRef.current!, {
        zoom: 12,
        center,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      })

      setMap(newMap)
    }

    initMap()
  }, [map])

  // マーカー更新（写真アイコン）
  useEffect(() => {
    if (!map) return

    // 既存マーカークリア
    markers.forEach(marker => marker.setMap(null))

    if (records.length === 0) {
      setMarkers([])
      return
    }

    // 新しいマーカー作成
    const newMarkers = records
      .filter(record => record.latitude && record.longitude)
      .map((record) => {
        const position = { lat: record.latitude!, lng: record.longitude! }

        // カスタム写真マーカーHTML作成
        const markerDiv = document.createElement('div')
        markerDiv.style.cssText = `
          width: 60px;
          height: 60px;
          border: 3px solid #10B981;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.3s;
          background: white;
        `

        const img = document.createElement('img')
        img.src = record.after_photo_url
        img.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
        `
        markerDiv.appendChild(img)

        // ホバーエフェクト
        markerDiv.addEventListener('mouseenter', () => {
          markerDiv.style.transform = 'scale(1.2)'
          markerDiv.style.borderColor = '#D4AF37'
          markerDiv.style.zIndex = '1000'
        })
        markerDiv.addEventListener('mouseleave', () => {
          markerDiv.style.transform = 'scale(1)'
          markerDiv.style.borderColor = '#10B981'
          markerDiv.style.zIndex = '1'
        })

        // Advanced Marker (or fallback to regular marker)
        let marker: google.maps.Marker

        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          // Advanced Marker Element (新API)
          marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position,
            content: markerDiv,
            title: record.site_name,
          }) as any
        } else {
          // Fallback: 通常のMarker
          marker = new google.maps.Marker({
            position,
            map,
            title: record.site_name,
            icon: {
              url: record.after_photo_url,
              scaledSize: new google.maps.Size(60, 60),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(30, 30),
            },
            optimized: false,
          })
        }

        // クリックイベント
        marker.addListener('click', () => {
          onMarkerClick(record)
          map.panTo(position)
          map.setZoom(15)
        })

        return marker
      })

    setMarkers(newMarkers)

    // 全マーカーが見えるように調整
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      newMarkers.forEach(marker => {
        const position = marker.getPosition()
        if (position) bounds.extend(position)
      })
      map.fitBounds(bounds)

      // ズームしすぎ防止
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 16) map.setZoom(16)
        google.maps.event.removeListener(listener)
      })
    }

    // クリーンアップ: コンポーネントアンマウント時にマーカー削除
    return () => {
      newMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, records])

  return <div ref={mapRef} className="w-full h-full" />
}
