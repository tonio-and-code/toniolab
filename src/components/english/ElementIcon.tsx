'use client';

import { ELEMENT_COLORS, ELEMENT_LABELS } from '@/data/english/elements';

interface ElementBadgeProps {
    element: string;
    size?: number;
}

export function ElementBadge({ element, size = 12 }: ElementBadgeProps) {
    const color = ELEMENT_COLORS[element] || '#78716C';
    const label = ELEMENT_LABELS[element] || element;
    return (
        <span style={{
            display: 'inline-block',
            fontSize: `${size}px`,
            fontWeight: 800,
            padding: '1px 5px',
            borderRadius: '4px',
            backgroundColor: color + '18',
            color,
            lineHeight: 1.4,
        }}>
            {label}
        </span>
    );
}

// Keep default export for existing imports
export default ElementBadge;
