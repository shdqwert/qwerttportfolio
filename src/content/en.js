// English copy. Anything in [brackets] is a placeholder the owner must replace —
// it is rendered visibly on the page on purpose. Keep the shape identical to ru.js.

const name = '[Your Name]'

export default {
  lang: 'en',
  meta: {
    title: 'qwertt — Websites people love to use',
    description: 'Designer & frontend developer from Uzbekistan. Websites and web apps that turn visitors into clients — two real case studies: qwerttclients and kinoqwertt.'
  },
  owner: {
    name,
    role: 'Designer & Frontend Developer',
    city: '[City]',
    experience: '[N] years',
    languages: '[RU · EN · UZ]',
    availability: '[Q1 2027]',
    replyTime: '[24 hours]',
    supportDays: '[30]',
    portrait: '[Your portrait · 4:5]',
    bio: '[2–3 sentences: where you’re based, how you started, what you love building.]',
    timeLabel: 'Tashkent'
  },
  nav: [
    { id: 'work', label: 'Work', href: '#work' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Connect', href: '#connect' }
  ],
  ui: {
    skip: 'Skip to content',
    booking: 'Booking',
    langLabel: 'Language',
    copy: 'Click to copy',
    copied: 'Copied ✓',
    placeholderTitle: 'Placeholder — add the URL in src/content/shared.js',
    keepScrolling: ['Keep scrolling — the site moves,', 'the page stays.'],
    viewScreen: 'View screen',
    viewScreenLabel: 'View screen: ',
    screenOf: (i, n, caption) => `Screen ${i} of ${n}: ${caption}`,
    prevScreen: 'Previous screen',
    nextScreen: 'Next screen',
    close: 'Close ✕',
    fullScreenshot: 'Full screenshot, scrollable',
    open: 'Open +',
    shut: 'Close −',
    online: 'online',
    case01: 'Case 01: qwerttclients',
    case02: 'Case 02: kinoqwertt',
    whatYouGet: 'What you get',
    contact: 'Contact',
    questions: 'Questions',
    skipIntro: 'Skip intro →'
  },
  play: {
    label: 'Playground',
    title: 'Break time. Play with pixels.',
    text: 'No business here — just the same 7×7 grid my logo lives on. Draw your own mark, or try to catch the pixel that refuses to be clicked.',
    editorLabel: 'Draw your mark',
    catchLabel: 'Catch the pixel',
    gridLabel: 'Pixel grid, 7 by 7. Arrow keys move, Space toggles a cell.',
    cell: 'Cell',
    codeLabel: 'Your mark as code',
    filled: (n) => `${n} / 49 pixels`,
    presets: { ticket: 'Ticket', film: 'Film' },
    random: 'Random',
    mirror: 'Mirror',
    invert: 'Invert',
    clear: 'Clear',
    score: 'Score',
    time: 'Time',
    best: 'Best',
    pixelLabel: 'The pixel — click to catch it',
    catchTitle: '20 seconds. One pixel. It runs.',
    catchText: 'Get close and it jumps away — but it needs a moment to rest.',
    start: 'Start',
    again: 'Again',
    over: (n) => `${n} caught.`,
    record: 'New personal best — saved in this browser.',
    hint: 'psst… ↑ ↑ ↓ ↓ ← → ← → B A',
    konami: 'Konami code accepted · +30 lives'
  },
  hero: {
    lines: ['Websites people', 'love to use.'],
    lead: 'I design and build websites and web apps that turn visitors into clients — clear, fast and crafted down to the last detail.',
    primary: 'See two case studies ↓',
    secondary: 'Start a project',
    taglineLeft: ['For brands that believe', 'every detail matters.'],
    taglineRight: ['Uzbekistan', 'Remote worldwide'],
    and: 'and',
    previewAlt: 'qwerttclients home page: search for restaurants, salons, hotels and sports with available times'
  },
  values: [
    { title: 'One person, design to code', text: 'You talk to the one who designs and ships it. Nothing gets lost in handover.' },
    { title: 'Built around your goal', text: 'Bookings, leads or sales — every screen is designed to move people to that action.' },
    { title: 'Fast and solid code', text: 'Clean React or Webflow builds, no heavy UI kits, responsive and accessible.' },
    { title: 'Yours to edit', text: 'CMS and a handover call, so your team updates content without me.' }
  ],
  projects: [
    {
      id: 'work',
      theme: 'light',
      mark: 'ticket',
      markFrom: 'q',
      index: 'Case 01 / 02',
      meta: '2026 · Working product — front end, API and database',
      title: 'qwerttclients',
      lead: 'One place to find and book any service — salons, restaurants, fitness, hotels, coworking — with live availability.',
      facts: [
        ['My role', 'UX, UI, design system, full-stack build'],
        ['Front end', 'React 19 · React Router · Vite'],
        ['Back end', 'Fastify API · SQLite · 23 API tests'],
        ['Extras', 'EN · RU · UZ, day / night theme']
      ],
      cards: [
        ['The problem', 'Booking a haircut, a table or a trainer still means calls, DMs and waiting for a reply. Businesses lose clients every time a call goes unanswered.'],
        ['Who it’s for', 'People who want to book in seconds, and small businesses — salons, cafés, studios — that need a full calendar without a front desk.'],
        ['What I built', 'A search-first marketplace with real free times and step-by-step booking — designed, then built as a working app with its own API, plus a dashboard where the owner sees the day.']
      ],
      stage: {
        label: 'Scroll through qwerttclients',
        railLabel: 'Scroll through the real product',
        url: 'qwerttclients.com / Tashkent / Restaurants',
        chapters: [
          { t: 'Search', d: 'Where, date, time, guests — and category tabs. One bar for everything.', img: 'qcHome', alt: 'qwerttclients home page: search for restaurants, salons, hotels and sports' },
          { t: 'Free today', d: 'Each card shows real free times, so people pick a slot before opening a page.', img: 'qcHome', alt: 'qwerttclients home page, scrolled to venues available today' },
          { t: 'Venue page', d: 'Photos, menu, reviews; the booking panel follows you down the page.', img: 'qcAmber', alt: 'Venue page for the restaurant Amber with photo gallery and booking panel' },
          { t: 'Book in steps', d: 'Five category flows: table, salon, hotel, sport, event.', img: 'qcBarber', alt: 'Barber booking: choose a service and a specialist' },
          { t: 'Business view', d: 'Today’s schedule, occupancy and requests in one dashboard.', img: 'qcBusiness', alt: 'Business dashboard with today’s schedule by table and a request to accept' }
        ],
        callouts: [{ text: 'Free times on every card — no dead ends', from: 0.3, to: 0.45, x: '24%', y: '42%' }]
      },
      screensCaption: 'Photos in the app: Unsplash.',
      screens: [
        { img: 'qcAmber', alt: 'Venue page for the restaurant Amber with photo gallery and booking panel', caption: 'Venue page — photo gallery, menu, reviews, free times for the table.' },
        { img: 'qcBarber', alt: 'Barber booking: choose a service and a specialist', caption: 'Barber flow — service and specialist first, then date and time.' },
        { img: 'qcBusiness', alt: 'Business dashboard with today’s schedule by table and a request to accept', caption: 'Owner view — schedule by table, occupancy, requests to accept.' }
      ],
      listTitle: 'Decisions that make it work',
      list: [
        ['Search first, not categories first', 'What + where + when in one bar, so people reach real options in one step.'],
        ['Free slots on every card', 'No dead ends: you see availability before you open a page.'],
        ['A flow for each kind of booking', 'Table and guests, service and specialist, hotel dates and room, sport court, event tickets — five flows, one system.'],
        ['It actually works, end to end', 'Real API and database: live availability, booking, reschedule, cancel, calendar export, owner dashboard — covered by 23 integration tests.']
      ]
    },
    {
      id: 'case-02',
      theme: 'dark',
      mark: 'film',
      markFrom: 'ticket',
      index: 'Case 02 / 02',
      meta: '2026 · Personal project — in development',
      title: 'kinoqwertt',
      lead: 'A redesign concept of a film database, built from a Figma file into a live React app — trailers, ratings, title pages and a watchlist.',
      facts: [
        ['My role', 'Frontend development'],
        ['Stack', 'React 19 · Vite · GSAP · plain CSS'],
        ['Data', 'TMDB API + local fallback'],
        ['Live', 'kinoqwertt.vercel.app ↗', 'https://kinoqwertt.vercel.app']
      ],
      cards: [
        ['The problem', 'Film databases are crowded with ads and links. Deciding what to watch tonight takes longer than the trailer.'],
        ['Who it’s for', 'Movie fans who want to pick fast, read the essentials and keep a watchlist for later.'],
        ['What I built', 'Home with trailer carousel, title page, Top 250, search, watchlist, sign-in and trailer modals — in English and Russian, light and dark.']
      ],
      stage: {
        label: 'Scroll through kinoqwertt',
        railLabel: 'Scroll through the live site',
        url: 'kinoqwertt.vercel.app',
        chapters: [
          { t: 'Trailer hero', d: 'Carousel with featured videos beside it.', img: 'kinoHome', alt: 'kinoqwertt home page with trailer carousel' },
          { t: 'Featured & Top picks', d: 'Horizontal rails of lists, posters and ratings — animated in with GSAP.', img: 'kinoHome', alt: 'kinoqwertt home page scrolled to Featured Today and Top Picks' },
          { t: 'Box office & streaming', d: 'Weekly box office and tabs per streaming service.', img: 'kinoHome', alt: 'kinoqwertt home page scrolled to box office and streaming' },
          { t: 'Title page', d: 'Rating, cast, reviews, storyline, box office and specs.', img: 'kinoDune', alt: 'Title page for Dune: Part Two with rating, cast and where to watch' },
          { t: 'Top 250', d: 'Ranked list with genres, filters and trailers.', img: 'kinoTop', alt: 'Top 250 movies list with filters' }
        ],
        callouts: [{ text: 'Rails animate in with GSAP as you scroll', from: 0.22, to: 0.37, x: '30%', y: '30%' }]
      },
      screensCaption: 'Unofficial redesign concept — not affiliated with IMDb. Posters belong to their owners.',
      screens: [
        { img: 'kinoDune', alt: 'Title page for Dune: Part Two with rating, cast and where to watch', caption: 'Title page — trailer, rating, cast, reviews, box office, specs.' },
        { img: 'kinoTop', alt: 'Top 250 movies list with filters', caption: 'Top 250 — ranked list with filters, genres and trailers.' },
        { img: 'kinoHome', alt: 'Home page hero with trailer carousel', caption: 'Home — trailer carousel with featured videos beside it.' }
      ],
      listTitle: 'How it’s engineered',
      list: [
        ['Never a blank page', 'Live data comes from the TMDB API; if it fails, the site falls back to local data and still renders every section.'],
        ['One accent variable for the whole UI', 'Every highlight reads --movie-accent, so a page can re-colour itself without touching components.'],
        ['Two languages, two themes', 'EN / RU and light / dark, remembered in the browser. No UI kit — plain CSS and GSAP.'],
        ['Bugs found and fixed', 'Header vanishing on navigation; a 726 px overflow on 375 px phones (flex children without min-width: 0).']
      ]
    }
  ],
  qcHelps: {
    title: 'How it helps',
    clientsLabel: 'For clients',
    clients: ['Book in about a minute, any time of day', 'See price, reviews and free times before committing', 'Reminders and easy rescheduling'],
    businessesLabel: 'For businesses',
    businesses: ['Bookings come in while the phone is quiet', 'Automatic reminders to cut no-shows', 'One calendar for every staff member'],
    readCase: 'Read the full case →',
    caseUrl: '[case URL]',
    allScreens: 'Open all 38 screens ↗'
  },
  kinoAside: {
    codeLabel: 'styles · from the live build',
    excerpt: 'excerpt',
    comment: '/* every highlight reads one variable */',
    clientLabel: 'What this shows a client',
    clientText: 'I can take a designer’s Figma file and ship it as a fast, maintainable app — and catch the bugs before your users do.',
    live: 'Open live site ↗',
    repo: 'GitHub ↗'
  },
  compare: {
    label: 'Design → Code',
    title: ['Drag the line.', 'Same layout — now it works.'],
    text: 'Left: the original design canvas. Right: the same screen in the running app, with real photos and live data. Nothing got lost between design and code.',
    builtAlt: 'qwerttclients home page running as the live React app',
    designAlt: 'The same qwerttclients home page as a design canvas',
    aria: 'Compare design and live build',
    valueText: (v) => `${v}% design`,
    designTag: 'Design · canvas',
    builtTag: 'Live build · React + API'
  },
  proof: {
    label: 'Proof, not promises',
    lead: 'Don’t take my word for it. Here are the checks.',
    stats: [
      { value: 23, suffix: '/23', label: 'API tests passing' },
      { value: 3, suffix: '', label: 'languages, one codebase' },
      { value: 189, suffix: ' KB', label: 'whole app JS, gzipped' },
      { value: 6, suffix: ' KB', label: 'all CSS, gzipped' }
    ]
  },
  services: {
    label: 'Services',
    title: 'Every project includes strategy, design, development and motion.',
    items: [
      ['Website Design', 'Structure, art direction and interfaces people enjoy using — from wireframes to a complete Figma design system.'],
      ['Website Development', 'React, Next.js, Astro or Webflow — responsive, fast and with a CMS, keeping every design detail intact.'],
      ['Website Motion', 'Scroll, hover and page transitions with GSAP that make the site feel alive — never at the cost of speed.']
    ],
    discuss: 'Discuss',
    discussAria: (p) => `Discuss the ${p} package`
  },
  pricing: [
    { name: 'One Pager', weeks: '[3–5] weeks', text: 'For focused stories — a launch, a product, a personal brand.', price: 'from [PRICE]', ink: false },
    { name: 'Full Site', weeks: '[6–10] weeks', text: 'For growing brands — multi-page, CMS, booking or catalogue.', price: 'from [PRICE]', ink: true },
    { name: 'Development', weeks: '[2–6] weeks', text: 'You have the Figma — I build it, pixel-accurate and animated.', price: 'from [PRICE]', ink: false }
  ],
  about: {
    label: 'About',
    title: `Hi, I’m ${name}. I care about the last 10% — the part most sites skip.`,
    text: 'I work as a one-person studio, so the person who designs your site is the person who codes it.',
    facts: [
      ['Based in', '[City], Uzbekistan'],
      ['Experience', '[N] years'],
      ['Languages', '[RU · EN · UZ]'],
      ['Time zone', 'GMT+5, EU overlap']
    ],
    process: [
      ['Week 1', 'Discover', 'Goals, audience, scope and a fixed quote.'],
      ['Weeks 2–3', 'Design', 'Key screens first, then the full system.'],
      ['Weeks 4–6', 'Build', 'Live link from day one, weekly updates.'],
      ['Launch', 'Ship & care', 'Speed checks, handover, [30] days support.']
    ],
    stackLabel: 'Tools I use daily',
    stackEdit: '[edit list]'
  },
  faq: {
    title: 'Questions before we start',
    items: [
      { q: 'How long does a website take?', a: 'A one-pager usually takes [3–5] weeks, a full site [6–10]. You get a fixed timeline in the first week, and a live link to watch progress.' },
      { q: 'Can I edit the site myself after launch?', a: '[ANSWER]' },
      { q: 'Do you take development-only projects?', a: '[ANSWER]' },
      { q: 'Do you work with clients abroad?', a: '[ANSWER]' },
      { q: 'How does payment work?', a: '[ANSWER]' }
    ]
  },
  contact: {
    motto: 'When everything looks the same, details make the difference. Always.',
    title: ['Next chapter:', 'your project.'],
    cta: 'Start a project →',
    replies: 'usually replies within'
  },
  footer: {
    sitemap: 'Sitemap',
    channels: 'Channels',
    imprint: 'Imprint',
    privacy: 'Privacy',
    crafted: 'Crafted by'
  },
  connect: {
    tabs: { Contact: 'Contact', Pricing: 'Pricing', FAQ: 'FAQ' },
    tabsLabel: 'Connect sections',
    dialog: 'Connect',
    emailLabel: 'Email — fastest reply',
    services: ['Website design', 'Development', 'Redesign', 'Motion / WebGL', 'Not sure yet'],
    budgets: ['[Range A]', '[Range B]', '[Range C]', 'Let’s discuss'],
    defaultService: 'Website design',
    defaultBudget: '[Range B]',
    nameLabel: 'Your name',
    namePh: 'Jane Doe',
    emailField: 'Email',
    emailPh: 'jane@company.com',
    needLabel: 'What do you need?',
    budgetLabel: 'Budget',
    messageLabel: 'Tell me about the project',
    messagePh: 'Goals, timeline, links to references…',
    errName: 'Please add your name.',
    errEmail: 'Please enter a valid email.',
    sending: 'Sending…',
    send: 'Send brief →',
    sendMail: 'Send brief via email app →',
    mailNote: 'Opens your email app with the brief filled in.',
    errSend: (email) => `Couldn’t send — please try again or write to ${email}.`,
    doneTitle: 'Thanks — your brief is in.',
    doneText: (t) => `I’ll reply within ${t}.`,
    mail: {
      subject: (n) => `Project brief from ${n}`,
      name: 'Name',
      email: 'Email',
      needs: 'Needs',
      budget: 'Budget'
    }
  }
}
