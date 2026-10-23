import { useGSAP } from '../motion/useMotion'
import { useId, useRef, useState, type ReactNode, type Ref } from 'react'
import { useNav } from '../app/Nav'
import { useT } from '../content/i18n'
import { gsap, isReduced, MQ } from '../motion/engine'
import { useIsoLayoutEffect } from '../motion/hooks'
import Magnetic from './motion/Magnetic'
import Reveal from './motion/Reveal'
import s from './Shared.module.css'

export function BrowserFrame({ url, dark, className = '', children, viewRef }: { url: string; dark?: boolean; className?: string; children: ReactNode; viewRef?: Ref<HTMLDivElement> }) {
  return (
    <div className={`${s.browser} ${dark ? s.browserDark : ''} ${className}`}>
      <div className={s.bar}>
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={`mono ${s.url}`}>{url}</span>
      </div>
      <div className={s.view} ref={viewRef}>
        {children}
      </div>
    </div>
  )
}

// L2 — ticket sheen: a light band passes once when the card enters view and
// again on hover (throttled to once per 1.2 s).
// eslint-disable-next-line react/only-export-components
export function useSheen(scope: React.RefObject<HTMLElement | null>, selector: string) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root || document.documentElement.classList.contains('light-off')) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const cards = gsap.utils.toArray<HTMLElement>(selector, root)
        const offs: (() => void)[] = []
        cards.forEach((card) => {
          const band = card.querySelector<HTMLElement>('[data-sheen]')
          if (!band) return
          let last = 0
          const run = () => {
            const now = performance.now()
            if (now - last < 1200) return
            last = now
            gsap.fromTo(band, { xPercent: -130 }, { xPercent: 130, duration: 0.9, ease: 'qw.inOut' })
          }
          gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 80%', once: true, onEnter: run } })
          card.addEventListener('pointerenter', run)
          offs.push(() => card.removeEventListener('pointerenter', run))
        })
        return () => offs.forEach((f) => f())
      })
    },
    { scope }
  )
}
export const Sheen = () => <span className={s.sheen} data-sheen aria-hidden="true" />

export function PricingCards({ compact = false }: { compact?: boolean }) {
  const { pricing, services } = useT()
  const { openConnect } = useNav()
  const ref = useRef<HTMLDivElement>(null)
  useSheen(ref, `.${s.price}`)
  useGSAP(
    () => {
      if (compact) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(gsap.utils.toArray(`.${s.price}`, ref.current), { y: 32, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'qw.snap', scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true } })
      })
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={`${s.pricing} ${compact ? s.pricingCompact : ''}`}>
      {pricing.map((p) => (
        <div className={`${s.price} ${p.ink ? s.priceInk : ''}`} key={p.name}>
          <Sheen />
          <div className={s.priceTop}>
            <span className={s.priceName}>{p.name}</span>
            <span className={`mono ${s.weeks}`}>{p.weeks}</span>
          </div>
          <span className={s.priceText}>{p.text}</span>
          <div className={s.priceBottom}>
            <span className={s.amount}>{p.price}</span>
            {!compact && (
              <Magnetic max={8}>
                <a href="#connect" className={`btn btn-sm ${p.ink ? 'btn-paper' : 'btn-line'}`} aria-label={services.discussAria(p.name)} onClick={(e) => (e.preventDefault(), openConnect())}>
                  {services.discuss}
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// F11 — accordion, one open at a time; GSAP height:auto (0.4 s), "+" rotates 45°.
export function FaqList({ items, initial = 0, compact = false, dark = false }: { items: { q: string; a: string }[]; initial?: number; compact?: boolean; dark?: boolean }) {
  const { ui } = useT()
  const [open, setOpen] = useState(initial)
  const prev = useRef(initial)
  const base = useId()
  const ref = useRef<HTMLDivElement>(null)
  useIsoLayoutEffect(() => {
    const was = prev.current
    prev.current = open
    const root = ref.current
    if (!root || was === open || isReduced()) return
    const panels = root.querySelectorAll<HTMLElement>(`.${s.a}`)
    if (open >= 0) gsap.fromTo(panels[open], { height: 0 }, { height: 'auto', duration: 0.4, ease: 'qw.inOut', clearProps: 'height' })
    if (was >= 0 && panels[was]) {
      const p = panels[was]
      gsap.fromTo(p, { height: p.scrollHeight, visibility: 'visible' }, { height: 0, duration: 0.4, ease: 'qw.inOut', clearProps: 'height,visibility' })
    }
  }, [open])
  const toggle = (i: number) => setOpen(open === i ? -1 : i)
  return (
    <div ref={ref} className={`${s.faq} ${compact ? s.faqCompact : ''} ${dark ? s.faqDark : ''}`}>
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div className={`${s.item} ${isOpen ? s.isOpen : ''}`} key={f.q}>
            <h3 className={s.h}>
              <button type="button" className={s.q} aria-expanded={isOpen} aria-controls={`${base}-${i}`} id={`${base}-q${i}`} onClick={() => toggle(i)}>
                <span>{f.q}</span>
                <span className={`mono muted ${s.state}`}>
                  {isOpen ? ui.shut : ui.open}
                </span>
              </button>
            </h3>
            <div className={s.a} id={`${base}-${i}`} role="region" aria-labelledby={`${base}-q${i}`} inert={!isOpen}>
              <p>{f.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Numbered rows: the rule draws, then text rises; numbers flip in.
export function NumberedList({ title, items, dark }: { title: string; items: [string, string][]; dark?: boolean }) {
  return (
    <div>
      <Reveal as="h3" variant="mask" className={s.h3}>
        {title}
      </Reveal>
      <Reveal as="ol" variant="rule" className={`${s.numlist} ${dark ? s.numlistDark : ''}`}>
        {items.map(([t, d], i) => (
          <li className={s.numrow} key={t}>
            <span className={s.numRule} data-rule aria-hidden="true" />
            <span className={`mono ${s.numNo}`} data-rise>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div data-rise>
              <div className={s.numTitle}>{t}</div>
              <div className={s.numText}>{d}</div>
            </div>
          </li>
        ))}
      </Reveal>
    </div>
  )
}
