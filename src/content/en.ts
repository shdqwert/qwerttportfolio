// English copy. Anything in [brackets] is a placeholder the owner must replace —
// it is rendered visibly on purpose. ru.ts must keep exactly the same shape.
import type { ImgKey, MarkName } from './shared'

const name = '[Your Name]'

type Win = { tag: string; imgs: ImgKey[]; w: number; h: number; tilt: number; pos: string }
type FLine = { a: string; win?: Win; note?: string; b?: string; arrow?: boolean }
export type FinaleCfg = { flap: string[]; aria: string; lines: FLine[]; indents: number[] }

export const en = {
  lang: 'en' as 'en' | 'ru',
  meta: {
    home: { title: 'qwertt — Websites people love to use', description: 'Designer & frontend developer from Uzbekistan. Websites and web apps that turn visitors into clients — two real case studies: qwerttclients and kinoqwertt.' },
    qc: { title: 'qwerttclients — case study · qwertt', description: 'A working booking platform: React 19, Fastify, SQLite, 23 API tests, three languages and a night theme.' },
    kino: { title: 'kinoqwertt — case study · qwertt', description: 'An unofficial film-database redesign, built from Figma into a live React + GSAP app.' },
    lab: { title: 'Lab — 10 switches · qwertt', description: 'Press a button and watch the page change: parallax, physics, x-ray, glitch, live speed test and more.' }
  },
  owner: {
    name,
    role: 'Designer & Frontend Developer',
    roleShort: 'Designer & Developer',
    availability: 'FOR PROJECTS',
    replyTime: '24 hours',
    portrait: '[Your portrait · 4:5]',
    bio: '[2–3 sentences: where you’re based, how you started, what you love building.]',
    timeLabel: 'Tashkent'
  },
  nav: [
    { id: 'work', label: 'Work', to: '/#work' },
    { id: 'services', label: 'Services', to: '/#services' },
    { id: 'about', label: 'About', to: '/#about' },
    { id: 'lab', label: 'Lab', to: '/lab' },
    { id: 'connect', label: 'Connect', to: '#connect' }
  ],
  ui: {
    skip: 'Skip to content',
    mainNav: 'Main',
    langLabel: 'Language',
    home: 'qwertt — home',
    gate: 'TIME',
    status: 'STATUS',
    boarding: 'OPEN',
    copy: 'Click to copy',
    copied: 'Copied ✓',
    placeholderTitle: 'Placeholder — add the URL in src/content/shared.ts',
    close: 'Close ✕',
    open: 'Open +',
    shut: 'Close −',
    online: 'online',
    replies: 'usually replies within',
    repliesShort: 'replies within',
    viewScreen: 'View screen: ',
    screenOf: (i: number, n: number, c: string) => `Screen ${i} of ${n}: ${c}`,
    prevScreen: 'Previous screen',
    nextScreen: 'Next screen',
    fullScreenshot: 'Full screenshot, scrollable',
    keepScrolling: ['Scroll or click a chapter —', 'the site moves, the page stays.'],
    seatWork: '← Work',
    breadcrumb: 'Breadcrumb',
    nowBoarding: 'NOW BOARDING',
    row: 'ROW',
    seat: 'Seat',
    skipIntro: 'Skip intro →',
    cursorView: 'VIEW',
    cursorDrag: 'DRAG',
    cursorBoard: 'BOARD →'
  },
  proof: {
    label: 'Proof, not promises',
    lead: 'Don’t take my word for it. Here are the checks.',
    stats: [
      { value: 23, suffix: '/23', label: 'API tests passing' },
      { value: 3, suffix: '', label: 'languages, one codebase' },
      { value: 5, suffix: '', label: 'booking flows, one system' },
      { value: 2, suffix: '', label: 'live products, end to end' }
    ]
  },
  services: {
    label: 'Services',
    title: 'Design, code and motion — one ticket, one person.',
    deckLabel: 'Services as three tickets',
    deckKicker: 'Three tickets · one trip',
    deckTorn: 'torn & stamped',
    admit: 'Admit one',
    stamp: 'INCLUDED',
    cards: [
      { no: '01 / 03', title: 'Website Design', icon: 'q' as MarkName, text: 'Structure, art direction and interfaces people enjoy using.', items: ['UX & page structure', 'Art direction', 'Figma design system', 'Every state, every screen'] },
      { no: '02 / 03', title: 'Development', icon: 'code' as MarkName, text: 'Fast, accessible builds that keep every design detail intact.', items: ['React · Next.js · Astro', 'Webflow + CMS', 'APIs & databases', 'Tests before launch'] },
      { no: '03 / 03', title: 'Motion', icon: 'play' as MarkName, text: 'Scroll, hover and page transitions that make the site feel alive.', items: ['Scroll storytelling', 'Micro-interactions', 'Page transitions', 'Reduced-motion ready'] }
    ],
    discuss: 'Discuss',
    discussAria: (p: string) => `Discuss the ${p} package`
  },
  pricing: [
    { name: 'Landing page', text: 'One strong page for a launch, a product or a personal brand.', ink: false },
    { name: 'Full website', text: 'Multi-page site for a growing brand — CMS, booking or catalogue.', ink: true },
    { name: 'Code only', text: 'You already have the design — I build it pixel-accurate and animated.', ink: false }
  ],
  about: {
    label: 'About',
    title: `Hi, I’m ${name}. I care about the last 10% — the part most sites skip.`,
    text: 'I work as a one-person studio, so the person who designs your site is the person who codes it.',
    facts: [['Based in', '[City], Uzbekistan'], ['Experience', '[N] years'], ['Languages', '[RU · EN · UZ]'], ['Time zone', 'GMT+5, EU overlap']] as [string, string][],
    process: [
      ['01', 'Discover', 'Goals, audience and a clear plan for the project.'],
      ['02', 'Design', 'Key screens first, then the full system.'],
      ['03', 'Build', 'A live link from day one, so you see every step.'],
      ['04', 'Launch', 'Final checks, handover and support after launch.']
    ] as [string, string, string][],
    stackLabel: 'Tools I use daily',
    stackEdit: '[edit list]'
  },
  faq: {
    title: 'Questions before we start',
    label: 'Questions',
    items: [
      { q: 'Can I edit the site myself after launch?', a: 'Yes. Texts and images live in a simple editor, and a short handover call shows your team how to update everything without me.' },
      { q: 'Do you take development-only projects?', a: 'Yes. Send me your Figma file — I build it pixel-accurate, responsive and with smooth animation.' },
      { q: 'Do you work with clients abroad?', a: 'Yes. I work remotely with clients in any country, in English or Russian, and my time zone overlaps with Europe.' },
      { q: 'How do we start?', a: 'Write to me with a few words about your project. I reply within a day and we set up a short call to plan the work.' }
    ]
  },
  contact: {
    label: 'Contact',
    motto: 'Good websites don’t keep people waiting. Neither do I.',
    cta: 'Start a project →',
    telegram: 'Telegram'
  },
  finale: {
    finalCall: 'Final call',
    destination: 'Destination',
    home: <FinaleCfg>{
      flap: ['YOUR LAUNCH', 'NEW SITE', 'APP', 'REDESIGN', 'BOTH'],
      aria: 'Let’s make your next launch land unforgettable — start a project',
      lines: [
        { a: 'Let’s make', win: { tag: 'qwerttclients', imgs: ['dark/d-home', 'dark/d-place', 'dark/d-business'] as ImgKey[], w: 230, h: 112, tilt: -3, pos: 'top' } },
        { note: 'website, app — or both', a: 'your next' },
        { a: 'launch', win: { tag: 'kinoqwertt', imgs: ['shots/kinoqwertt-home', 'shots/kinoqwertt-title-dune2', 'shots/kinoqwertt-top250'] as ImgKey[], w: 230, h: 112, tilt: 3, pos: 'top' }, b: 'lands' },
        { a: 'unforgettable', arrow: true }
      ],
      indents: [110, 360, 40, 300]
    },
    qc: <FinaleCfg>{
      flap: ['BOOKINGS', 'NO CALLS', 'FULL TABLES', 'YOUR LAUNCH', '24/7'],
      aria: 'Your guests book while you rest — start a project',
      lines: [
        { a: 'Your guests', win: { tag: 'real venues', imgs: ['photos/r2-big', 'photos/b1-big', 'photos/f3-s'] as ImgKey[], w: 230, h: 112, tilt: -3, pos: 'top' } },
        { note: '24/7 · no phone tag', a: 'book' },
        { a: 'while you', win: { tag: 'live product', imgs: ['dark/d-home', 'dark/d-search', 'dark/d-business'] as ImgKey[], w: 230, h: 112, tilt: 3, pos: 'top' }, b: 'rest' },
        { a: 'easy.', arrow: true }
      ],
      indents: [80, 380, 30, 320]
    },
    kino: <FinaleCfg>{
      flap: ['PREMIERE', 'OPENING NIGHT', 'FULL HOUSE', 'YOUR LAUNCH', 'ENCORE'],
      aria: 'Your story deserves a premiere night — start a project',
      lines: [
        { a: 'Your story', win: { tag: 'now showing', imgs: ['lab/dune-poster', 'lab/inter-poster', 'lab/incep-poster'] as ImgKey[], w: 150, h: 120, tilt: -3, pos: 'center' } },
        { note: 'film, brand or launch', a: 'deserves' },
        { a: 'a', win: { tag: 'scene', imgs: ['lab/dune-bg', 'lab/inter-bg', 'lab/incep-bg'] as ImgKey[], w: 260, h: 112, tilt: 3, pos: 'center' }, b: 'premiere' },
        { a: 'night.', arrow: true }
      ],
      indents: [80, 380, 30, 320]
    },
    lab: <FinaleCfg>{
      flap: ['PARALLAX', 'X-RAY', 'GRAVITY', 'GLITCH', '1999'],
      aria: 'Pick an effect, I will build it for real — start a project',
      lines: [
        { a: 'Pick an effect', win: { tag: 'lab sample', imgs: ['lab/pixel-r2', 'dark/d-home', 'shots/kinoqwertt-home'] as ImgKey[], w: 230, h: 112, tilt: -3, pos: 'top' } },
        { note: '10 switches above — or your own idea', a: 'I’ll' },
        { a: 'build', win: { tag: 'shipped', imgs: ['lab/dune-poster', 'dark/d-place', 'shots/kinoqwertt-top250'] as ImgKey[], w: 230, h: 112, tilt: 3, pos: 'top' }, b: 'it' },
        { a: 'for real.', arrow: true }
      ],
      indents: [80, 380, 30, 320]
    }
  },
  tickers: {
    home: ['Flight QW-01 · qwerttclients', 'Flight QW-02 · kinoqwertt', 'Design + code, one person', 'Tashkent ↔ worldwide', 'Next: your project', 'Gate open'],
    qc: ['Flight QW-01 · qwerttclients', 'Departed on time', '3 languages', 'Night mode on board', '23/23 tests passed', 'Next stop: your business', 'Gate open'],
    kino: ['Flight QW-02 · kinoqwertt', 'Now showing', 'Top 250 on board', 'EN · RU', 'GSAP in every rail', 'Next screening: yours', 'Gate open'],
    lab: ['Lab · 10 switches', 'Physics on board', 'Live speed test', 'Built by hand', 'Reset with Esc', 'Gate open']
  },
  footer: {
    map: 'Terminal map',
    channels: 'Channels',
    deckLabel: 'Projects deck',
    deck: [
      { img: 'dark/d-home' as ImgKey, cap: 'qwerttclients — Home', no: 'BOARDING PASS · 01' },
      { img: 'shots/kinoqwertt-home' as ImgKey, cap: 'kinoqwertt — Home', no: 'BOARDING PASS · 02' },
      { img: 'dark/d-business' as ImgKey, cap: 'qwerttclients — Business', no: 'BOARDING PASS · 03' }
    ],
    admit: 'ADMIT ONE',
    nextCard: 'Deal next boarding pass',
    seat: 'Seat: yours · Gate: open · Taking new projects',
    tickets: { home: 'Ticket QW-00 · qwerttportfolio', qc: 'Ticket QW-01 · qwerttclients', kino: 'Ticket QW-02 · kinoqwertt', lab: 'Ticket QW-03 · lab' },
    top: 'Back to top ↑',
    imprint: 'Imprint',
    privacy: 'Privacy',
    stamped: `Built & stamped by ${name}`,
    links: { home: 'Home', work: 'Work', services: 'Services', about: 'About', lab: 'Lab', connect: 'Connect', qc: 'qwerttclients', kino: 'kinoqwertt' }
  },
  nextDepartures: {
    label: 'Next departures',
    boarding: 'BOARDING',
    gateOpen: 'GATE OPEN',
    open: 'this spot is open',
    your: 'Your',
    project: 'project'
  },
  play: {
    label: 'Playground',
    title: 'Break time. Play with pixels.',
    text: 'No business here — just the same 7×7 grid my logo lives on. Punch your own mark, or try to catch the hole that refuses to be clicked.',
    editorLabel: 'Punch your mark',
    catchLabel: 'Catch the hole',
    gridLabel: 'Punch grid, 7 by 7. Arrow keys move, Space toggles a hole.',
    cell: 'Hole',
    codeLabel: 'Your mark as code',
    filled: (n: number) => `${n} / 49 holes`,
    presets: { ticket: 'Ticket', film: 'Film' },
    random: 'Random',
    mirror: 'Mirror',
    invert: 'Invert',
    clear: 'Clear',
    score: 'Score',
    time: 'Time',
    best: 'Best',
    pixelLabel: 'The hole — click to catch it',
    catchTitle: '20 seconds. One hole. It runs.',
    catchText: 'Get close and it jumps away — but it needs a moment to rest.',
    start: 'Start',
    again: 'Again',
    over: (n: number) => `${n} caught.`,
    record: 'New personal best — saved in this browser.',
    hint: 'psst… ↑ ↑ ↓ ↓ ← → ← → B A',
    konami: 'Konami code accepted · +30 lives'
  },
  intro: {
    status: 'Design · Frontend · Portfolio',
    brand: 'qwertt · portfolio © 2026',
    hint: 'Scroll to start the show',
    presents: 'A portfolio premiere',
    leader: 'Reel 01 · Picture start'
  },
  transition: {
    home: 'NOW BOARDING · ROW 00 · HOME',
    qc: 'NOW BOARDING · ROW 01 · QWERTTCLIENTS',
    kino: 'NOW BOARDING · ROW 02 · KINOQWERTT',
    lab: 'NOW BOARDING · ROW 03 · LAB'
  },
  connect: {
    tabs: { Contact: 'Contact', FAQ: 'FAQ' } as Record<'Contact' | 'FAQ', string>,
    tabsLabel: 'Connect sections',
    dialog: 'Connect',
    emailLabel: 'Email — fastest reply',
    services: ['Website design', 'Development', 'Redesign', 'Motion / WebGL', 'Not sure yet'],
    defaultService: 'Website design',
    nameLabel: 'Your name',
    namePh: 'Jane Doe',
    emailField: 'Email',
    emailPh: 'jane@company.com',
    needLabel: 'What do you need?',
    messageLabel: 'Tell me about the project',
    messagePh: 'Goals, ideas, links to references…',
    errName: 'Please add your name.',
    errEmail: 'Please enter a valid email.',
    sending: 'Sending…',
    send: 'Send brief →',
    sendMail: 'Send brief via email app →',
    mailNote: 'Opens your email app with the brief filled in.',
    errSend: (email: string) => `Couldn’t send — please try again or write to ${email}.`,
    doneTitle: 'Thanks — your brief is in.',
    doneText: (t: string) => `I’ll reply within ${t}.`,
    mail: { subject: (n: string) => `Project brief from ${n}`, name: 'Name', email: 'Email', needs: 'Needs' }
  }
}

export type Content = typeof en
