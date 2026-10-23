// lab page copy — ships in that page's chunk, not the entry bundle.
import { useT } from '../i18n'

const en = {
  kicker: 'Lab',
  headerNote: '10 switches · every one is real front-end code',
  title: ['Press a button.', 'Watch this page', 'change.'],
  text: 'These aren’t templates or plugins. Each switch is something I build into client sites — parallax, physics, live data, motion. Try one, then hit Reset.',
  reset: 'Reset ↺',
  mode: 'Mode',
  normal: 'Normal',
  switchesLabel: 'Switches',
  stageLabel: 'Live preview',
  reducedNote: ' · reduced motion: end state',
  switches: [
    ['parallax', 'Parallax', 'The page splits into depth layers that move at different speeds.'],
    ['film', 'Film alive', 'Search a film — its poster becomes a 2.5D scene you fly into.'],
    ['gravity', 'Gravity', 'Everything falls. Grab blocks and throw them around.'],
    ['xray', 'X-ray', 'See the grid, boxes, sizes and fonts behind the design.'],
    ['flash', 'Flashlight', 'Lights off. Your cursor becomes a torch.'],
    ['pixel', 'Pixel', 'The whole page turns 8-bit, in the style of my q mark.'],
    ['magnet', 'Magnet', 'Words and buttons lean toward your cursor.'],
    ['glitch', 'Glitch', 'Controlled chaos: RGB split, slices, noise.'],
    ['speed', 'Speed test', 'Live performance numbers of this very page.'],
    ['y1999', '1999', 'My site, if I had made it in 1999.']
  ] as [string, string, string][],
  stage: {
    nav: ['qwertt', 'Work', 'Services', 'About', 'Connect'],
    head: 'Websites people love to use.',
    btn: 'See work ↓',
    imgAlt: 'qwerttclients home page preview',
    cards: ['Restaurants', 'Barbers', 'Hotels']
  },
  parallaxHint: 'scroll or move — layers move at 0.4× · 1× · 1.6×',
  gravityHint: 'Drag anything · it has weight · Space shakes',
  flashHint: 'Move the light · content stays readable to screen readers',
  magnetHint: 'Everything leans toward your cursor',
  glitchHint: 'Signal lost… press Reset to fix',
  speed: {
    title: 'Speed test',
    live: '● measuring live',
    text: 'Measured in your browser, on this page, right now — Navigation Timing + PerformanceObserver.',
    foot: 'Values appear as they are measured · no fake scores',
    labels: ['Time to first byte', 'First contentful paint', 'Largest contentful paint', 'Layout shift (CLS)', 'JS transferred', 'Frames per second']
  },
  y1999: {
    bar: 'qwertt.html - Netscape Navigator',
    marquee: '★ WELCOME TO MY HOMEPAGE!!! ★ BEST VIEWED IN 800×600 ★ SIGN MY GUESTBOOK ★',
    title: '~*~ qwertt’s Web Page ~*~',
    intro: ['I make ', 'websites', '!!! ', 'Click here', ' to see my work.'],
    construction: 'UNDER CONSTRUCTION',
    imgAlt: 'My restaurant project (very pixelated)',
    projects: 'My Projects:',
    list: ['Booking site', 'Movie site', 'My cat'],
    newBadge: 'NEW!',
    counter: 'You are visitor number',
    counterNote: '(a joke counter, not real data)',
    buttons: ['Guestbook', 'E-mail me', 'Webring →'],
    foot: '© 1999 qwertt · Made with Notepad · ',
    back: '(press Reset to come back to 2026)'
  },
  film: {
    kicker: 'Film alive · search any film',
    label: 'Film title',
    placeholder: 'Try “Dune”, “Interstellar”…',
    offline: 'offline demo — local images, no TMDB key',
    text: 'Backdrop, poster and title come from TMDB. The scene is built in 2.5D layers — scroll or move the mouse to fly in.',
    layers: 'layer depth · backdrop −20 · dust −8 · poster +14 · title +22',
    fly: 'scroll ↓ to fly in',
    noResults: 'No films found — try another title.',
    credit: 'This product uses the TMDB API but is not endorsed or certified by TMDB.'
  }
}

