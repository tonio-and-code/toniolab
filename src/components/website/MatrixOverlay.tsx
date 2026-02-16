'use client'

import { useEffect, useRef } from 'react'

export default function MatrixOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight

        const columns = Math.floor(width / 20)
        const drops: number[] = []

        for (let i = 0; i < columns; i++) {
            drops[i] = 1
        }

        const chars = '0123456789ABCDEF'

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, width, height)

            ctx.fillStyle = '#0F0'
            ctx.font = '15px monospace'

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)]
                ctx.fillText(text, i * 20, drops[i] * 20)

                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 33)

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50 pointer-events-none mix-blend-screen">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    )
}
