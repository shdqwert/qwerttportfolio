import s from './RollLabel.module.css'

// Nav / button label: on hover each character rolls up (yPercent 0 → −100)
// while its aria-hidden duplicate rolls in, 12 ms stagger per character.
export default function RollLabel({ children }: { children: string }) {
  return (
    <span className={s.roll}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className={s.chars}>
        {[...children].map((c, i) => (
          <span key={i} className={s.col} style={{ ['--i' as string]: i }}>
            <span>{c === ' ' ? ' ' : c}</span>
            <span>{c === ' ' ? ' ' : c}</span>
          </span>
        ))}
      </span>
    </span>
  )
}
