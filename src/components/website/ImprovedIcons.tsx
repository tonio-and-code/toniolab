// 建設業らしい、ユニークなカスタムアイコン

export const InteriorIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18" />
    <path d="M3 10l9-7 9 7" />
    <path d="M5 10v11M19 10v11" />
    <rect x="9" y="14" width="6" height="7" fill="currentColor" opacity="0.2" />
    <path d="M7 14h4M7 17h4M13 14h4M13 17h4" strokeWidth="1" opacity="0.6" />
  </svg>
)

export const ReformIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l-8 8v12h6v-7h4v7h6V10l-8-8z" />
    <circle cx="15" cy="8" r="3" fill="currentColor" opacity="0.3" />
    <path d="M15 5v6M12 8h6" strokeWidth="1.5" />
  </svg>
)

export const BarrierFreeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="5" r="2" fill="currentColor" />
    <path d="M12 7v8" />
    <path d="M8 12h8" />
    <path d="M8 12l-3 7M16 12l3 7" strokeWidth="2" strokeLinecap="round" />
    <circle cx="5" cy="19" r="1.5" fill="currentColor" />
    <circle cx="19" cy="19" r="1.5" fill="currentColor" />
    <path d="M3 15h18" strokeDasharray="2 2" opacity="0.4" />
  </svg>
)

export const ShopDesignIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 7l10-5 10 5v2H2V7z" fill="currentColor" opacity="0.2" />
    <rect x="4" y="9" width="16" height="12" rx="1" />
    <path d="M9 9v12M15 9v12" opacity="0.4" />
    <rect x="10" y="14" width="4" height="7" fill="currentColor" opacity="0.3" />
    <path d="M7 12h10M7 16h4M13 16h4" strokeWidth="1" opacity="0.5" />
  </svg>
)

export const CraftsmanIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="6" r="3" fill="currentColor" opacity="0.3" />
    <path d="M12 9v5" />
    <path d="M8 14l4-2 4 2" />
    <path d="M6 14l-2 8h16l-2-8" />
    <path d="M8 18h8" opacity="0.5" />
    <rect x="10" y="3" width="4" height="2" rx="1" fill="currentColor" />
  </svg>
)

export const WallFinishIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M4 8h16M4 12h16M4 16h16" opacity="0.3" strokeWidth="1" />
    <path d="M8 4v16M12 4v16M16 4v16" opacity="0.3" strokeWidth="1" />
    <circle cx="6" cy="6" r="0.8" fill="currentColor" />
    <circle cx="10" cy="10" r="0.8" fill="currentColor" />
    <circle cx="14" cy="6" r="0.8" fill="currentColor" />
    <circle cx="18" cy="10" r="0.8" fill="currentColor" />
  </svg>
)

export const FloorFinishIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="10" width="5" height="11" rx="0.5" />
    <rect x="9.5" y="10" width="5" height="11" rx="0.5" />
    <rect x="16" y="10" width="5" height="11" rx="0.5" />
    <path d="M3 13h18M3 16h18M3 19h18" strokeWidth="0.8" opacity="0.4" />
    <path d="M3 9l18-3" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const WindowWorkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 12h16M12 4v16" strokeWidth="2" />
    <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="16" cy="8" r="1" fill="currentColor" opacity="0.6" />
    <path d="M6 7l2 2M14 7l2 2" strokeWidth="1" opacity="0.4" />
  </svg>
)

export const FurnitureIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 8h16v10H4z" />
    <path d="M4 8V6h16v2" fill="currentColor" opacity="0.2" />
    <path d="M6 8v10M10 8v10M14 8v10M18 8v10" opacity="0.3" strokeWidth="1" />
    <rect x="7" y="10" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
    <rect x="13" y="10" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
    <circle cx="20" cy="18" r="1.5" fill="currentColor" />
  </svg>
)

export const PaintIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 3l3 3-12 12-3-3 12-12z" />
    <path d="M9 15l-5 5-1 2 2-1 5-5" />
    <circle cx="3" cy="21" r="2" fill="currentColor" opacity="0.4" />
    <path d="M15 6l3 3" strokeWidth="2" strokeLinecap="round" />
    <circle cx="19" cy="5" r="1.5" fill="currentColor" opacity="0.3" />
  </svg>
)
