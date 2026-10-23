import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react'
import { useT } from '../content/i18n'
import { contactInfo, img, type ImgKey } from '../content/shared'

type ImgProps = {
  k: ImgKey
  alt: string
  sizes?: string
  className?: string
  style?: CSSProperties
  eager?: boolean
  imgRef?: Ref<HTMLImageElement>
  draggable?: boolean
}

// AVIF + WebP at 1×/2× with the original JPEG as fallback; explicit
// width/height on every image (no layout shift).
export function Img({ k, alt, sizes = '(min-width: 1440px) 900px, 60vw', className, style, eager, imgRef, draggable }: ImgProps) {
  const d = img(k)
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={d.avif.map((x) => `${x.src} ${x.w}w`).join(', ')} sizes={sizes} />
      <source type="image/webp" srcSet={d.webp.map((x) => `${x.src} ${x.w}w`).join(', ')} sizes={sizes} />
      <img
        ref={imgRef}
        src={d.src}
        width={d.w}
        height={d.h}
        alt={alt}
        className={className}
        style={style}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={draggable}
        {...(eager ? { fetchPriority: 'high' as const } : {})}
      />
    </picture>
  )
}

function formatTime(timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date())
}

// "Tashkent 14:32" — live, updated on the minute.
export function LiveClock() {
  const { owner } = useT()
  const [time, setTime] = useState(() => formatTime(contactInfo.timeZone))
  useEffect(() => {
    let t = 0
    const update = () => {
      setTime(formatTime(contactInfo.timeZone))
      t = window.setTimeout(update, 60000 - (Date.now() % 60000) + 50)
    }
    update()
    return () => clearTimeout(t)
  }, [])
  return (
    <span suppressHydrationWarning>
      {owner.timeLabel} {time}
    </span>
  )
}

// Copies the email; stamps "Copied ✓" for 1.8 s; falls back to selecting text.
export function CopyEmail({ className = 'copy', targetRef }: { className?: string; targetRef?: React.RefObject<HTMLElement | null> }) {
  const { ui } = useT()
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      const el = targetRef?.current
      if (!el) return
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }
  return (
    <button type="button" className={`${className}${copied ? ' is-copied' : ''}`} onClick={copy}>
      <span aria-live="polite">{copied ? ui.copied : ui.copy}</span>
    </button>
  )
}

// External link, or a visible placeholder when the URL is not known yet.
export function MaybeLink({ href, className, children, ...rest }: { href: string | null; className?: string; children: ReactNode; style?: CSSProperties; 'data-cursor'?: string }) {
  const { ui } = useT()
  if (!href) {
    return (
      <span className={`${className || ''} is-placeholder`} title={ui.placeholderTitle} {...rest}>
        {children}
      </span>
    )
  }
  const ext = /^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a href={href} className={className} {...ext} {...rest}>
      {children}
    </a>
  )
}

export function Arrow({ w = 120, h = 70, className, stroke = 'var(--accent)' }: { w?: number; h?: number; className?: string; stroke?: string }) {
  return (
    <svg className={className} width={w} height={h} viewBox="0 0 120 70" fill="none" stroke={stroke} strokeWidth="12" aria-hidden="true">
      <path d="M0 35h104M76 7l28 28-28 28" />
    </svg>
  )
}

export function MouseIcon({ color = 'currentColor', w = 22, h = 32 }: { color?: string; w?: number; h?: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 22 32" fill="none" stroke={color} strokeWidth="1.8" aria-hidden="true">
      <rect x="1" y="1" width="20" height="30" rx="10" />
      <line x1="11" y1="7" x2="11" y2="12" />
    </svg>
  )
}
