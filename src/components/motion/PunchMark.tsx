import { useGSAP } from '@gsap/react'
import { useRef, type RefObject } from 'react'
import { marks, type MarkName } from '../../content/shared'
import { gsap, MQ } from '../../motion/engine'

const cellsOf = (rows: string[]) => rows.join('').split('').map((c) => c === '1')

type Props = {
  shape?: MarkName
  rows?: string[]
  from?: MarkName
  color?: string
  cell?: number
  gap?: number
  pop?: boolean // hero: holes pop in by distance from centre
  popDelay?: number
  repelRef?: RefObject<HTMLElement | null> // holes near the cursor push away
  className?: string
}

// 7×7 punched-hole mark. Final shape is in the markup (no-JS correct); motion
// morphs from `from` → `shape` when it enters view.
export default function PunchMark({ shape = 'q', rows, from, color = 'var(--accent)', cell = 14, gap = 0, pop, popDelay = 0.35, repelRef, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = cellsOf(rows || marks[shape])

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const cells = Array.from(el.children) as HTMLElement[]
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        if (pop) {
          gsap.from(
            cells.filter((_, i) => target[i]),
            { scale: 0, opacity: 0, duration: 0.5, ease: 'qw.snap', delay: popDelay, stagger: { each: 0.012, from: 'center', grid: [7, 7] } }
          )
        } else if (from) {
          const start = cellsOf(marks[from])
          gsap.set(cells, { opacity: (i) => (start[i] ? 1 : 0), scale: (i) => (start[i] ? 1 : 0.3) })
          gsap.to(cells, {
            opacity: (i) => (target[i] ? 1 : 0),
            scale: (i) => (target[i] ? 1 : 0.3),
            duration: 0.6,
            ease: 'qw.out',
            stagger: { each: 0.01, from: 'center', grid: [7, 7] },
            scrollTrigger: { trigger: el, start: 'top 80%', once: true }
          })
        }
      })
      if (repelRef?.current) {
        mm.add(MQ.fine, () => {
          const area = repelRef.current!
          const on = cells.filter((_, i) => target[i])
          const qx = on.map((c) => gsap.quickTo(c, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' }))
          const qy = on.map((c) => gsap.quickTo(c, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' }))
          let raf = 0
          let p: { x: number; y: number } | null = null
          const apply = () => {
            raf = 0
            on.forEach((c, i) => {
              let tx = 0
              let ty = 0
              if (p) {
                const r = c.getBoundingClientRect()
                const dx = r.left + r.width / 2 - p.x
                const dy = r.top + r.height / 2 - p.y
                const d = Math.hypot(dx, dy) || 1
                if (d < 80) {
                  const k = (1 - d / 80) * 18
                  tx = (dx / d) * k
                  ty = (dy / d) * k
                }
              }
              qx[i](tx)
              qy[i](ty)
            })
          }
          const move = (e: PointerEvent) => {
            p = { x: e.clientX, y: e.clientY }
            if (!raf) raf = requestAnimationFrame(apply)
          }
          const leave = () => {
            p = null
            if (!raf) raf = requestAnimationFrame(apply)
          }
          area.addEventListener('pointermove', move, { passive: true })
          area.addEventListener('pointerleave', leave)
          return () => {
            area.removeEventListener('pointermove', move)
            area.removeEventListener('pointerleave', leave)
            cancelAnimationFrame(raf)
          }
        })
      }
    },
    { scope: ref, dependencies: [shape, from, pop] }
  )

  return (
    <span ref={ref} aria-hidden="true" className={`pm ${className}`} style={{ ['--cell' as string]: `${cell}px`, ['--pm-color' as string]: color, gap: gap ? `${gap}px` : undefined }}>
      {target.map((on, i) => (
        <span key={i} className={on ? 'on' : ''} />
      ))}
    </span>
  )
}
