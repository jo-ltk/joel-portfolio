'use client'

import { useEffect, useState } from 'react'

type Meta = {
  image?: string
  logo?: string
}

const hostOf = (url: string) => {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

const faviconOf = (url: string) =>
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostOf(url))}&sz=64`

const shotOf = (url: string) =>
  `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=900`

export default function SiteMetaPreview({ url }: { url: string }) {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [mode, setMode] = useState<'og' | 'shot' | 'fallback'>('shot')
  const host = hostOf(url)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
        if (!res.ok) throw new Error('meta fetch failed')
        const json = await res.json()
        if (!alive) return
        const data = json?.data ?? {}
        const image = data.image?.url as string | undefined
        setMeta({ image, logo: data.logo?.url })
        if (image) setMode('og')
      } catch {
        /* free screenshot / favicon fallback */
      }
    }
    load()
    return () => { alive = false }
  }, [url])

  const src = mode === 'og' ? meta?.image : mode === 'shot' ? shotOf(url) : undefined
  const logo = meta?.logo || faviconOf(url)

  return (
    <div className="freelance-cover" aria-hidden="true">
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setMode((m) => (m === 'og' ? 'shot' : 'fallback'))}
        />
      ) : (
        <div className="freelance-cover-fallback">
          <img src={logo} alt="" loading="lazy" />
          <span>{host}</span>
        </div>
      )}
    </div>
  )
}
