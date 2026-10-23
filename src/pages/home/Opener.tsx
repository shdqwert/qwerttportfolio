import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { CabinLight } from '../../components/PageEnd'
import { Img, MouseIcon } from '../../components/Common'
import PunchMark from '../../components/motion/PunchMark'
import { useHomeText } from '../../content/pages/home'
import { gsap, MQ } from '../../motion/engine'
import { useStatic } from '../../motion/hooks'
import s from './Home.module.css'

// F17 — "Book a ___": pinned ~300vh. Progress in 5 parts: the reel rolls one
// word (qw.inOut), the photo cross-fades with a slow push-in, the thumbnail
// outline moves, the 5-segment bar fills.
export default function Opener() {
  const { opener: o } = useHomeText()
  const isStatic = useStatic()
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const n = o.words.length

  useGSAP(
    () => {
      if (isStatic) return
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const reel = el.querySelector<HTMLElement>(`.${s.reel}`)!
        const photos = gsap.utils.toArray<HTMLElement>(`.${s.openerPhoto}`, el)
        const segs = gsap.utils.toArray<HTMLElement>(`.${s.seg} i`, el)
        const ring = el.querySelector<HTMLElement>(`.${s.thumbRing}`)
        const step = () => (el.querySelector<HTMLElement>(`.${s.thumbRow}`)?.offsetHeight || 88) + 10
        let last = 0
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=200%',
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(n - 1, Math.floor(self.progress * n))
              if (idx !== last) {
                last = idx
                setActive(idx)
              }
            }
          }
        })
        tl.set({}, {}, 1)
        gsap.set(photos.slice(1), { autoAlpha: 0 })
        tl.fromTo(photos[0], { scale: 1.06 }, { scale: 1, duration: 0.2 }, 0)
        segs.forEach((g, i) => tl.fromTo(g, { scaleX: 0 }, { scaleX: 1, duration: 1 / n }, i / n))
        for (let i = 1; i < n; i++) {
          const at = i / n - 0.05
          tl.to(reel, { yPercent: (-100 / (n + 2)) * i, duration: 0.1, ease: 'qw.inOut' }, at)
          tl.to(photos[i - 1], { autoAlpha: 0, duration: 0.1 }, at)
          tl.fromTo(photos[i], { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, at)
          if (ring) tl.to(ring, { y: () => step() * i, duration: 0.1, ease: 'qw.inOut' }, at)
        }
      })
    },
    { scope: ref, dependencies: [isStatic, n] }
  )

  const shown = isStatic ? 0 : active
  return (
    <section id="work" ref={ref} className={s.opener} data-theme="ink" aria-label={o.label}>
      <CabinLight />
      {o.words.map((w, i) => (
        <Img key={w.word} k={w.img} alt={i === shown ? w.alt : ''} sizes="70vw" className={s.openerPhoto} style={{ opacity: i === 0 ? 1 : 0 }} />
      ))}
      <div className={s.openerShade} aria-hidden="true" />
      <div className={s.openerLeft} aria-hidden="true" />
      <div className={`mono ${s.openerTop}`}>
        <span className={s.openerLabel}>
          <PunchMark shape="ticket" cell={4} />
          {o.label}
        </span>
        <span className={s.openerMeta}>{o.meta}</span>
      </div>
      <div className={s.openerTitle}>
        <span className={s.bookA}>{o.bookA}</span>
        <span className={s.reelBox}>
          <span className="sr-only" aria-live="polite">
            {o.words[shown].word}
          </span>
          <span className={s.reel} aria-hidden="true">
            <span className={s.reelWord}>{o.words[n - 1].word}</span>
            {o.words.map((w, i) => (
              <span key={w.word} className={`${s.reelWord} ${i === shown ? s.reelOn : ''}`}>
                {w.word}
                {i === shown && <span className={s.stop}>.</span>}
              </span>
            ))}
            <span className={s.reelWord}>{o.words[0].word}</span>
          </span>
        </span>
      </div>
      <div className={s.thumbs} aria-hidden="true">
        <span className={s.thumbRing} />
        {o.words.map((w, i) => (
          <div key={w.word} className={`${s.thumbRow} ${i === shown ? s.thumbOn : ''}`}>
            <span className="mono">{w.word}</span>
            <span className={s.thumb}>
              <Img k={w.img} alt="" sizes="120px" />
            </span>
          </div>
        ))}
      </div>
      <div className={`mono ${s.openerBottom}`}>
        <span className={s.openerHint}>
          <MouseIcon w={16} h={24} />
          {o.hint}
        </span>
        <span className={s.seg} aria-hidden="true">
          {o.words.map((w) => (
            <i key={w.word} />
          ))}
        </span>
        <span className={s.openerMeta}>{o.credit}</span>
      </div>
    </section>
  )
}
