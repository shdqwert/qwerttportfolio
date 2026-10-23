import { useGSAP } from '@gsap/react'
import { useRef, type ReactNode } from 'react'
import { gsap, MQ, ScrollTrigger } from '../../motion/engine'

// Infinite xPercent loop. Eases to a stop on hover/focus (0.4 s) and briefly
// speeds up / reverses with scroll velocity (clamped ±1.5×).
export default function Marquee({ children, speed = 60, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      const track = el?.firstElementChild as HTMLElement | null
      if (!el || !track) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const width = track.scrollWidth / 2
        const tween = gsap.to(track, { x: -width, duration: width / speed, ease: 'none', repeat: -1 })
        let hovered = false
        const stop = () => {
          hovered = true
          gsap.to(tween, { timeScale: 0, duration: 0.4 })
        }
        const go = () => {
          hovered = false
          gsap.to(tween, { timeScale: 1, duration: 0.4 })
        }
        el.addEventListener('pointerenter', stop)
        el.addEventListener('pointerleave', go)
        el.addEventListener('focusin', stop)
        el.addEventListener('focusout', go)
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (hovered) return
            const v = gsap.utils.clamp(-1.5, 1.5, self.getVelocity() / 900)
            gsap.to(tween, { timeScale: v < -0.2 ? v : 1 + Math.abs(v) * 0.6, duration: 0.25, overwrite: true, onComplete: () => void gsap.to(tween, { timeScale: 1, duration: 0.8 }) })
          }
        })
        return () => {
          st.kill()
          el.removeEventListener('pointerenter', stop)
          el.removeEventListener('pointerleave', go)
          el.removeEventListener('focusin', stop)
          el.removeEventListener('focusout', go)
        }
      })
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: 'max-content' }}>
        {children}
        <span aria-hidden="true" style={{ display: 'contents' }}>
          {children}
        </span>
      </div>
    </div>
  )
}