const ru: typeof en = {
  ...en,
  kicker: 'Лаборатория',
  headerNote: '10 переключателей · каждый — настоящий фронтенд-код',
  title: ['Нажмите кнопку.', 'Смотрите, как', 'меняется страница.'],
  text: 'Это не шаблоны и не плагины. Каждый переключатель — то, что я встраиваю в сайты клиентов: параллакс, физика, живые данные, анимация. Попробуйте, потом нажмите «Сброс».',
  reset: 'Сброс ↺',
  mode: 'Режим',
  normal: 'Обычный',
  switchesLabel: 'Переключатели',
  stageLabel: 'Живое превью',
  reducedNote: ' · уменьшение движения: конечное состояние',
  switches: [
    ['parallax', 'Параллакс', 'Страница делится на слои глубины, которые движутся с разной скоростью.'],
    ['film', 'Живое кино', 'Найдите фильм — его постер станет 2.5D-сценой, в которую можно влететь.'],
    ['gravity', 'Гравитация', 'Всё падает. Хватайте блоки и бросайте их.'],
    ['xray', 'Рентген', 'Сетка, блоки, размеры и шрифты за дизайном.'],
    ['flash', 'Фонарик', 'Свет выключен. Курсор становится фонариком.'],
    ['pixel', 'Пиксели', 'Вся страница становится 8-битной — в стиле моего знака q.'],
    ['magnet', 'Магнит', 'Слова и кнопки тянутся к курсору.'],
    ['glitch', 'Глитч', 'Управляемый хаос: RGB-сдвиг, нарезка, шум.'],
    ['speed', 'Тест скорости', 'Живые показатели производительности этой самой страницы.'],
    ['y1999', '1999', 'Мой сайт, если бы я сделал его в 1999 году.']
  ],
  stage: {
    nav: ['qwertt', 'Работы', 'Услуги', 'Обо мне', 'Связаться'],
    head: 'Сайты, которыми приятно пользоваться.',
    btn: 'Смотреть работы ↓',
    imgAlt: 'Превью главной qwerttclients',
    cards: ['Рестораны', 'Барберы', 'Отели']
  },
  parallaxHint: 'листайте или двигайте мышь — слои движутся на 0.4× · 1× · 1.6×',
  gravityHint: 'Тащите что угодно · у всего есть вес · пробел — встряхнуть',
  flashHint: 'Двигайте свет · скринридеры видят весь текст',
  magnetHint: 'Всё тянется к курсору',
  glitchHint: 'Сигнал потерян… нажмите «Сброс»',
  speed: {
    title: 'Тест скорости',
    live: '● измеряю вживую',
    text: 'Измерено в вашем браузере, на этой странице, прямо сейчас — Navigation Timing + PerformanceObserver.',
    foot: 'Значения появляются по мере измерения · никаких выдуманных оценок',
    labels: ['Время до первого байта', 'Первая отрисовка контента', 'Крупнейшая отрисовка', 'Сдвиг макета (CLS)', 'Загружено JS', 'Кадров в секунду']
  },
  y1999: {
    ...en.y1999,
    marquee: '★ ДОБРО ПОЖАЛОВАТЬ НА МОЮ ДОМАШНЮЮ СТРАНИЦУ!!! ★ ЛУЧШЕ ВСЕГО В 800×600 ★ ОСТАВЬТЕ ЗАПИСЬ В ГОСТЕВОЙ ★',
    title: '~*~ Страничка qwertt ~*~',
    intro: ['Я делаю ', 'сайты', '!!! ', 'Нажмите здесь', ', чтобы увидеть мои работы.'],
    construction: 'В РАЗРАБОТКЕ',
    imgAlt: 'Мой проект ресторана (очень пиксельный)',
    projects: 'Мои проекты:',
    list: ['Сайт бронирования', 'Сайт про кино', 'Мой кот'],
    newBadge: 'НОВОЕ!',
    counter: 'Вы посетитель номер',
    counterNote: '(шуточный счётчик, не реальные данные)',
    buttons: ['Гостевая', 'Написать мне', 'Веб-кольцо →'],
    foot: '© 1999 qwertt · Сделано в Блокноте · ',
    back: '(нажмите «Сброс», чтобы вернуться в 2026)'
  },
  film: {
    kicker: 'Живое кино · найдите любой фильм',
    label: 'Название фильма',
    placeholder: 'Попробуйте «Дюна», «Интерстеллар»…',
    offline: 'офлайн-демо — локальные картинки, без ключа TMDB',
    text: 'Фон, постер и название берутся из TMDB. Сцена собрана из 2.5D-слоёв — листайте или двигайте мышь, чтобы влететь.',
    layers: 'глубина слоёв · фон −20 · пыль −8 · постер +14 · название +22',
    fly: 'листайте ↓ чтобы влететь',
    noResults: 'Фильмы не найдены — попробуйте другое название.',
    credit: 'Этот продукт использует TMDB API, но не одобрен и не сертифицирован TMDB.'
  }
}

export const useLabText = () => (useT().lang === 'ru' ? ru : en)
