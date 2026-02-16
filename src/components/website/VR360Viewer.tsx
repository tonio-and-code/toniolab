'use client'

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Move, Maximize2, Minimize2, RotateCw, ZoomIn, ZoomOut, Info, ChevronLeft, ChevronRight } from 'lucide-react'

interface VR360ViewerProps {
  title: string
  description?: string
  imageUrl?: string
  images?: string[]
}

export default function VR360Viewer({ title, description, imageUrl, images }: VR360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(75)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    sphere?: THREE.Mesh
    isDragging: boolean
    previousMousePosition: { x: number; y: number }
    animationId?: number
    textureLoader?: THREE.TextureLoader
  }>({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 }
  })

  // Initialize Three.js scene once
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(zoom, width / height, 0.1, 1000)
    camera.position.set(0, 0, 0.1)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Sphere geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    // Create textureLoader once
    const textureLoader = new THREE.TextureLoader()

    // Store references
    sceneRef.current.scene = scene
    sceneRef.current.camera = camera
    sceneRef.current.renderer = renderer
    sceneRef.current.textureLoader = textureLoader

    // Animation loop
    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      renderer.dispose()
      geometry.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, []) // Only run once on mount

  // Preload all images on mount
  useEffect(() => {
    if (images && images.length > 0) {
      images.forEach((url) => {
        const img = new Image()
        img.src = url
      })
    }
  }, [images])

  // Load texture when image changes
  useEffect(() => {
    const { scene, textureLoader } = sceneRef.current
    if (!scene || !textureLoader) return

    setIsLoading(true)

    // Remove old sphere if exists
    if (sceneRef.current.sphere) {
      scene.remove(sceneRef.current.sphere)
      if (sceneRef.current.sphere.geometry) {
        sceneRef.current.sphere.geometry.dispose()
      }
      if (sceneRef.current.sphere.material) {
        const material = sceneRef.current.sphere.material as THREE.MeshBasicMaterial
        if (material.map) material.map.dispose()
        material.dispose()
      }
    }

    // Determine which image to load
    let panoramaUrl = imageUrl
    if (images && images.length > 0) {
      panoramaUrl = images[currentImageIndex]
    }

    // Use default if no image provided
    if (!panoramaUrl) {
      panoramaUrl = createDefaultPanorama()
    }

    // Create new geometry for sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    // Load texture with onProgress callback
    textureLoader.load(
      panoramaUrl,
      (texture) => {
        texture.minFilter = THREE.LinearFilter
        const material = new THREE.MeshBasicMaterial({ map: texture })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)
        sceneRef.current.sphere = sphere
        setIsLoading(false)
      },
      (progress) => {
        // Progress callback - すぐに非表示にする
        if (progress.loaded > 0) {
          setIsLoading(false)
        }
      },
      () => {
        const material = new THREE.MeshBasicMaterial({ color: 0x82EDA6 })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)
        sceneRef.current.sphere = sphere
        setIsLoading(false)
      }
    )
  }, [imageUrl, images, currentImageIndex])

  // Update camera FOV when zoom changes
  useEffect(() => {
    if (sceneRef.current.camera) {
      sceneRef.current.camera.fov = zoom
      sceneRef.current.camera.updateProjectionMatrix()
    }
  }, [zoom])

  // Mouse/Touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    sceneRef.current.isDragging = true
    sceneRef.current.previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sceneRef.current.isDragging || !sceneRef.current.camera) return

    const deltaMove = {
      x: e.clientX - sceneRef.current.previousMousePosition.x,
      y: e.clientY - sceneRef.current.previousMousePosition.y
    }

    const rotationSpeed = 0.005

    sceneRef.current.camera.rotation.y += deltaMove.x * rotationSpeed
    sceneRef.current.camera.rotation.x += deltaMove.y * rotationSpeed

    sceneRef.current.camera.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, sceneRef.current.camera.rotation.x)
    )

    sceneRef.current.previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    sceneRef.current.isDragging = false
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      sceneRef.current.isDragging = true
      sceneRef.current.previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sceneRef.current.isDragging || !sceneRef.current.camera || e.touches.length !== 1) return

    const deltaMove = {
      x: e.touches[0].clientX - sceneRef.current.previousMousePosition.x,
      y: e.touches[0].clientY - sceneRef.current.previousMousePosition.y
    }

    const rotationSpeed = 0.005

    sceneRef.current.camera.rotation.y += deltaMove.x * rotationSpeed
    sceneRef.current.camera.rotation.x += deltaMove.y * rotationSpeed

    sceneRef.current.camera.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, sceneRef.current.camera.rotation.x)
    )

    sceneRef.current.previousMousePosition = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const handleTouchEnd = () => {
    sceneRef.current.isDragging = false
  }

  const resetView = () => {
    if (sceneRef.current.camera) {
      sceneRef.current.camera.rotation.set(0, 0, 0)
      setZoom(75)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const zoomIn = () => {
    setZoom(prev => Math.max(30, prev - 10))
  }

  const zoomOut = () => {
    setZoom(prev => Math.min(100, prev + 10))
  }

  const previousImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
    }
  }

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-[#252423]' : ''}`}>
      <div className="relative bg-[#252423] overflow-hidden">

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#252423]/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#FFFFFF] font-bold">読み込み中...</p>
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
          <div className="bg-[#252423]/70 backdrop-blur-md px-4 py-2 text-[#FFFFFF] text-sm font-semibold flex items-center gap-2 border border-gray-600">
            <Move className="w-4 h-4 text-[#D4AF37]" />
            ドラッグで視点移動
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-10 h-10 bg-[#252423]/70 hover:bg-[#252423]/90 backdrop-blur-md flex items-center justify-center transition-all border border-gray-600"
              title="情報表示切替"
            >
              <Info className={`w-5 h-5 ${showInfo ? 'text-[#D4AF37]' : 'text-[#FFFFFF]'}`} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-[#252423]/70 hover:bg-[#252423]/90 backdrop-blur-md flex items-center justify-center transition-all border border-gray-600"
              title={isFullscreen ? '通常表示' : '全画面表示'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-[#FFFFFF]" />
              ) : (
                <Maximize2 className="w-5 h-5 text-[#FFFFFF]" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images && images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="w-10 h-10 bg-[#252423]/70 hover:bg-[#10B981] backdrop-blur-md flex items-center justify-center transition-all border border-gray-600"
                title="前の画像"
              >
                <ChevronLeft className="w-5 h-5 text-[#FFFFFF]" />
              </button>
              <div className="bg-[#252423]/70 backdrop-blur-md px-4 py-2 text-[#FFFFFF] text-sm font-semibold flex items-center gap-2 border border-gray-600">
                {currentImageIndex + 1} / {images.length}
              </div>
              <button
                onClick={nextImage}
                className="w-10 h-10 bg-[#252423]/70 hover:bg-[#10B981] backdrop-blur-md flex items-center justify-center transition-all border border-gray-600"
                title="次の画像"
              >
                <ChevronRight className="w-5 h-5 text-[#FFFFFF]" />
              </button>
            </>
          )}
          <button
            onClick={zoomIn}
            className="w-10 h-10 bg-[#252423]/70 hover:bg-[#10B981] backdrop-blur-md flex items-center justify-center transition-all border border-gray-600"
            title="ズームイン"
          >
            <ZoomIn className="w-5 h-5 text-[#FFFFFF]" />
          </button>
          <button
            onClick={resetView}
            className="w-10 h-10 bg-[#252423]/70 hover:bg-[#10B981] backdrop-blur-md flex items-center justify-center transition-all border border-gray-600"
            title="視点リセット"
          >
            <RotateCw className="w-5 h-5 text-[#FFFFFF]" />
          </button>
          <button
            onClick={zoomOut}
            className="w-10 h-10 bg-[#252423]/70 hover:bg-[#10B981] backdrop-blur-md flex items-center justify-center transition-all border border-gray-600"
            title="ズームアウト"
          >
            <ZoomOut className="w-5 h-5 text-[#FFFFFF]" />
          </button>
        </div>

        {/* 3D Canvas Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`cursor-move select-none ${isFullscreen ? 'h-screen' : 'h-96 md:h-[500px] lg:h-[600px]'}`}
          style={{ touchAction: 'none' }}
        />

        {/* Info Panel */}
        {showInfo && description && (
          <div className="absolute bottom-16 left-4 right-4 bg-[#252423]/80 backdrop-blur-md p-4 border border-gray-600">
            <p className="text-[#FFFFFF] text-sm leading-relaxed">{description}</p>
          </div>
        )}

        {/* Title Badge */}
        <div className="absolute top-16 left-4 bg-[#10B981] px-4 py-2 shadow-lg border border-[#D4AF37]">
          <p className="text-[#FFFFFF] font-bold text-sm">{title}</p>
        </div>
      </div>
    </div>
  )
}

// Fallback: Create default panorama
function createDefaultPanorama(): string {
  const canvas = document.createElement('canvas')
  canvas.width = 4096
  canvas.height = 2048
  const ctx = canvas.getContext('2d')

  if (!ctx) return ''

  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 1024)
  skyGradient.addColorStop(0, '#87CEEB')
  skyGradient.addColorStop(0.7, '#B0E0E6')
  skyGradient.addColorStop(1, '#D3D3D3')
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, 4096, 1024)

  // Floor gradient
  const floorGradient = ctx.createLinearGradient(0, 1024, 0, 2048)
  floorGradient.addColorStop(0, '#C8C8C8')
  floorGradient.addColorStop(1, '#A0A0A0')
  ctx.fillStyle = floorGradient
  ctx.fillRect(0, 1024, 4096, 1024)

  // Grid pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 2
  for (let x = 0; x < 4096; x += 200) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 2048)
    ctx.stroke()
  }
  for (let y = 0; y < 2048; y += 200) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(4096, y)
    ctx.stroke()
  }

  // Draw walls and windows
  const drawWall = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = '#A0A0A0'
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, width, height)
  }

  const drawWindow = (x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = 'rgba(173, 216, 230, 0.6)'
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = '#505050'
    ctx.lineWidth = 8
    ctx.strokeRect(x, y, width, height)
    ctx.beginPath()
    ctx.moveTo(x + width/2, y)
    ctx.lineTo(x + width/2, y + height)
    ctx.moveTo(x, y + height/2)
    ctx.lineTo(x + width, y + height/2)
    ctx.stroke()
  }

  drawWall(512, 600, 400, 600, '#E8D4A0')
  drawWall(1500, 600, 500, 600, '#D4C4A0')
  drawWall(2800, 600, 400, 600, '#E0D0A8')

  drawWindow(700, 700, 250, 350)
  drawWindow(1700, 700, 300, 400)
  drawWindow(3000, 700, 250, 350)

  // Header banner
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(1200, 80, 1600, 180)

  ctx.fillStyle = '#82EDA6'
  ctx.font = 'bold 90px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('イワサキ内装', 2000, 180)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '55px sans-serif'
  ctx.fillText('施工現場 360° VR体験デモ', 2000, 240)

  // Info box
  ctx.fillStyle = 'rgba(130, 237, 166, 0.2)'
  ctx.fillRect(100, 1650, 900, 300)
  ctx.strokeStyle = '#82EDA6'
  ctx.lineWidth = 5
  ctx.strokeRect(100, 1650, 900, 300)

  ctx.fillStyle = '#252423'
  ctx.font = 'bold 50px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('🏗️ デモ施工現場', 140, 1730)
  ctx.font = '40px sans-serif'
  ctx.fillText('実際のパノラマ写真を', 140, 1800)
  ctx.fillText('public/panorama/ に配置すると', 140, 1860)
  ctx.fillText('自動的に読み込まれます', 140, 1920)

  return canvas.toDataURL('image/jpeg', 0.9)
}
