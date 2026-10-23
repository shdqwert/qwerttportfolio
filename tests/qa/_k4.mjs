import { chromium } from '@playwright/test'
const b = await chromium.launch()
for (const start of ['/', '/work/qwerttclients/', '/lab/']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  p.on('pageerror', (e) => console.log('PE', e.message))
  await p.goto('http://localhost:4173' + start + '?nointro', { waitUntil: 'load' })
  await p.waitForTimeout(2500)
  const links = p.locator('footer a, [class*="_footer_"] a').filter({ hasText: /^kinoqwertt$/ })
  const n = await links.count()
  if (!n) { console.log(start, 'no footer link'); await p.close(); continue }
  const l = links.first()
  await l.evaluate((e) => e.scrollIntoView({ block: 'center' }))
  await p.waitForTimeout(1500)
  const box = await l.boundingBox()
  const hit = await p.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + '.' + String(e.className).slice(0, 40) + ' → ' + e.closest('a')?.getAttribute('href') : null }, { x: box.x + box.width / 2, y: box.y + box.height / 2 })
  await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await p.waitForTimeout(3000)
  console.log(start, 'hit', hit, '→', p.url(), await p.evaluate(() => document.querySelector('main h1')?.textContent))
  await p.close()
}
await b.close()
