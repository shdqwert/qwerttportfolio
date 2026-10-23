import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { useT } from '../../content/i18n'
import { gsap, MQ } from '../../motion/engine'
import s from './Cursor.module.css'

// Desktop pointer-fine only. A 10 px dot (blend: difference) follows the
// pointer; over [data-cursor] it grows to 72 px and shows a mono label.
// The native cursor stays visible.
export default function Cursor() {
  const { ui } = useT()
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.fine, () => {
        gsap.set(el, { autoAlpha: 0 })
        const qx = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
        const qy = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
        let shown = false
        const labels: Record<string, string> = { view: ui.cursorView, drag: ui.cursorDrag, board: ui.cursorBoard }
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          if (!shown) {
            shown = true
            gsap.set(el, { x: e.clientX, y: e.clientY })
            gsap.to(el, { autoAlpha: 1, duration: 0.3 })
          }
          qx(e.clientX)
          qy(e.clientY)
          const hit = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
          const kind = hit?.dataset.cursor || ''
          setLabel(labels[kind] || '')
        }
        const out = () => {
          shown = false
          gsap.to(el, { autoAlpha: 0, duration: 0.3 })
        }
        window.addEventListener('pointermove', move, { passive: true })
        document.documentElement.addEventListener('pointerleave', out)
        return () => {
          window.removeEventListener('pointermove', move)
          document.documentElement.removeEventListener('pointerleave', out)
        }
      })
    },
    { dependencies: [ui] }
  )
  return (
    <div ref={ref} className={`${s.cursor} ${label ? s.big : ''}`} aria-hidden="true">
      <span className={s.label}>{label}</span>
    </div>
  )
}
