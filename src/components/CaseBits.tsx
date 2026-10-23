import { useGSAP } from '@gsap/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '../content/i18n'
import { img, terminal, testsHome, type ImgKey } from '../content/shared'
import { Flip, gsap, isReduced, MQ } from '../motion/engine'
import { clamp } from '../motion/hooks'
import { Img } from './Common'
import Counter from './motion/Counter'
import Reveal from './motion/Reveal'
import { useDialog } from './useDialog'
import s from './Case.module.css'

type Screen = { img: ImgKey; alt: string; caption: string }

function Lightbox({ screens, index, onClose, onMove, flipState }: { screens: Screen[]; index: number; onClose: () => void; onMove: (d: number) => void; flipState: Flip.FlipState | null }) {
  const { ui } = useT()
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  useDialog(true, onClose, panel, closeBtn)
  useEffect(() => {
    if (flipState && panel.current && !isReduced()) Flip.from(flipState, { targets: panel.current, duration: 0.7, ease: 'qw.inOut', scale: true, absolute: true })
  }, [flipState])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onMove])
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0
  }, [index])
  const sc = screens[index]
  return (
    <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={ui.screenOf(index + 1, screens.length, sc.caption)}>
      <div className={s.lbBackdrop} onClick={onClose} />
      <div ref={panel} className={s.lbPanel} data-flip-id={`screen-${index}`}>
        <div className={s.lbBar}>
          <span className="mono">
            {String(index + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')} · {sc.caption}
          </span>
          <div className={s.lbActions}>
            <button type="button" className={s.small} onClick={() => onMove(-1)} aria-label={ui.prevScreen}>
              ←
            </button>
            <button type="button" className={s.small} onClick={() => onMove(1)} aria-label={ui.nextScreen}>
              →
            </button>
            <button type="button" className={s.small} onClick={onClose} ref={closeBtn}>
              {ui.close}
            </button>
          </div>
        </div>
        <div ref={scroller} className={s.lbScroll} tabIndex={0} aria-label={ui.fullScreenshot} data-lenis-prevent>
          <Img k={sc.img} alt={sc.alt} sizes="1100px" eager />
        </div>
      </div>
    </div>
  )
}

// Three real screens: rise + inner scale 1.06 → 1; hover lift 6 px + sheen,
// cursor VIEW; click opens a lightbox that Flips out of the thumbnail.
export function ScreenGallery({ screens, credit, dark }: { screens: Screen[]; credit?: string; dark?: boolean }) {
  const { ui } = useT()
  const [open, setOpen] = useState<number | null>(null)
  const [flip, setFlip] = useState<Flip.FlipState | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const figs = gsap.utils.toArray<HTMLElement>(`.${s.screen}`, ref.current)
        const st = { trigger: ref.current, start: 'top 82%', once: true }
        gsap.from(figs, { y: 32, autoAlpha: 0, duration: 0.9, stagger: 0.12, scrollTrigger: st })
        gsap.from(gsap.utils.toArray(`.${s.screen} img`, ref.current), { scale: 1.06, duration: 1.2, stagger: 0.12, scrollTrigger: st })
      })
    },
    { scope: ref }
  )
  const openAt = (i: number, el: HTMLElement) => {
    setFlip(Flip.getState(el))
    setOpen(i)
  }
  const close = useCallback(() => setOpen(null), [])
  const move = useCallback((d: number) => {
    setFlip(null)
    setOpen((i) => (i === null ? i : (i + d + screens.length) % screens.length))
  }, [screens.length])
  return (
    <>
      <div ref={ref} className={s.screens}>
        {screens.map((sc, i) => (
          <figure className={s.screen} key={sc.caption}>
            <button type="button" className={`${s.shot} ${dark ? s.shotDark : ''}`} data-flip-id={`screen-${i}`} data-cursor="view" onClick={(e) => openAt(i, e.currentTarget)} aria-label={ui.viewScreen + sc.caption}>
              <Img k={sc.img} alt={sc.alt} sizes="460px" />
              <span className={s.shotSheen} aria-hidden="true" />
            </button>
            <figcaption className={`mono ${s.caption}`}>{sc.caption}</figcaption>
          </figure>
        ))}
      </div>
      {credit && <p className={`mono ${s.credit}`}>{credit}</p>}
      {/* portal: siblings of the gallery may be wrapped in pin-spacers by GSAP */}
      {open !== null && createPortal(<Lightbox screens={screens} index={open} onClose={close} onMove={move} flipState={flip} />, document.body)}
    </>
  )
}

