import { useEffect, useRef } from 'react'
import { useT } from '../content/i18n'
import { gsap, lockScroll, unlockScroll } from '../motion/engine'
import { Img, MouseIcon } from './Common'
import s from './Intro.module.css'

const WORD = 'QWERTT'
const POSTERS = [
  { k: 'lab/dune-poster', x: -34, y: 4, r: -14 },
  { k: 'lab/inter-poster', x: 0, y: -6, r: 0 },
  { k: 'lab/incep-poster', x: 34, y: 4, r: 14 }
] as const
// how far the wheel has to travel for the whole show, in screens
const SCREENS = 3.2

// First visit: a cinema premiere that only moves when the visitor scrolls.
// Scroll drives a paused timeline (back scroll rewinds it): film-leader
// countdown 3-2-1 → the leader blinks out → curtains part under a projector
// beam → posters fly in from depth → the wordmark assembles letter by letter →
// the camera flies into the glowing screen, which becomes the page itself.
// Skipped with reduced motion, deep links or ?nointro (decided in index.html).
export default function Intro({ onDone }: { onDone: () => void }) {
  const { intro, ui } = useT()
  const root = useRef<HTMLDivElement>(null)
  const finish = useRef<(fast?: boolean) => void>(() => {})

  useEffect(() => {
    const el = root.current!
    const q = <T extends Element = HTMLElement>(c: string) => el.querySelector<T & HTMLElement>(`.${c}`)!
    const qa = (c: string) => gsap.utils.toArray<HTMLElement>(`.${c}`, el)
    lockScroll()

    const digit = q(s.digit)
    const sweep = q(s.sweep)
    const screen = q(s.screen)
    const fill = q(s.progress).firstElementChild as HTMLElement
    const posters = qa(s.poster)
    const letters = qa(s.letter)
    const proxy = { a: 0 }
    let shown = 3

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
    tl.set({}, {}, 1)
    // 1 — leader countdown: three sweeps, the digit steps 3 → 2 → 1
    tl.to(proxy, {
      a: 3,
      duration: 0.24,
      onUpdate: () => {
        const a = Math.min(proxy.a, 2.999)
        sweep.style.setProperty('--a', `${(a % 1) * 360}deg`)
        const d = 3 - Math.floor(a)
        if (d !== shown) {
          shown = d
          digit.textContent = String(d)
          gsap.fromTo(digit, { scale: 1.25, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'qw.out' })
        }
      }
    }, 0)
    tl.to(q(s.leaderRing), { rotate: 180, duration: 0.24 }, 0)
    // the leader switches off like an old projector: line, then a dot
    tl.to(q(s.leader), { scaleY: 0.004, duration: 0.035, ease: 'power3.in' }, 0.24)
    tl.to(q(s.leader), { scaleX: 0, duration: 0.025, ease: 'power3.in' }, 0.275)
    tl.fromTo(q(s.flash), { opacity: 0 }, { opacity: 0.85, duration: 0.012 }, 0.295)
    tl.to(q(s.flash), { opacity: 0, duration: 0.05 }, 0.307)
    // 2 — curtains part, the projector beam warms up
    tl.to(q(s.curtainL), { xPercent: -102, skewY: -2, duration: 0.17, ease: 'power2.inOut' }, 0.3)
    tl.to(q(s.curtainR), { xPercent: 102, skewY: 2, duration: 0.17, ease: 'power2.inOut' }, 0.3)
    tl.fromTo(q(s.beam), { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.1, ease: 'power2.out' }, 0.33)
    // 3 — posters fly out of the dark, in depth
    posters.forEach((p, i) => {
      const c = POSTERS[i]
      tl.fromTo(
        p,
        { z: -2200, xPercent: -50 + c.x * 0.2, yPercent: -50, rotateY: c.r * -3, opacity: 0 },
        { z: 0, xPercent: -50 + c.x * 4.2, yPercent: -50 + c.y, rotateY: c.r, opacity: 1, duration: 0.16, ease: 'power3.out' },
        0.41 + i * 0.025
      )
    })
    // 4 — posters step back, the wordmark assembles letter by letter
    tl.to(posters, { z: -700, opacity: 0.32, filter: 'blur(3px)', duration: 0.12 }, 0.6)
    tl.fromTo(
      letters,
      { yPercent: 120, rotateX: -95, opacity: 0, filter: 'blur(10px)' },
      { yPercent: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)', duration: 0.09, stagger: 0.014, ease: 'power3.out' },
      0.6
    )
    tl.fromTo(q(s.presents), { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.24em', duration: 0.1 }, 0.66)
    // 5 — fly into the screen: it glows, everything rushes past, it fills the view
    tl.fromTo(screen, { opacity: 0, scale: 0.18 }, { opacity: 1, scale: 0.34, duration: 0.05 }, 0.86)
    tl.to(q(s.title), { scale: 2.6, z: 400, opacity: 0, filter: 'blur(6px)', duration: 0.1, ease: 'power2.in' }, 0.78)
    tl.to(posters, { xPercent: (i) => [-260, -50, 160][i], scale: 1.8, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0.8)
    tl.to(q(s.beam), { opacity: 0, duration: 0.08 }, 0.82)
    tl.to(screen, { scale: () => Math.max(innerWidth / screen.offsetWidth, innerHeight / screen.offsetHeight) * 1.08, borderRadius: 0, duration: 0.12, ease: 'power2.in' }, 0.88)

    // wheel / touch / keys move a target; the playhead eases toward it
    let target = 0
    let current = 0
    let done = false
    const push = (d: number) => {
      if (done) return
      target = gsap.utils.clamp(0, 1, target + d)
    }
    const span = () => innerHeight * SCREENS
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      push((e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY) / span())
    }
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const y = e.touches[0].clientY
      push(((touchY - y) * 1.6) / span())
      touchY = y
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return finish.current(true)
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) (e.preventDefault(), push(0.07))
      if (['ArrowUp', 'PageUp'].includes(e.key)) (e.preventDefault(), push(-0.07))
    }
    const tick = () => {
      if (done) return
      current += (target - current) * 0.09
      if (Math.abs(target - current) < 0.0004) current = target
      tl.progress(current)
      fill.style.transform = `scaleX(${current})`
      el.classList.toggle(s.started, current > 0.015)
      if (current >= 0.999) finish.current()
    }
    gsap.ticker.add(tick)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('keydown', onKey)

    const cleanup = () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('keydown', onKey)
    }
    finish.current = (fast = false) => {
      if (done) return
      done = true
      cleanup()
      // swallow the wheel's momentum, so the page does not jump past the hero;
      // the page unlocks once the reveal has played and the wheel is quiet
      let quiet = 0
      const settle = () => {
        window.removeEventListener('wheel', hold)
        unlockScroll()
      }
      const hold = (e: WheelEvent) => {
        e.preventDefault()
        clearTimeout(quiet)
        quiet = window.setTimeout(settle, 450)
      }
      window.addEventListener('wheel', hold, { passive: false })
      quiet = window.setTimeout(settle, 700)
      document.documentElement.classList.remove('intro-pending')
      window.dispatchEvent(new Event('intro-done'))
      try {
        sessionStorage.setItem('introSeen', '1')
      } catch {
        /* ignore */
      }
      // the screen is paper-coloured, so fading the overlay reveals the hero seamlessly
      gsap.to(el, { autoAlpha: 0, duration: fast ? 0.45 : 0.6, ease: 'power1.out', onComplete: onDone })
    }
    return () => {
      if (!done) {
        cleanup()
        unlockScroll()
      }
      tl.kill()
    }
  }, [onDone])

  return (
    <div ref={root} className={s.intro}>
      <div className={s.stage} aria-hidden="true">
        <span className={s.beam}>
          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} style={{ left: `${(i * 41) % 100}%`, top: `${(i * 67) % 100}%`, animationDelay: `${-i * 0.5}s` }} />
          ))}
        </span>
        <div className={s.posters}>
          {POSTERS.map((p) => (
            <span key={p.k} className={s.poster}>
              <Img k={p.k} alt="" sizes="260px" eager />
            </span>
          ))}
        </div>
        <span className={s.screen} />
        <div className={s.title}>
          <span className={s.word}>
            {[...WORD].map((c, i) => (
              <span key={i} className={s.letter}>
                {c}
              </span>
            ))}
          </span>
          <span className={`mono ${s.presents}`}>{intro.presents}</span>
        </div>
        <span className={s.curtainL} />
        <span className={s.curtainR} />
        <div className={s.leader}>
          <span className={s.sweep} />
          <span className={s.leaderRing} />
          <span className={s.cross} />
          <span className={s.digit}>3</span>
          <span className={`mono ${s.leaderLabel}`}>{intro.leader}</span>
        </div>
        <span className={s.flash} />
        <span className={s.grain} />
      </div>
      <div className={`mono ${s.hint}`} aria-hidden="true">
        <MouseIcon />
        <span>{intro.hint}</span>
      </div>
      <span className={s.progress} aria-hidden="true">
        <span />
      </span>
      <span className={`mono ${s.brand}`} aria-hidden="true">
        {intro.brand}
      </span>
      <button type="button" className={`mono ${s.skip}`} onClick={() => finish.current(true)}>
        {ui.skipIntro}
      </button>
    </div>
  )
}
