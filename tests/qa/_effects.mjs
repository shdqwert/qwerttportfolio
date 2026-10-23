import { chromium } from '@playwright/test'
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4173/work/qwerttclients/?nointro', { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)
const cdp = await p.context().newCDPSession(p)
await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await p.mouse.move(700, 450); await cdp.send('Profiler.start')
for (let i = 0; i < 90; i++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(16) }
const { profile } = await cdp.send('Profiler.stop'); await b.close()
const dt = {}; profile.samples.forEach((id, i) => (dt[id] = (dt[id] || 0) + (profile.timeDeltas[i] || 0)))
const byId = new Map(profile.nodes.map((n) => [n.id, n])); const parent = new Map()
for (const n of profile.nodes) for (const c of n.children || []) parent.set(c, n.id)
const inc = new Map(); const tot = (n) => inc.has(n.id) ? inc.get(n.id) : (inc.set(n.id, (dt[n.id] || 0) / 1000 + (n.children || []).reduce((a, c) => a + tot(byId.get(c)), 0)), inc.get(n.id))
const agg = {}
for (const n of profile.nodes) {
  const f = n.callFrame; if (!f.url || /index-/.test(f.url)) continue
  // only functions whose nearest React ancestor is commitPassiveMountOnFiber
  let q = parent.get(n.id), under = false
  while (q) { const fn = byId.get(q).callFrame.functionName; if (/commitHookEffectListMount|commitPassiveMountOnFiber/.test(fn)) { under = true; break } if (!/index-/.test(byId.get(q).callFrame.url)) break; q = parent.get(q) }
  if (!under) continue
  const k = `${f.functionName || '(anon)'} ${f.url.split('/').pop()}:${f.lineNumber + 1}`
  agg[k] = (agg[k] || 0) + tot(n)
}
Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([k, v]) => console.log(v.toFixed(1).padStart(8), k))
