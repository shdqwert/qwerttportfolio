import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'
import { TLink, useNav } from '../app/Nav'
import { CompareSlider, ProofConsole, ScreenGallery } from '../components/CaseBits'
import { CopyEmail, LiveClock, MaybeLink } from '../components/Common'
import Counter from '../components/motion/Counter'
import Magnetic from '../components/motion/Magnetic'
import PunchMark from '../components/motion/PunchMark'
import Reveal from '../components/motion/Reveal'
import { FlapText } from '../components/motion/SplitFlap'
import PageEnd from '../components/PageEnd'
import Playground from '../components/Playground'
import ScrollStage from '../components/ScrollStage'
import { FaqList, NumberedList, PricingCards } from '../components/Shared'
import { useT } from '../content/i18n'
import { contactInfo, links, stack } from '../content/shared'
import { gsap, MQ } from '../motion/engine'
import Deck from './home/Deck'
import Demo from './home/Demo'
import Hero from './home/Hero'
import KinoHome from './home/KinoHome'
import Opener from './home/Opener'
import Storm from './home/Storm'
import s from './home/Home.module.css'

function Values() {
  const { values } = useT()
  const ref = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), io.disconnect()), { rootMargin: '0px 0px -18% 0px' })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <section className={`wrap ${s.valuesSection}`}>
      <Reveal variant="rule" className={s.values}>
        {values.map((v, i) => (
          <div key={v.title} className={s.value} ref={i === 0 ? ref : undefined}>
            <span className={s.rule} data-rule aria-hidden="true" />
            <span className="mono muted" data-rise>
              <FlapText text={String(i + 1).padStart(2, '0')} run={run} seed={i + 2} />
            </span>
            <span className={s.valueTitle} data-rise>
              {v.title}
            </span>
            <span className={s.valueText} data-rise>
              {v.text}
            </span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function QcIntro() {
  const { qcIntro: q } = useT()
  return (
    <>
      <div className={s.qcHead}>
        <Reveal as="h2" variant="track" className={s.caseTitle}>
          {q.title}
        </Reveal>
        <Reveal as="p" variant="mask" className={s.qcLead}>
          {q.lead}
        </Reveal>
      </div>
      <div className={s.numbers}>
        {q.numbers.map((n, i) => {
          const [to, suffix] = n.v.includes('/') ? [Number(n.v.split('/')[0]), '/' + n.v.split('/')[1]] : [Number(n.v), '']
          return (
            <div key={n.k} className={s.number}>
              <Counter to={to} suffix={suffix} className={s.numberV} delay={i * 0.1} />
              <div className={`mono muted ${s.numberK}`}>{n.k}</div>
            </div>
          )
        })}
      </div>
      <div className={`mono muted ${s.role}`}>{q.role}</div>
    </>
  )
}

function Helps() {
  const { qcLists: l } = useT()
  return (
    <div className={s.cols}>
      <NumberedList title={l.decisionsTitle} items={l.decisions} />
      <div className={s.aside}>
        <Reveal as="h3" variant="mask" className={s.h3}>
          {l.helpsTitle}
        </Reveal>
        <Reveal variant="clip" targets={`.${s.panel}`} stagger={0.1} className={s.asideStack}>
          <div className={s.panel}>
            <div className="mono muted">{l.clientsLabel}</div>
            <ul className={s.helps}>{l.clients.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
          <div className={`${s.panel} ${s.panelInk}`}>
            <div className="mono ash">{l.businessesLabel}</div>
            <ul className={s.helps}>{l.businesses.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </Reveal>
        <div className="btn-row" style={{ marginTop: 12 }}>
          <Magnetic>
            <TLink className="btn btn-ink" to="/work/qwerttclients">
              {l.readCase}
            </TLink>
          </Magnetic>
          <MaybeLink className="btn btn-line" href={links.qwerttclientsScreens}>
            {l.allScreens}
          </MaybeLink>
        </div>
      </div>
    </div>
  )
}

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
        gsap.fromTo(`.${s.portrait}`, { y: 20 }, { y: -20, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
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

function ContactTop() {
  const { contact } = useT()
  return (
    <div className={`wrap ${s.contactTop}`}>
      <PunchMark shape="at" from="film" cell={12} />
      <Reveal as="p" variant="fade" className={`mono ash ${s.motto}`}>
        {contact.motto}
      </Reveal>
    </div>
  )
}

function ContactBottom() {
  const { contact, ui, owner } = useT()
  const { openConnect } = useNav()
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <div className={`wrap ${s.contactBottom}`}>
      <div className={s.emailRow}>
        <a ref={ref} href={`mailto:${contactInfo.email}`} className={s.bigEmail}>
          {contactInfo.email}
        </a>
        <CopyEmail targetRef={ref} />
      </div>
      <div className={`btn-row ${s.centerRow}`}>
        <Magnetic>
          <a href="#connect" className="btn btn-signal" onClick={(e) => (e.preventDefault(), openConnect())}>
            {contact.cta}
          </a>
        </Magnetic>
        <MaybeLink className="btn btn-ghost" href={links.telegram}>
          {contact.telegram} {contactInfo.telegram}
        </MaybeLink>
      </div>
      <div className={`mono ash ${s.time}`}>
        <LiveClock /> · {ui.replies} {owner.replyTime}
      </div>
    </div>
  )
}

export default function Home() {
  const t = useT()
  return (
    <>
      <Hero />
      <Values />
      <Opener />
      <section className={`wrap ${s.qc}`} aria-label={t.qcIntro.title}>
        <QcIntro />
        <Storm />
        <ScrollStage stage={t.stageQc} />
        <ScreenGallery screens={t.qcScreens.items} credit={t.qcScreens.credit} />
        <Demo />
        <Helps />
        <CompareSlider design="shots/qwerttclients-design-top" built="dark/d-home-top" />
        <ProofConsole />
      </section>
      <KinoHome />
      <Services />
      <About />
      <Faq />
      <Playground />
      <div id="contact">
        <PageEnd page="home" top={<ContactTop />} bottom={<ContactBottom />} />
      </div>
    </>
  )
}
