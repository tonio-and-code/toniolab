'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // WebGL support check
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        return
      }
    } catch {
      return
    }

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      containerRef.current.appendChild(renderer.domElement)
    } catch {
      return
    }

    // Create emerald particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    )

    // Emerald green color
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: new THREE.Color('#10b981'), // emerald-500
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Create floating geometric shapes
    const shapes: THREE.Mesh[] = []

    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(0.5)
    const dodecaMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#059669'), // emerald-600
      transparent: true,
      opacity: 0.6,
      wireframe: false,
    })
    const dodeca = new THREE.Mesh(dodecaGeometry, dodecaMaterial)
    dodeca.position.set(-2, 1, 0)
    shapes.push(dodeca)
    scene.add(dodeca)

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(0.4)
    const octaMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#34d399'), // emerald-400
      transparent: true,
      opacity: 0.6,
    })
    const octa = new THREE.Mesh(octaGeometry, octaMaterial)
    octa.position.set(2, -1, -1)
    shapes.push(octa)
    scene.add(octa)

    // Torus
    const torusGeometry = new THREE.TorusGeometry(0.4, 0.15, 16, 100)
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#6ee7b7'), // emerald-300
      transparent: true,
      opacity: 0.5,
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.position.set(0, 2, -2)
    shapes.push(torus)
    scene.add(torus)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x10b981, 2)
    pointLight.position.set(2, 3, 4)
    scene.add(pointLight)

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Rotate particles
      particlesMesh.rotation.y += 0.001
      particlesMesh.rotation.x += 0.0005

      // Rotate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 * (index + 1)
        shape.rotation.y += 0.005 * (index + 1)
      })

      // Camera follow mouse
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (renderer) {
        containerRef.current?.removeChild(renderer.domElement)
        renderer.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
