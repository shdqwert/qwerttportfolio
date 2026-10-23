// qc page copy — ships in that page's chunk, not the entry bundle.
import type { ImgKey } from '../shared'
import { useT } from '../i18n'

const en = {
  seat: 'Row 01 · Seat qwerttclients',
  kicker: 'Case 01 · Working product',
  date: 'Tashkent · today, 23 Oct',
  boardLabel: 'Bookings board',
  boardCols: ['Time', 'Place', 'What', 'Status'],
  title: 'qwerttclients',
  pitch: 'A city’s free times on one board. Book anything nearby — no calls.',
  hint: 'Scroll — the board keeps flipping',
  chaptersLabel: 'Chapters',
  chapters: ['Problem', 'The city', 'Five flows', 'System', 'Languages', 'Under the hood', 'Screens', 'Result'],
  problem: {
    kicker: '01 · The problem',
    title: ['Booking shouldn’t take', 'a phone call.'],
    before: 'Before · DMs and calls',
    beforeTime: '2 h 46 min',
    after: 'After · qwerttclients',
    afterTime: 'seconds',
    msgs: [
      { t: 'Hi! Do you have a table for 2 tonight?', at: '17:02 · sent', me: true },
      { t: 'Seen', at: '17:40', seen: true },
      { t: 'Missed call × 3', at: '18:05 – 18:31', missed: true },
      { t: 'Hello? Anyone?', at: '18:52 · sent', me: true },
      { t: 'Sorry, we are full tonight.', at: '19:48' }
    ],
    cardAlt: 'Pasta at Amber restaurant',
    venue: 'Amber',
    instant: 'INSTANT CONFIRMATION',
    venueMeta: 'Restaurant · Italian · Amir Temur St 45 · ★ 4.8',
    slots: ['18:00', '19:00', '20:30 · 1 LEFT'],
    confirmed: 'Table for 2 · 19:00 · Terrace',
    confirmedMeta: 'Confirmed · QW-7K2M9 · reminder 2 h before',
    confirmedIn: 'Confirmed in'
  },
  city: {
    kicker: '02 · The city',
    title: ['15 places. 6 districts.', 'One search.'],
    text: 'Every pin is a real venue from the app’s database, placed by its own latitude and longitude. Search by name, district or “near me” — sorted by real distance.',
    mapLabel: 'Map of Tashkent with 15 venue pins across Mirabad, Yunusabad, Chilanzar, Old City, Mirzo Ulugbek and Shaykhontohur',
    legend: [['Food & drink', 'restaurant'], ['Beauty & health', 'salon'], ['Hotels', 'hotel'], ['Sport & work', 'sport'], ['Events', 'event']] as [string, string][],
    pops: [
      { name: 'Amber', rating: '★ 4.8', meta: 'Mirabad · Amir Temur St 45 · from $25 / guest', img: 'photos/r2-big' as ImgKey, times: ['12:00', '12:30', '13:00'] },
      { name: 'Studio Noir', rating: '★ 4.9', meta: 'Chilanzar · Bunyodkor Ave 3 · haircut $12', img: 'photos/b1-big' as ImgKey, times: ['17:00', '18:30', '20:00'] },
      { name: 'Merion Hotel', rating: '★ 4.7', meta: 'Shaykhontohur · 4-star · from $80 / night', img: 'photos/ho2-big' as ImgKey, times: ['Fri', 'Sat', 'Sun'] }
    ]
  },
  flows: {
    kicker: '03 · Five ways to book',
    title: ['A table is not', 'a hotel room.'],
    text: 'Each category books the way it works in real life — then all five share one checkout, one account and one design system.',
    items: [
      { no: '01', cat: 'Restaurant', title: 'Table & seating', photo: 'photos/r2-big' as ImgKey, photoAlt: 'Restaurant dining room', steps: ['Date & time', 'Party size', 'Terrace, hall or bar'], shot: 'dark/d-flow-amber' as ImgKey, shotAlt: 'Restaurant booking: date, lunch and dinner times' },
      { no: '02', cat: 'Salon', title: 'Service & specialist', photo: 'photos/b1-big' as ImgKey, photoAlt: 'Barbershop interior', steps: ['Service', 'Specialist or “any”', 'Free time'], shot: 'dark/d-flow-studio-noir' as ImgKey, shotAlt: 'Barber booking: services and specialists' },
      { no: '03', cat: 'Hotel', title: 'Dates & room', photo: 'photos/ho2-big' as ImgKey, photoAlt: 'Hotel room', steps: ['Check-in & out', 'Guests', 'Room & extras'], shot: 'dark/d-flow-merion-hotel' as ImgKey, shotAlt: 'Hotel booking: two-month calendar and guests' },
      { no: '04', cat: 'Sport', title: 'Court & duration', photo: 'photos/t1-big' as ImgKey, photoAlt: 'Tennis court', steps: ['Court', 'Day & start', '60 · 90 · 120 min'], shot: 'dark/d-flow-riverside-sports-club' as ImgKey, shotAlt: 'Sports booking: courts, days and durations' },
      { no: '05', cat: 'Event', title: 'Date & tickets', photo: 'photos/j2-big' as ImgKey, photoAlt: 'Jazz stage', steps: ['Show date', 'Ticket type', 'Quantity'], shot: 'dark/d-flow-blue-room-jazz-night' as ImgKey, shotAlt: 'Event booking: show dates and ticket types' }
    ]
  },
  system: {
    kicker: '04 · Design system · night theme',
    title: ['A system, not', '38 separate screens.'],
    tokensLabel: 'Tokens · from the app’s stylesheet',
    typeName: 'Source Sans 3',
    typeScale: '36/40 · 28/32 · 20/24 · 16/24 · 14/20 · 12/16',
    radii: 'radius 3 · 4 · 8',
    compLabel: 'Components · real states',
    buttons: ['Reserve a table', 'Hover', 'Manage booking', 'Disabled'],
    slots: ['18:00', '19:00', '20:30', '21:00'],
    oneLeft: '1 LEFT',
    slotStates: ['available', 'selected', '1 left', 'taken'],
    badges: ['CONFIRMED', 'INSTANT', 'WAITLIST', 'CANCELLED'],
    stepper: ['Service', 'Date & time', 'Confirm'],
    banner: 'Free cancellation until 17:00 — change the time in My bookings.'
  },
  languages: {
    kicker: '05 · Languages & themes',
    title: ['Day or night.', 'English, русский, oʻzbek.'],
    langs: ['EN', 'RU', 'UZ'],
    themes: ['☀ Day', '☾ Night'],
    wipeLabel: 'The same home page in night theme and day theme, split by a diagonal wipe',
    night: '☾ Night',
    day: '☀ Day',
    cards: [
      { img: 'renders/home-uz' as ImgKey, alt: 'Home page in Uzbek: Yaqin atrofdagi hamma narsani bron qiling' },
      { img: 'renders/home-ru' as ImgKey, alt: 'Home page in Russian: Бронируйте всё, что рядом' },
      { img: 'renders/place-dark-ru' as ImgKey, alt: 'Venue page in Russian, night theme' }
    ],
    note: 'Dates, plurals and server messages are translated too'
  },
  engine: {
    kicker: '06 · Under the hood',
    title: ['Not a mockup.', 'It runs.'],
    archLabel: 'Architecture: React single-page app talks to a Fastify API backed by SQLite; shared TypeScript types, dates and pricing are used on both sides',
    boxes: [
      { k: 'Browser', t: 'React 19', d: 'React Router · Vite · i18n · themes' },
      { k: 'API', t: 'Fastify', d: 'zod validation · cookie sessions · 2FA' },
      { k: 'Data', t: 'SQLite', d: 'node:sqlite · seed · bookings' }
    ],
    shared: 'Shared TypeScript',
    sharedNote: 'types · dates · pricing — one source for both sides',
    caps: [
      { t: 'Live availability', d: 'Slots computed per venue, staff and duration' },
      { t: 'No double booking', d: 'Conflicts blocked on the server' },
      { t: 'Waitlist', d: 'Guests notified when a slot frees up' },
      { t: 'Two-step login', d: 'TOTP codes, rate-limited sign-in' },
      { t: 'Calendar export', d: '.ics for every booking' },
      { t: 'Smart search', d: 'Latin and Cyrillic spellings, near me' }
    ]
  },
  strip: {
    kicker: '07 · Screens',
    title: ['Scroll down — the screens', 'slide sideways.'],
    label: 'All key screens',
    items: [
      { img: 'shots/qwerttclients-intro' as ImgKey, cap: 'Scroll-driven intro', alt: 'Intro: categories orbit the logo' },
      { img: 'dark/d-home' as ImgKey, cap: 'Home', alt: 'Home page with search and venues' },
      { img: 'dark/d-search' as ImgKey, cap: 'Search & filters', alt: 'Search results with filters' },
      { img: 'dark/d-place' as ImgKey, cap: 'Venue page', alt: 'Amber venue page' },
      { img: 'dark/d-flow-amber' as ImgKey, cap: 'Restaurant booking', alt: 'Restaurant booking calendar' },
      { img: 'dark/d-business' as ImgKey, cap: 'Owner dashboard', alt: 'Business dashboard' },
      { img: 'renders/place-dark-ru' as ImgKey, cap: 'Night theme · RU', alt: 'Venue page, Russian, night' },
      { img: 'shots/qwerttclients-design-top' as ImgKey, cap: 'Where it started', alt: 'Original design canvas' }
    ]
  },
  result: {
    kicker: '08 · What this means for your project',
    items: [
      ['Design that ships', 'The same person drew the 38 screens and wrote the code — nothing lost in between.'],
      ['Real product logic', 'Availability, conflicts, pricing, waitlists, 2FA — the hard parts, tested.'],
      ['Ready for your market', 'Three languages, two themes, local dates and currencies from day one.']
    ] as [string, string][],
    cta: ['Need bookings,', 'not calls?'],
    talk: 'Let’s talk',
    screens: 'Open all 38 design screens ↗',
    credit: 'Venue photos in the app: Unsplash · [live URL]'
  }
}

