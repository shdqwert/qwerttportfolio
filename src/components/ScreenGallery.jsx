import { useCallback, useEffect, useRef, useState } from 'react'
import { useT } from '../content/i18n.jsx'
import { images } from '../content/shared.js'
import { useDialog } from '../lib/dialog.js'
import { useReveal } from '../lib/motion.js'

function Lightbox({ screens, index, onClose, onMove }) {
  const { ui } = useT()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const scrollRef = useRef(null)
  useDialog(true, onClose, panelRef, { initialFocus: closeRef })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onMove])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [index])

  const s = screens[index]
  const im = images[s.img]
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={ui.screenOf(index + 1, screens.length, s.caption)}>
      <div className="lightbox__backdrop" onClick={onClose} />
      <div className="lightbox__panel" ref={panelRef}>
        <div className="lightbox__bar">
          <span className="mono">
            {String(index + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')} · {s.caption}
          </span>
          <div className="lightbox__actions">
            <button type="button" className="btn-small" onClick={() => onMove(-1)} aria-label={ui.prevScreen}>←</button>
            <button type="button" className="btn-small" onClick={() => onMove(1)} aria-label={ui.nextScreen}>→</button>
            <button type="button" className="btn-small" onClick={onClose} ref={closeRef}>{ui.close}</button>
          </div>
        </div>
        <div className="lightbox__scroll" ref={scrollRef} tabIndex={0} aria-label={ui.fullScreenshot}>
          <img src={im.src} width={im.w} height={im.h} alt={s.alt} decoding="async" />
        </div>
      </div>
    </div>
  )
}

// Three real screens; click opens a full-length lightbox.
export default function ScreenGallery({ screens, caption, dark }) {
  const { ui } = useT()
  const [open, setOpen] = useState(null)
  const [ref, cls] = useReveal({ threshold: 0.15 })
  const close = useCallback(() => setOpen(null), [])
  const move = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + screens.length) % screens.length)), [screens.length])

  return (
    <>
      <div className={`screens ${cls}`} ref={ref}>
        {screens.map((s, i) => {
          const im = images[s.img]
          return (
            <figure className="screen" key={s.caption} style={{ '--i': i }}>
              <button type="button" className={`shot screen__shot${dark ? ' is-dark' : ''}`} onClick={() => setOpen(i)} aria-label={ui.viewScreenLabel + s.caption}>
                <img src={im.src} width={im.w} height={im.h} alt={s.alt} loading="lazy" decoding="async" />
                <span className="screen__view" aria-hidden="true">{ui.viewScreen}</span>
              </button>
              <figcaption className="mono screen__caption">{s.caption}</figcaption>
            </figure>
          )
        })}
      </div>
      {caption && <p className="mono screens__credit">{caption}</p>}
      {open !== null && <Lightbox screens={screens} index={open} onClose={close} onMove={move} />}
    </>
  )
}
