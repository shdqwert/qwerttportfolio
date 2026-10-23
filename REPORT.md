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
- `npm run lint` падает из‑за `src/App.jsx` — старый файл v2, восстановлен не мной, с опечаткой `retur`; сборке не мешает.
- Новой страницы «про отдельные проекты» нет в опубликованном дизайне — нужна ссылка.

## Что заменить вам
Заглушки в `[скобках]` в `src/content/en.ts`, `ru.ts`, `shared.ts` и `src/content/pages/*`: имя, почта, цены, ссылки.

## Запуск
`npm i` → `npm run dev` · сборка `npm run build` → `npm run preview` · тесты `npm test`, `npm run test:e2e`, `npm run test:perf`, `npm run budget`.
