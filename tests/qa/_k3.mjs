import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
p.on('pageerror', (e) => console.log('PE', e.message))
await p.goto('http://localhost:4173/?nointro', { waitUntil: 'load' })
await p.waitForTimeout(2000)
await p.mouse.move(700, 450)
const btn = p.locator('a.btn-paper[href="/work/kinoqwertt"]')
for (let i = 0; i < 200; i++) {
  const t = await btn.evaluate((a) => a.getBoundingClientRect().top)
  if (t > 250 && t < 650) break
  await p.mouse.wheel(0, t > 650 ? Math.min(800, t - 400) : -300)
  await p.waitForTimeout(150)
}
await p.waitForTimeout(1500)
const box = await btn.boundingBox()
const hit = await p.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + '.' + String(e.className).slice(0, 50) + ' → ' + e.closest('a')?.getAttribute('href') : null }, { x: box.x + box.width / 2, y: box.y + box.height / 2 })
console.log('box', Math.round(box.y), 'hit', hit)
await p.screenshot({ path: 'reports/kino-btn.png' })
await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
await p.waitForTimeout(3000)
console.log('url', p.url(), await p.evaluate(() => document.querySelector('main h1')?.textContent))
await b.close()
