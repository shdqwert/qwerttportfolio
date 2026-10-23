// kino page copy — ships in that page's chunk, not the entry bundle.
import type { ImgKey } from '../shared'
import { useT } from '../i18n'

const en = {
  seat: 'Row 02 · Seat kinoqwertt',
  kicker: 'Case 02 · ©2026 · Unofficial redesign concept',
  title: 'kinoqwertt',
  tagline: ['Pick', 'tonight’s', 'film', 'faster than', 'the trailer.'],
  heroAlt: 'kinoqwertt home page: trailer carousel with featured videos',
  viewSite: 'View site ↗',
  media: [
    { no: '01', h: 560, img: 'shots/kinoqwertt-home' as ImgKey, pos: 0, alt: 'Home: trailer carousel and featured videos', cap: 'Home — trailer carousel' },
    { no: '02', h: 560, img: 'shots/kinoqwertt-home' as ImgKey, pos: 22, alt: 'Home: Featured Today and Top Picks rails with ratings', cap: 'Featured today & Top picks' },
    { no: '03', h: 560, img: 'shots/kinoqwertt-home' as ImgKey, pos: 62, alt: 'Home: streaming tabs and weekly box office', cap: 'Streaming tabs & box office' },
    { no: '04', h: 600, img: 'shots/kinoqwertt-title-dune2' as ImgKey, pos: 0, alt: 'Title page for Dune: Part Two with rating and where to watch', cap: 'Title page — Dune: Part Two' },
    { no: '05', h: 560, img: 'shots/kinoqwertt-title-dune2' as ImgKey, pos: 24, alt: 'Title page: cast and user reviews', cap: 'Cast & reviews' },
    { no: '06', h: 560, img: 'shots/kinoqwertt-top250' as ImgKey, pos: 0, alt: 'Top 250 list with genres and filters', cap: 'Top 250 — ranked list' }
  ],
  summary: 'A film database redesign, taken from a Figma file to a live React app: trailers, ratings, title pages, Top 250 and a watchlist.',
  body: 'I built the front end end to end: components, layout, motion and data. Live data comes from the TMDB API — and when the API is unavailable, the site falls back to local data and still renders every section.',
  creditsTitle: 'Credits',
  credits: [['Role', 'Front-end development'], ['Stack', 'React 19 · Vite · GSAP'], ['Styling', 'Plain CSS, no UI kit'], ['Data', 'TMDB API + local fallback'], ['Extras', 'EN / RU · light / dark']] as [string, string][],
  codeLabel: 'from the live build',
  fixedTitle: 'Fixed along the way',
  fixed: ['Header vanished on navigation — fixed the layout structure.', '726 px overflow on 375 px phones — flex children got min-width: 0.'],
  live: 'Open live site ↗',
  repo: 'GitHub ↗',
  caption: 'Unofficial concept. Film titles and posters belong to their owners.'
}

const ru: typeof en = {
  ...en,
  seat: 'Ряд 02 · Место kinoqwertt',
  kicker: 'Кейс 02 · ©2026 · Неофициальный концепт редизайна',
  tagline: ['Выберите', 'фильм', 'на вечер', 'быстрее,', 'чем идёт трейлер.'],
  heroAlt: 'Главная kinoqwertt: карусель трейлеров с подборкой видео',
  viewSite: 'Открыть сайт ↗',
  media: en.media.map((m, i) => ({ ...m, cap: ['Главная — карусель трейлеров', 'Подборки дня и топ', 'Стриминг и сборы', 'Страница фильма — «Дюна: Часть вторая»', 'Актёры и отзывы', 'Топ-250 — рейтинг'][i] })),
  summary: 'Редизайн кинобазы — из Figma-файла в живое React-приложение: трейлеры, рейтинги, страницы фильмов, Топ-250 и «Буду смотреть».',
  body: 'Я сделал фронтенд целиком: компоненты, вёрстку, анимацию и данные. Живые данные приходят из TMDB API — а когда API недоступен, сайт берёт локальные данные и всё равно показывает каждую секцию.',
  creditsTitle: 'Участие',
  credits: [['Роль', 'Фронтенд-разработка'], ['Стек', 'React 19 · Vite · GSAP'], ['Стили', 'Чистый CSS, без UI-кита'], ['Данные', 'TMDB API + локальный запас'], ['Ещё', 'EN / RU · светлая / тёмная']],
  codeLabel: 'из живой сборки',
  fixedTitle: 'Исправлено по пути',
  fixed: ['Шапка пропадала при переходах — исправил структуру вёрстки.', 'Вылет на 726 px на телефонах 375 px — flex-элементам добавил min-width: 0.'],
  live: 'Открыть сайт ↗',
  caption: 'Неофициальный концепт. Названия фильмов и постеры принадлежат правообладателям.'
}

export const useKinoText = () => (useT().lang === 'ru' ? ru : en)
