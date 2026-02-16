'use client'

import { useEffect, useRef } from 'react'

export default function CyberBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight

        const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; originalX: number; originalY: number }[] = []
        const particleCount = 80
        const mouse = { x: -1000, y: -1000 }

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * width
            const y = Math.random() * height
            particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: 1 + Math.random() * 2,
                size: 1 + Math.random() * 2,
                color: Math.random() > 0.5 ? '#10B981' : '#3B82F6',
                originalX: x,
                originalY: y
            })
        }

        const drawGrid = (offset: number) => {
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)'
            ctx.lineWidth = 1
            const gridSize = 40

            // Perspective Grid Effect
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, height)
                ctx.stroke()
            }

            for (let y = offset % gridSize; y <= height; y += gridSize) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
                ctx.stroke()
            }
        }

        let offset = 0
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)' // Trail effect
            ctx.fillRect(0, 0, width, height)

            offset += 0.5
            drawGrid(offset)

            particles.forEach(p => {
                // Normal movement
                p.y += p.vy
                p.x += p.vx

                // Mouse interaction (Repulsion)
                const dx = mouse.x - p.x
                const dy = mouse.y - p.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const maxDistance = 150

                if (distance < maxDistance) {
                    const forceDirectionX = dx / distance
                    const forceDirectionY = dy / distance
                    const force = (maxDistance - distance) / maxDistance
                    const directionX = forceDirectionX * force * 5
                    const directionY = forceDirectionY * force * 5

                    p.x -= directionX
                    p.y -= directionY
                }

                // Reset position
                if (p.y > height) {
                    p.y = 0
                    p.x = Math.random() * width
                }
                if (p.x > width) p.x = 0
                if (p.x < 0) p.x = width

                ctx.fillStyle = p.color
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }

        const handleMouseLeave = () => {
            mouse.x = -1000
            mouse.y = -1000
        }

        window.addEventListener('resize', handleResize)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('resize', handleResize)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto"
            style={{ opacity: 0.6 }}
        />
    )
}
