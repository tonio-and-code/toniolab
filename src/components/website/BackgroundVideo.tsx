'use client'

import { useEffect, useRef } from 'react'

interface Props {
    variant?: 'default' | 'gold'
}

export default function BackgroundVideo({ variant = 'default' }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        let mouseX = 0
        let mouseY = 0
        let isMouseDown = false
        let rushMode = false

        // Resize handling
        const resizeObserver = new ResizeObserver(() => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        })
        resizeObserver.observe(canvas)

        // Mouse handling
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }
        const handleMouseDown = () => { isMouseDown = true; rushMode = true; }
        const handleMouseUp = () => { isMouseDown = false; rushMode = false; }

        // Add listeners to window to catch interaction outside canvas
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)

        // Configuration
        const config = variant === 'gold' ? {
            countDivisor: 3000,   // High density
            speedBase: 12,        // Fast
            speedVar: 10,
            color: 'gold',
            bgFade: 'rgba(0, 0, 0, 0.2)' // Longer trails for speed feel
        } : {
            countDivisor: 10000,
            speedBase: 1,
            speedVar: 3,
            color: 'blue',
            bgFade: 'rgba(10, 25, 47, 0.2)'
        }

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number
            brightness: number

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.vx = (Math.random() - 0.5) * 2
                this.vy = config.speedBase + Math.random() * config.speedVar
                this.size = 1 + Math.random() * 3
                this.brightness = Math.random()
            }

            update() {
                // Interactive physics
                if (variant === 'gold') {
                    // Mouse repulsion/attraction logic
                    const dx = mouseX - this.x
                    const dy = mouseY - this.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < 300) {
                        const force = (300 - dist) / 300
                        const angle = Math.atan2(dy, dx)

                        if (isMouseDown) {
                            // Attract (Push button / Rush)
                            this.vx += Math.cos(angle) * force * 5
                            this.vy += Math.sin(angle) * force * 5
                        } else {
                            // Repel (Field effect)
                            this.vx -= Math.cos(angle) * force * 2
                            this.vy -= Math.sin(angle) * force * 2
                        }
                    }

                    // Rush Mode Acceleration
                    if (rushMode) {
                        this.vy *= 1.05; // Accelerate continuously
                        this.brightness = 1; // Max brightness
                    }
                }

                this.x += this.vx
                this.y += this.vy

                // Friction & Speed Limits
                this.vx *= 0.95
                if (this.vy < config.speedBase) this.vy += 0.5
                if (this.vy > 60) this.vy = 60; // Max terminal velocity

                // Screen Wrap / Reset
                if (this.y > canvas!.height || this.x < 0 || this.x > canvas!.width) {
                    this.y = 0
                    this.x = Math.random() * canvas!.width
                    this.vy = config.speedBase + Math.random() * config.speedVar
                    this.vx = (Math.random() - 0.5) * 2
                }
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()

                if (variant === 'gold') {
                    const alpha = 0.5 + this.brightness * 0.5

                    if (this.vy > 30) {
                        // Hyper Speed Lines (visualizing speed)
                        ctx.strokeStyle = `rgba(255, 255, 150, ${alpha})`
                        ctx.lineWidth = this.size / 2
                        ctx.moveTo(this.x, this.y)
                        ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3) // Longer trails
                        ctx.stroke()
                    } else {
                        // Standard Particle
                        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                        ctx.fill()
                    }

                    // Occasional Sparkle/Flash
                    if (Math.random() > 0.99) {
                        ctx.shadowBlur = 10
                        ctx.shadowColor = "white"
                    } else {
                        ctx.shadowBlur = 0
                    }

                } else {
                    // Default Blue Theme
                    ctx.fillStyle = `rgba(100, 200, 255, ${this.brightness * 0.5})`
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                    ctx.fill()
                }
            }
        }

        function initParticles() {
            if (!canvas) return
            particles = []
            // Increase density for gold mode
            const particleCount = Math.floor((canvas.width * canvas.height) / config.countDivisor)
            const trueCount = variant === 'gold' ? particleCount * 2 : particleCount

            for (let i = 0; i < trueCount; i++) {
                particles.push(new Particle())
            }
        }

        function animate() {
            if (!ctx || !canvas) return

            // Background Fade (Controls trail length)
            ctx.fillStyle = rushMode && variant === 'gold' ? 'rgba(0,0,0,0.1)' : config.bgFade
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Full Screen Flash on Rush Start/Randomly
            if (variant === 'gold' && (rushMode && Math.random() > 0.9)) {
                ctx.fillStyle = `rgba(255, 255, 255, 0.03)`
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            particles.forEach(p => {
                p.update()
                p.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        initParticles()
        animate()

        return () => {
            cancelAnimationFrame(animationFrameId)
            resizeObserver.disconnect()
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [variant])

    return (
        <div className={`fixed top-0 left-0 w-full h-full -z-10 overflow-hidden ${variant === 'gold' ? 'pointer-events-auto bg-black' : 'pointer-events-none bg-[#0a192f]'}`}>
            {/* Generative Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />

            {/* Overlay for depth */}
            <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none ${variant === 'gold'
                ? 'from-black/80 via-yellow-900/10 to-black/80'
                : 'from-[#0a192f]/80 via-transparent to-[#0a192f]/80'
                }`} />
        </div>
    )
}
