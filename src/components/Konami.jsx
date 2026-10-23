import { useEffect, useMemo, useState } from 'react'
import { useT } from '../content/i18n.jsx'
import { prefersReduced, rnd } from '../lib/motion.js'

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const DURATION = 5000

// Easter egg: ↑↑↓↓←→←→BA rains pink pixels over the page for 5 seconds.
export default function Konami() {
  const { play } = useT()
  const [active, setActive] = useState(0)

  useEffect(() => {
    let pos = 0
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      pos = key === CODE[pos] ? pos + 1 : key === CODE[0] ? 1 : 0
      if (pos === CODE.length) {
        pos = 0
        setActive(Date.now())
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!active) return
    document.documentElement.classList.add('pixel-party')
    const t = setTimeout(() => {
      setActive(0)
      document.documentElement.classList.remove('pixel-party')
    }, DURATION)
    return () => clearTimeout(t)
  }, [active])

  const drops = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: `${(rnd(i, 11) * 100).toFixed(1)}%`,
        size: `${6 + Math.round(rnd(i, 12) * 14)}px`,
        delay: `${Math.round(rnd(i, 13) * 2600)}ms`,
        dur: `${1400 + Math.round(rnd(i, 14) * 1800)}ms`,
        color: ['var(--accent)', 'var(--ink)', '#FF5A1F', '#4ADE80'][Math.floor(rnd(i, 15) * 4)]
      })),
    []
  )

  if (!active) return null
  return (
    <div className="party" key={active}>
      {!prefersReduced() &&
        drops.map((d, i) => (
          <span key={i} aria-hidden="true" style={{ left: d.left, width: d.size, height: d.size, background: d.color, animationDelay: d.delay, animationDuration: d.dur }} />
        ))}
      <p className="mono party__toast" role="status">
        {play.konami}
      </p>
    </div>
  )
}
