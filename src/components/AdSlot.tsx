import { useEffect, useMemo } from 'react'

type AdPlacement = 'top' | 'side' | 'news'

interface AdSlotProps {
  className?: string
  label: string
  placement: AdPlacement
}

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT

const SLOT_BY_PLACEMENT: Record<AdPlacement, string | undefined> = {
  top: import.meta.env.VITE_ADSENSE_SLOT_TOP,
  side: import.meta.env.VITE_ADSENSE_SLOT_SIDE,
  news: import.meta.env.VITE_ADSENSE_SLOT_NEWS,
}

let adsenseScriptRequested = false

export function AdSlot({ className = '', label, placement }: AdSlotProps) {
  const slot = SLOT_BY_PLACEMENT[placement]
  const isConfigured = Boolean(ADSENSE_CLIENT && slot)
  const elementKey = useMemo(() => `${placement}-${slot ?? 'preview'}`, [placement, slot])

  useEffect(() => {
    if (!isConfigured || !ADSENSE_CLIENT) return

    if (!adsenseScriptRequested) {
      const script = document.createElement('script')
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
      document.head.appendChild(script)
      adsenseScriptRequested = true
    }

    const win = window as Window & { adsbygoogle?: unknown[] }
    win.adsbygoogle = win.adsbygoogle ?? []
    win.adsbygoogle.push({})
  }, [isConfigured])

  if (!isConfigured) {
    return (
      <aside className={`ad-slot ad-slot-${placement} ad-preview ${className}`} aria-label={`${label} 광고 영역`}>
        <span>광고</span>
        <strong>{label}</strong>
        <small>AdSense 승인 후 표시</small>
      </aside>
    )
  }

  return (
    <aside className={`ad-slot ad-slot-${placement} ${className}`} aria-label={`${label} 광고 영역`}>
      <span>광고</span>
      <ins
        key={elementKey}
        className="adsbygoogle"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-format="auto"
        data-ad-slot={slot}
        data-full-width-responsive="true"
        style={{ display: 'block' }}
      />
    </aside>
  )
}
