import { useGSAP } from '../../motion/useMotion'
import { useRef } from 'react'
import PunchMark from '../../components/motion/PunchMark'
import { Sheen } from '../../components/Shared'
import { useT } from '../../content/i18n'
import { gsap, MQ } from '../../motion/engine'
import { useStatic } from '../../motion/hooks'
import s from './Home.module.css'

const FAN = [
  { x: 150, y: 150, r: -7 },
  { x: 518, y: 118, r: 0 },
  { x: 886, y: 150, r: 7 }
]
const STACK = { x: 518, y: 250, r: 2 }

function QBack() {
  return (
    <svg width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id="qback" width="40" height="40" patternUnits="userSpaceOnUse">
          <g fill="#111110">
            <rect x="9" y="6" width="12" height="3" />
            <rect x="6" y="9" width="3" height="9" />
            <rect x="21" y="9" width="3" height="9" />
            <rect x="9" y="18" width="15" height="3" />
            <rect x="21" y="21" width="3" height="3" />
            <rect x="21" y="24" width="6" height="3" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#qback)" />
    </svg>
  )
}

// F13 — "Three tickets · one trip", pinned ~250vh. 0–40 %: three face-down
// tickets fan out from a stack. 40–100 %: each flips (rotateY 180) and its
// stub tears: the dashed line draws, the stub drops 6 px / 3°, INCLUDED stamps.
export default function Deck() {
  const { services: sv } = useT()
  const isStatic = useStatic()
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (isStatic) return
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.card}`, el)
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'center center', end: '+=150%', pin: true, anticipatePin: 1, scrub: 0.5 } })
        tl.set({}, {}, 1)
        cards.forEach((c, i) => {
          const f = FAN[i]
          const inner = c.querySelector<HTMLElement>(`.${s.cardInner}`)
          tl.fromTo(c, { x: STACK.x - f.x, y: STACK.y - f.y + 20, rotate: STACK.r }, { x: 0, y: 0, rotate: f.r, duration: 0.32, ease: 'qw.out' }, i * 0.04)
          const at = 0.42 + i * 0.18
          tl.fromTo(inner, { rotateY: 180 }, { rotateY: 0, duration: 0.14, ease: 'qw.inOut' }, at)
          tl.from(c.querySelector(`.${s.tearLine}`), { scaleX: 0, transformOrigin: '0 50%', duration: 0.05 }, at + 0.12)
          tl.to(c.querySelector(`.${s.stub}`), { y: 6, rotate: 3, duration: 0.04, ease: 'qw.snap' }, at + 0.15)
          tl.fromTo(c.querySelector(`.${s.included}`), { scale: 1.25, rotate: -14, autoAlpha: 0 }, { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.03, ease: 'qw.snap' }, at + 0.16)
          tl.fromTo(c.querySelector('[data-sheen]'), { xPercent: -130 }, { xPercent: 130, duration: 0.08 }, at + 0.17)
        })
      })
      // hover: lift 10 px, straighten, tilt to pointer ≤ 6°
      mm.add(MQ.fine, () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.card}`, el)
        const offs = cards.map((c, i) => {
          const face = c.querySelector<HTMLElement>(`.${s.cardFloat}`)!
          const move = (e: PointerEvent) => {
            const r = face.getBoundingClientRect()
            gsap.to(face, { y: -10, rotate: -FAN[i].r, rotateY: ((e.clientX - r.left) / r.width - 0.5) * 12, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 12, duration: 0.4, overwrite: 'auto' })
          }
          const leave = () => gsap.to(face, { y: 0, rotate: 0, rotateX: 0, rotateY: 0, duration: 0.5, ease: 'qw.out' })
          c.addEventListener('pointermove', move)
          c.addEventListener('pointerleave', leave)
          return () => {
            c.removeEventListener('pointermove', move)
            c.removeEventListener('pointerleave', leave)
          }
        })
        return () => offs.forEach((f) => f())
      })
    },
    { scope: ref, dependencies: [isStatic] }
  )
  return (
    <div ref={ref} className={`${s.deck} ${isStatic ? s.deckStatic : ''}`} aria-label={sv.deckLabel} data-theme="ink">
      <div className={`mono ${s.deckKicker}`}>{sv.deckKicker}</div>
      <div className={`mono ${s.deckTorn}`}>
        <i />
        <i />
        <i />
        {sv.deckTorn}
      </div>
      {!isStatic && (
        <div className={s.deckBack} aria-hidden="true">
          <div className={s.deckBackIn}>
            <QBack />
          </div>
        </div>
      )}
      {sv.cards.map((c, i) => (
        <article key={c.no} className={s.card} style={isStatic ? undefined : { left: FAN[i].x, top: FAN[i].y, transform: `rotate(${FAN[i].r}deg)` }}>
          <div className={s.cardFloat}>
            <div className={s.cardInner}>
              <div className={s.cardFace}>
                <Sheen />
                <div className={s.cardTop}>
                  <div>
                    <div className="mono muted">{c.no}</div>
                    <h3 className={s.cardTitle}>{c.title}</h3>
                  </div>
                  <PunchMark shape={c.icon} cell={5} color="var(--ink)" />
                </div>
                <p className={s.cardText}>{c.text}</p>
                <ul className={s.cardItems}>
                  {c.items.map((it) => (
                    <li key={it} className="mono">
                      <b>+</b>
                      {it}
                    </li>
                  ))}
                </ul>
                <div className={s.stub}>
                  <div className={s.tearLine} aria-hidden="true">
                    <span />
                    <span />
                  </div>
                  <div className={s.stubRow}>
                    <div>
                      <div className="mono muted">
                        {sv.admit} · {c.no}
                      </div>
                      <div className={s.stubTitle}>{c.title}</div>
                    </div>
                    <span className={s.included}>{sv.stamp}</span>
                  </div>
                </div>
              </div>
              <div className={s.cardBack} aria-hidden="true">
                <div className={s.deckBackIn}>
                  <QBack />
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
