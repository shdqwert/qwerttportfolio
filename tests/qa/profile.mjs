// CPU profile while wheel-scrolling a route: prints top functions by self time
// (best with an unminified build: `npx vite build --minify false`).
// Usage: node tests/qa/profile.mjs <route> [query]
import { chromium } from '@playwright/test'

const [route = '/', query = ''] = process.argv.slice(2)
const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`http://localhost:4173${route}?nointro${query}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const cdp = await page.context().newCDPSession(page)
await cdp.send('Profiler.enable')
await cdp.send('Profiler.setSamplingInterval', { interval: 200 })
await page.mouse.move(700, 450)
await cdp.send('Profiler.start')
for (let i = 0; i < 90; i++) {
  await page.mouse.wheel(0, 100)
  await page.waitForTimeout(16)
}
const { profile } = await cdp.send('Profiler.stop')
await browser.close()

const dt = {}
profile.samples.forEach((id, i) => (dt[id] = (dt[id] || 0) + (profile.timeDeltas[i] || 0)))
const self = {}
for (const n of profile.nodes) {
  const f = n.callFrame
  const k = `${f.functionName || '(anon)'} ${f.url.split('/').pop()}:${f.lineNumber + 1}`
  self[k] = (self[k] || 0) + (dt[n.id] || 0) / 1000
}
Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log(v.toFixed(1).padStart(8), k))

// inclusive time per function (self + children), app code only
const byId = new Map(profile.nodes.map((n) => [n.id, n]))
const incl = new Map()
const total = (n) => {
  if (incl.has(n.id)) return incl.get(n.id)
  const t = (dt[n.id] || 0) / 1000 + (n.children || []).reduce((a, c) => a + total(byId.get(c)), 0)
  incl.set(n.id, t)
  return t
}
const agg = {}
for (const n of profile.nodes) {
  const f = n.callFrame
  if (!/assets\/(app|CaseQc|Home|Lab|CaseKino|index)/.test(f.url)) continue
  const k = `${f.functionName || '(anon)'} ${f.url.split('/').pop()}:${f.lineNumber + 1}`
  agg[k] = (agg[k] || 0) + total(n)
}
console.log('--- inclusive (app code) ---')
Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 40).forEach(([k, v]) => console.log(v.toFixed(1).padStart(8), k))
