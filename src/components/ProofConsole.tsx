import { useGSAP } from '../motion/useMotion'
import { useRef } from 'react'
import { useT } from '../content/i18n'
import { terminal, testsHome } from '../content/shared'
import { gsap, MQ } from '../motion/engine'
import Counter from './motion/Counter'
import s from './Case.module.css'

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
