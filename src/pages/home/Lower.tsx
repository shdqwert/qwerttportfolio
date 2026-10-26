import { useGSAP } from '../../motion/useMotion'
import { useEffect, useRef, useState } from 'react'
import PunchMark from '../../components/motion/PunchMark'
import Reveal from '../../components/motion/Reveal'
import { FlapText } from '../../components/motion/SplitFlap'
import { FaqList, PricingCards } from '../../components/Shared'
import { useT } from '../../content/i18n'
import { stack } from '../../content/shared'
import { gsap, MQ } from '../../motion/engine'
import Deck from './Deck'
import KinoHome from './KinoHome'
import s from './Home.module.css'

function Services() {
  const { services } = useT()
  return (
    <section id="services" className={`wrap ${s.section}`}>
      <Reveal variant="fade" className={`mono muted ${s.center}`}>
        {services.label}
      </Reveal>
      <Reveal as="h2" variant="mask" className={s.servicesTitle}>
        {services.title}
      </Reveal>
      <Deck />
      <PricingCards />
    </section>
  )
}

function About() {
  const { about, owner } = useT()
  const ref = useRef<HTMLElement>(null)
  const [run, setRun] = useState(false)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        gsap.fromTo(`.${s.portrait}`, { y: 20 }, { y: -20, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 } })
      })
    },
    { scope: ref }
  )
  useEffect(() => {
    const el = ref.current?.querySelector(`.${s.stack}`)
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), io.disconnect()), { rootMargin: '0px 0px -15% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section id="about" ref={ref} className={`wrap ${s.section}`}>
      <div className={s.about}>
        <div className={s.portrait}>
          <PunchMark shape="q" color="var(--ink)" cell={14} />
          <span className="mono muted">{owner.portrait}</span>
        </div>
        <div className={s.aboutBody}>
          <div className="mono muted">{about.label}</div>
          <Reveal as="h2" variant="mask" className={s.h2}>
            {about.title}
          </Reveal>
          <p className={s.aboutText}>
            {owner.bio} {about.text}
          </p>
          <Reveal as="dl" className={s.aboutFacts} stagger={0.08}>
            {about.facts.map(([a, b]) => (
              <div key={a}>
                <dt className="mono muted">{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </Reveal>
          <Reveal as="ol" variant="rule" className={s.process}>
            {about.process.map(([w, t, d]) => (
              <li key={t} className={s.step}>
                <span className={s.rule} data-rule aria-hidden="true" />
                <span className="mono muted" data-rise>
                  {w}
                </span>
                <span className={s.stepTitle} data-rise>
                  {t}
                </span>
                <span className={s.stepText} data-rise>
                  {d}
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
      <div className={s.stack}>
        <div className="mono muted">{about.stackLabel}</div>
        <ul className={s.chips}>
          {[...stack, about.stackEdit].map((t, i) => (
            <li key={t} className={s.chip}>
              <FlapText text={t} run={run} seed={i + 11} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Faq() {
  const { faq } = useT()
  return (
    <section aria-labelledby="faq-title" className={`wrap ${s.section}`}>
      <div className={s.faqGrid}>
        <Reveal as="h2" variant="mask" className={s.h2} id="faq-title">
          {faq.title}
        </Reveal>
        <Reveal targets={`.${s.faqWrap} > div > div`} stagger={0.08}>
          <div className={s.faqWrap}>
            <FaqList items={faq.items} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// Below the fold on Home: kinoqwertt, services, about, FAQ — hydrated late
// (see app/deferred.tsx).
export default function HomeLower() {
  return (
    <>
      <KinoHome />
      <Services />
      <About />
      <Faq />
    </>
  )
}
