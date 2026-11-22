import { useGSAP } from '../../motion/useMotion'
import { useRef } from 'react'
import PunchMark from '../../components/motion/PunchMark'
import { Sheen } from '../../components/Shared'
import { useT } from '../../content/i18n'
import { gsap, MQ } from '../../motion/engine'
import { useNarrow, useReduced, useStatic } from '../../motion/hooks'
import s from './Home.module.css'

const FAN = [
  { x: 150, y: 150, r: -7 },
  { x: 518, y: 118, r: 0 },
  { x: 886, y: 150, r: 7 }
]
const STACK = { x: 518, y: 250, r: 2 }
// FAN x values are laid out for a 1376 px stage (centre card at 518). Place the
// cards around the real centre instead, and pull the side cards in on narrower
// desktops so none of them is cut by the panel edge.
const fanLeft = (x: number) => {
  const off = x - STACK.x
  if (off === 0) return 'calc(50% - 170px)'
  return `calc(50% - 170px ${off < 0 ? '-' : '+'} min(${Math.abs(off)}px, (100% - 340px) / 2 - 32px))`
}

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
  // phones/tablets with motion: the static list becomes a swipeable ticket rail
  const narrow = useNarrow()
  const reduced = useReduced()
  const swipe = narrow && !reduced
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const el = ref.current!
      if (swipe) return swipeRail(el)
      if (isStatic) return
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
    { scope: ref, dependencies: [isStatic, swipe] }
  )
  return (
    <div ref={ref} className={`${s.deck} ${isStatic ? s.deckStatic : ''} ${swipe ? s.deckSwipe : ''}`} aria-label={sv.deckLabel} data-theme="ink">
      <div className={`mono ${s.deckKicker}`}>{sv.deckKicker}</div>
      <div className={`mono ${s.deckTorn}`}>
        <i />
        <i />
        <i />
        {sv.deckTorn}
      </div>
      <div className={s.deckTrack}>
      {sv.cards.map((c, i) => (
        <article key={c.no} className={s.card} style={isStatic ? undefined : { left: fanLeft(FAN[i].x), top: FAN[i].y, transform: `rotate(${FAN[i].r}deg)` }}>
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
    </div>
  )
}

// Phone rail: native horizontal scroll with snap; each card turns in 3D by its
// distance from the centre (cover-flow), the cards deal face-up the first time
// the rail comes into view, and the phone ticks when a new card settles.
function swipeRail(el: HTMLElement) {
  const track = el.querySelector<HTMLElement>(`.${s.deckTrack}`)!
  const cards = gsap.utils.toArray<HTMLElement>(`.${s.card}`, el)
  const floats = cards.map((c) => c.querySelector<HTMLElement>(`.${s.cardFloat}`)!)
  let raf = 0
  let current = -1
  const frame = () => {
    raf = 0
    const mid = track.scrollLeft + track.clientWidth / 2
    let best = 0
    let bestD = Infinity
    cards.forEach((c, i) => {
      const o = (c.offsetLeft + c.offsetWidth / 2 - mid) / c.offsetWidth
      const a = Math.min(1.4, Math.abs(o))
      if (Math.abs(o) < bestD) {
        bestD = Math.abs(o)
        best = i
      }
      gsap.set(floats[i], { rotateY: gsap.utils.clamp(-38, 38, -o * 32), rotate: o * 5, scale: 1 - a * 0.12, y: a * 22, opacity: 1 - a * 0.35 })
    })
    if (best !== current) {
      if (current !== -1 && 'vibrate' in navigator) {
        try {
          navigator.vibrate(6)
        } catch {
          /* ignored */
        }
      }
      current = best
      el.dataset.active = String(best)
    }
  }
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(frame)
  }
  frame()
  track.addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll)

  // deal: face-down → flip → stub tears → INCLUDED stamps, once
  const tl = gsap.timeline({ scrollTrigger: { trigger: track, start: 'top 75%', once: true } })
  cards.forEach((c, i) => {
    const at = i * 0.16
    tl.fromTo(c.querySelector(`.${s.cardInner}`), { rotateY: 180 }, { rotateY: 0, duration: 0.7, ease: 'qw.inOut' }, at)
    tl.from(c.querySelector(`.${s.tearLine}`), { scaleX: 0, transformOrigin: '0 50%', duration: 0.35 }, at + 0.5)
    tl.to(c.querySelector(`.${s.stub}`), { y: 6, rotate: 3, duration: 0.25, ease: 'qw.snap' }, at + 0.7)
    tl.fromTo(c.querySelector(`.${s.included}`), { scale: 1.4, rotate: -16, autoAlpha: 0 }, { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.3, ease: 'qw.snap' }, at + 0.75)
    tl.fromTo(c.querySelector('[data-sheen]'), { xPercent: -130 }, { xPercent: 130, duration: 0.6 }, at + 0.8)
  })
  return () => {
    cancelAnimationFrame(raf)
    track.removeEventListener('scroll', onScroll)
    removeEventListener('resize', onScroll)
  }
}
