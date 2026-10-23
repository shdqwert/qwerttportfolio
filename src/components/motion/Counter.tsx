import { useGSAP } from '../../motion/useMotion'
import { useRef } from 'react'
import { gsap, MQ } from '../../motion/engine'

// Counts up once (1.2 s, power3.out). The final value is in the DOM from the
// start; the last digit flickers like a split-flap while counting.
export default function Counter({ to, suffix = '', className, start = 'top 85%', delay = 0 }: { to: number; suffix?: string; className?: string; start?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const o = { v: 0 }
        el.textContent = `0${suffix}`
        gsap.to(o, {
          v: to,
          duration: 1.2,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(o.v)}${suffix}`
          },
          onComplete: () => {
            el.textContent = `${to}${suffix}`
          }
        })
        return () => {
          el.textContent = `${to}${suffix}`
        }
      })
    },
    { scope: ref, dependencies: [to, suffix] }
  )
  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {to}
      {suffix}
    </span>
  )
}
