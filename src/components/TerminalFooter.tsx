import { useGSAP } from '../motion/useMotion'
import { useCallback, useRef, useState } from 'react'
import { TLink, useNav } from '../app/Nav'
import { useT } from '../content/i18n'
import type { RouteKey } from '../content/lang'
import { contactInfo, links } from '../content/shared'
import { gsap, MQ, scrollToTarget } from '../motion/engine'
import { CopyEmail, Img, LiveClock, MaybeLink } from './Common'
import Magnetic from './motion/Magnetic'
import Marquee from './motion/Marquee'
import s from './TerminalFooter.module.css'

export function Ticker({ page }: { page: RouteKey }) {
  const { tickers } = useT()
  return (
    <Marquee className={`mono ${s.ticker}`} speed={60}>
      {tickers[page].map((t, i) => (
        <span key={i} className={s.tick}>
          {t}
          <span className={s.hole} aria-hidden="true" />
        </span>
      ))}
    </Marquee>
  )
}

// Email + live time + CTA row (sub-pages, under the finale).
export function ContactRow() {
  const { ui, owner, contact } = useT()
  const { openConnect } = useNav()
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <div className={s.contactRow}>
      <span className={s.emailWrap}>
        <a ref={ref} href={`mailto:${contactInfo.email}`} className={s.email}>
          {contactInfo.email}
        </a>
        <CopyEmail targetRef={ref} />
      </span>
      <span className={s.rowRight}>
        <span className="mono ash">
          <LiveClock /> · {ui.repliesShort} {owner.replyTime}
        </span>
        <Magnetic>
          <a href="#connect" className="btn btn-signal" onClick={(e) => (e.preventDefault(), openConnect())}>
            {contact.cta}
          </a>
        </Magnetic>
      </span>
    </div>
  )
}

function Deck() {
  const { footer } = useT()
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(0)
  const deal = useRef<() => void>(() => {})

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const cards = gsap.utils.toArray<HTMLElement>(`.${s.card}`, el)
      let order = cards.map((_, i) => i)
      let busy = false
      const layout = (instant = false) => {
        order.forEach((ci, pos) => {
          const c = cards[ci]
          gsap.to(c, { x: pos * 4, y: pos * 8, rotate: [-1.5, 6, -4][pos], zIndex: 3 - pos, duration: instant ? 0 : 0.5, ease: 'qw.snap' })
        })
      }
      layout(true)
      deal.current = () => {
        if (busy) return
        busy = true
        const topCard = cards[order[0]]
        const reduced = !window.matchMedia(MQ.motion).matches
        const finish = () => {
          order = [...order.slice(1), order[0]]
          setTop(order[0])
          layout(reduced)
          busy = false
        }
        if (reduced) return finish()
        gsap
          .timeline({ onComplete: finish })
          .to(topCard, { x: 260, y: -40, rotate: 14, duration: 0.25, ease: 'qw.inOut' })
          .set(topCard, { zIndex: 0 })
          .to(topCard, { x: 8, y: 14, rotate: 6, duration: 0.25, ease: 'qw.inOut' })
      }
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        let timer = 0
        let hovered = false
        const start = () => {
          clearInterval(timer)
          timer = window.setInterval(() => !hovered && deal.current(), 3200)
        }
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : clearInterval(timer)))
        io.observe(el)
        // hover pauses the auto-deal and tilts the top card to the pointer
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          gsap.to(cards[order[0]], { rotateY: px * 12, rotateX: -py * 12, duration: 0.4, overwrite: 'auto' })
          el.style.setProperty('--sx', `${(px + 0.5) * 100}%`)
        }
        const enter = () => (hovered = true)
        const leave = () => {
          hovered = false
          gsap.to(cards, { rotateX: 0, rotateY: 0, duration: 0.5 })
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerenter', enter)
        el.addEventListener('pointerleave', leave)
        return () => {
          clearInterval(timer)
          io.disconnect()
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerenter', enter)
          el.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: ref }
  )

  const next = useCallback(() => deal.current(), [])
  return (
    <figure className={s.deckWrap} aria-label={footer.deckLabel}>
      <div ref={ref} className={s.deck} data-cursor="view">
        {footer.deck.map((d, i) => (
          <button key={d.no} type="button" className={s.card} onClick={next} tabIndex={i === top ? 0 : -1} aria-hidden={i === top ? undefined : true}>
            <span className="sr-only">{footer.nextCard}: </span>
            <Img k={d.img} alt="" sizes="300px" className={s.cardImg} />
            <span className={s.cardFoot}>
              <span>
                <span className={s.cardCap}>{d.cap}</span>
                <span className={`mono ${s.cardNo}`}>{d.no}</span>
              </span>
              <span className={`mono ${s.admit}`}>{footer.admit}</span>
            </span>
            <span className={s.sheen} aria-hidden="true" />
          </button>
        ))}
      </div>
      <figcaption className="sr-only" aria-live="polite">
        {footer.deck[top].cap}
      </figcaption>
    </figure>
  )
}

