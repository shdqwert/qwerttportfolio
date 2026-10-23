# Отчёт — qwerttportfolio v3 (ветка `v3-ticket`)

## Что сделано
- Стиль «посадочный талон»: Home, `/work/qwerttclients`, `/work/kinoqwertt`, `/lab`, панель Connect — на EN и RU (`/ru/...`).
- Интро‑табло, переходы между страницами («gate change»), GSAP + Lenis, свет L1–L10 (`?light=off` выключает), Lab с 10 режимами, Playground, Konami.
- Пререндер всех 8 страниц: контент виден без JS.

## Проверки (локально, production‑сборка)
| Проверка | Результат |
|---|---|
| typecheck, build, unit‑тесты (Vitest, 11) | проходят |
| e2e Playwright: Chromium / Firefox / WebKit | 93 из 94; тест лайтбокса в WebKit нестабилен при параллельном запуске (отдельно проходит) |
| axe (доступность) | 0 serious/critical на 8 страницах |
| Lighthouse desktop | главная 90, кейс qwerttclients 93; Accessibility 95–96; Best Practices 100 |
| Начальный JS | все 8 страниц ≤ 180 KB gzip (`npm run budget`) |
| Прокрутка, обычный CPU | p95 кадра 16.7 мс на всех страницах; CLS < 0.02 |
| Прокрутка, 4× медленный CPU | kino и Lab проходят (≤ 34 мс); главная ~50 мс, qwerttclients ~67 мс — не проходит |
| Reduced motion, без JS, телефон 375 px | проходят |

## Не сделано / ограничения
- Изучение чужих сайтов (шаг A) не делалось — вы отклонили запуск.
- Видео‑ревью кадров (ffmpeg) не делалось.
- На странице qwerttclients есть 2 кадра дольше 50 мс при обычном CPU.
- TMDB в Lab работает в офлайн‑режиме (локальные картинки), ключа нет.
- Удалён сломанный старый `src/App.jsx` (v2, с опечаткой); при необходимости восстанавливается из git.
- Новой страницы «про отдельные проекты» нет в опубликованном дизайне — нужна ссылка.

## Что заменить вам
Заглушки в `[скобках]` в `src/content/en.ts`, `ru.ts`, `shared.ts` и `src/content/pages/*`: имя, почта, цены, ссылки.

## Запуск
`npm i` → `npm run dev` · сборка `npm run build` → `npm run preview` · тесты `npm test`, `npm run test:e2e`, `npm run test:perf`, `npm run budget`.

## F27 «Boarding flight» — кейсы kinoqwertt и qwerttclients
Сделано по `handoff/TASK_F27_BOARDING_FLIGHT.md`: компонент `src/components/BoardingFlight.tsx` (+ `FlightStart.tsx`, тексты EN/RU в `src/content/pages/flight.ts`).
- Маленькое превью с тегом `Row · Seat` и чипом стартует в hero (kino — на месте старого превью; qwerttclients — новая секция 1b под табло с подсказкой «Watch it work — scroll ↓») и по скроллу (scrub 1, FLIP по реальным слотам, пересчёт в `onRefresh`) летит в тёмный «мат» посадки, увеличиваясь до 1248×780.
- В полёте наклон `rotateX 5° / rotateY −6° / rotateZ −1.4°` к середине и обратно + наклон от скорости скролла (±4°, пружинит обратно; отдельная внутренняя обёртка). Оранжевая линия пути рисуется и гаснет, sheen проходит по карточке.
- Чип SplitFlap: Boarding → In flight → Landed (и обратно при скролле вверх); штамп «BOARDED ✓» (qw.snap) при посадке.
- Внутри — настоящая запись экрана (`public/assets/video/*.mp4`, muted, loop, playsinline); `play()` только в пределах экрана, иначе `pause()`.
- Reduced motion / < 1024 px / coarse pointer: без полёта, карточка сразу в мате, постер + кнопка «Play ▶», штамп показан, путь и подсказка скрыты.

**Проверка (записью, не на глаз)** — `tests/qa/flight-video.mjs`: видео Playwright 1440×900 (медленно вниз → вверх → быстро), лог состояния каждые 100 мс, кадры каждые 100 мс через ffmpeg.
- Файлы: `reports/videos/{kino,qc}/*.webm`, кадры `reports/frames/{kino,qc}/`, лог `reports/flight-{kino,qc}.json`.
- Траектория: старт kino 648×343 (ширина 760) → посадка 96 (1248); qwerttclients 988 (420) → 96 (1248); путь непрерывный, без скачков на старте и посадке.
- Чип и штамп верны в обе стороны; видео играет во время полёта и на посадке (`currentTime` растёт), на паузе вдали.
- Reduced motion: `reports/flight-reduced-{kino,qc}.png` — карточка на месте, Play, штамп, пути нет.
- Плавность: kinoqwertt — p95 16.7 мс, 0 кадров > 50 мс, CLS 0.007; при 4× CPU p95 33 мс (проходит). qwerttclients — p95 16.8 мс, CLS 0.010; 3 кадра > 50 мс и p95 66 мс при 4× CPU — их дают табло вверху страницы и другие секции, не полёт (в зоне полёта 16.7–16.8 мс, замер в Chrome с играющим видео).
- e2e Chromium 37/37, axe без серьёзных нарушений, бюджет JS ≤ 180 KB на всех 8 страницах.
- Важно: Playwright‑Chromium не умеет H.264, поэтому видео проверялось в установленном Chrome (`channel: 'chrome'`). Все реальные браузеры MP4/H.264 играют.
- Опциональный полёт на главной (hero → сцена F1) не делался.
