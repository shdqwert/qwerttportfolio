import { useEffect, useRef, useState } from 'react'
import { connect, faq, links, owner } from '../content/portfolio.js'
import { useDialog } from '../lib/dialog.js'
import { CopyEmail, LiveClock, MaybeLink } from './Common.jsx'
import { useConnect } from './ConnectContext.jsx'
import { FaqList, PricingCards } from './Sections.jsx'

// Optional form endpoint (e.g. Formspree / your own API). Without it the form
// opens the visitor's email app with the brief pre-filled — and says so.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Chips({ legend, options, isOn, onPick }) {
  return (
    <fieldset className="chips-field">
      <legend className="mono muted">{legend}</legend>
      <div className="chips-row">
        {options.map((o) => (
          <button type="button" key={o} className={`pick${isOn(o) ? ' is-on' : ''}`} aria-pressed={isOn(o)} onClick={() => onPick(o)}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function BriefForm() {
  const [svc, setSvc] = useState([connect.defaultService])
  const [budget, setBudget] = useState(connect.defaultBudget)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.company) return // honeypot
    const next = {}
    if (!data.name?.trim()) next.name = 'Please add your name.'
    if (!EMAIL_RE.test(data.email || '')) next.email = 'Please enter a valid email.'
    setErrors(next)
    if (Object.keys(next).length) {
      form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }
    const brief = { name: data.name.trim(), email: data.email.trim(), services: svc, budget, message: data.message || '' }

    if (!ENDPOINT) {
      const body = `Name: ${brief.name}\nEmail: ${brief.email}\nNeeds: ${brief.services.join(', ') || '—'}\nBudget: ${brief.budget}\n\n${brief.message}`
      window.location.href = `mailto:${owner.email}?subject=${encodeURIComponent(`Project brief from ${brief.name}`)}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(brief)
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="brief-done" role="status">
        <p className="brief-done__title">Thanks — your brief is in.</p>
        <p className="muted">I’ll reply within {owner.replyTime}.</p>
      </div>
    )
  }

  return (
    <form className="brief" onSubmit={submit} noValidate>
      <div className="brief__row">
        <label className="field-wrap">
          <span className="mono muted">Your name</span>
          <input className="field" name="name" type="text" placeholder="Jane Doe" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
          {errors.name && <span className="field-err" id="err-name">{errors.name}</span>}
        </label>
        <label className="field-wrap">
          <span className="mono muted">Email</span>
          <input className="field" name="email" type="email" placeholder="jane@company.com" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
          {errors.email && <span className="field-err" id="err-email">{errors.email}</span>}
        </label>
      </div>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Chips
        legend="What do you need?"
        options={connect.services}
        isOn={(o) => svc.includes(o)}
        onPick={(o) => setSvc((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]))}
      />
      <Chips legend="Budget" options={connect.budgets} isOn={(o) => budget === o} onPick={setBudget} />
      <label className="field-wrap">
        <span className="mono muted">Tell me about the project</span>
        <textarea className="field field--area" name="message" placeholder="Goals, timeline, links to references…" />
      </label>
      <button type="submit" className="send" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : ENDPOINT ? 'Send brief →' : 'Send brief via email app →'}
      </button>
      {!ENDPOINT && <p className="mono muted brief__note">Opens your email app with the brief filled in.</p>}
      {status === 'error' && (
        <p className="field-err" role="alert">
          Couldn’t send — please try again or write to {owner.email}.
        </p>
      )}
    </form>
  )
}

const TABS = ['Contact', 'Pricing', 'FAQ']

// F6 — right-side drawer.
export default function ConnectDrawer() {
  const { isOpen, close } = useConnect()
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState('Contact')
  const panelRef = useRef(null)
  const emailRef = useRef(null)
  // Stay mounted while the closing animation plays.
  if (isOpen && !mounted) setMounted(true)
  const leaving = mounted && !isOpen

  useEffect(() => {
    if (!leaving) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setMounted(false), reduced ? 0 : 350)
    return () => clearTimeout(t)
  }, [leaving])

  useDialog(isOpen && mounted, close, panelRef)

  if (!mounted) return null

  return (
    <div className={`drawer${leaving ? ' is-leaving' : ''}`}>
      <div className="drawer__backdrop" onClick={close} aria-hidden="true" />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Connect" ref={panelRef} id="connect">
        <div className="drawer__top">
          <div className="tabs" role="tablist" aria-label="Connect sections">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                id={`tab-${t}`}
                aria-selected={tab === t}
                aria-controls={`panel-${t}`}
                tabIndex={tab === t ? 0 : -1}
                className={`tab${tab === t ? ' is-on' : ''}`}
                onClick={() => setTab(t)}
                onKeyDown={(e) => {
                  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
                  if (!d) return
                  const next = TABS[(TABS.indexOf(t) + d + TABS.length) % TABS.length]
                  setTab(next)
                  document.getElementById(`tab-${next}`)?.focus()
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <button type="button" className="close" onClick={close}>
            Close ✕
          </button>
        </div>
        <div className="drawer__body" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'Contact' && (
            <>
              <div className="mailcard">
                <div className="mono mailcard__meta">
                  <span>Email — fastest reply</span>
                  <span>
                    <LiveClock /> · online
                  </span>
                </div>
                <div className="mailcard__row">
                  <a className="mailcard__email" href={`mailto:${owner.email}`} ref={emailRef}>
                    {owner.email}
                  </a>
                  <CopyEmail className="copy copy--paper mono" targetRef={emailRef} />
                </div>
                <div className="mailcard__links">
                  <MaybeLink href={links.telegram}>Telegram {owner.telegram}</MaybeLink>
                  <MaybeLink href={links.linkedin}>LinkedIn {owner.linkedin}</MaybeLink>
                </div>
              </div>
              <BriefForm />
              <FaqList items={[faq.items[2], faq.items[1]]} initial={-1} compact />
            </>
          )}
          {tab === 'Pricing' && <PricingCards compact />}
          {tab === 'FAQ' && <FaqList items={faq.items} compact />}
        </div>
      </aside>
    </div>
  )
}
