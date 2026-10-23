import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { Img } from '../../components/Common'
import PunchMark from '../../components/motion/PunchMark'
import { useT } from '../../content/i18n'
import { gsap, MQ } from '../../motion/engine'
import { useStatic } from '../../motion/hooks'
import s from './Home.module.css'

const QR = (() => {
  const o: boolean[] = []
  let seed = 7
  for (let i = 0; i < 81; i++) {
    seed = (seed * 37 + 11) % 101
    const x = i % 9
    const y = Math.floor(i / 9)
    const corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5)
    o.push(corner ? !(x % 3 === 1 && y % 3 === 1) : seed % 2 === 0)
  }
  return o
})()

// F19 — pinned ~250vh. Step 1: venue card slides in. Step 2: Fri 23, then
// 18:30 fill blue (qw.snap). Step 3: Confirm presses with an orange tap ring,
// the ticket prints in 3 jerks, lands tilted, the stamp hits, the tear draws.
export default function Demo() {
  const { demo: d } = useT()
  const isStatic = useStatic()
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (isStatic) return
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const q = (c: string) => el.querySelector<HTMLElement>(`.${c}`)
        const ticks = gsap.utils.toArray<HTMLElement>(`.${s.stepTick}`, el)
        const tl = gsap.timeline({ defaults: { ease: 'qw.out' }, scrollTrigger: { trigger: el, start: 'center center', end: '+=150%', pin: true, anticipatePin: 1, scrub: 1 } })
        tl.from(q(s.venue), { x: 60, autoAlpha: 0, duration: 0.12 }, 0)
        tl.from(ticks[0], { scale: 0, duration: 0.04, ease: 'qw.snap' }, 0.14)
        tl.from(q(s.dayFill), { scale: 0.92, autoAlpha: 0, duration: 0.06, ease: 'qw.snap' }, 0.22)
        tl.from(q(s.slotFill), { scale: 0.92, autoAlpha: 0, duration: 0.06, ease: 'qw.snap' }, 0.34)
        tl.from(ticks[1], { scale: 0, duration: 0.04, ease: 'qw.snap' }, 0.42)
        tl.from(q(s.confirmOn), { autoAlpha: 0, duration: 0.04 }, 0.48)
        tl.fromTo(q(s.confirm), { scale: 1 }, { scale: 0.97, duration: 0.03, yoyo: true, repeat: 1 }, 0.52)
        tl.fromTo(q(s.tapRing), { scale: 0.4, autoAlpha: 1 }, { scale: 2.4, autoAlpha: 0, duration: 0.1 }, 0.53)
        tl.from(q(s.stepNow), { autoAlpha: 0.4, duration: 0.04 }, 0.55)
        // ticket prints: 3 printer jerks of 6 px, then a free slide
        const tk = q(s.ticket)!
        tl.fromTo(tk, { yPercent: -100, rotate: 0 }, { yPercent: -96, duration: 0.03, ease: 'steps(1)' }, 0.6)
        tl.to(tk, { yPercent: -92, duration: 0.03, ease: 'steps(1)' }, 0.63)
        tl.to(tk, { yPercent: -88, duration: 0.03, ease: 'steps(1)' }, 0.66)
        tl.to(tk, { yPercent: 0, duration: 0.14, ease: 'qw.out' }, 0.69)
        tl.to(tk, { rotate: 2, duration: 0.06, ease: 'qw.snap' }, 0.8)
        tl.fromTo(q(s.stamp), { scale: 1.25, rotate: -8, autoAlpha: 0 }, { scale: 1, rotate: -3, autoAlpha: 1, duration: 0.05, ease: 'qw.snap' }, 0.84)
        tl.from(q(s.tear), { scaleX: 0, transformOrigin: '0 50%', duration: 0.08 }, 0.88)
        tl.fromTo(q(s.ticketSheen), { xPercent: -130 }, { xPercent: 130, duration: 0.1, ease: 'qw.inOut' }, 0.9)
      })
    },
    { scope: ref, dependencies: [isStatic] }
  )
  return (
    <div ref={ref} className={s.demo} aria-label={d.label} data-theme="ink">
      <div>
        <div className={s.demoHead}>
          <h3 className={s.demoTitle}>
            {d.title[0]}
            <br />
            {d.title[1]}
          </h3>
          <ol className={s.steps} aria-label={d.stepsLabel}>
            <li className="mono">
              <span className={s.stepTick}>✓</span>
              {d.steps[0]}
            </li>
            <li className="mono">
              <span className={s.stepTick}>✓</span>
              {d.steps[1]}
            </li>
            <li className={`mono ${s.stepNow}`} aria-current="step">
              <span className={s.stepDot} />
              {d.steps[2]}
            </li>
          </ol>
        </div>
        <div className={s.app}>
          <div className={s.venue}>
            <Img k="photos/b1-big" alt={d.photoAlt} sizes="220px" className={s.appPhoto} />
            <div className={s.appBody}>
              <div className={s.appTop}>
                <div>
                  <div className={s.appName}>{d.venue}</div>
                  <div className={s.appMeta}>{d.venueMeta}</div>
                </div>
                <span className={s.appTag}>{d.tag}</span>
              </div>
              <div className={s.days}>
                {d.days.map(([w, n], i) => (
                  <span key={n} className={s.day}>
                    {w}
                    <b>{n}</b>
                    {i === 1 && (
                      <span className={`${s.day} ${s.dayFill}`} aria-hidden="true">
                        {w}
                        <b>{n}</b>
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div className={s.slots}>
                {d.slots.map((t) => (
                  <span key={t} className={`${s.slot} ${d.taken.includes(t) ? s.taken : ''}`}>
                    {t}
                    {t === '18:30' && (
                      <span className={`${s.slot} ${s.slotFill}`} aria-hidden="true">
                        {t}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div className={s.confirmWrap}>
                <span className={s.confirm}>
                  {d.confirm}
                  <span className={s.confirmOn} aria-hidden="true">
                    {d.confirm}
                  </span>
                </span>
                <span className={s.tapRing} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <p className={`mono ${s.demoNote}`}>{d.note}</p>
      </div>
      <div className={s.printer}>
        <div className={s.slotBar} aria-hidden="true" />
        <div className={s.paperClip}>
          <div className={s.ticket}>
            <span className={s.ticketSheen} aria-hidden="true" />
            <div className={s.ticketTop}>
              <PunchMark shape="ticket" cell={6} color="var(--ink)" />
              <span className={`mono ${s.stamp}`}>{d.ticket.booked}</span>
            </div>
            <div className={s.ticketVenue}>{d.venue}</div>
            <div className={s.ticketGrid}>
              {d.ticket.fields.map(([k, v]) => (
                <div key={k}>
                  <div className="mono muted">{k}</div>
                  <div className={s.ticketVal}>{v}</div>
                </div>
              ))}
            </div>
            <div className={s.tear} aria-hidden="true" />
            <div className={s.ticketRef}>
              <div>
                <div className="mono muted">{d.ticket.refLabel}</div>
                <div className={s.refCode}>{d.ticket.ref}</div>
              </div>
              <span className={s.qr} aria-hidden="true">
                {QR.map((on, i) => (
                  <i key={i} style={{ background: on ? 'var(--ink)' : 'transparent' }} />
                ))}
              </span>
            </div>
            <div className="mono muted">{d.ticket.foot}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