const ru: typeof en = {
  ...en,
  seat: 'Ряд 01 · Место qwerttclients',
  kicker: 'Кейс 01 · Работающий продукт',
  date: 'Ташкент · сегодня, 23 окт',
  boardLabel: 'Табло бронирований',
  boardCols: ['Время', 'Место', 'Что', 'Статус'],
  pitch: 'Свободное время всего города на одном табло. Бронируйте что угодно рядом — без звонков.',
  hint: 'Листайте — табло продолжает перелистываться',
  chaptersLabel: 'Главы',
  chapters: ['Проблема', 'Город', 'Пять сценариев', 'Система', 'Языки', 'Под капотом', 'Экраны', 'Результат'],
  problem: {
    ...en.problem,
    kicker: '01 · Проблема',
    title: ['Бронирование не должно', 'требовать звонка.'],
    before: 'До · переписки и звонки',
    beforeTime: '2 ч 46 мин',
    after: 'После · qwerttclients',
    afterTime: 'секунды',
    msgs: [
      { t: 'Здравствуйте! Есть столик на двоих на вечер?', at: '17:02 · отправлено', me: true },
      { t: 'Просмотрено', at: '17:40', seen: true },
      { t: 'Пропущенный звонок × 3', at: '18:05 – 18:31', missed: true },
      { t: 'Алло? Есть кто-нибудь?', at: '18:52 · отправлено', me: true },
      { t: 'Извините, сегодня всё занято.', at: '19:48' }
    ],
    cardAlt: 'Паста в ресторане Amber',
    instant: 'МГНОВЕННОЕ ПОДТВЕРЖДЕНИЕ',
    venueMeta: 'Ресторан · итальянская кухня · ул. Амира Темура 45 · ★ 4.8',
    slots: ['18:00', '19:00', '20:30 · 1 МЕСТО'],
    confirmed: 'Столик на 2 · 19:00 · терраса',
    confirmedMeta: 'Подтверждено · QW-7K2M9 · напоминание за 2 ч',
    confirmedIn: 'Подтверждено за'
  },
  city: {
    ...en.city,
    kicker: '02 · Город',
    title: ['15 мест. 6 районов.', 'Один поиск.'],
    text: 'Каждый пин — реальное заведение из базы приложения, поставленное по его собственным широте и долготе. Поиск по названию, району или «рядом» — с сортировкой по реальному расстоянию.',
    mapLabel: 'Карта Ташкента с 15 заведениями в Мирабаде, Юнусабаде, Чиланзаре, Старом городе, Мирзо-Улугбеке и Шайхантахуре',
    legend: [['Еда и напитки', 'restaurant'], ['Красота и здоровье', 'salon'], ['Отели', 'hotel'], ['Спорт и работа', 'sport'], ['События', 'event']],
    pops: [
      { name: 'Amber', rating: '★ 4.8', meta: 'Мирабад · ул. Амира Темура 45 · от $25 / гость', img: 'photos/r2-big', times: ['12:00', '12:30', '13:00'] },
      { name: 'Studio Noir', rating: '★ 4.9', meta: 'Чиланзар · Bunyodkor Ave 3 · стрижка $12', img: 'photos/b1-big', times: ['17:00', '18:30', '20:00'] },
      { name: 'Merion Hotel', rating: '★ 4.7', meta: 'Шайхантахур · 4 звезды · от $80 / ночь', img: 'photos/ho2-big', times: ['Пт', 'Сб', 'Вс'] }
    ]
  },
  flows: {
    kicker: '03 · Пять способов забронировать',
    title: ['Столик — это не', 'номер в отеле.'],
    text: 'Каждая категория бронируется так, как это работает в жизни, — а потом все пять используют одну оплату, один аккаунт и одну дизайн-систему.',
    items: [
      { ...en.flows.items[0], cat: 'Ресторан', title: 'Столик и место', photoAlt: 'Зал ресторана', steps: ['Дата и время', 'Число гостей', 'Терраса, зал или бар'], shotAlt: 'Бронирование ресторана: дата, обед и ужин' },
      { ...en.flows.items[1], cat: 'Салон', title: 'Услуга и мастер', photoAlt: 'Барбершоп', steps: ['Услуга', 'Мастер или «любой»', 'Свободное время'], shotAlt: 'Запись в барбершоп: услуги и мастера' },
      { ...en.flows.items[2], cat: 'Отель', title: 'Даты и номер', photoAlt: 'Номер в отеле', steps: ['Заезд и выезд', 'Гости', 'Номер и опции'], shotAlt: 'Бронирование отеля: календарь на два месяца и гости' },
      { ...en.flows.items[3], cat: 'Спорт', title: 'Корт и длительность', photoAlt: 'Теннисный корт', steps: ['Корт', 'День и начало', '60 · 90 · 120 мин'], shotAlt: 'Бронирование спорта: корты, дни, длительность' },
      { ...en.flows.items[4], cat: 'Событие', title: 'Дата и билеты', photoAlt: 'Сцена джаз-клуба', steps: ['Дата показа', 'Тип билета', 'Количество'], shotAlt: 'Бронирование события: даты и типы билетов' }
    ]
  },
  system: {
    ...en.system,
    kicker: '04 · Дизайн-система · ночная тема',
    title: ['Система, а не', '38 отдельных экранов.'],
    tokensLabel: 'Токены · из стилей приложения',
    radii: 'радиус 3 · 4 · 8',
    compLabel: 'Компоненты · реальные состояния',
    buttons: ['Забронировать столик', 'Наведение', 'Управлять бронью', 'Недоступно'],
    oneLeft: '1 МЕСТО',
    slotStates: ['свободно', 'выбрано', '1 место', 'занято'],
    badges: ['ПОДТВЕРЖДЕНО', 'МГНОВЕННО', 'ЛИСТ ОЖИДАНИЯ', 'ОТМЕНЕНО'],
    stepper: ['Услуга', 'Дата и время', 'Подтверждение'],
    banner: 'Бесплатная отмена до 17:00 — время можно изменить в «Моих бронях».'
  },
  languages: {
    ...en.languages,
    kicker: '05 · Языки и темы',
    title: ['День или ночь.', 'English, русский, oʻzbek.'],
    themes: ['☀ День', '☾ Ночь'],
    wipeLabel: 'Одна и та же главная в ночной и дневной теме, разделённая диагональю',
    night: '☾ Ночь',
    day: '☀ День',
    cards: [
      { img: 'renders/home-uz', alt: 'Главная на узбекском: Yaqin atrofdagi hamma narsani bron qiling' },
      { img: 'renders/home-ru', alt: 'Главная на русском: Бронируйте всё, что рядом' },
      { img: 'renders/place-dark-ru', alt: 'Страница заведения на русском, ночная тема' }
    ],
    note: 'Даты, склонения и сообщения сервера тоже переведены'
  },
  engine: {
    ...en.engine,
    kicker: '06 · Под капотом',
    title: ['Не макет.', 'Оно работает.'],
    archLabel: 'Архитектура: React-приложение обращается к API на Fastify с базой SQLite; общие типы TypeScript, даты и цены используются с обеих сторон',
    boxes: [
      { k: 'Браузер', t: 'React 19', d: 'React Router · Vite · i18n · темы' },
      { k: 'API', t: 'Fastify', d: 'валидация zod · сессии в cookie · 2FA' },
      { k: 'Данные', t: 'SQLite', d: 'node:sqlite · сиды · брони' }
    ],
    shared: 'Общий TypeScript',
    sharedNote: 'типы · даты · цены — один источник для обеих сторон',
    caps: [
      { t: 'Живое расписание', d: 'Слоты считаются по заведению, мастеру и длительности' },
      { t: 'Без двойных броней', d: 'Конфликты блокируются на сервере' },
      { t: 'Лист ожидания', d: 'Гость получает уведомление, когда слот освобождается' },
      { t: 'Вход в два шага', d: 'TOTP-коды, ограничение попыток' },
      { t: 'Экспорт в календарь', d: '.ics для каждой брони' },
      { t: 'Умный поиск', d: 'Латиница и кириллица, «рядом со мной»' }
    ]
  },
  strip: {
    kicker: '07 · Экраны',
    title: ['Листайте вниз — экраны', 'едут вбок.'],
    label: 'Все ключевые экраны',
    items: en.strip.items.map((s, i) => ({ ...s, cap: ['Интро на скролле', 'Главная', 'Поиск и фильтры', 'Страница заведения', 'Бронь ресторана', 'Кабинет владельца', 'Ночная тема · RU', 'С чего всё началось'][i] }))
  },
  result: {
    kicker: '08 · Что это значит для вашего проекта',
    items: [
      ['Дизайн, который доходит до запуска', 'Один и тот же человек нарисовал 38 экранов и написал код — ничего не потерялось.'],
      ['Настоящая логика продукта', 'Доступность, конфликты, цены, лист ожидания, 2FA — сложные части, покрытые тестами.'],
      ['Готово к вашему рынку', 'Три языка, две темы, местные даты и валюты с первого дня.']
    ],
    cta: ['Нужны брони,', 'а не звонки?'],
    talk: 'Обсудим',
    screens: 'Все 38 экранов дизайна ↗',
    credit: 'Фото заведений в приложении: Unsplash · [ссылка на сайт]'
  }
}

export const useQcText = () => (useT().lang === 'ru' ? ru : en)
