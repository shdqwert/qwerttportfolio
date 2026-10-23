import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { TLink } from '../../app/Nav'
import { ScreenGallery } from '../../components/CaseBits'
import { MaybeLink } from '../../components/Common'
import Reveal from '../../components/motion/Reveal'
import PunchMark from '../../components/motion/PunchMark'
import { CabinLight } from '../../components/PageEnd'
import ScrollStage from '../../components/ScrollStage'
import { NumberedList } from '../../components/Shared'
import { useHomeText } from '../../content/pages/home'
import { cssLines, links } from '../../content/shared'
import { gsap, MQ } from '../../motion/engine'
import { getLight } from '../../motion/light'
import s from './Home.module.css'

// Case 02 on the home page. F12 + L8: the ink section arrives through a
// "lights dimming" circle that expands from the pointer (centre on touch),
// scrubbed over 35vh. L10: a faint projector beam with drifting dust.
export default function KinoHome() {
  const { kinoHome: k } = useHomeText()
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        let top = 0
        const st = { trigger: el, start: 'top bottom', end: () => `top+=${innerHeight * 0.35} bottom-=${innerHeight * 0.35}`, scrub: 0.8, onRefresh: () => (top = el.getBoundingClientRect().top + scrollY) }
        const o = { r: 0 }
        gsap.to(o, {
          r: 150,
          ease: 'none',
          scrollTrigger: st,
          onUpdate: () => {
            const p = getLight()
            el.style.clipPath = o.r >= 149 ? '' : `circle(${o.r}% at ${p.x}px ${p.y + scrollY - top}px)`
          }
        })
      })
    },
    { scope: ref }
  )
  return (
    <section id="case-02" ref={ref} className={s.kino} data-theme="ink" aria-label={k.title}>
      <CabinLight />
      <span className={s.beam} aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${-i * 0.7}s` }} />
        ))}
      </span>
      <div className={`wrap ${s.kinoIn}`}>
        <div className={`mono ${s.caseMeta} ash`}>
          <span>{k.index}</span>
          <span>{k.meta}</span>
        </div>
        <div className={s.caseHead}>
          <PunchMark shape="film" from="ticket" cell={14} />
          <Reveal as="h2" variant="track" className={s.caseTitle}>
            {k.title}
          </Reveal>
        </div>
        <Reveal as="p" variant="mask" className={s.caseLead}>
          {k.lead}
        </Reveal>
        <Reveal as="dl" className={s.facts} stagger={0.08}>
          {k.facts.map(([a, b], i) => (
            <div key={a}>
              <dt className="mono ash">{a}</dt>
              <dd>
                {i === 3 ? (
                  <a href={links.kinoqwerttLive} target="_blank" rel="noopener noreferrer" className="ulink">
                    {b}
                  </a>
                ) : (
                  b
                )}
              </dd>
            </div>
          ))}
        </Reveal>
        <Reveal className={s.cards3} variant="clip" targets={`.${s.card3}`} stagger={0.1}>
          {k.cards.map(([a, b], i) => (
            <div key={a} className={`${s.card3} ${i === 2 ? s.card3Paper : ''}`}>
              <span className="mono">{a}</span>
              <p>{b}</p>
            </div>
          ))}
        </Reveal>
        <ScrollStage stage={k.stage} />
        <ScreenGallery screens={k.screens} credit={k.screensCredit} dark />
        <div className={s.cols}>
          <NumberedList title={k.listTitle} items={k.list} dark />
          <div className={s.aside}>
            <div className={s.codecard}>
              <div className={`mono ash ${s.codeHead}`}>
                <span>{k.codeLabel}</span>
                <span>{k.excerpt}</span>
              </div>
              <Reveal as="pre" variant="fade" className={s.pre} stagger={0.06}>
                <span className={s.comment}>{k.comment + '\n'}</span>
                {cssLines.map((l, i) => (
                  <span key={i}>{l + '\n'}</span>
                ))}
              </Reveal>
            </div>
            <div className={s.panelPaper}>
              <div className="mono muted">{k.clientLabel}</div>
              <p>{k.clientText}</p>
            </div>
            <div className="btn-row">
              <TLink className="btn btn-paper" to="/work/kinoqwertt">
                {k.readCase}
              </TLink>
              <MaybeLink className="btn btn-ghost" href={links.kinoqwerttLive}>
                {k.live}
              </MaybeLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
