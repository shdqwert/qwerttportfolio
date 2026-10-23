import { useGSAP } from '@gsap/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { deferred } from '../app/deferred'
import { TLink } from '../app/Nav'
import { useT } from '../content/i18n'
import type { RouteKey } from '../content/lang'
import type { ImgKey } from '../content/shared'
import { gsap, MQ } from '../motion/engine'
import { addCabin } from '../motion/light'
import { Arrow, Img } from './Common'
import PunchMark from './motion/PunchMark'
import s from './PageEnd.module.css'

const Finale = deferred<{ page: RouteKey }>(() => import('./Finale'))
const ContactRow = deferred<object>(() => import('./TerminalFooter').then((m) => ({ default: m.ContactRow })))
const Ticker = deferred<{ page: RouteKey }>(() => import('./TerminalFooter').then((m) => ({ default: m.Ticker })))
const TerminalFooter = deferred<{ page: RouteKey }>(() => import('./TerminalFooter'))

// L1 — warm cabin light that trails the pointer across an ink section.
export function CabinLight() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => (ref.current ? addCabin(ref.current) : undefined), [])
  return (
    <span ref={ref} className={s.cabin} aria-hidden="true">
      <span className={s.glow} />
    </span>
  )
}

// Finale + (contact row on sub-pages) + ticker + terminal footer, on ink.
export default function PageEnd({ page, top, bottom }: { page: RouteKey; top?: ReactNode; bottom?: ReactNode }) {
  const { finale } = useT()
  return (
    <section className={s.end} data-theme="ink" aria-label={finale.finalCall}>
      <CabinLight />
      {top}
      <div className={`wrap ${s.finaleWrap} ${top ? s.finaleTight : ''}`}>
        <Finale page={page} />
        {page !== 'home' && <ContactRow />}
      </div>
      {bottom}
      <Ticker page={page} />
      <TerminalFooter page={page} />
    </section>
  )
}

type Row = { to: string; a: string; img?: ImgKey; b: string; chip: 'boarding' | 'gate'; open?: boolean }

// "Next departures" rows on case pages (paper or ink).
export function NextDepartures({ rows, ink, mark }: { rows: Row[]; ink?: boolean; mark: 'film' | 'ticket' }) {
  const { nextDepartures: n } = useT()
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const el = ref.current!
        const st = { trigger: el, start: 'top 75%', once: true }
        const tl = gsap.timeline({ scrollTrigger: st })
        tl.from(gsap.utils.toArray(`.${s.row}`, el), { x: (i: number) => (i % 2 ? 140 : -140), autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'qw.out' })
        tl.fromTo(gsap.utils.toArray(`.${s.win}`, el), { clipPath: 'inset(0% 50% 0% 50% round 10px)' }, { clipPath: 'inset(0% 0% 0% 0% round 10px)', duration: 0.8, ease: 'qw.inOut' }, 0.3)
        tl.fromTo(gsap.utils.toArray(`.${s.chip}`, el), { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 0.08, repeat: 3, yoyo: true, ease: 'steps(1)' }, 0.8)
      })
    },
    { scope: ref }
  )
  return (
    <section className={`${s.next} ${ink ? s.nextInk : ''}`} data-theme={ink ? 'ink' : undefined}>
      <div ref={ref} className="wrap">
        <div className={`mono ${s.nextLabel}`}>
          <PunchMark shape={mark} cell={3} />
          {n.label}
        </div>
        <div className={s.rows}>
          {rows.map((r, i) => (
            <TLink key={i} to={r.to} className={s.row} style={{ paddingLeft: i === 0 ? 300 : 140 }} data-cursor="board">
              {r.a}
              {r.img ? (
                <span className={s.win} aria-hidden="true">
                  <Img k={r.img} alt="" sizes="200px" />
                </span>
              ) : (
                <span className={`mono ${s.open}`}>{n.open}</span>
              )}
              {r.b}
              {r.open && <Arrow w={110} h={64} />}
              <span className={`mono ${s.chip} ${r.chip === 'gate' ? s.gate : ''}`}>{r.chip === 'gate' ? n.gateOpen : n.boarding}</span>
            </TLink>
          ))}
        </div>
      </div>
    </section>
  )
}

// Fixed seat tag on case pages: "← Work" + "Row 01 · Seat qwerttclients".
export function SeatTag({ seat }: { seat: string }) {
  const { ui } = useT()
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(ref.current, { x: -220, duration: 0.7, delay: 0.5, ease: 'qw.snap' })
        gsap.fromTo(`.${s.seatSheen}`, { xPercent: -130 }, { xPercent: 130, duration: 0.9, delay: 1.1, ease: 'qw.inOut' })
      })
    },
    { scope: ref }
  )
  return (
    <nav ref={ref} aria-label={ui.breadcrumb} className={`mono caps ${s.seat}`}>
      <TLink to="/#work" className={s.seatBack}>
        {ui.seatWork}
      </TLink>
      <span aria-current="page" className={s.seatHere}>
        {seat}
        <span className={s.seatSheen} aria-hidden="true" />
      </span>
    </nav>
  )
}
