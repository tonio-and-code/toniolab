import * as React from 'react'

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>

export function ScrollArea({ className, style, children, ...rest }: ScrollAreaProps) {
  return (
    <div
      className={className}
      style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch', ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default ScrollArea




