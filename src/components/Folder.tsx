'use client'

import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'

interface FolderProps {
  color?: string
  size?: number
  items?: ReactNode[]
  className?: string
  label?: string
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const num = parseInt(color.slice(0, 6), 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))))
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))))
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}

export default function Folder({
  color = '#d9d9d9',
  size = 1,
  items = [],
  className = '',
  label = 'project folder',
}: FolderProps) {
  const maxItems = 3
  const papers = [...items.slice(0, maxItems)]
  while (papers.length < maxItems) papers.push(null)

  const [open, setOpen] = useState(false)

  const folderBackColor = darkenColor(color, 0.12)
  const paper1 = darkenColor('#f2f1ed', 0.08)
  const paper2 = darkenColor('#f2f1ed', 0.03)
  const paper3 = '#f2f1ed'

  const handleClick = () => setOpen((prev) => !prev)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3,
  } as CSSProperties

  return (
    <div className={`folder-scale ${className}`.trim()} style={{ transform: `scale(${size})` }}>
      <div
        className={`folder ${open ? 'is-open' : ''}`}
        style={folderStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={open ? `Close ${label}` : `Open ${label}`}
      >
        <div className="folder-back" style={{ backgroundColor: folderBackColor }}>
          <span className="folder-tab" style={{ backgroundColor: folderBackColor }} />
          {papers.map((item, i) => (
            <div
              key={i}
              className={`folder-paper folder-paper-${i + 1}`}
              onClick={(e) => {
                if (open) e.stopPropagation()
              }}
              style={{ backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3 }}
            >
              {item}
            </div>
          ))}
          <div
            className="folder-cover folder-cover-left"
            style={{ backgroundColor: color }}
          />
          <div
            className="folder-cover folder-cover-right"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  )
}
