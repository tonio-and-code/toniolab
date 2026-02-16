import * as React from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      className={[
        'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        props.className || ''
      ].join(' ').trim()}
    />
  )
}

export default Textarea




