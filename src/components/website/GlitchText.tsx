'use client'

import { useState, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'

export default function GlitchText({ text, className = '' }: { text: string, className?: string }) {
    const [displayText, setDisplayText] = useState(text)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (!isHovered) {
            setDisplayText(text)
            return
        }

        let interval: NodeJS.Timeout
        let iteration = 0

        interval = setInterval(() => {
            setDisplayText(prev =>
                text.split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index]
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join('')
            )

            if (iteration >= text.length) {
                clearInterval(interval)
            }

            iteration += 1 / 3
        }, 30)

        return () => clearInterval(interval)
    }, [isHovered, text])

    return (
        <span
            className={`cursor-pointer inline-block ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {displayText}
        </span>
    )
}
