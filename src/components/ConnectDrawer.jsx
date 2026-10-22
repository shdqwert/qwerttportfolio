import { useEffect, useRef, useState } from 'react'
import { useT } from '../content/i18n.jsx'
import { contactInfo, links } from '../content/shared.js'
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
  const { connect: c, owner } = useT()
  const [svc, setSvc] = useState([c.defaultService])
  const [budget, setBudget] = useState(c.defaultBudget)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.company) return // honeypot
    const next = {}
    if (!data.name?.trim()) next.name = c.errName
    if (!EMAIL_RE.test(data.email || '')) next.email = c.errEmail
    setErrors(next)
    if (Object.keys(next).length) {
      form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }
    const brief = { name: data.name.trim(), email: data.email.trim(), services: svc, budget, message: data.message || '' }

    if (!ENDPOINT) {
      const m = c.mail
      const body = `${m.name}: ${brief.name}\n${m.email}: ${brief.email}\n${m.needs}: ${brief.services.join(', ') || '—'}\n${m.budget}: ${brief.budget}\n\n${brief.message}`
      window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(m.subject(brief.name))}&body=${encodeURIComponent(body)}`
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
        <p className="brief-done__title">{c.doneTitle}</p>
        <p className="muted">{c.doneText(owner.replyTime)}</p>
      </div>
    )
  }

  return (
    <form className="brief" onSubmit={submit} noValidate>
      <div className="brief__row">
        <label className="field-wrap">
          <span className="mono muted">{c.nameLabel}</span>
          <input className="field" name="name" type="text" placeholder={c.namePh} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
          {errors.name && <span className="field-err" id="err-name">{errors.name}</span>}
        </label>
        <label className="field-wrap">
          <span className="mono muted">{c.emailField}</span>
          <input className="field" name="email" type="email" placeholder={c.emailPh} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
          {errors.email && <span className="field-err" id="err-email">{errors.email}</span>}
        </label>
      </div>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Chips
        legend={c.needLabel}
        options={c.services}
        isOn={(o) => svc.includes(o)}
        onPick={(o) => setSvc((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]))}
      />
      <Chips legend={c.budgetLabel} options={c.budgets} isOn={(o) => budget === o} onPick={setBudget} />
      <label className="field-wrap">
        <span className="mono muted">{c.messageLabel}</span>
        <textarea className="field field--area" name="message" placeholder={c.messagePh} />
      </label>
      <button type="submit" className="send" disabled={status === 'sending'}>
        {status === 'sending' ? c.sending : ENDPOINT ? c.send : c.sendMail}
      </button>
      {!ENDPOINT && <p className="mono muted brief__note">{c.mailNote}</p>}
      {status === 'error' && (
        <p className="field-err" role="alert">
          {c.errSend(contactInfo.email)}
        </p>
      )}
    </form>
  )
}

const TABS = ['Contact', 'Pricing', 'FAQ']

// F6 — right-side drawer.
export default function ConnectDrawer() {
  const { connect: c, faq, ui } = useT()
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
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label={c.dialog} ref={panelRef} id="connect">
        <div className="drawer__top">
          <div className="tabs" role="tablist" aria-label={c.tabsLabel}>
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
                {c.tabs[t]}
              </button>
            ))}
          </div>
          <button type="button" className="close" onClick={close}>
            {ui.close}
          </button>
        </div>
        <div className="drawer__body" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'Contact' && (
            <>
              <div className="mailcard">
                <div className="mono mailcard__meta">
                  <span>{c.emailLabel}</span>
                  <span>
                    <LiveClock /> · {ui.online}
                  </span>
                </div>
                <div className="mailcard__row">
                  <a className="mailcard__email" href={`mailto:${contactInfo.email}`} ref={emailRef}>
                    {contactInfo.email}
                  </a>
                  <CopyEmail className="copy copy--paper mono" targetRef={emailRef} />
                </div>
                <div className="mailcard__links">
                  <MaybeLink href={links.telegram}>Telegram {contactInfo.telegram}</MaybeLink>
                  <MaybeLink href={links.linkedin}>LinkedIn {contactInfo.linkedin}</MaybeLink>
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
