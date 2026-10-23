import { useEffect, useRef, useState, type RefObject } from 'react'
import { useT } from '../content/i18n'
import { flightText } from '../content/pages/flight'
import { gsap, MQ, ScrollTrigger } from '../motion/engine'
import { useMediaQuery, useStatic } from '../motion/hooks'
import { useGSAP } from '../motion/useMotion'
import { FlapText } from './motion/SplitFlap'
import s from './BoardingFlight.module.css'

type Props = {
  page: 'kino' | 'qc'
  video: string
  poster: string
  /** empty placeholder the card starts from (reserves its space, 16/10) */
  startRef: RefObject<HTMLElement | null>
  /** element whose top starts the flight (hero for kino, this section for qc) */
  triggerRef?: RefObject<HTMLElement | null>
  start?: string
  eager?: boolean
}

// F27 — boarding flight: a small boarding-pass preview flies (FLIP, scrubbed)
// from its start slot into a landing mat, tilting in mid-air and with scroll
// velocity; the screen is a real muted screen recording. The figure lives in
// its landing slot; only transform/opacity animate. Static (reduced motion,
// < 1024 px, coarse pointer): card in place, poster + Play, stamp shown.
export default function BoardingFlight({ page, video, poster, startRef, triggerRef, start = 'top top', eager }: Props) {
  const { lang } = useT()
  const f = flightText[lang]
  const p = f[page]
  const still = useStatic()
  const coarse = useMediaQuery(MQ.coarse)
  const isStatic = still || coarse
  const ref = useRef<HTMLDivElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => setPhase(isStatic ? 2 : 0), [isStatic])

  useGSAP(
    () => {
      if (isStatic) return
      const el = ref.current!
      const slot = el.querySelector<HTMLElement>(`.${s.slot}`)!
      const fly = el.querySelector<HTMLElement>(`.${s.fly}`)!
      const tilt = el.querySelector<HTMLElement>(`.${s.tilt}`)!
      const sheen = el.querySelector<HTMLElement>(`.${s.sheen}`)!
      const stamp = el.querySelector<HTMLElement>(`.${s.stamp}`)!
      const path = el.querySelector<SVGPathElement>(`.${s.path} path`)!
      const mat = el.querySelector<HTMLElement>(`.${s.mat}`)!
      const trigger = triggerRef?.current || el
      // FLIP offsets, measured on refresh from the two untransformed slots
      const d = { x: 0, y: 0, s: 1 }
      const measure = () => {
        const a = startRef.current?.getBoundingClientRect()
        const b = slot.getBoundingClientRect()
        const w = el.getBoundingClientRect()
        if (!a || !b.width) return
        d.x = a.left - b.left
        d.y = a.top - b.top
        d.s = a.width / b.width
        const sx = a.left + a.width / 2 - w.left
        const sy = a.top + a.height / 2 - w.top
        const ex = b.left + b.width / 2 - w.left
        const ey = b.top + b.height / 2 - w.top
        path.setAttribute('d', `M${sx} ${sy} C${sx + 60} ${sy + (ey - sy) * 0.55} ${ex + 108} ${ey - 80} ${ex} ${ey}`)
      }
      measure()
      gsap.set(fly, { transformOrigin: '0 0', transformPerspective: 1800 })
      gsap.set(tilt, { transformPerspective: 1800, transformOrigin: '50% 50%' })
      let last = -1
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger,
          start,
          endTrigger: mat,
          end: 'center center',
          scrub: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onToggle: (self) => (fly.style.willChange = self.isActive ? 'transform' : ''),
          onUpdate: (self) => {
            const ph = self.progress < 0.08 ? 0 : self.progress < 0.95 ? 1 : 2
            if (ph !== last) setPhase((last = ph))
          }
        }
      })
      tl.fromTo(fly, { x: () => d.x, y: () => d.y, scale: () => d.s }, { x: 0, y: 0, scale: 1, ease: 'qw.inOut', duration: 1 }, 0)
        .to(tilt, { keyframes: { rotateX: [0, 5, 0], rotateZ: [0, -1.4, 0] }, duration: 1 }, 0)
        .to(fly, { keyframes: { rotateY: [0, -6, 0] }, duration: 1 }, 0)
        .fromTo(path, { strokeDashoffset: 1, opacity: 0.7 }, { strokeDashoffset: 0, ease: 'qw.inOut', duration: 0.85 }, 0.05)
        .to(path, { opacity: 0, duration: 0.08 }, 0.92)
        .fromTo(sheen, { xPercent: -130 }, { xPercent: 130, duration: 0.45 }, 0.25)
        .fromTo(stamp, { autoAlpha: 0, scale: 1.3, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: -4, ease: 'qw.snap', duration: 0.08 }, 0.92)
        .to(document.querySelectorAll(`.${s.hint}`), { autoAlpha: 0, duration: 0.15 }, 0.1)
      // velocity tilt on the inner wrapper, springs back when scrolling stops
      const tiltTo = gsap.quickTo(tilt, 'rotateY', { duration: 0.6, ease: 'power3.out' })
      let rest: gsap.core.Tween | null = null
      const vel = ScrollTrigger.create({
        trigger,
        start,
        endTrigger: mat,
        end: 'bottom top',
        onUpdate: (self) => {
          tiltTo(gsap.utils.clamp(-4, 4, self.getVelocity() / -400))
          rest?.kill()
          rest = gsap.delayedCall(0.15, () => tiltTo(0))
        }
      })
      return () => {
        rest?.kill()
        vel.kill()
      }
    },
    { scope: ref, dependencies: [isStatic] }
  )

  // play only within about a viewport; static mode waits for the Play button
  useEffect(() => {
    const v = vid.current
    if (!v || isStatic) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { rootMargin: '100% 0px' })
    io.observe(v)
    return () => io.disconnect()
  }, [isStatic])

  const play = () => {
    vid.current?.play().then(() => setPlaying(true), () => {})
  }

  return (
    <div ref={ref} className={`${s.flight} ${isStatic ? s.static : ''}`}>
      <svg className={s.path} aria-hidden="true">
        <path pathLength={1} />
      </svg>
      <div className={s.mat}>
        <span className={`mono ${s.label} ${s.labelL}`} aria-hidden="true">
          {p.landing}
        </span>
        <span className={`mono ${s.label} ${s.labelR}`} aria-hidden="true">
          {f.rec}
        </span>
        <div className={s.slot}>
          <figure className={s.fly}>
            <div className={s.tilt}>
              <div className={s.card}>
                <img src={poster} alt="" width={960} height={600} loading={eager ? 'eager' : 'lazy'} {...(eager ? { fetchPriority: 'high' as const } : {})} />
                <video ref={vid} src={video} poster={poster} muted loop playsInline preload="metadata" aria-label={p.alt} />
                <span className={s.sheen} aria-hidden="true" />
                {isStatic && !playing && (
                  <button type="button" className={`mono ${s.play}`} onClick={play}>
                    {f.play}
                  </button>
                )}
              </div>
              <span className={`mono ${s.tag}`} aria-hidden="true">
                <b>{p.seat}</b>
                <i>
                  <FlapText text={f.states[phase]} run={!isStatic} />
                </i>
              </span>
            </div>
          </figure>
        </div>
        <div className={s.stamp} aria-hidden="true">
          {f.stamp}
        </div>
      </div>
    </div>
  )
}

