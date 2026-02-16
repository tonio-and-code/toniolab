'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leafletのデフォルトアイコン修正（Next.jsで必要）
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

type MapMarker = {
  id: string
  position: { lat: number; lng: number }
  title: string
  description?: string
  onClick?: () => void
}

type LeafletMapProps = {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  className?: string
}

export default function LeafletMap({
  center = { lat: 35.6812, lng: 139.7671 },
  zoom = 13,
  markers = [],
  className = 'w-full h-full'
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // マップ初期化
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom)

      // OpenStreetMapタイル追加
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
    }

    // マーカー追加
    const leafletMarkers: L.Marker[] = []
    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.position.lat, marker.position.lng])
        .addTo(mapInstanceRef.current!)

      // ポップアップ追加
      if (marker.title || marker.description) {
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${marker.title}</h3>
            ${marker.description ? `<p style="font-size: 12px; color: #666;">${marker.description}</p>` : ''}
          </div>
        `
        leafletMarker.bindPopup(popupContent)
      }

      // クリックイベント
      if (marker.onClick) {
        leafletMarker.on('click', marker.onClick)
      }

      leafletMarkers.push(leafletMarker)
    })

    // クリーンアップ
    return () => {
      leafletMarkers.forEach(m => m.remove())
    }
  }, [center.lat, center.lng, zoom, markers])

  // コンポーネントアンマウント時の完全なクリーンアップ
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return <div ref={mapRef} className={className} />
}
