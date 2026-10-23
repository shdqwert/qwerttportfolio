import { useGSAP } from '@gsap/react'
import { useRef, type ReactNode } from 'react'
import { gsap, MQ } from '../../motion/engine'

// Pointer-fine only: the child leans toward the pointer (≤ max px) and springs
// back with elastic.out on leave.
export default function Magnetic({ children, strength = 0.25, max = 12, className }: { children: ReactNode; strength?: number; max?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.fine, () => {
        const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width / 2)) * strength
          const dy = (e.clientY - (r.top + r.height / 2)) * strength
          qx(gsap.utils.clamp(-max, max, dx))
          qy(gsap.utils.clamp(-max, max, dy))
        }
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: ref }
  )
  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  )
}
