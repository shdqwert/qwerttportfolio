import { useEffect, useLayoutEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

let locks = 0

function lockScroll() {
  if (locks++ > 0) return
  const gap = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.setProperty('--scrollbar-gap', `${gap}px`)
  document.documentElement.classList.add('scroll-locked')
}

function unlockScroll() {
  if (--locks > 0) return
  document.documentElement.classList.remove('scroll-locked')
  document.documentElement.style.removeProperty('--scrollbar-gap')
}

// Focus trap + Esc + background scroll lock + focus restore for modal UI.
export function useDialog(open, onClose, panelRef, { initialFocus } = {}) {
  const closeRef = useRef(onClose)
  useLayoutEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    lockScroll()
    const panel = panelRef.current
    const first = initialFocus?.current || panel?.querySelector(FOCUSABLE)
    first?.focus({ preventScroll: true })

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === firstEl || !panel.contains(document.activeElement))) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && (document.activeElement === lastEl || !panel.contains(document.activeElement))) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true })
    }
  }, [open, panelRef, initialFocus])
}