// F26 — Terminal footer on every page: map · deck · channels · giant ticket.
export default function TerminalFooter({ page }: { page: RouteKey }) {
  const { footer, lang } = useT()
  const ref = useRef<HTMLElement>(null)
  const isHome = page === 'home'

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(gsap.utils.toArray(`.${s.col}`, el), { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        const word = el.querySelector(`.${s.word}`)
        const tl = gsap.timeline({ scrollTrigger: { trigger: word, start: 'top 85%', once: true } })
        tl.from(gsap.utils.toArray(`.${s.letter}`, el), { yPercent: 60, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: 'qw.out' })
        tl.from(el.querySelectorAll(`.${s.holes} i`), { scale: 0, duration: 0.25, stagger: 0.008, ease: 'qw.snap' }, 0)
        tl.from(el.querySelector(`.${s.tear}`), { scaleX: 0, transformOrigin: '0 50%', duration: 0.8, ease: 'qw.inOut' }, 0.2)
        tl.fromTo(el.querySelector(`.${s.sweep}`), { backgroundPosition: '120% 0' }, { backgroundPosition: '-20% 0', duration: 1.4, ease: 'qw.inOut' }, 0.5)
      })
    },
    { scope: ref }
  )

  const L = footer.links
  return (
    <footer ref={ref} className={`wrap ${s.footer}`}>
      <div className={s.cols}>
        <nav aria-label={footer.map} className={`${s.col} ${s.map}`}>
          <span className={`mono caps ${s.colHead}`}>{footer.map}</span>
          {!isHome && <TLink className={s.flink} to="/">{L.home}</TLink>}
          <TLink className={s.flink} to="/#work">{L.work}</TLink>
          {isHome && <TLink className={s.flink} to="/#services">{L.services}</TLink>}
          {isHome && <TLink className={s.flink} to="/#about">{L.about}</TLink>}
          {!isHome && <TLink className={s.flink} to="/work/qwerttclients">{L.qc}</TLink>}
          {!isHome && <TLink className={s.flink} to="/work/kinoqwertt">{L.kino}</TLink>}
          <TLink className={s.flink} to="/lab">{L.lab}</TLink>
          <TLink className={s.flink} to="#connect">{L.connect}</TLink>
        </nav>
        <div className={s.col}>
          <Deck />
        </div>
        <nav aria-label={footer.channels} className={`${s.col} ${s.channels}`}>
          <span className={`mono caps ${s.colHead}`}>{footer.channels}</span>
          <MaybeLink className={s.flink} href={links.telegram}>Telegram</MaybeLink>
          <MaybeLink className={s.flink} href={links.github}>GitHub</MaybeLink>
          <MaybeLink className={s.flink} href={links.linkedin}>LinkedIn</MaybeLink>
          <MaybeLink className={s.flink} href={links.instagram}>Instagram</MaybeLink>
        </nav>
      </div>

      <div className={s.ticket}>
        <div className={s.holes} aria-hidden="true">
          {Array.from({ length: 64 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className={s.word} aria-label="qwertt" role="img">
          <span className={s.letters} aria-hidden="true">
            {'QWERTT'.split('').map((c, i) => (
              <span key={i} className={s.letter}>
                {c}
              </span>
            ))}
          </span>
          <span className={s.sweep} aria-hidden="true">
            QWERTT
          </span>
        </div>
        <div className={`mono caps ${s.stub}`}>
          <span className={s.tear} aria-hidden="true" />
          <span>{footer.tickets[page]}</span>
          <span>{footer.seat}</span>
          <Magnetic>
            <a
              href="#top"
              className={s.top}
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(0, { duration: 1.6 })
              }}
            >
              {footer.top}
            </a>
          </Magnetic>
        </div>
      </div>

      <div className={s.bottom}>
        <span>©2026</span>
        <span className={s.legal}>
          <MaybeLink className={`${s.flink} ${s.small}`} href={links.imprint}>{footer.imprint}</MaybeLink>
          <MaybeLink className={`${s.flink} ${s.small}`} href={links.privacy}>{footer.privacy}</MaybeLink>
        </span>
        <span lang={lang}>{footer.stamped}</span>
      </div>
    </footer>
  )
}