// F3 — Design → Code: clip-path on the design layer, pointer drag with
// inertia, one-time hint 50 → 30 → 70 → 54 % (1.4 s), keyboard ← → Home End.
export function CompareSlider({ design, built }: { design: ImgKey; built: ImgKey }) {
  const { compare: c } = useT()
  const box = useRef<HTMLDivElement>(null)
  const state = useRef({ pos: 54, touched: false, dragging: false, lastX: 0, lastT: 0, v: 0 })
  const [value, setValue] = useState(54)
  const apply = useCallback((p: number) => {
    state.current.pos = clamp(p, 0, 100)
    box.current?.style.setProperty('--pos', `${state.current.pos}%`)
    setValue(Math.round(state.current.pos))
  }, [])
  const tween = useRef<gsap.core.Tween | null>(null)

  useGSAP(
    () => {
      const el = box.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const o = { p: 50 }
        const hint = gsap.timeline({ paused: true, onUpdate: () => { if (!state.current.touched) apply(o.p) } })
        hint.to(o, { p: 30, duration: 0.45, ease: 'qw.inOut' }).to(o, { p: 70, duration: 0.5, ease: 'qw.inOut' }).to(o, { p: 54, duration: 0.45, ease: 'qw.inOut' })
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 70%', once: true, onEnter: () => { if (!state.current.touched) hint.play() } } })
      })
    },
    { scope: box }
  )

  const fromPointer = (x: number) => {
    const r = box.current!.getBoundingClientRect()
    apply(((x - r.left) / r.width) * 100)
  }
  const touch = () => {
    state.current.touched = true
    tween.current?.kill()
    gsap.killTweensOf(state.current)
  }
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    touch()
    const st = state.current
    st.dragging = true
    st.lastX = e.clientX
    st.lastT = performance.now()
    st.v = 0
    box.current!.setPointerCapture(e.pointerId)
    fromPointer(e.clientX)
  }
  const onMove = (e: React.PointerEvent) => {
    const st = state.current
    if (!st.dragging) return
    const now = performance.now()
    const r = box.current!.getBoundingClientRect()
    st.v = (((e.clientX - st.lastX) / r.width) * 100) / Math.max(1, now - st.lastT)
    st.lastX = e.clientX
    st.lastT = now
    fromPointer(e.clientX)
  }
  const onUp = () => {
    const st = state.current
    if (!st.dragging) return
    st.dragging = false
    if (isReduced() || Math.abs(st.v) < 0.01) return
    const o = { p: st.pos }
    tween.current = gsap.to(o, { p: clamp(st.pos + st.v * 180, 0, 100), duration: 0.6, ease: 'power3.out', onUpdate: () => apply(o.p) })
  }
  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }
    let next: number | null = null
    if (e.key in map) next = state.current.pos + map[e.key]
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 100
    if (next === null) return
    e.preventDefault()
    touch()
    apply(next)
  }
  const d = img(design)
  return (
    <div className={s.compare}>
      <div className={s.compareHead}>
        <div>
          <div className="mono muted">{c.label}</div>
          <Reveal as="h3" variant="mask" className={s.compareTitle}>
            {c.title[0]}
            <br />
            {c.title[1]}
          </Reveal>
        </div>
        <p className={s.compareText}>{c.text}</p>
      </div>
      <div ref={box} className={s.compareBox} style={{ ['--pos' as string]: '54%', aspectRatio: `${d.w} / ${d.h}` }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} data-cursor="drag">
        <Img k={built} alt={c.builtAlt} sizes="1376px" className={s.compareBuilt} draggable={false} />
        <Img k={design} alt={c.designAlt} sizes="1376px" className={s.compareDesign} draggable={false} />
        <div className={s.compareLine} aria-hidden="true" />
        <div className={s.handle} role="slider" tabIndex={0} aria-label={c.aria} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={c.valueText(value)} onKeyDown={onKey}>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M8 2 2 8l6 6" />
          </svg>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m2 2 6 6-6 6" />
          </svg>
        </div>
        <span className={`mono ${s.tag} ${s.tagDesign}`}>{c.designTag}</span>
        <span className={`mono ${s.tag} ${s.tagBuilt}`}>{c.builtTag}</span>
      </div>
    </div>
  )
}

