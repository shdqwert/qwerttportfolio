import { useId, useRef, useState } from 'react'
import { about, contact, cssExcerpt, faq, links, owner, pricing, qcHelps, services, values } from '../content/portfolio.js'
import { clamp, useReducedMotion, useReveal, useScrollProgress } from '../lib/motion.js'
import { CopyEmail, LiveClock, MaybeLink } from './Common.jsx'
import { ConnectLink } from './ConnectContext.jsx'
import InkSection from './InkSection.jsx'
import PixelMark from './PixelMark.jsx'

export function ValueColumns() {
  const [ref, cls] = useReveal({ threshold: 0.3 })
  return (
    <section aria-label="What you get" className="wrap values-section">
      <div className={`values ${cls}`} ref={ref}>
        {values.map((v, i) => (
          <div className="value rule-col" key={v.title} style={{ '--i': i }}>
            <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
            <span className="value__title">{v.title}</span>
            <span className="value__text">{v.text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function QcHelps() {
  return (
    <>
      <h3 className="h3 helps__title">How it helps</h3>
      <div className="panel">
        <div className="mono muted">For clients</div>
        <ul className="helps__list">
          {qcHelps.clients.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="panel panel--ink">
        <div className="mono ash">For businesses</div>
        <ul className="helps__list">
          {qcHelps.businesses.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="btn-row">
        <MaybeLink href={links.qwerttclientsCase} className="btn btn-ink">
          Read the full case →{!links.qwerttclientsCase && <span className="btn__ph"> [case URL]</span>}
        </MaybeLink>
        <MaybeLink href={links.qwerttclientsScreens} className="btn btn-line">
          Open all 38 screens ↗
        </MaybeLink>
      </div>
    </>
  )
}

export function KinoAside() {
  const [ref, cls] = useReveal({ threshold: 0.3 })
  return (
    <>
      <div className="codecard">
        <div className="mono ash codecard__head">
          <span>styles · from the live build</span>
          <span>excerpt</span>
        </div>
        <pre className={`codecard__pre ${cls}`} ref={ref}>
          {cssExcerpt.map((line, i) => (
            <span className={`codecard__line${typeof line === 'object' ? ' is-comment' : ''}`} key={i} style={{ '--i': i }}>
              {typeof line === 'object' ? line.c : line}
              {'\n'}
            </span>
          ))}
        </pre>
      </div>
      <div className="panel panel--paper">
        <div className="mono muted">What this shows a client</div>
        <p className="panel__lead">I can take a designer’s Figma file and ship it as a fast, maintainable app — and catch the bugs before your users do.</p>
      </div>
      <div className="btn-row">
        <MaybeLink href={links.kinoqwerttLive} className="btn btn-paper">
          Open live site ↗
        </MaybeLink>
        <MaybeLink href={links.kinoqwerttRepo} className="btn btn-ghost">
          GitHub ↗
        </MaybeLink>
      </div>
    </>
  )
}

export function PricingCards({ compact = false }) {
  const [ref, cls] = useReveal({ threshold: 0.2 })
  return (
    <div className={`pricing${compact ? ' pricing--compact' : ''} ${compact ? '' : cls}`} ref={compact ? undefined : ref}>
      {pricing.map((p, i) => (
        <div className={`price${p.ink ? ' price--ink' : ''}`} key={p.name} style={{ '--i': i }}>
          <div className="price__top">
            <span className="price__name">{p.name}</span>
            <span className="mono price__weeks">{p.weeks}</span>
          </div>
          <span className="price__text">{p.text}</span>
          <div className="price__bottom">
            <span className="price__amount">{p.price}</span>
            {!compact && (
              <ConnectLink className={`btn btn-sm ${p.ink ? 'btn-paper' : 'btn-line'}`} aria-label={`Discuss the ${p.name} package`}>
                Discuss
              </ConnectLink>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Heading words brighten from 20% to 100% as it crosses the viewport.
function ScrubHeading({ text, className }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const wordRefs = useRef([])
  const ref = useScrollProgress(
    (_, r, vh) => {
      // Off-screen (or past) the heading stays fully opaque.
      const offscreen = r.top > vh || r.bottom < 0
      const p = clamp((vh * 0.95 - r.top) / (vh * 0.45))
      const n = words.length
      wordRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = offscreen ? '' : (0.2 + 0.8 * clamp(p * n - i)).toFixed(3)
      })
    },
    { enabled: !reduced }
  )
  return (
    <h2 className={className} ref={ref}>
      {words.map((w, i) => (
        <span key={i} ref={(el) => (wordRefs.current[i] = el)} className="scrub-word">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  )
}

export function Services() {
  const [ref, cls] = useReveal({ threshold: 0.3 })
  return (
    <section id="services" className="wrap section">
      <div className="mono muted center">{services.label}</div>
      <ScrubHeading text={services.title} className="services__title" />
      <div className={`trio ${cls}`} ref={ref}>
        {services.items.map(([t, d], i) => (
          <div className="trio__item rule-col" key={t} style={{ '--i': i }}>
            <span className="trio__title">{t}</span>
            <span className="trio__text">{d}</span>
          </div>
        ))}
      </div>
      <PricingCards />
    </section>
  )
}

export function About() {
  const reduced = useReducedMotion()
  const portraitRef = useRef(null)
  const sectionRef = useScrollProgress(
    (p) => {
      if (portraitRef.current) portraitRef.current.style.transform = `translateY(${(20 - p * 40).toFixed(1)}px)`
    },
    { enabled: !reduced }
  )
  const [stepsRef, stepsCls] = useReveal({ threshold: 0.3 })
  return (
    <section id="about" className="wrap section" ref={sectionRef}>
      <div className="about">
        <div className="about__portrait" ref={portraitRef}>
          <PixelMark shape="q" color="var(--ink)" cell={14} />
          <span className="mono muted">{owner.portrait}</span>
        </div>
        <div className="about__body">
          <div className="mono muted">{about.label}</div>
          <h2 className="h2">{about.title}</h2>
          <p className="about__text">
            {owner.bio} {about.text}
          </p>
          <dl className="about__facts">
            {about.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="mono muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <ol className={`process ${stepsCls}`} ref={stepsRef}>
            {about.process.map(([when, t, d], i) => (
              <li className="process__step rule-col" key={t} style={{ '--i': i }}>
                <span className="mono muted">{when}</span>
                <span className="process__title">{t}</span>
                <span className="process__text">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="stack">
        <div className="mono muted">{about.stackLabel}</div>
        <ul className="chips">
          {about.stack.map((t) => (
            <li className="chip" key={t}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// F11 — accordion, one item open at a time.
export function FaqList({ items, initial = 0, compact = false }) {
  const [open, setOpen] = useState(initial)
  const base = useId()
  return (
    <div className={`faq${compact ? ' faq--compact' : ''}`}>
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={f.q} style={{ '--i': i }}>
            <h3 className="faq__h">
              <button type="button" className="faq__q" aria-expanded={isOpen} aria-controls={`${base}-${i}`} id={`${base}-q${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{f.q}</span>
                <span className="mono muted faq__state">{isOpen ? 'Close −' : 'Open +'}</span>
              </button>
            </h3>
            <div className="faq__a" id={`${base}-${i}`} role="region" aria-labelledby={`${base}-q${i}`} inert={!isOpen}>
              <div className="faq__a-in">
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Faq() {
  const [ref, cls] = useReveal({ threshold: 0.2 })
  return (
    <section aria-labelledby="faq-title" className="wrap section">
      <div className="faq-grid">
        <h2 className="h2" id="faq-title">
          {faq.title}
        </h2>
        <div className={`faq-wrap ${cls}`} ref={ref}>
          <FaqList items={faq.items} />
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const emailRef = useRef(null)
  const [ref, cls] = useReveal({ threshold: 0.3 })
  return (
    <InkSection id="contact" className="contact-section" label="Contact">
      <div className={`wrap contact ${cls}`} ref={ref}>
        <PixelMark shape="at" from="film" cell={12} />
        <p className="mono ash contact__motto">{contact.motto}</p>
        <h2 className="contact__title">
          {contact.title.map((l, i) => (
            <span className="mask" key={l}>
              <span className="contact__line" style={{ '--i': i }}>
                {l}
              </span>
            </span>
          ))}
        </h2>
        <div className="contact__email-row">
          <a href={`mailto:${owner.email}`} className="contact__email" ref={emailRef}>
            {owner.email}
          </a>
          <CopyEmail className="copy copy--paper" targetRef={emailRef} />
        </div>
        <div className="btn-row center">
          <ConnectLink className="btn btn-paper">{contact.cta}</ConnectLink>
          <MaybeLink href={links.telegram} className="btn btn-ghost">
            Telegram {owner.telegram}
          </MaybeLink>
        </div>
        <div className="mono ash contact__time">
          <LiveClock /> · usually replies within {owner.replyTime}
        </div>
      </div>
    </InkSection>
  )
}

export function Footer() {
  const [ref, cls] = useReveal({ threshold: 0.1 })
  return (
    <footer className="ink footer-section" data-theme="ink">
      <div className={`wrap footer ${cls}`} ref={ref}>
        <div className="footer__cols">
          <nav aria-label="Sitemap" className="footer__col">
            <span className="footer__head">Sitemap</span>
            <a className="flink" href="#work">Work</a>
            <a className="flink" href="#services">Services</a>
            <a className="flink" href="#about">About</a>
            <ConnectLink className="flink">Connect</ConnectLink>
          </nav>
          <nav aria-label="Channels" className="footer__col footer__col--right">
            <span className="footer__head">Channels</span>
            <MaybeLink className="flink" href={links.telegram}>Telegram</MaybeLink>
            <MaybeLink className="flink" href={links.github}>GitHub</MaybeLink>
            <MaybeLink className="flink" href={links.linkedin}>LinkedIn</MaybeLink>
            <MaybeLink className="flink" href={links.instagram}>Instagram</MaybeLink>
          </nav>
        </div>
        <div className="footer__bottom">
          <span>©2026</span>
          <span className="footer__legal">
            <MaybeLink className="flink flink--sm" href={links.imprint}>Imprint</MaybeLink>
            <MaybeLink className="flink flink--sm" href={links.privacy}>Privacy</MaybeLink>
          </span>
          <span className="footer__sign">
            <PixelMark shape="q" color="var(--paper)" cell={2} />
            Crafted by {owner.name}
          </span>
        </div>
      </div>
    </footer>
  )
}
