import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { useNav } from '../app/Nav'
import type { FinaleCfg } from '../content/en'
import { useT } from '../content/i18n'
import type { RouteKey } from '../content/lang'
import { gsap, MQ } from '../motion/engine'
import { Arrow, Img } from './Common'
import Magnetic from './motion/Magnetic'
import { FlapText } from './motion/SplitFlap'
import s from './Finale.module.css'


// F26 — Departure finale. Scroll-scrubbed (top 75% → bottom 60%, scrub 1.2),
// not pinned; windows cycle real shots on a time loop while in view.
export default function Finale({ page }: { page: RouteKey }) {
  const t = useT()
  const cfg: FinaleCfg = t.finale[page]
  const { openConnect } = useNav()
  const ref = useRef<HTMLDivElement>(null)
  const [word, setWord] = useState(cfg.flap.length - 1)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const block = root.querySelector<HTMLElement>(`.${s.fin}`)!
        const lines = gsap.utils.toArray<HTMLElement>(`.${s.line}`, root)
        const wins = gsap.utils.toArray<HTMLElement>(`.${s.win}`, root)
        const arrow = root.querySelector<SVGPathElement>(`.${s.arrow} path`)
        const spot = root.querySelector<HTMLElement>(`.${s.spot}`)
        setWord(0)
        let lastIdx = 0
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: block,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 1.2,
            onUpdate: (self) => {
              const idx = Math.min(cfg.flap.length - 1, Math.floor((Math.min(self.progress, 0.15) / 0.15) * (cfg.flap.length - 1)))
              if (idx !== lastIdx) {
                lastIdx = idx
                setWord(idx)
              }
            }
          }
        })
        tl.set({}, {}, 1) // timeline length = 1 (progress units)
        lines.forEach((l, i) => {
          tl.fromTo(l, { x: i % 2 ? 160 : -140, opacity: 0.25 }, { x: 0, opacity: 1, duration: 0.5, ease: 'qw.out' }, 0.05 + i * 0.08)
        })
        if (spot) {
          lines.forEach((l, i) => tl.to(spot, { y: () => l.offsetTop + l.offsetHeight / 2 - 150, duration: 0.12 }, 0.05 + i * 0.08))
        }
        wins.forEach((w, i) => {
          const tilt = Number(w.dataset.tilt || 0)
          tl.fromTo(w, { clipPath: 'inset(0% 50% 0% 50% round 12px)', rotate: 0, scale: 0.9 }, { clipPath: 'inset(0% 0% 0% 0% round 12px)', rotate: tilt, scale: 1, duration: 0.4, ease: 'qw.inOut' }, 0.2 + i * 0.05)
          tl.fromTo(w.querySelector(`.${s.bloom}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3 + i * 0.05)
        })
        if (arrow) tl.fromTo(arrow, { strokeDashoffset: 240 }, { strokeDashoffset: 0, duration: 0.25 }, 0.5)

        // Windows flip through 3 real images every 2.6 s, only while in view.
        const cycles = wins.map((w) => {
          const imgs = gsap.utils.toArray<HTMLElement>('img', w)
          const c = gsap.timeline({ repeat: -1, paused: true })
          imgs.forEach((img, k) => {
            const next = imgs[(k + 1) % imgs.length]
            c.to(img, { autoAlpha: 0, duration: 0.6 }, k * 2.6 + 2)
            c.fromTo(next, { autoAlpha: 0, scale: 1.12, yPercent: 0 }, { autoAlpha: 1, scale: 1, yPercent: -4, duration: 2.6, ease: 'power1.out' }, k * 2.6 + 2)
          })
          gsap.set(imgs.slice(1), { autoAlpha: 0 })
          return c
        })
        const arrowIdle = arrow ? gsap.to(root.querySelector(`.${s.arrow}`), { x: 6, duration: 0.4, repeat: -1, yoyo: true, repeatDelay: 1.6, ease: 'sine.inOut', paused: true }) : null
        gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => {
              cycles.forEach((c) => (self.isActive ? c.play() : c.pause()))
              if (arrowIdle) {
                if (self.isActive) arrowIdle.play()
                else arrowIdle.pause()
              }
            }
          }
        })
        // Hover: windows straighten and grow, arrow moves +14 px.
        const enter = () => {
          gsap.to(wins, { rotate: 0, scale: 1.05, duration: 0.5, overwrite: 'auto' })
          gsap.to(root.querySelector(`.${s.arrowWrap}`), { x: 14, duration: 0.4 })
        }
        const leave = () => {
          wins.forEach((w) => gsap.to(w, { rotate: Number(w.dataset.tilt || 0), scale: 1, duration: 0.5, overwrite: 'auto' }))
          gsap.to(root.querySelector(`.${s.arrowWrap}`), { x: 0, duration: 0.4 })
        }
        block.addEventListener('pointerenter', enter)
        block.addEventListener('pointerleave', leave)
        return () => {
          block.removeEventListener('pointerenter', enter)
          block.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: ref, dependencies: [page, t.lang] }
  )

  return (
    <div ref={ref} className={s.finale}>
      <div className={s.vignette} aria-hidden="true" />
      <div className={`mono ${s.call}`}>
        <span className={s.callDot} aria-hidden="true" />
        <span>{t.finale.finalCall}</span>
        <span className={s.sep}>·</span>
        <span>{t.finale.destination}</span>
        <span className={s.flap}>
          <FlapText text={cfg.flap[word]} run seed={word + 4} />
        </span>
      </div>
      <a
        className={s.fin}
        href="#connect"
        data-cursor="board"
        onClick={(e) => {
          e.preventDefault()
          openConnect()
        }}
      >
        <span className={s.spot} aria-hidden="true" />
        <span className={s.head}>
          {cfg.lines.map((l, i) => (
            <span key={i} className={s.line} style={{ paddingLeft: cfg.indents[i] }}>
              {'note' in l && l.note && <span className={`mono ${s.note}`}>{l.note}</span>}
              {l.a}
              {'win' in l && l.win && (
                <span className={s.win} data-tilt={l.win.tilt} style={{ width: l.win.w, height: l.win.h, transform: `rotate(${l.win.tilt}deg)` }} aria-hidden="true">
                  {l.win.imgs.map((k, j) => (
                    <Img key={k + j} k={k} alt="" sizes="260px" style={{ objectPosition: l.win!.pos }} />
                  ))}
                  <span className={`mono ${s.tag}`}>{l.win.tag}</span>
                  <span className={s.rim} />
                  <span className={s.bloom} />
                </span>
              )}
              {'b' in l && l.b}
              {'arrow' in l && l.arrow && (
                <span className={s.arrowWrap}>
                  <Magnetic max={14}>
                    <Arrow className={s.arrow} />
                  </Magnetic>
                </span>
              )}
            </span>
          ))}
        </span>
      </a>
    </div>
  )
}
