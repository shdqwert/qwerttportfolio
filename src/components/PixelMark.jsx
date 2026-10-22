import { useEffect, useRef } from 'react'
import { marks } from '../content/shared.js'
import { prefersReduced, useReveal } from '../lib/motion.js'

const cellsOf = (name) => marks[name].join('').split('').map((c) => c === '1')

// 7×7 pixel mark. `from` → morphs from that shape into `shape` when it enters
// the viewport. `draw` → cells appear one by one on load (CSS only).
// `repelRef` → filled cells push away from the pointer inside that element.
export default function PixelMark({ shape = 'q', from, color = 'var(--accent)', cell = 14, draw = false, repelRef, className = '' }) {
  const [ref, revealClass, inView] = useReveal({ threshold: 0.6 })
  const cellRefs = useRef([])
  const target = cellsOf(shape)
  const start = from ? cellsOf(from) : target
  const morphing = from && revealClass === 'rv' && !inView
  const shown = morphing ? start : target

  useEffect(() => {
    const area = repelRef?.current
    if (!area || prefersReduced()) return
    let raf = 0
    let pointer = null
    const apply = () => {
      raf = 0
      cellRefs.current.forEach((el, i) => {
        if (!el || !target[i]) return
        let tx = 0
        let ty = 0
        if (pointer) {
          const r = el.getBoundingClientRect()
          const dx = r.left + r.width / 2 - pointer.x
          const dy = r.top + r.height / 2 - pointer.y
          const d = Math.hypot(dx, dy) || 1
          if (d < 80) {
            const k = (1 - d / 80) * 18
            tx = (dx / d) * k
            ty = (dy / d) * k
          }
        }
        el.style.translate = tx || ty ? `${tx.toFixed(1)}px ${ty.toFixed(1)}px` : ''
      })
    }
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      pointer = { x: e.clientX, y: e.clientY }
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      pointer = null
      if (!raf) raf = requestAnimationFrame(apply)
    }
    area.addEventListener('pointermove', onMove, { passive: true })
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
    // target is derived from `shape`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repelRef, shape])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pm${draw ? ' pm--draw' : ''}${from ? ' pm--morph' : ''} ${className}`}
      style={{ '--cell': `${cell}px`, '--pm-color': color }}
    >
      {shown.map((on, i) => (
        <span
          key={i}
          ref={(el) => (cellRefs.current[i] = el)}
          className={on ? 'pm__c is-on' : 'pm__c'}
          style={{ '--i': i }}
        />
      ))}
    </span>
  )
}
