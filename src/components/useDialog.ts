import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { lockScroll, unlockScroll } from '../motion/engine'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Focus trap + Esc + scroll lock (lenis.stop) + focus restore for modal UI.
export function useDialog(open: boolean, onClose: () => void, panelRef: RefObject<HTMLElement | null>, initialFocus?: RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose)
  useLayoutEffect(() => {
    closeRef.current = onClose
  })
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    lockScroll()
    const panel = panelRef.current
    const first = initialFocus?.current || panel?.querySelector<HTMLElement>(FOCUSABLE)
    // the panel may still be visibility:hidden while its entrance starts —
    // keep trying for a few frames until focus actually lands inside
    let tries = 0
    let raf = 0
    const place = () => {
      first?.focus({ preventScroll: true })
      if (panel && !panel.contains(document.activeElement) && ++tries < 40) raf = requestAnimationFrame(place)
    }
    place()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const a = items[0]
      const b = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === a || !panel.contains(document.activeElement))) {
        e.preventDefault()
        b.focus()
      } else if (!e.shiftKey && (document.activeElement === b || !panel.contains(document.activeElement))) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      unlockScroll()
      opener?.focus?.({ preventScroll: true })
    }
  }, [open, panelRef, initialFocus])
}
