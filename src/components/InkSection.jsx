import { clamp, useReducedMotion, useScrollProgress } from '../lib/motion.js'

// F12 — paper → ink hand-over. The ink section enters as an inset, rounded
// panel and opens to full bleed as its top reaches mid-screen. Text colour is
// set by the section itself, so contrast never drops mid-transition.
export default function InkSection({ id, className = '', children, label }) {
  const reduced = useReducedMotion()
  const ref = useScrollProgress(
    (_, r, vh, el) => {
      const k = 1 - clamp((vh - r.top) / (vh * 0.5))
      el.style.setProperty('--inset', `${(k * 32).toFixed(1)}px`)
    },
    { enabled: !reduced }
  )
  return (
    <section id={id} ref={ref} className={`ink ${className}`} data-theme="ink" aria-label={label}>
      {children}
    </section>
  )
}
