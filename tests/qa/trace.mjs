// Records a Chrome trace while wheel-scrolling a route and prints where main-
// thread time went (top event types + top JS functions by self time).
// Usage: node tests/qa/trace.mjs <route> [cpuRate] [query]
import { chromium } from '@playwright/test'
import { mkdirSync, readFileSync } from 'node:fs'

const [route = '/', rate = '1', query = ''] = process.argv.slice(2)
mkdirSync('reports/perf', { recursive: true })
const out = `reports/perf/trace${route.replace(/\W+/g, '_')}x${rate}.json`
const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`http://localhost:4173${route}?nointro${query}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const cdp = await page.context().newCDPSession(page)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +rate })
if (process.env.START) {
  for (let y = 0; y < +process.env.START; y += 400) {
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(1500)
}
await page.mouse.move(700, 450)
await browser.startTracing(page, { path: out, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.stack', 'disabled-by-default-devtools.timeline.invalidationTracking', 'v8.execute', 'blink', 'cc'] })
for (let i = 0; i < +(process.env.STEPS || 90); i++) {
  await page.mouse.wheel(0, 100)
  await page.waitForTimeout(16)
}
await browser.stopTracing()
await browser.close()

const { traceEvents } = JSON.parse(readFileSync(out, 'utf8'))
const main = traceEvents.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain')
const evs = traceEvents.filter((e) => e.ph === 'X' && e.tid === main?.tid && e.pid === main?.pid)
const by = {}
for (const e of evs) by[e.name] = (by[e.name] || 0) + (e.dur || 0) / 1000
console.log('top main-thread events (ms, inclusive):')
Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 14).forEach(([k, v]) => console.log(v.toFixed(1).padStart(9), k))
// JS: FunctionCall events carry the callsite
const fn = {}
for (const e of evs.filter((x) => x.name === 'FunctionCall')) {
  const d = e.args?.data
  const k = `${d?.functionName || "(anon)"} ${String(d?.url || "").split("/").pop()}:${d?.lineNumber}:${d?.columnNumber}`
  fn[k] = (fn[k] || 0) + e.dur / 1000
}
console.log('top FunctionCall sites (ms):')
Object.entries(fn).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log(v.toFixed(1).padStart(9), k))
