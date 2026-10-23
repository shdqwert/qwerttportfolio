// Visual pass: every route, wheel-scrolled like a person (so pinned and
// scrubbed sections play), viewport screenshots every ~900 px + console log.
// Usage: node tests/qa/shoot.mjs <outDir> [route ...]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] || 'reports/shots'
const ROUTES = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/work/qwerttclients', '/work/kinoqwertt', '/lab']
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const logs = []

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`${route} [${m.type()}] ${m.text().slice(0, 300)}`))
  page.on('pageerror', (e) => logs.push(`${route} [pageerror] ${e.message}`))
  page.on('requestfailed', (r) => logs.push(`${route} [requestfailed] ${r.url()}`))
  await page.goto(`http://localhost:4173${route}${route.includes('?') ? '&' : '?'}nointro`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)
  const name = route.replace(/\W+/g, '_') || 'home'
  await page.mouse.move(700, 450)
  let i = 0
  let lastY = -1
  for (let step = 0; step < 400; step++) {
    const y = await page.evaluate(() => scrollY)
    if (step % 8 === 0) {
      await page.waitForTimeout(500)
      await page.screenshot({ path: `${OUT}/${name}-${String(i++).padStart(2, '0')}.png` })
    }
    await page.mouse.wheel(0, 120)
    await page.waitForTimeout(60)
    const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
    if (y >= max - 2 && lastY === y) break
    lastY = y
  }
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUT}/${name}-end.png` })
  const metrics = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth - innerWidth }))
  console.log(route, JSON.stringify(metrics), 'shots', i)
  await ctx.close()
}
console.log('LOGS:\n' + (logs.join('\n') || 'none'))
await browser.close()
