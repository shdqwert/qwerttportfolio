import { useRef } from 'react'
import { hero, images, owner } from '../content/portfolio.js'
import { clamp, useReducedMotion, useScrollProgress } from '../lib/motion.js'
import BrowserFrame from './BrowserFrame.jsx'
import { ConnectLink } from './ConnectContext.jsx'
import PixelMark from './PixelMark.jsx'

export default function Hero() {
  const reduced = useReducedMotion()
  const areaRef = useRef(null)
  const previewRef = useRef(null)
  const tagRefs = useRef([])

  // While the hero scrolls out: preview scales 1 → 1.04 and drifts up,
  // corner taglines fade out within the first 30% of the hero height.
  const sectionRef = useScrollProgress(
    (_, r) => {
      const out = clamp(-r.top / r.height)
      if (previewRef.current) {
        previewRef.current.style.transform = `translateY(${(-out * r.height * 0.1).toFixed(1)}px) scale(${(1 + out * 0.04).toFixed(4)})`
      }
      const fade = String(1 - clamp(-r.top / (r.height * 0.3)))
      tagRefs.current.forEach((el) => el && (el.style.opacity = fade))
    },
    { enabled: !reduced }
  )

  const img = images.qcHome
  return (
    <section
      id="top"
      className="hero wrap"
      ref={(el) => {
        sectionRef.current = el
        areaRef.current = el
      }}
    >
      <h1 className="hero__title">
        {hero.lines.map((line, i) => (
          <span className="mask" key={line}>
            <span className="hero__line" style={{ '--i': i }}>{line}</span>
          </span>
        ))}
      </h1>
      <div className="hero__mark">
        <PixelMark shape="q" cell={9} draw repelRef={areaRef} />
      </div>
      <p className="hero__name hero__up" style={{ '--i': 0 }}>
        {owner.name} · {owner.role}
      </p>
      <p className="hero__lead hero__up" style={{ '--i': 1 }}>{hero.lead}</p>
      <div className="hero__ctas hero__up" style={{ '--i': 2 }}>
        <a className="btn btn-ink" href="#work">{hero.primary}</a>
        <ConnectLink className="btn btn-line">{hero.secondary}</ConnectLink>
      </div>
      <div className="hero__stage">
        <p className="hero__tag hero__tag--left" ref={(el) => (tagRefs.current[0] = el)}>
          {hero.taglineLeft[0]}
          <br />
          {hero.taglineLeft[1]}
        </p>
        <div className="hero__preview-wrap">
          <div className="hero__preview" ref={previewRef}>
            <BrowserFrame url="qwerttclients.com" className="shot hero__frame">
              <img
                src={img.src}
                width={img.w}
                height={img.h}
                alt="qwerttclients home page: search for restaurants, salons, hotels and sports with available times"
                fetchPriority="high"
                decoding="async"
                className="hero__img"
              />
            </BrowserFrame>
          </div>
        </div>
        <p className="hero__tag hero__tag--right" ref={(el) => (tagRefs.current[1] = el)}>
          {hero.taglineRight[0]} <span aria-hidden="true" className="hero__swap">↔</span>
          <span className="sr-only"> and </span> {hero.taglineRight[1]}
        </p>
      </div>
    </section>
  )
}
