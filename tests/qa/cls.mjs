// Layout-shift sources while wheel-scrolling a route (hardware GPU).
// Usage: node tests/qa/cls.mjs <route>
import { chromium } from '@playwright/test'
const route = process.argv[2] || '/'
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.addInitScript(() => {
  window.__shifts = []
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      window.__shifts.push({ v: +e.value.toFixed(4), y: Math.round(scrollY), src: (e.sources || []).map((s) => `${(s.node?.className || s.node?.nodeName || '?').toString().slice(0, 30)} [${Math.round(s.previousRect.y)},${Math.round(s.previousRect.height)}→${Math.round(s.currentRect.y)},${Math.round(s.currentRect.height)}]`).join(' | ') })
  }).observe({ type: 'layout-shift', buffered: true })
})
await p.goto(`http://localhost:4173${route}?nointro`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)
for (let i = 0; i < 200; i++) {
  await p.mouse.wheel(0, 100)
  await p.waitForTimeout(16)
}
const s = await p.evaluate(() => window.__shifts.filter((x) => x.v > 0.001))
console.log(s.length ? s.slice(0, 12).map((x) => `${x.v} @${x.y}: ${x.src}`).join('\n') : 'no shifts')
await b.close()
