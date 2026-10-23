import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNav } from '../app/Nav'
import { useT } from '../content/i18n'
import { contactInfo, links } from '../content/shared'
import { gsap, isReduced } from '../motion/engine'
import { CopyEmail, LiveClock, MaybeLink } from './Common'
import { FaqList, PricingCards } from './Shared'
import { useDialog } from './useDialog'
import s from './ConnectDrawer.module.css'

// Optional endpoint (e.g. Formspree). Without it the form opens the visitor's
// email app with the brief pre-filled — and says so. Never fakes "sent".
const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || ''
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Chips({ legend, options, isOn, onPick }: { legend: string; options: string[]; isOn: (o: string) => boolean; onPick: (o: string) => void }) {
  return (
    <fieldset className={s.chipsField}>
      <legend className={`mono ${s.label}`}>{legend}</legend>
      <div className={s.chipsRow}>
        {options.map((o) => (
          <button type="button" key={o} className={`${s.pick} ${isOn(o) ? s.on : ''}`} aria-pressed={isOn(o)} onClick={() => onPick(o)}>
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
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data.company) return // honeypot
    const next: typeof errors = {}
    if (!data.name?.trim()) next.name = c.errName
    if (!EMAIL_RE.test(data.email || '')) next.email = c.errEmail
    setErrors(next)
    const firstErr = Object.keys(next)[0]
    if (firstErr) {
      form.querySelector<HTMLElement>(`[name="${firstErr}"]`)?.focus()
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
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(brief) })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className={s.done} role="status">
        <p className={s.doneTitle}>{c.doneTitle}</p>
        <p className="muted">{c.doneText(owner.replyTime)}</p>
      </div>
    )
  }

  return (
    <form className={s.brief} onSubmit={submit} noValidate data-stagger>
      <div className={s.row2}>
        <label className={s.fieldWrap}>
          <span className={`mono ${s.label}`}>{c.nameLabel}</span>
          <input className={s.field} name="name" type="text" placeholder={c.namePh} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
          {errors.name && <span className={s.err} id="err-name">{errors.name}</span>}
        </label>
        <label className={s.fieldWrap}>
          <span className={`mono ${s.label}`}>{c.emailField}</span>
          <input className={s.field} name="email" type="email" placeholder={c.emailPh} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
          {errors.email && <span className={s.err} id="err-email">{errors.email}</span>}
        </label>
      </div>
      <input className={s.hp} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Chips legend={c.needLabel} options={c.services} isOn={(o) => svc.includes(o)} onPick={(o) => setSvc((v) => (v.includes(o) ? v.filter((x) => x !== o) : [...v, o]))} />
      <Chips legend={c.budgetLabel} options={c.budgets} isOn={(o) => budget === o} onPick={setBudget} />
      <label className={s.fieldWrap}>
        <span className={`mono ${s.label}`}>{c.messageLabel}</span>
        <textarea className={`${s.field} ${s.area}`} name="message" placeholder={c.messagePh} />
      </label>
      <button type="submit" className={s.send} disabled={status === 'sending'}>
        {status === 'sending' ? c.sending : ENDPOINT ? c.send : c.sendMail}
      </button>
      {!ENDPOINT && <p className={`mono muted ${s.note}`}>{c.mailNote}</p>}
      {status === 'error' && (
        <p className={s.err} role="alert">
          {c.errSend(contactInfo.email)}
        </p>
      )}
    </form>
  )
}

const TABS = ['Contact', 'Pricing', 'FAQ'] as const

