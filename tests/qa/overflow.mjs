// Lists the outermost elements that stick out past the right edge.
// Usage: node tests/qa/overflow.mjs <width> <route> [scroll]
import { chromium } from '@playwright/test'

const [w = '1440', route = '/', scroll] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: +w, height: 900 } })
await page.goto(`http://localhost:4173${route}?nointro`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
if (scroll) for (let i = 0; i < 14; i++) (await page.mouse.wheel(0, 2000), await page.waitForTimeout(80))
const out = await page.evaluate(() => {
  const W = document.documentElement.clientWidth
  const res = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.right <= W + 1 || r.width === 0) continue
    let p = el.parentElement
    let clipped = false
    while (p && p !== document.body) {
      const o = getComputedStyle(p).overflowX
      if (o !== 'visible' && p.getBoundingClientRect().right <= W + 1) { clipped = true; break }
      p = p.parentElement
    }
    if (clipped) continue
    if (el.parentElement && el.parentElement.getBoundingClientRect().right > W + 1) continue
    res.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)} w=${Math.round(r.width)} pos=${getComputedStyle(el).position}`)
  }
  return { W, sw: document.documentElement.scrollWidth, res: res.slice(0, 20) }
})
console.log(JSON.stringify(out, null, 1))
await browser.close()
