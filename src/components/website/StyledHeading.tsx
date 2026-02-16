import { ReactNode } from 'react'

interface StyledHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
  gradient?: boolean
}

export default function StyledHeading({ level = 1, children, className = '', gradient = false }: StyledHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  const baseStyle = {
    fontFamily: 'var(--font-space-grotesk), var(--font-sora), var(--font-zen-kaku), sans-serif',
    letterSpacing: '-0.02em'
  }

  const gradientClass = gradient
    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
    : ''

  return (
    <Tag
      className={`font-black ${gradientClass} ${className}`}
      style={baseStyle}
    >
      {children}
    </Tag>
  )
}