export default function ConnectDrawer() {
  const { connect: c, faq, ui } = useT()
  const { connectOpen, closeConnect } = useNav()
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Contact')
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)
  const emailRef = useRef<HTMLAnchorElement>(null)
  if (connectOpen && !mounted) setMounted(true)
  const leaving = mounted && !connectOpen

  // open: panel xPercent 100 → 0 (0.75 s), page dims to 62 % and scales .985
  useEffect(() => {
    if (!mounted || leaving) return
    const page = document.getElementById('page')
    if (isReduced()) return
    const tl = gsap.timeline()
    tl.fromTo(panel.current, { xPercent: 104 }, { xPercent: 0, duration: 0.75, ease: 'qw.inOut' })
    tl.fromTo(`.${s.backdrop}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0)
    if (page) tl.to(page, { scale: 0.985, transformOrigin: '50% 30vh', duration: 0.75, ease: 'qw.inOut' }, 0)
    tl.from(panel.current!.querySelectorAll(`.${s.top}, .${s.mail}, .${s.brief} > *, .${s.faqs}`), { y: 18, autoAlpha: 0, duration: 0.5, stagger: 0.05 }, 0.25)
    return () => {
      tl.kill()
    }
  }, [mounted, leaving])

  // close: reverse in 0.5 s, then unmount
  useEffect(() => {
    if (!leaving) return
    const page = document.getElementById('page')
    const done = () => {
      if (page) gsap.set(page, { clearProps: 'transform' })
      setMounted(false)
    }
    if (isReduced()) return done()
    const tl = gsap.timeline({ onComplete: done })
    tl.to(panel.current, { xPercent: 104, duration: 0.5, ease: 'qw.inOut' })
    tl.to(`.${s.backdrop}`, { autoAlpha: 0, duration: 0.4 }, 0)
    if (page) tl.to(page, { scale: 1, duration: 0.5, ease: 'qw.inOut' }, 0)
    return () => {
      tl.kill()
    }
  }, [leaving])

  useDialog(connectOpen && mounted, closeConnect, panel)
  if (!mounted) return null

  return (
    <div ref={root} className={s.drawer}>
      <div className={s.backdrop} onClick={closeConnect} aria-hidden="true" />
      <aside ref={panel} className={s.panel} role="dialog" aria-modal="true" aria-label={c.dialog} id="connect">
        <div className={s.top}>
          <div className={s.tabs} role="tablist" aria-label={c.tabsLabel}>
            {TABS.map((tb) => (
              <button
                key={tb}
                type="button"
                role="tab"
                id={`tab-${tb}`}
                aria-selected={tab === tb}
                aria-controls={`panel-${tb}`}
                tabIndex={tab === tb ? 0 : -1}
                className={`${s.tab} ${tab === tb ? s.tabOn : ''}`}
                onClick={() => setTab(tb)}
                onKeyDown={(e) => {
                  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
                  if (!d) return
                  const n = TABS[(TABS.indexOf(tb) + d + TABS.length) % TABS.length]
                  setTab(n)
                  document.getElementById(`tab-${n}`)?.focus()
                }}
              >
                {c.tabs[tb]}
              </button>
            ))}
          </div>
          <button type="button" className={s.close} onClick={closeConnect}>
            {ui.close}
          </button>
        </div>
        <div className={s.body} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} data-lenis-prevent>
          {tab === 'Contact' && (
            <>
              <div className={s.mail}>
                <div className={`mono ${s.mailMeta}`}>
                  <span>{c.emailLabel}</span>
                  <span>
                    <LiveClock /> · {ui.online}
                  </span>
                </div>
                <div className={s.mailRow}>
                  <a ref={emailRef} className={s.mailEmail} href={`mailto:${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>
                  <CopyEmail className={`copy mono ${s.copy}`} targetRef={emailRef} />
                </div>
                <div className={s.mailLinks}>
                  <MaybeLink href={links.telegram}>Telegram {contactInfo.telegram}</MaybeLink>
                  <MaybeLink href={links.linkedin}>LinkedIn {contactInfo.linkedin}</MaybeLink>
                </div>
              </div>
              <BriefForm />
              <div className={s.faqs}>
                <FaqList items={[faq.items[2], faq.items[1]]} initial={-1} compact />
              </div>
            </>
          )}
          {tab === 'Pricing' && <PricingCards compact />}
          {tab === 'FAQ' && <FaqList items={faq.items} compact />}
        </div>
      </aside>
    </div>
  )
}
