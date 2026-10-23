// Dev check: every `s.className` used in a component must exist in its CSS
// module (an undefined class silently becomes ".undefined" in selectors).
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
let bad = 0
for (const f of walk('src').filter((x) => x.endsWith('.tsx'))) {
  const src = readFileSync(f, 'utf8')
  const m = src.match(/import (\w+) from '(\.[^']+\.module\.css)'/)
  if (!m) continue
  const css = readFileSync(join(dirname(f), m[2]), 'utf8')
  const defined = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((x) => x[1]))
  const used = new Set([...src.matchAll(new RegExp(`\\b${m[1]}\\.([a-zA-Z]\\w*)`, 'g'))].map((x) => x[1]))
  const miss = [...used].filter((u) => !defined.has(u))
  if (miss.length) {
    bad++
    console.log(`${f}: ${miss.join(', ')}`)
  }
}
console.log(bad ? `${bad} file(s) with missing classes` : 'all CSS module classes defined')
process.exit(bad ? 1 : 0)
