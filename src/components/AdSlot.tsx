import { useEffect, useMemo, useRef } from 'react'

type AdPlacement = 'top' | 'side' | 'news'

interface AdSlotProps {
  className?: string
  label: string
  placement: AdPlacement
}

const DEFAULT_ADSENSE_CLIENT = 'ca-pub-3303941146778727'
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT

const SLOT_BY_PLACEMENT: Record<AdPlacement, string | undefined> = {
  top: import.meta.env.VITE_ADSENSE_SLOT_TOP || '2342953263',
  side: import.meta.env.VITE_ADSENSE_SLOT_SIDE,
  news: import.meta.env.VITE_ADSENSE_SLOT_NEWS,
}

let adsenseScriptRequested = false

export function AdSlot({ className = '', label, placement }: AdSlotProps) {
  const slot = SLOT_BY_PLACEMENT[placement]
  const isConfigured = Boolean(ADSENSE_CLIENT && slot)
  const elementKey = useMemo(() => `${placement}-${slot ?? 'preview'}`, [placement, slot])
  const adElementRef = useRef<HTMLModElement | null>(null)
  const hasRequestedAdRef = useRef(false)

  useEffect(() => {
    if (!ADSENSE_CLIENT) return

    if (!adsenseScriptRequested) {
      const existingScript = document.querySelector(`script[src*="${ADSENSE_CLIENT}"]`)

      if (!existingScript) {
        const script = document.createElement('script')
        script.async = true
        script.crossOrigin = 'anonymous'
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
        document.head.appendChild(script)
      }

      adsenseScriptRequested = true
    }

    if (!isConfigured || hasRequestedAdRef.current) return

    if (adElementRef.current?.dataset.adsbygoogleStatus === 'done') {
      hasRequestedAdRef.current = true
      return
    }

    const win = window as Window & { adsbygoogle?: unknown[] }
    win.adsbygoogle = win.adsbygoogle ?? []
    try {
      hasRequestedAdRef.current = true
      win.adsbygoogle.push({})
    } catch {
      // Ad blockers or early AdSense loading can reject this; the slot remains reserved.
    }
  }, [isConfigured])

  if (!isConfigured) {
    return (
      <aside className={`ad-slot ad-slot-${placement} ad-preview ${className}`} aria-label={`${label} 광고 영역`}>
        <span>광고</span>
        <strong>{label}</strong>
        <small>자동 광고 연결됨 · 슬롯 ID 대기</small>
      </aside>
    )
  }

  return (
    <aside className={`ad-slot ad-slot-${placement} ${className}`} aria-label={`${label} 광고 영역`}>
      <span>광고</span>
      <ins
        key={elementKey}
        ref={adElementRef}
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
