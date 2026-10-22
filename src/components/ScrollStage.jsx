import { useEffect, useMemo, useRef, useState } from 'react'
import { images } from '../content/portfolio.js'
import { NARROW, clamp, onScrollFrame, useMediaQuery, useReducedMotion } from '../lib/motion.js'
import BrowserFrame from './BrowserFrame.jsx'

// Groups consecutive chapters that share one screenshot: the image scrolls
// continuously across all of them.
function toSegments(chapters) {
  const segs = []
  chapters.forEach((c, i) => {
    const last = segs[segs.length - 1]
    if (last && last.img === c.img) last.end = i
    else segs.push({ img: c.img, alt: c.alt, start: i, end: i })
  })
  return segs
}

function MouseIcon({ dark }) {
  return (
    <svg width="22" height="32" viewBox="0 0 22 32" fill="none" stroke={dark ? '#F9F4EC' : '#0A0A0A'} strokeWidth="1.6" aria-hidden="true">
      <rect x="1" y="1" width="20" height="30" rx="10" />
      <line x1="11" y1="7" x2="11" y2="12" className="stage__wheel" />
    </svg>
  )
}

// F1 / F2 — pinned, scroll-linked product walkthrough. The page scrolls
// natively; the stage is position: sticky and only reads scroll progress.
export default function ScrollStage({ stage, dark = false }) {
  const reduced = useReducedMotion()
  const narrow = useMediaQuery(NARROW)
  const segments = useMemo(() => toSegments(stage.chapters), [stage.chapters])
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const stickyRef = useRef(null)
  const viewRef = useRef(null)
  const imgRefs = useRef([])
  const barRefs = useRef([])
  const thumbRef = useRef(null)
  const calloutRefs = useRef([])
  const n = stage.chapters.length
  const isStatic = reduced || narrow

  useEffect(() => {
    if (isStatic) return
    return onScrollFrame(() => {
      const track = trackRef.current
      const sticky = stickyRef.current
      const view = viewRef.current
      if (!track || !sticky || !view) return
      const r = track.getBoundingClientRect()
      const top = parseFloat(getComputedStyle(sticky).top) || 0
      const travel = r.height - sticky.offsetHeight
      const p = travel > 0 ? clamp((top - r.top) / travel) : 0

      const f = p * n
      const idx = Math.min(n - 1, Math.floor(f))
      const local = clamp(f - idx)
      setActive(idx)

      const vw = view.clientWidth
      const vh = view.clientHeight
      segments.forEach((seg, s) => {
        const el = imgRefs.current[s]
        if (!el) return
        const im = images[seg.img]
        const h = (vw * im.h) / im.w
        const len = seg.end - seg.start + 1
        const segP = clamp((f - seg.start) / len)
        el.style.transform = `translate3d(0, ${(-(h - vh) * segP).toFixed(1)}px, 0)`
      })

      barRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${i === idx ? local.toFixed(3) : i < idx ? 1 : 0})`
      })

      const thumb = thumbRef.current
      if (thumb) {
        const room = thumb.parentElement.clientHeight - thumb.offsetHeight
        thumb.style.transform = `translateY(${(room * p).toFixed(1)}px)`
      }

      stage.callouts.forEach((c, i) => {
        const el = calloutRefs.current[i]
        if (!el) return
        const fadeIn = clamp((p - c.from) / 0.03)
        const fadeOut = clamp((c.to - p) / 0.03)
        const o = Math.min(fadeIn, fadeOut)
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translateY(${((1 - o) * 8).toFixed(1)}px)`
      })
    })
  }, [isStatic, n, segments, stage.callouts])

  if (isStatic) {
    return (
      <div className={`stage-static${dark ? ' is-dark' : ''}`} aria-label={stage.label} role="group">
        <span className="mono stage__label">{stage.railLabel}</span>
        <ol className="stage-static__list">
          {stage.chapters.map((c, i) => {
            const im = images[c.img]
            return (
              <li key={c.t} className="stage-static__item">
                <BrowserFrame url={stage.url} dark={dark} className="stage-static__frame">
                  <img src={im.src} width={im.w} height={im.h} alt={c.alt} loading="lazy" decoding="async" />
                </BrowserFrame>
                <div className="stage-static__text">
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="stage__chapter-title">{c.t}</div>
                    <p className="stage__chapter-text">{c.d}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  const activeSeg = segments.findIndex((s) => active >= s.start && active <= s.end)

  return (
    <div className={`stage-track${dark ? ' is-dark' : ''}`} ref={trackRef} role="group" aria-label={stage.label}>
      <div className="stage" ref={stickyRef}>
        <BrowserFrame url={stage.url} dark={dark} className="stage__browser" viewportRef={viewRef} viewportClass="stage__view">
          {segments.map((seg, s) => {
            const im = images[seg.img]
            return (
              <img
                key={seg.start}
                ref={(el) => (imgRefs.current[s] = el)}
                src={im.src}
                width={im.w}
                height={im.h}
                alt={s === activeSeg ? seg.alt : ''}
                aria-hidden={s === activeSeg ? undefined : 'true'}
                loading="lazy"
                decoding="async"
                className={`stage__img${s === activeSeg ? ' is-active' : ''}`}
              />
            )
          })}
          {stage.callouts.map((c, i) => (
            <div key={c.text} className="callout" style={{ left: c.x, top: c.y }} ref={(el) => (calloutRefs.current[i] = el)}>
              <span className="callout__dot" aria-hidden="true" />
              <span className="callout__label">{c.text}</span>
            </div>
          ))}
          <div className="stage__scrollbar" aria-hidden="true">
            <span ref={thumbRef} />
          </div>
        </BrowserFrame>
        <div className="stage__rail">
          <span className="mono stage__label">{stage.railLabel}</span>
          <ol className="stage__chapters">
            {stage.chapters.map((c, i) => (
              <li key={c.t} className={`stage__chapter${i === active ? ' is-active' : ''}`} aria-current={i === active ? 'step' : undefined}>
                <span className="mono stage__no">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="stage__chapter-title">{c.t}</div>
                  <div className="stage__chapter-more">
                    <div className="stage__chapter-inner">
                      <p className="stage__chapter-text">{c.d}</p>
                      <div className="stage__bar">
                        <span ref={(el) => (barRefs.current[i] = el)} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="stage__hint">
            <MouseIcon dark={dark} />
            <span>
              Keep scrolling — the site moves,
              <br />
              the page stays.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
