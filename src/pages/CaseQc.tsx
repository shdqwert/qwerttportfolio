import { useGSAP } from '../motion/useMotion'
import { useEffect, useRef, useState } from 'react'
import { useNav, whenStageReady } from '../app/Nav'
import { ProofConsole } from '../components/ProofConsole'
import { Arrow, Img, MaybeLink, MouseIcon } from '../components/Common'
import Magnetic from '../components/motion/Magnetic'
import PunchMark from '../components/motion/PunchMark'
import Reveal from '../components/motion/Reveal'
import { BoardTile, FlapText, useFlapText } from '../components/motion/SplitFlap'
import PageEnd, { CabinLight, NextDepartures, SeatTag } from '../components/PageEnd'
import { useT } from '../content/i18n'
import { useQcText } from '../content/pages/qc'
import { appTokens, boardActive, boardRows, districts, hiddenPlaceLabels, links, mapX, mapY, placeColors, places, testsCase, type PlaceKind } from '../content/shared'
import { gsap, MQ, ScrollTrigger } from '../motion/engine'
import { useStatic } from '../motion/hooks'
import s from './CaseQc.module.css'

const pad = (v: string, n: number) => (v + ' '.repeat(n)).slice(0, n)
const rowText = (r: [string, string, string, string]) => `${pad(r[0], 5)} ${pad(r[1], 14)} ${pad(r[2], 11)} ${pad(r[3], 10)}`

function BoardRow({ text, active, run, seed }: { text: string; active: boolean; run: boolean; seed: number }) {
  const shown = useFlapText(text, run, seed)
  return (
    <div className={s.boardRow} aria-hidden="true">
      {[...shown].map((c, i) => (
        <BoardTile key={i} ch={c} active={active} status={active && i >= 33} />
      ))}
    </div>
  )
}

// F20 — split-flap bookings board: every tile flips through random glyphs on
// load; every ~120 px of scroll the board advances one row.
function Board() {
  const c = useQcText()
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [run, setRun] = useState(false)
  useEffect(() => whenStageReady(() => setRun(true)), [])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => setOffset(Math.floor((self.scroll() - self.start) / 120) % boardRows.length)
    })
    return () => st.kill()
  }, [])
  const rows = Array.from({ length: 5 }, (_, i) => boardRows[(offset + i) % boardRows.length])
  return (
    <div ref={ref} className={s.board}>
      <div className="sr-only">
      <table>
        <caption>{c.boardLabel}</caption>
        <thead>
          <tr>
            {c.boardCols.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {boardRows.slice(0, 5).map((r) => (
            <tr key={r[0]}>
              {r.map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className={`mono ${s.boardHead}`} aria-hidden="true">
        {c.boardCols.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <BoardRow key={i} text={rowText(r)} active={i === boardActive} run={run} seed={offset * 7 + i} />
      ))}
    </div>
  )
}

// F21 — chapter rail: follows the chapter in view; compact rail in the gutter.
function useChapter(ids: string[]) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const on = new Map<string, boolean>()
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => on.set(e.target.id, e.isIntersecting))
        const i = ids.findIndex((id) => on.get(id))
        if (i >= 0) setActive(i)
      },
      { rootMargin: '-40% 0px -59% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

const CH_IDS = ['problem', 'city', 'flows', 'system', 'languages', 'engine', 'screens', 'result']

// Card sits beside its pin, flipping left/up near the right/bottom edge so the
// map's rounded frame never clips it.
const popStyle = (x: number, y: number) => ({
  left: x > 0.72 ? `calc(${x * 100}% - 284px)` : `calc(${x * 100}% + 24px)`,
  top: y > 0.5 ? `calc(${y * 100}% + 40px)` : `calc(${y * 100}% - 40px)`,
  translate: y > 0.5 ? '0 -100%' : undefined,
})

// F21 dock: the fixed gutter rail shows between the problem and the result.
function RailDock() {
  const active = useChapter(CH_IDS)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const p = document.getElementById('problem')
    const r = document.getElementById('result')
    if (!p || !r) return
    const st = ScrollTrigger.create({ trigger: p, start: 'bottom 40%', endTrigger: r, end: 'bottom 40%', onToggle: (self) => setShow(self.isActive) })
    return () => st.kill()
  }, [])
  return (
    <div className={`${s.railWrap} ${show ? s.railShow : ''}`}>
      <Rail active={active} />
    </div>
  )
}

