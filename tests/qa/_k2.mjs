import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: Object.fromEntries([['width', +process.argv[2] || 1440], ['height', 900]]) })
p.on('pageerror', (e) => console.log('PE', e.message))
await p.goto('http://localhost:4173/?nointro', { waitUntil: 'load' })
await p.waitForTimeout(2000)
const btn = p.locator('a.btn-paper[href="/work/kinoqwertt"]')
console.log('count', await btn.count())
for (let i = 0; i < 60; i++) {
  const box = await btn.boundingBox()
  if (box && box.y > 200 && box.y < 700) break
  await p.mouse.wheel(0, 300); await p.waitForTimeout(120)
}
await p.waitForTimeout(1200)
const box = await btn.boundingBox()
const hit = await p.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + '.' + String(e.className).slice(0, 60) + ' in ' + (e.closest('a')?.getAttribute('href')) : null }, { x: box.x + box.width / 2, y: box.y + box.height / 2 })
console.log('box', box, 'hit', hit)
await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
await p.waitForTimeout(3000)
console.log('url', p.url(), await p.evaluate(() => document.querySelector('main h1')?.textContent))
await b.close()
