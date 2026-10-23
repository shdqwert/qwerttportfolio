import { useEffect, useMemo, useRef, useState } from 'react'
import { useT } from '../content/i18n.jsx'
import { marks } from '../content/shared.js'
import { rnd } from '../lib/motion.js'

const TILE_COLS = 16
const TILE_ROWS = 10
const CELL = 22
const ASSEMBLE = 1000
const HOLD = 250
const OUT = 750
// A different scatter on every page load, stable across re-renders.
const SEED = (Date.now() % 997) + 1

// First-visit intro: pixels fly in and assemble the "q", a counter runs to
// 100, then the q bursts and an ink tile grid dissolves to reveal the hero.
// Shown once per session; never with reduced motion (decided in index.html).
export default function Intro({ onDone }) {
  const { ui } = useT()
  const [phase, setPhase] = useState('from') // from | assemble | out
  const [count, setCount] = useState(0)
  const skipRef = useRef(null)
  const outAt = useRef(0)

  const cells = useMemo(() => {
    const q = marks.q.join('')
    return [...q].map((c, i) => {
      const a = rnd(i, SEED + 0) * Math.PI * 2
      const d = 40 + rnd(i, SEED + 1) * 45
      return {
        on: c === '1',
        fx: `${(Math.cos(a) * d).toFixed(1)}vmax`,
        fy: `${(Math.sin(a) * d).toFixed(1)}vmax`,
        fr: `${Math.round((rnd(i, SEED + 2) - 0.5) * 540)}deg`,
        ox: `${((i % 7) - 3) * (40 + rnd(i, SEED + 3) * 60)}px`,
        oy: `${(Math.floor(i / 7) - 3) * (40 + rnd(i, SEED + 4) * 60)}px`,
        d: `${Math.round(i * 9 + rnd(i, SEED + 5) * 220)}ms`
      }
    })
  }, [])

  const tiles = useMemo(() => {
    const out = []
    let i = 0
    const cx = (TILE_COLS - 1) / 2
    const cy = (TILE_ROWS - 1) / 2
    for (let r = 0; r < TILE_ROWS; r++) {
      for (let c = 0; c < TILE_COLS; c++) {
        const dist = Math.hypot(c - cx, (r - cy) * 1.4)
        out.push(`${Math.round(dist * 34 + rnd(i++, SEED + 6) * 90)}ms`)
      }
    }
    return out
  }, [])

  const goOut = () => {
    if (outAt.current) return
    outAt.current = performance.now()
    setPhase('out')
    document.documentElement.classList.remove('intro-pending')
    window.dispatchEvent(new Event('intro-done'))
    setTimeout(() => {
      try {
        sessionStorage.setItem('introSeen', '1')
      } catch {
        /* ignore */
      }
      onDone()
    }, OUT + 300)
  }
  const goOutRef = useRef(goOut)
  useEffect(() => {
    goOutRef.current = goOut
  })

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase((p) => (p === 'from' ? 'assemble' : p))))
    const t0 = performance.now()
    let countRaf = 0
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ASSEMBLE)
      setCount(Math.round(100 * (1 - Math.pow(1 - k, 2))))
      if (k < 1 && !outAt.current) countRaf = requestAnimationFrame(tick)
    }
    countRaf = requestAnimationFrame(tick)
    const timer = setTimeout(() => goOutRef.current(), ASSEMBLE + HOLD)
    const onKey = (e) => e.key === 'Escape' && goOutRef.current()
    document.addEventListener('keydown', onKey)
    skipRef.current?.focus({ preventScroll: true })
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(countRaf)
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className={`intro is-${phase}`} style={{ '--cell': `${CELL}px`, '--out': `${OUT}ms` }}>
      <div className="intro__tiles" aria-hidden="true" style={{ '--cols': TILE_COLS, '--rows': TILE_ROWS }}>
        {tiles.map((d, i) => (
          <span key={i} style={{ '--d': d }} />
        ))}
      </div>
      <div className="intro__stage" aria-hidden="true">
        <div className="intro__mark">
          {cells.map((c, i) => (
            <span
              key={i}
              className={c.on ? 'is-on' : ''}
              style={{ '--fx': c.fx, '--fy': c.fy, '--fr': c.fr, '--ox': c.ox, '--oy': c.oy, '--d': c.d }}
            />
          ))}
        </div>
        <div className="mono intro__count">{String(count).padStart(3, '0')}</div>
      </div>
      <div className="mono intro__brand" aria-hidden="true">qwertt · portfolio © 2026</div>
      <button type="button" className="mono intro__skip" onClick={() => goOutRef.current()} ref={skipRef}>
        {ui.skipIntro}
      </button>
    </div>
  )
}
