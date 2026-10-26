import { useGSAP } from '../motion/useMotion'
import { useEffect, useRef, useState } from 'react'
import { whenStageReady } from '../app/Nav'
import { Img, MaybeLink } from '../components/Common'
import Marquee from '../components/motion/Marquee'
import PunchMark from '../components/motion/PunchMark'
import PageEnd, { CabinLight, NextDepartures, SeatTag } from '../components/PageEnd'
import { useT } from '../content/i18n'
import { useKinoText } from '../content/pages/kino'
import { links } from '../content/shared'
import { gsap, MQ, SplitText } from '../motion/engine'
import s from './CaseKino.module.css'

export default function CaseKino() {
  const t = useT()
  const k = useKinoText()
  const ref = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(0)

  // Hero: title rises per line, tagline words appear one per line, the intro
  // media opens like a cinema curtain with a projector beam (L10).
  useGSAP(
    () => {
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, (context) => {
        const tl = gsap.timeline({ paused: true })
        let split: SplitText | null = null
        let off = () => {}
        document.fonts.ready.then(() => context.add(() => {
        split = SplitText.create(el.querySelector('h1'), { type: 'lines', mask: 'lines', aria: 'none' })
        tl.from(split.lines, { yPercent: 105, duration: 0.9, ease: 'qw.out' }, 0.1)
        tl.from(el.querySelectorAll(`.${s.tagline} span`), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.12 }, 0.4)
        tl.from(el.querySelector(`.${s.heroMedia}`), { autoAlpha: 0, scale: 0.94, y: 30, duration: 1.1, ease: 'qw.out' }, 0.3)
        tl.from(el.querySelector(`.${s.viewSite}`), { y: 16, autoAlpha: 0, duration: 0.6 }, 0.9)
        el.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('revealed'))
        off = whenStageReady(() => tl.play())
        }))
        // beam parallax with the pointer
        const beam = el.querySelector<HTMLElement>(`.${s.beam}`)
        const qx = beam ? gsap.quickTo(beam, 'x', { duration: 0.8 }) : null
        const move = (e: PointerEvent) => qx?.((e.clientX / innerWidth - 0.5) * 30)
        window.addEventListener('pointermove', move, { passive: true })
        // panels: inner image drifts 0 → 6 % while it crosses the viewport
        gsap.utils.toArray<HTMLElement>(`.${s.panel}`, el).forEach((p) => {
          const im = p.querySelector('img')
          const base = Number(p.dataset.pos || 0)
          if (im) gsap.fromTo(im, { objectPosition: `50% ${base}%` }, { objectPosition: `50% ${base + 6}%`, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: 0.5 } })
          gsap.fromTo(p, { clipPath: 'inset(8% 0% 8% 0% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', ease: 'qw.out', duration: 1, scrollTrigger: { trigger: p, start: 'top 85%', once: true } })
        })
        gsap.from(el.querySelectorAll(`.${s.fixed} li`), { x: -16, autoAlpha: 0, stagger: 0.1, duration: 0.5, scrollTrigger: { trigger: `.${s.fixed}`, start: 'top 85%', once: true } })
        return () => {
          off()
          split?.revert()
          window.removeEventListener('pointermove', move)
        }
      })
    },
    { scope: ref }
  )

  // each credit row lights up when its paired panel is centred
  useEffect(() => {
    const panels = ref.current?.querySelectorAll(`.${s.panel}`)
    if (!panels) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setLit(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -54% 0px' }
    )
    panels.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={s.page}>
      <SeatTag seat={k.seat} />
      <section className={s.hero} data-theme="ink" aria-label={k.title}>
        <CabinLight />
        <span className={s.beam} aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${-i * 0.6}s` }} />
          ))}
        </span>
        <div className={`wrap ${s.heroIn}`}>
          <div className={`mono ash ${s.kicker}`}>
            <PunchMark shape="film" cell={3} />
            {k.kicker}
          </div>
          <h1 className={s.h1} data-reveal>
            {k.title}
          </h1>
          <p className={s.tagline} data-reveal>
            {k.tagline.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </p>
          <div className={s.heroMedia} data-reveal>
            <Img k="shots/kinoqwertt-home" alt={k.heroAlt} eager sizes="760px" />
          </div>
          <a className={s.viewSite} href={links.kinoqwerttLive} target="_blank" rel="noopener noreferrer" data-reveal>
            <span className={s.viewLabel}>{k.viewSite}</span>
            <Marquee className={`mono ${s.viewMarquee}`} speed={40}>
              <span className={s.viewUrl}>kinoqwertt.vercel.app · </span>
            </Marquee>
          </a>
        </div>
      </section>

      <section className={`wrap ${s.detail}`} data-theme="ink">
        <div className={s.media}>
          {k.media.map((m, i) => (
            <figure key={m.no} className={s.panel} data-pos={m.pos} data-i={i}>
              <span className={`mono ash ${s.no}`}>{m.no}</span>
              <div className={s.shot} style={{ height: m.h }}>
                <Img k={m.img} alt={m.alt} sizes="900px" style={{ objectPosition: `50% ${m.pos}%` }} />
              </div>
              <figcaption className={`mono ash ${s.cap}`}>{m.cap}</figcaption>
            </figure>
          ))}
        </div>
        <aside className={s.aside}>
          <p className={s.summary}>{k.summary}</p>
          <p className={s.body}>{k.body}</p>
          <div>
            <h2 className={s.asideTitle}>{k.creditsTitle}</h2>
            {k.credits.map(([a, b], i) => (
              <div key={a} className={`${s.credit} ${Math.min(lit, k.credits.length - 1) === i ? s.creditOn : ''}`}>
                <span className="ash">{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div>
            <h2 className={s.asideTitle}>{k.fixedTitle}</h2>
            <ul className={s.fixed}>
              {k.fixed.map((f) => (
                <li key={f}>
                  <span className={s.tick}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="btn-row">
            <MaybeLink className="btn btn-paper" href={links.kinoqwerttLive}>
              {k.live}
            </MaybeLink>
            <MaybeLink className="btn btn-ghost" href={links.kinoqwerttRepo}>
              {k.repo}
            </MaybeLink>
          </div>
          <span className="mono ash">{k.caption}</span>
        </aside>
      </section>

      <NextDepartures
        mark="ticket"
        rows={[
          { to: '/work/qwerttclients', a: 'qwertt', img: 'dark/d-home', b: 'clients', chip: 'boarding' },
          { to: '#connect', a: t.nextDepartures.your, b: t.nextDepartures.project, chip: 'gate', open: true }
        ]}
      />
      <PageEnd page="kino" />
    </div>
  )
}
