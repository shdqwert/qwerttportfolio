import { useEffect, useRef, useState } from 'react'
import { nav, owner } from '../content/portfolio.js'
import { clamp, onScrollFrame } from '../lib/motion.js'
import { Roll } from './Common.jsx'
import { ConnectLink, useConnect } from './ConnectContext.jsx'

// Which nav item a section belongs to (scroll-spy).
const SPY = [
  { nav: 'work', from: 'work', to: 'case-02' },
  { nav: 'services', from: 'services', to: 'services' },
  { nav: 'about', from: 'about', to: 'about' },
  { nav: 'contact', from: 'contact', to: 'contact' }
]

export default function SiteHeader() {
  const [active, setActive] = useState(null)
  const [hidden, setHidden] = useState(false)
  const [inverted, setInverted] = useState(false)
  const progressRef = useRef(null)
  const { isOpen } = useConnect()

  useEffect(() => {
    let lastY = window.scrollY
    return onScrollFrame(() => {
      const y = window.scrollY
      const vh = window.innerHeight
      const max = document.documentElement.scrollHeight - vh
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`

      if (Math.abs(y - lastY) > 4) {
        setHidden(y > 200 && y > lastY)
        lastY = y
      }

      const probe = 35
      const ink = [...document.querySelectorAll('[data-theme="ink"]')].some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= probe && r.bottom >= probe
      })
      setInverted(ink)

      const line = vh * 0.35
      let current = null
      for (const s of SPY) {
        const a = document.getElementById(s.from)
        const b = document.getElementById(s.to)
        if (!a || !b) continue
        if (a.getBoundingClientRect().top <= line && b.getBoundingClientRect().bottom > line) current = s.nav
      }
      setActive(current)
    })
  }, [])

  return (
    <>
      <div className={`progress${inverted ? ' is-inverted' : ''}`} aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <header className={`site-header${hidden && !isOpen ? ' is-hidden' : ''}${inverted ? ' is-inverted' : ''}`}>
        <div className="site-header__in">
          <nav aria-label="Main" className="nav">
            {nav.map((item) => {
              const isActive = active === item.id
              const props = {
                className: `navlink${isActive ? ' is-active' : ''}`,
                'aria-current': isActive ? 'true' : undefined
              }
              return item.href === '#connect' ? (
                <ConnectLink key={item.id} {...props}>
                  <Roll>{item.label}</Roll>
                </ConnectLink>
              ) : (
                <a key={item.id} href={item.href} {...props}>
                  <Roll>{item.label}</Roll>
                </a>
              )
            })}
          </nav>
          <div className="site-header__meta">
            <span className="status">
              <span className="status__dot" aria-hidden="true" />
              Booking {owner.availability}
            </span>
            <span className="lang">
              <span aria-current="true" className="lang__on">EN</span>{' '}
              <span className="lang__off" title="Russian version coming soon">RU</span>
            </span>
          </div>
        </div>
      </header>
    </>
  )
}
