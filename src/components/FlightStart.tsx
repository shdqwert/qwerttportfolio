import type { RefObject } from 'react'
import { useT } from '../content/i18n'
import { flightText } from '../content/pages/flight'
import s from './BoardingFlight.module.css'
// Start-slot placeholder (reserves the space; optional hint under it).
export default function FlightStart({ startRef, className, hint }: { startRef: RefObject<HTMLDivElement | null>; className?: string; hint?: boolean }) {
  const { lang } = useT()
  return (
    <div ref={startRef} className={`${s.start} ${className || ''}`} aria-hidden="true">
      {hint && (
        <span className={`mono ${s.hint}`}>
          <i />
          {flightText[lang].hint}
        </span>
      )}
    </div>
  )
}