// F4 — the real `npm test` output types in line by line (40 ms/line) at 40 %
// visibility; summary + stats count up. All text is in the DOM from the start.
export function ProofConsole({ tests = testsHome, withCard = true, title = terminal.title }: { tests?: string[]; withCard?: boolean; title?: string }) {
  const { proof } = useT()
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const lines = gsap.utils.toArray<HTMLElement>(`.${s.tLine}`, el)
        gsap.set(lines, { autoAlpha: 0 })
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 60%', once: true } })
        lines.forEach((l, i) => {
          tl.set(l, { autoAlpha: 1 }, 0.15 + i * 0.04)
          const tick = l.querySelector(`.${s.tick}`)
          if (tick) tl.fromTo(tick, { color: '#ffffff', textShadow: '0 0 8px #4ADE80' }, { color: '#4ADE80', textShadow: '0 0 0 transparent', duration: 0.2 }, 0.15 + i * 0.04)
        })
        const sum = el.querySelector<HTMLElement>(`.${s.sumNum}`)
        if (sum) {
          const o = { v: 0 }
          tl.fromTo(o, { v: 0 }, { v: terminal.total, duration: 0.6, ease: 'power2.out', onUpdate: () => { sum.textContent = String(Math.round(o.v)) } }, '>-0.1')
        }
      })
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={withCard ? s.proof : ''}>
      <div className={s.terminal} lang="en">
        <div className={s.tBar}>
          <span className={s.tDot} />
          <span className={s.tDot} />
          <span className={s.tDot} />
          <span className={`mono ${s.tTitle}`}>{title}</span>
        </div>
        <div className={s.tBody}>
          <div className={s.tLine}>
            <span className={s.prompt}>{terminal.prompt}</span> <span className="ash">$</span> {terminal.command}
          </div>
          {tests.map((t) => (
            <div className={s.tLine} key={t}>
              <span className={s.tick}>✔</span> <span className={s.soft}>{t}</span>
            </div>
          ))}
          {tests === testsHome && <div className={`${s.tLine} ash`}>{'  '}{terminal.more}</div>}
          <div className={`${s.tLine} ${s.sum}`}>
            <span className="ash">ℹ</span> tests <span className={s.sumNum}>{terminal.total}</span> · <span className={s.ok}>pass {terminal.total}</span> · fail 0 · {terminal.duration}
          </div>
          <div className={s.tLine}>
            <span className={s.prompt}>{terminal.prompt}</span> <span className="ash">$</span> <span className={s.cursor} aria-hidden="true" />
          </div>
        </div>
      </div>
      {withCard && (
        <div className={s.proofCard}>
          <div className="mono muted">{proof.label}</div>
          <p className={s.proofLead}>{proof.lead}</p>
          <div className={s.stats}>
            {proof.stats.map((st, i) => (
              <div key={st.label} className={s.stat}>
                <Counter to={st.value} suffix={st.suffix} className={s.statNum} delay={i * 0.1} start="top 70%" />
                <div className="mono muted">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
