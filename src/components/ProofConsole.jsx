import { proof } from '../content/portfolio.js'
import { useCountUp, useReveal } from '../lib/motion.js'

function Stat({ stat, run, armed }) {
  const n = useCountUp(stat.value, run)
  return (
    <div className="proof__stat">
      <div className="proof__num">
        {armed ? 0 : n}
        {stat.suffix}
      </div>
      <div className="mono muted">{stat.label}</div>
    </div>
  )
}

// F4 — the real `npm test` output types in line by line once it is in view.
// All text is in the DOM from the start; only visibility is animated.
export default function ProofConsole() {
  const [ref, cls, inView] = useReveal({ threshold: 0.4 })
  const armed = cls === 'rv'
  const total = useCountUp(proof.total, inView, { duration: 500 })
  const lines = proof.tests.length

  return (
    <div className="proof" ref={ref}>
      <div className={`terminal ${cls}`} style={{ '--lines': lines }}>
        <div className="terminal__bar">
          <span className="terminal__dot" />
          <span className="terminal__dot" />
          <span className="terminal__dot" />
          <span className="mono terminal__title">{proof.title}</span>
        </div>
        <div className="terminal__body">
          <div className="terminal__line" style={{ '--i': 0 }}>
            <span className="accent-text">{proof.prompt}</span> <span className="ash">$</span> {proof.command}
          </div>
          {proof.tests.map((t, i) => (
            <div className="terminal__line" key={t} style={{ '--i': i + 1 }}>
              <span className="ok-text tick">✔</span> <span className="terminal__soft">{t}</span>
            </div>
          ))}
          <div className="terminal__line ash" style={{ '--i': lines + 1 }}>
            {'  '}
            {proof.more}
          </div>
          <div className="terminal__line terminal__sum" style={{ '--i': lines + 2 }}>
            <span className="ash">ℹ</span> tests {armed ? 0 : total} · <span className="ok-text">pass {armed ? 0 : total}</span> · fail 0 · {proof.duration}
          </div>
          <div className="terminal__line" style={{ '--i': lines + 3 }}>
            <span className="accent-text">{proof.prompt}</span> <span className="ash">$</span> <span className="terminal__cursor" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="proof__card">
        <div className="mono muted">Proof, not promises</div>
        <p className="proof__lead">Don’t take my word for it. Here are the checks.</p>
        <div className="proof__stats">
          {proof.stats.map((s) => (
            <Stat key={s.label} stat={s} run={inView} armed={armed} />
          ))}
        </div>
      </div>
    </div>
  )
}
