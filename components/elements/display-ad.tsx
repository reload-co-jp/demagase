"use client"

import { FC, useEffect } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const AdUnit: FC = () => {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-6542845006087970"
      data-ad-slot="4829146611"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

/** 共通ディスプレイ。レイアウトは遷移で再マウントされないため pathname で作り直す */
export const DisplayAd: FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const pathname = usePathname()
  if (process.env.NODE_ENV !== "production") return null
  return (
    <div style={style}>
      <AdUnit key={pathname} />
    </div>
  )
}
