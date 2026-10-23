import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { useNav, whenStageReady } from '../../app/Nav'
import { Img } from '../../components/Common'
import Magnetic from '../../components/motion/Magnetic'
import PunchMark from '../../components/motion/PunchMark'
import { BrowserFrame } from '../../components/Shared'
import { useT } from '../../content/i18n'
import { useHomeText } from '../../content/pages/home'
import { gsap, MQ, SplitText } from '../../motion/engine'
import s from './Home.module.css'

// Hero load (≤ 1.3 s, no preloader): lines rise from masks, holes pop in by
// distance from centre, copy rises, preview scales in with its shadow layer,
// taglines type on. Scroll out: preview lifts, taglines fade. L5 ambient blob.
export default function Hero() {
  const { owner } = useT()
  const { hero } = useHomeText()
  const { go, openConnect } = useNav()
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, (context) => {
        const tl = gsap.timeline({ paused: true })
        let split: SplitText | null = null
        let off = () => {}
        document.fonts.ready.then(() => context.add(() => {
        split = SplitText.create(el.querySelector('h1'), { type: 'lines', mask: 'lines', linesClass: 'split-line', aria: 'none' })
        tl.from(split.lines, { yPercent: 105, duration: 0.9, stagger: 0.1, ease: 'qw.out' }, 0.15)
        tl.from(el.querySelectorAll(`.${s.heroMark} .on`), { scale: 0, opacity: 0, duration: 0.45, ease: 'qw.snap', stagger: { each: 0.012, from: 'center', grid: [7, 7] } }, 0.35)
        tl.from(el.querySelectorAll('[data-hero-rise]'), { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.06 }, 0.5)
        tl.from(el.querySelector(`.${s.preview}`), { scale: 0.96, autoAlpha: 0, duration: 0.8, ease: 'qw.out' }, 0.6)
        tl.from(el.querySelector(`.${s.contact}`), { autoAlpha: 0, duration: 0.8 }, 0.7)
        el.querySelectorAll<HTMLElement>(`.${s.tag}`).forEach((t, i) => {
          const sp = SplitText.create(t, { type: 'words,chars', aria: 'none' })
          tl.from(sp.chars, { autoAlpha: 0, duration: 0.01, stagger: 0.022 }, 0.8 + i * 0.1)
        })
        el.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('revealed'))
        off = whenStageReady(() => tl.play())
        }))

        // scroll out
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.8 } })
          .to(el.querySelector(`.${s.previewWrap}`), { scale: 1.04, y: -40, ease: 'none' }, 0)
          .fromTo(el.querySelector(`.${s.contact}`), { opacity: 0.6, scale: 1 }, { opacity: 1, scale: 1.1, ease: 'none', immediateRender: false }, 0)
        gsap.to(el.querySelectorAll(`.${s.tag}`), { autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: '30% top', scrub: 0.8 } })
        // L5 — ambient warm blob drifts on a 40 s loop
        gsap.to(el.querySelector(`.${s.blob}`), { xPercent: 6, yPercent: -6, duration: 20, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        return () => {
          off()
          split?.revert()
        }
      })
    },
    { scope: ref }
  )

  return (
    <section id="top" ref={ref} className={`wrap ${s.hero}`}>
      <span className={s.blob} aria-hidden="true" />
      <h1 className={s.heroTitle} data-reveal>
        {hero.lines[0]}
        <br />
        {hero.lines[1]}
      </h1>
      <div className={s.heroMark} data-reveal>
        <PunchMark shape="q" cell={9} repelRef={ref} />
      </div>
      <p className={s.heroName} data-hero-rise data-reveal>
        {owner.name} · {owner.role}
      </p>
      <p className={s.heroLead} data-hero-rise data-reveal>
        {hero.lead}
      </p>
      <div className={s.heroCtas} data-hero-rise data-reveal>
        <Magnetic>
          <a className="btn btn-ink" href="#work" onClick={(e) => (e.preventDefault(), go('/#work'))}>
            {hero.primary}
          </a>
        </Magnetic>
        <a className="btn btn-line" href="#connect" onClick={(e) => (e.preventDefault(), openConnect())}>
          {hero.secondary}
        </a>
      </div>
      <div className={s.heroStage}>
        <p className={`${s.tag} ${s.tagL}`} data-reveal>
          {hero.taglineLeft[0]}
          <br />
          {hero.taglineLeft[1]}
        </p>
        <div className={s.previewWrap}>
          <span className={s.contact} aria-hidden="true" />
          <BrowserFrame url="qwerttclients.com" className={`${s.preview} shot`}>
            <Img k="dark/d-home" alt={hero.previewAlt} eager sizes="880px" className={s.previewImg} />
          </BrowserFrame>
        </div>
        <p className={`${s.tag} ${s.tagR}`} data-reveal>
          {hero.taglineRight[0]} <span aria-hidden="true" className={s.swap}>↔</span>
          <span className="sr-only"> {hero.and} </span> {hero.taglineRight[1]}
        </p>
      </div>
    </section>
  )
}
