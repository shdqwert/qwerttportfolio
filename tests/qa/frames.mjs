// Frame time vs scroll position: wheel-scrolls a route and prints, per 400 px
// band, the p95/max frame time and which section is at the viewport centre.
// Usage: node tests/qa/frames.mjs <route> [cpuRate] [query]
import { chromium } from '@playwright/test'

const [route = '/', rate = '1', query = ''] = process.argv.slice(2)
const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`http://localhost:4173${route}?nointro${query}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(+(process.env.SETTLE || 1200))
if (process.env.CSS) await page.addStyleTag({ content: process.env.CSS })
const cdp = await page.context().newCDPSession(page)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +rate })
await page.mouse.move(700, 450)
await page.evaluate(() => {
  const w = window
  w.__f = []
  let last = performance.now()
  const tick = (t) => {
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
    const sec = el?.closest('section, footer, [id]')
    w.__f.push([t - last, scrollY, (sec?.id || String(sec?.className || sec?.tagName || '')).slice(0, 28)])
    last = t
    if (!w.__stop) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
for (let i = 0; i < 400; i++) {
  await page.mouse.wheel(0, 100)
  await page.waitForTimeout(16)
  if (i % 25 === 0 && (await page.evaluate(() => scrollY >= document.documentElement.scrollHeight - innerHeight - 2))) break
}
const f = await page.evaluate(() => ((window.__stop = true), window.__f.slice(2)))
await browser.close()
const bands = {}
for (const [d, y, s] of f) {
  const b = Math.floor(y / 400) * 400
  ;(bands[b] ??= { d: [], s: {} }).d.push(d)
  bands[b].s[s] = (bands[b].s[s] || 0) + 1
}
for (const [b, { d, s }] of Object.entries(bands)) {
  d.sort((x, y) => x - y)
  const p95 = d[Math.floor(d.length * 0.95)]
  const top = Object.entries(s).sort((x, y) => y[1] - x[1])[0][0]
  console.log(String(b).padStart(6), `n=${String(d.length).padStart(3)} p95=${p95.toFixed(1).padStart(5)} max=${d.at(-1).toFixed(0).padStart(4)}`, p95 > 18 ? '◀' : ' ', top)
}
