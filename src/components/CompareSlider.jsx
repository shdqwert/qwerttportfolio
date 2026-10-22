import { useEffect, useRef, useState } from 'react'
import { compare, images } from '../content/portfolio.js'
import { clamp, prefersReduced } from '../lib/motion.js'

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// F3 — design canvas (clipped layer) over the live build.
export default function CompareSlider() {
  const [pos, setPos] = useState(54)
  const boxRef = useRef(null)
  const touched = useRef(false)
  const hintRaf = useRef(0)
  const dragging = useRef(false)

  const stopHint = () => {
    touched.current = true
    cancelAnimationFrame(hintRaf.current)
  }

  // One-time hint when the slider first enters the viewport: 54 → 30 → 70 → 54
  // (starts from the resting position so there is no jump).
  useEffect(() => {
    const box = boxRef.current
    if (!box || prefersReduced()) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        if (touched.current) return
        const keys = [54, 30, 70, 54]
        const seg = 400
        const t0 = performance.now()
        const step = (t) => {
          if (touched.current) return
          const k = (t - t0) / seg
          const i = Math.min(keys.length - 2, Math.floor(k))
          const local = clamp(k - i)
          setPos(keys[i] + (keys[i + 1] - keys[i]) * ease(local))
          if (k < keys.length - 1) hintRaf.current = requestAnimationFrame(step)
        }
        hintRaf.current = requestAnimationFrame(step)
      },
      { threshold: 0.5 }
    )
    io.observe(box)
    return () => {
      io.disconnect()
      cancelAnimationFrame(hintRaf.current)
    }
  }, [])

  const fromPointer = (e) => {
    const r = boxRef.current.getBoundingClientRect()
    setPos(clamp((e.clientX - r.left) / r.width, 0, 1) * 100)
  }

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    stopHint()
    dragging.current = true
    boxRef.current.setPointerCapture(e.pointerId)
    fromPointer(e)
  }

  const onKeyDown = (e) => {
    const map = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }
    let next = null
    if (e.key in map) next = pos + map[e.key]
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 100
    if (next === null) return
    e.preventDefault()
    stopHint()
    setPos(clamp(next, 0, 100))
  }

  const design = images[compare.design]
  const built = images[compare.built]
  const value = Math.round(pos)

  return (
    <div className="compare">
      <div className="compare__head">
        <div>
          <div className="mono muted">{compare.label}</div>
          <h3 className="compare__title">
            {compare.title[0]}
            <br />
            {compare.title[1]}
          </h3>
        </div>
        <p className="compare__text">{compare.text}</p>
      </div>
      <div
        className="compare__box"
        ref={boxRef}
        style={{ '--pos': `${pos}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <img className="compare__built" src={built.src} width={built.w} height={built.h} alt="qwerttclients home page running as the live React app" loading="lazy" decoding="async" draggable="false" />
        <img className="compare__design" src={design.src} width={design.w} height={design.h} alt="The same qwerttclients home page as a design canvas" loading="lazy" decoding="async" draggable="false" />
        <div className="compare__line" aria-hidden="true" />
        <div
          className="compare__handle"
          role="slider"
          tabIndex={0}
          aria-label="Compare design and live build"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${value}% design`}
          onKeyDown={onKeyDown}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 2 2 8l6 6" /></svg>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m2 2 6 6-6 6" /></svg>
        </div>
        <span className="mono compare__tag compare__tag--design">Design · canvas</span>
        <span className="mono compare__tag compare__tag--built">Live build · React + API</span>
      </div>
    </div>
  )
}
