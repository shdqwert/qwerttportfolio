import { useGSAP } from '@gsap/react'
import { useMemo, useRef, useState } from 'react'
import { useT } from '../content/i18n'
import { img as imgData, type ImgKey } from '../content/shared'
import { gsap, MQ } from '../motion/engine'
import { useStatic } from '../motion/hooks'
import { Img, MouseIcon } from './Common'
import { BrowserFrame } from './Shared'
import s from './Case.module.css'

type Stage = {
  label: string
  railLabel: string
  url: string
  chapters: { t: string; d: string; img: ImgKey; alt: string }[]
  callouts: { text: string; from: number; to: number; x: string; y: string }[]
}

function segmentsOf(chapters: Stage['chapters']) {
  const segs: { img: ImgKey; alt: string; start: number; end: number }[] = []
  chapters.forEach((c, i) => {
    const last = segs[segs.length - 1]
    if (last && last.img === c.img) last.end = i
    else segs.push({ img: c.img, alt: c.alt, start: i, end: i })
  })
  return segs
}

// F1 / F2 — pinned (pin: true, ~400vh), scrub 1. Inside each chapter the
// screenshot's y follows progress; chapters cross-fade over 6 % of progress.
export default function ScrollStage({ stage, dark = true }: { stage: Stage; dark?: boolean }) {
  const { ui } = useT()
  const isStatic = useStatic()
  const segs = useMemo(() => segmentsOf(stage.chapters), [stage.chapters])
  const n = stage.chapters.length
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const view = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (isStatic) return
      const el = ref.current
      const v = view.current
      if (!el || !v) return
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const imgs = gsap.utils.toArray<HTMLImageElement>(`.${s.stageImg}`, el)
        const bars = gsap.utils.toArray<HTMLElement>(`.${s.bar} span`, el)
        const callouts = gsap.utils.toArray<HTMLElement>(`.${s.callout}`, el)
        const thumb = el.querySelector<HTMLElement>(`.${s.thumb}`)
        let last = -1
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'center center',
            end: '+=300%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const f = self.progress * n
              const idx = Math.min(n - 1, Math.floor(f))
              if (idx !== last) {
                last = idx
                setActive(idx)
              }
              bars.forEach((b, i) => gsap.set(b, { scaleX: i < idx ? 1 : i === idx ? f - idx : 0 }))
            }
          }
        })
        tl.set({}, {}, 1)
        segs.forEach((seg, k) => {
          const im = imgData(seg.img)
          const a = seg.start / n
          const len = (seg.end - seg.start + 1) / n
          tl.fromTo(imgs[k], { y: 0 }, { y: () => -Math.max(0, (v.clientWidth * im.h) / im.w - v.clientHeight), duration: len }, a)
          if (k > 0) {
            tl.fromTo(imgs[k], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, a - 0.03)
            tl.to(imgs[k - 1], { autoAlpha: 0, duration: 0.06 }, a - 0.03)
          }
        })
        stage.callouts.forEach((c, i) => {
          tl.fromTo(callouts[i], { autoAlpha: 0, scale: 0.8, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.04, ease: 'qw.snap' }, c.from)
          tl.to(callouts[i], { autoAlpha: 0, y: -8, duration: 0.04 }, c.to)
        })
        if (thumb) tl.fromTo(thumb, { yPercent: 0 }, { yPercent: 355, duration: 1 }, 0)
      })
    },
    { scope: ref, dependencies: [isStatic, stage] }
  )

  if (isStatic) {
    return (
      <div className={`${s.stageStatic} ${dark ? s.dark : ''}`} role="group" aria-label={stage.label}>
        <span className={`mono ${s.railLabel}`}>{stage.railLabel}</span>
        <ol className={s.staticList}>
          {stage.chapters.map((c, i) => {
            const seg = segs.find((g) => i >= g.start && i <= g.end)!
            const span = seg.end - seg.start
            const y = span ? Math.round(((i - seg.start) / span) * 60) : 0
            return (
              <li key={c.t}>
                <BrowserFrame url={stage.url} dark className={s.staticFrame}>
                  <Img k={c.img} alt={c.alt} sizes="400px" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${y}%` }} />
                </BrowserFrame>
                <div className={s.staticText}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className={s.chTitle}>{c.t}</div>
                    <p className={s.chText}>{c.d}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  const activeSeg = segs.findIndex((g) => active >= g.start && active <= g.end)
  return (
    <div ref={ref} className={`${s.stage} ${dark ? s.dark : ''}`} role="group" aria-label={stage.label}>
      <BrowserFrame url={stage.url} dark className={s.stageBrowser} viewRef={view}>
        {segs.map((g, k) => (
          <Img key={g.start} k={g.img} alt={k === activeSeg ? g.alt : ''} sizes="960px" className={s.stageImg} style={{ opacity: k === 0 ? 1 : 0 }} />
        ))}
        {stage.callouts.map((c) => (
          <div key={c.text} className={s.callout} style={{ left: c.x, top: c.y }}>
            <span className={s.calloutDot} aria-hidden="true" />
            <span className={s.calloutLabel}>{c.text}</span>
          </div>
        ))}
        <div className={s.scrollbar} aria-hidden="true">
          <span className={s.thumb} />
        </div>
      </BrowserFrame>
      <div className={s.rail}>
        <span className={`mono ${s.railLabel}`}>{stage.railLabel}</span>
        <ol className={s.chapters}>
          {stage.chapters.map((c, i) => (
            <li key={c.t} className={`${s.chapter} ${i === active ? s.chOn : ''}`} aria-current={i === active ? 'step' : undefined}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className={s.chTitle}>{c.t}</div>
                <div className={s.chMore}>
                  <div className={s.chInner}>
                    <p className={s.chText}>{c.d}</p>
                    <div className={s.bar}>
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className={s.hint}>
          <MouseIcon />
          <span>
            {ui.keepScrolling[0]}
            <br />
            {ui.keepScrolling[1]}
          </span>
        </div>
      </div>
    </div>
  )
}
