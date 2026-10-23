import { Fragment, useEffect, useRef, useState } from 'react'
import { useT } from '../content/i18n.jsx'
import { rnd, useReveal } from '../lib/motion.js'

const GLYPHS = {
  en: '!<>-_/[]{}=+*^?#01ABCDEFGHJKLMNPQRSTUVWXYZ',
  ru: '!<>-_/[]{}=+*^?#01АБВГДЖЗИКЛМНПРСТУФХЦЧШЭЮЯ'
}

// Text that decodes from random glyphs into the real copy when it enters the
// viewport. The real text is always in the DOM for screen readers.
export function Scramble({ text, as: Tag = 'span', className = '', ...rest }) {
  const { lang } = useT()
  const [ref, cls, inView] = useReveal({ threshold: 0.6 })
  const [shown, setShown] = useState(text)
  const ran = useRef(false)

  useEffect(() => {
    if (!inView || ran.current || cls !== 'rv is-in') return
    ran.current = true
    const glyphs = GLYPHS[lang] || GLYPHS.en
    const chars = [...text]
    const total = Math.min(1100, 450 + chars.length * 18)
    const at = chars.map((_, i) => (i / chars.length) * total * 0.65 + rnd(i, 7) * total * 0.35)
    const t0 = performance.now()
    let raf = 0
    let last = 0
    const step = (t) => {
      const e = t - t0
      if (t - last > 45 || e >= total) {
        last = t
        setShown(chars.map((c, i) => (c === ' ' || e >= at[i] ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join(''))
      }
      if (e < total) raf = requestAnimationFrame(step)
      else setShown(text)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, cls, text, lang])

  return (
    <Tag ref={ref} className={`scramble ${cls} ${className}`} {...rest}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown === text ? text : shown}</span>
    </Tag>
  )
}

// Letters fly in from scattered positions and settle into the word. While
// idle the text is plain (keeps kerning); characters exist only while animating.
export function Split({ text, className = '', as: Tag = 'span', stagger = 24, threshold = 0.4, load = false, seed = 3, ...rest }) {
  const [ref, cls] = useReveal({ threshold })
  const [done, setDone] = useState(false)
  const animating = !done && (load || cls === 'rv' || cls === 'rv is-in')

  // After the animation, go back to plain text.
  useEffect(() => {
    if (!load && cls !== 'rv is-in') return
    let t = 0
    const start = () => (t = setTimeout(() => setDone(true), [...text].length * stagger + 1300))
    // The hero waits for the intro overlay before it plays.
    const waiting = load && document.documentElement.classList.contains('intro-pending')
    if (waiting) window.addEventListener('intro-done', start, { once: true })
    else start()
    return () => {
      clearTimeout(t)
      window.removeEventListener('intro-done', start)
    }
  }, [cls, load, text, stagger])

  let n = 0
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={`split ${load ? 'split--load' : cls} ${className}`} {...rest}>
      {animating && <span className="sr-only">{text}</span>}
      {animating
        ? words.map((w, wi) => (
            <Fragment key={wi}>
            <span className="split__w" aria-hidden="true">
              {[...w].map((c) => {
                const i = n++
                return (
                  <span
                    key={i}
                    className="split__c"
                    style={{
                      '--i': i,
                      '--dx': `${((rnd(i, seed) - 0.5) * 0.6).toFixed(2)}em`,
                      '--dy': `${((rnd(i, seed + 1) - 0.5) * 1.6).toFixed(2)}em`,
                      '--rot': `${((rnd(i, seed + 2) - 0.5) * 70).toFixed(0)}deg`,
                      '--stagger': `${stagger}ms`
                    }}
                  >
                    {c}
                  </span>
                )
              })}
            </span>
            {wi < words.length - 1 ? ' ' : null}
            </Fragment>
          ))
        : text}
    </Tag>
  )
}

// Grid of tiles in the section colour that dissolve in a diagonal wave,
// revealing the image underneath. Purely decorative.
export function PixelTiles({ cols = 12, rows = 7, seed = 5 }) {
  const [ref, cls] = useReveal({ threshold: 0.25 })
  const tiles = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      tiles.push(<span key={i} style={{ '--d': `${Math.round((c + r) * 32 + rnd(i, seed) * 160)}ms` }} />)
    }
  }
  return (
    <span ref={ref} className={`tiles ${cls}`} aria-hidden="true" style={{ '--cols': cols, '--rows': rows }}>
      {tiles}
    </span>
  )
}