function Rail({ active }: { active: number }) {
  const c = useQcText()
  const { go } = useNav()
  return (
    <nav aria-label={c.chaptersLabel} className={s.rail}>
      {c.chapters.map((t, i) => (
        <a key={t} href={`#${CH_IDS[i]}`} className={`${s.railItem} ${i === active ? s.railOn : ''}`} aria-current={i === active ? 'true' : undefined} onClick={(e) => (e.preventDefault(), go(`#${CH_IDS[i]}`))}>
          <span className="mono">{String(i + 1).padStart(2, '0')}</span>
          <span className={s.railLabel}>{t}</span>
        </a>
      ))}
    </nav>
  )
}

function Problem() {
  const active = useChapter(CH_IDS)
  const c = useQcText()
  const p = c.problem
  const { go } = useNav()
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const msgs = gsap.utils.toArray<HTMLElement>(`.${s.msg}`, ref.current)
        const tl = gsap.timeline({ scrollTrigger: { trigger: `.${s.before}`, start: 'top 70%', end: 'bottom 60%', scrub: 0.8 } })
        msgs.forEach((m, i) => tl.from(m, { y: 16, autoAlpha: 0, duration: 0.5 }, i * 0.4))
        gsap.fromTo(`.${s.missed}`, { x: 0 }, { keyframes: { x: [-3, 3, -3, 3, 0] }, duration: 0.3, scrollTrigger: { trigger: `.${s.missed}`, start: 'top 70%', once: true } })
        gsap.from(`.${s.appCard}`, { scale: 0.92, autoAlpha: 0, duration: 0.5, ease: 'qw.snap', scrollTrigger: { trigger: `.${s.after}`, start: 'top 70%', once: true } })
        const sec = ref.current!.querySelector<HTMLElement>(`.${s.secs}`)
        if (sec) {
          const o = { v: 0 }
          gsap.to(o, { v: 4, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: `.${s.after}`, start: 'top 70%', once: true }, onUpdate: () => { sec.textContent = String(Math.round(o.v)) } })
        }
      })
    },
    { scope: ref }
  )
  return (
    <section id="problem" ref={ref} className={`wrap ${s.problem}`}>
      <nav aria-label={c.chaptersLabel} className={s.sideRail}>
        {c.chapters.map((t, i) => (
          <a key={t} href={`#${CH_IDS[i]}`} className={`${s.chap} ${i === active ? s.chapOn : ''}`} onClick={(e) => (e.preventDefault(), go(`#${CH_IDS[i]}`))}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            {t}
          </a>
        ))}
      </nav>
      <div>
        <div className="mono muted">{p.kicker}</div>
        <Reveal as="h2" variant="mask" className={s.h2}>
          {p.title[0]}
          <br />
          {p.title[1]}
        </Reveal>
        <div className={s.ba}>
          <div className={s.before}>
            <div className={s.baHead}>
              <span className="mono muted">{p.before}</span>
              <span className={`mono ${s.red}`}>{p.beforeTime}</span>
            </div>
            {p.msgs.map((m) => (
              <div key={m.t} className={`${s.msg} ${'me' in m && m.me ? s.me : ''} ${'seen' in m && m.seen ? s.seen : ''} ${'missed' in m && m.missed ? s.missed : ''}`}>
                <div>{m.t}</div>
                <div className={`mono ${s.at}`}>{m.at}</div>
              </div>
            ))}
          </div>
          <div className={s.after} data-theme="ink">
            <div className={s.baHead}>
              <span className="mono ash">{p.after}</span>
              <span className={`mono ${s.green}`}>
                <span className={s.secs}>4</span> {p.afterTime}
              </span>
            </div>
            <div className={s.appCard}>
              <Img k="photos/f3-s" alt={p.cardAlt} sizes="560px" className={s.appImg} />
              <div className={s.appBody}>
                <div className={s.appRow}>
                  <b>{p.venue}</b>
                  <span className={s.badgeOk}>{p.instant}</span>
                </div>
                <div className={s.appMeta}>{p.venueMeta}</div>
                <div className={s.appSlots}>
                  <span className={s.slotA}>{p.slots[0]}</span>
                  <span className={s.slotSel}>{p.slots[1]}</span>
                  <span className={s.slotWarn}>{p.slots[2]}</span>
                </div>
              </div>
            </div>
            <div className={s.confirmed}>
              <span className={s.check}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div>
                <div className={s.confirmedT}>{p.confirmed}</div>
                <div className="mono ash">{p.confirmedMeta}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// F22 — real map: pins drop by district and switch on like night lights;
// the popover cycles through 3 venues every 2.5 s while in view.
function City() {
  const c = useQcText()
  const m = c.city
  const ref = useRef<HTMLDivElement>(null)
  const [pop, setPop] = useState(0)
  const popNames = m.pops.map((p) => p.name)
  useGSAP(
    () => {
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const st = { trigger: el, start: 'top 70%', once: true }
        gsap.fromTo(el.querySelectorAll('path, circle'), { strokeDasharray: 2000, strokeDashoffset: 2000 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.08, ease: 'qw.inOut', scrollTrigger: st })
        gsap.from(gsap.utils.toArray(`.${s.pin}`, el), { y: -30, autoAlpha: 0, duration: 0.5, ease: 'qw.snap', stagger: 0.04, scrollTrigger: st })
        gsap.from(gsap.utils.toArray(`.${s.district}`, el), { y: 8, autoAlpha: 0, duration: 0.5, stagger: 0.04, delay: 0.3, scrollTrigger: st })
        let timer = 0
        const io = new IntersectionObserver(([e]) => {
          clearInterval(timer)
          if (e.isIntersecting) timer = window.setInterval(() => setPop((p) => (p + 1) % popNames.length), 2500)
        })
        io.observe(el)
        return () => {
          clearInterval(timer)
          io.disconnect()
        }
      })
    },
    { scope: ref }
  )
  const active = m.pops[pop]
  const ap = places.find((p) => p[0] === active.name)!
  return (
    <section id="city" className={s.city} data-theme="ink">
      <CabinLight />
      <div className="wrap">
        <div className={s.secHead}>
          <div>
            <div className="mono ash">{m.kicker}</div>
            <Reveal as="h2" variant="mask" className={s.h2}>
              {m.title[0]}
              <br />
              {m.title[1]}
            </Reveal>
          </div>
          <p className={s.secText}>{m.text}</p>
        </div>
        <div ref={ref} className={s.map} role="group" aria-label={m.mapLabel}>
          <svg viewBox="0 0 1376 720" preserveAspectRatio="none" fill="none" aria-hidden="true" className={s.mapSvg}>
            <path d="M-20 120 C 300 160, 420 300, 560 330 S 900 420, 1400 380" stroke="#24322E" strokeWidth="18" />
            <path d="M-20 120 C 300 160, 420 300, 560 330 S 900 420, 1400 380" stroke="#2F4A44" strokeWidth="2" />
            <path d="M120 -10 L 520 730" stroke="#262522" strokeWidth="10" />
            <path d="M-10 520 L 1400 260" stroke="#262522" strokeWidth="10" />
            <path d="M700 -10 C 690 200, 760 420, 720 730" stroke="#262522" strokeWidth="12" />
            <path d="M0 640 C 400 600, 900 620, 1400 560" stroke="#1F1E1C" strokeWidth="6" />
            <path d="M1000 -10 L 1180 730" stroke="#1F1E1C" strokeWidth="6" />
            <circle cx="688" cy="370" r="210" stroke="#1F1E1C" strokeWidth="6" />
          </svg>
          {districts.map(([name, count, lng, lat]) => (
            <span key={name} className={`mono ${s.district}`} style={{ left: `${(mapX(lng) / 1376) * 100}%`, top: `${(mapY(lat) / 720) * 100}%` }}>
              {name} · {count}
            </span>
          ))}
          {places.map(([name, lat, lng, k]) => {
            const isPop = popNames.includes(name)
            const on = name === active.name
            const style = { left: `${(mapX(lng) / 1376) * 100}%`, top: `${(mapY(lat) / 720) * 100}%` }
            const dot = <span className={`${s.pinDot} ${on ? s.pinOn : ''}`} style={{ background: on ? 'var(--accent)' : placeColors[k as PlaceKind] }} />
            const label = hiddenPlaceLabels.includes(name) ? null : <span className={`mono ${s.pinLabel} ${on ? s.pinLabelOn : ''}`}>{name}</span>
            return isPop ? (
              <button key={name} type="button" className={s.pin} style={style} onClick={() => setPop(popNames.indexOf(name))} onFocus={() => setPop(popNames.indexOf(name))} aria-label={name}>
                {dot}
                {label}
              </button>
            ) : (
              <span key={name} className={s.pin} style={style} aria-hidden="true">
                {dot}
                {label}
              </span>
            )
          })}
          <div className={s.pop} style={popStyle(mapX(ap[2]) / 1376, mapY(ap[1]) / 720)} aria-live="polite" key={active.name}>
            <Img k={active.img} alt={active.name} sizes="260px" className={s.popImg} />
            <div className={s.popBody}>
              <div className={s.popRow}>
                <span>{active.name}</span>
                <span>{active.rating}</span>
              </div>
              <div className={s.popMeta}>{active.meta}</div>
              <div className={s.popTimes}>
                {active.times.map((tm) => (
                  <span key={tm}>{tm}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={`mono ${s.legend}`}>
            {m.legend.map(([t, k]) => (
              <span key={t}>
                <i style={{ background: placeColors[k as PlaceKind] }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Flows() {
  const c = useQcText()
  const f = c.flows
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.flow}`, ref.current)
        gsap.from(cards, { y: (i: number) => 60 + (i % 2) * 28, autoAlpha: 0, duration: 0.9, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
        gsap.fromTo(gsap.utils.toArray(`.${s.flowShot}`, ref.current), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, stagger: 0.1, delay: 0.3, ease: 'qw.inOut', scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
        cards.forEach((card, i) => gsap.fromTo(card, { y: i % 2 ? 48 : 20 }, { y: i % 2 ? 8 : -20, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }))
      })
    },
    { scope: ref }
  )
  return (
    <section id="flows" ref={ref} className={`wrap ${s.section}`}>
      <div className="mono muted">{f.kicker}</div>
      <div className={s.secHead}>
        <Reveal as="h2" variant="mask" className={s.h2}>
          {f.title[0]}
          <br />
          {f.title[1]}
        </Reveal>
        <p className={s.secTextDark}>{f.text}</p>
      </div>
      <div className={s.flows}>
        {f.items.map((it) => (
          <article key={it.no} className={s.flow}>
            <div className={s.flowPhoto}>
              <Img k={it.photo} alt={it.photoAlt} sizes="280px" />
              <span className={`mono ${s.flowTag}`}>
                {it.no} {it.cat}
              </span>
            </div>
            <div className={s.flowBody}>
              <h3 className={s.flowTitle}>{it.title}</h3>
              <ol className={s.flowSteps}>
                {it.steps.map((st, i) => (
                  <li key={st} className="mono">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {st}
                  </li>
                ))}
              </ol>
              <div className={s.flowShot}>
                <Img k={it.shot} alt={it.shotAlt} sizes="280px" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function System() {
  const c = useQcText()
  const y = c.system
  const ref = useRef<HTMLElement>(null)
  const [slot, setSlot] = useState(0)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(gsap.utils.toArray(`.${s.swatch}`, ref.current), { scaleX: 0, transformOrigin: '0 50%', duration: 0.6, stagger: 0.04, scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
        gsap.from(gsap.utils.toArray(`.${s.comp} > *`, ref.current), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.06, scrollTrigger: { trigger: `.${s.comp}`, start: 'top 75%', once: true } })
        const t = setInterval(() => setSlot((v) => (v + 1) % 4), 1600)
        return () => clearInterval(t)
      })
    },
    { scope: ref }
  )
  const stateCls = [s.slotA, s.slotSel, s.slotWarn, s.slotTaken]
  return (
    <section id="system" ref={ref} className={s.inkSec} data-theme="ink">
      <div className="wrap">
        <div className="mono ash">{y.kicker}</div>
        <Reveal as="h2" variant="mask" className={s.h2}>
          {y.title[0]}
          <br />
          {y.title[1]}
        </Reveal>
        <div className={s.sysGrid}>
          <div className={`${s.qcPanel}`}>
            <div className={`mono ${s.qcMuted}`}>{y.tokensLabel}</div>
            <div className={s.tokens}>
              {appTokens.map(([n, hex]) => (
                <div key={n}>
                  <div className={s.swatch} style={{ background: hex }} />
                  <div className={`mono ${s.tokName}`}>{n}</div>
                  <div className={`mono ${s.tokHex}`}>{hex}</div>
                </div>
              ))}
            </div>
            <div className={s.typeRow}>
              <span className={s.aa}>Aa</span>
              <div>
                <div className={s.typeName}>{y.typeName}</div>
                <div className={s.typeScale}>{y.typeScale}</div>
              </div>
              <span className={`mono ${s.qcMuted}`}>{y.radii}</span>
            </div>
          </div>
          <div className={`${s.qcPanel} ${s.comp}`}>
            <div className={`mono ${s.qcMuted}`}>{y.compLabel}</div>
            <div className={s.buttons}>
              <span className={s.bPrimary}>{y.buttons[0]}</span>
              <span className={s.bHover}>{y.buttons[1]}</span>
              <span className={s.bLine}>{y.buttons[2]}</span>
              <span className={s.bOff}>{y.buttons[3]}</span>
            </div>
            <div className={s.slotRow}>
              <span className={s.slotA}>{y.slots[0]}</span>
              <span className={s.slotSel}>{y.slots[1]}</span>
              <span className={s.slotWarn}>
                {y.slots[2]} <small>{y.oneLeft}</small>
              </span>
              <span className={s.slotTaken}>{y.slots[3]}</span>
            </div>
            <div className={s.slotDemo} aria-live="off">
              <span className={stateCls[slot]}>19:30</span>
              <span className={`mono ${s.qcMuted}`}>{y.slotStates[slot]}</span>
            </div>
            <div className={s.badges}>
              <span className={s.bdOk}>{y.badges[0]}</span>
              <span className={s.bdInfo}>{y.badges[1]}</span>
              <span className={s.bdWarn}>{y.badges[2]}</span>
              <span className={s.bdBad}>{y.badges[3]}</span>
            </div>
            <div className={s.stepper}>
              <span className={s.stDone}>
                <b>1</b>
                {y.stepper[0]}
              </span>
              <i className={s.stLine} />
              <span className={s.stNow}>
                <b>2</b>
                {y.stepper[1]}
              </span>
              <i className={s.stLineOff} />
              <span className={s.stNext}>
                <b>3</b>
                {y.stepper[2]}
              </span>
            </div>
            <div className={s.banner}>{y.banner}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// F23 — diagonal wipe 20 → 80 % (scrubbed) between night and day; language
// cards fan out; the pills follow the wipe.
function Languages() {
  const c = useQcText()
  const l = c.languages
  const ref = useRef<HTMLElement>(null)
  const [day, setDay] = useState(false)
  const [lang, setLang] = useState(1)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const night = ref.current!.querySelector<HTMLElement>(`.${s.nightLayer}`)!
        const line = ref.current!.querySelector<SVGLineElement>(`.${s.wipeLine}`)!
        const o = { p: 20 }
        gsap.to(o, {
          p: 80,
          ease: 'none',
          scrollTrigger: { trigger: `.${s.wipe}`, start: 'top 75%', end: 'bottom 35%', scrub: 0.8 },
          onUpdate: () => {
            const top = o.p + 8
            const bottom = o.p - 8
            night.style.clipPath = `polygon(0 0, ${top}% 0, ${bottom}% 100%, 0 100%)`
            line.setAttribute('x1', String(top))
            line.setAttribute('x2', String(bottom))
            setDay(o.p < 50)
          }
        })
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.langCard}`, ref.current)
        gsap.from(cards, {
          rotate: 0,
          y: 80,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.18,
          ease: 'qw.snap',
          scrollTrigger: { trigger: `.${s.langStack}`, start: 'top 70%', once: true },
          onComplete: () => void 0
        })
        ScrollTrigger.create({ trigger: `.${s.langStack}`, start: 'top 70%', end: 'bottom 40%', onUpdate: (self) => setLang(Math.min(2, Math.floor(self.progress * 3))) })
      })
    },
    { scope: ref }
  )
  const langOrder = [2, 1, 1] // UZ, RU, RU-night cards → highlighted pill
  return (
    <section id="languages" ref={ref} className={s.inkSec} data-theme="ink">
      <div className="wrap">
        <div className={s.secHead}>
          <div>
            <div className="mono ash">{l.kicker}</div>
            <Reveal as="h2" variant="mask" className={s.h2}>
              {l.title[0]}
              <br />
              {l.title[1]}
            </Reveal>
          </div>
          <div className={s.pills}>
            <div className={s.pillGroup}>
              {l.langs.map((x, i) => (
                <span key={x} className={i === langOrder[lang] ? s.pillOn : ''}>
                  {x}
                </span>
              ))}
            </div>
            <div className={s.pillGroup}>
              <span className={day ? s.pillOn : ''}>{l.themes[0]}</span>
              <span className={!day ? s.pillOn : ''}>{l.themes[1]}</span>
            </div>
          </div>
        </div>
        <div className={s.langGrid}>
          <div className={s.wipe} role="img" aria-label={l.wipeLabel}>
            <Img k="shots/qwerttclients-home" alt="" sizes="820px" className={s.wipeImg} />
            <div className={s.nightLayer} style={{ clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)' }}>
              <Img k="dark/d-home" alt="" sizes="820px" className={s.wipeImg} />
            </div>
            <svg aria-hidden="true" className={s.wipeSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
              <line className={s.wipeLine} x1="58" y1="0" x2="42" y2="100" stroke="#FF4F1F" strokeWidth="0.4" />
            </svg>
            <span className={`mono ${s.wipeTagL}`}>{l.night}</span>
            <span className={`mono ${s.wipeTagR}`}>{l.day}</span>
          </div>
          <div className={s.langStack}>
            {l.cards.map((cd, i) => (
              <div key={cd.img} className={`${s.langCard} ${s[`lc${i}`]}`}>
                <Img k={cd.img} alt={cd.alt} sizes="520px" />
              </div>
            ))}
            <span className={`mono ash ${s.langNote}`}>{l.note}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Engine() {
  const c = useQcText()
  const e = c.engine
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const st = { trigger: `.${s.arch}`, start: 'top 70%', once: true }
        const tl = gsap.timeline({ scrollTrigger: st })
        gsap.utils.toArray<HTMLElement>(`.${s.box}`, ref.current).forEach((b, i) => {
          tl.from(b, { y: 16, autoAlpha: 0, duration: 0.4 }, i * 0.35)
          const arrow = ref.current!.querySelectorAll(`.${s.arrowSvg} path`)[i]
          if (arrow) tl.fromTo(arrow, { strokeDasharray: 80, strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.35 }, i * 0.35 + 0.25)
        })
        tl.from(`.${s.shared}`, { autoAlpha: 0, y: 12, duration: 0.4 }, '>-0.1')
        tl.from(gsap.utils.toArray(`.${s.cap}`, ref.current), { rotateX: -90, transformOrigin: '50% 0', autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'qw.snap' }, '>-0.1')
      })
    },
    { scope: ref }
  )
  return (
    <section id="engine" ref={ref} className={`wrap ${s.section}`}>
      <div className="mono muted">{e.kicker}</div>
      <Reveal as="h2" variant="mask" className={s.h2}>
        {e.title[0]}
        <br />
        {e.title[1]}
      </Reveal>
      <div className={s.engineGrid}>
        <div className={s.arch} role="img" aria-label={e.archLabel}>
          <div className={s.archRow}>
            {e.boxes.map((b, i) => (
              <div key={b.k} className={`${s.box} ${i === 1 ? s.boxInk : ''}`} style={{ gridColumn: i * 2 + 1, order: i * 2 + 1 }}>
                <div className="mono muted">{b.k}</div>
                <div className={s.boxT}>{b.t}</div>
                <div className={s.boxD}>{b.d}</div>
              </div>
            ))}
            {[2, 4].map((col) => (
              <svg key={col} className={s.arrowSvg} style={{ gridColumn: col, gridRow: 1, order: col }} width="56" height="20" viewBox="0 0 56 20" fill="none" stroke="#111110" strokeWidth="1.5" aria-hidden="true">
                <path d="M2 10h50M44 4l8 6-8 6" />
              </svg>
            ))}
          </div>
          <div className={s.shared}>
            <span>{e.shared}</span>
            <span className="mono muted">{e.sharedNote}</span>
          </div>
          <div className={s.caps}>
            {e.caps.map((cp) => (
              <div key={cp.t} className={s.cap}>
                <div className={s.capT}>{cp.t}</div>
                <div className={s.capD}>{cp.d}</div>
              </div>
            ))}
          </div>
        </div>
        <ProofConsole tests={testsCase} withCard={false} title="npm test" />
      </div>
    </section>
  )
}

// F24 — pinned ~200vh: vertical scroll moves the row sideways; centre card
// scales to 1, others .92 and dimmed; counter flips; velocity skew ≤ 4°.
function Strip() {
  const c = useQcText()
  const st = c.strip
  const isStatic = useStatic()
  const ref = useRef<HTMLElement>(null)
  const [idx, setIdx] = useState(2)
  useGSAP(
    () => {
      if (isStatic) return
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const row = el.querySelector<HTMLElement>(`.${s.row}`)!
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.stripCard}`, el)
        const bar = el.querySelector<HTMLElement>(`.${s.stripBar} span`)
        const skew = gsap.quickTo(row, 'skewX', { duration: 0.4, ease: 'power3.out' })
        let last = -1
        gsap.to(row, {
          x: () => -(row.scrollWidth - innerWidth + 64),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=100%',
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress
              const center = p * (cards.length - 1)
              cards.forEach((cd, i) => {
                const d = Math.min(1, Math.abs(i - center))
                gsap.set(cd, { scale: 1 - 0.08 * d, opacity: 1 - 0.3 * d })
              })
              const i = Math.round(center)
              if (i !== last) {
                last = i
                setIdx(i)
              }
              if (bar) gsap.set(bar, { scaleX: p })
              skew(gsap.utils.clamp(-4, 4, self.getVelocity() / -300))
            }
          }
        })
      })
    },
    { scope: ref, dependencies: [isStatic] }
  )
  return (
    <section id="screens" ref={ref} className={s.strip} aria-label={st.label} data-theme="ink">
      <div className={`wrap ${s.secHead}`}>
        <div>
          <div className="mono ash">{st.kicker}</div>
          <Reveal as="h2" variant="mask" className={s.h2s}>
            {st.title[0]}
            <br />
            {st.title[1]}
          </Reveal>
        </div>
        <span className="mono ash">
          <FlapText text={`${String(idx + 1).padStart(2, '0')} / ${String(st.items.length).padStart(2, '0')}`} run seed={idx + 3} />
        </span>
      </div>
      <div className={`${s.row} ${isStatic ? s.rowStatic : ''}`} tabIndex={isStatic ? 0 : -1}>
        {st.items.map((it, i) => (
          <figure key={it.cap} className={s.stripCard}>
            <div className={s.stripShot}>
              <Img k={it.img} alt={it.alt} sizes="600px" />
            </div>
            <figcaption className="mono ash">
              {String(i + 1).padStart(2, '0')} — {it.cap}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="wrap">
        <div className={s.stripBar}>
          <span />
        </div>
      </div>
    </section>
  )
}

function Result() {
  const c = useQcText()
  const r = c.result
  const { openConnect } = useNav()
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.to(`.${s.talkArrow}`, { x: 6, duration: 0.4, yoyo: true, repeat: -1, repeatDelay: 1.6, ease: 'sine.inOut' })
      })
    },
    { scope: ref }
  )
  return (
    <section id="result" ref={ref} className={`wrap ${s.section} ${s.result}`}>
      <div className="mono muted">{r.kicker}</div>
      <Reveal variant="rule" className={s.outcomes}>
        {r.items.map(([t, d]) => (
          <div key={t} className={s.outcome}>
            <span className={s.ruleLine} data-rule aria-hidden="true" />
            <div className={s.outT} data-rise>
              {t}
            </div>
            <p data-rise>{d}</p>
          </div>
        ))}
      </Reveal>
      <a href="#connect" className={s.ctaRow} onClick={(e) => (e.preventDefault(), openConnect())} data-cursor="board">
        <Reveal as="span" variant="track" className={s.ctaText}>
          {r.cta[0]}
          <br />
          {r.cta[1]}
        </Reveal>
        <Magnetic max={12} strength={0.3}>
          <span className={s.talk}>
            {r.talk}
            <span className={s.talkArrow}>
              <Arrow w={48} h={28} />
            </span>
          </span>
        </Magnetic>
      </a>
      <div className={s.resultFoot}>
        <MaybeLink className="btn btn-ink" href={links.qwerttclientsScreens}>
          {r.screens}
        </MaybeLink>
        <span className="mono muted">{r.credit}</span>
      </div>
    </section>
  )
}

export default function CaseQc() {
  const t = useT()
  const c = useQcText()
  return (
    <>
      <SeatTag seat={c.seat} />
      <RailDock />
      <section className={s.hero} data-theme="ink" aria-label={c.title}>
        <CabinLight />
        <div className="wrap">
          <div className={`mono ash ${s.heroMeta}`}>
            <span className={s.heroKicker}>
              <PunchMark shape="ticket" cell={4} />
              {c.kicker}
            </span>
            <span>{c.date}</span>
          </div>
          <Board />
          <div className={s.heroBottom}>
            <Reveal as="h1" variant="track" className={s.h1}>
              {c.title}
            </Reveal>
            <div className={s.pitch}>
              <p>{c.pitch}</p>
              <div className={`mono ash ${s.hint}`}>
                <MouseIcon w={16} h={24} />
                {c.hint}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Problem />
      <City />
      <Flows />
      <System />
      <Languages />
      <Engine />
      <Strip />
      <Result />
      <NextDepartures
        ink
        mark="film"
        rows={[
          { to: '/work/kinoqwertt', a: 'kino', img: 'shots/kinoqwertt-home', b: 'qwertt', chip: 'boarding' },
          { to: '#connect', a: t.nextDepartures.your, b: t.nextDepartures.project, chip: 'gate', open: true }
        ]}
      />
      <PageEnd page="qc" />
    </>
  )
}
