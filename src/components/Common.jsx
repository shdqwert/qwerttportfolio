import { useEffect, useRef, useState } from 'react'
import { useT } from '../content/i18n.jsx'
import { contactInfo } from '../content/shared.js'

function formatTime(timeZone) {
  return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date())
}

// "Tashkent 14:32" — live, updated on the minute.
export function LiveClock() {
  const { owner } = useT()
  const [time, setTime] = useState(() => formatTime(contactInfo.timeZone))
  useEffect(() => {
    let timer = 0
    const update = () => {
      setTime(formatTime(contactInfo.timeZone))
      timer = setTimeout(update, 60000 - (Date.now() % 60000) + 50)
    }
    update()
    return () => clearTimeout(timer)
  }, [])
  return (
    <span suppressHydrationWarning>
      {owner.timeLabel} {time}
    </span>
  )
}

// Copies the email; shows "Copied ✓" for 1.8 s. Falls back to selecting the text.
export function CopyEmail({ className = 'copy', targetRef, style }) {
  const { ui } = useT()
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const select = () => {
    const el = targetRef?.current
    if (!el) return
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      select()
    }
  }

  return (
    <button type="button" className={`${className}${copied ? ' is-copied' : ''}`} onClick={copy} style={style}>
      <span aria-live="polite">{copied ? ui.copied : ui.copy}</span>
    </button>
  )
}

// A link that falls back to a visible placeholder when the URL is unknown.
export function MaybeLink({ href, className, children, external = true, ...rest }) {
  const { ui } = useT()
  if (!href) {
    return (
      <span className={`${className || ''} is-placeholder`} title={ui.placeholderTitle} {...rest}>
        {children}
      </span>
    )
  }
  const ext = external && /^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a href={href} className={className} {...ext} {...rest}>
      {children}
    </a>
  )
}

// Text that rolls up on hover: one visible label + an aria-hidden duplicate.
export function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll__in">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
